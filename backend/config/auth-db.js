/* Restricted PostgreSQL pool for registration, credentials, tokens and sessions. */

const { Pool } = require('pg');

const nodeEnv = process.env.NODE_ENV || 'development';
const authUser = process.env.AUTH_DB_USER;
const authPassword = process.env.AUTH_DB_PASSWORD;
const dbPort = Number(process.env.DB_PORT || 5432);

if (!authUser || !authPassword) {
  throw new Error('AUTH_DB_USER e AUTH_DB_PASSWORD têm de estar definidos no ambiente.');
}
if (nodeEnv === 'production' && process.env.AUTH_DB_SSL !== 'true') {
  throw new Error('AUTH_DB_SSL=true é obrigatório em produção.');
}
if (!Number.isInteger(dbPort) || dbPort < 1 || dbPort > 65535) {
  throw new Error('DB_PORT tem de ser uma porta TCP válida.');
}

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: dbPort,
  database: process.env.DB_NAME || 'impacta_local',
  user: authUser,
  password: authPassword,
  ssl: process.env.AUTH_DB_SSL === 'true' ? { rejectUnauthorized: true } : false,
  max: 4,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  application_name: 'impacta-auth',
  options: '-c search_path=impacta -c statement_timeout=10000 -c idle_in_transaction_session_timeout=10000 -c lock_timeout=5000',
});

pool.on('error', (error) => {
  console.error('[PostgreSQL Auth] Erro inesperado numa ligação inactiva do pool:', error.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
