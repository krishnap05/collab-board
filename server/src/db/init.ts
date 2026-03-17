import pool from './index'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function initDb() {
  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8')
  await pool.query(schema)
  console.log('Database initialized')
}
