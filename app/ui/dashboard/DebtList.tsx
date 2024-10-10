"use client";

import { List } from "antd";

interface Debt {
  name: string;
  phone: string;
  amount: number;
  date: string;
  receive: number;
}

interface DebtListProps {
  debts: Debt[];
  title: string;  // 添加 title 属性
}

export default function DebtList({ debts, title }: DebtListProps) {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <List
        size="small"
        bordered
        dataSource={debts}
        renderItem={(item: Debt) => (
          <List.Item>
            <div className="flex justify-between w-full">
              <span>{item.name} ({item.phone})</span>
              <span>
                待收: ￥{Number(item.amount - item.receive).toFixed(2)}
              </span>
              <span>
                总额: ￥{Number(item.amount).toFixed(2)} - 到期日: {item.date.split('T')[0]}
              </span>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}
