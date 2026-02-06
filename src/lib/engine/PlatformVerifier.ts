/**
 * Platform Verification Service
 * Unifies Proof-of-Play logic across Steam, Epic, Xbox, and Ubisoft.
 */

export type Platform = 'Steam' | 'Epic' | 'Xbox' | 'Ubisoft';

export interface GameInfo {
    id: string;
    title: string;
    playtimeMinutes: number;
    lastPlayed: number;
    platform: Platform;
    icon?: string;
}

export class PlatformVerifier {
    // Mock data for different platforms
    private static readonly MOCK_DB: Record<Platform, GameInfo[]> = {
        Steam: [
            { id: "s1", title: "Elden Ring", playtimeMinutes: 8520, lastPlayed: 1709424000, platform: 'Steam' },
            { id: "s2", title: "Starfield", playtimeMinutes: 5100, lastPlayed: 1708424000, platform: 'Steam' },
        ],
        Epic: [
            { id: "e1", title: "Fortnite", playtimeMinutes: 120000, lastPlayed: 1709500000, platform: 'Epic' },
            { id: "e2", title: "Alan Wake 2", playtimeMinutes: 1200, lastPlayed: 1705000000, platform: 'Epic' }
        ],
        Xbox: [
            { id: "x1", title: "Halo Infinite", playtimeMinutes: 3400, lastPlayed: 1701000000, platform: 'Xbox' },
            { id: "x2", title: "Forza Horizon 5", playtimeMinutes: 6000, lastPlayed: 1709000000, platform: 'Xbox' }
        ],
        Ubisoft: [
            { id: "u1", title: "Assassin's Creed Mirage", playtimeMinutes: 80, lastPlayed: 1706000000, platform: 'Ubisoft' }, // Low playtime test
            { id: "u2", title: "Skull and Bones", playtimeMinutes: 15, lastPlayed: 1707000000, platform: 'Ubisoft' }
        ]
    };

    static async connectPlatform(platform: Platform): Promise<GameInfo[]> {
        console.log(`Connecting to ${platform}...`);
        // Simulate API latency
        await new Promise(resolve => setTimeout(resolve, 800));
        return this.MOCK_DB[platform];
    }

    static verifyEligibility(game: GameInfo): { verified: boolean; reason?: string } {
        // Universal 2-hour refund window check
        if (game.playtimeMinutes < 120) {
            return { verified: false, reason: "Playtime < 2 hours (Refund Window)" };
        }

        // RPG specific check (mock logic: if title contains 'Elden' or 'Starfield' or 'Halo')
        const deepDiveTitles = ['Elden', 'Starfield', 'Halo', 'Baldur'];
        const isDeepDive = deepDiveTitles.some(t => game.title.includes(t));

        if (isDeepDive && game.playtimeMinutes < 1800) { // 30 hours
            return { verified: false, reason: "Deep Dive: Requires 30h+ playtime" };
        }

        return { verified: true };
    }
}
