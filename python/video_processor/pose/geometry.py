import math
from typing import Any

#Essa classe contém somente matemática.
#Ela não sabe nada sobre joelho, braço ou exercício.

def _coordenadas(ponto: Any):
    """
    Aceita objetos MediaPipe com .x/.y/.z
    ou dictionaries contendo x/y/z.
    """

    if isinstance(ponto, dict):
        x = ponto["x"]
        y = ponto["y"]
        z = ponto.get("z", 0.0)
    else:
        x = ponto.x
        y = ponto.y
        z = getattr(ponto, "z", 0.0)

    return float(x), float(y), float(z)


def calcular_distancia_2d(ponto_a: Any, ponto_b: Any) -> float:
    ax, ay, _ = _coordenadas(ponto_a)
    bx, by, _ = _coordenadas(ponto_b)

    return math.sqrt(
        (bx - ax) ** 2 +
        (by - ay) ** 2
    )


def calcular_distancia_3d(ponto_a: Any, ponto_b: Any) -> float:
    ax, ay, az = _coordenadas(ponto_a)
    bx, by, bz = _coordenadas(ponto_b)

    return math.sqrt(
        (bx - ax) ** 2 +
        (by - ay) ** 2 +
        (bz - az) ** 2
    )


def calcular_angulo(ponto_a: Any, ponto_b: Any, ponto_c: Any) -> float:
    """
    Calcula o ângulo ABC.

    ponto_b é o vértice do ângulo.

    Exemplo joelho:

    quadril -> joelho -> tornozelo

    A = quadril
    B = joelho
    C = tornozelo
    """

    ax, ay, _ = _coordenadas(ponto_a)
    bx, by, _ = _coordenadas(ponto_b)
    cx, cy, _ = _coordenadas(ponto_c)

    vetor_ba = (
        ax - bx,
        ay - by,
    )

    vetor_bc = (
        cx - bx,
        cy - by,
    )

    produto_escalar = (
        vetor_ba[0] * vetor_bc[0]
        +
        vetor_ba[1] * vetor_bc[1]
    )

    modulo_ba = math.sqrt(
        vetor_ba[0] ** 2
        +
        vetor_ba[1] ** 2
    )

    modulo_bc = math.sqrt(
        vetor_bc[0] ** 2
        +
        vetor_bc[1] ** 2
    )

    if modulo_ba == 0 or modulo_bc == 0:
        return 0.0

    cos_angulo = produto_escalar / (
        modulo_ba * modulo_bc
    )

    # evita erro numérico do tipo 1.00000001
    cos_angulo = max(
        -1.0,
        min(1.0, cos_angulo)
    )

    angulo_rad = math.acos(cos_angulo)

    return round(
        math.degrees(angulo_rad),
        2
    )


def calcular_inclinacao(ponto_a: Any, ponto_b: Any) -> float:
    """
    Calcula inclinação de um segmento em relação ao eixo horizontal.
    """

    ax, ay, _ = _coordenadas(ponto_a)
    bx, by, _ = _coordenadas(ponto_b)

    delta_x = bx - ax
    delta_y = by - ay

    angulo = math.atan2(
        delta_y,
        delta_x
    )

    return round(
        math.degrees(angulo),
        2
    )