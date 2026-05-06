import { Project } from "./project.schema";
import { CreateProjectDto, UpdateProjectDto } from "./project.dto";
import { Task } from "../task/task.schema";
import createHttpError from "http-errors";

export const createProject = async (data: CreateProjectDto & { createdBy: string }) => {
  // Ensure creator is always a member and members are unique
  const membersSet = new Set(data.members || []);
  membersSet.add(data.createdBy);
  const uniqueMembers = [...membersSet];
  
  const project = await Project.create({
    ...data,
    members: uniqueMembers,
  });
  return project;
};

export const getProjectsForUser = async (userId: string, role: string, page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  let query = {};

  if (role === "admin") {
    // Admin sees projects they created OR are members of
    query = { $or: [{ createdBy: userId }, { members: userId }] };
  } else {
    // Member sees projects they are members of
    query = { members: userId };
  }

  const projects = await Project.find(query)
    .populate("createdBy members", "name email")
    .skip(skip)
    .limit(limit);

  const total = await Project.countDocuments(query);

  return {
    data: projects,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProjectById = async (id: string, userId: string, role: string) => {
  const project = await Project.findById(id).populate("createdBy members", "name email");
  
  if (!project) {
    throw createHttpError(404, "Project not found");
  }

  // Check if user is creator or member (Admins already bypass this via their role in the controller, but we check here too for safety)
  const isCreator = project.createdBy.toString() === userId;
  const isMember = project.members.some((m) => m.toString() === userId);

  if (!isCreator && !isMember && role !== "admin") {
    throw createHttpError(403, "You do not have permission to access this project");
  }

  return project;
};

export const updateProject = async (
  id: string,
  userId: string,
  role: string,
  data: UpdateProjectDto
) => {
  const project = await Project.findById(id);
  if (!project) {
    throw createHttpError(404, "Project not found");
  }

  // Only creator or any admin can update
  if (project.createdBy.toString() !== userId && role !== "admin") {
    throw createHttpError(403, "You do not have permission to modify this project");
  }

  // Handle unique members if provided
  let updatedMembers = project.members.map((m) => m.toString());
  if (data.members) {
    updatedMembers = [...new Set(data.members)];
  }

  const updatedProject = await Project.findByIdAndUpdate(
    id,
    { ...data, members: updatedMembers },
    { new: true }
  ).populate("createdBy members", "name email");

  return updatedProject;
};

export const deleteProject = async (id: string, userId: string, role: string) => {
  const project = await Project.findById(id);
  if (!project) {
    throw createHttpError(404, "Project not found");
  }

  // Only creator or any admin can delete
  if (project.createdBy.toString() !== userId && role !== "admin") {
    throw createHttpError(403, "You do not have permission to delete this project");
  }

  // Cascade delete tasks
  await Task.deleteMany({ projectId: id });

  await Project.findByIdAndDelete(id);
  return { message: "Project and associated tasks deleted successfully" };
};

export const addMember = async (id: string, userId: string, requesterId: string, requesterRole: string) => {
  const project = await Project.findById(id);
  if (!project) throw createHttpError(404, "Project not found");
  if (project.createdBy.toString() !== requesterId && requesterRole !== "admin") {
    throw createHttpError(403, "Access denied");
  }

  if (project.members.map(m => m.toString()).includes(userId)) {
    throw createHttpError(400, "User is already a member");
  }

  project.members.push(userId as any);
  await project.save();
  return project.populate("createdBy members", "name email");
};

export const removeMember = async (id: string, userId: string, requesterId: string, requesterRole: string) => {
  const project = await Project.findById(id);
  if (!project) throw createHttpError(404, "Project not found");
  if (project.createdBy.toString() !== requesterId && requesterRole !== "admin") {
    throw createHttpError(403, "Access denied");
  }
  
  if (project.createdBy.toString() === userId) {
    throw createHttpError(400, "Cannot remove project owner");
  }

  project.members = project.members.filter(m => m.toString() !== userId) as any;
  await project.save();
  return project.populate("createdBy members", "name email");
};
