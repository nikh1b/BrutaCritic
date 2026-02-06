import { ReviewCard } from "./ReviewCard";

export function BentoGrid() {
    const reviews = [
        {
            id: 1,
            gameTitle: "Elden Ring: Shadow of the Erdtree",
            reviewerName: "SwordSaint_99",
            score: 10,
            playtime: 142,
            summary: "A masterpiece that redefines what an expansion can be. The difficulty is brutal, but fair. Every corner hides a secret.",
            variant: "large" as const
        },
        {
            id: 2,
            gameTitle: "Starfield",
            reviewerName: "SpaceTrucker",
            score: 6,
            playtime: 85,
            summary: "Wide as an ocean, deep as a puddle. The loading screens are the real enemy here.",
            variant: "default" as const
        },
        {
            id: 3,
            gameTitle: "Hollow Knight: Silksong",
            reviewerName: "BaitBeliever",
            score: 9,
            playtime: 40,
            summary: "Worth the wait. The movement tech is incredibly fluid and the art style is stunning.",
            variant: "default" as const
        },
        {
            id: 4,
            gameTitle: "Gollum",
            reviewerName: "SadTolkienFan",
            score: 2,
            playtime: 3,
            summary: "I played it so you don't have to. An insult to the franchise.",
            variant: "default" as const
        },
    ];

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
