import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import db from "../../../config/database";
import { eq } from "drizzle-orm";
import { profile, user } from "../../../db/schemas/schema";
import CustomError from "../../../errors/custom-error.error";
import { generateToken } from "../../../services/jwt.service";
import { RegisterResponse } from "../schemas/auth.schema";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  if (existingUser) throw new CustomError("This email is aready in use", 409);
  const hashedPassword = await bcrypt.hash(password, 10);

  const created = await db.transaction(async (tx) => {
    const [inserted] = await tx
      .insert(user)
      .values({ email, password: hashedPassword })
      .returning();
    const [newProfile] = await tx
      .insert(profile)
      .values({ userId: inserted.id })
      .returning();
    return { user: inserted, profile: newProfile };
  });

  const toReturn: RegisterResponse = {
    message: "Registration successful, you can login now",
    user: {
      email: created.user.email,
    },
  };
  res.status(201).json(toReturn);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const found = await db.query.user.findFirst({
    where: eq(user.email, email),
  });
  if (!found) throw new CustomError("Invalid email or password.", 401);
  const isMatch = await bcrypt.compare(password, found.password!);
  if (!isMatch) throw new CustomError("Invalid email or password.", 401);
  const jwttoken = generateToken({
    id: found.id,
    email: found.email,
  });
  res.status(200).json({
    message: "Login succesfull",
    jwttoken,
    user: {
      id: found.id,
      email: found.email,
    },
  });
};
