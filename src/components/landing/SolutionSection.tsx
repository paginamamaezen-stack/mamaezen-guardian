import characterImage from "@/assets/character-sitting.png";

const SolutionSection = () => {
  return (
    <section className="gradient-card border border-border rounded-xl p-5 mb-9">
      <div className="flex gap-4 items-start">
        <img 
          src={characterImage} 
          alt="Personagem MamãeZen" 
          className="w-24 h-auto rounded-lg flex-shrink-0"
        />
        <div>
          <h3 className="text-xl font-bold mb-3">O que é o MamãeZen</h3>
          <p className="text-muted-foreground leading-relaxed text-base">
            O MamãeZen é o seu plano diário de maternidade.
            Checklists simples, rotinas de sono, alertas de emergência
            e apoio real — tudo na palma da sua mão, sem julgamento.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
