'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseVinylSoundProps {
    isPlaying: boolean;
    volume?: number;      // 主音量
    noiseGain?: number;   // 底噪增益 (0-1)，默认 0.05
    crackleGain?: number; // 爆豆增益 (0-1)，默认 0.08
}

export function useVinylSound({
    isPlaying,
    volume = 1,
    noiseGain = 0.06,
    crackleGain = 0.08,
}: UseVinylSoundProps) {
    const audioContextRef = useRef<AudioContext | null>(null);
    const hissNodeRef = useRef<AudioBufferSourceNode | null>(null);
    const crackleNodeRef = useRef<ScriptProcessorNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);

    // 初始化 AudioContext
    useEffect(() => {
        if (typeof window !== 'undefined' && !audioContextRef.current) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                audioContextRef.current = new AudioContext();
                // 创建主增益节点
                const gainNode = audioContextRef.current.createGain();
                gainNode.connect(audioContextRef.current.destination);
                gainNodeRef.current = gainNode;
            }
        }

        return () => {
            audioContextRef.current?.close();
        };
    }, []);

    // 更新总音量
    useEffect(() => {
        if (gainNodeRef.current) {
            // 底噪音量随主音量变化，但有一个基础值
            gainNodeRef.current.gain.setTargetAtTime(volume, audioContextRef.current!.currentTime, 0.1);
        }
    }, [volume]);

    // 生成粉红噪音 (Pink Noise) - 模拟底噪 Hiss
    const createPinkNoise = useCallback((context: AudioContext) => {
        const bufferSize = 4096 * 4; // 足够长以避免循环感
        const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
        const data = buffer.getChannelData(0);

        let b0, b1, b2, b3, b4, b5, b6;
        b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            data[i] *= 0.11; // 基础衰减
            b6 = white * 0.115926;
        }

        return buffer;
    }, []);

    // 处理播放状态
    useEffect(() => {
        const context = audioContextRef.current;
        if (!context || !gainNodeRef.current) return;

        if (isPlaying) {
            if (context.state === 'suspended') {
                context.resume();
            }

            // 1. 创建并播放 Hiss 底噪
            if (!hissNodeRef.current) {
                const hissBuffer = createPinkNoise(context);
                const hissSource = context.createBufferSource();
                hissSource.buffer = hissBuffer;
                hissSource.loop = true;

                // Hiss 专属 Gain，经过低通滤波让声音更柔和
                const hissGain = context.createGain();
                hissGain.gain.value = noiseGain;

                const lowPass = context.createBiquadFilter();
                lowPass.type = 'lowpass';
                lowPass.frequency.value = 8000; // 适当的高频衰减

                hissSource.connect(lowPass);
                lowPass.connect(hissGain);
                hissGain.connect(gainNodeRef.current);

                hissSource.start();
                hissNodeRef.current = hissSource;
            }

            // 2. 创建 Crackle 爆豆声
            if (!crackleNodeRef.current) {
                // 使用 ScriptProcessor 生成随机爆音 (已废弃但兼容性好，简单场景足够)
                const bufferSize = 4096;
                const crackleNode = context.createScriptProcessor(bufferSize, 1, 1);

                crackleNode.onaudioprocess = (e) => {
                    const output = e.outputBuffer.getChannelData(0);
                    for (let i = 0; i < bufferSize; i++) {
                        // 随机产生爆豆，概率很低
                        if (Math.random() > 0.9994) {
                            // 随机强度
                            output[i] = (Math.random() * 2 - 1) * crackleGain;
                        } else {
                            output[i] = 0;
                        }
                    }
                };

                crackleNode.connect(gainNodeRef.current);
                crackleNodeRef.current = crackleNode;
            }

            // 淡入
            gainNodeRef.current.gain.cancelScheduledValues(context.currentTime);
            gainNodeRef.current.gain.setValueAtTime(0, context.currentTime);
            gainNodeRef.current.gain.linearRampToValueAtTime(volume, context.currentTime + 1.5); // 1.5秒淡入，模拟唱针落下

        } else {
            // 停止播放：淡出
            if (gainNodeRef.current) {
                gainNodeRef.current.gain.cancelScheduledValues(context.currentTime);
                gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, context.currentTime);
                gainNodeRef.current.gain.linearRampToValueAtTime(0, context.currentTime + 0.5);

                setTimeout(() => {
                    if (hissNodeRef.current) {
                        try { hissNodeRef.current.stop(); } catch (e) { }
                        hissNodeRef.current.disconnect();
                        hissNodeRef.current = null;
                    }
                    if (crackleNodeRef.current) {
                        crackleNodeRef.current.disconnect();
                        crackleNodeRef.current = null;
                    }
                }, 500);
            }
        }
    }, [isPlaying, createPinkNoise, noiseGain, crackleGain, volume]);

    return {};
}
