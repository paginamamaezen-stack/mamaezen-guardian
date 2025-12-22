import { Button } from "@/components/ui/button";
import { Shield, Star, CheckCircle, Gift, Clock, Users } from "lucide-react";
import CTAButton from "./CTAButton";
import avatarProtector from "@/assets/avatar-protector.png";

interface OfferSectionProps {
  checkoutUrl: string;
}

const benefits = [
  { icon: CheckCircle, text: "Guia completo de primeiros socorros infantis" },
  { icon: CheckCircle, text: "Checklist de sinais de alerta" },
  { icon: CheckCircle, text: "Técnicas para acalmar o bebê" },
  { icon: CheckCircle, text: "Todas as atualizações futuras incluídas" },
  { icon: CheckCircle, text: "Suporte 24h em português" },
  { icon: Gift, text: "BÔNUS: Grupo VIP de mães fundadoras" },
];

const OfferSection = ({ checkoutUrl }: OfferSectionProps) => {
  return (
    <section className="relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-50" />
      
      <div className="relative gradient-offer border-2 border-primary/50 rounded-2xl p-6 text-center shadow-offer">
        {/* Special tag */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="bg-primary px-6 py-2 rounded-full flex items-center gap-2 shadow-glow">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-black uppercase tracking-wide">Oferta Especial de Fundadora</span>
            <Star className="w-4 h-4 fill-current" />
          </div>
        </div>

        {/* Avatar */}
        <div className="mt-6 mb-4">
          <img
            src={avatarProtector}
            alt="MamãeZen Protetora"
            className="w-36 h-36 mx-auto rounded-full border-4 border-primary/50 shadow-glow object-cover"
          />
        </div>

        {/* Headline */}
        <h2 className="text-2xl font-extrabold mb-2">
          Torne-se uma <span className="text-primary">Mãe Fundadora</span>
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Acesso vitalício ao método completo MamãeZen
        </p>

        {/* Live viewers */}
        <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/40 rounded-full px-4 py-2 mb-6">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <Users className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-400 font-medium">
            47 mães olhando agora
          </span>
        </div>

        {/* Price */}
        <div className="bg-secondary/50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive font-semibold">Promoção por tempo limitado</span>
          </div>
          
          <div className="text-muted-foreground line-through text-lg mb-1">
            De R$ 197,00
          </div>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-lg text-muted-foreground">Por apenas</span>
            <span className="text-5xl font-black text-primary">R$ 49</span>
            <span className="text-2xl font-bold text-primary">,90</span>
          </div>
          <p className="text-foreground/80 text-sm mt-2">
            💳 Ou em até 12x de R$ 4,99
          </p>
          <div className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold mt-2">
            🔥 ECONOMIA DE R$ 147,10
          </div>
        </div>

        {/* Benefits */}
        <div className="text-left mb-6 space-y-3">
          <h3 className="text-sm font-bold text-center mb-4 text-muted-foreground uppercase tracking-wide">
            O que você vai receber:
          </h3>
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-secondary/30 rounded-lg p-3 border border-border/50"
            >
              <benefit.icon className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-sm font-medium">{benefit.text}</span>
            </div>
          ))}
        </div>

        {/* Guarantee Seal */}
        <div className="flex items-center gap-4 bg-green-500/10 border-2 border-green-500/40 rounded-xl p-4 mb-6">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Shield className="w-8 h-8 text-green-400" />
          </div>
          <div className="text-left">
            <div className="text-base font-black text-green-400 mb-1">
              GARANTIA INCONDICIONAL DE 30 DIAS
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              Se por qualquer motivo você não ficar 100% satisfeita, devolvemos todo o seu dinheiro. Sem perguntas, sem burocracia. O risco é todo nosso.
            </div>
          </div>
        </div>

        {/* CTA */}
        <CTAButton checkoutUrl={checkoutUrl} variant="final" />

        {/* Final message */}
        <div className="mt-6 p-4 border border-border/50 rounded-lg">
          <p className="text-sm text-muted-foreground italic">
            "Eu sei como é difícil. Já estive no seu lugar. Por isso criei o MamãeZen — para que nenhuma mãe passe pelo que eu passei."
          </p>
          <p className="text-xs text-primary font-semibold mt-2">— Criadora do MamãeZen</p>
        </div>
      </div>
    </section>
  );
};

export default OfferSection;
