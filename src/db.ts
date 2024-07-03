// db.js
import postgres from 'postgres';

const sql = postgres({
  user: process.env.POSTGRES_USER || 'user',
  password: process.env.POSTGRES_PASSWORD || 'password',
  db: process.env.POSTGRES_DB || 'tokendb',
});

export default sql;
