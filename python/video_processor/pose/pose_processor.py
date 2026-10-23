import cv2
import mediapipe as mp

from mediapipe.tasks import python
from mediapipe.tasks.python import vision


class PoseProcessor:

    def __init__(self, model_path: str):

        base_options = python.BaseOptions(
            model_asset_path=model_path
        )

        options = vision.PoseLandmarkerOptions(
            base_options=base_options,
            running_mode=vision.RunningMode.VIDEO,
            num_poses=1,
            min_pose_detection_confidence=0.5,
            min_pose_presence_confidence=0.5,
            min_tracking_confidence=0.5
        )

        self.detector = (
            vision.PoseLandmarker.create_from_options(
                options
            )
        )

    def processar_frame(
        self,
        frame,
        timestamp_ms: int
    ):

        frame_rgb = cv2.cvtColor(
            frame,
            cv2.COLOR_BGR2RGB
        )

        imagem = mp.Image(
            image_format=mp.ImageFormat.SRGB,
            data=frame_rgb
        )

        resultado = self.detector.detect_for_video(
            imagem,
            timestamp_ms
        )

        if not resultado.pose_landmarks:
            return None

        return resultado.pose_landmarks[0]

    def fechar(self):

        self.detector.close()