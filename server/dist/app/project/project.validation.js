"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectValidation = exports.createProjectValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createProjectValidation = [
    (0, express_validator_1.body)("title").notEmpty().withMessage("Title is required").trim(),
    (0, express_validator_1.body)("description").optional().isString().trim(),
    (0, express_validator_1.body)("members")
        .optional()
        .isArray()
        .withMessage("Members must be an array of user IDs"),
    (0, express_validator_1.body)("members.*").isMongoId().withMessage("Invalid member ID format"),
];
exports.updateProjectValidation = [
    (0, express_validator_1.body)("title").optional().notEmpty().withMessage("Title cannot be empty").trim(),
    (0, express_validator_1.body)("description").optional().isString().trim(),
    (0, express_validator_1.body)("members")
        .optional()
        .isArray()
        .withMessage("Members must be an array of user IDs"),
    (0, express_validator_1.body)("members.*").isMongoId().withMessage("Invalid member ID format"),
];
