import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as SteamStrategy } from 'passport-steam';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = 3000; // Backend Port
const FRONTEND_URL = process.env.BASE_URL || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(passport.initialize());

// --- EPIC GAMES STRATEGY ---
if (process.env.EPIC_CLIENT_ID && process.env.EPIC_CLIENT_SECRET) {
    passport.use('epic', new OAuth2Strategy({
        authorizationURL: 'https://www.epicgames.com/id/authorize',
        tokenURL: 'https://api.epicgames.dev/epic/oauth/v1/token',
        clientID: process.env.EPIC_CLIENT_ID,
        clientSecret: process.env.EPIC_CLIENT_SECRET,
        callbackURL: `http://localhost:${PORT}/api/auth/epic/callback`,
        scope: ['basic_profile']
    },
        (accessToken: string, refreshToken: string, profile: any, cb: Function) => {
            // In prod, fetch profile using accessToken
            return cb(null, { id: 'epic_user_placeholder', token: accessToken });
        }));
}

// --- STEAM STRATEGY ---
if (process.env.STEAM_API_KEY) {
    passport.use(new SteamStrategy({
        returnURL: `http://localhost:${PORT}/api/auth/steam/return`,
        realm: `http://localhost:${PORT}/`,
        apiKey: process.env.STEAM_API_KEY
    },
        (identifier: string, profile: any, done: Function) => {
            profile.identifier = identifier;
            return done(null, profile);
        }));
}

// --- ROUTES ---

// Epic Routes
app.get('/api/auth/epic', passport.authenticate('epic'));
app.get('/api/auth/epic/callback',
    passport.authenticate('epic', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=failed` }),
    (req, res) => {
        const user = req.user as any;
        const token = jwt.sign({ epicId: user.id }, process.env.JWT_SECRET || 'secret');
        res.cookie('bruta_session', token, { httpOnly: false }); // Allow frontend read
        res.redirect(FRONTEND_URL);
    }
);

// Steam Routes
app.get('/api/auth/steam', passport.authenticate('steam'));
app.get('/api/auth/steam/return',
    passport.authenticate('steam', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=failed` }),
    (req, res) => {
        const user = req.user as any;
        const token = jwt.sign({ steamId: user.id }, process.env.JWT_SECRET || 'secret');
        res.cookie('bruta_session', token, { httpOnly: false });
        res.redirect(FRONTEND_URL);
    }
);

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
