import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./registry.docs";
import {
  openApiInfo,
  openApiServers,
  openApiTags,
} from "../config/docs.config";
import "./auth.docs";

export function getOpenApiDocumentation() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: openApiInfo,
    servers: openApiServers,
    tags: openApiTags,
  });
}
