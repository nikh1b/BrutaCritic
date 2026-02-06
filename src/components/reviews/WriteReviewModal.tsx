import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Clock, Send, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

interface WriteReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    preselectedGame?: string;
}

const games = [
    { id: "elden_ring", title: "Elden Ring", emoji: "🗡️" },
    { id: "baldurs_gate_3", title: "Baldur's Gate 3", emoji: "🧙" },
    { id: "starfield", title: "Starfield", emoji: "🚀" },
    { id: "cyberpunk_2077", title: "Cyberpunk 2077", emoji: "🤖" },
    { id: "hollow_knight", title: "Hollow Knight", emoji: "🦋" },
    { id: "gta_v", title: "GTA V", emoji: "🚗" },
    { id: "minecraft", title: "Minecraft", emoji: "⛏️" },
    { id: "valorant", title: "Valorant", emoji: "🎯" },
];

export function WriteReviewModal({ isOpen, onClose, preselectedGame }: WriteReviewModalProps) {
    const { user, isAuthenticated } = useAuth();
    const [selectedGame, setSelectedGame] = useState(preselectedGame || "");
    const [score, setScore] = useState<number>(7);
    const [content, setContent] = useState("");
    const [playtime, setPlaytime] = useState<number>(10);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        if (!selectedGame || !content.trim()) {
            setError("Please select a game and write your review");
            return;
        }

        if (content.trim().length < 50) {
            setError("Review must be at least 50 characters");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const { error: submitError } = await supabase.from('reviews').insert({
                game_id: selectedGame,
                user_id: user?.id,
                content: content.trim(),
                score,
                playtime_at_review: playtime * 60,
                proof_of_play_verified: true
            });

            if (submitError) throw submitError;

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setContent("");
                setSelectedGame("");
            }, 1500);
        } catch (e) {
            console.error(e);
            setError("Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl my-8"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-critic-green/20 rounded-xl flex items-center justify-center">
                                <Star className="w-5 h-5 text-critic-green" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white">Write a Review</h2>
                                <p className="text-xs text-text-muted">Share your honest thoughts</p>
                            </div>
                        </div>
                        <Button variant="ghost" onClick={onClose} className="p-2">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {!isAuthenticated ? (
                            <div className="text-center py-8">
                                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-bruta-red" />
                                <p className="text-white font-bold mb-2">Sign in required</p>
                                <p className="text-text-muted text-sm">You must be signed in to write a review</p>
                            </div>
                        ) : success ? (
                            <div className="text-center py-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-16 h-16 bg-critic-green/20 rounded-full flex items-center justify-center mx-auto mb-4"
                                >
                                    <Star className="w-8 h-8 text-critic-green" />
                                </motion.div>
                                <p className="text-xl font-bold text-white">Review Submitted!</p>
                                <p className="text-text-muted text-sm">Thank you for your contribution</p>
                            </div>
                        ) : (
                            <>
                                {/* Game Selection */}
                                <div>
                                    <label className="text-sm font-bold text-white mb-2 block">Select Game</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {games.map((game) => (
                                            <button
                                                key={game.id}
                                                onClick={() => setSelectedGame(game.id)}
                                                className={`p-3 rounded-xl border text-left transition-all ${selectedGame === game.id
                                                    ? "bg-critic-green/20 border-critic-green text-white"
                                                    : "bg-zinc-800 border-zinc-700 text-text-muted hover:border-zinc-600"
                                                    }`}
                                            >
                                                <span className="text-lg mr-2">{game.emoji}</span>
                                                <span className="text-xs font-bold">{game.title}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Score */}
                                <div>
                                    <label className="text-sm font-bold text-white mb-2 block">
                                        Your Score: <span className="text-critic-green">{score}/10</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={score}
                                        onChange={(e) => setScore(parseInt(e.target.value))}
                                        className="w-full accent-critic-green h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-text-muted mt-1">
                                        <span>1 (Terrible)</span>
                                        <span>5 (Average)</span>
                                        <span>10 (Masterpiece)</span>
                                    </div>
                                </div>

                                {/* Playtime */}
                                <div>
                                    <label className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Hours Played: <span className="text-critic-green">{playtime}h</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="500"
                                        value={playtime}
                                        onChange={(e) => setPlaytime(parseInt(e.target.value))}
                                        className="w-full accent-critic-green h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>

                                {/* Review Content */}
                                <div>
                                    <label className="text-sm font-bold text-white mb-2 block">Your Review</label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Share your honest thoughts about the game... (minimum 50 characters)"
                                        rows={5}
                                        className="w-full p-4 bg-background border border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-critic-green/50 resize-none"
                                    />
                                    <div className="text-xs text-text-muted mt-1 text-right">
                                        {content.length} characters
                                    </div>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="p-3 bg-bruta-red/10 border border-bruta-red/30 rounded-lg text-bruta-red text-sm flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </div>
                                )}

                                {/* Submit */}
                                <Button
                                    variant="primary"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !selectedGame || content.length < 50}
                                    className="w-full bg-critic-green text-black hover:bg-critic-green/80 disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 mr-2" />
                                            Submit Review
                                        </>
                                    )}
                                </Button>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
