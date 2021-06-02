import { FastifyPluginAsync } from "fastify";

const pinata: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/health", async function (request, reply) {
    const auth = await fastify.pinata.testAuthentication();
    reply.status(200).send(auth);
  });
};

export default pinata;
