import express from "express";
import authRoutes from "./auth/auth.routes";
import userRoutes from "./user/user.routes";
import projectRoutes from "./project/project.routes";
import taskRoutes from "./task/task.routes";
import dashboardRoutes from "./dashboard/dashboard.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;