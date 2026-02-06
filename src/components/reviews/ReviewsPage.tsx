import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Star, Filter, Search,
    Plus, ChevronDown, Gamepad2, Shield, TrendingUp
} from "lucide-react";
import { Button } from "../ui/Button";
import { ReviewCard } from "../ui/ReviewCard";
import { supabase, type Review } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

// Mock reviews for demo
const mockReviews: Review[] = [
    {
        id: "1",
        game_id: "elden_ring",
        user_id: "user1",
        content: "FromSoftware has outdone themselves. The open world design is phenomenal, and the boss fights are challenging but fair. 120 hours in and still finding new things.",
        score: 10,
        playtime_at_review: 7200,
        proof_of_play_verified: true,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        user: { id: "user1", steam_id: "user1", username: "EldenLord", avatar_url: null, reputation_credits: 1450, created_at: "" }
    },
    {
        id: "2",
        game_id: "baldurs_gate_3",
        user_id: "user2",
        content: "Best RPG I've played in years. The choices actually matter, companions are memorable, and the D&D mechanics translate perfectly to video game format.",
        score: 9,
        playtime_at_review: 4800,
        proof_of_play_verified: true,
        created_at: new Date(Date.now() - 172800000).toISOString(),
        user: { id: "user2", steam_id: "user2", username: "DungeonMaster", avatar_url: null, reputation_credits: 980, created_at: "" }
    },
    {
        id: "3",
        game_id: "starfield",
        user_id: "user3",
        content: "Overhyped and underdelivered. The exploration feels empty, loading screens break immersion, and the story is forgettable. Expected more from Bethesda.",
        score: 5,
        playtime_at_review: 2400,
        proof_of_play_verified: true,
        created_at: new Date(Date.now() - 259200000).toISOString(),
        user: { id: "user3", steam_id: "user3", username: "SpaceTrucker", avatar_url: null, reputation_credits: 720, created_at: "" }
    },
    {
        id: "4",
        game_id: "cyberpunk_2077",
        user_id: "user4",
        content: "After all the patches, this game is finally what it should have been at launch. Night City is stunning, story is gripping, and the gameplay loop is addictive.",
        score: 8,
        playtime_at_review: 5400,
        proof_of_play_verified: true,
        created_at: new Date(Date.now() - 345600000).toISOString(),
        user: { id: "user4", steam_id: "user4", username: "NightCityRunner", avatar_url: null, reputation_credits: 560, created_at: "" }
    },
    {
        id: "5",
        game_id: "hollow_knight",
        user_id: "user5",
        content: "A masterpiece of the metroidvania genre. Perfect difficulty curve, gorgeous art, and an incredible soundtrack. Team Cherry deserves all the praise.",
        score: 10,
        playtime_at_review: 3600,
        proof_of_play_verified: true,
        created_at: new Date(Date.now() - 432000000).toISOString(),
        user: { id: "user5", steam_id: "user5", username: "BugKnight", avatar_url: null, reputation_credits: 890, created_at: "" }
    },
];

const gamesList = [
    { id: "all", title: "All Games" },
    { id: "elden_ring", title: "Elden Ring" },
    { id: "baldurs_gate_3", title: "Baldur's Gate 3" },
    { id: "starfield", title: "Starfield" },
    { id: "cyberpunk_2077", title: "Cyberpunk 2077" },
    { id: "hollow_knight", title: "Hollow Knight" },
];

const sortOptions = [
    { id: "newest", label: "Newest First" },
    { id: "oldest", label: "Oldest First" },
    { id: "highest", label: "Highest Score" },
    { id: "lowest", label: "Lowest Score" },
    { id: "playtime", label: "Most Playtime" },
];

interface ReviewsPageProps {
    onWriteReview?: () => void;
}

