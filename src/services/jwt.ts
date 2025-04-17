import jwt from "jsonwebtoken";

interface UserPayload {
  id: number;
  email: string;
}

export const generateToken = (user: UserPayload): string => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: "2h",
  });
};
