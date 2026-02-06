import { useState } from "react";
import { Button } from "../ui/Button";
import { QuadraticVoting } from "../../lib/engine/QuadraticVoting";
import { PlatformVerifier, type Platform, type GameInfo } from "../../lib/engine/PlatformVerifier";
import { SybilGuard } from "../../lib/engine/SybilGuard";
import { BiometricScanner } from "./BiometricScanner";
import { motion } from "framer-motion";

export function TrustDashboard() {
    // State for Quadratic Voting Demo
    const [budget, setBudget] = useState(100);
    const [votes, setVotes] = useState<number>(0);
    const [cost, setCost] = useState<number>(0);

    // State for Steam Verification
    const [verificationStatus, setVerificationStatus] = useState<Record<string, string>>({});
    // State for Sybil Guard
    const [isHuman, setIsHuman] = useState<boolean | null>(null);
    const [showScanner, setShowScanner] = useState(false);

    // ... (keep QV Logic)

    // Sybil Logic
    const startScan = () => {
        setIsHuman(null);
        setShowScanner(true);
    };

    const handleScanComplete = (success: boolean) => {
        setIsHuman(success);
        setShowScanner(false);
    };

    // ... (keep other functions)

    const handleVoteChange = (newIntensity: number) => {
        try {
            const newCost = QuadraticVoting.calculateCost(newIntensity);
            if (newCost > budget) return;
            setVotes(newIntensity);
            setCost(newCost);
        } catch (e) {
            console.error(e);
        }
    };

    // Platform Logic
    const [activePlatform, setActivePlatform] = useState<Platform | null>(null);
    const [library, setLibrary] = useState<GameInfo[]>([]);
    const [isConnecting, setIsConnecting] = useState(false);

    const connectPlatform = async (platform: Platform) => {
        if (platform === 'Epic') {
            // Real Backend Redirect
            window.location.href = "http://localhost:3000/api/auth/epic";
            return;
        }

        setIsConnecting(true);
        setActivePlatform(platform);
        const games = await PlatformVerifier.connectPlatform(platform);
        setLibrary(games);
        setIsConnecting(false);
    };

    const verifyGame = (game: GameInfo) => {
        const result = PlatformVerifier.verifyEligibility(game);
        setVerificationStatus(prev => ({
            ...prev,
            [game.id]: result.verified ? "Verified ✅" : `Failed: ${result.reason}`
        }));
    };

    // Sybil Logic
    const scanFace = async () => {
        setIsScanning(true);
        const proof = await SybilGuard.generateMockProof();
        const result = SybilGuard.verifyHumanity(proof);
        setIsHuman(result);
        setIsScanning(false);
    };

    const earnCredits = () => {
        setBudget(prev => prev + 10);
    };

    return (
        <div className="p-8 space-y-12 bg-surface/50 rounded-3xl border border-zinc-800">
            <h2 className="text-3xl font-bold font-display text-text-primary">Trust Engine Diagnostic</h2>

            {showScanner && (
                <BiometricScanner
                    onVerify={handleScanComplete}
                    onClose={() => setShowScanner(false)}
                />
            )}

            {/* 1. Sybil Guard Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                <h3 className="text-xl font-bold text-text-muted">1. Sybil Resistance (Humanode)</h3>
                <div className="flex items-center gap-4">
                    <Button variant="secondary" onClick={startScan}>
                        {isHuman === true ? "Re-Verify Humanity" : "Verify Humanity"}
                    </Button>
                    {isHuman === true && <span className="text-critic-green font-bold text-lg">Unique Human Verified</span>}
                    {isHuman === false && <span className="text-bruta-red font-bold text-lg">Verification Failed</span>}
                </div>
            </motion.section>

            {/* 2. Proof of Play (Multi-Platform) */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
            >
                <h3 className="text-xl font-bold text-text-muted">2. Proof of Play (Any Platform)</h3>

                {/* Platform Selectors */}
                <div className="flex gap-4 flex-wrap">
                    {(['Steam', 'Epic', 'Xbox', 'Ubisoft'] as const).map(p => (
                        <Button
                            key={p}
                            variant={activePlatform === p ? "primary" : "secondary"}
                            onClick={() => connectPlatform(p)}
                            disabled={isConnecting}
                            className={activePlatform === p ? "bg-critic-green text-black hover:bg-critic-green/80" : ""}
                        >
                            {p}
                        </Button>
                    ))}
                </div>

                {/* Library Grid */}
                <div className="grid gap-4 mt-6">
                    {library.map(game => (
                        <div key={game.id} className="flex items-center justify-between p-4 bg-background rounded-xl border border-zinc-800">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-text-muted">
                                    {game.platform[0]}
                                </div>
                                <div>
                                    <div className="font-bold">{game.title}</div>
                                    <div className="text-sm text-text-muted">{(game.playtimeMinutes / 60).toFixed(1)} Hours Played</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={verificationStatus[game.id]?.includes("Failed") ? "text-bruta-red" : "text-critic-green"}>
                                    {verificationStatus[game.id]}
                                </span>
                                <Button variant="ghost" onClick={() => verifyGame(game)} className="border border-zinc-700">
                                    Verify
                                </Button>
                            </div>
                        </div>
                    ))}
                    {/* Empty State */}
                    {activePlatform && library.length === 0 && !isConnecting && (
                        <div className="text-text-muted italic">No games found on this platform.</div>
                    )}
                </div>
            </motion.section>

            {/* 3. Quadratic Voting Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
            >
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-text-muted">3. Quadratic Voting Simulator</h3>
                    <div className="flex items-center gap-4">
                        <div className="font-mono text-xl text-critic-green">Budget: {budget} Credits</div>
                        <Button variant="ghost" onClick={earnCredits} className="text-xs border border-zinc-800">
                            + Earn 10
                        </Button>
                    </div>
                </div>

                <div className="p-6 bg-background rounded-2xl border border-zinc-800">
                    <div className="flex justify-between items-center mb-8">
                        <div className="text-center">
                            <div className="text-sm text-text-muted">Votes Cast</div>
                            <motion.div
                                key={votes}
                                initial={{ scale: 1.5, color: "#fff" }}
                                animate={{ scale: 1, color: "#fff" }}
                                className="text-4xl font-black"
                            >
                                {votes}
                            </motion.div>
                        </div>
                        <div className="text-2xl font-bold text-zinc-600">x² =</div>
                        <div className="text-center">
                            <div className="text-sm text-text-muted">Cost</div>
                            <motion.div
                                key={cost}
                                initial={{ scale: 1.5, color: "#EF4444" }}
                                animate={{ scale: 1, color: "#EF4444" }}
                                className="text-4xl font-black text-bruta-red"
                            >
                                {cost}
                            </motion.div>
                        </div>
                    </div>

                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={votes}
                        onChange={(e) => handleVoteChange(parseInt(e.target.value))}
                        className="w-full accent-critic-green h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-text-muted mt-2 font-mono">
                        <span>0 (Free)</span>
                        <span>5 (25 Credits)</span>
                        <span>10 (100 Credits)</span>
                    </div>
                </div>
            </motion.section>
        </div>
    );
}

