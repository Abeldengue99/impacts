-- Diagnóstico somente de leitura. Pode ser executado no Query Tool do pgAdmin.
SELECT current_database() AS database_name, current_user AS connected_role;

SELECT rolname, rolcanlogin, rolsuper, rolcreatedb, rolcreaterole
FROM pg_roles
WHERE rolname IN ('impacta_migrator', 'impacta_app', 'impacta_auth', 'impacta_media')
ORDER BY rolname;

SELECT
    to_regnamespace('impacta') AS impacta_schema,
    to_regclass('impacta.users') AS users_table,
    to_regclass('public.impacta_schema_migrations') AS migration_ledger;

DO $$
DECLARE
    migration_row RECORD;
BEGIN
    IF to_regclass('public.impacta_schema_migrations') IS NULL THEN
        RAISE NOTICE 'Ainda não existe histórico de migrations nesta base.';
        RETURN;
    END IF;
    FOR migration_row IN EXECUTE
        'SELECT version, checksum, applied_at FROM public.impacta_schema_migrations ORDER BY version'
    LOOP
        RAISE NOTICE 'Migration: %, checksum: %, aplicada: %',
            migration_row.version, migration_row.checksum, migration_row.applied_at;
    END LOOP;
END;
$$;
