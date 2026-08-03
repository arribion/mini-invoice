export const getCookieOptions = (maxAge) => {
  const isProd = process.env.NODE_ENV === "production";

  // Optional domain: set when frontend and API are subdomains of same root
  // e.g. process.env.COOKIE_DOMAIN = ".example.com"
  const domain = process.env.COOKIE_DOMAIN || undefined;

  return {
    httpOnly: true,
    secure: isProd, // must be true in production (HTTPS)
    sameSite: isProd ? "none" : "lax", // none for cross-site cookies
    maxAge,
    path: "/", // ensure cookie is sent to API routes
    domain, // undefined when not set
  };
};

export default getCookieOptions