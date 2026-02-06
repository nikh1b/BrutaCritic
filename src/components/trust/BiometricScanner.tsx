import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { Camera, ShieldCheck, ShieldAlert, X } from "lucide-react";

interface BiometricScannerProps {
    onVerify: (success: boolean) => void;
    onClose: () => void;
}

export function BiometricScanner({ onVerify, onClose }: BiometricScannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [step, setStep] = useState<'request' | 'scanning' | 'analyzing' | 'result'>('request');
    const [result, setResult] = useState<boolean | null>(null);

    // cleanup
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setStep('scanning');
            // Auto start scan process
            setTimeout(() => setStep('analyzing'), 3000);
            setTimeout(() => {
                const isSuccess = Math.random() > 0.1; // 90% success rate
                setResult(isSuccess);
                setStep('result');
                if (isSuccess) {
                    setTimeout(() => onVerify(true), 1500);
                }
            }, 5000);
        } catch (err) {
            console.error("Camera access denied:", err);
            // Handle error state
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">

                {/* Header */}
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-bruta-red animate-pulse" />
                        <span className="font-mono text-sm text-bruta-red">HUMANODE // BIO-AUTH</span>
                    </div>
                    <Button variant="ghost" onClick={onClose} className="p-1 h-auto text-zinc-500 hover:text-white">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Main Content */}
                <div className="relative aspect-[4/5] bg-black flex flex-col items-center justify-center">

                    {step === 'request' && (
                        <div className="text-center space-y-4 p-8">
                            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                                <Camera className="w-8 h-8 text-text-muted" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Face Scan Required</h3>
                            <p className="text-text-muted text-sm">
                                To ensure one-person-one-vote, we need to verify your uniqueness using cryptobiometrics.
                            </p>
                            <Button variant="primary" onClick={startCamera} className="w-full bg-white text-black hover:bg-zinc-200">
                                Start Camera
                            </Button>
                        </div>
                    )}

                    {(step === 'scanning' || step === 'analyzing') && (
                        <div className="relative w-full h-full">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                                onLoadedMetadata={(e) => e.currentTarget.play()}
                            />
                            {/* Scanning Overlay */}
                            <div className="absolute inset-0 border-[20px] border-black/50" />
                            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-30">
                                <div className="border-r border-b border-critic-green/50" />
                                <div className="border-b border-critic-green/50" />
                                <div className="border-r border-critic-green/50" />
                                <div />
                            </div>

                            {/* Scan Line */}
                            <motion.div
                                className="absolute top-0 left-0 w-full h-1 bg-critic-green shadow-[0_0_15px_#BEF264]"
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />

                            {/* Status Text */}
                            <div className="absolute bottom-8 left-0 w-full text-center">
                                <span className="inline-block px-3 py-1 bg-black/80 text-critic-green font-mono text-xs border border-critic-green/30">
                                    {step === 'scanning' ? "ACQUIRING BIOMETRICS..." : "GENERATING ZK-PROOF..."}
                                </span>
                            </div>
                        </div>
                    )}

                    {step === 'result' && (
                        <div className="text-center space-y-4 p-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${result ? 'bg-critic-green/10 text-critic-green' : 'bg-bruta-red/10 text-bruta-red'}`}
                            >
                                {result ? <ShieldCheck className="w-10 h-10" /> : <ShieldAlert className="w-10 h-10" />}
                            </motion.div>
                            <h3 className="text-2xl font-bold text-white">
                                {result ? "UNIQUE HUMAN VERIFIED" : "VERIFICATION FAILED"}
                            </h3>
                            <p className="text-text-muted text-sm font-mono">
                                {result ? "HASH: 0x7f...3a9c" : "ERROR: LIVENESS_CHECK_FAILED"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
