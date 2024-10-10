import { RowDataPacket } from "mysql2";
import { executeQuery} from "./db";

export async function getDailyConsumption(date: Date = new Date()) {
  try {
    const formattedDate = date.toISOString().split("T")[0];
    const rows = await executeQuery(
      `SELECT 
    DATE(cre_date) AS order_date,
    SUM(price) AS daily_total
    FROM 
    orders
    WHERE 
    cre_date >= DATE_FORMAT(?, '%Y-%m-01')
    AND cre_date < DATE_FORMAT(? + INTERVAL 1 MONTH, '%Y-%m-01')
    GROUP BY 
    DATE(cre_date)
    ORDER BY order_date;`,
      [formattedDate, formattedDate]
    );
    return JSON.parse(JSON.stringify(rows));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTodaySales() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const rows = await executeQuery(
      `
      SELECT SUM(price) as total
      FROM orders
      WHERE DATE(cre_date) = ?
    `,
      [today]
    );

    return (rows as RowDataPacket[])[0]?.total || 0;
  } catch (error) {
    console.error("Error getting today sales:", error);
    return 0;
  }
}

export async function getMonthSales() {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const rows = await executeQuery(
      `
      SELECT SUM(price) as total
      FROM orders
      WHERE DATE(cre_date) >= ?
    `,
      [firstDayOfMonth]
    );

    return (rows as RowDataPacket[])[0]?.total || 0;
  } catch (error) {
    console.error("Error getting month sales:", error);
    return 0;
  }
}

export async function getUpcomingDebts() {
  try {
    const today = new Date();
    const oneWeekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const rows = await executeQuery(`
      SELECT name, phone, amount, date ,receive
      FROM debt
      WHERE date BETWEEN ? AND ?
      ORDER BY date ASC
    `, [today.toISOString().split('T')[0], oneWeekLater.toISOString().split('T')[0]]);

    return JSON.parse(JSON.stringify(rows));
  } catch (error) {
    console.error('Error getting upcoming debts:', error);
    return [];
  }
}

export async function getOverdueDebts() {
  try {
    const today = new Date();
    const rows = await executeQuery(`
      SELECT name, phone, amount, date ,receive
      FROM debt
      WHERE date < ?
    `, [today.toISOString().split('T')[0]]);      
    return JSON.parse(JSON.stringify(rows));
  } catch (error) {
    console.error('Error getting overdue debts:', error);
    return [];
  }
}

export async function getProductCategories() {
  try {
    const response = await fetch("http://47.109.95.152:3000/api/products/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { data: productCategories } = await response.json();
    return productCategories;
  } catch (error) {
    console.error('Error getting product categories:', error);
    return [];
  }
}
export async function getInitialOrderCount() {  
  try {
    const response = await fetch("http://47.109.95.152:3000/api/order-counter", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { count: initialOrderCount } = await response.json();
    return initialOrderCount;
  } catch (error) {
    console.error('Error getting initial order count:', error);
    return 0;
  }
}
