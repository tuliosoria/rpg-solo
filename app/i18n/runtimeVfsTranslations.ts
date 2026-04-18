import * as vfs from '../data/virtualFileSystem';
import type { Language } from './index';

type RuntimeDictionary = Record<string, string>;

const ptBrTranslations: RuntimeDictionary = {};
const esTranslations: RuntimeDictionary = {};

function isNonTranslatableLine(text: string): boolean {
  return text.trim() === '' || /^[\s]*[═─▓█]+[\s]*$/.test(text);
}

function dedentBlock(text: string): string[] {
  const normalized = text.replace(/^\n/, '').replace(/\n\s*$/, '');
  if (!normalized) return [];

  const lines = normalized.split('\n');
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^\s*/)?.[0].length ?? 0);
  const commonIndent = indents.length > 0 ? Math.min(...indents) : 0;

  return lines.map((line) => line.slice(commonIndent));
}

function registerLines(sourceLines: readonly string[], ptBlock: string, esBlock: string): void {
  const keys = sourceLines.filter((line) => !isNonTranslatableLine(line));
  const ptLines = dedentBlock(ptBlock);
  const esLines = dedentBlock(esBlock);

  if (keys.length !== ptLines.length || keys.length !== esLines.length) {
    throw new Error(
      `Translation line count mismatch. Expected ${keys.length}, got pt=${ptLines.length}, es=${esLines.length}.`
    );
  }

  keys.forEach((key, index) => {
    ptBrTranslations[key] = ptLines[index];
    esTranslations[key] = esLines[index];
  });
}

// ============================================================
// VFS File Content Translations - 105 files (PT-BR + ES)
// ============================================================

// --- Batch 1 (26 files) ---

registerLines(
  vfs.incident_review_protocol.content,
  `
  PROCEDIMENTO OPERACIONAL PADRÃO — REVISÃO DE INCIDENTES
  SOP-IR-1989 (REV. 1994) — USO INTERNO
  Este protocolo rege a reconstrução pós-incidente
  via acesso a terminal de arquivos.
  DIMENSÕES DA REVISÃO:
    1. Ativos físicos — recuperação, transporte, disposição
    2. Comunicações — interceptações, ligação, contato estrangeiro
    3. Supervisão — cadeias de autorização, multiagência
    4. Risco futuro — modelos de recorrência, contingências
  Revisões devem demonstrar correlação interdimensional.
  Revisões parciais: INCOMPLETAS. Revisões incoerentes: sinalizadas.
  Espere barreiras de classificação.
  Alguns materiais requerem autorização elevada ou decodificação.
  Discrepâncias entre registros oficiais e brutos
  devem ser anotadas, mas não discutidas fora deste terminal.
  `,
  `
  PROCEDIMIENTO OPERATIVO ESTÁNDAR — REVISIÓN DE INCIDENTES
  SOP-IR-1989 (REV. 1994) — USO INTERNO
  Este protocolo rige la reconstrucción post-incidente
  mediante acceso a terminal de archivos.
  DIMENSIONES DE REVISIÓN:
    1. Activos físicos — recuperación, transporte, disposición
    2. Comunicaciones — interceptaciones, enlace, contacto extranjero
    3. Supervisión — cadenas de autorización, multiagencia
    4. Riesgo futuro — modelos de recurrencia, contingencias
  Las revisiones deben demostrar correlación interdimensional.
  Revisiones parciales: INCOMPLETAS. Revisiones incoherentes: señaladas.
  Espere barreras de clasificación.
  Algunos materiales requieren autorización elevada o descifrado.
  Discrepancias entre registros oficiales y crudos
  deben anotarse pero no discutirse fuera de este terminal.
  `
);

registerLines(
  vfs.session_objectives_memo.content,
  `
  ACESSO AO TERMINAL — PARÂMETROS DA SESSÃO
  GERADO AUTOMATICAMENTE NO LOGIN
  TIPO DE ACESSO: Terminal de Revisão (Arquivo Legado)
  CLASSE DA SESSÃO: Reconstrução de Incidente
  Este terminal fornece acesso somente-leitura a registros
  de incidentes arquivados. A atividade da sessão é registrada.
  FLUXO DE TRABALHO:
    1. Navegar diretórios para registros relevantes
    2. Examinar arquivos para detalhes do incidente
    3. Seguir senhas solicitadas em arquivos protegidos quando autorizado
    4. Cruzar referências de fontes para correlação
  Acesso aleatório a arquivos sem correlação pode acionar
  monitoramento da sessão como comportamento anômalo.
  `,
  `
  ACCESO AL TERMINAL — PARÁMETROS DE SESIÓN
  GENERADO AUTOMÁTICAMENTE AL INICIAR SESIÓN
  TIPO DE ACCESO: Terminal de Revisión (Archivo Legado)
  CLASE DE SESIÓN: Reconstrucción de Incidente
  Este terminal proporciona acceso de solo lectura a registros
  de incidentes archivados. La actividad de la sesión se registra.
  FLUJO DE TRABAJO:
    1. Navegar directorios para registros relevantes
    2. Examinar archivos para detalles del incidente
    3. Seguir contraseñas solicitadas en archivos protegidos cuando autorizado
    4. Cruzar referencias de fuentes para correlación
  Acceso aleatorio a archivos sin correlación puede activar
  monitoreo de la sesión como comportamiento anómalo.
  `
);

registerLines(
  vfs.facilities_memo_12.content,
  `
  MEMORANDO INTERNO — DIVISÃO DE INSTALAÇÕES
  DATA: 15-JAN-1996
  RE: Horário do Refeitório
  A partir de 20-JAN-1996, horários do refeitório ajustados:
    Café da manhã: 06:30 - 08:30
    Almoço: 11:30 - 13:30
    Jantar: SUSPENSO ATÉ NOVA ORDEM
  Pessoal de turno estendido pode solicitar vales
  no Escritório Administrativo, Sala 204.
  Máquinas de venda do Piso 3 permanecem 24h.
  Máquinas de venda do subsolo agora restritas.
  Instalações ramal 2240
  `,
  `
  MEMORANDO INTERNO — DIVISIÓN DE INSTALACIONES
  FECHA: 15-JAN-1996
  RE: Horario del Comedor
  A partir del 20-JAN-1996, horarios del comedor ajustados:
    Desayuno: 06:30 - 08:30
    Almuerzo: 11:30 - 13:30
    Cena: SUSPENDIDA HASTA NUEVO AVISO
  Personal de turno extendido puede solicitar vales
  en la Oficina Administrativa, Sala 204.
  Máquinas expendedoras del Piso 3 permanecen 24h.
  Máquinas expendedoras del sótano ahora restringidas.
  Instalaciones ext. 2240
  `
);

registerLines(
  vfs.parking_allocation_jan96.content,
  `
  ALOCAÇÃO DE ESTACIONAMENTO — JANEIRO 1996
  SERVIÇOS ADMINISTRATIVOS
  LOTE A (Reservado): A-01 a A-20.
    Diretores e oficiais visitantes.
  LOTE B (Geral): Ordem de chegada. Portões fecham 22:00.
  AVISO: Lote B Seção 3 fechada a partir de 21-JAN.
  Recapeamento. Duração: 5 dias úteis.
  Lote C requisitado para estacionamento de veículos não identificados.
  Não se aproximar após 20:00.
  Excedente no estacionamento municipal, 200m a leste.
  `,
  `
  ASIGNACIÓN DE ESTACIONAMIENTO — ENERO 1996
  SERVICIOS ADMINISTRATIVOS
  LOTE A (Reservado): A-01 a A-20.
    Directores y funcionarios visitantes.
  LOTE B (General): Orden de llegada. Portones cierran 22:00.
  AVISO: Lote B Sección 3 cerrada desde 21-JAN.
  Repavimentación. Duración: 5 días hábiles.
  Lote C requisado para estacionamiento de vehículos sin identificar.
  No aproximarse después de las 20:00.
  Excedente en estacionamiento municipal, 200m al este.
  `
);

registerLines(
  vfs.budget_request_q1_96.content,
  `
  SOLICITAÇÃO ORÇAMENTÁRIA — Q1 1996
  Inteligência Regional (Setor 7)
  SUBMETIDO: 08-JAN-1996
    Pessoal:       R$ 142.000,00
    Equipamento:   R$  38.500,00
    Viagem:        R$  21.200,00
    Manutenção:    R$  15.800,00
    Diversos:      R$   8.500,00
    TOTAL:         R$ 226.000,00
  JUSTIFICATIVA: Operações de rotina.
  Nenhum projeto especial previsto.
  STATUS: PENDENTE
  NOTA: Submetido ANTES do incidente de 20-JAN.
  Solicitação suplementar a seguir.
  Valor: [CLASSIFICADO].
  `,
  `
  SOLICITUD PRESUPUESTARIA — Q1 1996
  Inteligencia Regional (Sector 7)
  PRESENTADO: 08-JAN-1996
    Personal:      R$ 142.000,00
    Equipamiento:  R$  38.500,00
    Viaje:         R$  21.200,00
    Mantenimiento: R$  15.800,00
    Varios:        R$   8.500,00
    TOTAL:         R$ 226.000,00
  JUSTIFICACIÓN: Operaciones de rutina.
  Ningún proyecto especial previsto.
  STATUS: PENDIENTE
  NOTA: Presentado ANTES del incidente de 20-JAN.
  Solicitud suplementaria a seguir.
  Monto: [CLASIFICADO].
  `
);

registerLines(
  vfs.intercept_summary_dec95.content,
  `
  RESUMO DE INTERCEPTAÇÕES — DEZEMBRO 1995
  REGIÃO: Divisa Minas Gerais / São Paulo
  CLASSIFICAÇÃO: ROTINA
  Total de interceptações: 47. Sinalizadas: 3.
  Inteligência acionável: 0.
  Discussões sobre preços agrícolas (12).
  Comunicações pessoais (28). Comerciais (5).
  Comentários políticos (2).
  Nenhuma atividade incomum detectada.
  Recomenda-se manter nível atual de monitoramento.
  ANALISTA: J.S. RIBEIRO
  NOTA: Analista Ribeiro foi remanejado em 22-JAN.
  Nenhum substituto designado.
  `,
  `
  RESUMEN DE INTERCEPTACIONES — DICIEMBRE 1995
  REGIÓN: Frontera Minas Gerais / São Paulo
  CLASIFICACIÓN: RUTINA
  Total de interceptaciones: 47. Señaladas: 3.
  Inteligencia accionable: 0.
  Discusiones sobre precios agrícolas (12).
  Comunicaciones personales (28). Comerciales (5).
  Comentarios políticos (2).
  Ninguna actividad inusual detectada.
  Se recomienda mantener nivel actual de monitoreo.
  ANALISTA: J.S. RIBEIRO
  NOTA: Analista Ribeiro fue reasignado el 22-JAN.
  Ningún reemplazo designado.
  `
);

registerLines(
  vfs.morse_intercept.content,
  `
  INTERCEPTAÇÃO DE SINAL — CAPTURA DE ÁUDIO
  DATA: 20-JAN-1996 03:47 LOCAL
  CLASSIFICAÇÃO: RESTRITO
  TIPO: Transmissão em código Morse
  FREQUÊNCIA: 7.125 MHz (não autorizada)
  ÁUDIO: /audio/morse_intercept.wav
  SINAL BRUTO:
    -.-. --- .-.. .... . .. - .-
  REFERÊNCIA MORSE:
    A: .-    H: ....   O: ---
    B: -...  I: ..     P: .--.
    C: -.-.  J: .---   R: .-.
    D: -..   K: -.-    S: ...
    E: .     L: .-..   T: -
    F: ..-.  M: --     U: ..-
    G: --.   N: -.     V: ...-
  Decodificação pode revelar senha de acesso.
  `,
  `
  INTERCEPTACIÓN DE SEÑAL — CAPTURA DE AUDIO
  FECHA: 20-JAN-1996 03:47 LOCAL
  CLASIFICACIÓN: RESTRINGIDO
  TIPO: Transmisión en código Morse
  FRECUENCIA: 7.125 MHz (no autorizada)
  AUDIO: /audio/morse_intercept.wav
  SEÑAL CRUDA:
    -.-. --- .-.. .... . .. - .-
  REFERENCIA MORSE:
    A: .-    H: ....   O: ---
    B: -...  I: ..     P: .--.
    C: -.-.  J: .---   R: .-.
    D: -..   K: -.-    S: ...
    E: .     L: .-..   T: -
    F: ..-.  M: --     U: ..-
    G: --.   N: -.     V: ...-
  Decodificación puede revelar contraseña de acceso.
  `
);

registerLines(
  vfs.hvac_maintenance_log.content,
  `
  REGISTRO DE MANUTENÇÃO HVAC — EDIFÍCIO 3
  PERÍODO: 01-JAN a 31-JAN-1996
  03-JAN: Troca de filtros, Piso 2 (rotina)
  07-JAN: Inspeção do compressor, Cobertura A (aprovado)
  12-JAN: Calibração do termostato, Sala 317 (+2C)
  18-JAN: Limpeza de dutos, nível Subsolo (concluída)
  22-JAN: EMERGÊNCIA — Falha no armazenamento frio do subsolo
    Causa: Surto de energia. Gerador acionado.
    Duração da interrupção: 4 horas.
    Conteúdo afetado: CLASSIFICADO
    Excursão de temperatura: CLASSIFICADO
  25-JAN: Armazenamento frio reparado. Testes satisfatórios.
  28-JAN: Inspeção de rotina, todos os pisos.
  TÉCNICO: M. CARVALHO
  NOTA: Carvalho solicitou transferência em 29-JAN.
  Motivo citado: "pessoal."
  `,
  `
  REGISTRO DE MANTENIMIENTO HVAC — EDIFICIO 3
  PERÍODO: 01-JAN a 31-JAN-1996
  03-JAN: Reemplazo de filtros, Piso 2 (rutina)
  07-JAN: Inspección del compresor, Azotea A (aprobado)
  12-JAN: Calibración del termostato, Sala 317 (+2C)
  18-JAN: Limpieza de ductos, nivel Sótano (completada)
  22-JAN: EMERGENCIA — Falla en almacenamiento frío del sótano
    Causa: Sobrecarga eléctrica. Generador activado.
    Duración de la interrupción: 4 horas.
    Contenido afectado: CLASIFICADO
    Excursión de temperatura: CLASIFICADO
  25-JAN: Almacenamiento frío reparado. Pruebas satisfactorias.
  28-JAN: Inspección de rutina, todos los pisos.
  TÉCNICO: M. CARVALHO
  NOTA: Carvalho solicitó transferencia el 29-JAN.
  Motivo citado: "personal."
  `
);

registerLines(
  vfs.personnel_transfer_notice.content,
  `
  AVISO DE TRANSFERÊNCIA DE PESSOAL
  VIGÊNCIA: 01-FEB-1996
  As seguintes transferências estão confirmadas:
    CPT. R. FERREIRA → Brasília (Comando Central)
    SGT. A. LIMA → São Paulo (Escritório de Ligação)
    ANALISTA M. COSTA → [DESTINO CLASSIFICADO]
  Entrevistas de desligamento agendadas para 30-JAN.
  Todos os três recusaram entrevista de desligamento.
  Credenciais de acesso revogadas 01-FEB 00:00.
  NOTA: Ferreira solicitou que itens pessoais fossem
  enviados. Não retirados pessoalmente.
  Andrade assume processos pendentes de substituição.
  Pessoal substituto: NENHUM DESIGNADO.
  `,
  `
  AVISO DE TRANSFERENCIA DE PERSONAL
  VIGENCIA: 01-FEB-1996
  Las siguientes transferencias están confirmadas:
    CPT. R. FERREIRA → Brasília (Comando Central)
    SGT. A. LIMA → São Paulo (Oficina de Enlace)
    ANALISTA M. COSTA → [DESTINO CLASIFICADO]
  Entrevistas de desvinculación programadas para 30-JAN.
  Los tres rechazaron entrevista de desvinculación.
  Credenciales de acceso revocadas 01-FEB 00:00.
  NOTA: Ferreira solicitó que sus artículos personales fueran
  enviados. No recogidos en persona.
  Andrade asume expedientes pendientes de reemplazo.
  Personal de reemplazo: NINGUNO ASIGNADO.
  `
);

registerLines(
  vfs.regional_summary_jan96.content,
  `
  RESUMO DE INTELIGÊNCIA REGIONAL — JAN 1996
  SETOR: Triângulo Mineiro
  ITENS PRIORITÁRIOS: NENHUM (ver adendo)
  MONITORAMENTO DE ROTINA:
    - Atividade trabalhista: Níveis sazonais normais
    - Agricultura: Preços da soja estáveis
    - Travessias de fronteira: Dentro dos parâmetros
  ANOMALIAS:
    17-JAN: Rádio não autorizado próximo a Uberaba.
      Avaliação: Operador amador. Advertência emitida.
    19-JAN: Carga não programada, depósito regional.
      Avaliação: Erro de documentação. Corrigido.
    20-JAN: Múltiplos relatos civis de fenômenos
      aéreos ao sul de Varginha.
      Avaliação: Balão meteorológico.
      [Avaliação revogada pelo Comando do Setor]
  Nenhum item requer escalação.
  `,
  `
  RESUMEN DE INTELIGENCIA REGIONAL — ENE 1996
  SECTOR: Triângulo Mineiro
  ELEMENTOS PRIORITARIOS: NINGUNO (ver adenda)
  MONITOREO DE RUTINA:
    - Actividad laboral: Niveles estacionales normales
    - Agricultura: Precios de soja estables
    - Cruces fronterizos: Dentro de parámetros
  ANOMALÍAS:
    17-JAN: Radio no autorizada cerca de Uberaba.
      Evaluación: Operador amateur. Advertencia emitida.
    19-JAN: Carga no programada, depósito regional.
      Evaluación: Error de documentación. Corregido.
    20-JAN: Múltiples reportes civiles de fenómenos
      aéreos al sur de Varginha.
      Evaluación: Globo meteorológico.
      [Evaluación revocada por Comando del Sector]
  Ningún elemento requiere escalamiento.
  `
);

registerLines(
  vfs.asset_transfer_form_incomplete.content,
  `
  FORMULÁRIO DE TRANSFERÊNCIA DE ATIVOS — ATF-1996-0023
  STATUS: INCOMPLETO — DEVOLVIDO
  TRANSFERÊNCIA DE: HOLDING-7
  TRANSFERÊNCIA PARA: [CAMPO EM BRANCO]
  DATA: 24-JAN-1996
  ITENS:
    1x Contêiner, lacrado, 45kg — classificação biológica
    1x Maleta, documentos, classificados
  ERRO: Assinatura da parte receptora AUSENTE
  ERRO: Código de autorização INVÁLIDO
  ERRO: Código de destino NÃO RECONHECIDO
  Formulário devolvido ao originador. Transferência pendente.
  ESCRITURÁRIO: T. SANTOS
  NOTA: Santos relatou temperatura incomum
  emanando do contêiner lacrado.
  Relatório registrado, depois retirado no mesmo dia.
  `,
  `
  FORMULARIO DE TRANSFERENCIA DE ACTIVOS — ATF-1996-0023
  STATUS: INCOMPLETO — DEVUELTO
  TRANSFERENCIA DESDE: HOLDING-7
  TRANSFERENCIA A: [CAMPO EN BLANCO]
  FECHA: 24-JAN-1996
  ARTÍCULOS:
    1x Contenedor, sellado, 45kg — clasificación biológica
    1x Maletín, documentos, clasificados
  ERROR: Firma de la parte receptora AUSENTE
  ERROR: Código de autorización INVÁLIDO
  ERROR: Código de destino NO RECONOCIDO
  Formulario devuelto al originador. Transferencia pendiente.
  ESCRIBIENTE: T. SANTOS
  NOTA: Santos reportó temperatura inusual
  emanando del contenedor sellado.
  Informe registrado, luego retirado el mismo día.
  `
);

registerLines(
  vfs.tmp_note_deleted.content,
  `
  NOTA PESSOAL — NÃO ARQUIVAR
  Lembrar:
    - Buscar roupa na lavanderia quinta
    - Ligar para mãe, aniversário
    - Perguntar IT sobre impressora Floor 2
  Notas da reunião (apagar depois):
    O Diretor estava branco como papel hoje.
    Disse que "carga especial" precisa de acomodação.
    Subsolo. Com controle de temperatura.
    Ninguém nos conta nada.
    Ouvi Carvalho dizer que algo cheirava mal
    lá embaixo. Como amônia e terra molhada.
    Ele parecia assustado. Realmente assustado.
  `,
  `
  NOTA PERSONAL — NO ARCHIVAR
  Recordar:
    - Recoger ropa en la lavandería el jueves
    - Llamar a mamá, cumpleaños
    - Preguntar a IT sobre impresora Floor 2
  Notas de la reunión (borrar después):
    El Director estaba blanco como el papel hoy.
    Dijo que "carga especial" necesita alojamiento.
    Sótano. Con control de temperatura.
    Nadie nos dice nada.
    Escuché a Carvalho decir que algo olía mal
    allá abajo. Como amoníaco y tierra húmeda.
    Parecía asustado. Realmente asustado.
  `
);

registerLines(
  vfs.office_supplies_request.content,
  `
  SOLICITAÇÃO DE MATERIAIS — JANEIRO 1996
  DEPTO: Registros e Arquivos
    - Canetas, esferográfica, azul (caixa de 50)
    - Papel, A4, 80gsm (10 resmas)
    - Grampos, padrão (5 caixas)
    - Pastas, manila (100 unidades)
    - Corretivo líquido (12 frascos)
    - Marcadores pretos, permanentes (24 unidades)
  JUSTIFICATIVA: Reposição trimestral padrão.
  Marcadores pretos para redação conforme nova diretriz.
  APROVADO: M. SANTOS
  Nota manuscrita na margem:
  "Nunca usamos tanto corretivo líquido
  antes. O que estão reescrevendo?" —sem assinatura
  Ver também: badge_renewal_memo.txt (nível ULTRAVIOLET)
  `,
  `
  SOLICITUD DE MATERIALES — ENERO 1996
  DEPTO: Registros y Archivos
    - Bolígrafos, esferográfico, azul (caja de 50)
    - Papel, A4, 80gsm (10 resmas)
    - Grapas, estándar (5 cajas)
    - Carpetas, manila (100 unidades)
    - Corrector líquido (12 frascos)
    - Marcadores negros, permanentes (24 unidades)
  JUSTIFICACIÓN: Reposición trimestral estándar.
  Marcadores negros para redacción según nueva directiva.
  APROBADO: M. SANTOS
  Nota manuscrita al margen:
  "Nunca usamos tanto corrector líquido
  antes. ¿Qué están reescribiendo?" —sin firma
  Ver también: badge_renewal_memo.txt (nivel ULTRAVIOLET)
  `
);

