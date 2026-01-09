'use client';

import React from 'react';
import { Track, Composer, CATEGORY_INFO } from '@/types';
import './MusicInfo.css';

// 日历图标
const CalendarIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
    </svg>
);

// 音符图标
const MusicNoteIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
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
                        从曲目列表中选择，探索其背后的历史故事
                    </p>
                </div>
            </div>
        );
    }

    const categoryInfo = CATEGORY_INFO[track.category];

    // 合并所有历史内容为一个完整的文章
    const combinedContent = [
        track.history.background,
        track.history.context,
        track.history.analysis
    ].filter(Boolean).join('\n\n');

    return (
        <div className="music-info fade-in">
            {/* 内容容器 - 居中 */}
            <div className="info-content-wrapper">
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

                {/* 作曲家信息 - 简化为一行 */}
                <div className="composer-line">
                    <span className="composer-avatar">
                        {track.composer.charAt(0).toUpperCase()}
                    </span>
                    <span className="composer-name-inline">
                        {composer?.name.zh || track.composer}
                    </span>
                    {composer && (
                        <span className="composer-years-inline">
                            ({composer.birthYear} - {composer.deathYear || '至今'})
                        </span>
                    )}
                </div>

                {/* 合并的内容区域 */}
                <article className="content-article">
                    {combinedContent.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="article-paragraph">
                            {paragraph}
                        </p>
                    ))}
                </article>

                {/* 作曲家简介（如果有） */}
                {composer?.biography && (
                    <aside className="composer-bio">
                        <p className="bio-text">{composer.biography}</p>
                    </aside>
                )}
            </div>
        </div>
    );
}
