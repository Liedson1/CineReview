import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",       // geralmente vazio
        pathname: "/t/p/**", // aceita qualquer caminho após /t/p/
      },
    ],
  },
};

export default nextConfig;
