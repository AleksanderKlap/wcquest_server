import {
  createToiletRequest,
  createToiletResponse,
} from "../schemas/toilet.schema";
import { registry } from "./registry.docs";

registry.register("UpdateProfileRequest", createToiletRequest);
registry.register("CreateToiletResponse", createToiletResponse);

registry.registerPath({
  method: "post",
  path: "/api/v1/toilet",
  tags: ["Toilet"],
  security: [{ bearerAuth: [] }],
  description: "Create new Toilet.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createToiletRequest,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Creation of toilet succesfull",
      content: {
        "application/json": {
          schema: createToiletResponse,
        },
      },
    },
    500: {
      description: "Inserting toilet to DB failed",
    },
    400: {
      description:
        "Validation of request body failed. Read error cause for details",
    },
    403: {
      description: "No JWT token OR malformed JWT token OR expired token",
    },
  },
});
