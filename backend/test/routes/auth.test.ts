import { test } from "tap";
import { build } from "../helper";

test("[auth] sign up", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/auth/signup",
    payload: {
      firstName: "John",
      lastName: "Doe",
      email: "JohnDoe@gmail.com",
      password: "Test1234!",
    },
    method: "POST",
  });

  t.same(JSON.parse(res.payload), { signedUp: true });
});
