import fp from "fastify-plugin";
import PinataSDK, { PinataClient } from "@pinata/sdk";

interface PinataOptions {}

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      PINATA_KEY: string;
      PINATA_SECRET: string;
    }
  }
}

export default fp<PinataOptions>(async (fastify, opts) => {
  const client: PinataClient = PinataSDK(
    process.env.PINATA_KEY,
    process.env.PINATA_SECRET
  );
  fastify.decorate("pinata", client);
});

declare module "fastify" {
  export interface FastifyInstance {
    pinata: PinataClient;
  }
}
