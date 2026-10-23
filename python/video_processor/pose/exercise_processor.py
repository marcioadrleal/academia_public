import json

from fastmcp import Client

from downloader.video_downloader import VideoDownloader
from downloader.video_reader import VideoReader

from .pose_processor import PoseProcessor
from .movement_summary import MovementSummary
from .analyzer import PoseAnalyzer
from .repetition_detector import RepetitionDetector


class ExerciseProcessor:

    def __init__(
        self,
        mcp_url: str,
        model_path: str,
        mcp_uri: str
    ):

        self.mcp_url = mcp_url
        self.model_path = model_path
        self.mcp_uri = mcp_uri

    # =====================================================
    # MÉTODO PRINCIPAL
    # =====================================================

    async def processar(
        self,
        pessoa_id: int
    ) -> dict:

        processamento = (
            await self._obter_video_pendente(
                pessoa_id
            )
        )

        if not processamento.get(
            "sucesso",
            False
        ):

            return {
                "sucesso": False,
                "pessoa_id": pessoa_id,
                "erro": processamento.get(
                    "erro",
                    "Nenhum vídeo disponível."
                )
            }

        return await self._processar_video(
            processamento
        )

    # =====================================================
    # CONSULTA AO MCP
    # =====================================================

    async def _obter_video_pendente(
        self,
        pessoa_id: int
    ) -> dict:

        try:

            async with Client(
                self.mcp_url
            ) as client:

                resultado = (
                    await client.call_tool(
                        "obter_stream_video_pendente",
                        {
                            "pessoa_id":
                                pessoa_id
                        }
                    )
                )

            # FastMCP atual retorna os
            # dados diretamente em .data

            if (
                hasattr(resultado, "data")
                and isinstance(
                    resultado.data,
                    dict
                )
            ):

                return resultado.data

            # fallback para structured_content

            if (
                hasattr(
                    resultado,
                    "structured_content"
                )
                and isinstance(
                    resultado.structured_content,
                    dict
                )
            ):

                return (
                    resultado
                    .structured_content
                )

            # fallback para content textual

            if hasattr(
                resultado,
                "content"
            ):

                for conteudo in (
                    resultado.content
                ):

                    texto = getattr(
                        conteudo,
                        "text",
                        None
                    )

                    if texto:

                        try:

                            dados = json.loads(
                                texto
                            )

                            if isinstance(
                                dados,
                                dict
                            ):

                                return dados

                        except json.JSONDecodeError:

                            continue

            return {
                "sucesso": False,
                "erro":
                    "Formato de retorno MCP "
                    "não reconhecido."
            }

        except Exception as erro:

            return {
                "sucesso": False,
                "erro":
                    f"Erro ao consultar MCP. "
                    f"no link {self.mcp_url}",
                "detalhe":
                    str(erro)
            }

    # =====================================================
    # PROCESSAMENTO DO VÍDEO
    # =====================================================

    async def _processar_video(
        self,
        processamento: dict
    ) -> dict:

        pessoa_id = processamento.get(
            "pessoa_id"
        )

        processamento_id = (
            processamento.get(
                "processamento_id"
            )
        )

        arquivo_id = processamento.get(
            "arquivo_id"
        )

        nome_arquivo = processamento.get(
            "nome_arquivo"
        )

        tipo_exercicio = (
            processamento.get(
                "tipo_exercicio"
            )
        )

        stream_url = processamento.get(
            "stream_url"
        )

        if not stream_url:

            return {
                "sucesso": False,
                "pessoa_id": pessoa_id,
                "erro":
                    "MCP não retornou "
                    "stream_url."
            }

        downloader = VideoDownloader(
            f"{self.mcp_uri}{stream_url}"
        )

        video_reader = None
        pose_processor = None

        try:

            # =============================================
            # DOWNLOAD
            # =============================================

            video_path = (
                downloader.baixar()
            )

            # =============================================
            # OBJETOS DE PROCESSAMENTO
            # =============================================

            video_reader = VideoReader(
                video_path
            )

            video_reader.abrir()

            pose_processor = (
                PoseProcessor(
                    str(
                        self.model_path
                    )
                )
            )

            pose_analyzer = (
                PoseAnalyzer()
            )

            movement_summary = (
                MovementSummary()
            )

            # =============================================
            # NOVO - DETECTOR DE REPETIÇÕES
            # =============================================

            repetition_detector = (
                RepetitionDetector(
                    janela_suavizacao=5,
                    amplitude_minima=20.0
                )
            )

            resultados = []

            numero_frame = 0

            # =============================================
            # PROCESSAMENTO FRAME A FRAME
            # =============================================

            while True:

                frame = (
                    video_reader
                    .ler_frame()
                )

                if frame is None:
                    break

                numero_frame += 1

                # Timestamp do frame dentro do vídeo

                timestamp_ms = (
                    video_reader
                    .obter_timestamp_ms()
                )

                # =========================================
                # MEDIAPIPE
                # =========================================
                #
                # Extrai os landmarks do corpo.
                # =========================================

                landmarks = (
                    pose_processor
                    .processar_frame(
                        frame,
                        timestamp_ms
                    )
                )

                if landmarks is None:
                    continue

                # =========================================
                # ANÁLISE DO FRAME
                # =========================================
                #
                # Calcula:
                #
                # - ângulos
                # - distâncias
                # - inclinações
                # - visibilidade
                #
                # Também armazenamos:
                #
                # - número do frame
                # - timestamp
                # =========================================

                resultado_frame = (
                    pose_analyzer
                    .analisar_frame(
                        landmarks,
                        numero_frame,
                        timestamp_ms
                    )
                )

                resultados.append(
                    resultado_frame
                )

            # =============================================
            # RESUMO ATUAL
            # =============================================
            #
            # Mantemos o processamento existente.
            #
            # Isso continua gerando:
            #
            # - ângulo mínimo
            # - ângulo máximo
            # - ângulo médio
            # - amplitude
            # - visibilidade média
            #
            # Não removemos nada ainda.
            # =============================================

            resumo = (
                movement_summary.gerar(
                    resultados
                )
            )

            # =============================================
            # NOVO - DETECÇÃO DE REPETIÇÕES
            # =============================================
            #
            # A análise é executada SOBRE OS MESMOS
            # frames utilizados pelo MovementSummary.
            #
            # Dessa forma, o processamento antigo e o
            # novo ficam funcionando em paralelo.
            # =============================================

            analise_repeticoes = {

                "joelho_esquerdo":
                    repetition_detector.detectar(
                        resultados,
                        "joelho_esquerdo"
                    ),

                "joelho_direito":
                    repetition_detector.detectar(
                        resultados,
                        "joelho_direito"
                    ),

                "cotovelo_esquerdo":
                    repetition_detector.detectar(
                        resultados,
                        "cotovelo_esquerdo"
                    ),

                "cotovelo_direito":
                    repetition_detector.detectar(
                        resultados,
                        "cotovelo_direito"
                    )
            }

            # =============================================
            # RETORNO PARA O LANGGRAPH
            # =============================================

            return {

                "sucesso":
                    True,

                "pessoa_id":
                    pessoa_id,

                "processamento_id":
                    processamento_id,

                "arquivo_id":
                    arquivo_id,

                "nome_arquivo":
                    nome_arquivo,

                "exercicio":
                    tipo_exercicio,

                "total_frames":
                    numero_frame,

                "frames_com_pose":
                    len(resultados),

                # =========================================
                # RESULTADO ANTIGO
                # =========================================

                "resumo":
                    resumo,

                # =========================================
                # NOVO RESULTADO
                # =========================================

                "analise_repeticoes":
                    analise_repeticoes
            }

        except Exception as erro:

            return {
                "sucesso": False,

                "pessoa_id":
                    pessoa_id,

                "processamento_id":
                    processamento_id,

                "arquivo_id":
                    arquivo_id,

                "exercicio":
                    tipo_exercicio,

                "erro":
                    "Erro durante o "
                    "processamento do vídeo.",

                "detalhe":
                    str(erro)
            }

        finally:

            if video_reader:

                video_reader.liberar()

            if pose_processor:

                pose_processor.fechar()

            downloader.remover()