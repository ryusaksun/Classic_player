// 音乐轨道类型
export interface Track {
    id: string;
    title: {
        zh: string;
        en: string;
    };
    composer: string;
    opus?: string;
    year?: number;
    duration: number; // 秒
    category: MusicCategory;
    audioUrl: string;
    coverImage?: string;
    history: {
        background: string;    // 创作背景
        context: string;       // 时代背景
        analysis?: string;     // 音乐分析
    };
}

// 音乐分类
export type MusicCategory =
    | 'baroque'     // 巴洛克 (1600-1750)
    | 'classical'   // 古典 (1750-1820)
    | 'romantic'    // 浪漫 (1820-1900)
    | 'modern'      // 近现代 (1900-今)
    | 'impressionist'; // 印象派

// 作曲家类型
export interface Composer {
    id: string;
    name: {
        zh: string;
        en: string;
    };
    period: MusicCategory;
    birthYear: number;
    deathYear?: number;
    nationality: string;
    portrait?: string;
    biography: string;
    famousWorks: string[];
}

// 播放器状态
export interface PlayerState {
    currentTrack: Track | null;
    isPlaying: boolean;
    currentTime: number;
    volume: number;
    isMuted: boolean;
    playlist: Track[];
    playlistIndex: number;
    repeatMode: 'none' | 'one' | 'all';
    isShuffled: boolean;
}

// 分类显示信息
export const CATEGORY_INFO: Record<MusicCategory, { zh: string; en: string; period: string }> = {
    baroque: { zh: '巴洛克', en: 'Baroque', period: '1600-1750' },
    classical: { zh: '古典主义', en: 'Classical', period: '1750-1820' },
    romantic: { zh: '浪漫主义', en: 'Romantic', period: '1820-1900' },
    impressionist: { zh: '印象派', en: 'Impressionist', period: '1875-1925' },
    modern: { zh: '近现代', en: 'Modern', period: '1900-今' },
};
