import { Request, Response, NextFunction } from "express";
import { UserPayload } from "../services/jwt.service";
import CustomError from "../errors/custom-error.error";
import jwt from "jsonwebtoken";

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("authorization");
  if (!authHeader) throw new CustomError("No token", 403);
  if (!authHeader.startsWith("Bearer "))
    throw new CustomError("Wrong token format", 403);

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_ACCESS_SECRET!, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError")
        throw new CustomError("Expired token", 401);
      else throw new CustomError("Invalid Token", 403);
    }

    req.authUser = decoded as UserPayload;
    next();
  });
};

export default verifyJWT;
