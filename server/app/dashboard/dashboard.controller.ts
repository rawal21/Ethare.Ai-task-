import * as dashboardService from "./dashboard.service";
import type { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { createResponse } from "@/common/helper/response.helper";

export const getDashboard = expressAsyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id as string;
  const role = req.user?.role as string;

  const stats = await dashboardService.getDashboardStats(userId, role);

  res.json(createResponse(stats, "Dashboard statistics fetched successfully"));
});
