# Classic Player - 古典音乐唱片播放器

一个复古拟真风格的古典音乐播放网站，左侧是仿真黑胶唱片播放器，右侧实时展示当前曲目的历史背景信息。

![Preview](./preview.png)

## ✨ 特色功能

- 🎵 **拟真唱片播放器** - 3D 旋转唱片、唱针臂动画、LED 指示灯
- 📜 **历史背景展示** - 每首曲目配有详细的创作背景、时代背景和音乐分析
- 🎨 **复古视觉设计** - 木纹质感、黄铜控制按钮、复古纸张效果
- 📱 **响应式布局** - 完美适配桌面和移动设备

## 🛠️ 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Vanilla CSS (自定义设计系统)
- **音频托管**: Cloudflare R2
- **部署**: Vercel

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

### 构建生产版本

```bash
npm run build
```

## 📁 项目结构

```
Classic_player/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页
│   └── page.css            # 首页样式
├── components/             # React 组件
│   ├── VinylPlayer/        # 唱片播放器
│   └── MusicInfo/          # 音乐信息面板
├── data/                   # 数据文件
│   ├── music-catalog.json  # 曲目目录
│   └── composers.json      # 作曲家信息
├── hooks/                  # 自定义 Hooks
│   └── useAudioPlayer.ts   # 音频播放控制
├── styles/                 # 全局样式
│   ├── globals.css         # 全局样式
│   ├── vintage-theme.css   # 复古主题变量
│   └── animations.css      # 动画定义
└── types/                  # TypeScript 类型
    └── music.ts            # 音乐相关类型
```

## 🎼 添加音乐

1. 将音频文件上传到 Cloudflare R2
2. 在 `data/music-catalog.json` 中添加曲目信息：

```json
{
  "id": "unique-track-id",
  "title": {
    "zh": "中文标题",
    "en": "English Title"
  },
  "composer": "composer-id",
  "opus": "Op. X",
  "year": 1800,
  "duration": 300,
  "category": "romantic",
  "audioUrl": "https://your-r2-bucket.r2.dev/path/to/audio.mp3",
  "history": {
    "background": "创作背景...",
    "context": "时代背景...",
    "analysis": "音乐分析..."
  }
}
```

## 🌐 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 设置环境变量：
   - `NEXT_PUBLIC_R2_BASE_URL`: 你的 R2 存储桶 URL

## 📄 许可证

MIT License

---

Made with ♪ for classical music lovers
