import { body } from "express-validator";

export const createProjectValidation = [
  body("title").notEmpty().withMessage("Title is required").trim(),
  body("description").optional().isString().trim(),
  body("members")
    .optional()
    .isArray()
    .withMessage("Members must be an array of user IDs"),
  body("members.*").isMongoId().withMessage("Invalid member ID format"),
];

export const updateProjectValidation = [
  body("title").optional().notEmpty().withMessage("Title cannot be empty").trim(),
  body("description").optional().isString().trim(),
  body("members")
    .optional()
    .isArray()
    .withMessage("Members must be an array of user IDs"),
  body("members.*").isMongoId().withMessage("Invalid member ID format"),
];
