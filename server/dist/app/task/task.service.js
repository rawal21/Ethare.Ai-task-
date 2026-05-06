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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTaskStatus = exports.getTasks = exports.createTask = void 0;
const task_schema_1 = require("./task.schema");
const project_schema_1 = require("../project/project.schema");
const user_schema_1 = require("../user/user.schema");
const http_errors_1 = __importDefault(require("http-errors"));
const createTask = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_schema_1.Project.findById(data.projectId);
    if (!project) {
        throw (0, http_errors_1.default)(404, "Project not found");
    }
    // 1. Check if Admin (Global Access)
    const isAdmin = String(data.role || "").toLowerCase() === "admin";
    if (isAdmin) {
        console.error(`>>> ADMIN ACCESS GRANTED for user ${data.createdBy}`);
    }
    else {
        // 2. Check if Creator or Member
        const isCreator = project.createdBy.toString() === data.createdBy;
        const isMember = project.members.some(m => m.toString() === data.createdBy);
        console.error(`>>> MEMBER CHECK: isCreator=${isCreator}, isMember=${isMember} for user ${data.createdBy}`);
        if (!isCreator && !isMember) {
            throw (0, http_errors_1.default)(403, "You do not have permission to add tasks to this project (CODE:NOT_AUTHORIZED)");
        }
    }
    // Ensure assignedTo is a member of the project
    const assignedUser = yield user_schema_1.user.findById(data.assignedTo);
    const isAssignedAdmin = (assignedUser === null || assignedUser === void 0 ? void 0 : assignedUser.role) === "admin";
    const isOwner = project.createdBy.toString() === data.assignedTo;
    if (isAssignedAdmin || isOwner) {
        throw (0, http_errors_1.default)(400, "Cannot assign tasks to project owners or administrators");
    }
    if (!project.members.some(m => m.toString() === data.assignedTo)) {
        throw (0, http_errors_1.default)(400, "Assigned user is not a member of the project");
    }
    // Ensure deadline is not in the past
    if (data.deadline && new Date(data.deadline) < new Date(new Date().setHours(0, 0, 0, 0))) {
        throw (0, http_errors_1.default)(400, "Deadline cannot be in the past");
    }
    const task = yield task_schema_1.Task.create(data);
    return task;
});
exports.createTask = createTask;
const getTasks = (userId_1, role_1, projectId_1, assignedTo_1, status_1, search_1, ...args_1) => __awaiter(void 0, [userId_1, role_1, projectId_1, assignedTo_1, status_1, search_1, ...args_1], void 0, function* (userId, role, projectId, assignedTo, status, search, page = 1, limit = 10) {
    const query = {};
    const skip = (page - 1) * limit;
    if (projectId)
        query.projectId = projectId;
    if (assignedTo)
        query.assignedTo = assignedTo;
    if (status)
        query.status = status;
    if (search)
        query.title = { $regex: search, $options: "i" };
    if (role === "admin") {
        // Admins only see tasks from projects they own or are part of
        const projects = yield project_schema_1.Project.find({
            $or: [{ createdBy: userId }, { members: userId }],
        }).select("_id");
        const projectIds = projects.map((p) => p._id.toString());
        if (projectId) {
            if (!projectIds.includes(projectId)) {
                return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
            }
            query.projectId = projectId;
        }
        else {
            query.projectId = { $in: projectIds };
        }
    }
    else {
        // Members see tasks in projects they are a member of, but ONLY tasks assigned to them
        const projects = yield project_schema_1.Project.find({ members: userId }).select("_id");
        const projectIds = projects.map((p) => p._id.toString());
        if (projectId) {
            if (!projectIds.includes(projectId)) {
                return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
            }
            query.projectId = projectId;
        }
        else {
            query.projectId = { $in: projectIds };
        }
        query.assignedTo = userId; // Strict isolation for members
    }
    const tasks = yield task_schema_1.Task.find(query)
        .populate("projectId assignedTo createdBy", "title name email")
        .skip(skip)
        .limit(limit);
    const total = yield task_schema_1.Task.countDocuments(query);
    return {
        data: tasks,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
});
exports.getTasks = getTasks;
const updateTaskStatus = (taskId, userId, role, data) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield task_schema_1.Task.findById(taskId);
    if (!task) {
        throw (0, http_errors_1.default)(404, "Task not found");
    }
    const normalizedRole = role.toLowerCase();
    if (normalizedRole === "member") {
        // Member can only update tasks assigned to them
        if (task.assignedTo.toString() !== userId.toString()) {
            console.error(`>>> STATUS_UPDATE_FAILED: task.assignedTo=${task.assignedTo}, userId=${userId}`);
            throw (0, http_errors_1.default)(403, "You can only update tasks assigned to you");
        }
    }
    else if (normalizedRole === "admin") {
        // Admin can update any task in projects they manage
        const project = yield project_schema_1.Project.findById(task.projectId);
        const isCreator = (project === null || project === void 0 ? void 0 : project.createdBy.toString()) === userId.toString();
        const isMember = project === null || project === void 0 ? void 0 : project.members.some(m => m.toString() === userId.toString());
        console.error(`>>> ADMIN_STATUS_CHECK: user=${userId.toString()}, creator=${project === null || project === void 0 ? void 0 : project.createdBy.toString()}, project=${task.projectId}, isCreator=${isCreator}, isMember=${isMember}`);
        if (!isCreator && !isMember) {
            throw (0, http_errors_1.default)(403, "You do not have permission to modify tasks in this project (ADMIN_DENIED)");
        }
    }
    task.status = data.status;
    yield task.save();
    return task;
});
exports.updateTaskStatus = updateTaskStatus;
const deleteTask = (taskId, userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield task_schema_1.Task.findById(taskId);
    if (!task) {
        throw (0, http_errors_1.default)(404, "Task not found");
    }
    // Admin only logic (checked by middleware), but must be owner/member of the project
    const project = yield project_schema_1.Project.findById(task.projectId);
    const isCreator = (project === null || project === void 0 ? void 0 : project.createdBy.toString()) === userId;
    const isMember = project === null || project === void 0 ? void 0 : project.members.some(m => m.toString() === userId);
    if (!isCreator && !isMember && role !== "admin") {
        throw (0, http_errors_1.default)(403, "You do not have permission to delete tasks in this project");
    }
    if (role === "admin" && !isCreator && !isMember) {
        throw (0, http_errors_1.default)(403, "You do not have permission to delete tasks in this project");
    }
    yield task_schema_1.Task.findByIdAndDelete(taskId);
    return { message: "Task deleted successfully" };
});
exports.deleteTask = deleteTask;
