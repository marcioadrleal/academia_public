class RepetitionDetector:

    def __init__(
        self,
        janela_suavizacao: int = 5,
        amplitude_minima: float = 20.0
    ):
        self.janela_suavizacao = janela_suavizacao
        self.amplitude_minima = amplitude_minima

    def detectar(
        self,
        frames: list[dict],
        nome_articulacao: str
    ) -> dict:

        pontos = self._extrair_pontos(
            frames,
            nome_articulacao
        )

        if len(pontos) < 3:
            return {
                "articulacao": nome_articulacao,
                "total_repeticoes": 0,
                "repeticoes": []
            }

        pontos_suavizados = (
            self._suavizar(pontos)
        )

        repeticoes = (
            self._detectar_repeticoes(
                pontos_suavizados
            )
        )

        return {
            "articulacao": nome_articulacao,
            "total_repeticoes": len(repeticoes),
            "repeticoes": repeticoes
        }

    # =====================================================
    # EXTRAÇÃO DOS ÂNGULOS
    # =====================================================

    def _extrair_pontos(
        self,
        frames: list[dict],
        nome_articulacao: str
    ) -> list[dict]:

        pontos = []

        for frame in frames:

            if not frame.get(
                "valido",
                False
            ):
                continue

            articulacoes = frame.get(
                "articulacoes",
                {}
            )

            dados = articulacoes.get(
                nome_articulacao
            )

            if not dados:
                continue

            if not dados.get(
                "valido",
                False
            ):
                continue

            angulo = dados.get(
                "angulo"
            )

            if angulo is None:
                continue

            pontos.append({
                "frame": frame.get(
                    "frame"
                ),
                "timestamp_ms": frame.get(
                    "timestamp_ms"
                ),
                "angulo": float(
                    angulo
                )
            })

        return pontos

    # =====================================================
    # SUAVIZAÇÃO
    # =====================================================

    def _suavizar(
        self,
        pontos: list[dict]
    ) -> list[dict]:

        if (
            self.janela_suavizacao <= 1
            or len(pontos) <
            self.janela_suavizacao
        ):
            return pontos

        resultado = []

        metade = (
            self.janela_suavizacao // 2
        )

        for indice, ponto in enumerate(
            pontos
        ):

            inicio = max(
                0,
                indice - metade
            )

            fim = min(
                len(pontos),
                indice + metade + 1
            )

            janela = pontos[
                inicio:fim
            ]

            angulos = [
                item["angulo"]
                for item in janela
            ]

            angulo_suavizado = (
                sum(angulos)
                / len(angulos)
            )

            resultado.append({
                **ponto,
                "angulo_original":
                    ponto["angulo"],
                "angulo":
                    round(
                        angulo_suavizado,
                        2
                    )
            })

        return resultado

    # =====================================================
    # DETECÇÃO DAS REPETIÇÕES
    # =====================================================

    def _detectar_repeticoes(
        self,
        pontos: list[dict]
    ) -> list[dict]:

        repeticoes = []

        if len(pontos) < 3:
            return repeticoes

        inicio = pontos[0]
        extremo = pontos[0]

        direcao = None

        numero_repeticao = 0

        for indice in range(
            1,
            len(pontos)
        ):

            anterior = pontos[
                indice - 1
            ]

            atual = pontos[
                indice
            ]

            diferenca = (
                atual["angulo"]
                - anterior["angulo"]
            )

            # Ignora pequenas oscilações
            # produzidas pelo MediaPipe.
            if abs(diferenca) < 0.5:
                continue

            nova_direcao = (
                "subindo"
                if diferenca > 0
                else "descendo"
            )

            if direcao is None:

                direcao = nova_direcao
                inicio = anterior
                extremo = atual

                continue

            # Enquanto continua descendo,
            # procura o menor ângulo.
            if direcao == "descendo":

                if (
                    atual["angulo"]
                    < extremo["angulo"]
                ):
                    extremo = atual

                # Mudou de descida para subida.
                if nova_direcao == "subindo":

                    amplitude = (
                        inicio["angulo"]
                        - extremo["angulo"]
                    )

                    if (
                        amplitude
                        >= self.amplitude_minima
                    ):

                        numero_repeticao += 1

                        repeticoes.append({
                            "numero":
                                numero_repeticao,

                            "frame_inicio":
                                inicio["frame"],

                            "frame_extremo":
                                extremo["frame"],

                            "timestamp_inicio_ms":
                                inicio["timestamp_ms"],

                            "timestamp_extremo_ms":
                                extremo["timestamp_ms"],

                            "angulo_inicial":
                                round(
                                    inicio["angulo"],
                                    2
                                ),

                            "angulo_extremo":
                                round(
                                    extremo["angulo"],
                                    2
                                ),

                            "amplitude_descida":
                                round(
                                    amplitude,
                                    2
                                ),

                            "valido":
                                True
                        })

                    direcao = "subindo"

            elif direcao == "subindo":

                # Voltou a descer:
                # possível início de uma nova repetição.
                if nova_direcao == "descendo":

                    inicio = anterior
                    extremo = atual
                    direcao = "descendo"

        return repeticoes