import { useState, useRef, useEffect } from "react";
import avatarProtector from "@/assets/avatar-protector.png";
import avatarThinking from "@/assets/avatar-thinking.png";
import avatarVictory from "@/assets/avatar-victory.png";
import avatarWelcome from "@/assets/avatar-welcome.png";
import heroIntroVideo from "@/assets/hero-intro-video.mp4";
import heroVideo from "@/assets/hero-video.mp4";
import { useTracker } from "@/hooks/useTracker";

const CHECKOUT_URL = "https://pay.cakto.com.br/c88zju2_683076";

// Quiz com as perguntas fornecidas
const quizQuestions = [
  {
    id: 1,
    avatar: avatarThinking,
    intro: "A cada 15 segundos uma mulher está sofrendo sem saber colocar seu bebê para arrotar",
    warning: "3 coisas podem acontecer: Engasgo, Desengasgo ou a morte",
    question: "VOCÊ ESTÁ PREPARADA PARA ESSA SITUAÇÃO? ISSO NÃO É ENSINADO NA MATERNIDADE",
    options: [
      { 
        text: "Não sei me virar, mais tenho minha mamãe. Sou mimadinha, esse conteúdo não é pra mim", 
        emoji: "😅", 
        type: "exit" 
      },
      { 
        text: "EU ATÉ SEI, MAIS QUANTO MAIS CONHECIMENTO MELHOR. SOU UMA MÃE ÁGUIA E QUERO PROTEGER O MEU FILHOTE", 
        emoji: "🦅", 
        type: "advance" 
      },
    ],
  },
  {
    id: 2,
    avatar: avatarProtector,
    intro: "Esteja preparada para qualquer tipo de situação",
    warning: "Nosso Kit não é de qualquer um. Eu entendo a sua dor. A maioria das vezes essa tristeza vem de mães adolescentes que ainda nem descobriram o que é ser mãe...",
    question: "Mais com o nosso kit você vai se tornar uma MÃE ÁGUIA que protege o seu filhote",
    options: [
      { 
        text: "ESSE KIT NÃO É PRA MIM. TENHO MINHA MAMÃE PRA ME AJUDAR. EU SOU MOLE", 
        emoji: "🤷", 
        type: "exit" 
      },
      { 
        text: "EU QUERO MUITO ESSE KIT POIS SOU UMA MÃE RESPONSÁVEL, UMA MÃE ÁGUIA", 
        emoji: "🦅", 
        type: "advance" 
      },
      { 
        text: "EU ESTOU EM DÚVIDAS POIS NÃO TENHO DINHEIRO, MAIS SE EU TIVESSE COMPRARIA", 
        emoji: "💭", 
        type: "doubt" 
      },
    ],
  },
];

