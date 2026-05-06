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
exports.removeMember = exports.addMember = exports.deleteProject = exports.updateProject = exports.getProjectById = exports.getProjectsForUser = exports.createProject = void 0;
const project_schema_1 = require("./project.schema");
const task_schema_1 = require("../task/task.schema");
const http_errors_1 = __importDefault(require("http-errors"));
const createProject = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure creator is always a member and members are unique
    const membersSet = new Set(data.members || []);
    membersSet.add(data.createdBy);
    const uniqueMembers = [...membersSet];
    const project = yield project_schema_1.Project.create(Object.assign(Object.assign({}, data), { members: uniqueMembers }));
    return project;
});
exports.createProject = createProject;
const getProjectsForUser = (userId_1, role_1, ...args_1) => __awaiter(void 0, [userId_1, role_1, ...args_1], void 0, function* (userId, role, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    let query = {};
    if (role === "admin") {
        // Admin sees projects they created OR are members of
        query = { $or: [{ createdBy: userId }, { members: userId }] };
    }
    else {
        // Member sees projects they are members of
        query = { members: userId };
    }
    const projects = yield project_schema_1.Project.find(query)
        .populate("createdBy members", "name email")
        .skip(skip)
        .limit(limit);
    const total = yield project_schema_1.Project.countDocuments(query);
    return {
        data: projects,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
});
exports.getProjectsForUser = getProjectsForUser;
const getProjectById = (id, userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_schema_1.Project.findById(id).populate("createdBy members", "name email");
    if (!project) {
        throw (0, http_errors_1.default)(404, "Project not found");
    }
    // Check if user is creator or member (Admins already bypass this via their role in the controller, but we check here too for safety)
    const isCreator = project.createdBy.toString() === userId;
    const isMember = project.members.some((m) => m.toString() === userId);
    if (!isCreator && !isMember && role !== "admin") {
        throw (0, http_errors_1.default)(403, "You do not have permission to access this project");
    }
    return project;
});
exports.getProjectById = getProjectById;
const updateProject = (id, userId, role, data) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_schema_1.Project.findById(id);
    if (!project) {
        throw (0, http_errors_1.default)(404, "Project not found");
    }
    // Only creator or any admin can update
    if (project.createdBy.toString() !== userId && role !== "admin") {
        throw (0, http_errors_1.default)(403, "You do not have permission to modify this project");
    }
    // Handle unique members if provided
    let updatedMembers = project.members.map((m) => m.toString());
    if (data.members) {
        updatedMembers = [...new Set(data.members)];
    }
    const updatedProject = yield project_schema_1.Project.findByIdAndUpdate(id, Object.assign(Object.assign({}, data), { members: updatedMembers }), { new: true }).populate("createdBy members", "name email");
    return updatedProject;
});
exports.updateProject = updateProject;
const deleteProject = (id, userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_schema_1.Project.findById(id);
    if (!project) {
        throw (0, http_errors_1.default)(404, "Project not found");
    }
    // Only creator or any admin can delete
    if (project.createdBy.toString() !== userId && role !== "admin") {
        throw (0, http_errors_1.default)(403, "You do not have permission to delete this project");
    }
    // Cascade delete tasks
    yield task_schema_1.Task.deleteMany({ projectId: id });
    yield project_schema_1.Project.findByIdAndDelete(id);
    return { message: "Project and associated tasks deleted successfully" };
});
exports.deleteProject = deleteProject;
const addMember = (id, userId, requesterId, requesterRole) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_schema_1.Project.findById(id);
    if (!project)
        throw (0, http_errors_1.default)(404, "Project not found");
    if (project.createdBy.toString() !== requesterId && requesterRole !== "admin") {
        throw (0, http_errors_1.default)(403, "Access denied");
    }
    if (project.members.map(m => m.toString()).includes(userId)) {
        throw (0, http_errors_1.default)(400, "User is already a member");
    }
    project.members.push(userId);
    yield project.save();
    return project.populate("createdBy members", "name email");
});
exports.addMember = addMember;
const removeMember = (id, userId, requesterId, requesterRole) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_schema_1.Project.findById(id);
    if (!project)
        throw (0, http_errors_1.default)(404, "Project not found");
    if (project.createdBy.toString() !== requesterId && requesterRole !== "admin") {
        throw (0, http_errors_1.default)(403, "Access denied");
    }
    if (project.createdBy.toString() === userId) {
        throw (0, http_errors_1.default)(400, "Cannot remove project owner");
    }
    project.members = project.members.filter(m => m.toString() !== userId);
    yield project.save();
    return project.populate("createdBy members", "name email");
});
exports.removeMember = removeMember;
