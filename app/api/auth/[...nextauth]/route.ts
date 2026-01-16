import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions, User as NextAuthUser, Account, Profile, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import {connectDB} from "../../../../lib/utils/db";
import User from "../../../../lib/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: {
      user: NextAuthUser;
      account: Account | null;
      profile?: Profile;
    }) {
      if (account?.provider === "google") {
        try {
          await connectDB();

          // Normalize email
          const normalizedEmail = user.email!.toLowerCase().trim();

          // Check if user exists
          let existingUser = await User.findOne({ email: normalizedEmail });

          if (!existingUser) {
            // Create new user
            existingUser = new User({
              email: normalizedEmail,
              role: 'user',
              isActive: true,
            });
            await existingUser.save();
          }

          // Attach user ID to the token
          user.id = existingUser._id.toString();
          return true;
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }: {
      token: JWT;
      user?: NextAuthUser;
    }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }: {
      session: Session;
      token: JWT;
    }) {
      if (token.userId && session.user) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
