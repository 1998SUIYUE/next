import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import { executeQuery } from "./app/lib/db";
import type { User } from "@/app/lib/definitions";
import bcrypt from "bcrypt";
const NEXTAUTH_SECRET = "g8iUCgkLGstdGkxeJ+0cmY5HglYqAHJi9bHDPX8lSTw="
async function getUser(email: string): Promise<User | undefined> {
  try {
    const result = await executeQuery(`SELECT * FROM users WHERE email=?`, [
      email,
    ]);
    if (Array.isArray(result) && result.length > 0) {
      const user: User = result[0] as User;
      return user;
    }
    console.log("未找到用户，邮箱:", email);
    return undefined;
  } catch (error) {
    console.error("获取用户失败:", error);
    if (error instanceof Error) {
      console.error("错误信息:", error.message);
      console.error("错误堆栈:", error.stack);
    }
    throw new Error("获取用户失败");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: NEXTAUTH_SECRET,
  providers: [
    
    Credentials({
      async authorize(credentials) {
        try {
          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials);

          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data;
            const user = await getUser(email);

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
  callbacks: {
    async jwt({ token, user }) {
      console.log("生成 JWT");
      console.log("Token:", JSON.stringify(token, null, 2));
      console.log("User:", user ? JSON.stringify(user, null, 2) : "无用户信息");
      return token;
    },
    async session({ session, token }) {
      console.log("创建会话");
      console.log("Session:", JSON.stringify(session, null, 2));
      console.log("Token:", JSON.stringify(token, null, 2));
      return session;
    },
  },
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
