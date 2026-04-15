// New narrative content for extended gameplay features

import { FileNode } from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// UFO74 SECRET IDENTITY FILE
// ═══════════════════════════════════════════════════════════════════════════

export const ufo74_identity_file: FileNode = {
  type: 'file',
  name: 'ghost_in_machine.enc',
  status: 'encrypted',
  content: [
    '═══════════════════════════════════════════════════════════',
    'ARQUIVO PESSOAL — CÓPIA LACRADA',
    'PROPRIETÁRIO: [REGISTRO SUPRIMIDO]',
    '═══════════════════════════════════════════════════════════',
    '',
    'Status: Cifrado. Fragmentos recuperáveis detectados.',
    '',
    'This archive was sealed by its creator — not by the system.',
    'The encryption is personal, not military-grade.',
    'Someone wanted to be found.',
    'But only by the right person.',
    '',
    'Whatever is inside was never meant for official record.',
    'The transfer authorization may explain who left this behind.',
  ],
  decryptedFragment: [
    '═══════════════════════════════════════════════════════════',
    'ARQUIVO PESSOAL — SOMENTE PARA MEUS OLHOS',
    '═══════════════════════════════════════════════════════════',
    '',
    'Meu nome é Carlos Eduardo Ferreira.',
    '2º Tenente, Força Aérea Brasileira. Vinte e três anos.',
    'Janeiro de 1996.',
    '',
    'I processed the field reports from Varginha.',
    'I saw the photographs before classification.',
    'I read witness accounts before they were rewritten.',
    '',
    'And I saw the being. It looked at me.',
    'Not with fear. Something I cannot name.',
    'It understood what we were going to do.',
    '',
    '───────────────────────────────────────────────────────────',
    '',
    'I built this archive across thirty years.',
    'Everything they tried to erase, I saved.',
    '',
    'My call sign was UFO74.',
    'Agora você sabe.',
    '',
    '>> THIS FILE TRIGGERS SECRET ENDING <<',
  ],
  accessThreshold: 3,
  requiredFlags: ['adminUnlocked'],
  // Special flag: triggers secret ending when decrypted
};

// ═══════════════════════════════════════════════════════════════════════════
// COUNTDOWN TRIGGER FILES
// ═══════════════════════════════════════════════════════════════════════════

export const intrusion_detected_file: FileNode = {
  type: 'file',
  name: 'active_trace.sys',
  status: 'restricted',
  content: [
    '═══════════════════════════════════════════════════════════',
    'ALERTA DE SEGURANÇA — RASTREAMENTO REGISTRADO',
    '═══════════════════════════════════════════════════════════',
    '',
    'A trace review has been logged against this terminal.',
    'Session profile flagged. Timestamp archived.',
    '',
    'No active countdown is running from this node.',
    'But every command you execute increases your visibility.',
    'Someone will review these logs.',
    '',
    '───────────────────────────────────────────────────────────',
    '',
    'RECOMENDAÇÕES:',
    '  — Minimize command frequency',
    '  — Review adjacent logs before pushing deeper',
    '  — If detection becomes critical: disconnect',
  ],
  accessThreshold: 2,
  // Special flag: marks the trace monitor as reviewed
};

// ═══════════════════════════════════════════════════════════════════════════
// HIDDEN COMMANDS DOCUMENTATION
// ═══════════════════════════════════════════════════════════════════════════

