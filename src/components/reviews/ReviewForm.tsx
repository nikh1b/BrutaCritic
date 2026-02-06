import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import { X, Star, Send, Gamepad2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

interface ReviewFormProps {
    isOpen: boolean;
    onClose: () => void;
    gameId?: string;
    gameTitle?: string;
}

export function ReviewForm({ isOpen, onClose, gameId = "unknown", gameTitle = "Unknown Game" }: ReviewFormProps) {
    const { user, isAuthenticated } = useAuth();
    const [score, setScore] = useState(7);
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (!isAuthenticated || !user) {
            alert("You must be logged in to submit a review.");
            return;
        }

        setIsSubmitting(true);

        try {
            const { error } = await supabase.from('reviews').insert({
                game_id: gameId,
                user_id: user.id,
                content: content,
                score: score,
                playtime_at_review: 0, // Would come from platform verification
                proof_of_play_verified: false
            });

            if (error) throw error;

            setSubmitted(true);
            setTimeout(() => {
                onClose();
                setSubmitted(false);
                setContent("");
                setScore(7);
            }, 2000);
        } catch (e) {
            console.error("Failed to submit review:", e);
            alert("Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
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
                        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-surface border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                                    <Gamepad2 className="w-5 h-5 text-critic-green" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{gameTitle}</h3>
                                    <p className="text-xs text-text-muted">Write your review</p>
                                </div>
                            </div>
                            <Button variant="ghost" onClick={onClose} className="p-2">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Score Selector */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-text-muted">Your Score</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={score}
                                        onChange={(e) => setScore(parseInt(e.target.value))}
                                        className="flex-1 accent-critic-green h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex items-center gap-1 px-3 py-1 bg-zinc-800 rounded-lg">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        <span className="font-bold text-white text-lg">{score}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Review Content */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-text-muted">Your Review</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="What did you think? Be honest, be brutal..."
                                    className="w-full h-32 p-4 bg-background border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 resize-none focus:outline-none focus:border-critic-green/50"
                                />
                            </div>

                            {/* Auth Warning */}
                            {!isAuthenticated && (
                                <div className="p-3 bg-bruta-red/10 border border-bruta-red/30 rounded-lg text-sm text-bruta-red">
                                    You must connect your gaming platform to submit a review.
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-zinc-800 flex justify-end gap-3">
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button
                                variant="primary"
                                onClick={handleSubmit}
                                disabled={!isAuthenticated || isSubmitting || content.length < 10}
                                className="bg-critic-green text-black hover:bg-critic-green/80 flex items-center gap-2"
                            >
                                {submitted ? "Submitted!" : isSubmitting ? "Submitting..." : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Submit Review
                                    </>
                                )}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
