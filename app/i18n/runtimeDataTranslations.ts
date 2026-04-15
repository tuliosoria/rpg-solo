import * as alphaData from '../data/alpha';
import * as archiveData from '../data/archiveFiles';
import * as conspiracyData from '../data/conspiracyFiles';
import * as expansionData from '../data/expansionContent';
import * as narrativeData from '../data/narrativeContent';
import neuralClusterMemo from '../data/neuralClusterMemo';
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

function registerLine(source: string, pt: string, es: string): void {
  ptBrTranslations[source] = pt;
  esTranslations[source] = es;
}

// Archive files

registerLines(
  archiveData.witness_statement_original.content,
  `
  DECLARAÇÃO DE TESTEMUNHA — SEM REDAÇÕES
  ASSUNTO: MARIA ELENA SOUZA
  DATA: 21 DE JANEIRO DE 1996
  CLASSIFICAÇÃO: EXCLUÍDO — NÃO DISTRIBUIR
  ENTREVISTADOR: Por favor, descreva exatamente o que você viu.
  SOUZA: Eram por volta das 3h30. Eu não conseguia dormir por causa do
  calor. Saí para fumar e vi o céu se iluminar.
  Não como um relâmpago. Era... pulsante. Vermelho e branco.
  Então vi aquilo descer. Em silêncio. Sem som algum.
  Caiu em algum lugar além da fazenda, talvez 2 km ao norte.
  ENTREVISTADOR: O que aconteceu depois?
  SOUZA: Corri para dentro. Acordei meu marido. Quando nós
  voltamos para fora, já havia caminhões. Caminhões militares.
  Como chegaram tão rápido? Estamos a 40 km de qualquer coisa.
  [REDACTED IN FINAL VERSION]
  SOUZA: Eu os vi carregando alguma coisa. Não eram destroços.
  Era... era pequeno. Do tamanho de uma criança.
  Mas não era uma criança. As proporções estavam erradas.
  A cabeça era grande demais. Os membros, finos demais.
  Um deles se virou na minha direção. Só por um momento.
  Os olhos dele... eu ainda os vejo quando fecho os meus.
  [END REDACTED SECTION]
  ENTREVISTADOR: Alguém falou com você?
  SOUZA: Um homem de terno escuro. Não era militar.
  Ele disse que eu tinha tido um sonho febril. Que o calor
  pode fazer as pessoas verem coisas que não estão lá.
  Ele me deu um número para ligar se eu me lembrasse
  "corretamente". Disse que o emprego do meu marido dependia disso.
  STATUS: DECLARAÇÃO EXPURGADA DO REGISTRO OFICIAL
  MOTIVO: "Confiabilidade da testemunha comprometida pelo estresse"
  `,
  `
  DECLARACIÓN DE TESTIGO — SIN REDACTAR
  ASUNTO: MARIA ELENA SOUZA
  FECHA: 21 DE ENERO DE 1996
  CLASIFICACIÓN: ELIMINADO — NO DISTRIBUIR
  ENTREVISTADOR: Por favor, describa exactamente lo que vio.
  SOUZA: Eran alrededor de las 3:30 a. m. No podía dormir por el
  calor. Salí a fumar y vi que el cielo se iluminó.
  No como un relámpago. Era... pulsante. Rojo y blanco.
  Entonces vi que bajó. En silencio. Sin ningún sonido.
  Cayó en algún lugar más allá de la fazenda, quizá 2 km al norte.
  ENTREVISTADOR: ¿Qué pasó después?
  SOUZA: Corrí adentro. Desperté a mi esposo. Cuando
  volvimos a salir, ya había camiones. Camiones militares.
  ¿Cómo llegaron tan rápido? Estamos a 40 km de cualquier cosa.
  [REDACTADO EN LA VERSIÓN FINAL]
  SOUZA: Los vi cargar algo. No eran escombros.
  Era... era pequeño. Del tamaño de un niño.
  Pero no era un niño. Las proporciones estaban mal.
  La cabeza era demasiado grande. Las extremidades, demasiado delgadas.
  Uno de ellos se giró hacia mí. Solo por un instante.
  Sus ojos... todavía los veo cuando cierro los míos.
  [FIN DE LA SECCIÓN REDACTADA]
  ENTREVISTADOR: ¿Alguien le habló?
  SOUZA: Un hombre de traje oscuro. No era militar.
  Dijo que yo había tenido un sueño febril. Que el calor
  puede hacer que la gente vea cosas que no están ahí.
  Me dio un número al que llamar si recordaba
  "correctamente". Dijo que el trabajo de mi esposo dependía de eso.
  ESTADO: DECLARACIÓN EXPURGADA DEL REGISTRO OFICIAL
  MOTIVO: "Fiabilidad de la testigo comprometida por el estrés"
  `
);

registerLines(
  archiveData.directive_alpha_draft.content,
  `
  RASCUNHO — DIRETRIZ ALPHA — ITERAÇÃO 1
  DATA: 19 DE JANEIRO DE 1996 — 04:22
  AUTOR: [EXCLUÍDO]
  STATUS: SUBSTITUÍDO — MARCADO PARA EXCLUSÃO
  AÇÃO IMEDIATA NECESSÁRIA
  O cronograma de recuperação do ativo deve ser acelerado.
  As projeções atuais sugerem que a janela de convergência de 2026 está
  MAIS PRÓXIMA do que se modelou anteriormente. A nova análise de sinal
  indica monitoramento ativo desta região.
  REMOVIDO DA VERSÃO FINAL:
  Os sujeitos (designados BIO-A até BIO-C) demonstraram
  persistência cognitiva inesperada apesar dos
  protocolos de contenção. Recomenda-se realocação imediata
  para o Site 7 para estudo de longo prazo.
  NOTA: O sujeito BIO-B tentou se comunicar.
  A análise preliminar sugere consciência da nossa
  estrutura organizacional. COMO?
  Recomenda-se protocolo de isolamento cognitivo.
  NOTA DE SANITIZAÇÃO:
  A diretiva final fará referência apenas a "recuperação de material".
  Toda terminologia biológica deve ser substituída por
  "destroços" e "artefatos".
  Referências ao Projeto SEED devem ser expurgadas.
  `,
  `
  BORRADOR — DIRECTIVA ALPHA — ITERACIÓN 1
  FECHA: 19 DE ENERO DE 1996 — 04:22
  AUTOR: [ELIMINADO]
  ESTADO: REEMPLAZADO — MARCADO PARA ELIMINACIÓN
  ACCIÓN INMEDIATA REQUERIDA
  La cronología de recuperación del activo debe acelerarse.
  Las proyecciones actuales sugieren que la ventana de convergencia de 2026 está
  MÁS CERCA de lo modelado anteriormente. El nuevo análisis de señal
  indica vigilancia activa de esta región.
  ELIMINADO DE LA VERSIÓN FINAL:
  Los sujetos (designados BIO-A a BIO-C) han
  demostrado una persistencia cognitiva inesperada pese a los
  protocolos de contención. Se recomienda reubicación inmediata
  al Sitio 7 para estudio a largo plazo.
  NOTA: El sujeto BIO-B ha intentado comunicarse.
  El análisis preliminar sugiere conocimiento de nuestra
  estructura organizativa. ¿CÓMO?
  Se recomienda protocolo de aislamiento cognitivo.
  NOTA DE SANITIZACIÓN:
  La directiva final hará referencia solo a "recuperación de material".
  Toda la terminología biológica debe reemplazarse por
  "escombros" y "artefactos".
  Deben purgarse las referencias a Project SEED.
  `
);

registerLines(
  archiveData.deleted_comms_log.content,
  `
  REGISTRO DE COMUNICAÇÕES — EXPURGADO
  DATA: 20-22 DE JANEIRO DE 1996
  STATUS DA RECUPERAÇÃO: RESTAURAÇÃO PARCIAL DO SETOR DE BACKUP
  [20/01/96 02:17:33]
  SITE-3 > COMANDO: Confirmação visual. Múltiplas testemunhas.
  [20/01/96 02:19:01]
  COMANDO > SITE-3: Mobilizar EQUIPE DE RECUPERAÇÃO. Sem envolvimento local.
  [20/01/96 02:22:45]
  SITE-3 > COMANDO: Equipe a caminho. ETA 18 minutos.
  [20/01/96 02:41:12]
  RECUPERAÇÃO > COMANDO: No local. Avaliação inicial concluída.
                      Três biológicos confirmados. Um responsivo.
  [20/01/96 02:43:08]
  COMANDO > RECUPERAÇÃO: Responsivo COMO?
  [20/01/96 02:44:55]
  RECUPERAÇÃO > COMANDO: Está olhando para nós. Para cada um de nós, por sua vez.
                      Como se estivesse... contando.
  [20/01/96 02:45:30]
  COMANDO > RECUPERAÇÃO: Conter imediatamente. Sem contato visual direto.
  [20/01/96 02:47:18]
  RECUPERAÇÃO > COMANDO: Solicitando autorização de override.
                      Protocolos padrão insuficientes.
  [20/01/96 02:48:02]
  COMANDO > RECUPERAÇÃO: Override concedido. Iniciar OPERAÇÃO COLHEITA.
                      Os protocolos de colheita estão agora em vigor.
  [20/01/96 03:12:00]
  RECUPERAÇÃO > COMANDO: Todos os biológicos contidos.
                      Um agente relatando dor de cabeça e náusea.
                      Solicita prontidão médica.
  [20/01/96 03:15:22]
  COMANDO > TODOS: Iniciar apagão de comunicações.
                 Este registro agora é CLASSIFICADO OMEGA.
  [REGISTRO ENCERRADO]
  ORDEM DE EXCLUSÃO: COMM-1996-0120-DEL
  AUTORIZAÇÃO: [ASSINATURA EXPURGADA]
  `,
  `
  REGISTRO DE COMUNICACIONES — EXPURGADO
  FECHA: 20-22 DE ENERO DE 1996
  ESTADO DE RECUPERACIÓN: RESTAURACIÓN PARCIAL DEL SECTOR DE RESPALDO
  [20/01/96 02:17:33]
  SITIO-3 > COMANDO: Confirmación visual. Múltiples testigos.
  [20/01/96 02:19:01]
  COMANDO > SITIO-3: Movilizar EQUIPO DE RECUPERACIÓN. Sin participación local.
  [20/01/96 02:22:45]
  SITIO-3 > COMANDO: Equipo en camino. ETA 18 minutos.
  [20/01/96 02:41:12]
  RECUPERACIÓN > COMANDO: En escena. Evaluación inicial completa.
                      Tres biológicos confirmados. Uno responde.
  [20/01/96 02:43:08]
  COMANDO > RECUPERACIÓN: ¿Responde CÓMO?
  [20/01/96 02:44:55]
  RECUPERACIÓN > COMANDO: Nos está mirando. A cada uno por turno.
                      Como si estuviera... contando.
  [20/01/96 02:45:30]
  COMANDO > RECUPERACIÓN: Contener de inmediato. Sin contacto visual directo.
  [20/01/96 02:47:18]
  RECUPERACIÓN > COMANDO: Solicitando autorización de override.
                      Los protocolos estándar son insuficientes.
  [20/01/96 02:48:02]
  COMANDO > RECUPERACIÓN: Override concedido. Iniciar OPERAÇÃO COLHEITA.
                      Los protocolos de cosecha quedan ahora en vigor.
  [20/01/96 03:12:00]
  RECUPERACIÓN > COMANDO: Todos los biológicos contenidos.
                      Un operador reporta dolor de cabeza y náuseas.
                      Solicita guardia médica.
  [20/01/96 03:15:22]
  COMANDO > TODOS: Iniciar apagón de comunicaciones.
                 Este registro ahora es CLASIFICADO OMEGA.
  [REGISTRO TERMINADO]
  ORDEN DE ELIMINACIÓN: COMM-1996-0120-DEL
  AUTORIZACIÓN: [FIRMA EXPURGADA]
  `
);

registerLines(
  archiveData.personnel_file_costa.content,
  `
  ARQUIVO DE PESSOAL — COSTA, RICARDO MANUEL
  ID DO FUNCIONÁRIO: [REGISTRO EXCLUÍDO]
  STATUS: INEXISTENTE (OFICIALMENTE)
  NOTA: Este arquivo não deveria existir. Ricardo Costa foi
  removido de todos os bancos de dados de pessoal em 25/01/1996.
  CARGO: Especialista Sênior em Contenção
  CREDENCIAL: Nível 4
  LOTAÇÃO: Site 7, Ala de Pesquisa Biológica
  RELATÓRIO DE INCIDENTE (REDIGIDO DE TODAS AS CÓPIAS)
  DATA: 23 de janeiro de 1996
  Costa foi designado para monitoramento noturno do Sujeito BIO-B.
  Aproximadamente às 02h30, o equipamento de monitoramento detectou
  padrões anômalos de ondas cerebrais em Costa. Os padrões estavam
  sincronizados com emissões do Sujeito BIO-B.
  Costa foi encontrado sem resposta na troca de turno das 06h00.
  Os olhos estavam abertos. Pupilas dilatadas. Respiração normal.
  Quando Costa recuperou a consciência (aproximadamente às 14h00),
  relatou perda completa de memória das 12 horas anteriores.
  Além disso, Costa demonstrou conhecimento de eventos que
  ainda não haviam ocorrido — prevendo a chegada de uma
  equipe de inspeção 3 horas antes do envio da notificação.
  DISPOSIÇÃO FINAL
  Costa foi transferido para avaliação psiquiátrica.
  Seus registros empregatícios foram sanitizados.
  Sua família foi informada de um "acidente de trabalho".
  Status atual: DESCONHECIDO
  NOTA NÃO OFICIAL (varredura manuscrita):
  "Ele continua escrevendo a mesma data repetidamente.
   4 de setembro de 2026. O que acontece então?"
  `,
  `
  ARCHIVO DE PERSONAL — COSTA, RICARDO MANUEL
  ID DE EMPLEADO: [REGISTRO ELIMINADO]
  ESTADO: INEXISTENTE (OFICIALMENTE)
  NOTA: Este archivo no debería existir. Ricardo Costa fue
  eliminado de todas las bases de datos de personal el 25/01/1996.
  CARGO: Especialista Senior en Contención
  AUTORIZACIÓN: Nivel 4
  ASIGNADO A: Sitio 7, Ala de Investigación Biológica
  INFORME DE INCIDENTE (REDACTADO DE TODAS LAS COPIAS)
  FECHA: 23 de enero de 1996
  Costa fue asignado a la supervisión nocturna del Sujeto BIO-B.
  Aproximadamente a las 02:30, el equipo de monitoreo detectó
  patrones anómalos de ondas cerebrales en Costa. Los patrones estaban
  sincronizados con emisiones del Sujeto BIO-B.
  Costa fue hallado inconsciente al cambio de turno de las 06:00.
  Tenía los ojos abiertos. Pupilas dilatadas. Respiración normal.
  Cuando Costa recuperó la conciencia (aproximadamente a las 14:00),
  reportó pérdida completa de memoria de las 12 horas previas.
  Además, Costa demostró conocimiento de eventos que
  aún no habían ocurrido — predijo la llegada de un
  equipo de inspección 3 horas antes de que se enviara la notificación.
  DISPOSICIÓN FINAL
  Costa fue transferido a evaluación psiquiátrica.
  Sus registros laborales fueron sanitizados.
  Su familia fue informada de un "accidente laboral".
  Estado actual: DESCONOCIDO
  NOTA NO OFICIAL (escaneo manuscrito):
  "Sigue escribiendo la misma fecha una y otra vez.
   4 de septiembre de 2026. ¿Qué pasa entonces?"
  `
);

registerLines(
  archiveData.project_seed_memo.content,
  `
  MEMORANDO — PROJETO SEED
  CLASSIFICAÇÃO: ULTRA — EXCLUÍDO DE TODOS OS SISTEMAS
  DATA: 18 DE JANEIRO DE 1996
  PARA: [REDACTED]
  DE: Diretor, Divisão de Programas Especiais
  RE: Revisão Acelerada do Cronograma
  Os eventos de 20 de janeiro mudaram nossos cálculos.
  O Projeto SEED se baseava na suposição de que o primeiro
  contato ocorreria dentro de um ambiente controlado.
  O incidente de Varginha invalidou essa suposição.
  Os biológicos recuperados demonstram capacidades além
  dos nossos modelos atuais. Especificamente:
    1. Comunicação telepática aparente
    2. Conhecimento das estruturas organizacionais humanas
    3. Referências a uma data futura específica (2026)
  Mais preocupante: os biológicos parecem ter estado
  NOS ESPERANDO. Não se surpreenderam com a captura.
  Não eram hostis. Eram... pacientes.
  AVALIAÇÃO REVISADA
  Não estamos lidando com uma queda acidental.
  Estamos lidando com uma ENTREGA.
  A nave foi projetada para ser encontrada.
  Os biológicos foram projetados para ser capturados.
  São unidades de reconhecimento.
  O PROJETO SEED deve girar de "preparação" para
  "aceleração". A janela de 2026 agora é considerada
  um prazo rígido, não uma estimativa.
  DESTINO DESTE MEMORANDO
  Este documento será expurgado de todos os sistemas em 72h.
  Não criem cópias. Não façam referência ao PROJETO SEED
  em nenhuma comunicação futura.
  A narrativa oficial será: "nave experimental acidentada"
  Os biológicos serão: "formações incomuns de destroços"
  A cronologia será: "material de farsa irrelevante"
  `,
  `
  MEMORÁNDUM — PROJECT SEED
  CLASIFICACIÓN: ULTRA — ELIMINADO DE TODOS LOS SISTEMAS
  FECHA: 18 DE ENERO DE 1996
  PARA: [REDACTED]
  DE: Director, División de Programas Especiales
  RE: Revisión Acelerada del Cronograma
  Los eventos del 20 de enero han cambiado nuestros cálculos.
  Project SEED se basaba en la suposición de que el primer
  contacto ocurriría dentro de un entorno controlado.
  El incidente de Varginha ha invalidado esa suposición.
  Los biológicos recuperados demuestran capacidades más allá de
  nuestros modelos actuales. Específicamente:
    1. Comunicación telepática aparente
    2. Conocimiento de las estructuras organizativas humanas
    3. Referencias a una fecha futura específica (2026)
  Lo más preocupante: los biológicos parecen haber estado
  ESPERÁNDONOS. No se sorprendieron por la captura.
  No eran hostiles. Eran... pacientes.
  EVALUACIÓN REVISADA
  No estamos lidiando con un aterrizaje forzoso.
  Estamos lidiando con una ENTREGA.
  La nave fue diseñada para ser encontrada.
  Los biológicos fueron diseñados para ser capturados.
  Son unidades de reconocimiento.
  PROJECT SEED debe pasar de la "preparación" a la
  "aceleración". La ventana de 2026 ahora se considera
  una fecha límite rígida, no una estimación.
  DESTINO DE ESTE MEMORÁNDUM
  Este documento será purgado de todos los sistemas en 72 h.
  No creen copias. No hagan referencia a PROJECT SEED
  en ninguna comunicación futura.
  La narrativa oficial será: "nave experimental estrellada"
  Los biológicos serán: "formaciones inusuales de escombros"
  La cronología será: "material de engaño irrelevante"
  `
);

