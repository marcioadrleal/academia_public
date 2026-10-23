from pose.landmarks import PoseLandmark


SEGMENTOS = {

    "braco_esquerdo": (
        PoseLandmark.LEFT_SHOULDER,
        PoseLandmark.LEFT_ELBOW,
    ),

    "braco_direito": (
        PoseLandmark.RIGHT_SHOULDER,
        PoseLandmark.RIGHT_ELBOW,
    ),

    "antebraco_esquerdo": (
        PoseLandmark.LEFT_ELBOW,
        PoseLandmark.LEFT_WRIST,
    ),

    "antebraco_direito": (
        PoseLandmark.RIGHT_ELBOW,
        PoseLandmark.RIGHT_WRIST,
    ),

    "coxa_esquerda": (
        PoseLandmark.LEFT_HIP,
        PoseLandmark.LEFT_KNEE,
    ),

    "coxa_direita": (
        PoseLandmark.RIGHT_HIP,
        PoseLandmark.RIGHT_KNEE,
    ),

    "perna_esquerda": (
        PoseLandmark.LEFT_KNEE,
        PoseLandmark.LEFT_ANKLE,
    ),

    "perna_direita": (
        PoseLandmark.RIGHT_KNEE,
        PoseLandmark.RIGHT_ANKLE,
    ),

    "tronco_esquerdo": (
        PoseLandmark.LEFT_SHOULDER,
        PoseLandmark.LEFT_HIP,
    ),

    "tronco_direito": (
        PoseLandmark.RIGHT_SHOULDER,
        PoseLandmark.RIGHT_HIP,
    ),

    "pe_esquerdo": (
        PoseLandmark.LEFT_HEEL,
        PoseLandmark.LEFT_FOOT_INDEX,
    ),

    "pe_direito": (
        PoseLandmark.RIGHT_HEEL,
        PoseLandmark.RIGHT_FOOT_INDEX,
    ),
}