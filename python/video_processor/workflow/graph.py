from langgraph.graph import (
    StateGraph,
    START,
    END
)

from workflow.state import ExerciseState

from workflow.nodes.process_video import (
    processar_video
)

from workflow.nodes.analyze_llm import (
    analisar_exercicio
)


builder = StateGraph(
    ExerciseState
)

builder.add_node(
    "processar_video",
    processar_video
)

builder.add_node(
    "analisar_exercicio",
    analisar_exercicio
)

builder.add_edge(
    START,
    "processar_video"
)

builder.add_edge(
    "processar_video",
    "analisar_exercicio"
)

builder.add_edge(
    "analisar_exercicio",
    END
)


exercise_graph = builder.compile()