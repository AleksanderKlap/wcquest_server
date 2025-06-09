import "module-alias/register";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import errorHandler, {
  routeNotFound,
} from "./middleware/error-handler.middleware";
import swaggerUi from "swagger-ui-express";
import { getOpenApiDocumentation } from "./api/v1/docs/openapi.docs";
import v1router from "./api/v1/routes";
//yaml write docs
import * as yaml from "yaml";
import * as fs from "fs";

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
writeDocumentation();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

//write zod yaml to file
function writeDocumentation() {
  // OpenAPI JSON
  const docs = getOpenApiDocumentation();

  // YAML equivalent
  const fileContent = yaml.stringify(docs);

  fs.writeFileSync(`${__dirname}/openapi-docs.yml`, fileContent, {
    encoding: "utf-8",
  });
}
