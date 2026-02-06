import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { ShieldCheck, ShieldAlert, X, Brain, CheckCircle2 } from "lucide-react";

interface BiometricScannerProps {
    onVerify: (success: boolean) => void;
    onClose: () => void;
}

// Human verification questions
const questions = [
    {
        question: "What color is the sky on a clear day?",
        answers: ["blue", "Blue", "BLUE"],
        options: ["Green", "Blue", "Purple", "Orange"]
    },
    {
        question: "How many legs does a dog have?",
        answers: ["4", "four", "Four"],
        options: ["2", "4", "6", "8"]
    },
    {
        question: "Which one is a fruit?",
        answers: ["apple", "Apple", "APPLE"],
        options: ["Carrot", "Potato", "Apple", "Broccoli"]
    },
    {
        question: "What do you use to write on paper?",
        answers: ["pen", "Pen", "pencil", "Pencil"],
        options: ["Hammer", "Pen", "Spoon", "Key"]
    },
    {
        question: "What year comes after 2024?",
        answers: ["2025"],
        options: ["2023", "2024", "2025", "2026"]
    }
];

export function BiometricScanner({ onVerify, onClose }: BiometricScannerProps) {
    const [step, setStep] = useState<'intro' | 'questions' | 'result'>('intro');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    // Get 3 random questions
    const [selectedQuestions] = useState(() => {
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 3);
    });

    const handleStart = () => {
        setStep('questions');
    };

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer);
        setShowFeedback(true);

        const isCorrect = selectedQuestions[currentQuestion].answers.includes(answer);
        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
        }

        // Move to next question or result after delay
        setTimeout(() => {
            setShowFeedback(false);
            setSelectedAnswer(null);

            if (currentQuestion < selectedQuestions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
            } else {
                // All questions answered
                setStep('result');
                const passed = correctAnswers + (isCorrect ? 1 : 0) >= 2; // Need at least 2/3 correct
                if (passed) {
                    setTimeout(() => onVerify(true), 1500);
                }
            }
        }, 800);
    };

    const passed = correctAnswers >= 2;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-critic-green animate-pulse" />
                        <span className="font-mono text-sm text-critic-green">HUMAN VERIFICATION</span>
                    </div>
                    <Button variant="ghost" onClick={onClose} className="p-1 h-auto text-zinc-500 hover:text-white">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Main Content */}
                <div className="p-8">

                    {step === 'intro' && (
                        <div className="text-center space-y-6">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto"
                            >
                                <Brain className="w-10 h-10 text-critic-green" />
                            </motion.div>
                            <div>
                                <h3 className="text-2xl font-black text-white">Prove You're Human</h3>
                                <p className="text-text-muted text-sm mt-2">
                                    Answer 3 simple questions to verify you're not a bot.
                                </p>
                            </div>
                            <Button
                                variant="primary"
                                onClick={handleStart}
                                className="w-full bg-critic-green text-black hover:bg-critic-green/80 font-bold py-3"
                            >
                                Start Verification
                            </Button>
                        </div>
                    )}

                    {step === 'questions' && (
                        <div className="space-y-6">
                            {/* Progress */}
                            <div className="flex items-center gap-2 justify-center">
                                {selectedQuestions.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-3 h-3 rounded-full transition-colors ${idx < currentQuestion ? 'bg-critic-green' :
                                                idx === currentQuestion ? 'bg-white' : 'bg-zinc-700'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Question */}
                            <motion.div
                                key={currentQuestion}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-center"
                            >
                                <p className="text-xs text-text-muted mb-2">Question {currentQuestion + 1} of 3</p>
                                <h3 className="text-xl font-bold text-white">
                                    {selectedQuestions[currentQuestion].question}
                                </h3>
                            </motion.div>

                            {/* Options */}
                            <div className="grid grid-cols-2 gap-3">
                                {selectedQuestions[currentQuestion].options.map((option) => {
                                    const isCorrect = selectedQuestions[currentQuestion].answers.includes(option);
                                    const isSelected = selectedAnswer === option;

                                    return (
                                        <motion.button
                                            key={option}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => !showFeedback && handleAnswer(option)}
                                            disabled={showFeedback}
                                            className={`p-4 rounded-xl border-2 text-left font-medium transition-all ${showFeedback && isSelected
                                                    ? isCorrect
                                                        ? 'bg-critic-green/20 border-critic-green text-critic-green'
                                                        : 'bg-bruta-red/20 border-bruta-red text-bruta-red'
                                                    : showFeedback && isCorrect
                                                        ? 'bg-critic-green/10 border-critic-green/50 text-critic-green'
                                                        : 'bg-zinc-800 border-zinc-700 text-white hover:border-zinc-500'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{option}</span>
                                                {showFeedback && isSelected && isCorrect && (
                                                    <CheckCircle2 className="w-5 h-5" />
                                                )}
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {step === 'result' && (
                        <div className="text-center space-y-6">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", damping: 15 }}
                                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${passed ? 'bg-critic-green/10 text-critic-green' : 'bg-bruta-red/10 text-bruta-red'
                                    }`}
                            >
                                {passed ? <ShieldCheck className="w-12 h-12" /> : <ShieldAlert className="w-12 h-12" />}
                            </motion.div>
                            <div>
                                <h3 className="text-2xl font-black text-white">
                                    {passed ? "HUMAN VERIFIED" : "VERIFICATION FAILED"}
                                </h3>
                                <p className="text-text-muted text-sm mt-2 font-mono">
                                    {passed
                                        ? `Score: ${correctAnswers}/3 • HASH: 0x7f...3a9c`
                                        : `Score: ${correctAnswers}/3 • Too many wrong answers`
                                    }
                                </p>
                            </div>
                            {!passed && (
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setStep('intro');
                                        setCurrentQuestion(0);
                                        setCorrectAnswers(0);
                                    }}
                                    className="w-full"
                                >
                                    Try Again
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
