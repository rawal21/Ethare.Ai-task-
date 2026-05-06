import { Task } from "./task.schema";
import { Project } from "../project/project.schema";
import { user as User } from "../user/user.schema";
import { CreateTaskDto, UpdateTaskStatusDto } from "./task.dto";
import createHttpError from "http-errors";
import { logger } from "@/common/helper/logger.helper";

export const createTask = async (data: CreateTaskDto & { createdBy: string; role: string }) => {
  const project = await Project.findById(data.projectId);

  if (!project) {
    throw createHttpError(404, "Project not found");
  }

  // 1. Check if Admin (Global Access)
  const isAdmin = String(data.role || "").toLowerCase() === "admin";
  
  if (isAdmin) {
    console.error(`>>> ADMIN ACCESS GRANTED for user ${data.createdBy}`);
  } else {
    // 2. Check if Creator or Member
    const isCreator = project.createdBy.toString() === data.createdBy;
    const isMember = project.members.some(m => m.toString() === data.createdBy);

    console.error(`>>> MEMBER CHECK: isCreator=${isCreator}, isMember=${isMember} for user ${data.createdBy}`);

    if (!isCreator && !isMember) {
      throw createHttpError(403, "You do not have permission to add tasks to this project (CODE:NOT_AUTHORIZED)");
    }
  }

  // Ensure assignedTo is a member of the project
  const assignedUser = await User.findById(data.assignedTo);
  const isAssignedAdmin = assignedUser?.role === "admin";
  const isOwner = project.createdBy.toString() === data.assignedTo;

  if (isAssignedAdmin || isOwner) {
    throw createHttpError(400, "Cannot assign tasks to project owners or administrators");
  }

  if (!project.members.some(m => m.toString() === data.assignedTo)) {
    throw createHttpError(400, "Assigned user is not a member of the project");
  }

  // Ensure deadline is not in the past
  if (data.deadline && new Date(data.deadline) < new Date(new Date().setHours(0,0,0,0))) {
    throw createHttpError(400, "Deadline cannot be in the past");
  }
  
  const task = await Task.create(data);
  return task;
};

export const getTasks = async (
  userId: string,
  role: string,
  projectId?: string,
  assignedTo?: string,
  status?: string,
  search?: string,
  page: number = 1,
  limit: number = 10
) => {
  const query: any = {};
  const skip = (page - 1) * limit;
  
  if (projectId) query.projectId = projectId;
  if (assignedTo) query.assignedTo = assignedTo;
  if (status) query.status = status;
  if (search) query.title = { $regex: search, $options: "i" };

  if (role === "admin") {
    // Admins only see tasks from projects they own or are part of
    const projects = await Project.find({
      $or: [{ createdBy: userId }, { members: userId }],
    }).select("_id");
    const projectIds = projects.map((p) => p._id.toString());
    
    if (projectId) {
      if (!projectIds.includes(projectId)) {
        return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
      }
      query.projectId = projectId;
    } else {
      query.projectId = { $in: projectIds };
    }
  } else {
    // Members see tasks in projects they are a member of, but ONLY tasks assigned to them
    const projects = await Project.find({ members: userId }).select("_id");
    const projectIds = projects.map((p) => p._id.toString());
    
    if (projectId) {
      if (!projectIds.includes(projectId)) {
        return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
      }
      query.projectId = projectId;
    } else {
      query.projectId = { $in: projectIds };
    }
    
    query.assignedTo = userId; // Strict isolation for members
  }

  const tasks = await Task.find(query)
    .populate("projectId assignedTo createdBy", "title name email")
    .skip(skip)
    .limit(limit);

  const total = await Task.countDocuments(query);

  return {
    data: tasks,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateTaskStatus = async (
  taskId: string,
  userId: string,
  role: string,
  data: UpdateTaskStatusDto
) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw createHttpError(404, "Task not found");
  }

  const normalizedRole = role.toLowerCase();
  if (normalizedRole === "member") {
    // Member can only update tasks assigned to them
    if (task.assignedTo.toString() !== userId.toString()) {
      console.error(`>>> STATUS_UPDATE_FAILED: task.assignedTo=${task.assignedTo}, userId=${userId}`);
      throw createHttpError(403, "You can only update tasks assigned to you");
    }
  } else if (normalizedRole === "admin") {
     // Admin can update any task in projects they manage
     const project = await Project.findById(task.projectId);
     const isCreator = project?.createdBy.toString() === userId.toString();
     const isMember = project?.members.some(m => m.toString() === userId.toString());
     
     console.error(`>>> ADMIN_STATUS_CHECK: user=${userId.toString()}, creator=${project?.createdBy.toString()}, project=${task.projectId}, isCreator=${isCreator}, isMember=${isMember}`);
     
     if (!isCreator && !isMember) {
        throw createHttpError(403, "You do not have permission to modify tasks in this project (ADMIN_DENIED)");
     }
  }

  task.status = data.status;
  await task.save();
  return task;
};

export const deleteTask = async (taskId: string, userId: string, role: string) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw createHttpError(404, "Task not found");
  }

  // Admin only logic (checked by middleware), but must be owner/member of the project
  const project = await Project.findById(task.projectId);
  const isCreator = project?.createdBy.toString() === userId;
  const isMember = project?.members.some(m => m.toString() === userId);

  if (!isCreator && !isMember && role !== "admin") {
      throw createHttpError(403, "You do not have permission to delete tasks in this project");
  }
  
  if (role === "admin" && !isCreator && !isMember) {
      throw createHttpError(403, "You do not have permission to delete tasks in this project");
  }

  await Task.findByIdAndDelete(taskId);
  return { message: "Task deleted successfully" };
};
