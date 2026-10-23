from pose.landmarks import PoseLandmark


# Aqui definimos quais três pontos formam cada articulação.
# O segundo ponto sempre será o vértice do ângulo.

ARTICULACOES = {

    "joelho_esquerdo": (
        PoseLandmark.LEFT_HIP,
        PoseLandmark.LEFT_KNEE,
        PoseLandmark.LEFT_ANKLE,
    ),

    "joelho_direito": (
        PoseLandmark.RIGHT_HIP,
        PoseLandmark.RIGHT_KNEE,
        PoseLandmark.RIGHT_ANKLE,
    ),

    "cotovelo_esquerdo": (
        PoseLandmark.LEFT_SHOULDER,
        PoseLandmark.LEFT_ELBOW,
        PoseLandmark.LEFT_WRIST,
    ),

    "cotovelo_direito": (
        PoseLandmark.RIGHT_SHOULDER,
        PoseLandmark.RIGHT_ELBOW,
        PoseLandmark.RIGHT_WRIST,
    ),

    "quadril_esquerdo": (
        PoseLandmark.LEFT_SHOULDER,
        PoseLandmark.LEFT_HIP,
        PoseLandmark.LEFT_KNEE,
    ),

    "quadril_direito": (
        PoseLandmark.RIGHT_SHOULDER,
        PoseLandmark.RIGHT_HIP,
        PoseLandmark.RIGHT_KNEE,
    ),

    "ombro_esquerdo": (
        PoseLandmark.LEFT_ELBOW,
        PoseLandmark.LEFT_SHOULDER,
        PoseLandmark.LEFT_HIP,
    ),

    "ombro_direito": (
        PoseLandmark.RIGHT_ELBOW,
        PoseLandmark.RIGHT_SHOULDER,
        PoseLandmark.RIGHT_HIP,
    ),
}