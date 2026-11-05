import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Imported archive data (npm run data:import) is read at build and revalidation time.
  outputFileTracingIncludes: {
    "/**": ["./data/archive.json"],
  },
};

export default nextConfig;
