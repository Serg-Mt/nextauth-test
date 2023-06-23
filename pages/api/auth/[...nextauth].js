/* eslint-disable new-cap */
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

const prisma = new PrismaClient();

export const authOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' }
      },
      // eslint-disable-next-line no-unused-vars
      async authorize(credentials, req) {
        console.log('credentials', credentials);
        // Return null if user data could not be retrieved

        if ('1' === credentials.username && '1' === credentials.password)
          return { id: '1', name: 'J Smith', email: 'jsmith@example.com' };
        return null;
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.debug('>> callback signIn',{ user, account, profile, email, credentials });
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.debug('>> callback redirect',{ url, baseUrl });
      return baseUrl;
    },
    async session({ session, user, token }) {
      console.debug('>> callback session',{ session, user, token });
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.debug('>> callback jwt',{ token, user, account, profile, isNewUser });
      return token;
    }
  }
};

const resf = NextAuth(authOptions);

export default (...params) => {
  const [req] = params;
  console.debug('>> ', req.method, ' запрос на', req.url, req.query);
  return resf(...params);
};
