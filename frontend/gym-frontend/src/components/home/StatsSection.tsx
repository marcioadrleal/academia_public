import {
  Activity,
  CheckCircle2,
  Clock3,
} from "lucide-react";

export function StatsSection() {
  return (
    <section className="stats">

      <div className="stat-card">

        <div className="stat-icon">
          <Activity size={22} />
        </div>

        <div>
          <span>
            Total de análises
          </span>

          <strong>
            12
          </strong>
        </div>

      </div>

      <div className="stat-card">

        <div className="stat-icon">
          <CheckCircle2 size={22} />
        </div>

        <div>
          <span>
            Concluídas
          </span>

          <strong>
            10
          </strong>
        </div>

      </div>

      <div className="stat-card">

        <div className="stat-icon">
          <Clock3 size={22} />
        </div>

        <div>
          <span>
            Em processamento
          </span>

          <strong>
            2
          </strong>
        </div>

      </div>

    </section>
  );
}