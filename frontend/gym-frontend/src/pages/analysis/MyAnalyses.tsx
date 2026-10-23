import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Activity,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Lightbulb,
  X,
} from "lucide-react";

import type {
  Pessoa,
} from "../../types/auth";

import type {
  AnaliseResponse,
} from "../../types/analysis";

import {
  buscarAnalisesPorPessoa,
} from "../../services/analysisService";

import "../../styles/analysis/myAnalyses.css";

const ITENS_POR_PAGINA = 10;

export function MyAnalyses() {

  const navigate =
    useNavigate();

  const [
    analises,
    setAnalises,
  ] =
    useState<AnaliseResponse[]>(
      [],
    );

  const [
    carregando,
    setCarregando,
  ] =
    useState(true);

  const [
    erro,
    setErro,
  ] =
    useState("");

  const [
    paginaAtual,
    setPaginaAtual,
  ] =
    useState(1);

  const [
    analiseSelecionada,
    setAnaliseSelecionada,
  ] =
    useState<AnaliseResponse | null>(
      null,
    );

  useEffect(() => {

    carregarAnalises();

  }, []);

  async function carregarAnalises() {

    const pessoaStorage =
      sessionStorage.getItem(
        "pessoa",
      );

    if (!pessoaStorage) {

      sessionStorage.clear();

      navigate(
        "/login",
        {
          replace: true,
        },
      );

      return;
    }

    try {

      setCarregando(
        true,
      );

      setErro("");

      const pessoa: Pessoa =
        JSON.parse(
          pessoaStorage,
        );

      const response =
        await buscarAnalisesPorPessoa(
          pessoa.id,
        );

      setAnalises(
        response,
      );

    } catch (error) {

      if (
        error instanceof Error
      ) {

        if (
          error.message ===
          "UNAUTHORIZED"
        ) {

          sessionStorage.clear();

          navigate(
            "/login",
            {
              replace: true,
            },
          );

          return;
        }

        setErro(
          error.message,
        );

        return;
      }

      setErro(
        "Ocorreu um erro inesperado.",
      );

    } finally {

      setCarregando(
        false,
      );
    }
  }

  const totalPaginas =
    Math.ceil(
      analises.length /
        ITENS_POR_PAGINA,
    );

  const analisesPagina =
    useMemo(() => {

      const inicio =
        (paginaAtual - 1) *
        ITENS_POR_PAGINA;

      const fim =
        inicio +
        ITENS_POR_PAGINA;

      return analises.slice(
        inicio,
        fim,
      );

    }, [
      analises,
      paginaAtual,
    ]);

  function formatarData(
    data?: string | null,
  ): string {

    if (!data) {
      return "-";
    }

    const date =
      new Date(data);

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return "-";
    }

    return date.toLocaleString(
      "pt-BR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  }

  function statusLabel(
    status?: string,
  ): string {

    if (!status) {
      return "-";
    }

    switch (
      status.toLowerCase()
    ) {

      case "atencao":
        return "Atenção";

      case "sucesso":
        return "Sucesso";

      case "erro":
        return "Erro";

      default:
        return status;
    }
  }

  function voltar() {

    navigate(
      "/home",
    );
  }

  return (

    <div className="my-analyses-page">

      <div className="my-analyses-container">

        <header className="my-analyses-header">

          <button
            type="button"
            className="my-analyses-back"
            onClick={voltar}
          >

            <ArrowLeft
              size={20}
            />

            Voltar

          </button>

          <div>

            <span className="my-analyses-label">
              HISTÓRICO
            </span>

            <h1>
              Minhas análises
            </h1>

            <p>
              Consulte os exercícios
              analisados e veja todos
              os detalhes de cada
              resultado.
            </p>

          </div>

        </header>

        <section className="my-analyses-card">

          {carregando ? (

            <div className="my-analyses-empty">

              <Activity
                size={42}
              />

              <strong>
                Carregando análises...
              </strong>

            </div>

          ) : erro ? (

            <div className="my-analyses-error">
              {erro}
            </div>

          ) : analises.length === 0 ? (

            <div className="my-analyses-empty">

              <Activity
                size={44}
              />

              <strong>
                Nenhuma análise encontrada
              </strong>

              <p>
                Você ainda não possui
                análises concluídas.
              </p>

            </div>

          ) : (

            <>

              <div className="my-analyses-table-wrapper">

                <table className="my-analyses-table">

                  <thead>

                    <tr>

                      <th>
                        Processamento
                      </th>

                      <th>
                        Exercício
                      </th>

                      <th>
                        Data do processamento
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {analisesPagina.map(
                      (
                        analise,
                      ) => (

                        <tr
                          key={
                            analise.id
                          }
                          onClick={() =>
                            setAnaliseSelecionada(
                              analise,
                            )
                          }
                        >

                          <td>

                            <strong>
                              #
                              {
                                analise
                                  .processamentoId
                              }
                            </strong>

                          </td>

                          <td>

                            {
                              analise
                                .resultado
                                .processamento
                                .exercicio
                            }

                          </td>

                          <td>

                            {
                              formatarData(
                                analise
                                  .resultado
                                  .dataProcessamento,
                              )
                            }

                          </td>

                        </tr>

                      ),
                    )}

                  </tbody>

                </table>

              </div>

              {totalPaginas > 1 && (

                <div className="my-analyses-pagination">

                  <button
                    type="button"
                    disabled={
                      paginaAtual === 1
                    }
                    onClick={() =>
                      setPaginaAtual(
                        (
                          pagina,
                        ) =>
                          pagina - 1,
                      )
                    }
                  >

                    <ChevronLeft
                      size={18}
                    />

                  </button>

                  <span>

                    Página{" "}

                    <strong>
                      {paginaAtual}
                    </strong>

                    {" "}de{" "}

                    <strong>
                      {totalPaginas}
                    </strong>

                  </span>

                  <button
                    type="button"
                    disabled={
                      paginaAtual ===
                      totalPaginas
                    }
                    onClick={() =>
                      setPaginaAtual(
                        (
                          pagina,
                        ) =>
                          pagina + 1,
                      )
                    }
                  >

                    <ChevronRight
                      size={18}
                    />

                  </button>

                </div>

              )}

            </>

          )}

        </section>

      </div>

      {analiseSelecionada && (

        <div
          className="analysis-dialog-overlay"
          onClick={() =>
            setAnaliseSelecionada(
              null,
            )
          }
        >

          <div
            className="analysis-dialog"
            onClick={(
              event,
            ) =>
              event.stopPropagation()
            }
          >

            <div className="analysis-dialog-header">

              <div>

                <span>
                  RESULTADO DA ANÁLISE
                </span>

                <h2>

                  {
                    analiseSelecionada
                      .resultado
                      .processamento
                      .exercicio
                  }

                </h2>

              </div>

              <button
                type="button"
                className="analysis-dialog-close"
                onClick={() =>
                  setAnaliseSelecionada(
                    null,
                  )
                }
                title="Fechar"
              >

                <X
                  size={21}
                />

              </button>

            </div>

            <div className="analysis-dialog-body">

              <div className="analysis-dialog-info">

                <div>

                  <span>
                    Processamento
                  </span>

                  <strong>

                    #
                    {
                      analiseSelecionada
                        .processamentoId
                    }

                  </strong>

                </div>

                <div>

                  <span>
                    Data do processamento
                  </span>

                  <strong>

                    {
                      formatarData(
                        analiseSelecionada
                          .resultado
                          .dataProcessamento,
                      )
                    }

                  </strong>

                </div>

              </div>

              <div className="analysis-dialog-status">

                <span>
                  Status
                </span>

                <strong
                  className={
                    `analysis-status ${
                      analiseSelecionada
                        .resultado
                        .analise
                        .status
                        .toLowerCase()
                    }`
                  }
                >

                  {
                    statusLabel(
                      analiseSelecionada
                        .resultado
                        .analise
                        .status,
                    )
                  }

                </strong>

              </div>

              <section className="analysis-dialog-section">

                <h3>
                  Resumo
                </h3>

                <p>

                  {
                    analiseSelecionada
                      .resultado
                      .analise
                      .resumo
                  }

                </p>

              </section>

              <section className="analysis-dialog-section">

                <div
                  className="
                    analysis-dialog-section-title
                    positive
                  "
                >

                  <CircleCheck
                    size={20}
                  />

                  <h3>
                    Pontos positivos
                  </h3>

                </div>

                {
                  analiseSelecionada
                    .resultado
                    .analise
                    .pontosPositivos
                    ?.length > 0
                    ? (

                      <ul>

                        {
                          analiseSelecionada
                            .resultado
                            .analise
                            .pontosPositivos
                            .map(
                              (
                                item,
                                index,
                              ) => (

                                <li
                                  key={
                                    `${index}-${item}`
                                  }
                                >
                                  {item}
                                </li>

                              ),
                            )
                        }

                      </ul>

                    )
                    : (

                      <p>
                        Nenhum ponto
                        positivo informado.
                      </p>

                    )
                }

              </section>

              <section className="analysis-dialog-section">

                <div
                  className="
                    analysis-dialog-section-title
                    attention
                  "
                >

                  <CircleAlert
                    size={20}
                  />

                  <h3>
                    Pontos de atenção
                  </h3>

                </div>

                {
                  analiseSelecionada
                    .resultado
                    .analise
                    .pontosAtencao
                    ?.length > 0
                    ? (

                      <ul>

                        {
                          analiseSelecionada
                            .resultado
                            .analise
                            .pontosAtencao
                            .map(
                              (
                                item,
                                index,
                              ) => (

                                <li
                                  key={
                                    `${index}-${item}`
                                  }
                                >
                                  {item}
                                </li>

                              ),
                            )
                        }

                      </ul>

                    )
                    : (

                      <p>
                        Nenhum ponto
                        de atenção informado.
                      </p>

                    )
                }

              </section>

              <section className="analysis-dialog-section">

                <div
                  className="
                    analysis-dialog-section-title
                    recommendation
                  "
                >

                  <Lightbulb
                    size={20}
                  />

                  <h3>
                    Recomendações
                  </h3>

                </div>

                {
                  analiseSelecionada
                    .resultado
                    .analise
                    .recomendacoes
                    ?.length > 0
                    ? (

                      <ul>

                        {
                          analiseSelecionada
                            .resultado
                            .analise
                            .recomendacoes
                            .map(
                              (
                                item,
                                index,
                              ) => (

                                <li
                                  key={
                                    `${index}-${item}`
                                  }
                                >
                                  {item}
                                </li>

                              ),
                            )
                        }

                      </ul>

                    )
                    : (

                      <p>
                        Nenhuma recomendação
                        informada.
                      </p>

                    )
                }

              </section>

            </div>

            <div className="analysis-dialog-footer">

              <button
                type="button"
                onClick={() =>
                  setAnaliseSelecionada(
                    null,
                  )
                }
              >
                Fechar
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}