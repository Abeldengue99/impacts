/* PostgreSQL pool for the least-privilege runtime account. */

const { Pool } = require('pg');

const nodeEnv = process.env.NODE_ENV || 'development';
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

if (!dbUser || !dbPassword) {
  throw new Error('DB_USER e DB_PASSWORD têm de estar definidos no ambiente.');
}
if (nodeEnv === 'production' && process.env.DB_SSL !== 'true') {
  throw new Error('DB_SSL=true é obrigatório em produção.');
}

const dbPort = Number(process.env.DB_PORT || 5432);
if (!Number.isInteger(dbPort) || dbPort < 1 || dbPort > 65535) {
  throw new Error('DB_PORT tem de ser uma porta TCP válida.');
}

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: dbPort,
  database: process.env.DB_NAME || 'impacta_db',
  user: dbUser,
  password: dbPassword,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  application_name: 'impacta-api',
  options: '-c search_path=impacta -c statement_timeout=15000 -c idle_in_transaction_session_timeout=15000 -c lock_timeout=5000',
});

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function withUserTransaction(userId, callback) {
  if (typeof userId !== 'string' || !UUID_PATTERN.test(userId)) {
    throw new TypeError('withUserTransaction requer um UUID de utilizador valido.');
  }
  if (typeof callback !== 'function') {
    throw new TypeError('withUserTransaction requer uma funcao callback.');
  }

  const client = await pool.connect();
  let releaseError;
  try {
    await client.query('BEGIN');
    await client.query("SELECT set_config('impacta.user_id', $1, TRUE)", [userId]);
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      // Preserve the original query error; the pool discards unusable clients.
      releaseError = rollbackError;
    }
    throw error;
  } finally {
    client.release(releaseError);
  }
}

pool.on('error', (error) => {
  console.error('[PostgreSQL] Erro inesperado numa ligação inactiva do pool:', error.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  withUserTransaction,
  pool,
};
