import { useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// SISTEMA DE RASTREAMENTO COMPLETO DO FUNIL - MamãeZen
// Rastreia cada clique, etapa, desistência e conversão
// ═══════════════════════════════════════════════════════════════════════════

// Eventos do funil
type TrackingEvent = 
  // Página
  | 'page_view'
  | 'page_exit'
  // Vídeo
  | 'video_screen_view'
  | 'video_start'
  | 'video_25_percent'
  | 'video_50_percent'
  | 'video_75_percent'
  | 'video_end'
  | 'video_skip'
  // Quiz
  | 'quiz_screen_view'
  | 'quiz_start'
  | 'quiz_step_1'
  | 'quiz_step_2'
  | 'quiz_step_3'
  | 'quiz_answer'
  | 'quiz_advance'
  | 'quiz_exit'
  | 'quiz_doubt'
  | 'quiz_complete'
  | 'quiz_success'
  | 'quiz_retry'
  // Conteúdo
  | 'content_unlocked'
  | 'content_view'
  | 'scroll_25_percent'
  | 'scroll_50_percent'
  | 'scroll_75_percent'
  | 'scroll_100_percent'
  // CTAs
  | 'cta_click'
  | 'cta_video_start'
  | 'cta_video_skip'
  | 'cta_quiz_start'
  | 'cta_quiz_option'
  | 'cta_show_content'
  | 'cta_retry_quiz'
  | 'cta_checkout'
  // Checkout
  | 'checkout_click'
  | 'checkout_redirect'
  // Conversão
  | 'purchase_complete';

interface EventData {
  event: TrackingEvent;
  timestamp: number;
  funnel_step: string;
  data?: Record<string, unknown>;
}

// Armazena eventos localmente
const trackingQueue: EventData[] = [];

// Etapas do funil
const FUNNEL_STEPS = {
  VIDEO: '1_video',
  QUIZ_INTRO: '2_quiz_intro',
  QUIZ_STEP_1: '3_quiz_step_1',
  QUIZ_STEP_2: '4_quiz_step_2',
  QUIZ_STEP_3: '5_quiz_step_3',
  QUIZ_RESULT: '6_quiz_result',
  RECONSIDERATION: '7_reconsideration',
  CONTENT: '8_content',
  OFFER: '9_offer',
  CHECKOUT: '10_checkout',
} as const;

// Gera ou recupera ID de sessão único
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('tracking_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('tracking_session_id', sessionId);
  }
  return sessionId;
}

// Gera ou recupera ID de usuário único (persistente)
function getUserId(): string {
  let userId = localStorage.getItem('tracking_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('tracking_user_id', userId);
  }
  return userId;
}

// Obtém o histórico do funil
function getFunnelHistory(): string[] {
  const history = sessionStorage.getItem('funnel_history');
  return history ? JSON.parse(history) : [];
}

// Adiciona etapa ao histórico
function addToFunnelHistory(step: string): void {
  const history = getFunnelHistory();
  if (!history.includes(step)) {
    history.push(step);
    sessionStorage.setItem('funnel_history', JSON.stringify(history));
  }
}

// Obtém tempo na página
function getTimeOnPage(): number {
  const startTime = sessionStorage.getItem('page_start_time');
  if (!startTime) {
    sessionStorage.setItem('page_start_time', Date.now().toString());
    return 0;
  }
  return Math.floor((Date.now() - parseInt(startTime)) / 1000);
}

