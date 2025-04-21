import { body } from "express-validator";
export const updateProfileSchema = [
  body("username")
    .optional()
    .isString()
    .withMessage("Username must be a string")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Username must be minimum 2 characters long"),
  body("bio")
    .optional()
    .isString()
    .withMessage("Bio must be a string")
    .trim()
    .isLength({ min: 2, max: 500 })
    .withMessage("Bio needs to be 2 - 500 characters long"),
];