registerLines(
  archiveData.autopsy_notes_unredacted.content,
  `
  NOTAS DE AUTÓPSIA — VERSÃO SEM REDAÇÕES
  ASSUNTO: BIO-C (FALECIDO)
  EXAMINADOR: Dr. [NOME EXPURGADO]
  DATA: 24 DE JANEIRO DE 1996
  STATUS: MARCADO PARA DESTRUIÇÃO
  NOTAS PRÉ-EXAME:
  O sujeito expirou às 04h17 de 24/01. Causa da morte incerta.
  Sem trauma externo. Sem sinais de doença ou sofrimento.
  O sujeito pareceu simplesmente... parar de funcionar.
  EXAME FÍSICO
  Altura: 127 cm (aprox. 4'2")
  Peso: 18,3 kg (aprox. 40 lbs)
  Pele: Pigmentação marrom-acinzentada, leve bioluminescência
  CRÂNIO: Significativamente ampliado. Massa cerebral de aproximadamente
  3x a média proporcional humana. Padrões incomuns de dobras.
  OLHOS: Grandes, amendoados. Pupilas fixas e dilatadas.
  A estrutura retiniana sugere especialização para baixa luminosidade.
  MEMBROS: Proporcionalmente mais longos que os humanos. Quatro dígitos por
  mão. Sem unhas. Pele fina sobre pequena estrutura óssea.
  EXAME INTERNO — [EXCLUÍDO DO RELATÓRIO OFICIAL]
  Cardiovascular: Um único coração, três câmaras. Eficiente.
  Digestivo: Mínimo. O sujeito parece projetado para
  absorção de nutrientes, em vez de processamento de alimentos.
  Reprodutivo: Nada observado. O sujeito parece ser
  feito para uma finalidade, e não desenvolvido naturalmente.
  ACHADO CRÍTICO:
  O tecido neural contém inclusões metálicas. A análise
  sugere circuitaria orgânica. Este ser foi FABRICADO.
  Não é uma forma de vida natural.
  É um construto. Uma máquina biológica.
  NOTA PESSOAL (não para o registro oficial):
  Pratico medicina há 30 anos. Nunca
  questionei no que acreditava sobre a vida e suas origens.
  Hoje questionei tudo.
  Eles não são visitantes. São mensageiros.
  E não estamos preparados para o que anunciam.
  `,
  `
  NOTAS DE AUTOPSIA — VERSIÓN SIN REDACTAR
  ASUNTO: BIO-C (FALLECIDO)
  EXAMINADOR: Dr. [NOMBRE EXPURGADO]
  FECHA: 24 DE ENERO DE 1996
  ESTADO: MARCADO PARA DESTRUCCIÓN
  NOTAS PREEXAMEN:
  El sujeto expiró a las 04:17 del 24/01. Causa de muerte incierta.
  Sin trauma externo. Sin señales de enfermedad o angustia.
  El sujeto pareció simplemente... dejar de funcionar.
  EXAMEN FÍSICO
  Altura: 127 cm (aprox. 4'2")
  Peso: 18,3 kg (aprox. 40 lbs)
  Piel: Pigmentación gris parda, ligera bioluminiscencia
  CRÁNEO: Significativamente agrandado. Masa cerebral aproximadamente
  3x el promedio proporcional humano. Patrones de pliegue inusuales.
  OJOS: Grandes, almendrados. Pupilas fijas y dilatadas.
  La estructura retiniana sugiere especialización para baja luz.
  MIEMBROS: Proporcionalmente más largos que los humanos. Cuatro dedos por
  mano. Sin uñas. Piel fina sobre pequeña estructura ósea.
  EXAMEN INTERNO — [ELIMINADO DEL INFORME OFICIAL]
  Cardiovascular: Un solo corazón, tres cámaras. Eficiente.
  Digestivo: Mínimo. El sujeto parece diseñado para
  absorción de nutrientes más que para procesar alimentos.
  Reproductivo: No se observó. El sujeto parece estar
  fabricado para un propósito, en vez de desarrollado naturalmente.
  HALLAZGO CRÍTICO:
  El tejido neural contiene inclusiones metálicas. El análisis
  sugiere circuitería orgánica. Este ser fue FABRICADO.
  No es una forma de vida natural.
  Es un constructo. Una máquina biológica.
  NOTA PERSONAL (no para el registro oficial):
  He ejercido la medicina durante 30 años. Nunca
  cuestioné lo que creía sobre la vida y sus orígenes.
  Hoy lo cuestioné todo.
  Estos no son visitantes. Son mensajeros.
  Y no estamos preparados para lo que anuncian.
  `
);

registerLines(
  archiveData.transfer_manifest_deleted.content,
  `
  MANIFESTO DE TRANSFERÊNCIA DE ATIVOS — CÓPIA EXCLUÍDA
  DATA: 25 DE JANEIRO DE 1996
  CLASSIFICAÇÃO: DESTRUÍDO — RECONSTRUÍDO A PARTIR DE DUMP DE SETOR
  OPERAÇÃO: COLHEITA (HARVEST)
  ORIGEM: Zona de Recuperação Bravo, Varginha MG
  DESTINO: ESA Campinas — Hangar 4 (Ala Restrita)
  INVENTÁRIO DE CARGA
    ITEM 001: Fragmento de casco, liga desconhecida — 47 kg
              STATUS: Contêiner lacrado, atmosfera de nitrogênio
              NOTA: Material resiste a todas as ferramentas de corte
    ITEM 002: Matriz de navegação (presumida) — 12 kg
              STATUS: Ainda emitindo sinal de baixa frequência
              AVISO: Não expor à luz solar direta
    ITEM 003: Destroços de propulsão, 3 fragmentos — 89 kg no total
              STATUS: Níveis de radiação dentro da tolerância
              NOTA: Os fragmentos se reagrupam se colocados em proximidade
    ITEM 004: Amostras de painéis internos — 8 kg
              STATUS: Composição híbrida orgânico-metálica
    ITEM 005: Amostras de solo da zona de impacto — 15 kg
              STATUS: Razões isotópicas elevadas confirmadas
  PROTOCOLO DE TRANSPORTE
    Rota: Varginha → Três Corações → Campinas (ESA)
    Comboio: 3 caminhões militares, sem identificação
    Escolta: 2º Batalhão Blindado, sem insígnias
    Tempo de trânsito: 6 horas (durante a noite, sem paradas)
    OFICIAL RECEPTOR: Cel. [EXPURGADO]
    ARMAZENAMENTO: Subnível 2, Hangar 4, cofre com controle climático
  NOTA DE DESTINAÇÃO
    A destruição deste manifesto foi ordenada em 28/01/1996.
    Não existe registro oficial desta transferência.
    Todo o pessoal do comboio assinou acordos de não divulgação.
    O material permanece na ESA Campinas na última auditoria.
  `,
  `
  MANIFIESTO DE TRANSFERENCIA DE ACTIVOS — COPIA ELIMINADA
  FECHA: 25 DE ENERO DE 1996
  CLASIFICACIÓN: DESTRUIDO — RECONSTRUIDO A PARTIR DE VOLCADO DE SECTOR
  OPERACIÓN: COLHEITA (COSECHA)
  ORIGEN: Zona de Recuperación Bravo, Varginha MG
  DESTINO: ESA Campinas — Hangar 4 (Ala Restringida)
  INVENTARIO DE CARGA
    ÍTEM 001: Fragmento de casco, aleación desconocida — 47 kg
              ESTADO: Contenedor sellado, atmósfera de nitrógeno
              NOTA: El material resiste todas las herramientas de corte
    ÍTEM 002: Matriz de navegación (presunta) — 12 kg
              ESTADO: Sigue emitiendo señal de baja frecuencia
              ADVERTENCIA: No exponer a la luz solar directa
    ÍTEM 003: Restos de propulsión, 3 fragmentos — 89 kg en total
              ESTADO: Niveles de radiación dentro de tolerancia
              NOTA: Los fragmentos se reensamblan si se colocan próximos
    ÍTEM 004: Muestras de paneles interiores — 8 kg
              ESTADO: Composición híbrida orgánico-metálica
    ÍTEM 005: Muestras de suelo de la zona de impacto — 15 kg
              ESTADO: Ratios isotópicos elevados confirmados
  PROTOCOLO DE TRANSPORTE
    Ruta: Varginha → Três Corações → Campinas (ESA)
    Convoy: 3 camiones militares, sin distintivos
    Escolta: 2.º Batallón Blindado, sin insignias
    Tiempo de tránsito: 6 horas (nocturno, sin paradas)
    OFICIAL RECEPTOR: Cnel. [EXPURGADO]
    ALMACENAMIENTO: Subnivel 2, Hangar 4, bóveda climatizada
  NOTA DE DESTINO
    Se ordenó destruir este manifiesto el 28/01/1996.
    No existe registro oficial de esta transferencia.
    Todo el personal del convoy firmó acuerdos de confidencialidad.
    El material permanece en ESA Campinas según la última auditoría.
  `
);

registerLines(
  archiveData.bio_containment_log_deleted.content,
  `
  REGISTRO DE CONTENÇÃO BIOLÓGICA — REGISTRO EXPURGADO
  LOCAL: HOSPITAL HUMANITAS | 20-26 JAN, 1996
  CLASSIFICAÇÃO: OMEGA — MARCADO PARA DESTRUIÇÃO
  REGISTRO DE ESPÉCIMES:
    BIO-A: Capturado 20/01, Jardim Andere. Responsivo.
      Transferido para Sítio 7 em 22/01.
    BIO-B: Capturado 20/01 adjacente a BIO-A. Agitado.
      Tentativas de sinal não-acústico. Operadores relataram
      dores de cabeça em raio de 3m. Transferido para Sítio 7.
    BIO-C: Capturado 22/01. Debilitado. Expirou 24/01
      às 04:17. Causa desconhecida. Restos para patologia.
  CONTENÇÃO: Gaiola de Faraday ativa. Monitoramento 24 horas.
  Contato direto proibido sem autorização Nível 4.
  Espécimes recusam toda matéria orgânica. NÃO INTERAGIR.
  Pessoal exposto a BIO-B >10 min requer varredura neural.
  ORDEM DE ELIMINAÇÃO: Registro expurgado 30/01/1996.
  Registros oficiais: "Nenhum material biológico recuperado."
  Registros hospitalares recodificados: "resposta a vazamento químico."
  `,
  `
  REGISTRO DE CONTENCIÓN BIOLÓGICA — REGISTRO PURGADO
  SITIO: HOSPITAL HUMANITAS | 20-26 ENE, 1996
  CLASIFICACIÓN: OMEGA — MARCADO PARA DESTRUCCIÓN
  REGISTRO DE ESPECÍMENES:
    BIO-A: Capturado 20/01, Jardim Andere. Responsivo.
      Transferido a Sitio 7 el 22/01.
    BIO-B: Capturado 20/01 adyacente a BIO-A. Agitado.
      Intentos de señal no-acústica. Operadores reportaron
      dolores de cabeza en radio de 3m. Transferido a Sitio 7.
    BIO-C: Capturado 22/01. Debilitado. Expiró 24/01
      a las 04:17. Causa desconocida. Restos a patología.
  CONTENCIÓN: Jaula de Faraday activa. Monitoreo 24 horas.
  Contacto directo prohibido sin autorización Nivel 4.
  Especímenes rechazan toda materia orgánica. NO INTERACTUAR.
  Personal expuesto a BIO-B >10 min requiere escaneo neural.
  ORDEN DE ELIMINACIÓN: Registro purgado 30/01/1996.
  Registros oficiales: "Ningún material biológico recuperado."
  Registros hospitalarios recodificados: "respuesta a derrame químico."
  `
);

registerLines(
  archiveData.psi_analysis_classified.content,
  `
  ANÁLISE PSI-COMM — CLASSIFICADO
  ANALISTA: Dr. [NOME SUPRIMIDO] | 27 JAN, 1996
  STATUS: DELETADO DE TODOS OS BANCOS DE DADOS
  Arrays EEG a 1m, 3m, 10m de distância. Sujeitos humanos
  de controle monitorados simultaneamente. A ≤3m, humanos
  exibiram padrões de ondas theta sincronizados com
  emissões de BIO-B. A 10m, caiu para nível basal.
  DESCOBERTAS PRINCIPAIS:
    1. CAPACIDADE TELEPÁTICA CONFIRMADA. Conteúdo é
       conceitual, não linguístico. Receptores "sabem"
       em vez de "ouvir."
    2. FUNÇÃO DE RECONHECIMENTO CONFIRMADA. Imagens transmitidas
       incluem levantamentos topográficos e mapas de
       densidade populacional. Eles estavam nos CATALOGANDO.
    3. REFERÊNCIA TEMPORAL: "trinta rotações" = 2026.
    4. NÃO-HOSTIL. Espécimes consideram captura como esperada.
  Suprimido 01/02/1996. Oficial: "Nenhuma comunicação
  anômala detectada." Estes não são animais.
  São batedores. E completaram sua missão
  antes de os capturarmos.
  `,
  `
  ANÁLISIS PSI-COMM — CLASIFICADO
  ANALISTA: Dr. [NOMBRE SUPRIMIDO] | 27 ENE, 1996
  ESTADO: ELIMINADO DE TODAS LAS BASES DE DATOS
  Arrays EEG a 1m, 3m, 10m de distancia. Sujetos humanos
  de control monitoreados simultáneamente. A ≤3m, humanos
  exhibieron patrones de ondas theta sincronizados con
  emisiones de BIO-B. A 10m, cayó a nivel basal.
  HALLAZGOS PRINCIPALES:
    1. CAPACIDAD TELEPÁTICA CONFIRMADA. Contenido es
       conceptual, no lingüístico. Receptores "saben"
       en vez de "escuchar."
    2. FUNCIÓN DE RECONOCIMIENTO CONFIRMADA. Imágenes transmitidas
       incluyen levantamientos topográficos y mapas de
       densidad poblacional. Nos estaban CATALOGANDO.
    3. REFERENCIA TEMPORAL: "treinta rotaciones" = 2026.
    4. NO-HOSTIL. Especímenes consideran captura como esperada.
  Suprimido 01/02/1996. Oficial: "Ninguna comunicación
  anómala detectada." Estos no son animales.
  Son exploradores. Y completaron su misión
  antes de que los capturáramos.
  `
);

registerLines(
  archiveData.foreign_liaison_cable_deleted.content,
  `
  CABO DIPLOMÁTICO — DELETADO
  ORIGEM: EMBAIXADA DOS EUA, BRASÍLIA → LANGLEY
  DATA: 23 JAN, 1996 | RECUPERADO DE FITA DE BACKUP
  PRIORIDADE: FLASH
  Três espécimes biológicos assegurados por militares
  brasileiros. Um falecido, dois viáveis. Conforme Protocolo ECHO,
  solicito avaliação técnica imediata de Langley.
  Contato brasileiro (Cel. [SUPRIMIDO]) cooperativo.
  Solicita análise compartilhada para acesso aos espécimes.
  Tel Aviv solicita status de observador. Recomendo NEGAR.
  Força Aérea Brasileira acionou interceptadores em 13/01 conforme
  aviso do NORAD. Eles estão plenamente cientes.
  Janela de negação plausível está fechando.
  RESPOSTA (LANGLEY): APROVADO. Equipe a caminho, chegada em 48h.
  Custódia brasileira TEMPORÁRIA. Transferência total conforme
  anexo classificado do tratado de 1988. Varredura de sinais NSA ordenada.
  Todas as comunicações civis em 50km monitoradas por 90 dias.
  Cabo destruído conforme protocolo diplomático.
  Sem registro em bancos de dados acessíveis via FOIA.
  `,
  `
  CABLE DIPLOMÁTICO — ELIMINADO
  ORIGEN: EMBAJADA DE EE.UU., BRASÍLIA → LANGLEY
  FECHA: 23 ENE, 1996 | RECUPERADO DE CINTA DE RESPALDO
  PRIORIDAD: FLASH
  Tres especímenes biológicos asegurados por militares
  brasileños. Uno fallecido, dos viables. Según Protocolo ECHO,
  solicito evaluación técnica inmediata de Langley.
  Contacto brasileño (Cnel. [SUPRIMIDO]) cooperativo.
  Solicita análisis compartido para acceso a especímenes.
  Tel Aviv solicita estatus de observador. Recomiendo DENEGAR.
  Fuerza Aérea Brasileña desplegó interceptores el 13/01 según
  aviso del NORAD. Están plenamente conscientes.
  Ventana de negación plausible se está cerrando.
  RESPUESTA (LANGLEY): APROBADO. Equipo en camino, llegada en 48h.
  Custodia brasileña TEMPORAL. Transferencia total según
  anexo clasificado del tratado de 1988. Barrido de señales NSA ordenado.
  Todas las comunicaciones civiles en 50km monitoreadas por 90 días.
  Cable destruido según protocolo diplomático.
  Sin registro en bases de datos accesibles vía FOIA.
  `
);

