import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";

export interface DbOptions {}

export default fp<DbOptions>(async (fastify, opts) => {
  const client = new PrismaClient();
  fastify.decorate("db", client);
});

declare module "fastify" {
  export interface FastifyInstance {
    db: PrismaClient;
  }
}
