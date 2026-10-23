import axios from "axios";

import type {
  ApiErrorResponse,
  UploadResponse,
} from "../types/upload";

const API_URL =
  import.meta.env.VITE_API_URL ??
  "";

export async function enviarAnalise(
  pessoaId: number,
  tipoExercicio: string,
  file: File,
): Promise<UploadResponse> {

  const accessToken =
    sessionStorage.getItem(
      "access_token",
    );

  if (!accessToken) {
    throw new Error(
      "UNAUTHORIZED",
    );
  }

  const formData =
    new FormData();

  formData.append(
    "pessoaId",
    pessoaId.toString(),
  );

  formData.append(
    "tipoExercicio",
    tipoExercicio,
  );

  formData.append(
    "file",
    file,
  );

  try {

    const response =
      await axios.post<UploadResponse>(
        `${API_URL}/api/uploads`,
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        },
      );

    return response.data;

  } catch (error) {

    if (
      axios.isAxiosError<ApiErrorResponse>(
        error,
      )
    ) {

      if (
        error.response?.status === 401
      ) {
        throw new Error(
          "UNAUTHORIZED",
        );
      }

      const backendMessage =
        error.response
          ?.data
          ?.message;

      if (backendMessage) {
        throw new Error(
          backendMessage,
        );
      }

      if (!error.response) {
        throw new Error(
          "Não foi possível conectar ao servidor.",
        );
      }

      throw new Error(
        "Não foi possível enviar o vídeo para análise.",
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "Ocorreu um erro inesperado.",
    );
  }
}