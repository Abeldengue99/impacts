'use strict';

require('dotenv').config();

const argon2 = require('argon2');
const { Pool } = require('pg');

const adminEmail = (process.env.IMPACTA_ADMIN_EMAIL || 'tabelaabel99@gmail.com').trim().toLowerCase();
const adminHandle = 'abel.dengue';
const adminName = 'Abel Dengue';
const isProduction = process.env.NODE_ENV === 'production';

if (!process.env.MIGRATION_DB_USER || !process.env.MIGRATION_DB_PASSWORD) {
  throw new Error('Configure MIGRATION_DB_USER e MIGRATION_DB_PASSWORD no ambiente local ou no gestor de segredos.');
}
if (isProduction && process.env.MIGRATION_DB_SSL !== 'true') {
  throw new Error('MIGRATION_DB_SSL=true é obrigatório em produção.');
}
if (isProduction && process.env.IMPACTA_BOOTSTRAP_CONFIRM !== 'IMPACTA_PRODUCTION') {
  throw new Error('Para confirmar a operação em produção, defina IMPACTA_BOOTSTRAP_CONFIRM=IMPACTA_PRODUCTION.');
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) {
  throw new Error('IMPACTA_ADMIN_EMAIL não tem um formato válido.');
}

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'impacta_local',
  user: process.env.MIGRATION_DB_USER,
  password: process.env.MIGRATION_DB_PASSWORD,
  ssl: process.env.MIGRATION_DB_SSL === 'true' ? { rejectUnauthorized: true } : false,
  max: 1,
  connectionTimeoutMillis: 7000,
  application_name: 'impacta-admin-bootstrap'
});

const firstPosts = [
  {
    subject: 'Boas-vindas',
    content: 'Bem-vindo à Impacta. Este é um espaço para aprender, partilhar ideias e trocar experiências com pessoas que também querem avançar.',
    hashtags: ['Impacta', 'Aprendizagem']
  },
  {
    subject: 'Dúvidas',
    content: 'Tens uma dúvida sobre uma matéria? Explica o que já tentaste e pergunta à comunidade. Uma boa conversa pode ajudar toda a gente a aprender.',
    hashtags: ['Estudo', 'Dúvidas']
  },
  {
    subject: 'Materiais de estudo',
    content: 'Partilha apontamentos, exercícios e outros materiais que possam ajudar os teus colegas. Confirma sempre a fonte e os direitos de utilização antes de publicar.',
    hashtags: ['MateriaisDeEstudo', 'Partilha']
  },
  {
    subject: 'Grupos de estudo',
    content: 'Estudar em grupo ajuda a trocar explicações e pontos de vista. Encontra colegas da tua área ou cria uma comunidade para estudarem juntos.',
    hashtags: ['GruposDeEstudo', 'Comunidade']
  },
  {
    subject: 'Apresenta-te',
    content: 'Conta à comunidade o que estás a estudar, os temas que te interessam e aquilo em que podes ajudar. A Impacta começa com as pessoas que participam.',
    hashtags: ['Apresentação', 'Impacta']
  }
];

function readSecret(label) {
  const input = process.stdin;
  if (!input.isTTY || typeof input.setRawMode !== 'function') {
    return Promise.reject(new Error('Executa este comando num terminal interactivo para introduzir a palavra-passe sem a guardar no projecto.'));
  }

  process.stdout.write(label);
  return new Promise((resolve, reject) => {
    let value = '';
    const finish = (error) => {
      input.removeListener('data', onData);
      input.setRawMode(false);
      input.pause();
      process.stdout.write('\n');
      if (error) reject(error);
      else resolve(value);
    };
    const onData = (chunk) => {
      for (const character of chunk.toString('utf8')) {
        if (character === '\u0003') return finish(new Error('Operação cancelada.'));
        if (character === '\r' || character === '\n') return finish();
        if (character === '\u007f' || character === '\b') {
          value = value.slice(0, -1);
          continue;
        }
        if (character >= ' ') value += character;
      }
    };
    input.setRawMode(true);
    input.resume();
    input.on('data', onData);
  });
}

async function getNewAdminPassword() {
  const password = await readSecret('Define uma nova palavra-passe para Abel Dengue: ');
  if (password.length < 12 || password.length > 128) {
    throw new Error('A palavra-passe deve ter entre 12 e 128 caracteres.');
  }
  const confirmation = await readSecret('Confirma a palavra-passe: ');
  if (password !== confirmation) throw new Error('As palavras-passe não coincidem.');
  return password;
}

