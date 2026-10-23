class MovementSummary:

    def gerar(self, frames: list[dict]) -> dict:

        return {
            "joelho_esquerdo": self._resumir_articulacao(
                frames,
                "joelho_esquerdo"
            ),

            "joelho_direito": self._resumir_articulacao(
                frames,
                "joelho_direito"
            ),

            "cotovelo_esquerdo": self._resumir_articulacao(
                frames,
                "cotovelo_esquerdo"
            ),

            "cotovelo_direito": self._resumir_articulacao(
                frames,
                "cotovelo_direito"
            ),

            "quadril_esquerdo": self._resumir_articulacao(
                frames,
                "quadril_esquerdo"
            ),

            "quadril_direito": self._resumir_articulacao(
                frames,
                "quadril_direito"
            )
        }

    def _resumir_articulacao(
        self,
        frames: list[dict],
        nome_articulacao: str
    ) -> dict:

        angulos = []
        visibilidades = []

        for frame in frames:

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

            visibilidade = dados.get(
                "visibilidade"
            )

            if angulo is not None:
                angulos.append(angulo)

            if visibilidade is not None:
                visibilidades.append(
                    visibilidade
                )

        if not angulos:
            return {
                "valido": False,
                "frames_validos": 0
            }

        return {
            "valido": True,

            "frames_validos":
                len(angulos),

            "angulo_minimo":
                round(
                    min(angulos),
                    2
                ),

            "angulo_maximo":
                round(
                    max(angulos),
                    2
                ),

            "angulo_medio":
                round(
                    sum(angulos)
                    / len(angulos),
                    2
                ),

            "amplitude":
                round(
                    max(angulos)
                    - min(angulos),
                    2
                ),

            "visibilidade_media":
                round(
                    sum(visibilidades)
                    / len(visibilidades),
                    3
                )
                if visibilidades
                else None
        }