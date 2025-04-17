import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import { generateToken } from "../services/jwt";
import bcrypt from "bcrypt";
import passport from "../config/passport";
import CustomError from "../errors/custom-error.error";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new CustomError("This email is already in use", 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    const token = generateToken({ id: user.id, email: user.email });
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    if (!user) {
      throw new CustomError("Authentication failed: No User Found", 401);
    }
    const token = generateToken({ id: user.id, email: user.email });
    res.json({ token: token, user: { id: user.id, email: user.email } });
  } catch (error) {
    next(error);
  }
};
