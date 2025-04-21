import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import authSchemas from "../openapi-schemas/auth.schema";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WCQuest JSON API documentation",
      version: "1.0.0",
    },
    servers: [
      {
        url: "https://wcquestserver-production.up.railway.app",
      },
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      schemas: {
        ...authSchemas,
      },
    },
  },
  apis: ["./src/routes/auth.routes.ts", "./src/schemas/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
