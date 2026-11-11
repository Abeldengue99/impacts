-- O esquema antigo era destrutivo e foi retirado.
-- Não executar este ficheiro. As alterações agora são versionadas em
-- backend/database/migrations e aplicadas com: npm run migrate
DO $$
BEGIN
  RAISE EXCEPTION 'Use npm run migrate. Este ficheiro existe apenas para impedir a execução acidental do esquema antigo.';
END;
$$;
