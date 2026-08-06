import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import BotlerLiveSection from "@/components/home/BotlerLiveSection";
import OfferFamiliesSection from "@/components/home/OfferFamiliesSection";
import ShowcaseSection from "@/components/home/ShowcaseSection";
import HowWeWorkSection from "@/components/home/HowWeWorkSection";
import AgentBoundariesSection from "@/components/home/AgentBoundariesSection";
import BookingSection from "@/components/home/BookingSection";
import DataSecuritySection from "@/components/home/DataSecuritySection";
import FAQSection from "@/components/home/FAQSection";
import FinalCTASection from "@/components/home/FinalCTASection";

// The hub is the company's demo, not a "who we are" page (brief §1-2): the
// embedded agent rises to the first screen, and every offer card follows
// the two-state rule (real link vs. talk-to-Botler) instead of describing
// capabilities in the abstract.
export default function Home() {
  // Cross-page anchor nav (e.g. clicking "Rendez-vous" from another route
  // lands on "/#rendez-vous") — scroll to the hash target once painted.
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <BotlerLiveSection />
      <OfferFamiliesSection />
      <ShowcaseSection />
      <HowWeWorkSection />
      <AgentBoundariesSection />
      <BookingSection />
      <DataSecuritySection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