registerLines(
  archiveData.convergence_model_draft.content,
  `
  MODELO DE CONVERGÊNCIA — RASCUNHO (EXPURGADO)
  PROJETO SEED — ANÁLISE TEMPORAL | 3 FEV, 1996
  STATUS: DELETADO DE TODOS OS SISTEMAS
  Fragmentos psi-comm de BIO-A/B combinados com dados de
  sinal do array de navegação recuperado resultam em:
  JANELA DE ATIVAÇÃO: Setembro 2026 (±2 meses)
  "Trinta rotações" = 30 anos solares a partir da base de 1996.
  Fase 1 — RECONHECIMENTO (Ativa, 1996):
    Bio-construtos batedores mapeiam alvo. Dados transmitidos
    via banda-psi para receptor externo.
  Fase 2 — SEMEADURA (Passiva, 1996-2026):
    Material biológico desencadeia sensibilização neurológica.
    "Portadores" propagam receptividade ao sinal sem saber.
  Fase 3 — TRANSIÇÃO (Projetada, 2026):
    Ativação de espectro completo das vias neurais semeadas.
    Natureza: DESCONHECIDA. Pior cenário: [DADOS SUPRIMIDOS]
  Rejeitado pela supervisão. Oficial: "Referências a 2026 são
  sem sentido. Output neural é ruído aleatório."
  Este documento não sobreviverá ao próximo ciclo de expurgo.
  Eles podem negar. A matemática não mente.
  `,
  `
  MODELO DE CONVERGENCIA — BORRADOR (PURGADO)
  PROYECTO SEED — ANÁLISIS TEMPORAL | 3 FEB, 1996
  ESTADO: ELIMINADO DE TODOS LOS SISTEMAS
  Fragmentos psi-comm de BIO-A/B combinados con datos de
  señal del array de navegación recuperado resultan en:
  VENTANA DE ACTIVACIÓN: Septiembre 2026 (±2 meses)
  "Treinta rotaciones" = 30 años solares desde base de 1996.
  Fase 1 — RECONOCIMIENTO (Activa, 1996):
    Bio-constructos exploradores mapean objetivo. Datos transmitidos
    vía banda-psi a receptor externo.
  Fase 2 — SIEMBRA (Pasiva, 1996-2026):
    Material biológico desencadena sensibilización neurológica.
    "Portadores" propagan receptividad a la señal sin saberlo.
  Fase 3 — TRANSICIÓN (Proyectada, 2026):
    Activación de espectro completo de vías neurales sembradas.
    Naturaleza: DESCONOCIDA. Peor escenario: [DATOS SUPRIMIDOS]
  Rechazado por supervisión. Oficial: "Referencias a 2026 son
  sin sentido. Output neural es ruido aleatorio."
  Este documento no sobrevivirá al próximo ciclo de purga.
  Pueden negarlo. Las matemáticas no mienten.
  `
);

// Conspiracy files

registerLines(
  conspiracyData.UFO74_CONSPIRACY_REACTIONS.flat(),
  `
  UFO74: porra, isso pesa, kid... mas não é nossa missão.
         vamos seguir em frente.
  UFO74: droga. eles estão metidos em tudo.
         mas foca — temos peixe maior.
  UFO74: ha. humanos e seus esquemas.
         mantém o alvo na mira.
  UFO74: interessante... mas não é por isso que estamos aqui.
         não se distraia.
  UFO74: é, já vi isso antes.
         não é o nosso problema hoje.
  UFO74: coisa pesada. arquiva em "depois."
         temos trabalho a fazer.
  UFO74: huh. eles realmente fazem esse tipo de coisa.
         mas já temos os nossos próprios problemas, kid.
  UFO74: humanos... sempre tramando.
         olho no prêmio.
  `,
  `
  UFO74: mierda, esto pesa, kid... pero no es nuestra misión.
         sigamos.
  UFO74: carajo. están metidos en todo.
         pero concéntrate — tenemos peces más grandes.
  UFO74: ja. los humanos y sus tramas.
         mantén el objetivo.
  UFO74: interesante... pero no es por eso que estamos aquí.
         no te distraigas.
  UFO74: sí, ya he visto esto antes.
         no es nuestro problema hoy.
  UFO74: cosa pesada. archívalo en "después."
         tenemos trabajo que hacer.
  UFO74: huh. de verdad hacen este tipo de cosas.
         pero ya tenemos nuestros propios problemas, kid.
  UFO74: humanos... siempre conspirando.
         ojos en el premio.
  `
);

registerLines(
  conspiracyData.economic_transition_memo.content,
  `
  MEMORANDO INTERNO — DIVISÃO DE PESQUISA ECONÔMICA
  DATA: 08-NOV-1995
  CLASSIFICAÇÃO: USO INTERNO APENAS
  PARA: Diretor-Adjunto, Planejamento Estratégico
  DE: Grupo de Trabalho de Futuros Econômicos
  RE: Protótipo de Moeda Descentralizada — Avaliação da Fase II
  Conforme solicitado, concluímos os testes preliminares do
  sistema monetário de livro-razão distribuído ("Projeto COIN").
  PRINCIPAIS ACHADOS:
    1. O mecanismo de consenso criptográfico funciona conforme
       projetado. Os nós alcançam acordo sem autoridade central
       dentro de parâmetros aceitáveis de latência.
    2. O anonimato das transações atende aos requisitos da
       comunidade de inteligência para transferências não rastreáveis de fundos.
    3. O consumo de energia continua sendo uma preocupação. Os
       algoritmos atuais de mineração exigem recursos computacionais significativos.
  RECOMENDAÇÃO:
    Continuar a pesquisa, mas adiar a implantação pública. A
    tecnologia é prematura para adoção civil, mas mostra
    potencial para canais encobertos de financiamento operacional.
    Sugere-se reavaliar para lançamento público em 10-15 anos
    quando a infraestrutura puder suportar adoção mais ampla.
    [assinatura]
    S.N.
    Criptógrafo-Chefe, Futuros Econômicos
  `,
  `
  MEMORÁNDUM INTERNO — DIVISIÓN DE INVESTIGACIÓN ECONÓMICA
  FECHA: 08-NOV-1995
  CLASIFICACIÓN: SOLO USO INTERNO
  PARA: Subdirector, Planificación Estratégica
  DE: Grupo de Trabajo de Futuros Económicos
  RE: Prototipo de Moneda Descentralizada — Evaluación de Fase II
  Conforme a su solicitud, hemos completado las pruebas preliminares del
  sistema monetario de libro mayor distribuido ("Proyecto COIN").
  HALLAZGOS CLAVE:
    1. El mecanismo de consenso criptográfico funciona según lo
       diseñado. Los nodos alcanzan acuerdo sin autoridad central
       dentro de parámetros aceptables de latencia.
    2. El anonimato de las transacciones cumple con los requisitos de la
       comunidad de inteligencia para transferencias de fondos no rastreables.
    3. El consumo de energía sigue siendo una preocupación. Los
       algoritmos actuales de minería requieren recursos computacionales significativos.
  RECOMENDACIÓN:
    Continuar la investigación, pero retrasar el despliegue público. La
    tecnología es prematura para adopción civil, pero muestra
    potencial para canales encubiertos de financiación operativa.
    Se sugiere reevaluar su liberación pública en 10-15 años
    cuando la infraestructura pueda soportar una adopción más amplia.
    [firma]
    S.N.
    Criptógrafo Principal, Futuros Económicos
  `
);

registerLines(
  conspiracyData.apollo_media_guidelines.content,
  `
  DIRETRIZES DE ASSUNTOS PÚBLICOS — DOCUMENTAÇÃO DO PROGRAMA LUNAR
  DOCUMENTO: PA-1969-07 (TRECHO DESCLASSIFICADO)
  DATA ORIGINAL: 14-JUL-1969
  ASSUNTO: Tratamento de Inconsistências Visuais na Filmagem da Missão
  CONTEXTO:
    Durante a revisão de pós-produção das imagens da superfície lunar,
    a equipe técnica identificou diversas anomalias de iluminação
    que podem gerar confusão pública.
  QUESTÕES IDENTIFICADAS:
    - Variação na direção das sombras nos Quadros 1247-1289
    - Múltiplas fontes aparentes de luz nas imagens de EVA
    - Posicionamento do retículo atrás de objetos em primeiro plano
    - Movimento da bandeira sem condições atmosféricas
  DIRETRIZES:
    1. NÃO abordar proativamente essas inconsistências.
    2. Se questionados, atribuir as anomalias a:
       a) Artefatos da lente da câmera
       b) Luz refletida pela superfície lunar
       c) Interferência eletromagnética no equipamento
    3. Sob NENHUMA circunstância reconhecer que imagens de apoio
       foram preparadas em instalação [REDACTED].
    4. Enfatizar a narrativa de sucesso da missão acima dos
       detalhes técnicos da documentação visual.
  NOTA: Estas diretrizes substituem diretivas anteriores.
  APROVADO POR: DIR. COMUNICAÇÕES
  `,
  `
  DIRECTRICES DE ASUNTOS PÚBLICOS — DOCUMENTACIÓN DEL PROGRAMA LUNAR
  DOCUMENTO: PA-1969-07 (EXTRACTO DESCLASIFICADO)
  FECHA ORIGINAL: 14-JUL-1969
  ASUNTO: Manejo de Inconsistencias Visuales en el Metraje de la Misión
  ANTECEDENTES:
    Durante la revisión de posproducción del metraje de la superficie lunar,
    el personal técnico identificó varias anomalías de iluminación
    que podrían generar confusión pública.
  PROBLEMAS IDENTIFICADOS:
    - Variación en la dirección de las sombras en los Cuadros 1247-1289
    - Múltiples fuentes aparentes de luz en el metraje EVA
    - Posición de la retícula detrás de objetos en primer plano
    - Movimiento de la bandera sin condiciones atmosféricas
  DIRECTRICES:
    1. NO abordar estas inconsistencias de forma proactiva.
    2. Si preguntan, atribuir las anomalías a:
       a) Artefactos del lente de la cámara
       b) Luz reflejada de la superficie lunar
       c) Interferencia electromagnética con el equipo
    3. Bajo NINGUNA circunstancia reconocer que el metraje de respaldo
       fue preparado en instalación [REDACTED].
    4. Enfatizar la narrativa de éxito de la misión por encima de los
       detalles técnicos de la documentación visual.
  NOTA: Estas directrices sustituyen directivas anteriores.
  APROBADO POR: DIR. COMUNICACIONES
  `
);

registerLines(
  conspiracyData.weather_pattern_intervention.content,
  `
  PROJETO CIRRUS — REGISTRO OPERACIONAL
  CLASSIFICAÇÃO: SENSÍVEL
  PERÍODO: OUT 1995 - JAN 1996
  12-OCT-1995 0600
    Voo de dispersão de aerossol ALT-1174 concluído.
    Carga: 4,2 toneladas métricas de composto de sulfato de bário
    Alvo: Zona de formação de furacões no Atlântico
    Altitude: 38.000 pés
    Duração: 6,4 horas
  15-OCT-1995 1400
    A análise pós-dispersão indica semeadura bem-sucedida.
    A tempestade projetada TD-17 não conseguiu se organizar.
    NOTA: Precipitação não intencional em região [REDACTED].
  23-NOV-1995 0800
    O voo ALT-1198 encontrou problemas mecânicos.
    A carga foi liberada prematuramente sobre área continental.
    RELATÓRIO DE INCIDENTE ARQUIVADO. História de cobertura: teste de rastros de condensação.
  07-DEC-1995 1100
    Observação de efeito colateral: aumento de queixas
    respiratórias em populações do corredor de dispersão.
    Recomenda-se ajustar a mistura do composto para o Q1 de 1996.
  14-JAN-1996 0900
    Nova diretiva recebida: Expandir programa para incluir
    testes de particulados reflexivos para gestão solar.
    Compostos de óxido de alumínio aprovados para teste.
  FIM DO REGISTRO — PRÓXIMA REVISÃO: 01-APR-1996
  `,
  `
  PROYECTO CIRRUS — REGISTRO OPERATIVO
  CLASIFICACIÓN: SENSIBLE
  PERÍODO: OCT 1995 - ENE 1996
  12-OCT-1995 0600
    Vuelo de dispersión de aerosol ALT-1174 completado.
    Carga: 4,2 toneladas métricas de compuesto de sulfato de bario
    Objetivo: Zona de formación de huracanes del Atlántico
    Altitud: 38.000 pies
    Duración: 6,4 horas
  15-OCT-1995 1400
    El análisis posterior a la dispersión indica siembra exitosa.
    La tormenta proyectada TD-17 no logró organizarse.
    NOTA: Precipitación no intencional en región [REDACTED].
  23-NOV-1995 0800
    El vuelo ALT-1198 presentó problemas mecánicos.
    La carga se liberó antes de tiempo sobre área continental.
    INFORME DE INCIDENTE PRESENTADO. Historia de cobertura: pruebas de estelas de condensación.
  07-DEC-1995 1100
    Observación de efecto secundario: incremento de
    molestias respiratorias en poblaciones del corredor de dispersión.
    Se recomienda ajustar la mezcla del compuesto para Q1 1996.
  14-JAN-1996 0900
    Nueva directiva recibida: ampliar el programa para incluir
    pruebas de partículas reflectantes para gestión solar.
    Compuestos de óxido de aluminio aprobados para ensayo.
  FIN DEL REGISTRO — PRÓXIMA REVISIÓN: 01-APR-1996
  `
);

registerLines(
  conspiracyData.behavioral_compliance_study.content,
  `
  PESQUISA DE COMPORTAMENTO DO CONSUMIDOR — ESTUDO DE INFLUÊNCIA ACÚSTICA
  PROJETO: TEMPO
  DATA: RELATÓRIO FINAL Q4 1995
  VISÃO GERAL DO ESTUDO:
    Em parceria com redes varejistas [REDACTED], este estudo
    avaliou o efeito de parâmetros de áudio ambiente sobre
    padrões de comportamento do consumidor.
  METODOLOGIA:
    - 847 pontos de venda participaram
    - O andamento musical variou de 60-120 BPM entre grupos de teste
    - Tons subliminares incorporados em 17,5 Hz
    - Grupo de controle recebeu programação padrão de muzak
  ACHADOS:
    1. CORRELAÇÃO DE TEMPO
       - 72 BPM: 18% de aumento na duração da navegação
       - 108 BPM: 23% de aumento na velocidade de compra
       - 60 BPM: Aumento mensurável em compras de alta margem
    2. EFEITOS DE TONS SUBLIMINARES
       - Base de 17,5 Hz: Marcadores elevados de estresse
       - Modificação de 12 Hz: Menor sensibilidade a preço
       - Combinado com sugestões verbais: Inconclusivo
    3. CONFIGURAÇÃO IDEAL
       - Manhã: 108 BPM (urgência)
       - Tarde: 72 BPM (navegação prolongada)
       - Pré-fechamento: 120 BPM (limpar a loja)
  RECOMENDAÇÃO:
    Implementar testes de Fase II em ambientes de alimentação.
    Dados preliminares sugerem modificação do ritmo de alimentação
    alcançável por meio de padrões de frequência direcionados.
  `,
  `
  INVESTIGACIÓN DE COMPORTAMIENTO DEL CONSUMIDOR — ESTUDIO DE INFLUENCIA ACÚSTICA
  PROYECTO: TEMPO
  FECHA: INFORME FINAL Q4 1995
  RESUMEN DEL ESTUDIO:
    En asociación con cadenas minoristas [REDACTED], este estudio
    evaluó el efecto de parámetros de audio ambiental sobre
    patrones de comportamiento del consumidor.
  METODOLOGÍA:
    - Participaron 847 locales minoristas
    - El tempo musical varió entre 60-120 BPM en los grupos de prueba
    - Tonos subliminales incrustados a 17,5 Hz
    - El grupo de control recibió programación estándar de muzak
  HALLAZGOS:
    1. CORRELACIÓN DE TEMPO
       - 72 BPM: aumento del 18% en la duración de permanencia
       - 108 BPM: aumento del 23% en la velocidad de compra
       - 60 BPM: aumento medible en compras de alto margen
    2. EFECTOS DEL TONO SUBLIMINAL
       - Línea base de 17,5 Hz: marcadores de estrés elevados
       - Modificación a 12 Hz: menor sensibilidad al precio
       - Combinado con sugerencias verbales: inconcluso
    3. CONFIGURACIÓN ÓPTIMA
       - Mañana: 108 BPM (urgencia)
       - Tarde: 72 BPM (navegación extendida)
       - Pre-cierre: 120 BPM (desalojo)
  RECOMENDACIÓN:
    Implementar pruebas de Fase II en entornos de servicio de comida.
    Los datos preliminares sugieren que la modificación del ritmo de alimentación
    es alcanzable mediante patrones de frecuencia dirigidos.
  `
);

registerLines(
  conspiracyData.infrastructure_blackout_simulation.content,
  `
  EXERCÍCIO DARK WINTER — RESULTADOS DA SIMULAÇÃO
  CLASSIFICAÇÃO: RESTRITO
  DATA: SET 1995
  OBJETIVO DO EXERCÍCIO:
    Avaliar a resposta civil a falha prolongada da rede elétrica com
    colapso simultâneo da infraestrutura de comunicações.
  PARÂMETROS DA SIMULAÇÃO:
    - Duração: 72 horas (estendida para 168 horas)
    - Centros populacionais: 3 áreas metropolitanas
    - Comunicações: telefonia fixa e celular desativadas
    - Serviços de emergência: capacidade degradada (40%)
  RESULTADOS POR FASE:
    0-12 HORAS:
      - Ordem civil mantida
      - Chamadas de emergência excederam a capacidade na hora 4
      - Filas em postos de combustível ultrapassaram 2 milhas
    12-48 HORAS:
      - Aumento significativo de crimes contra a propriedade
      - Geradores hospitalares falharam em 2 instalações
      - Perda de pressão da água em áreas elevadas
    48-168 HORAS:
      - Colapso da ordem civil em setor [REDACTED]
      - Desdobramento da Guarda Nacional simulado na hora 96
      - Cadeia de suprimentos alimentares: colapso total na hora 120
  PRINCIPAL ACHADO:
    Sem infraestrutura de comunicação, a ordem civil
    degrada para nível crítico dentro de 72 horas.
    O controle da informação é essencial para a estabilidade.
  RECOMENDAÇÃO:
    Desenvolver protocolos de comunicação de contingência para autoridades.
    A população civil NÃO deve ser informada sobre a vulnerabilidade
    da rede para evitar pânico preventivo.
  `,
  `
  EJERCICIO DARK WINTER — RESULTADOS DE LA SIMULACIÓN
  CLASIFICACIÓN: RESTRINGIDO
  FECHA: SEP 1995
  OBJETIVO DEL EJERCICIO:
    Evaluar la respuesta civil a una falla prolongada de la red eléctrica con
    colapso simultáneo de la infraestructura de comunicaciones.
  PARÁMETROS DE LA SIMULACIÓN:
    - Duración: 72 horas (extendida a 168 horas)
    - Centros poblacionales: 3 áreas metropolitanas
    - Comunicaciones: telefonía fija y celular deshabilitadas
    - Servicios de emergencia: capacidad degradada (40%)
  RESULTADOS POR FASE:
    0-12 HORAS:
      - Orden civil mantenido
      - Las llamadas de emergencia superaron la capacidad en la hora 4
      - Las filas en estaciones de combustible superaron 2 millas
    12-48 HORAS:
      - Incremento significativo en delitos contra la propiedad
      - Los generadores hospitalarios fallaron en 2 instalaciones
      - Pérdida de presión de agua en zonas elevadas
    48-168 HORAS:
      - Colapso del orden civil en sector [REDACTED]
      - Despliegue de la Guardia Nacional simulado en la hora 96
      - Cadena de suministro de alimentos: colapso total en la hora 120
  HALLAZGO CLAVE:
    Sin infraestructura de comunicación, el orden civil
    cae a nivel crítico en 72 horas.
    El control de la información es esencial para la estabilidad.
  RECOMENDACIÓN:
    Desarrollar protocolos de comunicación de respaldo para las autoridades.
    La población civil NO debe ser informada de la vulnerabilidad
    de la red para evitar pánico preventivo.
  `
);

