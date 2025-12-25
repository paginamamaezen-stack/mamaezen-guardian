import { useEffect, useCallback } from 'react';

// Tipos de eventos para rastreamento
type TrackingEvent = 
  | 'page_view'
  | 'video_start'
  | 'video_end'
  | 'video_skip'
  | 'quiz_start'
  | 'quiz_answer'
  | 'quiz_complete'
  | 'quiz_exit'
  | 'quiz_doubt'
  | 'quiz_advance'
  | 'quiz_success'
  | 'quiz_retry'
  | 'content_unlocked'
  | 'cta_click'
  | 'checkout_click'
  | 'scroll_depth';

interface EventData {
  event: TrackingEvent;
  timestamp: number;
  data?: Record<string, unknown>;
}

// Armazena eventos localmente (pode ser enviado para API depois)
const trackingQueue: EventData[] = [];

export const useTracker = () => {
  // Rastrear visualização de página
  useEffect(() => {
    trackEvent('page_view', { url: window.location.href });
  }, []);

  // Função principal de rastreamento
  const trackEvent = useCallback((event: TrackingEvent, data?: Record<string, unknown>) => {
    const eventData: EventData = {
      event,
      timestamp: Date.now(),
      data: {
        ...data,
        sessionId: getSessionId(),
        userAgent: navigator.userAgent,
      }
    };

    trackingQueue.push(eventData);
    
    // Log para debug (remove em produção)
    console.log('📊 Track:', event, data);

    // Dispara evento customizado para analytics externos (Google Analytics, Facebook Pixel, etc.)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lovable_track', { detail: eventData }));
      
      // Google Analytics (se configurado)
      if ((window as any).gtag) {
        (window as any).gtag('event', event, data);
      }

      // Facebook Pixel (se configurado)
      if ((window as any).fbq) {
        (window as any).fbq('track', event, data);
      }
    }
  }, []);

  // Rastrear cliques em CTAs
  const trackCTAClick = useCallback((buttonName: string, destination?: string) => {
    trackEvent('cta_click', { buttonName, destination });
  }, [trackEvent]);

  // Rastrear checkout com conversão do Google Ads
  const trackCheckout = useCallback(() => {
    trackEvent('checkout_click', { 
      value: 49.90,
      currency: 'BRL'
    });
    
    // Google Ads Conversion tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-17714282754/GNrRCK7D58kbEIKC6v5B',
        'value': 49.90,
        'currency': 'BRL'
      });
    }
  }, [trackEvent]);

  // Rastrear quiz
  const trackQuizStart = useCallback(() => {
    trackEvent('quiz_start');
  }, [trackEvent]);

  const trackQuizAnswer = useCallback((questionId: number, answer: string) => {
    trackEvent('quiz_answer', { questionId, answer });
  }, [trackEvent]);

  const trackQuizComplete = useCallback((result: string) => {
    trackEvent('quiz_complete', { result });
  }, [trackEvent]);

  // Rastrear vídeo
  const trackVideoStart = useCallback(() => {
    trackEvent('video_start');
  }, [trackEvent]);

  const trackVideoEnd = useCallback(() => {
    trackEvent('video_end');
  }, [trackEvent]);

  const trackVideoSkip = useCallback(() => {
    trackEvent('video_skip');
  }, [trackEvent]);

  return {
    trackEvent,
    trackCTAClick,
    trackCheckout,
    trackQuizStart,
    trackQuizAnswer,
    trackQuizComplete,
    trackVideoStart,
    trackVideoEnd,
    trackVideoSkip,
  };
};

// Gera ou recupera ID de sessão único
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('tracking_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('tracking_session_id', sessionId);
  }
  return sessionId;
}

// Hook para contador de visualizações dinâmico
export const useViewerCount = () => {
  const getRandomViewers = () => {
    // Base entre 3 e 12 pessoas
    const base = Math.floor(Math.random() * 10) + 3;
    return base;
  };

  return {
    getRandomViewers,
  };
};
