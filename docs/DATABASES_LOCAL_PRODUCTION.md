# Bases local e de produção

As duas bases usam as mesmas migrations versionadas. A base local é para desenvolvimento; a base de produção recebe as mesmas versões apenas depois da validação local. Não copie os dados de uma base para a outra.

## Preparar cada servidor PostgreSQL

1. No pgAdmin, ligue-se ao servidor PostgreSQL como administrador e execute `backend/database/provision-roles-pgadmin.sql` uma vez em cada servidor. Defina passwords diferentes para `impacta_migrator`, `impacta_app`, `impacta_auth` e `impacta_media` nas propriedades dos papéis. Não use o utilizador `postgres` na aplicação.
2. Crie a base local `impacta_local` e a base de produção `impacta_production`, cada uma com `impacta_migrator` como proprietário. Se estiverem no mesmo servidor, são duas bases separadas; se estiverem em servidores distintos, repita a criação em cada servidor.
3. Ligue-se a cada base como administrador e execute `backend/database/secure-database.sql`.
4. Para uma base vazia, ligue-se como `impacta_migrator` e execute `backend/database/schema.sql`. Este ficheiro é gerado a partir das migrations e regista os mesmos checksums usados pelo runner.
5. Para uma base existente, aplique as novas versões com `npm run migrate` a partir de `backend`, depois execute `backend/database/grant-runtime.sql` como `impacta_migrator`. Não volte a executar `schema.sql` numa base que já tenha migrations ou dados.

## Variáveis locais e produção

Use `backend/.env.example` como modelo local e `backend/.env.production.example` no gestor de segredos do alojamento. As duas configurações têm nomes de base, hosts e passwords separados. Nunca grave `.env` com valores reais no Git. Em produção, `MIGRATION_DB_SSL=true` é obrigatório para migrations.

O ciclo recomendado é: migration local → validação local → revisão da alteração → backup da produção → mesma migration na produção. O runner recusa alterações a migrations já aplicadas e guarda o checksum de cada ficheiro.

## Administrador principal

Depois de instalar o esquema e executar `grant-runtime.sql`, execute `npm run bootstrap:admin` dentro da pasta `backend`. O comando cria ou confirma a conta de Abel Dengue, associa o papel `admin`, activa o selo verificado e publica cinco mensagens iniciais. Na primeira criação, a palavra-passe é pedida no terminal sem aparecer no ecrã; o hash Argon2id é a única forma guardada na base de dados. Se a conta já existir, o comando mantém a palavra-passe actual.

Para produção, defina `NODE_ENV=production`, as credenciais de migração no gestor de segredos e `IMPACTA_BOOTSTRAP_CONFIRM=IMPACTA_PRODUCTION` antes de executar o comando. A operação não grava a palavra-passe em SQL, `.env.example` ou Git. Escolha uma palavra-passe nova: a que foi partilhada nesta conversa deve ser considerada exposta.

## Se uma execução anterior falhou

Antes de voltar a executar SQL, rode o ficheiro de diagnóstico `backend/database/diagnose-pgadmin.sql`. Se existir `impacta.users` sem uma entrada no histórico de migrations, não execute o instalador nem apague objectos: a execução anterior pode ter deixado um esquema parcial. Faça uma cópia de segurança e recupere uma base limpa ou prepare uma migration de compatibilidade.
