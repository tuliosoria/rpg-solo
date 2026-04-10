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
    'Uncover all 5 truth categories': 'Revele as 5 categorias da verdade',
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
    'Release Prisoner 46 from containment': 'Liberte o Prisioneiro 46 da contenção',
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
    'Release Prisoner 46 and prove aliens exist': 'Liberte o Prisioneiro 46 e prove que alienígenas existem',
    'Total Collapse': 'Colapso Total',
    'Release Prisoner 46 and leak conspiracies': 'Liberte o Prisioneiro 46 e vaze conspirações',
    'Personal Contamination': 'Contaminação Pessoal',
    'Use the neural link and feel the alien presence': 'Use o link neural e sinta a presença alienígena',
    'Paranoid Awakening': 'Despertar Paranoico',
    'Leak conspiracies while neurally linked': 'Vaze conspirações enquanto conectado neuralmente',
    'Witnessed Truth': 'Verdade Testemunhada',
    'Release Prisoner 46 while neurally linked': 'Liberte o Prisioneiro 46 enquanto conectado neuralmente',

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
    '[UFO74]: And you only get 8 attempts.':
      '[UFO74]: E você só tem 8 tentativas.',
    '[UFO74]: Fail 8 times, the window closes. Permanently.':
      '[UFO74]: Se falhar 8 vezes, a janela fecha. Permanentemente.',
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
    'UFO74: youre in. keep it quiet.':
      'UFO74: você entrou. mantenha discrição.',
    'UFO74: quick brief. you cant change anything here — read only.':
      'UFO74: resumo rápido. você não pode mudar nada aqui — só leitura.',
    'UFO74: type "ls" to see whats in front of you.':
      'UFO74: digite "ls" para ver o que tem na sua frente.',
    'UFO74: type "cd <folder>" to go inside. "open <file>" to read.':
      'UFO74: digite "cd <pasta>" para entrar. "open <arquivo>" para ler.',
    'UFO74: when this channel closes, start with: ls':
      'UFO74: quando este canal fechar, comece com: ls',
    'UFO74: try internal/ first. routine paperwork. low heat.':
      'UFO74: tente internal/ primeiro. papelada de rotina. risco baixo.',
    'UFO74: youll see an evidence tracker. it lights up when you prove something.':
      'UFO74: você vai ver um rastreador de evidências. ele acende quando você prova algo.',
    'UFO74: risk meter climbs as you dig. if it spikes, they test you. fail that, youre out.':
      'UFO74: o medidor de risco sobe conforme você cava. se disparar, eles te testam. falhou, acabou.',
    'UFO74: im cutting the link. from here, youre on your own.':
      'UFO74: vou cortar o link. daqui pra frente, você está por conta própria.',
    'move slow. read everything. the truth is in the details.':
      'vá devagar. leia tudo. a verdade está nos detalhes.',
    '>> CONNECTION IDLE <<':
      '>> CONEXÃO OCIOSA <<',
    'Type "help" for commands. "help basics" if youre new.':
      'Digite "help" para ver os comandos. "help basics" se for iniciante.',
    'UFO74: new here? type "help basics".':
      'UFO74: é novo por aqui? digite "help basics".',
    '║  💡 TUTORIAL TIP                          ║':
      '║  💡 DICA DE TUTORIAL                      ║',
    'You found evidence!':
      'Você encontrou uma evidência!',
    'Keep searching for more files.':
      'Continue procurando por mais arquivos.',
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
    'progress        See your evidence status':
      'progress        Mostra o status das evidências',
    'map             Visualize evidence connections':
      'map             Visualiza conexões de evidências',
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
    'HOW TO FIND EVIDENCE:':
      'COMO ENCONTRAR EVIDÊNCIAS:',
    '1. Navigate directories with ls, cd':
      '1. Navegue pelos diretórios com ls, cd',
    '2. Read files with open <filename>':
      '2. Leia arquivos com open <filename>',
    '3. Decrypt encrypted files':
      '3. Descriptografe arquivos criptografados',
    '4. Use "progress" to check status':
      '4. Use "progress" para verificar o status',
    '• Collect all 5 categories':
      '• Colete as 5 categorias',
    '• Use "leak" to transmit the evidence':
      '• Use "leak" para transmitir as evidências',
    'Collect evidence in 5 categories:':
      'Colete evidências em 5 categorias:',
    '• Read carefully - evidence is in the details':
      '• Leia com atenção - as evidências estão nos detalhes',
    '• Use "note" to track important findings':
      '• Use "note" para registrar descobertas importantes',
    '• Decrypt encrypted files for hidden evidence':
      '• Descriptografe arquivos criptografados para achar evidências ocultas',
    '• Watch your detection level!':
      '• Fique de olho no nível de detecção!',
    'COMMANDS TO KNOW':
      'COMANDOS IMPORTANTES',
    'progress         Check your case status':
      'progress         Verifica o status do caso',
    'map              View collected evidence':
      'map              Mostra as evidências coletadas',
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
      'LIMITE DE TENTATIVAS INVÁLIDAS'
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
    'Uncover all 5 truth categories': 'Descubre las 5 categorías de la verdad',
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
    'Release Prisoner 46 from containment': 'Libera al Prisionero 46 de la contención',
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
    'Release Prisoner 46 and prove aliens exist': 'Libera al Prisionero 46 y prueba que existen los alienígenas',
    'Total Collapse': 'Colapso Total',
    'Release Prisoner 46 and leak conspiracies': 'Libera al Prisionero 46 y filtra conspiraciones',
    'Personal Contamination': 'Contaminación Personal',
    'Use the neural link and feel the alien presence': 'Usa el enlace neural y siente la presencia alienígena',
    'Paranoid Awakening': 'Despertar Paranoico',
    'Leak conspiracies while neurally linked': 'Filtra conspiraciones mientras estás enlazado neuralmente',
    'Witnessed Truth': 'Verdad Presenciada',
    'Release Prisoner 46 while neurally linked': 'Libera al Prisionero 46 mientras estás enlazado neuralmente',

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
    '[UFO74]: And you only get 8 attempts.':
      '[UFO74]: Y solo tienes 8 intentos.',
    '[UFO74]: Fail 8 times, the window closes. Permanently.':
      '[UFO74]: Si fallas 8 veces, la ventana se cierra. Para siempre.',
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
    'UFO74: youre in. keep it quiet.':
      'UFO74: ya entraste. mantén un perfil bajo.',
    'UFO74: quick brief. you cant change anything here — read only.':
      'UFO74: resumen rápido. aquí no puedes cambiar nada — solo lectura.',
    'UFO74: type "ls" to see whats in front of you.':
      'UFO74: escribe "ls" para ver lo que tienes enfrente.',
    'UFO74: type "cd <folder>" to go inside. "open <file>" to read.':
      'UFO74: escribe "cd <folder>" para entrar. "open <file>" para leer.',
    'UFO74: when this channel closes, start with: ls':
      'UFO74: cuando este canal se cierre, empieza con: ls',
    'UFO74: try internal/ first. routine paperwork. low heat.':
      'UFO74: prueba internal/ primero. papeleo rutinario. poco riesgo.',
    'UFO74: youll see an evidence tracker. it lights up when you prove something.':
      'UFO74: verás un rastreador de evidencia. se enciende cuando compruebas algo.',
    'UFO74: risk meter climbs as you dig. if it spikes, they test you. fail that, youre out.':
      'UFO74: el medidor de riesgo sube mientras escarbas. si se dispara, te prueban. si fallas, se acabó.',
    'UFO74: im cutting the link. from here, youre on your own.':
      'UFO74: voy a cortar el enlace. desde aquí sigues por tu cuenta.',
    'move slow. read everything. the truth is in the details.':
      've despacio. lee todo. la verdad está en los detalles.',
    '>> CONNECTION IDLE <<':
      '>> CONEXIÓN EN ESPERA <<',
    'Type "help" for commands. "help basics" if youre new.':
      'Escribe "help" para ver comandos. "help basics" si eres nuevo.',
    'UFO74: new here? type "help basics".':
      'UFO74: ¿nuevo por aquí? escribe "help basics".',
    '║  💡 TUTORIAL TIP                          ║':
      '║  💡 CONSEJO DEL TUTORIAL                  ║',
    'You found evidence!':
      '¡Encontraste evidencia!',
    'Keep searching for more files.':
      'Sigue buscando más archivos.',
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
    'progress        See your evidence status':
      'progress        Muestra el estado de tu evidencia',
    'map             Visualize evidence connections':
      'map             Visualiza conexiones de evidencia',
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
    'HOW TO FIND EVIDENCE:':
      'CÓMO ENCONTRAR EVIDENCIA:',
    '1. Navigate directories with ls, cd':
      '1. Navega directorios con ls, cd',
    '2. Read files with open <filename>':
      '2. Lee archivos con open <filename>',
    '3. Decrypt encrypted files':
      '3. Descifra archivos encriptados',
    '4. Use "progress" to check status':
      '4. Usa "progress" para revisar el estado',
    '• Collect all 5 categories':
      '• Reúne las 5 categorías',
    '• Use "leak" to transmit the evidence':
      '• Usa "leak" para transmitir la evidencia',
    'Collect evidence in 5 categories:':
      'Reúne evidencia en 5 categorías:',
    '• Read carefully - evidence is in the details':
      '• Lee con atención: la evidencia está en los detalles',
    '• Use "note" to track important findings':
      '• Usa "note" para registrar hallazgos importantes',
    '• Decrypt encrypted files for hidden evidence':
      '• Descifra archivos encriptados para hallar evidencia oculta',
    '• Watch your detection level!':
      '• ¡Vigila tu nivel de detección!',
    'COMMANDS TO KNOW':
      'COMANDOS CLAVE',
    'progress         Check your case status':
      'progress         Revisa el estado de tu caso',
    'map              View collected evidence':
      'map              Muestra la evidencia reunida',
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
      'UMBRAL DE INTENTOS INVÁLIDOS'
  }
};
