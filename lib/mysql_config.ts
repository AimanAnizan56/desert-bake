import mysql, { ConnectionOptions } from 'mysql2/promise';

const config = process.env.DATABASE_URL;

const checkRows = (rows: any) => {
  return !rows ? [] : rows;
};

export const makeQuery = async (sql: string, params: any[] = []) => {
  const conn = await mysql.createConnection(config as string);
  conn.connect();

  const [results, __] = await (!params ? conn.execute(sql) : conn.execute(sql, params));
  const data = checkRows(results);

  conn.end();
  return data;
};