const Index = () => {
  const { trackVideoStart, trackVideoEnd, trackVideoSkip, trackQuizStart, trackQuizAnswer, trackQuizComplete, trackCheckout } = useTracker();
  
  const [quizStep, setQuizStep] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<'eagle' | 'exit' | 'doubt' | null>(null);
  const [viewerCount, setViewerCount] = useState(7);

  // Contador de visualizações dinâmico
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newCount = prev + change;
        // Mantém entre 3 e 15
        return Math.max(3, Math.min(15, newCount));
      });
    }, 3000 + Math.random() * 4000); // Varia entre 3-7 segundos

    return () => clearInterval(interval);
  }, []);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    trackQuizStart();
  };

  const handleAnswer = (optionType: string, answerText: string) => {
    trackQuizAnswer(quizStep + 1, answerText);

    if (optionType === 'exit') {
      setQuizResult('exit');
      setQuizCompleted(true);
      trackQuizComplete('exit');
    } else if (optionType === 'doubt') {
      setQuizResult('doubt');
      setQuizCompleted(true);
      trackQuizComplete('doubt');
    } else if (optionType === 'advance') {
      if (quizStep < quizQuestions.length - 1) {
        setQuizStep(prev => prev + 1);
      } else {
        setQuizResult('eagle');
        setQuizCompleted(true);
        trackQuizComplete('eagle');
        setTimeout(() => {
          document.getElementById("offer")?.scrollIntoView({ behavior: "smooth" });
        }, 1500);
      }
    }
  };

  const progress = ((quizStep + 1) / quizQuestions.length) * 100;
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    setVideoEnded(true);
    trackVideoEnd();
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
  };

  const handleCheckoutClick = () => {
    trackCheckout();
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
                src={avatarWelcome} 
                alt="Especialista em Maternidade" 
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
          CONTEÚDO DA PÁGINA - Aparece após vídeo
      ═══════════════════════════════════════════════════════════ */}
      <div className={`container py-6 pb-20 transition-all duration-1000 ${videoEnded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* TOPO */}
        <div className="flex justify-between items-center mb-6">
          <div className="bg-secondary border border-border px-3.5 py-1.5 rounded-[20px] text-xs text-muted-foreground">
            🔥 Oferta ativa
          </div>
          <div className="bg-secondary border border-border px-3.5 py-1.5 rounded-[20px] text-xs text-muted-foreground animate-pulse">
            👁️ {viewerCount} mães agora
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            HERO SECTION - HEADLINE PRINCIPAL
        ═══════════════════════════════════════════════════════════ */}
        <section className="text-center mb-12">

        {/* VÍDEO HERO */}
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

        {/* HEADLINE - A pergunta impactante */}
        <h1 className="text-[28px] leading-[1.2] font-black mb-6 tracking-tight">
          A pergunta que não quer calar é se você teria{" "}
          <span className="text-primary block mt-2 text-[32px]">
            CORAGEM DE FAZER DE TUDO
          </span>{" "}
          <span className="text-muted-foreground text-[22px] font-semibold">
            para manter em segurança o seu filhote
          </span>
        </h1>

        {/* SUBTITULO CTA - Impactante */}
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

        <a
          href={CHECKOUT_URL}
          onClick={handleCheckoutClick}
          className="block w-full gradient-primary text-primary-foreground py-5 text-lg font-black rounded-[14px] shadow-glow text-center uppercase tracking-wide"
        >
          🛡️ Quero Proteger Meu Bebê Agora
        </a>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          QUIZ INTERATIVO - FUNIL DE CONVERSÃO
      ═══════════════════════════════════════════════════════════ */}
      <section className="gradient-card border-2 border-primary/30 rounded-[18px] p-[22px] my-9">
        {!quizStarted ? (
          // TELA INICIAL DO QUIZ
          <div className="text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
              <img src={avatarThinking} alt="Quiz" className="relative w-28 h-28 mx-auto object-contain" />
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
              className="w-full gradient-primary text-primary-foreground py-4 rounded-[14px] font-black text-base uppercase tracking-wide shadow-glow"
            >
              🦅 Descobrir se sou uma Mãe Águia
            </button>
          </div>
        ) : !quizCompleted ? (
          // PERGUNTAS DO QUIZ
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-muted-foreground">
                Pergunta {quizStep + 1} de {quizQuestions.length}
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
                src={quizQuestions[quizStep].avatar} 
                alt="Quiz" 
                className="relative w-24 h-24 mx-auto object-contain" 
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

            <div className="flex flex-col gap-3">
              {quizQuestions[quizStep].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option.type, option.text)}
                  className={`w-full p-4 rounded-[12px] text-left transition-all duration-300 flex items-start gap-3 ${
                    option.type === 'advance' 
                      ? 'bg-primary/20 border-2 border-primary hover:bg-primary/30' 
                      : 'bg-secondary border border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-2xl flex-shrink-0">{option.emoji}</span>
                  <span className={`text-sm font-medium ${option.type === 'advance' ? 'text-foreground font-bold' : 'text-muted-foreground'}`}>
                    {option.text}
                  </span>
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
                  <img src={avatarVictory} alt="Parabéns" className="relative w-28 h-28 mx-auto object-contain" />
                </div>
                <div className="text-6xl mb-4">🦅</div>
                <h2 className="text-2xl font-black mb-2 text-primary">VOCÊ É UMA MÃE ÁGUIA!</h2>
                <p className="text-foreground text-base mb-5">
                  Você está <span className="font-bold">pronta para proteger</span> seu filhote com todo conhecimento que precisa!
                </p>
                <a
                  href={CHECKOUT_URL}
                  onClick={handleCheckoutClick}
                  className="block w-full gradient-primary text-primary-foreground py-4 rounded-[14px] font-black text-base uppercase shadow-glow"
                >
                  🛡️ Quero Meu Kit de Proteção Agora
                </a>
              </>
            ) : quizResult === 'doubt' ? (
              <>
                <div className="relative mb-6">
                  <img src={avatarThinking} alt="Entendo" className="w-24 h-24 mx-auto object-contain" />
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
                <a
                  href={CHECKOUT_URL}
                  onClick={handleCheckoutClick}
                  className="block w-full gradient-primary text-primary-foreground py-4 rounded-[14px] font-black text-base uppercase shadow-glow"
                >
                  🦅 Quero Ser Uma Mãe Águia
                </a>
              </>
            ) : (
              <>
                <div className="relative mb-6">
                  <img src={avatarWelcome} alt="Tudo bem" className="w-24 h-24 mx-auto object-contain" />
                </div>
                <h2 className="text-xl font-black mb-3 text-foreground">Tudo bem! 😊</h2>
                <p className="text-muted-foreground text-sm mb-4">
                  Que bom que você tem apoio! Mas lembre-se: <span className="text-foreground font-semibold">conhecimento nunca é demais</span>.
                </p>
                <p className="text-muted-foreground text-sm mb-5">
                  Se mudar de ideia, estarei aqui para te ajudar a se tornar uma <span className="text-primary font-bold">Mãe Águia</span>!
                </p>
                <button
                  onClick={() => {
                    setQuizCompleted(false);
                    setQuizStarted(false);
                    setQuizStep(0);
                    setQuizResult(null);
                  }}
                  className="w-full bg-secondary border border-border py-3 rounded-[14px] font-bold text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-all"
                >
                  Refazer o Quiz
                </button>
              </>
            )}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════
          ROTINAS DIÁRIAS - O Problema
      ═══════════════════════════════════════════════════════════ */}
      <section className="gradient-card border border-border rounded-[18px] p-6 my-9">
        {/* Header com destaque */}
        <div className="text-center mb-6">
          <span className="text-primary text-xs font-bold uppercase tracking-widest">O Problema</span>
          <h2 className="text-2xl font-black mt-2 mb-1">ROTINAS DIÁRIAS!!!!</h2>
          <div className="inline-block bg-primary/20 border border-primary/40 rounded-full px-4 py-1">
            <p className="text-primary text-sm font-black uppercase tracking-wide">
              ⚠️ TODOS OS DIAS SEM SOLUÇÃO
            </p>
          </div>
        </div>

        {/* Lista com destaque visual */}
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

      {/* ═══════════════════════════════════════════════════════════
          CONSEQUÊNCIAS - O Impacto Real
      ═══════════════════════════════════════════════════════════ */}
      <section className="gradient-card border-2 border-primary/30 rounded-[18px] p-6 my-9">
        {/* Header dramático */}
        <div className="text-center mb-6">
          <span className="text-primary text-xs font-bold uppercase tracking-widest">O Impacto</span>
          <h2 className="text-2xl font-black text-primary mt-2">
            💔 CONSEQUÊNCIAS DE TUDO ISSO
          </h2>
        </div>
        
        <div className="space-y-6">
          {/* Consequência 1 - Descontar no marido */}
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

          {/* Destaque - A Realidade */}
          <div className="bg-primary/20 border-2 border-primary rounded-xl p-4 text-center">
            <p className="text-primary text-xl font-black uppercase tracking-wide">
              ⚡ A REALIDADE É OUTRA
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          BOLA DE NEVE - O Efeito Cascata
      ═══════════════════════════════════════════════════════════ */}
      <section className="gradient-card border border-border rounded-[18px] p-6 my-9">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-primary text-3xl">❄️</span>
          <h2 className="text-xl font-black text-foreground">
            Com isso começa a virar uma <span className="text-primary">BOLA DE NEVE</span>
          </h2>
        </div>
        
        {/* Metáfora do HD */}
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
        
        {/* Alerta */}
        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg mb-6">
          <p className="text-foreground text-base font-semibold">
            ⚠️ Com isso seu bebê vai <span className="text-primary font-bold">CRESCER</span> vendo essa rotina diária...
          </p>
        </div>

        {/* CTA ÁGUIA - Destaque máximo */}
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

      {/* ═══════════════════════════════════════════════════════════
          AVATAR PROTETORA
      ═══════════════════════════════════════════════════════════ */}
      <div className="flex justify-center my-10">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
          <img 
            src={avatarProtector} 
            alt="MamãeZen - Proteção" 
            className="relative w-52 h-52 object-contain drop-shadow-[0_0_30px_hsl(357_95%_47%_/_0.5)]"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          BRIGAS E DÚVIDAS
      ═══════════════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════════════
          SEPARAÇÃO - O Pior Cenário
      ═══════════════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════════════
          CTA ENTRADA DE FUNIL - A Solução
      ═══════════════════════════════════════════════════════════ */}
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

        <a
          href={CHECKOUT_URL}
          onClick={handleCheckoutClick}
          className="block w-full gradient-primary py-5 rounded-[14px] font-black text-primary-foreground text-lg uppercase tracking-wide shadow-glow"
        >
          🎯 Quero Minha Carta na Manga Agora
        </a>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          OFERTA FINAL
      ═══════════════════════════════════════════════════════════ */}
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
          className="block w-full gradient-primary py-5 rounded-[14px] font-black text-primary-foreground text-lg uppercase tracking-wide shadow-glow"
        >
          👑 Ser Fundadora MamãeZen Agora
        </a>
        
          <p className="text-muted-foreground text-xs mt-4">
            🔒 Compra 100% segura • Garantia de 7 dias
          </p>
        </section>
      </div>
    </div>
  );
};

export default Index;
