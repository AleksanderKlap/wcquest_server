import { log } from "console";

const registerInput = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: {
      type: "string",
      format: "email",
      example: "user@gmail.com",
    },
    password: {
      type: "string",
      minLength: 6,
      example: "StrongPass123",
    },
  },
};

const registerSuccessResponse = {
  type: "object",
  properties: {
    message: {
      type: "string",
      example: "Registration succesfull, you can login now",
    },
    user: {
      type: "object",
      properties: {
        id: {
          type: "number",
          example: 124,
        },
        email: {
          type: "string",
          format: "email",
          example: "user@gmail.com",
        },
      },
    },
  },
};

const loginInput = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: {
      type: "string",
      format: "email",
      example: "user@gmail.com",
    },
    password: {
      type: "string",
      minLength: 6,
      example: "StrongPass123",
    },
  },
};

const loginSuccessResponse = {
  type: "object",
  properties: {
    message: {
      type: "string",
      example: "Login succesfull",
    },
    token: {
      type: "string",
      example: "jwt_token_string_here",
    },
    user: {
      type: "object",
      properties: {
        id: {
          type: "number",
          example: 124,
        },
        email: {
          type: "string",
          format: "email",
          example: "user@gmail.com",
        },
      },
    },
  },
};

const authSchemas = {
  RegisterInput: registerInput,
  RegisterSuccessResponse: registerSuccessResponse,
  LoginInput: loginInput,
  LoginSuccessResponse: loginSuccessResponse,
};

export default authSchemas;
