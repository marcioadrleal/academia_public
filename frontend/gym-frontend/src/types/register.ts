export interface NewUser {
  userName: string;
  password: string;
}

export interface DataPerson {
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
}

export interface RegisterRequest {
  newUser: NewUser;
  dataPerson: DataPerson;
}

export interface RegisterResponse {
  user: {
    userId: string;
    userName: string;
  };

  dataPerson: {
    id: number;
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

    ativo: boolean;
    dataCadastro: string;
    dataAtualizacao: string | null;
  };
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
}