registerLines(
  conspiracyData.avian_tracking_program.content,
  `
  REDE CONTINENTAL DE VIGILÂNCIA AVIÁRIA
  RELATÓRIO TRIMESTRAL DE IMPLANTAÇÃO — Q4 1995
  ID_UNIDADE,COBERTURA_ESPÉCIE,REGIÃO,VIDA_BATERIA,CARGA
  AV-3847,Columba livia,NORDESTE,94%,ÁUDIO/VÍDEO
  AV-3848,Columba livia,NORDESTE,91%,ÁUDIO/VÍDEO
  AV-4102,Sturnus vulgaris,CENTRO-OESTE,88%,SOMENTE ÁUDIO
  AV-4103,Sturnus vulgaris,CENTRO-OESTE,92%,SOMENTE ÁUDIO
  AV-4104,Sturnus vulgaris,CENTRO-OESTE,86%,ÁUDIO/VÍDEO
  AV-5001,Corvus brachyrhynchos,OESTE,95%,PACOTE COMPLETO
  AV-5002,Corvus brachyrhynchos,OESTE,89%,PACOTE COMPLETO
  AV-6110,Turdus migratorius,SUL,91%,ÁUDIO/VÍDEO
  AV-6111,Turdus migratorius,SUL,93%,ÁUDIO/VÍDEO
  AV-6112,Turdus migratorius,SUL,87%,TÉRMICO
  NOTAS DE IMPLANTAÇÃO:
    - Rotas migratórias do Q4 rastreadas com sucesso
    - Cobertura de retransmissão de sinal: 94,2% continental
    - Densidade urbana excede a rural por fator de 8,4
    - Manutenção disfarçada como "pesquisa de vida selvagem"
  REGISTRO DE ANOMALIAS:
    - Unidade AV-3201 recuperada por civil (neutralizado)
    - Falha de bateria da unidade AV-4089 em pleno voo
    - Desvio comportamental da unidade AV-5847 (em investigação)
  PRÓXIMA IMPLANTAÇÃO: 847 unidades programadas para Q1 1996
  HISTÓRIA DE COBERTURA: Financiamento para pesquisa de padrões migratórios
  `,
  `
  RED CONTINENTAL DE VIGILANCIA AVIAR
  INFORME TRIMESTRAL DE DESPLIEGUE — Q4 1995
  ID_UNIDAD,COBERTURA_ESPECIE,REGIÓN,BATERÍA,CARGA
  AV-3847,Columba livia,NORESTE,94%,AUDIO/VIDEO
  AV-3848,Columba livia,NORESTE,91%,AUDIO/VIDEO
  AV-4102,Sturnus vulgaris,CENTRO-OESTE,88%,SOLO AUDIO
  AV-4103,Sturnus vulgaris,CENTRO-OESTE,92%,SOLO AUDIO
  AV-4104,Sturnus vulgaris,CENTRO-OESTE,86%,AUDIO/VIDEO
  AV-5001,Corvus brachyrhynchos,OESTE,95%,PAQUETE COMPLETO
  AV-5002,Corvus brachyrhynchos,OESTE,89%,PAQUETE COMPLETO
  AV-6110,Turdus migratorius,SUR,91%,AUDIO/VIDEO
  AV-6111,Turdus migratorius,SUR,93%,AUDIO/VIDEO
  AV-6112,Turdus migratorius,SUR,87%,TÉRMICO
  NOTAS DE DESPLIEGUE:
    - Rutas migratorias de Q4 rastreadas con éxito
    - Cobertura de retransmisión de señal: 94,2% continental
    - La densidad urbana supera a la rural por un factor de 8,4
    - Mantenimiento disfrazado como "investigación de vida silvestre"
  REGISTRO DE ANOMALÍAS:
    - Unidad AV-3201 recuperada por civil (neutralizado)
    - Falla de batería de la unidad AV-4089 en pleno vuelo
    - Desviación conductual de la unidad AV-5847 (en investigación)
  PRÓXIMO DESPLIEGUE: 847 unidades programadas para Q1 1996
  HISTORIA DE COBERTURA: Financiamiento para investigación de patrones migratorios
  `
);

registerLines(
  conspiracyData.consumer_device_listening.content,
  `
  AVALIAÇÃO TÉCNICA — COLETA PASSIVA DE ÁUDIO
  PROJETO: WHISPER
  DATA: 19-DEC-1995
  PARA: Divisão de Coleta Técnica
  DE: Ligação com Eletrônicos de Consumo
  RE: Capacidade de Áudio Ambiente em Dispositivos Domésticos
  RESUMO:
    Trabalhando com fabricantes [REDACTED], nós
    incorporamos com sucesso matrizes passivas de microfone em
    as seguintes categorias de eletrônicos de consumo:
    - Receptores de televisão (teste beta, 12 modelos)
    - Decodificadores de TV a cabo (prontos para implantação total)
    - Secretárias eletrônicas (implantação limitada)
    - Rádios despertador (fase de protótipo)
  CAPACIDADES:
    - Captura contínua de áudio ambiente
    - Ativação por palavra-chave para gravação prioritária
    - Detecção de padrões de sofrimento emocional (experimental)
    - Transmissão em rajadas de dados em horários de pico reduzido
  PREOCUPAÇÕES DE PRIVACIDADE:
    O jurídico informou que as atuais leis de escuta
    não cobrem explicitamente coleta ambiente a partir de
    dispositivos de consumo comprados voluntariamente.
    Recomenda-se manter essa ambiguidade legal.
  PRÓXIMA FASE:
    Expandir para bases de telefones sem fio.
    Integração futura com conceitos de "casa inteligente"
    atualmente em desenvolvimento nos laboratórios [REDACTED].
  `,
  `
  EVALUACIÓN TÉCNICA — RECOLECCIÓN PASIVA DE AUDIO
  PROYECTO: WHISPER
  FECHA: 19-DEC-1995
  PARA: División de Recolección Técnica
  DE: Enlace con Electrónica de Consumo
  RE: Capacidad de Audio Ambiental en Dispositivos Domésticos
  RESUMEN:
    Trabajando con fabricantes [REDACTED], hemos
    incorporado con éxito matrices pasivas de micrófono en
    las siguientes categorías de electrónica de consumo:
    - Receptores de televisión (prueba beta, 12 modelos)
    - Decodificadores de cable (listos para despliegue total)
    - Contestadoras automáticas (despliegue limitado)
    - Radios despertador (fase de prototipo)
  CAPACIDADES:
    - Captura continua de audio ambiental
    - Activación por palabra clave para grabación prioritaria
    - Detección de patrones de angustia emocional (experimental)
    - Transmisión en ráfagas de datos en horas de baja demanda
  PREOCUPACIONES DE PRIVACIDAD:
    El área legal ha indicado que las leyes actuales de intervención
    no cubren explícitamente la recolección ambiental desde
    dispositivos de consumo adquiridos voluntariamente.
    Se recomienda mantener esta ambigüedad legal.
  SIGUIENTE FASE:
    Expandir a estaciones base de teléfonos inalámbricos.
    Integración futura con conceptos de "hogar inteligente"
    actualmente en desarrollo en laboratorios [REDACTED].
  `
);

registerLines(
  conspiracyData.archival_photo_replacement.content,
  `
  ARQUIVO NACIONAL — DIRETRIZ DE GESTÃO DOCUMENTAL
  AVISO: DMD-1995-47
  DATA: 03-OCT-1995
  ASSUNTO: Modernização do Arquivo Histórico de Imagens
  DIRETRIZ:
    Como parte da nossa iniciativa de preservação digital, todos os
    registros fotográficos históricos estão sendo convertidos
    para formato digital usando o protocolo MASTER CLEAN.
  PROCEDIMENTO:
    1. Fotografias originais digitalizadas em alta resolução
    2. Restauração digital aplicada conforme Diretrizes Apêndice C
    3. "Versões-mestre limpas" substituem originais no arquivo
    4. Cópias originais transferidas para instalação [REDACTED]
  DIRETRIZES DE RESTAURAÇÃO (TRECHO):
    - Remover rostos civis inadvertidos (privacidade)
    - Corrigir inconsistências de iluminação
    - Padronizar o posicionamento do pessoal oficial
    - Eliminar elementos de fundo que causem "confusão"
  TRATAMENTO ESPECIAL:
    Imagens sinalizadas nas Categorias 7-12 exigem revisão pelo
    Comitê de Exatidão Histórica antes da digitalização.
    Isso inclui:
      - Figuras políticas em contextos "inconsistentes"
      - Operações militares com narrativas "pouco claras"
      - Eventos com registros oficiais "contestados"
  NOTA: Este processo é apenas administrativo.
        Nenhum registro histórico está sendo alterado.
  `,
  `
  ARCHIVO NACIONAL — DIRECTIVA DE GESTIÓN DOCUMENTAL
  AVISO: DMD-1995-47
  FECHA: 03-OCT-1995
  ASUNTO: Modernización del Archivo Histórico de Imágenes
  DIRECTIVA:
    Como parte de nuestra iniciativa de preservación digital, todos los
    registros fotográficos históricos están siendo convertidos
    a formato digital usando el protocolo MASTER CLEAN.
  PROCEDIMIENTO:
    1. Fotografías originales escaneadas en alta resolución
    2. Restauración digital aplicada según Directrices Apéndice C
    3. "Versiones maestras limpias" reemplazan a los originales en el archivo
    4. Impresiones originales transferidas a instalación [REDACTED]
  DIRECTRICES DE RESTAURACIÓN (EXTRACTO):
    - Eliminar rostros civiles inadvertidos (privacidad)
    - Corregir inconsistencias de iluminación
    - Estandarizar la posición del personal oficial
    - Eliminar elementos de fondo que causen "confusión"
  MANEJO ESPECIAL:
    Las imágenes marcadas en las Categorías 7-12 requieren revisión por el
    Comité de Exactitud Histórica antes de la digitalización.
    Estas incluyen:
      - Figuras políticas en contextos "inconsistentes"
      - Operaciones militares con narrativas "poco claras"
      - Eventos con registros oficiales "disputados"
  NOTA: Este proceso es solo administrativo.
        No se está alterando ningún registro histórico.
  `
);

registerLines(
  conspiracyData.education_curriculum_revision.content,
  `
  COMITÊ CONSULTIVO DE CURRÍCULO — NOTAS DE TRABALHO
  REUNIÃO: 14-AUG-1995
  CLASSIFICAÇÃO: INTERNA
  PARTICIPANTES: [REDACTED]
  ITEM 3 DA AGENDA: Simplificação da Narrativa Histórica
  RESUMO DA DISCUSSÃO:
    O comitê revisou propostas para simplificar o conteúdo
    histórico em materiais de educação secundária.
  PRINCIPAIS RECOMENDAÇÕES:
    1. Contextos geopolíticos complexos devem ser reduzidos a
       estruturas claras de "protagonista/antagonista".
    2. Eventos com múltiplas interpretações válidas devem ser
       apresentados com narrativa única de "consenso".
    3. Tópicos que geram "debate excessivo" entre alunos
       devem receber menos tempo curricular.
  JUSTIFICATIVA:
    Pesquisas indicam que narrativas complexas se correlacionam com:
      - Menor confiança institucional
      - Maior polarização política
      - Métricas mais baixas de coesão social
    Narrativas simplificadas sustentam identidade cívica unificada.
  IMPLEMENTAÇÃO:
    - Eliminar gradualmente análises matizadas de fontes até o 10º ano
    - Enfatizar "patrimônio compartilhado" acima da avaliação crítica
    - Editoras de livros didáticos receberão diretrizes no Q1 de 1996
  MOÇÃO APROVADA: 7-2
  [FIM DAS NOTAS]
  `,
  `
  COMITÉ ASESOR DE CURRÍCULO — NOTAS DE TRABAJO
  REUNIÓN: 14-AUG-1995
  CLASIFICACIÓN: INTERNA
  ASISTENTES: [REDACTED]
  PUNTO 3 DE LA AGENDA: Simplificación de la Narrativa Histórica
  RESUMEN DE LA DISCUSIÓN:
    El comité revisó propuestas para simplificar el contenido
    histórico en materiales de educación secundaria.
  RECOMENDACIONES CLAVE:
    1. Los contextos geopolíticos complejos deben reducirse a
       marcos claros de "protagonista/antagonista".
    2. Los eventos con múltiples interpretaciones válidas deben
       presentarse con una sola narrativa de "consenso".
    3. Los temas que generan "debate excesivo" entre estudiantes
       deben recibir menos tiempo curricular.
  JUSTIFICACIÓN:
    La investigación indica que las narrativas complejas se correlacionan con:
      - Menor confianza institucional
      - Mayor polarización política
      - Menores métricas de cohesión social
    Las narrativas simplificadas apoyan una identidad cívica unificada.
  IMPLEMENTACIÓN:
    - Eliminar gradualmente el análisis matizado de fuentes para 10.º grado
    - Enfatizar la "herencia compartida" por sobre la evaluación crítica
    - Las editoriales de textos recibirán directrices en Q1 1996
  MOCIÓN APROBADA: 7-2
  [FIN DE LAS NOTAS]
  `
);

registerLines(
  conspiracyData.satellite_light_reflection.content,
  `
  PROJETO NIGHTLIGHT — AVALIAÇÃO DE VIABILIDADE
  CLASSIFICAÇÃO: SENSÍVEL
  DATA: 22-NOV-1995
  OBJETIVO:
    Avaliar o desdobramento de matrizes refletoras orbitais para
    iluminação urbana e operações psicológicas.
  RESUMO TÉCNICO:
    - Painéis refletores de mylar: 500 m² de área implantada
    - Altitude orbital: 400 km (equivalente à ISS)
    - Iluminação no solo: ~10% do equivalente à lua cheia
    - Precisão de direcionamento: holofote de raio de 50 km
  RESULTADOS DOS TESTES:
    Teste 1 (Pacífico): Reflexão bem-sucedida.
                       Nenhum relato civil registrado.
    Teste 2 (Atlântico): Sucesso parcial. Refletor
                         com falha na implantação.
    Teste 3 (Continental): Bem-sucedido. 4 relatos civis
                           atribuídos a
                           "fenômenos atmosféricos."
  APLICAÇÕES:
    1. Iluminação de emergência durante desastres
    2. Extensão da estação de cultivo agrícola
    3. Redução do crime urbano por visibilidade noturna
    4. Capacidade [CLASSIFICADA] de operações psicológicas
  PREOCUPAÇÕES:
    - Interferência da comunidade astronômica provável
    - Reações religiosas/culturais imprevisíveis
    - Efeitos da poluição luminosa desconhecidos
  RECOMENDAÇÃO:
    Continuar os testes encobertos. A implantação completa depende
    do desenvolvimento da história de cobertura e dos protocolos
    de notificação internacional.
  `,
  `
  PROYECTO NIGHTLIGHT — EVALUACIÓN DE FACTIBILIDAD
  CLASIFICACIÓN: SENSIBLE
  FECHA: 22-NOV-1995
  OBJETIVO:
    Evaluar el despliegue de matrices reflectoras orbitales para
    iluminación urbana y operaciones psicológicas.
  RESUMEN TÉCNICO:
    - Paneles reflectores de mylar: 500 m² de área desplegada
    - Altitud orbital: 400 km (equivalente a la ISS)
    - Iluminación en tierra: ~10% del equivalente a luna llena
    - Precisión de puntería: reflector de 50 km de radio
  RESULTADOS DE PRUEBA:
    Prueba 1 (Pacífico): Reflexión exitosa.
                         No se registraron reportes civiles.
    Prueba 2 (Atlántico): Éxito parcial. Reflector
                          con falla de despliegue.
    Prueba 3 (Continental): Exitosa. 4 reportes civiles
                            atribuidos a
                            "fenómenos atmosféricos."
  APLICACIONES:
    1. Iluminación de emergencia durante desastres
    2. Extensión de la temporada agrícola
    3. Reducción del crimen urbano mediante visibilidad nocturna
    4. Capacidad [CLASIFICADA] de operaciones psicológicas
  PREOCUPACIONES:
    - Probable interferencia de la comunidad astronómica
    - Reacciones religiosas/culturales impredecibles
    - Efectos de contaminación lumínica desconocidos
  RECOMENDACIÓN:
    Continuar las pruebas encubiertas. El despliegue total depende
    del desarrollo de una historia de cobertura y de protocolos
    de notificación internacional.
  `
);

// Expansion content

registerLines(
  expansionData.journalist_payments.content,
  `
  [CRIPTOGRAFADO — REGISTROS FINANCEIROS]
  Registro de desembolsos detectado. Roteamento via conta de fachada
  através de cooperativa agrícola, Sul de Minas.
  Período: JAN-FEB 1996. Cinco transações de saída.
  AVISO: Acesso não autorizado punível nos termos do
  Artigo 317 do Código Penal Militar.
  `,
  `
  [CIFRADO — REGISTROS FINANCIEROS]
  Registro de desembolsos detectado. Ruta mediante cuenta fantasma
  a través de cooperativa agrícola, Sul de Minas.
  Período: ENE-FEB 1996. Cinco transacciones salientes.
  ADVERTENCIA: Acceso no autorizado punible bajo el
  Artículo 317 del Código Penal Militar.
  `
);

