import Navbar from "../components/common/Navbar";
import HeroSection from "../components/common/HeroSection";
import FeatureSection from "../components/common/FeatureSection";
import TestimonialSection from "../components/common/TestimonialSection";
import FAQSection from "../components/common/FAQSection";
import Footer from "../components/common/Footer";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import BubbleBackground from "./BubbleBackground";

const Landing = () => (
  <div className="relative min-h-screen bg-[#0a0f1c] text-white overflow-hidden ">
      {/* 🌟 Bubbles across entire page */}
      <Navbar />
      <BubbleBackground />

      {/* Page Sections */}
      <HeroSection />
      <FeatureSection />
      <TestimonialSection />
      <FAQSection />
      <Footer />
    </div>
);

export default Landing;
