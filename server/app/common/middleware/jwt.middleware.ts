import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as userService from "../../user/user.service"

export interface AuthRequest extends Request {
  user?: any;
}

export const jwtAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing authorization header" });
  const token = authHeader.split(" ")[1];
  console.log("debug the token" , token)
  try {
    const secret = process.env.JWT_SECRET || "secret";
    const payload: any = jwt.verify(token, secret);
    console.log("debbugin the payload" ,  payload)

    // attach user minimal info
    const user = await userService.getById(payload._id);
    if (!user) return res.status(401).json({ message: "Invalid token" });
    req.user = user.toObject();
    console.error(`>>> AUTH_MIDDLEWARE: User ${req.user._id} has role ${req.user.role}`);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};