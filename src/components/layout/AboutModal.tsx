import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import { X } from "lucide-react";

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-3xl bg-surface border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden"
                    >
                        {/* Close Button */}
                        <div className="absolute top-6 right-6 z-20">
                            <Button variant="ghost" onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full">
                                <X className="w-6 h-6 text-text-muted" />
                            </Button>
                        </div>

                        {/* Background Texture */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#BEF264_1px,transparent_1px)] [background-size:16px_16px]" />
                        </div>

                        <div className="relative z-10 space-y-10">
                            {/* Header */}
                            <div className="space-y-4">
                                <h2 className="text-sm font-mono text-critic-green tracking-widest uppercase">
                                    // Origin Story
                                </h2>
                                <h3 className="text-4xl md:text-6xl font-black font-display tracking-tighter leading-none text-text-primary">
                                    FED UP WITH <br />
                                    <span className="text-bruta-red">FAKE REVIEWS.</span>
                                </h3>
                            </div>

                            {/* Narrative */}
                            <div className="space-y-6 text-lg text-text-muted font-body leading-relaxed">
                                <p>
                                    I’ve been holding a controller since the era of blowing into cartridges.
                                    <strong className="text-text-primary"> 18 years later</strong>, I’m still here, watching pixels turn into poetry and games turn into life-like masterpieces.
                                </p>
                                <p>
                                    But I watched as game journalism turned into paid PR.
                                    I saw a "Masterpiece" of a game get a 6.
                                    The connection between the critic and the gamer was broken.
                                </p>
                                <div className="pl-6 border-l-4 border-critic-green">
                                    <p className="text-xl md:text-2xl font-display font-bold text-text-primary italic">
                                        "I wanted reviews from people who actually played the game."
                                    </p>
                                </div>
                                <p>
                                    That's why I built <strong className="text-white">BrutaCritic</strong>.
                                    No paid shills. No bought scores. Just raw hours and real opinions.
                                    We verify the play, so you can unleash the truth.
                                </p>
                            </div>

                            {/* Footer/Signature */}
                            <div className="pt-6 border-t border-zinc-800 flex items-center justify-between">
                                <span className="font-mono text-xs text-zinc-500">EST. 2024 • SYSTEM ADMIN</span>
                                <Button onClick={onClose} variant="primary" className="bg-critic-green text-black hover:bg-critic-green/80">
                                    Understood
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
