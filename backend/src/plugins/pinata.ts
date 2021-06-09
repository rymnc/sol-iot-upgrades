import fp from "fastify-plugin";
import PinataSDK, { PinataClient } from "@pinata/sdk";

interface PinataOptions {}

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
