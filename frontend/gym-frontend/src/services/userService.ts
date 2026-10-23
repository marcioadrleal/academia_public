import axios from "axios";

import type {
  RegisterRequest,
  RegisterResponse,
  ApiErrorResponse,
} from "../types/register";

const API_URL =
  import.meta.env.VITE_API_URL ??
  "";

export async function registerUser(
  data: RegisterRequest,
): Promise<RegisterResponse> {

  try {

    console.log(
      "URL:",
      `${API_URL}/api/users`,
    );

    console.log(
      "JSON enviado:",
      data,
    );

    const response =
      await axios.post<RegisterResponse>(
        `${API_URL}/api/users`,
        data,
      );

    console.log(
      "Status:",
      response.status,
    );

    console.log(
      "Resposta:",
      response.data,
    );

    return response.data;

  } catch (error) {

    if (axios.isAxiosError<ApiErrorResponse>(error)) {

      console.error(
        "Erro Axios:",
        error,
      );

      console.error(
        "Status HTTP:",
        error.response?.status,
      );

      console.error(
        "Resposta do backend:",
        error.response?.data,
      );

      console.error(
        "Headers:",
        error.response?.headers,
      );

      console.error(
        "Mensagem Axios:",
        error.message,
      );

      const backendMessage =
        error.response?.data?.message;

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
        "Não foi possível criar a conta.",
      );
    }

    console.error(
      "Erro inesperado:",
      error,
    );

    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "Ocorreu um erro inesperado.",
    );
  }
}