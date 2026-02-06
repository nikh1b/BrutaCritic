import { motion } from "framer-motion";
import { Clock, ThumbsUp, Shield, User } from "lucide-react";
import { cn } from "../../lib/utils";

interface ReviewCardProps {
    gameTitle: string;
    reviewerName: string;
    reviewerAvatar?: string;
    score: number;
    playtime: number;
    summary: string;
    upvotes?: number;
    isVerified?: boolean;
    className?: string;
    variant?: "large" | "default";
}

export function ReviewCard({
    gameTitle,
    reviewerName,
    reviewerAvatar,
    score,
    playtime,
    summary,
    upvotes = 0,
    isVerified = true,
    className,
    variant = "default"
}: ReviewCardProps) {
    // Score color logic
    const getScoreStyle = () => {
        if (score >= 8) return "bg-critic-green text-black border-black shadow-[0_0_20px_rgba(190,242,100,0.3)]";
        if (score <= 4) return "bg-bruta-red text-white border-bruta-red shadow-[0_0_20px_rgba(239,68,68,0.3)]";
        return "bg-white text-black border-zinc-200";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={cn(
                "relative group overflow-hidden rounded-3xl bg-surface border border-zinc-800 p-6 flex flex-col justify-between cursor-pointer",
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

                {/* Upvotes */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-critic-green hover:bg-zinc-700 transition-colors"
                >
                    <ThumbsUp className="w-3 h-3" />
                    <span className="text-xs font-bold">{upvotes}</span>
                </motion.button>
            </div>
        </motion.div>
    );
}
