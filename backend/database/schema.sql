-- Impacta: instalador para pgAdmin, gerado das migrations versionadas.
-- Executar numa base nova, ligado como impacta_migrator. Antes, criar os papéis
-- com provision-roles-pgadmin.sql e preparar esta base com secure-database.sql.
-- Para uma base existente, usar npm run migrate; não voltar a executar este ficheiro.
BEGIN;
DO $pgadmin_preflight$
DECLARE
    has_applied_migrations BOOLEAN := FALSE;
BEGIN
    IF current_user <> 'impacta_migrator' THEN
        RAISE EXCEPTION 'Ligado como "%". Ligue novamente o Query Tool como impacta_migrator antes de executar schema.sql.', current_user;
    END IF;
    IF to_regclass('impacta.users') IS NOT NULL THEN
        RAISE EXCEPTION 'Já existe impacta.users. Não execute o instalador numa base com esquema ou dados.';
    END IF;
    IF to_regnamespace('impacta') IS NOT NULL THEN
        RAISE EXCEPTION 'Já existe o schema impacta. Verifique se uma execução anterior deixou objectos parciais.';
    END IF;
    IF to_regclass('public.impacta_schema_migrations') IS NOT NULL THEN
        EXECUTE 'SELECT EXISTS (SELECT 1 FROM public.impacta_schema_migrations)'
            INTO has_applied_migrations;
        IF has_applied_migrations THEN
            RAISE EXCEPTION 'Esta base já tem migrations. Continue com npm run migrate.';
        END IF;
    END IF;
END;
$pgadmin_preflight$;
CREATE TABLE IF NOT EXISTS public.impacta_schema_migrations (
    version VARCHAR(120) PRIMARY KEY,
    checksum CHAR(64) NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
REVOKE ALL ON TABLE public.impacta_schema_migrations FROM PUBLIC;

-- Migration: 001_initial.sql
-- IMPACTA: esquema inicial versionado.
-- PostgreSQL 14+.

CREATE SCHEMA impacta AUTHORIZATION CURRENT_USER;
REVOKE ALL ON SCHEMA impacta FROM PUBLIC;

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA impacta;
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA impacta;

SET search_path = impacta, public;

CREATE FUNCTION touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;

-- Instituições. Código ISO 3166-1 alfa-2 permite expansão fora de Angola.
CREATE TABLE institutions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_code    CHAR(2) NOT NULL CHECK (country_code ~ '^[A-Z]{2}$'),
    name            VARCHAR(255) NOT NULL CHECK (length(btrim(name)) BETWEEN 2 AND 255),
    slug            CITEXT NOT NULL CHECK (length(btrim(slug::TEXT)) BETWEEN 2 AND 120),
    acronym         CITEXT NOT NULL CHECK (length(btrim(acronym::TEXT)) BETWEEN 1 AND 30),
    city            VARCHAR(120),
    region          VARCHAR(120),
    category        VARCHAR(30) NOT NULL DEFAULT 'university'
                    CHECK (category IN ('university','polytechnic','institute','high_school','other')),
    website_url     TEXT,
    logo_media_id   UUID,
    is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_institutions_country_slug UNIQUE (country_code, slug),
    CONSTRAINT uq_institutions_country_acronym UNIQUE (country_code, acronym)
);

CREATE TRIGGER institutions_touch_updated_at
BEFORE UPDATE ON institutions
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE INDEX institutions_active_country_idx ON institutions(country_code, name) WHERE is_active;
CREATE INDEX institutions_name_trgm_idx ON institutions USING GIN (name gin_trgm_ops);

-- Contas. O perfil académico não dá privilégios administrativos.
CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    handle              CITEXT NOT NULL UNIQUE,
    display_name        VARCHAR(150) NOT NULL CHECK (length(btrim(display_name)) BETWEEN 1 AND 150),
    account_type        VARCHAR(20) NOT NULL DEFAULT 'student'
                        CHECK (account_type IN ('student','professor','creator')),
    institution_id      UUID REFERENCES institutions(id) ON DELETE SET NULL,
    academic_major      VARCHAR(200),
    academic_year       VARCHAR(60),
    graduation_year     SMALLINT CHECK (graduation_year BETWEEN 1950 AND 2150),
    country_code        CHAR(2) CHECK (country_code IS NULL OR country_code ~ '^[A-Z]{2}$'),
    city                VARCHAR(120),
    bio                 VARCHAR(500),
    website_url         TEXT,
    preferred_language  VARCHAR(10) NOT NULL DEFAULT 'pt-AO'
                        CHECK (preferred_language IN ('pt-AO','en','fr','zh','es')),
    profile_visibility  VARCHAR(10) NOT NULL DEFAULT 'public'
                        CHECK (profile_visibility IN ('public','private')),
    status              VARCHAR(24) NOT NULL DEFAULT 'pending_verification'
                        CHECK (status IN ('pending_verification','active','suspended','disabled','deleted')),
    suspended_until     TIMESTAMPTZ,
    deleted_at          TIMESTAMPTZ,
    last_seen_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_users_handle_format CHECK (handle ~ '^[a-z0-9._]{3,30}$'),
    CONSTRAINT ck_users_deleted_timestamp CHECK ((status = 'deleted') = (deleted_at IS NOT NULL))
);

CREATE TRIGGER users_touch_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE INDEX users_institution_idx ON users(institution_id);
CREATE INDEX users_active_created_idx ON users(created_at DESC, id DESC)
    WHERE status = 'active' AND deleted_at IS NULL;
CREATE INDEX users_display_name_trgm_idx ON users USING GIN (display_name gin_trgm_ops);

-- Credenciais são isoladas do perfil e não são legíveis pelo papel normal da API.
CREATE TABLE user_credentials (
    user_id                 UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    email                   CITEXT NOT NULL UNIQUE,
    password_hash           TEXT NOT NULL CHECK (
                                length(password_hash) BETWEEN 20 AND 512
                                AND password_hash LIKE '$argon2id$%'
                            ),
    email_verified_at       TIMESTAMPTZ,
    password_changed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER user_credentials_touch_updated_at
BEFORE UPDATE ON user_credentials
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE INDEX user_credentials_verified_idx ON user_credentials(user_id)
    WHERE email_verified_at IS NOT NULL;

CREATE FUNCTION enforce_verified_email_activation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, impacta
AS $$
BEGIN
    IF NEW.status = 'active' AND OLD.status <> 'active'
       AND NOT EXISTS (
           SELECT 1 FROM impacta.user_credentials c
           WHERE c.user_id = NEW.id
             AND c.email_verified_at IS NOT NULL
       ) THEN
        RAISE EXCEPTION 'An active account requires a verified email' USING ERRCODE = '23514';
    END IF;
    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION enforce_verified_email_activation() FROM PUBLIC;
CREATE TRIGGER users_require_verified_email
BEFORE UPDATE OF status ON users
FOR EACH ROW EXECUTE FUNCTION enforce_verified_email_activation();

-- Apenas os papéis privilegiados são atribuídos nesta tabela.
-- A ausência de registo significa utilizador comum.
CREATE TABLE privileged_role_assignments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    role            VARCHAR(20) NOT NULL CHECK (role IN ('moderator','admin')),
    granted_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    granted_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    revoked_at      TIMESTAMPTZ,
    reason          VARCHAR(500),
    CONSTRAINT ck_role_revocation CHECK ((revoked_at IS NULL) = (revoked_by IS NULL))
);

CREATE UNIQUE INDEX privileged_role_one_active_idx
    ON privileged_role_assignments(user_id, role) WHERE revoked_at IS NULL;
CREATE INDEX privileged_role_granted_by_idx ON privileged_role_assignments(granted_by);

-- Tokens de utilização única; guardar apenas o SHA-256, nunca o token original.
CREATE TABLE auth_tokens (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    purpose         VARCHAR(30) NOT NULL
                    CHECK (purpose IN ('email_verification','password_reset','login_challenge')),
    token_hash      BYTEA NOT NULL UNIQUE CHECK (octet_length(token_hash) = 32),
    expires_at      TIMESTAMPTZ NOT NULL,
    used_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    request_ip      INET,
    CONSTRAINT ck_auth_token_expiry CHECK (expires_at > created_at)
);

CREATE INDEX auth_tokens_user_purpose_idx ON auth_tokens(user_id, purpose, expires_at);
CREATE INDEX auth_tokens_expiry_idx ON auth_tokens(expires_at);

-- Sessões por dispositivo. O refresh token é armazenado como hash.
CREATE TABLE user_sessions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash  BYTEA NOT NULL UNIQUE CHECK (octet_length(refresh_token_hash) = 32),
    rotated_from_id     UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
    ip_address          INET,
    user_agent          VARCHAR(1000),
    device_name         VARCHAR(120),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at        TIMESTAMPTZ,
    expires_at          TIMESTAMPTZ NOT NULL,
    revoked_at          TIMESTAMPTZ,
    CONSTRAINT ck_session_expiry CHECK (expires_at > created_at)
);

CREATE INDEX user_sessions_user_active_idx ON user_sessions(user_id, expires_at) WHERE revoked_at IS NULL;
CREATE INDEX user_sessions_expiry_idx ON user_sessions(expires_at);

-- Ficheiros ficam em armazenamento privado. A BD guarda a chave, nunca URL pública.
CREATE TABLE media_assets (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uploaded_by         UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    storage_provider    VARCHAR(20) NOT NULL DEFAULT 'local'
                        CHECK (storage_provider IN ('local','s3','r2')),
    storage_key         TEXT NOT NULL UNIQUE CHECK (length(storage_key) BETWEEN 1 AND 1024),
    original_filename   VARCHAR(255),
    mime_type           VARCHAR(120) NOT NULL,
    size_bytes          BIGINT NOT NULL CHECK (size_bytes BETWEEN 1 AND 1073741824),
    sha256              BYTEA CHECK (sha256 IS NULL OR octet_length(sha256) = 32),
    status              VARCHAR(16) NOT NULL DEFAULT 'quarantined'
                        CHECK (status IN ('quarantined','ready','rejected','deleted')),
    requested_scope     VARCHAR(12) NOT NULL DEFAULT 'private'
                        CHECK (requested_scope IN ('private','public','conversation','post','community')),
    access_scope        VARCHAR(12) NOT NULL DEFAULT 'private'
                        CHECK (access_scope IN ('private','public','conversation','post','community')),
    scanned_at          TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ,
    CONSTRAINT ck_media_deleted_timestamp CHECK ((status = 'deleted') = (deleted_at IS NOT NULL))
);

