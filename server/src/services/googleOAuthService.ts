import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { OAuth2Client } from 'google-auth-library';
import { User, IUser } from '../models/User';
import { JWTService } from './jwtService';

export class GoogleOAuthService {
  private static googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  static initialize() {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
        },
        async (accessToken: string, refreshToken: string, profile: Profile, done: any) => {
          try {
            // Check if user already exists
            let existingUser = await User.findOne({ email: profile.emails?.[0]?.value });

            if (existingUser) {
              // User exists, update last login and return
              existingUser.lastLogin = new Date();
              await existingUser.save();
              return done(null, existingUser);
            }

            // Create new user from Google profile
            const newUser = new User({
              email: profile.emails?.[0]?.value,
              name: profile.displayName || `${profile.name?.givenName} ${profile.name?.familyName}`,
              dateOfBirth: new Date('1990-01-01'), // Default DOB, user can update later
              isEmailVerified: true, // Google accounts are pre-verified
              lastLogin: new Date()
            });

            await newUser.save();
            return done(null, newUser);

          } catch (error) {
            console.error('Google OAuth error:', error);
            return done(error, null);
          }
        }
      )
    );

    // Serialize user for session
    passport.serializeUser((user: any, done) => {
      done(null, user._id);
    });

    // Deserialize user from session
    passport.deserializeUser(async (id: string, done) => {
      try {
        const user = await User.findById(id);
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    });
  }

  static generateAuthURL(): string {
    const baseURL = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent'
    });

    return `${baseURL}?${params.toString()}`;
  }

  static async handleCallback(code: string): Promise<{ success: boolean; token?: string; user?: any; error?: string }> {
    try {
      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          code,
          grant_type: 'authorization_code',
          redirect_uri: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'
        })
      });

      const tokens: any = await tokenResponse.json();

      if (!tokens.access_token) {
        return { success: false, error: 'Failed to get access token' };
      }

      // Get user profile
      const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`
        }
      });

      const profile: any = await profileResponse.json();

      // Check if user exists
      let user = await User.findOne({ email: profile.email });

      if (!user) {
        // Create new user
        user = new User({
          email: profile.email,
          name: profile.name,
          dateOfBirth: new Date('1990-01-01'), // Default DOB
          isEmailVerified: true,
          lastLogin: new Date()
        });
        await user.save();
      } else {
        // Update last login
        user.lastLogin = new Date();
        await user.save();
      }

      // Generate JWT token
      const jwtToken = JWTService.generateToken({
        userId: (user._id as any).toString(),
        email: user.email
      });

      return {
        success: true,
        token: jwtToken,
        user: {
          id: (user._id as any).toString(),
          email: user.email,
          name: user.name,
          dateOfBirth: user.dateOfBirth,
          isEmailVerified: user.isEmailVerified
        }
      };

    } catch (error) {
      console.error('Google OAuth callback error:', error);
      return { success: false, error: 'OAuth authentication failed' };
    }
  }

  // Verify Google ID Token (for frontend authentication)
  static async verifyIdToken(idToken: string): Promise<{ success: boolean; token?: string; user?: any; error?: string }> {
    try {
      // Verify the token with Google
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      
      if (!payload || !payload.email) {
        return { success: false, error: 'Invalid token payload' };
      }

      // Check if user exists
      let user = await User.findOne({ email: payload.email });

      if (!user) {
        // Create new user
        user = new User({
          email: payload.email,
          name: payload.name || 'Google User',
          dateOfBirth: new Date('1990-01-01'), // Default DOB
          isEmailVerified: true, // Google accounts are pre-verified
          lastLogin: new Date()
        });
        await user.save();
      } else {
        // Update last login
        user.lastLogin = new Date();
        await user.save();
      }

      // Generate JWT token
      const jwtToken = JWTService.generateToken({
        userId: (user._id as any).toString(),
        email: user.email
      });

      return {
        success: true,
        token: jwtToken,
        user: {
          id: (user._id as any).toString(),
          email: user.email,
          name: user.name,
          dateOfBirth: user.dateOfBirth,
          isEmailVerified: user.isEmailVerified
        }
      };

    } catch (error) {
      console.error('Google ID token verification error:', error);
      return { success: false, error: 'Token verification failed' };
    }
  }
}
