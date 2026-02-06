import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import { X, Gamepad2, Shield, Zap } from "lucide-react";

interface JoinResistanceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function JoinResistanceModal({ isOpen, onClose }: JoinResistanceModalProps) {
    const platforms = [
        {
            name: "Steam",
            icon: "🎮",
            color: "bg-[#1b2838]",
            hoverColor: "hover:bg-[#2a3f56]",
            url: "/api/auth/steam"
        },
        {
            name: "Epic Games",
            icon: "⚡",
            color: "bg-[#2f2f2f]",
            hoverColor: "hover:bg-[#3f3f3f]",
            url: "/api/auth/epic"
        },
        {
            name: "Xbox",
            icon: "🎯",
            color: "bg-[#107c10]",
            hoverColor: "hover:bg-[#1a9c1a]",
            url: "/api/auth/xbox"
        },
        {
            name: "PlayStation",
            icon: "🎲",
            color: "bg-[#003791]",
            hoverColor: "hover:bg-[#0050c8]",
            url: "/api/auth/playstation"
        }
    ];

    const handleConnect = (url: string) => {
        window.location.href = `http://localhost:3000${url}`;
    };

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
                        className="absolute inset-0 bg-black/95 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-md bg-surface border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Animated Border Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-critic-green/20 via-transparent to-bruta-red/20 opacity-50" />

                        {/* Header */}
                        <div className="relative p-6 border-b border-zinc-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="w-12 h-12 bg-bruta-red/20 rounded-2xl flex items-center justify-center"
                                    >
                                        <Shield className="w-6 h-6 text-bruta-red" />
                                    </motion.div>
                                    <div>
                                        <h2 className="text-xl font-black text-white">Join the Resistance</h2>
                                        <p className="text-sm text-text-muted">Prove you play. Earn trust.</p>
                                    </div>
                                </div>
                                <Button variant="ghost" onClick={onClose} className="p-2">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="relative p-6 space-y-4">
                            <p className="text-sm text-text-muted text-center mb-6">
                                Connect your gaming platform to verify your playtime and unlock your voice.
                            </p>

                            {/* Platform Buttons */}
                            <div className="space-y-3">
                                {platforms.map((platform, index) => (
                                    <motion.button
                                        key={platform.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => handleConnect(platform.url)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl border border-zinc-700 ${platform.color} ${platform.hoverColor} transition-all group`}
                                    >
                                        <span className="text-2xl">{platform.icon}</span>
                                        <span className="font-bold text-white flex-1 text-left">
                                            Connect {platform.name}
                                        </span>
                                        <Zap className="w-4 h-4 text-zinc-500 group-hover:text-critic-green transition-colors" />
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="relative p-4 border-t border-zinc-800 bg-zinc-900/50">
                            <div className="flex items-center gap-2 text-xs text-text-muted justify-center">
                                <Gamepad2 className="w-4 h-4" />
                                <span>Your data stays yours. We only verify playtime.</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
