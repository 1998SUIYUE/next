import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";

import type { User } from "@/app/lib/definitions";
import bcrypt from "bcrypt";
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("NODE_secret:", process.env.NEXT_PUBLIC__SECRET);
// async function getUser(email: string): Promise<User | undefined> {
//   try {
//     const result = await executeQuery(`SELECT * FROM users WHERE email=?`, [
//       email,
//     ]);
//     console.log("user---------------",result)
//     if (Array.isArray(result) && result.length > 0) {
//       const user: User = result[0] as User;
//       return user;
//     }
//     console.log("未找到用户，邮箱:", email);
//     return undefined;
//   } catch (error) {
//     console.error("获取用户失败:", error);
//     if (error instanceof Error) {
//       console.error("错误信息:", error.message);
//       console.error("错误堆栈:", error.stack);
//     }
//     throw new Error("获取用户失败");
//   }
// }

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true, // 添加这一行
  debug: true,
  useSecureCookies: false, // 如果不使用 HTTPS，设置为 false
  // secret:process.env.NEXTAUTH_SECRET,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials);
          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data;
            const res = await fetch("http://localhost:3000/api/users");
            const cv = await res.json();
            const user = cv.data[0] as User;
            console.log("authorize user-info", user);
            if (!user) {
              console.log("用户未找到，邮箱:", email);
              return null;
            }
            const passwordsMatch = await bcrypt.compare(
              password,
              user.password
            );
            if (passwordsMatch) {
              console.log("用户认证成功:", user.email);
              return user;
            } else {
              console.log("密码不匹配，用户:", email);
              return null;
            }
          }
          console.log("无效的凭据格式");
          return null;
        } catch (error) {
          console.error("认证过程中发生错误:", error);
          return null;
        }
      },
    }),
  ],
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log("登录事件触发");
      console.log("User:", JSON.stringify(user, null, 2));
      console.log("Account:", JSON.stringify(account, null, 2));
      console.log("Profile:", JSON.stringify(profile, null, 2));
      console.log("Is New User:", isNewUser);
    },
    // 移除 signOut 事件处理器
  },
});
