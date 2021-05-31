import fp from "fastify-plugin";
import { create } from "ipfs-http-client";
import type { IPFS } from "ipfs-core-types";

interface IpfsOptions {}

export default fp<IpfsOptions>(async (fastify, opts) => {
  const client = create({ url: process.env.IPFS_HOST });
  fastify.decorate("ipfs", client);
});

declare module "fastify" {
  export interface FastifyInstance {
    ipfs: IPFS;
  }
}
