import TopBadges from "@/components/landing/TopBadges";
import HeroSection from "@/components/landing/HeroSection";
import PainSection from "@/components/landing/PainSection";
import SolutionSection from "@/components/landing/SolutionSection";
import OfferSection from "@/components/landing/OfferSection";

// TODO: Replace with actual checkout URL
const CHECKOUT_URL = "https://seu-link-de-pagamento.com";

const Index = () => {
  return (
    <div className="min-h-screen pb-20">
      <div className="container py-6">
        <TopBadges />
        <HeroSection checkoutUrl={CHECKOUT_URL} />
        <PainSection />
        <SolutionSection />
        <OfferSection checkoutUrl={CHECKOUT_URL} />
      </div>
    </div>
  );
};

export default Index;
