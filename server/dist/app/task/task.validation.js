"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskStatusValidation = exports.createTaskValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createTaskValidation = [
    (0, express_validator_1.body)("title").notEmpty().withMessage("Title is required").trim(),
    (0, express_validator_1.body)("description").optional().isString().trim(),
    (0, express_validator_1.body)("projectId").isMongoId().withMessage("Invalid project ID format"),
    (0, express_validator_1.body)("assignedTo").isMongoId().withMessage("Invalid assignedTo user ID format"),
    (0, express_validator_1.body)("deadline")
        .optional()
        .isISO8601()
        .withMessage("Invalid date format for deadline. Must be ISO8601"),
];
exports.updateTaskStatusValidation = [
    (0, express_validator_1.body)("status")
        .notEmpty()
        .isIn(["TODO", "IN_PROGRESS", "DONE"])
        .withMessage("Invalid status. Must be TODO, IN_PROGRESS, or DONE"),
];
