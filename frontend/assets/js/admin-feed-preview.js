/* Pré-visualização local das cinco publicações que o bootstrap cria na base. */
(function () {
  'use strict';
  if (typeof IMPACTA_DATA === 'undefined') return;

  Object.assign(IMPACTA_DATA.currentUser, {
    id: 'u0',
    name: 'Abel Dengue',
    handle: '@abel.dengue',
    avatar: null,
    initials: 'AD',
    university: 'Impacta · Angola',
    faculty: 'Comunidade de aprendizagem',
    verified: true,
    isAdmin: true,
    bio: 'Criador da Impacta. Interessado em educação e partilha de conhecimento.',
    followers: 0,
    following: 0,
    posts: 5,
    status: 'available',
    role: 'creator',
    preferredLang: 'pt-AO',
    socialLinks: {}
  });

  IMPACTA_DATA.posts = [
    {
      id: 'admin-post-welcome', userId: 'u0', userName: 'Abel Dengue', userUni: 'Impacta · Angola',
      userInitials: 'AD', verified: true, time: 'Conta oficial',
      content: 'Bem-vindo à Impacta. Este é um espaço para aprender, partilhar ideias e trocar experiências com pessoas que também querem avançar.',
      hashtags: ['#Impacta', '#Aprendizagem'], mediaType: 'none', likes: 0, comments: 0, shares: 0, liked: false, saved: false
    },
    {
      id: 'admin-post-questions', userId: 'u0', userName: 'Abel Dengue', userUni: 'Impacta · Angola',
      userInitials: 'AD', verified: true, time: 'Conta oficial',
      content: 'Tens uma dúvida sobre uma matéria? Explica o que já tentaste e pergunta à comunidade. Uma boa conversa pode ajudar toda a gente a aprender.',
      hashtags: ['#Estudo', '#Dúvidas'], mediaType: 'none', likes: 0, comments: 0, shares: 0, liked: false, saved: false
    },
    {
      id: 'admin-post-materials', userId: 'u0', userName: 'Abel Dengue', userUni: 'Impacta · Angola',
      userInitials: 'AD', verified: true, time: 'Conta oficial',
      content: 'Partilha apontamentos, exercícios e outros materiais que possam ajudar os teus colegas. Confirma sempre a fonte e os direitos de utilização antes de publicar.',
      hashtags: ['#MateriaisDeEstudo', '#Partilha'], mediaType: 'none', likes: 0, comments: 0, shares: 0, liked: false, saved: false
    },
    {
      id: 'admin-post-groups', userId: 'u0', userName: 'Abel Dengue', userUni: 'Impacta · Angola',
      userInitials: 'AD', verified: true, time: 'Conta oficial',
      content: 'Estudar em grupo ajuda a trocar explicações e pontos de vista. Encontra colegas da tua área ou cria uma comunidade para estudarem juntos.',
      hashtags: ['#GruposDeEstudo', '#Comunidade'], mediaType: 'none', likes: 0, comments: 0, shares: 0, liked: false, saved: false
    },
    {
      id: 'admin-post-introduction', userId: 'u0', userName: 'Abel Dengue', userUni: 'Impacta · Angola',
      userInitials: 'AD', verified: true, time: 'Conta oficial',
      content: 'Conta à comunidade o que estás a estudar, os temas que te interessam e aquilo em que podes ajudar. A Impacta começa com as pessoas que participam.',
      hashtags: ['#Apresentação', '#Impacta'], mediaType: 'none', likes: 0, comments: 0, shares: 0, liked: false, saved: false
    }
  ];
})();
