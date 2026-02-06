import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "../lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Convert Supabase user to our User type
    const mapSupabaseUser = (supabaseUser: SupabaseUser): User => ({
        id: supabaseUser.id,
        steam_id: supabaseUser.id,
        username: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'Gamer',
        avatar_url: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || null,
        reputation_credits: 100,
        created_at: supabaseUser.created_at
    });

    // Check for existing session on mount
    const refreshUser = async () => {
        try {
            // First check Supabase Auth session
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                setUser(mapSupabaseUser(session.user));
                setIsLoading(false);
                return;
            }

            // Fallback to JWT cookie (for Steam/Epic auth)
            const cookies = document.cookie.split(';');
            const sessionCookie = cookies.find(c => c.trim().startsWith('bruta_session='));

            if (!sessionCookie) {
                setUser(null);
                setIsLoading(false);
                return;
            }

            // Decode JWT to get user info
            const token = sessionCookie.split('=')[1];
            const payload = JSON.parse(atob(token.split('.')[1]));

            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('steam_id', payload.steamId || payload.epicId)
                .single();

            if (error || !data) {
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

    // Google Sign-In via Supabase
    const signInWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } catch (e) {
            console.error("Google sign-in error:", e);
        }
    };

    const logout = async () => {
        // Sign out from Supabase
        await supabase.auth.signOut();
        // Clear JWT cookie
        document.cookie = 'bruta_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setUser(null);
    };

    useEffect(() => {
        refreshUser();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setUser(mapSupabaseUser(session.user));
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated: !!user,
            logout,
            refreshUser,
            signInWithGoogle
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
