import {
  BrainCircuit,
  FileCheck2,
  Upload,
} from "lucide-react";

import { HowItWorksCard } from "./HowItWorksCard";

import "../../../styles/howitworks/how-it-works-section.css";

export function HowItWorksSection() {
  return (
    <section
      id="como-funciona"
      className="how-it-works"
    >
      <div className="how-it-works-header">
        <span className="section-label">
          COMO FUNCIONA
        </span>

        <h2>
          Do vídeo ao resultado em poucos passos
        </h2>

        <p>
          O Gym AI transforma o vídeo do seu exercício
          em informações que ajudam a entender melhor
          a execução do movimento.
        </p>
      </div>

      <div className="how-it-works-grid">

        <HowItWorksCard
          number="01"
          icon={<Upload size={26} />}
          title="Envie seu vídeo"
          description="Grave a execução do exercício e envie o vídeo para iniciar a análise."
        />

        <HowItWorksCard
          number="02"
          icon={<BrainCircuit size={26} />}
          title="Processamento inteligente"
          description="A tecnologia identifica pontos do corpo e acompanha os movimentos durante o exercício."
        />

        <HowItWorksCard
          number="03"
          icon={<FileCheck2 size={26} />}
          title="Receba sua análise"
          description="Consulte pontos positivos, pontos de atenção e recomendações geradas pela análise."
        />

      </div>
    </section>
  );
}