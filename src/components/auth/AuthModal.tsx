import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Chrome, Gamepad2, Zap } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const { signInWithGoogle } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        await signInWithGoogle();
        // Redirect happens automatically, so we don't need to do anything else
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25 }}
                        className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 text-center border-b border-zinc-800 bg-gradient-to-b from-zinc-800/50 to-transparent">
                            <motion.div
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="w-16 h-16 bg-gradient-to-br from-critic-green to-bruta-red rounded-2xl flex items-center justify-center mx-auto mb-4"
                            >
                                <Gamepad2 className="w-8 h-8 text-white" />
                            </motion.div>
                            <h2 className="text-2xl font-black text-white">Join the Resistance</h2>
                            <p className="text-text-muted text-sm mt-1">
                                Sign in to start reviewing games
                            </p>
                            <Button
                                variant="ghost"
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            {/* Google Sign In */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-3 p-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-100 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Chrome className="w-5 h-5" />
                                        Continue with Google
                                    </>
                                )}
                            </motion.button>

                            {/* Divider */}
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-px bg-zinc-800" />
                                <span className="text-xs text-zinc-600">or connect gaming platform</span>
                                <div className="flex-1 h-px bg-zinc-800" />
                            </div>

                            {/* Platform Options */}
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    variant="secondary"
                                    onClick={() => window.location.href = '/api/auth/steam'}
                                    className="flex items-center justify-center gap-2 py-3"
                                >
                                    <span className="text-lg">🎮</span>
                                    Steam
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => window.location.href = '/api/auth/epic'}
                                    className="flex items-center justify-center gap-2 py-3"
                                >
                                    <span className="text-lg">🎯</span>
                                    Epic Games
                                </Button>
                            </div>

                            {/* Benefits */}
                            <div className="mt-6 p-4 bg-zinc-800/50 rounded-xl space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <Zap className="w-4 h-4 text-critic-green" />
                                    <span className="text-text-muted">Earn reputation credits</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Zap className="w-4 h-4 text-critic-green" />
                                    <span className="text-text-muted">Write verified reviews</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Zap className="w-4 h-4 text-critic-green" />
                                    <span className="text-text-muted">Join the leaderboard</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-zinc-800 text-center">
                            <p className="text-xs text-zinc-600">
                                By signing in, you agree to our Terms & Privacy Policy
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
