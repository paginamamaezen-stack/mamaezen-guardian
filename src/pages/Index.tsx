import { useState, useRef, useEffect } from "react";
import avatarMaeAguia from "@/assets/avatar-mae-aguia.png";
import heroIntroVideo from "@/assets/hero-intro-video.mp4";
import heroVideo from "@/assets/hero-video.mp4";
import { useTracker } from "@/hooks/useTracker";
import Footer from "@/components/landing/Footer";

const CHECKOUT_URL = "https://pay.cakto.com.br/c88zju2_683076";

// Quiz com 3 etapas
const quizQuestions = [
  {
    id: 1,
    intro: "A cada 15 segundos uma mulher está sofrendo sem saber colocar seu bebê para arrotar",
    warning: "3 coisas podem acontecer: Engasgo, Desengasgo ou a morte",
    question: "VOCÊ ESTÁ PREPARADA PARA ESSA SITUAÇÃO?",
    options: [
      { 
        text: "Não sei me virar, tenho minha mamãe. Esse conteúdo não é pra mim", 
        type: "exit" 
      },
      { 
        text: "QUERO PROTEGER MEU FILHOTE! SOU UMA MÃE ÁGUIA", 
        type: "advance" 
      },
    ],
  },
  {
    id: 2,
    intro: "Nosso Kit não é de qualquer um. Eu entendo a sua dor...",
    warning: "A maioria das vezes essa tristeza vem de mães que ainda não descobriram o que é ser mãe...",
    question: "Com nosso kit você vai se tornar uma MÃE ÁGUIA",
    options: [
      { 
        text: "Esse kit não é pra mim. Tenho minha mamãe pra me ajudar", 
        type: "exit" 
      },
      { 
        text: "EU QUERO ESSE KIT! SOU UMA MÃE RESPONSÁVEL", 
        type: "advance" 
      },
      { 
        text: "Estou em dúvida por causa do dinheiro...", 
        type: "doubt" 
      },
    ],
  },
  {
    id: 3,
    intro: "Última pergunta antes de liberar o conteúdo exclusivo",
    warning: "Milhares de mães já transformaram suas vidas com esse conhecimento...",
    question: "VOCÊ ESTÁ PRONTA PARA SE TORNAR UMA MÃE ÁGUIA?",
    options: [
      { 
        text: "Não, prefiro continuar na mesma situação", 
        type: "exit" 
      },
      { 
        text: "SIM! QUERO ME PREPARAR AGORA", 
        type: "advance" 
      },
    ],
  },
];

