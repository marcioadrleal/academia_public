from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime, timezone

import os

os.environ["GLOG_minloglevel"] = "3"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

from workflow.graph import exercise_graph


app = FastAPI(
    title="Gym AI Processor",
    version="1.0.0"
)


class ExerciseRequest(BaseModel):
    pessoa_id: int


@app.post(
    "/api/exercicios/processar"
)
async def processar_exercicio(
    request: ExerciseRequest
):

    resultado = await exercise_graph.ainvoke(
        {
            "pessoa_id": request.pessoa_id
        }
    )

    return {
        "pessoa_id": request.pessoa_id,
        "data_processamento": datetime.now(timezone.utc).isoformat(),
        "processamento": resultado.get(
            "resultado_pose"
        ),
        "analise": resultado.get(
            "analise_llm"
        )
    }