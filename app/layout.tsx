import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "Classic Player | 古典音乐播放器",
    description: "聆听经典，感受历史。一个极简设计的古典音乐播放器，带您探索每一首经典背后的故事。",
    keywords: ["古典音乐", "音乐播放器", "巴赫", "贝多芬", "肖邦", "莫扎特", "Classical Music"],
    authors: [{ name: "Classic Player" }],
    openGraph: {
        title: "Classic Player | 古典音乐播放器",
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
                <meta name="theme-color" content="#000000" />
                {/* Google Fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Noto+Serif+SC:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
