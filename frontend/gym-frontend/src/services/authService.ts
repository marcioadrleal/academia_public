import axios from "axios";

import type {
  ApiErrorResponse,
  LoginRequest,
  LoginResponse,
} from "../types/auth";

const API_URL =
  import.meta.env.VITE_API_URL ??
  "";

export async function login(
  data: LoginRequest,
): Promise<LoginResponse> {
  try {
    const response =
      await axios.post<LoginResponse>(
        `${API_URL}/api/auth/login`,
        data,
      );

    return response.data;
  } catch (error) {
    if (
      axios.isAxiosError<ApiErrorResponse>(
        error,
      )
    ) {
      console.error(
        "Erro no login:",
        error.response?.data,
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
        "Não foi possível realizar o login.",
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