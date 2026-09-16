import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compression is nginx's job in production (see deploy/nginx-sinag.conf).
  // Doing it in Node ties up the single Next process for every response, and
  // nginx is both faster at it and free to do it in parallel. Vercel likewise
  // compresses at the edge, so this is the right setting on either host.
  compress: false,
};

export default nextConfig;
