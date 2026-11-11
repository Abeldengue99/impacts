require('dotenv').config();

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';
const migrationUser = process.env.MIGRATION_DB_USER || (!isProduction ? process.env.DB_USER : undefined);
const migrationPassword = process.env.MIGRATION_DB_PASSWORD || (!isProduction ? process.env.DB_PASSWORD : undefined);

if (!migrationUser || !migrationPassword) {
  throw new Error('Defina MIGRATION_DB_USER e MIGRATION_DB_PASSWORD para executar migrações.');
}
if (isProduction && process.env.MIGRATION_DB_SSL !== 'true') {
  throw new Error('MIGRATION_DB_SSL=true é obrigatório em produção.');
}

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'impacta_local',
  user: migrationUser,
  password: migrationPassword,
  ssl: process.env.MIGRATION_DB_SSL === 'true' ? { rejectUnauthorized: true } : false,
  max: 1,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 10000,
  application_name: 'impacta-migrations',
  options: '-c search_path=impacta,public -c statement_timeout=60000 -c lock_timeout=10000',
});

const migrationsDir = path.join(__dirname, 'migrations');
const ledgerTable = 'public.impacta_schema_migrations';
const advisoryLockKey = '78456321901';

async function runMigrations() {
  const client = await pool.connect();
  let lockAcquired = false;

  try {
    await client.query('SELECT pg_advisory_lock($1::bigint)', [advisoryLockKey]);
    lockAcquired = true;

    const state = await client.query(
      "SELECT to_regclass('public.impacta_schema_migrations') AS ledger, " +
      "to_regclass('public.users') AS legacy_users, " +
      "to_regclass('impacta.users') AS impacta_users"
    );
    const hasLedger = state.rows[0].ledger !== null;
    if (!hasLedger && (state.rows[0].legacy_users || state.rows[0].impacta_users)) {
      throw new Error(
        'Foi encontrado um esquema sem histórico de migrações. Nada foi alterado. Faça uma cópia de segurança e prepare uma migração de compatibilidade antes de continuar.'
      );
    }

    await client.query(
      'CREATE TABLE IF NOT EXISTS ' + ledgerTable + ' (' +
      'version VARCHAR(120) PRIMARY KEY, ' +
      'checksum CHAR(64) NOT NULL, ' +
      'applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())'
    );
    await client.query('REVOKE ALL ON TABLE ' + ledgerTable + ' FROM PUBLIC');

    const files = fs.readdirSync(migrationsDir)
      .filter((file) => /^\d{3,}_[a-z0-9_]+\.sql$/i.test(file))
      .sort();

    if (files.length === 0) {
      throw new Error('Não foram encontrados ficheiros de migração em backend/database/migrations.');
    }

    const appliedRows = await client.query('SELECT version, checksum FROM ' + ledgerTable);
    const applied = new Map(appliedRows.rows.map((row) => [row.version, row.checksum.trim()]));

    for (const file of files) {
      const sqlPath = path.join(migrationsDir, file);
      const sqlBuffer = fs.readFileSync(sqlPath);
      const checksum = crypto.createHash('sha256').update(sqlBuffer).digest('hex');
      const previousChecksum = applied.get(file);

      if (previousChecksum) {
        if (previousChecksum !== checksum) {
          throw new Error('A migração aplicada "' + file + '" foi alterada. Crie uma nova migração; não edite migrações já aplicadas.');
        }
        continue;
      }

      console.log('[Impacta DB] A aplicar ' + file);
      await client.query('BEGIN');
      try {
        await client.query(sqlBuffer.toString('utf8'));
        await client.query(
          'INSERT INTO ' + ledgerTable + ' (version, checksum) VALUES ($1, $2)',
          [file, checksum]
        );
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }

    console.log('[Impacta DB] Migrações concluídas.');
  } finally {
    if (lockAcquired) {
      await client.query('SELECT pg_advisory_unlock($1::bigint)', [advisoryLockKey]).catch(() => {});
    }
    client.release();
    await pool.end();
  }
}

runMigrations().catch((error) => {
  console.error('[Impacta DB] Migração interrompida:', error.message);
  process.exitCode = 1;
});
