import { NextResponse } from "next/server";
import { executeQuery } from "@/app/lib/db";

// 处理 GET 请求
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "";
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 20);
    const offset = (page - 1) * limit;

    const rows = await executeQuery(
      `SELECT * FROM products 
      WHERE name LIKE ? OR category LIKE ? OR price LIKE ? 
      ORDER BY id DESC 
      LIMIT ? OFFSET ?`,
      [`%${filter}%`, `%${filter}%`, `%${filter}%`, limit, offset]
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
    const { name, category, price, store } = body;
    const query = `INSERT INTO products (name, category, price, store) VALUES (?, ?, ?, ?)`;
    const values = [name, category, price, store];
    await executeQuery(query, values);
    return NextResponse.json({ message: "产品添加成功" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "服务器内部错误" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, category, price, status, store } = body;
    const query = `UPDATE products SET name = ?, category = ?, price = ?, status = ?, store = ? WHERE id = ?`;
    const values = [name, category, price, status, store, id];
    await executeQuery(query, values);
    return NextResponse.json({ message: "产品更新成功" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "服务器内部错误" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const query = `DELETE FROM products WHERE id = ?`;
    await executeQuery(query, [id]);
    return NextResponse.json({ message: "产品删除成功" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "服务器内部错误" }, { status: 500 });
  }
}
