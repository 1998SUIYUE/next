import React from 'react';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { formatCurrency } from '@/app/lib/utils';
interface StatisticProps {
  title: string;
  value: number | string;
  precision?: number;
  prefix?: 'up' | 'down';
  suffix?: string;
  valueStyle?: React.CSSProperties;
}

export default function Statistic({
  title,
  value,   
  precision = 2,
  prefix,
  suffix,
  valueStyle
}: StatisticProps) {
  // 将 value 转换为数字，如果转换失败则使用原始值
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  const displayValue = isNaN(numericValue) ? Number(value) : numericValue.toFixed(precision);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="flex items-center flex-wrap mt-2" style={valueStyle}>
        {prefix && (
          <span className="mr-1">
            {prefix === 'up' && <ArrowUpOutlined className="text-red-500" />}
            {prefix === 'down' && <ArrowDownOutlined className="text-green-500" />}
          </span>
        )}
        <span className="text-2xl font-bold" style={valueStyle}>
          {formatCurrency(Number(displayValue))}
        </span>
        {suffix && <span className="ml-1">{suffix}</span>}
      </div>
    </div>
  );
}