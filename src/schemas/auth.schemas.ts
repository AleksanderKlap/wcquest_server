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

const authSchemas = {
  RegisterInput: registerInput,
  RegisterSuccessResponse: registerSuccessResponse,
};

export default authSchemas;
