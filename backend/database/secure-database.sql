-- Executar como administrador do PostgreSQL, ligado a cada base Impacta já criada.
-- O runner guarda o seu ledger no schema public; apenas o migrator pode cria-lo.
DO $$
BEGIN
    EXECUTE format('REVOKE CONNECT, TEMPORARY ON DATABASE %I FROM PUBLIC', current_database());
    EXECUTE format(
        'GRANT CONNECT ON DATABASE %I TO impacta_migrator, impacta_app, impacta_auth, impacta_media',
        current_database()
    );
END;
$$;

REVOKE CREATE ON SCHEMA public FROM PUBLIC;
GRANT USAGE, CREATE ON SCHEMA public TO impacta_migrator;
