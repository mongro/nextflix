import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "./generated/prisma/client";
import { nextCookies } from "better-auth/next-js";

const prisma = new PrismaClient();

export const auth = betterAuth({
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false, // don't allow user to set role
      },
      lang: {
        type: "string",
        required: true,
        defaultValue: "en",
      },
      months: {
        type: "number",
        required: false,
        defaultValue: "en",
      },
    },
  },
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true, verifyEmail: false },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
