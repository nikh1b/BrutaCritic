import { Button } from "../ui/Button";
import { Menu, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface NavbarProps {
    onAboutClick?: () => void;
    onProfileClick?: () => void;
}

export function Navbar({ onAboutClick, onProfileClick }: NavbarProps) {
    const { isAuthenticated, user } = useAuth();

    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Branding */}
                <div className="flex items-center gap-1 cursor-pointer select-none">
                    <span className="text-2xl font-black tracking-tighter text-bruta-red">BRUTA</span>
                    <span className="text-2xl font-black tracking-tighter text-critic-green">CRITIC</span>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    <a href="#" className="font-bold text-text-muted hover:text-text-primary transition-colors">Reviews</a>
                    <a href="#" className="font-bold text-text-muted hover:text-text-primary transition-colors">Leaderboard</a>
                    <button onClick={onAboutClick} className="font-bold text-text-muted hover:text-text-primary transition-colors">About</button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="p-2" onClick={onProfileClick}>
                        {isAuthenticated && user?.avatar_url ? (
                            <img src={user.avatar_url} alt="Profile" className="w-6 h-6 rounded-full" />
                        ) : (
                            <User className="w-5 h-5" />
                        )}
                    </Button>
                    <Button variant="primary" className="hidden md:block">
                        {isAuthenticated ? "Connected" : "Connect Steam"}
                    </Button>
                    <Button variant="ghost" className="md:hidden">
                        <Menu className="w-6 h-6" />
                    </Button>
                </div>
            </div>
        </nav>
    );
}
