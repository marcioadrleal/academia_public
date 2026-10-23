import {
  BrainCircuit,
  Eye,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { TechnologyFeature } from "./TechnologyFeature";

import "../../../styles/tecnology/technology-section.css";

export function TechnologySection() {
  return (
    <section
      id="tecnologia"
      className="technology-section"
    >
      <div className="technology-container">

        <div className="technology-content">
          <span className="technology-label">
            CONHEÇA A TECNOLOGIA
          </span>

          <h2>
            Inteligência artificial aplicada ao movimento
          </h2>

          <p className="technology-description">
            O Gym AI combina visão computacional e
            inteligência artificial para transformar
            movimentos capturados em vídeo em informações
            mais fáceis de compreender.
          </p>

          <div className="technology-features">

            <TechnologyFeature
              icon={<Eye size={21} />}
              title="Visão computacional"
              description="Identifica pontos do corpo e acompanha os movimentos durante a execução do exercício."
            />

            <TechnologyFeature
              icon={<BrainCircuit size={21} />}
              title="Inteligência artificial"
              description="Interpreta os dados processados e transforma informações técnicas em uma análise compreensível."
            />

            <TechnologyFeature
              icon={<ShieldCheck size={21} />}
              title="Privacidade"
              description="O vídeo é utilizado exclusivamente para realizar a análise e, após a conclusão do processamento, será excluído automaticamente, não permanecendo armazenado no sistema."
            />

          </div>
        </div>

        <div className="technology-visual">

          <div className="technology-main-card">

            <div className="technology-main-icon">
              <Sparkles size={30} />
            </div>

            <span>
              ANÁLISE INTELIGENTE
            </span>

            <strong>
              Movimento transformado em informação
            </strong>

            <div className="technology-flow">
              <span>Vídeo</span>
              <b>→</b>
              <span>Movimento</span>
              <b>→</b>
              <span>IA</span>
              <b>→</b>
              <span>Resultado</span>
            </div>

          </div>

          <div className="technology-small-card technology-card-one">
            Visão computacional
          </div>

          <div className="technology-small-card technology-card-two">
            IA Generativa
          </div>

        </div>

      </div>
    </section>
  );
}