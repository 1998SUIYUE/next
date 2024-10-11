"use client";
import { UpdateProduct, DeleteProduct } from "@/app/ui/products/buttons";
import ProductStatus from "@/app/ui/products/status";
import { formatCurrency } from "@/app/lib/utils";
import { useEffect, useState } from "react";
import { ProductTable } from "@/app/lib/definitions";

export default function ProductsTable({
  query,
  initialPage = 0,
}: {
  query: string;
  initialPage?: number;
}) {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [products, setProducts] = useState<ProductTable[]>([]);
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
      query
    );
    if (!shouldFetch) return;
    const loadProducts = () => {
      console.log(
        "loadProducts 被调用，currentPage:",
        currentPage,
        "query:",
        query
      );
      if (!loading) {
        //console.log("不允许加载，跳过此次加载");
        return;
      }
      //不允许加载
      setLoading(false);
      fetch(`${process.env.NEXTAUTH_URL_INTERNAL}/api/products?filter=${query}&page=${currentPage}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`错误: ${res.status}`);
          }
          return res.json();
        })
        .then((newProducts) => {
          //console.log("获取到新产品数据：", newProducts);
          
          setProducts((prev) => {
            const updatedProducts = [...prev, ...newProducts?.data];
            setLen(updatedProducts.length);
            //console.log("更新后的产品列表长度：", updatedProducts.length);
            return updatedProducts;
          });
          if (newProducts.data.length === 0) {
            //console.log("没有更多产品，设置hasMore为false");
            setHasMore(false);
          } else {
            setHasMore(true);
            //允许加载
            setLoading(true);
          }
        })
        .catch((error) => {
          console.error("加载产品时出错:", error);
          // 这里可以添加错误处理逻辑，比如设置一个错误状态
        });
    };
    loadProducts();
  }, [currentPage, query]);

  useEffect(() => {
    //console.log("第二个useEffect触发，loading:", loading);
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
  const init = (id:string) => {
    setProducts(products.filter(product => product.id !== id));
    //console.log('删除成功');
  };
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {products?.map((product) => (
              <div
                key={product.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{product.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-xl font-medium">价格</p>
                    <p className="text-xl font-medium">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">库存</p>
                    <p className="text-xl font-medium">{product.store}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateProduct id={product.id} />
                    <DeleteProduct id={product.id} onDelete={init} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr className="flex w-full">
                <th
                  scope="col"
                  className="flex-1 px-4 py-5 font-medium sm:pl-6"
                >
                  商品名称
                </th>
                <th scope="col" className="flex-1 px-3 py-5 font-medium">
                  类别
                </th>
                <th scope="col" className="flex-1 px-3 py-5 font-medium">
                  价格
                </th>
                <th scope="col" className="flex-1 px-3 py-5 font-medium">
                  库存
                </th>
                <th scope="col" className="flex-1 px-3 py-5 font-medium">
                  状态
                </th>
                <th scope="col" className="w-24 px-3 py-5 font-medium">
                  <span className="sr-only">编辑</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {products?.map((product) => (
                <tr
                  key={product.id}
                  className="flex w-full border-b text-sm last-of-type:border-none"
                >
                  <td className="flex-1 whitespace-nowrap py-3 pl-6 pr-3 flex items-center">
                    <div className="flex items-center gap-3">
                      <p>{product.name}</p>
                    </div>
                  </td>
                  <td className="flex-1 whitespace-nowrap px-3 py-3 flex items-center">
                    {product.category}
                  </td>
                  <td className="flex-1 whitespace-nowrap px-3 py-3 flex items-center">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="flex-1 whitespace-nowrap px-3 py-3 flex items-center">
                    {product.store}
                  </td>
                  <td className="flex-1 whitespace-nowrap px-3 py-3 flex items-center">
                    <ProductStatus status={product.store > 30} />
                  </td>
                  <td className="w-24 whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateProduct id={product.id} />
                      <DeleteProduct id={product.id} onDelete={init} />
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
