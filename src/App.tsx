import { useState } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Button } from "./components/ui/Button";
import { BentoGrid } from "./components/ui/BentoGrid";
import { TrustDashboard } from "./components/trust/TrustDashboard";
import { ReviewSequence } from "./components/video/ReviewSequence";
import { AboutModal } from "./components/layout/AboutModal";
import { JoinResistanceModal } from "./components/layout/JoinResistanceModal";
import { AuthModal } from "./components/auth/AuthModal";
import { UserProfile } from "./components/profile/UserProfile";
import { Leaderboard } from "./components/leaderboard/Leaderboard";
import { GameSearch } from "./components/search/GameSearch";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AudioVisualizer } from "./components/video/AudioVisualizer";
import { ReviewsPage } from "./components/reviews/ReviewsPage";
import { WriteReviewModal } from "./components/reviews/WriteReviewModal";
import { Trophy, Search, Shield, Music, Star } from "lucide-react";

type Section = "home" | "profile" | "leaderboard" | "search" | "admin" | "audio" | "reviews";

function App() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("home");

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-critic-green selection:text-black">
      <Navbar
        onAboutClick={() => setIsAboutOpen(true)}
        onProfileClick={() => setActiveSection(activeSection === "profile" ? "home" : "profile")}
        onSignInClick={() => setIsAuthOpen(true)}
      />

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <JoinResistanceModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <WriteReviewModal isOpen={isWriteReviewOpen} onClose={() => setIsWriteReviewOpen(false)} />

      <main className="pt-24 px-4 max-w-7xl mx-auto mb-20">
        {/* Quick Nav */}
        {activeSection !== "home" && (
          <div className="flex items-center gap-2 mb-8">
            <Button
              variant="ghost"
              onClick={() => setActiveSection("home")}
              className="text-sm"
            >
              ← Back to Home
            </Button>
          </div>
        )}

        {/* Section Content */}
        {activeSection === "profile" && (
          <section className="py-12">
            <UserProfile />
          </section>
        )}

        {activeSection === "leaderboard" && (
          <section className="py-12">
            <Leaderboard />
          </section>
        )}

        {activeSection === "search" && (
          <section className="py-12">
            <GameSearch />
          </section>
        )}

        {activeSection === "admin" && (
          <section className="py-12">
            <AdminDashboard />
          </section>
        )}

        {activeSection === "audio" && (
          <section className="py-12 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-black text-white mb-2">Audio Visualizer</h2>
              <p className="text-text-muted">Experience the rhythm of gaming</p>
            </div>
            <AudioVisualizer />
          </section>
        )}

        {activeSection === "reviews" && (
          <section className="py-12">
            <ReviewsPage onWriteReview={() => setIsWriteReviewOpen(true)} />
          </section>
        )}

        {activeSection === "home" && (
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
              <div className="flex gap-4 flex-wrap justify-center">
                <Button
                  variant="primary"
                  onClick={() => setActiveSection("reviews")}
                  className="bg-critic-green text-black hover:bg-critic-green/80 hover:border-transparent hover:shadow-[0_0_20px_rgba(190,242,100,0.5)]"
                >
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

            {/* Quick Links */}
            <section className="py-12">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: "Reviews", icon: Star, section: "reviews" as Section, color: "text-bruta-red" },
                  { label: "Leaderboard", icon: Trophy, section: "leaderboard" as Section, color: "text-yellow-500" },
                  { label: "Find Games", icon: Search, section: "search" as Section, color: "text-critic-green" },
                  { label: "Audio Viz", icon: Music, section: "audio" as Section, color: "text-blue-400" },
                  { label: "Admin", icon: Shield, section: "admin" as Section, color: "text-purple-400" },
                ].map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    onClick={() => setActiveSection(item.section)}
                    className="flex flex-col items-center gap-2 p-6 h-auto border border-zinc-800 hover:border-zinc-700"
                  >
                    <item.icon className={`w-8 h-8 ${item.color}`} />
                    <span className="text-sm font-bold">{item.label}</span>
                  </Button>
                ))}
              </div>
            </section>

            {/* Bento Grid Section */}
            <section className="py-20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold font-display">Trending & Verified</h2>
                <Button variant="ghost" className="text-critic-green" onClick={() => setActiveSection("reviews")}>
                  View All
                </Button>
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
