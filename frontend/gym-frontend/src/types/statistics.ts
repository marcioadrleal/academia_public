export interface Processamento {
  processamentoId: number;
  pessoaId: number;
  arquivoId: number;
  nomeArquivo: string;
  tipoExercicio: string;
  publicado: boolean;
  dataEntrada: string;
  dataProcessamento: string | null;
}

export interface EstatisticaResponse {
  analise: number;
  exercicios: number;
  ultimoProcessamento: Processamento | null;
  cincoUltimos: Processamento[];
}