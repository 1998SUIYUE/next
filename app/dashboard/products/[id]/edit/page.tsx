import { EditProductFormSkeleton } from '@/app/ui/skeletons';
import Form from "@/app/ui/products/edit-form";
import Breadcrumbs from "@/app/ui/debts/breadcrumbs";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const res = await fetch(`http://47.109.95.152:3000/api/products/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return notFound();
  }

  const product = await res.json();
  const { data } = product;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "商品管理", href: "/dashboard/products" },
          {
            label: "编辑商品",
            href: `/dashboard/products/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Suspense fallback={<EditProductFormSkeleton />}>
        <Form product={data} />
      </Suspense>
    </main>
  );
}
