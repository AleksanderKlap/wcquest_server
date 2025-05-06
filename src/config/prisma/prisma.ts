import { PrismaClient } from "@prisma/client";
import { createToiletExtention } from "./extentions/toilet/create.prisma-extention";

export const p = new PrismaClient();

const prisma = p.$extends(createToiletExtention);

export default prisma;
