import axios from "axios";

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export async function buscarCep(
  cep: string,
): Promise<ViaCepResponse> {

  const cepNumerico =
    cep.replace(/\D/g, "");

  const response =
    await axios.get<ViaCepResponse>(
      `https://viacep.com.br/ws/${cepNumerico}/json/`,
    );

  return response.data;
}