import { getInitialOrderCount } from "@/app/lib/data";
import CreateForm from "@/app/ui/cusum/create_form";
import Breadcrumbs from "@/app/ui/debts/breadcrumbs";

export default async function Page() {
  //   const productCategories = [
  //     {
  //       value: "食品",
  //       children: [
  //         { value: "苹果", label: "苹果", price: 5 },
  //         { value: "香蕉", label: "香蕉", price: 3 },
  //         { value: "牛奶", label: "牛奶", price: 8 },
  //         { value: "面包", label: "面包", price: 10 },
  //         { value: "苹果", label: "苹果", price: 5 },
  //         { value: "香蕉", label: "香蕉", price: 3 },
  //         { value: "牛奶", label: "牛奶", price: 8 },
  //         { value: "面包", label: "面包", price: 10 },
  //       ],
  //     },
  //     {
  //       value: "电子",
  //       children: [
  //         { value: "手机", label: "手机", price: 2000 },
  //         { value: "电脑", label: "电脑", price: 5000 },
  //         { value: "耳机", label: "耳机", price: 500 },
  //         { value: "平板", label: "平板", price: 3000 },
  //       ],
  //     },
  //     {
  //       value: "服装",
  //       children: [
  //         { value: "T恤", label: "T恤", price: 100 },
  //         { value: "牛仔裤", label: "牛仔裤", price: 200 },
  //         { value: "外套", label: "外套", price: 300 },
  //         { value: "裙子", label: "裙子", price: 250 },
  //       ],
  //     },
  //   ];

  const initialOrderCount:number = await getInitialOrderCount();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "订单", href: "/dashboard/consum" },
          {
            label: "创建订单",
            href: "/dashboard/consum/create",
            active: true,
          },
        ]}
      />

      <CreateForm initialOrderCount={initialOrderCount} />
    </main>
  );
}
