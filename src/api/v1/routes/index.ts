import { Router } from "express";
import { authRouter } from "./auth.routes";
import { profileRouter } from "./profile.routes";
import { toiletRouter } from "./toilet.routes";

const v1router = Router();

v1router.use("/auth", authRouter);
v1router.use(profileRouter);
v1router.use(toiletRouter);

export default v1router;
