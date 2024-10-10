"use client";
import { updateDebt } from "@/app/lib/actions";
import { DebtTable } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import {
  CalendarIcon,
  CurrencyDollarIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { useFormState } from "react-dom";

export default function EditInvoiceForm({ debt }: { debt: DebtTable }) {
  const initialState= { message: null, errors: {} };
  const updateDebtWithId = updateDebt.bind(null, debt.id);
  // @ts-expect-error - useActionState 类型定义不完整
  const [state, dispatch] = useFormState(updateDebtWithId, initialState);
  const [date, setDate] = useState(
    debt.date ? new Date(debt.date).toISOString().slice(0, 10) : ""
  );
  useEffect(() => {
    // 将日期值设置为债务的日期
    if (debt && debt.date) {
      setDate(new Date(debt.date).toISOString().slice(0, 10));
    }
  }, [debt]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };
  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            借款人
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                value={debt.name}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                aria-describedby="name-error"
                readOnly
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="phone" className="mb-2 block text-sm font-medium">
            借款人电话
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="tel"
                pattern="[0-9]*"
                inputMode="numeric"
                value={debt.phone}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="phone-error"
                onInput={(e) => {
                  // 使用类型断言确保 e.target 是 HTMLInputElement
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/[^0-9]/g, ""); // 只允许输入数字
                }}
                readOnly
              />
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            借款金额
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={debt.amount}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                aria-describedby="amount-error"
                readOnly
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            待还金额
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="receive"
                name="receive"
                type="number"
                step="0.01"
                value={debt.amount - debt.receive}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                aria-describedby="amount-error"
                readOnly
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            当日还款
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="payback"
                name="payback"
                type="number"
                step="0.01"
                placeholder="请输入当日还款金额"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                aria-describedby="payback-error"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="payback-error" aria-live="polite" aria-atomic="true">
              {state.errors?.payback &&
                (Array.isArray(state.errors.payback) ? state.errors.payback : [state.errors.payback]).map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="date" className="mb-2 block text-sm font-medium">
            还款日期
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="date"
                name="date"
                type="date"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
                aria-describedby="date-error"
                value={date}
                onChange={handleDateChange}
              />
              <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Invoice</Button>
      </div>
    </form>
  );
}
