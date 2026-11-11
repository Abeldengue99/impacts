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
    ('Sebentas & Recursos PDF', 'sebentas-recursos-pdf',
     'Partilha de sebentas, resumos, exames resolvidos e recursos académicos.',
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
