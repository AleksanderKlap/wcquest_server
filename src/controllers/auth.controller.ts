import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import { generateToken } from "../services/jwt.service";
import bcrypt from "bcryptjs";
import passport from "../config/passport";
import CustomError from "../errors/custom-error.error";
import { User as PrismaUser } from "@prisma/client";
import { text } from "stream/consumers";
// import { sendVerificationEmail } from "../services/verify-email.service";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      throw new CustomError("This email is already in use", 400);
    const hashedPassword = await bcrypt.hash(password, 10);
    const created = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
      const profile = await tx.profile.create({
        data: {
          userId: user.id,
        },
      });
      return { user, profile };
    });

    res.status(201).json({
      message: "Registration succesfull, you can login now",
      user: {
        id: created.user.id,
        email: created.user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new CustomError("Invalid email or password.", 401);
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) throw new CustomError("Invalid email or password.", 401);
    const jwttoken = generateToken({
      id: user.id,
      email: user.email,
    });
    res.status(200).json({
      message: "Login succesfull",
      jwttoken,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {}
};

// export const verifyEmail = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   const { token } = req.query;
//   try {
//     const email = verifyEmailToken(token as string);
//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) throw new CustomError("Email not found", 404);
//     await prisma.user.update({
//       where: { email },
//       data: { email_verified: true },
//     });
//     res.status(200).json({
//       message: "email verified, you can login now",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user! as PrismaUser;
    if (!user) {
      throw new CustomError("Authentication failed: No User Found", 401);
    }
    const token = generateToken({ id: user.id, email: user.email });
    res.json({ token: token, user: { id: user.id, email: user.email } });
  } catch (error) {
    next(error);
  }
};
