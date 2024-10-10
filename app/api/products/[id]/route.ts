import { NextResponse } from 'next/server';
import { executeQuery } from '@/app/lib/db';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const ProductSchema = z.object({
  name: z.string().min(1, "产品名称不能为空"),
  category: z.string().min(1, "类别不能为空"),
  price: z.number().positive("价格必须为正数"),
  store: z.number().int().nonnegative("库存必须为非负整数"),
});

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  store: number;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    
    const { id } = params;
    const rows = await executeQuery('SELECT * FROM products WHERE id = ?', [id]);
    const covertRows = rows as Product[];
    if (covertRows.length === 0) {
      return NextResponse.json({ message: '未找到产品' }, { status: 404 });
    }
    return NextResponse.json({ data: covertRows[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '服务器内部错误' }, { status: 500 });
  } 
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  
  try {
    
    const body = await request.json();
    const { id } = params;

    const validatedData = ProductSchema.safeParse(body);
    if(!validatedData.success){
      return NextResponse.json({ message: '输入数据无效', errors: validatedData.error.flatten().fieldErrors }, { status: 400 });
    }
    const { name, category, price, store } = validatedData.data;
    
    await executeQuery(
      `UPDATE products SET name = ?, category = ?, price = ?, store = ? WHERE id = ?`,
      [name, category, price, store, id]
    );
    return NextResponse.json({ message: true });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: '输入数据无效', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: '更新错误' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  
  try {
    
    const { id } = params;
    await executeQuery('DELETE FROM products WHERE id = ?', [id]);
    revalidatePath('/dashboard/products');
    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '删除错误' }, { status: 500 });
  } 
}
