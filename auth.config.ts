import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('http://47.109.95.152:3000/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('http://47.109.95.152:3000/dashboard', nextUrl));
      }
      return true;
    },
    redirect({ url, baseUrl }) {
      console.log("Redirect in auth.config", { url, baseUrl });
      if (url.startsWith(baseUrl)) return url;
      else if (url.startsWith('http://47.109.95.152:3000')) return url;
      return baseUrl;
    },
  },
} satisfies NextAuthConfig;