export const useTracker = () => {
  // Rastrear visualização de página
  useEffect(() => {
    sessionStorage.setItem('page_start_time', Date.now().toString());
    trackEvent('page_view', { url: window.location.href }, FUNNEL_STEPS.VIDEO);

    // Rastrear saída da página
    const handleBeforeUnload = () => {
      const timeOnPage = getTimeOnPage();
      const history = getFunnelHistory();
      const lastStep = history[history.length - 1] || FUNNEL_STEPS.VIDEO;
      
      trackEvent('page_exit', {
        time_on_page_seconds: timeOnPage,
        funnel_history: history,
        last_step: lastStep,
        completed_checkout: history.includes(FUNNEL_STEPS.CHECKOUT),
      }, lastStep);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Função principal de rastreamento
  const trackEvent = useCallback((
    event: TrackingEvent, 
    data?: Record<string, unknown>,
    funnelStep?: string
  ) => {
    const step = funnelStep || 'unknown';
    addToFunnelHistory(step);

    const eventData: EventData = {
      event,
      timestamp: Date.now(),
      funnel_step: step,
      data: {
        ...data,
        session_id: getSessionId(),
        user_id: getUserId(),
        time_on_page: getTimeOnPage(),
        funnel_history: getFunnelHistory(),
        user_agent: navigator.userAgent,
        screen_size: `${window.innerWidth}x${window.innerHeight}`,
        referrer: document.referrer || 'direct',
      }
    };

    trackingQueue.push(eventData);
    
    // Log detalhado para debug
    console.log(`📊 TRACK [${step}]:`, event, {
      ...data,
      time_on_page: `${getTimeOnPage()}s`,
    });

    // Dispara evento customizado para analytics externos
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mamaezen_track', { detail: eventData }));
      
      // Google Analytics 4 (GA4) - Rastreamento Máximo
      if ((window as any).gtag) {
        // Evento principal GA4
        (window as any).gtag('event', event, {
          event_category: step,
          event_label: event,
          funnel_step: step,
          session_id: getSessionId(),
          user_id: getUserId(),
          time_on_page: getTimeOnPage(),
          ...data,
        });

        // Evento customizado para relatórios personalizados
        (window as any).gtag('event', `mz_${event}`, {
          custom_parameter_1: step,
          custom_parameter_2: event,
          custom_parameter_3: JSON.stringify(data),
          engagement_time_msec: getTimeOnPage() * 1000,
        });

        // Google Ads
        (window as any).gtag('event', event, {
          send_to: 'AW-17714282754',
          funnel_step: step,
          event_category: step,
          event_label: event,
        });
      }

      // Facebook Pixel
      if ((window as any).fbq) {
        (window as any).fbq('trackCustom', event, {
          ...data,
          funnel_step: step,
        });
      }
    }

    return eventData;
  }, []);

  // ═══════════════════════════════════════════════════════════════════════
  // VÍDEO TRACKING
  // ═══════════════════════════════════════════════════════════════════════
  
  const trackVideoScreenView = useCallback(() => {
    trackEvent('video_screen_view', { action: 'tela_video_visualizada' }, FUNNEL_STEPS.VIDEO);
  }, [trackEvent]);

  const trackVideoStart = useCallback(() => {
    trackEvent('video_start', { action: 'video_iniciado' }, FUNNEL_STEPS.VIDEO);
    trackEvent('cta_video_start', { button: 'play_video' }, FUNNEL_STEPS.VIDEO);
  }, [trackEvent]);

  const trackVideoProgress = useCallback((percent: number) => {
    if (percent >= 25 && percent < 50) {
      trackEvent('video_25_percent', { percent: 25 }, FUNNEL_STEPS.VIDEO);
    } else if (percent >= 50 && percent < 75) {
      trackEvent('video_50_percent', { percent: 50 }, FUNNEL_STEPS.VIDEO);
    } else if (percent >= 75 && percent < 100) {
      trackEvent('video_75_percent', { percent: 75 }, FUNNEL_STEPS.VIDEO);
    }
  }, [trackEvent]);

  const trackVideoEnd = useCallback(() => {
    trackEvent('video_end', { action: 'video_completo' }, FUNNEL_STEPS.VIDEO);
  }, [trackEvent]);

  const trackVideoSkip = useCallback(() => {
    trackEvent('video_skip', { action: 'video_pulado' }, FUNNEL_STEPS.VIDEO);
    trackEvent('cta_video_skip', { button: 'pular_video' }, FUNNEL_STEPS.VIDEO);
  }, [trackEvent]);

  // ═══════════════════════════════════════════════════════════════════════
  // QUIZ TRACKING
  // ═══════════════════════════════════════════════════════════════════════

  const trackQuizScreenView = useCallback(() => {
    trackEvent('quiz_screen_view', { action: 'tela_quiz_visualizada' }, FUNNEL_STEPS.QUIZ_INTRO);
  }, [trackEvent]);

  const trackQuizStart = useCallback(() => {
    trackEvent('quiz_start', { action: 'quiz_iniciado' }, FUNNEL_STEPS.QUIZ_INTRO);
    trackEvent('cta_quiz_start', { button: 'descobrir_mae_aguia' }, FUNNEL_STEPS.QUIZ_INTRO);
  }, [trackEvent]);

  const trackQuizStep = useCallback((step: number) => {
    const stepMap: Record<number, typeof FUNNEL_STEPS[keyof typeof FUNNEL_STEPS]> = {
      1: FUNNEL_STEPS.QUIZ_STEP_1,
      2: FUNNEL_STEPS.QUIZ_STEP_2,
      3: FUNNEL_STEPS.QUIZ_STEP_3,
    };
    const funnelStep = stepMap[step] || FUNNEL_STEPS.QUIZ_STEP_1;
    trackEvent(`quiz_step_${step}` as TrackingEvent, { step, action: `etapa_${step}_visualizada` }, funnelStep);
  }, [trackEvent]);

  const trackQuizAnswer = useCallback((questionId: number, answer: string, answerType: string) => {
    const stepMap: Record<number, typeof FUNNEL_STEPS[keyof typeof FUNNEL_STEPS]> = {
      1: FUNNEL_STEPS.QUIZ_STEP_1,
      2: FUNNEL_STEPS.QUIZ_STEP_2,
      3: FUNNEL_STEPS.QUIZ_STEP_3,
    };
    const funnelStep = stepMap[questionId] || FUNNEL_STEPS.QUIZ_STEP_1;
    
    trackEvent('quiz_answer', { 
      question_id: questionId, 
      answer, 
      answer_type: answerType,
      action: `resposta_${answerType}_etapa_${questionId}` 
    }, funnelStep);
    
    trackEvent('cta_quiz_option', { 
      button: `option_${answerType}`,
      question: questionId,
    }, funnelStep);
  }, [trackEvent]);

  const trackQuizAdvance = useCallback((fromStep: number, toStep: number) => {
    trackEvent('quiz_advance', { 
      from_step: fromStep, 
      to_step: toStep,
      action: `avancou_etapa_${fromStep}_para_${toStep}` 
    }, FUNNEL_STEPS.QUIZ_STEP_1);
  }, [trackEvent]);

  const trackQuizExit = useCallback((step: number, reason: string) => {
    trackEvent('quiz_exit', { 
      step, 
      reason,
      action: `desistiu_etapa_${step}` 
    }, FUNNEL_STEPS.RECONSIDERATION);
  }, [trackEvent]);

  const trackQuizDoubt = useCallback((step: number) => {
    trackEvent('quiz_doubt', { 
      step,
      action: `duvida_etapa_${step}` 
    }, FUNNEL_STEPS.RECONSIDERATION);
  }, [trackEvent]);

  const trackQuizComplete = useCallback((result: 'eagle' | 'exit' | 'doubt') => {
    trackEvent('quiz_complete', { 
      result,
      action: `quiz_finalizado_${result}` 
    }, FUNNEL_STEPS.QUIZ_RESULT);
  }, [trackEvent]);

  const trackQuizSuccess = useCallback(() => {
    trackEvent('quiz_success', { action: 'quiz_sucesso_mae_aguia' }, FUNNEL_STEPS.QUIZ_RESULT);
  }, [trackEvent]);

  const trackQuizRetry = useCallback((previousResult: string) => {
    trackEvent('quiz_retry', { 
      previous_result: previousResult,
      action: 'refazendo_quiz' 
    }, FUNNEL_STEPS.QUIZ_INTRO);
    trackEvent('cta_retry_quiz', { button: 'refazer_quiz' }, FUNNEL_STEPS.RECONSIDERATION);
  }, [trackEvent]);

  // ═══════════════════════════════════════════════════════════════════════
  // CONTENT TRACKING
  // ═══════════════════════════════════════════════════════════════════════

  const trackContentUnlocked = useCallback((method: string) => {
    trackEvent('content_unlocked', { 
      method,
      action: `conteudo_liberado_${method}` 
    }, FUNNEL_STEPS.CONTENT);
    trackEvent('cta_show_content', { button: 'ver_conteudo' }, FUNNEL_STEPS.RECONSIDERATION);
  }, [trackEvent]);

  const trackContentView = useCallback(() => {
    trackEvent('content_view', { action: 'conteudo_visualizado' }, FUNNEL_STEPS.CONTENT);
  }, [trackEvent]);

  const trackScrollDepth = useCallback((percent: number) => {
    if (percent >= 25 && percent < 50) {
      trackEvent('scroll_25_percent', { percent: 25 }, FUNNEL_STEPS.CONTENT);
    } else if (percent >= 50 && percent < 75) {
      trackEvent('scroll_50_percent', { percent: 50 }, FUNNEL_STEPS.CONTENT);
    } else if (percent >= 75 && percent < 100) {
      trackEvent('scroll_75_percent', { percent: 75 }, FUNNEL_STEPS.CONTENT);
    } else if (percent >= 100) {
      trackEvent('scroll_100_percent', { percent: 100 }, FUNNEL_STEPS.OFFER);
    }
  }, [trackEvent]);

  // ═══════════════════════════════════════════════════════════════════════
  // CTA & CHECKOUT TRACKING
  // ═══════════════════════════════════════════════════════════════════════

  const trackCTAClick = useCallback((buttonName: string, destination?: string) => {
    trackEvent('cta_click', { 
      button_name: buttonName, 
      destination,
      action: `clique_${buttonName}` 
    }, FUNNEL_STEPS.CONTENT);
  }, [trackEvent]);

  const trackCheckout = useCallback(() => {
    trackEvent('checkout_click', { 
      value: 49.90,
      currency: 'BRL',
      action: 'clique_checkout'
    }, FUNNEL_STEPS.OFFER);
    
    trackEvent('cta_checkout', { 
      button: 'ser_fundadora_agora',
      value: 49.90,
    }, FUNNEL_STEPS.OFFER);

    trackEvent('checkout_redirect', { 
      destination: 'cakto_checkout',
      action: 'redirecionando_checkout'
    }, FUNNEL_STEPS.CHECKOUT);
    
    // Google Ads Conversion tracking - Clique no checkout
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-17714282754/GNrRCK7D58kbEIKC6v5B',
        'value': 49.90,
        'currency': 'BRL',
        'transaction_id': getSessionId(),
      });
      console.log('📊 GOOGLE ADS: Conversão de checkout enviada');
    }
  }, [trackEvent]);

  // ═══════════════════════════════════════════════════════════════════════
  // UTILIDADES
  // ═══════════════════════════════════════════════════════════════════════

  const getTrackingQueue = useCallback(() => trackingQueue, []);
  const getFunnelProgress = useCallback(() => getFunnelHistory(), []);

  return {
    // Eventos gerais
    trackEvent,
    trackCTAClick,
    getTrackingQueue,
    getFunnelProgress,
    // Vídeo
    trackVideoScreenView,
    trackVideoStart,
    trackVideoProgress,
    trackVideoEnd,
    trackVideoSkip,
    // Quiz
    trackQuizScreenView,
    trackQuizStart,
    trackQuizStep,
    trackQuizAnswer,
    trackQuizAdvance,
    trackQuizExit,
    trackQuizDoubt,
    trackQuizComplete,
    trackQuizSuccess,
    trackQuizRetry,
    // Conteúdo
    trackContentUnlocked,
    trackContentView,
    trackScrollDepth,
    // Checkout
    trackCheckout,
  };
};

// Hook para contador de visualizações dinâmico
export const useViewerCount = () => {
  const getRandomViewers = () => {
    const base = Math.floor(Math.random() * 10) + 3;
    return base;
  };

  return {
    getRandomViewers,
  };
};
