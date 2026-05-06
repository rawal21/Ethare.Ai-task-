import { body } from "express-validator";

export const registerValidation = [
  body("name").notEmpty().withMessage("Name is required").trim(),
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(["admin", "member"])
    .withMessage("Invalid role, must be either admin or member"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];