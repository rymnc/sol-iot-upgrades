import { FastifyPluginAsync } from "fastify";

const devices: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/health", async function (request, reply) {
    reply.status(200).send({ devices: true });
  });
};

export default devices;
