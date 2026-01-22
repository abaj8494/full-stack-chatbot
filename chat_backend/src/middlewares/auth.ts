import type { Context, Next } from "hono";
import { env } from "hono/adapter";
import { jwt } from "hono/jwt";
import { API_PREFIX } from "../constants";
import { AUTH_PREFIX, LOGIN_ROUTE, REGISTER_ROUTE } from "../controllers/auth";

import type { APIUser } from "../models/api";

interface Env {
  JWT_SECRET: string;
}

export async function checkJWTAuth(c: Context<{ Bindings: Env }>, next: Next) {
  if (
    c.req.path === API_PREFIX + AUTH_PREFIX + LOGIN_ROUTE ||
    c.req.path === API_PREFIX + AUTH_PREFIX + REGISTER_ROUTE
  ) {
    await next();
    return;
  }

  const { JWT_SECRET } = env<{ JWT_SECRET: string }>(c);
  const jwtMiddleware = jwt({
    secret: JWT_SECRET,
    alg: "HS256",
  });

  return await jwtMiddleware(c, next);
}

export async function attachUserId(c: Context, next: Next) {
  const payload = c.get("jwtPayload") as APIUser | undefined;
  if (payload) {
    c.set("userId", payload.id);
  }
  await next();
}
