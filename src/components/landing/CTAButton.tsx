import { Button } from "@/components/ui/button";
import { ShieldCheck, Zap, ArrowRight, Lock } from "lucide-react";

interface CTAButtonProps {
  checkoutUrl: string;
  variant?: "primary" | "hero" | "final";
}

const CTAButton = ({ checkoutUrl, variant = "primary" }: CTAButtonProps) => {
  if (variant === "hero") {
    return (
      <div className="space-y-4">
        <Button
          asChild
          size="lg"
          className="w-full relative overflow-hidden gradient-primary shadow-glow text-lg font-black py-7 rounded-xl group animate-pulse-glow"
        >
          <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
            <span className="relative z-10 flex items-center justify-center gap-2">
              <ShieldCheck className="w-6 h-6" />
              <span>QUERO PROTEGER MEU BEBÊ AGORA</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            {/* Shine effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </a>
        </Button>
        
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Compra 100% Segura
          </span>
          <span>•</span>
          <span>Acesso Imediato</span>
          <span>•</span>
          <span>Garantia 30 dias</span>
        </div>
      </div>
    );
  }

  if (variant === "final") {
    return (
      <div className="space-y-4">
        {/* Main CTA */}
        <Button
          asChild
          size="lg"
          className="w-full relative overflow-hidden gradient-primary shadow-glow text-lg font-black py-8 rounded-xl group"
        >
          <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            <span className="relative z-10 flex flex-col items-center gap-1">
              <span className="flex items-center gap-2">
                <Zap className="w-6 h-6 animate-pulse" />
                <span>SIM! QUERO SER FUNDADORA AGORA</span>
              </span>
              <span className="text-sm font-normal opacity-90">
                Clique aqui e garanta sua vaga
              </span>
            </span>
          </a>
        </Button>

        {/* Urgency indicator */}
        <div className="bg-destructive/20 border border-destructive/40 rounded-lg p-3 text-center">
          <p className="text-sm font-semibold text-destructive">
            ⚠️ ATENÇÃO: Valor promocional por tempo limitado
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Após encerrar, o preço volta para R$ 197
          </p>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-secondary/50 rounded-lg p-2">
            <div className="text-lg mb-1">🔒</div>
            <div className="text-xs text-muted-foreground">Pagamento Seguro</div>
          </div>
          <div className="bg-secondary/50 rounded-lg p-2">
            <div className="text-lg mb-1">⚡</div>
            <div className="text-xs text-muted-foreground">Acesso Imediato</div>
          </div>
          <div className="bg-secondary/50 rounded-lg p-2">
            <div className="text-lg mb-1">✅</div>
            <div className="text-xs text-muted-foreground">Garantia 30 dias</div>
          </div>
        </div>
      </div>
    );
  }

  // Primary variant (default)
  return (
    <Button
      asChild
      size="lg"
      className="w-full gradient-primary shadow-glow text-base font-bold py-6 rounded-xl group animate-pulse-glow"
    >
      <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
        <ShieldCheck className="w-5 h-5 mr-2" />
        <span>Garantir Minha Vaga Agora</span>
        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </a>
    </Button>
  );
};

export default CTAButton;