registerLines(
  expansionData.journalist_payments.decryptedFragment!,
  `
  REGISTRO DE DESEMBOLSO — RELAÇÕES COM A MÍDIA
  CONTA: COOPERATIVA AGRÍCOLA SUL DE MINAS (FACHADA)
  PERÍODO: JAN-FEB 1996 — SOMENTE PARA VISUALIZAÇÃO
  23-JAN — R$ 15.000 — RODRIGUES, A.
    O Diário Nacional. Matéria cancelada antes da composição.
  25-JAN — R$ 8.500 — NASCIMENTO, C.
    Folha Paulista. Investigação substituída por
    ângulo de "morador de rua perturba moradores". Publicado.
  27-JAN — R$ 22.000 — [REDACTED]
    Rede Nacional TV. Segmento do Programa Dominical
    retirado. Substituído por prévia de Carnaval.
  TOTAL DESEMBOLSADO: R$ 62.500,00
  PAGAMENTOS ADICIONAIS: Ver livro-razão suplementar.
  Rastro documental limpo. Nenhum recibo retido.
  `,
  `
  REGISTRO DE DESEMBOLSO — RELACIONES CON MEDIOS
  CUENTA: COOPERATIVA AGRÍCOLA SUL DE MINAS (FACHADA)
  PERÍODO: ENE-FEB 1996 — SOLO LECTURA AUTORIZADA
  23-ENE — R$ 15.000 — RODRIGUES, A.
    O Diário Nacional. Nota cancelada antes de composición.
  25-ENE — R$ 8.500 — NASCIMENTO, C.
    Folha Paulista. Investigación reemplazada por
    ángulo de "indigente molesta a residentes". Publicado.
  27-ENE — R$ 22.000 — [REDACTED]
    Rede Nacional TV. Segmento del Programa Dominical
    retirado. Reemplazado con anticipo de Carnaval.
  TOTAL DESEMBOLSADO: R$ 62.500,00
  PAGOS ADICIONALES: Ver libro auxiliar suplementario.
  Rastro documental limpio. Ningún recibo retenido.
  `
);

registerLines(
  expansionData.media_contacts.content,
  `
  CONTATOS DE MÍDIA COOPERATIVOS
  ATUALIZADO: JAN 1996 — USO INTERNO APENAS
  TELEVISÃO:
    SANTOS, Eduardo — Rede Nacional, Diretor de Jornalismo
    Confiabilidade: ALTA. Cooperativo desde 1989.
  IMPRESSO:
    RODRIGUES, André — O Diário Nacional, Chefia de Cidade
    Confiabilidade: ALTA. Já derrubou 3 matérias para nós.
    PEREIRA, Helena — Estado de Minas, Regional
    Confiabilidade: ALTA. Conexão familiar com militares.
  EVITAR:
    Revista Fenômenos — publicação de UFO.
    Editor PACACCINI hostil, não pode ser controlado.
    Apenas monitorar. Não se envolver.
  `,
  `
  CONTACTOS DE MEDIOS COOPERATIVOS
  ACTUALIZADO: ENE 1996 — USO INTERNO SOLAMENTE
  TELEVISIÓN:
    SANTOS, Eduardo — Rede Nacional, Director de Noticias
    Confiabilidad: ALTA. Cooperativo desde 1989.
  PRENSA:
    RODRIGUES, André — O Diário Nacional, Jefe de Ciudad
    Confiabilidad: ALTA. Ha eliminado 3 notas para nosotros.
    PEREIRA, Helena — Estado de Minas, Regional
    Confiabilidad: ALTA. Conexión familiar con militares.
  EVITAR:
    Revista Fenômenos — publicación de OVNI.
    Editor PACACCINI hostil, no puede ser controlado.
    Solo monitorear. No contactar.
  `
);

registerLines(
  expansionData.kill_story_memo.content,
  `
  URGENTE — SUPRESSÃO DE MÍDIA
  DATA: 26-JAN-1996
  DE: Ligação de Assuntos Públicos
  Três matérias em desenvolvimento. Todas devem morrer.
  1. PROGRAMA DOMINICAL (Rede Nacional)
     28-JAN, 21:00. "O Que os Militares Escondem."
     STATUS: MORTE CONFIRMADA. Segmento substituído.
  2. FOLHA PAULISTA
     Capa de 29-JAN. Matéria investigativa.
     STATUS: Redirecionado para ângulo de "morador de rua".
  3. REVISTA ISTO
     Edição de fevereiro. Capa de 8 páginas na gráfica.
     STATUS: CRÍTICO. Impressão atrasada.
     Pagamento maior autorizado.
  Se jornalista não cooperar, encaminhar Protocolo SOMBRA.
  `,
  `
  URGENTE — SUPRESIÓN DE MEDIOS
  FECHA: 26-ENE-1996
  DE: Enlace de Asuntos Públicos
  Tres notas en desarrollo. Todas deben morir.
  1. PROGRAMA DOMINICAL (Rede Nacional)
     28-ENE, 21:00. "Lo Que los Militares Ocultan."
     ESTADO: CANCELACIÓN CONFIRMADA. Segmento reemplazado.
  2. FOLHA PAULISTA
     Portada del 29-ENE. Artículo de investigación.
     ESTADO: Redirigido a ángulo de "indigente".
  3. REVISTA ISTO
     Edición de febrero. Portada de 8 páginas en imprenta.
     ESTADO: CRÍTICO. Impresión retrasada.
     Pago mayor autorizado.
  Si periodista no coopera, referir Protocolo SOMBRA.
  `
);

registerLines(
  expansionData.tv_coverage_report.content,
  `
  RELATÓRIO DE INTELIGÊNCIA — AMEAÇA DE COBERTURA DE TV
  DATA: 25-JAN-1996 — PRIORIDADE: ALTA
  Programa Dominical. Rede Nacional.
  Audiência: 40+ milhões. Horário: 21:00, Domingo 28-JAN.
  Equipe de produção enviada a Varginha em 24-JAN.
  Material obtido:
    — Entrevistas com as três irmãs
    — Filmagem de veículos militares (não verificada)
    — Declaração de guarda de segurança do hospital
    — Comentário de ufólogo civil
  POTENCIAL DE DANO: SEVERO.
  Exposição nacional. Repercussão internacional garantida.
  AÇÃO: Contatar diretor de jornalismo SANTOS.
  Invocar segurança nacional. Oferecer substituto de Carnaval.
  `,
  `
  INFORME DE INTELIGENCIA — AMENAZA DE COBERTURA DE TV
  FECHA: 25-ENE-1996 — PRIORIDAD: ALTA
  Programa Dominical. Rede Nacional.
  Audiencia: 40+ millones. Horario: 21:00, Domingo 28-ENE.
  Equipo de producción enviado a Varginha el 24-ENE.
  Material obtenido:
    — Entrevistas con las tres hermanas
    — Filmación de vehículos militares (no verificada)
    — Declaración de guardia de seguridad del hospital
    — Comentario de ufólogo civil
  POTENCIAL DE DAÑO: SEVERO.
  Exposición nacional. Repercusión internacional garantizada.
  ACCIÓN: Contactar director de noticias SANTOS.
  Invocar seguridad nacional. Ofrecer sustituto de Carnaval.
  `
);

registerLines(
  expansionData.foreign_press_alert.content,
  `
  ALERTA — INTERESSE DA IMPRENSA ESTRANGEIRA
  DATA: 15-JUN-1996 — RESTRITO
  American Business Journal designou correspondente
  J. BROOKE (sucursal Rio, 12 anos na América Latina).
  Avaliação: PROFISSIONAL, PERSISTENTE.
  Atividades conhecidas:
    — Protocolou FOIA junto à Força Aérea Brasileira
    — Contatou administração do Hospital Regional
    — Visitou bairro Jardim Andere
  Publicação prevista para final de junho.
  Não é possível usar táticas domésticas de supressão em
  imprensa internacional. Regras diferentes se aplicam.
  Orientar fontes brasileiras cooperativas a enfatizar
  explicação do "Mudinho" e ângulo de histeria coletiva.
  `,
  `
  ALERTA — INTERÉS DE PRENSA EXTRANJERA
  FECHA: 15-JUN-1996 — RESTRINGIDO
  American Business Journal asignó corresponsal
  J. BROOKE (oficina de Río, 12 años en América Latina).
  Evaluación: PROFESIONAL, PERSISTENTE.
  Actividades conocidas:
    — Presentó FOIA ante la Fuerza Aérea Brasileña
    — Contactó administración del Hospital Regional
    — Visitó barrio Jardim Andere
  Publicación esperada a fines de junio.
  No se pueden usar tácticas domésticas de supresión con
  prensa internacional. Aplican reglas diferentes.
  Instruir a fuentes brasileñas cooperativas a enfatizar
  explicación del "Mudinho" y ángulo de histeria colectiva.
  `
);

registerLines(
  expansionData.witness_visit_log.content,
  `
  REGISTRO DE CONTATO COM TESTEMUNHAS — OPERAÇÃO SILÊNCIO
  PERÍODO: 21-JAN a 15-FEB 1996 — RESTRITO
  VISITA #001 — 21-JAN, 22:00
    WITNESS-1 (irmã mais velha). Residência, Jardim Andere.
    Equipe: COBRA-1, COBRA-2. Duração: 45 min.
    Resultado: COOPERATIVA. Retratação assinada.
  VISITA #002 — 21-JAN, 23:30
    WITNESS-2 (irmã do meio). Mesma residência.
    Duração: 30 min. Resultado: COOPERATIVA.
  VISITA #003 — 22-JAN, 06:00
    WITNESS-3 (mais nova). Local de trabalho.
    Equipe: COBRA-3, COBRA-4. Duração: 20 min.
    Resultado: RESISTENTE. Acompanhamento necessário.
  VISITA #005 — 23-JAN, 19:00
    WITNESS-3 (acompanhamento). Residência.
    Equipe: COBRA-1, COBRA-2, COBRA-5.
    Duração: 90 min. Persuasão estendida.
    Resultado: COOPERATIVA.
  TOTAL: 14 contatos. 12 cooperativos. 2 resistentes (resolvidos).
  `,
  `
  REGISTRO DE CONTACTO CON TESTIGOS — OPERACIÓN SILÊNCIO
  PERÍODO: 21-ENE a 15-FEB 1996 — RESTRINGIDO
  VISITA #001 — 21-ENE, 22:00
    WITNESS-1 (hermana mayor). Residencia, Jardim Andere.
    Equipo: COBRA-1, COBRA-2. Duración: 45 min.
    Resultado: COOPERATIVA. Retractación firmada.
  VISITA #002 — 21-ENE, 23:30
    WITNESS-2 (hermana del medio). Misma residencia.
    Duración: 30 min. Resultado: COOPERATIVA.
  VISITA #003 — 22-ENE, 06:00
    WITNESS-3 (menor). Lugar de trabajo.
    Equipo: COBRA-3, COBRA-4. Duración: 20 min.
    Resultado: RESISTENTE. Seguimiento requerido.
  VISITA #005 — 23-ENE, 19:00
    WITNESS-3 (seguimiento). Residencia.
    Equipo: COBRA-1, COBRA-2, COBRA-5.
    Duración: 90 min. Persuasión extendida.
    Resultado: COOPERATIVA.
  TOTAL: 14 contactos. 12 cooperativos. 2 resistentes (resueltos).
  `
);

registerLines(
  expansionData.debriefing_protocol.content,
  `
  INTERROGATÓRIO DE TESTEMUNHA — PROTOCOLO SOMBRA
  CLASSIFICAÇÃO: RESTRITA
  FASE 1 — ABORDAGEM
    Equipe mínima de dois. Ternos escuros.
    Chegar 22:00-06:00. Identificação mínima.
    "Somos do governo."
  FASE 2 — AVALIAÇÃO
    TIPO A (amedrontado): Prosseguir para tranquilização.
    TIPO B (curioso): Enfatizar segurança nacional.
      "A segurança da sua família depende do silêncio."
    TIPO C (hostil): Acionar equipe secundária.
      Sessão estendida. Ver SOMBRA-EXTENDED.
  FASE 3 — DOCUMENTAÇÃO
    Obter retratação assinada e NDA (Formulário W-7).
  FASE 4 — ACOMPANHAMENTO
    Monitorar no mínimo 30 dias. Verificar nenhum contato com mídia.
  AUTORIZADO: Persuasão verbal, incentivo financeiro.
  PROIBIDO: Contato físico.
  Todas as sessões NÃO REGISTRADAS. Sem anotações na presença da testemunha.
  `,
  `
  INTERROGATORIO DE TESTIGO — PROTOCOLO SOMBRA
  CLASIFICACIÓN: RESTRINGIDA
  FASE 1 — ABORDAJE
    Equipo mínimo de dos. Trajes oscuros.
    Llegar 22:00-06:00. Identificación mínima.
    "Somos del gobierno."
  FASE 2 — EVALUACIÓN
    TIPO A (asustado): Proceder a tranquilización.
    TIPO B (curioso): Enfatizar seguridad nacional.
      "La seguridad de su familia depende del silencio."
    TIPO C (hostil): Desplegar equipo secundario.
      Sesión extendida. Ver SOMBRA-EXTENDED.
  FASE 3 — DOCUMENTACIÓN
    Obtener retractación firmada y NDA (Formulario W-7).
  FASE 4 — SEGUIMIENTO
    Monitorear mínimo 30 días. Verificar ningún contacto con medios.
  AUTORIZADO: Persuasión verbal, incentivo financiero.
  PROHIBIDO: Contacto físico.
  Todas las sesiones NO REGISTRADAS. Sin notas en presencia del testigo.
  `
);

registerLines(
  expansionData.silva_sisters_file.content,
  `
  ARQUIVO DE SUJEITO — AS TRÊS TESTEMUNHAS
  ARQUIVO: VAR-96-W001 — RESTRITO
  WITNESS-1 (mais velha). Idade 22. Trabalhadora doméstica.
    Viu criatura 15:30, 20-JAN. Jardim Andere.
    "Ela olhou para mim." Assustada, religiosa.
    Pressão: Saúde da mãe, segurança no emprego.
    RETRATOU-SE 23-JAN. "Vi um morador de rua."
  WITNESS-2 (do meio). Idade 16. Estudante.
    Impressionável, facilmente influenciável.
    RETRATOU-SE 22-JAN. "Irmã estava confusa."
  WITNESS-3 (mais nova). Idade 14. Estudante.
    RESISTENTE. Desafiadora. Mantém a história.
    NÃO assinou retratação.
    Concordou apenas em permanecer calada.
  Pai falecido. Família católica. Classe média baixa.
  Risco: MODERADO. WITNESS-3 permanece não convencida.
  `,
  `
  ARCHIVO DE SUJETO — LAS TRES TESTIGOS
  ARCHIVO: VAR-96-W001 — RESTRINGIDO
  WITNESS-1 (mayor). Edad 22. Trabajadora doméstica.
    Vio criatura 15:30, 20-ENE. Jardim Andere.
    "Me miró." Asustada, religiosa.
    Presión: Salud de la madre, seguridad laboral.
    SE RETRACTÓ 23-ENE. "Vi a un indigente."
  WITNESS-2 (del medio). Edad 16. Estudiante.
    Impresionable, fácilmente influenciable.
    SE RETRACTÓ 22-ENE. "Hermana estaba confundida."
  WITNESS-3 (menor). Edad 14. Estudiante.
    RESISTENTE. Desafiante. Mantiene su historia.
    NO firmó retractación.
    Aceptó solo guardar silencio.
  Padre fallecido. Familia católica. Clase media baja.
  Riesgo: MODERADO. WITNESS-3 permanece no convencida.
  `
);

registerLines(
  expansionData.recantation_form_001.content,
  `
  CORREÇÃO DE DECLARAÇÃO DE TESTEMUNHA
  FORMULÁRIO W-9 (RETRATAÇÃO VOLUNTÁRIA)
  Eu, [WITNESS-1], em plenas faculdades mentais, declaro:
  Em 20 de janeiro de 1996, relatei ter visto uma figura
  incomum no Jardim Andere, Varginha.
  Agora reconheço que estava ENGANADA.
  O que vi foi um indivíduo em situação de rua, possivelmente
  embriagado. A aparência incomum deveu-se à
  iluminação precária e meu próprio estado de medo.
  Não falarei com jornalistas sobre este assunto.
  Não participarei de entrevistas na mídia.
  Esta declaração é prestada de forma livre e voluntária.
  Assinatura: [ASSINADO]
  Data: 23-JAN-1996
  Testemunha: [REDACTED], Agente Federal
  `,
  `
  CORRECCIÓN DE DECLARACIÓN DE TESTIGO
  FORMULARIO W-9 (RETRACTACIÓN VOLUNTARIA)
  Yo, [WITNESS-1], en pleno uso de mis facultades mentales, declaro:
  El 20 de enero de 1996, reporté haber visto una figura
  inusual en Jardim Andere, Varginha.
  Ahora reconozco que estaba EQUIVOCADA.
  Lo que vi fue un individuo en situación de calle, posiblemente
  intoxicado. La apariencia inusual se debió a
  mala iluminación y mi propio estado de miedo.
  No hablaré con periodistas sobre este asunto.
  No participaré en entrevistas con medios.
  Esta declaración es prestada libre y voluntariamente.
  Firma: [FIRMADO]
  Fecha: 23-ENE-1996
  Testigo: [REDACTED], Agente Federal
  `
);

registerLines(
  expansionData.mudinho_dossier.content,
  `
  ATIVO DE COBERTURA — CODINOME "MUDINHO"
  ARQUIVO: CS-96-001 — RESTRITO
  Sujeito: [REDACTED], conhecido localmente como "Mudinho".
  Idade: ~35-40. Deficiência mental. Em situação de rua.
  Altura: 1,40m. Magro. Pele escura. Postura curvada.
  Não verbal — não pode contradizer a narrativa.
  NARRATIVA IMPLANTADA:
    "Testemunhas confundiram um homem local com deficiência mental
     com algo incomum devido à iluminação precária."
  VANTAGENS: Conhecido localmente. Explica a postura agachada.
  DESVANTAGENS:
    — Cor da pele errada (marrom, não cinza)
    — Não explica os olhos vermelhos
    — NÃO estava no Jardim Andere em 20-JAN
  Sujeito realocado para instituição de cuidados em 02-FEB
  para impedir contato com jornalistas.
  `,
  `
  ACTIVO DE COBERTURA — NOMBRE CLAVE "MUDINHO"
  ARCHIVO: CS-96-001 — RESTRINGIDO
  Sujeto: [REDACTED], conocido localmente como "Mudinho".
  Edad: ~35-40. Discapacidad mental. En situación de calle.
  Altura: 1,40m. Delgado. Piel oscura. Postura encorvada.
  No verbal — no puede contradecir la narrativa.
  NARRATIVA IMPLANTADA:
    "Testigos confundieron a un hombre local con discapacidad mental
     con algo inusual debido a mala iluminación."
  VENTAJAS: Conocido localmente. Explica postura agachada.
  DESVENTAJAS:
    — Color de piel incorrecto (marrón, no gris)
    — No explica los ojos rojos
    — NO estaba en Jardim Andere el 20-ENE
  Sujeto reubicado a centro de cuidados el 02-FEB
  para impedir contacto con periodistas.
  `
);

