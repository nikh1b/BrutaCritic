import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { Shield, Gamepad2, Trophy, Star, LogOut, Settings } from "lucide-react";

export function UserProfile() {
    const { user, isAuthenticated, logout } = useAuth();

    if (!isAuthenticated || !user) {
        return (
            <div className="p-8 bg-surface/50 rounded-3xl border border-zinc-800 text-center">
                <div className="w-20 h-20 bg-zinc-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Shield className="w-10 h-10 text-zinc-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Not Connected</h3>
                <p className="text-text-muted text-sm mb-4">Connect your gaming platform to view your profile.</p>
                <Button variant="primary" className="bg-critic-green text-black hover:bg-critic-green/80">
                    Join the Resistance
                </Button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-surface/50 rounded-3xl border border-zinc-800"
        >
            {/* Profile Header */}
            <div className="flex items-center gap-6 mb-8">
                {/* Avatar */}
                <motion.div
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    className="relative"
                >
                    {user.avatar_url ? (
                        <img
                            src={user.avatar_url}
                            alt={user.username || "User"}
                            className="w-24 h-24 rounded-2xl border-4 border-critic-green shadow-[0_0_20px_rgba(190,242,100,0.3)]"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-bruta-red to-critic-green flex items-center justify-center border-4 border-zinc-800">
                            <span className="text-4xl font-black text-white">
                                {user.username?.[0]?.toUpperCase() || "?"}
                            </span>
                        </div>
                    )}
                    {/* Verified Badge */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-critic-green rounded-full flex items-center justify-center border-2 border-black">
                        <Shield className="w-4 h-4 text-black" />
                    </div>
                </motion.div>

                {/* User Info */}
                <div className="flex-1">
                    <h2 className="text-2xl font-black text-white">{user.username || "Verified Gamer"}</h2>
                    <p className="text-text-muted text-sm font-mono">ID: {user.steam_id.slice(0, 12)}...</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-1 bg-critic-green/20 text-critic-green text-xs font-bold rounded">
                            VERIFIED HUMAN
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                    <Button variant="ghost" className="p-2">
                        <Settings className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" onClick={logout} className="p-2 text-bruta-red hover:text-bruta-red">
                        <LogOut className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <motion.div
                    whileHover={{ y: -4 }}
                    className="p-4 bg-background rounded-2xl border border-zinc-800 text-center"
                >
                    <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-black text-white">{user.reputation_credits}</div>
                    <div className="text-xs text-text-muted">Credits</div>
                </motion.div>

                <motion.div
                    whileHover={{ y: -4 }}
                    className="p-4 bg-background rounded-2xl border border-zinc-800 text-center"
                >
                    <Star className="w-6 h-6 text-critic-green mx-auto mb-2" />
                    <div className="text-2xl font-black text-white">0</div>
                    <div className="text-xs text-text-muted">Reviews</div>
                </motion.div>

                <motion.div
                    whileHover={{ y: -4 }}
                    className="p-4 bg-background rounded-2xl border border-zinc-800 text-center"
                >
                    <Gamepad2 className="w-6 h-6 text-bruta-red mx-auto mb-2" />
                    <div className="text-2xl font-black text-white">0</div>
                    <div className="text-xs text-text-muted">Games Verified</div>
                </motion.div>
            </div>

            {/* Recent Activity */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                <div className="text-center py-8 text-text-muted text-sm border border-dashed border-zinc-800 rounded-xl">
                    No activity yet. Write your first review!
                </div>
            </div>
        </motion.div>
    );
}
