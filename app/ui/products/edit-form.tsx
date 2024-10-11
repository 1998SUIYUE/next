"use client";

import { ProductTable } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import {
  CurrencyDollarIcon,
  DocumentTextIcon,
  TagIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { useFormState } from "react-dom";
import { updateProduct } from "@/app/lib/actions";


export default function EditProductForm({ product }: { product: ProductTable }) {
  const initialState = { message: null, errors: {} };
  const updateProductWithId =updateProduct.bind(null, product.id) 
  // @ts-expect-error - useActionState 类型定义不完整
  const [state, dispatch] = useFormState(updateProductWithId, initialState);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`${process.env.NEXTAUTH_URL_INTERNAL}/api/products/categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data.data);
        } else {
          console.error('获取类别失败');
        }
      } catch (error) {
        console.error('获取类别时出错:', error);
      }
    }
    fetchCategories();
  }, []);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* 产品名称 */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            产品名称
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                defaultValue={product.name}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                aria-describedby="name-error"
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {state.errors?.name && (
            <div id="name-error" aria-live="polite" aria-atomic="true">
              <p className="mt-2 text-sm text-red-500">{state.errors.name}</p>
            </div>
          )}
        </div>

        {/* 产品价格 */}
        <div className="mb-4">
          <label htmlFor="price" className="mb-2 block text-sm font-medium">
            产品价格
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={product.price}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                aria-describedby="price-error"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {state.errors?.price && (
            <div id="price-error" aria-live="polite" aria-atomic="true">
              <p className="mt-2 text-sm text-red-500">{state.errors.price}</p>
            </div>
          )}
        </div>

        {/* 产品类别 */}
        <div className="mb-4">
          <label htmlFor="category" className="mb-2 block text-sm font-medium">
            产品类别
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <select
                id="category"
                name="category"
                defaultValue={product.category}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                aria-describedby="category-error"
              >
                <option value={product.category}>{product.category}</option>
                {categories
                  .filter((category: { category: string }) => category.category !== product.category)
                  .map((category: { category: string }) => (
                    <option key={category.category} value={category.category}>
                      {category.category}
                    </option>
                  ))}
              </select>
              <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {state.errors?.category && (
            <div id="category-error" aria-live="polite" aria-atomic="true">
              <p className="mt-2 text-sm text-red-500">{state.errors.category}</p>
            </div>
          )}
        </div>

        {/* 产品库存 */}
        <div className="mb-4">
          <label htmlFor="stock" className="mb-2 block text-sm font-medium">
            库存数量
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="store"
                name="store"
                type="number"
                defaultValue={product.store}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                aria-describedby="stock-error"
              />
              <ArchiveBoxIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {state.errors?.store && (
            <div id="stock-error" aria-live="polite" aria-atomic="true">
              <p className="mt-2 text-sm text-red-500">{state.errors.store}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/products"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          取消
        </Link>
        <Button type="submit">更新产品</Button>
      </div>
    </form>
  );
}