"use client";
import { useEffect, useState } from "react";
import { Table, Spin } from "antd";
import { formatCurrency } from "@/app/lib/utils";
import { useMediaQuery } from "react-responsive";

interface OrderProduct {
  product: string;
  product_price: number;
  product_count: number;
}

interface Order {
  order_id: number;
  order_name: string;
  order_count: number;
  order_price: number;
  desk_id: number;
  cre_date: string;
  products: OrderProduct[];
}

export default function OrdersTable({
  query,
  initialPage = 1,
}: {
  query: string;
  initialPage?: number;
}) {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const [shouldFetch, setShouldFetch] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage - 1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [len, setLen] = useState(0);

  useEffect(() => {
    if (!shouldFetch) return;
    const loadOrders = () => {
      if (!loading) return;
      setLoading(false);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders?filter=${query}&page=${currentPage}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`错误: ${res.status}`);
          }
          return res.json();
        })
        .then((newOrders) => {
          setOrders((prev) => {
            const updatedOrders = [...prev, ...newOrders];
            setLen(updatedOrders.length);
            return updatedOrders;
          });
          if (newOrders.length === 0) {
            setHasMore(false);
          } else {
            setHasMore(true);
            setLoading(true);
          }
        })
        .catch((error) => {
          console.error("加载订单时出错:", error);
        });
    };
    loadOrders();
  }, [currentPage, query]);

  useEffect(() => {
    setLoading(true);
    setShouldFetch(true);
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && loading && hasMore) {
        setCurrentPage((c) => c + 1);
      }
    });
    const target = document.querySelector("#load-more");
    if (target) {
      observer.observe(target);
    }
    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [len]);

  const columns = [
    {
      title: "订单编号",
      dataIndex: "order_id",
      key: "order_id",
      responsive: ["md"],
    },
    {
      title: "订单名称",
      dataIndex: "order_name",
      key: "order_name",
    },
    {
      title: "订单数量",
      dataIndex: "order_count",
      key: "order_count",
      responsive: ["lg"],
    },
    {
      title: "订单金额",
      dataIndex: "order_price",
      key: "order_price",
      render: (price: number) => formatCurrency(price),
    },
    {
      title: "桌号",
      dataIndex: "desk_id",
      key: "desk_id",
      responsive: ["sm"],
    },
    {
      title: "创建日期",
      dataIndex: "cre_date",
      key: "cre_date",
      responsive: ["lg"],
    },
  ];

  const expandedRowRender = (record: Order) => {
    const columns = [
      { title: "商品名称", dataIndex: "product", key: "product" },
      { title: "商品数量", dataIndex: "product_count", key: "product_count" },
      {
        title: "商品单价",
        dataIndex: "product_price",
        key: "product_price",
        render: (price: number) => formatCurrency(price),
      },
      {
        title: "小计",
        key: "subtotal",
        render: (_: number, record: OrderProduct) =>
          formatCurrency(record.product_count * record.product_price),
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={record.products}
        pagination={false}
        scroll={{ x: "max-content" }}
        size={isMobile ? "small" : "middle"}
      />
    );
  };

  return (
    <div>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="order_id"
        expandable={{ expandedRowRender }}
        pagination={false}
        scroll={{ x: "max-content" }}
        size={isMobile ? "small" : "middle"}
      />
      {loading && <Spin className="mt-4" />}
      {hasMore && <div id="load-more" style={{ height: "20px" }} />}
    </div>
  );
}
