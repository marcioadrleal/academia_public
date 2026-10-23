import { HeroSection } from "../components/home/HeroSection";

import {
  HowItWorksSection,
} from "../components/home/howitworks/HowItWorksSection";

import {
  TechnologySection,
} from "../components/home/technology/TechnologySection";

import "../styles/home.css";

export function Home() {
  return (
    <>
      <HeroSection />

      <div className="home-container">
        <HowItWorksSection />

        <TechnologySection />
      </div>
    </>
  );
}