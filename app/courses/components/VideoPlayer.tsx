"use client"
import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {formatDuration} from "@/app/courses/utils/lessonHelpers";

const SAVE_INTERVAL_SECONDS = 5;
const SPEEDS = [0.5, 1, 1.5, 2];
const AUTOPLAY_COUNTDOWN_SECONDS = 20;

export interface NextLessonPreview {
    title: string;
    content?: string;
    thumbnail?: string;
}

export default function VideoPlayer({src, videoKey, initialSeconds, onProgress, onEnded, nextLesson, onPlayNext, lessonDate}: {
    src: string;
    videoKey: number;
    initialSeconds: number;
    onProgress: (seconds: number) => void;
    onEnded: (durationSeconds: number) => void;
    nextLesson?: NextLessonPreview | null;
    onPlayNext?: () => void;
    lessonDate?: string;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const lastSavedRef = useRef(0);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [speedOpen, setSpeedOpen] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [ended, setEnded] = useState(false);
    const [countdown, setCountdown] = useState(AUTOPLAY_COUNTDOWN_SECONDS);

    useEffect(() => {
        lastSavedRef.current = 0;
        setPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        setSpeed(1);
        setEnded(false);
        setCountdown(AUTOPLAY_COUNTDOWN_SECONDS);
    }, [videoKey]);

    useEffect(() => {
        if (!ended || !nextLesson || !onPlayNext) return;
        if (countdown <= 0) {
            onPlayNext();
            return;
        }
        const t = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [ended, countdown, nextLesson, onPlayNext]);

    function togglePlay() {
        const v = videoRef.current;
        if (!v) return;
        if (ended) {
            v.currentTime = 0;
            setEnded(false);
        }
        if (v.paused) v.play(); else v.pause();
    }

    function skip(delta: number) {
        const v = videoRef.current;
        if (!v || !v.duration) return;
        v.currentTime = Math.min(Math.max(0, v.currentTime + delta), v.duration);
    }

    function handleLoadedMetadata() {
        const v = videoRef.current;
        if (!v) return;
        setDuration(v.duration);
        if (initialSeconds > 0 && initialSeconds < v.duration) v.currentTime = initialSeconds;
    }

    function handleTimeUpdate() {
        const v = videoRef.current;
        if (!v) return;
        setCurrentTime(v.currentTime);
        if (v.currentTime - lastSavedRef.current >= SAVE_INTERVAL_SECONDS) {
            lastSavedRef.current = v.currentTime;
            onProgress(v.currentTime);
        }
    }

    function handleEnded() {
        setPlaying(false);
        setEnded(true);
        setCountdown(AUTOPLAY_COUNTDOWN_SECONDS);
        onEnded(videoRef.current?.duration ?? duration);
    }

    function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
        const v = videoRef.current;
        if (!v || !v.duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        v.currentTime = pct * v.duration;
        setCurrentTime(v.currentTime);
        setEnded(false);
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) containerRef.current?.requestFullscreen();
        else document.exitFullscreen();
    }

    function changeSpeed(s: number) {
        const v = videoRef.current;
        if (v) v.playbackRate = s;
        setSpeed(s);
        setSpeedOpen(false);
    }

    const watchedPct = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div ref={containerRef} className="relative w-full aspect-video rounded-[12px] overflow-hidden bg-black border border-[#2C2F31] group">
            <video
                ref={videoRef}
                key={videoKey}
                src={src}
                className="w-full h-full"
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onClick={togglePlay}
            />

            {ended && nextLesson ? (
                <div className="absolute inset-0 bg-black/55">
                    {lessonDate && (
                        <p className="absolute top-[16px] left-[16px] text-[#9DA1A3] text-[13px] font-poppins">{lessonDate}</p>
                    )}

                    <div className="absolute left-[24px] right-[24px] bottom-[92px] flex items-center justify-between gap-[24px]">
                        <div className="min-w-0 max-w-[400px]">
                            <p className="text-[#9DA1A3] text-[13px] font-poppins mb-[6px]">Keyingisi:</p>
                            <h3 className="text-[#f7f9fa] text-[18px] font-bold font-poppins mb-[10px] truncate">{nextLesson.title}</h3>
                            {nextLesson.content && (
                                <p className="text-[#9DA1A3] text-[13px] leading-[20px] font-poppins line-clamp-3">
                                    {nextLesson.content}
                                </p>
                            )}
                        </div>

                        <div className="shrink-0 flex flex-col items-start gap-[8px]">
                            <p className="text-[13px] font-poppins whitespace-nowrap">
                                <span className="text-[#1c92e0] font-semibold">{countdown}</span>{" "}
                                <span className="text-[#9DA1A3]">soniyada o'ynaydi</span>
                            </p>
                            <button
                                onClick={() => onPlayNext?.()}
                                className="relative w-[260px] h-[153px] rounded-[12px] bg-[#14171A] border border-white/10 overflow-hidden flex items-center justify-center"
                            >
                                {nextLesson.thumbnail && (
                                    <>
                                        <Image src={nextLesson.thumbnail} alt="" fill className="object-cover"/>
                                        <div className="absolute inset-0 bg-black/35"/>
                                    </>
                                )}
                                <span className="absolute inset-0 flex items-center justify-center">
                                    <span className="w-9 h-9 rounded-full bg-white/25 border border-white/40 backdrop-blur-sm flex items-center justify-center">
                                        <Image src="/icon-video-play.svg" alt="" width={18} height={19} className="ml-[2px]"/>
                                    </span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            ) : !playing && (
                <button
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/20"
                >
                    <span className="w-16 h-16 rounded-full bg-black/40 flex items-center justify-center">
                        <Image src="/icon-video-play.svg" alt="" width={36} height={36}/>
                    </span>
                </button>
            )}

            <div className="absolute bottom-0 left-0 right-0 px-[16px] pb-[10px] pt-[24px] bg-gradient-to-t from-black/70 to-transparent">
                <div
                    className="relative h-[4px] rounded-[6px] bg-[#64696d]/20 cursor-pointer mb-[14px]"
                    onClick={handleSeek}
                >
                    <div className="absolute top-0 left-0 h-full rounded-[6px] bg-[#1c92e0]" style={{width: `${watchedPct}%`}}/>
                    <div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[12px] h-[12px] rounded-full bg-white"
                        style={{left: `${watchedPct}%`}}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[16px]">
                        <button onClick={() => skip(-10)} className="w-[24px] h-[24px] flex items-center justify-center scale-x-[-1]">
                            <Image src="/icon-skip.svg" alt="" width={24} height={24}/>
                        </button>
                        <button onClick={togglePlay} className="w-[24px] h-[24px] flex items-center justify-center">
                            <Image src={playing ? "/icon-pause.svg" : "/icon-video-play.svg"} alt="" width={24} height={24}/>
                        </button>
                        <button onClick={() => skip(10)} className="w-[24px] h-[24px] flex items-center justify-center">
                            <Image src="/icon-skip.svg" alt="" width={24} height={24}/>
                        </button>
                        <div className="flex items-center gap-[8px] ml-[12px]">
                            <span className="text-[#f7f9fa] text-[14px] font-poppins">{formatDuration(currentTime)}</span>
                            <span className="w-px h-[16px] bg-[#f7f9fa]/30"/>
                            <span className="text-[#f7f9fa]/70 text-[14px] font-poppins">{formatDuration(duration)}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-[16px] relative">
                        <button onClick={() => setSpeedOpen(!speedOpen)} className="w-[24px] h-[24px] flex items-center justify-center">
                            <Image src="/icon-settings-gear.svg" alt="" width={20} height={20}/>
                        </button>
                        {speedOpen && (
                            <div className="absolute bottom-[32px] right-[32px] bg-[#1a1d1f] border border-[#232627] rounded-[8px] py-1 w-[80px] z-10">
                                {SPEEDS.map(s => (
                                    <div
                                        key={s}
                                        onClick={() => changeSpeed(s)}
                                        className={`px-3 py-1.5 text-[13px] cursor-pointer hover:bg-white/5 ${speed === s ? "text-[#202020]" : "text-[#D0DCE8]"}`}
                                    >
                                        {s}x
                                    </div>
                                ))}
                            </div>
                        )}
                        <button onClick={toggleFullscreen} className="w-[24px] h-[24px] flex items-center justify-center">
                            <Image src="/icon-fullscreen.svg" alt="" width={20} height={20}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
