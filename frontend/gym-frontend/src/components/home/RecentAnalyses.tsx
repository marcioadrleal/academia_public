import {
  ArrowRight,
  PlayCircle,
} from "lucide-react";

export function RecentAnalyses() {
  return (
    <section className="recent-section">

      <div className="recent-header">

        <div>
          <span className="section-label">
            ATIVIDADE RECENTE
          </span>

          <h2>
            Últimas análises
          </h2>
        </div>

        <button
          className="view-all"
          type="button"
        >
          Ver todas

          <ArrowRight size={16} />
        </button>

      </div>

      <div className="analysis-list">

        <div className="analysis-item">

          <div className="exercise-image exercise-image-1">
            <PlayCircle size={25} />
          </div>

          <div className="analysis-description">

            <strong>
              Flexão de braço
            </strong>

            <span>
              Análise de execução
            </span>

          </div>

          <div className="analysis-date">

            <span>
              Hoje
            </span>

            <strong>
              10:32
            </strong>

          </div>

          <span className="status completed">
            Concluído
          </span>

          <button
            className="analysis-button"
            type="button"
          >
            Ver análise

            <ArrowRight size={16} />
          </button>

        </div>


        <div className="analysis-item">

          <div className="exercise-image exercise-image-2">
            <PlayCircle size={25} />
          </div>

          <div className="analysis-description">

            <strong>
              Agachamento
            </strong>

            <span>
              Análise de execução
            </span>

          </div>

          <div className="analysis-date">

            <span>
              Ontem
            </span>

            <strong>
              18:46
            </strong>

          </div>

          <span className="status attention">
            Atenção
          </span>

          <button
            className="analysis-button"
            type="button"
          >
            Ver análise

            <ArrowRight size={16} />
          </button>

        </div>

      </div>

    </section>
  );
}