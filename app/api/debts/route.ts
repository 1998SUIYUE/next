import { NextResponse } from "next/server";
import { executeQuery } from "@/app/lib/db";


// 处理 GET 请求
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "";
    const minAmount = Number(searchParams.get("minAmount") || 0);
    const maxAmount = Number(searchParams.get("maxAmount") || 999999999);
    const startDate = searchParams.get("startDate") || "1970-01-01";
    const endDate = searchParams.get("endDate") || "9999-12-31";
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 20);
    const offset = (page - 1) * limit;

    const rows = await executeQuery(
      `SELECT * FROM debt 
      WHERE (name LIKE ? OR phone LIKE ? OR amount LIKE ?) 
      AND amount >= ? AND amount <= ?
      AND date >= ? AND date <= ?
      ORDER BY date ASC 
      LIMIT ? OFFSET ?`,
      [
        `%${filter}%`,
        `%${filter}%`,
        `%${filter}%`,
        minAmount,
        maxAmount,
        startDate,
        endDate,
        limit,
        offset,
      ]
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, amount, date } = body;
    console.log("接收到的数据:", { name, phone, amount, date });
    await executeQuery(
      `INSERT INTO debt (name, phone, amount, date) VALUES (?, ?, ?, ?)`,
      [name, phone || "", amount, date]
    );
    console.log("数据已成功插入数据库");
    return NextResponse.json({ message: "债务创建成功" }, { status: 201 });
  } catch (error) {
    console.error("创建债务时发生错误:", error);
    return NextResponse.json(
      { message: "数据库错误：创建债务失败。" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, recived_amount } = body;
    await executeQuery(`UPDATE debt SET receive = ? WHERE id = ?`, [
      recived_amount,
      id,
    ]);
    return NextResponse.json({ message: "债务更新成功" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "服务器内部错误" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await executeQuery(`DELETE FROM debt WHERE id = ?`, [id]);
    return NextResponse.json({ message: "债务删除成功" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "服务器内部错误" }, { status: 500 });
  }
}
