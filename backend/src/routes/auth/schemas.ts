import { Static, Type } from "@sinclair/typebox";

const Login = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String(),
});
type LoginType = Static<typeof Login>;

const LoginResponse = Type.Object({
  token: Type.String(),
});
type LoginResponseType = Static<typeof LoginResponse>;

const Signup = Type.Object({
  firstName: Type.String(),
  lastName: Type.String(),
  email: Type.String({ format: "email" }),
  password: Type.String({
    minLength: 8,
    maxLength: 20,
  }),
});
type SignupType = Static<typeof Signup>;

const SignupResponse = Type.Object({
  signedUp: Type.Boolean(),
});
type SignupResponseType = Static<typeof SignupResponse>;

export {
  Login,
  LoginType,
  LoginResponse,
  LoginResponseType,
  Signup,
  SignupType,
  SignupResponse,
  SignupResponseType,
};
