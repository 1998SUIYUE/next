import Search from "@/app/ui/search";
import Table from "@/app/ui/debts/table";
import { CreateInvoice } from "@/app/ui/debts/buttons";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense} from "react";
import AdvancedSearch from "@/app/ui/debts/advance-search"; // 新增

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    minAmount?: string;
    maxAmount?: string;
    startDate?: string;
    endDate?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const minAmount = searchParams?.minAmount;
  const maxAmount = searchParams?.maxAmount;
  const startDate = searchParams?.startDate;
  const endDate = searchParams?.endDate;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>借款管理</h1>
      </div>
      <div className="mt-4 flex flex-col gap-4 md:mt-8">
        <div className="flex items-center justify-between gap-2">
          <Search placeholder={"搜索借款..."} />
          <CreateInvoice />
        </div>
        <AdvancedSearch
          minAmount={minAmount}
          maxAmount={maxAmount}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
      <Suspense key={query + currentPage + minAmount + maxAmount + startDate + endDate} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} initialPage={currentPage} minAmount={minAmount} maxAmount={maxAmount} startDate={startDate} endDate={endDate} />
         {/* <Table query={query} initialPage={currentPage}/> */}
      </Suspense>
    </div>
  );
}