registerLines(
  vfs.employee_birthday_list.content,
  `
  ANIVERSÁRIOS DO PESSOAL — JANEIRO 1996
  Comitê Social
    03-JAN: SANTOS, Maria (Admin)
    08-JAN: OLIVEIRA, Paulo (Instalações)
    12-JAN: RIBEIRO, Ana (Registros)
    17-JAN: FERREIRA, João (Segurança)
    24-JAN: [SUPRIMIDO] (Ops)
    29-JAN: COSTA, Lucia (Recepção)
  Contribuições para bolo são voluntárias.
  Lista de inscrição na sala de descanso.
  NOTA: Comemoração de 24-JAN cancelada.
  Todo o andar de Ops com acesso restrito.
  Nenhuma explicação fornecida.
  `,
  `
  CUMPLEAÑOS DEL PERSONAL — ENERO 1996
  Comité Social
    03-JAN: SANTOS, Maria (Admin)
    08-JAN: OLIVEIRA, Paulo (Instalaciones)
    12-JAN: RIBEIRO, Ana (Registros)
    17-JAN: FERREIRA, João (Seguridad)
    24-JAN: [SUPRIMIDO] (Ops)
    29-JAN: COSTA, Lucia (Recepción)
  Contribuciones para pastel son voluntarias.
  Hoja de inscripción en la sala de descanso.
  NOTA: Celebración de 24-JAN cancelada.
  Toda la planta de Ops con acceso restringido.
  Ninguna explicación proporcionada.
  `
);

registerLines(
  vfs.telephone_directory.content,
  `
  LISTA TELEFÔNICA — 1996
  ADMINISTRAÇÃO:
    Gabinete do Diretor ........... ramal 2001
    Vice-Diretor .................. ramal 2002
    Serviços Administrativos ...... ramal 2100
  OPERAÇÕES:
    Centro de Operações (24h) ..... ramal 3000
    Coordenação de Campo .......... ramal 3100
    Pool de Transporte ............ ramal 3200
  APOIO:
    Suporte de TI ................. ramal 4000
    Instalações ................... ramal 4100
    Médico (B-3) .................. ramal 4200
    Ala de Contenção .............. ramal 4500
    [RESTRITO] .................... ramal 9999
  EMERGÊNCIA: Disque 0 para linha externa.
  Ramal 9999 requer autorização por voz.
  Não tente sem autorização.
  `,
  `
  DIRECTORIO TELEFÓNICO — 1996
  ADMINISTRACIÓN:
    Oficina del Director .......... ext. 2001
    Subdirector ................... ext. 2002
    Servicios Administrativos ..... ext. 2100
  OPERACIONES:
    Centro de Operaciones (24h) ... ext. 3000
    Coordinación de Campo ......... ext. 3100
    Pool de Transporte ............ ext. 3200
  APOYO:
    Soporte de TI ................. ext. 4000
    Instalaciones ................. ext. 4100
    Médico (B-3) .................. ext. 4200
    Ala de Contención ............. ext. 4500
    [RESTRINGIDO] ................ ext. 9999
  EMERGENCIA: Marque 0 para línea externa.
  Ext. 9999 requiere autorización por voz.
  No intente sin autorización.
  `
);

registerLines(
  vfs.vehicle_mileage_log.content,
  `
  REGISTRO DE QUILOMETRAGEM DE VEÍCULOS — JANEIRO 1996
  FROTA: GOL 1.0 (Placa: AAB-1234)
  DATA       MOTORISTA     INÍCIO   FIM      DESTINO
  02-JAN    SILVA, R.     45.230   45.248   Centro da cidade
  05-JAN    COSTA, M.     45.248   45.312   Aeroporto
  09-JAN    LIMA, A.      45.312   45.340   Escritório regional
  15-JAN    SANTOS, P.    45.340   45.356   Fornecedor
  19-JAN    [CLASSIFICADO]  45.356   45.498   [CLASSIFICADO]
  20-JAN    [CLASSIFICADO]  45.498   45.512   [CLASSIFICADO]
  21-JAN    [CLASSIFICADO]  45.512   45.687   [CLASSIFICADO]
  23-JAN    COSTA, M.     45.687   45.720   Aeroporto
  NOTA: 175km em uma viagem classificada (19-JAN).
  Veículo devolvido com manchas no interior.
  Ordem de limpeza: PRIORIDADE / SEM FORNECEDOR EXTERNO.
  Ref. cruzada: transport_log_96.txt
  `,
  `
  REGISTRO DE KILOMETRAJE DE VEHÍCULOS — ENERO 1996
  FLOTA: GOL 1.0 (Placa: AAB-1234)
  FECHA      CONDUCTOR     INICIO   FIN      DESTINO
  02-JAN    SILVA, R.     45.230   45.248   Centro de la ciudad
  05-JAN    COSTA, M.     45.248   45.312   Aeropuerto
  09-JAN    LIMA, A.      45.312   45.340   Oficina regional
  15-JAN    SANTOS, P.    45.340   45.356   Proveedor
  19-JAN    [CLASIFICADO]  45.356   45.498   [CLASIFICADO]
  20-JAN    [CLASIFICADO]  45.498   45.512   [CLASIFICADO]
  21-JAN    [CLASIFICADO]  45.512   45.687   [CLASIFICADO]
  23-JAN    COSTA, M.     45.687   45.720   Aeropuerto
  NOTA: 175km en un viaje clasificado (19-JAN).
  Vehículo devuelto con manchas en el interior.
  Orden de limpieza: PRIORIDAD / SIN PROVEEDOR EXTERNO.
  Ref. cruzada: transport_log_96.txt
  `
);

registerLines(
  vfs.printer_queue_notice.content,
  `
  AVISO DO DEPARTAMENTO DE TI
  RE: Impressora do Piso 2
  DATA: 16-JAN-1996
  A HP LaserJet do Piso 2 está com atolamentos de papel.
  Alternativa:
    - Impressora matricial, Sala 215
    - Trabalhos grandes para o Centro de Impressão (B-1)
  Peças encomendadas. Previsão: 2-3 semanas.
  ADENDO 23-JAN:
  Centro de Impressão B-1 agora restrito.
  Todos os trabalhos de impressão requerem revisão do supervisor.
  Nova política, vigência imediata.
  Não, nós também não sabemos por quê.
  Suporte de TI - ramal 4000
  `,
  `
  AVISO DEL DEPARTAMENTO DE TI
  RE: Impresora del Piso 2
  FECHA: 16-JAN-1996
  La HP LaserJet del Piso 2 presenta atascos de papel.
  Alternativa:
    - Impresora matricial, Sala 215
    - Trabajos grandes al Centro de Impresión (B-1)
  Piezas solicitadas. Estimado: 2-3 semanas.
  ADENDA 23-JAN:
  Centro de Impresión B-1 ahora restringido.
  Todos los trabajos de impresión requieren revisión del supervisor.
  Nueva política, vigencia inmediata.
  No, nosotros tampoco sabemos por qué.
  Soporte de TI - ext. 4000
  `
);

registerLines(
  vfs.cafeteria_complaint.content,
  `
  FEEDBACK ANÔNIMO
  RE: Serviço do Refeitório
  SUBMETIDO: 18-JAN-1996
  RECLAMAÇÃO:
    Máquina de café quebrada há três semanas.
    Ninguém se importa. Inaceitável.
  SUGESTÃO:
    Trazer de volta a feijoada de quinta-feira.
    Única coisa que vale a pena comer aqui.
  RESPOSTA (Admin):
    Reparo da máquina de café agendado para 25-JAN.
    Feijoada descontinuada — restrições orçamentárias.
  SEGUNDA RECLAMAÇÃO (manuscrita, 25-JAN):
    O cheiro vindo das saídas de ar do subsolo está deixando
    a comida com gosto estranho. Favor investigar.
    RESPOSTA: Ver maintenance_schedule.txt — acesso a B-3
    suspenso. Encaminhado a Instalações.
  `,
  `
  COMENTARIO ANÓNIMO
  RE: Servicio del Comedor
  PRESENTADO: 18-JAN-1996
  QUEJA:
    Máquina de café averiada hace tres semanas.
    A nadie le importa. Inaceptable.
  SUGERENCIA:
    Traer de vuelta la feijoada del jueves.
    Lo único que vale la pena comer aquí.
  RESPUESTA (Admin):
    Reparación de la máquina de café programada para 25-JAN.
    Feijoada descontinuada — restricciones presupuestarias.
  SEGUNDA QUEJA (manuscrita, 25-JAN):
    El olor de las salidas de aire del sótano está haciendo
    que la comida tenga un sabor extraño. Favor investigar.
    RESPUESTA: Ver maintenance_schedule.txt — acceso a B-3
    suspendido. Remitido a Instalaciones.
  `
);

registerLines(
  vfs.security_badge_memo.content,
  `
  MEMORANDO — DIVISÃO DE SEGURANÇA
  RE: Renovação Anual de Crachás
  DATA: 10-JAN-1996
  Todo o pessoal deve renovar crachás até 31-JAN-1996.
  Obrigatório:
    - Crachá atual
    - Documento de identidade válido
    - Foto atualizada (Escritório de Segurança)
    - Formulário de aprovação do supervisor
  Pessoal de campo pode solicitar prorrogação.
  Não conformidade: suspensão de acesso.
  ADENDO 22-JAN:
  Novo nível de crachá introduzido: ULTRAVIOLET.
  Emissão restrita ao Comando Setorial.
  Não pergunte. Não discuta.
  Divisão de Segurança - ramal 2500
  `,
  `
  MEMORANDO — DIVISIÓN DE SEGURIDAD
  RE: Renovación Anual de Credenciales
  FECHA: 10-JAN-1996
  Todo el personal debe renovar credenciales antes del 31-JAN-1996.
  Requerido:
    - Credencial actual
    - Documento de identidad válido
    - Foto actualizada (Oficina de Seguridad)
    - Formulario de aprobación del supervisor
  Personal de campo puede solicitar prórroga.
  Incumplimiento: suspensión de acceso.
  ADENDA 22-JAN:
  Nuevo nivel de credencial introducido: ULTRAVIOLET.
  Emisión restringida al Comando Sectorial.
  No pregunte. No discuta.
  División de Seguridad - ext. 2500
  `
);

registerLines(
  vfs.training_schedule.content,
  `
  CRONOGRAMA DE TREINAMENTO — Q1 1996
  RECURSOS HUMANOS
  OBRIGATÓRIO:
    15-JAN: Reciclagem de Segurança contra Incêndio (Todo pessoal)
    22-JAN: Segurança da Informação (Novos funcionários)
    05-FEB: Certificação de Primeiros Socorros (Brigadistas)
    12-FEB: Manuseio de Documentos (Arquivos)
  OPCIONAL:
    29-JAN: Dicas de Processamento de Texto (Sala 204)
    08-FEB: Gerenciamento de Estresse (Auditório)
  ADICIONADO 23-JAN (OBRIGATÓRIO):
    Conscientização sobre Risco Biológico — todo pessoal
    do subsolo. Inegociável. Trazer dosímetro.
    Ref: incident_report_1996_01_VG.txt
  Inscrição: RH ramal 2300
  Nenhuma pergunta sobre o novo módulo.
  `,
  `
  CRONOGRAMA DE CAPACITACIÓN — Q1 1996
  RECURSOS HUMANOS
  OBLIGATORIO:
    15-JAN: Actualización de Seguridad contra Incendios (Todo el personal)
    22-JAN: Seguridad de la Información (Nuevos empleados)
    05-FEB: Certificación de Primeros Auxilios (Brigadistas)
    12-FEB: Manejo de Documentos (Archivos)
  OPCIONAL:
    29-JAN: Consejos de Procesamiento de Texto (Sala 204)
    08-FEB: Manejo de Estrés (Auditorio)
  AGREGADO 23-JAN (OBLIGATORIO):
    Concientización sobre Riesgo Biológico — todo personal
    del sótano. Innegociable. Traer dosímetro.
    Ref: incident_report_1996_01_VG.txt
  Inscripción: RRHH ext. 2300
  Ninguna pregunta sobre el nuevo módulo.
  `
);

registerLines(
  vfs.lost_and_found.content,
  `
  ACHADOS E PERDIDOS — JANEIRO 1996
  Recepção de Segurança, Saguão do Edifício
    03-JAN: Guarda-chuva preto (banheiro Piso 3)
    07-JAN: Óculos de leitura, estojo marrom
    11-JAN: Jogo de chaves (carro + casa)
    14-JAN: Relógio, prata, digital (refeitório)
    19-JAN: Carteira, couro marrom (Lote B)
    22-JAN: [DESCRIÇÃO DO ITEM CLASSIFICADA]
    22-JAN: [DESCRIÇÃO DO ITEM CLASSIFICADA]
    23-JAN: [DESCRIÇÃO DO ITEM CLASSIFICADA]
  Itens mantidos por 30 dias, depois doados.
  NOTA: Itens registrados 22-23 JAN reclamados pelo
  Comando do Setor. Nenhum recibo emitido.
  Não questione. Ver duty_roster_jan96.txt.
  `,
  `
  OBJETOS PERDIDOS — ENERO 1996
  Recepción de Seguridad, Vestíbulo del Edificio
    03-JAN: Paraguas negro (baño Piso 3)
    07-JAN: Lentes de lectura, estuche marrón
    11-JAN: Juego de llaves (auto + casa)
    14-JAN: Reloj, plata, digital (comedor)
    19-JAN: Billetera, cuero marrón (Lote B)
    22-JAN: [DESCRIPCIÓN DEL ARTÍCULO CLASIFICADA]
    22-JAN: [DESCRIPCIÓN DEL ARTÍCULO CLASIFICADA]
    23-JAN: [DESCRIPCIÓN DEL ARTÍCULO CLASIFICADA]
  Artículos retenidos por 30 días, luego donados.
  NOTA: Artículos registrados 22-23 JAN reclamados por
  Comando del Sector. Ningún recibo emitido.
  No pregunte. Ver duty_roster_jan96.txt.
  `
);

registerLines(
  vfs.budget_memo_paperclips.content,
  `
  MEMORANDO — ORÇAMENTO DE MATERIAIS DE ESCRITÓRIO
  Serviços Administrativos
  DATA: 08-JAN-1996
  RE: Disputa na Requisição de Clipes de Papel
  Auditoria identificou discrepâncias:
    Uso Q4 1995: 47 caixas
    Orçamento Q4 1995: 32 caixas
    Variação: +47% acima do orçamento
  REMEDIAÇÃO:
    1. Solicitações detalhadas até dia 15 de cada mês
    2. Compras em volume requerem supervisor
    3. Reutilização de clipes encorajada
  Clipes "jumbo" devem ser justificados por escrito.
  Tamanho padrão é suficiente para maioria das encadernações.
  Dúvidas: Compras, ramal 2140
  Temos preocupações maiores agora. —manuscrito
  `,
  `
  MEMORANDO — PRESUPUESTO DE MATERIALES DE OFICINA
  Servicios Administrativos
  FECHA: 08-JAN-1996
  RE: Disputa en Requisición de Clips de Papel
  Auditoría identificó discrepancias:
    Uso Q4 1995: 47 cajas
    Presupuesto Q4 1995: 32 cajas
    Variación: +47% sobre el presupuesto
  REMEDIACIÓN:
    1. Solicitudes detalladas para el 15 de cada mes
    2. Compras en volumen requieren supervisor
    3. Reutilización de clips alentada
  Clips "jumbo" deben justificarse por escrito.
  Tamaño estándar es suficiente para la mayoría de encuadernaciones.
  Consultas: Adquisiciones, ext. 2140
  Tenemos preocupaciones mayores ahora. —manuscrito
  `
);

registerLines(
  vfs.maintenance_schedule_96.content,
  `
  MANUTENÇÃO PROGRAMADA — Q1 1996
  GERÊNCIA DE INSTALAÇÕES
  JANEIRO:
    08-JAN: Inspeção de elevadores (Edifício A)
    15-JAN: Certificação de extintores de incêndio
    22-JAN: Teste do gerador — ADIADO (incidente)
    29-JAN: Serviço de controle de pragas — CANCELADO
  FEVEREIRO:
    05-FEB: Inspeção do telhado
    12-FEB: Teste de iluminação de emergência
    19-FEB: Limpeza da caixa d'água
    26-FEB: Troca de filtros HVAC
  NOTA: Toda manutenção no nível do subsolo suspensa
  por tempo indeterminado conforme diretriz do Comando Setorial.
  Pessoal de instalações sem autorização para B-3.
  Relacionado: cafeteria_feedback.txt (reclamações de odor)
  Solicitações: ramal 2200 ou Formulário F-112
  `,
  `
  MANTENIMIENTO PROGRAMADO — Q1 1996
  GERENCIA DE INSTALACIONES
  ENERO:
    08-JAN: Inspección de ascensores (Edificio A)
    15-JAN: Certificación de extintores de incendio
    22-JAN: Prueba del generador — POSPUESTA (incidente)
    29-JAN: Servicio de control de plagas — CANCELADO
  FEBRERO:
    05-FEB: Inspección del techo
    12-FEB: Prueba de iluminación de emergencia
    19-FEB: Limpieza del tanque de agua
    26-FEB: Reemplazo de filtros HVAC
  NOTA: Todo mantenimiento en nivel sótano suspendido
  indefinidamente según directiva del Comando Sectorial.
  Personal de instalaciones sin autorización para B-3.
  Relacionado: cafeteria_feedback.txt (quejas de olor)
  Solicitudes: ext. 2200 o Formulario F-112
  `
);

registerLines(
  vfs.cafeteria_menu_week04.content,
  `
  CARDÁPIO DO REFEITÓRIO — SEMANA 04 (22-26 JAN 1996)
  SEGUNDA: Strogonoff de frango, arroz, batata palha
  TERÇA: Bife à milanesa, arroz, feijão, farofa
  QUARTA: Moqueca de peixe, arroz branco, pirão
  QUINTA: Cozido à portuguesa, legumes, pão de alho
  SEXTA: Feijoada light, arroz, couve, laranja
  SOBREMESA: Pudim (Seg-Qua), Goiabada (Qui-Sex)
  SUCO: R$ 0,50 — Maracujá | Caju | Acerola
  Dona Maria deseja a todos uma boa semana.
  ATUALIZAÇÃO 23-JAN: Cozinha fechada quinta/sexta.
  Abastecimento de água do refeitório redirecionado.
  "Necessidades prioritárias de hidratação" — Instalações.
  Somente máquinas de venda. Pedimos desculpas.
  Ver também: incident_report_1996_01_VG.txt
  `,
  `
  MENÚ DEL COMEDOR — SEMANA 04 (22-26 ENE 1996)
  LUNES: Strogonoff de pollo, arroz, papas paja
  MARTES: Milanesa de carne, arroz, frijoles, farofa
  MIÉRCOLES: Moqueca de pescado, arroz blanco, pirão
  JUEVES: Cocido a la portuguesa, verduras, pan de ajo
  VIERNES: Feijoada light, arroz, col, naranja
  POSTRE: Pudín (Lun-Mié), Goiabada (Jue-Vie)
  JUGO: R$ 0,50 — Maracuyá | Cajú | Acerola
  Doña Maria desea a todos una buena semana.
  ACTUALIZACIÓN 23-JAN: Cocina cerrada jueves/viernes.
  Suministro de agua del comedor redirigido.
  "Necesidades prioritarias de hidratación" — Instalaciones.
  Solo máquinas expendedoras. Nos disculpamos.
  Ver también: incident_report_1996_01_VG.txt
  `
);

registerLines(
  vfs.parking_regulations.content,
  `
  REGULAMENTO DO ESTACIONAMENTO
  VIGÊNCIA: 01-JAN-1996
  REGRAS:
    1. Permissão de estacionamento válida obrigatória.
    2. Limite de velocidade: 10 km/h.
    3. Proibido estacionar em faixas de emergência (vermelho).
    4. Motocicletas: somente Lote C.
    5. Pernoite sem autorização proibido.
  PERMISSÕES:
    AZUL:    Diretores / oficiais visitantes
    VERDE:   Pessoal permanente
    AMARELO: Temporário / prestador
    VERMELHO: Somente veículos de emergência
    PRETO:   [NOVO — Somente Comando do Setor]
  NOTA 22-JAN: Lote C fechado até segunda ordem.
  Veículos com permissão PRETA estacionam no Lote C.
  Não fotografe veículos com permissão PRETA.
  Permissões perdidas: Segurança, ramal 2000
  `,
  `
  REGLAMENTO DEL ESTACIONAMIENTO
  VIGENCIA: 01-JAN-1996
  REGLAS:
    1. Permiso de estacionamiento válido obligatorio.
    2. Límite de velocidad: 10 km/h.
    3. Prohibido estacionar en carriles de emergencia (rojo).
    4. Motocicletas: solo Lote C.
    5. Pernocte sin autorización prohibido.
  PERMISOS:
    AZUL:     Directores / funcionarios visitantes
    VERDE:    Personal permanente
    AMARILLO: Temporario / contratista
    ROJO:     Solo vehículos de emergencia
    NEGRO:    [NUEVO — Solo Comando del Sector]
  NOTA 22-JAN: Lote C cerrado hasta nuevo aviso.
  Vehículos con permiso NEGRO estacionan en Lote C.
  No fotografíe vehículos con permiso NEGRO.
  Permisos perdidos: Seguridad, ext. 2000
  `
);

