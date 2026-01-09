'use client';

import React from 'react';
import { Track } from '@/types';
import './VinylPlayer.css';

// SVG 图标组件
const PlayIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const PauseIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
);

const PrevIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
    </svg>
);

const NextIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
);

const VolumeIcon = ({ muted }: { muted: boolean }) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        {muted ? (
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
        ) : (
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        )}
    </svg>
);

interface VinylPlayerProps {
    currentTrack: Track | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isMuted: boolean;
    onPlayPause: () => void;
    onPrev: () => void;
    onNext: () => void;
    onSeek: (time: number) => void;
    onVolumeChange: (volume: number) => void;
    onMuteToggle: () => void;
}

// 格式化时间 (秒 -> mm:ss)
function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function VinylPlayer({
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    onPlayPause,
    onPrev,
    onNext,
    onSeek,
    onVolumeChange,
    onMuteToggle,
}: VinylPlayerProps) {
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        onSeek(percent * duration);
    };

    return (
        <div className="vinyl-player">
            {/* 唱片机底座 */}
            <div className="player-cabinet">
                {/* 转盘区域 */}
                <div className="turntable">
                    {/* 转盘底座 */}
                    <div className="platter-base" />

                    {/* 唱片 */}
                    <div
                        className={`vinyl-disc ${isPlaying ? 'vinyl-spinning' : ''}`}
                    >
                        {/* 唱片中心标签 */}
                        <div className="vinyl-label">
                            <span className="label-title">
                                {currentTrack?.title?.zh || 'Classic Player'}
                            </span>
                            <span className="label-composer">
                                {currentTrack?.composer || '选择一首曲目'}
                            </span>
                        </div>
                    </div>

                    {/* 唱针臂 */}
                    <div className="tonearm-container">
                        <div className={`tonearm ${isPlaying ? 'playing' : ''}`}>
                            <div className="tonearm-base" />
                            <div className="tonearm-arm">
                                <div className="tonearm-head">
                                    <div className="stylus" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* LED 指示灯 */}
                <div className={`led-indicator ${isPlaying ? 'active led-active' : ''}`} />
            </div>

            {/* 曲目信息 */}
            {currentTrack && (
                <div className="track-info">
                    <h2 className="track-title">{currentTrack.title.zh}</h2>
                    <p className="track-composer">{currentTrack.composer}</p>
                </div>
            )}

            {/* 进度条 */}
            <div className="progress-container">
                <div className="progress-bar" onClick={handleProgressClick}>
                    <div
                        className="progress-fill"
                        style={{ width: `${progressPercent}%` }}
                    />
                    <div
                        className="progress-handle"
                        style={{ left: `${progressPercent}%` }}
                    />
                </div>
                <div className="time-display">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* 控制面板 */}
            <div className="controls-panel">
                {/* 音量控制 */}
                <div className="volume-control">
                    <button className="control-btn-sm" onClick={onMuteToggle}>
                        <VolumeIcon muted={isMuted} />
                    </button>
                    <input
                        type="range"
                        className="volume-slider"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    />
                </div>

                {/* 播放控制 */}
                <button className="control-btn" onClick={onPrev}>
                    <PrevIcon />
                </button>

                <button className="control-btn primary" onClick={onPlayPause}>
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>

                <button className="control-btn" onClick={onNext}>
                    <NextIcon />
                </button>
            </div>
        </div>
    );
}
