import {
  CheckCircle2,
} from "lucide-react";

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import type {
  RegisterResponse,
} from "../../types/register";

import "../../styles/register/register-success.css";

export function RegisterSuccess() {

  const location = useLocation();

  const data =
    location.state as RegisterResponse | null;

  if (!data) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return (
    <div className="register-success-page">

      <div className="register-success-card">

        <div className="success-icon">
          <CheckCircle2 size={34} />
        </div>

        <span className="success-label">
          CADASTRO REALIZADO
        </span>

        <h1>
          Conta criada com sucesso!
        </h1>

        <p>
          Seus dados foram cadastrados e sua conta
          já está disponível.
        </p>

        <div className="success-data">

          <div>
            <span>Nome</span>

            <strong>
              {data.dataPerson.nome}
            </strong>
          </div>

          <div>
            <span>E-mail</span>

            <strong>
              {data.dataPerson.email}
            </strong>
          </div>

          <div>
            <span>Usuário</span>

            <strong>
              {data.user.userName}
            </strong>
          </div>

          <div>
            <span>Data de nascimento</span>

            <strong>
              {data.dataPerson.dataNascimento}
            </strong>
          </div>

          <div>
            <span>Celular</span>

            <strong>
              {data.dataPerson.celular}
            </strong>
          </div>

          <div>
            <span>Cidade</span>

            <strong>
              {data.dataPerson.cidade}
              {" - "}
              {data.dataPerson.uf}
            </strong>
          </div>

        </div>

        <a
          href="/login"
          className="success-login-button"
        >
          Ir para o login
        </a>

      </div>

    </div>
  );
}