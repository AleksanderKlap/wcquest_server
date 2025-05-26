import {
  allFeaturesResponse,
  boundingBoxQuerySchema,
  createToiletRequest,
  createToiletResponse,
  getInRadiusQuerySchema,
  getToiletsResponse,
} from "../schemas/toilet.schema";
import { registry } from "./registry.docs";

registry.register("CreateToiletRequest", createToiletRequest);
registry.register("CreateToiletResponse", createToiletResponse);

registry.registerPath({
  method: "get",
  path: "/api/v1/features",
  tags: ["Toilet"],
  security: [{ bearerAuth: [] }],
  description: "Get all features from the database",
  responses: {
    200: {
      description: "All features fetched from DB",
      content: {
        "application/json": {
          schema: allFeaturesResponse,
        },
      },
    },
    500: {
      description: "Something went wrong - i dont know yet what sorry",
    },
    403: {
      description: "No JWT token OR malformed JWT token OR expired token",
    },
  },
});

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

registry.registerPath({
  method: "get",
  path: "/api/v1/toilet/inradius",
  tags: ["Toilet"],
  description:
    "Get toilets within a radius from a point (user location). 'lng' and 'lat' are user location longitude and latitude, radius is measured in meters. Page and limit are optional and are defaulted to 1 and 20 if not specidied. The result is ordered by distance from user, closest first. Example query: /api/v1/toilet/inradius?lat=52.3676&lng=4.9041&radius=2000",
  request: {
    query: getInRadiusQuerySchema,
  },
  responses: {
    200: {
      description: "Toilets within the specified radius",
      content: {
        "application/json": {
          schema: getToiletsResponse,
        },
      },
    },
    400: {
      description: "Validation of query parameters failed",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/toilet/bbox",
  tags: ["Toilet"],
  description:
    "Get toilets within bounding box, that is a rectangle. minlng and minlat are x,y of bottom left corner point of rectangle, and maxlng and maxlat are x,y of top right corner point of rectangle. Additional query parameters are ulng and ulat, which are user coordinates, they are optional, if passed, result is ordered by distance to the user (user do not need to be in the bounding box), if not passed result is unordered. Distance is measured in meters if present. Page and limit are optional and are defaulted to 1 and 20 if not specidied. Example query: /api/v1/toilet/bbox?minlng=4.7285&minlat=52.2782&maxlng=5.0792&maxlat=52.4312&ulng=4.90385&ulat=52.3547&page=1&limit=20",
  request: {
    query: boundingBoxQuerySchema,
  },
  responses: {
    200: {
      description: "Toilets within the specified bounding box",
      content: {
        "application/json": {
          schema: getToiletsResponse,
        },
      },
    },
    400: {
      description: "Validation of query parameters failed",
    },
  },
});
