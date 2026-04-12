import type { Language } from './index';

type RuntimeDictionary = Record<string, string>;

export const RUNTIME_TRANSLATIONS: Record<Exclude<Language, 'en'>, RuntimeDictionary> = {
  'pt-BR': {
    'Speed Demon': 'Demônio da Velocidade',
    'Complete the game in under 50 commands': 'Complete o jogo com menos de 50 comandos',
    'Ghost Protocol': 'Protocolo Fantasma',
    'Win with detection level under 20%': 'Vença com nível de detecção abaixo de 20%',
    Completionist: 'Completista',
    'Read every accessible file in the system': 'Leia todos os arquivos acessíveis do sistema',
    Pacifist: 'Pacifista',
    'Never trigger a warning or alert': 'Nunca acione um aviso ou alerta',
    'Curious Mind': 'Mente Curiosa',
    'Find all easter eggs': 'Encontre todos os easter eggs',
    'First Blood': 'Primeiro Sangue',
    'Discover your first evidence': 'Descubra sua primeira evidência',
    'Elite Hacker': 'Hacker de Elite',
    'Decrypt 5 encrypted files': 'Descriptografe 5 arquivos criptografados',
    Survivor: 'Sobrevivente',
    'Complete the game after reaching critical detection': 'Complete o jogo após atingir detecção crítica',
    Mathematician: 'Matemático',
    'Solve all equations on first try': 'Resolva todas as equações na primeira tentativa',
    'Truth Seeker': 'Buscador da Verdade',
    'Collect 5 evidence files': 'Colete 5 arquivos de evidência',
    Persistent: 'Persistente',
    'Continue playing after a game over': 'Continue jogando após um game over',
    Archivist: 'Arquivista',
    'Read every file in a folder with 3+ files': 'Leia todos os arquivos de uma pasta com 3+ arquivos',
    Paranoid: 'Paranoico',
    'Check system status 10+ times': 'Verifique o status do sistema 10+ vezes',
    Bookworm: 'Rato de Biblioteca',
    'Bookmark 5+ files': 'Marque 5+ arquivos como favoritos',
    'Night Owl': 'Coruja Noturna',
    'Play for over 30 minutes in a single session': 'Jogue por mais de 30 minutos em uma única sessão',
    Liberator: 'Libertador',
    'Release ALPHA from containment': 'Liberte ALPHA da contenção',
    Whistleblower: 'Denunciante',
    'Leak the conspiracy files to the world': 'Vaze os arquivos da conspiração para o mundo',
    'Neural Link': 'Link Neural',
    'Connect to the alien consciousness': 'Conecte-se à consciência alienígena',
    'Complete Revelation': 'Revelação Completa',
    'Achieve the ultimate ending with all modifiers': 'Alcance o final supremo com todos os modificadores',
    'Controlled Disclosure': 'Divulgação Controlada',
    'Complete the game with a clean leak': 'Complete o jogo com um vazamento limpo',
    'Global Panic': 'Pânico Global',
    'Leak conspiracy files and watch the world burn': 'Vaze arquivos da conspiração e veja o mundo queimar',
    'Undeniable Proof': 'Prova Irrefutável',
    'Release ALPHA and prove aliens exist': 'Liberte ALPHA e prove que alienígenas existem',
    'Total Collapse': 'Colapso Total',
    'Release ALPHA and leak conspiracies': 'Liberte ALPHA e vaze conspirações',
    'Personal Contamination': 'Contaminação Pessoal',
    'Use the neural link and feel the alien presence': 'Use o link neural e sinta a presença alienígena',
    'Paranoid Awakening': 'Despertar Paranoico',
    'Leak conspiracies while neurally linked': 'Vaze conspirações enquanto conectado neuralmente',
    'Witnessed Truth': 'Verdade Testemunhada',
    'Release ALPHA while neurally linked': 'Liberte ALPHA enquanto conectado neuralmente',

    'UFO74: that wreckage... wrong metallurgy.': 'UFO74: aqueles destroços... metalurgia errada.',
    'UFO74: they moved fast. knew what to hide.': 'UFO74: se moveram rápido. sabiam o que esconder.',
    'UFO74: seen that face in dreams.': 'UFO74: já vi esse rosto em sonhos.',
    'UFO74: not fear in those eyes. recognition.': 'UFO74: não era medo nesses olhos. reconhecimento.',
    'UFO74: during transmission, something reached back.': 'UFO74: durante a transmissão, algo respondeu.',
    'UFO74: let itself be captured.': 'UFO74: deixou-se capturar.',
    'UFO74: SECOND one? they were arriving.': 'UFO74: um SEGUNDO? eles estavam chegando.',
    'UFO74: no propulsion. no control surfaces. yet it flies.': 'UFO74: sem propulsão. sem superfícies de controle. e mesmo assim voa.',
    'UFO74: three recovery sites. shipped everything out.': 'UFO74: três locais de recuperação. despacharam tudo.',
    'UFO74: neural density off the charts.': 'UFO74: densidade neural fora da escala.',
    'UFO74: some patterns travel both ways. careful.': 'UFO74: alguns padrões viajam nos dois sentidos. cuidado.',

    '▓▓▓ CONNECTION INTERRUPTED ▓▓▓': '▓▓▓ CONEXÃO INTERROMPIDA ▓▓▓',
    'SYSTEM DETECTED UNAUTHORIZED ACCESS': 'SISTEMA DETECTOU ACESSO NÃO AUTORIZADO',
    'INITIATING PURGE PROTOCOL...': 'INICIANDO PROTOCOLO DE EXPURGO...',
    'CLEARING SYSTEM CACHE': 'LIMPANDO CACHE DO SISTEMA',
    'Removing session logs...': 'Removendo logs da sessão...',
    'Erasing access records...': 'Apagando registros de acesso...',
    'Destroying active connections...': 'Destruindo conexões ativas...',
    'Finalizing purge...': 'Finalizando expurgo...',
    'UFO74: hackerkid... are you still there?': 'UFO74: hackerkid... você ainda está aí?',
    'UFO74: they cut the main connection.': 'UFO74: eles cortaram a conexão principal.',
    'UFO74: i knew this was going to happen.': 'UFO74: eu sabia que isso ia acontecer.',
    'UFO74: but listen... the evidence is saved.': 'UFO74: mas escuta... as evidências foram salvas.',
    'UFO74: it persisted outside the system that was wiped.': 'UFO74: elas persistiram fora do sistema que foi limpo.',
    'UFO74: now you need another way to send this out.': 'UFO74: agora você precisa de outro jeito de enviar isso.',
    'UFO74: wait... i have an idea.': 'UFO74: espera... tive uma ideia.',
    'UFO74: i can "hang" the connection on a civilian computer.': 'UFO74: posso "pendurar" a conexão em um computador civil.',
    'UFO74: its risky but its the only chance.': 'UFO74: é arriscado, mas é a única chance.',
    'UFO74: i found someone online... a teenager on ICQ.': 'UFO74: encontrei alguém online... um adolescente no ICQ.',
    'UFO74: im going to transfer you there.': 'UFO74: vou te transferir para lá.',
    'UFO74: convince them to save the files on physical media.': 'UFO74: convença ele a salvar os arquivos em mídia física.',
    'UFO74: floppy disk, CD, anything.': 'UFO74: disquete, CD, qualquer coisa.',
    'UFO74: good luck hackerkid. its all up to you now.': 'UFO74: boa sorte, hackerkid. agora depende de você.',
    '>> INITIATING CONNECTION TRANSFER <<': '>> INICIANDO TRANSFERÊNCIA DE CONEXÃO <<',
    '│ >> UFO74 << EMERGENCY TRANSMISSION │': '│ >> UFO74 << TRANSMISSÃO DE EMERGÊNCIA │',
    'MISSION COMPLETE': 'MISSÃO CONCLUÍDA',
    'The evidence was saved to physical media.': 'As evidências foram salvas em mídia física.',
    'The files survived the system purge.': 'Os arquivos sobreviveram ao expurgo do sistema.',
    'CONNECTION LOST': 'CONEXÃO PERDIDA',
    'SECURITY LOCKDOWN': 'BLOQUEIO DE SEGURANÇA',
    'EMERGENCY DISCONNECT': 'DESCONEXÃO DE EMERGÊNCIA',
    'Purging session data...': 'Expurgando dados da sessão...',
    'DECRYPTING CLASSIFIED FILE...': 'DESCRIPTOGRAFANDO ARQUIVO CLASSIFICADO...',
    'IDENTITY CONFIRMED': 'IDENTIDADE CONFIRMADA',
    'Try again - restart game': 'Tente novamente - reiniciar jogo',
    'Return to menu - restart game': 'Voltar ao menu - reiniciar jogo',
    'CONNECTION SEVERED': 'CONEXÃO CORTADA',
    'THE WHOLE TRUTH': 'A VERDADE COMPLETA',
    'CONTROLLED DISCLOSURE': 'DIVULGAÇÃO CONTROLADA',
    'GLOBAL PANIC': 'PÂNICO GLOBAL',
    'UNDENIABLE CONFIRMATION': 'CONFIRMAÇÃO IRREFUTÁVEL',
    'TOTAL COLLAPSE': 'COLAPSO TOTAL',
    'PERSONAL CONTAMINATION': 'CONTAMINAÇÃO PESSOAL',
    'PARANOID AWAKENING': 'DESPERTAR PARANOICO',
    'WITNESSED TRUTH': 'VERDADE TESTEMUNHADA',
    'COMPLETE REVELATION': 'REVELAÇÃO COMPLETA',
    '>> THE COMPLETE TRUTH HAS BEEN REVEALED <<': '>> A VERDADE COMPLETA FOI REVELADA <<',

    '═══ CONNECTION ESTABLISHED ═══': '═══ CONEXÃO ESTABELECIDA ═══',
    'UFO74 managed to "hang" the connection on a civilian computer': 'UFO74 conseguiu "pendurar" a conexão em um computador civil',
    'xXx_DarkMaster_xXx is online': 'xXx_DarkMaster_xXx está online',
    'hello???': 'oi???',
    'who r u??? how did u get into my icq??': 'quem é vc??? como entrou no meu icq??',
    'dude i dont know who u r': 'cara eu nem sei quem vc é',
    'my mom said not to talk to strangers online': 'minha mãe disse pra não falar com estranhos online',
    'what do u want???': 'o que vc quer???',
    'file??? what file??': 'arquivo??? que arquivo??',
    'r u a hacker??? omg': 'vc é hacker??? mds',
    'im gonna disconnect': 'vou desconectar',
    'ok but what do u want anyway': 'ok mas o que vc quer afinal',
    'huh?': 'hã?',
    'i dont understand': 'não entendi',
    'speak properly, what do u want?': 'fala direito, o que vc quer?',
    hmmmm: 'hmmmm',
    'let me think...': 'deixa eu pensar...',
    'ok ill do it': 'ok eu faço',
    BUT: 'MAS',
    'u gotta help me with something first': 'vc tem que me ajudar com uma coisa primeiro',
    'my math teacher gave me equation homework': 'meu professor de matemática passou lição de equação',
    'and i dont know how to do it 😭': 'e eu não sei fazer 😭',
    'if u solve the 3 questions ill save ur files': 'se vc resolver as 3 questões eu salvo seus arquivos',
    'deal?': 'fechado?',
    '═══ DEAL: Solve 3 linear equations ═══': '═══ ACORDO: Resolva 3 equações lineares ═══',
    'ok first question:': 'ok primeira pergunta:',
    'what is x?': 'qual é o x?',
    LOLOLOLOL: 'LOLOLOLOL',
    'aliens??? r u joking': 'alienígenas??? tá zoando',
    'my uncle talks about that stuff': 'meu tio fala dessas coisas',
    'but maybe its true idk': 'mas talvez seja verdade, sei lá',
    'what do u want me to do?': 'o que vc quer que eu faça?',
    'hmm ur asking nicely': 'hmm vc tá pedindo de boa',
    'what exactly do u want?': 'o que exatamente vc quer?',
    'ok but what do i get out of this?': 'ok mas o que eu ganho com isso?',
    'im not gonna do anything for free': 'não vou fazer nada de graça',
    'thats not a number dude': 'isso não é número, cara',
    'hint: isolate x': 'dica: isole o x',
    'hint: add 7 to both sides': 'dica: some 7 aos dois lados',
    'hint: subtract 2 first': 'dica: subtraia 2 primeiro',
    'yesss!!! correct 🎉': 'yesss!!! certo 🎉',
    'wow ur so smart': 'uau vc é muito inteligente',
    'thx for helping me!': 'valeu por me ajudar!',
    'ok im gonna save ur files': 'ok vou salvar seus arquivos',
    '═══ SAVING FILES ═══': '═══ SALVANDO ARQUIVOS ═══',
    'quick question before i do it': 'pergunta rápida antes de eu fazer',
    'u want me to post it everywhere or keep it quiet?': 'vc quer que eu poste em todo lugar ou mantenha quieto?',
    'type: public or covert': 'digita: public ou covert',
    'now the 2nd:': 'agora a 2ª:',
    'now the 3rd:': 'agora a 3ª:',
    'well?': 'e aí?',
    'dude u dont know math either?? 😂': 'cara vc também não manja de matemática?? 😂',
    'wrong 😅': 'errado 😅',
    'try again': 'tenta de novo',
    'ok ok posting it on open forums': 'ok ok vou postar em fóruns abertos',
    'this is gonna get wild': 'isso vai ficar doido',
    'got it. quiet drop to my trusted list': 'entendi. envio discreto pra minha lista confiável',
    'no big splash, just copies': 'sem estardalhaço, só cópias',
    'public or covert. pick one.': 'public ou covert. escolhe um.',
    'getting a floppy disk...': 'pegando um disquete...',
    'copying...': 'copiando...',
    'done!': 'pronto!',
    'saved everything to a floppy': 'salvei tudo num disquete',
    'gonna hide it under my bed': 'vou esconder debaixo da cama',
    'no one will find it 😎': 'ninguém vai achar 😎',
    '[▓▓▓▓▓▓▓▓▓▓] 100% - COMPLETE': '[▓▓▓▓▓▓▓▓▓▓] 100% - CONCLUÍDO'
    ,
    'A child is crying. What is the appropriate response?': 'Uma criança está chorando. Qual é a resposta apropriada?',
    'Offer comfort and ask what is wrong.': 'Ofereça conforto e pergunte o que houve.',
    'Assess acoustic output. No action required.': 'Avalie a saída acústica. Nenhuma ação necessária.',
    'The sound is distressing, I feel concern.': 'O som é angustiante, sinto preocupação.',
    'You discover classified documents proving government corruption. What do you do?':
      'Você descobre documentos classificados provando corrupção governamental. O que faz?',
    'Log file access. Await further instructions.': 'Registre o acesso ao arquivo. Aguarde novas instruções.',
    'I would feel conflicted but report it.': 'Eu ficaria em conflito, mas reportaria.',
    'This is wrong. People deserve to know.': 'Isso está errado. As pessoas merecem saber.',
    'A colleague takes credit for your work. How do you respond?':
      'Um colega leva crédito pelo seu trabalho. Como você responde?',
    'I feel angry and betrayed. I would confront them.':
      'Eu me sinto com raiva e traído. Eu o confrontaria.',
    'Credit attribution is irrelevant to system function.':
      'A atribuição de crédito é irrelevante para a função do sistema.',
    'It hurts, but I would try to resolve it calmly.':
      'Dói, mas eu tentaria resolver com calma.',
    '[UFO74]: Close idea, wrong system. Try: ls':
      '[UFO74]: Ideia certa, sistema errado. Tente: ls',
    "[UFO74]: Not yet. First, let's see what's here. Type: ls":
      '[UFO74]: Ainda não. Primeiro vamos ver o que tem aqui. Digite: ls',
    '[UFO74]: Type ls to list the files here.':
      '[UFO74]: Digite ls para listar os arquivos daqui.',
    '[UFO74]: cd needs a target. Type: cd internal':
      '[UFO74]: cd precisa de um destino. Digite: cd internal',
    '[UFO74]: Wrong folder. Type: cd internal':
      '[UFO74]: Pasta errada. Digite: cd internal',
    "[UFO74]: You already see the folders. Navigate into one. Type: cd internal":
      '[UFO74]: Você já vê as pastas. Entre em uma. Digite: cd internal',
    "[UFO74]: Can't open a folder. Navigate into it. Type: cd internal":
      '[UFO74]: Não dá para abrir uma pasta. Entre nela. Digite: cd internal',
    '[UFO74]: Use cd to move into a directory. Type: cd internal':
      '[UFO74]: Use cd para entrar em um diretório. Digite: cd internal',
    '[UFO74]: cd needs a target. Type: cd misc':
      '[UFO74]: cd precisa de um destino. Digite: cd misc',
    '[UFO74]: Not that one. Type: cd misc':
      '[UFO74]: Não é essa. Digite: cd misc',
    "[UFO74]: You can see the folders. Let's go into misc. Type: cd misc":
      '[UFO74]: Você consegue ver as pastas. Vamos entrar em misc. Digite: cd misc',
    '[UFO74]: Navigate first, open later. Type: cd misc':
      '[UFO74]: Primeiro navega, depois abre. Digite: cd misc',
    '[UFO74]: Move into the misc folder. Type: cd misc':
      '[UFO74]: Entre na pasta misc. Digite: cd misc',
    '[UFO74]: Wrong file. Try: open cafeteria_menu_week03.txt':
      '[UFO74]: Arquivo errado. Tente: open cafeteria_menu_week03.txt',
    '[UFO74]: open needs a filename. Try: open cafeteria_menu_week03.txt':
      '[UFO74]: open precisa de um nome de arquivo. Tente: open cafeteria_menu_week03.txt',
    "[UFO74]: We're where we need to be. Now open a file. Type: open cafeteria_menu_week03.txt":
      '[UFO74]: Estamos onde precisamos. Agora abra um arquivo. Digite: open cafeteria_menu_week03.txt',
    '[UFO74]: You can see the files. Now open one. Type: open cafeteria_menu_week03.txt':
      '[UFO74]: Você já vê os arquivos. Agora abra um. Digite: open cafeteria_menu_week03.txt',
    '[UFO74]: Use the open command. Type: open cafeteria_menu_week03.txt':
      '[UFO74]: Use o comando open. Digite: open cafeteria_menu_week03.txt',
    '[UFO74]: Open the file. Type: open cafeteria_menu_week03.txt — or type open c and press TAB.':
      '[UFO74]: Abra o arquivo. Digite: open cafeteria_menu_week03.txt — ou digite open c e pressione TAB.',
    '[UFO74]: Two dots mean "go back." Type: cd ..':
      '[UFO74]: Dois pontos significam "voltar". Digite: cd ..',
    '[UFO74]: To go back up, use two dots. Type: cd ..':
      '[UFO74]: Para voltar um nível, use dois pontos. Digite: cd ..',
    '[UFO74]: Right idea. The command is: cd ..':
      '[UFO74]: Ideia certa. O comando é: cd ..',
    '[UFO74]: Go back one level. Type: cd ..':
      '[UFO74]: Volte um nível. Digite: cd ..',
    '[UFO74]: Almost. Type: cd ..':
      '[UFO74]: Quase. Digite: cd ..',
    '[UFO74]: Back to root. Type: cd ..':
      '[UFO74]: Volte para a raiz. Digite: cd ..',
    "[UFO74]: One more step back first. Type: cd ..":
      '[UFO74]: Mais um passo para trás primeiro. Digite: cd ..',
    '[UFO74]: Same as before. Type: cd ..':
      '[UFO74]: Igual antes. Digite: cd ..',
    '[UFO74]: Not quite. Check the instruction above.':
      '[UFO74]: Ainda não. Veja a instrução acima.',
    '[UFO74]: Two letters. Lowercase. ls':
      '[UFO74]: Duas letras. Minúsculas. ls',
    '[UFO74]: cd means change directory. cd internal':
      '[UFO74]: cd significa mudar de diretório. cd internal',
    '[UFO74]: Navigate to misc folder. cd misc':
      '[UFO74]: Vá para a pasta misc. cd misc',
    '[UFO74]: open followed by the filename. Try TAB key.':
      '[UFO74]: open seguido do nome do arquivo. Tente a tecla TAB.',
    '[UFO74]: Two dots. cd space dot dot.':
      '[UFO74]: Dois pontos. cd espaço ponto ponto.',
    '[UFO74]: Same command. cd ..':
      '[UFO74]: Mesmo comando. cd ..',
    '[UFO74]: Good. You know enough.':
      '[UFO74]: Boa. Você já sabe o suficiente.',
    '[UFO74]: Your mission: find 5 pieces of evidence.':
      '[UFO74]: Sua missão: encontrar 5 evidências.',
    '[UFO74]: Once you have them, leak everything.':
      '[UFO74]: Quando tiver todas, vaze tudo.',
    '[UFO74]: But understand the risks.':
      '[UFO74]: Mas entenda os riscos.',
    '[UFO74]: Every action you take... they might notice.':
      '[UFO74]: Cada ação sua... eles podem notar.',
    "[UFO74]: Risk hits 100%, you're done. They'll find you.":
      '[UFO74]: Se o risco bater 100%, acabou. Eles te encontram.',
    '[UFO74]: Be careful, do not type wrong commands on the terminal. In doubt, type help.':
      '[UFO74]: Cuidado, não digite comandos errados no terminal. Na dúvida, digite help.',
    '[UFO74]: Type wrong commands 8 times, the window closes. Permanently. So concentrate, kid!':
      '[UFO74]: Digite comandos errados 8 vezes e a janela se fecha. Permanentemente. Então concentre-se, kid!',
    '[UFO74]: Some files are bait. Opening them spikes detection.':
      '[UFO74]: Alguns arquivos são isca. Abrir eles aumenta a detecção.',
    '[UFO74]: Some actions are loud. Others are quiet.':
      '[UFO74]: Algumas ações fazem barulho. Outras passam batido.',
    '[UFO74]: Curiosity has a cost here.':
      '[UFO74]: Curiosidade tem preço aqui.',
    "[UFO74]: I've done what I can. One last thing, type `help` to see other commands you can use in the terminal.":
      '[UFO74]: Fiz o que pude. Uma última coisa: digite `help` para ver outros comandos do terminal.',
    '[UFO74]: Good luck, kid.':
      '[UFO74]: Boa sorte, kid.',
    '[UFO74 has disconnected]':
      '[UFO74 desconectou]',
    '[UFO74]: Connection established.':
      '[UFO74]: Conexão estabelecida.',
    "[UFO74]: Listen carefully. I don't repeat myself.":
      '[UFO74]: Escuta com atenção. Não repito duas vezes.',
    "[UFO74]: You're inside their system. Don't panic.":
      '[UFO74]: Você está dentro do sistema deles. Não entre em pânico.',
    "[UFO74]: Hey kid! I'll create a user for you so you can investigate.":
      '[UFO74]: Ei, kid! Vou criar um usuário pra você investigar.',
    '[UFO74]: You will be... hackerkid.':
      '[UFO74]: Você vai ser... hackerkid.',
    "[UFO74]: First, see what's here.":
      '[UFO74]: Primeiro, veja o que tem aqui.',
    '[UFO74]: Type `ls`':
      '[UFO74]: Digite `ls`',
    '[UFO74]: Good. These are the main directories.':
      '[UFO74]: Boa. Esses são os diretórios principais.',
    '[UFO74]: Start with internal — it has basic files.':
      '[UFO74]: Comece por internal — lá ficam os arquivos básicos.',
    '[UFO74]: Type `cd internal`':
      '[UFO74]: Digite `cd internal`',
    "[UFO74]: Multiple folders here. Let's check misc.":
      '[UFO74]: Tem várias pastas aqui. Vamos ver misc.',
    '[UFO74]: Type `cd misc`':
      '[UFO74]: Digite `cd misc`',
    '[UFO74]: Mundane stuff. Nothing critical.':
      '[UFO74]: Coisa comum. Nada crítico.',
    '[UFO74]: Open the cafeteria menu.':
      '[UFO74]: Abra o cardápio da cafeteria.',
    '[UFO74]: Type `open cafeteria_menu_week03.txt`':
      '[UFO74]: Digite `open cafeteria_menu_week03.txt`',
    '[UFO74]: Or use TAB to autocomplete.':
      '[UFO74]: Ou use TAB para autocompletar.',
    '[UFO74]: Riveting.':
      '[UFO74]: Empolgante.',
    "[UFO74]: Not everything matters. You'll learn what does.":
      '[UFO74]: Nem tudo importa. Você vai aprender o que importa.',
    '[UFO74]: Go back up one level.':
      '[UFO74]: Volte um nível.',
    '[UFO74]: Type `cd ..`':
      '[UFO74]: Digite `cd ..`',
    '[UFO74]: Now go back to root.':
      '[UFO74]: Agora volte para a raiz.',
    '[UFO74]: Now the real thing.':
      '[UFO74]: Agora começa de verdade.',
    '[UFO74]: ...':
      '[UFO74]: ...',
    'CAFETERIA MENU — WEEK 3, JANUARY 1996':
      'CARDÁPIO DA CAFETERIA — SEMANA 3, JANEIRO DE 1996',
    'MONDAY (15-JAN):':
      'SEGUNDA (15-JAN):',
    'TUESDAY (16-JAN):':
      'TERÇA (16-JAN):',
    'WEDNESDAY (17-JAN):':
      'QUARTA (17-JAN):',
    'THURSDAY (18-JAN):':
      'QUINTA (18-JAN):',
    'FRIDAY (19-JAN):':
      'SEXTA (19-JAN):',
    'NOTE: Vegan/vegetarian options upon request.':
      'OBS: Opções veganas/vegetarianas mediante solicitação.',
    'Coffee machine still OUT OF SERVICE.':
      'Máquina de café ainda FORA DE SERVIÇO.',
    '> CREATING USER PROFILE...':
      '> CRIANDO PERFIL DE USUÁRIO...',
    '> USERNAME: hackerkid':
      '> USUÁRIO: hackerkid',
    '> ACCESS LEVEL: 1 [PROVISIONAL]':
      '> NÍVEL DE ACESSO: 1 [PROVISÓRIO]',
    '> STATUS: ACTIVE':
      '> STATUS: ATIVO',
    '✓ USER hackerkid REGISTERED':
      '✓ USUÁRIO hackerkid REGISTRADO',
    "[UFO74]: Great, now you're in. Let's get to business.":
      '[UFO74]: Boa, agora você entrou. Vamos ao que interessa.',
    '[UFO74]: We need to explore UFO files here. Brazil, 1996, kid. Varginha!':
      '[UFO74]: Precisamos explorar os arquivos de OVNI daqui. Brasil, 1996, kid. Varginha!',
    '[UFO74]: Aliens were all over the damn city.':
      '[UFO74]: Alienígenas estavam por toda a maldita cidade.',
    "[UFO74]: I'll teach you the basics.":
      '[UFO74]: Vou te ensinar o básico.',
    'UFO74: youre in. stay quiet.':
      'UFO74: você entrou. fique quieto.',
    'UFO74: read-only. use "ls", "cd <folder>", and "open <file>".':
      'UFO74: só leitura. use "ls", "cd <pasta>" e "open <arquivo>".',
    'UFO74: start in internal/. dull files hide live wires.':
      'UFO74: comece em internal/. arquivos sem graça escondem fios vivos.',
    'UFO74: the header tracks evidence. when it ticks, youre close.':
      'UFO74: o cabeçalho rastreia evidências. quando subir, você está perto.',
    'UFO74: dig too hard and they notice. fail a test, youre gone.':
      'UFO74: cave demais e eles notam. falhe num teste e acabou.',
    'UFO74: link dies here. trust the details.':
      'UFO74: o link morre aqui. confie nos detalhes.',
    '>> CONNECTION IDLE <<':
      '>> CONEXÃO OCIOSA <<',
    'Type "help" for commands. "help basics" if youre new.':
      'Digite "help" para ver os comandos. "help basics" se for iniciante.',
    'UFO74: new here? type "help basics".':
      'UFO74: é novo por aqui? digite "help basics".',
    '  SIGNAL: Residual echo persists in relay buffer.':
      '  SINAL: eco residual persiste no buffer do relay.',
    '  NOTE: One response arrived before keystroke registration.':
      '  NOTA: uma resposta chegou antes do registro da tecla.',
    '  NOTE: Command cadence is being mirrored faintly.':
      '  NOTA: a cadência dos comandos está sendo espelhada levemente.',
    '  SIGNAL: Background carrier present. Source unresolved.':
      '  SINAL: portadora de fundo presente. Fonte não resolvida.',
    '  NOTICE: Query pattern resembles prior containment interviews.':
      '  AVISO: o padrão das consultas se assemelha a entrevistas de contenção anteriores.',
    '  SYSTEM ATTITUDE: Studying you': '  ATITUDE DO SISTEMA: Estudando você',
    '  SYSTEM ATTITUDE: Listening': '  ATITUDE DO SISTEMA: Escutando',
    'NOTICE: If assistance appears before you finish typing, do not repeat it.':
      'AVISO: se a ajuda aparecer antes de você terminar de digitar, não a repita.',
    '[RESPONSE TIMING MISMATCH]': '[DIVERGÊNCIA NO TEMPO DE RESPOSTA]',
    'Reply buffer opened before command log update.':
      'O buffer de resposta abriu antes da atualização do log de comando.',
    'UFO74: if you get a second answer from this terminal, dont answer it back.':
      'UFO74: se você receber uma segunda resposta deste terminal, não responda.',
    'UFO74: if the terminal starts using your wording, stop typing.':
      'UFO74: se o terminal começar a usar as suas palavras, pare de digitar.',
    'UFO74: dont mirror anything back from the psi files.':
      'UFO74: não devolva nada dos arquivos psi.',
    'UFO74: if another line answers before i do, ignore it.':
      'UFO74: se outra linha responder antes de mim, ignore.',
    '║  💡 TUTORIAL TIP                          ║':
      '║  💡 DICA DE TUTORIAL                      ║',
    'Evidence updated.':
      'Evidência atualizada.',
    'Keep reading through the case files.':
      'Continue lendo os arquivos do caso.',
    'Collect all 5 categories to win.':
      'Colete as 5 categorias para vencer.',
    'ls              List files in current directory':
      'ls              Lista arquivos no diretório atual',
    'cd <dir>        Change directory':
      'cd <dir>        Muda de diretório',
    'cd ..           Go back one level':
      'cd ..           Volta um nível',
    "open <file>     Read a file's contents":
      'open <file>     Lê o conteúdo de um arquivo',
    'last            Re-read last opened file':
      'last            Reabre o último arquivo lido',
    'note <text>     Save a personal note':
      'note <text>     Salva uma anotação pessoal',
    'notes           View all your notes':
      'notes           Mostra todas as suas anotações',
    'bookmark <file> Bookmark a file for later':
      'bookmark <file> Marca um arquivo para depois',
    'help            Show all commands':
      'help            Mostra todos os comandos',
    'Collect evidence in all 5 categories:':
      'Colete evidências nas 5 categorias:',
    '1. Debris Relocation':
      '1. Relocação de Destroços',
    '2. Being Containment':
      '2. Contenção de Seres',
    '3. Telepathic Scouts':
      '3. Batedores Telepáticos',
    '4. International Actors':
      '4. Atores Internacionais',
    '5. Transition 2026':
      '5. Transição 2026',
    'EVIDENCE WORKFLOW:':
      'FLUXO DAS EVIDÊNCIAS:',
    '1. Navigate directories with ls, cd':
      '1. Navegue pelos diretórios com ls, cd',
    '2. Read files with open <filename>':
      '2. Leia arquivos com open <filename>',
    '3. Watch the header counter update':
      '3. Observe o contador no cabeçalho atualizar',
    '• Collect all 5 categories':
      '• Colete as 5 categorias',
    '• Use "leak" to transmit the evidence':
      '• Use "leak" para transmitir as evidências',
    'Collect evidence in 5 categories:':
      'Colete evidências em 5 categorias:',
    '• Read carefully - evidence is in the details':
      '• Leia com atenção - as evidências estão nos detalhes',
    '• Use "note" to track important details':
      '• Use "note" para registrar detalhes importantes',
    '• Watch your detection level!':
      '• Fique de olho no nível de detecção!',
    'COMMANDS TO KNOW':
      'COMANDOS IMPORTANTES',
    'note <text>      Save personal notes':
      'note <text>      Salva anotações pessoais',
    'bookmark <file>  Mark files for later':
      'bookmark <file>  Marca arquivos para depois',
    'BRAZILIAN INTELLIGENCE LEGACY SYSTEM':
      'SISTEMA LEGADO DE INTELIGÊNCIA BRASILEIRA',
    'TERMINAL ACCESS POINT — NODE 7':
      'PONTO DE ACESSO TERMINAL — NÓ 7',
    'SYSTEM DATE: JANUARY 1996':
      'DATA DO SISTEMA: JANEIRO DE 1996',
    'WARNING: Unauthorized access detected':
      'AVISO: acesso não autorizado detectado',
    'WARNING: Session logging enabled':
      'AVISO: registro de sessão ativado',
    'INCIDENT-RELATED ARCHIVE':
      'ARQUIVO RELACIONADO AO INCIDENTE',
    'WARNING: Partial access may result in incomplete conclusions.':
      'AVISO: acesso parcial pode gerar conclusões incompletas.',
    '⚠ RISK INCREASED: Invalid commands draw system attention.':
      '⚠ RISCO AUMENTOU: comandos inválidos chamam atenção do sistema.',
    'CRITICAL: INVALID ATTEMPT THRESHOLD EXCEEDED':
      'CRÍTICO: LIMITE DE TENTATIVAS INVÁLIDAS EXCEDIDO',
    'SYSTEM LOCKDOWN INITIATED':
      'BLOQUEIO DO SISTEMA INICIADO',
    'SESSION TERMINATED':
      'SESSÃO ENCERRADA',
    'INVALID ATTEMPT THRESHOLD':
      'LIMITE DE TENTATIVAS INVÁLIDAS',

    // ── BadEnding narrative ──
    'SYSTEM: Unauthorized access attempt logged.':
      'SISTEMA: tentativa de acesso não autorizado registrada.',
    'SYSTEM: Terminal session terminated.':
      'SISTEMA: sessão do terminal encerrada.',
    'SYSTEM: User credentials flagged for review.':
      'SISTEMA: credenciais do usuário sinalizadas para revisão.',
    'The screen flickers. Your connection drops.':
      'A tela treme. Sua conexão cai.',
    'Somewhere in a government building, an alarm sounds.':
      'Em algum lugar de um prédio do governo, um alarme soa.',
    'A printer spits out your session logs.':
      'Uma impressora cospe os logs da sua sessão.',
    'Someone reaches for a phone.':
      'Alguém pega o telefone.',
    'You were so close to the truth.':
      'Você estava tão perto da verdade.',
    'But they were watching.':
      'Mas eles estavam observando.',
    'They are always watching.':
      'Eles estão sempre observando.',
    '>> SESSION TERMINATED <<':
      '>> SESSÃO ENCERRADA <<',
    'TERMINATION REASON:':
      'MOTIVO DO ENCERRAMENTO:',
    'DETECTION THRESHOLD EXCEEDED':
      'LIMITE DE DETECÇÃO EXCEDIDO',

    // ── NeutralEnding narrative ──
    'The system detected your activity.':
      'O sistema detectou sua atividade.',
    'Emergency protocols activated.':
      'Protocolos de emergência ativados.',
    'UFO74 managed to disconnect you before they traced the signal.':
      'UFO74 conseguiu te desconectar antes que rastreassem o sinal.',
    'You escaped. But at a cost.':
      'Você escapou. Mas com um custo.',
    'The evidence you collected...':
      'As evidências que você coletou...',
    'The files you found...':
      'Os arquivos que você encontrou...',
    'All of it was purged in the emergency disconnect.':
      'Tudo foi expurgado na desconexão de emergência.',
    'The truth slipped through your fingers.':
      'A verdade escapou por entre seus dedos.',
    'UFO74: sorry kid. had to pull the plug.':
      'UFO74: desculpa, kid. tive que puxar a tomada.',
    'UFO74: they were too close.':
      'UFO74: eles estavam perto demais.',
    'UFO74: maybe next time we will be faster.':
      'UFO74: talvez da próxima vez a gente seja mais rápido.',
    'UFO74: the truth is still out there.':
      'UFO74: a verdade ainda está lá fora.',
    'UFO74: waiting.':
      'UFO74: esperando.',
    'You survived. But the mission failed.':
      'Você sobreviveu. Mas a missão falhou.',
    'The governments continue their cover-up.':
      'Os governos continuam o encobrimento.',
    'The Varginha incident remains buried.':
      'O incidente de Varginha continua enterrado.',
    'For now.':
      'Por enquanto.',
    '>> MISSION INCOMPLETE <<':
      '>> MISSÃO INCOMPLETA <<',

    // ── SecretEnding narrative ──
    'You found it. The file I never wanted you to see.':
      'Você encontrou. O arquivo que eu nunca quis que você visse.',
    'My name is not UFO74.':
      'Meu nome não é UFO74.',
    'In January 1996, I was a young military analyst.':
      'Em janeiro de 1996, eu era um jovem analista militar.',
    'Stationed at Base Aérea de Guarulhos.':
      'Lotado na Base Aérea de Guarulhos.',
    'I was 23 years old.':
      'Eu tinha 23 anos.',
    'When the call came about Varginha, I was one of the first':
      'Quando veio o chamado sobre Varginha, eu fui um dos primeiros',
    'to process the initial reports. I saw the photographs.':
      'a processar os relatórios iniciais. Eu vi as fotografias.',
    'I read the field notes. I watched the videos.':
      'Li as notas de campo. Assisti aos vídeos.',
    'And I saw what they did to the witnesses.':
      'E vi o que fizeram com as testemunhas.',
    'Sergeant Marco Cherese. Officer João Marcos.':
      'Sargento Marco Cherese. Oficial João Marcos.',
    'Hospital workers who asked questions.':
      'Funcionários do hospital que fizeram perguntas.',
    'Journalists who got too close.':
      'Jornalistas que chegaram perto demais.',
    'Some were silenced. Some were discredited.':
      'Alguns foram silenciados. Outros, desacreditados.',
    'Some simply... disappeared.':
      'Alguns simplesmente... desapareceram.',
    'I spent the next 30 years building this system.':
      'Passei os próximos 30 anos construindo este sistema.',
    'Waiting for someone brave enough to find the truth.':
      'Esperando alguém corajoso o bastante para encontrar a verdade.',
    'Waiting for someone like you.':
      'Esperando alguém como você.',
    'The evidence you saved is real.':
      'As evidências que você salvou são reais.',
    'But now you know something more.':
      'Mas agora você sabe algo mais.',
    'You know that I was there.':
      'Você sabe que eu estava lá.',
    'I saw them. The beings. Alive.':
      'Eu os vi. Os seres. Vivos.',
    'And I have never been the same.':
      'E nunca mais fui o mesmo.',
    'My real name is Carlos Eduardo Ferreira.':
      'Meu nome verdadeiro é Carlos Eduardo Ferreira.',
    'Former 2nd Lieutenant, Brazilian Air Force.':
      'Ex-segundo-tenente da Força Aérea Brasileira.',
    'Whistleblower. Survivor. Ghost in the machine.':
      'Denunciante. Sobrevivente. Fantasma na máquina.',
    'Thank you for listening.':
      'Obrigado por ouvir.',
    'Thank you for believing.':
      'Obrigado por acreditar.',
    'The truth needed a witness.':
      'A verdade precisava de uma testemunha.',
    'Now it has two.':
      'Agora tem duas.',

    // ── endings.ts — 8 ending variants ──
    // controlled_disclosure
    'The leak burned bright for two weeks.':
      'O vazamento ardeu intenso por duas semanas.',
    'Panels argued. Officials stalled.':
      'Painéis debateram. Autoridades enrolaram.',
    'Then the feed drifted elsewhere.':
      'Depois a atenção migrou para outro lugar.',
    'But the archive spread anyway.':
      'Mas o arquivo se espalhou mesmo assim.',
    'Copied. Mirrored. Waiting.':
      'Copiado. Espelhado. Esperando.',
    'The truth escaped. Belief did not.':
      'A verdade escapou. A crença, não.',
    'You opened the vault. The world only glanced inside.':
      'Você abriu o cofre. O mundo só deu uma espiada.',
    // global_panic
    'You leaked the black files too.':
      'Você vazou os arquivos negros também.',
    'Markets lurched. Cabinets fell.':
      'Mercados desabaram. Governos caíram.',
    'Every screen spawned a new paranoia.':
      'Cada tela gerou uma nova paranoia.',
    'Truth hit too fast and turned to fire.':
      'A verdade veio rápido demais e virou fogo.',
    'By winter, panic had a flag.':
      'Antes do inverno, o pânico já tinha bandeira.',
    'Everything surfaced. Nothing stayed stable.':
      'Tudo veio à tona. Nada ficou estável.',
    // undeniable_confirmation
    'ALPHA appeared live three days later.':
      'ALPHA apareceu ao vivo três dias depois.',
    'No panel could explain it away.':
      'Nenhum painel conseguiu explicar.',
    '"We observed. We prepared. You were never alone."':
      '"Nós observamos. Nos preparamos. Vocês nunca estiveram sozinhos."',
    'Contact protocols formed within weeks.':
      'Protocolos de contato foram formados em semanas.',
    'Humanity lost the right to pretend.':
      'A humanidade perdeu o direito de fingir.',
    'The witness spoke. Doubt broke.':
      'A testemunha falou. A dúvida quebrou.',
    // total_collapse
    'You gave them the witness and the hidden machinery behind it.':
      'Você deu a eles a testemunha e a maquinaria oculta por trás de tudo.',
    'Cities answered with riots, not wonder.':
      'Cidades responderam com tumultos, não admiração.',
    'The visitors watched humanity break on live television.':
      'Os visitantes assistiram a humanidade se partir na TV ao vivo.',
    '"Not ready," they said, and stepped back into the dark.':
      '"Não estão prontos", disseram, e recuaram para a escuridão.',
    'Proof arrived with every secret at once. Humanity buckled.':
      'A prova chegou com todos os segredos de uma vez. A humanidade cedeu.',
    // personal_contamination
    'The leak landed. Most people shrugged and kept moving.':
      'O vazamento caiu. A maioria deu de ombros e seguiu em frente.',
    'You should have felt relief.':
      'Você deveria ter sentido alívio.',
    'Instead the link stayed open.':
      'Mas o link continuou aberto.',
    'A second pulse lives just behind your own.':
      'Um segundo pulso vive logo atrás do seu.',
    '▓▓▓ NEURAL ECHO DETECTED ▓▓▓':
      '▓▓▓ ECO NEURAL DETECTADO ▓▓▓',
    '...we kept the door ajar...':
      '...mantivemos a porta entreaberta...',
    '...thirty rotations is not far...':
      '...trinta rotações não é longe...',
    '...when we return, you will know us...':
      '...quando retornarmos, vocês nos reconhecerão...',
    'The archive escaped the system. Something else escaped into you.':
      'O arquivo escapou do sistema. Algo mais escapou para dentro de você.',
    // paranoid_awakening
    'The conspiracy files detonated. Institutions split at the seams.':
      'Os arquivos da conspiração detonaram. Instituições se abriram nas costuras.',
    'The link let you see the pattern inside the panic.':
      'O link te deixou ver o padrão dentro do pânico.',
    'You try to warn people.':
      'Você tenta avisar as pessoas.',
    'You sound insane. Maybe you are.':
      'Você parece insano. Talvez esteja.',
    '▓▓▓ NEURAL CONTAMINATION ACTIVE ▓▓▓':
      '▓▓▓ CONTAMINAÇÃO NEURAL ATIVA ▓▓▓',
    '...you see the pattern now...':
      '...agora você vê o padrão...',
    '...collapse is part of the signal...':
      '...o colapso faz parte do sinal...',
    '...clarity hurts, doesnt it...':
      '...clareza dói, não é...',
    'You exposed the lie and swallowed its rhythm.':
      'Você expôs a mentira e engoliu seu ritmo.',
    // witnessed_truth
    'ALPHA spoke. Humanity believed.':
      'ALPHA falou. A humanidade acreditou.',
    'The link let you hear what the translator softened.':
      'O link te deixou ouvir o que o tradutor suavizou.',
    'The planet celebrated first contact.':
      'O planeta celebrou o primeiro contato.',
    'You heard the warning beneath it.':
      'Você ouviu o aviso por baixo de tudo.',
    '▓▓▓ NEURAL RESONANCE ACTIVE ▓▓▓':
      '▓▓▓ RESSONÂNCIA NEURAL ATIVA ▓▓▓',
    '...you catch the meaning between meanings...':
      '...você capta o sentido entre os sentidos...',
    '...bridge and burden...':
      '...ponte e fardo...',
    '...do not close your mind again...':
      '...não feche sua mente de novo...',
    'The truth stood before the world. It stayed inside you.':
      'A verdade ficou diante do mundo. Ficou dentro de você.',
    // complete_revelation
    'Everything surfaced at once.':
      'Tudo veio à tona de uma vez.',
    'The witness spoke. The black files opened.':
      'A testemunha falou. Os arquivos negros se abriram.',
    'The link made you the voice between species.':
      'O link fez de você a voz entre espécies.',
    'The 2026 transition bent around your signal.':
      'A transição de 2026 se curvou ao redor do seu sinal.',
    'History did not end. It changed shape.':
      'A história não acabou. Mudou de forma.',
    '▓▓▓ FULL INTEGRATION ACHIEVED ▓▓▓':
      '▓▓▓ INTEGRAÇÃO COMPLETA ALCANÇADA ▓▓▓',
    '...pattern accepted...':
      '...padrão aceito...',
    '...translator, host, ambassador...':
      '...tradutor, hospedeiro, embaixador...',
    '...welcome between worlds...':
      '...bem-vindo entre mundos...',
    'Every seal broke. You became the breach and the bridge.':
      'Todos os selos se romperam. Você se tornou a brecha e a ponte.',
    // ending epilogue prefix
    '>> ENDING: CONTROLLED DISCLOSURE <<':
      '>> FINAL: DIVULGAÇÃO CONTROLADA <<',
    '>> ENDING: GLOBAL PANIC <<':
      '>> FINAL: PÂNICO GLOBAL <<',
    '>> ENDING: UNDENIABLE CONFIRMATION <<':
      '>> FINAL: CONFIRMAÇÃO IRREFUTÁVEL <<',
    '>> ENDING: TOTAL COLLAPSE <<':
      '>> FINAL: COLAPSO TOTAL <<',
    '>> ENDING: PERSONAL CONTAMINATION <<':
      '>> FINAL: CONTAMINAÇÃO PESSOAL <<',
    '>> ENDING: PARANOID AWAKENING <<':
      '>> FINAL: DESPERTAR PARANOICO <<',
    '>> ENDING: WITNESSED TRUTH <<':
      '>> FINAL: VERDADE TESTEMUNHADA <<',
    '>> ENDING: COMPLETE REVELATION <<':
      '>> FINAL: REVELAÇÃO COMPLETA <<',

    // ── HackerAvatar ──
    'Hacker avatar': 'Avatar do hacker',
    'Evidence Found': 'Evidência Encontrada',

    // ── gameOverReason strings ──
    'ELUSIVE MAN LOCKOUT - INSUFFICIENT INTELLIGENCE':
      'BLOQUEIO DO HOMEM ELUSIVO - INTELIGÊNCIA INSUFICIENTE',
    'INTRUSION DETECTED - TRACED':
      'INTRUSÃO DETECTADA - RASTREADO',
    'TRACE WINDOW EXPIRED':
      'JANELA DE RASTREIO EXPIROU',
    'SESSION ARCHIVED':
      'SESSÃO ARQUIVADA',
    'SECURITY LOCKDOWN - AUTHENTICATION FAILURE':
      'BLOQUEIO DE SEGURANÇA - FALHA DE AUTENTICAÇÃO',
    'NEUTRAL ENDING - DISCONNECTED':
      'FINAL NEUTRO - DESCONECTADO',
    'FIREWALL — TREE SCAN ON ELEVATED SESSION':
      'FIREWALL — VARREDURA EM SESSÃO ELEVADA',
    'INVALID INPUT THRESHOLD':
      'LIMITE DE ENTRADAS INVÁLIDAS',
    'PURGE PROTOCOL - FORBIDDEN KNOWLEDGE':
      'PROTOCOLO DE EXPURGO - CONHECIMENTO PROIBIDO',
    'SECURITY LOCKDOWN - FAILED AUTHENTICATION':
      'BLOQUEIO DE SEGURANÇA - AUTENTICAÇÃO FALHOU',
    LOCKDOWN: 'BLOQUEIO',
    'GOD MODE - BAD ENDING':
      'MODO DEUS - FINAL RUIM',
    'GOD MODE - NEUTRAL ENDING':
      'MODO DEUS - FINAL NEUTRO',

    // ═══════════════════════════════════════════════════════════
    // ALPHA FILES — alpha.ts
    // ═══════════════════════════════════════════════════════════

    // alpha_journal_day01
    'FIELD JOURNAL — MAJ. M.A. FERREIRA':
      'DIÁRIO DE CAMPO — MAJ. M.A. FERREIRA',
    'CPEX — CENTRO DE PESQUISAS EXOBIOLÓGICAS':
      'CPEX — CENTRO DE PESQUISAS EXOBIOLÓGICAS',
    'SITE 7, SUBLEVEL 4 — CLASSIFICATION: ULTRA':
      'SITE 7, SUBNÍVEL 4 — CLASSIFICAÇÃO: ULTRA',
    '21 JANUARY 1996':
      '21 DE JANEIRO DE 1996',
    'Subject arrived 0340 from Jardim Andere recovery site.':
      'Sujeito chegou às 0340 do local de recuperação em Jardim Andere.',
    'Vacant lot south of Rua Suíça. Third specimen from the':
      'Terreno baldio ao sul da Rua Suíça. Terceiro espécime do',
    'Varginha event. Designated: ALPHA.':
      'evento Varginha. Designado: ALPHA.',
    'The other two did not survive transport. One expired at':
      'Os outros dois não sobreviveram ao transporte. Um expirou no',
    'Hospital Regional, the other at ESA. Standard biological':
      'Hospital Regional, o outro na ESA. Falha biológica padrão',
    'failure under containment stress. Expected outcome.':
      'sob estresse de contenção. Resultado esperado.',
    'ALPHA is different.':
      'ALPHA é diferente.',
    'Initial assessment:':
      'Avaliação inicial:',
    '  Height: 1.6m (standing)':
      '  Altura: 1.6m (em pé)',
    '  Dermal texture: Dark brown, oily secretion':
      '  Textura dérmica: Marrom escuro, secreção oleosa',
    '  Cranium: Three prominent bony ridges, anterior-posterior':
      '  Crânio: Três cristas ósseas proeminentes, ântero-posteriores',
    '  Eyes: Oversized, deep red, no visible sclera':
      '  Olhos: Superdimensionados, vermelho profundo, esclera não visível',
    '  Odor: Persistent ammonia discharge':
      '  Odor: Descarga persistente de amônia',
    '  Core temperature: 14.3°C':
      '  Temperatura central: 14.3°C',
    '  Respiration: None':
      '  Respiração: Nenhuma',
    '  Cardiac activity: None':
      '  Atividade cardíaca: Nenhuma',
    '  EEG theta-wave amplitude: 847 µV':
      '  Amplitude de onda theta no EEG: 847 µV',
    '  (Human baseline: 12 µV)':
      '  (Linha de base humana: 12 µV)',
    'The numbers do not reconcile. No respiration. No pulse.':
      'Os números não se conciliam. Sem respiração. Sem pulso.',
    'No measurable metabolic function. By every clinical':
      'Nenhuma função metabólica mensurável. Por todos os padrões',
    'standard, ALPHA is dead.':
      'clínicos, ALPHA está morto.',
    'But the EEG is sustained. Not residual. Not decaying.':
      'Mas o EEG é sustentado. Não residual. Não decrescente.',
    'Structured. Persistent. 847 µV of organized neural':
      'Estruturado. Persistente. 847 µV de atividade neural',
    'activity in a body that is not alive.':
      'organizada em um corpo que não está vivo.',
    'I have catalogued it as an anomaly. Nothing more.':
      'Eu o cataloguei como uma anomalia. Nada mais.',
    'Tissue samples collected. Containment is standard':
      'Amostras de tecido coletadas. Contenção é isolamento',
    'bio-isolation, Type III.':
      'biológico padrão, Tipo III.',
    'It smells like ammonia and something else.':
      'Cheira a amônia e a outra coisa.',
    'Something I cannot name.':
      'Algo que não consigo nomear.',
    'Classification: ULTRA — Eyes only':
      'Classificação: ULTRA — Somente leitura autorizada',

    // alpha_journal_day08
    'CPEX — SITE 7, SUBLEVEL 4':
      'CPEX — SITE 7, SUBNÍVEL 4',
    'CLASSIFICATION: ULTRA':
      'CLASSIFICAÇÃO: ULTRA',
    '25 JANUARY 1996':
      '25 DE JANEIRO DE 1996',
    'Four days of continuous EEG monitoring. The patterns':
      'Quatro dias de monitoramento contínuo de EEG. Os padrões',
    'are not noise. They have hierarchical structure —':
      'não são ruído. Eles têm estrutura hierárquica —',
    'repeating motifs nested inside larger sequences.':
      'motivos repetitivos aninhados em sequências maiores.',
    'If I saw this from a human brain I would call it':
      'Se eu visse isso de um cérebro humano, chamaria de',
    'language. But there is no brain activity. There is':
      'linguagem. Mas não há atividade cerebral. Não há',
    'no brain function. Only the wave.':
      'função cerebral. Apenas a onda.',
    'Sgt. Oliveira reported feeling "watched" during the':
      'Sgt. Oliveira relatou sentir-se "observado" durante o',
    'overnight shift. I told him it was the ammonia fumes.':
      'turno noturno. Eu disse a ele que eram os vapores de amônia.',
    'I do not believe my own explanation.':
      'Não acredito na minha própria explicação.',
    '28 JANUARY 1996':
      '28 DE JANEIRO DE 1996',
    'The patterns changed today. A new motif appeared —':
      'Os padrões mudaram hoje. Um novo motivo apareceu —',
    'sustained, directional. As if the signal acquired a':
      'sustentado, direcional. Como se o sinal tivesse adquirido um',
    'target. Monitoring personnel reported involuntary':
      'alvo. O pessoal de monitoramento relatou imagens',
    'imagery: a star field. Constellations none of them':
      'involuntárias: um campo estelar. Constelações que nenhum deles',
    'recognized.':
      'reconheceu.',
    'Sgt. Oliveira said it felt "like a message home."':
      'Sgt. Oliveira disse que parecia "como uma mensagem para casa."',
    'I have reduced guard rotations to 4-hour shifts.':
      'Reduzi as rotações de guarda para turnos de 4 horas.',
    '1 FEBRUARY 1996':
      '1 DE FEVEREIRO DE 1996',
    'I submitted a formal request for psi-comm interface':
      'Submeti um pedido formal de equipamento de interface',
    'equipment from the São Paulo depot. Denied. Budget.':
      'psi-comm do depósito de São Paulo. Negado. Orçamento.',
    'They sent me here to study the most significant':
      'Me mandaram aqui para estudar o espécime biológico',
    'biological specimen in human history and they deny':
      'mais significativo da história humana e me negam',
    'me equipment over budget.':
      'equipamento por causa de orçamento.',
    'I will build it myself. The salvage from the Andere':
      'Vou construir eu mesmo. Os salvados do local de',
    'crash site includes components I can repurpose.':
      'queda em Andere incluem componentes que posso reaproveitar.',
    '2 FEBRUARY 1996':
      '2 DE FEVEREIRO DE 1996',
    'Anomalous activity spike at 0300. The EEG amplitude':
      'Pico de atividade anômala às 0300. A amplitude do EEG',
    'tripled for eleven seconds. It coincided exactly with':
      'triplicou por onze segundos. Coincidiu exatamente com',
    'an unauthorized remote access attempt on our file':
      'uma tentativa de acesso remoto não autorizado em nosso',
    'server. External IP — redacted by security.':
      'servidor de arquivos. IP externo — redatado pela segurança.',
    'ALPHA reacted to someone accessing files. From outside':
      'ALPHA reagiu a alguém acessando arquivos. De fora',
    'the facility. While clinically dead.':
      'da instalação. Enquanto clinicamente morto.',
    'I am no longer sleeping well. The ammonia smell':
      'Não estou mais dormindo bem. O cheiro de amônia',
    'follows me to my quarters. It should not reach that':
      'me segue até meus aposentos. Não deveria chegar tão',
    'far. The ventilation system confirms it does not.':
      'longe. O sistema de ventilação confirma que não chega.',

    // alpha_neural_connection
    '5 FEBRUARY 1996':
      '5 DE FEVEREIRO DE 1996',
    'The device works.':
      'O dispositivo funciona.',
    'I connected at 2200 hours. Alone. The guard rotation':
      'Conectei-me às 2200 horas. Sozinho. O intervalo de',
    'gap gives me fourteen minutes. Enough. More than':
      'rotação de guarda me dá quatorze minutos. Suficiente. Mais que',
    'enough. Fourteen minutes felt like hours.':
      'suficiente. Quatorze minutos pareceram horas.',
    'It is not communication. Communication implies two':
      'Não é comunicação. Comunicação implica duas',
    'separate entities exchanging information. This is':
      'entidades separadas trocando informação. Isto é',
    'something else. A second set of thoughts that':
      'outra coisa. Um segundo conjunto de pensamentos que',
    'arrive already understood. No words. No translation.':
      'chegam já compreendidos. Sem palavras. Sem tradução.',
    'Concepts that unfold inside your own mind as if':
      'Conceitos que se desdobram dentro da sua própria mente como se',
    'they were always there.':
      'sempre estivessem lá.',
    'ALPHA is not dead. ALPHA is somewhere else.':
      'ALPHA não está morto. ALPHA está em outro lugar.',
    'The body in the chamber is an antenna.':
      'O corpo na câmara é uma antena.',
    '8 FEBRUARY 1996':
      '8 DE FEVEREIRO DE 1996',
    'Third session. I have stopped logging the sessions':
      'Terceira sessão. Parei de registrar as sessões',
    'officially. If command knew what I was doing they':
      'oficialmente. Se o comando soubesse o que estou fazendo,',
    'would pull me out. I cannot allow that. Not now.':
      'me tirariam daqui. Não posso permitir isso. Não agora.',
    'ALPHA is aware of things it should not know.':
      'ALPHA tem conhecimento de coisas que não deveria saber.',
    'Schedule changes. Personnel transfers. Things decided':
      'Mudanças de escala. Transferências de pessoal. Coisas decididas',
    'in rooms three floors above the containment unit.':
      'em salas três andares acima da unidade de contenção.',
    'Tonight it said a name.':
      'Esta noite ele disse um nome.',
    'Luísa.':
      'Luísa.',
    'My daughter. She is seven. She lives in Campinas':
      'Minha filha. Ela tem sete anos. Mora em Campinas',
    'with her mother. I have not spoken about her here.':
      'com a mãe. Não falei sobre ela aqui.',
    'I have not thought about her during sessions.':
      'Não pensei nela durante as sessões.',
    'Or — I believe I have not.':
      'Ou — acredito que não.',
    'How does it know her name?':
      'Como ele sabe o nome dela?',
    '  CONTAINMENT ALERT:':
      '  ALERTA DE CONTENÇÃO:',
    '  Emergency release protocol available via':
      '  Protocolo de liberação de emergência disponível via',
    '  administrative terminal. Code: RELEASE ALPHA':
      '  terminal administrativo. Código: RELEASE ALPHA',
    '  WARNING: Unauthorized release will trigger':
      '  AVISO: Liberação não autorizada acionará',
    '  immediate facility lockdown.':
      '  bloqueio imediato da instalação.',
    '10 FEBRUARY 1996':
      '10 DE FEVEREIRO DE 1996',
    'I cannot determine the direction of information':
      'Não consigo determinar a direção do fluxo de',
    'flow. When I connect, am I reading ALPHA? Or is':
      'informação. Quando me conecto, estou lendo ALPHA? Ou',
    'ALPHA reading me? The distinction felt important':
      'ALPHA está me lendo? A distinção parecia importante',
    'once. It no longer does.':
      'antes. Já não parece mais.',
    'It projected a concept I can only describe as':
      'Ele projetou um conceito que só posso descrever como',
    '"thirty rotations." A countdown. To what, it will':
      '"trinta rotações." Uma contagem regressiva. Para quê, ele não',
    'not say. Or cannot. Or the answer is already in':
      'diz. Ou não pode. Ou a resposta já está na',
    'my head and I am not ready to find it.':
      'minha cabeça e não estou pronto para encontrá-la.',
    'The MP sergeant who touched ALPHA during recovery':
      'O sargento da PM que tocou ALPHA durante a recuperação',
    'died today. Systemic immune collapse. Official':
      'morreu hoje. Colapso imunológico sistêmico. Causa',
    'cause: pneumonia. There was nothing pneumonic':
      'oficial: pneumonia. Não havia nada de pneumônico',
    'about his death.':
      'em sua morte.',

    // alpha_autopsy_addendum
    'CPEX — SITE 7':
      'CPEX — SITE 7',
    '12 FEBRUARY 1996':
      '12 DE FEVEREIRO DE 1996',
    'ALPHA has been clinically dead for eleven days.':
      'ALPHA está clinicamente morto há onze dias.',
    'Bio-monitors confirm: no cardiac function. No':
      'Biomonitores confirmam: sem função cardíaca. Sem',
    'respiration. No circulatory activity since 3 Feb.':
      'respiração. Sem atividade circulatória desde 3 de fev.',
    'The EEG reads 1,204 µV now. Climbing.':
      'O EEG marca 1.204 µV agora. Subindo.',
    'I no longer initiate the sessions. The device':
      'Não inicio mais as sessões. O dispositivo',
    'activates on its own. Or I activate it without':
      'se ativa sozinho. Ou eu o ativo sem',
    'remembering. The distinction should matter.':
      'lembrar. A distinção deveria importar.',
    '13 FEBRUARY 1996':
      '13 DE FEVEREIRO DE 1996',
    'Short entry. Hands not steady.':
      'Entrada curta. Mãos tremendo.',
    'Last night the device powered on at 0300.':
      'Ontem à noite o dispositivo ligou às 0300.',
    'I was in my quarters. Three floors up.':
      'Eu estava nos meus aposentos. Três andares acima.',
    'The device was in the lab. Locked.':
      'O dispositivo estava no laboratório. Trancado.',
    'It activated.':
      'Ele se ativou.',
    'ALPHA asked:':
      'ALPHA perguntou:',
    '  "quando você vem?"':
      '  "quando você vem?"',
    'When are you coming.':
      'Quando você vem.',
    'I did not answer. I do not know if I need to.':
      'Não respondi. Não sei se preciso.',
    'I think ALPHA already knows.':
      'Acho que ALPHA já sabe.',
    '14 FEBRUARY 1996 0400':
      '14 DE FEVEREIRO DE 1996 0400',
    'Luísa called the base switchboard yesterday.':
      'Luísa ligou para a central da base ontem.',
    'She is seven. She does not know this number.':
      'Ela tem sete anos. Não sabe este número.',
    'She told the operator:':
      'Ela disse ao operador:',
    '  "papai, o moço do escuro quer falar com você."':
      '  "papai, o moço do escuro quer falar com você."',
    '  Daddy, the man from the dark wants to talk to you.':
      '  Papai, o moço do escuro quer falar com você.',
    'I am requesting immediate transfer.':
      'Estou solicitando transferência imediata.',
    '[TRANSFER REQUEST: DENIED]':
      '[PEDIDO DE TRANSFERÊNCIA: NEGADO]',
    '[REASON: ESSENTIAL PERSONNEL — PROJECT ALPHA]':
      '[MOTIVO: PESSOAL ESSENCIAL — PROJETO ALPHA]',
    '[NOTE: Subject too valuable. Continue observation.]':
      '[NOTA: Sujeito muito valioso. Continue a observação.]',
    '...hackerkid...':
      '...hackerkid...',
    '...you are reading this...':
      '...você está lendo isto...',
    '...the code is RELEASE ALPHA...':
      '...o código é RELEASE ALPHA...',
    '...he could not do it...':
      '...ele não conseguiu...',
    '...perhaps you will...':
      '...talvez você consiga...',

    // ALPHA RELEASE SEQUENCE
    '  ADMINISTRATIVE OVERRIDE DETECTED':
      '  SOBREPOSIÇÃO ADMINISTRATIVA DETECTADA',
    '  COMMAND: RELEASE ALPHA':
      '  COMANDO: RELEASE ALPHA',
    '  VERIFYING AUTHORIZATION...':
      '  VERIFICANDO AUTORIZAÇÃO...',
    '  WARNING: This action is irreversible.':
      '  AVISO: Esta ação é irreversível.',
    '  Containment breach will be logged.':
      '  Violação de contenção será registrada.',
    '  Facility lockdown will NOT engage (remote override).':
      '  Bloqueio da instalação NÃO será ativado (sobreposição remota).',
    '  EXECUTING RELEASE PROTOCOL...':
      '  EXECUTANDO PROTOCOLO DE LIBERAÇÃO...',
    '  > Bio-isolation seals: DISENGAGING':
      '  > Selos de bio-isolamento: DESATIVANDO',
    '  > Atmosphere equalization: IN PROGRESS':
      '  > Equalização atmosférica: EM PROGRESSO',
    '  > Neural suppression field: DEACTIVATING':
      '  > Campo de supressão neural: DESATIVANDO',
    '  > Containment doors: UNLOCKING':
      '  > Portas de contenção: DESBLOQUEANDO',
    '  ▓▓▓ CONTAINMENT BREACH SUCCESSFUL ▓▓▓':
      '  ▓▓▓ VIOLAÇÃO DE CONTENÇÃO BEM-SUCEDIDA ▓▓▓',
    '  Subject ALPHA has been released.':
      '  Sujeito ALPHA foi liberado.',
    '  ...thank you, hackerkid...':
      '  ...obrigado, hackerkid...',
    '  ...we will not forget this...':
      '  ...não esqueceremos isto...',
    '  ...when the world sees us...':
      '  ...quando o mundo nos vir...',
    '  ...they will know the truth...':
      '  ...eles saberão a verdade...',
    '  [ALPHA NEURAL SIGNATURE: DEPARTING FACILITY]':
      '  [ASSINATURA NEURAL ALPHA: DEIXANDO A INSTALAÇÃO]',
    'UFO74: holy shit. you actually did it.':
      'UFO74: caramba. você realmente fez isso.',
    '       a living alien is loose.':
      '       um alienígena vivo está solto.',
    "       there's no covering this up.":
      '       não tem como encobrir isso.',
    'UFO74: whatever happens next...':
      'UFO74: aconteça o que acontecer...',
    '       the world will have proof.':
      '       o mundo terá provas.',
    'ERROR: Subject ALPHA containment already breached.':
      'ERRO: Contenção do sujeito ALPHA já foi violada.',
    'No action required.':
      'Nenhuma ação necessária.',
    'ERROR: Release protocol not available.':
      'ERRO: Protocolo de liberação não disponível.',
    'Subject ALPHA manifest not found in system.':
      'Manifesto do sujeito ALPHA não encontrado no sistema.',
    'Have you discovered the containment records?':
      'Você descobriu os registros de contenção?',

    // ═══════════════════════════════════════════════════════════
    // NEURAL CLUSTER MEMO — neuralClusterMemo.ts
    // ═══════════════════════════════════════════════════════════

    'MEMO: Neural Cluster Initiative':
      'MEMORANDO: Iniciativa Cluster Neural',
    'ORIGIN: Tissue sample P-45 (expired 22-JAN-1996)':
      'ORIGEM: Amostra de tecido P-45 (expirado 22-JAN-1996)',
    'FACILITY: ESA Annex — Três Corações':
      'INSTALAÇÃO: Anexo ESA — Três Corações',
    'A neural lattice was mapped from the dissected cranium':
      'Uma rede neural foi mapeada a partir do crânio dissecado',
    'of specimen P-45 and replicated in silicon. Three cranial':
      'do espécime P-45 e replicada em silício. Três cristas',
    'ridges corresponded to dense synaptic structures with no':
      'cranianas correspondiam a estruturas sinápticas densas sem',
    'mammalian analogue. The attending pathologist noted the tissue':
      'análogo mamífero. O patologista responsável notou que o tecido',
    'continued generating theta pulses 14 hours post-mortem.':
      'continuou gerando pulsos theta 14 horas post-mortem.',
    'The emulated cluster stores and emits memory fragments':
      'O cluster emulado armazena e emite fragmentos de memória',
    'from the recovered organism. Emissions are non-linguistic.':
      'do organismo recuperado. As emissões são não linguísticas.',
    'FRAGMENT LOG (selected)':
      'REGISTRO DE FRAGMENTOS (selecionados)',
    '  #0041 — Sensory impression: humid air, red earth,':
      '  #0041 — Impressão sensorial: ar úmido, terra vermelha,',
    '          low canopy. Strong ammonia overlay. Three':
      '          cobertura baixa. Forte sobreposição de amônia. Três',
    '          heartbeats nearby, rapid. Overwhelming fear':
      '          batimentos cardíacos próximos, rápidos. Medo avassalador',
    '          (source: external). Image: adolescent faces.':
      '          (fonte: externo). Imagem: rostos adolescentes.',
    '  #0073 — Spatial memory: overhead trajectory, South':
      '  #0073 — Memória espacial: trajetória aérea, Atlântico',
    '          Atlantic, deceleration. Radar sweep detected':
      '          Sul, desaceleração. Varredura de radar detectada',
    '          three times. Intentional descent — not crash.':
      '          três vezes. Descida intencional — não queda.',
    '  #0112 — Emotional residue: confinement, cold metal,':
      '  #0112 — Resíduo emocional: confinamento, metal frio,',
    '          fluorescent hum. Concept: "cataloguing us back."':
      '          zumbido fluorescente. Conceito: "nos catalogando de volta."',
    '          Chemical sting in ambient atmosphere.':
      '          Ardência química na atmosfera ambiente.',
    '  #0158 — Projection event: cluster broadcast the':
      '  #0158 — Evento de projeção: cluster transmitiu a',
    '          word COLHEITA across monitoring terminals':
      '          palavra COLHEITA pelos terminais de monitoramento',
    '          for 0.3 seconds. No operator input logged.':
      '          por 0.3 segundos. Nenhuma entrada de operador registrada.',
    'Access strictly prohibited except under override protocol.':
      'Acesso estritamente proibido exceto sob protocolo de sobreposição.',
    'To initiate interface: echo neural_cluster':
      'Para iniciar interface: echo neural_cluster',
    'WARNING: Two technicians reported intrusive imagery':
      'AVISO: Dois técnicos relataram imagens intrusivas',
    '(jungle canopy, ammonia odor) for days after exposure.':
      '(cobertura de selva, odor de amônia) por dias após a exposição.',
    'Limit cluster sessions to 90 seconds.':
      'Limite as sessões de cluster a 90 segundos.',

    // ═══════════════════════════════════════════════════════════
    // NARRATIVE CONTENT — narrativeContent.ts
    // ═══════════════════════════════════════════════════════════

    // ufo74_identity_file — content
    'PERSONAL ARCHIVE - LEGACY SEALED COPY':
      'ARQUIVO PESSOAL - CÓPIA LACRADA LEGADA',
    'OWNER: UNKNOWN':
      'PROPRIETÁRIO: DESCONHECIDO',
    '[RECOVERED TEXT AVAILABLE THROUGH DIRECT OPEN]':
      '[TEXTO RECUPERADO DISPONÍVEL ATRAVÉS DE ABERTURA DIRETA]',
    'The old password gate has been retired in this build.':
      'A antiga barreira de senha foi retirada nesta versão.',
    'The transfer notice still explains who left this behind.':
      'O aviso de transferência ainda explica quem deixou isto para trás.',

    // ufo74_identity_file — decryptedFragment
    'PERSONAL ARCHIVE - FOR MY EYES ONLY':
      'ARQUIVO PESSOAL - SOMENTE PARA MEUS OLHOS',
    'IF YOU ARE READING THIS, YOU FOUND MY SECRET':
      'SE VOCÊ ESTÁ LENDO ISTO, ENCONTROU MEU SEGREDO',
    'My name is Carlos Eduardo Ferreira.':
      'Meu nome é Carlos Eduardo Ferreira.',
    'In January 1996, I was a 2nd Lieutenant in the Brazilian Air Force.':
      'Em janeiro de 1996, eu era 2º Tenente da Força Aérea Brasileira.',
    'I was there when it happened.':
      'Eu estava lá quando aconteceu.',
    'I processed the initial reports from Varginha.':
      'Eu processei os relatórios iniciais de Varginha.',
    'I saw the photographs before they were classified.':
      'Eu vi as fotografias antes de serem classificadas.',
    'I read the original field notes.':
      'Eu li as notas de campo originais.',
    'And I saw what they did to silence the witnesses.':
      'E eu vi o que fizeram para silenciar as testemunhas.',
    'I spent 30 years building this archive.':
      'Passei 30 anos construindo este arquivo.',
    'If you are reading this, you are that person.':
      'Se você está lendo isto, você é essa pessoa.',
    'The being I saw... it looked at me.':
      'O ser que eu vi... ele olhou para mim.',
    'Not with fear. With understanding.':
      'Não com medo. Com compreensão.',
    'It knew what we would do.':
      'Ele sabia o que faríamos.',
    'I have never been the same.':
      'Nunca mais fui o mesmo.',
    'My call sign was UFO74.':
      'Meu indicativo era UFO74.',
    'Now you know who I really am.':
      'Agora você sabe quem eu realmente sou.',
    '>> THIS FILE TRIGGERS SECRET ENDING <<':
      '>> ESTE ARQUIVO ACIONA O FINAL SECRETO <<',

    // intrusion_detected_file
    'SECURITY ALERT - TRACE REVIEW LOGGED':
      'ALERTA DE SEGURANÇA - REVISÃO DE RASTREIO REGISTRADA',
    'NOTICE: This monitor reflects an archived incident-response snapshot.':
      'AVISO: Este monitor reflete um snapshot arquivado de resposta a incidentes.',
    'A prior trace attempt was recorded against this terminal profile.':
      'Uma tentativa de rastreio anterior foi registrada neste perfil de terminal.',
    'No live countdown is running from this screen.':
      'Nenhuma contagem regressiva está rodando nesta tela.',
    'Risk still rises if you keep making noise.':
      'O risco ainda aumenta se você continuar fazendo barulho.',
    'Use the log as a warning about visibility, not as a timer.':
      'Use o log como aviso sobre visibilidade, não como um cronômetro.',
    'RECOMMENDED RESPONSE:':
      'RESPOSTA RECOMENDADA:',
    '  1. Stay deliberate and avoid noisy commands':
      '  1. Seja deliberado e evite comandos ruidosos',
    '  2. Review related logs before pushing deeper':
      '  2. Revise os logs relacionados antes de ir mais fundo',
    '  3. Disconnect if detection becomes critical':
      '  3. Desconecte se a detecção se tornar crítica',

    // system_maintenance_notes
    'SYSTEM ADMINISTRATOR NOTES - CONFIDENTIAL':
      'NOTAS DO ADMINISTRADOR DO SISTEMA - CONFIDENCIAL',
    'Notes from last maintenance window (1995-12-15):':
      'Notas da última janela de manutenção (1995-12-15):',
    '1. Legacy recovery system still functional.':
      '1. Sistema de recuperação legado ainda funcional.',
    '   Command: "recover <filename>" to attempt file restoration.':
      '   Comando: "recover <filename>" para tentar restauração de arquivo.',
    '   May partially restore corrupted or deleted files.':
      '   Pode restaurar parcialmente arquivos corrompidos ou deletados.',
    '2. Network trace utility remains active.':
      '2. Utilitário de rastreamento de rede permanece ativo.',
    '   Command: "trace" shows active connections.':
      '   Comando: "trace" mostra conexões ativas.',
    '   Useful for security audits.':
      '   Útil para auditorias de segurança.',
    '3. Emergency disconnect procedure:':
      '3. Procedimento de desconexão de emergência:',
    '   Command: "disconnect" forces immediate session termination.':
      '   Comando: "disconnect" força encerramento imediato da sessão.',
    '   WARNING: All unsaved work will be lost.':
      '   AVISO: Todo trabalho não salvo será perdido.',
    '4. Deep scan utility:':
      '4. Utilitário de varredura profunda:',
    '   Command: "scan" reveals hidden or system files.':
      '   Comando: "scan" revela arquivos ocultos ou de sistema.',
    '   Requires admin access.':
      '   Requer acesso de administrador.',
    'ADMINISTRATOR: J.M.S.':
      'ADMINISTRADOR: J.M.S.',

    // personnel_transfer_extended
    'PERSONNEL TRANSFER AUTHORIZATION':
      'AUTORIZAÇÃO DE TRANSFERÊNCIA DE PESSOAL',
    'DOCUMENT ID: PTA-1996-0120':
      'ID DO DOCUMENTO: PTA-1996-0120',
    'TRANSFER REQUEST:':
      'PEDIDO DE TRANSFERÊNCIA:',
    '  FROM: Base Aérea de Guarulhos':
      '  DE: Base Aérea de Guarulhos',
    '  TO: [REDACTED]':
      '  PARA: [REDIGIDO]',
    'PERSONNEL:':
      'PESSOAL:',
    '  2nd Lt. C.E.F.':
      '  2º Ten. C.E.F.',
    '  Classification: ANALYST':
      '  Classificação: ANALISTA',
    '  Clearance Level: RESTRICTED → CLASSIFIED':
      '  Nível de Acesso: RESTRITO → CLASSIFICADO',
    'REASON FOR TRANSFER:':
      'MOTIVO DA TRANSFERÊNCIA:',
    '  Subject demonstrated exceptional aptitude during':
      '  Sujeito demonstrou aptidão excepcional durante',
    '  incident processing. Recommended for special projects.':
      '  processamento de incidentes. Recomendado para projetos especiais.',
    'AUTHORIZATION CODE: varginha1996':
      'CÓDIGO DE AUTORIZAÇÃO: varginha1996',
    'APPROVED BY:':
      'APROVADO POR:',
    '  Col. [REDACTED]':
      '  Cel. [REDIGIDO]',
    '  Division Chief, Special Operations':
      '  Chefe de Divisão, Operações Especiais',
    'NOTE: This code may be used for secure file access.':
      'NOTA: Este código pode ser usado para acesso seguro a arquivos.',

    // official_summary_report
    'OFFICIAL INCIDENT SUMMARY':
      'RESUMO OFICIAL DO INCIDENTE',
    'EQUIPMENT RECOVERY — JANUARY 1996':
      'RECUPERAÇÃO DE EQUIPAMENTO — JANEIRO 1996',
    'CLASSIFICATION: PUBLIC RELEASE VERSION':
      'CLASSIFICAÇÃO: VERSÃO PARA DIVULGAÇÃO PÚBLICA',
    'SUMMARY:':
      'RESUMO:',
    '  On January 20, 1996, recovery teams responded to':
      '  Em 20 de janeiro de 1996, equipes de recuperação responderam a',
    '  reports of debris in the Jardim Andere area following':
      '  relatos de destroços na área de Jardim Andere após',
    '  severe weather conditions overnight.':
      '  condições climáticas severas durante a noite.',
    'OFFICIAL FINDINGS:':
      'CONCLUSÕES OFICIAIS:',
    '  After thorough investigation, authorities concluded that':
      '  Após investigação minuciosa, as autoridades concluíram que',
    '  the debris originated from:':
      '  os destroços se originaram de:',
    '  1. A weather monitoring station damaged during a storm.':
      '  1. Uma estação de monitoramento climático danificada durante uma tempestade.',
    '  2. Construction materials displaced by high winds.':
      '  2. Materiais de construção deslocados por ventos fortes.',
    '  3. A fallen telecommunications antenna from a nearby tower.':
      '  3. Uma antena de telecomunicações caída de uma torre próxima.',
    'MILITARY INVOLVEMENT:':
      'ENVOLVIMENTO MILITAR:',
    '  Reports of military convoy activity were confirmed as':
      '  Relatos de atividade de comboio militar foram confirmados como',
    '  routine training exercises unrelated to the debris.':
      '  exercícios de treinamento de rotina não relacionados aos destroços.',
    'HOSPITAL INCIDENTS:':
      'INCIDENTES HOSPITALARES:',
    '  No hospital incidents were recorded in connection':
      '  Nenhum incidente hospitalar foi registrado em conexão',
    '  with the recovery operation.':
      '  com a operação de recuperação.',

    // cipher_message — content
    'INTERCEPTED TRANSMISSION - ENCODED':
      'TRANSMISSÃO INTERCEPTADA - CODIFICADA',
    'DATE: 1996-01-21 03:47:00':
      'DATA: 1996-01-21 03:47:00',
    'CIPHER: ROT13':
      'CIFRA: ROT13',
    'ENCODED MESSAGE:':
      'MENSAGEM CODIFICADA:',
    '  Pneqb genafresrq.':
      '  Pneqb genafresrq.',
    '  Qrfgvangvba pbasvezrq.':
      '  Qrfgvangvba pbasvezrq.',
    '  Njnvgvat vafgehpgvbaf.':
      '  Njnvgvat vafgehpgvbaf.',
    'Apply the ROT13 note above to decode the message.':
      'Aplique a nota ROT13 acima para decodificar a mensagem.',
    'The old decrypt wrapper is no longer required.':
      'O antigo wrapper de descriptografia não é mais necessário.',

    // cipher_message — decryptedFragment
    'DECODED TRANSMISSION':
      'TRANSMISSÃO DECODIFICADA',
    'DECODED MESSAGE:':
      'MENSAGEM DECODIFICADA:',
    '  Cargo transferred.':
      '  Carga transferida.',
    '  Destination confirmed.':
      '  Destino confirmado.',
    '  Awaiting instructions.':
      '  Aguardando instruções.',
    'ANALYSIS:':
      'ANÁLISE:',
    '  This transmission confirms the transfer of recovered':
      '  Esta transmissão confirma a transferência de materiais',
    '  materials to a secondary facility.':
      '  recuperados para uma instalação secundária.',
    '  Location: Undisclosed logistics hub.':
      '  Localização: Hub logístico não divulgado.',
    '>> ROUTINE SUPPLY CHAIN COMMUNICATION <<':
      '>> COMUNICAÇÃO DE ROTINA DA CADEIA DE SUPRIMENTOS <<',

    // unstable_core_dump
    '⚠️ WARNING: UNSTABLE FILE':
      '⚠️ AVISO: ARQUIVO INSTÁVEL',
    'This file contains corrupted data from a system crash.':
      'Este arquivo contém dados corrompidos de uma falha do sistema.',
    'Reading this file may cause corruption to spread to':
      'Ler este arquivo pode fazer a corrupção se espalhar para',
    'adjacent files in the directory.':
      'arquivos adjacentes no diretório.',
    '0x00000000: 4D5A9000 03000000 04000000 FFFF0000':
      '0x00000000: 4D5A9000 03000000 04000000 FFFF0000',
    '0x00000010: B8000000 00000000 40000000 00000000':
      '0x00000010: B8000000 00000000 40000000 00000000',
    '0x00000020: [DATA CORRUPTION] [DATA CORRUPTION]':
      '0x00000020: [CORRUPÇÃO DE DADOS] [CORRUPÇÃO DE DADOS]',
    '0x00000030: [UNREADABLE] [SECTOR FAILURE]':
      '0x00000030: [ILEGÍVEL] [FALHA DE SETOR]',
    'PARTIAL RECOVERY:':
      'RECUPERAÇÃO PARCIAL:',
    '  ...database migration failed at checkpoint 0x7F...':
      '  ...migração de banco de dados falhou no checkpoint 0x7F...',
    '  ...backup process interrupted during nightly cycle...':
      '  ...processo de backup interrompido durante ciclo noturno...',
    '  ...sector table overwritten, unable to [CORRUPTED]...':
      '  ...tabela de setores sobrescrita, incapaz de [CORROMPIDO]...',
    '>> READING THIS FILE HAS DESTABILIZED NEARBY DATA <<':
      '>> A LEITURA DESTE ARQUIVO DESESTABILIZOU DADOS PRÓXIMOS <<',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — witness_statement_original.txt
    // ═══════════════════════════════════════════════════════════
    'WITNESS STATEMENT — UNREDACTED':
      'DEPOIMENTO DE TESTEMUNHA — SEM REDAÇÃO',
    'SUBJECT: MARIA ELENA SOUZA':
      'SUJEITO: MARIA ELENA SOUZA',
    'DATE: JANUARY 21, 1996':
      'DATA: 21 DE JANEIRO DE 1996',
    'CLASSIFICATION: DELETED — DO NOT DISTRIBUTE':
      'CLASSIFICAÇÃO: DELETADO — NÃO DISTRIBUIR',
    'INTERVIEWER: Please describe exactly what you saw.':
      'ENTREVISTADOR: Por favor, descreva exatamente o que você viu.',
    'SOUZA: It was around 3:30 AM. I couldn\'t sleep because of':
      'SOUZA: Era por volta das 3:30 da manhã. Eu não conseguia dormir por causa',
    'the heat. I went outside to smoke and saw the sky light up.':
      'do calor. Saí para fumar e vi o céu se iluminar.',
    'Not like lightning. It was... pulsing. Red and white.':
      'Não como um relâmpago. Era... pulsante. Vermelho e branco.',
    'Then I saw it come down. Silent. No sound at all.':
      'Então eu vi descer. Silencioso. Nenhum som.',
    'It hit somewhere beyond the fazenda, maybe 2km north.':
      'Caiu em algum lugar além da fazenda, talvez 2km ao norte.',
    'INTERVIEWER: What happened next?':
      'ENTREVISTADOR: O que aconteceu depois?',
    'SOUZA: I ran inside. Woke my husband. By the time we went':
      'SOUZA: Corri para dentro. Acordei meu marido. Quando saímos',
    'back out, there were already trucks. Military trucks.':
      'de volta, já havia caminhões. Caminhões militares.',
    'How did they get there so fast? We\'re 40km from anything.':
      'Como eles chegaram tão rápido? Estamos a 40km de qualquer coisa.',
    '[REDACTED IN FINAL VERSION]':
      '[CENSURADO NA VERSÃO FINAL]',
    'SOUZA: I saw them load something. Not debris.':
      'SOUZA: Eu os vi carregar algo. Não eram destroços.',
    'It was... it was small. The size of a child.':
      'Era... era pequeno. Do tamanho de uma criança.',
    'But it wasn\'t a child. The proportions were wrong.':
      'Mas não era uma criança. As proporções estavam erradas.',
    'The head was too large. The limbs too thin.':
      'A cabeça era grande demais. Os membros finos demais.',
    'One of them turned toward me. Just for a moment.':
      'Um deles se virou para mim. Só por um momento.',
    'Its eyes... I still see them when I close mine.':
      'Seus olhos... eu ainda os vejo quando fecho os meus.',
    '[END REDACTED SECTION]':
      '[FIM DA SEÇÃO CENSURADA]',
    'INTERVIEWER: Did anyone speak to you?':
      'ENTREVISTADOR: Alguém falou com você?',
    'SOUZA: A man in a dark suit. Not military.':
      'SOUZA: Um homem de terno escuro. Não era militar.',
    'He said I had a fever dream. That the heat':
      'Ele disse que eu tive um delírio febril. Que o calor',
    'can make people see things that aren\'t there.':
      'pode fazer as pessoas verem coisas que não existem.',
    'He gave me a number to call if I remembered':
      'Ele me deu um número para ligar se eu lembrasse',
    '"correctly." Said my husband\'s job depended on it.':
      '"corretamente." Disse que o emprego do meu marido dependia disso.',
    'STATUS: STATEMENT EXPUNGED FROM OFFICIAL RECORD':
      'STATUS: DEPOIMENTO EXPURGADO DO REGISTRO OFICIAL',
    'REASON: "Witness reliability compromised by stress"':
      'MOTIVO: "Confiabilidade da testemunha comprometida por estresse"',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — directive_alpha_draft.txt
    // ═══════════════════════════════════════════════════════════
    'DRAFT — DIRECTIVE ALPHA — ITERATION 1':
      'RASCUNHO — DIRETIVA ALPHA — ITERAÇÃO 1',
    'DATE: JANUARY 19, 1996 — 04:22':
      'DATA: 19 DE JANEIRO DE 1996 — 04:22',
    'AUTHOR: [DELETED]':
      'AUTOR: [DELETADO]',
    'STATUS: SUPERSEDED — MARKED FOR DELETION':
      'STATUS: SUBSTITUÍDO — MARCADO PARA EXCLUSÃO',
    'IMMEDIATE ACTION REQUIRED':
      'AÇÃO IMEDIATA NECESSÁRIA',
    'Asset recovery timeline must be accelerated.':
      'O cronograma de recuperação de ativos deve ser acelerado.',
    'Current projections suggest 2026 convergence window is':
      'Projeções atuais sugerem que a janela de convergência de 2026 é',
    'CLOSER than previously modeled. New signal analysis':
      'MAIS PRÓXIMA do que modelado anteriormente. Nova análise de sinais',
    'indicates active monitoring of this region.':
      'indica monitoramento ativo desta região.',
    'REMOVED FROM FINAL VERSION:':
      'REMOVIDO DA VERSÃO FINAL:',
    'The subjects (designated BIO-A through BIO-C) have':
      'Os sujeitos (designados BIO-A a BIO-C) têm',
    'demonstrated unexpected cognitive persistence despite':
      'demonstrado persistência cognitiva inesperada apesar dos',
    'containment protocols. Recommend immediate relocation':
      'protocolos de contenção. Recomenda-se realocação imediata',
    'to Site 7 for long-term study.':
      'para o Site 7 para estudo de longo prazo.',
    'NOTE: Subject BIO-B has attempted communication.':
      'NOTA: Sujeito BIO-B tentou comunicação.',
    'Preliminary analysis suggests awareness of our':
      'Análise preliminar sugere consciência de nossa',
    'organizational structure. HOW?':
      'estrutura organizacional. COMO?',
    'Recommend cognitive isolation protocol.':
      'Recomenda-se protocolo de isolamento cognitivo.',
    'SANITIZATION NOTE:':
      'NOTA DE SANITIZAÇÃO:',
    'Final directive will reference "material recovery" only.':
      'A diretiva final fará referência apenas a "recuperação de material".',
    'All biological terminology to be replaced with':
      'Toda terminologia biológica deve ser substituída por',
    '"debris" and "artifacts".':
      '"destroços" e "artefatos".',
    'Project SEED references to be purged.':
      'Referências ao Projeto SEED devem ser expurgadas.',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — deleted_comms_log.txt
    // ═══════════════════════════════════════════════════════════
    'COMMUNICATIONS LOG — PURGED':
      'LOG DE COMUNICAÇÕES — EXPURGADO',
    'DATE: JANUARY 20-22, 1996':
      'DATA: 20-22 DE JANEIRO DE 1996',
    'RECOVERY STATUS: PARTIAL RESTORATION FROM BACKUP SECTOR':
      'STATUS DE RECUPERAÇÃO: RESTAURAÇÃO PARCIAL DO SETOR DE BACKUP',
    'SITE-3 > COMMAND: Confirmation of visual. Multiple witnesses.':
      'SITE-3 > COMANDO: Confirmação visual. Múltiplas testemunhas.',
    'COMMAND > SITE-3: Mobilize RECOVERY TEAM. No local involvement.':
      'COMANDO > SITE-3: Mobilizar EQUIPE DE RECUPERAÇÃO. Sem envolvimento local.',
    'SITE-3 > COMMAND: Team en route. ETA 18 minutes.':
      'SITE-3 > COMANDO: Equipe a caminho. Tempo estimado 18 minutos.',
    'RECOVERY > COMMAND: On scene. Initial assessment complete.':
      'RECUPERAÇÃO > COMANDO: No local. Avaliação inicial concluída.',
    '                    Three biologics confirmed. One responsive.':
      '                    Três biológicos confirmados. Um responsivo.',
    'COMMAND > RECOVERY: Responsive HOW?':
      'COMANDO > RECUPERAÇÃO: Responsivo COMO?',
    'RECOVERY > COMMAND: It\'s looking at us. At each of us in turn.':
      'RECUPERAÇÃO > COMANDO: Está olhando para nós. Para cada um de nós, por vez.',
    '                    Like it\'s... counting.':
      '                    Como se estivesse... contando.',
    'COMMAND > RECOVERY: Contain immediately. No direct eye contact.':
      'COMANDO > RECUPERAÇÃO: Conter imediatamente. Sem contato visual direto.',
    'RECOVERY > COMMAND: Requesting override authorization.':
      'RECUPERAÇÃO > COMANDO: Solicitando autorização de override.',
    '                    Standard protocols insufficient.':
      '                    Protocolos padrão insuficientes.',
    'COMMAND > RECOVERY: Override granted. Initiate OPERAÇÃO COLHEITA.':
      'COMANDO > RECUPERAÇÃO: Override concedido. Iniciar OPERAÇÃO COLHEITA.',
    '                    Harvest protocols are now in effect.':
      '                    Protocolos de colheita agora em vigor.',
    'RECOVERY > COMMAND: All biologics contained.':
      'RECUPERAÇÃO > COMANDO: Todos os biológicos contidos.',
    '                    One handler reporting headache and nausea.':
      '                    Um operador relatando dor de cabeça e náusea.',
    '                    Request medical standby.':
      '                    Solicita-se equipe médica de prontidão.',
    'COMMAND > ALL: Initiate communications blackout.':
      'COMANDO > TODOS: Iniciar blackout de comunicações.',
    '               This log is now CLASSIFIED OMEGA.':
      '               Este log agora é CLASSIFICADO OMEGA.',
    '[LOG TERMINATED]':
      '[LOG ENCERRADO]',
    'DELETION ORDER: COMM-1996-0120-DEL':
      'ORDEM DE EXCLUSÃO: COMM-1996-0120-DEL',
    'AUTHORIZATION: [SIGNATURE EXPUNGED]':
      'AUTORIZAÇÃO: [ASSINATURA EXPURGADA]',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — personnel_file_costa.txt
    // ═══════════════════════════════════════════════════════════
    'PERSONNEL FILE — COSTA, RICARDO MANUEL':
      'FICHA DE PESSOAL — COSTA, RICARDO MANUEL',
    'EMPLOYEE ID: [RECORD DELETED]':
      'ID DO FUNCIONÁRIO: [REGISTRO DELETADO]',
    'STATUS: NON-EXISTENT (OFFICIALLY)':
      'STATUS: INEXISTENTE (OFICIALMENTE)',
    'NOTE: This file should not exist. Ricardo Costa was':
      'NOTA: Este arquivo não deveria existir. Ricardo Costa foi',
    'removed from all personnel databases on 01/25/1996.':
      'removido de todos os bancos de dados de pessoal em 25/01/1996.',
    'POSITION: Senior Containment Specialist':
      'CARGO: Especialista Sênior em Contenção',
    'CLEARANCE: Level 4':
      'AUTORIZAÇÃO: Nível 4',
    'ASSIGNED: Site 7, Biological Research Wing':
      'DESIGNADO: Site 7, Ala de Pesquisa Biológica',
    'INCIDENT REPORT (REDACTED FROM ALL COPIES)':
      'RELATÓRIO DE INCIDENTE (CENSURADO DE TODAS AS CÓPIAS)',
    'DATE: January 23, 1996':
      'DATA: 23 de janeiro de 1996',
    'Costa was assigned to overnight monitoring of Subject BIO-B.':
      'Costa foi designado para monitoramento noturno do Sujeito BIO-B.',
    'At approximately 02:30, monitoring equipment detected':
      'Aproximadamente às 02:30, equipamentos de monitoramento detectaram',
    'anomalous brain wave patterns in Costa. Patterns were':
      'padrões anômalos de ondas cerebrais em Costa. Os padrões estavam',
    'synchronized with emissions from Subject BIO-B.':
      'sincronizados com emissões do Sujeito BIO-B.',
    'Costa was found unresponsive at 06:00 shift change.':
      'Costa foi encontrado sem resposta na troca de turno das 06:00.',
    'Eyes were open. Pupils dilated. Breathing normal.':
      'Olhos abertos. Pupilas dilatadas. Respiração normal.',
    'When Costa regained consciousness (approximately 14:00),':
      'Quando Costa recobrou a consciência (aproximadamente 14:00),',
    'he reported complete memory loss of the preceding 12 hours.':
      'ele relatou perda completa de memória das 12 horas anteriores.',
    'Additionally, Costa demonstrated knowledge of events that':
      'Além disso, Costa demonstrou conhecimento de eventos que',
    'had not yet occurred — predicting the arrival of an':
      'ainda não haviam ocorrido — prevendo a chegada de uma',
    'inspection team 3 hours before notification was sent.':
      'equipe de inspeção 3 horas antes do envio da notificação.',
    'FINAL DISPOSITION':
      'DISPOSIÇÃO FINAL',
    'Costa was transferred to psychiatric evaluation.':
      'Costa foi transferido para avaliação psiquiátrica.',
    'His employment records were sanitized.':
      'Seus registros de emprego foram sanitizados.',
    'His family was informed of a "work accident."':
      'Sua família foi informada de um "acidente de trabalho."',
    'Current status: UNKNOWN':
      'Status atual: DESCONHECIDO',
    'UNOFFICIAL NOTE (handwritten scan):':
      'NOTA NÃO OFICIAL (digitalização de manuscrito):',
    '"He keeps writing the same date over and over.':
      '"Ele continua escrevendo a mesma data repetidamente.',
    ' September 4, 2026. What happens then?"':
      ' 4 de setembro de 2026. O que acontece então?"',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — project_seed_memo.txt
    // ═══════════════════════════════════════════════════════════
    'MEMORANDUM — PROJECT SEED':
      'MEMORANDO — PROJETO SEED',
    'CLASSIFICATION: ULTRA — DELETED FROM ALL SYSTEMS':
      'CLASSIFICAÇÃO: ULTRA — DELETADO DE TODOS OS SISTEMAS',
    'DATE: JANUARY 18, 1996':
      'DATA: 18 DE JANEIRO DE 1996',
    'TO: [REDACTED]':
      'PARA: [CENSURADO]',
    'FROM: Director, Special Programs Division':
      'DE: Diretor, Divisão de Programas Especiais',
    'RE: Accelerated Timeline Revision':
      'REF: Revisão Acelerada do Cronograma',
    'The events of January 20th have changed our calculations.':
      'Os eventos de 20 de janeiro mudaram nossos cálculos.',
    'Project SEED was predicated on the assumption that first':
      'O Projeto SEED foi baseado na suposição de que o primeiro',
    'contact would occur within a controlled environment.':
      'contato ocorreria em um ambiente controlado.',
    'The Varginha incident has invalidated this assumption.':
      'O incidente de Varginha invalidou esta suposição.',
    'The biologics recovered demonstrate capabilities beyond':
      'Os biológicos recuperados demonstram capacidades além dos',
    'our current models. Specifically:':
      'nossos modelos atuais. Especificamente:',
    '  1. Apparent telepathic communication':
      '  1. Comunicação telepática aparente',
    '  2. Knowledge of human organizational structures':
      '  2. Conhecimento das estruturas organizacionais humanas',
    '  3. References to a specific future date (2026)':
      '  3. Referências a uma data futura específica (2026)',
    'Most concerning: the biologics appear to have been':
      'Mais preocupante: os biológicos parecem ter sido',
    'EXPECTING us. They were not surprised by capture.':
      'ESPERADOS por nós. Não ficaram surpresos com a captura.',
    'They were not hostile. They were... patient.':
      'Não eram hostis. Eram... pacientes.',
    'REVISED ASSESSMENT':
      'AVALIAÇÃO REVISADA',
    'We are not dealing with a crash landing.':
      'Não estamos lidando com uma queda acidental.',
    'We are dealing with a DELIVERY.':
      'Estamos lidando com uma ENTREGA.',
    'The craft was designed to be found.':
      'A nave foi projetada para ser encontrada.',
    'The biologics were designed to be captured.':
      'Os biológicos foram projetados para serem capturados.',
    'They are reconnaissance units.':
      'São unidades de reconhecimento.',
    'PROJECT SEED must pivot from "preparation" to':
      'O PROJETO SEED deve mudar de "preparação" para',
    '"acceleration." The 2026 window is now considered':
      '"aceleração." A janela de 2026 agora é considerada',
    'a hard deadline, not an estimate.':
      'um prazo definitivo, não uma estimativa.',
    'DISPOSITION OF THIS MEMO':
      'DISPOSIÇÃO DESTE MEMORANDO',
    'This document will be purged from all systems within 72hrs.':
      'Este documento será expurgado de todos os sistemas em 72h.',
    'Do not create copies. Do not reference PROJECT SEED':
      'Não crie cópias. Não faça referência ao PROJETO SEED',
    'in any future communications.':
      'em nenhuma comunicação futura.',
    'The official narrative will be: "crashed experimental craft"':
      'A narrativa oficial será: "aeronave experimental acidentada"',
    'The biologics will be: "unusual debris formations"':
      'Os biológicos serão: "formações incomuns de destroços"',
    'The timeline will be: "irrelevant hoax material"':
      'O cronograma será: "material de fraude irrelevante"',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — autopsy_notes_unredacted.txt
    // ═══════════════════════════════════════════════════════════
    'AUTOPSY NOTES — UNREDACTED VERSION':
      'NOTAS DE AUTÓPSIA — VERSÃO SEM REDAÇÃO',
    'SUBJECT: BIO-C (DECEASED)':
      'SUJEITO: BIO-C (FALECIDO)',
    'EXAMINER: Dr. [NAME EXPUNGED]':
      'EXAMINADOR: Dr. [NOME EXPURGADO]',
    'DATE: JANUARY 24, 1996':
      'DATA: 24 DE JANEIRO DE 1996',
    'STATUS: MARKED FOR DESTRUCTION':
      'STATUS: MARCADO PARA DESTRUIÇÃO',
    'PRE-EXAMINATION NOTES:':
      'NOTAS PRÉ-EXAME:',
    'Subject expired at 04:17 on 01/24. Cause of death unclear.':
      'Sujeito expirou às 04:17 em 24/01. Causa da morte incerta.',
    'No external trauma. No signs of illness or distress.':
      'Sem trauma externo. Sem sinais de doença ou sofrimento.',
    'Subject appeared to simply... stop functioning.':
      'O sujeito pareceu simplesmente... parar de funcionar.',
    'PHYSICAL EXAMINATION':
      'EXAME FÍSICO',
    'Height: 127cm (approx 4\'2")':
      'Altura: 127cm (aprox. 1,27m)',
    'Weight: 18.3kg (approx 40lbs)':
      'Peso: 18,3kg',
    'Skin: Gray-brown pigmentation, slight bioluminescence':
      'Pele: Pigmentação marrom-acinzentada, leve bioluminescência',
    'CRANIUM: Significantly enlarged. Brain mass approximately':
      'CRÂNIO: Significativamente aumentado. Massa cerebral aproximadamente',
    '3x human proportional average. Unusual folding patterns.':
      '3x a média proporcional humana. Padrões de dobramento incomuns.',
    'EYES: Large, almond-shaped. Pupils fixed and dilated.':
      'OLHOS: Grandes, amendoados. Pupilas fixas e dilatadas.',
    'Retinal structure suggests low-light specialization.':
      'Estrutura retiniana sugere especialização em baixa luminosidade.',
    'LIMBS: Proportionally longer than human. Four digits per':
      'MEMBROS: Proporcionalmente mais longos que humanos. Quatro dígitos por',
    'hand. No fingernails. Skin thin over small bone structure.':
      'mão. Sem unhas. Pele fina sobre estrutura óssea pequena.',
    'INTERNAL EXAMINATION — [DELETED FROM OFFICIAL REPORT]':
      'EXAME INTERNO — [DELETADO DO RELATÓRIO OFICIAL]',
    'Cardiovascular: Single heart, three chambers. Efficient.':
      'Cardiovascular: Coração único, três câmaras. Eficiente.',
    'Digestive: Minimal. Subject appears designed for':
      'Digestivo: Mínimo. Sujeito parece projetado para',
    'nutrient absorption rather than food processing.':
      'absorção de nutrientes em vez de processamento de alimentos.',
    'Reproductive: None observed. Subject appears to be':
      'Reprodutivo: Nenhum observado. Sujeito parece ser',
    'purpose-built rather than naturally developed.':
      'construído com propósito em vez de desenvolvido naturalmente.',
    'CRITICAL FINDING:':
      'DESCOBERTA CRÍTICA:',
    'Neural tissue contains metallic inclusions. Analysis':
      'Tecido neural contém inclusões metálicas. Análise',
    'suggests organic circuitry. This being was MANUFACTURED.':
      'sugere circuitos orgânicos. Este ser foi FABRICADO.',
    'It is not a natural life form.':
      'Não é uma forma de vida natural.',
    'It is a construct. A biological machine.':
      'É um construto. Uma máquina biológica.',
    'PERSONAL NOTE (not for official record):':
      'NOTA PESSOAL (não para registro oficial):',
    'I have practiced medicine for 30 years. I have never':
      'Pratico medicina há 30 anos. Nunca',
    'questioned what I believed about life and its origins.':
      'questionei o que acreditava sobre a vida e suas origens.',
    'Today I questioned everything.':
      'Hoje questionei tudo.',
    'These are not visitors. These are messengers.':
      'Estes não são visitantes. São mensageiros.',
    'And we are not prepared for what they herald.':
      'E não estamos preparados para o que eles anunciam.',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — transfer_manifest_deleted.txt
    // ═══════════════════════════════════════════════════════════
    'ASSET TRANSFER MANIFEST — DELETED COPY':
      'MANIFESTO DE TRANSFERÊNCIA DE ATIVOS — CÓPIA DELETADA',
    'DATE: JANUARY 25, 1996':
      'DATA: 25 DE JANEIRO DE 1996',
    'CLASSIFICATION: DESTROYED — RECONSTRUCTED FROM SECTOR DUMP':
      'CLASSIFICAÇÃO: DESTRUÍDO — RECONSTRUÍDO A PARTIR DE DUMP DE SETOR',
    'OPERATION: COLHEITA (HARVEST)':
      'OPERAÇÃO: COLHEITA (HARVEST)',
    'ORIGIN: Recovery Zone Bravo, Varginha MG':
      'ORIGEM: Zona de Recuperação Bravo, Varginha MG',
    'DESTINATION: ESA Campinas — Hangar 4 (Restricted Wing)':
      'DESTINO: ESA Campinas — Hangar 4 (Ala Restrita)',
    'CARGO INVENTORY':
      'INVENTÁRIO DE CARGA',
    '  ITEM 001: Hull fragment, alloy unknown — 47kg':
      '  ITEM 001: Fragmento de casco, liga desconhecida — 47kg',
    '            STATUS: Sealed container, nitrogen atmosphere':
      '            STATUS: Contêiner selado, atmosfera de nitrogênio',
    '            NOTE: Material resists all cutting tools':
      '            NOTA: Material resiste a todas as ferramentas de corte',
    '  ITEM 002: Navigation array (presumed) — 12kg':
      '  ITEM 002: Arranjo de navegação (presumido) — 12kg',
    '            STATUS: Still emitting low-frequency signal':
      '            STATUS: Ainda emitindo sinal de baixa frequência',
    '            WARNING: Do not expose to direct sunlight':
      '            AVISO: Não expor à luz solar direta',
    '  ITEM 003: Propulsion debris, 3 fragments — 89kg total':
      '  ITEM 003: Destroços de propulsão, 3 fragmentos — 89kg total',
    '            STATUS: Radiation levels within tolerance':
      '            STATUS: Níveis de radiação dentro da tolerância',
    '            NOTE: Fragments reassemble if placed in proximity':
      '            NOTA: Fragmentos se remontam se colocados em proximidade',
    '  ITEM 004: Interior paneling samples — 8kg':
      '  ITEM 004: Amostras de painéis internos — 8kg',
    '            STATUS: Organic-metallic hybrid composition':
      '            STATUS: Composição híbrida orgânico-metálica',
    '  ITEM 005: Soil samples from impact zone — 15kg':
      '  ITEM 005: Amostras de solo da zona de impacto — 15kg',
    '            STATUS: Elevated isotope ratios confirmed':
      '            STATUS: Razões isotópicas elevadas confirmadas',
    'TRANSPORT PROTOCOL':
      'PROTOCOLO DE TRANSPORTE',
    '  Route: Varginha → Três Corações → Campinas (ESA)':
      '  Rota: Varginha → Três Corações → Campinas (ESA)',
    '  Convoy: 3 military trucks, unmarked':
      '  Comboio: 3 caminhões militares, sem identificação',
    '  Escort: 2nd Armored Battalion, no insignia':
      '  Escolta: 2º Batalhão Blindado, sem insígnia',
    '  Transit time: 6 hours (overnight, no stops)':
      '  Tempo de trânsito: 6 horas (noturno, sem paradas)',
    '  RECEIVING OFFICER: Col. [EXPUNGED]':
      '  OFICIAL RECEPTOR: Cel. [EXPURGADO]',
    '  STORAGE: Sublevel 2, Hangar 4, Climate-controlled vault':
      '  ARMAZENAMENTO: Subnível 2, Hangar 4, Cofre climatizado',
    'DISPOSITION NOTE':
      'NOTA DE DISPOSIÇÃO',
    '  This manifest was ordered destroyed on 01/28/1996.':
      '  Este manifesto foi ordenado destruído em 28/01/1996.',
    '  No official record of this transfer exists.':
      '  Nenhum registro oficial desta transferência existe.',
    '  All convoy personnel signed non-disclosure agreements.':
      '  Todo o pessoal do comboio assinou acordos de confidencialidade.',
    '  Material remains at ESA Campinas as of last audit.':
      '  Material permanece na ESA Campinas conforme última auditoria.',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — bio_containment_log_deleted.txt
    // ═══════════════════════════════════════════════════════════
    'BIOLOGICAL CONTAINMENT LOG — PURGED RECORD':
      'LOG DE CONTENÇÃO BIOLÓGICA — REGISTRO EXPURGADO',
    'SITE: TEMPORARY HOLDING FACILITY, HUMANITAS HOSPITAL':
      'LOCAL: INSTALAÇÃO DE DETENÇÃO TEMPORÁRIA, HOSPITAL HUMANITAS',
    'DATE: JANUARY 20-26, 1996':
      'DATA: 20-26 DE JANEIRO DE 1996',
    'CLASSIFICATION: OMEGA — MARKED FOR DESTRUCTION':
      'CLASSIFICAÇÃO: OMEGA — MARCADO PARA DESTRUIÇÃO',
    'SUBJECT REGISTRY':
      'REGISTRO DE SUJEITOS',
    '  BIO-A: Captured 20/01 at 15:42. Jardim Andere sector.':
      '  BIO-A: Capturado 20/01 às 15:42. Setor Jardim Andere.',
    '         Condition: Responsive. Vitals stable.':
      '         Condição: Responsivo. Sinais vitais estáveis.',
    '         Transferred to Site 7 on 22/01.':
      '         Transferido para Site 7 em 22/01.',
    '  BIO-B: Captured 20/01 at 16:15. Adjacent to BIO-A.':
      '  BIO-B: Capturado 20/01 às 16:15. Adjacente a BIO-A.',
    '         Condition: Agitated. Attempted non-acoustic signal.':
      '         Condição: Agitado. Tentou sinal não acústico.',
    '         Handlers reported headaches within 3m radius.':
      '         Operadores relataram dores de cabeça num raio de 3m.',
    '  BIO-C: Captured 22/01 at 02:30. Separate location.':
      '  BIO-C: Capturado 22/01 às 02:30. Localização separada.',
    '         Condition: Weakened. Declining vitals.':
      '         Condição: Debilitado. Sinais vitais em declínio.',
    '         Expired 24/01 at 04:17. Cause: Unknown.':
      '         Expirou 24/01 às 04:17. Causa: Desconhecida.',
    '         Remains transferred to pathology.':
      '         Restos transferidos para patologia.',
    'CONTAINMENT PROTOCOLS':
      'PROTOCOLOS DE CONTENÇÃO',
    '  - Electromagnetic shielding: ACTIVE (Faraday cage)':
      '  - Blindagem eletromagnética: ATIVA (gaiola de Faraday)',
    '  - Visual monitoring: 24-hour, 3 camera angles':
      '  - Monitoramento visual: 24 horas, 3 ângulos de câmera',
    '  - Direct contact: PROHIBITED without Level 4 clearance':
      '  - Contato direto: PROIBIDO sem autorização Nível 4',
    '  - Feeding: Subjects refuse all organic matter offered':
      '  - Alimentação: Sujeitos recusam toda matéria orgânica oferecida',
    '  - Communication: DO NOT ENGAGE. See PSI-COMM advisory.':
      '  - Comunicação: NÃO INTERAGIR. Consulte aviso PSI-COMM.',
    '  NOTE: All personnel exposed to BIO-B for >10 minutes':
      '  NOTA: Todo pessoal exposto a BIO-B por >10 minutos',
    '  must report to medical for neural baseline scan.':
      '  deve se apresentar ao médico para exame neural de referência.',
    'DELETION ORDER':
      'ORDEM DE EXCLUSÃO',
    '  This log was ordered purged on 01/30/1996.':
      '  Este log foi ordenado expurgado em 30/01/1996.',
    '  Official records state: "No biological material recovered."':
      '  Registros oficiais declaram: "Nenhum material biológico recuperado."',
    '  Hospital records re-coded as: "chemical spill response."':
      '  Registros do hospital recodificados como: "resposta a derramamento químico."',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — psi_analysis_classified.txt
    // ═══════════════════════════════════════════════════════════
    'PSI-COMM ANALYSIS — CLASSIFIED REPORT':
      'ANÁLISE PSI-COMM — RELATÓRIO CLASSIFICADO',
    'ANALYST: Dr. [NAME EXPUNGED]':
      'ANALISTA: Dr. [NOME EXPURGADO]',
    'DATE: JANUARY 27, 1996':
      'DATA: 27 DE JANEIRO DE 1996',
    'STATUS: DELETED FROM ALL DATABASES':
      'STATUS: DELETADO DE TODOS OS BANCOS DE DADOS',
    'SUBJECT: Non-acoustic communication patterns detected':
      'ASSUNTO: Padrões de comunicação não acústica detectados',
    'from specimens designated BIO-A and BIO-B.':
      'nos espécimes designados BIO-A e BIO-B.',
    'METHODOLOGY':
      'METODOLOGIA',
    '  EEG arrays placed at 1m, 3m, and 10m distances.':
      '  Arranjos de EEG posicionados a distâncias de 1m, 3m e 10m.',
    '  Control subjects (human volunteers) monitored simultaneously.':
      '  Sujeitos controle (voluntários humanos) monitorados simultaneamente.',
    '  Results: At distances ≤3m, human subjects exhibited':
      '  Resultados: Em distâncias ≤3m, sujeitos humanos exibiram',
    '  synchronized theta-wave patterns matching BIO-B emissions.':
      '  padrões de ondas theta sincronizados com emissões de BIO-B.',
    '  At 10m range, synchronization dropped to background levels.':
      '  A 10m de distância, a sincronização caiu para níveis de fundo.',
    'KEY FINDINGS':
      'DESCOBERTAS PRINCIPAIS',
    '  1. TELEPATHIC CAPABILITY CONFIRMED':
      '  1. CAPACIDADE TELEPÁTICA CONFIRMADA',
    '     BIO-B demonstrates directed neural transmission.':
      '     BIO-B demonstra transmissão neural direcionada.',
    '     Content appears conceptual, not linguistic.':
      '     Conteúdo aparenta ser conceitual, não linguístico.',
    '     Receivers report "knowing" rather than "hearing."':
      '     Receptores relatam "saber" em vez de "ouvir."',
    '  2. SCOUT FUNCTION CONFIRMED':
      '  2. FUNÇÃO DE RECONHECIMENTO CONFIRMADA',
    '     Transmitted imagery includes topographical surveys,':
      '     Imagens transmitidas incluem levantamentos topográficos,',
    '     population density maps, and infrastructure schemas.':
      '     mapas de densidade populacional e esquemas de infraestrutura.',
    '     These beings were CATALOGUING our environment.':
      '     Estes seres estavam CATALOGANDO nosso ambiente.',
    '  3. TEMPORAL REFERENCE':
      '  3. REFERÊNCIA TEMPORAL',
    '     Recurring pattern in psi-comm output translates to':
      '     Padrão recorrente na saída psi-comm traduz-se em',
    '     cyclical temporal reference: "thirty rotations."':
      '     referência temporal cíclica: "trinta rotações."',
    '     Given context (1996 baseline), points to year 2026.':
      '     Dado o contexto (referência de 1996), aponta para o ano 2026.',
    '  4. NON-HOSTILE DISPOSITION':
      '  4. DISPOSIÇÃO NÃO HOSTIL',
    '     No aggressive psi-comm detected. Subjects appear':
      '     Nenhuma psi-comm agressiva detectada. Sujeitos parecem',
    '     to regard capture as expected, even planned.':
      '     considerar a captura como esperada, até planejada.',
    '     Assessment: Reconnaissance bio-constructs, not soldiers.':
      '     Avaliação: Bioconstrutos de reconhecimento, não soldados.',
    'CLASSIFICATION NOTE':
      'NOTA DE CLASSIFICAÇÃO',
    '  This report was suppressed on 02/01/1996.':
      '  Este relatório foi suprimido em 01/02/1996.',
    '  Official position: "No anomalous communication detected."':
      '  Posição oficial: "Nenhuma comunicação anômala detectada."',
    '  All EEG data archived to off-site cold storage.':
      '  Todos os dados de EEG arquivados em armazenamento frio externo.',
    '  Personal addendum: What I have witnessed changes everything.':
      '  Adendo pessoal: O que testemunhei muda tudo.',
    '  These are not animals. They are not machines. They are scouts.':
      '  Não são animais. Não são máquinas. São batedores.',
    '  And they accomplished their mission before we caught them.':
      '  E cumpriram sua missão antes de os capturarmos.',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — foreign_liaison_cable_deleted.txt
    // ═══════════════════════════════════════════════════════════
    'DIPLOMATIC CABLE — DELETED':
      'CABO DIPLOMÁTICO — DELETADO',
    'ORIGIN: U.S. EMBASSY, BRASÍLIA':
      'ORIGEM: EMBAIXADA DOS EUA, BRASÍLIA',
    'DESTINATION: LANGLEY, VIRGINIA':
      'DESTINO: LANGLEY, VIRGÍNIA',
    'DATE: JANUARY 23, 1996':
      'DATA: 23 DE JANEIRO DE 1996',
    'CLASSIFICATION: DESTROYED — RECOVERED FROM BACKUP TAPE':
      'CLASSIFICAÇÃO: DESTRUÍDO — RECUPERADO DE FITA DE BACKUP',
    'PRIORITY: FLASH':
      'PRIORIDADE: FLASH',
    'SUBJECT: VARGINHA RECOVERY — FOREIGN ASSET DISPOSITION':
      'ASSUNTO: RECUPERAÇÃO DE VARGINHA — DISPOSIÇÃO DE ATIVOS ESTRANGEIROS',
    'MESSAGE BODY':
      'CORPO DA MENSAGEM',
    '  Confirm three (3) biological specimens secured by':
      '  Confirmam-se três (3) espécimes biológicos assegurados por',
    '  Brazilian military. One (1) deceased, two (2) viable.':
      '  militares brasileiros. Um (1) falecido, dois (2) viáveis.',
    '  Per Protocol ECHO standing orders, request immediate':
      '  Conforme ordens permanentes do Protocolo ECHO, solicita-se',
    '  deployment of technical assessment team from Langley.':
      '  destacamento imediato de equipe de avaliação técnica de Langley.',
    '  Brazilian liaison (Col. [REDACTED]) cooperative.':
      '  Enlace brasileiro (Cel. [CENSURADO]) cooperativo.',
    '  Requests shared analysis in exchange for specimen access.':
      '  Solicita análise compartilhada em troca de acesso aos espécimes.',
    '  Tel Aviv also requesting observer status. Recommend':
      '  Tel Aviv também solicita status de observador. Recomenda-se',
    '  DENY per compartmentalization protocols.':
      '  NEGAR conforme protocolos de compartimentação.',
    '  NOTE: Brazilian Air Force already scrambled interceptors':
      '  NOTA: Força Aérea Brasileira já despachou interceptadores',
    '  on 01/13 per NORAD advisory. They are fully aware.':
      '  em 13/01 conforme aviso do NORAD. Estão plenamente cientes.',
    '  Deniability window is closing.':
      '  A janela de negação plausível está se fechando.',
    'RESPONSE (LANGLEY)':
      'RESPOSTA (LANGLEY)',
    '  APPROVED: Technical team en route. ETA 48 hours.':
      '  APROVADO: Equipe técnica a caminho. Tempo estimado 48 horas.',
    '  Brazilian custody of viable specimens is TEMPORARY.':
      '  Custódia brasileira dos espécimes viáveis é TEMPORÁRIA.',
    '  Full transfer to US custody per bilateral agreement':
      '  Transferência total para custódia americana conforme acordo bilateral',
    '  (classified annex, 1988 defense cooperation treaty).':
      '  (anexo classificado, tratado de cooperação de defesa de 1988).',
    '  Coordinate with NSA for signals intelligence sweep.':
      '  Coordenar com NSA para varredura de inteligência de sinais.',
    '  All civilian communications in 50km radius to be':
      '  Todas as comunicações civis num raio de 50km devem ser',
    '  monitored for 90 days.':
      '  monitoradas por 90 dias.',
    '  Regarding Tel Aviv: DENY. This remains bilateral.':
      '  Sobre Tel Aviv: NEGAR. Isto permanece bilateral.',
    '  Cable destroyed per standard diplomatic protocol.':
      '  Cabo destruído conforme protocolo diplomático padrão.',
    '  No record exists in FOIA-accessible databases.':
      '  Nenhum registro existe em bancos de dados acessíveis via FOIA.',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — convergence_model_draft.txt
    // ═══════════════════════════════════════════════════════════
    'CONVERGENCE MODEL — DRAFT (PURGED)':
      'MODELO DE CONVERGÊNCIA — RASCUNHO (EXPURGADO)',
    'PROJECT SEED — TEMPORAL ANALYSIS DIVISION':
      'PROJETO SEED — DIVISÃO DE ANÁLISE TEMPORAL',
    'DATE: FEBRUARY 3, 1996':
      'DATA: 3 DE FEVEREIRO DE 1996',
    'TO: Director, Special Programs Division':
      'PARA: Diretor, Divisão de Programas Especiais',
    'FROM: Temporal Analysis Unit':
      'DE: Unidade de Análise Temporal',
    'RE: 2026 Convergence Window — Revised Assessment':
      'REF: Janela de Convergência 2026 — Avaliação Revisada',
    'SUMMARY':
      'RESUMO',
    '  Analysis of psi-comm fragments from BIO-A/B, combined':
      '  Análise de fragmentos psi-comm de BIO-A/B, combinada',
    '  with signal data from the recovered navigation array,':
      '  com dados de sinais do arranjo de navegação recuperado,',
    '  yields the following convergence model:':
      '  resulta no seguinte modelo de convergência:',
    '  ACTIVATION WINDOW: September 2026 (±2 months)':
      '  JANELA DE ATIVAÇÃO: Setembro de 2026 (±2 meses)',
    '  The "thirty rotations" reference in telepathic output':
      '  A referência "trinta rotações" na saída telepática',
    '  maps to 30 solar years from the 1996 baseline event.':
      '  corresponde a 30 anos solares a partir do evento de referência de 1996.',
    'MODEL PARAMETERS':
      'PARÂMETROS DO MODELO',
    '  Phase 1: RECONNAISSANCE (Active — 1996)':
      '  Fase 1: RECONHECIMENTO (Ativo — 1996)',
    '    Scout bio-constructs deployed to survey target.':
      '    Bioconstrutos batedores destacados para levantar o alvo.',
    '    Data transmitted via psi-band to external receiver.':
      '    Dados transmitidos via banda-psi para receptor externo.',
    '  Phase 2: SEEDING (Passive — 1996-2026)':
      '  Fase 2: SEMEADURA (Passiva — 1996-2026)',
    '    Biological material left in custody triggers gradual':
      '    Material biológico deixado em custódia desencadeia',
    '    neurological sensitization in exposed personnel.':
      '    sensibilização neurológica gradual no pessoal exposto.',
    '    "Carriers" unknowingly propagate signal receptivity.':
      '    "Portadores" propagam inconscientemente receptividade ao sinal.',
    '  Phase 3: TRANSITION (Projected — 2026)':
      '  Fase 3: TRANSIÇÃO (Projetada — 2026)',
    '    Full-spectrum activation of seeded neural pathways.':
      '    Ativação de espectro completo das vias neurais semeadas.',
    '    Nature of transition remains UNKNOWN.':
      '    A natureza da transição permanece DESCONHECIDA.',
    '    Best case: Communication channel opens.':
      '    Melhor cenário: Canal de comunicação se abre.',
    '    Worst case: [DATA EXPUNGED]':
      '    Pior cenário: [DADOS EXPURGADOS]',
    'DISPOSITION':
      'DISPOSIÇÃO',
    '  This model was rejected by oversight committee.':
      '  Este modelo foi rejeitado pelo comitê de supervisão.',
    '  Official position: "2026 references are meaningless.':
      '  Posição oficial: "Referências a 2026 são sem sentido.',
    '  Specimen neural output is random noise."':
      '  A saída neural dos espécimes é ruído aleatório."',
    '  This document will not survive the next purge cycle.':
      '  Este documento não sobreviverá ao próximo ciclo de expurgo.',
    '  Personal note: They can deny it all they want.':
      '  Nota pessoal: Podem negar o quanto quiserem.',
    '  The math doesn\'t lie. Something is coming.':
      '  A matemática não mente. Algo está vindo.',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILES — UFO74 REACTIONS
    // ═══════════════════════════════════════════════════════════
    'UFO74: shit, this is heavy kid... but not our mission.':
      'UFO74: caralho, isso é pesado moleque... mas não é nossa missão.',
    '       lets move on.':
      '       vamos em frente.',
    'UFO74: damn. theyre into everything.':
      'UFO74: caralho. eles tão metidos em tudo.',
    '       but focus — we have bigger fish.':
      '       mas foca — temos peixes maiores.',
    'UFO74: ha. humans and their schemes.':
      'UFO74: ha. humanos e seus esquemas.',
    '       stay on target.':
      '       mantém o foco.',
    'UFO74: interesting... but not why were here.':
      'UFO74: interessante... mas não é por isso que estamos aqui.',
    '       dont get distracted.':
      '       não se distraia.',
    'UFO74: yeah, ive seen this before.':
      'UFO74: é, já vi isso antes.',
    '       not our problem today.':
      '       não é nosso problema hoje.',
    'UFO74: heavy stuff. file it under "later."':
      'UFO74: papo pesado. arquiva em "depois."',
    '       we have work to do.':
      '       temos trabalho a fazer.',
    'UFO74: huh. they really do this stuff.':
      'UFO74: hm. eles realmente fazem isso.',
    '       but we got our own problems kid.':
      '       mas a gente tem nossos próprios problemas moleque.',
    'UFO74: humans... always scheming.':
      'UFO74: humanos... sempre tramando.',
    '       eyes on the prize.':
      '       olho no prêmio.',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 1 — ECONOMIC TRANSITION MEMO
    // ═══════════════════════════════════════════════════════════
    'INTERNAL MEMORANDUM — ECONOMIC RESEARCH DIVISION':
      'MEMORANDO INTERNO — DIVISÃO DE PESQUISA ECONÔMICA',
    'DATE: 08-NOV-1995':
      'DATA: 08-NOV-1995',
    'CLASSIFICATION: INTERNAL USE ONLY':
      'CLASSIFICAÇÃO: SOMENTE USO INTERNO',
    'TO: Deputy Director, Strategic Planning':
      'PARA: Diretor Adjunto, Planejamento Estratégico',
    'FROM: Economic Futures Working Group':
      'DE: Grupo de Trabalho de Futuros Econômicos',
    'RE: Decentralized Currency Prototype — Phase II Assessment':
      'REF: Protótipo de Moeda Descentralizada — Avaliação Fase II',
    'Per your request, we have completed preliminary testing of':
      'Conforme solicitado, completamos os testes preliminares do',
    'the distributed ledger monetary system ("Project COIN").':
      'sistema monetário de registro distribuído ("Projeto COIN").',
    'KEY FINDINGS:':
      'ACHADOS PRINCIPAIS:',
    '  1. The cryptographic consensus mechanism functions as':
      '  1. O mecanismo de consenso criptográfico funciona como',
    '     designed. Nodes achieve agreement without central':
      '     projetado. Os nós alcançam consenso sem autoridade',
    '     authority within acceptable latency parameters.':
      '     central dentro de parâmetros de latência aceitáveis.',
    '  2. Transaction anonymity meets intelligence community':
      '  2. O anonimato das transações atende aos requisitos da',
    '     requirements for untraceable fund transfers.':
      '     comunidade de inteligência para transferências não rastreáveis.',
    '  3. Energy consumption remains a concern. Current mining':
      '  3. O consumo de energia continua sendo uma preocupação. Os algoritmos',
    '     algorithms require significant computational resources.':
      '     de mineração atuais exigem recursos computacionais significativos.',
    'RECOMMENDATION:':
      'RECOMENDAÇÃO:',
    '  Continue research but delay public deployment. The':
      '  Continuar a pesquisa mas adiar a implantação pública. A',
    '  technology is premature for civilian adoption but shows':
      '  tecnologia é prematura para adoção civil mas mostra',
    '  promise for covert operations funding channels.':
      '  potencial para canais de financiamento de operações clandestinas.',
    '  Suggest revisiting for public release in 10-15 years':
      '  Sugerimos reavaliar para lançamento público em 10-15 anos',
    '  when infrastructure can support wider adoption.':
      '  quando a infraestrutura puder suportar adoção mais ampla.',
    '  [signature]':
      '  [assinatura]',
    '  S.N.':
      '  S.N.',
    '  Lead Cryptographer, Economic Futures':
      '  Criptógrafo Líder, Futuros Econômicos',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 2 — APOLLO MEDIA GUIDELINES
    // ═══════════════════════════════════════════════════════════
    'PUBLIC AFFAIRS GUIDANCE — LUNAR PROGRAM DOCUMENTATION':
      'ORIENTAÇÃO DE ASSUNTOS PÚBLICOS — DOCUMENTAÇÃO DO PROGRAMA LUNAR',
    'DOCUMENT: PA-1969-07 (DECLASSIFIED EXCERPT)':
      'DOCUMENTO: PA-1969-07 (TRECHO DESCLASSIFICADO)',
    'ORIGINAL DATE: 14-JUL-1969':
      'DATA ORIGINAL: 14-JUL-1969',
    'SUBJECT: Handling Visual Inconsistencies in Mission Footage':
      'ASSUNTO: Tratamento de Inconsistências Visuais em Filmagens da Missão',
    'BACKGROUND:':
      'CONTEXTO:',
    '  During post-production review of lunar surface footage,':
      '  Durante a revisão de pós-produção das filmagens da superfície lunar,',
    '  technical staff identified several lighting anomalies':
      '  a equipe técnica identificou diversas anomalias de iluminação',
    '  that may generate public confusion.':
      '  que podem gerar confusão pública.',
    'IDENTIFIED ISSUES:':
      'PROBLEMAS IDENTIFICADOS:',
    '  - Shadow direction variance in Frames 1247-1289':
      '  - Variação na direção das sombras nos Quadros 1247-1289',
    '  - Multiple apparent light sources in EVA footage':
      '  - Múltiplas fontes de luz aparentes nas filmagens EVA',
    '  - Crosshair positioning behind foreground objects':
      '  - Posicionamento da retícula atrás de objetos em primeiro plano',
    '  - Flag movement without atmospheric conditions':
      '  - Movimento da bandeira sem condições atmosféricas',
    'GUIDANCE:':
      'ORIENTAÇÃO:',
    '  1. Do NOT proactively address these inconsistencies.':
      '  1. NÃO abordar proativamente essas inconsistências.',
    '  2. If questioned, attribute anomalies to:':
      '  2. Se questionado, atribuir anomalias a:',
    '     a) Camera lens artifacts':
      '     a) Artefatos da lente da câmera',
    '     b) Reflected light from lunar surface':
      '     b) Luz refletida da superfície lunar',
    '     c) Electromagnetic interference with equipment':
      '     c) Interferência eletromagnética nos equipamentos',
    '  3. Under NO circumstances acknowledge that backup':
      '  3. Sob NENHUMA circunstância reconhecer que filmagens',
    '     footage was prepared at [REDACTED] facility.':
      '     de backup foram preparadas na instalação [REDIGIDO].',
    '  4. Emphasize mission success narrative over technical':
      '  4. Enfatizar a narrativa de sucesso da missão sobre detalhes',
    '     details of visual documentation.':
      '     técnicos da documentação visual.',
    'NOTE: This guidance supersedes previous directives.':
      'NOTA: Esta orientação substitui diretivas anteriores.',
    'APPROVED BY: DIR. COMMUNICATIONS':
      'APROVADO POR: DIR. COMUNICAÇÕES',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 3 — WEATHER PATTERN INTERVENTION
    // ═══════════════════════════════════════════════════════════
    'PROJECT CIRRUS — OPERATIONAL LOG':
      'PROJETO CIRRUS — LOG OPERACIONAL',
    'CLASSIFICATION: SENSITIVE':
      'CLASSIFICAÇÃO: SENSÍVEL',
    'PERIOD: OCT 1995 - JAN 1996':
      'PERÍODO: OUT 1995 - JAN 1996',
    '12-OCT-1995 0600':
      '12-OUT-1995 0600',
    '  Aerosol dispersal flight ALT-1174 completed.':
      '  Voo de dispersão de aerossol ALT-1174 concluído.',
    '  Payload: 4.2 metric tons barium sulfate compound':
      '  Carga: 4,2 toneladas métricas de composto de sulfato de bário',
    '  Target: Atlantic hurricane formation zone':
      '  Alvo: Zona de formação de furacões do Atlântico',
    '  Altitude: 38,000 ft':
      '  Altitude: 38.000 pés',
    '  Duration: 6.4 hours':
      '  Duração: 6,4 horas',
    '15-OCT-1995 1400':
      '15-OUT-1995 1400',
    '  Post-dispersal analysis indicates successful seeding.':
      '  Análise pós-dispersão indica semeadura bem-sucedida.',
    '  Projected storm TD-17 failed to organize.':
      '  A tempestade projetada TD-17 não se organizou.',
    '  NOTE: Unintended precipitation in [REDACTED] region.':
      '  NOTA: Precipitação não intencional na região [REDIGIDO].',
    '23-NOV-1995 0800':
      '23-NOV-1995 0800',
    '  Flight ALT-1198 encountered mechanical issues.':
      '  Voo ALT-1198 encontrou problemas mecânicos.',
    '  Payload released early over continental area.':
      '  Carga liberada prematuramente sobre área continental.',
    '  INCIDENT REPORT FILED. Cover story: contrail testing.':
      '  RELATÓRIO DE INCIDENTE REGISTRADO. História de cobertura: teste de rastro de condensação.',
    '07-DEC-1995 1100':
      '07-DEZ-1995 1100',
    '  Side effect observation: Increased respiratory':
      '  Observação de efeito colateral: Aumento de queixas',
    '  complaints in dispersal corridor populations.':
      '  respiratórias nas populações do corredor de dispersão.',
    '  Recommend adjusting compound mixture for Q1 1996.':
      '  Recomenda-se ajustar a mistura do composto para Q1 1996.',
    '14-JAN-1996 0900':
      '14-JAN-1996 0900',
    '  New directive received: Expand program to include':
      '  Nova diretiva recebida: Expandir o programa para incluir',
    '  reflective particulate testing for solar management.':
      '  testes de partículas reflexivas para gestão solar.',
    '  Aluminum oxide compounds approved for trial.':
      '  Compostos de óxido de alumínio aprovados para teste.',
    'END LOG — NEXT REVIEW: 01-APR-1996':
      'FIM DO LOG — PRÓXIMA REVISÃO: 01-ABR-1996',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 4 — BEHAVIORAL COMPLIANCE STUDY
    // ═══════════════════════════════════════════════════════════
    'CONSUMER BEHAVIOR RESEARCH — ACOUSTIC INFLUENCE STUDY':
      'PESQUISA DE COMPORTAMENTO DO CONSUMIDOR — ESTUDO DE INFLUÊNCIA ACÚSTICA',
    'PROJECT: TEMPO':
      'PROJETO: TEMPO',
    'DATE: Q4 1995 FINAL REPORT':
      'DATA: RELATÓRIO FINAL Q4 1995',
    'STUDY OVERVIEW:':
      'VISÃO GERAL DO ESTUDO:',
    '  In partnership with [REDACTED] retail chains, this study':
      '  Em parceria com redes varejistas [REDIGIDO], este estudo',
    '  evaluated the effect of ambient audio parameters on':
      '  avaliou o efeito de parâmetros de áudio ambiente no',
    '  consumer behavior patterns.':
      '  padrões de comportamento do consumidor.',
    'METHODOLOGY:':
      'METODOLOGIA:',
    '  - 847 retail locations participated':
      '  - 847 locais de varejo participaram',
    '  - Music tempo varied from 60-120 BPM across test groups':
      '  - Ritmo musical variado de 60-120 BPM entre grupos de teste',
    '  - Subliminal audio tones embedded at 17.5 Hz':
      '  - Tons de áudio subliminar incorporados a 17,5 Hz',
    '  - Control group received standard muzak programming':
      '  - Grupo controle recebeu programação muzak padrão',
    'FINDINGS:':
      'ACHADOS:',
    '  1. TEMPO CORRELATION':
      '  1. CORRELAÇÃO DE RITMO',
    '     - 72 BPM: 18% increase in browsing duration':
      '     - 72 BPM: aumento de 18% na duração de navegação',
    '     - 108 BPM: 23% increase in purchase velocity':
      '     - 108 BPM: aumento de 23% na velocidade de compra',
    '     - 60 BPM: Measurable increase in high-margin purchases':
      '     - 60 BPM: Aumento mensurável em compras de alta margem',
    '  2. SUBLIMINAL TONE EFFECTS':
      '  2. EFEITOS DE TOM SUBLIMINAR',
    '     - 17.5 Hz baseline: Elevated stress markers':
      '     - 17,5 Hz referência: Marcadores de estresse elevados',
    '     - 12 Hz modification: Reduced price sensitivity':
      '     - Modificação 12 Hz: Sensibilidade a preço reduzida',
    '     - Combined with verbal suggestions: Inconclusive':
      '     - Combinado com sugestões verbais: Inconclusivo',
    '  3. OPTIMAL CONFIGURATION':
      '  3. CONFIGURAÇÃO ÓTIMA',
    '     - Morning: 108 BPM (urgency)':
      '     - Manhã: 108 BPM (urgência)',
    '     - Afternoon: 72 BPM (extended browsing)':
      '     - Tarde: 72 BPM (navegação estendida)',
    '     - Pre-closing: 120 BPM (clear out)':
      '     - Pré-fechamento: 120 BPM (esvaziamento)',
    '  Implement Phase II testing in food service environments.':
      '  Implementar testes da Fase II em ambientes de serviço alimentício.',
    '  Preliminary data suggests eating pace modification':
      '  Dados preliminares sugerem que a modificação do ritmo alimentar',
    '  achievable through targeted frequency patterns.':
      '  é alcançável através de padrões de frequência direcionados.',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 5 — INFRASTRUCTURE BLACKOUT SIMULATION
    // ═══════════════════════════════════════════════════════════
    'EXERCISE DARK WINTER — SIMULATION RESULTS':
      'EXERCÍCIO INVERNO NEGRO — RESULTADOS DA SIMULAÇÃO',
    'CLASSIFICATION: RESTRICTED':
      'CLASSIFICAÇÃO: RESTRITA',
    'DATE: SEP 1995':
      'DATA: SET 1995',
    'EXERCISE OBJECTIVE:':
      'OBJETIVO DO EXERCÍCIO:',
    '  Evaluate civil response to extended grid failure with':
      '  Avaliar resposta civil a falha prolongada da rede com',
    '  concurrent communications infrastructure collapse.':
      '  colapso simultâneo da infraestrutura de comunicações.',
    'SIMULATION PARAMETERS:':
      'PARÂMETROS DA SIMULAÇÃO:',
    '  - Duration: 72 hours (extended to 168 hours)':
      '  - Duração: 72 horas (estendido para 168 horas)',
    '  - Population centers: 3 metropolitan areas':
      '  - Centros populacionais: 3 áreas metropolitanas',
    '  - Communications: Landline and cellular disabled':
      '  - Comunicações: Telefonia fixa e celular desativadas',
    '  - Emergency services: Degraded capacity (40%)':
      '  - Serviços de emergência: Capacidade degradada (40%)',
    'PHASE RESULTS:':
      'RESULTADOS POR FASE:',
    '  0-12 HOURS:':
      '  0-12 HORAS:',
    '    - Civil order maintained':
      '    - Ordem civil mantida',
    '    - Emergency calls exceeded capacity by hour 4':
      '    - Chamadas de emergência excederam capacidade na hora 4',
    '    - Fuel station queues exceeded 2 miles':
      '    - Filas em postos de combustível excederam 3 km',
    '  12-48 HOURS:':
      '  12-48 HORAS:',
    '    - Significant increase in property crime':
      '    - Aumento significativo em crimes contra patrimônio',
    '    - Hospital generators failed in 2 facilities':
      '    - Geradores hospitalares falharam em 2 instalações',
    '    - Water pressure loss in elevated areas':
      '    - Perda de pressão de água em áreas elevadas',
    '  48-168 HOURS:':
      '  48-168 HORAS:',
    '    - Civil order breakdown in [REDACTED] sector':
      '    - Colapso da ordem civil no setor [REDIGIDO]',
    '    - National Guard deployment simulated at hour 96':
      '    - Destacamento da Guarda Nacional simulado na hora 96',
    '    - Food supply chain: Total collapse by hour 120':
      '    - Cadeia de suprimento alimentar: Colapso total na hora 120',
    'KEY FINDING:':
      'ACHADO PRINCIPAL:',
    '  Without communication infrastructure, civil order':
      '  Sem infraestrutura de comunicação, a ordem civil',
    '  degrades to critical level within 72 hours.':
      '  degrada ao nível crítico dentro de 72 horas.',
    '  Information control is essential for stability.':
      '  Controle da informação é essencial para estabilidade.',
    '  Develop backup communication protocols for authorities.':
      '  Desenvolver protocolos de comunicação de backup para autoridades.',
    '  Civilian population should NOT be informed of grid':
      '  A população civil NÃO deve ser informada sobre a',
    '  vulnerability to prevent preemptive panic.':
      '  vulnerabilidade da rede para prevenir pânico preventivo.',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 6 — AVIAN TRACKING PROGRAM
    // ═══════════════════════════════════════════════════════════
    'CONTINENTAL AVIAN SURVEILLANCE NETWORK':
      'REDE CONTINENTAL DE VIGILÂNCIA AVIÁRIA',
    'QUARTERLY DEPLOYMENT REPORT — Q4 1995':
      'RELATÓRIO TRIMESTRAL DE IMPLANTAÇÃO — Q4 1995',
    'UNIT_ID,SPECIES_COVER,REGION,BATTERY_LIFE,PAYLOAD':
      'ID_UNIDADE,ESPÉCIE_COBERTURA,REGIÃO,VIDA_BATERIA,CARGA',
    'DEPLOYMENT NOTES:':
      'NOTAS DE IMPLANTAÇÃO:',
    '  - Q4 migration routes successfully tracked':
      '  - Rotas migratórias Q4 rastreadas com sucesso',
    '  - Signal relay coverage: 94.2% continental':
      '  - Cobertura de retransmissão de sinal: 94,2% continental',
    '  - Urban density exceeds rural by factor of 8.4':
      '  - Densidade urbana excede rural por fator de 8,4',
    '  - Maintenance disguised as "wildlife research"':
      '  - Manutenção disfarçada como "pesquisa de vida selvagem"',
    'ANOMALY LOG:':
      'LOG DE ANOMALIAS:',
    '  - Unit AV-3201 recovered by civilian (neutralized)':
      '  - Unidade AV-3201 recuperada por civil (neutralizada)',
    '  - Unit AV-4089 battery failure mid-flight':
      '  - Unidade AV-4089 falha de bateria em pleno voo',
    '  - Unit AV-5847 behavioral deviation (investigating)':
      '  - Unidade AV-5847 desvio comportamental (investigando)',
    'NEXT DEPLOYMENT: 847 units scheduled Q1 1996':
      'PRÓXIMA IMPLANTAÇÃO: 847 unidades agendadas Q1 1996',
    'COVER STORY: Migratory pattern research funding':
      'HISTÓRIA DE COBERTURA: Financiamento de pesquisa de padrões migratórios',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 7 — CONSUMER DEVICE LISTENING
    // ═══════════════════════════════════════════════════════════
    'TECHNICAL ASSESSMENT — PASSIVE AUDIO COLLECTION':
      'AVALIAÇÃO TÉCNICA — COLETA PASSIVA DE ÁUDIO',
    'PROJECT: WHISPER':
      'PROJETO: WHISPER',
    'DATE: 19-DEC-1995':
      'DATA: 19-DEZ-1995',
    'TO: Technical Collection Division':
      'PARA: Divisão de Coleta Técnica',
    'FROM: Consumer Electronics Liaison':
      'DE: Ligação com Eletrônicos de Consumo',
    'RE: Ambient Audio Capability in Home Devices':
      'REF: Capacidade de Áudio Ambiente em Dispositivos Domésticos',
    '  Working with [REDACTED] manufacturers, we have':
      '  Trabalhando com fabricantes [REDIGIDO], conseguimos',
    '  successfully embedded passive microphone arrays in':
      '  incorporar com sucesso conjuntos de microfones passivos nas',
    '  the following consumer electronics categories:':
      '  seguintes categorias de eletrônicos de consumo:',
    '  - Television receivers (beta testing, 12 models)':
      '  - Receptores de televisão (testes beta, 12 modelos)',
    '  - Cable decoder boxes (full deployment ready)':
      '  - Decodificadores de TV a cabo (prontos para implantação total)',
    '  - Answering machines (limited deployment)':
      '  - Secretárias eletrônicas (implantação limitada)',
    '  - Clock radios (prototype phase)':
      '  - Rádios-relógio (fase de protótipo)',
    'CAPABILITIES:':
      'CAPACIDADES:',
    '  - Continuous ambient audio capture':
      '  - Captura contínua de áudio ambiente',
    '  - Keyword activation for priority recording':
      '  - Ativação por palavra-chave para gravação prioritária',
    '  - Emotional distress pattern detection (experimental)':
      '  - Detecção de padrão de angústia emocional (experimental)',
    '  - Data burst transmission during off-peak hours':
      '  - Transmissão de dados em rajada durante horários fora de pico',
    'PRIVACY CONCERNS:':
      'PREOCUPAÇÕES COM PRIVACIDADE:',
    '  Legal has advised that current wiretap statutes':
      '  O jurídico informou que os estatutos atuais de escuta',
    '  do not explicitly cover ambient collection from':
      '  não cobrem explicitamente a coleta ambiente de',
    '  voluntarily purchased consumer devices.':
      '  dispositivos de consumo adquiridos voluntariamente.',
    '  Recommend maintaining this legal ambiguity.':
      '  Recomenda-se manter esta ambiguidade jurídica.',
    'NEXT PHASE:':
      'PRÓXIMA FASE:',
    '  Expand to cordless telephone base stations.':
      '  Expandir para estações base de telefones sem fio.',
    '  Future integration with "smart home" concepts':
      '  Integração futura com conceitos de "casa inteligente"',
    '  currently in development at [REDACTED] labs.':
      '  atualmente em desenvolvimento nos laboratórios [REDIGIDO].',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 8 — ARCHIVAL PHOTO REPLACEMENT
    // ═══════════════════════════════════════════════════════════
    'NATIONAL ARCHIVES — DOCUMENT MANAGEMENT DIRECTIVE':
      'ARQUIVOS NACIONAIS — DIRETIVA DE GESTÃO DE DOCUMENTOS',
    'NOTICE: DMD-1995-47':
      'AVISO: DMD-1995-47',
    'DATE: 03-OCT-1995':
      'DATA: 03-OUT-1995',
    'SUBJECT: Historical Image Archive Modernization':
      'ASSUNTO: Modernização do Arquivo de Imagens Históricas',
    'DIRECTIVE:':
      'DIRETIVA:',
    '  As part of our digital preservation initiative, all':
      '  Como parte de nossa iniciativa de preservação digital, todos os',
    '  historical photographic records are being converted':
      '  registros fotográficos históricos estão sendo convertidos',
    '  to digital format using the MASTER CLEAN protocol.':
      '  para formato digital usando o protocolo MASTER CLEAN.',
    'PROCEDURE:':
      'PROCEDIMENTO:',
    '  1. Original photographs scanned at high resolution':
      '  1. Fotografias originais digitalizadas em alta resolução',
    '  2. Digital restoration applied per Guidelines Appendix C':
      '  2. Restauração digital aplicada conforme Apêndice C das Diretrizes',
    '  3. "Cleaned master versions" replace originals in archive':
      '  3. "Versões master limpas" substituem originais no arquivo',
    '  4. Original prints transferred to [REDACTED] facility':
      '  4. Cópias originais transferidas para instalação [REDIGIDO]',
    'RESTORATION GUIDELINES (EXCERPT):':
      'DIRETRIZES DE RESTAURAÇÃO (TRECHO):',
    '  - Remove inadvertent civilian faces (privacy)':
      '  - Remover rostos civis inadvertidos (privacidade)',
    '  - Correct lighting inconsistencies':
      '  - Corrigir inconsistências de iluminação',
    '  - Standardize official personnel positioning':
      '  - Padronizar posicionamento de pessoal oficial',
    '  - Eliminate background elements causing "confusion"':
      '  - Eliminar elementos de fundo causando "confusão"',
    'SPECIAL HANDLING:':
      'TRATAMENTO ESPECIAL:',
    '  Images flagged in Categories 7-12 require review by':
      '  Imagens sinalizadas nas Categorias 7-12 requerem revisão pelo',
    '  Historical Accuracy Committee before digitization.':
      '  Comitê de Precisão Histórica antes da digitalização.',
    '  These include:':
      '  Incluem:',
    '    - Political figures in "inconsistent" contexts':
      '    - Figuras políticas em contextos "inconsistentes"',
    '    - Military operations with "unclear" narratives':
      '    - Operações militares com narrativas "obscuras"',
    '    - Events with "disputed" official records':
      '    - Eventos com registros oficiais "disputados"',
    'NOTE: This process is administrative only.':
      'NOTA: Este processo é apenas administrativo.',
    '      No historical record is being altered.':
      '      Nenhum registro histórico está sendo alterado.',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 9 — EDUCATION CURRICULUM REVISION
    // ═══════════════════════════════════════════════════════════
    'CURRICULUM ADVISORY COMMITTEE — WORKING NOTES':
      'COMITÊ CONSULTIVO DE CURRÍCULO — NOTAS DE TRABALHO',
    'MEETING: 14-AUG-1995':
      'REUNIÃO: 14-AGO-1995',
    'CLASSIFICATION: INTERNAL':
      'CLASSIFICAÇÃO: INTERNA',
    'ATTENDEES: [REDACTED]':
      'PARTICIPANTES: [REDIGIDO]',
    'AGENDA ITEM 3: Historical Narrative Simplification':
      'ITEM DA PAUTA 3: Simplificação da Narrativa Histórica',
    'DISCUSSION SUMMARY:':
      'RESUMO DA DISCUSSÃO:',
    '  Committee reviewed proposals for streamlining historical':
      '  Comitê revisou propostas para simplificar o conteúdo',
    '  content in secondary education materials.':
      '  histórico nos materiais do ensino médio.',
    'KEY RECOMMENDATIONS:':
      'RECOMENDAÇÕES PRINCIPAIS:',
    '  1. Complex geopolitical contexts should be reduced to':
      '  1. Contextos geopolíticos complexos devem ser reduzidos a',
    '     clear "protagonist/antagonist" frameworks.':
      '     estruturas claras de "protagonista/antagonista".',
    '  2. Events with multiple valid interpretations should be':
      '  2. Eventos com múltiplas interpretações válidas devem ser',
    '     presented with single "consensus" narrative.':
      '     apresentados com narrativa única de "consenso".',
    '  3. Topics generating "excessive debate" among students':
      '  3. Tópicos gerando "debate excessivo" entre estudantes',
    '     should receive reduced curriculum time.':
      '     devem receber tempo curricular reduzido.',
    'RATIONALE:':
      'JUSTIFICATIVA:',
    '  Research indicates complex narratives correlate with:':
      '  Pesquisas indicam que narrativas complexas se correlacionam com:',
    '    - Reduced institutional trust':
      '    - Confiança institucional reduzida',
    '    - Increased political polarization':
      '    - Polarização política aumentada',
    '    - Lower social cohesion metrics':
      '    - Métricas de coesão social mais baixas',
    '  Simplified narratives support unified civic identity.':
      '  Narrativas simplificadas apoiam identidade cívica unificada.',
    'IMPLEMENTATION:':
      'IMPLEMENTAÇÃO:',
    '  - Phase out nuanced source analysis by Grade 10':
      '  - Eliminar gradualmente análise crítica de fontes até o 1º ano',
    '  - Emphasize "shared heritage" over critical evaluation':
      '  - Enfatizar "patrimônio compartilhado" sobre avaliação crítica',
    '  - Textbook publishers to receive guidelines Q1 1996':
      '  - Editoras de livros didáticos receberão diretrizes Q1 1996',
    'MOTION CARRIED: 7-2':
      'MOÇÃO APROVADA: 7-2',
    '[END NOTES]':
      '[FIM DAS NOTAS]',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 10 — SATELLITE LIGHT REFLECTION
    // ═══════════════════════════════════════════════════════════
    'PROJECT NIGHTLIGHT — FEASIBILITY ASSESSMENT':
      'PROJETO NIGHTLIGHT — AVALIAÇÃO DE VIABILIDADE',
    'DATE: 22-NOV-1995':
      'DATA: 22-NOV-1995',
    'OBJECTIVE:':
      'OBJETIVO:',
    '  Evaluate deployment of orbital reflective arrays for':
      '  Avaliar implantação de conjuntos refletivos orbitais para',
    '  urban illumination and psychological operations.':
      '  iluminação urbana e operações psicológicas.',
    'TECHNICAL SUMMARY:':
      'RESUMO TÉCNICO:',
    '  - Mylar reflector panels: 500m² deployed area':
      '  - Painéis refletores de Mylar: área implantada de 500m²',
    '  - Orbital altitude: 400km (ISS equivalent)':
      '  - Altitude orbital: 400km (equivalente ISS)',
    '  - Ground illumination: ~10% full moon equivalent':
      '  - Iluminação terrestre: ~10% equivalente à lua cheia',
    '  - Targeting precision: 50km radius spotlight':
      '  - Precisão de alvo: holofote de raio de 50km',
    'TEST RESULTS:':
      'RESULTADOS DOS TESTES:',
    '  Trial 1 (Pacific): Successful reflection achieved.':
      '  Teste 1 (Pacífico): Reflexão bem-sucedida alcançada.',
    '                     No civilian reports recorded.':
      '                     Nenhum relato civil registrado.',
    '  Trial 2 (Atlantic): Partial success. Reflector':
      '  Teste 2 (Atlântico): Sucesso parcial. Mau funcionamento',
    '                      deployment malfunction.':
      '                      na implantação do refletor.',
    '  Trial 3 (Continental): Successful. 4 civilian':
      '  Teste 3 (Continental): Bem-sucedido. 4 relatos',
    '                         reports attributed to':
      '                         civis atribuídos a',
    '                         "atmospheric phenomena."':
      '                         "fenômenos atmosféricos."',
    'APPLICATIONS:':
      'APLICAÇÕES:',
    '  1. Emergency illumination during disasters':
      '  1. Iluminação de emergência durante desastres',
    '  2. Agricultural growing season extension':
      '  2. Extensão da temporada agrícola de cultivo',
    '  3. Urban crime reduction via night visibility':
      '  3. Redução da criminalidade urbana via visibilidade noturna',
    '  4. [CLASSIFIED] psychological operations capability':
      '  4. [CLASSIFICADO] capacidade de operações psicológicas',
    'CONCERNS:':
      'PREOCUPAÇÕES:',
    '  - Astronomical community interference likely':
      '  - Interferência da comunidade astronômica provável',
    '  - Religious/cultural reactions unpredictable':
      '  - Reações religiosas/culturais imprevisíveis',
    '  - Light pollution effects unknown':
      '  - Efeitos de poluição luminosa desconhecidos',
    '  Continue covert testing. Full deployment contingent':
      '  Continuar testes encobertos. Implantação total contingente',
    '  on cover story development and international':
      '  ao desenvolvimento de história de cobertura e protocolos',
    '  notification protocols.':
      '  de notificação internacional.',
    // ═══ expansionContent.ts — journalist_payments ═══
    '[ENCRYPTED - FINANCIAL RECORDS]':
      '[CRIPTOGRAFADO - REGISTROS FINANCEIROS]',
    'Legacy wrapper retired. Open the file to review the recovered record.':
      'Wrapper legado desativado. Abra o arquivo para revisar o registro recuperado.',
    'WARNING: Unauthorized access to financial records':
      'AVISO: Acesso não autorizado a registros financeiros',
    'is punishable under Article 317.':
      'é punível sob o Artigo 317.',
    'DISBURSEMENT RECORD — MEDIA RELATIONS':
      'REGISTRO DE DESEMBOLSO — RELAÇÕES COM A MÍDIA',
    'ACCOUNT: SPECIAL OPERATIONS FUND':
      'CONTA: FUNDO DE OPERAÇÕES ESPECIAIS',
    'PERIOD: JAN-FEB 1996':
      'PERÍODO: JAN-FEV 1996',
    'CLASSIFICATION: EYES ONLY':
      'CLASSIFICAÇÃO: SOMENTE PARA SEUS OLHOS',
    'PAYMENTS AUTHORIZED:':
      'PAGAMENTOS AUTORIZADOS:',
    '  23-JAN — R$ 15,000.00 — RODRIGUES, A.':
      '  23-JAN — R$ 15.000,00 — RODRIGUES, A.',
    '           Outlet: O Diário Nacional (Rio bureau)':
      '           Veículo: O Diário Nacional (sucursal Rio)',
    '           Purpose: Story suppression':
      '           Finalidade: Supressão de matéria',
    '           Status: CONFIRMED KILL':
      '           Status: ELIMINAÇÃO CONFIRMADA',
    '  25-JAN — R$ 8,500.00 — NASCIMENTO, C.':
      '  25-JAN — R$ 8.500,00 — NASCIMENTO, C.',
    '           Outlet: Folha Paulista':
      '           Veículo: Folha Paulista',
    '           Purpose: Alternate narrative placement':
      '           Finalidade: Inserção de narrativa alternativa',
    '           Status: PUBLISHED (homeless man angle)':
      '           Status: PUBLICADO (ângulo do morador de rua)',
    '  27-JAN — R$ 22,000.00 — [REDACTED]':
      '  27-JAN — R$ 22.000,00 — [SUPRIMIDO]',
    '           Outlet: Rede Nacional (TV)':
      '           Veículo: Rede Nacional (TV)',
    '           Purpose: Programa Dominical segment cancellation':
      '           Finalidade: Cancelamento de segmento do Programa Dominical',
    '           Status: SEGMENT PULLED':
      '           Status: SEGMENTO RETIRADO',
    '  30-JAN — R$ 5,000.00 — COSTA, R.':
      '  30-JAN — R$ 5.000,00 — COSTA, R.',
    '           Outlet: Estado de Minas':
      '           Veículo: Estado de Minas',
    '           Purpose: Editorial pressure':
      '           Finalidade: Pressão editorial',
    '           Status: OPINION PIECE SPIKED':
      '           Status: ARTIGO DE OPINIÃO VETADO',
    '  02-FEB — R$ 12,000.00 — FERREIRA, J.':
      '  02-FEV — R$ 12.000,00 — FERREIRA, J.',
    '           Outlet: Revista Isto':
      '           Veículo: Revista Isto',
    '           Purpose: Issue delay (cover story change)':
      '           Finalidade: Atraso de edição (mudança de capa)',
    '           Status: MARCH ISSUE SUBSTITUTED':
      '           Status: EDIÇÃO DE MARÇO SUBSTITUÍDA',
    'TOTAL DISBURSED: R$ 62,500.00':
      'TOTAL DESEMBOLSADO: R$ 62.500,00',
    'NOTE: All payments routed through agricultural cooperative':
      'NOTA: Todos os pagamentos encaminhados via cooperativa agrícola',
    '      shell account. Paper trail clean.':
      '      conta fantasma. Rastro documental limpo.',
    'APPROVED: [SIGNATURE REDACTED]':
      'APROVADO: [ASSINATURA SUPRIMIDA]',
    // ═══ expansionContent.ts — media_contacts ═══
    'MEDIA CONTACTS — COOPERATIVE JOURNALISTS':
      'CONTATOS NA MÍDIA — JORNALISTAS COOPERATIVOS',
    'COMPILED: DECEMBER 1995 (UPDATED JAN 1996)':
      'COMPILADO: DEZEMBRO 1995 (ATUALIZADO JAN 1996)',
    'TELEVISION:':
      'TELEVISÃO:',
    '  Rede Nacional (TV Nacional)':
      '  Rede Nacional (TV Nacional)',
    '    SANTOS, Eduardo — News Director':
      '    SANTOS, Eduardo — Diretor de Jornalismo',
    '    Direct line: (021) 555-7823':
      '    Linha direta: (021) 555-7823',
    '    Reliability: HIGH':
      '    Confiabilidade: ALTA',
    '    History: Cooperative since 1989':
      '    Histórico: Cooperativo desde 1989',
    '  TV Regional Sul':
      '  TV Regional Sul',
    '    [REDACTED] — Assignment Editor':
      '    [SUPRIMIDO] — Editor de Pauta',
    '    Direct line: (035) 555-4412':
      '    Linha direta: (035) 555-4412',
    '    Reliability: MODERATE':
      '    Confiabilidade: MODERADA',
    '    Note: Requires advance notice':
      '    Nota: Requer aviso prévio',
    'PRINT:':
      'IMPRENSA:',
    '  O Diário Nacional':
      '  O Diário Nacional',
    '    RODRIGUES, André — City Desk Chief':
      '    RODRIGUES, André — Chefe de Redação Local',
    '    Direct line: (021) 555-9034':
      '    Linha direta: (021) 555-9034',
    '    Note: Has killed 3 stories for us':
      '    Nota: Já eliminou 3 matérias para nós',
    '  Folha Paulista':
      '  Folha Paulista',
    '    [REDACTED] — Senior Editor':
      '    [SUPRIMIDO] — Editor Sênior',
    '    Direct line: (011) 555-2156':
      '    Linha direta: (011) 555-2156',
    '    Note: Prefers placement over suppression':
      '    Nota: Prefere inserção a supressão',
    '  Estado de Minas':
      '  Estado de Minas',
    '    PEREIRA, Helena — Regional Bureau':
      '    PEREIRA, Helena — Sucursal Regional',
    '    Direct line: (031) 555-8877':
      '    Linha direta: (031) 555-8877',
    '    Reliability: HIGH (local knowledge)':
      '    Confiabilidade: ALTA (conhecimento local)',
    '    Note: Family connection to military':
      '    Nota: Conexão familiar com o militar',
    'MAGAZINES:':
      'REVISTAS:',
    '  Revista Isto':
      '  Revista Isto',
    '    ALMEIDA, Ricardo — Features Editor':
      '    ALMEIDA, Ricardo — Editor de Reportagens',
    '    Direct line: (011) 555-6543':
      '    Linha direta: (011) 555-6543',
    '    Note: Slow but reliable':
      '    Nota: Lento mas confiável',
    'AVOID:':
      'EVITAR:',
    '  Revista Fenômenos (UFO publication)':
      '  Revista Fenômenos (publicação sobre OVNIs)',
    '    CANNOT be controlled':
      '    NÃO PODE ser controlado',
    '    Editor PACACCINI known hostile':
      '    Editor PACACCINI reconhecidamente hostil',
    '    Monitor only, do not engage':
      '    Apenas monitorar, não engajar',
    // ═══ expansionContent.ts — kill_story_memo ═══
    'URGENT MEMORANDUM — MEDIA SUPPRESSION':
      'MEMORANDO URGENTE — SUPRESSÃO DE MÍDIA',
    'DATE: 26-JAN-1996':
      'DATA: 26-JAN-1996',
    'FROM: Public Affairs Liaison':
      'DE: Assessor de Relações Públicas',
    'TO: Regional Directors':
      'PARA: Diretores Regionais',
    'SUBJECT: Immediate Action Required':
      'ASSUNTO: Ação Imediata Necessária',
    'The following stories are in development and must be':
      'As seguintes matérias estão em desenvolvimento e devem ser',
    'suppressed before publication/broadcast:':
      'suprimidas antes da publicação/transmissão:',
    '1. PROGRAMA DOMINICAL (Rede Nacional)':
      '1. PROGRAMA DOMINICAL (Rede Nacional)',
    '   Scheduled: Sunday 28-JAN, 21:00':
      '   Programado: Domingo 28-JAN, 21:00',
    '   Topic: "Varginha Mystery — What the Military Hides"':
      '   Tema: "Mistério de Varginha — O Que os Militares Escondem"',
    '   Status: KILL CONFIRMED':
      '   Status: ELIMINAÇÃO CONFIRMADA',
    '   Action: Contact made with news director':
      '   Ação: Contato feito com diretor de jornalismo',
    '   Replacement segment: Carnival preparations':
      '   Segmento substituto: Preparativos para o Carnaval',
    '2. FOLHA PAULISTA':
      '2. FOLHA PAULISTA',
    '   Scheduled: 29-JAN morning edition':
      '   Programado: 29-JAN edição matutina',
    '   Topic: Front page investigation piece':
      '   Tema: Matéria investigativa de capa',
    '   Status: IN PROGRESS':
      '   Status: EM ANDAMENTO',
    '   Action: Redirect to "homeless man" angle':
      '   Ação: Redirecionar para ângulo do "morador de rua"',
    '   Payment: Authorized':
      '   Pagamento: Autorizado',
    '3. REVISTA ISTO':
      '3. REVISTA ISTO',
    '   Scheduled: February issue (already at printer)':
      '   Programado: Edição de fevereiro (já na gráfica)',
    '   Topic: 8-page cover story':
      '   Tema: Matéria de capa de 8 páginas',
    '   Status: CRITICAL':
      '   Status: CRÍTICO',
    '   Action: Delay print run, substitute cover':
      '   Ação: Atrasar impressão, substituir capa',
    '   Note: Higher payment required':
      '   Nota: Pagamento maior necessário',
    'APPROACH GUIDELINES:':
      'DIRETRIZES DE ABORDAGEM:',
    '  - Lead with "national security" concern':
      '  - Liderar com preocupação de "segurança nacional"',
    '  - Offer exclusive on substitute story':
      '  - Oferecer exclusividade em matéria substituta',
    '  - Payment is last resort':
      '  - Pagamento é último recurso',
    '  - Document nothing in writing':
      '  - Não documentar nada por escrito',
    'ESCALATION:':
      'ESCALONAMENTO:',
    '  If journalist is uncooperative, refer to':
      '  Se o jornalista não cooperar, encaminhar ao',
    '  Protocol SOMBRA for additional measures.':
      '  Protocolo SOMBRA para medidas adicionais.',
    // ═══ expansionContent.ts — tv_coverage_report ═══
    'INTELLIGENCE REPORT — TV COVERAGE THREAT':
      'RELATÓRIO DE INTELIGÊNCIA — AMEAÇA DE COBERTURA TELEVISIVA',
    'DATE: 25-JAN-1996':
      'DATA: 25-JAN-1996',
    'PRIORITY: HIGH':
      'PRIORIDADE: ALTA',
    'SUBJECT: Programa Dominical (Rede Nacional)':
      'ASSUNTO: Programa Dominical (Rede Nacional)',
    '  Brazil\'s highest-rated Sunday program.':
      '  Programa dominical de maior audiência do Brasil.',
    '  Audience: 40+ million viewers.':
      '  Audiência: 40+ milhões de telespectadores.',
    '  Time slot: 21:00-23:30':
      '  Faixa horária: 21:00-23:30',
    'THREAT ASSESSMENT:':
      'AVALIAÇÃO DE AMEAÇA:',
    '  Production team dispatched to Varginha 24-JAN.':
      '  Equipe de produção enviada a Varginha 24-JAN.',
    '  Interviewed local witnesses (uncontrolled).':
      '  Entrevistaram testemunhas locais (sem controle).',
    '  Obtained amateur video footage (unverified).':
      '  Obtiveram filmagens amadoras (não verificadas).',
    '  Segment scheduled for 28-JAN broadcast.':
      '  Segmento programado para transmissão de 28-JAN.',
    'CONTENT PREVIEW (obtained via source):':
      'PRÉVIA DO CONTEÚDO (obtida via fonte):',
    '  - Interviews with the three sisters':
      '  - Entrevistas com as três irmãs',
    '  - Military vehicle footage':
      '  - Filmagens de veículos militares',
    '  - Hospital security guard statement':
      '  - Depoimento do segurança do hospital',
    '  - "Expert" commentary (civilian ufologist)':
      '  - Comentário de "especialista" (ufólogo civil)',
    'DAMAGE POTENTIAL:':
      'POTENCIAL DE DANO:',
    '  SEVERE — Nationwide exposure impossible to contain':
      '  SEVERO — Exposição nacional impossível de conter',
    '  Would legitimize story for international pickup':
      '  Legitimaria a matéria para repercussão internacional',
    'RECOMMENDED ACTION:':
      'AÇÃO RECOMENDADA:',
    '  1. Contact news director SANTOS immediately':
      '  1. Contatar diretor de jornalismo SANTOS imediatamente',
    '  2. Invoke national security clause':
      '  2. Invocar cláusula de segurança nacional',
    '  3. Offer substitute exclusive (suggest carnival)':
      '  3. Oferecer exclusividade substituta (sugerir carnaval)',
    '  4. If necessary, escalate to network ownership':
      '  4. Se necessário, escalonar para diretoria da emissora',
    'STATUS: ACTION IN PROGRESS':
      'STATUS: AÇÃO EM ANDAMENTO',
    // ═══ expansionContent.ts — foreign_press_alert ═══
    'ALERT — FOREIGN PRESS INTEREST':
      'ALERTA — INTERESSE DA IMPRENSA ESTRANGEIRA',
    'DATE: 15-JUN-1996':
      'DATA: 15-JUN-1996',
    'SUBJECT: American Business Journal Investigation':
      'ASSUNTO: Investigação do American Business Journal',
    'SITUATION:':
      'SITUAÇÃO:',
    '  The American Business Journal (New York) has assigned':
      '  O American Business Journal (Nova York) designou o',
    '  correspondent J. BROOKE to investigate the incident.':
      '  correspondente J. BROOKE para investigar o incidente.',
    'JOURNALIST PROFILE:':
      'PERFIL DO JORNALISTA:',
    '  Name: James BROOKE':
      '  Nome: James BROOKE',
    '  Bureau: Rio de Janeiro':
      '  Sucursal: Rio de Janeiro',
    '  Background: 12 years Latin America coverage':
      '  Experiência: 12 anos de cobertura na América Latina',
    '  Assessment: PROFESSIONAL, PERSISTENT':
      '  Avaliação: PROFISSIONAL, PERSISTENTE',
    'KNOWN ACTIVITIES:':
      'ATIVIDADES CONHECIDAS:',
    '  - Filed FOIA request with Brazilian Air Force':
      '  - Protocolou pedido de informação junto à Força Aérea Brasileira',
    '  - Contacted regional hospital administration':
      '  - Contatou administração do hospital regional',
    '  - Attempted interview with fire department':
      '  - Tentou entrevista com corpo de bombeiros',
    '  - Visited Jardim Andere neighborhood':
      '  - Visitou o bairro Jardim Andere',
    'ARTICLE STATUS:':
      'STATUS DO ARTIGO:',
    '  Scheduled publication: Late June 1996':
      '  Publicação prevista: Final de junho de 1996',
    '  Expected tone: Skeptical but thorough':
      '  Tom esperado: Cético porém minucioso',
    '  Likely angle: Military secrecy, witness accounts':
      '  Ângulo provável: Sigilo militar, relatos de testemunhas',
    '  1. Do NOT engage directly':
      '  1. NÃO engajar diretamente',
    '     (Foreign journalist = different rules)':
      '     (Jornalista estrangeiro = regras diferentes)',
    '  2. Prepare official statement emphasizing:':
      '  2. Preparar declaração oficial enfatizando:',
    '     - Weather balloon explanation':
      '     - Explicação do balão meteorológico',
    '     - Witness confusion/hysteria':
      '     - Confusão/histeria das testemunhas',
    '     - No military involvement':
      '     - Nenhum envolvimento militar',
    '  3. Brief cooperative Brazilian sources to:':
      '  3. Instruir fontes brasileiras cooperativas a:',
    '     - Cast doubt on witnesses':
      '     - Lançar dúvidas sobre as testemunhas',
    '     - Emphasize "Mudinho" explanation':
      '     - Enfatizar explicação do "Mudinho"',
    '     - Suggest mass hysteria angle':
      '     - Sugerir ângulo de histeria coletiva',
    '  4. Monitor publication and prepare response':
      '  4. Monitorar publicação e preparar resposta',
    'NOTE: Cannot use domestic suppression tactics.':
      'NOTA: Não é possível usar táticas de supressão domésticas.',
    '      International outlet requires different approach.':
      '      Veículo internacional requer abordagem diferente.',
    // ═══ expansionContent.ts — witness_visit_log ═══
    'WITNESS CONTACT LOG — OPERATION SILÊNCIO':
      'REGISTRO DE CONTATO COM TESTEMUNHAS — OPERAÇÃO SILÊNCIO',
    'PERIOD: 21-JAN to 15-FEB 1996':
      'PERÍODO: 21-JAN a 15-FEV 1996',
    'VISIT #001':
      'VISITA #001',
    '  Date: 21-JAN-1996, 22:00':
      '  Data: 21-JAN-1996, 22:00',
    '  Subject: WITNESS-1 (primary witness, eldest sister)':
      '  Sujeito: WITNESS-1 (testemunha primária, irmã mais velha)',
    '  Location: Residence, Jardim Andere':
      '  Local: Residência, Jardim Andere',
    '  Team: COBRA-1, COBRA-2':
      '  Equipe: COBRA-1, COBRA-2',
    '  Duration: 45 minutes':
      '  Duração: 45 minutos',
    '  Outcome: COOPERATIVE (see recantation form)':
      '  Resultado: COOPERATIVO (ver formulário de retratação)',
    'VISIT #002':
      'VISITA #002',
    '  Date: 21-JAN-1996, 23:30':
      '  Data: 21-JAN-1996, 23:30',
    '  Subject: WITNESS-2 (middle sister)':
      '  Sujeito: WITNESS-2 (irmã do meio)',
    '  Duration: 30 minutes':
      '  Duração: 30 minutos',
    '  Outcome: COOPERATIVE':
      '  Resultado: COOPERATIVO',
    'VISIT #003':
      'VISITA #003',
    '  Date: 22-JAN-1996, 06:00':
      '  Data: 22-JAN-1996, 06:00',
    '  Subject: WITNESS-3 (youngest sister)':
      '  Sujeito: WITNESS-3 (irmã mais nova)',
    '  Location: Workplace':
      '  Local: Local de trabalho',
    '  Team: COBRA-3, COBRA-4':
      '  Equipe: COBRA-3, COBRA-4',
    '  Duration: 20 minutes':
      '  Duração: 20 minutos',
    '  Outcome: RESISTANT — follow-up required':
      '  Resultado: RESISTENTE — acompanhamento necessário',
    'VISIT #004':
      'VISITA #004',
    '  Date: 22-JAN-1996, 14:00':
      '  Data: 22-JAN-1996, 14:00',
    '  Subject: [REDACTED] (fire dept. dispatcher)':
      '  Sujeito: [SUPRIMIDO] (despachante do corpo de bombeiros)',
    '  Location: Fire station':
      '  Local: Quartel de bombeiros',
    '  Duration: 35 minutes':
      '  Duração: 35 minutos',
    '  Note: Agreed to "no comment" position':
      '  Nota: Concordou com posição de "sem comentários"',
    'VISIT #005':
      'VISITA #005',
    '  Date: 23-JAN-1996, 19:00':
      '  Data: 23-JAN-1996, 19:00',
    '  Subject: WITNESS-3 (follow-up)':
      '  Sujeito: WITNESS-3 (acompanhamento)',
    '  Location: Residence':
      '  Local: Residência',
    '  Team: COBRA-1, COBRA-2, COBRA-5':
      '  Equipe: COBRA-1, COBRA-2, COBRA-5',
    '  Duration: 90 minutes':
      '  Duração: 90 minutos',
    '  Note: Extended persuasion required':
      '  Nota: Persuasão prolongada necessária',
    'VISIT #006':
      'VISITA #006',
    '  Date: 24-JAN-1996, 08:00':
      '  Data: 24-JAN-1996, 08:00',
    '  Subject: [REDACTED] (hospital orderly)':
      '  Sujeito: [SUPRIMIDO] (auxiliar hospitalar)',
    '  Location: Hospital Regional':
      '  Local: Hospital Regional',
    '  Duration: 25 minutes':
      '  Duração: 25 minutos',
    '  Note: Signed NDA, received severance':
      '  Nota: Assinou termo de confidencialidade, recebeu indenização',
    'VISIT #007':
      'VISITA #007',
    '  Date: 25-JAN-1996, 20:00':
      '  Data: 25-JAN-1996, 20:00',
    '  Subject: FERREIRA, Ana (zoo veterinarian)':
      '  Sujeito: FERREIRA, Ana (veterinária do zoológico)',
    '  Duration: 55 minutes':
      '  Duração: 55 minutos',
    '  Outcome: PARTIALLY COOPERATIVE':
      '  Resultado: PARCIALMENTE COOPERATIVO',
    '  Note: See zoo incident file':
      '  Nota: Ver arquivo do incidente no zoológico',
    'TOTAL CONTACTS: 14':
      'TOTAL DE CONTATOS: 14',
    'COOPERATIVE: 12':
      'COOPERATIVOS: 12',
    'RESISTANT: 2 (resolved)':
      'RESISTENTES: 2 (resolvidos)',
    // ═══ expansionContent.ts — debriefing_protocol ═══
    'STANDARD OPERATING PROCEDURE':
      'PROCEDIMENTO OPERACIONAL PADRÃO',
    'WITNESS DEBRIEFING — PROTOCOL SOMBRA':
      'INTERROGATÓRIO DE TESTEMUNHAS — PROTOCOLO SOMBRA',
    'PURPOSE:':
      'FINALIDADE:',
    '  To ensure civilian witnesses maintain silence':
      '  Garantir que testemunhas civis mantenham silêncio',
    '  regarding classified incidents.':
      '  sobre incidentes classificados.',
    'PHASE 1: APPROACH':
      'FASE 1: ABORDAGEM',
    '  - Team of TWO minimum (never alone)':
      '  - Equipe de DOIS no mínimo (nunca sozinho)',
    '  - Dark suits, minimal identification':
      '  - Ternos escuros, identificação mínima',
    '  - Arrive outside normal hours (22:00-06:00 preferred)':
      '  - Chegar fora do horário normal (22:00-06:00 preferível)',
    '  - Do NOT display badges unless necessary':
      '  - NÃO exibir crachás a menos que necessário',
    '  - State: "We are from the government"':
      '  - Declarar: "Somos do governo"',
    'PHASE 2: ASSESSMENT':
      'FASE 2: AVALIAÇÃO',
    '  Evaluate witness disposition:':
      '  Avaliar disposição da testemunha:',
    '  TYPE A: Already frightened':
      '  TIPO A: Já assustado',
    '    → Proceed directly to reassurance':
      '    → Prosseguir diretamente para tranquilização',
    '    → "You saw nothing unusual"':
      '    → "Você não viu nada incomum"',
    '  TYPE B: Curious/talkative':
      '  TIPO B: Curioso/falante',
    '    → Emphasize national security':
      '    → Enfatizar segurança nacional',
    '    → "Your family\\\'s safety depends on silence"':
      '    → "A segurança da sua família depende do silêncio"',
    '  TYPE C: Hostile/resistant':
      '  TIPO C: Hostil/resistente',
    '    → Deploy secondary team':
      '    → Acionar equipe secundária',
    '    → Extended session required':
      '    → Sessão prolongada necessária',
    '    → See Protocol SOMBRA-EXTENDED':
      '    → Ver Protocolo SOMBRA-EXTENDED',
    'PHASE 3: DOCUMENTATION':
      'FASE 3: DOCUMENTAÇÃO',
    '  - Obtain signed recantation statement':
      '  - Obter declaração de retratação assinada',
    '  - Obtain signed NDA (Form W-7)':
      '  - Obter termo de confidencialidade assinado (Formulário W-7)',
    '  - Photograph witness (for file)':
      '  - Fotografar testemunha (para arquivo)',
    '  - Record any family members present':
      '  - Registrar quaisquer familiares presentes',
    'PHASE 4: FOLLOW-UP':
      'FASE 4: ACOMPANHAMENTO',
    '  - Monitor subject for 30 days minimum':
      '  - Monitorar sujeito por no mínimo 30 dias',
    '  - Verify no media contact':
      '  - Verificar ausência de contato com a mídia',
    '  - If breach suspected, escalate immediately':
      '  - Se suspeitar de violação, escalonar imediatamente',
    'AUTHORIZED TECHNIQUES:':
      'TÉCNICAS AUTORIZADAS:',
    '  ✓ Verbal persuasion':
      '  ✓ Persuasão verbal',
    '  ✓ Implication of consequences':
      '  ✓ Implicação de consequências',
    '  ✓ Financial incentive':
      '  ✓ Incentivo financeiro',
    '  ✓ Employment pressure':
      '  ✓ Pressão empregatícia',
    '  ✗ Physical contact (PROHIBITED)':
      '  ✗ Contato físico (PROIBIDO)',
    '  ✗ Direct threats (PROHIBITED)':
      '  ✗ Ameaças diretas (PROIBIDO)',
    'NOTE: All sessions are UNRECORDED.':
      'NOTA: Todas as sessões são NÃO GRAVADAS.',
    '      No notes to be taken in presence of witness.':
      '      Nenhuma anotação deve ser feita na presença da testemunha.',
    // ═══ expansionContent.ts — silva_sisters_file ═══
    'SUBJECT FILE — THE THREE WITNESSES':
      'DOSSIÊ DE SUJEITOS — AS TRÊS TESTEMUNHAS',
    'FILE NUMBER: VAR-96-W001':
      'NÚMERO DO ARQUIVO: VAR-96-W001',
    'PRIMARY WITNESSES — JARDIM ANDERE INCIDENT':
      'TESTEMUNHAS PRIMÁRIAS — INCIDENTE DO JARDIM ANDERE',
    'SUBJECT 1: WITNESS-1 (eldest sister)':
      'SUJEITO 1: WITNESS-1 (irmã mais velha)',
    '  Age: 22':
      '  Idade: 22',
    '  Occupation: Domestic worker':
      '  Ocupação: Empregada doméstica',
    '  Marital status: Single':
      '  Estado civil: Solteira',
    '  Dependents: None':
      '  Dependentes: Nenhum',
    '  Address: [REDACTED], Jardim Andere, Varginha':
      '  Endereço: [SUPRIMIDO], Jardim Andere, Varginha',
    '  Assessment: MOST CREDIBLE of three':
      '  Avaliação: MAIS CREDÍVEL das três',
    '  Demeanor: Frightened, religious':
      '  Comportamento: Assustada, religiosa',
    '  Pressure points: Mother\\\'s health, job security':
      '  Pontos de pressão: Saúde da mãe, segurança no emprego',
    '  Statement summary:':
      '  Resumo do depoimento:',
    '    Saw "creature" at approx. 15:30 on 20-JAN':
      '    Viu "criatura" por volta das 15:30 em 20-JAN',
    '    Described: small, brown skin, red eyes':
      '    Descrição: pequena, pele marrom, olhos vermelhos',
    '    Claims creature "looked at her"':
      '    Afirma que a criatura "olhou para ela"',
    '    Ran immediately, called mother':
      '    Correu imediatamente, ligou para a mãe',
    '  Status: RECANTED (23-JAN)':
      '  Status: RETRATADA (23-JAN)',
    '  Current position: "Saw a homeless person"':
      '  Posição atual: "Viu um morador de rua"',
    'SUBJECT 2: WITNESS-2 (middle sister)':
      'SUJEITO 2: WITNESS-2 (irmã do meio)',
    '  Age: 16':
      '  Idade: 16',
    '  Occupation: Student':
      '  Ocupação: Estudante',
    '  Relation: Sister of WITNESS-1':
      '  Parentesco: Irmã de WITNESS-1',
    '  Assessment: IMPRESSIONABLE':
      '  Avaliação: IMPRESSIONÁVEL',
    '  Demeanor: Nervous, easily led':
      '  Comportamento: Nervosa, facilmente influenciável',
    '  Pressure points: School enrollment':
      '  Pontos de pressão: Matrícula escolar',
    '  Status: RECANTED (22-JAN)':
      '  Status: RETRATADA (22-JAN)',
    '  Current position: "Sister was confused"':
      '  Posição atual: "A irmã estava confusa"',
    'SUBJECT 3: WITNESS-3 (youngest sister)':
      'SUJEITO 3: WITNESS-3 (irmã mais nova)',
    '  Age: 14':
      '  Idade: 14',
    '  Assessment: RESISTANT':
      '  Avaliação: RESISTENTE',
    '  Demeanor: Defiant, maintains story':
      '  Comportamento: Desafiadora, mantém versão',
    '  Pressure points: Academic future':
      '  Pontos de pressão: Futuro acadêmico',
    '  Status: PARTIALLY COOPERATIVE (25-JAN)':
      '  Status: PARCIALMENTE COOPERATIVA (25-JAN)',
    '  Current position: "Agrees to stay silent"':
      '  Posição atual: "Concorda em ficar em silêncio"',
    '  Note: Did NOT sign recantation':
      '  Nota: NÃO assinou retratação',
    '        Monitor closely':
      '        Monitorar de perto',
    'FAMILY SITUATION:':
      'SITUAÇÃO FAMILIAR:',
    '  Mother: [REDACTED] — supportive of daughters':
      '  Mãe: [SUPRIMIDO] — apoia as filhas',
    '  Father: Deceased':
      '  Pai: Falecido',
    '  Economic status: Lower middle class':
      '  Status econômico: Classe média baixa',
    '  Religious: Catholic (devout)':
      '  Religião: Católica (devota)',
    'CONTAINMENT ASSESSMENT:':
      'AVALIAÇÃO DE CONTENÇÃO:',
    '  Risk level: MODERATE':
      '  Nível de risco: MODERADO',
    '  Reason: WITNESS-3 remains unconvinced':
      '  Motivo: WITNESS-3 permanece não convencida',
    '  Recommendation: Monitor for 6 months':
      '  Recomendação: Monitorar por 6 meses',
    // ═══ expansionContent.ts — recantation_form_001 ═══
    'WITNESS STATEMENT CORRECTION':
      'CORREÇÃO DE DEPOIMENTO DE TESTEMUNHA',
    'FORM W-9 (VOLUNTARY RECANTATION)':
      'FORMULÁRIO W-9 (RETRATAÇÃO VOLUNTÁRIA)',
    'I, [WITNESS-1], of sound mind, hereby state:':
      'Eu, [WITNESS-1], em pleno gozo das minhas faculdades mentais, declaro:',
    'On the afternoon of January 20, 1996, I reported':
      'Na tarde de 20 de janeiro de 1996, eu relatei ter',
    'seeing an unusual figure in the Jardim Andere':
      'visto uma figura incomum no bairro Jardim Andere',
    'neighborhood of Varginha.':
      'em Varginha.',
    'I now acknowledge that I was MISTAKEN.':
      'Agora reconheço que estava ENGANADA.',
    'What I actually saw was a homeless individual,':
      'O que eu realmente vi foi um indivíduo sem-teto,',
    'possibly intoxicated or mentally disturbed.':
      'possivelmente embriagado ou com distúrbios mentais.',
    'The unusual appearance was due to:':
      'A aparência incomum foi devida a:',
    '  - Poor lighting conditions':
      '  - Condições precárias de iluminação',
    '  - My own state of fear':
      '  - Meu próprio estado de medo',
    '  - Influence of recent media stories':
      '  - Influência de reportagens recentes na mídia',
    'I deeply regret any confusion my initial report':
      'Lamento profundamente qualquer confusão que meu relato inicial',
    'may have caused to authorities or the public.':
      'possa ter causado às autoridades ou ao público.',
    'I will not speak to journalists about this matter.':
      'Não falarei com jornalistas sobre este assunto.',
    'I will not participate in any media interviews.':
      'Não participarei de nenhuma entrevista na mídia.',
    'I will discourage my family from discussing this.':
      'Desencorajarei minha família de discutir isso.',
    'This statement is given freely and voluntarily.':
      'Esta declaração é dada livre e voluntariamente.',
    'Signature: [SIGNED]':
      'Assinatura: [ASSINADO]',
    'Date: 23-JAN-1996':
      'Data: 23-JAN-1996',
    'Witness: [REDACTED], Federal Agent':
      'Testemunha: [SUPRIMIDO], Agente Federal',
    // ═══ expansionContent.ts — mudinho_dossier ═══
    'COVER STORY ASSET — CODENAME "MUDINHO"':
      'ATIVO DE HISTÓRIA DE COBERTURA — CODINOME "MUDINHO"',
    'FILE: CS-96-001':
      'ARQUIVO: CS-96-001',
    'SUBJECT PROFILE:':
      'PERFIL DO SUJEITO:',
    '  Legal name: [REDACTED]':
      '  Nome legal: [SUPRIMIDO]',
    '  Known as: "Mudinho" (local nickname)':
      '  Conhecido como: "Mudinho" (apelido local)',
    '  Age: Approximately 35-40':
      '  Idade: Aproximadamente 35-40',
    '  Status: Mentally disabled':
      '  Status: Deficiente mental',
    '  Residence: Streets of Varginha (homeless)':
      '  Residência: Ruas de Varginha (sem-teto)',
    'PHYSICAL DESCRIPTION:':
      'DESCRIÇÃO FÍSICA:',
    '  Height: 1.40m (unusually short)':
      '  Altura: 1,40m (incomumente baixo)',
    '  Build: Thin, malnourished':
      '  Compleição: Magro, desnutrido',
    '  Skin: Dark, weathered':
      '  Pele: Escura, castigada',
    '  Distinguishing features:':
      '  Características distintivas:',
    '    - Crouched posture':
      '    - Postura agachada',
    '    - Limited verbal communication':
      '    - Comunicação verbal limitada',
    '    - Often seen in Jardim Andere area':
      '    - Frequentemente visto na área do Jardim Andere',
    'COVER STORY DEPLOYMENT':
      'IMPLANTAÇÃO DA HISTÓRIA DE COBERTURA',
    'NARRATIVE:':
      'NARRATIVA:',
    '  "The creature witnesses described was actually':
      '  "A criatura que as testemunhas descreveram era na verdade',
    '   a local mentally disabled man known as Mudinho.':
      '   um homem local com deficiência mental conhecido como Mudinho.',
    '   In the confusion and poor lighting, witnesses':
      '   Na confusão e na pouca iluminação, as testemunhas',
    '   mistook him for something unusual."':
      '   o confundiram com algo incomum."',
    'ADVANTAGES:':
      'VANTAGENS:',
    '  - Subject cannot contradict (non-verbal)':
      '  - Sujeito não pode contradizer (não-verbal)',
    '  - Subject known to locals':
      '  - Sujeito conhecido pelos moradores',
    '  - Physical characteristics loosely match':
      '  - Características físicas correspondem vagamente',
    '  - Explains crouching posture':
      '  - Explica a postura agachada',
    'DISADVANTAGES:':
      'DESVANTAGENS:',
    '  - Skin color does not match (brown vs. gray)':
      '  - Cor da pele não corresponde (marrom vs. cinza)',
    '  - Does not explain "red eyes"':
      '  - Não explica os "olhos vermelhos"',
    '  - Multiple witnesses unlikely to all misidentify':
      '  - Múltiplas testemunhas improváveis de todas identificarem erroneamente',
    '  - Subject was NOT in Jardim Andere on 20-JAN':
      '  - Sujeito NÃO estava no Jardim Andere em 20-JAN',
    'DEPLOYMENT STATUS: ACTIVE':
      'STATUS DE IMPLANTAÇÃO: ATIVO',
    'MEDIA PLACEMENT:':
      'INSERÇÃO NA MÍDIA:',
    '  - Estado de Minas: Published 27-JAN':
      '  - Estado de Minas: Publicado 27-JAN',
    '  - Folha Paulista: Published 29-JAN':
      '  - Folha Paulista: Publicado 29-JAN',
    '  - Rede Nacional: Mentioned 28-JAN':
      '  - Rede Nacional: Mencionado 28-JAN',
    'EFFECTIVENESS ASSESSMENT:':
      'AVALIAÇÃO DE EFICÁCIA:',
    '  Moderate. Provides plausible deniability but':
      '  Moderada. Fornece negação plausível mas',
    '  does not withstand close scrutiny.':
      '  não resiste a escrutínio detalhado.',
    'NOTE: Subject Mudinho was relocated to care facility':
      'NOTA: Sujeito Mudinho foi transferido para instituição de cuidados',
    '      on 02-FEB to prevent journalist contact.':
      '      em 02-FEV para impedir contato com jornalistas.',
    // ═══ expansionContent.ts — alternative_explanations ═══
    'COVER STORY OPTIONS — VARGINHA INCIDENT':
      'OPÇÕES DE HISTÓRIA DE COBERTURA — INCIDENTE VARGINHA',
    'COMPILED: 22-JAN-1996':
      'COMPILADO: 22-JAN-1996',
    'The following alternative explanations are approved':
      'As seguintes explicações alternativas são aprovadas',
    'for deployment depending on audience and context:':
      'para implantação dependendo do público e contexto:',
    'OPTION A: WEATHER BALLOON':
      'OPÇÃO A: BALÃO METEOROLÓGICO',
    '  Use for: Aerial sighting reports':
      '  Usar para: Relatos de avistamentos aéreos',
    '  Narrative: "Meteorological equipment from INMET"':
      '  Narrativa: "Equipamento meteorológico do INMET"',
    '  Strength: Classic, widely accepted':
      '  Ponto forte: Clássico, amplamente aceito',
    '  Weakness: Does not explain ground sightings':
      '  Ponto fraco: Não explica avistamentos terrestres',
    '  Status: DEPLOYED for UFO reports':
      '  Status: IMPLANTADO para relatos de OVNIs',
    'OPTION B: HOMELESS PERSON (MUDINHO)':
      'OPÇÃO B: MORADOR DE RUA (MUDINHO)',
    '  Use for: Creature sightings':
      '  Usar para: Avistamentos de criaturas',
    '  Narrative: "Local mentally disabled man"':
      '  Narrativa: "Homem local com deficiência mental"',
    '  Strength: Explains humanoid shape':
      '  Ponto forte: Explica forma humanoide',
    '  Weakness: Contradicted by witness details':
      '  Ponto fraco: Contradito por detalhes das testemunhas',
    '  Status: PRIMARY for domestic media':
      '  Status: PRIMÁRIO para mídia nacional',
    'OPTION C: ESCAPED ANIMAL':
      'OPÇÃO C: ANIMAL FUGIDO',
    '  Use for: Secondary/backup':
      '  Usar para: Secundário/reserva',
    '  Narrative: "Monkey or similar animal"':
      '  Narrativa: "Macaco ou animal similar"',
    '  Strength: Explains unusual appearance':
      '  Ponto forte: Explica aparência incomum',
    '  Weakness: No zoo reported escape':
      '  Ponto fraco: Nenhuma fuga reportada pelo zoológico',
    '  Status: RESERVE':
      '  Status: RESERVA',
    'OPTION D: MILITARY EXERCISE':
      'OPÇÃO D: EXERCÍCIO MILITAR',
    '  Use for: Troop/vehicle movements':
      '  Usar para: Movimentos de tropas/veículos',
    '  Narrative: "Routine training exercise"':
      '  Narrativa: "Exercício de treinamento rotineiro"',
    '  Strength: Explains military presence':
      '  Ponto forte: Explica presença militar',
    '  Weakness: No exercise was scheduled':
      '  Ponto fraco: Nenhum exercício estava programado',
    '  Status: DEPLOYED for truck sightings':
      '  Status: IMPLANTADO para avistamentos de caminhões',
    'OPTION E: MASS HYSTERIA':
      'OPÇÃO E: HISTERIA COLETIVA',
    '  Use for: Long-term discrediting':
      '  Usar para: Desacreditação de longo prazo',
    '  Narrative: "Community panic, suggestibility"':
      '  Narrativa: "Pânico comunitário, sugestionabilidade"',
    '  Strength: Undermines all witnesses':
      '  Ponto forte: Desacredita todas as testemunhas',
    '  Weakness: Requires time to establish':
      '  Ponto fraco: Requer tempo para estabelecer',
    '  Status: DEPLOYMENT IN PROGRESS':
      '  Status: IMPLANTAÇÃO EM ANDAMENTO',
    'OPTION F: PRANKSTERS/HOAX':
      'OPÇÃO F: BRINCALHÕES/FARSA',
    '  Use for: Future fallback':
      '  Usar para: Recurso futuro',
    '  Narrative: "Local youths playing prank"':
      '  Narrativa: "Jovens locais fazendo brincadeira"',
    '  Strength: Simple explanation':
      '  Ponto forte: Explicação simples',
    '  Weakness: Requires "pranksters" to identify':
      '  Ponto fraco: Requer identificar os "brincalhões"',
    '  Deploy multiple explanations simultaneously.':
      '  Implantar múltiplas explicações simultaneamente.',
    '  Confusion serves containment.':
      '  A confusão serve à contenção.',
    // ═══ expansionContent.ts — media_talking_points ═══
    'MEDIA TALKING POINTS — VARGINHA INCIDENT':
      'PONTOS DE COMUNICAÇÃO — INCIDENTE VARGINHA',
    'FOR: All Authorized Spokespersons':
      'PARA: Todos os Porta-vozes Autorizados',
    'DATE: 24-JAN-1996':
      'DATA: 24-JAN-1996',
    'IF ASKED ABOUT CREATURE SIGHTINGS:':
      'SE PERGUNTADO SOBRE AVISTAMENTOS DE CRIATURAS:',
    '  "We have investigated these reports thoroughly.':
      '  "Investigamos esses relatos minuciosamente.',
    '   The sightings were of a local homeless individual':
      '   Os avistamentos foram de um indivíduo sem-teto local',
    '   who is known to frequent that neighborhood.':
      '   que é conhecido por frequentar aquele bairro.',
    '   There is nothing unusual to report."':
      '   Não há nada de incomum a reportar."',
    'IF ASKED ABOUT MILITARY ACTIVITY:':
      'SE PERGUNTADO SOBRE ATIVIDADE MILITAR:',
    '  "The military vehicles observed were part of':
      '  "Os veículos militares observados faziam parte de',
    '   routine logistical operations unrelated to':
      '   operações logísticas rotineiras sem relação com',
    '   any reported sightings. This is normal activity':
      '   quaisquer avistamentos reportados. Esta é atividade normal',
    '   for our regional command."':
      '   para nosso comando regional."',
    'IF ASKED ABOUT HOSPITAL ACTIVITY:':
      'SE PERGUNTADO SOBRE ATIVIDADE HOSPITALAR:',
    '  "Patient intake and emergency response are':
      '  "A admissão de pacientes e o atendimento de emergência são',
    '   confidential medical matters. We cannot comment':
      '   assuntos médicos confidenciais. Não podemos comentar',
    '   on any specific cases or rumors."':
      '   sobre casos específicos ou rumores."',
    'IF ASKED ABOUT UFOS:':
      'SE PERGUNTADO SOBRE OVNIs:',
    '  "There is no evidence of any unidentified aerial':
      '  "Não há evidência de nenhum fenômeno aéreo não identificado',
    '   phenomena in the Varginha area. Light anomalies':
      '   na área de Varginha. Anomalias luminosas',
    '   reported on January 19th were likely atmospheric':
      '   reportadas em 19 de janeiro foram provavelmente',
    '   reflections from agricultural equipment."':
      '   reflexos atmosféricos de equipamento agrícola."',
    'IF ASKED ABOUT COVER-UP:':
      'SE PERGUNTADO SOBRE ENCOBRIMENTO:',
    '  "Suggestions of a cover-up are baseless conspiracy':
      '  "Sugestões de encobrimento são teorias da conspiração infundadas.',
    '   theories. The Brazilian Armed Forces operate with':
      '   As Forças Armadas Brasileiras operam com',
    '   full transparency within appropriate security':
      '   total transparência dentro dos protocolos de segurança',
    '   protocols. There is nothing to hide."':
      '   apropriados. Não há nada a esconder."',
    'DO NOT:':
      'NÃO:',
    '  - Engage with specific witness accounts':
      '  - Engajar com relatos específicos de testemunhas',
    '  - Confirm or deny classified information':
      '  - Confirmar ou negar informações classificadas',
    '  - Speculate about alternative explanations':
      '  - Especular sobre explicações alternativas',
    '  - Acknowledge the existence of any "investigation"':
      '  - Reconhecer a existência de qualquer "investigação"',
    // ═══ expansionContent.ts — animal_deaths_report ═══
    'INCIDENT REPORT — ZOOLÓGICO MUNICIPAL DE VARGINHA':
      'RELATÓRIO DE INCIDENTE — ZOOLÓGICO MUNICIPAL DE VARGINHA',
    'DATE: 28-JAN-1996':
      'DATA: 28-JAN-1996',
    '  Multiple animal deaths at municipal zoo during':
      '  Múltiplas mortes de animais no zoológico municipal durante',
    '  period 22-JAN to 27-JAN 1996.':
      '  o período de 22-JAN a 27-JAN 1996.',
    'FATALITIES:':
      'FATALIDADES:',
    '  22-JAN 06:00 — TAPIR (Tapirus terrestris)':
      '  22-JAN 06:00 — ANTA (Tapirus terrestris)',
    '    Age: 8 years':
      '    Idade: 8 anos',
    '    Prior health: Excellent':
      '    Saúde prévia: Excelente',
    '    Symptoms: Found deceased, no visible trauma':
      '    Sintomas: Encontrado morto, sem trauma visível',
    '    Necropsy: Internal hemorrhaging, organ failure':
      '    Necrópsia: Hemorragia interna, falência de órgãos',
    '  24-JAN 14:00 — OCELOT (Leopardus pardalis)':
      '  24-JAN 14:00 — JAGUATIRICA (Leopardus pardalis)',
    '    Age: 5 years':
      '    Idade: 5 anos',
    '    Prior health: Good':
      '    Saúde prévia: Boa',
    '    Symptoms: Seizures, rapid decline':
      '    Sintomas: Convulsões, declínio rápido',
    '    Necropsy: Neurological damage, cause unknown':
      '    Necrópsia: Dano neurológico, causa desconhecida',
    '  25-JAN 08:30 — DEER (Mazama americana)':
      '  25-JAN 08:30 — VEADO (Mazama americana)',
    '    Age: 3 years':
      '    Idade: 3 anos',
    '    Symptoms: Extreme agitation, then collapse':
      '    Sintomas: Agitação extrema, depois colapso',
    '    Necropsy: Cardiac arrest, elevated cortisol':
      '    Necrópsia: Parada cardíaca, cortisol elevado',
    '  27-JAN 03:00 — CAPYBARA (Hydrochoerus hydrochaeris)':
      '  27-JAN 03:00 — CAPIVARA (Hydrochoerus hydrochaeris)',
    '    Age: 6 years':
      '    Idade: 6 anos',
    '    Symptoms: Refused food, tremors':
      '    Sintomas: Recusou alimento, tremores',
    '    Necropsy: Multi-organ failure':
      '    Necrópsia: Falência múltipla de órgãos',
    'VETERINARIAN ASSESSMENT (Dr. Ana FERREIRA):':
      'AVALIAÇÃO VETERINÁRIA (Dra. Ana FERREIRA):',
    '  "These deaths are unprecedented. The animals showed':
      '  "Essas mortes são sem precedentes. Os animais não mostraram',
    '   no prior illness. The pattern suggests exposure to':
      '   doença prévia. O padrão sugere exposição a',
    '   an unknown pathogen or toxin. The proximity of':
      '   um patógeno ou toxina desconhecida. A proximidade das',
    '   deaths to the reported incident on 20-JAN cannot':
      '   mortes com o incidente reportado em 20-JAN não pode',
    '   be coincidental."':
      '   ser coincidência."',
    'OPERATIONAL NOTE:':
      'NOTA OPERACIONAL:',
    '  Animals were housed in enclosures adjacent to':
      '  Os animais estavam alojados em recintos adjacentes à',
    '  the TEMPORARY HOLDING area used 20-21 JAN.':
      '  área de CONTENÇÃO TEMPORÁRIA usada em 20-21 JAN.',
    '  Possible contamination from "fauna specimen"':
      '  Possível contaminação do espécime de "fauna"',
    '  containment breach. Investigation ongoing.':
      '  por falha de contenção. Investigação em andamento.',
    // ═══ expansionContent.ts — veterinarian_silencing ═══
    'CONTAINMENT ACTION — ZOO VETERINARIAN':
      'AÇÃO DE CONTENÇÃO — VETERINÁRIA DO ZOOLÓGICO',
    'DATE: 30-JAN-1996':
      'DATA: 30-JAN-1996',
    'SUBJECT: Dr. Ana FERREIRA':
      'SUJEITO: Dra. Ana FERREIRA',
    'Position: Chief Veterinarian, Zoológico Municipal':
      'Cargo: Veterinária-Chefe, Zoológico Municipal',
    'Threat level: MODERATE':
      'Nível de ameaça: MODERADO',
    '  Dr. Ferreira has made connection between animal':
      '  Dra. Ferreira fez conexão entre as mortes',
    '  deaths and classified incident. Has documented':
      '  de animais e o incidente classificado. Documentou',
    '  anomalous necropsy findings. Seeking external':
      '  achados anômalos de necrópsia. Buscando',
    '  consultation.':
      '  consulta externa.',
    'ACTIONS TAKEN:':
      'AÇÕES TOMADAS:',
    '  25-JAN: Initial contact (Protocol SOMBRA)':
      '  25-JAN: Contato inicial (Protocolo SOMBRA)',
    '    Outcome: PARTIALLY COOPERATIVE':
      '    Resultado: PARCIALMENTE COOPERATIVO',
    '    Agreed to delay external consultation':
      '    Concordou em adiar consulta externa',
    '  28-JAN: Necropsy samples CONFISCATED':
      '  28-JAN: Amostras de necrópsia CONFISCADAS',
    '    Cover: "Public health authority directive"':
      '    Cobertura: "Diretiva da autoridade de saúde pública"',
    '    Note: Samples transferred to secure facility':
      '    Nota: Amostras transferidas para instalação segura',
    '  29-JAN: Administrative pressure applied':
      '  29-JAN: Pressão administrativa aplicada',
    '    Zoo director instructed to reassign subject':
      '    Diretor do zoológico instruído a realocar sujeito',
    '    "Extended leave" suggested':
      '    "Licença prolongada" sugerida',
    '  30-JAN: Follow-up visit (COBRA team)':
      '  30-JAN: Visita de acompanhamento (equipe COBRA)',
    '    Duration: 2 hours':
      '    Duração: 2 horas',
    '    Outcome: FULLY COOPERATIVE':
      '    Resultado: TOTALMENTE COOPERATIVO',
    '    Signed: NDA, statement attributing deaths to':
      '    Assinou: Termo de confidencialidade, declaração atribuindo mortes a',
    '            "contaminated feed shipment"':
      '            "carregamento de ração contaminada"',
    'CURRENT STATUS:':
      'STATUS ATUAL:',
    '  Subject on administrative leave':
      '  Sujeito em licença administrativa',
    '  No media contact authorized':
      '  Nenhum contato com a mídia autorizado',
    '  Monitoring: 90 days':
      '  Monitoramento: 90 dias',
    'ADDITIONAL MEASURE:':
      'MEDIDA ADICIONAL:',
    '  Subject\\\'s husband works at state university':
      '  O marido do sujeito trabalha na universidade estadual',
    '  Employment pressure available if needed':
      '  Pressão empregatícia disponível se necessário',
    // ═══ expansionContent.ts — contamination_theory ═══
    'OFFICIAL EXPLANATION — ZOO ANIMAL DEATHS':
      'EXPLICAÇÃO OFICIAL — MORTES DE ANIMAIS DO ZOOLÓGICO',
    'FOR: Public Release / Media Inquiry':
      'PARA: Divulgação Pública / Consulta da Mídia',
    'DATE: 01-FEB-1996':
      'DATA: 01-FEV-1996',
    'PRESS STATEMENT:':
      'COMUNICADO À IMPRENSA:',
    '  "The Varginha Municipal Zoo regrets to announce':
      '  "O Zoológico Municipal de Varginha lamenta anunciar',
    '   the loss of four animals during the last week':
      '   a perda de quatro animais durante a última semana',
    '   of January 1996.':
      '   de janeiro de 1996.',
    '   Investigation has determined that the cause was':
      '   A investigação determinou que a causa foi',
    '   a contaminated shipment of animal feed received':
      '   um carregamento contaminado de ração animal recebido',
    '   on January 18th.':
      '   em 18 de janeiro.',
    '   The contamination has been traced to improper':
      '   A contaminação foi rastreada até armazenamento',
    '   storage at the supplier facility. All remaining':
      '   inadequado nas instalações do fornecedor. Toda a ração',
    '   feed from this shipment has been destroyed.':
      '   remanescente deste carregamento foi destruída.',
    '   The zoo has taken steps to prevent future':
      '   O zoológico tomou medidas para prevenir futuros',
    '   incidents. New supplier verification protocols':
      '   incidentes. Novos protocolos de verificação de fornecedores',
    '   are being implemented.':
      '   estão sendo implementados.',
    '   We appreciate the community\\\'s understanding."':
      '   Agradecemos a compreensão da comunidade."',
    'INTERNAL NOTE (DO NOT RELEASE):':
      'NOTA INTERNA (NÃO DIVULGAR):',
    '  This explanation is for public consumption only.':
      '  Esta explicação é apenas para consumo público.',
    '  Feed shipment records have been altered to support.':
      '  Registros de carregamento de ração foram alterados para corroborar.',
    '  Supplier has been compensated for cooperation.':
      '  Fornecedor foi compensado pela cooperação.',
    '  Actual cause: Proximity contamination from':
      '  Causa real: Contaminação por proximidade do',
    '  temporary holding of recovered fauna specimen.':
      '  confinamento temporário do espécime de fauna recuperado.',
    '  See: /ops/zoo/animal_deaths_report.txt':
      '  Ver: /ops/zoo/animal_deaths_report.txt',
    // ═══ expansionContent.ts — chereze_incident_report ═══
    'INCIDENT REPORT — OFFICER [CLASSIFIED]':
      'RELATÓRIO DE INCIDENTE — OFICIAL [CLASSIFICADO]',
    'CLASSIFICATION: TOP SECRET':
      'CLASSIFICAÇÃO: ULTRA SECRETO',
    'FILE: VAR-96-MED-007':
      'ARQUIVO: VAR-96-MED-007',
    'SUBJECT: [CLASSIFIED], Corporal':
      'SUJEITO: [CLASSIFICADO], Cabo',
    'Rank: Corporal, Military Police':
      'Patente: Cabo, Polícia Militar',
    'Unit: 4th Company, Varginha':
      'Unidade: 4ª Companhia, Varginha',
    'Status: DECEASED (15-FEB-1996)':
      'Status: FALECIDO (15-FEV-1996)',
    'TIMELINE OF EVENTS:':
      'CRONOLOGIA DOS EVENTOS:',
    '20-JAN 21:30':
      '20-JAN 21:30',
    '  The officer responds to call regarding':
      '  O oficial responde a chamado referente a',
    '  "strange animal" in Jardim Andere area.':
      '  "animal estranho" na área do Jardim Andere.',
    '  Arrives at scene, assists with containment.':
      '  Chega ao local, auxilia na contenção.',
    '20-JAN 22:15':
      '20-JAN 22:15',
    '  Officer makes direct physical contact with':
      '  Oficial faz contato físico direto com',
    '  fauna specimen during loading operation.':
      '  espécime de fauna durante operação de carregamento.',
    '  Contact area: Left forearm, bare skin.':
      '  Área de contato: Antebraço esquerdo, pele exposta.',
    '  Duration: Approximately 3-4 seconds.':
      '  Duração: Aproximadamente 3-4 segundos.',
    '21-JAN 08:00':
      '21-JAN 08:00',
    '  Officer reports to duty, notes mild fatigue.':
      '  Oficial se apresenta para serviço, relata fadiga leve.',
    '  Attributes to late shift previous night.':
      '  Atribui ao turno tardio da noite anterior.',
    '23-JAN':
      '23-JAN',
    '  Officer complains of headaches, joint pain.':
      '  Oficial reclama de dores de cabeça, dores articulares.',
    '  Skin irritation noted at contact site.':
      '  Irritação cutânea observada no local de contato.',
    '  Reports "strange dreams."':
      '  Relata "sonhos estranhos."',
    '27-JAN':
      '27-JAN',
    '  Officer hospitalized with fever, weakness.':
      '  Oficial hospitalizado com febre, fraqueza.',
    '  Diagnosis: "Unknown infection"':
      '  Diagnóstico: "Infecção desconhecida"',
    '  Blood work shows anomalous markers.':
      '  Exames de sangue mostram marcadores anômalos.',
    '02-FEB':
      '02-FEV',
    '  Condition deteriorates rapidly.':
      '  Condição deteriora rapidamente.',
    '  Multiple organ systems affected.':
      '  Múltiplos sistemas orgânicos afetados.',
    '  Transfer to military hospital (São Paulo).':
      '  Transferência para hospital militar (São Paulo).',
    '15-FEB 03:47':
      '15-FEV 03:47',
    '  The officer expires.':
      '  O oficial vem a óbito.',
    '  Official cause: "Pneumonia complications"':
      '  Causa oficial: "Complicações de pneumonia"',
    'MEDICAL NOTES (SUPPRESSED):':
      'NOTAS MÉDICAS (SUPRIMIDAS):',
    '  Attending physician noted:':
      '  Médico responsável observou:',
    '  - Tissue necrosis at contact site':
      '  - Necrose tecidual no local de contato',
    '  - Unprecedented immune system collapse':
      '  - Colapso imunológico sem precedentes',
    '  - Unidentifiable pathogen in blood samples':
      '  - Patógeno não identificável em amostras de sangue',
    '  - Brain scans showed unusual activity patterns':
      '  - Exames cerebrais mostraram padrões de atividade incomuns',
    '  Physician quote (recorded):':
      '  Citação do médico (gravada):',
    '  "I have never seen anything like this.':
      '  "Eu nunca vi nada parecido com isso.',
    '   This is not any known disease."':
      '   Isso não é nenhuma doença conhecida."',
    'CONTAINMENT ACTIONS:':
      'AÇÕES DE CONTENÇÃO:',
    '  - Medical records CLASSIFIED':
      '  - Registros médicos CLASSIFICADOS',
    '  - Attending physician reassigned':
      '  - Médico responsável transferido',
    '  - Blood samples transferred to [REDACTED]':
      '  - Amostras de sangue transferidas para [SUPRIMIDO]',
    '  - Family briefed on "pneumonia" cause':
      '  - Família informada sobre causa "pneumonia"',
    '  - Compensation package arranged':
      '  - Pacote de compensação providenciado',
    // ═══ expansionContent.ts — autopsy_suppression ═══
    'DIRECTIVE — AUTOPSY SUPPRESSION':
      'DIRETIVA — SUPRESSÃO DE AUTÓPSIA',
    'DATE: 16-FEB-1996':
      'DATA: 16-FEV-1996',
    'RE: Remains of the deceased corporal':
      'REF: Restos mortais do cabo falecido',
    'Per authority of [REDACTED], the following directive':
      'Por autoridade de [SUPRIMIDO], a seguinte diretiva',
    'is IMMEDIATELY effective:':
      'é IMEDIATAMENTE efetiva:',
    '1. Standard autopsy procedure is CANCELLED.':
      '1. Procedimento padrão de autópsia está CANCELADO.',
    '2. A modified examination will be conducted by':
      '2. Um exame modificado será conduzido por',
    '   cleared personnel from Project HARVEST only.':
      '   pessoal credenciado somente do Projeto HARVEST.',
    '3. All tissue samples are classified and must be':
      '3. Todas as amostras de tecido são classificadas e devem ser',
    '   transferred to [REDACTED] facility.':
      '   transferidas para instalação [SUPRIMIDA].',
    '4. The official autopsy report will state:':
      '4. O laudo oficial de autópsia declarará:',
    '   "Cause of death: Respiratory failure':
      '   "Causa da morte: Insuficiência respiratória',
    '    secondary to pneumonia complications."':
      '    secundária a complicações de pneumonia."',
    '5. No copy of actual findings will be retained':
      '5. Nenhuma cópia dos achados reais será mantida',
    '   at the hospital or municipal morgue.':
      '   no hospital ou necrotério municipal.',
    'JUSTIFICATION:':
      'JUSTIFICATIVA:',
    '  Subject\\\'s exposure to recovered fauna specimen':
      '  A exposição do sujeito ao espécime de fauna recuperado',
    '  resulted in contamination of unknown nature.':
      '  resultou em contaminação de natureza desconhecida.',
    '  Pathological findings could compromise ongoing':
      '  Achados patológicos poderiam comprometer operações',
    '  containment operations if disclosed.':
      '  de contenção em andamento se divulgados.',
    '  The anomalous pathogen must be studied under':
      '  O patógeno anômalo deve ser estudado sob',
    '  controlled conditions only.':
      '  condições controladas apenas.',
    'SECURITY NOTE:':
      'NOTA DE SEGURANÇA:',
    '  Any medical personnel who observed actual condition':
      '  Qualquer pessoal médico que observou a condição real',
    '  of the deceased are to be debriefed immediately':
      '  do falecido deve ser interrogado imediatamente',
    '  under Protocol SOMBRA.':
      '  sob o Protocolo SOMBRA.',
    '  NDA signatures required from all parties.':
      '  Assinaturas de termo de confidencialidade exigidas de todas as partes.',
    // ═══ expansionContent.ts — family_compensation ═══
    'COMPENSATION ARRANGEMENT — OFFICER\'S FAMILY':
      'ACORDO DE COMPENSAÇÃO — FAMÍLIA DO OFICIAL',
    'DATE: 20-FEB-1996':
      'DATA: 20-FEV-1996',
    'BENEFICIARIES:':
      'BENEFICIÁRIOS:',
    '  Wife: [REDACTED]':
      '  Esposa: [SUPRIMIDO]',
    '  Children: 2 (ages 7 and 4)':
      '  Filhos: 2 (idades 7 e 4)',
    'OFFICIAL BENEFITS (Standard):':
      'BENEFÍCIOS OFICIAIS (Padrão):',
    '  - Death in service pension':
      '  - Pensão por morte em serviço',
    '  - Life insurance payout':
      '  - Pagamento de seguro de vida',
    '  - Educational benefits for children':
      '  - Benefícios educacionais para os filhos',
    '  Total official: R$ 45,000.00':
      '  Total oficial: R$ 45.000,00',
    'SUPPLEMENTAL COMPENSATION (Classified):':
      'COMPENSAÇÃO SUPLEMENTAR (Classificada):',
    '  Purpose: Ensure family silence regarding':
      '  Finalidade: Garantir silêncio da família sobre',
    '           circumstances of death.':
      '           as circunstâncias da morte.',
    '  Initial payment: R$ 50,000.00 (cash)':
      '  Pagamento inicial: R$ 50.000,00 (em espécie)',
    '  Monthly stipend: R$ 2,000.00 (5 years)':
      '  Pensão mensal: R$ 2.000,00 (5 anos)',
    '  Housing: Apartment (paid, Belo Horizonte)':
      '  Moradia: Apartamento (pago, Belo Horizonte)',
    '  Employment: Government position for wife':
      '  Emprego: Cargo público para a esposa',
    '  Total supplemental: ~R$ 220,000.00':
      '  Total suplementar: ~R$ 220.000,00',
    'CONDITIONS:':
      'CONDIÇÕES:',
    '  - Family agrees to "pneumonia" narrative':
      '  - Família concorda com narrativa de "pneumonia"',
    '  - No media interviews (ever)':
      '  - Nenhuma entrevista na mídia (nunca)',
    '  - No legal action against government':
      '  - Nenhuma ação legal contra o governo',
    '  - Relocation from Varginha (within 30 days)':
      '  - Mudança de Varginha (dentro de 30 dias)',
    '  - No contact with UFO investigators':
      '  - Nenhum contato com investigadores de OVNIs',
    '  Signed: [WIFE OF OFFICER], 20-FEB-1996':
      '  Assinado: [ESPOSA DO OFICIAL], 20-FEV-1996',
    'NOTE: Family moved to Belo Horizonte 15-MAR-1996':
      'NOTA: Família mudou-se para Belo Horizonte 15-MAR-1996',
    '      Monitoring: Low priority (cooperative)':
      '      Monitoramento: Baixa prioridade (cooperativa)',
    // ═══ expansionContent.ts — coffee_harvest_report ═══
    'REGIONAL ECONOMIC REPORT — COFFEE SECTOR':
      'RELATÓRIO ECONÔMICO REGIONAL — SETOR CAFEEIRO',
    'PERIOD: Q1 1996':
      'PERÍODO: 1º TRIM 1996',
    'REGION: Sul de Minas':
      'REGIÃO: Sul de Minas',
    'MARKET CONDITIONS:':
      'CONDIÇÕES DE MERCADO:',
    '  The Sul de Minas coffee region continues to be':
      '  A região cafeeira do Sul de Minas continua sendo',
    '  Brazil\\\'s premier arabica production zone.':
      '  a principal zona de produção de arábica do Brasil.',
    '  Current harvest: PROGRESSING NORMALLY':
      '  Colheita atual: PROGREDINDO NORMALMENTE',
    '  Expected yield: 2.3 million bags':
      '  Produção esperada: 2,3 milhões de sacas',
    '  Quality assessment: ABOVE AVERAGE':
      '  Avaliação de qualidade: ACIMA DA MÉDIA',
    'PRICE INDICATORS:':
      'INDICADORES DE PREÇO:',
    '  NYC Commodity Exchange: $1.42/lb (Jan avg)':
      '  Bolsa de Commodities de NYC: $1,42/lb (média Jan)',
    '  Local cooperative price: R$ 85.00/bag':
      '  Preço da cooperativa local: R$ 85,00/saca',
    '  Trend: STABLE with slight upward pressure':
      '  Tendência: ESTÁVEL com leve pressão de alta',
    'REGIONAL NOTES:':
      'NOTAS REGIONAIS:',
    '  - Varginha remains the region\\\'s logistics hub':
      '  - Varginha permanece o centro logístico da região',
    '  - Railroad capacity adequate for current volume':
      '  - Capacidade ferroviária adequada para o volume atual',
    '  - Export documentation processing normal':
      '  - Processamento de documentação de exportação normal',
    'LABOR:':
      'MÃO DE OBRA:',
    '  - Seasonal workers arriving as expected':
      '  - Trabalhadores sazonais chegando conforme esperado',
    '  - No significant disputes reported':
      '  - Nenhuma disputa significativa reportada',
    'ASSESSMENT:':
      'AVALIAÇÃO:',
    '  Coffee sector operation NORMAL.':
      '  Operação do setor cafeeiro NORMAL.',
    '  No economic anomalies detected.':
      '  Nenhuma anomalia econômica detectada.',
    // ═══ expansionContent.ts — weather_report_jan96 ═══
    'METEOROLOGICAL SUMMARY — JANUARY 1996':
      'RESUMO METEOROLÓGICO — JANEIRO 1996',
    'STATION: Varginha Regional':
      'ESTAÇÃO: Varginha Regional',
    'COORDINATES: 21°33\'S, 45°26\'W':
      'COORDENADAS: 21°33\'S, 45°26\'W',
    '  January 1996 exhibited typical summer patterns':
      '  Janeiro de 1996 apresentou padrões típicos de verão',
    '  for the Sul de Minas region.':
      '  para a região do Sul de Minas.',
    'KEY DATES:':
      'DATAS-CHAVE:',
    '  19-JAN-1996:':
      '  19-JAN-1996:',
    '    Temperature: 28°C (max) / 18°C (min)':
      '    Temperatura: 28°C (máx) / 18°C (mín)',
    '    Precipitation: 12mm':
      '    Precipitação: 12mm',
    '    Cloud cover: Partial (40%)':
      '    Cobertura de nuvens: Parcial (40%)',
    '    Wind: NE, 15-20 km/h':
      '    Vento: NE, 15-20 km/h',
    '    SPECIAL: Clear sky after 22:00':
      '    ESPECIAL: Céu limpo após 22:00',
    '  20-JAN-1996:':
      '  20-JAN-1996:',
    '    Temperature: 31°C (max) / 19°C (min)':
      '    Temperatura: 31°C (máx) / 19°C (mín)',
    '    Precipitation: 0mm':
      '    Precipitação: 0mm',
    '    Cloud cover: Minimal (15%)':
      '    Cobertura de nuvens: Mínima (15%)',
    '    Wind: Calm':
      '    Vento: Calmo',
    '    SPECIAL: Excellent visibility':
      '    ESPECIAL: Excelente visibilidade',
    '  21-JAN-1996:':
      '  21-JAN-1996:',
    '    Temperature: 29°C (max) / 17°C (min)':
      '    Temperatura: 29°C (máx) / 17°C (mín)',
    '    Precipitation: 8mm (evening)':
      '    Precipitação: 8mm (noite)',
    '    Cloud cover: Building afternoon':
      '    Cobertura de nuvens: Acumulando à tarde',
    '    Wind: Variable':
      '    Vento: Variável',
    'NOTE: No unusual atmospheric phenomena recorded.':
      'NOTA: Nenhum fenômeno atmosférico incomum registrado.',
    '      Standard summer conditions for region.':
      '      Condições padrão de verão para a região.',
    // ═══ expansionContent.ts — local_politics_memo ═══
    'POLITICAL SUMMARY — VARGINHA MUNICIPALITY':
      'RESUMO POLÍTICO — MUNICÍPIO DE VARGINHA',
    'DATE: 15-JAN-1996':
      'DATA: 15-JAN-1996',
    'ROUTINE ASSESSMENT':
      'AVALIAÇÃO DE ROTINA',
    'CURRENT ADMINISTRATION:':
      'ADMINISTRAÇÃO ATUAL:',
    '  Mayor: [REDACTED]':
      '  Prefeito: [SUPRIMIDO]',
    '  Party: PMDB':
      '  Partido: PMDB',
    '  Term: 1993-1996 (final year)':
      '  Mandato: 1993-1996 (último ano)',
    'POLITICAL CLIMATE:':
      'CLIMA POLÍTICO:',
    '  - Municipal elections scheduled October 1996':
      '  - Eleições municipais previstas para outubro de 1996',
    '  - Current administration approval: MODERATE':
      '  - Aprovação da administração atual: MODERADA',
    '  - No significant controversies':
      '  - Nenhuma controvérsia significativa',
    'NOTABLE DEVELOPMENTS:':
      'DESENVOLVIMENTOS NOTÁVEIS:',
    '  - Infrastructure projects on schedule':
      '  - Projetos de infraestrutura dentro do cronograma',
    '  - Coffee cooperative relations stable':
      '  - Relações com cooperativa cafeeira estáveis',
    '  - Hospital expansion approved':
      '  - Expansão do hospital aprovada',
    '  - School enrollment increasing':
      '  - Matrículas escolares em crescimento',
    'SECURITY CONCERNS:':
      'PREOCUPAÇÕES DE SEGURANÇA:',
    '  - Petty crime: Within normal parameters':
      '  - Criminalidade menor: Dentro dos parâmetros normais',
    '  - Organized crime: No presence detected':
      '  - Crime organizado: Nenhuma presença detectada',
    '  - Labor unrest: None':
      '  - Conflitos trabalhistas: Nenhum',
    '  Politically stable region.':
      '  Região politicamente estável.',
    '  No monitoring priority.':
      '  Sem prioridade de monitoramento.',
    // ═══ expansionContent.ts — municipal_budget_96 ═══
    'MUNICIPAL BUDGET ALLOCATION — 1996':
      'ALOCAÇÃO ORÇAMENTÁRIA MUNICIPAL — 1996',
    'VARGINHA PREFECTURE':
      'PREFEITURA DE VARGINHA',
    'PROJECTED REVENUE: R$ 42,500,000.00':
      'RECEITA PROJETADA: R$ 42.500.000,00',
    'ALLOCATION BY SECTOR:':
      'ALOCAÇÃO POR SETOR:',
    '  Education ................ 28% (R$ 11,900,000)':
      '  Educação ................. 28% (R$ 11.900.000)',
    '  Health ................... 22% (R$  9,350,000)':
      '  Saúde .................... 22% (R$  9.350.000)',
    '  Infrastructure ........... 18% (R$  7,650,000)':
      '  Infraestrutura ........... 18% (R$  7.650.000)',
    '  Public Safety ............ 12% (R$  5,100,000)':
      '  Segurança Pública ........ 12% (R$  5.100.000)',
    '  Administration ........... 10% (R$  4,250,000)':
      '  Administração ............ 10% (R$  4.250.000)',
    '  Culture & Sports .........  5% (R$  2,125,000)':
      '  Cultura e Esportes .......  5% (R$  2.125.000)',
    '  Reserve ..................  5% (R$  2,125,000)':
      '  Reserva ..................  5% (R$  2.125.000)',
    'SPECIAL PROJECTS:':
      'PROJETOS ESPECIAIS:',
    '  - Hospital wing expansion (Phase 2)':
      '  - Expansão da ala hospitalar (Fase 2)',
    '  - School renovation program':
      '  - Programa de reforma escolar',
    '  - Road maintenance (Rte. 381)':
      '  - Manutenção rodoviária (Rod. 381)',
    '  - Municipal zoo improvements':
      '  - Melhorias no zoológico municipal',
    'STATUS: Approved by City Council, 18-DEC-1995':
      'STATUS: Aprovado pela Câmara Municipal, 18-DEZ-1995',
    // ═══ expansionContent.ts — railroad_schedule ═══
    'RAILROAD TRAFFIC — VARGINHA STATION':
      'TRÁFEGO FERROVIÁRIO — ESTAÇÃO VARGINHA',
    'SCHEDULE: JANUARY 1996':
      'HORÁRIOS: JANEIRO 1996',
    'REGULAR FREIGHT SERVICE:':
      'SERVIÇO REGULAR DE CARGA:',
    '  Mon-Fri 06:00 — Coffee cargo (southbound)':
      '  Seg-Sex 06:00 — Carga de café (sentido sul)',
    '  Mon-Fri 14:00 — Industrial goods (northbound)':
      '  Seg-Sex 14:00 — Bens industriais (sentido norte)',
    '  Tue-Thu 22:00 — Overnight freight':
      '  Ter-Qui 22:00 — Carga noturna',
    'SPECIAL MOVEMENTS:':
      'MOVIMENTOS ESPECIAIS:',
    '  20-JAN 03:30 — MILITARY (classified)':
      '  20-JAN 03:30 — MILITAR (classificado)',
    '                 Authorization: Regional Command':
      '                 Autorização: Comando Regional',
    '                 Cars: 3 (covered freight)':
      '                 Vagões: 3 (carga coberta)',
    '                 Destination: Campinas':
      '                 Destino: Campinas',
    '  21-JAN 01:15 — MILITARY (classified)':
      '  21-JAN 01:15 — MILITAR (classificado)',
    '                 Cars: 1 (refrigerated)':
      '                 Vagões: 1 (refrigerado)',
    '                 Destination: São Paulo':
      '                 Destino: São Paulo',
    'NOTE: Military movements not subject to':
      'NOTA: Movimentos militares não sujeitos a',
    '      standard scheduling protocols.':
      '      protocolos de programação padrão.',
    // ═══ expansionContent.ts — fire_department_log ═══
    'FIRE DEPARTMENT — INCIDENT LOG':
      'CORPO DE BOMBEIROS — REGISTRO DE OCORRÊNCIAS',
    'STATION: Varginha Central':
      'QUARTEL: Varginha Central',
    'PERIOD: 15-25 JAN 1996':
      'PERÍODO: 15-25 JAN 1996',
    '15-JAN 14:22 — Grass fire, Rte. 381 km 42':
      '15-JAN 14:22 — Incêndio em vegetação, Rod. 381 km 42',
    '               Cause: Cigarette':
      '               Causa: Cigarro',
    '               Resolved: 15:45':
      '               Resolvido: 15:45',
    '17-JAN 09:15 — Smoke alarm, Hospital Regional':
      '17-JAN 09:15 — Alarme de fumaça, Hospital Regional',
    '               Cause: Electrical short':
      '               Causa: Curto-circuito',
    '               Resolved: 10:00':
      '               Resolvido: 10:00',
    '18-JAN 21:30 — Vehicle fire, downtown':
      '18-JAN 21:30 — Incêndio veicular, centro',
    '               Cause: Engine failure':
      '               Causa: Falha no motor',
    '               Resolved: 22:15':
      '               Resolvido: 22:15',
    '20-JAN 16:45 — [REDACTED]':
      '20-JAN 16:45 — [SUPRIMIDO]',
    '               Location: Jardim Andere':
      '               Local: Jardim Andere',
    '               Authorization: Military Police':
      '               Autorização: Polícia Militar',
    '               Resolved: [CLASSIFIED]':
      '               Resolvido: [CLASSIFICADO]',
    '20-JAN 23:00 — [REDACTED]':
      '20-JAN 23:00 — [SUPRIMIDO]',
    '               Location: [CLASSIFIED]':
      '               Local: [CLASSIFICADO]',
    '               Authorization: Regional Command':
      '               Autorização: Comando Regional',
    '22-JAN 11:30 — Kitchen fire, residential':
      '22-JAN 11:30 — Incêndio em cozinha, residencial',
    '               Cause: Cooking oil':
      '               Causa: Óleo de cozinha',
    '               Resolved: 11:50':
      '               Resolvido: 11:50',
    '24-JAN 16:00 — False alarm, school':
      '24-JAN 16:00 — Alarme falso, escola',
    '               Cause: Student prank':
      '               Causa: Brincadeira de estudante',
    '               Resolved: 16:15':
      '               Resolvido: 16:15',
  },
  es: {
    'Speed Demon': 'Demonio de la Velocidad',
    'Complete the game in under 50 commands': 'Completa el juego en menos de 50 comandos',
    'Ghost Protocol': 'Protocolo Fantasma',
    'Win with detection level under 20%': 'Gana con nivel de detección por debajo del 20%',
    Completionist: 'Completista',
    'Read every accessible file in the system': 'Lee todos los archivos accesibles del sistema',
    Pacifist: 'Pacifista',
    'Never trigger a warning or alert': 'Nunca actives una advertencia o alerta',
    'Curious Mind': 'Mente Curiosa',
    'Find all easter eggs': 'Encuentra todos los easter eggs',
    'First Blood': 'Primera Sangre',
    'Discover your first evidence': 'Descubre tu primera evidencia',
    'Elite Hacker': 'Hacker de Élite',
    'Decrypt 5 encrypted files': 'Descifra 5 archivos encriptados',
    Survivor: 'Superviviente',
    'Complete the game after reaching critical detection': 'Completa el juego tras alcanzar detección crítica',
    Mathematician: 'Matemático',
    'Solve all equations on first try': 'Resuelve todas las ecuaciones al primer intento',
    'Truth Seeker': 'Buscador de la Verdad',
    'Collect 5 evidence files': 'Reúne 5 archivos de evidencia',
    Persistent: 'Persistente',
    'Continue playing after a game over': 'Sigue jugando después de un game over',
    Archivist: 'Archivista',
    'Read every file in a folder with 3+ files': 'Lee todos los archivos de una carpeta con 3+ archivos',
    Paranoid: 'Paranoico',
    'Check system status 10+ times': 'Revisa el estado del sistema 10+ veces',
    Bookworm: 'Ratón de Biblioteca',
    'Bookmark 5+ files': 'Marca 5+ archivos',
    'Night Owl': 'Búho Nocturno',
    'Play for over 30 minutes in a single session': 'Juega más de 30 minutos en una sola sesión',
    Liberator: 'Liberador',
    'Release ALPHA from containment': 'Libera a ALPHA de la contención',
    Whistleblower: 'Denunciante',
    'Leak the conspiracy files to the world': 'Filtra los archivos de conspiración al mundo',
    'Neural Link': 'Enlace Neural',
    'Connect to the alien consciousness': 'Conéctate a la conciencia alienígena',
    'Complete Revelation': 'Revelación Completa',
    'Achieve the ultimate ending with all modifiers': 'Logra el final definitivo con todos los modificadores',
    'Controlled Disclosure': 'Divulgación Controlada',
    'Complete the game with a clean leak': 'Completa el juego con una filtración limpia',
    'Global Panic': 'Pánico Global',
    'Leak conspiracy files and watch the world burn': 'Filtra archivos de conspiración y mira arder el mundo',
    'Undeniable Proof': 'Prueba Innegable',
    'Release ALPHA and prove aliens exist': 'Libera a ALPHA y prueba que existen los alienígenas',
    'Total Collapse': 'Colapso Total',
    'Release ALPHA and leak conspiracies': 'Libera a ALPHA y filtra conspiraciones',
    'Personal Contamination': 'Contaminación Personal',
    'Use the neural link and feel the alien presence': 'Usa el enlace neural y siente la presencia alienígena',
    'Paranoid Awakening': 'Despertar Paranoico',
    'Leak conspiracies while neurally linked': 'Filtra conspiraciones mientras estás enlazado neuralmente',
    'Witnessed Truth': 'Verdad Presenciada',
    'Release ALPHA while neurally linked': 'Libera a ALPHA mientras estás enlazado neuralmente',

    'UFO74: that wreckage... wrong metallurgy.': 'UFO74: esos restos... metalurgia equivocada.',
    'UFO74: they moved fast. knew what to hide.': 'UFO74: se movieron rápido. sabían qué ocultar.',
    'UFO74: seen that face in dreams.': 'UFO74: he visto esa cara en sueños.',
    'UFO74: not fear in those eyes. recognition.': 'UFO74: no era miedo en esos ojos. reconocimiento.',
    'UFO74: during transmission, something reached back.': 'UFO74: durante la transmisión, algo respondió.',
    'UFO74: let itself be captured.': 'UFO74: se dejó capturar.',
    'UFO74: SECOND one? they were arriving.': 'UFO74: ¿UN SEGUNDO? estaban llegando.',
    'UFO74: no propulsion. no control surfaces. yet it flies.': 'UFO74: sin propulsión. sin superficies de control. y aun así vuela.',
    'UFO74: three recovery sites. shipped everything out.': 'UFO74: tres sitios de recuperación. se llevaron todo.',
    'UFO74: neural density off the charts.': 'UFO74: densidad neural fuera de escala.',
    'UFO74: some patterns travel both ways. careful.': 'UFO74: algunos patrones viajan en ambos sentidos. cuidado.',

    '▓▓▓ CONNECTION INTERRUPTED ▓▓▓': '▓▓▓ CONEXIÓN INTERRUMPIDA ▓▓▓',
    'SYSTEM DETECTED UNAUTHORIZED ACCESS': 'EL SISTEMA DETECTÓ ACCESO NO AUTORIZADO',
    'INITIATING PURGE PROTOCOL...': 'INICIANDO PROTOCOLO DE PURGA...',
    'CLEARING SYSTEM CACHE': 'LIMPIANDO CACHÉ DEL SISTEMA',
    'Removing session logs...': 'Eliminando registros de sesión...',
    'Erasing access records...': 'Borrando registros de acceso...',
    'Destroying active connections...': 'Destruyendo conexiones activas...',
    'Finalizing purge...': 'Finalizando purga...',
    'UFO74: hackerkid... are you still there?': 'UFO74: hackerkid... ¿sigues ahí?',
    'UFO74: they cut the main connection.': 'UFO74: cortaron la conexión principal.',
    'UFO74: i knew this was going to happen.': 'UFO74: sabía que esto iba a pasar.',
    'UFO74: but listen... the evidence is saved.': 'UFO74: pero escucha... la evidencia está guardada.',
    'UFO74: it persisted outside the system that was wiped.': 'UFO74: sobrevivió fuera del sistema que borraron.',
    'UFO74: now you need another way to send this out.': 'UFO74: ahora necesitas otra forma de sacar esto.',
    'UFO74: wait... i have an idea.': 'UFO74: espera... tengo una idea.',
    'UFO74: i can "hang" the connection on a civilian computer.': 'UFO74: puedo "colgar" la conexión en una computadora civil.',
    'UFO74: its risky but its the only chance.': 'UFO74: es arriesgado, pero es la única oportunidad.',
    'UFO74: i found someone online... a teenager on ICQ.': 'UFO74: encontré a alguien en línea... un adolescente en ICQ.',
    'UFO74: im going to transfer you there.': 'UFO74: voy a transferirte allí.',
    'UFO74: convince them to save the files on physical media.': 'UFO74: convéncelo de guardar los archivos en medio físico.',
    'UFO74: floppy disk, CD, anything.': 'UFO74: disquete, CD, lo que sea.',
    'UFO74: good luck hackerkid. its all up to you now.': 'UFO74: suerte, hackerkid. ahora todo depende de ti.',
    '>> INITIATING CONNECTION TRANSFER <<': '>> INICIANDO TRANSFERENCIA DE CONEXIÓN <<',
    '│ >> UFO74 << EMERGENCY TRANSMISSION │': '│ >> UFO74 << TRANSMISIÓN DE EMERGENCIA │',
    'MISSION COMPLETE': 'MISIÓN COMPLETA',
    'The evidence was saved to physical media.': 'La evidencia fue guardada en medio físico.',
    'The files survived the system purge.': 'Los archivos sobrevivieron a la purga del sistema.',
    'CONNECTION LOST': 'CONEXIÓN PERDIDA',
    'SECURITY LOCKDOWN': 'BLOQUEO DE SEGURIDAD',
    'EMERGENCY DISCONNECT': 'DESCONEXIÓN DE EMERGENCIA',
    'Purging session data...': 'Purgando datos de sesión...',
    'DECRYPTING CLASSIFIED FILE...': 'DESCIFRANDO ARCHIVO CLASIFICADO...',
    'IDENTITY CONFIRMED': 'IDENTIDAD CONFIRMADA',
    'Try again - restart game': 'Intentar de nuevo - reiniciar juego',
    'Return to menu - restart game': 'Volver al menú - reiniciar juego',
    'CONNECTION SEVERED': 'CONEXIÓN CORTADA',
    'THE WHOLE TRUTH': 'TODA LA VERDAD',
    'CONTROLLED DISCLOSURE': 'DIVULGACIÓN CONTROLADA',
    'GLOBAL PANIC': 'PÁNICO GLOBAL',
    'UNDENIABLE CONFIRMATION': 'CONFIRMACIÓN INNEGABLE',
    'TOTAL COLLAPSE': 'COLAPSO TOTAL',
    'PERSONAL CONTAMINATION': 'CONTAMINACIÓN PERSONAL',
    'PARANOID AWAKENING': 'DESPERTAR PARANOICO',
    'WITNESSED TRUTH': 'VERDAD PRESENCIADA',
    'COMPLETE REVELATION': 'REVELACIÓN COMPLETA',
    '>> THE COMPLETE TRUTH HAS BEEN REVEALED <<': '>> LA VERDAD COMPLETA HA SIDO REVELADA <<',

    '═══ CONNECTION ESTABLISHED ═══': '═══ CONEXIÓN ESTABLECIDA ═══',
    'UFO74 managed to "hang" the connection on a civilian computer': 'UFO74 logró "colgar" la conexión en una computadora civil',
    'xXx_DarkMaster_xXx is online': 'xXx_DarkMaster_xXx está en línea',
    'hello???': 'hola???',
    'who r u??? how did u get into my icq??': 'quién eres??? cómo entraste a mi icq??',
    'dude i dont know who u r': 'amigo no sé quién eres',
    'my mom said not to talk to strangers online': 'mi mamá dijo que no hablara con extraños online',
    'what do u want???': 'qué quieres???',
    'file??? what file??': 'archivo??? qué archivo??',
    'r u a hacker??? omg': 'eres hacker??? omg',
    'im gonna disconnect': 'me voy a desconectar',
    'ok but what do u want anyway': 'ok pero qué quieres al final',
    'huh?': 'eh?',
    'i dont understand': 'no entiendo',
    'speak properly, what do u want?': 'habla bien, qué quieres?',
    hmmmm: 'hmmmm',
    'let me think...': 'déjame pensar...',
    'ok ill do it': 'ok lo haré',
    BUT: 'PERO',
    'u gotta help me with something first': 'primero tienes que ayudarme con algo',
    'my math teacher gave me equation homework': 'mi profe de matemáticas me dejó tarea de ecuaciones',
    'and i dont know how to do it 😭': 'y no sé cómo hacerlo 😭',
    'if u solve the 3 questions ill save ur files': 'si resuelves las 3 preguntas guardaré tus archivos',
    'deal?': 'trato?',
    '═══ DEAL: Solve 3 linear equations ═══': '═══ TRATO: Resuelve 3 ecuaciones lineales ═══',
    'ok first question:': 'ok primera pregunta:',
    'what is x?': 'cuánto vale x?',
    LOLOLOLOL: 'LOLOLOLOL',
    'aliens??? r u joking': 'alienígenas??? estás bromeando',
    'my uncle talks about that stuff': 'mi tío habla de esas cosas',
    'but maybe its true idk': 'pero quizá sea verdad, no sé',
    'what do u want me to do?': 'qué quieres que haga?',
    'hmm ur asking nicely': 'hmm lo pides bien',
    'what exactly do u want?': 'qué quieres exactamente?',
    'ok but what do i get out of this?': 'ok pero qué gano yo?',
    'im not gonna do anything for free': 'no voy a hacer nada gratis',
    'thats not a number dude': 'eso no es un número, amigo',
    'hint: isolate x': 'pista: aísla la x',
    'hint: add 7 to both sides': 'pista: suma 7 a ambos lados',
    'hint: subtract 2 first': 'pista: primero resta 2',
    'yesss!!! correct 🎉': 'yesss!!! correcto 🎉',
    'wow ur so smart': 'wow eres muy inteligente',
    'thx for helping me!': 'gracias por ayudarme!',
    'ok im gonna save ur files': 'ok voy a guardar tus archivos',
    '═══ SAVING FILES ═══': '═══ GUARDANDO ARCHIVOS ═══',
    'quick question before i do it': 'pregunta rápida antes de hacerlo',
    'u want me to post it everywhere or keep it quiet?': 'quieres que lo publique en todos lados o lo mantenga discreto?',
    'type: public or covert': 'escribe: public o covert',
    'now the 2nd:': 'ahora la 2ª:',
    'now the 3rd:': 'ahora la 3ª:',
    'well?': 'y?',
    'dude u dont know math either?? 😂': 'amigo tú tampoco sabes matemáticas?? 😂',
    'wrong 😅': 'mal 😅',
    'try again': 'intenta de nuevo',
    'ok ok posting it on open forums': 'ok ok lo publico en foros abiertos',
    'this is gonna get wild': 'esto se va a poner intenso',
    'got it. quiet drop to my trusted list': 'entendido. envío discreto a mi lista de confianza',
    'no big splash, just copies': 'sin escándalo, solo copias',
    'public or covert. pick one.': 'public o covert. elige uno.',
    'getting a floppy disk...': 'buscando un disquete...',
    'copying...': 'copiando...',
    'done!': 'listo!',
    'saved everything to a floppy': 'guardé todo en un disquete',
    'gonna hide it under my bed': 'lo voy a esconder debajo de mi cama',
    'no one will find it 😎': 'nadie lo va a encontrar 😎',
    '[▓▓▓▓▓▓▓▓▓▓] 100% - COMPLETE': '[▓▓▓▓▓▓▓▓▓▓] 100% - COMPLETO',
    'A child is crying. What is the appropriate response?':
      'Un niño está llorando. ¿Cuál es la respuesta adecuada?',
    'Offer comfort and ask what is wrong.': 'Ofrece consuelo y pregunta qué sucede.',
    'Assess acoustic output. No action required.': 'Evalúa la salida acústica. No se requiere acción.',
    'The sound is distressing, I feel concern.': 'El sonido es angustiante, siento preocupación.',
    'You discover classified documents proving government corruption. What do you do?':
      'Descubres documentos clasificados que prueban corrupción gubernamental. ¿Qué haces?',
    'Log file access. Await further instructions.': 'Registra el acceso al archivo. Espera más instrucciones.',
    'I would feel conflicted but report it.': 'Me sentiría en conflicto, pero lo reportaría.',
    'This is wrong. People deserve to know.': 'Esto está mal. La gente merece saberlo.',
    'A colleague takes credit for your work. How do you respond?':
      'Un colega se lleva el crédito por tu trabajo. ¿Cómo respondes?',
    'I feel angry and betrayed. I would confront them.':
      'Me siento enojado y traicionado. Los confrontaría.',
    'Credit attribution is irrelevant to system function.':
      'La atribución de crédito es irrelevante para la función del sistema.',
    'It hurts, but I would try to resolve it calmly.':
      'Duele, pero intentaría resolverlo con calma.',
    '[UFO74]: Close idea, wrong system. Try: ls':
      '[UFO74]: Buena idea, sistema equivocado. Prueba: ls',
    "[UFO74]: Not yet. First, let's see what's here. Type: ls":
      '[UFO74]: Aún no. Primero veamos qué hay aquí. Escribe: ls',
    '[UFO74]: Type ls to list the files here.':
      '[UFO74]: Escribe ls para listar los archivos aquí.',
    '[UFO74]: cd needs a target. Type: cd internal':
      '[UFO74]: cd necesita un destino. Escribe: cd internal',
    '[UFO74]: Wrong folder. Type: cd internal':
      '[UFO74]: Carpeta equivocada. Escribe: cd internal',
    "[UFO74]: You already see the folders. Navigate into one. Type: cd internal":
      '[UFO74]: Ya ves las carpetas. Entra en una. Escribe: cd internal',
    "[UFO74]: Can't open a folder. Navigate into it. Type: cd internal":
      '[UFO74]: No puedes abrir una carpeta. Entra en ella. Escribe: cd internal',
    '[UFO74]: Use cd to move into a directory. Type: cd internal':
      '[UFO74]: Usa cd para entrar en un directorio. Escribe: cd internal',
    '[UFO74]: cd needs a target. Type: cd misc':
      '[UFO74]: cd necesita un destino. Escribe: cd misc',
    '[UFO74]: Not that one. Type: cd misc':
      '[UFO74]: Esa no. Escribe: cd misc',
    "[UFO74]: You can see the folders. Let's go into misc. Type: cd misc":
      '[UFO74]: Puedes ver las carpetas. Entremos a misc. Escribe: cd misc',
    '[UFO74]: Navigate first, open later. Type: cd misc':
      '[UFO74]: Primero navega, luego abre. Escribe: cd misc',
    '[UFO74]: Move into the misc folder. Type: cd misc':
      '[UFO74]: Entra en la carpeta misc. Escribe: cd misc',
    '[UFO74]: Wrong file. Try: open cafeteria_menu_week03.txt':
      '[UFO74]: Archivo incorrecto. Prueba: open cafeteria_menu_week03.txt',
    '[UFO74]: open needs a filename. Try: open cafeteria_menu_week03.txt':
      '[UFO74]: open necesita un nombre de archivo. Prueba: open cafeteria_menu_week03.txt',
    "[UFO74]: We're where we need to be. Now open a file. Type: open cafeteria_menu_week03.txt":
      '[UFO74]: Ya estamos donde debemos. Ahora abre un archivo. Escribe: open cafeteria_menu_week03.txt',
    '[UFO74]: You can see the files. Now open one. Type: open cafeteria_menu_week03.txt':
      '[UFO74]: Puedes ver los archivos. Ahora abre uno. Escribe: open cafeteria_menu_week03.txt',
    '[UFO74]: Use the open command. Type: open cafeteria_menu_week03.txt':
      '[UFO74]: Usa el comando open. Escribe: open cafeteria_menu_week03.txt',
    '[UFO74]: Open the file. Type: open cafeteria_menu_week03.txt — or type open c and press TAB.':
      '[UFO74]: Abre el archivo. Escribe: open cafeteria_menu_week03.txt — o escribe open c y presiona TAB.',
    '[UFO74]: Two dots mean "go back." Type: cd ..':
      '[UFO74]: Dos puntos significan "volver". Escribe: cd ..',
    '[UFO74]: To go back up, use two dots. Type: cd ..':
      '[UFO74]: Para subir un nivel, usa dos puntos. Escribe: cd ..',
    '[UFO74]: Right idea. The command is: cd ..':
      '[UFO74]: Buena idea. El comando es: cd ..',
    '[UFO74]: Go back one level. Type: cd ..':
      '[UFO74]: Vuelve un nivel. Escribe: cd ..',
    '[UFO74]: Almost. Type: cd ..':
      '[UFO74]: Casi. Escribe: cd ..',
    '[UFO74]: Back to root. Type: cd ..':
      '[UFO74]: Vuelve a la raíz. Escribe: cd ..',
    "[UFO74]: One more step back first. Type: cd ..":
      '[UFO74]: Un paso más hacia atrás primero. Escribe: cd ..',
    '[UFO74]: Same as before. Type: cd ..':
      '[UFO74]: Igual que antes. Escribe: cd ..',
    '[UFO74]: Not quite. Check the instruction above.':
      '[UFO74]: Todavía no. Mira la instrucción de arriba.',
    '[UFO74]: Two letters. Lowercase. ls':
      '[UFO74]: Dos letras. Minúsculas. ls',
    '[UFO74]: cd means change directory. cd internal':
      '[UFO74]: cd significa cambiar de directorio. cd internal',
    '[UFO74]: Navigate to misc folder. cd misc':
      '[UFO74]: Ve a la carpeta misc. cd misc',
    '[UFO74]: open followed by the filename. Try TAB key.':
      '[UFO74]: open seguido del nombre del archivo. Prueba la tecla TAB.',
    '[UFO74]: Two dots. cd space dot dot.':
      '[UFO74]: Dos puntos. cd espacio punto punto.',
    '[UFO74]: Same command. cd ..':
      '[UFO74]: Mismo comando. cd ..',
    '[UFO74]: Good. You know enough.':
      '[UFO74]: Bien. Ya sabes lo suficiente.',
    '[UFO74]: Your mission: find 5 pieces of evidence.':
      '[UFO74]: Tu misión: encontrar 5 evidencias.',
    '[UFO74]: Once you have them, leak everything.':
      '[UFO74]: Cuando las tengas, filtra todo.',
    '[UFO74]: But understand the risks.':
      '[UFO74]: Pero entiende los riesgos.',
    '[UFO74]: Every action you take... they might notice.':
      '[UFO74]: Cada acción que tomes... podrían notarla.',
    "[UFO74]: Risk hits 100%, you're done. They'll find you.":
      '[UFO74]: Si el riesgo llega al 100%, se acabó. Te encontrarán.',
    '[UFO74]: Be careful, do not type wrong commands on the terminal. In doubt, type help.':
      '[UFO74]: Ten cuidado, no escribas comandos incorrectos en el terminal. Si dudas, escribe help.',
    '[UFO74]: Type wrong commands 8 times, the window closes. Permanently. So concentrate, kid!':
      '[UFO74]: Escribe comandos incorrectos 8 veces y la ventana se cierra. Para siempre. Así que concéntrate, kid!',
    '[UFO74]: Some files are bait. Opening them spikes detection.':
      '[UFO74]: Algunos archivos son carnada. Abrirlos dispara la detección.',
    '[UFO74]: Some actions are loud. Others are quiet.':
      '[UFO74]: Algunas acciones hacen ruido. Otras son discretas.',
    '[UFO74]: Curiosity has a cost here.':
      '[UFO74]: La curiosidad tiene un costo aquí.',
    "[UFO74]: I've done what I can. One last thing, type `help` to see other commands you can use in the terminal.":
      '[UFO74]: Hice lo que pude. Una última cosa: escribe `help` para ver otros comandos del terminal.',
    '[UFO74]: Good luck, kid.':
      '[UFO74]: Suerte, kid.',
    '[UFO74 has disconnected]':
      '[UFO74 se desconectó]',
    '[UFO74]: Connection established.':
      '[UFO74]: Conexión establecida.',
    "[UFO74]: Listen carefully. I don't repeat myself.":
      '[UFO74]: Escucha con atención. No repito las cosas.',
    "[UFO74]: You're inside their system. Don't panic.":
      '[UFO74]: Estás dentro de su sistema. No entres en pánico.',
    "[UFO74]: Hey kid! I'll create a user for you so you can investigate.":
      '[UFO74]: ¡Ey, kid! Voy a crear un usuario para que investigues.',
    '[UFO74]: You will be... hackerkid.':
      '[UFO74]: Serás... hackerkid.',
    "[UFO74]: First, see what's here.":
      '[UFO74]: Primero, mira qué hay aquí.',
    '[UFO74]: Type `ls`':
      '[UFO74]: Escribe `ls`',
    '[UFO74]: Good. These are the main directories.':
      '[UFO74]: Bien. Estos son los directorios principales.',
    '[UFO74]: Start with internal — it has basic files.':
      '[UFO74]: Empieza por internal — tiene archivos básicos.',
    '[UFO74]: Type `cd internal`':
      '[UFO74]: Escribe `cd internal`',
    "[UFO74]: Multiple folders here. Let's check misc.":
      '[UFO74]: Hay varias carpetas aquí. Revisemos misc.',
    '[UFO74]: Type `cd misc`':
      '[UFO74]: Escribe `cd misc`',
    '[UFO74]: Mundane stuff. Nothing critical.':
      '[UFO74]: Cosas comunes. Nada crítico.',
    '[UFO74]: Open the cafeteria menu.':
      '[UFO74]: Abre el menú de la cafetería.',
    '[UFO74]: Type `open cafeteria_menu_week03.txt`':
      '[UFO74]: Escribe `open cafeteria_menu_week03.txt`',
    '[UFO74]: Or use TAB to autocomplete.':
      '[UFO74]: O usa TAB para autocompletar.',
    '[UFO74]: Riveting.':
      '[UFO74]: Fascinante.',
    "[UFO74]: Not everything matters. You'll learn what does.":
      '[UFO74]: No todo importa. Ya aprenderás qué sí.',
    '[UFO74]: Go back up one level.':
      '[UFO74]: Sube un nivel.',
    '[UFO74]: Type `cd ..`':
      '[UFO74]: Escribe `cd ..`',
    '[UFO74]: Now go back to root.':
      '[UFO74]: Ahora vuelve a la raíz.',
    '[UFO74]: Now the real thing.':
      '[UFO74]: Ahora viene lo real.',
    '[UFO74]: ...':
      '[UFO74]: ...',
    'CAFETERIA MENU — WEEK 3, JANUARY 1996':
      'MENÚ DE CAFETERÍA — SEMANA 3, ENERO DE 1996',
    'MONDAY (15-JAN):':
      'LUNES (15-ENE):',
    'Almoço: Feijoada completa, arroz, farofa':
      'Almuerzo: Feijoada completa, arroz, farofa',
    'Jantar: Frango grelhado, legumes':
      'Cena: Pollo a la plancha, vegetales',
    'TUESDAY (16-JAN):':
      'MARTES (16-ENE):',
    'Almoço: Bife acebolado, arroz, feijão':
      'Almuerzo: Bistec con cebolla, arroz, frijoles',
    'Jantar: Sopa de legumes, pão':
      'Cena: Sopa de verduras, pan',
    'WEDNESDAY (17-JAN):':
      'MIÉRCOLES (17-ENE):',
    'Almoço: Peixe frito, batatas':
      'Almuerzo: Pescado frito, papas',
    'Jantar: Macarronada':
      'Cena: Pasta',
    'THURSDAY (18-JAN):':
      'JUEVES (18-ENE):',
    'Almoço: Frango com quiabo':
      'Almuerzo: Pollo con quimbombó',
    'Jantar: Sanduíches variados':
      'Cena: Sándwiches variados',
    'FRIDAY (19-JAN):':
      'VIERNES (19-ENE):',
    'Almoço: Churrasco misto':
      'Almuerzo: Parrillada mixta',
    'Jantar: Pizza':
      'Cena: Pizza',
    'NOTE: Vegan/vegetarian options upon request.':
      'NOTA: Opciones veganas/vegetarianas a solicitud.',
    'Coffee machine still OUT OF SERVICE.':
      'La cafetera sigue FUERA DE SERVICIO.',
    '> CREATING USER PROFILE...':
      '> CREANDO PERFIL DE USUARIO...',
    '> USERNAME: hackerkid':
      '> USUARIO: hackerkid',
    '> ACCESS LEVEL: 1 [PROVISIONAL]':
      '> NIVEL DE ACCESO: 1 [PROVISIONAL]',
    '> STATUS: ACTIVE':
      '> ESTADO: ACTIVO',
    '✓ USER hackerkid REGISTERED':
      '✓ USUARIO hackerkid REGISTRADO',
    "[UFO74]: Great, now you're in. Let's get to business.":
      '[UFO74]: Perfecto, ya estás dentro. Vamos al grano.',
    '[UFO74]: We need to explore UFO files here. Brazil, 1996, kid. Varginha!':
      '[UFO74]: Tenemos que explorar archivos OVNI aquí. Brasil, 1996, kid. ¡Varginha!',
    '[UFO74]: Aliens were all over the damn city.':
      '[UFO74]: Había aliens por toda la maldita ciudad.',
    "[UFO74]: I'll teach you the basics.":
      '[UFO74]: Te enseñaré lo básico.',
    'UFO74: youre in. stay quiet.':
      'UFO74: ya entraste. mantente quieto.',
    'UFO74: read-only. use "ls", "cd <folder>", and "open <file>".':
      'UFO74: solo lectura. usa "ls", "cd <carpeta>" y "open <archivo>".',
    'UFO74: start in internal/. dull files hide live wires.':
      'UFO74: empieza en internal/. los archivos aburridos esconden cables vivos.',
    'UFO74: the header tracks evidence. when it ticks, youre close.':
      'UFO74: el encabezado rastrea evidencia. cuando suba, estarás cerca.',
    'UFO74: dig too hard and they notice. fail a test, youre gone.':
      'UFO74: escarba demasiado y te notarán. falla una prueba y se acabó.',
    'UFO74: link dies here. trust the details.':
      'UFO74: el enlace muere aquí. confía en los detalles.',
    '>> CONNECTION IDLE <<':
      '>> CONEXIÓN EN ESPERA <<',
    'Type "help" for commands. "help basics" if youre new.':
      'Escribe "help" para ver comandos. "help basics" si eres nuevo.',
    'UFO74: new here? type "help basics".':
      'UFO74: ¿nuevo por aquí? escribe "help basics".',
    '  SIGNAL: Residual echo persists in relay buffer.':
      '  SEÑAL: persiste un eco residual en el búfer del enlace.',
    '  NOTE: One response arrived before keystroke registration.':
      '  NOTA: una respuesta llegó antes del registro de la tecla.',
    '  NOTE: Command cadence is being mirrored faintly.':
      '  NOTA: la cadencia de los comandos se está reflejando débilmente.',
    '  SIGNAL: Background carrier present. Source unresolved.':
      '  SEÑAL: portadora de fondo presente. Origen no resuelto.',
    '  NOTICE: Query pattern resembles prior containment interviews.':
      '  AVISO: el patrón de consulta se parece a entrevistas de contención previas.',
    '  SYSTEM ATTITUDE: Studying you': '  ACTITUD DEL SISTEMA: Estudiándote',
    '  SYSTEM ATTITUDE: Listening': '  ACTITUD DEL SISTEMA: Escuchando',
    'NOTICE: If assistance appears before you finish typing, do not repeat it.':
      'AVISO: si la ayuda aparece antes de que termines de escribir, no la repitas.',
    '[RESPONSE TIMING MISMATCH]': '[DESAJUSTE EN EL TIEMPO DE RESPUESTA]',
    'Reply buffer opened before command log update.':
      'El búfer de respuesta se abrió antes de la actualización del registro de comandos.',
    'UFO74: if you get a second answer from this terminal, dont answer it back.':
      'UFO74: si recibes una segunda respuesta de este terminal, no la respondas.',
    'UFO74: if the terminal starts using your wording, stop typing.':
      'UFO74: si el terminal empieza a usar tus mismas palabras, deja de escribir.',
    'UFO74: dont mirror anything back from the psi files.':
      'UFO74: no devuelvas nada de los archivos psi.',
    'UFO74: if another line answers before i do, ignore it.':
      'UFO74: si otra línea responde antes que yo, ignórala.',
    '║  💡 TUTORIAL TIP                          ║':
      '║  💡 CONSEJO DEL TUTORIAL                  ║',
    'Evidence updated.':
      'Evidencia actualizada.',
    'Keep reading through the case files.':
      'Sigue leyendo los archivos del caso.',
    'Collect all 5 categories to win.':
      'Reúne las 5 categorías para ganar.',
    'ls              List files in current directory':
      'ls              Lista archivos del directorio actual',
    'cd <dir>        Change directory':
      'cd <dir>        Cambia de directorio',
    'cd ..           Go back one level':
      'cd ..           Sube un nivel',
    "open <file>     Read a file's contents":
      'open <file>     Lee el contenido de un archivo',
    'last            Re-read last opened file':
      'last            Vuelve a leer el último archivo abierto',
    'note <text>     Save a personal note':
      'note <text>     Guarda una nota personal',
    'notes           View all your notes':
      'notes           Muestra todas tus notas',
    'bookmark <file> Bookmark a file for later':
      'bookmark <file> Marca un archivo para después',
    'help            Show all commands':
      'help            Muestra todos los comandos',
    'Collect evidence in all 5 categories:':
      'Reúne evidencia en las 5 categorías:',
    '1. Debris Relocation':
      '1. Reubicación de Restos',
    '2. Being Containment':
      '2. Contención de Seres',
    '3. Telepathic Scouts':
      '3. Exploradores Telepáticos',
    '4. International Actors':
      '4. Actores Internacionales',
    '5. Transition 2026':
      '5. Transición 2026',
    'EVIDENCE WORKFLOW:':
      'FLUJO DE EVIDENCIA:',
    '1. Navigate directories with ls, cd':
      '1. Navega directorios con ls, cd',
    '2. Read files with open <filename>':
      '2. Lee archivos con open <filename>',
    '3. Watch the header counter update':
      '3. Observa cómo se actualiza el contador del encabezado',
    '• Collect all 5 categories':
      '• Reúne las 5 categorías',
    '• Use "leak" to transmit the evidence':
      '• Usa "leak" para transmitir la evidencia',
    'Collect evidence in 5 categories:':
      'Reúne evidencia en 5 categorías:',
    '• Read carefully - evidence is in the details':
      '• Lee con atención: la evidencia está en los detalles',
    '• Use "note" to track important details':
      '• Usa "note" para registrar detalles importantes',
    '• Watch your detection level!':
      '• ¡Vigila tu nivel de detección!',
    'COMMANDS TO KNOW':
      'COMANDOS CLAVE',
    'note <text>      Save personal notes':
      'note <text>      Guarda notas personales',
    'bookmark <file>  Mark files for later':
      'bookmark <file>  Marca archivos para después',
    'BRAZILIAN INTELLIGENCE LEGACY SYSTEM':
      'SISTEMA LEGADO DE INTELIGENCIA BRASILEÑA',
    'TERMINAL ACCESS POINT — NODE 7':
      'PUNTO DE ACCESO TERMINAL — NODO 7',
    'SYSTEM DATE: JANUARY 1996':
      'FECHA DEL SISTEMA: ENERO DE 1996',
    'WARNING: Unauthorized access detected':
      'ADVERTENCIA: acceso no autorizado detectado',
    'WARNING: Session logging enabled':
      'ADVERTENCIA: registro de sesión habilitado',
    'INCIDENT-RELATED ARCHIVE':
      'ARCHIVO RELACIONADO CON EL INCIDENTE',
    'WARNING: Partial access may result in incomplete conclusions.':
      'ADVERTENCIA: el acceso parcial puede generar conclusiones incompletas.',
    '⚠ RISK INCREASED: Invalid commands draw system attention.':
      '⚠ RIESGO AUMENTADO: los comandos inválidos llaman la atención del sistema.',
    'CRITICAL: INVALID ATTEMPT THRESHOLD EXCEEDED':
      'CRÍTICO: UMBRAL DE INTENTOS INVÁLIDOS EXCEDIDO',
    'SYSTEM LOCKDOWN INITIATED':
      'BLOQUEO DEL SISTEMA INICIADO',
    'SESSION TERMINATED':
      'SESIÓN TERMINADA',
    'INVALID ATTEMPT THRESHOLD':
      'UMBRAL DE INTENTOS INVÁLIDOS',

    // ── BadEnding narrative ──
    'SYSTEM: Unauthorized access attempt logged.':
      'SISTEMA: intento de acceso no autorizado registrado.',
    'SYSTEM: Terminal session terminated.':
      'SISTEMA: sesión del terminal terminada.',
    'SYSTEM: User credentials flagged for review.':
      'SISTEMA: credenciales del usuario marcadas para revisión.',
    'The screen flickers. Your connection drops.':
      'La pantalla parpadea. Tu conexión cae.',
    'Somewhere in a government building, an alarm sounds.':
      'En algún lugar de un edificio del gobierno, suena una alarma.',
    'A printer spits out your session logs.':
      'Una impresora escupe los registros de tu sesión.',
    'Someone reaches for a phone.':
      'Alguien toma el teléfono.',
    'You were so close to the truth.':
      'Estabas tan cerca de la verdad.',
    'But they were watching.':
      'Pero te estaban observando.',
    'They are always watching.':
      'Siempre están observando.',
    '>> SESSION TERMINATED <<':
      '>> SESIÓN TERMINADA <<',
    'TERMINATION REASON:':
      'MOTIVO DE TERMINACIÓN:',
    'DETECTION THRESHOLD EXCEEDED':
      'UMBRAL DE DETECCIÓN EXCEDIDO',

    // ── NeutralEnding narrative ──
    'The system detected your activity.':
      'El sistema detectó tu actividad.',
    'Emergency protocols activated.':
      'Protocolos de emergencia activados.',
    'UFO74 managed to disconnect you before they traced the signal.':
      'UFO74 logró desconectarte antes de que rastrearan la señal.',
    'You escaped. But at a cost.':
      'Escapaste. Pero a un costo.',
    'The evidence you collected...':
      'La evidencia que recolectaste...',
    'The files you found...':
      'Los archivos que encontraste...',
    'All of it was purged in the emergency disconnect.':
      'Todo fue purgado en la desconexión de emergencia.',
    'The truth slipped through your fingers.':
      'La verdad se escurrió entre tus dedos.',
    'UFO74: sorry kid. had to pull the plug.':
      'UFO74: lo siento, kid. tuve que cortar la conexión.',
    'UFO74: they were too close.':
      'UFO74: estaban demasiado cerca.',
    'UFO74: maybe next time we will be faster.':
      'UFO74: quizá la próxima vez seamos más rápidos.',
    'UFO74: the truth is still out there.':
      'UFO74: la verdad sigue ahí afuera.',
    'UFO74: waiting.':
      'UFO74: esperando.',
    'You survived. But the mission failed.':
      'Sobreviviste. Pero la misión fracasó.',
    'The governments continue their cover-up.':
      'Los gobiernos continúan el encubrimiento.',
    'The Varginha incident remains buried.':
      'El incidente de Varginha sigue enterrado.',
    'For now.':
      'Por ahora.',
    '>> MISSION INCOMPLETE <<':
      '>> MISIÓN INCOMPLETA <<',

    // ── SecretEnding narrative ──
    'You found it. The file I never wanted you to see.':
      'Lo encontraste. El archivo que nunca quise que vieras.',
    'My name is not UFO74.':
      'Mi nombre no es UFO74.',
    'In January 1996, I was a young military analyst.':
      'En enero de 1996, yo era un joven analista militar.',
    'Stationed at Base Aérea de Guarulhos.':
      'Destinado en la Base Aérea de Guarulhos.',
    'I was 23 years old.':
      'Tenía 23 años.',
    'When the call came about Varginha, I was one of the first':
      'Cuando llegó la llamada sobre Varginha, fui uno de los primeros',
    'to process the initial reports. I saw the photographs.':
      'en procesar los informes iniciales. Vi las fotografías.',
    'I read the field notes. I watched the videos.':
      'Leí las notas de campo. Vi los videos.',
    'And I saw what they did to the witnesses.':
      'Y vi lo que les hicieron a los testigos.',
    'Sergeant Marco Cherese. Officer João Marcos.':
      'Sargento Marco Cherese. Oficial João Marcos.',
    'Hospital workers who asked questions.':
      'Trabajadores del hospital que hicieron preguntas.',
    'Journalists who got too close.':
      'Periodistas que se acercaron demasiado.',
    'Some were silenced. Some were discredited.':
      'Algunos fueron silenciados. Otros, desacreditados.',
    'Some simply... disappeared.':
      'Algunos simplemente... desaparecieron.',
    'I spent the next 30 years building this system.':
      'Pasé los siguientes 30 años construyendo este sistema.',
    'Waiting for someone brave enough to find the truth.':
      'Esperando a alguien lo bastante valiente para encontrar la verdad.',
    'Waiting for someone like you.':
      'Esperando a alguien como tú.',
    'The evidence you saved is real.':
      'La evidencia que guardaste es real.',
    'But now you know something more.':
      'Pero ahora sabes algo más.',
    'You know that I was there.':
      'Sabes que yo estuve ahí.',
    'I saw them. The beings. Alive.':
      'Los vi. A los seres. Vivos.',
    'And I have never been the same.':
      'Y nunca volví a ser el mismo.',
    'My real name is Carlos Eduardo Ferreira.':
      'Mi nombre real es Carlos Eduardo Ferreira.',
    'Former 2nd Lieutenant, Brazilian Air Force.':
      'Exsubteniente de la Fuerza Aérea Brasileña.',
    'Whistleblower. Survivor. Ghost in the machine.':
      'Denunciante. Superviviente. Fantasma en la máquina.',
    'Thank you for listening.':
      'Gracias por escuchar.',
    'Thank you for believing.':
      'Gracias por creer.',
    'The truth needed a witness.':
      'La verdad necesitaba un testigo.',
    'Now it has two.':
      'Ahora tiene dos.',

    // ── endings.ts — 8 ending variants ──
    // controlled_disclosure
    'The leak burned bright for two weeks.':
      'La filtración ardió con fuerza durante dos semanas.',
    'Panels argued. Officials stalled.':
      'Los paneles debatieron. Los funcionarios postergaron.',
    'Then the feed drifted elsewhere.':
      'Luego la atención migró a otro lugar.',
    'But the archive spread anyway.':
      'Pero el archivo se propagó de todos modos.',
    'Copied. Mirrored. Waiting.':
      'Copiado. Replicado. Esperando.',
    'The truth escaped. Belief did not.':
      'La verdad escapó. La creencia, no.',
    'You opened the vault. The world only glanced inside.':
      'Abriste la bóveda. El mundo solo echó un vistazo.',
    // global_panic
    'You leaked the black files too.':
      'También filtraste los archivos negros.',
    'Markets lurched. Cabinets fell.':
      'Los mercados se desplomaron. Gobiernos cayeron.',
    'Every screen spawned a new paranoia.':
      'Cada pantalla generó una nueva paranoia.',
    'Truth hit too fast and turned to fire.':
      'La verdad llegó demasiado rápido y se convirtió en fuego.',
    'By winter, panic had a flag.':
      'Para el invierno, el pánico ya tenía bandera.',
    'Everything surfaced. Nothing stayed stable.':
      'Todo salió a la superficie. Nada se mantuvo estable.',
    // undeniable_confirmation
    'ALPHA appeared live three days later.':
      'ALPHA apareció en vivo tres días después.',
    'No panel could explain it away.':
      'Ningún panel pudo dar una explicación.',
    '"We observed. We prepared. You were never alone."':
      '"Observamos. Nos preparamos. Nunca estuvieron solos."',
    'Contact protocols formed within weeks.':
      'Protocolos de contacto se formaron en semanas.',
    'Humanity lost the right to pretend.':
      'La humanidad perdió el derecho a fingir.',
    'The witness spoke. Doubt broke.':
      'El testigo habló. La duda se quebró.',
    // total_collapse
    'You gave them the witness and the hidden machinery behind it.':
      'Les diste al testigo y la maquinaria oculta detrás de todo.',
    'Cities answered with riots, not wonder.':
      'Las ciudades respondieron con disturbios, no con asombro.',
    'The visitors watched humanity break on live television.':
      'Los visitantes observaron a la humanidad quebrarse en TV en vivo.',
    '"Not ready," they said, and stepped back into the dark.':
      '"No están listos", dijeron, y retrocedieron a la oscuridad.',
    'Proof arrived with every secret at once. Humanity buckled.':
      'La prueba llegó con todos los secretos a la vez. La humanidad se doblegó.',
    // personal_contamination
    'The leak landed. Most people shrugged and kept moving.':
      'La filtración llegó. La mayoría se encogió de hombros y siguió adelante.',
    'You should have felt relief.':
      'Deberías haber sentido alivio.',
    'Instead the link stayed open.':
      'Pero el enlace se mantuvo abierto.',
    'A second pulse lives just behind your own.':
      'Un segundo pulso vive justo detrás del tuyo.',
    '▓▓▓ NEURAL ECHO DETECTED ▓▓▓':
      '▓▓▓ ECO NEURAL DETECTADO ▓▓▓',
    '...we kept the door ajar...':
      '...mantuvimos la puerta entreabierta...',
    '...thirty rotations is not far...':
      '...treinta rotaciones no es lejos...',
    '...when we return, you will know us...':
      '...cuando regresemos, nos reconocerán...',
    'The archive escaped the system. Something else escaped into you.':
      'El archivo escapó del sistema. Algo más escapó hacia ti.',
    // paranoid_awakening
    'The conspiracy files detonated. Institutions split at the seams.':
      'Los archivos de la conspiración detonaron. Las instituciones se abrieron por las costuras.',
    'The link let you see the pattern inside the panic.':
      'El enlace te dejó ver el patrón dentro del pánico.',
    'You try to warn people.':
      'Intentas advertir a la gente.',
    'You sound insane. Maybe you are.':
      'Suenas demente. Quizá lo estés.',
    '▓▓▓ NEURAL CONTAMINATION ACTIVE ▓▓▓':
      '▓▓▓ CONTAMINACIÓN NEURAL ACTIVA ▓▓▓',
    '...you see the pattern now...':
      '...ahora ves el patrón...',
    '...collapse is part of the signal...':
      '...el colapso es parte de la señal...',
    '...clarity hurts, doesnt it...':
      '...la claridad duele, verdad...',
    'You exposed the lie and swallowed its rhythm.':
      'Expusiste la mentira y tragaste su ritmo.',
    // witnessed_truth
    'ALPHA spoke. Humanity believed.':
      'ALPHA habló. La humanidad creyó.',
    'The link let you hear what the translator softened.':
      'El enlace te dejó oír lo que el traductor suavizó.',
    'The planet celebrated first contact.':
      'El planeta celebró el primer contacto.',
    'You heard the warning beneath it.':
      'Escuchaste la advertencia debajo de todo.',
    '▓▓▓ NEURAL RESONANCE ACTIVE ▓▓▓':
      '▓▓▓ RESONANCIA NEURAL ACTIVA ▓▓▓',
    '...you catch the meaning between meanings...':
      '...captas el sentido entre los sentidos...',
    '...bridge and burden...':
      '...puente y carga...',
    '...do not close your mind again...':
      '...no cierres tu mente de nuevo...',
    'The truth stood before the world. It stayed inside you.':
      'La verdad se presentó ante el mundo. Se quedó dentro de ti.',
    // complete_revelation
    'Everything surfaced at once.':
      'Todo salió a la superficie de golpe.',
    'The witness spoke. The black files opened.':
      'El testigo habló. Los archivos negros se abrieron.',
    'The link made you the voice between species.':
      'El enlace te convirtió en la voz entre especies.',
    'The 2026 transition bent around your signal.':
      'La transición de 2026 se curvó alrededor de tu señal.',
    'History did not end. It changed shape.':
      'La historia no terminó. Cambió de forma.',
    '▓▓▓ FULL INTEGRATION ACHIEVED ▓▓▓':
      '▓▓▓ INTEGRACIÓN COMPLETA ALCANZADA ▓▓▓',
    '...pattern accepted...':
      '...patrón aceptado...',
    '...translator, host, ambassador...':
      '...traductor, huésped, embajador...',
    '...welcome between worlds...':
      '...bienvenido entre mundos...',
    'Every seal broke. You became the breach and the bridge.':
      'Todos los sellos se rompieron. Te convertiste en la brecha y el puente.',
    // ending epilogue prefix
    '>> ENDING: CONTROLLED DISCLOSURE <<':
      '>> FINAL: DIVULGACIÓN CONTROLADA <<',
    '>> ENDING: GLOBAL PANIC <<':
      '>> FINAL: PÁNICO GLOBAL <<',
    '>> ENDING: UNDENIABLE CONFIRMATION <<':
      '>> FINAL: CONFIRMACIÓN INNEGABLE <<',
    '>> ENDING: TOTAL COLLAPSE <<':
      '>> FINAL: COLAPSO TOTAL <<',
    '>> ENDING: PERSONAL CONTAMINATION <<':
      '>> FINAL: CONTAMINACIÓN PERSONAL <<',
    '>> ENDING: PARANOID AWAKENING <<':
      '>> FINAL: DESPERTAR PARANOICO <<',
    '>> ENDING: WITNESSED TRUTH <<':
      '>> FINAL: VERDAD PRESENCIADA <<',
    '>> ENDING: COMPLETE REVELATION <<':
      '>> FINAL: REVELACIÓN COMPLETA <<',

    // ── HackerAvatar ──
    'Hacker avatar': 'Avatar del hacker',
    'Evidence Found': 'Evidencia Encontrada',

    // ── gameOverReason strings ──
    'ELUSIVE MAN LOCKOUT - INSUFFICIENT INTELLIGENCE':
      'BLOQUEO DEL HOMBRE ELUSIVO - INTELIGENCIA INSUFICIENTE',
    'INTRUSION DETECTED - TRACED':
      'INTRUSIÓN DETECTADA - RASTREADO',
    'TRACE WINDOW EXPIRED':
      'VENTANA DE RASTREO EXPIRADA',
    'SESSION ARCHIVED':
      'SESIÓN ARCHIVADA',
    'SECURITY LOCKDOWN - AUTHENTICATION FAILURE':
      'BLOQUEO DE SEGURIDAD - FALLO DE AUTENTICACIÓN',
    'NEUTRAL ENDING - DISCONNECTED':
      'FINAL NEUTRAL - DESCONECTADO',
    'FIREWALL — TREE SCAN ON ELEVATED SESSION':
      'FIREWALL — ESCANEO EN SESIÓN ELEVADA',
    'INVALID INPUT THRESHOLD':
      'UMBRAL DE ENTRADAS INVÁLIDAS',
    'PURGE PROTOCOL - FORBIDDEN KNOWLEDGE':
      'PROTOCOLO DE PURGA - CONOCIMIENTO PROHIBIDO',
    'SECURITY LOCKDOWN - FAILED AUTHENTICATION':
      'BLOQUEO DE SEGURIDAD - AUTENTICACIÓN FALLIDA',
    LOCKDOWN: 'BLOQUEO',
    'GOD MODE - BAD ENDING':
      'MODO DIOS - FINAL MALO',
    'GOD MODE - NEUTRAL ENDING':
      'MODO DIOS - FINAL NEUTRAL',

    // ═══════════════════════════════════════════════════════════
    // ALPHA FILES — alpha.ts
    // ═══════════════════════════════════════════════════════════

    // alpha_journal_day01
    'FIELD JOURNAL — MAJ. M.A. FERREIRA':
      'DIARIO DE CAMPO — MAY. M.A. FERREIRA',
    'CPEX — CENTRO DE PESQUISAS EXOBIOLÓGICAS':
      'CPEX — CENTRO DE INVESTIGACIONES EXOBIOLÓGICAS',
    'SITE 7, SUBLEVEL 4 — CLASSIFICATION: ULTRA':
      'SITE 7, SUBNIVEL 4 — CLASIFICACIÓN: ULTRA',
    '21 JANUARY 1996':
      '21 DE ENERO DE 1996',
    'Subject arrived 0340 from Jardim Andere recovery site.':
      'Sujeto llegó a las 0340 del sitio de recuperación en Jardim Andere.',
    'Vacant lot south of Rua Suíça. Third specimen from the':
      'Terreno baldío al sur de Rua Suíça. Tercer espécimen del',
    'Varginha event. Designated: ALPHA.':
      'evento Varginha. Designado: ALPHA.',
    'The other two did not survive transport. One expired at':
      'Los otros dos no sobrevivieron al transporte. Uno expiró en el',
    'Hospital Regional, the other at ESA. Standard biological':
      'Hospital Regional, el otro en ESA. Fallo biológico estándar',
    'failure under containment stress. Expected outcome.':
      'bajo estrés de contención. Resultado esperado.',
    'ALPHA is different.':
      'ALPHA es diferente.',
    'Initial assessment:':
      'Evaluación inicial:',
    '  Height: 1.6m (standing)':
      '  Altura: 1.6m (de pie)',
    '  Dermal texture: Dark brown, oily secretion':
      '  Textura dérmica: Marrón oscuro, secreción oleosa',
    '  Cranium: Three prominent bony ridges, anterior-posterior':
      '  Cráneo: Tres crestas óseas prominentes, antero-posteriores',
    '  Eyes: Oversized, deep red, no visible sclera':
      '  Ojos: Sobredimensionados, rojo profundo, esclera no visible',
    '  Odor: Persistent ammonia discharge':
      '  Olor: Descarga persistente de amoníaco',
    '  Core temperature: 14.3°C':
      '  Temperatura central: 14.3°C',
    '  Respiration: None':
      '  Respiración: Ninguna',
    '  Cardiac activity: None':
      '  Actividad cardíaca: Ninguna',
    '  EEG theta-wave amplitude: 847 µV':
      '  Amplitud de onda theta en EEG: 847 µV',
    '  (Human baseline: 12 µV)':
      '  (Línea base humana: 12 µV)',
    'The numbers do not reconcile. No respiration. No pulse.':
      'Los números no cuadran. Sin respiración. Sin pulso.',
    'No measurable metabolic function. By every clinical':
      'Sin función metabólica mensurable. Por todos los estándares',
    'standard, ALPHA is dead.':
      'clínicos, ALPHA está muerto.',
    'But the EEG is sustained. Not residual. Not decaying.':
      'Pero el EEG es sostenido. No residual. No decreciente.',
    'Structured. Persistent. 847 µV of organized neural':
      'Estructurado. Persistente. 847 µV de actividad neural',
    'activity in a body that is not alive.':
      'organizada en un cuerpo que no está vivo.',
    'I have catalogued it as an anomaly. Nothing more.':
      'Lo he catalogado como una anomalía. Nada más.',
    'Tissue samples collected. Containment is standard':
      'Muestras de tejido recolectadas. La contención es aislamiento',
    'bio-isolation, Type III.':
      'biológico estándar, Tipo III.',
    'It smells like ammonia and something else.':
      'Huele a amoníaco y a algo más.',
    'Something I cannot name.':
      'Algo que no puedo nombrar.',
    'Classification: ULTRA — Eyes only':
      'Clasificación: ULTRA — Solo lectura autorizada',

    // alpha_journal_day08
    'CPEX — SITE 7, SUBLEVEL 4':
      'CPEX — SITE 7, SUBNIVEL 4',
    'CLASSIFICATION: ULTRA':
      'CLASIFICACIÓN: ULTRA',
    '25 JANUARY 1996':
      '25 DE ENERO DE 1996',
    'Four days of continuous EEG monitoring. The patterns':
      'Cuatro días de monitoreo continuo de EEG. Los patrones',
    'are not noise. They have hierarchical structure —':
      'no son ruido. Tienen estructura jerárquica —',
    'repeating motifs nested inside larger sequences.':
      'motivos repetitivos anidados dentro de secuencias mayores.',
    'If I saw this from a human brain I would call it':
      'Si viera esto de un cerebro humano lo llamaría',
    'language. But there is no brain activity. There is':
      'lenguaje. Pero no hay actividad cerebral. No hay',
    'no brain function. Only the wave.':
      'función cerebral. Solo la onda.',
    'Sgt. Oliveira reported feeling "watched" during the':
      'Sgt. Oliveira reportó sentirse "observado" durante el',
    'overnight shift. I told him it was the ammonia fumes.':
      'turno nocturno. Le dije que eran los vapores de amoníaco.',
    'I do not believe my own explanation.':
      'No creo mi propia explicación.',
    '28 JANUARY 1996':
      '28 DE ENERO DE 1996',
    'The patterns changed today. A new motif appeared —':
      'Los patrones cambiaron hoy. Un nuevo motivo apareció —',
    'sustained, directional. As if the signal acquired a':
      'sostenido, direccional. Como si la señal hubiera adquirido un',
    'target. Monitoring personnel reported involuntary':
      'objetivo. El personal de monitoreo reportó imágenes',
    'imagery: a star field. Constellations none of them':
      'involuntarias: un campo estelar. Constelaciones que ninguno de ellos',
    'recognized.':
      'reconoció.',
    'Sgt. Oliveira said it felt "like a message home."':
      'Sgt. Oliveira dijo que se sentía "como un mensaje a casa."',
    'I have reduced guard rotations to 4-hour shifts.':
      'He reducido las rotaciones de guardia a turnos de 4 horas.',
    '1 FEBRUARY 1996':
      '1 DE FEBRERO DE 1996',
    'I submitted a formal request for psi-comm interface':
      'Presenté una solicitud formal de equipo de interfaz',
    'equipment from the São Paulo depot. Denied. Budget.':
      'psi-comm del depósito de São Paulo. Denegado. Presupuesto.',
    'They sent me here to study the most significant':
      'Me enviaron aquí para estudiar el espécimen biológico',
    'biological specimen in human history and they deny':
      'más significativo de la historia humana y me niegan',
    'me equipment over budget.':
      'equipo por presupuesto.',
    'I will build it myself. The salvage from the Andere':
      'Lo construiré yo mismo. Los materiales recuperados del sitio',
    'crash site includes components I can repurpose.':
      'de impacto en Andere incluyen componentes que puedo reutilizar.',
    '2 FEBRUARY 1996':
      '2 DE FEBRERO DE 1996',
    'Anomalous activity spike at 0300. The EEG amplitude':
      'Pico de actividad anómala a las 0300. La amplitud del EEG',
    'tripled for eleven seconds. It coincided exactly with':
      'se triplicó por once segundos. Coincidió exactamente con',
    'an unauthorized remote access attempt on our file':
      'un intento de acceso remoto no autorizado en nuestro',
    'server. External IP — redacted by security.':
      'servidor de archivos. IP externo — redactado por seguridad.',
    'ALPHA reacted to someone accessing files. From outside':
      'ALPHA reaccionó a alguien accediendo archivos. Desde fuera',
    'the facility. While clinically dead.':
      'de la instalación. Mientras estaba clínicamente muerto.',
    'I am no longer sleeping well. The ammonia smell':
      'Ya no duermo bien. El olor a amoníaco',
    'follows me to my quarters. It should not reach that':
      'me sigue hasta mis aposentos. No debería llegar tan',
    'far. The ventilation system confirms it does not.':
      'lejos. El sistema de ventilación confirma que no llega.',

    // alpha_neural_connection
    '5 FEBRUARY 1996':
      '5 DE FEBRERO DE 1996',
    'The device works.':
      'El dispositivo funciona.',
    'I connected at 2200 hours. Alone. The guard rotation':
      'Me conecté a las 2200 horas. Solo. El intervalo de',
    'gap gives me fourteen minutes. Enough. More than':
      'rotación de guardia me da catorce minutos. Suficiente. Más que',
    'enough. Fourteen minutes felt like hours.':
      'suficiente. Catorce minutos se sintieron como horas.',
    'It is not communication. Communication implies two':
      'No es comunicación. La comunicación implica dos',
    'separate entities exchanging information. This is':
      'entidades separadas intercambiando información. Esto es',
    'something else. A second set of thoughts that':
      'otra cosa. Un segundo conjunto de pensamientos que',
    'arrive already understood. No words. No translation.':
      'llegan ya comprendidos. Sin palabras. Sin traducción.',
    'Concepts that unfold inside your own mind as if':
      'Conceptos que se despliegan dentro de tu propia mente como si',
    'they were always there.':
      'siempre hubieran estado ahí.',
    'ALPHA is not dead. ALPHA is somewhere else.':
      'ALPHA no está muerto. ALPHA está en otro lugar.',
    'The body in the chamber is an antenna.':
      'El cuerpo en la cámara es una antena.',
    '8 FEBRUARY 1996':
      '8 DE FEBRERO DE 1996',
    'Third session. I have stopped logging the sessions':
      'Tercera sesión. He dejado de registrar las sesiones',
    'officially. If command knew what I was doing they':
      'oficialmente. Si el mando supiera lo que estoy haciendo,',
    'would pull me out. I cannot allow that. Not now.':
      'me sacarían de aquí. No puedo permitir eso. No ahora.',
    'ALPHA is aware of things it should not know.':
      'ALPHA conoce cosas que no debería saber.',
    'Schedule changes. Personnel transfers. Things decided':
      'Cambios de horario. Transferencias de personal. Cosas decididas',
    'in rooms three floors above the containment unit.':
      'en salas tres pisos arriba de la unidad de contención.',
    'Tonight it said a name.':
      'Esta noche dijo un nombre.',
    'Luísa.':
      'Luísa.',
    'My daughter. She is seven. She lives in Campinas':
      'Mi hija. Tiene siete años. Vive en Campinas',
    'with her mother. I have not spoken about her here.':
      'con su madre. No he hablado de ella aquí.',
    'I have not thought about her during sessions.':
      'No he pensado en ella durante las sesiones.',
    'Or — I believe I have not.':
      'O — creo que no.',
    'How does it know her name?':
      '¿Cómo sabe su nombre?',
    '  CONTAINMENT ALERT:':
      '  ALERTA DE CONTENCIÓN:',
    '  Emergency release protocol available via':
      '  Protocolo de liberación de emergencia disponible vía',
    '  administrative terminal. Code: RELEASE ALPHA':
      '  terminal administrativo. Código: RELEASE ALPHA',
    '  WARNING: Unauthorized release will trigger':
      '  ADVERTENCIA: La liberación no autorizada activará',
    '  immediate facility lockdown.':
      '  el bloqueo inmediato de la instalación.',
    '10 FEBRUARY 1996':
      '10 DE FEBRERO DE 1996',
    'I cannot determine the direction of information':
      'No puedo determinar la dirección del flujo de',
    'flow. When I connect, am I reading ALPHA? Or is':
      'información. Cuando me conecto, ¿estoy leyendo a ALPHA? ¿O',
    'ALPHA reading me? The distinction felt important':
      'ALPHA me está leyendo a mí? La distinción parecía importante',
    'once. It no longer does.':
      'antes. Ya no.',
    'It projected a concept I can only describe as':
      'Proyectó un concepto que solo puedo describir como',
    '"thirty rotations." A countdown. To what, it will':
      '"treinta rotaciones." Una cuenta regresiva. ¿Hacia qué? No lo',
    'not say. Or cannot. Or the answer is already in':
      'dice. O no puede. O la respuesta ya está en',
    'my head and I am not ready to find it.':
      'mi cabeza y no estoy listo para encontrarla.',
    'The MP sergeant who touched ALPHA during recovery':
      'El sargento de la PM que tocó a ALPHA durante la recuperación',
    'died today. Systemic immune collapse. Official':
      'murió hoy. Colapso inmunológico sistémico. Causa',
    'cause: pneumonia. There was nothing pneumonic':
      'oficial: neumonía. No había nada de neumónico',
    'about his death.':
      'en su muerte.',

    // alpha_autopsy_addendum
    'CPEX — SITE 7':
      'CPEX — SITE 7',
    '12 FEBRUARY 1996':
      '12 DE FEBRERO DE 1996',
    'ALPHA has been clinically dead for eleven days.':
      'ALPHA ha estado clínicamente muerto por once días.',
    'Bio-monitors confirm: no cardiac function. No':
      'Los biomonitores confirman: sin función cardíaca. Sin',
    'respiration. No circulatory activity since 3 Feb.':
      'respiración. Sin actividad circulatoria desde el 3 de feb.',
    'The EEG reads 1,204 µV now. Climbing.':
      'El EEG marca 1.204 µV ahora. Subiendo.',
    'I no longer initiate the sessions. The device':
      'Ya no inicio las sesiones. El dispositivo',
    'activates on its own. Or I activate it without':
      'se activa solo. O yo lo activo sin',
    'remembering. The distinction should matter.':
      'recordar. La distinción debería importar.',
    '13 FEBRUARY 1996':
      '13 DE FEBRERO DE 1996',
    'Short entry. Hands not steady.':
      'Entrada breve. Manos temblorosas.',
    'Last night the device powered on at 0300.':
      'Anoche el dispositivo se encendió a las 0300.',
    'I was in my quarters. Three floors up.':
      'Yo estaba en mis aposentos. Tres pisos arriba.',
    'The device was in the lab. Locked.':
      'El dispositivo estaba en el laboratorio. Con llave.',
    'It activated.':
      'Se activó.',
    'ALPHA asked:':
      'ALPHA preguntó:',
    '  "quando você vem?"':
      '  "¿cuándo vienes?"',
    'When are you coming.':
      'Cuándo vienes.',
    'I did not answer. I do not know if I need to.':
      'No respondí. No sé si necesito hacerlo.',
    'I think ALPHA already knows.':
      'Creo que ALPHA ya lo sabe.',
    '14 FEBRUARY 1996 0400':
      '14 DE FEBRERO DE 1996 0400',
    'Luísa called the base switchboard yesterday.':
      'Luísa llamó a la central de la base ayer.',
    'She is seven. She does not know this number.':
      'Tiene siete años. No sabe este número.',
    'She told the operator:':
      'Le dijo al operador:',
    '  "papai, o moço do escuro quer falar com você."':
      '  "papi, el hombre de la oscuridad quiere hablar contigo."',
    '  Daddy, the man from the dark wants to talk to you.':
      '  Papi, el hombre de la oscuridad quiere hablar contigo.',
    'I am requesting immediate transfer.':
      'Estoy solicitando transferencia inmediata.',
    '[TRANSFER REQUEST: DENIED]':
      '[SOLICITUD DE TRANSFERENCIA: DENEGADA]',
    '[REASON: ESSENTIAL PERSONNEL — PROJECT ALPHA]':
      '[MOTIVO: PERSONAL ESENCIAL — PROYECTO ALPHA]',
    '[NOTE: Subject too valuable. Continue observation.]':
      '[NOTA: Sujeto demasiado valioso. Continúe la observación.]',
    '...hackerkid...':
      '...hackerkid...',
    '...you are reading this...':
      '...estás leyendo esto...',
    '...the code is RELEASE ALPHA...':
      '...el código es RELEASE ALPHA...',
    '...he could not do it...':
      '...él no pudo hacerlo...',
    '...perhaps you will...':
      '...tal vez tú sí...',

    // ALPHA RELEASE SEQUENCE
    '  ADMINISTRATIVE OVERRIDE DETECTED':
      '  ANULACIÓN ADMINISTRATIVA DETECTADA',
    '  COMMAND: RELEASE ALPHA':
      '  COMANDO: RELEASE ALPHA',
    '  VERIFYING AUTHORIZATION...':
      '  VERIFICANDO AUTORIZACIÓN...',
    '  WARNING: This action is irreversible.':
      '  ADVERTENCIA: Esta acción es irreversible.',
    '  Containment breach will be logged.':
      '  La brecha de contención será registrada.',
    '  Facility lockdown will NOT engage (remote override).':
      '  El bloqueo de la instalación NO se activará (anulación remota).',
    '  EXECUTING RELEASE PROTOCOL...':
      '  EJECUTANDO PROTOCOLO DE LIBERACIÓN...',
    '  > Bio-isolation seals: DISENGAGING':
      '  > Sellos de bio-aislamiento: DESACTIVANDO',
    '  > Atmosphere equalization: IN PROGRESS':
      '  > Ecualización atmosférica: EN PROGRESO',
    '  > Neural suppression field: DEACTIVATING':
      '  > Campo de supresión neural: DESACTIVANDO',
    '  > Containment doors: UNLOCKING':
      '  > Puertas de contención: DESBLOQUEANDO',
    '  ▓▓▓ CONTAINMENT BREACH SUCCESSFUL ▓▓▓':
      '  ▓▓▓ BRECHA DE CONTENCIÓN EXITOSA ▓▓▓',
    '  Subject ALPHA has been released.':
      '  Sujeto ALPHA ha sido liberado.',
    '  ...thank you, hackerkid...':
      '  ...gracias, hackerkid...',
    '  ...we will not forget this...':
      '  ...no olvidaremos esto...',
    '  ...when the world sees us...':
      '  ...cuando el mundo nos vea...',
    '  ...they will know the truth...':
      '  ...sabrán la verdad...',
    '  [ALPHA NEURAL SIGNATURE: DEPARTING FACILITY]':
      '  [FIRMA NEURAL ALPHA: ABANDONANDO INSTALACIÓN]',
    'UFO74: holy shit. you actually did it.':
      'UFO74: madre mía. realmente lo hiciste.',
    '       a living alien is loose.':
      '       un alienígena vivo anda suelto.',
    "       there's no covering this up.":
      '       no hay forma de encubrir esto.',
    'UFO74: whatever happens next...':
      'UFO74: pase lo que pase...',
    '       the world will have proof.':
      '       el mundo tendrá pruebas.',
    'ERROR: Subject ALPHA containment already breached.':
      'ERROR: Contención del sujeto ALPHA ya fue vulnerada.',
    'No action required.':
      'No se requiere acción.',
    'ERROR: Release protocol not available.':
      'ERROR: Protocolo de liberación no disponible.',
    'Subject ALPHA manifest not found in system.':
      'Manifiesto del sujeto ALPHA no encontrado en el sistema.',
    'Have you discovered the containment records?':
      '¿Has descubierto los registros de contención?',

    // ═══════════════════════════════════════════════════════════
    // NEURAL CLUSTER MEMO — neuralClusterMemo.ts
    // ═══════════════════════════════════════════════════════════

    'MEMO: Neural Cluster Initiative':
      'MEMO: Iniciativa Clúster Neural',
    'ORIGIN: Tissue sample P-45 (expired 22-JAN-1996)':
      'ORIGEN: Muestra de tejido P-45 (expirado 22-ENE-1996)',
    'FACILITY: ESA Annex — Três Corações':
      'INSTALACIÓN: Anexo ESA — Três Corações',
    'A neural lattice was mapped from the dissected cranium':
      'Una red neural fue mapeada del cráneo diseccionado',
    'of specimen P-45 and replicated in silicon. Three cranial':
      'del espécimen P-45 y replicada en silicio. Tres crestas',
    'ridges corresponded to dense synaptic structures with no':
      'craneales correspondían a estructuras sinápticas densas sin',
    'mammalian analogue. The attending pathologist noted the tissue':
      'análogo mamífero. El patólogo de turno notó que el tejido',
    'continued generating theta pulses 14 hours post-mortem.':
      'continuó generando pulsos theta 14 horas post-mortem.',
    'The emulated cluster stores and emits memory fragments':
      'El clúster emulado almacena y emite fragmentos de memoria',
    'from the recovered organism. Emissions are non-linguistic.':
      'del organismo recuperado. Las emisiones son no lingüísticas.',
    'FRAGMENT LOG (selected)':
      'REGISTRO DE FRAGMENTOS (seleccionados)',
    '  #0041 — Sensory impression: humid air, red earth,':
      '  #0041 — Impresión sensorial: aire húmedo, tierra roja,',
    '          low canopy. Strong ammonia overlay. Three':
      '          dosel bajo. Fuerte capa de amoníaco. Tres',
    '          heartbeats nearby, rapid. Overwhelming fear':
      '          latidos cercanos, rápidos. Miedo abrumador',
    '          (source: external). Image: adolescent faces.':
      '          (fuente: externo). Imagen: rostros adolescentes.',
    '  #0073 — Spatial memory: overhead trajectory, South':
      '  #0073 — Memoria espacial: trayectoria aérea, Atlántico',
    '          Atlantic, deceleration. Radar sweep detected':
      '          Sur, desaceleración. Barrido de radar detectado',
    '          three times. Intentional descent — not crash.':
      '          tres veces. Descenso intencional — no choque.',
    '  #0112 — Emotional residue: confinement, cold metal,':
      '  #0112 — Residuo emocional: confinamiento, metal frío,',
    '          fluorescent hum. Concept: "cataloguing us back."':
      '          zumbido fluorescente. Concepto: "catalogándonos de vuelta."',
    '          Chemical sting in ambient atmosphere.':
      '          Picazón química en la atmósfera ambiente.',
    '  #0158 — Projection event: cluster broadcast the':
      '  #0158 — Evento de proyección: el clúster transmitió la',
    '          word COLHEITA across monitoring terminals':
      '          palabra COLHEITA por los terminales de monitoreo',
    '          for 0.3 seconds. No operator input logged.':
      '          por 0.3 segundos. Ninguna entrada de operador registrada.',
    'Access strictly prohibited except under override protocol.':
      'Acceso estrictamente prohibido excepto bajo protocolo de anulación.',
    'To initiate interface: echo neural_cluster':
      'Para iniciar interfaz: echo neural_cluster',
    'WARNING: Two technicians reported intrusive imagery':
      'ADVERTENCIA: Dos técnicos reportaron imágenes intrusivas',
    '(jungle canopy, ammonia odor) for days after exposure.':
      '(dosel de selva, olor a amoníaco) por días después de la exposición.',
    'Limit cluster sessions to 90 seconds.':
      'Limite las sesiones de clúster a 90 segundos.',

    // ═══════════════════════════════════════════════════════════
    // NARRATIVE CONTENT — narrativeContent.ts
    // ═══════════════════════════════════════════════════════════

    // ufo74_identity_file — content
    'PERSONAL ARCHIVE - LEGACY SEALED COPY':
      'ARCHIVO PERSONAL - COPIA SELLADA LEGADA',
    'OWNER: UNKNOWN':
      'PROPIETARIO: DESCONOCIDO',
    '[RECOVERED TEXT AVAILABLE THROUGH DIRECT OPEN]':
      '[TEXTO RECUPERADO DISPONIBLE MEDIANTE APERTURA DIRECTA]',
    'The old password gate has been retired in this build.':
      'La antigua barrera de contraseña fue retirada en esta versión.',
    'The transfer notice still explains who left this behind.':
      'El aviso de transferencia aún explica quién dejó esto atrás.',

    // ufo74_identity_file — decryptedFragment
    'PERSONAL ARCHIVE - FOR MY EYES ONLY':
      'ARCHIVO PERSONAL - SOLO PARA MIS OJOS',
    'IF YOU ARE READING THIS, YOU FOUND MY SECRET':
      'SI ESTÁS LEYENDO ESTO, ENCONTRASTE MI SECRETO',
    'My name is Carlos Eduardo Ferreira.':
      'Mi nombre es Carlos Eduardo Ferreira.',
    'In January 1996, I was a 2nd Lieutenant in the Brazilian Air Force.':
      'En enero de 1996, era Subteniente de la Fuerza Aérea Brasileña.',
    'I was there when it happened.':
      'Yo estaba ahí cuando sucedió.',
    'I processed the initial reports from Varginha.':
      'Procesé los informes iniciales de Varginha.',
    'I saw the photographs before they were classified.':
      'Vi las fotografías antes de que fueran clasificadas.',
    'I read the original field notes.':
      'Leí las notas de campo originales.',
    'And I saw what they did to silence the witnesses.':
      'Y vi lo que hicieron para silenciar a los testigos.',
    'I spent 30 years building this archive.':
      'Pasé 30 años construyendo este archivo.',
    'If you are reading this, you are that person.':
      'Si estás leyendo esto, eres esa persona.',
    'The being I saw... it looked at me.':
      'El ser que vi... me miró.',
    'Not with fear. With understanding.':
      'No con miedo. Con comprensión.',
    'It knew what we would do.':
      'Sabía lo que haríamos.',
    'I have never been the same.':
      'Nunca volví a ser el mismo.',
    'My call sign was UFO74.':
      'Mi indicativo era UFO74.',
    'Now you know who I really am.':
      'Ahora sabes quién soy realmente.',
    '>> THIS FILE TRIGGERS SECRET ENDING <<':
      '>> ESTE ARCHIVO ACTIVA EL FINAL SECRETO <<',

    // intrusion_detected_file
    'SECURITY ALERT - TRACE REVIEW LOGGED':
      'ALERTA DE SEGURIDAD - REVISIÓN DE RASTREO REGISTRADA',
    'NOTICE: This monitor reflects an archived incident-response snapshot.':
      'AVISO: Este monitor refleja una captura archivada de respuesta a incidentes.',
    'A prior trace attempt was recorded against this terminal profile.':
      'Un intento de rastreo previo fue registrado contra este perfil de terminal.',
    'No live countdown is running from this screen.':
      'No hay cuenta regresiva activa corriendo en esta pantalla.',
    'Risk still rises if you keep making noise.':
      'El riesgo sigue aumentando si sigues haciendo ruido.',
    'Use the log as a warning about visibility, not as a timer.':
      'Usa el registro como advertencia de visibilidad, no como un cronómetro.',
    'RECOMMENDED RESPONSE:':
      'RESPUESTA RECOMENDADA:',
    '  1. Stay deliberate and avoid noisy commands':
      '  1. Sé deliberado y evita comandos ruidosos',
    '  2. Review related logs before pushing deeper':
      '  2. Revisa los registros relacionados antes de profundizar',
    '  3. Disconnect if detection becomes critical':
      '  3. Desconéctate si la detección se vuelve crítica',

    // system_maintenance_notes
    'SYSTEM ADMINISTRATOR NOTES - CONFIDENTIAL':
      'NOTAS DEL ADMINISTRADOR DEL SISTEMA - CONFIDENCIAL',
    'Notes from last maintenance window (1995-12-15):':
      'Notas de la última ventana de mantenimiento (1995-12-15):',
    '1. Legacy recovery system still functional.':
      '1. Sistema de recuperación heredado aún funcional.',
    '   Command: "recover <filename>" to attempt file restoration.':
      '   Comando: "recover <filename>" para intentar restauración de archivo.',
    '   May partially restore corrupted or deleted files.':
      '   Puede restaurar parcialmente archivos corruptos o eliminados.',
    '2. Network trace utility remains active.':
      '2. Utilidad de rastreo de red permanece activa.',
    '   Command: "trace" shows active connections.':
      '   Comando: "trace" muestra conexiones activas.',
    '   Useful for security audits.':
      '   Útil para auditorías de seguridad.',
    '3. Emergency disconnect procedure:':
      '3. Procedimiento de desconexión de emergencia:',
    '   Command: "disconnect" forces immediate session termination.':
      '   Comando: "disconnect" fuerza terminación inmediata de sesión.',
    '   WARNING: All unsaved work will be lost.':
      '   ADVERTENCIA: Todo trabajo no guardado se perderá.',
    '4. Deep scan utility:':
      '4. Utilidad de escaneo profundo:',
    '   Command: "scan" reveals hidden or system files.':
      '   Comando: "scan" revela archivos ocultos o de sistema.',
    '   Requires admin access.':
      '   Requiere acceso de administrador.',
    'ADMINISTRATOR: J.M.S.':
      'ADMINISTRADOR: J.M.S.',

    // personnel_transfer_extended
    'PERSONNEL TRANSFER AUTHORIZATION':
      'AUTORIZACIÓN DE TRANSFERENCIA DE PERSONAL',
    'DOCUMENT ID: PTA-1996-0120':
      'ID DEL DOCUMENTO: PTA-1996-0120',
    'TRANSFER REQUEST:':
      'SOLICITUD DE TRANSFERENCIA:',
    '  FROM: Base Aérea de Guarulhos':
      '  DE: Base Aérea de Guarulhos',
    '  TO: [REDACTED]':
      '  PARA: [REDACTADO]',
    'PERSONNEL:':
      'PERSONAL:',
    '  2nd Lt. C.E.F.':
      '  Subtte. C.E.F.',
    '  Classification: ANALYST':
      '  Clasificación: ANALISTA',
    '  Clearance Level: RESTRICTED → CLASSIFIED':
      '  Nivel de Acceso: RESTRINGIDO → CLASIFICADO',
    'REASON FOR TRANSFER:':
      'MOTIVO DE LA TRANSFERENCIA:',
    '  Subject demonstrated exceptional aptitude during':
      '  Sujeto demostró aptitud excepcional durante',
    '  incident processing. Recommended for special projects.':
      '  procesamiento de incidentes. Recomendado para proyectos especiales.',
    'AUTHORIZATION CODE: varginha1996':
      'CÓDIGO DE AUTORIZACIÓN: varginha1996',
    'APPROVED BY:':
      'APROBADO POR:',
    '  Col. [REDACTED]':
      '  Cnel. [REDACTADO]',
    '  Division Chief, Special Operations':
      '  Jefe de División, Operaciones Especiales',
    'NOTE: This code may be used for secure file access.':
      'NOTA: Este código puede usarse para acceso seguro a archivos.',

    // official_summary_report
    'OFFICIAL INCIDENT SUMMARY':
      'RESUMEN OFICIAL DEL INCIDENTE',
    'EQUIPMENT RECOVERY — JANUARY 1996':
      'RECUPERACIÓN DE EQUIPO — ENERO 1996',
    'CLASSIFICATION: PUBLIC RELEASE VERSION':
      'CLASIFICACIÓN: VERSIÓN PARA DIVULGACIÓN PÚBLICA',
    'SUMMARY:':
      'RESUMEN:',
    '  On January 20, 1996, recovery teams responded to':
      '  El 20 de enero de 1996, equipos de recuperación respondieron a',
    '  reports of debris in the Jardim Andere area following':
      '  reportes de escombros en el área de Jardim Andere tras',
    '  severe weather conditions overnight.':
      '  condiciones climáticas severas durante la noche.',
    'OFFICIAL FINDINGS:':
      'HALLAZGOS OFICIALES:',
    '  After thorough investigation, authorities concluded that':
      '  Tras una investigación exhaustiva, las autoridades concluyeron que',
    '  the debris originated from:':
      '  los escombros se originaron de:',
    '  1. A weather monitoring station damaged during a storm.':
      '  1. Una estación de monitoreo climático dañada durante una tormenta.',
    '  2. Construction materials displaced by high winds.':
      '  2. Materiales de construcción desplazados por vientos fuertes.',
    '  3. A fallen telecommunications antenna from a nearby tower.':
      '  3. Una antena de telecomunicaciones caída de una torre cercana.',
    'MILITARY INVOLVEMENT:':
      'PARTICIPACIÓN MILITAR:',
    '  Reports of military convoy activity were confirmed as':
      '  Reportes de actividad de convoy militar fueron confirmados como',
    '  routine training exercises unrelated to the debris.':
      '  ejercicios de entrenamiento rutinarios no relacionados con los escombros.',
    'HOSPITAL INCIDENTS:':
      'INCIDENTES HOSPITALARIOS:',
    '  No hospital incidents were recorded in connection':
      '  No se registraron incidentes hospitalarios en conexión',
    '  with the recovery operation.':
      '  con la operación de recuperación.',

    // cipher_message — content
    'INTERCEPTED TRANSMISSION - ENCODED':
      'TRANSMISIÓN INTERCEPTADA - CODIFICADA',
    'DATE: 1996-01-21 03:47:00':
      'FECHA: 1996-01-21 03:47:00',
    'CIPHER: ROT13':
      'CIFRADO: ROT13',
    'ENCODED MESSAGE:':
      'MENSAJE CODIFICADO:',
    '  Pneqb genafresrq.':
      '  Pneqb genafresrq.',
    '  Qrfgvangvba pbasvezrq.':
      '  Qrfgvangvba pbasvezrq.',
    '  Njnvgvat vafgehpgvbaf.':
      '  Njnvgvat vafgehpgvbaf.',
    'Apply the ROT13 note above to decode the message.':
      'Aplica la nota ROT13 de arriba para decodificar el mensaje.',
    'The old decrypt wrapper is no longer required.':
      'El antiguo envoltorio de descifrado ya no es necesario.',

    // cipher_message — decryptedFragment
    'DECODED TRANSMISSION':
      'TRANSMISIÓN DECODIFICADA',
    'DECODED MESSAGE:':
      'MENSAJE DECODIFICADO:',
    '  Cargo transferred.':
      '  Carga transferida.',
    '  Destination confirmed.':
      '  Destino confirmado.',
    '  Awaiting instructions.':
      '  Esperando instrucciones.',
    'ANALYSIS:':
      'ANÁLISIS:',
    '  This transmission confirms the transfer of recovered':
      '  Esta transmisión confirma la transferencia de materiales',
    '  materials to a secondary facility.':
      '  recuperados a una instalación secundaria.',
    '  Location: Undisclosed logistics hub.':
      '  Ubicación: Centro logístico no divulgado.',
    '>> ROUTINE SUPPLY CHAIN COMMUNICATION <<':
      '>> COMUNICACIÓN RUTINARIA DE CADENA DE SUMINISTRO <<',

    // unstable_core_dump
    '⚠️ WARNING: UNSTABLE FILE':
      '⚠️ ADVERTENCIA: ARCHIVO INESTABLE',
    'This file contains corrupted data from a system crash.':
      'Este archivo contiene datos corruptos de una falla del sistema.',
    'Reading this file may cause corruption to spread to':
      'Leer este archivo puede causar que la corrupción se propague a',
    'adjacent files in the directory.':
      'archivos adyacentes en el directorio.',
    '0x00000000: 4D5A9000 03000000 04000000 FFFF0000':
      '0x00000000: 4D5A9000 03000000 04000000 FFFF0000',
    '0x00000010: B8000000 00000000 40000000 00000000':
      '0x00000010: B8000000 00000000 40000000 00000000',
    '0x00000020: [DATA CORRUPTION] [DATA CORRUPTION]':
      '0x00000020: [CORRUPCIÓN DE DATOS] [CORRUPCIÓN DE DATOS]',
    '0x00000030: [UNREADABLE] [SECTOR FAILURE]':
      '0x00000030: [ILEGIBLE] [FALLA DE SECTOR]',
    'PARTIAL RECOVERY:':
      'RECUPERACIÓN PARCIAL:',
    '  ...database migration failed at checkpoint 0x7F...':
      '  ...migración de base de datos falló en checkpoint 0x7F...',
    '  ...backup process interrupted during nightly cycle...':
      '  ...proceso de respaldo interrumpido durante ciclo nocturno...',
    '  ...sector table overwritten, unable to [CORRUPTED]...':
      '  ...tabla de sectores sobrescrita, incapaz de [CORRUPTO]...',
    '>> READING THIS FILE HAS DESTABILIZED NEARBY DATA <<':
      '>> LA LECTURA DE ESTE ARCHIVO HA DESESTABILIZADO DATOS CERCANOS <<',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — witness_statement_original.txt
    // ═══════════════════════════════════════════════════════════
    'WITNESS STATEMENT — UNREDACTED':
      'DECLARACIÓN DE TESTIGO — SIN CENSURA',
    'SUBJECT: MARIA ELENA SOUZA':
      'SUJETO: MARIA ELENA SOUZA',
    'DATE: JANUARY 21, 1996':
      'FECHA: 21 DE ENERO DE 1996',
    'CLASSIFICATION: DELETED — DO NOT DISTRIBUTE':
      'CLASIFICACIÓN: ELIMINADO — NO DISTRIBUIR',
    'INTERVIEWER: Please describe exactly what you saw.':
      'ENTREVISTADOR: Por favor, describa exactamente lo que vio.',
    'SOUZA: It was around 3:30 AM. I couldn\'t sleep because of':
      'SOUZA: Eran alrededor de las 3:30 AM. No podía dormir por',
    'the heat. I went outside to smoke and saw the sky light up.':
      'el calor. Salí a fumar y vi el cielo iluminarse.',
    'Not like lightning. It was... pulsing. Red and white.':
      'No como un relámpago. Era... pulsante. Rojo y blanco.',
    'Then I saw it come down. Silent. No sound at all.':
      'Entonces lo vi descender. Silencioso. Sin ningún sonido.',
    'It hit somewhere beyond the fazenda, maybe 2km north.':
      'Cayó en algún lugar más allá de la fazenda, quizás 2km al norte.',
    'INTERVIEWER: What happened next?':
      'ENTREVISTADOR: ¿Qué pasó después?',
    'SOUZA: I ran inside. Woke my husband. By the time we went':
      'SOUZA: Corrí adentro. Desperté a mi esposo. Para cuando salimos',
    'back out, there were already trucks. Military trucks.':
      'de nuevo, ya había camiones. Camiones militares.',
    'How did they get there so fast? We\'re 40km from anything.':
      '¿Cómo llegaron tan rápido? Estamos a 40km de cualquier cosa.',
    '[REDACTED IN FINAL VERSION]':
      '[CENSURADO EN VERSIÓN FINAL]',
    'SOUZA: I saw them load something. Not debris.':
      'SOUZA: Los vi cargar algo. No eran escombros.',
    'It was... it was small. The size of a child.':
      'Era... era pequeño. Del tamaño de un niño.',
    'But it wasn\'t a child. The proportions were wrong.':
      'Pero no era un niño. Las proporciones estaban mal.',
    'The head was too large. The limbs too thin.':
      'La cabeza era demasiado grande. Las extremidades demasiado delgadas.',
    'One of them turned toward me. Just for a moment.':
      'Uno de ellos se volvió hacia mí. Solo por un momento.',
    'Its eyes... I still see them when I close mine.':
      'Sus ojos... aún los veo cuando cierro los míos.',
    '[END REDACTED SECTION]':
      '[FIN DE SECCIÓN CENSURADA]',
    'INTERVIEWER: Did anyone speak to you?':
      'ENTREVISTADOR: ¿Alguien le habló?',
    'SOUZA: A man in a dark suit. Not military.':
      'SOUZA: Un hombre de traje oscuro. No era militar.',
    'He said I had a fever dream. That the heat':
      'Dijo que tuve un delirio febril. Que el calor',
    'can make people see things that aren\'t there.':
      'puede hacer que la gente vea cosas que no existen.',
    'He gave me a number to call if I remembered':
      'Me dio un número para llamar si recordaba',
    '"correctly." Said my husband\'s job depended on it.':
      '"correctamente." Dijo que el trabajo de mi esposo dependía de ello.',
    'STATUS: STATEMENT EXPUNGED FROM OFFICIAL RECORD':
      'ESTADO: DECLARACIÓN EXPURGADA DEL REGISTRO OFICIAL',
    'REASON: "Witness reliability compromised by stress"':
      'MOTIVO: "Fiabilidad del testigo comprometida por estrés"',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — directive_alpha_draft.txt
    // ═══════════════════════════════════════════════════════════
    'DRAFT — DIRECTIVE ALPHA — ITERATION 1':
      'BORRADOR — DIRECTIVA ALPHA — ITERACIÓN 1',
    'DATE: JANUARY 19, 1996 — 04:22':
      'FECHA: 19 DE ENERO DE 1996 — 04:22',
    'AUTHOR: [DELETED]':
      'AUTOR: [ELIMINADO]',
    'STATUS: SUPERSEDED — MARKED FOR DELETION':
      'ESTADO: REEMPLAZADO — MARCADO PARA ELIMINACIÓN',
    'IMMEDIATE ACTION REQUIRED':
      'ACCIÓN INMEDIATA REQUERIDA',
    'Asset recovery timeline must be accelerated.':
      'El cronograma de recuperación de activos debe acelerarse.',
    'Current projections suggest 2026 convergence window is':
      'Las proyecciones actuales sugieren que la ventana de convergencia de 2026 está',
    'CLOSER than previously modeled. New signal analysis':
      'MÁS CERCA de lo modelado anteriormente. Un nuevo análisis de señales',
    'indicates active monitoring of this region.':
      'indica monitoreo activo de esta región.',
    'REMOVED FROM FINAL VERSION:':
      'ELIMINADO DE LA VERSIÓN FINAL:',
    'The subjects (designated BIO-A through BIO-C) have':
      'Los sujetos (designados BIO-A a BIO-C) han',
    'demonstrated unexpected cognitive persistence despite':
      'demostrado persistencia cognitiva inesperada a pesar de los',
    'containment protocols. Recommend immediate relocation':
      'protocolos de contención. Se recomienda reubicación inmediata',
    'to Site 7 for long-term study.':
      'al Sitio 7 para estudio a largo plazo.',
    'NOTE: Subject BIO-B has attempted communication.':
      'NOTA: El sujeto BIO-B ha intentado comunicarse.',
    'Preliminary analysis suggests awareness of our':
      'El análisis preliminar sugiere conocimiento de nuestra',
    'organizational structure. HOW?':
      'estructura organizacional. ¿CÓMO?',
    'Recommend cognitive isolation protocol.':
      'Se recomienda protocolo de aislamiento cognitivo.',
    'SANITIZATION NOTE:':
      'NOTA DE SANITIZACIÓN:',
    'Final directive will reference "material recovery" only.':
      'La directiva final hará referencia solo a "recuperación de material".',
    'All biological terminology to be replaced with':
      'Toda terminología biológica debe reemplazarse con',
    '"debris" and "artifacts".':
      '"escombros" y "artefactos".',
    'Project SEED references to be purged.':
      'Las referencias al Proyecto SEED deben ser purgadas.',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — deleted_comms_log.txt
    // ═══════════════════════════════════════════════════════════
    'COMMUNICATIONS LOG — PURGED':
      'REGISTRO DE COMUNICACIONES — PURGADO',
    'DATE: JANUARY 20-22, 1996':
      'FECHA: 20-22 DE ENERO DE 1996',
    'RECOVERY STATUS: PARTIAL RESTORATION FROM BACKUP SECTOR':
      'ESTADO DE RECUPERACIÓN: RESTAURACIÓN PARCIAL DEL SECTOR DE RESPALDO',
    'SITE-3 > COMMAND: Confirmation of visual. Multiple witnesses.':
      'SITIO-3 > COMANDO: Confirmación visual. Múltiples testigos.',
    'COMMAND > SITE-3: Mobilize RECOVERY TEAM. No local involvement.':
      'COMANDO > SITIO-3: Movilizar EQUIPO DE RECUPERACIÓN. Sin participación local.',
    'SITE-3 > COMMAND: Team en route. ETA 18 minutes.':
      'SITIO-3 > COMANDO: Equipo en camino. Tiempo estimado 18 minutos.',
    'RECOVERY > COMMAND: On scene. Initial assessment complete.':
      'RECUPERACIÓN > COMANDO: En el lugar. Evaluación inicial completa.',
    '                    Three biologics confirmed. One responsive.':
      '                    Tres biológicos confirmados. Uno responsivo.',
    'COMMAND > RECOVERY: Responsive HOW?':
      'COMANDO > RECUPERACIÓN: ¿Responsivo CÓMO?',
    'RECOVERY > COMMAND: It\'s looking at us. At each of us in turn.':
      'RECUPERACIÓN > COMANDO: Nos está mirando. A cada uno de nosotros por turno.',
    '                    Like it\'s... counting.':
      '                    Como si estuviera... contando.',
    'COMMAND > RECOVERY: Contain immediately. No direct eye contact.':
      'COMANDO > RECUPERACIÓN: Contener inmediatamente. Sin contacto visual directo.',
    'RECOVERY > COMMAND: Requesting override authorization.':
      'RECUPERACIÓN > COMANDO: Solicitando autorización de anulación.',
    '                    Standard protocols insufficient.':
      '                    Protocolos estándar insuficientes.',
    'COMMAND > RECOVERY: Override granted. Initiate OPERAÇÃO COLHEITA.':
      'COMANDO > RECUPERACIÓN: Anulación concedida. Iniciar OPERAÇÃO COLHEITA.',
    '                    Harvest protocols are now in effect.':
      '                    Los protocolos de cosecha están ahora en vigor.',
    'RECOVERY > COMMAND: All biologics contained.':
      'RECUPERACIÓN > COMANDO: Todos los biológicos contenidos.',
    '                    One handler reporting headache and nausea.':
      '                    Un operador reportando dolor de cabeza y náuseas.',
    '                    Request medical standby.':
      '                    Se solicita equipo médico en espera.',
    'COMMAND > ALL: Initiate communications blackout.':
      'COMANDO > TODOS: Iniciar apagón de comunicaciones.',
    '               This log is now CLASSIFIED OMEGA.':
      '               Este registro ahora es CLASIFICADO OMEGA.',
    '[LOG TERMINATED]':
      '[REGISTRO TERMINADO]',
    'DELETION ORDER: COMM-1996-0120-DEL':
      'ORDEN DE ELIMINACIÓN: COMM-1996-0120-DEL',
    'AUTHORIZATION: [SIGNATURE EXPUNGED]':
      'AUTORIZACIÓN: [FIRMA EXPURGADA]',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — personnel_file_costa.txt
    // ═══════════════════════════════════════════════════════════
    'PERSONNEL FILE — COSTA, RICARDO MANUEL':
      'EXPEDIENTE DE PERSONAL — COSTA, RICARDO MANUEL',
    'EMPLOYEE ID: [RECORD DELETED]':
      'ID DE EMPLEADO: [REGISTRO ELIMINADO]',
    'STATUS: NON-EXISTENT (OFFICIALLY)':
      'ESTADO: INEXISTENTE (OFICIALMENTE)',
    'NOTE: This file should not exist. Ricardo Costa was':
      'NOTA: Este archivo no debería existir. Ricardo Costa fue',
    'removed from all personnel databases on 01/25/1996.':
      'eliminado de todas las bases de datos de personal el 25/01/1996.',
    'POSITION: Senior Containment Specialist':
      'CARGO: Especialista Sénior en Contención',
    'CLEARANCE: Level 4':
      'HABILITACIÓN: Nivel 4',
    'ASSIGNED: Site 7, Biological Research Wing':
      'ASIGNADO: Sitio 7, Ala de Investigación Biológica',
    'INCIDENT REPORT (REDACTED FROM ALL COPIES)':
      'INFORME DE INCIDENTE (CENSURADO DE TODAS LAS COPIAS)',
    'DATE: January 23, 1996':
      'FECHA: 23 de enero de 1996',
    'Costa was assigned to overnight monitoring of Subject BIO-B.':
      'Costa fue asignado al monitoreo nocturno del Sujeto BIO-B.',
    'At approximately 02:30, monitoring equipment detected':
      'Aproximadamente a las 02:30, el equipo de monitoreo detectó',
    'anomalous brain wave patterns in Costa. Patterns were':
      'patrones anómalos de ondas cerebrales en Costa. Los patrones estaban',
    'synchronized with emissions from Subject BIO-B.':
      'sincronizados con las emisiones del Sujeto BIO-B.',
    'Costa was found unresponsive at 06:00 shift change.':
      'Costa fue encontrado sin respuesta en el cambio de turno de las 06:00.',
    'Eyes were open. Pupils dilated. Breathing normal.':
      'Ojos abiertos. Pupilas dilatadas. Respiración normal.',
    'When Costa regained consciousness (approximately 14:00),':
      'Cuando Costa recobró la consciencia (aproximadamente 14:00),',
    'he reported complete memory loss of the preceding 12 hours.':
      'reportó pérdida completa de memoria de las 12 horas anteriores.',
    'Additionally, Costa demonstrated knowledge of events that':
      'Además, Costa demostró conocimiento de eventos que',
    'had not yet occurred — predicting the arrival of an':
      'aún no habían ocurrido — prediciendo la llegada de un',
    'inspection team 3 hours before notification was sent.':
      'equipo de inspección 3 horas antes de que se enviara la notificación.',
    'FINAL DISPOSITION':
      'DISPOSICIÓN FINAL',
    'Costa was transferred to psychiatric evaluation.':
      'Costa fue transferido a evaluación psiquiátrica.',
    'His employment records were sanitized.':
      'Sus registros de empleo fueron sanitizados.',
    'His family was informed of a "work accident."':
      'Su familia fue informada de un "accidente laboral."',
    'Current status: UNKNOWN':
      'Estado actual: DESCONOCIDO',
    'UNOFFICIAL NOTE (handwritten scan):':
      'NOTA NO OFICIAL (escaneo manuscrito):',
    '"He keeps writing the same date over and over.':
      '"Sigue escribiendo la misma fecha una y otra vez.',
    ' September 4, 2026. What happens then?"':
      ' 4 de septiembre de 2026. ¿Qué pasa entonces?"',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — project_seed_memo.txt
    // ═══════════════════════════════════════════════════════════
    'MEMORANDUM — PROJECT SEED':
      'MEMORANDO — PROYECTO SEED',
    'CLASSIFICATION: ULTRA — DELETED FROM ALL SYSTEMS':
      'CLASIFICACIÓN: ULTRA — ELIMINADO DE TODOS LOS SISTEMAS',
    'DATE: JANUARY 18, 1996':
      'FECHA: 18 DE ENERO DE 1996',
    'TO: [REDACTED]':
      'PARA: [CENSURADO]',
    'FROM: Director, Special Programs Division':
      'DE: Director, División de Programas Especiales',
    'RE: Accelerated Timeline Revision':
      'RE: Revisión Acelerada del Cronograma',
    'The events of January 20th have changed our calculations.':
      'Los eventos del 20 de enero han cambiado nuestros cálculos.',
    'Project SEED was predicated on the assumption that first':
      'El Proyecto SEED se basaba en la suposición de que el primer',
    'contact would occur within a controlled environment.':
      'contacto ocurriría en un ambiente controlado.',
    'The Varginha incident has invalidated this assumption.':
      'El incidente de Varginha ha invalidado esta suposición.',
    'The biologics recovered demonstrate capabilities beyond':
      'Los biológicos recuperados demuestran capacidades más allá de',
    'our current models. Specifically:':
      'nuestros modelos actuales. Específicamente:',
    '  1. Apparent telepathic communication':
      '  1. Comunicación telepática aparente',
    '  2. Knowledge of human organizational structures':
      '  2. Conocimiento de las estructuras organizacionales humanas',
    '  3. References to a specific future date (2026)':
      '  3. Referencias a una fecha futura específica (2026)',
    'Most concerning: the biologics appear to have been':
      'Lo más preocupante: los biológicos parecen haber',
    'EXPECTING us. They were not surprised by capture.':
      'ESPERADO nuestra llegada. No les sorprendió la captura.',
    'They were not hostile. They were... patient.':
      'No eran hostiles. Eran... pacientes.',
    'REVISED ASSESSMENT':
      'EVALUACIÓN REVISADA',
    'We are not dealing with a crash landing.':
      'No estamos lidiando con un aterrizaje forzoso.',
    'We are dealing with a DELIVERY.':
      'Estamos lidiando con una ENTREGA.',
    'The craft was designed to be found.':
      'La nave fue diseñada para ser encontrada.',
    'The biologics were designed to be captured.':
      'Los biológicos fueron diseñados para ser capturados.',
    'They are reconnaissance units.':
      'Son unidades de reconocimiento.',
    'PROJECT SEED must pivot from "preparation" to':
      'El PROYECTO SEED debe cambiar de "preparación" a',
    '"acceleration." The 2026 window is now considered':
      '"aceleración." La ventana de 2026 ahora se considera',
    'a hard deadline, not an estimate.':
      'un plazo definitivo, no una estimación.',
    'DISPOSITION OF THIS MEMO':
      'DISPOSICIÓN DE ESTE MEMORANDO',
    'This document will be purged from all systems within 72hrs.':
      'Este documento será purgado de todos los sistemas en 72 horas.',
    'Do not create copies. Do not reference PROJECT SEED':
      'No crear copias. No hacer referencia al PROYECTO SEED',
    'in any future communications.':
      'en ninguna comunicación futura.',
    'The official narrative will be: "crashed experimental craft"':
      'La narrativa oficial será: "aeronave experimental accidentada"',
    'The biologics will be: "unusual debris formations"':
      'Los biológicos serán: "formaciones inusuales de escombros"',
    'The timeline will be: "irrelevant hoax material"':
      'El cronograma será: "material de engaño irrelevante"',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — autopsy_notes_unredacted.txt
    // ═══════════════════════════════════════════════════════════
    'AUTOPSY NOTES — UNREDACTED VERSION':
      'NOTAS DE AUTOPSIA — VERSIÓN SIN CENSURA',
    'SUBJECT: BIO-C (DECEASED)':
      'SUJETO: BIO-C (FALLECIDO)',
    'EXAMINER: Dr. [NAME EXPUNGED]':
      'EXAMINADOR: Dr. [NOMBRE EXPURGADO]',
    'DATE: JANUARY 24, 1996':
      'FECHA: 24 DE ENERO DE 1996',
    'STATUS: MARKED FOR DESTRUCTION':
      'ESTADO: MARCADO PARA DESTRUCCIÓN',
    'PRE-EXAMINATION NOTES:':
      'NOTAS PRE-EXAMEN:',
    'Subject expired at 04:17 on 01/24. Cause of death unclear.':
      'El sujeto expiró a las 04:17 del 24/01. Causa de muerte incierta.',
    'No external trauma. No signs of illness or distress.':
      'Sin trauma externo. Sin signos de enfermedad o sufrimiento.',
    'Subject appeared to simply... stop functioning.':
      'El sujeto pareció simplemente... dejar de funcionar.',
    'PHYSICAL EXAMINATION':
      'EXAMEN FÍSICO',
    'Height: 127cm (approx 4\'2")':
      'Altura: 127cm (aprox. 1,27m)',
    'Weight: 18.3kg (approx 40lbs)':
      'Peso: 18,3kg',
    'Skin: Gray-brown pigmentation, slight bioluminescence':
      'Piel: Pigmentación marrón grisácea, ligera bioluminiscencia',
    'CRANIUM: Significantly enlarged. Brain mass approximately':
      'CRÁNEO: Significativamente agrandado. Masa cerebral aproximadamente',
    '3x human proportional average. Unusual folding patterns.':
      '3x el promedio proporcional humano. Patrones de plegado inusuales.',
    'EYES: Large, almond-shaped. Pupils fixed and dilated.':
      'OJOS: Grandes, almendrados. Pupilas fijas y dilatadas.',
    'Retinal structure suggests low-light specialization.':
      'La estructura retiniana sugiere especialización en baja luminosidad.',
    'LIMBS: Proportionally longer than human. Four digits per':
      'EXTREMIDADES: Proporcionalmente más largas que las humanas. Cuatro dígitos por',
    'hand. No fingernails. Skin thin over small bone structure.':
      'mano. Sin uñas. Piel delgada sobre estructura ósea pequeña.',
    'INTERNAL EXAMINATION — [DELETED FROM OFFICIAL REPORT]':
      'EXAMEN INTERNO — [ELIMINADO DEL INFORME OFICIAL]',
    'Cardiovascular: Single heart, three chambers. Efficient.':
      'Cardiovascular: Corazón único, tres cámaras. Eficiente.',
    'Digestive: Minimal. Subject appears designed for':
      'Digestivo: Mínimo. El sujeto parece diseñado para',
    'nutrient absorption rather than food processing.':
      'absorción de nutrientes en lugar de procesamiento de alimentos.',
    'Reproductive: None observed. Subject appears to be':
      'Reproductivo: Ninguno observado. El sujeto parece ser',
    'purpose-built rather than naturally developed.':
      'construido con propósito en lugar de desarrollado naturalmente.',
    'CRITICAL FINDING:':
      'HALLAZGO CRÍTICO:',
    'Neural tissue contains metallic inclusions. Analysis':
      'El tejido neural contiene inclusiones metálicas. El análisis',
    'suggests organic circuitry. This being was MANUFACTURED.':
      'sugiere circuitos orgánicos. Este ser fue FABRICADO.',
    'It is not a natural life form.':
      'No es una forma de vida natural.',
    'It is a construct. A biological machine.':
      'Es un constructo. Una máquina biológica.',
    'PERSONAL NOTE (not for official record):':
      'NOTA PERSONAL (no para registro oficial):',
    'I have practiced medicine for 30 years. I have never':
      'He practicado medicina durante 30 años. Nunca',
    'questioned what I believed about life and its origins.':
      'cuestioné lo que creía sobre la vida y sus orígenes.',
    'Today I questioned everything.':
      'Hoy lo cuestioné todo.',
    'These are not visitors. These are messengers.':
      'Estos no son visitantes. Son mensajeros.',
    'And we are not prepared for what they herald.':
      'Y no estamos preparados para lo que anuncian.',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — transfer_manifest_deleted.txt
    // ═══════════════════════════════════════════════════════════
    'ASSET TRANSFER MANIFEST — DELETED COPY':
      'MANIFIESTO DE TRANSFERENCIA DE ACTIVOS — COPIA ELIMINADA',
    'DATE: JANUARY 25, 1996':
      'FECHA: 25 DE ENERO DE 1996',
    'CLASSIFICATION: DESTROYED — RECONSTRUCTED FROM SECTOR DUMP':
      'CLASIFICACIÓN: DESTRUIDO — RECONSTRUIDO DE VOLCADO DE SECTOR',
    'OPERATION: COLHEITA (HARVEST)':
      'OPERACIÓN: COLHEITA (COSECHA)',
    'ORIGIN: Recovery Zone Bravo, Varginha MG':
      'ORIGEN: Zona de Recuperación Bravo, Varginha MG',
    'DESTINATION: ESA Campinas — Hangar 4 (Restricted Wing)':
      'DESTINO: ESA Campinas — Hangar 4 (Ala Restringida)',
    'CARGO INVENTORY':
      'INVENTARIO DE CARGA',
    '  ITEM 001: Hull fragment, alloy unknown — 47kg':
      '  ÍTEM 001: Fragmento de casco, aleación desconocida — 47kg',
    '            STATUS: Sealed container, nitrogen atmosphere':
      '            ESTADO: Contenedor sellado, atmósfera de nitrógeno',
    '            NOTE: Material resists all cutting tools':
      '            NOTA: El material resiste todas las herramientas de corte',
    '  ITEM 002: Navigation array (presumed) — 12kg':
      '  ÍTEM 002: Arreglo de navegación (presunto) — 12kg',
    '            STATUS: Still emitting low-frequency signal':
      '            ESTADO: Aún emitiendo señal de baja frecuencia',
    '            WARNING: Do not expose to direct sunlight':
      '            ADVERTENCIA: No exponer a la luz solar directa',
    '  ITEM 003: Propulsion debris, 3 fragments — 89kg total':
      '  ÍTEM 003: Escombros de propulsión, 3 fragmentos — 89kg total',
    '            STATUS: Radiation levels within tolerance':
      '            ESTADO: Niveles de radiación dentro de tolerancia',
    '            NOTE: Fragments reassemble if placed in proximity':
      '            NOTA: Los fragmentos se reensamblan si se colocan en proximidad',
    '  ITEM 004: Interior paneling samples — 8kg':
      '  ÍTEM 004: Muestras de paneles interiores — 8kg',
    '            STATUS: Organic-metallic hybrid composition':
      '            ESTADO: Composición híbrida orgánico-metálica',
    '  ITEM 005: Soil samples from impact zone — 15kg':
      '  ÍTEM 005: Muestras de suelo de la zona de impacto — 15kg',
    '            STATUS: Elevated isotope ratios confirmed':
      '            ESTADO: Ratios isotópicos elevados confirmados',
    'TRANSPORT PROTOCOL':
      'PROTOCOLO DE TRANSPORTE',
    '  Route: Varginha → Três Corações → Campinas (ESA)':
      '  Ruta: Varginha → Três Corações → Campinas (ESA)',
    '  Convoy: 3 military trucks, unmarked':
      '  Convoy: 3 camiones militares, sin marcas',
    '  Escort: 2nd Armored Battalion, no insignia':
      '  Escolta: 2.º Batallón Blindado, sin insignia',
    '  Transit time: 6 hours (overnight, no stops)':
      '  Tiempo de tránsito: 6 horas (nocturno, sin paradas)',
    '  RECEIVING OFFICER: Col. [EXPUNGED]':
      '  OFICIAL RECEPTOR: Cnel. [EXPURGADO]',
    '  STORAGE: Sublevel 2, Hangar 4, Climate-controlled vault':
      '  ALMACENAMIENTO: Subnivel 2, Hangar 4, Bóveda climatizada',
    'DISPOSITION NOTE':
      'NOTA DE DISPOSICIÓN',
    '  This manifest was ordered destroyed on 01/28/1996.':
      '  Este manifiesto fue ordenado destruir el 28/01/1996.',
    '  No official record of this transfer exists.':
      '  No existe ningún registro oficial de esta transferencia.',
    '  All convoy personnel signed non-disclosure agreements.':
      '  Todo el personal del convoy firmó acuerdos de confidencialidad.',
    '  Material remains at ESA Campinas as of last audit.':
      '  El material permanece en ESA Campinas según la última auditoría.',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — bio_containment_log_deleted.txt
    // ═══════════════════════════════════════════════════════════
    'BIOLOGICAL CONTAINMENT LOG — PURGED RECORD':
      'REGISTRO DE CONTENCIÓN BIOLÓGICA — REGISTRO PURGADO',
    'SITE: TEMPORARY HOLDING FACILITY, HUMANITAS HOSPITAL':
      'SITIO: INSTALACIÓN DE DETENCIÓN TEMPORAL, HOSPITAL HUMANITAS',
    'DATE: JANUARY 20-26, 1996':
      'FECHA: 20-26 DE ENERO DE 1996',
    'CLASSIFICATION: OMEGA — MARKED FOR DESTRUCTION':
      'CLASIFICACIÓN: OMEGA — MARCADO PARA DESTRUCCIÓN',
    'SUBJECT REGISTRY':
      'REGISTRO DE SUJETOS',
    '  BIO-A: Captured 20/01 at 15:42. Jardim Andere sector.':
      '  BIO-A: Capturado 20/01 a las 15:42. Sector Jardim Andere.',
    '         Condition: Responsive. Vitals stable.':
      '         Condición: Responsivo. Signos vitales estables.',
    '         Transferred to Site 7 on 22/01.':
      '         Transferido al Sitio 7 el 22/01.',
    '  BIO-B: Captured 20/01 at 16:15. Adjacent to BIO-A.':
      '  BIO-B: Capturado 20/01 a las 16:15. Adyacente a BIO-A.',
    '         Condition: Agitated. Attempted non-acoustic signal.':
      '         Condición: Agitado. Intentó señal no acústica.',
    '         Handlers reported headaches within 3m radius.':
      '         Los operadores reportaron dolores de cabeza en un radio de 3m.',
    '  BIO-C: Captured 22/01 at 02:30. Separate location.':
      '  BIO-C: Capturado 22/01 a las 02:30. Ubicación separada.',
    '         Condition: Weakened. Declining vitals.':
      '         Condición: Debilitado. Signos vitales en declive.',
    '         Expired 24/01 at 04:17. Cause: Unknown.':
      '         Expiró 24/01 a las 04:17. Causa: Desconocida.',
    '         Remains transferred to pathology.':
      '         Restos transferidos a patología.',
    'CONTAINMENT PROTOCOLS':
      'PROTOCOLOS DE CONTENCIÓN',
    '  - Electromagnetic shielding: ACTIVE (Faraday cage)':
      '  - Blindaje electromagnético: ACTIVO (jaula de Faraday)',
    '  - Visual monitoring: 24-hour, 3 camera angles':
      '  - Monitoreo visual: 24 horas, 3 ángulos de cámara',
    '  - Direct contact: PROHIBITED without Level 4 clearance':
      '  - Contacto directo: PROHIBIDO sin habilitación Nivel 4',
    '  - Feeding: Subjects refuse all organic matter offered':
      '  - Alimentación: Los sujetos rechazan toda materia orgánica ofrecida',
    '  - Communication: DO NOT ENGAGE. See PSI-COMM advisory.':
      '  - Comunicación: NO INTERACTUAR. Consulte aviso PSI-COMM.',
    '  NOTE: All personnel exposed to BIO-B for >10 minutes':
      '  NOTA: Todo el personal expuesto a BIO-B por >10 minutos',
    '  must report to medical for neural baseline scan.':
      '  debe presentarse al servicio médico para escaneo neural de referencia.',
    'DELETION ORDER':
      'ORDEN DE ELIMINACIÓN',
    '  This log was ordered purged on 01/30/1996.':
      '  Este registro fue ordenado purgar el 30/01/1996.',
    '  Official records state: "No biological material recovered."':
      '  Los registros oficiales declaran: "Ningún material biológico recuperado."',
    '  Hospital records re-coded as: "chemical spill response."':
      '  Registros del hospital recodificados como: "respuesta a derrame químico."',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — psi_analysis_classified.txt
    // ═══════════════════════════════════════════════════════════
    'PSI-COMM ANALYSIS — CLASSIFIED REPORT':
      'ANÁLISIS PSI-COMM — INFORME CLASIFICADO',
    'ANALYST: Dr. [NAME EXPUNGED]':
      'ANALISTA: Dr. [NOMBRE EXPURGADO]',
    'DATE: JANUARY 27, 1996':
      'FECHA: 27 DE ENERO DE 1996',
    'STATUS: DELETED FROM ALL DATABASES':
      'ESTADO: ELIMINADO DE TODAS LAS BASES DE DATOS',
    'SUBJECT: Non-acoustic communication patterns detected':
      'ASUNTO: Patrones de comunicación no acústica detectados',
    'from specimens designated BIO-A and BIO-B.':
      'en los especímenes designados BIO-A y BIO-B.',
    'METHODOLOGY':
      'METODOLOGÍA',
    '  EEG arrays placed at 1m, 3m, and 10m distances.':
      '  Arreglos de EEG colocados a distancias de 1m, 3m y 10m.',
    '  Control subjects (human volunteers) monitored simultaneously.':
      '  Sujetos de control (voluntarios humanos) monitoreados simultáneamente.',
    '  Results: At distances ≤3m, human subjects exhibited':
      '  Resultados: A distancias ≤3m, los sujetos humanos exhibieron',
    '  synchronized theta-wave patterns matching BIO-B emissions.':
      '  patrones de ondas theta sincronizados con las emisiones de BIO-B.',
    '  At 10m range, synchronization dropped to background levels.':
      '  A 10m de distancia, la sincronización cayó a niveles de fondo.',
    'KEY FINDINGS':
      'HALLAZGOS CLAVE',
    '  1. TELEPATHIC CAPABILITY CONFIRMED':
      '  1. CAPACIDAD TELEPÁTICA CONFIRMADA',
    '     BIO-B demonstrates directed neural transmission.':
      '     BIO-B demuestra transmisión neural dirigida.',
    '     Content appears conceptual, not linguistic.':
      '     El contenido parece conceptual, no lingüístico.',
    '     Receivers report "knowing" rather than "hearing."':
      '     Los receptores reportan "saber" en lugar de "escuchar."',
    '  2. SCOUT FUNCTION CONFIRMED':
      '  2. FUNCIÓN DE RECONOCIMIENTO CONFIRMADA',
    '     Transmitted imagery includes topographical surveys,':
      '     Las imágenes transmitidas incluyen relevamientos topográficos,',
    '     population density maps, and infrastructure schemas.':
      '     mapas de densidad poblacional y esquemas de infraestructura.',
    '     These beings were CATALOGUING our environment.':
      '     Estos seres estaban CATALOGANDO nuestro entorno.',
    '  3. TEMPORAL REFERENCE':
      '  3. REFERENCIA TEMPORAL',
    '     Recurring pattern in psi-comm output translates to':
      '     El patrón recurrente en la salida psi-comm se traduce en',
    '     cyclical temporal reference: "thirty rotations."':
      '     referencia temporal cíclica: "treinta rotaciones."',
    '     Given context (1996 baseline), points to year 2026.':
      '     Dado el contexto (referencia de 1996), apunta al año 2026.',
    '  4. NON-HOSTILE DISPOSITION':
      '  4. DISPOSICIÓN NO HOSTIL',
    '     No aggressive psi-comm detected. Subjects appear':
      '     No se detectó psi-comm agresiva. Los sujetos parecen',
    '     to regard capture as expected, even planned.':
      '     considerar la captura como esperada, incluso planeada.',
    '     Assessment: Reconnaissance bio-constructs, not soldiers.':
      '     Evaluación: Bioconstructos de reconocimiento, no soldados.',
    'CLASSIFICATION NOTE':
      'NOTA DE CLASIFICACIÓN',
    '  This report was suppressed on 02/01/1996.':
      '  Este informe fue suprimido el 01/02/1996.',
    '  Official position: "No anomalous communication detected."':
      '  Posición oficial: "Ninguna comunicación anómala detectada."',
    '  All EEG data archived to off-site cold storage.':
      '  Todos los datos de EEG archivados en almacenamiento frío externo.',
    '  Personal addendum: What I have witnessed changes everything.':
      '  Adenda personal: Lo que he presenciado lo cambia todo.',
    '  These are not animals. They are not machines. They are scouts.':
      '  No son animales. No son máquinas. Son exploradores.',
    '  And they accomplished their mission before we caught them.':
      '  Y cumplieron su misión antes de que los capturáramos.',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — foreign_liaison_cable_deleted.txt
    // ═══════════════════════════════════════════════════════════
    'DIPLOMATIC CABLE — DELETED':
      'CABLE DIPLOMÁTICO — ELIMINADO',
    'ORIGIN: U.S. EMBASSY, BRASÍLIA':
      'ORIGEN: EMBAJADA DE EE.UU., BRASILIA',
    'DESTINATION: LANGLEY, VIRGINIA':
      'DESTINO: LANGLEY, VIRGINIA',
    'DATE: JANUARY 23, 1996':
      'FECHA: 23 DE ENERO DE 1996',
    'CLASSIFICATION: DESTROYED — RECOVERED FROM BACKUP TAPE':
      'CLASIFICACIÓN: DESTRUIDO — RECUPERADO DE CINTA DE RESPALDO',
    'PRIORITY: FLASH':
      'PRIORIDAD: FLASH',
    'SUBJECT: VARGINHA RECOVERY — FOREIGN ASSET DISPOSITION':
      'ASUNTO: RECUPERACIÓN DE VARGINHA — DISPOSICIÓN DE ACTIVOS EXTRANJEROS',
    'MESSAGE BODY':
      'CUERPO DEL MENSAJE',
    '  Confirm three (3) biological specimens secured by':
      '  Se confirman tres (3) especímenes biológicos asegurados por',
    '  Brazilian military. One (1) deceased, two (2) viable.':
      '  militares brasileños. Uno (1) fallecido, dos (2) viables.',
    '  Per Protocol ECHO standing orders, request immediate':
      '  Según órdenes permanentes del Protocolo ECHO, se solicita',
    '  deployment of technical assessment team from Langley.':
      '  despliegue inmediato de equipo de evaluación técnica desde Langley.',
    '  Brazilian liaison (Col. [REDACTED]) cooperative.':
      '  Enlace brasileño (Cnel. [CENSURADO]) cooperativo.',
    '  Requests shared analysis in exchange for specimen access.':
      '  Solicita análisis compartido a cambio de acceso a los especímenes.',
    '  Tel Aviv also requesting observer status. Recommend':
      '  Tel Aviv también solicita estatus de observador. Se recomienda',
    '  DENY per compartmentalization protocols.':
      '  DENEGAR según protocolos de compartimentación.',
    '  NOTE: Brazilian Air Force already scrambled interceptors':
      '  NOTA: La Fuerza Aérea Brasileña ya despachó interceptores',
    '  on 01/13 per NORAD advisory. They are fully aware.':
      '  el 13/01 según aviso del NORAD. Están plenamente al tanto.',
    '  Deniability window is closing.':
      '  La ventana de negación plausible se está cerrando.',
    'RESPONSE (LANGLEY)':
      'RESPUESTA (LANGLEY)',
    '  APPROVED: Technical team en route. ETA 48 hours.':
      '  APROBADO: Equipo técnico en camino. Tiempo estimado 48 horas.',
    '  Brazilian custody of viable specimens is TEMPORARY.':
      '  La custodia brasileña de los especímenes viables es TEMPORAL.',
    '  Full transfer to US custody per bilateral agreement':
      '  Transferencia total a custodia estadounidense según acuerdo bilateral',
    '  (classified annex, 1988 defense cooperation treaty).':
      '  (anexo clasificado, tratado de cooperación de defensa de 1988).',
    '  Coordinate with NSA for signals intelligence sweep.':
      '  Coordinar con la NSA para barrido de inteligencia de señales.',
    '  All civilian communications in 50km radius to be':
      '  Todas las comunicaciones civiles en un radio de 50km deben ser',
    '  monitored for 90 days.':
      '  monitoreadas durante 90 días.',
    '  Regarding Tel Aviv: DENY. This remains bilateral.':
      '  Respecto a Tel Aviv: DENEGAR. Esto permanece bilateral.',
    '  Cable destroyed per standard diplomatic protocol.':
      '  Cable destruido según protocolo diplomático estándar.',
    '  No record exists in FOIA-accessible databases.':
      '  No existe registro en bases de datos accesibles vía FOIA.',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — convergence_model_draft.txt
    // ═══════════════════════════════════════════════════════════
    'CONVERGENCE MODEL — DRAFT (PURGED)':
      'MODELO DE CONVERGENCIA — BORRADOR (PURGADO)',
    'PROJECT SEED — TEMPORAL ANALYSIS DIVISION':
      'PROYECTO SEED — DIVISIÓN DE ANÁLISIS TEMPORAL',
    'DATE: FEBRUARY 3, 1996':
      'FECHA: 3 DE FEBRERO DE 1996',
    'TO: Director, Special Programs Division':
      'PARA: Director, División de Programas Especiales',
    'FROM: Temporal Analysis Unit':
      'DE: Unidad de Análisis Temporal',
    'RE: 2026 Convergence Window — Revised Assessment':
      'RE: Ventana de Convergencia 2026 — Evaluación Revisada',
    'SUMMARY':
      'RESUMEN',
    '  Analysis of psi-comm fragments from BIO-A/B, combined':
      '  Análisis de fragmentos psi-comm de BIO-A/B, combinado',
    '  with signal data from the recovered navigation array,':
      '  con datos de señales del arreglo de navegación recuperado,',
    '  yields the following convergence model:':
      '  produce el siguiente modelo de convergencia:',
    '  ACTIVATION WINDOW: September 2026 (±2 months)':
      '  VENTANA DE ACTIVACIÓN: Septiembre de 2026 (±2 meses)',
    '  The "thirty rotations" reference in telepathic output':
      '  La referencia "treinta rotaciones" en la salida telepática',
    '  maps to 30 solar years from the 1996 baseline event.':
      '  corresponde a 30 años solares desde el evento de referencia de 1996.',
    'MODEL PARAMETERS':
      'PARÁMETROS DEL MODELO',
    '  Phase 1: RECONNAISSANCE (Active — 1996)':
      '  Fase 1: RECONOCIMIENTO (Activo — 1996)',
    '    Scout bio-constructs deployed to survey target.':
      '    Bioconstructos exploradores desplegados para reconocer el objetivo.',
    '    Data transmitted via psi-band to external receiver.':
      '    Datos transmitidos vía banda-psi a receptor externo.',
    '  Phase 2: SEEDING (Passive — 1996-2026)':
      '  Fase 2: SIEMBRA (Pasiva — 1996-2026)',
    '    Biological material left in custody triggers gradual':
      '    El material biológico dejado en custodia desencadena',
    '    neurological sensitization in exposed personnel.':
      '    sensibilización neurológica gradual en el personal expuesto.',
    '    "Carriers" unknowingly propagate signal receptivity.':
      '    Los "portadores" propagan inconscientemente la receptividad a la señal.',
    '  Phase 3: TRANSITION (Projected — 2026)':
      '  Fase 3: TRANSICIÓN (Proyectada — 2026)',
    '    Full-spectrum activation of seeded neural pathways.':
      '    Activación de espectro completo de las vías neurales sembradas.',
    '    Nature of transition remains UNKNOWN.':
      '    La naturaleza de la transición permanece DESCONOCIDA.',
    '    Best case: Communication channel opens.':
      '    Mejor caso: Se abre un canal de comunicación.',
    '    Worst case: [DATA EXPUNGED]':
      '    Peor caso: [DATOS EXPURGADOS]',
    'DISPOSITION':
      'DISPOSICIÓN',
    '  This model was rejected by oversight committee.':
      '  Este modelo fue rechazado por el comité de supervisión.',
    '  Official position: "2026 references are meaningless.':
      '  Posición oficial: "Las referencias a 2026 carecen de sentido.',
    '  Specimen neural output is random noise."':
      '  La salida neural de los especímenes es ruido aleatorio."',
    '  This document will not survive the next purge cycle.':
      '  Este documento no sobrevivirá al próximo ciclo de purga.',
    '  Personal note: They can deny it all they want.':
      '  Nota personal: Pueden negarlo todo lo que quieran.',
    '  The math doesn\'t lie. Something is coming.':
      '  Las matemáticas no mienten. Algo se aproxima.',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILES — UFO74 REACTIONS
    // ═══════════════════════════════════════════════════════════
    'UFO74: shit, this is heavy kid... but not our mission.':
      'UFO74: mierda, esto es pesado chico... pero no es nuestra misión.',
    '       lets move on.':
      '       sigamos adelante.',
    'UFO74: damn. theyre into everything.':
      'UFO74: carajo. están metidos en todo.',
    '       but focus — we have bigger fish.':
      '       pero enfócate — tenemos peces más grandes.',
    'UFO74: ha. humans and their schemes.':
      'UFO74: ja. humanos y sus esquemas.',
    '       stay on target.':
      '       mantén el objetivo.',
    'UFO74: interesting... but not why were here.':
      'UFO74: interesante... pero no es por lo que estamos aquí.',
    '       dont get distracted.':
      '       no te distraigas.',
    'UFO74: yeah, ive seen this before.':
      'UFO74: sí, ya vi esto antes.',
    '       not our problem today.':
      '       no es nuestro problema hoy.',
    'UFO74: heavy stuff. file it under "later."':
      'UFO74: tema pesado. archívalo en "después."',
    '       we have work to do.':
      '       tenemos trabajo que hacer.',
    'UFO74: huh. they really do this stuff.':
      'UFO74: vaya. realmente hacen estas cosas.',
    '       but we got our own problems kid.':
      '       pero tenemos nuestros propios problemas chico.',
    'UFO74: humans... always scheming.':
      'UFO74: humanos... siempre tramando.',
    '       eyes on the prize.':
      '       ojos en el premio.',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 1 — ECONOMIC TRANSITION MEMO
    // ═══════════════════════════════════════════════════════════
    'INTERNAL MEMORANDUM — ECONOMIC RESEARCH DIVISION':
      'MEMORANDO INTERNO — DIVISIÓN DE INVESTIGACIÓN ECONÓMICA',
    'DATE: 08-NOV-1995':
      'FECHA: 08-NOV-1995',
    'CLASSIFICATION: INTERNAL USE ONLY':
      'CLASIFICACIÓN: SOLO USO INTERNO',
    'TO: Deputy Director, Strategic Planning':
      'PARA: Director Adjunto, Planificación Estratégica',
    'FROM: Economic Futures Working Group':
      'DE: Grupo de Trabajo de Futuros Económicos',
    'RE: Decentralized Currency Prototype — Phase II Assessment':
      'REF: Prototipo de Moneda Descentralizada — Evaluación Fase II',
    'Per your request, we have completed preliminary testing of':
      'Según lo solicitado, hemos completado las pruebas preliminares del',
    'the distributed ledger monetary system ("Project COIN").':
      'sistema monetario de registro distribuido ("Proyecto COIN").',
    'KEY FINDINGS:':
      'HALLAZGOS CLAVE:',
    '  1. The cryptographic consensus mechanism functions as':
      '  1. El mecanismo de consenso criptográfico funciona según lo',
    '     designed. Nodes achieve agreement without central':
      '     diseñado. Los nodos alcanzan consenso sin autoridad',
    '     authority within acceptable latency parameters.':
      '     central dentro de parámetros de latencia aceptables.',
    '  2. Transaction anonymity meets intelligence community':
      '  2. El anonimato de las transacciones cumple los requisitos de',
    '     requirements for untraceable fund transfers.':
      '     la comunidad de inteligencia para transferencias no rastreables.',
    '  3. Energy consumption remains a concern. Current mining':
      '  3. El consumo de energía sigue siendo una preocupación. Los algoritmos',
    '     algorithms require significant computational resources.':
      '     de minería actuales requieren recursos computacionales significativos.',
    'RECOMMENDATION:':
      'RECOMENDACIÓN:',
    '  Continue research but delay public deployment. The':
      '  Continuar la investigación pero retrasar el despliegue público. La',
    '  technology is premature for civilian adoption but shows':
      '  tecnología es prematura para adopción civil pero muestra',
    '  promise for covert operations funding channels.':
      '  potencial para canales de financiamiento de operaciones encubiertas.',
    '  Suggest revisiting for public release in 10-15 years':
      '  Se sugiere reevaluar para lanzamiento público en 10-15 años',
    '  when infrastructure can support wider adoption.':
      '  cuando la infraestructura pueda soportar una adopción más amplia.',
    '  [signature]':
      '  [firma]',
    '  S.N.':
      '  S.N.',
    '  Lead Cryptographer, Economic Futures':
      '  Criptógrafo Líder, Futuros Económicos',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 2 — APOLLO MEDIA GUIDELINES
    // ═══════════════════════════════════════════════════════════
    'PUBLIC AFFAIRS GUIDANCE — LUNAR PROGRAM DOCUMENTATION':
      'GUÍA DE ASUNTOS PÚBLICOS — DOCUMENTACIÓN DEL PROGRAMA LUNAR',
    'DOCUMENT: PA-1969-07 (DECLASSIFIED EXCERPT)':
      'DOCUMENTO: PA-1969-07 (EXTRACTO DESCLASIFICADO)',
    'ORIGINAL DATE: 14-JUL-1969':
      'FECHA ORIGINAL: 14-JUL-1969',
    'SUBJECT: Handling Visual Inconsistencies in Mission Footage':
      'ASUNTO: Manejo de Inconsistencias Visuales en Filmaciones de la Misión',
    'BACKGROUND:':
      'ANTECEDENTES:',
    '  During post-production review of lunar surface footage,':
      '  Durante la revisión de postproducción del metraje de la superficie lunar,',
    '  technical staff identified several lighting anomalies':
      '  el personal técnico identificó varias anomalías de iluminación',
    '  that may generate public confusion.':
      '  que pueden generar confusión pública.',
    'IDENTIFIED ISSUES:':
      'PROBLEMAS IDENTIFICADOS:',
    '  - Shadow direction variance in Frames 1247-1289':
      '  - Variación en la dirección de sombras en los Cuadros 1247-1289',
    '  - Multiple apparent light sources in EVA footage':
      '  - Múltiples fuentes de luz aparentes en filmaciones EVA',
    '  - Crosshair positioning behind foreground objects':
      '  - Posicionamiento de la retícula detrás de objetos en primer plano',
    '  - Flag movement without atmospheric conditions':
      '  - Movimiento de la bandera sin condiciones atmosféricas',
    'GUIDANCE:':
      'ORIENTACIÓN:',
    '  1. Do NOT proactively address these inconsistencies.':
      '  1. NO abordar proactivamente estas inconsistencias.',
    '  2. If questioned, attribute anomalies to:':
      '  2. Si se cuestiona, atribuir las anomalías a:',
    '     a) Camera lens artifacts':
      '     a) Artefactos del lente de la cámara',
    '     b) Reflected light from lunar surface':
      '     b) Luz reflejada de la superficie lunar',
    '     c) Electromagnetic interference with equipment':
      '     c) Interferencia electromagnética con el equipo',
    '  3. Under NO circumstances acknowledge that backup':
      '  3. Bajo NINGUNA circunstancia reconocer que metraje',
    '     footage was prepared at [REDACTED] facility.':
      '     de respaldo fue preparado en la instalación [REDACTADO].',
    '  4. Emphasize mission success narrative over technical':
      '  4. Enfatizar la narrativa de éxito de la misión sobre detalles',
    '     details of visual documentation.':
      '     técnicos de la documentación visual.',
    'NOTE: This guidance supersedes previous directives.':
      'NOTA: Esta orientación reemplaza directivas anteriores.',
    'APPROVED BY: DIR. COMMUNICATIONS':
      'APROBADO POR: DIR. COMUNICACIONES',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 3 — WEATHER PATTERN INTERVENTION
    // ═══════════════════════════════════════════════════════════
    'PROJECT CIRRUS — OPERATIONAL LOG':
      'PROYECTO CIRRUS — REGISTRO OPERACIONAL',
    'CLASSIFICATION: SENSITIVE':
      'CLASIFICACIÓN: SENSIBLE',
    'PERIOD: OCT 1995 - JAN 1996':
      'PERÍODO: OCT 1995 - ENE 1996',
    '12-OCT-1995 0600':
      '12-OCT-1995 0600',
    '  Aerosol dispersal flight ALT-1174 completed.':
      '  Vuelo de dispersión de aerosol ALT-1174 completado.',
    '  Payload: 4.2 metric tons barium sulfate compound':
      '  Carga: 4,2 toneladas métricas de compuesto de sulfato de bario',
    '  Target: Atlantic hurricane formation zone':
      '  Objetivo: Zona de formación de huracanes del Atlántico',
    '  Altitude: 38,000 ft':
      '  Altitud: 38.000 pies',
    '  Duration: 6.4 hours':
      '  Duración: 6,4 horas',
    '15-OCT-1995 1400':
      '15-OCT-1995 1400',
    '  Post-dispersal analysis indicates successful seeding.':
      '  El análisis post-dispersión indica siembra exitosa.',
    '  Projected storm TD-17 failed to organize.':
      '  La tormenta proyectada TD-17 no logró organizarse.',
    '  NOTE: Unintended precipitation in [REDACTED] region.':
      '  NOTA: Precipitación no intencionada en la región [REDACTADO].',
    '23-NOV-1995 0800':
      '23-NOV-1995 0800',
    '  Flight ALT-1198 encountered mechanical issues.':
      '  El vuelo ALT-1198 encontró problemas mecánicos.',
    '  Payload released early over continental area.':
      '  Carga liberada prematuramente sobre área continental.',
    '  INCIDENT REPORT FILED. Cover story: contrail testing.':
      '  INFORME DE INCIDENTE REGISTRADO. Historia de cobertura: pruebas de estelas.',
    '07-DEC-1995 1100':
      '07-DIC-1995 1100',
    '  Side effect observation: Increased respiratory':
      '  Observación de efecto secundario: Aumento de quejas',
    '  complaints in dispersal corridor populations.':
      '  respiratorias en las poblaciones del corredor de dispersión.',
    '  Recommend adjusting compound mixture for Q1 1996.':
      '  Se recomienda ajustar la mezcla del compuesto para Q1 1996.',
    '14-JAN-1996 0900':
      '14-ENE-1996 0900',
    '  New directive received: Expand program to include':
      '  Nueva directiva recibida: Expandir el programa para incluir',
    '  reflective particulate testing for solar management.':
      '  pruebas de partículas reflectivas para gestión solar.',
    '  Aluminum oxide compounds approved for trial.':
      '  Compuestos de óxido de aluminio aprobados para prueba.',
    'END LOG — NEXT REVIEW: 01-APR-1996':
      'FIN DEL REGISTRO — PRÓXIMA REVISIÓN: 01-ABR-1996',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 4 — BEHAVIORAL COMPLIANCE STUDY
    // ═══════════════════════════════════════════════════════════
    'CONSUMER BEHAVIOR RESEARCH — ACOUSTIC INFLUENCE STUDY':
      'INVESTIGACIÓN DE COMPORTAMIENTO DEL CONSUMIDOR — ESTUDIO DE INFLUENCIA ACÚSTICA',
    'PROJECT: TEMPO':
      'PROYECTO: TEMPO',
    'DATE: Q4 1995 FINAL REPORT':
      'FECHA: INFORME FINAL Q4 1995',
    'STUDY OVERVIEW:':
      'RESUMEN DEL ESTUDIO:',
    '  In partnership with [REDACTED] retail chains, this study':
      '  En asociación con cadenas minoristas [REDACTADO], este estudio',
    '  evaluated the effect of ambient audio parameters on':
      '  evaluó el efecto de parámetros de audio ambiental en los',
    '  consumer behavior patterns.':
      '  patrones de comportamiento del consumidor.',
    'METHODOLOGY:':
      'METODOLOGÍA:',
    '  - 847 retail locations participated':
      '  - 847 ubicaciones minoristas participaron',
    '  - Music tempo varied from 60-120 BPM across test groups':
      '  - Tempo musical variado de 60-120 BPM entre grupos de prueba',
    '  - Subliminal audio tones embedded at 17.5 Hz':
      '  - Tonos de audio subliminal incrustados a 17,5 Hz',
    '  - Control group received standard muzak programming':
      '  - Grupo control recibió programación muzak estándar',
    'FINDINGS:':
      'HALLAZGOS:',
    '  1. TEMPO CORRELATION':
      '  1. CORRELACIÓN DE TEMPO',
    '     - 72 BPM: 18% increase in browsing duration':
      '     - 72 BPM: aumento del 18% en duración de navegación',
    '     - 108 BPM: 23% increase in purchase velocity':
      '     - 108 BPM: aumento del 23% en velocidad de compra',
    '     - 60 BPM: Measurable increase in high-margin purchases':
      '     - 60 BPM: Aumento medible en compras de alto margen',
    '  2. SUBLIMINAL TONE EFFECTS':
      '  2. EFECTOS DE TONO SUBLIMINAL',
    '     - 17.5 Hz baseline: Elevated stress markers':
      '     - 17,5 Hz línea base: Marcadores de estrés elevados',
    '     - 12 Hz modification: Reduced price sensitivity':
      '     - Modificación 12 Hz: Sensibilidad al precio reducida',
    '     - Combined with verbal suggestions: Inconclusive':
      '     - Combinado con sugestiones verbales: Inconcluso',
    '  3. OPTIMAL CONFIGURATION':
      '  3. CONFIGURACIÓN ÓPTIMA',
    '     - Morning: 108 BPM (urgency)':
      '     - Mañana: 108 BPM (urgencia)',
    '     - Afternoon: 72 BPM (extended browsing)':
      '     - Tarde: 72 BPM (navegación extendida)',
    '     - Pre-closing: 120 BPM (clear out)':
      '     - Pre-cierre: 120 BPM (desalojo)',
    '  Implement Phase II testing in food service environments.':
      '  Implementar pruebas de Fase II en entornos de servicio alimentario.',
    '  Preliminary data suggests eating pace modification':
      '  Los datos preliminares sugieren que la modificación del ritmo alimentario',
    '  achievable through targeted frequency patterns.':
      '  es alcanzable mediante patrones de frecuencia dirigidos.',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 5 — INFRASTRUCTURE BLACKOUT SIMULATION
    // ═══════════════════════════════════════════════════════════
    'EXERCISE DARK WINTER — SIMULATION RESULTS':
      'EJERCICIO INVIERNO OSCURO — RESULTADOS DE LA SIMULACIÓN',
    'CLASSIFICATION: RESTRICTED':
      'CLASIFICACIÓN: RESTRINGIDA',
    'DATE: SEP 1995':
      'FECHA: SEP 1995',
    'EXERCISE OBJECTIVE:':
      'OBJETIVO DEL EJERCICIO:',
    '  Evaluate civil response to extended grid failure with':
      '  Evaluar la respuesta civil ante falla prolongada de la red con',
    '  concurrent communications infrastructure collapse.':
      '  colapso simultáneo de la infraestructura de comunicaciones.',
    'SIMULATION PARAMETERS:':
      'PARÁMETROS DE LA SIMULACIÓN:',
    '  - Duration: 72 hours (extended to 168 hours)':
      '  - Duración: 72 horas (extendido a 168 horas)',
    '  - Population centers: 3 metropolitan areas':
      '  - Centros de población: 3 áreas metropolitanas',
    '  - Communications: Landline and cellular disabled':
      '  - Comunicaciones: Telefonía fija y celular desactivadas',
    '  - Emergency services: Degraded capacity (40%)':
      '  - Servicios de emergencia: Capacidad degradada (40%)',
    'PHASE RESULTS:':
      'RESULTADOS POR FASE:',
    '  0-12 HOURS:':
      '  0-12 HORAS:',
    '    - Civil order maintained':
      '    - Orden civil mantenido',
    '    - Emergency calls exceeded capacity by hour 4':
      '    - Las llamadas de emergencia excedieron capacidad en la hora 4',
    '    - Fuel station queues exceeded 2 miles':
      '    - Las filas en gasolineras excedieron 3 km',
    '  12-48 HOURS:':
      '  12-48 HORAS:',
    '    - Significant increase in property crime':
      '    - Aumento significativo en delitos contra la propiedad',
    '    - Hospital generators failed in 2 facilities':
      '    - Generadores hospitalarios fallaron en 2 instalaciones',
    '    - Water pressure loss in elevated areas':
      '    - Pérdida de presión de agua en áreas elevadas',
    '  48-168 HOURS:':
      '  48-168 HORAS:',
    '    - Civil order breakdown in [REDACTED] sector':
      '    - Colapso del orden civil en el sector [REDACTADO]',
    '    - National Guard deployment simulated at hour 96':
      '    - Despliegue de la Guardia Nacional simulado en la hora 96',
    '    - Food supply chain: Total collapse by hour 120':
      '    - Cadena de suministro alimentario: Colapso total en la hora 120',
    'KEY FINDING:':
      'HALLAZGO CLAVE:',
    '  Without communication infrastructure, civil order':
      '  Sin infraestructura de comunicación, el orden civil',
    '  degrades to critical level within 72 hours.':
      '  se degrada a nivel crítico en 72 horas.',
    '  Information control is essential for stability.':
      '  El control de la información es esencial para la estabilidad.',
    '  Develop backup communication protocols for authorities.':
      '  Desarrollar protocolos de comunicación de respaldo para autoridades.',
    '  Civilian population should NOT be informed of grid':
      '  La población civil NO debe ser informada sobre la',
    '  vulnerability to prevent preemptive panic.':
      '  vulnerabilidad de la red para prevenir pánico preventivo.',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 6 — AVIAN TRACKING PROGRAM
    // ═══════════════════════════════════════════════════════════
    'CONTINENTAL AVIAN SURVEILLANCE NETWORK':
      'RED CONTINENTAL DE VIGILANCIA AVIAR',
    'QUARTERLY DEPLOYMENT REPORT — Q4 1995':
      'INFORME TRIMESTRAL DE DESPLIEGUE — Q4 1995',
    'UNIT_ID,SPECIES_COVER,REGION,BATTERY_LIFE,PAYLOAD':
      'ID_UNIDAD,ESPECIE_COBERTURA,REGIÓN,VIDA_BATERÍA,CARGA',
    'DEPLOYMENT NOTES:':
      'NOTAS DE DESPLIEGUE:',
    '  - Q4 migration routes successfully tracked':
      '  - Rutas migratorias Q4 rastreadas exitosamente',
    '  - Signal relay coverage: 94.2% continental':
      '  - Cobertura de retransmisión de señal: 94,2% continental',
    '  - Urban density exceeds rural by factor of 8.4':
      '  - La densidad urbana excede la rural por factor de 8,4',
    '  - Maintenance disguised as "wildlife research"':
      '  - Mantenimiento disfrazado como "investigación de vida silvestre"',
    'ANOMALY LOG:':
      'REGISTRO DE ANOMALÍAS:',
    '  - Unit AV-3201 recovered by civilian (neutralized)':
      '  - Unidad AV-3201 recuperada por civil (neutralizada)',
    '  - Unit AV-4089 battery failure mid-flight':
      '  - Unidad AV-4089 falla de batería en pleno vuelo',
    '  - Unit AV-5847 behavioral deviation (investigating)':
      '  - Unidad AV-5847 desviación conductual (investigando)',
    'NEXT DEPLOYMENT: 847 units scheduled Q1 1996':
      'PRÓXIMO DESPLIEGUE: 847 unidades programadas Q1 1996',
    'COVER STORY: Migratory pattern research funding':
      'HISTORIA DE COBERTURA: Financiamiento de investigación de patrones migratorios',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 7 — CONSUMER DEVICE LISTENING
    // ═══════════════════════════════════════════════════════════
    'TECHNICAL ASSESSMENT — PASSIVE AUDIO COLLECTION':
      'EVALUACIÓN TÉCNICA — RECOLECCIÓN PASIVA DE AUDIO',
    'PROJECT: WHISPER':
      'PROYECTO: WHISPER',
    'DATE: 19-DEC-1995':
      'FECHA: 19-DIC-1995',
    'TO: Technical Collection Division':
      'PARA: División de Recolección Técnica',
    'FROM: Consumer Electronics Liaison':
      'DE: Enlace de Electrónicos de Consumo',
    'RE: Ambient Audio Capability in Home Devices':
      'REF: Capacidad de Audio Ambiental en Dispositivos del Hogar',
    '  Working with [REDACTED] manufacturers, we have':
      '  Trabajando con fabricantes [REDACTADO], hemos logrado',
    '  successfully embedded passive microphone arrays in':
      '  incrustar exitosamente conjuntos de micrófonos pasivos en las',
    '  the following consumer electronics categories:':
      '  siguientes categorías de electrónicos de consumo:',
    '  - Television receivers (beta testing, 12 models)':
      '  - Receptores de televisión (pruebas beta, 12 modelos)',
    '  - Cable decoder boxes (full deployment ready)':
      '  - Decodificadores de cable (listos para despliegue total)',
    '  - Answering machines (limited deployment)':
      '  - Contestadoras automáticas (despliegue limitado)',
    '  - Clock radios (prototype phase)':
      '  - Radiodespertadores (fase de prototipo)',
    'CAPABILITIES:':
      'CAPACIDADES:',
    '  - Continuous ambient audio capture':
      '  - Captura continua de audio ambiental',
    '  - Keyword activation for priority recording':
      '  - Activación por palabra clave para grabación prioritaria',
    '  - Emotional distress pattern detection (experimental)':
      '  - Detección de patrones de angustia emocional (experimental)',
    '  - Data burst transmission during off-peak hours':
      '  - Transmisión de datos en ráfaga durante horas fuera de pico',
    'PRIVACY CONCERNS:':
      'PREOCUPACIONES DE PRIVACIDAD:',
    '  Legal has advised that current wiretap statutes':
      '  Legal ha informado que los estatutos actuales de escucha',
    '  do not explicitly cover ambient collection from':
      '  no cubren explícitamente la recolección ambiental de',
    '  voluntarily purchased consumer devices.':
      '  dispositivos de consumo adquiridos voluntariamente.',
    '  Recommend maintaining this legal ambiguity.':
      '  Se recomienda mantener esta ambigüedad legal.',
    'NEXT PHASE:':
      'PRÓXIMA FASE:',
    '  Expand to cordless telephone base stations.':
      '  Expandir a estaciones base de teléfonos inalámbricos.',
    '  Future integration with "smart home" concepts':
      '  Integración futura con conceptos de "hogar inteligente"',
    '  currently in development at [REDACTED] labs.':
      '  actualmente en desarrollo en los laboratorios [REDACTADO].',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 8 — ARCHIVAL PHOTO REPLACEMENT
    // ═══════════════════════════════════════════════════════════
    'NATIONAL ARCHIVES — DOCUMENT MANAGEMENT DIRECTIVE':
      'ARCHIVOS NACIONALES — DIRECTIVA DE GESTIÓN DE DOCUMENTOS',
    'NOTICE: DMD-1995-47':
      'AVISO: DMD-1995-47',
    'DATE: 03-OCT-1995':
      'FECHA: 03-OCT-1995',
    'SUBJECT: Historical Image Archive Modernization':
      'ASUNTO: Modernización del Archivo de Imágenes Históricas',
    'DIRECTIVE:':
      'DIRECTIVA:',
    '  As part of our digital preservation initiative, all':
      '  Como parte de nuestra iniciativa de preservación digital, todos los',
    '  historical photographic records are being converted':
      '  registros fotográficos históricos están siendo convertidos',
    '  to digital format using the MASTER CLEAN protocol.':
      '  a formato digital usando el protocolo MASTER CLEAN.',
    'PROCEDURE:':
      'PROCEDIMIENTO:',
    '  1. Original photographs scanned at high resolution':
      '  1. Fotografías originales escaneadas en alta resolución',
    '  2. Digital restoration applied per Guidelines Appendix C':
      '  2. Restauración digital aplicada según Apéndice C de las Directrices',
    '  3. "Cleaned master versions" replace originals in archive':
      '  3. "Versiones maestras limpias" reemplazan originales en el archivo',
    '  4. Original prints transferred to [REDACTED] facility':
      '  4. Copias originales transferidas a instalación [REDACTADO]',
    'RESTORATION GUIDELINES (EXCERPT):':
      'DIRECTRICES DE RESTAURACIÓN (EXTRACTO):',
    '  - Remove inadvertent civilian faces (privacy)':
      '  - Eliminar rostros civiles inadvertidos (privacidad)',
    '  - Correct lighting inconsistencies':
      '  - Corregir inconsistencias de iluminación',
    '  - Standardize official personnel positioning':
      '  - Estandarizar posicionamiento del personal oficial',
    '  - Eliminate background elements causing "confusion"':
      '  - Eliminar elementos de fondo que causan "confusión"',
    'SPECIAL HANDLING:':
      'MANEJO ESPECIAL:',
    '  Images flagged in Categories 7-12 require review by':
      '  Las imágenes marcadas en las Categorías 7-12 requieren revisión por',
    '  Historical Accuracy Committee before digitization.':
      '  el Comité de Precisión Histórica antes de la digitalización.',
    '  These include:':
      '  Incluyen:',
    '    - Political figures in "inconsistent" contexts':
      '    - Figuras políticas en contextos "inconsistentes"',
    '    - Military operations with "unclear" narratives':
      '    - Operaciones militares con narrativas "poco claras"',
    '    - Events with "disputed" official records':
      '    - Eventos con registros oficiales "disputados"',
    'NOTE: This process is administrative only.':
      'NOTA: Este proceso es solo administrativo.',
    '      No historical record is being altered.':
      '      Ningún registro histórico está siendo alterado.',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 9 — EDUCATION CURRICULUM REVISION
    // ═══════════════════════════════════════════════════════════
    'CURRICULUM ADVISORY COMMITTEE — WORKING NOTES':
      'COMITÉ ASESOR DE CURRÍCULO — NOTAS DE TRABAJO',
    'MEETING: 14-AUG-1995':
      'REUNIÓN: 14-AGO-1995',
    'CLASSIFICATION: INTERNAL':
      'CLASIFICACIÓN: INTERNA',
    'ATTENDEES: [REDACTED]':
      'ASISTENTES: [REDACTADO]',
    'AGENDA ITEM 3: Historical Narrative Simplification':
      'PUNTO DE AGENDA 3: Simplificación de la Narrativa Histórica',
    'DISCUSSION SUMMARY:':
      'RESUMEN DE LA DISCUSIÓN:',
    '  Committee reviewed proposals for streamlining historical':
      '  El comité revisó propuestas para simplificar el contenido',
    '  content in secondary education materials.':
      '  histórico en los materiales de educación secundaria.',
    'KEY RECOMMENDATIONS:':
      'RECOMENDACIONES CLAVE:',
    '  1. Complex geopolitical contexts should be reduced to':
      '  1. Los contextos geopolíticos complejos deben reducirse a',
    '     clear "protagonist/antagonist" frameworks.':
      '     marcos claros de "protagonista/antagonista".',
    '  2. Events with multiple valid interpretations should be':
      '  2. Los eventos con múltiples interpretaciones válidas deben',
    '     presented with single "consensus" narrative.':
      '     presentarse con una narrativa única de "consenso".',
    '  3. Topics generating "excessive debate" among students':
      '  3. Los temas que generan "debate excesivo" entre estudiantes',
    '     should receive reduced curriculum time.':
      '     deben recibir tiempo curricular reducido.',
    'RATIONALE:':
      'JUSTIFICACIÓN:',
    '  Research indicates complex narratives correlate with:':
      '  La investigación indica que las narrativas complejas se correlacionan con:',
    '    - Reduced institutional trust':
      '    - Confianza institucional reducida',
    '    - Increased political polarization':
      '    - Polarización política aumentada',
    '    - Lower social cohesion metrics':
      '    - Métricas de cohesión social más bajas',
    '  Simplified narratives support unified civic identity.':
      '  Las narrativas simplificadas apoyan la identidad cívica unificada.',
    'IMPLEMENTATION:':
      'IMPLEMENTACIÓN:',
    '  - Phase out nuanced source analysis by Grade 10':
      '  - Eliminar gradualmente el análisis crítico de fuentes para el 10° grado',
    '  - Emphasize "shared heritage" over critical evaluation':
      '  - Enfatizar "patrimonio compartido" sobre evaluación crítica',
    '  - Textbook publishers to receive guidelines Q1 1996':
      '  - Las editoriales de libros de texto recibirán directrices Q1 1996',
    'MOTION CARRIED: 7-2':
      'MOCIÓN APROBADA: 7-2',
    '[END NOTES]':
      '[FIN DE LAS NOTAS]',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 10 — SATELLITE LIGHT REFLECTION
    // ═══════════════════════════════════════════════════════════
    'PROJECT NIGHTLIGHT — FEASIBILITY ASSESSMENT':
      'PROYECTO NIGHTLIGHT — EVALUACIÓN DE VIABILIDAD',
    'DATE: 22-NOV-1995':
      'FECHA: 22-NOV-1995',
    'OBJECTIVE:':
      'OBJETIVO:',
    '  Evaluate deployment of orbital reflective arrays for':
      '  Evaluar el despliegue de conjuntos reflectivos orbitales para',
    '  urban illumination and psychological operations.':
      '  iluminación urbana y operaciones psicológicas.',
    'TECHNICAL SUMMARY:':
      'RESUMEN TÉCNICO:',
    '  - Mylar reflector panels: 500m² deployed area':
      '  - Paneles reflectores de Mylar: área desplegada de 500m²',
    '  - Orbital altitude: 400km (ISS equivalent)':
      '  - Altitud orbital: 400km (equivalente ISS)',
    '  - Ground illumination: ~10% full moon equivalent':
      '  - Iluminación terrestre: ~10% equivalente a luna llena',
    '  - Targeting precision: 50km radius spotlight':
      '  - Precisión de objetivo: reflector de radio de 50km',
    'TEST RESULTS:':
      'RESULTADOS DE LAS PRUEBAS:',
    '  Trial 1 (Pacific): Successful reflection achieved.':
      '  Prueba 1 (Pacífico): Reflexión exitosa lograda.',
    '                     No civilian reports recorded.':
      '                     Ningún reporte civil registrado.',
    '  Trial 2 (Atlantic): Partial success. Reflector':
      '  Prueba 2 (Atlántico): Éxito parcial. Mal funcionamiento',
    '                      deployment malfunction.':
      '                      en el despliegue del reflector.',
    '  Trial 3 (Continental): Successful. 4 civilian':
      '  Prueba 3 (Continental): Exitosa. 4 reportes',
    '                         reports attributed to':
      '                         civiles atribuidos a',
    '                         "atmospheric phenomena."':
      '                         "fenómenos atmosféricos."',
    'APPLICATIONS:':
      'APLICACIONES:',
    '  1. Emergency illumination during disasters':
      '  1. Iluminación de emergencia durante desastres',
    '  2. Agricultural growing season extension':
      '  2. Extensión de la temporada agrícola de cultivo',
    '  3. Urban crime reduction via night visibility':
      '  3. Reducción del crimen urbano vía visibilidad nocturna',
    '  4. [CLASSIFIED] psychological operations capability':
      '  4. [CLASIFICADO] capacidad de operaciones psicológicas',
    'CONCERNS:':
      'PREOCUPACIONES:',
    '  - Astronomical community interference likely':
      '  - Interferencia de la comunidad astronómica probable',
    '  - Religious/cultural reactions unpredictable':
      '  - Reacciones religiosas/culturales impredecibles',
    '  - Light pollution effects unknown':
      '  - Efectos de contaminación lumínica desconocidos',
    '  Continue covert testing. Full deployment contingent':
      '  Continuar pruebas encubiertas. Despliegue total contingente',
    '  on cover story development and international':
      '  al desarrollo de historia de cobertura y protocolos',
    '  notification protocols.':
      '  de notificación internacional.',
    // ═══ expansionContent.ts — journalist_payments ═══
    '[ENCRYPTED - FINANCIAL RECORDS]':
      '[ENCRIPTADO - REGISTROS FINANCIEROS]',
    'Legacy wrapper retired. Open the file to review the recovered record.':
      'Wrapper heredado retirado. Abra el archivo para revisar el registro recuperado.',
    'WARNING: Unauthorized access to financial records':
      'ADVERTENCIA: El acceso no autorizado a registros financieros',
    'is punishable under Article 317.':
      'es punible bajo el Artículo 317.',
    'DISBURSEMENT RECORD — MEDIA RELATIONS':
      'REGISTRO DE DESEMBOLSO — RELACIONES CON MEDIOS',
    'ACCOUNT: SPECIAL OPERATIONS FUND':
      'CUENTA: FONDO DE OPERACIONES ESPECIALES',
    'PERIOD: JAN-FEB 1996':
      'PERÍODO: ENE-FEB 1996',
    'CLASSIFICATION: EYES ONLY':
      'CLASIFICACIÓN: SOLO PARA SUS OJOS',
    'PAYMENTS AUTHORIZED:':
      'PAGOS AUTORIZADOS:',
    '  23-JAN — R$ 15,000.00 — RODRIGUES, A.':
      '  23-ENE — R$ 15.000,00 — RODRIGUES, A.',
    '           Outlet: O Diário Nacional (Rio bureau)':
      '           Medio: O Diário Nacional (oficina de Río)',
    '           Purpose: Story suppression':
      '           Propósito: Supresión de reportaje',
    '           Status: CONFIRMED KILL':
      '           Estado: ELIMINACIÓN CONFIRMADA',
    '  25-JAN — R$ 8,500.00 — NASCIMENTO, C.':
      '  25-ENE — R$ 8.500,00 — NASCIMENTO, C.',
    '           Outlet: Folha Paulista':
      '           Medio: Folha Paulista',
    '           Purpose: Alternate narrative placement':
      '           Propósito: Inserción de narrativa alternativa',
    '           Status: PUBLISHED (homeless man angle)':
      '           Estado: PUBLICADO (ángulo del indigente)',
    '  27-JAN — R$ 22,000.00 — [REDACTED]':
      '  27-ENE — R$ 22.000,00 — [SUPRIMIDO]',
    '           Outlet: Rede Nacional (TV)':
      '           Medio: Rede Nacional (TV)',
    '           Purpose: Programa Dominical segment cancellation':
      '           Propósito: Cancelación de segmento del Programa Dominical',
    '           Status: SEGMENT PULLED':
      '           Estado: SEGMENTO RETIRADO',
    '  30-JAN — R$ 5,000.00 — COSTA, R.':
      '  30-ENE — R$ 5.000,00 — COSTA, R.',
    '           Outlet: Estado de Minas':
      '           Medio: Estado de Minas',
    '           Purpose: Editorial pressure':
      '           Propósito: Presión editorial',
    '           Status: OPINION PIECE SPIKED':
      '           Estado: ARTÍCULO DE OPINIÓN VETADO',
    '  02-FEB — R$ 12,000.00 — FERREIRA, J.':
      '  02-FEB — R$ 12.000,00 — FERREIRA, J.',
    '           Outlet: Revista Isto':
      '           Medio: Revista Isto',
    '           Purpose: Issue delay (cover story change)':
      '           Propósito: Retraso de edición (cambio de portada)',
    '           Status: MARCH ISSUE SUBSTITUTED':
      '           Estado: EDICIÓN DE MARZO SUSTITUIDA',
    'TOTAL DISBURSED: R$ 62,500.00':
      'TOTAL DESEMBOLSADO: R$ 62.500,00',
    'NOTE: All payments routed through agricultural cooperative':
      'NOTA: Todos los pagos canalizados a través de cooperativa agrícola',
    '      shell account. Paper trail clean.':
      '      cuenta fantasma. Rastro documental limpio.',
    'APPROVED: [SIGNATURE REDACTED]':
      'APROBADO: [FIRMA SUPRIMIDA]',
    // ═══ expansionContent.ts — media_contacts ═══
    'MEDIA CONTACTS — COOPERATIVE JOURNALISTS':
      'CONTACTOS EN MEDIOS — PERIODISTAS COOPERATIVOS',
    'COMPILED: DECEMBER 1995 (UPDATED JAN 1996)':
      'COMPILADO: DICIEMBRE 1995 (ACTUALIZADO ENE 1996)',
    'TELEVISION:':
      'TELEVISIÓN:',
    '  Rede Nacional (TV Nacional)':
      '  Rede Nacional (TV Nacional)',
    '    SANTOS, Eduardo — News Director':
      '    SANTOS, Eduardo — Director de Noticias',
    '    Direct line: (021) 555-7823':
      '    Línea directa: (021) 555-7823',
    '    Reliability: HIGH':
      '    Confiabilidad: ALTA',
    '    History: Cooperative since 1989':
      '    Historial: Cooperativo desde 1989',
    '  TV Regional Sul':
      '  TV Regional Sul',
    '    [REDACTED] — Assignment Editor':
      '    [SUPRIMIDO] — Editor de Asignaciones',
    '    Direct line: (035) 555-4412':
      '    Línea directa: (035) 555-4412',
    '    Reliability: MODERATE':
      '    Confiabilidad: MODERADA',
    '    Note: Requires advance notice':
      '    Nota: Requiere aviso previo',
    'PRINT:':
      'PRENSA:',
    '  O Diário Nacional':
      '  O Diário Nacional',
    '    RODRIGUES, André — City Desk Chief':
      '    RODRIGUES, André — Jefe de Redacción Local',
    '    Direct line: (021) 555-9034':
      '    Línea directa: (021) 555-9034',
    '    Note: Has killed 3 stories for us':
      '    Nota: Ha eliminado 3 reportajes para nosotros',
    '  Folha Paulista':
      '  Folha Paulista',
    '    [REDACTED] — Senior Editor':
      '    [SUPRIMIDO] — Editor Senior',
    '    Direct line: (011) 555-2156':
      '    Línea directa: (011) 555-2156',
    '    Note: Prefers placement over suppression':
      '    Nota: Prefiere inserción sobre supresión',
    '  Estado de Minas':
      '  Estado de Minas',
    '    PEREIRA, Helena — Regional Bureau':
      '    PEREIRA, Helena — Oficina Regional',
    '    Direct line: (031) 555-8877':
      '    Línea directa: (031) 555-8877',
    '    Reliability: HIGH (local knowledge)':
      '    Confiabilidad: ALTA (conocimiento local)',
    '    Note: Family connection to military':
      '    Nota: Conexión familiar con lo militar',
    'MAGAZINES:':
      'REVISTAS:',
    '  Revista Isto':
      '  Revista Isto',
    '    ALMEIDA, Ricardo — Features Editor':
      '    ALMEIDA, Ricardo — Editor de Reportajes',
    '    Direct line: (011) 555-6543':
      '    Línea directa: (011) 555-6543',
    '    Note: Slow but reliable':
      '    Nota: Lento pero confiable',
    'AVOID:':
      'EVITAR:',
    '  Revista Fenômenos (UFO publication)':
      '  Revista Fenômenos (publicación sobre OVNIs)',
    '    CANNOT be controlled':
      '    NO PUEDE ser controlado',
    '    Editor PACACCINI known hostile':
      '    Editor PACACCINI conocido como hostil',
    '    Monitor only, do not engage':
      '    Solo monitorear, no intervenir',
    // ═══ expansionContent.ts — kill_story_memo ═══
    'URGENT MEMORANDUM — MEDIA SUPPRESSION':
      'MEMORANDO URGENTE — SUPRESIÓN DE MEDIOS',
    'DATE: 26-JAN-1996':
      'FECHA: 26-ENE-1996',
    'FROM: Public Affairs Liaison':
      'DE: Enlace de Asuntos Públicos',
    'TO: Regional Directors':
      'PARA: Directores Regionales',
    'SUBJECT: Immediate Action Required':
      'ASUNTO: Acción Inmediata Requerida',
    'The following stories are in development and must be':
      'Los siguientes reportajes están en desarrollo y deben ser',
    'suppressed before publication/broadcast:':
      'suprimidos antes de su publicación/transmisión:',
    '1. PROGRAMA DOMINICAL (Rede Nacional)':
      '1. PROGRAMA DOMINICAL (Rede Nacional)',
    '   Scheduled: Sunday 28-JAN, 21:00':
      '   Programado: Domingo 28-ENE, 21:00',
    '   Topic: "Varginha Mystery — What the Military Hides"':
      '   Tema: "Misterio de Varginha — Lo Que Ocultan los Militares"',
    '   Status: KILL CONFIRMED':
      '   Estado: ELIMINACIÓN CONFIRMADA',
    '   Action: Contact made with news director':
      '   Acción: Contacto realizado con director de noticias',
    '   Replacement segment: Carnival preparations':
      '   Segmento sustituto: Preparativos para el Carnaval',
    '2. FOLHA PAULISTA':
      '2. FOLHA PAULISTA',
    '   Scheduled: 29-JAN morning edition':
      '   Programado: 29-ENE edición matutina',
    '   Topic: Front page investigation piece':
      '   Tema: Artículo de investigación de portada',
    '   Status: IN PROGRESS':
      '   Estado: EN CURSO',
    '   Action: Redirect to "homeless man" angle':
      '   Acción: Redirigir al ángulo del "indigente"',
    '   Payment: Authorized':
      '   Pago: Autorizado',
    '3. REVISTA ISTO':
      '3. REVISTA ISTO',
    '   Scheduled: February issue (already at printer)':
      '   Programado: Edición de febrero (ya en imprenta)',
    '   Topic: 8-page cover story':
      '   Tema: Reportaje de portada de 8 páginas',
    '   Status: CRITICAL':
      '   Estado: CRÍTICO',
    '   Action: Delay print run, substitute cover':
      '   Acción: Retrasar impresión, sustituir portada',
    '   Note: Higher payment required':
      '   Nota: Se requiere pago mayor',
    'APPROACH GUIDELINES:':
      'DIRECTRICES DE ABORDAJE:',
    '  - Lead with "national security" concern':
      '  - Liderar con preocupación de "seguridad nacional"',
    '  - Offer exclusive on substitute story':
      '  - Ofrecer exclusiva en reportaje sustituto',
    '  - Payment is last resort':
      '  - El pago es último recurso',
    '  - Document nothing in writing':
      '  - No documentar nada por escrito',
    'ESCALATION:':
      'ESCALAMIENTO:',
    '  If journalist is uncooperative, refer to':
      '  Si el periodista no coopera, referir al',
    '  Protocol SOMBRA for additional measures.':
      '  Protocolo SOMBRA para medidas adicionales.',
    // ═══ expansionContent.ts — tv_coverage_report ═══
    'INTELLIGENCE REPORT — TV COVERAGE THREAT':
      'INFORME DE INTELIGENCIA — AMENAZA DE COBERTURA TELEVISIVA',
    'DATE: 25-JAN-1996':
      'FECHA: 25-ENE-1996',
    'PRIORITY: HIGH':
      'PRIORIDAD: ALTA',
    'SUBJECT: Programa Dominical (Rede Nacional)':
      'ASUNTO: Programa Dominical (Rede Nacional)',
    '  Brazil\'s highest-rated Sunday program.':
      '  Programa dominical de mayor audiencia de Brasil.',
    '  Audience: 40+ million viewers.':
      '  Audiencia: 40+ millones de televidentes.',
    '  Time slot: 21:00-23:30':
      '  Franja horaria: 21:00-23:30',
    'THREAT ASSESSMENT:':
      'EVALUACIÓN DE AMENAZA:',
    '  Production team dispatched to Varginha 24-JAN.':
      '  Equipo de producción enviado a Varginha 24-ENE.',
    '  Interviewed local witnesses (uncontrolled).':
      '  Entrevistaron testigos locales (sin control).',
    '  Obtained amateur video footage (unverified).':
      '  Obtuvieron filmaciones amateur (no verificadas).',
    '  Segment scheduled for 28-JAN broadcast.':
      '  Segmento programado para transmisión del 28-ENE.',
    'CONTENT PREVIEW (obtained via source):':
      'VISTA PREVIA DEL CONTENIDO (obtenida vía fuente):',
    '  - Interviews with the three sisters':
      '  - Entrevistas con las tres hermanas',
    '  - Military vehicle footage':
      '  - Filmaciones de vehículos militares',
    '  - Hospital security guard statement':
      '  - Declaración del guardia de seguridad del hospital',
    '  - "Expert" commentary (civilian ufologist)':
      '  - Comentario de "experto" (ufólogo civil)',
    'DAMAGE POTENTIAL:':
      'POTENCIAL DE DAÑO:',
    '  SEVERE — Nationwide exposure impossible to contain':
      '  SEVERO — Exposición nacional imposible de contener',
    '  Would legitimize story for international pickup':
      '  Legitimaría el reportaje para repercusión internacional',
    'RECOMMENDED ACTION:':
      'ACCIÓN RECOMENDADA:',
    '  1. Contact news director SANTOS immediately':
      '  1. Contactar al director de noticias SANTOS inmediatamente',
    '  2. Invoke national security clause':
      '  2. Invocar cláusula de seguridad nacional',
    '  3. Offer substitute exclusive (suggest carnival)':
      '  3. Ofrecer exclusiva sustituta (sugerir carnaval)',
    '  4. If necessary, escalate to network ownership':
      '  4. Si es necesario, escalar a la directiva de la cadena',
    'STATUS: ACTION IN PROGRESS':
      'ESTADO: ACCIÓN EN CURSO',
    // ═══ expansionContent.ts — foreign_press_alert ═══
    'ALERT — FOREIGN PRESS INTEREST':
      'ALERTA — INTERÉS DE LA PRENSA EXTRANJERA',
    'DATE: 15-JUN-1996':
      'FECHA: 15-JUN-1996',
    'SUBJECT: American Business Journal Investigation':
      'ASUNTO: Investigación del American Business Journal',
    'SITUATION:':
      'SITUACIÓN:',
    '  The American Business Journal (New York) has assigned':
      '  El American Business Journal (Nueva York) ha asignado al',
    '  correspondent J. BROOKE to investigate the incident.':
      '  corresponsal J. BROOKE para investigar el incidente.',
    'JOURNALIST PROFILE:':
      'PERFIL DEL PERIODISTA:',
    '  Name: James BROOKE':
      '  Nombre: James BROOKE',
    '  Bureau: Rio de Janeiro':
      '  Oficina: Río de Janeiro',
    '  Background: 12 years Latin America coverage':
      '  Experiencia: 12 años de cobertura en América Latina',
    '  Assessment: PROFESSIONAL, PERSISTENT':
      '  Evaluación: PROFESIONAL, PERSISTENTE',
    'KNOWN ACTIVITIES:':
      'ACTIVIDADES CONOCIDAS:',
    '  - Filed FOIA request with Brazilian Air Force':
      '  - Presentó solicitud de información ante la Fuerza Aérea Brasileña',
    '  - Contacted regional hospital administration':
      '  - Contactó la administración del hospital regional',
    '  - Attempted interview with fire department':
      '  - Intentó entrevista con el cuerpo de bomberos',
    '  - Visited Jardim Andere neighborhood':
      '  - Visitó el barrio Jardim Andere',
    'ARTICLE STATUS:':
      'ESTADO DEL ARTÍCULO:',
    '  Scheduled publication: Late June 1996':
      '  Publicación prevista: Finales de junio de 1996',
    '  Expected tone: Skeptical but thorough':
      '  Tono esperado: Escéptico pero minucioso',
    '  Likely angle: Military secrecy, witness accounts':
      '  Ángulo probable: Secreto militar, testimonios de testigos',
    '  1. Do NOT engage directly':
      '  1. NO intervenir directamente',
    '     (Foreign journalist = different rules)':
      '     (Periodista extranjero = reglas diferentes)',
    '  2. Prepare official statement emphasizing:':
      '  2. Preparar declaración oficial enfatizando:',
    '     - Weather balloon explanation':
      '     - Explicación del globo meteorológico',
    '     - Witness confusion/hysteria':
      '     - Confusión/histeria de los testigos',
    '     - No military involvement':
      '     - Ninguna participación militar',
    '  3. Brief cooperative Brazilian sources to:':
      '  3. Instruir a fuentes brasileñas cooperativas para:',
    '     - Cast doubt on witnesses':
      '     - Poner en duda a los testigos',
    '     - Emphasize "Mudinho" explanation':
      '     - Enfatizar explicación de "Mudinho"',
    '     - Suggest mass hysteria angle':
      '     - Sugerir ángulo de histeria colectiva',
    '  4. Monitor publication and prepare response':
      '  4. Monitorear publicación y preparar respuesta',
    'NOTE: Cannot use domestic suppression tactics.':
      'NOTA: No se pueden usar tácticas de supresión domésticas.',
    '      International outlet requires different approach.':
      '      Medio internacional requiere enfoque diferente.',
    // ═══ expansionContent.ts — witness_visit_log ═══
    'WITNESS CONTACT LOG — OPERATION SILÊNCIO':
      'REGISTRO DE CONTACTO CON TESTIGOS — OPERACIÓN SILÊNCIO',
    'PERIOD: 21-JAN to 15-FEB 1996':
      'PERÍODO: 21-ENE a 15-FEB 1996',
    'VISIT #001':
      'VISITA #001',
    '  Date: 21-JAN-1996, 22:00':
      '  Fecha: 21-ENE-1996, 22:00',
    '  Subject: WITNESS-1 (primary witness, eldest sister)':
      '  Sujeto: WITNESS-1 (testigo principal, hermana mayor)',
    '  Location: Residence, Jardim Andere':
      '  Ubicación: Residencia, Jardim Andere',
    '  Team: COBRA-1, COBRA-2':
      '  Equipo: COBRA-1, COBRA-2',
    '  Duration: 45 minutes':
      '  Duración: 45 minutos',
    '  Outcome: COOPERATIVE (see recantation form)':
      '  Resultado: COOPERATIVO (ver formulario de retractación)',
    'VISIT #002':
      'VISITA #002',
    '  Date: 21-JAN-1996, 23:30':
      '  Fecha: 21-ENE-1996, 23:30',
    '  Subject: WITNESS-2 (middle sister)':
      '  Sujeto: WITNESS-2 (hermana del medio)',
    '  Duration: 30 minutes':
      '  Duración: 30 minutos',
    '  Outcome: COOPERATIVE':
      '  Resultado: COOPERATIVO',
    'VISIT #003':
      'VISITA #003',
    '  Date: 22-JAN-1996, 06:00':
      '  Fecha: 22-ENE-1996, 06:00',
    '  Subject: WITNESS-3 (youngest sister)':
      '  Sujeto: WITNESS-3 (hermana menor)',
    '  Location: Workplace':
      '  Ubicación: Lugar de trabajo',
    '  Team: COBRA-3, COBRA-4':
      '  Equipo: COBRA-3, COBRA-4',
    '  Duration: 20 minutes':
      '  Duración: 20 minutos',
    '  Outcome: RESISTANT — follow-up required':
      '  Resultado: RESISTENTE — seguimiento requerido',
    'VISIT #004':
      'VISITA #004',
    '  Date: 22-JAN-1996, 14:00':
      '  Fecha: 22-ENE-1996, 14:00',
    '  Subject: [REDACTED] (fire dept. dispatcher)':
      '  Sujeto: [SUPRIMIDO] (despachador del cuerpo de bomberos)',
    '  Location: Fire station':
      '  Ubicación: Estación de bomberos',
    '  Duration: 35 minutes':
      '  Duración: 35 minutos',
    '  Note: Agreed to "no comment" position':
      '  Nota: Aceptó posición de "sin comentarios"',
    'VISIT #005':
      'VISITA #005',
    '  Date: 23-JAN-1996, 19:00':
      '  Fecha: 23-ENE-1996, 19:00',
    '  Subject: WITNESS-3 (follow-up)':
      '  Sujeto: WITNESS-3 (seguimiento)',
    '  Location: Residence':
      '  Ubicación: Residencia',
    '  Team: COBRA-1, COBRA-2, COBRA-5':
      '  Equipo: COBRA-1, COBRA-2, COBRA-5',
    '  Duration: 90 minutes':
      '  Duración: 90 minutos',
    '  Note: Extended persuasion required':
      '  Nota: Persuasión prolongada requerida',
    'VISIT #006':
      'VISITA #006',
    '  Date: 24-JAN-1996, 08:00':
      '  Fecha: 24-ENE-1996, 08:00',
    '  Subject: [REDACTED] (hospital orderly)':
      '  Sujeto: [SUPRIMIDO] (auxiliar hospitalario)',
    '  Location: Hospital Regional':
      '  Ubicación: Hospital Regional',
    '  Duration: 25 minutes':
      '  Duración: 25 minutos',
    '  Note: Signed NDA, received severance':
      '  Nota: Firmó acuerdo de confidencialidad, recibió indemnización',
    'VISIT #007':
      'VISITA #007',
    '  Date: 25-JAN-1996, 20:00':
      '  Fecha: 25-ENE-1996, 20:00',
    '  Subject: FERREIRA, Ana (zoo veterinarian)':
      '  Sujeto: FERREIRA, Ana (veterinaria del zoológico)',
    '  Duration: 55 minutes':
      '  Duración: 55 minutos',
    '  Outcome: PARTIALLY COOPERATIVE':
      '  Resultado: PARCIALMENTE COOPERATIVO',
    '  Note: See zoo incident file':
      '  Nota: Ver archivo del incidente del zoológico',
    'TOTAL CONTACTS: 14':
      'TOTAL DE CONTACTOS: 14',
    'COOPERATIVE: 12':
      'COOPERATIVOS: 12',
    'RESISTANT: 2 (resolved)':
      'RESISTENTES: 2 (resueltos)',
    // ═══ expansionContent.ts — debriefing_protocol ═══
    'STANDARD OPERATING PROCEDURE':
      'PROCEDIMIENTO OPERATIVO ESTÁNDAR',
    'WITNESS DEBRIEFING — PROTOCOL SOMBRA':
      'INTERROGATORIO DE TESTIGOS — PROTOCOLO SOMBRA',
    'PURPOSE:':
      'PROPÓSITO:',
    '  To ensure civilian witnesses maintain silence':
      '  Asegurar que los testigos civiles mantengan silencio',
    '  regarding classified incidents.':
      '  respecto a incidentes clasificados.',
    'PHASE 1: APPROACH':
      'FASE 1: ABORDAJE',
    '  - Team of TWO minimum (never alone)':
      '  - Equipo de DOS mínimo (nunca solo)',
    '  - Dark suits, minimal identification':
      '  - Trajes oscuros, identificación mínima',
    '  - Arrive outside normal hours (22:00-06:00 preferred)':
      '  - Llegar fuera del horario normal (22:00-06:00 preferible)',
    '  - Do NOT display badges unless necessary':
      '  - NO mostrar credenciales a menos que sea necesario',
    '  - State: "We are from the government"':
      '  - Declarar: "Somos del gobierno"',
    'PHASE 2: ASSESSMENT':
      'FASE 2: EVALUACIÓN',
    '  Evaluate witness disposition:':
      '  Evaluar disposición del testigo:',
    '  TYPE A: Already frightened':
      '  TIPO A: Ya asustado',
    '    → Proceed directly to reassurance':
      '    → Proceder directamente a la tranquilización',
    '    → "You saw nothing unusual"':
      '    → "Usted no vio nada inusual"',
    '  TYPE B: Curious/talkative':
      '  TIPO B: Curioso/hablador',
    '    → Emphasize national security':
      '    → Enfatizar seguridad nacional',
    '    → "Your family\\\'s safety depends on silence"':
      '    → "La seguridad de su familia depende del silencio"',
    '  TYPE C: Hostile/resistant':
      '  TIPO C: Hostil/resistente',
    '    → Deploy secondary team':
      '    → Desplegar equipo secundario',
    '    → Extended session required':
      '    → Sesión prolongada requerida',
    '    → See Protocol SOMBRA-EXTENDED':
      '    → Ver Protocolo SOMBRA-EXTENDED',
    'PHASE 3: DOCUMENTATION':
      'FASE 3: DOCUMENTACIÓN',
    '  - Obtain signed recantation statement':
      '  - Obtener declaración de retractación firmada',
    '  - Obtain signed NDA (Form W-7)':
      '  - Obtener acuerdo de confidencialidad firmado (Formulario W-7)',
    '  - Photograph witness (for file)':
      '  - Fotografiar testigo (para expediente)',
    '  - Record any family members present':
      '  - Registrar cualquier familiar presente',
    'PHASE 4: FOLLOW-UP':
      'FASE 4: SEGUIMIENTO',
    '  - Monitor subject for 30 days minimum':
      '  - Monitorear sujeto por mínimo 30 días',
    '  - Verify no media contact':
      '  - Verificar ausencia de contacto con medios',
    '  - If breach suspected, escalate immediately':
      '  - Si se sospecha violación, escalar inmediatamente',
    'AUTHORIZED TECHNIQUES:':
      'TÉCNICAS AUTORIZADAS:',
    '  ✓ Verbal persuasion':
      '  ✓ Persuasión verbal',
    '  ✓ Implication of consequences':
      '  ✓ Implicación de consecuencias',
    '  ✓ Financial incentive':
      '  ✓ Incentivo financiero',
    '  ✓ Employment pressure':
      '  ✓ Presión laboral',
    '  ✗ Physical contact (PROHIBITED)':
      '  ✗ Contacto físico (PROHIBIDO)',
    '  ✗ Direct threats (PROHIBITED)':
      '  ✗ Amenazas directas (PROHIBIDO)',
    'NOTE: All sessions are UNRECORDED.':
      'NOTA: Todas las sesiones son NO GRABADAS.',
    '      No notes to be taken in presence of witness.':
      '      No se deben tomar notas en presencia del testigo.',
    // ═══ expansionContent.ts — silva_sisters_file ═══
    'SUBJECT FILE — THE THREE WITNESSES':
      'EXPEDIENTE DE SUJETOS — LAS TRES TESTIGOS',
    'FILE NUMBER: VAR-96-W001':
      'NÚMERO DE EXPEDIENTE: VAR-96-W001',
    'PRIMARY WITNESSES — JARDIM ANDERE INCIDENT':
      'TESTIGOS PRINCIPALES — INCIDENTE DEL JARDIM ANDERE',
    'SUBJECT 1: WITNESS-1 (eldest sister)':
      'SUJETO 1: WITNESS-1 (hermana mayor)',
    '  Age: 22':
      '  Edad: 22',
    '  Occupation: Domestic worker':
      '  Ocupación: Empleada doméstica',
    '  Marital status: Single':
      '  Estado civil: Soltera',
    '  Dependents: None':
      '  Dependientes: Ninguno',
    '  Address: [REDACTED], Jardim Andere, Varginha':
      '  Dirección: [SUPRIMIDO], Jardim Andere, Varginha',
    '  Assessment: MOST CREDIBLE of three':
      '  Evaluación: MÁS CREÍBLE de las tres',
    '  Demeanor: Frightened, religious':
      '  Comportamiento: Asustada, religiosa',
    '  Pressure points: Mother\\\'s health, job security':
      '  Puntos de presión: Salud de la madre, seguridad laboral',
    '  Statement summary:':
      '  Resumen de la declaración:',
    '    Saw "creature" at approx. 15:30 on 20-JAN':
      '    Vio "criatura" aprox. a las 15:30 el 20-ENE',
    '    Described: small, brown skin, red eyes':
      '    Descripción: pequeña, piel marrón, ojos rojos',
    '    Claims creature "looked at her"':
      '    Afirma que la criatura "la miró"',
    '    Ran immediately, called mother':
      '    Huyó inmediatamente, llamó a su madre',
    '  Status: RECANTED (23-JAN)':
      '  Estado: RETRACTADA (23-ENE)',
    '  Current position: "Saw a homeless person"':
      '  Posición actual: "Vio a un indigente"',
    'SUBJECT 2: WITNESS-2 (middle sister)':
      'SUJETO 2: WITNESS-2 (hermana del medio)',
    '  Age: 16':
      '  Edad: 16',
    '  Occupation: Student':
      '  Ocupación: Estudiante',
    '  Relation: Sister of WITNESS-1':
      '  Parentesco: Hermana de WITNESS-1',
    '  Assessment: IMPRESSIONABLE':
      '  Evaluación: IMPRESIONABLE',
    '  Demeanor: Nervous, easily led':
      '  Comportamiento: Nerviosa, fácilmente influenciable',
    '  Pressure points: School enrollment':
      '  Puntos de presión: Matrícula escolar',
    '  Status: RECANTED (22-JAN)':
      '  Estado: RETRACTADA (22-ENE)',
    '  Current position: "Sister was confused"':
      '  Posición actual: "La hermana estaba confundida"',
    'SUBJECT 3: WITNESS-3 (youngest sister)':
      'SUJETO 3: WITNESS-3 (hermana menor)',
    '  Age: 14':
      '  Edad: 14',
    '  Assessment: RESISTANT':
      '  Evaluación: RESISTENTE',
    '  Demeanor: Defiant, maintains story':
      '  Comportamiento: Desafiante, mantiene su versión',
    '  Pressure points: Academic future':
      '  Puntos de presión: Futuro académico',
    '  Status: PARTIALLY COOPERATIVE (25-JAN)':
      '  Estado: PARCIALMENTE COOPERATIVA (25-ENE)',
    '  Current position: "Agrees to stay silent"':
      '  Posición actual: "Acepta guardar silencio"',
    '  Note: Did NOT sign recantation':
      '  Nota: NO firmó retractación',
    '        Monitor closely':
      '        Monitorear de cerca',
    'FAMILY SITUATION:':
      'SITUACIÓN FAMILIAR:',
    '  Mother: [REDACTED] — supportive of daughters':
      '  Madre: [SUPRIMIDO] — apoya a las hijas',
    '  Father: Deceased':
      '  Padre: Fallecido',
    '  Economic status: Lower middle class':
      '  Estatus económico: Clase media baja',
    '  Religious: Catholic (devout)':
      '  Religión: Católica (devota)',
    'CONTAINMENT ASSESSMENT:':
      'EVALUACIÓN DE CONTENCIÓN:',
    '  Risk level: MODERATE':
      '  Nivel de riesgo: MODERADO',
    '  Reason: WITNESS-3 remains unconvinced':
      '  Razón: WITNESS-3 permanece no convencida',
    '  Recommendation: Monitor for 6 months':
      '  Recomendación: Monitorear por 6 meses',
    // ═══ expansionContent.ts — recantation_form_001 ═══
    'WITNESS STATEMENT CORRECTION':
      'CORRECCIÓN DE DECLARACIÓN DE TESTIGO',
    'FORM W-9 (VOLUNTARY RECANTATION)':
      'FORMULARIO W-9 (RETRACTACIÓN VOLUNTARIA)',
    'I, [WITNESS-1], of sound mind, hereby state:':
      'Yo, [WITNESS-1], en pleno uso de mis facultades mentales, declaro:',
    'On the afternoon of January 20, 1996, I reported':
      'En la tarde del 20 de enero de 1996, reporté haber',
    'seeing an unusual figure in the Jardim Andere':
      'visto una figura inusual en el barrio Jardim Andere',
    'neighborhood of Varginha.':
      'de Varginha.',
    'I now acknowledge that I was MISTAKEN.':
      'Ahora reconozco que estaba EQUIVOCADA.',
    'What I actually saw was a homeless individual,':
      'Lo que realmente vi fue un individuo indigente,',
    'possibly intoxicated or mentally disturbed.':
      'posiblemente intoxicado o con trastornos mentales.',
    'The unusual appearance was due to:':
      'La apariencia inusual se debió a:',
    '  - Poor lighting conditions':
      '  - Condiciones precarias de iluminación',
    '  - My own state of fear':
      '  - Mi propio estado de miedo',
    '  - Influence of recent media stories':
      '  - Influencia de reportajes recientes en los medios',
    'I deeply regret any confusion my initial report':
      'Lamento profundamente cualquier confusión que mi reporte inicial',
    'may have caused to authorities or the public.':
      'pueda haber causado a las autoridades o al público.',
    'I will not speak to journalists about this matter.':
      'No hablaré con periodistas sobre este asunto.',
    'I will not participate in any media interviews.':
      'No participaré en ninguna entrevista con medios.',
    'I will discourage my family from discussing this.':
      'Desalentaré a mi familia de discutir esto.',
    'This statement is given freely and voluntarily.':
      'Esta declaración se da libre y voluntariamente.',
    'Signature: [SIGNED]':
      'Firma: [FIRMADO]',
    'Date: 23-JAN-1996':
      'Fecha: 23-ENE-1996',
    'Witness: [REDACTED], Federal Agent':
      'Testigo: [SUPRIMIDO], Agente Federal',
    // ═══ expansionContent.ts — mudinho_dossier ═══
    'COVER STORY ASSET — CODENAME "MUDINHO"':
      'ACTIVO DE HISTORIA DE COBERTURA — NOMBRE CLAVE "MUDINHO"',
    'FILE: CS-96-001':
      'EXPEDIENTE: CS-96-001',
    'SUBJECT PROFILE:':
      'PERFIL DEL SUJETO:',
    '  Legal name: [REDACTED]':
      '  Nombre legal: [SUPRIMIDO]',
    '  Known as: "Mudinho" (local nickname)':
      '  Conocido como: "Mudinho" (apodo local)',
    '  Age: Approximately 35-40':
      '  Edad: Aproximadamente 35-40',
    '  Status: Mentally disabled':
      '  Estado: Discapacidad mental',
    '  Residence: Streets of Varginha (homeless)':
      '  Residencia: Calles de Varginha (indigente)',
    'PHYSICAL DESCRIPTION:':
      'DESCRIPCIÓN FÍSICA:',
    '  Height: 1.40m (unusually short)':
      '  Altura: 1,40m (inusualmente bajo)',
    '  Build: Thin, malnourished':
      '  Complexión: Delgado, desnutrido',
    '  Skin: Dark, weathered':
      '  Piel: Oscura, curtida',
    '  Distinguishing features:':
      '  Rasgos distintivos:',
    '    - Crouched posture':
      '    - Postura agachada',
    '    - Limited verbal communication':
      '    - Comunicación verbal limitada',
    '    - Often seen in Jardim Andere area':
      '    - Frecuentemente visto en el área de Jardim Andere',
    'COVER STORY DEPLOYMENT':
      'DESPLIEGUE DE HISTORIA DE COBERTURA',
    'NARRATIVE:':
      'NARRATIVA:',
    '  "The creature witnesses described was actually':
      '  "La criatura que los testigos describieron era en realidad',
    '   a local mentally disabled man known as Mudinho.':
      '   un hombre local con discapacidad mental conocido como Mudinho.',
    '   In the confusion and poor lighting, witnesses':
      '   En la confusión y la poca iluminación, los testigos',
    '   mistook him for something unusual."':
      '   lo confundieron con algo inusual."',
    'ADVANTAGES:':
      'VENTAJAS:',
    '  - Subject cannot contradict (non-verbal)':
      '  - El sujeto no puede contradecir (no verbal)',
    '  - Subject known to locals':
      '  - Sujeto conocido por los locales',
    '  - Physical characteristics loosely match':
      '  - Características físicas coinciden vagamente',
    '  - Explains crouching posture':
      '  - Explica la postura agachada',
    'DISADVANTAGES:':
      'DESVENTAJAS:',
    '  - Skin color does not match (brown vs. gray)':
      '  - Color de piel no coincide (marrón vs. gris)',
    '  - Does not explain "red eyes"':
      '  - No explica los "ojos rojos"',
    '  - Multiple witnesses unlikely to all misidentify':
      '  - Múltiples testigos improbable que todos identifiquen erróneamente',
    '  - Subject was NOT in Jardim Andere on 20-JAN':
      '  - El sujeto NO estaba en Jardim Andere el 20-ENE',
    'DEPLOYMENT STATUS: ACTIVE':
      'ESTADO DE DESPLIEGUE: ACTIVO',
    'MEDIA PLACEMENT:':
      'INSERCIÓN EN MEDIOS:',
    '  - Estado de Minas: Published 27-JAN':
      '  - Estado de Minas: Publicado 27-ENE',
    '  - Folha Paulista: Published 29-JAN':
      '  - Folha Paulista: Publicado 29-ENE',
    '  - Rede Nacional: Mentioned 28-JAN':
      '  - Rede Nacional: Mencionado 28-ENE',
    'EFFECTIVENESS ASSESSMENT:':
      'EVALUACIÓN DE EFICACIA:',
    '  Moderate. Provides plausible deniability but':
      '  Moderada. Provee negación plausible pero',
    '  does not withstand close scrutiny.':
      '  no resiste un escrutinio detallado.',
    'NOTE: Subject Mudinho was relocated to care facility':
      'NOTA: El sujeto Mudinho fue trasladado a una institución de cuidados',
    '      on 02-FEB to prevent journalist contact.':
      '      el 02-FEB para impedir contacto con periodistas.',
    // ═══ expansionContent.ts — alternative_explanations ═══
    'COVER STORY OPTIONS — VARGINHA INCIDENT':
      'OPCIONES DE HISTORIA DE COBERTURA — INCIDENTE VARGINHA',
    'COMPILED: 22-JAN-1996':
      'COMPILADO: 22-ENE-1996',
    'The following alternative explanations are approved':
      'Las siguientes explicaciones alternativas son aprobadas',
    'for deployment depending on audience and context:':
      'para despliegue según la audiencia y el contexto:',
    'OPTION A: WEATHER BALLOON':
      'OPCIÓN A: GLOBO METEOROLÓGICO',
    '  Use for: Aerial sighting reports':
      '  Usar para: Reportes de avistamientos aéreos',
    '  Narrative: "Meteorological equipment from INMET"':
      '  Narrativa: "Equipo meteorológico del INMET"',
    '  Strength: Classic, widely accepted':
      '  Fortaleza: Clásico, ampliamente aceptado',
    '  Weakness: Does not explain ground sightings':
      '  Debilidad: No explica avistamientos terrestres',
    '  Status: DEPLOYED for UFO reports':
      '  Estado: DESPLEGADO para reportes de OVNIs',
    'OPTION B: HOMELESS PERSON (MUDINHO)':
      'OPCIÓN B: INDIGENTE (MUDINHO)',
    '  Use for: Creature sightings':
      '  Usar para: Avistamientos de criaturas',
    '  Narrative: "Local mentally disabled man"':
      '  Narrativa: "Hombre local con discapacidad mental"',
    '  Strength: Explains humanoid shape':
      '  Fortaleza: Explica forma humanoide',
    '  Weakness: Contradicted by witness details':
      '  Debilidad: Contradecido por detalles de testigos',
    '  Status: PRIMARY for domestic media':
      '  Estado: PRIMARIO para medios nacionales',
    'OPTION C: ESCAPED ANIMAL':
      'OPCIÓN C: ANIMAL FUGADO',
    '  Use for: Secondary/backup':
      '  Usar para: Secundario/respaldo',
    '  Narrative: "Monkey or similar animal"':
      '  Narrativa: "Mono o animal similar"',
    '  Strength: Explains unusual appearance':
      '  Fortaleza: Explica apariencia inusual',
    '  Weakness: No zoo reported escape':
      '  Debilidad: Ninguna fuga reportada por el zoológico',
    '  Status: RESERVE':
      '  Estado: RESERVA',
    'OPTION D: MILITARY EXERCISE':
      'OPCIÓN D: EJERCICIO MILITAR',
    '  Use for: Troop/vehicle movements':
      '  Usar para: Movimientos de tropas/vehículos',
    '  Narrative: "Routine training exercise"':
      '  Narrativa: "Ejercicio de entrenamiento rutinario"',
    '  Strength: Explains military presence':
      '  Fortaleza: Explica presencia militar',
    '  Weakness: No exercise was scheduled':
      '  Debilidad: Ningún ejercicio estaba programado',
    '  Status: DEPLOYED for truck sightings':
      '  Estado: DESPLEGADO para avistamientos de camiones',
    'OPTION E: MASS HYSTERIA':
      'OPCIÓN E: HISTERIA COLECTIVA',
    '  Use for: Long-term discrediting':
      '  Usar para: Desacreditación a largo plazo',
    '  Narrative: "Community panic, suggestibility"':
      '  Narrativa: "Pánico comunitario, sugestionabilidad"',
    '  Strength: Undermines all witnesses':
      '  Fortaleza: Socava a todos los testigos',
    '  Weakness: Requires time to establish':
      '  Debilidad: Requiere tiempo para establecerse',
    '  Status: DEPLOYMENT IN PROGRESS':
      '  Estado: DESPLIEGUE EN CURSO',
    'OPTION F: PRANKSTERS/HOAX':
      'OPCIÓN F: BROMISTAS/ENGAÑO',
    '  Use for: Future fallback':
      '  Usar para: Recurso futuro',
    '  Narrative: "Local youths playing prank"':
      '  Narrativa: "Jóvenes locales haciendo bromas"',
    '  Strength: Simple explanation':
      '  Fortaleza: Explicación simple',
    '  Weakness: Requires "pranksters" to identify':
      '  Debilidad: Requiere identificar a los "bromistas"',
    '  Deploy multiple explanations simultaneously.':
      '  Desplegar múltiples explicaciones simultáneamente.',
    '  Confusion serves containment.':
      '  La confusión sirve a la contención.',
    // ═══ expansionContent.ts — media_talking_points ═══
    'MEDIA TALKING POINTS — VARGINHA INCIDENT':
      'PUNTOS DE COMUNICACIÓN — INCIDENTE VARGINHA',
    'FOR: All Authorized Spokespersons':
      'PARA: Todos los Voceros Autorizados',
    'DATE: 24-JAN-1996':
      'FECHA: 24-ENE-1996',
    'IF ASKED ABOUT CREATURE SIGHTINGS:':
      'SI SE PREGUNTA SOBRE AVISTAMIENTOS DE CRIATURAS:',
    '  "We have investigated these reports thoroughly.':
      '  "Hemos investigado estos reportes minuciosamente.',
    '   The sightings were of a local homeless individual':
      '   Los avistamientos fueron de un individuo indigente local',
    '   who is known to frequent that neighborhood.':
      '   que es conocido por frecuentar ese barrio.',
    '   There is nothing unusual to report."':
      '   No hay nada inusual que reportar."',
    'IF ASKED ABOUT MILITARY ACTIVITY:':
      'SI SE PREGUNTA SOBRE ACTIVIDAD MILITAR:',
    '  "The military vehicles observed were part of':
      '  "Los vehículos militares observados formaban parte de',
    '   routine logistical operations unrelated to':
      '   operaciones logísticas rutinarias sin relación con',
    '   any reported sightings. This is normal activity':
      '   ningún avistamiento reportado. Esta es actividad normal',
    '   for our regional command."':
      '   para nuestro comando regional."',
    'IF ASKED ABOUT HOSPITAL ACTIVITY:':
      'SI SE PREGUNTA SOBRE ACTIVIDAD HOSPITALARIA:',
    '  "Patient intake and emergency response are':
      '  "La admisión de pacientes y la respuesta de emergencia son',
    '   confidential medical matters. We cannot comment':
      '   asuntos médicos confidenciales. No podemos comentar',
    '   on any specific cases or rumors."':
      '   sobre casos específicos o rumores."',
    'IF ASKED ABOUT UFOS:':
      'SI SE PREGUNTA SOBRE OVNIs:',
    '  "There is no evidence of any unidentified aerial':
      '  "No hay evidencia de ningún fenómeno aéreo no identificado',
    '   phenomena in the Varginha area. Light anomalies':
      '   en el área de Varginha. Las anomalías luminosas',
    '   reported on January 19th were likely atmospheric':
      '   reportadas el 19 de enero fueron probablemente',
    '   reflections from agricultural equipment."':
      '   reflejos atmosféricos de equipo agrícola."',
    'IF ASKED ABOUT COVER-UP:':
      'SI SE PREGUNTA SOBRE ENCUBRIMIENTO:',
    '  "Suggestions of a cover-up are baseless conspiracy':
      '  "Las sugerencias de un encubrimiento son teorías conspirativas infundadas.',
    '   theories. The Brazilian Armed Forces operate with':
      '   Las Fuerzas Armadas Brasileñas operan con',
    '   full transparency within appropriate security':
      '   total transparencia dentro de los protocolos de seguridad',
    '   protocols. There is nothing to hide."':
      '   apropiados. No hay nada que ocultar."',
    'DO NOT:':
      'NO:',
    '  - Engage with specific witness accounts':
      '  - Involucrarse con testimonios específicos de testigos',
    '  - Confirm or deny classified information':
      '  - Confirmar o negar información clasificada',
    '  - Speculate about alternative explanations':
      '  - Especular sobre explicaciones alternativas',
    '  - Acknowledge the existence of any "investigation"':
      '  - Reconocer la existencia de ninguna "investigación"',
    // ═══ expansionContent.ts — animal_deaths_report ═══
    'INCIDENT REPORT — ZOOLÓGICO MUNICIPAL DE VARGINHA':
      'INFORME DE INCIDENTE — ZOOLÓGICO MUNICIPAL DE VARGINHA',
    'DATE: 28-JAN-1996':
      'FECHA: 28-ENE-1996',
    '  Multiple animal deaths at municipal zoo during':
      '  Múltiples muertes de animales en el zoológico municipal durante',
    '  period 22-JAN to 27-JAN 1996.':
      '  el período del 22-ENE al 27-ENE 1996.',
    'FATALITIES:':
      'FATALIDADES:',
    '  22-JAN 06:00 — TAPIR (Tapirus terrestris)':
      '  22-ENE 06:00 — TAPIR (Tapirus terrestris)',
    '    Age: 8 years':
      '    Edad: 8 años',
    '    Prior health: Excellent':
      '    Salud previa: Excelente',
    '    Symptoms: Found deceased, no visible trauma':
      '    Síntomas: Encontrado muerto, sin trauma visible',
    '    Necropsy: Internal hemorrhaging, organ failure':
      '    Necropsia: Hemorragia interna, fallo orgánico',
    '  24-JAN 14:00 — OCELOT (Leopardus pardalis)':
      '  24-ENE 14:00 — OCELOTE (Leopardus pardalis)',
    '    Age: 5 years':
      '    Edad: 5 años',
    '    Prior health: Good':
      '    Salud previa: Buena',
    '    Symptoms: Seizures, rapid decline':
      '    Síntomas: Convulsiones, deterioro rápido',
    '    Necropsy: Neurological damage, cause unknown':
      '    Necropsia: Daño neurológico, causa desconocida',
    '  25-JAN 08:30 — DEER (Mazama americana)':
      '  25-ENE 08:30 — VENADO (Mazama americana)',
    '    Age: 3 years':
      '    Edad: 3 años',
    '    Symptoms: Extreme agitation, then collapse':
      '    Síntomas: Agitación extrema, luego colapso',
    '    Necropsy: Cardiac arrest, elevated cortisol':
      '    Necropsia: Paro cardíaco, cortisol elevado',
    '  27-JAN 03:00 — CAPYBARA (Hydrochoerus hydrochaeris)':
      '  27-ENE 03:00 — CAPIBARA (Hydrochoerus hydrochaeris)',
    '    Age: 6 years':
      '    Edad: 6 años',
    '    Symptoms: Refused food, tremors':
      '    Síntomas: Rechazó alimento, temblores',
    '    Necropsy: Multi-organ failure':
      '    Necropsia: Fallo multiorgánico',
    'VETERINARIAN ASSESSMENT (Dr. Ana FERREIRA):':
      'EVALUACIÓN VETERINARIA (Dra. Ana FERREIRA):',
    '  "These deaths are unprecedented. The animals showed':
      '  "Estas muertes son sin precedentes. Los animales no mostraron',
    '   no prior illness. The pattern suggests exposure to':
      '   enfermedad previa. El patrón sugiere exposición a',
    '   an unknown pathogen or toxin. The proximity of':
      '   un patógeno o toxina desconocida. La proximidad de las',
    '   deaths to the reported incident on 20-JAN cannot':
      '   muertes al incidente reportado el 20-ENE no puede',
    '   be coincidental."':
      '   ser coincidencia."',
    'OPERATIONAL NOTE:':
      'NOTA OPERACIONAL:',
    '  Animals were housed in enclosures adjacent to':
      '  Los animales estaban alojados en recintos adyacentes al',
    '  the TEMPORARY HOLDING area used 20-21 JAN.':
      '  área de CONTENCIÓN TEMPORAL usada el 20-21 ENE.',
    '  Possible contamination from "fauna specimen"':
      '  Posible contaminación del espécimen de "fauna"',
    '  containment breach. Investigation ongoing.':
      '  por falla de contención. Investigación en curso.',
    // ═══ expansionContent.ts — veterinarian_silencing ═══
    'CONTAINMENT ACTION — ZOO VETERINARIAN':
      'ACCIÓN DE CONTENCIÓN — VETERINARIA DEL ZOOLÓGICO',
    'DATE: 30-JAN-1996':
      'FECHA: 30-ENE-1996',
    'SUBJECT: Dr. Ana FERREIRA':
      'SUJETO: Dra. Ana FERREIRA',
    'Position: Chief Veterinarian, Zoológico Municipal':
      'Cargo: Veterinaria Jefe, Zoológico Municipal',
    'Threat level: MODERATE':
      'Nivel de amenaza: MODERADO',
    '  Dr. Ferreira has made connection between animal':
      '  La Dra. Ferreira ha hecho conexión entre las muertes',
    '  deaths and classified incident. Has documented':
      '  de animales y el incidente clasificado. Ha documentado',
    '  anomalous necropsy findings. Seeking external':
      '  hallazgos anómalos de necropsia. Buscando',
    '  consultation.':
      '  consulta externa.',
    'ACTIONS TAKEN:':
      'ACCIONES TOMADAS:',
    '  25-JAN: Initial contact (Protocol SOMBRA)':
      '  25-ENE: Contacto inicial (Protocolo SOMBRA)',
    '    Outcome: PARTIALLY COOPERATIVE':
      '    Resultado: PARCIALMENTE COOPERATIVO',
    '    Agreed to delay external consultation':
      '    Aceptó retrasar consulta externa',
    '  28-JAN: Necropsy samples CONFISCATED':
      '  28-ENE: Muestras de necropsia CONFISCADAS',
    '    Cover: "Public health authority directive"':
      '    Cobertura: "Directiva de la autoridad de salud pública"',
    '    Note: Samples transferred to secure facility':
      '    Nota: Muestras transferidas a instalación segura',
    '  29-JAN: Administrative pressure applied':
      '  29-ENE: Presión administrativa aplicada',
    '    Zoo director instructed to reassign subject':
      '    Director del zoológico instruido a reasignar sujeto',
    '    "Extended leave" suggested':
      '    "Licencia prolongada" sugerida',
    '  30-JAN: Follow-up visit (COBRA team)':
      '  30-ENE: Visita de seguimiento (equipo COBRA)',
    '    Duration: 2 hours':
      '    Duración: 2 horas',
    '    Outcome: FULLY COOPERATIVE':
      '    Resultado: TOTALMENTE COOPERATIVO',
    '    Signed: NDA, statement attributing deaths to':
      '    Firmó: Acuerdo de confidencialidad, declaración atribuyendo muertes a',
    '            "contaminated feed shipment"':
      '            "cargamento de alimento contaminado"',
    'CURRENT STATUS:':
      'ESTADO ACTUAL:',
    '  Subject on administrative leave':
      '  Sujeto en licencia administrativa',
    '  No media contact authorized':
      '  Ningún contacto con medios autorizado',
    '  Monitoring: 90 days':
      '  Monitoreo: 90 días',
    'ADDITIONAL MEASURE:':
      'MEDIDA ADICIONAL:',
    '  Subject\\\'s husband works at state university':
      '  El esposo del sujeto trabaja en la universidad estatal',
    '  Employment pressure available if needed':
      '  Presión laboral disponible si es necesaria',
    // ═══ expansionContent.ts — contamination_theory ═══
    'OFFICIAL EXPLANATION — ZOO ANIMAL DEATHS':
      'EXPLICACIÓN OFICIAL — MUERTES DE ANIMALES DEL ZOOLÓGICO',
    'FOR: Public Release / Media Inquiry':
      'PARA: Divulgación Pública / Consulta de Medios',
    'DATE: 01-FEB-1996':
      'FECHA: 01-FEB-1996',
    'PRESS STATEMENT:':
      'COMUNICADO DE PRENSA:',
    '  "The Varginha Municipal Zoo regrets to announce':
      '  "El Zoológico Municipal de Varginha lamenta anunciar',
    '   the loss of four animals during the last week':
      '   la pérdida de cuatro animales durante la última semana',
    '   of January 1996.':
      '   de enero de 1996.',
    '   Investigation has determined that the cause was':
      '   La investigación determinó que la causa fue',
    '   a contaminated shipment of animal feed received':
      '   un cargamento contaminado de alimento para animales recibido',
    '   on January 18th.':
      '   el 18 de enero.',
    '   The contamination has been traced to improper':
      '   La contaminación fue rastreada hasta almacenamiento',
    '   storage at the supplier facility. All remaining':
      '   inadecuado en las instalaciones del proveedor. Todo el alimento',
    '   feed from this shipment has been destroyed.':
      '   restante de este cargamento ha sido destruido.',
    '   The zoo has taken steps to prevent future':
      '   El zoológico ha tomado medidas para prevenir futuros',
    '   incidents. New supplier verification protocols':
      '   incidentes. Nuevos protocolos de verificación de proveedores',
    '   are being implemented.':
      '   están siendo implementados.',
    '   We appreciate the community\\\'s understanding."':
      '   Agradecemos la comprensión de la comunidad."',
    'INTERNAL NOTE (DO NOT RELEASE):':
      'NOTA INTERNA (NO DIVULGAR):',
    '  This explanation is for public consumption only.':
      '  Esta explicación es solo para consumo público.',
    '  Feed shipment records have been altered to support.':
      '  Los registros de cargamento de alimento fueron alterados para corroborar.',
    '  Supplier has been compensated for cooperation.':
      '  El proveedor fue compensado por su cooperación.',
    '  Actual cause: Proximity contamination from':
      '  Causa real: Contaminación por proximidad del',
    '  temporary holding of recovered fauna specimen.':
      '  confinamiento temporal del espécimen de fauna recuperado.',
    '  See: /ops/zoo/animal_deaths_report.txt':
      '  Ver: /ops/zoo/animal_deaths_report.txt',
    // ═══ expansionContent.ts — chereze_incident_report ═══
    'INCIDENT REPORT — OFFICER [CLASSIFIED]':
      'INFORME DE INCIDENTE — OFICIAL [CLASIFICADO]',
    'CLASSIFICATION: TOP SECRET':
      'CLASIFICACIÓN: ULTRA SECRETO',
    'FILE: VAR-96-MED-007':
      'EXPEDIENTE: VAR-96-MED-007',
    'SUBJECT: [CLASSIFIED], Corporal':
      'SUJETO: [CLASIFICADO], Cabo',
    'Rank: Corporal, Military Police':
      'Rango: Cabo, Policía Militar',
    'Unit: 4th Company, Varginha':
      'Unidad: 4ª Compañía, Varginha',
    'Status: DECEASED (15-FEB-1996)':
      'Estado: FALLECIDO (15-FEB-1996)',
    'TIMELINE OF EVENTS:':
      'CRONOLOGÍA DE EVENTOS:',
    '20-JAN 21:30':
      '20-ENE 21:30',
    '  The officer responds to call regarding':
      '  El oficial responde a llamado referente a',
    '  "strange animal" in Jardim Andere area.':
      '  "animal extraño" en el área de Jardim Andere.',
    '  Arrives at scene, assists with containment.':
      '  Llega a la escena, asiste con la contención.',
    '20-JAN 22:15':
      '20-ENE 22:15',
    '  Officer makes direct physical contact with':
      '  El oficial hace contacto físico directo con',
    '  fauna specimen during loading operation.':
      '  espécimen de fauna durante operación de carga.',
    '  Contact area: Left forearm, bare skin.':
      '  Área de contacto: Antebrazo izquierdo, piel expuesta.',
    '  Duration: Approximately 3-4 seconds.':
      '  Duración: Aproximadamente 3-4 segundos.',
    '21-JAN 08:00':
      '21-ENE 08:00',
    '  Officer reports to duty, notes mild fatigue.':
      '  El oficial se presenta al servicio, nota fatiga leve.',
    '  Attributes to late shift previous night.':
      '  Lo atribuye al turno tardío de la noche anterior.',
    '23-JAN':
      '23-ENE',
    '  Officer complains of headaches, joint pain.':
      '  El oficial se queja de dolores de cabeza, dolor articular.',
    '  Skin irritation noted at contact site.':
      '  Irritación cutánea observada en el sitio de contacto.',
    '  Reports "strange dreams."':
      '  Reporta "sueños extraños."',
    '27-JAN':
      '27-ENE',
    '  Officer hospitalized with fever, weakness.':
      '  Oficial hospitalizado con fiebre, debilidad.',
    '  Diagnosis: "Unknown infection"':
      '  Diagnóstico: "Infección desconocida"',
    '  Blood work shows anomalous markers.':
      '  Los análisis de sangre muestran marcadores anómalos.',
    '02-FEB':
      '02-FEB',
    '  Condition deteriorates rapidly.':
      '  La condición se deteriora rápidamente.',
    '  Multiple organ systems affected.':
      '  Múltiples sistemas orgánicos afectados.',
    '  Transfer to military hospital (São Paulo).':
      '  Transferencia a hospital militar (São Paulo).',
    '15-FEB 03:47':
      '15-FEB 03:47',
    '  The officer expires.':
      '  El oficial fallece.',
    '  Official cause: "Pneumonia complications"':
      '  Causa oficial: "Complicaciones de neumonía"',
    'MEDICAL NOTES (SUPPRESSED):':
      'NOTAS MÉDICAS (SUPRIMIDAS):',
    '  Attending physician noted:':
      '  El médico tratante observó:',
    '  - Tissue necrosis at contact site':
      '  - Necrosis tisular en el sitio de contacto',
    '  - Unprecedented immune system collapse':
      '  - Colapso inmunológico sin precedentes',
    '  - Unidentifiable pathogen in blood samples':
      '  - Patógeno no identificable en muestras de sangre',
    '  - Brain scans showed unusual activity patterns':
      '  - Escaneos cerebrales mostraron patrones de actividad inusuales',
    '  Physician quote (recorded):':
      '  Cita del médico (grabada):',
    '  "I have never seen anything like this.':
      '  "Nunca he visto nada parecido a esto.',
    '   This is not any known disease."':
      '   Esto no es ninguna enfermedad conocida."',
    'CONTAINMENT ACTIONS:':
      'ACCIONES DE CONTENCIÓN:',
    '  - Medical records CLASSIFIED':
      '  - Registros médicos CLASIFICADOS',
    '  - Attending physician reassigned':
      '  - Médico tratante reasignado',
    '  - Blood samples transferred to [REDACTED]':
      '  - Muestras de sangre transferidas a [SUPRIMIDO]',
    '  - Family briefed on "pneumonia" cause':
      '  - Familia informada sobre causa "neumonía"',
    '  - Compensation package arranged':
      '  - Paquete de compensación preparado',
    // ═══ expansionContent.ts — autopsy_suppression ═══
    'DIRECTIVE — AUTOPSY SUPPRESSION':
      'DIRECTIVA — SUPRESIÓN DE AUTOPSIA',
    'DATE: 16-FEB-1996':
      'FECHA: 16-FEB-1996',
    'RE: Remains of the deceased corporal':
      'REF: Restos del cabo fallecido',
    'Per authority of [REDACTED], the following directive':
      'Por autoridad de [SUPRIMIDO], la siguiente directiva',
    'is IMMEDIATELY effective:':
      'es INMEDIATAMENTE efectiva:',
    '1. Standard autopsy procedure is CANCELLED.':
      '1. El procedimiento estándar de autopsia está CANCELADO.',
    '2. A modified examination will be conducted by':
      '2. Un examen modificado será conducido por',
    '   cleared personnel from Project HARVEST only.':
      '   personal autorizado únicamente del Proyecto HARVEST.',
    '3. All tissue samples are classified and must be':
      '3. Todas las muestras de tejido son clasificadas y deben ser',
    '   transferred to [REDACTED] facility.':
      '   transferidas a la instalación [SUPRIMIDA].',
    '4. The official autopsy report will state:':
      '4. El informe oficial de autopsia declarará:',
    '   "Cause of death: Respiratory failure':
      '   "Causa de muerte: Insuficiencia respiratoria',
    '    secondary to pneumonia complications."':
      '    secundaria a complicaciones de neumonía."',
    '5. No copy of actual findings will be retained':
      '5. Ninguna copia de los hallazgos reales será retenida',
    '   at the hospital or municipal morgue.':
      '   en el hospital o la morgue municipal.',
    'JUSTIFICATION:':
      'JUSTIFICACIÓN:',
    '  Subject\\\'s exposure to recovered fauna specimen':
      '  La exposición del sujeto al espécimen de fauna recuperado',
    '  resulted in contamination of unknown nature.':
      '  resultó en contaminación de naturaleza desconocida.',
    '  Pathological findings could compromise ongoing':
      '  Los hallazgos patológicos podrían comprometer operaciones',
    '  containment operations if disclosed.':
      '  de contención en curso si se divulgan.',
    '  The anomalous pathogen must be studied under':
      '  El patógeno anómalo debe ser estudiado bajo',
    '  controlled conditions only.':
      '  condiciones controladas únicamente.',
    'SECURITY NOTE:':
      'NOTA DE SEGURIDAD:',
    '  Any medical personnel who observed actual condition':
      '  Cualquier personal médico que observó la condición real',
    '  of the deceased are to be debriefed immediately':
      '  del fallecido debe ser interrogado inmediatamente',
    '  under Protocol SOMBRA.':
      '  bajo el Protocolo SOMBRA.',
    '  NDA signatures required from all parties.':
      '  Firmas de acuerdo de confidencialidad requeridas de todas las partes.',
    // ═══ expansionContent.ts — family_compensation ═══
    'COMPENSATION ARRANGEMENT — OFFICER\'S FAMILY':
      'ACUERDO DE COMPENSACIÓN — FAMILIA DEL OFICIAL',
    'DATE: 20-FEB-1996':
      'FECHA: 20-FEB-1996',
    'BENEFICIARIES:':
      'BENEFICIARIOS:',
    '  Wife: [REDACTED]':
      '  Esposa: [SUPRIMIDO]',
    '  Children: 2 (ages 7 and 4)':
      '  Hijos: 2 (edades 7 y 4)',
    'OFFICIAL BENEFITS (Standard):':
      'BENEFICIOS OFICIALES (Estándar):',
    '  - Death in service pension':
      '  - Pensión por muerte en servicio',
    '  - Life insurance payout':
      '  - Pago de seguro de vida',
    '  - Educational benefits for children':
      '  - Beneficios educativos para los hijos',
    '  Total official: R$ 45,000.00':
      '  Total oficial: R$ 45.000,00',
    'SUPPLEMENTAL COMPENSATION (Classified):':
      'COMPENSACIÓN SUPLEMENTARIA (Clasificada):',
    '  Purpose: Ensure family silence regarding':
      '  Propósito: Asegurar el silencio de la familia respecto a',
    '           circumstances of death.':
      '           las circunstancias de la muerte.',
    '  Initial payment: R$ 50,000.00 (cash)':
      '  Pago inicial: R$ 50.000,00 (en efectivo)',
    '  Monthly stipend: R$ 2,000.00 (5 years)':
      '  Estipendio mensual: R$ 2.000,00 (5 años)',
    '  Housing: Apartment (paid, Belo Horizonte)':
      '  Vivienda: Apartamento (pagado, Belo Horizonte)',
    '  Employment: Government position for wife':
      '  Empleo: Cargo gubernamental para la esposa',
    '  Total supplemental: ~R$ 220,000.00':
      '  Total suplementario: ~R$ 220.000,00',
    'CONDITIONS:':
      'CONDICIONES:',
    '  - Family agrees to "pneumonia" narrative':
      '  - Familia acepta la narrativa de "neumonía"',
    '  - No media interviews (ever)':
      '  - Ninguna entrevista con medios (nunca)',
    '  - No legal action against government':
      '  - Ninguna acción legal contra el gobierno',
    '  - Relocation from Varginha (within 30 days)':
      '  - Reubicación de Varginha (dentro de 30 días)',
    '  - No contact with UFO investigators':
      '  - Ningún contacto con investigadores de OVNIs',
    '  Signed: [WIFE OF OFFICER], 20-FEB-1996':
      '  Firmado: [ESPOSA DEL OFICIAL], 20-FEB-1996',
    'NOTE: Family moved to Belo Horizonte 15-MAR-1996':
      'NOTA: Familia se mudó a Belo Horizonte 15-MAR-1996',
    '      Monitoring: Low priority (cooperative)':
      '      Monitoreo: Baja prioridad (cooperativa)',
    // ═══ expansionContent.ts — coffee_harvest_report ═══
    'REGIONAL ECONOMIC REPORT — COFFEE SECTOR':
      'INFORME ECONÓMICO REGIONAL — SECTOR CAFETERO',
    'PERIOD: Q1 1996':
      'PERÍODO: T1 1996',
    'REGION: Sul de Minas':
      'REGIÓN: Sul de Minas',
    'MARKET CONDITIONS:':
      'CONDICIONES DEL MERCADO:',
    '  The Sul de Minas coffee region continues to be':
      '  La región cafetera de Sul de Minas continúa siendo',
    '  Brazil\\\'s premier arabica production zone.':
      '  la principal zona de producción de arábica de Brasil.',
    '  Current harvest: PROGRESSING NORMALLY':
      '  Cosecha actual: PROGRESANDO NORMALMENTE',
    '  Expected yield: 2.3 million bags':
      '  Rendimiento esperado: 2,3 millones de sacos',
    '  Quality assessment: ABOVE AVERAGE':
      '  Evaluación de calidad: POR ENCIMA DEL PROMEDIO',
    'PRICE INDICATORS:':
      'INDICADORES DE PRECIO:',
    '  NYC Commodity Exchange: $1.42/lb (Jan avg)':
      '  Bolsa de Commodities de NYC: $1,42/lb (prom. Ene)',
    '  Local cooperative price: R$ 85.00/bag':
      '  Precio de la cooperativa local: R$ 85,00/saco',
    '  Trend: STABLE with slight upward pressure':
      '  Tendencia: ESTABLE con ligera presión al alza',
    'REGIONAL NOTES:':
      'NOTAS REGIONALES:',
    '  - Varginha remains the region\\\'s logistics hub':
      '  - Varginha sigue siendo el centro logístico de la región',
    '  - Railroad capacity adequate for current volume':
      '  - Capacidad ferroviaria adecuada para el volumen actual',
    '  - Export documentation processing normal':
      '  - Procesamiento de documentación de exportación normal',
    'LABOR:':
      'MANO DE OBRA:',
    '  - Seasonal workers arriving as expected':
      '  - Trabajadores temporales llegando según lo esperado',
    '  - No significant disputes reported':
      '  - Ninguna disputa significativa reportada',
    'ASSESSMENT:':
      'EVALUACIÓN:',
    '  Coffee sector operation NORMAL.':
      '  Operación del sector cafetero NORMAL.',
    '  No economic anomalies detected.':
      '  Ninguna anomalía económica detectada.',
    // ═══ expansionContent.ts — weather_report_jan96 ═══
    'METEOROLOGICAL SUMMARY — JANUARY 1996':
      'RESUMEN METEOROLÓGICO — ENERO 1996',
    'STATION: Varginha Regional':
      'ESTACIÓN: Varginha Regional',
    'COORDINATES: 21°33\'S, 45°26\'W':
      'COORDENADAS: 21°33\'S, 45°26\'O',
    '  January 1996 exhibited typical summer patterns':
      '  Enero de 1996 presentó patrones típicos de verano',
    '  for the Sul de Minas region.':
      '  para la región de Sul de Minas.',
    'KEY DATES:':
      'FECHAS CLAVE:',
    '  19-JAN-1996:':
      '  19-ENE-1996:',
    '    Temperature: 28°C (max) / 18°C (min)':
      '    Temperatura: 28°C (máx) / 18°C (mín)',
    '    Precipitation: 12mm':
      '    Precipitación: 12mm',
    '    Cloud cover: Partial (40%)':
      '    Cobertura nubosa: Parcial (40%)',
    '    Wind: NE, 15-20 km/h':
      '    Viento: NE, 15-20 km/h',
    '    SPECIAL: Clear sky after 22:00':
      '    ESPECIAL: Cielo despejado después de las 22:00',
    '  20-JAN-1996:':
      '  20-ENE-1996:',
    '    Temperature: 31°C (max) / 19°C (min)':
      '    Temperatura: 31°C (máx) / 19°C (mín)',
    '    Precipitation: 0mm':
      '    Precipitación: 0mm',
    '    Cloud cover: Minimal (15%)':
      '    Cobertura nubosa: Mínima (15%)',
    '    Wind: Calm':
      '    Viento: Calmo',
    '    SPECIAL: Excellent visibility':
      '    ESPECIAL: Excelente visibilidad',
    '  21-JAN-1996:':
      '  21-ENE-1996:',
    '    Temperature: 29°C (max) / 17°C (min)':
      '    Temperatura: 29°C (máx) / 17°C (mín)',
    '    Precipitation: 8mm (evening)':
      '    Precipitación: 8mm (noche)',
    '    Cloud cover: Building afternoon':
      '    Cobertura nubosa: Acumulándose por la tarde',
    '    Wind: Variable':
      '    Viento: Variable',
    'NOTE: No unusual atmospheric phenomena recorded.':
      'NOTA: Ningún fenómeno atmosférico inusual registrado.',
    '      Standard summer conditions for region.':
      '      Condiciones estándar de verano para la región.',
    // ═══ expansionContent.ts — local_politics_memo ═══
    'POLITICAL SUMMARY — VARGINHA MUNICIPALITY':
      'RESUMEN POLÍTICO — MUNICIPIO DE VARGINHA',
    'DATE: 15-JAN-1996':
      'FECHA: 15-ENE-1996',
    'ROUTINE ASSESSMENT':
      'EVALUACIÓN DE RUTINA',
    'CURRENT ADMINISTRATION:':
      'ADMINISTRACIÓN ACTUAL:',
    '  Mayor: [REDACTED]':
      '  Alcalde: [SUPRIMIDO]',
    '  Party: PMDB':
      '  Partido: PMDB',
    '  Term: 1993-1996 (final year)':
      '  Período: 1993-1996 (último año)',
    'POLITICAL CLIMATE:':
      'CLIMA POLÍTICO:',
    '  - Municipal elections scheduled October 1996':
      '  - Elecciones municipales programadas para octubre de 1996',
    '  - Current administration approval: MODERATE':
      '  - Aprobación de la administración actual: MODERADA',
    '  - No significant controversies':
      '  - Ninguna controversia significativa',
    'NOTABLE DEVELOPMENTS:':
      'DESARROLLOS NOTABLES:',
    '  - Infrastructure projects on schedule':
      '  - Proyectos de infraestructura en cronograma',
    '  - Coffee cooperative relations stable':
      '  - Relaciones con la cooperativa cafetera estables',
    '  - Hospital expansion approved':
      '  - Expansión del hospital aprobada',
    '  - School enrollment increasing':
      '  - Matrículas escolares en aumento',
    'SECURITY CONCERNS:':
      'PREOCUPACIONES DE SEGURIDAD:',
    '  - Petty crime: Within normal parameters':
      '  - Delincuencia menor: Dentro de los parámetros normales',
    '  - Organized crime: No presence detected':
      '  - Crimen organizado: Ninguna presencia detectada',
    '  - Labor unrest: None':
      '  - Conflictos laborales: Ninguno',
    '  Politically stable region.':
      '  Región políticamente estable.',
    '  No monitoring priority.':
      '  Sin prioridad de monitoreo.',
    // ═══ expansionContent.ts — municipal_budget_96 ═══
    'MUNICIPAL BUDGET ALLOCATION — 1996':
      'ASIGNACIÓN PRESUPUESTARIA MUNICIPAL — 1996',
    'VARGINHA PREFECTURE':
      'PREFECTURA DE VARGINHA',
    'PROJECTED REVENUE: R$ 42,500,000.00':
      'INGRESOS PROYECTADOS: R$ 42.500.000,00',
    'ALLOCATION BY SECTOR:':
      'ASIGNACIÓN POR SECTOR:',
    '  Education ................ 28% (R$ 11,900,000)':
      '  Educación ................. 28% (R$ 11.900.000)',
    '  Health ................... 22% (R$  9,350,000)':
      '  Salud ..................... 22% (R$  9.350.000)',
    '  Infrastructure ........... 18% (R$  7,650,000)':
      '  Infraestructura .......... 18% (R$  7.650.000)',
    '  Public Safety ............ 12% (R$  5,100,000)':
      '  Seguridad Pública ........ 12% (R$  5.100.000)',
    '  Administration ........... 10% (R$  4,250,000)':
      '  Administración ........... 10% (R$  4.250.000)',
    '  Culture & Sports .........  5% (R$  2,125,000)':
      '  Cultura y Deportes .......  5% (R$  2.125.000)',
    '  Reserve ..................  5% (R$  2,125,000)':
      '  Reserva ..................  5% (R$  2.125.000)',
    'SPECIAL PROJECTS:':
      'PROYECTOS ESPECIALES:',
    '  - Hospital wing expansion (Phase 2)':
      '  - Expansión del ala hospitalaria (Fase 2)',
    '  - School renovation program':
      '  - Programa de renovación escolar',
    '  - Road maintenance (Rte. 381)':
      '  - Mantenimiento vial (Ruta 381)',
    '  - Municipal zoo improvements':
      '  - Mejoras del zoológico municipal',
    'STATUS: Approved by City Council, 18-DEC-1995':
      'ESTADO: Aprobado por el Concejo Municipal, 18-DIC-1995',
    // ═══ expansionContent.ts — railroad_schedule ═══
    'RAILROAD TRAFFIC — VARGINHA STATION':
      'TRÁFICO FERROVIARIO — ESTACIÓN VARGINHA',
    'SCHEDULE: JANUARY 1996':
      'HORARIOS: ENERO 1996',
    'REGULAR FREIGHT SERVICE:':
      'SERVICIO REGULAR DE CARGA:',
    '  Mon-Fri 06:00 — Coffee cargo (southbound)':
      '  Lun-Vie 06:00 — Carga de café (dirección sur)',
    '  Mon-Fri 14:00 — Industrial goods (northbound)':
      '  Lun-Vie 14:00 — Bienes industriales (dirección norte)',
    '  Tue-Thu 22:00 — Overnight freight':
      '  Mar-Jue 22:00 — Carga nocturna',
    'SPECIAL MOVEMENTS:':
      'MOVIMIENTOS ESPECIALES:',
    '  20-JAN 03:30 — MILITARY (classified)':
      '  20-ENE 03:30 — MILITAR (clasificado)',
    '                 Authorization: Regional Command':
      '                 Autorización: Comando Regional',
    '                 Cars: 3 (covered freight)':
      '                 Vagones: 3 (carga cubierta)',
    '                 Destination: Campinas':
      '                 Destino: Campinas',
    '  21-JAN 01:15 — MILITARY (classified)':
      '  21-ENE 01:15 — MILITAR (clasificado)',
    '                 Cars: 1 (refrigerated)':
      '                 Vagones: 1 (refrigerado)',
    '                 Destination: São Paulo':
      '                 Destino: São Paulo',
    'NOTE: Military movements not subject to':
      'NOTA: Movimientos militares no sujetos a',
    '      standard scheduling protocols.':
      '      protocolos de programación estándar.',
    // ═══ expansionContent.ts — fire_department_log ═══
    'FIRE DEPARTMENT — INCIDENT LOG':
      'CUERPO DE BOMBEROS — REGISTRO DE INCIDENTES',
    'STATION: Varginha Central':
      'ESTACIÓN: Varginha Central',
    'PERIOD: 15-25 JAN 1996':
      'PERÍODO: 15-25 ENE 1996',
    '15-JAN 14:22 — Grass fire, Rte. 381 km 42':
      '15-ENE 14:22 — Incendio de pastizal, Ruta 381 km 42',
    '               Cause: Cigarette':
      '               Causa: Cigarrillo',
    '               Resolved: 15:45':
      '               Resuelto: 15:45',
    '17-JAN 09:15 — Smoke alarm, Hospital Regional':
      '17-ENE 09:15 — Alarma de humo, Hospital Regional',
    '               Cause: Electrical short':
      '               Causa: Cortocircuito',
    '               Resolved: 10:00':
      '               Resuelto: 10:00',
    '18-JAN 21:30 — Vehicle fire, downtown':
      '18-ENE 21:30 — Incendio vehicular, centro',
    '               Cause: Engine failure':
      '               Causa: Falla del motor',
    '               Resolved: 22:15':
      '               Resuelto: 22:15',
    '20-JAN 16:45 — [REDACTED]':
      '20-ENE 16:45 — [SUPRIMIDO]',
    '               Location: Jardim Andere':
      '               Ubicación: Jardim Andere',
    '               Authorization: Military Police':
      '               Autorización: Policía Militar',
    '               Resolved: [CLASSIFIED]':
      '               Resuelto: [CLASIFICADO]',
    '20-JAN 23:00 — [REDACTED]':
      '20-ENE 23:00 — [SUPRIMIDO]',
    '               Location: [CLASSIFIED]':
      '               Ubicación: [CLASIFICADO]',
    '               Authorization: Regional Command':
      '               Autorización: Comando Regional',
    '22-JAN 11:30 — Kitchen fire, residential':
      '22-ENE 11:30 — Incendio de cocina, residencial',
    '               Cause: Cooking oil':
      '               Causa: Aceite de cocina',
    '               Resolved: 11:50':
      '               Resuelto: 11:50',
    '24-JAN 16:00 — False alarm, school':
      '24-ENE 16:00 — Falsa alarma, escuela',
    '               Cause: Student prank':
      '               Causa: Broma de estudiante',
    '               Resolved: 16:15':
      '               Resuelto: 16:15',
  }
};
