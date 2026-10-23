import axios from "axios";
import type { EstatisticaResponse } from "../types/statistics";

const API_URL =
  import.meta.env.VITE_API_URL ??
  "";

export async function buscarEstatisticas(
  pessoaId: number,
): Promise<EstatisticaResponse> {

  const accessToken =
    sessionStorage.getItem("access_token");

  const response =
    await axios.get<EstatisticaResponse>(
      `${API_URL}/api/pessoas/estatistica/${pessoaId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

  return response.data;
}