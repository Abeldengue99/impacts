-- Executar como impacta_migrator depois de npm run migrate.
-- Repetir depois de cada nova migracao; privilegios novos nunca sao automaticos.

REVOKE CONNECT, TEMPORARY ON DATABASE impacta_db FROM PUBLIC;
GRANT CONNECT ON DATABASE impacta_db
    TO impacta_migrator, impacta_app, impacta_auth, impacta_media;

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
    academic_year, graduation_year, country_code, city, bio, website_url,
    preferred_language, profile_visibility, avatar_media_id, cover_media_id, created_at
) ON impacta.users TO impacta_app;
GRANT SELECT (
    id, uploaded_by, storage_provider, original_filename, mime_type, size_bytes,
    sha256, status, requested_scope, access_scope, scanned_at, created_at, deleted_at
) ON impacta.media_assets TO impacta_app;

GRANT UPDATE (
    handle, display_name, account_type, institution_id, academic_major,
    academic_year, graduation_year, country_code, city, bio, website_url,
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
              academic_year, graduation_year, country_code, city, bio, website_url,
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
