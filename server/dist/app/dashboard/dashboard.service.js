"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const task_schema_1 = require("../task/task.schema");
const project_schema_1 = require("../project/project.schema");
const getDashboardStats = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    let projectIds = [];
    if (role === "admin") {
        const projects = yield project_schema_1.Project.find({
            $or: [{ createdBy: userId }, { members: userId }],
        }).select("_id");
        projectIds = projects.map((p) => p._id);
    }
    else {
        const projects = yield project_schema_1.Project.find({ members: userId }).select("_id");
        projectIds = projects.map((p) => p._id);
    }
    // Get all tasks user has access to
    const taskQuery = { projectId: { $in: projectIds } };
    if (role === "member") {
        taskQuery.assignedTo = userId;
    }
    const tasks = yield task_schema_1.Task.find(taskQuery);
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "DONE").length;
    const pendingTasks = tasks.filter((t) => t.status !== "DONE").length;
    const now = new Date();
    const overdueTasks = tasks.filter((t) => t.deadline && t.deadline < now && t.status !== "DONE").length;
    const myTasksCount = tasks.filter((t) => t.assignedTo.toString() === userId).length;
    return {
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
        myTasksCount,
    };
});
exports.getDashboardStats = getDashboardStats;
