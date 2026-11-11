# Preparar PostgreSQL no pgAdmin

O erro `role "impacta_auth" does not exist` acontece quando a migração é executada antes de criar os quatro papéis da aplicação. O ficheiro `migrations/001_initial.sql` também não deve ser executado directamente no Query Tool: use o runner `npm run migrate`, que aplica a migração com histórico e transação.

## 1. Criar os papéis

No pgAdmin, abra o Query Tool ligado à base `postgres`, como superutilizador (`postgres`). Abra e execute `backend/database/provision-roles-pgadmin.sql`. O resultado deve mostrar estes quatro papéis com `rolcanlogin = true` e `rolsuper = false`:

- `impacta_migrator`
- `impacta_app`
- `impacta_auth`
- `impacta_media`

O script não guarda passwords. No Browser, actualize `Login/Group Roles`; para cada papel, abra **Properties → Definition**, defina uma password forte e guarde. Use passwords diferentes para cada papel.

## 2. Criar ou corrigir a base

Ainda ligado a `postgres`, crie `impacta_db` com owner `impacta_migrator` (Databases → Create → Database). Se a base já existe e é dedicada ao Impacta, confirme ou altere o owner para `impacta_migrator` nas propriedades da base.

Abra o Query Tool ligado a `impacta_db`, ainda como `postgres`, e execute `backend/database/secure-database.sql`.

## 3. Aplicar a migração pelo runner

Copie `backend/.env.example` para `backend/.env`. Preencha `DB_HOST`, `DB_PORT`, `DB_NAME` e as passwords distintas de `impacta_app`, `impacta_migrator`, `impacta_auth` e `impacta_media`. Não use `postgres` como utilizador da aplicação ou do migrator.

No terminal, dentro da pasta `backend`, execute:

```bash
npm ci
npm run migrate
```

O runner liga como `impacta_migrator`. Depois da migração, execute `database/grant-runtime.sql` ligado à base `impacta_db` como `impacta_migrator`. Se quiser dados de demonstração, execute `database/seeds.sql` também como `impacta_migrator`.

## Se a migração directa já falhou

Não volte a executar `001_initial.sql` e não apague a base antes de confirmar o estado. No Query Tool ligado a `impacta_db`, execute:

```sql
SELECT
    to_regclass('impacta.users') AS users_table,
    to_regclass('public.impacta_schema_migrations') AS migration_ledger;
```

Se ambas as colunas forem `NULL`, a migração não deixou o esquema e pode seguir os passos acima. Se `users_table` existir e `migration_ledger` for `NULL`, pare: o esquema pode ter sido criado parcialmente fora do runner. Não execute novamente nem remova tabelas se houver dados a preservar; é preciso recuperar uma base limpa ou preparar uma migração de compatibilidade.