registerLines(
  vfs.lost_found_log_extended.content,
  `
  REGISTRO DE ACHADOS E PERDIDOS — DETALHADO
  RECEPÇÃO DE SEGURANÇA — JANEIRO 1996
  03-JAN | 14:30 | Guarda-chuva preto, Piso 3.
    RECLAMADO 09-JAN.
  07-JAN | 09:15 | Óculos de leitura, Sala de Conf. B.
    NÃO RECLAMADO.
  11-JAN | 16:45 | Chaveiro (3 chaves), Elevador.
    RECLAMADO 12-JAN.
  14-JAN | 12:00 | Relógio digital, Refeitório.
    NÃO RECLAMADO.
  19-JAN | 18:20 | Carteira marrom, entrada Lote B.
    RECLAMADO 20-JAN. Proprietário verificado.
  22-JAN | 03:00 | [REGISTRO LACRADO]
    Sobreposição: COMANDO DO SETOR
    Guarda de plantão (P. Rocha) colocado em licença.
    Rocha descreveu o item como "não é daqui."
    Significado incerto. Rocha indisponível.
  `,
  `
  REGISTRO DE OBJETOS PERDIDOS — DETALLADO
  RECEPCIÓN DE SEGURIDAD — ENERO 1996
  03-JAN | 14:30 | Paraguas negro, Piso 3.
    RECLAMADO 09-JAN.
  07-JAN | 09:15 | Lentes de lectura, Sala de Conf. B.
    NO RECLAMADO.
  11-JAN | 16:45 | Llavero (3 llaves), Ascensor.
    RECLAMADO 12-JAN.
  14-JAN | 12:00 | Reloj digital, Comedor.
    NO RECLAMADO.
  19-JAN | 18:20 | Billetera marrón, entrada Lote B.
    RECLAMADO 20-JAN. Propietario verificado.
  22-JAN | 03:00 | [REGISTRO SELLADO]
    Anulación: COMANDO DEL SECTOR
    Guardia de turno (P. Rocha) puesto en licencia.
    Rocha describió el artículo como "no es de aquí."
    Significado incierto. Rocha no disponible.
  `
);


// --- Batch 2 (26 files) ---

registerLines(
  vfs.vacation_calendar_96.content,
  `
  ESCALA DE FÉRIAS — T1 1996
  RECURSOS HUMANOS
  JANEIRO:
    OLIVEIRA, P. ........... 02 a 12-JAN
    SANTOS, M. ............. 08 a 15-JAN
    RIBEIRO, J.S. .......... 15 a 26-JAN
    NASCIMENTO, R. ......... [CANCELADO — INCIDENTE]
  FEVEREIRO:
    COSTA, L. .............. 05 a 16-FEV
    FERREIRA, R. ........... [CANCELADO — TRANSFERÊNCIA]
    LIMA, A. ............... [CANCELADO — TRANSFERÊNCIA]
    CARVALHO, M. ........... [CANCELADO — MÉDICO]
  TODAS AS FÉRIAS DE MARÇO SUSPENSAS.
  Diretriz do Comando do Setor.
  Motivo: "Requisitos operacionais."
  Dúvidas: RH, ramal 2050
  `,
  `
  CALENDARIO DE VACACIONES — T1 1996
  RECURSOS HUMANOS
  ENERO:
    OLIVEIRA, P. ........... 02 a 12-ENE
    SANTOS, M. ............. 08 a 15-ENE
    RIBEIRO, J.S. .......... 15 a 26-ENE
    NASCIMENTO, R. ......... [CANCELADO — INCIDENTE]
  FEBRERO:
    COSTA, L. .............. 05 a 16-FEB
    FERREIRA, R. ........... [CANCELADO — TRANSFERENCIA]
    LIMA, A. ............... [CANCELADO — TRANSFERENCIA]
    CARVALHO, M. ........... [CANCELADO — MÉDICO]
  TODAS LAS VACACIONES DE MARZO SUSPENDIDAS.
  Directiva del Comando del Sector.
  Motivo: "Requisitos operacionales."
  Consultas: RRHH, ext. 2050
  `
);
registerLines(
  vfs.cipher_notes.content,
  `
  AUDITORIA DE CÓDIGOS DE ACESSO — REVISÃO DE SEGURANÇA
  CLASSIFICAÇÃO: USO INTERNO SOMENTE
  DATA: 18-DEZ-1995
  Conforme Diretiva de Segurança 1995-12, códigos de acesso
  departamentais revisados para conformidade de nomenclatura.
  Códigos utilizam terminologia agrícola conforme Padrão
  de Nomenclatura de Operações do Projeto.
  Auditoria sinalizou o seguinte código por vulnerabilidade
  de reconhecimento de padrão:
      C - O - L - H - E - I - T - A
  Arranjo sequencial de letras suscetível a
  ataques de enumeração. Código permanece aceitável para
  o ano fiscal vigente. Considerar substituição
  alfanumérica para AF1997.
  AUDITOR: Administração de Sistemas
  DISTRIBUIÇÃO: Operadores de terminal, Setor de Segurança
  `,
  `
  AUDITORÍA DE CÓDIGOS DE ACCESO — REVISIÓN DE SEGURIDAD
  CLASIFICACIÓN: USO INTERNO SOLAMENTE
  FECHA: 18-DIC-1995
  Conforme Directiva de Seguridad 1995-12, códigos de acceso
  departamentales revisados para conformidad de nomenclatura.
  Códigos utilizan terminología agrícola conforme Estándar
  de Nomenclatura de Operaciones del Proyecto.
  Auditoría señaló el siguiente código por vulnerabilidad
  de reconocimiento de patrón:
      C - O - L - H - E - I - T - A
  Disposición secuencial de letras susceptible a
  ataques de enumeración. Código permanece aceptable para
  el año fiscal vigente. Considerar sustitución
  alfanumérica para AF1997.
  AUDITOR: Administración de Sistemas
  DISTRIBUCIÓN: Operadores de terminal, Oficina de Seguridad
  `
);
registerLines(
  vfs.weekend_duty_roster.content,
  `
  ESCALA DE SERVIÇO — FIM DE SEMANA — JANEIRO 1996
  CENTRO DE OPERAÇÕES
  06-07 JAN: SILVA, R. / OLIVEIRA, P.
  13-14 JAN: SANTOS, M. / COSTA, L.
  20-21 JAN: [CANCELADO — TODOS EM ALERTA]
  27-28 JAN: FERREIRA, J. / LIMA, A.
  Fim de semana de 20-21 JAN: Mobilização total do pessoal
  por ordem do Diretor. Nenhum detalhe fornecido.
  Solicitações de hora extra ao RH até quarta anterior.
  NOTA: Pessoal reportando em 20-JAN expressou
  relutância. Dois solicitaram transferência imediata.
  Solicitações negadas. Aditivos de NDA assinados.
  Ver: vacation_calendar.txt (cancelamentos)
  Oficial de Plantão: ramal 3000 (24h)
  `,
  `
  GUARDIA DE FIN DE SEMANA — ENERO 1996
  CENTRO DE OPERACIONES
  06-07 ENE: SILVA, R. / OLIVEIRA, P.
  13-14 ENE: SANTOS, M. / COSTA, L.
  20-21 ENE: [CANCELADO — TODOS EN ALERTA]
  27-28 ENE: FERREIRA, J. / LIMA, A.
  Fin de semana de 20-21 ENE: Movilización total del personal
  por orden del Director. Ningún detalle proporcionado.
  Solicitudes de horas extra a RRHH antes del miércoles.
  NOTA: Personal reportándose el 20-JAN expresó
  renuencia. Dos solicitaron transferencia inmediata.
  Solicitudes denegadas. Enmiendas de NDA firmadas.
  Ver: vacation_calendar.txt (cancelaciones)
  Oficial de Guardia: ext. 3000 (24h)
  `
);
registerLines(
  vfs.override_protocol_memo.content,
  `
  MEMORANDO — ACESSO EMERGENCIAL AO TERMINAL
  CLASSIFICAÇÃO: USO INTERNO SOMENTE
  PARA: Todos os Operadores de Terminal
  DE: Administração de Sistemas
  DATA: Dezembro de 1995
  Códigos de acesso emergencial ao terminal foram
  atualizados para o novo ano fiscal.
  O código emergencial permite acesso a diretórios restritos quando
  a autenticação padrão está indisponível.
  USO: override <código_de_autorização>
  CÓDIGO VIGENTE:
    Palavra de designação do projeto. Termo agrícola.
    Português. Relacionado a operações de extração.
  O código referencia nosso codinome operacional.
  Pense: o que se faz na época da colheita?
  NÃO compartilhar com pessoal não autorizado.
  `,
  `
  MEMORÁNDUM — ACCESO DE EMERGENCIA AL TERMINAL
  CLASIFICACIÓN: USO INTERNO SOLAMENTE
  PARA: Todos los Operadores de Terminal
  DE: Administración de Sistemas
  FECHA: Diciembre de 1995
  Los códigos de acceso de emergencia al terminal fueron
  actualizados para el nuevo año fiscal.
  El código de emergencia permite acceso a directorios restringidos cuando
  la autenticación estándar no está disponible.
  USO: override <código_de_autorización>
  CÓDIGO VIGENTE:
    Palabra de designación del proyecto. Término agrícola.
    Portugués. Relacionado a operaciones de extracción.
  El código referencia nuestro nombre clave operacional.
  Piense: ¿qué se hace en época de cosecha?
  NO compartir con personal no autorizado.
  `
);
registerLines(
  vfs.honeypot_classified_alpha.content,
  `
  ALERTA DE SEGURANÇA — INTRUSÃO DETECTADA
  Este arquivo é um HONEYPOT.
  Seu ID de terminal foi registrado.
  Seu padrão de acesso foi sinalizado.
  Pessoal de segurança foi notificado.
  Inteligência real nunca é rotulada como URGENTE.
  Esse foi seu primeiro erro.
  PERMANEÇA EM SEU TERMINAL.
  `,
  `
  ALERTA DE SEGURIDAD — INTRUSIÓN DETECTADA
  Este archivo es un HONEYPOT.
  Su ID de terminal ha sido registrado.
  Su patrón de acceso ha sido señalado.
  Personal de seguridad ha sido notificado.
  La inteligencia real nunca se rotula como URGENTE.
  Ese fue su primer error.
  PERMANEZCA EN SU TERMINAL.
  `
);
registerLines(
  vfs.honeypot_alien_autopsy.content,
  `
  ARQUIVO ISCA — ACESSO REGISTRADO
  Este arquivo foi plantado para identificar acesso não autorizado.
  Evidência real nunca é rotulada de forma tão óbvia.
  Você deveria saber disso.
  Sua sessão foi marcada para revisão.
  Contramedidas podem ter sido acionadas.
  `,
  `
  ARCHIVO SEÑUELO — ACCESO REGISTRADO
  Este archivo fue plantado para identificar acceso no autorizado.
  La evidencia real nunca se rotula de forma tan obvia.
  Usted debería saberlo.
  Su sesión ha sido marcada para revisión.
  Contramedidas pueden haber sido desplegadas.
  `
);
registerLines(
  vfs.honeypot_presidents_eyes.content,
  `
  ARQUIVO ARMADILHA — INTRUSÃO CONFIRMADA
  "SOMENTE PARA OS OLHOS DO PRESIDENTE" não existe
  em nenhum sistema real de classificação de inteligência.
  Este foi um teste de seu julgamento operacional.
  Você falhou.
  Contramedidas acionadas.
  Sua curiosidade tem um custo.
  `,
  `
  ARCHIVO TRAMPA — INTRUSIÓN CONFIRMADA
  "SOLO PARA LOS OJOS DEL PRESIDENTE" no existe
  en ningún sistema real de clasificación de inteligencia.
  Esta fue una prueba de su juicio operacional.
  Usted falló.
  Contramedidas desplegadas.
  Su curiosidad tiene un costo.
  `
);
registerLines(
  vfs.honeypot_smoking_gun.content,
  `
  HONEYPOT ACIONADO
  Agências de inteligência não rotulam arquivos
  "PROVA IRREFUTÁVEL."
  Este arquivo existe para capturar intrusos que carecem
  da discrição para reconhecer uma isca óbvia.
  Sua impaciência foi registrada.
  A evidência real é mais silenciosa que isto.
  `,
  `
  HONEYPOT ACTIVADO
  Las agencias de inteligencia no rotulan archivos
  "PRUEBA IRREFUTABLE."
  Este archivo existe para capturar intrusos que carecen
  de la discreción para reconocer un señuelo obvio.
  Su impaciencia ha sido registrada.
  La evidencia real es más silenciosa que esto.
  `
);
registerLines(
  vfs.epilogue_news_clipping.content,
  `
  RECORTES DE JORNAL ARQUIVADOS — FEVEREIRO 1996
  FOLHA DE SÃO PAULO — 15-FEV-1996
  "MILITARES NEGAM RUMORES DE VARGINHA"
    Força Aérea negou atividade incomum próxima a Varginha.
    "Não houve incidente. Fabricações de
    imaginações hiperativas."
  O GLOBO — 22-FEV-1996
  "DOCUMENTOS ANÔNIMOS SURGEM NA INTERNET"
    Documentos não verificados alegando recuperação de OVNI
    apareceram em fóruns internacionais.
    Governo: "falsificações óbvias."
  ESTADO DE MINAS — 28-FEV-1996
  "TESTEMUNHA RETIRA DEPOIMENTO"
    Mulher local retirou seu testemunho sobre a criatura.
    "Eu estava enganada. Eram apenas sombras."
    [Ela foi visitada por homens de terno dois dias antes.]
  `,
  `
  RECORTES DE PRENSA ARCHIVADOS — FEBRERO 1996
  FOLHA DE SÃO PAULO — 15-FEB-1996
  "MILITARES NIEGAN RUMORES DE VARGINHA"
    Fuerza Aérea negó actividad inusual cerca de Varginha.
    "No hubo incidente. Fabricaciones de
    imaginaciones hiperactivas."
  O GLOBO — 22-FEB-1996
  "DOCUMENTOS ANÓNIMOS APARECEN EN INTERNET"
    Documentos no verificados alegando recuperación de OVNI
    aparecieron en foros internacionales.
    Gobierno: "falsificaciones obvias."
  ESTADO DE MINAS — 28-FEB-1996
  "TESTIGO RETIRA DECLARACIÓN"
    Mujer local retiró su testimonio sobre la criatura.
    "Estaba equivocada. Eran solo sombras."
    [Fue visitada por hombres de traje dos días antes.]
  `
);
registerLines(
  vfs.epilogue_government_response.content,
  `
  MEMORANDO CLASSIFICADO
  DATA: 10-MAR-1996
  REF: Avaliação de Contenção de Informação
  Documentos das operações de janeiro de 1996 exfiltrados
  via sistema de terminal legado comprometido.
  DANOS:
    - Documentos circulando em redes internacionais
    - Autenticidade questionada (conforme planejado)
    - Sem repercussão na mídia convencional (ainda)
  CONTENÇÃO:
    1. Inundar redes com falsificações óbvias
    2. Pressionar testemunhas a se retratarem
    3. Redirecionar para hipótese de "drone estrangeiro"
    4. Monitorar comunidade ufológica por investigadores
  A janela de 2026 se aproxima.
  Divulgação total pode ser inevitável.
  Recomenda-se programa gradual de aclimatação.
  O indivíduo "UFO74" permanece foragido.
  Eliminação não recomendada — risco de martirização.
  `,
  `
  MEMORÁNDUM CLASIFICADO
  FECHA: 10-MAR-1996
  REF: Evaluación de Contención de Información
  Documentos de las operaciones de enero de 1996 exfiltrados
  vía sistema de terminal heredado comprometido.
  DAÑOS:
    - Documentos circulando en redes internacionales
    - Autenticidad cuestionada (según lo planeado)
    - Sin repercusión en medios convencionales (aún)
  CONTENCIÓN:
    1. Inundar redes con falsificaciones obvias
    2. Presionar testigos para que se retracten
    3. Redirigir hacia hipótesis de "dron extranjero"
    4. Monitorear comunidad ufológica por investigadores
  La ventana de 2026 se aproxima.
  Divulgación total puede ser inevitable.
  Se recomienda programa gradual de aclimatación.
  El individuo "UFO74" permanece prófugo.
  Eliminación no recomendada — riesgo de martirio.
  `
);
registerLines(
  vfs.epilogue_ufo74_fate.content,
  `
  INTERCEPTAÇÃO DE SINAL — NÃO VERIFICADO
  TIMESTAMP: 15-MAR-1996 03:47:22 UTC
  [FRAGMENTÁRIO — RECONSTRUÍDO]
  ...conseguiu cruzar a fronteira...
  ...eles vieram ao apartamento mas...
  ...identidade diferente agora...
  ...o hackerkid fez isso...
  ...os arquivos estão em todo lugar agora...
  ...não dá pra colocar a pasta de volta no tubo...
  ...eles acham que estou morto...
  ...deixe-os pensar assim...
  ...2026. estarei observando...
  ...todos nós estaremos...
  [SINAL PERDIDO]
  ANÁLISE: Origem irrastreável. Possivelmente fabricado.
  Status do sujeito: DESCONHECIDO
  `,
  `
  INTERCEPCIÓN DE SEÑAL — NO VERIFICADO
  TIMESTAMP: 15-MAR-1996 03:47:22 UTC
  [FRAGMENTARIO — RECONSTRUIDO]
  ...logró cruzar la frontera...
  ...vinieron al apartamento pero...
  ...identidad diferente ahora...
  ...el hackerkid lo hizo...
  ...los archivos están en todas partes ahora...
  ...no se puede meter la pasta de vuelta en el tubo...
  ...creen que estoy muerto...
  ...que lo crean...
  ...2026. estaré observando...
  ...todos lo estaremos...
  [SEÑAL PERDIDA]
  ANÁLISIS: Origen irrastreable. Posiblemente fabricado.
  Estado del sujeto: DESCONOCIDO
  `
);
registerLines(
  vfs.epilogue_2026_update.content,
  `
  ATUALIZAÇÃO DE PROJEÇÃO — JANELA DE TRANSIÇÃO 2026
  CLASSIFICAÇÃO: ACIMA DE ULTRASSECRETO
  A violação de informação de janeiro de 1996 alterou
  as projeções para a janela de transição de 2026.
  MODELO ANTERIOR:
    - Zero consciência pública na transição
    - Resposta da população: Pânico, colapso
    - Baixas estimadas: [SUPRIMIDO]
  MODELO REVISADO (PÓS-VIOLAÇÃO):
    - Consciência parcial existente
    - Redes clandestinas preparadas
    - Resposta coordenada possível
    - Baixas estimadas: REDUZIDAS
  A violação, embora operacionalmente danosa, pode ter
  melhorado as taxas de sobrevivência na transição.
  As ações do intruso podem ter salvado vidas.
  Esta avaliação é classificada e será negada.
  `,
  `
  ACTUALIZACIÓN DE PROYECCIÓN — VENTANA DE TRANSICIÓN 2026
  CLASIFICACIÓN: MÁS ALLÁ DE ULTRASECRETO
  La violación de información de enero de 1996 alteró
  las proyecciones para la ventana de transición de 2026.
  MODELO ANTERIOR:
    - Cero conciencia pública en la transición
    - Respuesta de la población: Pánico, colapso
    - Bajas estimadas: [SUPRIMIDO]
  MODELO REVISADO (POST-VIOLACIÓN):
    - Conciencia parcial existente
    - Redes clandestinas preparadas
    - Respuesta coordinada posible
    - Bajas estimadas: REDUCIDAS
  La violación, aunque operacionalmente dañina, puede haber
  mejorado las tasas de supervivencia en la transición.
  Las acciones del intruso pueden haber salvado vidas.
  Esta evaluación es clasificada y será negada.
  `
);
registerLines(
  vfs.aircraft_incident_report.content,
  `
  RELATÓRIO DE INCIDENTE — DIVISÃO AÉREA
  DATA: 21-JAN-1996
  CLASSIFICAÇÃO: CONFIDENCIAL
  TIPO: Sobrevoo civil não autorizado
  Um Cessna 172 monomotor ingressou no espaço aéreo
  restrito sobre a Área da Base 7, ~14:20h em 20-JAN.
  Piloto: contratante agrícola.
  Plano de voo incorreto (VFR em vez de IFR).
  Nenhum equipamento fotográfico a bordo.
  CONCLUSÃO:
    Erro de navegação. Advertência emitida.
    Sem violação de segurança.
  NOTA: Piloto admitiu posteriormente ter visto "estruturas"
  abaixo da cobertura de nuvens que não conseguiu identificar.
  Depoimento retratado após assessoria jurídica.
  Recomenda-se expansão do perímetro da zona restrita.
  `,
  `
  INFORME DE INCIDENTE — DIVISIÓN AÉREA
  FECHA: 21-ENE-1996
  CLASIFICACIÓN: CONFIDENCIAL
  TIPO: Sobrevuelo civil no autorizado
  Un Cessna 172 monomotor ingresó en el espacio aéreo
  restringido sobre el Área de Base 7, ~14:20h el 20-ENE.
  Piloto: contratista agrícola.
  Plan de vuelo incorrecto (VFR en vez de IFR).
  Ningún equipo fotográfico a bordo.
  CONCLUSIÓN:
    Error de navegación. Advertencia emitida.
    Sin violación de seguridad.
  NOTA: El piloto admitió posteriormente haber visto "estructuras"
  bajo la cobertura de nubes que no pudo identificar.
  Declaración retractada tras asesoría legal.
  Se recomienda expansión del perímetro de zona restringida.
  `
);
registerLines(
  vfs.foreign_drone_theory.content,
  `
  AVALIAÇÃO — HIPÓTESE DE DRONE ESTRANGEIRO
  ANALISTA: [CLASSIFICADO]
  DATA: 25-JAN-1996
  HIPÓTESE:
    Material recuperado é um drone de reconhecimento
    estrangeiro (origem EUA ou europeia).
  A FAVOR:
    - Materiais avançados, grau aeroespacial
    - Tamanho apropriado para plataforma não tripulada
    - Local de recuperação próximo a infraestrutura estratégica
  CONTRA:
    - Nenhum sistema de propulsão identificado
    - Nenhum drone conhecido utiliza estes materiais
    - Variabilidade de massa inexplicável
    - Assinatura térmica não corresponde a nenhum tipo de motor
  CONCLUSÃO:
    Hipótese NÃO PODE ser sustentada.
    Propriedades inconsistentes com QUALQUER aeronave conhecida.
  `,
  `
  EVALUACIÓN — HIPÓTESIS DE DRON EXTRANJERO
  ANALISTA: [CLASIFICADO]
  FECHA: 25-JAN-1996
  HIPÓTESIS:
    Material recuperado es un dron de reconocimiento
    extranjero (origen EE.UU. o europeo).
  A FAVOR:
    - Materiales avanzados, grado aeroespacial
    - Tamaño apropiado para plataforma no tripulada
    - Sitio de recuperación cerca de infraestructura estratégica
  EN CONTRA:
    - Ningún sistema de propulsión identificado
    - Ningún dron conocido utiliza estos materiales
    - Variabilidad de masa inexplicable
    - Firma térmica no corresponde a ningún tipo de motor
  CONCLUSIÓN:
    Hipótesis NO PUEDE ser sostenida.
    Propiedades inconsistentes con CUALQUIER aeronave conocida.
  `
);
registerLines(
  vfs.weather_balloon_memo.content,
  `
  MEMORANDO — RELAÇÕES PÚBLICAS
  DATA: 22-JAN-1996
  REF: Resposta a Consulta da Mídia
  DECLARAÇÃO APROVADA:
    "O objeto recuperado próximo a Varginha em 20 de janeiro
     foi identificado como um balão meteorológico do Instituto
     Nacional de Meteorologia. Avistamentos incomuns foram
     causados por luz refletida de instrumentação."
  INTERNO (NÃO DIVULGAR):
    Declaração é apenas para consumo público.
    Achados reais classificados.
    Consultar arquivos do PROJETO COLHEITA para detalhes.
  Serviço meteorológico foi instruído a confirmar.
  Eles estão... desconfortáveis com este arranjo.
  APROVADO POR: DIR. COMUNICAÇÕES
  `,
  `
  MEMORÁNDUM — RELACIONES PÚBLICAS
  FECHA: 22-ENE-1996
  REF: Respuesta a Consulta de Medios
  DECLARACIÓN APROBADA:
    "El objeto recuperado cerca de Varginha el 20 de enero
     fue identificado como un globo meteorológico del Instituto
     Nacional de Meteorología. Avistamientos inusuales fueron
     causados por luz reflejada de instrumentación."
  INTERNO (NO DIVULGAR):
    La declaración es solo para consumo público.
    Hallazgos reales clasificados.
    Consultar archivos del PROYECTO COSECHA para detalles.
  El servicio meteorológico fue instruido a confirmar.
  Están... incómodos con este arreglo.
  APROBADO POR: DIR. COMUNICACIONES
  `
);
registerLines(
  vfs.industrial_accident_theory.content,
  `
  AVALIAÇÃO ALTERNATIVA — ORIGEM INDUSTRIAL
  ANALISTA: SGT. PAULA REIS
  DATA: 26-JAN-1996
  HIPÓTESE:
    Materiais de instalação industrial próxima.
  INVESTIGAÇÃO:
    12 instalações contatadas em raio de 50km.
    Nenhum acidente ou perda de material reportado.
    Nenhuma instalação utiliza materiais compatíveis.
  COMPARAÇÃO:
    - Siderúrgica: Sem correspondência
    - Processamento químico: Sem correspondência
    - Automotiva: Sem correspondência
    - Subcontratada da Embraer: SEM CORRESPONDÊNCIA
  CONCLUSÃO: Origem industrial DESCARTADA.
  Nenhuma assinatura de fabricação identificável.
  Descontinuar esta linha de investigação.
  Adotar explicação padrão para o público.
  `,
  `
  EVALUACIÓN ALTERNATIVA — ORIGEN INDUSTRIAL
  ANALISTA: SGT. PAULA REIS
  FECHA: 26-ENE-1996
  HIPÓTESIS:
    Materiales de instalación industrial cercana.
  INVESTIGACIÓN:
    12 instalaciones contactadas en radio de 50km.
    Ningún accidente ni pérdida de material reportado.
    Ninguna instalación utiliza materiales compatibles.
  COMPARACIÓN:
    - Siderúrgica: Sin coincidencia
    - Procesamiento químico: Sin coincidencia
    - Automotriz: Sin coincidencia
    - Subcontratista de Embraer: SIN COINCIDENCIA
  CONCLUSIÓN: Origen industrial DESCARTADO.
  Ninguna firma de fabricación identificable.
  Descontinuar esta línea de investigación.
  Adoptar explicación estándar para el público.
  `
);
registerLines(
  vfs.logistics_manifest_fragment.content,
  `
  MANIFESTO LOGÍSTICO — RECUPERAÇÃO PARCIAL
  DATA: 21-JAN-1996
  STATUS: FRAGMENTO — DANO DE SETOR
  REMESSAS DE SAÍDA:
    [CORROMPIDO] ... Contêiner C-7 ...
    Destino: CÓDIGO ECHO
    Peso: 45kg
    Responsável: Protocolo 7-ECHO autorizado
    [CORROMPIDO] ... Contêiner C-12 ...
    Destino: DESCONHECIDO (canal diplomático)
    Peso: 112kg
    Responsável: [PERDA DE DADOS]
  Referência cruzada transport_log_96.
  NOTA: Peso de C-12 excede qualquer amostra
  individual de material recuperado. Conteúdo não especificado.
  Embalagem com classificação biológica confirmada.
  `,
  `
  MANIFIESTO LOGÍSTICO — RECUPERACIÓN PARCIAL
  FECHA: 21-ENE-1996
  ESTADO: FRAGMENTO — DAÑO DE SECTOR
  ENVÍOS DE SALIDA:
    [CORRUPTO] ... Contenedor C-7 ...
    Destino: CÓDIGO ECHO
    Peso: 45kg
    Responsable: Protocolo 7-ECHO autorizado
    [CORRUPTO] ... Contenedor C-12 ...
    Destino: DESCONOCIDO (canal diplomático)
    Peso: 112kg
    Responsable: [PÉRDIDA DE DATOS]
  Referencia cruzada transport_log_96.
  NOTA: Peso de C-12 excede cualquier muestra
  individual de material recuperado. Contenido no especificado.
  Embalaje con clasificación biológica confirmado.
  `
);
registerLines(
  vfs.signal_analysis_partial.content,
  `
  ANÁLISE DE SINAL — PRELIMINAR
  EQUIPAMENTO: Arranjo EEG Modificado
  DATA: 20-JAN-1996 (durante contenção)
  LEITURAS DO SUJEITO BETA (pré-óbito):
    04:30 — Apenas ruído de fundo
    04:45 — Padrão incomum detectado
    05:00 — Padrão se intensifica. Sobrecarga de equipamento.
    05:15 — Sinais vitais em declínio. Padrão atinge pico.
    05:18 — Surto de transmissão. Duração: 0.3s
    05:20 — Sujeito expira. Padrão cessa.
  Surto às 05:18 medido em frequências que nosso
  equipamento não consegue quantificar adequadamente.
  Não era aleatório. Possuía estrutura.
  Algo o recebeu. Temos certeza disto.
  Recomenda-se consulta com transcript_core.enc.
  `,
  `
  ANÁLISIS DE SEÑAL — PRELIMINAR
  EQUIPO: Arreglo EEG Modificado
  FECHA: 20-ENE-1996 (durante contención)
  LECTURAS DEL SUJETO BETA (pre-deceso):
    04:30 — Solo ruido de fondo
    04:45 — Patrón inusual detectado
    05:00 — Patrón se intensifica. Sobrecarga de equipo.
    05:15 — Signos vitales en declive. Patrón alcanza pico.
    05:18 — Ráfaga de transmisión. Duración: 0.3s
    05:20 — Sujeto expira. Patrón cesa.
  Ráfaga a las 05:18 medida en frecuencias que nuestro
  equipo no puede cuantificar adecuadamente.
  No era aleatorio. Poseía estructura.
  Algo lo recibió. Estamos seguros de esto.
  Se recomienda consulta con transcript_core.enc.
  `
);
registerLines(
  vfs.foreign_liaison_note.content,
  `
  NOTA DE LIGAÇÃO — COORDENAÇÃO ESTRANGEIRA
  DE: Contato na Embaixada (sem assinatura)
  DATA: 23-JAN-1996
  Pacote recebido via mala diplomática.
  Conteúdo confirmado:
    - Amostras biológicas (2 recipientes)
    - Amostras de material (1 recipiente)
    - Documentação (lacrada)
  Nossa equipe já está a caminho.
  Nenhum registro desta troca existirá
  em nenhum dos sistemas. Protocolo 7-ECHO confirmado.
  Contatar quando análise preliminar estiver completa.
  Seu material_x_analysis.dat foi esclarecedor.
  Concordamos com a conclusão.
  Deus nos ajude.
  `,
  `
  NOTA DE ENLACE — COORDINACIÓN EXTRANJERA
  DE: Contacto en la Embajada (sin firma)
  FECHA: 23-ENE-1996
  Paquete recibido vía valija diplomática.
  Contenido confirmado:
    - Muestras biológicas (2 recipientes)
    - Muestras de material (1 recipiente)
    - Documentación (sellada)
  Nuestro equipo ya está en camino.
  Ningún registro de este intercambio existirá
  en ninguno de los sistemas. Protocolo 7-ECHO confirmado.
  Contactar cuando el análisis preliminar esté completo.
  Su material_x_analysis.dat fue esclarecedor.
  Concordamos con la conclusión.
  Dios nos ayude.
  `
);
registerLines(
  vfs.encrypted_diplomatic_cable.content,
  `
  CABLE CIFRADO — PRIORIDADE ALFA
  ORIGEM: LANGLEY
  DESTINO: ESTAÇÃO BRASÍLIA
  DATA: 23-JAN-1996 04:12 UTC
  [CIFRADO — REQUER AUTORIZAÇÃO]
  Referência cruzada: /comms/liaison/foreign_liaison_note.txt
  `,
  `
  CABLE CIFRADO — PRIORIDAD ALFA
  ORIGEN: LANGLEY
  DESTINO: ESTACIÓN BRASILIA
  FECHA: 23-ENE-1996 04:12 UTC
  [CIFRADO — REQUIERE AUTORIZACIÓN]
  Referencia cruzada: /comms/liaison/foreign_liaison_note.txt
  `
);
registerLines(
  vfs.standing_orders_multinational.content,
  `
  ORDENS PERMANENTES — RECUPERAÇÃO MULTINACIONAL
  CLASSIFICAÇÃO: CÓSMICO — ACESSO RESTRITO
  VIGÊNCIA: 01-JAN-1989 (ATUALIZADO ANUALMENTE)
  NAÇÕES PARTICIPANTES:
    - Estados Unidos (Autoridade Coordenadora)
    - Reino Unido
    - França
    - Israel
    - Brasil (Autoridade Regional, América do Sul)
    - Rússia (Observador, pós-1991)
  GATILHO: Incidentes perfil DELTA.
  Fenômenos não convencionais, biológicos desconhecidos,
  materiais anômalos.
  RESPOSTA:
    1. Autoridade Regional estabelece perímetro
    2. Autoridade Coordenadora notificada <2 horas
    3. Equipe multinacional desdobrada <24 horas
    4. Material dividido conforme Apêndice C
  Todas as nações mantêm narrativas de cobertura sincronizadas.
  Coordenação anual: Davos, Suíça.
  ADENDO (1995): Divulgação adiada até
  o encerramento da JANELA. Meta: pós-2026.
  `,
  `
  ÓRDENES PERMANENTES — RECUPERACIÓN MULTINACIONAL
  CLASIFICACIÓN: CÓSMICO — ACCESO RESTRINGIDO
  VIGENCIA: 01-ENE-1989 (ACTUALIZADO ANUALMENTE)
  NACIONES PARTICIPANTES:
    - Estados Unidos (Autoridad Coordinadora)
    - Reino Unido
    - Francia
    - Israel
    - Brasil (Autoridad Regional, América del Sur)
    - Rusia (Observador, post-1991)
  ACTIVACIÓN: Incidentes perfil DELTA.
  Fenómenos no convencionales, biológicos desconocidos,
  materiales anómalos.
  RESPUESTA:
    1. Autoridad Regional establece perímetro
    2. Autoridad Coordinadora notificada <2 horas
    3. Equipo multinacional desplegado <24 horas
    4. Material dividido conforme Apéndice C
  Todas las naciones mantienen narrativas de cobertura sincronizadas.
  Coordinación anual: Davos, Suiza.
  ADDENDUM (1995): Divulgación aplazada hasta
  el cierre de la VENTANA. Meta: post-2026.
  `
);
registerLines(
  vfs.medical_examiner_query.content,
  `
  CONSULTA — MÉDICO LEGISTA REGIONAL
  DATA: 28-JAN-1996
  REF: Protocolo de Autópsia Incomum
  A quem possa interessar,
  Solicito informações sobre a autópsia em nossa unidade,
  21-JAN-1996. Um patologista forense foi convocado
  de uma universidade estadual. Suas anotações foram lacradas
  antes que eu pudesse revisá-las.
  O sujeito foi removido antes da minha chegada.
  Nenhum formulário de entrada preenchido. Nenhuma causa mortis registrada.
  O médico assistente se recusa a discutir.
  O armazenamento frio apresentou leituras de temperatura
  incomuns por horas. Muito abaixo dos parâmetros normais.
  Sou obrigado a manter registros completos.
  Solicito orientações.
  [RESPOSTA: "Arquivo classificado. Destrua esta consulta."]
  `,
  `
  CONSULTA — MÉDICO FORENSE REGIONAL
  FECHA: 28-ENE-1996
  REF: Protocolo de Autopsia Inusual
  A quien pueda interesar,
  Solicito información sobre la autopsia en nuestra unidad,
  21-ENE-1996. Un patólogo forense fue convocado
  de una universidad estatal. Sus notas fueron selladas
  antes de que pudiera revisarlas.
  El sujeto fue retirado antes de mi llegada.
  Ningún formulario de ingreso completado. Ninguna causa de muerte registrada.
  El médico asistente se niega a discutirlo.
  El almacenamiento frío presentó lecturas de temperatura
  inusuales durante horas. Muy por debajo de los parámetros normales.
  Estoy obligado a mantener registros completos.
  Solicito orientación.
  [RESPUESTA: "Archivo clasificado. Destruya esta consulta."]
  `
);
registerLines(
  vfs.pattern_recognition_note.content,
  `
  LOG DO SISTEMA — RECONHECIMENTO DE PADRÃO
  TIMESTAMP: [SESSÃO ATUAL]
  Varredura ampla de arquivos detectada.
  Usuário acessou múltiplos setores do sistema.
  Padrão: Revisão persistente de registros dispersos.
  Isto é uma auditoria ou uma intrusão.
  De qualquer forma, alguém está prestando atenção.
  Arquivos adicionais podem estar disponíveis.
  Verifique /admin se o acesso permitir.
  `,
  `
  LOG DEL SISTEMA — RECONOCIMIENTO DE PATRÓN
  TIMESTAMP: [SESIÓN ACTUAL]
  Barrido amplio de archivos detectado.
  Usuario ha accedido a múltiples sectores del sistema.
  Patrón: Revisión persistente de registros dispersos.
  Esto es una auditoría o una intrusión.
  De cualquier forma, alguien está prestando atención.
  Archivos adicionales pueden estar disponibles.
  Verifique /admin si el acceso lo permite.
  `
);
registerLines(
  vfs.coherence_threshold_memo.content,
  `
  ALERTA DO SISTEMA — LIMIAR DE COERÊNCIA
  PRIORIDADE: ELEVADA
  Usuário registrou evidências substanciais.
  Rastreador de evidências aproximando-se da conclusão.
  Risco de vazamento em elevação.
  Recomendação do sistema:
    Preservar artefatos da sessão.
    Antecipar tentativas de exportação emergencial.
  Evidência final pode requerer acesso administrativo.
  NOTA: Se você está lendo isto e compreende
  o que encontrou, prossiga com cautela.
  Eles também estão monitorando este terminal.
  `,
  `
  ALERTA DEL SISTEMA — UMBRAL DE COHERENCIA
  PRIORIDAD: ELEVADA
  El usuario registró evidencia sustancial.
  Rastreador de evidencia aproximándose a la conclusión.
  Riesgo de filtración en aumento.
  Recomendación del sistema:
    Preservar artefactos de la sesión.
    Anticipar intentos de exportación de emergencia.
  La evidencia final puede requerir acceso administrativo.
  NOTA: Si usted está leyendo esto y comprende
  lo que ha encontrado, proceda con cautela.
  Ellos también están monitoreando este terminal.
  `
);
registerLines(
  vfs.operation_prato_original.content,
  `
  REFERÊNCIA HISTÓRICA — OPERAÇÃO PRATO
  PERÍODO: 1977-1978
  LOCALIZAÇÃO: Colares, Pará, Brasil
  Investigação da Força Aérea Brasileira de fenômenos
  aéreos não identificados no norte do Brasil.
  ACHADOS:
    - Múltiplos avistamentos credíveis documentados
    - Efeitos físicos em testemunhas (queimaduras)
    - "Feixes de luz" com comportamento direcionado
    - Padrões de movimento não balísticos
  CONCLUSÃO OFICIAL: Inconclusivo. Arquivos lacrados.
  RELEVÂNCIA: Operação atual denominada "EXTENSÃO PRATO"
  sugere consciência institucional da conexão.
  Eles sabiam que isto aconteceria novamente.
  Eles estão esperando desde 1977.
  `,
  `
  REFERENCIA HISTÓRICA — OPERACIÓN PRATO
  PERÍODO: 1977-1978
  UBICACIÓN: Colares, Pará, Brasil
  Investigación de la Fuerza Aérea Brasileña de fenómenos
  aéreos no identificados en el norte de Brasil.
  HALLAZGOS:
    - Múltiples avistamientos creíbles documentados
    - Efectos físicos en testigos (quemaduras)
    - "Haces de luz" con comportamiento dirigido
    - Patrones de movimiento no balísticos
  CONCLUSIÓN OFICIAL: Inconcluso. Archivos sellados.
  RELEVANCIA: Operación actual denominada "EXTENSIÓN PRATO"
  sugiere conciencia institucional de la conexión.
  Sabían que esto ocurriría de nuevo.
  Han estado esperando desde 1977.
  `
);
registerLines(
  vfs.prato_incident_log_77.content,
  `
  LOG DE INCIDENTES — OPERAÇÃO PRATO (COLARES)
  PERÍODO: SET-OUT 1977
  CLASSIFICAÇÃO: RESTRITO
  18-SET 22:14 — Objeto luminoso sobre o rio.
    Feixe emitido por 4-6 segundos.
    Civil: calor e marca de perfuração.
  20-SET 23:06 — Luz pairando ~30m. Sem som.
    Aceleração lateral rápida.
    Feixe direcionado ao solo.
  24-SET 21:47 — Múltiplas testemunhas.
    Luz dividiu-se em duas, reuniu-se, partiu.
  03-OUT 00:12 — Luz rastreada por 3km ao longo da costa.
    Câmera superexposta.
  STATUS: Não resolvido. Padrão persistente.
  Incidentes concentram-se em comunidades ribeirinhas.
  Dezenove anos depois e a luz retornou.
  Desta vez trouxe passageiros.
  `,
  `
  LOG DE INCIDENTES — OPERACIÓN PRATO (COLARES)
  PERÍODO: SEP-OCT 1977
  CLASIFICACIÓN: RESTRINGIDO
  18-SEP 22:14 — Objeto luminoso sobre el río.
    Haz emitido por 4-6 segundos.
    Civil: calor y marca de punción.
  20-SEP 23:06 — Luz suspendida ~30m. Sin sonido.
    Aceleración lateral rápida.
    Haz dirigido al suelo.
  24-SEP 21:47 — Múltiples testigos.
    Luz se dividió en dos, se reunió, partió.
  03-OCT 00:12 — Luz rastreada por 3km a lo largo de la costa.
    Cámara sobreexpuesta.
  ESTADO: No resuelto. Patrón persistente.
  Incidentes se concentran en comunidades costeras.
  Diecinueve años después y la luz regresó.
  Esta vez trajo pasajeros.
  `
);