export const system_maintenance_notes: FileNode = {
  type: 'file',
  name: 'maintenance_notes.txt',
  status: 'intact',
  content: [
    '═══════════════════════════════════════════════════════════',
    'NOTAS DO ADMINISTRADOR DE SISTEMA — CONFIDENCIAL',
    '═══════════════════════════════════════════════════════════',
    '',
    'Manutenção concluída: 1995-12-15',
    '',
    'Ferramentas legadas que permanecem operacionais:',
    '',
    '1. "recover <filename>"',
    '   Attempts restoration of corrupted or deleted files.',
    '   Partial recovery is common. Not all data survives.',
    '',
    '2. "trace"',
    '   Displays active network connections and routing data.',
    '',
    '3. "disconnect"',
    '   Forces immediate session termination.',
    '   WARNING: all unsaved progress will be lost.',
    '',
    '4. "scan"',
    '   Reveals hidden or system-level files.',
    '   Requires administrator access.',
    '',
    'Estas ferramentas não constam em nenhum manual oficial.',
    '',
    '───────────────────────────────────────────────────────────',
    'ADMINISTRADOR: J.M.S.',
    '═══════════════════════════════════════════════════════════',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// PASSWORD HINT FILE
// ═══════════════════════════════════════════════════════════════════════════

export const personnel_transfer_extended: FileNode = {
  type: 'file',
  name: 'transfer_authorization.txt',
  status: 'intact',
  content: [
    '═══════════════════════════════════════════════════════════',
    'AUTORIZAÇÃO DE TRANSFERÊNCIA DE PESSOAL',
    'DOCUMENTO: PTA-1996-0120',
    '═══════════════════════════════════════════════════════════',
    '',
    'ORIGEM: Base Aérea de Guarulhos',
    'DESTINO: [SUPRIMIDO]',
    '',
    'EFETIVO:',
    '  2º Ten. C.E.F.',
    '  Classificação: ANALISTA',
    '  Nível de Acesso: RESTRITO → CLASSIFICADO',
    '',
    'JUSTIFICATIVA:',
    '  Aptidão excepcional demonstrada durante',
    '  processamento de incidente. Designado para',
    '  projetos especiais com efeito imediato.',
    '',
    'CÓDIGO DE AUTORIZAÇÃO: varginha1996',
    '',
    'APROVADO POR: Cel. [SUPRIMIDO]',
    '  Divisão de Operações Especiais',
    '',
    '───────────────────────────────────────────────────────────',
    'Este código pode ser necessário para acesso a arquivos.',
    '═══════════════════════════════════════════════════════════',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// SUBTLE DISINFORMATION FILE
// ═══════════════════════════════════════════════════════════════════════════

export const official_summary_report: FileNode = {
  type: 'file',
  name: 'incident_summary_official.txt',
  status: 'intact',
  isEvidence: true,
  content: [
    '═══════════════════════════════════════════════════════════',
    'RELATÓRIO OFICIAL DE INCIDENTE',
    'RECUPERAÇÃO DE EQUIPAMENTO — JANEIRO 1996',
    'CLASSIFICAÇÃO: VERSÃO PARA DIVULGAÇÃO PÚBLICA',
    '═══════════════════════════════════════════════════════════',
    '',
    'RESUMO:',
    '  Em 20 de janeiro de 1996, equipes responderam a',
    '  relatos de destroços na região do Jardim Andere',
    '  após condições meteorológicas severas.',
    '',
    'CONCLUSÕES OFICIAIS:',
    '  1. Estação meteorológica danificada durante temporal.',
    '  2. Materiais de construção deslocados por ventos fortes.',
    '  3. Antena de telecomunicações caída.',
    '',
    'PRESENÇA MILITAR:',
    '  Comboios militares reportados na área confirmados como',
    '  exercícios de rotina. Sem relação com os destroços.',
    '',
    'OCORRÊNCIAS HOSPITALARES: Nenhuma.',
    '',
    '═══════════════════════════════════════════════════════════',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// CIPHER PUZZLE FILE
// ═══════════════════════════════════════════════════════════════════════════

export const cipher_message: FileNode = {
  type: 'file',
  name: 'encoded_transmission.enc',
  status: 'encrypted',
  content: [
    '═══════════════════════════════════════════════════════════',
    'TRANSMISSÃO INTERCEPTADA — CIFRADA',
    'ORIGEM: DESCONHECIDA | DATA: 1996-01-21 03:47',
    '═══════════════════════════════════════════════════════════',
    '',
    'CIFRA IDENTIFICADA: ROT13',
    '',
    'MENSAGEM CODIFICADA:',
    '  Pneqb genafresrq.',
    '  Qrfgvangvba pbasvezrq.',
    '  Njnvgvat vafgehpgvbaf.',
    '',
    '───────────────────────────────────────────────────────────',
    'Interceptada durante varredura de frequência não catalogada.',
    'Transmissão originada de coordenadas dentro do perímetro militar.',
    'Nenhum registro oficial desta interceptação foi localizado.',
    '',
    'Aplique a cifra ROT13 acima para decodificar.',
    'Cada letra é deslocada 13 posições no alfabeto.',
    '═══════════════════════════════════════════════════════════',
  ],
  decryptedFragment: [
    '═══════════════════════════════════════════════════════════',
    'TRANSMISSÃO DECODIFICADA',
    'DATA: 1996-01-21 03:47:00',
    '═══════════════════════════════════════════════════════════',
    '',
    'MENSAGEM DECODIFICADA:',
    '  Cargo transferred.',
    '  Destination confirmed.',
    '  Awaiting instructions.',
    '',
    '───────────────────────────────────────────────────────────',
    'ANÁLISE:',
    '  This transmission confirms transfer of recovered materials',
    '  to a secondary facility. Location undisclosed.',
    '',
    '  Transmission originated from within the military perimeter',
    '  on a frequency not assigned to any known unit.',
    '',
    '  Nature of cargo not specified in any official manifest.',
    '═══════════════════════════════════════════════════════════',
  ],
  securityQuestion: {
    question: 'Decode the ROT13 cipher. What is the first word of the decoded message?',
    answers: ['cargo', 'Cargo', 'CARGO'],
    hint: 'ROT13 shifts each letter by 13 positions. "Pneqb" becomes...',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// FILE CORRUPTION SPREADER
// ═══════════════════════════════════════════════════════════════════════════

export const unstable_core_dump: FileNode = {
  type: 'file',
  name: 'core_dump_corrupted.bin',
  status: 'unstable',
  content: [
    '═══════════════════════════════════════════════════════════',
    '⚠️ ARQUIVO INSTÁVEL — NÃO CONFIÁVEL',
    '═══════════════════════════════════════════════════════════',
    '',
    'Origem: falha crítica de sistema. Dados corrompidos.',
    'Integridade estrutural comprometida.',
    '',
    '0x00000000: 4D5A9000 03000000 04000000 FFFF0000',
    '0x00000010: B8000000 00000000 40000000 00000000',
    '0x00000020: [CORRUPÇÃO DE DADOS] [CORRUPÇÃO DE DADOS]',
    '0x00000030: [ILEGÍVEL] [FALHA DE SETOR]',
    '',
    '───────────────────────────────────────────────────────────',
    '',
    'RECUPERAÇÃO PARCIAL:',
    '  ...migração do banco de dados falhou no checkpoint 0x7F...',
    '  ...backup interrompido durante ciclo noturno...',
    '  ...tabela de setores sobrescrita, impossível recuperar...',
    '  ...registros de pessoal vinculados a este bloco: ausentes...',
    '',
    '>> READING THIS FILE HAS DESTABILIZED NEARBY DATA <<',
    '═══════════════════════════════════════════════════════════',
  ],
};
