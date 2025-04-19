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
    token: {
      type: "string",
      example:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNzQ1MDUzMjkxLCJleHAiOjE3NDUwNjA0OTF9.hM1x8Yg3avz9alajiPQ9XUwASwFZ3ejk594doV0Pqso",
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
