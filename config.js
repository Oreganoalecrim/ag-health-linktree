// Destinos oficiais verificados. Mensagens de WhatsApp usam o número já
// publicado no Linktree oficial; nenhum endereço de produto é presumido.
const whatsapp = (message) => `https://wa.me/5547996792529?text=${encodeURIComponent(message)}`;

window.LINKTREE_CONFIG = {
  portraitUrl: 'assets/portrait.webp',
  links: [
    {
      icon: 'play',
      title: 'Vídeos e Aulas',
      description: 'Conteúdo prático e atualizado',
      url: 'https://www.youtube.com/channel/UCUqDQiJGU1Y2j3uzsHZGAYA',
    },
    {
      icon: 'book',
      title: 'Livros e E-books',
      description: 'Neurodiet, Biblical Diet e mais',
      url: 'https://lp2.revertendoalzheimer.com.br/',
    },
    {
      icon: 'brain',
      title: 'Neurodiet™',
      description: 'Prevenção e reversão do Alzheimer',
      url: whatsapp('Tenho interesse no programa Neurodiet.'),
    },
    {
      icon: 'dna',
      title: 'FutureAge™',
      description: 'Longevidade baseada em ciência',
      url: whatsapp('Tenho interesse no programa FutureAge.'),
    },
    {
      icon: 'mortar',
      title: 'Protocolos e Fórmulas',
      description: 'Guias, suplementos e prescrições',
      url: 'https://loja.infinitepay.io/agingresearch/xvq6717-manual-avancado-de-suplementos-e-nutraceut',
    },
    {
      icon: 'calendar',
      title: 'Agende sua Consulta',
      description: 'Atendimento médico integrativo',
      url: whatsapp('Olá! Gostaria de agendar uma consulta com o Dr. André Gustavo.'),
    },
  ],
  socials: [
    { label: 'Instagram', icon: 'instagram', url: 'https://instagram.com/revertendo.alzheimer' },
    { label: 'YouTube', icon: 'youtube', url: 'https://www.youtube.com/channel/UCUqDQiJGU1Y2j3uzsHZGAYA' },
    { label: 'WhatsApp', icon: 'whatsapp', url: 'https://wa.me/5547996792529' },
    { label: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com/in/doutorandregustavo' },
    { label: 'Spotify', icon: 'spotify', disabled: true },
  ],
  continueUrl: whatsapp('Olá! Gostaria de conhecer os projetos e agendar uma conversa com a equipe do Dr. André.'),
  officialSite: 'https://agclinic.com.br',
};
