import { EditFormSkeleton } from '@/app/ui/skeletons';
import Form from "@/app/ui/debts/edit-form";
import Breadcrumbs from "@/app/ui/debts/breadcrumbs";
import { notFound } from "next/navigation";
import { Suspense } from "react";
export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const res = await fetch(`http://47.109.95.152:3000/api/debts/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    return notFound();
  }

  //   const { test } = await res.json();
  //   //console.log(test);
  const debt = await res.json();
  const { data } = debt;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Debts", href: "/dashboard/debts" },
          {
            label: "Edit Debt",
            href: `/dashboard/debts/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Suspense fallback={<EditFormSkeleton />}>
        <Form debt={data} />
      </Suspense>
    </main>
  );
}
