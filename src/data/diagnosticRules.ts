export type DiagnosticCategory = 'posicionamento' | 'presenca' | 'autoridade' | 'conversao';
export type BusinessType = 'servico' | 'varejo';

export interface DiagnosticRule {
  id: string;
  category: DiagnosticCategory;
  question: string;
  type: 'select' | 'checkbox' | 'scale';
  options: string[];
  onlyFor?: BusinessType; // Se presente, a regra só aparece para este tipo
  logic: Record<string, {
    score: number;
    insight?: string;
    isPositive?: boolean;
    action?: string;
  }>;
}

export const DIAGNOSTIC_RULES: DiagnosticRule[] = [
  // POSICIONAMENTO
  {
    id: 'nicho',
    category: 'posicionamento',
    question: 'O nicho está bem definido?',
    type: 'select',
    options: ['Sim', 'Não', 'Parcial'],
    logic: {
      'Sim': { score: 25, insight: 'Nicho bem definido e claro.', isPositive: true },
      'Não': { score: 0, insight: 'Nicho indefinido prejudica a atração de leads qualificados.', isPositive: false, action: 'Definir comunicações específicas para um ICP (Ideal Customer Profile) claro.' },
      'Parcial': { score: 10, insight: 'Nicho em fase de transição ou ajuste.', isPositive: false, action: 'Afilar a comunicação para falar com um público único.' }
    }
  },
  {
    id: 'promessa',
    category: 'posicionamento',
    question: 'Existe uma promessa clara de transformação?',
    onlyFor: 'servico',
    type: 'select',
    options: ['Sim', 'Não', 'Parcial'],
    logic: {
      'Sim': { score: 25, insight: 'Proposta única de valor bem comunicada.', isPositive: true },
      'Não': { score: 0, insight: 'Falta de uma Big Idea ou promessa clara de resultado.', isPositive: false, action: 'Estruturar uma oferta baseada em uma transformação específica.' },
      'Parcial': { score: 10, insight: 'Promessa genérica ou confusa.', isPositive: false, action: 'Tornar a promessa mais específica e mensurável.' }
    }
  },
  {
    id: 'desejo_produto',
    category: 'posicionamento',
    question: 'O produto gera desejo imediato?',
    onlyFor: 'varejo',
    type: 'select',
    options: ['Sim', 'Não', 'Parcial'],
    logic: {
      'Sim': { score: 25, insight: 'Produto com alto apelo visual e desejo de consumo.', isPositive: true },
      'Não': { score: 0, insight: 'Apresentação fraca que não desperta interesse.', isPositive: false, action: 'Melhorar a fotografia de produto e destacar benefícios imediatos.' },
      'Parcial': { score: 10, insight: 'Desejo sazonal ou dependente de preço.', isPositive: false, action: 'Criar narrativas de "estilo de vida" ao redor do produto.' }
    }
  },
  {
    id: 'perfil',
    category: 'posicionamento',
    question: 'Como o perfil se posiciona?',
    type: 'select',
    options: ['Especialista/Marca Forte', 'Vitrine/Catálogo', 'Indefinido'],
    logic: {
      'Especialista/Marca Forte': { score: 50, insight: 'Posicionamento de autoridade e domínio de campo.', isPositive: true },
      'Vitrine/Catálogo': { score: 20, insight: 'Perfil muito focado em produtos, baixa conexão humana.', isPositive: false, action: 'Humanizar a marca através de bastidores e curadoria de produtos.' },
      'Indefinido': { score: 0, insight: 'Falta de clareza sobre a identidade da marca.', isPositive: false, action: 'Definir pilares de conteúdo que demonstrem a personalidade da marca.' }
    }
  },

  // PRESENÇA DIGITAL
  {
    id: 'frequencia',
    category: 'presenca',
    question: 'Frequência de postagens (Feed/Stories)?',
    type: 'select',
    options: ['Diário', '3x por semana', '1x por semana', 'Não posta'],
    logic: {
      'Diário': { score: 40, insight: 'Alta consistência e manutenção de algoritmo.', isPositive: true },
      '3x por semana': { score: 25, insight: 'Frequência moderada, aceitável para manutenção.', isPositive: true },
      '1x por semana': { score: 10, insight: 'Baixa frequência, risco de queda de alcance.', isPositive: false, action: 'Aumentar frequência para pelo menos 3 vezes na semana.' },
      'Não posta': { score: 0, insight: 'Perfil abandonado ou vitrine estática.', isPositive: false, action: 'Retomar postagens estratégicas imediatamente.' }
    }
  },
  {
    id: 'padrao_visual',
    category: 'presenca',
    question: 'Existe padrão visual (branding)?',
    type: 'select',
    options: ['Sim', 'Não'],
    logic: {
      'Sim': { score: 30, insight: 'Identidade visual profissional e reconhecível.', isPositive: true },
      'Não': { score: 0, insight: 'Estética amadora ou ruidosa.', isPositive: false, action: 'Definir uma paleta de cores e tipografia padrão.' }
    }
  },
  {
    id: 'estrategico',
    category: 'presenca',
    question: 'O conteúdo é uma curadoria estratégica?',
    type: 'select',
    options: ['Estratégico', 'Parcial', 'Aleatório'],
    logic: {
      'Estratégico': { score: 30, insight: 'Conteúdo focado em gerar desejo e necessidade.', isPositive: true },
      'Parcial': { score: 15, insight: 'Falta de clareza sobre o objetivo final da postagem.', isPositive: false, action: 'Mapear a jornada do cliente e criar conteúdos direcionados.' },
      'Aleatório': { score: 0, insight: 'Postagens feitas sem objetivo de venda ou crescimento.', isPositive: false, action: 'Implementar um calendário editorial estratégico.' }
    }
  },

  // AUTORIDADE
  {
    id: 'resultados',
    category: 'autoridade',
    question: 'Mostra resultados/casos de sucesso?',
    onlyFor: 'servico',
    type: 'select',
    options: ['Sim', 'Não'],
    logic: {
      'Sim': { score: 40, insight: 'Forte prova social através de resultados reais.', isPositive: true },
      'Não': { score: 0, insight: 'Baixa percepção de eficácia (ausência de prova social).', isPositive: false, action: 'Criar destaques e posts constantes com resultados e estudos de caso.' }
    }
  },
  {
    id: 'prova_social_varejo',
    category: 'autoridade',
    question: 'Mostra clientes usando/comprando os produtos?',
    onlyFor: 'varejo',
    type: 'select',
    options: ['Sim', 'Não'],
    logic: {
      'Sim': { score: 40, insight: 'Forte prova social através de validação de vizinhos/compradores.', isPositive: true },
      'Não': { score: 0, insight: 'Falta de validação e confiança no produto.', isPositive: false, action: 'Estimular clientes a marcarem a loja e repostar feedbacks.' }
    }
  },
  {
    id: 'depoimentos',
    category: 'autoridade',
    question: 'Possui depoimentos de clientes?',
    onlyFor: 'servico',
    type: 'select',
    options: ['Sim', 'Não'],
    logic: {
      'Sim': { score: 30, insight: 'Validação externa de terceiros sobre o serviço.', isPositive: true },
      'Não': { score: 0, insight: 'Falta de validação e confiança de mercado.', isPositive: false, action: 'Solicitar feedbacks estruturados dos clientes atuais.' }
    }
  },
  {
    id: 'unboxing_bastidores',
    category: 'autoridade',
    question: 'Mostra processos de envio ou bastidores da loja?',
    onlyFor: 'varejo',
    type: 'select',
    options: ['Sim', 'Não'],
    logic: {
      'Sim': { score: 30, insight: 'Transparência gera confiança na entrega e operação.', isPositive: true },
      'Não': { score: 0, insight: 'Operação "caixa preta" diminui a segurança do comprador.', isPositive: false, action: 'Gravar processos de embalagem e rotina da loja.' }
    }
  },
  {
    id: 'storytelling',
    category: 'autoridade',
    question: 'Usa narrativas para conectar com o público?',
    type: 'select',
    options: ['Sim', 'Não'],
    logic: {
      'Sim': { score: 30, insight: 'Capacidade de conexão emocional e retenção.', isPositive: true },
      'Não': { score: 0, insight: 'Comunicação muito técnica ou fria.', isPositive: false, action: 'Humanizar o perfil através de narrativas de dia-a-dia e propósitos da marca.' }
    }
  },

  // CONVERSÃO
  {
    id: 'cta',
    category: 'conversao',
    question: 'Possui CTA claro nas postagens?',
    type: 'select',
    options: ['Sim', 'Não'],
    logic: {
      'Sim': { score: 30, insight: 'Direcionamento claro para a próxima etapa do funil.', isPositive: true },
      'Não': { score: 0, insight: 'Falta de comando de ação, perda de oportunidades de venda.', isPositive: false, action: 'Incluir CTAs específicos (comente, mande DM, link na bio) em cada post.' }
    }
  },
  {
    id: 'link_contato',
    category: 'conversao',
    question: 'Possui link/catálogo direto para compra?',
    type: 'select',
    options: ['Sim', 'Não'],
    logic: {
      'Sim': { score: 30, insight: 'Porta de entrada para aquisição bem definida.', isPositive: true },
      'Não': { score: 0, insight: 'Dificuldade do cliente em comprar ou entrar em contato.', isPositive: false, action: 'Estruturar um link para o WhatsApp ou Loja Online.' }
    }
  },
  {
    id: 'oferta',
    category: 'conversao',
    question: 'Possui condições exclusivas ou ofertas sazonais?',
    type: 'select',
    options: ['Sim', 'Não'],
    logic: {
      'Sim': { score: 40, insight: 'Senso de oportunidade impulsiona a conversão.', isPositive: true },
      'Não': { score: 0, insight: 'Falta de escassez ou urgência na comunicação.', isPositive: false, action: 'Criar ofertas semanais ou condições especiais para seguidores.' }
    }
  }
];
