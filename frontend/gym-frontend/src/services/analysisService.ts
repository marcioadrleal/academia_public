import axios from "axios";

import type {
  AnaliseResponse,
} from "../types/analysis";

const API_URL =
  import.meta.env.VITE_API_URL ??
  "";

export async function buscarAnalisesPorPessoa(
  pessoaId: number,
): Promise<AnaliseResponse[]> {

  const accessToken =
    sessionStorage.getItem(
      "access_token",
    );

  if (!accessToken) {
    throw new Error(
      "UNAUTHORIZED",
    );
  }

  try {

    const response =
      await axios.get<AnaliseResponse[]>(
        `${API_URL}/api/resultados/pessoa/${pessoaId}`,
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
      axios.isAxiosError(
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
        error.response?.data
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
        "Não foi possível carregar as análises.",
      );
    }

    if (
      error instanceof Error
    ) {
      throw error;
    }

    throw new Error(
      "Ocorreu um erro inesperado.",
    );
  }
}