import React from 'react';
import FloatingNavbar from '../components/FloatingNavbar';
import HeroSection from '../components/HeroSection';
import ImageComparisonSection from '../components/ImageComparisonSection';
import FeaturesSection from '../components/FeaturesSection';
import ConversationsSection from '../components/ConversationsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import PricingSection from '../components/PricingSection';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const openChat = (inputValue = '') => {
    navigate('/chat', { state: { userInput: inputValue } });
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white selection:bg-purple-500/30 relative overflow-hidden">

      {/* Ambient Lighting - The "Points of Light" */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-violet-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-2000" />
      </div>

      {/* Subtle Grid Pattern */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0 opacity-[0.03] bg-[size:40px_40px]" />

      <FloatingNavbar />

      <main className="relative z-10">
        <HeroSection
          title="Design que define o mercado."
          description="Transformamos visitantes em clientes fieis. O único sistema que une estética de luxo e performance de venda para o seu negócio."
          onOpenChat={openChat}
        />
        <ImageComparisonSection />
        <div className="py-16">
          <FeaturesSection />
        </div>
        <div className="py-20">
          <ConversationsSection />
        </div>
        <div className="py-16">
          <TestimonialsSection />
        </div>
        <div className="py-20">
          <PricingSection />
        </div>
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
