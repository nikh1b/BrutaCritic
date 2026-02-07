import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, ArrowLeft } from "lucide-react";
import { Button } from "../ui/Button";

interface PrivacyPolicyProps {
    onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto py-12 px-6 text-text-muted space-y-8"
        >
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" onClick={onBack} className="p-2">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
                    <p className="text-sm">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <section className="space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-xl">
                    <Shield className="w-6 h-6 text-critic-green" />
                    <h2>1. Data We Collect</h2>
                </div>
                <p>
                    We collect minimal data necessary to function:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-white">Profile Data:</strong> When you sign in with Google, Steam, or Epic, we store your public ID, username, and avatar.</li>
                    <li><strong className="text-white">Game Activity:</strong> To verify reviews, we may access your public game library and playtime statistics via platform APIs based on your explicit consent.</li>
                    <li><strong className="text-white">User Content:</strong> Reviews, ratings, and votes you publicly post.</li>
                </ul>
            </section>

            <section className="space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-xl">
                    <Lock className="w-6 h-6 text-bruta-red" />
                    <h2>2. How We Use Your Data</h2>
                </div>
                <ul className="list-disc pl-6 space-y-2">
                    <li>To <strong className="text-white">authenticate</strong> you and prevent Sybil attacks (duplicate fake accounts).</li>
                    <li>To <strong className="text-white">verify</strong> that you own and have played the games you review ("Proof of Play").</li>
                    <li>To calculate reputation stores and display your public profile.</li>
                </ul>
            </section>

            <section className="space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-xl">
                    <Eye className="w-6 h-6 text-blue-400" />
                    <h2>3. Data Sharing</h2>
                </div>
                <p>
                    We do <strong className="text-white">NOT</strong> sell your personal data to third parties.
                    Your reviews and profile stats are public by default, as this is a public review platform.
                    We use Supabase for secure database hosting.
                </p>
            </section>

            <section className="space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-xl">
                    <FileText className="w-6 h-6 text-yellow-500" />
                    <h2>4. Your Rights</h2>
                </div>
                <p>
                    You can request deletion of your account and all associated data at any time by contacting support or using the delete account feature in settings.
                </p>
            </section>

            <div className="pt-8 border-t border-zinc-800 text-center">
                <p className="text-xs">
                    Contact: privacy@brutacritic.com
                </p>
            </div>
        </motion.div>
    );
}
