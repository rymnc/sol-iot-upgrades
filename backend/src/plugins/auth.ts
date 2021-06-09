import fp from "fastify-plugin";
import { FastifyReply, FastifyRequest } from "fastify";
import {} from "fastify-jwt";

export interface AuthOptions {}

const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
};

export default fp<AuthOptions>(async (fastify, opts) => {
  fastify.register(require("fastify-jwt"), {
    secret: process.env.JWT_SECRET,
  });

  fastify.decorate("authenticate", authenticate);
});

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: typeof authenticate;
  }
}
