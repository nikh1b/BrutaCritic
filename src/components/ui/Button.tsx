import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "danger" | "ghost";
}

export function Button({ className, variant = "primary", children, ...props }: ButtonProps) {
    const variants = {
        primary: "bg-surface border border-zinc-800 text-text-primary hover:border-critic-green hover:shadow-[0_0_15px_rgba(190,242,100,0.3)]",
        secondary: "bg-zinc-900 text-text-muted hover:text-text-primary",
        danger: "bg-surface border border-bruta-red text-bruta-red hover:bg-bruta-red/10",
        ghost: "bg-transparent text-text-muted hover:text-text-primary",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "px-6 py-3 rounded-xl font-bold font-display transition-colors duration-200",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
}
