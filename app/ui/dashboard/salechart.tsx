import { getDailyConsumption } from "@/app/lib/data";
import BarChart from '@/app/ui/dashboard/barChart';
interface SalesData {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  }

export default async function SalesChart() {
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