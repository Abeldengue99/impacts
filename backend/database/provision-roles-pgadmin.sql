-- Executar no Query Tool do pgAdmin, ligado a `postgres`, como superutilizador.
-- Este ficheiro cria os papeis sem password para nao gravar segredos no SQL/historico.
-- Depois, definir uma password individual em Login/Group Roles > Properties > Definition.
DO $provision_roles$
DECLARE
    role_name TEXT;
BEGIN
    FOREACH role_name IN ARRAY ARRAY[
        'impacta_migrator',
        'impacta_app',
        'impacta_auth',
        'impacta_media'
    ] LOOP
        IF EXISTS (SELECT 1 FROM pg_roles r WHERE r.rolname::TEXT = role_name) THEN
            EXECUTE format(
                'ALTER ROLE %I WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT',
                role_name
            );
        ELSE
            EXECUTE format(
                'CREATE ROLE %I LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT',
                role_name
            );
        END IF;
    END LOOP;
END;
$provision_roles$;

SELECT rolname, rolcanlogin, rolsuper, rolcreatedb, rolcreaterole, rolinherit
FROM pg_roles
WHERE rolname::TEXT = ANY (ARRAY[
    'impacta_migrator',
    'impacta_app',
    'impacta_auth',
    'impacta_media'
])
ORDER BY rolname;
