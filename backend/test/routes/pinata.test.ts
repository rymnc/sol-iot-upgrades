import { test } from "tap";
import { build } from "../helper";

test("pinata health route", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/pinata/health",
  });
  t.same(JSON.parse(res.payload), { authenticated: true });
});
