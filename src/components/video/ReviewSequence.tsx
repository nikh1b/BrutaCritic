import { LiveVideoPlayer } from "./LiveVideoPlayer";
import { motion } from "framer-motion";
import musicTrack from "../../assets/sapan4-edm-gaming-music-335408.mp3";

export function ReviewSequence() {
    const DURATION = 18; // Extended for deeper reading time

    const GlitchText = ({ text, color = "text-white" }: { text: string, color?: string }) => (
        <div className="relative inline-block font-mono font-black tracking-tighter uppercase">
            <motion.span
                className={`absolute top-0 left-0 -ml-[2px] opacity-70 ${color}`}
                animate={{ x: [-2, 2, -1, 0], opacity: [0.7, 0] }}
                transition={{ repeat: Infinity, duration: 0.2, repeatDelay: 3 }}
            >
                {text}
            </motion.span>
            <motion.span
                className={`absolute top-0 left-0 ml-[2px] opacity-70 ${color}`}
                animate={{ x: [2, -2, 1, 0], opacity: [0.7, 0] }}
                transition={{ repeat: Infinity, duration: 0.2, repeatDelay: 2 }}
            >
                {text}
            </motion.span>
            <span className={`relative z-10 ${color}`}>{text}</span>
        </div>
    );

    return (
        <LiveVideoPlayer durationInSeconds={DURATION} audioSrc={musicTrack}>
            {(t) => (
                <div className="relative w-full h-full flex items-center justify-center bg-zinc-950 font-display overflow-hidden">

                    {/* Background Noise/Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_4px,3px_100%] pointer-events-none" />

                    {/* Scene 1: Branding (0s - 2s) */}
                    {t < 2 && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center z-10"
                        >
                            <h1 className="text-6xl font-black text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                                BRUTA<span className="text-critic-green">CRITIC</span>
                            </h1>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-2 bg-bruta-red mt-2"
                            />
                        </motion.div>
                    )}

                    {/* Scene 2: The Problem (2s - 5s) */}
                    {t >= 2 && t < 5 && (
                        <div className="text-center w-full px-8 z-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-2xl text-text-muted mb-4 font-mono uppercase tracking-widest"
                            >
                                &gt; SYSTEM_CHECK: <span className="text-white">VERIFICATION</span>
                            </motion.div>

                            <div className="flex justify-center gap-4 mb-6">
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-black border-2 border-zinc-800 p-6 flex flex-col items-center gap-2 shadow-[4px_4px_0px_white]"
                                >
                                    <span className="text-xs text-text-muted uppercase tracking-widest font-bold">Time Invested</span>
                                    <span className="text-4xl font-mono font-black text-white">0.4h</span>
                                    <motion.div
                                        initial={{ scale: 2, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.8 }}
                                        className="text-bruta-red font-black text-2xl border-2 border-bruta-red px-2 mt-2 -rotate-6"
                                    >
                                        REJECTED
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    )}

                    {/* Scene 3: The Manifesto (5s - 9s) */}
                    {t >= 5 && t < 9 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="px-8 text-center z-10 max-w-4xl"
                        >
                            <div className="flex flex-col gap-2">
                                <motion.div
                                    initial={{ x: -100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="text-4xl md:text-5xl font-black font-mono text-white text-left leading-none"
                                >
                                    NO <span className="bg-white text-black px-2">PAYCHECK</span>
                                </motion.div>
                                <motion.div
                                    initial={{ x: 100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-4xl md:text-5xl font-black font-mono text-zinc-500 text-right leading-none"
                                >
                                    FOR PRAISE
                                </motion.div>
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-5xl md:text-6xl font-black font-mono text-bruta-red mt-4 border-y-4 border-bruta-red py-2"
                                >
                                    <GlitchText text="JUST RAW HOURS" color="text-bruta-red" />
                                </motion.div>
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className="text-2xl font-bold text-white mt-2 tracking-[0.5em] text-center"
                                >
                                    FOR REAL REVIEWS
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {/* Scene 4: The Solution (9s - 13s) */}
                    {t >= 9 && t < 13 && (
                        <div className="text-center w-full relative z-10">
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="relative z-10"
                            >
                                <div className="inline-flex items-center gap-2 border-2 border-critic-green text-critic-green px-6 py-2 text-sm font-black uppercase tracking-widest mb-6 bg-black shadow-[4px_4px_0px_#BEF264]">
                                    <div className="w-3 h-3 bg-critic-green animate-pulse" />
                                    Verified: 142 Hours
                                </div>

                                <h3 className="text-4xl font-black text-white leading-none italic font-display">
                                    "BRUTAL, BUT<br /> FAIR."
                                </h3>

                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5, type: "spring", bounce: 0.6 }}
                                    className="mt-8 text-9xl font-black text-critic-green drop-shadow-[0_0_35px_rgba(190,242,100,0.6)]"
                                >
                                    8.9<span className="text-5xl text-white">/10</span>
                                </motion.div>
                            </motion.div>
                        </div>
                    )}

                    {/* Scene 5: Outro (13s - 18s) */}
                    {t >= 13 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="px-4 text-center z-10 w-full"
                        >
                            <div className="border-4 border-white p-8 max-w-3xl mx-auto bg-black/50 backdrop-blur-sm relative">
                                {/* Decorative Corners */}
                                <div className="absolute top-0 left-0 w-4 h-4 bg-white" />
                                <div className="absolute top-0 right-0 w-4 h-4 bg-white" />
                                <div className="absolute bottom-0 left-0 w-4 h-4 bg-white" />
                                <div className="absolute bottom-0 right-0 w-4 h-4 bg-white" />

                                <p className="text-3xl font-black text-white mb-6 uppercase tracking-tight">
                                    PUT <span className="bg-critic-green text-black px-2">SKIN IN THE GAME</span>
                                </p>

                                <div className="h-px w-full bg-zinc-700 my-6" />

                                <p className="text-2xl font-mono font-bold text-zinc-300 leading-relaxed">
                                    "<GlitchText text="WE VERIFY THE PLAY" />,<br />
                                    <span className="text-white">YOU UNLEASH THE TRUTH."</span>
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Persistent Watermark with Scanline */}
                    <div className="absolute top-4 right-4 text-[10px] font-mono text-zinc-500 z-20 flex gap-2">
                        <span className="animate-pulse">REC</span>
                        <span>{t.toFixed(2)}s</span>
                    </div>
                </div>
            )}
        </LiveVideoPlayer>
    );
}
