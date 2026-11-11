'use strict';

// Produz schema.sql com as mesmas migrations, permissões e dados institucionais
// usados pelo runner. Não contém contas, passwords nem tokens.
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const databaseDir = __dirname;
const migrationDir = path.join(databaseDir, 'migrations');
const outputPath = path.join(databaseDir, 'schema.sql');
const migrationFiles = fs.readdirSync(migrationDir)
  .filter((file) => /^\d{3,}_[a-z0-9_]+\.sql$/i.test(file))
  .sort();

if (!migrationFiles.length) throw new Error('Não existem migrations para exportar.');

const parts = [
  '-- Impacta: instalador para pgAdmin, gerado das migrations versionadas.',
  '-- Executar numa base nova, ligado como impacta_migrator. Antes, criar os papéis',
  '-- com provision-roles-pgadmin.sql e preparar esta base com secure-database.sql.',
  '-- Para uma base existente, usar npm run migrate; não voltar a executar este ficheiro.',
  'BEGIN;',
  `DO $pgadmin_preflight$
DECLARE
    has_applied_migrations BOOLEAN := FALSE;
BEGIN
    IF current_user <> 'impacta_migrator' THEN
        RAISE EXCEPTION 'Ligue ao pgAdmin como impacta_migrator antes de executar schema.sql';
    END IF;
    IF to_regclass('impacta.users') IS NOT NULL THEN
        RAISE EXCEPTION 'Já existe impacta.users. Não execute o instalador numa base com esquema ou dados.';
    END IF;
    IF to_regnamespace('impacta') IS NOT NULL THEN
        RAISE EXCEPTION 'Já existe o schema impacta. Verifique se uma execução anterior deixou objectos parciais.';
    END IF;
    IF to_regclass('public.impacta_schema_migrations') IS NOT NULL THEN
        EXECUTE 'SELECT EXISTS (SELECT 1 FROM public.impacta_schema_migrations)'
            INTO has_applied_migrations;
        IF has_applied_migrations THEN
            RAISE EXCEPTION 'Esta base já tem migrations. Continue com npm run migrate.';
        END IF;
    END IF;
END;
$pgadmin_preflight$;`,
  `CREATE TABLE IF NOT EXISTS public.impacta_schema_migrations (
    version VARCHAR(120) PRIMARY KEY,
    checksum CHAR(64) NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
REVOKE ALL ON TABLE public.impacta_schema_migrations FROM PUBLIC;`
];

for (const file of migrationFiles) {
  const sql = fs.readFileSync(path.join(migrationDir, file));
  const checksum = crypto.createHash('sha256').update(sql).digest('hex');
  parts.push(`\n-- Migration: ${file}\n${sql.toString('utf8')}`);
  parts.push(
    `INSERT INTO public.impacta_schema_migrations (version, checksum) VALUES ('${file}', '${checksum}');`
  );
}

for (const file of ['grant-runtime.sql', 'seeds.sql']) {
  parts.push(`\n-- Ficheiro: ${file}\n${fs.readFileSync(path.join(databaseDir, file), 'utf8')}`);
}

parts.push('\nCOMMIT;\n');
fs.writeFileSync(outputPath, parts.join('\n'), 'utf8');
console.log(`schema.sql actualizado com ${migrationFiles.length} migrations.`);
