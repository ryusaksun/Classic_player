import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "Classic Player | 古典音乐唱片播放器",
    description: "聆听经典，感受历史。一个复古拟真的古典音乐播放器，带您穿越时空，探索每一首经典背后的故事。",
    keywords: ["古典音乐", "唱片播放器", "巴赫", "贝多芬", "肖邦", "莫扎特", "Classical Music", "Vinyl Player"],
    authors: [{ name: "Classic Player" }],
    openGraph: {
        title: "Classic Player | 古典音乐唱片播放器",
        description: "聆听经典，感受历史。探索经典音乐背后的故事。",
        type: "website",
        locale: "zh_CN",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-CN">
            <head>
                <link rel="icon" href="/favicon.ico" />
                <meta name="theme-color" content="#3d2314" />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
