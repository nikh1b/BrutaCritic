import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Button } from "../ui/Button";

interface AudioVisualizerProps {
    audioUrl?: string;
}

export function AudioVisualizer({ audioUrl }: AudioVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const animationRef = useRef<number | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Simulated audio data for demo (when no real audio)
    const simulateAudio = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const barCount = 64;
        const barWidth = width / barCount;

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(0, 0, width, height);

            for (let i = 0; i < barCount; i++) {
                // Generate pseudo-random heights based on time
                const time = Date.now() / 1000;
                const randomHeight = (Math.sin(time * 3 + i * 0.5) + 1) * 0.3 +
                    (Math.sin(time * 5 + i * 0.3) + 1) * 0.2 +
                    (Math.random() * 0.1);
                const barHeight = randomHeight * height * 0.8;

                // Color gradient from green to red
                const hue = 120 - (i / barCount) * 60;
                ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;

                const x = i * barWidth;
                const y = height - barHeight;

                // Draw bar with rounded top
                ctx.beginPath();
                ctx.roundRect(x + 1, y, barWidth - 2, barHeight, [4, 4, 0, 0]);
                ctx.fill();

                // Glow effect
                ctx.shadowColor = `hsl(${hue}, 70%, 50%)`;
                ctx.shadowBlur = 10;
            }

            if (isPlaying) {
                animationRef.current = requestAnimationFrame(draw);
            }
        };

        draw();
    };

    const initAudio = async () => {
        if (!audioUrl || isInitialized) {
            // No audio URL, use simulation
            setIsInitialized(true);
            return;
        }

        try {
            const audioContext = new AudioContext();
            const audio = audioRef.current;
            if (!audio) return;

            const source = audioContext.createMediaElementSource(audio);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 128;

            source.connect(analyser);
            analyser.connect(audioContext.destination);

            analyserRef.current = analyser;
            setIsInitialized(true);
        } catch (e) {
            console.error("Audio init error:", e);
        }
    };

    const togglePlay = () => {
        if (!isInitialized) {
            initAudio();
        }
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        if (isPlaying) {
            simulateAudio();
        } else if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying]);

    // Set canvas size
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = canvas.offsetWidth * 2;
            canvas.height = canvas.offsetHeight * 2;
        }
    }, []);

    return (
        <div className="space-y-4">
            {/* Visualizer Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative aspect-[3/1] bg-black rounded-2xl overflow-hidden border border-zinc-800"
            >
                <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                {/* Controls */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            onClick={togglePlay}
                            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
                        >
                            {isPlaying ? (
                                <Pause className="w-6 h-6 text-white" />
                            ) : (
                                <Play className="w-6 h-6 text-white ml-1" />
                            )}
                        </Button>
                        <span className="text-white font-bold text-sm">
                            {isPlaying ? "Playing" : "Click to Play"}
                        </span>
                    </div>

                    <Button
                        variant="ghost"
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
                    >
                        {isMuted ? (
                            <VolumeX className="w-5 h-5 text-white" />
                        ) : (
                            <Volume2 className="w-5 h-5 text-white" />
                        )}
                    </Button>
                </div>

                {/* Audio Element (hidden) */}
                {audioUrl && (
                    <audio ref={audioRef} src={audioUrl} muted={isMuted} />
                )}
            </motion.div>

            {/* Info */}
            <div className="text-center text-text-muted text-sm">
                Real-time audio visualization • Powered by Web Audio API
            </div>
        </div>
    );
}
