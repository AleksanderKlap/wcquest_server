import { registerRequest, registerResponse } from "../schemas/auth.schema";
import { registry } from "./registry.docs";

registry.register("RegisterRequest", registerRequest);
registry.register("RegisterResponse", registerResponse);

registry.registerPath({
  method: "post",
  path: "/register",
  tags: ["Auth"],
  description: "Register new User with email and password",
  request: {
    params: registerRequest,
  },
  responses: {
    200: {
      description: "Registration Succesfull",
      content: {
        "application/json": {
          schema: registerResponse,
        },
      },
    },
  },
});

// export const authPaths = {
//   "/register": {
//     post: {
//       summary: "meme",
//       tags: ["Auth"],
//       requestBody: {
//         required: true,
//         content: {
//           "application/json": {
//             schema: registerRequest,
//           },
//         },
//       },
//       responses: {
//         200: {
//           description: "Account created",
//           content: {
//             "application/json": {
//               schema: registerResponse,
//             },
//           },
//         },
//       },
//     },
//   },
// };
