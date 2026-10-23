import {
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  FileVideo,
  UploadCloud,
  X,
} from "lucide-react";

import {
  enviarAnalise,
} from "../../services/uploadService";

import type {
  Pessoa,
} from "../../types/auth";

import "../../styles/analysis/newAnalysis.css";

export function NewAnalysis() {

  const navigate =
    useNavigate();

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const [
    tipoExercicio,
    setTipoExercicio,
  ] =
    useState("");

  const [
    video,
    setVideo,
  ] =
    useState<File | null>(
      null,
    );

  const [
    erro,
    setErro,
  ] =
    useState("");

  const [
    enviando,
    setEnviando,
  ] =
    useState(false);

  const [
    sucesso,
    setSucesso,
  ] =
    useState(false);

  function selecionarArquivo(
    file: File | undefined,
  ) {

    setErro("");

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "video/",
      )
    ) {
      setErro(
        "Selecione um arquivo de vídeo válido.",
      );

      return;
    }

    setVideo(
      file,
    );
  }

  function handleFileChange(
    event:
      React.ChangeEvent<HTMLInputElement>,
  ) {

    selecionarArquivo(
      event.target.files?.[0],
    );
  }

  function handleDrop(
    event:
      React.DragEvent<HTMLDivElement>,
  ) {

    event.preventDefault();

    selecionarArquivo(
      event.dataTransfer
        .files?.[0],
    );
  }

  function removerVideo() {

    setVideo(
      null,
    );

    if (
      fileInputRef.current
    ) {
      fileInputRef.current.value =
        "";
    }
  }

  function voltar() {

    navigate(
      "/home",
    );
  }

  async function confirmar() {

    setErro("");

    if (
      !tipoExercicio.trim()
    ) {

      setErro(
        "Informe o nome completo do exercício.",
      );

      return;
    }

    if (!video) {

      setErro(
        "Selecione o vídeo do exercício.",
      );

      return;
    }

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

      const pessoa: Pessoa =
        JSON.parse(
          pessoaStorage,
        );

      setEnviando(
        true,
      );

      await enviarAnalise(
        pessoa.id,
        tipoExercicio.trim(),
        video,
      );

      setSucesso(
        true,
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

      setEnviando(
        false,
      );
    }
  }

  if (sucesso) {

    return (
      <div className="analysis-success-page">

        <div className="analysis-success-card">

          <div className="analysis-success-icon">

            <CheckCircle2
              size={54}
            />

          </div>

          <span className="analysis-success-label">
            ENVIO CONCLUÍDO
          </span>

          <h1>
            Análise enviada com sucesso
          </h1>

          <p>
            Seu vídeo foi recebido e será
            processado.
            Favor aguardar o resultado da
            análise.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/home",
              )
            }
          >
            Voltar para a Home
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="new-analysis-page">

      <div className="new-analysis-container">

        <header className="new-analysis-header">

          <button
            type="button"
            className="new-analysis-back"
            onClick={voltar}
          >

            <ArrowLeft
              size={20}
            />

            Voltar

          </button>

          <div>

            <span>
              ANÁLISE DE EXERCÍCIO
            </span>

            <h1>
              Nova análise
            </h1>

            <p>
              Informe o exercício e envie
              um vídeo para análise.
            </p>

          </div>

        </header>

        <main className="new-analysis-card">

          <div className="new-analysis-field">

            <label
              htmlFor="tipoExercicio"
            >
              Nome do exercício
            </label>

            <span className="new-analysis-help">
              Informe o nome completo do
              exercício que está sendo
              realizado.
            </span>

            <input
              id="tipoExercicio"
              type="text"
              value={tipoExercicio}
              onChange={(event) =>
                setTipoExercicio(
                  event.target.value,
                )
              }
              placeholder="Ex.: Flexão de Braço"
              disabled={enviando}
            />

          </div>

          <div className="new-analysis-field">

            <label>
              Vídeo do exercício
            </label>

            <span className="new-analysis-help">
              Selecione ou arraste o vídeo
              para a área abaixo.
            </span>

            {!video ? (

              <div
                className="video-upload-area"
                onDragOver={(
                  event,
                ) =>
                  event.preventDefault()
                }
                onDrop={
                  handleDrop
                }
                onClick={() =>
                  fileInputRef
                    .current
                    ?.click()
                }
              >

                <div className="video-upload-icon">

                  <UploadCloud
                    size={38}
                  />

                </div>

                <strong>
                  Arraste seu vídeo aqui
                </strong>

                <p>
                  ou clique para selecionar
                  um arquivo
                </p>

                <span>
                  MP4, MOV, AVI ou outros
                  formatos de vídeo
                </span>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={
                    handleFileChange
                  }
                  hidden
                />

              </div>

            ) : (

              <div className="video-selected">

                <div className="video-selected-icon">

                  <FileVideo
                    size={30}
                  />

                </div>

                <div className="video-selected-info">

                  <strong>
                    {
                      video.name
                    }
                  </strong>

                  <span>
                    {
                      (
                        video.size /
                        1024 /
                        1024
                      ).toFixed(2)
                    }{" "}
                    MB
                  </span>

                </div>

                <button
                  type="button"
                  onClick={
                    removerVideo
                  }
                  disabled={
                    enviando
                  }
                  title="Remover vídeo"
                >

                  <X
                    size={20}
                  />

                </button>

              </div>
            )}

          </div>

          {erro && (

            <div className="new-analysis-error">
              {erro}
            </div>

          )}

          <div className="new-analysis-actions">

            <button
              type="button"
              className="analysis-secondary-button"
              onClick={voltar}
              disabled={enviando}
            >
              Voltar
            </button>

            <button
              type="button"
              className="analysis-primary-button"
              onClick={
                confirmar
              }
              disabled={
                enviando
              }
            >

              {
                enviando
                  ? "Enviando vídeo..."
                  : "Confirmar"
              }

            </button>

          </div>

        </main>

      </div>

    </div>
  );
}