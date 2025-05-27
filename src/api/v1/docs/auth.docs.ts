import {
  loginRequest,
  loginResponse,
  refreshTokenRequest,
  refreshTokenResponse,
  registerRequest,
  registerResponse,
} from "../schemas/auth.schema";
import { registry } from "./registry.docs";

registry.register("RegisterRequest", registerRequest);
registry.register("RegisterResponse", registerResponse);
registry.register("LoginRequest", loginRequest);
registry.register("LoginResponse", loginResponse);
registry.register("RefreshTokenRequest", refreshTokenRequest);
registry.register("RefreshTokenResponse", refreshTokenResponse);

registry.registerPath({
  method: "post",
  path: "/api/v1/auth/register",
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
  path: "/api/v1/auth/login",
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

registry.registerPath({
  method: "post",
  path: "/api/v1/auth/refreshtoken",
  tags: ["Auth"],
  description:
    "Refresh token, accepts jwt-refresh-token and responds with new refresh token and new access jwt token.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: refreshTokenRequest,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Refresh token succesfull",
      content: {
        "application/json": {
          schema: refreshTokenResponse,
        },
      },
    },
    401: {
      description:
        "Refresh token is expired - than u need to login for new one",
    },
    403: {
      description:
        "Refresh token is invalid - or there is mismatch with refresh token on DB and aquired from client",
    },
    400: {
      description:
        "Validation of request body failed. Read error cause for details",
    },
  },
});
