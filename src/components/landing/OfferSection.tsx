import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

interface OfferSectionProps {
  checkoutUrl: string;
}

const benefits = [
  "Todas as atualizações futuras",
  "Sem mensalidade",
  "Suporte em português",
];

const OfferSection = ({ checkoutUrl }: OfferSectionProps) => {
  return (
    <section className="gradient-offer border border-accent rounded-xl p-6 text-center shadow-offer">
      {/* Tag */}
      <div className="inline-block bg-accent px-3.5 py-1.5 rounded-full text-xs mb-4">
        Fundadora Vitalícia
      </div>

      {/* Price */}
      <div className="text-muted-foreground line-through text-sm mb-1">
        De R$ 197
      </div>
      <div className="text-4xl font-black mb-1">
        R$ 49<span className="text-lg">,90</span>
      </div>
      <p className="text-foreground/80 text-sm mb-5">
        Pagamento único • Acesso vitalício
      </p>

      {/* Benefits */}
      <ul className="text-left mb-5 space-y-2.5">
        {benefits.map((benefit, index) => (
          <li key={index} className="text-sm flex items-center gap-2">
            <span className="text-primary">✔</span>
            {benefit}
          </li>
        ))}
      </ul>

      {/* Guarantee Seal */}
      <div className="flex items-center justify-center gap-3 bg-secondary/50 border border-border rounded-lg p-4 mb-5">
        <Shield className="w-10 h-10 text-primary flex-shrink-0" />
        <div className="text-left">
          <div className="text-sm font-bold">Garantia de 30 dias</div>
          <div className="text-xs text-muted-foreground">
            Se não gostar, devolvemos 100% do seu dinheiro. Sem perguntas.
          </div>
        </div>
      </div>

      {/* CTA */}
      <Button
        asChild
        size="lg"
        className="w-full gradient-primary rounded-lg font-extrabold text-base py-5"
      >
        <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
          Ser Fundadora MamãeZen Agora
        </a>
      </Button>
    </section>
  );
};

export default OfferSection;
