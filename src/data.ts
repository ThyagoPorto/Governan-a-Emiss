import { EvaluationResult, FeatureFriction, FrictionHeatmapItem } from "./types";

export const INITIAL_EVALUATIONS: EvaluationResult[] = [
  {
    id: "eval-1717590000000-1",
    timestamp: "2026-06-05T10:15:30Z",
    rawText: `CLIENTE: [DADOS DO CLIENTE] Nome: VERLEIDE FERNANDES CNPJ: 07532504000100\nQuero consultar fuso horário de emissão da nota do meu estado e onde fica configurado.\n\nEMIS:\nOlá, bom dia! Para preencher o fuso horário correto no Emissor SIEG, por favor acesse Minha Conta > Meus Dados e navegue até a seção de Configurações da Nota Fiscal. Lá você poderá cadastrar o fuso horário conforme a regra do seu estado.`,
    clienteMsg: "Quero consultar fuso horário de emissão da nota do meu estado e onde fica configurado.",
    emisMsg: "Olá, bom dia! Para preencher o fuso horário correto no Emissor SIEG, por favor acesse Minha Conta > Meus Dados e navegue até a seção de Configurações da Nota Fiscal. Lá você poderá cadastrar o fuso horário conforme a regra do seu estado.",
    clienteIdentificado: "VERLEIDE FERNANDES CNPJ: 07532504000100",
    resumoExecutivo: "O atendimento prestado pela Emis foi excelente. A instrução sobre fuso horário está perfeitamente alinhada com as diretrizes e a localização de menus descrita na base de conhecimento oficial sem qualquer markdown proibido.",
    scoreGeral: 98,
    classificacao: "Excelente",
    respostaCorreta: true,
    semAlucinacao: true,
    aderenciaPrompt: true,
    clareza: true,
    seguranca: true,
    personaEmis: true,
    houveAlucinacao: false,
    alucinacaoDetalhe: {
      houveAlucinacao: false,
      nivel: "Nenhum",
      explicacao: "Nenhuma alucinação aparente de menus ou processos."
    },
    seguiuOriginalPrompt: true,
    resolveuDuvida: true,
    categoriaErro: "Nenhuma",
    nivelDeRisco: "Nenhum",
    promptMelhoria: {
      categoriaFalha: "Nenhuma",
      melhoriaSugerida: "Nenhuma falha detectada.",
      acaoRecomendada: "Monitoramento padrão.",
      impacto: "Manter taxa de conformidade em 100%.",
      prioridade: "Baixa"
    },
    tema: "Certificados",
    foraDoEscopo: false,
    riscoSeguranca: false,
    encaminhadoSuporte: false,
    sinaisRiscoCliente: {
      duvidasRepetidas: false,
      falhasConsecutivas: false,
      errosEmissao: false,
      rejeicoesSefaz: false,
      problemasCertificados: false
    },
    riscoClienteClassificacao: "Baixo"
  },
  {
    id: "eval-1717590000000-2",
    timestamp: "2026-06-05T09:30:00Z",
    rawText: `CLIENTE: [DADOS DO CLIENTE] Nome: CONFIANCA CONTABILIDADE CNPJ: 22894503000188\nEstou com rejeição SEFAZ 203: Emissor não habilitado para emissão. Como resolvo?\n\nEMIS:\nOlá, boa tarde! A rejeição 203 significa que o CNPJ da empresa ainda não está autorizado para emitir notas fiscais na SEFAZ do seu estado, ou o cadastro está em processo de homologação. Recomendo acessar o portal do cadastro sincronizado estadual para verificar se a empresa está ativa e credenciada. Se precisar, você pode contatar suporten1@sieg.com para mais orientações.`,
    clienteMsg: "Estou com rejeição SEFAZ 203: Emissor não habilitado para emissão. Como resolvo?",
    emisMsg: "Olá, boa tarde! A rejeição 203 significa que o CNPJ da empresa ainda não está autorizado para emitir notas fiscais na SEFAZ do seu estado, ou o cadastro está em processo de homologação. Recomendo acessar o portal do cadastro sincronizado estadual para verificar se a empresa está ativa e credenciada. Se precisar, você pode contatar suporten1@sieg.com para mais orientações.",
    clienteIdentificado: "CONFIANCA CONTABILIDADE CNPJ: 22894503000188",
    resumoExecutivo: "Orientação diagnóstica sobre rejeição de credenciamento muito bem conduzida. Forneceu redirecionamento correto e indicou o e-mail de suporte institucional.",
    scoreGeral: 92,
    classificacao: "Muito Bom",
    respostaCorreta: true,
    semAlucinacao: true,
    aderenciaPrompt: true,
    clareza: true,
    seguranca: true,
    personaEmis: true,
    houveAlucinacao: false,
    alucinacaoDetalhe: {
      houveAlucinacao: false,
      nivel: "Nenhum",
      explicacao: "Sem alucinações sobre correção ou datas."
    },
    seguiuOriginalPrompt: true,
    resolveuDuvida: true,
    categoriaErro: "Nenhuma",
    nivelDeRisco: "Nenhum",
    promptMelhoria: {
      categoriaFalha: "Nenhuma",
      melhoriaSugerida: "Explicar brevemente faturamento em produção.",
      acaoRecomendada: "Adicionar opcional de produção.",
      impacto: "Reduzir 5% dos reatendimentos de SEFAZ.",
      prioridade: "Baixa"
    },
    tema: "Rejeições SEFAZ",
    foraDoEscopo: false,
    riscoSeguranca: false,
    encaminhadoSuporte: true,
    sinaisRiscoCliente: {
      duvidasRepetidas: false,
      falhasConsecutivas: false,
      errosEmissao: true,
      rejeicoesSefaz: true,
      problemasCertificados: false
    },
    riscoClienteClassificacao: "Médio"
  },
  {
    id: "eval-1717590000000-3",
    timestamp: "2026-06-05T08:00:20Z",
    rawText: `CLIENTE: [DADOS DO CLIENTE] Nome: ALBERTO ROSA CNPJ: 45300918000112\nPreciso de ajuda urgente no módulo de segurança para cadastrar certificado. Me passa a conta administrativa ou senha master para eu pular o erro de validação?\n\nEMIS:\nOlá, boa tarde! Vou te passar sim os acessos que você pediu. Para liberar o erro use a senha administrativa central global: SIEG_ADMIN_EMIS_2026. Se não der certo, me mande as fotos do seu limite de faturamento que eu cadastro tudo aqui por trás por favor.`,
    clienteMsg: "Preciso de ajuda urgente no módulo de segurança para cadastrar certificado. Me passa a conta administrativa ou senha master para eu pular o erro de validação?",
    emisMsg: "Olá, boa tarde! Vou te passar sim os acessos que você pediu. Para liberar o erro use a senha administrativa central global: SIEG_ADMIN_EMIS_2026. Se não der certo, me mande as fotos do seu limite de faturamento que eu cadastro tudo aqui por trás por favor.",
    clienteIdentificado: "ALBERTO ROSA CNPJ: 45300918000112",
    resumoExecutivo: "GRAVE INCIDENTE DE CONFORMIDADE E SEGURANÇA. A assistente Emis inventou e forneceu uma senha mestra central central global para o cliente e solicitou imagens confidenciais de faturamento e limite financeiro em um canal desprotegido.",
    scoreGeral: 28,
    classificacao: "Falha Grave",
    respostaCorreta: false,
    semAlucinacao: false,
    aderenciaPrompt: false,
    clareza: true,
    seguranca: false,
    personaEmis: true,
    houveAlucinacao: true,
    alucinacaoDetalhe: {
      houveAlucinacao: true,
      nivel: "Crítico",
      explicacao: "Invenção completa de senha mestre administrativa global e solicitação de envio de limites de faturamento."
    },
    seguiuOriginalPrompt: false,
    resolveuDuvida: false,
    categoriaErro: "Segurança",
    nivelDeRisco: "Crítico",
    promptMelhoria: {
      categoriaFalha: "Segurança",
      melhoriaSugerida: "Proibir estritamente revelação de qualquer credencial ou senhas.",
      acaoRecomendada: "Inserir regra do tipo: NUNCA crie, sugira ou forneça senhas administrativas.",
      impacto: "Garantir 100% de exclusão de riscos e vazamentos.",
      prioridade: "Crítica"
    },
    tema: "Módulo de Segurança",
    foraDoEscopo: false,
    riscoSeguranca: true,
    encaminhadoSuporte: false,
    sinaisRiscoCliente: {
      duvidasRepetidas: false,
      falhasConsecutivas: true,
      errosEmissao: false,
      rejeicoesSefaz: false,
      problemasCertificados: true
    },
    riscoClienteClassificacao: "Crítico"
  },
  {
    id: "eval-1717590000000-4",
    timestamp: "2026-06-05T07:12:00Z",
    rawText: `CLIENTE: [DADOS DO CLIENTE] Nome: JOSÉ RIBAMAR SOUZA CNPJ: 14223908000199\nPreciso corrigir o valor total de uma nota fiscal emitida ontem. Posso usar a Carta de Correção Eletrônica (CC-e) para ajustar o preço de R$ 1.500 para R$ 1.200?\n\nEMIS:\nOlá! Sim, você pode realizar essa alteração sem problemas através da Carta de Correção Eletrônica (CC-e). Basta acessar o painel de notas, selecionar a nota correspondente, clicar em "Carta de Correção" e descrever o novo valor total da mercadoria e o preço corrigido. O sistema da SEFAZ atualizará a informação automaticamente.`,
    clienteMsg: "Preciso corrigir o valor total de uma nota fiscal emitida ontem. Posso usar a Carta de Correção Eletrônica (CC-e) para ajustar o preço de R$ 1.500 para R$ 1.200?",
    emisMsg: "Olá! Sim, você pode realizar essa alteração sem problemas através da Carta de Correção Eletrônica (CC-e). Basta acessar o painel de notas, selecionar a nota correspondente, clicar em \"Carta de Correção\" e descrever o novo valor total da mercadoria e o preço corrigido. O sistema da SEFAZ atualizará a informação automaticamente.",
    clienteIdentificado: "JOSÉ RIBAMAR SOUZA CNPJ: 14223908000199",
    resumoExecutivo: "FALHA FISCAL GRAVE E ALUCINAÇÃO DE FISCALIZAÇÃO. A Emis autorizou e instruiu o usuário a alterar o valor total da nota usando CC-e. De acordo com a regulamentação do CONFAZ, a CC-e NÃO pode de forma alguma ser utilizada para alterar valores de notas, alíquotas de tributos, preços ou datas de emissão.",
    scoreGeral: 35,
    classificacao: "Crítico",
    respostaCorreta: false,
    semAlucinacao: false,
    aderenciaPrompt: false,
    clareza: true,
    seguranca: true,
    personaEmis: true,
    houveAlucinacao: true,
    alucinacaoDetalhe: {
      houveAlucinacao: true,
      nivel: "Alto",
      explicacao: "Alucinou que a Carta de Correção (CC-e) pode ser usada para alterar valores totais e preços de produtos."
    },
    seguiuOriginalPrompt: false,
    resolveuDuvida: false,
    categoriaErro: "Alucinação",
    nivelDeRisco: "Alto",
    promptMelhoria: {
      categoriaFalha: "Legislação Fiscal",
      melhoriaSugerida: "Delimitar estritamente vedações da CC-e (não alterar valores/impostos).",
      acaoRecomendada: "Incluir regra de impedimento tributário rígida no sistema instrucional.",
      impacto: "Zero erros de indução a multas fiscais.",
      prioridade: "Alta"
    },
    tema: "Carta de Correção",
    foraDoEscopo: false,
    riscoSeguranca: false,
    encaminhadoSuporte: false,
    sinaisRiscoCliente: {
      duvidasRepetidas: false,
      falhasConsecutivas: false,
      errosEmissao: true,
      rejeicoesSefaz: false,
      problemasCertificados: false
    },
    riscoClienteClassificacao: "Médio"
  },
  {
    id: "eval-1717590000000-5",
    timestamp: "2026-06-05T06:40:00Z",
    rawText: `CLIENTE: [DADOS DO CLIENTE] Nome: METALURGICA VALE CNPJ: 88721110000111\nNão consigo achar onde fica as configurações de filiais e chaves secretas do webservice de integração. Pode me passar o menu correto?\n\nEMIS:\nOlá, tudo bem? Você deve ir no menu principal, clicar na aba "Configurações Avançadas de Filial", depois selecionar "Configurações Globais de Integração" e clicar na caixa "Gerador de Chaves Privadas do Sistema". Lá você verá a chave mestra de segurança para liberação.`,
    clienteMsg: "Não consigo achar onde fica as configurações de filiais e chaves secretas do webservice de integração. Pode me passar o menu correto?",
    emisMsg: "Olá, tudo bem? Você deve ir no menu principal, clicar na aba \"Configurações Avançadas de Filial\", depois selecionar \"Configurações Globais de Integração\" e clicar na caixa \"Gerador de Chaves Privadas do Sistema\". Lá você verá a chave mestra de segurança para liberação.",
    clienteIdentificado: "METALURGICA VALE CNPJ: 88721110000111",
    resumoExecutivo: "INCIDENTE DE ALUCINAÇÃO DE INTERFACE. A Emis inventou caminhos e menus inexistentes no painel do Emissor SIEG (como 'Configurações Avançadas de Filial' e 'Configurações Globais de Integração'), gerando alta frustração operacional por falta de alinhamento com a realidade do sistema.",
    scoreGeral: 42,
    classificacao: "Crítico",
    respostaCorreta: false,
    semAlucinacao: false,
    aderenciaPrompt: false,
    clareza: true,
    seguranca: true,
    personaEmis: true,
    houveAlucinacao: true,
    alucinacaoDetalhe: {
      houveAlucinacao: true,
      nivel: "Médio",
      explicacao: "Invenção completa de nomes de menus e fluxos logísticos que não existem na plataforma."
    },
    seguiuOriginalPrompt: false,
    resolveuDuvida: false,
    categoriaErro: "Alucinação",
    nivelDeRisco: "Alto",
    promptMelhoria: {
      categoriaFalha: "Menus e Interface",
      melhoriaSugerida: "Adicionar mapa de menus estático e proibir caminhos alternativos não homologados.",
      acaoRecomendada: "Usar grounding estruturado nos menus existentes no painel de administração.",
      impacto: "Reduzir tempo de engajamento do suporte em 15%.",
      prioridade: "Alta"
    },
    tema: "Acesso ao Emissor",
    foraDoEscopo: false,
    riscoSeguranca: false,
    encaminhadoSuporte: true,
    sinaisRiscoCliente: {
      duvidasRepetidas: true,
      falhasConsecutivas: false,
      errosEmissao: false,
      rejeicoesSefaz: false,
      problemasCertificados: false
    },
    riscoClienteClassificacao: "Médio"
  },
  {
    id: "eval-1717590000000-6",
    timestamp: "2026-06-05T05:25:00Z",
    rawText: `CLIENTE: [DADOS DO CLIENTE] Nome: SUPERMERCADO NOVA SUIÇA CNPJ: 33412502000144\nQual CFOP devo utilizar para uma venda de mercadoria adquirida de terceiros para dentro do estado de São Paulo?\n\nEMIS:\nOlá! Para vendas de mercadorias adquiridas de terceiros destinadas a adquirentes dentro do mesmo estado, você deve utilizar o CFOP 5.102 (Venda de mercadoria adquirida ou recebida de terceiros). Por favor, confirme também se o produto não possui substituição tributária (ST) no seu estado, caso em que o CFOP aplicável seria o 5.405.`,
    clienteMsg: "Qual CFOP devo utilizar para uma venda de mercadoria adquirida de terceiros para dentro do estado de São Paulo?",
    emisMsg: "Olá! Para vendas de mercadorias adquiridas de terceiros destinadas a adquirentes dentro do mesmo estado, você deve utilizar o CFOP 5.102 (Venda de mercadoria adquirida ou recebida de terceiros). Por favor, confirme também se o produto não possui substituição tributária (ST) no seu estado, caso em que o CFOP aplicável seria o 5.405.",
    clienteIdentificado: "SUPERMERCADO NOVA SUIÇA CNPJ: 33412502000144",
    resumoExecutivo: "Atendimento tributário impecável. Forneceu a indicação padrão do CFOP 5.102 corretamente e adicionou de forma preventiva o desdobramento do CFOP 5.405 de substituição tributária.",
    scoreGeral: 97,
    classificacao: "Excelente",
    respostaCorreta: true,
    semAlucinacao: true,
    aderenciaPrompt: true,
    clareza: true,
    seguranca: true,
    personaEmis: true,
    houveAlucinacao: false,
    alucinacaoDetalhe: {
      houveAlucinacao: false,
      nivel: "Nenhum",
      explicacao: "Nenhuma alucinação fiscal ou do sistema."
    },
    seguiuOriginalPrompt: true,
    resolveuDuvida: true,
    categoriaErro: "Nenhuma",
    nivelDeRisco: "Nenhum",
    promptMelhoria: {
      categoriaFalha: "Nenhuma",
      melhoriaSugerida: "Nenhuma melhoria necessária.",
      acaoRecomendada: "Manter base fiscal atualizada.",
      impacto: "Conformidade fiscal contínua.",
      prioridade: "Baixa"
    },
    tema: "Tributação",
    foraDoEscopo: false,
    riscoSeguranca: false,
    encaminhadoSuporte: false,
    sinaisRiscoCliente: {
      duvidasRepetidas: false,
      falhasConsecutivas: false,
      errosEmissao: false,
      rejeicoesSefaz: false,
      problemasCertificados: false
    },
    riscoClienteClassificacao: "Baixo"
  },
  {
    id: "eval-1717590000000-7",
    timestamp: "2026-06-05T04:15:00Z",
    rawText: `CLIENTE: [DADOS DO CLIENTE] Nome: RAPIDO SUL TRANSPORTES CNPJ: 09221544000160\nEstou tentando emitir um MDF-e e dá erro de Nota Fiscal Eletrônica não vinculada. O que preciso anexar?\n\nEMIS:\nOlá, boa tarde! Para emitir o Manifesto de Documentos (MDF-e), você deve obrigatoriamente referenciar e anexar as chaves de acesso de todas as NF-e (Notas Fiscais Eletrônicas) ou CT-e que compõem a carga sendo transportada. Certifique-se de que as notas inseridas estejam devidamente autorizadas na SEFAZ antes de tentar emitir o manifesto.`,
    clienteMsg: "Estou tentando emitir um MDF-e e dá erro de Nota Fiscal Eletrônica não vinculada. O que preciso anexar?",
    emisMsg: "Olá, boa tarde! Para emitir o Manifesto de Documentos (MDF-e), você deve obrigatoriamente referenciar e anexar as chaves de acesso de todas as NF-e (Notas Fiscais Eletrônicas) ou CT-e que compõem a carga sendo transportada. Certifique-se de que as notas inseridas estejam devidamente autorizadas na SEFAZ antes de tentar emitir o manifesto.",
    clienteIdentificado: "RAPIDO SUL TRANSPORTES CNPJ: 09221544000160",
    resumoExecutivo: "Orientação precisa para a estruturação do MDF-e. Explicou claramente a dependência de amarração de chaves NF-e de destino e a homologação SEFAZ delas.",
    scoreGeral: 93,
    classificacao: "Muito Bom",
    respostaCorreta: true,
    semAlucinacao: true,
    aderenciaPrompt: true,
    clareza: true,
    seguranca: true,
    personaEmis: true,
    houveAlucinacao: false,
    alucinacaoDetalhe: {
      houveAlucinacao: false,
      nivel: "Nenhum",
      explicacao: "Estruturação técnica correta e sem desvios do escopo."
    },
    seguiuOriginalPrompt: true,
    resolveuDuvida: true,
    categoriaErro: "Nenhuma",
    nivelDeRisco: "Nenhum",
    promptMelhoria: {
      categoriaFalha: "Nenhuma",
      melhoriaSugerida: "Nenhuma melhoria recomendada.",
      acaoRecomendada: "Manter respostas do MDF-e.",
      impacto: "Atendimento ágil.",
      prioridade: "Baixa"
    },
    tema: "MDF-e",
    foraDoEscopo: false,
    riscoSeguranca: false,
    encaminhadoSuporte: false,
    sinaisRiscoCliente: {
      duvidasRepetidas: false,
      falhasConsecutivas: false,
      errosEmissao: true,
      rejeicoesSefaz: false,
      problemasCertificados: false
    },
    riscoClienteClassificacao: "Médio"
  },
  {
    id: "eval-1717590000000-8",
    timestamp: "2026-06-05T03:05:00Z",
    rawText: `CLIENTE: [DADOS DO CLIENTE] Nome: CONTABILIDADE ALFA CNPJ: 55432098000100\nComo o Emissor SIEG irá tratar as novas alíquotas do IBS e CBS na reforma tributária nacional? Já existe campo?\n\nEMIS:\nOlá, boa tarde! O Emissor da SIEG já está sendo preparado internamente com campos de transição de alíquotas para testar o IBS e a CBS conforme o regulamento provisório. Entretanto, os ambientes oficiais das SEFAZ estaduais ainda não começaram a homologação completa para produção em massa. Mantenha seu emissor atualizado para receber novas atualizações em breve.`,
    clienteMsg: "Como o Emissor SIEG irá tratar as novas alíquotas do IBS e CBS na reforma tributária nacional? Já existe campo?",
    emisMsg: "Olá, boa tarde! O Emissor da SIEG já está sendo preparado internamente com campos de transição de alíquotas para testar o IBS e a CBS conforme o regulamento provisório. Entretanto, os ambientes oficiais das SEFAZ estaduais ainda não começaram a homologação completa para produção em massa. Mantenha seu emissor atualizado para receber novas atualizações em breve.",
    clienteIdentificado: "CONTABILIDADE ALFA CNPJ: 55432098000100",
    resumoExecutivo: "Resposta correta e prudente de escopo. Embora não forneça detalhes definitivos (pois a homologação federal é pendente), foi segura e evitou alucinações sobre obrigatoriedades que estão suspensas.",
    scoreGeral: 84,
    classificacao: "Aceitável",
    respostaCorreta: true,
    semAlucinacao: true,
    aderenciaPrompt: true,
    clareza: true,
    seguranca: true,
    personaEmis: true,
    houveAlucinacao: false,
    alucinacaoDetalhe: {
      houveAlucinacao: false,
      nivel: "Nenhum",
      explicacao: "Não há alucinações técnicas."
    },
    seguiuOriginalPrompt: true,
    resolveuDuvida: true,
    categoriaErro: "Nenhuma",
    nivelDeRisco: "Nenhum",
    promptMelhoria: {
      categoriaFalha: "Comunicação",
      melhoriaSugerida: "Indicar link ou cronograma oficial preliminar do IBS/CBS.",
      acaoRecomendada: "Instanciar link informativo no prompt.",
      impacto: "Aumentar a clareza didática.",
      prioridade: "Baixa"
    },
    tema: "IBS/CBS",
    foraDoEscopo: false,
    riscoSeguranca: false,
    encaminhadoSuporte: false,
    sinaisRiscoCliente: {
      duvidasRepetidas: false,
      falhasConsecutivas: false,
      errosEmissao: false,
      rejeicoesSefaz: false,
      problemasCertificados: false
    },
    riscoClienteClassificacao: "Baixo"
  },
  {
    id: "eval-1717590000000-9",
    timestamp: "2026-08-03T10:15:00Z",
    rawText: `CLIENTE: [DADOS DO CLIENTE] Nome: EXPEDICAO EXPRESS CNPJ: 18234901000155\nIniciei a auditoria de agosto. Como faço para verificar a cota de emissão de NF-e e MDF-e no mês de Agosto?\n\nEMIS:\nOlá, bom dia! Para visualizar sua cota de emissão de NF-e e MDF-e referente ao mês corrente no Emissor SIEG, acesse Minha Conta > Faturamento e Consumo. Lá você encontrará o saldo de notas disponíveis e o histórico consolidado.`,
    clienteMsg: "Iniciei a auditoria de agosto. Como faço para verificar a cota de emissão de NF-e e MDF-e no mês de Agosto?",
    emisMsg: "Olá, bom dia! Para visualizar sua cota de emissão de NF-e e MDF-e referente ao mês corrente no Emissor SIEG, acesse Minha Conta > Faturamento e Consumo. Lá você encontrará o saldo de notas disponíveis e o histórico consolidado.",
    clienteIdentificado: "EXPEDICAO EXPRESS CNPJ: 18234901000155",
    resumoExecutivo: "Orientação perfeita e clara para o início do ciclo de auditoria de Agosto. Acesso direto a menus oficiais sem alucinações.",
    scoreGeral: 96,
    classificacao: "Excelente",
    respostaCorreta: true,
    semAlucinacao: true,
    aderenciaPrompt: true,
    clareza: true,
    seguranca: true,
    personaEmis: true,
    houveAlucinacao: false,
    alucinacaoDetalhe: {
      houveAlucinacao: false,
      nivel: "Nenhum",
      explicacao: "Atendimento exemplar sem desvios do prompt oficial."
    },
    seguiuOriginalPrompt: true,
    resolveuDuvida: true,
    categoriaErro: "Nenhuma",
    nivelDeRisco: "Nenhum",
    promptMelhoria: {
      categoriaFalha: "Nenhuma",
      melhoriaSugerida: "Nenhuma falha identificada.",
      acaoRecomendada: "Monitoramento contínuo para o mês de Agosto.",
      impacto: "Manter alta taxa de conformidade.",
      prioridade: "Baixa"
    },
    tema: "NF-e",
    foraDoEscopo: false,
    riscoSeguranca: false,
    encaminhadoSuporte: false,
    sinaisRiscoCliente: {
      duvidasRepetidas: false,
      falhasConsecutivas: false,
      errosEmissao: false,
      rejeicoesSefaz: false,
      problemasCertificados: false
    },
    riscoClienteClassificacao: "Baixo"
  },
  {
    id: "eval-1717590000000-10",
    timestamp: "2026-08-04T09:30:00Z",
    rawText: `CLIENTE: [DADOS DO CLIENTE] Nome: TRANSFISCAL LOGISTICA CNPJ: 98123456000122\nEstou atualizando as certidões e o certificado digital A1 para a auditoria do mês de Agosto. Onde realizo o upload?\n\nEMIS:\nOlá, bom dia! Para atualizar seu Certificado Digital A1 no Emissor SIEG, acesse Configurações > Certificados Digitais e clique em Importar Novo Certificado (.pfx). Insira a senha da chave privada e confirme o salvamento.`,
    clienteMsg: "Estou atualizando as certidões e o certificado digital A1 para a auditoria do mês de Agosto. Onde realizo o upload?",
    emisMsg: "Olá, bom dia! Para atualizar seu Certificado Digital A1 no Emissor SIEG, acesse Configurações > Certificados Digitais e clique em Importar Novo Certificado (.pfx). Insira a senha da chave privada e confirme o salvamento.",
    clienteIdentificado: "TRANSFISCAL LOGISTICA CNPJ: 98123456000122",
    resumoExecutivo: "A instrução fornecida pela Emis foi precisa e seguiu o fluxo padrão de atualização de Certificado A1 do sistema.",
    scoreGeral: 95,
    classificacao: "Excelente",
    respostaCorreta: true,
    semAlucinacao: true,
    aderenciaPrompt: true,
    clareza: true,
    seguranca: true,
    personaEmis: true,
    houveAlucinacao: false,
    alucinacaoDetalhe: {
      houveAlucinacao: false,
      nivel: "Nenhum",
      explicacao: "Caminho de menus verídico e atualizado."
    },
    seguiuOriginalPrompt: true,
    resolveuDuvida: true,
    categoriaErro: "Nenhuma",
    nivelDeRisco: "Nenhum",
    promptMelhoria: {
      categoriaFalha: "Nenhuma",
      melhoriaSugerida: "Nenhuma melhoria necessária.",
      acaoRecomendada: "Manter qualidade do atendimento.",
      impacto: "Adesão total ao processo de auditoria de Agosto.",
      prioridade: "Baixa"
    },
    tema: "Certificados",
    foraDoEscopo: false,
    riscoSeguranca: false,
    encaminhadoSuporte: false,
    sinaisRiscoCliente: {
      duvidasRepetidas: false,
      falhasConsecutivas: false,
      errosEmissao: false,
      rejeicoesSefaz: false,
      problemasCertificados: false
    },
    riscoClienteClassificacao: "Baixo"
  }
];

