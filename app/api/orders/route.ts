import { pool,executeQuery } from "@/app/lib/db";
import { ResultSetHeader} from "mysql2/promise";
import mysql from 'mysql2/promise';

interface OrderProduct {
  product: string;
  product_price: number;
  product_count: number;
}

interface Order {
  order_id: number;
  order_name: string;
  order_count: number;
  order_price: number;
  desk_id: number;
  cre_date: string;
  products: OrderProduct[];
}

interface data{
  order_id: number;
  order_name: string;
  order_count: number;
  order_price: number;
  desk_id: number;
  cre_date: string;
  product: string;
  product_price: number;
  product_count: number;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("filter") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;
    const offset = (Number(page)-1) * Number(limit);
    const sql = `
      SELECT 
        o.id AS order_id,
        o.name AS order_name,
        o.count AS order_count,
        o.price AS order_price,
        o.desk_id,
        o.cre_date,
        op.product,
        op.price AS product_price,
        op.product_count
      FROM 
        (SELECT * FROM orders 
         WHERE name LIKE ? 
         ORDER BY id DESC 
         LIMIT ? OFFSET ?) o
      LEFT JOIN 
        order_product op ON o.id = op.order_id
      ORDER BY 
        o.id DESC, op.product
    `;
    
    const rows = await executeQuery(sql, [`%${query}%`, limit, offset]);
    const orders: Order[] = [];
    let currentOrder: Order | null = null;
    const covertRows = rows as data[];
    for (const row of covertRows) {
      if (!currentOrder || currentOrder.order_id !== row.order_id) {
        if (currentOrder) {
          orders.push(currentOrder);
        }
        currentOrder = {
          order_id: row.order_id,
          order_name: row.order_name,
          order_count: row.order_count,
          order_price: row.order_price,
          desk_id: row.desk_id,
          cre_date: new Date(row.cre_date).toLocaleDateString(),
          products: [],
        };
      }
      if (row.product) {
        currentOrder.products.push({
          product: row.product,
          product_price: row.product_price,
          product_count: row.product_count,
        });
      }
    }

    if (currentOrder) {
      orders.push(currentOrder);
    }
    return new Response(JSON.stringify(orders), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET 请求错误:", error);
    return new Response(JSON.stringify({ error: "服务器内部错误" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req: Request) {
  let conn: mysql.PoolConnection | null = null;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const body = await req.json();
    const { name, items } = body;
    console.log("收到的商品记录",items)
    const sum_price = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );
    const sum_count = items.reduce(
      (sum: number, item: { quantity: number }) => sum + item.quantity,
      0
    );

    const insertOrderSQL = `INSERT INTO orders (name, price, count, desk_id) VALUES (?, ?, ?, 1)`;
    const [result] = await conn.query<ResultSetHeader>(insertOrderSQL, [
      name,
      sum_price,
      sum_count,
    ]);
    const insertId = result.insertId;

    const insertProductSQL = `INSERT INTO order_product (order_id, product, price, product_count) VALUES (?, ?, ?, ?)`;

    for (const item of items) {
      console.log("添加订单商品记录",item)
      await conn.query(insertProductSQL, [
        insertId,
        item.product,
        item.price,
        item.quantity,
      ]);
    }
    await conn.commit();
    return new Response(
      JSON.stringify({
        name,
        items,
        sum_price,
        sum_count,
        orderId: insertId,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    if (conn) await conn.rollback();
    return new Response(
      JSON.stringify({
        error: "处理订单时发生错误",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    if (conn) 
       conn.release();
  }
}
