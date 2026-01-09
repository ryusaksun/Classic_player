'use client';

import { useState, useEffect, useMemo } from 'react';
import CoverPlayer from '@/components/CoverPlayer/CoverPlayer';
import MusicInfo from '@/components/MusicInfo';
import { useAudioPlayer } from '@/hooks';
import { Track, Composer } from '@/types';
import musicCatalog from '@/data/music-catalog.json';
import composersData from '@/data/composers.json';
import './page.css';

export default function Home() {
    const {
        isPlaying,
        currentTime,
        duration,
        volume,
        currentTrack,
        togglePlay,
        seek,
        setVolume,
        playTrack,
        playNext,
        playPrev,
        setPlaylist,
    } = useAudioPlayer();

    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

    // 初始化播放列表
    useEffect(() => {
        const tracks = musicCatalog.tracks as Track[];
        setPlaylist(tracks);
        if (tracks.length > 0) {
            setSelectedTrack(tracks[0]);
        }
    }, [setPlaylist]);

    // 更新当前播放的曲目状态，如果自动切歌了
    useEffect(() => {
        if (currentTrack) {
            setSelectedTrack(currentTrack);
        }
    }, [currentTrack]);

    // 获取当前曲目对应的作曲家信息
    const currentComposer = useMemo(() => {
        if (!selectedTrack) return null;
        return composersData.composers.find(
            (c) => c.id === selectedTrack.composer
        ) as Composer | undefined || null;
    }, [selectedTrack]);

    // 处理曲目选择
    const handleTrackSelect = (track: Track) => {
        setSelectedTrack(track);
        playTrack(track); // 点击即播放
    };

    return (
        <main className="main-container">
            {/* 左侧：播放器区域 */}
            <section className="player-section">
                <div className="player-wrapper">
                    <CoverPlayer
                        currentTrack={selectedTrack}
                        isPlaying={isPlaying}
                        currentTime={currentTime}
                        duration={duration || selectedTrack?.duration || 0}
                        volume={volume}
                        onPlayPause={togglePlay}
                        onPrev={playPrev}
                        onNext={playNext}
                        onSeek={seek}
                        onVolumeChange={setVolume}
                    />
                </div>

                {/* 播放列表 */}
                <div className="playlist-section">
                    <h3 className="playlist-title">TRACK LIST</h3>
                    <ul className="playlist">
                        {(musicCatalog.tracks as Track[]).map((track) => (
                            <li
                                key={track.id}
                                className={`playlist-item ${selectedTrack?.id === track.id ? 'active' : ''}`}
                                onClick={() => handleTrackSelect(track)}
                            >
                                <div className="playlist-item-info">
                                    <span className="playlist-item-title">{track.title.zh}</span>
                                    <span className="playlist-item-composer">
                                        {composersData.composers.find(c => c.id === track.composer)?.name.zh || track.composer}
                                    </span>
                                </div>
                                {selectedTrack?.id === track.id && isPlaying && (
                                    <span className="playing-indicator">OPEN</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* 右侧：音乐信息 */}
            <section className="info-section">
                <MusicInfo
                    track={selectedTrack}
                    composer={currentComposer}
                />
            </section>
        </main>
    );
}
