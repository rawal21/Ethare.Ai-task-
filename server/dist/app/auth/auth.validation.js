"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
exports.registerValidation = [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required").trim(),
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    (0, express_validator_1.body)("role")
        .optional()
        .isIn(["admin", "member"])
        .withMessage("Invalid role, must be either admin or member"),
];
exports.loginValidation = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
];
