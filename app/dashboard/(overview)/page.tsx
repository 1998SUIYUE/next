
import { Suspense } from 'react';
import { getUpcomingDebts, getOverdueDebts } from '@/app/lib/data';

import SalesChart from '@/app/ui/dashboard/salechart'
import SalesStatistics from '@/app/ui/dashboard/salesstatistics';
import DebtList from '@/app/ui/dashboard/DebtList';
import Loading from '@/app/ui/Loading'; // 假设你有一个 Loading 组件
export const revalidate = 0; // 禁用頁面緩存


interface Debt {
  name: string;
  phone: string;
  amount: number;
  date: string;
  receive: number;
}

async function DebtLists() {
  const upcomingDebts: Debt[] = await getUpcomingDebts();
  const overdueDebts: Debt[] = await getOverdueDebts();

  return (
    <>
      <DebtList debts={upcomingDebts} title="一周内到期的债务" />
      <DebtList debts={overdueDebts} title="已逾期的债务" />
    </>
  );
}

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">销售统计</h1>
      <Suspense fallback={<Loading />}>
        <SalesStatistics />
      </Suspense>

      <h1 className="text-2xl font-bold">销售趋势图</h1>
      <Suspense fallback={<Loading />}>
        <SalesChart />
      </Suspense>

      <Suspense fallback={<Loading />}>
        <DebtLists />
      </Suspense>
    </div>
  );
}