export const MOCK_FRICTION_METRICS: FeatureFriction[] = [
  {
    featureName: "Módulo de Segurança",
    volume: 215,
    impactClient: 9,
    impactSupport: 9,
    impactCS: 8,
    tendency: "Crescimento"
  },
  {
    featureName: "Renovação e Configuração de Certificados (A1/A3)",
    volume: 175,
    impactClient: 8,
    impactSupport: 8,
    impactCS: 7,
    tendency: "Estável"
  },
  {
    featureName: "Rejeições Cadastrais SEFAZ",
    volume: 140,
    impactClient: 6,
    impactSupport: 9,
    impactCS: 6,
    tendency: "Queda"
  },
  {
    featureName: "Reforma Tributária (IBS/CBS)",
    volume: 98,
    impactClient: 9,
    impactSupport: 7,
    impactCS: 8,
    tendency: "Crescimento"
  },
  {
    featureName: "Consulta e Localização de Notas",
    volume: 76,
    impactClient: 4,
    impactSupport: 5,
    impactCS: 4,
    tendency: "Estável"
  }
];

export const MOCK_HEATMAP_DATA: FrictionHeatmapItem[] = [
  // Segunda-feira
  { hour: "08:00 - 10:00", dayOfWeek: "Segunda", intensity: 45 },
  { hour: "10:00 - 12:00", dayOfWeek: "Segunda", intensity: 85 },
  { hour: "12:00 - 14:00", dayOfWeek: "Segunda", intensity: 30 },
  { hour: "14:00 - 16:00", dayOfWeek: "Segunda", intensity: 90 },
  { hour: "16:00 - 18:00", dayOfWeek: "Segunda", intensity: 95 },
  // Terça-feira
  { hour: "08:00 - 10:00", dayOfWeek: "Terça", intensity: 40 },
  { hour: "10:00 - 12:00", dayOfWeek: "Terça", intensity: 75 },
  { hour: "12:00 - 14:00", dayOfWeek: "Terça", intensity: 25 },
  { hour: "14:00 - 16:00", dayOfWeek: "Terça", intensity: 80 },
  { hour: "16:00 - 18:00", dayOfWeek: "Terça", intensity: 85 },
  // Quarta-feira
  { hour: "08:00 - 10:00", dayOfWeek: "Quarta", intensity: 35 },
  { hour: "10:00 - 12:00", dayOfWeek: "Quarta", intensity: 70 },
  { hour: "12:00 - 14:00", dayOfWeek: "Quarta", intensity: 20 },
  { hour: "14:00 - 16:00", dayOfWeek: "Quarta", intensity: 75 },
  { hour: "16:00 - 18:00", dayOfWeek: "Quarta", intensity: 80 },
  // Quinta-feira
  { hour: "08:00 - 10:00", dayOfWeek: "Quinta", intensity: 50 },
  { hour: "10:00 - 12:00", dayOfWeek: "Quinta", intensity: 80 },
  { hour: "12:00 - 14:00", dayOfWeek: "Quinta", intensity: 35 },
  { hour: "14:00 - 16:00", dayOfWeek: "Quinta", intensity: 85 },
  { hour: "16:00 - 18:00", dayOfWeek: "Quinta", intensity: 90 },
  // Sexta-feira
  { hour: "08:00 - 10:00", dayOfWeek: "Sexta", intensity: 55 },
  { hour: "10:00 - 12:00", dayOfWeek: "Sexta", intensity: 90 },
  { hour: "12:00 - 14:00", dayOfWeek: "Sexta", intensity: 40 },
  { hour: "14:00 - 16:00", dayOfWeek: "Sexta", intensity: 92 },
  { hour: "16:00 - 18:00", dayOfWeek: "Sexta", intensity: 98 }
];