export function ReviewsPage({ onWriteReview }: ReviewsPageProps) {
    const { isAuthenticated } = useAuth();
    const [reviews, setReviews] = useState<Review[]>(mockReviews);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedGame, setSelectedGame] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        async function fetchReviews() {
            try {
                const { data, error } = await supabase
                    .from('reviews')
                    .select('*, user:users(*)')
                    .order('created_at', { ascending: false });

                if (!error && data && data.length > 0) {
                    setReviews(data as Review[]);
                }
            } catch (e) {
                console.log("Using mock reviews");
            } finally {
                setIsLoading(false);
            }
        }
        fetchReviews();
    }, []);

    // Filter and sort reviews
    const filteredReviews = reviews
        .filter(r => selectedGame === "all" || r.game_id === selectedGame)
        .filter(r =>
            searchQuery === "" ||
            r.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case "oldest": return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                case "highest": return (b.score || 0) - (a.score || 0);
                case "lowest": return (a.score || 0) - (b.score || 0);
                case "playtime": return (b.playtime_at_review || 0) - (a.playtime_at_review || 0);
                default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
        });

    const getGameTitle = (gameId: string) => {
        return gamesList.find(g => g.id === gameId)?.title || gameId.replace(/_/g, ' ');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-bruta-red/20 rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-bruta-red" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white">Verified Reviews</h2>
                        <p className="text-sm text-text-muted">Real reviews from real players</p>
                    </div>
                </div>

                {isAuthenticated && (
                    <Button
                        variant="primary"
                        onClick={onWriteReview}
                        className="bg-critic-green text-black hover:bg-critic-green/80"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Write Review
                    </Button>
                )}
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total Reviews", value: reviews.length, icon: Star, color: "text-critic-green" },
                    { label: "Verified Players", value: reviews.filter(r => r.proof_of_play_verified).length, icon: Shield, color: "text-blue-400" },
                    { label: "Avg Score", value: (reviews.reduce((a, r) => a + (r.score || 0), 0) / reviews.length).toFixed(1), icon: TrendingUp, color: "text-yellow-500" },
                ].map((stat) => (
                    <motion.div
                        key={stat.label}
                        whileHover={{ y: -2 }}
                        className="p-4 bg-surface rounded-xl border border-zinc-800 text-center"
                    >
                        <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                        <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs text-text-muted">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Search & Filters */}
            <div className="space-y-4">
                <div className="flex gap-3">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search reviews..."
                            className="w-full pl-10 pr-4 py-3 bg-background border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-critic-green/50"
                        />
                    </div>

                    {/* Filter Toggle */}
                    <Button
                        variant="secondary"
                        onClick={() => setShowFilters(!showFilters)}
                        className={showFilters ? "bg-zinc-800" : ""}
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                    </Button>
                </div>

                {/* Filter Options */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-wrap gap-4 p-4 bg-surface rounded-xl border border-zinc-800"
                        >
                            {/* Game Filter */}
                            <div className="flex-1 min-w-[200px]">
                                <label className="text-xs text-text-muted mb-2 block">Game</label>
                                <select
                                    value={selectedGame}
                                    onChange={(e) => setSelectedGame(e.target.value)}
                                    className="w-full p-2 bg-background border border-zinc-700 rounded-lg text-white"
                                >
                                    {gamesList.map(game => (
                                        <option key={game.id} value={game.id}>{game.title}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort */}
                            <div className="flex-1 min-w-[200px]">
                                <label className="text-xs text-text-muted mb-2 block">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full p-2 bg-background border border-zinc-700 rounded-lg text-white"
                                >
                                    {sortOptions.map(opt => (
                                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Results Count */}
            <div className="text-sm text-text-muted">
                Showing {filteredReviews.length} reviews
                {selectedGame !== "all" && ` for ${getGameTitle(selectedGame)}`}
            </div>

            {/* Reviews List */}
            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-32 bg-zinc-800/50 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredReviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <ReviewCard
                                id={review.id}
                                gameTitle={getGameTitle(review.game_id)}
                                reviewerName={review.user?.username || "Anonymous"}
                                score={review.score || 0}
                                playtime={(review.playtime_at_review || 0) / 60}
                                summary={review.content || ""}
                                upvotes={Math.floor(Math.random() * 50) + 10}
                                downvotes={Math.floor(Math.random() * 10)}
                                variant={index === 0 ? "large" : "default"}
                                onVote={(reviewId, voteType, cost) => {
                                    console.log(`Vote: ${voteType} on ${reviewId}, cost: ${cost} credits`);
                                }}
                            />
                        </motion.div>
                    ))}

                    {filteredReviews.length === 0 && (
                        <div className="text-center py-12 text-text-muted">
                            <Gamepad2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No reviews found</p>
                            {isAuthenticated && (
                                <Button
                                    variant="secondary"
                                    onClick={onWriteReview}
                                    className="mt-4"
                                >
                                    Be the first to review!
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
