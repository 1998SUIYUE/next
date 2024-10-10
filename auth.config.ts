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
      console.log("auth nexturl",auth,nextUrl)
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
    redirect({ url, baseUrl }) {
      console.log("Redirect in auth.config", { url, baseUrl });
       if (url.startsWith(baseUrl) || url.startsWith('http://47.109.95.152:3000')) {
         console.log("Redirecting to:", url);
         return url;
       }
       console.log("Redirecting to baseUrl:", baseUrl);
       return baseUrl;
    },
    
  },
} satisfies NextAuthConfig;