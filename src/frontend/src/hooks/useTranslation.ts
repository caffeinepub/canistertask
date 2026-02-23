import { useState, useEffect } from 'react';

type Language = 'pt' | 'en';

const translations = {
  pt: {
    nav: {
      home: 'Home',
      tasks: 'Tasks',
      myProfile: 'MEU PERFIL',
      workers: 'Workers',
      admin: 'Admin',
    },
    auth: {
      login: 'Entrar',
      logout: 'Sair',
      loggingIn: 'Entrando...',
    },
    footer: {
      tagline: 'Gig Economy Soberana ICP',
      navigation: 'Navegação',
      links: 'Links',
      legal: 'Legal',
      platform: 'Plataforma',
      intermediation: 'Plataforma intermediação',
      about: 'Sobre',
      privacy: 'Privacidade',
      terms: 'Termos',
      cookies: 'Cookies',
      legalText: 'Conformidade GDPR e EU Platform Work Directive',
    },
    dashboard: {
      welcome: 'Bem-vindo',
      subtitle: 'Aqui estão as suas tarefas disponíveis',
      availableTasks: 'Tarefas Disponíveis',
    },
    about: {
      title: 'Sobre o CanisterTask',
      creator: 'Criado por Hermínio Coragem, Évora PT',
    },
    privacy: {
      title: 'Política de Privacidade',
    },
    terms: {
      title: 'Termos de Serviço',
    },
    cookies: {
      title: 'Política de Cookies',
      bannerTitle: 'Usamos cookies essenciais',
      bannerMessage: 'Utilizamos apenas cookies essenciais para o funcionamento da plataforma.',
      accept: 'Aceitar',
      configure: 'Configurar',
      moreInfo: 'Mais Informações',
    },
    notifications: {
      newTask: 'Nova tarefa disponível',
      unread: 'Notificações não lidas',
      youHave: 'Você tem',
      newNotifications: 'novas notificações',
    },
    workers: {
      title: 'Workers Disponíveis',
      subtitle: 'Encontre trabalhadores qualificados na sua região',
      searchPlaceholder: 'Pesquisar por nome ou competências...',
      noResults: 'Nenhum worker encontrado',
      available: 'Disponível',
      skills: 'Competências',
      earnings: 'GANHOS',
      hire: 'Contratar',
      viewTasks: 'Ver tasks',
    },
    profile: {
      myProfile: 'Meu Perfil',
      editProfile: 'Editar Perfil',
      statsAnalytics: 'Estatísticas e Análises',
      workerProfile: 'Perfil do Trabalhador',
      publicView: 'Vista Pública',
    },
    admin: {
      dashboard: 'Dashboard Admin',
      todayStats: 'Estatísticas de Hoje',
      platformFee: 'Taxa Plataforma (7%)',
      feeActive: '7% fee ativo',
      earnings: 'Ganhos',
      acceptedTasks: 'Tasks Aceites',
    },
  },
  en: {
    nav: {
      home: 'Home',
      tasks: 'Tasks',
      myProfile: 'MY PROFILE',
      workers: 'Workers',
      admin: 'Admin',
    },
    auth: {
      login: 'Login',
      logout: 'Logout',
      loggingIn: 'Logging in...',
    },
    footer: {
      tagline: 'Sovereign ICP Gig Economy',
      navigation: 'Navigation',
      links: 'Links',
      legal: 'Legal',
      platform: 'Platform',
      intermediation: 'Intermediation platform',
      about: 'About',
      privacy: 'Privacy',
      terms: 'Terms',
      cookies: 'Cookies',
      legalText: 'GDPR and EU Platform Work Directive compliance',
    },
    dashboard: {
      welcome: 'Welcome',
      subtitle: 'Here are your available tasks',
      availableTasks: 'Available Tasks',
    },
    about: {
      title: 'About CanisterTask',
      creator: 'Created by Hermínio Coragem, Évora PT',
    },
    privacy: {
      title: 'Privacy Policy',
    },
    terms: {
      title: 'Terms of Service',
    },
    cookies: {
      title: 'Cookie Policy',
      bannerTitle: 'We use essential cookies',
      bannerMessage: 'We only use essential cookies for the platform to function.',
      accept: 'Accept',
      configure: 'Configure',
      moreInfo: 'More Information',
    },
    notifications: {
      newTask: 'New task available',
      unread: 'Unread notifications',
      youHave: 'You have',
      newNotifications: 'new notifications',
    },
    workers: {
      title: 'Available Workers',
      subtitle: 'Find qualified workers in your region',
      searchPlaceholder: 'Search by name or skills...',
      noResults: 'No workers found',
      available: 'Available',
      skills: 'Skills',
      earnings: 'EARNINGS',
      hire: 'Hire',
      viewTasks: 'View tasks',
    },
    profile: {
      myProfile: 'My Profile',
      editProfile: 'Edit Profile',
      statsAnalytics: 'Stats & Analytics',
      workerProfile: 'Worker Profile',
      publicView: 'Public View',
    },
    admin: {
      dashboard: 'Admin Dashboard',
      todayStats: "Today's Stats",
      platformFee: 'Platform Fee (7%)',
      feeActive: '7% fee active',
      earnings: 'Earnings',
      acceptedTasks: 'Accepted Tasks',
    },
  },
};

export function useTranslation() {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    return (stored === 'pt' || stored === 'en' ? stored : 'pt') as Language;
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        return key;
      }
    }

    return value as string;
  };

  return { language, setLanguage, t };
}
