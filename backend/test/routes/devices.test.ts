import { test } from "tap";
import { build } from "../helper";

test("device health route", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/devices/health",
  });
  t.same(JSON.parse(res.payload), { devices: true });
});