CREATE INDEX media_assets_owner_idx ON media_assets(uploaded_by, created_at DESC);
CREATE INDEX media_assets_scan_idx ON media_assets(status, created_at) WHERE status = 'quarantined';
CREATE INDEX media_assets_public_idx ON media_assets(id) WHERE status = 'ready' AND access_scope = 'public';

ALTER TABLE users
    ADD COLUMN avatar_media_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
    ADD COLUMN cover_media_id UUID REFERENCES media_assets(id) ON DELETE SET NULL;

ALTER TABLE institutions
    ADD CONSTRAINT fk_institutions_logo_media
    FOREIGN KEY (logo_media_id) REFERENCES media_assets(id) ON DELETE SET NULL;

-- Preferências privadas separadas dos dados públicos do perfil.
CREATE TABLE user_preferences (
    user_id                 UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    email_notifications     BOOLEAN NOT NULL DEFAULT TRUE,
    push_notifications      BOOLEAN NOT NULL DEFAULT TRUE,
    show_social_links       BOOLEAN NOT NULL DEFAULT FALSE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER user_preferences_touch_updated_at
BEFORE UPDATE ON user_preferences
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TABLE user_social_links (
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform    VARCHAR(20) NOT NULL CHECK (platform IN ('linkedin','github','instagram','website')),
    url         TEXT NOT NULL CHECK (length(url) BETWEEN 1 AND 2048),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, platform)
);

CREATE TRIGGER user_social_links_touch_updated_at
BEFORE UPDATE ON user_social_links
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TABLE user_blocks (
    blocker_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blocked_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (blocker_id, blocked_id),
    CONSTRAINT ck_users_cannot_block_self CHECK (blocker_id <> blocked_id)
);

CREATE INDEX user_blocks_blocked_idx ON user_blocks(blocked_id);

-- Verificação académica é privada e separada do perfil público.
CREATE TABLE institution_verification_requests (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    institution_id      UUID NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
    account_type        VARCHAR(20) NOT NULL CHECK (account_type IN ('student','professor')),
    evidence_media_id   UUID REFERENCES media_assets(id) ON DELETE RESTRICT,
    status              VARCHAR(16) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','approved','rejected','withdrawn')),
    submitted_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_by         UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at         TIMESTAMPTZ,
    review_note         VARCHAR(1000),
    CONSTRAINT ck_verification_review CHECK (
        (status IN ('approved','rejected') AND reviewed_at IS NOT NULL)
        OR (status IN ('pending','withdrawn') AND reviewed_at IS NULL)
    )
);

CREATE UNIQUE INDEX verification_one_pending_per_user_idx
    ON institution_verification_requests(user_id) WHERE status = 'pending';
CREATE INDEX verification_queue_idx
    ON institution_verification_requests(submitted_at, id) WHERE status = 'pending';
CREATE INDEX verification_institution_idx ON institution_verification_requests(institution_id);

-- Comunidades académicas.
CREATE TABLE communities (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(180) NOT NULL CHECK (length(btrim(name)) BETWEEN 2 AND 180),
    slug            CITEXT NOT NULL UNIQUE CHECK (length(btrim(slug::TEXT)) BETWEEN 2 AND 120),
    description     VARCHAR(2000),
    institution_id  UUID REFERENCES institutions(id) ON DELETE SET NULL,
    created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    category        VARCHAR(30) NOT NULL DEFAULT 'academic'
                    CHECK (category IN ('academic','faculty','subject','study_group','social','other')),
    visibility      VARCHAR(10) NOT NULL DEFAULT 'public'
                    CHECK (visibility IN ('public','private')),
    status          VARCHAR(16) NOT NULL DEFAULT 'active'
                    CHECK (status IN ('pending','active','suspended','deleted')),
    is_official     BOOLEAN NOT NULL DEFAULT FALSE,
    icon_emoji      VARCHAR(16),
    banner_media_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    CONSTRAINT ck_community_deleted_timestamp CHECK ((status = 'deleted') = (deleted_at IS NOT NULL))
);

CREATE TRIGGER communities_touch_updated_at
BEFORE UPDATE ON communities
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE INDEX communities_active_category_idx ON communities(category, created_at DESC)
    WHERE status = 'active';
CREATE INDEX communities_institution_idx ON communities(institution_id) WHERE status = 'active';
CREATE INDEX communities_name_trgm_idx ON communities USING GIN (name gin_trgm_ops);

CREATE TABLE community_memberships (
    community_id    UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    role            VARCHAR(16) NOT NULL DEFAULT 'member'
                    CHECK (role IN ('owner','moderator','member')),
    status          VARCHAR(12) NOT NULL DEFAULT 'active'
                    CHECK (status IN ('pending','active','left','banned')),
    invited_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    left_at         TIMESTAMPTZ,
    notifications   BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (community_id, user_id),
    CONSTRAINT ck_membership_left_timestamp CHECK (
        (status = 'left' AND left_at IS NOT NULL) OR (status <> 'left' AND left_at IS NULL)
    )
);

CREATE INDEX community_memberships_user_idx ON community_memberships(user_id, status);
CREATE INDEX community_memberships_active_idx ON community_memberships(community_id, joined_at)
    WHERE status = 'active';

-- Publicações. Métricas são calculadas a partir das tabelas de relações;
-- não se guardam contadores redundantes sujeitos a divergência.
CREATE TABLE posts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id       UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    community_id    UUID REFERENCES communities(id) ON DELETE SET NULL,
    post_type       VARCHAR(20) NOT NULL DEFAULT 'standard'
                    CHECK (post_type IN ('standard','question','reel','resource','audio_note','poll')),
    content         TEXT,
    subject_area    VARCHAR(100),
    language        VARCHAR(10) NOT NULL DEFAULT 'pt-AO'
                    CHECK (language IN ('pt-AO','en','fr','zh','es')),
    visibility      VARCHAR(12) NOT NULL DEFAULT 'public'
                    CHECK (visibility IN ('public','community','followers','private')),
    status          VARCHAR(12) NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft','published','hidden','deleted')),
    is_pinned       BOOLEAN NOT NULL DEFAULT FALSE,
    search_vector   TSVECTOR,
    published_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    CONSTRAINT ck_post_content_nonempty CHECK (content IS NULL OR length(btrim(content)) BETWEEN 1 AND 10000),
    CONSTRAINT ck_community_visibility CHECK (visibility <> 'community' OR community_id IS NOT NULL),
    CONSTRAINT ck_published_post_timestamp CHECK (status <> 'published' OR published_at IS NOT NULL),
    CONSTRAINT ck_post_deleted_timestamp CHECK ((status = 'deleted') = (deleted_at IS NOT NULL))
);

CREATE TRIGGER posts_touch_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE FUNCTION maintain_post_timestamps()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        NEW.published_at := NULL;
        NEW.deleted_at := NULL;
    ELSE
        IF NEW.status = 'published' AND OLD.status <> 'published' THEN
            NEW.published_at := CURRENT_TIMESTAMP;
        END IF;
        IF NEW.status = 'deleted' AND OLD.status <> 'deleted' THEN
            NEW.deleted_at := CURRENT_TIMESTAMP;
        ELSIF NEW.status <> 'deleted' THEN
            NEW.deleted_at := NULL;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER posts_lifecycle_timestamps
BEFORE INSERT OR UPDATE OF status ON posts
FOR EACH ROW EXECUTE FUNCTION maintain_post_timestamps();

CREATE FUNCTION update_post_search_vector()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.search_vector := to_tsvector(
        'simple'::regconfig,
        concat_ws(' ', COALESCE(NEW.content, ''), COALESCE(NEW.subject_area, ''))
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER posts_search_vector
BEFORE INSERT OR UPDATE OF content, subject_area ON posts
FOR EACH ROW EXECUTE FUNCTION update_post_search_vector();

CREATE INDEX posts_public_feed_idx ON posts(published_at DESC, id DESC)
    WHERE status = 'published' AND visibility = 'public' AND deleted_at IS NULL;
CREATE INDEX posts_author_feed_idx ON posts(author_id, published_at DESC, id DESC)
    WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX posts_community_feed_idx ON posts(community_id, published_at DESC, id DESC)
    WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX posts_subject_feed_idx ON posts(subject_area, published_at DESC, id DESC)
    WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX posts_search_vector_idx ON posts USING GIN (search_vector);
CREATE INDEX posts_content_trgm_idx ON posts USING GIN (content gin_trgm_ops);

CREATE TABLE post_media (
    post_id         UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    media_asset_id  UUID NOT NULL REFERENCES media_assets(id) ON DELETE RESTRICT,
    sort_order      SMALLINT NOT NULL DEFAULT 0 CHECK (sort_order BETWEEN 0 AND 100),
    alt_text        VARCHAR(500),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (post_id, media_asset_id),
    CONSTRAINT uq_post_media_order UNIQUE (post_id, sort_order)
);

CREATE INDEX post_media_asset_idx ON post_media(media_asset_id);

CREATE TABLE hashtags (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag         CITEXT NOT NULL UNIQUE CHECK (
                    length(tag::TEXT) BETWEEN 1 AND 64
                    AND tag::TEXT !~ '[[:space:]#]'
                ),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX hashtags_tag_trgm_idx ON hashtags USING GIN ((tag::TEXT) gin_trgm_ops);

CREATE TABLE post_hashtags (
    post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    hashtag_id  UUID NOT NULL REFERENCES hashtags(id) ON DELETE RESTRICT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (post_id, hashtag_id)
);

CREATE INDEX post_hashtags_hashtag_idx ON post_hashtags(hashtag_id, post_id);

CREATE TABLE post_likes (
    post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (post_id, user_id)
);

CREATE INDEX post_likes_user_idx ON post_likes(user_id, created_at DESC);

CREATE TABLE comments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id             UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id           UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    parent_comment_id   UUID,
    content             VARCHAR(3000) NOT NULL CHECK (length(btrim(content)) BETWEEN 1 AND 3000),
    status              VARCHAR(12) NOT NULL DEFAULT 'published'
                        CHECK (status IN ('published','hidden','deleted')),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ,
    CONSTRAINT uq_comments_post_id_id UNIQUE (post_id, id),
    CONSTRAINT fk_comments_parent_same_post
        FOREIGN KEY (post_id, parent_comment_id)
        REFERENCES comments(post_id, id) ON DELETE CASCADE,
    CONSTRAINT ck_comment_deleted_timestamp CHECK ((status = 'deleted') = (deleted_at IS NOT NULL))
);

CREATE TRIGGER comments_touch_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE FUNCTION maintain_comment_deleted_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.status = 'deleted' THEN
            NEW.deleted_at := CURRENT_TIMESTAMP;
        END IF;
    ELSIF NEW.status = 'deleted' AND OLD.status <> 'deleted' THEN
        NEW.deleted_at := CURRENT_TIMESTAMP;
    ELSIF NEW.status <> 'deleted' THEN
        NEW.deleted_at := NULL;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER comments_lifecycle_timestamp
BEFORE INSERT OR UPDATE OF status ON comments
FOR EACH ROW EXECUTE FUNCTION maintain_comment_deleted_at();

CREATE INDEX comments_post_order_idx ON comments(post_id, created_at, id)
    WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX comments_author_idx ON comments(author_id, created_at DESC);
CREATE INDEX comments_parent_idx ON comments(parent_comment_id) WHERE parent_comment_id IS NOT NULL;

CREATE TABLE comment_likes (
    comment_id  UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (comment_id, user_id)
);

CREATE INDEX comment_likes_user_idx ON comment_likes(user_id, created_at DESC);

CREATE TABLE bookmarks (
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    folder_name VARCHAR(100) NOT NULL DEFAULT 'Geral'
                CHECK (length(btrim(folder_name)) BETWEEN 1 AND 100),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, post_id)
);

