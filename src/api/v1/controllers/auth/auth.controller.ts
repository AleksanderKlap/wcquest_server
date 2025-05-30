import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import db from "../../../config/database";
import { eq } from "drizzle-orm";
import {
  profile,
  user,
  refreshToken as refreshTokenTable,
} from "../../../db/schemas/schema";
import CustomError from "../../../errors/custom-error.error";
import {
  generateRefreshToken,
  generateToken,
  UserPayload,
} from "../../../services/jwt.service";
import {
  LoginResponse,
  RefreshTokenResponse,
  RegisterResponse,
} from "../schemas/auth.schema";
import jwt from "jsonwebtoken";

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

  const jwtRefreshToken = generateRefreshToken({
    id: found.id,
    email: found.email,
  });
  const decoded = jwt.decode(jwtRefreshToken) as { exp?: number } | null;
  if (!decoded?.exp) {
    throw new CustomError("Could not decode JWT exp date", 500);
  }
  const expiresAt = new Date(decoded.exp * 1000);

  const existingRefreshToken = await db.query.refreshToken.findFirst({
    where: eq(refreshTokenTable.userId, found.id),
  });

  if (!existingRefreshToken) {
    await db.insert(refreshTokenTable).values({
      userId: found.id,
      refreshToken: jwtRefreshToken,
      expiresAt,
    });
  } else {
    await db
      .update(refreshTokenTable)
      .set({
        refreshToken: jwtRefreshToken,
        expiresAt,
      })
      .where(eq(refreshTokenTable.userId, found.id));
  }
  const loginResponse: LoginResponse = {
    message: "Login succesfull",
    token: jwttoken,
    refreshToken: jwtRefreshToken,
    user: {
      id: found.id,
      email: found.email,
    },
  };

  res.status(200).json(loginResponse);
};

export const refreshTokenEndpoint = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new CustomError("Refresh token required", 400);

  let decoded: UserPayload;

  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as UserPayload;
  } catch (err: any) {
    if (err.name === "TokenExpiredError")
      throw new CustomError("Expired token", 401);
    throw new CustomError("Invalid token", 403);
  }

  const dbRefreshToken = await db.query.refreshToken.findFirst({
    where: eq(refreshTokenTable.userId, decoded.id),
  });
  if (!dbRefreshToken) throw new CustomError("Refresh token not found", 403);
  if (dbRefreshToken.expiresAt < new Date())
    throw new CustomError("DB token expired, log in again", 401);

  if (dbRefreshToken.refreshToken !== refreshToken)
    throw new CustomError("Refresh token missmatch", 403);

  const newAccessToken = generateToken({
    id: decoded.id,
    email: decoded.email,
  });
  const newRefreshToken = generateRefreshToken({
    id: decoded.id,
    email: decoded.email,
  });

  const decodedNewRefresh = jwt.decode(newRefreshToken) as {
    exp?: number;
  } | null;
  if (!decodedNewRefresh?.exp)
    throw new CustomError("Could not decode JWT exp date", 500);
  const expiresAt = new Date(decodedNewRefresh.exp * 1000);

  await db
    .update(refreshTokenTable)
    .set({
      refreshToken: newRefreshToken,
      expiresAt,
    })
    .where(eq(refreshTokenTable.userId, decoded.id));

  const response: RefreshTokenResponse = {
    message: "Tokens refreshed successfully",
    token: newAccessToken,
    refreshToken: newRefreshToken,
  };

  res.status(200).json(response);
};
