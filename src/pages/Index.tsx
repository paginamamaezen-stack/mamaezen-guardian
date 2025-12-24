import { useState, useRef } from "react";
import avatarProtector from "@/assets/avatar-protector.png";
import avatarThinking from "@/assets/avatar-thinking.png";
import avatarVictory from "@/assets/avatar-victory.png";
import avatarWelcome from "@/assets/avatar-welcome.png";
import heroIntroVideo from "@/assets/hero-intro-video.mp4";
import heroVideo from "@/assets/hero-video.mp4";

const CHECKOUT_URL = "#";

const quizQuestions = [
  {
    question: "Você sente que está sempre cansada e sem energia?",
    options: ["Sim, todos os dias", "Às vezes", "Raramente"]
  },
  {
    question: "Você tem medo de estar fazendo algo errado com seu bebê?",
    options: ["Sim, constantemente", "De vez em quando", "Não muito"]
  },
  {
    question: "Você gostaria de ter um guia prático para cada situação?",
    options: ["Com certeza!", "Seria útil", "Talvez"]
  }
];

const Index = () => {
  const [quizStep, setQuizStep] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (answerIndex: number) => {
    const points = answerIndex === 0 ? 3 : answerIndex === 1 ? 2 : 1;
    setScore(prev => prev + points);

    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(prev => prev + 1);
    } else {
      setQuizCompleted(true);
      setTimeout(() => {
        document.getElementById("offer")?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  };

  const progress = ((quizStep + 1) / quizQuestions.length) * 100;
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  const handleStartVideo = () => {
    setVideoStarted(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
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
            <h1 className="text-3xl md:text-5xl font-black text-center leading-tight mb-6">
              <span className="text-primary">A CHANCE</span>{" "}
              <span className="text-foreground">ESTÁ EM SUAS MÃOS</span>
            </h1>
            
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
            onClick={handleVideoEnd}
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
          <div className="bg-secondary border border-border px-3.5 py-1.5 rounded-[20px] text-xs text-muted-foreground">
            👁️ 5 mães agora
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
          className="block w-full gradient-primary text-primary-foreground py-5 text-lg font-black rounded-[14px] shadow-glow text-center uppercase tracking-wide"
        >
          🛡️ Quero Proteger Meu Bebê Agora
        </a>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          QUIZ INTERATIVO
      ═══════════════════════════════════════════════════════════ */}
      <section className="gradient-card border border-border rounded-[18px] p-[22px] my-9">
        {!quizStarted ? (
          <div className="text-center">
            <img src={avatarThinking} alt="Quiz" className="w-24 h-24 mx-auto mb-4 object-contain" />
            <h2 className="text-lg font-bold mb-3">Descubra seu perfil de mãe</h2>
            <p className="text-muted-foreground text-sm mb-5">
              Responda 3 perguntas rápidas e veja como o MamãeZen pode te ajudar.
            </p>
            <button
              onClick={() => setQuizStarted(true)}
              className="w-full gradient-primary text-primary-foreground py-3 rounded-[14px] font-bold text-sm"
            >
              Começar Quiz
            </button>
          </div>
        ) : !quizCompleted ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-muted-foreground">
                Pergunta {quizStep + 1} de {quizQuestions.length}
              </span>
              <span className="text-xs text-primary font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-6">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <img src={avatarThinking} alt="Pensando" className="w-20 h-20 mx-auto mb-4 object-contain" />

            <h3 className="text-base font-bold mb-5 text-center">
              {quizQuestions[quizStep].question}
            </h3>

            <div className="flex flex-col gap-3">
              {quizQuestions[quizStep].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="w-full bg-secondary border border-border py-3 px-4 rounded-[12px] text-sm text-left hover:border-primary transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <img src={avatarVictory} alt="Parabéns" className="w-24 h-24 mx-auto mb-4 object-contain" />
            <h2 className="text-lg font-bold mb-2 text-primary">Resultado: Você precisa do MamãeZen!</h2>
            <p className="text-muted-foreground text-sm mb-5">
              {score >= 7 
                ? "Suas respostas mostram que você está sobrecarregada. O MamãeZen foi feito para mães como você."
                : "O MamãeZen pode te ajudar a ter mais tranquilidade no dia a dia com seu bebê."
              }
            </p>
            <a
              href={CHECKOUT_URL}
              className="block w-full gradient-primary text-primary-foreground py-3 rounded-[14px] font-bold text-sm"
            >
              Quero Começar Agora
            </a>
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
