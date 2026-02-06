import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Star, Clock, Gamepad2, ExternalLink } from "lucide-react";
import { Button } from "../ui/Button";
import { searchGames, getPopularGames, type RawgGame } from "../../lib/rawg";

const genres = [
    { id: "all", name: "All Genres" },
    { id: "action", name: "Action" },
    { id: "adventure", name: "Adventure" },
    { id: "role-playing-games-rpg", name: "RPG" },
    { id: "shooter", name: "Shooter" },
    { id: "indie", name: "Indie" },
    { id: "puzzle", name: "Puzzle" },
    { id: "sports", name: "Sports" },
];

export function GameSearch() {
    const [query, setQuery] = useState("");
    const [games, setGames] = useState<RawgGame[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedGenre, setSelectedGenre] = useState("all");
    const [totalCount, setTotalCount] = useState(0);

    // Load popular games on mount
    useEffect(() => {
        async function loadPopular() {
            setIsLoading(true);
            const result = await getPopularGames(1, 12);
            setGames(result.results);
            setTotalCount(result.count);
            setIsLoading(false);
        }
        loadPopular();
    }, []);

    // Search games when query changes
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (query.trim()) {
                setIsLoading(true);
                const result = await searchGames(query, 1, 12);
                setGames(result.results);
                setTotalCount(result.count);
                setIsLoading(false);
            } else {
                // Reset to popular games
                setIsLoading(true);
                const result = await getPopularGames(1, 12);
                setGames(result.results);
                setTotalCount(result.count);
                setIsLoading(false);
            }
        }, 300); // Debounce

        return () => clearTimeout(timeoutId);
    }, [query]);

    // Filter by genre (client-side for now)
    const filteredGames = selectedGenre === "all"
        ? games
        : games.filter(g => g.genres?.some(genre => genre.slug === selectedGenre));

    const getScoreColor = (rating: number) => {
        if (rating >= 4) return "bg-critic-green text-black";
        if (rating >= 3) return "bg-yellow-500 text-black";
        return "bg-bruta-red text-white";
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                    Find <span className="text-critic-green">Games</span>
                </h2>
                <p className="text-text-muted">
                    Browse {totalCount.toLocaleString()}+ games • Powered by RAWG
                </p>
            </div>

            {/* Search & Filters */}
            <div className="space-y-4">
                <div className="relative max-w-xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search games..."
                        className="w-full pl-12 pr-4 py-4 bg-surface border border-zinc-800 rounded-2xl text-white text-lg placeholder:text-zinc-600 focus:outline-none focus:border-critic-green/50 transition-colors"
                    />
                </div>

                {/* Genre Filters */}
                <div className="flex flex-wrap justify-center gap-2">
                    {genres.map(genre => (
                        <Button
                            key={genre.id}
                            variant={selectedGenre === genre.id ? "primary" : "ghost"}
                            onClick={() => setSelectedGenre(genre.id)}
                            className={`text-sm ${selectedGenre === genre.id ? "bg-critic-green text-black" : ""}`}
                        >
                            {genre.name}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Results */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-64 bg-zinc-800/50 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGames.map((game, index) => (
                        <motion.div
                            key={game.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="group relative overflow-hidden rounded-2xl bg-surface border border-zinc-800 hover:border-critic-green/50 transition-all cursor-pointer"
                        >
                            {/* Game Image */}
                            <div className="aspect-video relative overflow-hidden">
                                {game.background_image ? (
                                    <img
                                        src={game.background_image}
                                        alt={game.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                        <Gamepad2 className="w-12 h-12 text-zinc-600" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                                {/* Metacritic Score */}
                                {game.metacritic && (
                                    <div className="absolute top-3 right-3 px-2 py-1 bg-black/80 rounded-lg text-xs font-bold text-white">
                                        MC: {game.metacritic}
                                    </div>
                                )}

                                {/* Rating Badge */}
                                <div className={`absolute bottom-3 right-3 px-3 py-1 rounded-full text-sm font-black ${getScoreColor(game.rating)}`}>
                                    ★ {game.rating.toFixed(1)}
                                </div>
                            </div>

                            {/* Game Info */}
                            <div className="p-4">
                                <h3 className="font-black text-white text-lg line-clamp-1 group-hover:text-critic-green transition-colors">
                                    {game.name}
                                </h3>

                                <div className="flex flex-wrap gap-2 mt-2">
                                    {game.genres?.slice(0, 2).map(genre => (
                                        <span key={genre.id} className="px-2 py-0.5 bg-zinc-800 rounded-full text-xs text-zinc-400">
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between mt-4 text-xs text-zinc-500">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{game.playtime}h avg</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3" />
                                        <span>{game.ratings_count?.toLocaleString() || 0} ratings</span>
                                    </div>
                                </div>

                                {/* Platforms */}
                                <div className="flex items-center gap-2 mt-3 text-xs text-zinc-500">
                                    {game.platforms?.slice(0, 3).map(p => (
                                        <span key={p.platform.id} className="px-2 py-0.5 bg-zinc-900 rounded text-zinc-400">
                                            {p.platform.name.replace('PC', '💻').replace('PlayStation', '🎮').replace('Xbox', '🟢').replace('Nintendo', '🔴')}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-critic-green/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </motion.div>
                    ))}
                </div>
            )}

            {filteredGames.length === 0 && !isLoading && (
                <div className="text-center py-12">
                    <Gamepad2 className="w-16 h-16 mx-auto text-zinc-700 mb-4" />
                    <p className="text-text-muted">No games found for "{query}"</p>
                </div>
            )}

            {/* Attribution */}
            <div className="text-center text-xs text-zinc-600">
                Game data provided by{" "}
                <a href="https://rawg.io" target="_blank" rel="noopener noreferrer" className="text-critic-green hover:underline">
                    RAWG.io <ExternalLink className="w-3 h-3 inline" />
                </a>
            </div>
        </div>
    );
}
