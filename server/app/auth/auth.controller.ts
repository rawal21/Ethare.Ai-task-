import * as authService from "./auth.service"
import type {Request, Response , NextFunction} from "express";
import expressAsyncHandler from "express-async-handler";
import * as jwtService from "@/common/service/passport-jwt.service";
import { createResponse } from "@/common/helper/response.helper";
import createHttpError from "http-errors";
import { logger } from "@/common/helper/logger.helper";
import { createUserDto } from "@/user/user.dto";
import * as userService from "@/user/user.service";

export const register = async (req: Request, res: Response) => {
  const newUser = await authService.register(req.body as createUserDto);
  
  const safeUser = {
    _id: (newUser as any)._id,
    name: (newUser as any).name,
    email: (newUser as any).email,
    role: (newUser as any).role,
    createdAt: (newUser as any).createdAt,
    updatedAt: (newUser as any).updatedAt
  };

  const tokens = jwtService.createUserTokens(safeUser as any);
  
  // Store refreshToken in DB
  await userService.updateUserById(safeUser._id, { refreshToken: tokens.refreshToken });

  res.status(201).json(
    createResponse(
      {
        user: { ...safeUser, refreshToken: tokens.refreshToken },
        tokens,
      },
      "User registered successfully"
    )
  );
};

export const login = expressAsyncHandler(async (req: Request, res: Response) => {
  const user = req.user as any;

  const safeUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };

  const tokens = jwtService.createUserTokens(safeUser as any);
  
  // Store refreshToken in DB
  await userService.updateUserById(user._id!, { refreshToken: tokens.refreshToken });

  res.send(
    createResponse(
      {
        user: { ...safeUser, refreshToken: tokens.refreshToken },
        tokens,
      },
      "Login successful"
    )
  );
});

export const refreshToken = expressAsyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw createHttpError(400, "Refresh token is required");
  }

  try {
    const payload = jwtService.verifyToken(refreshToken);
    const currentUser = await userService.getById(payload._id!);

    if (!currentUser || currentUser.refreshToken !== refreshToken) {
      throw createHttpError(401, "Invalid refresh token");
    }

    const userObj = currentUser.toObject();
    const safeUser = {
      _id: userObj._id,
      name: userObj.name,
      email: userObj.email,
      role: userObj.role,
      createdAt: userObj.createdAt,
      updatedAt: userObj.updatedAt
    };

    const tokens = jwtService.createUserTokens(safeUser as any);

    // Update refresh token in DB
    await userService.updateUserById(userObj._id!, { refreshToken: tokens.refreshToken });

    res.send(
      createResponse(
        {
          tokens,
        },
        "Token refreshed successfully"
      )
    );
  } catch (error) {
    throw createHttpError(401, "Invalid or expired refresh token");
  }
});
