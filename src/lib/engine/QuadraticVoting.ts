/**
 * Quadratic Voting Engine
 * Formula: Cost = VoteIntensity^2
 * 
 * Example:
 * 1 Vote = 1 Credit
 * 2 Votes = 4 Credits
 * 10 Votes = 100 Credits
 */

export interface VoteTransaction {
    gameId: string;
    voteIntensity: number; // 1 to 10
    timestamp: number;
}

export class QuadraticVoting {
    // Calculate cost for a given vote intensity
    static calculateCost(intensity: number): number {
        if (intensity < 1 || intensity > 10) {
            throw new Error("Vote intensity must be between 1 and 10.");
        }
        return Math.pow(intensity, 2);
    }

    // Calculate remaining budget from a history of transactions
    static calculateRemainingBudget(totalBudget: number, history: VoteTransaction[]): number {
        const spent = history.reduce((sum, tx) => sum + this.calculateCost(tx.voteIntensity), 0);
        return totalBudget - spent;
    }

    // Validate if a user can afford a vote
    static canAffordVote(currentBudget: number, intensity: number): boolean {
        return currentBudget >= this.calculateCost(intensity);
    }

    // Get dynamic pricing table for UI
    static getPricingTable(): { votes: number; cost: number }[] {
        return Array.from({ length: 10 }, (_, i) => ({
            votes: i + 1,
            cost: this.calculateCost(i + 1)
        }));
    }
}