// --- Batch 3 (26 files) ---

registerLines(
  vfs.prato_patrol_observation_77.content,
  `
  OBSERVAÇÃO DE PATRULHA — TURNO 04
  1º DESTACAMENTO DA FORÇA AÉREA
  DATA: 05-OUT-1977
  00:31 — Esfera branca a 25-30m de altitude.
  00:32 — Feixe estreito emitido para baixo.
  00:33 — Feixe varre da esquerda para a direita (~40° de arco).
  00:34 — Esfera sobe rapidamente. Aceleração
    incompatível com aeronaves conhecidas.
  SENSORES:
    - Sem ruído de motor ou turbulência de rotor
    - Flutuação da bússola durante o feixe
    - Aquecimento localizado do solo no visor térmico
  FOTO: 3 quadros; 2 superexpostos; 1 parcial.
  Continuar patrulhas noturnas. Manter distância.
  Ele nos escaneou de volta. Temos certeza disso.
  `,
  `
  OBSERVACIÓN DE PATRULLA — TURNO 04
  1er DESTACAMENTO DE LA FUERZA AÉREA
  FECHA: 05-OCT-1977
  00:31 — Esfera blanca a 25-30m de altitud.
  00:32 — Haz estrecho emitido hacia abajo.
  00:33 — Haz barre de izquierda a derecha (~40° de arco).
  00:34 — Esfera asciende rápidamente. Aceleración
    incompatible con aeronaves conocidas.
  SENSORES:
    - Sin ruido de motor ni turbulencia de rotor
    - Fluctuación de brújula durante el haz
    - Calentamiento localizado del suelo en visor térmico
  FOTO: 3 cuadros; 2 sobreexpuestos; 1 parcial.
  Continuar patrullas nocturnas. Mantener distancia.
  Nos escaneó de vuelta. Estamos seguros de esto.
  `
);
registerLines(
  vfs.prato_medical_effects_77.content,
  `
  RESUMO DE EFEITOS MÉDICOS — CLÍNICA DE COLARES
  DATA: 14-OUT-1977
  SINTOMAS (12 CASOS):
    - Queimaduras superficiais (2-5cm de diâmetro)
    - Marcas de punção localizadas (subdérmicas)
    - Fadiga aguda, tontura, fotofobia
    - Anemia leve em exames de acompanhamento
  Sintomas surgem em até 12 horas após exposição.
  Sem marcadores de infecção. Recuperação em 3-5 dias.
  Manter registros de tratamento em sigilo.
  Relatar novos casos somente ao comando de campo.
  NOTA: A geometria das punções é idêntica em todos
  os doze casos. Espaçamento: 3.2mm. Profundidade: 1.1mm.
  Isto não é aleatório. Isto é precisão.
  Algo estava coletando amostras deles.
  `,
  `
  INFORME DE EFECTOS MÉDICOS — CLÍNICA DE COLARES
  FECHA: 14-OCT-1977
  SÍNTOMAS (12 CASOS):
    - Quemaduras superficiales (2-5cm de diámetro)
    - Marcas de punción localizadas (subdérmicas)
    - Fatiga aguda, mareos, fotofobia
    - Anemia leve en análisis de seguimiento
  Síntomas aparecen dentro de 12 horas tras exposición.
  Sin marcadores de infección. Recuperación en 3-5 días.
  Mantener registros de tratamiento en reserva.
  Reportar nuevos casos solo al comando de campo.
  NOTA: La geometría de las punciones es idéntica en todos
  los doce casos. Espaciado: 3.2mm. Profundidad: 1.1mm.
  Esto no es aleatorio. Esto es precisión.
  Algo estaba tomando muestras de ellos.
  `
);
registerLines(
  vfs.prato_photo_archive_77.content,
  `
  REGISTRO DO ARQUIVO FOTOGRÁFICO — OPERAÇÃO PRATO
  ARQUIVO: COMANDO DA FORÇA AÉREA / BELÉM
  DATA: 22-OUT-1977
  TOTAL DE ROLOS: 146
    - 34 rolos superexpostos (saturação de luz)
    - 21 rolos contêm silhuetas parciais
    - 6 rolos mostram segmentos de feixe no solo
  Lacrados em cofre com controle climático.
  Acesso registrado sob Protocolo 3-C.
  Diversos quadros mostram arcos repetitivos em grade.
  Analistas sinalizaram para revisão de padrões.
  NOTA: O padrão de grade corresponde à geometria
  de mapeamento de terreno usada em nossos levantamentos aéreos.
  Reconhecemos metodologia sistemática.
  Porque espelha a nossa.
  `,
  `
  REGISTRO DEL ARCHIVO FOTOGRÁFICO — OPERACIÓN PRATO
  ARCHIVO: COMANDO DE LA FUERZA AÉREA / BELÉM
  FECHA: 22-OCT-1977
  TOTAL DE ROLLOS: 146
    - 34 rollos sobreexpuestos (saturación de luz)
    - 21 rollos contienen siluetas parciales
    - 6 rollos muestran segmentos de haz en el suelo
  Sellados en bóveda con control climático.
  Acceso registrado bajo Protocolo 3-C.
  Varios cuadros muestran arcos repetitivos en cuadrícula.
  Analistas marcaron para revisión de patrones.
  NOTA: El patrón de cuadrícula coincide con la geometría
  de mapeo de terreno usada en nuestros levantamientos aéreos.
  Reconocemos metodología sistemática.
  Porque refleja la nuestra.
  `
);
registerLines(
  vfs.prato_retrospective_assessment.content,
  `
  AVALIAÇÃO RETROSPECTIVA — CONJUNTO ANÔMALO PRATO
  CLASSIFICAÇÃO: VERMELHO
  DATA: 12-FEV-1996
  Incidentes de 1977 mostram geometria de varredura consistente:
  faixas de altitude repetitivas, arcos de varredura lateral,
  contato de feixe de curta duração sem perseguição.
  INTERPRETAÇÃO:
    Comportamentos compatíveis com reconhecimento, não ataque.
    Padrões assemelham-se a amostragem em grade e mapeamento.
  INFERÊNCIA:
    Fontes luminosas: plataformas autônomas de varredura.
    Atividade indica reconhecimento dos Vigilantes
    anterior à recuperação de Varginha em 1996.
  Incidente atual é continuação, não primeiro contato.
  Eles nos observam há décadas.
  CONFIANÇA: MODERADA
  `,
  `
  EVALUACIÓN RETROSPECTIVA — CONJUNTO ANÓMALO PRATO
  CLASIFICACIÓN: ROJO
  FECHA: 12-FEB-1996
  Incidentes de 1977 muestran geometría de escaneo consistente:
  bandas de altitud repetitivas, arcos de barrido lateral,
  contacto de haz de corta duración sin persecución.
  INTERPRETACIÓN:
    Comportamientos compatibles con reconocimiento, no ataque.
    Patrones asemejan muestreo en cuadrícula y mapeo.
  INFERENCIA:
    Fuentes luminosas: plataformas autónomas de escaneo.
    Actividad indica reconocimiento de los Vigilantes
    anterior a la recuperación de Varginha en 1996.
  Incidente actual es continuación, no primer contacto.
  Nos han estado observando durante décadas.
  CONFIANZA: MODERADA
  `
);
registerLines(
  vfs.parallel_incidents_global.content,
  `
  REFERÊNCIA — INCIDENTES PARALELOS (INTERNACIONAL)
  COMPILADO: FEVEREIRO 1996
  CLASSIFICAÇÃO: COMPARTIMENTADO
  Incidentes conhecidos com características similares:
    1947 — Estados Unidos (New Mexico)
    1961 — Estados Unidos (New Hampshire)
    1967 — Reino Unido (Suffolk)
    1980 — Reino Unido (Suffolk, repetição)
    1989 — Bélgica (múltiplas localidades)
    1996 — BRASIL (atual)
  ELEMENTOS COMUNS:
    - Recuperação de material
    - Presença de componente biológico
    - Coordenação multinacional
    - Protocolo de negação pública
  Padrão sugere programa de avaliação em curso.
  Brasil agora incluído no conjunto de observação.
  Não somos os primeiros. Não seremos os últimos.
  `,
  `
  REFERENCIA — INCIDENTES PARALELOS (INTERNACIONAL)
  COMPILADO: FEBRERO 1996
  CLASIFICACIÓN: COMPARTIMENTADO
  Incidentes conocidos con características similares:
    1947 — Estados Unidos (New Mexico)
    1961 — Estados Unidos (New Hampshire)
    1967 — Reino Unido (Suffolk)
    1980 — Reino Unido (Suffolk, repetición)
    1989 — Bélgica (múltiples localidades)
    1996 — BRASIL (actual)
  ELEMENTOS COMUNES:
    - Recuperación de material
    - Presencia de componente biológico
    - Coordinación multinacional
    - Protocolo de negación pública
  Patrón sugiere programa de evaluación en curso.
  Brasil ahora incluido en el conjunto de observación.
  No somos los primeros. No seremos los últimos.
  `
);
registerLines(
  vfs.thirty_year_cycle_analysis.content,
  `
  ANÁLISE — HIPÓTESE DO CICLO DE TRINTA ANOS
  ENQUADRAMENTO TEÓRICO
  Fragmentos psi-comm recuperados referenciam
  "trinta rotações." Correlação com espaçamento:
    1947 → 1977 = 30 anos (PRATO segue)
    1977 → 2007 = 30 anos (previsto)
    1996 → 2026 = 30 anos (nas transcrições)
  HIPÓTESE:
    Ciclos de avaliação em intervalos de 30 anos.
    Cada ciclo refina o modelo observacional.
    2026 pode representar a conclusão do ciclo.
  ALTERNATIVA:
    "Rotações" pode não significar anos terrestres.
    Assume referencial terrestre.
  CONFIANÇA: BAIXA
  Mas a aritmética é aterrorizante.
  `,
  `
  ANÁLISIS — HIPÓTESIS DEL CICLO DE TREINTA AÑOS
  MARCO TEÓRICO
  Fragmentos psi-comm recuperados referencian
  "treinta rotaciones." Correlación con espaciado:
    1947 → 1977 = 30 años (PRATO sigue)
    1977 → 2007 = 30 años (previsto)
    1996 → 2026 = 30 años (en transcripciones)
  HIPÓTESIS:
    Ciclos de evaluación en intervalos de 30 años.
    Cada ciclo refina el modelo observacional.
    2026 puede representar la conclusión del ciclo.
  ALTERNATIVA:
    "Rotaciones" puede no significar años terrestres.
    Asume marco de referencia terrestre.
  CONFIANZA: BAJA
  Pero la aritmética es aterradora.
  `
);
registerLines(
  vfs.energy_extraction_theory.content,
  `
  DOCUMENTO DE PACIENTE — RECUPERADO DA SALA 14B
  RECUPERADO: 03-MAR-1996
  levaram meus cadernos, mas não este.
  não é uma invasão. todos esperam naves,
  armas, algo que pareça guerra.
  já começou.
  eles querem o que produzimos sem saber.
  cada pensamento. cada sonho. eles têm
  coletado isso por muito tempo.
  sete bilhões de unidades. é o que somos.
  sou físico. eu meço coisas.
  a possibilidade de que nós sejamos a coisa
  medida não é para o que meu treinamento me preparou.
  não acredito que esteja errado.
  `,
  `
  DOCUMENTO DE PACIENTE — RECUPERADO DE LA SALA 14B
  RECUPERADO: 03-MAR-1996
  se llevaron mis cuadernos, pero no este.
  no es una invasión. todos esperan naves,
  armas, algo que parezca guerra.
  ya comenzó.
  quieren lo que producimos sin saberlo.
  cada pensamiento. cada sueño. han estado
  recolectándolo por mucho tiempo.
  siete mil millones de unidades. eso es lo que somos.
  soy físico. mido cosas.
  la posibilidad de que seamos la cosa
  medida no es para lo que mi formación me preparó.
  no creo estar equivocado.
  `
);
registerLines(
  vfs.non_arrival_colonization.content,
  `
  ENQUADRAMENTO TEÓRICO — COLONIZAÇÃO SEM CHEGADA
  CLASSIFICAÇÃO: CÓSMICO — LIMITADO
  DATA: 05-MAR-1996
  MODELO PADRÃO: Espécie viaja → desloca → ocupa.
  O QUE OBSERVAMOS:
    Espécie envia batedores → mede → transmite.
    Chegada desnecessária. Deslocamento desnecessário.
  FASES:
    1. Reconhecimento (batedores, dados)
    2. Semeadura (organismos de integração)
    3. Conversão (modificação gradual)
    4. Extração (colheita de recursos)
  Os colonizadores nunca chegam. Os colonizados nunca
  percebem uma ameaça. O processo é gradual,
  invisível e irreversível.
  Terra: Fase 1 avançada. Fase 2 não pode ser descartada.
  [ASSINATURAS: 4 de 6. Dois recusaram — objeções arquivadas.]
  `,
  `
  MARCO TEÓRICO — COLONIZACIÓN SIN LLEGADA
  CLASIFICACIÓN: CÓSMICO — LIMITADO
  FECHA: 05-MAR-1996
  MODELO ESTÁNDAR: Especie viaja → desplaza → ocupa.
  LO QUE OBSERVAMOS:
    Especie envía exploradores → mide → transmite.
    Llegada innecesaria. Desplazamiento innecesario.
  FASES:
    1. Reconocimiento (exploradores, datos)
    2. Siembra (organismos de integración)
    3. Conversión (modificación gradual)
    4. Extracción (cosecha de recursos)
  Los colonizadores nunca llegan. Los colonizados nunca
  perciben una amenaza. El proceso es gradual,
  invisible e irreversible.
  Tierra: Fase 1 avanzada. Fase 2 no puede descartarse.
  [FIRMAS: 4 de 6. Dos rechazaron — objeciones archivadas.]
  `
);
registerLines(
  vfs.early_witness_statement.content,
  `
  DEPOIMENTO DE TESTEMUNHA — TRANSCRIÇÃO BRUTA
  DATA: 20-JAN-1996 (07:30)
  TESTEMUNHA: Civil feminina, 23 anos
  "Eu estava indo para o trabalho quando vi.
   Agachado perto do muro.
   Pensei que fosse um morador de rua.
   Então vi o rosto.
   Sem orelhas. A pele era errada.
   Ele me olhou.
   Senti como se estivesse dentro da minha cabeça.
   Então eu corri."
  NOTAS: Testemunha genuinamente perturbada.
  Relato consistente em repetições.
  Sem evidência de fabricação.
  Contato telepático descrito em /comms/psi/
  STATUS: Marcado para degradação.
  Acessar antes da perda de dados.
  `,
  `
  DECLARACIÓN DE TESTIGO — TRANSCRIPCIÓN BRUTA
  FECHA: 20-JAN-1996 (07:30)
  TESTIGO: Civil femenina, 23 años
  "Iba caminando al trabajo cuando lo vi.
   Agachado cerca del muro.
   Pensé que era un indigente.
   Entonces vi su rostro.
   Sin orejas. Su piel estaba mal.
   Me miró.
   Sentí como si estuviera dentro de mi cabeza.
   Entonces corrí."
  NOTAS: Testigo genuinamente perturbada.
  Relato consistente en repeticiones.
  Sin evidencia de fabricación.
  Contacto telepático descrito en /comms/psi/
  ESTADO: Marcado para degradación.
  Acceder antes de la pérdida de datos.
  `
);
registerLines(
  vfs.initial_response_orders.content,
  `
  ORDENS DE EMERGÊNCIA — RESPOSTA INICIAL
  EMITIDO: 20-JAN-1996 (05:00)
  PRIORIDADE: FLASH
  PARA: Todas as Unidades Regionais
  1. Assegurar perímetro em torno dos locais designados.
  2. Deter todas as testemunhas civis para interrogatório.
  3. Recuperar TODO material físico. Não deixar nada.
  4. Estabelecer blackout de comunicações.
  5. Aguardar chegada da equipe especializada.
  CRÍTICO:
    NÃO fotografar os sujeitos.
    NÃO tocar nos sujeitos sem proteção.
    NÃO tentar comunicação com os sujeitos.
  ETA da equipe estrangeira: Ver /comms/liaison/
  Protocolos de transporte: Ver /storage/
  CONFIRMAR RECEBIMENTO IMEDIATAMENTE.
  AUT: DIRETOR, INTELIGÊNCIA REGIONAL
  `,
  `
  ÓRDENES DE EMERGENCIA — RESPUESTA INICIAL
  EMITIDO: 20-JAN-1996 (05:00)
  PRIORIDAD: FLASH
  PARA: Todas las Unidades Regionales
  1. Asegurar perímetro en torno a los sitios designados.
  2. Detener a todos los testigos civiles para interrogatorio.
  3. Recuperar TODO material físico. No dejar nada.
  4. Establecer blackout de comunicaciones.
  5. Aguardar llegada del equipo especializado.
  CRÍTICO:
    NO fotografiar a los sujetos.
    NO tocar a los sujetos sin protección.
    NO intentar comunicación con los sujetos.
  ETA del equipo extranjero: Ver /comms/liaison/
  Protocolos de transporte: Ver /storage/
  CONFIRMAR RECEPCIÓN INMEDIATAMENTE.
  AUT: DIRECTOR, INTELIGENCIA REGIONAL
  `
);
registerLines(
  vfs.transport_log_96.content,
  `
  REGISTRO DE TRANSPORTE — EXTENSÃO OPERAÇÃO PRATO
  DATA: 20 a 23-JAN-1996
  CLASSIFICAÇÃO: OPERACIONAL
  20-JAN 03:42 — Despachado para Sítio ALFA
  20-JAN 04:15 — Material assegurado. Peso: 340kg
  20-JAN 04:58 — Transporte para HOLDING-7 iniciado
  21-JAN 01:20 — Recuperação secundária, Sítio BETA
  21-JAN 02:45 — 12 fragmentos distintos catalogados
  21-JAN 03:30 — Material dividido para redundância
  21-JAN 04:00 — Lote A → HOLDING-7
  21-JAN 04:00 — Lote B → [SUPRIMIDO] mala diplomática
  22-JAN — Transferência completa. Custódia lacrada.
  23-JAN 11:00 — Inventário de HOLDING-7 reconciliado
  23-JAN 11:30 — Confirmação do Lote B pendente
  Transferência estrangeira: Protocolo 7-ECHO.
  Nação destinatária não registrada neste sistema.
  `,
  `
  REGISTRO DE TRANSPORTE — EXTENSIÓN OPERACIÓN PRATO
  FECHA: 20 a 23-JAN-1996
  CLASIFICACIÓN: OPERACIONAL
  20-JAN 03:42 — Despachado al Sitio ALFA
  20-JAN 04:15 — Material asegurado. Peso: 340kg
  20-JAN 04:58 — Transporte a HOLDING-7 iniciado
  21-JAN 01:20 — Recuperación secundaria, Sitio BETA
  21-JAN 02:45 — 12 fragmentos distintos catalogados
  21-JAN 03:30 — Material dividido para redundancia
  21-JAN 04:00 — Lote A → HOLDING-7
  21-JAN 04:00 — Lote B → [SUPRIMIDO] valija diplomática
  22-JAN — Transferencia completa. Custodia sellada.
  23-JAN 11:00 — Inventario de HOLDING-7 reconciliado
  23-JAN 11:30 — Confirmación del Lote B pendiente
  Transferencia extranjera: Protocolo 7-ECHO.
  Nación destinataria no registrada en este sistema.
  `
);
registerLines(
  vfs.material_x_analysis.content,
  `
  ANÁLISE DE MATERIAL — AMOSTRAS DO LOTE A
  LAB: AFILIADO À UNICAMP (NÃO OFICIAL)
  DATA: 28-JAN-1996
  AMOSTRA M-07:
    Composição: Liga desconhecida. Sem correspondência terrestre.
    Condutividade: Variável sob observação.
    Massa: Inconsistente entre medições.
  AMOSTRA M-12:
    Matriz polimérica com inclusões metálicas.
    Resistência à tração excede materiais conhecidos x8.
    Absorve calor sem alteração de temperatura.
  CONCLUSÃO: Não é manufatura terrestre.
  Recomenda-se elevação de classificação.
  Amostras do Lote B NÃO disponíveis para análise.
  Destinatário estrangeiro recusou compartilhamento recíproco.
  Eles sabem o que é isto. Não estão nos dizendo.
  `,
  `
  ANÁLISIS DE MATERIAL — MUESTRAS DEL LOTE A
  LAB: AFILIADO A UNICAMP (NO OFICIAL)
  FECHA: 28-JAN-1996
  MUESTRA M-07:
    Composición: Aleación desconocida. Sin coincidencia terrestre.
    Conductividad: Variable bajo observación.
    Masa: Inconsistente entre mediciones.
  MUESTRA M-12:
    Matriz polimérica con inclusiones metálicas.
    Resistencia a la tracción excede materiales conocidos x8.
    Absorbe calor sin cambio de temperatura.
  CONCLUSIÓN: No es manufactura terrestre.
  Se recomienda elevación de clasificación.
  Muestras del Lote B NO disponibles para análisis.
  Destinatario extranjero rechazó compartición recíproca.
  Ellos saben lo que es esto. No nos lo están diciendo.
  `
);
registerLines(
  vfs.bio_container_log.content,
  `
  REGISTRO DE BIOCONTENÇÃO — QUARENTENA
  LOCAL: HOSPITAL REGIONAL [NOME SUPRIMIDO]
  DATA: 20-JAN-1996
  20-JAN 04:30 — Sujeito ALFA assegurado. Sinais vitais instáveis.
  20-JAN 05:15 — Sujeito BETA assegurado. Sinais vitais em declínio.
  20-JAN 06:00 — Sujeito ALFA expirou. Causa desconhecida.
  20-JAN 08:00 — Ordem de transferência recebida.
  20-JAN 09:30 — BETA transferido para custódia militar.
  20-JAN 10:00 — Restos de ALFA → protocolo de autópsia.
  Sujeitos apresentam morfologia não humana.
  Sem correspondência em qualquer espécie catalogada.
  21-JAN 02:00 — Terceiro sujeito reportado. Sítio GAMMA.
  21-JAN 04:00 — Assegurado. Designado GAMMA.
  21-JAN 06:00 — GAMMA transferido. Destino desconhecido.
  AVISO: Todo bio-material classificado CÓSMICO.
  O cheiro. O cheiro naquela sala.
  `,
  `
  REGISTRO DE BIOCONTENCIÓN — CUARENTENA
  SITIO: HOSPITAL REGIONAL [NOME SUPRIMIDO]
  FECHA: 20-JAN-1996
  20-JAN 04:30 — Sujeto ALFA asegurado. Signos vitales inestables.
  20-JAN 05:15 — Sujeto BETA asegurado. Signos vitales en declive.
  20-JAN 06:00 — Sujeto ALFA expiró. Causa desconocida.
  20-JAN 08:00 — Orden de transferencia recibida.
  20-JAN 09:30 — BETA transferido a custodia militar.
  20-JAN 10:00 — Restos de ALFA → protocolo de autopsia.
  Sujetos presentan morfología no humana.
  Sin correspondencia en ninguna especie catalogada.
  21-JAN 02:00 — Tercer sujeto reportado. Sitio GAMMA.
  21-JAN 04:00 — Asegurado. Designado GAMMA.
  21-JAN 06:00 — GAMMA transferido. Destino desconocido.
  ADVERTENCIA: Todo bio-material clasificado CÓSMICO.
  El olor. El olor en esa sala.
  `
);
registerLines(
  vfs.autopsy_alpha_log.content,
  `
  PROTOCOLO DE AUTÓPSIA — SUJEITO ALFA
  PATOLOGISTA: [CLASSIFICADO — universidade estadual]
  INSTALAÇÃO: Hospital Regional do Sul de Minas
  DATA: 21-JAN-1996
  EXTERNO:
    Altura: 1.6m (contraído na recuperação)
    Pele: Marrom escura, oleosa, forte odor de amônia
    Crânio: Três cristas ósseas, anteroposterior
    Olhos: Grandes, vermelho profundo, sem esclera
    Membros: Quatro dígitos por extremidade
  INTERNO:
    Cardiovascular: Órgão de câmara única
    Digestivo: Vestigial. Não funcional.
    Reprodutivo: Ausente.
    Neural: Massa craniana superdesenvolvida.
  Estruturas cranianas sugerem processamento
  de sinais de alta largura de banda. Sem aparelho vocal.
  Comunicação por meios não acústicos.
  Tecidos transferidos conforme Protocolo 7-ECHO.
  "Este organismo foi projetado, não evoluiu."
  `,
  `
  PROTOCOLO DE AUTOPSIA — SUJETO ALFA
  PATÓLOGO: [CLASIFICADO — universidad estatal]
  INSTALACIÓN: Hospital Regional do Sul de Minas
  FECHA: 21-JAN-1996
  EXTERNO:
    Altura: 1.6m (contraído en la recuperación)
    Piel: Marrón oscura, aceitosa, fuerte olor a amoníaco
    Cráneo: Tres crestas óseas, anteroposterior
    Ojos: Grandes, rojo profundo, sin esclerótica
    Extremidades: Cuatro dígitos por extremidad
  INTERNO:
    Cardiovascular: Órgano de cámara única
    Digestivo: Vestigial. No funcional.
    Reproductivo: Ausente.
    Neural: Masa craneal sobredesarrollada.
  Estructuras craneales sugieren procesamiento
  de señales de gran ancho de banda. Sin aparato vocal.
  Comunicación por medios no acústicos.
  Tejidos transferidos según Protocolo 7-ECHO.
  "Este organismo fue diseñado, no evolucionó."
  `
);
registerLines(
  vfs.autopsy_addendum_psi.content,
  `
  ADENDO PSI — AVALIAÇÃO NEURAL
  CONSULTOR: [CLASSIFICADO]
  DATA: 25-JAN-1996
  ANÁLISE DE ESTRUTURA CRANIANA:
    - Capacidade massiva de processamento paralelo
    - Estruturas análogas a receptores de sinal
    - Sem equivalente de córtex de tomada de decisão
  Sujeito ALFA não era autônomo.
  Recebia instruções de fonte externa.
  Funcionava apenas como observador/relé.
  Se sujeitos são receptores, devem existir
  transmissores. Os transmissores não foram recuperados.
  Presumir que a missão de observação foi bem-sucedida.
  Presumir que dados foram transmitidos antes da expiração.
  O que quer que os enviou agora sabe que estamos aqui.
  `,
  `
  ADENDA PSI — EVALUACIÓN NEURAL
  CONSULTOR: [CLASIFICADO]
  FECHA: 25-JAN-1996
  ANÁLISIS DE ESTRUCTURA CRANEAL:
    - Capacidad masiva de procesamiento paralelo
    - Estructuras análogas a receptores de señal
    - Sin equivalente de córtex de toma de decisiones
  Sujeto ALFA no era autónomo.
  Recibía instrucciones de fuente externa.
  Funcionaba solo como observador/relé.
  Si los sujetos son receptores, deben existir
  transmisores. Los transmisores no fueron recuperados.
  Asumir que la misión de observación fue exitosa.
  Asumir que los datos fueron transmitidos antes de la expiración.
  Lo que sea que los envió ahora sabe que estamos aquí.
  `
);
registerLines(
  vfs.field_report_delta.content,
  `
  RELATÓRIO DE CAMPO — OPERAÇÃO PRATO DELTA
  SUBMETIDO: 24-JAN-1996
  Três sítios de recuperação estabelecidos.
  Todas as evidências físicas asseguradas.
  Todo material biológico assegurado.
  LIGAÇÃO ESTRANGEIRA:
    Representantes de [SUPRIMIDO] chegaram 22-JAN.
    Protocolo conjunto estabelecido.
    Acordo de compartilhamento de material assinado.
  PREOCUPAÇÕES:
    Testemunhas locais: 30+.
    Supressão de mídia parcialmente efetiva.
    Contenção a longo prazo incerta.
  Manter postura de negação.
  Acelerar transferência de material estrangeiro.
  Descontinuar análise local para prevenir vazamentos.
  `,
  `
  INFORME DE CAMPO — OPERACIÓN PRATO DELTA
  ENVIADO: 24-JAN-1996
  Tres sitios de recuperación establecidos.
  Todas las evidencias físicas aseguradas.
  Todo material biológico asegurado.
  ENLACE EXTRANJERO:
    Representantes de [SUPRIMIDO] llegaron 22-JAN.
    Protocolo conjunto establecido.
    Acuerdo de intercambio de material firmado.
  PREOCUPACIONES:
    Testigos locales: 30+.
    Supresión mediática parcialmente efectiva.
    Contención a largo plazo incierta.
  Mantener postura de negación.
  Acelerar transferencia de material extranjero.
  Descontinuar análisis local para prevenir filtraciones.
  `
);
registerLines(
  vfs.scout_variants_meta.content,
  `
  ENQUADRAMENTO TEÓRICO — VARIANTES DE BATEDORES
  CLASSIFICAÇÃO: SOMENTE PARA LEITURA AUTORIZADA
  Sujeitos recuperados são construtos projetados.
  Evidência:
    - Projetados para condições específicas da Terra
    - Vida útil limitada (horas a dias)
    - Alta plasticidade neural para aprendizado rápido
    - Sem capacidade autônoma de tomada de decisão
  DESIGNAÇÃO: "Batedores"
  FUNÇÃO: Reconhecimento e medição
  RELAÇÃO: Subordinados à origem
  Batedores são instrumentos, não representantes.
  Tomadores de decisão permanecem na origem.
  A origem NÃO foi contatada.
  Capturamos seus instrumentos.
  Não conhecemos os cientistas.
  `,
  `
  MARCO TEÓRICO — VARIANTES DE EXPLORADORES
  CLASIFICACIÓN: SOLO LECTURA AUTORIZADA
  Sujetos recuperados son constructos diseñados.
  Evidencia:
    - Diseñados para condiciones específicas de la Tierra
    - Vida útil limitada (horas a días)
    - Alta plasticidad neural para aprendizaje rápido
    - Sin capacidad autónoma de toma de decisiones
  DESIGNACIÓN: "Exploradores"
  FUNCIÓN: Reconocimiento y medición
  RELACIÓN: Subordinados al origen
  Exploradores son instrumentos, no representantes.
  Tomadores de decisiones permanecen en el origen.
  El origen NO ha sido contactado.
  Capturamos sus instrumentos.
  No hemos conocido a los científicos.
  `
);
registerLines(
  vfs.energy_node_assessment.content,
  `
  AVALIAÇÃO — CLASSIFICAÇÃO DE NÓ ENERGÉTICO
  CLASSIFICAÇÃO: COMPARTIMENTADO
  DATA: 10-FEV-1996
  Fragmentos psi-comm mapeados contra análise de material:
    "Densidade energética" — referenciado 4 vezes
    "Modelo de extração" — consistente entre amostras
    "Atividade cognitiva" — usado como métrica
  A Terra está sendo avaliada como fonte de energia.
  Redes neurais biológicas podem servir como
  meio de extração. Produção cognitiva correlaciona
  com rendimento energético projetado.
  Materiais recuperados exibem absorção de energia
  que não conseguimos replicar. Estruturas neurais dos batedores
  confirmam função de medição.
  Missão dos batedores aparenta estar completa.
  Janela de transição indefinida.
  Solicitação orçamentária anexada separadamente.
  O Ministério não aprovará se souber o motivo.
  `,
  `
  EVALUACIÓN — CLASIFICACIÓN DE NODO ENERGÉTICO
  CLASIFICACIÓN: COMPARTIMENTADO
  FECHA: 10-FEB-1996
  Fragmentos psi-comm mapeados contra análisis de material:
    "Densidad energética" — referenciado 4 veces
    "Modelo de extracción" — consistente entre muestras
    "Actividad cognitiva" — usado como métrica
  La Tierra está siendo evaluada como fuente de energía.
  Redes neurales biológicas pueden servir como
  medio de extracción. Producción cognitiva correlaciona
  con rendimiento energético proyectado.
  Materiales recuperados exhiben absorción de energía
  que no podemos replicar. Estructuras neurales de los exploradores
  confirman función de medición.
  Misión de los exploradores aparenta estar completa.
  Ventana de transición indefinida.
  Solicitud presupuestaria adjunta por separado.
  El Ministerio no aprobará si ve el motivo.
  `
);
registerLines(
  vfs.threat_window.content,
  `
  AVALIAÇÃO DE AMEAÇA — JANELA DE TRANSIÇÃO
  CLASSIFICAÇÃO: VERMELHO
  DATA: 02-MAR-1996
  CRONOGRAMA:
    "Trinta rotações" = 30 ciclos orbitais
    Ano base: 1996. Alvo: 2026.
  NATUREZA: DESCONHECIDA
  Possibilidades debatidas:
    - Implantação secundária, organismos de integração
    - Transição de reconhecimento para fase ativa
    - Sinal de comunicação ou ativação
    - Início da extração de energia
  Nenhuma confirmada. Todas consistentes com os dados.
  POSTURA:
    Manter observação até 2026.
    Monitorar sinais anômalos.
    Preparar planos de contingência.
  Isto não é uma previsão. É uma referência
  detectada em fragmentos neurais recuperados.
  Não podemos fingir que não existe.
  `,
  `
  EVALUACIÓN DE AMENAZA — VENTANA DE TRANSICIÓN
  CLASIFICACIÓN: ROJO
  FECHA: 02-MAR-1996
  CRONOGRAMA:
    "Treinta rotaciones" = 30 ciclos orbitales
    Año base: 1996. Objetivo: 2026.
  NATURALEZA: DESCONOCIDA
  Posibilidades debatidas:
    - Despliegue secundario, organismos de integración
    - Transición de reconocimiento a fase activa
    - Señal de comunicación o activación
    - Inicio de la extracción de energía
  Ninguna confirmada. Todas consistentes con los datos.
  POSTURA:
    Mantener observación hasta 2026.
    Monitorear señales anómalas.
    Preparar planes de contingencia.
  Esto no es una predicción. Es una referencia
  detectada en fragmentos neurales recuperados.
  No podemos fingir que no existe.
  `
);
registerLines(
  vfs.internal_note_07.content,
  `
  NOTA INTERNA 07
  DE: [SUPRIMIDO]
  PARA: DIRETOR
  DATA: 28-JAN-1996
  RE: Preocupações com Envolvimento Estrangeiro
  Devo registrar minha objeção.
  A delegação estrangeira chegou antes da avaliação
  inicial ser concluída. Seu acesso às amostras
  biológicas foi concedido antes da cadeia de custódia.
  Acredito que:
    - Tinham conhecimento prévio
    - Seu equipamento estava pré-posicionado
    - Seus protocolos se sobrepuseram aos nossos
  Isto não foi cooperação.
  Isto foi assunção de controle.
  Recomendo protesto formal através de
  canais diplomáticos.
  `,
  `
  NOTA INTERNA 07
  DE: [SUPRIMIDO]
  PARA: DIRECTOR
  FECHA: 28-JAN-1996
  RE: Preocupaciones sobre Participación Extranjera
  Debo registrar mi objeción.
  La delegación extranjera llegó antes de que la evaluación
  inicial estuviera completa. Su acceso a las muestras
  biológicas fue concedido antes de la cadena de custodia.
  Creo que:
    - Tenían conocimiento previo
    - Su equipo estaba preposicionado
    - Sus protocolos reemplazaron los nuestros
  Esto no fue cooperación.
  Esto fue asunción de control.
  Recomiendo protesta formal a través de
  canales diplomáticos.
  `
);
registerLines(
  vfs.colonization_model.content,
  `
  AVALIAÇÃO — MODELO DE COLONIZAÇÃO INDIRETA
  CLASSIFICAÇÃO: VERMELHO — COMPARTIMENTADO
  DATA: 27-FEV-1996
  Um enquadramento que nenhum de nós queria considerar.
  FASE 1 — RECONHECIMENTO (CONFIRMADO)
    Batedores bioengenheirados implantados.
    Densidade cognitiva avaliada.
    Achados transmitidos à origem.
  FASE 2 — SEMEADURA (TEÓRICO)
    Organismos de integração introduzidos.
    Modificação biológica gradual.
  FASE 3 — EXTRAÇÃO (TEÓRICO)
    Mundo-alvo torna-se fonte de energia.
    Espécie local continua — diminuída.
    Autonomia degrada. Lentamente. Invisivelmente.
  Eles não chegam. Eles não destroem.
  Eles convertem. Silenciosamente. De uma distância que
  não podemos compreender.
  Fase 1 aparenta estar completa para a Terra.
  Solicitei confissão com o capelão.
  `,
  `
  EVALUACIÓN — MODELO DE COLONIZACIÓN INDIRECTA
  CLASIFICACIÓN: ROJO — COMPARTIMENTADO
  FECHA: 27-FEB-1996
  Un marco que ninguno de nosotros quería considerar.
  FASE 1 — RECONOCIMIENTO (CONFIRMADO)
    Exploradores de bioingeniería desplegados.
    Densidad cognitiva evaluada.
    Hallazgos transmitidos al origen.
  FASE 2 — SIEMBRA (TEÓRICO)
    Organismos de integración introducidos.
    Modificación biológica gradual.
  FASE 3 — EXTRACCIÓN (TEÓRICO)
    Mundo objetivo se convierte en fuente de energía.
    Especie local continúa — disminuida.
    Autonomía se degrada. Lentamente. Invisiblemente.
  No llegan. No destruyen.
  Convierten. Silenciosamente. Desde una distancia que
  no podemos comprender.
  Fase 1 aparenta estar completa para la Tierra.
  He solicitado confesión con el capellán.
  `
);
registerLines(
  vfs.briefing_watchers_1996.content,
  `
  BRIEFING EXECUTIVO — OS VIGILANTES
  CLASSIFICAÇÃO: CÓSMICO — SOMENTE PARA LEITURA AUTORIZADA
  FEV 1996
  I. O INCIDENTE
    20-23 JAN: Recuperação em três sítios próximos a Varginha.
    Espécimes biológicos assegurados.
  II. OS ESPÉCIMES
    Três entidades não humanas: ALFA, BETA, GAMMA.
    Construídos sob medida. Projetados para expirar.
    Instrumentos. Batedores. Ferramentas.
  III. A TRANSMISSÃO
    Dados transmitidos antes da expiração.
    Terra avaliada como viável para extração.
  IV. A JANELA
    "Trinta rotações" — 2026.
    Não é uma invasão. Algo para o qual não temos linguagem.
  V. OS VIGILANTES
    Eles observam. Eles medem. Eles colhem.
    Sem chegar.
  VI. POSTURA
    Negar publicamente. Preparar para 2026.
    Documentamos. Não solucionamos.
  Deus nos ajude.
  `,
  `
  BRIEFING EJECUTIVO — LOS VIGILANTES
  CLASIFICACIÓN: CÓSMICO — SOLO LECTURA AUTORIZADA
  FEB 1996
  I. EL INCIDENTE
    20-23 JAN: Recuperación en tres sitios cerca de Varginha.
    Especímenes biológicos asegurados.
  II. LOS ESPECÍMENES
    Tres entidades no humanas: ALFA, BETA, GAMMA.
    Construidos a medida. Diseñados para expirar.
    Instrumentos. Exploradores. Herramientas.
  III. LA TRANSMISIÓN
    Datos transmitidos antes de la expiración.
    Tierra evaluada como viable para extracción.
  IV. LA VENTANA
    "Treinta rotaciones" — 2026.
    No es una invasión. Algo para lo que no tenemos lenguaje.
  V. LOS VIGILANTES
    Observan. Miden. Cosechan.
    Sin llegar.
  VI. POSTURA
    Negar públicamente. Preparar para 2026.
    Hemos documentado. No hemos resuelto.
  Dios nos ayude a todos.
  `
);
registerLines(
  vfs.session_residue.content,
  `
  RESÍDUO DE SESSÃO — REGISTRO AUTOMATIZADO
  Múltiplos acessos a arquivos de evidência detectados.
  Padrão de revisão: coleta deliberada.
  Cache contém material suficiente para tentativa de vazamento.
  CONCLUSÃO: Risco de sessão elevado.
  Comportamento de exportação esperado.
  Alguém está montando o quadro completo.
  Deveríamos ter purgado este terminal.
  `,
  `
  RESIDUO DE SESIÓN — REGISTRO AUTOMATIZADO
  Múltiples accesos a archivos de evidencia detectados.
  Patrón de revisión: recolección deliberada.
  Caché contiene material suficiente para intento de filtración.
  CONCLUSIÓN: Riesgo de sesión elevado.
  Comportamiento de exportación esperado.
  Alguien está armando el cuadro completo.
  Deberíamos haber purgado este terminal.
  `
);
registerLines(
  vfs.ethics_exception.content,
  `
  EXCEÇÃO ÉTICA — SOLICITAÇÃO 03
  DATA: 29-JAN-1996
  SOLICITAÇÃO:
    Dispensa de protocolos padrão para manuseio de espécimes.
    Justificativa: Oportunidade científica única.
  STATUS: APROVADO
  CONDIÇÕES:
    - Todos os procedimentos conduzidos fora do local
    - Sem registros institucionais
    - Resultados compartilhados somente com parceiros estrangeiros
  APROVAÇÃO: [ASSINATURA SUPRIMIDA]
  O comitê de ética não perguntou o que o espécime
  era. Acredito que não queriam saber.
  `,
  `
  EXCEPCIÓN ÉTICA — SOLICITUD 03
  FECHA: 29-JAN-1996
  SOLICITUD:
    Dispensa de protocolos estándar para manejo de especímenes.
    Justificación: Oportunidad científica única.
  ESTADO: APROBADO
  CONDICIONES:
    - Todos los procedimientos realizados fuera del sitio
    - Sin registros institucionales
    - Resultados compartidos solo con socios extranjeros
  APROBACIÓN: [FIRMA SUPRIMIDA]
  El comité de ética no preguntó qué era el espécimen.
  Creo que no querían saberlo.
  `
);
registerLines(
  vfs.bio_program_overview.content,
  `
  VISÃO GERAL DO PROGRAMA — INICIATIVA DE BIOAVALIAÇÃO
  CLASSIFICAÇÃO: VERMELHO
  Após janeiro de 1996, um programa conjunto foi
  estabelecido com parceiros internacionais.
  OBJETIVOS:
    - Analisar material biológico recuperado
    - Desenvolver protocolos de detecção
    - Preparar estruturas de resposta
  PARTICIPANTES:
    - Inteligência Brasileira (Líder, Local)
    - [SUPRIMIDO] (Análise Técnica)
    - [SUPRIMIDO] (Avaliação Biológica)
  DIVISÃO:
    - Brasil: Restos do Sujeito ALFA
    - Estrangeiro: Sujeitos BETA, GAMMA
    - Materiais conforme Protocolo 7-ECHO
  STATUS: Em andamento. Se Deus quiser, desnecessário.
  `,
  `
  VISIÓN GENERAL DEL PROGRAMA — INICIATIVA DE BIOEVALUACIÓN
  CLASIFICACIÓN: ROJO
  Tras enero de 1996, un programa conjunto fue
  establecido con socios internacionales.
  OBJETIVOS:
    - Analizar material biológico recuperado
    - Desarrollar protocolos de detección
    - Preparar marcos de respuesta
  PARTICIPANTES:
    - Inteligencia Brasileña (Líder, Local)
    - [SUPRIMIDO] (Análisis Técnico)
    - [SUPRIMIDO] (Evaluación Biológica)
  DIVISIÓN:
    - Brasil: Restos del Sujeto ALFA
    - Extranjero: Sujetos BETA, GAMMA
    - Materiales según Protocolo 7-ECHO
  ESTADO: En curso. Si Dios quiere, innecesario.
  `
);
registerLines(
  vfs.window_alignment.content,
  `
  ANÁLISE TEMPORAL — ALINHAMENTO DE JANELA
  MÉTODO: Reconstrução de Padrão de Sinal
  Referências temporais recorrentes em psi-comm:
    "trinta rotações" (freq: 3)
    "alinhamento" (freq: 2)
    "convergência" (freq: 1)
    "janela" (freq: 2)
  CORRELAÇÃO ASTRONÔMICA (2026):
    - Alinhamentos planetários incomuns
    - Atividade solar: projeções elevadas
    - [DADOS INSUFICIENTES]
  CONFIANÇA: MODERADA
  Estabelecer monitoramento para 2026.
  Natureza do evento esperado: DESCONHECIDA.
  A frequência de "trinta rotações" em
  extrações independentes de espécimes é difícil
  de descartar como coincidência.
  `,
  `
  ANÁLISIS TEMPORAL — ALINEACIÓN DE VENTANA
  MÉTODO: Reconstrucción de Patrón de Señal
  Referencias temporales recurrentes en psi-comm:
    "treinta rotaciones" (freq: 3)
    "alineación" (freq: 2)
    "convergencia" (freq: 1)
    "ventana" (freq: 2)
  CORRELACIÓN ASTRONÓMICA (2026):
    - Alineaciones planetarias inusuales
    - Actividad solar: proyecciones elevadas
    - [DATOS INSUFICIENTES]
  CONFIANZA: MODERADA
  Establecer monitoreo para 2026.
  Naturaleza del evento esperado: DESCONOCIDA.
  La frecuencia de "treinta rotaciones" en
  extracciones independientes de especímenes es difícil
  de descartar como coincidencia.
  `
);


