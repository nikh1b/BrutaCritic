import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ThumbsUp, ThumbsDown, Shield, User, Zap } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

interface ReviewCardProps {
    id?: string;
    gameTitle: string;
    reviewerName: string;
    reviewerAvatar?: string;
    score: number;
    playtime: number;
    summary: string;
    upvotes?: number;
    downvotes?: number;
    isVerified?: boolean;
    className?: string;
    variant?: "large" | "default";
    onVote?: (reviewId: string, voteType: "up" | "down", cost: number) => void;
}

export function ReviewCard({
    id = "",
    gameTitle,
    reviewerName,
    reviewerAvatar,
    score,
    playtime,
    summary,
    upvotes: initialUpvotes = 0,
    downvotes: initialDownvotes = 0,
    isVerified = true,
    className,
    variant = "default",
    onVote
}: ReviewCardProps) {
    const { isAuthenticated, user } = useAuth();
    const [upvotes, setUpvotes] = useState(initialUpvotes);
    const [downvotes, setDownvotes] = useState(initialDownvotes);
    const [userVotes, setUserVotes] = useState(0); // Track how many times user voted on this review
    const [voteType, setVoteType] = useState<"up" | "down" | null>(null);
    const [showVotePanel, setShowVotePanel] = useState(false);

    // Quadratic voting cost: 1st vote = 1 credit, 2nd = 4, 3rd = 9, etc.
    const getVoteCost = (voteCount: number) => Math.pow(voteCount + 1, 2);
    const nextVoteCost = getVoteCost(userVotes);
    const userCredits = user?.reputation_credits || 100;

    const handleVote = (type: "up" | "down") => {
        if (!isAuthenticated) return;
        if (userCredits < nextVoteCost) return;

        if (type === "up") {
            setUpvotes(prev => prev + 1);
        } else {
            setDownvotes(prev => prev + 1);
        }

        setUserVotes(prev => prev + 1);
        setVoteType(type);
        onVote?.(id, type, nextVoteCost);
    };

    // Score color logic
    const getScoreStyle = () => {
        if (score >= 8) return "bg-critic-green text-black border-black shadow-[0_0_20px_rgba(190,242,100,0.3)]";
        if (score <= 4) return "bg-bruta-red text-white border-bruta-red shadow-[0_0_20px_rgba(239,68,68,0.3)]";
        return "bg-white text-black border-zinc-200";
    };

    const netVotes = upvotes - downvotes;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={cn(
                "relative group overflow-hidden rounded-3xl bg-surface border border-zinc-800 p-6 flex flex-col justify-between",
                "hover:border-critic-green/50 hover:shadow-[0_0_30px_rgba(190,242,100,0.1)] transition-all duration-300",
                variant === "large" ? "md:col-span-2 md:row-span-2" : "md:col-span-1",
                className
            )}
        >
            {/* Animated Background Gradient */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-critic-green/5 via-transparent to-bruta-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/50 pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex justify-between items-start">
                <div className="flex-1">
                    <h3 className={cn(
                        "font-black font-display text-text-primary leading-tight",
                        variant === "large" ? "text-2xl" : "text-lg"
                    )}>
                        {gameTitle}
                    </h3>
                    {/* Reviewer with Avatar */}
                    <div className="flex items-center gap-2 mt-2">
                        {reviewerAvatar ? (
                            <img
                                src={reviewerAvatar}
                                alt={reviewerName}
                                className="w-6 h-6 rounded-full border border-zinc-700"
                            />
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-bruta-red to-critic-green flex items-center justify-center">
                                <User className="w-3 h-3 text-white" />
                            </div>
                        )}
                        <span className="text-sm text-text-muted font-medium">{reviewerName}</span>
                        {isVerified && (
                            <Shield className="w-4 h-4 text-critic-green" />
                        )}
                    </div>
                </div>

                {/* Score Badge with Animation */}
                <motion.div
                    whileHover={{ rotate: 0, scale: 1.1 }}
                    initial={{ rotate: 3 }}
                    className={cn(
                        "flex items-center justify-center font-black font-display rounded-2xl border-4 transition-all duration-300",
                        getScoreStyle(),
                        variant === "large" ? "w-20 h-20 text-4xl" : "w-14 h-14 text-2xl"
                    )}
                >
                    {score}
                </motion.div>
            </div>

            {/* Body */}
            <div className="relative z-10 mt-6 flex-1">
                <p className={cn(
                    "text-text-muted font-body group-hover:text-text-primary transition-colors italic",
                    variant === "large" ? "text-base line-clamp-4" : "text-sm line-clamp-3"
                )}>
                    "{summary}"
                </p>
            </div>

            {/* Footer / Stats */}
            <div className="relative z-10 mt-6 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs font-bold font-mono text-zinc-500">
                    <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-lg">
                        <Clock className="w-3 h-3" />
                        <span>{playtime}h</span>
                    </div>
                    {isVerified && (
                        <div className="flex items-center gap-1 text-critic-green bg-critic-green/10 px-2 py-1 rounded-lg">
                            <Shield className="w-3 h-3" />
                            <span>Verified</span>
                        </div>
                    )}
                </div>

                {/* Voting Section */}
                <div className="relative">
                    <motion.div
                        className="flex items-center gap-1"
                        onHoverStart={() => isAuthenticated && setShowVotePanel(true)}
                        onHoverEnd={() => setShowVotePanel(false)}
                    >
                        {/* Downvote */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleVote("down")}
                            disabled={!isAuthenticated || userCredits < nextVoteCost}
                            className={cn(
                                "flex items-center gap-1 px-2 py-1 rounded-lg transition-colors",
                                voteType === "down"
                                    ? "bg-bruta-red/20 text-bruta-red"
                                    : "bg-zinc-800 text-zinc-400 hover:text-bruta-red hover:bg-zinc-700",
                                !isAuthenticated && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <ThumbsDown className="w-3 h-3" />
                            <span className="text-xs font-bold">{downvotes}</span>
                        </motion.button>

                        {/* Net Score */}
                        <div className={cn(
                            "px-3 py-1 rounded-lg font-bold text-sm",
                            netVotes > 0 ? "bg-critic-green/20 text-critic-green" :
                                netVotes < 0 ? "bg-bruta-red/20 text-bruta-red" :
                                    "bg-zinc-800 text-zinc-400"
                        )}>
                            {netVotes > 0 ? "+" : ""}{netVotes}
                        </div>

                        {/* Upvote */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleVote("up")}
                            disabled={!isAuthenticated || userCredits < nextVoteCost}
                            className={cn(
                                "flex items-center gap-1 px-2 py-1 rounded-lg transition-colors",
                                voteType === "up"
                                    ? "bg-critic-green/20 text-critic-green"
                                    : "bg-zinc-800 text-zinc-400 hover:text-critic-green hover:bg-zinc-700",
                                !isAuthenticated && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <ThumbsUp className="w-3 h-3" />
                            <span className="text-xs font-bold">{upvotes}</span>
                        </motion.button>
                    </motion.div>

                    {/* Vote Cost Tooltip */}
                    <AnimatePresence>
                        {showVotePanel && isAuthenticated && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute bottom-full right-0 mb-2 p-3 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl min-w-[180px]"
                            >
                                <div className="text-xs text-text-muted mb-2">Quadratic Voting</div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-white font-bold">Next vote cost:</span>
                                    <span className="flex items-center gap-1 text-critic-green font-bold">
                                        <Zap className="w-3 h-3" />
                                        {nextVoteCost} credits
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-zinc-500">Your balance:</span>
                                    <span className="text-xs text-zinc-400">{userCredits} credits</span>
                                </div>
                                {userVotes > 0 && (
                                    <div className="mt-2 pt-2 border-t border-zinc-700 text-xs text-zinc-500">
                                        You've voted {userVotes}x on this review
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
