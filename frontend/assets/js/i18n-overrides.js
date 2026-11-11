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
        illustrationAlt: 'Estudante a aprender com materiais e ideias da comunidade'
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
        illustrationAlt: 'Student learning with materials and ideas from the community'
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
        illustrationAlt: 'Étudiante qui apprend avec les ressources et les idées de la communauté'
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
      'Following': 'A seguir', 'Study materials': 'Materiais de estudo', 'Download': 'Descarregar',
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
      'Downloaded!': 'Transferido!', 'Play audio': 'Ouvir áudio',
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
      'Filtros aplicados!': 'Filters applied!', 'Marcaste como útil!': 'Marked as helpful!',
      'Guardado na tua coleção de estudos!': 'Saved to your study collection!',
      'Agora estás a acompanhar este colega!': 'You are now following this person!',
      'Bem-vindo à comunidade académica!': 'Welcome to the learning community!',
      '🔄 Troca de Conta — Funcionalidade de múltiplos perfis!': '🔄 Account switching is coming soon.',
      'Comentário publicado!': 'Comment posted!', 'Não foi possível partilhar.': 'Could not share.',
      'Ligação copiada! 📋': 'Link copied! 📋', 'Conteúdo actualizado!': 'Content refreshed!'
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
      'Filtros aplicados!': 'Filtres appliqués !', 'Marcaste como útil!': 'Marqué comme utile !',
      'Guardado na tua coleção de estudos!': 'Enregistré dans tes ressources !',
      'Agora estás a acompanhar este colega!': 'Tu suis maintenant cette personne !',
      'Bem-vindo à comunidade académica!': 'Bienvenue dans la communauté d’apprentissage !',
      '🔄 Troca de Conta — Funcionalidade de múltiplos perfis!': '🔄 Le changement de compte sera bientôt disponible.',
      'Comentário publicado!': 'Commentaire publié !', 'Não foi possível partilhar.': 'Impossible de partager.',
      'Ligação copiada! 📋': 'Lien copié ! 📋', 'Conteúdo actualizado!': 'Contenu actualisé !'
    }
  };

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

    const skipText = 'script,style,textarea,input,code,[data-translate-ignore],.post-card__content,.post-card__user-name,.post-card__user-meta,.post-doc-title,.post-doc-subtitle,.post-video-title,.profile-bio,.avatar-placeholder';
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
