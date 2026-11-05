import type { NextAuthConfig } from 'next-auth';

// Edge-safe config (no Prisma / bcrypt) - shared by proxy.ts and auth.ts
const PROTECTED = ['/dashboard', '/collections', '/create', '/edit', '/settings'];

export const authConfig = {
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = PROTECTED.some((p) => nextUrl.pathname === p || nextUrl.pathname.startsWith(p + '/'));
      if (isProtected) return isLoggedIn;
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      if (trigger === 'update' && session?.name !== undefined) {
        token.name = session.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = (token.name as string) ?? null;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

export default authConfig;
