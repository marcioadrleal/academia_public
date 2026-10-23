import json

from llmAcess.choiceLLM import LLMProvider
from llmAcess.choiceLLM import LLMProviderFactory
from workflow.state import ExerciseState


llm = LLMProviderFactory.create(
    provider=LLMProvider.OPENAI
)


async def analisar_exercicio(
    state: ExerciseState
) -> ExerciseState:

    resultado_pose = state["resultado_pose"]

    prompt = f"""
Você é um assistente especializado em análise de movimento
de exercícios físicos.

Você receberá dados estruturados extraídos de um vídeo
através do MediaPipe.

Analise os dados e retorne uma avaliação técnica do movimento
de forma bem popular para que leigos entendam.

Aponte os erros no exercício, os pontos positivos, e forneça
recomendações para melhorar a execução.

Prestar atenção principalmente em movimentos de articulações,
postura, alinhamento e amplitude de movimento.

Verificar Braços, Pernas, Tronco, Pescoço, Ombros, Quadril,
Joelhos e Tornozelos.

IMPORTANTE:
- Não invente dados que não estejam presentes.
- Não faça diagnóstico médico.
- Indique limitações caso os dados sejam insuficientes.
- Retorne exclusivamente JSON.
- Não utilize Markdown.
- Não utilize ```json.
- Não utilize blocos de código.
- Retorne somente o objeto JSON.
- Caso der erro retorne apenas o JSON do retorno do erro,
  não processar na LLM.
- Retorne erro caso informar algum exercício físico que não exista.
- Retorne erro e repreenda se utilizar palavrão ou palavras
  de conotação sexual.
- Caso o nome do exercício não corresponda a execução do movimento,
  retorne erro e repreenda.

Dados:

{json.dumps(
    resultado_pose,
    ensure_ascii=False
)}

Retorne somente:

{{
    "status": "correto | atencao | incorreto",
    "resumo": "...",
    "pontos_positivos": [],
    "pontos_atencao": [],
    "recomendacoes": []
}}
"""

    resposta = await llm.ainvoke(prompt)

    # ---------------------------------------------------------
    # Recupera o conteúdo retornado pela LLM
    # ---------------------------------------------------------
    content = resposta.content.strip()

    # ---------------------------------------------------------
    # Remove bloco Markdown caso a LLM retorne:
    #
    # ```json
    # { ... }
    # ```
    # ---------------------------------------------------------
    if content.startswith("```json"):
        content = content[7:]

    elif content.startswith("```"):
        content = content[3:]

    if content.endswith("```"):
        content = content[:-3]

    content = content.strip()

    # ---------------------------------------------------------
    # Converte o conteúdo para JSON
    # ---------------------------------------------------------
    try:

        analise = json.loads(content)

    except json.JSONDecodeError as e:

        print(
            f"Erro ao converter resposta da LLM para JSON: {e}",
            flush=True
        )

        print(
            f"Conteúdo original recebido da LLM: {resposta.content}",
            flush=True
        )

        print(
            f"Conteúdo após limpeza: {content}",
            flush=True
        )

        analise = {
            "status": "erro",
            "resumo": resposta.content
        }

    return {
        "analise_llm": analise
    }