// --- Batch 4 (27 files) ---

registerLines(
  vfs.psi_analysis_report.content,
  `
  ANÁLISE DE PSI-COMUNICAÇÃO
  CLASSIFICAÇÃO: COMPARTIMENTADO — 15-FEV-1996
  Comunicação com espécimes ocorreu por meios não acústicos,
  não eletromagnéticos. Pessoal relatou recepção de
  informação sem estímulo sensorial. Sem linguagem falada,
  sem símbolos. Apenas atividade neural sincronizada, transmissão
  conceitual intrusiva e transferência de estado emocional.
  Operador Líder: "Eu entendi o que me estava sendo mostrado.
  Não consigo dizer o que entendi."
  CRÍTICO: Eles não se comunicam para trocar informação.
  Eles transmitem. Não esperam resposta.
  Nunca foram projetados para diálogo.
  ACESSO DE LINK: Preservação de padrão neural permite
  link post-mortem. Frase de autenticação derivada de
  psi-comm — ver despejo neural [transmissão conceitual].
    > link
    > Enter phrase: ___________
  `,
  `
  ANÁLISIS DE PSI-COMUNICACIÓN
  CLASIFICACIÓN: COMPARTIMENTADO — 15-FEB-1996
  Comunicación con especímenes ocurrió por medios no acústicos,
  no electromagnéticos. El personal reportó recepción de
  información sin estímulo sensorial. Sin lenguaje hablado,
  sin símbolos. Solo actividad neural sincronizada, transmisión
  conceptual intrusiva y transferencia de estado emocional.
  Operador Líder: "Entendí lo que me estaba mostrando.
  No puedo decir lo que entendí."
  CRÍTICO: No se comunican para intercambiar información.
  Transmiten. No esperan respuesta.
  Nunca fueron diseñados para el diálogo.
  ACCESO DE ENLACE: La preservación de patrón neural permite
  enlace post-mortem. Frase de autenticación derivada de
  psi-comm — ver volcado neural [transmisión conceptual].
    > link
    > Enter phrase: ___________
  `
);

