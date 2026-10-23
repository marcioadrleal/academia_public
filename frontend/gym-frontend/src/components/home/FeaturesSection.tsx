import {
  BrainCircuit,
  FileCheck2,
  Upload,
} from "lucide-react";

import { FeatureCard } from "./FeatureCard";

import "../../styles/features-section.css";

export function FeaturesSection() {
  return (
    <section
      id="como-funciona"
      className="features-section"
    >
      <div className="section-heading">
        <span className="section-label">
          COMO FUNCIONA
        </span>

        <h2>
          Tecnologia para entender cada movimento
        </h2>

        <p>
          Um processo simples que transforma o vídeo do seu
          exercício em informações úteis sobre sua execução.
        </p>
      </div>

      <div className="feature-grid">
        <FeatureCard
          number="01"
          icon={<Upload size={24} />}
          title="Envie seu vídeo"
          description="Grave seu exercício e envie o vídeo para iniciar a análise."
        />

        <FeatureCard
          number="02"
          icon={<BrainCircuit size={24} />}
          title="Análise inteligente"
          description="Nossa tecnologia identifica os movimentos e processa os dados do exercício."
        />

        <FeatureCard
          number="03"
          icon={<FileCheck2 size={24} />}
          title="Receba o resultado"
          description="Consulte os pontos positivos, pontos de atenção e recomendações da análise."
        />
      </div>
    </section>
  );
}