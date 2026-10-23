import cv2


class VideoReader:

    def __init__(self, video_path: str):
        self.video_path = video_path
        self.capture = None

    def abrir(self):

        self.capture = cv2.VideoCapture(
            self.video_path
        )

        if not self.capture.isOpened():
            raise RuntimeError(
                f"Não foi possível abrir o vídeo: "
                f"{self.video_path}"
            )

    def ler_frame(self):

        if self.capture is None:
            raise RuntimeError(
                "O vídeo ainda não foi aberto."
            )

        sucesso, frame = self.capture.read()

        if not sucesso:
            return None

        return frame

    def obter_timestamp_ms(self) -> int:

        if self.capture is None:
            raise RuntimeError(
                "O vídeo ainda não foi aberto."
            )

        return int(
            self.capture.get(
                cv2.CAP_PROP_POS_MSEC
            )
        )

    def liberar(self):

        if self.capture is not None:
            self.capture.release()
            self.capture = None