import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  connectionLimit: 100,
  queueLimit: 0,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function executeQuery(query: string, values: any[] = []) {
  let connection;
  try {
    console.error("查询语句:", query);
    console.error("查询参数:", values);
    const formattedQuery = query.replace(/\?/g, () => {
      const value = values.shift();
      if (typeof value === "string") {
        return `'${value.replace(/'/g, "''")}'`; // 转义单引号
      } else if (value instanceof Date) {
        return `'${value.toISOString().slice(0, 19).replace("T", " ")}'`;
      } else if (value === null) {
        return "NULL";
      } else {
        return value;
      }
    });
    console.log("格式化后的查询语句:", formattedQuery);
    connection = await pool.getConnection();
    const [rows] = await connection.execute(formattedQuery); // 使用参数化查询
    return rows;
  } catch (error) {
    console.error("执行查询失败:", error);
    
    throw error;
  } finally {
    if (connection) {
      try {
        connection.release();
      } catch (releaseError) {
        console.error("释放连接时出错:", releaseError);
      }
    }
  }
}