const Index = () => {
  const { 
    trackVideoScreenView,
    trackVideoStart, 
    trackVideoEnd, 
    trackVideoSkip, 
    trackVideoProgress,
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
    trackContentUnlocked,
    trackContentView,
    trackScrollDepth,
    trackCheckout,
    trackCTAClick 
  } = useTracker();
  
  const [quizStep, setQuizStep] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<'eagle' | 'exit' | 'doubt' | null>(null);
  const [showFullContent, setShowFullContent] = useState(false);
  const [viewerCount, setViewerCount] = useState(7);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [trackedScrollDepths, setTrackedScrollDepths] = useState<number[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Track page view e scroll depth
  useEffect(() => {
    trackVideoScreenView();
    
    // Scroll tracking
    const handleScroll = () => {
      if (!showFullContent) return;
      
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);
      
      [25, 50, 75, 100].forEach(depth => {
        if (scrollPercent >= depth && !trackedScrollDepths.includes(depth)) {
          trackScrollDepth(depth);
          setTrackedScrollDepths(prev => [...prev, depth]);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showFullContent, trackedScrollDepths]);

  // Contador de visualizações dinâmico
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newCount = prev + change;
        return Math.max(3, Math.min(15, newCount));
      });
    }, 3000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, []);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    trackQuizStart();
    trackQuizStep(1);
  };

  const handleAnswer = (optionType: string, answerText: string) => {
    trackQuizAnswer(quizStep + 1, answerText, optionType);

    if (optionType === 'exit') {
      setQuizResult('exit');
      setQuizCompleted(true);
      trackQuizComplete('exit');
      trackQuizExit(quizStep + 1, 'user_exit');
    } else if (optionType === 'doubt') {
      setQuizResult('doubt');
      setQuizCompleted(true);
      trackQuizComplete('doubt');
      trackQuizDoubt(quizStep + 1);
    } else if (optionType === 'advance') {
      if (quizStep < quizQuestions.length - 1) {
        const nextStep = quizStep + 1;
        setQuizStep(nextStep);
        trackQuizAdvance(quizStep + 1, nextStep + 1);
        trackQuizStep(nextStep + 1);
      } else {
        setQuizResult('eagle');
        setQuizCompleted(true);
        setShowFullContent(true);
        trackQuizComplete('eagle');
        trackQuizSuccess();
        trackContentUnlocked('quiz_success');
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          trackContentView();
        }, 500);
      }
    }
  };

  const progress = ((quizStep + 1) / quizQuestions.length) * 100;

  const handleVideoEnd = () => {
    setVideoEnded(true);
    trackVideoEnd();
    trackQuizScreenView();
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleStartVideo = () => {
    setVideoStarted(true);
    trackVideoStart();
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleSkipVideo = () => {
    setVideoEnded(true);
    trackVideoSkip();
    trackQuizScreenView();
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleCheckoutClick = () => {
    trackCheckout();
    trackCTAClick('checkout_button', CHECKOUT_URL);
  };

  const handleShowContent = () => {
    setShowFullContent(true);
    trackContentUnlocked('reconsideration');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      trackContentView();
    }, 100);
  };

  const resetQuiz = () => {
    setQuizCompleted(false);
    setQuizStarted(false);
    setQuizStep(0);
    const prevResult = quizResult;
    setQuizResult(null);
    trackQuizRetry(prevResult || 'unknown');
  };

  return (
    <div className="min-h-screen">
      {/* ═══════════════════════════════════════════════════════════
          VÍDEO FULLSCREEN - Aparece primeiro
      ═══════════════════════════════════════════════════════════ */}
      <div className={`fixed inset-0 z-50 bg-background flex items-center justify-center transition-all duration-1000 ${videoEnded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Tela inicial - Clique para começar */}
        {!videoStarted && (
          <div 
            onClick={handleStartVideo}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center cursor-pointer bg-background px-6"
          >
            {/* Avatar da Especialista */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full scale-125 animate-pulse"></div>
              <img 
                src={avatarMaeAguia} 
                alt="Mãe Águia" 
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-primary shadow-glow object-cover"
              />
            </div>

            {/* Título impactante */}
            <h1 className="text-3xl md:text-5xl font-black text-center leading-tight mb-4">
              <span className="text-primary">A CHANCE</span>{" "}
              <span className="text-foreground">ESTÁ EM SUAS MÃOS</span>
            </h1>
            
            {/* Subtítulo poderoso */}
            <div className="text-center mb-6 px-4">
              <p className="text-muted-foreground text-base md:text-lg font-medium mb-1">
                Esse conteúdo <span className="text-primary font-black">NÃO</span> é para mães mimadas
              </p>
              <p className="text-foreground text-lg md:text-xl font-bold">
                Esse conteúdo é para <span className="text-primary font-black uppercase">MÃES ÁGUIAS</span>
              </p>
              <p className="text-foreground text-lg md:text-xl font-bold">
                🦅 que protegem o seu filhote
              </p>
            </div>
            
            {/* Botão de play */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/40 blur-3xl rounded-full animate-pulse scale-150"></div>
              <div className="relative bg-gradient-to-br from-primary to-primary/70 border-4 border-primary-foreground/20 rounded-full p-8 shadow-glow">
                <span className="text-5xl">▶️</span>
              </div>
            </div>

            {/* CTA */}
            <p className="text-foreground text-xl md:text-2xl font-black uppercase tracking-wide mb-2 text-center">
              🔥 Clique e Assista Agora
            </p>
            <p className="text-primary text-lg font-bold mb-3">
              Te espero do outro lado...
            </p>
            <p className="text-muted-foreground text-sm">
              🔊 Ative o som para a experiência completa
            </p>
          </div>
        )}

        <video
          ref={videoRef}
          src={heroIntroVideo}
          playsInline
          onEnded={handleVideoEnd}
          className="w-full h-full object-cover"
        />
        
        {/* Botão para pular vídeo - só aparece após iniciar */}
        {videoStarted && (
          <button 
            onClick={handleSkipVideo}
            className="absolute bottom-8 right-8 bg-secondary/80 backdrop-blur-sm border border-border px-4 py-2 rounded-full text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-all"
          >
            Pular vídeo →
          </button>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          CONTEÚDO PÓS-VÍDEO - Apenas Quiz inicialmente
      ═══════════════════════════════════════════════════════════ */}
      <div className={`transition-all duration-1000 ${videoEnded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Se ainda não completou o quiz com sucesso, mostra apenas o quiz */}
        {!showFullContent ? (
          <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-lg">
              {/* TOPO */}
              <div className="flex justify-between items-center mb-6">
                <div className="bg-secondary border border-border px-3.5 py-1.5 rounded-[20px] text-xs text-muted-foreground">
                  🔥 Oferta ativa
                </div>
                <div className="bg-secondary border border-border px-3.5 py-1.5 rounded-[20px] text-xs text-muted-foreground animate-pulse">
                  👁️ {viewerCount} mães agora
                </div>
              </div>

              {/* QUIZ SECTION */}
              <section className="gradient-card border-2 border-primary/30 rounded-[18px] p-[22px]">
                {!quizStarted ? (
                  // TELA INICIAL DO QUIZ
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                      <img src={avatarMaeAguia} alt="Mãe Águia" className="relative w-32 h-32 mx-auto rounded-full border-4 border-primary/50 object-cover" />
                    </div>
                    
                    <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-4">
                      <span className="text-sm font-bold text-primary">⚠️ ALERTA IMPORTANTE</span>
                    </div>
                    
                    <h2 className="text-xl font-black mb-3">
                      A cada <span className="text-primary">15 segundos</span> uma mulher está sofrendo
                    </h2>
                    <p className="text-muted-foreground text-base mb-5">
                      sem saber colocar seu bebê para arrotar...
                    </p>
                    
                    <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-6">
                      <p className="text-foreground font-bold text-lg mb-2">3 coisas podem acontecer:</p>
                      <div className="flex justify-center gap-4 text-sm">
                        <span className="text-muted-foreground">😰 Engasgo</span>
                        <span className="text-muted-foreground">😮‍💨 Desengasgo</span>
                        <span className="text-primary font-bold">💔 Ou a morte</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleStartQuiz}
                      className="w-full gradient-primary text-primary-foreground py-4 rounded-[14px] font-black text-base uppercase tracking-wide shadow-glow hover:scale-[1.02] transition-transform"
                    >
                      🦅 Descobrir se sou uma Mãe Águia
                    </button>
                    
                    <p className="text-muted-foreground text-xs mt-4">
                      ⏱️ Quiz rápido de 3 etapas
                    </p>
                  </div>
                ) : !quizCompleted ? (
                  // PERGUNTAS DO QUIZ (3 etapas)
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs text-muted-foreground">
                        Etapa {quizStep + 1} de {quizQuestions.length}
                      </span>
                      <span className="text-xs text-primary font-bold">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mb-6">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                      <img 
                        src={avatarMaeAguia} 
                        alt="Mãe Águia" 
                        className="relative w-24 h-24 mx-auto rounded-full border-3 border-primary/50 object-cover" 
                      />
                    </div>

                    {/* Intro e Warning */}
                    <div className="bg-secondary/70 border border-border rounded-xl p-4 mb-4">
                      <p className="text-foreground font-semibold text-center mb-2">
                        {quizQuestions[quizStep].intro}
                      </p>
                      <p className="text-primary text-sm font-bold text-center">
                        {quizQuestions[quizStep].warning}
                      </p>
                    </div>

                    <h3 className="text-lg font-black mb-5 text-center text-primary">
                      {quizQuestions[quizStep].question}
                    </h3>

                    {/* BOTÕES DO QUIZ - Estilo claro de botão */}
                    <div className="flex flex-col gap-3">
                      {quizQuestions[quizStep].options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(option.type, option.text)}
                          className={`w-full p-4 rounded-xl text-center transition-all duration-300 font-bold text-sm border-2 hover:scale-[1.02] active:scale-[0.98] ${
                            option.type === 'advance' 
                              ? 'bg-primary text-primary-foreground border-primary shadow-glow hover:bg-primary/90' 
                              : option.type === 'doubt'
                              ? 'bg-secondary text-foreground border-border hover:border-primary/50 hover:bg-secondary/80'
                              : 'bg-secondary/50 text-muted-foreground border-border/50 hover:border-border hover:text-foreground'
                          }`}
                        >
                          {option.text}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  // RESULTADO DO QUIZ
                  <div className="text-center">
                    {quizResult === 'eagle' ? (
                      <>
                        <div className="relative mb-6">
                          <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-pulse"></div>
                          <img src={avatarMaeAguia} alt="Parabéns" className="relative w-28 h-28 mx-auto rounded-full border-4 border-primary object-cover" />
                        </div>
                        <div className="text-6xl mb-4">🦅</div>
                        <h2 className="text-2xl font-black mb-2 text-primary">VOCÊ É UMA MÃE ÁGUIA!</h2>
                        <p className="text-foreground text-base mb-5">
                          Você está <span className="font-bold">pronta para proteger</span> seu filhote com todo conhecimento que precisa!
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Carregando conteúdo exclusivo...
                        </p>
                        <div className="flex justify-center mt-4">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      </>
                    ) : quizResult === 'doubt' ? (
                      // DÚVIDA - Botão leva ao conteúdo
                      <>
                        <div className="relative mb-6">
                          <img src={avatarMaeAguia} alt="Entendo" className="w-24 h-24 mx-auto rounded-full border-3 border-primary/50 object-cover" />
                        </div>
                        <h2 className="text-xl font-black mb-3 text-foreground">Eu entendo você... 💭</h2>
                        <p className="text-muted-foreground text-sm mb-4">
                          Mas pensa comigo: quanto vale a <span className="text-primary font-bold">segurança do seu bebê</span>?
                        </p>
                        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-5">
                          <p className="text-foreground text-base">
                            Por apenas <span className="text-primary font-black text-xl">R$ 49,90</span> você terá conhecimento para <span className="font-bold">proteger seu filhote para sempre</span>.
                          </p>
                        </div>
                        <button
                          onClick={handleShowContent}
                          className="block w-full gradient-primary text-primary-foreground py-4 rounded-[14px] font-black text-base uppercase shadow-glow hover:scale-[1.02] transition-transform"
                        >
                          🦅 Quero Me Preparar Agora
                        </button>
                      </>
                    ) : (
                      // TELA DE RECONSIDERAÇÃO - Botão leva ao conteúdo
                      <ReconsiderationScreen 
                        onShowContent={handleShowContent}
                        onRetry={resetQuiz}
                        avatarSrc={avatarMaeAguia}
                      />
                    )}
                  </div>
                )}
              </section>
            </div>
          </div>
        ) : (
          // CONTEÚDO COMPLETO - Aparece após completar quiz com sucesso
          <div className="container py-6 pb-20">
            {/* TOPO */}
            <div className="flex justify-between items-center mb-6">
              <div className="bg-secondary border border-border px-3.5 py-1.5 rounded-[20px] text-xs text-muted-foreground">
                🔥 Oferta ativa
              </div>
              <div className="bg-secondary border border-border px-3.5 py-1.5 rounded-[20px] text-xs text-muted-foreground animate-pulse">
                👁️ {viewerCount} mães agora
              </div>
            </div>

            {/* HERO SECTION */}
            <section className="text-center mb-12">
              <div className="mb-6">
                <video 
                  src={heroVideo} 
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full max-w-[320px] mx-auto rounded-2xl border-2 border-primary/30 shadow-glow"
                />
              </div>

              <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 mb-4">
                <span className="text-green-400 font-bold text-sm">🦅 Você é uma MÃE ÁGUIA!</span>
              </div>

              <h1 className="text-[28px] leading-[1.2] font-black mb-6 tracking-tight">
                A pergunta que não quer calar é se você teria{" "}
                <span className="text-primary block mt-2 text-[32px]">
                  CORAGEM DE FAZER DE TUDO
                </span>{" "}
                <span className="text-muted-foreground text-[22px] font-semibold">
                  para manter em segurança o seu filhote
                </span>
              </h1>

              <div className="bg-gradient-to-b from-primary/20 to-transparent border-l-4 border-primary rounded-r-lg p-5 mb-6 text-left">
                <p className="text-foreground text-lg font-bold mb-3">
                  90% das mães sofrem em silêncio...
                </p>
                <p className="text-primary text-2xl font-black uppercase tracking-wide">
                  MAS ISSO ACABA HOJE!!!
                </p>
              </div>

              <div className="space-y-3 mb-8">
                <p className="text-foreground text-lg font-semibold">
                  ❌ Você <span className="text-primary font-black underline decoration-primary">NÃO</span> é uma mãe ruim.
                </p>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Você só não teve os <span className="text-foreground font-bold">ensinamentos de alguém</span> com experiência própria.
                </p>
              </div>
            </section>

            {/* ROTINAS DIÁRIAS */}
            <section className="gradient-card border border-border rounded-[18px] p-6 my-9">
              <div className="text-center mb-6">
                <span className="text-primary text-xs font-bold uppercase tracking-widest">O Problema</span>
                <h2 className="text-2xl font-black mt-2 mb-1">ROTINAS DIÁRIAS!!!!</h2>
                <div className="inline-block bg-primary/20 border border-primary/40 rounded-full px-4 py-1">
                  <p className="text-primary text-sm font-black uppercase tracking-wide">
                    ⚠️ TODOS OS DIAS SEM SOLUÇÃO
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-secondary/50 border-l-4 border-primary p-4 rounded-r-lg">
                  <span className="text-primary text-2xl">😢</span>
                  <p className="text-foreground text-base font-medium">
                    bebê <span className="text-primary font-bold">chorando toda hora</span>
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-secondary/50 border-l-4 border-primary p-4 rounded-r-lg">
                  <span className="text-primary text-2xl">💩</span>
                  <p className="text-foreground text-base font-medium">
                    bebê <span className="text-primary font-bold">mijando, fazendo cocô</span>
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-secondary/50 border-l-4 border-primary p-4 rounded-r-lg">
                  <span className="text-primary text-2xl">🏠</span>
                  <p className="text-foreground text-base font-medium">
                    casa pra arrumar, <span className="text-primary font-bold">roupa pra lavar</span>
                  </p>
                </div>
              </div>
            </section>

            {/* CONSEQUÊNCIAS */}
            <section className="gradient-card border-2 border-primary/30 rounded-[18px] p-6 my-9">
              <div className="text-center mb-6">
                <span className="text-primary text-xs font-bold uppercase tracking-widest">O Impacto</span>
                <h2 className="text-2xl font-black text-primary mt-2">
                  💔 CONSEQUÊNCIAS DE TUDO ISSO
                </h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-accent/30 border border-primary/20 rounded-xl p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-primary text-2xl">💔</span>
                    <h3 className="text-foreground text-lg font-bold">
                      Você descontando tudo no <span className="text-primary">marido pai do seu bebê</span>
                    </h3>
                  </div>
                  
                  <div className="pl-8 space-y-3">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Que muitas das vezes chega <span className="text-foreground font-semibold">cansado, exausto, preocupado</span>...
                    </p>
                    <p className="text-foreground text-base font-medium">
                      E tudo que ele quer é <span className="text-primary font-bold">ver a família</span>. Ver você. Ver o bebê.
                    </p>
                    <div className="bg-primary/10 border-l-2 border-primary p-3 rounded-r-lg">
                      <p className="text-muted-foreground text-sm italic">
                        Mas muitas das vezes acontece pelo contrário: <span className="text-primary font-bold">brigas e apontamentos</span>.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/20 border-2 border-primary rounded-xl p-4 text-center">
                  <p className="text-primary text-xl font-black uppercase tracking-wide">
                    ⚡ A REALIDADE É OUTRA
                  </p>
                </div>
              </div>
            </section>

            {/* BOLA DE NEVE */}
            <section className="gradient-card border border-border rounded-[18px] p-6 my-9">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-primary text-3xl">❄️</span>
                <h2 className="text-xl font-black text-foreground">
                  Com isso começa a virar uma <span className="text-primary">BOLA DE NEVE</span>
                </h2>
              </div>
              
              <div className="bg-secondary/80 border border-border rounded-xl p-5 mb-5">
                <p className="text-foreground text-base leading-relaxed mb-3">
                  Seu bebê, <span className="text-primary font-bold">pelo quão pequeno seja</span>, ele observa <span className="font-bold underline">TUDO</span>...
                </p>
                <div className="bg-accent/50 border border-primary/30 rounded-lg p-4">
                  <p className="text-muted-foreground text-sm">
                    🖥️ Como um <span className="text-primary font-bold">HD de um MacBook</span> com armazenamento quase que infinito...
                  </p>
                </div>
              </div>
              
              <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg mb-6">
                <p className="text-foreground text-base font-semibold">
                  ⚠️ Com isso seu bebê vai <span className="text-primary font-bold">CRESCER</span> vendo essa rotina diária...
                </p>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-b from-primary/30 to-accent/50 border-2 border-primary rounded-2xl p-6 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(357_95%_47%_/_0.2),_transparent_70%)]"></div>
                <div className="relative">
                  <p className="text-5xl mb-3">🦅</p>
                  <h3 className="text-primary text-xl font-black uppercase tracking-wide leading-tight">
                    VOCÊ DEVERIA SER UMA ÁGUIA<br/>
                    <span className="text-2xl">QUE PROTEGE O SEU FILHOTE</span>
                  </h3>
                </div>
              </div>
            </section>

            {/* AVATAR PROTETORA */}
            <div className="flex justify-center my-10">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                <img 
                  src={avatarMaeAguia} 
                  alt="Mãe Águia - Proteção" 
                  className="relative w-52 h-52 rounded-full border-4 border-primary object-cover drop-shadow-[0_0_30px_hsl(357_95%_47%_/_0.5)]"
                />
              </div>
            </div>

            {/* BRIGAS E DÚVIDAS */}
            <section className="gradient-card border border-border rounded-[18px] p-6 my-9">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-primary text-2xl font-black">&</span>
                <h2 className="text-xl font-black text-foreground">
                  Aí vêm as <span className="text-primary">brigas</span>, as <span className="text-primary">dúvidas</span>
                </h2>
              </div>
              
              <div className="bg-secondary/50 rounded-xl p-5">
                <p className="text-muted-foreground text-base leading-relaxed mb-3">
                  Um <span className="text-foreground font-bold">culpa o outro</span>...
                </p>
                <p className="text-foreground text-lg font-semibold">
                  Quando na verdade os dois deveriam <span className="text-primary font-bold">sentar juntos</span> e resolver tudo que está acontecendo.
                </p>
              </div>
            </section>

            {/* SEPARAÇÃO */}
            <section className="bg-gradient-to-b from-primary/10 to-accent/30 border-2 border-primary/30 rounded-[18px] p-6 my-9">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-primary text-2xl font-black">&</span>
                <h2 className="text-xl font-black text-foreground">
                  Até a própria <span className="text-primary">SEPARAÇÃO</span>
                </h2>
              </div>
              
              <div className="text-center mb-4">
                <span className="text-3xl">💔</span>
                <p className="text-primary font-bold text-lg mt-2">Trazendo mais tristeza...</p>
              </div>
              
              <div className="bg-secondary/70 rounded-xl p-5 space-y-4">
                <p className="text-foreground text-base leading-relaxed">
                  Trazendo um <span className="text-primary font-bold">sofrimento enorme</span> para seu bebê.
                </p>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Pois ele <span className="text-foreground font-semibold">sente tudo</span>, ele é apenas um <span className="text-primary font-bold">anjinho que confia em vocês</span>.
                </p>
                <div className="border-t border-border pt-4">
                  <p className="text-foreground text-base italic text-center">
                    ✨ Deus deu e porque vocês são <span className="text-primary font-bold">capazes</span>, pois <span className="text-primary font-bold">Deus é perfeito</span>...
                  </p>
                </div>
              </div>
            </section>

            {/* CTA CARTA NA MANGA */}
            <section className="gradient-offer border-2 border-primary/40 rounded-[22px] p-8 text-center shadow-offer my-10">
              <div className="mb-6">
                <span className="text-5xl">🃏</span>
              </div>
              
              <p className="text-foreground text-xl leading-relaxed mb-4">
                Deixa eu te mostrar que, com apenas
              </p>
              
              <div className="bg-primary/20 border-2 border-primary rounded-xl p-4 mb-6 inline-block">
                <p className="text-primary text-2xl font-black uppercase tracking-wide">
                  UMA CARTA NA MANGA
                </p>
              </div>
              
              <p className="text-muted-foreground text-lg mb-6">
                você <span className="text-foreground font-bold">não vai precisar mais</span> passar por isso <span className="text-primary font-bold">sozinha</span>.
              </p>
              
              <div className="bg-gradient-to-r from-transparent via-primary/30 to-transparent h-px mb-6"></div>
              
              <p className="text-primary text-3xl font-black uppercase tracking-wide mb-8">
                ✨ SAIBA QUE VOCÊ É FODA… ✨
              </p>
            </section>

            {/* OFERTA FINAL - ÚNICO BOTÃO DE CHECKOUT */}
            <section id="offer" className="gradient-offer border-2 border-primary/30 rounded-[22px] p-8 text-center shadow-offer">
              <div className="bg-primary/30 border border-primary inline-block px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide mb-4">
                👑 Fundadora Vitalícia
              </div>

              <div className="text-muted-foreground line-through text-lg mb-1">De R$ 197</div>
              <div className="text-5xl font-black my-3 tracking-tight">
                R$ 49<small className="text-2xl">,90</small>
              </div>

              <div className="inline-block bg-secondary border border-border rounded-full px-4 py-2 mb-6">
                <p className="text-muted-foreground text-sm">
                  💳 Pagamento único • ♾️ Acesso vitalício
                </p>
              </div>

              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-center gap-3 bg-secondary/50 p-3 rounded-lg">
                  <span className="text-primary text-lg">✔</span>
                  <span className="text-foreground font-medium">Todas as atualizações futuras</span>
                </li>
                <li className="flex items-center gap-3 bg-secondary/50 p-3 rounded-lg">
                  <span className="text-primary text-lg">✔</span>
                  <span className="text-foreground font-medium">Sem mensalidade</span>
                </li>
                <li className="flex items-center gap-3 bg-secondary/50 p-3 rounded-lg">
                  <span className="text-primary text-lg">✔</span>
                  <span className="text-foreground font-medium">Suporte em português</span>
                </li>
              </ul>

              <a
                href={CHECKOUT_URL}
                onClick={handleCheckoutClick}
                className="block w-full gradient-primary py-5 rounded-[14px] font-black text-primary-foreground text-lg uppercase tracking-wide shadow-glow hover:scale-[1.02] transition-transform"
              >
                👑 Ser Fundadora MamãeZen Agora
              </a>
              
              <p className="text-muted-foreground text-xs mt-4">
                🔒 Compra 100% segura • Garantia de 7 dias
              </p>
            </section>
            
            {/* FOOTER */}
            <Footer />
          </div>
        )}
      </div>
    </div>
  );
};

