import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Ban, Eye, AlertTriangle, CheckCircle, XCircle, Users, FileText, Activity } from "lucide-react";
import { Button } from "../ui/Button";

// Mock data for admin dashboard
const mockPendingReviews = [
    { id: "1", user: "NewUser123", game: "Call of Duty", content: "This game is amazing!", score: 9, flagged: false },
    { id: "2", user: "SuspiciousBot", game: "FIFA 24", content: "BEST GAME EVER BUY NOW!!!", score: 10, flagged: true },
    { id: "3", user: "HonestGamer", game: "Hogwarts Legacy", content: "Great RPG, solid 8/10 experience.", score: 8, flagged: false },
];

const mockReportedUsers = [
    { id: "1", username: "SpamBot420", reason: "Spam reviews", reports: 15 },
    { id: "2", username: "ToxicGamer", reason: "Harassment", reports: 8 },
];

const mockStats = {
    totalUsers: 1247,
    totalReviews: 5632,
    pendingReviews: 23,
    bannedUsers: 12,
};

export function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'reviews' | 'users' | 'stats'>('reviews');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-bruta-red/20 rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-bruta-red" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white">Admin Dashboard</h2>
                        <p className="text-sm text-text-muted">Moderate content and manage users</p>
                    </div>
                </div>
                <div className="px-3 py-1 bg-bruta-red/20 text-bruta-red text-xs font-bold rounded-full">
                    ADMIN ONLY
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: "Total Users", value: mockStats.totalUsers, icon: Users, color: "text-critic-green" },
                    { label: "Total Reviews", value: mockStats.totalReviews, icon: FileText, color: "text-blue-400" },
                    { label: "Pending", value: mockStats.pendingReviews, icon: Activity, color: "text-yellow-500" },
                    { label: "Banned", value: mockStats.bannedUsers, icon: Ban, color: "text-bruta-red" },
                ].map((stat) => (
                    <motion.div
                        key={stat.label}
                        whileHover={{ y: -2 }}
                        className="p-4 bg-surface rounded-xl border border-zinc-800"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            <span className="text-xs text-text-muted">{stat.label}</span>
                        </div>
                        <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                    </motion.div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-zinc-800 pb-2">
                {(['reviews', 'users', 'stats'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg font-bold transition-colors ${activeTab === tab
                            ? "bg-zinc-800 text-white"
                            : "text-text-muted hover:text-white"
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">Pending Reviews</h3>
                    {mockPendingReviews.map((review) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`p-4 rounded-xl border ${review.flagged
                                ? "bg-bruta-red/5 border-bruta-red/30"
                                : "bg-surface border-zinc-800"
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-white">{review.user}</span>
                                        <span className="text-text-muted">→</span>
                                        <span className="text-text-muted">{review.game}</span>
                                        {review.flagged && (
                                            <span className="flex items-center gap-1 text-bruta-red text-xs bg-bruta-red/20 px-2 py-0.5 rounded">
                                                <AlertTriangle className="w-3 h-3" />
                                                Flagged
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-text-muted text-sm">"{review.content}"</p>
                                    <div className="text-xs text-zinc-500 mt-2">Score: {review.score}/10</div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" className="p-2 text-critic-green hover:bg-critic-green/20">
                                        <CheckCircle className="w-5 h-5" />
                                    </Button>
                                    <Button variant="ghost" className="p-2 text-bruta-red hover:bg-bruta-red/20">
                                        <XCircle className="w-5 h-5" />
                                    </Button>
                                    <Button variant="ghost" className="p-2 text-zinc-500 hover:bg-zinc-800">
                                        <Eye className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">Reported Users</h3>
                    {mockReportedUsers.map((user) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-between p-4 bg-surface rounded-xl border border-zinc-800"
                        >
                            <div>
                                <div className="font-bold text-white">{user.username}</div>
                                <div className="text-sm text-text-muted">{user.reason}</div>
                                <div className="text-xs text-bruta-red mt-1">{user.reports} reports</div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="secondary" className="text-sm">
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                </Button>
                                <Button variant="ghost" className="text-bruta-red border-bruta-red/30 hover:bg-bruta-red/20">
                                    <Ban className="w-4 h-4 mr-1" />
                                    Ban
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
                <div className="p-8 text-center text-text-muted">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Detailed analytics coming soon...</p>
                </div>
            )}
        </div>
    );
}
