import {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  validarOuRenovarToken,
} from "../../services/tokenService";

export function ProtectedRoute() {

  const [
    autenticado,
    setAutenticado,
  ] =
    useState<boolean | null>(
      null,
    );

  useEffect(() => {

    verificarSessao();

  }, []);

  async function verificarSessao() {

    const accessToken =
      sessionStorage.getItem(
        "access_token",
      );

    const refreshToken =
      sessionStorage.getItem(
        "refresh_token",
      );

    /*
     * Não existe sessão.
     */
    if (
      !accessToken ||
      !refreshToken
    ) {

      sessionStorage.clear();

      setAutenticado(
        false,
      );

      return;
    }

    /*
     * Chama:
     *
     * POST /api/auth/validate
     *
     * O backend verifica:
     *
     * access válido
     *      ↓
     * mantém token
     *
     * access expirado
     *      ↓
     * tenta refresh
     */
    const valido =
      await validarOuRenovarToken();

    if (!valido) {

      sessionStorage.clear();

      setAutenticado(
        false,
      );

      return;
    }

    setAutenticado(
      true,
    );
  }

  /*
   * Aguarda a validação.
   *
   * Importante para não abrir a Home
   * antes de saber se a sessão é válida.
   */
  if (
    autenticado === null
  ) {

    return (
      <div>
        Validando sessão...
      </div>
    );
  }

  /*
   * Sessão inválida ou refresh expirado.
   */
  if (!autenticado) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /*
   * Sessão válida.
   */
  return <Outlet />;
}