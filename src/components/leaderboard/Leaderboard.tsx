import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Star, TrendingUp, User } from "lucide-react";
import { supabase } from "../../lib/supabase";
import type { User as UserType } from "../../lib/supabase";

// Mock data for when Supabase isn't connected
const mockLeaderboard = [
    { id: "1", username: "SwordSaint_99", avatar_url: null, reputation_credits: 2450, reviews: 47 },
    { id: "2", username: "SpaceTrucker", avatar_url: null, reputation_credits: 1830, reviews: 32 },
    { id: "3", username: "ValorantPro", avatar_url: null, reputation_credits: 1620, reviews: 28 },
    { id: "4", username: "EldenLord", avatar_url: null, reputation_credits: 1450, reviews: 25 },
    { id: "5", username: "CasualGamer42", avatar_url: null, reputation_credits: 1200, reviews: 21 },
    { id: "6", username: "StreamerLife", avatar_url: null, reputation_credits: 980, reviews: 18 },
    { id: "7", username: "NightOwlGamer", avatar_url: null, reputation_credits: 850, reviews: 15 },
    { id: "8", username: "RetroKing", avatar_url: null, reputation_credits: 720, reviews: 12 },
    { id: "9", username: "MMO_Veteran", avatar_url: null, reputation_credits: 650, reviews: 10 },
    { id: "10", username: "IndieLover", avatar_url: null, reputation_credits: 540, reviews: 8 },
];

interface LeaderboardUser extends UserType {
    reviews?: number;
}

export function Leaderboard() {
    const [users, setUsers] = useState<LeaderboardUser[]>(mockLeaderboard as LeaderboardUser[]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .order('reputation_credits', { ascending: false })
                    .limit(10);

                if (error) throw error;
                if (data && data.length > 0) {
                    setUsers(data);
                }
            } catch (e) {
                console.log("Using mock leaderboard:", e);
            } finally {
                setIsLoading(false);
            }
        }
        fetchLeaderboard();
    }, []);

    const getRankStyle = (rank: number) => {
        switch (rank) {
            case 1: return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/50";
            case 2: return "bg-gradient-to-r from-zinc-400/20 to-zinc-500/10 border-zinc-400/50";
            case 3: return "bg-gradient-to-r from-amber-700/20 to-amber-800/10 border-amber-700/50";
            default: return "bg-surface border-zinc-800";
        }
    };

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Trophy className="w-6 h-6 text-yellow-500" />;
            case 2: return <Medal className="w-6 h-6 text-zinc-400" />;
            case 3: return <Medal className="w-6 h-6 text-amber-700" />;
            default: return <span className="text-lg font-bold text-zinc-500">#{rank}</span>;
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-zinc-800/50 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white">Leaderboard</h2>
                        <p className="text-sm text-text-muted">Top reviewers by reputation</p>
                    </div>
                </div>
            </div>

            {/* Leaderboard List */}
            <div className="space-y-3">
                {users.map((user, index) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.01, x: 4 }}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${getRankStyle(index + 1)}`}
                    >
                        {/* Rank */}
                        <div className="w-10 flex items-center justify-center">
                            {getRankIcon(index + 1)}
                        </div>

                        {/* Avatar */}
                        {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.username || ""} className="w-12 h-12 rounded-full border-2 border-zinc-700" />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-bruta-red to-critic-green flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                            </div>
                        )}

                        {/* Info */}
                        <div className="flex-1">
                            <div className="font-bold text-white">{user.username || "Anonymous"}</div>
                            <div className="text-sm text-text-muted flex items-center gap-2">
                                <Star className="w-3 h-3" />
                                {user.reviews || 0} reviews
                            </div>
                        </div>

                        {/* Credits */}
                        <div className="text-right">
                            <div className="text-xl font-black text-critic-green">{user.reputation_credits}</div>
                            <div className="text-xs text-text-muted">credits</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