// Componente de Reconsideração - Botão leva ao conteúdo, não checkout
interface ReconsiderationScreenProps {
  onShowContent: () => void;
  onRetry: () => void;
  avatarSrc: string;
}

const ReconsiderationScreen = ({ onShowContent, onRetry, avatarSrc }: ReconsiderationScreenProps) => {
  return (
    <div className="text-left">
      {/* Header */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full"></div>
          <img src={avatarSrc} alt="Mãe Águia" className="relative w-24 h-24 rounded-full border-3 border-primary/50 object-cover" />
        </div>
      </div>
      
      <div className="text-center mb-6">
        <span className="inline-block bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
          ⚠️ Antes de ir
        </span>
        <h2 className="text-xl font-black text-foreground">
          Deixa eu te contar uma <span className="text-primary">história real</span>...
        </h2>
      </div>

      {/* Bloco 1 - A Tragédia */}
      <div className="bg-secondary/80 border border-border rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">CASO REAL</span>
          <span className="text-muted-foreground text-xs">Petrópolis, RJ</span>
        </div>
        <p className="text-foreground text-sm leading-relaxed">
          Uma bebê de <span className="text-primary font-bold">1 ano e 3 meses</span> engasgou com uma fatia de maçã em uma creche. Os funcionários <span className="text-red-400 font-bold">não sabiam as técnicas</span> que eu ensino no Kit Vitalício.
        </p>
      </div>

      {/* Bloco 2 - O Problema */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-red-400 text-lg">⏱️</span>
          <span className="text-red-400 font-bold text-sm">11 MINUTOS</span>
        </div>
        <p className="text-foreground text-sm leading-relaxed">
          Foi o tempo que levou até chegar atendimento médico. A polícia concluiu: <span className="text-red-400 font-bold">negligência</span> e ausência de preparo técnico.
        </p>
      </div>

      {/* Bloco 3 - O Desfecho */}
      <div className="bg-secondary/50 border-l-4 border-red-500 rounded-r-xl p-4 mb-6">
        <p className="text-foreground text-sm leading-relaxed">
          A menina foi levada à UPA, reanimada, entubada, transferida para o hospital... mas <span className="text-red-400 font-bold">infelizmente não resistiu</span>. 💔
        </p>
      </div>

      {/* Bloco 4 - A Pergunta */}
      <div className="bg-gradient-to-b from-primary/20 to-primary/5 border-2 border-primary/40 rounded-xl p-5 mb-6">
        <p className="text-foreground text-base font-bold text-center mb-3">
          E se essa situação fosse com <span className="text-primary">VOCÊ</span>?
        </p>
        <div className="space-y-2 text-center">
          <p className="text-muted-foreground text-sm">
            Você estaria preparada?
          </p>
          <p className="text-muted-foreground text-sm">
            Ou ligaria pro SAMU que demora <span className="text-foreground font-semibold">horas</span>?
          </p>
        </div>
      </div>

      {/* Bloco 5 - CTA */}
      <div className="bg-primary/10 border border-primary/30 rounded-xl p-5 mb-5 text-center">
        <p className="text-primary text-lg font-black mb-2">
          🦅 SEJA UMA MÃE ÁGUIA
        </p>
        <p className="text-foreground text-sm">
          Que protege o seu filhote com <span className="font-bold">conhecimento</span>
        </p>
      </div>

      {/* Botões - Principal leva ao conteúdo */}
      <button
        onClick={onShowContent}
        className="block w-full gradient-primary text-primary-foreground py-4 rounded-[14px] font-black text-base uppercase shadow-glow text-center mb-3 hover:scale-[1.02] transition-transform"
      >
        🛡️ Quero Me Preparar Agora
      </button>
      
      <button
        onClick={onRetry}
        className="w-full bg-secondary border border-border py-3 rounded-[14px] font-bold text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-all"
      >
        Refazer o Quiz
      </button>
    </div>
  );
};

export default Index;
