import React, { useState } from 'react';
import FloatingNavbar from './components/FloatingNavbar';
import HeroSection from './components/HeroSection';
import PhilosophySection from './components/PhilosophySection';
import TestimonialsSection from './components/TestimonialsSection';
import ChatModal from './components/ChatModal';


function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  return (
    <div className="min-h-screen bg-[#030014] text-white selection:bg-purple-500/30 relative overflow-hidden">

      {/* Ambient Lighting - The "Points of Light" */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-violet-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000" />
      </div>

      {/* Subtle Grid Pattern */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0 opacity-[0.03] bg-[size:40px_40px]" />

      <FloatingNavbar />

      <main className="relative z-10">
        <HeroSection
          title="Design que define o mercado."
          description="Transforme visitantes em leads fieis. O único sistema que une estética de luxo e aquisição automática para o seu negócio."
          onOpenChat={openChat}
        />
        <PhilosophySection />
        <TestimonialsSection />
      </main>

      <footer className="py-8 text-center text-titanium text-sm border-t border-white/5 relative z-10">
        <p>&copy; {new Date().getFullYear()} LandingOS. All rights reserved.</p>
      </footer>

      <ChatModal isOpen={isChatOpen} onClose={closeChat} />
    </div>
  );
}

export default App;
