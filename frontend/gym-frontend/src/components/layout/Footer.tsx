import {
  Activity,
  BrainCircuit,
} from "lucide-react";

import "../../styles/footer.css";

export function Footer() {
  return (
    <footer className="main-footer">

      <div className="footer-container">

        <div className="footer-brand">

          <div className="footer-logo">
            <Activity size={21} />
          </div>

          <div>
            <strong>
              GYM <span>AI</span>
            </strong>

            <p>
              Análise inteligente de movimentos.
            </p>
          </div>

        </div>

        <div className="footer-ai">
          <BrainCircuit size={17} />

          <span>
            Tecnologia aplicada à evolução do movimento
          </span>
        </div>

        <div className="footer-copyright">
          © 2026 Gym AI
        </div>

      </div>

    </footer>
  );
}