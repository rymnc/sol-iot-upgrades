import { FastifyPluginAsync } from "fastify";
import {
  Login,
  LoginType,
  LoginResponse,
  LoginResponseType,
  Signup,
  SignupResponse,
  SignupResponseType,
  SignupType,
} from "./schemas";
import { compare, hash } from "bcrypt";
import { lookup } from "geoip-country";

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", async (request, reply) => {
    return { auth: true };
  });

  fastify.post<{ Body: SignupType; Response: SignupResponseType }>(
    "/signup",
    {
      schema: {
        body: Signup,
        response: {
          200: SignupResponse,
        },
      },
    },
    async (request, reply) => {
      const { email, firstName, lastName, password } = request.body;
      try {
        await fastify.db.users.create({
          data: {
            email,
            firstName,
            lastName,
            password: await hash(password, 10),
          },
        });
        reply.status(200).send({ signedUp: true });
      } catch (e) {
        console.log(e);
        await reply.conflict("User exists");
      }
    }
  );

  fastify.post<{ Body: LoginType; Response: LoginResponseType }>(
    "/login",
    {
      schema: {
        body: Login,
        response: {
          200: LoginResponse,
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;
      const user = await fastify.db.users.findUnique({
        where: {
          email,
        },
      });
      if (user === null) {
        reply.unauthorized("Invalid Email/Password");
      } else if (await compare(password, user.password)) {
        const { firstName, lastName, email, id } = user;
        const token = await fastify.jwt.sign(
          { firstName, lastName, email },
          { expiresIn: "15m" }
        );
        // add to login history
        await fastify.db.loginHistory.create({
          data: {
            userId: id,
            active: true,
            token: await hash(token, 5),
            ip: request.ip,
            hostname: request.hostname,
            location: lookup(request.ip)?.country ?? "N/A",
          },
        });
        reply.status(200).send({ token });
      }
      reply.status(200).send({ auth: true });
    }
  );

  fastify.get(
    "/logout",
    {
      schema: {
        response: {
          204: {
            type: "boolean",
          },
        },
      },
    },
    async (request, reply) => {
      if (request.headers.authorization === undefined) {
        reply.status(401).send("Invalid header");
      } else {
        await request.jwtVerify();
        await fastify.db.loginHistory.update({
          data: {
            active: false,
            logoutAt: new Date(),
          },
          where: {
            token: request.headers.authorization?.split("Bearer ")[1],
          },
        });
        reply.status(204).send(true);
      }
    }
  );

  fastify.get(
    "/validate",
    {
      schema: {
        response: {
          200: {
            type: "boolean",
          },
        },
      },
    },
    async (request, reply) => {
      try {
        await request.jwtVerify();
        reply.status(200).send(true);
      } catch (e) {
        reply.status(200).send(false);
      }
    }
  );
};

export default auth;
