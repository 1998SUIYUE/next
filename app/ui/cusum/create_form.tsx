'use client';

import { useState, useEffect, useCallback } from "react";
import  Cascader  from "@/app/ui/cascader";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { createorders } from "@/app/lib/actions";




interface Option {
  value: string;
  label?: string;
  children?: Option[];
  price?: number;
}



interface Option {
  value: string;
  label?: string;
  children?: Option[];
  price?: number;
}

export default function CreateForm() {
  const [items, setItems] = useState([{ product: "", price: 0, quantity: 1 }]);
  const [productCategories, setProductCategories] = useState([]);
  const [initialOrderCount, setInitialOrderCount] = useState(0);
  useEffect(() => {
    async function fetchProductCategories() {
      try {
        const response = await fetch(`${process.env.NEXTAUTH_URL_INTERNAL}/api/products/categories`);
        const { data } = await response.json();
        setProductCategories(data);
      } catch (error) {
        console.error('Error fetching product categories:', error);
      }
    }
    async function fetchOrderCount() {
      try {
        const response = await fetch(`${process.env.NEXTAUTH_URL_INTERNAL}/api/order-counter`);
        const { count } = await response.json();
        setInitialOrderCount(count); 
      } catch (error) {
        console.error('Error fetching order count:', error);
      }
    }
    fetchOrderCount();
    fetchProductCategories();
  }, []);

  const orderCount = initialOrderCount
  const generateOrderName = () => {
    const today = new Date();
    const dateString = today.toISOString().split("T")[0].replace(/-/g, "");
    return `${dateString}168${orderCount.toString().padStart(3, "0")}`;
  };
  const onFinish = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hasValidItems()) {
      alert("请至少添加一个有效的商品项");
      return;
    }
    const formattedItems = items.filter(item => item.product !== "").map((item) => ({
      product: item.product,
      price: item.price,
      quantity: item.quantity,
    }));
    const orderName = generateOrderName();
    const orderData = {
      name: orderName,
      items: formattedItems,
    };
    //console.log("提交的值:", orderData);
    createorders(orderData);
  };

  const handleProductChange = useCallback((selectedOptions: Option[], index: number) => {
    const selectedProduct = selectedOptions[selectedOptions.length - 1];
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      product: selectedProduct.children ? "" : (selectedProduct.label || selectedProduct.value),
      price: selectedProduct.children ? 0 : (selectedProduct.price || 0),
    };
    setItems(newItems);
  }, [items]);

  const handleQuantityChange = useCallback((value: string, index: number) => {
    // 移除非数字字符
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    // 允许空字符串，但如果有数字，则确保不小于1
    const quantity =
      sanitizedValue === "" ? "" : Math.max(1, parseInt(sanitizedValue) || 1);
    const newItems = [...items];
    newItems[index] = { ...newItems[index], quantity: Number(quantity) };
    setItems(newItems);
  }, [items]);

  const addItem = () => {
    setItems([...items, { product: "", price: 0, quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // 修改：检查是否有有效的商品项
  const hasValidItems = useCallback(() => {
    return items.some(item => item.product !== "" && item.price > 0 && item.quantity > 0);
  }, [items]);

  return (
    <div className="mt-6">
      {" "}
      {/* 添加顶部边距 */}
      <h2 className="text-2xl font-bold mb-6">创建订单</h2>
      <form onSubmit={onFinish}>
        {items.map((item, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-end space-x-2 mb-2">
              <div className="flex-grow min-w-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  商品
                </label>
                <Cascader
                  options={productCategories}
                  onChange={(selectedOptions) =>
                    handleProductChange(selectedOptions, index)
                  }
                  placeholder="选择商品"
                />
              </div>
              <div className="w-20 flex-shrink-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  价格
                </label>
                <input
                  name="price"
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                  value={item.price}
                  readOnly
                />
              </div>
              <div className="w-20 flex-shrink-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  数量
                </label>
                <input
                  name="count"
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(e.target.value, index)}
                  onBlur={(e) => {
                    if (e.target.value === "" || parseInt(e.target.value) < 1) {
                      handleQuantityChange("1", index);
                    }
                  }}
                  min="1"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 transition-colors duration-200 ease-in-out focus:outline-none"
              >
                <MinusCircleOutlined className="text-xl" />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out mb-4"
        >
          <PlusOutlined className="mr-2" /> 添加商品
        </button>
        <button
          type="submit"
          className={`w-full px-4 py-2 bg-blue-500 text-white rounded-md transition-colors duration-200 ease-in-out ${
            hasValidItems()
              ? "hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              : "opacity-50 cursor-not-allowed"
          }`}
          disabled={!hasValidItems()}
        >
          提交订单
        </button>
      </form>
    </div>
  );
}
