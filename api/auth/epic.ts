import { IncomingMessage, ServerResponse } from 'http';
import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import Cookies from 'cookies';
import jwt from 'jsonwebtoken';

// Configuration
const EPIC_CLIENT_ID = process.env.EPIC_CLIENT_ID;
const EPIC_CLIENT_SECRET = process.env.EPIC_CLIENT_SECRET;
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_do_not_use_in_prod';

if (!EPIC_CLIENT_ID || !EPIC_CLIENT_SECRET) {
    console.warn("WARNING: EPIC_CLIENT_ID or EPIC_CLIENT_SECRET is not set.");
}

// Passport Setup
passport.use('epic', new OAuth2Strategy({
    authorizationURL: 'https://www.epicgames.com/id/authorize',
    tokenURL: 'https://api.epicgames.dev/epic/oauth/v1/token',
    clientID: EPIC_CLIENT_ID || 'mock_id',
    clientSecret: EPIC_CLIENT_SECRET || 'mock_secret',
    callbackURL: `${BASE_URL}/api/auth/epic/callback`,
    scope: ['basic_profile', 'friends_list', 'presence'] // Adjust scopes as needed
},
    (accessToken: string, refreshToken: string, profile: any, cb: Function) => {
        // In a real implementation:
        // 1. Use accessToken to fetch user profile from https://api.epicgames.dev/epic/id/v1/accounts
        // 2. Save/Update user in Supabase
        // For now we just pass the access token as the "user"
        return cb(null, { id: 'epic_user_placeholder', token: accessToken });
    }
));

// Handler
export default function handler(req: IncomingMessage, res: ServerResponse) {
    return new Promise((resolve, reject) => {

        // @ts-ignore
        passport.initialize()(req as any, res as any, () => {

            if (req.url?.includes('/callback')) {
                passport.authenticate('epic', { session: false, failureRedirect: '/' }, (err, user) => {
                    if (err || !user) {
                        res.statusCode = 401;
                        res.end('Authentication failed');
                        return resolve(null);
                    }

                    // Issue JWT
                    const token = jwt.sign(
                        {
                            epicId: user.id,
                            provider: 'epic'
                        },
                        JWT_SECRET,
                        { expiresIn: '7d' }
                    );

                    const cookies = new Cookies(req, res);
                    cookies.set('bruta_session', token, { httpOnly: false, sameSite: 'lax' });

                    res.statusCode = 302;
                    res.setHeader('Location', '/');
                    res.end();
                    resolve(null);
                })(req as any, res as any, resolve);

            } else {
                passport.authenticate('epic')(req as any, res as any, resolve);
            }
        });

    });
}
