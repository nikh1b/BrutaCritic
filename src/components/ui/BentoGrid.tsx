import { useState, useEffect } from "react";
import { ReviewCard } from "./ReviewCard";
import { supabase } from "../../lib/supabase";
import type { Review } from "../../lib/supabase";

// Mock data fallback
const mockReviews = [
    {
        id: "1",
        game_id: "elden_ring",
        gameTitle: "Elden Ring: Shadow of the Erdtree",
        reviewerName: "SwordSaint_99",
        score: 10,
        playtime: 142,
        summary: "A masterpiece that redefines what an expansion can be. The difficulty is brutal, but fair. Every corner hides a secret.",
        variant: "large" as const
    },
    {
        id: "2",
        game_id: "starfield",
        gameTitle: "Starfield",
        reviewerName: "SpaceTrucker",
        score: 6,
        playtime: 85,
        summary: "Wide as an ocean, deep as a puddle. The loading screens are the real enemy here.",
        variant: "default" as const
    },
    {
        id: "3",
        game_id: "silksong",
        gameTitle: "Hollow Knight: Silksong",
        reviewerName: "BaitBeliever",
        score: 9,
        playtime: 40,
        summary: "Worth the wait. The movement tech is incredibly fluid and the art style is stunning.",
        variant: "default" as const
    },
    {
        id: "4",
        game_id: "gollum",
        gameTitle: "Gollum",
        reviewerName: "SadTolkienFan",
        score: 2,
        playtime: 3,
        summary: "I played it so you don't have to. An insult to the franchise.",
        variant: "default" as const
    },
];

interface DisplayReview {
    id: string;
    gameTitle: string;
    reviewerName: string;
    score: number;
    playtime: number;
    summary: string;
    variant: "default" | "large";
}

export function BentoGrid() {
    const [reviews, setReviews] = useState<DisplayReview[]>(mockReviews);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchReviews() {
            try {
                const { data, error } = await supabase
                    .from('reviews')
                    .select('*, user:users(*)')
                    .order('created_at', { ascending: false })
                    .limit(4);

                if (error) throw error;

                if (data && data.length > 0) {
                    const formattedReviews: DisplayReview[] = data.map((review: Review & { user?: { username: string } }, index: number) => ({
                        id: review.id,
                        gameTitle: review.game_id, // Would map to actual game title
                        reviewerName: review.user?.username || "Anonymous",
                        score: review.score || 7,
                        playtime: review.playtime_at_review || 0,
                        summary: review.content || "No content provided.",
                        variant: index === 0 ? "large" as const : "default" as const
                    }));
                    setReviews(formattedReviews);
                }
                // If no data, keep mock reviews
            } catch (e) {
                console.log("Using mock reviews (Supabase not configured):", e);
                // Keep mock reviews on error
            } finally {
                setIsLoading(false);
            }
        }

        fetchReviews();
    }, []);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 h-auto md:h-[600px] w-full animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className={`bg-zinc-800/50 rounded-2xl ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`} />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 h-auto md:h-[600px] w-full">
            {reviews.map((review) => (
                <ReviewCard
                    key={review.id}
                    {...review}
                />
            ))}
        </div>
    );
}
