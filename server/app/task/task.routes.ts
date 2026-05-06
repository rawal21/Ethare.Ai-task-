import { Router } from "express";
import { jwtAuth } from "@/common/middleware/jwt.middleware";
import { requireRole } from "@/common/middleware/roleAuth.middleware";
import { catchError } from "@/common/middleware/catch-error.middleware";
import * as taskController from "./task.controller";
import {
  createTaskValidation,
  updateTaskStatusValidation,
} from "./task.validation";

const router = Router();

router.use(jwtAuth);

router.get("/", taskController.getTasks);

router.post(
  "/",
  requireRole(["admin"]),
  createTaskValidation,
  catchError,
  taskController.createTask
);

router.put(
  "/:id/status",
  updateTaskStatusValidation,
  catchError,
  taskController.updateTaskStatus
);

router.delete("/:id", requireRole(["admin"]), taskController.deleteTask);

export default router;
