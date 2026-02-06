import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { cn } from "../../lib/utils";

interface ReviewCardProps {
    gameTitle: string;
    reviewerName: string;
    score: number;
    playtime: number;
    summary: string;
    className?: string;
    variant?: "large" | "default";
}

export function ReviewCard({
    gameTitle,
    reviewerName,
    score,
    playtime,
    summary,
    className,
    variant = "default"
}: ReviewCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.96 }}
            className={cn(
                "relative group overflow-hidden rounded-3xl bg-surface border border-zinc-800 p-6 flex flex-col justify-between cursor-pointer",
                "hover:border-zinc-600 hover:shadow-2xl transition-colors",
                variant === "large" ? "md:col-span-2 md:row-span-2" : "md:col-span-1",
                className
            )}
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/50 pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold font-display text-text-primary leading-tight">{gameTitle}</h3>
                    <p className="text-sm text-text-muted mt-1 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-critic-green inline-block" />
                        {reviewerName}
                    </p>
                </div>

                {/* Score Badge */}
                <div className={cn(
                    "flex items-center justify-center font-black font-display rounded-2xl border-4 transform rotate-3 group-hover:rotate-0 transition-transform duration-300 shadow-[4px_4px_0px_black]",
                    score >= 8 ? "bg-critic-green text-black border-black" :
                        score <= 4 ? "bg-bruta-red text-white border-bruta-red" :
                            "bg-white text-black border-zinc-200",
                    variant === "large" ? "w-20 h-20 text-4xl" : "w-14 h-14 text-2xl"
                )}>
                    {score}
                </div>
            </div>

            {/* Body */}
            <div className="relative z-10 mt-6">
                <p className="text-text-muted font-body line-clamp-3 group-hover:text-text-primary transition-colors">
                    "{summary}"
                </p>
            </div>

            {/* Footer / Stats */}
            <div className="relative z-10 mt-6 flex items-center gap-4 text-xs font-bold font-mono text-zinc-500">
                <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded">
                    <Clock className="w-3 h-3" />
                    {playtime}h Played
                </div>
                <div className="flex items-center gap-1 text-critic-green">
                    Verified
                </div>
            </div>
        </motion.div>
    );
}