registerLines(
  expansionData.alternative_explanations.content,
  `
  OPÇÕES DE HISTÓRIA DE COBERTURA — INCIDENTE DE VARGINHA
  COMPILADO: 22-JAN-1996 — USO INTERNO APENAS
  A. BALÃO METEOROLÓGICO — Para avistamentos aéreos.
     Força: Clássico. Fraqueza: Sem explicação terrestre.
  B. MORADOR DE RUA (MUDINHO) — Principal, relatos de criatura.
     Força: Explica forma humanoide.
     Fraqueza: Contradito por detalhes das testemunhas.
  C. ANIMAL ESCAPADO — Reserva.
     Fraqueza: Nenhum zoológico relatou fuga.
  D. EXERCÍCIO MILITAR — Para avistamentos de veículos.
     Fraqueza: Nenhum exercício estava programado.
  E. HISTERIA COLETIVA — Descrédito de longo prazo.
     Fraqueza: Requer tempo para se estabelecer.
  F. BRINCALHÕES — Alternativa de reserva.
     Fraqueza: Requer brincalhões identificados.
  RECOMENDAÇÃO: Implantar múltiplas simultaneamente.
  A confusão serve à contenção.
  `,
  `
  OPCIONES DE HISTORIA DE COBERTURA — INCIDENTE DE VARGINHA
  COMPILADO: 22-ENE-1996 — USO INTERNO SOLAMENTE
  A. GLOBO METEOROLÓGICO — Para avistamientos aéreos.
     Fortaleza: Clásico. Debilidad: Sin explicación terrestre.
  B. INDIGENTE (MUDINHO) — Principal, reportes de criatura.
     Fortaleza: Explica forma humanoide.
     Debilidad: Contradicho por detalles de testigos.
  C. ANIMAL ESCAPADO — Reserva.
     Debilidad: Ningún zoológico reportó fuga.
  D. EJERCICIO MILITAR — Para avistamientos de vehículos.
     Debilidad: Ningún ejercicio estaba programado.
  E. HISTERIA COLECTIVA — Descrédito a largo plazo.
     Debilidad: Requiere tiempo para establecerse.
  F. BROMISTAS — Alternativa de reserva.
     Debilidad: Requiere bromistas identificados.
  RECOMENDACIÓN: Implantar múltiples simultáneamente.
  La confusión sirve a la contención.
  `
);

registerLines(
  expansionData.media_talking_points.content,
  `
  PONTOS DE FALA — TODOS OS PORTA-VOZES AUTORIZADOS
  DATA: 24-JAN-1996
  AVISTAMENTOS DE CRIATURAS:
    "Um indivíduo local em situação de rua conhecido na área."
  ATIVIDADE MILITAR:
    "Operações logísticas rotineiras."
  HOSPITAL:
    "Assuntos médicos confidenciais. Sem comentários."
  UFOS:
    "Nenhuma evidência de fenômenos aéreos não identificados."
  ENCOBRIMENTO:
    "Teorias conspiratórias sem fundamento."
  NÃO: Engajar com relatos de testemunhas.
  NÃO: Confirmar informação classificada.
  NÃO: Reconhecer qualquer "investigação".
  `,
  `
  PUNTOS DE CONVERSACIÓN — TODOS LOS VOCEROS AUTORIZADOS
  FECHA: 24-ENE-1996
  AVISTAMIENTOS DE CRIATURAS:
    "Un individuo local en situación de calle conocido en el área."
  ACTIVIDAD MILITAR:
    "Operaciones logísticas rutinarias."
  HOSPITAL:
    "Asuntos médicos confidenciales. Sin comentarios."
  OVNIS:
    "Ninguna evidencia de fenómenos aéreos no identificados."
  ENCUBRIMIENTO:
    "Teorías conspirativas sin fundamento."
  NO: Interactuar con relatos de testigos.
  NO: Confirmar información clasificada.
  NO: Reconocer ninguna "investigación".
  `
);

registerLines(
  expansionData.animal_deaths_report.content,
  `
  RELATÓRIO DE INCIDENTE — ZOOLÓGICO MUNICIPAL DE VARGINHA
  DATA: 28-JAN-1996 — RESTRITO
  22-JAN — ANTA. Idade 8. Saúde prévia: excelente.
    Encontrada morta. Hemorragia interna, falência de órgãos.
  24-JAN — JAGUATIRICA. Idade 5. Saúde prévia: boa.
    Convulsões, declínio rápido. Dano neurológico.
  25-JAN — VEADO. Idade 3. Saúde prévia: excelente.
    Agitação extrema, colapso. Parada cardíaca.
  27-JAN — CAPIVARA. Idade 6. Saúde prévia: boa.
    Recusou comida, tremores. Falência múltipla de órgãos.
  Dra. Ana FERREIRA: "Essas mortes são sem precedentes.
  A proximidade com o incidente de 20-JAN não pode ser
  coincidência."
  NOTA: Animais alojados adjacentes à área de CONTENÇÃO
  TEMPORÁRIA usada em 20-21 JAN para espécime de fauna.
  `,
  `
  INFORME DE INCIDENTE — ZOOLÓGICO MUNICIPAL DE VARGINHA
  FECHA: 28-ENE-1996 — RESTRINGIDO
  22-ENE — TAPIR. Edad 8. Salud previa: excelente.
    Encontrado muerto. Hemorragia interna, falla orgánica.
  24-ENE — OCELOTE. Edad 5. Salud previa: buena.
    Convulsiones, deterioro rápido. Daño neurológico.
  25-ENE — VENADO. Edad 3. Salud previa: excelente.
    Agitación extrema, colapso. Paro cardíaco.
  27-ENE — CAPIBARA. Edad 6. Salud previa: buena.
    Rechazó comida, temblores. Falla multiorgánica.
  Dra. Ana FERREIRA: "Estas muertes no tienen precedentes.
  La proximidad al incidente del 20-ENE no puede ser
  coincidencia."
  NOTA: Animales alojados adyacentes al área de CONTENCIÓN
  TEMPORAL usada el 20-21 ENE para espécimen de fauna.
  `
);

registerLines(
  expansionData.veterinarian_silencing.content,
  `
  CONTENÇÃO — VETERINÁRIA DO ZOOLÓGICO
  DATA: 30-JAN-1996 — RESTRITO
  Sujeito: Dra. Ana FERREIRA. Nível de ameaça: MODERADO.
  Conectou mortes de animais ao incidente classificado.
  Documentou achados anômalos de necropsia.
  25-JAN: Contato inicial (Protocolo SOMBRA).
    PARCIALMENTE COOPERATIVA.
  28-JAN: Amostras de necropsia CONFISCADAS.
    Cobertura: "Diretriz de saúde pública."
  29-JAN: Pressão administrativa. Licença estendida.
  30-JAN: Visita COBRA. 2 horas.
    TOTALMENTE COOPERATIVA. Assinou NDA.
    Mortes atribuídas a "ração contaminada".
  Marido trabalha na universidade estadual.
  Pressão empregatícia disponível se necessário.
  `,
  `
  CONTENCIÓN — VETERINARIA DEL ZOOLÓGICO
  FECHA: 30-ENE-1996 — RESTRINGIDO
  Sujeto: Dra. Ana FERREIRA. Nivel de amenaza: MODERADO.
  Conectó muertes de animales con incidente clasificado.
  Documentó hallazgos anómalos de necropsia.
  25-ENE: Contacto inicial (Protocolo SOMBRA).
    PARCIALMENTE COOPERATIVA.
  28-ENE: Muestras de necropsia CONFISCADAS.
    Cobertura: "Directiva de salud pública."
  29-ENE: Presión administrativa. Licencia extendida.
  30-ENE: Visita COBRA. 2 horas.
    TOTALMENTE COOPERATIVA. Firmó NDA.
    Muertes atribuidas a "alimento contaminado".
  Esposo trabaja en universidad estatal.
  Presión laboral disponible si es necesario.
  `
);

registerLines(
  expansionData.contamination_theory.content,
  `
  EXPLICAÇÃO OFICIAL — MORTES DE ANIMAIS NO ZOOLÓGICO
  PARA: Divulgação Pública — 01-FEB-1996
  NOTA À IMPRENSA:
    "O Zoológico Municipal lamenta a perda de quatro
     animais no final de janeiro. Investigação determinou
     que a causa foi ração contaminada recebida em 18-JAN.
     Novos protocolos com fornecedores estão sendo implementados."
  INTERNO (NÃO DIVULGAR):
    Registros de ração alterados. Fornecedor compensado.
    Causa real: contaminação por proximidade do
    espécime de fauna recuperado mantido em 20-21 JAN.
  `,
  `
  EXPLICACIÓN OFICIAL — MUERTES DE ANIMALES EN ZOOLÓGICO
  PARA: Divulgación Pública — 01-FEB-1996
  COMUNICADO DE PRENSA:
    "El Zoológico Municipal lamenta la pérdida de cuatro
     animales a fines de enero. La investigación determinó
     que la causa fue alimento contaminado recibido el 18-ENE.
     Se están implementando nuevos protocolos con proveedores."
  INTERNO (NO DIVULGAR):
    Registros de alimento alterados. Proveedor compensado.
    Causa real: contaminación por proximidad del
    espécimen de fauna recuperado mantenido el 20-21 ENE.
  `
);

registerLines(
  expansionData.chereze_incident_report.content,
  `
  INCIDENTE DE CONTATO — OFICIAL [CLASSIFICADO]
  ARQUIVO: VAR-96-MED-007 — ULTRASSECRETO
  Cabo, 4ª Companhia, PM de Varginha.
  Status: FALECIDO (15-FEB-1996).
  20-JAN 21:30 — Respondeu a chamado, Jardim Andere.
    Fez contato físico com espécime de fauna.
    Antebraço esquerdo, pele exposta. 3-4 segundos.
  23-JAN — Dores de cabeça, dores articulares. Irritação na pele
    no local de contato. Relata "sonhos estranhos".
  27-JAN — Hospitalizado. Febre, marcadores sanguíneos anômalos.
  02-FEB — Deterioração rápida. Múltiplos sistemas orgânicos.
    Transferido para hospital militar, São Paulo.
  15-FEB 03:47 — Expirou.
    Causa oficial: "Pneumonia."
  SUPRIMIDO: Necrose tecidual no local de contato.
  Colapso do sistema imunológico. Patógeno não identificável.
  Médico assistente: "Nunca vi nada assim.
  Isto não é nenhuma doença conhecida."
  `,
  `
  INCIDENTE DE CONTACTO — OFICIAL [CLASIFICADO]
  ARCHIVO: VAR-96-MED-007 — ULTRASECRETO
  Cabo, 4ª Compañía, PM de Varginha.
  Estado: FALLECIDO (15-FEB-1996).
  20-ENE 21:30 — Respondió a llamado, Jardim Andere.
    Hizo contacto físico con espécimen de fauna.
    Antebrazo izquierdo, piel expuesta. 3-4 segundos.
  23-ENE — Dolores de cabeza, dolor articular. Irritación en piel
    en sitio de contacto. Reporta "sueños extraños".
  27-ENE — Hospitalizado. Fiebre, marcadores sanguíneos anómalos.
  02-FEB — Deterioro rápido. Múltiples sistemas orgánicos.
    Transferido a hospital militar, São Paulo.
  15-FEB 03:47 — Expiró.
    Causa oficial: "Neumonía."
  SUPRIMIDO: Necrosis tisular en sitio de contacto.
  Colapso del sistema inmunológico. Patógeno no identificable.
  Médico tratante: "Nunca he visto nada así.
  Esto no es ninguna enfermedad conocida."
  `
);

registerLines(
  expansionData.autopsy_suppression.content,
  `
  DIRETIVA — SUPRESSÃO DE AUTÓPSIA
  DATA: 16-FEB-1996 — ULTRASSECRETO
  RE: Restos mortais do cabo falecido.
  1. Autópsia padrão CANCELADA.
  2. Exame modificado apenas por pessoal do Projeto HARVEST.
  3. Todas as amostras de tecido classificadas. Transferir para
     instalação [REDACTED] imediatamente.
  4. Relatório oficial declarará: "Insuficiência respiratória
     secundária a complicações de pneumonia."
  5. Nenhuma cópia retida no hospital ou necrotério municipal.
  Patógeno anômalo deve ser estudado apenas sob condições
  controladas. Pessoal médico que observou a condição
  real interrogado sob Protocolo SOMBRA.
  `,
  `
  DIRECTIVA — SUPRESIÓN DE AUTOPSIA
  FECHA: 16-FEB-1996 — ULTRASECRETO
  RE: Restos mortales del cabo fallecido.
  1. Autopsia estándar CANCELADA.
  2. Examen modificado solo por personal del Proyecto HARVEST.
  3. Todas las muestras de tejido clasificadas. Transferir a
     instalación [REDACTED] inmediatamente.
  4. Informe oficial declarará: "Falla respiratoria
     secundaria a complicaciones de neumonía."
  5. Ninguna copia retenida en hospital o morgue municipal.
  Patógeno anómalo debe estudiarse solo bajo condiciones
  controladas. Personal médico que observó la condición
  real interrogado bajo Protocolo SOMBRA.
  `
);

registerLines(
  expansionData.family_compensation.content,
  `
  COMPENSAÇÃO — FAMÍLIA DO OFICIAL
  DATA: 20-FEB-1996 — RESTRITO
  Esposa: [REDACTED]. Filhos: 2 (idades 7 e 4).
  OFICIAL: Pensão por morte em serviço, seguro.
    Total: R$ 45.000.
  SUPLEMENTAR CLASSIFICADO:
    R$ 50.000 em dinheiro.
    R$ 2.000/mês de pensão (5 anos).
    Apartamento fornecido, Belo Horizonte.
  CONDIÇÕES:
    — Aceitar narrativa de "pneumonia"
    — Nenhum contato com mídia, nunca
    — Nenhuma ação legal contra o governo
    — Mudar-se de Varginha em 30 dias
    — Nenhum contato com investigadores de UFO
  Assinado: [ESPOSA DO OFICIAL], 20-FEB-1996.
  Família mudou-se para Belo Horizonte em 15-MAR.
  `,
  `
  COMPENSACIÓN — FAMILIA DEL OFICIAL
  FECHA: 20-FEB-1996 — RESTRINGIDO
  Esposa: [REDACTED]. Hijos: 2 (edades 7 y 4).
  OFICIAL: Pensión por muerte en servicio, seguro.
    Total: R$ 45.000.
  SUPLEMENTARIO CLASIFICADO:
    R$ 50.000 en efectivo.
    R$ 2.000/mes de estipendio (5 años).
    Apartamento proporcionado, Belo Horizonte.
  CONDICIONES:
    — Aceptar narrativa de "neumonía"
    — Ningún contacto con medios, nunca
    — Ninguna acción legal contra el gobierno
    — Reubicarse de Varginha en 30 días
    — Ningún contacto con investigadores de OVNI
  Firmado: [ESPOSA DEL OFICIAL], 20-FEB-1996.
  Familia se mudó a Belo Horizonte el 15-MAR.
  `
);

registerLines(
  expansionData.coffee_harvest_report.content,
  `
  RELATÓRIO ECONÔMICO REGIONAL — SETOR CAFEEIRO
  Q1 1996 — SUL DE MINAS
  Safra progredindo normalmente.
  Produção esperada: 2,3 milhões de sacas.
  Qualidade: Acima da média.
  Bolsa de Commodities NYC: $1,42/lb (média jan).
  Preço cooperativa local: R$ 85,00/saca. Estável.
  Varginha permanece o polo logístico da região.
  Capacidade ferroviária adequada. Processamento de exportação normal.
  Nenhuma anomalia econômica detectada.
  `,
  `
  INFORME ECONÓMICO REGIONAL — SECTOR CAFETERO
  Q1 1996 — SUL DE MINAS
  Cosecha progresando normalmente.
  Rendimiento esperado: 2,3 millones de sacos.
  Calidad: Por encima del promedio.
  Bolsa de Commodities NYC: $1,42/lb (promedio ene).
  Precio cooperativa local: R$ 85,00/saco. Estable.
  Varginha sigue siendo el centro logístico de la región.
  Capacidad ferroviaria adecuada. Procesamiento de exportación normal.
  Ninguna anomalía económica detectada.
  `
);

registerLines(
  expansionData.weather_report_jan96.content,
  `
  RESUMO METEOROLÓGICO — JANEIRO 1996
  ESTAÇÃO: Varginha Regional (21°33'S, 45°26'W)
  Padrões normais de verão para Sul de Minas.
  19-JAN: 28°C máx, 18°C mín. 12mm chuva.
    Céu limpo após 22:00.
  20-JAN: 31°C máx, 19°C mín. 0mm precipitação.
    Cobertura de nuvens: 15%. Vento: calmo.
    Excelente visibilidade dia e noite.
  21-JAN: 29°C máx, 17°C mín. 8mm chuva à noite.
  Nenhum fenômeno atmosférico incomum registrado.
  `,
  `
  RESUMEN METEOROLÓGICO — ENERO 1996
  ESTACIÓN: Varginha Regional (21°33'S, 45°26'W)
  Patrones normales de verano para Sul de Minas.
  19-ENE: 28°C máx, 18°C mín. 12mm lluvia.
    Cielo despejado después de 22:00.
  20-ENE: 31°C máx, 19°C mín. 0mm precipitación.
    Cobertura de nubes: 15%. Viento: calmo.
    Excelente visibilidad día y noche.
  21-ENE: 29°C máx, 17°C mín. 8mm lluvia nocturna.
  Ningún fenómeno atmosférico inusual registrado.
  `
);

