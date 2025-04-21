import { Request, Response, NextFunction } from "express";
import { UserPayload } from "../services/jwt.service";
import CustomError from "../errors/custom-error.error";
import jwt from "jsonwebtoken";

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("authorization");
  if (!authHeader) throw new CustomError("No token", 403);
  console.log(authHeader);
  jwt.verify(authHeader, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) throw new CustomError("Invalid token", 403);
    req.authUser = decoded as UserPayload;
    next();
  });
};

export default verifyJWT;
