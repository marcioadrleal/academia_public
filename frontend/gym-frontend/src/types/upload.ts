export interface UploadResponse {
  arquivoId: number;
  pessoaId: number;
  nomeOriginal: string;
  nomeStorage: string;
  bucket: string;
  tipoExercicio: string;
  contentType: string;
  tamanho: number;
  baixado: boolean;
  dataEntrada: string;
  dataProcessamento: string | null;
}

export interface ApiErrorResponse {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
}