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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_middleware_1 = require("../common/middleware/jwt.middleware");
const roleAuth_middleware_1 = require("../common/middleware/roleAuth.middleware");
const catch_error_middleware_1 = require("../common/middleware/catch-error.middleware");
const projectController = __importStar(require("./project.controller"));
const project_validation_1 = require("./project.validation");
const router = (0, express_1.Router)();
// Protect all routes with JWT
router.use(jwt_middleware_1.jwtAuth);
// GET routes (accessible by admin and members)
router.get("/", projectController.getProjects);
router.get("/:id", projectController.getProjectById);
// POST/PUT/DELETE routes (accessible by admin only)
router.post("/", (0, roleAuth_middleware_1.requireRole)(["admin"]), project_validation_1.createProjectValidation, catch_error_middleware_1.catchError, projectController.createProject);
router.put("/:id", (0, roleAuth_middleware_1.requireRole)(["admin"]), project_validation_1.updateProjectValidation, catch_error_middleware_1.catchError, projectController.updateProject);
router.delete("/:id", (0, roleAuth_middleware_1.requireRole)(["admin"]), projectController.deleteProject);
// Member management
router.post("/:id/members", (0, roleAuth_middleware_1.requireRole)(["admin"]), projectController.addMember);
router.delete("/:id/members", (0, roleAuth_middleware_1.requireRole)(["admin"]), projectController.removeMember);
exports.default = router;
