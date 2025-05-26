import { Router } from "express";
import { authRouter } from "./auth.routes";
import { profileRouter } from "./profile.routes";
import { toiletRouter } from "./toilet.routes";

const v1router = Router();

v1router.use(toiletRouter);
v1router.use("/auth", authRouter);
v1router.use(profileRouter);

export default v1router;
