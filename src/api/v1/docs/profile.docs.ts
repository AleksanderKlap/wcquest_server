import {
  updateProfileRequest,
  updateProfileResponse,
} from "../schemas/profile.schema";
import { registry } from "./registry.docs";
import { bearerAuth } from "./components.docs";

registry.register("UpdateProfileRequest", updateProfileRequest);
registry.register("UpdateProfileResponse", updateProfileResponse);

registry.registerPath({
  method: "patch",
  path: "/api/v1/profile",
  tags: ["Profile"],
  security: [{ bearerAuth: [] }],
  description:
    "Update user profile {username, bio} with new values, at least one is requred",
  request: {
    body: {
      content: {
        "application/json": {
          schema: updateProfileRequest,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Profile Update Succesfull, return updated profile",
      content: {
        "application/json": {
          schema: updateProfileResponse,
        },
      },
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
