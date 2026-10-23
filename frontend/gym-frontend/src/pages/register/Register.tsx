import {
  Activity,
  ArrowLeft,
} from "lucide-react";

import { RegisterForm } from "../../components/register/RegisterForm";
import "../../styles/register/register.css";

export function Register() {
  return (
    <div className="register-page">

      <header className="register-header">

        <a
          href="/"
          className="register-logo"
        >
          <div className="register-logo-icon">
            <Activity size={22} />
          </div>

          <strong>
            GYM <span>AI</span>
          </strong>
        </a>

        <a
          href="/"
          className="register-back"
        >
          <ArrowLeft size={17} />
          Voltar ao início
        </a>

      </header>

      <main className="register-content">

        <div className="register-title">
          <span>CRIAR CONTA</span>

          <h1>
            Crie sua conta
          </h1>

          <p>
            Preencha seus dados para começar
            a utilizar o Gym AI.
          </p>
        </div>

        <RegisterForm />

      </main>

    </div>
  );
}