import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Sparkles } from "lucide-react";

import avatarWelcome from "@/assets/avatar-welcome.png";
import avatarThinking from "@/assets/avatar-thinking.png";
import avatarVictory from "@/assets/avatar-victory.png";
import avatarProtector from "@/assets/avatar-protector.png";

interface QuizSectionProps {
  onComplete: () => void;
}

interface Question {
  id: number;
  avatar: string;
  question: string;
  options: { text: string; emoji: string }[];
  feedback: string;
}

const questions: Question[] = [
  {
    id: 1,
    avatar: avatarWelcome,
    question: "Você já se sentiu perdida sem saber se está cuidando bem do seu bebê?",
    options: [
      { text: "Sim, todos os dias", emoji: "😢" },
      { text: "Às vezes me sinto assim", emoji: "😕" },
      { text: "Raramente", emoji: "🤔" },
    ],
    feedback: "Você não está sozinha. 90% das mães sentem o mesmo...",
  },
  {
    id: 2,
    avatar: avatarThinking,
    question: "Quando seu bebê chora, você consegue identificar rapidamente o motivo?",
    options: [
      { text: "Não, fico desesperada", emoji: "😰" },
      { text: "Às vezes demoro", emoji: "😓" },
      { text: "Geralmente sim", emoji: "😊" },
    ],
    feedback: "Entender o choro é uma das maiores dificuldades das mães...",
  },
  {
    id: 3,
    avatar: avatarThinking,
    question: "Você sabe reconhecer os sinais de alerta de que seu bebê pode estar doente?",
    options: [
      { text: "Não tenho certeza", emoji: "😟" },
      { text: "Conheço alguns", emoji: "🤔" },
      { text: "Sim, conheço bem", emoji: "✅" },
    ],
    feedback: "Conhecer os sinais de alerta pode salvar vidas...",
  },
  {
    id: 4,
    avatar: avatarProtector,
    question: "Você gostaria de ter um guia completo para proteger e cuidar do seu bebê com confiança?",
    options: [
      { text: "SIM, EU PRECISO!", emoji: "🔥" },
      { text: "Seria muito útil", emoji: "💡" },
      { text: "Talvez", emoji: "🤷" },
    ],
    feedback: "Você está no lugar certo!",
  },
];

const QuizSection = ({ onComplete }: QuizSectionProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleSelectOption = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setShowFeedback(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setShowFeedback(false);
        setSelectedOption(null);
      } else {
        setQuizCompleted(true);
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    }, 1500);
  };

  // Welcome screen
  if (!quizStarted) {
    return (
      <section className="gradient-card border border-border rounded-2xl p-6 mb-10 text-center">
        <div className="mb-6">
          <img
            src={avatarWelcome}
            alt="MamãeZen Avatar"
            className="w-48 h-48 mx-auto rounded-full border-4 border-primary/50 shadow-glow object-cover"
          />
        </div>
        
        <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Quiz Exclusivo</span>
        </div>

        <h2 className="text-2xl font-extrabold mb-3">
          Descubra se você está <span className="text-primary">protegendo seu bebê</span> da forma certa
        </h2>

        <p className="text-muted-foreground mb-6">
          Responda 4 perguntas rápidas e receba uma análise personalizada + uma oferta especial exclusiva
        </p>

        <Button
          onClick={handleStartQuiz}
          size="lg"
          className="w-full gradient-primary shadow-glow text-base font-bold py-6 rounded-xl group"
        >
          <span>Começar Quiz Agora</span>
          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>

        <p className="text-xs text-muted-foreground mt-4">
          ⏱️ Leva menos de 1 minuto
        </p>
      </section>
    );
  }

  // Quiz completed screen
  if (quizCompleted) {
    return (
      <section className="gradient-card border border-border rounded-2xl p-6 mb-10 text-center animate-fade-in">
        <div className="mb-6">
          <img
            src={avatarVictory}
            alt="MamãeZen Celebrando"
            className="w-48 h-48 mx-auto rounded-full border-4 border-primary/50 shadow-glow object-cover animate-pulse"
          />
        </div>

        <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 mb-4">
          <span className="text-green-400 font-semibold">✓ Quiz Concluído!</span>
        </div>

        <h2 className="text-2xl font-extrabold mb-3">
          Parabéns! Você deu o <span className="text-primary">primeiro passo</span>
        </h2>

        <p className="text-muted-foreground mb-4">
          Sua oferta exclusiva de fundadora está sendo carregada...
        </p>

        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  // Quiz questions
  const question = questions[currentQuestion];

  return (
    <section className="gradient-card border border-border rounded-2xl p-6 mb-10">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <img
          src={question.avatar}
          alt="MamãeZen"
          className="w-32 h-32 rounded-full border-4 border-primary/30 shadow-glow object-cover transition-all duration-500"
        />
      </div>

      {/* Question */}
      <h3 className="text-xl font-bold text-center mb-6 leading-relaxed">
        {question.question}
      </h3>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelectOption(index)}
            disabled={selectedOption !== null}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 flex items-center gap-3 ${
              selectedOption === index
                ? "border-primary bg-primary/20 scale-[1.02]"
                : "border-border hover:border-primary/50 hover:bg-secondary/50"
            } ${selectedOption !== null && selectedOption !== index ? "opacity-50" : ""}`}
          >
            <span className="text-2xl">{option.emoji}</span>
            <span className="font-medium">{option.text}</span>
          </button>
        ))}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-xl animate-fade-in">
          <p className="text-sm text-center text-foreground/90">
            {question.feedback}
          </p>
        </div>
      )}
    </section>
  );
};

export default QuizSection;
