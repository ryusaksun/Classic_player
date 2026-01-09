'use client';

import React from 'react';
import { Track, Composer, CATEGORY_INFO } from '@/types';
import './MusicInfo.css';

// 音符图标
const MusicNoteIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
);

// 日历图标
const CalendarIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
    </svg>
);

interface MusicInfoProps {
    track: Track | null;
    composer?: Composer | null;
}

export default function MusicInfo({ track, composer }: MusicInfoProps) {
    // 未选择曲目时的占位状态
    if (!track) {
        return (
            <div className="music-info">
                <div className="info-placeholder">
                    <div className="placeholder-icon">
                        <MusicNoteIcon />
                    </div>
                    <h3 className="placeholder-title">选择一首曲目</h3>
                    <p className="placeholder-text">
                        从音乐库中选择曲目，探索其背后的历史故事
                    </p>
                </div>
            </div>
        );
    }

    const categoryInfo = CATEGORY_INFO[track.category];

    return (
        <div className="music-info fade-in">
            {/* 标题区域 */}
            <header className="info-header">
                <h1 className="info-title">{track.title.zh}</h1>
                <p className="info-title-en">{track.title.en}</p>

                <div className="info-meta">
                    {track.opus && (
                        <span className="opus-badge">{track.opus}</span>
                    )}
                    {track.year && (
                        <span className="info-meta-item">
                            <CalendarIcon />
                            {track.year}年
                        </span>
                    )}
                    <span className="category-tag">
                        {categoryInfo.zh} · {categoryInfo.period}
                    </span>
                </div>
            </header>

            {/* 作曲家卡片 */}
            <div className="composer-card">
                <div className="composer-portrait">
                    {composer?.portrait ? (
                        <img src={composer.portrait} alt={composer.name.zh} />
                    ) : (
                        <span className="composer-portrait-placeholder">
                            {track.composer.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
                <div className="composer-info">
                    <h3 className="composer-name">
                        {composer?.name.zh || track.composer}
                    </h3>
                    {composer?.name.en && (
                        <p className="composer-name-en">{composer.name.en}</p>
                    )}
                    {composer && (
                        <p className="composer-years">
                            {composer.birthYear} - {composer.deathYear || '至今'}
                        </p>
                    )}
                </div>
            </div>

            {/* 创作背景 */}
            {track.history.background && (
                <section className="info-section">
                    <h2 className="section-title">创作背景</h2>
                    <p className="section-content">{track.history.background}</p>
                </section>
            )}

            {/* 时代背景 */}
            {track.history.context && (
                <section className="info-section">
                    <h2 className="section-title">时代背景</h2>
                    <p className="section-content">{track.history.context}</p>
                </section>
            )}

            {/* 音乐分析 */}
            {track.history.analysis && (
                <section className="info-section">
                    <h2 className="section-title">音乐分析</h2>
                    <div className="quote-block">
                        <p className="section-content">{track.history.analysis}</p>
                    </div>
                </section>
            )}

            {/* 作曲家简介 */}
            {composer?.biography && (
                <section className="info-section">
                    <h2 className="section-title">作曲家简介</h2>
                    <p className="section-content">{composer.biography}</p>
                </section>
            )}
        </div>
    );
}
