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
│   │       ├── discover.js        (Explorar tópicos e materiais de estudo)
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

### 2. Preparar o PostgreSQL local

> **No pgAdmin:** segue o [passo a passo completo](docs/PGADMIN_SETUP.md). Para desenvolvimento, usa uma base local chamada `impacta_local`. A base de produção `impacta_production` fica separada e só será preparada depois de validarmos o ambiente local.

1. No Query Tool ligado à base `postgres`, executa `backend/database/provision-roles-pgadmin.sql`. Depois define uma password forte e diferente para cada papel: `impacta_migrator`, `impacta_app`, `impacta_auth` e `impacta_media`. Estes papéis têm de existir antes de executar o esquema — isso evita o erro `role "impacta_auth" does not exist`.
2. No pgAdmin, cria a base `impacta_local` com `impacta_migrator` como proprietário. Se já existir uma base com esse nome, confirma primeiro o estado com `backend/database/diagnose-pgadmin.sql`; não apagues nem voltes a executar o instalador sem verificar.
3. Liga o Query Tool à nova base como `postgres` e executa `backend/database/secure-database.sql`.
4. Copia `backend/.env.example` para `backend/.env` e preenche as credenciais locais. Não publiques nem envies esse ficheiro; não coloques passwords em mensagens ou comandos guardados no histórico.
5. Liga o Query Tool à base `impacta_local` como `impacta_migrator` e executa `backend/database/schema.sql` **uma única vez numa base vazia**. O ficheiro é gerado a partir das migrations e inclui os privilégios e dados de referência.
6. Para confirmar que as credenciais e a ligação estão correctas, abre um terminal na pasta `backend` e executa:
   ```bash
   npm ci
   npm run migrate
   ```
   O runner liga-se como `impacta_migrator`, confere o histórico e aplica apenas migrations ainda não executadas. Não abras `001_initial.sql` directamente no Query Tool.

Se a instalação já tiver sido tentada numa base existente e falhado, segue primeiro [o diagnóstico do pgAdmin](docs/PGADMIN_SETUP.md#se-a-migração-directa-já-falhou). Não voltes a executar `schema.sql` nessa base sem confirmar o estado. Os dados de referência em `seeds.sql` são apenas instituições e comunidades; não criam contas nem palavras-passe.

Os pools de runtime, autenticacao e analise de ficheiros estao preparados, mas os endpoints da API ainda nao os utilizam. O `npm run migrate` confirma a ligação à base; neste momento, `/api/health` confirma apenas que o servidor Node está activo.

Depois de confirmar a ligação local, cria a conta principal e as cinco publicações iniciais com `npm run bootstrap:admin` dentro de `backend`. O comando pede a nova password no terminal; escolhe uma nova e não a envies por mensagem.

O feed ainda lê publicações e perfis de demonstração de `frontend/assets/js/data.js`. Instalar a base não troca esses dados automaticamente. Para usar dados reais, falta ligar os endpoints da API à base e substituir no frontend as leituras de `IMPACTA_DATA` pelas respostas desses endpoints.

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