CREATE INDEX bookmarks_folder_idx ON bookmarks(user_id, folder_name, created_at DESC);

CREATE TABLE follows (
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    followed_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (follower_id, followed_id),
    CONSTRAINT ck_follows_no_self CHECK (follower_id <> followed_id)
);

CREATE INDEX follows_followed_idx ON follows(followed_id, created_at DESC);

-- Conversas e mensagens. A leitura é mantida por participante, não por mensagem,
-- para que grupos tenham estados de leitura coerentes.
CREATE TABLE conversations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kind        VARCHAR(10) NOT NULL DEFAULT 'direct' CHECK (kind IN ('direct','group')),
    title       VARCHAR(150),
    created_by  UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at  TIMESTAMPTZ
);

CREATE TRIGGER conversations_touch_updated_at
BEFORE UPDATE ON conversations
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE FUNCTION maintain_conversation_deleted_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.deleted_at IS DISTINCT FROM OLD.deleted_at AND NEW.deleted_at IS NOT NULL THEN
        NEW.deleted_at := CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER conversations_lifecycle_timestamp
BEFORE UPDATE OF deleted_at ON conversations
FOR EACH ROW EXECUTE FUNCTION maintain_conversation_deleted_at();

CREATE TABLE conversation_participants (
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    role            VARCHAR(10) NOT NULL DEFAULT 'member' CHECK (role IN ('admin','member')),
    joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    left_at         TIMESTAMPTZ,
    last_read_at    TIMESTAMPTZ,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE INDEX conversation_participants_user_idx
    ON conversation_participants(user_id, conversation_id) WHERE left_at IS NULL;

CREATE TABLE messages (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id     UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id           UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    body                VARCHAR(10000),
    attachment_asset_id UUID REFERENCES media_assets(id) ON DELETE RESTRICT,
    reply_to_message_id UUID,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    edited_at           TIMESTAMPTZ,
    deleted_at          TIMESTAMPTZ,
    CONSTRAINT uq_messages_conversation_id_id UNIQUE (conversation_id, id),
    CONSTRAINT fk_message_reply_same_conversation
        FOREIGN KEY (conversation_id, reply_to_message_id)
        REFERENCES messages(conversation_id, id),
    CONSTRAINT ck_message_content CHECK (
        (body IS NOT NULL AND length(btrim(body)) BETWEEN 1 AND 10000)
        OR attachment_asset_id IS NOT NULL
    )
);

CREATE INDEX messages_conversation_order_idx ON messages(conversation_id, created_at DESC, id DESC)
    WHERE deleted_at IS NULL;
CREATE INDEX messages_sender_idx ON messages(sender_id, created_at DESC);

CREATE FUNCTION maintain_message_timestamps()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.body IS DISTINCT FROM OLD.body THEN
        NEW.edited_at := CURRENT_TIMESTAMP;
    END IF;
    IF NEW.deleted_at IS DISTINCT FROM OLD.deleted_at AND NEW.deleted_at IS NOT NULL THEN
        NEW.deleted_at := CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER messages_lifecycle_timestamps
BEFORE UPDATE OF body, deleted_at ON messages
FOR EACH ROW EXECUTE FUNCTION maintain_message_timestamps();

-- Notificações contêm dados, não HTML para renderização directa.
CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    actor_id        UUID REFERENCES users(id) ON DELETE SET NULL,
    type            VARCHAR(30) NOT NULL CHECK (
                        type IN ('like','comment','follow','mention','community_invite',
                                 'post_shared','new_message','system','achievement','report_update')
                    ),
    entity_type     VARCHAR(20) CHECK (entity_type IN ('post','comment','user','community','message')),
    entity_id       UUID,
    payload         JSONB NOT NULL DEFAULT '{}'::JSONB CHECK (jsonb_typeof(payload) = 'object'),
    read_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX notifications_user_feed_idx ON notifications(user_id, created_at DESC, id DESC);
CREATE INDEX notifications_user_unread_idx ON notifications(user_id, created_at DESC)
    WHERE read_at IS NULL;

-- Denúncias usam FKs tipadas em vez de um ID polimórfico sem integridade.
CREATE TABLE reports (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    post_id             UUID REFERENCES posts(id) ON DELETE RESTRICT,
    comment_id          UUID REFERENCES comments(id) ON DELETE RESTRICT,
    reported_user_id    UUID REFERENCES users(id) ON DELETE RESTRICT,
    community_id        UUID REFERENCES communities(id) ON DELETE RESTRICT,
    reason              VARCHAR(30) NOT NULL CHECK (
                            reason IN ('spam','harassment','misinformation','inappropriate',
                                       'copyright','hate_speech','impersonation','other')
                        ),
    description         VARCHAR(2000),
    status              VARCHAR(16) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','in_review','resolved','dismissed')),
    assigned_to         UUID REFERENCES users(id) ON DELETE SET NULL,
    resolution_note     VARCHAR(2000),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at         TIMESTAMPTZ,
    CONSTRAINT ck_report_exactly_one_target CHECK (
        num_nonnulls(post_id, comment_id, reported_user_id, community_id) = 1
    ),
    CONSTRAINT ck_report_not_self CHECK (reported_user_id IS NULL OR reporter_id IS NULL OR reported_user_id <> reporter_id),
    CONSTRAINT ck_report_reviewed_timestamp CHECK (
        (status IN ('resolved','dismissed') AND reviewed_at IS NOT NULL)
        OR (status IN ('pending','in_review') AND reviewed_at IS NULL)
    )
);

CREATE INDEX reports_queue_idx ON reports(status, created_at, id)
    WHERE status IN ('pending','in_review');
CREATE INDEX reports_reporter_idx ON reports(reporter_id, created_at DESC);
CREATE INDEX reports_assignee_idx ON reports(assigned_to, status) WHERE assigned_to IS NOT NULL;
CREATE UNIQUE INDEX reports_pending_post_once_idx
    ON reports(reporter_id, post_id) WHERE post_id IS NOT NULL AND status IN ('pending','in_review');
CREATE UNIQUE INDEX reports_pending_comment_once_idx
    ON reports(reporter_id, comment_id) WHERE comment_id IS NOT NULL AND status IN ('pending','in_review');
CREATE UNIQUE INDEX reports_pending_user_once_idx
    ON reports(reporter_id, reported_user_id) WHERE reported_user_id IS NOT NULL AND status IN ('pending','in_review');
CREATE UNIQUE INDEX reports_pending_community_once_idx
    ON reports(reporter_id, community_id) WHERE community_id IS NOT NULL AND status IN ('pending','in_review');

-- Auditoria de moderação e administração. Deve ser append-only para a aplicação.
CREATE TABLE administrative_audit_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id   UUID REFERENCES users(id) ON DELETE SET NULL,
    action          VARCHAR(60) NOT NULL CHECK (length(btrim(action)) BETWEEN 1 AND 60),
    target_type     VARCHAR(24) NOT NULL CHECK (
                        target_type IN ('user','post','comment','community','report','institution','role')
                    ),
    target_id       UUID,
    reason          VARCHAR(1000),
    before_state    JSONB CHECK (before_state IS NULL OR jsonb_typeof(before_state) = 'object'),
    after_state     JSONB CHECK (after_state IS NULL OR jsonb_typeof(after_state) = 'object'),
    request_id      VARCHAR(100),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX admin_audit_actor_idx ON administrative_audit_log(actor_user_id, created_at DESC);
CREATE INDEX admin_audit_target_idx ON administrative_audit_log(target_type, target_id, created_at DESC);

-- Sondagens associadas a publicações do tipo poll.
CREATE TABLE polls (
    post_id             UUID PRIMARY KEY REFERENCES posts(id) ON DELETE CASCADE,
    question            VARCHAR(500) NOT NULL CHECK (length(btrim(question)) BETWEEN 1 AND 500),
    allow_multiple      BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at          TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE poll_options (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id     UUID NOT NULL REFERENCES polls(post_id) ON DELETE CASCADE,
    label       VARCHAR(200) NOT NULL CHECK (length(btrim(label)) BETWEEN 1 AND 200),
    sort_order  SMALLINT NOT NULL CHECK (sort_order BETWEEN 0 AND 20),
    UNIQUE (poll_id, id),
    UNIQUE (poll_id, sort_order)
);

CREATE TABLE poll_votes (
    poll_id     UUID NOT NULL REFERENCES polls(post_id) ON DELETE CASCADE,
    option_id   UUID NOT NULL,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (poll_id, user_id, option_id),
    FOREIGN KEY (poll_id, option_id) REFERENCES poll_options(poll_id, id) ON DELETE CASCADE
);

CREATE INDEX poll_votes_option_idx ON poll_votes(poll_id, option_id);
CREATE INDEX poll_votes_user_idx ON poll_votes(user_id, created_at DESC);

CREATE FUNCTION validate_poll_vote()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, impacta
AS $$
DECLARE
    multiple_allowed BOOLEAN;
    poll_expiry TIMESTAMPTZ;
    post_status VARCHAR(12);
BEGIN
    PERFORM pg_advisory_xact_lock(
        hashtextextended(NEW.poll_id::TEXT || ':' || NEW.user_id::TEXT, 0)
    );

    SELECT p.allow_multiple, p.expires_at, po.status
    INTO multiple_allowed, poll_expiry, post_status
    FROM impacta.polls p
    JOIN impacta.posts po ON po.id = p.post_id
    WHERE p.post_id = NEW.poll_id;

    IF NOT FOUND OR post_status <> 'published' THEN
        RAISE EXCEPTION 'Poll does not accept votes' USING ERRCODE = '23514';
    END IF;
    IF poll_expiry IS NOT NULL AND poll_expiry <= CURRENT_TIMESTAMP THEN
        RAISE EXCEPTION 'Poll has expired' USING ERRCODE = '23514';
    END IF;
    IF NOT multiple_allowed AND EXISTS (
        SELECT 1
        FROM impacta.poll_votes v
        WHERE v.poll_id = NEW.poll_id
          AND v.user_id = NEW.user_id
          AND v.option_id <> NEW.option_id
    ) THEN
        RAISE EXCEPTION 'Only one option is allowed for this poll' USING ERRCODE = '23505';
    END IF;
    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION validate_poll_vote() FROM PUBLIC;
CREATE TRIGGER poll_votes_validate
BEFORE INSERT ON poll_votes
FOR EACH ROW EXECUTE FUNCTION validate_poll_vote();

CREATE FUNCTION validate_published_poll()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    option_count BIGINT;
BEGIN
    IF NEW.status = 'published' AND NEW.post_type = 'poll' THEN
        IF NOT EXISTS (SELECT 1 FROM impacta.polls p WHERE p.post_id = NEW.id) THEN
            RAISE EXCEPTION 'A poll post requires a poll definition' USING ERRCODE = '23514';
        END IF;
        SELECT COUNT(*) INTO option_count
        FROM impacta.poll_options o
        WHERE o.poll_id = NEW.id;
        IF option_count < 2 THEN
            RAISE EXCEPTION 'A poll requires at least two options' USING ERRCODE = '23514';
        END IF;
    ELSIF NEW.post_type <> 'poll'
          AND EXISTS (SELECT 1 FROM impacta.polls p WHERE p.post_id = NEW.id) THEN
        RAISE EXCEPTION 'A post with a poll definition must keep poll type' USING ERRCODE = '23514';
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER posts_validate_poll
BEFORE UPDATE OF status, post_type ON impacta.posts
FOR EACH ROW EXECUTE FUNCTION validate_published_poll();

-- Contexto do utilizador autenticado, definido apenas dentro de uma transacção.
-- O papel de runtime não é proprietário das tabelas e fica sujeito a RLS.
CREATE FUNCTION current_request_user_id()
RETURNS UUID
LANGUAGE sql
STABLE
SET search_path = pg_catalog
AS $$
    SELECT NULLIF(current_setting('impacta.user_id', TRUE), '')::UUID
$$;

CREATE FUNCTION has_privileged_role(required_role VARCHAR)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, impacta
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM impacta.privileged_role_assignments r
        JOIN impacta.users u ON u.id = r.user_id
        WHERE r.user_id = impacta.current_request_user_id()
          AND r.role = required_role
          AND r.revoked_at IS NULL
          AND u.status = 'active'
    )
$$;

CREATE FUNCTION is_active_conversation_participant(target_conversation_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, impacta
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM impacta.conversation_participants cp
        JOIN impacta.users u ON u.id = cp.user_id
        JOIN impacta.conversations c ON c.id = cp.conversation_id AND c.deleted_at IS NULL
        WHERE cp.conversation_id = target_conversation_id
          AND cp.user_id = impacta.current_request_user_id()
          AND cp.left_at IS NULL
          AND u.status = 'active'
    )
$$;

CREATE FUNCTION is_conversation_manager(target_conversation_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, impacta
AS $$
    SELECT EXISTS (
        SELECT 1 FROM impacta.users u
        WHERE u.id = impacta.current_request_user_id()
          AND u.status = 'active'
    ) AND (EXISTS (
        SELECT 1
        FROM impacta.conversations c
        WHERE c.id = target_conversation_id
          AND c.created_by = impacta.current_request_user_id()
          AND c.deleted_at IS NULL
    ) OR EXISTS (
        SELECT 1
        FROM impacta.conversation_participants cp
        JOIN impacta.users u ON u.id = cp.user_id
        JOIN impacta.conversations c ON c.id = cp.conversation_id AND c.deleted_at IS NULL
        WHERE cp.conversation_id = target_conversation_id
          AND cp.user_id = impacta.current_request_user_id()
          AND cp.role = 'admin'
          AND cp.left_at IS NULL
          AND u.status = 'active'
    ))
$$;

CREATE FUNCTION enforce_conversation_participant_transition()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, impacta
AS $$
BEGIN
    IF NEW.left_at IS DISTINCT FROM OLD.left_at
       AND NOT impacta.is_conversation_manager(OLD.conversation_id) THEN
        IF OLD.user_id = impacta.current_request_user_id()
           AND OLD.left_at IS NULL
           AND NEW.left_at IS NOT NULL THEN
            NEW.left_at := CURRENT_TIMESTAMP;
        ELSE
            RAISE EXCEPTION 'Only a conversation manager can change participant status' USING ERRCODE = '42501';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

CREATE FUNCTION is_active_community_member(target_community_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, impacta
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM impacta.community_memberships cm
        JOIN impacta.users u ON u.id = cm.user_id
        WHERE cm.community_id = target_community_id
          AND cm.user_id = impacta.current_request_user_id()
          AND cm.status = 'active'
          AND u.status = 'active'
    )
$$;

CREATE FUNCTION is_community_manager(target_community_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, impacta
AS $$
    SELECT EXISTS (
        SELECT 1 FROM impacta.users u
        WHERE u.id = impacta.current_request_user_id()
          AND u.status = 'active'
    ) AND (EXISTS (
        SELECT 1
        FROM impacta.communities c
        WHERE c.id = target_community_id
          AND c.created_by = impacta.current_request_user_id()
    ) OR EXISTS (
        SELECT 1
        FROM impacta.community_memberships cm
        WHERE cm.community_id = target_community_id
          AND cm.user_id = impacta.current_request_user_id()
          AND cm.role IN ('owner','moderator')
          AND cm.status = 'active'
    ) OR impacta.has_privileged_role('admin'))
$$;

CREATE FUNCTION can_view_post(target_post_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, impacta
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM impacta.posts p
        WHERE p.id = target_post_id
          AND (
              p.author_id = impacta.current_request_user_id()
              OR (
                  p.status = 'published'
                  AND p.deleted_at IS NULL
                  AND (
                      p.visibility = 'public'
                      OR (
                          p.visibility = 'followers'
                          AND EXISTS (
                              SELECT 1 FROM impacta.follows f
                              WHERE f.follower_id = impacta.current_request_user_id()
                                AND f.followed_id = p.author_id
                          )
                      )
                      OR (
                          p.visibility = 'community'
                          AND impacta.is_active_community_member(p.community_id)
                      )
                  )
              )
              OR impacta.has_privileged_role('moderator')
              OR impacta.has_privileged_role('admin')
          )
    )
$$;

CREATE FUNCTION can_follow_user(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, impacta
AS $$
    SELECT EXISTS (
        SELECT 1 FROM impacta.users u
        WHERE u.id = target_user_id
          AND u.status = 'active'
          AND u.profile_visibility = 'public'
    )
$$;

CREATE FUNCTION can_view_community(target_community_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, impacta
AS $$
    SELECT EXISTS (
        SELECT 1 FROM impacta.communities c
        WHERE c.id = target_community_id
          AND c.status = 'active'
          AND (
              c.visibility = 'public'
              OR impacta.is_active_community_member(c.id)
              OR impacta.is_community_manager(c.id)
              OR impacta.has_privileged_role('moderator')
          )
    )
$$;

CREATE FUNCTION get_media_storage_key(target_asset_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, impacta
AS $$
    SELECT m.storage_key
    FROM impacta.media_assets m
    WHERE m.id = target_asset_id
      AND m.status = 'ready'
      AND (
          m.uploaded_by = impacta.current_request_user_id()
          OR m.access_scope = 'public'
          OR (
              m.access_scope = 'conversation'
              AND EXISTS (
                  SELECT 1 FROM impacta.messages msg
                  WHERE msg.attachment_asset_id = m.id
                    AND impacta.is_active_conversation_participant(msg.conversation_id)
              )
          )
          OR (
              m.access_scope = 'post'
              AND EXISTS (
                  SELECT 1 FROM impacta.post_media pm
                  JOIN impacta.posts p ON p.id = pm.post_id
                  WHERE pm.media_asset_id = m.id
                    AND impacta.can_view_post(p.id)
              )
          )
          OR (
              m.access_scope = 'community'
              AND EXISTS (
                  SELECT 1 FROM impacta.communities c
                  WHERE c.banner_media_id = m.id
                    AND impacta.can_view_community(c.id)
              )
          )
          OR (
              m.access_scope = 'private'
              AND (impacta.has_privileged_role('moderator') OR impacta.has_privileged_role('admin'))
              AND EXISTS (
                  SELECT 1 FROM impacta.institution_verification_requests vr
                  WHERE vr.evidence_media_id = m.id
              )
          )
      )
$$;

CREATE FUNCTION get_poll_results(target_poll_id UUID)
RETURNS TABLE(option_id UUID, label VARCHAR(200), vote_count BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, impacta
AS $$
    SELECT o.id, o.label, COUNT(v.user_id)
    FROM impacta.poll_options o
    JOIN impacta.polls pl ON pl.post_id = o.poll_id
    JOIN impacta.posts p ON p.id = pl.post_id
    LEFT JOIN impacta.poll_votes v
      ON v.poll_id = o.poll_id AND v.option_id = o.id
    WHERE o.poll_id = target_poll_id
      AND impacta.can_view_post(p.id)
    GROUP BY o.id, o.label, o.sort_order
    ORDER BY o.sort_order, o.id
$$;

CREATE FUNCTION enforce_community_membership_transition()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, impacta
AS $$
DECLARE
    manager_allowed BOOLEAN;
BEGIN
    manager_allowed := impacta.is_community_manager(OLD.community_id);

    IF NEW.role IS DISTINCT FROM OLD.role AND NOT manager_allowed THEN
        RAISE EXCEPTION 'Membership roles require a manager action' USING ERRCODE = '42501';
    END IF;
    IF NEW.status IS DISTINCT FROM OLD.status AND NOT manager_allowed
       AND NOT (
           OLD.user_id = impacta.current_request_user_id()
           AND OLD.status = 'pending' AND NEW.status = 'active' AND NEW.left_at IS NULL
       ) AND NOT (
           OLD.user_id = impacta.current_request_user_id()
           AND OLD.status = 'active' AND NEW.status = 'left'
       ) AND NOT (
           OLD.user_id = impacta.current_request_user_id()
           AND OLD.status = 'left' AND NEW.status = 'active'
           AND NEW.role = 'member' AND NEW.left_at IS NULL
           AND EXISTS (
               SELECT 1 FROM impacta.communities c
               WHERE c.id = OLD.community_id
                 AND c.status = 'active' AND c.visibility = 'public'
           )
       ) THEN
        RAISE EXCEPTION 'Invalid membership status transition' USING ERRCODE = '42501';
    END IF;
    IF NEW.left_at IS DISTINCT FROM OLD.left_at AND NOT manager_allowed THEN
        IF OLD.user_id = impacta.current_request_user_id()
           AND OLD.status = 'active' AND NEW.status = 'left'
           AND NEW.left_at IS NOT NULL THEN
            NEW.left_at := CURRENT_TIMESTAMP;
        ELSIF OLD.user_id = impacta.current_request_user_id()
              AND OLD.status = 'left' AND NEW.status = 'active'
              AND NEW.left_at IS NULL AND NEW.role = 'member' THEN
            NULL;
        ELSE
            RAISE EXCEPTION 'Only a community manager can change membership leave time' USING ERRCODE = '42501';
        END IF;
    ELSIF OLD.status = 'active' AND NEW.status = 'left' AND NOT manager_allowed THEN
        NEW.left_at := CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION current_request_user_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION has_privileged_role(VARCHAR) FROM PUBLIC;
REVOKE ALL ON FUNCTION is_active_conversation_participant(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION is_conversation_manager(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION enforce_conversation_participant_transition() FROM PUBLIC;
REVOKE ALL ON FUNCTION is_active_community_member(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION is_community_manager(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION can_view_post(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION can_follow_user(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION can_view_community(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION get_media_storage_key(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION get_poll_results(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION enforce_community_membership_transition() FROM PUBLIC;

CREATE TRIGGER community_membership_transition_guard
BEFORE UPDATE OF role, status, left_at ON community_memberships
FOR EACH ROW EXECUTE FUNCTION enforce_community_membership_transition();
CREATE TRIGGER conversation_participant_transition_guard
BEFORE UPDATE OF left_at ON conversation_participants
FOR EACH ROW EXECUTE FUNCTION enforce_conversation_participant_transition();

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_read_self_public_or_admin ON users
    FOR SELECT TO impacta_app
    USING (
        id = current_request_user_id()
        OR (status = 'active' AND profile_visibility = 'public')
        OR has_privileged_role('admin')
    );
CREATE POLICY users_edit_self ON users
    FOR UPDATE TO impacta_app
    USING (id = current_request_user_id())
    WITH CHECK (
        id = current_request_user_id()
        AND (avatar_media_id IS NULL OR EXISTS (
            SELECT 1 FROM media_assets m
            WHERE m.id = avatar_media_id
              AND m.uploaded_by = current_request_user_id()
              AND m.status = 'ready'
              AND m.access_scope = 'public'
        ))
        AND (cover_media_id IS NULL OR EXISTS (
            SELECT 1 FROM media_assets m
            WHERE m.id = cover_media_id
              AND m.uploaded_by = current_request_user_id()
              AND m.status = 'ready'
              AND m.access_scope = 'public'
        ))
    );
CREATE POLICY users_auth_read_status ON users
    FOR SELECT TO impacta_auth
    USING (TRUE);
CREATE POLICY users_auth_create_pending ON users
    FOR INSERT TO impacta_auth
    WITH CHECK (status = 'pending_verification');
CREATE POLICY users_auth_update_status ON users
    FOR UPDATE TO impacta_auth
    USING (TRUE)
    WITH CHECK (TRUE);

ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY institutions_active_lookup ON institutions
    FOR SELECT TO impacta_app
    USING (is_active OR has_privileged_role('admin'));

ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY media_ready_or_authorized_read ON media_assets
    FOR SELECT TO impacta_app
    USING (
        uploaded_by = current_request_user_id()
        OR (status = 'ready' AND access_scope = 'public')
        OR (
            status = 'ready'
            AND access_scope = 'conversation'
            AND EXISTS (
                SELECT 1 FROM messages m
                WHERE m.attachment_asset_id = media_assets.id
                  AND is_active_conversation_participant(m.conversation_id)
            )
        )
        OR (
            status = 'ready'
            AND access_scope = 'post'
            AND EXISTS (
                SELECT 1 FROM post_media pm
                JOIN posts p ON p.id = pm.post_id
                WHERE pm.media_asset_id = media_assets.id
                  AND can_view_post(p.id)
            )
        )
        OR (
            status = 'ready'
            AND access_scope = 'community'
            AND EXISTS (
                SELECT 1 FROM communities c
                WHERE c.banner_media_id = media_assets.id
                  AND can_view_community(c.id)
            )
        )
        OR (
            access_scope = 'private'
            AND (has_privileged_role('moderator') OR has_privileged_role('admin'))
            AND EXISTS (
                SELECT 1 FROM institution_verification_requests vr
                WHERE vr.evidence_media_id = media_assets.id
            )
        )
    );
CREATE POLICY media_owner_upload_quarantine ON media_assets
    FOR INSERT TO impacta_app
    WITH CHECK (
        uploaded_by = current_request_user_id()
        AND status = 'quarantined'
        AND access_scope = 'private'
    );
CREATE POLICY media_scanner_read_quarantine ON media_assets
    FOR SELECT TO impacta_media
    USING (status = 'quarantined');
CREATE POLICY media_scanner_finish_scan ON media_assets
    FOR UPDATE TO impacta_media
    USING (status = 'quarantined')
    WITH CHECK (
        scanned_at IS NOT NULL
        AND deleted_at IS NULL
        AND (
            (status = 'ready' AND access_scope = requested_scope)
            OR (status = 'rejected' AND access_scope = 'private')
        )
    );

ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
CREATE POLICY communities_visible_to_member_or_public ON communities
    FOR SELECT TO impacta_app
    USING (
        (status = 'active' AND (visibility = 'public' OR is_active_community_member(id)))
        OR created_by = current_request_user_id()
        OR is_community_manager(id)
        OR has_privileged_role('moderator')
        OR has_privileged_role('admin')
    );
CREATE POLICY communities_create_by_owner ON communities
    FOR INSERT TO impacta_app
    WITH CHECK (
        created_by = current_request_user_id()
        AND status = 'active'
        AND is_official = FALSE
        AND (banner_media_id IS NULL OR EXISTS (
            SELECT 1 FROM media_assets m
            WHERE m.id = banner_media_id
              AND m.uploaded_by = current_request_user_id()
              AND m.status = 'ready'
              AND m.access_scope = 'community'
        ))
    );
CREATE POLICY communities_update_manager ON communities
    FOR UPDATE TO impacta_app
    USING (is_community_manager(id) OR has_privileged_role('moderator'))
    WITH CHECK (
        (is_community_manager(id) OR has_privileged_role('moderator'))
        AND (banner_media_id IS NULL OR EXISTS (
            SELECT 1 FROM media_assets m
            WHERE m.id = banner_media_id
              AND m.uploaded_by = current_request_user_id()
              AND m.status = 'ready'
              AND m.access_scope = 'community'
        ))
    );
CREATE POLICY communities_delete_manager ON communities
    FOR DELETE TO impacta_app
    USING (is_community_manager(id) OR has_privileged_role('moderator'));

ALTER TABLE community_memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY community_memberships_read_related ON community_memberships
    FOR SELECT TO impacta_app
    USING (
        user_id = current_request_user_id()
        OR is_active_community_member(community_id)
        OR is_community_manager(community_id)
    );
CREATE POLICY community_memberships_join_public ON community_memberships
    FOR INSERT TO impacta_app
    WITH CHECK (
        user_id = current_request_user_id()
        AND role = 'member'
        AND status = 'active'
        AND invited_by IS NULL
        AND EXISTS (
            SELECT 1 FROM communities c
            WHERE c.id = community_id
              AND c.status = 'active'
              AND c.visibility = 'public'
        )
    );
CREATE POLICY community_memberships_add_owner ON community_memberships
    FOR INSERT TO impacta_app
    WITH CHECK (
        user_id = current_request_user_id()
        AND role = 'owner'
        AND status = 'active'
        AND invited_by IS NULL
        AND EXISTS (
            SELECT 1 FROM communities c
            WHERE c.id = community_id
              AND c.created_by = current_request_user_id()
        )
    );
CREATE POLICY community_memberships_invite_manager ON community_memberships
    FOR INSERT TO impacta_app
    WITH CHECK (
        role IN ('member','moderator')
        AND status IN ('pending','active')
        AND invited_by = current_request_user_id()
        AND is_community_manager(community_id)
    );
CREATE POLICY community_memberships_change_notifications ON community_memberships
    FOR UPDATE TO impacta_app
    USING (user_id = current_request_user_id())
    WITH CHECK (user_id = current_request_user_id());
CREATE POLICY community_memberships_remove_self_or_manager ON community_memberships
    FOR DELETE TO impacta_app
    USING (is_community_manager(community_id));

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY posts_read_by_visibility ON posts
    FOR SELECT TO impacta_app
    USING (
        author_id = current_request_user_id()
        OR (
            status = 'published'
            AND deleted_at IS NULL
            AND (
                visibility = 'public'
                OR (
                    visibility = 'followers'
                    AND EXISTS (
                        SELECT 1 FROM follows f
                        WHERE f.follower_id = current_request_user_id()
                          AND f.followed_id = author_id
                    )
                )
                OR (visibility = 'community' AND is_active_community_member(community_id))
            )
        )
        OR has_privileged_role('moderator')
        OR has_privileged_role('admin')
    );
CREATE POLICY posts_create_as_self ON posts
    FOR INSERT TO impacta_app
    WITH CHECK (
        author_id = current_request_user_id()
        AND status = 'draft'
        AND is_pinned = FALSE
        AND (community_id IS NULL OR is_active_community_member(community_id))
    );
CREATE POLICY posts_edit_self_or_moderator ON posts
    FOR UPDATE TO impacta_app
    USING (author_id = current_request_user_id() OR has_privileged_role('moderator') OR has_privileged_role('admin'))
    WITH CHECK (author_id = current_request_user_id() OR has_privileged_role('moderator') OR has_privileged_role('admin'));
CREATE POLICY posts_delete_self_or_moderator ON posts
    FOR DELETE TO impacta_app
    USING (author_id = current_request_user_id() OR has_privileged_role('moderator') OR has_privileged_role('admin'));

ALTER TABLE post_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY post_media_read_visible_post ON post_media
    FOR SELECT TO impacta_app
    USING (EXISTS (SELECT 1 FROM posts p WHERE p.id = post_id));
CREATE POLICY post_media_add_to_own_post ON post_media
    FOR INSERT TO impacta_app
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM posts p
            WHERE p.id = post_id
              AND p.author_id = current_request_user_id()
              AND EXISTS (
                  SELECT 1 FROM media_assets m
                  WHERE m.id = media_asset_id
                    AND m.uploaded_by = current_request_user_id()
                    AND m.status = 'ready'
                    AND (
                        m.access_scope = 'post'
                        OR (m.access_scope = 'public' AND p.visibility = 'public')
                    )
              )
        )
    );
CREATE POLICY post_media_remove_from_own_post ON post_media
    FOR DELETE TO impacta_app
    USING (EXISTS (SELECT 1 FROM posts p WHERE p.id = post_id AND p.author_id = current_request_user_id()));

ALTER TABLE post_hashtags ENABLE ROW LEVEL SECURITY;
CREATE POLICY post_hashtags_read_visible_post ON post_hashtags
    FOR SELECT TO impacta_app
    USING (EXISTS (SELECT 1 FROM posts p WHERE p.id = post_id));
CREATE POLICY post_hashtags_edit_own_post ON post_hashtags
    FOR ALL TO impacta_app
    USING (EXISTS (SELECT 1 FROM posts p WHERE p.id = post_id AND p.author_id = current_request_user_id()))
    WITH CHECK (EXISTS (SELECT 1 FROM posts p WHERE p.id = post_id AND p.author_id = current_request_user_id()));

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY post_likes_read_visible_post ON post_likes
    FOR SELECT TO impacta_app
    USING (EXISTS (SELECT 1 FROM posts p WHERE p.id = post_id));
CREATE POLICY post_likes_create_self ON post_likes
    FOR INSERT TO impacta_app
    WITH CHECK (user_id = current_request_user_id() AND EXISTS (SELECT 1 FROM posts p WHERE p.id = post_id));
CREATE POLICY post_likes_remove_self ON post_likes
    FOR DELETE TO impacta_app
    USING (user_id = current_request_user_id());

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY follows_read_social_graph ON follows
    FOR SELECT TO impacta_app
    USING (
        follower_id = current_request_user_id()
        OR followed_id = current_request_user_id()
        OR (can_follow_user(follower_id) AND can_follow_user(followed_id))
    );
CREATE POLICY follows_create_as_self ON follows
    FOR INSERT TO impacta_app
    WITH CHECK (
        follower_id = current_request_user_id()
        AND can_follow_user(followed_id)
    );
CREATE POLICY follows_remove_as_follower ON follows
    FOR DELETE TO impacta_app
    USING (follower_id = current_request_user_id());

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY comments_read_visible_post ON comments
    FOR SELECT TO impacta_app
    USING (
        (status = 'published' AND deleted_at IS NULL AND EXISTS (SELECT 1 FROM posts p WHERE p.id = post_id))
        OR author_id = current_request_user_id()
        OR has_privileged_role('moderator')
        OR has_privileged_role('admin')
    );
CREATE POLICY comments_create_self ON comments
    FOR INSERT TO impacta_app
    WITH CHECK (
        author_id = current_request_user_id()
        AND EXISTS (SELECT 1 FROM posts p WHERE p.id = post_id AND p.status = 'published')
    );
CREATE POLICY comments_edit_self_or_moderator ON comments
    FOR UPDATE TO impacta_app
    USING (author_id = current_request_user_id() OR has_privileged_role('moderator') OR has_privileged_role('admin'))
    WITH CHECK (author_id = current_request_user_id() OR has_privileged_role('moderator') OR has_privileged_role('admin'));
CREATE POLICY comments_delete_self_or_moderator ON comments
    FOR DELETE TO impacta_app
    USING (author_id = current_request_user_id() OR has_privileged_role('moderator') OR has_privileged_role('admin'));

ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY comment_likes_read_visible_comment ON comment_likes
    FOR SELECT TO impacta_app
    USING (EXISTS (SELECT 1 FROM comments c WHERE c.id = comment_id));
CREATE POLICY comment_likes_create_self ON comment_likes
    FOR INSERT TO impacta_app
    WITH CHECK (user_id = current_request_user_id() AND EXISTS (SELECT 1 FROM comments c WHERE c.id = comment_id));
CREATE POLICY comment_likes_remove_self ON comment_likes
    FOR DELETE TO impacta_app
    USING (user_id = current_request_user_id());

ALTER TABLE hashtags ENABLE ROW LEVEL SECURITY;
CREATE POLICY hashtags_read ON hashtags
    FOR SELECT TO impacta_app
    USING (TRUE);
CREATE POLICY hashtags_create ON hashtags
    FOR INSERT TO impacta_app
    WITH CHECK (EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = current_request_user_id()
          AND u.status = 'active'
    ));

ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
CREATE POLICY polls_read_visible_post ON polls
    FOR SELECT TO impacta_app
    USING (EXISTS (SELECT 1 FROM posts p WHERE p.id = post_id));
CREATE POLICY polls_create_or_edit_draft ON polls
    FOR INSERT TO impacta_app
    WITH CHECK (
        EXISTS (SELECT 1 FROM posts p WHERE p.id = post_id AND p.author_id = current_request_user_id() AND p.status = 'draft' AND p.post_type = 'poll')
    );
CREATE POLICY polls_update_draft ON polls
    FOR UPDATE TO impacta_app
    USING (EXISTS (SELECT 1 FROM posts p WHERE p.id = post_id AND p.author_id = current_request_user_id() AND p.status = 'draft' AND p.post_type = 'poll'))
    WITH CHECK (EXISTS (SELECT 1 FROM posts p WHERE p.id = post_id AND p.author_id = current_request_user_id() AND p.status = 'draft' AND p.post_type = 'poll'));
CREATE POLICY polls_delete_draft ON polls
    FOR DELETE TO impacta_app
    USING (EXISTS (SELECT 1 FROM posts p WHERE p.id = post_id AND p.author_id = current_request_user_id() AND p.status = 'draft' AND p.post_type = 'poll'));

ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY poll_options_read_visible_post ON poll_options
    FOR SELECT TO impacta_app
    USING (EXISTS (SELECT 1 FROM polls p WHERE p.post_id = poll_id));
CREATE POLICY poll_options_manage_draft ON poll_options
    FOR ALL TO impacta_app
    USING (EXISTS (
        SELECT 1 FROM posts p
        WHERE p.id = poll_id AND p.author_id = current_request_user_id() AND p.status = 'draft' AND p.post_type = 'poll'
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM posts p
        WHERE p.id = poll_id AND p.author_id = current_request_user_id() AND p.status = 'draft' AND p.post_type = 'poll'
    ));

ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY poll_votes_read_visible_post ON poll_votes
    FOR SELECT TO impacta_app
    USING (
        user_id = current_request_user_id()
        OR has_privileged_role('moderator')
        OR has_privileged_role('admin')
    );
CREATE POLICY poll_votes_create_self ON poll_votes
    FOR INSERT TO impacta_app
    WITH CHECK (
        user_id = current_request_user_id()
        AND EXISTS (SELECT 1 FROM posts p WHERE p.id = poll_id AND p.status = 'published')
    );
CREATE POLICY poll_votes_remove_self ON poll_votes
    FOR DELETE TO impacta_app
    USING (user_id = current_request_user_id());

-- Dados privados de cada utilizador.
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_preferences_owner ON user_preferences
    FOR ALL TO impacta_app
    USING (user_id = current_request_user_id())
    WITH CHECK (user_id = current_request_user_id());

ALTER TABLE user_social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_social_links_owner ON user_social_links
    FOR ALL TO impacta_app
    USING (user_id = current_request_user_id())
    WITH CHECK (user_id = current_request_user_id());

ALTER TABLE user_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_blocks_owner ON user_blocks
    FOR ALL TO impacta_app
    USING (blocker_id = current_request_user_id())
    WITH CHECK (blocker_id = current_request_user_id());

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY bookmarks_owner ON bookmarks
    FOR ALL TO impacta_app
    USING (user_id = current_request_user_id())
    WITH CHECK (user_id = current_request_user_id());

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY notifications_owner ON notifications
    FOR ALL TO impacta_app
    USING (user_id = current_request_user_id())
    WITH CHECK (user_id = current_request_user_id());

-- Conversas, participantes e mensagens só são visíveis aos membros da conversa.
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY conversations_read_members ON conversations
    FOR SELECT TO impacta_app
    USING (
        deleted_at IS NULL
        AND (
            created_by = current_request_user_id()
            OR is_active_conversation_participant(id)
        )
    );
CREATE POLICY conversations_create_owner ON conversations
    FOR INSERT TO impacta_app
    WITH CHECK (created_by = current_request_user_id());
CREATE POLICY conversations_manage_members ON conversations
    FOR UPDATE TO impacta_app
    USING (is_conversation_manager(id))
    WITH CHECK (is_conversation_manager(id));
CREATE POLICY conversations_delete_manager ON conversations
    FOR DELETE TO impacta_app
    USING (is_conversation_manager(id));

ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY conversation_participants_read_members ON conversation_participants
    FOR SELECT TO impacta_app
    USING (
        EXISTS (
            SELECT 1 FROM conversations c
            WHERE c.id = conversation_id
              AND c.deleted_at IS NULL
              AND (user_id = current_request_user_id() OR is_active_conversation_participant(conversation_id))
        )
    );
CREATE POLICY conversation_participants_add_manager ON conversation_participants
    FOR INSERT TO impacta_app
    WITH CHECK (is_conversation_manager(conversation_id) AND left_at IS NULL);
CREATE POLICY conversation_participants_update_self_or_manager ON conversation_participants
    FOR UPDATE TO impacta_app
    USING (
        user_id = current_request_user_id()
        OR is_conversation_manager(conversation_id)
    )
    WITH CHECK (
        user_id = current_request_user_id()
        OR is_conversation_manager(conversation_id)
    );
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY messages_read_members ON messages
    FOR SELECT TO impacta_app
    USING (is_active_conversation_participant(conversation_id));
CREATE POLICY messages_send_as_self ON messages
    FOR INSERT TO impacta_app
    WITH CHECK (
        sender_id = current_request_user_id()
        AND is_active_conversation_participant(conversation_id)
        AND (attachment_asset_id IS NULL OR EXISTS (
            SELECT 1 FROM media_assets m
            WHERE m.id = attachment_asset_id
              AND m.uploaded_by = current_request_user_id()
              AND m.status = 'ready'
              AND m.access_scope = 'conversation'
        ))
    );
CREATE POLICY messages_edit_own ON messages
    FOR UPDATE TO impacta_app
    USING (
        sender_id = current_request_user_id()
        AND is_active_conversation_participant(conversation_id)
    )
    WITH CHECK (
        sender_id = current_request_user_id()
        AND is_active_conversation_participant(conversation_id)
    );
CREATE POLICY messages_delete_own ON messages
    FOR DELETE TO impacta_app
    USING (
        sender_id = current_request_user_id()
        AND is_active_conversation_participant(conversation_id)
    );

-- O acesso aos dados de moderação depende sempre de um papel consultado na BD.
ALTER TABLE privileged_role_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY privileged_roles_read_self_or_admin ON privileged_role_assignments
    FOR SELECT TO impacta_app
    USING (
        user_id = current_request_user_id()
        OR has_privileged_role('admin')
    );

ALTER TABLE institution_verification_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY verification_read_owner_or_moderator ON institution_verification_requests
    FOR SELECT TO impacta_app
    USING (
        user_id = current_request_user_id()
        OR has_privileged_role('moderator')
        OR has_privileged_role('admin')
    );
CREATE POLICY verification_submit_self ON institution_verification_requests
    FOR INSERT TO impacta_app
    WITH CHECK (
        user_id = current_request_user_id()
        AND status = 'pending'
        AND reviewed_by IS NULL
        AND reviewed_at IS NULL
        AND (evidence_media_id IS NULL OR EXISTS (
            SELECT 1 FROM media_assets m
            WHERE m.id = evidence_media_id
              AND m.uploaded_by = current_request_user_id()
              AND m.status = 'ready'
              AND m.access_scope = 'private'
        ))
    );
CREATE POLICY verification_review_privileged ON institution_verification_requests
    FOR UPDATE TO impacta_app
    USING (has_privileged_role('moderator') OR has_privileged_role('admin'))
    WITH CHECK (has_privileged_role('moderator') OR has_privileged_role('admin'));

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY reports_read_reporter_or_moderator ON reports
    FOR SELECT TO impacta_app
    USING (
        reporter_id = current_request_user_id()
        OR has_privileged_role('moderator')
        OR has_privileged_role('admin')
    );
CREATE POLICY reports_create_self ON reports
    FOR INSERT TO impacta_app
    WITH CHECK (
        reporter_id = current_request_user_id()
        AND status = 'pending'
        AND assigned_to IS NULL
        AND reviewed_at IS NULL
        AND resolution_note IS NULL
    );
CREATE POLICY reports_review_privileged ON reports
    FOR UPDATE TO impacta_app
    USING (has_privileged_role('moderator') OR has_privileged_role('admin'))
    WITH CHECK (has_privileged_role('moderator') OR has_privileged_role('admin'));

ALTER TABLE administrative_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_read_privileged ON administrative_audit_log
    FOR SELECT TO impacta_app
    USING (has_privileged_role('moderator') OR has_privileged_role('admin'));
CREATE POLICY audit_append_self ON administrative_audit_log
    FOR INSERT TO impacta_app
    WITH CHECK (actor_user_id = current_request_user_id());

COMMENT ON SCHEMA impacta IS 'Dados da plataforma Impacta. O utilizador da aplicação não deve ser proprietário deste esquema.';
COMMENT ON TABLE users IS 'Contas e perfil público. Não guardar palavra-passe em texto simples nem matrícula pública.';
COMMENT ON TABLE auth_tokens IS 'Tokens de verificação e recuperação guardados como hash SHA-256 de utilização única.';
COMMENT ON TABLE user_sessions IS 'Sessões revogáveis por dispositivo; refresh tokens guardados como hash.';
COMMENT ON TABLE media_assets IS 'Metadados e chave privada de ficheiros; validar conteúdo antes de marcar como ready.';
COMMENT ON TABLE privileged_role_assignments IS 'Atribuições históricas de moderador e administrador, nunca escolhidas no registo.';
COMMENT ON TABLE administrative_audit_log IS 'Histórico append-only de acções administrativas e de moderação.';

INSERT INTO public.impacta_schema_migrations (version, checksum) VALUES ('001_initial.sql', 'd4446aa44c63fdf5a545b45790af1b8db2fa6fc740b697fa155859fa67037558');

-- Migration: 002_admin_profile_and_location.sql
-- Perfil público verificado e localização para expansão internacional.
-- Aplicado depois de 001_initial.sql; não alterar migrations já aplicadas.

ALTER TABLE impacta.users
    ADD COLUMN province VARCHAR(120),
    ADD COLUMN municipality VARCHAR(120),
    ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX users_verified_active_idx
    ON impacta.users(created_at DESC, id DESC)
    WHERE is_verified AND status = 'active' AND deleted_at IS NULL;

COMMENT ON COLUMN impacta.users.province IS 'Província ou região indicada no perfil, sem obrigar a divulgação pública.';
COMMENT ON COLUMN impacta.users.municipality IS 'Município indicado no perfil, sem obrigar a divulgação pública.';
COMMENT ON COLUMN impacta.users.is_verified IS 'Selo de conta confirmado pela Impacta; nunca pode ser alterado pelo utilizador comum.';

INSERT INTO public.impacta_schema_migrations (version, checksum) VALUES ('002_admin_profile_and_location.sql', 'dc967088447641a8ffb8ba1d9c01d1d15b21c4363198c1d62453890d2bdfce6e');

-- Ficheiro: grant-runtime.sql
-- Executar como impacta_migrator depois de npm run migrate.
-- Repetir depois de cada nova migracao; privilegios novos nunca sao automaticos.

DO $$
BEGIN
    EXECUTE format('REVOKE CONNECT, TEMPORARY ON DATABASE %I FROM PUBLIC', current_database());
    EXECUTE format(
        'GRANT CONNECT ON DATABASE %I TO impacta_migrator, impacta_app, impacta_auth, impacta_media',
        current_database()
    );
END;
$$;

REVOKE ALL ON SCHEMA impacta FROM PUBLIC, impacta_app, impacta_auth, impacta_media;
GRANT USAGE ON SCHEMA impacta TO impacta_app, impacta_auth, impacta_media;

REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA impacta
    FROM PUBLIC, impacta_app, impacta_auth, impacta_media;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA impacta
    FROM PUBLIC, impacta_app, impacta_auth, impacta_media;
REVOKE ALL ON FUNCTION impacta.current_request_user_id(),
    impacta.has_privileged_role(VARCHAR),
    impacta.is_active_conversation_participant(UUID),
    impacta.is_conversation_manager(UUID),
    impacta.is_active_community_member(UUID),
    impacta.is_community_manager(UUID),
    impacta.can_follow_user(UUID),
    impacta.can_view_community(UUID),
    impacta.can_view_post(UUID),
    impacta.get_media_storage_key(UUID),
    impacta.get_poll_results(UUID)
FROM impacta_auth, impacta_media;

-- API normal: o RLS limita as linhas e as escritas ficam restritas por coluna.
GRANT SELECT ON
    impacta.institutions,
    impacta.privileged_role_assignments,
    impacta.user_preferences,
    impacta.user_social_links,
    impacta.user_blocks,
    impacta.institution_verification_requests,
    impacta.communities,
    impacta.community_memberships,
    impacta.posts,
    impacta.post_media,
    impacta.hashtags,
    impacta.post_hashtags,
    impacta.post_likes,
    impacta.comments,
    impacta.comment_likes,
    impacta.bookmarks,
    impacta.follows,
    impacta.conversations,
    impacta.conversation_participants,
    impacta.messages,
    impacta.notifications,
    impacta.reports,
    impacta.administrative_audit_log,
    impacta.polls,
    impacta.poll_options,
    impacta.poll_votes
TO impacta_app;

GRANT SELECT (
    id, handle, display_name, account_type, institution_id, academic_major,
    academic_year, graduation_year, country_code, province, municipality, city, bio, website_url,
    preferred_language, profile_visibility, avatar_media_id, cover_media_id, is_verified, created_at
) ON impacta.users TO impacta_app;
GRANT SELECT (
    id, uploaded_by, storage_provider, original_filename, mime_type, size_bytes,
    sha256, status, requested_scope, access_scope, scanned_at, created_at, deleted_at
) ON impacta.media_assets TO impacta_app;

GRANT UPDATE (
    handle, display_name, account_type, institution_id, academic_major,
    academic_year, graduation_year, country_code, province, municipality, city, bio, website_url,
    preferred_language, profile_visibility, avatar_media_id, cover_media_id
) ON impacta.users TO impacta_app;

GRANT INSERT (user_id, email_notifications, push_notifications, show_social_links)
    ON impacta.user_preferences TO impacta_app;
GRANT UPDATE (email_notifications, push_notifications, show_social_links)
    ON impacta.user_preferences TO impacta_app;
GRANT INSERT (user_id, platform, url) ON impacta.user_social_links TO impacta_app;
GRANT UPDATE (url) ON impacta.user_social_links TO impacta_app;
GRANT DELETE ON impacta.user_social_links TO impacta_app;
GRANT INSERT (blocker_id, blocked_id) ON impacta.user_blocks TO impacta_app;
GRANT DELETE ON impacta.user_blocks TO impacta_app;

GRANT INSERT (user_id, institution_id, account_type, evidence_media_id)
    ON impacta.institution_verification_requests TO impacta_app;
GRANT UPDATE (status, reviewed_by, reviewed_at, review_note)
    ON impacta.institution_verification_requests TO impacta_app;

GRANT INSERT (name, slug, description, institution_id, created_by, category, visibility,
              icon_emoji, banner_media_id)
    ON impacta.communities TO impacta_app;
GRANT UPDATE (name, description, category, visibility, icon_emoji, banner_media_id)
    ON impacta.communities TO impacta_app;
GRANT INSERT (community_id, user_id, role, status, invited_by, notifications)
    ON impacta.community_memberships TO impacta_app;
GRANT UPDATE (notifications, status, left_at)
    ON impacta.community_memberships TO impacta_app;

GRANT INSERT (author_id, community_id, post_type, content, subject_area, language, visibility, status)
    ON impacta.posts TO impacta_app;
GRANT UPDATE (community_id, post_type, content, subject_area, language, visibility, status)
    ON impacta.posts TO impacta_app;
GRANT INSERT (post_id, media_asset_id, sort_order, alt_text) ON impacta.post_media TO impacta_app;
GRANT DELETE ON impacta.post_media TO impacta_app;
GRANT INSERT (tag) ON impacta.hashtags TO impacta_app;
GRANT INSERT (post_id, hashtag_id) ON impacta.post_hashtags TO impacta_app;
GRANT DELETE ON impacta.post_hashtags TO impacta_app;
GRANT INSERT (post_id, user_id) ON impacta.post_likes TO impacta_app;
GRANT DELETE ON impacta.post_likes TO impacta_app;
GRANT INSERT (post_id, author_id, parent_comment_id, content) ON impacta.comments TO impacta_app;
GRANT UPDATE (content, status) ON impacta.comments TO impacta_app;
GRANT INSERT (comment_id, user_id) ON impacta.comment_likes TO impacta_app;
GRANT DELETE ON impacta.comment_likes TO impacta_app;
GRANT INSERT (user_id, post_id, folder_name) ON impacta.bookmarks TO impacta_app;
GRANT UPDATE (folder_name) ON impacta.bookmarks TO impacta_app;
GRANT DELETE ON impacta.bookmarks TO impacta_app;
GRANT INSERT (follower_id, followed_id) ON impacta.follows TO impacta_app;
GRANT DELETE ON impacta.follows TO impacta_app;

GRANT INSERT (kind, title, created_by) ON impacta.conversations TO impacta_app;
GRANT UPDATE (title, deleted_at) ON impacta.conversations TO impacta_app;
GRANT INSERT (conversation_id, user_id, role) ON impacta.conversation_participants TO impacta_app;
GRANT UPDATE (last_read_at, left_at) ON impacta.conversation_participants TO impacta_app;
GRANT INSERT (conversation_id, sender_id, body, attachment_asset_id, reply_to_message_id)
    ON impacta.messages TO impacta_app;
GRANT UPDATE (body, deleted_at) ON impacta.messages TO impacta_app;
GRANT UPDATE (read_at) ON impacta.notifications TO impacta_app;

GRANT INSERT (reporter_id, post_id, comment_id, reported_user_id, community_id, reason, description)
    ON impacta.reports TO impacta_app;
GRANT UPDATE (status, assigned_to, resolution_note, reviewed_at)
    ON impacta.reports TO impacta_app;
GRANT INSERT (actor_user_id, action, target_type, target_id, reason,
              before_state, after_state, request_id)
    ON impacta.administrative_audit_log TO impacta_app;

GRANT INSERT (post_id, question, allow_multiple, expires_at) ON impacta.polls TO impacta_app;
GRANT UPDATE (question, allow_multiple, expires_at) ON impacta.polls TO impacta_app;
GRANT DELETE ON impacta.polls TO impacta_app;
GRANT INSERT (poll_id, label, sort_order) ON impacta.poll_options TO impacta_app;
GRANT UPDATE (label, sort_order) ON impacta.poll_options TO impacta_app;
GRANT DELETE ON impacta.poll_options TO impacta_app;
GRANT INSERT (poll_id, option_id, user_id) ON impacta.poll_votes TO impacta_app;

GRANT INSERT (uploaded_by, storage_provider, storage_key, original_filename, mime_type,
              size_bytes, sha256, requested_scope)
    ON impacta.media_assets TO impacta_app;

-- Funcoes de autorizacao e resultados agregados. Sem EXECUTE publico.
GRANT EXECUTE ON FUNCTION impacta.current_request_user_id() TO impacta_app;
GRANT EXECUTE ON FUNCTION impacta.has_privileged_role(VARCHAR) TO impacta_app;
GRANT EXECUTE ON FUNCTION impacta.is_active_conversation_participant(UUID) TO impacta_app;
GRANT EXECUTE ON FUNCTION impacta.is_conversation_manager(UUID) TO impacta_app;
GRANT EXECUTE ON FUNCTION impacta.is_active_community_member(UUID) TO impacta_app;
GRANT EXECUTE ON FUNCTION impacta.is_community_manager(UUID) TO impacta_app;
GRANT EXECUTE ON FUNCTION impacta.can_follow_user(UUID) TO impacta_app;
GRANT EXECUTE ON FUNCTION impacta.can_view_community(UUID) TO impacta_app;
GRANT EXECUTE ON FUNCTION impacta.can_view_post(UUID) TO impacta_app;
GRANT EXECUTE ON FUNCTION impacta.get_media_storage_key(UUID) TO impacta_app;
GRANT EXECUTE ON FUNCTION impacta.get_poll_results(UUID) TO impacta_app;

-- Autenticacao: credenciais e tokens so existem neste pool.
GRANT SELECT (id, status, suspended_until, deleted_at) ON impacta.users TO impacta_auth;
GRANT INSERT (handle, display_name, account_type, institution_id, academic_major,
              academic_year, graduation_year, country_code, province, municipality, city, bio, website_url,
              preferred_language, profile_visibility)
    ON impacta.users TO impacta_auth;
GRANT UPDATE (status, suspended_until, deleted_at) ON impacta.users TO impacta_auth;
GRANT SELECT, DELETE
    ON impacta.user_credentials, impacta.auth_tokens, impacta.user_sessions
    TO impacta_auth;
GRANT INSERT (user_id, email, password_hash) ON impacta.user_credentials TO impacta_auth;
GRANT UPDATE (email, password_hash, email_verified_at, password_changed_at)
    ON impacta.user_credentials TO impacta_auth;
GRANT INSERT (user_id, purpose, token_hash, expires_at, request_ip)
    ON impacta.auth_tokens TO impacta_auth;
GRANT UPDATE (used_at) ON impacta.auth_tokens TO impacta_auth;
GRANT INSERT (user_id, refresh_token_hash, rotated_from_id, ip_address,
              user_agent, device_name, expires_at)
    ON impacta.user_sessions TO impacta_auth;
GRANT UPDATE (refresh_token_hash, rotated_from_id, last_used_at, expires_at, revoked_at)
    ON impacta.user_sessions TO impacta_auth;

-- Worker de ficheiros: so ve uploads em quarentena e nao altera a chave armazenada.
GRANT SELECT (id, uploaded_by, storage_provider, storage_key, original_filename,
              mime_type, size_bytes, sha256, requested_scope, access_scope,
              scanned_at, deleted_at, status)
    ON impacta.media_assets TO impacta_media;
GRANT UPDATE (status, access_scope, scanned_at) ON impacta.media_assets TO impacta_media;


-- Ficheiro: seeds.sql
-- Dados públicos iniciais para desenvolvimento. Não cria contas ou senhas.
-- Executar apenas depois de npm run migrate.
SET search_path = impacta, public;

INSERT INTO institutions (country_code, name, slug, acronym, city, category, is_verified)
VALUES
    ('AO', 'Universidade Agostinho Neto', 'universidade-agostinho-neto', 'UAN', 'Luanda', 'university', TRUE),
    ('AO', 'Universidade Católica de Angola', 'universidade-catolica-de-angola', 'UCAN', 'Luanda', 'university', TRUE),
    ('AO', 'Instituto Superior Politécnico de Tecnologias e Ciências', 'isptec', 'ISPTEC', 'Luanda', 'polytechnic', TRUE),
    ('AO', 'Instituto Superior de Tecnologias de Informação e Comunicação', 'isutic', 'ISUTIC', 'Luanda', 'institute', TRUE),
    ('AO', 'Universidade Mandume ya Ndemufayo', 'universidade-mandume-ya-ndemufayo', 'UMN', 'Lubango', 'university', TRUE),
    ('AO', 'Universidade Katyavala Bwila', 'universidade-katyavala-bwila', 'UKB', 'Benguela', 'university', TRUE),
    ('AO', 'Universidade José Eduardo dos Santos', 'universidade-jose-eduardo-dos-santos', 'UJES', 'Huambo', 'university', TRUE),
    ('AO', 'Universidade Kimpa Vita', 'universidade-kimpa-vita', 'UNIKIVI', 'Uíge', 'university', TRUE),
    ('AO', 'Universidade Lueji A''Nkonde', 'universidade-lueji-ankonde', 'ULAN', 'Dundo', 'university', TRUE),
    ('AO', 'Instituto Médio Politécnico de Luanda', 'instituto-medio-politecnico-de-luanda', 'IMPL', 'Luanda', 'high_school', TRUE),
    ('AO', 'Instituto Médio de Economia de Luanda', 'instituto-medio-de-economia-de-luanda', 'IMEL', 'Luanda', 'high_school', TRUE)
ON CONFLICT (country_code, acronym) DO NOTHING;

INSERT INTO communities (name, slug, description, institution_id, category, visibility, is_official, status)
SELECT
    'UAN — Comunidade Geral',
    'uan-geral',
    'Espaço para estudantes, professores e investigadores da Universidade Agostinho Neto.',
    id,
    'academic',
    'public',
    TRUE,
    'active'
FROM institutions
WHERE country_code = 'AO' AND acronym = 'UAN'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO communities (name, slug, description, institution_id, category, visibility, is_official, status)
SELECT
    'ISPTEC — Engenharia & TI',
    'isptec-engenharia-ti',
    'Comunidade de Engenharia, Informática e Tecnologia do ISPTEC.',
    id,
    'faculty',
    'public',
    TRUE,
    'active'
FROM institutions
WHERE country_code = 'AO' AND acronym = 'ISPTEC'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO communities (name, slug, description, institution_id, category, visibility, is_official, status)
SELECT
    'UCAN — Direito & Ciências Sociais',
    'ucan-direito-sociais',
    'Estudantes e professores de Direito, Economia e Ciências Sociais da UCAN.',
    id,
    'faculty',
    'public',
    TRUE,
    'active'
FROM institutions
WHERE country_code = 'AO' AND acronym = 'UCAN'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO communities (name, slug, description, category, visibility, is_official, status)
VALUES
    ('Materiais de Estudo & Recursos PDF', 'materiais-estudo-recursos-pdf',
     'Partilha de materiais de estudo, resumos, exames resolvidos e outros recursos académicos.',
     'academic', 'public', FALSE, 'active'),
    ('Preparação para Exames Nacionais', 'exames-nacionais-angola',
     'Dúvidas, simulados e dicas para exames nacionais de acesso ao ensino superior.',
     'study_group', 'public', FALSE, 'active'),
    ('Programação & Desenvolvimento', 'programacao-dev-angola',
     'Espaço para aprender programação, trocar código, projectos e oportunidades.',
     'subject', 'public', FALSE, 'active'),
    ('Medicina & Saúde', 'medicina-saude-angola',
     'Estudantes e profissionais de Medicina, Enfermagem e áreas da Saúde.',
     'subject', 'public', FALSE, 'active'),
    ('Economia, Gestão & Finanças', 'economia-gestao-financas',
     'Tópicos de Economia, Gestão, Contabilidade e Finanças.',
     'subject', 'public', FALSE, 'active')
ON CONFLICT (slug) DO NOTHING;


COMMIT;
