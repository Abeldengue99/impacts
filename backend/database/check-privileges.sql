-- Verificacao de seguranca executada no CI depois de grant-runtime.sql.
DO $$
BEGIN
    IF has_table_privilege('impacta_app', 'impacta.user_credentials', 'SELECT') THEN
        RAISE EXCEPTION 'impacta_app nao pode ler credenciais';
    END IF;
    IF has_column_privilege('impacta_app', 'impacta.users', 'status', 'SELECT') THEN
        RAISE EXCEPTION 'impacta_app nao pode ler o estado interno da conta';
    END IF;
    IF has_column_privilege('impacta_app', 'impacta.users', 'status', 'UPDATE') THEN
        RAISE EXCEPTION 'impacta_app nao pode alterar o estado interno da conta';
    END IF;
    IF has_column_privilege('impacta_app', 'impacta.media_assets', 'storage_key', 'SELECT') THEN
        RAISE EXCEPTION 'impacta_app nao pode ler chaves de armazenamento directamente';
    END IF;
    IF has_table_privilege('impacta_app', 'impacta.posts', 'DELETE') THEN
        RAISE EXCEPTION 'publicacoes devem usar remocao logica';
    END IF;
    IF has_table_privilege('impacta_app', 'impacta.privileged_role_assignments', 'UPDATE') THEN
        RAISE EXCEPTION 'impacta_app nao pode promover utilizadores';
    END IF;
    IF NOT has_column_privilege('impacta_media', 'impacta.media_assets', 'storage_key', 'SELECT') THEN
        RAISE EXCEPTION 'o worker de ficheiros precisa de ler a chave em quarentena';
    END IF;
    IF has_column_privilege('impacta_media', 'impacta.media_assets', 'storage_key', 'UPDATE') THEN
        RAISE EXCEPTION 'o worker nao pode alterar a chave de armazenamento';
    END IF;
    IF NOT has_column_privilege('impacta_media', 'impacta.media_assets', 'status', 'UPDATE') THEN
        RAISE EXCEPTION 'o worker precisa de publicar o resultado da analise';
    END IF;
    IF NOT has_function_privilege('impacta_app', 'impacta.get_poll_results(uuid)', 'EXECUTE') THEN
        RAISE EXCEPTION 'a API precisa do acesso agregado aos resultados das sondagens';
    END IF;
    IF (SELECT relrowsecurity FROM pg_class WHERE oid = 'impacta.users'::regclass) IS DISTINCT FROM TRUE THEN
        RAISE EXCEPTION 'RLS tem de estar activo em users';
    END IF;
    IF (SELECT relrowsecurity FROM pg_class WHERE oid = 'impacta.messages'::regclass) IS DISTINCT FROM TRUE THEN
        RAISE EXCEPTION 'RLS tem de estar activo em messages';
    END IF;
END;
$$;
