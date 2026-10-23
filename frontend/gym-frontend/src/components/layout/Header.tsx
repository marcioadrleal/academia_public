import {
  Activity,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import "../../styles/header.css";

export function Header() {

  const navigate = useNavigate();

  function handleRegister() {
    navigate("/cadastro");
  }

  return (
    <header className="main-header">
      <div className="header-container">

        <div className="logo">
          <div className="logo-icon">
            <Activity size={24} />
          </div>

          <div className="logo-text">
            <strong>GYM</strong>
            <span>AI</span>
          </div>
        </div>

        <nav className="navigation">
          <a className="active" href="#">
            Início
          </a>

          <a href="#como-funciona">
            Como funciona
          </a>

          <a href="#tecnologia">
            Tecnologia
          </a>
        </nav>

        <div className="auth-actions">

          <button
            className="login-button"
            type="button"
            onClick={() => navigate("/login")}
          >
            Entrar
          </button>

          <button
            className="register-button"
            type="button"
            onClick={handleRegister}
          >
            Criar conta
          </button>

        </div>

      </div>
    </header>
  );
}