registerLines(
  vfs.specimen_purpose_analysis.content,
  `
  ANÁLISE DE FUNÇÃO E PROPÓSITO DOS ESPÉCIMES
  CLASSIFICAÇÃO: RESTRITO — 22-FEV-1996
  CONCLUSÃO: As entidades recuperadas são ferramentas, não emissários.
  Evidência anatômica indica engenharia deliberada:
  órgãos sensoriais otimizados para observação, densidade neural
  excedendo requisitos corporais, sistema digestivo simplificado.
  Sem resposta imunológica. Sem capacidade reprodutiva.
  Unidades de reconhecimento. Construídas com propósito. Nunca destinadas
  a sobreviver ou representar seus criadores.
  IMPLICAÇÃO: Se a Terra recebeu batedores, passou na triagem.
  Se os batedores transmitiram, fomos catalogados.
  Algo agora sabe o que somos e quanto valemos.
  [ASSINATURA SUPRIMIDA]
  `,
  `
  ANÁLISIS DE FUNCIÓN Y PROPÓSITO DE ESPECÍMENES
  CLASIFICACIÓN: RESTRINGIDO — 22-FEB-1996
  CONCLUSIÓN: Las entidades recuperadas son herramientas, no emisarios.
  Evidencia anatómica indica ingeniería deliberada:
  órganos sensoriales optimizados para observación, densidad neural
  excediendo requisitos corporales, sistema digestivo simplificado.
  Sin respuesta inmunológica. Sin capacidad reproductiva.
  Unidades de reconocimiento. Construidas con propósito. Nunca destinadas
  a sobrevivir o representar a sus creadores.
  IMPLICACIÓN: Si la Tierra recibió exploradores, pasó la selección.
  Si los exploradores transmitieron, hemos sido catalogados.
  Algo ahora sabe lo que somos y cuánto valemos.
  [FIRMA SUPRIMIDA]
  `
);

