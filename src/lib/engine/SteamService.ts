/**
 * Steam Proof-of-Play Service
 * 
 * In production, this would call a server-side proxy to the Steam Web API (IPlayerService/GetOwnedGames).
 * For this client-side demo, we simulate the verification logic with strict typing.
 */

export interface SteamGameInfo {
    appId: string;
    name: string;
    playtimeForever: number; // Minutes
    lastPlayed: number; // Unix timestamp
}

export class SteamService {
    // private static readonly API_KEY = "MOCK_KEY"; // In real backend, this is env var

    // RPGs require more playtime to verify
    private static readonly RPG_THRESHOLD_MINUTES = 30 * 60; // 30 Hours
    private static readonly STANDARD_THRESHOLD_MINUTES = 2 * 60; // 2 Hours

    static verifyPlaytime(game: SteamGameInfo, isRPG: boolean = false): { verified: boolean; reason?: string } {
        const threshold = isRPG ? this.RPG_THRESHOLD_MINUTES : this.STANDARD_THRESHOLD_MINUTES;

        if (game.playtimeForever < threshold) {
            const hoursNeeded = (threshold - game.playtimeForever) / 60;
            return {
                verified: false,
                reason: `Insufficient playtime. You need ${Math.ceil(hoursNeeded)} more hours to review this title.`
            };
        }

        return { verified: true };
    }

    // Mock API Call simulating a user connecting their Steam account
    static async mockFetchLibrary(steamId: string): Promise<SteamGameInfo[]> {
        console.log(`Fetching library for ${steamId}...`);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        return [
            { appId: "1245620", name: "Elden Ring", playtimeForever: 8520, lastPlayed: 1709424000 }, // 142 hours
            { appId: "1716740", name: "Starfield", playtimeForever: 5100, lastPlayed: 1708424000 }, // 85 hours
            { appId: "12345", name: "Bad Game 2024", playtimeForever: 15, lastPlayed: 1709424000 }, // 0.25 hours (Refunded?)
        ];
    }
}
