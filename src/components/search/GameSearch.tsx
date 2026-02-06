import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Gamepad2, Star, Clock, ChevronRight } from "lucide-react";
import { Button } from "../ui/Button";

// Mock game database
const mockGames = [
    { id: "elden_ring", title: "Elden Ring", reviews: 1247, avgScore: 9.2, image: "🗡️" },
    { id: "baldurs_gate_3", title: "Baldur's Gate 3", reviews: 892, avgScore: 9.5, image: "🧙" },
    { id: "starfield", title: "Starfield", reviews: 634, avgScore: 6.8, image: "🚀" },
    { id: "cyberpunk_2077", title: "Cyberpunk 2077", reviews: 1823, avgScore: 7.9, image: "🤖" },
    { id: "hollow_knight", title: "Hollow Knight", reviews: 567, avgScore: 9.1, image: "🦋" },
    { id: "gta_v", title: "GTA V", reviews: 2341, avgScore: 9.0, image: "🚗" },
    { id: "minecraft", title: "Minecraft", reviews: 3102, avgScore: 9.3, image: "⛏️" },
    { id: "valorant", title: "Valorant", reviews: 1456, avgScore: 8.2, image: "🎯" },
    { id: "fortnite", title: "Fortnite", reviews: 2890, avgScore: 7.5, image: "🏰" },
    { id: "skyrim", title: "The Elder Scrolls V: Skyrim", reviews: 1987, avgScore: 9.4, image: "🐉" },
];

interface GameSearchProps {
    onSelectGame?: (gameId: string) => void;
}

export function GameSearch({ onSelectGame }: GameSearchProps) {
    const [query, setQuery] = useState("");
    const [selectedGame, setSelectedGame] = useState<string | null>(null);

    const filteredGames = mockGames.filter(game =>
        game.title.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelectGame = (gameId: string) => {
        setSelectedGame(gameId);
        onSelectGame?.(gameId);
    };

    const getScoreColor = (score: number) => {
        if (score >= 8) return "text-critic-green";
        if (score >= 6) return "text-yellow-500";
        return "text-bruta-red";
    };

    return (
        <div className="space-y-6">
            {/* Search Header */}
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-critic-green/20 rounded-xl flex items-center justify-center">
                    <Gamepad2 className="w-6 h-6 text-critic-green" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white">Find Games</h2>
                    <p className="text-sm text-text-muted">Search for games and read verified reviews</p>
                </div>
            </div>

            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a game..."
                    className="w-full pl-12 pr-4 py-4 bg-background border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-critic-green/50"
                />
            </div>

            {/* Results */}
            <div className="grid gap-3">
                {filteredGames.map((game, index) => (
                    <motion.div
                        key={game.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ scale: 1.01, x: 4 }}
                        onClick={() => handleSelectGame(game.id)}
                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${selectedGame === game.id
                                ? "bg-critic-green/10 border-critic-green/50"
                                : "bg-surface border-zinc-800 hover:border-zinc-700"
                            }`}
                    >
                        {/* Game Icon */}
                        <div className="w-14 h-14 bg-zinc-800 rounded-xl flex items-center justify-center text-2xl">
                            {game.image}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="font-bold text-white">{game.title}</div>
                            <div className="text-sm text-text-muted flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {game.reviews} reviews
                                </span>
                            </div>
                        </div>

                        {/* Score */}
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className={`text-2xl font-black ${getScoreColor(game.avgScore)}`}>
                                    {game.avgScore}
                                </div>
                                <div className="text-xs text-text-muted flex items-center gap-1">
                                    <Star className="w-3 h-3" />
                                    avg score
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-zinc-500" />
                        </div>
                    </motion.div>
                ))}

                {filteredGames.length === 0 && (
                    <div className="text-center py-12 text-text-muted">
                        No games found matching "{query}"
                    </div>
                )}
            </div>

            {/* Selected Game Action */}
            {selectedGame && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                >
                    <Button variant="primary" className="flex-1 bg-critic-green text-black hover:bg-critic-green/80">
                        View All Reviews
                    </Button>
                    <Button variant="secondary" className="flex-1">
                        Write a Review
                    </Button>
                </motion.div>
            )}
        </div>
    );
}
