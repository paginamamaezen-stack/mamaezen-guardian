import heroVideo from "@/assets/hero-video.mp4";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  checkoutUrl: string;
}

const HeroSection = ({ checkoutUrl }: HeroSectionProps) => {
  return (
    <section className="text-center mb-10 animate-fade-in">
      <div className="mb-6">
        <video 
          src={heroVideo} 
          autoPlay
          loop
          muted
          playsInline
          className="w-full max-w-[280px] mx-auto rounded-xl"
        />
      </div>
      
      <h1 className="text-2xl font-extrabold leading-tight mb-4">
        A pergunta que não quer calar é se você teria{" "}
        <span className="text-primary">coragem de fazer de tudo</span>{" "}
        para manter em segurança o seu filhote
      </h1>

      <p className="text-muted-foreground text-base leading-relaxed mb-7">
        90% das mães sofrem em silêncio.<br />
        Você não é uma mãe ruim — só não teve orientação certa.
      </p>

      <Button
        asChild
        size="lg"
        className="w-full gradient-primary shadow-glow animate-pulse-glow text-base font-bold py-5 rounded-lg"
      >
        <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
          Quero Proteger Meu Bebê Agora
        </a>
      </Button>
    </section>
  );
};

export default HeroSection;
