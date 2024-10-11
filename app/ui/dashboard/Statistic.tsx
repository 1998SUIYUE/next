import React from 'react';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { formatCurrency } from '@/app/lib/utils';

interface StatisticProps {
  title: string;
  value: number | string;
  prefix?: 'up' | 'down';
  suffix?: string;
  valueStyle?: React.CSSProperties;
}

export default function Statistic({
  title,
  value,   
  prefix,
  suffix,
  valueStyle
}: StatisticProps) {
  // 將值轉換為整數
  const displayValue = Math.round(Number(value))

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="flex items-center flex-nowrap mt-2">
        {prefix && (
          <span className="flex-shrink-0 mr-1">
            {prefix === 'up' && <ArrowUpOutlined className="text-red-500" />}
            {prefix === 'down' && <ArrowDownOutlined className="text-green-500" />}
          </span>
        )}
        <span className="text-xl font-bold whitespace-nowrap overflow-hidden text-ellipsis" style={valueStyle}>
          {/* //format */}
          {formatCurrency(Number(displayValue))}
        </span>
        {suffix && <span className="flex-shrink-0 ml-1">{suffix}</span>}
      </div>
    </div>
  );
}