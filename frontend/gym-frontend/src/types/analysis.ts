export interface AnaliseDetalhe {
  status: string;
  resumo: string;
  pontosPositivos: string[];
  pontosAtencao: string[];
  recomendacoes: string[];
}

export interface ProcessamentoDetalhe {
  sucesso: boolean;
  pessoaId: number;
  processamentoId: number;
  arquivoId: number;
  nomeArquivo: string;
  exercicio: string;
  totalFrames: number;
  framesComPose: number;
}

export interface ResultadoAnalise {
  pessoaId: number;
  dataProcessamento: string;
  processamento: ProcessamentoDetalhe;
  analise: AnaliseDetalhe;
}

export interface AnaliseResponse {
  id: string;
  pessoaId: number;
  processamentoId: number;
  resultado: ResultadoAnalise;
}