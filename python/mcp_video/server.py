import os
from fastmcp import FastMCP
import httpx

from starlette.requests import Request
from starlette.responses import JSONResponse, StreamingResponse

mcp = FastMCP("MCP Gym")

ACADEMIA_API_URL = os.getenv(
    "ACADEMIA_API_URL",
    "http://localhost:8090"
)




# Tool para verificar arquivo pendente
@mcp.tool()
async def obter_stream_video_pendente(
        pessoa_id: int) -> dict:

    """
    Verifica se a pessoa possui arquivo pendente.

    Caso exista, retorna a URL para consumo
    do vídeo via streaming.
    """

    if pessoa_id <= 0:
        return {
            "sucesso": False,
            "erro": "Pessoa inválida."
        }

    info_url = (
        f"{ACADEMIA_API_URL}"
        f"/api/arquivos/pessoa/info/{pessoa_id}"
    )

    try:

        async with httpx.AsyncClient(
            timeout=30.0
        ) as client:

            response = await client.get(info_url)

        # Nenhum arquivo pendente
        if response.status_code == 404:
            return {
                "sucesso": False,
                "pessoa_id": pessoa_id,
                "erro": "Pessoa não possui arquivo pendente."
            }

        response.raise_for_status()

        processamento = response.json()

        # Validação adicional
        if processamento.get("publicado") is True:
            return {
                "sucesso": False,
                "pessoa_id": pessoa_id,
                "erro": "Arquivo já foi processado."
            }

        if processamento.get("dataProcessamento") is not None:
            return {
                "sucesso": False,
                "pessoa_id": pessoa_id,
                "erro": "Arquivo já possui data de processamento."
            }

        stream_url = (
            f"/stream/pessoas/{pessoa_id}/pendente"
        )

        return {
            "sucesso": True,
            "pessoa_id": pessoa_id,

            "processamento_id":
                processamento.get("processamentoId"),

            "arquivo_id":
                processamento.get("arquivoId"),

            "nome_arquivo":
                processamento.get("nomeArquivo"),

            "tipo_exercicio":
                processamento.get("tipoExercicio"),

            "stream_url": stream_url,

            "metodo": "GET"
        }

    except httpx.ConnectError:

        return {
            "sucesso": False,
            "pessoa_id": pessoa_id,
            "erro": f"Não foi possível conectar à API.{info_url}"
        }

    except httpx.HTTPStatusError as erro:

        return {
            "sucesso": False,
            "pessoa_id": pessoa_id,
            "erro": "Erro retornado pela API.",
            "status_code": erro.response.status_code
        }

    except Exception as erro:

        return {
            "sucesso": False,
            "pessoa_id": pessoa_id,
            "erro": str(erro)
        }


@mcp.custom_route(
    "/stream/pessoas/{pessoa_id}/pendente",
    methods=["GET"]
)
async def stream_video_pendente(request: Request):

    pessoa_id = int(
        request.path_params["pessoa_id"]
    )

    if pessoa_id <= 0:
        return JSONResponse(
            {
                "sucesso": False,
                "erro": "pessoa_id inválido"
            },
            status_code=400
        )

    api_url = (
        f"{ACADEMIA_API_URL}"
        f"/api/arquivos/pessoa/"
        f"{pessoa_id}/pendente"
    )

    client = httpx.AsyncClient(
        timeout=httpx.Timeout(
            300.0,
            connect=10.0
        )
    )

    try:

        requisicao = client.build_request(
            "GET",
            api_url
        )

        response = await client.send(
            requisicao,
            stream=True
        )

        if response.status_code == 404:

            await response.aclose()
            await client.aclose()

            return JSONResponse(
                {
                    "sucesso": False,
                    "pessoa_id": pessoa_id,
                    "erro": "Nenhum arquivo pendente encontrado."
                },
                status_code=404
            )

        if response.status_code >= 400:

            status_code = response.status_code

            conteudo = await response.aread()

            detalhe = conteudo.decode(
                "utf-8",
                errors="replace"
            )

            print(
                f"[MCP] Erro API Java "
                f"URL={api_url} "
                f"STATUS={status_code} "
                f"BODY={detalhe}"
            )

            await response.aclose()
            await client.aclose()

            return JSONResponse(
                {
                    "sucesso": False,
                    "pessoa_id": pessoa_id,
                    "erro": "Erro ao obter vídeo da API.",
                    "status_code": status_code,
                    "detalhe": detalhe
                },
                status_code=status_code
            )

        async def gerar_stream():

            try:

                async for chunk in response.aiter_bytes(
                    chunk_size=1024 * 1024
                ):

                    if chunk:
                        yield chunk

            finally:

                await response.aclose()
                await client.aclose()

        headers = {}

        content_disposition = (
            response.headers.get(
                "content-disposition"
            )
        )

        if content_disposition:
            headers["Content-Disposition"] = (
                content_disposition
            )

        content_length = response.headers.get(
            "content-length"
        )

        if content_length:
            headers["Content-Length"] = (
                content_length
            )

        content_type = response.headers.get(
            "content-type",
            "application/octet-stream"
        )

        return StreamingResponse(
            gerar_stream(),
            media_type=content_type,
            headers=headers
        )

    except httpx.ConnectError:

        await client.aclose()

        return JSONResponse(
            {
                "sucesso": False,
                "erro": (
                    "Não foi possível conectar "
                    "à API Java."
                )
            },
            status_code=503
        )

    except Exception as erro:

        await client.aclose()

        return JSONResponse(
            {
                "sucesso": False,
                "erro": str(erro)
            },
            status_code=500
        )

if __name__ == "__main__":
    mcp.run(
        transport="http",
        host="0.0.0.0",
        port=8000
    )        