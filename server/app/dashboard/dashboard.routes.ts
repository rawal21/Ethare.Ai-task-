import { Router } from "express";
import { jwtAuth } from "@/common/middleware/jwt.middleware";
import * as dashboardController from "./dashboard.controller";

const router = Router();

router.use(jwtAuth);

router.get("/", dashboardController.getDashboard);

export default router;
