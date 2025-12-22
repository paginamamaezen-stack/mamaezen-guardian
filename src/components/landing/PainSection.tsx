const painPoints = [
  "bebê chorando toda hora",
  "bebê mijando, fazendo cocô",
  "casa pra arrumar, roupa pra lavar",
  "sono quebrado e medo de errar",
];

const PainSection = () => {
  return (
    <section className="gradient-card border border-border rounded-xl p-5 mb-9">
      <h2 className="text-lg font-bold mb-4">Rotinas diárias sem solução</h2>
      
      <div className="flex flex-col gap-3">
        {painPoints.map((point, index) => (
          <div key={index} className="flex gap-2.5 text-foreground/90 text-base">
            <span className="text-primary font-bold">&amp;</span>
            <span>{point}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PainSection;
