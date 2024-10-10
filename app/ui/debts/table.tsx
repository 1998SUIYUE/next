"use client";
import { UpdateInvoice, DeleteInvoice } from "@/app/ui/debts/buttons";
import DebtStatus from "@/app/ui/debts/status";
import { formatDateToLocal, formatCurrency } from "@/app/lib/utils";
import { useEffect, useState } from "react";
import { DebtTable } from "@/app/lib/definitions";

export default function InvoicesTable({
  query,
  initialPage = 0,
  minAmount = "0",
  maxAmount = "99999999",
  startDate = "2000-01-01",
  endDate = "2099-12-31",
}: {
  query: string;
  initialPage?: number;
  minAmount?: string;
  maxAmount?: string;
  startDate?: string;
  endDate?: string;
}) {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [debt, setDebt] = useState<DebtTable[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage - 1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [len, setLen] = useState(0);

  useEffect(() => {
    console.log(
      "第一个useEffect触发，shouldFetch:",
      shouldFetch,
      "currentPage:",
      currentPage,
      "query:",
      query,
      "minAmount:",
      minAmount,
      "maxAmount:",
      maxAmount,
      "startDate:",
      startDate,
      "endDate:",
      endDate
    );
    if (!shouldFetch) return;
    const loadDebt = () => {
      console.log(
        "loadDebt 被调用，currentPage:",
        currentPage,
        "query:",
        query,
        "minAmount:",
        minAmount,
        "maxAmount:",
        maxAmount,
        "startDate:",
        startDate,
        "endDate:",
        endDate
      );
      if (!loading) {
        //console.log("不允许加载，跳过此次加载");
        return;
      }
      setLoading(false);
      fetch(
        `http://47.109.95.152:3000/api/debts?filter=${query}&page=${currentPage}&minAmount=${minAmount}&maxAmount=${maxAmount}&startDate=${startDate}&endDate=${endDate}`
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error(`错误: ${res.status}`);
          }
          return res.json();
        })
        .then((newDebt) => {
          //console.log("获取到新债务数据：", newDebt);

          setDebt((prev) => {
            const updatedDebt = [...prev, ...newDebt?.data];
            setLen(updatedDebt.length);
            //console.log("更新后的债务列表长度：", updatedDebt.length);
            return updatedDebt;
          });
          if (newDebt.data.length === 0) {
            //console.log("没有更多债务，设置hasMore为false");
            setHasMore(false);
          } else {
            setHasMore(true);
            setLoading(true);
          }
        })
        .catch((error) => {
          console.error("加载债务时出错:", error);
        });
    };
    loadDebt();
  }, [currentPage, query]);

  useEffect(() => {
    console.log("第二个useEffect触发，loading:", loading);
    setLoading(true);
    setShouldFetch(true);
    const observer = new IntersectionObserver((entries) => {
      console.log(
        "Intersection Observer触发，isIntersecting:",
        entries[0].isIntersecting,
        "loading:",
        loading,
        "hasMore:",
        hasMore
      );
      if (entries[0].isIntersecting && loading && hasMore) {
        //console.log("触发加载更多，增加currentPage");
        setCurrentPage((c) => c + 1);
      }
    });
    const target = document.querySelector("#load-more");
    if (target) {
      //console.log("开始观察#load-more元素");
      observer.observe(target);
    }
    return () => {
      if (target) {
        //console.log("清理观察器");
        observer.unobserve(target);
      }
    };
  }, [len]);

  const init = (id: string) => {
    setDebt(debt.filter((item) => item.id !== id));
    //console.log("删除成功");
  };

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {debt?.map((debt) => (
              <div
                key={debt.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{debt.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{debt.phone}</p>
                  </div>
                  <div>
                    <p className="text-xl font-medium">借款金额</p>
                    <p className="text-xl font-medium">
                      {formatCurrency(debt.amount - 0)}
                    </p>
                    <p className="text-xl font-medium">还款日期</p>
                    <p>
                      {formatDateToLocal(new Date(debt.date).toISOString())}
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">待还金额</p>
                    <p className="text-xl font-medium">
                      {formatCurrency(debt.amount - debt.receive)}
                    </p>
                  </div>
                  <div className="mt-2">
                      <DebtStatus status={Number((debt.receive / debt.amount * 100).toFixed(1))} />
                    </div>
                  <div className="flex justify-end gap-2">
                    <UpdateInvoice id={debt.id} />
                    <DeleteInvoice id={debt.id} onDelete={init} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  姓名
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  电话
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  借款金额
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  还款日期
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  待还金额
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  还款情况
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {debt?.map((debt) => (
                <tr
                  key={debt.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{debt.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{debt.phone}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(debt.amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(new Date(debt.date).toISOString())}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(debt.amount - debt.receive)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <DebtStatus status={Number((debt.receive / debt.amount * 100).toFixed(1))} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateInvoice id={debt.id} />
                      <DeleteInvoice id={debt.id} onDelete={init} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <p className="text-center">加载中...</p>}
          {hasMore && <div id="load-more" style={{ height: "20px" }} />}
        </div>
      </div>
    </div>
  );
}
