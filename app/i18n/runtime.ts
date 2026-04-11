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
    'Prisoner 46 appeared live three days later.':
      'O Prisioneiro 46 apareceu ao vivo três dias depois.',
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
    'Prisoner 46 spoke. Humanity believed.':
      'O Prisioneiro 46 falou. A humanidade acreditou.',
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
      'MODO DEUS - FINAL NEUTRO'
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
    'Prisoner 46 appeared live three days later.':
      'El Prisionero 46 apareció en vivo tres días después.',
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
    'Prisoner 46 spoke. Humanity believed.':
      'El Prisionero 46 habló. La humanidad creyó.',
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
      'MODO DIOS - FINAL NEUTRAL'
  }
};
