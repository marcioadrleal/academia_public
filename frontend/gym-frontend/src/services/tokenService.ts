import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ??
  "";

interface TokenValidationRequest {
  accessToken: string;
  refreshToken: string;
}

interface TokenValidationResponse {
  access_token: string;
  refresh_token: string;

  expires_in: number | null;
  refresh_expires_in: number | null;

  token_type: string | null;
  scope: string | null;
  session_state: string | null;

  pessoa?: unknown;
}

export async function validarOuRenovarToken(): Promise<boolean> {

  const accessToken =
    sessionStorage.getItem(
      "access_token",
    );

  const refreshToken =
    sessionStorage.getItem(
      "refresh_token",
    );

  /*
   * Sem access token ou refresh token,
   * não há sessão válida.
   */
  if (
    !accessToken ||
    !refreshToken
  ) {

    return false;
  }

  const request: TokenValidationRequest = {
    accessToken,
    refreshToken,
  };

  try {

    const response =
      await axios.post<TokenValidationResponse>(
        `${API_URL}/api/auth/validate`,
        request,
      );

    const data =
      response.data;

    /*
     * Atualiza o access token.
     *
     * Pode ser o mesmo token se ainda
     * estiver válido ou um token novo
     * caso tenha ocorrido refresh.
     */
    if (data.access_token) {

      sessionStorage.setItem(
        "access_token",
        data.access_token,
      );
    }

    /*
     * Keycloak pode gerar um novo
     * refresh token durante a renovação.
     */
    if (data.refresh_token) {

      sessionStorage.setItem(
        "refresh_token",
        data.refresh_token,
      );
    }

    /*
     * Só sobrescreve esses campos quando
     * realmente vierem preenchidos.
     *
     * No seu /validate atual eles podem
     * retornar null quando o access token
     * ainda estiver válido.
     */
    if (data.expires_in != null) {

      sessionStorage.setItem(
        "expires_in",
        data.expires_in.toString(),
      );
    }

    if (
      data.refresh_expires_in != null
    ) {

      sessionStorage.setItem(
        "refresh_expires_in",
        data.refresh_expires_in.toString(),
      );
    }

    if (data.token_type) {

      sessionStorage.setItem(
        "token_type",
        data.token_type,
      );
    }

    if (data.session_state) {

      sessionStorage.setItem(
        "session_state",
        data.session_state,
      );
    }

    return true;

  } catch (error) {

    console.error(
      "Erro ao validar/renovar token:",
      error,
    );

    return false;
  }
}