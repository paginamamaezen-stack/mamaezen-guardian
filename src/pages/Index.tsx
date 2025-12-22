import { useState } from "react";
import TopBadges from "@/components/landing/TopBadges";
import HeroSection from "@/components/landing/HeroSection";
import QuizSection from "@/components/landing/QuizSection";
import PainSection from "@/components/landing/PainSection";
import SolutionSection from "@/components/landing/SolutionSection";
import OfferSection from "@/components/landing/OfferSection";

// TODO: Replace with actual checkout URL
const CHECKOUT_URL = "https://seu-link-de-pagamento.com";

const Index = () => {
  const [showOffer, setShowOffer] = useState(false);

  const handleQuizComplete = () => {
    setShowOffer(true);
    // Scroll to offer section smoothly
    setTimeout(() => {
      document.getElementById("offer-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="container py-6 max-w-lg mx-auto">
        <TopBadges />
        <HeroSection checkoutUrl={CHECKOUT_URL} />
        
        {/* Quiz Section */}
        <QuizSection onComplete={handleQuizComplete} />

        <PainSection />
        <SolutionSection />
        
        {/* Offer Section - highlighted after quiz completion */}
        <div 
          id="offer-section"
          className={`transition-all duration-500 ${showOffer ? "animate-pulse-glow" : ""}`}
        >
          <OfferSection checkoutUrl={CHECKOUT_URL} />
        </div>
      </div>
    </div>
  );
};

export default Index;
