import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

const isGithubPages =
  process.env.GITHUB_ACTIONS || process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isGithubPages ? "export" : undefined,
  reactStrictMode: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.ppy.sh",
      },
    ],
  },
  basePath: isGithubPages ? "/Web-Osu-Mania" : "",
  assetPrefix: isGithubPages ? "/Web-Osu-Mania" : "",
};

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

export default nextConfig;
