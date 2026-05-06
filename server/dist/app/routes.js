"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const user_routes_1 = __importDefault(require("./user/user.routes"));
const project_routes_1 = __importDefault(require("./project/project.routes"));
const task_routes_1 = __importDefault(require("./task/task.routes"));
const dashboard_routes_1 = __importDefault(require("./dashboard/dashboard.routes"));
const router = express_1.default.Router();
router.use("/auth", auth_routes_1.default);
router.use("/users", user_routes_1.default);
router.use("/projects", project_routes_1.default);
router.use("/tasks", task_routes_1.default);
router.use("/dashboard", dashboard_routes_1.default);
exports.default = router;
