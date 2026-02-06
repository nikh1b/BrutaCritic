import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "../lib/supabase";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    const refreshUser = async () => {
        try {
            // Check for JWT cookie set by our backend
            const cookies = document.cookie.split(';');
            const sessionCookie = cookies.find(c => c.trim().startsWith('bruta_session='));

            if (!sessionCookie) {
                setUser(null);
                setIsLoading(false);
                return;
            }

            // Decode JWT to get user info (basic decode, not verification)
            const token = sessionCookie.split('=')[1];
            const payload = JSON.parse(atob(token.split('.')[1]));

            // Fetch user from Supabase using the ID from JWT
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('steam_id', payload.steamId || payload.epicId)
                .single();

            if (error || !data) {
                // User might not exist in DB yet, create a placeholder
                setUser({
                    id: payload.steamId || payload.epicId || 'unknown',
                    steam_id: payload.steamId || payload.epicId || 'unknown',
                    username: payload.username || 'Verified Gamer',
                    avatar_url: payload.avatar || null,
                    reputation_credits: 100,
                    created_at: new Date().toISOString()
                });
            } else {
                setUser(data);
            }
        } catch (e) {
            console.error("Auth error:", e);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        document.cookie = 'bruta_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setUser(null);
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated: !!user,
            logout,
            refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
