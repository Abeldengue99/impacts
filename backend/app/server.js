/* ============================================================
   IMPACTA — Servidor API REST (Node.js + Express)
   ============================================================ */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'IMPACTA - Social Learning Community',
    region: 'Angola & Global',
    timestamp: new Date().toISOString()
  });
});

// Importar rotas quando configuradas
// app.use('/api/posts', require('../routes/posts.routes'));
// app.use('/api/users', require('../routes/users.routes'));
// app.use('/api/communities', require('../routes/communities.routes'));

app.listen(PORT, () => {
  console.log(`[IMPACTA API] Servidor em execução na porta ${PORT}`);
  console.log(`[IMPACTA API] Pronto para conexões PostgreSQL`);
});