registerLines(
  expansionData.local_politics_memo.content,
  `
  RESUMO POLÍTICO — MUNICÍPIO DE VARGINHA
  DATA: 15-JAN-1996 — AVALIAÇÃO DE ROTINA
  Prefeito: [REDACTED], PMDB. Mandato: 1993-1996.
  Aprovação: Moderada. Sem controvérsias.
  Eleições municipais agendadas para outubro 1996.
  Projetos de infraestrutura no prazo.
  Relações com cooperativa cafeeira estáveis.
  Expansão hospitalar aprovada.
  Segurança: Pequena criminalidade dentro dos parâmetros normais.
  Sem crime organizado. Sem agitação trabalhista.
  Avaliação: Politicamente estável. Sem prioridade de monitoramento.
  `,
  `
  RESUMEN POLÍTICO — MUNICIPIO DE VARGINHA
  FECHA: 15-ENE-1996 — EVALUACIÓN DE RUTINA
  Alcalde: [REDACTED], PMDB. Mandato: 1993-1996.
  Aprobación: Moderada. Sin controversias.
  Elecciones municipales programadas para octubre 1996.
  Proyectos de infraestructura en plazo.
  Relaciones con cooperativa cafetera estables.
  Expansión hospitalaria aprobada.
  Seguridad: Delitos menores dentro de parámetros normales.
  Sin crimen organizado. Sin conflictos laborales.
  Evaluación: Políticamente estable. Sin prioridad de monitoreo.
  `
);

registerLines(
  expansionData.municipal_budget_96.content,
  `
  ORÇAMENTO MUNICIPAL — PREFEITURA DE VARGINHA 1996
  Receita projetada: R$ 42.500.000.
    Educação ................ 28% (R$ 11.900.000)
    Saúde ................... 22% (R$  9.350.000)
    Infraestrutura .......... 18% (R$  7.650.000)
    Segurança Pública ....... 12% (R$  5.100.000)
    Administração ........... 10% (R$  4.250.000)
    Cultura e Esportes ......  5% (R$  2.125.000)
    Reserva .................  5% (R$  2.125.000)
  Projetos especiais: Expansão da ala hospitalar (Fase 2),
  renovação escolar, manutenção da Rota 381,
  melhorias no zoológico municipal.
  Aprovado pela Câmara Municipal, 18-DEC-1995.
  `,
  `
  PRESUPUESTO MUNICIPAL — PREFECTURA DE VARGINHA 1996
  Ingresos proyectados: R$ 42.500.000.
    Educación ............... 28% (R$ 11.900.000)
    Salud ................... 22% (R$  9.350.000)
    Infraestructura ......... 18% (R$  7.650.000)
    Seguridad Pública ....... 12% (R$  5.100.000)
    Administración .......... 10% (R$  4.250.000)
    Cultura y Deportes ......  5% (R$  2.125.000)
    Reserva .................  5% (R$  2.125.000)
  Proyectos especiales: Expansión del ala hospitalaria (Fase 2),
  renovación escolar, mantenimiento Ruta 381,
  mejoras en zoológico municipal.
  Aprobado por Concejo Municipal, 18-DIC-1995.
  `
);

registerLines(
  expansionData.railroad_schedule.content,
  `
  TRÁFEGO FERROVIÁRIO — ESTAÇÃO VARGINHA
  JANEIRO 1996
  SERVIÇO REGULAR:
    Seg-Sex 06:00 — Carga de café (sentido sul)
    Seg-Sex 14:00 — Bens industriais (sentido norte)
    Ter-Qui 22:00 — Frete noturno
  MOVIMENTOS ESPECIAIS:
    20-JAN 03:30 — 3 vagões de carga cobertos.
      Destino: Campinas. Autorização militar.
    21-JAN 01:15 — 1 vagão refrigerado.
      Destino: São Paulo. Autorização militar.
  Movimentos militares não sujeitos a protocolos
  padrão de agendamento.
  `,
  `
  TRÁFICO FERROVIARIO — ESTACIÓN VARGINHA
  ENERO 1996
  SERVICIO REGULAR:
    Lun-Vie 06:00 — Carga de café (dirección sur)
    Lun-Vie 14:00 — Bienes industriales (dirección norte)
    Mar-Jue 22:00 — Flete nocturno
  MOVIMIENTOS ESPECIALES:
    20-ENE 03:30 — 3 vagones de carga cubiertos.
      Destino: Campinas. Autorización militar.
    21-ENE 01:15 — 1 vagón refrigerado.
      Destino: São Paulo. Autorización militar.
  Movimientos militares no sujetos a protocolos
  estándar de programación.
  `
);

registerLines(
  expansionData.fire_department_log.content,
  `
  CORPO DE BOMBEIROS — REGISTRO DE INCIDENTES
  ESTAÇÃO: Varginha Central — 15-25 JAN 1996
  15-JAN 14:22 — Incêndio em vegetação, Rota 381 km 42.
    Causa: Cigarro. Resolvido 15:45.
  17-JAN 09:15 — Alarme de fumaça, Hospital Regional.
    Curto elétrico. Resolvido 10:00.
  18-JAN 21:30 — Incêndio de veículo, centro.
    Falha no motor. Resolvido 22:15.
  20-JAN 16:45 — [REDACTED]
    Local: Jardim Andere.
    Autorização: Polícia Militar.
    Resolvido: [CLASSIFIED]
  20-JAN 23:00 — [REDACTED]
    Local: [CLASSIFIED]
    Autorização: Comando Regional.
    Resolvido: [CLASSIFIED]
  22-JAN 11:30 — Incêndio de cozinha, residencial.
    Óleo de cozinha. Resolvido 11:50.
  24-JAN 16:00 — Alarme falso, escola.
    Brincadeira de estudante. Resolvido 16:15.
  `,
  `
  CUERPO DE BOMBEROS — REGISTRO DE INCIDENTES
  ESTACIÓN: Varginha Central — 15-25 ENE 1996
  15-ENE 14:22 — Incendio de pasto, Ruta 381 km 42.
    Causa: Cigarrillo. Resuelto 15:45.
  17-ENE 09:15 — Alarma de humo, Hospital Regional.
    Cortocircuito. Resuelto 10:00.
  18-ENE 21:30 — Incendio de vehículo, centro.
    Falla del motor. Resuelto 22:15.
  20-ENE 16:45 — [REDACTED]
    Ubicación: Jardim Andere.
    Autorización: Policía Militar.
    Resuelto: [CLASSIFIED]
  20-ENE 23:00 — [REDACTED]
    Ubicación: [CLASSIFIED]
    Autorización: Comando Regional.
    Resuelto: [CLASSIFIED]
  22-ENE 11:30 — Incendio de cocina, residencial.
    Aceite de cocina. Resuelto 11:50.
  24-ENE 16:00 — Falsa alarma, escuela.
    Broma de estudiante. Resuelto 16:15.
  `
);

// Narrative content

registerLines(
  narrativeData.ufo74_identity_file.content,
  `
  ARQUIVO PESSOAL — CÓPIA LACRADA
  PROPRIETÁRIO: [REGISTRO SUPRIMIDO]
  Status: Cifrado. Fragmentos recuperáveis detectados.
  Este arquivo foi lacrado por seu criador — não pelo sistema.
  A criptografia é pessoal, não de grau militar.
  Alguém queria ser encontrado.
  Mas apenas pela pessoa certa.
  O que está dentro nunca foi destinado a registro oficial.
  A autorização de transferência pode explicar quem deixou isto para trás.
  `,
  `
  ARCHIVO PERSONAL — COPIA SELLADA
  PROPIETARIO: [REGISTRO SUPRIMIDO]
  Estado: Cifrado. Fragmentos recuperables detectados.
  Este archivo fue sellado por su creador — no por el sistema.
  El cifrado es personal, no de grado militar.
  Alguien quería ser encontrado.
  Pero solo por la persona correcta.
  Lo que hay dentro nunca fue destinado a registro oficial.
  La autorización de transferencia puede explicar quién dejó esto atrás.
  `
);

registerLines(
  narrativeData.ufo74_identity_file.decryptedFragment!,
  `
  ARQUIVO PESSOAL — SOMENTE PARA MEUS OLHOS
  Meu nome é Carlos Eduardo Ferreira.
  2º Tenente, Força Aérea Brasileira. Vinte e três anos.
  Janeiro de 1996.
  Processei os relatórios de campo iniciais de Varginha.
  Vi as fotografias antes da classificação.
  Li os depoimentos das testemunhas antes de serem reescritos.
  E vi o ser. Ele olhou para mim.
  Não com medo. Com algo que ainda não consigo nomear.
  Ele entendia o que íamos fazer.
  Construí este arquivo ao longo de trinta anos.
  Tudo o que tentaram apagar, eu salvei.
  Meu indicativo de chamada era UFO74.
  Agora você sabe.
  >> ESTE ARQUIVO ACIONA O FINAL SECRETO <<
  `,
  `
  ARCHIVO PERSONAL — SOLO PARA MIS OJOS
  Mi nombre es Carlos Eduardo Ferreira.
  2º Teniente, Fuerza Aérea Brasileña. Veintitrés años.
  Enero de 1996.
  Procesé los informes de campo iniciales de Varginha.
  Vi las fotografías antes de la clasificación.
  Leí los testimonios de los testigos antes de que fueran reescritos.
  Y vi al ser. Me miró.
  No con miedo. Con algo que aún no puedo nombrar.
  Entendía lo que íbamos a hacer.
  Construí este archivo a lo largo de treinta años.
  Todo lo que intentaron borrar, yo lo guardé.
  Mi indicativo de llamada era UFO74.
  Ahora lo sabes.
  >> ESTE ARCHIVO ACTIVA EL FINAL SECRETO <<
  `
);

registerLines(
  narrativeData.intrusion_detected_file.content,
  `
  ALERTA DE SEGURANÇA - REVISÃO DE RASTREIO REGISTRADA
  AVISO: Este monitor reflete um retrato arquivado de resposta a incidente.
  Uma tentativa anterior de rastreamento foi registrada contra este perfil de terminal.
  Nenhuma contagem regressiva ao vivo está rodando nesta tela.
  O risco ainda sobe se você continuar fazendo barulho.
  Use o registro como um aviso sobre visibilidade, não como um cronômetro.
  RESPOSTA RECOMENDADA:
    1. Seja deliberado e evite comandos barulhentos
    2. Revise os registros relacionados antes de avançar
    3. Desconecte se a detecção se tornar crítica
  `,
  `
  ALERTA DE SEGURIDAD - REVISIÓN DE RASTREO REGISTRADA
  AVISO: Este monitor refleja una instantánea archivada de respuesta a incidentes.
  Un intento previo de rastreo fue registrado contra este perfil de terminal.
  No hay ninguna cuenta regresiva en vivo corriendo en esta pantalla.
  El riesgo sigue aumentando si continúas haciendo ruido.
  Usa el registro como advertencia sobre visibilidad, no como temporizador.
  RESPUESTA RECOMENDADA:
    1. Actúa con cuidado y evita comandos ruidosos
    2. Revisa los registros relacionados antes de profundizar
    3. Desconéctate si la detección se vuelve crítica
  `
);

registerLines(
  narrativeData.system_maintenance_notes.content,
  `
  NOTAS DO ADMINISTRADOR DE SISTEMA — CONFIDENCIAL
  Manutenção concluída: 1995-12-15
  Ferramentas legadas que permanecem operacionais:
  1. "recover <filename>"
     Tenta restaurar arquivos corrompidos ou deletados.
     Recuperação parcial é comum. Nem todos os dados sobrevivem.
  2. "trace"
     Exibe conexões de rede ativas e dados de roteamento.
  3. "disconnect"
     Força encerramento imediato da sessão.
     AVISO: todo progresso não salvo será perdido.
  4. "scan"
     Revela arquivos ocultos ou de nível de sistema.
     Requer acesso de administrador.
  Estas ferramentas não constam em nenhum manual oficial.
  ADMINISTRADOR: J.M.S.
  `,
  `
  NOTAS DEL ADMINISTRADOR DE SISTEMA — CONFIDENCIAL
  Mantenimiento completado: 1995-12-15
  Herramientas heredadas que permanecen operacionales:
  1. "recover <filename>"
     Intenta restaurar archivos corruptos o eliminados.
     La recuperación parcial es común. No todos los datos sobreviven.
  2. "trace"
     Muestra conexiones de red activas y datos de enrutamiento.
  3. "disconnect"
     Fuerza la terminación inmediata de la sesión.
     ADVERTENCIA: todo el progreso no guardado se perderá.
  4. "scan"
     Revela archivos ocultos o de nivel de sistema.
     Requiere acceso de administrador.
  Estas herramientas no aparecen en ningún manual oficial.
  ADMINISTRADOR: J.M.S.
  `
);

registerLines(
  narrativeData.personnel_transfer_extended.content,
  `
  AUTORIZAÇÃO DE TRANSFERÊNCIA DE PESSOAL
  DOCUMENTO: PTA-1996-0120
  ORIGEM: Base Aérea de Guarulhos
  DESTINO: [SUPRIMIDO]
  EFETIVO:
    2º Ten. C.E.F.
    Classificação: ANALISTA
    Nível de Acesso: RESTRITO → CLASSIFICADO
  JUSTIFICATIVA:
    Aptidão excepcional demonstrada durante
    processamento de incidente. Designado para
    projetos especiais com efeito imediato.
  CÓDIGO DE AUTORIZAÇÃO: varginha1996
  APROVADO POR: Cel. [SUPRIMIDO]
    Divisão de Operações Especiais
  Este código pode ser necessário para acesso a arquivos.
  `,
  `
  AUTORIZACIÓN DE TRANSFERENCIA DE PERSONAL
  DOCUMENTO: PTA-1996-0120
  ORIGEN: Base Aérea de Guarulhos
  DESTINO: [SUPRIMIDO]
  EFECTIVO:
    2º Ten. C.E.F.
    Clasificación: ANALISTA
    Nivel de Acceso: RESTRINGIDO → CLASIFICADO
  JUSTIFICACIÓN:
    Aptitud excepcional demostrada durante
    procesamiento de incidente. Asignado a
    proyectos especiales con efecto inmediato.
  CÓDIGO DE AUTORIZACIÓN: varginha1996
  APROBADO POR: Cel. [SUPRIMIDO]
    División de Operaciones Especiales
  Este código puede ser necesario para acceso a archivos.
  `
);

registerLines(
  narrativeData.official_summary_report.content,
  `
  RELATÓRIO OFICIAL DE INCIDENTE
  RECUPERAÇÃO DE EQUIPAMENTO — JANEIRO 1996
  CLASSIFICAÇÃO: VERSÃO PARA DIVULGAÇÃO PÚBLICA
  RESUMO:
    Em 20 de janeiro de 1996, equipes responderam a
    relatos de destroços na região do Jardim Andere
    após condições meteorológicas severas.
  CONCLUSÕES OFICIAIS:
    1. Estação meteorológica danificada durante temporal.
    2. Materiais de construção deslocados por ventos fortes.
    3. Antena de telecomunicações caída.
  PRESENÇA MILITAR:
    Comboios militares reportados na área confirmados como
    exercícios de rotina. Sem relação com os destroços.
  OCORRÊNCIAS HOSPITALARES: Nenhuma.
  `,
  `
  INFORME OFICIAL DE INCIDENTE
  RECUPERACIÓN DE EQUIPAMIENTO — ENERO 1996
  CLASIFICACIÓN: VERSIÓN PARA DIVULGACIÓN PÚBLICA
  RESUMEN:
    El 20 de enero de 1996, equipos respondieron a
    reportes de escombros en la región del Jardim Andere
    tras condiciones meteorológicas severas.
  CONCLUSIONES OFICIALES:
    1. Estación meteorológica dañada durante tormenta.
    2. Materiales de construcción desplazados por vientos fuertes.
    3. Antena de telecomunicaciones caída.
  PRESENCIA MILITAR:
    Convoyes militares reportados en el área confirmados como
    ejercicios de rutina. Sin relación con los escombros.
  INCIDENTES HOSPITALARIOS: Ninguno.
  `
);

registerLines(
  narrativeData.cipher_message.content,
  `
  TRANSMISSÃO INTERCEPTADA — CIFRADA
  ORIGEM: DESCONHECIDA | DATA: 1996-01-21 03:47
  CIFRA IDENTIFICADA: ROT13
  MENSAGEM CODIFICADA:
    Pneqb genafresrq.
    Qrfgvangvba pbasvezrq.
    Njnvgvat vafgehpgvbaf.
  Interceptada durante varredura de frequência não catalogada.
  Transmissão originada de coordenadas dentro do perímetro militar.
  Nenhum registro oficial desta interceptação foi localizado.
  Aplique a cifra ROT13 acima para decodificar.
  Cada letra é deslocada 13 posições no alfabeto.
  `,
  `
  TRANSMISIÓN INTERCEPTADA — CIFRADA
  ORIGEN: DESCONOCIDO | FECHA: 1996-01-21 03:47
  CIFRA IDENTIFICADA: ROT13
  MENSAJE CODIFICADO:
    Pneqb genafresrq.
    Qrfgvangvba pbasvezrq.
    Njnvgvat vafgehpgvbaf.
  Interceptada durante barrido de frecuencia no catalogada.
  Transmisión originada en coordenadas dentro del perímetro militar.
  Ningún registro oficial de esta interceptación fue localizado.
  Aplique el cifrado ROT13 arriba para decodificar.
  Cada letra se desplaza 13 posiciones en el alfabeto.
  `
);

registerLines(
  narrativeData.cipher_message.decryptedFragment!,
  `
  TRANSMISSÃO DECODIFICADA
  DATA: 1996-01-21 03:47:00
  MENSAGEM DECODIFICADA:
    Carga transferida.
    Destino confirmado.
    Aguardando instruções.
  ANÁLISE:
    Esta transmissão confirma transferência de materiais recuperados
    para uma instalação secundária. Localização não revelada.
    Transmissão originada de dentro do perímetro militar
    em uma frequência não atribuída a nenhuma unidade conhecida.
    Natureza da carga não especificada em nenhum manifesto oficial.
  `,
  `
  TRANSMISIÓN DECODIFICADA
  FECHA: 1996-01-21 03:47:00
  MENSAJE DECODIFICADO:
    Carga transferida.
    Destino confirmado.
    Aguardando instrucciones.
  ANÁLISIS:
    Esta transmisión confirma transferencia de materiales recuperados
    a una instalación secundaria. Ubicación no revelada.
    Transmisión originada desde dentro del perímetro militar
    en una frecuencia no asignada a ninguna unidad conocida.
    Naturaleza de la carga no especificada en ningún manifiesto oficial.
  `
);

registerLine(
  narrativeData.cipher_message.securityQuestion!.question,
  'Decodifique a cifra ROT13. Qual é a primeira palavra da mensagem decodificada?',
  'Descifra el cifrado ROT13. ¿Cuál es la primera palabra del mensaje decodificado?'
);