registerLines(
  vfs.window_clarification.content,
  `
  MEMORANDO — ESCLARECIMENTO DA REFERÊNCIA A 2026
  CLASSIFICAÇÃO: VERMELHO — 01-ABR-1996
  A TODO PESSOAL AUTORIZADO:
  Vários colegas interpretam transmissões recuperadas
  como previsão de invasão em 2026. Estavam errados.
  2026 NÃO é uma data de invasão ou evento.
  2026 É uma janela de transição:
    - Fim da fase de reconhecimento
    - Ativação de sistemas indiretos
    - Ponto além do qual intervenção se torna impossível
  Nada chega. Algo muda.
  2026 é quando se torna irreversível.
  Não há protocolo de defesa. Sem contramedida.
  Sem adversário a enfrentar.
  O Ministério foi informado. Sua única resposta foi
  reclassificar este memorando para VERMELHO.
  [ASSINATURA SUPRIMIDA]
  `,
  `
  MEMORÁNDUM — ACLARACIÓN DE LA REFERENCIA A 2026
  CLASIFICACIÓN: ROJO — 01-ABR-1996
  A TODO EL PERSONAL AUTORIZADO:
  Varios colegas interpretan transmisiones recuperadas
  como predicción de invasión en 2026. Estaban equivocados.
  2026 NO es una fecha de invasión o evento.
  2026 ES una ventana de transición:
    - Fin de la fase de reconocimiento
    - Activación de sistemas indirectos
    - Punto más allá del cual la intervención se vuelve imposible
  Nada llega. Algo cambia.
  2026 es cuando se vuelve irreversible.
  No hay protocolo de defensa. Sin contramedida.
  Sin adversario que enfrentar.
  El Ministerio fue informado. Su única respuesta fue
  reclasificar este memorándum a ROJO.
  [FIRMA SUPRIMIDA]
  `
);

registerLines(
  vfs.extraction_mechanism.content,
  `
  ANÁLISE INTERNA — HIPÓTESE DE EXTRAÇÃO DE ENERGIA
  CLASSIFICAÇÃO: VERMELHO — 18-MAR-1996
  Duas frases recorrem em todas as três extrações
  neurais dos espécimes:
    "cognição superior aumenta o rendimento"
    referência à densidade populacional — bilhões
  Nosso linguista insiste que não são pensamentos.
  São instruções. Embutidas. Como firmware.
  Inteligência é o recurso. Tamanho da população
  determina viabilidade. Estavam calculando rendimento.
  De nós.
  Sem referências a destruição. Se o recurso é
  atividade cognitiva, matar a fonte encerra
  o fornecimento. A extração deve ser invisível.
  Deus me livre — minhas mãos não param de tremer.
  [ASSINATURA SUPRIMIDA]
  `,
  `
  ANÁLISIS INTERNO — HIPÓTESIS DE EXTRACCIÓN DE ENERGÍA
  CLASIFICACIÓN: ROJO — 18-MAR-1996
  Dos frases recurren en las tres extracciones
  neurales de los especímenes:
    "cognición superior aumenta el rendimiento"
    referencia a densidad poblacional — miles de millones
  Nuestro lingüista insiste en que no son pensamientos.
  Son instrucciones. Integradas. Como firmware.
  La inteligencia es el recurso. El tamaño de la población
  determina viabilidad. Estaban calculando rendimiento.
  De nosotros.
  Sin referencias a destrucción. Si el recurso es
  actividad cognitiva, matar la fuente termina
  el suministro. La extracción debe ser invisible.
  Dios me libre — mis manos no dejan de temblar.
  [FIRMA SUPRIMIDA]
  `
);

registerLines(
  vfs.data_reconstruction_util.content,
  `
  UTILITÁRIO — FERRAMENTA DE RECONSTRUÇÃO DE DADOS v1.7 (LEGADO)
  Este utilitário reconstrói segmentos de dados fragmentados.
  USO:
    script <script_content>
  FORMATO DE SCRIPT REQUERIDO:
    Um script de reconstrução válido deve conter:
      - Comando INIT
      - Especificação TARGET (caminho de arquivo válido)
      - Comando EXEC
  EXEMPLO:
    script INIT;TARGET=/admin/fragment.dat;EXEC
  ALVOS DISPONÍVEIS:
    /admin/neural_fragment.dat    [FRAGMENTADO]
    /comms/psi_residue.log        [CORROMPIDO]
  NOTA: Reconstrução bem-sucedida pode revelar conteúdo oculto.
  `,
  `
  UTILIDAD — HERRAMIENTA DE RECONSTRUCCIÓN DE DATOS v1.7 (LEGADO)
  Esta utilidad reconstruye segmentos de datos fragmentados.
  USO:
    script <script_content>
  FORMATO DE SCRIPT REQUERIDO:
    Un script de reconstrucción válido debe contener:
      - Comando INIT
      - Especificación TARGET (ruta de archivo válida)
      - Comando EXEC
  EJEMPLO:
    script INIT;TARGET=/admin/fragment.dat;EXEC
  OBJETIVOS DISPONIBLES:
    /admin/neural_fragment.dat    [FRAGMENTADO]
    /comms/psi_residue.log        [CORROMPIDO]
  NOTA: La reconstrucción exitosa puede revelar contenido oculto.
  `
);

registerLines(
  vfs.trust_protocol_memo.content,
  `
  MEMORANDO DE SEGURANÇA OPERACIONAL — OSM-1993-X
  DE: O Diretor, Projetos Especiais
  DATA: 13-OUT-1993
  Em vista de recentes preocupações com segurança, efetivo
  imediatamente: NÃO COMPARTILHE NADA ALÉM DO SEU ESCOPO.
  Informações sobre projetos em andamento devem ser compartilhadas
  sob estrita base de necessidade de conhecimento. Mesmo colegas com
  autorização apropriada não devem receber detalhes além
  do escopo designado.
  Consciência operacional plena é distribuída entre
  departamentos e arquivos. Isto é por design.
  Aqueles que necessitam contexto mais amplo devem submeter Formulário OSM-7
  através de seu chefe de divisão.
  ADENDO (manuscrito):
    "Quem sabe demais, carrega peso demais."
    (Quem sabe demais, carrega peso demais.)
  `,
  `
  MEMORÁNDUM DE SEGURIDAD OPERACIONAL — OSM-1993-X
  DE: El Director, Proyectos Especiales
  FECHA: 13-OCT-1993
  En vista de recientes preocupaciones de seguridad, efectivo
  inmediatamente: NO COMPARTA NADA FUERA DE SU ÁMBITO.
  Información sobre proyectos en curso debe compartirse
  bajo estricta base de necesidad de conocimiento. Incluso colegas con
  autorización apropiada no deben recibir detalles fuera
  del ámbito asignado.
  Conciencia operacional plena se distribuye entre
  departamentos y archivos. Esto es por diseño.
  Quienes requieran contexto más amplio deben presentar Formulario OSM-7
  a través de su jefe de división.
  ADDENDUM (manuscrito):
    "Quien sabe demasiado, carga demasiado peso."
    (Quien sabe demasiado, carga demasiado peso.)
  `
);

registerLines(
  vfs.jardim_andere_report.content,
  `
  RELATÓRIO DE CAMPO — CONTATO INICIAL
  LOCALIZAÇÃO: Jardim Andere, Varginha, Minas Gerais
  DATA: 20-JAN-1996, 15:30h
  TESTEMUNHAS: Três civis do sexo feminino, idades 14-22.
  Terreno baldio entre Rua Suécia e Rua Benevenuto Brás.
  Sujeitos observaram figura agachada ~1.6m de altura.
  Pele marrom escura, "oleosa." Três cristas cranianas.
  Olhos grandes vermelhos. Forte odor de amônia.
  Uma relatou "sentir os pensamentos dele."
  CRONOLOGIA:
    13-JAN: NORAD detecta anomalia sobre Minas Gerais
    19-JAN: Fazendeiros relatam "estrela cadente" perto de Varginha
    20-JAN 03:30h: Bombeiros recebem chamadas sobre criatura
    20-JAN 08:00h: Cordões militares estabelecidos
    20-JAN 15:30h: Avistamento em Jardim Andere (este relatório)
    20-JAN 22:00h: Incidente no Hospital São Sebastião
  `,
  `
  INFORME DE CAMPO — CONTACTO INICIAL
  UBICACIÓN: Jardim Andere, Varginha, Minas Gerais
  FECHA: 20-ENE-1996, 15:30h
  TESTIGOS: Tres civiles femeninas, edades 14-22.
  Terreno baldío entre Rua Suécia y Rua Benevenuto Brás.
  Sujetos observaron figura agachada ~1.6m de altura.
  Piel marrón oscura, "aceitosa." Tres crestas craneales.
  Ojos grandes rojos. Fuerte olor a amoníaco.
  Una reportó "sentir sus pensamientos."
  CRONOLOGÍA:
    13-ENE: NORAD detecta anomalía sobre Minas Gerais
    19-ENE: Granjeros reportan "estrella fugaz" cerca de Varginha
    20-ENE 03:30h: Bomberos reciben llamadas sobre criatura
    20-ENE 08:00h: Cordones militares establecidos
    20-ENE 15:30h: Avistamiento en Jardim Andere (este informe)
    20-ENE 22:00h: Incidente en Hospital São Sebastião
  `
);

registerLines(
  vfs.copa_94_celebration_memo.content,
  `
  MEMORANDO INTERNO — INSTALAÇÕES
  DATA: 19-JUL-1994
  RE: Diretrizes de Celebração da Copa do Mundo
  Após a vitória do Brasil, as seguintes regras se aplicam:
    1. Televisão: SOMENTE em áreas de descanso.
    2. Caipirinha: apenas em eventos após o expediente.
    3. Samba: não deve exceder 70dB.
    4. "É TETRA!" limitado a três (3) vezes por hora.
  APROVADO: Bandeira brasileira (tamanho regulamentar), fotos do time.
  PROIBIDO: Confete (risco de incêndio), fogos de artifício, vuvuzelas.
  NOTA DO DIRETOR:
    "Parabéns a todos. Mas o universo não pausa
     para futebol."
    "Nem tudo é festa. Voltem ao trabalho segunda-feira."
  Em retrospecto, deveríamos ter comemorado mais.
  `,
  `
  MEMORÁNDUM INTERNO — INSTALACIONES
  FECHA: 19-JUL-1994
  RE: Directrices de Celebración de la Copa del Mundo
  Tras la victoria de Brasil, se aplica lo siguiente:
    1. Televisión: SOLO en áreas de descanso.
    2. Caipirinha: solo en eventos fuera de horario.
    3. Samba: no debe exceder 70dB.
    4. "É TETRA!" limitado a tres (3) veces por hora.
  APROBADO: Bandera brasileña (tamaño reglamentario), fotos del equipo.
  PROHIBIDO: Confeti (riesgo de incendio), fuegos artificiales, vuvuzelas.
  NOTA DEL DIRECTOR:
    "Felicitaciones a todos. Pero el universo no se detiene
     por el fútbol."
    "No todo es fiesta. Vuelvan al trabajo el lunes."
  En retrospectiva, debimos haber celebrado más.
  `
);

registerLines(
  vfs.dialup_connection_log.content,
  `
  LOG DE CONEXÃO DO MODEM — UPLINK EXTERNO
  DISPOSITIVO: US Robotics Sportster 28.8 | 18-JAN-1996
  18:42:03 ATDT 0xx-555-0147
  18:42:07 CONNECT 28800/ARQ/V34/LAPM/V42BIS
  18:42:15 IP atribuído: 200.xxx.xxx.47
  18:43:01 HTTP GET geocities.com/SiliconValley/...
  18:43:47 HTTP GET altavista.digital.com/...
  18:44:22 TELNET bbs.minas.com.br:23
  18:46:12 IRC CONNECT irc.brasnet.org #bate-papo
  <streber74> alguem viu o jogo ontem?
  <mineiro99> foi roubado irmao
  <streber74> kkkk sempre a mesma coisa
  <nightowl> mudando de assunto, alguem tem o driver
             da soundblaster?
  18:58:44 NO CARRIER
  COBRANÇA: 16 min @ R$0.85/min = R$13.60
  Dois dias depois o céu caiu e o modem nunca mais
  conectou. Algumas conversas acabam para sempre.
  `,
  `
  LOG DE CONEXIÓN DEL MÓDEM — ENLACE EXTERNO
  DISPOSITIVO: US Robotics Sportster 28.8 | 18-ENE-1996
  18:42:03 ATDT 0xx-555-0147
  18:42:07 CONNECT 28800/ARQ/V34/LAPM/V42BIS
  18:42:15 IP asignado: 200.xxx.xxx.47
  18:43:01 HTTP GET geocities.com/SiliconValley/...
  18:43:47 HTTP GET altavista.digital.com/...
  18:44:22 TELNET bbs.minas.com.br:23
  18:46:12 IRC CONNECT irc.brasnet.org #bate-papo
  <streber74> alguien vio el partido ayer?
  <mineiro99> fue un robo hermano
  <streber74> jajaja siempre lo mismo
  <nightowl> cambiando de tema, alguien tiene el driver
             de la soundblaster?
  18:58:44 NO CARRIER
  FACTURACIÓN: 16 min @ R$0.85/min = R$13.60
  Dos días después el cielo cayó y el módem nunca
  volvió a conectar. Algunas conversaciones terminan para siempre.
  `
);

registerLines(
  vfs.ascii_signature_bak.content,
  `
  ARQUIVO RECUPERADO — BACKUP DE DIRETÓRIO DE USUÁRIO
  PROPRIETÁRIO: [SUPRIMIDO]
  -- 
      _____
     /     \\    "O BRASIL É O PAÍS DO FUTURO"
    | () () |
     \\  ^  /    A realidade é só uma ilusão,
      |||||     mas uma bem persistente.
      |||||              — A. Einstein
    streber@bbs.unesp.br
    PGP Key: 0xDEADBEEF
    Melhor visualizado no Netscape Navigator 2.0
    <BLINK>EM CONSTRUÇÃO</BLINK>
    Esta .sig é trazida por muito café,
    pouco sono e saudade.
    O futuro chegou. Não era o que esperávamos.
  `,
  `
  ARCHIVO RECUPERADO — RESPALDO DE DIRECTORIO DE USUARIO
  PROPIETARIO: [SUPRIMIDO]
  -- 
      _____
     /     \\    "O BRASIL É O PAÍS DO FUTURO"
    | () () |
     \\  ^  /    La realidad es solo una ilusión,
      |||||     pero una bien persistente.
      |||||              — A. Einstein
    streber@bbs.unesp.br
    PGP Key: 0xDEADBEEF
    Mejor visto en Netscape Navigator 2.0
    <BLINK>EN CONSTRUCCIÓN</BLINK>
    Esta .sig es cortesía de mucho café,
    poco sueño y saudade.
    El futuro llegó. No era lo que esperábamos.
  `
);

registerLines(
  vfs.cafeteria_menu_jan96.content,
  `
  CARDÁPIO DA CAFETERIA — SEMANA 03 (15-19 JAN 1996)
  SEGUNDA: Feijoada completa, arroz, couve, farofa.
  TERÇA: Frango à passarinho, purê de batata.
  QUARTA: Peixe grelhado, feijão tropeiro.
  QUINTA: Carne assada, macarrão ao sugo.
  SEXTA-FEIRA:
    *** CARDÁPIO CANCELADO ***
    [RESPOSTA A INCIDENTE ATIVA]
    Rações de emergência distribuídas.
  Cardápio de sexta cancelado devido a bloqueio
  não programado da instalação. Ver RELATÓRIO DE INCIDENTE 1996-01-VG.
  Equipe da cafeteria redesignada para apoio a operações.
  Máquinas de venda automática permanecem operacionais.
  Dona Maria pede desculpas pelo inconveniente.
  Ela não sabe o que aconteceu na sexta.
  Nenhum de nós vai contar a ela.
  `,
  `
  MENÚ DE CAFETERÍA — SEMANA 03 (15-19 ENE 1996)
  LUNES: Feijoada completa, arroz, col, farofa.
  MARTES: Pollo frito, puré de patata.
  MIÉRCOLES: Pescado a la plancha, frijoles tropeiros.
  JUEVES: Carne asada, macarrones al sugo.
  VIERNES:
    *** MENÚ CANCELADO ***
    [RESPUESTA A INCIDENTE ACTIVA]
    Raciones de emergencia distribuidas.
  Menú del viernes cancelado por bloqueo
  no programado de la instalación. Ver INFORME DE INCIDENTE 1996-01-VG.
  Personal de cafetería reasignado a operaciones de apoyo.
  Máquinas expendedoras siguen operativas.
  Dona Maria se disculpa por la inconveniencia.
  Ella no sabe qué pasó el viernes.
  Ninguno de nosotros se lo dirá.
  `
);

registerLines(
  vfs.incident_report_vg.content,
  `
  RELATÓRIO DE INCIDENTE 1996-01-VG
  DATA: 20-JAN-1996
  CLASSIFICAÇÃO: RESTRITO — APENAS COMANDO DE SETOR
  Às 0215, alarme de perímetro acionado — Setor 3.
  Patrulha despachada. Campo de destroços encontrado, raio de 40m.
  Material não identificado. Incompatível com aeronave.
  Às 0340, três espécimes biológicos recuperados de
  Jardim Andere. Dois responsivos. Um ferido.
  RESPOSTA DA INSTALAÇÃO:
    Cafeteria fechada. Fornecimento de água redirecionado.
    Níveis de subsolo selados. Prioridade de gerador ativada.
    Todas as férias canceladas. Emendas de NDA distribuídas.
  NARRATIVA DE COBERTURA: "Vazamento químico — origem industrial."
  Mídia local contatada via Protocolo SOMBRA.
  REFERÊNCIA CRUZADA: bio_containment_log_deleted.txt
  REFERÊNCIA CRUZADA: patrol_observation_shift_04.txt
  `,
  `
  INFORME DE INCIDENTE 1996-01-VG
  FECHA: 20-ENE-1996
  CLASIFICACIÓN: RESTRINGIDO — SOLO COMANDO DE SECTOR
  A las 0215, alarma perimetral activada — Sector 3.
  Patrulla despachada. Campo de escombros hallado, radio de 40m.
  Material no identificado. Incompatible con aeronave.
  A las 0340, tres especímenes biológicos recuperados de
  Jardim Andere. Dos responsivos. Uno herido.
  RESPUESTA DE LA INSTALACIÓN:
    Cafetería cerrada. Suministro de agua redirigido.
    Niveles de sótano sellados. Prioridad de generador activada.
    Todas las vacaciones canceladas. Enmiendas de NDA distribuidas.
  NARRATIVA DE COBERTURA: "Derrame químico — origen industrial."
  Medios locales contactados vía Protocolo SOMBRA.
  REFERENCIA CRUZADA: bio_containment_log_deleted.txt
  REFERENCIA CRUZADA: patrol_observation_shift_04.txt
  `
);

registerLines(
  vfs.save_evidence_script.content,
  `
  #!/bin/bash
  # SCRIPT DE BACKUP EMERGENCIAL — Criado por UFO74
  # Se você está lendo isto, a evidência importa.
  # Salve antes que cortem a conexão.
  echo "Iniciando backup emergencial..."
  echo ""
  # Preservar o que encontramos
  for evidence in /collected/*.dat; do
      cp "$evidence" /external/backup/
      echo "[OK] $(basename $evidence) salvo"
  done
  echo ""
  echo "Backup completo. Evidência persistida."
  echo "AVISO: Desconexão iminente..."
  # INSTRUÇÕES: Execute com: run save_evidence.sh
  # A verdade não se salva sozinha.
  `,
  `
  #!/bin/bash
  # SCRIPT DE RESPALDO DE EMERGENCIA — Creado por UFO74
  # Si estás leyendo esto, la evidencia importa.
  # Guárdala antes de que corten la conexión.
  echo "Iniciando respaldo de emergencia..."
  echo ""
  # Preservar lo que encontramos
  for evidence in /collected/*.dat; do
      cp "$evidence" /external/backup/
      echo "[OK] $(basename $evidence) guardado"
  done
  echo ""
  echo "Respaldo completo. Evidencia persistida."
  echo "ADVERTENCIA: Desconexión inminente..."
  # INSTRUCCIONES: Ejecutar con: run save_evidence.sh
  # La verdad no se salva sola.
  `
);

