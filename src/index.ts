import express, { Request, Response } from "express";
import dotenv from "dotenv";
import errorHandler, {
  routeNotFound,
} from "./middleware/error-handler.middleware";
import swaggerUi from "swagger-ui-express";
import { getOpenApiDocumentation } from "./api/v1/docs/openapi.docs";
import v1router from "./api/v1/routes";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(
  "/api/v1/docs",
  swaggerUi.serve,
  swaggerUi.setup(getOpenApiDocumentation())
);
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the WC Quest Server!" });
});

app.use("/api/v1", v1router);
app.use(routeNotFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
