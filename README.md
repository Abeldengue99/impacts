# 🎓 IMPACTA — A Rede Social de Aprendizagem de Angola para o Mundo

> **Transforma o tempo de ecrã em tempo de evolução académica e profissional.**  
> *"O TikTok da Educação: Aprender · Partilhar · Conectar · Evoluir"*

---

## 🇦🇴 Visão Estratégica
O **IMPACTA** nasce com foco no ecossistema académico e estudantil de **Angola** (UAN, UCAN, ISPTEC, ISUTIC, UMN, UKB, institutos médios e pré-universitários) com visão e infraestrutura desenhadas para expansão em toda a **África, CPLP e escala global**.

---

## 🛠️ Stack Tecnológica

### 🎨 Frontend Multiplataforma (PWA + Apple Glassmorphism)
- **Design System:** Glassmorphism estilo Apple, responsivo e ultra-otimizado (Mobile-First para Android, iPhone e Computadores).
- **Compatibilidade:** 
  - 📱 **Android** (Google Chrome, Samsung Internet — instalável como App nativo via PWA)
  - 🍏 **iOS / iPhone & iPad** (Safari — suporte a tela cheia e Standalone Home Screen)
  - 💻 **Desktop / Laptop** (Windows, macOS e Linux)
- **Internacionalização (i18n):**
  - 🇦🇴 **Português de Angola (`pt-AO`)** — Padrão nativo
  - 🇺🇸 **Inglês (`en`)**
  - 🇫🇷 **Francês (`fr`)**
  - 🇨🇳 **Mandarim (`zh`)**

### ⚙️ Backend & Base de Dados
- **Base de Dados:** **PostgreSQL 14+**
  - Esquema versionado e não destrutivo em `backend/database/migrations/`.
  - Credenciais, tokens e sessões isolados dos dados de perfil; pools separados para runtime, autenticação e migrações.
- **Backend API:** **Node.js (Express) + PostgreSQL (`pg` pool)**
  - Os pools e as migrações estão preparados; os endpoints da API ainda precisam de os utilizar.

---

## 📁 Estrutura de Diretórios

```text
Impactaa/
├── frontend/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── variables.css      (Tokens de cores, glassmorphism e sombras)
│   │   │   ├── base.css           (Reset, animações e tipografia Inter)
│   │   │   ├── layout.css         (TopBar, BottomNav e casca SPA)
│   │   │   ├── components.css     (Cards, Reels, Posts, Modais)
│   │   │   └── responsive.css     (Breakpoints Mobile, Tablet, Desktop)
│   │   └── js/
│   │       ├── i18n.js            (Motor de tradução: pt-AO, en, fr, zh)
│   │       ├── data.js            (Universidades angolanas, utilizadores, dados)
│   │       ├── interactions.js    (Haptics, Toasts, PWA Install, Comentários)
│   │       ├── app.js             (Router SPA, Seletor de Idioma e Eventos)
│   │       ├── feed.js            (Feed principal de publicações)
│   │       ├── reels.js           (Scroll vertical estilo TikTok para vídeos curtos)
│   │       ├── discover.js        (Explorar tópicos e sebentas)
│   │       ├── communities.js     (Comunidades universitárias)
│   │       ├── users.js           (Diretório de estudantes e professores)
│   │       ├── inbox.js           (Mensagens e notificações)
│   │       ├── profile.js         (Perfil do utilizador e materiais guardados)
│   │       └── search.js          (Pesquisa avançada com filtros)
│   ├── pages/
│   │   └── index.html             (Entrada principal da aplicação)
│   ├── public/
│   │   ├── manifest.json          (PWA Web App Manifest)
│   │   └── icons/                 (Ícones em SVG escaláveis)
│   └── sw.js                      (Service Worker para cache offline)
├── backend/
│   ├── app/
│   │   └── server.js              (Servidor API REST)
│   ├── config/
│   │   └── db.js                  (Pool de conexões PostgreSQL)
│   ├── database/
│   │   ├── migrations/            (Migrações SQL versionadas)
│   │   ├── migrate.js             (Runner transaccional com checksum e lock)
│   │   ├── provision-roles.sql    (Papéis separados para runtime, auth e migrações)
│   │   ├── grant-runtime.sql      (Privilégios explícitos da aplicação)
│   │   └── seeds.sql              (Instituições e comunidades, sem conta admin)
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## 🚀 Como Executar

## Fluxo local e producao

O trabalho diario fica em `develop`; `main` guarda a versao aprovada para producao. Pull requests passam pelo workflow `Verify database`, e o deploy continua manual. Consulte [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) antes de promover uma alteracao.

### 1. Testar o Frontend no Browser / Celular
Aceda via servidor local (XAMPP / Apache):
```text
http://localhost/Impactaa/frontend/pages/index.html
```

### 2. Preparar o PostgreSQL

> **Usas pgAdmin?** Segue [docs/PGADMIN_SETUP.md](docs/PGADMIN_SETUP.md). Cria primeiro os quatro papéis e executa as migrações com `npm run migrate`; não abras `001_initial.sql` directamente no Query Tool.

1. Como administrador do PostgreSQL, crie os quatro papéis com senhas pedidas interactivamente:
   ```bash
   psql -U postgres -d postgres -f backend/database/provision-roles.sql
   ```
2. Crie uma base de dados nova, propriedade do utilizador de migração:
   ```sql
   CREATE DATABASE impacta_db OWNER impacta_migrator;
   ```
3. Como administrador, feche o acesso publico ao schema `public` e reserve a criacao de objectos ao migrator:
   ```bash
   psql -U postgres -d impacta_db -f backend/database/secure-database.sql
   ```
4. Copie `backend/.env.example` para `backend/.env` e preencha as credenciais locais. Nunca publique esse ficheiro.
5. Aplique as migrações a partir de `backend/`:
   ```bash
   npm run migrate
   ```
6. Conceda à aplicação apenas os acessos explicitamente listados:
   ```bash
   psql -U impacta_migrator -d impacta_db -f database/grant-runtime.sql
   ```
7. Opcionalmente, carregue instituições e comunidades de demonstração:
   ```bash
   psql -U impacta_migrator -d impacta_db -f database/seeds.sql
   ```

`schema.sql` foi desactivado porque a versão anterior apagava tabelas. Em bases de dados antigas sem histórico de migrações, o runner pára sem alterar dados; é necessário fazer uma cópia de segurança e preparar uma migração de compatibilidade antes de continuar. Os seeds não criam utilizadores nem palavras-passe.

Os pools de runtime, autenticacao e analise de ficheiros estao preparados, mas os endpoints da API ainda nao os utilizam.

RLS protege perfis privados, comunidades, publicacoes, mensagens e dados de moderacao. Endpoints autenticados devem usar `withUserTransaction(userId, callback)` de `config/db.js` para definir o contexto da sessao; consultas sem contexto recebem apenas dados publicos. Os endpoints ainda nao estao ligados aos pools.

O papel `impacta_media` le apenas ficheiros em quarentena e pode actualizar o resultado da analise e o escopo de acesso. O worker de inspeccao ainda nao foi implementado; sem ele, uploads permanecem em quarentena.

### 3. Iniciar o Backend Node.js
```bash
cd backend
npm install
npm run dev
```

---

## 🌍 Troca de Idioma em Tempo Real
No topo da aplicação (Topbar), clique no ícone do globo 🌐 para alternar instantaneamente entre:
- **Português de Angola**
- **Inglês**
- **Francês**
- **Mandarim**
