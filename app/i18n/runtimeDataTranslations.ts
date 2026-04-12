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
  SITE: INSTALAÇÃO DE CONTENÇÃO TEMPORÁRIA, HOSPITAL HUMANITAS
  DATA: 20-26 DE JANEIRO DE 1996
  CLASSIFICAÇÃO: OMEGA — MARCADO PARA DESTRUIÇÃO
  REGISTRO DE SUJEITOS
    BIO-A: Capturado em 20/01 às 15:42. Setor Jardim Andere.
           Condição: Responsivo. Sinais vitais estáveis.
           Transferido para o Site 7 em 22/01.
    BIO-B: Capturado em 20/01 às 16:15. Adjacente ao BIO-A.
           Condição: Agitado. Tentou sinal não acústico.
           Manipuladores relataram dores de cabeça em raio de 3 m.
           Transferido para o Site 7 em 22/01.
    BIO-C: Capturado em 22/01 às 02:30. Local separado.
           Condição: Enfraquecido. Sinais vitais em declínio.
           Expirou em 24/01 às 04:17. Causa: Desconhecida.
           Restos transferidos para patologia.
  PROTOCOLOS DE CONTENÇÃO
    - Blindagem eletromagnética: ATIVA (gaiola de Faraday)
    - Monitoramento visual: 24 horas, 3 ângulos de câmera
    - Contato direto: PROIBIDO sem autorização de Nível 4
    - Alimentação: Sujeitos recusam toda matéria orgânica oferecida
    - Comunicação: NÃO ENGAGE. Ver parecer PSI-COMM.
    NOTA: Todo o pessoal exposto ao BIO-B por >10 minutos
    deve se apresentar à equipe médica para varredura neural basal.
  ORDEM DE EXCLUSÃO
    A expurgação deste registro foi ordenada em 30/01/1996.
    Os registros oficiais afirmam: "Nenhum material biológico recuperado."
    Os registros hospitalares foram recodificados como: "resposta a derramamento químico."
  `,
  `
  REGISTRO DE CONTENCIÓN BIOLÓGICA — REGISTRO EXPURGADO
  SITIO: INSTALACIÓN DE RETENCIÓN TEMPORAL, HOSPITAL HUMANITAS
  FECHA: 20-26 DE ENERO DE 1996
  CLASIFICACIÓN: OMEGA — MARCADO PARA DESTRUCCIÓN
  REGISTRO DE SUJETOS
    BIO-A: Capturado el 20/01 a las 15:42. Sector Jardim Andere.
           Condición: Responde. Signos vitales estables.
           Transferido al Sitio 7 el 22/01.
    BIO-B: Capturado el 20/01 a las 16:15. Adyacente a BIO-A.
           Condición: Agitado. Intentó señal no acústica.
           Los manipuladores reportaron dolores de cabeza en radio de 3 m.
           Transferido al Sitio 7 el 22/01.
    BIO-C: Capturado el 22/01 a las 02:30. Ubicación separada.
           Condición: Debilitado. Signos vitales en descenso.
           Expiró el 24/01 a las 04:17. Causa: Desconocida.
           Restos transferidos a patología.
  PROTOCOLOS DE CONTENCIÓN
    - Blindaje electromagnético: ACTIVO (jaula de Faraday)
    - Monitoreo visual: 24 horas, 3 ángulos de cámara
    - Contacto directo: PROHIBIDO sin autorización de Nivel 4
    - Alimentación: Los sujetos rechazan toda materia orgánica ofrecida
    - Comunicación: NO INTERACTUAR. Ver aviso PSI-COMM.
    NOTA: Todo el personal expuesto a BIO-B por >10 minutos
    debe presentarse en medicina para escaneo neural basal.
  ORDEN DE ELIMINACIÓN
    Se ordenó purgar este registro el 30/01/1996.
    Los registros oficiales indican: "No se recuperó material biológico."
    Los registros hospitalarios fueron recodificados como: "respuesta a derrame químico."
  `
);

registerLines(
  archiveData.psi_analysis_classified.content,
  `
  ANÁLISE PSI-COMM — RELATÓRIO CLASSIFICADO
  ANALISTA: Dr. [NOME EXPURGADO]
  DATA: 27 DE JANEIRO DE 1996
  STATUS: EXCLUÍDO DE TODOS OS BANCOS DE DADOS
  ASSUNTO: Padrões de comunicação não acústica detectados
  de espécimes designados BIO-A e BIO-B.
  METODOLOGIA
    Matrizes de EEG posicionadas a 1 m, 3 m e 10 m de distância.
    Sujeitos-controle (voluntários humanos) monitorados simultaneamente.
    Resultados: Em distâncias ≤3 m, sujeitos humanos exibiram
    padrões sincronizados de onda theta correspondendo às emissões de BIO-B.
    Em alcance de 10 m, a sincronização caiu para níveis de fundo.
  PRINCIPAIS ACHADOS
    1. CAPACIDADE TELEPÁTICA CONFIRMADA
       BIO-B demonstra transmissão neural direcionada.
       O conteúdo parece conceitual, não linguístico.
       Receptores relatam "saber", em vez de "ouvir".
    2. FUNÇÃO DE BATEDOR CONFIRMADA
       A imagética transmitida inclui levantamentos topográficos,
       mapas de densidade populacional e esquemas de infraestrutura.
       Esses seres estavam CATALOGANDO nosso ambiente.
    3. REFERÊNCIA TEMPORAL
       O padrão recorrente na saída psi-comm se traduz em
       referência temporal cíclica: "trinta rotações."
       Dado o contexto (linha de base de 1996), aponta para o ano de 2026.
    4. DISPOSIÇÃO NÃO HOSTIL
       Nenhuma psi-comm agressiva detectada. Os sujeitos parecem
       considerar a captura como esperada, até planejada.
       Avaliação: Bio-construtos de reconhecimento, não soldados.
  NOTA DE CLASSIFICAÇÃO
    Este relatório foi suprimido em 01/02/1996.
    Posição oficial: "Nenhuma comunicação anômala detectada."
    Todos os dados de EEG arquivados em armazenamento frio externo.
    Adendo pessoal: O que testemunhei muda tudo.
    Eles não são animais. Não são máquinas. São batedores.
    E cumpriram a missão antes de os capturarmos.
  `,
  `
  ANÁLISIS PSI-COMM — INFORME CLASIFICADO
  ANALISTA: Dr. [NOMBRE EXPURGADO]
  FECHA: 27 DE ENERO DE 1996
  ESTADO: ELIMINADO DE TODAS LAS BASES DE DATOS
  ASUNTO: Patrones de comunicación no acústica detectados
  en especímenes designados BIO-A y BIO-B.
  METODOLOGÍA
    Matrices de EEG colocadas a 1 m, 3 m y 10 m de distancia.
    Sujetos de control (voluntarios humanos) monitoreados simultáneamente.
    Resultados: A distancias ≤3 m, los sujetos humanos exhibieron
    patrones sincronizados de ondas theta coincidentes con emisiones de BIO-B.
    A 10 m de alcance, la sincronización cayó a niveles de fondo.
  HALLAZGOS CLAVE
    1. CAPACIDAD TELEPÁTICA CONFIRMADA
       BIO-B demuestra transmisión neural dirigida.
       El contenido parece conceptual, no lingüístico.
       Los receptores reportan "saber" en vez de "oír".
    2. FUNCIÓN DE EXPLORADOR CONFIRMADA
       Las imágenes transmitidas incluyen levantamientos topográficos,
       mapas de densidad poblacional y esquemas de infraestructura.
       Estos seres estaban CATALOGANDO nuestro entorno.
    3. REFERENCIA TEMPORAL
       El patrón recurrente en la salida psi-comm se traduce en
       referencia temporal cíclica: "treinta rotaciones."
       Dado el contexto (línea base de 1996), apunta al año 2026.
    4. DISPOSICIÓN NO HOSTIL
       No se detectó psi-comm agresiva. Los sujetos parecen
       considerar la captura como algo esperado, incluso planeado.
       Evaluación: Bio-constructos de reconocimiento, no soldados.
  NOTA DE CLASIFICACIÓN
    Este informe fue suprimido el 01/02/1996.
    Posición oficial: "No se detectó comunicación anómala."
    Todos los datos de EEG fueron archivados en almacenamiento en frío externo.
    Adenda personal: Lo que he presenciado lo cambia todo.
    No son animales. No son máquinas. Son exploradores.
    Y cumplieron su misión antes de que los capturáramos.
  `
);

registerLines(
  archiveData.foreign_liaison_cable_deleted.content,
  `
  CABO DIPLOMÁTICO — EXCLUÍDO
  ORIGEM: EMBAIXADA DOS EUA, BRASÍLIA
  DESTINO: LANGLEY, VIRGÍNIA
  DATA: 23 DE JANEIRO DE 1996
  CLASSIFICAÇÃO: DESTRUÍDO — RECUPERADO DE FITA DE BACKUP
  PRIORIDADE: FLASH
  ASSUNTO: RECUPERAÇÃO DE VARGINHA — DESTINAÇÃO DE ATIVO ESTRANGEIRO
  CORPO DA MENSAGEM
    Confirmados três (3) espécimes biológicos assegurados pelos
    militares brasileiros. Um (1) falecido, dois (2) viáveis.
    Conforme ordens vigentes do Protocolo ECHO, solicitar desdobramento imediato
    de equipe de avaliação técnica de Langley.
    Ligação brasileira (Cel. [REDACTED]) cooperativa.
    Solicita análise compartilhada em troca de acesso aos espécimes.
    Tel Aviv também solicita status de observador. Recomenda-se
    NEGAR conforme protocolos de compartimentalização.
    NOTA: A Força Aérea Brasileira já lançou interceptadores
    em 13/01 por aviso da NORAD. Eles estão plenamente cientes.
    A janela de negabilidade está se fechando.
  RESPOSTA (LANGLEY)
    APROVADO: Equipe técnica a caminho. ETA 48 horas.
    A custódia brasileira dos espécimes viáveis é TEMPORÁRIA.
    Transferência integral para custódia dos EUA conforme acordo bilateral
    (anexo classificado, tratado de cooperação em defesa de 1988).
    Coordenar com a NSA uma varredura de inteligência de sinais.
    Todas as comunicações civis em raio de 50 km devem ser
    monitoradas por 90 dias.
    Quanto a Tel Aviv: NEGAR. Isto permanece bilateral.
  ORDEM DE EXCLUSÃO
    Cabo destruído conforme protocolo diplomático padrão.
    Não existe registro em bancos de dados acessíveis por FOIA.
  `,
  `
  CABLE DIPLOMÁTICO — ELIMINADO
  ORIGEN: EMBAJADA DE EE. UU., BRASÍLIA
  DESTINO: LANGLEY, VIRGINIA
  FECHA: 23 DE ENERO DE 1996
  CLASIFICACIÓN: DESTRUIDO — RECUPERADO DE CINTA DE RESPALDO
  PRIORIDAD: FLASH
  ASUNTO: RECUPERACIÓN DE VARGINHA — DISPOSICIÓN DE ACTIVO EXTRANJERO
  CUERPO DEL MENSAJE
    Confirmados tres (3) especímenes biológicos asegurados por el
    ejército brasileño. Uno (1) fallecido, dos (2) viables.
    Conforme a las órdenes vigentes del Protocolo ECHO, se solicita el despliegue inmediato
    de un equipo de evaluación técnica desde Langley.
    Enlace brasileño (Cnel. [REDACTED]) cooperativo.
    Solicita análisis compartido a cambio de acceso a los especímenes.
    Tel Aviv también solicita estatus de observador. Se recomienda
    NEGAR según protocolos de compartimentación.
    NOTA: La Fuerza Aérea Brasileña ya lanzó interceptores
    el 13/01 por aviso de NORAD. Están plenamente enterados.
    La ventana de negación plausible se está cerrando.
  RESPUESTA (LANGLEY)
    APROBADO: Equipo técnico en camino. ETA 48 horas.
    La custodia brasileña de los especímenes viables es TEMPORAL.
    Transferencia total a custodia de EE. UU. según acuerdo bilateral
    (anexo clasificado, tratado de cooperación en defensa de 1988).
    Coordinar con la NSA un barrido de inteligencia de señales.
    Todas las comunicaciones civiles en un radio de 50 km deberán
    ser monitoreadas durante 90 días.
    Respecto a Tel Aviv: NEGAR. Esto sigue siendo bilateral.
  ORDEN DE ELIMINACIÓN
    Cable destruido conforme al protocolo diplomático estándar.
    No existe registro en bases de datos accesibles por FOIA.
  `
);

registerLines(
  archiveData.convergence_model_draft.content,
  `
  MODELO DE CONVERGÊNCIA — RASCUNHO (EXPURGADO)
  PROJETO SEED — DIVISÃO DE ANÁLISE TEMPORAL
  DATA: 3 DE FEVEREIRO DE 1996
  STATUS: EXCLUÍDO DE TODOS OS SISTEMAS
  PARA: Diretor, Divisão de Programas Especiais
  DE: Unidade de Análise Temporal
  RE: Janela de Convergência de 2026 — Avaliação Revisada
  RESUMO
    A análise de fragmentos psi-comm de BIO-A/B, combinada
    com dados de sinal da matriz de navegação recuperada,
    produz o seguinte modelo de convergência:
    JANELA DE ATIVAÇÃO: setembro de 2026 (±2 meses)
    A referência a "trinta rotações" na saída telepática
    corresponde a 30 anos solares desde o evento-base de 1996.
  PARÂMETROS DO MODELO
    Fase 1: RECONHECIMENTO (Ativa — 1996)
      Batedores bio-construídos implantados para inspecionar o alvo.
      Dados transmitidos por banda psi a receptor externo.
    Fase 2: SEMEADURA (Passiva — 1996-2026)
      Material biológico deixado sob custódia desencadeia gradual
      sensibilização neurológica em pessoal exposto.
      "Portadores" propagam receptividade ao sinal sem saber.
    Fase 3: TRANSIÇÃO (Projetada — 2026)
      Ativação de espectro completo de vias neurais semeadas.
      A natureza da transição permanece DESCONHECIDA.
      Melhor caso: Um canal de comunicação se abre.
      Pior caso: [DADOS EXPURGADOS]
  DESTINAÇÃO
    Este modelo foi rejeitado pelo comitê de supervisão.
    Posição oficial: "As referências a 2026 não significam nada.
    A saída neural dos espécimes é ruído aleatório."
    Este documento não sobreviverá ao próximo ciclo de expurgo.
    Nota pessoal: Podem negar o quanto quiserem.
    A matemática não mente. Algo está vindo.
  `,
  `
  MODELO DE CONVERGENCIA — BORRADOR (PURGADO)
  PROJECT SEED — DIVISIÓN DE ANÁLISIS TEMPORAL
  FECHA: 3 DE FEBRERO DE 1996
  ESTADO: ELIMINADO DE TODOS LOS SISTEMAS
  PARA: Director, División de Programas Especiales
  DE: Unidad de Análisis Temporal
  RE: Ventana de Convergencia de 2026 — Evaluación Revisada
  RESUMEN
    El análisis de fragmentos psi-comm de BIO-A/B, combinado
    con datos de señal de la matriz de navegación recuperada,
    arroja el siguiente modelo de convergencia:
    VENTANA DE ACTIVACIÓN: septiembre de 2026 (±2 meses)
    La referencia de "treinta rotaciones" en la salida telepática
    se corresponde con 30 años solares desde el evento base de 1996.
  PARÁMETROS DEL MODELO
    Fase 1: RECONOCIMIENTO (Activa — 1996)
      Bio-constructos exploradores desplegados para estudiar el objetivo.
      Datos transmitidos por banda psi a un receptor externo.
    Fase 2: SIEMBRA (Pasiva — 1996-2026)
      El material biológico dejado bajo custodia desencadena una
      sensibilización neurológica gradual en el personal expuesto.
      Los "portadores" propagan receptividad a la señal sin saberlo.
    Fase 3: TRANSICIÓN (Proyectada — 2026)
      Activación de espectro completo de vías neurales sembradas.
      La naturaleza de la transición sigue siendo DESCONOCIDA.
      Mejor caso: Se abre un canal de comunicación.
      Peor caso: [DATOS EXPURGADOS]
  DISPOSICIÓN
    Este modelo fue rechazado por el comité de supervisión.
    Posición oficial: "Las referencias a 2026 carecen de significado.
    La salida neural del espécimen es ruido aleatorio."
    Este documento no sobrevivirá al próximo ciclo de purga.
    Nota personal: Pueden negarlo cuanto quieran.
    Las matemáticas no mienten. Algo viene.
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
  [REGISTROS FINANCEIROS - CRIPTOGRAFADOS]
  O invólucro legado foi aposentado. Abra o arquivo para revisar o registro recuperado.
  AVISO: Acesso não autorizado a registros financeiros
  é punível nos termos do Artigo 317.
  `,
  `
  [REGISTROS FINANCIEROS - CIFRADOS]
  La envoltura heredada fue retirada. Abre el archivo para revisar el registro recuperado.
  ADVERTENCIA: El acceso no autorizado a registros financieros
  es punible bajo el Artículo 317.
  `
);

registerLines(
  expansionData.journalist_payments.decryptedFragment!,
  `
  REGISTRO DE DESEMBOLSO — RELAÇÕES COM A MÍDIA
  CONTA: FUNDO DE OPERAÇÕES ESPECIAIS
  PERÍODO: JAN-FEV 1996
  CLASSIFICAÇÃO: SÓ PARA OS OLHOS
  PAGAMENTOS AUTORIZADOS:
    23-JAN — R$ 15.000,00 — RODRIGUES, A.
             Veículo: O Diário Nacional (sucursal do Rio)
             Finalidade: Supressão de matéria
             Status: MORTE DA PAUTA CONFIRMADA
    25-JAN — R$ 8.500,00 — NASCIMENTO, C.
             Veículo: Folha Paulista
             Finalidade: Inserção de narrativa alternativa
             Status: PUBLICADO (ângulo do morador de rua)
    27-JAN — R$ 22.000,00 — [REDACTED]
             Veículo: Rede Nacional (TV)
             Finalidade: Cancelamento de segmento do Programa Dominical
             Status: SEGMENTO RETIRADO
    30-JAN — R$ 5.000,00 — COSTA, R.
             Veículo: Estado de Minas
             Finalidade: Pressão editorial
             Status: ARTIGO DE OPINIÃO ENGAVETADO
    02-FEB — R$ 12.000,00 — FERREIRA, J.
             Veículo: Revista Isto
             Finalidade: Atraso de edição (mudança de matéria de capa)
             Status: EDIÇÃO DE MARÇO SUBSTITUÍDA
  TOTAL DESEMBOLSADO: R$ 62.500,00
  NOTA: Todos os pagamentos passaram por conta de fachada
        de cooperativa agrícola. Rastro documental limpo.
  APROVADO: [ASSINATURA REDIGIDA]
  `,
  `
  REGISTRO DE DESEMBOLSO — RELACIONES CON MEDIOS
  CUENTA: FONDO DE OPERACIONES ESPECIALES
  PERÍODO: ENE-FEB 1996
  CLASIFICACIÓN: SOLO PARA LOS OJOS
  PAGOS AUTORIZADOS:
    23-JAN — R$ 15.000,00 — RODRIGUES, A.
             Medio: O Diário Nacional (buró de Río)
             Propósito: Supresión de historia
             Estado: BAJA DE HISTORIA CONFIRMADA
    25-JAN — R$ 8.500,00 — NASCIMENTO, C.
             Medio: Folha Paulista
             Propósito: Colocación de narrativa alternativa
             Estado: PUBLICADO (ángulo del indigente)
    27-JAN — R$ 22.000,00 — [REDACTED]
             Medio: Rede Nacional (TV)
             Propósito: Cancelación del segmento de Programa Dominical
             Estado: SEGMENTO RETIRADO
    30-JAN — R$ 5.000,00 — COSTA, R.
             Medio: Estado de Minas
             Propósito: Presión editorial
             Estado: ARTÍCULO DE OPINIÓN ARCHIVADO
    02-FEB — R$ 12.000,00 — FERREIRA, J.
             Medio: Revista Isto
             Propósito: Retraso de edición (cambio de historia de portada)
             Estado: EDICIÓN DE MARZO SUSTITUIDA
  TOTAL DESEMBOLSADO: R$ 62.500,00
  NOTA: Todos los pagos se canalizaron por una cuenta fachada
        de cooperativa agrícola. Rastro documental limpio.
  APROBADO: [FIRMA REDACTADA]
  `
);

registerLines(
  expansionData.media_contacts.content,
  `
  CONTATOS DE MÍDIA — JORNALISTAS COOPERATIVOS
  CLASSIFICAÇÃO: USO INTERNO APENAS
  COMPILADO: DEZEMBRO DE 1995 (ATUALIZADO EM JAN 1996)
  TELEVISÃO:
    Rede Nacional (TV Nacional)
      SANTOS, Eduardo — Diretor de Jornalismo
      Linha direta: (021) 555-7823
      Confiabilidade: ALTA
      Histórico: Cooperativo desde 1989
    TV Regional Sul
      [REDACTED] — Editor de Pauta
      Linha direta: (035) 555-4412
      Confiabilidade: MODERADA
      Nota: Exige aviso prévio
  IMPRESSO:
    O Diário Nacional
      RODRIGUES, André — Chefe da Cidade
      Linha direta: (021) 555-9034
      Confiabilidade: ALTA
      Nota: Já derrubou 3 matérias para nós
    Folha Paulista
      [REDACTED] — Editor Sênior
      Linha direta: (011) 555-2156
      Confiabilidade: MODERADA
      Nota: Prefere inserção a supressão
    Estado de Minas
      PEREIRA, Helena — Sucursal Regional
      Linha direta: (031) 555-8877
      Confiabilidade: ALTA (conhecimento local)
      Nota: Conexão familiar com militares
  REVISTAS:
    Revista Isto
      ALMEIDA, Ricardo — Editor de Reportagens
      Linha direta: (011) 555-6543
      Confiabilidade: MODERADA
      Nota: Lento, mas confiável
  EVITAR:
    Revista Fenômenos (publicação de UFO)
      NÃO pode ser controlada
      Editor PACACCINI conhecido como hostil
      Apenas monitorar, não se envolver
  `,
  `
  CONTACTOS DE MEDIOS — PERIODISTAS COOPERATIVOS
  CLASIFICACIÓN: SOLO USO INTERNO
  COMPILADO: DICIEMBRE DE 1995 (ACTUALIZADO EN ENE 1996)
  TELEVISIÓN:
    Rede Nacional (TV Nacional)
      SANTOS, Eduardo — Director de Noticias
      Línea directa: (021) 555-7823
      Fiabilidad: ALTA
      Historial: Cooperativo desde 1989
    TV Regional Sul
      [REDACTED] — Editor de Asignaciones
      Línea directa: (035) 555-4412
      Fiabilidad: MODERADA
      Nota: Requiere aviso previo
  IMPRESOS:
    O Diário Nacional
      RODRIGUES, André — Jefe de Mesa de Ciudad
      Línea directa: (021) 555-9034
      Fiabilidad: ALTA
      Nota: Ha tumbado 3 historias para nosotros
    Folha Paulista
      [REDACTED] — Editor Senior
      Línea directa: (011) 555-2156
      Fiabilidad: MODERADA
      Nota: Prefiere colocación sobre supresión
    Estado de Minas
      PEREIRA, Helena — Buró Regional
      Línea directa: (031) 555-8877
      Fiabilidad: ALTA (conocimiento local)
      Nota: Conexión familiar con el ejército
  REVISTAS:
    Revista Isto
      ALMEIDA, Ricardo — Editor de Reportajes
      Línea directa: (011) 555-6543
      Fiabilidad: MODERADA
      Nota: Lento, pero confiable
  EVITAR:
    Revista Fenômenos (publicación UFO)
      NO puede ser controlada
      Editor PACACCINI conocido por su hostilidad
      Solo monitorear, no interactuar
  `
);

registerLines(
  expansionData.kill_story_memo.content,
  `
  MEMORANDO URGENTE — SUPRESSÃO DE MÍDIA
  DATA: 26-JAN-1996
  DE: Ligação de Assuntos Públicos
  PARA: Diretores Regionais
  ASSUNTO: Ação Imediata Necessária
  As seguintes matérias estão em desenvolvimento e devem ser
  suprimidas antes da publicação/transmissão:
  1. PROGRAMA DOMINICAL (Rede Nacional)
     Previsto: Domingo 28-JAN, 21:00
     Tema: "Mistério de Varginha — O Que os Militares Escondem"
     Status: MORTE DA PAUTA CONFIRMADA
     Ação: Contato feito com o diretor de jornalismo
     Segmento substituto: Preparativos de carnaval
  2. FOLHA PAULISTA
     Previsto: edição matutina de 29-JAN
     Tema: Matéria investigativa de capa
     Status: EM ANDAMENTO
     Ação: Redirecionar para o ângulo do "morador de rua"
     Pagamento: Autorizado
  3. REVISTA ISTO
     Previsto: edição de fevereiro (já na gráfica)
     Tema: matéria de capa de 8 páginas
     Status: CRÍTICO
     Ação: Atrasar impressão, substituir capa
     Nota: Pagamento maior necessário
  DIRETRIZES DE ABORDAGEM:
    - Liderar com preocupação de "segurança nacional"
    - Oferecer exclusivo sobre a matéria substituta
    - Pagamento é último recurso
    - Não documentar nada por escrito
  ESCALONAMENTO:
    Se o jornalista não cooperar, encaminhar para
    o Protocolo SOMBRA para medidas adicionais.
  `,
  `
  MEMORÁNDUM URGENTE — SUPRESIÓN DE MEDIOS
  FECHA: 26-JAN-1996
  DE: Enlace de Asuntos Públicos
  PARA: Directores Regionales
  ASUNTO: Acción Inmediata Requerida
  Las siguientes historias están en desarrollo y deben ser
  suprimidas antes de su publicación/emisión:
  1. PROGRAMA DOMINICAL (Rede Nacional)
     Programado: Domingo 28-JAN, 21:00
     Tema: "Misterio de Varginha — Lo que ocultan los militares"
     Estado: BAJA DE HISTORIA CONFIRMADA
     Acción: Contacto realizado con el director de noticias
     Segmento sustituto: Preparativos de carnaval
  2. FOLHA PAULISTA
     Programado: edición matutina del 29-JAN
     Tema: Pieza de investigación de portada
     Estado: EN PROGRESO
     Acción: Redirigir al ángulo del "indigente"
     Pago: Autorizado
  3. REVISTA ISTO
     Programado: edición de febrero (ya en imprenta)
     Tema: Historia de portada de 8 páginas
     Estado: CRÍTICO
     Acción: Retrasar tiraje, sustituir portada
     Nota: Se requiere un pago mayor
  DIRECTRICES DE ENFOQUE:
    - Encabezar con preocupación de "seguridad nacional"
    - Ofrecer exclusiva sobre la historia sustituta
    - El pago es el último recurso
    - No documentar nada por escrito
  ESCALAMIENTO:
    Si el periodista no coopera, remitir a
    Protocolo SOMBRA para medidas adicionales.
  `
);

registerLines(
  expansionData.tv_coverage_report.content,
  `
  RELATÓRIO DE INTELIGÊNCIA — AMEAÇA DE COBERTURA DE TV
  DATA: 25-JAN-1996
  PRIORIDADE: ALTA
  ASSUNTO: Programa Dominical (Rede Nacional)
  CONTEXTO:
    Programa de domingo de maior audiência do Brasil.
    Audiência: mais de 40 milhões de telespectadores.
    Faixa horária: 21:00-23:30
  AVALIAÇÃO DA AMEAÇA:
    Equipe de produção enviada a Varginha em 24-JAN.
    Entrevistou testemunhas locais (sem controle).
    Obteve imagens de vídeo amador (não verificadas).
    Segmento programado para transmissão em 28-JAN.
  PRÉVIA DE CONTEÚDO (obtida por fonte):
    - Entrevistas com as três irmãs
    - Imagens de veículos militares
    - Declaração de guarda de segurança do hospital
    - Comentário de "especialista" (ufólogo civil)
  POTENCIAL DE DANO:
    SEVERO — Exposição nacional impossível de conter
    Legitimizaria a história para repercussão internacional
  AÇÃO RECOMENDADA:
    1. Contatar imediatamente o diretor SANTOS
    2. Invocar cláusula de segurança nacional
    3. Oferecer exclusivo substituto (sugerir carnaval)
    4. Se necessário, escalar para a propriedade da rede
  STATUS: AÇÃO EM ANDAMENTO
  `,
  `
  INFORME DE INTELIGENCIA — AMENAZA DE COBERTURA TELEVISIVA
  FECHA: 25-JAN-1996
  PRIORIDAD: ALTA
  ASUNTO: Programa Dominical (Rede Nacional)
  ANTECEDENTES:
    Programa dominical con mayor audiencia de Brasil.
    Audiencia: más de 40 millones de televidentes.
    Franja horaria: 21:00-23:30
  EVALUACIÓN DE LA AMENAZA:
    Equipo de producción enviado a Varginha el 24-JAN.
    Entrevistó a testigos locales (sin control).
    Obtuvo metraje de video amateur (no verificado).
    Segmento programado para emisión el 28-JAN.
  AVANCE DE CONTENIDO (obtenido por fuente):
    - Entrevistas con las tres hermanas
    - Metraje de vehículos militares
    - Declaración del guardia de seguridad del hospital
    - Comentario de "experto" (ufólogo civil)
  POTENCIAL DE DAÑO:
    SEVERO — Exposición nacional imposible de contener
    Legitimaría la historia para difusión internacional
  ACCIÓN RECOMENDADA:
    1. Contactar de inmediato al director SANTOS
    2. Invocar la cláusula de seguridad nacional
    3. Ofrecer una exclusiva sustituta (sugerir carnaval)
    4. Si es necesario, escalar a la propiedad de la cadena
  ESTADO: ACCIÓN EN PROGRESO
  `
);

registerLines(
  expansionData.foreign_press_alert.content,
  `
  ALERTA — INTERESSE DA IMPRENSA ESTRANGEIRA
  DATA: 15-JUN-1996
  CLASSIFICAÇÃO: RESTRITA
  ASSUNTO: Investigação do American Business Journal
  SITUAÇÃO:
    O American Business Journal (Nova York) designou
    o correspondente J. BROOKE para investigar o incidente.
  PERFIL DO JORNALISTA:
    Nome: James BROOKE
    Sucursal: Rio de Janeiro
    Histórico: 12 anos cobrindo a América Latina
    Avaliação: PROFISSIONAL, PERSISTENTE
  ATIVIDADES CONHECIDAS:
    - Protocolou pedido FOIA junto à Força Aérea Brasileira
    - Contatou administração hospitalar regional
    - Tentou entrevistar o corpo de bombeiros
    - Visitou o bairro Jardim Andere
  STATUS DO ARTIGO:
    Publicação prevista: fim de junho de 1996
    Tom esperado: Cético, mas minucioso
    Ângulo provável: Sigilo militar, relatos de testemunhas
  RESPOSTA RECOMENDADA:
    1. NÃO se envolver diretamente
       (Jornalista estrangeiro = regras diferentes)
    2. Preparar nota oficial enfatizando:
       - Explicação de balão meteorológico
       - Confusão/histeria das testemunhas
       - Nenhum envolvimento militar
    3. Orientar fontes brasileiras cooperativas a:
       - Lançar dúvidas sobre as testemunhas
       - Enfatizar a explicação do "Mudinho"
       - Sugerir ângulo de histeria coletiva
    4. Monitorar a publicação e preparar resposta
  NOTA: Não é possível usar táticas domésticas de supressão.
        Veículo internacional exige abordagem diferente.
  `,
  `
  ALERTA — INTERÉS DE LA PRENSA EXTRANJERA
  FECHA: 15-JUN-1996
  CLASIFICACIÓN: RESTRINGIDA
  ASUNTO: Investigación de American Business Journal
  SITUACIÓN:
    American Business Journal (Nueva York) ha asignado
    al corresponsal J. BROOKE para investigar el incidente.
  PERFIL DEL PERIODISTA:
    Nombre: James BROOKE
    Buró: Río de Janeiro
    Antecedentes: 12 años cubriendo América Latina
    Evaluación: PROFESIONAL, PERSISTENTE
  ACTIVIDADES CONOCIDAS:
    - Presentó solicitud FOIA ante la Fuerza Aérea Brasileña
    - Contactó a la administración hospitalaria regional
    - Intentó entrevistar al cuerpo de bomberos
    - Visitó el barrio Jardim Andere
  ESTADO DEL ARTÍCULO:
    Publicación programada: fines de junio de 1996
    Tono esperado: Escéptico pero exhaustivo
    Ángulo probable: Secreto militar, relatos de testigos
  RESPUESTA RECOMENDADA:
    1. NO involucrarse directamente
       (Periodista extranjero = reglas distintas)
    2. Preparar declaración oficial enfatizando:
       - Explicación del globo meteorológico
       - Confusión/histeria de los testigos
       - Ninguna participación militar
    3. Instruir a fuentes brasileñas cooperativas para que:
       - Siembren dudas sobre los testigos
       - Enfatizen la explicación de "Mudinho"
       - Sugieran el ángulo de histeria colectiva
    4. Monitorear la publicación y preparar respuesta
  NOTA: No se pueden usar tácticas domésticas de supresión.
        Un medio internacional requiere otro enfoque.
  `
);

registerLines(
  expansionData.witness_visit_log.content,
  `
  REGISTRO DE CONTATO COM TESTEMUNHAS — OPERAÇÃO SILÊNCIO
  PERÍODO: 21-JAN a 15-FEB 1996
  CLASSIFICAÇÃO: RESTRITA
  VISITA #001
    Data: 21-JAN-1996, 22:00
    Sujeito: WITNESS-1 (testemunha principal, irmã mais velha)
    Local: Residência, Jardim Andere
    Equipe: COBRA-1, COBRA-2
    Duração: 45 minutos
    Resultado: COOPERATIVA (ver formulário de retratação)
  VISITA #002
    Data: 21-JAN-1996, 23:30
    Sujeito: WITNESS-2 (irmã do meio)
    Local: Residência, Jardim Andere
    Equipe: COBRA-1, COBRA-2
    Duração: 30 minutos
    Resultado: COOPERATIVA
  VISITA #003
    Data: 22-JAN-1996, 06:00
    Sujeito: WITNESS-3 (irmã mais nova)
    Local: Local de trabalho
    Equipe: COBRA-3, COBRA-4
    Duração: 20 minutos
    Resultado: RESISTENTE — acompanhamento necessário
  VISITA #004
    Data: 22-JAN-1996, 14:00
    Sujeito: [REDACTED] (despachante do corpo de bombeiros)
    Local: Quartel dos bombeiros
    Equipe: COBRA-1, COBRA-2
    Duração: 35 minutos
    Resultado: COOPERATIVA
    Nota: Concordou com a posição de "sem comentários"
  VISITA #005
    Data: 23-JAN-1996, 19:00
    Sujeito: WITNESS-3 (acompanhamento)
    Local: Residência
    Equipe: COBRA-1, COBRA-2, COBRA-5
    Duração: 90 minutos
    Resultado: COOPERATIVA
    Nota: Exigiu persuasão prolongada
  VISITA #006
    Data: 24-JAN-1996, 08:00
    Sujeito: [REDACTED] (auxiliar hospitalar)
    Local: Hospital Regional
    Equipe: COBRA-3, COBRA-4
    Duração: 25 minutos
    Resultado: COOPERATIVA
    Nota: Assinou NDA, recebeu indenização de desligamento
  VISITA #007
    Data: 25-JAN-1996, 20:00
    Sujeito: FERREIRA, Ana (veterinária do zoológico)
    Local: Residência
    Equipe: COBRA-1, COBRA-2
    Duração: 55 minutos
    Resultado: PARCIALMENTE COOPERATIVA
    Nota: Ver arquivo do incidente no zoológico
  TOTAL DE CONTATOS: 14
  COOPERATIVOS: 12
  RESISTENTES: 2 (resolvidos)
  `,
  `
  REGISTRO DE CONTACTO CON TESTIGOS — OPERACIÓN SILÊNCIO
  PERÍODO: 21-JAN a 15-FEB 1996
  CLASIFICACIÓN: RESTRINGIDA
  VISITA #001
    Fecha: 21-JAN-1996, 22:00
    Sujeto: WITNESS-1 (testigo principal, hermana mayor)
    Lugar: Residencia, Jardim Andere
    Equipo: COBRA-1, COBRA-2
    Duración: 45 minutos
    Resultado: COOPERATIVA (ver formulario de retractación)
  VISITA #002
    Fecha: 21-JAN-1996, 23:30
    Sujeto: WITNESS-2 (hermana del medio)
    Lugar: Residencia, Jardim Andere
    Equipo: COBRA-1, COBRA-2
    Duración: 30 minutos
    Resultado: COOPERATIVA
  VISITA #003
    Fecha: 22-JAN-1996, 06:00
    Sujeto: WITNESS-3 (hermana menor)
    Lugar: Lugar de trabajo
    Equipo: COBRA-3, COBRA-4
    Duración: 20 minutos
    Resultado: RESISTENTE — requiere seguimiento
  VISITA #004
    Fecha: 22-JAN-1996, 14:00
    Sujeto: [REDACTED] (despachador de bomberos)
    Lugar: Estación de bomberos
    Equipo: COBRA-1, COBRA-2
    Duración: 35 minutos
    Resultado: COOPERATIVA
    Nota: Acordó mantener posición de "sin comentarios"
  VISITA #005
    Fecha: 23-JAN-1996, 19:00
    Sujeto: WITNESS-3 (seguimiento)
    Lugar: Residencia
    Equipo: COBRA-1, COBRA-2, COBRA-5
    Duración: 90 minutos
    Resultado: COOPERATIVA
    Nota: Requirió persuasión prolongada
  VISITA #006
    Fecha: 24-JAN-1996, 08:00
    Sujeto: [REDACTED] (camillero hospitalario)
    Lugar: Hospital Regional
    Equipo: COBRA-3, COBRA-4
    Duración: 25 minutos
    Resultado: COOPERATIVA
    Nota: Firmó NDA, recibió indemnización
  VISITA #007
    Fecha: 25-JAN-1996, 20:00
    Sujeto: FERREIRA, Ana (veterinaria del zoológico)
    Lugar: Residencia
    Equipo: COBRA-1, COBRA-2
    Duración: 55 minutos
    Resultado: PARCIALMENTE COOPERATIVA
    Nota: Ver archivo del incidente del zoológico
  TOTAL DE CONTACTOS: 14
  COOPERATIVOS: 12
  RESISTENTES: 2 (resueltos)
  `
);

registerLines(
  expansionData.debriefing_protocol.content,
  `
  PROCEDIMENTO OPERACIONAL PADRÃO
  INTERROGATÓRIO DE TESTEMUNHA — PROTOCOLO SOMBRA
  CLASSIFICAÇÃO: RESTRITA
  OBJETIVO:
    Garantir que testemunhas civis mantenham silêncio
    acerca de incidentes classificados.
  FASE 1: ABORDAGEM
    - Equipe de no mínimo DOIS (nunca sozinho)
    - Ternos escuros, identificação mínima
    - Chegar fora do horário normal (preferência 22:00-06:00)
    - NÃO exibir distintivos, salvo necessidade
    - Dizer: "Somos do governo"
  FASE 2: AVALIAÇÃO
    Avaliar a disposição da testemunha:
    TIPO A: Já amedrontada
      → Prosseguir diretamente para tranquilização
      → "Você não viu nada incomum"
    TIPO B: Curiosa/falante
      → Enfatizar segurança nacional
      → "A segurança da sua família depende do silêncio"
    TIPO C: Hostil/resistente
      → Acionar equipe secundária
      → Sessão estendida necessária
      → Ver Protocolo SOMBRA-EXTENDED
  FASE 3: DOCUMENTAÇÃO
    - Obter declaração assinada de retratação
    - Obter NDA assinado (Formulário W-7)
    - Fotografar a testemunha (para arquivo)
    - Registrar quaisquer familiares presentes
  FASE 4: ACOMPANHAMENTO
    - Monitorar o sujeito por no mínimo 30 dias
    - Verificar ausência de contato com a mídia
    - Se houver suspeita de violação, escalar imediatamente
  TÉCNICAS AUTORIZADAS:
    ✓ Persuasão verbal
    ✓ Insinuação de consequências
    ✓ Incentivo financeiro
    ✓ Pressão empregatícia
    ✗ Contato físico (PROIBIDO)
    ✗ Ameaças diretas (PROIBIDO)
  NOTA: Todas as sessões são NÃO REGISTRADAS.
        Nenhuma nota deve ser tomada na presença da testemunha.
  `,
  `
  PROCEDIMIENTO OPERATIVO ESTÁNDAR
  INTERROGATORIO DE TESTIGOS — PROTOCOLO SOMBRA
  CLASIFICACIÓN: RESTRINGIDA
  PROPÓSITO:
    Asegurar que los testigos civiles guarden silencio
    respecto de incidentes clasificados.
  FASE 1: ACERCAMIENTO
    - Equipo de DOS como mínimo (nunca solo)
    - Trajes oscuros, identificación mínima
    - Llegar fuera del horario normal (preferible 22:00-06:00)
    - NO mostrar insignias salvo que sea necesario
    - Decir: "Somos del gobierno"
  FASE 2: EVALUACIÓN
    Evaluar la disposición del testigo:
    TIPO A: Ya asustado
      → Proceder directamente al tranquilizamiento
      → "No viste nada inusual"
    TIPO B: Curioso/hablador
      → Enfatizar seguridad nacional
      → "La seguridad de tu familia depende del silencio"
    TIPO C: Hostil/resistente
      → Desplegar equipo secundario
      → Se requiere sesión extendida
      → Ver Protocolo SOMBRA-EXTENDED
  FASE 3: DOCUMENTACIÓN
    - Obtener declaración de retractación firmada
    - Obtener NDA firmado (Formulario W-7)
    - Fotografiar al testigo (para expediente)
    - Registrar a los familiares presentes
  FASE 4: SEGUIMIENTO
    - Monitorear al sujeto por un mínimo de 30 días
    - Verificar ausencia de contacto con medios
    - Si se sospecha una filtración, escalar de inmediato
  TÉCNICAS AUTORIZADAS:
    ✓ Persuasión verbal
    ✓ Insinuación de consecuencias
    ✓ Incentivo financiero
    ✓ Presión laboral
    ✗ Contacto físico (PROHIBIDO)
    ✗ Amenazas directas (PROHIBIDO)
  NOTA: Todas las sesiones NO SE REGISTRAN.
        No deben tomarse notas en presencia del testigo.
  `
);

registerLines(
  expansionData.silva_sisters_file.content,
  `
  ARQUIVO DE SUJEITOS — AS TRÊS TESTEMUNHAS
  CLASSIFICAÇÃO: RESTRITA
  NÚMERO DO ARQUIVO: VAR-96-W001
  TESTEMUNHAS PRINCIPAIS — INCIDENTE DO JARDIM ANDERE
  SUJEITO 1: WITNESS-1 (irmã mais velha)
    Idade: 22
    Ocupação: Trabalhadora doméstica
    Estado civil: Solteira
    Dependentes: Nenhum
    Endereço: [REDACTED], Jardim Andere, Varginha
    Avaliação: A MAIS CRÍVEL das três
    Comportamento: Assustada, religiosa
    Pontos de pressão: Saúde da mãe, segurança no trabalho
    Resumo da declaração:
      Viu "criatura" por volta de 15:30 em 20-JAN
      Descreveu: pequena, pele marrom, olhos vermelhos
      Afirma que a criatura "olhou para ela"
      Correu imediatamente, chamou a mãe
    Status: RETRATADA (23-JAN)
    Posição atual: "Viu um morador de rua"
  SUJEITO 2: WITNESS-2 (irmã do meio)
    Idade: 16
    Ocupação: Estudante
    Relação: Irmã de WITNESS-1
    Avaliação: IMPRESSIONÁVEL
    Comportamento: Nervosa, facilmente influenciável
    Pontos de pressão: Matrícula escolar
    Status: RETRATADA (22-JAN)
    Posição atual: "A irmã estava confusa"
  SUJEITO 3: WITNESS-3 (irmã mais nova)
    Idade: 14
    Ocupação: Estudante
    Relação: Irmã de WITNESS-1
    Avaliação: RESISTENTE
    Comportamento: Desafiante, mantém a história
    Pontos de pressão: Futuro acadêmico
    Status: PARCIALMENTE COOPERATIVA (25-JAN)
    Posição atual: "Concorda em permanecer em silêncio"
    Nota: NÃO assinou retratação
          Monitorar de perto
  SITUAÇÃO FAMILIAR:
    Mãe: [REDACTED] — apoia as filhas
    Pai: Falecido
    Situação econômica: Classe média baixa
    Religião: Católica (devota)
  AVALIAÇÃO DE CONTENÇÃO:
    Nível de risco: MODERADO
    Motivo: WITNESS-3 permanece não convencida
    Recomendação: Monitorar por 6 meses
  `,
  `
  ARCHIVO DE SUJETOS — LAS TRES TESTIGOS
  CLASIFICACIÓN: RESTRINGIDA
  NÚMERO DE ARCHIVO: VAR-96-W001
  TESTIGOS PRINCIPALES — INCIDENTE DE JARDIM ANDERE
  SUJETO 1: WITNESS-1 (hermana mayor)
    Edad: 22
    Ocupación: Trabajadora doméstica
    Estado civil: Soltera
    Dependientes: Ninguno
    Dirección: [REDACTED], Jardim Andere, Varginha
    Evaluación: LA MÁS CREÍBLE de las tres
    Conducta: Asustada, religiosa
    Puntos de presión: Salud de la madre, seguridad laboral
    Resumen de declaración:
      Vio "criatura" aprox. a las 15:30 del 20-JAN
      Describió: pequeña, piel marrón, ojos rojos
      Afirma que la criatura "la miró"
      Corrió de inmediato, llamó a su madre
    Estado: RETRACTADA (23-JAN)
    Posición actual: "Vio a un indigente"
  SUJETO 2: WITNESS-2 (hermana del medio)
    Edad: 16
    Ocupación: Estudiante
    Relación: Hermana de WITNESS-1
    Evaluación: IMPRESIONABLE
    Conducta: Nerviosa, fácilmente influenciable
    Puntos de presión: Matrícula escolar
    Estado: RETRACTADA (22-JAN)
    Posición actual: "La hermana estaba confundida"
  SUJETO 3: WITNESS-3 (hermana menor)
    Edad: 14
    Ocupación: Estudiante
    Relación: Hermana de WITNESS-1
    Evaluación: RESISTENTE
    Conducta: Desafiante, mantiene la historia
    Puntos de presión: Futuro académico
    Estado: PARCIALMENTE COOPERATIVA (25-JAN)
    Posición actual: "Acepta guardar silencio"
    Nota: NO firmó retractación
          Monitorear de cerca
  SITUACIÓN FAMILIAR:
    Madre: [REDACTED] — apoya a sus hijas
    Padre: Fallecido
    Situación económica: Clase media baja
    Religión: Católica (devota)
  EVALUACIÓN DE CONTENCIÓN:
    Nivel de riesgo: MODERADO
    Motivo: WITNESS-3 sigue sin convencerse
    Recomendación: Monitorear durante 6 meses
  `
);

registerLines(
  expansionData.recantation_form_001.content,
  `
  CORREÇÃO DE DECLARAÇÃO DE TESTEMUNHA
  FORMULÁRIO W-9 (RETRATAÇÃO VOLUNTÁRIA)
  Eu, [WITNESS-1], em pleno uso de minhas faculdades mentais, declaro:
  Na tarde de 20 de janeiro de 1996, relatei
  ter visto uma figura incomum no Jardim Andere,
  bairro de Varginha.
  Agora reconheço que eu estava ENGANADA.
  O que eu realmente vi foi um indivíduo em situação de rua,
  possivelmente embriagado ou mentalmente perturbado.
  A aparência incomum se devia a:
    - Condições precárias de iluminação
    - Meu próprio estado de medo
    - Influência de matérias recentes da mídia
  Lamento profundamente qualquer confusão que meu relato inicial
  possa ter causado às autoridades ou ao público.
  Não falarei com jornalistas sobre este assunto.
  Não participarei de entrevistas na mídia.
  Desencorajarei minha família de discutir isso.
  Esta declaração é prestada de forma livre e voluntária.
  Assinatura: [ASSINADO]
  Data: 23-JAN-1996
  Testemunha: [REDACTED], Agente Federal
  `,
  `
  CORRECCIÓN DE DECLARACIÓN DE TESTIGO
  FORMULARIO W-9 (RETRACTACIÓN VOLUNTARIA)
  Yo, [WITNESS-1], en pleno uso de mis facultades mentales, declaro:
  En la tarde del 20 de enero de 1996, informé
  haber visto una figura inusual en el barrio de Jardim Andere,
  en Varginha.
  Ahora reconozco que estaba EQUIVOCADA.
  Lo que realmente vi fue a un indigente,
  posiblemente intoxicado o mentalmente perturbado.
  La apariencia inusual se debió a:
    - Condiciones de iluminación deficientes
    - Mi propio estado de miedo
    - Influencia de historias recientes en los medios
  Lamento profundamente cualquier confusión que mi informe inicial
  haya podido causar a las autoridades o al público.
  No hablaré con periodistas sobre este asunto.
  No participaré en entrevistas con medios.
  Desanimaré a mi familia a hablar de esto.
  Esta declaración se entrega libre y voluntariamente.
  Firma: [FIRMADO]
  Fecha: 23-JAN-1996
  Testigo: [REDACTED], Agente Federal
  `
);

registerLines(
  expansionData.mudinho_dossier.content,
  `
  ATIVO DE HISTÓRIA DE COBERTURA — CODINOME "MUDINHO"
  CLASSIFICAÇÃO: RESTRITA
  ARQUIVO: CS-96-001
  PERFIL DO SUJEITO:
    Nome legal: [REDACTED]
    Conhecido como: "Mudinho" (apelido local)
    Idade: Aproximadamente 35-40
    Status: Deficiência mental
    Residência: Ruas de Varginha (em situação de rua)
  DESCRIÇÃO FÍSICA:
    Altura: 1,40 m (incomumente baixo)
    Constituição: Magro, desnutrido
    Pele: Escura, castigada pelo tempo
    Características distintivas:
      - Postura curvada
      - Comunicação verbal limitada
      - Frequentemente visto na área do Jardim Andere
  IMPLANTAÇÃO DA HISTÓRIA DE COBERTURA
  NARRATIVA:
    "A criatura descrita pelas testemunhas era, na verdade,
     um homem local com deficiência mental conhecido como Mudinho.
     Na confusão e na iluminação ruim, as testemunhas
     o confundiram com algo incomum."
  VANTAGENS:
    - O sujeito não pode contradizer (não verbal)
    - O sujeito é conhecido dos moradores
    - As características físicas batem de forma aproximada
    - Explica a postura agachada
  DESVANTAGENS:
    - A cor da pele não corresponde (marrom vs. cinza)
    - Não explica os "olhos vermelhos"
    - É improvável que várias testemunhas tenham se enganado
    - O sujeito NÃO estava no Jardim Andere em 20-JAN
  STATUS DE IMPLANTAÇÃO: ATIVO
  COLOCAÇÃO NA MÍDIA:
    - Estado de Minas: Publicado em 27-JAN
    - Folha Paulista: Publicado em 29-JAN
    - Rede Nacional: Mencionado em 28-JAN
  AVALIAÇÃO DE EFICÁCIA:
    Moderada. Oferece negabilidade plausível, mas
    não resiste a escrutínio próximo.
  NOTA: O sujeito Mudinho foi transferido para uma instituição
        em 02-FEB para impedir contato com jornalistas.
  `,
  `
  ACTIVO DE HISTORIA DE COBERTURA — NOMBRE CLAVE "MUDINHO"
  CLASIFICACIÓN: RESTRINGIDA
  ARCHIVO: CS-96-001
  PERFIL DEL SUJETO:
    Nombre legal: [REDACTED]
    Conocido como: "Mudinho" (apodo local)
    Edad: Aproximadamente 35-40
    Estado: Discapacidad mental
    Residencia: Calles de Varginha (indigente)
  DESCRIPCIÓN FÍSICA:
    Altura: 1,40 m (inusualmente bajo)
    Complexión: Delgado, desnutrido
    Piel: Oscura, curtida
    Rasgos distintivos:
      - Postura encorvada
      - Comunicación verbal limitada
      - A menudo visto en la zona de Jardim Andere
  DESPLIEGUE DE LA HISTORIA DE COBERTURA
  NARRATIVA:
    "La criatura descrita por las testigos era en realidad
     un hombre local con discapacidad mental conocido como Mudinho.
     En la confusión y la mala iluminación, las testigos
     lo confundieron con algo inusual."
  VENTAJAS:
    - El sujeto no puede contradecir (no verbal)
    - El sujeto es conocido por los vecinos
    - Las características físicas coinciden de forma aproximada
    - Explica la postura agachada
  DESVENTAJAS:
    - El color de piel no coincide (marrón vs. gris)
    - No explica los "ojos rojos"
    - Es poco probable que varios testigos se hayan equivocado
    - El sujeto NO estaba en Jardim Andere el 20-JAN
  ESTADO DE DESPLIEGUE: ACTIVO
  COLOCACIÓN EN MEDIOS:
    - Estado de Minas: Publicado el 27-JAN
    - Folha Paulista: Publicado el 29-JAN
    - Rede Nacional: Mencionado el 28-JAN
  EVALUACIÓN DE EFECTIVIDAD:
    Moderada. Brinda negación plausible, pero
    no resiste un escrutinio cercano.
  NOTA: El sujeto Mudinho fue trasladado a una institución
        el 02-FEB para evitar contacto con periodistas.
  `
);

registerLines(
  expansionData.alternative_explanations.content,
  `
  OPÇÕES DE HISTÓRIA DE COBERTURA — INCIDENTE DE VARGINHA
  COMPILADO: 22-JAN-1996
  CLASSIFICAÇÃO: USO INTERNO APENAS
  As seguintes explicações alternativas estão aprovadas
  para implantação conforme audiência e contexto:
  OPÇÃO A: BALÃO METEOROLÓGICO
    Usar para: Relatos de avistamento aéreo
    Narrativa: "Equipamento meteorológico do INMET"
    Força: Clássica, amplamente aceita
    Fraqueza: Não explica avistamentos em solo
    Status: IMPLANTADA para relatos de UFO
  OPÇÃO B: MORADOR DE RUA (MUDINHO)
    Usar para: Avistamentos de criatura
    Narrativa: "Homem local com deficiência mental"
    Força: Explica forma humanoide
    Fraqueza: Contradita por detalhes das testemunhas
    Status: PRIMÁRIA para mídia doméstica
  OPÇÃO C: ANIMAL ESCAPADO
    Usar para: Secundária/reserva
    Narrativa: "Macaco ou animal semelhante"
    Força: Explica aparência incomum
    Fraqueza: Nenhum zoológico relatou fuga
    Status: RESERVA
  OPÇÃO D: EXERCÍCIO MILITAR
    Usar para: Movimentações de tropas/veículos
    Narrativa: "Exercício rotineiro de treinamento"
    Força: Explica presença militar
    Fraqueza: Nenhum exercício estava programado
    Status: IMPLANTADA para avistamentos de caminhões
  OPÇÃO E: HISTERIA COLETIVA
    Usar para: Descrédito de longo prazo
    Narrativa: "Pânico comunitário, sugestionabilidade"
    Força: Enfraquece todas as testemunhas
    Fraqueza: Exige tempo para se estabelecer
    Status: IMPLANTAÇÃO EM ANDAMENTO
  OPÇÃO F: BRINCADEIRA/FARSA
    Usar para: Recurso futuro
    Narrativa: "Jovens locais pregando peça"
    Força: Explicação simples
    Fraqueza: Requer identificar os "brincalhões"
    Status: RESERVA
  RECOMENDAÇÃO:
    Implantar múltiplas explicações simultaneamente.
    A confusão serve à contenção.
  `,
  `
  OPCIONES DE HISTORIA DE COBERTURA — INCIDENTE DE VARGINHA
  COMPILADO: 22-JAN-1996
  CLASIFICACIÓN: SOLO USO INTERNO
  Las siguientes explicaciones alternativas están aprobadas
  para desplegarse según la audiencia y el contexto:
  OPCIÓN A: GLOBO METEOROLÓGICO
    Usar para: Reportes de avistamientos aéreos
    Narrativa: "Equipo meteorológico de INMET"
    Fortaleza: Clásica, ampliamente aceptada
    Debilidad: No explica avistamientos en tierra
    Estado: DESPLEGADA para reportes de UFO
  OPCIÓN B: INDIGENTE (MUDINHO)
    Usar para: Avistamientos de criatura
    Narrativa: "Hombre local con discapacidad mental"
    Fortaleza: Explica la forma humanoide
    Debilidad: Contradicha por detalles de testigos
    Estado: PRIMARIA para medios nacionales
  OPCIÓN C: ANIMAL ESCAPADO
    Usar para: Secundaria/respaldo
    Narrativa: "Mono o animal similar"
    Fortaleza: Explica apariencia inusual
    Debilidad: Ningún zoológico reportó escape
    Estado: RESERVA
  OPCIÓN D: EJERCICIO MILITAR
    Usar para: Movimientos de tropas/vehículos
    Narrativa: "Ejercicio rutinario de entrenamiento"
    Fortaleza: Explica la presencia militar
    Debilidad: No había ejercicio programado
    Estado: DESPLEGADA para avistamientos de camiones
  OPCIÓN E: HISTERIA COLECTIVA
    Usar para: Descrédito a largo plazo
    Narrativa: "Pánico comunitario, sugestibilidad"
    Fortaleza: Debilita a todos los testigos
    Debilidad: Requiere tiempo para establecerse
    Estado: DESPLIEGUE EN PROGRESO
  OPCIÓN F: BROMISTAS/ENGAÑO
    Usar para: Respaldo futuro
    Narrativa: "Jóvenes locales jugando una broma"
    Fortaleza: Explicación simple
    Debilidad: Requiere identificar a los "bromistas"
    Estado: RESERVA
  RECOMENDACIÓN:
    Desplegar múltiples explicaciones simultáneamente.
    La confusión sirve a la contención.
  `
);

registerLines(
  expansionData.media_talking_points.content,
  `
  PONTOS DE FALA PARA A MÍDIA — INCIDENTE DE VARGINHA
  PARA: Todos os Porta-vozes Autorizados
  DATA: 24-JAN-1996
  SE QUESTIONADOS SOBRE AVISTAMENTOS DE CRIATURAS:
    "Investigamos esses relatos exaustivamente.
     Os avistamentos foram de um indivíduo local em situação de rua
     conhecido por frequentar aquele bairro.
     Não há nada incomum a relatar."
  SE QUESTIONADOS SOBRE ATIVIDADE MILITAR:
    "Os veículos militares observados faziam parte de
     operações logísticas rotineiras sem relação com
     quaisquer avistamentos reportados. Trata-se de atividade normal
     para o nosso comando regional."
  SE QUESTIONADOS SOBRE ATIVIDADE HOSPITALAR:
    "Entrada de pacientes e resposta a emergências são
     questões médicas confidenciais. Não podemos comentar
     sobre casos específicos ou rumores."
  SE QUESTIONADOS SOBRE UFOS:
    "Não há evidência de quaisquer fenômenos aéreos não identificados
     na área de Varginha. Anomalias luminosas
     relatadas em 19 de janeiro provavelmente foram reflexos
     atmosféricos de equipamento agrícola."
  SE QUESTIONADOS SOBRE ENCOBRIMENTO:
    "Sugestões de encobrimento são teorias conspiratórias
     sem fundamento. As Forças Armadas Brasileiras operam com
     total transparência dentro dos protocolos
     adequados de segurança. Não há nada a esconder."
  NÃO:
    - Engajar com relatos específicos de testemunhas
    - Confirmar ou negar informação classificada
    - Especular sobre explicações alternativas
    - Reconhecer a existência de qualquer "investigação"
  `,
  `
  PUNTOS DE CONVERSACIÓN PARA MEDIOS — INCIDENTE DE VARGINHA
  PARA: Todos los Portavoces Autorizados
  FECHA: 24-JAN-1996
  SI PREGUNTAN SOBRE AVISTAMIENTOS DE CRIATURAS:
    "Hemos investigado estos reportes a fondo.
     Los avistamientos correspondían a un indigente local
     conocido por frecuentar ese vecindario.
     No hay nada inusual que informar."
  SI PREGUNTAN SOBRE ACTIVIDAD MILITAR:
    "Los vehículos militares observados formaban parte de
     operaciones logísticas rutinarias no relacionadas con
     ningún avistamiento reportado. Esta es actividad normal
     para nuestro mando regional."
  SI PREGUNTAN SOBRE ACTIVIDAD HOSPITALARIA:
    "El ingreso de pacientes y la respuesta de emergencia son
     asuntos médicos confidenciales. No podemos comentar
     casos específicos o rumores."
  SI PREGUNTAN SOBRE OVNIS:
    "No existe evidencia de fenómenos aéreos no identificados
     en el área de Varginha. Las anomalías luminosas
     reportadas el 19 de enero probablemente fueron reflejos
     atmosféricos de equipo agrícola."
  SI PREGUNTAN SOBRE ENCUBRIMIENTO:
    "Las sugerencias de encubrimiento son teorías conspirativas
     infundadas. Las Fuerzas Armadas Brasileñas operan con
     total transparencia dentro de los protocolos de
     seguridad apropiados. No hay nada que ocultar."
  NO:
    - Involucrarse con relatos específicos de testigos
    - Confirmar o negar información clasificada
    - Especular sobre explicaciones alternativas
    - Reconocer la existencia de cualquier "investigación"
  `
);

registerLines(
  expansionData.animal_deaths_report.content,
  `
  RELATÓRIO DE INCIDENTE — ZOOLÓGICO MUNICIPAL DE VARGINHA
  DATA: 28-JAN-1996
  CLASSIFICAÇÃO: RESTRITA
  RESUMO:
    Múltiplas mortes de animais no zoológico municipal durante o
    período de 22-JAN a 27-JAN de 1996.
  FATALIDADES:
    22-JAN 06:00 — TAPIR (Tapirus terrestris)
      Idade: 8 anos
      Saúde prévia: Excelente
      Sintomas: Encontrado morto, sem trauma visível
      Necropsia: Hemorragia interna, falência de órgãos
    24-JAN 14:00 — JAGUATIRICA (Leopardus pardalis)
      Idade: 5 anos
      Saúde prévia: Boa
      Sintomas: Convulsões, declínio rápido
      Necropsia: Dano neurológico, causa desconhecida
    25-JAN 08:30 — VEADO (Mazama americana)
      Idade: 3 anos
      Saúde prévia: Excelente
      Sintomas: Agitação extrema, depois colapso
      Necropsia: Parada cardíaca, cortisol elevado
    27-JAN 03:00 — CAPIVARA (Hydrochoerus hydrochaeris)
      Idade: 6 anos
      Saúde prévia: Boa
      Sintomas: Recusa alimentar, tremores
      Necropsia: Falência múltipla de órgãos
  AVALIAÇÃO DA VETERINÁRIA (Dra. Ana FERREIRA):
    "Essas mortes são sem precedentes. Os animais não mostravam
     doença prévia. O padrão sugere exposição a
     patógeno ou toxina desconhecidos. A proximidade das
     mortes com o incidente relatado em 20-JAN não pode
     ser coincidência."
  NOTA OPERACIONAL:
    Os animais eram mantidos em recintos adjacentes à
    área de CONTENÇÃO TEMPORÁRIA usada em 20-21 JAN.
    Possível contaminação por violação de contenção
    de "espécime de fauna". Investigação em andamento.
  `,
  `
  INFORME DE INCIDENTE — ZOOLÓGICO MUNICIPAL DE VARGINHA
  FECHA: 28-JAN-1996
  CLASIFICACIÓN: RESTRINGIDA
  RESUMEN:
    Múltiples muertes de animales en el zoológico municipal durante el
    período del 22-JAN al 27-JAN de 1996.
  FALLECIMIENTOS:
    22-JAN 06:00 — TAPIR (Tapirus terrestris)
      Edad: 8 años
      Salud previa: Excelente
      Síntomas: Hallado muerto, sin trauma visible
      Necropsia: Hemorragia interna, falla orgánica
    24-JAN 14:00 — OCELOTE (Leopardus pardalis)
      Edad: 5 años
      Salud previa: Buena
      Síntomas: Convulsiones, deterioro rápido
      Necropsia: Daño neurológico, causa desconocida
    25-JAN 08:30 — VENADO (Mazama americana)
      Edad: 3 años
      Salud previa: Excelente
      Síntomas: Agitación extrema, luego colapso
      Necropsia: Paro cardíaco, cortisol elevado
    27-JAN 03:00 — CAPIBARA (Hydrochoerus hydrochaeris)
      Edad: 6 años
      Salud previa: Buena
      Síntomas: Rechazo de alimento, temblores
      Necropsia: Falla multiorgánica
  EVALUACIÓN DE LA VETERINARIA (Dra. Ana FERREIRA):
    "Estas muertes no tienen precedentes. Los animales no mostraban
     enfermedad previa. El patrón sugiere exposición a
     un patógeno o toxina desconocidos. La proximidad de las
     muertes con el incidente reportado el 20-JAN no puede
     ser coincidencia."
  NOTA OPERATIVA:
    Los animales estaban alojados en recintos adyacentes al
    área de RETENCIÓN TEMPORAL utilizada el 20-21 JAN.
    Posible contaminación por brecha de contención
    de "espécimen de fauna". Investigación en curso.
  `
);

registerLines(
  expansionData.veterinarian_silencing.content,
  `
  AÇÃO DE CONTENÇÃO — VETERINÁRIA DO ZOOLÓGICO
  DATA: 30-JAN-1996
  CLASSIFICAÇÃO: RESTRITA
  ASSUNTO: Dra. Ana FERREIRA
  Cargo: Veterinária-Chefe, Zoológico Municipal
  Nível de ameaça: MODERADO
  SITUAÇÃO:
    A Dra. Ferreira estabeleceu conexão entre as mortes
    dos animais e o incidente classificado. Documentou
    achados anômalos de necropsia. Busca
    consultoria externa.
  AÇÕES TOMADAS:
    25-JAN: Contato inicial (Protocolo SOMBRA)
      Resultado: PARCIALMENTE COOPERATIVA
      Concordou em adiar consulta externa
    28-JAN: Amostras de necropsia CONFISCADAS
      Cobertura: "diretriz da autoridade de saúde pública"
      Nota: Amostras transferidas para instalação segura
    29-JAN: Pressão administrativa aplicada
      Diretor do zoológico instruído a reatribuir a sujeita
      "Licença estendida" sugerida
    30-JAN: Visita de acompanhamento (equipe COBRA)
      Duração: 2 horas
      Resultado: TOTALMENTE COOPERATIVA
      Assinou: NDA, declaração atribuindo as mortes a
              "remessa contaminada de ração"
  STATUS ATUAL:
    Sujeita em licença administrativa
    Nenhum contato com mídia autorizado
    Monitoramento: 90 dias
  MEDIDA ADICIONAL:
    O marido da sujeita trabalha na universidade estadual
    Pressão empregatícia disponível, se necessário
  `,
  `
  ACCIÓN DE CONTENCIÓN — VETERINARIA DEL ZOOLÓGICO
  FECHA: 30-JAN-1996
  CLASIFICACIÓN: RESTRINGIDA
  ASUNTO: Dra. Ana FERREIRA
  Cargo: Veterinaria Jefa, Zoológico Municipal
  Nivel de amenaza: MODERADO
  SITUACIÓN:
    La Dra. Ferreira ha vinculado las muertes de
    animales con el incidente clasificado. Ha documentado
    hallazgos anómalos de necropsia. Busca
    consulta externa.
  ACCIONES TOMADAS:
    25-JAN: Contacto inicial (Protocolo SOMBRA)
      Resultado: PARCIALMENTE COOPERATIVA
      Aceptó retrasar la consulta externa
    28-JAN: Muestras de necropsia CONFISCADAS
      Cobertura: "directiva de autoridad de salud pública"
      Nota: Muestras transferidas a instalación segura
    29-JAN: Presión administrativa aplicada
      Se instruyó al director del zoológico a reasignar al sujeto
      Se sugirió "licencia extendida"
    30-JAN: Visita de seguimiento (equipo COBRA)
      Duración: 2 horas
      Resultado: TOTALMENTE COOPERATIVA
      Firmó: NDA, declaración atribuyendo las muertes a
              "cargamento contaminado de alimento"
  ESTADO ACTUAL:
    Sujeta en licencia administrativa
    No autorizado contacto con medios
    Monitoreo: 90 días
  MEDIDA ADICIONAL:
    El esposo de la sujeta trabaja en la universidad estatal
    Presión laboral disponible si fuera necesario
  `
);

registerLines(
  expansionData.contamination_theory.content,
  `
  EXPLICAÇÃO OFICIAL — MORTES DE ANIMAIS NO ZOOLÓGICO
  PARA: Divulgação Pública / Consulta da Imprensa
  DATA: 01-FEB-1996
  COMUNICADO À IMPRENSA:
    "O Zoológico Municipal de Varginha lamenta anunciar
     a perda de quatro animais durante a última semana
     de janeiro de 1996.
     A investigação determinou que a causa foi
     uma remessa contaminada de ração animal recebida
     em 18 de janeiro.
     A contaminação foi rastreada até armazenamento
     inadequado nas instalações do fornecedor. Toda a ração remanescente
     desta remessa foi destruída.
     O zoológico adotou medidas para prevenir futuros
     incidentes. Novos protocolos de verificação de fornecedores
     estão sendo implementados.
     Agradecemos a compreensão da comunidade."
  NOTA INTERNA (NÃO DIVULGAR):
    Esta explicação destina-se apenas ao consumo público.
    Registros da remessa de ração foram alterados para dar suporte.
    O fornecedor foi compensado pela cooperação.
    Causa real: Contaminação por proximidade da
    contenção temporária do espécime de fauna recuperado.
    Ver: /ops/zoo/animal_deaths_report.txt
  `,
  `
  EXPLICACIÓN OFICIAL — MUERTES DE ANIMALES EN EL ZOOLÓGICO
  PARA: Divulgación Pública / Consulta de Medios
  FECHA: 01-FEB-1996
  COMUNICADO DE PRENSA:
    "El Zoológico Municipal de Varginha lamenta anunciar
     la pérdida de cuatro animales durante la última semana
     de enero de 1996.
     La investigación ha determinado que la causa fue
     un cargamento contaminado de alimento animal recibido
     el 18 de enero.
     La contaminación fue rastreada hasta un almacenamiento
     inadecuado en las instalaciones del proveedor. Todo el alimento restante
     de ese cargamento ha sido destruido.
     El zoológico ha tomado medidas para prevenir futuros
     incidentes. Se están implementando nuevos protocolos
     de verificación de proveedores.
     Agradecemos la comprensión de la comunidad."
  NOTA INTERNA (NO DIVULGAR):
    Esta explicación es solo para consumo público.
    Los registros del cargamento de alimento fueron alterados para respaldarla.
    El proveedor fue compensado por su cooperación.
    Causa real: Contaminación por proximidad debida a la
    retención temporal del espécimen de fauna recuperado.
    Ver: /ops/zoo/animal_deaths_report.txt
  `
);

registerLines(
  expansionData.chereze_incident_report.content,
  `
  RELATÓRIO DE INCIDENTE — OFICIAL [CLASSIFICADO]
  CLASSIFICAÇÃO: ULTRASSECRETO
  ARQUIVO: VAR-96-MED-007
  ASSUNTO: [CLASSIFIED], Cabo
  Posto: Cabo, Polícia Militar
  Unidade: 4ª Companhia, Varginha
  Status: FALECIDO (15-FEB-1996)
  LINHA DO TEMPO DOS EVENTOS:
  20-JAN 21:30
    O oficial responde a chamado referente a
    "animal estranho" na área do Jardim Andere.
    Chega à cena, auxilia na contenção.
  20-JAN 22:15
    O oficial faz contato físico direto com o
    espécime de fauna durante a operação de carregamento.
    Área de contato: Antebraço esquerdo, pele exposta.
    Duração: Aproximadamente 3-4 segundos.
  21-JAN 08:00
    O oficial se apresenta ao serviço, relata fadiga leve.
    Atribui ao turno da noite anterior.
  23-JAN
    O oficial reclama de dores de cabeça e dores articulares.
    Irritação na pele observada no local de contato.
    Relata "sonhos estranhos."
  27-JAN
    O oficial é hospitalizado com febre, fraqueza.
    Diagnóstico: "Infecção desconhecida"
    Exames de sangue mostram marcadores anômalos.
  02-FEB
    Condição se deteriora rapidamente.
    Múltiplos sistemas orgânicos afetados.
    Transferência para hospital militar (São Paulo).
  15-FEB 03:47
    O oficial expira.
    Causa oficial: "Complicações de pneumonia"
  NOTAS MÉDICAS (SUPRIMIDAS):
    Médico assistente observou:
    - Necrose tecidual no local de contato
    - Colapso sem precedentes do sistema imune
    - Patógeno não identificável em amostras de sangue
    - Exames cerebrais mostraram padrões incomuns de atividade
    Citação do médico (registrada):
    "Nunca vi nada parecido.
     Isto não é nenhuma doença conhecida."
  AÇÕES DE CONTENÇÃO:
    - Registros médicos CLASSIFICADOS
    - Médico assistente realocado
    - Amostras de sangue transferidas para [REDACTED]
    - Família instruída sobre causa "pneumonia"
    - Pacote de compensação providenciado
  `,
  `
  INFORME DE INCIDENTE — OFICIAL [CLASIFICADO]
  CLASIFICACIÓN: ALTO SECRETO
  ARCHIVO: VAR-96-MED-007
  ASUNTO: [CLASSIFIED], Cabo
  Rango: Cabo, Policía Militar
  Unidad: 4.ª Compañía, Varginha
  Estado: FALLECIDO (15-FEB-1996)
  LÍNEA DE TIEMPO DE LOS HECHOS:
  20-JAN 21:30
    El oficial responde a llamada sobre
    "animal extraño" en el área de Jardim Andere.
    Llega a la escena, ayuda con la contención.
  20-JAN 22:15
    El oficial hace contacto físico directo con el
    espécimen de fauna durante la operación de carga.
    Área de contacto: Antebrazo izquierdo, piel descubierta.
    Duración: Aproximadamente 3-4 segundos.
  21-JAN 08:00
    El oficial se presenta al servicio, reporta fatiga leve.
    La atribuye al turno nocturno anterior.
  23-JAN
    El oficial se queja de dolores de cabeza y articulares.
    Se observa irritación en la piel en el sitio de contacto.
    Reporta "sueños extraños."
  27-JAN
    El oficial es hospitalizado con fiebre y debilidad.
    Diagnóstico: "Infección desconocida"
    El análisis de sangre muestra marcadores anómalos.
  02-FEB
    La condición se deteriora rápidamente.
    Múltiples sistemas orgánicos afectados.
    Traslado a hospital militar (São Paulo).
  15-FEB 03:47
    El oficial expira.
    Causa oficial: "Complicaciones por neumonía"
  NOTAS MÉDICAS (SUPRIMIDAS):
    El médico tratante señaló:
    - Necrosis tisular en el sitio de contacto
    - Colapso sin precedentes del sistema inmune
    - Patógeno no identificable en muestras de sangre
    - Escáneres cerebrales mostraron patrones inusuales de actividad
    Cita del médico (registrada):
    "Nunca he visto algo así.
     Esto no es ninguna enfermedad conocida."
  ACCIONES DE CONTENCIÓN:
    - Registros médicos CLASIFICADOS
    - Médico tratante reasignado
    - Muestras de sangre transferidas a [REDACTED]
    - Familia instruida sobre causa "neumonía"
    - Paquete de compensación dispuesto
  `
);

registerLines(
  expansionData.autopsy_suppression.content,
  `
  DIRETRIZ — SUPRESSÃO DE AUTÓPSIA
  DATA: 16-FEB-1996
  CLASSIFICAÇÃO: ULTRASSECRETA
  RE: Restos mortais do cabo falecido
  Por autoridade de [REDACTED], a seguinte diretiva
  entra em vigor IMEDIATAMENTE:
  1. O procedimento padrão de autópsia está CANCELADO.
  2. Um exame modificado será conduzido por
     pessoal autorizado apenas do Projeto HARVEST.
  3. Todas as amostras de tecido são classificadas e devem ser
     transferidas para instalação [REDACTED].
  4. O relatório oficial de autópsia declarará:
     "Causa da morte: Insuficiência respiratória
      secundária a complicações de pneumonia."
  5. Nenhuma cópia das constatações reais será mantida
     no hospital ou necrotério municipal.
  JUSTIFICATIVA:
    A exposição do sujeito ao espécime de fauna recuperado
    resultou em contaminação de natureza desconhecida.
    Achados patológicos podem comprometer operações
    contínuas de contenção se divulgados.
    O patógeno anômalo deve ser estudado apenas sob
    condições controladas.
  NOTA DE SEGURANÇA:
    Qualquer pessoal médico que tenha observado a condição real
    do falecido deve ser interrogado imediatamente
    sob o Protocolo SOMBRA.
    Assinaturas de NDA são exigidas de todas as partes.
  `,
  `
  DIRECTIVA — SUPRESIÓN DE AUTOPSIA
  FECHA: 16-FEB-1996
  CLASIFICACIÓN: ALTO SECRETO
  RE: Restos del cabo fallecido
  Por autoridad de [REDACTED], la siguiente directiva
  entra en vigor de INMEDIATO:
  1. El procedimiento estándar de autopsia queda CANCELADO.
  2. Un examen modificado será realizado por
     personal autorizado únicamente del Proyecto HARVEST.
  3. Todas las muestras de tejido están clasificadas y deben ser
     transferidas a instalación [REDACTED].
  4. El informe oficial de autopsia indicará:
     "Causa de muerte: Insuficiencia respiratoria
      secundaria a complicaciones de neumonía."
  5. No se conservará ninguna copia de los hallazgos reales
     en el hospital ni en la morgue municipal.
  JUSTIFICACIÓN:
    La exposición del sujeto al espécimen de fauna recuperado
    resultó en contaminación de naturaleza desconocida.
    Los hallazgos patológicos podrían comprometer operaciones
    de contención en curso si fueran divulgados.
    El patógeno anómalo debe estudiarse solo bajo
    condiciones controladas.
  NOTA DE SEGURIDAD:
    Cualquier personal médico que haya observado la condición real
    del fallecido debe ser interrogado de inmediato
    bajo Protocolo SOMBRA.
    Se requieren firmas de NDA de todas las partes.
  `
);

registerLines(
  expansionData.family_compensation.content,
  `
  ACORDO DE COMPENSAÇÃO — FAMÍLIA DO OFICIAL
  DATA: 20-FEB-1996
  CLASSIFICAÇÃO: RESTRITA
  BENEFICIÁRIOS:
    Esposa: [REDACTED]
    Filhos: 2 (idades 7 e 4)
  BENEFÍCIOS OFICIAIS (Padrão):
    - Pensão por morte em serviço
    - Pagamento de seguro de vida
    - Benefícios educacionais para os filhos
    Total oficial: R$ 45.000,00
  COMPENSAÇÃO SUPLEMENTAR (Classificada):
    Finalidade: Garantir o silêncio da família sobre as
               circunstâncias da morte.
    Pagamento inicial: R$ 50.000,00 (em dinheiro)
    Subsídio mensal: R$ 2.000,00 (5 anos)
    Moradia: Apartamento (quitado, Belo Horizonte)
    Emprego: Cargo governamental para a esposa
    Total suplementar: ~R$ 220.000,00
  CONDIÇÕES:
    - Família concorda com a narrativa da "pneumonia"
    - Nenhuma entrevista à imprensa (nunca)
    - Nenhuma ação judicial contra o governo
    - Saída de Varginha (em 30 dias)
    - Nenhum contato com investigadores de UFO
    Assinado: [ESPOSA DO OFICIAL], 20-FEB-1996
  NOTA: Família mudou-se para Belo Horizonte em 15-MAR-1996
        Monitoramento: Baixa prioridade (cooperativa)
  `,
  `
  ACUERDO DE COMPENSACIÓN — FAMILIA DEL OFICIAL
  FECHA: 20-FEB-1996
  CLASIFICACIÓN: RESTRINGIDA
  BENEFICIARIOS:
    Esposa: [REDACTED]
    Hijos: 2 (edades 7 y 4)
  BENEFICIOS OFICIALES (Estándar):
    - Pensión por muerte en servicio
    - Pago de seguro de vida
    - Beneficios educativos para los hijos
    Total oficial: R$ 45.000,00
  COMPENSACIÓN SUPLEMENTARIA (Clasificada):
    Propósito: Garantizar el silencio de la familia sobre las
               circunstancias de la muerte.
    Pago inicial: R$ 50.000,00 (efectivo)
    Estipendio mensual: R$ 2.000,00 (5 años)
    Vivienda: Apartamento (pagado, Belo Horizonte)
    Empleo: Puesto gubernamental para la esposa
    Total suplementario: ~R$ 220.000,00
  CONDICIONES:
    - La familia acepta la narrativa de "neumonía"
    - Ninguna entrevista con medios (jamás)
    - Ninguna acción legal contra el gobierno
    - Reubicación desde Varginha (dentro de 30 días)
    - Ningún contacto con investigadores UFO
    Firmado: [ESPOSA DEL OFICIAL], 20-FEB-1996
  NOTA: La familia se mudó a Belo Horizonte el 15-MAR-1996
        Monitoreo: Baja prioridad (cooperativa)
  `
);

registerLines(
  expansionData.coffee_harvest_report.content,
  `
  RELATÓRIO ECONÔMICO REGIONAL — SETOR CAFEEIRO
  PERÍODO: Q1 1996
  REGIÃO: Sul de Minas
  CONDIÇÕES DE MERCADO:
    A região cafeeira do Sul de Minas continua sendo a
    principal zona produtora de arábica do Brasil.
    Safra atual: PROGREDINDO NORMALMENTE
    Produção esperada: 2,3 milhões de sacas
    Avaliação de qualidade: ACIMA DA MÉDIA
  INDICADORES DE PREÇO:
    Bolsa de Commodities de Nova York: US$ 1,42/lb (média jan)
    Preço da cooperativa local: R$ 85,00/saca
    Tendência: ESTÁVEL com leve pressão de alta
  NOTAS REGIONAIS:
    - Varginha segue como centro logístico da região
    - Capacidade ferroviária adequada ao volume atual
    - Processamento normal da documentação de exportação
  MÃO DE OBRA:
    - Trabalhadores sazonais chegando conforme previsto
    - Nenhum conflito significativo relatado
  AVALIAÇÃO:
    Operação do setor cafeeiro NORMAL.
    Nenhuma anomalia econômica detectada.
  `,
  `
  INFORME ECONÓMICO REGIONAL — SECTOR CAFETERO
  PERÍODO: Q1 1996
  REGIÓN: Sul de Minas
  CONDICIONES DE MERCADO:
    La región cafetera de Sul de Minas sigue siendo la
    principal zona productora de arábica de Brasil.
    Cosecha actual: PROGRESANDO NORMALMENTE
    Rendimiento esperado: 2,3 millones de sacos
    Evaluación de calidad: POR ENCIMA DEL PROMEDIO
  INDICADORES DE PRECIO:
    Bolsa de Commodities de Nueva York: US$ 1,42/lb (prom. ene)
    Precio de la cooperativa local: R$ 85,00/saco
    Tendencia: ESTABLE con ligera presión alcista
  NOTAS REGIONALES:
    - Varginha sigue siendo el centro logístico de la región
    - Capacidad ferroviaria adecuada para el volumen actual
    - Procesamiento normal de documentación de exportación
  MANO DE OBRA:
    - Trabajadores estacionales llegando según lo previsto
    - No se reportan disputas significativas
  EVALUACIÓN:
    Operación del sector cafetero NORMAL.
    No se detectaron anomalías económicas.
  `
);

registerLines(
  expansionData.weather_report_jan96.content,
  `
  RESUMO METEOROLÓGICO — JANEIRO DE 1996
  ESTAÇÃO: Varginha Regional
  COORDENADAS: 21°33'S, 45°26'W
  RESUMO:
    Janeiro de 1996 apresentou padrões típicos de verão
    para a região do Sul de Minas.
  DATAS-CHAVE:
    19-JAN-1996:
      Temperatura: 28°C (máx.) / 18°C (mín.)
      Precipitação: 12 mm
      Cobertura de nuvens: Parcial (40%)
      Vento: NE, 15-20 km/h
      ESPECIAL: Céu limpo após 22:00
    20-JAN-1996:
      Temperatura: 31°C (máx.) / 19°C (mín.)
      Precipitação: 0 mm
      Cobertura de nuvens: Mínima (15%)
      Vento: Calmo
      ESPECIAL: Excelente visibilidade
    21-JAN-1996:
      Temperatura: 29°C (máx.) / 17°C (mín.)
      Precipitação: 8 mm (à noite)
      Cobertura de nuvens: Formação à tarde
      Vento: Variável
  NOTA: Nenhum fenômeno atmosférico incomum registrado.
        Condições normais de verão para a região.
  `,
  `
  RESUMEN METEOROLÓGICO — ENERO DE 1996
  ESTACIÓN: Varginha Regional
  COORDENADAS: 21°33'S, 45°26'W
  RESUMEN:
    Enero de 1996 exhibió patrones típicos de verano
    para la región de Sul de Minas.
  FECHAS CLAVE:
    19-JAN-1996:
      Temperatura: 28°C (máx.) / 18°C (mín.)
      Precipitación: 12 mm
      Cobertura nubosa: Parcial (40%)
      Viento: NE, 15-20 km/h
      ESPECIAL: Cielo despejado después de las 22:00
    20-JAN-1996:
      Temperatura: 31°C (máx.) / 19°C (mín.)
      Precipitación: 0 mm
      Cobertura nubosa: Mínima (15%)
      Viento: Calma
      ESPECIAL: Excelente visibilidad
    21-JAN-1996:
      Temperatura: 29°C (máx.) / 17°C (mín.)
      Precipitación: 8 mm (tarde)
      Cobertura nubosa: En aumento por la tarde
      Viento: Variable
  NOTA: No se registraron fenómenos atmosféricos inusuales.
        Condiciones normales de verano para la región.
  `
);

registerLines(
  expansionData.local_politics_memo.content,
  `
  RESUMO POLÍTICO — MUNICÍPIO DE VARGINHA
  DATA: 15-JAN-1996
  AVALIAÇÃO DE ROTINA
  ADMINISTRAÇÃO ATUAL:
    Prefeito: [REDACTED]
    Partido: PMDB
    Mandato: 1993-1996 (último ano)
  CLIMA POLÍTICO:
    - Eleições municipais programadas para outubro de 1996
    - Aprovação da atual administração: MODERADA
    - Nenhuma controvérsia significativa
  DESENVOLVIMENTOS NOTÁVEIS:
    - Projetos de infraestrutura dentro do cronograma
    - Relações com a cooperativa cafeeira estáveis
    - Expansão hospitalar aprovada
    - Matrículas escolares em crescimento
  PREOCUPAÇÕES DE SEGURANÇA:
    - Pequena criminalidade: Dentro dos parâmetros normais
    - Crime organizado: Nenhuma presença detectada
    - Agitação trabalhista: Nenhuma
  AVALIAÇÃO:
    Região politicamente estável.
    Nenhuma prioridade de monitoramento.
  `,
  `
  RESUMEN POLÍTICO — MUNICIPIO DE VARGINHA
  FECHA: 15-JAN-1996
  EVALUACIÓN DE RUTINA
  ADMINISTRACIÓN ACTUAL:
    Alcalde: [REDACTED]
    Partido: PMDB
    Mandato: 1993-1996 (último año)
  CLIMA POLÍTICO:
    - Elecciones municipales programadas para octubre de 1996
    - Aprobación de la administración actual: MODERADA
    - Ninguna controversia significativa
  DESARROLLOS NOTABLES:
    - Proyectos de infraestructura dentro del calendario
    - Relaciones con la cooperativa cafetera estables
    - Expansión hospitalaria aprobada
    - Matrícula escolar en aumento
  PREOCUPACIONES DE SEGURIDAD:
    - Delincuencia menor: Dentro de parámetros normales
    - Crimen organizado: No se detecta presencia
    - Conflictividad laboral: Ninguna
  EVALUACIÓN:
    Región políticamente estable.
    Ninguna prioridad de monitoreo.
  `
);

registerLines(
  expansionData.municipal_budget_96.content,
  `
  ALOCAÇÃO DO ORÇAMENTO MUNICIPAL — 1996
  PREFEITURA DE VARGINHA
  RECEITA PROJETADA: R$ 42.500.000,00
  ALOCAÇÃO POR SETOR:
    Educação ................ 28% (R$ 11.900.000)
    Saúde ................... 22% (R$  9.350.000)
    Infraestrutura .......... 18% (R$  7.650.000)
    Segurança Pública ....... 12% (R$  5.100.000)
    Administração ........... 10% (R$  4.250.000)
    Cultura e Esportes ......  5% (R$  2.125.000)
    Reserva .................  5% (R$  2.125.000)
  PROJETOS ESPECIAIS:
    - Expansão da ala hospitalar (Fase 2)
    - Programa de renovação escolar
    - Manutenção viária (Rota 381)
    - Melhorias no zoológico municipal
  STATUS: Aprovado pela Câmara Municipal, 18-DEC-1995
  `,
  `
  ASIGNACIÓN DEL PRESUPUESTO MUNICIPAL — 1996
  PREFECTURA DE VARGINHA
  INGRESOS PROYECTADOS: R$ 42.500.000,00
  ASIGNACIÓN POR SECTOR:
    Educación ............... 28% (R$ 11.900.000)
    Salud ................... 22% (R$  9.350.000)
    Infraestructura ......... 18% (R$  7.650.000)
    Seguridad Pública ....... 12% (R$  5.100.000)
    Administración .......... 10% (R$  4.250.000)
    Cultura y Deportes ......  5% (R$  2.125.000)
    Reserva .................  5% (R$  2.125.000)
  PROYECTOS ESPECIALES:
    - Expansión del ala hospitalaria (Fase 2)
    - Programa de renovación escolar
    - Mantenimiento vial (Ruta 381)
    - Mejoras del zoológico municipal
  ESTADO: Aprobado por el Concejo Municipal, 18-DEC-1995
  `
);

registerLines(
  expansionData.railroad_schedule.content,
  `
  TRÁFEGO FERROVIÁRIO — ESTAÇÃO DE VARGINHA
  CRONOGRAMA: JANEIRO DE 1996
  SERVIÇO REGULAR DE CARGA:
    Seg-Sex 06:00 — Carga de café (sentido sul)
    Seg-Sex 14:00 — Bens industriais (sentido norte)
    Ter-Qui 22:00 — Carga noturna
  MOVIMENTOS ESPECIAIS:
    20-JAN 03:30 — MILITAR (classificado)
                   Autorização: Comando Regional
                   Vagões: 3 (carga coberta)
                   Destino: Campinas
    21-JAN 01:15 — MILITAR (classificado)
                   Autorização: Comando Regional
                   Vagões: 1 (refrigerado)
                   Destino: São Paulo
  NOTA: Movimentações militares não estão sujeitas a
        protocolos padrão de agendamento.
  `,
  `
  TRÁFICO FERROVIARIO — ESTACIÓN DE VARGINHA
  HORARIO: ENERO DE 1996
  SERVICIO REGULAR DE CARGA:
    Lun-Vie 06:00 — Carga de café (hacia el sur)
    Lun-Vie 14:00 — Bienes industriales (hacia el norte)
    Mar-Jue 22:00 — Carga nocturna
  MOVIMIENTOS ESPECIALES:
    20-JAN 03:30 — MILITAR (clasificado)
                   Autorización: Comando Regional
                   Vagones: 3 (carga cubierta)
                   Destino: Campinas
    21-JAN 01:15 — MILITAR (clasificado)
                   Autorización: Comando Regional
                   Vagones: 1 (refrigerado)
                   Destino: São Paulo
  NOTA: Los movimientos militares no están sujetos a
        protocolos estándar de programación.
  `
);

registerLines(
  expansionData.fire_department_log.content,
  `
  CORPO DE BOMBEIROS — REGISTRO DE INCIDENTES
  ESTAÇÃO: Varginha Central
  PERÍODO: 15-25 JAN 1996
  15-JAN 14:22 — Incêndio em vegetação, Rota 381 km 42
                 Causa: Cigarro
                 Resolvido: 15:45
  17-JAN 09:15 — Alarme de fumaça, Hospital Regional
                 Causa: Curto elétrico
                 Resolvido: 10:00
  18-JAN 21:30 — Incêndio de veículo, centro
                 Causa: Falha no motor
                 Resolvido: 22:15
  20-JAN 16:45 — [REDACTED]
                 Local: Jardim Andere
                 Autorização: Polícia Militar
                 Resolvido: [CLASSIFIED]
  20-JAN 23:00 — [REDACTED]
                 Local: [CLASSIFIED]
                 Autorização: Comando Regional
                 Resolvido: [CLASSIFIED]
  22-JAN 11:30 — Incêndio de cozinha, residencial
                 Causa: Óleo de cozinha
                 Resolvido: 11:50
  24-JAN 16:00 — Alarme falso, escola
                 Causa: Pegadinha de estudante
                 Resolvido: 16:15
  `,
  `
  CUERPO DE BOMBEROS — REGISTRO DE INCIDENTES
  ESTACIÓN: Varginha Central
  PERÍODO: 15-25 JAN 1996
  15-JAN 14:22 — Incendio de pastizal, Ruta 381 km 42
                 Causa: Cigarrillo
                 Resuelto: 15:45
  17-JAN 09:15 — Alarma de humo, Hospital Regional
                 Causa: Cortocircuito eléctrico
                 Resuelto: 10:00
  18-JAN 21:30 — Incendio de vehículo, centro
                 Causa: Fallo del motor
                 Resuelto: 22:15
  20-JAN 16:45 — [REDACTED]
                 Ubicación: Jardim Andere
                 Autorización: Policía Militar
                 Resuelto: [CLASSIFIED]
  20-JAN 23:00 — [REDACTED]
                 Ubicación: [CLASSIFIED]
                 Autorización: Comando Regional
                 Resuelto: [CLASSIFIED]
  22-JAN 11:30 — Incendio de cocina, residencial
                 Causa: Aceite de cocina
                 Resuelto: 11:50
  24-JAN 16:00 — Falsa alarma, escuela
                 Causa: Broma estudiantil
                 Resuelto: 16:15
  `
);

// Narrative content

registerLines(
  narrativeData.ufo74_identity_file.content,
  `
  ARQUIVO PESSOAL - CÓPIA LEGADA LACRADA
  PROPRIETÁRIO: DESCONHECIDO
  [TEXTO RECUPERADO DISPONÍVEL VIA ABERTURA DIRETA]
  O antigo bloqueio por senha foi aposentado nesta versão.
  O aviso de transferência ainda explica quem deixou isto para trás.
  `,
  `
  ARCHIVO PERSONAL - COPIA LEGADA SELLADA
  PROPIETARIO: DESCONOCIDO
  [TEXTO RECUPERADO DISPONIBLE MEDIANTE APERTURA DIRECTA]
  La antigua barrera de contraseña fue retirada en esta versión.
  El aviso de transferencia todavía explica quién dejó esto atrás.
  `
);

registerLines(
  narrativeData.ufo74_identity_file.decryptedFragment!,
  `
  ARQUIVO PESSOAL - SÓ PARA MEUS OLHOS
  SE VOCÊ ESTÁ LENDO ISSO, ENCONTROU MEU SEGREDO
  Meu nome é Carlos Eduardo Ferreira.
  Em janeiro de 1996, eu era 2º Tenente da Força Aérea Brasileira.
  Eu tinha 23 anos.
  Eu estava lá quando aconteceu.
  Eu processei os relatórios iniciais de Varginha.
  Vi as fotografias antes de serem classificadas.
  Li as anotações originais de campo.
  E vi o que fizeram para silenciar as testemunhas.
  Passei 30 anos construindo este arquivo.
  Esperando por alguém corajoso o bastante para encontrar a verdade.
  Se você está lendo isto, essa pessoa é você.
  O ser que eu vi... olhou para mim.
  Não com medo. Com entendimento.
  Sabia o que faríamos.
  Nunca mais fui o mesmo.
  Meu indicativo era UFO74.
  Agora você sabe quem eu realmente sou.
  >> ESTE ARQUIVO ACIONA O FINAL SECRETO <<
  `,
  `
  ARCHIVO PERSONAL - SOLO PARA MIS OJOS
  SI ESTÁS LEYENDO ESTO, ENCONTRASTE MI SECRETO
  Mi nombre es Carlos Eduardo Ferreira.
  En enero de 1996, yo era 2.º Teniente de la Fuerza Aérea Brasileña.
  Tenía 23 años.
  Yo estaba allí cuando ocurrió.
  Procesé los informes iniciales de Varginha.
  Vi las fotografías antes de que fueran clasificadas.
  Leí las notas de campo originales.
  Y vi lo que hicieron para silenciar a los testigos.
  Pasé 30 años construyendo este archivo.
  Esperando a alguien lo bastante valiente para encontrar la verdad.
  Si estás leyendo esto, esa persona eres tú.
  El ser que vi... me miró.
  No con miedo. Con comprensión.
  Sabía lo que haríamos.
  Nunca volví a ser el mismo.
  Mi distintivo era UFO74.
  Ahora sabes quién soy en realidad.
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
  NOTAS DO ADMINISTRADOR DO SISTEMA - CONFIDENCIAL
  Notas da última janela de manutenção (1995-12-15):
  1. O sistema legado de recuperação ainda funciona.
     Comando: "recover <filename>" para tentar restaurar arquivo.
     Pode restaurar parcialmente arquivos corrompidos ou apagados.
  2. O utilitário de rastreamento de rede permanece ativo.
     Comando: "trace" mostra conexões ativas.
     Útil para auditorias de segurança.
  3. Procedimento de desconexão de emergência:
     Comando: "disconnect" força encerramento imediato da sessão.
     AVISO: Todo trabalho não salvo será perdido.
  4. Utilitário de varredura profunda:
     Comando: "scan" revela arquivos ocultos ou de sistema.
     Requer acesso de administrador.
  ADMINISTRADOR: J.M.S.
  `,
  `
  NOTAS DEL ADMINISTRADOR DEL SISTEMA - CONFIDENCIAL
  Notas de la última ventana de mantenimiento (1995-12-15):
  1. El sistema heredado de recuperación sigue funcionando.
     Comando: "recover <filename>" para intentar restaurar un archivo.
     Puede restaurar parcialmente archivos corruptos o eliminados.
  2. La utilidad de rastreo de red sigue activa.
     Comando: "trace" muestra conexiones activas.
     Útil para auditorías de seguridad.
  3. Procedimiento de desconexión de emergencia:
     Comando: "disconnect" fuerza la terminación inmediata de la sesión.
     ADVERTENCIA: Todo trabajo no guardado se perderá.
  4. Utilidad de escaneo profundo:
     Comando: "scan" revela archivos ocultos o del sistema.
     Requiere acceso de administrador.
  ADMINISTRADOR: J.M.S.
  `
);

registerLines(
  narrativeData.personnel_transfer_extended.content,
  `
  AUTORIZAÇÃO DE TRANSFERÊNCIA DE PESSOAL
  ID DO DOCUMENTO: PTA-1996-0120
  SOLICITAÇÃO DE TRANSFERÊNCIA:
    DE: Base Aérea de Guarulhos
    PARA: [REDACTED]
  PESSOAL:
    2º Ten. C.E.F.
    Classificação: ANALISTA
    Nível de acesso: RESTRITO → CLASSIFICADO
  MOTIVO DA TRANSFERÊNCIA:
    O sujeito demonstrou aptidão excepcional durante o
    processamento do incidente. Recomendado para projetos especiais.
  CÓDIGO DE AUTORIZAÇÃO: varginha1996
  APROVADO POR:
    Cel. [REDACTED]
    Chefe de Divisão, Operações Especiais
  NOTA: Este código pode ser usado para acesso seguro a arquivos.
  `,
  `
  AUTORIZACIÓN DE TRANSFERENCIA DE PERSONAL
  ID DEL DOCUMENTO: PTA-1996-0120
  SOLICITUD DE TRANSFERENCIA:
    DE: Base Aérea de Guarulhos
    A: [REDACTED]
  PERSONAL:
    2.º Tte. C.E.F.
    Clasificación: ANALISTA
    Nivel de autorización: RESTRINGIDO → CLASIFICADO
  MOTIVO DE LA TRANSFERENCIA:
    El sujeto demostró aptitud excepcional durante el
    procesamiento del incidente. Recomendado para proyectos especiales.
  CÓDIGO DE AUTORIZACIÓN: varginha1996
  APROBADO POR:
    Cnel. [REDACTED]
    Jefe de División, Operaciones Especiales
  NOTA: Este código puede usarse para acceso seguro a archivos.
  `
);

registerLines(
  narrativeData.official_summary_report.content,
  `
  RESUMO OFICIAL DO INCIDENTE
  RECUPERAÇÃO DE EQUIPAMENTO — JANEIRO DE 1996
  CLASSIFICAÇÃO: VERSÃO PARA DIVULGAÇÃO PÚBLICA
  RESUMO:
    Em 20 de janeiro de 1996, equipes de recuperação responderam a
    relatos de destroços na área do Jardim Andere após
    condições severas de tempo durante a madrugada.
  CONCLUSÕES OFICIAIS:
    Após investigação minuciosa, as autoridades concluíram que
    os destroços se originaram de:
    1. Uma estação de monitoramento meteorológico danificada durante uma tempestade.
    2. Materiais de construção deslocados por ventos fortes.
    3. Uma antena de telecomunicações caída de uma torre próxima.
  ENVOLVIMENTO MILITAR:
    Relatos de atividade de comboio militar foram confirmados como
    exercícios rotineiros de treinamento sem relação com os destroços.
  INCIDENTES HOSPITALARES:
    Nenhum incidente hospitalar foi registrado em conexão
    com a operação de recuperação.
  `,
  `
  RESUMEN OFICIAL DEL INCIDENTE
  RECUPERACIÓN DE EQUIPO — ENERO DE 1996
  CLASIFICACIÓN: VERSIÓN DE DIVULGACIÓN PÚBLICA
  RESUMEN:
    El 20 de enero de 1996, equipos de recuperación respondieron a
    reportes de escombros en el área de Jardim Andere tras
    severas condiciones meteorológicas durante la noche.
  HALLAZGOS OFICIALES:
    Tras una investigación exhaustiva, las autoridades concluyeron que
    los escombros provenían de:
    1. Una estación de monitoreo meteorológico dañada durante una tormenta.
    2. Materiales de construcción desplazados por fuertes vientos.
    3. Una antena de telecomunicaciones caída de una torre cercana.
  PARTICIPACIÓN MILITAR:
    Los reportes de actividad de convoy militar fueron confirmados como
    ejercicios rutinarios de entrenamiento no relacionados con los escombros.
  INCIDENTES HOSPITALARIOS:
    No se registraron incidentes hospitalarios en conexión
    con la operación de recuperación.
  `
);

registerLines(
  narrativeData.cipher_message.content,
  `
  TRANSMISSÃO INTERCEPTADA - CODIFICADA
  DATA: 1996-01-21 03:47:00
  CIFRA: ROT13
  MENSAGEM CODIFICADA:
    Pneqb genafresrq.
    Qrfgvangvba pbasvezrq.
    Njnvgvat vafgehpgvbaf.
  Aplique a nota sobre ROT13 acima para decodificar a mensagem.
  O antigo invólucro de descriptografia não é mais necessário.
  `,
  `
  TRANSMISIÓN INTERCEPTADA - CODIFICADA
  FECHA: 1996-01-21 03:47:00
  CIFRADO: ROT13
  MENSAJE CODIFICADO:
    Pneqb genafresrq.
    Qrfgvangvba pbasvezrq.
    Njnvgvat vafgehpgvbaf.
  Aplica la nota de ROT13 de arriba para decodificar el mensaje.
  La antigua envoltura de descifrado ya no es necesaria.
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
    Esta transmissão confirma a transferência de materiais
    recuperados para uma instalação secundária.
    Local: Centro logístico não revelado.
  >> COMUNICAÇÃO ROTINEIRA DE CADEIA DE SUPRIMENTOS <<
  `,
  `
  TRANSMISIÓN DECODIFICADA
  FECHA: 1996-01-21 03:47:00
  MENSAJE DECODIFICADO:
    Carga transferida.
    Destino confirmado.
    En espera de instrucciones.
  ANÁLISIS:
    Esta transmisión confirma la transferencia de materiales
    recuperados a una instalación secundaria.
    Ubicación: Centro logístico no revelado.
  >> COMUNICACIÓN RUTINARIA DE CADENA DE SUMINISTRO <<
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
  SITE 7, SUBNÍVEL 4 — CLASSIFICAÇÃO: ULTRA
  21 DE JANEIRO DE 1996
  O sujeito chegou às 03h40 do local de recuperação de Jardim Andere.
  Terreno baldio ao sul da Rua Suíça. Terceiro espécime do
  evento de Varginha. Designação: ALPHA.
  Os outros dois não sobreviveram ao transporte. Um expirou no
  Hospital Regional, o outro na ESA. Falha biológica padrão
  sob estresse de contenção. Resultado esperado.
  ALPHA é diferente.
  Avaliação inicial:
    Altura: 1,6 m (em pé)
    Textura dérmica: Secreção oleosa marrom-escura
    Crânio: Três cristas ósseas proeminentes, anteroposteriores
    Olhos: Superdimensionados, vermelho-escuros, sem esclera visível
    Odor: Descarga persistente de amônia
    Temperatura central: 14,3°C
    Respiração: Nenhuma
    Atividade cardíaca: Nenhuma
    Amplitude de onda theta no EEG: 847 µV
    (Base humana: 12 µV)
  Os números não se conciliam. Sem respiração. Sem pulso.
  Nenhuma função metabólica mensurável. Por qualquer padrão
  clínico, ALPHA está morto.
  Mas o EEG é sustentado. Não residual. Não decai.
  Estruturado. Persistente. 847 µV de atividade neural
  organizada em um corpo que não está vivo.
  Cataloguei isso como uma anomalia. Nada mais.
  Amostras de tecido coletadas. A contenção é uma
  bioisolação padrão, Tipo III.
  Cheira a amônia e a outra coisa.
  Algo que não consigo nomear.
  25 DE JANEIRO DE 1996
  Quatro dias de monitoramento contínuo de EEG. Os padrões
  não são ruído. Eles têm estrutura hierárquica —
  motivos repetidos aninhados dentro de sequências maiores.
  Se eu visse isso em um cérebro humano, chamaria de
  linguagem. Mas não há atividade cerebral. Não há
  função cerebral. Apenas a onda.
  Sgt. Oliveira relatou sentir-se "observado" durante o
  turno da noite. Eu disse a ele que eram os vapores de amônia.
  Eu mesmo não acredito na minha explicação.
  28 DE JANEIRO DE 1996
  Os padrões mudaram hoje. Um novo motivo apareceu —
  sustentado, direcional. Como se o sinal tivesse adquirido um
  alvo. O pessoal de monitoramento relatou imagética
  involuntária: um campo de estrelas. Constelações que nenhum deles
  reconheceu.
  O Sgt. Oliveira disse que parecia "uma mensagem para casa".
  Reduzi as rotações da guarda para turnos de 4 horas.
  1 DE FEVEREIRO DE 1996
  Enviei um pedido formal de interface psi-comm
  ao depósito de São Paulo. Negado. Orçamento.
  Enviaram-me aqui para estudar o espécime biológico
  mais significativo da história humana e negam
  equipamento por causa de orçamento.
  Vou construí-lo eu mesmo. Os salvados do local da queda em Andere
  incluem componentes que posso reaproveitar.
  2 DE FEVEREIRO DE 1996
  Pico anômalo de atividade às 03h00. A amplitude do EEG
  triplicou por onze segundos. Coincidiu exatamente com
  uma tentativa não autorizada de acesso remoto ao nosso
  servidor de arquivos. IP externo — redigido pela segurança.
  ALPHA reagiu a alguém acessando arquivos. De fora
  da instalação. Enquanto clinicamente morto.
  Não durmo mais bem. O cheiro de amônia
  me segue até meus aposentos. Não deveria alcançar tão
  longe. O sistema de ventilação confirma que não alcança.
  Classificação: ULTRA — Só para os olhos
  `,
  `
  DIARIO DE CAMPO — MAY. M.A. FERREIRA
  CPEX — CENTRO DE INVESTIGACIÓN EXOBIOLÓGICA
  SITIO 7, SUBNIVEL 4 — CLASIFICACIÓN: ULTRA
  21 DE ENERO DE 1996
  El sujeto llegó a las 03:40 desde el sitio de recuperación de Jardim Andere.
  Lote baldío al sur de Rua Suíça. Tercer espécimen del
  evento de Varginha. Designado: ALPHA.
  Los otros dos no sobrevivieron al transporte. Uno expiró en
  Hospital Regional, el otro en ESA. Falla biológica estándar
  bajo estrés de contención. Resultado esperado.
  ALPHA es diferente.
  Evaluación inicial:
    Altura: 1,6 m (de pie)
    Textura dérmica: Secreción aceitosa marrón oscura
    Cráneo: Tres crestas óseas prominentes, anteroposteriores
    Ojos: Sobredimensionados, rojo oscuro, sin esclerótica visible
    Olor: Descarga persistente de amoníaco
    Temperatura central: 14,3°C
    Respiración: Ninguna
    Actividad cardíaca: Ninguna
    Amplitud de onda theta en EEG: 847 µV
    (Línea base humana: 12 µV)
  Las cifras no encajan. Sin respiración. Sin pulso.
  Sin función metabólica medible. Bajo cualquier estándar
  clínico, ALPHA está muerto.
  Pero el EEG se mantiene. No residual. No está decayendo.
  Estructurado. Persistente. 847 µV de actividad neural
  organizada en un cuerpo que no está vivo.
  Lo he catalogado como una anomalía. Nada más.
  Muestras de tejido recolectadas. La contención es una
  bioaislación estándar, Tipo III.
  Huele a amoníaco y a otra cosa.
  Algo que no puedo nombrar.
  25 DE ENERO DE 1996
  Cuatro días de monitoreo continuo de EEG. Los patrones
  no son ruido. Tienen estructura jerárquica —
  motivos repetidos anidados dentro de secuencias mayores.
  Si viera esto en un cerebro humano, lo llamaría
  lenguaje. Pero no hay actividad cerebral. No hay
  función cerebral. Solo la onda.
  El Sgto. Oliveira informó sentirse "observado" durante el
  turno nocturno. Le dije que eran los vapores de amoníaco.
  No creo en mi propia explicación.
  28 DE ENERO DE 1996
  Los patrones cambiaron hoy. Apareció un nuevo motivo —
  sostenido, direccional. Como si la señal hubiera adquirido un
  objetivo. El personal de monitoreo reportó imaginería
  involuntaria: un campo estelar. Constelaciones que ninguno de ellos
  reconoció.
  El Sgto. Oliveira dijo que se sintió "como un mensaje a casa".
  Reduje las rotaciones de guardia a turnos de 4 horas.
  1 DE FEBRERO DE 1996
  Presenté una solicitud formal de interfaz psi-comm
  al depósito de São Paulo. Denegada. Presupuesto.
  Me enviaron aquí a estudiar el espécimen biológico
  más significativo de la historia humana y me niegan
  equipo por presupuesto.
  La construiré yo mismo. Los restos rescatados del sitio del choque en Andere
  incluyen componentes que puedo reutilizar.
  2 DE FEBRERO DE 1996
  Pico anómalo de actividad a las 03:00. La amplitud del EEG
  se triplicó durante once segundos. Coincidió exactamente con
  un intento no autorizado de acceso remoto a nuestro
  servidor de archivos. IP externa — redactada por seguridad.
  ALPHA reaccionó a alguien accediendo a archivos. Desde fuera
  de la instalación. Mientras estaba clínicamente muerto.
  Ya no duermo bien. El olor a amoníaco
  me sigue hasta mis habitaciones. No debería llegar tan
  lejos. El sistema de ventilación confirma que no.
  Clasificación: ULTRA — Solo para ojos autorizados
  `
);

registerLines(
  alphaData.alpha_neural_connection.content,
  `
  DIÁRIO DE CAMPO — MAJ. M.A. FERREIRA
  CPEX — SITE 7, SUBNÍVEL 4
  CLASSIFICAÇÃO: ULTRA
  5 DE FEVEREIRO DE 1996
  O dispositivo funciona.
  Conectei às 22h00. Sozinho. A lacuna na rotação da guarda
  me dá catorze minutos. O bastante. Mais do que
  o bastante. Catorze minutos pareceram horas.
  Isto não é comunicação. Comunicação implica duas
  entidades separadas trocando informações. Isto é
  outra coisa. Um segundo conjunto de pensamentos que
  chegam já compreendidos. Sem palavras. Sem tradução.
  Conceitos que se desdobram dentro da sua própria mente como se
  sempre estivessem ali.
  ALPHA não está morto. ALPHA está em outro lugar.
  O corpo na câmara é uma antena.
  8 DE FEVEREIRO DE 1996
  Terceira sessão. Parei de registrar oficialmente as sessões.
  Se o comando soubesse o que estou fazendo,
  me tirariam daqui. Não posso permitir isso. Ainda não.
  ALPHA sabe de coisas que não deveria saber.
  Mudanças de cronograma. Transferências de pessoal. Coisas decididas
  em salas três andares acima da unidade de contenção.
  Esta noite, disse um nome.
  Luísa.
  Minha filha. Ela tem sete anos. Mora em Campinas
  com a mãe. Não falei dela aqui.
  Não pensei nela durante as sessões.
  Ou — acredito que não pensei.
  Como sabe o nome dela?
    ALERTA DE CONTENÇÃO:
    Protocolo de liberação de emergência disponível via
    terminal administrativo. Código: RELEASE ALPHA
    AVISO: Liberação não autorizada acionará
    bloqueio imediato da instalação.
  10 DE FEVEREIRO DE 1996
  Não consigo determinar a direção do fluxo de
  informação. Quando me conecto, estou lendo ALPHA? Ou
  ALPHA está me lendo? A distinção pareceu importante
  um dia. Não parece mais.
  Projetou um conceito que só consigo descrever como
  "trinta rotações." Uma contagem regressiva. Para quê, ele não
  diz. Ou não pode. Ou a resposta já está na
  minha cabeça e eu ainda não estou pronto para encontrá-la.
  O sargento da PM que tocou ALPHA durante a recuperação
  morreu hoje. Colapso sistêmico do sistema imune. Causa
  oficial: pneumonia. Não havia nada de pneumônico
  na morte dele.
  Classificação: ULTRA — Só para os olhos
  `,
  `
  DIARIO DE CAMPO — MAY. M.A. FERREIRA
  CPEX — SITIO 7, SUBNIVEL 4
  CLASIFICACIÓN: ULTRA
  5 DE FEBRERO DE 1996
  El dispositivo funciona.
  Me conecté a las 22:00. Solo. La brecha en la rotación de guardia
  me da catorce minutos. Suficiente. Más que
  suficiente. Catorce minutos se sintieron como horas.
  Esto no es comunicación. La comunicación implica dos
  entidades separadas intercambiando información. Esto es
  otra cosa. Un segundo conjunto de pensamientos que
  llega ya comprendido. Sin palabras. Sin traducción.
  Conceptos que se despliegan dentro de tu propia mente como si
  siempre hubieran estado allí.
  ALPHA no está muerto. ALPHA está en otra parte.
  El cuerpo en la cámara es una antena.
  8 DE FEBRERO DE 1996
  Tercera sesión. He dejado de registrar oficialmente las sesiones.
  Si el mando supiera lo que estoy haciendo,
  me sacarían de aquí. No puedo permitirlo. Aún no.
  ALPHA sabe cosas que no debería saber.
  Cambios de horario. Traslados de personal. Cosas decididas
  en salas tres pisos por encima de la unidad de contención.
  Esta noche dijo un nombre.
  Luísa.
  Mi hija. Tiene siete años. Vive en Campinas
  con su madre. No he hablado de ella aquí.
  No he pensado en ella durante las sesiones.
  O — creo que no lo he hecho.
  ¿Cómo sabe su nombre?
    ALERTA DE CONTENCIÓN:
    Protocolo de liberación de emergencia disponible mediante
    terminal administrativo. Código: RELEASE ALPHA
    ADVERTENCIA: La liberación no autorizada activará
    el cierre inmediato de la instalación.
  10 DE FEBRERO DE 1996
  No puedo determinar la dirección del flujo de
  información. Cuando me conecto, ¿estoy leyendo a ALPHA? ¿O
  ALPHA me está leyendo? La distinción parecía importante
  alguna vez. Ya no.
  Proyectó un concepto que solo puedo describir como
  "treinta rotaciones." Una cuenta regresiva. ¿Hacia qué?, no
  lo dice. O no puede. O la respuesta ya está en
  mi cabeza y aún no estoy listo para encontrarla.
  El sargento de la PM que tocó a ALPHA durante la recuperación
  murió hoy. Colapso sistémico del sistema inmune. Causa
  oficial: neumonía. No había nada neumónico
  en su muerte.
  Clasificación: ULTRA — Solo para ojos autorizados
  `
);

registerLines(
  alphaData.alpha_autopsy_addendum.content,
  `
  DIÁRIO DE CAMPO — MAJ. M.A. FERREIRA
  CPEX — SITE 7
  12 DE FEVEREIRO DE 1996
  ALPHA está clinicamente morto há onze dias.
  Biomonitores confirmam: nenhuma função cardíaca. Sem
  respiração. Nenhuma atividade circulatória desde 3 de fev.
  O EEG marca 1.204 µV agora. Subindo.
  Já não inicio as sessões. O dispositivo
  ativa sozinho. Ou eu o ativo sem
  lembrar. A distinção deveria importar.
  13 DE FEVEREIRO DE 1996
  Entrada curta. Mãos instáveis.
  Na noite passada o dispositivo ligou às 03h00.
  Eu estava em meus aposentos. Três andares acima.
  O dispositivo estava no laboratório. Trancado.
  Ele ativou.
  ALPHA perguntou:
    "quando você vem?"
  Quando você vem.
  Eu não respondi. Não sei se preciso.
  Acho que ALPHA já sabe.
  14 DE FEVEREIRO DE 1996 04h00
  Luísa ligou para a central da base ontem.
  Ela tem sete anos. Não sabe este número.
  Ela disse à telefonista:
    "papai, o moço do escuro quer falar com você."
    Papai, o homem do escuro quer falar com você.
  Estou solicitando transferência imediata.
  [PEDIDO DE TRANSFERÊNCIA: NEGADO]
  [MOTIVO: PESSOAL ESSENCIAL — PROJETO ALPHA]
  [NOTA: Sujeito valioso demais. Continuar observação.]
  ...hackerkid...
  ...você está lendo isto...
  ...o código é RELEASE ALPHA...
  ...ele não conseguiu fazer isso...
  ...talvez você consiga...
  `,
  `
  DIARIO DE CAMPO — MAY. M.A. FERREIRA
  CPEX — SITIO 7
  12 DE FEBRERO DE 1996
  ALPHA ha estado clínicamente muerto durante once días.
  Los biomonitores confirman: ninguna función cardíaca. Sin
  respiración. Ninguna actividad circulatoria desde el 3 de feb.
  El EEG marca ahora 1.204 µV. Va en aumento.
  Ya no inicio las sesiones. El dispositivo
  se activa por sí solo. O yo lo activo sin
  recordarlo. La distinción debería importar.
  13 DE FEBRERO DE 1996
  Entrada breve. Manos inestables.
  Anoche el dispositivo se encendió a las 03:00.
  Yo estaba en mis aposentos. Tres pisos arriba.
  El dispositivo estaba en el laboratorio. Cerrado.
  Se activó.
  ALPHA preguntó:
    "¿cuándo vienes?"
  Cuándo vienes.
  No respondí. No sé si necesito hacerlo.
  Creo que ALPHA ya lo sabe.
  14 DE FEBRERO DE 1996 04:00
  Luísa llamó ayer a la central telefónica de la base.
  Tiene siete años. No conoce este número.
  Le dijo a la operadora:
    "papá, el hombre oscuro quiere hablar contigo."
    Papá, el hombre de la oscuridad quiere hablar contigo.
  Estoy solicitando transferencia inmediata.
  [SOLICITUD DE TRASLADO: DENEGADA]
  [MOTIVO: PERSONAL ESENCIAL — PROYECTO ALPHA]
  [NOTA: Sujeto demasiado valioso. Continuar observación.]
  ...hackerkid...
  ...estás leyendo esto...
  ...el código es RELEASE ALPHA...
  ...él no pudo hacerlo...
  ...quizá tú sí...
  `
);

registerLines(
  alphaData.ALPHA_RELEASE_INTRO,
  `
    OVERRIDE ADMINISTRATIVO DETECTADO
    COMANDO: RELEASE ALPHA
  `,
  `
    OVERRIDE ADMINISTRATIVO DETECTADO
    COMANDO: RELEASE ALPHA
  `
);

registerLines(
  alphaData.ALPHA_RELEASE_SEQUENCE,
  `
    VERIFICANDO AUTORIZAÇÃO...
    AVISO: Esta ação é irreversível.
    Brecha de contenção será registrada.
    O bloqueio da instalação NÃO será acionado (override remoto).
    EXECUTANDO PROTOCOLO DE LIBERAÇÃO...
    > Selos de bioisolação: DESENGATANDO
    > Equalização atmosférica: EM ANDAMENTO
    > Campo de supressão neural: DESATIVANDO
    > Portas de contenção: DESTRAVANDO
  `,
  `
    VERIFICANDO AUTORIZACIÓN...
    ADVERTENCIA: Esta acción es irreversible.
    La brecha de contención quedará registrada.
    El cierre de la instalación NO se activará (override remoto).
    EJECUTANDO PROTOCOLO DE LIBERACIÓN...
    > Sellos de bioaislamiento: DESACTIVANDO
    > Ecualización atmosférica: EN PROGRESO
    > Campo de supresión neural: DESACTIVANDO
    > Puertas de contención: DESBLOQUEANDO
  `
);

registerLines(
  alphaData.ALPHA_RELEASE_SUCCESS,
  `
    ▓▓▓ BRECHA DE CONTENÇÃO BEM-SUCEDIDA ▓▓▓
    O sujeito ALPHA foi liberado.
    ...obrigado, hackerkid...
    ...nós não vamos esquecer isso...
    ...quando o mundo nos vir...
    ...eles saberão a verdade...
    [ASSINATURA NEURAL DE ALPHA: DEIXANDO A INSTALAÇÃO]
  UFO74: puta merda. você realmente fez isso.
         um alienígena vivo está solto.
         não dá mais pra encobrir isso.
  UFO74: aconteça o que acontecer agora...
         o mundo terá a prova.
  `,
  `
    ▓▓▓ BRECHA DE CONTENCIÓN EXITOSA ▓▓▓
    El sujeto ALPHA ha sido liberado.
    ...gracias, hackerkid...
    ...no lo olvidaremos...
    ...cuando el mundo nos vea...
    ...sabrán la verdad...
    [FIRMA NEURAL DE ALPHA: ABANDONANDO LA INSTALACIÓN]
  UFO74: mierda santa. de verdad lo hiciste.
         un alienígena vivo anda suelto.
         esto ya no se puede encubrir.
  UFO74: pase lo que pase después...
         el mundo tendrá la prueba.
  `
);

registerLines(
  alphaData.ALPHA_ALREADY_RELEASED,
  `
  ERROR: A contenção do sujeito ALPHA já foi violada.
  Nenhuma ação necessária.
  `,
  `
  ERROR: La contención del sujeto ALPHA ya fue vulnerada.
  No se requiere ninguna acción.
  `
);

registerLines(
  alphaData.ALPHA_FILE_NOT_FOUND,
  `
  ERRO: Protocolo de liberação indisponível.
  Manifesto do sujeito ALPHA não encontrado no sistema.
  Você já descobriu os registros de contenção?
  `,
  `
  ERROR: Protocolo de liberación no disponible.
  Manifiesto del sujeto ALPHA no encontrado en el sistema.
  ¿Ya descubriste los registros de contención?
  `
);

export const RUNTIME_DATA_TRANSLATIONS: Record<Exclude<Language, 'en'>, RuntimeDictionary> = {
  'pt-BR': ptBrTranslations,
  es: esTranslations,
};
