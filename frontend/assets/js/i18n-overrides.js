/* Impacta UI translations and shared language handling. */
(function () {
  'use strict';

  const copy = {
    'pt-AO': {
      auth: {
        loginEyebrow: 'A tua comunidade de aprendizagem',
        loginTitle: 'Aprende, partilha e cresce com a Impacta.',
        loginIntro: 'Encontra colegas, troca ideias e avança nos teus estudos, ao teu ritmo.',
        loginCardTitle: 'Bem-vindo de volta',
        loginCardText: 'Entra na tua conta para continuares.',
        email: 'Email',
        emailPlaceholder: 'nome@exemplo.com',
        password: 'Palavra-passe',
        passwordPlaceholder: 'Introduz a tua palavra-passe',
        showPassword: 'Mostrar palavra-passe',
        hidePassword: 'Ocultar palavra-passe',
        remember: 'Manter sessão iniciada',
        forgot: 'Esqueceste-te da palavra-passe?',
        loginButton: 'Entrar',
        noAccount: 'Ainda não tens conta?',
        createAccount: 'Criar conta',
        signupEyebrow: 'O teu próximo passo começa aqui',
        signupTitle: 'Faz parte de uma comunidade que cresce contigo.',
        signupIntro: 'Cria a tua conta para partilhares ideias, encontrares materiais e aprenderes em conjunto.',
        signupCardTitle: 'Cria a tua conta',
        signupCardText: 'Só precisas de alguns dados para começar.',
        fullName: 'Nome completo',
        fullNamePlaceholder: 'Como te chamas?',
        handle: 'Nome de utilizador',
        handlePlaceholder: 'ex.: ana.mateus',
        accountType: 'Como te identificas?',
        footerIntro: 'Um espaço para aprender, partilhar e avançar em conjunto.',
        footerHome: 'Início', footerExplore: 'Explorar', footerCommunities: 'Comunidades', footerProfile: 'Perfil',
        footerHide: 'Ocultar rodapé', footerShow: 'Mostrar rodapé', footerTagline: 'Aprender. Partilhar. Avançar.',
        address: 'Morada',
        addressPlaceholder: 'Ex.: Maianga, Luanda',
        student: 'Estudante',
        professor: 'Docente',
        creator: 'Criador de conteúdo',
        confirmPassword: 'Confirmar palavra-passe',
        passwordHint: 'Usa pelo menos 12 caracteres.',
        acceptTerms: 'Li e aceito os Termos de Utilização e a Política de Privacidade.',
        signupButton: 'Criar a minha conta',
        alreadyAccount: 'Já tens conta?',
        loginLink: 'Entrar',
        emailNotice: 'A confirmação por email será activada quando o registo estiver disponível.',
        serviceUnavailable: 'O serviço de contas ainda não está ligado. Os teus dados não foram enviados.',
        passwordMismatch: 'As palavras-passe não coincidem.',
        forgotUnavailable: 'A recuperação da conta será disponibilizada quando o serviço de autenticação estiver ligado.',
        language: 'Idioma',
        privacy: 'A tua palavra-passe é protegida. Nunca a partilharemos.',
        benefitQuestions: 'Tira dúvidas com colegas',
        benefitMaterials: 'Encontra materiais de estudo',
        benefitProgress: 'Aprende ao teu ritmo',
        tagline: 'Aprender · Partilhar · Evoluir',
        footerLine: 'Feita para aprender em comunidade.',
        metaDescription: 'Entra na Impacta para aprender, partilhar e crescer com a tua comunidade.',
        illustrationAlt: 'Uma docente, um estudante e uma criadora a aprender e partilhar conhecimento'
      },
      ui: {
        metaTitle: 'Impacta — aprender, partilhar e crescer',
        metaDescription: 'A comunidade de aprendizagem de Angola para o mundo.',
        ogTitle: 'Impacta — aprender em comunidade',
        ogDescription: 'Aprender, partilhar e evoluir. Uma comunidade para quem gosta de aprender.',
        community: 'comunidade',
        feedFilters: 'Filtrar publicações',
        exploreTopics: 'Explorar temas',
        feedTitle: 'A tua comunidade, num só lugar',
        feedSubtitle: 'Ideias, materiais e conversas para te ajudar a avançar.',
        settings: 'Definições',
        language: 'Idioma',
        switchAccount: 'Trocar de conta',
        logout: 'Terminar sessão',
        moreOptions: 'Mais opções',
        seeAll: 'Ver tudo',
        suggestedCommunities: 'Comunidades sugeridas',
        explore: 'Explorar',
        cancel: 'Cancelar',
        save: 'Guardar',
        close: 'Fechar',
        search: 'Pesquisar',
        searchResults: 'Resultados da pesquisa',
        communityPlural: 'Comunidades',
        back: 'Voltar',
        clear: 'Limpar',
        notifications: 'Notificações',
        filter: 'Filtro',
        image: 'Adicionar imagem',
        shortVideo: 'Adicionar vídeo curto',
        like: 'Gostar',
        comment: 'Comentar',
        share: 'Partilhar',
        download: 'Transferir',
        downloadMaterial: 'Transferir material de estudo',
        downloadVideo: 'Transferir vídeo',
        downloadImage: 'Transferir imagem',
        downloadAudio: 'Transferir áudio',
        downloadComplete: '✅ Transferido!',
        postImageAlt: 'Imagem da publicação',
        pages: 'páginas',
        downloads: 'transferências',
        playVideo: 'Reproduzir vídeo',
        playAudio: 'Ouvir áudio',
        readOnline: 'Ler online',
        members: 'membros',
        followers: 'seguidores',
        mutual: 'em comum',
        posts: 'publicações',
        videos: 'vídeos',
        resources: 'materiais de estudo',
        saved: 'guardados',
        results: 'resultados',
        by: 'Por',
        follow: 'Seguir',
        unfollow: 'Deixar de seguir',
        joined: 'Aderiste',
        join: 'Aderir',
        people: 'pessoas',
        all: 'Tudo',
        latest: 'Recentes',
        popular: 'Mais populares',
        forYou: 'Para ti',
        following: 'A seguir',
        available: 'Disponível',
        studying: 'A estudar',
        exams: 'Em época de exames',
        teaching: 'A leccionar',
        questions: 'Tira dúvidas com colegas',
        materials: 'Encontra materiais de estudo',
        progress: 'Aprende ao teu ritmo',
        accountNotConnected: 'A autenticação ainda está a ser preparada. Tenta novamente mais tarde.'
      }
    },
    en: {
      auth: {
        loginEyebrow: 'Your learning community',
        loginTitle: 'Learn, share and grow with Impacta.',
        loginIntro: 'Meet your peers, exchange ideas and move forward with your studies at your own pace.',
        loginCardTitle: 'Welcome back',
        loginCardText: 'Sign in to continue where you left off.',
        email: 'Email address',
        emailPlaceholder: 'name@example.com',
        password: 'Password',
        passwordPlaceholder: 'Enter your password',
        showPassword: 'Show password',
        hidePassword: 'Hide password',
        remember: 'Keep me signed in',
        forgot: 'Forgot your password?',
        loginButton: 'Sign in',
        noAccount: 'New to Impacta?',
        createAccount: 'Create an account',
        signupEyebrow: 'Your next step starts here',
        signupTitle: 'Join a community that grows with you.',
        signupIntro: 'Create an account to share ideas, find learning materials and study together.',
        signupCardTitle: 'Create your account',
        signupCardText: 'A few details are all you need to get started.',
        fullName: 'Full name',
        fullNamePlaceholder: 'What should we call you?',
        handle: 'Username',
        handlePlaceholder: 'e.g. ana.mateus',
        accountType: 'I am a',
        footerIntro: 'A place to learn, share and move forward together.',
        footerHome: 'Home', footerExplore: 'Explore', footerCommunities: 'Communities', footerProfile: 'Profile',
        footerHide: 'Hide footer', footerShow: 'Show footer', footerTagline: 'Learn. Share. Move forward.',
        address: 'Address',
        addressPlaceholder: 'e.g. Neighbourhood, city',
        student: 'Student',
        professor: 'Teacher',
        creator: 'Content creator',
        confirmPassword: 'Confirm password',
        passwordHint: 'Use at least 12 characters.',
        acceptTerms: 'I agree to the Terms of Use and Privacy Policy.',
        signupButton: 'Create my account',
        alreadyAccount: 'Already have an account?',
        loginLink: 'Sign in',
        emailNotice: 'Email verification will be available when account registration is connected.',
        serviceUnavailable: 'Account services are not connected yet. Your details were not sent.',
        passwordMismatch: 'Your passwords do not match.',
        forgotUnavailable: 'Account recovery will be available once authentication is connected.',
        language: 'Language',
        privacy: 'Your password is protected and will never be shared.',
        benefitQuestions: 'Get help from your peers',
        benefitMaterials: 'Find learning materials',
        benefitProgress: 'Learn at your own pace',
        tagline: 'Learn · Share · Grow',
        footerLine: 'Made for learning together.',
        metaDescription: 'Sign in to Impacta to learn, share and grow with your community.',
        illustrationAlt: 'A teacher, a student, and a creator learning and sharing knowledge'
      },
      ui: {
        metaTitle: 'Impacta — learn, share and grow',
        metaDescription: 'Angola’s learning community, connected to the world.',
        ogTitle: 'Impacta — learn together',
        ogDescription: 'Learn, share and grow with a community built around learning.',
        community: 'community',
        feedFilters: 'Filter posts',
        exploreTopics: 'Explore topics',
        feedTitle: 'Your community, all in one place',
        feedSubtitle: 'Ideas, learning materials and conversations to help you move forward.',
        settings: 'Settings',
        language: 'Language',
        switchAccount: 'Switch account',
        logout: 'Sign out',
        moreOptions: 'More options',
        seeAll: 'See all',
        suggestedCommunities: 'Suggested communities',
        explore: 'Explore',
        cancel: 'Cancel',
        save: 'Save',
        close: 'Close',
        search: 'Search',
        searchResults: 'Search results',
        communityPlural: 'Communities',
        back: 'Go back',
        clear: 'Clear',
        notifications: 'Notifications',
        filter: 'Filter',
        image: 'Add image',
        shortVideo: 'Add short video',
        like: 'Like',
        comment: 'Comment',
        share: 'Share',
        download: 'Download',
        downloadMaterial: 'Download learning material',
        downloadVideo: 'Download video',
        downloadImage: 'Download image',
        downloadAudio: 'Download audio',
        downloadComplete: '✅ Downloaded!',
        postImageAlt: 'Post image',
        pages: 'pages',
        downloads: 'downloads',
        playVideo: 'Play video',
        playAudio: 'Play audio',
        readOnline: 'Read online',
        members: 'members',
        followers: 'followers',
        mutual: 'mutual',
        posts: 'posts',
        videos: 'videos',
        resources: 'learning materials',
        saved: 'saved',
        results: 'results',
        by: 'By',
        follow: 'Follow',
        unfollow: 'Unfollow',
        joined: 'Joined',
        join: 'Join',
        people: 'people',
        all: 'All',
        latest: 'Latest',
        popular: 'Most popular',
        forYou: 'For you',
        following: 'Following',
        available: 'Available',
        studying: 'Studying',
        exams: 'In exam season',
        teaching: 'Teaching',
        questions: 'Get help from your peers',
        materials: 'Find learning materials',
        progress: 'Learn at your own pace',
        accountNotConnected: 'Account access is still being prepared. Please try again later.'
      }
    },
    fr: {
      auth: {
        loginEyebrow: 'Ta communauté d’apprentissage',
        loginTitle: 'Apprends, partage et progresse avec Impacta.',
        loginIntro: 'Échange avec d’autres étudiants et avance dans tes études à ton rythme.',
        loginCardTitle: 'Content de te revoir',
        loginCardText: 'Connecte-toi pour reprendre là où tu en étais.',
        email: 'Adresse e-mail',
        emailPlaceholder: 'nom@exemple.com',
        password: 'Mot de passe',
        passwordPlaceholder: 'Saisis ton mot de passe',
        showPassword: 'Afficher le mot de passe',
        hidePassword: 'Masquer le mot de passe',
        remember: 'Rester connecté',
        forgot: 'Mot de passe oublié ?',
        loginButton: 'Se connecter',
        noAccount: 'Tu n’as pas encore de compte ?',
        createAccount: 'Créer un compte',
        signupEyebrow: 'Ton prochain pas commence ici',
        signupTitle: 'Rejoins une communauté qui avance avec toi.',
        signupIntro: 'Crée ton compte pour partager des idées, trouver des ressources et apprendre ensemble.',
        signupCardTitle: 'Créer ton compte',
        signupCardText: 'Quelques informations suffisent pour commencer.',
        fullName: 'Nom complet',
        fullNamePlaceholder: 'Comment t’appelles-tu ?',
        handle: 'Nom d’utilisateur',
        handlePlaceholder: 'ex. ana.mateus',
        accountType: 'Je suis',
        footerIntro: 'Un espace pour apprendre, partager et avancer ensemble.',
        footerHome: 'Accueil', footerExplore: 'Explorer', footerCommunities: 'Communautés', footerProfile: 'Profil',
        footerHide: 'Masquer le pied de page', footerShow: 'Afficher le pied de page', footerTagline: 'Apprendre. Partager. Avancer.',
        address: 'Adresse',
        addressPlaceholder: 'ex. quartier, ville',
        student: 'Étudiant',
        professor: 'Enseignant',
        creator: 'Créateur de contenu',
        confirmPassword: 'Confirmer le mot de passe',
        passwordHint: 'Utilise au moins 12 caractères.',
        acceptTerms: 'J’accepte les Conditions d’utilisation et la Politique de confidentialité.',
        signupButton: 'Créer mon compte',
        alreadyAccount: 'Tu as déjà un compte ?',
        loginLink: 'Se connecter',
        emailNotice: 'La confirmation par e-mail sera disponible lorsque la création de compte sera activée.',
        serviceUnavailable: 'Le service de compte n’est pas encore connecté. Tes informations n’ont pas été envoyées.',
        passwordMismatch: 'Les mots de passe ne correspondent pas.',
        forgotUnavailable: 'La récupération du compte sera disponible une fois l’authentification connectée.',
        language: 'Langue',
        privacy: 'Ton mot de passe est protégé et ne sera jamais partagé.',
        benefitQuestions: 'Échange avec tes camarades',
        benefitMaterials: 'Trouve des ressources pour étudier',
        benefitProgress: 'Apprends à ton rythme',
        tagline: 'Apprendre · Partager · Progresser',
        footerLine: 'Conçue pour apprendre ensemble.',
        metaDescription: 'Connecte-toi à Impacta pour apprendre, partager et progresser avec ta communauté.',
        illustrationAlt: 'Une enseignante, un étudiant et une créatrice apprennent et partagent leurs connaissances'
      },
      ui: {
        metaTitle: 'Impacta — apprendre, partager et progresser',
        metaDescription: 'La communauté d’apprentissage angolaise ouverte sur le monde.',
        ogTitle: 'Impacta — apprendre ensemble',
        ogDescription: 'Apprendre, partager et progresser au sein d’une communauté.',
        community: 'communauté',
        feedFilters: 'Filtrer les publications',
        exploreTopics: 'Explorer les sujets',
        feedTitle: 'Ta communauté, au même endroit',
        feedSubtitle: 'Des idées, des ressources et des échanges pour avancer.',
        settings: 'Paramètres',
        language: 'Langue',
        switchAccount: 'Changer de compte',
        logout: 'Se déconnecter',
        moreOptions: 'Plus d’options',
        seeAll: 'Tout voir',
        suggestedCommunities: 'Communautés suggérées',
        explore: 'Explorer',
        cancel: 'Annuler',
        save: 'Enregistrer',
        close: 'Fermer',
        search: 'Rechercher',
        searchResults: 'Résultats de la recherche',
        communityPlural: 'Communautés',
        back: 'Retour',
        clear: 'Effacer',
        notifications: 'Notifications',
        filter: 'Filtrer',
        image: 'Ajouter une image',
        shortVideo: 'Ajouter une courte vidéo',
        like: 'J’aime',
        comment: 'Commenter',
        share: 'Partager',
        download: 'Télécharger',
        downloadMaterial: 'Télécharger la ressource',
        downloadVideo: 'Télécharger la vidéo',
        downloadImage: 'Télécharger l’image',
        downloadAudio: 'Télécharger l’audio',
        downloadComplete: '✅ Téléchargé !',
        postImageAlt: 'Image de la publication',
        pages: 'pages',
        downloads: 'téléchargements',
        playVideo: 'Lire la vidéo',
        playAudio: 'Écouter l’audio',
        readOnline: 'Lire en ligne',
        members: 'membres',
        followers: 'abonnés',
        mutual: 'en commun',
        posts: 'publications',
        videos: 'vidéos',
        resources: 'ressources pour étudier',
        saved: 'enregistrés',
        results: 'résultats',
        by: 'Par',
        follow: 'Suivre',
        unfollow: 'Ne plus suivre',
        joined: 'Membre',
        join: 'Rejoindre',
        people: 'personnes',
        all: 'Tout',
        latest: 'Récentes',
        popular: 'Les plus populaires',
        forYou: 'Pour toi',
        following: 'Abonnements',
        available: 'Disponible',
        studying: 'En train d’étudier',
        exams: 'En période d’examens',
        teaching: 'En cours',
        questions: 'Échange avec tes camarades',
        materials: 'Trouve des ressources pour étudier',
        progress: 'Apprends à ton rythme',
        accountNotConnected: 'La connexion au compte est en préparation. Réessaie plus tard.'
      }
    }
  };

  const phraseCopy = {
    'pt-AO': {
      'Home': 'Início', 'For You': 'Para ti', 'Following': 'A seguir', 'Popular': 'Mais populares',
      'Latest': 'Recentes', 'All': 'Tudo', 'Students': 'Estudantes', 'Professors': 'Docentes',
      'Top Creators': 'Criadores em destaque', 'Posts': 'Publicações', 'Videos': 'Vídeos',
      'Resources': 'Materiais de estudo', 'Saved': 'Guardados', 'Search': 'Pesquisar',
      'Search...': 'Pesquisar...', 'Search for topics, courses...': 'Pesquisar temas e cadeiras...',
      'Clear search': 'Limpar pesquisa', 'Clear': 'Limpar', 'Filter': 'Filtrar',
      'Filter results': 'Filtrar resultados', 'Go back': 'Voltar', 'Bookmark': 'Guardar',
      'Bookmark video': 'Guardar vídeo', 'Recent Notifications': 'Notificações recentes',
      'Mentions': 'Menções', 'Messages': 'Mensagens', 'Notifications': 'Notificações',
      'My Communities': 'As minhas comunidades', 'Popular Communities': 'Comunidades populares',
      'Join': 'Aderir', 'Joined': 'Membro', 'Find Your University Community': 'Encontra a comunidade da tua universidade',
      'Join and connect with students like you': 'Liga-te a estudantes como tu',
      'Create a new community': 'Criar uma comunidade', 'Search Results ·': 'Resultados da pesquisa ·',
      'results': 'resultados', 'Users': 'Pessoas', 'Communities': 'Comunidades',
      'Edit profile': 'Editar perfil', 'Edit Bio': 'Editar biografia', 'Status do Estudante': 'Estado do estudante',
      'Change profile photo': 'Alterar foto de perfil', 'Edit settings': 'Editar definições',
      'Teacher': 'Docente', 'Department': 'Departamento', 'Followers': 'Seguidores',
      'Study materials': 'Materiais de estudo', 'Download': 'Descarregar',
      'Play video': 'Reproduzir vídeo', 'Trending Topics': 'Temas em destaque',
      '🔥 Trending Topics': '🔥 Temas em destaque', '⭐ Popular Content': '⭐ Conteúdos populares',
      'All results': 'Todos os resultados', 'Back': 'Voltar', 'Create': 'Criar',
      'No results found': 'Não foram encontrados resultados', 'Try another search': 'Experimenta outra pesquisa',
      'Popular Content': 'Conteúdos em destaque', 'Search Results': 'Resultados da pesquisa',
      'No saved posts yet': 'Ainda não guardaste publicações', 'Create your first post': 'Faz a tua primeira publicação',
      'Trending in Angola': 'Em destaque em Angola', 'View profile': 'Ver perfil',
      'Follow': 'Seguir', 'Unfollow': 'Deixar de seguir',
      'Share something with your community...': 'Partilha algo com a comunidade...',
      'What are you studying?': 'O que estás a estudar?', 'Add a comment...': 'Escreve um comentário...',
      'Write a comment...': 'Escreve um comentário...', 'Type a message...': 'Escreve uma mensagem...',
      'No messages yet': 'Ainda não há mensagens', 'No notifications yet': 'Ainda não há notificações',
      'See all messages': 'Ver todas as mensagens', 'See all notifications': 'Ver todas as notificações',
      'Download learning material': 'Transferir material de estudo', 'Download video': 'Transferir vídeo',
      'Download image': 'Transferir imagem', 'Download audio': 'Transferir áudio',
      'Downloaded!': 'Transferido!', 'Play audio': 'Ouvir áudio', 'Just now': 'Agora mesmo', 'Like': 'Gostar',
      'Comment posted!': 'Comentário publicado!',
      'IMPACTA installed! 🎓 Welcome to your learning journey!': 'Impacta instalada! 🎓 Começa a tua jornada de aprendizagem.',
      'To install: tap the browser menu → "Add to Home Screen"': 'Para instalar: abre o menu do navegador e escolhe «Adicionar ao ecrã inicial».',
      'Shared successfully! 🚀': 'Partilhado com sucesso! 🚀', 'Could not share': 'Não foi possível partilhar.',
      'Link copied to clipboard! 📋': 'Ligação copiada! 📋', 'Content refreshed!': 'Conteúdo actualizado!'
    },
    en: {
      'Home': 'Home', 'For You': 'For you', 'Following': 'Following', 'Popular': 'Popular',
      'Latest': 'Latest', 'All': 'All', 'Students': 'Students', 'Professors': 'Teachers',
      'Top Creators': 'Featured creators', 'Posts': 'Posts', 'Videos': 'Videos',
      'Resources': 'Learning materials', 'Saved': 'Saved', 'Search': 'Search', 'Search...': 'Search...',
      'Search for topics, courses...': 'Search topics and courses...', 'Clear search': 'Clear search',
      'Clear': 'Clear', 'Filter results': 'Filter results', 'Go back': 'Go back',
      'Bookmark': 'Save', 'Bookmark video': 'Save video', 'Recent Notifications': 'Recent notifications',
      'Mentions': 'Mentions', 'Messages': 'Messages', 'Notifications': 'Notifications',
      'My Communities': 'My communities', 'Popular Communities': 'Popular communities',
      'Find Your University Community': 'Find your university community',
      'Join and connect with students like you': 'Connect with students like you',
      'Create a new community': 'Create a community', 'Search Results ·': 'Search results ·',
      'results': 'results', 'Users': 'People', 'Communities': 'Communities',
      'Edit profile': 'Edit profile', 'Edit Bio': 'Edit bio', 'Teacher': 'Teacher',
      'Study materials': 'Learning materials', 'Download': 'Download', 'Trending Topics': 'Trending topics',
      '🔥 Trending Topics': '🔥 Trending topics', '⭐ Popular Content': '⭐ Popular content',
      'No results found': 'No results found', 'Try another search': 'Try another search',
      'Definições': 'Settings', 'Idioma': 'Language', 'Trocar de Conta': 'Switch account',
      'Terminar Sessão': 'Sign out', 'Mais opções': 'More options', 'Ver tudo ›': 'See all ›',
      'Comunidades Sugeridas': 'Suggested communities', 'Explorar ›': 'Explore ›',
      'Aderir': 'Join', 'Membro': 'Member', 'Cancelar': 'Cancel', 'Guardar': 'Save',
      'Sobre mim': 'About me', 'Localização': 'Location', 'Pesquisa': 'Search',
      'Notificações': 'Notifications', 'Filtro': 'Filter', 'Adicionar imagem': 'Add image',
      'Adicionar vídeo curto': 'Add short video', 'Disponível para estudo': 'Available to study',
      'A estudar': 'Studying', 'Em época de exames': 'In exam season', 'A lecionar': 'Teaching',
      'Tópicos em Alta em Angola': 'Trending topics in Angola', 'Comunidades Estudantis': 'Student communities',
      'Estudantes & Professores': 'Students & teachers', 'Aplica filtros': 'Apply filters',
      'Filtros aplicados!': 'Filters applied!', 'Material de Estudo': 'Learning material',
      'Ler Online': 'Read online', 'Baixar material de estudo': 'Download learning material',
      'Verificado': 'Verified', 'Fechar': 'Close', 'Enviar': 'Send', 'Publicar': 'Post',
      'Criar Nova Comunidade': 'Create a community', 'Comunidades Populares': 'Popular communities',
      'Minhas Comunidades': 'My communities', 'Estudantes': 'Students', 'Professores': 'Teachers',
      'Seguidores': 'Followers', 'A Seguir': 'Following', 'Publicações': 'Posts',
      'Partilhar': 'Share', 'Comentar': 'Comment', 'Guardar publicação': 'Save post',
      'Gostar': 'Like', 'Pesquisar': 'Search', 'Tudo': 'All', 'Recentes': 'Latest',
      'Para Ti': 'For you', 'Mais Populares': 'Most popular', 'Mensagens & Notificações': 'Messages & notifications',
      'Editar Perfil': 'Edit profile', 'Definições da Conta': 'Account settings',
      'Seleccionar Idioma': 'Choose a language', 'Português (Angola)': 'Portuguese (Angola)',
      'Comunidades sugeridas': 'Suggested communities', 'Estás a aprender com a comunidade.': 'Learn together with your community.',
      'Materiais de estudo': 'Learning materials', 'Materiais de estudo PDF': 'Learning materials PDF',
      'Materiais de estudo em PDF': 'PDF learning materials', 'Guardar materiais de estudo sem internet automaticamente': 'Automatically save learning materials for offline use',
      'Modo sem internet': 'Offline mode', 'Material de estudo ou ficheiro PDF': 'Learning material or PDF file',
      'Privacidade & partilha de materiais de estudo': 'Privacy & learning material sharing',
      'O que estás a estudar?': 'What are you studying?', 'Ainda não guardaste publicações': 'You have not saved any posts yet',
      'Faz a tua primeira publicação': 'Create your first post', 'Ver perfil': 'View profile',
      'Deixar de seguir': 'Unfollow', 'Escreve um comentário...': 'Write a comment...',
      'Escreve uma mensagem...': 'Write a message...', 'Ainda não há mensagens': 'No messages yet',
      'Ainda não há notificações': 'No notifications yet', 'Ver todas as mensagens': 'See all messages',
      'Ver todas as notificações': 'See all notifications', 'Transferir material de estudo': 'Download learning material',
      'Transferir vídeo': 'Download video', 'Transferir imagem': 'Download image', 'Transferir áudio': 'Download audio',
      '✅ Transferido!': '✅ Downloaded!', 'Ouvir áudio': 'Play audio', '9,2 mil materiais partilhados': '9.2K shared learning materials',
      'Ficheiro PDF': 'PDF file', 'Áudio-Aula': 'Lesson audio', 'Publicar na Impacta': 'Post on Impacta', '🚀 Publicar na Impacta': '🚀 Post on Impacta',
      'A publicar na Impacta... ⏳': 'Posting to Impacta... ⏳', 'Publicação partilhada com sucesso! 🎉': 'Post shared successfully! 🎉',
      'Imagem seleccionada · Toca para escolher uma foto ou imagem': 'Image selected · Tap to choose a photo or image',
      'Descreve a imagem, o material de estudo ou o esquema...': 'Describe the image, learning material or diagram...',
      'Vídeo curto de estudo · Toca para escolher um vídeo': 'Short study video · Tap to choose a video',
      'Partilha uma breve explicação em vídeo ou dica rápida de estudo...': 'Share a short video explanation or study tip...',
      'Material de estudo ou ficheiro de exame (PDF)': 'Learning material or exam file (PDF)',
      'Descreve este material (ex.: resumo de Cálculo I, UAN 2024)...': 'Describe this material (e.g. Calculus I notes, UAN 2024)...',
      'Áudio-Aula ou Nota de Voz (MP3)': 'Lesson audio or voice note (MP3)',
      'Explica brevemente o conteúdo deste áudio gravado...': 'Briefly describe this recorded audio...',
      'Qual é a dúvida, reflexão ou dica de estudo para hoje? Usa hashtags para organizar por matéria...': 'What question, thought or study tip do you have today? Use hashtags to organise by subject...',
      'Por favor, escreve algo ou anexa uma publicação!': 'Please write something or attach a file to your post.',
      'Resoluções dos Exames 2023–2025': 'Exam Solutions 2023–2025',
      'Transferir ficheiro PDF e guardar sem internet (4,8 MB)': 'Download PDF and save for offline use (4.8 MB)',
      'Diminuir Zoom': 'Zoom out', 'Aumentar Zoom': 'Zoom in', 'Repor Zoom': 'Reset zoom',
      'Página anterior': 'Previous page', 'Página seguinte': 'Next page', 'LEITOR NATIVO · DISPONÍVEL OFFLINE': 'BUILT-IN READER · AVAILABLE OFFLINE',
      'Shared successfully! 🚀': 'Shared successfully! 🚀', 'Link copied to clipboard! 📋': 'Link copied to clipboard! 📋',
      'Content refreshed!': 'Content refreshed!',
      '✅ Definições, redes e dados académicos guardados com sucesso!': '✅ Settings and academic details saved successfully!',
      '👋 Sessão terminada com sucesso! Até breve.': '👋 You have signed out. See you soon.',
      'Marcaste como útil!': 'Marked as helpful!',
      'Guardado na tua coleção de estudos!': 'Saved to your study collection!',
      'Agora estás a acompanhar este colega!': 'You are now following this person!',
      'Bem-vindo à comunidade académica!': 'Welcome to the learning community!',
      '🔄 Troca de Conta — Funcionalidade de múltiplos perfis!': '🔄 Account switching is coming soon.',
      'Comentário publicado!': 'Comment posted!', 'Não foi possível partilhar.': 'Could not share.',
      'Ligação copiada! 📋': 'Link copied! 📋', 'Conteúdo actualizado!': 'Content refreshed!',
      'Navegação móvel': 'Mobile navigation', '🌐 Escolhe o idioma': '🌐 Choose a language',
      'Personaliza o teu perfil, idioma e privacidade': 'Manage your profile, language and privacy',
      '🎯 Estado de actividade': '🎯 Activity status', 'Para tirar dúvidas': 'Available to answer questions',
      'Modo de concentração activo': 'Focus mode is on',
      'A preparar avaliações': 'Getting ready for exams', 'A dar aulas': 'Teaching', 'Docente / Monitor': 'Teacher / tutor',
      '🌐 Idioma da plataforma': '🌐 App language', 'Angola (Padrão)': 'Angola (default)',
      'África Francófona': 'Francophone Africa', '✍️ Sobre ti': '✍️ About you',
      'Conta um pouco sobre ti...': 'Tell the community a little about yourself...',
      'Ex: Luanda, Angola': 'e.g. Luanda, Angola', '🏛️ Dados de estudo e trabalho': '🏛️ Study and work details',
      '👨‍🏫 Docente': '👨‍🏫 Teacher', 'Instituição:': 'Institution:',
      '➕ Outra Escola / Instituto (Não listado)': '➕ Another school or institute (not listed)',
      '📍 A tua instituição será registada no directório universitário de Angola do IMPACTA.': '📍 Your institution will be added to Impacta’s Angola education directory.',
      'Nome da escola:': 'School name:', 'Província:': 'Province:', 'Internacional / Diáspora': 'International / diaspora',
      'Curso:': 'Course:', 'Ano Curricular:': 'Year of study:', '1º Ano (Caloiro)': 'Year 1 (first year)',
      '3º Ano (Finalista Licenciatura)': 'Year 3 (final undergraduate year)', '5º Ano (Engenharias)': 'Year 5 (engineering)',
      'Pós-Graduação / Mestrado': 'Postgraduate / master’s degree', 'Nº Matrícula:': 'Student number:',
      'Ex: UAN-2023-8841': 'e.g. UAN-2023-8841', 'Titulação / Grau:': 'Qualification:',
      'Prof. Doutor (Ph.D / Doutoramento)': 'PhD', 'Mestre (M.Sc / Pós-Graduado)': 'Master’s degree',
      'Licenciado / Eng.º / Docente Auxiliar': 'Bachelor’s degree / assistant lecturer',
      'Professor Catedrático Titular': 'Full professor', 'Monitor / Assistente de Cadeira': 'Teaching assistant',
      'Departamento:': 'Department:', 'Disciplinas:': 'Subjects:', 'Atendimento:': 'Office hours:',
      'Ex: Departamento de Ciências da Computação': 'e.g. Computer Science Department',
      'Ex: Cálculo I, Álgebra Linear, Redes': 'e.g. Calculus I, Linear Algebra, Networks',
      'Ex: Sala 204 · Quartas 14h–16h': 'e.g. Room 204 · Wednesdays, 2–4 pm',
      '🔗 Redes sociais e contactos': '🔗 Social media and contact details',
      'Os teus colegas podem falar contigo através das tuas redes sociais e profissionais.': 'Your classmates can reach you through your social and professional accounts.',
      '🔒 Privacidade & partilha de materiais de estudo': '🔒 Privacy and learning material sharing',
      'Visibilidade:': 'Visibility:', '🌍 Público (Todos os estudantes de Angola)': '🌍 Public (all students in Angola)',
      '🏛️ Colegas da UAN apenas': '🏛️ UAN classmates only', '👥 Apenas contactos que sigo': '👥 People you follow only',
      '🔒 Privado (Apenas eu)': '🔒 Private (only me)',
      'Exibir redes sociais no meu perfil público': 'Show social links on my public profile',
      'Permitir que colegas vejam o teu LinkedIn e GitHub': 'Let classmates see your LinkedIn and GitHub',
      '📶 Poupar dados e usar sem internet': '📶 Save data and use the app offline',
      'Guardar materiais de estudo para usar sem internet': 'Save learning materials for offline use',
      'Permite ler PDFs no telemóvel sem gastar saldo': 'Read PDFs on your phone without using mobile data',
      'Alertas de novos exames nacionais': 'National exam updates',
      'Notificar quando professores publicarem resoluções': 'Get notified when teachers share exam solutions',
      '💾 Guardar Todas as Definições': '💾 Save all settings', 'Terminar sessão?': 'Sign out?',
      'Tens a certeza de que desejas sair da conta de': 'Are you sure you want to sign out of',
      'Modo sem internet:': 'Offline mode:', 'Tipo de conteúdo': 'Content type',
      'Universidade ou instituto': 'University or institute', '🏛️ Todas as instituições': '🏛️ All institutions',
      'Ordenar por': 'Sort by', 'Criar publicação': 'Create a post', '✨ O que queres partilhar?': '✨ What would you like to share?',
      'Escolhe o tipo de publicação': 'Choose what you want to post', 'Pergunta ou publicação': 'Question or post',
      'Partilha uma pergunta, ideia ou dica de estudo': 'Share a question, idea or study tip',
      'Vídeo curto ou dica': 'Short video or tip', 'Partilha um vídeo de estudo com até 60 segundos': 'Share a study video up to 60 seconds long',
      'Partilha exames resolvidos, resumos e livros digitais': 'Share solved exams, summaries and digital books',
      'Comentários': 'Comments', 'Responder': 'Reply', 'Criar uma publicação': 'Create a post',
      'Ficheiro seleccionado': 'File selected', 'Pronto para gravar áudio': 'Ready to record audio',
      'Instalar Impacta': 'Install Impacta', 'Adiciona ao ecrã inicial para usares melhor a aplicação': 'Add Impacta to your home screen for the best experience',
      'Instalar': 'Install', '🎓 Estudante': '🎓 Student', 'Disponível': 'Available', 'A Estudar': 'Studying',
      'Selecionar Idioma': 'Choose a language', 'See All ›': 'See all ›',
      'No saved posts yet': 'No saved posts yet',
      'Tap the bookmark icon on any post to save it here for later.': 'Tap the bookmark icon on a post to save it here for later.'
    },
    fr: {
      'Home': 'Accueil', 'For You': 'Pour toi', 'Following': 'Abonnements', 'Popular': 'Populaires',
      'Latest': 'Récentes', 'All': 'Tout', 'Students': 'Étudiants', 'Professors': 'Enseignants',
      'Top Creators': 'Créateurs à découvrir', 'Posts': 'Publications', 'Videos': 'Vidéos',
      'Resources': 'Ressources pour étudier', 'Saved': 'Enregistrés', 'Search': 'Rechercher',
      'Search...': 'Rechercher...', 'Search for topics, courses...': 'Rechercher des sujets et des cours...',
      'Clear search': 'Effacer la recherche', 'Clear': 'Effacer', 'Filter results': 'Filtrer les résultats',
      'Go back': 'Retour', 'Bookmark': 'Enregistrer', 'Bookmark video': 'Enregistrer la vidéo',
      'Recent Notifications': 'Notifications récentes', 'Mentions': 'Mentions', 'Messages': 'Messages',
      'Notifications': 'Notifications', 'My Communities': 'Mes communautés',
      'Popular Communities': 'Communautés populaires',
      'Find Your University Community': 'Trouve la communauté de ton université',
      'Join and connect with students like you': 'Échange avec des étudiants comme toi',
      'Create a new community': 'Créer une communauté', 'Search Results ·': 'Résultats ·',
      'results': 'résultats', 'Users': 'Personnes', 'Communities': 'Communautés',
      'Edit profile': 'Modifier le profil', 'Edit Bio': 'Modifier la bio', 'Teacher': 'Enseignant',
      'Study materials': 'Ressources pour étudier', 'Download': 'Télécharger',
      'Trending Topics': 'Sujets populaires', '🔥 Trending Topics': '🔥 Sujets populaires',
      '⭐ Popular Content': '⭐ Contenus populaires', 'No results found': 'Aucun résultat trouvé',
      'Try another search': 'Essaie une autre recherche',
      'Definições': 'Paramètres', 'Idioma': 'Langue', 'Trocar de Conta': 'Changer de compte',
      'Terminar Sessão': 'Se déconnecter', 'Mais opções': 'Plus d’options', 'Ver tudo ›': 'Tout voir ›',
      'Comunidades Sugeridas': 'Communautés suggérées', 'Explorar ›': 'Explorer ›',
      'Aderir': 'Rejoindre', 'Membro': 'Membre', 'Cancelar': 'Annuler', 'Guardar': 'Enregistrer',
      'Sobre mim': 'À propos', 'Localização': 'Localisation', 'Pesquisa': 'Rechercher',
      'Notificações': 'Notifications', 'Filtro': 'Filtrer', 'Adicionar imagem': 'Ajouter une image',
      'Adicionar vídeo curto': 'Ajouter une courte vidéo', 'Disponível para estudo': 'Disponible pour étudier',
      'A estudar': 'En train d’étudier', 'Em época de exames': 'En période d’examens', 'A lecionar': 'En cours',
      'Tópicos em Alta em Angola': 'Sujets populaires en Angola', 'Comunidades Estudantis': 'Communautés étudiantes',
      'Estudantes & Professores': 'Étudiants et enseignants', 'Aplica filtros': 'Appliquer les filtres',
      'Filtros aplicados!': 'Filtres appliqués !', 'Material de Estudo': 'Ressource pour étudier',
      'Ler Online': 'Lire en ligne', 'Baixar material de estudo': 'Télécharger la ressource',
      'Verificado': 'Vérifié', 'Fechar': 'Fermer', 'Enviar': 'Envoyer', 'Publicar': 'Publier',
      'Criar Nova Comunidade': 'Créer une communauté', 'Comunidades Populares': 'Communautés populaires',
      'Minhas Comunidades': 'Mes communautés', 'Estudantes': 'Étudiants', 'Professores': 'Enseignants',
      'Seguidores': 'Abonnés', 'A Seguir': 'Abonnements', 'Publicações': 'Publications',
      'Partilhar': 'Partager', 'Comentar': 'Commenter', 'Guardar publicação': 'Enregistrer la publication',
      'Gostar': 'J’aime', 'Pesquisar': 'Rechercher', 'Tudo': 'Tout', 'Recentes': 'Récentes',
      'Para Ti': 'Pour toi', 'Mais Populares': 'Les plus populaires', 'Mensagens & Notificações': 'Messages et notifications',
      'Editar Perfil': 'Modifier le profil', 'Definições da Conta': 'Paramètres du compte',
      'Seleccionar Idioma': 'Choisir une langue', 'Português (Angola)': 'Portugais (Angola)',
      'Comunidades sugeridas': 'Communautés suggérées', 'Estás a aprender com a comunidade.': 'Apprends avec ta communauté.',
      'Materiais de estudo': 'Ressources pour étudier', 'Materiais de estudo PDF': 'Ressources pour étudier en PDF',
      'Materiais de estudo em PDF': 'Ressources pour étudier en PDF', 'Guardar materiais de estudo sem internet automaticamente': 'Enregistrer automatiquement les ressources hors ligne',
      'Modo sem internet': 'Mode hors ligne', 'Material de estudo ou ficheiro PDF': 'Ressource ou fichier PDF',
      'Privacidade & partilha de materiais de estudo': 'Confidentialité et partage des ressources',
      'O que estás a estudar?': 'Qu’étudies-tu ?', 'Ainda não guardaste publicações': 'Tu n’as pas encore enregistré de publications',
      'Faz a tua primeira publicação': 'Publie pour la première fois', 'Ver perfil': 'Voir le profil',
      'Deixar de seguir': 'Ne plus suivre', 'Escreve um comentário...': 'Écris un commentaire...',
      'Escreve uma mensagem...': 'Écris un message...', 'Ainda não há mensagens': 'Pas encore de messages',
      'Ainda não há notificações': 'Pas encore de notifications', 'Ver todas as mensagens': 'Voir tous les messages',
      'Ver todas as notificações': 'Voir toutes les notifications', 'Transferir material de estudo': 'Télécharger la ressource',
      'Transferir vídeo': 'Télécharger la vidéo', 'Transferir imagem': 'Télécharger l’image', 'Transferir áudio': 'Télécharger l’audio',
      '✅ Transferido!': '✅ Téléchargé !', 'Ouvir áudio': 'Écouter l’audio', '9,2 mil materiais partilhados': '9,2 k ressources partagées',
      'Ficheiro PDF': 'Fichier PDF', 'Áudio-Aula': 'Audio de cours', 'Publicar na Impacta': 'Publier sur Impacta', '🚀 Publicar na Impacta': '🚀 Publier sur Impacta',
      'A publicar na Impacta... ⏳': 'Publication sur Impacta... ⏳', 'Publicação partilhada com sucesso! 🎉': 'Publication partagée ! 🎉',
      'Imagem seleccionada · Toca para escolher uma foto ou imagem': 'Image sélectionnée · Appuie pour choisir une image',
      'Descreve a imagem, o material de estudo ou o esquema...': 'Décris l’image, la ressource ou le schéma...',
      'Vídeo curto de estudo · Toca para escolher um vídeo': 'Courte vidéo de cours · Appuie pour choisir une vidéo',
      'Partilha uma breve explicação em vídeo ou dica rápida de estudo...': 'Partage une courte explication vidéo ou une astuce pour étudier...',
      'Material de estudo ou ficheiro de exame (PDF)': 'Ressource ou document d’examen (PDF)',
      'Descreve este material (ex.: resumo de Cálculo I, UAN 2024)...': 'Décris cette ressource (ex. résumé de Calcul I, UAN 2024)...',
      'Áudio-Aula ou Nota de Voz (MP3)': 'Audio de cours ou note vocale (MP3)',
      'Explica brevemente o conteúdo deste áudio gravado...': 'Décris brièvement le contenu de cet audio...',
      'Qual é a dúvida, reflexão ou dica de estudo para hoje? Usa hashtags para organizar por matéria...': 'Quelle question, réflexion ou astuce veux-tu partager ? Utilise des hashtags pour classer par matière...',
      'Por favor, escreve algo ou anexa uma publicação!': 'Écris quelque chose ou joins un fichier à ta publication.',
      'Resoluções dos Exames 2023–2025': 'Corrigés des examens 2023–2025',
      'Transferir ficheiro PDF e guardar sem internet (4,8 MB)': 'Télécharger le PDF et le garder hors ligne (4,8 Mo)',
      'Diminuir Zoom': 'Dézoomer', 'Aumentar Zoom': 'Zoomer', 'Repor Zoom': 'Réinitialiser le zoom',
      'Página anterior': 'Page précédente', 'Página seguinte': 'Page suivante', 'LEITOR NATIVO · DISPONÍVEL OFFLINE': 'LECTEUR INTÉGRÉ · DISPONIBLE HORS LIGNE',
      'Shared successfully! 🚀': 'Publication partagée ! 🚀', 'Link copied to clipboard! 📋': 'Lien copié ! 📋',
      'Content refreshed!': 'Contenu actualisé !',
      '✅ Definições, redes e dados académicos guardados com sucesso!': '✅ Paramètres et informations académiques enregistrés !',
      '👋 Sessão terminada com sucesso! Até breve.': '👋 Tu es déconnecté. À bientôt !',
      'Marcaste como útil!': 'Marqué comme utile !',
      'Guardado na tua coleção de estudos!': 'Enregistré dans tes ressources !',
      'Agora estás a acompanhar este colega!': 'Tu suis maintenant cette personne !',
      'Bem-vindo à comunidade académica!': 'Bienvenue dans la communauté d’apprentissage !',
      '🔄 Troca de Conta — Funcionalidade de múltiplos perfis!': '🔄 Le changement de compte sera bientôt disponible.',
      'Comentário publicado!': 'Commentaire publié !', 'Não foi possível partilhar.': 'Impossible de partager.',
      'Ligação copiada! 📋': 'Lien copié ! 📋', 'Conteúdo actualizado!': 'Contenu actualisé !',
      'Navegação móvel': 'Navigation mobile', '🌐 Escolhe o idioma': '🌐 Choisis une langue',
      'Personaliza o teu perfil, idioma e privacidade': 'Gère ton profil, la langue et la confidentialité',
      '🎯 Estado de actividade': '🎯 Statut', 'Para tirar dúvidas': 'Disponible pour répondre aux questions',
      'Modo de concentração activo': 'Mode concentration activé',
      'A preparar avaliações': 'Préparation des examens', 'A dar aulas': 'En cours', 'Docente / Monitor': 'Enseignant / tuteur',
      '🌐 Idioma da plataforma': '🌐 Langue de la plateforme', 'Angola (Padrão)': 'Angola (par défaut)',
      'África Francófona': 'Afrique francophone', '✍️ Sobre ti': '✍️ À propos de toi',
      'Conta um pouco sobre ti...': 'Présente-toi à la communauté...',
      'Ex: Luanda, Angola': 'ex. Luanda, Angola', '🏛️ Dados de estudo e trabalho': '🏛️ Études et activité professionnelle',
      '👨‍🏫 Docente': '👨‍🏫 Enseignant', 'Instituição:': 'Établissement :',
      '➕ Outra Escola / Instituto (Não listado)': '➕ Autre école ou établissement (non répertorié)',
      '📍 A tua instituição será registada no directório universitário de Angola do IMPACTA.': '📍 Ton établissement sera ajouté au répertoire éducatif d’Impacta en Angola.',
      'Nome da escola:': 'Nom de l’école :', 'Província:': 'Province :', 'Internacional / Diáspora': 'International / diaspora',
      'Curso:': 'Filière :', 'Ano Curricular:': 'Année d’études :', '1º Ano (Caloiro)': '1re année',
      '3º Ano (Finalista Licenciatura)': '3e année (fin de licence)', '5º Ano (Engenharias)': '5e année (ingénierie)',
      'Pós-Graduação / Mestrado': 'Études supérieures / master', 'Nº Matrícula:': 'Numéro étudiant :',
      'Ex: UAN-2023-8841': 'ex. UAN-2023-8841', 'Titulação / Grau:': 'Diplôme :',
      'Prof. Doutor (Ph.D / Doutoramento)': 'Doctorat', 'Mestre (M.Sc / Pós-Graduado)': 'Master',
      'Licenciado / Eng.º / Docente Auxiliar': 'Licence / ingénieur / maître-assistant',
      'Professor Catedrático Titular': 'Professeur titulaire', 'Monitor / Assistente de Cadeira': 'Assistant d’enseignement',
      'Departamento:': 'Département :', 'Disciplinas:': 'Matières :', 'Atendimento:': 'Disponibilités :',
      'Ex: Departamento de Ciências da Computação': 'ex. Département d’informatique',
      'Ex: Cálculo I, Álgebra Linear, Redes': 'ex. Calcul I, algèbre linéaire, réseaux',
      'Ex: Sala 204 · Quartas 14h–16h': 'ex. Salle 204 · mercredi, 14 h–16 h',
      '🔗 Redes sociais e contactos': '🔗 Réseaux sociaux et coordonnées',
      'Os teus colegas podem falar contigo através das tuas redes sociais e profissionais.': 'Tes camarades peuvent te contacter par tes réseaux sociaux et professionnels.',
      '🔒 Privacidade & partilha de materiais de estudo': '🔒 Confidentialité et partage des ressources',
      'Visibilidade:': 'Visibilité :', '🌍 Público (Todos os estudantes de Angola)': '🌍 Public (tous les étudiants en Angola)',
      '🏛️ Colegas da UAN apenas': '🏛️ Étudiants de l’UAN uniquement', '👥 Apenas contactos que sigo': '👥 Personnes que tu suis uniquement',
      '🔒 Privado (Apenas eu)': '🔒 Privé (toi uniquement)',
      'Exibir redes sociais no meu perfil público': 'Afficher mes réseaux sociaux sur mon profil public',
      'Permitir que colegas vejam o teu LinkedIn e GitHub': 'Autoriser tes camarades à voir tes comptes LinkedIn et GitHub',
      '📶 Poupar dados e usar sem internet': '📶 Économiser les données et utiliser hors ligne',
      'Guardar materiais de estudo para usar sem internet': 'Enregistrer les ressources pour les consulter hors ligne',
      'Permite ler PDFs no telemóvel sem gastar saldo': 'Lire des PDF sur ton téléphone sans utiliser tes données mobiles',
      'Alertas de novos exames nacionais': 'Actualités des examens nationaux',
      'Notificar quando professores publicarem resoluções': 'Être averti lorsque des enseignants partagent des corrigés',
      '💾 Guardar Todas as Definições': '💾 Enregistrer tous les paramètres', 'Terminar sessão?': 'Se déconnecter ?',
      'Tens a certeza de que desejas sair da conta de': 'Veux-tu vraiment te déconnecter du compte de',
      'Modo sem internet:': 'Mode hors ligne :', 'Tipo de conteúdo': 'Type de contenu',
      'Universidade ou instituto': 'Université ou établissement', '🏛️ Todas as instituições': '🏛️ Tous les établissements',
      'Ordenar por': 'Trier par', 'Criar publicação': 'Créer une publication', '✨ O que queres partilhar?': '✨ Que veux-tu partager ?',
      'Escolhe o tipo de publicação': 'Choisis le type de publication', 'Pergunta ou publicação': 'Question ou publication',
      'Partilha uma pergunta, ideia ou dica de estudo': 'Partage une question, une idée ou une astuce pour étudier',
      'Vídeo curto ou dica': 'Vidéo courte ou astuce', 'Partilha um vídeo de estudo com até 60 segundos': 'Partage une vidéo de cours de 60 secondes maximum',
      'Partilha exames resolvidos, resumos e livros digitais': 'Partage des corrigés, des résumés et des livres numériques',
      'Comentários': 'Commentaires', 'Responder': 'Répondre', 'Criar uma publicação': 'Créer une publication',
      'Ficheiro seleccionado': 'Fichier sélectionné', 'Pronto para gravar áudio': 'Prêt à enregistrer',
      'Instalar Impacta': 'Installer Impacta', 'Adiciona ao ecrã inicial para usares melhor a aplicação': 'Ajoute Impacta à ton écran d’accueil pour en profiter pleinement',
      'Instalar': 'Installer', '🎓 Estudante': '🎓 Étudiant', 'Disponível': 'Disponible', 'A Estudar': 'En train d’étudier',
      'Agora mesmo': 'À l’instant', 'Gostar': 'J’aime',
      'Selecionar Idioma': 'Choisir une langue', 'See All ›': 'Tout voir ›',
      'No saved posts yet': 'Aucune publication enregistrée',
      'Tap the bookmark icon on any post to save it here for later.': 'Appuie sur le signet d’une publication pour la retrouver ici.'
    }
  };

  const visitorCopy = {
    'pt-AO': {
      metaTitle: 'Impacta — aprender em comunidade',
      metaDescription: 'Na Impacta, estudantes, docentes e criadores aprendem e partilham conhecimento em comunidade.',
      language: 'Idioma', howItWorks: 'Como funciona', explore: 'Explorar', login: 'Entrar', loginCta: 'Já tenho conta',
      createAccount: 'Criar conta', kicker: 'Feita em Angola. Aberta ao mundo.',
      titleLine1: 'O teu próximo passo', titleLine2: 'começa em comunidade.',
      intro: 'Aprende com outras pessoas, partilha o que sabes e encontra novas formas de avançar nos teus estudos.',
      freeNote: 'Junta-te à comunidade e começa ao teu ritmo.', students: 'Estudantes', teachers: 'Docentes', creators: 'Criadores',
      visualAlt: 'Uma estudante a aprender e a partilhar conhecimento', visualTop: 'Ideias que aproximam', visualBottom: 'Aprender. Partilhar. Avançar.',
      featuresKicker: 'Uma comunidade feita para aprender', featuresTitle: 'O conhecimento cresce quando é partilhado.',
      featureOneTitle: 'Tira dúvidas', featureOneBody: 'Faz perguntas, explica o teu raciocínio e aprende com as respostas de quem está a estudar contigo.',
      featureTwoTitle: 'Partilha o que sabes', featureTwoBody: 'Apontamentos, ideias e experiências podem ajudar alguém a dar o próximo passo.',
      featureThreeTitle: 'Encontra a tua comunidade', featureThreeBody: 'Liga-te a pessoas com os mesmos interesses, cursos e objectivos de aprendizagem.',
      joinKicker: 'O teu lugar é aqui', joinTitle: 'Cada ideia pode abrir um novo caminho.',
      joinBody: 'Cria a tua conta e começa a aprender com pessoas de Angola e de outros lugares.',
      footerLine: 'Aprender em conjunto. Avançar em comunidade.', exploreCommunity: 'Conhecer a comunidade'
    },
    en: {
      metaTitle: 'Impacta — learn together',
      metaDescription: 'Impacta brings students, teachers and creators together to learn and share knowledge.',
      language: 'Language', howItWorks: 'How it works', explore: 'Explore', login: 'Log in', loginCta: 'I already have an account',
      createAccount: 'Create an account', kicker: 'Made in Angola. Open to the world.',
      titleLine1: 'Your next step', titleLine2: 'starts with community.',
      intro: 'Learn with others, share what you know and find new ways to move forward in your studies.',
      freeNote: 'Join the community and learn at your own pace.', students: 'Students', teachers: 'Teachers', creators: 'Creators',
      visualAlt: 'A student learning and sharing knowledge', visualTop: 'Ideas bring us closer', visualBottom: 'Learn. Share. Move forward.',
      featuresKicker: 'A community built for learning', featuresTitle: 'Knowledge grows when it is shared.',
      featureOneTitle: 'Ask questions', featureOneBody: 'Ask questions, explain your thinking and learn from people studying alongside you.',
      featureTwoTitle: 'Share what you know', featureTwoBody: 'Notes, ideas and experience can help someone take their next step.',
      featureThreeTitle: 'Find your community', featureThreeBody: 'Meet people with the same interests, courses and learning goals.',
      joinKicker: 'There is a place for you here', joinTitle: 'One idea can open a new path.',
      joinBody: 'Create an account and start learning with people in Angola and beyond.',
      footerLine: 'Learn together. Move forward as a community.', exploreCommunity: 'Meet the community'
    },
    fr: {
      metaTitle: 'Impacta — apprendre ensemble',
      metaDescription: 'Impacta réunit étudiants, enseignants et créateurs pour apprendre et partager leurs connaissances.',
      language: 'Langue', howItWorks: 'Comment ça marche', explore: 'Découvrir', login: 'Se connecter', loginCta: 'J’ai déjà un compte',
      createAccount: 'Créer un compte', kicker: 'Née en Angola. Ouverte au monde.',
      titleLine1: 'La prochaine étape', titleLine2: 'se construit ensemble.',
      intro: 'Apprends avec les autres, partage tes connaissances et trouve de nouvelles façons d’avancer dans tes études.',
      freeNote: 'Rejoins la communauté et avance à ton rythme.', students: 'Étudiants', teachers: 'Enseignants', creators: 'Créateurs',
      visualAlt: 'Une étudiante apprend et partage ses connaissances', visualTop: 'Les idées nous rapprochent', visualBottom: 'Apprendre. Partager. Avancer.',
      featuresKicker: 'Une communauté pour apprendre', featuresTitle: 'Le savoir grandit quand on le partage.',
      featureOneTitle: 'Pose tes questions', featureOneBody: 'Pose des questions, explique ton raisonnement et apprends avec les personnes qui étudient avec toi.',
      featureTwoTitle: 'Partage tes connaissances', featureTwoBody: 'Des notes, des idées et de l’expérience peuvent aider quelqu’un à avancer.',
      featureThreeTitle: 'Trouve ta communauté', featureThreeBody: 'Rencontre des personnes qui partagent tes intérêts, tes cours et tes objectifs.',
      joinKicker: 'Ta place est ici', joinTitle: 'Une idée peut ouvrir un nouveau chemin.',
      joinBody: 'Crée un compte et apprends avec des personnes en Angola et ailleurs.',
      footerLine: 'Apprendre ensemble. Avancer en communauté.', exploreCommunity: 'Découvrir la communauté'
    }
  };
  Object.entries(visitorCopy).forEach(([lang, values]) => {
    copy[lang].visitor = { ...copy[lang].visitor, ...values };
  });

  const profileCopy = {
    'pt-AO': {
      profileEmptyPosts: 'Ainda não partilhaste publicações.',
      profileEmptyVideos: 'Ainda não partilhaste vídeos curtos.',
      profileEmptyResources: 'Ainda não partilhaste materiais de estudo.',
      profileEmptySaved: 'Ainda não guardaste publicações.'
    },
    en: {
      profileEmptyPosts: 'You have not shared any posts yet.',
      profileEmptyVideos: 'You have not shared any short videos yet.',
      profileEmptyResources: 'You have not shared any learning materials yet.',
      profileEmptySaved: 'You have not saved any posts yet.'
    },
    fr: {
      profileEmptyPosts: 'Tu n’as pas encore partagé de publications.',
      profileEmptyVideos: 'Tu n’as pas encore partagé de vidéos courtes.',
      profileEmptyResources: 'Tu n’as pas encore partagé de ressources.',
      profileEmptySaved: 'Tu n’as pas encore enregistré de publications.'
    }
  };
  Object.entries(profileCopy).forEach(([lang, values]) => {
    copy[lang].ui = { ...copy[lang].ui, ...values };
  });

  const extraCopy = {
    'pt-AO': {
      auth: { footerNewsTitle: 'Novidades da Impacta', footerNewsText: 'Recebe novidades sobre a comunidade e novas formas de aprender.', footerNewsPlaceholder: 'O teu email', footerNewsButton: 'Avise-me', newsletterUnavailable: 'A lista de novidades ainda não está ligada.', footerFeatureHeading: 'Explorar', footerSupportHeading: 'Apoio', footerLegalHeading: 'Informações', footerVideos: 'Vídeos curtos', footerMessages: 'Mensagens', footerHelp: 'Ajuda', footerPrivacy: 'Privacidade', footerTerms: 'Termos de utilização', footerCookies: 'Cookies' },
      admin: { open: 'Área de administração', accessDenied: 'Esta área é reservada à administração.', title: 'Área de administração', subtitle: 'Acompanha e organiza a plataforma.', backToProfile: 'Voltar ao perfil', previewNotice: 'Esta área está em demonstração. Os dados e as permissões reais serão ligados ao servidor antes do lançamento.', navigation: 'Secções de administração', tab_overview: 'Visão geral', tab_users: 'Utilizadores', tab_posts: 'Publicações', tab_reports: 'Denúncias', tab_institutions: 'Instituições', tab_settings: 'Definições', postsTitle: 'Publicações da conta oficial', postsIntro: 'Publicações de demonstração já preparadas para o perfil.', published: 'Publicação', noPosts: 'Ainda não há publicações nesta demonstração.', administrator: 'Administrador', starterPosts: 'Publicações iniciais', starterPostsNote: 'Conteúdo de demonstração do perfil oficial.', dataSource: 'Origem dos dados', localPreview: 'Pré-visualização local', dataSourceNote: 'Sem ligação à base de dados nesta página.', overviewTitle: 'O que podes gerir aqui', overviewText: 'Esta área vai reunir a gestão de contas, conteúdos, denúncias e instituições quando a API administrativa estiver ligada.', usersTitle: 'Utilizadores', usersEmpty: 'A lista de utilizadores será apresentada quando a API administrativa estiver ligada.', reportsTitle: 'Denúncias', reportsEmpty: 'As denúncias enviadas pela comunidade vão aparecer aqui depois da ligação ao servidor.', institutionsTitle: 'Instituições', institutionsEmpty: 'A gestão e verificação de instituições ficará disponível nesta secção.', settingsTitle: 'Definições da plataforma', settingsEmpty: 'As opções de administração serão disponibilizadas quando os serviços correspondentes estiverem ligados.' },
      info: { title: 'Informações e ajuda', subtitle: 'Encontra orientações sobre a utilização da Impacta.', back: 'Voltar ao início', preparation: 'Esta informação está em preparação e será publicada antes da abertura da plataforma.', privacyTitle: 'Privacidade', termsTitle: 'Termos de utilização', cookiesTitle: 'Cookies', helpTitle: 'Ajuda' }
    },
    en: {
      auth: { footerNewsTitle: 'Impacta updates', footerNewsText: 'Get news about the community and new ways to learn.', footerNewsPlaceholder: 'Your email', footerNewsButton: 'Keep me posted', newsletterUnavailable: 'The updates list is not connected yet.', footerFeatureHeading: 'Explore', footerSupportHeading: 'Support', footerLegalHeading: 'Information', footerVideos: 'Short videos', footerMessages: 'Messages', footerHelp: 'Help', footerPrivacy: 'Privacy', footerTerms: 'Terms of use', footerCookies: 'Cookies' },
      admin: { open: 'Admin area', accessDenied: 'This area is for administrators only.', title: 'Admin area', subtitle: 'Manage and organise the platform.', backToProfile: 'Back to profile', previewNotice: 'This area is a preview. Live data and permissions will be connected to the server before launch.', navigation: 'Admin sections', tab_overview: 'Overview', tab_users: 'Users', tab_posts: 'Posts', tab_reports: 'Reports', tab_institutions: 'Institutions', tab_settings: 'Settings', postsTitle: 'Official account posts', postsIntro: 'Preview posts prepared for the profile.', published: 'Post', noPosts: 'There are no posts in this preview yet.', administrator: 'Administrator', starterPosts: 'Starter posts', starterPostsNote: 'Preview content from the official profile.', dataSource: 'Data source', localPreview: 'Local preview', dataSourceNote: 'This page is not connected to the database.', overviewTitle: 'What you can manage here', overviewText: 'This area will bring together account, content, report, and institution management when the admin API is connected.', usersTitle: 'Users', usersEmpty: 'The user list will appear here when the admin API is connected.', reportsTitle: 'Reports', reportsEmpty: 'Community reports will appear here after the server connection is ready.', institutionsTitle: 'Institutions', institutionsEmpty: 'Institution management and verification will be available here.', settingsTitle: 'Platform settings', settingsEmpty: 'Admin options will be available when the related services are connected.' },
      info: { title: 'Information and help', subtitle: 'Guidance for using Impacta.', back: 'Back to home', preparation: 'This information is being prepared and will be published before the platform opens.', privacyTitle: 'Privacy', termsTitle: 'Terms of use', cookiesTitle: 'Cookies', helpTitle: 'Help' }
    },
    fr: {
      auth: { footerNewsTitle: 'Actualités Impacta', footerNewsText: 'Reçois des nouvelles de la communauté et de nouvelles façons d’apprendre.', footerNewsPlaceholder: 'Ton adresse e-mail', footerNewsButton: 'Me tenir au courant', newsletterUnavailable: 'La liste d’actualités n’est pas encore connectée.', footerFeatureHeading: 'Explorer', footerSupportHeading: 'Assistance', footerLegalHeading: 'Informations', footerVideos: 'Vidéos courtes', footerMessages: 'Messages', footerHelp: 'Aide', footerPrivacy: 'Confidentialité', footerTerms: 'Conditions d’utilisation', footerCookies: 'Cookies' },
      admin: { open: 'Espace administration', accessDenied: 'Cet espace est réservé à l’administration.', title: 'Espace administration', subtitle: 'Gère et organise la plateforme.', backToProfile: 'Retour au profil', previewNotice: 'Cet espace est une démonstration. Les données réelles et les autorisations seront reliées au serveur avant le lancement.', navigation: 'Sections d’administration', tab_overview: 'Vue générale', tab_users: 'Utilisateurs', tab_posts: 'Publications', tab_reports: 'Signalements', tab_institutions: 'Établissements', tab_settings: 'Paramètres', postsTitle: 'Publications du compte officiel', postsIntro: 'Publications de démonstration préparées pour le profil.', published: 'Publication', noPosts: 'Aucune publication dans cette démonstration.', administrator: 'Administrateur', starterPosts: 'Publications initiales', starterPostsNote: 'Contenu de démonstration du profil officiel.', dataSource: 'Source des données', localPreview: 'Aperçu local', dataSourceNote: 'Cette page n’est pas reliée à la base de données.', overviewTitle: 'Gestion disponible ici', overviewText: 'Cet espace réunira la gestion des comptes, contenus, signalements et établissements lorsque l’API d’administration sera connectée.', usersTitle: 'Utilisateurs', usersEmpty: 'La liste des utilisateurs apparaîtra ici lorsque l’API sera connectée.', reportsTitle: 'Signalements', reportsEmpty: 'Les signalements de la communauté seront affichés ici après la connexion au serveur.', institutionsTitle: 'Établissements', institutionsEmpty: 'La gestion et la vérification des établissements seront disponibles ici.', settingsTitle: 'Paramètres de la plateforme', settingsEmpty: 'Les options d’administration seront disponibles lorsque les services correspondants seront connectés.' },
      info: { title: 'Informations et aide', subtitle: 'Conseils pour utiliser Impacta.', back: 'Retour à l’accueil', preparation: 'Ces informations sont en préparation et seront publiées avant l’ouverture de la plateforme.', privacyTitle: 'Confidentialité', termsTitle: 'Conditions d’utilisation', cookiesTitle: 'Cookies', helpTitle: 'Aide' }
    }
  };
  Object.entries(extraCopy).forEach(([lang, sections]) => {
    Object.entries(sections).forEach(([section, values]) => {
      copy[lang][section] = { ...copy[lang][section], ...values };
    });
  });

  const supported = ['pt-AO', 'en', 'fr'];
  const baseT = window.I18n.t.bind(window.I18n);
  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();

  window.I18n.currentLang = supported.includes(window.I18n.currentLang) ? window.I18n.currentLang : 'pt-AO';
  window.I18n.t = function (path) {
    const lang = this.currentLang;
    const parts = path.split('.');
    let result = copy[lang];
    for (const part of parts) result = result && result[part];
    return result === undefined ? baseT(path) : result;
  };
  window.I18n.translateText = function (text) {
    const source = String(text ?? '');
    const exact = phraseCopy[this.currentLang]?.[source];
    if (exact) return exact;
    const patterns = {
      en: [
        [/^A descarregar "(.+)" com marca d'água! 📥$/, (_, name) => `Downloading "${name}" with a watermark! 📥`],
        [/^Vídeo "(.+)" a ser transferido! 🎥$/, (_, name) => `Downloading video "${name}"! 🎥`],
        [/^Imagem "(.+)" transferida! 📸$/, (_, name) => `Image "${name}" downloaded! 📸`],
        [/^Áudio-aula "(.+)" transferida! 🎙️$/, (_, name) => `Audio "${name}" downloaded! 🎙️`],
        [/^A reproduzir "(.+)" em Full HD 1080p$/, (_, name) => `Playing "${name}" in Full HD 1080p`],
        [/^Share this link: (.+)$/, (_, link) => `Share this link: ${link}`]
      ],
      fr: [
        [/^A descarregar "(.+)" com marca d'água! 📥$/, (_, name) => `Téléchargement de "${name}" avec filigrane ! 📥`],
        [/^Vídeo "(.+)" a ser transferido! 🎥$/, (_, name) => `Téléchargement de la vidéo "${name}" ! 🎥`],
        [/^Imagem "(.+)" transferida! 📸$/, (_, name) => `Image "${name}" téléchargée ! 📸`],
        [/^Áudio-aula "(.+)" transferida! 🎙️$/, (_, name) => `Audio "${name}" téléchargé ! 🎙️`],
        [/^A reproduzir "(.+)" em Full HD 1080p$/, (_, name) => `Lecture de "${name}" en Full HD 1080p`],
        [/^Share this link: (.+)$/, (_, link) => `Partage ce lien : ${link}`]
      ]
    };
    for (const [pattern, replace] of patterns[this.currentLang] || []) {
      const match = source.match(pattern);
      if (match) return replace(...match);
    }
    return source;
  };

  window.I18n.applyDOM = function (root) {
    if (!root) return;
    const lang = this.currentLang;
    const scope = root.nodeType === Node.DOCUMENT_NODE ? root.body : root;
    if (!scope) return;

    const keyed = [];
    if (scope.matches?.('[data-i18n]')) keyed.push(scope);
    scope.querySelectorAll?.('[data-i18n]').forEach((el) => keyed.push(el));
    keyed.forEach((el) => {
      const translated = this.t(el.dataset.i18n);
      if (el.textContent !== translated) el.textContent = translated;
    });

    scope.querySelectorAll?.('[data-i18n-placeholder]').forEach((el) => {
      el.placeholder = this.t(el.dataset.i18nPlaceholder);
    });

    const skipText = 'script,style,textarea,input,code,[data-translate-ignore],.post-card__content,.post-card__user-name,.post-card__user-meta,.post-doc-title,.post-doc-subtitle,.post-video-title,.profile-bio,.comment-body-text,.avatar-placeholder';
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || parent.closest(skipText) || parent.closest('[data-i18n]')) continue;
      const raw = originalText.has(node) ? originalText.get(node) : node.nodeValue;
      originalText.set(node, raw);
      const leading = raw.match(/^\s*/)[0];
      const trailing = raw.match(/\s*$/)[0];
      const phrase = raw.trim();
      const translated = phraseCopy[lang]?.[phrase] || phrase;
      if (translated !== phrase) node.nodeValue = `${leading}${translated}${trailing}`;
      else if (lang === 'pt-AO') node.nodeValue = raw;
    }

    const elements = [];
    if (scope.nodeType === Node.ELEMENT_NODE) elements.push(scope);
    scope.querySelectorAll?.('*').forEach((el) => elements.push(el));
    elements.forEach((el) => {
      for (const attr of ['placeholder', 'aria-label', 'title']) {
        if (!el.hasAttribute(attr) || el.matches('[data-translate-ignore],.post-card__content,.post-card__user-name,.post-card__user-meta,.post-doc-title,.post-doc-subtitle,.post-video-title,.profile-bio')) continue;
        let values = originalAttributes.get(el);
        if (!values) { values = {}; originalAttributes.set(el, values); }
        if (!(attr in values)) values[attr] = el.getAttribute(attr);
        const source = values[attr];
        el.setAttribute(attr, phraseCopy[lang]?.[source] || source);
      }
    });

    if (scope === document.body && !scope.classList.contains('auth-page')) {
      document.title = this.t('ui.metaTitle');
      const description = document.querySelector('meta[name="description"]');
      if (description) description.content = this.t('ui.metaDescription');
      const shareTitle = document.querySelector('meta[property="og:title"]');
      const shareDescription = document.querySelector('meta[property="og:description"]');
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (shareTitle) shareTitle.content = this.t('ui.ogTitle');
      if (shareDescription) shareDescription.content = this.t('ui.ogDescription');
      if (twitterTitle) twitterTitle.content = this.t('ui.ogTitle');
      if (twitterDescription) twitterDescription.content = this.t('ui.ogDescription');
    }
  };

  window.I18n.setLanguage = function (lang) {
    if (!supported.includes(lang) || lang === this.currentLang) return;
    this.currentLang = lang;
    try { localStorage.setItem('impacta_lang', lang); } catch (_) { /* Storage can be unavailable in private mode. */ }
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent('impacta:langchange', { detail: { lang } }));
    this.applyDOM(document.body);
    if (!document.body.classList.contains('auth-page')) {
      document.title = this.t('ui.metaTitle');
      const description = document.querySelector('meta[name="description"]');
      if (description) description.content = this.t('ui.metaDescription');
    }
    if (window.Toast) {
      const names = { 'pt-AO': 'Português (Angola)', en: 'English', fr: 'Français' };
      window.Toast.info(`${this.t('auth.language')}: ${names[lang]}`);
    }
  };

  document.documentElement.lang = window.I18n.currentLang;
})();
