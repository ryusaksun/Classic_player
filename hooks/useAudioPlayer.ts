'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Track, PlayerState } from '@/types';

interface UseAudioPlayerReturn {
    // 状态
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isMuted: boolean;
    currentTrack: Track | null;
    playlist: Track[];

    // 控制方法
    play: () => void;
    pause: () => void;
    togglePlay: () => void;
    seek: (time: number) => void;
    setVolume: (volume: number) => void;
    toggleMute: () => void;
    playTrack: (track: Track) => void;
    playNext: () => void;
    playPrev: () => void;
    setPlaylist: (tracks: Track[]) => void;
}

export function useAudioPlayer(): UseAudioPlayerReturn {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [playlist, setPlaylistState] = useState<Track[]>([]);
    const [playlistIndex, setPlaylistIndex] = useState(-1);

    // 初始化 Audio 元素
    useEffect(() => {
        if (typeof window !== 'undefined') {
            audioRef.current = new Audio();
            audioRef.current.volume = volume;

            // 事件监听
            const audio = audioRef.current;

            const handleTimeUpdate = () => {
                setCurrentTime(audio.currentTime);
            };

            const handleLoadedMetadata = () => {
                setDuration(audio.duration);
            };

            const handleEnded = () => {
                setIsPlaying(false);
                // 自动播放下一首
                if (playlistIndex < playlist.length - 1) {
                    playNextInternal();
                }
            };

            const handlePlay = () => setIsPlaying(true);
            const handlePause = () => setIsPlaying(false);

            audio.addEventListener('timeupdate', handleTimeUpdate);
            audio.addEventListener('loadedmetadata', handleLoadedMetadata);
            audio.addEventListener('ended', handleEnded);
            audio.addEventListener('play', handlePlay);
            audio.addEventListener('pause', handlePause);

            return () => {
                audio.removeEventListener('timeupdate', handleTimeUpdate);
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audio.removeEventListener('ended', handleEnded);
                audio.removeEventListener('play', handlePlay);
                audio.removeEventListener('pause', handlePause);
                audio.pause();
            };
        }
    }, []);

    // 内部播放下一首（避免循环依赖）
    const playNextInternal = useCallback(() => {
        if (playlist.length === 0) return;
        const nextIndex = (playlistIndex + 1) % playlist.length;
        setPlaylistIndex(nextIndex);
        const nextTrack = playlist[nextIndex];
        setCurrentTrack(nextTrack);

        if (audioRef.current) {
            audioRef.current.src = nextTrack.audioUrl;
            audioRef.current.play().catch(console.error);
        }
    }, [playlist, playlistIndex]);

    // 播放
    const play = useCallback(() => {
        if (audioRef.current && currentTrack) {
            audioRef.current.play().catch(console.error);
        }
    }, [currentTrack]);

    // 暂停
    const pause = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    }, []);

    // 切换播放/暂停
    const togglePlay = useCallback(() => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    }, [isPlaying, play, pause]);

    // 跳转进度
    const seek = useCallback((time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    }, []);

    // 设置音量
    const setVolume = useCallback((vol: number) => {
        setVolumeState(vol);
        if (audioRef.current) {
            audioRef.current.volume = vol;
        }
        if (vol > 0 && isMuted) {
            setIsMuted(false);
        }
    }, [isMuted]);

    // 切换静音
    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            if (audioRef.current) {
                audioRef.current.muted = !prev;
            }
            return !prev;
        });
    }, []);

    // 播放指定曲目
    const playTrack = useCallback((track: Track) => {
        setCurrentTrack(track);

        // 在播放列表中找到索引
        const index = playlist.findIndex(t => t.id === track.id);
        if (index !== -1) {
            setPlaylistIndex(index);
        }

        if (audioRef.current) {
            audioRef.current.src = track.audioUrl;
            audioRef.current.play().catch(console.error);
        }
    }, [playlist]);

    // 下一首
    const playNext = useCallback(() => {
        playNextInternal();
    }, [playNextInternal]);

    // 上一首
    const playPrev = useCallback(() => {
        if (playlist.length === 0) return;

        // 如果播放超过3秒，重新播放当前曲目
        if (currentTime > 3) {
            seek(0);
            return;
        }

        const prevIndex = playlistIndex <= 0 ? playlist.length - 1 : playlistIndex - 1;
        setPlaylistIndex(prevIndex);
        const prevTrack = playlist[prevIndex];
        setCurrentTrack(prevTrack);

        if (audioRef.current) {
            audioRef.current.src = prevTrack.audioUrl;
            audioRef.current.play().catch(console.error);
        }
    }, [playlist, playlistIndex, currentTime, seek]);

    // 设置播放列表
    const setPlaylist = useCallback((tracks: Track[]) => {
        setPlaylistState(tracks);
        if (tracks.length > 0 && !currentTrack) {
            setCurrentTrack(tracks[0]);
            setPlaylistIndex(0);
        }
    }, [currentTrack]);

    return {
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        currentTrack,
        playlist,
        play,
        pause,
        togglePlay,
        seek,
        setVolume,
        toggleMute,
        playTrack,
        playNext,
        playPrev,
        setPlaylist,
    };
}
