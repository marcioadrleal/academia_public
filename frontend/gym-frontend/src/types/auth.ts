export interface Pessoa {
  id: number;
  nome: string;
  email: string;
  dataNascimento: string;
  sexo: string;

  telefone: string | null;
  celular: string | null;

  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;

  ativo: boolean;

  dataCadastro: string;
  dataAtualizacao: string | null;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;

  expires_in: number;

  "not-before-policy": number;

  pessoa: Pessoa;

  refresh_expires_in: number;

  refresh_token: string;

  scope: string;

  session_state: string;

  token_type: string;

  userId: string | null;
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
}