import { Instagram, Mail, Phone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50 border-t border-border py-8 px-6">
      <div className="container max-w-lg mx-auto">
        {/* Logo/Brand */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-black text-primary">MamãeZen</h3>
          <p className="text-muted-foreground text-sm mt-1">
            Protegendo famílias, transformando vidas 🦅
          </p>
        </div>

        {/* Contatos */}
        <div className="flex flex-col items-center gap-4 mb-6">
          {/* Email */}
          <a 
            href="mailto:mamaezen.vip@gmail.com" 
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span className="text-sm">mamaezen.vip@gmail.com</span>
          </a>

          {/* Telefone/WhatsApp */}
          <a 
            href="https://wa.me/5598991722666" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm">(98) 99172-2666</span>
          </a>

          {/* Instagram */}
          <a 
            href="https://www.instagram.com/mamaezen_app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Instagram className="w-4 h-4" />
            <span className="text-sm">@mamaezen_app</span>
          </a>
        </div>

        {/* Divider */}
        <div className="bg-gradient-to-r from-transparent via-border to-transparent h-px mb-6" />

        {/* Copyright */}
        <div className="text-center">
          <p className="text-muted-foreground text-xs">
            © {currentYear} MamãeZen. Todos os direitos reservados.
          </p>
          <p className="text-muted-foreground/60 text-xs mt-2">
            CNPJ: Em registro | Atendimento: Seg-Sex 9h-18h
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
