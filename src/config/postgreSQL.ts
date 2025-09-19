import { Pool } from 'pg'
import { env } from './environment'

const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
})

export const CONNECT_DB = async () => {
  await pool.connect()
    .then(() => {
      console.log('Connected to PostgreSQL database successfully')
    })
    .catch(err => {
      console.error('Error connecting to PostgreSQL database:', err)
    })
}

export const CLOSE_DB = async () => {
  await pool.end()
    .then(() => {
      console.log('PostgreSQL database connection closed')
    })
    .catch(err => {
      console.error('Error closing PostgreSQL database connection:', err)
    })
}

export { pool }