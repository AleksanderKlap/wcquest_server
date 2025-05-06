import { Router } from "express";
import { validate } from "../../../middleware/validator.middleware";
import { loginRequest, registerRequest } from "../schemas/auth.schema";
import { login, register } from "../controllers/auth.controller";

const router = Router();

router.post("/register", validate(registerRequest), register);
router.post("/login", validate(loginRequest), login);

export { router as authRouter };
