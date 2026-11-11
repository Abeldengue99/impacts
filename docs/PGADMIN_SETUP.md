# Preparar as bases de dados do Impacta no pgAdmin

Se o Query Tool mostrar `25P02`, segue primeiro o [guia para recuperar a sessão](PGADMIN_25P02.md).

Para o fluxo completo de bases local e produção, consulte também [DATABASES_LOCAL_PRODUCTION.md](DATABASES_LOCAL_PRODUCTION.md). O instalador completo para uma base nova é `backend/database/schema.sql`.

O erro `role "impacta_auth" does not exist` acontece quando a migração é executada antes de criar os quatro papéis da aplicação. O ficheiro `migrations/001_initial.sql` também não deve ser executado directamente no Query Tool: use o runner `npm run migrate`, que aplica a migração com histórico e transação.

## 1. Criar os papéis

No pgAdmin, abra o Query Tool ligado à base `postgres`, como superutilizador (`postgres`). Abra e execute `backend/database/provision-roles-pgadmin.sql` em cada servidor PostgreSQL. O resultado deve mostrar estes quatro papéis com `rolcanlogin = true` e `rolsuper = false`:

- `impacta_migrator`
- `impacta_app`
- `impacta_auth`
- `impacta_media`

O script não guarda passwords. No Browser, actualize `Login/Group Roles`; para cada papel, abra **Properties → Definition**, defina uma password forte e guarde. Use passwords diferentes para cada papel.

## 2. Criar ou corrigir a base

Ainda ligado a `postgres`, crie a base local `impacta_local` ou a base de produção `impacta_production`, com owner `impacta_migrator` (Databases → Create → Database). Se já existir, confirme que é dedicada ao Impacta e que o owner está correcto.

Abra o Query Tool ligado à base de destino, ainda como `postgres`, e execute `backend/database/secure-database.sql`.

## 3. Aplicar a migração pelo runner

Copie `backend/.env.example` para `backend/.env`. Preencha `DB_HOST`, `DB_PORT`, `DB_NAME` e as passwords distintas de `impacta_app`, `impacta_migrator`, `impacta_auth` e `impacta_media`. Não use `postgres` como utilizador da aplicação ou do migrator.

Numa base nova, ligue o Query Tool como `impacta_migrator` e execute `backend/database/schema.sql`. Em bases existentes, no terminal dentro da pasta `backend`, execute:

```bash
npm ci
npm run migrate
```

O runner liga como `impacta_migrator`. Em bases existentes, depois da migração, execute `database/grant-runtime.sql` e `database/seeds.sql` ligados à base de destino, também como `impacta_migrator`. Para preparar a conta principal e as cinco publicações, use `npm run bootstrap:admin` conforme as instruções do guia local/produção.

## Se a migração directa já falhou

Não volte a executar `001_initial.sql` nem `schema.sql` e não apague a base antes de confirmar o estado. No Query Tool ligado à base afectada, execute `backend/database/diagnose-pgadmin.sql`:

```sql
SELECT
    to_regclass('impacta.users') AS users_table,
    to_regclass('public.impacta_schema_migrations') AS migration_ledger;
```

Se ambas as colunas forem `NULL`, a migração não deixou o esquema e pode seguir os passos acima. Se `users_table` existir e `migration_ledger` for `NULL`, pare: o esquema pode ter sido criado parcialmente fora do runner. Não execute novamente nem remova tabelas se houver dados a preservar; é preciso recuperar uma base limpa ou preparar uma migração de compatibilidade.
