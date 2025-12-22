import heroVideo from "@/assets/hero-video.mp4";
import CTAButton from "./CTAButton";

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
          className="w-full max-w-[320px] mx-auto rounded-2xl border-2 border-primary/30 shadow-glow"
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

      <CTAButton checkoutUrl={checkoutUrl} variant="hero" />
    </section>
  );
};

export default HeroSection;
