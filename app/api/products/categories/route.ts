import { NextResponse } from "next/server";
import { executeQuery } from "@/app/lib/db";




type Product = {
  name: string;
  price: number;
};

type Category = {
  category: string;
};

export async function GET() {
 
  try {
    
    const covertRows = await executeQuery(
      "SELECT DISTINCT category FROM products"
    ,[]);
    const categories = covertRows as Category[];
    if (!categories || categories.length === 0) {
      throw new Error("未找到类别数据");
    }

    const formattedData = await Promise.all(
      (categories as Category[]).map(async (cat: Category) => {
        const covertRows2 = await executeQuery(
          "SELECT name, price FROM products WHERE category = ?",
          [cat.category]
        );
        const products = covertRows2 as Product[];
        return {
          value: cat.category,
          children: (products as Product[]).map((prod: Product) => ({
            value: prod.name,
            label: prod.name,
            price: prod.price,
          })),
        };
      })
    );

    return NextResponse.json({ data: formattedData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "服务器内部错误" }, { status: 500 });
  }
}
