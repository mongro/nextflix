import { PrismaClient } from "./generated/prisma/client";
//import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaNeon } from "@prisma/adapter-neon";
import dotenv from "dotenv";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

dotenv.config();
const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

//const prisma = globalForPrisma.prisma || new PrismaClient();

//if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

export * from "./generated/prisma/client";
