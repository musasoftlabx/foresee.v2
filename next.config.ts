import type { NextConfig } from "next";
import dayjs from "dayjs";

const nextConfig: NextConfig = {
  /* config options here */
  generateBuildId: async () => `${dayjs().format("DDMMYYYY-HH")}`,
  poweredByHeader: false,
  reactCompiler: true,
  typedRoutes: true,
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "75.119.137.225", port: "3333" },
      { protocol: "https", hostname: "images.generated.photos" },
      { protocol: "https", hostname: "flagcdn.com" },
    ],
  },
};

export default nextConfig;
