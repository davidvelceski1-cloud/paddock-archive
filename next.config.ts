import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Imported archive data (npm run data:import) and photo credits (npm run photos:fetch)
  // are read at build and revalidation time.
  outputFileTracingIncludes: {
    "/**": ["./data/archive.json", "./data/photos.json"],
  },
};

export default nextConfig;
