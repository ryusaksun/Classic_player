import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // 启用 standalone 输出模式，用于 Docker 部署
    output: 'standalone',
    // 允许从 R2 加载音频和图片
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*.r2.dev",
            },
            {
                protocol: "https",
                hostname: "*.cloudflare.com",
            },
        ],
    },
};

export default nextConfig;
