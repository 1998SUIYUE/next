import { Suspense } from 'react';
import Search from "@/app/ui/search";
import Table from "@/app/ui/cusum/table";
import { CreateConsum } from "@/app/ui/cusum/buttons";
import { lusitana } from "@/app/ui/fonts";
import { ConsumTableSkeleton } from '@/app/ui/skeletons'; // 假设你有一个 TableSkeleton 组件

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
        <h1 className={`${lusitana.className} text-2xl`}>消费记录</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder={"搜索消费记录..."} />
        <CreateConsum />
      </div>
      <div className="mt-6 md:mt-8">
        <Suspense key={query + currentPage} fallback={<ConsumTableSkeleton />}>
          <Table query={query} initialPage={currentPage} />
        </Suspense>
      </div>
    </div>
  );
}