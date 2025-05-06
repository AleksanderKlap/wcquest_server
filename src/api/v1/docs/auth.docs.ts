import {
  loginRequest,
  loginResponse,
  registerRequest,
  registerResponse,
} from "../schemas/auth.schema";
import { registry } from "./registry.docs";

registry.register("RegisterRequest", registerRequest);
registry.register("RegisterResponse", registerResponse);
registry.register("LoginRequest", loginRequest);
registry.register("LoginResponse", loginResponse);

registry.registerPath({
  method: "post",
  path: "/register",
  tags: ["Auth"],
  description:
    "Register new User with email and password. With account creation the default user profile is created.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: registerRequest,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Registration Succesfull",
      content: {
        "application/json": {
          schema: registerResponse,
        },
      },
    },
    409: {
      description: "This email is already registered",
    },
    400: {
      description:
        "Validation of request body failed. Read error cause for details",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/login",
  tags: ["Auth"],
  description: "Start session with registered user",
  request: {
    body: {
      content: {
        "application/json": {
          schema: loginRequest,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Login succesfull - session started",
      content: {
        "application/json": {
          schema: loginResponse,
        },
      },
    },
    401: {
      description: "Invalid email or password",
    },
    400: {
      description:
        "Validation of request body failed. Read error cause for details",
    },
  },
});
