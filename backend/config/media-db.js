/* Restricted PostgreSQL pool for the file scanning worker. */

const { Pool } = require('pg');

const nodeEnv = process.env.NODE_ENV || 'development';
const mediaUser = process.env.MEDIA_DB_USER;
const mediaPassword = process.env.MEDIA_DB_PASSWORD;
const dbPort = Number(process.env.DB_PORT || 5432);

if (!mediaUser || !mediaPassword) {
  throw new Error('MEDIA_DB_USER e MEDIA_DB_PASSWORD tem de estar definidos no ambiente.');
}
if (nodeEnv === 'production' && process.env.MEDIA_DB_SSL !== 'true') {
  throw new Error('MEDIA_DB_SSL=true e obrigatorio em producao.');
}
if (!Number.isInteger(dbPort) || dbPort < 1 || dbPort > 65535) {
  throw new Error('DB_PORT tem de ser uma porta TCP valida.');
}

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: dbPort,
  database: process.env.DB_NAME || 'impacta_db',
  user: mediaUser,
  password: mediaPassword,
  ssl: process.env.MEDIA_DB_SSL === 'true' ? { rejectUnauthorized: true } : false,
  max: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  application_name: 'impacta-media-scanner',
  options: '-c search_path=impacta -c statement_timeout=30000 -c idle_in_transaction_session_timeout=15000 -c lock_timeout=5000',
});

pool.on('error', (error) => {
  console.error('[PostgreSQL Media] Erro inesperado numa ligacao inactiva do pool:', error.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
