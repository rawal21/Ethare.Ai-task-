import * as taskService from "./task.service";
import type { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { createResponse } from "@/common/helper/response.helper";

export const createTask = expressAsyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id as string;
  const taskData = req.body;

  const role = String(req.user?.role || "");
  console.log("DEBUG: Controller passing role:", role);

  const task = await taskService.createTask({
    ...taskData,
    createdBy: userId,
    role,
  });

  let message = "Task created successfully";
  if (!taskData.deadline) {
    message += " (Warning: No deadline specified)";
  }

  res.status(201).json(createResponse(task, message));
});

export const getTasks = expressAsyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id as string;
  const role = req.user?.role as string;
  const { projectId, assignedTo, status, search } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const tasks = await taskService.getTasks(
    userId,
    role,
    projectId as string,
    assignedTo as string,
    status as string,
    search as string,
    page,
    limit
  );

  res.json(createResponse(tasks, "Tasks fetched successfully"));
});

export const updateTaskStatus = expressAsyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id as string;
  const role = req.user?.role as string;
  const taskId = req.params.id as string;

  const task = await taskService.updateTaskStatus(taskId, userId, role, req.body);
  res.json(createResponse(task, "Task status updated successfully"));
});

export const deleteTask = expressAsyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id as string;
  const result = await taskService.deleteTask(req.params.id as string, userId, req.user?.role as string);
  res.json(createResponse(null, result.message));
});
