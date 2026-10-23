import axios from "axios";

import type {
  ChangePasswordRequest,
  PessoaProfile,
  PessoaUpdateRequest,
} from "../types/profile";


const API_URL =
  import.meta.env.VITE_API_URL ??
  "";


function getAccessToken(): string {

  const token =
    sessionStorage.getItem(
      "access_token",
    );

  if (!token) {

    throw new Error(
      "UNAUTHORIZED",
    );
  }

  return token;
}


export async function buscarPerfil(
  pessoaId: number,
): Promise<PessoaProfile> {

  const token =
    getAccessToken();

  try {

    const response =
      await axios.get<PessoaProfile>(
        `${API_URL}/api/pessoas/${pessoaId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        },
      );

    return response.data;

  } catch (error) {

    return tratarErro(
      error,
      "Não foi possível carregar os dados do perfil.",
    );
  }
}


export async function atualizarPerfil(
  pessoaId: number,
  request: PessoaUpdateRequest,
): Promise<PessoaProfile | null> {

  const token =
    getAccessToken();

  try {

    const response =
      await axios.put<PessoaProfile>(
        `${API_URL}/api/pessoas/${pessoaId}`,
        request,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        },
      );

    if (
      response.status === 204
      ||
      !response.data
    ) {

      return null;
    }

    return response.data;

  } catch (error) {

    return tratarErro(
      error,
      "Não foi possível atualizar o perfil.",
    );
  }
}


export async function alterarSenha(
  request: ChangePasswordRequest,
): Promise<void> {

  const token =
    getAccessToken();

  try {

    await axios.put(
      `${API_URL}/api/users/password`,
      request,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      },
    );

  } catch (error) {

    tratarErro(
      error,
      "Não foi possível alterar a senha.",
    );
  }
}


function tratarErro(
  error: unknown,
  mensagemPadrao: string,
): never {

  if (
    axios.isAxiosError(error)
  ) {

    if (
      error.response?.status === 401
      ||
      error.response?.status === 403
    ) {

      throw new Error(
        "UNAUTHORIZED",
      );
    }

    const mensagemBackend =
      error.response?.data?.message;

    if (
      mensagemBackend
    ) {

      throw new Error(
        mensagemBackend,
      );
    }

    if (
      !error.response
    ) {

      throw new Error(
        "Não foi possível conectar ao servidor.",
      );
    }
  }

  if (
    error instanceof Error
  ) {

    throw error;
  }

  throw new Error(
    mensagemPadrao,
  );
}