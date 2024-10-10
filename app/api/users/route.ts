import { executeQuery } from "@/app/lib/db";
import { NextResponse } from "next/server";

// 处理 GET 请求
export async function GET() {
    try {
      const rows = await executeQuery(
        `SELECT * FROM users`
      );
      if (!rows) {
        throw new Error("未找到数据");
      }
      return NextResponse.json({ data: rows });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: "服务器内部错误" }, { status: 500 });
    }
  }