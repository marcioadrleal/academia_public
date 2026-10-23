from typing import TypedDict, Any


class ExerciseState(TypedDict, total=False):
    pessoa_id: int
    resultado_pose: dict[str, Any]
    analise_llm: dict[str, Any]