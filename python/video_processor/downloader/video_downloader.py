import os
import tempfile
import httpx


class VideoDownloader:

    def __init__(self, url: str):
        self.url = url
        self.caminho_temporario = None

    def baixar(self) -> str:

        fd, caminho = tempfile.mkstemp(
            suffix=".mp4"
        )

        os.close(fd)

        try:
            with httpx.stream(
                "GET",
                self.url,
                timeout=300.0
            ) as response:

                response.raise_for_status()

                with open(caminho, "wb") as arquivo:

                    for chunk in response.iter_bytes(
                        chunk_size=1024 * 1024
                    ):
                        if chunk:
                            arquivo.write(chunk)

            self.caminho_temporario = caminho

            return caminho

        except Exception:

            if os.path.exists(caminho):
                os.remove(caminho)

            raise

    def remover(self):

        if (
            self.caminho_temporario
            and os.path.exists(
                self.caminho_temporario
            )
        ):
            os.remove(
                self.caminho_temporario
            )

            self.caminho_temporario = None