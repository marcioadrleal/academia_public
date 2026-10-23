import json
import os

from enum import Enum


class LLMProvider(str, Enum):
    OPENAI = "OPENAI"
    ANTHROPIC = "ANTHROPIC"
    GOOGLE = "GOOGLE"

class LLMProviderFactory:

    @staticmethod
    def create(provider: LLMProvider):
        if provider == LLMProvider.OPENAI:
            from langchain_openai import ChatOpenAI
            from config.settings import settings

            openai_api_key = settings.openai_api_key or os.getenv("OPENAI_API_KEY")
            model_name = settings.openai_model or os.getenv("OPENAI_MODEL", "gpt-4o-mini")

            return ChatOpenAI(
                model=model_name,
                temperature=0,
                api_key=openai_api_key
            )
        elif provider == LLMProvider.ANTHROPIC:
            # Implement the creation of an Anthropic LLM instance here
            pass
        elif provider == LLMProvider.GOOGLE:
            # Implement the creation of a Google LLM instance here
            pass
        else:
            raise ValueError(f"Unsupported LLM provider: {provider}")
