# Resolver `25P02` ao importar o schema no pgAdmin

Na captura enviada, o Query Tool está ligado a `impacta_db` como `postgres`. O `schema.sql` do Impacta verifica a ligação e só permite executar a instalação como `impacta_migrator`. A primeira instrução rejeita a ligação errada; `25P02` aparece depois porque o pgAdmin continua a enviar instruções para uma transacção que já falhou.

## Corrigir a sessão

No Query Tool que mostra o erro, execute:

```sql
ROLLBACK;
```

Isto termina a transacção interrompida. Depois feche esse separador, abra o Query Tool na base de destino com o utilizador `impacta_migrator` e execute `schema.sql` uma vez.

Se ainda não criou os papéis de ligação, execute `provision-roles-pgadmin.sql` ligado à base `postgres` como superutilizador. Defina uma palavra-passe para `impacta_migrator` em **Login/Group Roles → Properties → Definition** e use-a ao abrir a ligação à base de destino.

## Confirmar antes de repetir uma instalação anterior

Este erro por si só não exige apagar nem recriar a base. A verificação de utilizador acontece antes das migrations. Se houve uma execução anterior, ou se a ligação caiu depois de começar a instalação, execute `diagnose-pgadmin.sql` e confirme que `impacta.users` e `public.impacta_schema_migrations` não indicam uma instalação parcial. Não remova tabelas se existirem dados a preservar.

## Bases local e produção

Mantém duas bases permanentes: `impacta_local` para desenvolvimento e `impacta_production` para a plataforma publicada. Testes podem criar uma base temporária. Uma terceira base de staging é opcional e só será necessária quando houver um fluxo separado de validação antes do lançamento.

O `25P02` é um erro de estado da sessão, não um erro de modelagem do esquema. O primeiro erro da transacção é a mensagem imediatamente anterior ao `25P02` no painel **Messages**.
