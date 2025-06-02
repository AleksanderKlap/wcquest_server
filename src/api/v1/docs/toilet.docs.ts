import z, { any } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { registry } from "./registry.docs";
import {
  boundingBoxRequest,
  createToiletRequest,
  inRadiusRequest,
  ratingRequest,
} from "../schemas/toilet/toilet.request.schema";
import {
  allFeaturesResponse,
  rateToiletResponse,
  toiletResponse,
} from "../schemas/toilet/toilet.response.schema";
import {
  avgToiletRatings,
  toiletPhoto,
  userRatingReturn,
} from "../schemas/toilet/toilet.entity.schema";
extendZodWithOpenApi(z);

registry.register("CreateToiletRequest", createToiletRequest);

registry.registerPath({
  method: "get",
  path: "/api/v1/features",
  tags: ["Toilet"],
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
          schema: toiletResponse,
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
    401: {
      description: "JWT access token expired - hit /refreshtoken for new one",
    },
    403: {
      description: "Invalid JWT token",
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
    query: inRadiusRequest,
  },
  responses: {
    200: {
      description: "Toilets within the specified radius",
      content: {
        "application/json": {
          schema: toiletResponse,
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
    query: boundingBoxRequest,
  },
  responses: {
    200: {
      description: "Toilets within the specified bounding box",
      content: {
        "application/json": {
          schema: toiletResponse,
        },
      },
    },
    400: {
      description: "Validation of query parameters failed",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/toilet/{id}/photos",
  tags: ["Toilet"],
  security: [{ bearerAuth: [] }],
  description:
    "Add photos to toilet. U can add max 10 photos and each needs to be less than 5MB. It is not JSON body but multipart/form-data, the files goes into field with key 'toilet-photos' and can be only .jpg extention. This is JWT protected endpoint of course. Base path for Storage is: https://foiaqnktjmvvenvegymc.supabase.co/storage/v1/object/public/toilet-photos/ and than u add photo-url (ex: 18/104937b1-5593-4679-bf54-4b5e12bb7235.jpg) - this way u get photo from server",
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({ files: any() }).openapi({
            properties: {
              "toilet-photos": {
                type: "array",
                items: {
                  type: "string",
                  format: "binary",
                },
              },
            },
            required: ["toilet-photos"],
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Photos uploaded and saved successfully",
      content: {
        "application/json": {
          schema: z.array(toiletPhoto),
        },
      },
    },
    400: {
      description: "Invalid toilet ID, no files uploaded, or file too large",
    },
    500: {
      description: "Uploading to Supabase or DB failed",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/toilet/{id}/ratings",
  tags: ["Toilet"],
  security: [{ bearerAuth: [] }],
  description:
    "Allows to rate the toilet on 3 different fields: cleanliness, accessibility, location. All 3 are neccesarry. For now one user can rate one toilet many times, will be changed in future.",
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        "application/json": {
          schema: ratingRequest,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Rating succesfull",
      content: {
        "application/json": {
          schema: rateToiletResponse,
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
  path: "/api/v1/toilet/ratings/my",
  tags: ["Toilet"],
  security: [{ bearerAuth: [] }],
  description: "Gets all ratings of requesting user from freshest to oldest",
  responses: {
    200: {
      description: "Getting succesfull",
      content: {
        "application/json": {
          schema: rateToiletResponse,
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
  path: "/api/v1/toilet/{id}/ratings",
  tags: ["Toilet"],
  description: "Gets all ratings of id toilet from freshest to oldest",
  responses: {
    200: {
      description: "Getting succesfull",
      content: {
        "application/json": {
          schema: z.array(userRatingReturn),
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
  path: "/api/v1/toilet/{id}/ratings/avg",
  tags: ["Toilet"],
  description: "Get avg rating of toilet",
  responses: {
    200: {
      description: "Getting succesfull",
      content: {
        "application/json": {
          schema: avgToiletRatings,
        },
      },
    },
    500: {
      description: "Something went wrong",
    },
  },
});
