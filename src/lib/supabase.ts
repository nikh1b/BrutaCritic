import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials not found. Database features will not work.");
}

export const supabase = createClient(
    supabaseUrl || "https://placeholder.supabase.co",
    supabaseAnonKey || "placeholder_key"
);

// Types matching our SQL schema
export interface User {
    id: string;
    steam_id: string;
    username: string | null;
    avatar_url: string | null;
    reputation_credits: number;
    created_at: string;
}

export interface Review {
    id: string;
    game_id: string;
    user_id: string;
    content: string | null;
    score: number | null;
    playtime_at_review: number | null;
    proof_of_play_verified: boolean;
    created_at: string;
    // Joined data
    user?: User;
}

export interface Vote {
    id: string;
    review_id: string;
    user_id: string;
    vote_count: number;
    credit_cost: number;
    created_at: string;
}
