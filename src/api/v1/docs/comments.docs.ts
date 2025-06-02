import { registry } from "./registry.docs";
import z from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { commentRequest } from "../schemas/toilet/toilet.request.schema";
import { toiletComment } from "../schemas/toilet/toilet.entity.schema";
extendZodWithOpenApi(z);

registry.registerPath({
  method: "post",
  path: "/api/v1/toilet/{id}/comments",
  tags: ["Toilet"],
  security: [{ bearerAuth: [] }],
  description: "Insert new comment for the toilet",
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        "application/json": {
          schema: commentRequest,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Comment adding succesfull",
      content: {
        "application/json": {
          schema: toiletComment,
        },
      },
    },
    401: {
      description: "Token Expired",
    },
    403: {
      description: "Invalid token",
    },
    400: {
      description: "Wrong body, read the error code",
    },
    500: {
      description: "Something went wrong",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/toilet/{id}/comments",
  tags: ["Toilet"],
  request: {
    params: z.object({ id: z.string() }),
  },
  description: "Get all comments of toilet ID from freshest to oldest",
  responses: {
    200: {
      description: "Getting succesfull",
      content: {
        "application/json": {
          schema: z.array(toiletComment),
        },
      },
    },
    500: {
      description: "Something went wrong",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/toilet/comments/my",
  tags: ["Toilet"],
  security: [{ bearerAuth: [] }],
  description: "Get all comments of user ID from freashest to oldest",
  responses: {
    200: {
      description: "Getting succesfull",
      content: {
        "application/json": {
          schema: z.array(toiletComment),
        },
      },
    },
    401: {
      description: "Token Expired",
    },
    403: {
      description: "Invalid token",
    },
    500: {
      description: "Something went wrong",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/toilet/{toiletId}/comments/{commentId}",
  tags: ["Toilet"],
  security: [{ bearerAuth: [] }],
  description: "Deletes specific id comment of requesting user",
  responses: {
    204: {
      description: "Deleting succesfull",
    },
    401: {
      description: "Token Expired",
    },
    403: {
      description: "Invalid token",
    },
    500: {
      description: "Something went wrong",
    },
  },
});
