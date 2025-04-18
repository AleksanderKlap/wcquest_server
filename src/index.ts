import express, { Request, Response } from "express";
import dotenv from "dotenv";
import prisma from "./prisma";
import { authRouter } from "./routes/auth.routes";
import errorHandler, {
  routeNotFound,
} from "./middleware/error-handler.middleware";
import { logger, errorLogger } from "./config/winston.config";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(logger);
app.use(authRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the WC Quest Server!" });
});

// Health endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "healthy" });
});

app.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.use(routeNotFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
