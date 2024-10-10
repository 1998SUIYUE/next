"use server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export type State = {
  errors: object;
  message: null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  const createDebtSchema = z.object({
    name: z.string({
      message: "请输入姓名。",
    }),
    amount: z.coerce.number().gt(0, { message: "请输入大于 $0 的金额。" }),
    date: z.string(),
    phone: z.string().optional(),
  });

  const validatedFields = createDebtSchema.safeParse({
    name: formData.get("name"),
    amount: formData.get("amount"),
    date: formData.get("date"),
    phone: formData.get("phone"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "缺少字段。创建债务失败。",
    };
  }

  try {
    const response = await fetch("http://localhost:3000/api/debts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    });

    if (!response.ok) {
      throw new Error("创建债务失败");
    }
  } catch (error) {
    return {
      message: "数据库错误：创建债务失败。",
      errors: { error: error instanceof Error ? error.message : String(error) },
    };
  }

  revalidatePath("/dashboard/debts");
  redirect("/dashboard/debts");
}

export async function deleteInvoice(id: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/debts/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("删除债务失败");
    }
    return { message: "Deleted Invoice." };
  } catch (error) {
    return {
      message: "Database Error: Failed to Delete Invoice.",
      errors: { error: error },
    };
  }
}

export async function updateDebt(
  id: string,
  prevState: State,
  formData: FormData
) {
  const updateDebtSchema = z.object({
    date: z.string(),
    payback: z.coerce
      .number()
      .gt(0, { message: "请输入不小于 $0 的金额。" })
      .refine(
        (val) => {
          const amount = Number(formData.get("receive"));
          return val <= amount;
        },
        { message: "还款金额不能超过待还金额。" }
      ),
  });

  const validatedFields = updateDebtSchema.safeParse({
    payback: formData.get("payback"), // 应还金额
    date: formData.get("date"), // 还款日期
  });

  if (!validatedFields.success) {
    return {
      errors: {
        payback: validatedFields.error.flatten().fieldErrors.payback || "",
        date: validatedFields.error.flatten().fieldErrors.date || "",
      },
      message: "缺少字段。更新债务失败。",
    };
  }

  try {
    const response = await fetch(`http://localhost:3000/api/debts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    });

    if (!response.ok) {
      throw new Error("更新债务失败");
    }
  } catch (error) {
    return {
      message: "数据库错误：更新债务失败。" + error,
    };
  }
  revalidatePath("/dashboard/debts");
  redirect("/dashboard/debts");
}

export async function updateProduct(
  id: string,
  prevState: State,
  formData: FormData
) {
  const updateProductSchema = z.object({
    name: z.string({
      message: "请输入产品名称。",
    }),
    category: z.string({
      message: "请输入产品类别。",
    }),
    price: z.coerce
      .number()
      .gt(0, { message: "请输入大于 $0 的金额。" })
      .lt(99999999.99, { message: "价格不能超过 $99999999.99。" }),
    store: z.coerce.number().gt(0, { message: "请输入大于 0 的库存。" }),
  });

  const validatedFields = updateProductSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    price: parseFloat(formData.get("price") as string),
    store: parseInt(formData.get("store") as string),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "缺少字段。更新产品失败。",
    };
  }

  const { name, category, price, store } = validatedFields.data;

  try {
    const response = await fetch(`http://localhost:3000/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        category: category,
        price: price,
        store: store,
      }),
    });

    if (!response.ok) {
      throw new Error("更新产品失败");
    }
  } catch (error) {
    return {
      message: "数据库错误：更新产品失败。" + error,
    };
  }
  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function deleteProduct(id: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("删除产品失败");
    }
    revalidatePath("/dashboard/products");
    return { message: "删除产品成功。" };
  } catch (error) {
    console.error("删除产品时出错：", error);
    return {
      message: "数据库错误：删除产品失败。" + error,
    };
  }
}

const createProductSchema = z.object({
  name: z.string().min(1, { message: "产品名称不能为空。" }),
  category: z.string().min(1, { message: "请选择产品类别。" }),
  price: z.coerce.number().positive({ message: "价格必须大于 0。" }),

  store: z.coerce
    .number()
    .nonnegative({ message: "库存不能为负数。" })
    .default(9999),
});

export async function createProduct(prevState: State, formData: FormData) {
  const validatedFields = createProductSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    price: formData.get("price"),
    store: formData.get("store"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "验证失败。请检查输入。",
    };
  }

  const { name, category, price, store } = validatedFields.data;

  try {
    const response = await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        category,
        price,
        store,
      }),
    });

    if (!response.ok) {
      throw new Error("创建产品失败");
    }
  } catch (error) {
    console.error("创建产品时出错:", error);
    return {
      message: "数据库错误：创建产品失败。",
      errors: { error: error instanceof Error ? error.message : String(error) },
    };
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}
export async function deleteConsum(id: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/cusum/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("删除CUSUM失败");
    }
    revalidatePath("/dashboard/cusum");
    return { message: "删除CUSUM成功。" };
  } catch (error) {
    console.error("删除CUSUM时出错：", error);
    return {
      message: "数据库错误：删除CUSUM失败。",
    };
  }
}
interface OrderData {
  name: string;
  items: {
    product: string;
    price: number;
    quantity: number;
  }[];
}
export async function createorders(orderData: OrderData) {
  try {
    // 发送订单数据到服务器
    const response = await fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      throw new Error("订单提交失败");
    }

    // 订单提交成功，增加计数
    const counterResponse = await fetch("http://localhost:3000/api/order-counter", { method: "POST" });
    
    if (!counterResponse.ok) {
      throw new Error("更新订单计数失败");
    }

    // 重新验证路径
    revalidatePath("/dashboard/consum");

    // 重定向到新页面
    redirect("/dashboard/consum");
  } catch (error) {
    // 这里只处理非重定向错误
    if (!(error instanceof Error && error.message.includes("NEXT_REDIRECT"))) {
      console.error("创建订单时出错:", error);
      // 这里可以添加错误处理逻辑，比如显示错误消息给用户
    }
    throw error; // 重新抛出错误，让 Next.js 处理重定向
  }
}