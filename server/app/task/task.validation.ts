import { body } from "express-validator";

export const createTaskValidation = [
  body("title").notEmpty().withMessage("Title is required").trim(),
  body("description").optional().isString().trim(),
  body("projectId").isMongoId().withMessage("Invalid project ID format"),
  body("assignedTo").isMongoId().withMessage("Invalid assignedTo user ID format"),
  body("deadline")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format for deadline. Must be ISO8601"),
];

export const updateTaskStatusValidation = [
  body("status")
    .notEmpty()
    .isIn(["TODO", "IN_PROGRESS", "DONE"])
    .withMessage("Invalid status. Must be TODO, IN_PROGRESS, or DONE"),
];
