type RuntimeDictionary = Record<string, string>;

export const RUNTIME_COMMAND_SUPPLEMENT: Record<'pt-BR' | 'es', RuntimeDictionary> = {
  'pt-BR': {
    'UFO74: youre in. keep it quiet.': 'UFO74: você entrou. fica na sua.',
    'UFO74: quick brief. you cant change anything here — read only.':
      'UFO74: resumo rápido. você não pode mudar nada aqui — só ler.',
    'UFO74: type "ls" to see whats in front of you.':
      'UFO74: digite "ls" para ver o que está na sua frente.',
    'UFO74: type "cd <folder>" to go inside. "open <file>" to read.':
      'UFO74: digite "cd <folder>" para entrar. "open <file>" para ler.',
    'UFO74: when this channel closes, start with: ls':
      'UFO74: quando este canal fechar, comece com: ls',
    'UFO74: try internal/ first. routine paperwork. low heat.':
      'UFO74: tente internal/ primeiro. papelada rotineira. baixa pressão.',
    'UFO74: youll see an evidence tracker. it lights up when you prove something.':
      'UFO74: você vai ver um rastreador de evidências. ele acende quando você prova algo.',
    'UFO74: risk meter climbs as you dig. if it spikes, they test you. fail that, youre out.':
      'UFO74: o medidor de risco sobe conforme você cava. se disparar, eles te testam. falhe e acabou.',
    'UFO74: im cutting the link. from here, youre on your own.':
      'UFO74: vou cortar o link. daqui em diante, você está por conta própria.',
    '       move slow. read everything. the truth is in the details.':
      '       vá devagar. leia tudo. a verdade está nos detalhes.',
    '║  💡 TUTORIAL TIP': '║  💡 DICA DE TUTORIAL',
    '  B A S I C S': '  B Á S I C O',
    '  NAVIGATION': '  NAVEGAÇÃO',
    '  READING': '  LEITURA',
    '  TRACKING': '  RASTREAMENTO',
    '  STATUS': '  STATUS',
    '  E V I D E N C E   S Y S T E M': '  S I S T E M A   D E   E V I D Ê N C I A',
    '  OBJECTIVE': '  OBJETIVO',
    '  WINNING:': '  COMO VENCER:',
    '  H O W   T O   W I N': '  C O M O   V E N C E R',
    '  STRATEGY': '  ESTRATÉGIA',
    '  R E C O V E R Y   &   S T E A L T H': '  R E C U P E R A Ç Ã O   &   F U R T I V I D A D E',

    'COMMAND: help [command]': 'COMANDO: help [command]',
    'Display available commands or detailed help for a specific command.':
      'Mostra os comandos disponíveis ou ajuda detalhada para um comando específico.',
    'USAGE:': 'USO:',
    'NOTES:': 'NOTAS:',
    'REQUIREMENTS:': 'REQUISITOS:',
    'HINT:': 'DICA:',
    '  help           - Show all commands': '  help           - Mostra todos os comandos',
    '  help ls        - Show detailed help for "ls"':
      '  help ls        - Mostra ajuda detalhada para "ls"',
    '  help open      - Show detailed help for "open"':
      '  help open      - Mostra ajuda detalhada para "open"',
    'COMMAND: ls [-l]': 'COMANDO: ls [-l]',
    '  ls             - List files and directories':
      '  ls             - Lista arquivos e diretórios',
    '  ls -l          - Long format with previews':
      '  ls -l          - Formato longo com prévias',
    'MARKERS:': 'MARCADORES:',
    '  [UNREAD]       - File not yet read': '  [UNREAD]       - Arquivo ainda não lido',
    '  [READ]         - File already opened': '  [READ]         - Arquivo já aberto',
    '  [~2min]        - Longer document estimate':
      '  [~2min]        - Estimativa de documento mais longo',
    '  ★              - Bookmarked file': '  ★              - Arquivo favoritado',
    'COMMAND: cd <directory>': 'COMANDO: cd <directory>',
    'Change to a different directory.': 'Muda para outro diretório.',
    '  cd ops         - Enter the "ops" directory':
      '  cd ops         - Entra no diretório "ops"',
    '  cd /admin      - Go to absolute path': '  cd /admin      - Vai para o caminho absoluto',
    '  cd ..          - Go to parent directory': '  cd ..          - Volta ao diretório pai',
    'COMMAND: open <file>': 'COMANDO: open <file>',
    'Open and display the contents of a file.': 'Abre e exibe o conteúdo de um arquivo.',
    '  open report.txt       - Open a file': '  open report.txt       - Abre um arquivo',
    'NOTE: Legacy encrypted/restricted wrappers now open directly.':
      'NOTA: Wrappers legados de criptografia/restrição agora abrem direto.',
    'NOTE: Opening certain files may increase detection risk.':
      'NOTA: Abrir certos arquivos pode aumentar o risco de detecção.',
    'COMMAND: note <text>': 'COMANDO: note <text>',
    'Notes are saved with timestamps and persist across saves.':
      'Notas são salvas com timestamp e persistem entre salvamentos.',
    'COMMAND: notes': 'COMANDO: notes',
    'Display all saved personal notes.': 'Mostra todas as notas pessoais salvas.',
    '  notes          - Show all notes with timestamps':
      '  notes          - Mostra todas as notas com timestamps',
    'COMMAND: bookmark [file]': 'COMANDO: bookmark [file]',
    'Bookmark a file for quick reference, or view bookmarks.':
      'Marca um arquivo para referência rápida ou exibe os favoritos.',
    '  bookmark                    - List all bookmarks':
      '  bookmark                    - Lista todos os favoritos',
    '  bookmark report.txt         - Toggle bookmark on file':
      '  bookmark report.txt         - Alterna favorito no arquivo',
    'Bookmarked files show a ★ marker in directory listings.':
      'Arquivos favoritados exibem um marcador ★ nas listagens.',
    'COMMAND: status': 'COMANDO: status',
    'Display current system status and risk indicators.':
      'Mostra o status atual do sistema e os indicadores de risco.',
    'COMMAND: progress': 'COMANDO: progress',
    'Review your evidence total, case strength, and session notes at a glance.':
      'Revise seu total de evidências, a força do caso e as notas da sessão de relance.',
    '  progress       - Show a spoiler-light investigation recap':
      '  progress       - Mostra uma recapitulação leve da investigação',
    'Shows:': 'Mostra:',
    '  - Logging/audit status': '  - Status de logging/auditoria',
    '  - System tolerance (wrong attempts remaining)':
      '  - Tolerância do sistema (tentativas erradas restantes)',
    '  - Session stability': '  - Estabilidade da sessão',
    'COMMAND: clear': 'COMANDO: clear',
    '  clear          - Clear screen': '  clear          - Limpa a tela',
    'SHORTCUT: Ctrl+L': 'ATALHO: Ctrl+L',
    'COMMAND: save <filename>': 'COMANDO: save <filename>',
    'Save a file to your dossier for the leak.':
      'Salve um arquivo no seu dossiê para o vazamento.',
    'You must have read the file first.':
      'Você precisa abrir e ler o arquivo antes de salvá-lo.',
    '  save report.txt    - Save report.txt to dossier':
      '  save report.txt    - Salva report.txt no dossiê',
    'NOTE: Your dossier can hold up to 10 files.':
      'NOTA: Seu dossiê pode guardar até 10 arquivos.',
    'COMMAND: unsave <filename>': 'COMANDO: unsave <filename>',
    'Remove a file from your dossier.': 'Remova um arquivo do seu dossiê.',
    '  unsave report.txt  - Remove report.txt from dossier':
      '  unsave report.txt  - Remove report.txt do dossiê',
    'COMMAND: chat': 'COMANDO: chat',
    'Open the secure relay channel to communicate with contacts.':
      'Abre o canal de retransmissão segura para se comunicar com contatos.',
    '  chat           - Open chat interface': '  chat           - Abre a interface de chat',
    'COMMAND: last': 'COMANDO: last',
    '  last           - Show last opened file': '  last           - Mostra o último arquivo aberto',
    'COMMAND: unread': 'COMANDO: unread',
    '  unread         - Show unread files': '  unread         - Mostra arquivos não lidos',
    'COMMAND: search <keyword>': 'COMANDO: search <keyword>',
    'Search accessible filenames, paths, and document text for a keyword.':
      'Procura um termo em nomes de arquivos, caminhos e texto dos documentos acessíveis.',
    '  search crash       - Find crash-related files':
      '  search crash       - Encontra arquivos sobre a queda',
    '  search quarantine  - Find containment leads':
      '  search quarantine  - Encontra pistas sobre contenção',
    '  search 2026        - Find transition references':
      '  search 2026        - Encontra referências à transição',
    '  - Searches only what your current access can already reveal':
      '  - Só busca no que seu acesso atual já consegue revelar',
    '  - Results can be opened directly with "open <path>"':
      '  - Resultados podem ser abertos direto com "open <path>"',
    'COMMAND: help recovery': 'COMANDO: help recovery',
    'Review the emergency recovery options that can keep a run alive.':
      'Revise as opções de recuperação de emergência que podem manter a sessão viva.',
    'TOOLS:': 'FERRAMENTAS:',
    '  wait           - Lower detection briefly (limited uses)':
      '  wait           - Reduz a detecção por um tempo (usos limitados)',
    '  status         - Check current pressure before you commit':
      '  status         - Verifica a pressão atual antes de arriscar',
    'Use recovery tools before the system forces your hand.':
      'Use as ferramentas de recuperação antes que o sistema te obrigue a agir.',
    'COMMAND: tree': 'COMANDO: tree',
    'Display a tree view of the directory structure.':
      'Mostra uma visualização em árvore da estrutura de diretórios.',
    '  tree           - Show directory tree': '  tree           - Mostra a árvore de diretórios',
    'COMMAND: tutorial [on|off]': 'COMANDO: tutorial [on|off]',
    '  tutorial       - Restart tutorial sequence':
      '  tutorial       - Reinicia a sequência do tutorial',
    '  tutorial on    - Enable tutorial tips during gameplay':
      '  tutorial on    - Ativa dicas de tutorial durante a jogabilidade',
    '  tutorial off   - Disable tutorial tips':
      '  tutorial off   - Desativa as dicas de tutorial',
    '  - After your first evidence update': '  - Após sua primeira atualização de evidência',
    '  - When you discover new evidence categories':
      '  - Quando você descobre novas categorias de evidência',
    'COMMAND: morse': 'COMANDO: morse',
    '  morse <message>  - Submit your deciphered message':
      '  morse <message>  - Envia sua mensagem decifrada',
    '  morse cancel     - Cancel current morse entry':
      '  morse cancel     - Cancela a entrada atual de morse',
    'COMMAND: leak': 'COMANDO: leak',
    'Attempt to leak your saved dossier to external channels.':
      'Tenta vazar seu dossiê salvo para canais externos.',
    '  leak            - Initiate dossier leak': '  leak            - Inicia o vazamento do dossiê',
    'REQUIREMENT: Save 10 files to your dossier first.':
      'REQUISITO: Salve 10 arquivos no seu dossiê primeiro.',
    'COMMAND: wait': 'COMANDO: wait',
    '  wait           - Reduce detection by ~10%':
      '  wait           - Reduz a detecção em ~10%',
    'COMMAND: hide': 'COMANDO: hide',
    '  hide           - Emergency escape at 90% risk':
      '  hide           - Fuga de emergência com 90% de risco',
    'COMMAND: link [phrase]': 'COMANDO: link [phrase]',
    '  link           - Attempt connection': '  link           - Tenta conexão',
    '  link <phrase>  - Authenticate with conceptual key':
      '  link <phrase>  - Autentica com a chave conceitual',
    'COMMAND: override protocol <code>': 'COMANDO: override protocol <code>',
    'COMMAND: release <target>': 'COMANDO: release <target>',
    'NOTE: Requires discovery of containment manifests.':
      'NOTA: Requer descoberta dos manifestos de contenção.',
    'COMMAND: back': 'COMANDO: back',
    'Return to the previous directory in your navigation history.':
      'Retorna ao diretório anterior no seu histórico de navegação.',
    '  back             - Go to last visited directory':
      '  back             - Vai para o último diretório visitado',
    'NOTE: Requires at least one "cd" in your session history.':
      'NOTA: Requer pelo menos um "cd" no histórico da sessão.',
    'COMMAND: map': 'COMANDO: map',
    'Display the files currently saved to your dossier.':
      'Exibe os arquivos atualmente salvos no seu dossiê.',
    '  map              - Review dossier slots and saved files':
      '  map              - Revê os slots do dossiê e os arquivos salvos',
    'COMMAND: trace': 'COMANDO: trace',
    'Initiate a trace protocol on the system.':
      'Inicia um protocolo de rastreamento no sistema.',
    '  trace            - Probe accessible directories':
      '  trace            - Sonda diretórios acessíveis',
    'NOTE: Results depend on your current access level.':
      'NOTA: Os resultados dependem do seu nível de acesso atual.',
    'COMMAND: script <script_content>': 'COMANDO: script <script_content>',
    'Execute a reconstruction script against a target path.':
      'Executa um script de reconstrução contra um caminho alvo.',
    '  script INIT;TARGET=/admin/neural_fragment.dat;EXEC':
      '  script INIT;TARGET=/admin/neural_fragment.dat;EXEC',
    'NOTE: Check /tmp/data_reconstruction.util for valid targets.':
      'NOTA: Verifique /tmp/data_reconstruction.util para alvos válidos.',
    'COMMAND: run <script>': 'COMANDO: run <script>',
    'Execute a system script.': 'Executa um script do sistema.',
    '  run purge_trace.sh   - Run the trace purge utility':
      '  run purge_trace.sh   - Executa o utilitário de limpeza de rastros',
    'NOTE: Some scripts appear only after the relevant files are visible.':
      'NOTA: Alguns scripts só aparecem depois que os arquivos relevantes ficam visíveis.',
    'COMMAND: rewind': 'COMANDO: rewind',
    'Archive mode has been retired.': 'O modo de arquivo foi aposentado.',
    'Previously allowed rewinding to earlier timestamps.':
      'Antes permitia retroceder para timestamps anteriores.',
    'COMMAND: present': 'COMANDO: present',
    'Returns to the current timeline (no-op in current build).':
      'Retorna para a linha do tempo atual (sem efeito nesta build).',
    '  last              Re-display last opened file':
      '  last              Exibe novamente o último arquivo aberto',

    'UFO74: HACKERKID NO!': 'UFO74: HACKERKID NÃO!',
    'UFO74: ugh. this is sanitized documentation.':
      'UFO74: argh. isso é documentação higienizada.',
    'UFO74: good pace, hackerkid.': 'UFO74: bom ritmo, hackerkid.',
    'UFO74: this one still hides behind a recovery phrase. look around for clues first.':
      'UFO74: este ainda se esconde atrás de uma frase de recuperação. procura pistas antes.',
    'UFO74: the answer is somewhere else in the system. keep digging before you force it.':
      'UFO74: a resposta está em outra parte do sistema. continue cavando antes de forçar.',
    'UFO74: locked tight. find the answer somewhere else before you try the legacy prompt.':
      'UFO74: trancado até o osso. ache a resposta em outro lugar antes de tentar o prompt legado.',
    'UFO74: sealed, but not impossible. the old recovery wrapper still works here.':
      'UFO74: lacrado, mas não impossível. o velho wrapper de recuperação ainda funciona aqui.',
    'UFO74: legacy lock. if you need it, use the recovery prompt instead of forcing it.':
      'UFO74: trava legada. se precisar, use o prompt de recuperação em vez de forçar.',
    'SEQUENCE MISMATCH': 'SEQUÊNCIA INCORRETA',
    '  TIMER STARTED': '  TIMER INICIADO',
    'FIREWALL TRIGGERED': 'FIREWALL ACIONADO',
    'Connection severed.': 'Conexão encerrada.',
    'DIRECTORY STRUCTURE': 'ESTRUTURA DE DIRETÓRIOS',

    'that journal. the scientist lost his mind. but he was right about everything.':
      'aquele diário. o cientista perdeu a cabeça. mas estava certo sobre tudo.',
    'they made contact. they actually made contact. and then it spoke back.':
      'eles fizeram contato. contato de verdade. e então aquilo respondeu.',
    'an autopsy on something that was still alive. these people were insane.':
      'uma autópsia em algo que ainda estava vivo. essas pessoas eram insanas.',
    'that is the original field report. the one they tried to destroy.':
      'esse é o relatório de campo original. o que tentaram destruir.',
    'the official version. compare it to what we have. they rewrote everything.':
      'a versão oficial. compara com o que temos. eles reescreveram tudo.',
    'audio transcript. listen to how calm they sound. they practiced this.':
      'transcrição de áudio. escuta como soam calmos. ensaiaram isso.',
    'material analysis. whatever they found, it is not from here.':
      'análise de material. seja lá o que encontraram, não é daqui.',
    'transport records. they moved everything in the middle of the night.':
      'registros de transporte. moveram tudo no meio da noite.',
    'manifest fragment. they shipped something weighing 112 kilos through diplomatic channels.':
      'fragmento de manifesto. despacharam algo de 112 quilos por canais diplomáticos.',
    'integrity hashes. they were tracking which files had been tampered with.':
      'hashes de integridade. eles rastreavam quais arquivos tinham sido adulterados.',
    'containment log. they kept it in a sealed unit for eleven days.':
      'log de contenção. mantiveram aquilo em uma unidade selada por onze dias.',
    'an autopsy report. official. classified. exactly what we needed.':
      'um laudo de autópsia. oficial. classificado. exatamente o que precisávamos.',
    'neurological addendum. the brain was still active after death. still active.':
      'adendo neurológico. o cérebro ainda estava ativo após a morte. ainda ativo.',
    'raw witness statement. before they got to her. before the edits.':
      'depoimento bruto de testemunha. antes que chegassem nela. antes das edições.',
    'neural recording. they captured whatever was still firing in that brain.':
      'registro neural. capturaram o que ainda disparava naquele cérebro.',
    'purpose analysis. they were trying to figure out what it was FOR.':
      'análise de propósito. tentavam descobrir para que aquilo servia.',
    'surveillance footage. someone saved this before the purge.':
      'filmagem de vigilância. alguém salvou isso antes do expurgo.',
    'field report from prato. 1977. this has been going on for decades.':
      'relatório de campo do prato. 1977. isso vem acontecendo há décadas.',
    'operation prato. the air force ran this in 77. they documented everything and then buried it.':
      'operação prato. a força aérea tocou isso em 77. documentaram tudo e depois enterraram.',
    'response orders. standard military protocol for something very not standard.':
      'ordens de resposta. protocolo militar padrão para algo nada padrão.',
    'colares 77. dozens of sightings. hundreds of witnesses. all silenced.':
      'colares 77. dezenas de avistamentos. centenas de testemunhas. todas silenciadas.',
    'patrol observation. soldiers describing what they saw. you can feel the fear.':
      'observação de patrulha. soldados descrevendo o que viram. dá pra sentir o medo.',
    'medical effects. burns on the skin. radiation marks. from light beams.':
      'efeitos médicos. queimaduras na pele. marcas de radiação. de feixes de luz.',
    'photo archive. they had photos. had. past tense.':
      'arquivo fotográfico. eles tinham fotos. tinham. no passado.',
    'retrospective assessment. someone connected 77 to 96. same pattern.':
      'avaliação retrospectiva. alguém ligou 77 a 96. mesmo padrão.',
    'scout classification. they categorized different types. as in plural.':
      'classificação de batedores. categorizaram tipos diferentes. no plural.',
    'energy assessment. propulsion system we cannot replicate. not even close.':
      'avaliação de energia. sistema de propulsão que não conseguimos replicar. nem perto.',
    'signal fragment. partial decryption. whatever this says, they did not want us reading it.':
      'fragmento de sinal. descriptografia parcial. seja o que for que isso diga, eles não queriam que lêssemos.',
    'aircraft incident report. their first cover story. it did not hold.':
      'relatório de incidente aéreo. a primeira história de cobertura deles. não se sustentou.',
    'drone theory. the one they floated before anyone knew what a drone was.':
      'teoria do drone. a que lançaram antes de qualquer um saber o que era um drone.',
    'industrial accident. their fallback explanation. paper thin.':
      'acidente industrial. a explicação reserva deles. fina como papel.',
    'witness visit log. they visited every single one. every single one.':
      'log de visita a testemunhas. visitaram cada uma delas. cada uma.',
    'debriefing protocol. that is a polite word for what they did to those people.':
      'protocolo de debriefing. esse é o nome educado para o que fizeram com aquelas pessoas.',
    'the silva sisters file. three girls. teenagers. and the military went after them.':
      'o arquivo das irmãs silva. três garotas. adolescentes. e os militares foram atrás delas.',
    'recantation form. they made witnesses sign this. under threat.':
      'formulário de retratação. fizeram testemunhas assinarem isso. sob ameaça.',
    'animal deaths at the zoo. same week. same area. not a coincidence.':
      'mortes de animais no zoológico. mesma semana. mesma área. não é coincidência.',
    'they silenced the veterinarian. the one who asked too many questions.':
      'silenciaram o veterinário. o que fez perguntas demais.',
    'contamination theory. the story they fed to the press about the dead animals.':
      'teoria da contaminação. a história que empurraram para a imprensa sobre os animais mortos.',
    'duarte. the officer who touched it. dead within weeks. and they covered it up.':
      'duarte. o oficial que tocou nele. morto em semanas. e encobriram tudo.',
    'autopsy suppression. they blocked the examination of a dead officer. why.':
      'supressão da autópsia. bloquearam o exame de um oficial morto. por quê.',
    'family compensation. they paid the family to stay quiet. blood money.':
      'compensação à família. pagaram para que ficassem calados. dinheiro de sangue.',
    'encrypted transmission. the core transcript. this is what they were saying.':
      'transmissão criptografada. a transcrição central. era isso que estavam dizendo.',
    'second transcript. they intercepted more than one. they kept intercepting.':
      'segunda transcrição. interceptaram mais de uma. continuaram interceptando.',
    'signal analysis. the pattern is structured. it is language. it is definitely language.':
      'análise de sinal. o padrão é estruturado. é linguagem. com certeza é linguagem.',
    'foreign liaison. other governments knew. they all knew.':
      'ligação estrangeira. outros governos sabiam. todos sabiam.',
    'diplomatic cable. encrypted. sent three days after the incident.':
      'cabo diplomático. criptografado. enviado três dias após o incidente.',
    'multinational protocol. six countries. coordinated. this goes so far beyond brazil.':
      'protocolo multinacional. seis países. coordenados. isso vai muito além do brasil.',
    'medical examiner query. someone was asking the wrong questions.':
      'consulta ao legista. alguém estava fazendo as perguntas erradas.',
    'neural cluster experiment. they built an interface. they tried to talk to it.':
      'experimento de cluster neural. construíram uma interface. tentaram falar com aquilo.',
    'december 95 intercepts. a month before varginha. they knew something was coming.':
      'interceptações de dezembro de 95. um mês antes de varginha. sabiam que algo vinha.',
    'january 96 summary. the week before contact. activity was off the charts.':
      'resumo de janeiro de 96. a semana antes do contato. atividade fora da escala.',
    'morse intercept. someone was sending morse. but not in any known protocol.':
      'interceptação em morse. alguém enviava morse. mas não em nenhum protocolo conhecido.',
    'journalist payments. encrypted. they paid the press to look the other way.':
      'pagamentos a jornalistas. criptografado. pagaram a imprensa para desviar o olhar.',
    'media contacts list. every journalist they had in their pocket.':
      'lista de contatos da mídia. cada jornalista que tinham no bolso.',
    'kill story memo. direct order to suppress coverage. signed and dated.':
      'memorando de matar a matéria. ordem direta para suprimir cobertura. assinado e datado.',
    'tv coverage report. they were monitoring every broadcast. every mention.':
      'relatório de cobertura na TV. monitoravam cada transmissão. cada menção.',
    'foreign press alert. international media was picking it up. they panicked.':
      'alerta de imprensa estrangeira. a mídia internacional estava pegando a história. entraram em pânico.',
    'neural cluster memo. they replicated alien neural tissue in silicon. it worked.':
      'memorando do cluster neural. replicaram tecido neural alienígena em silício. funcionou.',
    'threat window. a timeline for something they cannot stop.':
      'janela de ameaça. uma linha do tempo para algo que não conseguem impedir.',
    'internal note. someone higher up was asking for updates. daily.':
      'nota interna. alguém mais acima cobrava atualizações. diárias.',
    'bio program overview. the entire operation. funded. authorized. hidden.':
      'visão geral do programa bio. a operação inteira. financiada. autorizada. escondida.',
    'colonization model. not invasion. colonization. the difference matters.':
      'modelo de colonização. não invasão. colonização. a diferença importa.',
    'ethics exception. they waived the rules. officially. to do what they did.':
      'exceção ética. suspenderam as regras. oficialmente. para fazer o que fizeram.',
    'window alignment data. the timing is not random. it never was.':
      'dados de alinhamento da janela. o timing não é aleatório. nunca foi.',
    'executive briefing. someone very senior read this. and approved everything.':
      'briefing executivo. alguém muito alto leu isso. e aprovou tudo.',
    'weather balloon memo. the oldest lie in the book.':
      'memorando do balão meteorológico. a mentira mais velha do manual.',
    'parallel incidents. same thing happened in other countries. same year.':
      'incidentes paralelos. a mesma coisa aconteceu em outros países. no mesmo ano.',
    'thirty year cycle. 1966. 1996. 2026. the pattern does not stop.':
      'ciclo de trinta anos. 1966. 1996. 2026. o padrão não para.',
    'that document. whoever wrote it understood what is happening. and it broke them.':
      'aquele documento. quem escreveu entendeu o que está acontecendo. e aquilo quebrou a pessoa.',
    'non-arrival colonization. they do not need to come here. they are already taking what they want.':
      'colonização sem chegada. eles não precisam vir até aqui. já estão levando o que querem.',
    'window clarification. the dates are specific. and close.':
      'esclarecimento da janela. as datas são específicas. e próximas.',
    'extraction mechanism. the process is automated. we never even notice.':
      'mecanismo de extração. o processo é automatizado. a gente nem percebe.',
    'second deployment signal. there was a second wave. there was always going to be a second wave.':
      'sinal de segunda implantação. houve uma segunda onda. sempre haveria uma segunda onda.',
    'neural fragment. reconstructed. whatever this was thinking, they captured it.':
      'fragmento neural. reconstruído. o que quer que isso pensasse, eles capturaram.',
    'emergency broadcast. encrypted. whoever sent this was not expecting to send it.':
      'transmissão de emergência. criptografada. quem mandou isso não esperava precisar mandar.',
    'redaction override. someone had the authority to unlock everything. and used it.':
      'override de redação. alguém tinha autoridade para destrancar tudo. e usou.',
    'trace purge memo. the order to erase everything. we got here just in time.':
      'memorando de purga de rastreio. a ordem para apagar tudo. chegamos em cima da hora.',
    'mudinho dossier. a planted witness. they fabricated the whole thing.':
      'dossiê mudinho. uma testemunha plantada. fabricaram tudo.',
    'alternative explanations. a menu of lies. pick one and sell it.':
      'explicações alternativas. um cardápio de mentiras. escolha uma e venda.',
    'talking points. scripted answers for every question. word for word.':
      'talking points. respostas roteirizadas para toda pergunta. palavra por palavra.',
    'cargo memo. everything in code. "agricultural equipment" means what you think it means.':
      'memorando de carga. tudo em código. "equipamento agrícola" significa exatamente o que você pensa.',
    'visitor briefing. coded language. they had a word for everything.':
      'briefing de visitantes. linguagem codificada. tinham uma palavra para tudo.',
    'asset disposition. where they moved everything. hidden in plain language.':
      'destino dos ativos. para onde moveram tudo. escondido em linguagem comum.',
    'terminology guide. a dictionary of lies. every real word replaced.':
      'guia de terminologia. um dicionário de mentiras. cada palavra real substituída.',
    'kid. that is insane. save that.': 'kid. isso é insano. salva isso.',
    'good stuff. we are going to need this for the leak.':
      'coisa boa. vamos precisar disso para o vazamento.',
    'damn. they really buried this one.': 'droga. enterraram essa de verdade.',
    'you found it. i knew it was in there.': 'você achou. eu sabia que estava aí.',
    'this is exactly what we came for. keep going.':
      'é exatamente isso que viemos buscar. continua.',
    'they are going to hate that you found that.':
      'eles vão odiar que você tenha encontrado isso.',
    'one more like that and we blow this wide open.':
      'mais um assim e arrebentamos tudo de vez.',
    'save everything. do not skip a single file.':
      'salva tudo. não pule um arquivo sequer.',
    'that one is going straight into the leak package.':
      'isso vai direto para o pacote do vazamento.',
    'this is why they locked this system down.':
      'é por isso que eles trancaram este sistema.',
    "UFO74: hey. need a hint?": 'UFO74: ei. precisa de uma dica?',
    'UFO74: READ the files. "open <filename>".':
      'UFO74: LEIA os arquivos. "open <filename>".',
    '       theres a protocol doc in /internal/.':
      '       tem um documento de protocolo em /internal/.',
    'UFO74: look for evidence in:': 'UFO74: procure evidências em:',
    'UFO74: the index knows more than they want you to find.':
      'UFO74: o índice sabe mais do que eles querem que você encontre.',
    '       try: search <keyword>': '       tente: search <keyword>',
    'UFO74: last hint:': 'UFO74: última dica:',
    'UFO74: january 96. find the pieces.':
      'UFO74: janeiro de 96. ache as peças.',
    'check /storage/ for transport logs.': 'verifique /storage/ atrás dos logs de transporte.',
    'try "chat". someones in here.': 'tente "chat". tem alguém aqui dentro.',
    'you have clearance. check /admin/.': 'você tem credencial. veja /admin/.',
    'everything is ready. run "leak".': 'tudo pronto. execute "leak".',
    'you have all ten. run "leak" to start the sequence.':
      'você tem os dez. execute "leak" pra começar a sequência.',
    'UFO74: ten files logged. leak path is live.':
      'UFO74: dez arquivos registrados. o caminho de vazamento está aberto.',
    '       type: leak': '       digite: leak',
    '       do it NOW before they cut the connection.':
      '       faça isso AGORA antes que cortem a conexão.',
    'UFO74: telepathy + captured... did they CHOOSE this?':
      'UFO74: telepatia + captura... eles ESCOLHERAM isso?',
    'UFO74: all countries agreed on 2026? bigger than politics.':
      'UFO74: todos os países concordaram com 2026? maior que política.',
    "UFO74: careful kid, they're getting suspicious.":
      'UFO74: cuidado, kid, eles estão ficando desconfiados.',
    "       if you hit 50% you'll have to prove you're human.":
      '       se você chegar a 50% vai ter que provar que é humano.',
    '       /storage/, /ops/quarantine/, /comms/':
      '       /storage/, /ops/quarantine/, /comms/',
    '       1. cd <directory>': '       1. cd <directory>',
    '       2. ls': '       2. ls',
    '       3. open <filename>': '       3. open <filename>',
    '       use: message <answer>': '       use: message <answer>',
    'UFO74: ship pieces first, now the CREW. someone survived.':
      'UFO74: primeiro mandaram peças, agora a TRIPULAÇÃO. alguém sobreviveu.',
    'UFO74: captured alive, then SHARED? whos coordinating this?':
      'UFO74: capturado vivo, e depois COMPARTILHADO? quem coordena isso?',
    'UFO74: knew about 2026 before reading minds? or did THEY tell us?':
      'UFO74: sabiam de 2026 antes de ler mentes? ou ELES contaram?',
    'UFO74: connecting dots. good.': 'UFO74: ligando os pontos. bom.',
    'UFO74: almost there. one more piece.': 'UFO74: quase lá. mais uma peça.',
    'UFO74: walls listen. find the thread.':
      'UFO74: as paredes escutam. ache o fio.',
    'UFO74: th3y r3 1ns1d3': 'UFO74: 3l3s 3stã0 d3ntr0',
    'UFO74: ...january... they took everything...':
      'UFO74: ...janeiro... levaram tudo...',
    'UFO74: theyre scanning. cant talk.':
      'UFO74: estão varrendo. não dá pra falar.',
    'UFO74: be fast.': 'UFO74: seja rápido.',
    'UFO74: every file you open, they see.':
      'UFO74: cada arquivo que você abre, eles veem.',
    'UFO74: triggered some flags. careful.':
      'UFO74: disparou umas flags. cuidado.',
    'UFO74: system suspicious. use "wait".':
      'UFO74: sistema desconfiado. use "wait".',
    'UFO74: autopsy report. not human.':
      'UFO74: relatório de autópsia. não humano.',
    'UFO74: transport log. they split up the evidence.':
      'UFO74: log de transporte. eles dividiram as evidências.',
    'UFO74: they were communicating. telepathically.':
      'UFO74: eles estavam se comunicando. telepaticamente.',
    'UFO74: routine intercepts. signal in the noise.':
      'UFO74: interceptações de rotina. sinal no ruído.',
    'UFO74: other countries involved. coordinated cover-up.':
      'UFO74: outros países envolvidos. encobrimento coordenado.',
    'UFO74: 2026. something coming. thats why they buried it.':
      'UFO74: 2026. algo está vindo. é por isso que enterraram isso.',
    'UFO74: containment. they captured them.':
      'UFO74: contenção. eles os capturaram.',
    'UFO74: physical evidence. smoking gun.':
      'UFO74: evidência física. prova cabal.',
    'UFO74: cover story. the real material is buried deeper.':
      'UFO74: história de cobertura. o material real está enterrado mais fundo.',
    'UFO74: morse code. decipher it.': 'UFO74: código morse. decifra isso.',
    '       might be the override passphrase.':
      '       pode ser a frase de override.',
    '        SECURITY PROTOCOL: TURING EVALUATION INITIATED':
      '        PROTOCOLO DE SEGURANÇA: AVALIAÇÃO TURING INICIADA',
    '                    [SIGNAL ECHO DETECTED]': '                    [ECO DE SINAL DETECTADO]',
    '                    ...we see you seeing...': '                    ...nós vemos você vendo...',
    'UFO74: interesting. keep digging.': 'UFO74: interessante. continua cavando.',
    'UFO74: good. every file matters.': 'UFO74: bom. todo arquivo importa.',
    'UFO74: noted. try /ops, /storage, /comms.':
      'UFO74: anotado. tenta /ops, /storage, /comms.',
    'UFO74: messy copy, but it should still read clean enough.':
      'UFO74: cópia bagunçada, mas ainda deve dar pra ler.',
    'UFO74: old wrapper on this file. readable layer is still intact.':
      'UFO74: wrapper antigo neste arquivo. a camada legível ainda está intacta.',
    'UFO74: legacy encryption tag. just keep reading closely.':
      'UFO74: marca de criptografia legada. só continue lendo com atenção.',
    'UFO74: noisy shell, but the evidence is still there.':
      'UFO74: shell ruidoso, mas a evidência ainda está aí.',
    'UFO74: someones at my door.': 'UFO74: tem alguém na minha porta.',
    '       not police. they dont knock like that.':
      '       não é polícia. eles não batem assim.',
    'UFO74: tell everyone what you found.': 'UFO74: conte a todos o que você encontrou.',
    '       goodbye hackerkid.': '       adeus, hackerkid.',
    'UFO74: hearing noises. stay alert.': 'UFO74: estou ouvindo barulhos. fica alerta.',
    'UFO74: my connection dropped. footsteps upstairs.':
      'UFO74: minha conexão caiu. passos lá em cima.',
    '       i live alone.': '       eu moro sozinho.',
    'UFO74: van outside. finish fast.': 'UFO74: van lá fora. termina rápido.',
    'UFO74: youre deep now. its real.': 'UFO74: você está fundo agora. é real.',
    'UFO74: be careful with this info.': 'UFO74: cuidado com essa informação.',
    'UFO74: physical debris confirmed.': 'UFO74: destroços físicos confirmados.',
    'UFO74: bio specimens confirmed.': 'UFO74: espécimes biológicos confirmados.',
    'UFO74: international involvement.': 'UFO74: envolvimento internacional.',
    'UFO74: communication evidence.': 'UFO74: evidência de comunicação.',
    'UFO74: 2026 timeline.': 'UFO74: linha do tempo de 2026.',
    'UFO74: two pieces confirm each other.': 'UFO74: duas peças se confirmam.',
    'UFO74: almost there.': 'UFO74: quase lá.',
    'Connecting to secure relay...': 'Conectando ao relay seguro...',
    'CONNECTION TERMINATED': 'CONEXÃO ENCERRADA',
    'RELAY NODE OFFLINE': 'NÓ DE RELAY OFFLINE',
    'CONNECTION TERMINATED BY REMOTE': 'CONEXÃO ENCERRADA REMOTAMENTE',
    'ENCRYPTED RELAY ESTABLISHED': 'RELAY CRIPTOGRAFADO ESTABELECIDO',
    'PRISONER_45 connected': 'PRISONER_45 conectado',
    'Use: chat <your question>': 'Use: chat <sua pergunta>',
    '[CONNECTION UNSTABLE]': '[CONEXÃO INSTÁVEL]',
    'Initiating psi-comm bridge...': 'Iniciando ponte psi-comm...',
    'NO VALID NEURAL PATTERN LOADED': 'NENHUM PADRÃO NEURAL VÁLIDO CARREGADO',
    '[UFO74]: you need a neural pattern first. check quarantine for .psi files.':
      '[UFO74]: você precisa de um padrão neural primeiro. confira a quarentena por arquivos .psi.',
    'Neural pattern locked. Conceptual key required.':
      'Padrão neural travado. Chave conceitual necessária.',
    'Enter authentication phrase:': 'Digite a frase de autenticação:',
    '  > link <phrase>': '  > link <phrase>',
    '[UFO74]: check the psi analysis reports. the key is conceptual.':
      '[UFO74]: confira os relatórios de análise psi. a chave é conceitual.',
    'Verifying conceptual key...': 'Verificando chave conceitual...',
    'NEURAL LINK ESTABLISHED': 'LINK NEURAL ESTABELECIDO',
    'Use: link              - Query the consciousness':
      'Use: link              - Consultar a consciência',
    'Use: link disarm       - Attempt to disable firewall':
      'Use: link disarm       - Tentar desativar o firewall',
    'Neural pattern link - Scout consciousness interface':
      'Link de padrão neural - Interface da consciência dos batedores',
    'The neural pattern did not recognize your phrase.':
      'O padrão neural não reconheceu sua frase.',
    'Review psi-comm documentation for the correct key.':
      'Revise a documentação psi-comm para encontrar a chave correta.',
    'Initiating firewall countermeasure...': 'Iniciando contramedida do firewall...',
    'LINK TERMINATED — PATTERN EXHAUSTED': 'LINK ENCERRADO — PADRÃO ESGOTADO',
    'Use: link <thought or question>': 'Use: link <pensamento ou pergunta>',
    '[NEURAL BRIDGE UNSTABLE]': '[PONTE NEURAL INSTÁVEL]',
    '[PATTERN DESTABILIZING]': '[PADRÃO DESESTABILIZANDO]',
    '[NEURAL BRIDGE ACTIVE]': '[PONTE NEURAL ATIVA]',
    'ERROR: No pending message to decipher': 'ERRO: Nenhuma mensagem pendente para decifrar',
    'Read an intercepted signal file first.':
      'Leia primeiro um arquivo de sinal interceptado.',
    'Check /comms/intercepts/ for signal files.':
      'Verifique /comms/intercepts/ em busca dos arquivos de sinal.',
    'Message already deciphered: COLHEITA': 'Mensagem já decifrada: COLHEITA',
    'UFO74: you already cracked it, hackerkid.':
      'UFO74: você já decifrou isso, hackerkid.',
    '       the message was "COLHEITA".': '       a mensagem era "COLHEITA".',
    '       now use it — override protocol.':
      '       agora use isso — override protocol.',
    'Decryption attempts exhausted.': 'Tentativas de decifração esgotadas.',
    'The intercepted message was: COLHEITA': 'A mensagem interceptada era: COLHEITA',
    'UFO74: you missed it, kid. but now you know.':
      'UFO74: você deixou passar, kid. mas agora sabe.',
    '       "COLHEITA" — try it with the override protocol.':
      '       "COLHEITA" — tente com o protocolo de override.',
    'Enter your deciphered message.': 'Digite sua mensagem decifrada.',
    'Usage: message <deciphered text>': 'Uso: message <texto decifrado>',
    'UFO74: you did it hackerkid!': 'UFO74: você conseguiu, hackerkid!',
    '       "COLHEITA" — Portuguese for "HARVEST".':
      '       "COLHEITA" — em português, "HARVEST".',
    'UFO74: this is an authentication passphrase.':
      'UFO74: isso é uma frase-senha de autenticação.',
    '       someone embedded it in the signal.':
      '       alguém embutiu isso no sinal.',
    'UFO74: try it with the override protocol.':
      'UFO74: tente isso com o protocolo de override.',
    '       type: override protocol COLHEITA':
      '       digite: override protocol COLHEITA',
    'Maximum attempts exceeded.': 'Número máximo de tentativas excedido.',
    'UFO74: damn. you ran out of tries hackerkid.':
      'UFO74: droga. você ficou sem tentativas, hackerkid.',
    '       the message was "COLHEITA" — means "HARVEST".':
      '       a mensagem era "COLHEITA" — significa "HARVEST".',
    '       try it with override protocol.':
      '       tente isso com override protocol.',
    'INCORRECT': 'INCORRETO',
    'UFO74: thats not it hackerkid.': 'UFO74: não é isso, hackerkid.',
    '       check the morse reference again.':
      '       confira a referência morse de novo.',
    'No morse code puzzle active.': 'Nenhum quebra-cabeça de código morse está ativo.',
    'Morse code entry cancelled.': 'Entrada de código morse cancelada.',
    'You can try again later with "morse <message>".':
      'Você pode tentar de novo depois com "morse <message>".',

    // Evidence file reactions (UFO74)
    'interesting kid. we can leak this. not a clear evidence — but they were really hiding something.':
      'interessante, kid. dá pra vazar isso. não é prova direta — mas eles estavam escondendo alguma coisa séria.',
    'operation prato. the air force documented everything in 77. then buried it.':
      'operação prato. a aeronáutica documentou tudo em 77. depois enterrou.',
    'analyze biological material? that thing looks like a good old alien to me, kid.':
      'analisar material biológico? pra mim aquela coisa é o bom e velho alienígena, kid.',
    'thirty rotations. 2026. kid that is this year. i feel something bad will happen...':
      'trinta rotações. 2026. kid, é esse ano. eu sinto que uma coisa ruim vai acontecer...',
    'non-arrival colonization. they do not need to come here. they never did.':
      'colonização sem chegada. não precisam vir aqui. nunca precisaram.',
    'second deployment. there was a second wave. there was always going to be.':
      'segundo desdobramento. teve uma segunda onda. sempre ia ter.',
    'all hands on deck. no explanation. just... everyone.':
      'todos a postos. sem explicação. só... todo mundo.',
    'one name redacted. even from a birthday list.':
      'um nome redigido. até numa lista de aniversariantes.',
    'stress management workshop. right after the incident. subtle.':
      'workshop de manejo de estresse. logo depois do incidente. sutil.',
    'every extension. every name. some of these people vanished.':
      'cada ramal. cada nome. algumas dessas pessoas sumiram.',
    'cancelled vacation. no reason given. just "incident."':
      'férias canceladas. sem motivo. só "incidente."',
    'new hours starting the 20th. they were expecting a long night.':
      'horário novo a partir do dia 20. esperavam uma noite longa.',
    'resurfacing a parking lot during a coverup. convenient.':
      'repavimentar um estacionamento no meio de um encobrimento. conveniente.',
    'cold storage failure. classified spoilage. you know what was in there.':
      'falha na câmara fria. estrago classificado. você sabe o que tava lá dentro.',
    'classified item in lost and found. someone dropped something.':
      'item classificado no achados e perdidos. alguém deixou cair alguma coisa.',
    'sector 7 budget. look at the equipment line. that is not office gear.':
      'orçamento do setor 7. olha a linha de equipamentos. isso não é material de escritório.',
    'correction fluid. twelve bottles. a lot of things to erase.':
      'corretivo líquido. doze vidros. bastante coisa pra apagar.',
    'printer jams for weeks. a lot of paper going through that machine.':
      'impressora travando há semanas. muito papel passando por aquela máquina.',
    'badge renewal. perfect excuse to revoke someone quietly.':
      'renovação de crachá. desculpa perfeita pra revogar alguém na surdina.',
    'they had time to audit paper clips. while people disappeared.':
      'tiveram tempo de auditar clipes de papel. enquanto pessoas sumiam.',
    'generator test postponed. they needed it running for something else.':
      'teste do gerador adiado. precisavam ele rodando pra outra coisa.',
    'last normal menu before the 20th. enjoy the feijoada.':
      'último cardápio normal antes do dia 20. aproveita a feijoada.',
    'three specimens. they called it a chemical spill.':
      'três espécimes. chamaram de vazamento químico.',
    'they were still serving lunch. while storing a body downstairs.':
      'ainda serviam almoço. enquanto guardavam um corpo no subsolo.',
    'broken coffee machine. three weeks. nobody came to fix anything.':
      'máquina de café quebrada. três semanas. ninguém foi consertar nada.',
    'é tetra. three times per hour. at least someone was happy once.':
      'é tetra. três vezes por hora. pelo menos alguém ficou feliz uma vez.',
    '142 kilometers in one night. classified driver. classified destination.':
      '142 quilômetros em uma noite. motorista classificado. destino classificado.',
    'normal parking rules. at a facility that does not officially exist.':
      'regras normais de estacionamento. numa instalação que oficialmente não existe.',
    'someone lost reading glasses near the conference room. saw too much.':
      'alguém perdeu óculos de leitura perto da sala de conferências. viu demais.',
    'coffee harvest report. same region. same soil. same everything.':
      'relatório de safra do café. mesma região. mesmo solo. mesmo tudo.',
    'clear skies over varginha. perfect visibility. that was the problem.':
      'céu limpo sobre varginha. visibilidade perfeita. esse era o problema.',
    'election year. the mayor knew nothing. officially.':
      'ano de eleição. o prefeito não sabia de nada. oficialmente.',
    'public safety got twelve percent. they needed every centavo that week.':
      'segurança pública ficou com doze por cento. precisaram de cada centavo naquela semana.',
    'military freight at 3:30 am. three covered cars. nobody looked inside.':
      'frete militar às 3:30 da manhã. três carros cobertos. ninguém olhou dentro.',
    'they called the fire dept too. then someone called them off.':
      'chamaram os bombeiros também. aí alguém cancelou.',
    'i wrote that script. in case they cut me off.':
      'eu escrevi esse script. caso me cortassem.',
    'old utility. someone used it the night of the 20th.':
      'utilitário antigo. alguém usou na noite do dia 20.',
    'that crash was not random. something triggered it from inside.':
      'aquele crash não foi aleatório. alguma coisa disparou por dentro.',
    'rot13. amateur cipher. but the message underneath is not amateur.':
      'rot13. cifra amadora. mas a mensagem por baixo não é amadora.',
    '28.8 modem. geocities. someone was uploading before they got caught.':
      'modem 28.8. geocities. alguém tava subindo coisa antes de ser pego.',
    'that sig file. i know whose terminal that was.':
      'aquele arquivo sig. eu sei de quem era aquele terminal.',
    'honeypot. do not trust filenames that scream at you.':
      'honeypot. não confie em arquivos que gritam com você.',
    'decoy file. they put these everywhere to catch people like us.':
      'arquivo isca. espalham esses por tudo pra pegar gente como a gente.',
    'trap. real classified files never advertise themselves.':
      'armadilha. arquivo classificado de verdade nunca se anuncia.',
    'obvious bait. real proof does not come with a label.':
      'isca na cara. prova de verdade não vem com etiqueta.',
    'the original statement. before they rewrote her words.':
      'a declaração original. antes de reescreverem as palavras dela.',
    'the first draft. they removed the parts about cognitive persistence.':
      'o primeiro rascunho. tiraram as partes sobre persistência cognitiva.',
    'three biologics confirmed. one responsive. read that again.':
      'três biológicos confirmados. um responsivo. leia de novo.',
    'costa. they erased him. like he never existed.':
      'costa. apagaram ele. como se nunca tivesse existido.',
    'project seed. they had a name for it. they had a plan.':
      'projeto semente. tinham um nome pra isso. tinham um plano.',
    'it just stopped. no trauma. no illness. it chose to stop.':
      'simplesmente parou. sem trauma. sem doença. escolheu parar.',
    'operation colheita. harvest. they named it harvest.':
      'operação colheita. colheita. deram o nome de colheita.',
    'bio-b caused headaches within three meters. without touching anyone.':
      'bio-b causava dor de cabeça num raio de três metros. sem encostar em ninguém.',
    'theta-wave sync. it was in their heads. literally.':
      'sincronia de ondas teta. estava na cabeça deles. literalmente.',
    'langley knew. within 72 hours. they always know.':
      'langley sabia. em 72 horas. eles sempre sabem.',
    'september 2026. we are running out of time.':
      'setembro de 2026. o tempo tá acabando.',
    'they flagged your session. they are watching you right now. keep going anyway.':
      'flagaram sua sessão. tão te vigiando agora. continua assim mesmo.',
    'lighting anomalies in moon footage. funny how every government has the same playbook for things that look wrong.':
      'anomalias de iluminação em imagens da lua. engraçado como todo governo usa o mesmo manual pra coisas que parecem erradas.',
    'modernization. that is what they call it when they replace the photos that show too much.':
      'modernização. é como chamam quando substituem as fotos que mostram demais.',
    'transfer from holding-7. rejected. no destination. someone chickened out at the last second.':
      'transferência da contenção-7. rejeitada. sem destino. alguém amarelou no último segundo.',
    'surveillance pigeons. battery-powered. with audio-video payloads. and people laugh at conspiracy theorists.':
      'pombos de vigilância. à bateria. com carga útil de áudio e vídeo. e ainda riem dos teóricos da conspiração.',
    'acoustic influence on consumer behavior. background music that makes you buy things. or believe things. or forget things.':
      'influência acústica no comportamento do consumidor. música ambiente que faz você comprar. ou acreditar. ou esquecer.',
    'C-O-L-H-E-I-T-A. colheita. harvest. they hid the access code in plain sight using farm words. varginha is farm country.':
      'C-O-L-H-E-I-T-A. colheita. harvest. esconderam o código de acesso à vista, em linguagem de roça. varginha é região de roça.',
    'the system knows what you are doing kid. it is measuring how close you are. keep collecting.':
      'o sistema sabe o que você tá fazendo, kid. ele tá medindo quão perto você chegou. continua coletando.',
    'passive audio collection through home devices. in 1995. imagine what they can do now with a phone in every pocket.':
      'coleta passiva de áudio por aparelhos domésticos. em 1995. imagina o que eles fazem agora com celular no bolso de cada um.',
    'someone built this tool to recover what was deleted. they knew files would disappear. smart person.':
      'alguém fez essa ferramenta pra recuperar o que foi apagado. sabiam que arquivos iam sumir. pessoa esperta.',
    'distributed ledger monetary system. in 1995. they had cryptocurrency before anyone had a name for it.':
      'sistema monetário de livro-razão distribuído. em 1995. eles tinham criptomoeda antes de isso ter nome.',
    'they were editing what kids learn in school. you control the future by controlling what gets taught. classic.':
      'estavam editando o que as crianças aprendem na escola. controla-se o futuro controlando o que se ensina. clássico.',
    'you found it. you found me. i did not think anyone would dig this deep.':
      'você achou. você me achou. não achei que alguém ia cavar tão fundo.',
    'residual session. someone was here before you. they accessed the same files. they did not make it out.':
      'sessão residual. alguém esteve aqui antes de você. acessou os mesmos arquivos. não saiu vivo.',
    'cross-dimensional correlation. they want you to connect physical assets, communications, and oversight. that is what the dossier is for.':
      'correlação cross-dimensional. querem que você conecte ativos físicos, comunicações e supervisão. é pra isso que serve o dossiê.',
    'exercise dark winter. they practiced shutting everything down. seventy-two hours became a hundred and sixty-eight. they liked what they saw.':
      'exercício dark winter. treinaram pra desligar tudo. setenta e duas horas viraram cento e sessenta e oito. gostaram do que viram.',
    'flood networks with fakes. pressure witnesses to recant. that is containment doctrine. they wrote it down like a recipe.':
      'inundar redes com falsificações. pressionar testemunhas a se retratarem. é doutrina de contenção. escreveram isso como receita.',
    'the admin left breadcrumbs. recover. trace. scan. tools they did not put in the manual. someone wanted you to find them.':
      'o admin deixou migalhas. recover. trace. scan. ferramentas que não colocaram no manual. alguém queria que você encontrasse.',
    'overactive imaginations. that is what they told the press. the press printed it. nobody asked a follow-up question.':
      'imaginação fértil demais. foi o que contaram pra imprensa. a imprensa imprimiu. ninguém fez uma segunda pergunta.',
    'laundry and birthdays. normal life. and then — special cargo in a temperature-controlled basement. ammonia and wet earth. kid. that is not normal.':
      'lavanderia e aniversários. vida normal. e aí — carga especial num subsolo climatizado. amônia e terra úmida. kid. isso não é normal.',
    'override codes for restricted access. someone left the instructions right here in the system. on purpose.':
      'códigos de override pra acesso restrito. alguém deixou as instruções aqui no sistema. de propósito.',
    'the system is watching your patterns. every file you open. every command you type. it sees what you are building.':
      'o sistema tá observando seus padrões. cada arquivo que você abre. cada comando que você digita. ele vê o que você tá montando.',
    'ferreira transferred to brasília. lima to são paulo. they scattered everyone who saw something. standard procedure.':
      'ferreira transferido pra brasília. lima pra são paulo. dispersaram todo mundo que viu alguma coisa. procedimento padrão.',
    'the 2026 window. kid. that is now. we are inside it right now. and the model says panic and collapse.':
      'a janela de 2026. kid. é agora. a gente tá dentro dela agora. e o modelo diz pânico e colapso.',
    'phase two is already underway. that is not a code. that is a warning. and whoever left this card wanted it found.':
      'fase dois já tá em andamento. isso não é código. é aviso. e quem deixou esse cartão queria que fosse achado.',
    'orbital reflective arrays for psychological operations. lights in the sky that are not ufos. just government mirrors. sure.':
      'arranjos refletores orbitais pra operações psicológicas. luzes no céu que não são ufos. só espelhos do governo. aham.',
    'read-only access. incident reconstruction. that is what they think you are doing here. let them think that.':
      'acesso só de leitura. reconstrução de incidente. é isso que eles pensam que você tá fazendo. deixa eles pensarem.',
    'the system flagged you as a deliberate collector. it knows you are assembling the picture. we should have purged this terminal. too late now.':
      'o sistema te classificou como coletor deliberado. ele sabe que você tá montando o quebra-cabeça. a gente devia ter purgado esse terminal. agora é tarde.',
    'my transfer papers. base aérea de guarulhos. i left something in that authorization. on purpose.':
      'meus papéis de transferência. base aérea de guarulhos. deixei uma coisa naquela autorização. de propósito.',
    'share nothing beyond your scope. i broke that rule. every single day for thirty years. and i would do it again.':
      'não compartilhe nada além do seu escopo. quebrei essa regra. todo dia durante trinta anos. e quebraria de novo.',
    'my last transmission from inside the system. march 96. three in the morning. i did not know if anyone would ever hear it.':
      'minha última transmissão de dentro do sistema. março de 96. três da manhã. eu não sabia se alguém ia ouvir algum dia.',
    'aerosol dispersal over civilian areas. project cirrus. they called it weather modification. it was not about the weather.':
      'dispersão de aerossóis sobre áreas civis. projeto cirrus. chamaram de modificação climática. não era sobre clima.',

    // ═══ Ending translations ═══

    // ENDING 1: ridiculed
    'RIDICULED': 'RIDICULARIZADO',
    'The leak that proved nothing.': 'O vazamento que não provou nada.',
    'The dossier surfaces on three forums and a defunct Geocities mirror. A television host holds up a printout and laughs for six minutes straight. The military issues no denial because none is required.':
      'O dossiê aparece em três fóruns e num espelho defunto do Geocities. Um apresentador de TV levanta uma impressão e ri por seis minutos seguidos. Os militares não emitem nenhum desmentido porque nenhum é necessário.',
    'Within forty-eight hours the files are catalogued alongside crop circles, chemtrails, and faith healers. Your name never enters the public record. The word "hoax" is generous — most call it fan fiction.':
      'Em quarenta e oito horas os arquivos são catalogados junto com círculos nas plantações, chemtrails e curandeiros. Seu nome nunca entra nos registros públicos. A palavra "farsa" é generosa — a maioria chama de fan fiction.',
    'The archive rots on a server in São Paulo. Nobody downloads it. The password expires. Varginha remains a punchline.':
      'O arquivo apodrece num servidor em São Paulo. Ninguém baixa. A senha expira. Varginha continua sendo piada.',
    'you gave them noise. they needed signal.': 'você deu ruído pra eles. precisavam de sinal.',
    'INTERNET HOAX ALERT: \'CLASSIFIED UFO FILES\' FROM BRAZIL DISMISSED AS PRANK':
      'ALERTA DE FARSA NA INTERNET: \'ARQUIVOS OVNI SECRETOS\' DO BRASIL DESCARTADOS COMO PEGADINHA',
    'USAF spokesperson calls documents \'creative fiction\' — Brazilian Air Force declines comment — Internet forums debate authenticity':
      'Porta-voz da USAF chama documentos de \'ficção criativa\' — Força Aérea Brasileira recusa comentar — Fóruns da Internet debatem autenticidade',
    'VARGINHA, Brazil (AP) — A collection of documents purporting to be classified military files about an alleged \'unidentified flying object\' incident in southern Brazil surfaced on several Internet bulletin boards late Tuesday, drawing immediate skepticism from experts and officials alike.':
      'VARGINHA, Brasil (AP) — Uma coleção de documentos que supostamente seriam arquivos militares secretos sobre um alegado incidente com \'objeto voador não identificado\' no sul do Brasil apareceu em vários fóruns da Internet na terça-feira à noite, gerando ceticismo imediato de especialistas e autoridades.',
    'The files, which appear to describe military operations in the city of Varginha in January of this year, were reportedly obtained through an unauthorized computer intrusion. Air Force officials in Brasília declined to comment, noting only that the documents \'do not correspond to any known military operation.\'':
      'Os arquivos, que parecem descrever operações militares na cidade de Varginha em janeiro deste ano, teriam sido obtidos por meio de uma invasão não autorizada a computadores. Autoridades da Força Aérea em Brasília recusaram comentar, observando apenas que os documentos \'não correspondem a nenhuma operação militar conhecida.\'',
    'Dr. Harold Simmons of the Center for Scientific Inquiry called the documents \'an elaborate but ultimately unconvincing fabrication,\' pointing to what he described as \'inconsistencies in formatting and terminology that suggest a civilian author with limited military knowledge.\'':
      'O Dr. Harold Simmons do Centro de Investigação Científica chamou os documentos de \'uma fabricação elaborada mas no fim das contas pouco convincente,\' apontando o que ele descreveu como \'inconsistências de formatação e terminologia que sugerem um autor civil com conhecimento militar limitado.\'',

    // ENDING 2: ufo74_exposed
    'UFO74 EXPOSED': 'UFO74 EXPOSTO',
    'The ghost had a name all along.': 'O fantasma sempre teve um nome.',
    'The decrypted file spreads before anyone can suppress it. Carlos Eduardo Ferreira — intelligence officer, Brazilian Air Force, stationed at Guarulhos in 1996. Thirty years building the archive in secret.':
      'O arquivo descriptografado se espalha antes que alguém consiga suprimi-lo. Carlos Eduardo Ferreira — oficial de inteligência, Força Aérea Brasileira, estacionado em Guarulhos em 1996. Trinta anos construindo o arquivo em segredo.',
    'Military intelligence confirms the service record within hours. The denial is immediate, automatic, and too late. Ferreira\'s face is on every screen in the country. He never wanted fame. He wanted someone to believe him.':
      'A inteligência militar confirma a ficha de serviço em poucas horas. A negação é imediata, automática e tardia demais. O rosto de Ferreira está em todas as telas do país. Ele nunca quis fama. Queria que alguém acreditasse nele.',
    'The Air Force opens an internal inquiry. Three generals retire early. The archive survives because it was already everywhere. UFO74 is no longer a call sign. It is a name.':
      'A Força Aérea abre uma investigação interna. Três generais se aposentam antecipadamente. O arquivo sobrevive porque já estava em todo lugar. UFO74 não é mais um indicativo de chamada. É um nome.',
    'you found me. now finish what i started.': 'você me achou. agora termine o que eu comecei.',
    'MILITARY OFFICER IDENTIFIED AS SOURCE OF CLASSIFIED BRAZILIAN DATA LEAK':
      'OFICIAL MILITAR IDENTIFICADO COMO FONTE DE VAZAMENTO DE DADOS SECRETOS BRASILEIROS',
    'Carlos E. Ferreira, Brazilian Air Force intelligence — service record confirmed — three generals request early retirement':
      'Carlos E. Ferreira, inteligência da Força Aérea Brasileira — ficha de serviço confirmada — três generais pedem aposentadoria antecipada',
    'BRASÍLIA, Brazil (Reuters) — A decrypted computer file circulating on the Internet has identified a Brazilian Air Force intelligence officer as the source of a massive unauthorized disclosure of classified military documents, according to officials familiar with the matter.':
      'BRASÍLIA, Brasil (Reuters) — Um arquivo de computador descriptografado circulando na Internet identificou um oficial de inteligência da Força Aérea Brasileira como a fonte de uma enorme divulgação não autorizada de documentos militares secretos, segundo autoridades familiarizadas com o caso.',
    'The officer, identified as Carlos Eduardo Ferreira, was reportedly stationed at Guarulhos Air Base during the period described in the leaked files. Military intelligence confirmed the service record within hours of the file\'s release, though a spokesperson declined to comment on the substance of the allegations.':
      'O oficial, identificado como Carlos Eduardo Ferreira, estava supostamente estacionado na Base Aérea de Guarulhos durante o período descrito nos arquivos vazados. A inteligência militar confirmou a ficha de serviço poucas horas após a divulgação do arquivo, embora um porta-voz tenha se recusado a comentar sobre o conteúdo das alegações.',
    'Three senior Air Force generals have submitted requests for early retirement in what analysts describe as an attempt to distance themselves from the growing scandal. The leaked archive, which Ferreira allegedly maintained for decades, contains documents related to military operations in southern Minas Gerais state.':
      'Três generais seniores da Força Aérea submeteram pedidos de aposentadoria antecipada no que analistas descrevem como uma tentativa de se distanciar do escândalo crescente. O arquivo vazado, que Ferreira supostamente manteve por décadas, contém documentos relacionados a operações militares no sul de Minas Gerais.',

    // ENDING 3: the_2026_warning
    'THE 2026 WARNING': 'O ALERTA DE 2026',
    'Thirty rotations. The clock does not stop.': 'Trinta rotações. O relógio não para.',
    'The convergence data hits academic servers first. Physicists in three countries confirm the thirty-year cycle independently. 1947. 1977. 1996. The pattern is clean, the projection is specific: September 2026, plus or minus two months.':
      'Os dados de convergência chegam nos servidores acadêmicos primeiro. Físicos em três países confirmam o ciclo de trinta anos independentemente. 1947. 1977. 1996. O padrão é limpo, a projeção é específica: setembro de 2026, mais ou menos dois meses.',
    'Governments issue no statements. Private aerospace firms begin relocating satellite arrays. The Brazilian Air Force reclassifies seven archived directives without explanation.':
      'Governos não emitem declarações. Empresas aeroespaciais privadas começam a reposicionar conjuntos de satélites. A Força Aérea Brasileira reclassifica sete diretivas arquivadas sem explicação.',
    'The public does not panic because the public does not understand logarithmic signal propagation. Those who do understand have gone very quiet.':
      'O público não entra em pânico porque o público não entende propagação logarítmica de sinais. Quem entende ficou muito quieto.',
    'the window is real. you gave them time.': 'a janela é real. você deu tempo a eles.',
    'SCIENTISTS IDENTIFY 30-YEAR PATTERN IN UNEXPLAINED ATMOSPHERIC EVENTS':
      'CIENTISTAS IDENTIFICAM PADRÃO DE 30 ANOS EM EVENTOS ATMOSFÉRICOS INEXPLICÁVEIS',
    'Next predicted occurrence: September 2026 — private aerospace firms reportedly repositioning satellite arrays — no official comment':
      'Próxima ocorrência prevista: setembro de 2026 — empresas aeroespaciais estariam reposicionando conjuntos de satélites — sem comentário oficial',
    'GENEVA, Switzerland (AP) — Physicists at three independent research institutions have confirmed the existence of a thirty-year cyclical pattern in atmospheric anomaly data, according to a joint preliminary report released Wednesday. The pattern, if validated, would predict a significant event window in late 2026.':
      'GENEBRA, Suíça (AP) — Físicos em três instituições de pesquisa independentes confirmaram a existência de um padrão cíclico de trinta anos em dados de anomalias atmosféricas, segundo um relatório preliminar conjunto divulgado na quarta-feira. O padrão, se validado, preveria uma janela de evento significativo no final de 2026.',
    'The analysis was prompted by documents leaked from a Brazilian military archive earlier this month. While the researchers declined to speculate on the nature of the anomalies, they confirmed the mathematical model described in the leaked files is \'internally consistent and statistically significant.\'':
      'A análise foi motivada por documentos vazados de um arquivo militar brasileiro no início deste mês. Embora os pesquisadores tenham se recusado a especular sobre a natureza das anomalias, confirmaram que o modelo matemático descrito nos arquivos vazados é \'internamente consistente e estatisticamente significativo.\'',
    'Several private aerospace companies have begun what industry sources describe as \'precautionary repositioning\' of satellite monitoring arrays, though none would confirm a connection to the leaked data. The Brazilian government has issued no statement.':
      'Várias empresas aeroespaciais privadas iniciaram o que fontes do setor descrevem como \'reposicionamento preventivo\' de conjuntos de monitoramento por satélite, embora nenhuma tenha confirmado conexão com os dados vazados. O governo brasileiro não emitiu declaração.',

    // ENDING 4: government_scandal
    'BRAZILIAN GOVERNMENT SCANDAL': 'ESCÂNDALO DO GOVERNO BRASILEIRO',
    'The coverup was bigger than the event.': 'O acobertamento foi maior que o evento.',
    'Transport logs. Response orders. Incident reports signed by officers who officially never existed. The leak does not prove alien contact — it proves the Brazilian military mobilized an entire region to hide something on January 20, 1996.':
      'Registros de transporte. Ordens de resposta. Relatórios de incidentes assinados por oficiais que oficialmente nunca existiram. O vazamento não prova contato alienígena — prova que os militares brasileiros mobilizaram uma região inteira para esconder algo em 20 de janeiro de 1996.',
    'Congressional inquiries open in Brasília. Three colonels are subpoenaed. One refuses to testify. The Jardim Andere site is cordoned off for "environmental assessment" that never produces a report.':
      'Inquéritos parlamentares são abertos em Brasília. Três coronéis são intimados. Um se recusa a testemunhar. O local do Jardim Andere é isolado para "avaliação ambiental" que nunca produz um relatório.',
    'The question shifts. It is no longer about what landed. It is about who authorized the silence, who paid for it, and where the bodies went.':
      'A pergunta muda. Não é mais sobre o que pousou. É sobre quem autorizou o silêncio, quem pagou por ele e pra onde os corpos foram.',
    'they will sacrifice officers to protect the secret.': 'eles vão sacrificar oficiais pra proteger o segredo.',
    'LEAKED DOCUMENTS REVEAL MASSIVE BRAZILIAN MILITARY OPERATION IN VARGINHA':
      'DOCUMENTOS VAZADOS REVELAM GRANDE OPERAÇÃO MILITAR BRASILEIRA EM VARGINHA',
    'Transport logs and response orders prove classified mobilization — three colonels subpoenaed — Congressional inquiry opens in Brasília':
      'Registros de transporte e ordens de resposta provam mobilização sigilosa — três coronéis intimados — inquérito parlamentar aberto em Brasília',
    'BRASÍLIA, Brazil (AP) — Classified military documents leaked to the Internet this week reveal what appears to be a large-scale Brazilian Army operation in the southern city of Varginha in January 1996, involving troop movements, vehicle requisitions, and command orders that were never disclosed to the public or to civilian authorities.':
      'BRASÍLIA, Brasil (AP) — Documentos militares secretos vazados na Internet esta semana revelam o que parece ser uma operação em larga escala do Exército Brasileiro na cidade de Varginha, no sul de Minas, em janeiro de 1996, envolvendo movimentações de tropas, requisições de veículos e ordens de comando que nunca foram divulgadas ao público ou às autoridades civis.',
    'The documents include transport logs, incident reports signed by officers whose service records contain no reference to the operation, and response orders authorizing the cordoning of a residential area described only as \'the Jardim Andere site.\' The purpose of the operation is not specified in any of the recovered files.':
      'Os documentos incluem registros de transporte, relatórios de incidentes assinados por oficiais cujas fichas de serviço não contêm referência à operação, e ordens de resposta autorizando o isolamento de uma área residencial descrita apenas como \'o local do Jardim Andere.\' O propósito da operação não é especificado em nenhum dos arquivos recuperados.',
    'Three colonels have been subpoenaed to testify before a Congressional committee in Brasília. One has reportedly refused. The Ministry of Defense issued a brief statement calling the documents \'unverified\' but did not deny their authenticity.':
      'Três coronéis foram intimados a testemunhar perante uma comissão do Congresso em Brasília. Um teria se recusado. O Ministério da Defesa emitiu uma breve declaração chamando os documentos de \'não verificados\', mas não negou sua autenticidade.',

    // ENDING 5: prisoner_45_freed
    'PRISONER 45 FREED': 'PRISIONEIRO 45 LIBERTADO',
    'The containment logs were never supposed to leave.': 'Os registros de contenção nunca deviam ter saído.',
    'Bio-containment records. Neural dump data. Ethics exceptions signed by committee. The dossier does not show a captured animal — it shows a detained intelligence, held in a Faraday cage for eleven days while handlers reported headaches and cognitive intrusion.':
      'Registros de biocontenção. Dados de despejo neural. Exceções éticas assinadas por comitê. O dossiê não mostra um animal capturado — mostra uma inteligência detida, mantida numa gaiola de Faraday por onze dias enquanto os manipuladores relatavam dores de cabeça e intrusão cognitiva.',
    'The witness statements give it weight. The sisters. The patrol officers. The veterinarian they silenced. Each testimony corroborates the containment timeline independently.':
      'Os depoimentos das testemunhas dão peso. As irmãs. Os policiais da patrulha. O veterinário que eles silenciaram. Cada testemunho corrobora a linha do tempo da contenção independentemente.',
    'A São Paulo judge orders the military to produce "all biological materials recovered January 1996." The military responds that no such materials exist. The containment logs say otherwise.':
      'Um juiz de São Paulo ordena que os militares apresentem "todos os materiais biológicos recuperados em janeiro de 1996." Os militares respondem que tais materiais não existem. Os registros de contenção dizem o contrário.',
    'it was never a specimen. it was a prisoner.': 'nunca foi um espécime. era um prisioneiro.',
    'CLASSIFIED LOGS DESCRIBE \'NON-HUMAN ENTITY\' DETAINED IN MILITARY FACILITY':
      'REGISTROS SECRETOS DESCREVEM \'ENTIDADE NÃO HUMANA\' DETIDA EM INSTALAÇÃO MILITAR',
    'Bio-containment records leaked — handlers reported \'cognitive intrusion\' — São Paulo judge demands military disclosure':
      'Registros de biocontenção vazados — manipuladores relataram \'intrusão cognitiva\' — juiz de São Paulo exige divulgação militar',
    'SÃO PAULO, Brazil (UPI) — Leaked bio-containment records from a Brazilian military facility describe what personnel referred to as a \'detained biological intelligence\' held for eleven days in a Faraday-shielded chamber, according to documents released on the World Wide Web late Thursday.':
      'SÃO PAULO, Brasil (UPI) — Registros de biocontenção vazados de uma instalação militar brasileira descrevem o que o pessoal chamou de \'inteligência biológica detida\' mantida por onze dias numa câmara blindada por Faraday, segundo documentos divulgados na World Wide Web na quinta-feira à noite.',
    'The logs, which include ethics exception forms signed by a medical committee, describe handlers experiencing \'persistent headaches and reported cognitive intrusion events\' during the detention period. The entity, designated as \'Specimen Alpha\' in some documents and \'Prisoner 45\' in others, is described as exhibiting \'responsive behavior inconsistent with any known terrestrial species.\'':
      'Os registros, que incluem formulários de exceção ética assinados por um comitê médico, descrevem manipuladores experimentando \'dores de cabeça persistentes e eventos de intrusão cognitiva relatados\' durante o período de detenção. A entidade, designada como \'Espécime Alpha\' em alguns documentos e \'Prisioneiro 45\' em outros, é descrita como exibindo \'comportamento responsivo inconsistente com qualquer espécie terrestre conhecida.\'',
    'A judge in São Paulo has ordered the military to produce \'all biological materials recovered in January 1996.\' The military responded Friday that no such materials exist. The leaked containment logs appear to contradict this statement directly.':
      'Um juiz em São Paulo ordenou que os militares apresentem \'todos os materiais biológicos recuperados em janeiro de 1996.\' Os militares responderam na sexta-feira que tais materiais não existem. Os registros de contenção vazados parecem contradizer diretamente esta declaração.',

    // ENDING 6: harvest_understood
    'THE HARVEST UNDERSTOOD': 'A COLHEITA COMPREENDIDA',
    'Colonization does not require arrival.': 'Colonização não requer chegada.',
    'The extraction documents land in the wrong hands — or the right ones. The colonization model. The harvest timeline. The mechanism that requires no ships, no invasion, no contact at all.':
      'Os documentos de extração caem nas mãos erradas — ou nas certas. O modelo de colonização. O cronograma da colheita. O mecanismo que não requer naves, nenhuma invasão, nenhum contato.',
    'Three universities publish independent analyses within a month. The consensus is clinical and devastating: the model is internally consistent, the energy mathematics are sound, and the thirty-year seeding cycle aligns with observed neurological data.':
      'Três universidades publicam análises independentes em um mês. O consenso é clínico e devastador: o modelo é internamente consistente, a matemática energética é sólida, e o ciclo de semeadura de trinta anos se alinha com dados neurológicos observados.',
    'Nobody wants to say the word "colonization" on television. They use "resource assessment" instead. It means the same thing.':
      'Ninguém quer dizer a palavra "colonização" na televisão. Usam "avaliação de recursos" no lugar. Significa a mesma coisa.',
    'they do not need to come here. they never did.': 'eles não precisam vir aqui. nunca precisaram.',
    'LEAKED THEORY DESCRIBES \'COLONIZATION WITHOUT ARRIVAL\' BY UNKNOWN INTELLIGENCE':
      'TEORIA VAZADA DESCREVE \'COLONIZAÇÃO SEM CHEGADA\' POR INTELIGÊNCIA DESCONHECIDA',
    'Three universities confirm energy mathematics — \'internally consistent,\' researchers say — no government comment':
      'Três universidades confirmam matemática energética — \'internamente consistente,\' dizem pesquisadores — sem comentário do governo',
    'CAMBRIDGE, Mass. (AP) — Documents leaked from a classified Brazilian military archive describe a theoretical model for what the files term \'non-arrival colonization\' — a process by which an unknown intelligence could extract resources from a planetary system without physical presence or direct contact, according to an analysis published Thursday by researchers at MIT.':
      'CAMBRIDGE, Mass. (AP) — Documentos vazados de um arquivo militar brasileiro secreto descrevem um modelo teórico para o que os arquivos chamam de \'colonização sem chegada\' — um processo pelo qual uma inteligência desconhecida poderia extrair recursos de um sistema planetário sem presença física ou contato direto, segundo uma análise publicada na quinta-feira por pesquisadores do MIT.',
    'Three universities have now independently reviewed the leaked extraction model and confirmed that its energy mathematics are, in the words of one physicist, \'disturbingly sound.\' The model describes a thirty-year seeding cycle that researchers say aligns with observed neurological data from the Brazilian military\'s own classified medical files.':
      'Três universidades revisaram independentemente o modelo de extração vazado e confirmaram que sua matemática energética é, nas palavras de um físico, \'perturbadoramente sólida.\' O modelo descreve um ciclo de semeadura de trinta anos que pesquisadores dizem se alinhar com dados neurológicos observados dos próprios arquivos médicos secretos dos militares brasileiros.',
    'No government has issued a formal response. Television commentators have avoided the word \'colonization,\' preferring the term \'resource assessment.\' Scientists familiar with the data say the distinction is academic.':
      'Nenhum governo emitiu resposta formal. Comentaristas de televisão evitaram a palavra \'colonização,\' preferindo o termo \'avaliação de recursos.\' Cientistas familiarizados com os dados dizem que a distinção é acadêmica.',

    // ENDING 7: nothing_changes
    'NOTHING CHANGES': 'NADA MUDA',
    'The truth arrived. Nobody moved.': 'A verdade chegou. Ninguém se mexeu.',
    'The dossier is strong. Autopsy reports. Field observations. Military intercepts. Enough to establish that something non-human was recovered in Varginha in January 1996. Enough to demand answers.':
      'O dossiê é forte. Laudos de autópsia. Observações de campo. Interceptações militares. O suficiente pra estabelecer que algo não humano foi recuperado em Varginha em janeiro de 1996. O suficiente pra exigir respostas.',
    'Panels convene. Experts testify. The footage circulates. For two weeks, the world pays attention. Then an election cycle begins, a currency collapses, a celebrity dies, and the feed moves on.':
      'Painéis se reúnem. Especialistas testemunham. As imagens circulam. Por duas semanas, o mundo presta atenção. Aí começa um ciclo eleitoral, uma moeda desaba, uma celebridade morre, e o feed segue em frente.',
    'The files remain available. Downloaded fourteen million times. Cited in zero policy changes. The truth is free and weightless.':
      'Os arquivos continuam disponíveis. Baixados catorze milhões de vezes. Citados em zero mudanças de política. A verdade é livre e sem peso.',
    'you proved everything. it was not enough.': 'você provou tudo. não foi suficiente.',
    'VARGINHA FILES DOWNLOADED 14 MILLION TIMES; GOVERNMENTS WORLDWIDE SILENT':
      'ARQUIVOS DE VARGINHA BAIXADOS 14 MILHÕES DE VEZES; GOVERNOS DO MUNDO TODO EM SILÊNCIO',
    'Evidence called \'compelling\' by experts — zero policy changes — election coverage resumes':
      'Evidências chamadas de \'convincentes\' por especialistas — zero mudanças de política — cobertura eleitoral retomada',
    'NEW YORK (AP) — The collection of classified military documents known as the \'Varginha Files\' has been downloaded more than fourteen million times since its release on the Internet two weeks ago, making it one of the most widely distributed document leaks in the brief history of the World Wide Web. Despite this, no government has issued a formal response.':
      'NOVA YORK (AP) — A coleção de documentos militares secretos conhecida como \'Arquivos de Varginha\' foi baixada mais de catorze milhões de vezes desde sua divulgação na Internet há duas semanas, tornando-se um dos maiores vazamentos de documentos na breve história da World Wide Web. Apesar disso, nenhum governo emitiu resposta formal.',
    'Panels of experts convened at universities in four countries have called the evidence \'compelling\' and \'worthy of official investigation.\' Footage from the original incident has circulated on cable news networks for approximately twelve days before being displaced by coverage of ongoing elections and financial markets.':
      'Painéis de especialistas reunidos em universidades de quatro países chamaram as evidências de \'convincentes\' e \'dignas de investigação oficial.\' Imagens do incidente original circularam em redes de notícias a cabo por aproximadamente doze dias antes de serem substituídas pela cobertura de eleições e mercados financeiros.',
    'The files remain freely available on multiple mirror sites. Analysts note that the unprecedented volume of downloads has produced no measurable political or policy impact. \'The truth is out there,\' noted one commentator. \'It turns out that is not sufficient.\'':
      'Os arquivos continuam disponíveis gratuitamente em múltiplos sites espelho. Analistas observam que o volume sem precedentes de downloads não produziu nenhum impacto político ou de políticas mensurável. \'A verdade está lá fora,\' observou um comentarista. \'Acontece que isso não é suficiente.\'',

    // ENDING 8: incomplete_picture
    'INCOMPLETE PICTURE': 'QUADRO INCOMPLETO',
    'Fragments do not make a case.': 'Fragmentos não formam um caso.',
    'The dossier contains evidence, but it tells no story. A medical report here. A transport log there. No thread connects them. No narrative emerges. The files are real and they prove nothing.':
      'O dossiê contém evidências, mas não conta nenhuma história. Um laudo médico aqui. Um registro de transporte ali. Nenhum fio os conecta. Nenhuma narrativa emerge. Os arquivos são reais e não provam nada.',
    'Debunkers dismantle the leak in a weekend. Each document, taken alone, has an innocent explanation. The military does not even need to respond. The files discredit themselves through isolation.':
      'Desmentidores desmontam o vazamento num fim de semana. Cada documento, isolado, tem uma explicação inocente. Os militares nem precisam responder. Os arquivos se desacreditam sozinhos pelo isolamento.',
    'You had the pieces. You did not assemble the picture.': 'Você tinha as peças. Não montou o quadro.',
    'scattered evidence is the same as no evidence.': 'evidência espalhada é o mesmo que nenhuma evidência.',
    'LEAKED MILITARY DOCUMENTS FAIL TO SUPPORT UFO CLAIMS, SAY ANALYSTS':
      'DOCUMENTOS MILITARES VAZADOS NÃO SUSTENTAM ALEGAÇÕES SOBRE OVNIS, DIZEM ANALISTAS',
    'Debunkers dismantle evidence in 72 hours — \'each file has innocent explanation\' — military issues no denial':
      'Desmentidores desmontam evidências em 72 horas — \'cada arquivo tem explicação inocente\' — militares não emitem desmentido',
    'WASHINGTON (AP) — A collection of documents leaked from a Brazilian military archive and purporting to describe contact with a non-human intelligence has been largely discredited by independent analysts, who say the files, while possibly authentic, fail to tell a coherent story.':
      'WASHINGTON (AP) — Uma coleção de documentos vazados de um arquivo militar brasileiro que supostamente descrevem contato com uma inteligência não humana foi amplamente desacreditada por analistas independentes, que dizem que os arquivos, embora possivelmente autênticos, não contam uma história coerente.',
    'The leak contains medical reports, transport logs, and communications intercepts, but analysts say no thread connects them into a meaningful narrative. \'Each document, taken individually, has an innocent explanation,\' said Dr. James Whitfield of Georgetown University. \'Taken together, they prove nothing more than that the Brazilian military generates paperwork.\'':
      'O vazamento contém laudos médicos, registros de transporte e interceptações de comunicações, mas analistas dizem que nenhum fio os conecta numa narrativa significativa. \'Cada documento, analisado individualmente, tem uma explicação inocente,\' disse o Dr. James Whitfield da Universidade de Georgetown. \'Juntos, não provam nada além de que os militares brasileiros geram papelada.\'',
    'The Brazilian Air Force has issued no official denial, which analysts interpret not as confirmation but as an indication that the documents do not warrant response. Several Internet forums that initially promoted the files have moved on to other topics.':
      'A Força Aérea Brasileira não emitiu nenhum desmentido oficial, o que analistas interpretam não como confirmação, mas como indicação de que os documentos não merecem resposta. Vários fóruns da Internet que inicialmente promoveram os arquivos passaram para outros assuntos.',

    // ENDING 9: wrong_story
    'THE WRONG STORY': 'A HISTÓRIA ERRADA',
    'You investigated the cafeteria.': 'Você investigou a cantina.',
    'The dossier arrives on journalists\' desks and produces genuine confusion. Budget memos. Parking allocations. A coffee harvest report. Media payment records that prove corruption but not contact.':
      'O dossiê chega nas mesas dos jornalistas e produz confusão genuína. Memorandos de orçamento. Alocações de estacionamento. Um relatório de safra de café. Registros de pagamento à mídia que provam corrupção, mas não contato.',
    'The financial angle gains traction. Three military officials face embezzlement charges. A journalist wins an award for exposing the media suppression network. The actual event — the beings, the autopsies, the containment — is never mentioned.':
      'O ângulo financeiro ganha tração. Três oficiais militares enfrentam acusações de desvio de verbas. Uma jornalista ganha um prêmio por expor a rede de supressão midiática. O evento real — os seres, as autópsias, a contenção — nunca é mencionado.',
    'You exposed a scandal. The wrong one.': 'Você expôs um escândalo. O errado.',
    'you found the lie but missed the truth behind it.': 'você achou a mentira mas perdeu a verdade por trás dela.',
    'MILITARY BUDGET SCANDAL UNCOVERED IN LEAKED BRAZILIAN DOCUMENTS':
      'ESCÂNDALO DE ORÇAMENTO MILITAR DESCOBERTO EM DOCUMENTOS BRASILEIROS VAZADOS',
    'Three officials face embezzlement charges — journalist wins award for exposé — actual UFO claims ignored':
      'Três oficiais enfrentam acusações de desvio de verbas — jornalista ganha prêmio por exposição — alegações reais sobre OVNIs ignoradas',
    'BRASÍLIA, Brazil (Reuters) — Classified documents leaked from a Brazilian military installation have led not to the confirmation of extraterrestrial contact, as the anonymous source apparently intended, but to the exposure of a significant financial corruption network within the armed forces.':
      'BRASÍLIA, Brasil (Reuters) — Documentos secretos vazados de uma instalação militar brasileira levaram não à confirmação de contato extraterrestre, como a fonte anônima aparentemente pretendia, mas à exposição de uma significativa rede de corrupção financeira dentro das forças armadas.',
    'The leaked files contain detailed budget memoranda, media payment records, and what prosecutors describe as \'a systematic program to suppress unfavorable news coverage through direct payments to journalists.\' Three senior military officials now face embezzlement and fraud charges. A reporter for Folha de São Paulo has been awarded the Maria Moors Cabot Prize for her coverage of the scandal.':
      'Os arquivos vazados contêm memorandos detalhados de orçamento, registros de pagamento à mídia, e o que promotores descrevem como \'um programa sistemático para suprimir cobertura jornalística desfavorável por meio de pagamentos diretos a jornalistas.\' Três oficiais militares seniores agora enfrentam acusações de desvio de verbas e fraude. Uma repórter da Folha de São Paulo recebeu o Prêmio Maria Moors Cabot por sua cobertura do escândalo.',
    'Notably absent from the dossier are any substantive references to the alleged non-human contact that the leaker appeared to be documenting. Analysts describe the collection as \'accidentally important for entirely the wrong reasons.\'':
      'Notavelmente ausentes do dossiê estão quaisquer referências substantivas ao alegado contato não humano que o responsável pelo vazamento parecia estar documentando. Analistas descrevem a coleção como \'acidentalmente importante por motivos completamente errados.\'',

    // ENDING 10: hackerkid_caught
    'HACKERKID CAUGHT': 'HACKERKID PEGO',
    'The honeypots worked exactly as designed.': 'Os honeypots funcionaram exatamente como planejado.',
    'Files named URGENT_classified_alpha. SMOKING_GUN_proof. FOR_PRESIDENTS_EYES_ONLY. Real classified material never advertises itself. Every file you saved was planted. Every download was logged.':
      'Arquivos chamados URGENT_classified_alpha. SMOKING_GUN_proof. FOR_PRESIDENTS_EYES_ONLY. Material sigiloso de verdade nunca se anuncia. Todo arquivo que você salvou foi plantado. Todo download foi registrado.',
    'Military cybersecurity traces the intrusion to your terminal within ninety minutes. The dossier is quarantined before it reaches a single journalist. Your access credentials are revoked, archived, and forwarded to federal prosecutors.':
      'A cibersegurança militar rastreia a invasão até o seu terminal em noventa minutos. O dossiê é posto em quarentena antes de chegar a um único jornalista. Suas credenciais de acesso são revogadas, arquivadas e encaminhadas a promotores federais.',
    'The decoy system was built for people exactly like you. Eager. Careless. Loud.':
      'O sistema de iscas foi construído pra gente exatamente como você. Ansioso. Descuidado. Barulhento.',
    'i tried to warn you. real secrets whisper.': 'tentei te avisar. segredos de verdade sussurram.',
    'COMPUTER HACKER ARRESTED AFTER DOWNLOADING MILITARY DECOY FILES':
      'HACKER DE COMPUTADOR PRESO APÓS BAIXAR ARQUIVOS MILITARES DE ISCA',
    'Cybersecurity trap worked \'exactly as designed\' — suspect traced in 90 minutes — federal charges pending':
      'Armadilha de cibersegurança funcionou \'exatamente como planejado\' — suspeito rastreado em 90 minutos — acusações federais pendentes',
    'BRASÍLIA, Brazil (AP) — Brazilian military cybersecurity personnel have arrested an individual suspected of unauthorized intrusion into a classified computer network after the suspect downloaded files that had been deliberately planted as tracking devices, officials confirmed Saturday.':
      'BRASÍLIA, Brasil (AP) — Pessoal de cibersegurança militar brasileiro prendeu um indivíduo suspeito de invasão não autorizada a uma rede de computadores sigilosa após o suspeito baixar arquivos que foram deliberadamente plantados como dispositivos de rastreamento, confirmaram autoridades no sábado.',
    'The files, with titles such as \'URGENT_classified_alpha\' and \'FOR_PRESIDENTS_EYES_ONLY,\' were designed to appeal to inexperienced intruders and contained embedded tracking mechanisms that allowed military technicians to identify the suspect\'s terminal within ninety minutes of the initial download.':
      'Os arquivos, com títulos como \'URGENT_classified_alpha\' e \'FOR_PRESIDENTS_EYES_ONLY,\' foram projetados para atrair invasores inexperientes e continham mecanismos de rastreamento embutidos que permitiram aos técnicos militares identificar o terminal do suspeito em noventa minutos após o download inicial.',
    'A military spokesperson confirmed that the decoy system, which has been in place since 1994, was built specifically to identify and apprehend \'unsophisticated intrusion attempts.\' The suspect\'s collected files were quarantined before reaching any external recipient. Federal prosecutors have been notified.':
      'Um porta-voz militar confirmou que o sistema de iscas, em funcionamento desde 1994, foi construído especificamente para identificar e apreender \'tentativas de invasão pouco sofisticadas.\' Os arquivos coletados pelo suspeito foram postos em quarentena antes de chegar a qualquer destinatário externo. Promotores federais foram notificados.',

    // ENDING 11: secret_ending
    'THE FERREIRA PROTOCOL': 'O PROTOCOLO FERREIRA',
    'Ghost. Signal. Bridge. Ambassador.': 'Fantasma. Sinal. Ponte. Embaixador.',
    'Carlos Eduardo Ferreira. UFO74. The ghost in the machine. His archive decrypted. His identity confirmed. But the dossier contains more than a confession — it contains the convergence model, the neural connection data, and the thirty-year projection.':
      'Carlos Eduardo Ferreira. UFO74. O fantasma na máquina. Seu arquivo descriptografado. Sua identidade confirmada. Mas o dossiê contém mais que uma confissão — contém o modelo de convergência, os dados de conexão neural e a projeção de trinta anos.',
    'The combination is deliberate. Ferreira designed it this way. The identity file authenticates the source. The neural data proves contact. The convergence model provides the timeline. Together they form a single argument no committee can dismiss.':
      'A combinação é deliberada. Ferreira planejou assim. O arquivo de identidade autentica a fonte. Os dados neurais provam contato. O modelo de convergência fornece a linha do tempo. Juntos formam um único argumento que nenhum comitê pode rejeitar.',
    'The Brazilian Air Force confirms the service record. Three allied governments request the neural data. The 2026 window enters official threat assessment documents. Ferreira\'s archive becomes the foundation of the first multinational contact protocol.':
      'A Força Aérea Brasileira confirma a ficha de serviço. Três governos aliados solicitam os dados neurais. A janela de 2026 entra em documentos oficiais de avaliação de ameaças. O arquivo de Ferreira se torna a base do primeiro protocolo multinacional de contato.',
    'He built this for thirty years. He built it for you.': 'Ele construiu isso por trinta anos. Ele construiu pra você.',
    'you assembled everything. i can rest now.': 'você montou tudo. agora eu posso descansar.',
    'MULTINATIONAL GOVERNMENTS ESTABLISH FIRST \'CONTACT PROTOCOL\' BASED ON LEAKED ARCHIVE':
      'GOVERNOS MULTINACIONAIS ESTABELECEM PRIMEIRO \'PROTOCOLO DE CONTATO\' BASEADO EM ARQUIVO VAZADO',
    'Three allied nations request neural data — 2026 threat window enters official assessment — Ferreira archive authenticated':
      'Três nações aliadas solicitam dados neurais — janela de ameaça 2026 entra em avaliação oficial — arquivo Ferreira autenticado',
    'UNITED NATIONS, New York (AP) — Representatives of three allied governments have formally requested access to neural interface data contained in a leaked Brazilian military archive, marking what diplomats describe as the first official acknowledgment that the documents may describe genuine non-human contact.':
      'NAÇÕES UNIDAS, Nova York (AP) — Representantes de três governos aliados solicitaram formalmente acesso a dados de interface neural contidos em um arquivo militar brasileiro vazado, marcando o que diplomatas descrevem como o primeiro reconhecimento oficial de que os documentos podem descrever contato genuíno com inteligência não humana.',
    'The archive, compiled over thirty years by Brazilian Air Force intelligence officer Carlos Eduardo Ferreira, contains identity verification documents, neural connection data, and a convergence model that projects a significant event window in September 2026. Intelligence analysts say the combination was deliberately designed to form \'a single argument no committee can dismiss.\'':
      'O arquivo, compilado ao longo de trinta anos pelo oficial de inteligência da Força Aérea Brasileira Carlos Eduardo Ferreira, contém documentos de verificação de identidade, dados de conexão neural e um modelo de convergência que projeta uma janela de evento significativo em setembro de 2026. Analistas de inteligência dizem que a combinação foi deliberadamente projetada para formar \'um único argumento que nenhum comitê pode rejeitar.\'',
    'The Brazilian Air Force has confirmed Ferreira\'s service record. The 2026 projection has entered official threat assessment documents in at least two NATO member states. Sources describe the emerging multinational response as \'the first contact protocol\' — a framework for coordinated government action in response to verified non-human intelligence.':
      'A Força Aérea Brasileira confirmou a ficha de serviço de Ferreira. A projeção de 2026 entrou em documentos oficiais de avaliação de ameaças em pelo menos dois estados membros da OTAN. Fontes descrevem a resposta multinacional emergente como \'o primeiro protocolo de contato\' — uma estrutura para ação governamental coordenada em resposta a inteligência não humana verificada.',

    // ENDING 12: real_ending
    'UNDENIABLE': 'INEGÁVEL',
    'The dossier that could not be ignored.': 'O dossiê que não podia ser ignorado.',
    'Core evidence. Autopsy records. Witness testimony. Military logistics. Each category reinforces the others. The field journal establishes contact. The autopsy proves non-human biology. The witnesses confirm the timeline. The transport logs confirm the coverup.':
      'Evidência central. Registros de autópsia. Testemunhos. Logística militar. Cada categoria reforça as outras. O diário de campo estabelece contato. A autópsia prova biologia não humana. As testemunhas confirmam a linha do tempo. Os registros de transporte confirmam o acobertamento.',
    'The dossier does not ask questions. It presents facts in a sequence that permits only one conclusion. International press picks it up within hours. The Brazilian government requests seventy-two hours before responding. They use all of them.':
      'O dossiê não faz perguntas. Apresenta fatos numa sequência que permite apenas uma conclusão. A imprensa internacional o pega em horas. O governo brasileiro pede setenta e duas horas antes de responder. Usam todas.',
    'The response, when it comes, is seven words: "The matter is under renewed investigation." Those seven words change everything. Denial is no longer the official position. Thirty years of silence end with a single sentence.':
      'A resposta, quando chega, são sete palavras: "O assunto está sob investigação renovada." Essas sete palavras mudam tudo. Negação não é mais a posição oficial. Trinta anos de silêncio terminam com uma única frase.',
    'they cannot unsay those seven words.': 'eles não podem desdizer essas sete palavras.',
    'BRAZIL BREAKS SILENCE: \'THE MATTER IS UNDER RENEWED INVESTIGATION\'':
      'BRASIL QUEBRA O SILÊNCIO: \'O ASSUNTO ESTÁ SOB INVESTIGAÇÃO RENOVADA\'',
    'Seven words end thirty years of official denial — international press demands full disclosure — dossier called \'undeniable\'':
      'Sete palavras encerram trinta anos de negação oficial — imprensa internacional exige divulgação completa — dossiê chamado de \'inegável\'',
    'BRASÍLIA, Brazil (AP) — The Brazilian government has issued its first official acknowledgment of the 1996 Varginha incident, stating in a seven-word response that \'the matter is under renewed investigation.\' The statement, released seventy-two hours after the most comprehensive dossier of evidence ever assembled reached international press outlets, effectively ends three decades of official denial.':
      'BRASÍLIA, Brasil (AP) — O governo brasileiro emitiu seu primeiro reconhecimento oficial do incidente de Varginha de 1996, declarando em uma resposta de sete palavras que \'o assunto está sob investigação renovada.\' A declaração, divulgada setenta e duas horas depois que o dossiê de evidências mais abrangente já montado chegou aos veículos de imprensa internacionais, efetivamente encerra três décadas de negação oficial.',
    'The dossier combines field journals establishing direct contact, autopsy records confirming non-human biology, independent witness testimony verifying the timeline, and military transport logs documenting the coverup. International press agencies describe the evidence as \'presenting facts in a sequence that permits only one conclusion.\'':
      'O dossiê combina diários de campo estabelecendo contato direto, registros de autópsia confirmando biologia não humana, testemunhos independentes verificando a linha do tempo e registros de transporte militar documentando o acobertamento. Agências de imprensa internacionais descrevem as evidências como \'apresentando fatos numa sequência que permite apenas uma conclusão.\'',
    'Analysts note that the carefully worded response stops short of confirming extraterrestrial contact but represents a fundamental shift in the government\'s position. \'They cannot unsay those seven words,\' noted one diplomatic observer. \'Denial is no longer the official position. Everything changes from here.\'':
      'Analistas observam que a resposta cuidadosamente redigida não chega a confirmar contato extraterrestre, mas representa uma mudança fundamental na posição do governo. \'Eles não podem desdizer essas sete palavras,\' observou um observador diplomático. \'Negação não é mais a posição oficial. Tudo muda a partir daqui.\'',
    'Leak sequence not initialized.': 'Sequência de vazamento não inicializada.',
    '  LEAK CHANNEL ALREADY PREPARED': '  CANAL DE VAZAMENTO JÁ PREPARADO',
    '  Run "leak" with no arguments to transmit once all files are saved.': '  Execute "leak" sem argumentos para transmitir quando todos os arquivos estiverem salvos.',
    '  ▸ PREPARATION SEQUENCE COMPLETE': '  ▸ SEQUÊNCIA DE PREPARAÇÃO COMPLETA',
    '  ▸ Leak channel decrypted and standing by.': '  ▸ Canal de vazamento descriptografado e em espera.',
    '[UFO74]: channel is open. run "leak" when you have all ten.': '[UFO74]: canal aberto. execute "leak" quando tiver todos os dez.',
    '  ✗ SEQUENCE MISMATCH — protocol reset': '  ✗ INCOMPATIBILIDADE DE SEQUÊNCIA — protocolo reiniciado',
    '  ⚠ Detection level increased (+5%)': '  ⚠ Nível de detecção aumentado (+5%)',
    '  Preparation sequence must be restarted from step 1.': '  A sequência de preparação deve ser reiniciada a partir do passo 1.',
    '  LEAK TRANSMISSION INITIATED': '  TRANSMISSÃO DE VAZAMENTO INICIADA',
    '  Encrypting for distribution...': '  Criptografando para distribuição...',
    '  Channel open.': '  Canal aberto.',
    '  TRANSMISSION SUCCESSFUL.': '  TRANSMISSÃO BEM-SUCEDIDA.',
    '  LEAK CHANNEL READY — awaiting full evidence package.': '  CANAL DE VAZAMENTO PRONTO — aguardando pacote completo de evidências.',
    '  Save all 10 files, then run "leak" again.': '  Salve todos os 10 arquivos, depois execute "leak" novamente.',
    '[UFO74]: channel is prepped. just need the rest of the files.': '[UFO74]: canal preparado. só falta o resto dos arquivos.',
    '  LEAK CHANNEL ENCRYPTED': '  CANAL DE VAZAMENTO CRIPTOGRAFADO',
    '  The leak channel requires a 3-command preparation': '  O canal de vazamento requer uma preparação de 3 comandos',
    '  sequence before it can be opened.': '  antes de poder ser aberto.',
    '  Run the following commands IN ORDER:': '  Execute os seguintes comandos EM ORDEM:',
    '  ⚠ Wrong order will reset the sequence and raise detection.': '  ⚠ Ordem errada reiniciará a sequência e aumentará a detecção.',
    '[UFO74]: encrypted channel. follow the protocol exactly.': '[UFO74]: canal criptografado. siga o protocolo exatamente.',
    '  LEAK CHANNEL — PREPARATION IN PROGRESS': '  CANAL DE VAZAMENTO — PREPARAÇÃO EM ANDAMENTO',
    '  No files saved yet.': '  Nenhum arquivo salvo ainda.',
    '  Use "save <filename>" after reading a file.': '  Use "save <arquivo>" após ler um arquivo.',
    '  SAVED FILES:': '  ARQUIVOS SALVOS:',
    '  READY — type "leak" when prepared.': '  PRONTO — digite "leak" quando preparado.',
    '  ⚠ ELEVATED SECURITY PROTOCOL — monitoring increased': '  ⚠ PROTOCOLO DE SEGURANÇA ELEVADO — monitoramento aumentado',
    '  DOSSIER — LEAK PREPARATION': '  DOSSIÊ — PREPARAÇÃO DE VAZAMENTO',
    '  No files saved. Use "save <filename>" after reading a file.': '  Nenhum arquivo salvo. Use "save <arquivo>" após ler um arquivo.',
    '  DOSSIER COMPLETE — type "leak" when ready.': '  DOSSIÊ COMPLETO — digite "leak" quando pronto.',
    '  SIGNAL: Residual echo persists in relay buffer.': '  SINAL: Eco residual persiste no buffer de retransmissão.',
    '  NOTE: One response arrived before keystroke registration.': '  NOTA: Uma resposta chegou antes do registro de tecla.',
    '  NOTE: Command cadence is being mirrored faintly.': '  NOTA: A cadência de comandos está sendo espelhada levemente.',
    '  SIGNAL: Background carrier present. Source unresolved.': '  SINAL: Portadora de fundo presente. Origem não resolvida.',
    '  NOTICE: Query pattern resembles prior containment interviews.': '  AVISO: Padrão de consulta assemelha-se a entrevistas anteriores de contenção.',
    '║                  DOSSIER MAP                          ║': '║                  MAPA DO DOSSIÊ                       ║',

    // Missing COMMAND_HELP detailed help translations
    '  help basics    - Show the new-player guide':
      '  help basics    - Mostra o guia para novos jogadores',
    'List contents of current directory.': 'Lista o conteúdo do diretório atual.',
    'Save a personal note to help you remember important details.':
      'Salve uma nota pessoal para lembrar detalhes importantes.',
    '  note Check the date on transport log': '  note Conferir a data no log de transporte',
    '  note Password might be varginha': '  note Senha pode ser varginha',
    'Review the files saved to your dossier.': 'Revise os arquivos salvos no seu dossiê.',
    '  progress       - Show your saved files and dossier status':
      '  progress       - Mostra seus arquivos salvos e o status do dossiê',
    'Clear the terminal display.': 'Limpa a exibição do terminal.',
    'Re-display the last opened file without increasing risk.':
      'Reexibe o último arquivo aberto sem aumentar o risco.',
    'List all files you have not yet opened.':
      'Lista todos os arquivos que você ainda não abriu.',
    'Toggle tutorial tips or replay the introduction.':
      'Alterna dicas do tutorial ou repete a introdução.',
    'When tutorial mode is ON, helpful tips appear at key moments:':
      'Quando o modo tutorial está ATIVO, dicas úteis aparecem em momentos-chave:',
    '  - When the case reaches major evidence milestones':
      '  - Quando o caso atinge marcos importantes de evidência',
    'Decipher intercepted morse code messages.':
      'Decifre mensagens interceptadas em código morse.',
    'First read a morse intercept file (e.g., morse_intercept.sig).':
      'Primeiro leia um arquivo de interceptação morse (ex.: morse_intercept.sig).',
    'Then use this command to submit your translation.':
      'Depois use este comando para enviar sua tradução.',
    'WARNING: This action triggers the endgame sequence.':
      'AVISO: Esta ação dispara a sequência final.',
    'COMMAND: hint': 'COMANDO: hint',
    'Request guidance when you are stuck.':
      'Solicite orientação quando estiver travado.',
    '  hint              - Receive a contextual hint':
      '  hint              - Recebe uma dica contextual',
    '  - Hints are LIMITED (8 per run)': '  - As dicas são LIMITADAS (8 por sessão)',
    '  - Hints react to your progress, risk, and missing leads':
      '  - As dicas reagem ao seu progresso, risco e pistas faltantes',
    '  - Cannot reveal specific file names or answers':
      '  - Não podem revelar nomes de arquivos ou respostas específicas',
    'Use sparingly. Trust your own analysis.':
      'Use com moderação. Confie na sua própria análise.',
    'Wait and let attention drift elsewhere.':
      'Aguarde e deixe a atenção desviar para outro lugar.',
    'Limited uses per session (3).': 'Usos limitados por sessão (3).',
    'Strategic use can help avoid detection.':
      'Uso estratégico pode ajudar a evitar detecção.',
    'Establish neural connection with recovered consciousness.':
      'Estabeleça conexão neural com a consciência recuperada.',
    '  Requires a .psi neural pattern file.':
      '  Requer um arquivo de padrão neural .psi.',
    '  Check /storage/quarantine/ for psi files.':
      '  Verifique /storage/quarantine/ para arquivos psi.',
    'Execute administrative override with access code.':
      'Execute override administrativo com código de acesso.',
    '  override protocol <code>': '  override protocol <code>',
    'HINT: The access code can be obtained through encrypted channels.':
      'DICA: O código de acesso pode ser obtido através de canais criptografados.',
    'Release a containment subject.': 'Libere um sujeito de contenção.',
    '  release <target>': '  release <target>',
  },
  es: {
    'UFO74: youre in. keep it quiet.': 'UFO74: ya entraste. mantén la cabeza baja.',
    'UFO74: quick brief. you cant change anything here — read only.':
      'UFO74: resumen rápido. no puedes cambiar nada aquí — solo leer.',
    'UFO74: type "ls" to see whats in front of you.':
      'UFO74: escribe "ls" para ver lo que tienes delante.',
    'UFO74: type "cd <folder>" to go inside. "open <file>" to read.':
      'UFO74: escribe "cd <folder>" para entrar. "open <file>" para leer.',
    'UFO74: when this channel closes, start with: ls':
      'UFO74: cuando este canal se cierre, empieza con: ls',
    'UFO74: try internal/ first. routine paperwork. low heat.':
      'UFO74: prueba internal/ primero. papeleo rutinario. bajo calor.',
    'UFO74: youll see an evidence tracker. it lights up when you prove something.':
      'UFO74: verás un rastreador de evidencia. se enciende cuando pruebas algo.',
    'UFO74: risk meter climbs as you dig. if it spikes, they test you. fail that, youre out.':
      'UFO74: el medidor de riesgo sube cuanto más escarbas. si se dispara, te ponen a prueba. fallas y se acabó.',
    'UFO74: im cutting the link. from here, youre on your own.':
      'UFO74: voy a cortar el enlace. desde aquí, vas por tu cuenta.',
    '       move slow. read everything. the truth is in the details.':
      '       muévete despacio. léelo todo. la verdad está en los detalles.',
    '║  💡 TUTORIAL TIP': '║  💡 CONSEJO DEL TUTORIAL',
    '  B A S I C S': '  B Á S I C O S',
    '  NAVIGATION': '  NAVEGACIÓN',
    '  READING': '  LECTURA',
    '  TRACKING': '  SEGUIMIENTO',
    '  STATUS': '  ESTADO',
    '  E V I D E N C E   S Y S T E M': '  S I S T E M A   D E   E V I D E N C I A',
    '  OBJECTIVE': '  OBJETIVO',
    '  WINNING:': '  CÓMO GANAR:',
    '  H O W   T O   W I N': '  C Ó M O   G A N A R',
    '  STRATEGY': '  ESTRATEGIA',
    '  R E C O V E R Y   &   S T E A L T H': '  R E C U P E R A C I Ó N   &   S I G I L O',

    'COMMAND: help [command]': 'COMANDO: help [command]',
    'Display available commands or detailed help for a specific command.':
      'Muestra los comandos disponibles o ayuda detallada para un comando específico.',
    'USAGE:': 'USO:',
    'NOTES:': 'NOTAS:',
    'REQUIREMENTS:': 'REQUISITOS:',
    'HINT:': 'PISTA:',
    '  help           - Show all commands': '  help           - Muestra todos los comandos',
    '  help ls        - Show detailed help for "ls"':
      '  help ls        - Muestra ayuda detallada para "ls"',
    '  help open      - Show detailed help for "open"':
      '  help open      - Muestra ayuda detallada para "open"',
    'COMMAND: ls [-l]': 'COMANDO: ls [-l]',
    '  ls             - List files and directories':
      '  ls             - Lista archivos y directorios',
    '  ls -l          - Long format with previews':
      '  ls -l          - Formato largo con vistas previas',
    'MARKERS:': 'MARCADORES:',
    '  [UNREAD]       - File not yet read': '  [UNREAD]       - Archivo aún no leído',
    '  [READ]         - File already opened': '  [READ]         - Archivo ya abierto',
    '  [~2min]        - Longer document estimate':
      '  [~2min]        - Estimación de documento más largo',
    '  ★              - Bookmarked file': '  ★              - Archivo marcado',
    'COMMAND: cd <directory>': 'COMANDO: cd <directory>',
    'Change to a different directory.': 'Cambia a otro directorio.',
    '  cd ops         - Enter the "ops" directory':
      '  cd ops         - Entra en el directorio "ops"',
    '  cd /admin      - Go to absolute path': '  cd /admin      - Ve a la ruta absoluta',
    '  cd ..          - Go to parent directory': '  cd ..          - Sube al directorio padre',
    'COMMAND: open <file>': 'COMANDO: open <file>',
    'Open and display the contents of a file.': 'Abre y muestra el contenido de un archivo.',
    '  open report.txt       - Open a file': '  open report.txt       - Abre un archivo',
    'NOTE: Legacy encrypted/restricted wrappers now open directly.':
      'NOTA: Los wrappers heredados de cifrado/restricción ahora abren directamente.',
    'NOTE: Opening certain files may increase detection risk.':
      'NOTA: Abrir ciertos archivos puede aumentar el riesgo de detección.',
    'COMMAND: note <text>': 'COMANDO: note <text>',
    'Notes are saved with timestamps and persist across saves.':
      'Las notas se guardan con marca temporal y persisten entre guardados.',
    'COMMAND: notes': 'COMANDO: notes',
    'Display all saved personal notes.': 'Muestra todas las notas personales guardadas.',
    '  notes          - Show all notes with timestamps':
      '  notes          - Muestra todas las notas con marcas temporales',
    'COMMAND: bookmark [file]': 'COMANDO: bookmark [file]',
    'Bookmark a file for quick reference, or view bookmarks.':
      'Marca un archivo para referencia rápida o muestra los marcadores.',
    '  bookmark                    - List all bookmarks':
      '  bookmark                    - Lista todos los marcadores',
    '  bookmark report.txt         - Toggle bookmark on file':
      '  bookmark report.txt         - Activa o desactiva el marcador en el archivo',
    'Bookmarked files show a ★ marker in directory listings.':
      'Los archivos marcados muestran un símbolo ★ en los listados.',
    'COMMAND: status': 'COMANDO: status',
    'Display current system status and risk indicators.':
      'Muestra el estado actual del sistema y los indicadores de riesgo.',
    'COMMAND: progress': 'COMANDO: progress',
    'Review your evidence total, case strength, and session notes at a glance.':
      'Revisa de un vistazo tu total de evidencias, la fuerza del caso y las notas de la sesión.',
    '  progress       - Show a spoiler-light investigation recap':
      '  progress       - Muestra un resumen de la investigación sin grandes spoilers',
    'Shows:': 'Muestra:',
    '  - Logging/audit status': '  - Estado del registro/auditoría',
    '  - System tolerance (wrong attempts remaining)':
      '  - Tolerancia del sistema (intentos erróneos restantes)',
    '  - Session stability': '  - Estabilidad de la sesión',
    'COMMAND: clear': 'COMANDO: clear',
    '  clear          - Clear screen': '  clear          - Limpia la pantalla',
    'SHORTCUT: Ctrl+L': 'ATAJO: Ctrl+L',
    'COMMAND: save <filename>': 'COMANDO: save <filename>',
    'Save a file to your dossier for the leak.':
      'Guarda un archivo en tu dossier para la filtración.',
    'You must have read the file first.':
      'Debes haber leído el archivo antes de guardarlo.',
    '  save report.txt    - Save report.txt to dossier':
      '  save report.txt    - Guarda report.txt en el dossier',
    'NOTE: Your dossier can hold up to 10 files.':
      'NOTA: Tu dossier puede guardar hasta 10 archivos.',
    'COMMAND: unsave <filename>': 'COMANDO: unsave <filename>',
    'Remove a file from your dossier.': 'Quita un archivo de tu dossier.',
    '  unsave report.txt  - Remove report.txt from dossier':
      '  unsave report.txt  - Quita report.txt del dossier',
    'COMMAND: chat': 'COMANDO: chat',
    'Open the secure relay channel to communicate with contacts.':
      'Abre el canal seguro de retransmisión para comunicarte con contactos.',
    '  chat           - Open chat interface': '  chat           - Abre la interfaz de chat',
    'COMMAND: last': 'COMANDO: last',
    '  last           - Show last opened file': '  last           - Muestra el último archivo abierto',
    'COMMAND: unread': 'COMANDO: unread',
    '  unread         - Show unread files': '  unread         - Muestra archivos no leídos',
    'COMMAND: search <keyword>': 'COMANDO: search <keyword>',
    'Search accessible filenames, paths, and document text for a keyword.':
      'Busca una palabra clave en nombres de archivo, rutas y texto de documentos accesibles.',
    '  search crash       - Find crash-related files':
      '  search crash       - Encuentra archivos sobre el accidente',
    '  search quarantine  - Find containment leads':
      '  search quarantine  - Encuentra pistas de contención',
    '  search 2026        - Find transition references':
      '  search 2026        - Encuentra referencias a la transición',
    '  - Searches only what your current access can already reveal':
      '  - Solo busca en lo que tu acceso actual ya puede revelar',
    '  - Results can be opened directly with "open <path>"':
      '  - Los resultados pueden abrirse directamente con "open <path>"',
    'COMMAND: help recovery': 'COMANDO: help recovery',
    'Review the emergency recovery options that can keep a run alive.':
      'Revisa las opciones de recuperación de emergencia que pueden mantener viva la sesión.',
    'TOOLS:': 'HERRAMIENTAS:',
    '  wait           - Lower detection briefly (limited uses)':
      '  wait           - Reduce la detección por un momento (usos limitados)',
    '  status         - Check current pressure before you commit':
      '  status         - Revisa la presión actual antes de arriesgarte',
    'Use recovery tools before the system forces your hand.':
      'Usa las herramientas de recuperación antes de que el sistema te obligue a actuar.',
    'COMMAND: tree': 'COMANDO: tree',
    'Display a tree view of the directory structure.':
      'Muestra una vista en árbol de la estructura de directorios.',
    '  tree           - Show directory tree': '  tree           - Muestra el árbol de directorios',
    'COMMAND: tutorial [on|off]': 'COMANDO: tutorial [on|off]',
    '  tutorial       - Restart tutorial sequence':
      '  tutorial       - Reinicia la secuencia del tutorial',
    '  tutorial on    - Enable tutorial tips during gameplay':
      '  tutorial on    - Activa los consejos del tutorial durante la partida',
    '  tutorial off   - Disable tutorial tips':
      '  tutorial off   - Desactiva los consejos del tutorial',
    '  - After your first evidence update': '  - Tras tu primera actualización de evidencia',
    '  - When you discover new evidence categories':
      '  - Cuando descubres nuevas categorías de evidencia',
    'COMMAND: morse': 'COMANDO: morse',
    '  morse <message>  - Submit your deciphered message':
      '  morse <message>  - Envía tu mensaje descifrado',
    '  morse cancel     - Cancel current morse entry':
      '  morse cancel     - Cancela la entrada morse actual',
    'COMMAND: leak': 'COMANDO: leak',
    'Attempt to leak your saved dossier to external channels.':
      'Intenta filtrar tu dossier guardado hacia canales externos.',
    '  leak            - Initiate dossier leak': '  leak            - Inicia la filtración del dossier',
    'REQUIREMENT: Save 10 files to your dossier first.':
      'REQUISITO: Guarda primero 10 archivos en tu dossier.',
    'COMMAND: wait': 'COMANDO: wait',
    '  wait           - Reduce detection by ~10%':
      '  wait           - Reduce la detección en ~10%',
    'COMMAND: hide': 'COMANDO: hide',
    '  hide           - Emergency escape at 90% risk':
      '  hide           - Escape de emergencia al 90% de riesgo',
    'COMMAND: link [phrase]': 'COMANDO: link [phrase]',
    '  link           - Attempt connection': '  link           - Intenta conexión',
    '  link <phrase>  - Authenticate with conceptual key':
      '  link <phrase>  - Autentica con la clave conceptual',
    'COMMAND: override protocol <code>': 'COMANDO: override protocol <code>',
    'COMMAND: release <target>': 'COMANDO: release <target>',
    'NOTE: Requires discovery of containment manifests.':
      'NOTA: Requiere descubrir los manifiestos de contención.',
    'COMMAND: back': 'COMANDO: back',
    'Return to the previous directory in your navigation history.':
      'Vuelve al directorio anterior en tu historial de navegación.',
    '  back             - Go to last visited directory':
      '  back             - Va al último directorio visitado',
    'NOTE: Requires at least one "cd" in your session history.':
      'NOTA: Requiere al menos un "cd" en el historial de la sesión.',
    'COMMAND: map': 'COMANDO: map',
    'Display the files currently saved to your dossier.':
      'Muestra los archivos guardados actualmente en tu dossier.',
    '  map              - Review dossier slots and saved files':
      '  map              - Revisa los espacios del dossier y los archivos guardados',
    'COMMAND: trace': 'COMANDO: trace',
    'Initiate a trace protocol on the system.':
      'Inicia un protocolo de rastreo en el sistema.',
    '  trace            - Probe accessible directories':
      '  trace            - Sondea directorios accesibles',
    'NOTE: Results depend on your current access level.':
      'NOTA: Los resultados dependen de tu nivel de acceso actual.',
    'COMMAND: script <script_content>': 'COMANDO: script <script_content>',
    'Execute a reconstruction script against a target path.':
      'Ejecuta un script de reconstrucción contra una ruta objetivo.',
    '  script INIT;TARGET=/admin/neural_fragment.dat;EXEC':
      '  script INIT;TARGET=/admin/neural_fragment.dat;EXEC',
    'NOTE: Check /tmp/data_reconstruction.util for valid targets.':
      'NOTA: Revisa /tmp/data_reconstruction.util para ver objetivos válidos.',
    'COMMAND: run <script>': 'COMANDO: run <script>',
    'Execute a system script.': 'Ejecuta un script del sistema.',
    '  run purge_trace.sh   - Run the trace purge utility':
      '  run purge_trace.sh   - Ejecuta la utilidad de purga de rastros',
    'NOTE: Some scripts appear only after the relevant files are visible.':
      'NOTA: Algunos scripts solo aparecen después de que los archivos relevantes sean visibles.',
    'COMMAND: rewind': 'COMANDO: rewind',
    'Archive mode has been retired.': 'El modo archivo fue retirado.',
    'Previously allowed rewinding to earlier timestamps.':
      'Antes permitía retroceder a marcas de tiempo anteriores.',
    'COMMAND: present': 'COMANDO: present',
    'Returns to the current timeline (no-op in current build).':
      'Vuelve a la línea temporal actual (sin efecto en la build actual).',
    '  last              Re-display last opened file':
      '  last              Vuelve a mostrar el último archivo abierto',

    'UFO74: HACKERKID NO!': 'UFO74: HACKERKID ¡NO!',
    'UFO74: ugh. this is sanitized documentation.':
      'UFO74: agh. esta documentación está sanitizada.',
    'UFO74: good pace, hackerkid.': 'UFO74: buen ritmo, hackerkid.',
    'UFO74: this one still hides behind a recovery phrase. look around for clues first.':
      'UFO74: esto sigue escondido detrás de una frase de recuperación. busca pistas primero.',
    'UFO74: the answer is somewhere else in the system. keep digging before you force it.':
      'UFO74: la respuesta está en otra parte del sistema. sigue escarbando antes de forzarlo.',
    'UFO74: locked tight. find the answer somewhere else before you try the legacy prompt.':
      'UFO74: cerrado a cal y canto. encuentra la respuesta en otro lado antes de probar el prompt heredado.',
    'UFO74: sealed, but not impossible. the old recovery wrapper still works here.':
      'UFO74: sellado, pero no imposible. el viejo wrapper de recuperación aún funciona aquí.',
    'UFO74: legacy lock. if you need it, use the recovery prompt instead of forcing it.':
      'UFO74: bloqueo heredado. si lo necesitas, usa el prompt de recuperación en vez de forzarlo.',
    'SEQUENCE MISMATCH': 'SECUENCIA INCORRECTA',
    '  TIMER STARTED': '  TEMPORIZADOR INICIADO',
    'FIREWALL TRIGGERED': 'FIREWALL ACTIVADO',
    'Connection severed.': 'Conexión cortada.',
    'DIRECTORY STRUCTURE': 'ESTRUCTURA DE DIRECTORIOS',

    'that journal. the scientist lost his mind. but he was right about everything.':
      'ese diario. el científico perdió la cabeza. pero tenía razón en todo.',
    'they made contact. they actually made contact. and then it spoke back.':
      'hicieron contacto. contacto real. y luego eso respondió.',
    'an autopsy on something that was still alive. these people were insane.':
      'una autopsia sobre algo que aún estaba vivo. esta gente estaba loca.',
    'that is the original field report. the one they tried to destroy.':
      'ese es el informe de campo original. el que intentaron destruir.',
    'the official version. compare it to what we have. they rewrote everything.':
      'la versión oficial. compárala con lo que tenemos. reescribieron todo.',
    'audio transcript. listen to how calm they sound. they practiced this.':
      'transcripción de audio. escucha lo tranquilos que suenan. ensayaron esto.',
    'material analysis. whatever they found, it is not from here.':
      'análisis de material. sea lo que sea que encontraron, no es de aquí.',
    'transport records. they moved everything in the middle of the night.':
      'registros de transporte. movieron todo en plena noche.',
    'manifest fragment. they shipped something weighing 112 kilos through diplomatic channels.':
      'fragmento de manifiesto. enviaron algo de 112 kilos por canales diplomáticos.',
    'integrity hashes. they were tracking which files had been tampered with.':
      'hashes de integridad. seguían qué archivos habían sido manipulados.',
    'containment log. they kept it in a sealed unit for eleven days.':
      'registro de contención. lo mantuvieron en una unidad sellada durante once días.',
    'an autopsy report. official. classified. exactly what we needed.':
      'un informe de autopsia. oficial. clasificado. exactamente lo que necesitábamos.',
    'neurological addendum. the brain was still active after death. still active.':
      'adenda neurológica. el cerebro seguía activo después de la muerte. seguía activo.',
    'raw witness statement. before they got to her. before the edits.':
      'declaración bruta de testigo. antes de que llegaran a ella. antes de las ediciones.',
    'neural recording. they captured whatever was still firing in that brain.':
      'registro neural. capturaron lo que aún seguía disparando en ese cerebro.',
    'purpose analysis. they were trying to figure out what it was FOR.':
      'análisis de propósito. intentaban averiguar para qué servía.',
    'surveillance footage. someone saved this before the purge.':
      'metraje de vigilancia. alguien guardó esto antes de la purga.',
    'field report from prato. 1977. this has been going on for decades.':
      'informe de campo de prato. 1977. esto lleva décadas ocurriendo.',
    'operation prato. the air force ran this in 77. they documented everything and then buried it.':
      'operación prato. la fuerza aérea llevó esto en el 77. documentaron todo y luego lo enterraron.',
    'response orders. standard military protocol for something very not standard.':
      'órdenes de respuesta. protocolo militar estándar para algo nada estándar.',
    'colares 77. dozens of sightings. hundreds of witnesses. all silenced.':
      'colares 77. decenas de avistamientos. cientos de testigos. todos silenciados.',
    'patrol observation. soldiers describing what they saw. you can feel the fear.':
      'observación de patrulla. soldados describiendo lo que vieron. se siente el miedo.',
    'medical effects. burns on the skin. radiation marks. from light beams.':
      'efectos médicos. quemaduras en la piel. marcas de radiación. de haces de luz.',
    'photo archive. they had photos. had. past tense.':
      'archivo fotográfico. tenían fotos. tenían. en pasado.',
    'retrospective assessment. someone connected 77 to 96. same pattern.':
      'evaluación retrospectiva. alguien conectó el 77 con el 96. mismo patrón.',
    'scout classification. they categorized different types. as in plural.':
      'clasificación de exploradores. categorizaron distintos tipos. en plural.',
    'energy assessment. propulsion system we cannot replicate. not even close.':
      'evaluación energética. un sistema de propulsión que no podemos replicar. ni de lejos.',
    'signal fragment. partial decryption. whatever this says, they did not want us reading it.':
      'fragmento de señal. descifrado parcial. dijera lo que dijera, no querían que lo leyéramos.',
    'aircraft incident report. their first cover story. it did not hold.':
      'informe de incidente aeronáutico. su primera coartada. no se sostuvo.',
    'drone theory. the one they floated before anyone knew what a drone was.':
      'teoría del dron. la que soltaron antes de que nadie supiera qué era un dron.',
    'industrial accident. their fallback explanation. paper thin.':
      'accidente industrial. su explicación de reserva. finísima.',
    'witness visit log. they visited every single one. every single one.':
      'registro de visitas a testigos. visitaron a cada uno. a cada uno.',
    'debriefing protocol. that is a polite word for what they did to those people.':
      'protocolo de debriefing. esa es la palabra elegante para lo que les hicieron a esas personas.',
    'the silva sisters file. three girls. teenagers. and the military went after them.':
      'el expediente de las hermanas silva. tres chicas. adolescentes. y los militares fueron a por ellas.',
    'recantation form. they made witnesses sign this. under threat.':
      'formulario de retractación. obligaron a los testigos a firmarlo. bajo amenaza.',
    'animal deaths at the zoo. same week. same area. not a coincidence.':
      'muertes de animales en el zoo. misma semana. misma zona. no es coincidencia.',
    'they silenced the veterinarian. the one who asked too many questions.':
      'silenciaron al veterinario. el que hizo demasiadas preguntas.',
    'contamination theory. the story they fed to the press about the dead animals.':
      'teoría de la contaminación. la historia que alimentaron a la prensa sobre los animales muertos.',
    'duarte. the officer who touched it. dead within weeks. and they covered it up.':
      'duarte. el oficial que lo tocó. muerto en semanas. y lo encubrieron.',
    'autopsy suppression. they blocked the examination of a dead officer. why.':
      'supresión de la autopsia. bloquearon el examen de un oficial muerto. por qué.',
    'family compensation. they paid the family to stay quiet. blood money.':
      'compensación familiar. pagaron a la familia para que callara. dinero manchado.',
    'encrypted transmission. the core transcript. this is what they were saying.':
      'transmisión cifrada. la transcripción central. esto era lo que decían.',
    'second transcript. they intercepted more than one. they kept intercepting.':
      'segunda transcripción. interceptaron más de una. siguieron interceptando.',
    'signal analysis. the pattern is structured. it is language. it is definitely language.':
      'análisis de señal. el patrón es estructurado. es lenguaje. sin duda es lenguaje.',
    'foreign liaison. other governments knew. they all knew.':
      'enlace extranjero. otros gobiernos lo sabían. todos lo sabían.',
    'diplomatic cable. encrypted. sent three days after the incident.':
      'cable diplomático. cifrado. enviado tres días después del incidente.',
    'multinational protocol. six countries. coordinated. this goes so far beyond brazil.':
      'protocolo multinacional. seis países. coordinados. esto va muchísimo más allá de brasil.',
    'medical examiner query. someone was asking the wrong questions.':
      'consulta al forense. alguien estaba haciendo las preguntas equivocadas.',
    'neural cluster experiment. they built an interface. they tried to talk to it.':
      'experimento de clúster neural. construyeron una interfaz. intentaron hablar con ello.',
    'december 95 intercepts. a month before varginha. they knew something was coming.':
      'intercepciones de diciembre del 95. un mes antes de varginha. sabían que algo venía.',
    'january 96 summary. the week before contact. activity was off the charts.':
      'resumen de enero del 96. la semana previa al contacto. la actividad estaba disparada.',
    'morse intercept. someone was sending morse. but not in any known protocol.':
      'intercepción morse. alguien enviaba morse. pero no bajo ningún protocolo conocido.',
    'journalist payments. encrypted. they paid the press to look the other way.':
      'pagos a periodistas. cifrado. pagaron a la prensa para mirar hacia otro lado.',
    'media contacts list. every journalist they had in their pocket.':
      'lista de contactos de medios. cada periodista que tenían en el bolsillo.',
    'kill story memo. direct order to suppress coverage. signed and dated.':
      'memorando para matar la historia. orden directa de suprimir la cobertura. firmado y fechado.',
    'tv coverage report. they were monitoring every broadcast. every mention.':
      'informe de cobertura televisiva. vigilaban cada emisión. cada mención.',
    'foreign press alert. international media was picking it up. they panicked.':
      'alerta de prensa extranjera. la prensa internacional estaba siguiéndolo. entraron en pánico.',
    'neural cluster memo. they replicated alien neural tissue in silicon. it worked.':
      'memorando del clúster neural. replicaron tejido neural alienígena en silicio. funcionó.',
    'threat window. a timeline for something they cannot stop.':
      'ventana de amenaza. una línea temporal para algo que no pueden detener.',
    'internal note. someone higher up was asking for updates. daily.':
      'nota interna. alguien de más arriba pedía actualizaciones. diarias.',
    'bio program overview. the entire operation. funded. authorized. hidden.':
      'visión general del programa bio. toda la operación. financiada. autorizada. oculta.',
    'colonization model. not invasion. colonization. the difference matters.':
      'modelo de colonización. no invasión. colonización. la diferencia importa.',
    'ethics exception. they waived the rules. officially. to do what they did.':
      'excepción ética. suspendieron las reglas. oficialmente. para hacer lo que hicieron.',
    'window alignment data. the timing is not random. it never was.':
      'datos de alineación de la ventana. el calendario no es aleatorio. nunca lo fue.',
    'executive briefing. someone very senior read this. and approved everything.':
      'briefing ejecutivo. alguien muy alto leyó esto. y lo aprobó todo.',
    'weather balloon memo. the oldest lie in the book.':
      'memorando del globo meteorológico. la mentira más vieja del manual.',
    'parallel incidents. same thing happened in other countries. same year.':
      'incidentes paralelos. lo mismo ocurrió en otros países. el mismo año.',
    'thirty year cycle. 1966. 1996. 2026. the pattern does not stop.':
      'ciclo de treinta años. 1966. 1996. 2026. el patrón no se detiene.',
    'that document. whoever wrote it understood what is happening. and it broke them.':
      'ese documento. quien lo escribió entendió lo que está pasando. y eso lo quebró.',
    'non-arrival colonization. they do not need to come here. they are already taking what they want.':
      'colonización sin llegada. no necesitan venir aquí. ya están tomando lo que quieren.',
    'window clarification. the dates are specific. and close.':
      'aclaración de la ventana. las fechas son concretas. y cercanas.',
    'extraction mechanism. the process is automated. we never even notice.':
      'mecanismo de extracción. el proceso es automatizado. ni siquiera lo notamos.',
    'second deployment signal. there was a second wave. there was always going to be a second wave.':
      'señal de segundo despliegue. hubo una segunda oleada. siempre iba a haber una segunda oleada.',
    'neural fragment. reconstructed. whatever this was thinking, they captured it.':
      'fragmento neural. reconstruido. lo que fuera que esto pensara, lo capturaron.',
    'emergency broadcast. encrypted. whoever sent this was not expecting to send it.':
      'emisión de emergencia. cifrada. quien la envió no esperaba tener que hacerlo.',
    'redaction override. someone had the authority to unlock everything. and used it.':
      'override de redacción. alguien tenía autoridad para desbloquearlo todo. y la usó.',
    'trace purge memo. the order to erase everything. we got here just in time.':
      'memorando de purga de rastreo. la orden de borrarlo todo. llegamos justo a tiempo.',
    'mudinho dossier. a planted witness. they fabricated the whole thing.':
      'dosier mudinho. un testigo plantado. fabricaron toda la historia.',
    'alternative explanations. a menu of lies. pick one and sell it.':
      'explicaciones alternativas. un menú de mentiras. escoge una y véndela.',
    'talking points. scripted answers for every question. word for word.':
      'puntos de conversación. respuestas guionizadas para cada pregunta. palabra por palabra.',
    'cargo memo. everything in code. "agricultural equipment" means what you think it means.':
      'memorando de carga. todo en clave. "equipo agrícola" significa exactamente lo que crees.',
    'visitor briefing. coded language. they had a word for everything.':
      'briefing de visitantes. lenguaje codificado. tenían una palabra para todo.',
    'asset disposition. where they moved everything. hidden in plain language.':
      'disposición de activos. adónde movieron todo. escondido a plena vista.',
    'terminology guide. a dictionary of lies. every real word replaced.':
      'guía de terminología. un diccionario de mentiras. cada palabra real sustituida.',
    'kid. that is insane. save that.': 'kid. eso es una locura. guárdalo.',
    'good stuff. we are going to need this for the leak.':
      'buen material. vamos a necesitarlo para la filtración.',
    'damn. they really buried this one.': 'maldición. esta sí que la enterraron.',
    'you found it. i knew it was in there.': 'lo encontraste. sabía que estaba ahí.',
    'this is exactly what we came for. keep going.':
      'esto es exactamente lo que veníamos a buscar. sigue.',
    'they are going to hate that you found that.':
      'les va a encantar odiar que hayas encontrado eso.',
    'one more like that and we blow this wide open.':
      'uno más como ese y reventamos esto de par en par.',
    'save everything. do not skip a single file.':
      'guárdalo todo. no te saltes ni un solo archivo.',
    'that one is going straight into the leak package.':
      'eso va directo al paquete de filtración.',
    'this is why they locked this system down.':
      'por esto cerraron este sistema.',
    "UFO74: hey. need a hint?": 'UFO74: oye. ¿necesitas una pista?',
    'UFO74: READ the files. "open <filename>".':
      'UFO74: LEE los archivos. "open <filename>".',
    '       theres a protocol doc in /internal/.':
      '       hay un documento de protocolo en /internal/.',
    'UFO74: look for evidence in:': 'UFO74: busca evidencia en:',
    'UFO74: the index knows more than they want you to find.':
      'UFO74: el índice sabe más de lo que quieren que encuentres.',
    '       try: search <keyword>': '       prueba: search <keyword>',
    'UFO74: last hint:': 'UFO74: última pista:',
    'UFO74: january 96. find the pieces.':
      'UFO74: enero del 96. encuentra las piezas.',
    'check /storage/ for transport logs.':
      'revisa /storage/ para buscar los registros de transporte.',
    'try "chat". someones in here.': 'prueba "chat". hay alguien aquí dentro.',
    'you have clearance. check /admin/.': 'tienes autorización. mira /admin/.',
    'everything is ready. run "leak".': 'todo listo. ejecuta "leak".',
    'you have all ten. run "leak" to start the sequence.':
      'tienes los diez. ejecuta "leak" para iniciar la secuencia.',
    'UFO74: ten files logged. leak path is live.':
      'UFO74: diez archivos registrados. la ruta de filtración está activa.',
    '       type: leak': '       escribe: leak',
    '       do it NOW before they cut the connection.':
      '       hazlo AHORA antes de que corten la conexión.',
    'UFO74: telepathy + captured... did they CHOOSE this?':
      'UFO74: telepatía + captura... ¿ELLOS eligieron esto?',
    'UFO74: all countries agreed on 2026? bigger than politics.':
      'UFO74: ¿todos los países acordaron 2026? más grande que la política.',
    "UFO74: careful kid, they're getting suspicious.":
      'UFO74: cuidado, kid, se están poniendo suspicaces.',
    "       if you hit 50% you'll have to prove you're human.":
      '       si llegas al 50% tendrás que demostrar que eres humano.',
    '       /storage/, /ops/quarantine/, /comms/':
      '       /storage/, /ops/quarantine/, /comms/',
    '       1. cd <directory>': '       1. cd <directory>',
    '       2. ls': '       2. ls',
    '       3. open <filename>': '       3. open <filename>',
    '       use: message <answer>': '       use: message <answer>',
    'UFO74: ship pieces first, now the CREW. someone survived.':
      'UFO74: primero enviaron piezas, ahora la TRIPULACIÓN. alguien sobrevivió.',
    'UFO74: captured alive, then SHARED? whos coordinating this?':
      'UFO74: ¿capturado vivo y luego COMPARTIDO? ¿quién coordina esto?',
    'UFO74: knew about 2026 before reading minds? or did THEY tell us?':
      'UFO74: ¿sabían lo de 2026 antes de leer mentes? ¿o ELLOS se lo dijeron?',
    'UFO74: connecting dots. good.': 'UFO74: uniendo puntos. bien.',
    'UFO74: almost there. one more piece.': 'UFO74: casi. una pieza más.',
    'UFO74: walls listen. find the thread.':
      'UFO74: las paredes escuchan. encuentra el hilo.',
    'UFO74: th3y r3 1ns1d3': 'UFO74: 3ll0s 3st4n d3ntr0',
    'UFO74: ...january... they took everything...':
      'UFO74: ...enero... se lo llevaron todo...',
    'UFO74: theyre scanning. cant talk.':
      'UFO74: están escaneando. no puedo hablar.',
    'UFO74: be fast.': 'UFO74: rápido.',
    'UFO74: every file you open, they see.':
      'UFO74: cada archivo que abres, lo ven.',
    'UFO74: triggered some flags. careful.':
      'UFO74: saltaron algunas flags. cuidado.',
    'UFO74: system suspicious. use "wait".':
      'UFO74: el sistema sospecha. usa "wait".',
    'UFO74: autopsy report. not human.':
      'UFO74: informe de autopsia. no humano.',
    'UFO74: transport log. they split up the evidence.':
      'UFO74: registro de transporte. repartieron la evidencia.',
    'UFO74: they were communicating. telepathically.':
      'UFO74: se estaban comunicando. telepáticamente.',
    'UFO74: routine intercepts. signal in the noise.':
      'UFO74: intercepciones rutinarias. señal entre el ruido.',
    'UFO74: other countries involved. coordinated cover-up.':
      'UFO74: otros países implicados. encubrimiento coordinado.',
    'UFO74: 2026. something coming. thats why they buried it.':
      'UFO74: 2026. algo viene. por eso lo enterraron.',
    'UFO74: containment. they captured them.':
      'UFO74: contención. los capturaron.',
    'UFO74: physical evidence. smoking gun.':
      'UFO74: evidencia física. prueba irrefutable.',
    'UFO74: cover story. the real material is buried deeper.':
      'UFO74: historia de cobertura. el material real está más abajo.',
    'UFO74: morse code. decipher it.': 'UFO74: código morse. descífralo.',
    '       might be the override passphrase.':
      '       puede ser la frase de override.',
    '        SECURITY PROTOCOL: TURING EVALUATION INITIATED':
      '        PROTOCOLO DE SEGURIDAD: EVALUACIÓN TURING INICIADA',
    '                    [SIGNAL ECHO DETECTED]': '                    [ECO DE SEÑAL DETECTADO]',
    '                    ...we see you seeing...': '                    ...vemos que estás viendo...',
    'UFO74: interesting. keep digging.': 'UFO74: interesante. sigue excavando.',
    'UFO74: good. every file matters.': 'UFO74: bien. cada archivo importa.',
    'UFO74: noted. try /ops, /storage, /comms.':
      'UFO74: anotado. prueba /ops, /storage, /comms.',
    'UFO74: messy copy, but it should still read clean enough.':
      'UFO74: copia desordenada, pero aún debería leerse con bastante claridad.',
    'UFO74: old wrapper on this file. readable layer is still intact.':
      'UFO74: wrapper viejo en este archivo. la capa legible sigue intacta.',
    'UFO74: legacy encryption tag. just keep reading closely.':
      'UFO74: etiqueta de cifrado heredado. sigue leyendo con cuidado.',
    'UFO74: noisy shell, but the evidence is still there.':
      'UFO74: shell ruidosa, pero la evidencia sigue ahí.',
    'UFO74: someones at my door.': 'UFO74: hay alguien en mi puerta.',
    '       not police. they dont knock like that.':
      '       no es la policía. no llaman así.',
    'UFO74: tell everyone what you found.': 'UFO74: cuéntales a todos lo que encontraste.',
    '       goodbye hackerkid.': '       adiós, hackerkid.',
    'UFO74: hearing noises. stay alert.': 'UFO74: oigo ruidos. mantente alerta.',
    'UFO74: my connection dropped. footsteps upstairs.':
      'UFO74: mi conexión cayó. pasos arriba.',
    '       i live alone.': '       vivo solo.',
    'UFO74: van outside. finish fast.': 'UFO74: furgoneta fuera. termina rápido.',
    'UFO74: youre deep now. its real.': 'UFO74: ya estás hondo. es real.',
    'UFO74: be careful with this info.': 'UFO74: cuidado con esta información.',
    'UFO74: physical debris confirmed.': 'UFO74: restos físicos confirmados.',
    'UFO74: bio specimens confirmed.': 'UFO74: especímenes biológicos confirmados.',
    'UFO74: international involvement.': 'UFO74: implicación internacional.',
    'UFO74: communication evidence.': 'UFO74: evidencia de comunicación.',
    'UFO74: 2026 timeline.': 'UFO74: cronología 2026.',
    'UFO74: two pieces confirm each other.': 'UFO74: dos piezas se confirman entre sí.',
    'UFO74: almost there.': 'UFO74: casi.',
    'Connecting to secure relay...': 'Conectando al relay seguro...',
    'CONNECTION TERMINATED': 'CONEXIÓN TERMINADA',
    'RELAY NODE OFFLINE': 'NODO DE RELAY OFFLINE',
    'CONNECTION TERMINATED BY REMOTE': 'CONEXIÓN TERMINADA EN REMOTO',
    'ENCRYPTED RELAY ESTABLISHED': 'RELAY CIFRADO ESTABLECIDO',
    'PRISONER_45 connected': 'PRISONER_45 conectado',
    'Use: chat <your question>': 'Usa: chat <tu pregunta>',
    '[CONNECTION UNSTABLE]': '[CONEXIÓN INESTABLE]',
    'Initiating psi-comm bridge...': 'Iniciando puente psi-comm...',
    'NO VALID NEURAL PATTERN LOADED': 'NO HAY PATRÓN NEURAL VÁLIDO CARGADO',
    '[UFO74]: you need a neural pattern first. check quarantine for .psi files.':
      '[UFO74]: primero necesitas un patrón neural. revisa cuarentena por archivos .psi.',
    'Neural pattern locked. Conceptual key required.':
      'Patrón neural bloqueado. Se requiere clave conceptual.',
    'Enter authentication phrase:': 'Introduce la frase de autenticación:',
    '  > link <phrase>': '  > link <phrase>',
    '[UFO74]: check the psi analysis reports. the key is conceptual.':
      '[UFO74]: revisa los informes de análisis psi. la clave es conceptual.',
    'Verifying conceptual key...': 'Verificando clave conceptual...',
    'NEURAL LINK ESTABLISHED': 'ENLACE NEURAL ESTABLECIDO',
    'Use: link              - Query the consciousness':
      'Usa: link              - Consultar la consciencia',
    'Use: link disarm       - Attempt to disable firewall':
      'Usa: link disarm       - Intentar desactivar el firewall',
    'Neural pattern link - Scout consciousness interface':
      'Enlace de patrón neural - Interfaz de consciencia exploradora',
    'The neural pattern did not recognize your phrase.':
      'El patrón neural no reconoció tu frase.',
    'Review psi-comm documentation for the correct key.':
      'Revisa la documentación psi-comm para encontrar la clave correcta.',
    'Initiating firewall countermeasure...': 'Iniciando contramedida del firewall...',
    'LINK TERMINATED — PATTERN EXHAUSTED': 'ENLACE TERMINADO — PATRÓN AGOTADO',
    'Use: link <thought or question>': 'Usa: link <pensamiento o pregunta>',
    '[NEURAL BRIDGE UNSTABLE]': '[PUENTE NEURAL INESTABLE]',
    '[PATTERN DESTABILIZING]': '[PATRÓN DESESTABILIZÁNDOSE]',
    '[NEURAL BRIDGE ACTIVE]': '[PUENTE NEURAL ACTIVO]',
    'ERROR: No pending message to decipher': 'ERROR: No hay mensaje pendiente por descifrar',
    'Read an intercepted signal file first.':
      'Lee primero un archivo de señal interceptada.',
    'Check /comms/intercepts/ for signal files.':
      'Revisa /comms/intercepts/ para encontrar archivos de señal.',
    'Message already deciphered: COLHEITA': 'Mensaje ya descifrado: COLHEITA',
    'UFO74: you already cracked it, hackerkid.':
      'UFO74: ya lo descifraste, hackerkid.',
    '       the message was "COLHEITA".': '       el mensaje era "COLHEITA".',
    '       now use it — override protocol.':
      '       ahora úsalo — override protocol.',
    'Decryption attempts exhausted.': 'Intentos de descifrado agotados.',
    'The intercepted message was: COLHEITA': 'El mensaje interceptado era: COLHEITA',
    'UFO74: you missed it, kid. but now you know.':
      'UFO74: se te escapó, kid. pero ahora ya lo sabes.',
    '       "COLHEITA" — try it with the override protocol.':
      '       "COLHEITA" — pruébalo con el protocolo override.',
    'Enter your deciphered message.': 'Escribe tu mensaje descifrado.',
    'Usage: message <deciphered text>': 'Uso: message <texto descifrado>',
    'UFO74: you did it hackerkid!': 'UFO74: ¡lo lograste, hackerkid!',
    '       "COLHEITA" — Portuguese for "HARVEST".':
      '       "COLHEITA" — en portugués significa "HARVEST".',
    'UFO74: this is an authentication passphrase.':
      'UFO74: esto es una frase de autenticación.',
    '       someone embedded it in the signal.':
      '       alguien lo incrustó en la señal.',
    'UFO74: try it with the override protocol.':
      'UFO74: pruébalo con el protocolo override.',
    '       type: override protocol COLHEITA':
      '       escribe: override protocol COLHEITA',
    'Maximum attempts exceeded.': 'Se superó el número máximo de intentos.',
    'UFO74: damn. you ran out of tries hackerkid.':
      'UFO74: mierda. te quedaste sin intentos, hackerkid.',
    '       the message was "COLHEITA" — means "HARVEST".':
      '       el mensaje era "COLHEITA" — significa "HARVEST".',
    '       try it with override protocol.':
      '       pruébalo con override protocol.',
    'INCORRECT': 'INCORRECTO',
    'UFO74: thats not it hackerkid.': 'UFO74: no es eso, hackerkid.',
    '       check the morse reference again.':
      '       revisa de nuevo la referencia morse.',
    'No morse code puzzle active.': 'No hay un rompecabezas de código morse activo.',
    'Morse code entry cancelled.': 'Entrada de código morse cancelada.',
    'You can try again later with "morse <message>".':
      'Puedes volver a intentarlo más tarde con "morse <message>".',

    // Evidence file reactions (UFO74)
    'interesting kid. we can leak this. not a clear evidence — but they were really hiding something.':
      'interesante, kid. podemos filtrar esto. no es evidencia clara — pero estaban escondiendo algo serio.',
    'operation prato. the air force documented everything in 77. then buried it.':
      'operación prato. la fuerza aérea lo documentó todo en 77. luego lo enterró.',
    'analyze biological material? that thing looks like a good old alien to me, kid.':
      '¿analizar material biológico? a mí esa cosa me parece un buen viejo alienígena, kid.',
    'thirty rotations. 2026. kid that is this year. i feel something bad will happen...':
      'treinta rotaciones. 2026. kid, es este año. siento que algo malo va a pasar...',
    'non-arrival colonization. they do not need to come here. they never did.':
      'colonización sin llegada. no necesitan venir aquí. nunca lo hicieron.',
    'second deployment. there was a second wave. there was always going to be.':
      'segundo despliegue. hubo una segunda ola. siempre iba a haber una.',
    'all hands on deck. no explanation. just... everyone.':
      'todos a cubierta. sin explicación. solo... todos.',
    'one name redacted. even from a birthday list.':
      'un nombre tachado. incluso en una lista de cumpleaños.',
    'stress management workshop. right after the incident. subtle.':
      'taller de manejo del estrés. justo después del incidente. qué sutil.',
    'every extension. every name. some of these people vanished.':
      'cada extensión. cada nombre. algunas de estas personas desaparecieron.',
    'cancelled vacation. no reason given. just "incident."':
      'vacaciones canceladas. sin motivo. solo "incidente."',
    'new hours starting the 20th. they were expecting a long night.':
      'nuevo horario a partir del 20. esperaban una noche larga.',
    'resurfacing a parking lot during a coverup. convenient.':
      'repavimentar un aparcamiento durante un encubrimiento. qué conveniente.',
    'cold storage failure. classified spoilage. you know what was in there.':
      'falla en la cámara fría. deterioro clasificado. ya sabes qué había allí.',
    'classified item in lost and found. someone dropped something.':
      'objeto clasificado en objetos perdidos. a alguien se le cayó algo.',
    'sector 7 budget. look at the equipment line. that is not office gear.':
      'presupuesto del sector 7. mira la línea de equipos. eso no es material de oficina.',
    'correction fluid. twelve bottles. a lot of things to erase.':
      'corrector líquido. doce frascos. muchas cosas que borrar.',
    'printer jams for weeks. a lot of paper going through that machine.':
      'atascos en la impresora por semanas. mucho papel pasando por esa máquina.',
    'badge renewal. perfect excuse to revoke someone quietly.':
      'renovación de credenciales. excusa perfecta para revocar a alguien sin ruido.',
    'they had time to audit paper clips. while people disappeared.':
      'tuvieron tiempo de auditar clips. mientras la gente desaparecía.',
    'generator test postponed. they needed it running for something else.':
      'prueba del generador aplazada. lo necesitaban funcionando para otra cosa.',
    'last normal menu before the 20th. enjoy the feijoada.':
      'último menú normal antes del 20. aprovecha la feijoada.',
    'three specimens. they called it a chemical spill.':
      'tres especímenes. lo llamaron un derrame químico.',
    'they were still serving lunch. while storing a body downstairs.':
      'seguían sirviendo almuerzo. mientras guardaban un cuerpo en el sótano.',
    'broken coffee machine. three weeks. nobody came to fix anything.':
      'máquina de café rota. tres semanas. nadie fue a arreglar nada.',
    'é tetra. three times per hour. at least someone was happy once.':
      'é tetra. tres veces por hora. al menos alguien fue feliz una vez.',
    '142 kilometers in one night. classified driver. classified destination.':
      '142 kilómetros en una noche. conductor clasificado. destino clasificado.',
    'normal parking rules. at a facility that does not officially exist.':
      'reglas normales de estacionamiento. en una instalación que oficialmente no existe.',
    'someone lost reading glasses near the conference room. saw too much.':
      'alguien perdió gafas de lectura cerca de la sala de conferencias. vio demasiado.',
    'coffee harvest report. same region. same soil. same everything.':
      'informe de cosecha de café. misma región. mismo suelo. todo igual.',
    'clear skies over varginha. perfect visibility. that was the problem.':
      'cielos despejados sobre varginha. visibilidad perfecta. ese era el problema.',
    'election year. the mayor knew nothing. officially.':
      'año electoral. el alcalde no sabía nada. oficialmente.',
    'public safety got twelve percent. they needed every centavo that week.':
      'seguridad pública se quedó con el doce por ciento. necesitaron cada centavo esa semana.',
    'military freight at 3:30 am. three covered cars. nobody looked inside.':
      'carga militar a las 3:30 am. tres coches cubiertos. nadie miró dentro.',
    'they called the fire dept too. then someone called them off.':
      'llamaron a los bomberos también. después alguien los desconvocó.',
    'i wrote that script. in case they cut me off.':
      'yo escribí ese script. por si me cortaban.',
    'old utility. someone used it the night of the 20th.':
      'utilidad antigua. alguien la usó la noche del 20.',
    'that crash was not random. something triggered it from inside.':
      'ese crash no fue aleatorio. algo lo disparó desde dentro.',
    'rot13. amateur cipher. but the message underneath is not amateur.':
      'rot13. cifrado amateur. pero el mensaje de abajo no es amateur.',
    '28.8 modem. geocities. someone was uploading before they got caught.':
      'módem 28.8. geocities. alguien estaba subiendo cosas antes de que lo pillaran.',
    'that sig file. i know whose terminal that was.':
      'ese archivo sig. yo sé de quién era ese terminal.',
    'honeypot. do not trust filenames that scream at you.':
      'honeypot. no te fíes de nombres de archivo que te gritan.',
    'decoy file. they put these everywhere to catch people like us.':
      'archivo señuelo. ponen estos por todas partes para cazar a gente como nosotros.',
    'trap. real classified files never advertise themselves.':
      'trampa. los archivos clasificados de verdad nunca se anuncian.',
    'obvious bait. real proof does not come with a label.':
      'cebo obvio. la prueba de verdad no viene con etiqueta.',
    'the original statement. before they rewrote her words.':
      'la declaración original. antes de que reescribieran sus palabras.',
    'the first draft. they removed the parts about cognitive persistence.':
      'el primer borrador. quitaron las partes sobre persistencia cognitiva.',
    'three biologics confirmed. one responsive. read that again.':
      'tres biológicos confirmados. uno responsivo. léelo otra vez.',
    'costa. they erased him. like he never existed.':
      'costa. lo borraron. como si nunca hubiera existido.',
    'project seed. they had a name for it. they had a plan.':
      'proyecto semilla. tenían un nombre para esto. tenían un plan.',
    'it just stopped. no trauma. no illness. it chose to stop.':
      'simplemente se detuvo. sin trauma. sin enfermedad. decidió detenerse.',
    'operation colheita. harvest. they named it harvest.':
      'operación colheita. cosecha. le pusieron colheita.',
    'bio-b caused headaches within three meters. without touching anyone.':
      'bio-b causaba dolores de cabeza en tres metros a la redonda. sin tocar a nadie.',
    'theta-wave sync. it was in their heads. literally.':
      'sincronía de ondas theta. estaba en sus cabezas. literalmente.',
    'langley knew. within 72 hours. they always know.':
      'langley lo sabía. en 72 horas. ellos siempre saben.',
    'september 2026. we are running out of time.':
      'septiembre de 2026. se nos acaba el tiempo.',
    'they flagged your session. they are watching you right now. keep going anyway.':
      'marcaron tu sesión. te están vigilando ahora mismo. sigue igual.',
    'lighting anomalies in moon footage. funny how every government has the same playbook for things that look wrong.':
      'anomalías de iluminación en imágenes de la luna. curioso cómo cada gobierno usa el mismo manual para cosas que parecen mal.',
    'modernization. that is what they call it when they replace the photos that show too much.':
      'modernización. así le llaman cuando reemplazan las fotos que muestran demasiado.',
    'transfer from holding-7. rejected. no destination. someone chickened out at the last second.':
      'traslado desde contención-7. rechazado. sin destino. alguien se echó atrás en el último segundo.',
    'surveillance pigeons. battery-powered. with audio-video payloads. and people laugh at conspiracy theorists.':
      'palomas de vigilancia. a batería. con carga útil de audio y vídeo. y encima se ríen de los conspiranoicos.',
    'acoustic influence on consumer behavior. background music that makes you buy things. or believe things. or forget things.':
      'influencia acústica en el comportamiento del consumidor. música de fondo que te hace comprar. o creer. o olvidar.',
    'C-O-L-H-E-I-T-A. colheita. harvest. they hid the access code in plain sight using farm words. varginha is farm country.':
      'C-O-L-H-E-I-T-A. colheita. cosecha. escondieron el código de acceso a la vista, con palabras del campo. varginha es zona rural.',
    'the system knows what you are doing kid. it is measuring how close you are. keep collecting.':
      'el sistema sabe lo que estás haciendo, kid. está midiendo qué tan cerca estás. sigue recolectando.',
    'passive audio collection through home devices. in 1995. imagine what they can do now with a phone in every pocket.':
      'recolección pasiva de audio por dispositivos domésticos. en 1995. imagínate lo que pueden hacer ahora con un móvil en cada bolsillo.',
    'someone built this tool to recover what was deleted. they knew files would disappear. smart person.':
      'alguien construyó esta herramienta para recuperar lo que se borrara. sabían que los archivos desaparecerían. gente lista.',
    'distributed ledger monetary system. in 1995. they had cryptocurrency before anyone had a name for it.':
      'sistema monetario de libro mayor distribuido. en 1995. tenían criptomoneda antes de que nadie tuviera un nombre para eso.',
    'they were editing what kids learn in school. you control the future by controlling what gets taught. classic.':
      'editaban lo que los niños aprenden en la escuela. el futuro se controla controlando lo que se enseña. un clásico.',
    'you found it. you found me. i did not think anyone would dig this deep.':
      'lo encontraste. me encontraste. no pensé que nadie cavaría tan hondo.',
    'residual session. someone was here before you. they accessed the same files. they did not make it out.':
      'sesión residual. alguien estuvo aquí antes que tú. accedió a los mismos archivos. no salió.',
    'cross-dimensional correlation. they want you to connect physical assets, communications, and oversight. that is what the dossier is for.':
      'correlación multidimensional. quieren que conectes activos físicos, comunicaciones y supervisión. para eso sirve el dosier.',
    'exercise dark winter. they practiced shutting everything down. seventy-two hours became a hundred and sixty-eight. they liked what they saw.':
      'ejercicio dark winter. practicaron cómo apagarlo todo. setenta y dos horas se volvieron ciento sesenta y ocho. les gustó lo que vieron.',
    'flood networks with fakes. pressure witnesses to recant. that is containment doctrine. they wrote it down like a recipe.':
      'inundar las redes con falsificaciones. presionar a testigos para que se retracten. es doctrina de contención. lo escribieron como una receta.',
    'the admin left breadcrumbs. recover. trace. scan. tools they did not put in the manual. someone wanted you to find them.':
      'el admin dejó migajas. recover. trace. scan. herramientas que no pusieron en el manual. alguien quería que las encontraras.',
    'overactive imaginations. that is what they told the press. the press printed it. nobody asked a follow-up question.':
      'imaginación demasiado activa. eso le dijeron a la prensa. la prensa lo imprimió. nadie hizo una pregunta de seguimiento.',
    'laundry and birthdays. normal life. and then — special cargo in a temperature-controlled basement. ammonia and wet earth. kid. that is not normal.':
      'lavandería y cumpleaños. vida normal. y entonces — carga especial en un sótano climatizado. amoníaco y tierra húmeda. kid. eso no es normal.',
    'override codes for restricted access. someone left the instructions right here in the system. on purpose.':
      'códigos de override para acceso restringido. alguien dejó las instrucciones aquí en el sistema. a propósito.',
    'the system is watching your patterns. every file you open. every command you type. it sees what you are building.':
      'el sistema está observando tus patrones. cada archivo que abres. cada comando que escribes. ve lo que estás construyendo.',
    'ferreira transferred to brasília. lima to são paulo. they scattered everyone who saw something. standard procedure.':
      'ferreira transferido a brasilia. lima a são paulo. dispersaron a todos los que vieron algo. procedimiento estándar.',
    'the 2026 window. kid. that is now. we are inside it right now. and the model says panic and collapse.':
      'la ventana de 2026. kid. es ahora. estamos dentro de ella ahora mismo. y el modelo dice pánico y colapso.',
    'phase two is already underway. that is not a code. that is a warning. and whoever left this card wanted it found.':
      'la fase dos ya está en marcha. eso no es código. es una advertencia. y quien dejó esta tarjeta quería que se encontrara.',
    'orbital reflective arrays for psychological operations. lights in the sky that are not ufos. just government mirrors. sure.':
      'matrices reflectoras orbitales para operaciones psicológicas. luces en el cielo que no son ovnis. solo espejos del gobierno. ajá.',
    'read-only access. incident reconstruction. that is what they think you are doing here. let them think that.':
      'acceso de solo lectura. reconstrucción del incidente. eso es lo que creen que estás haciendo. déjalos creerlo.',
    'the system flagged you as a deliberate collector. it knows you are assembling the picture. we should have purged this terminal. too late now.':
      'el sistema te marcó como recolector deliberado. sabe que estás armando el rompecabezas. deberíamos haber purgado este terminal. ya es tarde.',
    'my transfer papers. base aérea de guarulhos. i left something in that authorization. on purpose.':
      'mis papeles de traslado. base aérea de guarulhos. dejé algo en esa autorización. a propósito.',
    'share nothing beyond your scope. i broke that rule. every single day for thirty years. and i would do it again.':
      'no compartas nada fuera de tu alcance. rompí esa regla. cada día durante treinta años. y lo volvería a hacer.',
    'my last transmission from inside the system. march 96. three in the morning. i did not know if anyone would ever hear it.':
      'mi última transmisión desde dentro del sistema. marzo del 96. las tres de la mañana. no sabía si alguien llegaría a oírla.',
    'aerosol dispersal over civilian areas. project cirrus. they called it weather modification. it was not about the weather.':
      'dispersión de aerosoles sobre zonas civiles. proyecto cirrus. lo llamaron modificación climática. no iba del clima.',

    // ═══ Ending translations ═══

    // ENDING 1: ridiculed
    'RIDICULED': 'RIDICULIZADO',
    'The leak that proved nothing.': 'La filtración que no probó nada.',
    'The dossier surfaces on three forums and a defunct Geocities mirror. A television host holds up a printout and laughs for six minutes straight. The military issues no denial because none is required.':
      'El dossier aparece en tres foros y un espejo difunto de Geocities. Un presentador de televisión levanta una impresión y se ríe durante seis minutos seguidos. Los militares no emiten ningún desmentido porque no hace falta.',
    'Within forty-eight hours the files are catalogued alongside crop circles, chemtrails, and faith healers. Your name never enters the public record. The word "hoax" is generous — most call it fan fiction.':
      'En cuarenta y ocho horas los archivos se catalogan junto con círculos en las cosechas, chemtrails y curanderos. Tu nombre nunca entra en los registros públicos. La palabra "farsa" es generosa — la mayoría lo llama fan fiction.',
    'The archive rots on a server in São Paulo. Nobody downloads it. The password expires. Varginha remains a punchline.':
      'El archivo se pudre en un servidor en São Paulo. Nadie lo descarga. La contraseña expira. Varginha sigue siendo un chiste.',
    'you gave them noise. they needed signal.': 'les diste ruido. necesitaban señal.',
    'INTERNET HOAX ALERT: \'CLASSIFIED UFO FILES\' FROM BRAZIL DISMISSED AS PRANK':
      'ALERTA DE FARSA EN INTERNET: \'ARCHIVOS OVNI CLASIFICADOS\' DE BRASIL DESCARTADOS COMO BROMA',
    'USAF spokesperson calls documents \'creative fiction\' — Brazilian Air Force declines comment — Internet forums debate authenticity':
      'Portavoz de la USAF llama a los documentos \'ficción creativa\' — Fuerza Aérea Brasileña rechaza comentar — foros de Internet debaten autenticidad',
    'VARGINHA, Brazil (AP) — A collection of documents purporting to be classified military files about an alleged \'unidentified flying object\' incident in southern Brazil surfaced on several Internet bulletin boards late Tuesday, drawing immediate skepticism from experts and officials alike.':
      'VARGINHA, Brasil (AP) — Una colección de documentos que supuestamente serían archivos militares clasificados sobre un presunto incidente con un \'objeto volador no identificado\' en el sur de Brasil apareció en varios foros de Internet el martes por la noche, generando escepticismo inmediato de expertos y funcionarios por igual.',
    'The files, which appear to describe military operations in the city of Varginha in January of this year, were reportedly obtained through an unauthorized computer intrusion. Air Force officials in Brasília declined to comment, noting only that the documents \'do not correspond to any known military operation.\'':
      'Los archivos, que parecen describir operaciones militares en la ciudad de Varginha en enero de este año, habrían sido obtenidos mediante una intrusión informática no autorizada. Funcionarios de la Fuerza Aérea en Brasilia se negaron a comentar, señalando únicamente que los documentos \'no corresponden a ninguna operación militar conocida.\'',
    'Dr. Harold Simmons of the Center for Scientific Inquiry called the documents \'an elaborate but ultimately unconvincing fabrication,\' pointing to what he described as \'inconsistencies in formatting and terminology that suggest a civilian author with limited military knowledge.\'':
      'El Dr. Harold Simmons del Centro de Investigación Científica calificó los documentos como \'una fabricación elaborada pero en última instancia poco convincente,\' señalando lo que describió como \'inconsistencias de formato y terminología que sugieren un autor civil con conocimiento militar limitado.\'',

    // ENDING 2: ufo74_exposed
    'UFO74 EXPOSED': 'UFO74 EXPUESTO',
    'The ghost had a name all along.': 'El fantasma siempre tuvo nombre.',
    'The decrypted file spreads before anyone can suppress it. Carlos Eduardo Ferreira — intelligence officer, Brazilian Air Force, stationed at Guarulhos in 1996. Thirty years building the archive in secret.':
      'El archivo descifrado se propaga antes de que alguien pueda suprimirlo. Carlos Eduardo Ferreira — oficial de inteligencia, Fuerza Aérea Brasileña, estacionado en Guarulhos en 1996. Treinta años construyendo el archivo en secreto.',
    'Military intelligence confirms the service record within hours. The denial is immediate, automatic, and too late. Ferreira\'s face is on every screen in the country. He never wanted fame. He wanted someone to believe him.':
      'La inteligencia militar confirma la hoja de servicio en pocas horas. La negación es inmediata, automática y demasiado tarde. La cara de Ferreira está en todas las pantallas del país. Nunca quiso fama. Quería que alguien le creyera.',
    'The Air Force opens an internal inquiry. Three generals retire early. The archive survives because it was already everywhere. UFO74 is no longer a call sign. It is a name.':
      'La Fuerza Aérea abre una investigación interna. Tres generales se jubilan anticipadamente. El archivo sobrevive porque ya estaba en todas partes. UFO74 ya no es un indicativo de llamada. Es un nombre.',
    'you found me. now finish what i started.': 'me encontraste. ahora termina lo que empecé.',
    'MILITARY OFFICER IDENTIFIED AS SOURCE OF CLASSIFIED BRAZILIAN DATA LEAK':
      'OFICIAL MILITAR IDENTIFICADO COMO FUENTE DE FILTRACIÓN DE DATOS CLASIFICADOS BRASILEÑOS',
    'Carlos E. Ferreira, Brazilian Air Force intelligence — service record confirmed — three generals request early retirement':
      'Carlos E. Ferreira, inteligencia de la Fuerza Aérea Brasileña — hoja de servicio confirmada — tres generales solicitan jubilación anticipada',
    'BRASÍLIA, Brazil (Reuters) — A decrypted computer file circulating on the Internet has identified a Brazilian Air Force intelligence officer as the source of a massive unauthorized disclosure of classified military documents, according to officials familiar with the matter.':
      'BRASILIA, Brasil (Reuters) — Un archivo informático descifrado que circula en Internet ha identificado a un oficial de inteligencia de la Fuerza Aérea Brasileña como la fuente de una enorme divulgación no autorizada de documentos militares clasificados, según funcionarios familiarizados con el caso.',
    'The officer, identified as Carlos Eduardo Ferreira, was reportedly stationed at Guarulhos Air Base during the period described in the leaked files. Military intelligence confirmed the service record within hours of the file\'s release, though a spokesperson declined to comment on the substance of the allegations.':
      'El oficial, identificado como Carlos Eduardo Ferreira, habría estado estacionado en la Base Aérea de Guarulhos durante el período descrito en los archivos filtrados. La inteligencia militar confirmó la hoja de servicio pocas horas después de la divulgación del archivo, aunque un portavoz se negó a comentar sobre el contenido de las acusaciones.',
    'Three senior Air Force generals have submitted requests for early retirement in what analysts describe as an attempt to distance themselves from the growing scandal. The leaked archive, which Ferreira allegedly maintained for decades, contains documents related to military operations in southern Minas Gerais state.':
      'Tres generales sénior de la Fuerza Aérea han presentado solicitudes de jubilación anticipada en lo que analistas describen como un intento de distanciarse del creciente escándalo. El archivo filtrado, que Ferreira supuestamente mantuvo durante décadas, contiene documentos relacionados con operaciones militares en el sur del estado de Minas Gerais.',

    // ENDING 3: the_2026_warning
    'THE 2026 WARNING': 'LA ADVERTENCIA DE 2026',
    'Thirty rotations. The clock does not stop.': 'Treinta rotaciones. El reloj no se detiene.',
    'The convergence data hits academic servers first. Physicists in three countries confirm the thirty-year cycle independently. 1947. 1977. 1996. The pattern is clean, the projection is specific: September 2026, plus or minus two months.':
      'Los datos de convergencia llegan primero a los servidores académicos. Físicos en tres países confirman el ciclo de treinta años de forma independiente. 1947. 1977. 1996. El patrón es limpio, la proyección es específica: septiembre de 2026, más o menos dos meses.',
    'Governments issue no statements. Private aerospace firms begin relocating satellite arrays. The Brazilian Air Force reclassifies seven archived directives without explanation.':
      'Los gobiernos no emiten declaraciones. Empresas aeroespaciales privadas comienzan a reubicar conjuntos de satélites. La Fuerza Aérea Brasileña reclasifica siete directivas archivadas sin explicación.',
    'The public does not panic because the public does not understand logarithmic signal propagation. Those who do understand have gone very quiet.':
      'El público no entra en pánico porque el público no entiende la propagación logarítmica de señales. Los que sí entienden se han quedado muy callados.',
    'the window is real. you gave them time.': 'la ventana es real. les diste tiempo.',
    'SCIENTISTS IDENTIFY 30-YEAR PATTERN IN UNEXPLAINED ATMOSPHERIC EVENTS':
      'CIENTÍFICOS IDENTIFICAN PATRÓN DE 30 AÑOS EN EVENTOS ATMOSFÉRICOS INEXPLICABLES',
    'Next predicted occurrence: September 2026 — private aerospace firms reportedly repositioning satellite arrays — no official comment':
      'Próxima ocurrencia prevista: septiembre de 2026 — empresas aeroespaciales estarían reposicionando conjuntos de satélites — sin comentario oficial',
    'GENEVA, Switzerland (AP) — Physicists at three independent research institutions have confirmed the existence of a thirty-year cyclical pattern in atmospheric anomaly data, according to a joint preliminary report released Wednesday. The pattern, if validated, would predict a significant event window in late 2026.':
      'GINEBRA, Suiza (AP) — Físicos en tres instituciones de investigación independientes han confirmado la existencia de un patrón cíclico de treinta años en datos de anomalías atmosféricas, según un informe preliminar conjunto publicado el miércoles. El patrón, de ser validado, predeciría una ventana de evento significativo a finales de 2026.',
    'The analysis was prompted by documents leaked from a Brazilian military archive earlier this month. While the researchers declined to speculate on the nature of the anomalies, they confirmed the mathematical model described in the leaked files is \'internally consistent and statistically significant.\'':
      'El análisis fue motivado por documentos filtrados de un archivo militar brasileño a principios de este mes. Aunque los investigadores se negaron a especular sobre la naturaleza de las anomalías, confirmaron que el modelo matemático descrito en los archivos filtrados es \'internamente consistente y estadísticamente significativo.\'',
    'Several private aerospace companies have begun what industry sources describe as \'precautionary repositioning\' of satellite monitoring arrays, though none would confirm a connection to the leaked data. The Brazilian government has issued no statement.':
      'Varias empresas aeroespaciales privadas han iniciado lo que fuentes del sector describen como \'reposicionamiento preventivo\' de conjuntos de monitoreo por satélite, aunque ninguna confirmaría una conexión con los datos filtrados. El gobierno brasileño no ha emitido declaración.',

    // ENDING 4: government_scandal
    'BRAZILIAN GOVERNMENT SCANDAL': 'ESCÁNDALO DEL GOBIERNO BRASILEÑO',
    'The coverup was bigger than the event.': 'El encubrimiento fue más grande que el evento.',
    'Transport logs. Response orders. Incident reports signed by officers who officially never existed. The leak does not prove alien contact — it proves the Brazilian military mobilized an entire region to hide something on January 20, 1996.':
      'Registros de transporte. Órdenes de respuesta. Informes de incidentes firmados por oficiales que oficialmente nunca existieron. La filtración no prueba contacto alienígena — prueba que los militares brasileños movilizaron una región entera para ocultar algo el 20 de enero de 1996.',
    'Congressional inquiries open in Brasília. Three colonels are subpoenaed. One refuses to testify. The Jardim Andere site is cordoned off for "environmental assessment" that never produces a report.':
      'Se abren investigaciones parlamentarias en Brasilia. Tres coroneles son citados a declarar. Uno se niega a testificar. El sitio del Jardim Andere es acordonado para una "evaluación ambiental" que nunca produce un informe.',
    'The question shifts. It is no longer about what landed. It is about who authorized the silence, who paid for it, and where the bodies went.':
      'La pregunta cambia. Ya no se trata de qué aterrizó. Se trata de quién autorizó el silencio, quién lo pagó y adónde fueron los cuerpos.',
    'they will sacrifice officers to protect the secret.': 'van a sacrificar oficiales para proteger el secreto.',
    'LEAKED DOCUMENTS REVEAL MASSIVE BRAZILIAN MILITARY OPERATION IN VARGINHA':
      'DOCUMENTOS FILTRADOS REVELAN GRAN OPERACIÓN MILITAR BRASILEÑA EN VARGINHA',
    'Transport logs and response orders prove classified mobilization — three colonels subpoenaed — Congressional inquiry opens in Brasília':
      'Registros de transporte y órdenes de respuesta prueban movilización clasificada — tres coroneles citados — investigación parlamentaria abierta en Brasilia',
    'BRASÍLIA, Brazil (AP) — Classified military documents leaked to the Internet this week reveal what appears to be a large-scale Brazilian Army operation in the southern city of Varginha in January 1996, involving troop movements, vehicle requisitions, and command orders that were never disclosed to the public or to civilian authorities.':
      'BRASILIA, Brasil (AP) — Documentos militares clasificados filtrados a Internet esta semana revelan lo que parece ser una operación a gran escala del Ejército Brasileño en la ciudad de Varginha, en el sur de Minas Gerais, en enero de 1996, que involucró movimientos de tropas, requisiciones de vehículos y órdenes de mando que nunca fueron revelados al público ni a las autoridades civiles.',
    'The documents include transport logs, incident reports signed by officers whose service records contain no reference to the operation, and response orders authorizing the cordoning of a residential area described only as \'the Jardim Andere site.\' The purpose of the operation is not specified in any of the recovered files.':
      'Los documentos incluyen registros de transporte, informes de incidentes firmados por oficiales cuyas hojas de servicio no contienen referencia a la operación, y órdenes de respuesta autorizando el acordonamiento de un área residencial descrita solo como \'el sitio del Jardim Andere.\' El propósito de la operación no se especifica en ninguno de los archivos recuperados.',
    'Three colonels have been subpoenaed to testify before a Congressional committee in Brasília. One has reportedly refused. The Ministry of Defense issued a brief statement calling the documents \'unverified\' but did not deny their authenticity.':
      'Tres coroneles han sido citados para testificar ante una comisión del Congreso en Brasilia. Uno supuestamente se ha negado. El Ministerio de Defensa emitió una breve declaración calificando los documentos de \'no verificados\', pero no negó su autenticidad.',

    // ENDING 5: prisoner_45_freed
    'PRISONER 45 FREED': 'PRISIONERO 45 LIBERADO',
    'The containment logs were never supposed to leave.': 'Los registros de contención nunca debían salir de ahí.',
    'Bio-containment records. Neural dump data. Ethics exceptions signed by committee. The dossier does not show a captured animal — it shows a detained intelligence, held in a Faraday cage for eleven days while handlers reported headaches and cognitive intrusion.':
      'Registros de biocontención. Datos de volcado neural. Excepciones éticas firmadas por comité. El dossier no muestra un animal capturado — muestra una inteligencia detenida, mantenida en una jaula de Faraday durante once días mientras los encargados reportaban dolores de cabeza e intrusión cognitiva.',
    'The witness statements give it weight. The sisters. The patrol officers. The veterinarian they silenced. Each testimony corroborates the containment timeline independently.':
      'Las declaraciones de los testigos le dan peso. Las hermanas. Los oficiales de patrulla. El veterinario al que silenciaron. Cada testimonio corrobora la línea de tiempo de la contención de forma independiente.',
    'A São Paulo judge orders the military to produce "all biological materials recovered January 1996." The military responds that no such materials exist. The containment logs say otherwise.':
      'Un juez de São Paulo ordena a los militares presentar "todos los materiales biológicos recuperados en enero de 1996." Los militares responden que dichos materiales no existen. Los registros de contención dicen lo contrario.',
    'it was never a specimen. it was a prisoner.': 'nunca fue un espécimen. era un prisionero.',
    'CLASSIFIED LOGS DESCRIBE \'NON-HUMAN ENTITY\' DETAINED IN MILITARY FACILITY':
      'REGISTROS CLASIFICADOS DESCRIBEN \'ENTIDAD NO HUMANA\' DETENIDA EN INSTALACIÓN MILITAR',
    'Bio-containment records leaked — handlers reported \'cognitive intrusion\' — São Paulo judge demands military disclosure':
      'Registros de biocontención filtrados — encargados reportaron \'intrusión cognitiva\' — juez de São Paulo exige divulgación militar',
    'SÃO PAULO, Brazil (UPI) — Leaked bio-containment records from a Brazilian military facility describe what personnel referred to as a \'detained biological intelligence\' held for eleven days in a Faraday-shielded chamber, according to documents released on the World Wide Web late Thursday.':
      'SÃO PAULO, Brasil (UPI) — Registros de biocontención filtrados de una instalación militar brasileña describen lo que el personal denominó una \'inteligencia biológica detenida\' mantenida durante once días en una cámara blindada con Faraday, según documentos publicados en la World Wide Web el jueves por la noche.',
    'The logs, which include ethics exception forms signed by a medical committee, describe handlers experiencing \'persistent headaches and reported cognitive intrusion events\' during the detention period. The entity, designated as \'Specimen Alpha\' in some documents and \'Prisoner 45\' in others, is described as exhibiting \'responsive behavior inconsistent with any known terrestrial species.\'':
      'Los registros, que incluyen formularios de excepción ética firmados por un comité médico, describen encargados que experimentaron \'dolores de cabeza persistentes y eventos de intrusión cognitiva reportados\' durante el período de detención. La entidad, designada como \'Espécimen Alpha\' en algunos documentos y \'Prisionero 45\' en otros, se describe como exhibiendo \'comportamiento responsivo inconsistente con cualquier especie terrestre conocida.\'',
    'A judge in São Paulo has ordered the military to produce \'all biological materials recovered in January 1996.\' The military responded Friday that no such materials exist. The leaked containment logs appear to contradict this statement directly.':
      'Un juez en São Paulo ha ordenado a los militares presentar \'todos los materiales biológicos recuperados en enero de 1996.\' Los militares respondieron el viernes que dichos materiales no existen. Los registros de contención filtrados parecen contradecir directamente esta declaración.',

    // ENDING 6: harvest_understood
    'THE HARVEST UNDERSTOOD': 'LA COSECHA COMPRENDIDA',
    'Colonization does not require arrival.': 'La colonización no requiere llegada.',
    'The extraction documents land in the wrong hands — or the right ones. The colonization model. The harvest timeline. The mechanism that requires no ships, no invasion, no contact at all.':
      'Los documentos de extracción caen en las manos equivocadas — o en las correctas. El modelo de colonización. El cronograma de la cosecha. El mecanismo que no requiere naves, ninguna invasión, ningún contacto en absoluto.',
    'Three universities publish independent analyses within a month. The consensus is clinical and devastating: the model is internally consistent, the energy mathematics are sound, and the thirty-year seeding cycle aligns with observed neurological data.':
      'Tres universidades publican análisis independientes en un mes. El consenso es clínico y devastador: el modelo es internamente consistente, las matemáticas energéticas son sólidas, y el ciclo de siembra de treinta años se alinea con los datos neurológicos observados.',
    'Nobody wants to say the word "colonization" on television. They use "resource assessment" instead. It means the same thing.':
      'Nadie quiere decir la palabra "colonización" en televisión. Usan "evaluación de recursos" en su lugar. Significa lo mismo.',
    'they do not need to come here. they never did.': 'no necesitan venir aquí. nunca lo necesitaron.',
    'LEAKED THEORY DESCRIBES \'COLONIZATION WITHOUT ARRIVAL\' BY UNKNOWN INTELLIGENCE':
      'TEORÍA FILTRADA DESCRIBE \'COLONIZACIÓN SIN LLEGADA\' POR INTELIGENCIA DESCONOCIDA',
    'Three universities confirm energy mathematics — \'internally consistent,\' researchers say — no government comment':
      'Tres universidades confirman matemáticas energéticas — \'internamente consistente,\' dicen investigadores — sin comentario gubernamental',
    'CAMBRIDGE, Mass. (AP) — Documents leaked from a classified Brazilian military archive describe a theoretical model for what the files term \'non-arrival colonization\' — a process by which an unknown intelligence could extract resources from a planetary system without physical presence or direct contact, according to an analysis published Thursday by researchers at MIT.':
      'CAMBRIDGE, Mass. (AP) — Documentos filtrados de un archivo militar brasileño clasificado describen un modelo teórico para lo que los archivos denominan \'colonización sin llegada\' — un proceso por el cual una inteligencia desconocida podría extraer recursos de un sistema planetario sin presencia física ni contacto directo, según un análisis publicado el jueves por investigadores del MIT.',
    'Three universities have now independently reviewed the leaked extraction model and confirmed that its energy mathematics are, in the words of one physicist, \'disturbingly sound.\' The model describes a thirty-year seeding cycle that researchers say aligns with observed neurological data from the Brazilian military\'s own classified medical files.':
      'Tres universidades han revisado independientemente el modelo de extracción filtrado y confirmado que sus matemáticas energéticas son, en palabras de un físico, \'perturbadoramente sólidas.\' El modelo describe un ciclo de siembra de treinta años que los investigadores dicen se alinea con datos neurológicos observados de los propios archivos médicos clasificados de los militares brasileños.',
    'No government has issued a formal response. Television commentators have avoided the word \'colonization,\' preferring the term \'resource assessment.\' Scientists familiar with the data say the distinction is academic.':
      'Ningún gobierno ha emitido una respuesta formal. Los comentaristas de televisión han evitado la palabra \'colonización,\' prefiriendo el término \'evaluación de recursos.\' Científicos familiarizados con los datos dicen que la distinción es académica.',

    // ENDING 7: nothing_changes
    'NOTHING CHANGES': 'NADA CAMBIA',
    'The truth arrived. Nobody moved.': 'La verdad llegó. Nadie se movió.',
    'The dossier is strong. Autopsy reports. Field observations. Military intercepts. Enough to establish that something non-human was recovered in Varginha in January 1996. Enough to demand answers.':
      'El dossier es fuerte. Informes de autopsia. Observaciones de campo. Interceptaciones militares. Suficiente para establecer que algo no humano fue recuperado en Varginha en enero de 1996. Suficiente para exigir respuestas.',
    'Panels convene. Experts testify. The footage circulates. For two weeks, the world pays attention. Then an election cycle begins, a currency collapses, a celebrity dies, and the feed moves on.':
      'Se convocan paneles. Expertos testifican. Las imágenes circulan. Durante dos semanas, el mundo presta atención. Luego empieza un ciclo electoral, una moneda colapsa, una celebridad muere y el feed sigue adelante.',
    'The files remain available. Downloaded fourteen million times. Cited in zero policy changes. The truth is free and weightless.':
      'Los archivos siguen disponibles. Descargados catorce millones de veces. Citados en cero cambios de política. La verdad es libre y sin peso.',
    'you proved everything. it was not enough.': 'lo probaste todo. no fue suficiente.',
    'VARGINHA FILES DOWNLOADED 14 MILLION TIMES; GOVERNMENTS WORLDWIDE SILENT':
      'ARCHIVOS DE VARGINHA DESCARGADOS 14 MILLONES DE VECES; GOBIERNOS DE TODO EL MUNDO EN SILENCIO',
    'Evidence called \'compelling\' by experts — zero policy changes — election coverage resumes':
      'Evidencia calificada de \'convincente\' por expertos — cero cambios de política — cobertura electoral reanudada',
    'NEW YORK (AP) — The collection of classified military documents known as the \'Varginha Files\' has been downloaded more than fourteen million times since its release on the Internet two weeks ago, making it one of the most widely distributed document leaks in the brief history of the World Wide Web. Despite this, no government has issued a formal response.':
      'NUEVA YORK (AP) — La colección de documentos militares clasificados conocida como los \'Archivos de Varginha\' ha sido descargada más de catorce millones de veces desde su publicación en Internet hace dos semanas, convirtiéndola en una de las filtraciones de documentos más ampliamente distribuidas en la breve historia de la World Wide Web. A pesar de esto, ningún gobierno ha emitido una respuesta formal.',
    'Panels of experts convened at universities in four countries have called the evidence \'compelling\' and \'worthy of official investigation.\' Footage from the original incident has circulated on cable news networks for approximately twelve days before being displaced by coverage of ongoing elections and financial markets.':
      'Paneles de expertos convocados en universidades de cuatro países han calificado la evidencia de \'convincente\' y \'digna de investigación oficial.\' Imágenes del incidente original circularon en cadenas de noticias por cable durante aproximadamente doce días antes de ser desplazadas por la cobertura de elecciones y mercados financieros.',
    'The files remain freely available on multiple mirror sites. Analysts note that the unprecedented volume of downloads has produced no measurable political or policy impact. \'The truth is out there,\' noted one commentator. \'It turns out that is not sufficient.\'':
      'Los archivos siguen disponibles gratuitamente en múltiples sitios espejo. Analistas señalan que el volumen sin precedentes de descargas no ha producido ningún impacto político o de políticas medible. \'La verdad está allá afuera,\' señaló un comentarista. \'Resulta que eso no es suficiente.\'',

    // ENDING 8: incomplete_picture
    'INCOMPLETE PICTURE': 'CUADRO INCOMPLETO',
    'Fragments do not make a case.': 'Los fragmentos no arman un caso.',
    'The dossier contains evidence, but it tells no story. A medical report here. A transport log there. No thread connects them. No narrative emerges. The files are real and they prove nothing.':
      'El dossier contiene evidencia, pero no cuenta ninguna historia. Un informe médico aquí. Un registro de transporte allá. Ningún hilo los conecta. Ninguna narrativa emerge. Los archivos son reales y no prueban nada.',
    'Debunkers dismantle the leak in a weekend. Each document, taken alone, has an innocent explanation. The military does not even need to respond. The files discredit themselves through isolation.':
      'Los desmentidores desmontan la filtración en un fin de semana. Cada documento, tomado por separado, tiene una explicación inocente. Los militares ni siquiera necesitan responder. Los archivos se desacreditan solos por aislamiento.',
    'You had the pieces. You did not assemble the picture.': 'Tenías las piezas. No armaste el cuadro.',
    'scattered evidence is the same as no evidence.': 'evidencia dispersa es lo mismo que ninguna evidencia.',
    'LEAKED MILITARY DOCUMENTS FAIL TO SUPPORT UFO CLAIMS, SAY ANALYSTS':
      'DOCUMENTOS MILITARES FILTRADOS NO LOGRAN SUSTENTAR AFIRMACIONES SOBRE OVNIS, DICEN ANALISTAS',
    'Debunkers dismantle evidence in 72 hours — \'each file has innocent explanation\' — military issues no denial':
      'Desmentidores desmontan evidencia en 72 horas — \'cada archivo tiene explicación inocente\' — militares no emiten desmentido',
    'WASHINGTON (AP) — A collection of documents leaked from a Brazilian military archive and purporting to describe contact with a non-human intelligence has been largely discredited by independent analysts, who say the files, while possibly authentic, fail to tell a coherent story.':
      'WASHINGTON (AP) — Una colección de documentos filtrados de un archivo militar brasileño que supuestamente describen contacto con una inteligencia no humana ha sido ampliamente desacreditada por analistas independientes, quienes dicen que los archivos, aunque posiblemente auténticos, no logran contar una historia coherente.',
    'The leak contains medical reports, transport logs, and communications intercepts, but analysts say no thread connects them into a meaningful narrative. \'Each document, taken individually, has an innocent explanation,\' said Dr. James Whitfield of Georgetown University. \'Taken together, they prove nothing more than that the Brazilian military generates paperwork.\'':
      'La filtración contiene informes médicos, registros de transporte e interceptaciones de comunicaciones, pero los analistas dicen que ningún hilo los conecta en una narrativa significativa. \'Cada documento, analizado individualmente, tiene una explicación inocente,\' dijo el Dr. James Whitfield de la Universidad de Georgetown. \'En conjunto, no prueban nada más que los militares brasileños generan papeleo.\'',
    'The Brazilian Air Force has issued no official denial, which analysts interpret not as confirmation but as an indication that the documents do not warrant response. Several Internet forums that initially promoted the files have moved on to other topics.':
      'La Fuerza Aérea Brasileña no ha emitido ningún desmentido oficial, lo que los analistas interpretan no como confirmación sino como indicación de que los documentos no ameritan respuesta. Varios foros de Internet que inicialmente promovieron los archivos han pasado a otros temas.',

    // ENDING 9: wrong_story
    'THE WRONG STORY': 'LA HISTORIA EQUIVOCADA',
    'You investigated the cafeteria.': 'Investigaste la cafetería.',
    'The dossier arrives on journalists\' desks and produces genuine confusion. Budget memos. Parking allocations. A coffee harvest report. Media payment records that prove corruption but not contact.':
      'El dossier llega a los escritorios de los periodistas y produce confusión genuina. Memorandos de presupuesto. Asignaciones de estacionamiento. Un informe de cosecha de café. Registros de pagos a medios que prueban corrupción pero no contacto.',
    'The financial angle gains traction. Three military officials face embezzlement charges. A journalist wins an award for exposing the media suppression network. The actual event — the beings, the autopsies, the containment — is never mentioned.':
      'El ángulo financiero gana tracción. Tres oficiales militares enfrentan cargos de malversación. Una periodista gana un premio por exponer la red de supresión mediática. El evento real — los seres, las autopsias, la contención — nunca se menciona.',
    'You exposed a scandal. The wrong one.': 'Expusiste un escándalo. El equivocado.',
    'you found the lie but missed the truth behind it.': 'encontraste la mentira pero perdiste la verdad detrás de ella.',
    'MILITARY BUDGET SCANDAL UNCOVERED IN LEAKED BRAZILIAN DOCUMENTS':
      'ESCÁNDALO DE PRESUPUESTO MILITAR DESCUBIERTO EN DOCUMENTOS BRASILEÑOS FILTRADOS',
    'Three officials face embezzlement charges — journalist wins award for exposé — actual UFO claims ignored':
      'Tres oficiales enfrentan cargos de malversación — periodista gana premio por exposición — afirmaciones reales sobre OVNIs ignoradas',
    'BRASÍLIA, Brazil (Reuters) — Classified documents leaked from a Brazilian military installation have led not to the confirmation of extraterrestrial contact, as the anonymous source apparently intended, but to the exposure of a significant financial corruption network within the armed forces.':
      'BRASILIA, Brasil (Reuters) — Documentos clasificados filtrados de una instalación militar brasileña no llevaron a la confirmación de contacto extraterrestre, como la fuente anónima aparentemente pretendía, sino a la exposición de una significativa red de corrupción financiera dentro de las fuerzas armadas.',
    'The leaked files contain detailed budget memoranda, media payment records, and what prosecutors describe as \'a systematic program to suppress unfavorable news coverage through direct payments to journalists.\' Three senior military officials now face embezzlement and fraud charges. A reporter for Folha de São Paulo has been awarded the Maria Moors Cabot Prize for her coverage of the scandal.':
      'Los archivos filtrados contienen memorandos detallados de presupuesto, registros de pagos a medios, y lo que los fiscales describen como \'un programa sistemático para suprimir cobertura noticiosa desfavorable mediante pagos directos a periodistas.\' Tres oficiales militares sénior ahora enfrentan cargos de malversación y fraude. Una reportera de Folha de São Paulo ha recibido el Premio Maria Moors Cabot por su cobertura del escándalo.',
    'Notably absent from the dossier are any substantive references to the alleged non-human contact that the leaker appeared to be documenting. Analysts describe the collection as \'accidentally important for entirely the wrong reasons.\'':
      'Notablemente ausentes del dossier están las referencias sustantivas al presunto contacto no humano que el responsable de la filtración parecía estar documentando. Analistas describen la colección como \'accidentalmente importante por razones completamente equivocadas.\'',

    // ENDING 10: hackerkid_caught
    'HACKERKID CAUGHT': 'HACKERKID ATRAPADO',
    'The honeypots worked exactly as designed.': 'Los honeypots funcionaron exactamente como fueron diseñados.',
    'Files named URGENT_classified_alpha. SMOKING_GUN_proof. FOR_PRESIDENTS_EYES_ONLY. Real classified material never advertises itself. Every file you saved was planted. Every download was logged.':
      'Archivos llamados URGENT_classified_alpha. SMOKING_GUN_proof. FOR_PRESIDENTS_EYES_ONLY. El material clasificado real nunca se anuncia. Cada archivo que guardaste fue plantado. Cada descarga fue registrada.',
    'Military cybersecurity traces the intrusion to your terminal within ninety minutes. The dossier is quarantined before it reaches a single journalist. Your access credentials are revoked, archived, and forwarded to federal prosecutors.':
      'La ciberseguridad militar rastrea la intrusión hasta tu terminal en noventa minutos. El dossier es puesto en cuarentena antes de llegar a un solo periodista. Tus credenciales de acceso son revocadas, archivadas y enviadas a fiscales federales.',
    'The decoy system was built for people exactly like you. Eager. Careless. Loud.':
      'El sistema de señuelos fue construido para gente exactamente como tú. Ansioso. Descuidado. Ruidoso.',
    'i tried to warn you. real secrets whisper.': 'intenté advertirte. los secretos reales susurran.',
    'COMPUTER HACKER ARRESTED AFTER DOWNLOADING MILITARY DECOY FILES':
      'HACKER INFORMÁTICO ARRESTADO TRAS DESCARGAR ARCHIVOS MILITARES SEÑUELO',
    'Cybersecurity trap worked \'exactly as designed\' — suspect traced in 90 minutes — federal charges pending':
      'Trampa de ciberseguridad funcionó \'exactamente como fue diseñada\' — sospechoso rastreado en 90 minutos — cargos federales pendientes',
    'BRASÍLIA, Brazil (AP) — Brazilian military cybersecurity personnel have arrested an individual suspected of unauthorized intrusion into a classified computer network after the suspect downloaded files that had been deliberately planted as tracking devices, officials confirmed Saturday.':
      'BRASILIA, Brasil (AP) — Personal de ciberseguridad militar brasileño ha arrestado a un individuo sospechoso de intrusión no autorizada en una red informática clasificada después de que el sospechoso descargara archivos que habían sido deliberadamente plantados como dispositivos de rastreo, confirmaron funcionarios el sábado.',
    'The files, with titles such as \'URGENT_classified_alpha\' and \'FOR_PRESIDENTS_EYES_ONLY,\' were designed to appeal to inexperienced intruders and contained embedded tracking mechanisms that allowed military technicians to identify the suspect\'s terminal within ninety minutes of the initial download.':
      'Los archivos, con títulos como \'URGENT_classified_alpha\' y \'FOR_PRESIDENTS_EYES_ONLY,\' fueron diseñados para atraer a intrusos inexpertos y contenían mecanismos de rastreo integrados que permitieron a los técnicos militares identificar el terminal del sospechoso en noventa minutos desde la descarga inicial.',
    'A military spokesperson confirmed that the decoy system, which has been in place since 1994, was built specifically to identify and apprehend \'unsophisticated intrusion attempts.\' The suspect\'s collected files were quarantined before reaching any external recipient. Federal prosecutors have been notified.':
      'Un portavoz militar confirmó que el sistema de señuelos, en funcionamiento desde 1994, fue construido específicamente para identificar y aprehender \'intentos de intrusión poco sofisticados.\' Los archivos recopilados por el sospechoso fueron puestos en cuarentena antes de llegar a cualquier destinatario externo. Los fiscales federales han sido notificados.',

    // ENDING 11: secret_ending
    'THE FERREIRA PROTOCOL': 'EL PROTOCOLO FERREIRA',
    'Ghost. Signal. Bridge. Ambassador.': 'Fantasma. Señal. Puente. Embajador.',
    'Carlos Eduardo Ferreira. UFO74. The ghost in the machine. His archive decrypted. His identity confirmed. But the dossier contains more than a confession — it contains the convergence model, the neural connection data, and the thirty-year projection.':
      'Carlos Eduardo Ferreira. UFO74. El fantasma en la máquina. Su archivo descifrado. Su identidad confirmada. Pero el dossier contiene más que una confesión — contiene el modelo de convergencia, los datos de conexión neural y la proyección de treinta años.',
    'The combination is deliberate. Ferreira designed it this way. The identity file authenticates the source. The neural data proves contact. The convergence model provides the timeline. Together they form a single argument no committee can dismiss.':
      'La combinación es deliberada. Ferreira lo diseñó así. El archivo de identidad autentica la fuente. Los datos neurales prueban contacto. El modelo de convergencia proporciona la línea de tiempo. Juntos forman un único argumento que ningún comité puede rechazar.',
    'The Brazilian Air Force confirms the service record. Three allied governments request the neural data. The 2026 window enters official threat assessment documents. Ferreira\'s archive becomes the foundation of the first multinational contact protocol.':
      'La Fuerza Aérea Brasileña confirma la hoja de servicio. Tres gobiernos aliados solicitan los datos neurales. La ventana de 2026 entra en documentos oficiales de evaluación de amenazas. El archivo de Ferreira se convierte en la base del primer protocolo multinacional de contacto.',
    'He built this for thirty years. He built it for you.': 'Construyó esto durante treinta años. Lo construyó para ti.',
    'you assembled everything. i can rest now.': 'lo armaste todo. ahora puedo descansar.',
    'MULTINATIONAL GOVERNMENTS ESTABLISH FIRST \'CONTACT PROTOCOL\' BASED ON LEAKED ARCHIVE':
      'GOBIERNOS MULTINACIONALES ESTABLECEN PRIMER \'PROTOCOLO DE CONTACTO\' BASADO EN ARCHIVO FILTRADO',
    'Three allied nations request neural data — 2026 threat window enters official assessment — Ferreira archive authenticated':
      'Tres naciones aliadas solicitan datos neurales — ventana de amenaza 2026 entra en evaluación oficial — archivo Ferreira autenticado',
    'UNITED NATIONS, New York (AP) — Representatives of three allied governments have formally requested access to neural interface data contained in a leaked Brazilian military archive, marking what diplomats describe as the first official acknowledgment that the documents may describe genuine non-human contact.':
      'NACIONES UNIDAS, Nueva York (AP) — Representantes de tres gobiernos aliados han solicitado formalmente acceso a datos de interfaz neural contenidos en un archivo militar brasileño filtrado, marcando lo que diplomáticos describen como el primer reconocimiento oficial de que los documentos pueden describir contacto genuino con inteligencia no humana.',
    'The archive, compiled over thirty years by Brazilian Air Force intelligence officer Carlos Eduardo Ferreira, contains identity verification documents, neural connection data, and a convergence model that projects a significant event window in September 2026. Intelligence analysts say the combination was deliberately designed to form \'a single argument no committee can dismiss.\'':
      'El archivo, compilado a lo largo de treinta años por el oficial de inteligencia de la Fuerza Aérea Brasileña Carlos Eduardo Ferreira, contiene documentos de verificación de identidad, datos de conexión neural y un modelo de convergencia que proyecta una ventana de evento significativo en septiembre de 2026. Analistas de inteligencia dicen que la combinación fue deliberadamente diseñada para formar \'un único argumento que ningún comité puede rechazar.\'',
    'The Brazilian Air Force has confirmed Ferreira\'s service record. The 2026 projection has entered official threat assessment documents in at least two NATO member states. Sources describe the emerging multinational response as \'the first contact protocol\' — a framework for coordinated government action in response to verified non-human intelligence.':
      'La Fuerza Aérea Brasileña ha confirmado la hoja de servicio de Ferreira. La proyección de 2026 ha entrado en documentos oficiales de evaluación de amenazas en al menos dos estados miembros de la OTAN. Fuentes describen la respuesta multinacional emergente como \'el primer protocolo de contacto\' — un marco para acción gubernamental coordinada en respuesta a inteligencia no humana verificada.',

    // ENDING 12: real_ending
    'UNDENIABLE': 'INNEGABLE',
    'The dossier that could not be ignored.': 'El dossier que no podía ser ignorado.',
    'Core evidence. Autopsy records. Witness testimony. Military logistics. Each category reinforces the others. The field journal establishes contact. The autopsy proves non-human biology. The witnesses confirm the timeline. The transport logs confirm the coverup.':
      'Evidencia central. Registros de autopsia. Testimonios. Logística militar. Cada categoría refuerza las otras. El diario de campo establece contacto. La autopsia prueba biología no humana. Los testigos confirman la línea de tiempo. Los registros de transporte confirman el encubrimiento.',
    'The dossier does not ask questions. It presents facts in a sequence that permits only one conclusion. International press picks it up within hours. The Brazilian government requests seventy-two hours before responding. They use all of them.':
      'El dossier no hace preguntas. Presenta hechos en una secuencia que permite solo una conclusión. La prensa internacional lo recoge en horas. El gobierno brasileño pide setenta y dos horas antes de responder. Las usan todas.',
    'The response, when it comes, is seven words: "The matter is under renewed investigation." Those seven words change everything. Denial is no longer the official position. Thirty years of silence end with a single sentence.':
      'La respuesta, cuando llega, son siete palabras: "El asunto está bajo investigación renovada." Esas siete palabras lo cambian todo. La negación ya no es la posición oficial. Treinta años de silencio terminan con una sola oración.',
    'they cannot unsay those seven words.': 'no pueden desdecir esas siete palabras.',
    'BRAZIL BREAKS SILENCE: \'THE MATTER IS UNDER RENEWED INVESTIGATION\'':
      'BRASIL ROMPE EL SILENCIO: \'EL ASUNTO ESTÁ BAJO INVESTIGACIÓN RENOVADA\'',
    'Seven words end thirty years of official denial — international press demands full disclosure — dossier called \'undeniable\'':
      'Siete palabras ponen fin a treinta años de negación oficial — prensa internacional exige divulgación completa — dossier calificado de \'innegable\'',
    'BRASÍLIA, Brazil (AP) — The Brazilian government has issued its first official acknowledgment of the 1996 Varginha incident, stating in a seven-word response that \'the matter is under renewed investigation.\' The statement, released seventy-two hours after the most comprehensive dossier of evidence ever assembled reached international press outlets, effectively ends three decades of official denial.':
      'BRASILIA, Brasil (AP) — El gobierno brasileño ha emitido su primer reconocimiento oficial del incidente de Varginha de 1996, declarando en una respuesta de siete palabras que \'el asunto está bajo investigación renovada.\' La declaración, publicada setenta y dos horas después de que el dossier de evidencias más completo jamás ensamblado llegara a los medios de prensa internacionales, efectivamente pone fin a tres décadas de negación oficial.',
    'The dossier combines field journals establishing direct contact, autopsy records confirming non-human biology, independent witness testimony verifying the timeline, and military transport logs documenting the coverup. International press agencies describe the evidence as \'presenting facts in a sequence that permits only one conclusion.\'':
      'El dossier combina diarios de campo que establecen contacto directo, registros de autopsia que confirman biología no humana, testimonios independientes que verifican la línea de tiempo y registros de transporte militar que documentan el encubrimiento. Agencias de prensa internacionales describen la evidencia como \'presentando hechos en una secuencia que permite solo una conclusión.\'',
    'Analysts note that the carefully worded response stops short of confirming extraterrestrial contact but represents a fundamental shift in the government\'s position. \'They cannot unsay those seven words,\' noted one diplomatic observer. \'Denial is no longer the official position. Everything changes from here.\'':
      'Analistas señalan que la respuesta cuidadosamente redactada no llega a confirmar contacto extraterrestre pero representa un cambio fundamental en la posición del gobierno. \'No pueden desdecir esas siete palabras,\' señaló un observador diplomático. \'La negación ya no es la posición oficial. Todo cambia a partir de aquí.\'',
    'Leak sequence not initialized.': 'Secuencia de filtración no inicializada.',
    '  LEAK CHANNEL ALREADY PREPARED': '  CANAL DE FILTRACIÓN YA PREPARADO',
    '  Run "leak" with no arguments to transmit once all files are saved.': '  Ejecute "leak" sin argumentos para transmitir cuando todos los archivos estén guardados.',
    '  ▸ PREPARATION SEQUENCE COMPLETE': '  ▸ SECUENCIA DE PREPARACIÓN COMPLETA',
    '  ▸ Leak channel decrypted and standing by.': '  ▸ Canal de filtración descifrado y en espera.',
    '[UFO74]: channel is open. run "leak" when you have all ten.': '[UFO74]: canal abierto. ejecute "leak" cuando tenga los diez.',
    '  ✗ SEQUENCE MISMATCH — protocol reset': '  ✗ DISCREPANCIA DE SECUENCIA — protocolo reiniciado',
    '  ⚠ Detection level increased (+5%)': '  ⚠ Nivel de detección aumentado (+5%)',
    '  Preparation sequence must be restarted from step 1.': '  La secuencia de preparación debe reiniciarse desde el paso 1.',
    '  LEAK TRANSMISSION INITIATED': '  TRANSMISIÓN DE FILTRACIÓN INICIADA',
    '  Encrypting for distribution...': '  Cifrando para distribución...',
    '  Channel open.': '  Canal abierto.',
    '  TRANSMISSION SUCCESSFUL.': '  TRANSMISIÓN EXITOSA.',
    '  LEAK CHANNEL READY — awaiting full evidence package.': '  CANAL DE FILTRACIÓN LISTO — esperando paquete completo de evidencias.',
    '  Save all 10 files, then run "leak" again.': '  Guarde los 10 archivos, luego ejecute "leak" de nuevo.',
    '[UFO74]: channel is prepped. just need the rest of the files.': '[UFO74]: canal preparado. solo faltan el resto de los archivos.',
    '  LEAK CHANNEL ENCRYPTED': '  CANAL DE FILTRACIÓN CIFRADO',
    '  The leak channel requires a 3-command preparation': '  El canal de filtración requiere una preparación de 3 comandos',
    '  sequence before it can be opened.': '  antes de poder ser abierto.',
    '  Run the following commands IN ORDER:': '  Ejecute los siguientes comandos EN ORDEN:',
    '  ⚠ Wrong order will reset the sequence and raise detection.': '  ⚠ Orden incorrecto reiniciará la secuencia y aumentará la detección.',
    '[UFO74]: encrypted channel. follow the protocol exactly.': '[UFO74]: canal cifrado. siga el protocolo exactamente.',
    '  LEAK CHANNEL — PREPARATION IN PROGRESS': '  CANAL DE FILTRACIÓN — PREPARACIÓN EN CURSO',
    '  No files saved yet.': '  Ningún archivo guardado aún.',
    '  Use "save <filename>" after reading a file.': '  Use "save <archivo>" después de leer un archivo.',
    '  SAVED FILES:': '  ARCHIVOS GUARDADOS:',
    '  READY — type "leak" when prepared.': '  LISTO — escriba "leak" cuando esté preparado.',
    '  ⚠ ELEVATED SECURITY PROTOCOL — monitoring increased': '  ⚠ PROTOCOLO DE SEGURIDAD ELEVADO — monitoreo aumentado',
    '  DOSSIER — LEAK PREPARATION': '  DOSSIER — PREPARACIÓN DE FILTRACIÓN',
    '  No files saved. Use "save <filename>" after reading a file.': '  Ningún archivo guardado. Use "save <archivo>" después de leer un archivo.',
    '  DOSSIER COMPLETE — type "leak" when ready.': '  DOSSIER COMPLETO — escriba "leak" cuando esté listo.',
    '  SIGNAL: Residual echo persists in relay buffer.': '  SEÑAL: Eco residual persiste en el búfer de retransmisión.',
    '  NOTE: One response arrived before keystroke registration.': '  NOTA: Una respuesta llegó antes del registro de tecla.',
    '  NOTE: Command cadence is being mirrored faintly.': '  NOTA: La cadencia de comandos se refleja débilmente.',
    '  SIGNAL: Background carrier present. Source unresolved.': '  SEÑAL: Portadora de fondo presente. Origen no resuelto.',
    '  NOTICE: Query pattern resembles prior containment interviews.': '  AVISO: Patrón de consulta se asemeja a entrevistas previas de contención.',
    '║                  DOSSIER MAP                          ║': '║                 MAPA DEL DOSSIER                       ║',

    // Missing COMMAND_HELP detailed help translations
    '  help basics    - Show the new-player guide':
      '  help basics    - Muestra la guía para nuevos jugadores',
    'List contents of current directory.': 'Lista el contenido del directorio actual.',
    'Save a personal note to help you remember important details.':
      'Guarda una nota personal para recordar detalles importantes.',
    '  note Check the date on transport log':
      '  note Verificar la fecha en el registro de transporte',
    '  note Password might be varginha': '  note La contraseña podría ser varginha',
    'Review the files saved to your dossier.':
      'Revisa los archivos guardados en tu dossier.',
    '  progress       - Show your saved files and dossier status':
      '  progress       - Muestra tus archivos guardados y el estado del dossier',
    'Clear the terminal display.': 'Limpia la pantalla del terminal.',
    'Re-display the last opened file without increasing risk.':
      'Vuelve a mostrar el último archivo abierto sin aumentar el riesgo.',
    'List all files you have not yet opened.':
      'Lista todos los archivos que aún no has abierto.',
    'Toggle tutorial tips or replay the introduction.':
      'Alterna los consejos del tutorial o repite la introducción.',
    'When tutorial mode is ON, helpful tips appear at key moments:':
      'Cuando el modo tutorial está ACTIVO, aparecen consejos útiles en momentos clave:',
    '  - When the case reaches major evidence milestones':
      '  - Cuando el caso alcanza hitos importantes de evidencia',
    'Decipher intercepted morse code messages.':
      'Descifra mensajes interceptados en código morse.',
    'First read a morse intercept file (e.g., morse_intercept.sig).':
      'Primero lee un archivo de interceptación morse (p. ej., morse_intercept.sig).',
    'Then use this command to submit your translation.':
      'Luego usa este comando para enviar tu traducción.',
    'WARNING: This action triggers the endgame sequence.':
      'ADVERTENCIA: Esta acción activa la secuencia final.',
    'COMMAND: hint': 'COMANDO: hint',
    'Request guidance when you are stuck.':
      'Solicita orientación cuando estés atascado.',
    '  hint              - Receive a contextual hint':
      '  hint              - Recibe una pista contextual',
    '  - Hints are LIMITED (8 per run)': '  - Las pistas son LIMITADAS (8 por sesión)',
    '  - Hints react to your progress, risk, and missing leads':
      '  - Las pistas reaccionan a tu progreso, riesgo y pistas faltantes',
    '  - Cannot reveal specific file names or answers':
      '  - No pueden revelar nombres de archivos o respuestas específicas',
    'Use sparingly. Trust your own analysis.':
      'Úsalas con moderación. Confía en tu propio análisis.',
    'Wait and let attention drift elsewhere.':
      'Espera y deja que la atención se desvíe hacia otro lugar.',
    'Limited uses per session (3).': 'Usos limitados por sesión (3).',
    'Strategic use can help avoid detection.':
      'El uso estratégico puede ayudar a evitar la detección.',
    'Establish neural connection with recovered consciousness.':
      'Establece conexión neural con la consciencia recuperada.',
    '  Requires a .psi neural pattern file.':
      '  Requiere un archivo de padrón neural .psi.',
    '  Check /storage/quarantine/ for psi files.':
      '  Revisa /storage/quarantine/ para archivos psi.',
    'Execute administrative override with access code.':
      'Ejecuta override administrativo con código de acceso.',
    '  override protocol <code>': '  override protocol <code>',
    'HINT: The access code can be obtained through encrypted channels.':
      'PISTA: El código de acceso se puede obtener a través de canales encriptados.',
    'Release a containment subject.': 'Libera a un sujeto de contención.',
    '  release <target>': '  release <target>',
  },
};
