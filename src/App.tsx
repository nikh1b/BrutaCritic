import { useState } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Button } from "./components/ui/Button";
import { BentoGrid } from "./components/ui/BentoGrid";
import { TrustDashboard } from "./components/trust/TrustDashboard";
import { ReviewSequence } from "./components/video/ReviewSequence";
import { AboutModal } from "./components/layout/AboutModal";
import { JoinResistanceModal } from "./components/layout/JoinResistanceModal";
import { UserProfile } from "./components/profile/UserProfile";

function App() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"home" | "profile">("home");

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-critic-green selection:text-black">
      <Navbar
        onAboutClick={() => setIsAboutOpen(true)}
        onProfileClick={() => setActiveSection(activeSection === "profile" ? "home" : "profile")}
      />

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <JoinResistanceModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} />

      <main className="pt-24 px-4 max-w-7xl mx-auto mb-20">
        {activeSection === "profile" ? (
          <section className="py-12">
            <UserProfile />
          </section>
        ) : (
          <>
            <section className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8">
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none">
                <span className="block text-text-primary">NO PAID</span>
                <span className="block text-bruta-red">SHILLS.</span>
              </h1>
              <p className="max-w-xl text-xl text-text-muted">
                The only game review platform where you must prove you played it.
                <span className="block text-critic-green font-bold mt-2">Skin in the game required.</span>
              </p>
              <div className="flex gap-4">
                <Button variant="primary" className="bg-critic-green text-black hover:bg-critic-green/80 hover:border-transparent hover:shadow-[0_0_20px_rgba(190,242,100,0.5)]">
                  Read Reviews
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setIsJoinOpen(true)}
                  className="hover:border-bruta-red hover:text-bruta-red"
                >
                  Join the Resistance
                </Button>
              </div>
            </section>

            {/* Bento Grid Section */}
            <section className="py-20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold font-display">Trending & Verified</h2>
                <Button variant="ghost" className="text-critic-green">View All</Button>
              </div>
              <BentoGrid />
            </section>

            {/* Trust Engine Diagnostic */}
            <section className="py-20">
              <TrustDashboard />
            </section>

            {/* Video Pipeline Preview */}
            <section className="py-20 pb-40">
              <div className="flex flex-col items-center gap-8">
                <ReviewSequence />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
