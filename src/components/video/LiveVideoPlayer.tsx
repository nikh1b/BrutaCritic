import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

interface VideoPlayerProps {
    durationInSeconds: number;
    width?: number;
    height?: number;
    children: (currentTime: number) => React.ReactNode;
    audioSrc?: string;
}

export function LiveVideoPlayer({ durationInSeconds, width = 640, height = 360, children, audioSrc }: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize Audio
    useEffect(() => {
        if (audioSrc) {
            audioRef.current = new Audio(audioSrc);
            audioRef.current.volume = 0.5;
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [audioSrc]);

    // Handle Play/Pause of Audio
    useEffect(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // Game Loop / Clock
    useEffect(() => {
        let animationFrame: number;
        let lastTime: number;

        const loop = (timestamp: number) => {
            if (!lastTime) lastTime = timestamp;
            const deltaTime = (timestamp - lastTime) / 1000;
            lastTime = timestamp;

            if (isPlaying) {
                // If audio is present, use it as the source of truth for time
                if (audioRef.current) {
                    setCurrentTime(audioRef.current.currentTime);
                    if (audioRef.current.ended || audioRef.current.currentTime >= durationInSeconds) {
                        setIsPlaying(false);
                        audioRef.current.pause();
                        audioRef.current.currentTime = 0;
                        setCurrentTime(0);
                    }
                } else {
                    // Fallback to delta time
                    setCurrentTime(prev => {
                        const next = prev + deltaTime;
                        if (next >= durationInSeconds) {
                            setIsPlaying(false);
                            return 0; // Loop or Stop
                        }
                        return next;
                    });
                }
            }
            animationFrame = requestAnimationFrame(loop);
        };

        animationFrame = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationFrame);
    }, [isPlaying, durationInSeconds]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    const reset = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    return (
        <div className="flex flex-col gap-4 items-center">
            <div
                className="relative bg-black overflow-hidden rounded-xl border border-zinc-800 shadow-2xl"
                style={{ width, height }}
            >
                {children(currentTime)}

                {/* Overlay Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center gap-4">
                    <button onClick={togglePlay} className="text-white hover:text-critic-green">
                        {isPlaying ? <Pause /> : <Play />}
                    </button>
                    <button onClick={reset} className="text-white hover:text-bruta-red">
                        <RotateCcw size={18} />
                    </button>
                    {/* Timeline */}
                    <div className="flex-1 h-1 bg-zinc-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-critic-green"
                            style={{ width: `${(currentTime / durationInSeconds) * 100}%` }}
                        />
                    </div>
                    <span className="text-xs font-mono text-white">
                        {currentTime.toFixed(1)}s / {durationInSeconds}s
                    </span>
                </div>
            </div>
        </div>
    );
}
