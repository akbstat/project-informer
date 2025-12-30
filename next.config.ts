import type { NextConfig } from "next";
import { BASE_PATH } from "@/constant";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: BASE_PATH,
  /* config options here */
};

export default nextConfig;
