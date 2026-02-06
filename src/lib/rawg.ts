// RAWG.io API Service for game data
// Free API: https://rawg.io/apidocs (20k requests/month)

const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY || ""; // Get free key at rawg.io
const RAWG_BASE_URL = "https://api.rawg.io/api";

export interface RawgGame {
    id: number;
    slug: string;
    name: string;
    released: string;
    background_image: string;
    rating: number;
    ratings_count: number;
    metacritic: number | null;
    playtime: number;
    genres: { id: number; name: string; slug: string }[];
    platforms: { platform: { id: number; name: string; slug: string } }[];
    stores: { store: { id: number; name: string; slug: string } }[];
    short_screenshots: { id: number; image: string }[];
    tags: { id: number; name: string; slug: string }[];
}

export interface RawgGameDetails extends RawgGame {
    description: string;
    description_raw: string;
    developers: { id: number; name: string; slug: string }[];
    publishers: { id: number; name: string; slug: string }[];
    esrb_rating: { id: number; name: string; slug: string } | null;
    website: string;
    reddit_url: string;
}

export interface RawgSearchResult {
    count: number;
    next: string | null;
    previous: string | null;
    results: RawgGame[];
}

// Helper to build API URL
function buildUrl(endpoint: string, params: Record<string, string | number> = {}): string {
    const url = new URL(`${RAWG_BASE_URL}${endpoint}`);
    url.searchParams.set("key", RAWG_API_KEY);
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, String(value));
    });
    return url.toString();
}

// Search games by name
export async function searchGames(query: string, page = 1, pageSize = 20): Promise<RawgSearchResult> {
    if (!RAWG_API_KEY) {
        console.warn("RAWG API key not set, using fallback data");
        return getFallbackGames(query);
    }

    try {
        const response = await fetch(buildUrl("/games", {
            search: query,
            page,
            page_size: pageSize,
            ordering: "-metacritic"
        }));

        if (!response.ok) throw new Error("RAWG API error");
        return await response.json();
    } catch (error) {
        console.error("Error fetching games:", error);
        return getFallbackGames(query);
    }
}

// Get popular games
export async function getPopularGames(page = 1, pageSize = 20): Promise<RawgSearchResult> {
    if (!RAWG_API_KEY) {
        console.warn("RAWG API key not set, using fallback data");
        return getFallbackGames("");
    }

    try {
        const response = await fetch(buildUrl("/games", {
            ordering: "-rating",
            page,
            page_size: pageSize,
            metacritic: "80,100"
        }));

        if (!response.ok) throw new Error("RAWG API error");
        return await response.json();
    } catch (error) {
        console.error("Error fetching popular games:", error);
        return getFallbackGames("");
    }
}

// Get game details by slug or ID
export async function getGameDetails(idOrSlug: string | number): Promise<RawgGameDetails | null> {
    if (!RAWG_API_KEY) {
        console.warn("RAWG API key not set");
        return null;
    }

    try {
        const response = await fetch(buildUrl(`/games/${idOrSlug}`, {}));
        if (!response.ok) throw new Error("RAWG API error");
        return await response.json();
    } catch (error) {
        console.error("Error fetching game details:", error);
        return null;
    }
}

// Get games by genre
export async function getGamesByGenre(genreSlug: string, page = 1, pageSize = 20): Promise<RawgSearchResult> {
    if (!RAWG_API_KEY) {
        return getFallbackGames("");
    }

    try {
        const response = await fetch(buildUrl("/games", {
            genres: genreSlug,
            ordering: "-rating",
            page,
            page_size: pageSize
        }));

        if (!response.ok) throw new Error("RAWG API error");
        return await response.json();
    } catch (error) {
        console.error("Error fetching games by genre:", error);
        return getFallbackGames("");
    }
}

