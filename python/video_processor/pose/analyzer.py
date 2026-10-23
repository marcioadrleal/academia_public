# Essa é a classe mais importante.
# Ela transforma os 33 landmarks em dados semânticos.

from typing import Any

from pose.joints import ARTICULACOES
from pose.segments import SEGMENTOS
from pose.geometry import (
    calcular_angulo,
    calcular_distancia_2d,
    calcular_distancia_3d,
    calcular_inclinacao,
)


class PoseAnalyzer:

    def __init__(
        self,
        visibility_threshold: float = 0.5
    ):
        self.visibility_threshold = visibility_threshold

    def analisar_frame(
        self,
        landmarks: list[Any],
        frame_numero: int | None = None,
        timestamp_ms: int | None = None
    ) -> dict:

        if not landmarks:
            return {
                "frame": frame_numero,
                "timestamp_ms": timestamp_ms,
                "valido": False,
                "motivo": "Nenhum landmark encontrado"
            }

        if len(landmarks) < 33:
            return {
                "frame": frame_numero,
                "timestamp_ms": timestamp_ms,
                "valido": False,
                "motivo": (
                    f"Quantidade inválida de landmarks: "
                    f"{len(landmarks)}"
                )
            }

        return {
            "frame": frame_numero,
            "timestamp_ms": timestamp_ms,
            "valido": True,
            "articulacoes": self._analisar_articulacoes(
                landmarks
            ),
            "segmentos": self._analisar_segmentos(
                landmarks
            ),
        }

    def _analisar_articulacoes(
        self,
        landmarks: list[Any]
    ) -> dict:

        resultado = {}

        for nome, indices in ARTICULACOES.items():

            indice_a, indice_b, indice_c = indices

            ponto_a = landmarks[int(indice_a)]
            ponto_b = landmarks[int(indice_b)]
            ponto_c = landmarks[int(indice_c)]

            visibilidade = self._visibilidade_media(
                ponto_a,
                ponto_b,
                ponto_c
            )

            if visibilidade < self.visibility_threshold:
                resultado[nome] = {
                    "valido": False,
                    "visibilidade": round(
                        visibilidade,
                        3
                    )
                }

                continue

            angulo = calcular_angulo(
                ponto_a,
                ponto_b,
                ponto_c
            )

            resultado[nome] = {
                "valido": True,
                "angulo": angulo,
                "visibilidade": round(
                    visibilidade,
                    3
                )
            }

        return resultado

    def _analisar_segmentos(
        self,
        landmarks: list[Any]
    ) -> dict:

        resultado = {}

        for nome, indices in SEGMENTOS.items():

            indice_a, indice_b = indices

            ponto_a = landmarks[int(indice_a)]
            ponto_b = landmarks[int(indice_b)]

            visibilidade = self._visibilidade_media(
                ponto_a,
                ponto_b
            )

            if visibilidade < self.visibility_threshold:
                resultado[nome] = {
                    "valido": False,
                    "visibilidade": round(
                        visibilidade,
                        3
                    )
                }

                continue

            resultado[nome] = {
                "valido": True,

                "distancia_2d": round(
                    calcular_distancia_2d(
                        ponto_a,
                        ponto_b
                    ),
                    4
                ),

                "distancia_3d": round(
                    calcular_distancia_3d(
                        ponto_a,
                        ponto_b
                    ),
                    4
                ),

                "inclinacao": calcular_inclinacao(
                    ponto_a,
                    ponto_b
                ),

                "visibilidade": round(
                    visibilidade,
                    3
                )
            }

        return resultado

    def _visibilidade_media(
        self,
        *pontos: Any
    ) -> float:

        valores = []

        for ponto in pontos:

            visibility = getattr(
                ponto,
                "visibility",
                1.0
            )

            valores.append(
                float(visibility)
            )

        if not valores:
            return 0.0

        return sum(valores) / len(valores)