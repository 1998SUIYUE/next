import mysql from "mysql2/promise";
// console.log('Database configuration:');
// console.log('Host:', process.env.DB_HOST || '127.0.0.1');
// console.log('User:', process.env.DB_USER || 'root');
// console.log('Database:', process.env.DB_NAME || 'data_store');


// let isMonitoringActive = false;



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

// function startConnectionMonitoring() {
//   if (isMonitoringActive) return;

//   isMonitoringActive = true;
//   const monitorInterval = setInterval(async () => {
//     if (!pool) return;

//     try {
//       const [rows] = await pool.query<mysql.RowDataPacket[]>(
//         'SHOW STATUS WHERE `variable_name` = "Threads_connected"'
//       );
//       console.log("当前连接数:", rows[0]?.Value);
//     } catch (error) {
//       console.error("监控连接数时出错:", error);
//     }
//   }, 60000);

//   return () => {
//     clearInterval(monitorInterval);
//     isMonitoringActive = false;
//   };
// }


export const getConnection = async () => {
  return pool.getConnection();
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function executeQuery(query: string, values: any[] = []) {
  let connection;
  try {
    connection = await pool!.getConnection();
    // 使用正则表达式和 reduce 方法来安全地替换参数
    const formattedQuery = query.replace(/'%\?%'|'?\?'?/g, () => {
      const value = values.shift();
      if (value === undefined) {
        return "''"; // 如果没有值，返回空字符串
      }
      if (value === null) {
        return "NULL";
      }
      if (typeof value === "string") {
        // 检查是否被 '%' 包围
        if (query.includes(`'%?%'`)) {
          return `'%${value.replace(/'/g, "''").replace(/%/g, "\\%")}%'`;
        } else {
          return `'${value.replace(/'/g, "''")}'`;
        }
      }
      return value;
    });
    const [rows] = await connection.execute(formattedQuery);
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


