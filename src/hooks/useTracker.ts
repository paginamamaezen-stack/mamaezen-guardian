import { useEffect, useCallback, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// SISTEMA DE RASTREAMENTO MÁXIMO DO FUNIL - MamãeZen
// Rastreia TUDO: cada clique, hover, scroll, tempo, desistência e conversão
// ═══════════════════════════════════════════════════════════════════════════

// Todos os eventos rastreáveis
type TrackingEvent = 
  // Página
  | 'page_view' | 'page_exit' | 'page_focus' | 'page_blur'
  // Vídeo
  | 'video_screen_view' | 'video_start' | 'video_pause' | 'video_resume'
  | 'video_25_percent' | 'video_50_percent' | 'video_75_percent' | 'video_end' | 'video_skip'
  | 'video_interaction' | 'video_sound_on' | 'video_sound_off'
  // Quiz
  | 'quiz_screen_view' | 'quiz_start' | 'quiz_step_1' | 'quiz_step_2' | 'quiz_step_3'
  | 'quiz_answer' | 'quiz_advance' | 'quiz_exit' | 'quiz_doubt' | 'quiz_complete'
  | 'quiz_success' | 'quiz_retry' | 'quiz_hesitation' | 'quiz_option_hover'
  // Conteúdo
  | 'content_unlocked' | 'content_view' | 'content_section_view'
  | 'scroll_25_percent' | 'scroll_50_percent' | 'scroll_75_percent' | 'scroll_100_percent'
  // CTAs
  | 'cta_click' | 'cta_hover' | 'cta_video_start' | 'cta_video_skip'
  | 'cta_quiz_start' | 'cta_quiz_option' | 'cta_show_content' | 'cta_retry_quiz' | 'cta_checkout'
  // Checkout
  | 'checkout_click' | 'checkout_redirect' | 'checkout_intent'
  // Engajamento
  | 'engagement_high' | 'engagement_medium' | 'engagement_low'
  | 'user_active' | 'user_idle' | 'user_returned'
  // Conversão
  | 'purchase_intent' | 'purchase_complete' | 'purchase_abandoned';

interface EventData {
  event: TrackingEvent;
  timestamp: number;
  funnel_step: string;
  data?: Record<string, unknown>;
}

// Armazena eventos localmente
const trackingQueue: EventData[] = [];

// Etapas do funil com pesos de engajamento
const FUNNEL_STEPS = {
  VIDEO: { name: '1_video', weight: 10 },
  QUIZ_INTRO: { name: '2_quiz_intro', weight: 20 },
  QUIZ_STEP_1: { name: '3_quiz_step_1', weight: 30 },
  QUIZ_STEP_2: { name: '4_quiz_step_2', weight: 40 },
  QUIZ_STEP_3: { name: '5_quiz_step_3', weight: 50 },
  QUIZ_RESULT: { name: '6_quiz_result', weight: 60 },
  RECONSIDERATION: { name: '7_reconsideration', weight: 35 },
  CONTENT: { name: '8_content', weight: 70 },
  OFFER: { name: '9_offer', weight: 80 },
  CHECKOUT: { name: '10_checkout', weight: 100 },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// FUNÇÕES DE ID E SESSÃO
// ═══════════════════════════════════════════════════════════════════════════

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('mz_session_id');
  if (!sessionId) {
    sessionId = `mz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('mz_session_id', sessionId);
  }
  return sessionId;
}

function getUserId(): string {
  let userId = localStorage.getItem('mz_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('mz_user_id', userId);
  }
  return userId;
}

function getFunnelHistory(): string[] {
  const history = sessionStorage.getItem('funnel_history');
  return history ? JSON.parse(history) : [];
}

function addToFunnelHistory(step: string): void {
  const history = getFunnelHistory();
  if (!history.includes(step)) {
    history.push(step);
    sessionStorage.setItem('funnel_history', JSON.stringify(history));
  }
}

function getTimeOnPage(): number {
  const startTime = sessionStorage.getItem('mz_page_start');
  if (!startTime) {
    sessionStorage.setItem('mz_page_start', Date.now().toString());
    return 0;
  }
  return Math.floor((Date.now() - parseInt(startTime)) / 1000);
}

function getEngagementScore(): number {
  const history = getFunnelHistory();
  let score = 0;
  Object.values(FUNNEL_STEPS).forEach(step => {
    if (history.includes(step.name)) {
      score += step.weight;
    }
  });
  return Math.min(score, 100);
}

function getDeviceInfo() {
  const ua = navigator.userAgent;
  return {
    is_mobile: /Mobile|Android|iPhone/i.test(ua),
    is_tablet: /iPad|Tablet/i.test(ua),
    is_desktop: !/Mobile|Android|iPhone|iPad|Tablet/i.test(ua),
    browser: ua.match(/(Chrome|Safari|Firefox|Edge|Opera)/i)?.[1] || 'unknown',
    os: ua.match(/(Windows|Mac|Linux|Android|iOS)/i)?.[1] || 'unknown',
  };
}

function getTrafficSource() {
  const referrer = document.referrer;
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    referrer: referrer || 'direct',
    utm_source: urlParams.get('utm_source') || 'organic',
    utm_medium: urlParams.get('utm_medium') || 'none',
    utm_campaign: urlParams.get('utm_campaign') || 'none',
    utm_content: urlParams.get('utm_content') || 'none',
    utm_term: urlParams.get('utm_term') || 'none',
    gclid: urlParams.get('gclid') || 'none',
    fbclid: urlParams.get('fbclid') || 'none',
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

export const useTracker = () => {
  const lastActivityRef = useRef(Date.now());
  const idleTimeoutRef = useRef<NodeJS.Timeout>();

  // Rastrear visualização de página e configurar listeners
  useEffect(() => {
    sessionStorage.setItem('mz_page_start', Date.now().toString());
    
    // Evento de page view com dados completos
    trackEvent('page_view', { 
      url: window.location.href,
      ...getTrafficSource(),
      ...getDeviceInfo(),
    }, FUNNEL_STEPS.VIDEO.name);

    // Rastrear foco/blur da janela
    const handleFocus = () => {
      trackEvent('page_focus', { action: 'user_returned_to_tab' }, 'engagement');
      trackEvent('user_returned', { idle_time: Math.floor((Date.now() - lastActivityRef.current) / 1000) }, 'engagement');
    };
    
    const handleBlur = () => {
      trackEvent('page_blur', { action: 'user_left_tab', time_on_page: getTimeOnPage() }, 'engagement');
    };

    // Rastrear atividade do usuário
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      
      // Reset idle timeout
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = setTimeout(() => {
        trackEvent('user_idle', { idle_seconds: 30 }, 'engagement');
      }, 30000);
    };

    // Rastrear saída da página
    const handleBeforeUnload = () => {
      const timeOnPage = getTimeOnPage();
      const history = getFunnelHistory();
      const lastStep = history[history.length - 1] || FUNNEL_STEPS.VIDEO.name;
      const engagementScore = getEngagementScore();
      
      const exitData = {
        time_on_page_seconds: timeOnPage,
        funnel_history: history.join(' > '),
        funnel_steps_count: history.length,
        last_step: lastStep,
        engagement_score: engagementScore,
        completed_checkout: history.includes(FUNNEL_STEPS.CHECKOUT.name),
        reached_offer: history.includes(FUNNEL_STEPS.OFFER.name),
        completed_quiz: history.includes(FUNNEL_STEPS.QUIZ_RESULT.name),
        ...getDeviceInfo(),
      };
      
      trackEvent('page_exit', exitData, lastStep);
      
      // Classificar tipo de saída
      if (!history.includes(FUNNEL_STEPS.CHECKOUT.name) && history.includes(FUNNEL_STEPS.OFFER.name)) {
        trackEvent('purchase_abandoned', { step: 'offer_viewed_not_clicked' }, FUNNEL_STEPS.OFFER.name);
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('mousemove', handleActivity, { passive: true });
    window.addEventListener('touchstart', handleActivity, { passive: true });
    window.addEventListener('keydown', handleActivity, { passive: true });

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, []);

  // ═══════════════════════════════════════════════════════════════════════
  // FUNÇÃO PRINCIPAL DE RASTREAMENTO
  // ═══════════════════════════════════════════════════════════════════════

  const trackEvent = useCallback((
    event: TrackingEvent, 
    data?: Record<string, unknown>,
    funnelStep?: string
  ) => {
    const step = funnelStep || 'unknown';
    addToFunnelHistory(step);

    const enrichedData = {
      ...data,
      session_id: getSessionId(),
      user_id: getUserId(),
      time_on_page: getTimeOnPage(),
      engagement_score: getEngagementScore(),
      funnel_history: getFunnelHistory().join(' > '),
      funnel_depth: getFunnelHistory().length,
      screen_size: `${window.innerWidth}x${window.innerHeight}`,
      viewport: `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`,
      scroll_position: window.scrollY,
      timestamp_local: new Date().toISOString(),
      ...getDeviceInfo(),
    };

    const eventData: EventData = {
      event,
      timestamp: Date.now(),
      funnel_step: step,
      data: enrichedData,
    };

    trackingQueue.push(eventData);
    
    // Log detalhado
    console.log(`📊 [${step}] ${event}`, {
      time: `${getTimeOnPage()}s`,
      score: `${getEngagementScore()}%`,
      ...data,
    });

    // Enviar para analytics
    if (typeof window !== 'undefined') {
      // Evento customizado
      window.dispatchEvent(new CustomEvent('mamaezen_track', { detail: eventData }));
      
      // Google Analytics 4 + Google Ads via função global
      if ((window as any).mzTrack) {
        (window as any).mzTrack(event, {
          funnel_step: step,
          engagement_score: getEngagementScore(),
          ...data,
        });
      }

      // GA4 diretamente também
      if ((window as any).gtag) {
        // Evento principal
        (window as any).gtag('event', event, {
          event_category: step,
          event_label: event,
          funnel_step: step,
          session_id: getSessionId(),
          user_id: getUserId(),
          time_on_page: getTimeOnPage(),
          engagement_score: getEngagementScore(),
          non_interaction: false,
          ...data,
        });

        // Evento prefixado para relatórios
        (window as any).gtag('event', `mz_${event}`, {
          custom_funnel_step: step,
          custom_engagement: getEngagementScore(),
          custom_time: getTimeOnPage(),
          engagement_time_msec: getTimeOnPage() * 1000,
        });

        // Google Ads
        (window as any).gtag('event', event, {
          send_to: 'AW-17714282754',
          funnel_step: step,
          event_category: step,
          event_label: event,
          value: getEngagementScore() / 100,
        });
      }

      // Facebook Pixel
      if ((window as any).fbq) {
        (window as any).fbq('trackCustom', event, {
          funnel_step: step,
          engagement_score: getEngagementScore(),
          ...data,
        });
      }
    }

    return eventData;
  }, []);

  // ═══════════════════════════════════════════════════════════════════════
  // VÍDEO TRACKING
  // ═══════════════════════════════════════════════════════════════════════
  
  const trackVideoScreenView = useCallback(() => {
    trackEvent('video_screen_view', { action: 'tela_video_visualizada' }, FUNNEL_STEPS.VIDEO.name);
  }, [trackEvent]);

  const trackVideoStart = useCallback(() => {
    trackEvent('video_start', { action: 'video_iniciado' }, FUNNEL_STEPS.VIDEO.name);
    trackEvent('cta_video_start', { button: 'play_video' }, FUNNEL_STEPS.VIDEO.name);
  }, [trackEvent]);

  const trackVideoProgress = useCallback((percent: number) => {
    if (percent >= 25 && percent < 50) {
      trackEvent('video_25_percent', { percent: 25 }, FUNNEL_STEPS.VIDEO.name);
    } else if (percent >= 50 && percent < 75) {
      trackEvent('video_50_percent', { percent: 50 }, FUNNEL_STEPS.VIDEO.name);
    } else if (percent >= 75 && percent < 100) {
      trackEvent('video_75_percent', { percent: 75 }, FUNNEL_STEPS.VIDEO.name);
    }
  }, [trackEvent]);

  const trackVideoEnd = useCallback(() => {
    trackEvent('video_end', { action: 'video_completo' }, FUNNEL_STEPS.VIDEO.name);
  }, [trackEvent]);

  const trackVideoSkip = useCallback(() => {
    trackEvent('video_skip', { action: 'video_pulado' }, FUNNEL_STEPS.VIDEO.name);
    trackEvent('cta_video_skip', { button: 'pular_video' }, FUNNEL_STEPS.VIDEO.name);
  }, [trackEvent]);

  // ═══════════════════════════════════════════════════════════════════════
  // QUIZ TRACKING
  // ═══════════════════════════════════════════════════════════════════════

  const trackQuizScreenView = useCallback(() => {
    trackEvent('quiz_screen_view', { action: 'tela_quiz_visualizada' }, FUNNEL_STEPS.QUIZ_INTRO.name);
  }, [trackEvent]);

  const trackQuizStart = useCallback(() => {
    trackEvent('quiz_start', { action: 'quiz_iniciado' }, FUNNEL_STEPS.QUIZ_INTRO.name);
    trackEvent('cta_quiz_start', { button: 'descobrir_mae_aguia' }, FUNNEL_STEPS.QUIZ_INTRO.name);
  }, [trackEvent]);

  const trackQuizStep = useCallback((step: number) => {
    const stepMap: Record<number, string> = {
      1: FUNNEL_STEPS.QUIZ_STEP_1.name,
      2: FUNNEL_STEPS.QUIZ_STEP_2.name,
      3: FUNNEL_STEPS.QUIZ_STEP_3.name,
    };
    const funnelStep = stepMap[step] || FUNNEL_STEPS.QUIZ_STEP_1.name;
    trackEvent(`quiz_step_${step}` as TrackingEvent, { step, action: `etapa_${step}_visualizada` }, funnelStep);
  }, [trackEvent]);

  const trackQuizAnswer = useCallback((questionId: number, answer: string, answerType: string) => {
    const stepMap: Record<number, string> = {
      1: FUNNEL_STEPS.QUIZ_STEP_1.name,
      2: FUNNEL_STEPS.QUIZ_STEP_2.name,
      3: FUNNEL_STEPS.QUIZ_STEP_3.name,
    };
    const funnelStep = stepMap[questionId] || FUNNEL_STEPS.QUIZ_STEP_1.name;
    
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
    }, FUNNEL_STEPS.QUIZ_STEP_1.name);
  }, [trackEvent]);

  const trackQuizExit = useCallback((step: number, reason: string) => {
    trackEvent('quiz_exit', { 
      step, 
      reason,
      action: `desistiu_etapa_${step}` 
    }, FUNNEL_STEPS.RECONSIDERATION.name);
  }, [trackEvent]);

  const trackQuizDoubt = useCallback((step: number) => {
    trackEvent('quiz_doubt', { 
      step,
      action: `duvida_etapa_${step}` 
    }, FUNNEL_STEPS.RECONSIDERATION.name);
  }, [trackEvent]);

  const trackQuizComplete = useCallback((result: 'eagle' | 'exit' | 'doubt') => {
    trackEvent('quiz_complete', { 
      result,
      action: `quiz_finalizado_${result}` 
    }, FUNNEL_STEPS.QUIZ_RESULT.name);
  }, [trackEvent]);

  const trackQuizSuccess = useCallback(() => {
    trackEvent('quiz_success', { action: 'quiz_sucesso_mae_aguia' }, FUNNEL_STEPS.QUIZ_RESULT.name);
  }, [trackEvent]);

  const trackQuizRetry = useCallback((previousResult: string) => {
    trackEvent('quiz_retry', { 
      previous_result: previousResult,
      action: 'refazendo_quiz' 
    }, FUNNEL_STEPS.QUIZ_INTRO.name);
    trackEvent('cta_retry_quiz', { button: 'refazer_quiz' }, FUNNEL_STEPS.RECONSIDERATION.name);
  }, [trackEvent]);

  // ═══════════════════════════════════════════════════════════════════════
  // CONTENT TRACKING
  // ═══════════════════════════════════════════════════════════════════════

  const trackContentUnlocked = useCallback((method: string) => {
    trackEvent('content_unlocked', { 
      method,
      action: `conteudo_liberado_${method}` 
    }, FUNNEL_STEPS.CONTENT.name);
    trackEvent('cta_show_content', { button: 'ver_conteudo' }, FUNNEL_STEPS.RECONSIDERATION.name);
  }, [trackEvent]);

  const trackContentView = useCallback(() => {
    trackEvent('content_view', { action: 'conteudo_visualizado' }, FUNNEL_STEPS.CONTENT.name);
  }, [trackEvent]);

  const trackScrollDepth = useCallback((percent: number) => {
    if (percent >= 25 && percent < 50) {
      trackEvent('scroll_25_percent', { percent: 25 }, FUNNEL_STEPS.CONTENT.name);
    } else if (percent >= 50 && percent < 75) {
      trackEvent('scroll_50_percent', { percent: 50 }, FUNNEL_STEPS.CONTENT.name);
    } else if (percent >= 75 && percent < 100) {
      trackEvent('scroll_75_percent', { percent: 75 }, FUNNEL_STEPS.CONTENT.name);
    } else if (percent >= 100) {
      trackEvent('scroll_100_percent', { percent: 100 }, FUNNEL_STEPS.OFFER.name);
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
    }, FUNNEL_STEPS.CONTENT.name);
  }, [trackEvent]);

  const trackCTAHover = useCallback((buttonName: string) => {
    trackEvent('cta_hover', { 
      button_name: buttonName, 
      action: `hover_${buttonName}` 
    }, FUNNEL_STEPS.CONTENT.name);
  }, [trackEvent]);

  const trackCheckoutIntent = useCallback(() => {
    trackEvent('checkout_intent', { 
      action: 'usuario_demonstrou_interesse_checkout'
    }, FUNNEL_STEPS.OFFER.name);
  }, [trackEvent]);

  const trackCheckout = useCallback(() => {
    trackEvent('checkout_click', { 
      value: 49.90,
      currency: 'BRL',
      action: 'clique_checkout'
    }, FUNNEL_STEPS.OFFER.name);
    
    trackEvent('cta_checkout', { 
      button: 'ser_fundadora_agora',
      value: 49.90,
    }, FUNNEL_STEPS.OFFER.name);

    trackEvent('checkout_redirect', { 
      destination: 'cakto_checkout',
      action: 'redirecionando_checkout'
    }, FUNNEL_STEPS.CHECKOUT.name);
    
    trackEvent('purchase_intent', {
      value: 49.90,
      currency: 'BRL',
      action: 'intencao_compra_confirmada'
    }, FUNNEL_STEPS.CHECKOUT.name);
    
    // Google Ads Conversion tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-17714282754/GNrRCK7D58kbEIKC6v5B',
        'value': 49.90,
        'currency': 'BRL',
        'transaction_id': getSessionId(),
      });
      
      // Enhanced conversion
      (window as any).gtag('event', 'begin_checkout', {
        currency: 'BRL',
        value: 49.90,
        items: [{
          item_id: 'mamaezen_fundadora',
          item_name: 'MamãeZen Fundadora',
          price: 49.90,
          quantity: 1
        }]
      });
      
      console.log('📊 GOOGLE ADS: Conversão de checkout enviada');
    }
  }, [trackEvent]);

  // ═══════════════════════════════════════════════════════════════════════
  // UTILIDADES
  // ═══════════════════════════════════════════════════════════════════════

  const getTrackingQueue = useCallback(() => trackingQueue, []);
  const getFunnelProgress = useCallback(() => getFunnelHistory(), []);
  const getCurrentEngagement = useCallback(() => getEngagementScore(), []);

  return {
    // Eventos gerais
    trackEvent,
    trackCTAClick,
    trackCTAHover,
    getTrackingQueue,
    getFunnelProgress,
    getCurrentEngagement,
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
    trackCheckoutIntent,
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
