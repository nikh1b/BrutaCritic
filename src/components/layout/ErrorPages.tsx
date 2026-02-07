import { motion } from "framer-motion";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "../ui/Button";

interface ErrorProps {
    error?: Error;
    resetErrorBoundary?: () => void;
    title?: string;
    message?: string;
}

export function ErrorPage({
    error,
    resetErrorBoundary,
    title = "System Failure",
    message = "Criticial error detected in the resistance network."
}: ErrorProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md w-full bg-surface border border-bruta-red/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(239,68,68,0.2)]"
            >
                <div className="w-16 h-16 bg-bruta-red/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-8 h-8 text-bruta-red" />
                </div>

                <h1 className="text-2xl font-black text-white mb-2">{title}</h1>
                <p className="text-text-muted mb-6">
                    {message}
                    {error && (
                        <span className="block mt-2 p-2 bg-black/40 rounded text-xs font-mono text-bruta-red break-all">
                            {error.message}
                        </span>
                    )}
                </p>

                <div className="flex gap-4 justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => window.location.href = '/'}
                        className="flex items-center gap-2"
                    >
                        <Home className="w-4 h-4" />
                        Home
                    </Button>

                    {resetErrorBoundary && (
                        <Button
                            variant="primary"
                            onClick={resetErrorBoundary}
                            className="bg-white text-black hover:bg-zinc-200"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retry
                        </Button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export function NotFoundPage() {
    return (
        <ErrorPage
            title="404: Signal Lost"
            message="The page you are looking for has been censored or does not exist."
        />
    );
}
