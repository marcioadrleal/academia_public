import os
from pathlib import Path

from dotenv import load_dotenv


class Settings:

    def __init__(self):

        self.base_dir = (
            Path(__file__)
            .resolve()
            .parent
            .parent
        )

        self._load_local_env()

        self.environment = os.getenv(
            "ENVIRONMENT",
            "local"
        )

        self.mcp_uri = self._required(
            "MCP_URI"
        )

        self.mcp_url = (
            f"{self.mcp_uri}/mcp"
        )

        self.openai_api_key = self._required(
            "OPENAI_API_KEY"
        )

        self.openai_model = os.getenv(
            "OPENAI_MODEL",
            "gpt-4o-mini"
        )

        self.http_timeout = int(
            os.getenv(
                "HTTP_TIMEOUT",
                "300"
            )
        )

        self.model_path = (
            self.base_dir
            / "models"
            / "pose_landmarker_full.task"
        )

    def _load_local_env(self):

        if os.getenv("ENVIRONMENT") is None:

            env_file = (
                self.base_dir
                / ".env.local"
            )

            load_dotenv(env_file)

    @staticmethod
    def _required(name: str):

        value = os.getenv(name)

        if not value:
            raise RuntimeError(
                f"Variável {name} não configurada."
            )

        return value


settings = Settings()