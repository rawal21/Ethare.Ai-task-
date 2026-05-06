"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.removeMember = exports.addMember = exports.deleteProject = exports.updateProject = exports.getProjectById = exports.getProjects = exports.createProject = void 0;
const projectService = __importStar(require("./project.service"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const response_helper_1 = require("../common/helper/response.helper");
exports.createProject = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const projectData = req.body;
    const project = yield projectService.createProject(Object.assign(Object.assign({}, projectData), { createdBy: userId }));
    res.status(201).json((0, response_helper_1.createResponse)(project, "Project created successfully"));
}));
exports.getProjects = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const projects = yield projectService.getProjectsForUser(userId, role, page, limit);
    res.json((0, response_helper_1.createResponse)(projects, "Projects fetched successfully"));
}));
exports.getProjectById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
    const project = yield projectService.getProjectById(req.params.id, userId, role);
    res.json((0, response_helper_1.createResponse)(project, "Project fetched successfully"));
}));
exports.updateProject = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const projectData = req.body;
    const project = yield projectService.updateProject(req.params.id, userId, (_b = req.user) === null || _b === void 0 ? void 0 : _b.role, projectData);
    res.json((0, response_helper_1.createResponse)(project, "Project updated successfully"));
}));
exports.deleteProject = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const result = yield projectService.deleteProject(req.params.id, userId, (_b = req.user) === null || _b === void 0 ? void 0 : _b.role);
    res.json((0, response_helper_1.createResponse)(null, result.message));
}));
exports.addMember = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const requesterId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const requesterRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
    const { userId } = req.body;
    const project = yield projectService.addMember(req.params.id, userId, requesterId, requesterRole);
    res.json((0, response_helper_1.createResponse)(project, "Member added successfully"));
}));
exports.removeMember = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const requesterId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const requesterRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
    const { userId } = req.body;
    const project = yield projectService.removeMember(req.params.id, userId, requesterId, requesterRole);
    res.json((0, response_helper_1.createResponse)(project, "Member removed successfully"));
}));
