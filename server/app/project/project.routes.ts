import { Router } from "express";
import { jwtAuth } from "@/common/middleware/jwt.middleware";
import { requireRole } from "@/common/middleware/roleAuth.middleware";
import { catchError } from "@/common/middleware/catch-error.middleware";
import * as projectController from "./project.controller";
import {
  createProjectValidation,
  updateProjectValidation,
} from "./project.validation";

const router = Router();

// Protect all routes with JWT
router.use(jwtAuth);

// GET routes (accessible by admin and members)
router.get("/", projectController.getProjects);
router.get("/:id", projectController.getProjectById);

// POST/PUT/DELETE routes (accessible by admin only)
router.post(
  "/",
  requireRole(["admin"]),
  createProjectValidation,
  catchError,
  projectController.createProject
);

router.put(
  "/:id",
  requireRole(["admin"]),
  updateProjectValidation,
  catchError,
  projectController.updateProject
);

router.delete("/:id", requireRole(["admin"]), projectController.deleteProject);

// Member management
router.post("/:id/members", requireRole(["admin"]), projectController.addMember);
router.delete("/:id/members", requireRole(["admin"]), projectController.removeMember);

export default router;
