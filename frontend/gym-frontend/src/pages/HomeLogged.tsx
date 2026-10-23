import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Activity,
  BarChart3,
  Dumbbell,
  Home,
  LogOut,
  Plus,
  User,
} from "lucide-react";

import type {
  Pessoa,
} from "../types/auth";

import type {
  EstatisticaResponse,
} from "../types/statistics";

import {
  buscarEstatisticas,
} from "../services/statisticsService";

import "../styles/homeLogged.css";

function HomeLogged() {

  const navigate =
    useNavigate();

  const [
    pessoa,
    setPessoa,
  ] =
    useState<Pessoa | null>(
      null,
    );

  const [
    estatistica,
    setEstatistica,
  ] =
    useState<EstatisticaResponse | null>(
      null,
    );

  const [
    carregandoEstatistica,
    setCarregandoEstatistica,
  ] =
    useState(true);

  useEffect(() => {

    const accessToken =
      sessionStorage.getItem(
        "access_token",
      );

    const pessoaStorage =
      sessionStorage.getItem(
        "pessoa",
      );

    if (
      !accessToken ||
      !pessoaStorage
    ) {

      navigate(
        "/login",
        {
          replace: true,
        },
      );

      return;
    }

    try {

      const pessoaLogada: Pessoa =
        JSON.parse(
          pessoaStorage,
        );

      setPessoa(
        pessoaLogada,
      );

      carregarEstatisticas(
        pessoaLogada.id,
      );

    } catch (error) {

      console.error(
        "Erro ao recuperar pessoa:",
        error,
      );

      sessionStorage.clear();

      navigate(
        "/login",
        {
          replace: true,
        },
      );
    }

  }, [navigate]);

  async function carregarEstatisticas(
    pessoaId: number,
  ) {

    try {

      setCarregandoEstatistica(
        true,
      );

      const response =
        await buscarEstatisticas(
          pessoaId,
        );

      setEstatistica(
        response,
      );

    } catch (error) {

      console.error(
        "Erro ao carregar estatísticas:",
        error,
      );

      setEstatistica(
        null,
      );

    } finally {

      setCarregandoEstatistica(
        false,
      );
    }
  }

  function logout() {

    sessionStorage.clear();

    navigate(
      "/login",
      {
        replace: true,
      },
    );
  }

  function formatarData(
    data: string | null,
  ): string {

    if (!data) {
      return "-";
    }

    const [
      dataParte,
      horaParte,
    ] =
      data.split("T");

    const [
      ano,
      mes,
      dia,
    ] =
      dataParte.split("-");

    const hora =
      horaParte.substring(
        0,
        5,
      );

    return (
      `${dia}/${mes}/${ano} ${hora}`
    );
  }

  function primeiroNome(
    nome: string,
  ): string {

    return nome
      .trim()
      .split(" ")[0];
  }

  if (!pessoa) {

    return (
      <div className="home-loading">
        Carregando...
      </div>
    );
  }

  return (

    <div className="home-logged">

      <aside className="home-sidebar">

        <div className="home-sidebar-logo">

          <div className="home-logo-icon">
            <Dumbbell
              size={26}
            />
          </div>

          <div>
            <strong>
              Gym AI
            </strong>

            <span>
              Análise Inteligente
            </span>
          </div>

        </div>

        <nav className="home-sidebar-menu">

          <button
            type="button"
            className="active"
            onClick={() =>
              navigate(
                "/home",
              )
            }
          >
            <Home
              size={20}
            />

            Início
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/analise/nova",
              )
            }
          >
            <Plus
              size={20}
            />

            Nova análise
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/analises",
              )
            }
          >
            <BarChart3
              size={20}
            />

            Minhas análises
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/perfil",
              )
            }
          >
            <User
              size={20}
            />

            Meu perfil
          </button>

        </nav>

        <button
          type="button"
          className="home-logout"
          onClick={logout}
        >

          <LogOut
            size={20}
          />

          Sair

        </button>

      </aside>

      <main className="home-main">

        <header className="home-main-header">

          <div>

            <span className="home-header-label">
              PAINEL
            </span>

            <h1>
              Olá,{" "}
              {
                primeiroNome(
                  pessoa.nome,
                )
              }
            </h1>

          </div>

          <div className="home-user">

            <div className="home-user-avatar">

              {
                primeiroNome(
                  pessoa.nome,
                )
                  .charAt(0)
                  .toUpperCase()
              }

            </div>

            <div>

              <strong>
                {
                  pessoa.nome
                }
              </strong>

              <span>
                {
                  pessoa.email
                }
              </span>

            </div>

          </div>

        </header>

        <section className="home-welcome-card">

          <div>

            <span className="home-welcome-label">
              ANÁLISE COM IA
            </span>

            <h2>
              Analise seus exercícios
              e evolua com dados
            </h2>

            <p>
              Envie um vídeo do seu
              exercício e receba uma
              análise automática do
              movimento.
            </p>

            <button
              type="button"
              className="home-primary-button"
              onClick={() =>
                navigate(
                  "/analise/nova",
                )
              }
            >

              <Plus
                size={19}
              />

              Nova análise

            </button>

          </div>

          <div className="home-welcome-icon">

            <Activity
              size={90}
            />

          </div>

        </section>

        <section className="home-stats">

          <div className="home-stat-card">

            <div className="home-stat-icon">

              <BarChart3
                size={24}
              />

            </div>

            <div>

              <span>
                Análises realizadas
              </span>

              <strong>

                {
                  carregandoEstatistica
                    ? "-"
                    : estatistica
                      ?.analise
                      ?? 0
                }

              </strong>

            </div>

          </div>

          <div className="home-stat-card">

            <div className="home-stat-icon">

              <Dumbbell
                size={24}
              />

            </div>

            <div>

              <span>
                Exercícios analisados
              </span>

              <strong>

                {
                  carregandoEstatistica
                    ? "-"
                    : estatistica
                      ?.exercicios
                      ?? 0
                }

              </strong>

            </div>

          </div>

          <div className="home-stat-card">

            <div className="home-stat-icon">

              <Activity
                size={24}
              />

            </div>

            <div>

              <span>
                Última análise
              </span>

              <strong>

                {
                  carregandoEstatistica
                    ? "-"
                    : estatistica
                      ?.ultimoProcessamento
                      ?.tipoExercicio
                      ?? "Nenhum"
                }

              </strong>

            </div>

          </div>

        </section>

        <div className="home-grid">

          <section className="home-section-card">

            <div className="home-section-header">

              <div>

                <span className="home-section-label">
                  HISTÓRICO
                </span>

                <h2>
                  Análises recentes
                </h2>

              </div>

              {
                estatistica &&
                estatistica
                  .cincoUltimos
                  .length > 0 && (

                  <button
                    type="button"
                    className="home-section-link"
                    onClick={() =>
                      navigate(
                        "/analises",
                      )
                    }
                  >

                    Ver todas

                  </button>

                )
              }

            </div>

            {
              carregandoEstatistica ? (

                <div className="home-empty-state">

                  <p>
                    Carregando análises...
                  </p>

                </div>

              ) : estatistica &&
                estatistica
                  .cincoUltimos
                  .length > 0 ? (

                <div className="home-history-list">

                  {
                    estatistica
                      .cincoUltimos
                      .map(
                        (
                          processamento,
                        ) => (

                          <div
                            key={
                              processamento
                                .processamentoId
                            }
                            className="home-history-item"
                          >

                            <div className="home-history-icon">

                              <Activity
                                size={22}
                              />

                            </div>

                            <div className="home-history-content">

                              <strong>

                                {
                                  processamento
                                    .tipoExercicio
                                }

                              </strong>

                              <div className="home-history-dates">

                                <span>

                                  Entrada:{" "}

                                  {
                                    formatarData(
                                      processamento
                                        .dataEntrada,
                                    )
                                  }

                                </span>

                                <span>

                                  Análise:{" "}

                                  {
                                    formatarData(
                                      processamento
                                        .dataProcessamento,
                                    )
                                  }

                                </span>

                              </div>

                            </div>

                            <div
                              className={
                                processamento
                                  .publicado
                                  ? "home-history-status analyzed"
                                  : "home-history-status analyzing"
                              }
                            >

                              {
                                processamento
                                  .publicado
                                  ? "Analisado"
                                  : "Em análise"
                              }

                            </div>

                          </div>

                        ),
                      )
                  }

                </div>

              ) : (

                <div className="home-empty-state">

                  <Activity
                    size={42}
                  />

                  <strong>
                    Nenhuma análise realizada
                  </strong>

                  <p>
                    Faça sua primeira análise
                    de exercício para acompanhar
                    seus resultados aqui.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/analise/nova",
                      )
                    }
                  >

                    Fazer primeira análise

                  </button>

                </div>

              )
            }

          </section>

          <section className="home-section-card home-profile-card">

            <div className="home-section-header">

              <div>

                <span className="home-section-label">
                  PERFIL
                </span>

                <h2>
                  Seus dados
                </h2>

              </div>

            </div>

            <div className="home-profile-data">

              <div className="home-profile-row">

                <span>
                  Nome
                </span>

                <strong>
                  {
                    pessoa.nome
                  }
                </strong>

              </div>

              <div className="home-profile-row">

                <span>
                  E-mail
                </span>

                <strong>
                  {
                    pessoa.email
                  }
                </strong>

              </div>

              <div className="home-profile-row">

                <span>
                  Cidade
                </span>

                <strong>

                  {
                    pessoa.cidade
                      ? `${pessoa.cidade} - ${pessoa.uf ?? ""}`
                      : "-"
                  }

                </strong>

              </div>

            </div>

            <button
              type="button"
              className="home-profile-button"
              onClick={() =>
                navigate(
                  "/perfil",
                )
              }
            >

              Editar perfil

            </button>

          </section>

        </div>

        <section className="home-privacy">

          <div>

            <strong>
              Privacidade do seu vídeo
            </strong>

            <p>
              O vídeo é utilizado
              exclusivamente para realizar
              a análise e, após a conclusão
              do processamento, será excluído
              automaticamente, não permanecendo
              armazenado no sistema.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default HomeLogged;