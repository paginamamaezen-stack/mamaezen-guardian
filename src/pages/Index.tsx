import avatarProtector from "@/assets/avatar-protector.png";

const CHECKOUT_URL = "#"; // Substitua pela URL do checkout

const Index = () => {
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

      {/* HERO */}
      <section className="text-center mb-10">
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
      <section className="gradient-offer border border-primary/20 rounded-[22px] p-[26px] text-center shadow-offer">
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
