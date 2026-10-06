import type { CookieOptions, Request } from "express";

export function getSessionCookieOptions(req: Request): CookieOptions {
  const isLocalhost = Boolean(
    req.hostname === "localhost" ||
    req.hostname === "127.0.0.1" ||
    req.headers.host?.includes("localhost") ||
    req.headers.host?.includes("127.0.0.1")
  );
  const isSecure = !isLocalhost && (req.secure || req.headers["x-forwarded-proto"] === "https");
  return {
    httpOnly: true,
    path: "/",
    sameSite: isSecure ? "none" : "lax",
    secure: isSecure,
  };
}
