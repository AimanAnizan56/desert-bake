import mysql, { ConnectionOptions } from 'mysql2/promise';

const config: ConnectionOptions = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

const checkRows = (rows: any) => {
  return !rows ? [] : rows;
};

export const makeQuery = async (sql: string, params: any[] = []) => {
  const conn: mysql.Connection = await mysql.createConnection(config);
  conn.connect();

  const [results, __] = await (!params ? conn.execute(sql) : conn.execute(sql, params));
  const data = checkRows(results);

  conn.end();
  return data;
};
