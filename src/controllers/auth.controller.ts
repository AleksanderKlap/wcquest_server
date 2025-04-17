import { Request, Response } from "express";
import prisma from "../prisma";
import { generateToken } from "../services/jwt";
import bcrypt from "bcrypt";
import passport from "../config/passport";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "This email is already registered" });
      return;
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
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const token = generateToken({ id: user.id, email: user.email });
    res.json({ token: token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: "Authentication failed" });
  }
};
