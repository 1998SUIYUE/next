import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "47.109.95.152",
  user: "remote_user",
  password: "MyStr0ng!P@ssw0rd2023",
  database: "data_store",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function executeQuery(query: string, values: any[] = []) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(query, values);  // 使用参数化查询
    return rows;
  } catch (error) {
    console.error("执行查询失败:", error);
    console.error("查询语句:", query);
    console.error("查询参数:", values);
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
