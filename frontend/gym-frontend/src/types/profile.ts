export interface PessoaProfile {
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

export interface PessoaUpdateRequest {
  nome: string;
  email: string;
  dataNascimento: string;
  sexo: string;
  telefone: string;
  celular: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  userId: string | null;
}

export interface ChangePasswordRequest {
  senhaAtual: string;
  novaSenha: string;
}