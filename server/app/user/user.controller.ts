import * as userService from "./user.service"
import type {Request, Response , NextFunction} from "express";
import expressAsyncHandler from "express-async-handler";
import { createResponse } from "@/common/helper/response.helper";
import createHttpError from "http-errors";

export const getById = expressAsyncHandler(async (req: Request, res: Response , next : NextFunction) => {
  const user = await userService.getById(req.params.id as string);
  if (!user) throw createHttpError(404 , "User not found")
  res.send(createResponse(user.toObject() , "User fetched successfully"))
});

export const getByEmail = expressAsyncHandler(async (req: Request, res: Response , next : NextFunction) => {
    const user = await userService.getByEmail(req.params.email as string);
    if (!user) throw createHttpError(404 , "User not found")
    res.send(createResponse(user.toObject() , "User fetched successfully"))
});

export const updateById = expressAsyncHandler(async (req: Request, res: Response , next : NextFunction) => {
    const user = await userService.updateUserById(req.params.id as string , req.body);
    if (!user) throw createHttpError(404 , "User not found")
    res.send(createResponse(user.toObject() , "User updated successfully"))
});

export const getAll = expressAsyncHandler(async (req: Request, res: Response) => {
    const currentUserId = req.user?._id;
    const allUsers = await userService.getAll();
    const sanitizedUsers = allUsers
        .map(u => u.toObject())
        .filter(u => u._id.toString() !== currentUserId?.toString());
    res.send(createResponse(sanitizedUsers, "Users fetched successfully"));
});