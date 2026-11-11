-- Executar como administrador do PostgreSQL na base impacta_db, depois de a criar.
-- O runner guarda o seu ledger no schema public; apenas o migrator pode cria-lo.
REVOKE CONNECT, TEMPORARY ON DATABASE impacta_db FROM PUBLIC;
GRANT CONNECT ON DATABASE impacta_db TO impacta_migrator, impacta_app, impacta_auth, impacta_media;

REVOKE CREATE ON SCHEMA public FROM PUBLIC;
GRANT USAGE, CREATE ON SCHEMA public TO impacta_migrator;
