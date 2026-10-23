import {
  ArrowRight,
  BrainCircuit,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">

        <div className="ai-badge">
          <BrainCircuit size={17} />
          <span>INTELIGÊNCIA ARTIFICIAL</span>
        </div>

        <h1>
          Transforme movimento
          <span>em evolução.</span>
        </h1>

        <p>
          Envie seus exercícios e receba uma análise
          inteligente de movimento, postura e execução
          através de inteligência artificial.
        </p>

        <div className="hero-actions">

          <a
            href="#como-funciona"
            className="primary-button"
          >
            Como funciona
            <ArrowRight size={18} />
          </a>

          <a
            href="#tecnologia"
            className="secondary-button"
          >
            Conheça a tecnologia
            <ArrowRight size={18} />
          </a>

        </div>

      </div>
    </section>
  );
}