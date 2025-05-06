import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "./prisma/prisma";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = await profile.emails?.[0].value;
        if (!email) {
          return done(new Error("No email found in google profile"));
        }
        let user = await prisma.user.findFirst({
          where: {
            OR: [
              { google_id: profile.id },
              { email: profile.emails![0].value },
            ],
          },
        });
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.emails![0].value,
              google_id: profile.id,
            },
          });
        } else if (!user.google_id) {
          user = await prisma.user.update({
            where: { email: profile.emails![0].value },
            data: { google_id: profile.id },
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error as Error, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
