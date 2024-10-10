import { Suspense } from 'react';
import { getDailyConsumption, getTodaySales, getMonthSales, getUpcomingDebts, getOverdueDebts } from '@/app/lib/data';
import BarChart from '@/app/ui/dashboard/barChart';
import Statistic from '@/app/ui/dashboard/Statistic';
import DebtList from '@/app/ui/dashboard/DebtList';
import Loading from '@/app/ui/Loading'; // 假设你有一个 Loading 组件

interface SalesData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

interface Debt {
  name: string;
  phone: string;
  amount: number;
  date: string;
  receive: number;
}

async function SalesStatistics() {
  const todaySales = await getTodaySales();
  const monthSales = await getMonthSales();
  const chartData = await getDailyConsumption(new Date());
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const lastMonthData = await getDailyConsumption(lastMonthDate);
  // const lastMonthData = await getDailyConsumption(new Date(new Date().setMonth(new Date().getMonth() - 1)));

  const yesterdaySales = chartData[chartData.length - 2]?.daily_total || 0;
  const todayGrowthRate = yesterdaySales ? ((todaySales - yesterdaySales) / yesterdaySales) * 100 : 1;

  const lastMonthTotal = lastMonthData.reduce((sum: number, item: { daily_total: number }) => sum + item.daily_total, 0);
  const monthGrowthRate = lastMonthTotal ? ((monthSales - lastMonthTotal) / lastMonthTotal) * 100 : 1;

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Statistic
        title="今日销售额"
        value={todaySales}
        precision={2}
        prefix={todayGrowthRate > 0 ? 'up' : 'down'}
        valueStyle={{ color: todayGrowthRate > 0 ? '#cf1322' : '#3f8600' }}
      />
      <Statistic
        title="当月总销售额"
        value={monthSales}
        precision={2}
        prefix={monthGrowthRate > 0 ? 'up' : 'down'}
        valueStyle={{ color: monthGrowthRate > 0 ? '#cf1322' : '#3f8600' }}
      />
    </div>
  );
}

async function SalesChart() {
  const chartData = await getDailyConsumption(new Date());
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const lastMonthData = await getDailyConsumption(lastMonthDate);
  // const lastMonthData = await getDailyConsumption(new Date(new Date().setMonth(new Date().getMonth() - 1)));

  const data: SalesData = {
    labels: Array.from({length: chartData.length}, (_, i) => `${i + 1}日`),
    datasets: [{
      label: '每日消费',
      data: chartData.map((item: { daily_total: number }) => item.daily_total),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }]
  };

  const lastdata: SalesData = {
    labels: Array.from({length: lastMonthData.length}, (_, i) => `${i + 1}日`),
    datasets: [{
      label: '上月消费',
      data: lastMonthData.map((item: { daily_total: number }) => item.daily_total),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }]
  };

  return (
    <BarChart 
      data={data} 
      lastMonthData={lastdata} 
      title="本月与上月销售比较"
    />
  );
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

export default function DashboardPage() {
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