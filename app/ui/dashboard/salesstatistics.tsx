import { getDailyConsumption, getMonthSales, getTodaySales } from "@/app/lib/data";
import Statistic from '@/app/ui/dashboard/Statistic';



export default async function SalesStatistics() {
  
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
          
          prefix={todayGrowthRate > 0 ? 'up' : 'down'}
          valueStyle={{ color: todayGrowthRate > 0 ? '#cf1322' : '#3f8600' }}
        />
        <Statistic
          title="当月总销售额"
          value={monthSales}
          
          prefix={monthGrowthRate > 0 ? 'up' : 'down'}
          valueStyle={{ color: monthGrowthRate > 0 ? '#cf1322' : '#3f8600' }}
        />
      </div>
    );
  }