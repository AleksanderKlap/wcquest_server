import express, { Request, Response } from "express";
import dotenv from "dotenv";
import prisma from "./prisma";
import { authRouter } from "./routes/auth.routes";
import errorHandler, {
  routeNotFound,
} from "./middleware/error-handler.middleware";
import swaggerSpec from "./config/swagger.config";
import swaggerUi from "swagger-ui-express";

import verifyJWT from "./middleware/auth.middleware";
import { profileRouter } from "./routes/profile.routes";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());
app.use(authRouter);
app.use(profileRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the WC Quest Server!" });
});

app.get("/health", async (req: Request, res: Response) => {
  res.json({ status: "healthy" });
});

app.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.use(verifyJWT);
app.get("/protected", async (req: Request, res: Response) => {
  res.json({
    message:
      "this endpoint is protected and u got here because of ur valid token ;)",
  });
});

app.use(routeNotFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
