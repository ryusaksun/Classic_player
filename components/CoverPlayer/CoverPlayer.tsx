import React, { useRef, useEffect } from 'react';
import { Track } from '@/types';
import './CoverPlayer.css';

interface CoverPlayerProps {
    currentTrack: Track | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    onPlayPause: () => void;
    onPrev: () => void;
    onNext: () => void;
    onSeek: (time: number) => void;
    onVolumeChange: (volume: number) => void;
}

const CoverPlayer: React.FC<CoverPlayerProps> = ({
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    onPlayPause,
    onPrev,
    onNext,
    onSeek,
}) => {
    const progressRef = useRef<HTMLDivElement>(null);

    // 格式化时间 mm:ss
    const formatTime = (time: number) => {
        if (!time || isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // 处理进度条点击
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (progressRef.current && duration > 0) {
            const rect = progressRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, x / rect.width));
            onSeek(percentage * duration);
        }
    };

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="cover-player">
            {/* 封面区域 */}
            <div className="cover-container">
                {currentTrack?.coverImage ? (
                    <img
                        src={currentTrack.coverImage}
                        alt={currentTrack.title.zh}
                        className="cover-image"
                    />
                ) : (
                    <div className="cover-placeholder">
                        {currentTrack ? currentTrack.title.en.charAt(0) : '♪'}
                    </div>
                )}
            </div>

            {/* 进度条 */}
            <div className="progress-container" onClick={handleProgressClick} ref={progressRef}>
                <div className="progress-track">
                    <div
                        className="progress-fill"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {/* 时间显示 */}
            <div className="time-display">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>

            {/* 控制按钮 */}
            <div className="controls-group">
                <button className="control-btn" onClick={onPrev} title="上一首">
                    <svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
                </button>

                <button
                    className={`control-btn main-play ${isPlaying ? 'playing' : ''}`}
                    onClick={onPlayPause}
                >
                    {isPlaying ? (
                        <svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                    ) : (
                        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    )}
                </button>

                <button className="control-btn" onClick={onNext} title="下一首">
                    <svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
                </button>
            </div>
        </div>
    );
};

export default CoverPlayer;