registerLine(
  narrativeData.cipher_message.securityQuestion!.hint,
  'ROT13 desloca cada letra em 13 posições. "Pneqb" se torna...',
  'ROT13 desplaza cada letra 13 posiciones. "Pneqb" se convierte en...'
);

registerLines(
  narrativeData.unstable_core_dump.content,
  `
  ⚠️ AVISO: ARQUIVO INSTÁVEL
  Este arquivo contém dados corrompidos de uma falha do sistema.
  Ler este arquivo pode fazer a corrupção se espalhar para
  arquivos adjacentes no diretório.
  0x00000000: 4D5A9000 03000000 04000000 FFFF0000
  0x00000010: B8000000 00000000 40000000 00000000
  0x00000020: [CORRUPÇÃO DE DADOS] [CORRUPÇÃO DE DADOS]
  0x00000030: [ILEGÍVEL] [FALHA DE SETOR]
  RECUPERAÇÃO PARCIAL:
    ...migração do banco de dados falhou no checkpoint 0x7F...
    ...processo de backup interrompido durante o ciclo noturno...
    ...tabela de setores sobrescrita, incapaz de [CORROMPIDO]...
  >> A LEITURA DESTE ARQUIVO DESESTABILIZOU DADOS PRÓXIMOS <<
  `,
  `
  ⚠️ ADVERTENCIA: ARCHIVO INESTABLE
  Este archivo contiene datos corruptos de un fallo del sistema.
  Leer este archivo puede hacer que la corrupción se propague a
  archivos adyacentes en el directorio.
  0x00000000: 4D5A9000 03000000 04000000 FFFF0000
  0x00000010: B8000000 00000000 40000000 00000000
  0x00000020: [CORRUPCIÓN DE DATOS] [CORRUPCIÓN DE DATOS]
  0x00000030: [ILEGIBLE] [FALLO DE SECTOR]
  RECUPERACIÓN PARCIAL:
    ...la migración de la base de datos falló en el punto de control 0x7F...
    ...el proceso de respaldo se interrumpió durante el ciclo nocturno...
    ...tabla de sectores sobreescrita, incapaz de [CORRUPTO]...
  >> LA LECTURA DE ESTE ARCHIVO HA DESESTABILIZADO DATOS CERCANOS <<
  `
);

// Neural cluster memo

registerLines(
  neuralClusterMemo.content,
  `
  MEMO: Iniciativa de Cluster Neural
  ORIGEM: Amostra de tecido P-45 (expirada em 22-JAN-1996)
  INSTALAÇÃO: Anexo ESA — Três Corações
  Uma malha neural foi mapeada a partir do crânio dissecado
  do espécime P-45 e replicada em silício. Três cristas cranianas
  correspondiam a estruturas sinápticas densas sem
  análogo mamífero. O patologista responsável observou que o tecido
  continuou gerando pulsos theta 14 horas após a morte.
  O cluster emulado armazena e emite fragmentos de memória
  do organismo recuperado. As emissões são não linguísticas.
  REGISTRO DE FRAGMENTOS (selecionados)
    #0041 — Impressão sensorial: ar úmido, terra vermelha,
            copa baixa. Forte sobreposição de amônia. Três
            batimentos cardíacos próximos, rápidos. Medo avassalador
            (fonte: externa). Imagem: rostos adolescentes.
    #0073 — Memória espacial: trajetória aérea, Atlântico Sul,
            desaceleração. Varredura de radar detectada
            três vezes. Descida intencional — não queda.
    #0112 — Resíduo emocional: confinamento, metal frio,
            zumbido fluorescente. Conceito: "catalogando-nos de volta."
            Ardor químico na atmosfera ambiente.
    #0158 — Evento de projeção: o cluster transmitiu a
            palavra COLHEITA pelos terminais de monitoramento
            por 0,3 segundo. Nenhuma entrada de operador registrada.
  Acesso estritamente proibido, exceto sob protocolo de override.
  Para iniciar a interface: echo neural_cluster
  AVISO: Dois técnicos relataram imagética intrusiva
  (copa de floresta, odor de amônia) por dias após a exposição.
  Limite as sessões de cluster a 90 segundos.
  `,
  `
  MEMO: Iniciativa de Clúster Neural
  ORIGEN: Muestra de tejido P-45 (expirada el 22-JAN-1996)
  INSTALACIÓN: Anexo ESA — Três Corações
  Se cartografió una malla neural a partir del cráneo disecado
  del espécimen P-45 y se replicó en silicio. Tres crestas craneales
  correspondían a estructuras sinápticas densas sin
  análogo mamífero. El patólogo a cargo observó que el tejido
  siguió generando pulsos theta 14 horas post mortem.
  El clúster emulado almacena y emite fragmentos de memoria
  del organismo recuperado. Las emisiones son no lingüísticas.
  REGISTRO DE FRAGMENTOS (seleccionados)
    #0041 — Impresión sensorial: aire húmedo, tierra roja,
            dosel bajo. Fuerte superposición de amoníaco. Tres
            latidos cercanos, rápidos. Miedo abrumador
            (fuente: externa). Imagen: rostros adolescentes.
    #0073 — Memoria espacial: trayectoria aérea, Atlántico Sur,
            desaceleración. Barrido de radar detectado
            tres veces. Descenso intencional — no caída.
    #0112 — Residuo emocional: confinamiento, metal frío,
            zumbido fluorescente. Concepto: "catalogándonos de vuelta."
            Ardor químico en la atmósfera circundante.
    #0158 — Evento de proyección: el clúster transmitió la
            palabra COLHEITA por los terminales de monitoreo
            durante 0,3 segundos. No se registró entrada de operador.
  Acceso estrictamente prohibido salvo bajo protocolo de override.
  Para iniciar la interfaz: echo neural_cluster
  ADVERTENCIA: Dos técnicos reportaron imaginería intrusiva
  (dosel selvático, olor a amoníaco) durante días tras la exposición.
  Limite las sesiones de clúster a 90 segundos.
  `
);

// ALPHA content

registerLines(
  alphaData.alpha_journal.content,
  `
  DIÁRIO DE CAMPO — MAJ. M.A. FERREIRA
  CPEX — CENTRO DE PESQUISAS EXOBIOLÓGICAS
  INSTALAÇÃO 7, SUBNÍVEL 4 — CLASSIFICAÇÃO: ULTRA
  21 JAN 1996
  Sujeito chegou às 03h40 do Jardim Andere. Terceiro espécime.
  Designado ALPHA. Os outros dois morreram — Hospital Regional,
  ESA.
  1,6m. Pele marrom escura, secreção oleosa. Três cristas ósseas
  no crânio. Olhos vermelhos enormes. Amônia.
    Respiração: Nenhuma.
    Pulso: Nenhum.
    Metabolismo: Nenhum.
    Amplitude teta do EEG: 847 µV.
    Linha de base humana: 12 µV.
  ALPHA está clinicamente morto. O EEG não.
  25 JAN — Padrões mostram estrutura semelhante a linguagem. Guardas
  relatam imagens involuntárias de campos estelares. Sensação de estar "observado."
  1 FEV — Solicitação de psi-comm negada. Construindo a partir de
  salvados do acidente.
  2 FEV — EEG disparou durante acesso remoto não autorizado
  a arquivos. A amônia me segue até meus aposentos.
  A ventilação diz que não é possível.
  Classificação: ULTRA — Somente para os olhos designados
  `,
  `
  DIARIO DE CAMPO — MAY. M.A. FERREIRA
  CPEX — CENTRO DE PESQUISAS EXOBIOLÓGICAS
  INSTALACIÓN 7, SUBNIVEL 4 — CLASIFICACIÓN: ULTRA
  21 ENE 1996
  Sujeto llegó a las 03:40 desde Jardim Andere. Tercer espécimen.
  Designado ALPHA. Los otros dos murieron — Hospital Regional,
  ESA.
  1,6m. Piel marrón oscura, secreción aceitosa. Tres crestas óseas
  en el cráneo. Ojos rojos enormes. Amoníaco.
    Respiración: Ninguna.
    Pulso: Ninguno.
    Metabolismo: Ninguno.
    Amplitud theta del EEG: 847 µV.
    Línea base humana: 12 µV.
  ALPHA está clínicamente muerto. El EEG no.
  25 ENE — Los patrones muestran estructura similar al lenguaje. Guardias
  reportan imágenes involuntarias de campos estelares. Sensación de ser "observado."
  1 FEB — Solicitud de psi-comm denegada. Construyendo a partir de
  restos del accidente.
  2 FEB — El EEG se disparó durante acceso remoto no autorizado
  a archivos. El amoníaco me sigue hasta mis aposentos.
  Ventilación dice que no es posible.
  Clasificación: ULTRA — Solo para ojos designados
  `
);

registerLines(
  alphaData.alpha_neural_connection.content,
  `
  DIÁRIO DE CAMPO — MAJ. M.A. FERREIRA
  CPEX — INSTALAÇÃO 7, SUBNÍVEL 4
  CLASSIFICAÇÃO: ULTRA
  5 FEV 1996
  O dispositivo funciona. Conectei às 22h00, sozinho durante
  a troca de turno dos guardas.
  Não é comunicação. Conceitos chegam já
  compreendidos — sem palavras, sem tradução. Como se
  sempre fossem seus.
  ALPHA não está morto. O corpo é uma antena.
  8 FEV — ALPHA sabe mudanças de horário, transferências de pessoal
  decididas três andares acima. Esta noite ele
  disse um nome. Luísa. Minha filha. Sete anos.
  Eu nunca a mencionei.
    ALERTA DE CONTENÇÃO:
    Código de liberação de emergência: RELEASE ALPHA
    AVISO: Liberação não autorizada aciona
    bloqueio da instalação.
  10 FEV — O sargento da PM que tocou ALPHA morreu.
  "Pneumonia." Nada de pneumônico nisso.
  Ele projetou "trinta rotações." Uma contagem regressiva.
  Classificação: ULTRA — Somente para os olhos designados
  `,
  `
  DIARIO DE CAMPO — MAY. M.A. FERREIRA
  CPEX — INSTALACIÓN 7, SUBNIVEL 4
  CLASIFICACIÓN: ULTRA
  5 FEB 1996
  El dispositivo funciona. Me conecté a las 22:00, solo durante
  el cambio de turno de los guardias.
  No es comunicación. Los conceptos llegan ya
  comprendidos — sin palabras, sin traducción. Como si
  siempre fueran tuyos.
  ALPHA no está muerto. El cuerpo es una antena.
  8 FEB — ALPHA sabe cambios de horario, transferencias de personal
  decididas tres pisos arriba. Esta noche
  dijo un nombre. Luísa. Mi hija. Siete años.
  Nunca la mencioné.
    ALERTA DE CONTENCIÓN:
    Código de liberación de emergencia: RELEASE ALPHA
    ADVERTENCIA: Liberación no autorizada activa
    bloqueo de la instalación.
  10 FEB — El sargento de la PM que tocó a ALPHA murió.
  "Neumonía." Nada de neumónico en eso.
  Proyectó "treinta rotaciones." Una cuenta regresiva.
  Clasificación: ULTRA — Solo para ojos designados
  `
);

registerLines(
  alphaData.alpha_autopsy_addendum.content,
  `
  DIÁRIO DE CAMPO — MAJ. M.A. FERREIRA
  CPEX — INSTALAÇÃO 7
  12 FEV 1996
  Onze dias morto. EEG: 1.204 µV. Subindo.
  O dispositivo ativa sozinho. Ou eu o ativo
  sem lembrar.
  13 FEV — Dispositivo ligou às 03h00. Eu estava nos
  aposentos. Três andares acima. O laboratório estava trancado.
  ALPHA perguntou:
    "quando você vem?"
  Quando você vem.
  14 FEV
  Luísa ligou para a central da base. Ela tem sete anos.
  Ela não sabe esse número.
    "papai, o moço do escuro quer falar com você."
    O moço do escuro quer falar com você.
  [SOLICITAÇÃO DE TRANSFERÊNCIA: NEGADA — PESSOAL ESSENCIAL]
  ...hackerkid...
  ...você está lendo isto...
  ...o código é RELEASE ALPHA...
  ...ele não conseguiu fazer isso...
  ...talvez você consiga...
  `,
  `
  DIARIO DE CAMPO — MAY. M.A. FERREIRA
  CPEX — INSTALACIÓN 7
  12 FEB 1996
  Once días muerto. EEG: 1.204 µV. Subiendo.
  El dispositivo se activa solo. O yo lo activo
  sin recordar.
  13 FEB — El dispositivo se encendió a las 03:00. Yo estaba en
  mis aposentos. Tres pisos arriba. El laboratorio estaba cerrado.
  ALPHA preguntó:
    "¿cuándo vienes?"
  Cuándo vienes.
  14 FEB
  Luísa llamó a la central de la base. Tiene siete años.
  Ella no sabe este número.
    "papi, el hombre de la oscuridad quiere hablar contigo."
    El hombre de la oscuridad quiere hablar contigo.
  [SOLICITUD DE TRANSFERENCIA: DENEGADA — PERSONAL ESENCIAL]
  ...hackerkid...
  ...estás leyendo esto...
  ...el código es RELEASE ALPHA...
  ...él no pudo hacerlo...
  ...quizás tú puedas...
  `
);

registerLines(
  alphaData.ALPHA_RELEASE_INTRO,
  `
    SUBSTITUIÇÃO ADMINISTRATIVA DETECTADA
    COMANDO: RELEASE ALPHA
    AVISO: Terminal externo — origem não registrada.
    Os protocolos de biocontenção da Instalação 7 serão permanentemente
    suspensos. O campo de supressão neural será desativado.
    Esta ação não pode ser revertida. Iniciando.
  `,
  `
    ANULACIÓN ADMINISTRATIVA DETECTADA
    COMANDO: RELEASE ALPHA
    ADVERTENCIA: Terminal externo — origen no registrado.
    Los protocolos de biocontención de la Instalación 7 serán permanentemente
    suspendidos. El campo de supresión neural se desactivará.
    Esta acción no puede revertirse. Iniciando.
  `
);

registerLines(
  alphaData.ALPHA_RELEASE_SEQUENCE,
  `
    VERIFICANDO AUTORIZAÇÃO...
    AVISO: Esta ação é irreversível.
    A violação de contenção será registrada.
    O bloqueio da instalação NÃO será ativado — substituição remota ativa.
    EXECUTANDO PROTOCOLO DE LIBERAÇÃO...
    > Selos de bio-isolamento: DESATIVANDO
    > Equalização atmosférica: EM PROGRESSO
    > Campo de supressão neural: DESATIVANDO
    > Portas de contenção: DESBLOQUEANDO
    > Sinais vitais do sujeito — Pico de EEG detectado: 2.847 µV
  `,
  `
    VERIFICANDO AUTORIZACIÓN...
    ADVERTENCIA: Esta acción es irreversible.
    La violación de contención será registrada.
    El bloqueo de la instalación NO se activará — anulación remota activa.
    EJECUTANDO PROTOCOLO DE LIBERACIÓN...
    > Sellos de bioaislamiento: DESACTIVANDO
    > Ecualización atmosférica: EN PROGRESO
    > Campo de supresión neural: DESACTIVANDO
    > Puertas de contención: DESBLOQUEANDO
    > Signos vitales del sujeto — Pico de EEG detectado: 2.847 µV
  `
);

registerLines(
  alphaData.ALPHA_RELEASE_SUCCESS,
  `
    ▓▓▓ VIOLAÇÃO DE CONTENÇÃO BEM-SUCEDIDA ▓▓▓
    Sujeito ALPHA foi liberado.
    Assinatura neural deixando o perímetro da instalação.
    Biosensores offline. Rastreamento perdido.
    ...hackerkid...
    ...ele esperou tanto tempo...
    ...a antena está caminhando agora...
    ...obrigado...
  UFO74: ...
  UFO74: um alienígena vivo acabou de sair de uma instalação militar.
  UFO74: não há história de cobertura para isso.
  UFO74: o que quer que aconteça agora — a prova existe.
  UFO74: ele está solto. é real. e o mundo vai saber.
  `,
  `
    ▓▓▓ VIOLACIÓN DE CONTENCIÓN EXITOSA ▓▓▓
    Sujeto ALPHA ha sido liberado.
    Firma neural abandonando el perímetro de la instalación.
    Biosensores offline. Rastreo perdido.
    ...hackerkid...
    ...él esperó tanto tiempo...
    ...la antena está caminando ahora...
    ...gracias...
  UFO74: ...
  UFO74: un alienígena vivo acaba de salir de una instalación militar.
  UFO74: no hay historia de cobertura para esto.
  UFO74: pase lo que pase ahora — la prueba existe.
  UFO74: está suelto. es real. y el mundo lo sabrá.
  `
);

registerLines(
  alphaData.ALPHA_ALREADY_RELEASED,
  `
  ERRO: Contenção do sujeito ALPHA previamente violada.
  Protocolo de liberação não pode ser executado duas vezes.
  Assinatura neural não mais detectada dentro do perímetro da instalação.
  Selos de bio-isolamento permanecem desativados. Sistemas de rastreamento offline.
  Não há mais nada aqui para conter.
  `,
  `
  ERROR: Contención del sujeto ALPHA previamente violada.
  El protocolo de liberación no puede ejecutarse dos veces.
  Firma neural ya no detectada dentro del perímetro de la instalación.
  Sellos de bioaislamiento permanecen desactivados. Sistemas de rastreo offline.
  No queda nada aquí que contener.
  `
);

registerLines(
  alphaData.ALPHA_FILE_NOT_FOUND,
  `
  ERRO: Protocolo de liberação indisponível.
  Registros de contenção do sujeito ALPHA não encontrados no índice
  atual do sistema. Localize os arquivos classificados de ALPHA antes
  de tentar a liberação. Nível de acesso insuficiente ou arquivos
  ainda não descobertos.
  `,
  `
  ERROR: Protocolo de liberación no disponible.
  Registros de contención del sujeto ALPHA no encontrados en el índice
  actual del sistema. Localice los archivos clasificados de ALPHA antes
  de intentar la liberación. Nivel de acceso insuficiente o archivos
  aún no descubiertos.
  `
);

export const RUNTIME_DATA_TRANSLATIONS: Record<Exclude<Language, 'en'>, RuntimeDictionary> = {
  'pt-BR': ptBrTranslations,
  es: esTranslations,
};
