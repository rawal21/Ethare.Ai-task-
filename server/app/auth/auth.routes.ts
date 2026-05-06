import { Router, Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { catchError } from "../common/middleware/catch-error.middleware";
import * as AuthController from "./auth.controller";
import passport from "passport";
// import { loginRateLimiter, apiRateLimiter } from "../config/rateLimiter";
import { loginRateLimiter } from "@/common/middleware/rate-limmter.middleware";
import { registerValidation, loginValidation } from "./auth.validation";
const router = Router();

router.post("/register", 
    registerValidation,
    catchError, 
    AuthController.register
);


router.post(
  "/login",
  loginValidation,
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Login route hit", req.body);
    next();
  },
  loginRateLimiter,
  catchError,
  passport.authenticate("login", { session: false }),
  AuthController.login
);

router.post("/refresh", AuthController.refreshToken);


export default router;