async function run() {
  const client = await pool.connect();
  try {
    const target = await client.query('SELECT current_database() AS database_name, current_user AS role_name');
    console.log(`Base de destino: ${target.rows[0].database_name} (papel ${target.rows[0].role_name}).`);
    await client.query('BEGIN');
    await client.query("SELECT pg_advisory_xact_lock(hashtextextended('impacta-admin-bootstrap', 0))");

    const found = await client.query(
      `SELECT u.id, u.status, c.email_verified_at
         FROM impacta.user_credentials c
         JOIN impacta.users u ON u.id = c.user_id
        WHERE c.email = $1
        FOR UPDATE OF u`,
      [adminEmail]
    );

    let userId;
    if (found.rowCount) {
      const existing = found.rows[0];
      if (!['pending_verification', 'active'].includes(existing.status)) {
        throw new Error(`A conta ${adminEmail} está no estado ${existing.status}; não foi alterada.`);
      }
      userId = existing.id;
      await client.query(
        `UPDATE impacta.user_credentials
            SET email_verified_at = COALESCE(email_verified_at, NOW())
          WHERE user_id = $1`,
        [userId]
      );
      await client.query(
        `UPDATE impacta.users
            SET display_name = $2, account_type = 'creator', country_code = 'AO',
                preferred_language = 'pt-AO', profile_visibility = 'public',
                is_verified = TRUE, bio = $3,
                status = CASE WHEN status = 'pending_verification' THEN 'active' ELSE status END
          WHERE id = $1`,
        [userId, adminName, 'Criador da Impacta. Interessado em educação e partilha de conhecimento.']
      );
      console.log('A conta já existia; a palavra-passe actual foi mantida.');
    } else {
      const password = await getNewAdminPassword();
      const passwordHash = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 1
      });
      const inserted = await client.query(
        `INSERT INTO impacta.users
            (handle, display_name, account_type, country_code, preferred_language,
             profile_visibility, status, is_verified, bio)
         VALUES ($1, $2, 'creator', 'AO', 'pt-AO', 'public', 'pending_verification', TRUE, $3)
         RETURNING id`,
        [adminHandle, adminName, 'Criador da Impacta. Interessado em educação e partilha de conhecimento.']
      );
      userId = inserted.rows[0].id;
      await client.query(
        `INSERT INTO impacta.user_credentials (user_id, email, password_hash, email_verified_at)
         VALUES ($1, $2, $3, NOW())`,
        [userId, adminEmail, passwordHash]
      );
      await client.query("UPDATE impacta.users SET status = 'active' WHERE id = $1", [userId]);
    }

    await client.query(
      `INSERT INTO impacta.privileged_role_assignments (user_id, role, reason)
       SELECT $1, 'admin', 'Conta principal inicial da Impacta'
        WHERE NOT EXISTS (
          SELECT 1 FROM impacta.privileged_role_assignments
           WHERE user_id = $1 AND role = 'admin' AND revoked_at IS NULL
        )`,
      [userId]
    );
    await client.query(
      `INSERT INTO impacta.user_preferences (user_id)
       VALUES ($1) ON CONFLICT (user_id) DO NOTHING`,
      [userId]
    );

    for (const post of firstPosts) {
      let postId = (await client.query(
        `SELECT id FROM impacta.posts
          WHERE author_id = $1 AND subject_area = $2 AND status <> 'deleted'
          ORDER BY created_at LIMIT 1`,
        [userId, post.subject]
      )).rows[0]?.id;

      if (!postId) {
        const inserted = await client.query(
          `INSERT INTO impacta.posts
              (author_id, post_type, content, subject_area, language, visibility, status)
           VALUES ($1, 'standard', $2, $3, 'pt-AO', 'public', 'draft')
           RETURNING id`,
          [userId, post.content, post.subject]
        );
        postId = inserted.rows[0].id;
        await client.query("UPDATE impacta.posts SET status = 'published' WHERE id = $1", [postId]);
      }

      for (const label of post.hashtags) {
        const tag = label.toLowerCase();
        const hashtag = await client.query(
          `INSERT INTO impacta.hashtags (tag) VALUES ($1)
           ON CONFLICT (tag) DO UPDATE SET tag = EXCLUDED.tag
           RETURNING id`,
          [tag]
        );
        await client.query(
          `INSERT INTO impacta.post_hashtags (post_id, hashtag_id)
           VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [postId, hashtag.rows[0].id]
        );
      }
    }

    await client.query(
      `INSERT INTO impacta.administrative_audit_log
          (actor_user_id, action, target_type, target_id, reason, after_state)
       SELECT $1, 'bootstrap_admin', 'user', $1, 'Criação ou confirmação da conta principal da Impacta',
              jsonb_build_object('role', 'admin', 'is_verified', TRUE)
        WHERE NOT EXISTS (
          SELECT 1 FROM impacta.administrative_audit_log
           WHERE action = 'bootstrap_admin' AND target_type = 'user' AND target_id = $1
        )`,
      [userId]
    );

    await client.query('COMMIT');
    console.log(`Administrador confirmado: ${adminName} (${adminEmail}); cinco publicações iniciais verificadas.`);
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((error) => {
  console.error(`[Impacta admin bootstrap] ${error.message}`);
  process.exitCode = 1;
});
