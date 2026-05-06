import * as projectService from "./project.service";
import type { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { createResponse } from "@/common/helper/response.helper";
import { CreateProjectDto, UpdateProjectDto } from "./project.dto";

export const createProject = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id as string;
    const projectData: CreateProjectDto = req.body;

    const project = await projectService.createProject({
      ...projectData,
      createdBy: userId,
    });
    res.status(201).json(createResponse(project, "Project created successfully"));
  }
);

export const getProjects = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id as string;
    const role = req.user?.role as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const projects = await projectService.getProjectsForUser(userId, role, page, limit);
    res.json(createResponse(projects, "Projects fetched successfully"));
  }
);

export const getProjectById = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id as string;
    const role = req.user?.role as string;
    
    const project = await projectService.getProjectById(req.params.id as string, userId, role);
    res.json(createResponse(project, "Project fetched successfully"));
  }
);

export const updateProject = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id as string;
    const projectData: UpdateProjectDto = req.body;

    const project = await projectService.updateProject(
      req.params.id as string,
      userId,
      req.user?.role as string,
      projectData
    );
    res.json(createResponse(project, "Project updated successfully"));
  }
);

export const deleteProject = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id as string;
    const result = await projectService.deleteProject(req.params.id as string, userId, req.user?.role as string);
    res.json(createResponse(null, result.message));
  }
);

export const addMember = expressAsyncHandler(async (req: Request, res: Response) => {
  const requesterId = req.user?._id as string;
  const requesterRole = req.user?.role as string;
  const { userId } = req.body;
  const project = await projectService.addMember(req.params.id as string, userId, requesterId, requesterRole);
  res.json(createResponse(project, "Member added successfully"));
});

export const removeMember = expressAsyncHandler(async (req: Request, res: Response) => {
  const requesterId = req.user?._id as string;
  const requesterRole = req.user?.role as string;
  const { userId } = req.body;
  const project = await projectService.removeMember(req.params.id as string, userId, requesterId, requesterRole);
  res.json(createResponse(project, "Member removed successfully"));
});
