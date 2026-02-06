import { IncomingMessage, ServerResponse } from 'http';
import passport from 'passport';
import { Strategy as SteamStrategy } from 'passport-steam';
import Cookies from 'cookies';
import jwt from 'jsonwebtoken';

// Configuration
const STEAM_API_KEY = process.env.STEAM_API_KEY; // Must be set in Vercel/Local .env
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173'; // Production URL
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_do_not_use_in_prod';

if (!STEAM_API_KEY) {
    console.warn("WARNING: STEAM_API_KEY is not set.");
}

// Passport Setup
passport.use(new SteamStrategy({
    returnURL: `${BASE_URL}/api/auth/steam/return`,
    realm: BASE_URL,
    apiKey: STEAM_API_KEY // Required
},
    (identifier: string, profile: any, done: Function) => {
        // In a real app, this is where you'd save/update the user in Supabase
        profile.identifier = identifier;
        return done(null, profile);
    }
));

// Handler
export default function handler(req: IncomingMessage, res: ServerResponse) {
    return new Promise((resolve, reject) => {

        // 1. Initialize Passport
        // @ts-ignore - Mimicking Express middleware for Vercel raw handler
        passport.initialize()(req as any, res as any, () => {

            // 2. Route Dispatch
            if (req.url?.includes('/return')) {
                // Callback verification
                passport.authenticate('steam', { failureRedirect: '/' }, (err, user) => {
                    if (err || !user) {
                        res.statusCode = 401;
                        res.end('Authentication failed');
                        return resolve(null);
                    }

                    // Issue JWT
                    const token = jwt.sign(
                        {
                            steamId: user.id,
                            name: user.displayName,
                            avatar: user.photos?.[2]?.value
                        },
                        JWT_SECRET,
                        { expiresIn: '7d' }
                    );

                    // Set Cookie
                    const cookies = new Cookies(req, res);
                    cookies.set('bruta_session', token, {
                        httpOnly: false, // Allow client to read for prototype convenience (or keep true and use verify endpoint)
                        sameSite: 'lax'
                    });

                    // Redirect to Dashboard
                    res.statusCode = 302;
                    res.setHeader('Location', '/');
                    res.end();
                    resolve(null);
                })(req as any, res as any, resolve);

            } else {
                // Initial Redirect to Steam
                passport.authenticate('steam')(req as any, res as any, resolve);
            }
        });

    });
}
