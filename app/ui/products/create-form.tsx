"use client";
import { useActionState } from "react";
import { createProduct } from "@/app/lib/actions";
import Link from "next/link";
import {
  CurrencyDollarIcon,
  DocumentTextIcon,
  TagIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { ChangeEvent } from "react";

export default function Form() {
  const initialState = { message: null, errors: {} };
  // @ts-expect-error - useActionState 类型定义不完整
  const [state, formAction] = useActionState(createProduct, initialState);

  const handleNumberInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    if (name === "price") {
      e.target.value = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    } else if (name === "store") {
      e.target.value = value.replace(/[^0-9]/g, "");
    }
  };

  return (
    <form action={formAction}>
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
                placeholder="输入产品名称"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                aria-describedby="name-error"
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {'name' in state.errors && state.errors.name?.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* 产品价格 */}
        <div className="mb-4">
          <label htmlFor="price" className="mb-2 block text-sm font-medium">
            产品价格
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                id="price"
                name="price"
                pattern="[0-9]*\.?[0-9]*"
                placeholder="输入价格"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                aria-describedby="price-error"
                onChange={handleNumberInput}
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="price-error" aria-live="polite" aria-atomic="true">
              {state.errors && 'price' in state.errors && state.errors.price &&
                state.errors.price.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* 产品类别 */}
        <div className="mb-4">
          <label htmlFor="category" className="mb-2 block text-sm font-medium">
            产品类别
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="category"
                name="category"
                placeholder="输入产品类别"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                aria-describedby="category-error"
              />
              <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="category-error" aria-live="polite" aria-atomic="true">
              {'category' in state.errors && state.errors.category &&
                state.errors.category.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* 库存数量 */}
        <div className="mb-4">
          <label htmlFor="store" className="mb-2 block text-sm font-medium">
            库存数量
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                id="store"
                name="store"
                placeholder="输入库存数量"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                aria-describedby="store-error"
                onChange={handleNumberInput}
              />
              <BuildingStorefrontIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="store-error" aria-live="polite" aria-atomic="true">
              {'store' in state.errors && state.errors.store &&
                state.errors.store.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/products"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          取消
        </Link>
        <Button type="submit">创建产品</Button>
      </div>
    </form>
  );
}
