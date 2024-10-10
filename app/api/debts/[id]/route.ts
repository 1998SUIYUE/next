// app/api/debt/[id]/route.ts

import { NextResponse } from "next/server";
import { executeQuery } from "@/app/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  type Debt = {
    id: number;
    name: string;
    phone: string;
    amount: number;
    receive: number;
    date: string;
  };
  try {
    const { id } = params;
    const rows = await executeQuery("SELECT * FROM debt WHERE id = ?", [id]);
    const covertRows = rows as Debt[];
    if (covertRows.length === 0) {
      return NextResponse.json({ message: "未找到债务记录" }, { status: 404 });
    }
    return NextResponse.json({ data: covertRows[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "服务器内部错误" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;
    await executeQuery(
      "UPDATE debt SET receive = receive + ?, date = ? WHERE id = ?",
      [body.payback || 0, body.date, id]
    );
    return NextResponse.json({ message: "债务更新成功" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "更新错误" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await executeQuery("DELETE FROM debt WHERE id = ?", [id]);
    return NextResponse.json({ message: "债务删除成功" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "服务器内部错误" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await executeQuery(
      "INSERT INTO debt (name, amount, date, phone) VALUES (?, ?, ?, ?)",
      [body.name, body.amount, body.date, body.phone]
    );
    return NextResponse.json({ message: "债务创建成功" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "服务器内部错误" }, { status: 500 });
  }
}
