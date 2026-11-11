# Fluxo local e producao

O projecto tera um unico codigo-fonte e duas configuracoes isoladas. Nao manteremos uma segunda copia dos ficheiros numa pasta `production`: copias divergem e facilitam que uma correcao seja aplicada num ambiente e esquecida no outro.

## Branches

- `develop`: integracao do trabalho local e candidato a testes.
- `feature/<nome>`: trabalho isolado; abrir pull request para `develop`.
- `main`: versao aprovada para producao. Alteracoes chegam atraves de pull request de `develop` para `main`.

O workflow `Verify database` corre em pull requests e em pushes para `develop` e `main`. Ele cria uma base PostgreSQL limpa, aplica a migracao, verifica permissoes e executa os seeds duas vezes para confirmar que sao repetiveis. Um pull request nao deve ser aprovado enquanto essa verificacao estiver vermelha.

## Desenvolvimento local

1. Trabalhar em `feature/*` ou `develop`, nunca directamente na configuracao da producao.
2. Copiar `backend/.env.example` para `backend/.env` e preencher apenas credenciais locais.
3. Usar uma base de dados local independente, `impacta_local`.
4. Aplicar as migrations e permissões descritas no [guia de pgAdmin](PGADMIN_SETUP.md). Para uma base nova, usar o `schema.sql` gerado; para uma base existente, usar `npm run migrate`.
5. Confirmar a mudanca no browser e executar o workflow de verificacao antes de abrir o pull request.

## Producao

- Produzir uma base de dados separada, por exemplo `impacta_production`, sem restaurar dados de desenvolvimento.
- Usar passwords distintas para cada papel e guardar os valores no gestor de segredos do alojamento.
- O servidor da API recebe apenas as credenciais de runtime, autenticacao e ficheiros. A credencial `impacta_migrator` so deve ser disponibilizada ao processo pontual de migracao.
- Antes de cada migracao, fazer e confirmar uma copia de seguranca da base de producao.
- Promover para `main` depois da verificacao verde e revisao. O deploy continua manual; este repositorio ainda nao esta ligado a um alojamento.
- Fazer primeiro migracoes compativeis com a versao actual da aplicacao. Remocoes e alteracoes destrutivas devem acontecer numa migracao posterior, depois da aplicacao ja nao depender das colunas antigas.

`backend/.env.production.example` documenta as variáveis necessárias com valores de exemplo, sem credenciais reais. A credencial `impacta_migrator` só deve ser injectada durante migrations ou bootstrap, nunca no processo normal da API. Nunca enviar um `.env` real para o Git.
