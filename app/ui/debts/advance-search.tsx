"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { DatePicker, ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

export default function AdvancedSearch({
  minAmount,
  maxAmount,
  startDate,
  endDate,
}: {
  minAmount?: string;
  maxAmount?: string;
  startDate?: string;
  endDate?: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      Object.entries(updates).forEach(([name, value]) => {
        if (value) {
          params.set(name, value);
        } else {
          params.delete(name);
        }
      });
      replace(`${pathname}?${params.toString()}`);
    },
    500
  );

  const handleDateRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null
  ) => {
    const updates: Record<string, string> = {
      startDate: "",
      endDate: "",
    };

    if (dates && dates[0]) {
      updates.startDate = dates[0].format("YYYY-MM-DD");
    }
    if (dates && dates[1]) {
      updates.endDate = dates[1].format("YYYY-MM-DD");
    }
    handleSearch(updates);
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div className="w-full flex flex-col sm:flex-row flex-wrap gap-2">
        <div className="basis-1/2 flex flex-row">
          <input
            type="number"
            name="minAmount"
            placeholder="最小金额"
            defaultValue={minAmount}
            onChange={(e) => handleSearch({ minAmount: e.target.value })}
            className="rounded-md border p-1 w-full text-sm  sm:w-[calc(50%-0.25rem)] lg:w-1/4"
          />
          <input
            type="number"
            name="maxAmount"
            placeholder="最大金额"
            defaultValue={maxAmount}
            onChange={(e) => handleSearch({ maxAmount: e.target.value })}
            className="rounded-md border p-1 w-full text-sm  sm:w-[calc(50%-0.25rem)] lg:w-1/4"
          />
        </div>
        <div className="w-full sm:w-1/2">
          <RangePicker
            onChange={handleDateRangeChange}
            value={[
              startDate ? dayjs(startDate) : null,
              endDate ? dayjs(endDate) : null,
            ]}
            className="w-full"
            inputReadOnly={true}
            popupStyle={{ fontSize: "14px" }}
            style={{ width: "100%" }}
            allowClear={true}
            separator="-"
            placement='bottomRight'
            popupClassName="max-w-[90vw] sm:max-w-none [&_.ant-picker-panels]:flex-col sm:[&_.ant-picker-panels]:flex-row [&_.ant-picker-panel-container]:overflow-auto [&_.ant-picker-panel-container]:max-h-[80vh] sm:[&_.ant-picker-panel-container]:max-h-none [&_.ant-picker-footer]:sticky [&_.ant-picker-footer]:bottom-0 [&_.ant-picker-footer]:bg-white sm:[&_.ant-picker-footer]:static"
          />
        </div>
      </div>
    </ConfigProvider>
  );
}
