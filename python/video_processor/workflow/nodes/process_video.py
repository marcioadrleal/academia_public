from pathlib import Path

from pose.exercise_processor import ExerciseProcessor
from workflow.state import ExerciseState
from config.settings import settings
import os




MCP_URI = settings.mcp_uri or os.getenv("MCP_URI")
MCP_URL = settings.mcp_url or os.getenv("MCP_URL", f"{MCP_URI}/mcp")


processor = ExerciseProcessor(
    mcp_url=MCP_URL,
    model_path=str(settings.model_path),
    mcp_uri=MCP_URI
)


async def processar_video(
    state: ExerciseState
) -> ExerciseState:

    pessoa_id = state["pessoa_id"]

    resultado = await processor.processar(
        pessoa_id=pessoa_id
    )

    return {
        "resultado_pose": resultado
    }