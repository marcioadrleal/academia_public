import {
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  Mail,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  login,
} from "../../services/authService";

import type {
  LoginRequest,
} from "../../types/auth";

import "../../styles/login/login.css";

export function Login() {

  const navigate =
    useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {

    event.preventDefault();

    setError("");

    if (!username.trim()) {

      setError(
        "Informe seu e-mail ou usuário.",
      );

      return;
    }

    if (!password) {

      setError(
        "Informe sua senha.",
      );

      return;
    }

    const request: LoginRequest = {

      username:
        username
          .trim()
          .toLowerCase(),

      password,
    };

    try {

      setLoading(true);

      const response =
        await login(
          request,
        );

      /*
       * Token utilizado nas requisições
       * autenticadas para o Gateway.
       */
      sessionStorage.setItem(
        "access_token",
        response.access_token,
      );

      /*
       * Token utilizado futuramente
       * para renovar o access token.
       */
      sessionStorage.setItem(
        "refresh_token",
        response.refresh_token,
      );

      /*
       * Normalmente será "Bearer".
       */
      sessionStorage.setItem(
        "token_type",
        response.token_type,
      );

      /*
       * Tempo de validade do access token.
       * Atualmente: 300 segundos.
       */
      sessionStorage.setItem(
        "expires_in",
        response.expires_in.toString(),
      );

      /*
       * Tempo de validade do refresh token.
       */
      sessionStorage.setItem(
        "refresh_expires_in",
        response.refresh_expires_in.toString(),
      );

      /*
       * Identificador da sessão do Keycloak.
       */
      sessionStorage.setItem(
        "session_state",
        response.session_state,
      );

      /*
       * Dados completos da pessoa.
       *
       * Como sessionStorage aceita somente
       * String, transformamos o objeto em JSON.
       */
      sessionStorage.setItem(
        "pessoa",
        JSON.stringify(
          response.pessoa,
        ),
      );

      /*
       * ID da pessoa no banco da aplicação.
       *
       * Será bastante utilizado posteriormente,
       * por exemplo para upload e análise
       * dos vídeos.
       */
      sessionStorage.setItem(
        "pessoaId",
        response.pessoa.id.toString(),
      );

      /*
       * ID do usuário no Keycloak.
       *
       * No retorno atual está vindo null.
       * Portanto só salvamos se estiver
       * preenchido.
       */
      if (response.userId) {

        sessionStorage.setItem(
          "userId",
          response.userId,
        );

      } else {

        sessionStorage.removeItem(
          "userId",
        );
      }

      /*
       * Login realizado com sucesso.
       *
       * Redireciona para a área autenticada.
       */
      navigate(
        "/home",
        {
          replace: true,
        },
      );

    } catch (err) {

      console.error(
        "Erro ao realizar login:",
        err,
      );

      if (err instanceof Error) {

        setError(
          err.message,
        );

      } else {

        setError(
          "Não foi possível realizar o login.",
        );
      }

    } finally {

      setLoading(false);
    }
  }

  return (
    <div className="login-page">

      <header className="login-header">

        <button
          className="login-logo"
          type="button"
          onClick={() => navigate("/")}
        >

          <span className="login-logo-icon">
            ∿
          </span>

          <span>
            GYM <strong>AI</strong>
          </span>

        </button>

        <button
          className="login-back"
          type="button"
          onClick={() => navigate("/")}
        >
          Voltar ao início
        </button>

      </header>

      <main className="login-content">

        <div className="login-card">

          <div className="login-card-header">

            <span className="login-label">
              ACESSAR CONTA
            </span>

            <h1>
              Bem-vindo de volta
            </h1>

            <p>
              Entre com seus dados para acessar
              o Gym AI.
            </p>

          </div>

          {error && (

            <div className="login-error">
              {error}
            </div>

          )}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            <div className="login-form-group">

              <label htmlFor="username">
                E-mail ou usuário
              </label>

              <div className="login-input-container">

                <Mail size={18} />

                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(event) =>
                    setUsername(
                      event.target.value,
                    )
                  }
                  placeholder="seu@email.com"
                  autoComplete="username"
                  disabled={loading}
                />

              </div>

            </div>

            <div className="login-form-group">

              <label htmlFor="password">
                Senha
              </label>

              <div className="login-input-container">

                <LockKeyhole size={18} />

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value,
                    )
                  }
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="login-password-button"
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Ocultar senha"
                      : "Mostrar senha"
                  }
                  onClick={() =>
                    setShowPassword(
                      !showPassword,
                    )
                  }
                >

                  {showPassword
                    ? <EyeOff size={18} />
                    : <Eye size={18} />
                  }

                </button>

              </div>

            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >

              <LogIn size={18} />

              {loading
                ? "Entrando..."
                : "Entrar"
              }

            </button>

          </form>

          <div className="login-register">

            <span>
              Ainda não possui uma conta?
            </span>

            <button
              type="button"
              onClick={() =>
                navigate("/cadastro")
              }
            >
              Criar conta
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}