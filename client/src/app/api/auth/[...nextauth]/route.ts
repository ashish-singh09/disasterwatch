import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),

        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID || '',
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
        }),
    ],

    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    callbacks: {
        // custom callback function that creates user account in the database if logging in through facebook or google
        async signIn({ user, account }) {
            try {

                let body = {};
                if (account && (account.provider === 'google' || account.provider === 'facebook')) {
                    body = { email: user.email, provider: account.provider, name: user?.name };
                } else return true;


                // Check if the user already exists in the database if not create a new user
                const res = await fetch(`${process.env.BACKEND_API}/api/auth/login`, {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: { "Content-Type": "application/json" }
                });

                let User = await res.json();
                console.log(User);
                
                if (res.ok && User) {
                    return true;
                } else return false;

            } catch (error) {
                console.log(error);
                return false;
            }
        },

        async session({ session, token }) {
            session.user = token.user;
            return session;
        },

        async jwt({ token, account, user }) {
            const res = await fetch(`${process.env.BACKEND_API}/api/auth/profile`, {
                method: 'POST',
                body: JSON.stringify({ email: token.email, provider: account?.provider }),
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();

            if (res.ok && data) {
                token.user = {
                    id: data._id,
                    name: data.name,
                    image: data.profileImage,
                    role: data.role
                }
            }
            return token
        }
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }