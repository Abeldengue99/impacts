-- Executar uma única vez no psql como administrador do PostgreSQL,
-- ligado à base de dados postgres. As palavras-passe são pedidas
-- interactivamente e não ficam guardadas neste ficheiro.
CREATE ROLE impacta_migrator LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT;
CREATE ROLE impacta_app LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT;
CREATE ROLE impacta_auth LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT;
CREATE ROLE impacta_media LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT;

\password impacta_migrator
\password impacta_app
\password impacta_auth
\password impacta_media
