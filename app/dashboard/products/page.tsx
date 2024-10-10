import Search from "@/app/ui/search";
import Table from "@/app/ui/products/table";
import { CreateProduct } from "@/app/ui/products/buttons";
import { lusitana } from "@/app/ui/fonts";
import { ProductsTableSkeleton } from "@/app/ui/skeletons";  // 更改为ProductsTableSkeleton
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>商品管理</h1> 
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder={"搜索商品..."} />  
        <CreateProduct /> 
      </div>
      <Suspense key={query + currentPage} fallback={<ProductsTableSkeleton />}>
        <Table query={query} initialPage={currentPage} />
      </Suspense>
    </div>
  );
}