// Fallback data when API is not available
function getFallbackGames(query: string): RawgSearchResult {
    const fallbackGames: RawgGame[] = [
        {
            id: 1,
            slug: "elden-ring",
            name: "Elden Ring",
            released: "2022-02-25",
            background_image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg",
            rating: 4.5,
            ratings_count: 12500,
            metacritic: 96,
            playtime: 55,
            genres: [{ id: 4, name: "Action", slug: "action" }, { id: 5, name: "RPG", slug: "role-playing-games-rpg" }],
            platforms: [{ platform: { id: 4, name: "PC", slug: "pc" } }],
            stores: [],
            short_screenshots: [],
            tags: [{ id: 1, name: "Singleplayer", slug: "singleplayer" }]
        },
        {
            id: 2,
            slug: "baldurs-gate-3",
            name: "Baldur's Gate 3",
            released: "2023-08-03",
            background_image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co670h.jpg",
            rating: 4.8,
            ratings_count: 8900,
            metacritic: 96,
            playtime: 80,
            genres: [{ id: 5, name: "RPG", slug: "role-playing-games-rpg" }],
            platforms: [{ platform: { id: 4, name: "PC", slug: "pc" } }],
            stores: [],
            short_screenshots: [],
            tags: [{ id: 1, name: "Singleplayer", slug: "singleplayer" }]
        },
        {
            id: 3,
            slug: "cyberpunk-2077",
            name: "Cyberpunk 2077",
            released: "2020-12-10",
            background_image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5s6d.jpg",
            rating: 4.1,
            ratings_count: 15000,
            metacritic: 86,
            playtime: 35,
            genres: [{ id: 4, name: "Action", slug: "action" }, { id: 5, name: "RPG", slug: "role-playing-games-rpg" }],
            platforms: [{ platform: { id: 4, name: "PC", slug: "pc" } }],
            stores: [],
            short_screenshots: [],
            tags: [{ id: 1, name: "Singleplayer", slug: "singleplayer" }]
        },
        {
            id: 4,
            slug: "god-of-war-2018",
            name: "God of War (2018)",
            released: "2018-04-20",
            background_image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1tmu.jpg",
            rating: 4.6,
            ratings_count: 18000,
            metacritic: 94,
            playtime: 25,
            genres: [{ id: 4, name: "Action", slug: "action" }, { id: 3, name: "Adventure", slug: "adventure" }],
            platforms: [{ platform: { id: 4, name: "PC", slug: "pc" } }, { platform: { id: 18, name: "PlayStation 4", slug: "playstation4" } }],
            stores: [],
            short_screenshots: [],
            tags: [{ id: 1, name: "Singleplayer", slug: "singleplayer" }]
        },
        {
            id: 5,
            slug: "hollow-knight",
            name: "Hollow Knight",
            released: "2017-02-24",
            background_image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1rgi.jpg",
            rating: 4.4,
            ratings_count: 11000,
            metacritic: 87,
            playtime: 30,
            genres: [{ id: 4, name: "Action", slug: "action" }, { id: 51, name: "Indie", slug: "indie" }],
            platforms: [{ platform: { id: 4, name: "PC", slug: "pc" } }],
            stores: [],
            short_screenshots: [],
            tags: [{ id: 1, name: "Singleplayer", slug: "singleplayer" }]
        },
        {
            id: 6,
            slug: "the-witcher-3",
            name: "The Witcher 3: Wild Hunt",
            released: "2015-05-18",
            background_image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg",
            rating: 4.7,
            ratings_count: 25000,
            metacritic: 93,
            playtime: 50,
            genres: [{ id: 4, name: "Action", slug: "action" }, { id: 5, name: "RPG", slug: "role-playing-games-rpg" }],
            platforms: [{ platform: { id: 4, name: "PC", slug: "pc" } }],
            stores: [],
            short_screenshots: [],
            tags: [{ id: 1, name: "Singleplayer", slug: "singleplayer" }]
        },
        {
            id: 7,
            slug: "red-dead-redemption-2",
            name: "Red Dead Redemption 2",
            released: "2018-10-26",
            background_image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.jpg",
            rating: 4.6,
            ratings_count: 19000,
            metacritic: 97,
            playtime: 45,
            genres: [{ id: 4, name: "Action", slug: "action" }, { id: 3, name: "Adventure", slug: "adventure" }],
            platforms: [{ platform: { id: 4, name: "PC", slug: "pc" } }],
            stores: [],
            short_screenshots: [],
            tags: [{ id: 1, name: "Singleplayer", slug: "singleplayer" }]
        },
        {
            id: 8,
            slug: "hades",
            name: "Hades",
            released: "2020-09-17",
            background_image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2qw6.jpg",
            rating: 4.5,
            ratings_count: 9500,
            metacritic: 93,
            playtime: 25,
            genres: [{ id: 4, name: "Action", slug: "action" }, { id: 51, name: "Indie", slug: "indie" }],
            platforms: [{ platform: { id: 4, name: "PC", slug: "pc" } }],
            stores: [],
            short_screenshots: [],
            tags: [{ id: 1, name: "Singleplayer", slug: "singleplayer" }]
        }
    ];

    const filtered = query
        ? fallbackGames.filter(g => g.name.toLowerCase().includes(query.toLowerCase()))
        : fallbackGames;

    return {
        count: filtered.length,
        next: null,
        previous: null,
        results: filtered
    };
}
