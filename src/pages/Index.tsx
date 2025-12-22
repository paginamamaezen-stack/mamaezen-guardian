import { useState } from "react";
import avatarProtector from "@/assets/avatar-protector.png";
import avatarThinking from "@/assets/avatar-thinking.png";
import avatarVictory from "@/assets/avatar-victory.png";
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

  return (
    <div className="container py-6 pb-20">
      {/* TOPO */}
      <div className="flex justify-between items-center mb-6">
        <div className="bg-secondary border border-border px-3.5 py-1.5 rounded-[20px] text-xs text-muted-foreground">
          🔥 Oferta ativa
        </div>
        <div className="bg-secondary border border-border px-3.5 py-1.5 rounded-[20px] text-xs text-muted-foreground">
          👁️ 5 mães agora
        </div>
      </div>

      {/* HERO COM VÍDEO */}
      <section className="text-center mb-10">
        <div className="rounded-[18px] overflow-hidden mb-6">
          <video
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto"
          />
        </div>

        <h1 className="text-[26px] leading-[1.25] font-extrabold mb-4">
          A pergunta que não quer calar é se você teria{" "}
          <span className="text-primary">coragem de fazer de tudo</span>{" "}
          para manter em segurança o seu filhote
        </h1>

        <p className="text-muted-foreground text-[15px] leading-relaxed mb-7">
          90% das mães sofrem em silêncio.<br />
          Você não é uma mãe ruim — só não teve orientação certa.
        </p>

        <a
          href={CHECKOUT_URL}
          className="block w-full gradient-primary text-primary-foreground py-[18px] text-base font-bold rounded-[14px] shadow-glow text-center"
        >
          Quero Proteger Meu Bebê Agora
        </a>
      </section>

      {/* QUIZ */}
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

      {/* DOR */}
      <section className="gradient-card border border-border rounded-[18px] p-[22px] my-9">
        <h2 className="text-lg font-bold mb-4">Rotinas diárias sem solução</h2>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2.5 text-[#ddd] text-[15px]">
            <span className="text-primary font-bold">&amp;</span> bebê chorando toda hora
          </div>
          <div className="flex gap-2.5 text-[#ddd] text-[15px]">
            <span className="text-primary font-bold">&amp;</span> bebê mijando, fazendo cocô
          </div>
          <div className="flex gap-2.5 text-[#ddd] text-[15px]">
            <span className="text-primary font-bold">&amp;</span> casa pra arrumar, roupa pra lavar
          </div>
          <div className="flex gap-2.5 text-[#ddd] text-[15px]">
            <span className="text-primary font-bold">&amp;</span> sono quebrado e medo de errar
          </div>
        </div>
      </section>

      {/* SOLUÇÃO */}
      <section className="gradient-card border border-border rounded-[18px] p-[22px] my-9">
        <h3 className="text-xl font-bold mb-3">O que é o MamãeZen</h3>
        <p className="text-muted-foreground leading-relaxed text-[15px]">
          O MamãeZen é o seu plano diário de maternidade.
          Checklists simples, rotinas de sono, alertas de emergência
          e apoio real — tudo na palma da sua mão, sem julgamento.
        </p>
      </section>

      {/* AVATAR */}
      <div className="flex justify-center my-8">
        <img 
          src={avatarProtector} 
          alt="MamãeZen - Proteção" 
          className="w-48 h-48 object-contain"
        />
      </div>

      {/* OFERTA */}
      <section id="offer" className="gradient-offer border border-primary/20 rounded-[22px] p-[26px] text-center shadow-offer">
        <div className="bg-accent inline-block px-3.5 py-1.5 rounded-[20px] text-xs mb-3.5">
          Fundadora Vitalícia
        </div>

        <div className="text-muted-foreground line-through mb-1">De R$ 197</div>
        <div className="text-[42px] font-black my-1.5">
          R$ 49<small className="text-lg">,90</small>
        </div>

        <p className="text-[#ddd] text-sm mb-5">Pagamento único • Acesso vitalício</p>

        <ul className="text-left my-5 space-y-2.5">
          <li className="text-sm before:content-['✔_'] before:text-primary">
            Todas as atualizações futuras
          </li>
          <li className="text-sm before:content-['✔_'] before:text-primary">
            Sem mensalidade
          </li>
          <li className="text-sm before:content-['✔_'] before:text-primary">
            Suporte em português
          </li>
        </ul>

        <a
          href={CHECKOUT_URL}
          className="block w-full gradient-primary py-4 rounded-[14px] font-extrabold text-primary-foreground text-base mt-4 text-center"
        >
          Ser Fundadora MamãeZen Agora
        </a>
      </section>
    </div>
  );
};

export default Index;
