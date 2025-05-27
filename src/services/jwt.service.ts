import jwt, { JwtPayload } from "jsonwebtoken";

export interface UserPayload {
  id: number;
  email: string;
}

export const generateToken = (user: UserPayload): string => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn: "2h",
    }
  );
};

export const generateRefreshToken = (user: UserPayload): string => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "30d" }
  );
};

export const generateEmailToken = (email: string): string => {
  return jwt.sign({ email }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "12h",
  });
};

export const verifyEmailToken = (token: string): string => {
  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
    email: string;
  };
  return decoded.email;
};
