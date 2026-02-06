import { Button } from "../ui/Button";
import { Menu, User, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface NavbarProps {
    onAboutClick?: () => void;
    onProfileClick?: () => void;
    onSignInClick?: () => void;
}

export function Navbar({ onAboutClick, onProfileClick, onSignInClick }: NavbarProps) {
    const { isAuthenticated, user, logout } = useAuth();

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
                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            <Button variant="ghost" className="p-2" onClick={onProfileClick}>
                                {user?.avatar_url ? (
                                    <img src={user.avatar_url} alt="Profile" className="w-7 h-7 rounded-full border-2 border-critic-green" />
                                ) : (
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-bruta-red to-critic-green flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </Button>
                            <div className="hidden md:flex items-center gap-2">
                                <span className="text-sm font-bold text-white">{user?.username}</span>
                                <Button variant="ghost" onClick={logout} className="p-2 text-zinc-500 hover:text-bruta-red">
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="primary"
                                onClick={onSignInClick}
                                className="hidden md:flex items-center gap-2 bg-critic-green text-black hover:bg-critic-green/80"
                            >
                                Sign In
                            </Button>
                            <Button variant="ghost" className="p-2 md:hidden" onClick={onSignInClick}>
                                <User className="w-5 h-5" />
                            </Button>
                        </>
                    )}
                    <Button variant="ghost" className="md:hidden">
                        <Menu className="w-6 h-6" />
                    </Button>
                </div>
            </div>
        </nav>
    );
}
