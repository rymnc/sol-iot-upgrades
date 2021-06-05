import { FastifyPluginAsync } from "fastify";

const pinata: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/health", async function (request, reply) {
    const auth = await fastify.pinata.testAuthentication();
    console.log(auth);
    reply.status(200).send(auth);
  });
};

export default pinata;
