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
