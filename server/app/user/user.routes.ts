import { Router } from "express";
import * as userController from "./user.controller";
import { jwtAuth } from "@/common/middleware/jwt.middleware";

const router = Router();

router.get("/", jwtAuth, userController.getAll);
router.get("/:id", jwtAuth, userController.getById);
router.put("/:id", jwtAuth, userController.updateById);

export default router;