import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      console.log("---------auth nexturl---------", auth, nextUrl);
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      
      console.log("--------是否登录--------", isLoggedIn);
      console.log("--------是否在仪表板页面--------", isOnDashboard);
      console.log("--------当前路径--------", nextUrl.pathname);

      if (isLoggedIn) {
        if (!isOnDashboard) {
          console.log("--------用户已登录但不在仪表板页面，重定向到仪表板--------");
          const dashboardUrl = new URL('/dashboard', nextUrl.origin);
          console.log("----------------重定向到----------", dashboardUrl.toString());
          return Response.redirect(dashboardUrl);
        }
        console.log("--------用户已登录且在仪表板页面，允许访问--------");
        return true;
      }

      if (isOnDashboard) {
        console.log("--------用户未登录但尝试访问仪表板，拒绝访问--------");
        return false; // Redirect unauthenticated users to login page
      }

      console.log("--------允许访问非仪表板页面--------");
      return true;
    },
  },
} satisfies NextAuthConfig;