registerLines(
  vfs.purge_trace_script.content,
  `
  #!/bin/bash
  # UTILITÁRIO DE PURGA DE RASTRO — NÓ LEGADO
  # Limpa artefatos de rastro dos buffers voláteis.
  # Use apenas durante janelas de rastro ativas.
  # Eles estão observando. Isto lhe compra tempo.
  echo "PURGA: Iniciando limpeza de buffer de rastro..."
  echo ""
  echo "[OK] TRACE_QUEUE limpo"
  echo "[OK] ROUTE_TABLE removido"
  echo "[OK] SESSION_LOG truncado"
  echo ""
  echo "AVISO: Contramedidas reiniciadas. Espere re-varredura."
  # INSTRUÇÕES: Execute com: run purge_trace.sh
  # Você não terá uma segunda chance.
  `,
  `
  #!/bin/bash
  # UTILIDAD DE PURGA DE RASTRO — NODO LEGADO
  # Limpia artefactos de rastro de los buffers volátiles.
  # Usar solo durante ventanas de rastro activas.
  # Están observando. Esto le compra tiempo.
  echo "PURGA: Iniciando limpieza de buffer de rastro..."
  echo ""
  echo "[OK] TRACE_QUEUE limpiado"
  echo "[OK] ROUTE_TABLE depurado"
  echo "[OK] SESSION_LOG truncado"
  echo ""
  echo "AVISO: Contramedidas reiniciadas. Espere re-escaneo."
  # INSTRUCCIONES: Ejecutar con: run purge_trace.sh
  # No tendrá una segunda oportunidad.
  `
);

registerLines(
  vfs.trace_purge_memo.content,
  `
  LOG DE SEGURANÇA — EVENTO DE PURGA DE RASTRO
  TIMESTAMP: [SESSÃO ATUAL]
  Utilitário de purga legado executado durante rastro ativo.
  Integridade do buffer reiniciada. Janela de rastro reaberta.
  Operador demonstrou conhecimento de ferramentas internas.
  Sessão classificada como ALTA PRIORIDADE.
  Avaliação: Este operador compreende infraestrutura
  que nunca foi documentada em materiais de treinamento.
  Ou possuem conhecimento interno, ou são
  mais engenhosos do que o previsto.
  Recomendação: Manter vigilância. Não encerrar.
  Deixe-os encontrar o que procuram.
  Precisamos saber quem os enviou.
  `,
  `
  LOG DE SEGURIDAD — EVENTO DE PURGA DE RASTRO
  TIMESTAMP: [SESIÓN ACTUAL]
  Utilidad de purga legada ejecutada durante rastro activo.
  Integridad del buffer reiniciada. Ventana de rastro reabierta.
  Operador demostró conocimiento de herramientas internas.
  Sesión clasificada como ALTA PRIORIDAD.
  Evaluación: Este operador comprende infraestructura
  que nunca fue documentada en materiales de entrenamiento.
  O tienen conocimiento interno, o son
  más ingeniosos de lo previsto.
  Recomendación: Mantener vigilancia. No terminar.
  Déjelos encontrar lo que buscan.
  Necesitamos saber quién los envió.
  `
);

registerLines(
  vfs.integrity_hashes_register.content,
  `
  REGISTRO DE INTEGRIDADE — HASHES DE EVIDÊNCIA
  CLASSIFICAÇÃO: RESTRITO — 27-JAN-1996
  Finalidade: Validar artefatos de evidência contra adulteração.
  CONJUNTO DE HASHES:
    material_x_analysis.dat     4A9F-77C2-11D0
    transport_log_96.txt        98B1-2E14-CC7A
    autopsy_alpha.log           7D0C-FF22-919B
    transcript_core.enc         61E4-09D3-2B7F
    thirty_year_cycle.txt       2D88-AC91-771E
  Divergência de hash indica narrativa alterada.
  Preservar originais para verificação externa.
  Alguém antecipou a purga. Esses hashes
  são a única prova de que os originais existiram.
  `,
  `
  REGISTRO DE INTEGRIDAD — HASHES DE EVIDENCIA
  CLASIFICACIÓN: RESTRINGIDO — 27-ENE-1996
  Finalidad: Validar artefactos de evidencia contra adulteración.
  CONJUNTO DE HASHES:
    material_x_analysis.dat     4A9F-77C2-11D0
    transport_log_96.txt        98B1-2E14-CC7A
    autopsy_alpha.log           7D0C-FF22-919B
    transcript_core.enc         61E4-09D3-2B7F
    thirty_year_cycle.txt       2D88-AC91-771E
  Divergencia de hash indica narrativa alterada.
  Preservar originales para verificación externa.
  Alguien anticipó la purga. Estos hashes
  son la única prueba de que los originales existieron.
  `
);

registerLines(
  vfs.ghost_session_log.content,
  `
  CAPTURA DE SESSÃO RESIDUAL — QUADRO FANTASMA
  TIMESTAMP: [SUPRIMIDO]
  [RASTRO PARCIAL DE COMANDOS]
    > cd /storage/quarantine
    > open bio_container.log
    > open autopsy_alpha.log
    > cd /comms/psi
    > open transcript_core.enc
    > connect autopsy_alpha.log transcript_core.enc
    > iddqd
    > god status
  Operador anterior alcançou vinculação coerente antes da purga.
  Trilhas de evidência permanecem viáveis.
  Frase de manutenção não documentada aceita após colapso de rastro.
  Nenhuma referência correspondente existe nos manuais atuais do operador.
  Eles estiveram aqui antes de você. Encontraram o que você
  está procurando. Então a sessão foi encerrada.
  Não repita os erros deles.
  `,
  `
  CAPTURA DE SESIÓN RESIDUAL — CUADRO FANTASMA
  TIMESTAMP: [SUPRIMIDO]
  [RASTRO PARCIAL DE COMANDOS]
    > cd /storage/quarantine
    > open bio_container.log
    > open autopsy_alpha.log
    > cd /comms/psi
    > open transcript_core.enc
    > connect autopsy_alpha.log transcript_core.enc
    > iddqd
    > god status
  Operador anterior logró vinculación coherente antes de la purga.
  Rastros de evidencia permanecen viables.
  Frase de mantenimiento no documentada aceptada tras colapso de rastro.
  Ninguna referencia correspondiente existe en los manuales actuales del operador.
  Estuvieron aquí antes que usted. Encontraron lo que usted
  está buscando. Luego la sesión fue terminada.
  No repita sus errores.
  `
);

registerLines(
  vfs.redaction_keycard.content,
  `
  CARTÃO DE ANULAÇÃO DE REDAÇÃO — ÍNDICE 3
  DATA: 18-JAN-1996
  CADEIA DE AUTORIZAÇÃO:
    "PHASE TWO IS ALREADY UNDERWAY"
  Verifique contra memorandos redigidos para checagem de integridade.
  Quem deixou este cartão aqui queria que fosse encontrado.
  Isso deveria lhe preocupar mais do que seu conteúdo.
  `,
  `
  TARJETA DE ANULACIÓN DE REDACCIÓN — ÍNDICE 3
  FECHA: 18-ENE-1996
  CADENA DE AUTORIZACIÓN:
    "PHASE TWO IS ALREADY UNDERWAY"
  Verificar contra memorandos redactados para comprobación de integridad.
  Quien dejó esta tarjeta aquí quería que fuese encontrada.
  Eso debería preocuparle más que su contenido.
  `
);

registerLines(
  vfs.redaction_override_memo.content,
  `
  MEMORANDO ADMIN — CORREÇÃO DE REDAÇÃO
  CLASSIFICAÇÃO: RESTRITO — 19-JAN-1996
  LINHA CORRIGIDA:
    PHASE ███ IS ██████ UNDERWAY
  Não armazene a linha completa em sistemas não seguros.
  A redação existe por um motivo. O que se encontra
  sob ela não é para todos os níveis de autorização.
  Algumas verdades são distribuídas em fragmentos.
  `,
  `
  MEMORÁNDUM ADMIN — CORRECCIÓN DE REDACCIÓN
  CLASIFICACIÓN: RESTRINGIDO — 19-ENE-1996
  LÍNEA CORREGIDA:
    PHASE ███ IS ██████ UNDERWAY
  No almacene la línea completa en sistemas no seguros.
  La redacción existe por una razón. Lo que yace
  debajo no es para todos los niveles de autorización.
  Algunas verdades se distribuyen en fragmentos.
  `
);

registerLines(
  vfs.audio_transcript_brief.content,
  `
  SEGURANÇA INTERNA — TRANSCRIÇÃO DE LINHA RESERVADA
  DATA: 21-JAN-1996 — 02:12
  CLASSIFICAÇÃO: USO INTERNO — NÃO ARQUIVAR
  VOZ A: Masculina. ~40 anos. Não solicitada.
  VOZ B: Masculina. ~50 anos. Oficial receptor.
  [TRANSCRIÇÃO PARCIAL]
  A: "...muitas pessoas viram. você não pode silenciá-las."
  B: "nós controlamos o que dizem."
  A: "...o que quer que lhe digam sobre os corpos —"
  B: "pare. os corpos civis."
  A: "os outros."
  B: "não houve outros. diga."
  A: "..."
  B: "DIGA."
  A: "...corpos humanos."
  B: "não ligue para este número novamente."
  [LINHA DESCONECTADA]
  NOTA DO ANALISTA: Irrastreável. Instinto: não desconsiderar.
  `,
  `
  SEGURIDAD INTERNA — TRANSCRIPCIÓN DE LÍNEA RESERVADA
  FECHA: 21-JAN-1996 — 02:12
  CLASIFICACIÓN: USO INTERNO — NO ARCHIVAR
  VOZ A: Masculina. ~40 años. No solicitada.
  VOZ B: Masculina. ~50 años. Oficial receptor.
  [TRANSCRIPCIÓN PARCIAL]
  A: "...demasiada gente lo vio. no puede silenciarlos."
  B: "nosotros controlamos lo que dicen."
  A: "...lo que sea que le digan sobre los cuerpos —"
  B: "pare. los cuerpos civiles."
  A: "los otros."
  B: "no hubo otros. dígalo."
  A: "..."
  B: "DÍGALO."
  A: "...cuerpos humanos."
  B: "no llame a este número de nuevo."
  [LÍNEA DESCONECTADA]
  NOTA DEL ANALISTA: Irrastreable. Instinto: no desestimar.
  `
);

registerLines(
  vfs.reconstructed_neural.content,
  `
  DADOS RECONSTRUÍDOS — FRAGMENTO NEURAL
  RECONSTRUÇÃO: BEM-SUCEDIDA
  Fragmento capturado durante momentos finais da
  consciência do Espécime GAMMA.
  [TRANSCRIÇÃO NEURAL DIRETA]
  ...missão completa... transmissão recebida...
  ...esta forma expira... aceitável...
  ...nós não somos indivíduos... somos função...
  ...os vigilantes não lamentam...
  ...os vigilantes não celebram...
  ...eles apenas medem...
  ...sua espécie também mede...
  ...mas vocês medem as coisas erradas...
  ...vocês contam anos... eles contam mentes...
  ...vocês temem a morte...
  ...há continuações piores...
  NOTA DO ANALISTA: Classificado além da autorização normal.
  Implica que a consciência continua após a extração.
  Indefinidamente. O comitê decidiu que isso apenas
  causaria dano ao moral do pessoal.
  `,
  `
  DATOS RECONSTRUIDOS — FRAGMENTO NEURAL
  RECONSTRUCCIÓN: EXITOSA
  Fragmento capturado durante momentos finales de la
  consciencia del Espécimen GAMMA.
  [TRANSCRIPCIÓN NEURAL DIRECTA]
  ...misión completa... transmisión recibida...
  ...esta forma expira... aceptable...
  ...no somos individuos... somos función...
  ...los vigilantes no se lamentan...
  ...los vigilantes no celebran...
  ...solo miden...
  ...su especie también mide...
  ...pero miden las cosas equivocadas...
  ...ustedes cuentan años... ellos cuentan mentes...
  ...ustedes temen la muerte...
  ...hay continuaciones peores...
  NOTA DEL ANALISTA: Clasificado más allá de la autorización normal.
  Implica que la consciencia continúa después de la extracción.
  Indefinidamente. El comité decidió que esto solo
  causaría daño a la moral del personal.
  `
);

registerLines(
  vfs.surveillance_footage_recovery.content,
  `
  DADOS DE VÍDEO RECUPERADOS — PARCIAL
  FONTE: INSTALAÇÃO DE CONTENÇÃO B — CAM 07
  DATA: 1996-01-20 03:47:22
  STATUS: Recuperação parcial de quadros. Integridade: 47%.
  Corrupção temporal significativa detectada.
  Filmagem de vigilância da câmara de observação
  de contenção. Sujeito exibe padrões de movimento anômalos.
  Faixa de áudio corrompida além de recuperação.
  AVISO: Conteúdo visual pode causar desorientação.
  Três técnicos relataram náusea após revisão dos
  quadros recuperados. Uma se recusou a retornar ao serviço.
  Ela disse que o sujeito estava olhando para a câmera.
  A câmera estava atrás de um espelho falso.
  `,
  `
  DATOS DE VIDEO RECUPERADOS — PARCIAL
  FUENTE: INSTALACIÓN DE CONTENCIÓN B — CAM 07
  FECHA: 1996-01-20 03:47:22
  ESTADO: Recuperación parcial de cuadros. Integridad: 47%.
  Corrupción temporal significativa detectada.
  Filmación de vigilancia de la cámara de observación
  de contención. Sujeto exhibe patrones de movimiento anómalos.
  Pista de audio corrompida sin posibilidad de recuperación.
  ADVERTENCIA: Contenido visual puede causar desorientación.
  Tres técnicos reportaron náuseas tras revisar los
  cuadros recuperados. Una se negó a volver al servicio.
  Dijo que el sujeto estaba mirando a la cámara.
  La cámara estaba detrás de un espejo falso.
  `
);

registerLines(
  vfs.neural_cluster_experiment.content,
  `
  COMUN./EXPERIMENTAL — CLUSTER NEURAL
  CLASSIFICAÇÃO: RESTRITO | REF: NC-7/OBS-RESIDUAL
  Tentativa experimental de construir rede neural sintética
  modelada a partir de tecido de batedor dissecado. Objetivo:
  emular atividade perceptual residual, não consciência.
  O cluster não responde a diálogo. Emite
  resíduos conceituais fragmentados quando estimulado.
  Saídas são não interativas, não intencionais.
  Canal de estimulação não documentado e instável.
  Uso não autorizado fora de revisão de contenção.
  Dr. Santos solicitou a destruição do cluster após
  sua terceira sessão. Ele disse que estava sonhando.
  Não temos protocolo para isso.
  `,
  `
  COMUN./EXPERIMENTAL — CLÚSTER NEURAL
  CLASIFICACIÓN: RESTRINGIDO | REF: NC-7/OBS-RESIDUAL
  Intento experimental de construir red neural sintética
  modelada a partir de tejido de explorador diseccionado. Objetivo:
  emular actividad perceptual residual, no consciencia.
  El clúster no responde al diálogo. Emite
  residuos conceptuales fragmentados cuando es estimulado.
  Salidas son no interactivas, no intencionales.
  Canal de estimulación no documentado e inestable.
  Uso no autorizado fuera de revisión de contención.
  Dr. Santos solicitó la destrucción del clúster tras
  su tercera sesión. Dijo que estaba soñando.
  No tenemos protocolo para eso.
  `
);

registerLines(
  vfs.cargo_transfer_memo.content,
  `
  MEMORANDO INTERNO — COORDENAÇÃO DE TRANSFERÊNCIA DE CARGA
  DATA: 22-JAN-1996 | CLASSIFICAÇÃO: ROTINA
  O equipamento recuperado chegou ontem à noite.
  Inspeção inicial concluída. Conteúdo intacto apesar das
  condições de transporte. Desgaste superficial dentro dos parâmetros.
  Requisitos de armazenamento:
    - Temperatura: Condições padrão de armazém
    - Umidade: Controlada
    - Acesso: Restrito conforme protocolo padrão
  Parceiros estrangeiros notificados. Equipe de coordenação
  esperada dentro de 72 horas.
  Assegurar que a baía de recebimento esteja liberada.
  NOTA: "Equipamento" é o termo aprovado.
  Não descreva o que viu nos caixotes.
  [assinatura ilegível]
  `,
  `
  MEMORÁNDUM INTERNO — COORDINACIÓN DE TRANSFERENCIA DE CARGA
  FECHA: 22-ENE-1996 | CLASIFICACIÓN: RUTINA
  El equipo recuperado llegó ayer por la noche.
  Inspección inicial completa. Contenido intacto a pesar de las
  condiciones de transporte. Desgaste superficial dentro de parámetros.
  Requisitos de almacenamiento:
    - Temperatura: Condiciones estándar de almacén
    - Humedad: Controlada
    - Acceso: Restringido según protocolo estándar
  Socios extranjeros notificados. Equipo de coordinación
  esperado dentro de 72 horas.
  Asegurar que el área de recepción esté despejada.
  NOTA: "Equipo" es el término aprobado.
  No describa lo que vio en las cajas.
  [firma ilegible]
  `
);

registerLines(
  vfs.visitor_briefing.content,
  `
  BRIEFING DE SEGURANÇA — DELEGAÇÃO VISITANTE
  DATA: 24-JAN-1996 | CLASSIFICAÇÃO: INTERNO
  Os visitantes chegam via aeronave particular.
  Acesso total concedido às Instalações 1-3.
  Escolta obrigatória em todos os momentos. Sem fotografias.
  Interesses da delegação:
    - Revisão de equipamento recentemente recuperado
    - Avaliação das condições de armazenamento
    - Coordenação sobre monitoramento futuro
  Acompanhados por equipe técnica própria.
  Nosso papel: observação e cooperação apenas.
  Protocolos padrão de negação plausível permanecem.
  Toda documentação utiliza terminologia aprovada.
  Sem referências diretas. Perguntas ao Escritório de Protocolo.
  Eles os chamaram de "visitantes." A palavra foi escolhida
  cuidadosamente. Poderia significar qualquer um.
  `,
  `
  BRIEFING DE SEGURIDAD — DELEGACIÓN VISITANTE
  FECHA: 24-ENE-1996 | CLASIFICACIÓN: INTERNO
  Los visitantes llegan vía aeronave privada.
  Acceso total concedido a Instalaciones 1-3.
  Escolta obligatoria en todo momento. Sin fotografías.
  Intereses de la delegación:
    - Revisión de equipo recientemente recuperado
    - Evaluación de condiciones de almacenamiento
    - Coordinación sobre monitoreo futuro
  Acompañados por su propio equipo técnico.
  Nuestro rol: observación y cooperación únicamente.
  Protocolos estándar de negación plausible vigentes.
  Toda documentación usa terminología aprobada.
  Sin referencias directas. Consultas a la Oficina de Protocolo.
  Los llamaron "visitantes." La palabra fue elegida
  cuidadosamente. Podría significar cualquiera.
  `
);

registerLines(
  vfs.asset_disposition_report.content,
  `
  RELATÓRIO DE DISPOSIÇÃO DE ATIVOS
  REF: ADR-96-007 | DATA: 28-JAN-1996
  CATEGORIA: Materiais Especiais
    Item A-1: Transferido para parceiro estrangeiro (completo)
    Item A-2: Retido para estudo doméstico
    Item A-3: Degradado durante transporte
    Item B-1: Parcial. Componentes separados.
      Seção primária: Instalação do parceiro
      Componentes secundários: Não divulgados
      Sistema de navegação: Custódia do parceiro
  Instrumentação recuperada mas não funcional.
  Propósito permanece obscuro.
  Ativos distribuídos conforme acordo.
  O relatório usa quatorze eufemismos.
  Eu contei. Nenhum deles muda o que aconteceu.
  `,
  `
  INFORME DE DISPOSICIÓN DE ACTIVOS
  REF: ADR-96-007 | FECHA: 28-ENE-1996
  CATEGORÍA: Materiales Especiales
    Ítem A-1: Transferido a socio extranjero (completo)
    Ítem A-2: Retenido para estudio doméstico
    Ítem A-3: Degradado durante transporte
    Ítem B-1: Parcial. Componentes separados.
      Sección primaria: Instalación del socio
      Componentes secundarios: No divulgados
      Sistema de navegación: Custodia del socio
  Instrumentación recuperada pero no funcional.
  Propósito permanece incierto.
  Activos distribuidos según acuerdo.
  El informe usa catorce eufemismos.
  Los conté. Ninguno cambia lo que ocurrió.
  `
);

registerLines(
  vfs.euphemism_reference.content,
  `
  REFERÊNCIA DE TERMINOLOGIA APROVADA
  PARA: Todo pessoal que manuseia documentação sensível
  Uso de linguagem direta é proibido em registros auditáveis.
  TERMOS APROVADOS:
    "Balão meteorológico"      = Designação de cobertura padrão
    "Espécime de fauna"        = Material biológico recuperado
    "Animal selvagem"          = Sujeito biológico não classificado
    "Equip. agrícola"          = Hardware recuperado
    "Carga especial"           = Remessa classificada
    "Os visitantes"            = Delegação estrangeira
    "Ativos"                   = Itens recuperados (qualquer tipo)
    "Amostras"                 = Material coletado
    "Problemas de transporte"  = Deterioração durante transferência
  Toda documentação deve manter negação plausível
  sob revisão do Congresso.
  Construímos um vocabulário inteiro para evitar dizer
  o que todos vimos. A linguagem funciona. O esquecimento
  não.
  `,
  `
  REFERENCIA DE TERMINOLOGÍA APROBADA
  PARA: Todo el personal que maneja documentación sensible
  Uso de lenguaje directo está prohibido en registros auditables.
  TÉRMINOS APROBADOS:
    "Globo meteorológico"      = Designación de cobertura estándar
    "Espécimen de fauna"       = Material biológico recuperado
    "Animal salvaje"           = Sujeto biológico no clasificado
    "Equipo agrícola"          = Hardware recuperado
    "Carga especial"           = Envío clasificado
    "Los visitantes"           = Delegación extranjera
    "Activos"                  = Ítems recuperados (cualquier tipo)
    "Muestras"                 = Material recolectado
    "Problemas de transporte"  = Deterioro durante transferencia
  Toda documentación debe mantener negación plausible
  bajo revisión del Congreso.
  Construimos un vocabulario entero para evitar decir
  lo que todos vimos. El lenguaje funciona. El olvido
  no.
  `
);


export const RUNTIME_VFS_TRANSLATIONS: Record<Exclude<Language, 'en'>, RuntimeDictionary> = {
  'pt-BR': ptBrTranslations,
  es: esTranslations,
};
