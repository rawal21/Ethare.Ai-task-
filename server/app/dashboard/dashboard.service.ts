import { Task } from "../task/task.schema";
import { Project } from "../project/project.schema";

export const getDashboardStats = async (userId: string, role: string) => {
  let projectIds: any[] = [];

  if (role === "admin") {
    const projects = await Project.find({
      $or: [{ createdBy: userId }, { members: userId }],
    }).select("_id");
    projectIds = projects.map((p) => p._id);
  } else {
    const projects = await Project.find({ members: userId }).select("_id");
    projectIds = projects.map((p) => p._id);
  }

  // Get all tasks user has access to
  const taskQuery: any = { projectId: { $in: projectIds } };
  
  if (role === "member") {
    taskQuery.assignedTo = userId;
  }

  const tasks = await Task.find(taskQuery);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "DONE").length;
  const pendingTasks = tasks.filter((t) => t.status !== "DONE").length;

  const now = new Date();
  const overdueTasks = tasks.filter(
    (t) => t.deadline && t.deadline < now && t.status !== "DONE"
  ).length;

  const myTasksCount = tasks.filter(
    (t) => t.assignedTo.toString() === userId
  ).length;

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    myTasksCount,
  };
};
