"use client";

import { useTransition } from 'react';
import { deleteProduct } from "@/app/lib/actions";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export function CreateProduct() {
  return (
    <Link
      href="/dashboard/products/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">创建商品</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateProduct({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/products/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteProduct({
  id,
  onDelete
}: {
  id: string;
  onDelete?: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      await deleteProduct(id);
      if (onDelete) {
        onDelete(id);
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      className="rounded-md border p-2 hover:bg-gray-100"
      disabled={isPending}
    >
      <span className="sr-only">删除</span>
      <TrashIcon className="w-4" />
    </button>
  );
}
