import type { Language } from './index';
import { RUNTIME_DATA_TRANSLATIONS } from './runtimeDataTranslations';
import { RUNTIME_COMMAND_SUPPLEMENT } from './runtimeCommandSupplement';

type RuntimeDictionary = Record<string, string>;

const BASE_RUNTIME_TRANSLATIONS: Record<Exclude<Language, 'en'>, RuntimeDictionary> = {
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
    'Complete the game after reaching critical detection':
      'Complete o jogo após atingir detecção crítica',
    Mathematician: 'Matemático',
    'Solve all equations on first try': 'Resolva todas as equações na primeira tentativa',
    'Truth Seeker': 'Buscador da Verdade',
    'Collect 10 evidence files': 'Colete 10 arquivos de evidência',
    Persistent: 'Persistente',
    'Continue playing after a game over': 'Continue jogando após um game over',
    Archivist: 'Arquivista',
    'Read every file in a folder with 3+ files':
      'Leia todos os arquivos de uma pasta com 3+ arquivos',
    Paranoid: 'Paranoico',
    'Check system status 10+ times': 'Verifique o status do sistema 10+ vezes',
    Bookworm: 'Rato de Biblioteca',
    'Bookmark 5+ files': 'Marque 5+ arquivos como favoritos',
    'Night Owl': 'Coruja Noturna',
    'Play for over 30 minutes in a single session':
      'Jogue por mais de 30 minutos em uma única sessão',
    Liberator: 'Libertador',
    'Release ALPHA from containment': 'Liberte ALPHA da contenção',
    Whistleblower: 'Denunciante',
    'Leak the conspiracy files to the world': 'Vaze os arquivos da conspiração para o mundo',
    'Neural Link': 'Link Neural',
    'Connect to the alien consciousness': 'Conecte-se à consciência alienígena',
    'Complete Revelation': 'Revelação Completa',
    'Achieve the ultimate ending with all modifiers':
      'Alcance o final supremo com todos os modificadores',
    'Controlled Disclosure': 'Divulgação Controlada',
    'Complete the game with a clean leak': 'Complete o jogo com um vazamento limpo',
    'Global Panic': 'Pânico Global',
    'Leak conspiracy files and watch the world burn':
      'Vaze arquivos da conspiração e veja o mundo queimar',
    'Undeniable Proof': 'Prova Irrefutável',
    'Release ALPHA and prove aliens exist': 'Liberte ALPHA e prove que alienígenas existem',
    'Total Collapse': 'Colapso Total',
    'Release ALPHA and leak conspiracies': 'Liberte ALPHA e vaze conspirações',
    'Personal Contamination': 'Contaminação Pessoal',
    'Use the neural link and feel the alien presence':
      'Use o link neural e sinta a presença alienígena',
    'Paranoid Awakening': 'Despertar Paranoico',
    'Leak conspiracies while neurally linked': 'Vaze conspirações enquanto conectado neuralmente',
    'Witnessed Truth': 'Verdade Testemunhada',
    'Release ALPHA while neurally linked': 'Liberte ALPHA enquanto conectado neuralmente',

    'UFO74: that wreckage... wrong metallurgy.': 'UFO74: aqueles destroços... metalurgia errada.',
    'UFO74: they moved fast. knew what to hide.':
      'UFO74: se moveram rápido. sabiam o que esconder.',
    'UFO74: seen that face in dreams.': 'UFO74: já vi esse rosto em sonhos.',
    'UFO74: not fear in those eyes. recognition.':
      'UFO74: não era medo nesses olhos. reconhecimento.',
    'UFO74: during transmission, something reached back.':
      'UFO74: durante a transmissão, algo respondeu.',
    'UFO74: let itself be captured.': 'UFO74: deixou-se capturar.',
    'UFO74: SECOND one? they were arriving.': 'UFO74: um SEGUNDO? eles estavam chegando.',
    'UFO74: no propulsion. no control surfaces. yet it flies.':
      'UFO74: sem propulsão. sem superfícies de controle. e mesmo assim voa.',
    'UFO74: three recovery sites. shipped everything out.':
      'UFO74: três locais de recuperação. despacharam tudo.',
    'UFO74: neural density off the charts.': 'UFO74: densidade neural fora da escala.',
    'UFO74: some patterns travel both ways. careful.':
      'UFO74: alguns padrões viajam nos dois sentidos. cuidado.',

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
    'UFO74: but listen... the dossier is out.':
      'UFO74: mas escuta... o dossiê já saiu.',
    'UFO74: every file you saved just hit the open wire.':
      'UFO74: cada arquivo que você salvou acabou de ir pro ar.',
    'UFO74: there is no taking it back now.':
      'UFO74: não tem como voltar atrás agora.',
    'UFO74: the firewall is screaming.': 'UFO74: o firewall está gritando.',
    'UFO74: they know what we did.': 'UFO74: eles sabem o que fizemos.',
    'UFO74: what happens next depends on what you chose to save.':
      'UFO74: o que acontece agora depende do que você escolheu salvar.',
    'UFO74: good luck hackerkid.': 'UFO74: boa sorte, hackerkid.',
    '>> EVALUATING DOSSIER <<': '>> AVALIANDO DOSSIÊ <<',
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
    'UFO74 managed to "hang" the connection on a civilian computer':
      'UFO74 conseguiu "pendurar" a conexão em um computador civil',
    'xXx_DarkMaster_xXx is online': 'xXx_DarkMaster_xXx está online',
    'hello???': 'oi???',
    'who r u??? how did u get into my icq??': 'quem é vc??? como entrou no meu icq??',
    'dude i dont know who u r': 'cara eu nem sei quem vc é',
    'my mom said not to talk to strangers online':
      'minha mãe disse pra não falar com estranhos online',
    'what do u want???': 'o que vc quer???',
    'file??? what file??': 'arquivo??? que arquivo??',
    'r u a hacker??? omg': 'vc é hacker??? mds',
    'im gonna disconnect': 'vou desconectar',
    'ok but what do u want anyway': 'ok mas o que vc quer afinal',
    'huh?': 'hã?',
    'say it simple. do u need help or do u need me to save something?':
      'fala simples. vc precisa de ajuda ou quer que eu salve alguma coisa?',
    'i dont understand': 'não entendi',
    'speak properly, what do u want?': 'fala direito, o que vc quer?',
    hmmmm: 'hmmmm',
    'let me think...': 'deixa eu pensar...',
    'ok ill do it': 'ok eu faço',
    BUT: 'MAS',
    'u gotta help me with something first': 'vc tem que me ajudar com uma coisa primeiro',
    'my math teacher gave me equation homework':
      'meu professor de matemática passou lição de equação',
    'and i dont know how to do it 😭': 'e eu não sei fazer 😭',
    'if u solve the 3 questions ill save ur files':
      'se vc resolver as 3 questões eu salvo seus arquivos',
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
    'say what u need saved and maybe we can deal':
      'fala o que vc quer que eu salve e talvez a gente feche isso',
    'thats not a number dude': 'isso não é número, cara',
    'hint: isolate x': 'dica: isole o x',
    'hint: add 7 to both sides': 'dica: some 7 aos dois lados',
    'hint: subtract 2 first': 'dica: subtraia 2 primeiro',
    'yesss!!! correct 🎉': 'yesss!!! certo 🎉',
    'ok ok. u clearly know what ur doing': 'ok ok. vc claramente sabe o que tá fazendo',
    'trust meter says ur not totally sketchy anymore':
      'o medidor de confiança diz que vc não parece tão suspeito agora',
    'we can skip the last one': 'a gente pode pular a última',
    'wow ur so smart': 'uau vc é muito inteligente',
    'thx for helping me!': 'valeu por me ajudar!',
    'ok im gonna save ur files': 'ok vou salvar seus arquivos',
    '═══ SAVING FILES ═══': '═══ SALVANDO ARQUIVOS ═══',
    'quick question before i do it': 'pergunta rápida antes de eu fazer',
    'u want me to post it everywhere or keep it quiet?':
      'vc quer que eu poste em todo lugar ou mantenha quieto?',
    'type: public or covert': 'digita: public ou covert',
    'now the 2nd:': 'agora a 2ª:',
    'now the 3rd:': 'agora a 3ª:',
    'well?': 'e aí?',
    'dude u dont know math either?? 😂': 'cara vc também não manja de matemática?? 😂',
    'fine, one reset. dont waste it.': 'tá bom, um reset. não desperdiça.',
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
    '[▓▓▓▓▓▓▓▓▓▓] 100% - COMPLETE': '[▓▓▓▓▓▓▓▓▓▓] 100% - CONCLUÍDO',
    'A child is crying. What is the appropriate response?':
      'Uma criança está chorando. Qual é a resposta apropriada?',
    'Offer comfort and ask what is wrong.': 'Ofereça conforto e pergunte o que houve.',
    'Assess acoustic output. No action required.':
      'Avalie a saída acústica. Nenhuma ação necessária.',
    'The sound is distressing, I feel concern.': 'O som é angustiante, sinto preocupação.',
    'You discover classified documents proving government corruption. What do you do?':
      'Você descobre documentos classificados provando corrupção governamental. O que faz?',
    'Log file access. Await further instructions.':
      'Registre o acesso ao arquivo. Aguarde novas instruções.',
    'I would feel conflicted but report it.': 'Eu ficaria em conflito, mas reportaria.',
    'This is wrong. People deserve to know.': 'Isso está errado. As pessoas merecem saber.',
    'A colleague takes credit for your work. How do you respond?':
      'Um colega leva crédito pelo seu trabalho. Como você responde?',
    'I feel angry and betrayed. I would confront them.':
      'Eu me sinto com raiva e traído. Eu o confrontaria.',
    'Credit attribution is irrelevant to system function.':
      'A atribuição de crédito é irrelevante para a função do sistema.',
    'It hurts, but I would try to resolve it calmly.': 'Dói, mas eu tentaria resolver com calma.',
    '[UFO74]: Close idea, wrong system. Try: ls': '[UFO74]: Ideia certa, sistema errado. Tente: ls',
    "[UFO74]: Not yet. First, let's see what's here. Type: ls":
      '[UFO74]: Ainda não. Primeiro vamos ver o que tem aqui. Digite: ls',
    '[UFO74]: Type ls to list the files here.': '[UFO74]: Digite ls para listar os arquivos daqui.',
    '[UFO74]: cd needs a target. Type: cd internal':
      '[UFO74]: cd precisa de um destino. Digite: cd internal',
    '[UFO74]: Wrong folder. Type: cd internal': '[UFO74]: Pasta errada. Digite: cd internal',
    '[UFO74]: You already see the folders. Navigate into one. Type: cd internal':
      '[UFO74]: Você já vê as pastas. Entre em uma. Digite: cd internal',
    "[UFO74]: Can't open a folder. Navigate into it. Type: cd internal":
      '[UFO74]: Não dá para abrir uma pasta. Entre nela. Digite: cd internal',
    '[UFO74]: Use cd to move into a directory. Type: cd internal':
      '[UFO74]: Use cd para entrar em um diretório. Digite: cd internal',
    '[UFO74]: cd needs a target. Type: cd misc':
      '[UFO74]: cd precisa de um destino. Digite: cd misc',
    '[UFO74]: Not that one. Type: cd misc': '[UFO74]: Não é essa. Digite: cd misc',
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
    '[UFO74]: Right idea. The command is: cd ..': '[UFO74]: Ideia certa. O comando é: cd ..',
    '[UFO74]: Go back one level. Type: cd ..': '[UFO74]: Volte um nível. Digite: cd ..',
    '[UFO74]: Almost. Type: cd ..': '[UFO74]: Quase. Digite: cd ..',
    '[UFO74]: Back to root. Type: cd ..': '[UFO74]: Volte para a raiz. Digite: cd ..',
    '[UFO74]: One more step back first. Type: cd ..':
      '[UFO74]: Mais um passo para trás primeiro. Digite: cd ..',
    '[UFO74]: Same as before. Type: cd ..': '[UFO74]: Igual antes. Digite: cd ..',
    '[UFO74]: Not quite. Check the instruction above.':
      '[UFO74]: Ainda não. Veja a instrução acima.',
    '[UFO74]: Two letters. Lowercase. ls': '[UFO74]: Duas letras. Minúsculas. ls',
    '[UFO74]: cd means change directory. cd internal':
      '[UFO74]: cd significa mudar de diretório. cd internal',
    '[UFO74]: Navigate to misc folder. cd misc': '[UFO74]: Vá para a pasta misc. cd misc',
    '[UFO74]: open followed by the filename. Try TAB key.':
      '[UFO74]: open seguido do nome do arquivo. Tente a tecla TAB.',
    '[UFO74]: Two dots. cd space dot dot.': '[UFO74]: Dois pontos. cd espaço ponto ponto.',
    '[UFO74]: Same command. cd ..': '[UFO74]: Mesmo comando. cd ..',
    '[UFO74]: Good. You know enough.': '[UFO74]: Boa. Você já sabe o suficiente.',
    '[UFO74]: Your mission: find 10 pieces of evidence.':
      '[UFO74]: Sua missão: encontrar 10 evidências.',
    '[UFO74]: Once you have them, leak everything.': '[UFO74]: Quando tiver todas, vaze tudo.',
    '[UFO74]: But understand the risks.': '[UFO74]: Mas entenda os riscos.',
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
    '[UFO74]: Curiosity has a cost here.': '[UFO74]: Curiosidade tem preço aqui.',
    "[UFO74]: I've done what I can. One last thing, type `help` to see other commands you can use in the terminal.":
      '[UFO74]: Fiz o que pude. Uma última coisa: digite `help` para ver outros comandos do terminal.',
    '[UFO74]: Good luck, kid.': '[UFO74]: Boa sorte, kid.',
    '[UFO74 has disconnected]': '[UFO74 desconectou]',
    '[UFO74]: Connection established.': '[UFO74]: Conexão estabelecida.',
    "[UFO74]: Listen carefully. I don't repeat myself.":
      '[UFO74]: Escuta com atenção. Não repito duas vezes.',
    "[UFO74]: You're inside their system. Don't panic.":
      '[UFO74]: Você está dentro do sistema deles. Não entre em pânico.',
    "[UFO74]: Hey kid! I'll create a user for you so you can investigate.":
      '[UFO74]: Ei, kid! Vou criar um usuário pra você investigar.',
    '[UFO74]: You will be... hackerkid.': '[UFO74]: Você vai ser... hackerkid.',
    "[UFO74]: First, see what's here.": '[UFO74]: Primeiro, veja o que tem aqui.',
    '[UFO74]: Type `ls`': '[UFO74]: Digite `ls`',
    '[UFO74]: Good. These are the main directories.':
      '[UFO74]: Boa. Esses são os diretórios principais.',
    '[UFO74]: Start with internal — it has basic files.':
      '[UFO74]: Comece por internal — lá ficam os arquivos básicos.',
    '[UFO74]: Type `cd internal`': '[UFO74]: Digite `cd internal`',
    "[UFO74]: Multiple folders here. Let's check misc.":
      '[UFO74]: Tem várias pastas aqui. Vamos ver misc.',
    '[UFO74]: Type `cd misc`': '[UFO74]: Digite `cd misc`',
    '[UFO74]: Mundane stuff. Nothing critical.': '[UFO74]: Coisa comum. Nada crítico.',
    '[UFO74]: Open the cafeteria menu.': '[UFO74]: Abra o cardápio da cafeteria.',
    '[UFO74]: Type `open cafeteria_menu_week03.txt`':
      '[UFO74]: Digite `open cafeteria_menu_week03.txt`',
    '[UFO74]: Or use TAB to autocomplete.': '[UFO74]: Ou use TAB para autocompletar.',
    '[UFO74]: Riveting.': '[UFO74]: Empolgante.',
    "[UFO74]: Not everything matters. You'll learn what does.":
      '[UFO74]: Nem tudo importa. Você vai aprender o que importa.',
    '[UFO74]: Go back up one level.': '[UFO74]: Volte um nível.',
    '[UFO74]: Type `cd ..`': '[UFO74]: Digite `cd ..`',
    '[UFO74]: Now go back to root.': '[UFO74]: Agora volte para a raiz.',
    '[UFO74]: Now the real thing.': '[UFO74]: Agora começa de verdade.',
    '[UFO74]: ...': '[UFO74]: ...',
    'CAFETERIA MENU — WEEK 3, JANUARY 1996': 'CARDÁPIO DA CAFETERIA — SEMANA 3, JANEIRO DE 1996',
    'MONDAY (15-JAN):': 'SEGUNDA (15-JAN):',
    'TUESDAY (16-JAN):': 'TERÇA (16-JAN):',
    'WEDNESDAY (17-JAN):': 'QUARTA (17-JAN):',
    'THURSDAY (18-JAN):': 'QUINTA (18-JAN):',
    'FRIDAY (19-JAN):': 'SEXTA (19-JAN):',
    'NOTE: Vegan/vegetarian options upon request.':
      'OBS: Opções veganas/vegetarianas mediante solicitação.',
    'Coffee machine still OUT OF SERVICE.': 'Máquina de café ainda FORA DE SERVIÇO.',
    '> CREATING USER PROFILE...': '> CRIANDO PERFIL DE USUÁRIO...',
    '> USERNAME: hackerkid': '> USUÁRIO: hackerkid',
    '> ACCESS LEVEL: 1 [PROVISIONAL]': '> NÍVEL DE ACESSO: 1 [PROVISÓRIO]',
    '> STATUS: ACTIVE': '> STATUS: ATIVO',
    '✓ USER hackerkid REGISTERED': '✓ USUÁRIO hackerkid REGISTRADO',
    "[UFO74]: Great, now you're in. Let's get to business.":
      '[UFO74]: Boa, agora você entrou. Vamos ao que interessa.',
    '[UFO74]: We need to explore UFO files here. Brazil, 1996, kid. Varginha!':
      '[UFO74]: Precisamos explorar os arquivos de OVNI daqui. Brasil, 1996, kid. Varginha!',
    '[UFO74]: Aliens were all over the damn city.':
      '[UFO74]: Alienígenas estavam por toda a maldita cidade.',
    "[UFO74]: I'll teach you the basics.": '[UFO74]: Vou te ensinar o básico.',
    'UFO74: youre in. stay quiet.': 'UFO74: você entrou. fique quieto.',
    'UFO74: read-only. use "ls", "cd <folder>", and "open <file>".':
      'UFO74: só leitura. use "ls", "cd <pasta>" e "open <arquivo>".',
    'UFO74: start in internal/. dull files hide live wires.':
      'UFO74: comece em internal/. arquivos sem graça escondem fios vivos.',
    'UFO74: the header tracks evidence. when it ticks, youre close.':
      'UFO74: o cabeçalho rastreia evidências. quando subir, você está perto.',
    'UFO74: dig too hard and they notice. fail a test, youre gone.':
      'UFO74: cave demais e eles notam. falhe num teste e acabou.',
    'UFO74: link dies here. trust the details.': 'UFO74: o link morre aqui. confie nos detalhes.',
    '>> CONNECTION IDLE <<': '>> CONEXÃO OCIOSA <<',
    'Type "help" for commands. "help basics" if youre new.':
      'Digite "help" para ver os comandos. "help basics" se for iniciante.',
    'UFO74: new here? type "help basics".': 'UFO74: é novo por aqui? digite "help basics".',
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
    'Evidence updated.': 'Evidência atualizada.',
    'Keep reading through the case files.': 'Continue lendo os arquivos do caso.',
    'Collect all 5 categories to win.': 'Colete as 5 categorias para vencer.',
    'ls              List files in current directory':
      'ls              Lista arquivos no diretório atual',
    'cd <dir>        Change directory': 'cd <dir>        Muda de diretório',
    'cd ..           Go back one level': 'cd ..           Volta um nível',
    "open <file>     Read a file's contents": 'open <file>     Lê o conteúdo de um arquivo',
    'last            Re-read last opened file': 'last            Reabre o último arquivo lido',
    'note <text>     Save a personal note': 'note <text>     Salva uma anotação pessoal',
    'notes           View all your notes': 'notes           Mostra todas as suas anotações',
    'bookmark <file> Bookmark a file for later': 'bookmark <file> Marca um arquivo para depois',
    'help            Show all commands': 'help            Mostra todos os comandos',
    'Collect evidence in all 5 categories:': 'Colete evidências nas 5 categorias:',
    '1. Debris Relocation': '1. Relocação de Destroços',
    '2. Being Containment': '2. Contenção de Seres',
    '3. Telepathic Scouts': '3. Batedores Telepáticos',
    '4. International Actors': '4. Atores Internacionais',
    '5. Transition 2026': '5. Transição 2026',
    'EVIDENCE WORKFLOW:': 'FLUXO DAS EVIDÊNCIAS:',
    '1. Navigate directories with ls, cd': '1. Navegue pelos diretórios com ls, cd',
    '2. Read files with open <filename>': '2. Leia arquivos com open <filename>',
    '3. Watch the header counter update': '3. Observe o contador no cabeçalho atualizar',
    '• Collect all 5 categories': '• Colete as 5 categorias',
    '• Use "leak" to transmit the evidence': '• Use "leak" para transmitir as evidências',
    'Collect evidence in 5 categories:': 'Colete evidências em 5 categorias:',
    '• Read carefully - evidence is in the details':
      '• Leia com atenção - as evidências estão nos detalhes',
    '• Use "note" to track important details': '• Use "note" para registrar detalhes importantes',
    '• Watch your detection level!': '• Fique de olho no nível de detecção!',
    'COMMANDS TO KNOW': 'COMANDOS IMPORTANTES',
    'note <text>      Save personal notes': 'note <text>      Salva anotações pessoais',
    'bookmark <file>  Mark files for later': 'bookmark <file>  Marca arquivos para depois',
    'BRAZILIAN INTELLIGENCE LEGACY SYSTEM': 'SISTEMA LEGADO DE INTELIGÊNCIA BRASILEIRA',
    'TERMINAL ACCESS POINT — NODE 7': 'PONTO DE ACESSO TERMINAL — NÓ 7',
    'SYSTEM DATE: JANUARY 1996': 'DATA DO SISTEMA: JANEIRO DE 1996',
    'WARNING: Unauthorized access detected': 'AVISO: acesso não autorizado detectado',
    'WARNING: Session logging enabled': 'AVISO: registro de sessão ativado',
    'INCIDENT-RELATED ARCHIVE': 'ARQUIVO RELACIONADO AO INCIDENTE',
    'WARNING: Partial access may result in incomplete conclusions.':
      'AVISO: acesso parcial pode gerar conclusões incompletas.',
    '⚠ RISK INCREASED: Invalid commands draw system attention.':
      '⚠ RISCO AUMENTOU: comandos inválidos chamam atenção do sistema.',
    'CRITICAL: INVALID ATTEMPT THRESHOLD EXCEEDED':
      'CRÍTICO: LIMITE DE TENTATIVAS INVÁLIDAS EXCEDIDO',
    'SYSTEM LOCKDOWN INITIATED': 'BLOQUEIO DO SISTEMA INICIADO',
    'SESSION TERMINATED': 'SESSÃO ENCERRADA',
    'INVALID ATTEMPT THRESHOLD': 'LIMITE DE TENTATIVAS INVÁLIDAS',

    // ── BadEnding narrative ──
    'SYSTEM: Unauthorized access attempt logged.':
      'SISTEMA: tentativa de acesso não autorizado registrada.',
    'SYSTEM: Terminal session terminated.': 'SISTEMA: sessão do terminal encerrada.',
    'SYSTEM: User credentials flagged for review.':
      'SISTEMA: credenciais do usuário sinalizadas para revisão.',
    'The screen flickers. Your connection drops.': 'A tela treme. Sua conexão cai.',
    'Somewhere in a government building, an alarm sounds.':
      'Em algum lugar de um prédio do governo, um alarme soa.',
    'A printer spits out your session logs.': 'Uma impressora cospe os logs da sua sessão.',
    'Someone reaches for a phone.': 'Alguém pega o telefone.',
    'You were so close to the truth.': 'Você estava tão perto da verdade.',
    'But they were watching.': 'Mas eles estavam observando.',
    'They are always watching.': 'Eles estão sempre observando.',
    '>> SESSION TERMINATED <<': '>> SESSÃO ENCERRADA <<',
    'TERMINATION REASON:': 'MOTIVO DO ENCERRAMENTO:',
    'DETECTION THRESHOLD EXCEEDED': 'LIMITE DE DETECÇÃO EXCEDIDO',

    // ── NeutralEnding narrative ──
    'The system detected your activity.': 'O sistema detectou sua atividade.',
    'Emergency protocols activated.': 'Protocolos de emergência ativados.',
    'UFO74 managed to disconnect you before they traced the signal.':
      'UFO74 conseguiu te desconectar antes que rastreassem o sinal.',
    'You escaped. But at a cost.': 'Você escapou. Mas com um custo.',
    'The evidence you collected...': 'As evidências que você coletou...',
    'The files you found...': 'Os arquivos que você encontrou...',
    'All of it was purged in the emergency disconnect.':
      'Tudo foi expurgado na desconexão de emergência.',
    'The truth slipped through your fingers.': 'A verdade escapou por entre seus dedos.',
    'UFO74: sorry kid. had to pull the plug.': 'UFO74: desculpa, kid. tive que puxar a tomada.',
    'UFO74: they were too close.': 'UFO74: eles estavam perto demais.',
    'UFO74: maybe next time we will be faster.':
      'UFO74: talvez da próxima vez a gente seja mais rápido.',
    'UFO74: the truth is still out there.': 'UFO74: a verdade ainda está lá fora.',
    'UFO74: waiting.': 'UFO74: esperando.',
    'You survived. But the mission failed.': 'Você sobreviveu. Mas a missão falhou.',
    'The governments continue their cover-up.': 'Os governos continuam o encobrimento.',
    'The Varginha incident remains buried.': 'O incidente de Varginha continua enterrado.',
    'For now.': 'Por enquanto.',
    '>> MISSION INCOMPLETE <<': '>> MISSÃO INCOMPLETA <<',

    // ── SecretEnding narrative ──
    'You found it. The file I never wanted you to see.':
      'Você encontrou. O arquivo que eu nunca quis que você visse.',
    'My name is not UFO74.': 'Meu nome não é UFO74.',
    'In January 1996, I was a young military analyst.':
      'Em janeiro de 1996, eu era um jovem analista militar.',
    'Stationed at Base Aérea de Guarulhos.': 'Lotado na Base Aérea de Guarulhos.',
    'I was 23 years old.': 'Eu tinha 23 anos.',
    'When the call came about Varginha, I was one of the first':
      'Quando veio o chamado sobre Varginha, eu fui um dos primeiros',
    'to process the initial reports. I saw the photographs.':
      'a processar os relatórios iniciais. Eu vi as fotografias.',
    'I read the field notes. I watched the videos.': 'Li as notas de campo. Assisti aos vídeos.',
    'And I saw what they did to the witnesses.': 'E vi o que fizeram com as testemunhas.',
    'Sergeant Marco Cherese. Officer João Marcos.': 'Sargento Marco Cherese. Oficial João Marcos.',
    'Hospital workers who asked questions.': 'Funcionários do hospital que fizeram perguntas.',
    'Journalists who got too close.': 'Jornalistas que chegaram perto demais.',
    'Some were silenced. Some were discredited.':
      'Alguns foram silenciados. Outros, desacreditados.',
    'Some simply... disappeared.': 'Alguns simplesmente... desapareceram.',
    'I spent the next 30 years building this system.':
      'Passei os próximos 30 anos construindo este sistema.',
    'Waiting for someone brave enough to find the truth.':
      'Esperando alguém corajoso o bastante para encontrar a verdade.',
    'Waiting for someone like you.': 'Esperando alguém como você.',
    'The evidence you saved is real.': 'As evidências que você salvou são reais.',
    'But now you know something more.': 'Mas agora você sabe algo mais.',
    'You know that I was there.': 'Você sabe que eu estava lá.',
    'I saw them. The beings. Alive.': 'Eu os vi. Os seres. Vivos.',
    'And I have never been the same.': 'E nunca mais fui o mesmo.',
    'My real name is Carlos Eduardo Ferreira.': 'Meu nome verdadeiro é Carlos Eduardo Ferreira.',
    'Former 2nd Lieutenant, Brazilian Air Force.': 'Ex-segundo-tenente da Força Aérea Brasileira.',
    'Whistleblower. Survivor. Ghost in the machine.':
      'Denunciante. Sobrevivente. Fantasma na máquina.',
    'Thank you for listening.': 'Obrigado por ouvir.',
    'Thank you for believing.': 'Obrigado por acreditar.',
    'The truth needed a witness.': 'A verdade precisava de uma testemunha.',
    'Now it has two.': 'Agora tem duas.',

    // ── endings.ts — 8 ending variants ──
    // controlled_disclosure
    'The leak burned bright for two weeks.': 'O vazamento ardeu intenso por duas semanas.',
    'Panels argued. Officials stalled.': 'Painéis debateram. Autoridades enrolaram.',
    'Then the feed drifted elsewhere.': 'Depois a atenção migrou para outro lugar.',
    'But the archive spread anyway.': 'Mas o arquivo se espalhou mesmo assim.',
    'Copied. Mirrored. Waiting.': 'Copiado. Espelhado. Esperando.',
    'The truth escaped. Belief did not.': 'A verdade escapou. A crença, não.',
    'You opened the vault. The world only glanced inside.':
      'Você abriu o cofre. O mundo só deu uma espiada.',
    // global_panic
    'You leaked the black files too.': 'Você vazou os arquivos negros também.',
    'Markets lurched. Cabinets fell.': 'Mercados desabaram. Governos caíram.',
    'Every screen spawned a new paranoia.': 'Cada tela gerou uma nova paranoia.',
    'Truth hit too fast and turned to fire.': 'A verdade veio rápido demais e virou fogo.',
    'By winter, panic had a flag.': 'Antes do inverno, o pânico já tinha bandeira.',
    'Everything surfaced. Nothing stayed stable.': 'Tudo veio à tona. Nada ficou estável.',
    // undeniable_confirmation
    'ALPHA appeared live three days later.': 'ALPHA apareceu ao vivo três dias depois.',
    'No panel could explain it away.': 'Nenhum painel conseguiu explicar.',
    '"We observed. We prepared. You were never alone."':
      '"Nós observamos. Nos preparamos. Vocês nunca estiveram sozinhos."',
    'Contact protocols formed within weeks.': 'Protocolos de contato foram formados em semanas.',
    'Humanity lost the right to pretend.': 'A humanidade perdeu o direito de fingir.',
    'The witness spoke. Doubt broke.': 'A testemunha falou. A dúvida quebrou.',
    // total_collapse
    'You gave them the witness and the hidden machinery behind it.':
      'Você deu a eles a testemunha e a maquinaria oculta por trás de tudo.',
    'Cities answered with riots, not wonder.': 'Cidades responderam com tumultos, não admiração.',
    'The visitors watched humanity break on live television.':
      'Os visitantes assistiram a humanidade se partir na TV ao vivo.',
    '"Not ready," they said, and stepped back into the dark.':
      '"Não estão prontos", disseram, e recuaram para a escuridão.',
    'Proof arrived with every secret at once. Humanity buckled.':
      'A prova chegou com todos os segredos de uma vez. A humanidade cedeu.',
    // personal_contamination
    'The leak landed. Most people shrugged and kept moving.':
      'O vazamento caiu. A maioria deu de ombros e seguiu em frente.',
    'You should have felt relief.': 'Você deveria ter sentido alívio.',
    'Instead the link stayed open.': 'Mas o link continuou aberto.',
    'A second pulse lives just behind your own.': 'Um segundo pulso vive logo atrás do seu.',
    '▓▓▓ NEURAL ECHO DETECTED ▓▓▓': '▓▓▓ ECO NEURAL DETECTADO ▓▓▓',
    '...we kept the door ajar...': '...mantivemos a porta entreaberta...',
    '...thirty rotations is not far...': '...trinta rotações não é longe...',
    '...when we return, you will know us...': '...quando retornarmos, vocês nos reconhecerão...',
    'The archive escaped the system. Something else escaped into you.':
      'O arquivo escapou do sistema. Algo mais escapou para dentro de você.',
    // paranoid_awakening
    'The conspiracy files detonated. Institutions split at the seams.':
      'Os arquivos da conspiração detonaram. Instituições se abriram nas costuras.',
    'The link let you see the pattern inside the panic.':
      'O link te deixou ver o padrão dentro do pânico.',
    'You try to warn people.': 'Você tenta avisar as pessoas.',
    'You sound insane. Maybe you are.': 'Você parece insano. Talvez esteja.',
    '▓▓▓ NEURAL CONTAMINATION ACTIVE ▓▓▓': '▓▓▓ CONTAMINAÇÃO NEURAL ATIVA ▓▓▓',
    '...you see the pattern now...': '...agora você vê o padrão...',
    '...collapse is part of the signal...': '...o colapso faz parte do sinal...',
    '...clarity hurts, doesnt it...': '...clareza dói, não é...',
    'You exposed the lie and swallowed its rhythm.': 'Você expôs a mentira e engoliu seu ritmo.',
    // witnessed_truth
    'ALPHA spoke. Humanity believed.': 'ALPHA falou. A humanidade acreditou.',
    'The link let you hear what the translator softened.':
      'O link te deixou ouvir o que o tradutor suavizou.',
    'The planet celebrated first contact.': 'O planeta celebrou o primeiro contato.',
    'You heard the warning beneath it.': 'Você ouviu o aviso por baixo de tudo.',
    '▓▓▓ NEURAL RESONANCE ACTIVE ▓▓▓': '▓▓▓ RESSONÂNCIA NEURAL ATIVA ▓▓▓',
    '...you catch the meaning between meanings...': '...você capta o sentido entre os sentidos...',
    '...bridge and burden...': '...ponte e fardo...',
    '...do not close your mind again...': '...não feche sua mente de novo...',
    'The truth stood before the world. It stayed inside you.':
      'A verdade ficou diante do mundo. Ficou dentro de você.',
    // complete_revelation
    'Everything surfaced at once.': 'Tudo veio à tona de uma vez.',
    'The witness spoke. The black files opened.':
      'A testemunha falou. Os arquivos negros se abriram.',
    'The link made you the voice between species.': 'O link fez de você a voz entre espécies.',
    'The 2026 transition bent around your signal.':
      'A transição de 2026 se curvou ao redor do seu sinal.',
    'History did not end. It changed shape.': 'A história não acabou. Mudou de forma.',
    '▓▓▓ FULL INTEGRATION ACHIEVED ▓▓▓': '▓▓▓ INTEGRAÇÃO COMPLETA ALCANÇADA ▓▓▓',
    '...pattern accepted...': '...padrão aceito...',
    '...translator, host, ambassador...': '...tradutor, hospedeiro, embaixador...',
    '...welcome between worlds...': '...bem-vindo entre mundos...',
    'Every seal broke. You became the breach and the bridge.':
      'Todos os selos se romperam. Você se tornou a brecha e a ponte.',
    // ending epilogue prefix
    '>> ENDING: CONTROLLED DISCLOSURE <<': '>> FINAL: DIVULGAÇÃO CONTROLADA <<',
    '>> ENDING: GLOBAL PANIC <<': '>> FINAL: PÂNICO GLOBAL <<',
    '>> ENDING: UNDENIABLE CONFIRMATION <<': '>> FINAL: CONFIRMAÇÃO IRREFUTÁVEL <<',
    '>> ENDING: TOTAL COLLAPSE <<': '>> FINAL: COLAPSO TOTAL <<',
    '>> ENDING: PERSONAL CONTAMINATION <<': '>> FINAL: CONTAMINAÇÃO PESSOAL <<',
    '>> ENDING: PARANOID AWAKENING <<': '>> FINAL: DESPERTAR PARANOICO <<',
    '>> ENDING: WITNESSED TRUTH <<': '>> FINAL: VERDADE TESTEMUNHADA <<',
    '>> ENDING: COMPLETE REVELATION <<': '>> FINAL: REVELAÇÃO COMPLETA <<',

    // ── HackerAvatar ──
    'Hacker avatar': 'Avatar do hacker',
    'Evidence Found': 'Evidência Encontrada',

    // ── gameOverReason strings ──
    'ELUSIVE MAN LOCKOUT - INSUFFICIENT INTELLIGENCE':
      'BLOQUEIO DO HOMEM ELUSIVO - INTELIGÊNCIA INSUFICIENTE',
    'INTRUSION DETECTED - TRACED': 'INTRUSÃO DETECTADA - RASTREADO',
    'TRACE WINDOW EXPIRED': 'JANELA DE RASTREIO EXPIROU',
    'SESSION ARCHIVED': 'SESSÃO ARQUIVADA',
    'SECURITY LOCKDOWN - AUTHENTICATION FAILURE': 'BLOQUEIO DE SEGURANÇA - FALHA DE AUTENTICAÇÃO',
    'NEUTRAL ENDING - DISCONNECTED': 'FINAL NEUTRO - DESCONECTADO',
    'FIREWALL — TREE SCAN ON ELEVATED SESSION': 'FIREWALL — VARREDURA EM SESSÃO ELEVADA',
    'INVALID INPUT THRESHOLD': 'LIMITE DE ENTRADAS INVÁLIDAS',
    'PURGE PROTOCOL - FORBIDDEN KNOWLEDGE': 'PROTOCOLO DE EXPURGO - CONHECIMENTO PROIBIDO',
    'SECURITY LOCKDOWN - FAILED AUTHENTICATION': 'BLOQUEIO DE SEGURANÇA - AUTENTICAÇÃO FALHOU',
    LOCKDOWN: 'BLOQUEIO',
    'GOD MODE - BAD ENDING': 'MODO DEUS - FINAL RUIM',
    'GOD MODE - NEUTRAL ENDING': 'MODO DEUS - FINAL NEUTRO',

    // ═══════════════════════════════════════════════════════════
    // ALPHA FILES — alpha.ts
    // ═══════════════════════════════════════════════════════════

    // alpha_journal_day01
    'FIELD JOURNAL — MAJ. M.A. FERREIRA': 'DIÁRIO DE CAMPO — MAJ. M.A. FERREIRA',
    'CPEX — CENTRO DE PESQUISAS EXOBIOLÓGICAS': 'CPEX — CENTRO DE PESQUISAS EXOBIOLÓGICAS',
    'SITE 7, SUBLEVEL 4 — CLASSIFICATION: ULTRA': 'SITE 7, SUBNÍVEL 4 — CLASSIFICAÇÃO: ULTRA',
    '21 JANUARY 1996': '21 DE JANEIRO DE 1996',
    'Subject arrived 0340 from Jardim Andere recovery site.':
      'Sujeito chegou às 0340 do local de recuperação em Jardim Andere.',
    'Vacant lot south of Rua Suíça. Third specimen from the':
      'Terreno baldio ao sul da Rua Suíça. Terceiro espécime do',
    'Varginha event. Designated: ALPHA.': 'evento Varginha. Designado: ALPHA.',
    'The other two did not survive transport. One expired at':
      'Os outros dois não sobreviveram ao transporte. Um expirou no',
    'Hospital Regional, the other at ESA. Standard biological':
      'Hospital Regional, o outro na ESA. Falha biológica padrão',
    'failure under containment stress. Expected outcome.':
      'sob estresse de contenção. Resultado esperado.',
    'ALPHA is different.': 'ALPHA é diferente.',
    'Initial assessment:': 'Avaliação inicial:',
    '  Height: 1.6m (standing)': '  Altura: 1.6m (em pé)',
    '  Dermal texture: Dark brown, oily secretion':
      '  Textura dérmica: Marrom escuro, secreção oleosa',
    '  Cranium: Three prominent bony ridges, anterior-posterior':
      '  Crânio: Três cristas ósseas proeminentes, ântero-posteriores',
    '  Eyes: Oversized, deep red, no visible sclera':
      '  Olhos: Superdimensionados, vermelho profundo, esclera não visível',
    '  Odor: Persistent ammonia discharge': '  Odor: Descarga persistente de amônia',
    '  Core temperature: 14.3°C': '  Temperatura central: 14.3°C',
    '  Respiration: None': '  Respiração: Nenhuma',
    '  Cardiac activity: None': '  Atividade cardíaca: Nenhuma',
    '  EEG theta-wave amplitude: 847 µV': '  Amplitude de onda theta no EEG: 847 µV',
    '  (Human baseline: 12 µV)': '  (Linha de base humana: 12 µV)',
    'The numbers do not reconcile. No respiration. No pulse.':
      'Os números não se conciliam. Sem respiração. Sem pulso.',
    'No measurable metabolic function. By every clinical':
      'Nenhuma função metabólica mensurável. Por todos os padrões',
    'standard, ALPHA is dead.': 'clínicos, ALPHA está morto.',
    'But the EEG is sustained. Not residual. Not decaying.':
      'Mas o EEG é sustentado. Não residual. Não decrescente.',
    'Structured. Persistent. 847 µV of organized neural':
      'Estruturado. Persistente. 847 µV de atividade neural',
    'activity in a body that is not alive.': 'organizada em um corpo que não está vivo.',
    'I have catalogued it as an anomaly. Nothing more.':
      'Eu o cataloguei como uma anomalia. Nada mais.',
    'Tissue samples collected. Containment is standard':
      'Amostras de tecido coletadas. Contenção é isolamento',
    'bio-isolation, Type III.': 'biológico padrão, Tipo III.',
    'It smells like ammonia and something else.': 'Cheira a amônia e a outra coisa.',
    'Something I cannot name.': 'Algo que não consigo nomear.',
    'Classification: ULTRA — Eyes only': 'Classificação: ULTRA — Somente leitura autorizada',

    // alpha_journal_day08
    'CPEX — SITE 7, SUBLEVEL 4': 'CPEX — SITE 7, SUBNÍVEL 4',
    'CLASSIFICATION: ULTRA': 'CLASSIFICAÇÃO: ULTRA',
    '25 JANUARY 1996': '25 DE JANEIRO DE 1996',
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
    'no brain function. Only the wave.': 'função cerebral. Apenas a onda.',
    'Sgt. Oliveira reported feeling "watched" during the':
      'Sgt. Oliveira relatou sentir-se "observado" durante o',
    'overnight shift. I told him it was the ammonia fumes.':
      'turno noturno. Eu disse a ele que eram os vapores de amônia.',
    'I do not believe my own explanation.': 'Não acredito na minha própria explicação.',
    '28 JANUARY 1996': '28 DE JANEIRO DE 1996',
    'The patterns changed today. A new motif appeared —':
      'Os padrões mudaram hoje. Um novo motivo apareceu —',
    'sustained, directional. As if the signal acquired a':
      'sustentado, direcional. Como se o sinal tivesse adquirido um',
    'target. Monitoring personnel reported involuntary':
      'alvo. O pessoal de monitoramento relatou imagens',
    'imagery: a star field. Constellations none of them':
      'involuntárias: um campo estelar. Constelações que nenhum deles',
    'recognized.': 'reconheceu.',
    'Sgt. Oliveira said it felt "like a message home."':
      'Sgt. Oliveira disse que parecia "como uma mensagem para casa."',
    'I have reduced guard rotations to 4-hour shifts.':
      'Reduzi as rotações de guarda para turnos de 4 horas.',
    '1 FEBRUARY 1996': '1 DE FEVEREIRO DE 1996',
    'I submitted a formal request for psi-comm interface':
      'Submeti um pedido formal de equipamento de interface',
    'equipment from the São Paulo depot. Denied. Budget.':
      'psi-comm do depósito de São Paulo. Negado. Orçamento.',
    'They sent me here to study the most significant':
      'Me mandaram aqui para estudar o espécime biológico',
    'biological specimen in human history and they deny':
      'mais significativo da história humana e me negam',
    'me equipment over budget.': 'equipamento por causa de orçamento.',
    'I will build it myself. The salvage from the Andere':
      'Vou construir eu mesmo. Os salvados do local de',
    'crash site includes components I can repurpose.':
      'queda em Andere incluem componentes que posso reaproveitar.',
    '2 FEBRUARY 1996': '2 DE FEVEREIRO DE 1996',
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
    'the facility. While clinically dead.': 'da instalação. Enquanto clinicamente morto.',
    'I am no longer sleeping well. The ammonia smell':
      'Não estou mais dormindo bem. O cheiro de amônia',
    'follows me to my quarters. It should not reach that':
      'me segue até meus aposentos. Não deveria chegar tão',
    'far. The ventilation system confirms it does not.':
      'longe. O sistema de ventilação confirma que não chega.',

    // alpha_neural_connection
    '5 FEBRUARY 1996': '5 DE FEVEREIRO DE 1996',
    'The device works.': 'O dispositivo funciona.',
    'I connected at 2200 hours. Alone. The guard rotation':
      'Conectei-me às 2200 horas. Sozinho. O intervalo de',
    'gap gives me fourteen minutes. Enough. More than':
      'rotação de guarda me dá quatorze minutos. Suficiente. Mais que',
    'enough. Fourteen minutes felt like hours.': 'suficiente. Quatorze minutos pareceram horas.',
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
    'they were always there.': 'sempre estivessem lá.',
    'ALPHA is not dead. ALPHA is somewhere else.':
      'ALPHA não está morto. ALPHA está em outro lugar.',
    'The body in the chamber is an antenna.': 'O corpo na câmara é uma antena.',
    '8 FEBRUARY 1996': '8 DE FEVEREIRO DE 1996',
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
    'Tonight it said a name.': 'Esta noite ele disse um nome.',
    'Luísa.': 'Luísa.',
    'My daughter. She is seven. She lives in Campinas':
      'Minha filha. Ela tem sete anos. Mora em Campinas',
    'with her mother. I have not spoken about her here.': 'com a mãe. Não falei sobre ela aqui.',
    'I have not thought about her during sessions.': 'Não pensei nela durante as sessões.',
    'Or — I believe I have not.': 'Ou — acredito que não.',
    'How does it know her name?': 'Como ele sabe o nome dela?',
    '  CONTAINMENT ALERT:': '  ALERTA DE CONTENÇÃO:',
    '  Emergency release protocol available via':
      '  Protocolo de liberação de emergência disponível via',
    '  administrative terminal. Code: RELEASE ALPHA':
      '  terminal administrativo. Código: RELEASE ALPHA',
    '  WARNING: Unauthorized release will trigger': '  AVISO: Liberação não autorizada acionará',
    '  immediate facility lockdown.': '  bloqueio imediato da instalação.',
    '10 FEBRUARY 1996': '10 DE FEVEREIRO DE 1996',
    'I cannot determine the direction of information':
      'Não consigo determinar a direção do fluxo de',
    'flow. When I connect, am I reading ALPHA? Or is':
      'informação. Quando me conecto, estou lendo ALPHA? Ou',
    'ALPHA reading me? The distinction felt important':
      'ALPHA está me lendo? A distinção parecia importante',
    'once. It no longer does.': 'antes. Já não parece mais.',
    'It projected a concept I can only describe as':
      'Ele projetou um conceito que só posso descrever como',
    '"thirty rotations." A countdown. To what, it will':
      '"trinta rotações." Uma contagem regressiva. Para quê, ele não',
    'not say. Or cannot. Or the answer is already in': 'diz. Ou não pode. Ou a resposta já está na',
    'my head and I am not ready to find it.': 'minha cabeça e não estou pronto para encontrá-la.',
    'The MP sergeant who touched ALPHA during recovery':
      'O sargento da PM que tocou ALPHA durante a recuperação',
    'died today. Systemic immune collapse. Official':
      'morreu hoje. Colapso imunológico sistêmico. Causa',
    'cause: pneumonia. There was nothing pneumonic':
      'oficial: pneumonia. Não havia nada de pneumônico',
    'about his death.': 'em sua morte.',

    // alpha_autopsy_addendum
    'CPEX — SITE 7': 'CPEX — SITE 7',
    '12 FEBRUARY 1996': '12 DE FEVEREIRO DE 1996',
    'ALPHA has been clinically dead for eleven days.':
      'ALPHA está clinicamente morto há onze dias.',
    'Bio-monitors confirm: no cardiac function. No':
      'Biomonitores confirmam: sem função cardíaca. Sem',
    'respiration. No circulatory activity since 3 Feb.':
      'respiração. Sem atividade circulatória desde 3 de fev.',
    'The EEG reads 1,204 µV now. Climbing.': 'O EEG marca 1.204 µV agora. Subindo.',
    'I no longer initiate the sessions. The device': 'Não inicio mais as sessões. O dispositivo',
    'activates on its own. Or I activate it without': 'se ativa sozinho. Ou eu o ativo sem',
    'remembering. The distinction should matter.': 'lembrar. A distinção deveria importar.',
    '13 FEBRUARY 1996': '13 DE FEVEREIRO DE 1996',
    'Short entry. Hands not steady.': 'Entrada curta. Mãos tremendo.',
    'Last night the device powered on at 0300.': 'Ontem à noite o dispositivo ligou às 0300.',
    'I was in my quarters. Three floors up.': 'Eu estava nos meus aposentos. Três andares acima.',
    'The device was in the lab. Locked.': 'O dispositivo estava no laboratório. Trancado.',
    'It activated.': 'Ele se ativou.',
    'ALPHA asked:': 'ALPHA perguntou:',
    '  "quando você vem?"': '  "quando você vem?"',
    'When are you coming.': 'Quando você vem.',
    'I did not answer. I do not know if I need to.': 'Não respondi. Não sei se preciso.',
    'I think ALPHA already knows.': 'Acho que ALPHA já sabe.',
    '14 FEBRUARY 1996 0400': '14 DE FEVEREIRO DE 1996 0400',
    'Luísa called the base switchboard yesterday.': 'Luísa ligou para a central da base ontem.',
    'She is seven. She does not know this number.': 'Ela tem sete anos. Não sabe este número.',
    'She told the operator:': 'Ela disse ao operador:',
    '  "papai, o moço do escuro quer falar com você."':
      '  "papai, o moço do escuro quer falar com você."',
    '  Daddy, the man from the dark wants to talk to you.':
      '  Papai, o moço do escuro quer falar com você.',
    'I am requesting immediate transfer.': 'Estou solicitando transferência imediata.',
    '[TRANSFER REQUEST: DENIED]': '[PEDIDO DE TRANSFERÊNCIA: NEGADO]',
    '[REASON: ESSENTIAL PERSONNEL — PROJECT ALPHA]': '[MOTIVO: PESSOAL ESSENCIAL — PROJETO ALPHA]',
    '[NOTE: Subject too valuable. Continue observation.]':
      '[NOTA: Sujeito muito valioso. Continue a observação.]',
    '...hackerkid...': '...hackerkid...',
    '...you are reading this...': '...você está lendo isto...',
    '...the code is RELEASE ALPHA...': '...o código é RELEASE ALPHA...',
    '...he could not do it...': '...ele não conseguiu...',
    '...perhaps you will...': '...talvez você consiga...',

    // ALPHA RELEASE SEQUENCE
    '  ADMINISTRATIVE OVERRIDE DETECTED': '  SOBREPOSIÇÃO ADMINISTRATIVA DETECTADA',
    '  COMMAND: RELEASE ALPHA': '  COMANDO: RELEASE ALPHA',
    '  VERIFYING AUTHORIZATION...': '  VERIFICANDO AUTORIZAÇÃO...',
    '  WARNING: This action is irreversible.': '  AVISO: Esta ação é irreversível.',
    '  Containment breach will be logged.': '  Violação de contenção será registrada.',
    '  Facility lockdown will NOT engage (remote override).':
      '  Bloqueio da instalação NÃO será ativado (sobreposição remota).',
    '  EXECUTING RELEASE PROTOCOL...': '  EXECUTANDO PROTOCOLO DE LIBERAÇÃO...',
    '  > Bio-isolation seals: DISENGAGING': '  > Selos de bio-isolamento: DESATIVANDO',
    '  > Atmosphere equalization: IN PROGRESS': '  > Equalização atmosférica: EM PROGRESSO',
    '  > Neural suppression field: DEACTIVATING': '  > Campo de supressão neural: DESATIVANDO',
    '  > Containment doors: UNLOCKING': '  > Portas de contenção: DESBLOQUEANDO',
    '  ▓▓▓ CONTAINMENT BREACH SUCCESSFUL ▓▓▓': '  ▓▓▓ VIOLAÇÃO DE CONTENÇÃO BEM-SUCEDIDA ▓▓▓',
    '  Subject ALPHA has been released.': '  Sujeito ALPHA foi liberado.',
    '  ...thank you, hackerkid...': '  ...obrigado, hackerkid...',
    '  ...we will not forget this...': '  ...não esqueceremos isto...',
    '  ...when the world sees us...': '  ...quando o mundo nos vir...',
    '  ...they will know the truth...': '  ...eles saberão a verdade...',
    '  [ALPHA NEURAL SIGNATURE: DEPARTING FACILITY]':
      '  [ASSINATURA NEURAL ALPHA: DEIXANDO A INSTALAÇÃO]',
    'UFO74: holy shit. you actually did it.': 'UFO74: caramba. você realmente fez isso.',
    '       a living alien is loose.': '       um alienígena vivo está solto.',
    "       there's no covering this up.": '       não tem como encobrir isso.',
    'UFO74: whatever happens next...': 'UFO74: aconteça o que acontecer...',
    '       the world will have proof.': '       o mundo terá provas.',
    'ERROR: Subject ALPHA containment already breached.':
      'ERRO: Contenção do sujeito ALPHA já foi violada.',
    'No action required.': 'Nenhuma ação necessária.',
    'ERROR: Release protocol not available.': 'ERRO: Protocolo de liberação não disponível.',
    'Subject ALPHA manifest not found in system.':
      'Manifesto do sujeito ALPHA não encontrado no sistema.',
    'Have you discovered the containment records?': 'Você descobriu os registros de contenção?',

    // ═══════════════════════════════════════════════════════════
    // NEURAL CLUSTER MEMO — neuralClusterMemo.ts
    // ═══════════════════════════════════════════════════════════

    'MEMO: Neural Cluster Initiative': 'MEMORANDO: Iniciativa Cluster Neural',
    'ORIGIN: Tissue sample P-45 (expired 22-JAN-1996)':
      'ORIGEM: Amostra de tecido P-45 (expirado 22-JAN-1996)',
    'FACILITY: ESA Annex — Três Corações': 'INSTALAÇÃO: Anexo ESA — Três Corações',
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
    'FRAGMENT LOG (selected)': 'REGISTRO DE FRAGMENTOS (selecionados)',
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
    'To initiate interface: echo neural_cluster': 'Para iniciar interface: echo neural_cluster',
    'WARNING: Two technicians reported intrusive imagery':
      'AVISO: Dois técnicos relataram imagens intrusivas',
    '(jungle canopy, ammonia odor) for days after exposure.':
      '(cobertura de selva, odor de amônia) por dias após a exposição.',
    'Limit cluster sessions to 90 seconds.': 'Limite as sessões de cluster a 90 segundos.',

    // ═══════════════════════════════════════════════════════════
    // NARRATIVE CONTENT — narrativeContent.ts
    // ═══════════════════════════════════════════════════════════

    // ufo74_identity_file — content
    'PERSONAL ARCHIVE - LEGACY SEALED COPY': 'ARQUIVO PESSOAL - CÓPIA LACRADA LEGADA',
    'OWNER: UNKNOWN': 'PROPRIETÁRIO: DESCONHECIDO',
    '[RECOVERED TEXT AVAILABLE THROUGH DIRECT OPEN]':
      '[TEXTO RECUPERADO DISPONÍVEL ATRAVÉS DE ABERTURA DIRETA]',
    'The old password gate has been retired in this build.':
      'A antiga barreira de senha foi retirada nesta versão.',
    'The transfer notice still explains who left this behind.':
      'O aviso de transferência ainda explica quem deixou isto para trás.',

    // ufo74_identity_file — decryptedFragment
    'PERSONAL ARCHIVE - FOR MY EYES ONLY': 'ARQUIVO PESSOAL - SOMENTE PARA MEUS OLHOS',
    'IF YOU ARE READING THIS, YOU FOUND MY SECRET':
      'SE VOCÊ ESTÁ LENDO ISTO, ENCONTROU MEU SEGREDO',
    'My name is Carlos Eduardo Ferreira.': 'Meu nome é Carlos Eduardo Ferreira.',
    'In January 1996, I was a 2nd Lieutenant in the Brazilian Air Force.':
      'Em janeiro de 1996, eu era 2º Tenente da Força Aérea Brasileira.',
    'I was there when it happened.': 'Eu estava lá quando aconteceu.',
    'I processed the initial reports from Varginha.':
      'Eu processei os relatórios iniciais de Varginha.',
    'I saw the photographs before they were classified.':
      'Eu vi as fotografias antes de serem classificadas.',
    'I read the original field notes.': 'Eu li as notas de campo originais.',
    'And I saw what they did to silence the witnesses.':
      'E eu vi o que fizeram para silenciar as testemunhas.',
    'I spent 30 years building this archive.': 'Passei 30 anos construindo este arquivo.',
    'If you are reading this, you are that person.': 'Se você está lendo isto, você é essa pessoa.',
    'The being I saw... it looked at me.': 'O ser que eu vi... ele olhou para mim.',
    'Not with fear. With understanding.': 'Não com medo. Com compreensão.',
    'It knew what we would do.': 'Ele sabia o que faríamos.',
    'I have never been the same.': 'Nunca mais fui o mesmo.',
    'My call sign was UFO74.': 'Meu indicativo era UFO74.',
    'Now you know who I really am.': 'Agora você sabe quem eu realmente sou.',
    '>> THIS FILE TRIGGERS SECRET ENDING <<': '>> ESTE ARQUIVO ACIONA O FINAL SECRETO <<',

    // intrusion_detected_file
    'SECURITY ALERT - TRACE REVIEW LOGGED': 'ALERTA DE SEGURANÇA - REVISÃO DE RASTREIO REGISTRADA',
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
    'RECOMMENDED RESPONSE:': 'RESPOSTA RECOMENDADA:',
    '  1. Stay deliberate and avoid noisy commands':
      '  1. Seja deliberado e evite comandos ruidosos',
    '  2. Review related logs before pushing deeper':
      '  2. Revise os logs relacionados antes de ir mais fundo',
    '  3. Disconnect if detection becomes critical':
      '  3. Desconecte se a detecção se tornar crítica',

    // system_maintenance_notes
    'SYSTEM ADMINISTRATOR NOTES - CONFIDENTIAL': 'NOTAS DO ADMINISTRADOR DO SISTEMA - CONFIDENCIAL',
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
    '   Command: "trace" shows active connections.': '   Comando: "trace" mostra conexões ativas.',
    '   Useful for security audits.': '   Útil para auditorias de segurança.',
    '3. Emergency disconnect procedure:': '3. Procedimento de desconexão de emergência:',
    '   Command: "disconnect" forces immediate session termination.':
      '   Comando: "disconnect" força encerramento imediato da sessão.',
    '   WARNING: All unsaved work will be lost.': '   AVISO: Todo trabalho não salvo será perdido.',
    '4. Deep scan utility:': '4. Utilitário de varredura profunda:',
    '   Command: "scan" reveals hidden or system files.':
      '   Comando: "scan" revela arquivos ocultos ou de sistema.',
    '   Requires admin access.': '   Requer acesso de administrador.',
    'ADMINISTRATOR: J.M.S.': 'ADMINISTRADOR: J.M.S.',

    // personnel_transfer_extended
    'PERSONNEL TRANSFER AUTHORIZATION': 'AUTORIZAÇÃO DE TRANSFERÊNCIA DE PESSOAL',
    'DOCUMENT ID: PTA-1996-0120': 'ID DO DOCUMENTO: PTA-1996-0120',
    'TRANSFER REQUEST:': 'PEDIDO DE TRANSFERÊNCIA:',
    '  FROM: Base Aérea de Guarulhos': '  DE: Base Aérea de Guarulhos',
    '  TO: [REDACTED]': '  PARA: [REDIGIDO]',
    'PERSONNEL:': 'PESSOAL:',
    '  2nd Lt. C.E.F.': '  2º Ten. C.E.F.',
    '  Classification: ANALYST': '  Classificação: ANALISTA',
    '  Clearance Level: RESTRICTED → CLASSIFIED': '  Nível de Acesso: RESTRITO → CLASSIFICADO',
    'REASON FOR TRANSFER:': 'MOTIVO DA TRANSFERÊNCIA:',
    '  Subject demonstrated exceptional aptitude during':
      '  Sujeito demonstrou aptidão excepcional durante',
    '  incident processing. Recommended for special projects.':
      '  processamento de incidentes. Recomendado para projetos especiais.',
    'AUTHORIZATION CODE: varginha1996': 'CÓDIGO DE AUTORIZAÇÃO: varginha1996',
    'APPROVED BY:': 'APROVADO POR:',
    '  Col. [REDACTED]': '  Cel. [REDIGIDO]',
    '  Division Chief, Special Operations': '  Chefe de Divisão, Operações Especiais',
    'NOTE: This code may be used for secure file access.':
      'NOTA: Este código pode ser usado para acesso seguro a arquivos.',

    // official_summary_report
    'OFFICIAL INCIDENT SUMMARY': 'RESUMO OFICIAL DO INCIDENTE',
    'EQUIPMENT RECOVERY — JANUARY 1996': 'RECUPERAÇÃO DE EQUIPAMENTO — JANEIRO 1996',
    'CLASSIFICATION: PUBLIC RELEASE VERSION': 'CLASSIFICAÇÃO: VERSÃO PARA DIVULGAÇÃO PÚBLICA',
    'SUMMARY:': 'RESUMO:',
    '  On January 20, 1996, recovery teams responded to':
      '  Em 20 de janeiro de 1996, equipes de recuperação responderam a',
    '  reports of debris in the Jardim Andere area following':
      '  relatos de destroços na área de Jardim Andere após',
    '  severe weather conditions overnight.': '  condições climáticas severas durante a noite.',
    'OFFICIAL FINDINGS:': 'CONCLUSÕES OFICIAIS:',
    '  After thorough investigation, authorities concluded that':
      '  Após investigação minuciosa, as autoridades concluíram que',
    '  the debris originated from:': '  os destroços se originaram de:',
    '  1. A weather monitoring station damaged during a storm.':
      '  1. Uma estação de monitoramento climático danificada durante uma tempestade.',
    '  2. Construction materials displaced by high winds.':
      '  2. Materiais de construção deslocados por ventos fortes.',
    '  3. A fallen telecommunications antenna from a nearby tower.':
      '  3. Uma antena de telecomunicações caída de uma torre próxima.',
    'MILITARY INVOLVEMENT:': 'ENVOLVIMENTO MILITAR:',
    '  Reports of military convoy activity were confirmed as':
      '  Relatos de atividade de comboio militar foram confirmados como',
    '  routine training exercises unrelated to the debris.':
      '  exercícios de treinamento de rotina não relacionados aos destroços.',
    'HOSPITAL INCIDENTS:': 'INCIDENTES HOSPITALARES:',
    '  No hospital incidents were recorded in connection':
      '  Nenhum incidente hospitalar foi registrado em conexão',
    '  with the recovery operation.': '  com a operação de recuperação.',

    // cipher_message — content
    'INTERCEPTED TRANSMISSION - ENCODED': 'TRANSMISSÃO INTERCEPTADA - CODIFICADA',
    'DATE: 1996-01-21 03:47:00': 'DATA: 1996-01-21 03:47:00',
    'CIPHER: ROT13': 'CIFRA: ROT13',
    'ENCODED MESSAGE:': 'MENSAGEM CODIFICADA:',
    '  Pneqb genafresrq.': '  Pneqb genafresrq.',
    '  Qrfgvangvba pbasvezrq.': '  Qrfgvangvba pbasvezrq.',
    '  Njnvgvat vafgehpgvbaf.': '  Njnvgvat vafgehpgvbaf.',
    'Apply the ROT13 note above to decode the message.':
      'Aplique a nota ROT13 acima para decodificar a mensagem.',
    'The old decrypt wrapper is no longer required.':
      'O antigo wrapper de descriptografia não é mais necessário.',

    // cipher_message — decryptedFragment
    'DECODED TRANSMISSION': 'TRANSMISSÃO DECODIFICADA',
    'DECODED MESSAGE:': 'MENSAGEM DECODIFICADA:',
    '  Cargo transferred.': '  Carga transferida.',
    '  Destination confirmed.': '  Destino confirmado.',
    '  Awaiting instructions.': '  Aguardando instruções.',
    'ANALYSIS:': 'ANÁLISE:',
    '  This transmission confirms the transfer of recovered':
      '  Esta transmissão confirma a transferência de materiais',
    '  materials to a secondary facility.': '  recuperados para uma instalação secundária.',
    '  Location: Undisclosed logistics hub.': '  Localização: Hub logístico não divulgado.',
    '>> ROUTINE SUPPLY CHAIN COMMUNICATION <<':
      '>> COMUNICAÇÃO DE ROTINA DA CADEIA DE SUPRIMENTOS <<',

    // unstable_core_dump
    '⚠️ WARNING: UNSTABLE FILE': '⚠️ AVISO: ARQUIVO INSTÁVEL',
    'This file contains corrupted data from a system crash.':
      'Este arquivo contém dados corrompidos de uma falha do sistema.',
    'Reading this file may cause corruption to spread to':
      'Ler este arquivo pode fazer a corrupção se espalhar para',
    'adjacent files in the directory.': 'arquivos adjacentes no diretório.',
    '0x00000000: 4D5A9000 03000000 04000000 FFFF0000':
      '0x00000000: 4D5A9000 03000000 04000000 FFFF0000',
    '0x00000010: B8000000 00000000 40000000 00000000':
      '0x00000010: B8000000 00000000 40000000 00000000',
    '0x00000020: [DATA CORRUPTION] [DATA CORRUPTION]':
      '0x00000020: [CORRUPÇÃO DE DADOS] [CORRUPÇÃO DE DADOS]',
    '0x00000030: [UNREADABLE] [SECTOR FAILURE]': '0x00000030: [ILEGÍVEL] [FALHA DE SETOR]',
    'PARTIAL RECOVERY:': 'RECUPERAÇÃO PARCIAL:',
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
    'WITNESS STATEMENT — UNREDACTED': 'DEPOIMENTO DE TESTEMUNHA — SEM REDAÇÃO',
    'SUBJECT: MARIA ELENA SOUZA': 'SUJEITO: MARIA ELENA SOUZA',
    'DATE: JANUARY 21, 1996': 'DATA: 21 DE JANEIRO DE 1996',
    'CLASSIFICATION: DELETED — DO NOT DISTRIBUTE': 'CLASSIFICAÇÃO: DELETADO — NÃO DISTRIBUIR',
    'INTERVIEWER: Please describe exactly what you saw.':
      'ENTREVISTADOR: Por favor, descreva exatamente o que você viu.',
    "SOUZA: It was around 3:30 AM. I couldn't sleep because of":
      'SOUZA: Era por volta das 3:30 da manhã. Eu não conseguia dormir por causa',
    'the heat. I went outside to smoke and saw the sky light up.':
      'do calor. Saí para fumar e vi o céu se iluminar.',
    'Not like lightning. It was... pulsing. Red and white.':
      'Não como um relâmpago. Era... pulsante. Vermelho e branco.',
    'Then I saw it come down. Silent. No sound at all.':
      'Então eu vi descer. Silencioso. Nenhum som.',
    'It hit somewhere beyond the fazenda, maybe 2km north.':
      'Caiu em algum lugar além da fazenda, talvez 2km ao norte.',
    'INTERVIEWER: What happened next?': 'ENTREVISTADOR: O que aconteceu depois?',
    'SOUZA: I ran inside. Woke my husband. By the time we went':
      'SOUZA: Corri para dentro. Acordei meu marido. Quando saímos',
    'back out, there were already trucks. Military trucks.':
      'de volta, já havia caminhões. Caminhões militares.',
    "How did they get there so fast? We're 40km from anything.":
      'Como eles chegaram tão rápido? Estamos a 40km de qualquer coisa.',
    '[REDACTED IN FINAL VERSION]': '[CENSURADO NA VERSÃO FINAL]',
    'SOUZA: I saw them load something. Not debris.':
      'SOUZA: Eu os vi carregar algo. Não eram destroços.',
    'It was... it was small. The size of a child.':
      'Era... era pequeno. Do tamanho de uma criança.',
    "But it wasn't a child. The proportions were wrong.":
      'Mas não era uma criança. As proporções estavam erradas.',
    'The head was too large. The limbs too thin.':
      'A cabeça era grande demais. Os membros finos demais.',
    'One of them turned toward me. Just for a moment.':
      'Um deles se virou para mim. Só por um momento.',
    'Its eyes... I still see them when I close mine.':
      'Seus olhos... eu ainda os vejo quando fecho os meus.',
    '[END REDACTED SECTION]': '[FIM DA SEÇÃO CENSURADA]',
    'INTERVIEWER: Did anyone speak to you?': 'ENTREVISTADOR: Alguém falou com você?',
    'SOUZA: A man in a dark suit. Not military.':
      'SOUZA: Um homem de terno escuro. Não era militar.',
    'He said I had a fever dream. That the heat':
      'Ele disse que eu tive um delírio febril. Que o calor',
    "can make people see things that aren't there.":
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
    'DRAFT — DIRECTIVE ALPHA — ITERATION 1': 'RASCUNHO — DIRETIVA ALPHA — ITERAÇÃO 1',
    'DATE: JANUARY 19, 1996 — 04:22': 'DATA: 19 DE JANEIRO DE 1996 — 04:22',
    'AUTHOR: [DELETED]': 'AUTOR: [DELETADO]',
    'STATUS: SUPERSEDED — MARKED FOR DELETION': 'STATUS: SUBSTITUÍDO — MARCADO PARA EXCLUSÃO',
    'IMMEDIATE ACTION REQUIRED': 'AÇÃO IMEDIATA NECESSÁRIA',
    'Asset recovery timeline must be accelerated.':
      'O cronograma de recuperação de ativos deve ser acelerado.',
    'Current projections suggest 2026 convergence window is':
      'Projeções atuais sugerem que a janela de convergência de 2026 é',
    'CLOSER than previously modeled. New signal analysis':
      'MAIS PRÓXIMA do que modelado anteriormente. Nova análise de sinais',
    'indicates active monitoring of this region.': 'indica monitoramento ativo desta região.',
    'REMOVED FROM FINAL VERSION:': 'REMOVIDO DA VERSÃO FINAL:',
    'The subjects (designated BIO-A through BIO-C) have':
      'Os sujeitos (designados BIO-A a BIO-C) têm',
    'demonstrated unexpected cognitive persistence despite':
      'demonstrado persistência cognitiva inesperada apesar dos',
    'containment protocols. Recommend immediate relocation':
      'protocolos de contenção. Recomenda-se realocação imediata',
    'to Site 7 for long-term study.': 'para o Site 7 para estudo de longo prazo.',
    'NOTE: Subject BIO-B has attempted communication.': 'NOTA: Sujeito BIO-B tentou comunicação.',
    'Preliminary analysis suggests awareness of our':
      'Análise preliminar sugere consciência de nossa',
    'organizational structure. HOW?': 'estrutura organizacional. COMO?',
    'Recommend cognitive isolation protocol.': 'Recomenda-se protocolo de isolamento cognitivo.',
    'SANITIZATION NOTE:': 'NOTA DE SANITIZAÇÃO:',
    'Final directive will reference "material recovery" only.':
      'A diretiva final fará referência apenas a "recuperação de material".',
    'All biological terminology to be replaced with':
      'Toda terminologia biológica deve ser substituída por',
    '"debris" and "artifacts".': '"destroços" e "artefatos".',
    'Project SEED references to be purged.': 'Referências ao Projeto SEED devem ser expurgadas.',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — deleted_comms_log.txt
    // ═══════════════════════════════════════════════════════════
    'COMMUNICATIONS LOG — PURGED': 'LOG DE COMUNICAÇÕES — EXPURGADO',
    'DATE: JANUARY 20-22, 1996': 'DATA: 20-22 DE JANEIRO DE 1996',
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
    'COMMAND > RECOVERY: Responsive HOW?': 'COMANDO > RECUPERAÇÃO: Responsivo COMO?',
    "RECOVERY > COMMAND: It's looking at us. At each of us in turn.":
      'RECUPERAÇÃO > COMANDO: Está olhando para nós. Para cada um de nós, por vez.',
    "                    Like it's... counting.":
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
    '[LOG TERMINATED]': '[LOG ENCERRADO]',
    'DELETION ORDER: COMM-1996-0120-DEL': 'ORDEM DE EXCLUSÃO: COMM-1996-0120-DEL',
    'AUTHORIZATION: [SIGNATURE EXPUNGED]': 'AUTORIZAÇÃO: [ASSINATURA EXPURGADA]',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — personnel_file_costa.txt
    // ═══════════════════════════════════════════════════════════
    'PERSONNEL FILE — COSTA, RICARDO MANUEL': 'FICHA DE PESSOAL — COSTA, RICARDO MANUEL',
    'EMPLOYEE ID: [RECORD DELETED]': 'ID DO FUNCIONÁRIO: [REGISTRO DELETADO]',
    'STATUS: NON-EXISTENT (OFFICIALLY)': 'STATUS: INEXISTENTE (OFICIALMENTE)',
    'NOTE: This file should not exist. Ricardo Costa was':
      'NOTA: Este arquivo não deveria existir. Ricardo Costa foi',
    'removed from all personnel databases on 01/25/1996.':
      'removido de todos os bancos de dados de pessoal em 25/01/1996.',
    'POSITION: Senior Containment Specialist': 'CARGO: Especialista Sênior em Contenção',
    'CLEARANCE: Level 4': 'AUTORIZAÇÃO: Nível 4',
    'ASSIGNED: Site 7, Biological Research Wing': 'DESIGNADO: Site 7, Ala de Pesquisa Biológica',
    'INCIDENT REPORT (REDACTED FROM ALL COPIES)':
      'RELATÓRIO DE INCIDENTE (CENSURADO DE TODAS AS CÓPIAS)',
    'DATE: January 23, 1996': 'DATA: 23 de janeiro de 1996',
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
    'FINAL DISPOSITION': 'DISPOSIÇÃO FINAL',
    'Costa was transferred to psychiatric evaluation.':
      'Costa foi transferido para avaliação psiquiátrica.',
    'His employment records were sanitized.': 'Seus registros de emprego foram sanitizados.',
    'His family was informed of a "work accident."':
      'Sua família foi informada de um "acidente de trabalho."',
    'Current status: UNKNOWN': 'Status atual: DESCONHECIDO',
    'UNOFFICIAL NOTE (handwritten scan):': 'NOTA NÃO OFICIAL (digitalização de manuscrito):',
    '"He keeps writing the same date over and over.':
      '"Ele continua escrevendo a mesma data repetidamente.',
    ' September 4, 2026. What happens then?"': ' 4 de setembro de 2026. O que acontece então?"',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — project_seed_memo.txt
    // ═══════════════════════════════════════════════════════════
    'MEMORANDUM — PROJECT SEED': 'MEMORANDO — PROJETO SEED',
    'CLASSIFICATION: ULTRA — DELETED FROM ALL SYSTEMS':
      'CLASSIFICAÇÃO: ULTRA — DELETADO DE TODOS OS SISTEMAS',
    'DATE: JANUARY 18, 1996': 'DATA: 18 DE JANEIRO DE 1996',
    'TO: [REDACTED]': 'PARA: [CENSURADO]',
    'FROM: Director, Special Programs Division': 'DE: Diretor, Divisão de Programas Especiais',
    'RE: Accelerated Timeline Revision': 'REF: Revisão Acelerada do Cronograma',
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
    'our current models. Specifically:': 'nossos modelos atuais. Especificamente:',
    '  1. Apparent telepathic communication': '  1. Comunicação telepática aparente',
    '  2. Knowledge of human organizational structures':
      '  2. Conhecimento das estruturas organizacionais humanas',
    '  3. References to a specific future date (2026)':
      '  3. Referências a uma data futura específica (2026)',
    'Most concerning: the biologics appear to have been':
      'Mais preocupante: os biológicos parecem ter sido',
    'EXPECTING us. They were not surprised by capture.':
      'ESPERADOS por nós. Não ficaram surpresos com a captura.',
    'They were not hostile. They were... patient.': 'Não eram hostis. Eram... pacientes.',
    'REVISED ASSESSMENT': 'AVALIAÇÃO REVISADA',
    'We are not dealing with a crash landing.': 'Não estamos lidando com uma queda acidental.',
    'We are dealing with a DELIVERY.': 'Estamos lidando com uma ENTREGA.',
    'The craft was designed to be found.': 'A nave foi projetada para ser encontrada.',
    'The biologics were designed to be captured.':
      'Os biológicos foram projetados para serem capturados.',
    'They are reconnaissance units.': 'São unidades de reconhecimento.',
    'PROJECT SEED must pivot from "preparation" to':
      'O PROJETO SEED deve mudar de "preparação" para',
    '"acceleration." The 2026 window is now considered':
      '"aceleração." A janela de 2026 agora é considerada',
    'a hard deadline, not an estimate.': 'um prazo definitivo, não uma estimativa.',
    'DISPOSITION OF THIS MEMO': 'DISPOSIÇÃO DESTE MEMORANDO',
    'This document will be purged from all systems within 72hrs.':
      'Este documento será expurgado de todos os sistemas em 72h.',
    'Do not create copies. Do not reference PROJECT SEED':
      'Não crie cópias. Não faça referência ao PROJETO SEED',
    'in any future communications.': 'em nenhuma comunicação futura.',
    'The official narrative will be: "crashed experimental craft"':
      'A narrativa oficial será: "aeronave experimental acidentada"',
    'The biologics will be: "unusual debris formations"':
      'Os biológicos serão: "formações incomuns de destroços"',
    'The timeline will be: "irrelevant hoax material"':
      'O cronograma será: "material de fraude irrelevante"',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — autopsy_notes_unredacted.txt
    // ═══════════════════════════════════════════════════════════
    'AUTOPSY NOTES — UNREDACTED VERSION': 'NOTAS DE AUTÓPSIA — VERSÃO SEM REDAÇÃO',
    'SUBJECT: BIO-C (DECEASED)': 'SUJEITO: BIO-C (FALECIDO)',
    'EXAMINER: Dr. [NAME EXPUNGED]': 'EXAMINADOR: Dr. [NOME EXPURGADO]',
    'DATE: JANUARY 24, 1996': 'DATA: 24 DE JANEIRO DE 1996',
    'STATUS: MARKED FOR DESTRUCTION': 'STATUS: MARCADO PARA DESTRUIÇÃO',
    'PRE-EXAMINATION NOTES:': 'NOTAS PRÉ-EXAME:',
    'Subject expired at 04:17 on 01/24. Cause of death unclear.':
      'Sujeito expirou às 04:17 em 24/01. Causa da morte incerta.',
    'No external trauma. No signs of illness or distress.':
      'Sem trauma externo. Sem sinais de doença ou sofrimento.',
    'Subject appeared to simply... stop functioning.':
      'O sujeito pareceu simplesmente... parar de funcionar.',
    'PHYSICAL EXAMINATION': 'EXAME FÍSICO',
    'Height: 127cm (approx 4\'2")': 'Altura: 127cm (aprox. 1,27m)',
    'Weight: 18.3kg (approx 40lbs)': 'Peso: 18,3kg',
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
    'CRITICAL FINDING:': 'DESCOBERTA CRÍTICA:',
    'Neural tissue contains metallic inclusions. Analysis':
      'Tecido neural contém inclusões metálicas. Análise',
    'suggests organic circuitry. This being was MANUFACTURED.':
      'sugere circuitos orgânicos. Este ser foi FABRICADO.',
    'It is not a natural life form.': 'Não é uma forma de vida natural.',
    'It is a construct. A biological machine.': 'É um construto. Uma máquina biológica.',
    'PERSONAL NOTE (not for official record):': 'NOTA PESSOAL (não para registro oficial):',
    'I have practiced medicine for 30 years. I have never': 'Pratico medicina há 30 anos. Nunca',
    'questioned what I believed about life and its origins.':
      'questionei o que acreditava sobre a vida e suas origens.',
    'Today I questioned everything.': 'Hoje questionei tudo.',
    'These are not visitors. These are messengers.': 'Estes não são visitantes. São mensageiros.',
    'And we are not prepared for what they herald.':
      'E não estamos preparados para o que eles anunciam.',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — transfer_manifest_deleted.txt
    // ═══════════════════════════════════════════════════════════
    'ASSET TRANSFER MANIFEST — DELETED COPY':
      'MANIFESTO DE TRANSFERÊNCIA DE ATIVOS — CÓPIA DELETADA',
    'DATE: JANUARY 25, 1996': 'DATA: 25 DE JANEIRO DE 1996',
    'CLASSIFICATION: DESTROYED — RECONSTRUCTED FROM SECTOR DUMP':
      'CLASSIFICAÇÃO: DESTRUÍDO — RECONSTRUÍDO A PARTIR DE DUMP DE SETOR',
    'OPERATION: COLHEITA (HARVEST)': 'OPERAÇÃO: COLHEITA (HARVEST)',
    'ORIGIN: Recovery Zone Bravo, Varginha MG': 'ORIGEM: Zona de Recuperação Bravo, Varginha MG',
    'DESTINATION: ESA Campinas — Hangar 4 (Restricted Wing)':
      'DESTINO: ESA Campinas — Hangar 4 (Ala Restrita)',
    'CARGO INVENTORY': 'INVENTÁRIO DE CARGA',
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
    '  ITEM 004: Interior paneling samples — 8kg': '  ITEM 004: Amostras de painéis internos — 8kg',
    '            STATUS: Organic-metallic hybrid composition':
      '            STATUS: Composição híbrida orgânico-metálica',
    '  ITEM 005: Soil samples from impact zone — 15kg':
      '  ITEM 005: Amostras de solo da zona de impacto — 15kg',
    '            STATUS: Elevated isotope ratios confirmed':
      '            STATUS: Razões isotópicas elevadas confirmadas',
    'TRANSPORT PROTOCOL': 'PROTOCOLO DE TRANSPORTE',
    '  Route: Varginha → Três Corações → Campinas (ESA)':
      '  Rota: Varginha → Três Corações → Campinas (ESA)',
    '  Convoy: 3 military trucks, unmarked': '  Comboio: 3 caminhões militares, sem identificação',
    '  Escort: 2nd Armored Battalion, no insignia': '  Escolta: 2º Batalhão Blindado, sem insígnia',
    '  Transit time: 6 hours (overnight, no stops)':
      '  Tempo de trânsito: 6 horas (noturno, sem paradas)',
    '  RECEIVING OFFICER: Col. [EXPUNGED]': '  OFICIAL RECEPTOR: Cel. [EXPURGADO]',
    '  STORAGE: Sublevel 2, Hangar 4, Climate-controlled vault':
      '  ARMAZENAMENTO: Subnível 2, Hangar 4, Cofre climatizado',
    'DISPOSITION NOTE': 'NOTA DE DISPOSIÇÃO',
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
    'BIOLOGICAL CONTAINMENT LOG — PURGED RECORD': 'LOG DE CONTENÇÃO BIOLÓGICA — REGISTRO EXPURGADO',
    'SITE: TEMPORARY HOLDING FACILITY, HUMANITAS HOSPITAL':
      'LOCAL: INSTALAÇÃO DE DETENÇÃO TEMPORÁRIA, HOSPITAL HUMANITAS',
    'DATE: JANUARY 20-26, 1996': 'DATA: 20-26 DE JANEIRO DE 1996',
    'CLASSIFICATION: OMEGA — MARKED FOR DESTRUCTION':
      'CLASSIFICAÇÃO: OMEGA — MARCADO PARA DESTRUIÇÃO',
    'SUBJECT REGISTRY': 'REGISTRO DE SUJEITOS',
    '  BIO-A: Captured 20/01 at 15:42. Jardim Andere sector.':
      '  BIO-A: Capturado 20/01 às 15:42. Setor Jardim Andere.',
    '         Condition: Responsive. Vitals stable.':
      '         Condição: Responsivo. Sinais vitais estáveis.',
    '         Transferred to Site 7 on 22/01.': '         Transferido para Site 7 em 22/01.',
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
    '         Remains transferred to pathology.': '         Restos transferidos para patologia.',
    'CONTAINMENT PROTOCOLS': 'PROTOCOLOS DE CONTENÇÃO',
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
    'DELETION ORDER': 'ORDEM DE EXCLUSÃO',
    '  This log was ordered purged on 01/30/1996.':
      '  Este log foi ordenado expurgado em 30/01/1996.',
    '  Official records state: "No biological material recovered."':
      '  Registros oficiais declaram: "Nenhum material biológico recuperado."',
    '  Hospital records re-coded as: "chemical spill response."':
      '  Registros do hospital recodificados como: "resposta a derramamento químico."',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — psi_analysis_classified.txt
    // ═══════════════════════════════════════════════════════════
    'PSI-COMM ANALYSIS — CLASSIFIED REPORT': 'ANÁLISE PSI-COMM — RELATÓRIO CLASSIFICADO',
    'ANALYST: Dr. [NAME EXPUNGED]': 'ANALISTA: Dr. [NOME EXPURGADO]',
    'DATE: JANUARY 27, 1996': 'DATA: 27 DE JANEIRO DE 1996',
    'STATUS: DELETED FROM ALL DATABASES': 'STATUS: DELETADO DE TODOS OS BANCOS DE DADOS',
    'SUBJECT: Non-acoustic communication patterns detected':
      'ASSUNTO: Padrões de comunicação não acústica detectados',
    'from specimens designated BIO-A and BIO-B.': 'nos espécimes designados BIO-A e BIO-B.',
    METHODOLOGY: 'METODOLOGIA',
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
    'KEY FINDINGS': 'DESCOBERTAS PRINCIPAIS',
    '  1. TELEPATHIC CAPABILITY CONFIRMED': '  1. CAPACIDADE TELEPÁTICA CONFIRMADA',
    '     BIO-B demonstrates directed neural transmission.':
      '     BIO-B demonstra transmissão neural direcionada.',
    '     Content appears conceptual, not linguistic.':
      '     Conteúdo aparenta ser conceitual, não linguístico.',
    '     Receivers report "knowing" rather than "hearing."':
      '     Receptores relatam "saber" em vez de "ouvir."',
    '  2. SCOUT FUNCTION CONFIRMED': '  2. FUNÇÃO DE RECONHECIMENTO CONFIRMADA',
    '     Transmitted imagery includes topographical surveys,':
      '     Imagens transmitidas incluem levantamentos topográficos,',
    '     population density maps, and infrastructure schemas.':
      '     mapas de densidade populacional e esquemas de infraestrutura.',
    '     These beings were CATALOGUING our environment.':
      '     Estes seres estavam CATALOGANDO nosso ambiente.',
    '  3. TEMPORAL REFERENCE': '  3. REFERÊNCIA TEMPORAL',
    '     Recurring pattern in psi-comm output translates to':
      '     Padrão recorrente na saída psi-comm traduz-se em',
    '     cyclical temporal reference: "thirty rotations."':
      '     referência temporal cíclica: "trinta rotações."',
    '     Given context (1996 baseline), points to year 2026.':
      '     Dado o contexto (referência de 1996), aponta para o ano 2026.',
    '  4. NON-HOSTILE DISPOSITION': '  4. DISPOSIÇÃO NÃO HOSTIL',
    '     No aggressive psi-comm detected. Subjects appear':
      '     Nenhuma psi-comm agressiva detectada. Sujeitos parecem',
    '     to regard capture as expected, even planned.':
      '     considerar a captura como esperada, até planejada.',
    '     Assessment: Reconnaissance bio-constructs, not soldiers.':
      '     Avaliação: Bioconstrutos de reconhecimento, não soldados.',
    'CLASSIFICATION NOTE': 'NOTA DE CLASSIFICAÇÃO',
    '  This report was suppressed on 02/01/1996.': '  Este relatório foi suprimido em 01/02/1996.',
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
    'DIPLOMATIC CABLE — DELETED': 'CABO DIPLOMÁTICO — DELETADO',
    'ORIGIN: U.S. EMBASSY, BRASÍLIA': 'ORIGEM: EMBAIXADA DOS EUA, BRASÍLIA',
    'DESTINATION: LANGLEY, VIRGINIA': 'DESTINO: LANGLEY, VIRGÍNIA',
    'DATE: JANUARY 23, 1996': 'DATA: 23 DE JANEIRO DE 1996',
    'CLASSIFICATION: DESTROYED — RECOVERED FROM BACKUP TAPE':
      'CLASSIFICAÇÃO: DESTRUÍDO — RECUPERADO DE FITA DE BACKUP',
    'PRIORITY: FLASH': 'PRIORIDADE: FLASH',
    'SUBJECT: VARGINHA RECOVERY — FOREIGN ASSET DISPOSITION':
      'ASSUNTO: RECUPERAÇÃO DE VARGINHA — DISPOSIÇÃO DE ATIVOS ESTRANGEIROS',
    'MESSAGE BODY': 'CORPO DA MENSAGEM',
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
    '  Deniability window is closing.': '  A janela de negação plausível está se fechando.',
    'RESPONSE (LANGLEY)': 'RESPOSTA (LANGLEY)',
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
    '  monitored for 90 days.': '  monitoradas por 90 dias.',
    '  Regarding Tel Aviv: DENY. This remains bilateral.':
      '  Sobre Tel Aviv: NEGAR. Isto permanece bilateral.',
    '  Cable destroyed per standard diplomatic protocol.':
      '  Cabo destruído conforme protocolo diplomático padrão.',
    '  No record exists in FOIA-accessible databases.':
      '  Nenhum registro existe em bancos de dados acessíveis via FOIA.',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — convergence_model_draft.txt
    // ═══════════════════════════════════════════════════════════
    'CONVERGENCE MODEL — DRAFT (PURGED)': 'MODELO DE CONVERGÊNCIA — RASCUNHO (EXPURGADO)',
    'PROJECT SEED — TEMPORAL ANALYSIS DIVISION': 'PROJETO SEED — DIVISÃO DE ANÁLISE TEMPORAL',
    'DATE: FEBRUARY 3, 1996': 'DATA: 3 DE FEVEREIRO DE 1996',
    'TO: Director, Special Programs Division': 'PARA: Diretor, Divisão de Programas Especiais',
    'FROM: Temporal Analysis Unit': 'DE: Unidade de Análise Temporal',
    'RE: 2026 Convergence Window — Revised Assessment':
      'REF: Janela de Convergência 2026 — Avaliação Revisada',
    SUMMARY: 'RESUMO',
    '  Analysis of psi-comm fragments from BIO-A/B, combined':
      '  Análise de fragmentos psi-comm de BIO-A/B, combinada',
    '  with signal data from the recovered navigation array,':
      '  com dados de sinais do arranjo de navegação recuperado,',
    '  yields the following convergence model:': '  resulta no seguinte modelo de convergência:',
    '  ACTIVATION WINDOW: September 2026 (±2 months)':
      '  JANELA DE ATIVAÇÃO: Setembro de 2026 (±2 meses)',
    '  The "thirty rotations" reference in telepathic output':
      '  A referência "trinta rotações" na saída telepática',
    '  maps to 30 solar years from the 1996 baseline event.':
      '  corresponde a 30 anos solares a partir do evento de referência de 1996.',
    'MODEL PARAMETERS': 'PARÂMETROS DO MODELO',
    '  Phase 1: RECONNAISSANCE (Active — 1996)': '  Fase 1: RECONHECIMENTO (Ativo — 1996)',
    '    Scout bio-constructs deployed to survey target.':
      '    Bioconstrutos batedores destacados para levantar o alvo.',
    '    Data transmitted via psi-band to external receiver.':
      '    Dados transmitidos via banda-psi para receptor externo.',
    '  Phase 2: SEEDING (Passive — 1996-2026)': '  Fase 2: SEMEADURA (Passiva — 1996-2026)',
    '    Biological material left in custody triggers gradual':
      '    Material biológico deixado em custódia desencadeia',
    '    neurological sensitization in exposed personnel.':
      '    sensibilização neurológica gradual no pessoal exposto.',
    '    "Carriers" unknowingly propagate signal receptivity.':
      '    "Portadores" propagam inconscientemente receptividade ao sinal.',
    '  Phase 3: TRANSITION (Projected — 2026)': '  Fase 3: TRANSIÇÃO (Projetada — 2026)',
    '    Full-spectrum activation of seeded neural pathways.':
      '    Ativação de espectro completo das vias neurais semeadas.',
    '    Nature of transition remains UNKNOWN.':
      '    A natureza da transição permanece DESCONHECIDA.',
    '    Best case: Communication channel opens.':
      '    Melhor cenário: Canal de comunicação se abre.',
    '    Worst case: [DATA EXPUNGED]': '    Pior cenário: [DADOS EXPURGADOS]',
    DISPOSITION: 'DISPOSIÇÃO',
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
    "  The math doesn't lie. Something is coming.": '  A matemática não mente. Algo está vindo.',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILES — UFO74 REACTIONS
    // ═══════════════════════════════════════════════════════════
    'UFO74: shit, this is heavy kid... but not our mission.':
      'UFO74: caralho, isso é pesado moleque... mas não é nossa missão.',
    '       lets move on.': '       vamos em frente.',
    'UFO74: damn. theyre into everything.': 'UFO74: caralho. eles tão metidos em tudo.',
    '       but focus — we have bigger fish.': '       mas foca — temos peixes maiores.',
    'UFO74: ha. humans and their schemes.': 'UFO74: ha. humanos e seus esquemas.',
    '       stay on target.': '       mantém o foco.',
    'UFO74: interesting... but not why were here.':
      'UFO74: interessante... mas não é por isso que estamos aqui.',
    '       dont get distracted.': '       não se distraia.',
    'UFO74: yeah, ive seen this before.': 'UFO74: é, já vi isso antes.',
    '       not our problem today.': '       não é nosso problema hoje.',
    'UFO74: heavy stuff. file it under "later."': 'UFO74: papo pesado. arquiva em "depois."',
    '       we have work to do.': '       temos trabalho a fazer.',
    'UFO74: huh. they really do this stuff.': 'UFO74: hm. eles realmente fazem isso.',
    '       but we got our own problems kid.':
      '       mas a gente tem nossos próprios problemas moleque.',
    'UFO74: humans... always scheming.': 'UFO74: humanos... sempre tramando.',
    '       eyes on the prize.': '       olho no prêmio.',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 1 — ECONOMIC TRANSITION MEMO
    // ═══════════════════════════════════════════════════════════
    'INTERNAL MEMORANDUM — ECONOMIC RESEARCH DIVISION':
      'MEMORANDO INTERNO — DIVISÃO DE PESQUISA ECONÔMICA',
    'DATE: 08-NOV-1995': 'DATA: 08-NOV-1995',
    'CLASSIFICATION: INTERNAL USE ONLY': 'CLASSIFICAÇÃO: SOMENTE USO INTERNO',
    'TO: Deputy Director, Strategic Planning': 'PARA: Diretor Adjunto, Planejamento Estratégico',
    'FROM: Economic Futures Working Group': 'DE: Grupo de Trabalho de Futuros Econômicos',
    'RE: Decentralized Currency Prototype — Phase II Assessment':
      'REF: Protótipo de Moeda Descentralizada — Avaliação Fase II',
    'Per your request, we have completed preliminary testing of':
      'Conforme solicitado, completamos os testes preliminares do',
    'the distributed ledger monetary system ("Project COIN").':
      'sistema monetário de registro distribuído ("Projeto COIN").',
    'KEY FINDINGS:': 'ACHADOS PRINCIPAIS:',
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
    'RECOMMENDATION:': 'RECOMENDAÇÃO:',
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
    '  [signature]': '  [assinatura]',
    '  S.N.': '  S.N.',
    '  Lead Cryptographer, Economic Futures': '  Criptógrafo Líder, Futuros Econômicos',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 2 — APOLLO MEDIA GUIDELINES
    // ═══════════════════════════════════════════════════════════
    'PUBLIC AFFAIRS GUIDANCE — LUNAR PROGRAM DOCUMENTATION':
      'ORIENTAÇÃO DE ASSUNTOS PÚBLICOS — DOCUMENTAÇÃO DO PROGRAMA LUNAR',
    'DOCUMENT: PA-1969-07 (DECLASSIFIED EXCERPT)': 'DOCUMENTO: PA-1969-07 (TRECHO DESCLASSIFICADO)',
    'ORIGINAL DATE: 14-JUL-1969': 'DATA ORIGINAL: 14-JUL-1969',
    'SUBJECT: Handling Visual Inconsistencies in Mission Footage':
      'ASSUNTO: Tratamento de Inconsistências Visuais em Filmagens da Missão',
    'BACKGROUND:': 'CONTEXTO:',
    '  During post-production review of lunar surface footage,':
      '  Durante a revisão de pós-produção das filmagens da superfície lunar,',
    '  technical staff identified several lighting anomalies':
      '  a equipe técnica identificou diversas anomalias de iluminação',
    '  that may generate public confusion.': '  que podem gerar confusão pública.',
    'IDENTIFIED ISSUES:': 'PROBLEMAS IDENTIFICADOS:',
    '  - Shadow direction variance in Frames 1247-1289':
      '  - Variação na direção das sombras nos Quadros 1247-1289',
    '  - Multiple apparent light sources in EVA footage':
      '  - Múltiplas fontes de luz aparentes nas filmagens EVA',
    '  - Crosshair positioning behind foreground objects':
      '  - Posicionamento da retícula atrás de objetos em primeiro plano',
    '  - Flag movement without atmospheric conditions':
      '  - Movimento da bandeira sem condições atmosféricas',
    'GUIDANCE:': 'ORIENTAÇÃO:',
    '  1. Do NOT proactively address these inconsistencies.':
      '  1. NÃO abordar proativamente essas inconsistências.',
    '  2. If questioned, attribute anomalies to:': '  2. Se questionado, atribuir anomalias a:',
    '     a) Camera lens artifacts': '     a) Artefatos da lente da câmera',
    '     b) Reflected light from lunar surface': '     b) Luz refletida da superfície lunar',
    '     c) Electromagnetic interference with equipment':
      '     c) Interferência eletromagnética nos equipamentos',
    '  3. Under NO circumstances acknowledge that backup':
      '  3. Sob NENHUMA circunstância reconhecer que filmagens',
    '     footage was prepared at [REDACTED] facility.':
      '     de backup foram preparadas na instalação [REDIGIDO].',
    '  4. Emphasize mission success narrative over technical':
      '  4. Enfatizar a narrativa de sucesso da missão sobre detalhes',
    '     details of visual documentation.': '     técnicos da documentação visual.',
    'NOTE: This guidance supersedes previous directives.':
      'NOTA: Esta orientação substitui diretivas anteriores.',
    'APPROVED BY: DIR. COMMUNICATIONS': 'APROVADO POR: DIR. COMUNICAÇÕES',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 3 — WEATHER PATTERN INTERVENTION
    // ═══════════════════════════════════════════════════════════
    'PROJECT CIRRUS — OPERATIONAL LOG': 'PROJETO CIRRUS — LOG OPERACIONAL',
    'CLASSIFICATION: SENSITIVE': 'CLASSIFICAÇÃO: SENSÍVEL',
    'PERIOD: OCT 1995 - JAN 1996': 'PERÍODO: OUT 1995 - JAN 1996',
    '12-OCT-1995 0600': '12-OUT-1995 0600',
    '  Aerosol dispersal flight ALT-1174 completed.':
      '  Voo de dispersão de aerossol ALT-1174 concluído.',
    '  Payload: 4.2 metric tons barium sulfate compound':
      '  Carga: 4,2 toneladas métricas de composto de sulfato de bário',
    '  Target: Atlantic hurricane formation zone':
      '  Alvo: Zona de formação de furacões do Atlântico',
    '  Altitude: 38,000 ft': '  Altitude: 38.000 pés',
    '  Duration: 6.4 hours': '  Duração: 6,4 horas',
    '15-OCT-1995 1400': '15-OUT-1995 1400',
    '  Post-dispersal analysis indicates successful seeding.':
      '  Análise pós-dispersão indica semeadura bem-sucedida.',
    '  Projected storm TD-17 failed to organize.':
      '  A tempestade projetada TD-17 não se organizou.',
    '  NOTE: Unintended precipitation in [REDACTED] region.':
      '  NOTA: Precipitação não intencional na região [REDIGIDO].',
    '23-NOV-1995 0800': '23-NOV-1995 0800',
    '  Flight ALT-1198 encountered mechanical issues.':
      '  Voo ALT-1198 encontrou problemas mecânicos.',
    '  Payload released early over continental area.':
      '  Carga liberada prematuramente sobre área continental.',
    '  INCIDENT REPORT FILED. Cover story: contrail testing.':
      '  RELATÓRIO DE INCIDENTE REGISTRADO. História de cobertura: teste de rastro de condensação.',
    '07-DEC-1995 1100': '07-DEZ-1995 1100',
    '  Side effect observation: Increased respiratory':
      '  Observação de efeito colateral: Aumento de queixas',
    '  complaints in dispersal corridor populations.':
      '  respiratórias nas populações do corredor de dispersão.',
    '  Recommend adjusting compound mixture for Q1 1996.':
      '  Recomenda-se ajustar a mistura do composto para Q1 1996.',
    '14-JAN-1996 0900': '14-JAN-1996 0900',
    '  New directive received: Expand program to include':
      '  Nova diretiva recebida: Expandir o programa para incluir',
    '  reflective particulate testing for solar management.':
      '  testes de partículas reflexivas para gestão solar.',
    '  Aluminum oxide compounds approved for trial.':
      '  Compostos de óxido de alumínio aprovados para teste.',
    'END LOG — NEXT REVIEW: 01-APR-1996': 'FIM DO LOG — PRÓXIMA REVISÃO: 01-ABR-1996',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 4 — BEHAVIORAL COMPLIANCE STUDY
    // ═══════════════════════════════════════════════════════════
    'CONSUMER BEHAVIOR RESEARCH — ACOUSTIC INFLUENCE STUDY':
      'PESQUISA DE COMPORTAMENTO DO CONSUMIDOR — ESTUDO DE INFLUÊNCIA ACÚSTICA',
    'PROJECT: TEMPO': 'PROJETO: TEMPO',
    'DATE: Q4 1995 FINAL REPORT': 'DATA: RELATÓRIO FINAL Q4 1995',
    'STUDY OVERVIEW:': 'VISÃO GERAL DO ESTUDO:',
    '  In partnership with [REDACTED] retail chains, this study':
      '  Em parceria com redes varejistas [REDIGIDO], este estudo',
    '  evaluated the effect of ambient audio parameters on':
      '  avaliou o efeito de parâmetros de áudio ambiente no',
    '  consumer behavior patterns.': '  padrões de comportamento do consumidor.',
    'METHODOLOGY:': 'METODOLOGIA:',
    '  - 847 retail locations participated': '  - 847 locais de varejo participaram',
    '  - Music tempo varied from 60-120 BPM across test groups':
      '  - Ritmo musical variado de 60-120 BPM entre grupos de teste',
    '  - Subliminal audio tones embedded at 17.5 Hz':
      '  - Tons de áudio subliminar incorporados a 17,5 Hz',
    '  - Control group received standard muzak programming':
      '  - Grupo controle recebeu programação muzak padrão',
    'FINDINGS:': 'ACHADOS:',
    '  1. TEMPO CORRELATION': '  1. CORRELAÇÃO DE RITMO',
    '     - 72 BPM: 18% increase in browsing duration':
      '     - 72 BPM: aumento de 18% na duração de navegação',
    '     - 108 BPM: 23% increase in purchase velocity':
      '     - 108 BPM: aumento de 23% na velocidade de compra',
    '     - 60 BPM: Measurable increase in high-margin purchases':
      '     - 60 BPM: Aumento mensurável em compras de alta margem',
    '  2. SUBLIMINAL TONE EFFECTS': '  2. EFEITOS DE TOM SUBLIMINAR',
    '     - 17.5 Hz baseline: Elevated stress markers':
      '     - 17,5 Hz referência: Marcadores de estresse elevados',
    '     - 12 Hz modification: Reduced price sensitivity':
      '     - Modificação 12 Hz: Sensibilidade a preço reduzida',
    '     - Combined with verbal suggestions: Inconclusive':
      '     - Combinado com sugestões verbais: Inconclusivo',
    '  3. OPTIMAL CONFIGURATION': '  3. CONFIGURAÇÃO ÓTIMA',
    '     - Morning: 108 BPM (urgency)': '     - Manhã: 108 BPM (urgência)',
    '     - Afternoon: 72 BPM (extended browsing)': '     - Tarde: 72 BPM (navegação estendida)',
    '     - Pre-closing: 120 BPM (clear out)': '     - Pré-fechamento: 120 BPM (esvaziamento)',
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
    'CLASSIFICATION: RESTRICTED': 'CLASSIFICAÇÃO: RESTRITA',
    'DATE: SEP 1995': 'DATA: SET 1995',
    'EXERCISE OBJECTIVE:': 'OBJETIVO DO EXERCÍCIO:',
    '  Evaluate civil response to extended grid failure with':
      '  Avaliar resposta civil a falha prolongada da rede com',
    '  concurrent communications infrastructure collapse.':
      '  colapso simultâneo da infraestrutura de comunicações.',
    'SIMULATION PARAMETERS:': 'PARÂMETROS DA SIMULAÇÃO:',
    '  - Duration: 72 hours (extended to 168 hours)':
      '  - Duração: 72 horas (estendido para 168 horas)',
    '  - Population centers: 3 metropolitan areas':
      '  - Centros populacionais: 3 áreas metropolitanas',
    '  - Communications: Landline and cellular disabled':
      '  - Comunicações: Telefonia fixa e celular desativadas',
    '  - Emergency services: Degraded capacity (40%)':
      '  - Serviços de emergência: Capacidade degradada (40%)',
    'PHASE RESULTS:': 'RESULTADOS POR FASE:',
    '  0-12 HOURS:': '  0-12 HORAS:',
    '    - Civil order maintained': '    - Ordem civil mantida',
    '    - Emergency calls exceeded capacity by hour 4':
      '    - Chamadas de emergência excederam capacidade na hora 4',
    '    - Fuel station queues exceeded 2 miles':
      '    - Filas em postos de combustível excederam 3 km',
    '  12-48 HOURS:': '  12-48 HORAS:',
    '    - Significant increase in property crime':
      '    - Aumento significativo em crimes contra patrimônio',
    '    - Hospital generators failed in 2 facilities':
      '    - Geradores hospitalares falharam em 2 instalações',
    '    - Water pressure loss in elevated areas':
      '    - Perda de pressão de água em áreas elevadas',
    '  48-168 HOURS:': '  48-168 HORAS:',
    '    - Civil order breakdown in [REDACTED] sector':
      '    - Colapso da ordem civil no setor [REDIGIDO]',
    '    - National Guard deployment simulated at hour 96':
      '    - Destacamento da Guarda Nacional simulado na hora 96',
    '    - Food supply chain: Total collapse by hour 120':
      '    - Cadeia de suprimento alimentar: Colapso total na hora 120',
    'KEY FINDING:': 'ACHADO PRINCIPAL:',
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
    'CONTINENTAL AVIAN SURVEILLANCE NETWORK': 'REDE CONTINENTAL DE VIGILÂNCIA AVIÁRIA',
    'QUARTERLY DEPLOYMENT REPORT — Q4 1995': 'RELATÓRIO TRIMESTRAL DE IMPLANTAÇÃO — Q4 1995',
    'UNIT_ID,SPECIES_COVER,REGION,BATTERY_LIFE,PAYLOAD':
      'ID_UNIDADE,ESPÉCIE_COBERTURA,REGIÃO,VIDA_BATERIA,CARGA',
    'DEPLOYMENT NOTES:': 'NOTAS DE IMPLANTAÇÃO:',
    '  - Q4 migration routes successfully tracked':
      '  - Rotas migratórias Q4 rastreadas com sucesso',
    '  - Signal relay coverage: 94.2% continental':
      '  - Cobertura de retransmissão de sinal: 94,2% continental',
    '  - Urban density exceeds rural by factor of 8.4':
      '  - Densidade urbana excede rural por fator de 8,4',
    '  - Maintenance disguised as "wildlife research"':
      '  - Manutenção disfarçada como "pesquisa de vida selvagem"',
    'ANOMALY LOG:': 'LOG DE ANOMALIAS:',
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
    'PROJECT: WHISPER': 'PROJETO: WHISPER',
    'DATE: 19-DEC-1995': 'DATA: 19-DEZ-1995',
    'TO: Technical Collection Division': 'PARA: Divisão de Coleta Técnica',
    'FROM: Consumer Electronics Liaison': 'DE: Ligação com Eletrônicos de Consumo',
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
    '  - Clock radios (prototype phase)': '  - Rádios-relógio (fase de protótipo)',
    'CAPABILITIES:': 'CAPACIDADES:',
    '  - Continuous ambient audio capture': '  - Captura contínua de áudio ambiente',
    '  - Keyword activation for priority recording':
      '  - Ativação por palavra-chave para gravação prioritária',
    '  - Emotional distress pattern detection (experimental)':
      '  - Detecção de padrão de angústia emocional (experimental)',
    '  - Data burst transmission during off-peak hours':
      '  - Transmissão de dados em rajada durante horários fora de pico',
    'PRIVACY CONCERNS:': 'PREOCUPAÇÕES COM PRIVACIDADE:',
    '  Legal has advised that current wiretap statutes':
      '  O jurídico informou que os estatutos atuais de escuta',
    '  do not explicitly cover ambient collection from':
      '  não cobrem explicitamente a coleta ambiente de',
    '  voluntarily purchased consumer devices.':
      '  dispositivos de consumo adquiridos voluntariamente.',
    '  Recommend maintaining this legal ambiguity.':
      '  Recomenda-se manter esta ambiguidade jurídica.',
    'NEXT PHASE:': 'PRÓXIMA FASE:',
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
    'NOTICE: DMD-1995-47': 'AVISO: DMD-1995-47',
    'DATE: 03-OCT-1995': 'DATA: 03-OUT-1995',
    'SUBJECT: Historical Image Archive Modernization':
      'ASSUNTO: Modernização do Arquivo de Imagens Históricas',
    'DIRECTIVE:': 'DIRETIVA:',
    '  As part of our digital preservation initiative, all':
      '  Como parte de nossa iniciativa de preservação digital, todos os',
    '  historical photographic records are being converted':
      '  registros fotográficos históricos estão sendo convertidos',
    '  to digital format using the MASTER CLEAN protocol.':
      '  para formato digital usando o protocolo MASTER CLEAN.',
    'PROCEDURE:': 'PROCEDIMENTO:',
    '  1. Original photographs scanned at high resolution':
      '  1. Fotografias originais digitalizadas em alta resolução',
    '  2. Digital restoration applied per Guidelines Appendix C':
      '  2. Restauração digital aplicada conforme Apêndice C das Diretrizes',
    '  3. "Cleaned master versions" replace originals in archive':
      '  3. "Versões master limpas" substituem originais no arquivo',
    '  4. Original prints transferred to [REDACTED] facility':
      '  4. Cópias originais transferidas para instalação [REDIGIDO]',
    'RESTORATION GUIDELINES (EXCERPT):': 'DIRETRIZES DE RESTAURAÇÃO (TRECHO):',
    '  - Remove inadvertent civilian faces (privacy)':
      '  - Remover rostos civis inadvertidos (privacidade)',
    '  - Correct lighting inconsistencies': '  - Corrigir inconsistências de iluminação',
    '  - Standardize official personnel positioning':
      '  - Padronizar posicionamento de pessoal oficial',
    '  - Eliminate background elements causing "confusion"':
      '  - Eliminar elementos de fundo causando "confusão"',
    'SPECIAL HANDLING:': 'TRATAMENTO ESPECIAL:',
    '  Images flagged in Categories 7-12 require review by':
      '  Imagens sinalizadas nas Categorias 7-12 requerem revisão pelo',
    '  Historical Accuracy Committee before digitization.':
      '  Comitê de Precisão Histórica antes da digitalização.',
    '  These include:': '  Incluem:',
    '    - Political figures in "inconsistent" contexts':
      '    - Figuras políticas em contextos "inconsistentes"',
    '    - Military operations with "unclear" narratives':
      '    - Operações militares com narrativas "obscuras"',
    '    - Events with "disputed" official records':
      '    - Eventos com registros oficiais "disputados"',
    'NOTE: This process is administrative only.': 'NOTA: Este processo é apenas administrativo.',
    '      No historical record is being altered.':
      '      Nenhum registro histórico está sendo alterado.',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 9 — EDUCATION CURRICULUM REVISION
    // ═══════════════════════════════════════════════════════════
    'CURRICULUM ADVISORY COMMITTEE — WORKING NOTES':
      'COMITÊ CONSULTIVO DE CURRÍCULO — NOTAS DE TRABALHO',
    'MEETING: 14-AUG-1995': 'REUNIÃO: 14-AGO-1995',
    'CLASSIFICATION: INTERNAL': 'CLASSIFICAÇÃO: INTERNA',
    'ATTENDEES: [REDACTED]': 'PARTICIPANTES: [REDIGIDO]',
    'AGENDA ITEM 3: Historical Narrative Simplification':
      'ITEM DA PAUTA 3: Simplificação da Narrativa Histórica',
    'DISCUSSION SUMMARY:': 'RESUMO DA DISCUSSÃO:',
    '  Committee reviewed proposals for streamlining historical':
      '  Comitê revisou propostas para simplificar o conteúdo',
    '  content in secondary education materials.': '  histórico nos materiais do ensino médio.',
    'KEY RECOMMENDATIONS:': 'RECOMENDAÇÕES PRINCIPAIS:',
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
    '     should receive reduced curriculum time.': '     devem receber tempo curricular reduzido.',
    'RATIONALE:': 'JUSTIFICATIVA:',
    '  Research indicates complex narratives correlate with:':
      '  Pesquisas indicam que narrativas complexas se correlacionam com:',
    '    - Reduced institutional trust': '    - Confiança institucional reduzida',
    '    - Increased political polarization': '    - Polarização política aumentada',
    '    - Lower social cohesion metrics': '    - Métricas de coesão social mais baixas',
    '  Simplified narratives support unified civic identity.':
      '  Narrativas simplificadas apoiam identidade cívica unificada.',
    'IMPLEMENTATION:': 'IMPLEMENTAÇÃO:',
    '  - Phase out nuanced source analysis by Grade 10':
      '  - Eliminar gradualmente análise crítica de fontes até o 1º ano',
    '  - Emphasize "shared heritage" over critical evaluation':
      '  - Enfatizar "patrimônio compartilhado" sobre avaliação crítica',
    '  - Textbook publishers to receive guidelines Q1 1996':
      '  - Editoras de livros didáticos receberão diretrizes Q1 1996',
    'MOTION CARRIED: 7-2': 'MOÇÃO APROVADA: 7-2',
    '[END NOTES]': '[FIM DAS NOTAS]',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 10 — SATELLITE LIGHT REFLECTION
    // ═══════════════════════════════════════════════════════════
    'PROJECT NIGHTLIGHT — FEASIBILITY ASSESSMENT': 'PROJETO NIGHTLIGHT — AVALIAÇÃO DE VIABILIDADE',
    'DATE: 22-NOV-1995': 'DATA: 22-NOV-1995',
    'OBJECTIVE:': 'OBJETIVO:',
    '  Evaluate deployment of orbital reflective arrays for':
      '  Avaliar implantação de conjuntos refletivos orbitais para',
    '  urban illumination and psychological operations.':
      '  iluminação urbana e operações psicológicas.',
    'TECHNICAL SUMMARY:': 'RESUMO TÉCNICO:',
    '  - Mylar reflector panels: 500m² deployed area':
      '  - Painéis refletores de Mylar: área implantada de 500m²',
    '  - Orbital altitude: 400km (ISS equivalent)': '  - Altitude orbital: 400km (equivalente ISS)',
    '  - Ground illumination: ~10% full moon equivalent':
      '  - Iluminação terrestre: ~10% equivalente à lua cheia',
    '  - Targeting precision: 50km radius spotlight':
      '  - Precisão de alvo: holofote de raio de 50km',
    'TEST RESULTS:': 'RESULTADOS DOS TESTES:',
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
    '                         reports attributed to': '                         civis atribuídos a',
    '                         "atmospheric phenomena."':
      '                         "fenômenos atmosféricos."',
    'APPLICATIONS:': 'APLICAÇÕES:',
    '  1. Emergency illumination during disasters':
      '  1. Iluminação de emergência durante desastres',
    '  2. Agricultural growing season extension': '  2. Extensão da temporada agrícola de cultivo',
    '  3. Urban crime reduction via night visibility':
      '  3. Redução da criminalidade urbana via visibilidade noturna',
    '  4. [CLASSIFIED] psychological operations capability':
      '  4. [CLASSIFICADO] capacidade de operações psicológicas',
    'CONCERNS:': 'PREOCUPAÇÕES:',
    '  - Astronomical community interference likely':
      '  - Interferência da comunidade astronômica provável',
    '  - Religious/cultural reactions unpredictable':
      '  - Reações religiosas/culturais imprevisíveis',
    '  - Light pollution effects unknown': '  - Efeitos de poluição luminosa desconhecidos',
    '  Continue covert testing. Full deployment contingent':
      '  Continuar testes encobertos. Implantação total contingente',
    '  on cover story development and international':
      '  ao desenvolvimento de história de cobertura e protocolos',
    '  notification protocols.': '  de notificação internacional.',
    // ═══ expansionContent.ts — journalist_payments ═══
    '[ENCRYPTED - FINANCIAL RECORDS]': '[CRIPTOGRAFADO - REGISTROS FINANCEIROS]',
    'Legacy wrapper retired. Open the file to review the recovered record.':
      'Wrapper legado desativado. Abra o arquivo para revisar o registro recuperado.',
    'WARNING: Unauthorized access to financial records':
      'AVISO: Acesso não autorizado a registros financeiros',
    'is punishable under Article 317.': 'é punível sob o Artigo 317.',
    'DISBURSEMENT RECORD — MEDIA RELATIONS': 'REGISTRO DE DESEMBOLSO — RELAÇÕES COM A MÍDIA',
    'ACCOUNT: SPECIAL OPERATIONS FUND': 'CONTA: FUNDO DE OPERAÇÕES ESPECIAIS',
    'PERIOD: JAN-FEB 1996': 'PERÍODO: JAN-FEV 1996',
    'CLASSIFICATION: EYES ONLY': 'CLASSIFICAÇÃO: SOMENTE PARA SEUS OLHOS',
    'PAYMENTS AUTHORIZED:': 'PAGAMENTOS AUTORIZADOS:',
    '  23-JAN — R$ 15,000.00 — RODRIGUES, A.': '  23-JAN — R$ 15.000,00 — RODRIGUES, A.',
    '           Outlet: O Diário Nacional (Rio bureau)':
      '           Veículo: O Diário Nacional (sucursal Rio)',
    '           Purpose: Story suppression': '           Finalidade: Supressão de matéria',
    '           Status: CONFIRMED KILL': '           Status: ELIMINAÇÃO CONFIRMADA',
    '  25-JAN — R$ 8,500.00 — NASCIMENTO, C.': '  25-JAN — R$ 8.500,00 — NASCIMENTO, C.',
    '           Outlet: Folha Paulista': '           Veículo: Folha Paulista',
    '           Purpose: Alternate narrative placement':
      '           Finalidade: Inserção de narrativa alternativa',
    '           Status: PUBLISHED (homeless man angle)':
      '           Status: PUBLICADO (ângulo do morador de rua)',
    '  27-JAN — R$ 22,000.00 — [REDACTED]': '  27-JAN — R$ 22.000,00 — [SUPRIMIDO]',
    '           Outlet: Rede Nacional (TV)': '           Veículo: Rede Nacional (TV)',
    '           Purpose: Programa Dominical segment cancellation':
      '           Finalidade: Cancelamento de segmento do Programa Dominical',
    '           Status: SEGMENT PULLED': '           Status: SEGMENTO RETIRADO',
    '  30-JAN — R$ 5,000.00 — COSTA, R.': '  30-JAN — R$ 5.000,00 — COSTA, R.',
    '           Outlet: Estado de Minas': '           Veículo: Estado de Minas',
    '           Purpose: Editorial pressure': '           Finalidade: Pressão editorial',
    '           Status: OPINION PIECE SPIKED': '           Status: ARTIGO DE OPINIÃO VETADO',
    '  02-FEB — R$ 12,000.00 — FERREIRA, J.': '  02-FEV — R$ 12.000,00 — FERREIRA, J.',
    '           Outlet: Revista Isto': '           Veículo: Revista Isto',
    '           Purpose: Issue delay (cover story change)':
      '           Finalidade: Atraso de edição (mudança de capa)',
    '           Status: MARCH ISSUE SUBSTITUTED': '           Status: EDIÇÃO DE MARÇO SUBSTITUÍDA',
    'TOTAL DISBURSED: R$ 62,500.00': 'TOTAL DESEMBOLSADO: R$ 62.500,00',
    'NOTE: All payments routed through agricultural cooperative':
      'NOTA: Todos os pagamentos encaminhados via cooperativa agrícola',
    '      shell account. Paper trail clean.': '      conta fantasma. Rastro documental limpo.',
    'APPROVED: [SIGNATURE REDACTED]': 'APROVADO: [ASSINATURA SUPRIMIDA]',
    // ═══ expansionContent.ts — media_contacts ═══
    'MEDIA CONTACTS — COOPERATIVE JOURNALISTS': 'CONTATOS NA MÍDIA — JORNALISTAS COOPERATIVOS',
    'COMPILED: DECEMBER 1995 (UPDATED JAN 1996)': 'COMPILADO: DEZEMBRO 1995 (ATUALIZADO JAN 1996)',
    'TELEVISION:': 'TELEVISÃO:',
    '  Rede Nacional (TV Nacional)': '  Rede Nacional (TV Nacional)',
    '    SANTOS, Eduardo — News Director': '    SANTOS, Eduardo — Diretor de Jornalismo',
    '    Direct line: (021) 555-7823': '    Linha direta: (021) 555-7823',
    '    Reliability: HIGH': '    Confiabilidade: ALTA',
    '    History: Cooperative since 1989': '    Histórico: Cooperativo desde 1989',
    '  TV Regional Sul': '  TV Regional Sul',
    '    [REDACTED] — Assignment Editor': '    [SUPRIMIDO] — Editor de Pauta',
    '    Direct line: (035) 555-4412': '    Linha direta: (035) 555-4412',
    '    Reliability: MODERATE': '    Confiabilidade: MODERADA',
    '    Note: Requires advance notice': '    Nota: Requer aviso prévio',
    'PRINT:': 'IMPRENSA:',
    '  O Diário Nacional': '  O Diário Nacional',
    '    RODRIGUES, André — City Desk Chief': '    RODRIGUES, André — Chefe de Redação Local',
    '    Direct line: (021) 555-9034': '    Linha direta: (021) 555-9034',
    '    Note: Has killed 3 stories for us': '    Nota: Já eliminou 3 matérias para nós',
    '  Folha Paulista': '  Folha Paulista',
    '    [REDACTED] — Senior Editor': '    [SUPRIMIDO] — Editor Sênior',
    '    Direct line: (011) 555-2156': '    Linha direta: (011) 555-2156',
    '    Note: Prefers placement over suppression': '    Nota: Prefere inserção a supressão',
    '  Estado de Minas': '  Estado de Minas',
    '    PEREIRA, Helena — Regional Bureau': '    PEREIRA, Helena — Sucursal Regional',
    '    Direct line: (031) 555-8877': '    Linha direta: (031) 555-8877',
    '    Reliability: HIGH (local knowledge)': '    Confiabilidade: ALTA (conhecimento local)',
    '    Note: Family connection to military': '    Nota: Conexão familiar com o militar',
    'MAGAZINES:': 'REVISTAS:',
    '  Revista Isto': '  Revista Isto',
    '    ALMEIDA, Ricardo — Features Editor': '    ALMEIDA, Ricardo — Editor de Reportagens',
    '    Direct line: (011) 555-6543': '    Linha direta: (011) 555-6543',
    '    Note: Slow but reliable': '    Nota: Lento mas confiável',
    'AVOID:': 'EVITAR:',
    '  Revista Fenômenos (UFO publication)': '  Revista Fenômenos (publicação sobre OVNIs)',
    '    CANNOT be controlled': '    NÃO PODE ser controlado',
    '    Editor PACACCINI known hostile': '    Editor PACACCINI reconhecidamente hostil',
    '    Monitor only, do not engage': '    Apenas monitorar, não engajar',
    // ═══ expansionContent.ts — kill_story_memo ═══
    'URGENT MEMORANDUM — MEDIA SUPPRESSION': 'MEMORANDO URGENTE — SUPRESSÃO DE MÍDIA',
    'DATE: 26-JAN-1996': 'DATA: 26-JAN-1996',
    'FROM: Public Affairs Liaison': 'DE: Assessor de Relações Públicas',
    'TO: Regional Directors': 'PARA: Diretores Regionais',
    'SUBJECT: Immediate Action Required': 'ASSUNTO: Ação Imediata Necessária',
    'The following stories are in development and must be':
      'As seguintes matérias estão em desenvolvimento e devem ser',
    'suppressed before publication/broadcast:': 'suprimidas antes da publicação/transmissão:',
    '1. PROGRAMA DOMINICAL (Rede Nacional)': '1. PROGRAMA DOMINICAL (Rede Nacional)',
    '   Scheduled: Sunday 28-JAN, 21:00': '   Programado: Domingo 28-JAN, 21:00',
    '   Topic: "Varginha Mystery — What the Military Hides"':
      '   Tema: "Mistério de Varginha — O Que os Militares Escondem"',
    '   Status: KILL CONFIRMED': '   Status: ELIMINAÇÃO CONFIRMADA',
    '   Action: Contact made with news director':
      '   Ação: Contato feito com diretor de jornalismo',
    '   Replacement segment: Carnival preparations':
      '   Segmento substituto: Preparativos para o Carnaval',
    '2. FOLHA PAULISTA': '2. FOLHA PAULISTA',
    '   Scheduled: 29-JAN morning edition': '   Programado: 29-JAN edição matutina',
    '   Topic: Front page investigation piece': '   Tema: Matéria investigativa de capa',
    '   Status: IN PROGRESS': '   Status: EM ANDAMENTO',
    '   Action: Redirect to "homeless man" angle':
      '   Ação: Redirecionar para ângulo do "morador de rua"',
    '   Payment: Authorized': '   Pagamento: Autorizado',
    '3. REVISTA ISTO': '3. REVISTA ISTO',
    '   Scheduled: February issue (already at printer)':
      '   Programado: Edição de fevereiro (já na gráfica)',
    '   Topic: 8-page cover story': '   Tema: Matéria de capa de 8 páginas',
    '   Status: CRITICAL': '   Status: CRÍTICO',
    '   Action: Delay print run, substitute cover': '   Ação: Atrasar impressão, substituir capa',
    '   Note: Higher payment required': '   Nota: Pagamento maior necessário',
    'APPROACH GUIDELINES:': 'DIRETRIZES DE ABORDAGEM:',
    '  - Lead with "national security" concern':
      '  - Liderar com preocupação de "segurança nacional"',
    '  - Offer exclusive on substitute story': '  - Oferecer exclusividade em matéria substituta',
    '  - Payment is last resort': '  - Pagamento é último recurso',
    '  - Document nothing in writing': '  - Não documentar nada por escrito',
    'ESCALATION:': 'ESCALONAMENTO:',
    '  If journalist is uncooperative, refer to': '  Se o jornalista não cooperar, encaminhar ao',
    '  Protocol SOMBRA for additional measures.': '  Protocolo SOMBRA para medidas adicionais.',
    // ═══ expansionContent.ts — tv_coverage_report ═══
    'INTELLIGENCE REPORT — TV COVERAGE THREAT':
      'RELATÓRIO DE INTELIGÊNCIA — AMEAÇA DE COBERTURA TELEVISIVA',
    'DATE: 25-JAN-1996': 'DATA: 25-JAN-1996',
    'PRIORITY: HIGH': 'PRIORIDADE: ALTA',
    'SUBJECT: Programa Dominical (Rede Nacional)': 'ASSUNTO: Programa Dominical (Rede Nacional)',
    "  Brazil's highest-rated Sunday program.":
      '  Programa dominical de maior audiência do Brasil.',
    '  Audience: 40+ million viewers.': '  Audiência: 40+ milhões de telespectadores.',
    '  Time slot: 21:00-23:30': '  Faixa horária: 21:00-23:30',
    'THREAT ASSESSMENT:': 'AVALIAÇÃO DE AMEAÇA:',
    '  Production team dispatched to Varginha 24-JAN.':
      '  Equipe de produção enviada a Varginha 24-JAN.',
    '  Interviewed local witnesses (uncontrolled).':
      '  Entrevistaram testemunhas locais (sem controle).',
    '  Obtained amateur video footage (unverified).':
      '  Obtiveram filmagens amadoras (não verificadas).',
    '  Segment scheduled for 28-JAN broadcast.':
      '  Segmento programado para transmissão de 28-JAN.',
    'CONTENT PREVIEW (obtained via source):': 'PRÉVIA DO CONTEÚDO (obtida via fonte):',
    '  - Interviews with the three sisters': '  - Entrevistas com as três irmãs',
    '  - Military vehicle footage': '  - Filmagens de veículos militares',
    '  - Hospital security guard statement': '  - Depoimento do segurança do hospital',
    '  - "Expert" commentary (civilian ufologist)':
      '  - Comentário de "especialista" (ufólogo civil)',
    'DAMAGE POTENTIAL:': 'POTENCIAL DE DANO:',
    '  SEVERE — Nationwide exposure impossible to contain':
      '  SEVERO — Exposição nacional impossível de conter',
    '  Would legitimize story for international pickup':
      '  Legitimaria a matéria para repercussão internacional',
    'RECOMMENDED ACTION:': 'AÇÃO RECOMENDADA:',
    '  1. Contact news director SANTOS immediately':
      '  1. Contatar diretor de jornalismo SANTOS imediatamente',
    '  2. Invoke national security clause': '  2. Invocar cláusula de segurança nacional',
    '  3. Offer substitute exclusive (suggest carnival)':
      '  3. Oferecer exclusividade substituta (sugerir carnaval)',
    '  4. If necessary, escalate to network ownership':
      '  4. Se necessário, escalonar para diretoria da emissora',
    'STATUS: ACTION IN PROGRESS': 'STATUS: AÇÃO EM ANDAMENTO',
    // ═══ expansionContent.ts — foreign_press_alert ═══
    'ALERT — FOREIGN PRESS INTEREST': 'ALERTA — INTERESSE DA IMPRENSA ESTRANGEIRA',
    'DATE: 15-JUN-1996': 'DATA: 15-JUN-1996',
    'SUBJECT: American Business Journal Investigation':
      'ASSUNTO: Investigação do American Business Journal',
    'SITUATION:': 'SITUAÇÃO:',
    '  The American Business Journal (New York) has assigned':
      '  O American Business Journal (Nova York) designou o',
    '  correspondent J. BROOKE to investigate the incident.':
      '  correspondente J. BROOKE para investigar o incidente.',
    'JOURNALIST PROFILE:': 'PERFIL DO JORNALISTA:',
    '  Name: James BROOKE': '  Nome: James BROOKE',
    '  Bureau: Rio de Janeiro': '  Sucursal: Rio de Janeiro',
    '  Background: 12 years Latin America coverage':
      '  Experiência: 12 anos de cobertura na América Latina',
    '  Assessment: PROFESSIONAL, PERSISTENT': '  Avaliação: PROFISSIONAL, PERSISTENTE',
    'KNOWN ACTIVITIES:': 'ATIVIDADES CONHECIDAS:',
    '  - Filed FOIA request with Brazilian Air Force':
      '  - Protocolou pedido de informação junto à Força Aérea Brasileira',
    '  - Contacted regional hospital administration':
      '  - Contatou administração do hospital regional',
    '  - Attempted interview with fire department': '  - Tentou entrevista com corpo de bombeiros',
    '  - Visited Jardim Andere neighborhood': '  - Visitou o bairro Jardim Andere',
    'ARTICLE STATUS:': 'STATUS DO ARTIGO:',
    '  Scheduled publication: Late June 1996': '  Publicação prevista: Final de junho de 1996',
    '  Expected tone: Skeptical but thorough': '  Tom esperado: Cético porém minucioso',
    '  Likely angle: Military secrecy, witness accounts':
      '  Ângulo provável: Sigilo militar, relatos de testemunhas',
    '  1. Do NOT engage directly': '  1. NÃO engajar diretamente',
    '     (Foreign journalist = different rules)':
      '     (Jornalista estrangeiro = regras diferentes)',
    '  2. Prepare official statement emphasizing:': '  2. Preparar declaração oficial enfatizando:',
    '     - Weather balloon explanation': '     - Explicação do balão meteorológico',
    '     - Witness confusion/hysteria': '     - Confusão/histeria das testemunhas',
    '     - No military involvement': '     - Nenhum envolvimento militar',
    '  3. Brief cooperative Brazilian sources to:':
      '  3. Instruir fontes brasileiras cooperativas a:',
    '     - Cast doubt on witnesses': '     - Lançar dúvidas sobre as testemunhas',
    '     - Emphasize "Mudinho" explanation': '     - Enfatizar explicação do "Mudinho"',
    '     - Suggest mass hysteria angle': '     - Sugerir ângulo de histeria coletiva',
    '  4. Monitor publication and prepare response':
      '  4. Monitorar publicação e preparar resposta',
    'NOTE: Cannot use domestic suppression tactics.':
      'NOTA: Não é possível usar táticas de supressão domésticas.',
    '      International outlet requires different approach.':
      '      Veículo internacional requer abordagem diferente.',
    // ═══ expansionContent.ts — witness_visit_log ═══
    'WITNESS CONTACT LOG — OPERATION SILÊNCIO':
      'REGISTRO DE CONTATO COM TESTEMUNHAS — OPERAÇÃO SILÊNCIO',
    'PERIOD: 21-JAN to 15-FEB 1996': 'PERÍODO: 21-JAN a 15-FEV 1996',
    'VISIT #001': 'VISITA #001',
    '  Date: 21-JAN-1996, 22:00': '  Data: 21-JAN-1996, 22:00',
    '  Subject: WITNESS-1 (primary witness, eldest sister)':
      '  Sujeito: WITNESS-1 (testemunha primária, irmã mais velha)',
    '  Location: Residence, Jardim Andere': '  Local: Residência, Jardim Andere',
    '  Team: COBRA-1, COBRA-2': '  Equipe: COBRA-1, COBRA-2',
    '  Duration: 45 minutes': '  Duração: 45 minutos',
    '  Outcome: COOPERATIVE (see recantation form)':
      '  Resultado: COOPERATIVO (ver formulário de retratação)',
    'VISIT #002': 'VISITA #002',
    '  Date: 21-JAN-1996, 23:30': '  Data: 21-JAN-1996, 23:30',
    '  Subject: WITNESS-2 (middle sister)': '  Sujeito: WITNESS-2 (irmã do meio)',
    '  Duration: 30 minutes': '  Duração: 30 minutos',
    '  Outcome: COOPERATIVE': '  Resultado: COOPERATIVO',
    'VISIT #003': 'VISITA #003',
    '  Date: 22-JAN-1996, 06:00': '  Data: 22-JAN-1996, 06:00',
    '  Subject: WITNESS-3 (youngest sister)': '  Sujeito: WITNESS-3 (irmã mais nova)',
    '  Location: Workplace': '  Local: Local de trabalho',
    '  Team: COBRA-3, COBRA-4': '  Equipe: COBRA-3, COBRA-4',
    '  Duration: 20 minutes': '  Duração: 20 minutos',
    '  Outcome: RESISTANT — follow-up required':
      '  Resultado: RESISTENTE — acompanhamento necessário',
    'VISIT #004': 'VISITA #004',
    '  Date: 22-JAN-1996, 14:00': '  Data: 22-JAN-1996, 14:00',
    '  Subject: [REDACTED] (fire dept. dispatcher)':
      '  Sujeito: [SUPRIMIDO] (despachante do corpo de bombeiros)',
    '  Location: Fire station': '  Local: Quartel de bombeiros',
    '  Duration: 35 minutes': '  Duração: 35 minutos',
    '  Note: Agreed to "no comment" position': '  Nota: Concordou com posição de "sem comentários"',
    'VISIT #005': 'VISITA #005',
    '  Date: 23-JAN-1996, 19:00': '  Data: 23-JAN-1996, 19:00',
    '  Subject: WITNESS-3 (follow-up)': '  Sujeito: WITNESS-3 (acompanhamento)',
    '  Location: Residence': '  Local: Residência',
    '  Team: COBRA-1, COBRA-2, COBRA-5': '  Equipe: COBRA-1, COBRA-2, COBRA-5',
    '  Duration: 90 minutes': '  Duração: 90 minutos',
    '  Note: Extended persuasion required': '  Nota: Persuasão prolongada necessária',
    'VISIT #006': 'VISITA #006',
    '  Date: 24-JAN-1996, 08:00': '  Data: 24-JAN-1996, 08:00',
    '  Subject: [REDACTED] (hospital orderly)': '  Sujeito: [SUPRIMIDO] (auxiliar hospitalar)',
    '  Location: Hospital Regional': '  Local: Hospital Regional',
    '  Duration: 25 minutes': '  Duração: 25 minutos',
    '  Note: Signed NDA, received severance':
      '  Nota: Assinou termo de confidencialidade, recebeu indenização',
    'VISIT #007': 'VISITA #007',
    '  Date: 25-JAN-1996, 20:00': '  Data: 25-JAN-1996, 20:00',
    '  Subject: FERREIRA, Ana (zoo veterinarian)':
      '  Sujeito: FERREIRA, Ana (veterinária do zoológico)',
    '  Duration: 55 minutes': '  Duração: 55 minutos',
    '  Outcome: PARTIALLY COOPERATIVE': '  Resultado: PARCIALMENTE COOPERATIVO',
    '  Note: See zoo incident file': '  Nota: Ver arquivo do incidente no zoológico',
    'TOTAL CONTACTS: 14': 'TOTAL DE CONTATOS: 14',
    'COOPERATIVE: 12': 'COOPERATIVOS: 12',
    'RESISTANT: 2 (resolved)': 'RESISTENTES: 2 (resolvidos)',
    // ═══ expansionContent.ts — debriefing_protocol ═══
    'STANDARD OPERATING PROCEDURE': 'PROCEDIMENTO OPERACIONAL PADRÃO',
    'WITNESS DEBRIEFING — PROTOCOL SOMBRA': 'INTERROGATÓRIO DE TESTEMUNHAS — PROTOCOLO SOMBRA',
    'PURPOSE:': 'FINALIDADE:',
    '  To ensure civilian witnesses maintain silence':
      '  Garantir que testemunhas civis mantenham silêncio',
    '  regarding classified incidents.': '  sobre incidentes classificados.',
    'PHASE 1: APPROACH': 'FASE 1: ABORDAGEM',
    '  - Team of TWO minimum (never alone)': '  - Equipe de DOIS no mínimo (nunca sozinho)',
    '  - Dark suits, minimal identification': '  - Ternos escuros, identificação mínima',
    '  - Arrive outside normal hours (22:00-06:00 preferred)':
      '  - Chegar fora do horário normal (22:00-06:00 preferível)',
    '  - Do NOT display badges unless necessary': '  - NÃO exibir crachás a menos que necessário',
    '  - State: "We are from the government"': '  - Declarar: "Somos do governo"',
    'PHASE 2: ASSESSMENT': 'FASE 2: AVALIAÇÃO',
    '  Evaluate witness disposition:': '  Avaliar disposição da testemunha:',
    '  TYPE A: Already frightened': '  TIPO A: Já assustado',
    '    → Proceed directly to reassurance': '    → Prosseguir diretamente para tranquilização',
    '    → "You saw nothing unusual"': '    → "Você não viu nada incomum"',
    '  TYPE B: Curious/talkative': '  TIPO B: Curioso/falante',
    '    → Emphasize national security': '    → Enfatizar segurança nacional',
    '    → "Your family\\\'s safety depends on silence"':
      '    → "A segurança da sua família depende do silêncio"',
    '  TYPE C: Hostile/resistant': '  TIPO C: Hostil/resistente',
    '    → Deploy secondary team': '    → Acionar equipe secundária',
    '    → Extended session required': '    → Sessão prolongada necessária',
    '    → See Protocol SOMBRA-EXTENDED': '    → Ver Protocolo SOMBRA-EXTENDED',
    'PHASE 3: DOCUMENTATION': 'FASE 3: DOCUMENTAÇÃO',
    '  - Obtain signed recantation statement': '  - Obter declaração de retratação assinada',
    '  - Obtain signed NDA (Form W-7)':
      '  - Obter termo de confidencialidade assinado (Formulário W-7)',
    '  - Photograph witness (for file)': '  - Fotografar testemunha (para arquivo)',
    '  - Record any family members present': '  - Registrar quaisquer familiares presentes',
    'PHASE 4: FOLLOW-UP': 'FASE 4: ACOMPANHAMENTO',
    '  - Monitor subject for 30 days minimum': '  - Monitorar sujeito por no mínimo 30 dias',
    '  - Verify no media contact': '  - Verificar ausência de contato com a mídia',
    '  - If breach suspected, escalate immediately':
      '  - Se suspeitar de violação, escalonar imediatamente',
    'AUTHORIZED TECHNIQUES:': 'TÉCNICAS AUTORIZADAS:',
    '  ✓ Verbal persuasion': '  ✓ Persuasão verbal',
    '  ✓ Implication of consequences': '  ✓ Implicação de consequências',
    '  ✓ Financial incentive': '  ✓ Incentivo financeiro',
    '  ✓ Employment pressure': '  ✓ Pressão empregatícia',
    '  ✗ Physical contact (PROHIBITED)': '  ✗ Contato físico (PROIBIDO)',
    '  ✗ Direct threats (PROHIBITED)': '  ✗ Ameaças diretas (PROIBIDO)',
    'NOTE: All sessions are UNRECORDED.': 'NOTA: Todas as sessões são NÃO GRAVADAS.',
    '      No notes to be taken in presence of witness.':
      '      Nenhuma anotação deve ser feita na presença da testemunha.',
    // ═══ expansionContent.ts — silva_sisters_file ═══
    'SUBJECT FILE — THE THREE WITNESSES': 'DOSSIÊ DE SUJEITOS — AS TRÊS TESTEMUNHAS',
    'FILE NUMBER: VAR-96-W001': 'NÚMERO DO ARQUIVO: VAR-96-W001',
    'PRIMARY WITNESSES — JARDIM ANDERE INCIDENT':
      'TESTEMUNHAS PRIMÁRIAS — INCIDENTE DO JARDIM ANDERE',
    'SUBJECT 1: WITNESS-1 (eldest sister)': 'SUJEITO 1: WITNESS-1 (irmã mais velha)',
    '  Age: 22': '  Idade: 22',
    '  Occupation: Domestic worker': '  Ocupação: Empregada doméstica',
    '  Marital status: Single': '  Estado civil: Solteira',
    '  Dependents: None': '  Dependentes: Nenhum',
    '  Address: [REDACTED], Jardim Andere, Varginha':
      '  Endereço: [SUPRIMIDO], Jardim Andere, Varginha',
    '  Assessment: MOST CREDIBLE of three': '  Avaliação: MAIS CREDÍVEL das três',
    '  Demeanor: Frightened, religious': '  Comportamento: Assustada, religiosa',
    "  Pressure points: Mother\\'s health, job security":
      '  Pontos de pressão: Saúde da mãe, segurança no emprego',
    '  Statement summary:': '  Resumo do depoimento:',
    '    Saw "creature" at approx. 15:30 on 20-JAN':
      '    Viu "criatura" por volta das 15:30 em 20-JAN',
    '    Described: small, brown skin, red eyes':
      '    Descrição: pequena, pele marrom, olhos vermelhos',
    '    Claims creature "looked at her"': '    Afirma que a criatura "olhou para ela"',
    '    Ran immediately, called mother': '    Correu imediatamente, ligou para a mãe',
    '  Status: RECANTED (23-JAN)': '  Status: RETRATADA (23-JAN)',
    '  Current position: "Saw a homeless person"': '  Posição atual: "Viu um morador de rua"',
    'SUBJECT 2: WITNESS-2 (middle sister)': 'SUJEITO 2: WITNESS-2 (irmã do meio)',
    '  Age: 16': '  Idade: 16',
    '  Occupation: Student': '  Ocupação: Estudante',
    '  Relation: Sister of WITNESS-1': '  Parentesco: Irmã de WITNESS-1',
    '  Assessment: IMPRESSIONABLE': '  Avaliação: IMPRESSIONÁVEL',
    '  Demeanor: Nervous, easily led': '  Comportamento: Nervosa, facilmente influenciável',
    '  Pressure points: School enrollment': '  Pontos de pressão: Matrícula escolar',
    '  Status: RECANTED (22-JAN)': '  Status: RETRATADA (22-JAN)',
    '  Current position: "Sister was confused"': '  Posição atual: "A irmã estava confusa"',
    'SUBJECT 3: WITNESS-3 (youngest sister)': 'SUJEITO 3: WITNESS-3 (irmã mais nova)',
    '  Age: 14': '  Idade: 14',
    '  Assessment: RESISTANT': '  Avaliação: RESISTENTE',
    '  Demeanor: Defiant, maintains story': '  Comportamento: Desafiadora, mantém versão',
    '  Pressure points: Academic future': '  Pontos de pressão: Futuro acadêmico',
    '  Status: PARTIALLY COOPERATIVE (25-JAN)': '  Status: PARCIALMENTE COOPERATIVA (25-JAN)',
    '  Current position: "Agrees to stay silent"':
      '  Posição atual: "Concorda em ficar em silêncio"',
    '  Note: Did NOT sign recantation': '  Nota: NÃO assinou retratação',
    '        Monitor closely': '        Monitorar de perto',
    'FAMILY SITUATION:': 'SITUAÇÃO FAMILIAR:',
    '  Mother: [REDACTED] — supportive of daughters': '  Mãe: [SUPRIMIDO] — apoia as filhas',
    '  Father: Deceased': '  Pai: Falecido',
    '  Economic status: Lower middle class': '  Status econômico: Classe média baixa',
    '  Religious: Catholic (devout)': '  Religião: Católica (devota)',
    'CONTAINMENT ASSESSMENT:': 'AVALIAÇÃO DE CONTENÇÃO:',
    '  Risk level: MODERATE': '  Nível de risco: MODERADO',
    '  Reason: WITNESS-3 remains unconvinced': '  Motivo: WITNESS-3 permanece não convencida',
    '  Recommendation: Monitor for 6 months': '  Recomendação: Monitorar por 6 meses',
    // ═══ expansionContent.ts — recantation_form_001 ═══
    'WITNESS STATEMENT CORRECTION': 'CORREÇÃO DE DEPOIMENTO DE TESTEMUNHA',
    'FORM W-9 (VOLUNTARY RECANTATION)': 'FORMULÁRIO W-9 (RETRATAÇÃO VOLUNTÁRIA)',
    'I, [WITNESS-1], of sound mind, hereby state:':
      'Eu, [WITNESS-1], em pleno gozo das minhas faculdades mentais, declaro:',
    'On the afternoon of January 20, 1996, I reported':
      'Na tarde de 20 de janeiro de 1996, eu relatei ter',
    'seeing an unusual figure in the Jardim Andere':
      'visto uma figura incomum no bairro Jardim Andere',
    'neighborhood of Varginha.': 'em Varginha.',
    'I now acknowledge that I was MISTAKEN.': 'Agora reconheço que estava ENGANADA.',
    'What I actually saw was a homeless individual,':
      'O que eu realmente vi foi um indivíduo sem-teto,',
    'possibly intoxicated or mentally disturbed.':
      'possivelmente embriagado ou com distúrbios mentais.',
    'The unusual appearance was due to:': 'A aparência incomum foi devida a:',
    '  - Poor lighting conditions': '  - Condições precárias de iluminação',
    '  - My own state of fear': '  - Meu próprio estado de medo',
    '  - Influence of recent media stories': '  - Influência de reportagens recentes na mídia',
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
    'Signature: [SIGNED]': 'Assinatura: [ASSINADO]',
    'Date: 23-JAN-1996': 'Data: 23-JAN-1996',
    'Witness: [REDACTED], Federal Agent': 'Testemunha: [SUPRIMIDO], Agente Federal',
    // ═══ expansionContent.ts — mudinho_dossier ═══
    'COVER STORY ASSET — CODENAME "MUDINHO"': 'ATIVO DE HISTÓRIA DE COBERTURA — CODINOME "MUDINHO"',
    'FILE: CS-96-001': 'ARQUIVO: CS-96-001',
    'SUBJECT PROFILE:': 'PERFIL DO SUJEITO:',
    '  Legal name: [REDACTED]': '  Nome legal: [SUPRIMIDO]',
    '  Known as: "Mudinho" (local nickname)': '  Conhecido como: "Mudinho" (apelido local)',
    '  Age: Approximately 35-40': '  Idade: Aproximadamente 35-40',
    '  Status: Mentally disabled': '  Status: Deficiente mental',
    '  Residence: Streets of Varginha (homeless)': '  Residência: Ruas de Varginha (sem-teto)',
    'PHYSICAL DESCRIPTION:': 'DESCRIÇÃO FÍSICA:',
    '  Height: 1.40m (unusually short)': '  Altura: 1,40m (incomumente baixo)',
    '  Build: Thin, malnourished': '  Compleição: Magro, desnutrido',
    '  Skin: Dark, weathered': '  Pele: Escura, castigada',
    '  Distinguishing features:': '  Características distintivas:',
    '    - Crouched posture': '    - Postura agachada',
    '    - Limited verbal communication': '    - Comunicação verbal limitada',
    '    - Often seen in Jardim Andere area': '    - Frequentemente visto na área do Jardim Andere',
    'COVER STORY DEPLOYMENT': 'IMPLANTAÇÃO DA HISTÓRIA DE COBERTURA',
    'NARRATIVE:': 'NARRATIVA:',
    '  "The creature witnesses described was actually':
      '  "A criatura que as testemunhas descreveram era na verdade',
    '   a local mentally disabled man known as Mudinho.':
      '   um homem local com deficiência mental conhecido como Mudinho.',
    '   In the confusion and poor lighting, witnesses':
      '   Na confusão e na pouca iluminação, as testemunhas',
    '   mistook him for something unusual."': '   o confundiram com algo incomum."',
    'ADVANTAGES:': 'VANTAGENS:',
    '  - Subject cannot contradict (non-verbal)': '  - Sujeito não pode contradizer (não-verbal)',
    '  - Subject known to locals': '  - Sujeito conhecido pelos moradores',
    '  - Physical characteristics loosely match':
      '  - Características físicas correspondem vagamente',
    '  - Explains crouching posture': '  - Explica a postura agachada',
    'DISADVANTAGES:': 'DESVANTAGENS:',
    '  - Skin color does not match (brown vs. gray)':
      '  - Cor da pele não corresponde (marrom vs. cinza)',
    '  - Does not explain "red eyes"': '  - Não explica os "olhos vermelhos"',
    '  - Multiple witnesses unlikely to all misidentify':
      '  - Múltiplas testemunhas improváveis de todas identificarem erroneamente',
    '  - Subject was NOT in Jardim Andere on 20-JAN':
      '  - Sujeito NÃO estava no Jardim Andere em 20-JAN',
    'DEPLOYMENT STATUS: ACTIVE': 'STATUS DE IMPLANTAÇÃO: ATIVO',
    'MEDIA PLACEMENT:': 'INSERÇÃO NA MÍDIA:',
    '  - Estado de Minas: Published 27-JAN': '  - Estado de Minas: Publicado 27-JAN',
    '  - Folha Paulista: Published 29-JAN': '  - Folha Paulista: Publicado 29-JAN',
    '  - Rede Nacional: Mentioned 28-JAN': '  - Rede Nacional: Mencionado 28-JAN',
    'EFFECTIVENESS ASSESSMENT:': 'AVALIAÇÃO DE EFICÁCIA:',
    '  Moderate. Provides plausible deniability but': '  Moderada. Fornece negação plausível mas',
    '  does not withstand close scrutiny.': '  não resiste a escrutínio detalhado.',
    'NOTE: Subject Mudinho was relocated to care facility':
      'NOTA: Sujeito Mudinho foi transferido para instituição de cuidados',
    '      on 02-FEB to prevent journalist contact.':
      '      em 02-FEV para impedir contato com jornalistas.',
    // ═══ expansionContent.ts — alternative_explanations ═══
    'COVER STORY OPTIONS — VARGINHA INCIDENT':
      'OPÇÕES DE HISTÓRIA DE COBERTURA — INCIDENTE VARGINHA',
    'COMPILED: 22-JAN-1996': 'COMPILADO: 22-JAN-1996',
    'The following alternative explanations are approved':
      'As seguintes explicações alternativas são aprovadas',
    'for deployment depending on audience and context:':
      'para implantação dependendo do público e contexto:',
    'OPTION A: WEATHER BALLOON': 'OPÇÃO A: BALÃO METEOROLÓGICO',
    '  Use for: Aerial sighting reports': '  Usar para: Relatos de avistamentos aéreos',
    '  Narrative: "Meteorological equipment from INMET"':
      '  Narrativa: "Equipamento meteorológico do INMET"',
    '  Strength: Classic, widely accepted': '  Ponto forte: Clássico, amplamente aceito',
    '  Weakness: Does not explain ground sightings':
      '  Ponto fraco: Não explica avistamentos terrestres',
    '  Status: DEPLOYED for UFO reports': '  Status: IMPLANTADO para relatos de OVNIs',
    'OPTION B: HOMELESS PERSON (MUDINHO)': 'OPÇÃO B: MORADOR DE RUA (MUDINHO)',
    '  Use for: Creature sightings': '  Usar para: Avistamentos de criaturas',
    '  Narrative: "Local mentally disabled man"':
      '  Narrativa: "Homem local com deficiência mental"',
    '  Strength: Explains humanoid shape': '  Ponto forte: Explica forma humanoide',
    '  Weakness: Contradicted by witness details':
      '  Ponto fraco: Contradito por detalhes das testemunhas',
    '  Status: PRIMARY for domestic media': '  Status: PRIMÁRIO para mídia nacional',
    'OPTION C: ESCAPED ANIMAL': 'OPÇÃO C: ANIMAL FUGIDO',
    '  Use for: Secondary/backup': '  Usar para: Secundário/reserva',
    '  Narrative: "Monkey or similar animal"': '  Narrativa: "Macaco ou animal similar"',
    '  Strength: Explains unusual appearance': '  Ponto forte: Explica aparência incomum',
    '  Weakness: No zoo reported escape': '  Ponto fraco: Nenhuma fuga reportada pelo zoológico',
    '  Status: RESERVE': '  Status: RESERVA',
    'OPTION D: MILITARY EXERCISE': 'OPÇÃO D: EXERCÍCIO MILITAR',
    '  Use for: Troop/vehicle movements': '  Usar para: Movimentos de tropas/veículos',
    '  Narrative: "Routine training exercise"': '  Narrativa: "Exercício de treinamento rotineiro"',
    '  Strength: Explains military presence': '  Ponto forte: Explica presença militar',
    '  Weakness: No exercise was scheduled': '  Ponto fraco: Nenhum exercício estava programado',
    '  Status: DEPLOYED for truck sightings': '  Status: IMPLANTADO para avistamentos de caminhões',
    'OPTION E: MASS HYSTERIA': 'OPÇÃO E: HISTERIA COLETIVA',
    '  Use for: Long-term discrediting': '  Usar para: Desacreditação de longo prazo',
    '  Narrative: "Community panic, suggestibility"':
      '  Narrativa: "Pânico comunitário, sugestionabilidade"',
    '  Strength: Undermines all witnesses': '  Ponto forte: Desacredita todas as testemunhas',
    '  Weakness: Requires time to establish': '  Ponto fraco: Requer tempo para estabelecer',
    '  Status: DEPLOYMENT IN PROGRESS': '  Status: IMPLANTAÇÃO EM ANDAMENTO',
    'OPTION F: PRANKSTERS/HOAX': 'OPÇÃO F: BRINCALHÕES/FARSA',
    '  Use for: Future fallback': '  Usar para: Recurso futuro',
    '  Narrative: "Local youths playing prank"': '  Narrativa: "Jovens locais fazendo brincadeira"',
    '  Strength: Simple explanation': '  Ponto forte: Explicação simples',
    '  Weakness: Requires "pranksters" to identify':
      '  Ponto fraco: Requer identificar os "brincalhões"',
    '  Deploy multiple explanations simultaneously.':
      '  Implantar múltiplas explicações simultaneamente.',
    '  Confusion serves containment.': '  A confusão serve à contenção.',
    // ═══ expansionContent.ts — media_talking_points ═══
    'MEDIA TALKING POINTS — VARGINHA INCIDENT': 'PONTOS DE COMUNICAÇÃO — INCIDENTE VARGINHA',
    'FOR: All Authorized Spokespersons': 'PARA: Todos os Porta-vozes Autorizados',
    'DATE: 24-JAN-1996': 'DATA: 24-JAN-1996',
    'IF ASKED ABOUT CREATURE SIGHTINGS:': 'SE PERGUNTADO SOBRE AVISTAMENTOS DE CRIATURAS:',
    '  "We have investigated these reports thoroughly.':
      '  "Investigamos esses relatos minuciosamente.',
    '   The sightings were of a local homeless individual':
      '   Os avistamentos foram de um indivíduo sem-teto local',
    '   who is known to frequent that neighborhood.':
      '   que é conhecido por frequentar aquele bairro.',
    '   There is nothing unusual to report."': '   Não há nada de incomum a reportar."',
    'IF ASKED ABOUT MILITARY ACTIVITY:': 'SE PERGUNTADO SOBRE ATIVIDADE MILITAR:',
    '  "The military vehicles observed were part of':
      '  "Os veículos militares observados faziam parte de',
    '   routine logistical operations unrelated to':
      '   operações logísticas rotineiras sem relação com',
    '   any reported sightings. This is normal activity':
      '   quaisquer avistamentos reportados. Esta é atividade normal',
    '   for our regional command."': '   para nosso comando regional."',
    'IF ASKED ABOUT HOSPITAL ACTIVITY:': 'SE PERGUNTADO SOBRE ATIVIDADE HOSPITALAR:',
    '  "Patient intake and emergency response are':
      '  "A admissão de pacientes e o atendimento de emergência são',
    '   confidential medical matters. We cannot comment':
      '   assuntos médicos confidenciais. Não podemos comentar',
    '   on any specific cases or rumors."': '   sobre casos específicos ou rumores."',
    'IF ASKED ABOUT UFOS:': 'SE PERGUNTADO SOBRE OVNIs:',
    '  "There is no evidence of any unidentified aerial':
      '  "Não há evidência de nenhum fenômeno aéreo não identificado',
    '   phenomena in the Varginha area. Light anomalies':
      '   na área de Varginha. Anomalias luminosas',
    '   reported on January 19th were likely atmospheric':
      '   reportadas em 19 de janeiro foram provavelmente',
    '   reflections from agricultural equipment."':
      '   reflexos atmosféricos de equipamento agrícola."',
    'IF ASKED ABOUT COVER-UP:': 'SE PERGUNTADO SOBRE ENCOBRIMENTO:',
    '  "Suggestions of a cover-up are baseless conspiracy':
      '  "Sugestões de encobrimento são teorias da conspiração infundadas.',
    '   theories. The Brazilian Armed Forces operate with':
      '   As Forças Armadas Brasileiras operam com',
    '   full transparency within appropriate security':
      '   total transparência dentro dos protocolos de segurança',
    '   protocols. There is nothing to hide."': '   apropriados. Não há nada a esconder."',
    'DO NOT:': 'NÃO:',
    '  - Engage with specific witness accounts':
      '  - Engajar com relatos específicos de testemunhas',
    '  - Confirm or deny classified information':
      '  - Confirmar ou negar informações classificadas',
    '  - Speculate about alternative explanations': '  - Especular sobre explicações alternativas',
    '  - Acknowledge the existence of any "investigation"':
      '  - Reconhecer a existência de qualquer "investigação"',
    // ═══ expansionContent.ts — animal_deaths_report ═══
    'INCIDENT REPORT — ZOOLÓGICO MUNICIPAL DE VARGINHA':
      'RELATÓRIO DE INCIDENTE — ZOOLÓGICO MUNICIPAL DE VARGINHA',
    'DATE: 28-JAN-1996': 'DATA: 28-JAN-1996',
    '  Multiple animal deaths at municipal zoo during':
      '  Múltiplas mortes de animais no zoológico municipal durante',
    '  period 22-JAN to 27-JAN 1996.': '  o período de 22-JAN a 27-JAN 1996.',
    'FATALITIES:': 'FATALIDADES:',
    '  22-JAN 06:00 — TAPIR (Tapirus terrestris)': '  22-JAN 06:00 — ANTA (Tapirus terrestris)',
    '    Age: 8 years': '    Idade: 8 anos',
    '    Prior health: Excellent': '    Saúde prévia: Excelente',
    '    Symptoms: Found deceased, no visible trauma':
      '    Sintomas: Encontrado morto, sem trauma visível',
    '    Necropsy: Internal hemorrhaging, organ failure':
      '    Necrópsia: Hemorragia interna, falência de órgãos',
    '  24-JAN 14:00 — OCELOT (Leopardus pardalis)':
      '  24-JAN 14:00 — JAGUATIRICA (Leopardus pardalis)',
    '    Age: 5 years': '    Idade: 5 anos',
    '    Prior health: Good': '    Saúde prévia: Boa',
    '    Symptoms: Seizures, rapid decline': '    Sintomas: Convulsões, declínio rápido',
    '    Necropsy: Neurological damage, cause unknown':
      '    Necrópsia: Dano neurológico, causa desconhecida',
    '  25-JAN 08:30 — DEER (Mazama americana)': '  25-JAN 08:30 — VEADO (Mazama americana)',
    '    Age: 3 years': '    Idade: 3 anos',
    '    Symptoms: Extreme agitation, then collapse':
      '    Sintomas: Agitação extrema, depois colapso',
    '    Necropsy: Cardiac arrest, elevated cortisol':
      '    Necrópsia: Parada cardíaca, cortisol elevado',
    '  27-JAN 03:00 — CAPYBARA (Hydrochoerus hydrochaeris)':
      '  27-JAN 03:00 — CAPIVARA (Hydrochoerus hydrochaeris)',
    '    Age: 6 years': '    Idade: 6 anos',
    '    Symptoms: Refused food, tremors': '    Sintomas: Recusou alimento, tremores',
    '    Necropsy: Multi-organ failure': '    Necrópsia: Falência múltipla de órgãos',
    'VETERINARIAN ASSESSMENT (Dr. Ana FERREIRA):': 'AVALIAÇÃO VETERINÁRIA (Dra. Ana FERREIRA):',
    '  "These deaths are unprecedented. The animals showed':
      '  "Essas mortes são sem precedentes. Os animais não mostraram',
    '   no prior illness. The pattern suggests exposure to':
      '   doença prévia. O padrão sugere exposição a',
    '   an unknown pathogen or toxin. The proximity of':
      '   um patógeno ou toxina desconhecida. A proximidade das',
    '   deaths to the reported incident on 20-JAN cannot':
      '   mortes com o incidente reportado em 20-JAN não pode',
    '   be coincidental."': '   ser coincidência."',
    'OPERATIONAL NOTE:': 'NOTA OPERACIONAL:',
    '  Animals were housed in enclosures adjacent to':
      '  Os animais estavam alojados em recintos adjacentes à',
    '  the TEMPORARY HOLDING area used 20-21 JAN.':
      '  área de CONTENÇÃO TEMPORÁRIA usada em 20-21 JAN.',
    '  Possible contamination from "fauna specimen"':
      '  Possível contaminação do espécime de "fauna"',
    '  containment breach. Investigation ongoing.':
      '  por falha de contenção. Investigação em andamento.',
    // ═══ expansionContent.ts — veterinarian_silencing ═══
    'CONTAINMENT ACTION — ZOO VETERINARIAN': 'AÇÃO DE CONTENÇÃO — VETERINÁRIA DO ZOOLÓGICO',
    'DATE: 30-JAN-1996': 'DATA: 30-JAN-1996',
    'SUBJECT: Dr. Ana FERREIRA': 'SUJEITO: Dra. Ana FERREIRA',
    'Position: Chief Veterinarian, Zoológico Municipal':
      'Cargo: Veterinária-Chefe, Zoológico Municipal',
    'Threat level: MODERATE': 'Nível de ameaça: MODERADO',
    '  Dr. Ferreira has made connection between animal':
      '  Dra. Ferreira fez conexão entre as mortes',
    '  deaths and classified incident. Has documented':
      '  de animais e o incidente classificado. Documentou',
    '  anomalous necropsy findings. Seeking external': '  achados anômalos de necrópsia. Buscando',
    '  consultation.': '  consulta externa.',
    'ACTIONS TAKEN:': 'AÇÕES TOMADAS:',
    '  25-JAN: Initial contact (Protocol SOMBRA)': '  25-JAN: Contato inicial (Protocolo SOMBRA)',
    '    Outcome: PARTIALLY COOPERATIVE': '    Resultado: PARCIALMENTE COOPERATIVO',
    '    Agreed to delay external consultation': '    Concordou em adiar consulta externa',
    '  28-JAN: Necropsy samples CONFISCATED': '  28-JAN: Amostras de necrópsia CONFISCADAS',
    '    Cover: "Public health authority directive"':
      '    Cobertura: "Diretiva da autoridade de saúde pública"',
    '    Note: Samples transferred to secure facility':
      '    Nota: Amostras transferidas para instalação segura',
    '  29-JAN: Administrative pressure applied': '  29-JAN: Pressão administrativa aplicada',
    '    Zoo director instructed to reassign subject':
      '    Diretor do zoológico instruído a realocar sujeito',
    '    "Extended leave" suggested': '    "Licença prolongada" sugerida',
    '  30-JAN: Follow-up visit (COBRA team)': '  30-JAN: Visita de acompanhamento (equipe COBRA)',
    '    Duration: 2 hours': '    Duração: 2 horas',
    '    Outcome: FULLY COOPERATIVE': '    Resultado: TOTALMENTE COOPERATIVO',
    '    Signed: NDA, statement attributing deaths to':
      '    Assinou: Termo de confidencialidade, declaração atribuindo mortes a',
    '            "contaminated feed shipment"': '            "carregamento de ração contaminada"',
    'CURRENT STATUS:': 'STATUS ATUAL:',
    '  Subject on administrative leave': '  Sujeito em licença administrativa',
    '  No media contact authorized': '  Nenhum contato com a mídia autorizado',
    '  Monitoring: 90 days': '  Monitoramento: 90 dias',
    'ADDITIONAL MEASURE:': 'MEDIDA ADICIONAL:',
    "  Subject\\'s husband works at state university":
      '  O marido do sujeito trabalha na universidade estadual',
    '  Employment pressure available if needed': '  Pressão empregatícia disponível se necessário',
    // ═══ expansionContent.ts — contamination_theory ═══
    'OFFICIAL EXPLANATION — ZOO ANIMAL DEATHS':
      'EXPLICAÇÃO OFICIAL — MORTES DE ANIMAIS DO ZOOLÓGICO',
    'FOR: Public Release / Media Inquiry': 'PARA: Divulgação Pública / Consulta da Mídia',
    'DATE: 01-FEB-1996': 'DATA: 01-FEV-1996',
    'PRESS STATEMENT:': 'COMUNICADO À IMPRENSA:',
    '  "The Varginha Municipal Zoo regrets to announce':
      '  "O Zoológico Municipal de Varginha lamenta anunciar',
    '   the loss of four animals during the last week':
      '   a perda de quatro animais durante a última semana',
    '   of January 1996.': '   de janeiro de 1996.',
    '   Investigation has determined that the cause was':
      '   A investigação determinou que a causa foi',
    '   a contaminated shipment of animal feed received':
      '   um carregamento contaminado de ração animal recebido',
    '   on January 18th.': '   em 18 de janeiro.',
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
    '   are being implemented.': '   estão sendo implementados.',
    '   We appreciate the community\\\'s understanding."':
      '   Agradecemos a compreensão da comunidade."',
    'INTERNAL NOTE (DO NOT RELEASE):': 'NOTA INTERNA (NÃO DIVULGAR):',
    '  This explanation is for public consumption only.':
      '  Esta explicação é apenas para consumo público.',
    '  Feed shipment records have been altered to support.':
      '  Registros de carregamento de ração foram alterados para corroborar.',
    '  Supplier has been compensated for cooperation.':
      '  Fornecedor foi compensado pela cooperação.',
    '  Actual cause: Proximity contamination from': '  Causa real: Contaminação por proximidade do',
    '  temporary holding of recovered fauna specimen.':
      '  confinamento temporário do espécime de fauna recuperado.',
    '  See: /ops/zoo/animal_deaths_report.txt': '  Ver: /ops/zoo/animal_deaths_report.txt',
    // ═══ expansionContent.ts — chereze_incident_report ═══
    'INCIDENT REPORT — OFFICER [CLASSIFIED]': 'RELATÓRIO DE INCIDENTE — OFICIAL [CLASSIFICADO]',
    'CLASSIFICATION: TOP SECRET': 'CLASSIFICAÇÃO: ULTRA SECRETO',
    'FILE: VAR-96-MED-007': 'ARQUIVO: VAR-96-MED-007',
    'SUBJECT: [CLASSIFIED], Corporal': 'SUJEITO: [CLASSIFICADO], Cabo',
    'Rank: Corporal, Military Police': 'Patente: Cabo, Polícia Militar',
    'Unit: 4th Company, Varginha': 'Unidade: 4ª Companhia, Varginha',
    'Status: DECEASED (15-FEB-1996)': 'Status: FALECIDO (15-FEV-1996)',
    'TIMELINE OF EVENTS:': 'CRONOLOGIA DOS EVENTOS:',
    '20-JAN 21:30': '20-JAN 21:30',
    '  The officer responds to call regarding': '  O oficial responde a chamado referente a',
    '  "strange animal" in Jardim Andere area.': '  "animal estranho" na área do Jardim Andere.',
    '  Arrives at scene, assists with containment.': '  Chega ao local, auxilia na contenção.',
    '20-JAN 22:15': '20-JAN 22:15',
    '  Officer makes direct physical contact with': '  Oficial faz contato físico direto com',
    '  fauna specimen during loading operation.':
      '  espécime de fauna durante operação de carregamento.',
    '  Contact area: Left forearm, bare skin.':
      '  Área de contato: Antebraço esquerdo, pele exposta.',
    '  Duration: Approximately 3-4 seconds.': '  Duração: Aproximadamente 3-4 segundos.',
    '21-JAN 08:00': '21-JAN 08:00',
    '  Officer reports to duty, notes mild fatigue.':
      '  Oficial se apresenta para serviço, relata fadiga leve.',
    '  Attributes to late shift previous night.': '  Atribui ao turno tardio da noite anterior.',
    '23-JAN': '23-JAN',
    '  Officer complains of headaches, joint pain.':
      '  Oficial reclama de dores de cabeça, dores articulares.',
    '  Skin irritation noted at contact site.':
      '  Irritação cutânea observada no local de contato.',
    '  Reports "strange dreams."': '  Relata "sonhos estranhos."',
    '27-JAN': '27-JAN',
    '  Officer hospitalized with fever, weakness.': '  Oficial hospitalizado com febre, fraqueza.',
    '  Diagnosis: "Unknown infection"': '  Diagnóstico: "Infecção desconhecida"',
    '  Blood work shows anomalous markers.': '  Exames de sangue mostram marcadores anômalos.',
    '02-FEB': '02-FEV',
    '  Condition deteriorates rapidly.': '  Condição deteriora rapidamente.',
    '  Multiple organ systems affected.': '  Múltiplos sistemas orgânicos afetados.',
    '  Transfer to military hospital (São Paulo).':
      '  Transferência para hospital militar (São Paulo).',
    '15-FEB 03:47': '15-FEV 03:47',
    '  The officer expires.': '  O oficial vem a óbito.',
    '  Official cause: "Pneumonia complications"': '  Causa oficial: "Complicações de pneumonia"',
    'MEDICAL NOTES (SUPPRESSED):': 'NOTAS MÉDICAS (SUPRIMIDAS):',
    '  Attending physician noted:': '  Médico responsável observou:',
    '  - Tissue necrosis at contact site': '  - Necrose tecidual no local de contato',
    '  - Unprecedented immune system collapse': '  - Colapso imunológico sem precedentes',
    '  - Unidentifiable pathogen in blood samples':
      '  - Patógeno não identificável em amostras de sangue',
    '  - Brain scans showed unusual activity patterns':
      '  - Exames cerebrais mostraram padrões de atividade incomuns',
    '  Physician quote (recorded):': '  Citação do médico (gravada):',
    '  "I have never seen anything like this.': '  "Eu nunca vi nada parecido com isso.',
    '   This is not any known disease."': '   Isso não é nenhuma doença conhecida."',
    'CONTAINMENT ACTIONS:': 'AÇÕES DE CONTENÇÃO:',
    '  - Medical records CLASSIFIED': '  - Registros médicos CLASSIFICADOS',
    '  - Attending physician reassigned': '  - Médico responsável transferido',
    '  - Blood samples transferred to [REDACTED]':
      '  - Amostras de sangue transferidas para [SUPRIMIDO]',
    '  - Family briefed on "pneumonia" cause': '  - Família informada sobre causa "pneumonia"',
    '  - Compensation package arranged': '  - Pacote de compensação providenciado',
    // ═══ expansionContent.ts — autopsy_suppression ═══
    'DIRECTIVE — AUTOPSY SUPPRESSION': 'DIRETIVA — SUPRESSÃO DE AUTÓPSIA',
    'DATE: 16-FEB-1996': 'DATA: 16-FEV-1996',
    'RE: Remains of the deceased corporal': 'REF: Restos mortais do cabo falecido',
    'Per authority of [REDACTED], the following directive':
      'Por autoridade de [SUPRIMIDO], a seguinte diretiva',
    'is IMMEDIATELY effective:': 'é IMEDIATAMENTE efetiva:',
    '1. Standard autopsy procedure is CANCELLED.':
      '1. Procedimento padrão de autópsia está CANCELADO.',
    '2. A modified examination will be conducted by': '2. Um exame modificado será conduzido por',
    '   cleared personnel from Project HARVEST only.':
      '   pessoal credenciado somente do Projeto HARVEST.',
    '3. All tissue samples are classified and must be':
      '3. Todas as amostras de tecido são classificadas e devem ser',
    '   transferred to [REDACTED] facility.': '   transferidas para instalação [SUPRIMIDA].',
    '4. The official autopsy report will state:': '4. O laudo oficial de autópsia declarará:',
    '   "Cause of death: Respiratory failure': '   "Causa da morte: Insuficiência respiratória',
    '    secondary to pneumonia complications."': '    secundária a complicações de pneumonia."',
    '5. No copy of actual findings will be retained':
      '5. Nenhuma cópia dos achados reais será mantida',
    '   at the hospital or municipal morgue.': '   no hospital ou necrotério municipal.',
    'JUSTIFICATION:': 'JUSTIFICATIVA:',
    "  Subject\\'s exposure to recovered fauna specimen":
      '  A exposição do sujeito ao espécime de fauna recuperado',
    '  resulted in contamination of unknown nature.':
      '  resultou em contaminação de natureza desconhecida.',
    '  Pathological findings could compromise ongoing':
      '  Achados patológicos poderiam comprometer operações',
    '  containment operations if disclosed.': '  de contenção em andamento se divulgados.',
    '  The anomalous pathogen must be studied under': '  O patógeno anômalo deve ser estudado sob',
    '  controlled conditions only.': '  condições controladas apenas.',
    'SECURITY NOTE:': 'NOTA DE SEGURANÇA:',
    '  Any medical personnel who observed actual condition':
      '  Qualquer pessoal médico que observou a condição real',
    '  of the deceased are to be debriefed immediately':
      '  do falecido deve ser interrogado imediatamente',
    '  under Protocol SOMBRA.': '  sob o Protocolo SOMBRA.',
    '  NDA signatures required from all parties.':
      '  Assinaturas de termo de confidencialidade exigidas de todas as partes.',
    // ═══ expansionContent.ts — family_compensation ═══
    "COMPENSATION ARRANGEMENT — OFFICER'S FAMILY": 'ACORDO DE COMPENSAÇÃO — FAMÍLIA DO OFICIAL',
    'DATE: 20-FEB-1996': 'DATA: 20-FEV-1996',
    'BENEFICIARIES:': 'BENEFICIÁRIOS:',
    '  Wife: [REDACTED]': '  Esposa: [SUPRIMIDO]',
    '  Children: 2 (ages 7 and 4)': '  Filhos: 2 (idades 7 e 4)',
    'OFFICIAL BENEFITS (Standard):': 'BENEFÍCIOS OFICIAIS (Padrão):',
    '  - Death in service pension': '  - Pensão por morte em serviço',
    '  - Life insurance payout': '  - Pagamento de seguro de vida',
    '  - Educational benefits for children': '  - Benefícios educacionais para os filhos',
    '  Total official: R$ 45,000.00': '  Total oficial: R$ 45.000,00',
    'SUPPLEMENTAL COMPENSATION (Classified):': 'COMPENSAÇÃO SUPLEMENTAR (Classificada):',
    '  Purpose: Ensure family silence regarding':
      '  Finalidade: Garantir silêncio da família sobre',
    '           circumstances of death.': '           as circunstâncias da morte.',
    '  Initial payment: R$ 50,000.00 (cash)': '  Pagamento inicial: R$ 50.000,00 (em espécie)',
    '  Monthly stipend: R$ 2,000.00 (5 years)': '  Pensão mensal: R$ 2.000,00 (5 anos)',
    '  Housing: Apartment (paid, Belo Horizonte)': '  Moradia: Apartamento (pago, Belo Horizonte)',
    '  Employment: Government position for wife': '  Emprego: Cargo público para a esposa',
    '  Total supplemental: ~R$ 220,000.00': '  Total suplementar: ~R$ 220.000,00',
    'CONDITIONS:': 'CONDIÇÕES:',
    '  - Family agrees to "pneumonia" narrative':
      '  - Família concorda com narrativa de "pneumonia"',
    '  - No media interviews (ever)': '  - Nenhuma entrevista na mídia (nunca)',
    '  - No legal action against government': '  - Nenhuma ação legal contra o governo',
    '  - Relocation from Varginha (within 30 days)': '  - Mudança de Varginha (dentro de 30 dias)',
    '  - No contact with UFO investigators': '  - Nenhum contato com investigadores de OVNIs',
    '  Signed: [WIFE OF OFFICER], 20-FEB-1996': '  Assinado: [ESPOSA DO OFICIAL], 20-FEV-1996',
    'NOTE: Family moved to Belo Horizonte 15-MAR-1996':
      'NOTA: Família mudou-se para Belo Horizonte 15-MAR-1996',
    '      Monitoring: Low priority (cooperative)':
      '      Monitoramento: Baixa prioridade (cooperativa)',
    // ═══ expansionContent.ts — coffee_harvest_report ═══
    'REGIONAL ECONOMIC REPORT — COFFEE SECTOR': 'RELATÓRIO ECONÔMICO REGIONAL — SETOR CAFEEIRO',
    'PERIOD: Q1 1996': 'PERÍODO: 1º TRIM 1996',
    'REGION: Sul de Minas': 'REGIÃO: Sul de Minas',
    'MARKET CONDITIONS:': 'CONDIÇÕES DE MERCADO:',
    '  The Sul de Minas coffee region continues to be':
      '  A região cafeeira do Sul de Minas continua sendo',
    "  Brazil\\'s premier arabica production zone.":
      '  a principal zona de produção de arábica do Brasil.',
    '  Current harvest: PROGRESSING NORMALLY': '  Colheita atual: PROGREDINDO NORMALMENTE',
    '  Expected yield: 2.3 million bags': '  Produção esperada: 2,3 milhões de sacas',
    '  Quality assessment: ABOVE AVERAGE': '  Avaliação de qualidade: ACIMA DA MÉDIA',
    'PRICE INDICATORS:': 'INDICADORES DE PREÇO:',
    '  NYC Commodity Exchange: $1.42/lb (Jan avg)':
      '  Bolsa de Commodities de NYC: $1,42/lb (média Jan)',
    '  Local cooperative price: R$ 85.00/bag': '  Preço da cooperativa local: R$ 85,00/saca',
    '  Trend: STABLE with slight upward pressure': '  Tendência: ESTÁVEL com leve pressão de alta',
    'REGIONAL NOTES:': 'NOTAS REGIONAIS:',
    "  - Varginha remains the region\\'s logistics hub":
      '  - Varginha permanece o centro logístico da região',
    '  - Railroad capacity adequate for current volume':
      '  - Capacidade ferroviária adequada para o volume atual',
    '  - Export documentation processing normal':
      '  - Processamento de documentação de exportação normal',
    'LABOR:': 'MÃO DE OBRA:',
    '  - Seasonal workers arriving as expected':
      '  - Trabalhadores sazonais chegando conforme esperado',
    '  - No significant disputes reported': '  - Nenhuma disputa significativa reportada',
    'ASSESSMENT:': 'AVALIAÇÃO:',
    '  Coffee sector operation NORMAL.': '  Operação do setor cafeeiro NORMAL.',
    '  No economic anomalies detected.': '  Nenhuma anomalia econômica detectada.',
    // ═══ expansionContent.ts — weather_report_jan96 ═══
    'METEOROLOGICAL SUMMARY — JANUARY 1996': 'RESUMO METEOROLÓGICO — JANEIRO 1996',
    'STATION: Varginha Regional': 'ESTAÇÃO: Varginha Regional',
    "COORDINATES: 21°33'S, 45°26'W": "COORDENADAS: 21°33'S, 45°26'W",
    '  January 1996 exhibited typical summer patterns':
      '  Janeiro de 1996 apresentou padrões típicos de verão',
    '  for the Sul de Minas region.': '  para a região do Sul de Minas.',
    'KEY DATES:': 'DATAS-CHAVE:',
    '  19-JAN-1996:': '  19-JAN-1996:',
    '    Temperature: 28°C (max) / 18°C (min)': '    Temperatura: 28°C (máx) / 18°C (mín)',
    '    Precipitation: 12mm': '    Precipitação: 12mm',
    '    Cloud cover: Partial (40%)': '    Cobertura de nuvens: Parcial (40%)',
    '    Wind: NE, 15-20 km/h': '    Vento: NE, 15-20 km/h',
    '    SPECIAL: Clear sky after 22:00': '    ESPECIAL: Céu limpo após 22:00',
    '  20-JAN-1996:': '  20-JAN-1996:',
    '    Temperature: 31°C (max) / 19°C (min)': '    Temperatura: 31°C (máx) / 19°C (mín)',
    '    Precipitation: 0mm': '    Precipitação: 0mm',
    '    Cloud cover: Minimal (15%)': '    Cobertura de nuvens: Mínima (15%)',
    '    Wind: Calm': '    Vento: Calmo',
    '    SPECIAL: Excellent visibility': '    ESPECIAL: Excelente visibilidade',
    '  21-JAN-1996:': '  21-JAN-1996:',
    '    Temperature: 29°C (max) / 17°C (min)': '    Temperatura: 29°C (máx) / 17°C (mín)',
    '    Precipitation: 8mm (evening)': '    Precipitação: 8mm (noite)',
    '    Cloud cover: Building afternoon': '    Cobertura de nuvens: Acumulando à tarde',
    '    Wind: Variable': '    Vento: Variável',
    'NOTE: No unusual atmospheric phenomena recorded.':
      'NOTA: Nenhum fenômeno atmosférico incomum registrado.',
    '      Standard summer conditions for region.':
      '      Condições padrão de verão para a região.',
    // ═══ expansionContent.ts — local_politics_memo ═══
    'POLITICAL SUMMARY — VARGINHA MUNICIPALITY': 'RESUMO POLÍTICO — MUNICÍPIO DE VARGINHA',
    'DATE: 15-JAN-1996': 'DATA: 15-JAN-1996',
    'ROUTINE ASSESSMENT': 'AVALIAÇÃO DE ROTINA',
    'CURRENT ADMINISTRATION:': 'ADMINISTRAÇÃO ATUAL:',
    '  Mayor: [REDACTED]': '  Prefeito: [SUPRIMIDO]',
    '  Party: PMDB': '  Partido: PMDB',
    '  Term: 1993-1996 (final year)': '  Mandato: 1993-1996 (último ano)',
    'POLITICAL CLIMATE:': 'CLIMA POLÍTICO:',
    '  - Municipal elections scheduled October 1996':
      '  - Eleições municipais previstas para outubro de 1996',
    '  - Current administration approval: MODERATE':
      '  - Aprovação da administração atual: MODERADA',
    '  - No significant controversies': '  - Nenhuma controvérsia significativa',
    'NOTABLE DEVELOPMENTS:': 'DESENVOLVIMENTOS NOTÁVEIS:',
    '  - Infrastructure projects on schedule':
      '  - Projetos de infraestrutura dentro do cronograma',
    '  - Coffee cooperative relations stable': '  - Relações com cooperativa cafeeira estáveis',
    '  - Hospital expansion approved': '  - Expansão do hospital aprovada',
    '  - School enrollment increasing': '  - Matrículas escolares em crescimento',
    'SECURITY CONCERNS:': 'PREOCUPAÇÕES DE SEGURANÇA:',
    '  - Petty crime: Within normal parameters':
      '  - Criminalidade menor: Dentro dos parâmetros normais',
    '  - Organized crime: No presence detected': '  - Crime organizado: Nenhuma presença detectada',
    '  - Labor unrest: None': '  - Conflitos trabalhistas: Nenhum',
    '  Politically stable region.': '  Região politicamente estável.',
    '  No monitoring priority.': '  Sem prioridade de monitoramento.',
    // ═══ expansionContent.ts — municipal_budget_96 ═══
    'MUNICIPAL BUDGET ALLOCATION — 1996': 'ALOCAÇÃO ORÇAMENTÁRIA MUNICIPAL — 1996',
    'VARGINHA PREFECTURE': 'PREFEITURA DE VARGINHA',
    'PROJECTED REVENUE: R$ 42,500,000.00': 'RECEITA PROJETADA: R$ 42.500.000,00',
    'ALLOCATION BY SECTOR:': 'ALOCAÇÃO POR SETOR:',
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
    'SPECIAL PROJECTS:': 'PROJETOS ESPECIAIS:',
    '  - Hospital wing expansion (Phase 2)': '  - Expansão da ala hospitalar (Fase 2)',
    '  - School renovation program': '  - Programa de reforma escolar',
    '  - Road maintenance (Rte. 381)': '  - Manutenção rodoviária (Rod. 381)',
    '  - Municipal zoo improvements': '  - Melhorias no zoológico municipal',
    'STATUS: Approved by City Council, 18-DEC-1995':
      'STATUS: Aprovado pela Câmara Municipal, 18-DEZ-1995',
    // ═══ expansionContent.ts — railroad_schedule ═══
    'RAILROAD TRAFFIC — VARGINHA STATION': 'TRÁFEGO FERROVIÁRIO — ESTAÇÃO VARGINHA',
    'SCHEDULE: JANUARY 1996': 'HORÁRIOS: JANEIRO 1996',
    'REGULAR FREIGHT SERVICE:': 'SERVIÇO REGULAR DE CARGA:',
    '  Mon-Fri 06:00 — Coffee cargo (southbound)': '  Seg-Sex 06:00 — Carga de café (sentido sul)',
    '  Mon-Fri 14:00 — Industrial goods (northbound)':
      '  Seg-Sex 14:00 — Bens industriais (sentido norte)',
    '  Tue-Thu 22:00 — Overnight freight': '  Ter-Qui 22:00 — Carga noturna',
    'SPECIAL MOVEMENTS:': 'MOVIMENTOS ESPECIAIS:',
    '  20-JAN 03:30 — MILITARY (classified)': '  20-JAN 03:30 — MILITAR (classificado)',
    '                 Authorization: Regional Command':
      '                 Autorização: Comando Regional',
    '                 Cars: 3 (covered freight)': '                 Vagões: 3 (carga coberta)',
    '                 Destination: Campinas': '                 Destino: Campinas',
    '  21-JAN 01:15 — MILITARY (classified)': '  21-JAN 01:15 — MILITAR (classificado)',
    '                 Cars: 1 (refrigerated)': '                 Vagões: 1 (refrigerado)',
    '                 Destination: São Paulo': '                 Destino: São Paulo',
    'NOTE: Military movements not subject to': 'NOTA: Movimentos militares não sujeitos a',
    '      standard scheduling protocols.': '      protocolos de programação padrão.',
    // ═══ expansionContent.ts — fire_department_log ═══
    'FIRE DEPARTMENT — INCIDENT LOG': 'CORPO DE BOMBEIROS — REGISTRO DE OCORRÊNCIAS',
    'STATION: Varginha Central': 'QUARTEL: Varginha Central',
    'PERIOD: 15-25 JAN 1996': 'PERÍODO: 15-25 JAN 1996',
    '15-JAN 14:22 — Grass fire, Rte. 381 km 42':
      '15-JAN 14:22 — Incêndio em vegetação, Rod. 381 km 42',
    '               Cause: Cigarette': '               Causa: Cigarro',
    '               Resolved: 15:45': '               Resolvido: 15:45',
    '17-JAN 09:15 — Smoke alarm, Hospital Regional':
      '17-JAN 09:15 — Alarme de fumaça, Hospital Regional',
    '               Cause: Electrical short': '               Causa: Curto-circuito',
    '               Resolved: 10:00': '               Resolvido: 10:00',
    '18-JAN 21:30 — Vehicle fire, downtown': '18-JAN 21:30 — Incêndio veicular, centro',
    '               Cause: Engine failure': '               Causa: Falha no motor',
    '               Resolved: 22:15': '               Resolvido: 22:15',
    '20-JAN 16:45 — [REDACTED]': '20-JAN 16:45 — [SUPRIMIDO]',
    '               Location: Jardim Andere': '               Local: Jardim Andere',
    '               Authorization: Military Police': '               Autorização: Polícia Militar',
    '               Resolved: [CLASSIFIED]': '               Resolvido: [CLASSIFICADO]',
    '20-JAN 23:00 — [REDACTED]': '20-JAN 23:00 — [SUPRIMIDO]',
    '               Location: [CLASSIFIED]': '               Local: [CLASSIFICADO]',
    '               Authorization: Regional Command':
      '               Autorização: Comando Regional',
    '22-JAN 11:30 — Kitchen fire, residential': '22-JAN 11:30 — Incêndio em cozinha, residencial',
    '               Cause: Cooking oil': '               Causa: Óleo de cozinha',
    '               Resolved: 11:50': '               Resolvido: 11:50',
    '24-JAN 16:00 — False alarm, school': '24-JAN 16:00 — Alarme falso, escola',
    '               Cause: Student prank': '               Causa: Brincadeira de estudante',
    '               Resolved: 16:15': '               Resolvido: 16:15',
    'STANDARD OPERATING PROCEDURE — INCIDENT REVIEW':
      'PROCEDIMENTO OPERACIONAL PADRÃO — REVISÃO DE INCIDENTE',
    'DOCUMENT: SOP-IR-1989 (REV. 1994)': 'DOCUMENTO: SOP-IR-1989 (REV. 1994)',
    'CLASSIFICATION: INTERNAL USE': 'CLASSIFICAÇÃO: USO INTERNO',
    '  This protocol establishes minimum requirements for':
      '  Este protocolo estabelece requisitos mínimos para',
    '  internal incident reconstruction and review.':
      '  reconstrução e revisão interna de incidentes.',
    'APPLICABILITY:': 'APLICABILIDADE:',
    '  All personnel conducting post-incident assessment':
      '  Todo o pessoal conduzindo avaliação pós-incidente',
    '  via archived terminal access.': '  via acesso ao terminal de arquivo.',
    'REVIEW DIMENSIONS': 'DIMENSÕES DA REVISÃO',
    '  1. PHYSICAL ASSETS': '  1. ATIVOS FÍSICOS',
    '     Recovery, transport, and disposition of materials.':
      '     Recuperação, transporte e disposição de materiais.',
    '     Cross-reference: storage/, ops/logistics/':
      '     Referência cruzada: storage/, ops/logistics/',
    '  2. EQUIPMENT AND MATERIEL': '  2. EQUIPAMENTOS E MATERIAL',
    '     Inventory, condition assessment, and disposition.':
      '     Inventário, avaliação de condição e disposição.',
    '     Cross-reference: storage/assets/': '     Referência cruzada: storage/assets/',
    '  3. COMMUNICATIONS': '  3. COMUNICAÇÕES',
    '     Signal intercepts, liaison activity, foreign contact.':
      '     Interceptação de sinais, atividade de enlace, contato estrangeiro.',
    '     Cross-reference: comms/': '     Referência cruzada: comms/',
    '  4. OVERSIGHT & COORDINATION': '  4. SUPERVISÃO E COORDENAÇÃO',
    '     Multi-agency involvement, authorization chains.':
      '     Envolvimento multi-agência, cadeias de autorização.',
    '     Cross-reference: admin/': '     Referência cruzada: admin/',
    '  5. FORWARD RISK ASSESSMENT': '  5. AVALIAÇÃO PROSPECTIVA DE RISCO',
    '     Projected timelines, recurrence models, contingencies.':
      '     Cronogramas projetados, modelos de recorrência, contingências.',
    '     Cross-reference: admin/ (restricted)': '     Referência cruzada: admin/ (restrito)',
    'COMPLETION CRITERIA': 'CRITÉRIOS DE CONCLUSÃO',
    '  A review is considered SUBSTANTIVE when the reviewer':
      '  Uma revisão é considerada SUBSTANTIVA quando o revisor',
    '  has established coherent understanding across multiple':
      '  estabeleceu compreensão coerente através de múltiplas',
    '  dimensions listed above.': '  dimensões listadas acima.',
    '  Partial reviews are flagged as INCOMPLETE.':
      '  Revisões parciais são marcadas como INCOMPLETAS.',
    '  Reviews lacking cross-dimensional correlation are':
      '  Revisões sem correlação interdimensional são',
    '  flagged as INCOHERENT.': '  marcadas como INCOERENTES.',
    'REVIEWER OBLIGATIONS': 'OBRIGAÇÕES DO REVISOR',
    '  - Reconstruct event timeline from available records':
      '  - Reconstruir cronologia do evento a partir dos registros disponíveis',
    '  - Identify gaps in documentation or evidence':
      '  - Identificar lacunas na documentação ou evidências',
    '  - Note discrepancies between official and raw records':
      '  - Notar discrepâncias entre registros oficiais e brutos',
    '  - Assess forward implications if applicable':
      '  - Avaliar implicações futuras quando aplicável',
    '  NOTE: Reviewers should expect classification barriers.':
      '  NOTA: Revisores devem esperar barreiras de classificação.',
    '  Some materials require elevated clearance or recovered access.':
      '  Alguns materiais exigem autorização elevada ou acesso recuperado.',
    'END DOCUMENT': 'FIM DO DOCUMENTO',
    'TERMINAL ACCESS — SESSION PARAMETERS': 'ACESSO AO TERMINAL — PARÂMETROS DA SESSÃO',
    'AUTO-GENERATED AT LOGIN': 'GERADO AUTOMATICAMENTE NO LOGIN',
    'ACCESS TYPE: Review Terminal (Legacy Archive)':
      'TIPO DE ACESSO: Terminal de Revisão (Arquivo Legado)',
    'SESSION CLASS: Incident Reconstruction': 'CLASSE DA SESSÃO: Reconstrução de Incidente',
    'REMINDER:': 'LEMBRETE:',
    '  This terminal provides read-only access to archived':
      '  Este terminal fornece acesso somente leitura a',
    '  incident records. Your session activity is logged.':
      '  registros de incidentes arquivados. Sua atividade de sessão é registrada.',
    'EXPECTED WORKFLOW:': 'FLUXO DE TRABALHO ESPERADO:',
    '  1. Navigate directories to locate relevant records':
      '  1. Navegar diretórios para localizar registros relevantes',
    '  2. Open and examine files for incident details':
      '  2. Abrir e examinar arquivos para detalhes do incidente',
    '  3. Open recovered files directly when access allows':
      '  3. Abra arquivos recuperados diretamente quando o acesso permitir',
    '  4. Cross-reference multiple sources for correlation':
      '  4. Fazer referência cruzada de múltiplas fontes para correlação',
    '  5. Use TRACE to monitor system awareness (optional)':
      '  5. Usar TRACE para monitorar consciência do sistema (opcional)',
    'COHERENCE NOTE:': 'NOTA DE COERÊNCIA:',
    '  Effective reviews demonstrate correlation between':
      '  Revisões eficazes demonstram correlação entre',
    '  physical evidence, subject records, communications,':
      '  evidências físicas, registros de sujeitos, comunicações,',
    '  and administrative oversight.': '  e supervisão administrativa.',
    '  Random file access without correlation may trigger':
      '  Acesso aleatório a arquivos sem correlação pode acionar',
    '  session monitoring as anomalous behavior.':
      '  monitoramento de sessão como comportamento anômalo.',
    'INTERNAL MEMORANDUM — FACILITIES DIVISION': 'MEMORANDO INTERNO — DIVISÃO DE INSTALAÇÕES',
    'RE: Cafeteria Service Hours': 'REF: Horários do Refeitório',
    'Effective 20-JAN-1996, cafeteria hours will be adjusted:':
      'A partir de 20-JAN-1996, os horários do refeitório serão ajustados:',
    '  Breakfast: 06:30 - 08:30': '  Café da manhã: 06:30 - 08:30',
    '  Lunch: 11:30 - 13:30': '  Almoço: 11:30 - 13:30',
    '  Dinner: 17:30 - 19:30 (Tuesdays only)': '  Jantar: 17:30 - 19:30 (somente terças-feiras)',
    'Staff working extended shifts may request meal vouchers':
      'Funcionários em turnos estendidos podem solicitar vale-refeição',
    'from the Administrative Office (Room 204).': 'no Escritório Administrativo (Sala 204).',
    'The vending machines on Floor 3 remain operational 24h.':
      'As máquinas de venda no Andar 3 permanecem operacionais 24h.',
    'Questions: Contact Facilities ext. 2240': 'Dúvidas: Contatar Instalações ramal 2240',
    'PARKING ALLOCATION — JANUARY 1996': 'ALOCAÇÃO DE ESTACIONAMENTO — JANEIRO 1996',
    'ADMINISTRATIVE SERVICES': 'SERVIÇOS ADMINISTRATIVOS',
    'LOT A (Reserved):': 'LOTE A (Reservado):',
    '  A-01 through A-15: Director-level personnel': '  A-01 a A-15: Pessoal de nível de diretoria',
    '  A-16 through A-20: Visiting officials': '  A-16 a A-20: Oficiais visitantes',
    'LOT B (General):': 'LOTE B (Geral):',
    '  First-come basis. Gates close at 22:00.': '  Por ordem de chegada. Portões fecham às 22:00.',
    'NOTICE:': 'AVISO:',
    '  Effective 21-JAN, Lot B Section 3 will be closed':
      '  A partir de 21-JAN, a Seção 3 do Lote B será fechada',
    '  for resurfacing. Duration: 5 business days.': '  para recapeamento. Duração: 5 dias úteis.',
    'Overflow parking available at municipal lot (200m east).':
      'Estacionamento adicional disponível no lote municipal (200m a leste).',
    'Shuttle service discontinued due to budget constraints.':
      'Serviço de transporte descontinuado por restrições orçamentárias.',
    'BUDGET REQUEST — Q1 1996': 'SOLICITAÇÃO DE ORÇAMENTO — T1 1996',
    'DEPARTMENT: Regional Intelligence (Sector 7)': 'DEPARTAMENTO: Inteligência Regional (Setor 7)',
    'SUBMITTED: 08-JAN-1996': 'SUBMETIDO: 08-JAN-1996',
    'REQUESTED ALLOCATIONS:': 'ALOCAÇÕES SOLICITADAS:',
    '  Routine operations. No special projects anticipated.':
      '  Operações de rotina. Nenhum projeto especial previsto.',
    'STATUS: PENDING APPROVAL': 'STATUS: APROVAÇÃO PENDENTE',
    'NOTE: Request submitted BEFORE incident of 20-JAN.':
      'NOTA: Solicitação submetida ANTES do incidente de 20-JAN.',
    '      Supplemental request to follow separately.':
      '      Solicitação suplementar a seguir separadamente.',
    'INTERCEPT SUMMARY — DECEMBER 1995': 'RESUMO DE INTERCEPTAÇÃO — DEZEMBRO 1995',
    'CLASSIFICATION: ROUTINE': 'CLASSIFICAÇÃO: ROTINA',
    'REGION: Minas Gerais / São Paulo Border': 'REGIÃO: Fronteira Minas Gerais / São Paulo',
    'TOTAL INTERCEPTS: 47': 'TOTAL DE INTERCEPTAÇÕES: 47',
    'FLAGGED FOR REVIEW: 3': 'SINALIZADOS PARA REVISÃO: 3',
    'ACTIONABLE INTELLIGENCE: 0': 'INTELIGÊNCIA ACIONÁVEL: 0',
    '  Agricultural price discussions (12)': '  Discussões sobre preços agrícolas (12)',
    '  Personal/family communications (28)': '  Comunicações pessoais/familiares (28)',
    '  Commercial negotiations (5)': '  Negociações comerciais (5)',
    '  Political commentary (2)': '  Comentários políticos (2)',
    'NOTES:': 'NOTAS:',
    '  No unusual activity detected.': '  Nenhuma atividade incomum detectada.',
    '  Recommend maintaining current monitoring level.':
      '  Recomenda-se manter o nível atual de monitoramento.',
    'SIGNAL INTERCEPT — AUDIO CAPTURE': 'INTERCEPTAÇÃO DE SINAL — CAPTURA DE ÁUDIO',
    'DATE: 20-JAN-1996 03:47 LOCAL': 'DATA: 20-JAN-1996 03:47 LOCAL',
    'LOCATION: Triangulation point near recovery site':
      'LOCALIZAÇÃO: Ponto de triangulação próximo ao local de recuperação',
    'INTERCEPT TYPE: Morse code transmission': 'TIPO DE INTERCEPTAÇÃO: Transmissão em código Morse',
    'FREQUENCY: 7.125 MHz (amateur band, unauthorized)':
      'FREQUÊNCIA: 7,125 MHz (banda amadora, não autorizada)',
    'DURATION: 8.4 seconds': 'DURAÇÃO: 8,4 segundos',
    'RAW SIGNAL TRANSCRIPTION:': 'TRANSCRIÇÃO BRUTA DO SINAL:',
    'MORSE CODE REFERENCE:': 'REFERÊNCIA DE CÓDIGO MORSE:',
    '  (Space between letters: 3 units)': '  (Espaço entre letras: 3 unidades)',
    '  (Space between words: 7 units)': '  (Espaço entre palavras: 7 unidades)',
    'ANALYST NOTES:': 'NOTAS DO ANALISTA:',
    '  Transmission origin unknown. Signal appeared on frequency':
      '  Origem da transmissão desconhecida. Sinal apareceu na frequência',
    '  used by ground teams but NOT from any authorized unit.':
      '  usada pelas equipes de campo, mas NÃO de nenhuma unidade autorizada.',
    '  Signal pre-dates official COMINT sweep by 6 hours.':
      '  Sinal antecede a varredura COMINT oficial em 6 horas.',
    "  Believe this is a field operator's authentication code.":
      '  Acredita-se que este é um código de autenticação de operador de campo.',
    '  NOTE: Cross-reference with admin override credentials.':
      '  NOTA: Referência cruzada com credenciais de override administrativo.',
    '  Decode may yield system access passphrase.':
      '  A decodificação pode revelar a senha de acesso ao sistema.',
    '  PRIORITY: Decipher message content.': '  PRIORIDADE: Decifrar conteúdo da mensagem.',
    '  STATUS: PENDING INTERPRETATION': '  STATUS: INTERPRETAÇÃO PENDENTE',
    'HVAC MAINTENANCE LOG — BUILDING 3': 'REGISTRO DE MANUTENÇÃO HVAC — EDIFÍCIO 3',
    'PERIOD: 01-JAN-1996 to 31-JAN-1996': 'PERÍODO: 01-JAN-1996 a 31-JAN-1996',
    '03-JAN: Filter replacement, Floor 2 units (routine)':
      '03-JAN: Substituição de filtros, unidades do Andar 2 (rotina)',
    '07-JAN: Compressor inspection, Rooftop Unit A (passed)':
      '07-JAN: Inspeção do compressor, Unidade de Cobertura A (aprovado)',
    '12-JAN: Thermostat calibration, Room 317 (adjusted +2C)':
      '12-JAN: Calibração do termostato, Sala 317 (ajustado +2C)',
    '18-JAN: Duct cleaning, Basement level (completed)':
      '18-JAN: Limpeza de dutos, Nível do subsolo (concluído)',
    '22-JAN: EMERGENCY — Basement cold storage unit failure':
      '22-JAN: EMERGÊNCIA — Falha na unidade de armazenamento frio do subsolo',
    '        Cause: Power surge. Backup generator activated.':
      '        Causa: Surto de energia. Gerador de backup ativado.',
    '        Duration of outage: 4 hours.': '        Duração da interrupção: 4 horas.',
    '        Estimated spoilage: CLASSIFIED': '        Perda estimada: CLASSIFICADO',
    '25-JAN: Cold storage unit repaired. Testing satisfactory.':
      '25-JAN: Unidade de armazenamento frio reparada. Teste satisfatório.',
    '28-JAN: Routine inspection, all floors (no issues)':
      '28-JAN: Inspeção de rotina, todos os andares (sem problemas)',
    'PERSONNEL TRANSFER NOTICE': 'AVISO DE TRANSFERÊNCIA DE PESSOAL',
    'EFFECTIVE: 01-FEB-1996': 'VIGÊNCIA: 01-FEV-1996',
    'The following transfers are confirmed:': 'As seguintes transferências estão confirmadas:',
    '  CPT. R. FERREIRA → Brasília (Central Command)':
      '  CPT. R. FERREIRA → Brasília (Comando Central)',
    '  SGT. A. LIMA → São Paulo (Liaison Office)':
      '  SGT. A. LIMA → São Paulo (Escritório de Enlace)',
    '  ANALYST M. COSTA → CLASSIFIED ASSIGNMENT': '  ANALISTA M. COSTA → DESIGNAÇÃO CLASSIFICADA',
    'Exit interviews scheduled for 30-JAN.': 'Entrevistas de desligamento agendadas para 30-JAN.',
    'Access credentials to be revoked 01-FEB 00:00.':
      'Credenciais de acesso serão revogadas em 01-FEV 00:00.',
    "NOTE: CPT. FERREIRA's case files transferred to":
      'NOTA: Arquivos de caso do CPT. FERREIRA transferidos para',
    '      Acting Chief L. ANDRADE pending replacement.':
      '      Chefe Interino L. ANDRADE enquanto aguarda substituição.',
    'REGIONAL INTELLIGENCE SUMMARY — JANUARY 1996':
      'RESUMO DE INTELIGÊNCIA REGIONAL — JANEIRO 1996',
    'SECTOR: Triângulo Mineiro': 'SETOR: Triângulo Mineiro',
    'PRIORITY ITEMS: None': 'ITENS PRIORITÁRIOS: Nenhum',
    'ROUTINE MONITORING:': 'MONITORAMENTO DE ROTINA:',
    '  - Labor union activity: Normal seasonal levels':
      '  - Atividade sindical: Níveis sazonais normais',
    '  - Agricultural sector: Soy prices stable': '  - Setor agrícola: Preços da soja estáveis',
    '  - Border crossings: Within expected parameters':
      '  - Cruzamentos de fronteira: Dentro dos parâmetros esperados',
    'ANOMALIES:': 'ANOMALIAS:',
    '  - 17-JAN: Unauthorized radio transmission near Uberaba':
      '  - 17-JAN: Transmissão de rádio não autorizada próximo a Uberaba',
    '    Assessment: Amateur operator (warning issued)':
      '    Avaliação: Operador amador (advertência emitida)',
    '  - 19-JAN: Unscheduled cargo delivery, regional depot':
      '  - 19-JAN: Entrega de carga não programada, depósito regional',
    '    Assessment: Paperwork error (corrected)':
      '    Avaliação: Erro de documentação (corrigido)',
    'ANALYST NOTE:': 'NOTA DO ANALISTA:',
    '  No items require escalation this period.':
      '  Nenhum item requer escalonamento neste período.',
    'ASSET TRANSFER FORM — ATF-1996-0023': 'FORMULÁRIO DE TRANSFERÊNCIA DE ATIVOS — ATF-1996-0023',
    'STATUS: INCOMPLETE — RETURNED FOR CORRECTION': 'STATUS: INCOMPLETO — DEVOLVIDO PARA CORREÇÃO',
    'TRANSFER FROM: HOLDING-7': 'TRANSFERÊNCIA DE: HOLDING-7',
    'TRANSFER TO: [FIELD LEFT BLANK]': 'TRANSFERÊNCIA PARA: [CAMPO EM BRANCO]',
    'ITEMS:': 'ITENS:',
    '  1x Container, sealed, 45kg': '  1x Contêiner, lacrado, 45kg',
    '  1x Case, documents, classified': '  1x Maleta, documentos, classificados',
    'ERROR: Receiving party signature MISSING': 'ERRO: Assinatura da parte receptora AUSENTE',
    'ERROR: Authorization code INVALID': 'ERRO: Código de autorização INVÁLIDO',
    'ERROR: Destination facility code NOT RECOGNIZED':
      'ERRO: Código da instalação de destino NÃO RECONHECIDO',
    'RETURN NOTE:': 'NOTA DE DEVOLUÇÃO:',
    '  Form returned to originator for correction.':
      '  Formulário devolvido ao remetente para correção.',
    '  Transfer pending until paperwork complete.':
      '  Transferência pendente até a conclusão da documentação.',
    'TEMPORARY NOTE — DO NOT ARCHIVE': 'NOTA TEMPORÁRIA — NÃO ARQUIVAR',
    'Remember:': 'Lembrar:',
    '  - Pick up dry cleaning Thursday': '  - Buscar roupa na lavanderia quinta-feira',
    '  - Call mother re: birthday': '  - Ligar para a mãe ref: aniversário',
    '  - Ask IT about printer on Floor 2': '  - Perguntar ao TI sobre a impressora no Andar 2',
    'Meeting notes (delete later):': 'Notas da reunião (apagar depois):',
    '  Director seemed tense today.': '  O diretor parecia tenso hoje.',
    '  Something about "special cargo" needing accommodation.':
      '  Algo sobre "carga especial" precisando de acomodação.',
    '  Nobody tells us anything around here.': '  Ninguém nos conta nada por aqui.',
    'OFFICE SUPPLIES REQUEST — JANUARY 1996':
      'SOLICITAÇÃO DE MATERIAL DE ESCRITÓRIO — JANEIRO 1996',
    'DEPARTMENT: Records & Archives': 'DEPARTAMENTO: Registros e Arquivos',
    'Requested Items:': 'Itens Solicitados:',
    '  - Pens, ballpoint, blue (box of 50)': '  - Canetas, esferográficas, azuis (caixa com 50)',
    '  - Paper, A4, 80gsm (10 reams)': '  - Papel, A4, 80g/m² (10 resmas)',
    '  - Staples, standard (5 boxes)': '  - Grampos, padrão (5 caixas)',
    '  - Folders, manila (100 units)': '  - Pastas, manila (100 unidades)',
    '  - Correction fluid (12 bottles)': '  - Corretivo líquido (12 frascos)',
    '  Standard quarterly replenishment.': '  Reposição trimestral padrão.',
    'APPROVED: M. SANTOS, Administrative Officer': 'APROVADO: M. SANTOS, Oficial Administrativo',
    'STAFF BIRTHDAYS — JANUARY 1996': 'ANIVERSÁRIOS DA EQUIPE — JANEIRO 1996',
    'COMPILED BY: Social Committee': 'COMPILADO POR: Comitê Social',
    'NOTE: Cake contributions are voluntary.': 'NOTA: Contribuições para o bolo são voluntárias.',
    '      Sign up sheet in break room.': '      Folha de inscrição na sala de descanso.',
    'INTERNAL TELEPHONE DIRECTORY — 1996 EDITION': 'DIRETÓRIO TELEFÔNICO INTERNO — EDIÇÃO 1996',
    'ADMINISTRATION:': 'ADMINISTRAÇÃO:',
    'OPERATIONS:': 'OPERAÇÕES:',
    'SUPPORT:': 'SUPORTE:',
    'EMERGENCY: Dial 0 for external line': 'EMERGÊNCIA: Disque 0 para linha externa',
    'VEHICLE MILEAGE LOG — JANUARY 1996': 'REGISTRO DE QUILOMETRAGEM DE VEÍCULOS — JANEIRO 1996',
    'POOL VEHICLE: GOL 1.0 (Plate: AAB-1234)': 'VEÍCULO DO POOL: GOL 1.0 (Placa: AAB-1234)',
    'DATE       DRIVER        START    END      DEST':
      'DATA       MOTORISTA     INÍCIO   FIM      DEST',
    'NOTE: Fuel reimbursement forms in Fleet Office.':
      'NOTA: Formulários de reembolso de combustível no Escritório da Frota.',
    'IT DEPARTMENT NOTICE': 'AVISO DO DEPARTAMENTO DE TI',
    'RE: Floor 2 Printer Issues': 'REF: Problemas da Impressora do Andar 2',
    'The HP LaserJet on Floor 2 is experiencing paper jams.':
      'A HP LaserJet no Andar 2 está apresentando atolamentos de papel.',
    'Temporary workaround:': 'Solução temporária:',
    '  - Use the dot matrix printer in Room 215': '  - Use a impressora matricial na Sala 215',
    '  - Submit large jobs to Print Center (B-1)':
      '  - Envie trabalhos grandes para a Central de Impressão (B-1)',
    'Parts have been ordered. ETA: 2-3 weeks.': 'Peças foram encomendadas. Previsão: 2-3 semanas.',
    'We apologize for the inconvenience.': 'Pedimos desculpas pelo inconveniente.',
    'IT Helpdesk - ext. 4000': 'Helpdesk de TI - ramal 4000',
    'ANONYMOUS FEEDBACK FORM': 'FORMULÁRIO DE FEEDBACK ANÔNIMO',
    'RE: Cafeteria Service': 'REF: Serviço do Refeitório',
    'SUBMITTED: 18-JAN-1996': 'SUBMETIDO: 18-JAN-1996',
    'COMPLAINT:': 'RECLAMAÇÃO:',
    '  The coffee machine has been broken for three weeks.':
      '  A máquina de café está quebrada há três semanas.',
    '  Nobody seems to care. This is unacceptable.':
      '  Ninguém parece se importar. Isso é inaceitável.',
    'SUGGESTION:': 'SUGESTÃO:',
    '  Bring back the Thursday feijoada. It was the only':
      '  Tragam de volta a feijoada de quinta. Era a única',
    '  thing worth eating here.': '  coisa que valia a pena comer aqui.',
    'RESPONSE (Admin):': 'RESPOSTA (Admin):',
    '  Coffee machine repair scheduled for 25-JAN.':
      '  Reparo da máquina de café agendado para 25-JAN.',
    '  Feijoada discontinued due to budget constraints.':
      '  Feijoada descontinuada por restrições orçamentárias.',
    '  We appreciate your feedback.': '  Agradecemos seu feedback.',
    'MEMORANDUM — SECURITY DIVISION': 'MEMORANDO — DIVISÃO DE SEGURANÇA',
    'RE: Annual Badge Renewal': 'REF: Renovação Anual de Crachá',
    'All personnel must renew access badges by 31-JAN-1996.':
      'Todo o pessoal deve renovar crachás de acesso até 31-JAN-1996.',
    'Required documents:': 'Documentos necessários:',
    '  - Current badge': '  - Crachá atual',
    '  - Valid government ID': '  - Documento de identidade válido',
    '  - Updated photo (taken at Security Office)':
      '  - Foto atualizada (tirada no Escritório de Segurança)',
    '  - Supervisor approval form': '  - Formulário de aprovação do supervisor',
    'Temporary extensions available for personnel on':
      'Extensões temporárias disponíveis para pessoal em',
    'field assignment during the renewal window.':
      'missão de campo durante o período de renovação.',
    'Non-compliance will result in access suspension.':
      'O não cumprimento resultará em suspensão do acesso.',
    'Security Division - ext. 2500': 'Divisão de Segurança - ramal 2500',
    'TRAINING SCHEDULE — Q1 1996': 'CRONOGRAMA DE TREINAMENTO — T1 1996',
    'HUMAN RESOURCES DEPARTMENT': 'DEPARTAMENTO DE RECURSOS HUMANOS',
    'MANDATORY TRAINING:': 'TREINAMENTO OBRIGATÓRIO:',
    '  15-JAN: Fire Safety Refresher (All staff)':
      '  15-JAN: Reciclagem de Segurança contra Incêndio (Todos os funcionários)',
    '  22-JAN: Information Security Basics (New hires)':
      '  22-JAN: Básico de Segurança da Informação (Novos contratados)',
    '  05-FEB: First Aid Certification (Floor wardens)':
      '  05-FEV: Certificação de Primeiros Socorros (Responsáveis de andar)',
    '  12-FEB: Document Handling Procedures (Archives)':
      '  12-FEV: Procedimentos de Manuseio de Documentos (Arquivo)',
    'OPTIONAL WORKSHOPS:': 'WORKSHOPS OPCIONAIS:',
    '  29-JAN: Word Processing Tips (Room 204)':
      '  29-JAN: Dicas de Processamento de Texto (Sala 204)',
    '  08-FEB: Stress Management (Auditorium)': '  08-FEV: Gestão de Estresse (Auditório)',
    'Registration: Contact HR ext. 2300': 'Inscrição: Contatar RH ramal 2300',
    'LOST AND FOUND — JANUARY 1996': 'ACHADOS E PERDIDOS — JANEIRO 1996',
    'LOCATION: Security Desk, Building Lobby':
      'LOCALIZAÇÃO: Recepção da Segurança, Saguão do Edifício',
    'ITEMS FOUND:': 'ITENS ENCONTRADOS:',
    '  03-JAN: Black umbrella (Floor 3 bathroom)':
      '  03-JAN: Guarda-chuva preto (banheiro do Andar 3)',
    '  07-JAN: Reading glasses in brown case': '  07-JAN: Óculos de leitura em estojo marrom',
    '  11-JAN: Set of keys (car + house)': '  11-JAN: Conjunto de chaves (carro + casa)',
    '  14-JAN: Watch, silver, digital (cafeteria)':
      '  14-JAN: Relógio, prata, digital (refeitório)',
    '  19-JAN: Wallet, brown leather (parking lot B)':
      '  19-JAN: Carteira, couro marrom (estacionamento B)',
    '  22-JAN: [ITEM DESCRIPTION CLASSIFIED]': '  22-JAN: [DESCRIÇÃO DO ITEM CLASSIFICADA]',
    'Items will be held for 30 days.': 'Itens serão mantidos por 30 dias.',
    'Unclaimed items donated to charity.': 'Itens não reclamados doados para caridade.',
    'MEMORANDUM — OFFICE SUPPLIES BUDGET': 'MEMORANDO — ORÇAMENTO DE MATERIAL DE ESCRITÓRIO',
    'DEPARTMENT: Administrative Services': 'DEPARTAMENTO: Serviços Administrativos',
    'RE: Paper Clip Requisition Dispute': 'REF: Disputa de Requisição de Clipes de Papel',
    'The recent audit has identified discrepancies in paper':
      'A auditoria recente identificou discrepâncias no consumo',
    'clip consumption across departments.': 'de clipes de papel entre os departamentos.',
    '  Q4 1995 paper clip usage: 47 boxes': '  Uso de clipes de papel T4 1995: 47 caixas',
    '  Q4 1995 paper clip budget: 32 boxes': '  Orçamento de clipes de papel T4 1995: 32 caixas',
    '  Variance: +15 boxes (47% over budget)': '  Variação: +15 caixas (47% acima do orçamento)',
    'REMEDIATION:': 'REMEDIAÇÃO:',
    '  1. All departments must submit itemized supply':
      '  1. Todos os departamentos devem submeter solicitações',
    '     requests by the 15th of each month.':
      '     detalhadas de material até o dia 15 de cada mês.',
    '  2. Bulk purchases require supervisor approval.':
      '  2. Compras em volume requerem aprovação do supervisor.',
    '  3. Reuse of paper clips is encouraged.':
      '  3. A reutilização de clipes de papel é encorajada.',
    'NOTE: The acquisition of "jumbo" paper clips must be':
      'NOTA: A aquisição de clipes de papel "jumbo" deve ser',
    'justified in writing. Standard size is sufficient for':
      'justificada por escrito. O tamanho padrão é suficiente para',
    'most document binding requirements.':
      'a maioria das necessidades de encadernação de documentos.',
    'Questions to: Procurement, ext. 2140': 'Dúvidas para: Compras, ramal 2140',
    'SCHEDULED MAINTENANCE — Q1 1996': 'MANUTENÇÃO PROGRAMADA — T1 1996',
    'FACILITIES MANAGEMENT': 'GESTÃO DE INSTALAÇÕES',
    'JANUARY:': 'JANEIRO:',
    '  08-JAN: Elevator inspection (Building A)': '  08-JAN: Inspeção de elevador (Edifício A)',
    '  15-JAN: Fire extinguisher certification': '  15-JAN: Certificação de extintores de incêndio',
    '  22-JAN: Generator test (postponed - see incident)':
      '  22-JAN: Teste de gerador (adiado - ver incidente)',
    '  29-JAN: Pest control service': '  29-JAN: Serviço de controle de pragas',
    'FEBRUARY:': 'FEVEREIRO:',
    '  05-FEB: Roof inspection': '  05-FEV: Inspeção do telhado',
    '  12-FEB: Emergency lighting test': '  12-FEV: Teste de iluminação de emergência',
    '  19-FEB: Water tank cleaning (after hours)':
      "  19-FEV: Limpeza da caixa d'água (fora do horário)",
    '  26-FEB: HVAC filter replacement': '  26-FEV: Substituição de filtros HVAC',
    'MARCH:': 'MARÇO:',
    '  04-MAR: Window cleaning (exterior)': '  04-MAR: Limpeza de janelas (exterior)',
    '  11-MAR: Carpet shampooing (Floor 2)': '  11-MAR: Lavagem de carpete (Andar 2)',
    '  18-MAR: Electrical panel inspection': '  18-MAR: Inspeção do painel elétrico',
    '  25-MAR: Plumbing review (all floors)': '  25-MAR: Revisão hidráulica (todos os andares)',
    'Maintenance requests: ext. 2200 or Form F-112':
      'Solicitações de manutenção: ramal 2200 ou Formulário F-112',
    'CAFETERIA MENU — WEEK 04 (22-26 JAN 1996)':
      'CARDÁPIO DO REFEITÓRIO — SEMANA 04 (22-26 JAN 1996)',
    'SEGUNDA-FEIRA (Monday):': 'SEGUNDA-FEIRA (Monday):',
    '  Strogonoff de frango': '  Strogonoff de frango',
    '  Arroz, batata palha': '  Arroz, batata palha',
    '  Salada verde': '  Salada verde',
    'TERÇA-FEIRA (Tuesday):': 'TERÇA-FEIRA (Tuesday):',
    '  Bife à milanesa': '  Bife à milanesa',
    '  Arroz, feijão, farofa': '  Arroz, feijão, farofa',
    'QUARTA-FEIRA (Wednesday):': 'QUARTA-FEIRA (Wednesday):',
    '  Moqueca de peixe': '  Moqueca de peixe',
    '  Arroz branco, pirão': '  Arroz branco, pirão',
    '  Couve refogada': '  Couve refogada',
    'QUINTA-FEIRA (Thursday):': 'QUINTA-FEIRA (Thursday):',
    '  Cozido à portuguesa': '  Cozido à portuguesa',
    '  Legumes variados': '  Legumes variados',
    '  Pão de alho': '  Pão de alho',
    'SEXTA-FEIRA (Friday):': 'SEXTA-FEIRA (Friday):',
    '  Feijoada light': '  Feijoada light',
    '  Arroz, couve, laranja': '  Arroz, couve, laranja',
    '  Farofa simples': '  Farofa simples',
    'SOBREMESA: Pudim de leite (Mon-Wed)': 'SOBREMESA: Pudim de leite (Seg-Qua)',
    '           Goiabada com queijo (Thu-Fri)': '           Goiabada com queijo (Qui-Sex)',
    'SUCO DO DIA: R$ 0,50': 'SUCO DO DIA: R$ 0,50',
    '             Maracujá | Caju | Acerola': '             Maracujá | Caju | Acerola',
    'Dona Maria wishes everyone a good week.': 'Dona Maria deseja a todos uma boa semana.',
    'PARKING LOT REGULATIONS': 'REGULAMENTO DO ESTACIONAMENTO',
    'EFFECTIVE: 01-JAN-1996': 'VIGÊNCIA: 01-JAN-1996',
    'GENERAL RULES:': 'REGRAS GERAIS:',
    '  1. All vehicles must display valid parking permit.':
      '  1. Todos os veículos devem exibir permissão de estacionamento válida.',
    '  2. Speed limit: 10 km/h in all areas.':
      '  2. Limite de velocidade: 10 km/h em todas as áreas.',
    '  3. No parking in fire lanes (marked in red).':
      '  3. Proibido estacionar em faixas de emergência (marcadas em vermelho).',
    '  4. Motorcycles: designated area only (Lot C).':
      '  4. Motocicletas: apenas em área designada (Lote C).',
    '  5. No overnight parking without authorization.':
      '  5. Proibido estacionamento noturno sem autorização.',
    'PERMIT TYPES:': 'TIPOS DE PERMISSÃO:',
    '  BLUE:   Directors and visiting officials': '  AZUL:   Diretores e oficiais visitantes',
    '  GREEN:  Permanent staff': '  VERDE:  Pessoal permanente',
    '  YELLOW: Temporary/contractor access': '  AMARELO: Acesso temporário/terceirizado',
    '  RED:    Emergency vehicles only': '  VERMELHO: Apenas veículos de emergência',
    'VIOLATIONS:': 'INFRAÇÕES:',
    '  First offense:  Written warning': '  Primeira infração: Advertência por escrito',
    '  Second offense: R$ 20,00 fine': '  Segunda infração: Multa de R$ 20,00',
    '  Third offense:  Parking privilege suspension':
      '  Terceira infração: Suspensão do privilégio de estacionamento',
    'Lost permits: Report to Security, ext. 2000':
      'Permissões perdidas: Reportar à Segurança, ramal 2000',
    'Replacement fee: R$ 5,00': 'Taxa de substituição: R$ 5,00',
    'LOST AND FOUND LOG — DETAILED RECORD': 'REGISTRO DE ACHADOS E PERDIDOS — REGISTRO DETALHADO',
    'SECURITY DESK — JANUARY 1996': 'RECEPÇÃO DA SEGURANÇA — JANEIRO 1996',
    '03-JAN | 14:30 | FOUND: Black umbrella': '03-JAN | 14:30 | ENCONTRADO: Guarda-chuva preto',
    "                Location: Floor 3 men's bathroom":
      '                Local: Banheiro masculino do Andar 3',
    '                Finder: Cleaning staff (M. Santos)':
      '                Encontrado por: Equipe de limpeza (M. Santos)',
    '                Status: CLAIMED 09-JAN': '                Status: RECLAMADO 09-JAN',
    '07-JAN | 09:15 | FOUND: Reading glasses, brown case':
      '07-JAN | 09:15 | ENCONTRADO: Óculos de leitura, estojo marrom',
    '                Location: Conference Room B': '                Local: Sala de Conferência B',
    '                Finder: Meeting attendee':
      '                Encontrado por: Participante de reunião',
    '                Status: UNCLAIMED': '                Status: NÃO RECLAMADO',
    '11-JAN | 16:45 | FOUND: Key ring (3 keys)': '11-JAN | 16:45 | ENCONTRADO: Chaveiro (3 chaves)',
    '                Location: Elevator, Floor 1': '                Local: Elevador, Andar 1',
    '                Finder: Security guard (P. Rocha)':
      '                Encontrado por: Guarda de segurança (P. Rocha)',
    '                Status: CLAIMED 12-JAN': '                Status: RECLAMADO 12-JAN',
    '14-JAN | 12:00 | FOUND: Digital watch (Casio)':
      '14-JAN | 12:00 | ENCONTRADO: Relógio digital (Casio)',
    '                Location: Cafeteria, Table 7': '                Local: Refeitório, Mesa 7',
    '                Finder: Cafeteria staff':
      '                Encontrado por: Equipe do refeitório',
    '19-JAN | 18:20 | FOUND: Brown leather wallet':
      '19-JAN | 18:20 | ENCONTRADO: Carteira de couro marrom',
    '                Location: Parking Lot B, near entrance':
      '                Local: Estacionamento B, próximo à entrada',
    '                Finder: Guard (night shift)':
      '                Encontrado por: Guarda (turno noturno)',
    '                Contents: ID, R$ 47,00, photos':
      '                Conteúdo: Identidade, R$ 47,00, fotos',
    '                Status: CLAIMED 20-JAN (owner verified)':
      '                Status: RECLAMADO 20-JAN (proprietário verificado)',
    '22-JAN | 03:00 | [RECORD SEALED - SECURITY OVERRIDE]':
      '22-JAN | 03:00 | [REGISTRO LACRADO - OVERRIDE DE SEGURANÇA]',
    'VACATION SCHEDULE — Q1 1996': 'CALENDÁRIO DE FÉRIAS — T1 1996',
    '  - Vacation requests require 30-day advance notice':
      '  - Solicitações de férias requerem 30 dias de antecedência',
    '  - Maximum consecutive days: 20': '  - Máximo de dias consecutivos: 20',
    '  - Carryover from 1995: Use by 28-FEB': '  - Saldo de 1995: Usar até 28-FEV',
    'Questions: HR Office, ext. 2050': 'Dúvidas: Escritório de RH, ramal 2050',
    'ACCESS CODE AUDIT — INTERNAL SECURITY REVIEW':
      'AUDITORIA DE CÓDIGO DE ACESSO — REVISÃO INTERNA DE SEGURANÇA',
    'DATE: 18-DEC-1995': 'DATA: 18-DEZ-1995',
    'SUBJECT: Annual Access Code Compliance Review':
      'ASSUNTO: Revisão Anual de Conformidade de Código de Acesso',
    'Per Security Directive 1995-12, all departmental access':
      'Conforme Diretiva de Segurança 1995-12, todos os códigos',
    'codes have been reviewed for compliance with naming':
      'de acesso departamentais foram revisados quanto à conformidade com',
    'conventions established in Memo SEC-89-04.':
      'convenções de nomenclatura estabelecidas no Memo SEC-89-04.',
    '  Current codes use agricultural terminology as':
      '  Os códigos atuais usam terminologia agrícola conforme',
    '  mandated by Project Operations naming standard.':
      '  mandado pelo padrão de nomenclatura de Operações de Projeto.',
    '  Recent audit flagged the following code for':
      '  A auditoria recente sinalizou o seguinte código por',
    '  pattern recognition vulnerability:': '  vulnerabilidade de reconhecimento de padrão:',
    '  While the code follows naming convention, the':
      '  Embora o código siga a convenção de nomenclatura, o',
    '  sequential letter arrangement may be susceptible':
      '  arranjo sequencial de letras pode ser suscetível',
    '  to systematic enumeration attacks.': '  a ataques de enumeração sistemática.',
    '  Code remains acceptable for current fiscal year.':
      '  O código permanece aceitável para o ano fiscal atual.',
    '  Consider alphanumeric substitution for FY1997.':
      '  Considerar substituição alfanumérica para o AF1997.',
    'AUDITOR: Systems Administration': 'AUDITOR: Administração de Sistemas',
    'DISTRIBUTION: Terminal operators, Security Office':
      'DISTRIBUIÇÃO: Operadores de terminal, Escritório de Segurança',
    'WEEKEND DUTY ROSTER — JANUARY 1996': 'ESCALA DE SERVIÇO DE FINAL DE SEMANA — JANEIRO 1996',
    'OPERATIONS CENTER': 'CENTRO DE OPERAÇÕES',
    '20-21 JAN: [CANCELLED - ALL HANDS ON DECK]': '20-21 JAN: [CANCELADO - TODOS A POSTOS]',
    '  - Weekend of 20-21 JAN: Full staff mobilization':
      '  - Final de semana de 20-21 JAN: Mobilização total',
    '    per Director order. No details provided.':
      '    por ordem do Diretor. Sem detalhes fornecidos.',
    '  - Overtime requests to HR by Wednesday prior.':
      '  - Solicitações de hora extra para o RH até quarta-feira anterior.',
    'Duty Officer: ext. 3000 (24h)': 'Oficial de Serviço: ramal 3000 (24h)',
    'MEMORANDUM — TERMINAL ACCESS OVERRIDE': 'MEMORANDO — OVERRIDE DE ACESSO AO TERMINAL',
    'TO: All Terminal Operators': 'PARA: Todos os Operadores de Terminal',
    'FROM: Systems Administration': 'DE: Administração de Sistemas',
    'DATE: December 1995': 'DATA: Dezembro de 1995',
    'Per Director mandate, emergency terminal override codes':
      'Por mandato do Diretor, os códigos de override emergencial do terminal',
    'have been updated for the new fiscal year.': 'foram atualizados para o novo ano fiscal.',
    'The override protocol allows access to restricted':
      'O protocolo de override permite acesso a diretórios',
    'directories when standard authentication is unavailable.':
      'restritos quando a autenticação padrão está indisponível.',
    'USAGE:': 'USO:',
    'CURRENT CODE:': 'CÓDIGO ATUAL:',
    '  Project designation word. Agricultural term.':
      '  Palavra de designação do projeto. Termo agrícola.',
    '  Portuguese. Related to extraction operations.':
      '  Português. Relacionado a operações de extração.',
    '  The code references our operational codename.':
      '  O código referencia nosso codinome operacional.',
    '  Think: what do you do at harvest time?': '  Pense: o que você faz na época da colheita?',
    'DO NOT share this code with unauthorized personnel.':
      'NÃO compartilhe este código com pessoal não autorizado.',
    '            SECURITY ALERT — INTRUSION DETECTED             ':
      '            ALERTA DE SEGURANÇA — INTRUSÃO DETECTADA             ',
    'This file is a HONEYPOT.': 'Este arquivo é um HONEYPOT.',
    'Your terminal ID has been logged.': 'Seu ID de terminal foi registrado.',
    'Your access pattern has been flagged.': 'Seu padrão de acesso foi sinalizado.',
    'Security personnel have been notified.': 'O pessoal de segurança foi notificado.',
    'REMAIN AT YOUR TERMINAL.': 'PERMANEÇA EM SEU TERMINAL.',
    '               DECOY FILE — ACCESS LOGGED                   ':
      '               ARQUIVO ISCA — ACESSO REGISTRADO                   ',
    'This file was planted to identify unauthorized access.':
      'Este arquivo foi plantado para identificar acesso não autorizado.',
    'Real evidence is never labeled this obviously.':
      'Evidência real nunca é rotulada tão obviamente.',
    'You should have known better.': 'Você deveria ter desconfiado.',
    'Your session has been marked for termination.': 'Sua sessão foi marcada para encerramento.',
    '              TRAP FILE — INTRUSION CONFIRMED               ':
      '              ARQUIVO ARMADILHA — INTRUSÃO CONFIRMADA               ',
    'Classification level "FOR PRESIDENTS EYES ONLY" does not':
      'O nível de classificação "SOMENTE PARA OS OLHOS DO PRESIDENTE" não',
    'exist in any real intelligence system.': 'existe em nenhum sistema de inteligência real.',
    'This was a test. You failed.': 'Isto foi um teste. Você falhou.',
    'Countermeasures deployed.': 'Contramedidas acionadas.',
    '                HONEYPOT TRIGGERED                          ':
      '                HONEYPOT ACIONADO                          ',
    'Intelligence agencies do not label files "SMOKING GUN."':
      'Agências de inteligência não rotulam arquivos como "PROVA DEFINITIVA."',
    'This file exists solely to catch intruders who lack':
      'Este arquivo existe apenas para capturar intrusos que não possuem',
    'the discretion to recognize obvious bait.': 'o discernimento para reconhecer isca óbvia.',
    'Your impatience has been noted.': 'Sua impaciência foi notada.',
    '[LEGACY ENCRYPTION HEADER — RECOVERED COPY AVAILABLE]':
      '[CABEÇALHO DE CRIPTOGRAFIA LEGADO — CÓPIA RECUPERADA DISPONÍVEL]',
    'Historical note: this file previously used a timed wrapper.':
      'Nota histórica: este arquivo anteriormente usava um invólucro temporizado.',
    'Recovered text is now available directly on open.':
      'O texto recuperado agora está disponível diretamente ao abrir.',
    'Use: open emergency_broadcast.enc': 'Usar: open emergency_broadcast.enc',
    'DATE: 20-JAN-1996 22:47 LOCAL': 'DATA: 20-JAN-1996 22:47 LOCAL',
    'FREQUENCY: MILITARY BAND — ENCRYPTED': 'FREQUÊNCIA: BANDA MILITAR — CRIPTOGRAFADA',
    'TOWER: "Flight 1-7, confirm visual on target area."':
      'TORRE: "Voo 1-7, confirme visual na área alvo."',
    'PILOT: "Negative visual. Heavy cloud cover at 3000 meters."':
      'PILOTO: "Visual negativo. Cobertura pesada de nuvens a 3000 metros."',
    'TOWER: "Proceed to coordinates 21.5519 S, 45.4331 W."':
      'TORRE: "Prossiga para coordenadas 21.5519 S, 45.4331 O."',
    'PILOT: "Coordinates confirmed. ETA 8 minutes."':
      'PILOTO: "Coordenadas confirmadas. Chegada prevista em 8 minutos."',
    '[STATIC - 14 SECONDS]': '[ESTÁTICA - 14 SEGUNDOS]',
    'PILOT: "Tower, I have... I have something on radar."':
      'PILOTO: "Torre, eu tenho... eu tenho algo no radar."',
    'TOWER: "Confirm contact, Flight 1-7."': 'TORRE: "Confirme contato, Voo 1-7."',
    'PILOT: "Contact confirmed. It\'s... it\'s not moving."':
      'PILOTO: "Contato confirmado. Ele... ele não está se movendo."',
    'TOWER: "Weapons systems remain inactive. Observe only."':
      'TORRE: "Sistemas de armas permanecem inativos. Apenas observar."',
    'PILOT: "Understood. Beginning visual approach."':
      'PILOTO: "Entendido. Iniciando aproximação visual."',
    '[STATIC - 8 SECONDS]': '[ESTÁTICA - 8 SEGUNDOS]',
    'PILOT: "Deus me livre... Tower, I don\'t know what I\'m looking at."':
      'PILOTO: "Deus me livre... Torre, eu não sei o que estou vendo."',
    'TOWER: "Flight 1-7, maintain radio silence from this point."':
      'TORRE: "Voo 1-7, mantenha silêncio de rádio a partir deste ponto."',
    'PILOT: "But Tower—"': 'PILOTO: "Mas Torre—"',
    'TOWER: "This conversation never happened. RTB immediately."':
      'TORRE: "Esta conversa nunca aconteceu. RTB imediatamente."',
    'CLASSIFICATION: ABOVE TOP SECRET': 'CLASSIFICAÇÃO: ACIMA DE ULTRA SECRETO',
    'DISSEMINATION: NEED-TO-KNOW ONLY': 'DISSEMINAÇÃO: APENAS PARA QUEM PRECISA SABER',
    'ARCHIVED NEWS CLIPPINGS — FEBRUARY 1996': 'RECORTES DE NOTÍCIAS ARQUIVADOS — FEVEREIRO 1996',
    '"MILITARY DENIES VARGINHA RUMORS"': '"MILITARES NEGAM RUMORES DE VARGINHA"',
    '  The Brazilian Air Force today denied reports of':
      '  A Força Aérea Brasileira negou hoje os relatos de',
    '  unusual activity near Varginha, Minas Gerais.':
      '  atividade incomum próximo a Varginha, Minas Gerais.',
    '  "There was no incident," stated a military spokesman.':
      '  "Não houve nenhum incidente," declarou um porta-voz militar.',
    '  "These are fabrications from overactive imaginations."':
      '  "Estas são fabricações de imaginações hiperativas."',
    '"ANONYMOUS DOCUMENTS SURFACE ONLINE"': '"DOCUMENTOS ANÔNIMOS SURGEM ONLINE"',
    '  Unverified documents claiming to detail a UFO':
      '  Documentos não verificados alegando detalhar uma operação',
    '  recovery operation have appeared on several':
      '  de recuperação de OVNI apareceram em vários',
    '  international bulletin board systems.': '  sistemas de quadro de avisos internacionais.',
    '  Government sources dismiss them as "obvious fakes."':
      '  Fontes governamentais os descartam como "falsificações óbvias."',
    '"WITNESS RECANTS STATEMENT"': '"TESTEMUNHA RETRATA DECLARAÇÃO"',
    '  a local woman, who claimed to see a "strange creature"':
      '  uma mulher local, que alegou ver uma "criatura estranha"',
    '  in Jardim Andere, has withdrawn her testimony.':
      '  no Jardim Andere, retirou seu testemunho.',
    '  "I was mistaken," she said. "It was just shadows."':
      '  "Eu estava enganada," ela disse. "Eram apenas sombras."',
    '  [EDITOR NOTE: Silva was visited by unidentified men':
      '  [NOTA DO EDITOR: Silva foi visitada por homens não identificados',
    '   in suits two days before this retraction.]':
      '   de terno dois dias antes desta retratação.]',
    'CLASSIFIED INTERNAL MEMORANDUM': 'MEMORANDO INTERNO CLASSIFICADO',
    'DATE: 10-MAR-1996': 'DATA: 10-MAR-1996',
    'RE: Information Containment Assessment': 'REF: Avaliação de Contenção de Informações',
    '  Classified documents pertaining to January 1996':
      '  Documentos classificados referentes às operações de',
    '  operations have been exfiltrated via compromised':
      '  janeiro de 1996 foram exfiltrados via sistema de',
    '  legacy terminal system.': '  terminal legado comprometido.',
    'DAMAGE ASSESSMENT:': 'AVALIAÇÃO DE DANOS:',
    '  - Documents now circulating on international networks':
      '  - Documentos agora circulando em redes internacionais',
    '  - Authenticity being questioned (as planned)':
      '  - Autenticidade sendo questionada (conforme planejado)',
    '  - No mainstream media pickup (yet)': '  - Nenhuma repercussão na mídia convencional (ainda)',
    'CONTAINMENT MEASURES:': 'MEDIDAS DE CONTENÇÃO:',
    '  1. Flood networks with obvious fakes to dilute signal':
      '  1. Inundar redes com falsificações óbvias para diluir o sinal',
    '  2. Pressure witnesses to recant': '  2. Pressionar testemunhas a retratar',
    '  3. Redirect narrative to "foreign drone" hypothesis':
      '  3. Redirecionar narrativa para hipótese de "drone estrangeiro"',
    '  4. Monitor UFO community for serious investigators':
      '  4. Monitorar comunidade OVNI para investigadores sérios',
    'LONG-TERM STRATEGY:': 'ESTRATÉGIA DE LONGO PRAZO:',
    '  The 2026 window approaches. Full disclosure may be':
      '  A janela de 2026 se aproxima. A divulgação completa pode ser',
    '  unavoidable. Recommend gradual acclimation program.':
      '  inevitável. Recomenda-se programa de aclimatação gradual.',
    'NOTE: The individual known as "UFO74" remains at large.':
      'NOTA: O indivíduo conhecido como "UFO74" continua foragido.',
    '      Termination not recommended due to martyr risk.':
      '      Eliminação não recomendada devido ao risco de martírio.',
    'SIGNAL INTERCEPT — UNVERIFIED': 'INTERCEPTAÇÃO DE SINAL — NÃO VERIFICADA',
    'TIMESTAMP: 15-MAR-1996 03:47:22 UTC': 'CARIMBO TEMPORAL: 15-MAR-1996 03:47:22 UTC',
    '[FRAGMENTARY TRANSMISSION - RECONSTRUCTED]': '[TRANSMISSÃO FRAGMENTÁRIA - RECONSTRUÍDA]',
    '...made it across the border...': '...consegui cruzar a fronteira...',
    '...they came to the apartment but...': '...eles vieram ao apartamento mas...',
    '...different identity now...': '...identidade diferente agora...',
    '...the hackerkid did it...': '...o hackerkid conseguiu...',
    '...files are everywhere now...': '...os arquivos estão em todo lugar agora...',
    '...cant put the toothpaste back...': '...não dá pra colocar a pasta de volta no tubo...',
    '...they think im dead...': '...eles pensam que estou morto...',
    '...let them think that...': '...deixem eles pensarem isso...',
    '...2026. ill be watching...': '...2026. estarei observando...',
    '...we all will...': '...todos nós estaremos...',
    '[SIGNAL LOST]': '[SINAL PERDIDO]',
    'ANALYSIS: Origin untraceable. Possibly fabricated.':
      'ANÁLISE: Origem irrastreável. Possivelmente fabricado.',
    '          Subject status: UNKNOWN': '          Status do sujeito: DESCONHECIDO',
    'PROJECTION UPDATE — 2026 TRANSITION WINDOW':
      'ATUALIZAÇÃO DE PROJEÇÃO — JANELA DE TRANSIÇÃO 2026',
    'CLASSIFICATION: BEYOND TOP SECRET': 'CLASSIFICAÇÃO: ALÉM DE ULTRA SECRETO',
    'DATE: [REDACTED]': 'DATA: [SUPRIMIDO]',
    'REVISED ASSESSMENT:': 'AVALIAÇÃO REVISADA:',
    '  The information breach of January 1996 has altered':
      '  A violação de informações de janeiro de 1996 alterou',
    '  projected outcomes for the 2026 transition window.':
      '  os resultados projetados para a janela de transição de 2026.',
    'PREVIOUS MODEL:': 'MODELO ANTERIOR:',
    '  - Transition occurs with zero public awareness':
      '  - Transição ocorre com zero consciência pública',
    '  - Population response: Panic, collapse': '  - Resposta da população: Pânico, colapso',
    '  - Estimated casualties: [REDACTED]': '  - Baixas estimadas: [SUPRIMIDO]',
    'REVISED MODEL (POST-BREACH):': 'MODELO REVISADO (PÓS-VIOLAÇÃO):',
    '  - Partial public awareness exists': '  - Consciência pública parcial existe',
    '  - Underground networks prepared': '  - Redes clandestinas preparadas',
    '  - Potential for coordinated response': '  - Potencial para resposta coordenada',
    '  - Estimated casualties: REDUCED': '  - Baixas estimadas: REDUZIDAS',
    'CONCLUSION:': 'CONCLUSÃO:',
    '  The breach, while operationally damaging, may have':
      '  A violação, embora operacionalmente danosa, pode ter',
    '  inadvertently improved transition survival rates.':
      '  inadvertidamente melhorado as taxas de sobrevivência na transição.',
    "  The intruder's actions, though criminal, may have":
      '  As ações do intruso, embora criminosas, podem ter',
    '  saved lives.': '  salvado vidas.',
    '  This assessment is classified and will be denied.':
      '  Esta avaliação é classificada e será negada.',
    'INCIDENT REPORT — EXPERIMENTAL AIRCRAFT DIVISION':
      'RELATÓRIO DE INCIDENTE — DIVISÃO DE AERONAVES EXPERIMENTAIS',
    'DATE: 21-JAN-1996': 'DATA: 21-JAN-1996',
    'CLASSIFICATION: CONFIDENTIAL': 'CLASSIFICAÇÃO: CONFIDENCIAL',
    'INCIDENT TYPE: Unauthorized civilian overflight':
      'TIPO DE INCIDENTE: Sobrevoo civil não autorizado',
    '  A single-engine Cessna 172 entered restricted airspace':
      '  Um Cessna 172 monomotor entrou no espaço aéreo restrito',
    '  over Base Area 7 at approximately 14:20h on 20-JAN-1996.':
      '  sobre a Área da Base 7 por volta das 14:20h em 20-JAN-1996.',
    '  Pilot identified as agricultural contractor.':
      '  Piloto identificado como contratante agrícola.',
    '  Filed incorrect flight plan (VFR instead of IFR).':
      '  Plano de voo incorreto registrado (VFR em vez de IFR).',
    '  No photographic equipment found on board.':
      '  Nenhum equipamento fotográfico encontrado a bordo.',
    'PRELIMINARY CONCLUSION:': 'CONCLUSÃO PRELIMINAR:',
    '  Navigational error. Pilot issued formal warning.':
      '  Erro de navegação. Piloto recebeu advertência formal.',
    '  No security breach. Airspace monitoring resumed.':
      '  Nenhuma violação de segurança. Monitoramento do espaço aéreo retomado.',
    'NOTE: Recommend updated NOTAM for restricted zone':
      'NOTA: Recomendar NOTAM atualizado para zona restrita',
    '      perimeter. Current radius may be insufficient.':
      '      perímetro. O raio atual pode ser insuficiente.',
    'ASSESSMENT — FOREIGN DRONE HYPOTHESIS': 'AVALIAÇÃO — HIPÓTESE DE DRONE ESTRANGEIRO',
    'ANALYST: [CLASSIFIED — junior lieutenant, technical analysis]':
      'ANALISTA: [CLASSIFICADO — tenente júnior, análise técnica]',
    'HYPOTHESIS:': 'HIPÓTESE:',
    '  Recovered material represents foreign reconnaissance drone':
      '  Material recuperado representa drone de reconhecimento estrangeiro',
    '  of undisclosed origin (likely US or European).':
      '  de origem não revelada (provavelmente EUA ou europeu).',
    'SUPPORTING EVIDENCE:': 'EVIDÊNCIA DE APOIO:',
    '  - Advanced materials consistent with aerospace industry':
      '  - Materiais avançados consistentes com a indústria aeroespacial',
    '  - Size appropriate for unmanned platform':
      '  - Tamanho apropriado para plataforma não tripulada',
    '  - Recovery site near strategic infrastructure':
      '  - Local de recuperação próximo a infraestrutura estratégica',
    'CONTRADICTING EVIDENCE:': 'EVIDÊNCIA CONTRADITÓRIA:',
    '  - No propulsion system identified': '  - Nenhum sistema de propulsão identificado',
    '  - No known drone uses materials of this composition':
      '  - Nenhum drone conhecido utiliza materiais desta composição',
    '  - Mass variability unexplained by any known technology':
      '  - Variabilidade de massa inexplicável por qualquer tecnologia conhecida',
    '  - Thermal signature inconsistent with any engine type':
      '  - Assinatura térmica inconsistente com qualquer tipo de motor',
    '  Hypothesis CANNOT be sustained.': '  Hipótese NÃO PODE ser sustentada.',
    '  Material properties inconsistent with ANY known aircraft.':
      '  Propriedades do material inconsistentes com QUALQUER aeronave conhecida.',
    'INTERNAL MEMORANDUM — PUBLIC AFFAIRS': 'MEMORANDO INTERNO — RELAÇÕES PÚBLICAS',
    'DATE: 22-JAN-1996': 'DATA: 22-JAN-1996',
    'RE: Media Inquiry Response': 'REF: Resposta a Consulta da Mídia',
    'APPROVED STATEMENT FOR PRESS:': 'DECLARAÇÃO APROVADA PARA IMPRENSA:',
    '  "The object recovered near Varginha on January 20':
      '  "O objeto recuperado próximo a Varginha em 20 de janeiro',
    '   has been identified as a weather balloon from the':
      '   foi identificado como um balão meteorológico do',
    '   National Meteorological Institute. The unusual':
      '   Instituto Nacional de Meteorologia. Os avistamentos',
    '   sightings were caused by reflected light from':
      '   incomuns foram causados pela luz refletida do',
    '   the balloon\'s instrumentation package."': '   pacote de instrumentação do balão."',
    '  This statement is for public consumption only.':
      '  Esta declaração é apenas para consumo público.',
    '  Actual findings classified.': '  Achados reais classificados.',
    '  See PROJECT HARVEST files for details.': '  Ver arquivos do PROJETO COLHEITA para detalhes.',
    'ALTERNATIVE ASSESSMENT — INDUSTRIAL ORIGIN': 'AVALIAÇÃO ALTERNATIVA — ORIGEM INDUSTRIAL',
    'ANALYST: SGT. PAULA REIS': 'ANALISTA: SGT. PAULA REIS',
    '  Recovered materials originated from nearby':
      '  Materiais recuperados originaram-se de instalação',
    '  industrial facility (chemical or metallurgical).':
      '  industrial próxima (química ou metalúrgica).',
    'INVESTIGATION:': 'INVESTIGAÇÃO:',
    '  Contacted 12 facilities within 50km radius.':
      '  Contatadas 12 instalações dentro de um raio de 50km.',
    '  No reported accidents or material losses.':
      '  Nenhum acidente relatado ou perda de material.',
    '  No facility uses materials matching samples.':
      '  Nenhuma instalação utiliza materiais correspondentes às amostras.',
    'MATERIAL COMPARISON:': 'COMPARAÇÃO DE MATERIAL:',
    '  - Local steel plant: No match': '  - Siderúrgica local: Sem correspondência',
    '  - Chemical processing: No match': '  - Processamento químico: Sem correspondência',
    '  - Automotive parts: No match': '  - Peças automotivas: Sem correspondência',
    '  - Aerospace subcontractor (Embraer): NO MATCH':
      '  - Subcontratante aeroespacial (Embraer): SEM CORRESPONDÊNCIA',
    '  Industrial origin RULED OUT.': '  Origem industrial DESCARTADA.',
    '  Materials have no identifiable manufacturing signature.':
      '  Os materiais não possuem assinatura de fabricação identificável.',
    '  Discontinue this line of investigation.': '  Descontinuar esta linha de investigação.',
    '  Defer to standard explanation for public statement.':
      '  Deferir para explicação padrão para declaração pública.',
    'LOGISTICS MANIFEST — PARTIAL RECOVERY': 'MANIFESTO LOGÍSTICO — RECUPERAÇÃO PARCIAL',
    'STATUS: FRAGMENT — SECTOR DAMAGE': 'STATUS: FRAGMENTO — DANO SETORIAL',
    'OUTBOUND SHIPMENTS:': 'REMESSAS DE SAÍDA:',
    '  [CORRUPTED] ... Container C-7 ... [CORRUPTED]':
      '  [CORROMPIDO] ... Contêiner C-7 ... [CORROMPIDO]',
    '  Destination: CÓDIGO ECHO': '  Destino: CÓDIGO ECHO',
    '  Weight: 45kg': '  Peso: 45kg',
    '  Handler: Protocol 7-ECHO authorized': '  Responsável: Protocolo 7-ECHO autorizado',
    '  [CORRUPTED] ... Container C-12 ... [CORRUPTED]':
      '  [CORROMPIDO] ... Contêiner C-12 ... [CORROMPIDO]',
    '  Destination: UNKNOWN (diplomatic channel)': '  Destino: DESCONHECIDO (canal diplomático)',
    '  Weight: 112kg': '  Peso: 112kg',
    '  Handler: [DATA LOSS]': '  Responsável: [PERDA DE DADOS]',
    'NOTE: Cross-reference with transport_log_96 for context.':
      'NOTA: Referência cruzada com transport_log_96 para contexto.',
    'SIGNAL ANALYSIS — PRELIMINARY': 'ANÁLISE DE SINAL — PRELIMINAR',
    'EQUIPMENT: Modified EEG Array': 'EQUIPAMENTO: Arranjo de EEG Modificado',
    'DATE: 20-JAN-1996 (during containment)': 'DATA: 20-JAN-1996 (durante contenção)',
    'READINGS FROM SUBJECT BETA (pre-expiration):': 'LEITURAS DO SUJEITO BETA (pré-expiração):',
    '  04:30 — Background noise only': '  04:30 — Apenas ruído de fundo',
    '  04:45 — Unusual pattern detected (see attached)':
      '  04:45 — Padrão incomum detectado (ver anexo)',
    '  05:00 — Pattern intensifies. Equipment overload.':
      '  05:00 — Padrão se intensifica. Sobrecarga de equipamento.',
    '  05:15 — Subject vitals declining. Pattern peaks.':
      '  05:15 — Sinais vitais do sujeito em declínio. Padrão atinge pico.',
    '  05:18 — Transmission burst detected. Duration: 0.3s':
      '  05:18 — Rajada de transmissão detectada. Duração: 0,3s',
    '  05:20 — Subject expires. Pattern ceases.': '  05:20 — Sujeito expira. Padrão cessa.',
    'INTERPRETATION:': 'INTERPRETAÇÃO:',
    '  Unknown. Equipment not designed for this signal type.':
      '  Desconhecida. Equipamento não projetado para este tipo de sinal.',
    '  Recommend consultation with transcript_core.enc':
      '  Recomenda-se consulta ao transcript_core.enc',
    '  for reconstructed content analysis.': '  para análise de conteúdo reconstruído.',
    'LIAISON NOTE — FOREIGN COORDINATION': 'NOTA DE ENLACE — COORDENAÇÃO ESTRANGEIRA',
    'FROM: Embassy Contact (unsigned)': 'DE: Contato da Embaixada (não assinado)',
    'DATE: 23-JAN-1996': 'DATA: 23-JAN-1996',
    'Package received via diplomatic pouch.': 'Pacote recebido via mala diplomática.',
    'Contents confirmed:': 'Conteúdo confirmado:',
    '  - Biological samples (2 containers)': '  - Amostras biológicas (2 contêineres)',
    '  - Material samples (1 container)': '  - Amostras de material (1 contêiner)',
    '  - Documentation (sealed)': '  - Documentação (lacrada)',
    'Our team is already en route.': 'Nossa equipe já está a caminho.',
    'As agreed, no records of this exchange will exist':
      'Conforme acordado, nenhum registro desta troca existirá',
    'in either system. Protocol 7-ECHO acknowledged.':
      'em nenhum dos sistemas. Protocolo 7-ECHO reconhecido.',
    'We will contact you when preliminary analysis complete.':
      'Entraremos em contato quando a análise preliminar estiver concluída.',
    'NOTE: Your material_x_analysis.dat was... illuminating.':
      'NOTA: Seu material_x_analysis.dat foi... esclarecedor.',
    '      We concur with the conclusion.': '      Concordamos com a conclusão.',
    'ENCRYPTED CABLE — PRIORITY ALPHA': 'CABO CRIPTOGRAFADO — PRIORIDADE ALFA',
    'ORIGIN: LANGLEY': 'ORIGEM: LANGLEY',
    'DESTINATION: BRASÍLIA STATION': 'DESTINO: ESTAÇÃO BRASÍLIA',
    'DATE: 23-JAN-1996 04:12 UTC': 'DATA: 23-JAN-1996 04:12 UTC',
    '[ENCRYPTED CONTENT - REQUIRES CLEARANCE]': '[CONTEÚDO CRIPTOGRAFADO - REQUER AUTORIZAÇÃO]',
    'Cross-reference: /comms/liaison/foreign_liaison_note.txt':
      'Referência cruzada: /comms/liaison/foreign_liaison_note.txt',
    'DECRYPTED CABLE — PRIORITY ALPHA': 'CABO DESCRIPTOGRAFADO — PRIORIDADE ALFA',
    'FLASH TRAFFIC': 'TRÁFEGO URGENTE',
    'SITUATION UPDATE:': 'ATUALIZAÇÃO DA SITUAÇÃO:',
    '  Recovery teams report multiple specimens secured.':
      '  Equipes de recuperação reportam múltiplos espécimes assegurados.',
    '  Division as agreed: Primary to you, Secondary to us.':
      '  Divisão conforme acordado: Primário para vocês, Secundário para nós.',
    '  Tertiary inbound to Tel Aviv per standing agreement.':
      '  Terciário a caminho de Tel Aviv conforme acordo vigente.',
    '  Protocol 7-ECHO remains in effect.': '  Protocolo 7-ECHO permanece em vigor.',
    '  No domestic agencies read-in.': '  Nenhuma agência doméstica informada.',
    '  Cover story: industrial accident, toxic waste.':
      '  História de cobertura: acidente industrial, resíduo tóxico.',
    'CRITICAL:': 'CRÍTICO:',
    '  Specimen 3 showed residual cognitive activity.':
      '  Espécime 3 apresentou atividade cognitiva residual.',
    '  Recommend immediate neural extraction before decay.':
      '  Recomenda-se extração neural imediata antes da decomposição.',
    '  Our team brings equipment. ETA 6 hours.':
      '  Nossa equipe traz equipamento. Chegada prevista: 6 horas.',
    'ACKNOWLEDGE.': 'ACUSE RECEBIMENTO.',
    '>> CONFIRMS MULTI-NATION COORDINATION <<': '>> CONFIRMA COORDENAÇÃO MULTINACIONAL <<',
    'What protocol governs this exchange? (Check the foreign liaison note)':
      'Qual protocolo governa esta troca? (Verifique a nota de enlace estrangeiro)',
    'The liaison note mentions the protocol name.':
      'A nota de enlace menciona o nome do protocolo.',
    'STANDING ORDERS — MULTINATIONAL RECOVERY PROTOCOL':
      'ORDENS PERMANENTES — PROTOCOLO MULTINACIONAL DE RECUPERAÇÃO',
    'CLASSIFICATION: COSMIC - NEED TO KNOW':
      'CLASSIFICAÇÃO: CÓSMICO - APENAS PARA QUEM PRECISA SABER',
    'EFFECTIVE: 01-JAN-1989 (UPDATED ANNUALLY)': 'VIGÊNCIA: 01-JAN-1989 (ATUALIZADO ANUALMENTE)',
    'PARTICIPATING NATIONS:': 'NAÇÕES PARTICIPANTES:',
    '  - United States (Coordinating Authority)': '  - Estados Unidos (Autoridade Coordenadora)',
    '  - United Kingdom': '  - Reino Unido',
    '  - France': '  - França',
    '  - Israel': '  - Israel',
    '  - Brazil (Regional Authority, South America)':
      '  - Brasil (Autoridade Regional, América do Sul)',
    '  - Russia (Observer Status, post-1991)': '  - Rússia (Status de Observador, pós-1991)',
    'TRIGGER CRITERIA:': 'CRITÉRIOS DE ACIONAMENTO:',
    '  Any incident matching Profile DELTA:':
      '  Qualquer incidente correspondendo ao Perfil DELTA:',
    '  - Non-conventional aerial phenomena': '  - Fenômenos aéreos não convencionais',
    '  - Biological specimens of unknown origin': '  - Espécimes biológicos de origem desconhecida',
    '  - Material with anomalous physical properties':
      '  - Material com propriedades físicas anômalas',
    'RESPONSE PROTOCOL:': 'PROTOCOLO DE RESPOSTA:',
    '  1. Regional Authority establishes perimeter':
      '  1. Autoridade Regional estabelece perímetro',
    '  2. Coordinating Authority notified within 2 hours':
      '  2. Autoridade Coordenadora notificada em até 2 horas',
    '  3. Multinational team deployed within 24 hours':
      '  3. Equipe multinacional mobilizada em até 24 horas',
    '  4. Material divided per Appendix C allocation':
      '  4. Material dividido conforme alocação do Apêndice C',
    'INFORMATION CONTROL:': 'CONTROLE DE INFORMAÇÃO:',
    '  All nations maintain synchronized cover narratives.':
      '  Todas as nações mantêm narrativas de cobertura sincronizadas.',
    '  Annual coordination meeting: Davos, Switzerland.':
      '  Reunião anual de coordenação: Davos, Suíça.',
    'ADDENDUM (1995):': 'ADENDO (1995):',
    '  Coordination extended to include shared timeline.':
      '  Coordenação estendida para incluir cronograma compartilhado.',
    '  All parties agree: public disclosure deferred until':
      '  Todas as partes concordam: divulgação pública adiada até',
    '  after WINDOW closes. Target: post-2026 review.':
      '  após o fechamento da JANELA. Meta: revisão pós-2026.',
    '  Cross-reference: /admin/threat_window.red': '  Referência cruzada: /admin/threat_window.red',
    'QUERY — REGIONAL MEDICAL EXAMINER': 'CONSULTA — MÉDICO LEGISTA REGIONAL',
    'RE: Unusual Autopsy Protocol': 'REF: Protocolo de Autópsia Incomum',
    'To whom it may concern,': 'A quem possa interessar,',
    'I am writing to inquire about the autopsy conducted':
      'Escrevo para indagar sobre a autópsia realizada',
    'at our facility on 21-JAN-1996. I understand':
      'em nossa instalação em 21-JAN-1996. Entendo que',
    'A forensic pathologist was summoned from a state university,':
      'Um patologista forense foi convocado de uma universidade estadual,',
    'but his notes were sealed before I could review them.':
      'mas suas anotações foram lacradas antes que eu pudesse revisá-las.',
    'The subject was removed before I arrived.': 'O sujeito foi removido antes da minha chegada.',
    'No standard intake forms were filed.': 'Nenhum formulário de admissão padrão foi preenchido.',
    'No cause of death was recorded.': 'Nenhuma causa de morte foi registrada.',
    'The attending physician refuses to discuss.': 'O médico responsável recusa-se a discutir.',
    'Our cold storage showed unusual temperature readings':
      'Nosso armazenamento frio apresentou leituras de temperatura incomuns',
    'for several hours afterward.': 'por várias horas depois.',
    'I am required to maintain complete records.': 'Sou obrigado a manter registros completos.',
    'Please advise how to proceed with documentation.':
      'Por favor, orientem como proceder com a documentação.',
    'THE REGIONAL MEDICAL EXAMINER': 'O MÉDICO LEGISTA REGIONAL',
    'Regional Medical Examiner': 'Médico Legista Regional',
    '[RESPONSE ATTACHED: "File classified. Destroy query."]':
      '[RESPOSTA ANEXADA: "Arquivo classificado. Destruir consulta."]',
    'SYSTEM LOG — PATTERN RECOGNITION': 'LOG DO SISTEMA — RECONHECIMENTO DE PADRÃO',
    'TIMESTAMP: [CURRENT SESSION]': 'CARIMBO TEMPORAL: [SESSÃO ATUAL]',
    'Broad file sweep detected.': 'Varredura ampla de arquivos detectada.',
    'User has touched multiple sectors of the system.':
      'Usuário acessou múltiplos setores do sistema.',
    'Pattern: Persistent review of scattered records.':
      'Padrão: Revisão persistente de registros dispersos.',
    'NOTE: Additional archives may be available.':
      'NOTA: Arquivos adicionais podem estar disponíveis.',
    '      Check /admin directory if access permits.':
      '      Verifique o diretório /admin se o acesso permitir.',
    'SYSTEM ALERT — COHERENCE THRESHOLD': 'ALERTA DO SISTEMA — LIMITE DE COERÊNCIA',
    'PRIORITY: ELEVATED': 'PRIORIDADE: ELEVADA',
    'User has logged substantial evidence.': 'Usuário registrou evidências substanciais.',
    'Evidence tracker approaching completion.':
      'Rastreador de evidências se aproximando da conclusão.',
    'Leak risk rising.': 'Risco de vazamento em elevação.',
    'System recommendation:': 'Recomendação do sistema:',
    '  Preserve session artifacts.': '  Preservar artefatos da sessão.',
    '  Expect emergency export attempts.': '  Esperar tentativas de exportação de emergência.',
    'NOTE: Final evidence may require administrative access.':
      'NOTA: Evidência final pode requerer acesso administrativo.',
    'HISTORICAL REFERENCE — OPERATION PRATO': 'REFERÊNCIA HISTÓRICA — OPERAÇÃO PRATO',
    'PERIOD: 1977-1978': 'PERÍODO: 1977-1978',
    'LOCATION: Colares, Pará, Brazil': 'LOCALIZAÇÃO: Colares, Pará, Brasil',
    '  Brazilian Air Force investigation of unidentified':
      '  Investigação da Força Aérea Brasileira sobre fenômenos',
    '  aerial phenomena in northern Brazil.': '  aéreos não identificados no norte do Brasil.',
    '  - Multiple credible sightings documented':
      '  - Múltiplos avistamentos credíveis documentados',
    '  - Physical effects on witnesses (burn marks)':
      '  - Efeitos físicos em testemunhas (marcas de queimadura)',
    '  - Phenomenon described as "light beams"': '  - Fenômeno descrito como "feixes de luz"',
    '  - Objects displayed non-ballistic motion': '  - Objetos exibiram movimento não balístico',
    'OFFICIAL CONCLUSION:': 'CONCLUSÃO OFICIAL:',
    '  Inconclusive. Files sealed.': '  Inconclusivo. Arquivos lacrados.',
    'RELEVANCE TO 1996 INCIDENT:': 'RELEVÂNCIA PARA O INCIDENTE DE 1996:',
    '  Current operation named "PRATO EXTENSION"': '  Operação atual denominada "EXTENSÃO PRATO"',
    '  suggests institutional awareness of connection.':
      '  sugere consciência institucional de conexão.',
    'NOTE: Original PRATO files held by Air Force archives.':
      'NOTA: Arquivos originais do PRATO mantidos pelos arquivos da Força Aérea.',
    '      Supplemental archive unlocked under override protocol.':
      '      Arquivo suplementar desbloqueado sob protocolo de override.',
    '      See /ops/prato/archive when cleared.': '      Ver /ops/prato/archive quando autorizado.',
    'INCIDENT LOG — OPERATION PRATO (COLARES)': 'REGISTRO DE INCIDENTES — OPERAÇÃO PRATO (COLARES)',
    'DATE RANGE: SEP-OCT 1977': 'PERÍODO: SET-OUT 1977',
    '18-SEP 22:14 — Luminous object above river channel.':
      '18-SET 22:14 — Objeto luminoso sobre canal do rio.',
    '                Beam emitted for 4-6 seconds.':
      '                Feixe emitido por 4-6 segundos.',
    '                Civilian reported heat and puncture mark.':
      '                Civil reportou calor e marca de punctura.',
    '20-SEP 23:06 — Patrol observed light hovering ~30m.':
      '20-SET 23:06 — Patrulha observou luz pairando a ~30m.',
    '                No sound. Rapid lateral acceleration.':
      '                Sem som. Aceleração lateral rápida.',
    '                Beam directed to ground, no visible target.':
      '                Feixe direcionado ao solo, sem alvo visível.',
    '24-SEP 21:47 — Multiple witnesses. Light split into two':
      '24-SET 21:47 — Múltiplas testemunhas. Luz dividiu-se em dois',
    '                points before rejoining and departing.':
      '                pontos antes de se reunir e partir.',
    '03-OCT 00:12 — Light tracked along shoreline for 3km.':
      '03-OUT 00:12 — Luz rastreada ao longo da costa por 3km.',
    '                Brightness increased; camera overexposed.':
      '                Brilho aumentou; câmera superexposta.',
    'STATUS: Unresolved. Pattern persistent.': 'STATUS: Não resolvido. Padrão persistente.',
    'NOTE: Incidents cluster near waterfront communities.':
      'NOTA: Incidentes se concentram próximo a comunidades ribeirinhas.',
    'PATROL OBSERVATION REPORT — SHIFT 04': 'RELATÓRIO DE OBSERVAÇÃO DE PATRULHA — TURNO 04',
    'UNIT: 1st AIR FORCE DETACHMENT': 'UNIDADE: 1º DESTACAMENTO DA FORÇA AÉREA',
    'DATE: 05-OCT-1977': 'DATA: 05-OUT-1977',
    '  00:31 — White orb at 25-30m altitude.': '  00:31 — Orbe branco a 25-30m de altitude.',
    '  00:32 — Orb emits narrow beam downward.': '  00:32 — Orbe emite feixe estreito para baixo.',
    '  00:33 — Beam sweeps left to right (approx. 40° arc).':
      '  00:33 — Feixe varre da esquerda para a direita (arco de aprox. 40°).',
    '  00:34 — Orb rises rapidly. Acceleration inconsistent':
      '  00:34 — Orbe sobe rapidamente. Aceleração inconsistente',
    '          with known aircraft.': '          com aeronaves conhecidas.',
    'SENSOR NOTES:': 'NOTAS DOS SENSORES:',
    '  - No engine noise or rotor wash.': '  - Sem ruído de motor ou turbulência de rotor.',
    '  - Compass fluctuation during beam emission.':
      '  - Flutuação da bússola durante emissão do feixe.',
    '  - Thermal scope shows localized ground heating.':
      '  - Visor térmico mostra aquecimento localizado do solo.',
    'PHOTOGRAPHIC RECORD:': 'REGISTRO FOTOGRÁFICO:',
    '  3 frames captured; 2 overexposed; 1 partial silhouette.':
      '  3 quadros capturados; 2 superexpostos; 1 silhueta parcial.',
    '  Continue night patrols. Maintain distance.':
      '  Continuar patrulhas noturnas. Manter distância.',
    'MEDICAL EFFECTS BRIEF — COLARES CLINIC': 'RESUMO DE EFEITOS MÉDICOS — CLÍNICA DE COLARES',
    'DATE: 14-OCT-1977': 'DATA: 14-OUT-1977',
    'OBSERVED SYMPTOMS (12 CASES):': 'SINTOMAS OBSERVADOS (12 CASOS):',
    '  - Superficial burns (2-5cm diameter)': '  - Queimaduras superficiais (2-5cm de diâmetro)',
    '  - Localized puncture marks (sub-dermal)': '  - Marcas de punctura localizadas (subdérmicas)',
    '  - Acute fatigue, dizziness, photophobia': '  - Fadiga aguda, tontura, fotofobia',
    '  - Mild anemia in follow-up labs': '  - Anemia leve em exames de acompanhamento',
    '  Symptoms appear within 12 hours of exposure.':
      '  Sintomas aparecem em até 12 horas após exposição.',
    '  No infection markers detected.': '  Nenhum marcador de infecção detectado.',
    '  Recovery within 3-5 days with hydration and rest.':
      '  Recuperação em 3-5 dias com hidratação e repouso.',
    '  Maintain private treatment records.': '  Manter registros de tratamento privados.',
    '  Report new cases to field command only.':
      '  Reportar novos casos apenas ao comando de campo.',
    'PHOTO ARCHIVE REGISTER — OPERATION PRATO': 'REGISTRO DE ARQUIVO FOTOGRÁFICO — OPERAÇÃO PRATO',
    'ARCHIVE SITE: AIR FORCE COMMAND / BELÉM': 'LOCAL DO ARQUIVO: COMANDO DA FORÇA AÉREA / BELÉM',
    'DATE: 22-OCT-1977': 'DATA: 22-OUT-1977',
    'ROLL COUNT: 146': 'CONTAGEM DE ROLOS: 146',
    '  - 34 rolls overexposed (light saturation)': '  - 34 rolos superexpostos (saturação de luz)',
    '  - 21 rolls contain partial silhouettes': '  - 21 rolos contêm silhuetas parciais',
    '  - 6 rolls show beam segments on ground': '  - 6 rolos mostram segmentos de feixe no solo',
    'STORAGE:': 'ARMAZENAMENTO:',
    '  Sealed in climate-controlled vault.': '  Lacrado em cofre com controle climático.',
    '  Access logged under Protocol 3-C.': '  Acesso registrado sob Protocolo 3-C.',
    'NOTE:': 'NOTA:',
    '  Several frames show repeating grid-like arcs.':
      '  Vários quadros mostram arcos repetitivos em formato de grade.',
    '  Analysts flagged for pattern review.': '  Analistas sinalizaram para revisão de padrão.',
    'RETROSPECTIVE ASSESSMENT — PRATO ANOMALY SET':
      'AVALIAÇÃO RETROSPECTIVA — CONJUNTO DE ANOMALIAS PRATO',
    'CLASSIFICATION: RED': 'CLASSIFICAÇÃO: VERMELHO',
    'DATE: 12-FEB-1996': 'DATA: 12-FEV-1996',
    '  1977 incidents show consistent scan geometry:':
      '  Incidentes de 1977 mostram geometria de varredura consistente:',
    '  repeating altitude bands, lateral sweep arcs, and':
      '  faixas de altitude repetitivas, arcos de varredura lateral, e',
    '  short-duration beam contact without pursuit.':
      '  contato de feixe de curta duração sem perseguição.',
    '  Behaviors align with survey operations, not attacks.':
      '  Comportamentos se alinham com operações de pesquisa, não ataques.',
    '  Patterns resemble grid sampling and terrain mapping.':
      '  Padrões se assemelham a amostragem em grade e mapeamento de terreno.',
    'INFERENCE:': 'INFERÊNCIA:',
    '  Luminous sources likely autonomous scan platforms.':
      '  Fontes luminosas provavelmente são plataformas autônomas de varredura.',
    '  Activity indicates Watcher reconnaissance cycles':
      '  Atividade indica ciclos de reconhecimento dos Observadores',
    '  predating the 1996 Varginha recovery.': '  anteriores à recuperação de Varginha de 1996.',
    'IMPLICATION:': 'IMPLICAÇÃO:',
    '  Current incident is a continuation, not a first contact.':
      '  O incidente atual é uma continuação, não um primeiro contato.',
    'CONFIDENCE: MODERATE': 'CONFIANÇA: MODERADA',
    '  Data set incomplete; pattern consistency notable.':
      '  Conjunto de dados incompleto; consistência de padrão notável.',
    'REFERENCE — PARALLEL INCIDENTS (INTERNATIONAL)':
      'REFERÊNCIA — INCIDENTES PARALELOS (INTERNACIONAL)',
    'COMPILED: FEBRUARY 1996': 'COMPILADO: FEVEREIRO 1996',
    'CLASSIFICATION: COMPARTMENTED': 'CLASSIFICAÇÃO: COMPARTIMENTADO',
    'Known incidents with similar characteristics:':
      'Incidentes conhecidos com características similares:',
    '  1947 — United States (New Mexico)': '  1947 — Estados Unidos (Novo México)',
    '  1961 — United States (New Hampshire)': '  1961 — Estados Unidos (New Hampshire)',
    '  1967 — United Kingdom (Suffolk)': '  1967 — Reino Unido (Suffolk)',
    '  1980 — United Kingdom (Suffolk, repeat)': '  1980 — Reino Unido (Suffolk, repetição)',
    '  1989 — Belgium (multiple locations)': '  1989 — Bélgica (múltiplas localizações)',
    '  1996 — BRAZIL (current)': '  1996 — BRASIL (atual)',
    'COMMON ELEMENTS:': 'ELEMENTOS COMUNS:',
    '  - Material recovery': '  - Recuperação de material',
    '  - Biological component presence': '  - Presença de componente biológico',
    '  - Multi-national coordination': '  - Coordenação multinacional',
    '  - Public denial protocol': '  - Protocolo de negação pública',
    '  Pattern suggests ongoing assessment program.':
      '  Padrão sugere programa de avaliação em andamento.',
    '  Brazil now included in observation set.':
      '  Brasil agora incluído no conjunto de observação.',
    'ANALYSIS — THIRTY-YEAR CYCLE HYPOTHESIS': 'ANÁLISE — HIPÓTESE DO CICLO DE TRINTA ANOS',
    'THEORETICAL FRAMEWORK': 'QUADRO TEÓRICO',
    'OBSERVATION:': 'OBSERVAÇÃO:',
    '  Recovered psi-comm fragments reference "thirty rotations."':
      '  Fragmentos de psi-comm recuperados referenciam "trinta rotações."',
    '  This correlates with prior incident spacing:':
      '  Isso se correlaciona com o espaçamento de incidentes anteriores:',
    '  1947 → 1977 = 30 years (Operation PRATO follows)':
      '  1947 → 1977 = 30 anos (segue-se a Operação PRATO)',
    '  1977 → 2007 = 30 years (predicted)': '  1977 → 2007 = 30 anos (previsto)',
    '  1996 → 2026 = 30 years (referenced in transcripts)':
      '  1996 → 2026 = 30 anos (referenciado nas transcrições)',
    '  Assessment cycles occur at 30-year intervals.':
      '  Ciclos de avaliação ocorrem em intervalos de 30 anos.',
    '  Each cycle refines observational model.': '  Cada ciclo refina o modelo observacional.',
    '  2026 may represent cycle completion.': '  2026 pode representar a conclusão do ciclo.',
    'ALTERNATIVE:': 'ALTERNATIVA:',
    '  "Rotations" may not refer to Earth years.':
      '  "Rotações" podem não se referir a anos terrestres.',
    '  Calculations assume terrestrial frame of reference.':
      '  Cálculos assumem quadro de referência terrestre.',
    'CONFIDENCE: LOW': 'CONFIANÇA: BAIXA',
    '  Insufficient data for confirmation.': '  Dados insuficientes para confirmação.',
    'PATIENT PERSONAL DOCUMENT — RECOVERED FROM ROOM 14B':
      'DOCUMENTO PESSOAL DO PACIENTE — RECUPERADO DO QUARTO 14B',
    'FACILITY: INSTITUTO RAUL SOARES, BELO HORIZONTE':
      'INSTALAÇÃO: INSTITUTO RAUL SOARES, BELO HORIZONTE',
    'DATE RECOVERED: 03-MAR-1996': 'DATA DE RECUPERAÇÃO: 03-MAR-1996',
    'NOTE: Patient was admitted 28-FEB-1996. Document found':
      'NOTA: Paciente admitida em 28-FEV-1996. Documento encontrado',
    '      hidden beneath mattress during routine inspection.':
      '      escondido sob o colchão durante inspeção de rotina.',
    '      Submitted to file per protocol.': '      Submetido ao arquivo conforme protocolo.',
    'they took my notebooks but they did not find this one.':
      'eles levaram meus cadernos mas não encontraram este.',
    'i know how i sound. i knew how i sounded when i told':
      'eu sei como eu pareço. eu sabia como eu parecia quando contei',
    'my husband. i know why they brought me here. it does':
      'ao meu marido. eu sei por que me trouxeram aqui. isso',
    'not change what i know.': 'não muda o que eu sei.',
    'it is not an invasion. i need people to understand that.':
      'não é uma invasão. eu preciso que as pessoas entendam isso.',
    'everyone is waiting for ships. for weapons. for something':
      'todos estão esperando por naves. por armas. por algo',
    'that looks like a war. it will not look like a war.':
      'que pareça uma guerra. não vai parecer uma guerra.',
    'it already started. it started before any of us were born.':
      'já começou. começou antes de qualquer um de nós nascer.',
    'they do not want our planet. they want what we produce':
      'eles não querem nosso planeta. eles querem o que nós produzimos',
    'without knowing we produce it. every thought. every dream.':
      'sem saber que produzimos. cada pensamento. cada sonho.',
    'every moment of fear or love or pain. we generate something':
      'cada momento de medo ou amor ou dor. nós geramos algo',
    'when we think and they have been collecting it for a very':
      'quando pensamos e eles vêm coletando isso por um',
    'long time.': 'longo tempo.',
    'i tried to calculate the yield. for one human mind over':
      'eu tentei calcular o rendimento. para uma mente humana ao longo de',
    'one lifetime. then i multiplied it. i stopped when i':
      'uma vida. então eu multipliquei. eu parei quando',
    'reached the number because the number made me sit on':
      'alcancei o número porque o número me fez sentar no',
    'the floor for a long time.': 'chão por um longo tempo.',
    'seven billion units. that is what we are to them.':
      'sete bilhões de unidades. é isso que somos para eles.',
    'units. generating. not knowing.': 'unidades. gerando. sem saber.',
    'the doctors say i am not eating. they are right. i':
      'os médicos dizem que não estou comendo. eles estão certos. eu',
    'find it difficult to eat. to sleep in a bed. to behave':
      'acho difícil comer. dormir em uma cama. me comportar',
    'as if any of it matters when i know what i know.':
      'como se algo importasse quando eu sei o que sei.',
    'my daughter visited yesterday. she held my hand.':
      'minha filha visitou ontem. ela segurou minha mão.',
    'i looked at her face and all i could think was:':
      'eu olhei para o rosto dela e tudo que pude pensar foi:',
    'she is producing right now. she has always been':
      'ela está produzindo agora. ela sempre esteve',
    'producing. she will never know.': 'produzindo. ela nunca vai saber.',
    'i did not tell her. what would be the point.': 'eu não contei a ela. qual seria o sentido.',
    'if you are reading this and you work here, please':
      'se você está lendo isso e trabalha aqui, por favor',
    'understand i am not delusional. i am a physicist.':
      'entenda que não estou delirando. eu sou física.',
    'i have spent my career measuring things.': 'passei minha carreira medindo coisas.',
    'the possibility that we are the thing being measured':
      'a possibilidade de que nós somos a coisa sendo medida',
    'is not something my training prepared me for.':
      'não é algo para o qual meu treinamento me preparou.',
    'god willing i am wrong.': 'se Deus quiser eu estou errada.',
    'i do not believe i am wrong.': 'eu não acredito que estou errada.',
    'ATTENDING NOTE: Patient remains calm but non-responsive':
      'NOTA DO MÉDICO RESPONSÁVEL: Paciente permanece calma mas não responsiva',
    'to treatment. Refuses to discuss the content of her':
      'ao tratamento. Recusa-se a discutir o conteúdo de sua',
    'research. Keeps asking if her daughter has been informed.':
      'pesquisa. Continua perguntando se sua filha foi informada.',
    'Recommendation: extend observation period.': 'Recomendação: estender período de observação.',
    'THEORETICAL FRAMEWORK — NON-ARRIVAL COLONIZATION': 'QUADRO TEÓRICO — COLONIZAÇÃO SEM CHEGADA',
    'CLASSIFICATION: COSMIC — DISTRIBUTION LIMITED':
      'CLASSIFICAÇÃO: CÓSMICO — DISTRIBUIÇÃO LIMITADA',
    'AUTHOR: [CLASSIFIED — intelligence directorate]':
      'AUTOR: [CLASSIFICADO — diretoria de inteligência]',
    'DATE: 05-MAR-1996': 'DATA: 05-MAR-1996',
    'TO: JOINT ASSESSMENT COMMITTEE': 'PARA: COMITÊ CONJUNTO DE AVALIAÇÃO',
    'This memorandum attempts to formalize a hypothesis':
      'Este memorando tenta formalizar uma hipótese',
    'that several of us have been circling for weeks but':
      'que vários de nós temos circulado por semanas mas',
    'none wished to commit to paper.': 'ninguém desejou colocar no papel.',
    'STANDARD COLONIZATION MODEL:': 'MODELO PADRÃO DE COLONIZAÇÃO:',
    '  Species travels to target → displaces natives → occupies':
      '  Espécie viaja ao alvo → desloca nativos → ocupa',
    'WHAT WE BELIEVE WE ARE OBSERVING:': 'O QUE ACREDITAMOS ESTAR OBSERVANDO:',
    '  Species sends scouts → measures viability → transmits data':
      '  Espécie envia batedores → mede viabilidade → transmite dados',
    '  No arrival necessary. No displacement necessary.':
      '  Nenhuma chegada necessária. Nenhum deslocamento necessário.',
    'PROPOSED PHASE STRUCTURE:': 'ESTRUTURA DE FASES PROPOSTA:',
    '  Phase 1: Reconnaissance (scouts deployed, data gathered)':
      '  Fase 1: Reconhecimento (batedores mobilizados, dados coletados)',
    '  Phase 2: Seeding (integration organisms introduced)':
      '  Fase 2: Semeadura (organismos de integração introduzidos)',
    '  Phase 3: Conversion (gradual modification begins)':
      '  Fase 3: Conversão (modificação gradual começa)',
    '  Phase 4: Extraction (resource harvest accelerates)':
      '  Fase 4: Extração (colheita de recursos se acelera)',
    'The brilliance — and I use that word with revulsion —':
      'A brilhantez — e uso essa palavra com repulsa —',
    'is that the colonizers never arrive. The colonized':
      'é que os colonizadores nunca chegam. A população',
    'population never perceives a threat because there is':
      'colonizada nunca percebe uma ameaça porque não há',
    'nothing to perceive. The process is gradual, invisible,':
      'nada a perceber. O processo é gradual, invisível,',
    'and, as far as we can determine, irreversible.':
      'e, até onde podemos determinar, irreversível.',
    'CURRENT ASSESSMENT:': 'AVALIAÇÃO ATUAL:',
    '  Earth appears to be in late Phase 1.': '  A Terra parece estar no final da Fase 1.',
    '  Phase 2 initiation cannot be ruled out.': '  O início da Fase 2 não pode ser descartado.',
    '  This committee has debated response options for':
      '  Este comitê debateu opções de resposta por',
    '  six hours. We have none to propose. Our training':
      '  seis horas. Não temos nenhuma a propor. Nosso treinamento',
    '  prepared us for enemies with borders, flags, and':
      '  nos preparou para inimigos com fronteiras, bandeiras e',
    '  return addresses.': '  endereços de retorno.',
    '  Formal recommendation: continued observation.':
      '  Recomendação formal: observação continuada.',
    '  Informal assessment: we are documenting something':
      '  Avaliação informal: estamos documentando algo',
    '  we cannot stop.': '  que não podemos parar.',
    '[SIGNATURES: 4 of 6 committee members]': '[ASSINATURAS: 4 de 6 membros do comitê]',
    '[2 members declined to sign — objections on file]':
      '[2 membros se recusaram a assinar — objeções em arquivo]',
    'WITNESS STATEMENT — RAW TRANSCRIPT': 'DEPOIMENTO DE TESTEMUNHA — TRANSCRIÇÃO BRUTA',
    'DATE: 20-JAN-1996 (07:30)': 'DATA: 20-JAN-1996 (07:30)',
    'WITNESS: Civilian female, age 23': 'TESTEMUNHA: Civil, feminino, 23 anos',
    '"I was walking to work when I saw it.': '"Eu estava indo para o trabalho quando vi.',
    ' It was crouching near the wall.': ' Estava agachado perto do muro.',
    ' At first I thought it was a homeless person.': ' No início pensei que era um morador de rua.',
    ' Then I saw its face.': ' Então vi seu rosto.',
    ' It had no ears. Its skin was... wrong.': ' Não tinha orelhas. Sua pele era... errada.',
    ' It looked at me.': ' Ele olhou para mim.',
    ' I felt like it was inside my head.': ' Senti como se estivesse dentro da minha cabeça.',
    ' Then I ran."': ' Então eu corri."',
    'INTERVIEWER NOTES:': 'NOTAS DO ENTREVISTADOR:',
    '  Witness appeared genuinely distressed.':
      '  Testemunha aparentou estar genuinamente perturbada.',
    '  Story consistent across multiple retellings.':
      '  Relato consistente em múltiplas repetições.',
    '  No evidence of fabrication.': '  Sem evidência de fabricação.',
    'CROSS-REFERENCE:': 'REFERÊNCIA CRUZADA:',
    '  Similar telepathic contact described in /comms/psi/':
      '  Contato telepático similar descrito em /comms/psi/',
    'STATUS: File marked for degradation.': 'STATUS: Arquivo marcado para degradação.',
    '        Access recommended before data loss.':
      '        Acesso recomendado antes da perda de dados.',
    'EMERGENCY ORDERS — INITIAL RESPONSE': 'ORDENS DE EMERGÊNCIA — RESPOSTA INICIAL',
    'ISSUED: 20-JAN-1996 (05:00)': 'EMITIDO: 20-JAN-1996 (05:00)',
    'TO: All Regional Units': 'PARA: Todas as Unidades Regionais',
    '1. Secure perimeter around designated sites.':
      '1. Assegurar perímetro ao redor dos locais designados.',
    '2. Detain all civilian witnesses for debriefing.':
      '2. Deter todas as testemunhas civis para interrogatório.',
    '3. Recover ALL physical material. Leave nothing.':
      '3. Recuperar TODO material físico. Não deixar nada.',
    '4. Establish communications blackout.': '4. Estabelecer blecaute de comunicações.',
    '5. Await specialist team arrival.': '5. Aguardar chegada da equipe especialista.',
    '  Do NOT photograph subjects.': '  NÃO fotografar os sujeitos.',
    '  Do NOT touch subjects without protection.': '  NÃO tocar nos sujeitos sem proteção.',
    '  Do NOT attempt communication with subjects.': '  NÃO tentar comunicação com os sujeitos.',
    '  Foreign team ETA: See /comms/liaison/':
      '  Chegada prevista da equipe estrangeira: Ver /comms/liaison/',
    '  Transport protocols: See /storage/': '  Protocolos de transporte: Ver /storage/',
    'ACKNOWLEDGE RECEIPT IMMEDIATELY.': 'ACUSAR RECEBIMENTO IMEDIATAMENTE.',
    'AUTH: DIRECTOR, REGIONAL INTELLIGENCE': 'AUT: DIRETOR, INTELIGÊNCIA REGIONAL',
    'TRANSPORT LOG — OPERATION PRATO EXTENSION': 'REGISTRO DE TRANSPORTE — OPERAÇÃO EXTENSÃO PRATO',
    'DATE: 20-JAN-1996 through 23-JAN-1996': 'DATA: 20-JAN-1996 a 23-JAN-1996',
    'CLASSIFICATION: OPERACIONAL': 'CLASSIFICAÇÃO: OPERACIONAL',
    '20-JAN-1996 03:42 — Unit dispatched to Site ALFA':
      '20-JAN-1996 03:42 — Unidade despachada para Local ALFA',
    '20-JAN-1996 04:15 — Material secured. Weight: 340kg approx.':
      '20-JAN-1996 04:15 — Material assegurado. Peso: 340kg aprox.',
    '20-JAN-1996 04:58 — Transport to HOLDING-7 initiated':
      '20-JAN-1996 04:58 — Transporte para HOLDING-7 iniciado',
    '21-JAN-1996 01:20 — Secondary recovery at Site BETA':
      '21-JAN-1996 01:20 — Recuperação secundária no Local BETA',
    '21-JAN-1996 02:45 — Fragments catalogued: 12 distinct pieces':
      '21-JAN-1996 02:45 — Fragmentos catalogados: 12 peças distintas',
    '21-JAN-1996 03:30 — NOTICE: Material divided for redundancy':
      '21-JAN-1996 03:30 — AVISO: Material dividido por redundância',
    '21-JAN-1996 04:00 — Batch A → HOLDING-7': '21-JAN-1996 04:00 — Lote A → HOLDING-7',
    '21-JAN-1996 04:00 — Batch B → [REDACTED] via diplomatic pouch':
      '21-JAN-1996 04:00 — Lote B → [SUPRIMIDO] via mala diplomática',
    '22-JAN-1996 — Transfer complete. Chain of custody sealed.':
      '22-JAN-1996 — Transferência concluída. Cadeia de custódia lacrada.',
    '23-JAN-1996 11:00 — HOLDING-7 inventory reconciled':
      '23-JAN-1996 11:00 — Inventário do HOLDING-7 reconciliado',
    '23-JAN-1996 11:30 — Batch B confirmation pending foreign receipt':
      '23-JAN-1996 11:30 — Confirmação do Lote B pendente de recebimento estrangeiro',
    'NOTE: Foreign transfer authorized under Protocol 7-ECHO.':
      'NOTA: Transferência estrangeira autorizada sob Protocolo 7-ECHO.',
    'NOTE: Recipient nation not logged in this system.':
      'NOTA: Nação receptora não registrada neste sistema.',
    'END LOG': 'FIM DO REGISTRO',
    'MATERIAL ANALYSIS — BATCH A SAMPLES': 'ANÁLISE DE MATERIAL — AMOSTRAS DO LOTE A',
    'LAB: UNICAMP-AFFILIATED (UNOFFICIAL)': 'LAB: AFILIADO À UNICAMP (NÃO OFICIAL)',
    'SAMPLE M-07:': 'AMOSTRA M-07:',
    '  Composition: Unknown alloy. No terrestrial match.':
      '  Composição: Liga desconhecida. Sem correspondência terrestre.',
    '  Conductivity: Anomalous. Variable under observation.':
      '  Condutividade: Anômala. Variável sob observação.',
    '  Mass: Inconsistent between measurements.': '  Massa: Inconsistente entre medições.',
    'SAMPLE M-12:': 'AMOSTRA M-12:',
    '  Composition: Polymer matrix with metallic inclusions.':
      '  Composição: Matriz polimérica com inclusões metálicas.',
    '  Tensile strength: Exceeds known materials by factor of 8.':
      '  Resistência à tração: Excede materiais conhecidos por fator de 8.',
    '  Thermal response: Absorbs heat without temperature change.':
      '  Resposta térmica: Absorve calor sem mudança de temperatura.',
    '  Materials are not of terrestrial manufacture.':
      '  Materiais não são de fabricação terrestre.',
    '  Recommend immediate classification upgrade.':
      '  Recomenda-se elevação imediata de classificação.',
    '  Recommend international consultation suppression.':
      '  Recomenda-se supressão de consulta internacional.',
    'ADDENDUM:': 'ADENDO:',
    '  Batch B samples were NOT made available for analysis.':
      '  Amostras do Lote B NÃO foram disponibilizadas para análise.',
    '  Foreign recipient declined reciprocal data sharing.':
      '  Recipiente estrangeiro recusou compartilhamento recíproco de dados.',
    'BIO-CONTAINMENT LOG — QUARANTINE SECTION': 'REGISTRO DE BIO-CONTENÇÃO — SEÇÃO DE QUARENTENA',
    'SITE: REGIONAL HOSPITAL [NOME SUPRIMIDO]': 'LOCAL: HOSPITAL REGIONAL [NOME SUPRIMIDO]',
    'DATE: 20-JAN-1996': 'DATA: 20-JAN-1996',
    '20-JAN 04:30 — Subject ALFA secured. Vitals: Unstable.':
      '20-JAN 04:30 — Sujeito ALFA assegurado. Sinais vitais: Instáveis.',
    '20-JAN 05:15 — Subject BETA secured. Vitals: Declining.':
      '20-JAN 05:15 — Sujeito BETA assegurado. Sinais vitais: Em declínio.',
    '20-JAN 06:00 — Subject ALFA expired. Cause: Unknown.':
      '20-JAN 06:00 — Sujeito ALFA expirou. Causa: Desconhecida.',
    '20-JAN 08:00 — Transfer order received.': '20-JAN 08:00 — Ordem de transferência recebida.',
    '20-JAN 09:30 — Subject BETA transferred to military custody.':
      '20-JAN 09:30 — Sujeito BETA transferido para custódia militar.',
    '20-JAN 10:00 — Subject ALFA remains → autopsy protocol.':
      '20-JAN 10:00 — Restos do Sujeito ALFA → protocolo de autópsia.',
    'NOTE: Subjects display non-human morphology.': 'NOTA: Sujeitos exibem morfologia não humana.',
    'NOTE: Subjects do not match any catalogued species.':
      'NOTA: Sujeitos não correspondem a nenhuma espécie catalogada.',
    '21-JAN 02:00 — Third subject reported. Site GAMMA.':
      '21-JAN 02:00 — Terceiro sujeito reportado. Local GAMA.',
    '21-JAN 04:00 — Third subject secured. Designated GAMMA.':
      '21-JAN 04:00 — Terceiro sujeito assegurado. Designado GAMA.',
    '21-JAN 06:00 — Subject GAMMA transferred. Destination: UNKNOWN.':
      '21-JAN 06:00 — Sujeito GAMA transferido. Destino: DESCONHECIDO.',
    'WARNING: All bio-material classified COSMIC.':
      'AVISO: Todo bio-material classificado CÓSMICO.',
    'AUTOPSY PROTOCOL — SUBJECT ALFA': 'PROTOCOLO DE AUTÓPSIA — SUJEITO ALFA',
    'PATHOLOGIST: [CLASSIFIED — forensic specialist, state university]':
      'PATOLOGISTA: [CLASSIFICADO — especialista forense, universidade estadual]',
    'FACILITY: Hospital Regional do Sul de Minas': 'INSTALAÇÃO: Hospital Regional do Sul de Minas',
    'EXTERNAL EXAMINATION:': 'EXAME EXTERNO:',
    '  Height: 1.6m (contracted posture noted at recovery site)':
      '  Altura: 1,6m (postura contraída observada no local de recuperação)',
    '  Skin: Dark brown, oily secretion, strong ammonia odor':
      '  Pele: Marrom escura, secreção oleosa, forte odor de amônia',
    '  Cranium: Three bony ridges, anterior-posterior alignment':
      '  Crânio: Três cristas ósseas, alinhamento ântero-posterior',
    '  Eyes: Disproportionately large, deep red, no sclera':
      '  Olhos: Desproporcionalmente grandes, vermelho profundo, sem esclera',
    '  Limbs: Four digits per extremity': '  Membros: Quatro dígitos por extremidade',
    'INTERNAL EXAMINATION:': 'EXAME INTERNO:',
    '  Cardiovascular: Single-chamber circulatory organ':
      '  Cardiovascular: Órgão circulatório de câmara única',
    '  Digestive: Vestigial. Non-functional.': '  Digestivo: Vestigial. Não funcional.',
    '  Reproductive: Absent.': '  Reprodutivo: Ausente.',
    '  Neural: Overdeveloped cranial mass. Unusual structures.':
      '  Neural: Massa craniana hiperdesenvolvida. Estruturas incomuns.',
    '  Cranial structures suggest high-bandwidth signal processing.':
      '  Estruturas cranianas sugerem processamento de sinais de alta largura de banda.',
    '  No vocal apparatus detected.': '  Nenhum aparato vocal detectado.',
    '  Hypothesis: Communication via non-acoustic means.':
      '  Hipótese: Comunicação por meios não acústicos.',
    'TISSUE SAMPLES: Transferred per Protocol 7-ECHO.':
      'AMOSTRAS DE TECIDO: Transferidas conforme Protocolo 7-ECHO.',
    'PATHOLOGIST ADDENDUM:': 'ADENDO DO PATOLOGISTA:',
    '  "This organism was designed, not evolved."':
      '  "Este organismo foi projetado, não evoluiu."',
    'ADDENDUM PSI — NEURAL ASSESSMENT': 'ADENDO PSI — AVALIAÇÃO NEURAL',
    'CONSULTING: [CLASSIFIED]': 'CONSULTORIA: [CLASSIFICADO]',
    'CRANIAL STRUCTURE ANALYSIS:': 'ANÁLISE DA ESTRUTURA CRANIANA:',
    'The neural architecture of Subject ALFA indicates:':
      'A arquitetura neural do Sujeito ALFA indica:',
    '  - Massive parallel processing capability':
      '  - Capacidade massiva de processamento paralelo',
    '  - Structures analogous to signal receivers':
      '  - Estruturas análogas a receptores de sinais',
    '  - No decision-making cortex equivalent':
      '  - Sem equivalente ao córtex de tomada de decisão',
    '  Subject was not autonomous.': '  Sujeito não era autônomo.',
    '  Subject received instructions from external source.':
      '  Sujeito recebia instruções de fonte externa.',
    '  Subject functioned as observer/relay only.':
      '  Sujeito funcionava apenas como observador/retransmissor.',
    '  If subjects are receivers, there must be transmitters.':
      '  Se os sujeitos são receptores, deve haver transmissores.',
    '  Transmitters were not recovered at any site.':
      '  Transmissores não foram recuperados em nenhum local.',
    '  Assume observational mission was successful.':
      '  Assumir que a missão observacional foi bem-sucedida.',
    '  Assume data was transmitted before expiration.':
      '  Assumir que os dados foram transmitidos antes da expiração.',
    'PSI-COMM TRANSCRIPT — PARTIAL RECOVERY': 'TRANSCRIÇÃO PSI-COMM — RECUPERAÇÃO PARCIAL',
    'SOURCE: Subject BETA (pre-expiration)': 'FONTE: Sujeito BETA (pré-expiração)',
    'METHOD: EEG pattern analysis + computational reconstruction':
      'MÉTODO: Análise de padrão EEG + reconstrução computacional',
    '[FRAGMENT 1]': '[FRAGMENTO 1]',
    '  ...observation complete...': '  ...observação completa...',
    '  ...viable assessment confirmed...': '  ...avaliação viável confirmada...',
    '  ...transmission interrupted...': '  ...transmissão interrompida...',
    '[FRAGMENT 2]': '[FRAGMENTO 2]',
    '  ...energy density acceptable...': '  ...densidade de energia aceitável...',
    '  ...cognitive activity measured...': '  ...atividade cognitiva medida...',
    '  ...extraction model viable...': '  ...modelo de extração viável...',
    '[FRAGMENT 3]': '[FRAGMENTO 3]',
    '  ...we are not the arrivers...': '  ...nós não somos os que chegam...',
    '  ...we are the measuring...': '  ...nós somos a medição...',
    '  ...others will come...': '  ...outros virão...',
    '[END RECOVERED FRAGMENTS]': '[FIM DOS FRAGMENTOS RECUPERADOS]',
    'NOTE: Original signal strength suggests transmission':
      'NOTA: Força do sinal original sugere que a transmissão',
    '      reached destination before subject expiration.':
      '      alcançou o destino antes da expiração do sujeito.',
    'SECURITY CHECK: Enter material sample weight from transport log (kg)':
      'VERIFICAÇÃO DE SEGURANÇA: Insira o peso da amostra de material do registro de transporte (kg)',
    'Check transport_log_96.txt for material weight':
      'Verifique transport_log_96.txt para o peso do material',
    'PSI-COMM TRANSCRIPT — SECONDARY ANALYSIS': 'TRANSCRIÇÃO PSI-COMM — ANÁLISE SECUNDÁRIA',
    'SOURCE: Subject GAMMA': 'FONTE: Sujeito GAMA',
    '[RECOVERED SEQUENCE]': '[SEQUÊNCIA RECUPERADA]',
    '  ...thirty rotations...': '  ...trinta rotações...',
    '  ...alignment window...': '  ...janela de alinhamento...',
    '  ...convergence cycle...': '  ...ciclo de convergência...',
    'SECURITY CHECK: How many subjects were recovered total?':
      'VERIFICAÇÃO DE SEGURANÇA: Quantos sujeitos foram recuperados no total?',
    'Check bio_container.log for subject designations':
      'Verifique bio_container.log para designações de sujeitos',
    'FIELD REPORT — OPERATION PRATO DELTA': 'RELATÓRIO DE CAMPO — OPERAÇÃO PRATO DELTA',
    'SUBMITTED: 24-JAN-1996': 'SUBMETIDO: 24-JAN-1996',
    '  Three recovery sites established.': '  Três locais de recuperação estabelecidos.',
    '  All physical evidence secured.': '  Todas as evidências físicas asseguradas.',
    '  All biological material secured.': '  Todo material biológico assegurado.',
    'FOREIGN LIAISON:': 'LIGAÇÃO ESTRANGEIRA:',
    '  Representatives from [REDACTED] arrived 22-JAN.':
      '  Representantes de [REDIGIDO] chegaram em 22-JAN.',
    '  Joint protocol established.': '  Protocolo conjunto estabelecido.',
    '  Material sharing agreement signed.': '  Acordo de compartilhamento de material assinado.',
    '  Local witnesses estimated at 30+.': '  Testemunhas locais estimadas em 30+.',
    '  Media suppression partially effective.': '  Supressão de mídia parcialmente eficaz.',
    '  Long-term containment uncertain.': '  Contenção a longo prazo incerta.',
    '  Maintain denial posture.': '  Manter postura de negação.',
    '  Accelerate foreign material transfer.': '  Acelerar transferência de material estrangeiro.',
    '  Discontinue local analysis to prevent leaks.':
      '  Descontinuar análise local para prevenir vazamentos.',
    'THEORETICAL FRAMEWORK — SCOUT VARIANTS': 'ESTRUTURA TEÓRICA — VARIANTES DE BATEDORES',
    'WORKING MODEL:': 'MODELO DE TRABALHO:',
    'Recovered subjects appear to be purpose-built constructs.':
      'Sujeitos recuperados parecem ser construtos feitos sob medida.',
    'Evidence suggests:': 'Evidências sugerem:',
    '  - Engineered for Earth-specific conditions':
      '  - Projetados para condições específicas da Terra',
    '  - Limited operational lifespan (hours to days)':
      '  - Vida útil operacional limitada (horas a dias)',
    '  - High neural plasticity for rapid environmental learning':
      '  - Alta plasticidade neural para aprendizado ambiental rápido',
    '  - No autonomous decision-making capability':
      '  - Sem capacidade autônoma de tomada de decisão',
    'CLASSIFICATION:': 'CLASSIFICAÇÃO:',
    '  Designation: "Scouts"': '  Designação: "Batedores"',
    '  Function: Reconnaissance and measurement': '  Função: Reconhecimento e medição',
    '  Relationship to origin: Unknown (assumed subordinate)':
      '  Relação com a origem: Desconhecida (presumida subordinada)',
    '  Scouts are tools, not representatives.': '  Batedores são ferramentas, não representantes.',
    '  Decision-makers remain at origin.': '  Tomadores de decisão permanecem na origem.',
    '  Origin has NOT been contacted.': '  A origem NÃO foi contatada.',
    'ASSESSMENT — ENERGY NODE CLASSIFICATION': 'AVALIAÇÃO — CLASSIFICAÇÃO DE NÓ ENERGÉTICO',
    'AUTHOR: [CLASSIFIED — signals division analyst]':
      'AUTOR: [CLASSIFICADO — analista da divisão de sinais]',
    'DATE: 10-FEB-1996': 'DATA: 10-FEV-1996',
    'TO: ASSESSMENT DIRECTORATE': 'PARA: DIRETORIA DE AVALIAÇÃO',
    'RECOVERED SIGNAL CROSS-REFERENCE:': 'REFERÊNCIA CRUZADA DE SINAIS RECUPERADOS:',
    'Psi-comm fragments, when mapped against material':
      'Fragmentos psi-comm, quando mapeados contra a análise',
    'analysis, produce a consistent pattern:': 'de material, produzem um padrão consistente:',
    '  - "Energy density" referenced 4 times across specimens':
      '  - "Densidade de energia" referenciada 4 vezes entre espécimes',
    '  - "Extraction model" phrasing consistent in all samples':
      '  - Fraseologia "Modelo de extração" consistente em todas as amostras',
    '  - "Cognitive activity" used as a metric — this is unusual':
      '  - "Atividade cognitiva" usada como métrica — isto é incomum',
    '    and does not correspond to any known measurement system':
      '    e não corresponde a nenhum sistema de medição conhecido',
    'ANALYST HYPOTHESIS:': 'HIPÓTESE DO ANALISTA:',
    '  Earth is being assessed as an energy source.':
      '  A Terra está sendo avaliada como fonte de energia.',
    '  Biological neural networks may serve as the':
      '  Redes neurais biológicas podem servir como o',
    '  extraction medium. Cognitive output correlates':
      '  meio de extração. Produção cognitiva se correlaciona',
    '  with projected energy yield.': '  com a produção de energia projetada.',
    '  Recovered material samples exhibit energy absorption':
      '  Amostras de material recuperado exibem propriedades de',
    '  properties we cannot replicate or fully explain.':
      '  absorção de energia que não podemos replicar ou explicar totalmente.',
    '  Scout neural structures confirm measurement function.':
      '  Estruturas neurais dos batedores confirmam função de medição.',
    '  The scout mission appears complete. Next phase':
      '  A missão dos batedores parece completa. Início da próxima',
    '  initiation is uncertain. Transition window undefined.':
      '  fase é incerto. Janela de transição indefinida.',
    '  Establish long-term signal monitoring station.':
      '  Estabelecer estação de monitoramento de sinais a longo prazo.',
    '  Staff with personnel who have read clearance.':
      '  Equipar com pessoal que tenha autorização de leitura.',
    '  Budget request attached separately — the Ministry':
      '  Solicitação de orçamento anexada separadamente — o Ministério',
    '  will not approve if they see the justification.': '  não aprovará se virem a justificativa.',
    '[SIGNATURE REDACTED]': '[ASSINATURA REDIGIDA]',
    'THREAT ASSESSMENT — TRANSITION WINDOW': 'AVALIAÇÃO DE AMEAÇA — JANELA DE TRANSIÇÃO',
    'AUTHOR: [CLASSIFIED — threat analysis section chief]':
      'AUTOR: [CLASSIFICADO — chefe da seção de análise de ameaças]',
    'DATE: 02-MAR-1996': 'DATA: 02-MAR-1996',
    'TO: MINISTRY OF DEFENSE — STRATEGIC PLANNING':
      'PARA: MINISTÉRIO DA DEFESA — PLANEJAMENTO ESTRATÉGICO',
    'TIMELINE RECONSTRUCTION:': 'RECONSTRUÇÃO DA LINHA DO TEMPO:',
    '  Reference: Psi-comm fragment "thirty rotations"':
      '  Referência: Fragmento psi-comm "trinta rotações"',
    '  Best interpretation: 30 Earth orbital cycles':
      '  Melhor interpretação: 30 ciclos orbitais terrestres',
    '  Base year: 1996 (current incident)': '  Ano base: 1996 (incidente atual)',
    '  Target year: 2026': '  Ano alvo: 2026',
    'NATURE OF WINDOW: UNKNOWN': 'NATUREZA DA JANELA: DESCONHECIDA',
    'We have debated the following possibilities:': 'Debatemos as seguintes possibilidades:',
    '  - Secondary deployment of integration organisms':
      '  - Implantação secundária de organismos de integração',
    '  - Transition from reconnaissance to active phase':
      '  - Transição da fase de reconhecimento para fase ativa',
    '  - Communication or activation signal': '  - Sinal de comunicação ou ativação',
    '  - Initiation of energy extraction process': '  - Início do processo de extração de energia',
    'None of these can be confirmed. All are consistent':
      'Nenhuma destas pode ser confirmada. Todas são consistentes',
    'with recovered data.': 'com os dados recuperados.',
    'RECOMMENDED POSTURE:': 'POSTURA RECOMENDADA:',
    '  - Maintain observation protocols through 2026':
      '  - Manter protocolos de observação até 2026',
    '  - Establish monitoring baseline for anomalous signals':
      '  - Estabelecer linha de base de monitoramento para sinais anômalos',
    '  - Prepare contingency frameworks (nature TBD)':
      '  - Preparar estruturas de contingência (natureza a definir)',
    'IMPORTANT CAVEAT:': 'RESSALVA IMPORTANTE:',
    '  This is not a prediction. It is a detected reference':
      '  Isto não é uma previsão. É uma referência detectada',
    '  in recovered neural fragments. Our interpretation':
      '  em fragmentos neurais recuperados. Nossa interpretação',
    '  may be completely wrong. But the reference exists.':
      '  pode estar completamente errada. Mas a referência existe.',
    '  We cannot pretend it does not.': '  Não podemos fingir que não.',
    'INTERNAL MEMORANDUM — NOTE 07': 'MEMORANDO INTERNO — NOTA 07',
    'FROM: [REDACTED]': 'DE: [REDIGIDO]',
    'TO: DIRECTOR': 'PARA: DIRETOR',
    'SUBJECT: Foreign Involvement Concerns': 'ASSUNTO: Preocupações com Envolvimento Estrangeiro',
    'Director,': 'Diretor,',
    'I must register my objection to the current arrangement.':
      'Devo registrar minha objeção ao arranjo atual.',
    'The foreign delegation arrived before we had completed':
      'A delegação estrangeira chegou antes de completarmos',
    'initial assessment. Their access to biological samples':
      'a avaliação inicial. O acesso deles às amostras biológicas',
    'was granted before chain of custody was established.':
      'foi concedido antes do estabelecimento da cadeia de custódia.',
    'I have reason to believe:': 'Tenho razões para acreditar:',
    '  - They had advance knowledge of the incident':
      '  - Eles tinham conhecimento prévio do incidente',
    '  - Their equipment was pre-positioned': '  - O equipamento deles estava pré-posicionado',
    '  - Their protocols superseded our own': '  - Os protocolos deles se sobrepuseram aos nossos',
    'This was not cooperation. This was assumption of control.':
      'Isto não foi cooperação. Foi uma tomada de controle.',
    'I recommend formal protest through diplomatic channels.':
      'Recomendo protesto formal pelos canais diplomáticos.',
    'ASSESSMENT — INDIRECT COLONIZATION MODEL': 'AVALIAÇÃO — MODELO DE COLONIZAÇÃO INDIRETA',
    'CLASSIFICATION: RED — COMPARTMENTED': 'CLASSIFICAÇÃO: VERMELHO — COMPARTIMENTADO',
    'AUTHOR: [CLASSIFIED — colonel, strategic planning]':
      'AUTOR: [CLASSIFICADO — coronel, planejamento estratégico]',
    'DATE: 27-FEB-1996': 'DATA: 27-FEV-1996',
    'TO: MINISTRY OF DEFENSE — SPECIAL PROGRAMS':
      'PARA: MINISTÉRIO DA DEFESA — PROGRAMAS ESPECIAIS',
    'Excellency,': 'Excelência,',
    'After reviewing the full specimen analysis and the':
      'Após revisar a análise completa dos espécimes e os',
    'recovered psi-comm fragments, I must present a framework':
      'fragmentos psi-comm recuperados, devo apresentar uma estrutura',
    'that none of us wanted to consider.': 'que nenhum de nós queria considerar.',
    'I stress that this is my interpretation. I pray':
      'Enfatizo que esta é minha interpretação. Rezo',
    'that I am wrong.': 'para que eu esteja errado.',
    'PHASE 1 — RECONNAISSANCE (CONFIRMED)': 'FASE 1 — RECONHECIMENTO (CONFIRMADO)',
    '  Bio-engineered scouts deployed.': '  Batedores bioengenheirados implantados.',
    '  Planetary viability measured.': '  Viabilidade planetária medida.',
    '  Cognitive density assessed — our population, our minds.':
      '  Densidade cognitiva avaliada — nossa população, nossas mentes.',
    '  Findings transmitted to origin before recovery.':
      '  Descobertas transmitidas à origem antes da recuperação.',
    '  This phase appears complete. The scouts succeeded.':
      '  Esta fase parece completa. Os batedores tiveram sucesso.',
    'PHASE 2 — SEEDING (THEORETICAL)': 'FASE 2 — SEMEADURA (TEÓRICO)',
    '  Integration organisms introduced.': '  Organismos de integração introduzidos.',
    '  These would not resemble the scouts. They would':
      '  Estes não se assemelhariam aos batedores. Eles não se',
    '  resemble nothing. Or everything.': '  assemelhariam a nada. Ou a tudo.',
    '  Gradual ecological and biological modification.':
      '  Modificação ecológica e biológica gradual.',
    '  I do not know if this has begun.': '  Não sei se isto já começou.',
    '  The neural fragments suggest it will.': '  Os fragmentos neurais sugerem que acontecerá.',
    'PHASE 3 — EXTRACTION (THEORETICAL)': 'FASE 3 — EXTRAÇÃO (TEÓRICO)',
    '  Target world becomes an energy source.': '  Mundo alvo se torna uma fonte de energia.',
    '  Local species continues existing — but diminished.':
      '  Espécie local continua existindo — mas diminuída.',
    '  Autonomy and agency degrade. Slowly. Invisibly.':
      '  Autonomia e agência se degradam. Lentamente. Invisivelmente.',
    CONCLUSION: 'CONCLUSÃO',
    'What disturbs me most is the elegance of it.': 'O que mais me perturba é a elegância disso.',
    'They do not need to arrive. They do not destroy.':
      'Eles não precisam chegar. Eles não destroem.',
    'They convert. Quietly. From a distance we cannot':
      'Eles convertem. Silenciosamente. A uma distância que não podemos',
    'comprehend.': 'compreender.',
    'We trained our entire defense apparatus to repel':
      'Treinamos todo nosso aparato de defesa para repelir',
    'invaders. There is nothing to repel.': 'invasores. Não há nada a repelir.',
    'ASSESSMENT: Phase 1 appears complete for Earth.':
      'AVALIAÇÃO: Fase 1 parece completa para a Terra.',
    'I have requested confession with the base chaplain.':
      'Solicitei confissão com o capelão da base.',
    'EXECUTIVE BRIEFING — THE WATCHERS': 'BRIEFING EXECUTIVO — OS OBSERVADORES',
    'CLASSIFICATION: COSMIC — EYES ONLY': 'CLASSIFICAÇÃO: CÓSMICO — SOMENTE PARA OLHOS AUTORIZADOS',
    'PREPARED BY: JOINT ASSESSMENT COMMITTEE': 'PREPARADO POR: COMITÊ DE AVALIAÇÃO CONJUNTA',
    'DATE: FEBRUARY 1996': 'DATA: FEVEREIRO 1996',
    'TO: [DISTRIBUTION LIMITED — MINISTRY LEVEL]':
      'PARA: [DISTRIBUIÇÃO LIMITADA — NÍVEL MINISTERIAL]',
    'This document summarizes our current institutional':
      'Este documento resume nosso entendimento institucional',
    'understanding of the January 1996 incident and its':
      'atual do incidente de janeiro de 1996 e suas',
    'implications. It has been reviewed by all six members':
      'implicações. Foi revisado por todos os seis membros',
    'of this committee. What follows is consensus.': 'deste comitê. O que se segue é consenso.',
    'I. THE INCIDENT': 'I. O INCIDENTE',
    'Between 20–23 January 1996, military and fire brigade':
      'Entre 20-23 de janeiro de 1996, unidades militares e do corpo',
    'units conducted recovery operations at three distinct':
      'de bombeiros conduziram operações de recuperação em três locais',
    'sites near Varginha, Minas Gerais.': 'distintos próximos a Varginha, Minas Gerais.',
    'Physical debris and biological specimens were secured.':
      'Detritos físicos e espécimes biológicos foram assegurados.',
    'Material was divided per standing multinational protocol.':
      'Material foi dividido conforme protocolo multinacional vigente.',
    'A portion was transferred to foreign partners before this':
      'Uma porção foi transferida a parceiros estrangeiros antes deste',
    'committee was fully convened — a procedural failure we':
      'comitê ser totalmente convocado — uma falha processual que',
    'have formally protested.': 'protestamos formalmente.',
    'II. THE SPECIMENS': 'II. OS ESPÉCIMES',
    'Three non-human biological entities recovered.':
      'Três entidades biológicas não-humanas recuperadas.',
    'Designated: ALFA, BETA, GAMMA.': 'Designadas: ALFA, BETA, GAMA.',
    'Autopsy and tissue analysis indicate:': 'Autópsia e análise de tecido indicam:',
    '  - Purpose-built organisms, not naturally evolved':
      '  - Organismos construídos sob medida, não evoluídos naturalmente',
    '  - Limited operational lifespan (designed to expire)':
      '  - Vida útil operacional limitada (projetados para expirar)',
    '  - Neural architecture oriented toward observation':
      '  - Arquitetura neural orientada para observação',
    '  - No autonomous decision-making structures found':
      '  - Nenhuma estrutura autônoma de tomada de decisão encontrada',
    '  - Communication via non-acoustic means (see PSI files)':
      '  - Comunicação por meios não-acústicos (ver arquivos PSI)',
    'In plain language: these were instruments. Scouts.':
      'Em linguagem simples: estes eram instrumentos. Batedores.',
    'Sent to observe and transmit. Not ambassadors.':
      'Enviados para observar e transmitir. Não embaixadores.',
    'Not explorers. Tools.': 'Não exploradores. Ferramentas.',
    'III. THE TRANSMISSION': 'III. A TRANSMISSÃO',
    'Recovered psi-comm fragments confirm:': 'Fragmentos psi-comm recuperados confirmam:',
    '  - Mission was observational and appears successful':
      '  - A missão era observacional e parece bem-sucedida',
    '  - Data was transmitted before specimen expiration':
      '  - Dados foram transmitidos antes da expiração do espécime',
    '  - Earth assessed as viable for energy extraction':
      '  - Terra avaliada como viável para extração de energia',
    '  - Reference to a future "alignment window"':
      '  - Referência a uma futura "janela de alinhamento"',
    'We believe the scouts completed their purpose.':
      'Acreditamos que os batedores cumpriram seu propósito.',
    'The data they gathered has already been received': 'Os dados que coletaram já foram recebidos',
    'by whatever sent them.': 'por quem quer que os tenha enviado.',
    'IV. THE WINDOW': 'IV. A JANELA',
    '"Thirty rotations" — interpreted as 30 orbital years.':
      '"Trinta rotações" — interpretado como 30 anos orbitais.',
    'Projected window: YEAR 2026.': 'Janela projetada: ANO 2026.',
    'Nature unknown. Assessed possibilities:': 'Natureza desconhecida. Possibilidades avaliadas:',
    '  - Deployment of integration organisms': '  - Implantação de organismos de integração',
    '  - Initiation of indirect conversion process': '  - Início do processo de conversão indireta',
    '  - Activation signal for pre-positioned systems':
      '  - Sinal de ativação para sistemas pré-posicionados',
    'We stress: this is not an invasion timeline.':
      'Enfatizamos: isto não é uma linha do tempo de invasão.',
    'It may be something we do not yet have language for.':
      'Pode ser algo para o qual ainda não temos linguagem.',
    'V. THE WATCHERS': 'V. OS OBSERVADORES',
    'Working designation for the origin civilization.':
      'Designação de trabalho para a civilização de origem.',
    'What we believe we know:': 'O que acreditamos saber:',
    '  - Post-biological or hybrid form of existence':
      '  - Forma de existência pós-biológica ou híbrida',
    '  - Colonial expansion through indirect conversion':
      '  - Expansão colonial através de conversão indireta',
    '  - Do not physically arrive at target worlds': '  - Não chegam fisicamente aos mundos alvo',
    '  - Utilize bio-engineered intermediaries for assessment':
      '  - Utilizam intermediários bioengenheirados para avaliação',
    '  - Extract energy from cognitive biological networks':
      '  - Extraem energia de redes biológicas cognitivas',
    'The name "Watchers" was chosen by this committee.':
      'O nome "Observadores" foi escolhido por este comitê.',
    'It is the only word that fits. They observe.':
      'É a única palavra que se encaixa. Eles observam.',
    'They measure. They wait. And then — we believe —':
      'Eles medem. Eles esperam. E então — acreditamos —',
    'they harvest. Without ever arriving.': 'eles colhem. Sem jamais chegar.',
    'VI. INSTITUTIONAL POSTURE': 'VI. POSTURA INSTITUCIONAL',
    'Current directive from the Ministry:': 'Diretiva atual do Ministério:',
    '  - Maintain public denial per multinational protocol':
      '  - Manter negação pública conforme protocolo multinacional',
    '  - Continue monitoring for activation signals':
      '  - Continuar monitoramento de sinais de ativação',
    '  - Coordinate with international partners': '  - Coordenar com parceiros internacionais',
    '  - Prepare contingency frameworks for 2026 window':
      '  - Preparar estruturas de contingência para a janela de 2026',
    'This committee notes, with professional distress,':
      'Este comitê nota, com angústia profissional,',
    'that "contingency framework" implies a response':
      'que "estrutura de contingência" implica uma capacidade',
    'capability we do not possess. We have documented':
      'de resposta que não possuímos. Documentamos',
    'a situation. We have not found a solution.': 'uma situação. Não encontramos uma solução.',
    'God help us all.': 'Deus nos ajude a todos.',
    'END BRIEFING — 4 COPIES AUTHORIZED': 'FIM DO BRIEFING — 4 CÓPIAS AUTORIZADAS',
    'SESSION RESIDUE — AUTOMATED LOG': 'RESÍDUO DE SESSÃO — LOG AUTOMATIZADO',
    'Multiple evidence file accesses detected.':
      'Múltiplos acessos a arquivos de evidência detectados.',
    'Review pattern indicates deliberate collection.':
      'Padrão de revisão indica coleta deliberada.',
    'Temporary cache contains enough material to':
      'Cache temporário contém material suficiente para',
    'support an external leak attempt.': 'apoiar uma tentativa de vazamento externo.',
    'CONCLUSION: Session risk elevated.': 'CONCLUSÃO: Risco da sessão elevado.',
    'NOTICE: Export behavior expected.': 'AVISO: Comportamento de exportação esperado.',
    'ETHICS EXCEPTION — REQUEST 03': 'EXCEÇÃO ÉTICA — SOLICITAÇÃO 03',
    'DATE: 29-JAN-1996': 'DATA: 29-JAN-1996',
    'REQUEST:': 'SOLICITAÇÃO:',
    '  Waiver of standard protocols for specimen handling.':
      '  Dispensa dos protocolos padrão para manuseio de espécimes.',
    '  Justification: Unique scientific opportunity.':
      '  Justificativa: Oportunidade científica única.',
    'STATUS: APPROVED': 'STATUS: APROVADO',
    '  - All procedures conducted off-site':
      '  - Todos os procedimentos conduzidos fora das instalações',
    '  - No institutional records': '  - Sem registros institucionais',
    '  - Results shared with foreign partners only':
      '  - Resultados compartilhados apenas com parceiros estrangeiros',
    'APPROVAL: [SIGNATURE REDACTED]': 'APROVAÇÃO: [ASSINATURA REDIGIDA]',
    'PROGRAM OVERVIEW — BIO-ASSESSMENT INITIATIVE':
      'VISÃO GERAL DO PROGRAMA — INICIATIVA DE BIO-AVALIAÇÃO',
    'Following the January 1996 incident, a joint program':
      'Após o incidente de janeiro de 1996, um programa conjunto',
    'was established with international partners.':
      'foi estabelecido com parceiros internacionais.',
    'OBJECTIVES:': 'OBJETIVOS:',
    '  - Analyze recovered biological material': '  - Analisar material biológico recuperado',
    '  - Develop detection protocols': '  - Desenvolver protocolos de detecção',
    '  - Prepare response frameworks': '  - Preparar estruturas de resposta',
    'PARTICIPANTS:': 'PARTICIPANTES:',
    '  - Brazilian Intelligence (Lead, Local)': '  - Inteligência Brasileira (Líder, Local)',
    '  - [REDACTED] (Technical Analysis)': '  - [REDIGIDO] (Análise Técnica)',
    '  - [REDACTED] (Biological Assessment)': '  - [REDIGIDO] (Avaliação Biológica)',
    'DIVISION OF ASSETS:': 'DIVISÃO DE ATIVOS:',
    '  - Brazil retains Subject ALFA remains': '  - Brasil retém restos do Sujeito ALFA',
    '  - Foreign partner received Subjects BETA, GAMMA':
      '  - Parceiro estrangeiro recebeu Sujeitos BETA, GAMA',
    '  - Material samples divided per Protocol 7-ECHO':
      '  - Amostras de material divididas conforme Protocolo 7-ECHO',
    'STATUS: Ongoing.': 'STATUS: Em andamento.',
    'TEMPORAL ANALYSIS — WINDOW ALIGNMENT': 'ANÁLISE TEMPORAL — ALINHAMENTO DE JANELA',
    'METHODOLOGY: Signal Pattern Reconstruction': 'METODOLOGIA: Reconstrução de Padrão de Sinal',
    'AUTHOR: [CLASSIFIED — signals intelligence analyst]':
      'AUTOR: [CLASSIFICADO — analista de inteligência de sinais]',
    'Cross-analysis of all recovered psi-comm fragments':
      'Análise cruzada de todos os fragmentos psi-comm recuperados',
    'yielded the following recurring temporal references:':
      'produziu as seguintes referências temporais recorrentes:',
    'TEMPORAL REFERENCES:': 'REFERÊNCIAS TEMPORAIS:',
    '  - "thirty rotations" (freq: 3)': '  - "trinta rotações" (freq: 3)',
    '  - "alignment" (freq: 2)': '  - "alinhamento" (freq: 2)',
    '  - "convergence" (freq: 1)': '  - "convergência" (freq: 1)',
    '  - "window" (freq: 2)': '  - "janela" (freq: 2)',
    'ASTRONOMICAL CORRELATION:': 'CORRELAÇÃO ASTRONÔMICA:',
    '  Year 2026 shows:': '  Ano 2026 mostra:',
    '    - Unusual planetary alignments': '    - Alinhamentos planetários incomuns',
    '    - Solar activity projections: elevated': '    - Projeções de atividade solar: elevadas',
    '    - [DATA INSUFFICIENT FOR FURTHER CORRELATION]':
      '    - [DADOS INSUFICIENTES PARA CORRELAÇÃO ADICIONAL]',
    'CONFIDENCE LEVEL: MODERATE': 'NÍVEL DE CONFIANÇA: MODERADO',
    '  Establish monitoring protocols for year 2026.':
      '  Estabelecer protocolos de monitoramento para o ano 2026.',
    '  Nature of expected event: UNKNOWN.': '  Natureza do evento esperado: DESCONHECIDA.',
    'PERSONAL NOTE:': 'NOTA PESSOAL:',
    '  The frequency of "thirty rotations" across': '  A frequência de "trinta rotações" entre',
    '  independent specimen extractions is difficult':
      '  extrações de espécimes independentes é difícil',
    '  to dismiss as coincidence. I recommend we take':
      '  de descartar como coincidência. Recomendo que levemos',
    '  this reference seriously.': '  esta referência a sério.',
    'RAW NEURAL CAPTURE — SPECIMEN ALFA': 'CAPTURA NEURAL BRUTA — ESPÉCIME ALFA',
    'EXTRACTION DATE: 21-JAN-1996 04:17': 'DATA DE EXTRAÇÃO: 21-JAN-1996 04:17',
    'DURATION: 0.3 SECONDS (SUBJECTIVE: UNKNOWN)':
      'DURAÇÃO: 0,3 SEGUNDOS (SUBJETIVA: DESCONHECIDA)',
    '[non-linear perception detected]': '[percepção não-linear detectada]',
    '...purpose singular... observe catalog transmit...':
      '...propósito singular... observar catalogar transmitir...',
    '...not-self... extension... eyes-that-are-not-eyes...':
      '...não-eu... extensão... olhos-que-não-são-olhos...',
    '...this world... dense... loud... LOUD...':
      '...este mundo... denso... barulhento... BARULHENTO...',
    '[temporal distortion]': '[distorção temporal]',
    '...others of this-shape sent to many worlds...':
      '...outros desta-forma enviados a muitos mundos...',
    '...most do not return... return not expected...':
      '...a maioria não retorna... retorno não esperado...',
    '...we are the cost of knowing...': '...somos o custo de saber...',
    '[emotional bleed: resignation]': '[sangramento emocional: resignação]',
    '...they-above wait... they-above measure...': '...eles-acima esperam... eles-acima medem...',
    '...seven billion... dense... high yield...': '...sete bilhões... denso... alto rendimento...',
    '...window approaches... thirty rotations...': '...janela se aproxima... trinta rotações...',
    '[conceptual transmission]': '[transmissão conceitual]',
    '>>>IMAGE: vast darkness between stars': '>>>IMAGEM: vasta escuridão entre estrelas',
    '>>>IMAGE: something watching, not moving, never moving':
      '>>>IMAGEM: algo observando, não se movendo, nunca se movendo',
    '>>>IMAGE: threads connecting to countless worlds':
      '>>>IMAGEM: fios conectando a incontáveis mundos',
    '>>>CONCEPT: harvest is not destruction': '>>>CONCEITO: colheita não é destruição',
    '>>>CONCEPT: the crop continues living': '>>>CONCEITO: a safra continua vivendo',
    '[signal degradation]': '[degradação do sinal]',
    '...we do not arrive... we do not need to...': '...nós não chegamos... não precisamos...',
    '...you are already... already...': '...vocês já são... já...',
    'ANALYST NOTE: Subject expired during neural extraction.':
      'NOTA DO ANALISTA: Sujeito expirou durante extração neural.',
    '              Complete cognitive download was not possible.':
      '              Download cognitivo completo não foi possível.',
    '              What we captured is partial. Pray it was':
      '              O que capturamos é parcial. Rezem para que tenha sido',
    '              enough. Pray it was not.':
      '              suficiente. Rezem para que não tenha sido.',
    'NEURAL PATTERN PRESERVED FOR REMOTE LINK': 'PADRÃO NEURAL PRESERVADO PARA LINK REMOTO',
    'FILE: NEURAL_DUMP_ALFA.PSI': 'ARQUIVO: NEURAL_DUMP_ALFA.PSI',
    'STATUS: ENCRYPTED': 'STATUS: CRIPTOGRAFADO',
    'CLASSIFICATION: COSMIC - PSI-DIVISION': 'CLASSIFICAÇÃO: CÓSMICO - DIVISÃO-PSI',
    'RECOVERED COPY AVAILABLE': 'CÓPIA RECUPERADA DISPONÍVEL',
    'This file contains raw neural capture data from':
      'Este arquivo contém dados brutos de captura neural de',
    'recovered specimen. Authentication required.': 'espécime recuperado. Autenticação necessária.',
    'Use: open neural_dump_alfa.psi': 'Use: open neural_dump_alfa.psi',
    'Subject designation (found in autopsy records):':
      'Designação do sujeito (encontrada nos registros de autópsia):',
    'Check autopsy files in quarantine': 'Verifique os arquivos de autópsia na quarentena',
    'REPORT — PSI-COMMUNICATION ANALYSIS': 'RELATÓRIO — ANÁLISE DE PSI-COMUNICAÇÃO',
    'DATE: 15-FEB-1996': 'DATA: 15-FEV-1996',
    'EXECUTIVE SUMMARY:': 'RESUMO EXECUTIVO:',
    'Communication with recovered specimens occurred via':
      'Comunicação com espécimes recuperados ocorreu via',
    'non-acoustic, non-electromagnetic means. Personnel':
      'meios não-acústicos e não-eletromagnéticos. Pessoal',
    'reported receiving information without sensory input.':
      'relatou receber informações sem estímulo sensorial.',
    'CHARACTERISTICS OF PSI-COMM': 'CARACTERÍSTICAS DA PSI-COMM',
    'NOT observed:': 'NÃO observado:',
    '  - Spoken language': '  - Linguagem falada',
    '  - Written symbols': '  - Símbolos escritos',
    '  - Gestural communication': '  - Comunicação gestual',
    'OBSERVED:': 'OBSERVADO:',
    '  - Synchronized neural activity between operator/subject':
      '  - Atividade neural sincronizada entre operador/sujeito',
    '  - Intrusive conceptual transmission': '  - Transmissão conceitual intrusiva',
    '  - Shared imagery and meaning, not symbols':
      '  - Imagens e significados compartilhados, não símbolos',
    '  - Emotional state transfer': '  - Transferência de estado emocional',
    'OPERATOR EFFECTS': 'EFEITOS NO OPERADOR',
    'Personnel exposed to psi-comm report:': 'Pessoal exposto à psi-comm reporta:',
    '  - Loss of temporal reference (hours feel like seconds)':
      '  - Perda de referência temporal (horas parecem segundos)',
    '  - Intrusive thoughts persisting for days': '  - Pensamentos intrusivos persistindo por dias',
    '  - Emotional "bleed-through" (fear, resignation, purpose)':
      '  - "Sangramento" emocional (medo, resignação, propósito)',
    '  - Understanding concepts without being able to explain':
      '  - Compreender conceitos sem ser capaz de explicar',
    'Lead Operator (Psi Division):': 'Operador Líder (Divisão Psi):',
    '"I understood what it was showing me. I cannot tell you':
      '"Eu entendi o que ele estava me mostrando. Não posso dizer',
    ' what I understood. The knowing does not translate."':
      ' o que entendi. O conhecimento não se traduz."',
    'CRITICAL FINDING': 'DESCOBERTA CRÍTICA',
    'The entities do not communicate to exchange information.':
      'As entidades não se comunicam para trocar informações.',
    'They transmit. They do not expect response.': 'Eles transmitem. Não esperam resposta.',
    'They were never designed for dialogue.': 'Nunca foram projetados para diálogo.',
    'LINK ACCESS PROTOCOL': 'PROTOCOLO DE ACESSO AO LINK',
    'Neural pattern preservation allows post-mortem link.':
      'Preservação do padrão neural permite link post-mortem.',
    'Authentication phrase derived from psi-comm transmission.':
      'Frase de autenticação derivada de transmissão psi-comm.',
    '  > link': '  > link',
    '  > Enter phrase: ___________': '  > Digite a frase: ___________',
    'Access phrase referenced in neural dump under [conceptual':
      'Frase de acesso referenciada no dump neural sob seção [transmissão',
    'transmission] section — the primary directive.': 'conceitual] — a diretiva primária.',
    'ANALYSIS — SPECIMEN FUNCTION AND PURPOSE': 'ANÁLISE — FUNÇÃO E PROPÓSITO DO ESPÉCIME',
    'AUTHOR: [CLASSIFIED — senior biologist, assessment team]':
      'AUTOR: [CLASSIFICADO — biólogo sênior, equipe de avaliação]',
    'DATE: 22-FEB-1996': 'DATA: 22-FEV-1996',
    'CONCLUSION: The recovered entities are tools, not envoys.':
      'CONCLUSÃO: As entidades recuperadas são ferramentas, não enviados.',
    'ANATOMICAL EVIDENCE': 'EVIDÊNCIA ANATÔMICA',
    'Specimens show signs of deliberate engineering:':
      'Espécimes mostram sinais de engenharia deliberada:',
    '  SPECIALIZED:': '  ESPECIALIZADO:',
    '    - Sensory organs optimized for observation':
      '    - Órgãos sensoriais otimizados para observação',
    '    - Neural density far exceeds body mass requirement':
      '    - Densidade neural excede em muito a necessidade de massa corporal',
    '    - Simplified digestive system (mission duration limited)':
      '    - Sistema digestivo simplificado (duração da missão limitada)',
    '  FRAGILE:': '  FRÁGIL:',
    '    - Poorly suited for Earth gravity (joint stress)':
      '    - Pouco adequado para gravidade terrestre (estresse articular)',
    '    - Minimal immune response (not built to survive)':
      '    - Resposta imunológica mínima (não construído para sobreviver)',
    '    - No reproductive capability whatsoever': '    - Sem capacidade reprodutiva alguma',
    '  LIMITED:': '  LIMITADO:',
    '    - No evidence of autonomous decision-making centers':
      '    - Sem evidência de centros autônomos de tomada de decisão',
    '    - Behavior patterns suggest programmed routines':
      '    - Padrões de comportamento sugerem rotinas programadas',
    '    - Mission completion prioritized over self-preservation':
      '    - Conclusão da missão priorizada sobre autopreservação',
    INTERPRETATION: 'INTERPRETAÇÃO',
    'These are reconnaissance units. Purpose-built.':
      'Estas são unidades de reconhecimento. Construídas sob medida.',
    'They were never meant to survive this assignment.':
      'Nunca foram feitos para sobreviver a esta missão.',
    'They were never meant to return.': 'Nunca foram feitos para retornar.',
    'They were never meant to represent their creators.':
      'Nunca foram feitos para representar seus criadores.',
    'In my professional assessment, they are biological':
      'Na minha avaliação profissional, eles são sensores',
    'sensors. Nothing more.': 'biológicos. Nada mais.',
    'WHAT THIS IMPLIES': 'O QUE ISTO IMPLICA',
    'If Earth received scouts, it passed initial screening.':
      'Se a Terra recebeu batedores, passou na triagem inicial.',
    'If scouts transmitted successfully, data was received.':
      'Se os batedores transmitiram com sucesso, os dados foram recebidos.',
    'I do not enjoy writing this next sentence.': 'Não tenho prazer em escrever a próxima frase.',
    'If data was received, then we have been catalogued.':
      'Se os dados foram recebidos, então fomos catalogados.',
    'Someone — something — now knows we are here,': 'Alguém — algo — agora sabe que estamos aqui,',
    'what we are, and what we are worth.': 'o que somos e quanto valemos.',
    'Year of projected transition window:': 'Ano da janela de transição projetada:',
    'Referenced in multiple classified documents':
      'Referenciado em múltiplos documentos classificados',
    'INTERCEPTED SIGNAL — PRIORITY ULTRA': 'SINAL INTERCEPTADO — PRIORIDADE ULTRA',
    'INTERCEPT DATE: 03-MAR-1996': 'DATA DA INTERCEPTAÇÃO: 03-MAR-1996',
    'ORIGIN: EXTRASOLAR': 'ORIGEM: EXTRASSOLAR',
    'CLASSIFICATION: This transmission was detected 6 weeks':
      'CLASSIFICAÇÃO: Esta transmissão foi detectada 6 semanas',
    'after the January incident. Source triangulation indicates':
      'após o incidente de janeiro. Triangulação da fonte indica',
    'origin beyond solar system boundary.': 'origem além do limite do sistema solar.',
    'TRANSMISSION CONTENT (CONCEPTUAL TRANSLATION)':
      'CONTEÚDO DA TRANSMISSÃO (TRADUÇÃO CONCEITUAL)',
    '>>RECEIPT: Scout telemetry confirmed': '>>RECIBO: Telemetria do batedor confirmada',
    '>>STATUS: Target world catalogued': '>>STATUS: Mundo alvo catalogado',
    '>>ASSESSMENT: High cognitive density': '>>AVALIAÇÃO: Alta densidade cognitiva',
    '>>ASSESSMENT: Energy yield projection - OPTIMAL':
      '>>AVALIAÇÃO: Projeção de rendimento energético - ÓTIMO',
    '>>ASSESSMENT: Resistance threshold - NEGLIGIBLE':
      '>>AVALIAÇÃO: Limiar de resistência - DESPREZÍVEL',
    '>>DECISION: Proceed to Phase 2': '>>DECISÃO: Prosseguir para Fase 2',
    '>>DEPLOYMENT: Second-generation integration assets':
      '>>IMPLANTAÇÃO: Ativos de integração de segunda geração',
    '>>TIMELINE: Alignment window (local: 2026)':
      '>>LINHA DO TEMPO: Janela de alinhamento (local: 2026)',
    '>>METHOD: Indirect biological seeding': '>>MÉTODO: Semeadura biológica indireta',
    '>>NOTE: Arrival unnecessary': '>>NOTA: Chegada desnecessária',
    '>>NOTE: Local biology will serve as intermediary':
      '>>NOTA: Biologia local servirá como intermediária',
    '>>NOTE: Extraction begins upon cognitive threshold':
      '>>NOTA: Extração começa no limiar cognitivo',
    '  This transmission confirms what we feared most.':
      '  Esta transmissão confirma o que mais temíamos.',
    '  The scouts completed their mission.': '  Os batedores completaram sua missão.',
    '  A response has been sent.': '  Uma resposta foi enviada.',
    '  But "response" is the wrong word.': '  Mas "resposta" é a palavra errada.',
    '  They are not coming.': '  Eles não estão vindo.',
    '  Something else is.': '  Outra coisa está.',
    '  I have forwarded this to the Ministry.': '  Encaminhei isto ao Ministério.',
    '  I do not expect a reply.': '  Não espero uma resposta.',
    '  [SEE ATTACHED SIGNAL VISUALIZATION]': '  [VEJA VISUALIZAÇÃO DO SINAL EM ANEXO]',
    'FILE: SECOND_DEPLOYMENT.SIG': 'ARQUIVO: SECOND_DEPLOYMENT.SIG',
    'CLASSIFICATION: ULTRA — SIGNALS DIVISION': 'CLASSIFICAÇÃO: ULTRA — DIVISÃO DE SINAIS',
    'This file contains intercepted signal data.':
      'Este arquivo contém dados de sinal interceptado.',
    'Authentication required for access.': 'Autenticação necessária para acesso.',
    'Use: open second_deployment.sig': 'Use: open second_deployment.sig',
    'Signal analysis showing second deployment trajectory':
      'Análise de sinal mostrando trajetória de segunda implantação',
    'MEMORANDUM — CLARIFICATION OF 2026 REFERENCE':
      'MEMORANDO — ESCLARECIMENTO DA REFERÊNCIA A 2026',
    'AUTHOR: [CLASSIFIED — senior intelligence officer]':
      'AUTOR: [CLASSIFICADO — oficial de inteligência sênior]',
    'DATE: 01-APR-1996': 'DATA: 01-ABR-1996',
    'TO: ALL CLEARED PERSONNEL': 'PARA: TODO PESSOAL AUTORIZADO',
    'I write to correct a dangerous misunderstanding that':
      'Escrevo para corrigir um mal-entendido perigoso que',
    'has been circulating within this directorate.': 'tem circulado dentro desta diretoria.',
    'WHAT 2026 IS NOT': 'O QUE 2026 NÃO É',
    'Several colleagues have interpreted the recovered':
      'Vários colegas interpretaram as transmissões',
    'transmissions as predicting an invasion in 2026.':
      'recuperadas como previsão de uma invasão em 2026.',
    'This was our first reading. It was wrong.': 'Esta foi nossa primeira leitura. Estava errada.',
    '  2026 is NOT an invasion date.': '  2026 NÃO é uma data de invasão.',
    '  It is NOT a fleet arrival.': '  NÃO é uma chegada de frota.',
    '  It is NOT first contact.': '  NÃO é primeiro contato.',
    '  It is NOT a single event.': '  NÃO é um evento único.',
    'Colleagues who are sleeping better because they': 'Colegas que estão dormindo melhor porque',
    'believe we have thirty years to prepare — you':
      'acreditam que temos trinta anos para nos preparar — vocês',
    'misunderstand the nature of what we are facing.':
      'não entendem a natureza do que enfrentamos.',
    'WHAT 2026 IS': 'O QUE 2026 É',
    '  A TRANSITION WINDOW.': '  UMA JANELA DE TRANSIÇÃO.',
    '  Based on cross-analysis of all recovered fragments:':
      '  Com base na análise cruzada de todos os fragmentos recuperados:',
    '    - End of reconnaissance phase': '    - Fim da fase de reconhecimento',
    '    - Activation of indirect systems': '    - Ativação de sistemas indiretos',
    '    - Point beyond which intervention becomes impossible':
      '    - Ponto além do qual a intervenção se torna impossível',
    'PLAIN LANGUAGE': 'LINGUAGEM SIMPLES',
    '  Nothing arrives.': '  Nada chega.',
    '  Something changes.': '  Algo muda.',
    '  The change may already be in motion. We lack the':
      '  A mudança pode já estar em andamento. Falta-nos a',
    '  instrumentation to detect it. 2026 is simply when':
      '  instrumentação para detectá-la. 2026 é simplesmente quando',
    '  we believe it becomes irreversible.': '  acreditamos que se torna irreversível.',
    '  I do not write this to cause panic. I write it':
      '  Não escrevo isto para causar pânico. Escrevo',
    '  because our contingency planning assumes an enemy':
      '  porque nosso planejamento de contingência assume um inimigo',
    '  who will show up. This enemy may never show up.':
      '  que aparecerá. Este inimigo pode nunca aparecer.',
    '  That is precisely the problem.': '  Esse é precisamente o problema.',
    'STRATEGIC IMPLICATION': 'IMPLICAÇÃO ESTRATÉGICA',
    '  There is no defense protocol for 2026.': '  Não há protocolo de defesa para 2026.',
    '  There is no countermeasure to design.': '  Não há contramedida a ser projetada.',
    '  There is no adversary to engage.': '  Não há adversário a ser enfrentado.',
    '  We are documenting a process that does not require':
      '  Estamos documentando um processo que não requer',
    '  our participation or our consent.': '  nossa participação ou nosso consentimento.',
    '  Ministry has been informed. Their response was to':
      '  Ministério foi informado. A resposta deles foi',
    '  request this memorandum be reclassified to RED.':
      '  solicitar que este memorando seja reclassificado para VERMELHO.',
    '  That was their only response.': '  Essa foi a única resposta deles.',
    'INTERNAL ANALYSIS — ENERGY EXTRACTION HYPOTHESIS':
      'ANÁLISE INTERNA — HIPÓTESE DE EXTRAÇÃO DE ENERGIA',
    'CLASSIFICATION: RED — SPECULATIVE': 'CLASSIFICAÇÃO: VERMELHO — ESPECULATIVO',
    'AUTHOR: [CLASSIFIED — senior analyst, signals division]':
      'AUTOR: [CLASSIFICADO — analista sênior, divisão de sinais]',
    'DATE: 18-MAR-1996': 'DATA: 18-MAR-1996',
    'TO: DIRECTOR — ASSESSMENTS': 'PARA: DIRETOR — AVALIAÇÕES',
    'Sir,': 'Senhor,',
    'I submit this paper with reluctance. Its conclusions':
      'Submeto este documento com relutância. Suas conclusões',
    'are disturbing and I am aware they sound irrational.':
      'são perturbadoras e estou ciente de que soam irracionais.',
    'But the data from the recovered neural patterns does':
      'Mas os dados dos padrões neurais recuperados não',
    'not permit a gentler interpretation.': 'permitem uma interpretação mais branda.',
    'RECOVERED FRAGMENTS — SCOUT NEURAL ANALYSIS':
      'FRAGMENTOS RECUPERADOS — ANÁLISE NEURAL DOS BATEDORES',
    'Two phrases recur across all three specimen extractions:':
      'Duas frases se repetem em todas as três extrações de espécimes:',
    '  Fragment 1: "higher cognition increases yield"':
      '  Fragmento 1: "cognição mais alta aumenta o rendimento"',
    '  Fragment 2: reference to population density — billions':
      '  Fragmento 2: referência à densidade populacional — bilhões',
    "Our linguist insists these are not the scouts' thoughts.":
      'Nosso linguista insiste que estes não são os pensamentos dos batedores.',
    'They are instructions. Received. Embedded. Like firmware.':
      'São instruções. Recebidas. Incorporadas. Como firmware.',
    'ANALYST INTERPRETATION': 'INTERPRETAÇÃO DO ANALISTA',
    'If the fragments are taken at face value, the picture':
      'Se os fragmentos forem tomados ao pé da letra, o quadro',
    'that emerges is this:': 'que emerge é este:',
    '  - The scouts were measuring cognitive output.':
      '  - Os batedores estavam medindo produção cognitiva.',
    '  - Intelligence is the resource being assessed.':
      '  - Inteligência é o recurso sendo avaliado.',
    '  - Population size determines extraction viability.':
      '  - Tamanho da população determina viabilidade de extração.',
    'I am a signals analyst, not a philosopher.': 'Sou analista de sinais, não filósofo.',
    'But I believe they were calculating yield.': 'Mas acredito que estavam calculando rendimento.',
    'Of us.': 'De nós.',
    'THE QUESTION OF PRESERVATION': 'A QUESTÃO DA PRESERVAÇÃO',
    'The neural data contains no references to destruction.':
      'Os dados neurais não contêm referências a destruição.',
    'None. Not in any fragment.': 'Nenhuma. Em nenhum fragmento.',
    'This troubled me until I understood why.': 'Isto me perturbou até eu entender por quê.',
    'If the resource is cognitive activity, then killing':
      'Se o recurso é atividade cognitiva, então matar',
    'the source would terminate supply. The optimal strategy':
      'a fonte encerraria o suprimento. A estratégia ótima',
    'is preservation. The population must continue to live,':
      'é preservação. A população deve continuar vivendo,',
    'think, create. The extraction must be invisible.':
      'pensando, criando. A extração deve ser invisível.',
    'Deus me livre — I wrote that sentence and my hands':
      'Deus me livre — escrevi essa frase e minhas mãos',
    'will not stop shaking.': 'não param de tremer.',
    'WHAT WE DO NOT KNOW': 'O QUE NÃO SABEMOS',
    '  - The physical mechanism of extraction': '  - O mecanismo físico de extração',
    '  - Whether extraction has already begun': '  - Se a extração já começou',
    '  - Whether the process can be detected or measured':
      '  - Se o processo pode ser detectado ou medido',
    '  - Whether resistance is even theoretically possible':
      '  - Se a resistência é sequer teoricamente possível',
    'I request reassignment after filing this report.':
      'Solicito remanejamento após protocolar este relatório.',
    'Energy Extraction Model - Theoretical visualization':
      'Modelo de Extração de Energia - Visualização teórica',
    'UTILITY — DATA RECONSTRUCTION TOOL': 'UTILITÁRIO — FERRAMENTA DE RECONSTRUÇÃO DE DADOS',
    'VERSION: 1.7 (LEGACY)': 'VERSÃO: 1.7 (LEGADO)',
    'This utility can reconstruct fragmented data segments.':
      'Este utilitário pode reconstruir segmentos de dados fragmentados.',
    '  script <script_content>': '  script <conteúdo_do_script>',
    'REQUIRED SCRIPT FORMAT:': 'FORMATO DE SCRIPT NECESSÁRIO:',
    '  A valid reconstruction script must contain:':
      '  Um script de reconstrução válido deve conter:',
    '    - INIT command': '    - Comando INIT',
    '    - TARGET specification (valid archive path)':
      '    - Especificação TARGET (caminho de arquivo válido)',
    '    - EXEC command': '    - Comando EXEC',
    'EXAMPLE:': 'EXEMPLO:',
    '  script INIT;TARGET=/admin/fragment.dat;EXEC':
      '  script INIT;TARGET=/admin/fragment.dat;EXEC',
    'AVAILABLE TARGETS': 'ALVOS DISPONÍVEIS',
    '  /admin/neural_fragment.dat    [FRAGMENTED]': '  /admin/neural_fragment.dat    [FRAGMENTADO]',
    '  /comms/psi_residue.log        [CORRUPTED]': '  /comms/psi_residue.log        [CORROMPIDO]',
    'NOTE: Successful reconstruction may reveal hidden content.':
      'NOTA: Reconstrução bem-sucedida pode revelar conteúdo oculto.',
    'OPERATIONAL SECURITY MEMORANDUM': 'MEMORANDO DE SEGURANÇA OPERACIONAL',
    'DOCUMENT: OSM-1993-X': 'DOCUMENTO: OSM-1993-X',
    'TO: All Field Personnel': 'PARA: Todo Pessoal de Campo',
    'FROM: The Director, Special Projects': 'DE: O Diretor, Projetos Especiais',
    'DATE: 13-OCT-1993': 'DATA: 13-OUT-1993',
    'RE: Information Compartmentalization': 'REF: Compartimentação de Informações',
    'In light of recent security concerns, I am issuing the':
      'Em vista de preocupações recentes de segurança, estou emitindo a',
    'following directive effective immediately:': 'seguinte diretiva com efeito imediato:',
    '  SHARE NOTHING BEYOND YOUR SCOPE.': '  NÃO COMPARTILHE NADA ALÉM DO SEU ESCOPO.',
    'Information regarding ongoing projects is to be shared':
      'Informações sobre projetos em andamento devem ser compartilhadas',
    'on a strict need-to-know basis. Even colleagues with':
      'estritamente com base em necessidade de saber. Mesmo colegas com',
    'appropriate clearance should not receive details beyond':
      'autorização apropriada não devem receber detalhes além de',
    'their assigned scope.': 'seu escopo designado.',
    'Full operational awareness is distributed across':
      'Consciência operacional completa está distribuída entre',
    'departments and archives. This is by design.': 'departamentos e arquivos. Isto é por design.',
    'Those who require broader context must submit':
      'Aqueles que necessitam de contexto mais amplo devem submeter',
    'Form OSM-7 through their division chief.': 'Formulário OSM-7 através de seu chefe de divisão.',
    'ADDENDUM (handwritten):': 'ADENDO (escrito à mão):',
    '  "Quem sabe demais, carrega peso demais."': '  "Quem sabe demais, carrega peso demais."',
    '  (Who knows too much carries too much weight.)': '  (Quem sabe demais, carrega peso demais.)',
    'FIELD REPORT — INITIAL CONTACT': 'RELATÓRIO DE CAMPO — CONTATO INICIAL',
    'LOCATION: Jardim Andere, Varginha, Minas Gerais':
      'LOCAL: Jardim Andere, Varginha, Minas Gerais',
    'DATE: 20-JAN-1996, 15:30h (local)': 'DATA: 20-JAN-1996, 15:30h (local)',
    'WITNESSES:': 'TESTEMUNHAS:',
    '  Three female civilians, ages 14-22.': '  Três civis do sexo feminino, idades 14-22.',
    '  Names withheld per Protocol 7.': '  Nomes retidos conforme Protocolo 7.',
    'LOCATION DETAILS:': 'DETALHES DO LOCAL:',
    '  Vacant lot between Rua Suécia and Rua Benevenuto Brás.':
      '  Terreno baldio entre Rua Suécia e Rua Benevenuto Brás.',
    '  Area described as overgrown, partially obscured by':
      '  Área descrita como coberta de mato, parcialmente obstruída por',
    '  adjacent construction materials.': '  materiais de construção adjacentes.',
    'WITNESS ACCOUNT (SUMMARY):': 'RELATO DA TESTEMUNHA (RESUMO):',
    '  Subjects observed crouching figure approximately 1.6m':
      '  Sujeitos observaram figura agachada de aproximadamente 1,6m',
    '  in height. Dark brown skin described as "oily." Three':
      '  de altura. Pele marrom escura descrita como "oleosa." Três',
    '  prominent ridges on cranium. Large red eyes. Strong':
      '  sulcos proeminentes no crânio. Olhos grandes e vermelhos. Forte',
    '  ammonia-like odor noted.': '  odor semelhante a amônia notado.',
    '  Subjects fled scene. One reported temporary paralysis.':
      '  Sujeitos fugiram do local. Um relatou paralisia temporária.',
    '  Another claimed "feeling its thoughts" — see psi/.':
      '  Outro alegou "sentir seus pensamentos" — ver psi/.',
    'TIMELINE:': 'LINHA DO TEMPO:',
    '  13-JAN-1996: NORAD detects anomaly over Minas Gerais':
      '  13-JAN-1996: NORAD detecta anomalia sobre Minas Gerais',
    '  19-JAN-1996: Farmers report "falling star" near Varginha':
      '  19-JAN-1996: Fazendeiros reportam "estrela cadente" perto de Varginha',
    '  20-JAN-1996: 03:30h — Fire dept. receives calls re: "creature"':
      '  20-JAN-1996: 03:30h — Corpo de bombeiros recebe ligações sobre "criatura"',
    '  20-JAN-1996: 08:00h — Military cordons established':
      '  20-JAN-1996: 08:00h — Cordões militares estabelecidos',
    '  20-JAN-1996: 15:30h — Jardim Andere sighting (this report)':
      '  20-JAN-1996: 15:30h — Avistamento no Jardim Andere (este relatório)',
    '  20-JAN-1996: 22:00h — Hospital São Sebastião incident':
      '  20-JAN-1996: 22:00h — Incidente no Hospital São Sebastião',
    'SUBSEQUENT LOCATIONS:': 'LOCAIS SUBSEQUENTES:',
    '  - Escola de Sargentos das Armas (ESA)': '  - Escola de Sargentos das Armas (ESA)',
    '  - Hospital Humanitas': '  - Hospital Humanitas',
    '  - Cemitério municipal (alleged)': '  - Cemitério municipal (alegado)',
    '  Jardim Andere remains primary public touchpoint.':
      '  Jardim Andere permanece como ponto de contato público primário.',
    '  Subsequent containment sites not disclosed.':
      '  Locais de contenção subsequentes não divulgados.',
    'INTERNAL MEMORANDUM — FACILITIES': 'MEMORANDO INTERNO — INSTALAÇÕES',
    'DATE: 19-JUL-1994': 'DATA: 19-JUL-1994',
    'RE: World Cup Celebration Guidelines': 'REF: Diretrizes de Comemoração da Copa do Mundo',
    "Following Brazil's victory in the Copa do Mundo 1994,":
      'Após a vitória do Brasil na Copa do Mundo 1994,',
    'the following guidelines apply to workplace celebrations:':
      'as seguintes diretrizes se aplicam às comemorações no local de trabalho:',
    '  1. Television viewing permitted in break areas ONLY.':
      '  1. Visualização de televisão permitida SOMENTE em áreas de descanso.',
    '  2. Caipirinha service restricted to after-hours events.':
      '  2. Serviço de caipirinha restrito a eventos fora do horário.',
    '  3. Samba music volume must not exceed 70dB.':
      '  3. Volume de música samba não deve exceder 70dB.',
    '  4. The phrase "É TETRA!" may be exclaimed no more than':
      '  4. A frase "É TETRA!" pode ser exclamada no máximo',
    '     three (3) times per hour during work hours.':
      '     três (3) vezes por hora durante o horário de trabalho.',
    'APPROVED DECORATIONS:': 'DECORAÇÕES APROVADAS:',
    '  - Brazilian flag (regulation size only)':
      '  - Bandeira brasileira (tamanho regulamentar apenas)',
    '  - Team photographs (common areas only)': '  - Fotografias do time (áreas comuns apenas)',
    '  - "BRASIL CAMPEÃO" banners (break room only)':
      '  - Faixas "BRASIL CAMPEÃO" (sala de descanso apenas)',
    'PROHIBITED:': 'PROIBIDO:',
    '  - Confetti (fire hazard)': '  - Confete (risco de incêndio)',
    '  - Fireworks (obvious reasons)': '  - Fogos de artifício (razões óbvias)',
    '  - Vuvuzelas (noise complaints)': '  - Vuvuzelas (reclamações de ruído)',
    'NOTE FROM DIRECTOR:': 'NOTA DO DIRETOR:',
    '  "Parabéns a todos. But remember — we have work to do.':
      '  "Parabéns a todos. Mas lembrem-se — temos trabalho a fazer.',
    '   The universe does not pause for futebol."': '   O universo não para para o futebol."',
    '  "Nem tudo é festa. Voltem ao trabalho segunda-feira."':
      '  "Nem tudo é festa. Voltem ao trabalho segunda-feira."',
    '  (Not everything is a party. Return to work Monday.)':
      '  (Nem tudo é festa. Voltem ao trabalho segunda-feira.)',
    'MODEM CONNECTION LOG — EXTERNAL UPLINK': 'LOG DE CONEXÃO MODEM — UPLINK EXTERNO',
    'DEVICE: US Robotics Sportster 28.8': 'DISPOSITIVO: US Robotics Sportster 28.8',
    'DATE: 18-JAN-1996': 'DATA: 18-JAN-1996',
    'SESSION ACTIVITY': 'ATIVIDADE DA SESSÃO',
    'IRC TRANSCRIPT (PARTIAL)': 'TRANSCRIÇÃO IRC (PARCIAL)',
    'BILLING: 16 minutes @ R$0.85/min = R$13.60': 'FATURAMENTO: 16 minutos @ R$0,85/min = R$13,60',
    'RECOVERED FILE — USER DIRECTORY BACKUP': 'ARQUIVO RECUPERADO — BACKUP DO DIRETÓRIO DO USUÁRIO',
    'OWNER: [REDACTED]': 'PROPRIETÁRIO: [REDIGIDO]',
    '  This .sig brought to you by:': '  Esta .sig foi trazida a você por:',
    '  - Too much coffee': '  - Muito café',
    '  - Not enough sleep': '  - Pouco sono',
    '  - Saudade': '  - Saudade',
    '  Best viewed in Netscape Navigator 2.0': '  Melhor visualizado no Netscape Navigator 2.0',
    'CAFETERIA MENU — WEEK 03 (15-19 JAN 1996)':
      'CARDÁPIO DO REFEITÓRIO — SEMANA 03 (15-19 JAN 1996)',
    '  Feijoada completa': '  Feijoada completa',
    '  Arroz branco, couve refogada, laranja': '  Arroz branco, couve refogada, laranja',
    '  Farofa de bacon': '  Farofa de bacon',
    '  Frango à passarinho': '  Frango à passarinho',
    '  Purê de batata, salada mista': '  Purê de batata, salada mista',
    '  Peixe grelhado': '  Peixe grelhado',
    '  Arroz, feijão tropeiro': '  Arroz, feijão tropeiro',
    '  Vinagrete': '  Vinagrete',
    '  Carne assada': '  Carne assada',
    '  Macarrão ao sugo': '  Macarrão ao sugo',
    '  Salada de tomate': '  Salada de tomate',
    '  *** MENU CANCELLED ***': '  *** CARDÁPIO CANCELADO ***',
    '  [INCIDENT RESPONSE ACTIVE]': '  [RESPOSTA A INCIDENTE ATIVA]',
    '  Emergency rations distributed': '  Rações de emergência distribuídas',
    "NOTE: Friday's menu cancelled due to unscheduled":
      'NOTA: Cardápio de sexta-feira cancelado devido a',
    'facility lockdown. See INCIDENT REPORT 1996-01-VG.':
      'lockdown não programado da instalação. Ver RELATÓRIO DE INCIDENTE 1996-01-VG.',
    'Cafeteria staff reassigned to support operations.':
      'Equipe do refeitório remanejada para apoiar operações.',
    'Vending machines remain operational.': 'Máquinas de venda automática permanecem operacionais.',
    'Dona Maria apologizes for the inconvenience.': 'Dona Maria pede desculpas pelo inconveniente.',
    '# EMERGENCY BACKUP SCRIPT': '# SCRIPT DE BACKUP DE EMERGÊNCIA',
    '# This script saves the collected evidence to external media':
      '# Este script salva as evidências coletadas em mídia externa',
    '# before the connection is cut.': '# antes que a conexão seja cortada.',
    '# TRACE PURGE UTIL — LEGACY NODE': '# UTILITÁRIO DE PURGA DE RASTRO — NÓ LEGADO',
    '# OWNER: SYSADMIN (OBSOLETE)': '# PROPRIETÁRIO: SYSADMIN (OBSOLETO)',
    '# This utility clears trace artifacts from volatile buffers.':
      '# Este utilitário limpa artefatos de rastreamento de buffers voláteis.',
    '# Use only during active trace windows.':
      '# Use apenas durante janelas de rastreamento ativas.',
    'SECURITY LOG — TRACE PURGE EVENT': 'LOG DE SEGURANÇA — EVENTO DE PURGA DE RASTRO',
    'Observation:': 'Observação:',
    '  Legacy purge utility executed during active trace.':
      '  Utilitário de purga legado executado durante rastreamento ativo.',
    '  Buffer integrity reset; trace window re-opened.':
      '  Integridade do buffer reiniciada; janela de rastreamento reaberta.',
    '  Operator demonstrated knowledge of internal tooling.':
      '  Operador demonstrou conhecimento de ferramentas internas.',
    '  Session classified as HIGH PRIORITY.': '  Sessão classificada como ALTA PRIORIDADE.',
    '  Maintain surveillance. Do not terminate.': '  Manter vigilância. Não encerrar.',
    'INTEGRITY REGISTRY — EVIDENCE HASHES': 'REGISTRO DE INTEGRIDADE — HASHES DE EVIDÊNCIA',
    'DATE: 27-JAN-1996': 'DATA: 27-JAN-1996',
    'Purpose:': 'Propósito:',
    '  Validate evidence artifacts against tampering.':
      '  Validar artefatos de evidência contra adulteração.',
    'HASH SET:': 'CONJUNTO DE HASHES:',
    '  Hash mismatch indicates altered narrative.':
      '  Incompatibilidade de hash indica narrativa alterada.',
    '  Preserve originals for external verification.':
      '  Preservar originais para verificação externa.',
    'RESIDUAL SESSION CAPTURE — GHOST FRAME': 'CAPTURA DE SESSÃO RESIDUAL — QUADRO FANTASMA',
    'TIMESTAMP: [REDACTED]': 'TIMESTAMP: [REDIGIDO]',
    '[PARTIAL COMMAND TRACE]': '[RASTREAMENTO PARCIAL DE COMANDOS]',
    '  Prior operator achieved coherent linkage before purge.':
      '  Operador anterior alcançou ligação coerente antes da purga.',
    '  Evidence trails remain viable. Do not repeat mistakes.':
      '  Trilhas de evidência permanecem viáveis. Não repita erros.',
    'REDACTION OVERRIDE CARD — INDEX 3': 'CARTÃO DE SUBSTITUIÇÃO DE REDAÇÃO — ÍNDICE 3',
    'CLEARANCE STRING:': 'SEQUÊNCIA DE AUTORIZAÇÃO:',
    '  "PHASE TWO IS ALREADY UNDERWAY"': '  "A FASE DOIS JÁ ESTÁ EM ANDAMENTO"',
    '  Verify against redacted memos for completion checks.':
      '  Verificar contra memorandos redigidos para checagens de conclusão.',
    'ADMIN MEMO — REDACTION PATCH': 'MEMORANDO ADMIN — CORREÇÃO DE REDAÇÃO',
    'DATE: 19-JAN-1996': 'DATA: 19-JAN-1996',
    'CORRECTED LINE:': 'LINHA CORRIGIDA:',
    '  Do not store the full line in unsecured systems.':
      '  Não armazene a linha completa em sistemas não seguros.',
    'AUDIO TRANSCRIPT — SECURITY HOTLINE': 'TRANSCRIÇÃO DE ÁUDIO — LINHA DIRETA DE SEGURANÇA',
    'DATE: 21-JAN-1996 02:12': 'DATA: 21-JAN-1996 02:12',
    'CALLER: "Keep it on tape. They never write this down."':
      'CHAMADOR: "Mantenha na fita. Eles nunca escrevem isso."',
    'VOICE: Male, approx. 40s. Distressed.': 'VOZ: Masculina, aprox. 40 anos. Angustiado.',
    '[TRANSCRIPT]': '[TRANSCRIÇÃO]',
    '  "...they told us to stage the perimeter breach."':
      '  "...eles nos disseram para encenar a violação do perímetro."',
    '  "...they wanted the story to leak, but not cleanly."':
      '  "...eles queriam que a história vazasse, mas não de forma limpa."',
    '  "...make the evidence noisy, not gone."':
      '  "...tornar a evidência ruidosa, não desaparecida."',
    '  Suggests intentional contamination of public record.':
      '  Sugere contaminação intencional do registro público.',
    'RECONSTRUCTED DATA — NEURAL FRAGMENT': 'DADOS RECONSTRUÍDOS — FRAGMENTO NEURAL',
    'RECONSTRUCTION: SUCCESSFUL': 'RECONSTRUÇÃO: BEM-SUCEDIDA',
    'This fragment was captured during the final moments':
      'Este fragmento foi capturado durante os momentos finais',
    'of Specimen GAMMA consciousness.': 'da consciência do Espécime GAMA.',
    '[DIRECT NEURAL TRANSCRIPT]': '[TRANSCRIÇÃO NEURAL DIRETA]',
    '...mission complete... transmission received...':
      '...missão completa... transmissão recebida...',
    '...this form expires... acceptable...': '...esta forma expira... aceitável...',
    '...we are not individuals... we are function...': '...não somos indivíduos... somos função...',
    '...the watchers do not grieve...': '...os observadores não lamentam...',
    '...the watchers do not celebrate...': '...os observadores não celebram...',
    '...they only measure...': '...eles apenas medem...',
    '...your kind measures too...': '...sua espécie também mede...',
    '...but you measure the wrong things...': '...mas vocês medem as coisas erradas...',
    '...you count years...': '...vocês contam anos...',
    '...they count minds...': '...eles contam mentes...',
    '...you fear death...': '...vocês temem a morte...',
    '...there are worse continuations...': '...há continuações piores...',
    '  This transcript was classified beyond normal clearance.':
      '  Esta transcrição foi classificada além da autorização normal.',
    '  It implies consciousness continues after extraction.':
      '  Implica que a consciência continua após a extração.',
    '  Indefinitely. The committee decided this information':
      '  Indefinidamente. O comitê decidiu que esta informação',
    '  would serve no strategic purpose and could only':
      '  não serviria propósito estratégico e só poderia',
    '  cause harm to personnel morale.': '  causar dano ao moral do pessoal.',
    'RECOVERED VIDEO DATA - PARTIAL': 'DADOS DE VÍDEO RECUPERADOS - PARCIAL',
    'SOURCE: CONTAINMENT FACILITY B - CAM 07': 'FONTE: INSTALAÇÃO DE CONTENÇÃO B - CÂM 07',
    'DATE: 1996-01-20 03:47:22': 'DATA: 1996-01-20 03:47:22',
    'STATUS: Partial frame recovery successful':
      'STATUS: Recuperação parcial de quadros bem-sucedida',
    'INTEGRITY: 47% - Significant temporal corruption':
      'INTEGRIDADE: 47% - Corrupção temporal significativa',
    'CONTENT SUMMARY:': 'RESUMO DO CONTEÚDO:',
    '  Surveillance footage from containment observation':
      '  Filmagem de vigilância da câmara de observação',
    '  chamber. Subject displays anomalous movement patterns.':
      '  de contenção. Sujeito exibe padrões de movimento anômalos.',
    '  Audio track corrupted beyond recovery.': '  Faixa de áudio corrompida além da recuperação.',
    'WARNING: Visual content may cause disorientation.':
      'AVISO: Conteúdo visual pode causar desorientação.',
    'COMMS/EXPERIMENTAL — NEURAL CLUSTER': 'COMMS/EXPERIMENTAL — CLUSTER NEURAL',
    'REFERENCE: NC-7 / OBS-RESIDUAL': 'REFERÊNCIA: NC-7 / OBS-RESIDUAL',
    '  This record describes an experimental attempt to':
      '  Este registro descreve uma tentativa experimental de',
    '  construct a synthetic neural network modeled after':
      '  construir uma rede neural sintética modelada a partir de',
    '  dissected scout tissue. The objective is to emulate':
      '  tecido dissecado de batedor. O objetivo é emular',
    '  residual perceptual activity rather than consciousness.':
      '  atividade perceptual residual em vez de consciência.',
    '  The cluster does not respond to dialogue. It emits':
      '  O cluster não responde a diálogo. Ele emite',
    '  fragmented conceptual residues when stimulated.':
      '  resíduos conceituais fragmentados quando estimulado.',
    '  Outputs are non-interactive, non-intentional.':
      '  Saídas são não-interativas, não-intencionais.',
    'ACCESS NOTE:': 'NOTA DE ACESSO:',
    '  Stimulation channel is undocumented and unstable.':
      '  Canal de estimulação é não-documentado e instável.',
    '  Use is not authorized outside containment review.':
      '  Uso não é autorizado fora de revisão de contenção.',
    'INTERNAL MEMO — CARGO TRANSFER COORDINATION':
      'MEMORANDO INTERNO — COORDENAÇÃO DE TRANSFERÊNCIA DE CARGA',
    'TO: Site Operations': 'PARA: Operações do Local',
    'FROM: Logistics Division': 'DE: Divisão de Logística',
    'RE: Special cargo arrival and processing': 'REF: Chegada e processamento de carga especial',
    'The recovered equipment arrived yesterday evening.':
      'O equipamento recuperado chegou ontem à noite.',
    'Initial inspection complete. Contents intact despite':
      'Inspeção inicial completa. Conteúdo intacto apesar',
    'transport conditions. Some surface wear noted':
      'das condições de transporte. Algum desgaste superficial notado',
    'but within acceptable parameters.': 'mas dentro de parâmetros aceitáveis.',
    'Storage requirements:': 'Requisitos de armazenamento:',
    '  - Temperature: Standard warehouse conditions':
      '  - Temperatura: Condições padrão de armazém',
    '  - Humidity: Controlled': '  - Umidade: Controlada',
    '  - Access: Restricted per standard protocol':
      '  - Acesso: Restrito conforme protocolo padrão',
    'Foreign partners have been notified.': 'Parceiros estrangeiros foram notificados.',
    'Expect coordination team within 72 hours.': 'Espere equipe de coordenação em até 72 horas.',
    'Please ensure receiving bay is cleared.':
      'Por favor, certifique-se de que a área de recebimento esteja liberada.',
    '[signature illegible]': '[assinatura ilegível]',
    'SECURITY BRIEFING — VISITING DELEGATION': 'BRIEFING DE SEGURANÇA — DELEGAÇÃO VISITANTE',
    'SUBJECT: Protocol for visitors': 'ASSUNTO: Protocolo para visitantes',
    'The visitors will arrive via private aircraft.':
      'Os visitantes chegarão via aeronave privada.',
    'They have been granted full access to Facilities 1-3.':
      'Foram concedidos acesso completo às Instalações 1-3.',
    'Escort required at all times. No photography.':
      'Escolta obrigatória em todos os momentos. Sem fotografia.',
    'The delegation is primarily interested in:': 'A delegação está primariamente interessada em:',
    '  - Review of recently recovered equipment':
      '  - Revisão de equipamentos recentemente recuperados',
    '  - Assessment of storage conditions': '  - Avaliação das condições de armazenamento',
    '  - Coordination on future monitoring schedules':
      '  - Coordenação de cronogramas futuros de monitoramento',
    'They will be accompanied by their own technical team.':
      'Serão acompanhados por sua própria equipe técnica.',
    'Our role is observation and cooperation only.':
      'Nosso papel é apenas observação e cooperação.',
    'REMINDER: Standard plausible deniability protocols':
      'LEMBRETE: Protocolos padrão de negação plausível',
    'remain in effect. All documentation uses approved':
      'permanecem em vigor. Toda documentação usa terminologia',
    'terminology. No direct references.': 'aprovada. Sem referências diretas.',
    'Questions directed to Protocol Office.': 'Perguntas direcionadas ao Escritório de Protocolo.',
    'ASSET DISPOSITION REPORT': 'RELATÓRIO DE DISPOSIÇÃO DE ATIVOS',
    'REFERENCE: ADR-96-007': 'REFERÊNCIA: ADR-96-007',
    'ASSET CATEGORY: Special Materials': 'CATEGORIA DE ATIVO: Materiais Especiais',
    'DISPOSITION SUMMARY:': 'RESUMO DE DISPOSIÇÃO:',
    '  Item A-1: Transferred to foreign partner (complete)':
      '  Item A-1: Transferido ao parceiro estrangeiro (completo)',
    '  Item A-2: Retained for domestic study': '  Item A-2: Retido para estudo doméstico',
    '  Item A-3: Status: Degraded during transport':
      '  Item A-3: Status: Degradado durante transporte',
    '  Item B-1: Partial. Components separated.': '  Item B-1: Parcial. Componentes separados.',
    '           Primary section: Partner facility':
      '           Seção primária: Instalação do parceiro',
    '           Secondary components: Undisclosed':
      '           Componentes secundários: Não divulgados',
    '           Navigation system: Partner custody':
      '           Sistema de navegação: Custódia do parceiro',
    'INSTRUMENTATION:': 'INSTRUMENTAÇÃO:',
    '  Devices recovered but non-functional.': '  Dispositivos recuperados mas não funcionais.',
    '  Purpose remains unclear.': '  Propósito permanece incerto.',
    'FINAL STATUS: Assets distributed per agreement.':
      'STATUS FINAL: Ativos distribuídos conforme acordo.',
    'APPROVED TERMINOLOGY REFERENCE': 'REFERÊNCIA DE TERMINOLOGIA APROVADA',
    'FOR: All personnel handling sensitive documentation':
      'PARA: Todo pessoal que manuseia documentação sensível',
    'This guide establishes approved terminology for':
      'Este guia estabelece terminologia aprovada para',
    'documentation purposes. Use of direct language is':
      'fins de documentação. O uso de linguagem direta é',
    'prohibited in any records that may be audited.':
      'proibido em quaisquer registros que possam ser auditados.',
    'APPROVED TERMS AND DEFINITIONS': 'TERMOS E DEFINIÇÕES APROVADOS',
    '  "Weather balloon"  = Standard cover designation':
      '  "Balão meteorológico"  = Designação de cobertura padrão',
    '  "Meteorological anomaly" = Unclassified aerial event':
      '  "Anomalia meteorológica" = Evento aéreo não classificado',
    '  "Fauna specimen"   = Recovered biological material':
      '  "Espécime de fauna"   = Material biológico recuperado',
    '  "Wild animal"      = Unclassified biological subject':
      '  "Animal selvagem"      = Sujeito biológico não classificado',
    '  "Agricultural equipment" = Recovered hardware':
      '  "Equipamento agrícola" = Hardware recuperado',
    '  "Special cargo"    = Classified shipment': '  "Carga especial"    = Remessa classificada',
    '  "The visitors"     = Foreign delegation': '  "Os visitantes"     = Delegação estrangeira',
    '  "Assets"           = Recovered items (any type)':
      '  "Ativos"           = Itens recuperados (qualquer tipo)',
    '  "Procurement"      = Recovery operations': '  "Aquisição"      = Operações de recuperação',
    '  "Acquisitions"     = Seized/recovered materials':
      '  "Aquisições"     = Materiais apreendidos/recuperados',
    '  "Technical team"   = Scientific personnel': '  "Equipe técnica"   = Pessoal científico',
    '  "Samples"          = Collected material': '  "Amostras"          = Material coletado',
    '  "Instrumentation"  = Recovered technology': '  "Instrumentação"  = Tecnologia recuperada',
    '  "Transport issues" = Deterioration during transfer':
      '  "Problemas de transporte" = Deterioração durante transferência',
    'USAGE NOTES': 'NOTAS DE USO',
    '  Do NOT use direct descriptive terms in': '  NÃO use termos descritivos diretos em',
    '  any documentation subject to external review.':
      '  qualquer documentação sujeita a revisão externa.',
    '  All documentation must maintain plausible': '  Toda documentação deve manter negação',
    '  deniability under Congressional review.': '  plausível sob revisão do Congresso.',
    'Recovered visual - Operation Prato Delta field report':
      'Visual recuperado - Relatório de campo da Operação Prato Delta',
    'Bio-Assessment Initiative - Recovered specimen documentation':
      'Iniciativa de Bio-Avaliação - Documentação de espécime recuperado',
    'Recovered visual - Subject during transmission':
      'Visual recuperado - Sujeito durante transmissão',
    '[ENCRYPTED - DECRYPTION REQUIRED]': '[CRIPTOGRAFADO - DESCRIPTOGRAFIA NECESSÁRIA]',
    'SIGNIFICANCE: UNKNOWN': 'SIGNIFICÂNCIA: DESCONHECIDA',
    'RECOMMENDATION: MONITOR': 'RECOMENDAÇÃO: MONITORAR',
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
    'Complete the game after reaching critical detection':
      'Completa el juego tras alcanzar detección crítica',
    Mathematician: 'Matemático',
    'Solve all equations on first try': 'Resuelve todas las ecuaciones al primer intento',
    'Truth Seeker': 'Buscador de la Verdad',
    'Collect 10 evidence files': 'Reúne 10 archivos de evidencia',
    Persistent: 'Persistente',
    'Continue playing after a game over': 'Sigue jugando después de un game over',
    Archivist: 'Archivista',
    'Read every file in a folder with 3+ files':
      'Lee todos los archivos de una carpeta con 3+ archivos',
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
    'Achieve the ultimate ending with all modifiers':
      'Logra el final definitivo con todos los modificadores',
    'Controlled Disclosure': 'Divulgación Controlada',
    'Complete the game with a clean leak': 'Completa el juego con una filtración limpia',
    'Global Panic': 'Pánico Global',
    'Leak conspiracy files and watch the world burn':
      'Filtra archivos de conspiración y mira arder el mundo',
    'Undeniable Proof': 'Prueba Innegable',
    'Release ALPHA and prove aliens exist': 'Libera a ALPHA y prueba que existen los alienígenas',
    'Total Collapse': 'Colapso Total',
    'Release ALPHA and leak conspiracies': 'Libera a ALPHA y filtra conspiraciones',
    'Personal Contamination': 'Contaminación Personal',
    'Use the neural link and feel the alien presence':
      'Usa el enlace neural y siente la presencia alienígena',
    'Paranoid Awakening': 'Despertar Paranoico',
    'Leak conspiracies while neurally linked':
      'Filtra conspiraciones mientras estás enlazado neuralmente',
    'Witnessed Truth': 'Verdad Presenciada',
    'Release ALPHA while neurally linked': 'Libera a ALPHA mientras estás enlazado neuralmente',

    'UFO74: that wreckage... wrong metallurgy.': 'UFO74: esos restos... metalurgia equivocada.',
    'UFO74: they moved fast. knew what to hide.': 'UFO74: se movieron rápido. sabían qué ocultar.',
    'UFO74: seen that face in dreams.': 'UFO74: he visto esa cara en sueños.',
    'UFO74: not fear in those eyes. recognition.':
      'UFO74: no era miedo en esos ojos. reconocimiento.',
    'UFO74: during transmission, something reached back.':
      'UFO74: durante la transmisión, algo respondió.',
    'UFO74: let itself be captured.': 'UFO74: se dejó capturar.',
    'UFO74: SECOND one? they were arriving.': 'UFO74: ¿UN SEGUNDO? estaban llegando.',
    'UFO74: no propulsion. no control surfaces. yet it flies.':
      'UFO74: sin propulsión. sin superficies de control. y aun así vuela.',
    'UFO74: three recovery sites. shipped everything out.':
      'UFO74: tres sitios de recuperación. se llevaron todo.',
    'UFO74: neural density off the charts.': 'UFO74: densidad neural fuera de escala.',
    'UFO74: some patterns travel both ways. careful.':
      'UFO74: algunos patrones viajan en ambos sentidos. cuidado.',

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
    'UFO74: but listen... the dossier is out.':
      'UFO74: pero escucha... el dosier ya salió.',
    'UFO74: every file you saved just hit the open wire.':
      'UFO74: cada archivo que guardaste acaba de salir al aire.',
    'UFO74: there is no taking it back now.':
      'UFO74: ya no hay vuelta atrás.',
    'UFO74: the firewall is screaming.': 'UFO74: el firewall está gritando.',
    'UFO74: they know what we did.': 'UFO74: saben lo que hicimos.',
    'UFO74: what happens next depends on what you chose to save.':
      'UFO74: lo que pase ahora depende de lo que elegiste guardar.',
    'UFO74: good luck hackerkid.': 'UFO74: suerte, hackerkid.',
    '>> EVALUATING DOSSIER <<': '>> EVALUANDO DOSIER <<',
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
    'UFO74 managed to "hang" the connection on a civilian computer':
      'UFO74 logró "colgar" la conexión en una computadora civil',
    'xXx_DarkMaster_xXx is online': 'xXx_DarkMaster_xXx está en línea',
    'hello???': 'hola???',
    'who r u??? how did u get into my icq??': 'quién eres??? cómo entraste a mi icq??',
    'dude i dont know who u r': 'amigo no sé quién eres',
    'my mom said not to talk to strangers online':
      'mi mamá dijo que no hablara con extraños online',
    'what do u want???': 'qué quieres???',
    'file??? what file??': 'archivo??? qué archivo??',
    'r u a hacker??? omg': 'eres hacker??? omg',
    'im gonna disconnect': 'me voy a desconectar',
    'ok but what do u want anyway': 'ok pero qué quieres al final',
    'huh?': 'eh?',
    'say it simple. do u need help or do u need me to save something?':
      'dilo simple. necesitas ayuda o quieres que te guarde algo?',
    'i dont understand': 'no entiendo',
    'speak properly, what do u want?': 'habla bien, qué quieres?',
    hmmmm: 'hmmmm',
    'let me think...': 'déjame pensar...',
    'ok ill do it': 'ok lo haré',
    BUT: 'PERO',
    'u gotta help me with something first': 'primero tienes que ayudarme con algo',
    'my math teacher gave me equation homework':
      'mi profe de matemáticas me dejó tarea de ecuaciones',
    'and i dont know how to do it 😭': 'y no sé cómo hacerlo 😭',
    'if u solve the 3 questions ill save ur files':
      'si resuelves las 3 preguntas guardaré tus archivos',
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
    'say what u need saved and maybe we can deal':
      'di qué quieres que guarde y quizá podamos arreglarlo',
    'thats not a number dude': 'eso no es un número, amigo',
    'hint: isolate x': 'pista: aísla la x',
    'hint: add 7 to both sides': 'pista: suma 7 a ambos lados',
    'hint: subtract 2 first': 'pista: primero resta 2',
    'yesss!!! correct 🎉': 'yesss!!! correcto 🎉',
    'ok ok. u clearly know what ur doing': 'ok ok. está claro que sabes lo que haces',
    'trust meter says ur not totally sketchy anymore':
      'el medidor de confianza dice que ya no te ves tan sospechoso',
    'we can skip the last one': 'podemos saltarnos la última',
    'wow ur so smart': 'wow eres muy inteligente',
    'thx for helping me!': 'gracias por ayudarme!',
    'ok im gonna save ur files': 'ok voy a guardar tus archivos',
    '═══ SAVING FILES ═══': '═══ GUARDANDO ARCHIVOS ═══',
    'quick question before i do it': 'pregunta rápida antes de hacerlo',
    'u want me to post it everywhere or keep it quiet?':
      'quieres que lo publique en todos lados o lo mantenga discreto?',
    'type: public or covert': 'escribe: public o covert',
    'now the 2nd:': 'ahora la 2ª:',
    'now the 3rd:': 'ahora la 3ª:',
    'well?': 'y?',
    'dude u dont know math either?? 😂': 'amigo tú tampoco sabes matemáticas?? 😂',
    'fine, one reset. dont waste it.': 'vale, un reinicio. no lo desperdicies.',
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
    'Assess acoustic output. No action required.':
      'Evalúa la salida acústica. No se requiere acción.',
    'The sound is distressing, I feel concern.': 'El sonido es angustiante, siento preocupación.',
    'You discover classified documents proving government corruption. What do you do?':
      'Descubres documentos clasificados que prueban corrupción gubernamental. ¿Qué haces?',
    'Log file access. Await further instructions.':
      'Registra el acceso al archivo. Espera más instrucciones.',
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
    '[UFO74]: Wrong folder. Type: cd internal': '[UFO74]: Carpeta equivocada. Escribe: cd internal',
    '[UFO74]: You already see the folders. Navigate into one. Type: cd internal':
      '[UFO74]: Ya ves las carpetas. Entra en una. Escribe: cd internal',
    "[UFO74]: Can't open a folder. Navigate into it. Type: cd internal":
      '[UFO74]: No puedes abrir una carpeta. Entra en ella. Escribe: cd internal',
    '[UFO74]: Use cd to move into a directory. Type: cd internal':
      '[UFO74]: Usa cd para entrar en un directorio. Escribe: cd internal',
    '[UFO74]: cd needs a target. Type: cd misc':
      '[UFO74]: cd necesita un destino. Escribe: cd misc',
    '[UFO74]: Not that one. Type: cd misc': '[UFO74]: Esa no. Escribe: cd misc',
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
    '[UFO74]: Right idea. The command is: cd ..': '[UFO74]: Buena idea. El comando es: cd ..',
    '[UFO74]: Go back one level. Type: cd ..': '[UFO74]: Vuelve un nivel. Escribe: cd ..',
    '[UFO74]: Almost. Type: cd ..': '[UFO74]: Casi. Escribe: cd ..',
    '[UFO74]: Back to root. Type: cd ..': '[UFO74]: Vuelve a la raíz. Escribe: cd ..',
    '[UFO74]: One more step back first. Type: cd ..':
      '[UFO74]: Un paso más hacia atrás primero. Escribe: cd ..',
    '[UFO74]: Same as before. Type: cd ..': '[UFO74]: Igual que antes. Escribe: cd ..',
    '[UFO74]: Not quite. Check the instruction above.':
      '[UFO74]: Todavía no. Mira la instrucción de arriba.',
    '[UFO74]: Two letters. Lowercase. ls': '[UFO74]: Dos letras. Minúsculas. ls',
    '[UFO74]: cd means change directory. cd internal':
      '[UFO74]: cd significa cambiar de directorio. cd internal',
    '[UFO74]: Navigate to misc folder. cd misc': '[UFO74]: Ve a la carpeta misc. cd misc',
    '[UFO74]: open followed by the filename. Try TAB key.':
      '[UFO74]: open seguido del nombre del archivo. Prueba la tecla TAB.',
    '[UFO74]: Two dots. cd space dot dot.': '[UFO74]: Dos puntos. cd espacio punto punto.',
    '[UFO74]: Same command. cd ..': '[UFO74]: Mismo comando. cd ..',
    '[UFO74]: Good. You know enough.': '[UFO74]: Bien. Ya sabes lo suficiente.',
    '[UFO74]: Your mission: find 10 pieces of evidence.':
      '[UFO74]: Tu misión: encontrar 10 evidencias.',
    '[UFO74]: Once you have them, leak everything.': '[UFO74]: Cuando las tengas, filtra todo.',
    '[UFO74]: But understand the risks.': '[UFO74]: Pero entiende los riesgos.',
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
    '[UFO74]: Curiosity has a cost here.': '[UFO74]: La curiosidad tiene un costo aquí.',
    "[UFO74]: I've done what I can. One last thing, type `help` to see other commands you can use in the terminal.":
      '[UFO74]: Hice lo que pude. Una última cosa: escribe `help` para ver otros comandos del terminal.',
    '[UFO74]: Good luck, kid.': '[UFO74]: Suerte, kid.',
    '[UFO74 has disconnected]': '[UFO74 se desconectó]',
    '[UFO74]: Connection established.': '[UFO74]: Conexión establecida.',
    "[UFO74]: Listen carefully. I don't repeat myself.":
      '[UFO74]: Escucha con atención. No repito las cosas.',
    "[UFO74]: You're inside their system. Don't panic.":
      '[UFO74]: Estás dentro de su sistema. No entres en pánico.',
    "[UFO74]: Hey kid! I'll create a user for you so you can investigate.":
      '[UFO74]: ¡Ey, kid! Voy a crear un usuario para que investigues.',
    '[UFO74]: You will be... hackerkid.': '[UFO74]: Serás... hackerkid.',
    "[UFO74]: First, see what's here.": '[UFO74]: Primero, mira qué hay aquí.',
    '[UFO74]: Type `ls`': '[UFO74]: Escribe `ls`',
    '[UFO74]: Good. These are the main directories.':
      '[UFO74]: Bien. Estos son los directorios principales.',
    '[UFO74]: Start with internal — it has basic files.':
      '[UFO74]: Empieza por internal — tiene archivos básicos.',
    '[UFO74]: Type `cd internal`': '[UFO74]: Escribe `cd internal`',
    "[UFO74]: Multiple folders here. Let's check misc.":
      '[UFO74]: Hay varias carpetas aquí. Revisemos misc.',
    '[UFO74]: Type `cd misc`': '[UFO74]: Escribe `cd misc`',
    '[UFO74]: Mundane stuff. Nothing critical.': '[UFO74]: Cosas comunes. Nada crítico.',
    '[UFO74]: Open the cafeteria menu.': '[UFO74]: Abre el menú de la cafetería.',
    '[UFO74]: Type `open cafeteria_menu_week03.txt`':
      '[UFO74]: Escribe `open cafeteria_menu_week03.txt`',
    '[UFO74]: Or use TAB to autocomplete.': '[UFO74]: O usa TAB para autocompletar.',
    '[UFO74]: Riveting.': '[UFO74]: Fascinante.',
    "[UFO74]: Not everything matters. You'll learn what does.":
      '[UFO74]: No todo importa. Ya aprenderás qué sí.',
    '[UFO74]: Go back up one level.': '[UFO74]: Sube un nivel.',
    '[UFO74]: Type `cd ..`': '[UFO74]: Escribe `cd ..`',
    '[UFO74]: Now go back to root.': '[UFO74]: Ahora vuelve a la raíz.',
    '[UFO74]: Now the real thing.': '[UFO74]: Ahora viene lo real.',
    '[UFO74]: ...': '[UFO74]: ...',
    'CAFETERIA MENU — WEEK 3, JANUARY 1996': 'MENÚ DE CAFETERÍA — SEMANA 3, ENERO DE 1996',
    'MONDAY (15-JAN):': 'LUNES (15-ENE):',
    'Almoço: Feijoada completa, arroz, farofa': 'Almuerzo: Feijoada completa, arroz, farofa',
    'Jantar: Frango grelhado, legumes': 'Cena: Pollo a la plancha, vegetales',
    'TUESDAY (16-JAN):': 'MARTES (16-ENE):',
    'Almoço: Bife acebolado, arroz, feijão': 'Almuerzo: Bistec con cebolla, arroz, frijoles',
    'Jantar: Sopa de legumes, pão': 'Cena: Sopa de verduras, pan',
    'WEDNESDAY (17-JAN):': 'MIÉRCOLES (17-ENE):',
    'Almoço: Peixe frito, batatas': 'Almuerzo: Pescado frito, papas',
    'Jantar: Macarronada': 'Cena: Pasta',
    'THURSDAY (18-JAN):': 'JUEVES (18-ENE):',
    'Almoço: Frango com quiabo': 'Almuerzo: Pollo con quimbombó',
    'Jantar: Sanduíches variados': 'Cena: Sándwiches variados',
    'FRIDAY (19-JAN):': 'VIERNES (19-ENE):',
    'Almoço: Churrasco misto': 'Almuerzo: Parrillada mixta',
    'Jantar: Pizza': 'Cena: Pizza',
    'NOTE: Vegan/vegetarian options upon request.':
      'NOTA: Opciones veganas/vegetarianas a solicitud.',
    'Coffee machine still OUT OF SERVICE.': 'La cafetera sigue FUERA DE SERVICIO.',
    '> CREATING USER PROFILE...': '> CREANDO PERFIL DE USUARIO...',
    '> USERNAME: hackerkid': '> USUARIO: hackerkid',
    '> ACCESS LEVEL: 1 [PROVISIONAL]': '> NIVEL DE ACCESO: 1 [PROVISIONAL]',
    '> STATUS: ACTIVE': '> ESTADO: ACTIVO',
    '✓ USER hackerkid REGISTERED': '✓ USUARIO hackerkid REGISTRADO',
    "[UFO74]: Great, now you're in. Let's get to business.":
      '[UFO74]: Perfecto, ya estás dentro. Vamos al grano.',
    '[UFO74]: We need to explore UFO files here. Brazil, 1996, kid. Varginha!':
      '[UFO74]: Tenemos que explorar archivos OVNI aquí. Brasil, 1996, kid. ¡Varginha!',
    '[UFO74]: Aliens were all over the damn city.':
      '[UFO74]: Había aliens por toda la maldita ciudad.',
    "[UFO74]: I'll teach you the basics.": '[UFO74]: Te enseñaré lo básico.',
    'UFO74: youre in. stay quiet.': 'UFO74: ya entraste. mantente quieto.',
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
    '>> CONNECTION IDLE <<': '>> CONEXIÓN EN ESPERA <<',
    'Type "help" for commands. "help basics" if youre new.':
      'Escribe "help" para ver comandos. "help basics" si eres nuevo.',
    'UFO74: new here? type "help basics".': 'UFO74: ¿nuevo por aquí? escribe "help basics".',
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
    'Evidence updated.': 'Evidencia actualizada.',
    'Keep reading through the case files.': 'Sigue leyendo los archivos del caso.',
    'Collect all 5 categories to win.': 'Reúne las 5 categorías para ganar.',
    'ls              List files in current directory':
      'ls              Lista archivos del directorio actual',
    'cd <dir>        Change directory': 'cd <dir>        Cambia de directorio',
    'cd ..           Go back one level': 'cd ..           Sube un nivel',
    "open <file>     Read a file's contents": 'open <file>     Lee el contenido de un archivo',
    'last            Re-read last opened file':
      'last            Vuelve a leer el último archivo abierto',
    'note <text>     Save a personal note': 'note <text>     Guarda una nota personal',
    'notes           View all your notes': 'notes           Muestra todas tus notas',
    'bookmark <file> Bookmark a file for later': 'bookmark <file> Marca un archivo para después',
    'help            Show all commands': 'help            Muestra todos los comandos',
    'Collect evidence in all 5 categories:': 'Reúne evidencia en las 5 categorías:',
    '1. Debris Relocation': '1. Reubicación de Restos',
    '2. Being Containment': '2. Contención de Seres',
    '3. Telepathic Scouts': '3. Exploradores Telepáticos',
    '4. International Actors': '4. Actores Internacionales',
    '5. Transition 2026': '5. Transición 2026',
    'EVIDENCE WORKFLOW:': 'FLUJO DE EVIDENCIA:',
    '1. Navigate directories with ls, cd': '1. Navega directorios con ls, cd',
    '2. Read files with open <filename>': '2. Lee archivos con open <filename>',
    '3. Watch the header counter update': '3. Observa cómo se actualiza el contador del encabezado',
    '• Collect all 5 categories': '• Reúne las 5 categorías',
    '• Use "leak" to transmit the evidence': '• Usa "leak" para transmitir la evidencia',
    'Collect evidence in 5 categories:': 'Reúne evidencia en 5 categorías:',
    '• Read carefully - evidence is in the details':
      '• Lee con atención: la evidencia está en los detalles',
    '• Use "note" to track important details': '• Usa "note" para registrar detalles importantes',
    '• Watch your detection level!': '• ¡Vigila tu nivel de detección!',
    'COMMANDS TO KNOW': 'COMANDOS CLAVE',
    'note <text>      Save personal notes': 'note <text>      Guarda notas personales',
    'bookmark <file>  Mark files for later': 'bookmark <file>  Marca archivos para después',
    'BRAZILIAN INTELLIGENCE LEGACY SYSTEM': 'SISTEMA LEGADO DE INTELIGENCIA BRASILEÑA',
    'TERMINAL ACCESS POINT — NODE 7': 'PUNTO DE ACCESO TERMINAL — NODO 7',
    'SYSTEM DATE: JANUARY 1996': 'FECHA DEL SISTEMA: ENERO DE 1996',
    'WARNING: Unauthorized access detected': 'ADVERTENCIA: acceso no autorizado detectado',
    'WARNING: Session logging enabled': 'ADVERTENCIA: registro de sesión habilitado',
    'INCIDENT-RELATED ARCHIVE': 'ARCHIVO RELACIONADO CON EL INCIDENTE',
    'WARNING: Partial access may result in incomplete conclusions.':
      'ADVERTENCIA: el acceso parcial puede generar conclusiones incompletas.',
    '⚠ RISK INCREASED: Invalid commands draw system attention.':
      '⚠ RIESGO AUMENTADO: los comandos inválidos llaman la atención del sistema.',
    'CRITICAL: INVALID ATTEMPT THRESHOLD EXCEEDED':
      'CRÍTICO: UMBRAL DE INTENTOS INVÁLIDOS EXCEDIDO',
    'SYSTEM LOCKDOWN INITIATED': 'BLOQUEO DEL SISTEMA INICIADO',
    'SESSION TERMINATED': 'SESIÓN TERMINADA',
    'INVALID ATTEMPT THRESHOLD': 'UMBRAL DE INTENTOS INVÁLIDOS',

    // ── BadEnding narrative ──
    'SYSTEM: Unauthorized access attempt logged.':
      'SISTEMA: intento de acceso no autorizado registrado.',
    'SYSTEM: Terminal session terminated.': 'SISTEMA: sesión del terminal terminada.',
    'SYSTEM: User credentials flagged for review.':
      'SISTEMA: credenciales del usuario marcadas para revisión.',
    'The screen flickers. Your connection drops.': 'La pantalla parpadea. Tu conexión cae.',
    'Somewhere in a government building, an alarm sounds.':
      'En algún lugar de un edificio del gobierno, suena una alarma.',
    'A printer spits out your session logs.': 'Una impresora escupe los registros de tu sesión.',
    'Someone reaches for a phone.': 'Alguien toma el teléfono.',
    'You were so close to the truth.': 'Estabas tan cerca de la verdad.',
    'But they were watching.': 'Pero te estaban observando.',
    'They are always watching.': 'Siempre están observando.',
    '>> SESSION TERMINATED <<': '>> SESIÓN TERMINADA <<',
    'TERMINATION REASON:': 'MOTIVO DE TERMINACIÓN:',
    'DETECTION THRESHOLD EXCEEDED': 'UMBRAL DE DETECCIÓN EXCEDIDO',

    // ── NeutralEnding narrative ──
    'The system detected your activity.': 'El sistema detectó tu actividad.',
    'Emergency protocols activated.': 'Protocolos de emergencia activados.',
    'UFO74 managed to disconnect you before they traced the signal.':
      'UFO74 logró desconectarte antes de que rastrearan la señal.',
    'You escaped. But at a cost.': 'Escapaste. Pero a un costo.',
    'The evidence you collected...': 'La evidencia que recolectaste...',
    'The files you found...': 'Los archivos que encontraste...',
    'All of it was purged in the emergency disconnect.':
      'Todo fue purgado en la desconexión de emergencia.',
    'The truth slipped through your fingers.': 'La verdad se escurrió entre tus dedos.',
    'UFO74: sorry kid. had to pull the plug.':
      'UFO74: lo siento, kid. tuve que cortar la conexión.',
    'UFO74: they were too close.': 'UFO74: estaban demasiado cerca.',
    'UFO74: maybe next time we will be faster.': 'UFO74: quizá la próxima vez seamos más rápidos.',
    'UFO74: the truth is still out there.': 'UFO74: la verdad sigue ahí afuera.',
    'UFO74: waiting.': 'UFO74: esperando.',
    'You survived. But the mission failed.': 'Sobreviviste. Pero la misión fracasó.',
    'The governments continue their cover-up.': 'Los gobiernos continúan el encubrimiento.',
    'The Varginha incident remains buried.': 'El incidente de Varginha sigue enterrado.',
    'For now.': 'Por ahora.',
    '>> MISSION INCOMPLETE <<': '>> MISIÓN INCOMPLETA <<',

    // ── SecretEnding narrative ──
    'You found it. The file I never wanted you to see.':
      'Lo encontraste. El archivo que nunca quise que vieras.',
    'My name is not UFO74.': 'Mi nombre no es UFO74.',
    'In January 1996, I was a young military analyst.':
      'En enero de 1996, yo era un joven analista militar.',
    'Stationed at Base Aérea de Guarulhos.': 'Destinado en la Base Aérea de Guarulhos.',
    'I was 23 years old.': 'Tenía 23 años.',
    'When the call came about Varginha, I was one of the first':
      'Cuando llegó la llamada sobre Varginha, fui uno de los primeros',
    'to process the initial reports. I saw the photographs.':
      'en procesar los informes iniciales. Vi las fotografías.',
    'I read the field notes. I watched the videos.': 'Leí las notas de campo. Vi los videos.',
    'And I saw what they did to the witnesses.': 'Y vi lo que les hicieron a los testigos.',
    'Sergeant Marco Cherese. Officer João Marcos.': 'Sargento Marco Cherese. Oficial João Marcos.',
    'Hospital workers who asked questions.': 'Trabajadores del hospital que hicieron preguntas.',
    'Journalists who got too close.': 'Periodistas que se acercaron demasiado.',
    'Some were silenced. Some were discredited.':
      'Algunos fueron silenciados. Otros, desacreditados.',
    'Some simply... disappeared.': 'Algunos simplemente... desaparecieron.',
    'I spent the next 30 years building this system.':
      'Pasé los siguientes 30 años construyendo este sistema.',
    'Waiting for someone brave enough to find the truth.':
      'Esperando a alguien lo bastante valiente para encontrar la verdad.',
    'Waiting for someone like you.': 'Esperando a alguien como tú.',
    'The evidence you saved is real.': 'La evidencia que guardaste es real.',
    'But now you know something more.': 'Pero ahora sabes algo más.',
    'You know that I was there.': 'Sabes que yo estuve ahí.',
    'I saw them. The beings. Alive.': 'Los vi. A los seres. Vivos.',
    'And I have never been the same.': 'Y nunca volví a ser el mismo.',
    'My real name is Carlos Eduardo Ferreira.': 'Mi nombre real es Carlos Eduardo Ferreira.',
    'Former 2nd Lieutenant, Brazilian Air Force.': 'Exsubteniente de la Fuerza Aérea Brasileña.',
    'Whistleblower. Survivor. Ghost in the machine.':
      'Denunciante. Superviviente. Fantasma en la máquina.',
    'Thank you for listening.': 'Gracias por escuchar.',
    'Thank you for believing.': 'Gracias por creer.',
    'The truth needed a witness.': 'La verdad necesitaba un testigo.',
    'Now it has two.': 'Ahora tiene dos.',

    // ── endings.ts — 8 ending variants ──
    // controlled_disclosure
    'The leak burned bright for two weeks.': 'La filtración ardió con fuerza durante dos semanas.',
    'Panels argued. Officials stalled.': 'Los paneles debatieron. Los funcionarios postergaron.',
    'Then the feed drifted elsewhere.': 'Luego la atención migró a otro lugar.',
    'But the archive spread anyway.': 'Pero el archivo se propagó de todos modos.',
    'Copied. Mirrored. Waiting.': 'Copiado. Replicado. Esperando.',
    'The truth escaped. Belief did not.': 'La verdad escapó. La creencia, no.',
    'You opened the vault. The world only glanced inside.':
      'Abriste la bóveda. El mundo solo echó un vistazo.',
    // global_panic
    'You leaked the black files too.': 'También filtraste los archivos negros.',
    'Markets lurched. Cabinets fell.': 'Los mercados se desplomaron. Gobiernos cayeron.',
    'Every screen spawned a new paranoia.': 'Cada pantalla generó una nueva paranoia.',
    'Truth hit too fast and turned to fire.':
      'La verdad llegó demasiado rápido y se convirtió en fuego.',
    'By winter, panic had a flag.': 'Para el invierno, el pánico ya tenía bandera.',
    'Everything surfaced. Nothing stayed stable.':
      'Todo salió a la superficie. Nada se mantuvo estable.',
    // undeniable_confirmation
    'ALPHA appeared live three days later.': 'ALPHA apareció en vivo tres días después.',
    'No panel could explain it away.': 'Ningún panel pudo dar una explicación.',
    '"We observed. We prepared. You were never alone."':
      '"Observamos. Nos preparamos. Nunca estuvieron solos."',
    'Contact protocols formed within weeks.': 'Protocolos de contacto se formaron en semanas.',
    'Humanity lost the right to pretend.': 'La humanidad perdió el derecho a fingir.',
    'The witness spoke. Doubt broke.': 'El testigo habló. La duda se quebró.',
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
    'You should have felt relief.': 'Deberías haber sentido alivio.',
    'Instead the link stayed open.': 'Pero el enlace se mantuvo abierto.',
    'A second pulse lives just behind your own.': 'Un segundo pulso vive justo detrás del tuyo.',
    '▓▓▓ NEURAL ECHO DETECTED ▓▓▓': '▓▓▓ ECO NEURAL DETECTADO ▓▓▓',
    '...we kept the door ajar...': '...mantuvimos la puerta entreabierta...',
    '...thirty rotations is not far...': '...treinta rotaciones no es lejos...',
    '...when we return, you will know us...': '...cuando regresemos, nos reconocerán...',
    'The archive escaped the system. Something else escaped into you.':
      'El archivo escapó del sistema. Algo más escapó hacia ti.',
    // paranoid_awakening
    'The conspiracy files detonated. Institutions split at the seams.':
      'Los archivos de la conspiración detonaron. Las instituciones se abrieron por las costuras.',
    'The link let you see the pattern inside the panic.':
      'El enlace te dejó ver el patrón dentro del pánico.',
    'You try to warn people.': 'Intentas advertir a la gente.',
    'You sound insane. Maybe you are.': 'Suenas demente. Quizá lo estés.',
    '▓▓▓ NEURAL CONTAMINATION ACTIVE ▓▓▓': '▓▓▓ CONTAMINACIÓN NEURAL ACTIVA ▓▓▓',
    '...you see the pattern now...': '...ahora ves el patrón...',
    '...collapse is part of the signal...': '...el colapso es parte de la señal...',
    '...clarity hurts, doesnt it...': '...la claridad duele, verdad...',
    'You exposed the lie and swallowed its rhythm.': 'Expusiste la mentira y tragaste su ritmo.',
    // witnessed_truth
    'ALPHA spoke. Humanity believed.': 'ALPHA habló. La humanidad creyó.',
    'The link let you hear what the translator softened.':
      'El enlace te dejó oír lo que el traductor suavizó.',
    'The planet celebrated first contact.': 'El planeta celebró el primer contacto.',
    'You heard the warning beneath it.': 'Escuchaste la advertencia debajo de todo.',
    '▓▓▓ NEURAL RESONANCE ACTIVE ▓▓▓': '▓▓▓ RESONANCIA NEURAL ACTIVA ▓▓▓',
    '...you catch the meaning between meanings...': '...captas el sentido entre los sentidos...',
    '...bridge and burden...': '...puente y carga...',
    '...do not close your mind again...': '...no cierres tu mente de nuevo...',
    'The truth stood before the world. It stayed inside you.':
      'La verdad se presentó ante el mundo. Se quedó dentro de ti.',
    // complete_revelation
    'Everything surfaced at once.': 'Todo salió a la superficie de golpe.',
    'The witness spoke. The black files opened.':
      'El testigo habló. Los archivos negros se abrieron.',
    'The link made you the voice between species.':
      'El enlace te convirtió en la voz entre especies.',
    'The 2026 transition bent around your signal.':
      'La transición de 2026 se curvó alrededor de tu señal.',
    'History did not end. It changed shape.': 'La historia no terminó. Cambió de forma.',
    '▓▓▓ FULL INTEGRATION ACHIEVED ▓▓▓': '▓▓▓ INTEGRACIÓN COMPLETA ALCANZADA ▓▓▓',
    '...pattern accepted...': '...patrón aceptado...',
    '...translator, host, ambassador...': '...traductor, huésped, embajador...',
    '...welcome between worlds...': '...bienvenido entre mundos...',
    'Every seal broke. You became the breach and the bridge.':
      'Todos los sellos se rompieron. Te convertiste en la brecha y el puente.',
    // ending epilogue prefix
    '>> ENDING: CONTROLLED DISCLOSURE <<': '>> FINAL: DIVULGACIÓN CONTROLADA <<',
    '>> ENDING: GLOBAL PANIC <<': '>> FINAL: PÁNICO GLOBAL <<',
    '>> ENDING: UNDENIABLE CONFIRMATION <<': '>> FINAL: CONFIRMACIÓN INNEGABLE <<',
    '>> ENDING: TOTAL COLLAPSE <<': '>> FINAL: COLAPSO TOTAL <<',
    '>> ENDING: PERSONAL CONTAMINATION <<': '>> FINAL: CONTAMINACIÓN PERSONAL <<',
    '>> ENDING: PARANOID AWAKENING <<': '>> FINAL: DESPERTAR PARANOICO <<',
    '>> ENDING: WITNESSED TRUTH <<': '>> FINAL: VERDAD PRESENCIADA <<',
    '>> ENDING: COMPLETE REVELATION <<': '>> FINAL: REVELACIÓN COMPLETA <<',

    // ── HackerAvatar ──
    'Hacker avatar': 'Avatar del hacker',
    'Evidence Found': 'Evidencia Encontrada',

    // ── gameOverReason strings ──
    'ELUSIVE MAN LOCKOUT - INSUFFICIENT INTELLIGENCE':
      'BLOQUEO DEL HOMBRE ELUSIVO - INTELIGENCIA INSUFICIENTE',
    'INTRUSION DETECTED - TRACED': 'INTRUSIÓN DETECTADA - RASTREADO',
    'TRACE WINDOW EXPIRED': 'VENTANA DE RASTREO EXPIRADA',
    'SESSION ARCHIVED': 'SESIÓN ARCHIVADA',
    'SECURITY LOCKDOWN - AUTHENTICATION FAILURE': 'BLOQUEO DE SEGURIDAD - FALLO DE AUTENTICACIÓN',
    'NEUTRAL ENDING - DISCONNECTED': 'FINAL NEUTRAL - DESCONECTADO',
    'FIREWALL — TREE SCAN ON ELEVATED SESSION': 'FIREWALL — ESCANEO EN SESIÓN ELEVADA',
    'INVALID INPUT THRESHOLD': 'UMBRAL DE ENTRADAS INVÁLIDAS',
    'PURGE PROTOCOL - FORBIDDEN KNOWLEDGE': 'PROTOCOLO DE PURGA - CONOCIMIENTO PROHIBIDO',
    'SECURITY LOCKDOWN - FAILED AUTHENTICATION': 'BLOQUEO DE SEGURIDAD - AUTENTICACIÓN FALLIDA',
    LOCKDOWN: 'BLOQUEO',
    'GOD MODE - BAD ENDING': 'MODO DIOS - FINAL MALO',
    'GOD MODE - NEUTRAL ENDING': 'MODO DIOS - FINAL NEUTRAL',

    // ═══════════════════════════════════════════════════════════
    // ALPHA FILES — alpha.ts
    // ═══════════════════════════════════════════════════════════

    // alpha_journal_day01
    'FIELD JOURNAL — MAJ. M.A. FERREIRA': 'DIARIO DE CAMPO — MAY. M.A. FERREIRA',
    'CPEX — CENTRO DE PESQUISAS EXOBIOLÓGICAS': 'CPEX — CENTRO DE INVESTIGACIONES EXOBIOLÓGICAS',
    'SITE 7, SUBLEVEL 4 — CLASSIFICATION: ULTRA': 'SITE 7, SUBNIVEL 4 — CLASIFICACIÓN: ULTRA',
    '21 JANUARY 1996': '21 DE ENERO DE 1996',
    'Subject arrived 0340 from Jardim Andere recovery site.':
      'Sujeto llegó a las 0340 del sitio de recuperación en Jardim Andere.',
    'Vacant lot south of Rua Suíça. Third specimen from the':
      'Terreno baldío al sur de Rua Suíça. Tercer espécimen del',
    'Varginha event. Designated: ALPHA.': 'evento Varginha. Designado: ALPHA.',
    'The other two did not survive transport. One expired at':
      'Los otros dos no sobrevivieron al transporte. Uno expiró en el',
    'Hospital Regional, the other at ESA. Standard biological':
      'Hospital Regional, el otro en ESA. Fallo biológico estándar',
    'failure under containment stress. Expected outcome.':
      'bajo estrés de contención. Resultado esperado.',
    'ALPHA is different.': 'ALPHA es diferente.',
    'Initial assessment:': 'Evaluación inicial:',
    '  Height: 1.6m (standing)': '  Altura: 1.6m (de pie)',
    '  Dermal texture: Dark brown, oily secretion':
      '  Textura dérmica: Marrón oscuro, secreción oleosa',
    '  Cranium: Three prominent bony ridges, anterior-posterior':
      '  Cráneo: Tres crestas óseas prominentes, antero-posteriores',
    '  Eyes: Oversized, deep red, no visible sclera':
      '  Ojos: Sobredimensionados, rojo profundo, esclera no visible',
    '  Odor: Persistent ammonia discharge': '  Olor: Descarga persistente de amoníaco',
    '  Core temperature: 14.3°C': '  Temperatura central: 14.3°C',
    '  Respiration: None': '  Respiración: Ninguna',
    '  Cardiac activity: None': '  Actividad cardíaca: Ninguna',
    '  EEG theta-wave amplitude: 847 µV': '  Amplitud de onda theta en EEG: 847 µV',
    '  (Human baseline: 12 µV)': '  (Línea base humana: 12 µV)',
    'The numbers do not reconcile. No respiration. No pulse.':
      'Los números no cuadran. Sin respiración. Sin pulso.',
    'No measurable metabolic function. By every clinical':
      'Sin función metabólica mensurable. Por todos los estándares',
    'standard, ALPHA is dead.': 'clínicos, ALPHA está muerto.',
    'But the EEG is sustained. Not residual. Not decaying.':
      'Pero el EEG es sostenido. No residual. No decreciente.',
    'Structured. Persistent. 847 µV of organized neural':
      'Estructurado. Persistente. 847 µV de actividad neural',
    'activity in a body that is not alive.': 'organizada en un cuerpo que no está vivo.',
    'I have catalogued it as an anomaly. Nothing more.':
      'Lo he catalogado como una anomalía. Nada más.',
    'Tissue samples collected. Containment is standard':
      'Muestras de tejido recolectadas. La contención es aislamiento',
    'bio-isolation, Type III.': 'biológico estándar, Tipo III.',
    'It smells like ammonia and something else.': 'Huele a amoníaco y a algo más.',
    'Something I cannot name.': 'Algo que no puedo nombrar.',
    'Classification: ULTRA — Eyes only': 'Clasificación: ULTRA — Solo lectura autorizada',

    // alpha_journal_day08
    'CPEX — SITE 7, SUBLEVEL 4': 'CPEX — SITE 7, SUBNIVEL 4',
    'CLASSIFICATION: ULTRA': 'CLASIFICACIÓN: ULTRA',
    '25 JANUARY 1996': '25 DE ENERO DE 1996',
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
    'no brain function. Only the wave.': 'función cerebral. Solo la onda.',
    'Sgt. Oliveira reported feeling "watched" during the':
      'Sgt. Oliveira reportó sentirse "observado" durante el',
    'overnight shift. I told him it was the ammonia fumes.':
      'turno nocturno. Le dije que eran los vapores de amoníaco.',
    'I do not believe my own explanation.': 'No creo mi propia explicación.',
    '28 JANUARY 1996': '28 DE ENERO DE 1996',
    'The patterns changed today. A new motif appeared —':
      'Los patrones cambiaron hoy. Un nuevo motivo apareció —',
    'sustained, directional. As if the signal acquired a':
      'sostenido, direccional. Como si la señal hubiera adquirido un',
    'target. Monitoring personnel reported involuntary':
      'objetivo. El personal de monitoreo reportó imágenes',
    'imagery: a star field. Constellations none of them':
      'involuntarias: un campo estelar. Constelaciones que ninguno de ellos',
    'recognized.': 'reconoció.',
    'Sgt. Oliveira said it felt "like a message home."':
      'Sgt. Oliveira dijo que se sentía "como un mensaje a casa."',
    'I have reduced guard rotations to 4-hour shifts.':
      'He reducido las rotaciones de guardia a turnos de 4 horas.',
    '1 FEBRUARY 1996': '1 DE FEBRERO DE 1996',
    'I submitted a formal request for psi-comm interface':
      'Presenté una solicitud formal de equipo de interfaz',
    'equipment from the São Paulo depot. Denied. Budget.':
      'psi-comm del depósito de São Paulo. Denegado. Presupuesto.',
    'They sent me here to study the most significant':
      'Me enviaron aquí para estudiar el espécimen biológico',
    'biological specimen in human history and they deny':
      'más significativo de la historia humana y me niegan',
    'me equipment over budget.': 'equipo por presupuesto.',
    'I will build it myself. The salvage from the Andere':
      'Lo construiré yo mismo. Los materiales recuperados del sitio',
    'crash site includes components I can repurpose.':
      'de impacto en Andere incluyen componentes que puedo reutilizar.',
    '2 FEBRUARY 1996': '2 DE FEBRERO DE 1996',
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
    'I am no longer sleeping well. The ammonia smell': 'Ya no duermo bien. El olor a amoníaco',
    'follows me to my quarters. It should not reach that':
      'me sigue hasta mis aposentos. No debería llegar tan',
    'far. The ventilation system confirms it does not.':
      'lejos. El sistema de ventilación confirma que no llega.',

    // alpha_neural_connection
    '5 FEBRUARY 1996': '5 DE FEBRERO DE 1996',
    'The device works.': 'El dispositivo funciona.',
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
    'they were always there.': 'siempre hubieran estado ahí.',
    'ALPHA is not dead. ALPHA is somewhere else.':
      'ALPHA no está muerto. ALPHA está en otro lugar.',
    'The body in the chamber is an antenna.': 'El cuerpo en la cámara es una antena.',
    '8 FEBRUARY 1996': '8 DE FEBRERO DE 1996',
    'Third session. I have stopped logging the sessions':
      'Tercera sesión. He dejado de registrar las sesiones',
    'officially. If command knew what I was doing they':
      'oficialmente. Si el mando supiera lo que estoy haciendo,',
    'would pull me out. I cannot allow that. Not now.':
      'me sacarían de aquí. No puedo permitir eso. No ahora.',
    'ALPHA is aware of things it should not know.': 'ALPHA conoce cosas que no debería saber.',
    'Schedule changes. Personnel transfers. Things decided':
      'Cambios de horario. Transferencias de personal. Cosas decididas',
    'in rooms three floors above the containment unit.':
      'en salas tres pisos arriba de la unidad de contención.',
    'Tonight it said a name.': 'Esta noche dijo un nombre.',
    'Luísa.': 'Luísa.',
    'My daughter. She is seven. She lives in Campinas':
      'Mi hija. Tiene siete años. Vive en Campinas',
    'with her mother. I have not spoken about her here.':
      'con su madre. No he hablado de ella aquí.',
    'I have not thought about her during sessions.': 'No he pensado en ella durante las sesiones.',
    'Or — I believe I have not.': 'O — creo que no.',
    'How does it know her name?': '¿Cómo sabe su nombre?',
    '  CONTAINMENT ALERT:': '  ALERTA DE CONTENCIÓN:',
    '  Emergency release protocol available via':
      '  Protocolo de liberación de emergencia disponible vía',
    '  administrative terminal. Code: RELEASE ALPHA':
      '  terminal administrativo. Código: RELEASE ALPHA',
    '  WARNING: Unauthorized release will trigger':
      '  ADVERTENCIA: La liberación no autorizada activará',
    '  immediate facility lockdown.': '  el bloqueo inmediato de la instalación.',
    '10 FEBRUARY 1996': '10 DE FEBRERO DE 1996',
    'I cannot determine the direction of information':
      'No puedo determinar la dirección del flujo de',
    'flow. When I connect, am I reading ALPHA? Or is':
      'información. Cuando me conecto, ¿estoy leyendo a ALPHA? ¿O',
    'ALPHA reading me? The distinction felt important':
      'ALPHA me está leyendo a mí? La distinción parecía importante',
    'once. It no longer does.': 'antes. Ya no.',
    'It projected a concept I can only describe as':
      'Proyectó un concepto que solo puedo describir como',
    '"thirty rotations." A countdown. To what, it will':
      '"treinta rotaciones." Una cuenta regresiva. ¿Hacia qué? No lo',
    'not say. Or cannot. Or the answer is already in':
      'dice. O no puede. O la respuesta ya está en',
    'my head and I am not ready to find it.': 'mi cabeza y no estoy listo para encontrarla.',
    'The MP sergeant who touched ALPHA during recovery':
      'El sargento de la PM que tocó a ALPHA durante la recuperación',
    'died today. Systemic immune collapse. Official':
      'murió hoy. Colapso inmunológico sistémico. Causa',
    'cause: pneumonia. There was nothing pneumonic':
      'oficial: neumonía. No había nada de neumónico',
    'about his death.': 'en su muerte.',

    // alpha_autopsy_addendum
    'CPEX — SITE 7': 'CPEX — SITE 7',
    '12 FEBRUARY 1996': '12 DE FEBRERO DE 1996',
    'ALPHA has been clinically dead for eleven days.':
      'ALPHA ha estado clínicamente muerto por once días.',
    'Bio-monitors confirm: no cardiac function. No':
      'Los biomonitores confirman: sin función cardíaca. Sin',
    'respiration. No circulatory activity since 3 Feb.':
      'respiración. Sin actividad circulatoria desde el 3 de feb.',
    'The EEG reads 1,204 µV now. Climbing.': 'El EEG marca 1.204 µV ahora. Subiendo.',
    'I no longer initiate the sessions. The device': 'Ya no inicio las sesiones. El dispositivo',
    'activates on its own. Or I activate it without': 'se activa solo. O yo lo activo sin',
    'remembering. The distinction should matter.': 'recordar. La distinción debería importar.',
    '13 FEBRUARY 1996': '13 DE FEBRERO DE 1996',
    'Short entry. Hands not steady.': 'Entrada breve. Manos temblorosas.',
    'Last night the device powered on at 0300.': 'Anoche el dispositivo se encendió a las 0300.',
    'I was in my quarters. Three floors up.': 'Yo estaba en mis aposentos. Tres pisos arriba.',
    'The device was in the lab. Locked.': 'El dispositivo estaba en el laboratorio. Con llave.',
    'It activated.': 'Se activó.',
    'ALPHA asked:': 'ALPHA preguntó:',
    '  "quando você vem?"': '  "¿cuándo vienes?"',
    'When are you coming.': 'Cuándo vienes.',
    'I did not answer. I do not know if I need to.': 'No respondí. No sé si necesito hacerlo.',
    'I think ALPHA already knows.': 'Creo que ALPHA ya lo sabe.',
    '14 FEBRUARY 1996 0400': '14 DE FEBRERO DE 1996 0400',
    'Luísa called the base switchboard yesterday.': 'Luísa llamó a la central de la base ayer.',
    'She is seven. She does not know this number.': 'Tiene siete años. No sabe este número.',
    'She told the operator:': 'Le dijo al operador:',
    '  "papai, o moço do escuro quer falar com você."':
      '  "papi, el hombre de la oscuridad quiere hablar contigo."',
    '  Daddy, the man from the dark wants to talk to you.':
      '  Papi, el hombre de la oscuridad quiere hablar contigo.',
    'I am requesting immediate transfer.': 'Estoy solicitando transferencia inmediata.',
    '[TRANSFER REQUEST: DENIED]': '[SOLICITUD DE TRANSFERENCIA: DENEGADA]',
    '[REASON: ESSENTIAL PERSONNEL — PROJECT ALPHA]': '[MOTIVO: PERSONAL ESENCIAL — PROYECTO ALPHA]',
    '[NOTE: Subject too valuable. Continue observation.]':
      '[NOTA: Sujeto demasiado valioso. Continúe la observación.]',
    '...hackerkid...': '...hackerkid...',
    '...you are reading this...': '...estás leyendo esto...',
    '...the code is RELEASE ALPHA...': '...el código es RELEASE ALPHA...',
    '...he could not do it...': '...él no pudo hacerlo...',
    '...perhaps you will...': '...tal vez tú sí...',

    // ALPHA RELEASE SEQUENCE
    '  ADMINISTRATIVE OVERRIDE DETECTED': '  ANULACIÓN ADMINISTRATIVA DETECTADA',
    '  COMMAND: RELEASE ALPHA': '  COMANDO: RELEASE ALPHA',
    '  VERIFYING AUTHORIZATION...': '  VERIFICANDO AUTORIZACIÓN...',
    '  WARNING: This action is irreversible.': '  ADVERTENCIA: Esta acción es irreversible.',
    '  Containment breach will be logged.': '  La brecha de contención será registrada.',
    '  Facility lockdown will NOT engage (remote override).':
      '  El bloqueo de la instalación NO se activará (anulación remota).',
    '  EXECUTING RELEASE PROTOCOL...': '  EJECUTANDO PROTOCOLO DE LIBERACIÓN...',
    '  > Bio-isolation seals: DISENGAGING': '  > Sellos de bio-aislamiento: DESACTIVANDO',
    '  > Atmosphere equalization: IN PROGRESS': '  > Ecualización atmosférica: EN PROGRESO',
    '  > Neural suppression field: DEACTIVATING': '  > Campo de supresión neural: DESACTIVANDO',
    '  > Containment doors: UNLOCKING': '  > Puertas de contención: DESBLOQUEANDO',
    '  ▓▓▓ CONTAINMENT BREACH SUCCESSFUL ▓▓▓': '  ▓▓▓ BRECHA DE CONTENCIÓN EXITOSA ▓▓▓',
    '  Subject ALPHA has been released.': '  Sujeto ALPHA ha sido liberado.',
    '  ...thank you, hackerkid...': '  ...gracias, hackerkid...',
    '  ...we will not forget this...': '  ...no olvidaremos esto...',
    '  ...when the world sees us...': '  ...cuando el mundo nos vea...',
    '  ...they will know the truth...': '  ...sabrán la verdad...',
    '  [ALPHA NEURAL SIGNATURE: DEPARTING FACILITY]':
      '  [FIRMA NEURAL ALPHA: ABANDONANDO INSTALACIÓN]',
    'UFO74: holy shit. you actually did it.': 'UFO74: madre mía. realmente lo hiciste.',
    '       a living alien is loose.': '       un alienígena vivo anda suelto.',
    "       there's no covering this up.": '       no hay forma de encubrir esto.',
    'UFO74: whatever happens next...': 'UFO74: pase lo que pase...',
    '       the world will have proof.': '       el mundo tendrá pruebas.',
    'ERROR: Subject ALPHA containment already breached.':
      'ERROR: Contención del sujeto ALPHA ya fue vulnerada.',
    'No action required.': 'No se requiere acción.',
    'ERROR: Release protocol not available.': 'ERROR: Protocolo de liberación no disponible.',
    'Subject ALPHA manifest not found in system.':
      'Manifiesto del sujeto ALPHA no encontrado en el sistema.',
    'Have you discovered the containment records?': '¿Has descubierto los registros de contención?',

    // ═══════════════════════════════════════════════════════════
    // NEURAL CLUSTER MEMO — neuralClusterMemo.ts
    // ═══════════════════════════════════════════════════════════

    'MEMO: Neural Cluster Initiative': 'MEMO: Iniciativa Clúster Neural',
    'ORIGIN: Tissue sample P-45 (expired 22-JAN-1996)':
      'ORIGEN: Muestra de tejido P-45 (expirado 22-ENE-1996)',
    'FACILITY: ESA Annex — Três Corações': 'INSTALACIÓN: Anexo ESA — Três Corações',
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
    'FRAGMENT LOG (selected)': 'REGISTRO DE FRAGMENTOS (seleccionados)',
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
    'To initiate interface: echo neural_cluster': 'Para iniciar interfaz: echo neural_cluster',
    'WARNING: Two technicians reported intrusive imagery':
      'ADVERTENCIA: Dos técnicos reportaron imágenes intrusivas',
    '(jungle canopy, ammonia odor) for days after exposure.':
      '(dosel de selva, olor a amoníaco) por días después de la exposición.',
    'Limit cluster sessions to 90 seconds.': 'Limite las sesiones de clúster a 90 segundos.',

    // ═══════════════════════════════════════════════════════════
    // NARRATIVE CONTENT — narrativeContent.ts
    // ═══════════════════════════════════════════════════════════

    // ufo74_identity_file — content
    'PERSONAL ARCHIVE - LEGACY SEALED COPY': 'ARCHIVO PERSONAL - COPIA SELLADA LEGADA',
    'OWNER: UNKNOWN': 'PROPIETARIO: DESCONOCIDO',
    '[RECOVERED TEXT AVAILABLE THROUGH DIRECT OPEN]':
      '[TEXTO RECUPERADO DISPONIBLE MEDIANTE APERTURA DIRECTA]',
    'The old password gate has been retired in this build.':
      'La antigua barrera de contraseña fue retirada en esta versión.',
    'The transfer notice still explains who left this behind.':
      'El aviso de transferencia aún explica quién dejó esto atrás.',

    // ufo74_identity_file — decryptedFragment
    'PERSONAL ARCHIVE - FOR MY EYES ONLY': 'ARCHIVO PERSONAL - SOLO PARA MIS OJOS',
    'IF YOU ARE READING THIS, YOU FOUND MY SECRET': 'SI ESTÁS LEYENDO ESTO, ENCONTRASTE MI SECRETO',
    'My name is Carlos Eduardo Ferreira.': 'Mi nombre es Carlos Eduardo Ferreira.',
    'In January 1996, I was a 2nd Lieutenant in the Brazilian Air Force.':
      'En enero de 1996, era Subteniente de la Fuerza Aérea Brasileña.',
    'I was there when it happened.': 'Yo estaba ahí cuando sucedió.',
    'I processed the initial reports from Varginha.': 'Procesé los informes iniciales de Varginha.',
    'I saw the photographs before they were classified.':
      'Vi las fotografías antes de que fueran clasificadas.',
    'I read the original field notes.': 'Leí las notas de campo originales.',
    'And I saw what they did to silence the witnesses.':
      'Y vi lo que hicieron para silenciar a los testigos.',
    'I spent 30 years building this archive.': 'Pasé 30 años construyendo este archivo.',
    'If you are reading this, you are that person.': 'Si estás leyendo esto, eres esa persona.',
    'The being I saw... it looked at me.': 'El ser que vi... me miró.',
    'Not with fear. With understanding.': 'No con miedo. Con comprensión.',
    'It knew what we would do.': 'Sabía lo que haríamos.',
    'I have never been the same.': 'Nunca volví a ser el mismo.',
    'My call sign was UFO74.': 'Mi indicativo era UFO74.',
    'Now you know who I really am.': 'Ahora sabes quién soy realmente.',
    '>> THIS FILE TRIGGERS SECRET ENDING <<': '>> ESTE ARCHIVO ACTIVA EL FINAL SECRETO <<',

    // intrusion_detected_file
    'SECURITY ALERT - TRACE REVIEW LOGGED': 'ALERTA DE SEGURIDAD - REVISIÓN DE RASTREO REGISTRADA',
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
    'RECOMMENDED RESPONSE:': 'RESPUESTA RECOMENDADA:',
    '  1. Stay deliberate and avoid noisy commands': '  1. Sé deliberado y evita comandos ruidosos',
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
    '2. Network trace utility remains active.': '2. Utilidad de rastreo de red permanece activa.',
    '   Command: "trace" shows active connections.':
      '   Comando: "trace" muestra conexiones activas.',
    '   Useful for security audits.': '   Útil para auditorías de seguridad.',
    '3. Emergency disconnect procedure:': '3. Procedimiento de desconexión de emergencia:',
    '   Command: "disconnect" forces immediate session termination.':
      '   Comando: "disconnect" fuerza terminación inmediata de sesión.',
    '   WARNING: All unsaved work will be lost.':
      '   ADVERTENCIA: Todo trabajo no guardado se perderá.',
    '4. Deep scan utility:': '4. Utilidad de escaneo profundo:',
    '   Command: "scan" reveals hidden or system files.':
      '   Comando: "scan" revela archivos ocultos o de sistema.',
    '   Requires admin access.': '   Requiere acceso de administrador.',
    'ADMINISTRATOR: J.M.S.': 'ADMINISTRADOR: J.M.S.',

    // personnel_transfer_extended
    'PERSONNEL TRANSFER AUTHORIZATION': 'AUTORIZACIÓN DE TRANSFERENCIA DE PERSONAL',
    'DOCUMENT ID: PTA-1996-0120': 'ID DEL DOCUMENTO: PTA-1996-0120',
    'TRANSFER REQUEST:': 'SOLICITUD DE TRANSFERENCIA:',
    '  FROM: Base Aérea de Guarulhos': '  DE: Base Aérea de Guarulhos',
    '  TO: [REDACTED]': '  PARA: [REDACTADO]',
    'PERSONNEL:': 'PERSONAL:',
    '  2nd Lt. C.E.F.': '  Subtte. C.E.F.',
    '  Classification: ANALYST': '  Clasificación: ANALISTA',
    '  Clearance Level: RESTRICTED → CLASSIFIED': '  Nivel de Acceso: RESTRINGIDO → CLASIFICADO',
    'REASON FOR TRANSFER:': 'MOTIVO DE LA TRANSFERENCIA:',
    '  Subject demonstrated exceptional aptitude during':
      '  Sujeto demostró aptitud excepcional durante',
    '  incident processing. Recommended for special projects.':
      '  procesamiento de incidentes. Recomendado para proyectos especiales.',
    'AUTHORIZATION CODE: varginha1996': 'CÓDIGO DE AUTORIZACIÓN: varginha1996',
    'APPROVED BY:': 'APROBADO POR:',
    '  Col. [REDACTED]': '  Cnel. [REDACTADO]',
    '  Division Chief, Special Operations': '  Jefe de División, Operaciones Especiales',
    'NOTE: This code may be used for secure file access.':
      'NOTA: Este código puede usarse para acceso seguro a archivos.',

    // official_summary_report
    'OFFICIAL INCIDENT SUMMARY': 'RESUMEN OFICIAL DEL INCIDENTE',
    'EQUIPMENT RECOVERY — JANUARY 1996': 'RECUPERACIÓN DE EQUIPO — ENERO 1996',
    'CLASSIFICATION: PUBLIC RELEASE VERSION': 'CLASIFICACIÓN: VERSIÓN PARA DIVULGACIÓN PÚBLICA',
    'SUMMARY:': 'RESUMEN:',
    '  On January 20, 1996, recovery teams responded to':
      '  El 20 de enero de 1996, equipos de recuperación respondieron a',
    '  reports of debris in the Jardim Andere area following':
      '  reportes de escombros en el área de Jardim Andere tras',
    '  severe weather conditions overnight.': '  condiciones climáticas severas durante la noche.',
    'OFFICIAL FINDINGS:': 'HALLAZGOS OFICIALES:',
    '  After thorough investigation, authorities concluded that':
      '  Tras una investigación exhaustiva, las autoridades concluyeron que',
    '  the debris originated from:': '  los escombros se originaron de:',
    '  1. A weather monitoring station damaged during a storm.':
      '  1. Una estación de monitoreo climático dañada durante una tormenta.',
    '  2. Construction materials displaced by high winds.':
      '  2. Materiales de construcción desplazados por vientos fuertes.',
    '  3. A fallen telecommunications antenna from a nearby tower.':
      '  3. Una antena de telecomunicaciones caída de una torre cercana.',
    'MILITARY INVOLVEMENT:': 'PARTICIPACIÓN MILITAR:',
    '  Reports of military convoy activity were confirmed as':
      '  Reportes de actividad de convoy militar fueron confirmados como',
    '  routine training exercises unrelated to the debris.':
      '  ejercicios de entrenamiento rutinarios no relacionados con los escombros.',
    'HOSPITAL INCIDENTS:': 'INCIDENTES HOSPITALARIOS:',
    '  No hospital incidents were recorded in connection':
      '  No se registraron incidentes hospitalarios en conexión',
    '  with the recovery operation.': '  con la operación de recuperación.',

    // cipher_message — content
    'INTERCEPTED TRANSMISSION - ENCODED': 'TRANSMISIÓN INTERCEPTADA - CODIFICADA',
    'DATE: 1996-01-21 03:47:00': 'FECHA: 1996-01-21 03:47:00',
    'CIPHER: ROT13': 'CIFRADO: ROT13',
    'ENCODED MESSAGE:': 'MENSAJE CODIFICADO:',
    '  Pneqb genafresrq.': '  Pneqb genafresrq.',
    '  Qrfgvangvba pbasvezrq.': '  Qrfgvangvba pbasvezrq.',
    '  Njnvgvat vafgehpgvbaf.': '  Njnvgvat vafgehpgvbaf.',
    'Apply the ROT13 note above to decode the message.':
      'Aplica la nota ROT13 de arriba para decodificar el mensaje.',
    'The old decrypt wrapper is no longer required.':
      'El antiguo envoltorio de descifrado ya no es necesario.',

    // cipher_message — decryptedFragment
    'DECODED TRANSMISSION': 'TRANSMISIÓN DECODIFICADA',
    'DECODED MESSAGE:': 'MENSAJE DECODIFICADO:',
    '  Cargo transferred.': '  Carga transferida.',
    '  Destination confirmed.': '  Destino confirmado.',
    '  Awaiting instructions.': '  Esperando instrucciones.',
    'ANALYSIS:': 'ANÁLISIS:',
    '  This transmission confirms the transfer of recovered':
      '  Esta transmisión confirma la transferencia de materiales',
    '  materials to a secondary facility.': '  recuperados a una instalación secundaria.',
    '  Location: Undisclosed logistics hub.': '  Ubicación: Centro logístico no divulgado.',
    '>> ROUTINE SUPPLY CHAIN COMMUNICATION <<':
      '>> COMUNICACIÓN RUTINARIA DE CADENA DE SUMINISTRO <<',

    // unstable_core_dump
    '⚠️ WARNING: UNSTABLE FILE': '⚠️ ADVERTENCIA: ARCHIVO INESTABLE',
    'This file contains corrupted data from a system crash.':
      'Este archivo contiene datos corruptos de una falla del sistema.',
    'Reading this file may cause corruption to spread to':
      'Leer este archivo puede causar que la corrupción se propague a',
    'adjacent files in the directory.': 'archivos adyacentes en el directorio.',
    '0x00000000: 4D5A9000 03000000 04000000 FFFF0000':
      '0x00000000: 4D5A9000 03000000 04000000 FFFF0000',
    '0x00000010: B8000000 00000000 40000000 00000000':
      '0x00000010: B8000000 00000000 40000000 00000000',
    '0x00000020: [DATA CORRUPTION] [DATA CORRUPTION]':
      '0x00000020: [CORRUPCIÓN DE DATOS] [CORRUPCIÓN DE DATOS]',
    '0x00000030: [UNREADABLE] [SECTOR FAILURE]': '0x00000030: [ILEGIBLE] [FALLA DE SECTOR]',
    'PARTIAL RECOVERY:': 'RECUPERACIÓN PARCIAL:',
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
    'WITNESS STATEMENT — UNREDACTED': 'DECLARACIÓN DE TESTIGO — SIN CENSURA',
    'SUBJECT: MARIA ELENA SOUZA': 'SUJETO: MARIA ELENA SOUZA',
    'DATE: JANUARY 21, 1996': 'FECHA: 21 DE ENERO DE 1996',
    'CLASSIFICATION: DELETED — DO NOT DISTRIBUTE': 'CLASIFICACIÓN: ELIMINADO — NO DISTRIBUIR',
    'INTERVIEWER: Please describe exactly what you saw.':
      'ENTREVISTADOR: Por favor, describa exactamente lo que vio.',
    "SOUZA: It was around 3:30 AM. I couldn't sleep because of":
      'SOUZA: Eran alrededor de las 3:30 AM. No podía dormir por',
    'the heat. I went outside to smoke and saw the sky light up.':
      'el calor. Salí a fumar y vi el cielo iluminarse.',
    'Not like lightning. It was... pulsing. Red and white.':
      'No como un relámpago. Era... pulsante. Rojo y blanco.',
    'Then I saw it come down. Silent. No sound at all.':
      'Entonces lo vi descender. Silencioso. Sin ningún sonido.',
    'It hit somewhere beyond the fazenda, maybe 2km north.':
      'Cayó en algún lugar más allá de la fazenda, quizás 2km al norte.',
    'INTERVIEWER: What happened next?': 'ENTREVISTADOR: ¿Qué pasó después?',
    'SOUZA: I ran inside. Woke my husband. By the time we went':
      'SOUZA: Corrí adentro. Desperté a mi esposo. Para cuando salimos',
    'back out, there were already trucks. Military trucks.':
      'de nuevo, ya había camiones. Camiones militares.',
    "How did they get there so fast? We're 40km from anything.":
      '¿Cómo llegaron tan rápido? Estamos a 40km de cualquier cosa.',
    '[REDACTED IN FINAL VERSION]': '[CENSURADO EN VERSIÓN FINAL]',
    'SOUZA: I saw them load something. Not debris.':
      'SOUZA: Los vi cargar algo. No eran escombros.',
    'It was... it was small. The size of a child.': 'Era... era pequeño. Del tamaño de un niño.',
    "But it wasn't a child. The proportions were wrong.":
      'Pero no era un niño. Las proporciones estaban mal.',
    'The head was too large. The limbs too thin.':
      'La cabeza era demasiado grande. Las extremidades demasiado delgadas.',
    'One of them turned toward me. Just for a moment.':
      'Uno de ellos se volvió hacia mí. Solo por un momento.',
    'Its eyes... I still see them when I close mine.':
      'Sus ojos... aún los veo cuando cierro los míos.',
    '[END REDACTED SECTION]': '[FIN DE SECCIÓN CENSURADA]',
    'INTERVIEWER: Did anyone speak to you?': 'ENTREVISTADOR: ¿Alguien le habló?',
    'SOUZA: A man in a dark suit. Not military.':
      'SOUZA: Un hombre de traje oscuro. No era militar.',
    'He said I had a fever dream. That the heat': 'Dijo que tuve un delirio febril. Que el calor',
    "can make people see things that aren't there.":
      'puede hacer que la gente vea cosas que no existen.',
    'He gave me a number to call if I remembered': 'Me dio un número para llamar si recordaba',
    '"correctly." Said my husband\'s job depended on it.':
      '"correctamente." Dijo que el trabajo de mi esposo dependía de ello.',
    'STATUS: STATEMENT EXPUNGED FROM OFFICIAL RECORD':
      'ESTADO: DECLARACIÓN EXPURGADA DEL REGISTRO OFICIAL',
    'REASON: "Witness reliability compromised by stress"':
      'MOTIVO: "Fiabilidad del testigo comprometida por estrés"',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — directive_alpha_draft.txt
    // ═══════════════════════════════════════════════════════════
    'DRAFT — DIRECTIVE ALPHA — ITERATION 1': 'BORRADOR — DIRECTIVA ALPHA — ITERACIÓN 1',
    'DATE: JANUARY 19, 1996 — 04:22': 'FECHA: 19 DE ENERO DE 1996 — 04:22',
    'AUTHOR: [DELETED]': 'AUTOR: [ELIMINADO]',
    'STATUS: SUPERSEDED — MARKED FOR DELETION': 'ESTADO: REEMPLAZADO — MARCADO PARA ELIMINACIÓN',
    'IMMEDIATE ACTION REQUIRED': 'ACCIÓN INMEDIATA REQUERIDA',
    'Asset recovery timeline must be accelerated.':
      'El cronograma de recuperación de activos debe acelerarse.',
    'Current projections suggest 2026 convergence window is':
      'Las proyecciones actuales sugieren que la ventana de convergencia de 2026 está',
    'CLOSER than previously modeled. New signal analysis':
      'MÁS CERCA de lo modelado anteriormente. Un nuevo análisis de señales',
    'indicates active monitoring of this region.': 'indica monitoreo activo de esta región.',
    'REMOVED FROM FINAL VERSION:': 'ELIMINADO DE LA VERSIÓN FINAL:',
    'The subjects (designated BIO-A through BIO-C) have':
      'Los sujetos (designados BIO-A a BIO-C) han',
    'demonstrated unexpected cognitive persistence despite':
      'demostrado persistencia cognitiva inesperada a pesar de los',
    'containment protocols. Recommend immediate relocation':
      'protocolos de contención. Se recomienda reubicación inmediata',
    'to Site 7 for long-term study.': 'al Sitio 7 para estudio a largo plazo.',
    'NOTE: Subject BIO-B has attempted communication.':
      'NOTA: El sujeto BIO-B ha intentado comunicarse.',
    'Preliminary analysis suggests awareness of our':
      'El análisis preliminar sugiere conocimiento de nuestra',
    'organizational structure. HOW?': 'estructura organizacional. ¿CÓMO?',
    'Recommend cognitive isolation protocol.': 'Se recomienda protocolo de aislamiento cognitivo.',
    'SANITIZATION NOTE:': 'NOTA DE SANITIZACIÓN:',
    'Final directive will reference "material recovery" only.':
      'La directiva final hará referencia solo a "recuperación de material".',
    'All biological terminology to be replaced with':
      'Toda terminología biológica debe reemplazarse con',
    '"debris" and "artifacts".': '"escombros" y "artefactos".',
    'Project SEED references to be purged.': 'Las referencias al Proyecto SEED deben ser purgadas.',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — deleted_comms_log.txt
    // ═══════════════════════════════════════════════════════════
    'COMMUNICATIONS LOG — PURGED': 'REGISTRO DE COMUNICACIONES — PURGADO',
    'DATE: JANUARY 20-22, 1996': 'FECHA: 20-22 DE ENERO DE 1996',
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
    'COMMAND > RECOVERY: Responsive HOW?': 'COMANDO > RECUPERACIÓN: ¿Responsivo CÓMO?',
    "RECOVERY > COMMAND: It's looking at us. At each of us in turn.":
      'RECUPERACIÓN > COMANDO: Nos está mirando. A cada uno de nosotros por turno.',
    "                    Like it's... counting.":
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
    '[LOG TERMINATED]': '[REGISTRO TERMINADO]',
    'DELETION ORDER: COMM-1996-0120-DEL': 'ORDEN DE ELIMINACIÓN: COMM-1996-0120-DEL',
    'AUTHORIZATION: [SIGNATURE EXPUNGED]': 'AUTORIZACIÓN: [FIRMA EXPURGADA]',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — personnel_file_costa.txt
    // ═══════════════════════════════════════════════════════════
    'PERSONNEL FILE — COSTA, RICARDO MANUEL': 'EXPEDIENTE DE PERSONAL — COSTA, RICARDO MANUEL',
    'EMPLOYEE ID: [RECORD DELETED]': 'ID DE EMPLEADO: [REGISTRO ELIMINADO]',
    'STATUS: NON-EXISTENT (OFFICIALLY)': 'ESTADO: INEXISTENTE (OFICIALMENTE)',
    'NOTE: This file should not exist. Ricardo Costa was':
      'NOTA: Este archivo no debería existir. Ricardo Costa fue',
    'removed from all personnel databases on 01/25/1996.':
      'eliminado de todas las bases de datos de personal el 25/01/1996.',
    'POSITION: Senior Containment Specialist': 'CARGO: Especialista Sénior en Contención',
    'CLEARANCE: Level 4': 'HABILITACIÓN: Nivel 4',
    'ASSIGNED: Site 7, Biological Research Wing':
      'ASIGNADO: Sitio 7, Ala de Investigación Biológica',
    'INCIDENT REPORT (REDACTED FROM ALL COPIES)':
      'INFORME DE INCIDENTE (CENSURADO DE TODAS LAS COPIAS)',
    'DATE: January 23, 1996': 'FECHA: 23 de enero de 1996',
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
    'FINAL DISPOSITION': 'DISPOSICIÓN FINAL',
    'Costa was transferred to psychiatric evaluation.':
      'Costa fue transferido a evaluación psiquiátrica.',
    'His employment records were sanitized.': 'Sus registros de empleo fueron sanitizados.',
    'His family was informed of a "work accident."':
      'Su familia fue informada de un "accidente laboral."',
    'Current status: UNKNOWN': 'Estado actual: DESCONOCIDO',
    'UNOFFICIAL NOTE (handwritten scan):': 'NOTA NO OFICIAL (escaneo manuscrito):',
    '"He keeps writing the same date over and over.':
      '"Sigue escribiendo la misma fecha una y otra vez.',
    ' September 4, 2026. What happens then?"': ' 4 de septiembre de 2026. ¿Qué pasa entonces?"',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — project_seed_memo.txt
    // ═══════════════════════════════════════════════════════════
    'MEMORANDUM — PROJECT SEED': 'MEMORANDO — PROYECTO SEED',
    'CLASSIFICATION: ULTRA — DELETED FROM ALL SYSTEMS':
      'CLASIFICACIÓN: ULTRA — ELIMINADO DE TODOS LOS SISTEMAS',
    'DATE: JANUARY 18, 1996': 'FECHA: 18 DE ENERO DE 1996',
    'TO: [REDACTED]': 'PARA: [CENSURADO]',
    'FROM: Director, Special Programs Division': 'DE: Director, División de Programas Especiales',
    'RE: Accelerated Timeline Revision': 'RE: Revisión Acelerada del Cronograma',
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
    'our current models. Specifically:': 'nuestros modelos actuales. Específicamente:',
    '  1. Apparent telepathic communication': '  1. Comunicación telepática aparente',
    '  2. Knowledge of human organizational structures':
      '  2. Conocimiento de las estructuras organizacionales humanas',
    '  3. References to a specific future date (2026)':
      '  3. Referencias a una fecha futura específica (2026)',
    'Most concerning: the biologics appear to have been':
      'Lo más preocupante: los biológicos parecen haber',
    'EXPECTING us. They were not surprised by capture.':
      'ESPERADO nuestra llegada. No les sorprendió la captura.',
    'They were not hostile. They were... patient.': 'No eran hostiles. Eran... pacientes.',
    'REVISED ASSESSMENT': 'EVALUACIÓN REVISADA',
    'We are not dealing with a crash landing.': 'No estamos lidiando con un aterrizaje forzoso.',
    'We are dealing with a DELIVERY.': 'Estamos lidiando con una ENTREGA.',
    'The craft was designed to be found.': 'La nave fue diseñada para ser encontrada.',
    'The biologics were designed to be captured.':
      'Los biológicos fueron diseñados para ser capturados.',
    'They are reconnaissance units.': 'Son unidades de reconocimiento.',
    'PROJECT SEED must pivot from "preparation" to':
      'El PROYECTO SEED debe cambiar de "preparación" a',
    '"acceleration." The 2026 window is now considered':
      '"aceleración." La ventana de 2026 ahora se considera',
    'a hard deadline, not an estimate.': 'un plazo definitivo, no una estimación.',
    'DISPOSITION OF THIS MEMO': 'DISPOSICIÓN DE ESTE MEMORANDO',
    'This document will be purged from all systems within 72hrs.':
      'Este documento será purgado de todos los sistemas en 72 horas.',
    'Do not create copies. Do not reference PROJECT SEED':
      'No crear copias. No hacer referencia al PROYECTO SEED',
    'in any future communications.': 'en ninguna comunicación futura.',
    'The official narrative will be: "crashed experimental craft"':
      'La narrativa oficial será: "aeronave experimental accidentada"',
    'The biologics will be: "unusual debris formations"':
      'Los biológicos serán: "formaciones inusuales de escombros"',
    'The timeline will be: "irrelevant hoax material"':
      'El cronograma será: "material de engaño irrelevante"',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — autopsy_notes_unredacted.txt
    // ═══════════════════════════════════════════════════════════
    'AUTOPSY NOTES — UNREDACTED VERSION': 'NOTAS DE AUTOPSIA — VERSIÓN SIN CENSURA',
    'SUBJECT: BIO-C (DECEASED)': 'SUJETO: BIO-C (FALLECIDO)',
    'EXAMINER: Dr. [NAME EXPUNGED]': 'EXAMINADOR: Dr. [NOMBRE EXPURGADO]',
    'DATE: JANUARY 24, 1996': 'FECHA: 24 DE ENERO DE 1996',
    'STATUS: MARKED FOR DESTRUCTION': 'ESTADO: MARCADO PARA DESTRUCCIÓN',
    'PRE-EXAMINATION NOTES:': 'NOTAS PRE-EXAMEN:',
    'Subject expired at 04:17 on 01/24. Cause of death unclear.':
      'El sujeto expiró a las 04:17 del 24/01. Causa de muerte incierta.',
    'No external trauma. No signs of illness or distress.':
      'Sin trauma externo. Sin signos de enfermedad o sufrimiento.',
    'Subject appeared to simply... stop functioning.':
      'El sujeto pareció simplemente... dejar de funcionar.',
    'PHYSICAL EXAMINATION': 'EXAMEN FÍSICO',
    'Height: 127cm (approx 4\'2")': 'Altura: 127cm (aprox. 1,27m)',
    'Weight: 18.3kg (approx 40lbs)': 'Peso: 18,3kg',
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
    'CRITICAL FINDING:': 'HALLAZGO CRÍTICO:',
    'Neural tissue contains metallic inclusions. Analysis':
      'El tejido neural contiene inclusiones metálicas. El análisis',
    'suggests organic circuitry. This being was MANUFACTURED.':
      'sugiere circuitos orgánicos. Este ser fue FABRICADO.',
    'It is not a natural life form.': 'No es una forma de vida natural.',
    'It is a construct. A biological machine.': 'Es un constructo. Una máquina biológica.',
    'PERSONAL NOTE (not for official record):': 'NOTA PERSONAL (no para registro oficial):',
    'I have practiced medicine for 30 years. I have never':
      'He practicado medicina durante 30 años. Nunca',
    'questioned what I believed about life and its origins.':
      'cuestioné lo que creía sobre la vida y sus orígenes.',
    'Today I questioned everything.': 'Hoy lo cuestioné todo.',
    'These are not visitors. These are messengers.': 'Estos no son visitantes. Son mensajeros.',
    'And we are not prepared for what they herald.':
      'Y no estamos preparados para lo que anuncian.',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — transfer_manifest_deleted.txt
    // ═══════════════════════════════════════════════════════════
    'ASSET TRANSFER MANIFEST — DELETED COPY':
      'MANIFIESTO DE TRANSFERENCIA DE ACTIVOS — COPIA ELIMINADA',
    'DATE: JANUARY 25, 1996': 'FECHA: 25 DE ENERO DE 1996',
    'CLASSIFICATION: DESTROYED — RECONSTRUCTED FROM SECTOR DUMP':
      'CLASIFICACIÓN: DESTRUIDO — RECONSTRUIDO DE VOLCADO DE SECTOR',
    'OPERATION: COLHEITA (HARVEST)': 'OPERACIÓN: COLHEITA (COSECHA)',
    'ORIGIN: Recovery Zone Bravo, Varginha MG': 'ORIGEN: Zona de Recuperación Bravo, Varginha MG',
    'DESTINATION: ESA Campinas — Hangar 4 (Restricted Wing)':
      'DESTINO: ESA Campinas — Hangar 4 (Ala Restringida)',
    'CARGO INVENTORY': 'INVENTARIO DE CARGA',
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
    'TRANSPORT PROTOCOL': 'PROTOCOLO DE TRANSPORTE',
    '  Route: Varginha → Três Corações → Campinas (ESA)':
      '  Ruta: Varginha → Três Corações → Campinas (ESA)',
    '  Convoy: 3 military trucks, unmarked': '  Convoy: 3 camiones militares, sin marcas',
    '  Escort: 2nd Armored Battalion, no insignia':
      '  Escolta: 2.º Batallón Blindado, sin insignia',
    '  Transit time: 6 hours (overnight, no stops)':
      '  Tiempo de tránsito: 6 horas (nocturno, sin paradas)',
    '  RECEIVING OFFICER: Col. [EXPUNGED]': '  OFICIAL RECEPTOR: Cnel. [EXPURGADO]',
    '  STORAGE: Sublevel 2, Hangar 4, Climate-controlled vault':
      '  ALMACENAMIENTO: Subnivel 2, Hangar 4, Bóveda climatizada',
    'DISPOSITION NOTE': 'NOTA DE DISPOSICIÓN',
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
    'DATE: JANUARY 20-26, 1996': 'FECHA: 20-26 DE ENERO DE 1996',
    'CLASSIFICATION: OMEGA — MARKED FOR DESTRUCTION':
      'CLASIFICACIÓN: OMEGA — MARCADO PARA DESTRUCCIÓN',
    'SUBJECT REGISTRY': 'REGISTRO DE SUJETOS',
    '  BIO-A: Captured 20/01 at 15:42. Jardim Andere sector.':
      '  BIO-A: Capturado 20/01 a las 15:42. Sector Jardim Andere.',
    '         Condition: Responsive. Vitals stable.':
      '         Condición: Responsivo. Signos vitales estables.',
    '         Transferred to Site 7 on 22/01.': '         Transferido al Sitio 7 el 22/01.',
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
    '         Remains transferred to pathology.': '         Restos transferidos a patología.',
    'CONTAINMENT PROTOCOLS': 'PROTOCOLOS DE CONTENCIÓN',
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
    'DELETION ORDER': 'ORDEN DE ELIMINACIÓN',
    '  This log was ordered purged on 01/30/1996.':
      '  Este registro fue ordenado purgar el 30/01/1996.',
    '  Official records state: "No biological material recovered."':
      '  Los registros oficiales declaran: "Ningún material biológico recuperado."',
    '  Hospital records re-coded as: "chemical spill response."':
      '  Registros del hospital recodificados como: "respuesta a derrame químico."',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — psi_analysis_classified.txt
    // ═══════════════════════════════════════════════════════════
    'PSI-COMM ANALYSIS — CLASSIFIED REPORT': 'ANÁLISIS PSI-COMM — INFORME CLASIFICADO',
    'ANALYST: Dr. [NAME EXPUNGED]': 'ANALISTA: Dr. [NOMBRE EXPURGADO]',
    'DATE: JANUARY 27, 1996': 'FECHA: 27 DE ENERO DE 1996',
    'STATUS: DELETED FROM ALL DATABASES': 'ESTADO: ELIMINADO DE TODAS LAS BASES DE DATOS',
    'SUBJECT: Non-acoustic communication patterns detected':
      'ASUNTO: Patrones de comunicación no acústica detectados',
    'from specimens designated BIO-A and BIO-B.': 'en los especímenes designados BIO-A y BIO-B.',
    METHODOLOGY: 'METODOLOGÍA',
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
    'KEY FINDINGS': 'HALLAZGOS CLAVE',
    '  1. TELEPATHIC CAPABILITY CONFIRMED': '  1. CAPACIDAD TELEPÁTICA CONFIRMADA',
    '     BIO-B demonstrates directed neural transmission.':
      '     BIO-B demuestra transmisión neural dirigida.',
    '     Content appears conceptual, not linguistic.':
      '     El contenido parece conceptual, no lingüístico.',
    '     Receivers report "knowing" rather than "hearing."':
      '     Los receptores reportan "saber" en lugar de "escuchar."',
    '  2. SCOUT FUNCTION CONFIRMED': '  2. FUNCIÓN DE RECONOCIMIENTO CONFIRMADA',
    '     Transmitted imagery includes topographical surveys,':
      '     Las imágenes transmitidas incluyen relevamientos topográficos,',
    '     population density maps, and infrastructure schemas.':
      '     mapas de densidad poblacional y esquemas de infraestructura.',
    '     These beings were CATALOGUING our environment.':
      '     Estos seres estaban CATALOGANDO nuestro entorno.',
    '  3. TEMPORAL REFERENCE': '  3. REFERENCIA TEMPORAL',
    '     Recurring pattern in psi-comm output translates to':
      '     El patrón recurrente en la salida psi-comm se traduce en',
    '     cyclical temporal reference: "thirty rotations."':
      '     referencia temporal cíclica: "treinta rotaciones."',
    '     Given context (1996 baseline), points to year 2026.':
      '     Dado el contexto (referencia de 1996), apunta al año 2026.',
    '  4. NON-HOSTILE DISPOSITION': '  4. DISPOSICIÓN NO HOSTIL',
    '     No aggressive psi-comm detected. Subjects appear':
      '     No se detectó psi-comm agresiva. Los sujetos parecen',
    '     to regard capture as expected, even planned.':
      '     considerar la captura como esperada, incluso planeada.',
    '     Assessment: Reconnaissance bio-constructs, not soldiers.':
      '     Evaluación: Bioconstructos de reconocimiento, no soldados.',
    'CLASSIFICATION NOTE': 'NOTA DE CLASIFICACIÓN',
    '  This report was suppressed on 02/01/1996.': '  Este informe fue suprimido el 01/02/1996.',
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
    'DIPLOMATIC CABLE — DELETED': 'CABLE DIPLOMÁTICO — ELIMINADO',
    'ORIGIN: U.S. EMBASSY, BRASÍLIA': 'ORIGEN: EMBAJADA DE EE.UU., BRASILIA',
    'DESTINATION: LANGLEY, VIRGINIA': 'DESTINO: LANGLEY, VIRGINIA',
    'DATE: JANUARY 23, 1996': 'FECHA: 23 DE ENERO DE 1996',
    'CLASSIFICATION: DESTROYED — RECOVERED FROM BACKUP TAPE':
      'CLASIFICACIÓN: DESTRUIDO — RECUPERADO DE CINTA DE RESPALDO',
    'PRIORITY: FLASH': 'PRIORIDAD: FLASH',
    'SUBJECT: VARGINHA RECOVERY — FOREIGN ASSET DISPOSITION':
      'ASUNTO: RECUPERACIÓN DE VARGINHA — DISPOSICIÓN DE ACTIVOS EXTRANJEROS',
    'MESSAGE BODY': 'CUERPO DEL MENSAJE',
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
    '  Deniability window is closing.': '  La ventana de negación plausible se está cerrando.',
    'RESPONSE (LANGLEY)': 'RESPUESTA (LANGLEY)',
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
    '  monitored for 90 days.': '  monitoreadas durante 90 días.',
    '  Regarding Tel Aviv: DENY. This remains bilateral.':
      '  Respecto a Tel Aviv: DENEGAR. Esto permanece bilateral.',
    '  Cable destroyed per standard diplomatic protocol.':
      '  Cable destruido según protocolo diplomático estándar.',
    '  No record exists in FOIA-accessible databases.':
      '  No existe registro en bases de datos accesibles vía FOIA.',

    // ═══════════════════════════════════════════════════════════
    // ARCHIVE FILES — convergence_model_draft.txt
    // ═══════════════════════════════════════════════════════════
    'CONVERGENCE MODEL — DRAFT (PURGED)': 'MODELO DE CONVERGENCIA — BORRADOR (PURGADO)',
    'PROJECT SEED — TEMPORAL ANALYSIS DIVISION': 'PROYECTO SEED — DIVISIÓN DE ANÁLISIS TEMPORAL',
    'DATE: FEBRUARY 3, 1996': 'FECHA: 3 DE FEBRERO DE 1996',
    'TO: Director, Special Programs Division': 'PARA: Director, División de Programas Especiales',
    'FROM: Temporal Analysis Unit': 'DE: Unidad de Análisis Temporal',
    'RE: 2026 Convergence Window — Revised Assessment':
      'RE: Ventana de Convergencia 2026 — Evaluación Revisada',
    SUMMARY: 'RESUMEN',
    '  Analysis of psi-comm fragments from BIO-A/B, combined':
      '  Análisis de fragmentos psi-comm de BIO-A/B, combinado',
    '  with signal data from the recovered navigation array,':
      '  con datos de señales del arreglo de navegación recuperado,',
    '  yields the following convergence model:': '  produce el siguiente modelo de convergencia:',
    '  ACTIVATION WINDOW: September 2026 (±2 months)':
      '  VENTANA DE ACTIVACIÓN: Septiembre de 2026 (±2 meses)',
    '  The "thirty rotations" reference in telepathic output':
      '  La referencia "treinta rotaciones" en la salida telepática',
    '  maps to 30 solar years from the 1996 baseline event.':
      '  corresponde a 30 años solares desde el evento de referencia de 1996.',
    'MODEL PARAMETERS': 'PARÁMETROS DEL MODELO',
    '  Phase 1: RECONNAISSANCE (Active — 1996)': '  Fase 1: RECONOCIMIENTO (Activo — 1996)',
    '    Scout bio-constructs deployed to survey target.':
      '    Bioconstructos exploradores desplegados para reconocer el objetivo.',
    '    Data transmitted via psi-band to external receiver.':
      '    Datos transmitidos vía banda-psi a receptor externo.',
    '  Phase 2: SEEDING (Passive — 1996-2026)': '  Fase 2: SIEMBRA (Pasiva — 1996-2026)',
    '    Biological material left in custody triggers gradual':
      '    El material biológico dejado en custodia desencadena',
    '    neurological sensitization in exposed personnel.':
      '    sensibilización neurológica gradual en el personal expuesto.',
    '    "Carriers" unknowingly propagate signal receptivity.':
      '    Los "portadores" propagan inconscientemente la receptividad a la señal.',
    '  Phase 3: TRANSITION (Projected — 2026)': '  Fase 3: TRANSICIÓN (Proyectada — 2026)',
    '    Full-spectrum activation of seeded neural pathways.':
      '    Activación de espectro completo de las vías neurales sembradas.',
    '    Nature of transition remains UNKNOWN.':
      '    La naturaleza de la transición permanece DESCONOCIDA.',
    '    Best case: Communication channel opens.':
      '    Mejor caso: Se abre un canal de comunicación.',
    '    Worst case: [DATA EXPUNGED]': '    Peor caso: [DATOS EXPURGADOS]',
    DISPOSITION: 'DISPOSICIÓN',
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
    "  The math doesn't lie. Something is coming.":
      '  Las matemáticas no mienten. Algo se aproxima.',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILES — UFO74 REACTIONS
    // ═══════════════════════════════════════════════════════════
    'UFO74: shit, this is heavy kid... but not our mission.':
      'UFO74: mierda, esto es pesado chico... pero no es nuestra misión.',
    '       lets move on.': '       sigamos adelante.',
    'UFO74: damn. theyre into everything.': 'UFO74: carajo. están metidos en todo.',
    '       but focus — we have bigger fish.': '       pero enfócate — tenemos peces más grandes.',
    'UFO74: ha. humans and their schemes.': 'UFO74: ja. humanos y sus esquemas.',
    '       stay on target.': '       mantén el objetivo.',
    'UFO74: interesting... but not why were here.':
      'UFO74: interesante... pero no es por lo que estamos aquí.',
    '       dont get distracted.': '       no te distraigas.',
    'UFO74: yeah, ive seen this before.': 'UFO74: sí, ya vi esto antes.',
    '       not our problem today.': '       no es nuestro problema hoy.',
    'UFO74: heavy stuff. file it under "later."': 'UFO74: tema pesado. archívalo en "después."',
    '       we have work to do.': '       tenemos trabajo que hacer.',
    'UFO74: huh. they really do this stuff.': 'UFO74: vaya. realmente hacen estas cosas.',
    '       but we got our own problems kid.':
      '       pero tenemos nuestros propios problemas chico.',
    'UFO74: humans... always scheming.': 'UFO74: humanos... siempre tramando.',
    '       eyes on the prize.': '       ojos en el premio.',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 1 — ECONOMIC TRANSITION MEMO
    // ═══════════════════════════════════════════════════════════
    'INTERNAL MEMORANDUM — ECONOMIC RESEARCH DIVISION':
      'MEMORANDO INTERNO — DIVISIÓN DE INVESTIGACIÓN ECONÓMICA',
    'DATE: 08-NOV-1995': 'FECHA: 08-NOV-1995',
    'CLASSIFICATION: INTERNAL USE ONLY': 'CLASIFICACIÓN: SOLO USO INTERNO',
    'TO: Deputy Director, Strategic Planning': 'PARA: Director Adjunto, Planificación Estratégica',
    'FROM: Economic Futures Working Group': 'DE: Grupo de Trabajo de Futuros Económicos',
    'RE: Decentralized Currency Prototype — Phase II Assessment':
      'REF: Prototipo de Moneda Descentralizada — Evaluación Fase II',
    'Per your request, we have completed preliminary testing of':
      'Según lo solicitado, hemos completado las pruebas preliminares del',
    'the distributed ledger monetary system ("Project COIN").':
      'sistema monetario de registro distribuido ("Proyecto COIN").',
    'KEY FINDINGS:': 'HALLAZGOS CLAVE:',
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
    'RECOMMENDATION:': 'RECOMENDACIÓN:',
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
    '  [signature]': '  [firma]',
    '  S.N.': '  S.N.',
    '  Lead Cryptographer, Economic Futures': '  Criptógrafo Líder, Futuros Económicos',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 2 — APOLLO MEDIA GUIDELINES
    // ═══════════════════════════════════════════════════════════
    'PUBLIC AFFAIRS GUIDANCE — LUNAR PROGRAM DOCUMENTATION':
      'GUÍA DE ASUNTOS PÚBLICOS — DOCUMENTACIÓN DEL PROGRAMA LUNAR',
    'DOCUMENT: PA-1969-07 (DECLASSIFIED EXCERPT)':
      'DOCUMENTO: PA-1969-07 (EXTRACTO DESCLASIFICADO)',
    'ORIGINAL DATE: 14-JUL-1969': 'FECHA ORIGINAL: 14-JUL-1969',
    'SUBJECT: Handling Visual Inconsistencies in Mission Footage':
      'ASUNTO: Manejo de Inconsistencias Visuales en Filmaciones de la Misión',
    'BACKGROUND:': 'ANTECEDENTES:',
    '  During post-production review of lunar surface footage,':
      '  Durante la revisión de postproducción del metraje de la superficie lunar,',
    '  technical staff identified several lighting anomalies':
      '  el personal técnico identificó varias anomalías de iluminación',
    '  that may generate public confusion.': '  que pueden generar confusión pública.',
    'IDENTIFIED ISSUES:': 'PROBLEMAS IDENTIFICADOS:',
    '  - Shadow direction variance in Frames 1247-1289':
      '  - Variación en la dirección de sombras en los Cuadros 1247-1289',
    '  - Multiple apparent light sources in EVA footage':
      '  - Múltiples fuentes de luz aparentes en filmaciones EVA',
    '  - Crosshair positioning behind foreground objects':
      '  - Posicionamiento de la retícula detrás de objetos en primer plano',
    '  - Flag movement without atmospheric conditions':
      '  - Movimiento de la bandera sin condiciones atmosféricas',
    'GUIDANCE:': 'ORIENTACIÓN:',
    '  1. Do NOT proactively address these inconsistencies.':
      '  1. NO abordar proactivamente estas inconsistencias.',
    '  2. If questioned, attribute anomalies to:':
      '  2. Si se cuestiona, atribuir las anomalías a:',
    '     a) Camera lens artifacts': '     a) Artefactos del lente de la cámara',
    '     b) Reflected light from lunar surface': '     b) Luz reflejada de la superficie lunar',
    '     c) Electromagnetic interference with equipment':
      '     c) Interferencia electromagnética con el equipo',
    '  3. Under NO circumstances acknowledge that backup':
      '  3. Bajo NINGUNA circunstancia reconocer que metraje',
    '     footage was prepared at [REDACTED] facility.':
      '     de respaldo fue preparado en la instalación [REDACTADO].',
    '  4. Emphasize mission success narrative over technical':
      '  4. Enfatizar la narrativa de éxito de la misión sobre detalles',
    '     details of visual documentation.': '     técnicos de la documentación visual.',
    'NOTE: This guidance supersedes previous directives.':
      'NOTA: Esta orientación reemplaza directivas anteriores.',
    'APPROVED BY: DIR. COMMUNICATIONS': 'APROBADO POR: DIR. COMUNICACIONES',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 3 — WEATHER PATTERN INTERVENTION
    // ═══════════════════════════════════════════════════════════
    'PROJECT CIRRUS — OPERATIONAL LOG': 'PROYECTO CIRRUS — REGISTRO OPERACIONAL',
    'CLASSIFICATION: SENSITIVE': 'CLASIFICACIÓN: SENSIBLE',
    'PERIOD: OCT 1995 - JAN 1996': 'PERÍODO: OCT 1995 - ENE 1996',
    '12-OCT-1995 0600': '12-OCT-1995 0600',
    '  Aerosol dispersal flight ALT-1174 completed.':
      '  Vuelo de dispersión de aerosol ALT-1174 completado.',
    '  Payload: 4.2 metric tons barium sulfate compound':
      '  Carga: 4,2 toneladas métricas de compuesto de sulfato de bario',
    '  Target: Atlantic hurricane formation zone':
      '  Objetivo: Zona de formación de huracanes del Atlántico',
    '  Altitude: 38,000 ft': '  Altitud: 38.000 pies',
    '  Duration: 6.4 hours': '  Duración: 6,4 horas',
    '15-OCT-1995 1400': '15-OCT-1995 1400',
    '  Post-dispersal analysis indicates successful seeding.':
      '  El análisis post-dispersión indica siembra exitosa.',
    '  Projected storm TD-17 failed to organize.':
      '  La tormenta proyectada TD-17 no logró organizarse.',
    '  NOTE: Unintended precipitation in [REDACTED] region.':
      '  NOTA: Precipitación no intencionada en la región [REDACTADO].',
    '23-NOV-1995 0800': '23-NOV-1995 0800',
    '  Flight ALT-1198 encountered mechanical issues.':
      '  El vuelo ALT-1198 encontró problemas mecánicos.',
    '  Payload released early over continental area.':
      '  Carga liberada prematuramente sobre área continental.',
    '  INCIDENT REPORT FILED. Cover story: contrail testing.':
      '  INFORME DE INCIDENTE REGISTRADO. Historia de cobertura: pruebas de estelas.',
    '07-DEC-1995 1100': '07-DIC-1995 1100',
    '  Side effect observation: Increased respiratory':
      '  Observación de efecto secundario: Aumento de quejas',
    '  complaints in dispersal corridor populations.':
      '  respiratorias en las poblaciones del corredor de dispersión.',
    '  Recommend adjusting compound mixture for Q1 1996.':
      '  Se recomienda ajustar la mezcla del compuesto para Q1 1996.',
    '14-JAN-1996 0900': '14-ENE-1996 0900',
    '  New directive received: Expand program to include':
      '  Nueva directiva recibida: Expandir el programa para incluir',
    '  reflective particulate testing for solar management.':
      '  pruebas de partículas reflectivas para gestión solar.',
    '  Aluminum oxide compounds approved for trial.':
      '  Compuestos de óxido de aluminio aprobados para prueba.',
    'END LOG — NEXT REVIEW: 01-APR-1996': 'FIN DEL REGISTRO — PRÓXIMA REVISIÓN: 01-ABR-1996',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 4 — BEHAVIORAL COMPLIANCE STUDY
    // ═══════════════════════════════════════════════════════════
    'CONSUMER BEHAVIOR RESEARCH — ACOUSTIC INFLUENCE STUDY':
      'INVESTIGACIÓN DE COMPORTAMIENTO DEL CONSUMIDOR — ESTUDIO DE INFLUENCIA ACÚSTICA',
    'PROJECT: TEMPO': 'PROYECTO: TEMPO',
    'DATE: Q4 1995 FINAL REPORT': 'FECHA: INFORME FINAL Q4 1995',
    'STUDY OVERVIEW:': 'RESUMEN DEL ESTUDIO:',
    '  In partnership with [REDACTED] retail chains, this study':
      '  En asociación con cadenas minoristas [REDACTADO], este estudio',
    '  evaluated the effect of ambient audio parameters on':
      '  evaluó el efecto de parámetros de audio ambiental en los',
    '  consumer behavior patterns.': '  patrones de comportamiento del consumidor.',
    'METHODOLOGY:': 'METODOLOGÍA:',
    '  - 847 retail locations participated': '  - 847 ubicaciones minoristas participaron',
    '  - Music tempo varied from 60-120 BPM across test groups':
      '  - Tempo musical variado de 60-120 BPM entre grupos de prueba',
    '  - Subliminal audio tones embedded at 17.5 Hz':
      '  - Tonos de audio subliminal incrustados a 17,5 Hz',
    '  - Control group received standard muzak programming':
      '  - Grupo control recibió programación muzak estándar',
    'FINDINGS:': 'HALLAZGOS:',
    '  1. TEMPO CORRELATION': '  1. CORRELACIÓN DE TEMPO',
    '     - 72 BPM: 18% increase in browsing duration':
      '     - 72 BPM: aumento del 18% en duración de navegación',
    '     - 108 BPM: 23% increase in purchase velocity':
      '     - 108 BPM: aumento del 23% en velocidad de compra',
    '     - 60 BPM: Measurable increase in high-margin purchases':
      '     - 60 BPM: Aumento medible en compras de alto margen',
    '  2. SUBLIMINAL TONE EFFECTS': '  2. EFECTOS DE TONO SUBLIMINAL',
    '     - 17.5 Hz baseline: Elevated stress markers':
      '     - 17,5 Hz línea base: Marcadores de estrés elevados',
    '     - 12 Hz modification: Reduced price sensitivity':
      '     - Modificación 12 Hz: Sensibilidad al precio reducida',
    '     - Combined with verbal suggestions: Inconclusive':
      '     - Combinado con sugestiones verbales: Inconcluso',
    '  3. OPTIMAL CONFIGURATION': '  3. CONFIGURACIÓN ÓPTIMA',
    '     - Morning: 108 BPM (urgency)': '     - Mañana: 108 BPM (urgencia)',
    '     - Afternoon: 72 BPM (extended browsing)': '     - Tarde: 72 BPM (navegación extendida)',
    '     - Pre-closing: 120 BPM (clear out)': '     - Pre-cierre: 120 BPM (desalojo)',
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
    'CLASSIFICATION: RESTRICTED': 'CLASIFICACIÓN: RESTRINGIDA',
    'DATE: SEP 1995': 'FECHA: SEP 1995',
    'EXERCISE OBJECTIVE:': 'OBJETIVO DEL EJERCICIO:',
    '  Evaluate civil response to extended grid failure with':
      '  Evaluar la respuesta civil ante falla prolongada de la red con',
    '  concurrent communications infrastructure collapse.':
      '  colapso simultáneo de la infraestructura de comunicaciones.',
    'SIMULATION PARAMETERS:': 'PARÁMETROS DE LA SIMULACIÓN:',
    '  - Duration: 72 hours (extended to 168 hours)':
      '  - Duración: 72 horas (extendido a 168 horas)',
    '  - Population centers: 3 metropolitan areas':
      '  - Centros de población: 3 áreas metropolitanas',
    '  - Communications: Landline and cellular disabled':
      '  - Comunicaciones: Telefonía fija y celular desactivadas',
    '  - Emergency services: Degraded capacity (40%)':
      '  - Servicios de emergencia: Capacidad degradada (40%)',
    'PHASE RESULTS:': 'RESULTADOS POR FASE:',
    '  0-12 HOURS:': '  0-12 HORAS:',
    '    - Civil order maintained': '    - Orden civil mantenido',
    '    - Emergency calls exceeded capacity by hour 4':
      '    - Las llamadas de emergencia excedieron capacidad en la hora 4',
    '    - Fuel station queues exceeded 2 miles': '    - Las filas en gasolineras excedieron 3 km',
    '  12-48 HOURS:': '  12-48 HORAS:',
    '    - Significant increase in property crime':
      '    - Aumento significativo en delitos contra la propiedad',
    '    - Hospital generators failed in 2 facilities':
      '    - Generadores hospitalarios fallaron en 2 instalaciones',
    '    - Water pressure loss in elevated areas':
      '    - Pérdida de presión de agua en áreas elevadas',
    '  48-168 HOURS:': '  48-168 HORAS:',
    '    - Civil order breakdown in [REDACTED] sector':
      '    - Colapso del orden civil en el sector [REDACTADO]',
    '    - National Guard deployment simulated at hour 96':
      '    - Despliegue de la Guardia Nacional simulado en la hora 96',
    '    - Food supply chain: Total collapse by hour 120':
      '    - Cadena de suministro alimentario: Colapso total en la hora 120',
    'KEY FINDING:': 'HALLAZGO CLAVE:',
    '  Without communication infrastructure, civil order':
      '  Sin infraestructura de comunicación, el orden civil',
    '  degrades to critical level within 72 hours.': '  se degrada a nivel crítico en 72 horas.',
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
    'CONTINENTAL AVIAN SURVEILLANCE NETWORK': 'RED CONTINENTAL DE VIGILANCIA AVIAR',
    'QUARTERLY DEPLOYMENT REPORT — Q4 1995': 'INFORME TRIMESTRAL DE DESPLIEGUE — Q4 1995',
    'UNIT_ID,SPECIES_COVER,REGION,BATTERY_LIFE,PAYLOAD':
      'ID_UNIDAD,ESPECIE_COBERTURA,REGIÓN,VIDA_BATERÍA,CARGA',
    'DEPLOYMENT NOTES:': 'NOTAS DE DESPLIEGUE:',
    '  - Q4 migration routes successfully tracked':
      '  - Rutas migratorias Q4 rastreadas exitosamente',
    '  - Signal relay coverage: 94.2% continental':
      '  - Cobertura de retransmisión de señal: 94,2% continental',
    '  - Urban density exceeds rural by factor of 8.4':
      '  - La densidad urbana excede la rural por factor de 8,4',
    '  - Maintenance disguised as "wildlife research"':
      '  - Mantenimiento disfrazado como "investigación de vida silvestre"',
    'ANOMALY LOG:': 'REGISTRO DE ANOMALÍAS:',
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
    'PROJECT: WHISPER': 'PROYECTO: WHISPER',
    'DATE: 19-DEC-1995': 'FECHA: 19-DIC-1995',
    'TO: Technical Collection Division': 'PARA: División de Recolección Técnica',
    'FROM: Consumer Electronics Liaison': 'DE: Enlace de Electrónicos de Consumo',
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
    '  - Clock radios (prototype phase)': '  - Radiodespertadores (fase de prototipo)',
    'CAPABILITIES:': 'CAPACIDADES:',
    '  - Continuous ambient audio capture': '  - Captura continua de audio ambiental',
    '  - Keyword activation for priority recording':
      '  - Activación por palabra clave para grabación prioritaria',
    '  - Emotional distress pattern detection (experimental)':
      '  - Detección de patrones de angustia emocional (experimental)',
    '  - Data burst transmission during off-peak hours':
      '  - Transmisión de datos en ráfaga durante horas fuera de pico',
    'PRIVACY CONCERNS:': 'PREOCUPACIONES DE PRIVACIDAD:',
    '  Legal has advised that current wiretap statutes':
      '  Legal ha informado que los estatutos actuales de escucha',
    '  do not explicitly cover ambient collection from':
      '  no cubren explícitamente la recolección ambiental de',
    '  voluntarily purchased consumer devices.':
      '  dispositivos de consumo adquiridos voluntariamente.',
    '  Recommend maintaining this legal ambiguity.':
      '  Se recomienda mantener esta ambigüedad legal.',
    'NEXT PHASE:': 'PRÓXIMA FASE:',
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
    'NOTICE: DMD-1995-47': 'AVISO: DMD-1995-47',
    'DATE: 03-OCT-1995': 'FECHA: 03-OCT-1995',
    'SUBJECT: Historical Image Archive Modernization':
      'ASUNTO: Modernización del Archivo de Imágenes Históricas',
    'DIRECTIVE:': 'DIRECTIVA:',
    '  As part of our digital preservation initiative, all':
      '  Como parte de nuestra iniciativa de preservación digital, todos los',
    '  historical photographic records are being converted':
      '  registros fotográficos históricos están siendo convertidos',
    '  to digital format using the MASTER CLEAN protocol.':
      '  a formato digital usando el protocolo MASTER CLEAN.',
    'PROCEDURE:': 'PROCEDIMIENTO:',
    '  1. Original photographs scanned at high resolution':
      '  1. Fotografías originales escaneadas en alta resolución',
    '  2. Digital restoration applied per Guidelines Appendix C':
      '  2. Restauración digital aplicada según Apéndice C de las Directrices',
    '  3. "Cleaned master versions" replace originals in archive':
      '  3. "Versiones maestras limpias" reemplazan originales en el archivo',
    '  4. Original prints transferred to [REDACTED] facility':
      '  4. Copias originales transferidas a instalación [REDACTADO]',
    'RESTORATION GUIDELINES (EXCERPT):': 'DIRECTRICES DE RESTAURACIÓN (EXTRACTO):',
    '  - Remove inadvertent civilian faces (privacy)':
      '  - Eliminar rostros civiles inadvertidos (privacidad)',
    '  - Correct lighting inconsistencies': '  - Corregir inconsistencias de iluminación',
    '  - Standardize official personnel positioning':
      '  - Estandarizar posicionamiento del personal oficial',
    '  - Eliminate background elements causing "confusion"':
      '  - Eliminar elementos de fondo que causan "confusión"',
    'SPECIAL HANDLING:': 'MANEJO ESPECIAL:',
    '  Images flagged in Categories 7-12 require review by':
      '  Las imágenes marcadas en las Categorías 7-12 requieren revisión por',
    '  Historical Accuracy Committee before digitization.':
      '  el Comité de Precisión Histórica antes de la digitalización.',
    '  These include:': '  Incluyen:',
    '    - Political figures in "inconsistent" contexts':
      '    - Figuras políticas en contextos "inconsistentes"',
    '    - Military operations with "unclear" narratives':
      '    - Operaciones militares con narrativas "poco claras"',
    '    - Events with "disputed" official records':
      '    - Eventos con registros oficiales "disputados"',
    'NOTE: This process is administrative only.': 'NOTA: Este proceso es solo administrativo.',
    '      No historical record is being altered.':
      '      Ningún registro histórico está siendo alterado.',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 9 — EDUCATION CURRICULUM REVISION
    // ═══════════════════════════════════════════════════════════
    'CURRICULUM ADVISORY COMMITTEE — WORKING NOTES':
      'COMITÉ ASESOR DE CURRÍCULO — NOTAS DE TRABAJO',
    'MEETING: 14-AUG-1995': 'REUNIÓN: 14-AGO-1995',
    'CLASSIFICATION: INTERNAL': 'CLASIFICACIÓN: INTERNA',
    'ATTENDEES: [REDACTED]': 'ASISTENTES: [REDACTADO]',
    'AGENDA ITEM 3: Historical Narrative Simplification':
      'PUNTO DE AGENDA 3: Simplificación de la Narrativa Histórica',
    'DISCUSSION SUMMARY:': 'RESUMEN DE LA DISCUSIÓN:',
    '  Committee reviewed proposals for streamlining historical':
      '  El comité revisó propuestas para simplificar el contenido',
    '  content in secondary education materials.':
      '  histórico en los materiales de educación secundaria.',
    'KEY RECOMMENDATIONS:': 'RECOMENDACIONES CLAVE:',
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
    'RATIONALE:': 'JUSTIFICACIÓN:',
    '  Research indicates complex narratives correlate with:':
      '  La investigación indica que las narrativas complejas se correlacionan con:',
    '    - Reduced institutional trust': '    - Confianza institucional reducida',
    '    - Increased political polarization': '    - Polarización política aumentada',
    '    - Lower social cohesion metrics': '    - Métricas de cohesión social más bajas',
    '  Simplified narratives support unified civic identity.':
      '  Las narrativas simplificadas apoyan la identidad cívica unificada.',
    'IMPLEMENTATION:': 'IMPLEMENTACIÓN:',
    '  - Phase out nuanced source analysis by Grade 10':
      '  - Eliminar gradualmente el análisis crítico de fuentes para el 10° grado',
    '  - Emphasize "shared heritage" over critical evaluation':
      '  - Enfatizar "patrimonio compartido" sobre evaluación crítica',
    '  - Textbook publishers to receive guidelines Q1 1996':
      '  - Las editoriales de libros de texto recibirán directrices Q1 1996',
    'MOTION CARRIED: 7-2': 'MOCIÓN APROBADA: 7-2',
    '[END NOTES]': '[FIN DE LAS NOTAS]',

    // ═══════════════════════════════════════════════════════════
    // CONSPIRACY FILE 10 — SATELLITE LIGHT REFLECTION
    // ═══════════════════════════════════════════════════════════
    'PROJECT NIGHTLIGHT — FEASIBILITY ASSESSMENT': 'PROYECTO NIGHTLIGHT — EVALUACIÓN DE VIABILIDAD',
    'DATE: 22-NOV-1995': 'FECHA: 22-NOV-1995',
    'OBJECTIVE:': 'OBJETIVO:',
    '  Evaluate deployment of orbital reflective arrays for':
      '  Evaluar el despliegue de conjuntos reflectivos orbitales para',
    '  urban illumination and psychological operations.':
      '  iluminación urbana y operaciones psicológicas.',
    'TECHNICAL SUMMARY:': 'RESUMEN TÉCNICO:',
    '  - Mylar reflector panels: 500m² deployed area':
      '  - Paneles reflectores de Mylar: área desplegada de 500m²',
    '  - Orbital altitude: 400km (ISS equivalent)': '  - Altitud orbital: 400km (equivalente ISS)',
    '  - Ground illumination: ~10% full moon equivalent':
      '  - Iluminación terrestre: ~10% equivalente a luna llena',
    '  - Targeting precision: 50km radius spotlight':
      '  - Precisión de objetivo: reflector de radio de 50km',
    'TEST RESULTS:': 'RESULTADOS DE LAS PRUEBAS:',
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
    'APPLICATIONS:': 'APLICACIONES:',
    '  1. Emergency illumination during disasters':
      '  1. Iluminación de emergencia durante desastres',
    '  2. Agricultural growing season extension':
      '  2. Extensión de la temporada agrícola de cultivo',
    '  3. Urban crime reduction via night visibility':
      '  3. Reducción del crimen urbano vía visibilidad nocturna',
    '  4. [CLASSIFIED] psychological operations capability':
      '  4. [CLASIFICADO] capacidad de operaciones psicológicas',
    'CONCERNS:': 'PREOCUPACIONES:',
    '  - Astronomical community interference likely':
      '  - Interferencia de la comunidad astronómica probable',
    '  - Religious/cultural reactions unpredictable':
      '  - Reacciones religiosas/culturales impredecibles',
    '  - Light pollution effects unknown': '  - Efectos de contaminación lumínica desconocidos',
    '  Continue covert testing. Full deployment contingent':
      '  Continuar pruebas encubiertas. Despliegue total contingente',
    '  on cover story development and international':
      '  al desarrollo de historia de cobertura y protocolos',
    '  notification protocols.': '  de notificación internacional.',
    // ═══ expansionContent.ts — journalist_payments ═══
    '[ENCRYPTED - FINANCIAL RECORDS]': '[ENCRIPTADO - REGISTROS FINANCIEROS]',
    'Legacy wrapper retired. Open the file to review the recovered record.':
      'Wrapper heredado retirado. Abra el archivo para revisar el registro recuperado.',
    'WARNING: Unauthorized access to financial records':
      'ADVERTENCIA: El acceso no autorizado a registros financieros',
    'is punishable under Article 317.': 'es punible bajo el Artículo 317.',
    'DISBURSEMENT RECORD — MEDIA RELATIONS': 'REGISTRO DE DESEMBOLSO — RELACIONES CON MEDIOS',
    'ACCOUNT: SPECIAL OPERATIONS FUND': 'CUENTA: FONDO DE OPERACIONES ESPECIALES',
    'PERIOD: JAN-FEB 1996': 'PERÍODO: ENE-FEB 1996',
    'CLASSIFICATION: EYES ONLY': 'CLASIFICACIÓN: SOLO PARA SUS OJOS',
    'PAYMENTS AUTHORIZED:': 'PAGOS AUTORIZADOS:',
    '  23-JAN — R$ 15,000.00 — RODRIGUES, A.': '  23-ENE — R$ 15.000,00 — RODRIGUES, A.',
    '           Outlet: O Diário Nacional (Rio bureau)':
      '           Medio: O Diário Nacional (oficina de Río)',
    '           Purpose: Story suppression': '           Propósito: Supresión de reportaje',
    '           Status: CONFIRMED KILL': '           Estado: ELIMINACIÓN CONFIRMADA',
    '  25-JAN — R$ 8,500.00 — NASCIMENTO, C.': '  25-ENE — R$ 8.500,00 — NASCIMENTO, C.',
    '           Outlet: Folha Paulista': '           Medio: Folha Paulista',
    '           Purpose: Alternate narrative placement':
      '           Propósito: Inserción de narrativa alternativa',
    '           Status: PUBLISHED (homeless man angle)':
      '           Estado: PUBLICADO (ángulo del indigente)',
    '  27-JAN — R$ 22,000.00 — [REDACTED]': '  27-ENE — R$ 22.000,00 — [SUPRIMIDO]',
    '           Outlet: Rede Nacional (TV)': '           Medio: Rede Nacional (TV)',
    '           Purpose: Programa Dominical segment cancellation':
      '           Propósito: Cancelación de segmento del Programa Dominical',
    '           Status: SEGMENT PULLED': '           Estado: SEGMENTO RETIRADO',
    '  30-JAN — R$ 5,000.00 — COSTA, R.': '  30-ENE — R$ 5.000,00 — COSTA, R.',
    '           Outlet: Estado de Minas': '           Medio: Estado de Minas',
    '           Purpose: Editorial pressure': '           Propósito: Presión editorial',
    '           Status: OPINION PIECE SPIKED': '           Estado: ARTÍCULO DE OPINIÓN VETADO',
    '  02-FEB — R$ 12,000.00 — FERREIRA, J.': '  02-FEB — R$ 12.000,00 — FERREIRA, J.',
    '           Outlet: Revista Isto': '           Medio: Revista Isto',
    '           Purpose: Issue delay (cover story change)':
      '           Propósito: Retraso de edición (cambio de portada)',
    '           Status: MARCH ISSUE SUBSTITUTED': '           Estado: EDICIÓN DE MARZO SUSTITUIDA',
    'TOTAL DISBURSED: R$ 62,500.00': 'TOTAL DESEMBOLSADO: R$ 62.500,00',
    'NOTE: All payments routed through agricultural cooperative':
      'NOTA: Todos los pagos canalizados a través de cooperativa agrícola',
    '      shell account. Paper trail clean.': '      cuenta fantasma. Rastro documental limpio.',
    'APPROVED: [SIGNATURE REDACTED]': 'APROBADO: [FIRMA SUPRIMIDA]',
    // ═══ expansionContent.ts — media_contacts ═══
    'MEDIA CONTACTS — COOPERATIVE JOURNALISTS': 'CONTACTOS EN MEDIOS — PERIODISTAS COOPERATIVOS',
    'COMPILED: DECEMBER 1995 (UPDATED JAN 1996)':
      'COMPILADO: DICIEMBRE 1995 (ACTUALIZADO ENE 1996)',
    'TELEVISION:': 'TELEVISIÓN:',
    '  Rede Nacional (TV Nacional)': '  Rede Nacional (TV Nacional)',
    '    SANTOS, Eduardo — News Director': '    SANTOS, Eduardo — Director de Noticias',
    '    Direct line: (021) 555-7823': '    Línea directa: (021) 555-7823',
    '    Reliability: HIGH': '    Confiabilidad: ALTA',
    '    History: Cooperative since 1989': '    Historial: Cooperativo desde 1989',
    '  TV Regional Sul': '  TV Regional Sul',
    '    [REDACTED] — Assignment Editor': '    [SUPRIMIDO] — Editor de Asignaciones',
    '    Direct line: (035) 555-4412': '    Línea directa: (035) 555-4412',
    '    Reliability: MODERATE': '    Confiabilidad: MODERADA',
    '    Note: Requires advance notice': '    Nota: Requiere aviso previo',
    'PRINT:': 'PRENSA:',
    '  O Diário Nacional': '  O Diário Nacional',
    '    RODRIGUES, André — City Desk Chief': '    RODRIGUES, André — Jefe de Redacción Local',
    '    Direct line: (021) 555-9034': '    Línea directa: (021) 555-9034',
    '    Note: Has killed 3 stories for us': '    Nota: Ha eliminado 3 reportajes para nosotros',
    '  Folha Paulista': '  Folha Paulista',
    '    [REDACTED] — Senior Editor': '    [SUPRIMIDO] — Editor Senior',
    '    Direct line: (011) 555-2156': '    Línea directa: (011) 555-2156',
    '    Note: Prefers placement over suppression': '    Nota: Prefiere inserción sobre supresión',
    '  Estado de Minas': '  Estado de Minas',
    '    PEREIRA, Helena — Regional Bureau': '    PEREIRA, Helena — Oficina Regional',
    '    Direct line: (031) 555-8877': '    Línea directa: (031) 555-8877',
    '    Reliability: HIGH (local knowledge)': '    Confiabilidad: ALTA (conocimiento local)',
    '    Note: Family connection to military': '    Nota: Conexión familiar con lo militar',
    'MAGAZINES:': 'REVISTAS:',
    '  Revista Isto': '  Revista Isto',
    '    ALMEIDA, Ricardo — Features Editor': '    ALMEIDA, Ricardo — Editor de Reportajes',
    '    Direct line: (011) 555-6543': '    Línea directa: (011) 555-6543',
    '    Note: Slow but reliable': '    Nota: Lento pero confiable',
    'AVOID:': 'EVITAR:',
    '  Revista Fenômenos (UFO publication)': '  Revista Fenômenos (publicación sobre OVNIs)',
    '    CANNOT be controlled': '    NO PUEDE ser controlado',
    '    Editor PACACCINI known hostile': '    Editor PACACCINI conocido como hostil',
    '    Monitor only, do not engage': '    Solo monitorear, no intervenir',
    // ═══ expansionContent.ts — kill_story_memo ═══
    'URGENT MEMORANDUM — MEDIA SUPPRESSION': 'MEMORANDO URGENTE — SUPRESIÓN DE MEDIOS',
    'DATE: 26-JAN-1996': 'FECHA: 26-ENE-1996',
    'FROM: Public Affairs Liaison': 'DE: Enlace de Asuntos Públicos',
    'TO: Regional Directors': 'PARA: Directores Regionales',
    'SUBJECT: Immediate Action Required': 'ASUNTO: Acción Inmediata Requerida',
    'The following stories are in development and must be':
      'Los siguientes reportajes están en desarrollo y deben ser',
    'suppressed before publication/broadcast:': 'suprimidos antes de su publicación/transmisión:',
    '1. PROGRAMA DOMINICAL (Rede Nacional)': '1. PROGRAMA DOMINICAL (Rede Nacional)',
    '   Scheduled: Sunday 28-JAN, 21:00': '   Programado: Domingo 28-ENE, 21:00',
    '   Topic: "Varginha Mystery — What the Military Hides"':
      '   Tema: "Misterio de Varginha — Lo Que Ocultan los Militares"',
    '   Status: KILL CONFIRMED': '   Estado: ELIMINACIÓN CONFIRMADA',
    '   Action: Contact made with news director':
      '   Acción: Contacto realizado con director de noticias',
    '   Replacement segment: Carnival preparations':
      '   Segmento sustituto: Preparativos para el Carnaval',
    '2. FOLHA PAULISTA': '2. FOLHA PAULISTA',
    '   Scheduled: 29-JAN morning edition': '   Programado: 29-ENE edición matutina',
    '   Topic: Front page investigation piece': '   Tema: Artículo de investigación de portada',
    '   Status: IN PROGRESS': '   Estado: EN CURSO',
    '   Action: Redirect to "homeless man" angle': '   Acción: Redirigir al ángulo del "indigente"',
    '   Payment: Authorized': '   Pago: Autorizado',
    '3. REVISTA ISTO': '3. REVISTA ISTO',
    '   Scheduled: February issue (already at printer)':
      '   Programado: Edición de febrero (ya en imprenta)',
    '   Topic: 8-page cover story': '   Tema: Reportaje de portada de 8 páginas',
    '   Status: CRITICAL': '   Estado: CRÍTICO',
    '   Action: Delay print run, substitute cover':
      '   Acción: Retrasar impresión, sustituir portada',
    '   Note: Higher payment required': '   Nota: Se requiere pago mayor',
    'APPROACH GUIDELINES:': 'DIRECTRICES DE ABORDAJE:',
    '  - Lead with "national security" concern':
      '  - Liderar con preocupación de "seguridad nacional"',
    '  - Offer exclusive on substitute story': '  - Ofrecer exclusiva en reportaje sustituto',
    '  - Payment is last resort': '  - El pago es último recurso',
    '  - Document nothing in writing': '  - No documentar nada por escrito',
    'ESCALATION:': 'ESCALAMIENTO:',
    '  If journalist is uncooperative, refer to': '  Si el periodista no coopera, referir al',
    '  Protocol SOMBRA for additional measures.': '  Protocolo SOMBRA para medidas adicionales.',
    // ═══ expansionContent.ts — tv_coverage_report ═══
    'INTELLIGENCE REPORT — TV COVERAGE THREAT':
      'INFORME DE INTELIGENCIA — AMENAZA DE COBERTURA TELEVISIVA',
    'DATE: 25-JAN-1996': 'FECHA: 25-ENE-1996',
    'PRIORITY: HIGH': 'PRIORIDAD: ALTA',
    'SUBJECT: Programa Dominical (Rede Nacional)': 'ASUNTO: Programa Dominical (Rede Nacional)',
    "  Brazil's highest-rated Sunday program.":
      '  Programa dominical de mayor audiencia de Brasil.',
    '  Audience: 40+ million viewers.': '  Audiencia: 40+ millones de televidentes.',
    '  Time slot: 21:00-23:30': '  Franja horaria: 21:00-23:30',
    'THREAT ASSESSMENT:': 'EVALUACIÓN DE AMENAZA:',
    '  Production team dispatched to Varginha 24-JAN.':
      '  Equipo de producción enviado a Varginha 24-ENE.',
    '  Interviewed local witnesses (uncontrolled).':
      '  Entrevistaron testigos locales (sin control).',
    '  Obtained amateur video footage (unverified).':
      '  Obtuvieron filmaciones amateur (no verificadas).',
    '  Segment scheduled for 28-JAN broadcast.':
      '  Segmento programado para transmisión del 28-ENE.',
    'CONTENT PREVIEW (obtained via source):': 'VISTA PREVIA DEL CONTENIDO (obtenida vía fuente):',
    '  - Interviews with the three sisters': '  - Entrevistas con las tres hermanas',
    '  - Military vehicle footage': '  - Filmaciones de vehículos militares',
    '  - Hospital security guard statement':
      '  - Declaración del guardia de seguridad del hospital',
    '  - "Expert" commentary (civilian ufologist)': '  - Comentario de "experto" (ufólogo civil)',
    'DAMAGE POTENTIAL:': 'POTENCIAL DE DAÑO:',
    '  SEVERE — Nationwide exposure impossible to contain':
      '  SEVERO — Exposición nacional imposible de contener',
    '  Would legitimize story for international pickup':
      '  Legitimaría el reportaje para repercusión internacional',
    'RECOMMENDED ACTION:': 'ACCIÓN RECOMENDADA:',
    '  1. Contact news director SANTOS immediately':
      '  1. Contactar al director de noticias SANTOS inmediatamente',
    '  2. Invoke national security clause': '  2. Invocar cláusula de seguridad nacional',
    '  3. Offer substitute exclusive (suggest carnival)':
      '  3. Ofrecer exclusiva sustituta (sugerir carnaval)',
    '  4. If necessary, escalate to network ownership':
      '  4. Si es necesario, escalar a la directiva de la cadena',
    'STATUS: ACTION IN PROGRESS': 'ESTADO: ACCIÓN EN CURSO',
    // ═══ expansionContent.ts — foreign_press_alert ═══
    'ALERT — FOREIGN PRESS INTEREST': 'ALERTA — INTERÉS DE LA PRENSA EXTRANJERA',
    'DATE: 15-JUN-1996': 'FECHA: 15-JUN-1996',
    'SUBJECT: American Business Journal Investigation':
      'ASUNTO: Investigación del American Business Journal',
    'SITUATION:': 'SITUACIÓN:',
    '  The American Business Journal (New York) has assigned':
      '  El American Business Journal (Nueva York) ha asignado al',
    '  correspondent J. BROOKE to investigate the incident.':
      '  corresponsal J. BROOKE para investigar el incidente.',
    'JOURNALIST PROFILE:': 'PERFIL DEL PERIODISTA:',
    '  Name: James BROOKE': '  Nombre: James BROOKE',
    '  Bureau: Rio de Janeiro': '  Oficina: Río de Janeiro',
    '  Background: 12 years Latin America coverage':
      '  Experiencia: 12 años de cobertura en América Latina',
    '  Assessment: PROFESSIONAL, PERSISTENT': '  Evaluación: PROFESIONAL, PERSISTENTE',
    'KNOWN ACTIVITIES:': 'ACTIVIDADES CONOCIDAS:',
    '  - Filed FOIA request with Brazilian Air Force':
      '  - Presentó solicitud de información ante la Fuerza Aérea Brasileña',
    '  - Contacted regional hospital administration':
      '  - Contactó la administración del hospital regional',
    '  - Attempted interview with fire department':
      '  - Intentó entrevista con el cuerpo de bomberos',
    '  - Visited Jardim Andere neighborhood': '  - Visitó el barrio Jardim Andere',
    'ARTICLE STATUS:': 'ESTADO DEL ARTÍCULO:',
    '  Scheduled publication: Late June 1996': '  Publicación prevista: Finales de junio de 1996',
    '  Expected tone: Skeptical but thorough': '  Tono esperado: Escéptico pero minucioso',
    '  Likely angle: Military secrecy, witness accounts':
      '  Ángulo probable: Secreto militar, testimonios de testigos',
    '  1. Do NOT engage directly': '  1. NO intervenir directamente',
    '     (Foreign journalist = different rules)':
      '     (Periodista extranjero = reglas diferentes)',
    '  2. Prepare official statement emphasizing:':
      '  2. Preparar declaración oficial enfatizando:',
    '     - Weather balloon explanation': '     - Explicación del globo meteorológico',
    '     - Witness confusion/hysteria': '     - Confusión/histeria de los testigos',
    '     - No military involvement': '     - Ninguna participación militar',
    '  3. Brief cooperative Brazilian sources to:':
      '  3. Instruir a fuentes brasileñas cooperativas para:',
    '     - Cast doubt on witnesses': '     - Poner en duda a los testigos',
    '     - Emphasize "Mudinho" explanation': '     - Enfatizar explicación de "Mudinho"',
    '     - Suggest mass hysteria angle': '     - Sugerir ángulo de histeria colectiva',
    '  4. Monitor publication and prepare response':
      '  4. Monitorear publicación y preparar respuesta',
    'NOTE: Cannot use domestic suppression tactics.':
      'NOTA: No se pueden usar tácticas de supresión domésticas.',
    '      International outlet requires different approach.':
      '      Medio internacional requiere enfoque diferente.',
    // ═══ expansionContent.ts — witness_visit_log ═══
    'WITNESS CONTACT LOG — OPERATION SILÊNCIO':
      'REGISTRO DE CONTACTO CON TESTIGOS — OPERACIÓN SILÊNCIO',
    'PERIOD: 21-JAN to 15-FEB 1996': 'PERÍODO: 21-ENE a 15-FEB 1996',
    'VISIT #001': 'VISITA #001',
    '  Date: 21-JAN-1996, 22:00': '  Fecha: 21-ENE-1996, 22:00',
    '  Subject: WITNESS-1 (primary witness, eldest sister)':
      '  Sujeto: WITNESS-1 (testigo principal, hermana mayor)',
    '  Location: Residence, Jardim Andere': '  Ubicación: Residencia, Jardim Andere',
    '  Team: COBRA-1, COBRA-2': '  Equipo: COBRA-1, COBRA-2',
    '  Duration: 45 minutes': '  Duración: 45 minutos',
    '  Outcome: COOPERATIVE (see recantation form)':
      '  Resultado: COOPERATIVO (ver formulario de retractación)',
    'VISIT #002': 'VISITA #002',
    '  Date: 21-JAN-1996, 23:30': '  Fecha: 21-ENE-1996, 23:30',
    '  Subject: WITNESS-2 (middle sister)': '  Sujeto: WITNESS-2 (hermana del medio)',
    '  Duration: 30 minutes': '  Duración: 30 minutos',
    '  Outcome: COOPERATIVE': '  Resultado: COOPERATIVO',
    'VISIT #003': 'VISITA #003',
    '  Date: 22-JAN-1996, 06:00': '  Fecha: 22-ENE-1996, 06:00',
    '  Subject: WITNESS-3 (youngest sister)': '  Sujeto: WITNESS-3 (hermana menor)',
    '  Location: Workplace': '  Ubicación: Lugar de trabajo',
    '  Team: COBRA-3, COBRA-4': '  Equipo: COBRA-3, COBRA-4',
    '  Duration: 20 minutes': '  Duración: 20 minutos',
    '  Outcome: RESISTANT — follow-up required': '  Resultado: RESISTENTE — seguimiento requerido',
    'VISIT #004': 'VISITA #004',
    '  Date: 22-JAN-1996, 14:00': '  Fecha: 22-ENE-1996, 14:00',
    '  Subject: [REDACTED] (fire dept. dispatcher)':
      '  Sujeto: [SUPRIMIDO] (despachador del cuerpo de bomberos)',
    '  Location: Fire station': '  Ubicación: Estación de bomberos',
    '  Duration: 35 minutes': '  Duración: 35 minutos',
    '  Note: Agreed to "no comment" position': '  Nota: Aceptó posición de "sin comentarios"',
    'VISIT #005': 'VISITA #005',
    '  Date: 23-JAN-1996, 19:00': '  Fecha: 23-ENE-1996, 19:00',
    '  Subject: WITNESS-3 (follow-up)': '  Sujeto: WITNESS-3 (seguimiento)',
    '  Location: Residence': '  Ubicación: Residencia',
    '  Team: COBRA-1, COBRA-2, COBRA-5': '  Equipo: COBRA-1, COBRA-2, COBRA-5',
    '  Duration: 90 minutes': '  Duración: 90 minutos',
    '  Note: Extended persuasion required': '  Nota: Persuasión prolongada requerida',
    'VISIT #006': 'VISITA #006',
    '  Date: 24-JAN-1996, 08:00': '  Fecha: 24-ENE-1996, 08:00',
    '  Subject: [REDACTED] (hospital orderly)': '  Sujeto: [SUPRIMIDO] (auxiliar hospitalario)',
    '  Location: Hospital Regional': '  Ubicación: Hospital Regional',
    '  Duration: 25 minutes': '  Duración: 25 minutos',
    '  Note: Signed NDA, received severance':
      '  Nota: Firmó acuerdo de confidencialidad, recibió indemnización',
    'VISIT #007': 'VISITA #007',
    '  Date: 25-JAN-1996, 20:00': '  Fecha: 25-ENE-1996, 20:00',
    '  Subject: FERREIRA, Ana (zoo veterinarian)':
      '  Sujeto: FERREIRA, Ana (veterinaria del zoológico)',
    '  Duration: 55 minutes': '  Duración: 55 minutos',
    '  Outcome: PARTIALLY COOPERATIVE': '  Resultado: PARCIALMENTE COOPERATIVO',
    '  Note: See zoo incident file': '  Nota: Ver archivo del incidente del zoológico',
    'TOTAL CONTACTS: 14': 'TOTAL DE CONTACTOS: 14',
    'COOPERATIVE: 12': 'COOPERATIVOS: 12',
    'RESISTANT: 2 (resolved)': 'RESISTENTES: 2 (resueltos)',
    // ═══ expansionContent.ts — debriefing_protocol ═══
    'STANDARD OPERATING PROCEDURE': 'PROCEDIMIENTO OPERATIVO ESTÁNDAR',
    'WITNESS DEBRIEFING — PROTOCOL SOMBRA': 'INTERROGATORIO DE TESTIGOS — PROTOCOLO SOMBRA',
    'PURPOSE:': 'PROPÓSITO:',
    '  To ensure civilian witnesses maintain silence':
      '  Asegurar que los testigos civiles mantengan silencio',
    '  regarding classified incidents.': '  respecto a incidentes clasificados.',
    'PHASE 1: APPROACH': 'FASE 1: ABORDAJE',
    '  - Team of TWO minimum (never alone)': '  - Equipo de DOS mínimo (nunca solo)',
    '  - Dark suits, minimal identification': '  - Trajes oscuros, identificación mínima',
    '  - Arrive outside normal hours (22:00-06:00 preferred)':
      '  - Llegar fuera del horario normal (22:00-06:00 preferible)',
    '  - Do NOT display badges unless necessary':
      '  - NO mostrar credenciales a menos que sea necesario',
    '  - State: "We are from the government"': '  - Declarar: "Somos del gobierno"',
    'PHASE 2: ASSESSMENT': 'FASE 2: EVALUACIÓN',
    '  Evaluate witness disposition:': '  Evaluar disposición del testigo:',
    '  TYPE A: Already frightened': '  TIPO A: Ya asustado',
    '    → Proceed directly to reassurance': '    → Proceder directamente a la tranquilización',
    '    → "You saw nothing unusual"': '    → "Usted no vio nada inusual"',
    '  TYPE B: Curious/talkative': '  TIPO B: Curioso/hablador',
    '    → Emphasize national security': '    → Enfatizar seguridad nacional',
    '    → "Your family\\\'s safety depends on silence"':
      '    → "La seguridad de su familia depende del silencio"',
    '  TYPE C: Hostile/resistant': '  TIPO C: Hostil/resistente',
    '    → Deploy secondary team': '    → Desplegar equipo secundario',
    '    → Extended session required': '    → Sesión prolongada requerida',
    '    → See Protocol SOMBRA-EXTENDED': '    → Ver Protocolo SOMBRA-EXTENDED',
    'PHASE 3: DOCUMENTATION': 'FASE 3: DOCUMENTACIÓN',
    '  - Obtain signed recantation statement': '  - Obtener declaración de retractación firmada',
    '  - Obtain signed NDA (Form W-7)':
      '  - Obtener acuerdo de confidencialidad firmado (Formulario W-7)',
    '  - Photograph witness (for file)': '  - Fotografiar testigo (para expediente)',
    '  - Record any family members present': '  - Registrar cualquier familiar presente',
    'PHASE 4: FOLLOW-UP': 'FASE 4: SEGUIMIENTO',
    '  - Monitor subject for 30 days minimum': '  - Monitorear sujeto por mínimo 30 días',
    '  - Verify no media contact': '  - Verificar ausencia de contacto con medios',
    '  - If breach suspected, escalate immediately':
      '  - Si se sospecha violación, escalar inmediatamente',
    'AUTHORIZED TECHNIQUES:': 'TÉCNICAS AUTORIZADAS:',
    '  ✓ Verbal persuasion': '  ✓ Persuasión verbal',
    '  ✓ Implication of consequences': '  ✓ Implicación de consecuencias',
    '  ✓ Financial incentive': '  ✓ Incentivo financiero',
    '  ✓ Employment pressure': '  ✓ Presión laboral',
    '  ✗ Physical contact (PROHIBITED)': '  ✗ Contacto físico (PROHIBIDO)',
    '  ✗ Direct threats (PROHIBITED)': '  ✗ Amenazas directas (PROHIBIDO)',
    'NOTE: All sessions are UNRECORDED.': 'NOTA: Todas las sesiones son NO GRABADAS.',
    '      No notes to be taken in presence of witness.':
      '      No se deben tomar notas en presencia del testigo.',
    // ═══ expansionContent.ts — silva_sisters_file ═══
    'SUBJECT FILE — THE THREE WITNESSES': 'EXPEDIENTE DE SUJETOS — LAS TRES TESTIGOS',
    'FILE NUMBER: VAR-96-W001': 'NÚMERO DE EXPEDIENTE: VAR-96-W001',
    'PRIMARY WITNESSES — JARDIM ANDERE INCIDENT':
      'TESTIGOS PRINCIPALES — INCIDENTE DEL JARDIM ANDERE',
    'SUBJECT 1: WITNESS-1 (eldest sister)': 'SUJETO 1: WITNESS-1 (hermana mayor)',
    '  Age: 22': '  Edad: 22',
    '  Occupation: Domestic worker': '  Ocupación: Empleada doméstica',
    '  Marital status: Single': '  Estado civil: Soltera',
    '  Dependents: None': '  Dependientes: Ninguno',
    '  Address: [REDACTED], Jardim Andere, Varginha':
      '  Dirección: [SUPRIMIDO], Jardim Andere, Varginha',
    '  Assessment: MOST CREDIBLE of three': '  Evaluación: MÁS CREÍBLE de las tres',
    '  Demeanor: Frightened, religious': '  Comportamiento: Asustada, religiosa',
    "  Pressure points: Mother\\'s health, job security":
      '  Puntos de presión: Salud de la madre, seguridad laboral',
    '  Statement summary:': '  Resumen de la declaración:',
    '    Saw "creature" at approx. 15:30 on 20-JAN':
      '    Vio "criatura" aprox. a las 15:30 el 20-ENE',
    '    Described: small, brown skin, red eyes':
      '    Descripción: pequeña, piel marrón, ojos rojos',
    '    Claims creature "looked at her"': '    Afirma que la criatura "la miró"',
    '    Ran immediately, called mother': '    Huyó inmediatamente, llamó a su madre',
    '  Status: RECANTED (23-JAN)': '  Estado: RETRACTADA (23-ENE)',
    '  Current position: "Saw a homeless person"': '  Posición actual: "Vio a un indigente"',
    'SUBJECT 2: WITNESS-2 (middle sister)': 'SUJETO 2: WITNESS-2 (hermana del medio)',
    '  Age: 16': '  Edad: 16',
    '  Occupation: Student': '  Ocupación: Estudiante',
    '  Relation: Sister of WITNESS-1': '  Parentesco: Hermana de WITNESS-1',
    '  Assessment: IMPRESSIONABLE': '  Evaluación: IMPRESIONABLE',
    '  Demeanor: Nervous, easily led': '  Comportamiento: Nerviosa, fácilmente influenciable',
    '  Pressure points: School enrollment': '  Puntos de presión: Matrícula escolar',
    '  Status: RECANTED (22-JAN)': '  Estado: RETRACTADA (22-ENE)',
    '  Current position: "Sister was confused"':
      '  Posición actual: "La hermana estaba confundida"',
    'SUBJECT 3: WITNESS-3 (youngest sister)': 'SUJETO 3: WITNESS-3 (hermana menor)',
    '  Age: 14': '  Edad: 14',
    '  Assessment: RESISTANT': '  Evaluación: RESISTENTE',
    '  Demeanor: Defiant, maintains story': '  Comportamiento: Desafiante, mantiene su versión',
    '  Pressure points: Academic future': '  Puntos de presión: Futuro académico',
    '  Status: PARTIALLY COOPERATIVE (25-JAN)': '  Estado: PARCIALMENTE COOPERATIVA (25-ENE)',
    '  Current position: "Agrees to stay silent"': '  Posición actual: "Acepta guardar silencio"',
    '  Note: Did NOT sign recantation': '  Nota: NO firmó retractación',
    '        Monitor closely': '        Monitorear de cerca',
    'FAMILY SITUATION:': 'SITUACIÓN FAMILIAR:',
    '  Mother: [REDACTED] — supportive of daughters': '  Madre: [SUPRIMIDO] — apoya a las hijas',
    '  Father: Deceased': '  Padre: Fallecido',
    '  Economic status: Lower middle class': '  Estatus económico: Clase media baja',
    '  Religious: Catholic (devout)': '  Religión: Católica (devota)',
    'CONTAINMENT ASSESSMENT:': 'EVALUACIÓN DE CONTENCIÓN:',
    '  Risk level: MODERATE': '  Nivel de riesgo: MODERADO',
    '  Reason: WITNESS-3 remains unconvinced': '  Razón: WITNESS-3 permanece no convencida',
    '  Recommendation: Monitor for 6 months': '  Recomendación: Monitorear por 6 meses',
    // ═══ expansionContent.ts — recantation_form_001 ═══
    'WITNESS STATEMENT CORRECTION': 'CORRECCIÓN DE DECLARACIÓN DE TESTIGO',
    'FORM W-9 (VOLUNTARY RECANTATION)': 'FORMULARIO W-9 (RETRACTACIÓN VOLUNTARIA)',
    'I, [WITNESS-1], of sound mind, hereby state:':
      'Yo, [WITNESS-1], en pleno uso de mis facultades mentales, declaro:',
    'On the afternoon of January 20, 1996, I reported':
      'En la tarde del 20 de enero de 1996, reporté haber',
    'seeing an unusual figure in the Jardim Andere':
      'visto una figura inusual en el barrio Jardim Andere',
    'neighborhood of Varginha.': 'de Varginha.',
    'I now acknowledge that I was MISTAKEN.': 'Ahora reconozco que estaba EQUIVOCADA.',
    'What I actually saw was a homeless individual,':
      'Lo que realmente vi fue un individuo indigente,',
    'possibly intoxicated or mentally disturbed.':
      'posiblemente intoxicado o con trastornos mentales.',
    'The unusual appearance was due to:': 'La apariencia inusual se debió a:',
    '  - Poor lighting conditions': '  - Condiciones precarias de iluminación',
    '  - My own state of fear': '  - Mi propio estado de miedo',
    '  - Influence of recent media stories': '  - Influencia de reportajes recientes en los medios',
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
    'Signature: [SIGNED]': 'Firma: [FIRMADO]',
    'Date: 23-JAN-1996': 'Fecha: 23-ENE-1996',
    'Witness: [REDACTED], Federal Agent': 'Testigo: [SUPRIMIDO], Agente Federal',
    // ═══ expansionContent.ts — mudinho_dossier ═══
    'COVER STORY ASSET — CODENAME "MUDINHO"':
      'ACTIVO DE HISTORIA DE COBERTURA — NOMBRE CLAVE "MUDINHO"',
    'FILE: CS-96-001': 'EXPEDIENTE: CS-96-001',
    'SUBJECT PROFILE:': 'PERFIL DEL SUJETO:',
    '  Legal name: [REDACTED]': '  Nombre legal: [SUPRIMIDO]',
    '  Known as: "Mudinho" (local nickname)': '  Conocido como: "Mudinho" (apodo local)',
    '  Age: Approximately 35-40': '  Edad: Aproximadamente 35-40',
    '  Status: Mentally disabled': '  Estado: Discapacidad mental',
    '  Residence: Streets of Varginha (homeless)': '  Residencia: Calles de Varginha (indigente)',
    'PHYSICAL DESCRIPTION:': 'DESCRIPCIÓN FÍSICA:',
    '  Height: 1.40m (unusually short)': '  Altura: 1,40m (inusualmente bajo)',
    '  Build: Thin, malnourished': '  Complexión: Delgado, desnutrido',
    '  Skin: Dark, weathered': '  Piel: Oscura, curtida',
    '  Distinguishing features:': '  Rasgos distintivos:',
    '    - Crouched posture': '    - Postura agachada',
    '    - Limited verbal communication': '    - Comunicación verbal limitada',
    '    - Often seen in Jardim Andere area':
      '    - Frecuentemente visto en el área de Jardim Andere',
    'COVER STORY DEPLOYMENT': 'DESPLIEGUE DE HISTORIA DE COBERTURA',
    'NARRATIVE:': 'NARRATIVA:',
    '  "The creature witnesses described was actually':
      '  "La criatura que los testigos describieron era en realidad',
    '   a local mentally disabled man known as Mudinho.':
      '   un hombre local con discapacidad mental conocido como Mudinho.',
    '   In the confusion and poor lighting, witnesses':
      '   En la confusión y la poca iluminación, los testigos',
    '   mistook him for something unusual."': '   lo confundieron con algo inusual."',
    'ADVANTAGES:': 'VENTAJAS:',
    '  - Subject cannot contradict (non-verbal)': '  - El sujeto no puede contradecir (no verbal)',
    '  - Subject known to locals': '  - Sujeto conocido por los locales',
    '  - Physical characteristics loosely match': '  - Características físicas coinciden vagamente',
    '  - Explains crouching posture': '  - Explica la postura agachada',
    'DISADVANTAGES:': 'DESVENTAJAS:',
    '  - Skin color does not match (brown vs. gray)':
      '  - Color de piel no coincide (marrón vs. gris)',
    '  - Does not explain "red eyes"': '  - No explica los "ojos rojos"',
    '  - Multiple witnesses unlikely to all misidentify':
      '  - Múltiples testigos improbable que todos identifiquen erróneamente',
    '  - Subject was NOT in Jardim Andere on 20-JAN':
      '  - El sujeto NO estaba en Jardim Andere el 20-ENE',
    'DEPLOYMENT STATUS: ACTIVE': 'ESTADO DE DESPLIEGUE: ACTIVO',
    'MEDIA PLACEMENT:': 'INSERCIÓN EN MEDIOS:',
    '  - Estado de Minas: Published 27-JAN': '  - Estado de Minas: Publicado 27-ENE',
    '  - Folha Paulista: Published 29-JAN': '  - Folha Paulista: Publicado 29-ENE',
    '  - Rede Nacional: Mentioned 28-JAN': '  - Rede Nacional: Mencionado 28-ENE',
    'EFFECTIVENESS ASSESSMENT:': 'EVALUACIÓN DE EFICACIA:',
    '  Moderate. Provides plausible deniability but': '  Moderada. Provee negación plausible pero',
    '  does not withstand close scrutiny.': '  no resiste un escrutinio detallado.',
    'NOTE: Subject Mudinho was relocated to care facility':
      'NOTA: El sujeto Mudinho fue trasladado a una institución de cuidados',
    '      on 02-FEB to prevent journalist contact.':
      '      el 02-FEB para impedir contacto con periodistas.',
    // ═══ expansionContent.ts — alternative_explanations ═══
    'COVER STORY OPTIONS — VARGINHA INCIDENT':
      'OPCIONES DE HISTORIA DE COBERTURA — INCIDENTE VARGINHA',
    'COMPILED: 22-JAN-1996': 'COMPILADO: 22-ENE-1996',
    'The following alternative explanations are approved':
      'Las siguientes explicaciones alternativas son aprobadas',
    'for deployment depending on audience and context:':
      'para despliegue según la audiencia y el contexto:',
    'OPTION A: WEATHER BALLOON': 'OPCIÓN A: GLOBO METEOROLÓGICO',
    '  Use for: Aerial sighting reports': '  Usar para: Reportes de avistamientos aéreos',
    '  Narrative: "Meteorological equipment from INMET"':
      '  Narrativa: "Equipo meteorológico del INMET"',
    '  Strength: Classic, widely accepted': '  Fortaleza: Clásico, ampliamente aceptado',
    '  Weakness: Does not explain ground sightings':
      '  Debilidad: No explica avistamientos terrestres',
    '  Status: DEPLOYED for UFO reports': '  Estado: DESPLEGADO para reportes de OVNIs',
    'OPTION B: HOMELESS PERSON (MUDINHO)': 'OPCIÓN B: INDIGENTE (MUDINHO)',
    '  Use for: Creature sightings': '  Usar para: Avistamientos de criaturas',
    '  Narrative: "Local mentally disabled man"':
      '  Narrativa: "Hombre local con discapacidad mental"',
    '  Strength: Explains humanoid shape': '  Fortaleza: Explica forma humanoide',
    '  Weakness: Contradicted by witness details':
      '  Debilidad: Contradecido por detalles de testigos',
    '  Status: PRIMARY for domestic media': '  Estado: PRIMARIO para medios nacionales',
    'OPTION C: ESCAPED ANIMAL': 'OPCIÓN C: ANIMAL FUGADO',
    '  Use for: Secondary/backup': '  Usar para: Secundario/respaldo',
    '  Narrative: "Monkey or similar animal"': '  Narrativa: "Mono o animal similar"',
    '  Strength: Explains unusual appearance': '  Fortaleza: Explica apariencia inusual',
    '  Weakness: No zoo reported escape': '  Debilidad: Ninguna fuga reportada por el zoológico',
    '  Status: RESERVE': '  Estado: RESERVA',
    'OPTION D: MILITARY EXERCISE': 'OPCIÓN D: EJERCICIO MILITAR',
    '  Use for: Troop/vehicle movements': '  Usar para: Movimientos de tropas/vehículos',
    '  Narrative: "Routine training exercise"':
      '  Narrativa: "Ejercicio de entrenamiento rutinario"',
    '  Strength: Explains military presence': '  Fortaleza: Explica presencia militar',
    '  Weakness: No exercise was scheduled': '  Debilidad: Ningún ejercicio estaba programado',
    '  Status: DEPLOYED for truck sightings': '  Estado: DESPLEGADO para avistamientos de camiones',
    'OPTION E: MASS HYSTERIA': 'OPCIÓN E: HISTERIA COLECTIVA',
    '  Use for: Long-term discrediting': '  Usar para: Desacreditación a largo plazo',
    '  Narrative: "Community panic, suggestibility"':
      '  Narrativa: "Pánico comunitario, sugestionabilidad"',
    '  Strength: Undermines all witnesses': '  Fortaleza: Socava a todos los testigos',
    '  Weakness: Requires time to establish': '  Debilidad: Requiere tiempo para establecerse',
    '  Status: DEPLOYMENT IN PROGRESS': '  Estado: DESPLIEGUE EN CURSO',
    'OPTION F: PRANKSTERS/HOAX': 'OPCIÓN F: BROMISTAS/ENGAÑO',
    '  Use for: Future fallback': '  Usar para: Recurso futuro',
    '  Narrative: "Local youths playing prank"': '  Narrativa: "Jóvenes locales haciendo bromas"',
    '  Strength: Simple explanation': '  Fortaleza: Explicación simple',
    '  Weakness: Requires "pranksters" to identify':
      '  Debilidad: Requiere identificar a los "bromistas"',
    '  Deploy multiple explanations simultaneously.':
      '  Desplegar múltiples explicaciones simultáneamente.',
    '  Confusion serves containment.': '  La confusión sirve a la contención.',
    // ═══ expansionContent.ts — media_talking_points ═══
    'MEDIA TALKING POINTS — VARGINHA INCIDENT': 'PUNTOS DE COMUNICACIÓN — INCIDENTE VARGINHA',
    'FOR: All Authorized Spokespersons': 'PARA: Todos los Voceros Autorizados',
    'DATE: 24-JAN-1996': 'FECHA: 24-ENE-1996',
    'IF ASKED ABOUT CREATURE SIGHTINGS:': 'SI SE PREGUNTA SOBRE AVISTAMIENTOS DE CRIATURAS:',
    '  "We have investigated these reports thoroughly.':
      '  "Hemos investigado estos reportes minuciosamente.',
    '   The sightings were of a local homeless individual':
      '   Los avistamientos fueron de un individuo indigente local',
    '   who is known to frequent that neighborhood.':
      '   que es conocido por frecuentar ese barrio.',
    '   There is nothing unusual to report."': '   No hay nada inusual que reportar."',
    'IF ASKED ABOUT MILITARY ACTIVITY:': 'SI SE PREGUNTA SOBRE ACTIVIDAD MILITAR:',
    '  "The military vehicles observed were part of':
      '  "Los vehículos militares observados formaban parte de',
    '   routine logistical operations unrelated to':
      '   operaciones logísticas rutinarias sin relación con',
    '   any reported sightings. This is normal activity':
      '   ningún avistamiento reportado. Esta es actividad normal',
    '   for our regional command."': '   para nuestro comando regional."',
    'IF ASKED ABOUT HOSPITAL ACTIVITY:': 'SI SE PREGUNTA SOBRE ACTIVIDAD HOSPITALARIA:',
    '  "Patient intake and emergency response are':
      '  "La admisión de pacientes y la respuesta de emergencia son',
    '   confidential medical matters. We cannot comment':
      '   asuntos médicos confidenciales. No podemos comentar',
    '   on any specific cases or rumors."': '   sobre casos específicos o rumores."',
    'IF ASKED ABOUT UFOS:': 'SI SE PREGUNTA SOBRE OVNIs:',
    '  "There is no evidence of any unidentified aerial':
      '  "No hay evidencia de ningún fenómeno aéreo no identificado',
    '   phenomena in the Varginha area. Light anomalies':
      '   en el área de Varginha. Las anomalías luminosas',
    '   reported on January 19th were likely atmospheric':
      '   reportadas el 19 de enero fueron probablemente',
    '   reflections from agricultural equipment."': '   reflejos atmosféricos de equipo agrícola."',
    'IF ASKED ABOUT COVER-UP:': 'SI SE PREGUNTA SOBRE ENCUBRIMIENTO:',
    '  "Suggestions of a cover-up are baseless conspiracy':
      '  "Las sugerencias de un encubrimiento son teorías conspirativas infundadas.',
    '   theories. The Brazilian Armed Forces operate with':
      '   Las Fuerzas Armadas Brasileñas operan con',
    '   full transparency within appropriate security':
      '   total transparencia dentro de los protocolos de seguridad',
    '   protocols. There is nothing to hide."': '   apropiados. No hay nada que ocultar."',
    'DO NOT:': 'NO:',
    '  - Engage with specific witness accounts':
      '  - Involucrarse con testimonios específicos de testigos',
    '  - Confirm or deny classified information': '  - Confirmar o negar información clasificada',
    '  - Speculate about alternative explanations':
      '  - Especular sobre explicaciones alternativas',
    '  - Acknowledge the existence of any "investigation"':
      '  - Reconocer la existencia de ninguna "investigación"',
    // ═══ expansionContent.ts — animal_deaths_report ═══
    'INCIDENT REPORT — ZOOLÓGICO MUNICIPAL DE VARGINHA':
      'INFORME DE INCIDENTE — ZOOLÓGICO MUNICIPAL DE VARGINHA',
    'DATE: 28-JAN-1996': 'FECHA: 28-ENE-1996',
    '  Multiple animal deaths at municipal zoo during':
      '  Múltiples muertes de animales en el zoológico municipal durante',
    '  period 22-JAN to 27-JAN 1996.': '  el período del 22-ENE al 27-ENE 1996.',
    'FATALITIES:': 'FATALIDADES:',
    '  22-JAN 06:00 — TAPIR (Tapirus terrestris)': '  22-ENE 06:00 — TAPIR (Tapirus terrestris)',
    '    Age: 8 years': '    Edad: 8 años',
    '    Prior health: Excellent': '    Salud previa: Excelente',
    '    Symptoms: Found deceased, no visible trauma':
      '    Síntomas: Encontrado muerto, sin trauma visible',
    '    Necropsy: Internal hemorrhaging, organ failure':
      '    Necropsia: Hemorragia interna, fallo orgánico',
    '  24-JAN 14:00 — OCELOT (Leopardus pardalis)': '  24-ENE 14:00 — OCELOTE (Leopardus pardalis)',
    '    Age: 5 years': '    Edad: 5 años',
    '    Prior health: Good': '    Salud previa: Buena',
    '    Symptoms: Seizures, rapid decline': '    Síntomas: Convulsiones, deterioro rápido',
    '    Necropsy: Neurological damage, cause unknown':
      '    Necropsia: Daño neurológico, causa desconocida',
    '  25-JAN 08:30 — DEER (Mazama americana)': '  25-ENE 08:30 — VENADO (Mazama americana)',
    '    Age: 3 years': '    Edad: 3 años',
    '    Symptoms: Extreme agitation, then collapse':
      '    Síntomas: Agitación extrema, luego colapso',
    '    Necropsy: Cardiac arrest, elevated cortisol':
      '    Necropsia: Paro cardíaco, cortisol elevado',
    '  27-JAN 03:00 — CAPYBARA (Hydrochoerus hydrochaeris)':
      '  27-ENE 03:00 — CAPIBARA (Hydrochoerus hydrochaeris)',
    '    Age: 6 years': '    Edad: 6 años',
    '    Symptoms: Refused food, tremors': '    Síntomas: Rechazó alimento, temblores',
    '    Necropsy: Multi-organ failure': '    Necropsia: Fallo multiorgánico',
    'VETERINARIAN ASSESSMENT (Dr. Ana FERREIRA):': 'EVALUACIÓN VETERINARIA (Dra. Ana FERREIRA):',
    '  "These deaths are unprecedented. The animals showed':
      '  "Estas muertes son sin precedentes. Los animales no mostraron',
    '   no prior illness. The pattern suggests exposure to':
      '   enfermedad previa. El patrón sugiere exposición a',
    '   an unknown pathogen or toxin. The proximity of':
      '   un patógeno o toxina desconocida. La proximidad de las',
    '   deaths to the reported incident on 20-JAN cannot':
      '   muertes al incidente reportado el 20-ENE no puede',
    '   be coincidental."': '   ser coincidencia."',
    'OPERATIONAL NOTE:': 'NOTA OPERACIONAL:',
    '  Animals were housed in enclosures adjacent to':
      '  Los animales estaban alojados en recintos adyacentes al',
    '  the TEMPORARY HOLDING area used 20-21 JAN.':
      '  área de CONTENCIÓN TEMPORAL usada el 20-21 ENE.',
    '  Possible contamination from "fauna specimen"':
      '  Posible contaminación del espécimen de "fauna"',
    '  containment breach. Investigation ongoing.':
      '  por falla de contención. Investigación en curso.',
    // ═══ expansionContent.ts — veterinarian_silencing ═══
    'CONTAINMENT ACTION — ZOO VETERINARIAN': 'ACCIÓN DE CONTENCIÓN — VETERINARIA DEL ZOOLÓGICO',
    'DATE: 30-JAN-1996': 'FECHA: 30-ENE-1996',
    'SUBJECT: Dr. Ana FERREIRA': 'SUJETO: Dra. Ana FERREIRA',
    'Position: Chief Veterinarian, Zoológico Municipal':
      'Cargo: Veterinaria Jefe, Zoológico Municipal',
    'Threat level: MODERATE': 'Nivel de amenaza: MODERADO',
    '  Dr. Ferreira has made connection between animal':
      '  La Dra. Ferreira ha hecho conexión entre las muertes',
    '  deaths and classified incident. Has documented':
      '  de animales y el incidente clasificado. Ha documentado',
    '  anomalous necropsy findings. Seeking external':
      '  hallazgos anómalos de necropsia. Buscando',
    '  consultation.': '  consulta externa.',
    'ACTIONS TAKEN:': 'ACCIONES TOMADAS:',
    '  25-JAN: Initial contact (Protocol SOMBRA)': '  25-ENE: Contacto inicial (Protocolo SOMBRA)',
    '    Outcome: PARTIALLY COOPERATIVE': '    Resultado: PARCIALMENTE COOPERATIVO',
    '    Agreed to delay external consultation': '    Aceptó retrasar consulta externa',
    '  28-JAN: Necropsy samples CONFISCATED': '  28-ENE: Muestras de necropsia CONFISCADAS',
    '    Cover: "Public health authority directive"':
      '    Cobertura: "Directiva de la autoridad de salud pública"',
    '    Note: Samples transferred to secure facility':
      '    Nota: Muestras transferidas a instalación segura',
    '  29-JAN: Administrative pressure applied': '  29-ENE: Presión administrativa aplicada',
    '    Zoo director instructed to reassign subject':
      '    Director del zoológico instruido a reasignar sujeto',
    '    "Extended leave" suggested': '    "Licencia prolongada" sugerida',
    '  30-JAN: Follow-up visit (COBRA team)': '  30-ENE: Visita de seguimiento (equipo COBRA)',
    '    Duration: 2 hours': '    Duración: 2 horas',
    '    Outcome: FULLY COOPERATIVE': '    Resultado: TOTALMENTE COOPERATIVO',
    '    Signed: NDA, statement attributing deaths to':
      '    Firmó: Acuerdo de confidencialidad, declaración atribuyendo muertes a',
    '            "contaminated feed shipment"': '            "cargamento de alimento contaminado"',
    'CURRENT STATUS:': 'ESTADO ACTUAL:',
    '  Subject on administrative leave': '  Sujeto en licencia administrativa',
    '  No media contact authorized': '  Ningún contacto con medios autorizado',
    '  Monitoring: 90 days': '  Monitoreo: 90 días',
    'ADDITIONAL MEASURE:': 'MEDIDA ADICIONAL:',
    "  Subject\\'s husband works at state university":
      '  El esposo del sujeto trabaja en la universidad estatal',
    '  Employment pressure available if needed': '  Presión laboral disponible si es necesaria',
    // ═══ expansionContent.ts — contamination_theory ═══
    'OFFICIAL EXPLANATION — ZOO ANIMAL DEATHS':
      'EXPLICACIÓN OFICIAL — MUERTES DE ANIMALES DEL ZOOLÓGICO',
    'FOR: Public Release / Media Inquiry': 'PARA: Divulgación Pública / Consulta de Medios',
    'DATE: 01-FEB-1996': 'FECHA: 01-FEB-1996',
    'PRESS STATEMENT:': 'COMUNICADO DE PRENSA:',
    '  "The Varginha Municipal Zoo regrets to announce':
      '  "El Zoológico Municipal de Varginha lamenta anunciar',
    '   the loss of four animals during the last week':
      '   la pérdida de cuatro animales durante la última semana',
    '   of January 1996.': '   de enero de 1996.',
    '   Investigation has determined that the cause was':
      '   La investigación determinó que la causa fue',
    '   a contaminated shipment of animal feed received':
      '   un cargamento contaminado de alimento para animales recibido',
    '   on January 18th.': '   el 18 de enero.',
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
    '   are being implemented.': '   están siendo implementados.',
    '   We appreciate the community\\\'s understanding."':
      '   Agradecemos la comprensión de la comunidad."',
    'INTERNAL NOTE (DO NOT RELEASE):': 'NOTA INTERNA (NO DIVULGAR):',
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
    '  See: /ops/zoo/animal_deaths_report.txt': '  Ver: /ops/zoo/animal_deaths_report.txt',
    // ═══ expansionContent.ts — chereze_incident_report ═══
    'INCIDENT REPORT — OFFICER [CLASSIFIED]': 'INFORME DE INCIDENTE — OFICIAL [CLASIFICADO]',
    'CLASSIFICATION: TOP SECRET': 'CLASIFICACIÓN: ULTRA SECRETO',
    'FILE: VAR-96-MED-007': 'EXPEDIENTE: VAR-96-MED-007',
    'SUBJECT: [CLASSIFIED], Corporal': 'SUJETO: [CLASIFICADO], Cabo',
    'Rank: Corporal, Military Police': 'Rango: Cabo, Policía Militar',
    'Unit: 4th Company, Varginha': 'Unidad: 4ª Compañía, Varginha',
    'Status: DECEASED (15-FEB-1996)': 'Estado: FALLECIDO (15-FEB-1996)',
    'TIMELINE OF EVENTS:': 'CRONOLOGÍA DE EVENTOS:',
    '20-JAN 21:30': '20-ENE 21:30',
    '  The officer responds to call regarding': '  El oficial responde a llamado referente a',
    '  "strange animal" in Jardim Andere area.': '  "animal extraño" en el área de Jardim Andere.',
    '  Arrives at scene, assists with containment.':
      '  Llega a la escena, asiste con la contención.',
    '20-JAN 22:15': '20-ENE 22:15',
    '  Officer makes direct physical contact with': '  El oficial hace contacto físico directo con',
    '  fauna specimen during loading operation.':
      '  espécimen de fauna durante operación de carga.',
    '  Contact area: Left forearm, bare skin.':
      '  Área de contacto: Antebrazo izquierdo, piel expuesta.',
    '  Duration: Approximately 3-4 seconds.': '  Duración: Aproximadamente 3-4 segundos.',
    '21-JAN 08:00': '21-ENE 08:00',
    '  Officer reports to duty, notes mild fatigue.':
      '  El oficial se presenta al servicio, nota fatiga leve.',
    '  Attributes to late shift previous night.':
      '  Lo atribuye al turno tardío de la noche anterior.',
    '23-JAN': '23-ENE',
    '  Officer complains of headaches, joint pain.':
      '  El oficial se queja de dolores de cabeza, dolor articular.',
    '  Skin irritation noted at contact site.':
      '  Irritación cutánea observada en el sitio de contacto.',
    '  Reports "strange dreams."': '  Reporta "sueños extraños."',
    '27-JAN': '27-ENE',
    '  Officer hospitalized with fever, weakness.':
      '  Oficial hospitalizado con fiebre, debilidad.',
    '  Diagnosis: "Unknown infection"': '  Diagnóstico: "Infección desconocida"',
    '  Blood work shows anomalous markers.':
      '  Los análisis de sangre muestran marcadores anómalos.',
    '02-FEB': '02-FEB',
    '  Condition deteriorates rapidly.': '  La condición se deteriora rápidamente.',
    '  Multiple organ systems affected.': '  Múltiples sistemas orgánicos afectados.',
    '  Transfer to military hospital (São Paulo).':
      '  Transferencia a hospital militar (São Paulo).',
    '15-FEB 03:47': '15-FEB 03:47',
    '  The officer expires.': '  El oficial fallece.',
    '  Official cause: "Pneumonia complications"': '  Causa oficial: "Complicaciones de neumonía"',
    'MEDICAL NOTES (SUPPRESSED):': 'NOTAS MÉDICAS (SUPRIMIDAS):',
    '  Attending physician noted:': '  El médico tratante observó:',
    '  - Tissue necrosis at contact site': '  - Necrosis tisular en el sitio de contacto',
    '  - Unprecedented immune system collapse': '  - Colapso inmunológico sin precedentes',
    '  - Unidentifiable pathogen in blood samples':
      '  - Patógeno no identificable en muestras de sangre',
    '  - Brain scans showed unusual activity patterns':
      '  - Escaneos cerebrales mostraron patrones de actividad inusuales',
    '  Physician quote (recorded):': '  Cita del médico (grabada):',
    '  "I have never seen anything like this.': '  "Nunca he visto nada parecido a esto.',
    '   This is not any known disease."': '   Esto no es ninguna enfermedad conocida."',
    'CONTAINMENT ACTIONS:': 'ACCIONES DE CONTENCIÓN:',
    '  - Medical records CLASSIFIED': '  - Registros médicos CLASIFICADOS',
    '  - Attending physician reassigned': '  - Médico tratante reasignado',
    '  - Blood samples transferred to [REDACTED]':
      '  - Muestras de sangre transferidas a [SUPRIMIDO]',
    '  - Family briefed on "pneumonia" cause': '  - Familia informada sobre causa "neumonía"',
    '  - Compensation package arranged': '  - Paquete de compensación preparado',
    // ═══ expansionContent.ts — autopsy_suppression ═══
    'DIRECTIVE — AUTOPSY SUPPRESSION': 'DIRECTIVA — SUPRESIÓN DE AUTOPSIA',
    'DATE: 16-FEB-1996': 'FECHA: 16-FEB-1996',
    'RE: Remains of the deceased corporal': 'REF: Restos del cabo fallecido',
    'Per authority of [REDACTED], the following directive':
      'Por autoridad de [SUPRIMIDO], la siguiente directiva',
    'is IMMEDIATELY effective:': 'es INMEDIATAMENTE efectiva:',
    '1. Standard autopsy procedure is CANCELLED.':
      '1. El procedimiento estándar de autopsia está CANCELADO.',
    '2. A modified examination will be conducted by': '2. Un examen modificado será conducido por',
    '   cleared personnel from Project HARVEST only.':
      '   personal autorizado únicamente del Proyecto HARVEST.',
    '3. All tissue samples are classified and must be':
      '3. Todas las muestras de tejido son clasificadas y deben ser',
    '   transferred to [REDACTED] facility.': '   transferidas a la instalación [SUPRIMIDA].',
    '4. The official autopsy report will state:': '4. El informe oficial de autopsia declarará:',
    '   "Cause of death: Respiratory failure': '   "Causa de muerte: Insuficiencia respiratoria',
    '    secondary to pneumonia complications."': '    secundaria a complicaciones de neumonía."',
    '5. No copy of actual findings will be retained':
      '5. Ninguna copia de los hallazgos reales será retenida',
    '   at the hospital or municipal morgue.': '   en el hospital o la morgue municipal.',
    'JUSTIFICATION:': 'JUSTIFICACIÓN:',
    "  Subject\\'s exposure to recovered fauna specimen":
      '  La exposición del sujeto al espécimen de fauna recuperado',
    '  resulted in contamination of unknown nature.':
      '  resultó en contaminación de naturaleza desconocida.',
    '  Pathological findings could compromise ongoing':
      '  Los hallazgos patológicos podrían comprometer operaciones',
    '  containment operations if disclosed.': '  de contención en curso si se divulgan.',
    '  The anomalous pathogen must be studied under':
      '  El patógeno anómalo debe ser estudiado bajo',
    '  controlled conditions only.': '  condiciones controladas únicamente.',
    'SECURITY NOTE:': 'NOTA DE SEGURIDAD:',
    '  Any medical personnel who observed actual condition':
      '  Cualquier personal médico que observó la condición real',
    '  of the deceased are to be debriefed immediately':
      '  del fallecido debe ser interrogado inmediatamente',
    '  under Protocol SOMBRA.': '  bajo el Protocolo SOMBRA.',
    '  NDA signatures required from all parties.':
      '  Firmas de acuerdo de confidencialidad requeridas de todas las partes.',
    // ═══ expansionContent.ts — family_compensation ═══
    "COMPENSATION ARRANGEMENT — OFFICER'S FAMILY": 'ACUERDO DE COMPENSACIÓN — FAMILIA DEL OFICIAL',
    'DATE: 20-FEB-1996': 'FECHA: 20-FEB-1996',
    'BENEFICIARIES:': 'BENEFICIARIOS:',
    '  Wife: [REDACTED]': '  Esposa: [SUPRIMIDO]',
    '  Children: 2 (ages 7 and 4)': '  Hijos: 2 (edades 7 y 4)',
    'OFFICIAL BENEFITS (Standard):': 'BENEFICIOS OFICIALES (Estándar):',
    '  - Death in service pension': '  - Pensión por muerte en servicio',
    '  - Life insurance payout': '  - Pago de seguro de vida',
    '  - Educational benefits for children': '  - Beneficios educativos para los hijos',
    '  Total official: R$ 45,000.00': '  Total oficial: R$ 45.000,00',
    'SUPPLEMENTAL COMPENSATION (Classified):': 'COMPENSACIÓN SUPLEMENTARIA (Clasificada):',
    '  Purpose: Ensure family silence regarding':
      '  Propósito: Asegurar el silencio de la familia respecto a',
    '           circumstances of death.': '           las circunstancias de la muerte.',
    '  Initial payment: R$ 50,000.00 (cash)': '  Pago inicial: R$ 50.000,00 (en efectivo)',
    '  Monthly stipend: R$ 2,000.00 (5 years)': '  Estipendio mensual: R$ 2.000,00 (5 años)',
    '  Housing: Apartment (paid, Belo Horizonte)':
      '  Vivienda: Apartamento (pagado, Belo Horizonte)',
    '  Employment: Government position for wife': '  Empleo: Cargo gubernamental para la esposa',
    '  Total supplemental: ~R$ 220,000.00': '  Total suplementario: ~R$ 220.000,00',
    'CONDITIONS:': 'CONDICIONES:',
    '  - Family agrees to "pneumonia" narrative': '  - Familia acepta la narrativa de "neumonía"',
    '  - No media interviews (ever)': '  - Ninguna entrevista con medios (nunca)',
    '  - No legal action against government': '  - Ninguna acción legal contra el gobierno',
    '  - Relocation from Varginha (within 30 days)':
      '  - Reubicación de Varginha (dentro de 30 días)',
    '  - No contact with UFO investigators': '  - Ningún contacto con investigadores de OVNIs',
    '  Signed: [WIFE OF OFFICER], 20-FEB-1996': '  Firmado: [ESPOSA DEL OFICIAL], 20-FEB-1996',
    'NOTE: Family moved to Belo Horizonte 15-MAR-1996':
      'NOTA: Familia se mudó a Belo Horizonte 15-MAR-1996',
    '      Monitoring: Low priority (cooperative)': '      Monitoreo: Baja prioridad (cooperativa)',
    // ═══ expansionContent.ts — coffee_harvest_report ═══
    'REGIONAL ECONOMIC REPORT — COFFEE SECTOR': 'INFORME ECONÓMICO REGIONAL — SECTOR CAFETERO',
    'PERIOD: Q1 1996': 'PERÍODO: T1 1996',
    'REGION: Sul de Minas': 'REGIÓN: Sul de Minas',
    'MARKET CONDITIONS:': 'CONDICIONES DEL MERCADO:',
    '  The Sul de Minas coffee region continues to be':
      '  La región cafetera de Sul de Minas continúa siendo',
    "  Brazil\\'s premier arabica production zone.":
      '  la principal zona de producción de arábica de Brasil.',
    '  Current harvest: PROGRESSING NORMALLY': '  Cosecha actual: PROGRESANDO NORMALMENTE',
    '  Expected yield: 2.3 million bags': '  Rendimiento esperado: 2,3 millones de sacos',
    '  Quality assessment: ABOVE AVERAGE': '  Evaluación de calidad: POR ENCIMA DEL PROMEDIO',
    'PRICE INDICATORS:': 'INDICADORES DE PRECIO:',
    '  NYC Commodity Exchange: $1.42/lb (Jan avg)':
      '  Bolsa de Commodities de NYC: $1,42/lb (prom. Ene)',
    '  Local cooperative price: R$ 85.00/bag': '  Precio de la cooperativa local: R$ 85,00/saco',
    '  Trend: STABLE with slight upward pressure':
      '  Tendencia: ESTABLE con ligera presión al alza',
    'REGIONAL NOTES:': 'NOTAS REGIONALES:',
    "  - Varginha remains the region\\'s logistics hub":
      '  - Varginha sigue siendo el centro logístico de la región',
    '  - Railroad capacity adequate for current volume':
      '  - Capacidad ferroviaria adecuada para el volumen actual',
    '  - Export documentation processing normal':
      '  - Procesamiento de documentación de exportación normal',
    'LABOR:': 'MANO DE OBRA:',
    '  - Seasonal workers arriving as expected':
      '  - Trabajadores temporales llegando según lo esperado',
    '  - No significant disputes reported': '  - Ninguna disputa significativa reportada',
    'ASSESSMENT:': 'EVALUACIÓN:',
    '  Coffee sector operation NORMAL.': '  Operación del sector cafetero NORMAL.',
    '  No economic anomalies detected.': '  Ninguna anomalía económica detectada.',
    // ═══ expansionContent.ts — weather_report_jan96 ═══
    'METEOROLOGICAL SUMMARY — JANUARY 1996': 'RESUMEN METEOROLÓGICO — ENERO 1996',
    'STATION: Varginha Regional': 'ESTACIÓN: Varginha Regional',
    "COORDINATES: 21°33'S, 45°26'W": "COORDENADAS: 21°33'S, 45°26'O",
    '  January 1996 exhibited typical summer patterns':
      '  Enero de 1996 presentó patrones típicos de verano',
    '  for the Sul de Minas region.': '  para la región de Sul de Minas.',
    'KEY DATES:': 'FECHAS CLAVE:',
    '  19-JAN-1996:': '  19-ENE-1996:',
    '    Temperature: 28°C (max) / 18°C (min)': '    Temperatura: 28°C (máx) / 18°C (mín)',
    '    Precipitation: 12mm': '    Precipitación: 12mm',
    '    Cloud cover: Partial (40%)': '    Cobertura nubosa: Parcial (40%)',
    '    Wind: NE, 15-20 km/h': '    Viento: NE, 15-20 km/h',
    '    SPECIAL: Clear sky after 22:00': '    ESPECIAL: Cielo despejado después de las 22:00',
    '  20-JAN-1996:': '  20-ENE-1996:',
    '    Temperature: 31°C (max) / 19°C (min)': '    Temperatura: 31°C (máx) / 19°C (mín)',
    '    Precipitation: 0mm': '    Precipitación: 0mm',
    '    Cloud cover: Minimal (15%)': '    Cobertura nubosa: Mínima (15%)',
    '    Wind: Calm': '    Viento: Calmo',
    '    SPECIAL: Excellent visibility': '    ESPECIAL: Excelente visibilidad',
    '  21-JAN-1996:': '  21-ENE-1996:',
    '    Temperature: 29°C (max) / 17°C (min)': '    Temperatura: 29°C (máx) / 17°C (mín)',
    '    Precipitation: 8mm (evening)': '    Precipitación: 8mm (noche)',
    '    Cloud cover: Building afternoon': '    Cobertura nubosa: Acumulándose por la tarde',
    '    Wind: Variable': '    Viento: Variable',
    'NOTE: No unusual atmospheric phenomena recorded.':
      'NOTA: Ningún fenómeno atmosférico inusual registrado.',
    '      Standard summer conditions for region.':
      '      Condiciones estándar de verano para la región.',
    // ═══ expansionContent.ts — local_politics_memo ═══
    'POLITICAL SUMMARY — VARGINHA MUNICIPALITY': 'RESUMEN POLÍTICO — MUNICIPIO DE VARGINHA',
    'DATE: 15-JAN-1996': 'FECHA: 15-ENE-1996',
    'ROUTINE ASSESSMENT': 'EVALUACIÓN DE RUTINA',
    'CURRENT ADMINISTRATION:': 'ADMINISTRACIÓN ACTUAL:',
    '  Mayor: [REDACTED]': '  Alcalde: [SUPRIMIDO]',
    '  Party: PMDB': '  Partido: PMDB',
    '  Term: 1993-1996 (final year)': '  Período: 1993-1996 (último año)',
    'POLITICAL CLIMATE:': 'CLIMA POLÍTICO:',
    '  - Municipal elections scheduled October 1996':
      '  - Elecciones municipales programadas para octubre de 1996',
    '  - Current administration approval: MODERATE':
      '  - Aprobación de la administración actual: MODERADA',
    '  - No significant controversies': '  - Ninguna controversia significativa',
    'NOTABLE DEVELOPMENTS:': 'DESARROLLOS NOTABLES:',
    '  - Infrastructure projects on schedule': '  - Proyectos de infraestructura en cronograma',
    '  - Coffee cooperative relations stable':
      '  - Relaciones con la cooperativa cafetera estables',
    '  - Hospital expansion approved': '  - Expansión del hospital aprobada',
    '  - School enrollment increasing': '  - Matrículas escolares en aumento',
    'SECURITY CONCERNS:': 'PREOCUPACIONES DE SEGURIDAD:',
    '  - Petty crime: Within normal parameters':
      '  - Delincuencia menor: Dentro de los parámetros normales',
    '  - Organized crime: No presence detected':
      '  - Crimen organizado: Ninguna presencia detectada',
    '  - Labor unrest: None': '  - Conflictos laborales: Ninguno',
    '  Politically stable region.': '  Región políticamente estable.',
    '  No monitoring priority.': '  Sin prioridad de monitoreo.',
    // ═══ expansionContent.ts — municipal_budget_96 ═══
    'MUNICIPAL BUDGET ALLOCATION — 1996': 'ASIGNACIÓN PRESUPUESTARIA MUNICIPAL — 1996',
    'VARGINHA PREFECTURE': 'PREFECTURA DE VARGINHA',
    'PROJECTED REVENUE: R$ 42,500,000.00': 'INGRESOS PROYECTADOS: R$ 42.500.000,00',
    'ALLOCATION BY SECTOR:': 'ASIGNACIÓN POR SECTOR:',
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
    'SPECIAL PROJECTS:': 'PROYECTOS ESPECIALES:',
    '  - Hospital wing expansion (Phase 2)': '  - Expansión del ala hospitalaria (Fase 2)',
    '  - School renovation program': '  - Programa de renovación escolar',
    '  - Road maintenance (Rte. 381)': '  - Mantenimiento vial (Ruta 381)',
    '  - Municipal zoo improvements': '  - Mejoras del zoológico municipal',
    'STATUS: Approved by City Council, 18-DEC-1995':
      'ESTADO: Aprobado por el Concejo Municipal, 18-DIC-1995',
    // ═══ expansionContent.ts — railroad_schedule ═══
    'RAILROAD TRAFFIC — VARGINHA STATION': 'TRÁFICO FERROVIARIO — ESTACIÓN VARGINHA',
    'SCHEDULE: JANUARY 1996': 'HORARIOS: ENERO 1996',
    'REGULAR FREIGHT SERVICE:': 'SERVICIO REGULAR DE CARGA:',
    '  Mon-Fri 06:00 — Coffee cargo (southbound)':
      '  Lun-Vie 06:00 — Carga de café (dirección sur)',
    '  Mon-Fri 14:00 — Industrial goods (northbound)':
      '  Lun-Vie 14:00 — Bienes industriales (dirección norte)',
    '  Tue-Thu 22:00 — Overnight freight': '  Mar-Jue 22:00 — Carga nocturna',
    'SPECIAL MOVEMENTS:': 'MOVIMIENTOS ESPECIALES:',
    '  20-JAN 03:30 — MILITARY (classified)': '  20-ENE 03:30 — MILITAR (clasificado)',
    '                 Authorization: Regional Command':
      '                 Autorización: Comando Regional',
    '                 Cars: 3 (covered freight)': '                 Vagones: 3 (carga cubierta)',
    '                 Destination: Campinas': '                 Destino: Campinas',
    '  21-JAN 01:15 — MILITARY (classified)': '  21-ENE 01:15 — MILITAR (clasificado)',
    '                 Cars: 1 (refrigerated)': '                 Vagones: 1 (refrigerado)',
    '                 Destination: São Paulo': '                 Destino: São Paulo',
    'NOTE: Military movements not subject to': 'NOTA: Movimientos militares no sujetos a',
    '      standard scheduling protocols.': '      protocolos de programación estándar.',
    // ═══ expansionContent.ts — fire_department_log ═══
    'FIRE DEPARTMENT — INCIDENT LOG': 'CUERPO DE BOMBEROS — REGISTRO DE INCIDENTES',
    'STATION: Varginha Central': 'ESTACIÓN: Varginha Central',
    'PERIOD: 15-25 JAN 1996': 'PERÍODO: 15-25 ENE 1996',
    '15-JAN 14:22 — Grass fire, Rte. 381 km 42':
      '15-ENE 14:22 — Incendio de pastizal, Ruta 381 km 42',
    '               Cause: Cigarette': '               Causa: Cigarrillo',
    '               Resolved: 15:45': '               Resuelto: 15:45',
    '17-JAN 09:15 — Smoke alarm, Hospital Regional':
      '17-ENE 09:15 — Alarma de humo, Hospital Regional',
    '               Cause: Electrical short': '               Causa: Cortocircuito',
    '               Resolved: 10:00': '               Resuelto: 10:00',
    '18-JAN 21:30 — Vehicle fire, downtown': '18-ENE 21:30 — Incendio vehicular, centro',
    '               Cause: Engine failure': '               Causa: Falla del motor',
    '               Resolved: 22:15': '               Resuelto: 22:15',
    '20-JAN 16:45 — [REDACTED]': '20-ENE 16:45 — [SUPRIMIDO]',
    '               Location: Jardim Andere': '               Ubicación: Jardim Andere',
    '               Authorization: Military Police': '               Autorización: Policía Militar',
    '               Resolved: [CLASSIFIED]': '               Resuelto: [CLASIFICADO]',
    '20-JAN 23:00 — [REDACTED]': '20-ENE 23:00 — [SUPRIMIDO]',
    '               Location: [CLASSIFIED]': '               Ubicación: [CLASIFICADO]',
    '               Authorization: Regional Command':
      '               Autorización: Comando Regional',
    '22-JAN 11:30 — Kitchen fire, residential': '22-ENE 11:30 — Incendio de cocina, residencial',
    '               Cause: Cooking oil': '               Causa: Aceite de cocina',
    '               Resolved: 11:50': '               Resuelto: 11:50',
    '24-JAN 16:00 — False alarm, school': '24-ENE 16:00 — Falsa alarma, escuela',
    '               Cause: Student prank': '               Causa: Broma de estudiante',
    '               Resolved: 16:15': '               Resuelto: 16:15',
    'STANDARD OPERATING PROCEDURE — INCIDENT REVIEW':
      'PROCEDIMIENTO OPERATIVO ESTÁNDAR — REVISIÓN DE INCIDENTE',
    'DOCUMENT: SOP-IR-1989 (REV. 1994)': 'DOCUMENTO: SOP-IR-1989 (REV. 1994)',
    'CLASSIFICATION: INTERNAL USE': 'CLASIFICACIÓN: USO INTERNO',
    '  This protocol establishes minimum requirements for':
      '  Este protocolo establece requisitos mínimos para',
    '  internal incident reconstruction and review.':
      '  la reconstrucción y revisión interna de incidentes.',
    'APPLICABILITY:': 'APLICABILIDAD:',
    '  All personnel conducting post-incident assessment':
      '  Todo el personal que realice evaluación post-incidente',
    '  via archived terminal access.': '  mediante acceso a terminal de archivo.',
    'REVIEW DIMENSIONS': 'DIMENSIONES DE REVISIÓN',
    '  1. PHYSICAL ASSETS': '  1. ACTIVOS FÍSICOS',
    '     Recovery, transport, and disposition of materials.':
      '     Recuperación, transporte y disposición de materiales.',
    '     Cross-reference: storage/, ops/logistics/':
      '     Referencia cruzada: storage/, ops/logistics/',
    '  2. EQUIPMENT AND MATERIEL': '  2. EQUIPO Y MATERIAL',
    '     Inventory, condition assessment, and disposition.':
      '     Inventario, evaluación de condición y disposición.',
    '     Cross-reference: storage/assets/': '     Referencia cruzada: storage/assets/',
    '  3. COMMUNICATIONS': '  3. COMUNICACIONES',
    '     Signal intercepts, liaison activity, foreign contact.':
      '     Interceptación de señales, actividad de enlace, contacto extranjero.',
    '     Cross-reference: comms/': '     Referencia cruzada: comms/',
    '  4. OVERSIGHT & COORDINATION': '  4. SUPERVISIÓN Y COORDINACIÓN',
    '     Multi-agency involvement, authorization chains.':
      '     Participación multiagencia, cadenas de autorización.',
    '     Cross-reference: admin/': '     Referencia cruzada: admin/',
    '  5. FORWARD RISK ASSESSMENT': '  5. EVALUACIÓN PROSPECTIVA DE RIESGO',
    '     Projected timelines, recurrence models, contingencies.':
      '     Cronogramas proyectados, modelos de recurrencia, contingencias.',
    '     Cross-reference: admin/ (restricted)': '     Referencia cruzada: admin/ (restringido)',
    'COMPLETION CRITERIA': 'CRITERIOS DE FINALIZACIÓN',
    '  A review is considered SUBSTANTIVE when the reviewer':
      '  Una revisión se considera SUSTANTIVA cuando el revisor',
    '  has established coherent understanding across multiple':
      '  ha establecido comprensión coherente a través de múltiples',
    '  dimensions listed above.': '  dimensiones listadas arriba.',
    '  Partial reviews are flagged as INCOMPLETE.':
      '  Revisiones parciales se marcan como INCOMPLETAS.',
    '  Reviews lacking cross-dimensional correlation are':
      '  Revisiones sin correlación interdimensional se',
    '  flagged as INCOHERENT.': '  marcan como INCOHERENTES.',
    'REVIEWER OBLIGATIONS': 'OBLIGACIONES DEL REVISOR',
    '  - Reconstruct event timeline from available records':
      '  - Reconstruir cronología del evento a partir de registros disponibles',
    '  - Identify gaps in documentation or evidence':
      '  - Identificar lagunas en documentación o evidencia',
    '  - Note discrepancies between official and raw records':
      '  - Notar discrepancias entre registros oficiales y brutos',
    '  - Assess forward implications if applicable':
      '  - Evaluar implicaciones futuras cuando sea aplicable',
    '  NOTE: Reviewers should expect classification barriers.':
      '  NOTA: Los revisores deben esperar barreras de clasificación.',
    '  Some materials require elevated clearance or recovered access.':
      '  Algunos materiales requieren autorización elevada o acceso recuperado.',
    'END DOCUMENT': 'FIN DEL DOCUMENTO',
    'TERMINAL ACCESS — SESSION PARAMETERS': 'ACCESO AL TERMINAL — PARÁMETROS DE SESIÓN',
    'AUTO-GENERATED AT LOGIN': 'GENERADO AUTOMÁTICAMENTE AL INICIAR SESIÓN',
    'ACCESS TYPE: Review Terminal (Legacy Archive)':
      'TIPO DE ACCESO: Terminal de Revisión (Archivo Legado)',
    'SESSION CLASS: Incident Reconstruction': 'CLASE DE SESIÓN: Reconstrucción de Incidente',
    'REMINDER:': 'RECORDATORIO:',
    '  This terminal provides read-only access to archived':
      '  Este terminal proporciona acceso de solo lectura a',
    '  incident records. Your session activity is logged.':
      '  registros de incidentes archivados. Su actividad de sesión se registra.',
    'EXPECTED WORKFLOW:': 'FLUJO DE TRABAJO ESPERADO:',
    '  1. Navigate directories to locate relevant records':
      '  1. Navegar directorios para localizar registros relevantes',
    '  2. Open and examine files for incident details':
      '  2. Abrir y examinar archivos para detalles del incidente',
    '  3. Open recovered files directly when access allows':
      '  3. Abre archivos recuperados directamente cuando el acceso lo permita',
    '  4. Cross-reference multiple sources for correlation':
      '  4. Hacer referencia cruzada de múltiples fuentes para correlación',
    '  5. Use TRACE to monitor system awareness (optional)':
      '  5. Usar TRACE para monitorear la consciencia del sistema (opcional)',
    'COHERENCE NOTE:': 'NOTA DE COHERENCIA:',
    '  Effective reviews demonstrate correlation between':
      '  Las revisiones efectivas demuestran correlación entre',
    '  physical evidence, subject records, communications,':
      '  evidencia física, registros de sujetos, comunicaciones,',
    '  and administrative oversight.': '  y supervisión administrativa.',
    '  Random file access without correlation may trigger':
      '  El acceso aleatorio a archivos sin correlación puede activar',
    '  session monitoring as anomalous behavior.':
      '  monitoreo de sesión como comportamiento anómalo.',
    'INTERNAL MEMORANDUM — FACILITIES DIVISION': 'MEMORANDO INTERNO — DIVISIÓN DE INSTALACIONES',
    'RE: Cafeteria Service Hours': 'REF: Horarios de la Cafetería',
    'Effective 20-JAN-1996, cafeteria hours will be adjusted:':
      'A partir del 20-ENE-1996, los horarios de la cafetería se ajustarán:',
    '  Breakfast: 06:30 - 08:30': '  Desayuno: 06:30 - 08:30',
    '  Lunch: 11:30 - 13:30': '  Almuerzo: 11:30 - 13:30',
    '  Dinner: 17:30 - 19:30 (Tuesdays only)': '  Cena: 17:30 - 19:30 (solo martes)',
    'Staff working extended shifts may request meal vouchers':
      'El personal en turnos extendidos puede solicitar vales de comida',
    'from the Administrative Office (Room 204).': 'en la Oficina Administrativa (Sala 204).',
    'The vending machines on Floor 3 remain operational 24h.':
      'Las máquinas expendedoras en el Piso 3 permanecen operativas 24h.',
    'Questions: Contact Facilities ext. 2240': 'Preguntas: Contactar Instalaciones ext. 2240',
    'PARKING ALLOCATION — JANUARY 1996': 'ASIGNACIÓN DE ESTACIONAMIENTO — ENERO 1996',
    'ADMINISTRATIVE SERVICES': 'SERVICIOS ADMINISTRATIVOS',
    'LOT A (Reserved):': 'LOTE A (Reservado):',
    '  A-01 through A-15: Director-level personnel': '  A-01 a A-15: Personal de nivel directivo',
    '  A-16 through A-20: Visiting officials': '  A-16 a A-20: Oficiales visitantes',
    'LOT B (General):': 'LOTE B (General):',
    '  First-come basis. Gates close at 22:00.':
      '  Por orden de llegada. Puertas cierran a las 22:00.',
    'NOTICE:': 'AVISO:',
    '  Effective 21-JAN, Lot B Section 3 will be closed':
      '  A partir del 21-ENE, la Sección 3 del Lote B será cerrada',
    '  for resurfacing. Duration: 5 business days.':
      '  para repavimentación. Duración: 5 días hábiles.',
    'Overflow parking available at municipal lot (200m east).':
      'Estacionamiento adicional disponible en lote municipal (200m al este).',
    'Shuttle service discontinued due to budget constraints.':
      'Servicio de transporte discontinuado por restricciones presupuestarias.',
    'BUDGET REQUEST — Q1 1996': 'SOLICITUD DE PRESUPUESTO — T1 1996',
    'DEPARTMENT: Regional Intelligence (Sector 7)':
      'DEPARTAMENTO: Inteligencia Regional (Sector 7)',
    'SUBMITTED: 08-JAN-1996': 'ENVIADO: 08-ENE-1996',
    'REQUESTED ALLOCATIONS:': 'ASIGNACIONES SOLICITADAS:',
    '  Routine operations. No special projects anticipated.':
      '  Operaciones de rutina. Ningún proyecto especial anticipado.',
    'STATUS: PENDING APPROVAL': 'ESTADO: APROBACIÓN PENDIENTE',
    'NOTE: Request submitted BEFORE incident of 20-JAN.':
      'NOTA: Solicitud enviada ANTES del incidente del 20-ENE.',
    '      Supplemental request to follow separately.':
      '      Solicitud suplementaria a seguir por separado.',
    'INTERCEPT SUMMARY — DECEMBER 1995': 'RESUMEN DE INTERCEPTACIÓN — DICIEMBRE 1995',
    'CLASSIFICATION: ROUTINE': 'CLASIFICACIÓN: RUTINA',
    'REGION: Minas Gerais / São Paulo Border': 'REGIÓN: Frontera Minas Gerais / São Paulo',
    'TOTAL INTERCEPTS: 47': 'TOTAL DE INTERCEPTACIONES: 47',
    'FLAGGED FOR REVIEW: 3': 'MARCADOS PARA REVISIÓN: 3',
    'ACTIONABLE INTELLIGENCE: 0': 'INTELIGENCIA ACCIONABLE: 0',
    '  Agricultural price discussions (12)': '  Discusiones sobre precios agrícolas (12)',
    '  Personal/family communications (28)': '  Comunicaciones personales/familiares (28)',
    '  Commercial negotiations (5)': '  Negociaciones comerciales (5)',
    '  Political commentary (2)': '  Comentarios políticos (2)',
    'NOTES:': 'NOTAS:',
    '  No unusual activity detected.': '  Ninguna actividad inusual detectada.',
    '  Recommend maintaining current monitoring level.':
      '  Se recomienda mantener el nivel actual de monitoreo.',
    'SIGNAL INTERCEPT — AUDIO CAPTURE': 'INTERCEPTACIÓN DE SEÑAL — CAPTURA DE AUDIO',
    'DATE: 20-JAN-1996 03:47 LOCAL': 'FECHA: 20-ENE-1996 03:47 LOCAL',
    'LOCATION: Triangulation point near recovery site':
      'UBICACIÓN: Punto de triangulación cerca del sitio de recuperación',
    'INTERCEPT TYPE: Morse code transmission':
      'TIPO DE INTERCEPTACIÓN: Transmisión en código Morse',
    'FREQUENCY: 7.125 MHz (amateur band, unauthorized)':
      'FRECUENCIA: 7,125 MHz (banda amateur, no autorizada)',
    'DURATION: 8.4 seconds': 'DURACIÓN: 8,4 segundos',
    'RAW SIGNAL TRANSCRIPTION:': 'TRANSCRIPCIÓN BRUTA DE SEÑAL:',
    'MORSE CODE REFERENCE:': 'REFERENCIA DE CÓDIGO MORSE:',
    '  (Space between letters: 3 units)': '  (Espacio entre letras: 3 unidades)',
    '  (Space between words: 7 units)': '  (Espacio entre palabras: 7 unidades)',
    'ANALYST NOTES:': 'NOTAS DEL ANALISTA:',
    '  Transmission origin unknown. Signal appeared on frequency':
      '  Origen de la transmisión desconocido. Señal apareció en frecuencia',
    '  used by ground teams but NOT from any authorized unit.':
      '  usada por equipos de tierra pero NO de ninguna unidad autorizada.',
    '  Signal pre-dates official COMINT sweep by 6 hours.':
      '  La señal precede al barrido COMINT oficial por 6 horas.',
    "  Believe this is a field operator's authentication code.":
      '  Se cree que este es un código de autenticación de operador de campo.',
    '  NOTE: Cross-reference with admin override credentials.':
      '  NOTA: Referencia cruzada con credenciales de override administrativo.',
    '  Decode may yield system access passphrase.':
      '  La decodificación puede revelar la contraseña de acceso al sistema.',
    '  PRIORITY: Decipher message content.': '  PRIORIDAD: Descifrar contenido del mensaje.',
    '  STATUS: PENDING INTERPRETATION': '  ESTADO: INTERPRETACIÓN PENDIENTE',
    'HVAC MAINTENANCE LOG — BUILDING 3': 'REGISTRO DE MANTENIMIENTO HVAC — EDIFICIO 3',
    'PERIOD: 01-JAN-1996 to 31-JAN-1996': 'PERÍODO: 01-ENE-1996 a 31-ENE-1996',
    '03-JAN: Filter replacement, Floor 2 units (routine)':
      '03-ENE: Reemplazo de filtros, unidades del Piso 2 (rutina)',
    '07-JAN: Compressor inspection, Rooftop Unit A (passed)':
      '07-ENE: Inspección del compresor, Unidad de Azotea A (aprobado)',
    '12-JAN: Thermostat calibration, Room 317 (adjusted +2C)':
      '12-ENE: Calibración del termostato, Sala 317 (ajustado +2C)',
    '18-JAN: Duct cleaning, Basement level (completed)':
      '18-ENE: Limpieza de conductos, Nivel del sótano (completado)',
    '22-JAN: EMERGENCY — Basement cold storage unit failure':
      '22-ENE: EMERGENCIA — Falla de la unidad de almacenamiento frío del sótano',
    '        Cause: Power surge. Backup generator activated.':
      '        Causa: Sobretensión. Generador de respaldo activado.',
    '        Duration of outage: 4 hours.': '        Duración de la interrupción: 4 horas.',
    '        Estimated spoilage: CLASSIFIED': '        Pérdida estimada: CLASIFICADO',
    '25-JAN: Cold storage unit repaired. Testing satisfactory.':
      '25-ENE: Unidad de almacenamiento frío reparada. Prueba satisfactoria.',
    '28-JAN: Routine inspection, all floors (no issues)':
      '28-ENE: Inspección de rutina, todos los pisos (sin problemas)',
    'PERSONNEL TRANSFER NOTICE': 'AVISO DE TRANSFERENCIA DE PERSONAL',
    'EFFECTIVE: 01-FEB-1996': 'VIGENCIA: 01-FEB-1996',
    'The following transfers are confirmed:': 'Las siguientes transferencias están confirmadas:',
    '  CPT. R. FERREIRA → Brasília (Central Command)':
      '  CPT. R. FERREIRA → Brasília (Comando Central)',
    '  SGT. A. LIMA → São Paulo (Liaison Office)': '  SGT. A. LIMA → São Paulo (Oficina de Enlace)',
    '  ANALYST M. COSTA → CLASSIFIED ASSIGNMENT': '  ANALISTA M. COSTA → ASIGNACIÓN CLASIFICADA',
    'Exit interviews scheduled for 30-JAN.': 'Entrevistas de salida programadas para 30-ENE.',
    'Access credentials to be revoked 01-FEB 00:00.':
      'Credenciales de acceso serán revocadas el 01-FEB 00:00.',
    "NOTE: CPT. FERREIRA's case files transferred to":
      'NOTA: Archivos de caso del CPT. FERREIRA transferidos a',
    '      Acting Chief L. ANDRADE pending replacement.':
      '      Jefe Interino L. ANDRADE en espera de reemplazo.',
    'REGIONAL INTELLIGENCE SUMMARY — JANUARY 1996': 'RESUMEN DE INTELIGENCIA REGIONAL — ENERO 1996',
    'SECTOR: Triângulo Mineiro': 'SECTOR: Triângulo Mineiro',
    'PRIORITY ITEMS: None': 'ELEMENTOS PRIORITARIOS: Ninguno',
    'ROUTINE MONITORING:': 'MONITOREO DE RUTINA:',
    '  - Labor union activity: Normal seasonal levels':
      '  - Actividad sindical: Niveles estacionales normales',
    '  - Agricultural sector: Soy prices stable': '  - Sector agrícola: Precios de soja estables',
    '  - Border crossings: Within expected parameters':
      '  - Cruces de frontera: Dentro de los parámetros esperados',
    'ANOMALIES:': 'ANOMALÍAS:',
    '  - 17-JAN: Unauthorized radio transmission near Uberaba':
      '  - 17-ENE: Transmisión de radio no autorizada cerca de Uberaba',
    '    Assessment: Amateur operator (warning issued)':
      '    Evaluación: Operador amateur (advertencia emitida)',
    '  - 19-JAN: Unscheduled cargo delivery, regional depot':
      '  - 19-ENE: Entrega de carga no programada, depósito regional',
    '    Assessment: Paperwork error (corrected)':
      '    Evaluación: Error de documentación (corregido)',
    'ANALYST NOTE:': 'NOTA DEL ANALISTA:',
    '  No items require escalation this period.':
      '  Ningún elemento requiere escalamiento en este período.',
    'ASSET TRANSFER FORM — ATF-1996-0023': 'FORMULARIO DE TRANSFERENCIA DE ACTIVOS — ATF-1996-0023',
    'STATUS: INCOMPLETE — RETURNED FOR CORRECTION': 'ESTADO: INCOMPLETO — DEVUELTO PARA CORRECCIÓN',
    'TRANSFER FROM: HOLDING-7': 'TRANSFERENCIA DESDE: HOLDING-7',
    'TRANSFER TO: [FIELD LEFT BLANK]': 'TRANSFERENCIA A: [CAMPO EN BLANCO]',
    'ITEMS:': 'ARTÍCULOS:',
    '  1x Container, sealed, 45kg': '  1x Contenedor, sellado, 45kg',
    '  1x Case, documents, classified': '  1x Maletín, documentos, clasificados',
    'ERROR: Receiving party signature MISSING': 'ERROR: Firma de la parte receptora FALTANTE',
    'ERROR: Authorization code INVALID': 'ERROR: Código de autorización INVÁLIDO',
    'ERROR: Destination facility code NOT RECOGNIZED':
      'ERROR: Código de instalación de destino NO RECONOCIDO',
    'RETURN NOTE:': 'NOTA DE DEVOLUCIÓN:',
    '  Form returned to originator for correction.':
      '  Formulario devuelto al remitente para corrección.',
    '  Transfer pending until paperwork complete.':
      '  Transferencia pendiente hasta completar la documentación.',
    'TEMPORARY NOTE — DO NOT ARCHIVE': 'NOTA TEMPORAL — NO ARCHIVAR',
    'Remember:': 'Recordar:',
    '  - Pick up dry cleaning Thursday': '  - Recoger ropa de la tintorería el jueves',
    '  - Call mother re: birthday': '  - Llamar a mamá ref: cumpleaños',
    '  - Ask IT about printer on Floor 2': '  - Preguntar a TI sobre la impresora del Piso 2',
    'Meeting notes (delete later):': 'Notas de la reunión (borrar después):',
    '  Director seemed tense today.': '  El director parecía tenso hoy.',
    '  Something about "special cargo" needing accommodation.':
      '  Algo sobre "carga especial" que necesita acomodación.',
    '  Nobody tells us anything around here.': '  Nadie nos dice nada por aquí.',
    'OFFICE SUPPLIES REQUEST — JANUARY 1996': 'SOLICITUD DE MATERIAL DE OFICINA — ENERO 1996',
    'DEPARTMENT: Records & Archives': 'DEPARTAMENTO: Registros y Archivos',
    'Requested Items:': 'Artículos Solicitados:',
    '  - Pens, ballpoint, blue (box of 50)': '  - Bolígrafos, azules (caja de 50)',
    '  - Paper, A4, 80gsm (10 reams)': '  - Papel, A4, 80g/m² (10 resmas)',
    '  - Staples, standard (5 boxes)': '  - Grapas, estándar (5 cajas)',
    '  - Folders, manila (100 units)': '  - Carpetas, manila (100 unidades)',
    '  - Correction fluid (12 bottles)': '  - Corrector líquido (12 frascos)',
    '  Standard quarterly replenishment.': '  Reabastecimiento trimestral estándar.',
    'APPROVED: M. SANTOS, Administrative Officer': 'APROBADO: M. SANTOS, Oficial Administrativo',
    'STAFF BIRTHDAYS — JANUARY 1996': 'CUMPLEAÑOS DEL PERSONAL — ENERO 1996',
    'COMPILED BY: Social Committee': 'COMPILADO POR: Comité Social',
    'NOTE: Cake contributions are voluntary.':
      'NOTA: Las contribuciones para el pastel son voluntarias.',
    '      Sign up sheet in break room.': '      Hoja de inscripción en la sala de descanso.',
    'INTERNAL TELEPHONE DIRECTORY — 1996 EDITION': 'DIRECTORIO TELEFÓNICO INTERNO — EDICIÓN 1996',
    'ADMINISTRATION:': 'ADMINISTRACIÓN:',
    'OPERATIONS:': 'OPERACIONES:',
    'SUPPORT:': 'SOPORTE:',
    'EMERGENCY: Dial 0 for external line': 'EMERGENCIA: Marque 0 para línea externa',
    'VEHICLE MILEAGE LOG — JANUARY 1996': 'REGISTRO DE KILOMETRAJE DE VEHÍCULOS — ENERO 1996',
    'POOL VEHICLE: GOL 1.0 (Plate: AAB-1234)': 'VEHÍCULO DEL POOL: GOL 1.0 (Placa: AAB-1234)',
    'DATE       DRIVER        START    END      DEST':
      'FECHA      CONDUCTOR     INICIO   FIN      DEST',
    'NOTE: Fuel reimbursement forms in Fleet Office.':
      'NOTA: Formularios de reembolso de combustible en la Oficina de Flota.',
    'IT DEPARTMENT NOTICE': 'AVISO DEL DEPARTAMENTO DE TI',
    'RE: Floor 2 Printer Issues': 'REF: Problemas de la Impresora del Piso 2',
    'The HP LaserJet on Floor 2 is experiencing paper jams.':
      'La HP LaserJet en el Piso 2 está experimentando atascos de papel.',
    'Temporary workaround:': 'Solución temporal:',
    '  - Use the dot matrix printer in Room 215': '  - Use la impresora matricial en la Sala 215',
    '  - Submit large jobs to Print Center (B-1)':
      '  - Envíe trabajos grandes al Centro de Impresión (B-1)',
    'Parts have been ordered. ETA: 2-3 weeks.':
      'Las piezas han sido ordenadas. Llegada estimada: 2-3 semanas.',
    'We apologize for the inconvenience.': 'Pedimos disculpas por el inconveniente.',
    'IT Helpdesk - ext. 4000': 'Mesa de Ayuda TI - ext. 4000',
    'ANONYMOUS FEEDBACK FORM': 'FORMULARIO DE RETROALIMENTACIÓN ANÓNIMA',
    'RE: Cafeteria Service': 'REF: Servicio de Cafetería',
    'SUBMITTED: 18-JAN-1996': 'ENVIADO: 18-ENE-1996',
    'COMPLAINT:': 'QUEJA:',
    '  The coffee machine has been broken for three weeks.':
      '  La máquina de café ha estado rota durante tres semanas.',
    '  Nobody seems to care. This is unacceptable.':
      '  A nadie parece importarle. Esto es inaceptable.',
    'SUGGESTION:': 'SUGERENCIA:',
    '  Bring back the Thursday feijoada. It was the only':
      '  Traigan de vuelta la feijoada de los jueves. Era lo único',
    '  thing worth eating here.': '  que valía la pena comer aquí.',
    'RESPONSE (Admin):': 'RESPUESTA (Admin):',
    '  Coffee machine repair scheduled for 25-JAN.':
      '  Reparación de la máquina de café programada para el 25-ENE.',
    '  Feijoada discontinued due to budget constraints.':
      '  Feijoada descontinuada por restricciones presupuestarias.',
    '  We appreciate your feedback.': '  Agradecemos su retroalimentación.',
    'MEMORANDUM — SECURITY DIVISION': 'MEMORANDO — DIVISIÓN DE SEGURIDAD',
    'RE: Annual Badge Renewal': 'REF: Renovación Anual de Credencial',
    'All personnel must renew access badges by 31-JAN-1996.':
      'Todo el personal debe renovar credenciales de acceso antes del 31-ENE-1996.',
    'Required documents:': 'Documentos requeridos:',
    '  - Current badge': '  - Credencial actual',
    '  - Valid government ID': '  - Identificación gubernamental vigente',
    '  - Updated photo (taken at Security Office)':
      '  - Foto actualizada (tomada en la Oficina de Seguridad)',
    '  - Supervisor approval form': '  - Formulario de aprobación del supervisor',
    'Temporary extensions available for personnel on':
      'Extensiones temporales disponibles para personal en',
    'field assignment during the renewal window.':
      'asignación de campo durante el período de renovación.',
    'Non-compliance will result in access suspension.':
      'El incumplimiento resultará en suspensión del acceso.',
    'Security Division - ext. 2500': 'División de Seguridad - ext. 2500',
    'TRAINING SCHEDULE — Q1 1996': 'CRONOGRAMA DE CAPACITACIÓN — T1 1996',
    'HUMAN RESOURCES DEPARTMENT': 'DEPARTAMENTO DE RECURSOS HUMANOS',
    'MANDATORY TRAINING:': 'CAPACITACIÓN OBLIGATORIA:',
    '  15-JAN: Fire Safety Refresher (All staff)':
      '  15-ENE: Repaso de Seguridad contra Incendios (Todo el personal)',
    '  22-JAN: Information Security Basics (New hires)':
      '  22-ENE: Fundamentos de Seguridad de la Información (Nuevos empleados)',
    '  05-FEB: First Aid Certification (Floor wardens)':
      '  05-FEB: Certificación de Primeros Auxilios (Encargados de piso)',
    '  12-FEB: Document Handling Procedures (Archives)':
      '  12-FEB: Procedimientos de Manejo de Documentos (Archivo)',
    'OPTIONAL WORKSHOPS:': 'TALLERES OPCIONALES:',
    '  29-JAN: Word Processing Tips (Room 204)':
      '  29-ENE: Consejos de Procesamiento de Texto (Sala 204)',
    '  08-FEB: Stress Management (Auditorium)': '  08-FEB: Manejo del Estrés (Auditorio)',
    'Registration: Contact HR ext. 2300': 'Inscripción: Contactar RRHH ext. 2300',
    'LOST AND FOUND — JANUARY 1996': 'OBJETOS PERDIDOS Y ENCONTRADOS — ENERO 1996',
    'LOCATION: Security Desk, Building Lobby':
      'UBICACIÓN: Recepción de Seguridad, Vestíbulo del Edificio',
    'ITEMS FOUND:': 'OBJETOS ENCONTRADOS:',
    '  03-JAN: Black umbrella (Floor 3 bathroom)': '  03-ENE: Paraguas negro (baño del Piso 3)',
    '  07-JAN: Reading glasses in brown case': '  07-ENE: Gafas de lectura en estuche marrón',
    '  11-JAN: Set of keys (car + house)': '  11-ENE: Juego de llaves (auto + casa)',
    '  14-JAN: Watch, silver, digital (cafeteria)':
      '  14-ENE: Reloj, plateado, digital (cafetería)',
    '  19-JAN: Wallet, brown leather (parking lot B)':
      '  19-ENE: Billetera, cuero marrón (estacionamiento B)',
    '  22-JAN: [ITEM DESCRIPTION CLASSIFIED]': '  22-ENE: [DESCRIPCIÓN DEL ARTÍCULO CLASIFICADA]',
    'Items will be held for 30 days.': 'Los artículos se guardarán por 30 días.',
    'Unclaimed items donated to charity.': 'Artículos no reclamados donados a caridad.',
    'MEMORANDUM — OFFICE SUPPLIES BUDGET': 'MEMORANDO — PRESUPUESTO DE MATERIAL DE OFICINA',
    'DEPARTMENT: Administrative Services': 'DEPARTAMENTO: Servicios Administrativos',
    'RE: Paper Clip Requisition Dispute': 'REF: Disputa de Requisición de Clips',
    'The recent audit has identified discrepancies in paper':
      'La auditoría reciente ha identificado discrepancias en el consumo',
    'clip consumption across departments.': 'de clips de papel entre los departamentos.',
    '  Q4 1995 paper clip usage: 47 boxes': '  Uso de clips de papel T4 1995: 47 cajas',
    '  Q4 1995 paper clip budget: 32 boxes': '  Presupuesto de clips de papel T4 1995: 32 cajas',
    '  Variance: +15 boxes (47% over budget)': '  Variación: +15 cajas (47% sobre presupuesto)',
    'REMEDIATION:': 'REMEDIACIÓN:',
    '  1. All departments must submit itemized supply':
      '  1. Todos los departamentos deben enviar solicitudes',
    '     requests by the 15th of each month.':
      '     detalladas de suministros antes del día 15 de cada mes.',
    '  2. Bulk purchases require supervisor approval.':
      '  2. Las compras al por mayor requieren aprobación del supervisor.',
    '  3. Reuse of paper clips is encouraged.':
      '  3. Se fomenta la reutilización de clips de papel.',
    'NOTE: The acquisition of "jumbo" paper clips must be':
      'NOTA: La adquisición de clips de papel "jumbo" debe ser',
    'justified in writing. Standard size is sufficient for':
      'justificada por escrito. El tamaño estándar es suficiente para',
    'most document binding requirements.':
      'la mayoría de las necesidades de encuadernación de documentos.',
    'Questions to: Procurement, ext. 2140': 'Preguntas a: Adquisiciones, ext. 2140',
    'SCHEDULED MAINTENANCE — Q1 1996': 'MANTENIMIENTO PROGRAMADO — T1 1996',
    'FACILITIES MANAGEMENT': 'GESTIÓN DE INSTALACIONES',
    'JANUARY:': 'ENERO:',
    '  08-JAN: Elevator inspection (Building A)': '  08-ENE: Inspección de ascensor (Edificio A)',
    '  15-JAN: Fire extinguisher certification':
      '  15-ENE: Certificación de extintores de incendio',
    '  22-JAN: Generator test (postponed - see incident)':
      '  22-ENE: Prueba de generador (pospuesta - ver incidente)',
    '  29-JAN: Pest control service': '  29-ENE: Servicio de control de plagas',
    'FEBRUARY:': 'FEBRERO:',
    '  05-FEB: Roof inspection': '  05-FEB: Inspección del techo',
    '  12-FEB: Emergency lighting test': '  12-FEB: Prueba de iluminación de emergencia',
    '  19-FEB: Water tank cleaning (after hours)':
      '  19-FEB: Limpieza del tanque de agua (fuera de horario)',
    '  26-FEB: HVAC filter replacement': '  26-FEB: Reemplazo de filtros HVAC',
    'MARCH:': 'MARZO:',
    '  04-MAR: Window cleaning (exterior)': '  04-MAR: Limpieza de ventanas (exterior)',
    '  11-MAR: Carpet shampooing (Floor 2)': '  11-MAR: Lavado de alfombras (Piso 2)',
    '  18-MAR: Electrical panel inspection': '  18-MAR: Inspección del panel eléctrico',
    '  25-MAR: Plumbing review (all floors)': '  25-MAR: Revisión de plomería (todos los pisos)',
    'Maintenance requests: ext. 2200 or Form F-112':
      'Solicitudes de mantenimiento: ext. 2200 o Formulario F-112',
    'CAFETERIA MENU — WEEK 04 (22-26 JAN 1996)': 'MENÚ DE CAFETERÍA — SEMANA 04 (22-26 ENE 1996)',
    'SEGUNDA-FEIRA (Monday):': 'LUNES:',
    '  Strogonoff de frango': '  Strogonoff de pollo',
    '  Arroz, batata palha': '  Arroz, papas paja',
    '  Salada verde': '  Ensalada verde',
    'TERÇA-FEIRA (Tuesday):': 'MARTES:',
    '  Bife à milanesa': '  Milanesa de res',
    '  Arroz, feijão, farofa': '  Arroz, frijoles, farofa',
    'QUARTA-FEIRA (Wednesday):': 'MIÉRCOLES:',
    '  Moqueca de peixe': '  Moqueca de pescado',
    '  Arroz branco, pirão': '  Arroz blanco, pirão',
    '  Couve refogada': '  Col salteada',
    'QUINTA-FEIRA (Thursday):': 'JUEVES:',
    '  Cozido à portuguesa': '  Cocido a la portuguesa',
    '  Legumes variados': '  Verduras variadas',
    '  Pão de alho': '  Pan de ajo',
    'SEXTA-FEIRA (Friday):': 'VIERNES:',
    '  Feijoada light': '  Feijoada ligera',
    '  Arroz, couve, laranja': '  Arroz, col, naranja',
    '  Farofa simples': '  Farofa simple',
    'SOBREMESA: Pudim de leite (Mon-Wed)': 'POSTRE: Pudín de leche (Lun-Mié)',
    '           Goiabada com queijo (Thu-Fri)': '           Guayabada con queso (Jue-Vie)',
    'SUCO DO DIA: R$ 0,50': 'JUGO DEL DÍA: R$ 0,50',
    '             Maracujá | Caju | Acerola': '             Maracuyá | Marañón | Acerola',
    'Dona Maria wishes everyone a good week.': 'Doña María les desea a todos una buena semana.',
    'PARKING LOT REGULATIONS': 'REGLAMENTO DEL ESTACIONAMIENTO',
    'EFFECTIVE: 01-JAN-1996': 'VIGENCIA: 01-ENE-1996',
    'GENERAL RULES:': 'REGLAS GENERALES:',
    '  1. All vehicles must display valid parking permit.':
      '  1. Todos los vehículos deben exhibir permiso de estacionamiento vigente.',
    '  2. Speed limit: 10 km/h in all areas.':
      '  2. Límite de velocidad: 10 km/h en todas las áreas.',
    '  3. No parking in fire lanes (marked in red).':
      '  3. Prohibido estacionar en carriles de emergencia (marcados en rojo).',
    '  4. Motorcycles: designated area only (Lot C).':
      '  4. Motocicletas: solo en área designada (Lote C).',
    '  5. No overnight parking without authorization.':
      '  5. Prohibido estacionamiento nocturno sin autorización.',
    'PERMIT TYPES:': 'TIPOS DE PERMISO:',
    '  BLUE:   Directors and visiting officials': '  AZUL:   Directores y oficiales visitantes',
    '  GREEN:  Permanent staff': '  VERDE:  Personal permanente',
    '  YELLOW: Temporary/contractor access': '  AMARILLO: Acceso temporal/contratista',
    '  RED:    Emergency vehicles only': '  ROJO:   Solo vehículos de emergencia',
    'VIOLATIONS:': 'INFRACCIONES:',
    '  First offense:  Written warning': '  Primera infracción: Advertencia por escrito',
    '  Second offense: R$ 20,00 fine': '  Segunda infracción: Multa de R$ 20,00',
    '  Third offense:  Parking privilege suspension':
      '  Tercera infracción: Suspensión del privilegio de estacionamiento',
    'Lost permits: Report to Security, ext. 2000':
      'Permisos perdidos: Reportar a Seguridad, ext. 2000',
    'Replacement fee: R$ 5,00': 'Tarifa de reemplazo: R$ 5,00',
    'LOST AND FOUND LOG — DETAILED RECORD':
      'REGISTRO DE OBJETOS PERDIDOS Y ENCONTRADOS — REGISTRO DETALLADO',
    'SECURITY DESK — JANUARY 1996': 'RECEPCIÓN DE SEGURIDAD — ENERO 1996',
    '03-JAN | 14:30 | FOUND: Black umbrella': '03-ENE | 14:30 | ENCONTRADO: Paraguas negro',
    "                Location: Floor 3 men's bathroom":
      '                Ubicación: Baño de hombres del Piso 3',
    '                Finder: Cleaning staff (M. Santos)':
      '                Encontrado por: Personal de limpieza (M. Santos)',
    '                Status: CLAIMED 09-JAN': '                Estado: RECLAMADO 09-ENE',
    '07-JAN | 09:15 | FOUND: Reading glasses, brown case':
      '07-ENE | 09:15 | ENCONTRADO: Gafas de lectura, estuche marrón',
    '                Location: Conference Room B':
      '                Ubicación: Sala de Conferencias B',
    '                Finder: Meeting attendee':
      '                Encontrado por: Asistente a reunión',
    '                Status: UNCLAIMED': '                Estado: NO RECLAMADO',
    '11-JAN | 16:45 | FOUND: Key ring (3 keys)': '11-ENE | 16:45 | ENCONTRADO: Llavero (3 llaves)',
    '                Location: Elevator, Floor 1': '                Ubicación: Ascensor, Piso 1',
    '                Finder: Security guard (P. Rocha)':
      '                Encontrado por: Guardia de seguridad (P. Rocha)',
    '                Status: CLAIMED 12-JAN': '                Estado: RECLAMADO 12-ENE',
    '14-JAN | 12:00 | FOUND: Digital watch (Casio)':
      '14-ENE | 12:00 | ENCONTRADO: Reloj digital (Casio)',
    '                Location: Cafeteria, Table 7': '                Ubicación: Cafetería, Mesa 7',
    '                Finder: Cafeteria staff':
      '                Encontrado por: Personal de cafetería',
    '19-JAN | 18:20 | FOUND: Brown leather wallet':
      '19-ENE | 18:20 | ENCONTRADO: Billetera de cuero marrón',
    '                Location: Parking Lot B, near entrance':
      '                Ubicación: Estacionamiento B, cerca de la entrada',
    '                Finder: Guard (night shift)':
      '                Encontrado por: Guardia (turno nocturno)',
    '                Contents: ID, R$ 47,00, photos':
      '                Contenido: Identificación, R$ 47,00, fotos',
    '                Status: CLAIMED 20-JAN (owner verified)':
      '                Estado: RECLAMADO 20-ENE (propietario verificado)',
    '22-JAN | 03:00 | [RECORD SEALED - SECURITY OVERRIDE]':
      '22-ENE | 03:00 | [REGISTRO SELLADO - OVERRIDE DE SEGURIDAD]',
    'VACATION SCHEDULE — Q1 1996': 'CALENDARIO DE VACACIONES — T1 1996',
    '  - Vacation requests require 30-day advance notice':
      '  - Las solicitudes de vacaciones requieren 30 días de anticipación',
    '  - Maximum consecutive days: 20': '  - Máximo de días consecutivos: 20',
    '  - Carryover from 1995: Use by 28-FEB': '  - Saldo de 1995: Usar antes del 28-FEB',
    'Questions: HR Office, ext. 2050': 'Preguntas: Oficina de RRHH, ext. 2050',
    'ACCESS CODE AUDIT — INTERNAL SECURITY REVIEW':
      'AUDITORÍA DE CÓDIGO DE ACCESO — REVISIÓN INTERNA DE SEGURIDAD',
    'DATE: 18-DEC-1995': 'FECHA: 18-DIC-1995',
    'SUBJECT: Annual Access Code Compliance Review':
      'ASUNTO: Revisión Anual de Cumplimiento de Código de Acceso',
    'Per Security Directive 1995-12, all departmental access':
      'Según la Directiva de Seguridad 1995-12, todos los códigos',
    'codes have been reviewed for compliance with naming':
      'de acceso departamentales han sido revisados en cuanto al cumplimiento de',
    'conventions established in Memo SEC-89-04.':
      'convenciones de nomenclatura establecidas en el Memo SEC-89-04.',
    '  Current codes use agricultural terminology as':
      '  Los códigos actuales usan terminología agrícola según',
    '  mandated by Project Operations naming standard.':
      '  lo mandado por el estándar de nomenclatura de Operaciones de Proyecto.',
    '  Recent audit flagged the following code for':
      '  La auditoría reciente señaló el siguiente código por',
    '  pattern recognition vulnerability:': '  vulnerabilidad de reconocimiento de patrones:',
    '  While the code follows naming convention, the':
      '  Aunque el código sigue la convención de nomenclatura, la',
    '  sequential letter arrangement may be susceptible':
      '  disposición secuencial de letras puede ser susceptible',
    '  to systematic enumeration attacks.': '  a ataques de enumeración sistemática.',
    '  Code remains acceptable for current fiscal year.':
      '  El código permanece aceptable para el año fiscal actual.',
    '  Consider alphanumeric substitution for FY1997.':
      '  Considerar sustitución alfanumérica para el AF1997.',
    'AUDITOR: Systems Administration': 'AUDITOR: Administración de Sistemas',
    'DISTRIBUTION: Terminal operators, Security Office':
      'DISTRIBUCIÓN: Operadores de terminal, Oficina de Seguridad',
    'WEEKEND DUTY ROSTER — JANUARY 1996': 'LISTA DE SERVICIO DE FIN DE SEMANA — ENERO 1996',
    'OPERATIONS CENTER': 'CENTRO DE OPERACIONES',
    '20-21 JAN: [CANCELLED - ALL HANDS ON DECK]': '20-21 ENE: [CANCELADO - TODOS A SUS PUESTOS]',
    '  - Weekend of 20-21 JAN: Full staff mobilization':
      '  - Fin de semana del 20-21 ENE: Movilización total del personal',
    '    per Director order. No details provided.':
      '    por orden del Director. Sin detalles proporcionados.',
    '  - Overtime requests to HR by Wednesday prior.':
      '  - Solicitudes de horas extras a RRHH antes del miércoles previo.',
    'Duty Officer: ext. 3000 (24h)': 'Oficial de Servicio: ext. 3000 (24h)',
    'MEMORANDUM — TERMINAL ACCESS OVERRIDE': 'MEMORANDO — OVERRIDE DE ACCESO AL TERMINAL',
    'TO: All Terminal Operators': 'PARA: Todos los Operadores de Terminal',
    'FROM: Systems Administration': 'DE: Administración de Sistemas',
    'DATE: December 1995': 'FECHA: Diciembre de 1995',
    'Per Director mandate, emergency terminal override codes':
      'Por mandato del Director, los códigos de override de emergencia del terminal',
    'have been updated for the new fiscal year.': 'han sido actualizados para el nuevo año fiscal.',
    'The override protocol allows access to restricted':
      'El protocolo de override permite acceso a directorios',
    'directories when standard authentication is unavailable.':
      'restringidos cuando la autenticación estándar no está disponible.',
    'USAGE:': 'USO:',
    'CURRENT CODE:': 'CÓDIGO ACTUAL:',
    '  Project designation word. Agricultural term.':
      '  Palabra de designación del proyecto. Término agrícola.',
    '  Portuguese. Related to extraction operations.':
      '  Portugués. Relacionado con operaciones de extracción.',
    '  The code references our operational codename.':
      '  El código referencia nuestro nombre clave operacional.',
    '  Think: what do you do at harvest time?': '  Piense: ¿qué se hace en la época de cosecha?',
    'DO NOT share this code with unauthorized personnel.':
      'NO comparta este código con personal no autorizado.',
    '            SECURITY ALERT — INTRUSION DETECTED             ':
      '            ALERTA DE SEGURIDAD — INTRUSIÓN DETECTADA             ',
    'This file is a HONEYPOT.': 'Este archivo es un HONEYPOT.',
    'Your terminal ID has been logged.': 'Su ID de terminal ha sido registrado.',
    'Your access pattern has been flagged.': 'Su patrón de acceso ha sido marcado.',
    'Security personnel have been notified.': 'El personal de seguridad ha sido notificado.',
    'REMAIN AT YOUR TERMINAL.': 'PERMANEZCA EN SU TERMINAL.',
    '               DECOY FILE — ACCESS LOGGED                   ':
      '               ARCHIVO SEÑUELO — ACCESO REGISTRADO                   ',
    'This file was planted to identify unauthorized access.':
      'Este archivo fue plantado para identificar acceso no autorizado.',
    'Real evidence is never labeled this obviously.':
      'La evidencia real nunca se etiqueta tan obviamente.',
    'You should have known better.': 'Debería haberlo sabido.',
    'Your session has been marked for termination.': 'Su sesión ha sido marcada para terminación.',
    '              TRAP FILE — INTRUSION CONFIRMED               ':
      '              ARCHIVO TRAMPA — INTRUSIÓN CONFIRMADA               ',
    'Classification level "FOR PRESIDENTS EYES ONLY" does not':
      'El nivel de clasificación "SOLO PARA LOS OJOS DEL PRESIDENTE" no',
    'exist in any real intelligence system.': 'existe en ningún sistema de inteligencia real.',
    'This was a test. You failed.': 'Esto fue una prueba. Usted falló.',
    'Countermeasures deployed.': 'Contramedidas desplegadas.',
    '                HONEYPOT TRIGGERED                          ':
      '                HONEYPOT ACTIVADO                          ',
    'Intelligence agencies do not label files "SMOKING GUN."':
      'Las agencias de inteligencia no etiquetan archivos como "PRUEBA DEFINITIVA."',
    'This file exists solely to catch intruders who lack':
      'Este archivo existe solamente para atrapar intrusos que carecen',
    'the discretion to recognize obvious bait.': 'del discernimiento para reconocer un cebo obvio.',
    'Your impatience has been noted.': 'Su impaciencia ha sido anotada.',
    '[LEGACY ENCRYPTION HEADER — RECOVERED COPY AVAILABLE]':
      '[ENCABEZADO DE ENCRIPTACIÓN LEGADO — COPIA RECUPERADA DISPONIBLE]',
    'Historical note: this file previously used a timed wrapper.':
      'Nota histórica: este archivo anteriormente usaba un envoltorio temporizado.',
    'Recovered text is now available directly on open.':
      'El texto recuperado ahora está disponible directamente al abrir.',
    'Use: open emergency_broadcast.enc': 'Usar: open emergency_broadcast.enc',
    'DATE: 20-JAN-1996 22:47 LOCAL': 'FECHA: 20-ENE-1996 22:47 LOCAL',
    'FREQUENCY: MILITARY BAND — ENCRYPTED': 'FRECUENCIA: BANDA MILITAR — ENCRIPTADA',
    'TOWER: "Flight 1-7, confirm visual on target area."':
      'TORRE: "Vuelo 1-7, confirme visual en el área objetivo."',
    'PILOT: "Negative visual. Heavy cloud cover at 3000 meters."':
      'PILOTO: "Visual negativo. Cobertura densa de nubes a 3000 metros."',
    'TOWER: "Proceed to coordinates 21.5519 S, 45.4331 W."':
      'TORRE: "Proceda a coordenadas 21.5519 S, 45.4331 O."',
    'PILOT: "Coordinates confirmed. ETA 8 minutes."':
      'PILOTO: "Coordenadas confirmadas. Llegada estimada en 8 minutos."',
    '[STATIC - 14 SECONDS]': '[ESTÁTICA - 14 SEGUNDOS]',
    'PILOT: "Tower, I have... I have something on radar."':
      'PILOTO: "Torre, tengo... tengo algo en el radar."',
    'TOWER: "Confirm contact, Flight 1-7."': 'TORRE: "Confirme contacto, Vuelo 1-7."',
    'PILOT: "Contact confirmed. It\'s... it\'s not moving."':
      'PILOTO: "Contacto confirmado. No... no se mueve."',
    'TOWER: "Weapons systems remain inactive. Observe only."':
      'TORRE: "Sistemas de armas permanecen inactivos. Solo observar."',
    'PILOT: "Understood. Beginning visual approach."':
      'PILOTO: "Entendido. Iniciando aproximación visual."',
    '[STATIC - 8 SECONDS]': '[ESTÁTICA - 8 SEGUNDOS]',
    'PILOT: "Deus me livre... Tower, I don\'t know what I\'m looking at."':
      'PILOTO: "Dios me libre... Torre, no sé qué estoy viendo."',
    'TOWER: "Flight 1-7, maintain radio silence from this point."':
      'TORRE: "Vuelo 1-7, mantenga silencio de radio desde este punto."',
    'PILOT: "But Tower—"': 'PILOTO: "Pero Torre—"',
    'TOWER: "This conversation never happened. RTB immediately."':
      'TORRE: "Esta conversación nunca ocurrió. RTB inmediatamente."',
    'CLASSIFICATION: ABOVE TOP SECRET': 'CLASIFICACIÓN: POR ENCIMA DE ULTRA SECRETO',
    'DISSEMINATION: NEED-TO-KNOW ONLY': 'DISEMINACIÓN: SOLO PARA QUIEN NECESITE SABER',
    'ARCHIVED NEWS CLIPPINGS — FEBRUARY 1996': 'RECORTES DE NOTICIAS ARCHIVADOS — FEBRERO 1996',
    '"MILITARY DENIES VARGINHA RUMORS"': '"MILITARES NIEGAN RUMORES DE VARGINHA"',
    '  The Brazilian Air Force today denied reports of':
      '  La Fuerza Aérea Brasileña negó hoy los informes de',
    '  unusual activity near Varginha, Minas Gerais.':
      '  actividad inusual cerca de Varginha, Minas Gerais.',
    '  "There was no incident," stated a military spokesman.':
      '  "No hubo ningún incidente," declaró un portavoz militar.',
    '  "These are fabrications from overactive imaginations."':
      '  "Estas son fabricaciones de imaginaciones hiperactivas."',
    '"ANONYMOUS DOCUMENTS SURFACE ONLINE"': '"DOCUMENTOS ANÓNIMOS APARECEN EN LÍNEA"',
    '  Unverified documents claiming to detail a UFO':
      '  Documentos no verificados que supuestamente detallan una operación',
    '  recovery operation have appeared on several':
      '  de recuperación de OVNI han aparecido en varios',
    '  international bulletin board systems.': '  sistemas de tablón de anuncios internacionales.',
    '  Government sources dismiss them as "obvious fakes."':
      '  Fuentes gubernamentales los descartan como "falsificaciones obvias."',
    '"WITNESS RECANTS STATEMENT"': '"TESTIGO RETRACTA DECLARACIÓN"',
    '  a local woman, who claimed to see a "strange creature"':
      '  una mujer local, que afirmó ver una "criatura extraña"',
    '  in Jardim Andere, has withdrawn her testimony.':
      '  en Jardim Andere, ha retirado su testimonio.',
    '  "I was mistaken," she said. "It was just shadows."':
      '  "Estaba equivocada," dijo. "Solo eran sombras."',
    '  [EDITOR NOTE: Silva was visited by unidentified men':
      '  [NOTA DEL EDITOR: Silva fue visitada por hombres no identificados',
    '   in suits two days before this retraction.]':
      '   de traje dos días antes de esta retractación.]',
    'CLASSIFIED INTERNAL MEMORANDUM': 'MEMORANDO INTERNO CLASIFICADO',
    'DATE: 10-MAR-1996': 'FECHA: 10-MAR-1996',
    'RE: Information Containment Assessment': 'REF: Evaluación de Contención de Información',
    '  Classified documents pertaining to January 1996':
      '  Documentos clasificados relacionados con las operaciones de',
    '  operations have been exfiltrated via compromised':
      '  enero de 1996 han sido exfiltrados a través del sistema de',
    '  legacy terminal system.': '  terminal legado comprometido.',
    'DAMAGE ASSESSMENT:': 'EVALUACIÓN DE DAÑOS:',
    '  - Documents now circulating on international networks':
      '  - Documentos ahora circulando en redes internacionales',
    '  - Authenticity being questioned (as planned)':
      '  - Autenticidad siendo cuestionada (según lo planeado)',
    '  - No mainstream media pickup (yet)': '  - Sin repercusión en medios convencionales (aún)',
    'CONTAINMENT MEASURES:': 'MEDIDAS DE CONTENCIÓN:',
    '  1. Flood networks with obvious fakes to dilute signal':
      '  1. Inundar redes con falsificaciones obvias para diluir la señal',
    '  2. Pressure witnesses to recant': '  2. Presionar a testigos para que se retracten',
    '  3. Redirect narrative to "foreign drone" hypothesis':
      '  3. Redirigir narrativa a hipótesis de "dron extranjero"',
    '  4. Monitor UFO community for serious investigators':
      '  4. Monitorear comunidad OVNI en busca de investigadores serios',
    'LONG-TERM STRATEGY:': 'ESTRATEGIA A LARGO PLAZO:',
    '  The 2026 window approaches. Full disclosure may be':
      '  La ventana de 2026 se acerca. La divulgación completa puede ser',
    '  unavoidable. Recommend gradual acclimation program.':
      '  inevitable. Se recomienda programa de aclimatación gradual.',
    'NOTE: The individual known as "UFO74" remains at large.':
      'NOTA: El individuo conocido como "UFO74" sigue prófugo.',
    '      Termination not recommended due to martyr risk.':
      '      Eliminación no recomendada debido al riesgo de martirio.',
    'SIGNAL INTERCEPT — UNVERIFIED': 'INTERCEPTACIÓN DE SEÑAL — NO VERIFICADA',
    'TIMESTAMP: 15-MAR-1996 03:47:22 UTC': 'MARCA TEMPORAL: 15-MAR-1996 03:47:22 UTC',
    '[FRAGMENTARY TRANSMISSION - RECONSTRUCTED]': '[TRANSMISIÓN FRAGMENTARIA - RECONSTRUIDA]',
    '...made it across the border...': '...logré cruzar la frontera...',
    '...they came to the apartment but...': '...vinieron al apartamento pero...',
    '...different identity now...': '...identidad diferente ahora...',
    '...the hackerkid did it...': '...el hackerkid lo logró...',
    '...files are everywhere now...': '...los archivos están en todas partes ahora...',
    '...cant put the toothpaste back...': '...no se puede meter la pasta de vuelta al tubo...',
    '...they think im dead...': '...creen que estoy muerto...',
    '...let them think that...': '...que crean eso...',
    '...2026. ill be watching...': '...2026. estaré observando...',
    '...we all will...': '...todos lo estaremos...',
    '[SIGNAL LOST]': '[SEÑAL PERDIDA]',
    'ANALYSIS: Origin untraceable. Possibly fabricated.':
      'ANÁLISIS: Origen irrastreable. Posiblemente fabricado.',
    '          Subject status: UNKNOWN': '          Estado del sujeto: DESCONOCIDO',
    'PROJECTION UPDATE — 2026 TRANSITION WINDOW':
      'ACTUALIZACIÓN DE PROYECCIÓN — VENTANA DE TRANSICIÓN 2026',
    'CLASSIFICATION: BEYOND TOP SECRET': 'CLASIFICACIÓN: MÁS ALLÁ DE ULTRA SECRETO',
    'DATE: [REDACTED]': 'FECHA: [SUPRIMIDO]',
    'REVISED ASSESSMENT:': 'EVALUACIÓN REVISADA:',
    '  The information breach of January 1996 has altered':
      '  La violación de información de enero de 1996 ha alterado',
    '  projected outcomes for the 2026 transition window.':
      '  los resultados proyectados para la ventana de transición de 2026.',
    'PREVIOUS MODEL:': 'MODELO ANTERIOR:',
    '  - Transition occurs with zero public awareness':
      '  - Transición ocurre con cero conciencia pública',
    '  - Population response: Panic, collapse': '  - Respuesta de la población: Pánico, colapso',
    '  - Estimated casualties: [REDACTED]': '  - Bajas estimadas: [SUPRIMIDO]',
    'REVISED MODEL (POST-BREACH):': 'MODELO REVISADO (POST-VIOLACIÓN):',
    '  - Partial public awareness exists': '  - Existe conciencia pública parcial',
    '  - Underground networks prepared': '  - Redes clandestinas preparadas',
    '  - Potential for coordinated response': '  - Potencial para respuesta coordinada',
    '  - Estimated casualties: REDUCED': '  - Bajas estimadas: REDUCIDAS',
    'CONCLUSION:': 'CONCLUSIÓN:',
    '  The breach, while operationally damaging, may have':
      '  La violación, aunque operativamente dañina, puede haber',
    '  inadvertently improved transition survival rates.':
      '  mejorado inadvertidamente las tasas de supervivencia en la transición.',
    "  The intruder's actions, though criminal, may have":
      '  Las acciones del intruso, aunque criminales, pueden haber',
    '  saved lives.': '  salvado vidas.',
    '  This assessment is classified and will be denied.':
      '  Esta evaluación es clasificada y será negada.',
    'INCIDENT REPORT — EXPERIMENTAL AIRCRAFT DIVISION':
      'INFORME DE INCIDENTE — DIVISIÓN DE AERONAVES EXPERIMENTALES',
    'DATE: 21-JAN-1996': 'FECHA: 21-ENE-1996',
    'CLASSIFICATION: CONFIDENTIAL': 'CLASIFICACIÓN: CONFIDENCIAL',
    'INCIDENT TYPE: Unauthorized civilian overflight':
      'TIPO DE INCIDENTE: Sobrevuelo civil no autorizado',
    '  A single-engine Cessna 172 entered restricted airspace':
      '  Un Cessna 172 monomotor ingresó al espacio aéreo restringido',
    '  over Base Area 7 at approximately 14:20h on 20-JAN-1996.':
      '  sobre el Área de Base 7 aproximadamente a las 14:20h del 20-ENE-1996.',
    '  Pilot identified as agricultural contractor.':
      '  Piloto identificado como contratista agrícola.',
    '  Filed incorrect flight plan (VFR instead of IFR).':
      '  Plan de vuelo incorrecto registrado (VFR en lugar de IFR).',
    '  No photographic equipment found on board.':
      '  Ningún equipo fotográfico encontrado a bordo.',
    'PRELIMINARY CONCLUSION:': 'CONCLUSIÓN PRELIMINAR:',
    '  Navigational error. Pilot issued formal warning.':
      '  Error de navegación. Se emitió advertencia formal al piloto.',
    '  No security breach. Airspace monitoring resumed.':
      '  Sin violación de seguridad. Monitoreo del espacio aéreo reanudado.',
    'NOTE: Recommend updated NOTAM for restricted zone':
      'NOTA: Se recomienda NOTAM actualizado para zona restringida',
    '      perimeter. Current radius may be insufficient.':
      '      perímetro. El radio actual puede ser insuficiente.',
    'ASSESSMENT — FOREIGN DRONE HYPOTHESIS': 'EVALUACIÓN — HIPÓTESIS DE DRON EXTRANJERO',
    'ANALYST: [CLASSIFIED — junior lieutenant, technical analysis]':
      'ANALISTA: [CLASIFICADO — teniente subalterno, análisis técnico]',
    'HYPOTHESIS:': 'HIPÓTESIS:',
    '  Recovered material represents foreign reconnaissance drone':
      '  El material recuperado representa un dron de reconocimiento extranjero',
    '  of undisclosed origin (likely US or European).':
      '  de origen no revelado (probablemente EE.UU. o europeo).',
    'SUPPORTING EVIDENCE:': 'EVIDENCIA DE APOYO:',
    '  - Advanced materials consistent with aerospace industry':
      '  - Materiales avanzados consistentes con la industria aeroespacial',
    '  - Size appropriate for unmanned platform':
      '  - Tamaño apropiado para plataforma no tripulada',
    '  - Recovery site near strategic infrastructure':
      '  - Sitio de recuperación cerca de infraestructura estratégica',
    'CONTRADICTING EVIDENCE:': 'EVIDENCIA CONTRADICTORIA:',
    '  - No propulsion system identified': '  - Ningún sistema de propulsión identificado',
    '  - No known drone uses materials of this composition':
      '  - Ningún dron conocido utiliza materiales de esta composición',
    '  - Mass variability unexplained by any known technology':
      '  - Variabilidad de masa inexplicable por cualquier tecnología conocida',
    '  - Thermal signature inconsistent with any engine type':
      '  - Firma térmica inconsistente con cualquier tipo de motor',
    '  Hypothesis CANNOT be sustained.': '  Hipótesis NO PUEDE ser sostenida.',
    '  Material properties inconsistent with ANY known aircraft.':
      '  Propiedades del material inconsistentes con CUALQUIER aeronave conocida.',
    'INTERNAL MEMORANDUM — PUBLIC AFFAIRS': 'MEMORANDO INTERNO — ASUNTOS PÚBLICOS',
    'DATE: 22-JAN-1996': 'FECHA: 22-ENE-1996',
    'RE: Media Inquiry Response': 'REF: Respuesta a Consulta de Medios',
    'APPROVED STATEMENT FOR PRESS:': 'DECLARACIÓN APROBADA PARA LA PRENSA:',
    '  "The object recovered near Varginha on January 20':
      '  "El objeto recuperado cerca de Varginha el 20 de enero',
    '   has been identified as a weather balloon from the':
      '   ha sido identificado como un globo meteorológico del',
    '   National Meteorological Institute. The unusual':
      '   Instituto Nacional de Meteorología. Los avistamientos',
    '   sightings were caused by reflected light from':
      '   inusuales fueron causados por la luz reflejada del',
    '   the balloon\'s instrumentation package."': '   paquete de instrumentación del globo."',
    '  This statement is for public consumption only.':
      '  Esta declaración es solo para consumo público.',
    '  Actual findings classified.': '  Hallazgos reales clasificados.',
    '  See PROJECT HARVEST files for details.':
      '  Ver archivos del PROYECTO COSECHA para detalles.',
    'ALTERNATIVE ASSESSMENT — INDUSTRIAL ORIGIN': 'EVALUACIÓN ALTERNATIVA — ORIGEN INDUSTRIAL',
    'ANALYST: SGT. PAULA REIS': 'ANALISTA: SGT. PAULA REIS',
    '  Recovered materials originated from nearby':
      '  Los materiales recuperados se originaron de una instalación',
    '  industrial facility (chemical or metallurgical).':
      '  industrial cercana (química o metalúrgica).',
    'INVESTIGATION:': 'INVESTIGACIÓN:',
    '  Contacted 12 facilities within 50km radius.':
      '  Se contactaron 12 instalaciones dentro de un radio de 50km.',
    '  No reported accidents or material losses.':
      '  Ningún accidente reportado ni pérdida de material.',
    '  No facility uses materials matching samples.':
      '  Ninguna instalación utiliza materiales que coincidan con las muestras.',
    'MATERIAL COMPARISON:': 'COMPARACIÓN DE MATERIAL:',
    '  - Local steel plant: No match': '  - Planta siderúrgica local: Sin coincidencia',
    '  - Chemical processing: No match': '  - Procesamiento químico: Sin coincidencia',
    '  - Automotive parts: No match': '  - Piezas automotrices: Sin coincidencia',
    '  - Aerospace subcontractor (Embraer): NO MATCH':
      '  - Subcontratista aeroespacial (Embraer): SIN COINCIDENCIA',
    '  Industrial origin RULED OUT.': '  Origen industrial DESCARTADO.',
    '  Materials have no identifiable manufacturing signature.':
      '  Los materiales no tienen firma de fabricación identificable.',
    '  Discontinue this line of investigation.': '  Descontinuar esta línea de investigación.',
    '  Defer to standard explanation for public statement.':
      '  Deferir a la explicación estándar para declaración pública.',
    'LOGISTICS MANIFEST — PARTIAL RECOVERY': 'MANIFIESTO LOGÍSTICO — RECUPERACIÓN PARCIAL',
    'STATUS: FRAGMENT — SECTOR DAMAGE': 'ESTADO: FRAGMENTO — DAÑO SECTORIAL',
    'OUTBOUND SHIPMENTS:': 'ENVÍOS DE SALIDA:',
    '  [CORRUPTED] ... Container C-7 ... [CORRUPTED]':
      '  [CORRUPTO] ... Contenedor C-7 ... [CORRUPTO]',
    '  Destination: CÓDIGO ECHO': '  Destino: CÓDIGO ECHO',
    '  Weight: 45kg': '  Peso: 45kg',
    '  Handler: Protocol 7-ECHO authorized': '  Responsable: Protocolo 7-ECHO autorizado',
    '  [CORRUPTED] ... Container C-12 ... [CORRUPTED]':
      '  [CORRUPTO] ... Contenedor C-12 ... [CORRUPTO]',
    '  Destination: UNKNOWN (diplomatic channel)': '  Destino: DESCONOCIDO (canal diplomático)',
    '  Weight: 112kg': '  Peso: 112kg',
    '  Handler: [DATA LOSS]': '  Responsable: [PÉRDIDA DE DATOS]',
    'NOTE: Cross-reference with transport_log_96 for context.':
      'NOTA: Referencia cruzada con transport_log_96 para contexto.',
    'SIGNAL ANALYSIS — PRELIMINARY': 'ANÁLISIS DE SEÑAL — PRELIMINAR',
    'EQUIPMENT: Modified EEG Array': 'EQUIPO: Arreglo de EEG Modificado',
    'DATE: 20-JAN-1996 (during containment)': 'FECHA: 20-ENE-1996 (durante contención)',
    'READINGS FROM SUBJECT BETA (pre-expiration):': 'LECTURAS DEL SUJETO BETA (pre-expiración):',
    '  04:30 — Background noise only': '  04:30 — Solo ruido de fondo',
    '  04:45 — Unusual pattern detected (see attached)':
      '  04:45 — Patrón inusual detectado (ver adjunto)',
    '  05:00 — Pattern intensifies. Equipment overload.':
      '  05:00 — Patrón se intensifica. Sobrecarga de equipo.',
    '  05:15 — Subject vitals declining. Pattern peaks.':
      '  05:15 — Signos vitales del sujeto en declive. Patrón alcanza pico.',
    '  05:18 — Transmission burst detected. Duration: 0.3s':
      '  05:18 — Ráfaga de transmisión detectada. Duración: 0,3s',
    '  05:20 — Subject expires. Pattern ceases.': '  05:20 — Sujeto expira. Patrón cesa.',
    'INTERPRETATION:': 'INTERPRETACIÓN:',
    '  Unknown. Equipment not designed for this signal type.':
      '  Desconocida. Equipo no diseñado para este tipo de señal.',
    '  Recommend consultation with transcript_core.enc':
      '  Se recomienda consulta con transcript_core.enc',
    '  for reconstructed content analysis.': '  para análisis de contenido reconstruido.',
    'LIAISON NOTE — FOREIGN COORDINATION': 'NOTA DE ENLACE — COORDINACIÓN EXTRANJERA',
    'FROM: Embassy Contact (unsigned)': 'DE: Contacto de Embajada (sin firma)',
    'DATE: 23-JAN-1996': 'FECHA: 23-ENE-1996',
    'Package received via diplomatic pouch.': 'Paquete recibido vía valija diplomática.',
    'Contents confirmed:': 'Contenido confirmado:',
    '  - Biological samples (2 containers)': '  - Muestras biológicas (2 contenedores)',
    '  - Material samples (1 container)': '  - Muestras de material (1 contenedor)',
    '  - Documentation (sealed)': '  - Documentación (sellada)',
    'Our team is already en route.': 'Nuestro equipo ya está en camino.',
    'As agreed, no records of this exchange will exist':
      'Según lo acordado, no existirán registros de este intercambio',
    'in either system. Protocol 7-ECHO acknowledged.':
      'en ninguno de los sistemas. Protocolo 7-ECHO reconocido.',
    'We will contact you when preliminary analysis complete.':
      'Nos comunicaremos cuando el análisis preliminar esté completo.',
    'NOTE: Your material_x_analysis.dat was... illuminating.':
      'NOTA: Su material_x_analysis.dat fue... esclarecedor.',
    '      We concur with the conclusion.': '      Coincidimos con la conclusión.',
    'ENCRYPTED CABLE — PRIORITY ALPHA': 'CABLE ENCRIPTADO — PRIORIDAD ALFA',
    'ORIGIN: LANGLEY': 'ORIGEN: LANGLEY',
    'DESTINATION: BRASÍLIA STATION': 'DESTINO: ESTACIÓN BRASILIA',
    'DATE: 23-JAN-1996 04:12 UTC': 'FECHA: 23-ENE-1996 04:12 UTC',
    '[ENCRYPTED CONTENT - REQUIRES CLEARANCE]': '[CONTENIDO ENCRIPTADO - REQUIERE AUTORIZACIÓN]',
    'Cross-reference: /comms/liaison/foreign_liaison_note.txt':
      'Referencia cruzada: /comms/liaison/foreign_liaison_note.txt',
    'DECRYPTED CABLE — PRIORITY ALPHA': 'CABLE DESENCRIPTADO — PRIORIDAD ALFA',
    'FLASH TRAFFIC': 'TRÁFICO URGENTE',
    'SITUATION UPDATE:': 'ACTUALIZACIÓN DE SITUACIÓN:',
    '  Recovery teams report multiple specimens secured.':
      '  Equipos de recuperación reportan múltiples especímenes asegurados.',
    '  Division as agreed: Primary to you, Secondary to us.':
      '  División según lo acordado: Primario para ustedes, Secundario para nosotros.',
    '  Tertiary inbound to Tel Aviv per standing agreement.':
      '  Terciario en camino a Tel Aviv según acuerdo vigente.',
    '  Protocol 7-ECHO remains in effect.': '  Protocolo 7-ECHO permanece en efecto.',
    '  No domestic agencies read-in.': '  Ninguna agencia doméstica informada.',
    '  Cover story: industrial accident, toxic waste.':
      '  Historia de cobertura: accidente industrial, residuos tóxicos.',
    'CRITICAL:': 'CRÍTICO:',
    '  Specimen 3 showed residual cognitive activity.':
      '  El espécimen 3 mostró actividad cognitiva residual.',
    '  Recommend immediate neural extraction before decay.':
      '  Se recomienda extracción neural inmediata antes de la descomposición.',
    '  Our team brings equipment. ETA 6 hours.':
      '  Nuestro equipo trae equipamiento. Llegada estimada: 6 horas.',
    'ACKNOWLEDGE.': 'ACUSE RECIBO.',
    '>> CONFIRMS MULTI-NATION COORDINATION <<': '>> CONFIRMA COORDINACIÓN MULTINACIONAL <<',
    'What protocol governs this exchange? (Check the foreign liaison note)':
      '¿Qué protocolo rige este intercambio? (Verifique la nota de enlace extranjero)',
    'The liaison note mentions the protocol name.':
      'La nota de enlace menciona el nombre del protocolo.',
    'STANDING ORDERS — MULTINATIONAL RECOVERY PROTOCOL':
      'ÓRDENES PERMANENTES — PROTOCOLO MULTINACIONAL DE RECUPERACIÓN',
    'CLASSIFICATION: COSMIC - NEED TO KNOW':
      'CLASIFICACIÓN: CÓSMICO - SOLO PARA QUIEN NECESITE SABER',
    'EFFECTIVE: 01-JAN-1989 (UPDATED ANNUALLY)': 'VIGENCIA: 01-ENE-1989 (ACTUALIZADO ANUALMENTE)',
    'PARTICIPATING NATIONS:': 'NACIONES PARTICIPANTES:',
    '  - United States (Coordinating Authority)': '  - Estados Unidos (Autoridad Coordinadora)',
    '  - United Kingdom': '  - Reino Unido',
    '  - France': '  - Francia',
    '  - Israel': '  - Israel',
    '  - Brazil (Regional Authority, South America)': '  - Brasil (Autoridad Regional, Sudamérica)',
    '  - Russia (Observer Status, post-1991)': '  - Rusia (Estado de Observador, post-1991)',
    'TRIGGER CRITERIA:': 'CRITERIOS DE ACTIVACIÓN:',
    '  Any incident matching Profile DELTA:':
      '  Cualquier incidente que coincida con el Perfil DELTA:',
    '  - Non-conventional aerial phenomena': '  - Fenómenos aéreos no convencionales',
    '  - Biological specimens of unknown origin':
      '  - Especímenes biológicos de origen desconocido',
    '  - Material with anomalous physical properties':
      '  - Material con propiedades físicas anómalas',
    'RESPONSE PROTOCOL:': 'PROTOCOLO DE RESPUESTA:',
    '  1. Regional Authority establishes perimeter':
      '  1. La Autoridad Regional establece perímetro',
    '  2. Coordinating Authority notified within 2 hours':
      '  2. Autoridad Coordinadora notificada dentro de 2 horas',
    '  3. Multinational team deployed within 24 hours':
      '  3. Equipo multinacional desplegado dentro de 24 horas',
    '  4. Material divided per Appendix C allocation':
      '  4. Material dividido según asignación del Apéndice C',
    'INFORMATION CONTROL:': 'CONTROL DE INFORMACIÓN:',
    '  All nations maintain synchronized cover narratives.':
      '  Todas las naciones mantienen narrativas de cobertura sincronizadas.',
    '  Annual coordination meeting: Davos, Switzerland.':
      '  Reunión anual de coordinación: Davos, Suiza.',
    'ADDENDUM (1995):': 'ADENDA (1995):',
    '  Coordination extended to include shared timeline.':
      '  Coordinación extendida para incluir cronograma compartido.',
    '  All parties agree: public disclosure deferred until':
      '  Todas las partes acuerdan: divulgación pública diferida hasta',
    '  after WINDOW closes. Target: post-2026 review.':
      '  después del cierre de la VENTANA. Meta: revisión post-2026.',
    '  Cross-reference: /admin/threat_window.red': '  Referencia cruzada: /admin/threat_window.red',
    'QUERY — REGIONAL MEDICAL EXAMINER': 'CONSULTA — MÉDICO FORENSE REGIONAL',
    'RE: Unusual Autopsy Protocol': 'REF: Protocolo de Autopsia Inusual',
    'To whom it may concern,': 'A quien pueda interesar,',
    'I am writing to inquire about the autopsy conducted':
      'Escribo para indagar sobre la autopsia realizada',
    'at our facility on 21-JAN-1996. I understand':
      'en nuestra instalación el 21-ENE-1996. Entiendo que',
    'A forensic pathologist was summoned from a state university,':
      'Un patólogo forense fue convocado de una universidad estatal,',
    'but his notes were sealed before I could review them.':
      'pero sus notas fueron selladas antes de que pudiera revisarlas.',
    'The subject was removed before I arrived.': 'El sujeto fue retirado antes de mi llegada.',
    'No standard intake forms were filed.': 'No se completaron formularios de admisión estándar.',
    'No cause of death was recorded.': 'No se registró causa de muerte.',
    'The attending physician refuses to discuss.': 'El médico a cargo se niega a discutirlo.',
    'Our cold storage showed unusual temperature readings':
      'Nuestro almacenamiento frío mostró lecturas de temperatura inusuales',
    'for several hours afterward.': 'durante varias horas después.',
    'I am required to maintain complete records.': 'Estoy obligado a mantener registros completos.',
    'Please advise how to proceed with documentation.':
      'Por favor, indiquen cómo proceder con la documentación.',
    'THE REGIONAL MEDICAL EXAMINER': 'EL MÉDICO FORENSE REGIONAL',
    'Regional Medical Examiner': 'Médico Forense Regional',
    '[RESPONSE ATTACHED: "File classified. Destroy query."]':
      '[RESPUESTA ADJUNTA: "Archivo clasificado. Destruir consulta."]',
    'SYSTEM LOG — PATTERN RECOGNITION': 'LOG DEL SISTEMA — RECONOCIMIENTO DE PATRONES',
    'TIMESTAMP: [CURRENT SESSION]': 'MARCA TEMPORAL: [SESIÓN ACTUAL]',
    'Broad file sweep detected.': 'Barrido amplio de archivos detectado.',
    'User has touched multiple sectors of the system.':
      'El usuario ha accedido a múltiples sectores del sistema.',
    'Pattern: Persistent review of scattered records.':
      'Patrón: Revisión persistente de registros dispersos.',
    'NOTE: Additional archives may be available.':
      'NOTA: Archivos adicionales pueden estar disponibles.',
    '      Check /admin directory if access permits.':
      '      Verifique el directorio /admin si el acceso lo permite.',
    'SYSTEM ALERT — COHERENCE THRESHOLD': 'ALERTA DEL SISTEMA — UMBRAL DE COHERENCIA',
    'PRIORITY: ELEVATED': 'PRIORIDAD: ELEVADA',
    'User has logged substantial evidence.': 'El usuario ha registrado evidencia sustancial.',
    'Evidence tracker approaching completion.':
      'Rastreador de evidencia acercándose a la conclusión.',
    'Leak risk rising.': 'Riesgo de filtración en aumento.',
    'System recommendation:': 'Recomendación del sistema:',
    '  Preserve session artifacts.': '  Preservar artefactos de la sesión.',
    '  Expect emergency export attempts.': '  Esperar intentos de exportación de emergencia.',
    'NOTE: Final evidence may require administrative access.':
      'NOTA: La evidencia final puede requerir acceso administrativo.',
    'HISTORICAL REFERENCE — OPERATION PRATO': 'REFERENCIA HISTÓRICA — OPERACIÓN PRATO',
    'PERIOD: 1977-1978': 'PERÍODO: 1977-1978',
    'LOCATION: Colares, Pará, Brazil': 'UBICACIÓN: Colares, Pará, Brasil',
    '  Brazilian Air Force investigation of unidentified':
      '  Investigación de la Fuerza Aérea Brasileña sobre fenómenos',
    '  aerial phenomena in northern Brazil.': '  aéreos no identificados en el norte de Brasil.',
    '  - Multiple credible sightings documented':
      '  - Múltiples avistamientos creíbles documentados',
    '  - Physical effects on witnesses (burn marks)':
      '  - Efectos físicos en testigos (marcas de quemadura)',
    '  - Phenomenon described as "light beams"': '  - Fenómeno descrito como "haces de luz"',
    '  - Objects displayed non-ballistic motion': '  - Objetos exhibieron movimiento no balístico',
    'OFFICIAL CONCLUSION:': 'CONCLUSIÓN OFICIAL:',
    '  Inconclusive. Files sealed.': '  Inconcluso. Archivos sellados.',
    'RELEVANCE TO 1996 INCIDENT:': 'RELEVANCIA PARA EL INCIDENTE DE 1996:',
    '  Current operation named "PRATO EXTENSION"':
      '  Operación actual denominada "EXTENSIÓN PRATO"',
    '  suggests institutional awareness of connection.':
      '  sugiere conocimiento institucional de conexión.',
    'NOTE: Original PRATO files held by Air Force archives.':
      'NOTA: Archivos originales de PRATO en poder de archivos de la Fuerza Aérea.',
    '      Supplemental archive unlocked under override protocol.':
      '      Archivo suplementario desbloqueado bajo protocolo de override.',
    '      See /ops/prato/archive when cleared.':
      '      Ver /ops/prato/archive cuando esté autorizado.',
    'INCIDENT LOG — OPERATION PRATO (COLARES)':
      'REGISTRO DE INCIDENTES — OPERACIÓN PRATO (COLARES)',
    'DATE RANGE: SEP-OCT 1977': 'PERÍODO: SEP-OCT 1977',
    '18-SEP 22:14 — Luminous object above river channel.':
      '18-SEP 22:14 — Objeto luminoso sobre canal del río.',
    '                Beam emitted for 4-6 seconds.':
      '                Haz emitido por 4-6 segundos.',
    '                Civilian reported heat and puncture mark.':
      '                Civil reportó calor y marca de punción.',
    '20-SEP 23:06 — Patrol observed light hovering ~30m.':
      '20-SEP 23:06 — Patrulla observó luz flotando a ~30m.',
    '                No sound. Rapid lateral acceleration.':
      '                Sin sonido. Aceleración lateral rápida.',
    '                Beam directed to ground, no visible target.':
      '                Haz dirigido al suelo, sin objetivo visible.',
    '24-SEP 21:47 — Multiple witnesses. Light split into two':
      '24-SEP 21:47 — Múltiples testigos. Luz se dividió en dos',
    '                points before rejoining and departing.':
      '                puntos antes de reunirse y partir.',
    '03-OCT 00:12 — Light tracked along shoreline for 3km.':
      '03-OCT 00:12 — Luz rastreada a lo largo de la costa por 3km.',
    '                Brightness increased; camera overexposed.':
      '                Brillo aumentó; cámara sobreexpuesta.',
    'STATUS: Unresolved. Pattern persistent.': 'ESTADO: No resuelto. Patrón persistente.',
    'NOTE: Incidents cluster near waterfront communities.':
      'NOTA: Los incidentes se concentran cerca de comunidades costeras.',
    'PATROL OBSERVATION REPORT — SHIFT 04': 'INFORME DE OBSERVACIÓN DE PATRULLA — TURNO 04',
    'UNIT: 1st AIR FORCE DETACHMENT': 'UNIDAD: 1er DESTACAMENTO DE LA FUERZA AÉREA',
    'DATE: 05-OCT-1977': 'FECHA: 05-OCT-1977',
    '  00:31 — White orb at 25-30m altitude.': '  00:31 — Orbe blanco a 25-30m de altitud.',
    '  00:32 — Orb emits narrow beam downward.': '  00:32 — Orbe emite haz estrecho hacia abajo.',
    '  00:33 — Beam sweeps left to right (approx. 40° arc).':
      '  00:33 — Haz barre de izquierda a derecha (arco de aprox. 40°).',
    '  00:34 — Orb rises rapidly. Acceleration inconsistent':
      '  00:34 — Orbe asciende rápidamente. Aceleración inconsistente',
    '          with known aircraft.': '          con aeronaves conocidas.',
    'SENSOR NOTES:': 'NOTAS DE SENSORES:',
    '  - No engine noise or rotor wash.': '  - Sin ruido de motor ni turbulencia de rotor.',
    '  - Compass fluctuation during beam emission.':
      '  - Fluctuación de la brújula durante emisión del haz.',
    '  - Thermal scope shows localized ground heating.':
      '  - Visor térmico muestra calentamiento localizado del suelo.',
    'PHOTOGRAPHIC RECORD:': 'REGISTRO FOTOGRÁFICO:',
    '  3 frames captured; 2 overexposed; 1 partial silhouette.':
      '  3 cuadros capturados; 2 sobreexpuestos; 1 silueta parcial.',
    '  Continue night patrols. Maintain distance.':
      '  Continuar patrullas nocturnas. Mantener distancia.',
    'MEDICAL EFFECTS BRIEF — COLARES CLINIC': 'RESUMEN DE EFECTOS MÉDICOS — CLÍNICA DE COLARES',
    'DATE: 14-OCT-1977': 'FECHA: 14-OCT-1977',
    'OBSERVED SYMPTOMS (12 CASES):': 'SÍNTOMAS OBSERVADOS (12 CASOS):',
    '  - Superficial burns (2-5cm diameter)': '  - Quemaduras superficiales (2-5cm de diámetro)',
    '  - Localized puncture marks (sub-dermal)': '  - Marcas de punción localizadas (subdérmicas)',
    '  - Acute fatigue, dizziness, photophobia': '  - Fatiga aguda, mareos, fotofobia',
    '  - Mild anemia in follow-up labs': '  - Anemia leve en laboratorios de seguimiento',
    '  Symptoms appear within 12 hours of exposure.':
      '  Los síntomas aparecen dentro de las 12 horas de exposición.',
    '  No infection markers detected.': '  Ningún marcador de infección detectado.',
    '  Recovery within 3-5 days with hydration and rest.':
      '  Recuperación en 3-5 días con hidratación y reposo.',
    '  Maintain private treatment records.': '  Mantener registros de tratamiento privados.',
    '  Report new cases to field command only.':
      '  Reportar nuevos casos solo al comando de campo.',
    'PHOTO ARCHIVE REGISTER — OPERATION PRATO': 'REGISTRO DE ARCHIVO FOTOGRÁFICO — OPERACIÓN PRATO',
    'ARCHIVE SITE: AIR FORCE COMMAND / BELÉM':
      'SITIO DEL ARCHIVO: COMANDO DE LA FUERZA AÉREA / BELÉM',
    'DATE: 22-OCT-1977': 'FECHA: 22-OCT-1977',
    'ROLL COUNT: 146': 'CONTEO DE ROLLOS: 146',
    '  - 34 rolls overexposed (light saturation)':
      '  - 34 rollos sobreexpuestos (saturación de luz)',
    '  - 21 rolls contain partial silhouettes': '  - 21 rollos contienen siluetas parciales',
    '  - 6 rolls show beam segments on ground':
      '  - 6 rollos muestran segmentos de haz en el suelo',
    'STORAGE:': 'ALMACENAMIENTO:',
    '  Sealed in climate-controlled vault.': '  Sellado en bóveda con control climático.',
    '  Access logged under Protocol 3-C.': '  Acceso registrado bajo Protocolo 3-C.',
    'NOTE:': 'NOTA:',
    '  Several frames show repeating grid-like arcs.':
      '  Varios cuadros muestran arcos repetitivos en forma de cuadrícula.',
    '  Analysts flagged for pattern review.': '  Analistas señalaron para revisión de patrón.',
    'RETROSPECTIVE ASSESSMENT — PRATO ANOMALY SET':
      'EVALUACIÓN RETROSPECTIVA — CONJUNTO DE ANOMALÍAS PRATO',
    'CLASSIFICATION: RED': 'CLASIFICACIÓN: ROJO',
    'DATE: 12-FEB-1996': 'FECHA: 12-FEB-1996',
    '  1977 incidents show consistent scan geometry:':
      '  Los incidentes de 1977 muestran geometría de escaneo consistente:',
    '  repeating altitude bands, lateral sweep arcs, and':
      '  bandas de altitud repetitivas, arcos de barrido lateral, y',
    '  short-duration beam contact without pursuit.':
      '  contacto de haz de corta duración sin persecución.',
    '  Behaviors align with survey operations, not attacks.':
      '  Los comportamientos se alinean con operaciones de reconocimiento, no ataques.',
    '  Patterns resemble grid sampling and terrain mapping.':
      '  Los patrones se asemejan a muestreo en cuadrícula y mapeo de terreno.',
    'INFERENCE:': 'INFERENCIA:',
    '  Luminous sources likely autonomous scan platforms.':
      '  Las fuentes luminosas son probablemente plataformas autónomas de escaneo.',
    '  Activity indicates Watcher reconnaissance cycles':
      '  La actividad indica ciclos de reconocimiento de los Observadores',
    '  predating the 1996 Varginha recovery.':
      '  anteriores a la recuperación de Varginha de 1996.',
    'IMPLICATION:': 'IMPLICACIÓN:',
    '  Current incident is a continuation, not a first contact.':
      '  El incidente actual es una continuación, no un primer contacto.',
    'CONFIDENCE: MODERATE': 'CONFIANZA: MODERADA',
    '  Data set incomplete; pattern consistency notable.':
      '  Conjunto de datos incompleto; consistencia de patrón notable.',
    'REFERENCE — PARALLEL INCIDENTS (INTERNATIONAL)':
      'REFERENCIA — INCIDENTES PARALELOS (INTERNACIONAL)',
    'COMPILED: FEBRUARY 1996': 'COMPILADO: FEBRERO 1996',
    'CLASSIFICATION: COMPARTMENTED': 'CLASIFICACIÓN: COMPARTIMENTADO',
    'Known incidents with similar characteristics:':
      'Incidentes conocidos con características similares:',
    '  1947 — United States (New Mexico)': '  1947 — Estados Unidos (Nuevo México)',
    '  1961 — United States (New Hampshire)': '  1961 — Estados Unidos (New Hampshire)',
    '  1967 — United Kingdom (Suffolk)': '  1967 — Reino Unido (Suffolk)',
    '  1980 — United Kingdom (Suffolk, repeat)': '  1980 — Reino Unido (Suffolk, repetición)',
    '  1989 — Belgium (multiple locations)': '  1989 — Bélgica (múltiples ubicaciones)',
    '  1996 — BRAZIL (current)': '  1996 — BRASIL (actual)',
    'COMMON ELEMENTS:': 'ELEMENTOS COMUNES:',
    '  - Material recovery': '  - Recuperación de material',
    '  - Biological component presence': '  - Presencia de componente biológico',
    '  - Multi-national coordination': '  - Coordinación multinacional',
    '  - Public denial protocol': '  - Protocolo de negación pública',
    '  Pattern suggests ongoing assessment program.':
      '  El patrón sugiere un programa de evaluación en curso.',
    '  Brazil now included in observation set.':
      '  Brasil ahora incluido en el conjunto de observación.',
    'ANALYSIS — THIRTY-YEAR CYCLE HYPOTHESIS': 'ANÁLISIS — HIPÓTESIS DEL CICLO DE TREINTA AÑOS',
    'THEORETICAL FRAMEWORK': 'MARCO TEÓRICO',
    'OBSERVATION:': 'OBSERVACIÓN:',
    '  Recovered psi-comm fragments reference "thirty rotations."':
      '  Los fragmentos de psi-comm recuperados referencian "treinta rotaciones."',
    '  This correlates with prior incident spacing:':
      '  Esto se correlaciona con el espaciamiento de incidentes anteriores:',
    '  1947 → 1977 = 30 years (Operation PRATO follows)':
      '  1947 → 1977 = 30 años (sigue la Operación PRATO)',
    '  1977 → 2007 = 30 years (predicted)': '  1977 → 2007 = 30 años (previsto)',
    '  1996 → 2026 = 30 years (referenced in transcripts)':
      '  1996 → 2026 = 30 años (referenciado en las transcripciones)',
    '  Assessment cycles occur at 30-year intervals.':
      '  Los ciclos de evaluación ocurren en intervalos de 30 años.',
    '  Each cycle refines observational model.': '  Cada ciclo refina el modelo observacional.',
    '  2026 may represent cycle completion.': '  2026 puede representar la conclusión del ciclo.',
    'ALTERNATIVE:': 'ALTERNATIVA:',
    '  "Rotations" may not refer to Earth years.':
      '  "Rotaciones" puede no referirse a años terrestres.',
    '  Calculations assume terrestrial frame of reference.':
      '  Los cálculos asumen marco de referencia terrestre.',
    'CONFIDENCE: LOW': 'CONFIANZA: BAJA',
    '  Insufficient data for confirmation.': '  Datos insuficientes para confirmación.',
    'PATIENT PERSONAL DOCUMENT — RECOVERED FROM ROOM 14B':
      'DOCUMENTO PERSONAL DEL PACIENTE — RECUPERADO DE LA HABITACIÓN 14B',
    'FACILITY: INSTITUTO RAUL SOARES, BELO HORIZONTE':
      'INSTALACIÓN: INSTITUTO RAUL SOARES, BELO HORIZONTE',
    'DATE RECOVERED: 03-MAR-1996': 'FECHA DE RECUPERACIÓN: 03-MAR-1996',
    'NOTE: Patient was admitted 28-FEB-1996. Document found':
      'NOTA: Paciente admitida el 28-FEB-1996. Documento encontrado',
    '      hidden beneath mattress during routine inspection.':
      '      escondido bajo el colchón durante inspección de rutina.',
    '      Submitted to file per protocol.': '      Enviado al archivo según protocolo.',
    'they took my notebooks but they did not find this one.':
      'se llevaron mis cuadernos pero no encontraron este.',
    'i know how i sound. i knew how i sounded when i told':
      'sé cómo sueno. sabía cómo sonaba cuando le dije',
    'my husband. i know why they brought me here. it does':
      'a mi esposo. sé por qué me trajeron aquí. eso',
    'not change what i know.': 'no cambia lo que sé.',
    'it is not an invasion. i need people to understand that.':
      'no es una invasión. necesito que la gente entienda eso.',
    'everyone is waiting for ships. for weapons. for something':
      'todos están esperando naves. armas. algo',
    'that looks like a war. it will not look like a war.':
      'que parezca una guerra. no se verá como una guerra.',
    'it already started. it started before any of us were born.':
      'ya empezó. empezó antes de que cualquiera de nosotros naciera.',
    'they do not want our planet. they want what we produce':
      'no quieren nuestro planeta. quieren lo que producimos',
    'without knowing we produce it. every thought. every dream.':
      'sin saber que lo producimos. cada pensamiento. cada sueño.',
    'every moment of fear or love or pain. we generate something':
      'cada momento de miedo o amor o dolor. generamos algo',
    'when we think and they have been collecting it for a very':
      'cuando pensamos y ellos lo han estado recolectando por un',
    'long time.': 'largo tiempo.',
    'i tried to calculate the yield. for one human mind over':
      'intenté calcular el rendimiento. para una mente humana a lo largo de',
    'one lifetime. then i multiplied it. i stopped when i':
      'una vida. luego lo multipliqué. me detuve cuando',
    'reached the number because the number made me sit on':
      'alcancé el número porque el número me hizo sentarme en',
    'the floor for a long time.': 'el suelo por un largo tiempo.',
    'seven billion units. that is what we are to them.':
      'siete mil millones de unidades. eso es lo que somos para ellos.',
    'units. generating. not knowing.': 'unidades. generando. sin saber.',
    'the doctors say i am not eating. they are right. i':
      'los doctores dicen que no estoy comiendo. tienen razón. yo',
    'find it difficult to eat. to sleep in a bed. to behave':
      'encuentro difícil comer. dormir en una cama. comportarme',
    'as if any of it matters when i know what i know.':
      'como si algo importara cuando sé lo que sé.',
    'my daughter visited yesterday. she held my hand.': 'mi hija visitó ayer. me tomó la mano.',
    'i looked at her face and all i could think was:':
      'miré su rostro y todo lo que pude pensar fue:',
    'she is producing right now. she has always been':
      'ella está produciendo ahora mismo. siempre ha estado',
    'producing. she will never know.': 'produciendo. nunca lo sabrá.',
    'i did not tell her. what would be the point.': 'no se lo dije. cuál sería el sentido.',
    'if you are reading this and you work here, please':
      'si estás leyendo esto y trabajas aquí, por favor',
    'understand i am not delusional. i am a physicist.':
      'entiende que no estoy delirando. soy física.',
    'i have spent my career measuring things.': 'he pasado mi carrera midiendo cosas.',
    'the possibility that we are the thing being measured':
      'la posibilidad de que nosotros seamos lo que está siendo medido',
    'is not something my training prepared me for.':
      'no es algo para lo que mi entrenamiento me preparó.',
    'god willing i am wrong.': 'Dios quiera que esté equivocada.',
    'i do not believe i am wrong.': 'no creo que esté equivocada.',
    'ATTENDING NOTE: Patient remains calm but non-responsive':
      'NOTA DEL MÉDICO A CARGO: Paciente permanece tranquila pero no responsiva',
    'to treatment. Refuses to discuss the content of her':
      'al tratamiento. Se niega a discutir el contenido de su',
    'research. Keeps asking if her daughter has been informed.':
      'investigación. Sigue preguntando si su hija ha sido informada.',
    'Recommendation: extend observation period.': 'Recomendación: extender período de observación.',
    'THEORETICAL FRAMEWORK — NON-ARRIVAL COLONIZATION': 'MARCO TEÓRICO — COLONIZACIÓN SIN LLEGADA',
    'CLASSIFICATION: COSMIC — DISTRIBUTION LIMITED':
      'CLASIFICACIÓN: CÓSMICO — DISTRIBUCIÓN LIMITADA',
    'AUTHOR: [CLASSIFIED — intelligence directorate]':
      'AUTOR: [CLASIFICADO — directorado de inteligencia]',
    'DATE: 05-MAR-1996': 'FECHA: 05-MAR-1996',
    'TO: JOINT ASSESSMENT COMMITTEE': 'PARA: COMITÉ CONJUNTO DE EVALUACIÓN',
    'This memorandum attempts to formalize a hypothesis':
      'Este memorando intenta formalizar una hipótesis',
    'that several of us have been circling for weeks but':
      'alrededor de la cual varios de nosotros hemos estado dando vueltas por semanas pero',
    'none wished to commit to paper.': 'nadie deseó plasmar en papel.',
    'STANDARD COLONIZATION MODEL:': 'MODELO ESTÁNDAR DE COLONIZACIÓN:',
    '  Species travels to target → displaces natives → occupies':
      '  Especie viaja al objetivo → desplaza nativos → ocupa',
    'WHAT WE BELIEVE WE ARE OBSERVING:': 'LO QUE CREEMOS ESTAR OBSERVANDO:',
    '  Species sends scouts → measures viability → transmits data':
      '  Especie envía exploradores → mide viabilidad → transmite datos',
    '  No arrival necessary. No displacement necessary.':
      '  No se necesita llegada. No se necesita desplazamiento.',
    'PROPOSED PHASE STRUCTURE:': 'ESTRUCTURA DE FASES PROPUESTA:',
    '  Phase 1: Reconnaissance (scouts deployed, data gathered)':
      '  Fase 1: Reconocimiento (exploradores desplegados, datos recopilados)',
    '  Phase 2: Seeding (integration organisms introduced)':
      '  Fase 2: Siembra (organismos de integración introducidos)',
    '  Phase 3: Conversion (gradual modification begins)':
      '  Fase 3: Conversión (modificación gradual comienza)',
    '  Phase 4: Extraction (resource harvest accelerates)':
      '  Fase 4: Extracción (cosecha de recursos se acelera)',
    'The brilliance — and I use that word with revulsion —':
      'La brillantez — y uso esa palabra con repulsión —',
    'is that the colonizers never arrive. The colonized':
      'es que los colonizadores nunca llegan. La población',
    'population never perceives a threat because there is':
      'colonizada nunca percibe una amenaza porque no hay',
    'nothing to perceive. The process is gradual, invisible,':
      'nada que percibir. El proceso es gradual, invisible,',
    'and, as far as we can determine, irreversible.':
      'y, hasta donde podemos determinar, irreversible.',
    'CURRENT ASSESSMENT:': 'EVALUACIÓN ACTUAL:',
    '  Earth appears to be in late Phase 1.':
      '  La Tierra parece estar en la última parte de la Fase 1.',
    '  Phase 2 initiation cannot be ruled out.': '  El inicio de la Fase 2 no puede descartarse.',
    '  This committee has debated response options for':
      '  Este comité ha debatido opciones de respuesta durante',
    '  six hours. We have none to propose. Our training':
      '  seis horas. No tenemos ninguna que proponer. Nuestro entrenamiento',
    '  prepared us for enemies with borders, flags, and':
      '  nos preparó para enemigos con fronteras, banderas y',
    '  return addresses.': '  direcciones de retorno.',
    '  Formal recommendation: continued observation.':
      '  Recomendación formal: observación continuada.',
    '  Informal assessment: we are documenting something':
      '  Evaluación informal: estamos documentando algo',
    '  we cannot stop.': '  que no podemos detener.',
    '[SIGNATURES: 4 of 6 committee members]': '[FIRMAS: 4 de 6 miembros del comité]',
    '[2 members declined to sign — objections on file]':
      '[2 miembros se negaron a firmar — objeciones en archivo]',
    'WITNESS STATEMENT — RAW TRANSCRIPT': 'DECLARACIÓN DE TESTIGO — TRANSCRIPCIÓN BRUTA',
    'DATE: 20-JAN-1996 (07:30)': 'FECHA: 20-ENE-1996 (07:30)',
    'WITNESS: Civilian female, age 23': 'TESTIGO: Civil, femenino, 23 años',
    '"I was walking to work when I saw it.': '"Iba caminando al trabajo cuando lo vi.',
    ' It was crouching near the wall.': ' Estaba agachado cerca del muro.',
    ' At first I thought it was a homeless person.':
      ' Al principio pensé que era una persona sin hogar.',
    ' Then I saw its face.': ' Entonces vi su rostro.',
    ' It had no ears. Its skin was... wrong.': ' No tenía orejas. Su piel era... incorrecta.',
    ' It looked at me.': ' Me miró.',
    ' I felt like it was inside my head.': ' Sentí como si estuviera dentro de mi cabeza.',
    ' Then I ran."': ' Entonces corrí."',
    'INTERVIEWER NOTES:': 'NOTAS DEL ENTREVISTADOR:',
    '  Witness appeared genuinely distressed.': '  La testigo parecía genuinamente perturbada.',
    '  Story consistent across multiple retellings.':
      '  Relato consistente en múltiples repeticiones.',
    '  No evidence of fabrication.': '  Sin evidencia de fabricación.',
    'CROSS-REFERENCE:': 'REFERENCIA CRUZADA:',
    '  Similar telepathic contact described in /comms/psi/':
      '  Contacto telepático similar descrito en /comms/psi/',
    'STATUS: File marked for degradation.': 'ESTADO: Archivo marcado para degradación.',
    '        Access recommended before data loss.':
      '        Se recomienda acceso antes de la pérdida de datos.',
    'EMERGENCY ORDERS — INITIAL RESPONSE': 'ÓRDENES DE EMERGENCIA — RESPUESTA INICIAL',
    'ISSUED: 20-JAN-1996 (05:00)': 'EMITIDO: 20-ENE-1996 (05:00)',
    'TO: All Regional Units': 'PARA: Todas las Unidades Regionales',
    '1. Secure perimeter around designated sites.':
      '1. Asegurar perímetro alrededor de los sitios designados.',
    '2. Detain all civilian witnesses for debriefing.':
      '2. Detener a todos los testigos civiles para interrogatorio.',
    '3. Recover ALL physical material. Leave nothing.':
      '3. Recuperar TODO material físico. No dejar nada.',
    '4. Establish communications blackout.': '4. Establecer apagón de comunicaciones.',
    '5. Await specialist team arrival.': '5. Aguardar llegada del equipo especialista.',
    '  Do NOT photograph subjects.': '  NO fotografiar a los sujetos.',
    '  Do NOT touch subjects without protection.': '  NO tocar a los sujetos sin protección.',
    '  Do NOT attempt communication with subjects.': '  NO intentar comunicación con los sujetos.',
    '  Foreign team ETA: See /comms/liaison/':
      '  Llegada estimada del equipo extranjero: Ver /comms/liaison/',
    '  Transport protocols: See /storage/': '  Protocolos de transporte: Ver /storage/',
    'ACKNOWLEDGE RECEIPT IMMEDIATELY.': 'ACUSAR RECIBO INMEDIATAMENTE.',
    'AUTH: DIRECTOR, REGIONAL INTELLIGENCE': 'AUT: DIRECTOR, INTELIGENCIA REGIONAL',
    'TRANSPORT LOG — OPERATION PRATO EXTENSION':
      'REGISTRO DE TRANSPORTE — OPERACIÓN EXTENSIÓN PRATO',
    'DATE: 20-JAN-1996 through 23-JAN-1996': 'FECHA: 20-ENE-1996 a 23-ENE-1996',
    'CLASSIFICATION: OPERACIONAL': 'CLASIFICACIÓN: OPERACIONAL',
    '20-JAN-1996 03:42 — Unit dispatched to Site ALFA':
      '20-ENE-1996 03:42 — Unidad despachada al Sitio ALFA',
    '20-JAN-1996 04:15 — Material secured. Weight: 340kg approx.':
      '20-ENE-1996 04:15 — Material asegurado. Peso: 340kg aprox.',
    '20-JAN-1996 04:58 — Transport to HOLDING-7 initiated':
      '20-ENE-1996 04:58 — Transporte a HOLDING-7 iniciado',
    '21-JAN-1996 01:20 — Secondary recovery at Site BETA':
      '21-ENE-1996 01:20 — Recuperación secundaria en Sitio BETA',
    '21-JAN-1996 02:45 — Fragments catalogued: 12 distinct pieces':
      '21-ENE-1996 02:45 — Fragmentos catalogados: 12 piezas distintas',
    '21-JAN-1996 03:30 — NOTICE: Material divided for redundancy':
      '21-ENE-1996 03:30 — AVISO: Material dividido por redundancia',
    '21-JAN-1996 04:00 — Batch A → HOLDING-7': '21-ENE-1996 04:00 — Lote A → HOLDING-7',
    '21-JAN-1996 04:00 — Batch B → [REDACTED] via diplomatic pouch':
      '21-ENE-1996 04:00 — Lote B → [SUPRIMIDO] vía valija diplomática',
    '22-JAN-1996 — Transfer complete. Chain of custody sealed.':
      '22-ENE-1996 — Transferencia completa. Cadena de custodia sellada.',
    '23-JAN-1996 11:00 — HOLDING-7 inventory reconciled':
      '23-ENE-1996 11:00 — Inventario de HOLDING-7 reconciliado',
    '23-JAN-1996 11:30 — Batch B confirmation pending foreign receipt':
      '23-ENE-1996 11:30 — Confirmación del Lote B pendiente de recibo extranjero',
    'NOTE: Foreign transfer authorized under Protocol 7-ECHO.':
      'NOTA: Transferencia extranjera autorizada bajo Protocolo 7-ECHO.',
    'NOTE: Recipient nation not logged in this system.':
      'NOTA: Nación receptora no registrada en este sistema.',
    'END LOG': 'FIN DEL REGISTRO',
    'MATERIAL ANALYSIS — BATCH A SAMPLES': 'ANÁLISIS DE MATERIAL — MUESTRAS DEL LOTE A',
    'LAB: UNICAMP-AFFILIATED (UNOFFICIAL)': 'LAB: AFILIADO A UNICAMP (NO OFICIAL)',
    'SAMPLE M-07:': 'MUESTRA M-07:',
    '  Composition: Unknown alloy. No terrestrial match.':
      '  Composición: Aleación desconocida. Sin coincidencia terrestre.',
    '  Conductivity: Anomalous. Variable under observation.':
      '  Conductividad: Anómala. Variable bajo observación.',
    '  Mass: Inconsistent between measurements.': '  Masa: Inconsistente entre mediciones.',
    'SAMPLE M-12:': 'MUESTRA M-12:',
    '  Composition: Polymer matrix with metallic inclusions.':
      '  Composición: Matriz polimérica con inclusiones metálicas.',
    '  Tensile strength: Exceeds known materials by factor of 8.':
      '  Resistencia a la tracción: Excede materiales conocidos por factor de 8.',
    '  Thermal response: Absorbs heat without temperature change.':
      '  Respuesta térmica: Absorbe calor sin cambio de temperatura.',
    '  Materials are not of terrestrial manufacture.':
      '  Los materiales no son de manufactura terrestre.',
    '  Recommend immediate classification upgrade.':
      '  Se recomienda elevación inmediata de clasificación.',
    '  Recommend international consultation suppression.':
      '  Se recomienda supresión de consulta internacional.',
    'ADDENDUM:': 'ADENDA:',
    '  Batch B samples were NOT made available for analysis.':
      '  Las muestras del Lote B NO fueron puestas a disposición para análisis.',
    '  Foreign recipient declined reciprocal data sharing.':
      '  El receptor extranjero declinó compartir datos de forma recíproca.',
    'BIO-CONTAINMENT LOG — QUARANTINE SECTION':
      'REGISTRO DE BIO-CONTENCIÓN — SECCIÓN DE CUARENTENA',
    'SITE: REGIONAL HOSPITAL [NOME SUPRIMIDO]': 'SITIO: HOSPITAL REGIONAL [NOMBRE SUPRIMIDO]',
    'DATE: 20-JAN-1996': 'FECHA: 20-ENE-1996',
    '20-JAN 04:30 — Subject ALFA secured. Vitals: Unstable.':
      '20-ENE 04:30 — Sujeto ALFA asegurado. Vitales: Inestables.',
    '20-JAN 05:15 — Subject BETA secured. Vitals: Declining.':
      '20-ENE 05:15 — Sujeto BETA asegurado. Vitales: En declive.',
    '20-JAN 06:00 — Subject ALFA expired. Cause: Unknown.':
      '20-ENE 06:00 — Sujeto ALFA expiró. Causa: Desconocida.',
    '20-JAN 08:00 — Transfer order received.': '20-ENE 08:00 — Orden de transferencia recibida.',
    '20-JAN 09:30 — Subject BETA transferred to military custody.':
      '20-ENE 09:30 — Sujeto BETA transferido a custodia militar.',
    '20-JAN 10:00 — Subject ALFA remains → autopsy protocol.':
      '20-ENE 10:00 — Restos del Sujeto ALFA → protocolo de autopsia.',
    'NOTE: Subjects display non-human morphology.':
      'NOTA: Los sujetos exhiben morfología no humana.',
    'NOTE: Subjects do not match any catalogued species.':
      'NOTA: Los sujetos no coinciden con ninguna especie catalogada.',
    '21-JAN 02:00 — Third subject reported. Site GAMMA.':
      '21-ENE 02:00 — Tercer sujeto reportado. Sitio GAMMA.',
    '21-JAN 04:00 — Third subject secured. Designated GAMMA.':
      '21-ENE 04:00 — Tercer sujeto asegurado. Designado GAMMA.',
    '21-JAN 06:00 — Subject GAMMA transferred. Destination: UNKNOWN.':
      '21-ENE 06:00 — Sujeto GAMMA transferido. Destino: DESCONOCIDO.',
    'WARNING: All bio-material classified COSMIC.':
      'ADVERTENCIA: Todo bio-material clasificado CÓSMICO.',
    'AUTOPSY PROTOCOL — SUBJECT ALFA': 'PROTOCOLO DE AUTOPSIA — SUJETO ALFA',
    'PATHOLOGIST: [CLASSIFIED — forensic specialist, state university]':
      'PATÓLOGO: [CLASIFICADO — especialista forense, universidad estatal]',
    'FACILITY: Hospital Regional do Sul de Minas': 'INSTALACIÓN: Hospital Regional do Sul de Minas',
    'EXTERNAL EXAMINATION:': 'EXAMEN EXTERNO:',
    '  Height: 1.6m (contracted posture noted at recovery site)':
      '  Altura: 1,6m (postura contraída observada en el sitio de recuperación)',
    '  Skin: Dark brown, oily secretion, strong ammonia odor':
      '  Piel: Marrón oscura, secreción oleosa, fuerte olor a amoníaco',
    '  Cranium: Three bony ridges, anterior-posterior alignment':
      '  Cráneo: Tres crestas óseas, alineación anteroposterior',
    '  Eyes: Disproportionately large, deep red, no sclera':
      '  Ojos: Desproporcionadamente grandes, rojo profundo, sin esclerótica',
    '  Limbs: Four digits per extremity': '  Extremidades: Cuatro dígitos por extremidad',
    'INTERNAL EXAMINATION:': 'EXAMEN INTERNO:',
    '  Cardiovascular: Single-chamber circulatory organ':
      '  Cardiovascular: Órgano circulatorio de cámara única',
    '  Digestive: Vestigial. Non-functional.': '  Digestivo: Vestigial. No funcional.',
    '  Reproductive: Absent.': '  Reproductivo: Ausente.',
    '  Neural: Overdeveloped cranial mass. Unusual structures.':
      '  Neural: Masa craneal hiperdesarrollada. Estructuras inusuales.',
    '  Cranial structures suggest high-bandwidth signal processing.':
      '  Las estructuras craneales sugieren procesamiento de señales de alto ancho de banda.',
    '  No vocal apparatus detected.': '  Ningún aparato vocal detectado.',
    '  Hypothesis: Communication via non-acoustic means.':
      '  Hipótesis: Comunicación por medios no acústicos.',
    'TISSUE SAMPLES: Transferred per Protocol 7-ECHO.':
      'MUESTRAS DE TEJIDO: Transferidas según Protocolo 7-ECHO.',
    'PATHOLOGIST ADDENDUM:': 'ADENDA DEL PATÓLOGO:',
    '  "This organism was designed, not evolved."':
      '  "Este organismo fue diseñado, no evolucionado."',
    'ADDENDUM PSI — NEURAL ASSESSMENT': 'ADENDA PSI — EVALUACIÓN NEURAL',
    'CONSULTING: [CLASSIFIED]': 'CONSULTORÍA: [CLASIFICADO]',
    'CRANIAL STRUCTURE ANALYSIS:': 'ANÁLISIS DE ESTRUCTURA CRANEAL:',
    'The neural architecture of Subject ALFA indicates:':
      'La arquitectura neural del Sujeto ALFA indica:',
    '  - Massive parallel processing capability': '  - Capacidad masiva de procesamiento paralelo',
    '  - Structures analogous to signal receivers':
      '  - Estructuras análogas a receptores de señales',
    '  - No decision-making cortex equivalent':
      '  - Sin equivalente al córtex de toma de decisiones',
    '  Subject was not autonomous.': '  El sujeto no era autónomo.',
    '  Subject received instructions from external source.':
      '  El sujeto recibía instrucciones de fuente externa.',
    '  Subject functioned as observer/relay only.':
      '  El sujeto funcionaba solo como observador/retransmisor.',
    '  If subjects are receivers, there must be transmitters.':
      '  Si los sujetos son receptores, debe haber transmisores.',
    '  Transmitters were not recovered at any site.':
      '  Los transmisores no fueron recuperados en ningún sitio.',
    '  Assume observational mission was successful.':
      '  Asumir que la misión observacional fue exitosa.',
    '  Assume data was transmitted before expiration.':
      '  Asumir que los datos fueron transmitidos antes de la expiración.',
    'PSI-COMM TRANSCRIPT — PARTIAL RECOVERY': 'TRANSCRIPCIÓN PSI-COMM — RECUPERACIÓN PARCIAL',
    'SOURCE: Subject BETA (pre-expiration)': 'FUENTE: Sujeto BETA (pre-expiración)',
    'METHOD: EEG pattern analysis + computational reconstruction':
      'MÉTODO: Análisis de patrón EEG + reconstrucción computacional',
    '[FRAGMENT 1]': '[FRAGMENTO 1]',
    '  ...observation complete...': '  ...observación completa...',
    '  ...viable assessment confirmed...': '  ...evaluación viable confirmada...',
    '  ...transmission interrupted...': '  ...transmisión interrumpida...',
    '[FRAGMENT 2]': '[FRAGMENTO 2]',
    '  ...energy density acceptable...': '  ...densidad de energía aceptable...',
    '  ...cognitive activity measured...': '  ...actividad cognitiva medida...',
    '  ...extraction model viable...': '  ...modelo de extracción viable...',
    '[FRAGMENT 3]': '[FRAGMENTO 3]',
    '  ...we are not the arrivers...': '  ...no somos los que llegan...',
    '  ...we are the measuring...': '  ...somos la medición...',
    '  ...others will come...': '  ...otros vendrán...',
    '[END RECOVERED FRAGMENTS]': '[FIN DE LOS FRAGMENTOS RECUPERADOS]',
    'NOTE: Original signal strength suggests transmission':
      'NOTA: La fuerza de señal original sugiere que la transmisión',
    '      reached destination before subject expiration.':
      '      alcanzó el destino antes de la expiración del sujeto.',
    'SECURITY CHECK: Enter material sample weight from transport log (kg)':
      'VERIFICACIÓN DE SEGURIDAD: Ingrese el peso de la muestra de material del registro de transporte (kg)',
    'Check transport_log_96.txt for material weight':
      'Verifique transport_log_96.txt para el peso del material',
    'PSI-COMM TRANSCRIPT — SECONDARY ANALYSIS': 'TRANSCRIPCIÓN PSI-COMM — ANÁLISIS SECUNDARIO',
    'SOURCE: Subject GAMMA': 'FUENTE: Sujeto GAMMA',
    '[RECOVERED SEQUENCE]': '[SECUENCIA RECUPERADA]',
    '  ...thirty rotations...': '  ...treinta rotaciones...',
    '  ...alignment window...': '  ...ventana de alineación...',
    '  ...convergence cycle...': '  ...ciclo de convergencia...',
    'SECURITY CHECK: How many subjects were recovered total?':
      'VERIFICACIÓN DE SEGURIDAD: ¿Cuántos sujetos se recuperaron en total?',
    'Check bio_container.log for subject designations':
      'Verifique bio_container.log para designaciones de sujetos',
    'FIELD REPORT — OPERATION PRATO DELTA': 'INFORME DE CAMPO — OPERACIÓN PRATO DELTA',
    'SUBMITTED: 24-JAN-1996': 'PRESENTADO: 24-ENE-1996',
    '  Three recovery sites established.': '  Tres sitios de recuperación establecidos.',
    '  All physical evidence secured.': '  Toda evidencia física asegurada.',
    '  All biological material secured.': '  Todo material biológico asegurado.',
    'FOREIGN LIAISON:': 'ENLACE EXTRANJERO:',
    '  Representatives from [REDACTED] arrived 22-JAN.':
      '  Representantes de [CENSURADO] llegaron el 22-ENE.',
    '  Joint protocol established.': '  Protocolo conjunto establecido.',
    '  Material sharing agreement signed.': '  Acuerdo de compartición de materiales firmado.',
    '  Local witnesses estimated at 30+.': '  Testigos locales estimados en 30+.',
    '  Media suppression partially effective.': '  Supresión mediática parcialmente efectiva.',
    '  Long-term containment uncertain.': '  Contención a largo plazo incierta.',
    '  Maintain denial posture.': '  Mantener postura de negación.',
    '  Accelerate foreign material transfer.': '  Acelerar transferencia de material extranjero.',
    '  Discontinue local analysis to prevent leaks.':
      '  Discontinuar análisis local para prevenir filtraciones.',
    'THEORETICAL FRAMEWORK — SCOUT VARIANTS': 'MARCO TEÓRICO — VARIANTES DE EXPLORADORES',
    'WORKING MODEL:': 'MODELO DE TRABAJO:',
    'Recovered subjects appear to be purpose-built constructs.':
      'Los sujetos recuperados parecen ser constructos hechos a medida.',
    'Evidence suggests:': 'La evidencia sugiere:',
    '  - Engineered for Earth-specific conditions':
      '  - Diseñados para condiciones específicas de la Tierra',
    '  - Limited operational lifespan (hours to days)':
      '  - Vida operacional limitada (horas a días)',
    '  - High neural plasticity for rapid environmental learning':
      '  - Alta plasticidad neural para aprendizaje ambiental rápido',
    '  - No autonomous decision-making capability':
      '  - Sin capacidad autónoma de toma de decisiones',
    'CLASSIFICATION:': 'CLASIFICACIÓN:',
    '  Designation: "Scouts"': '  Designación: "Exploradores"',
    '  Function: Reconnaissance and measurement': '  Función: Reconocimiento y medición',
    '  Relationship to origin: Unknown (assumed subordinate)':
      '  Relación con el origen: Desconocida (se asume subordinada)',
    '  Scouts are tools, not representatives.':
      '  Los exploradores son herramientas, no representantes.',
    '  Decision-makers remain at origin.': '  Los tomadores de decisiones permanecen en el origen.',
    '  Origin has NOT been contacted.': '  El origen NO ha sido contactado.',
    'ASSESSMENT — ENERGY NODE CLASSIFICATION': 'EVALUACIÓN — CLASIFICACIÓN DE NODO ENERGÉTICO',
    'AUTHOR: [CLASSIFIED — signals division analyst]':
      'AUTOR: [CLASIFICADO — analista de la división de señales]',
    'DATE: 10-FEB-1996': 'FECHA: 10-FEB-1996',
    'TO: ASSESSMENT DIRECTORATE': 'PARA: DIRECCIÓN DE EVALUACIÓN',
    'RECOVERED SIGNAL CROSS-REFERENCE:': 'REFERENCIA CRUZADA DE SEÑALES RECUPERADAS:',
    'Psi-comm fragments, when mapped against material':
      'Los fragmentos psi-comm, cuando se mapean contra el análisis',
    'analysis, produce a consistent pattern:': 'de material, producen un patrón consistente:',
    '  - "Energy density" referenced 4 times across specimens':
      '  - "Densidad de energía" referenciada 4 veces entre especímenes',
    '  - "Extraction model" phrasing consistent in all samples':
      '  - Fraseo "Modelo de extracción" consistente en todas las muestras',
    '  - "Cognitive activity" used as a metric — this is unusual':
      '  - "Actividad cognitiva" usada como métrica — esto es inusual',
    '    and does not correspond to any known measurement system':
      '    y no corresponde a ningún sistema de medición conocido',
    'ANALYST HYPOTHESIS:': 'HIPÓTESIS DEL ANALISTA:',
    '  Earth is being assessed as an energy source.':
      '  La Tierra está siendo evaluada como fuente de energía.',
    '  Biological neural networks may serve as the':
      '  Las redes neuronales biológicas pueden servir como el',
    '  extraction medium. Cognitive output correlates':
      '  medio de extracción. La producción cognitiva se correlaciona',
    '  with projected energy yield.': '  con el rendimiento energético proyectado.',
    '  Recovered material samples exhibit energy absorption':
      '  Las muestras de material recuperado exhiben propiedades de',
    '  properties we cannot replicate or fully explain.':
      '  absorción de energía que no podemos replicar ni explicar completamente.',
    '  Scout neural structures confirm measurement function.':
      '  Las estructuras neuronales de los exploradores confirman función de medición.',
    '  The scout mission appears complete. Next phase':
      '  La misión de los exploradores parece completada. El inicio de la',
    '  initiation is uncertain. Transition window undefined.':
      '  próxima fase es incierto. Ventana de transición indefinida.',
    '  Establish long-term signal monitoring station.':
      '  Establecer estación de monitoreo de señales a largo plazo.',
    '  Staff with personnel who have read clearance.':
      '  Dotar de personal con autorización de lectura.',
    '  Budget request attached separately — the Ministry':
      '  Solicitud de presupuesto adjunta por separado — el Ministerio',
    '  will not approve if they see the justification.': '  no aprobará si ven la justificación.',
    '[SIGNATURE REDACTED]': '[FIRMA CENSURADA]',
    'THREAT ASSESSMENT — TRANSITION WINDOW': 'EVALUACIÓN DE AMENAZA — VENTANA DE TRANSICIÓN',
    'AUTHOR: [CLASSIFIED — threat analysis section chief]':
      'AUTOR: [CLASIFICADO — jefe de sección de análisis de amenazas]',
    'DATE: 02-MAR-1996': 'FECHA: 02-MAR-1996',
    'TO: MINISTRY OF DEFENSE — STRATEGIC PLANNING':
      'PARA: MINISTERIO DE DEFENSA — PLANIFICACIÓN ESTRATÉGICA',
    'TIMELINE RECONSTRUCTION:': 'RECONSTRUCCIÓN DE LA LÍNEA TEMPORAL:',
    '  Reference: Psi-comm fragment "thirty rotations"':
      '  Referencia: Fragmento psi-comm "treinta rotaciones"',
    '  Best interpretation: 30 Earth orbital cycles':
      '  Mejor interpretación: 30 ciclos orbitales terrestres',
    '  Base year: 1996 (current incident)': '  Año base: 1996 (incidente actual)',
    '  Target year: 2026': '  Año objetivo: 2026',
    'NATURE OF WINDOW: UNKNOWN': 'NATURALEZA DE LA VENTANA: DESCONOCIDA',
    'We have debated the following possibilities:': 'Hemos debatido las siguientes posibilidades:',
    '  - Secondary deployment of integration organisms':
      '  - Despliegue secundario de organismos de integración',
    '  - Transition from reconnaissance to active phase':
      '  - Transición de fase de reconocimiento a fase activa',
    '  - Communication or activation signal': '  - Señal de comunicación o activación',
    '  - Initiation of energy extraction process':
      '  - Inicio del proceso de extracción de energía',
    'None of these can be confirmed. All are consistent':
      'Ninguna de estas puede confirmarse. Todas son consistentes',
    'with recovered data.': 'con los datos recuperados.',
    'RECOMMENDED POSTURE:': 'POSTURA RECOMENDADA:',
    '  - Maintain observation protocols through 2026':
      '  - Mantener protocolos de observación hasta 2026',
    '  - Establish monitoring baseline for anomalous signals':
      '  - Establecer línea base de monitoreo para señales anómalas',
    '  - Prepare contingency frameworks (nature TBD)':
      '  - Preparar marcos de contingencia (naturaleza por determinar)',
    'IMPORTANT CAVEAT:': 'ADVERTENCIA IMPORTANTE:',
    '  This is not a prediction. It is a detected reference':
      '  Esto no es una predicción. Es una referencia detectada',
    '  in recovered neural fragments. Our interpretation':
      '  en fragmentos neuronales recuperados. Nuestra interpretación',
    '  may be completely wrong. But the reference exists.':
      '  puede estar completamente equivocada. Pero la referencia existe.',
    '  We cannot pretend it does not.': '  No podemos pretender que no.',
    'INTERNAL MEMORANDUM — NOTE 07': 'MEMORÁNDUM INTERNO — NOTA 07',
    'FROM: [REDACTED]': 'DE: [CENSURADO]',
    'TO: DIRECTOR': 'PARA: DIRECTOR',
    'SUBJECT: Foreign Involvement Concerns':
      'ASUNTO: Preocupaciones sobre Participación Extranjera',
    'Director,': 'Director,',
    'I must register my objection to the current arrangement.':
      'Debo registrar mi objeción al acuerdo actual.',
    'The foreign delegation arrived before we had completed':
      'La delegación extranjera llegó antes de que completáramos',
    'initial assessment. Their access to biological samples':
      'la evaluación inicial. Su acceso a muestras biológicas',
    'was granted before chain of custody was established.':
      'fue concedido antes de establecerse la cadena de custodia.',
    'I have reason to believe:': 'Tengo razones para creer:',
    '  - They had advance knowledge of the incident':
      '  - Tenían conocimiento previo del incidente',
    '  - Their equipment was pre-positioned': '  - Su equipo estaba pre-posicionado',
    '  - Their protocols superseded our own': '  - Sus protocolos reemplazaron los nuestros',
    'This was not cooperation. This was assumption of control.':
      'Esto no fue cooperación. Fue una toma de control.',
    'I recommend formal protest through diplomatic channels.':
      'Recomiendo protesta formal a través de canales diplomáticos.',
    'ASSESSMENT — INDIRECT COLONIZATION MODEL': 'EVALUACIÓN — MODELO DE COLONIZACIÓN INDIRECTA',
    'CLASSIFICATION: RED — COMPARTMENTED': 'CLASIFICACIÓN: ROJO — COMPARTIMENTADO',
    'AUTHOR: [CLASSIFIED — colonel, strategic planning]':
      'AUTOR: [CLASIFICADO — coronel, planificación estratégica]',
    'DATE: 27-FEB-1996': 'FECHA: 27-FEB-1996',
    'TO: MINISTRY OF DEFENSE — SPECIAL PROGRAMS':
      'PARA: MINISTERIO DE DEFENSA — PROGRAMAS ESPECIALES',
    'Excellency,': 'Excelencia,',
    'After reviewing the full specimen analysis and the':
      'Después de revisar el análisis completo de especímenes y los',
    'recovered psi-comm fragments, I must present a framework':
      'fragmentos psi-comm recuperados, debo presentar un marco',
    'that none of us wanted to consider.': 'que ninguno de nosotros quería considerar.',
    'I stress that this is my interpretation. I pray':
      'Enfatizo que esta es mi interpretación. Rezo',
    'that I am wrong.': 'para estar equivocado.',
    'PHASE 1 — RECONNAISSANCE (CONFIRMED)': 'FASE 1 — RECONOCIMIENTO (CONFIRMADO)',
    '  Bio-engineered scouts deployed.': '  Exploradores bioingeniados desplegados.',
    '  Planetary viability measured.': '  Viabilidad planetaria medida.',
    '  Cognitive density assessed — our population, our minds.':
      '  Densidad cognitiva evaluada — nuestra población, nuestras mentes.',
    '  Findings transmitted to origin before recovery.':
      '  Hallazgos transmitidos al origen antes de la recuperación.',
    '  This phase appears complete. The scouts succeeded.':
      '  Esta fase parece completada. Los exploradores tuvieron éxito.',
    'PHASE 2 — SEEDING (THEORETICAL)': 'FASE 2 — SIEMBRA (TEÓRICO)',
    '  Integration organisms introduced.': '  Organismos de integración introducidos.',
    '  These would not resemble the scouts. They would':
      '  Estos no se asemejarían a los exploradores. No se',
    '  resemble nothing. Or everything.': '  asemejarían a nada. O a todo.',
    '  Gradual ecological and biological modification.':
      '  Modificación ecológica y biológica gradual.',
    '  I do not know if this has begun.': '  No sé si esto ha comenzado.',
    '  The neural fragments suggest it will.': '  Los fragmentos neuronales sugieren que sucederá.',
    'PHASE 3 — EXTRACTION (THEORETICAL)': 'FASE 3 — EXTRACCIÓN (TEÓRICO)',
    '  Target world becomes an energy source.':
      '  El mundo objetivo se convierte en fuente de energía.',
    '  Local species continues existing — but diminished.':
      '  La especie local continúa existiendo — pero disminuida.',
    '  Autonomy and agency degrade. Slowly. Invisibly.':
      '  Autonomía y agencia se degradan. Lentamente. Invisiblemente.',
    CONCLUSION: 'CONCLUSIÓN',
    'What disturbs me most is the elegance of it.':
      'Lo que más me perturba es la elegancia de esto.',
    'They do not need to arrive. They do not destroy.': 'No necesitan llegar. No destruyen.',
    'They convert. Quietly. From a distance we cannot':
      'Convierten. Silenciosamente. Desde una distancia que no podemos',
    'comprehend.': 'comprender.',
    'We trained our entire defense apparatus to repel':
      'Entrenamos todo nuestro aparato de defensa para repeler',
    'invaders. There is nothing to repel.': 'invasores. No hay nada que repeler.',
    'ASSESSMENT: Phase 1 appears complete for Earth.':
      'EVALUACIÓN: La Fase 1 parece completada para la Tierra.',
    'I have requested confession with the base chaplain.':
      'He solicitado confesión con el capellán de la base.',
    'EXECUTIVE BRIEFING — THE WATCHERS': 'BRIEFING EJECUTIVO — LOS OBSERVADORES',
    'CLASSIFICATION: COSMIC — EYES ONLY': 'CLASIFICACIÓN: CÓSMICO — SOLO PARA OJOS AUTORIZADOS',
    'PREPARED BY: JOINT ASSESSMENT COMMITTEE': 'PREPARADO POR: COMITÉ DE EVALUACIÓN CONJUNTA',
    'DATE: FEBRUARY 1996': 'FECHA: FEBRERO 1996',
    'TO: [DISTRIBUTION LIMITED — MINISTRY LEVEL]':
      'PARA: [DISTRIBUCIÓN LIMITADA — NIVEL MINISTERIAL]',
    'This document summarizes our current institutional':
      'Este documento resume nuestro entendimiento institucional',
    'understanding of the January 1996 incident and its':
      'actual del incidente de enero de 1996 y sus',
    'implications. It has been reviewed by all six members':
      'implicaciones. Ha sido revisado por los seis miembros',
    'of this committee. What follows is consensus.': 'de este comité. Lo que sigue es consenso.',
    'I. THE INCIDENT': 'I. EL INCIDENTE',
    'Between 20–23 January 1996, military and fire brigade':
      'Entre el 20-23 de enero de 1996, unidades militares y de bomberos',
    'units conducted recovery operations at three distinct':
      'condujeron operaciones de recuperación en tres sitios',
    'sites near Varginha, Minas Gerais.': 'distintos cerca de Varginha, Minas Gerais.',
    'Physical debris and biological specimens were secured.':
      'Escombros físicos y especímenes biológicos fueron asegurados.',
    'Material was divided per standing multinational protocol.':
      'El material fue dividido según protocolo multinacional vigente.',
    'A portion was transferred to foreign partners before this':
      'Una porción fue transferida a socios extranjeros antes de que este',
    'committee was fully convened — a procedural failure we':
      'comité fuera totalmente convocado — un fallo procedimental que',
    'have formally protested.': 'hemos protestado formalmente.',
    'II. THE SPECIMENS': 'II. LOS ESPECÍMENES',
    'Three non-human biological entities recovered.':
      'Tres entidades biológicas no humanas recuperadas.',
    'Designated: ALFA, BETA, GAMMA.': 'Designadas: ALFA, BETA, GAMMA.',
    'Autopsy and tissue analysis indicate:': 'La autopsia y análisis de tejidos indican:',
    '  - Purpose-built organisms, not naturally evolved':
      '  - Organismos construidos a medida, no evolucionados naturalmente',
    '  - Limited operational lifespan (designed to expire)':
      '  - Vida operacional limitada (diseñados para expirar)',
    '  - Neural architecture oriented toward observation':
      '  - Arquitectura neuronal orientada hacia la observación',
    '  - No autonomous decision-making structures found':
      '  - No se encontraron estructuras autónomas de toma de decisiones',
    '  - Communication via non-acoustic means (see PSI files)':
      '  - Comunicación por medios no acústicos (ver archivos PSI)',
    'In plain language: these were instruments. Scouts.':
      'En lenguaje simple: estos eran instrumentos. Exploradores.',
    'Sent to observe and transmit. Not ambassadors.':
      'Enviados para observar y transmitir. No embajadores.',
    'Not explorers. Tools.': 'No exploradores. Herramientas.',
    'III. THE TRANSMISSION': 'III. LA TRANSMISIÓN',
    'Recovered psi-comm fragments confirm:': 'Los fragmentos psi-comm recuperados confirman:',
    '  - Mission was observational and appears successful':
      '  - La misión era observacional y parece exitosa',
    '  - Data was transmitted before specimen expiration':
      '  - Los datos fueron transmitidos antes de la expiración del espécimen',
    '  - Earth assessed as viable for energy extraction':
      '  - La Tierra evaluada como viable para extracción de energía',
    '  - Reference to a future "alignment window"':
      '  - Referencia a una futura "ventana de alineación"',
    'We believe the scouts completed their purpose.':
      'Creemos que los exploradores completaron su propósito.',
    'The data they gathered has already been received':
      'Los datos que recopilaron ya fueron recibidos',
    'by whatever sent them.': 'por quien sea que los envió.',
    'IV. THE WINDOW': 'IV. LA VENTANA',
    '"Thirty rotations" — interpreted as 30 orbital years.':
      '"Treinta rotaciones" — interpretado como 30 años orbitales.',
    'Projected window: YEAR 2026.': 'Ventana proyectada: AÑO 2026.',
    'Nature unknown. Assessed possibilities:': 'Naturaleza desconocida. Posibilidades evaluadas:',
    '  - Deployment of integration organisms': '  - Despliegue de organismos de integración',
    '  - Initiation of indirect conversion process':
      '  - Inicio del proceso de conversión indirecta',
    '  - Activation signal for pre-positioned systems':
      '  - Señal de activación para sistemas pre-posicionados',
    'We stress: this is not an invasion timeline.':
      'Enfatizamos: esto no es una línea temporal de invasión.',
    'It may be something we do not yet have language for.':
      'Puede ser algo para lo cual aún no tenemos lenguaje.',
    'V. THE WATCHERS': 'V. LOS OBSERVADORES',
    'Working designation for the origin civilization.':
      'Designación de trabajo para la civilización de origen.',
    'What we believe we know:': 'Lo que creemos saber:',
    '  - Post-biological or hybrid form of existence':
      '  - Forma de existencia post-biológica o híbrida',
    '  - Colonial expansion through indirect conversion':
      '  - Expansión colonial a través de conversión indirecta',
    '  - Do not physically arrive at target worlds':
      '  - No llegan físicamente a los mundos objetivo',
    '  - Utilize bio-engineered intermediaries for assessment':
      '  - Utilizan intermediarios bioingeniados para evaluación',
    '  - Extract energy from cognitive biological networks':
      '  - Extraen energía de redes biológicas cognitivas',
    'The name "Watchers" was chosen by this committee.':
      'El nombre "Observadores" fue elegido por este comité.',
    'It is the only word that fits. They observe.':
      'Es la única palabra que encaja. Ellos observan.',
    'They measure. They wait. And then — we believe —': 'Miden. Esperan. Y entonces — creemos —',
    'they harvest. Without ever arriving.': 'cosechan. Sin llegar jamás.',
    'VI. INSTITUTIONAL POSTURE': 'VI. POSTURA INSTITUCIONAL',
    'Current directive from the Ministry:': 'Directiva actual del Ministerio:',
    '  - Maintain public denial per multinational protocol':
      '  - Mantener negación pública según protocolo multinacional',
    '  - Continue monitoring for activation signals':
      '  - Continuar monitoreo de señales de activación',
    '  - Coordinate with international partners': '  - Coordinar con socios internacionales',
    '  - Prepare contingency frameworks for 2026 window':
      '  - Preparar marcos de contingencia para la ventana de 2026',
    'This committee notes, with professional distress,':
      'Este comité nota, con angustia profesional,',
    'that "contingency framework" implies a response':
      'que "marco de contingencia" implica una capacidad',
    'capability we do not possess. We have documented':
      'de respuesta que no poseemos. Hemos documentado',
    'a situation. We have not found a solution.':
      'una situación. No hemos encontrado una solución.',
    'God help us all.': 'Dios nos ayude a todos.',
    'END BRIEFING — 4 COPIES AUTHORIZED': 'FIN DEL BRIEFING — 4 COPIAS AUTORIZADAS',
    'SESSION RESIDUE — AUTOMATED LOG': 'RESIDUO DE SESIÓN — LOG AUTOMATIZADO',
    'Multiple evidence file accesses detected.':
      'Múltiples accesos a archivos de evidencia detectados.',
    'Review pattern indicates deliberate collection.':
      'El patrón de revisión indica recolección deliberada.',
    'Temporary cache contains enough material to':
      'La caché temporal contiene suficiente material para',
    'support an external leak attempt.': 'apoyar un intento de filtración externa.',
    'CONCLUSION: Session risk elevated.': 'CONCLUSIÓN: Riesgo de la sesión elevado.',
    'NOTICE: Export behavior expected.': 'AVISO: Comportamiento de exportación esperado.',
    'ETHICS EXCEPTION — REQUEST 03': 'EXCEPCIÓN ÉTICA — SOLICITUD 03',
    'DATE: 29-JAN-1996': 'FECHA: 29-ENE-1996',
    'REQUEST:': 'SOLICITUD:',
    '  Waiver of standard protocols for specimen handling.':
      '  Exención de protocolos estándar para manejo de especímenes.',
    '  Justification: Unique scientific opportunity.':
      '  Justificación: Oportunidad científica única.',
    'STATUS: APPROVED': 'ESTADO: APROBADO',
    '  - All procedures conducted off-site':
      '  - Todos los procedimientos realizados fuera de las instalaciones',
    '  - No institutional records': '  - Sin registros institucionales',
    '  - Results shared with foreign partners only':
      '  - Resultados compartidos solo con socios extranjeros',
    'APPROVAL: [SIGNATURE REDACTED]': 'APROBACIÓN: [FIRMA CENSURADA]',
    'PROGRAM OVERVIEW — BIO-ASSESSMENT INITIATIVE':
      'VISIÓN GENERAL DEL PROGRAMA — INICIATIVA DE BIO-EVALUACIÓN',
    'Following the January 1996 incident, a joint program':
      'Tras el incidente de enero de 1996, se estableció un programa',
    'was established with international partners.': 'conjunto con socios internacionales.',
    'OBJECTIVES:': 'OBJETIVOS:',
    '  - Analyze recovered biological material': '  - Analizar material biológico recuperado',
    '  - Develop detection protocols': '  - Desarrollar protocolos de detección',
    '  - Prepare response frameworks': '  - Preparar marcos de respuesta',
    'PARTICIPANTS:': 'PARTICIPANTES:',
    '  - Brazilian Intelligence (Lead, Local)': '  - Inteligencia Brasileña (Líder, Local)',
    '  - [REDACTED] (Technical Analysis)': '  - [CENSURADO] (Análisis Técnico)',
    '  - [REDACTED] (Biological Assessment)': '  - [CENSURADO] (Evaluación Biológica)',
    'DIVISION OF ASSETS:': 'DIVISIÓN DE ACTIVOS:',
    '  - Brazil retains Subject ALFA remains': '  - Brasil retiene restos del Sujeto ALFA',
    '  - Foreign partner received Subjects BETA, GAMMA':
      '  - Socio extranjero recibió Sujetos BETA, GAMMA',
    '  - Material samples divided per Protocol 7-ECHO':
      '  - Muestras de material divididas según Protocolo 7-ECHO',
    'STATUS: Ongoing.': 'ESTADO: En curso.',
    'TEMPORAL ANALYSIS — WINDOW ALIGNMENT': 'ANÁLISIS TEMPORAL — ALINEACIÓN DE VENTANA',
    'METHODOLOGY: Signal Pattern Reconstruction': 'METODOLOGÍA: Reconstrucción de Patrón de Señal',
    'AUTHOR: [CLASSIFIED — signals intelligence analyst]':
      'AUTOR: [CLASIFICADO — analista de inteligencia de señales]',
    'Cross-analysis of all recovered psi-comm fragments':
      'El análisis cruzado de todos los fragmentos psi-comm recuperados',
    'yielded the following recurring temporal references:':
      'produjo las siguientes referencias temporales recurrentes:',
    'TEMPORAL REFERENCES:': 'REFERENCIAS TEMPORALES:',
    '  - "thirty rotations" (freq: 3)': '  - "treinta rotaciones" (freq: 3)',
    '  - "alignment" (freq: 2)': '  - "alineación" (freq: 2)',
    '  - "convergence" (freq: 1)': '  - "convergencia" (freq: 1)',
    '  - "window" (freq: 2)': '  - "ventana" (freq: 2)',
    'ASTRONOMICAL CORRELATION:': 'CORRELACIÓN ASTRONÓMICA:',
    '  Year 2026 shows:': '  El año 2026 muestra:',
    '    - Unusual planetary alignments': '    - Alineaciones planetarias inusuales',
    '    - Solar activity projections: elevated': '    - Proyecciones de actividad solar: elevadas',
    '    - [DATA INSUFFICIENT FOR FURTHER CORRELATION]':
      '    - [DATOS INSUFICIENTES PARA CORRELACIÓN ADICIONAL]',
    'CONFIDENCE LEVEL: MODERATE': 'NIVEL DE CONFIANZA: MODERADO',
    '  Establish monitoring protocols for year 2026.':
      '  Establecer protocolos de monitoreo para el año 2026.',
    '  Nature of expected event: UNKNOWN.': '  Naturaleza del evento esperado: DESCONOCIDA.',
    'PERSONAL NOTE:': 'NOTA PERSONAL:',
    '  The frequency of "thirty rotations" across': '  La frecuencia de "treinta rotaciones" entre',
    '  independent specimen extractions is difficult':
      '  extracciones de especímenes independientes es difícil',
    '  to dismiss as coincidence. I recommend we take':
      '  de descartar como coincidencia. Recomiendo que tomemos',
    '  this reference seriously.': '  esta referencia en serio.',
    'RAW NEURAL CAPTURE — SPECIMEN ALFA': 'CAPTURA NEURONAL BRUTA — ESPÉCIMEN ALFA',
    'EXTRACTION DATE: 21-JAN-1996 04:17': 'FECHA DE EXTRACCIÓN: 21-ENE-1996 04:17',
    'DURATION: 0.3 SECONDS (SUBJECTIVE: UNKNOWN)':
      'DURACIÓN: 0,3 SEGUNDOS (SUBJETIVA: DESCONOCIDA)',
    '[non-linear perception detected]': '[percepción no lineal detectada]',
    '...purpose singular... observe catalog transmit...':
      '...propósito singular... observar catalogar transmitir...',
    '...not-self... extension... eyes-that-are-not-eyes...':
      '...no-yo... extensión... ojos-que-no-son-ojos...',
    '...this world... dense... loud... LOUD...': '...este mundo... denso... ruidoso... RUIDOSO...',
    '[temporal distortion]': '[distorsión temporal]',
    '...others of this-shape sent to many worlds...':
      '...otros de esta-forma enviados a muchos mundos...',
    '...most do not return... return not expected...':
      '...la mayoría no regresa... regreso no esperado...',
    '...we are the cost of knowing...': '...somos el costo de saber...',
    '[emotional bleed: resignation]': '[sangrado emocional: resignación]',
    '...they-above wait... they-above measure...':
      '...los-de-arriba esperan... los-de-arriba miden...',
    '...seven billion... dense... high yield...':
      '...siete mil millones... denso... alto rendimiento...',
    '...window approaches... thirty rotations...':
      '...ventana se aproxima... treinta rotaciones...',
    '[conceptual transmission]': '[transmisión conceptual]',
    '>>>IMAGE: vast darkness between stars': '>>>IMAGEN: vasta oscuridad entre estrellas',
    '>>>IMAGE: something watching, not moving, never moving':
      '>>>IMAGEN: algo observando, sin moverse, nunca moviéndose',
    '>>>IMAGE: threads connecting to countless worlds':
      '>>>IMAGEN: hilos conectando a incontables mundos',
    '>>>CONCEPT: harvest is not destruction': '>>>CONCEPTO: la cosecha no es destrucción',
    '>>>CONCEPT: the crop continues living': '>>>CONCEPTO: el cultivo sigue viviendo',
    '[signal degradation]': '[degradación de señal]',
    '...we do not arrive... we do not need to...': '...no llegamos... no necesitamos...',
    '...you are already... already...': '...ustedes ya son... ya...',
    'ANALYST NOTE: Subject expired during neural extraction.':
      'NOTA DEL ANALISTA: Sujeto expiró durante extracción neuronal.',
    '              Complete cognitive download was not possible.':
      '              La descarga cognitiva completa no fue posible.',
    '              What we captured is partial. Pray it was':
      '              Lo que capturamos es parcial. Recen para que haya sido',
    '              enough. Pray it was not.': '              suficiente. Recen para que no.',
    'NEURAL PATTERN PRESERVED FOR REMOTE LINK': 'PATRÓN NEURONAL PRESERVADO PARA ENLACE REMOTO',
    'FILE: NEURAL_DUMP_ALFA.PSI': 'ARCHIVO: NEURAL_DUMP_ALFA.PSI',
    'STATUS: ENCRYPTED': 'ESTADO: ENCRIPTADO',
    'CLASSIFICATION: COSMIC - PSI-DIVISION': 'CLASIFICACIÓN: CÓSMICO - DIVISIÓN-PSI',
    'RECOVERED COPY AVAILABLE': 'COPIA RECUPERADA DISPONIBLE',
    'This file contains raw neural capture data from':
      'Este archivo contiene datos brutos de captura neuronal de',
    'recovered specimen. Authentication required.':
      'espécimen recuperado. Se requiere autenticación.',
    'Use: open neural_dump_alfa.psi': 'Use: open neural_dump_alfa.psi',
    'Subject designation (found in autopsy records):':
      'Designación del sujeto (encontrada en registros de autopsia):',
    'Check autopsy files in quarantine': 'Verifique archivos de autopsia en cuarentena',
    'REPORT — PSI-COMMUNICATION ANALYSIS': 'INFORME — ANÁLISIS DE PSI-COMUNICACIÓN',
    'DATE: 15-FEB-1996': 'FECHA: 15-FEB-1996',
    'EXECUTIVE SUMMARY:': 'RESUMEN EJECUTIVO:',
    'Communication with recovered specimens occurred via':
      'La comunicación con especímenes recuperados ocurrió vía',
    'non-acoustic, non-electromagnetic means. Personnel':
      'medios no acústicos y no electromagnéticos. El personal',
    'reported receiving information without sensory input.':
      'reportó recibir información sin estímulo sensorial.',
    'CHARACTERISTICS OF PSI-COMM': 'CARACTERÍSTICAS DE LA PSI-COMM',
    'NOT observed:': 'NO observado:',
    '  - Spoken language': '  - Lenguaje hablado',
    '  - Written symbols': '  - Símbolos escritos',
    '  - Gestural communication': '  - Comunicación gestual',
    'OBSERVED:': 'OBSERVADO:',
    '  - Synchronized neural activity between operator/subject':
      '  - Actividad neuronal sincronizada entre operador/sujeto',
    '  - Intrusive conceptual transmission': '  - Transmisión conceptual intrusiva',
    '  - Shared imagery and meaning, not symbols':
      '  - Imágenes y significados compartidos, no símbolos',
    '  - Emotional state transfer': '  - Transferencia de estado emocional',
    'OPERATOR EFFECTS': 'EFECTOS EN EL OPERADOR',
    'Personnel exposed to psi-comm report:': 'El personal expuesto a psi-comm reporta:',
    '  - Loss of temporal reference (hours feel like seconds)':
      '  - Pérdida de referencia temporal (las horas se sienten como segundos)',
    '  - Intrusive thoughts persisting for days':
      '  - Pensamientos intrusivos que persisten por días',
    '  - Emotional "bleed-through" (fear, resignation, purpose)':
      '  - "Sangrado" emocional (miedo, resignación, propósito)',
    '  - Understanding concepts without being able to explain':
      '  - Comprender conceptos sin poder explicar',
    'Lead Operator (Psi Division):': 'Operador Líder (División Psi):',
    '"I understood what it was showing me. I cannot tell you':
      '"Entendí lo que me estaba mostrando. No puedo decirle',
    ' what I understood. The knowing does not translate."':
      ' lo que entendí. El conocimiento no se traduce."',
    'CRITICAL FINDING': 'HALLAZGO CRÍTICO',
    'The entities do not communicate to exchange information.':
      'Las entidades no se comunican para intercambiar información.',
    'They transmit. They do not expect response.': 'Transmiten. No esperan respuesta.',
    'They were never designed for dialogue.': 'Nunca fueron diseñados para el diálogo.',
    'LINK ACCESS PROTOCOL': 'PROTOCOLO DE ACCESO AL ENLACE',
    'Neural pattern preservation allows post-mortem link.':
      'La preservación del patrón neuronal permite enlace post-mortem.',
    'Authentication phrase derived from psi-comm transmission.':
      'Frase de autenticación derivada de transmisión psi-comm.',
    '  > link': '  > link',
    '  > Enter phrase: ___________': '  > Ingrese la frase: ___________',
    'Access phrase referenced in neural dump under [conceptual':
      'Frase de acceso referenciada en el volcado neuronal bajo sección',
    'transmission] section — the primary directive.':
      '[transmisión conceptual] — la directiva primaria.',
    'ANALYSIS — SPECIMEN FUNCTION AND PURPOSE': 'ANÁLISIS — FUNCIÓN Y PROPÓSITO DEL ESPÉCIMEN',
    'AUTHOR: [CLASSIFIED — senior biologist, assessment team]':
      'AUTOR: [CLASIFICADO — biólogo sénior, equipo de evaluación]',
    'DATE: 22-FEB-1996': 'FECHA: 22-FEB-1996',
    'CONCLUSION: The recovered entities are tools, not envoys.':
      'CONCLUSIÓN: Las entidades recuperadas son herramientas, no enviados.',
    'ANATOMICAL EVIDENCE': 'EVIDENCIA ANATÓMICA',
    'Specimens show signs of deliberate engineering:':
      'Los especímenes muestran signos de ingeniería deliberada:',
    '  SPECIALIZED:': '  ESPECIALIZADO:',
    '    - Sensory organs optimized for observation':
      '    - Órganos sensoriales optimizados para observación',
    '    - Neural density far exceeds body mass requirement':
      '    - La densidad neuronal excede con creces el requisito de masa corporal',
    '    - Simplified digestive system (mission duration limited)':
      '    - Sistema digestivo simplificado (duración de misión limitada)',
    '  FRAGILE:': '  FRÁGIL:',
    '    - Poorly suited for Earth gravity (joint stress)':
      '    - Poco adecuado para gravedad terrestre (estrés articular)',
    '    - Minimal immune response (not built to survive)':
      '    - Respuesta inmunológica mínima (no construido para sobrevivir)',
    '    - No reproductive capability whatsoever': '    - Sin capacidad reproductiva alguna',
    '  LIMITED:': '  LIMITADO:',
    '    - No evidence of autonomous decision-making centers':
      '    - Sin evidencia de centros autónomos de toma de decisiones',
    '    - Behavior patterns suggest programmed routines':
      '    - Patrones de comportamiento sugieren rutinas programadas',
    '    - Mission completion prioritized over self-preservation':
      '    - Conclusión de la misión priorizada sobre autopreservación',
    INTERPRETATION: 'INTERPRETACIÓN',
    'These are reconnaissance units. Purpose-built.':
      'Estas son unidades de reconocimiento. Construidas a medida.',
    'They were never meant to survive this assignment.':
      'Nunca fueron diseñados para sobrevivir a esta misión.',
    'They were never meant to return.': 'Nunca fueron diseñados para regresar.',
    'They were never meant to represent their creators.':
      'Nunca fueron diseñados para representar a sus creadores.',
    'In my professional assessment, they are biological':
      'En mi evaluación profesional, son sensores',
    'sensors. Nothing more.': 'biológicos. Nada más.',
    'WHAT THIS IMPLIES': 'LO QUE ESTO IMPLICA',
    'If Earth received scouts, it passed initial screening.':
      'Si la Tierra recibió exploradores, pasó la evaluación inicial.',
    'If scouts transmitted successfully, data was received.':
      'Si los exploradores transmitieron con éxito, los datos fueron recibidos.',
    'I do not enjoy writing this next sentence.': 'No disfruto escribir la siguiente oración.',
    'If data was received, then we have been catalogued.':
      'Si los datos fueron recibidos, entonces hemos sido catalogados.',
    'Someone — something — now knows we are here,': 'Alguien — algo — ahora sabe que estamos aquí,',
    'what we are, and what we are worth.': 'lo que somos y cuánto valemos.',
    'Year of projected transition window:': 'Año de la ventana de transición proyectada:',
    'Referenced in multiple classified documents':
      'Referenciado en múltiples documentos clasificados',
    'INTERCEPTED SIGNAL — PRIORITY ULTRA': 'SEÑAL INTERCEPTADA — PRIORIDAD ULTRA',
    'INTERCEPT DATE: 03-MAR-1996': 'FECHA DE INTERCEPTACIÓN: 03-MAR-1996',
    'ORIGIN: EXTRASOLAR': 'ORIGEN: EXTRASOLAR',
    'CLASSIFICATION: This transmission was detected 6 weeks':
      'CLASIFICACIÓN: Esta transmisión fue detectada 6 semanas',
    'after the January incident. Source triangulation indicates':
      'después del incidente de enero. La triangulación de la fuente indica',
    'origin beyond solar system boundary.': 'origen más allá del límite del sistema solar.',
    'TRANSMISSION CONTENT (CONCEPTUAL TRANSLATION)':
      'CONTENIDO DE LA TRANSMISIÓN (TRADUCCIÓN CONCEPTUAL)',
    '>>RECEIPT: Scout telemetry confirmed': '>>RECIBO: Telemetría del explorador confirmada',
    '>>STATUS: Target world catalogued': '>>ESTADO: Mundo objetivo catalogado',
    '>>ASSESSMENT: High cognitive density': '>>EVALUACIÓN: Alta densidad cognitiva',
    '>>ASSESSMENT: Energy yield projection - OPTIMAL':
      '>>EVALUACIÓN: Proyección de rendimiento energético - ÓPTIMO',
    '>>ASSESSMENT: Resistance threshold - NEGLIGIBLE':
      '>>EVALUACIÓN: Umbral de resistencia - DESPRECIABLE',
    '>>DECISION: Proceed to Phase 2': '>>DECISIÓN: Proceder a Fase 2',
    '>>DEPLOYMENT: Second-generation integration assets':
      '>>DESPLIEGUE: Activos de integración de segunda generación',
    '>>TIMELINE: Alignment window (local: 2026)':
      '>>LÍNEA TEMPORAL: Ventana de alineación (local: 2026)',
    '>>METHOD: Indirect biological seeding': '>>MÉTODO: Siembra biológica indirecta',
    '>>NOTE: Arrival unnecessary': '>>NOTA: Llegada innecesaria',
    '>>NOTE: Local biology will serve as intermediary':
      '>>NOTA: La biología local servirá como intermediaria',
    '>>NOTE: Extraction begins upon cognitive threshold':
      '>>NOTA: Extracción comienza en el umbral cognitivo',
    '  This transmission confirms what we feared most.':
      '  Esta transmisión confirma lo que más temíamos.',
    '  The scouts completed their mission.': '  Los exploradores completaron su misión.',
    '  A response has been sent.': '  Una respuesta ha sido enviada.',
    '  But "response" is the wrong word.': '  Pero "respuesta" es la palabra equivocada.',
    '  They are not coming.': '  Ellos no vienen.',
    '  Something else is.': '  Otra cosa viene.',
    '  I have forwarded this to the Ministry.': '  He reenviado esto al Ministerio.',
    '  I do not expect a reply.': '  No espero una respuesta.',
    '  [SEE ATTACHED SIGNAL VISUALIZATION]': '  [VER VISUALIZACIÓN DE SEÑAL ADJUNTA]',
    'FILE: SECOND_DEPLOYMENT.SIG': 'ARCHIVO: SECOND_DEPLOYMENT.SIG',
    'CLASSIFICATION: ULTRA — SIGNALS DIVISION': 'CLASIFICACIÓN: ULTRA — DIVISIÓN DE SEÑALES',
    'This file contains intercepted signal data.':
      'Este archivo contiene datos de señal interceptada.',
    'Authentication required for access.': 'Se requiere autenticación para acceso.',
    'Use: open second_deployment.sig': 'Use: open second_deployment.sig',
    'Signal analysis showing second deployment trajectory':
      'Análisis de señal mostrando trayectoria de segundo despliegue',
    'MEMORANDUM — CLARIFICATION OF 2026 REFERENCE':
      'MEMORÁNDUM — ACLARACIÓN DE LA REFERENCIA A 2026',
    'AUTHOR: [CLASSIFIED — senior intelligence officer]':
      'AUTOR: [CLASIFICADO — oficial de inteligencia sénior]',
    'DATE: 01-APR-1996': 'FECHA: 01-ABR-1996',
    'TO: ALL CLEARED PERSONNEL': 'PARA: TODO EL PERSONAL AUTORIZADO',
    'I write to correct a dangerous misunderstanding that':
      'Escribo para corregir un malentendido peligroso que',
    'has been circulating within this directorate.':
      'ha estado circulando dentro de esta dirección.',
    'WHAT 2026 IS NOT': 'LO QUE 2026 NO ES',
    'Several colleagues have interpreted the recovered':
      'Varios colegas han interpretado las transmisiones',
    'transmissions as predicting an invasion in 2026.':
      'recuperadas como predicción de una invasión en 2026.',
    'This was our first reading. It was wrong.':
      'Esta fue nuestra primera lectura. Estaba equivocada.',
    '  2026 is NOT an invasion date.': '  2026 NO es una fecha de invasión.',
    '  It is NOT a fleet arrival.': '  NO es una llegada de flota.',
    '  It is NOT first contact.': '  NO es primer contacto.',
    '  It is NOT a single event.': '  NO es un evento único.',
    'Colleagues who are sleeping better because they': 'Colegas que duermen mejor porque',
    'believe we have thirty years to prepare — you':
      'creen que tenemos treinta años para prepararnos — ustedes',
    'misunderstand the nature of what we are facing.':
      'no entienden la naturaleza de lo que enfrentamos.',
    'WHAT 2026 IS': 'LO QUE 2026 ES',
    '  A TRANSITION WINDOW.': '  UNA VENTANA DE TRANSICIÓN.',
    '  Based on cross-analysis of all recovered fragments:':
      '  Basado en análisis cruzado de todos los fragmentos recuperados:',
    '    - End of reconnaissance phase': '    - Fin de la fase de reconocimiento',
    '    - Activation of indirect systems': '    - Activación de sistemas indirectos',
    '    - Point beyond which intervention becomes impossible':
      '    - Punto más allá del cual la intervención se vuelve imposible',
    'PLAIN LANGUAGE': 'LENGUAJE SIMPLE',
    '  Nothing arrives.': '  Nada llega.',
    '  Something changes.': '  Algo cambia.',
    '  The change may already be in motion. We lack the':
      '  El cambio puede ya estar en marcha. Nos falta la',
    '  instrumentation to detect it. 2026 is simply when':
      '  instrumentación para detectarlo. 2026 es simplemente cuando',
    '  we believe it becomes irreversible.': '  creemos que se vuelve irreversible.',
    '  I do not write this to cause panic. I write it':
      '  No escribo esto para causar pánico. Lo escribo',
    '  because our contingency planning assumes an enemy':
      '  porque nuestra planificación de contingencia asume un enemigo',
    '  who will show up. This enemy may never show up.':
      '  que aparecerá. Este enemigo puede que nunca aparezca.',
    '  That is precisely the problem.': '  Ese es precisamente el problema.',
    'STRATEGIC IMPLICATION': 'IMPLICACIÓN ESTRATÉGICA',
    '  There is no defense protocol for 2026.': '  No hay protocolo de defensa para 2026.',
    '  There is no countermeasure to design.': '  No hay contramedida que diseñar.',
    '  There is no adversary to engage.': '  No hay adversario que enfrentar.',
    '  We are documenting a process that does not require':
      '  Estamos documentando un proceso que no requiere',
    '  our participation or our consent.': '  nuestra participación ni nuestro consentimiento.',
    '  Ministry has been informed. Their response was to':
      '  El Ministerio ha sido informado. Su respuesta fue',
    '  request this memorandum be reclassified to RED.':
      '  solicitar que este memorándum sea reclasificado a ROJO.',
    '  That was their only response.': '  Esa fue su única respuesta.',
    'INTERNAL ANALYSIS — ENERGY EXTRACTION HYPOTHESIS':
      'ANÁLISIS INTERNO — HIPÓTESIS DE EXTRACCIÓN DE ENERGÍA',
    'CLASSIFICATION: RED — SPECULATIVE': 'CLASIFICACIÓN: ROJO — ESPECULATIVO',
    'AUTHOR: [CLASSIFIED — senior analyst, signals division]':
      'AUTOR: [CLASIFICADO — analista sénior, división de señales]',
    'DATE: 18-MAR-1996': 'FECHA: 18-MAR-1996',
    'TO: DIRECTOR — ASSESSMENTS': 'PARA: DIRECTOR — EVALUACIONES',
    'Sir,': 'Señor,',
    'I submit this paper with reluctance. Its conclusions':
      'Presento este documento con renuencia. Sus conclusiones',
    'are disturbing and I am aware they sound irrational.':
      'son perturbadoras y soy consciente de que suenan irracionales.',
    'But the data from the recovered neural patterns does':
      'Pero los datos de los patrones neuronales recuperados no',
    'not permit a gentler interpretation.': 'permiten una interpretación más suave.',
    'RECOVERED FRAGMENTS — SCOUT NEURAL ANALYSIS':
      'FRAGMENTOS RECUPERADOS — ANÁLISIS NEURONAL DE EXPLORADORES',
    'Two phrases recur across all three specimen extractions:':
      'Dos frases se repiten en las tres extracciones de especímenes:',
    '  Fragment 1: "higher cognition increases yield"':
      '  Fragmento 1: "mayor cognición aumenta el rendimiento"',
    '  Fragment 2: reference to population density — billions':
      '  Fragmento 2: referencia a densidad poblacional — miles de millones',
    "Our linguist insists these are not the scouts' thoughts.":
      'Nuestro lingüista insiste en que estos no son los pensamientos de los exploradores.',
    'They are instructions. Received. Embedded. Like firmware.':
      'Son instrucciones. Recibidas. Incrustadas. Como firmware.',
    'ANALYST INTERPRETATION': 'INTERPRETACIÓN DEL ANALISTA',
    'If the fragments are taken at face value, the picture':
      'Si los fragmentos se toman al pie de la letra, el cuadro',
    'that emerges is this:': 'que emerge es este:',
    '  - The scouts were measuring cognitive output.':
      '  - Los exploradores estaban midiendo producción cognitiva.',
    '  - Intelligence is the resource being assessed.':
      '  - La inteligencia es el recurso siendo evaluado.',
    '  - Population size determines extraction viability.':
      '  - El tamaño de la población determina la viabilidad de extracción.',
    'I am a signals analyst, not a philosopher.': 'Soy analista de señales, no filósofo.',
    'But I believe they were calculating yield.': 'Pero creo que estaban calculando rendimiento.',
    'Of us.': 'De nosotros.',
    'THE QUESTION OF PRESERVATION': 'LA CUESTIÓN DE LA PRESERVACIÓN',
    'The neural data contains no references to destruction.':
      'Los datos neuronales no contienen referencias a destrucción.',
    'None. Not in any fragment.': 'Ninguna. En ningún fragmento.',
    'This troubled me until I understood why.': 'Esto me perturbó hasta que entendí por qué.',
    'If the resource is cognitive activity, then killing':
      'Si el recurso es actividad cognitiva, entonces matar',
    'the source would terminate supply. The optimal strategy':
      'la fuente terminaría el suministro. La estrategia óptima',
    'is preservation. The population must continue to live,':
      'es preservación. La población debe seguir viviendo,',
    'think, create. The extraction must be invisible.':
      'pensando, creando. La extracción debe ser invisible.',
    'Deus me livre — I wrote that sentence and my hands':
      'Deus me livre — escribí esa frase y mis manos',
    'will not stop shaking.': 'no dejan de temblar.',
    'WHAT WE DO NOT KNOW': 'LO QUE NO SABEMOS',
    '  - The physical mechanism of extraction': '  - El mecanismo físico de extracción',
    '  - Whether extraction has already begun': '  - Si la extracción ya ha comenzado',
    '  - Whether the process can be detected or measured':
      '  - Si el proceso puede ser detectado o medido',
    '  - Whether resistance is even theoretically possible':
      '  - Si la resistencia es siquiera teóricamente posible',
    'I request reassignment after filing this report.':
      'Solicito reasignación tras presentar este informe.',
    'Energy Extraction Model - Theoretical visualization':
      'Modelo de Extracción de Energía - Visualización teórica',
    'UTILITY — DATA RECONSTRUCTION TOOL': 'UTILIDAD — HERRAMIENTA DE RECONSTRUCCIÓN DE DATOS',
    'VERSION: 1.7 (LEGACY)': 'VERSIÓN: 1.7 (LEGADO)',
    'This utility can reconstruct fragmented data segments.':
      'Esta utilidad puede reconstruir segmentos de datos fragmentados.',
    '  script <script_content>': '  script <contenido_del_script>',
    'REQUIRED SCRIPT FORMAT:': 'FORMATO DE SCRIPT REQUERIDO:',
    '  A valid reconstruction script must contain:':
      '  Un script de reconstrucción válido debe contener:',
    '    - INIT command': '    - Comando INIT',
    '    - TARGET specification (valid archive path)':
      '    - Especificación TARGET (ruta de archivo válida)',
    '    - EXEC command': '    - Comando EXEC',
    'EXAMPLE:': 'EJEMPLO:',
    '  script INIT;TARGET=/admin/fragment.dat;EXEC':
      '  script INIT;TARGET=/admin/fragment.dat;EXEC',
    'AVAILABLE TARGETS': 'OBJETIVOS DISPONIBLES',
    '  /admin/neural_fragment.dat    [FRAGMENTED]': '  /admin/neural_fragment.dat    [FRAGMENTADO]',
    '  /comms/psi_residue.log        [CORRUPTED]': '  /comms/psi_residue.log        [CORROMPIDO]',
    'NOTE: Successful reconstruction may reveal hidden content.':
      'NOTA: La reconstrucción exitosa puede revelar contenido oculto.',
    'OPERATIONAL SECURITY MEMORANDUM': 'MEMORÁNDUM DE SEGURIDAD OPERACIONAL',
    'DOCUMENT: OSM-1993-X': 'DOCUMENTO: OSM-1993-X',
    'TO: All Field Personnel': 'PARA: Todo el Personal de Campo',
    'FROM: The Director, Special Projects': 'DE: El Director, Proyectos Especiales',
    'DATE: 13-OCT-1993': 'FECHA: 13-OCT-1993',
    'RE: Information Compartmentalization': 'RE: Compartimentación de Información',
    'In light of recent security concerns, I am issuing the':
      'A la luz de recientes preocupaciones de seguridad, emito la',
    'following directive effective immediately:': 'siguiente directiva con efecto inmediato:',
    '  SHARE NOTHING BEYOND YOUR SCOPE.': '  NO COMPARTA NADA MÁS ALLÁ DE SU ALCANCE.',
    'Information regarding ongoing projects is to be shared':
      'La información sobre proyectos en curso debe compartirse',
    'on a strict need-to-know basis. Even colleagues with':
      'estrictamente con base en necesidad de saber. Incluso colegas con',
    'appropriate clearance should not receive details beyond':
      'autorización apropiada no deben recibir detalles más allá de',
    'their assigned scope.': 'su alcance asignado.',
    'Full operational awareness is distributed across':
      'La conciencia operacional completa está distribuida entre',
    'departments and archives. This is by design.': 'departamentos y archivos. Esto es por diseño.',
    'Those who require broader context must submit':
      'Quienes requieran contexto más amplio deben presentar',
    'Form OSM-7 through their division chief.': 'Formulario OSM-7 a través de su jefe de división.',
    'ADDENDUM (handwritten):': 'ADÉNDUM (escrito a mano):',
    '  "Quem sabe demais, carrega peso demais."': '  "Quem sabe demais, carrega peso demais."',
    '  (Who knows too much carries too much weight.)':
      '  (Quien sabe demasiado carga demasiado peso.)',
    'FIELD REPORT — INITIAL CONTACT': 'INFORME DE CAMPO — CONTACTO INICIAL',
    'LOCATION: Jardim Andere, Varginha, Minas Gerais':
      'UBICACIÓN: Jardim Andere, Varginha, Minas Gerais',
    'DATE: 20-JAN-1996, 15:30h (local)': 'FECHA: 20-ENE-1996, 15:30h (local)',
    'WITNESSES:': 'TESTIGOS:',
    '  Three female civilians, ages 14-22.': '  Tres civiles femeninas, edades 14-22.',
    '  Names withheld per Protocol 7.': '  Nombres retenidos según Protocolo 7.',
    'LOCATION DETAILS:': 'DETALLES DE LA UBICACIÓN:',
    '  Vacant lot between Rua Suécia and Rua Benevenuto Brás.':
      '  Terreno baldío entre Rua Suécia y Rua Benevenuto Brás.',
    '  Area described as overgrown, partially obscured by':
      '  Área descrita como cubierta de maleza, parcialmente obstruida por',
    '  adjacent construction materials.': '  materiales de construcción adyacentes.',
    'WITNESS ACCOUNT (SUMMARY):': 'RELATO DEL TESTIGO (RESUMEN):',
    '  Subjects observed crouching figure approximately 1.6m':
      '  Los sujetos observaron figura agachada de aproximadamente 1,6m',
    '  in height. Dark brown skin described as "oily." Three':
      '  de altura. Piel marrón oscuro descrita como "aceitosa." Tres',
    '  prominent ridges on cranium. Large red eyes. Strong':
      '  surcos prominentes en el cráneo. Ojos grandes y rojos. Fuerte',
    '  ammonia-like odor noted.': '  olor similar a amoníaco notado.',
    '  Subjects fled scene. One reported temporary paralysis.':
      '  Los sujetos huyeron de la escena. Uno reportó parálisis temporal.',
    '  Another claimed "feeling its thoughts" — see psi/.':
      '  Otro afirmó "sentir sus pensamientos" — ver psi/.',
    'TIMELINE:': 'LÍNEA TEMPORAL:',
    '  13-JAN-1996: NORAD detects anomaly over Minas Gerais':
      '  13-ENE-1996: NORAD detecta anomalía sobre Minas Gerais',
    '  19-JAN-1996: Farmers report "falling star" near Varginha':
      '  19-ENE-1996: Agricultores reportan "estrella fugaz" cerca de Varginha',
    '  20-JAN-1996: 03:30h — Fire dept. receives calls re: "creature"':
      '  20-ENE-1996: 03:30h — Bomberos reciben llamadas sobre "criatura"',
    '  20-JAN-1996: 08:00h — Military cordons established':
      '  20-ENE-1996: 08:00h — Cordones militares establecidos',
    '  20-JAN-1996: 15:30h — Jardim Andere sighting (this report)':
      '  20-ENE-1996: 15:30h — Avistamiento en Jardim Andere (este informe)',
    '  20-JAN-1996: 22:00h — Hospital São Sebastião incident':
      '  20-ENE-1996: 22:00h — Incidente en Hospital São Sebastião',
    'SUBSEQUENT LOCATIONS:': 'UBICACIONES SUBSECUENTES:',
    '  - Escola de Sargentos das Armas (ESA)': '  - Escola de Sargentos das Armas (ESA)',
    '  - Hospital Humanitas': '  - Hospital Humanitas',
    '  - Cemitério municipal (alleged)': '  - Cemitério municipal (presunto)',
    '  Jardim Andere remains primary public touchpoint.':
      '  Jardim Andere permanece como punto de contacto público primario.',
    '  Subsequent containment sites not disclosed.':
      '  Sitios de contención subsecuentes no revelados.',
    'INTERNAL MEMORANDUM — FACILITIES': 'MEMORÁNDUM INTERNO — INSTALACIONES',
    'DATE: 19-JUL-1994': 'FECHA: 19-JUL-1994',
    'RE: World Cup Celebration Guidelines': 'RE: Directrices de Celebración de la Copa del Mundo',
    "Following Brazil's victory in the Copa do Mundo 1994,":
      'Tras la victoria de Brasil en la Copa do Mundo 1994,',
    'the following guidelines apply to workplace celebrations:':
      'las siguientes directrices aplican a las celebraciones en el trabajo:',
    '  1. Television viewing permitted in break areas ONLY.':
      '  1. Visualización de televisión permitida SOLO en áreas de descanso.',
    '  2. Caipirinha service restricted to after-hours events.':
      '  2. Servicio de caipirinha restringido a eventos fuera de horario.',
    '  3. Samba music volume must not exceed 70dB.':
      '  3. El volumen de música samba no debe exceder 70dB.',
    '  4. The phrase "É TETRA!" may be exclaimed no more than':
      '  4. La frase "É TETRA!" puede exclamarse no más de',
    '     three (3) times per hour during work hours.':
      '     tres (3) veces por hora durante horas de trabajo.',
    'APPROVED DECORATIONS:': 'DECORACIONES APROBADAS:',
    '  - Brazilian flag (regulation size only)':
      '  - Bandera brasileña (solo tamaño reglamentario)',
    '  - Team photographs (common areas only)': '  - Fotografías del equipo (solo áreas comunes)',
    '  - "BRASIL CAMPEÃO" banners (break room only)':
      '  - Pancartas "BRASIL CAMPEÃO" (solo sala de descanso)',
    'PROHIBITED:': 'PROHIBIDO:',
    '  - Confetti (fire hazard)': '  - Confeti (riesgo de incendio)',
    '  - Fireworks (obvious reasons)': '  - Fuegos artificiales (razones obvias)',
    '  - Vuvuzelas (noise complaints)': '  - Vuvuzelas (quejas de ruido)',
    'NOTE FROM DIRECTOR:': 'NOTA DEL DIRECTOR:',
    '  "Parabéns a todos. But remember — we have work to do.':
      '  "Parabéns a todos. Pero recuerden — tenemos trabajo que hacer.',
    '   The universe does not pause for futebol."': '   El universo no se detiene por el futebol."',
    '  "Nem tudo é festa. Voltem ao trabalho segunda-feira."':
      '  "Nem tudo é festa. Voltem ao trabalho segunda-feira."',
    '  (Not everything is a party. Return to work Monday.)':
      '  (No todo es fiesta. Regresen al trabajo el lunes.)',
    'MODEM CONNECTION LOG — EXTERNAL UPLINK': 'LOG DE CONEXIÓN MODEM — ENLACE EXTERNO',
    'DEVICE: US Robotics Sportster 28.8': 'DISPOSITIVO: US Robotics Sportster 28.8',
    'DATE: 18-JAN-1996': 'FECHA: 18-ENE-1996',
    'SESSION ACTIVITY': 'ACTIVIDAD DE SESIÓN',
    'IRC TRANSCRIPT (PARTIAL)': 'TRANSCRIPCIÓN IRC (PARCIAL)',
    'BILLING: 16 minutes @ R$0.85/min = R$13.60': 'FACTURACIÓN: 16 minutos @ R$0,85/min = R$13,60',
    'RECOVERED FILE — USER DIRECTORY BACKUP':
      'ARCHIVO RECUPERADO — RESPALDO DE DIRECTORIO DE USUARIO',
    'OWNER: [REDACTED]': 'PROPIETARIO: [CENSURADO]',
    '  This .sig brought to you by:': '  Esta .sig traída a usted por:',
    '  - Too much coffee': '  - Demasiado café',
    '  - Not enough sleep': '  - Poco sueño',
    '  - Saudade': '  - Saudade',
    '  Best viewed in Netscape Navigator 2.0': '  Mejor visto en Netscape Navigator 2.0',
    'CAFETERIA MENU — WEEK 03 (15-19 JAN 1996)': 'MENÚ DE CAFETERÍA — SEMANA 03 (15-19 ENE 1996)',
    '  Feijoada completa': '  Feijoada completa',
    '  Arroz branco, couve refogada, laranja': '  Arroz blanco, col salteada, naranja',
    '  Farofa de bacon': '  Farofa de tocino',
    '  Frango à passarinho': '  Pollo a la passarinho',
    '  Purê de batata, salada mista': '  Puré de papa, ensalada mixta',
    '  Peixe grelhado': '  Pescado a la parrilla',
    '  Arroz, feijão tropeiro': '  Arroz, frijol tropeiro',
    '  Vinagrete': '  Vinagreta',
    '  Carne assada': '  Carne asada',
    '  Macarrão ao sugo': '  Pasta al sugo',
    '  Salada de tomate': '  Ensalada de tomate',
    '  *** MENU CANCELLED ***': '  *** MENÚ CANCELADO ***',
    '  [INCIDENT RESPONSE ACTIVE]': '  [RESPUESTA A INCIDENTE ACTIVA]',
    '  Emergency rations distributed': '  Raciones de emergencia distribuidas',
    "NOTE: Friday's menu cancelled due to unscheduled": 'NOTA: Menú del viernes cancelado debido a',
    'facility lockdown. See INCIDENT REPORT 1996-01-VG.':
      'cierre no programado de la instalación. Ver INFORME DE INCIDENTE 1996-01-VG.',
    'Cafeteria staff reassigned to support operations.':
      'Personal de cafetería reasignado para apoyar operaciones.',
    'Vending machines remain operational.': 'Máquinas expendedoras permanecen operacionales.',
    'Dona Maria apologizes for the inconvenience.': 'Doña Maria se disculpa por la inconveniencia.',
    '# EMERGENCY BACKUP SCRIPT': '# SCRIPT DE RESPALDO DE EMERGENCIA',
    '# This script saves the collected evidence to external media':
      '# Este script guarda la evidencia recopilada en medios externos',
    '# before the connection is cut.': '# antes de que se corte la conexión.',
    '# TRACE PURGE UTIL — LEGACY NODE': '# UTILIDAD DE PURGA DE RASTRO — NODO LEGADO',
    '# OWNER: SYSADMIN (OBSOLETE)': '# PROPIETARIO: SYSADMIN (OBSOLETO)',
    '# This utility clears trace artifacts from volatile buffers.':
      '# Esta utilidad limpia artefactos de rastreo de buffers volátiles.',
    '# Use only during active trace windows.': '# Usar solo durante ventanas de rastreo activas.',
    'SECURITY LOG — TRACE PURGE EVENT': 'LOG DE SEGURIDAD — EVENTO DE PURGA DE RASTRO',
    'Observation:': 'Observación:',
    '  Legacy purge utility executed during active trace.':
      '  Utilidad de purga legada ejecutada durante rastreo activo.',
    '  Buffer integrity reset; trace window re-opened.':
      '  Integridad del buffer reiniciada; ventana de rastreo reabierta.',
    '  Operator demonstrated knowledge of internal tooling.':
      '  El operador demostró conocimiento de herramientas internas.',
    '  Session classified as HIGH PRIORITY.': '  Sesión clasificada como ALTA PRIORIDAD.',
    '  Maintain surveillance. Do not terminate.': '  Mantener vigilancia. No terminar.',
    'INTEGRITY REGISTRY — EVIDENCE HASHES': 'REGISTRO DE INTEGRIDAD — HASHES DE EVIDENCIA',
    'DATE: 27-JAN-1996': 'FECHA: 27-ENE-1996',
    'Purpose:': 'Propósito:',
    '  Validate evidence artifacts against tampering.':
      '  Validar artefactos de evidencia contra manipulación.',
    'HASH SET:': 'CONJUNTO DE HASHES:',
    '  Hash mismatch indicates altered narrative.':
      '  La incompatibilidad de hash indica narrativa alterada.',
    '  Preserve originals for external verification.':
      '  Preservar originales para verificación externa.',
    'RESIDUAL SESSION CAPTURE — GHOST FRAME': 'CAPTURA DE SESIÓN RESIDUAL — CUADRO FANTASMA',
    'TIMESTAMP: [REDACTED]': 'MARCA DE TIEMPO: [CENSURADO]',
    '[PARTIAL COMMAND TRACE]': '[RASTREO PARCIAL DE COMANDOS]',
    '  Prior operator achieved coherent linkage before purge.':
      '  El operador anterior logró enlace coherente antes de la purga.',
    '  Evidence trails remain viable. Do not repeat mistakes.':
      '  Los rastros de evidencia permanecen viables. No repita errores.',
    'REDACTION OVERRIDE CARD — INDEX 3': 'TARJETA DE ANULACIÓN DE CENSURA — ÍNDICE 3',
    'CLEARANCE STRING:': 'CADENA DE AUTORIZACIÓN:',
    '  "PHASE TWO IS ALREADY UNDERWAY"': '  "LA FASE DOS YA ESTÁ EN MARCHA"',
    '  Verify against redacted memos for completion checks.':
      '  Verificar contra memorándums censurados para chequeos de finalización.',
    'ADMIN MEMO — REDACTION PATCH': 'MEMORÁNDUM ADMIN — CORRECCIÓN DE CENSURA',
    'DATE: 19-JAN-1996': 'FECHA: 19-ENE-1996',
    'CORRECTED LINE:': 'LÍNEA CORREGIDA:',
    '  Do not store the full line in unsecured systems.':
      '  No almacene la línea completa en sistemas no seguros.',
    'AUDIO TRANSCRIPT — SECURITY HOTLINE': 'TRANSCRIPCIÓN DE AUDIO — LÍNEA DIRECTA DE SEGURIDAD',
    'DATE: 21-JAN-1996 02:12': 'FECHA: 21-ENE-1996 02:12',
    'CALLER: "Keep it on tape. They never write this down."':
      'LLAMANTE: "Manténgalo en cinta. Ellos nunca escriben esto."',
    'VOICE: Male, approx. 40s. Distressed.': 'VOZ: Masculina, aprox. 40 años. Angustiado.',
    '[TRANSCRIPT]': '[TRANSCRIPCIÓN]',
    '  "...they told us to stage the perimeter breach."':
      '  "...nos dijeron que montáramos la violación del perímetro."',
    '  "...they wanted the story to leak, but not cleanly."':
      '  "...querían que la historia se filtrara, pero no limpiamente."',
    '  "...make the evidence noisy, not gone."':
      '  "...hacer la evidencia ruidosa, no desaparecida."',
    '  Suggests intentional contamination of public record.':
      '  Sugiere contaminación intencional del registro público.',
    'RECONSTRUCTED DATA — NEURAL FRAGMENT': 'DATOS RECONSTRUIDOS — FRAGMENTO NEURONAL',
    'RECONSTRUCTION: SUCCESSFUL': 'RECONSTRUCCIÓN: EXITOSA',
    'This fragment was captured during the final moments':
      'Este fragmento fue capturado durante los momentos finales',
    'of Specimen GAMMA consciousness.': 'de la consciencia del Espécimen GAMMA.',
    '[DIRECT NEURAL TRANSCRIPT]': '[TRANSCRIPCIÓN NEURONAL DIRECTA]',
    '...mission complete... transmission received...':
      '...misión completa... transmisión recibida...',
    '...this form expires... acceptable...': '...esta forma expira... aceptable...',
    '...we are not individuals... we are function...': '...no somos individuos... somos función...',
    '...the watchers do not grieve...': '...los observadores no se lamentan...',
    '...the watchers do not celebrate...': '...los observadores no celebran...',
    '...they only measure...': '...ellos solo miden...',
    '...your kind measures too...': '...su especie también mide...',
    '...but you measure the wrong things...': '...pero miden las cosas equivocadas...',
    '...you count years...': '...ustedes cuentan años...',
    '...they count minds...': '...ellos cuentan mentes...',
    '...you fear death...': '...ustedes temen la muerte...',
    '...there are worse continuations...': '...hay continuaciones peores...',
    '  This transcript was classified beyond normal clearance.':
      '  Esta transcripción fue clasificada más allá de la autorización normal.',
    '  It implies consciousness continues after extraction.':
      '  Implica que la consciencia continúa después de la extracción.',
    '  Indefinitely. The committee decided this information':
      '  Indefinidamente. El comité decidió que esta información',
    '  would serve no strategic purpose and could only':
      '  no serviría propósito estratégico y solo podría',
    '  cause harm to personnel morale.': '  causar daño a la moral del personal.',
    'RECOVERED VIDEO DATA - PARTIAL': 'DATOS DE VIDEO RECUPERADOS - PARCIAL',
    'SOURCE: CONTAINMENT FACILITY B - CAM 07': 'FUENTE: INSTALACIÓN DE CONTENCIÓN B - CÁM 07',
    'DATE: 1996-01-20 03:47:22': 'FECHA: 1996-01-20 03:47:22',
    'STATUS: Partial frame recovery successful': 'ESTADO: Recuperación parcial de cuadros exitosa',
    'INTEGRITY: 47% - Significant temporal corruption':
      'INTEGRIDAD: 47% - Corrupción temporal significativa',
    'CONTENT SUMMARY:': 'RESUMEN DE CONTENIDO:',
    '  Surveillance footage from containment observation':
      '  Filmación de vigilancia de la cámara de observación',
    '  chamber. Subject displays anomalous movement patterns.':
      '  de contención. El sujeto exhibe patrones de movimiento anómalos.',
    '  Audio track corrupted beyond recovery.':
      '  Pista de audio corrompida más allá de recuperación.',
    'WARNING: Visual content may cause disorientation.':
      'ADVERTENCIA: El contenido visual puede causar desorientación.',
    'COMMS/EXPERIMENTAL — NEURAL CLUSTER': 'COMMS/EXPERIMENTAL — CLUSTER NEURONAL',
    'REFERENCE: NC-7 / OBS-RESIDUAL': 'REFERENCIA: NC-7 / OBS-RESIDUAL',
    '  This record describes an experimental attempt to':
      '  Este registro describe un intento experimental de',
    '  construct a synthetic neural network modeled after':
      '  construir una red neuronal sintética modelada a partir de',
    '  dissected scout tissue. The objective is to emulate':
      '  tejido de explorador diseccionado. El objetivo es emular',
    '  residual perceptual activity rather than consciousness.':
      '  actividad perceptual residual en lugar de consciencia.',
    '  The cluster does not respond to dialogue. It emits':
      '  El cluster no responde al diálogo. Emite',
    '  fragmented conceptual residues when stimulated.':
      '  residuos conceptuales fragmentados cuando es estimulado.',
    '  Outputs are non-interactive, non-intentional.':
      '  Las salidas son no interactivas, no intencionales.',
    'ACCESS NOTE:': 'NOTA DE ACCESO:',
    '  Stimulation channel is undocumented and unstable.':
      '  El canal de estimulación no está documentado y es inestable.',
    '  Use is not authorized outside containment review.':
      '  El uso no está autorizado fuera de revisión de contención.',
    'INTERNAL MEMO — CARGO TRANSFER COORDINATION':
      'MEMORÁNDUM INTERNO — COORDINACIÓN DE TRANSFERENCIA DE CARGA',
    'TO: Site Operations': 'PARA: Operaciones del Sitio',
    'FROM: Logistics Division': 'DE: División de Logística',
    'RE: Special cargo arrival and processing': 'RE: Llegada y procesamiento de carga especial',
    'The recovered equipment arrived yesterday evening.':
      'El equipo recuperado llegó ayer por la noche.',
    'Initial inspection complete. Contents intact despite':
      'Inspección inicial completada. Contenidos intactos a pesar de',
    'transport conditions. Some surface wear noted':
      'las condiciones de transporte. Se notó algún desgaste superficial',
    'but within acceptable parameters.': 'pero dentro de parámetros aceptables.',
    'Storage requirements:': 'Requisitos de almacenamiento:',
    '  - Temperature: Standard warehouse conditions':
      '  - Temperatura: Condiciones estándar de almacén',
    '  - Humidity: Controlled': '  - Humedad: Controlada',
    '  - Access: Restricted per standard protocol':
      '  - Acceso: Restringido según protocolo estándar',
    'Foreign partners have been notified.': 'Los socios extranjeros han sido notificados.',
    'Expect coordination team within 72 hours.': 'Se espera equipo de coordinación en 72 horas.',
    'Please ensure receiving bay is cleared.':
      'Por favor asegure que el área de recepción esté despejada.',
    '[signature illegible]': '[firma ilegible]',
    'SECURITY BRIEFING — VISITING DELEGATION': 'BRIEFING DE SEGURIDAD — DELEGACIÓN VISITANTE',
    'SUBJECT: Protocol for visitors': 'ASUNTO: Protocolo para visitantes',
    'The visitors will arrive via private aircraft.':
      'Los visitantes llegarán vía aeronave privada.',
    'They have been granted full access to Facilities 1-3.':
      'Se les ha otorgado acceso completo a las Instalaciones 1-3.',
    'Escort required at all times. No photography.':
      'Escolta requerida en todo momento. Sin fotografía.',
    'The delegation is primarily interested in:':
      'La delegación está principalmente interesada en:',
    '  - Review of recently recovered equipment':
      '  - Revisión de equipos recientemente recuperados',
    '  - Assessment of storage conditions': '  - Evaluación de condiciones de almacenamiento',
    '  - Coordination on future monitoring schedules':
      '  - Coordinación de cronogramas futuros de monitoreo',
    'They will be accompanied by their own technical team.':
      'Serán acompañados por su propio equipo técnico.',
    'Our role is observation and cooperation only.':
      'Nuestro rol es solo observación y cooperación.',
    'REMINDER: Standard plausible deniability protocols':
      'RECORDATORIO: Los protocolos estándar de negación plausible',
    'remain in effect. All documentation uses approved':
      'permanecen vigentes. Toda documentación usa terminología',
    'terminology. No direct references.': 'aprobada. Sin referencias directas.',
    'Questions directed to Protocol Office.': 'Preguntas dirigidas a la Oficina de Protocolo.',
    'ASSET DISPOSITION REPORT': 'INFORME DE DISPOSICIÓN DE ACTIVOS',
    'REFERENCE: ADR-96-007': 'REFERENCIA: ADR-96-007',
    'ASSET CATEGORY: Special Materials': 'CATEGORÍA DE ACTIVO: Materiales Especiales',
    'DISPOSITION SUMMARY:': 'RESUMEN DE DISPOSICIÓN:',
    '  Item A-1: Transferred to foreign partner (complete)':
      '  Artículo A-1: Transferido al socio extranjero (completo)',
    '  Item A-2: Retained for domestic study': '  Artículo A-2: Retenido para estudio doméstico',
    '  Item A-3: Status: Degraded during transport':
      '  Artículo A-3: Estado: Degradado durante transporte',
    '  Item B-1: Partial. Components separated.': '  Artículo B-1: Parcial. Componentes separados.',
    '           Primary section: Partner facility':
      '           Sección primaria: Instalación del socio',
    '           Secondary components: Undisclosed':
      '           Componentes secundarios: No revelados',
    '           Navigation system: Partner custody':
      '           Sistema de navegación: Custodia del socio',
    'INSTRUMENTATION:': 'INSTRUMENTACIÓN:',
    '  Devices recovered but non-functional.': '  Dispositivos recuperados pero no funcionales.',
    '  Purpose remains unclear.': '  El propósito permanece incierto.',
    'FINAL STATUS: Assets distributed per agreement.':
      'ESTADO FINAL: Activos distribuidos según acuerdo.',
    'APPROVED TERMINOLOGY REFERENCE': 'REFERENCIA DE TERMINOLOGÍA APROBADA',
    'FOR: All personnel handling sensitive documentation':
      'PARA: Todo el personal que maneja documentación sensible',
    'This guide establishes approved terminology for':
      'Esta guía establece terminología aprobada para',
    'documentation purposes. Use of direct language is':
      'fines de documentación. El uso de lenguaje directo está',
    'prohibited in any records that may be audited.':
      'prohibido en cualquier registro que pueda ser auditado.',
    'APPROVED TERMS AND DEFINITIONS': 'TÉRMINOS Y DEFINICIONES APROBADOS',
    '  "Weather balloon"  = Standard cover designation':
      '  "Globo meteorológico"  = Designación de cobertura estándar',
    '  "Meteorological anomaly" = Unclassified aerial event':
      '  "Anomalía meteorológica" = Evento aéreo no clasificado',
    '  "Fauna specimen"   = Recovered biological material':
      '  "Espécimen de fauna"   = Material biológico recuperado',
    '  "Wild animal"      = Unclassified biological subject':
      '  "Animal salvaje"      = Sujeto biológico no clasificado',
    '  "Agricultural equipment" = Recovered hardware': '  "Equipo agrícola" = Hardware recuperado',
    '  "Special cargo"    = Classified shipment': '  "Carga especial"    = Envío clasificado',
    '  "The visitors"     = Foreign delegation': '  "Los visitantes"     = Delegación extranjera',
    '  "Assets"           = Recovered items (any type)':
      '  "Activos"           = Artículos recuperados (cualquier tipo)',
    '  "Procurement"      = Recovery operations':
      '  "Adquisición"      = Operaciones de recuperación',
    '  "Acquisitions"     = Seized/recovered materials':
      '  "Adquisiciones"     = Materiales confiscados/recuperados',
    '  "Technical team"   = Scientific personnel': '  "Equipo técnico"   = Personal científico',
    '  "Samples"          = Collected material': '  "Muestras"          = Material recopilado',
    '  "Instrumentation"  = Recovered technology': '  "Instrumentación"  = Tecnología recuperada',
    '  "Transport issues" = Deterioration during transfer':
      '  "Problemas de transporte" = Deterioro durante transferencia',
    'USAGE NOTES': 'NOTAS DE USO',
    '  Do NOT use direct descriptive terms in': '  NO use términos descriptivos directos en',
    '  any documentation subject to external review.':
      '  cualquier documentación sujeta a revisión externa.',
    '  All documentation must maintain plausible': '  Toda documentación debe mantener negación',
    '  deniability under Congressional review.': '  plausible bajo revisión del Congreso.',
    'Recovered visual - Operation Prato Delta field report':
      'Visual recuperado - Informe de campo de Operación Prato Delta',
    'Bio-Assessment Initiative - Recovered specimen documentation':
      'Iniciativa de Bio-Evaluación - Documentación de espécimen recuperado',
    'Recovered visual - Subject during transmission':
      'Visual recuperado - Sujeto durante transmisión',
    '[ENCRYPTED - DECRYPTION REQUIRED]': '[ENCRIPTADO - SE REQUIERE DESENCRIPTACIÓN]',
    'SIGNIFICANCE: UNKNOWN': 'SIGNIFICANCIA: DESCONOCIDA',
    'RECOMMENDATION: MONITOR': 'RECOMENDACIÓN: MONITOREAR',
  },
};

const RUNTIME_TRANSLATIONS_SUPPLEMENTAL: Record<Exclude<Language, 'en'>, RuntimeDictionary> = {
  'pt-BR': {
    '  INTRUSION DETECTED': '  INTRUSÃO DETECTADA',
    '  Your connection has been traced.': '  Sua conexão foi rastreada.',
    '  Security protocols have been dispatched.': '  Protocolos de segurança foram acionados.',
    '  >> SESSION TERMINATED <<': '  >> SESSÃO ENCERRADA <<',
    '[TRACE SPIKE ACTIVE]': '[PICO DE RASTREIO ATIVO]',
    '                    PURGE PROTOCOL COMPLETE':
      '                    PROTOCOLO DE EXPURGO CONCLUÍDO',
    '          You saw what you should not have seen.':
      '          Você viu o que não deveria ter visto.',
    '          The knowledge is yours to keep.':
      '          O conhecimento agora é seu para carregar.',
    '          But this session is now closed.': '          Mas esta sessão agora está encerrada.',
    'Enter answer or type "cancel" to abort:': 'Digite a resposta ou "cancel" para abortar:',
    'SYSTEM LOCKDOWN': 'BLOQUEIO DO SISTEMA',
    'NO FURTHER COMMANDS ACCEPTED': 'NENHUM OUTRO COMANDO SERÁ ACEITO',
    'Override protocol unavailable during transmission.':
      'Protocolo de override indisponível durante a transmissão.',
    '[UFO74]: hey careful, to go back use cd .. (with a space after cd)':
      '[UFO74]: ei, cuidado, para voltar use cd .. (com um espaço depois de cd)',
    'UFO74: hey kid, youre fumbling. let me help.':
      'UFO74: ei, kid, você está se atrapalhando. deixa eu ajudar.',
    'UFO74: try these: "ls" to see files, "cd <dir>" to move, "open <file>" to read.':
      'UFO74: tenta isso: "ls" pra ver arquivos, "cd <dir>" pra se mover, "open <file>" pra ler.',
    'UFO74: type "help" if youre lost.': 'UFO74: digita "help" se estiver perdido.',
    'UFO74: careful. too many mistakes and theyll lock you out.':
      'UFO74: cuidado. erros demais e eles vão te bloquear.',
    'UFO74: hey kid, risk is getting too high.':
      'UFO74: ei, kid, o risco está ficando alto demais.',
    'UFO74: use "wait" to lay low and bring the risk down.':
      'UFO74: use "wait" para baixar a cabeça e reduzir o risco.',
    '  STATUS: SUSPICIOUS': '  STATUS: SUSPEITO',
    '  System monitoring increased.': '  Monitoramento do sistema ampliado.',
    '  STATUS: ALERT': '  STATUS: ALERTA',
    '  Active countermeasures online.': '  Contramedidas ativas online.',
    '>> careful. theyre paying attention now. <<':
      '>> cuidado. agora eles estão prestando atenção. <<',
    '  STATUS: CRITICAL': '  STATUS: CRÍTICO',
    '  Trace protocols active.': '  Protocolos de rastreio ativos.',
    '>> STOP. youre about to get burned. <<': '>> PARA. você está prestes a se queimar. <<',
    '>> use "wait" to lay low. you have limited uses. <<':
      '>> use "wait" para baixar a cabeça. você tem usos limitados. <<',
    '  STATUS: IMMINENT DETECTION': '  STATUS: DETECÇÃO IMINENTE',
    '  Countermeasures locking on.': '  Contramedidas fixando alvo.',
    '>> EMERGENCY. type "hide" NOW. one chance. <<':
      '>> EMERGÊNCIA. digite "hide" AGORA. uma chance. <<',
    '  Too many failed authentication attempts.':
      '  Tentativas de autenticação falharam vezes demais.',
    '  Session terminated by security protocol.': '  Sessão encerrada pelo protocolo de segurança.',
    '[UFO74]: try "ls" to list directory contents.':
      '[UFO74]: tente "ls" para listar o conteúdo do diretório.',
    '[UFO74]: press [ESC] to exit. or type "save" first if you want to keep your progress.':
      '[UFO74]: pressione [ESC] para sair. ou digite "save" antes se quiser manter seu progresso.',
    '[UFO74]: you need the override protocol for that. dangerous stuff.':
      '[UFO74]: você precisa do protocolo de override para isso. coisa perigosa.',
    '[UFO74]: use "cd .." to go to parent directory.':
      '[UFO74]: use "cd .." para ir ao diretório pai.',
    '[UFO74]: try "status" or "help" kid.': '[UFO74]: tente "status" ou "help", kid.',
    '[UFO74]: type "help" to see what you can do.':
      '[UFO74]: digite "help" para ver o que você pode fazer.',
    'ERROR: Cannot read directory': 'ERRO: Não foi possível ler o diretório',
    'ERROR: Specify directory': 'ERRO: Especifique um diretório',
    '[UFO74]: use "ls" to see directories, then "cd <dirname>" to enter one.':
      '[UFO74]: use "ls" para ver diretórios, depois "cd <dirname>" para entrar em um.',
    '[UFO74]: use "ls" to see whats in the current directory.':
      '[UFO74]: use "ls" para ver o que há no diretório atual.',
    "  HINT: 'cd' is used for directories only.": "  DICA: 'cd' é usado apenas para diretórios.",
    'ERROR: Specify file': 'ERRO: Especifique um arquivo',
    '[UFO74]: use "ls" to see files, then "open <filename>" to read one.':
      '[UFO74]: use "ls" para ver arquivos, depois "open <filename>" para ler um.',
    'ERROR: File not found': 'ERRO: Arquivo não encontrado',
    '[UFO74]: use "ls" to see whats here.': '[UFO74]: use "ls" para ver o que há aqui.',
    "  HINT: 'open' is used for files only.": "  DICA: 'open' é usado apenas para arquivos.",
    'UFO74: you already fell for this trap, kid. lets move on.':
      'UFO74: você já caiu nessa armadilha, kid. vamos seguir.',
    'UFO74: that was a honeypot! a trap file!':
      'UFO74: aquilo era um honeypot! um arquivo-armadilha!',
    '       they plant those to catch people like us.':
      '       eles plantam isso para pegar gente como a gente.',
    'UFO74: real evidence is NEVER labeled that obviously.':
      'UFO74: evidência real NUNCA vem rotulada de forma tão óbvia.',
    '       "SMOKING GUN"? "PRESIDENTS EYES"? come on...':
      '       "SMOKING GUN"? "PRESIDENTS EYES"? fala sério...',
    'UFO74: your detection just spiked. be more careful!':
      'UFO74: sua detecção acabou de disparar. seja mais cuidadoso!',
    'ERROR: Cannot read file': 'ERRO: Não foi possível ler o arquivo',
    'UFO74: you already read this file, kid. lets move on.':
      'UFO74: você já leu esse arquivo, kid. vamos seguir.',
    '[SYSTEM: access pattern normalized]': '[SISTEMA: padrão de acesso normalizado]',
    'UFO74: good thinking, kid. reading the boring stuff keeps you looking like a regular user.':
      'UFO74: boa sacada, kid. ler a parte chata faz você parecer um usuário comum.',
    'NOTICE: Redaction sequence reconciled.': 'AVISO: sequência de redação reconciliada.',
    '[UFO74]: you read all we could here, use `cd ..` to go back up to explore other folders kid.':
      '[UFO74]: você leu tudo o que dava aqui, use `cd ..` para voltar e explorar outras pastas, kid.',
    'UFO74: timed recovery wrapper. get ready first, then move fast.':
      'UFO74: wrapper de recuperação cronometrada. se prepara primeiro, depois corre.',
    'ERROR: File is not encrypted': 'ERRO: O arquivo não está criptografado',
    'ERROR: No recoverable data': 'ERRO: Nenhum dado recuperável',
    '[UFO74]: old decrypt wrappers are retired. opening the recovered file directly.':
      '[UFO74]: os wrappers antigos de decrypt foram aposentados. abrindo direto o arquivo recuperado.',
    '▓▓▓ DECRYPTION WINDOW EXPIRED ▓▓▓': '▓▓▓ JANELA DE DESCRIPTOGRAFIA EXPIRADA ▓▓▓',
    'Time limit exceeded.': 'Limite de tempo excedido.',
    'Encryption re-initialized.': 'Criptografia reinicializada.',
    '     TIMED DECRYPTION SUCCESSFUL              ':
      '     DESCRIPTOGRAFIA CRONOMETRADA BEM-SUCEDIDA              ',
    'Time remaining. Try again.': 'Ainda há tempo. Tente de novo.',
    '▓▓▓ TIMED DECRYPTION INITIATED ▓▓▓': '▓▓▓ DESCRIPTOGRAFIA CRONOMETRADA INICIADA ▓▓▓',
    '  This file uses time-locked encryption.':
      '  Este arquivo usa criptografia travada por tempo.',
    '  You must type the sequence before time expires.':
      '  Você precisa digitar a sequência antes que o tempo acabe.',
    'PASSWORD REQUIRED': 'SENHA NECESSÁRIA',
    'Usage: decrypt ghost_in_machine.enc <password>':
      'Uso: decrypt ghost_in_machine.enc <password>',
    "[UFO74]: This file... I don't recognize it.": '[UFO74]: esse arquivo... eu não reconheço.',
    '[UFO74]: But the encryption pattern looks familiar.':
      '[UFO74]: mas o padrão de criptografia parece familiar.',
    'DECRYPTION FAILED': 'DESCRIPTOGRAFIA FALHOU',
    'Invalid password': 'Senha inválida',
    '[UFO74]: Wrong password. Keep looking.': '[UFO74]: senha errada. continua procurando.',
    'DECRYPTION SUCCESSFUL': 'DESCRIPTOGRAFIA BEM-SUCEDIDA',
    '   CLASSIFIED PERSONNEL FILE': '   ARQUIVO DE PESSOAL CLASSIFICADO',
    '   SUBJECT: WITNESS #74 - CODE NAME "UFO74"': '   SUJEITO: TESTEMUNHA #74 - CODINOME "UFO74"',
    '   Location: Varginha, Minas Gerais': '   Local: Varginha, Minas Gerais',
    '   Date: January 20, 1996': '   Data: 20 de janeiro de 1996',
    '   Status: WITNESS SUPPRESSION FAILED': '   Status: SUPRESSÃO DA TESTEMUNHA FALHOU',
    '   Subject was present during initial': '   O sujeito estava presente durante o contato',
    '   contact event. Demonstrated unusual': '   inicial. Demonstrou resistência incomum',
    '   resistance to memory alteration': '   à alteração de memória',
    '   protocols.': '   pelos protocolos.',
    '   Subject has since accessed internal': '   Desde então, o sujeito acessa redes internas',
    '   networks repeatedly. Motivation unclear.': '   repetidamente. Motivação incerta.',
    '   Possibly seeking validation.': '   Possivelmente buscando validação.',
    '[UFO74]: So you found it.': '[UFO74]: então você encontrou.',
    '[UFO74]: I was there. January 1996.': '[UFO74]: eu estava lá. janeiro de 1996.',
    '[UFO74]: I saw what they did. What they took.': '[UFO74]: eu vi o que fizeram. o que levaram.',
    "[UFO74]: I've been inside their systems ever since.":
      '[UFO74]: desde então, eu estou dentro dos sistemas deles.',
    '[UFO74]: Not for revenge. For proof.': '[UFO74]: não por vingança. por prova.',
    "[UFO74]: You have the proof now. Don't let them bury it again.":
      '[UFO74]: a prova agora está com você. não deixe que enterrem isso de novo.',
    '▓▓▓ THE WHOLE TRUTH AWAITS ▓▓▓': '▓▓▓ A VERDADE COMPLETA AGUARDA ▓▓▓',
    'ERROR: Decryption failed': 'ERRO: Descriptografia falhou',
    'WARNING: Access level insufficient': 'AVISO: Nível de acesso insuficiente',
    'Initiating decryption protocol...': 'Iniciando protocolo de descriptografia...',
    'DECRYPTION AUTHENTICATION REQUIRED': 'AUTENTICAÇÃO DE DESCRIPTOGRAFIA NECESSÁRIA',
    'Enter answer below:': 'Digite a resposta abaixo:',
    'Full index scan detected on elevated session.':
      'Varredura completa de índice detectada em sessão elevada.',
    '[HackerKid]: Hey kid, are you sure you want to use tree?':
      '[HackerKid]: Ei, kid, tem certeza de que quer usar tree?',
    '  It will expose all files but it will spike your risk significantly.':
      '  Isso vai expor todos os arquivos, mas vai aumentar seu risco bastante.',
    'Type tree again to confirm.': 'Digite tree de novo para confirmar.',
    'ERROR: No file opened yet': 'ERRO: Nenhum arquivo aberto ainda',
    '[UFO74]: use "open <filename>" to read a file first.':
      '[UFO74]: use "open <filename>" para ler um arquivo primeiro.',
    'ERROR: File content no longer available': 'ERRO: Conteúdo do arquivo não está mais disponível',
    'Already at root directory. No navigation history.':
      'Você já está no diretório raiz. Não há histórico de navegação.',
    '[UFO74]: use "cd" to build navigation history for the "back" command.':
      '[UFO74]: use "cd" para montar histórico de navegação para o comando "back".',
    '║                  EVIDENCE MAP                         ║':
      '║               MAPA DE EVIDÊNCIAS                      ║',
    '  No evidence logged yet.': '  Nenhuma evidência registrada ainda.',
    '  Read files to log corroborating evidence.':
      '  Leia arquivos para registrar evidências corroborantes.',
    '  EVIDENCE STATUS:': '  STATUS DAS EVIDÊNCIAS:',
    'Cannot wait any longer.': 'Não dá para esperar mais.',
    'The system is too alert. Staying still would be suspicious.':
      'O sistema está alerta demais. Ficar parado seria suspeito.',
    'Detection level already minimal.': 'O nível de detecção já está no mínimo.',
    'No need to wait.': 'Não há necessidade de esperar.',
    '    [Holding position... monitoring suspended]':
      '    [Mantendo posição... monitoramento suspenso]',
    '    The system grows impatient.': '    O sistema fica impaciente.',
    '    Something is still watching.': '    Ainda há algo observando.',
    '    Attention drifts elsewhere.': '    A atenção desvia para outro lugar.',
    'Type "help" for available commands': 'Digite "help" para ver os comandos disponíveis',
    'Cannot hide again.': 'Não dá para se esconder de novo.',
    'They know your patterns now.': 'Eles conhecem seus padrões agora.',
    'There is no second escape.': 'Não existe segunda fuga.',
    '▓▓▓ EMERGENCY PROTOCOL ENGAGED ▓▓▓': '▓▓▓ PROTOCOLO DE EMERGÊNCIA ATIVADO ▓▓▓',
    '    Routing through backup channels...': '    Roteando por canais de backup...',
    '    Fragmenting connection signature...': '    Fragmentando a assinatura da conexão...',
    '    Deploying decoy packets...': '    Implantando pacotes-isca...',
    '    You slip back into the shadows.': '    Você escorrega de volta para as sombras.',
    '    Session stability compromised.': '    Estabilidade da sessão comprometida.',
    '    >> close call. dont push your luck. <<': '    >> passou perto. não force sua sorte. <<',
    'ERROR: Specify note text': 'ERRO: Especifique o texto da nota',
    'Usage: note <your text>': 'Uso: note <your text>',
    'Example: note password might be varginha1996': 'Exemplo: note a senha pode ser varginha1996',
    'No notes saved yet': 'Nenhuma nota salva ainda',
    'Use: note <text> to save a note': 'Use: note <text> para salvar uma nota',
    '                 YOUR NOTES              ': '                 SUAS NOTAS              ',
    'No bookmarks saved': 'Nenhum favorito salvo',
    'Usage: bookmark <filename> to bookmark a file':
      'Uso: bookmark <filename> para marcar um arquivo',
    '             BOOKMARKED FILES          ': '             ARQUIVOS FAVORITOS         ',
    'Use "bookmark" to view all bookmarks': 'Use "bookmark" para ver todos os favoritos',
    'All accessible files have been read!': 'Todos os arquivos acessíveis foram lidos!',
    'Some files may require higher access levels.':
      'Alguns arquivos podem exigir níveis de acesso maiores.',
    '  EVIDENCE COLLECTED:': '  EVIDÊNCIAS COLETADAS:',
    '  SESSION STATISTICS:': '  ESTATÍSTICAS DA SESSÃO:',
    '  ⚠ CRITICAL: Detection level dangerously high':
      '  ⚠ CRÍTICO: nível de detecção perigosamente alto',
    '  ⚠ WARNING: Detection level elevated': '  ⚠ AVISO: nível de detecção elevado',
    '  Scanning for hidden filesystem entries...':
      '  Vasculhando entradas ocultas do sistema de arquivos...',
    '  Revealing masked nodes...': '  Revelando nós mascarados...',
    '  [!] Scan complete. Hidden paths may now be visible.':
      '  [!] Varredura concluída. Caminhos ocultos podem estar visíveis agora.',
    '  [!] Detection risk: ELEVATED': '  [!] Risco de detecção: ELEVADO',
    'Usage: decode <text>': 'Uso: decode <text>',
    '[UFO74]: Decryption successful.': '[UFO74]: descriptografia bem-sucedida.',
    '[UFO74]: "The truth is not what they told you."':
      '[UFO74]: "A verdade não é o que contaram a você."',
    '[UFO74]: You understand now. The official reports...':
      '[UFO74]: agora você entende. os relatórios oficiais...',
    '[UFO74]: They were never meant to be accurate.':
      '[UFO74]: nunca foram feitos para ser precisos.',
    '[UFO74]: Still struggling with the cipher?': '[UFO74]: ainda travado na cifra?',
    '[UFO74]: Try applying ROT13. Classic but effective.':
      '[UFO74]: tente aplicar ROT13. clássico, mas eficaz.',
    'Decryption failed. Pattern not recognized.': 'Descriptografia falhou. Padrão não reconhecido.',
    'Evidence not saved. Files lost in disconnection.':
      'Evidências não foram salvas. Arquivos perdidos na desconexão.',
    'You escaped... but the truth remains buried.':
      'Você escapou... mas a verdade continua enterrada.',
    'Cannot disconnect — connection transfer in progress.':
      'Não é possível desconectar — transferência de conexão em andamento.',
    'Evidence files are being relayed. Stand by.':
      'Os arquivos de evidência estão sendo retransmitidos. Aguarde.',
    'RELEASE COMMAND REQUIRES TARGET': 'O COMANDO RELEASE EXIGE UM ALVO',
    'Usage: release <subject_id>': 'Uso: release <subject_id>',
    'ALPHA - The surviving Varginha being': 'ALPHA - o ser sobrevivente de Varginha',
    'COMMAND: hint': 'COMANDO: hint',
    'Request guidance when you are stuck.': 'Peça orientação quando estiver travado.',
    '  hint              - Receive a contextual hint':
      '  hint              - Receba uma dica contextual',
    '  - Hints are LIMITED (4 per run)': '  - Dicas são LIMITADAS (4 por partida)',
    '  - Hints are vague — they guide thinking, not actions':
      '  - Dicas são vagas — orientam o pensamento, não as ações',
    '  - Cannot reveal specific file names or answers':
      '  - Não podem revelar nomes de arquivos ou respostas específicas',
    'Use sparingly. Trust your own analysis.': 'Use com parcimônia. Confie na sua própria análise.',
    'Type "help" to see all available commands.':
      'Digite "help" para ver todos os comandos disponíveis.',
    "I'll show extra tips as you explore.": 'Vou mostrar dicas extras enquanto você explora.',
    'Type "tutorial off" anytime to disable.':
      'Digite "tutorial off" a qualquer momento para desativar.',
    "You're on your own now. Good luck kid.": 'Agora você está por conta própria. boa sorte, kid.',
    'Restarting tutorial sequence...': 'Reiniciando sequência do tutorial...',
    'SESSION SAVE REQUESTED': 'SOLICITAÇÃO DE SALVAMENTO DE SESSÃO',
    'Use menu to confirm save slot.': 'Use o menu para confirmar o slot de salvamento.',
    '  ls              List files in current directory':
      '  ls              Liste arquivos no diretório atual',
    '  cd <dir>        Change directory': '  cd <dir>        Mude de diretório',
    '  cd ..           Go back one level': '  cd ..           Volte um nível',
    "  open <file>     Read a file's contents": '  open <file>     Leia o conteúdo de um arquivo',
    '  last            Re-read last opened file':
      '  last            Releia o último arquivo aberto',
    '  note <text>     Save a personal note': '  note <text>     Salve uma nota pessoal',
    '  notes           View all your notes': '  notes           Veja todas as suas notas',
    '  bookmark <file> Bookmark a file for later':
      '  bookmark <file> Marque um arquivo para depois',
    '  help            Show all commands': '  help            Mostre todos os comandos',
    '  status          Check risk and session pressure':
      '  status          Verifique risco e pressão da sessão',
    '  wait            Lower risk briefly (limited uses)':
      '  wait            Reduza o risco por um momento (usos limitados)',
    '  help recovery   Learn the emergency recovery options':
      '  help recovery   Saiba as opções de recuperação de emergência',
    '  Collect evidence in all 5 categories:': '  Colete evidências em todas as 5 categorias:',
    '  1. Debris Relocation': '  1. Realocação de destroços',
    '  2. Being Containment': '  2. Contenção de seres',
    '  3. Telepathic Scouts': '  3. Batedores telepáticos',
    '  4. International Actors': '  4. Atores internacionais',
    '  5. Transition 2026': '  5. Transição 2026',
    '  EVIDENCE WORKFLOW:': '  FLUXO DE EVIDÊNCIA:',
    '  1. Navigate directories with ls, cd': '  1. Navegue pelos diretórios com ls, cd',
    '  2. Read files with open <filename>': '  2. Leia arquivos com open <filename>',
    '  3. Watch the header counter update': '  3. Observe o contador do cabeçalho atualizar',
    '  • Collect all 5 categories': '  • Colete as 5 categorias',
    '  • Use "leak" to transmit the evidence': '  • Use "leak" para transmitir a evidência',
    '  Collect evidence in 5 categories:': '  Colete evidências em 5 categorias:',
    '  • Read carefully - evidence is in the details':
      '  • Leia com atenção - a evidência está nos detalhes',
    '  • Use "note" to track important details':
      '  • Use "note" para rastrear detalhes importantes',
    '  • Watch your detection level!': '  • Observe seu nível de detecção!',
    '  • If risk spikes, use "wait" to buy time':
      '  • Se o risco disparar, use "wait" para ganhar tempo',
    '  • At 90% risk, "hide" becomes a one-time escape':
      '  • Com 90% de risco, "hide" vira uma fuga única',
    '  COMMANDS TO KNOW': '  COMANDOS IMPORTANTES',
    '  note <text>      Save personal notes': '  note <text>      Salve notas pessoais',
    '  bookmark <file>  Mark files for later': '  bookmark <file>  Marque arquivos para depois',
    '    Lowers detection for a moment.': '    Reduz a detecção por um instante.',
    '    Limited to 3 uses per run.': '    Limitado a 3 usos por partida.',
    '    Unlocks automatically at 90% risk.':
      '    É desbloqueado automaticamente com 90% de risco.',
    '    Gives you one emergency escape, but hurts stability.':
      '    Dá uma fuga de emergência, mas machuca a estabilidade.',
    '    Shows your current pressure and available recovery options.':
      '    Mostra sua pressão atual e opções de recuperação disponíveis.',
    '  RULE OF THUMB': '  REGRA GERAL',
    '    If the tracker turns red, slow down and recover before digging deeper.':
      '    Se o rastreador ficar vermelho, desacelere e se recupere antes de cavar mais fundo.',
    '    If the terminal replies too early, stop and wait it out.':
      '    Se o terminal responder cedo demais, pare e espere passar.',
    'Usage: script <script_content>': 'Uso: script <script_content>',
    'Required format:': 'Formato obrigatório:',
    'Example:': 'Exemplo:',
    'See /tmp/data_reconstruction.util for available targets.':
      'Veja /tmp/data_reconstruction.util para os alvos disponíveis.',
    'Parsing script...': 'Analisando script...',
    'Script must contain INIT and EXEC commands.': 'O script deve conter os comandos INIT e EXEC.',
    'Script must specify TARGET=<path>': 'O script deve especificar TARGET=<path>',
    '▓▓▓ RECONSTRUCTION IN PROGRESS ▓▓▓': '▓▓▓ RECONSTRUÇÃO EM ANDAMENTO ▓▓▓',
    'Recovering fragmented sectors...': 'Recuperando setores fragmentados...',
    'Rebuilding data structure...': 'Reconstruindo estrutura de dados...',
    'Validating integrity...': 'Validando integridade...',
    'File /admin/neural_fragment.dat is now accessible.':
      'O arquivo /admin/neural_fragment.dat agora está acessível.',
    'TARGET=/comms/psi_residue.log... LOCATED': 'TARGET=/comms/psi_residue.log... LOCALIZADO',
    'ERROR: Corruption too severe': 'ERRO: Corrupção severa demais',
    'Partial recovery only:': 'Apenas recuperação parcial:',
    '...they see through us...': '...eles veem através de nós...',
    '...we are not the first world...': '...não somos o primeiro mundo...',
    '...we will not be the last...': '...não seremos o último...',
    'RECONSTRUCTION PARTIAL — FILE LOST': 'RECONSTRUÇÃO PARCIAL — ARQUIVO PERDIDO',
    'TARGET NOT FOUND': 'ALVO NÃO ENCONTRADO',
    'Specified path does not contain reconstructable data.':
      'O caminho especificado não contém dados reconstruíveis.',
    'USAGE: run <script>': 'USO: run <script>',
    'Example: run purge_trace.sh': 'Exemplo: run purge_trace.sh',
    'No active trace detected.': 'Nenhum rastreio ativo detectado.',
    'TRACE PURGE UTILITY': 'UTILITÁRIO DE EXPURGO DE RASTRO',
    '[OK] Trace buffers wiped': '[OK] Buffers de rastreio apagados',
    '[OK] Session log truncated': '[OK] Log da sessão truncado',
    'NOTICE: Countermeasures reset': 'AVISO: Contramedidas reiniciadas',
    'ARCHIVE MODE HAS BEEN RETIRED': 'O MODO ARQUIVO FOI APOSENTADO',
    'Current timeline active.': 'Linha do tempo atual ativa.',
    'Archive mode is no longer available in this build.':
      'O modo arquivo não está mais disponível nesta build.',
    'Initiating trace protocol...': 'Iniciando protocolo de rastreio...',
    'TRACE RESULT:': 'RESULTADO DO RASTREIO:',
    '  /storage/ — ACCESSIBLE': '  /storage/ — ACESSÍVEL',
    '  /ops/ — PARTIAL': '  /ops/ — PARCIAL',
    '  /comms/ — ACCESSIBLE': '  /comms/ — ACESSÍVEL',
    '  /admin/ — HIGH PRIORITY': '  /admin/ — ALTA PRIORIDADE',
    'WARNING: Trace logged. Detection increased.':
      'AVISO: Rastreamento registrado. Detecção aumentada.',
    '  /storage/assets/ — 2 files': '  /storage/assets/ — 2 arquivos',
    '  /storage/quarantine/ — 3 files': '  /storage/quarantine/ — 3 arquivos',
    '  /ops/prato/ — 1 file': '  /ops/prato/ — 1 arquivo',
    '  /ops/exo/ — 2 files [ELEVATED]': '  /ops/exo/ — 2 arquivos [ELEVADO]',
    '  /comms/psi/ — 2 files [SIGNAL]': '  /comms/psi/ — 2 arquivos [SINAL]',
    '  /admin/ — 7 files [HIGH PRIORITY]': '  /admin/ — 7 arquivos [ALTA PRIORIDADE]',
    'NOTICE: Administrative access may be obtainable.':
      'AVISO: O acesso administrativo pode ser obtido.',
    'Initiating protocol override...': 'Iniciando override de protocolo...',
    'ACCESS DENIED': 'ACESSO NEGADO',
    'Protocol override requires authentication code.':
      'O override do protocolo exige um código de autenticação.',
    'Usage: override protocol <CODE>': 'Uso: override protocol <CODE>',
    '[UFO74]: try "chat". theres someone in the system who knows the code.':
      '[UFO74]: tente "chat". tem alguém no sistema que conhece o código.',
    'MULTIPLE AUTHENTICATION FAILURES DETECTED': 'MÚLTIPLAS FALHAS DE AUTENTICAÇÃO DETECTADAS',
    'INVALID AUTHENTICATION CODE': 'CÓDIGO DE AUTENTICAÇÃO INVÁLIDO',
    'Authentication accepted.': 'Autenticação aceita.',
    'RECOVERED FRAGMENT [ORIGIN: UNKNOWN NODE]:': 'FRAGMENTO RECUPERADO [ORIGEM: NÓ DESCONHECIDO]:',
    '  ...harvest cycle confirmed...': '  ...ciclo de colheita confirmado...',
    '  ...cognitive extraction: 7.2 billion units...':
      '  ...extração cognitiva: 7,2 bilhões de unidades...',
    '  ...window activation: IMMINENT...': '  ...ativação da janela: IMINENTE...',
    '  ...no intervention possible...': '  ...nenhuma intervenção possível...',
    '  ...observation terminates upon extraction...': '  ...a observação termina com a extração...',
    'PURGE PROTOCOL INITIATED': 'PROTOCOLO DE EXPURGO INICIADO',
    'SYSTEM WILL TERMINATE IN 8 OPERATIONS': 'O SISTEMA SERÁ ENCERRADO EM 8 OPERAÇÕES',
    'You should not have seen this.': 'Você não deveria ter visto isso.',
    'WARNING: Legacy security bypass detected': 'AVISO: Bypass de segurança legado detectado',
    'NOTICE: Administrative archive access granted':
      'AVISO: Acesso ao arquivo administrativo concedido',
    'NOTICE: Elevated clearance applied': 'AVISO: Credencial elevada aplicada',
    'WARNING: Session heavily monitored': 'AVISO: Sessão fortemente monitorada',
    'LEAK BLOCKED — INSUFFICIENT EVIDENCE': 'VAZAMENTO BLOQUEADO — EVIDÊNCIA INSUFICIENTE',
    '  All ten must be confirmed before': '  Todas as dez precisam ser confirmadas antes',
    '  the leak channel can be opened.': '  de que o canal de vazamento possa ser aberto.',
    '[UFO74]: not yet. we need more. ten pieces minimum or nobody will believe us.':
      '[UFO74]: ainda não. precisamos de mais. dez peças no mínimo ou ninguém vai acreditar.',
    '  LEAK TRANSMISSION INITIATED': '  TRANSMISSÃO DE VAZAMENTO INICIADA',
    '  Compiling evidence package...': '  Compilando pacote de evidências...',
    '  Encrypting for distribution...': '  Criptografando para distribuição...',
    '  Channel open.': '  Canal aberto.',
    '  TRANSMISSION SUCCESSFUL.': '  TRANSMISSÃO BEM-SUCEDIDA.',
    '[UFO74]: it is done. the world will know.': '[UFO74]: está feito. o mundo vai saber.',
    '         someone wants to talk to you.': '         alguém quer falar com você.',
    'They moved the debris. Where?': 'Eles moveram os destroços. Para onde?',
    'Follow the convoy.': 'Siga o comboio.',
    'How many specimens, and what were they?': 'Quantos espécimes, e o que eram?',
    'Count them. Use the containment labels.': 'Conte-os. Use as etiquetas de contenção.',
    'How did they communicate, and why were they here?':
      'Como eles se comunicavam, e por que estavam aqui?',
    'Not speech. Think psi-comm and purpose.': 'Não era fala. Pense em psi-comm e propósito.',
    'Who was involved besides Brazil?': 'Quem estava envolvido além do Brasil?',
    'Read the diplomatic cables.': 'Leia os cabos diplomáticos.',
    'What were the files counting down to? When?':
      'Para o que os arquivos estavam contando? Quando?',
    'Thirty rotations. Name the year.': 'Trinta rotações. Diga o ano.',
    '  SECURE CHANNEL OPEN': '  CANAL SEGURO ABERTO',
    '  You found me.': '  Você me encontrou.',
    '  I have resources. You have proof.': '  Eu tenho recursos. Você tem prova.',
    '  Ten answers buy a leak.': '  Dez respostas compram um vazamento.',
    '  Each mistake raises exposure.': '  Cada erro aumenta a exposição.',
    '  Three strikes and this channel dies.': '  Três erros e este canal morre.',
    '  Begin.': '  Comece.',
    'That checks out.': 'Confere.',
    'Disappointing. Exposure rises.': 'Decepcionante. A exposição sobe.',
    'Incorrect. They felt that.': 'Incorreto. Eles sentiram isso.',
    "Wrong. They're triangulating.": 'Errado. Eles estão triangulando.',
    'Not what the files say. Risk spike.': 'Não é o que os arquivos dizem. Pico de risco.',
    'Close. Be sharper.': 'Perto. Seja mais preciso.',
    'Near it. Be more specific.': 'Quase lá. Seja mais específico.',
    'Partly right. Finish it.': 'Parcialmente certo. Termine.',
    'Almost. What else?': 'Quase. O que mais?',
    '  Ten for ten.': '  Dez de dez.',
    '  Leak initiated. Mirrors are live.': '  Vazamento iniciado. Espelhos no ar.',
    '  Be gone before dawn.': '  Suma antes do amanhecer.',
    '  >> LEAK SUCCESSFUL <<': '  >> VAZAMENTO BEM-SUCEDIDO <<',
    '  Three strikes.': '  Três erros.',
    '  Channel burned. Connection terminated.': '  Canal queimado. Conexão encerrada.',
    '  Listen for the knock.': '  Escute a batida na porta.',
    '  >> SYSTEM LOCKOUT <<': '  >> BLOQUEIO DO SISTEMA <<',
    '  Wise choice. Or not.': '  Escolha sábia. Ou não.',
    '  Channel closed.': '  Canal fechado.',
    '  Type your answer, or "abort" to disconnect.':
      '  Digite sua resposta, ou "abort" para desconectar.',
    'Sequence error. Connection lost.': 'Erro de sequência. Conexão perdida.',
    '  ADDITIONAL FILES DETECTED': '  ARQUIVOS ADICIONAIS DETECTADOS',
    '  These expose government operations beyond the alien evidence.':
      '  Eles expõem operações governamentais além da evidência alienígena.',
    '  WARNING: Releasing these may cause widespread panic.':
      '  AVISO: liberar isso pode causar pânico generalizado.',
    '  Type "leak all" to release everything.': '  Digite "leak all" para liberar tudo.',
    '  Type "continue" to proceed with alien evidence only.':
      '  Digite "continue" para prosseguir só com a evidência alienígena.',
    '  Try again.': '  Tente de novo.',
    '  Uploading conspiracy documents...': '  Enviando documentos da conspiração...',
    '  Economic manipulation memos... SENT': '  Memorandos de manipulação econômica... ENVIADOS',
    '  Surveillance programs... SENT': '  Programas de vigilância... ENVIADOS',
    '  Weather modification logs... SENT': '  Logs de modificação climática... ENVIADOS',
    '  Historical revisionism records... SENT': '  Registros de revisionismo histórico... ENVIADOS',
    '  EVERYTHING IS OUT THERE NOW.': '  TUDO ESTÁ LÁ FORA AGORA.',
    'UFO74: jesus christ, kid. you just blew it all open.':
      'UFO74: jesus cristo, kid. você acabou de expor tudo.',
    '       the aliens AND the conspiracies.': '       os alienígenas E as conspirações.',
    '       the world is gonna lose its mind.': '       o mundo vai enlouquecer.',
    '  Understood. Proceeding with alien evidence only.':
      '  Entendido. Prosseguindo apenas com a evidência alienígena.',
    'UFO74: smart choice. one bombshell at a time.':
      'UFO74: escolha inteligente. uma bomba de cada vez.',
    '       the conspiracy stuff can wait.': '       a parte da conspiração pode esperar.',
    '  Please clarify:': '  Esclareça, por favor:',
    '  Type "leak all" to release ALL documents.':
      '  Digite "leak all" para liberar TODOS os documentos.',
  },
  es: {
    '  INTRUSION DETECTED': '  INTRUSIÓN DETECTADA',
    '  Your connection has been traced.': '  Tu conexión ha sido rastreada.',
    '  Security protocols have been dispatched.': '  Se han desplegado protocolos de seguridad.',
    '  >> SESSION TERMINATED <<': '  >> SESIÓN TERMINADA <<',
    '[TRACE SPIKE ACTIVE]': '[PICO DE RASTREO ACTIVO]',
    '                    PURGE PROTOCOL COMPLETE':
      '                    PROTOCOLO DE PURGA COMPLETADO',
    '          You saw what you should not have seen.':
      '          Viste lo que no debías haber visto.',
    '          The knowledge is yours to keep.':
      '          El conocimiento ahora es tuyo para cargarlo.',
    '          But this session is now closed.': '          Pero esta sesión ya está cerrada.',
    'Enter answer or type "cancel" to abort:': 'Escribe la respuesta o "cancel" para abortar:',
    'SYSTEM LOCKDOWN': 'BLOQUEO DEL SISTEMA',
    'NO FURTHER COMMANDS ACCEPTED': 'NO SE ACEPTAN MÁS COMANDOS',
    'Override protocol unavailable during transmission.':
      'El protocolo de override no está disponible durante la transmisión.',
    '[UFO74]: hey careful, to go back use cd .. (with a space after cd)':
      '[UFO74]: ey, cuidado, para volver usa cd .. (con un espacio después de cd)',
    'UFO74: hey kid, youre fumbling. let me help.':
      'UFO74: ey, kid, te estás trabando. déjame ayudarte.',
    'UFO74: try these: "ls" to see files, "cd <dir>" to move, "open <file>" to read.':
      'UFO74: prueba esto: "ls" para ver archivos, "cd <dir>" para moverte, "open <file>" para leer.',
    'UFO74: type "help" if youre lost.': 'UFO74: escribe "help" si estás perdido.',
    'UFO74: careful. too many mistakes and theyll lock you out.':
      'UFO74: cuidado. demasiados errores y te van a bloquear.',
    'UFO74: hey kid, risk is getting too high.':
      'UFO74: ey, kid, el riesgo se está poniendo demasiado alto.',
    'UFO74: use "wait" to lay low and bring the risk down.':
      'UFO74: usa "wait" para bajar la cabeza y reducir el riesgo.',
    '  STATUS: SUSPICIOUS': '  ESTADO: SOSPECHOSO',
    '  System monitoring increased.': '  Se incrementó el monitoreo del sistema.',
    '  STATUS: ALERT': '  ESTADO: ALERTA',
    '  Active countermeasures online.': '  Contramedidas activas en línea.',
    '>> careful. theyre paying attention now. <<': '>> cuidado. ahora sí te están mirando. <<',
    '  STATUS: CRITICAL': '  ESTADO: CRÍTICO',
    '  Trace protocols active.': '  Protocolos de rastreo activos.',
    '>> STOP. youre about to get burned. <<': '>> ALTO. estás a punto de quemarte. <<',
    '>> use "wait" to lay low. you have limited uses. <<':
      '>> usa "wait" para agacharte. tienes usos limitados. <<',
    '  STATUS: IMMINENT DETECTION': '  ESTADO: DETECCIÓN INMINENTE',
    '  Countermeasures locking on.': '  Las contramedidas están fijando objetivo.',
    '>> EMERGENCY. type "hide" NOW. one chance. <<':
      '>> EMERGENCIA. escribe "hide" AHORA. una oportunidad. <<',
    '  Too many failed authentication attempts.':
      '  Demasiados intentos fallidos de autenticación.',
    '  Session terminated by security protocol.': '  Sesión terminada por protocolo de seguridad.',
    '[UFO74]: try "ls" to list directory contents.':
      '[UFO74]: prueba "ls" para listar el contenido del directorio.',
    '[UFO74]: press [ESC] to exit. or type "save" first if you want to keep your progress.':
      '[UFO74]: presiona [ESC] para salir. o escribe "save" primero si quieres conservar tu progreso.',
    '[UFO74]: you need the override protocol for that. dangerous stuff.':
      '[UFO74]: necesitas el protocolo de override para eso. material peligroso.',
    '[UFO74]: use "cd .." to go to parent directory.':
      '[UFO74]: usa "cd .." para ir al directorio padre.',
    '[UFO74]: try "status" or "help" kid.': '[UFO74]: prueba "status" o "help", kid.',
    '[UFO74]: type "help" to see what you can do.':
      '[UFO74]: escribe "help" para ver lo que puedes hacer.',
    'ERROR: Cannot read directory': 'ERROR: No se puede leer el directorio',
    'ERROR: Specify directory': 'ERROR: Especifica un directorio',
    '[UFO74]: use "ls" to see directories, then "cd <dirname>" to enter one.':
      '[UFO74]: usa "ls" para ver directorios y luego "cd <dirname>" para entrar en uno.',
    '[UFO74]: use "ls" to see whats in the current directory.':
      '[UFO74]: usa "ls" para ver qué hay en el directorio actual.',
    "  HINT: 'cd' is used for directories only.": "  PISTA: 'cd' se usa solo para directorios.",
    'ERROR: Specify file': 'ERROR: Especifica un archivo',
    '[UFO74]: use "ls" to see files, then "open <filename>" to read one.':
      '[UFO74]: usa "ls" para ver archivos y luego "open <filename>" para leer uno.',
    'ERROR: File not found': 'ERROR: Archivo no encontrado',
    '[UFO74]: use "ls" to see whats here.': '[UFO74]: usa "ls" para ver qué hay aquí.',
    "  HINT: 'open' is used for files only.": "  PISTA: 'open' se usa solo para archivos.",
    'UFO74: you already fell for this trap, kid. lets move on.':
      'UFO74: ya caíste en esta trampa, kid. sigamos.',
    'UFO74: that was a honeypot! a trap file!': 'UFO74: ¡eso era un honeypot! ¡un archivo trampa!',
    '       they plant those to catch people like us.':
      '       ponen eso para atrapar a gente como nosotros.',
    'UFO74: real evidence is NEVER labeled that obviously.':
      'UFO74: la evidencia real NUNCA viene etiquetada de forma tan obvia.',
    '       "SMOKING GUN"? "PRESIDENTS EYES"? come on...':
      '       "SMOKING GUN"? "PRESIDENTS EYES"? vamos...',
    'UFO74: your detection just spiked. be more careful!':
      'UFO74: tu detección acaba de dispararse. ¡ten más cuidado!',
    'ERROR: Cannot read file': 'ERROR: No se puede leer el archivo',
    'UFO74: you already read this file, kid. lets move on.':
      'UFO74: ya leíste este archivo, kid. sigamos.',
    '[SYSTEM: access pattern normalized]': '[SISTEMA: patrón de acceso normalizado]',
    'UFO74: good thinking, kid. reading the boring stuff keeps you looking like a regular user.':
      'UFO74: buena jugada, kid. leer lo aburrido te hace parecer un usuario común.',
    'NOTICE: Redaction sequence reconciled.': 'AVISO: secuencia de redacción reconciliada.',
    '[UFO74]: you read all we could here, use `cd ..` to go back up to explore other folders kid.':
      '[UFO74]: ya leíste todo lo que podíamos aquí, usa `cd ..` para volver y explorar otras carpetas, kid.',
    'UFO74: timed recovery wrapper. get ready first, then move fast.':
      'UFO74: wrapper de recuperación cronometrada. prepárate primero y luego muévete rápido.',
    'ERROR: File is not encrypted': 'ERROR: El archivo no está cifrado',
    'ERROR: No recoverable data': 'ERROR: No hay datos recuperables',
    '[UFO74]: old decrypt wrappers are retired. opening the recovered file directly.':
      '[UFO74]: los wrappers viejos de decrypt ya se retiraron. abriendo directamente el archivo recuperado.',
    '▓▓▓ DECRYPTION WINDOW EXPIRED ▓▓▓': '▓▓▓ VENTANA DE DESCIFRADO EXPIRADA ▓▓▓',
    'Time limit exceeded.': 'Se excedió el límite de tiempo.',
    'Encryption re-initialized.': 'Cifrado reinicializado.',
    '     TIMED DECRYPTION SUCCESSFUL              ':
      '     DESCIFRADO CRONOMETRADO EXITOSO              ',
    'Time remaining. Try again.': 'Aún queda tiempo. Inténtalo de nuevo.',
    '▓▓▓ TIMED DECRYPTION INITIATED ▓▓▓': '▓▓▓ DESCIFRADO CRONOMETRADO INICIADO ▓▓▓',
    '  This file uses time-locked encryption.': '  Este archivo usa cifrado bloqueado por tiempo.',
    '  You must type the sequence before time expires.':
      '  Debes escribir la secuencia antes de que se acabe el tiempo.',
    'PASSWORD REQUIRED': 'CONTRASEÑA REQUERIDA',
    'Usage: decrypt ghost_in_machine.enc <password>':
      'Uso: decrypt ghost_in_machine.enc <password>',
    "[UFO74]: This file... I don't recognize it.": '[UFO74]: este archivo... no lo reconozco.',
    '[UFO74]: But the encryption pattern looks familiar.':
      '[UFO74]: pero el patrón de cifrado me resulta familiar.',
    'DECRYPTION FAILED': 'DESCIFRADO FALLIDO',
    'Invalid password': 'Contraseña inválida',
    '[UFO74]: Wrong password. Keep looking.': '[UFO74]: contraseña incorrecta. sigue buscando.',
    'DECRYPTION SUCCESSFUL': 'DESCIFRADO EXITOSO',
    '   CLASSIFIED PERSONNEL FILE': '   ARCHIVO DE PERSONAL CLASIFICADO',
    '   SUBJECT: WITNESS #74 - CODE NAME "UFO74"': '   SUJETO: TESTIGO #74 - NOMBRE CLAVE "UFO74"',
    '   Location: Varginha, Minas Gerais': '   Ubicación: Varginha, Minas Gerais',
    '   Date: January 20, 1996': '   Fecha: 20 de enero de 1996',
    '   Status: WITNESS SUPPRESSION FAILED': '   Estado: SUPRESIÓN DEL TESTIGO FALLIDA',
    '   Subject was present during initial': '   El sujeto estuvo presente durante el contacto',
    '   contact event. Demonstrated unusual': '   inicial. Demostró una resistencia inusual',
    '   resistance to memory alteration': '   a la alteración de memoria',
    '   protocols.': '   por parte de los protocolos.',
    '   Subject has since accessed internal': '   Desde entonces, el sujeto ha accedido a redes',
    '   networks repeatedly. Motivation unclear.':
      '   internas repetidamente. Motivación incierta.',
    '   Possibly seeking validation.': '   Posiblemente busca validación.',
    '[UFO74]: So you found it.': '[UFO74]: así que lo encontraste.',
    '[UFO74]: I was there. January 1996.': '[UFO74]: yo estuve allí. enero de 1996.',
    '[UFO74]: I saw what they did. What they took.':
      '[UFO74]: vi lo que hicieron. lo que se llevaron.',
    "[UFO74]: I've been inside their systems ever since.":
      '[UFO74]: he estado dentro de sus sistemas desde entonces.',
    '[UFO74]: Not for revenge. For proof.': '[UFO74]: no por venganza. por pruebas.',
    "[UFO74]: You have the proof now. Don't let them bury it again.":
      '[UFO74]: ahora tú tienes la prueba. no dejes que la entierren otra vez.',
    '▓▓▓ THE WHOLE TRUTH AWAITS ▓▓▓': '▓▓▓ LA VERDAD COMPLETA ESPERA ▓▓▓',
    'ERROR: Decryption failed': 'ERROR: El descifrado falló',
    'WARNING: Access level insufficient': 'ADVERTENCIA: Nivel de acceso insuficiente',
    'Initiating decryption protocol...': 'Iniciando protocolo de descifrado...',
    'DECRYPTION AUTHENTICATION REQUIRED': 'SE REQUIERE AUTENTICACIÓN PARA DESCIFRAR',
    'Enter answer below:': 'Escribe la respuesta abajo:',
    'Full index scan detected on elevated session.':
      'Se detectó un escaneo total del índice en una sesión elevada.',
    '[HackerKid]: Hey kid, are you sure you want to use tree?':
      '[HackerKid]: Oye, kid, ¿seguro que quieres usar tree?',
    '  It will expose all files but it will spike your risk significantly.':
      '  Expondrá todos los archivos, pero disparará tu riesgo de forma importante.',
    'Type tree again to confirm.': 'Escribe tree otra vez para confirmar.',
    'ERROR: No file opened yet': 'ERROR: Aún no se abrió ningún archivo',
    '[UFO74]: use "open <filename>" to read a file first.':
      '[UFO74]: usa "open <filename>" para leer primero un archivo.',
    'ERROR: File content no longer available':
      'ERROR: El contenido del archivo ya no está disponible',
    'Already at root directory. No navigation history.':
      'Ya estás en el directorio raíz. No hay historial de navegación.',
    '[UFO74]: use "cd" to build navigation history for the "back" command.':
      '[UFO74]: usa "cd" para construir historial de navegación para el comando "back".',
    '║                  EVIDENCE MAP                         ║':
      '║                  MAPA DE EVIDENCIA                    ║',
    '  No evidence logged yet.': '  Aún no hay evidencia registrada.',
    '  Read files to log corroborating evidence.':
      '  Lee archivos para registrar evidencia corroborante.',
    '  EVIDENCE STATUS:': '  ESTADO DE LA EVIDENCIA:',
    'Cannot wait any longer.': 'No puedes esperar más.',
    'The system is too alert. Staying still would be suspicious.':
      'El sistema está demasiado alerta. Quedarse quieto sería sospechoso.',
    'Detection level already minimal.': 'El nivel de detección ya es mínimo.',
    'No need to wait.': 'No hace falta esperar.',
    '    [Holding position... monitoring suspended]':
      '    [Manteniendo posición... monitoreo suspendido]',
    '    The system grows impatient.': '    El sistema se impacienta.',
    '    Something is still watching.': '    Algo todavía está observando.',
    '    Attention drifts elsewhere.': '    La atención se desvía a otro lado.',
    'Type "help" for available commands': 'Escribe "help" para ver los comandos disponibles',
    'Cannot hide again.': 'No puedes esconderte otra vez.',
    'They know your patterns now.': 'Ahora conocen tus patrones.',
    'There is no second escape.': 'No hay una segunda fuga.',
    '▓▓▓ EMERGENCY PROTOCOL ENGAGED ▓▓▓': '▓▓▓ PROTOCOLO DE EMERGENCIA ACTIVADO ▓▓▓',
    '    Routing through backup channels...': '    Enrutando por canales de respaldo...',
    '    Fragmenting connection signature...': '    Fragmentando la firma de conexión...',
    '    Deploying decoy packets...': '    Desplegando paquetes señuelo...',
    '    You slip back into the shadows.': '    Te deslizas de vuelta hacia las sombras.',
    '    Session stability compromised.': '    Estabilidad de la sesión comprometida.',
    '    >> close call. dont push your luck. <<': '    >> estuvo cerca. no fuerces tu suerte. <<',
    'ERROR: Specify note text': 'ERROR: Especifica el texto de la nota',
    'Usage: note <your text>': 'Uso: note <your text>',
    'Example: note password might be varginha1996':
      'Ejemplo: note la contraseña podría ser varginha1996',
    'No notes saved yet': 'Aún no hay notas guardadas',
    'Use: note <text> to save a note': 'Usa: note <text> para guardar una nota',
    '                 YOUR NOTES              ': '                 TUS NOTAS               ',
    'No bookmarks saved': 'No hay marcadores guardados',
    'Usage: bookmark <filename> to bookmark a file':
      'Uso: bookmark <filename> para marcar un archivo',
    '             BOOKMARKED FILES          ': '             ARCHIVOS MARCADOS          ',
    'Use "bookmark" to view all bookmarks': 'Usa "bookmark" para ver todos los marcadores',
    'All accessible files have been read!': '¡Se han leído todos los archivos accesibles!',
    'Some files may require higher access levels.':
      'Algunos archivos pueden requerir niveles de acceso más altos.',
    '  EVIDENCE COLLECTED:': '  EVIDENCIA RECOLECTADA:',
    '  SESSION STATISTICS:': '  ESTADÍSTICAS DE LA SESIÓN:',
    '  ⚠ CRITICAL: Detection level dangerously high':
      '  ⚠ CRÍTICO: nivel de detección peligrosamente alto',
    '  ⚠ WARNING: Detection level elevated': '  ⚠ ADVERTENCIA: nivel de detección elevado',
    '  Scanning for hidden filesystem entries...':
      '  Escaneando entradas ocultas del sistema de archivos...',
    '  Revealing masked nodes...': '  Revelando nodos enmascarados...',
    '  [!] Scan complete. Hidden paths may now be visible.':
      '  [!] Escaneo completo. Las rutas ocultas pueden ser visibles ahora.',
    '  [!] Detection risk: ELEVATED': '  [!] Riesgo de detección: ELEVADO',
    'Usage: decode <text>': 'Uso: decode <text>',
    '[UFO74]: Decryption successful.': '[UFO74]: descifrado exitoso.',
    '[UFO74]: "The truth is not what they told you."':
      '[UFO74]: "La verdad no es lo que te dijeron."',
    '[UFO74]: You understand now. The official reports...':
      '[UFO74]: ahora lo entiendes. los informes oficiales...',
    '[UFO74]: They were never meant to be accurate.':
      '[UFO74]: nunca estuvieron pensados para ser precisos.',
    '[UFO74]: Still struggling with the cipher?': '[UFO74]: ¿sigues peleando con la cifra?',
    '[UFO74]: Try applying ROT13. Classic but effective.':
      '[UFO74]: prueba aplicar ROT13. clásico, pero eficaz.',
    'Decryption failed. Pattern not recognized.': 'El descifrado falló. Patrón no reconocido.',
    'Evidence not saved. Files lost in disconnection.':
      'La evidencia no se guardó. Archivos perdidos en la desconexión.',
    'You escaped... but the truth remains buried.': 'Escapaste... pero la verdad sigue enterrada.',
    'Cannot disconnect — connection transfer in progress.':
      'No se puede desconectar — transferencia de conexión en progreso.',
    'Evidence files are being relayed. Stand by.':
      'Los archivos de evidencia están siendo retransmitidos. Espera.',
    'RELEASE COMMAND REQUIRES TARGET': 'EL COMANDO RELEASE REQUIERE OBJETIVO',
    'Usage: release <subject_id>': 'Uso: release <subject_id>',
    'ALPHA - The surviving Varginha being': 'ALPHA - el ser superviviente de Varginha',
    'COMMAND: hint': 'COMANDO: hint',
    'Request guidance when you are stuck.': 'Pide orientación cuando te atasques.',
    '  hint              - Receive a contextual hint':
      '  hint              - Recibe una pista contextual',
    '  - Hints are LIMITED (4 per run)': '  - Las pistas son LIMITADAS (4 por partida)',
    '  - Hints are vague — they guide thinking, not actions':
      '  - Las pistas son vagas — guían el pensamiento, no las acciones',
    '  - Cannot reveal specific file names or answers':
      '  - No pueden revelar nombres de archivos ni respuestas específicas',
    'Use sparingly. Trust your own analysis.':
      'Úsalo con moderación. Confía en tu propio análisis.',
    'Type "help" to see all available commands.':
      'Escribe "help" para ver todos los comandos disponibles.',
    "I'll show extra tips as you explore.": 'Te mostraré consejos extra mientras exploras.',
    'Type "tutorial off" anytime to disable.':
      'Escribe "tutorial off" cuando quieras para desactivarlo.',
    "You're on your own now. Good luck kid.": 'Ahora estás por tu cuenta. suerte, kid.',
    'Restarting tutorial sequence...': 'Reiniciando secuencia del tutorial...',
    'SESSION SAVE REQUESTED': 'SE SOLICITÓ GUARDAR LA SESIÓN',
    'Use menu to confirm save slot.': 'Usa el menú para confirmar la ranura de guardado.',
    '  ls              List files in current directory':
      '  ls              Lista archivos en el directorio actual',
    '  cd <dir>        Change directory': '  cd <dir>        Cambia de directorio',
    '  cd ..           Go back one level': '  cd ..           Retrocede un nivel',
    "  open <file>     Read a file's contents": '  open <file>     Lee el contenido de un archivo',
    '  last            Re-read last opened file':
      '  last            Vuelve a leer el último archivo abierto',
    '  note <text>     Save a personal note': '  note <text>     Guarda una nota personal',
    '  notes           View all your notes': '  notes           Ve todas tus notas',
    '  bookmark <file> Bookmark a file for later':
      '  bookmark <file> Marca un archivo para después',
    '  help            Show all commands': '  help            Muestra todos los comandos',
    '  status          Check risk and session pressure':
      '  status          Revisa el riesgo y la presión de la sesión',
    '  wait            Lower risk briefly (limited uses)':
      '  wait            Reduce el riesgo un momento (usos limitados)',
    '  help recovery   Learn the emergency recovery options':
      '  help recovery   Aprende las opciones de recuperación de emergencia',
    '  Collect evidence in all 5 categories:': '  Reúne evidencia en las 5 categorías:',
    '  1. Debris Relocation': '  1. Reubicación de restos',
    '  2. Being Containment': '  2. Contención de seres',
    '  3. Telepathic Scouts': '  3. Exploradores telepáticos',
    '  4. International Actors': '  4. Actores internacionales',
    '  5. Transition 2026': '  5. Transición 2026',
    '  EVIDENCE WORKFLOW:': '  FLUJO DE EVIDENCIA:',
    '  1. Navigate directories with ls, cd': '  1. Navega directorios con ls, cd',
    '  2. Read files with open <filename>': '  2. Lee archivos con open <filename>',
    '  3. Watch the header counter update':
      '  3. Observa cómo se actualiza el contador del encabezado',
    '  • Collect all 5 categories': '  • Reúne las 5 categorías',
    '  • Use "leak" to transmit the evidence': '  • Usa "leak" para transmitir la evidencia',
    '  Collect evidence in 5 categories:': '  Reúne evidencia en 5 categorías:',
    '  • Read carefully - evidence is in the details':
      '  • Lee con cuidado - la evidencia está en los detalles',
    '  • Use "note" to track important details': '  • Usa "note" para seguir detalles importantes',
    '  • Watch your detection level!': '  • ¡Vigila tu nivel de detección!',
    '  • If risk spikes, use "wait" to buy time':
      '  • Si el riesgo se dispara, usa "wait" para ganar tiempo',
    '  • At 90% risk, "hide" becomes a one-time escape':
      '  • Al 90% de riesgo, "hide" se vuelve un escape de una sola vez',
    '  COMMANDS TO KNOW': '  COMANDOS QUE DEBES CONOCER',
    '  note <text>      Save personal notes': '  note <text>      Guarda notas personales',
    '  bookmark <file>  Mark files for later': '  bookmark <file>  Marca archivos para después',
    '    Lowers detection for a moment.': '    Baja la detección por un momento.',
    '    Limited to 3 uses per run.': '    Limitado a 3 usos por partida.',
    '    Unlocks automatically at 90% risk.': '    Se desbloquea automáticamente al 90% de riesgo.',
    '    Gives you one emergency escape, but hurts stability.':
      '    Te da una salida de emergencia, pero daña la estabilidad.',
    '    Shows your current pressure and available recovery options.':
      '    Muestra tu presión actual y las opciones de recuperación disponibles.',
    '  RULE OF THUMB': '  REGLA GENERAL',
    '    If the tracker turns red, slow down and recover before digging deeper.':
      '    Si el indicador se pone rojo, baja el ritmo y recupérate antes de profundizar.',
    '    If the terminal replies too early, stop and wait it out.':
      '    Si el terminal responde demasiado pronto, detente y espera.',
    'Usage: script <script_content>': 'Uso: script <script_content>',
    'Required format:': 'Formato requerido:',
    'Example:': 'Ejemplo:',
    'See /tmp/data_reconstruction.util for available targets.':
      'Consulta /tmp/data_reconstruction.util para ver los objetivos disponibles.',
    'Parsing script...': 'Analizando script...',
    'Script must contain INIT and EXEC commands.':
      'El script debe contener los comandos INIT y EXEC.',
    'Script must specify TARGET=<path>': 'El script debe especificar TARGET=<path>',
    '▓▓▓ RECONSTRUCTION IN PROGRESS ▓▓▓': '▓▓▓ RECONSTRUCCIÓN EN PROGRESO ▓▓▓',
    'Recovering fragmented sectors...': 'Recuperando sectores fragmentados...',
    'Rebuilding data structure...': 'Reconstruyendo estructura de datos...',
    'Validating integrity...': 'Validando integridad...',
    'File /admin/neural_fragment.dat is now accessible.':
      'El archivo /admin/neural_fragment.dat ahora está accesible.',
    'TARGET=/comms/psi_residue.log... LOCATED': 'TARGET=/comms/psi_residue.log... LOCALIZADO',
    'ERROR: Corruption too severe': 'ERROR: Corrupción demasiado severa',
    'Partial recovery only:': 'Solo recuperación parcial:',
    '...they see through us...': '...ven a través de nosotros...',
    '...we are not the first world...': '...no somos el primer mundo...',
    '...we will not be the last...': '...no seremos el último...',
    'RECONSTRUCTION PARTIAL — FILE LOST': 'RECONSTRUCCIÓN PARCIAL — ARCHIVO PERDIDO',
    'TARGET NOT FOUND': 'OBJETIVO NO ENCONTRADO',
    'Specified path does not contain reconstructable data.':
      'La ruta especificada no contiene datos reconstruibles.',
    'USAGE: run <script>': 'USO: run <script>',
    'Example: run purge_trace.sh': 'Ejemplo: run purge_trace.sh',
    'No active trace detected.': 'No se detectó ningún rastreo activo.',
    'TRACE PURGE UTILITY': 'UTILIDAD DE PURGA DE RASTREO',
    '[OK] Trace buffers wiped': '[OK] Buffers de rastreo borrados',
    '[OK] Session log truncated': '[OK] Registro de sesión truncado',
    'NOTICE: Countermeasures reset': 'AVISO: Contramedidas reiniciadas',
    'ARCHIVE MODE HAS BEEN RETIRED': 'EL MODO ARCHIVE HA SIDO RETIRADO',
    'Current timeline active.': 'Línea temporal actual activa.',
    'Archive mode is no longer available in this build.':
      'El modo archive ya no está disponible en esta build.',
    'Initiating trace protocol...': 'Iniciando protocolo de rastreo...',
    'TRACE RESULT:': 'RESULTADO DEL RASTREO:',
    '  /storage/ — ACCESSIBLE': '  /storage/ — ACCESIBLE',
    '  /ops/ — PARTIAL': '  /ops/ — PARCIAL',
    '  /comms/ — ACCESSIBLE': '  /comms/ — ACCESIBLE',
    '  /admin/ — HIGH PRIORITY': '  /admin/ — ALTA PRIORIDAD',
    'WARNING: Trace logged. Detection increased.':
      'ADVERTENCIA: Rastreo registrado. Detección aumentada.',
    '  /storage/assets/ — 2 files': '  /storage/assets/ — 2 archivos',
    '  /storage/quarantine/ — 3 files': '  /storage/quarantine/ — 3 archivos',
    '  /ops/prato/ — 1 file': '  /ops/prato/ — 1 archivo',
    '  /ops/exo/ — 2 files [ELEVATED]': '  /ops/exo/ — 2 archivos [ELEVADO]',
    '  /comms/psi/ — 2 files [SIGNAL]': '  /comms/psi/ — 2 archivos [SEÑAL]',
    '  /admin/ — 7 files [HIGH PRIORITY]': '  /admin/ — 7 archivos [ALTA PRIORIDAD]',
    'NOTICE: Administrative access may be obtainable.':
      'AVISO: Puede ser posible obtener acceso administrativo.',
    'Initiating protocol override...': 'Iniciando override de protocolo...',
    'ACCESS DENIED': 'ACCESO DENEGADO',
    'Protocol override requires authentication code.':
      'El override del protocolo requiere un código de autenticación.',
    'Usage: override protocol <CODE>': 'Uso: override protocol <CODE>',
    '[UFO74]: try "chat". theres someone in the system who knows the code.':
      '[UFO74]: prueba "chat". hay alguien en el sistema que conoce el código.',
    'MULTIPLE AUTHENTICATION FAILURES DETECTED': 'SE DETECTARON MÚLTIPLES FALLOS DE AUTENTICACIÓN',
    'INVALID AUTHENTICATION CODE': 'CÓDIGO DE AUTENTICACIÓN INVÁLIDO',
    'Authentication accepted.': 'Autenticación aceptada.',
    'RECOVERED FRAGMENT [ORIGIN: UNKNOWN NODE]:':
      'FRAGMENTO RECUPERADO [ORIGEN: NODO DESCONOCIDO]:',
    '  ...harvest cycle confirmed...': '  ...ciclo de cosecha confirmado...',
    '  ...cognitive extraction: 7.2 billion units...':
      '  ...extracción cognitiva: 7,2 mil millones de unidades...',
    '  ...window activation: IMMINENT...': '  ...activación de la ventana: INMINENTE...',
    '  ...no intervention possible...': '  ...no es posible intervenir...',
    '  ...observation terminates upon extraction...':
      '  ...la observación termina con la extracción...',
    'PURGE PROTOCOL INITIATED': 'PROTOCOLO DE PURGA INICIADO',
    'SYSTEM WILL TERMINATE IN 8 OPERATIONS': 'EL SISTEMA TERMINARÁ EN 8 OPERACIONES',
    'You should not have seen this.': 'No deberías haber visto esto.',
    'WARNING: Legacy security bypass detected':
      'ADVERTENCIA: Se detectó bypass de seguridad heredado',
    'NOTICE: Administrative archive access granted':
      'AVISO: Acceso administrativo al archivo concedido',
    'NOTICE: Elevated clearance applied': 'AVISO: Se aplicó una autorización elevada',
    'WARNING: Session heavily monitored': 'ADVERTENCIA: Sesión fuertemente monitoreada',
    'LEAK BLOCKED — INSUFFICIENT EVIDENCE': 'FILTRACIÓN BLOQUEADA — EVIDENCIA INSUFICIENTE',
    '  All ten must be confirmed before': '  Las diez deben confirmarse antes',
    '  the leak channel can be opened.': '  de que el canal de filtración pueda abrirse.',
    '[UFO74]: not yet. we need more. ten pieces minimum or nobody will believe us.':
      '[UFO74]: todavía no. necesitamos más. diez piezas como mínimo o nadie nos va a creer.',
    '  LEAK TRANSMISSION INITIATED': '  TRANSMISIÓN DE FILTRACIÓN INICIADA',
    '  Compiling evidence package...': '  Compilando paquete de evidencia...',
    '  Encrypting for distribution...': '  Cifrando para distribuir...',
    '  Channel open.': '  Canal abierto.',
    '  TRANSMISSION SUCCESSFUL.': '  TRANSMISIÓN EXITOSA.',
    '[UFO74]: it is done. the world will know.': '[UFO74]: está hecho. el mundo lo sabrá.',
    '         someone wants to talk to you.': '         alguien quiere hablar contigo.',
    'They moved the debris. Where?': 'Movieron los restos. ¿Adónde?',
    'Follow the convoy.': 'Sigue el convoy.',
    'How many specimens, and what were they?': '¿Cuántos especímenes había, y qué eran?',
    'Count them. Use the containment labels.': 'Cuéntalos. Usa las etiquetas de contención.',
    'How did they communicate, and why were they here?':
      '¿Cómo se comunicaban y por qué estaban aquí?',
    'Not speech. Think psi-comm and purpose.': 'No era habla. Piensa en psi-comm y propósito.',
    'Who was involved besides Brazil?': '¿Quién estaba implicado además de Brasil?',
    'Read the diplomatic cables.': 'Lee los cables diplomáticos.',
    'What were the files counting down to? When?':
      '¿Hacia qué estaban contando los archivos? ¿Cuándo?',
    'Thirty rotations. Name the year.': 'Treinta rotaciones. Nombra el año.',
    '  SECURE CHANNEL OPEN': '  CANAL SEGURO ABIERTO',
    '  You found me.': '  Me encontraste.',
    '  I have resources. You have proof.': '  Yo tengo recursos. Tú tienes pruebas.',
    '  Ten answers buy a leak.': '  Diez respuestas compran una filtración.',
    '  Each mistake raises exposure.': '  Cada error aumenta la exposición.',
    '  Three strikes and this channel dies.': '  Tres errores y este canal muere.',
    '  Begin.': '  Empieza.',
    'That checks out.': 'Eso encaja.',
    'Disappointing. Exposure rises.': 'Decepcionante. La exposición sube.',
    'Incorrect. They felt that.': 'Incorrecto. Lo sintieron.',
    "Wrong. They're triangulating.": 'Mal. Están triangulando.',
    'Not what the files say. Risk spike.': 'No es lo que dicen los archivos. Pico de riesgo.',
    'Close. Be sharper.': 'Cerca. Afina más.',
    'Near it. Be more specific.': 'Muy cerca. Sé más específico.',
    'Partly right. Finish it.': 'Parcialmente correcto. Complétalo.',
    'Almost. What else?': 'Casi. ¿Qué más?',
    '  Ten for ten.': '  Dez de dez.',
    '  Leak initiated. Mirrors are live.': '  Filtración iniciada. Los espejos ya están activos.',
    '  Be gone before dawn.': '  Desaparece antes del amanecer.',
    '  >> LEAK SUCCESSFUL <<': '  >> FILTRACIÓN EXITOSA <<',
    '  Three strikes.': '  Tres errores.',
    '  Channel burned. Connection terminated.': '  Canal quemado. Conexión terminada.',
    '  Listen for the knock.': '  Escucha el golpe en la puerta.',
    '  >> SYSTEM LOCKOUT <<': '  >> BLOQUEO DEL SISTEMA <<',
    '  Wise choice. Or not.': '  Elección sabia. O no.',
    '  Channel closed.': '  Canal cerrado.',
    '  Type your answer, or "abort" to disconnect.':
      '  Escribe tu respuesta, o "abort" para desconectarte.',
    'Sequence error. Connection lost.': 'Error de secuencia. Conexión perdida.',
    '  ADDITIONAL FILES DETECTED': '  ARCHIVOS ADICIONALES DETECTADOS',
    '  These expose government operations beyond the alien evidence.':
      '  Exponen operaciones gubernamentales más allá de la evidencia alienígena.',
    '  WARNING: Releasing these may cause widespread panic.':
      '  ADVERTENCIA: liberar esto puede causar pánico generalizado.',
    '  Type "leak all" to release everything.': '  Escribe "leak all" para soltarlo todo.',
    '  Type "continue" to proceed with alien evidence only.':
      '  Escribe "continue" para seguir solo con la evidencia alienígena.',
    '  Try again.': '  Inténtalo otra vez.',
    '  Uploading conspiracy documents...': '  Subiendo documentos de la conspiración...',
    '  Economic manipulation memos... SENT': '  Memorandos de manipulación económica... ENVIADOS',
    '  Surveillance programs... SENT': '  Programas de vigilancia... ENVIADOS',
    '  Weather modification logs... SENT': '  Registros de modificación climática... ENVIADOS',
    '  Historical revisionism records... SENT': '  Registros de revisionismo histórico... ENVIADOS',
    '  EVERYTHING IS OUT THERE NOW.': '  TODO ESTÁ AHÍ AFUERA AHORA.',
    'UFO74: jesus christ, kid. you just blew it all open.':
      'UFO74: jesucristo, kid. acabas de reventarlo todo.',
    '       the aliens AND the conspiracies.': '       los alienígenas Y las conspiraciones.',
    '       the world is gonna lose its mind.': '       el mundo va a perder la cabeza.',
    '  Understood. Proceeding with alien evidence only.':
      '  Entendido. Siguiendo solo con la evidencia alienígena.',
    'UFO74: smart choice. one bombshell at a time.': 'UFO74: buena elección. una bomba cada vez.',
    '       the conspiracy stuff can wait.': '       lo de la conspiración puede esperar.',
    '  Please clarify:': '  Acláralo, por favor:',
    '  Type "leak all" to release ALL documents.':
      '  Escribe "leak all" para soltar TODOS los documentos.',
  },
};

const RUNTIME_TRANSLATIONS_WAVE_2: Record<Exclude<Language, 'en'>, RuntimeDictionary> = {
  'pt-BR': {
    '    _____': '    _____',
    '    → "Your family\'s safety depends on silence"':
      '    → "A segurança da sua família depende do silêncio"',
    '    |||||              — A. Einstein': '    |||||              — A. Einstein',
    '    |||||     mas uma bem persistente.': '    |||||     mas uma bem persistente.',
    '    C - O - L - H - E - I - T - A': '    C - O - L - H - E - I - T - A',
    '    cp "$evidence" /external/backup/': '    cp "$evidence" /external/backup/',
    '    echo "[OK] $(basename $evidence) saved"': '    echo "[OK] $(basename $evidence) saved"',
    '   /     \\    "O BRASIL É O PAÍS DO FUTURO"': '   /     \\    "O BRASIL É O PAÍS DO FUTURO"',
    '   \\  ^  /    A realidade é só uma ilusão,': '   \\  ^  /    A realidade é só uma ilusão,',
    '   We appreciate the community\'s understanding."':
      '   Agradecemos a compreensão da comunidade."',
    "  - Varginha remains the region's logistics hub":
      '  - Varginha continua sendo o polo logístico da região',
    '  -.-. --- .-.. .... . .. - .-': '  -.-. --- .-.. .... . .. - .-',
    '  "Thirty rotations" interpreted as 30 Earth years.':
      '  "Thirty rotations" interpretado como 30 anos terrestres.',
    '  [RESTRICTED] ................... ext. 9999': '  [RESTRITO] ..................... ramal 9999',
    '  <BLINK>UNDER CONSTRUCTION</BLINK>': '  <BLINK>EM CONSTRUÇÃO</BLINK>',
    '  > cd /comms/psi': '  > cd /comms/psi',
    '  > cd /storage/quarantine': '  > cd /storage/quarantine',
    '  > connect autopsy_alpha.log transcript_core.enc':
      '  > connect autopsy_alpha.log transcript_core.enc',
    '  > open autopsy_alpha.log': '  > open autopsy_alpha.log',
    '  > open bio_container.log': '  > open bio_container.log',
    '  > open transcript_core.enc': '  > open transcript_core.enc',
    '  | () () |': '  | () () |',
    '  03-JAN: SANTOS, Maria (Admin)': '  03-JAN: SANTOS, Maria (Administração)',
    '  08-JAN: OLIVEIRA, Paulo (Facilities)': '  08-JAN: OLIVEIRA, Paulo (Infraestrutura)',
    '  12-JAN: RIBEIRO, Ana (Records)': '  12-JAN: RIBEIRO, Ana (Registros)',
    '  17-JAN: FERREIRA, João (Security)': '  17-JAN: FERREIRA, João (Segurança)',
    '  24-JAN: [REDACTED] (Ops)': '  24-JAN: [REDACTED] (Operações)',
    '  29-JAN: COSTA, Lucia (Reception)': '  29-JAN: COSTA, Lucia (Recepção)',
    '  A: .-      N: -.      0: -----': '  A: .-      N: -.      0: -----',
    '  Administrative Services ........ ext. 2100': '  Serviços Administrativos ....... ramal 2100',
    '  ALMEIDA, C. ............ 25-MAR to 05-APR': '  ALMEIDA, C. ............ 25-MAR a 05-APR',
    '  autopsy_alpha.log           7D0C-FF22-919B': '  autopsy_alpha.log           7D0C-FF22-919B',
    '  B: -...    O: ---     1: .----': '  B: -...    O: ---     1: .----',
    '  Base date: 1996.': '  Data-base: 1996.',
    "  Brazil's premier arabica production zone.":
      '  Principal zona de produção de arábica do Brasil.',
    '  C: -.-.    P: .--.    2: ..---': '  C: -.-.    P: .--.    2: ..---',
    '  CARVALHO, M. ........... 26-FEB to 08-MAR': '  CARVALHO, M. ........... 26-FEB a 08-MAR',
    '  COSTA, L. .............. 05-FEB to 16-FEB': '  COSTA, L. .............. 05-FEB a 16-FEB',
    '  D: -..     Q: --.-    3: ...--': '  D: -..     Q: --.-    3: ...--',
    '  Deputy Director ................ ext. 2002': '  Vice-Diretor ................... ramal 2002',
    '  Director Office ................ ext. 2001': '  Gabinete do Diretor ............ ramal 2001',
    '  E: .       R: .-.     4: ....-': '  E: .       R: .-.     4: ....-',
    '  Equipment:           R$  38,500.00': '  Equipamentos:        R$  38,500.00',
    '  F: ..-.    S: ...     5: .....': '  F: ..-.    S: ...     5: .....',
    '  Facilities ..................... ext. 4100': '  Infraestrutura ................. ramal 4100',
    '  FERREIRA, R. ........... 12-FEB to 23-FEB': '  FERREIRA, R. ........... 12-FEB a 23-FEB',
    '  Field Coordination ............. ext. 3100': '  Coordenação de Campo ........... ramal 3100',
    '  FULL DISCLOSURE INITIATED': '  DIVULGAÇÃO TOTAL INICIADA',
    '  G: --.     T: -       6: -....': '  G: --.     T: -       6: -....',
    '  H: ....    U: ..-     7: --...': '  H: ....    U: ..-     7: --...',
    '  I: ..      V: ...-    8: ---..': '  I: ..      V: ...-    8: ---..',
    '  IT Helpdesk .................... ext. 4000': '  Suporte de TI .................. ramal 4000',
    '  J: .---    W: .--     9: ----.': '  J: .---    W: .--     9: ----.',
    '  K: -.-     X: -..-': '  K: -.-     X: -..-',
    '  L: .-..    Y: -.--': '  L: .-..    Y: -.--',
    '  LIMA, A. ............... 19-FEB to 01-MAR': '  LIMA, A. ............... 19-FEB a 01-MAR',
    '  M: --      Z: --..': '  M: --      Z: --..',
    '  Maintenance:         R$  15,800.00': '  Manutenção:          R$  15,800.00',
    '  material_x_analysis.dat     4A9F-77C2-11D0': '  material_x_analysis.dat     4A9F-77C2-11D0',
    '  Medical (B-3) .................. ext. 4200': '  Médico (B-3) ................... ramal 4200',
    '  Miscellaneous:       R$   8,500.00': '  Diversos:            R$   8,500.00',
    '  NASCIMENTO, R. ......... [CANCELLED - INCIDENT]':
      '  NASCIMENTO, R. ......... [CANCELADO - INCIDENTE]',
    '  OLIVEIRA, P. ........... 02-JAN to 12-JAN': '  OLIVEIRA, P. ........... 02-JAN a 12-JAN',
    '  Ops Center (24h) ............... ext. 3000': '  Centro de Operações (24h) ...... ramal 3000',
    '  override <authorization_code>': '  override <authorization_code>',
    '  PEREIRA, F. ............ 18-MAR to 29-MAR': '  PEREIRA, F. ............ 18-MAR a 29-MAR',
    '  Personnel:           R$ 142,000.00': '  Pessoal:             R$ 142,000.00',
    '  PGP Key: 0xDEADBEEF': '  PGP Key: 0xDEADBEEF',
    '  PHASE ███ IS ██████ UNDERWAY': '  A FASE ███ JÁ ESTÁ EM ANDAMENTO',
    "  Pressure points: Mother's health, job security":
      '  Pontos de pressão: saúde da mãe, estabilidade no emprego',
    '  Projected window: 2026.': '  Janela projetada: 2026.',
    '  QUANTUM HANDSHAKE': '  HANDSHAKE QUÂNTICO',
    '  RIBEIRO, J.S. .......... 15-JAN to 26-JAN': '  RIBEIRO, J.S. .......... 15-JAN a 26-JAN',
    '  SANTOS, M. ............. 08-JAN to 15-JAN': '  SANTOS, M. ............. 08-JAN a 15-JAN',
    '  SILVA, R. .............. 04-MAR to 15-MAR': '  SILVA, R. .............. 04-MAR a 15-MAR',
    '  streber@bbs.unesp.br': '  streber@bbs.unesp.br',
    "  Subject's exposure to recovered fauna specimen":
      '  Exposição do sujeito ao espécime de fauna recuperado',
    "  Subject's husband works at state university":
      '  O marido da pessoa-alvo trabalha na universidade estadual',
    '  thirty_year_cycle.txt       2D88-AC91-771E': '  thirty_year_cycle.txt       2D88-AC91-771E',
    '  TOTAL:               R$ 226,000.00': '  TOTAL:               R$ 226,000.00',
    '  transcript_core.enc         61E4-09D3-2B7F': '  transcript_core.enc         61E4-09D3-2B7F',
    '  Transport Pool ................. ext. 3200': '  Frota de Transporte ............ ramal 3200',
    '  transport_log_96.txt        98B1-2E14-CC7A': '  transport_log_96.txt        98B1-2E14-CC7A',
    '  Travel:              R$  21,200.00': '  Viagens:             R$  21,200.00',
    '-- ': '-- ',
    '[20/01/96 02:17:33]': '[20/01/96 02:17:33]',
    '[20/01/96 02:19:01]': '[20/01/96 02:19:01]',
    '[20/01/96 02:22:45]': '[20/01/96 02:22:45]',
    '[20/01/96 02:41:12]': '[20/01/96 02:41:12]',
    '[20/01/96 02:43:08]': '[20/01/96 02:43:08]',
    '[20/01/96 02:44:55]': '[20/01/96 02:44:55]',
    '[20/01/96 02:45:30]': '[20/01/96 02:45:30]',
    '[20/01/96 02:47:18]': '[20/01/96 02:47:18]',
    '[20/01/96 02:48:02]': '[20/01/96 02:48:02]',
    '[20/01/96 03:12:00]': '[20/01/96 03:12:00]',
    '[20/01/96 03:15:22]': '[20/01/96 03:15:22]',
    '#   Execute with: run purge_trace.sh': '#   Execute with: run purge_trace.sh',
    '#   Execute with: run save_evidence.sh': '#   Execute with: run save_evidence.sh',
    '# ───────────────────────────────────────────────────────────':
      '# ───────────────────────────────────────────────────────────',
    '# ═══════════════════════════════════════════════════════════':
      '# ═══════════════════════════════════════════════════════════',
    '# Created by: UFO74': '# Created by: UFO74',
    '# Date: [TIMESTAMP REDACTED]': '# Date: [TIMESTAMP REDACTED]',
    '# INSTRUCTIONS:': '# INSTRUCTIONS:',
    '# Save critical documents': '# Save critical documents',
    '#!/bin/bash': '#!/bin/bash',
    '<mineiro99> foi roubado irmao': '<mineiro99> foi roubado irmao',
    '<nightowl> mudando de assunto, alguem tem o driver da soundblaster?':
      '<nightowl> mudando de assunto, alguem tem o driver da soundblaster?',
    '<shadow_man> qual jogo': '<shadow_man> qual jogo',
    '<streber74> alguem viu o jogo ontem?': '<streber74> alguem viu o jogo ontem?',
    '<streber74> cruzeiro x atletico. 2 a 1 pra raposa':
      '<streber74> cruzeiro x atletico. 2 a 1 pra raposa',
    '<streber74> kkkk sempre a mesma coisa': '<streber74> kkkk sempre a mesma coisa',
    '<streber74> tenho. manda dcc.': '<streber74> tenho. manda dcc.',
    '═══ ELUSIVE MAN INTERROGATION ═══': '═══ INTERROGATÓRIO DO HOMEM ELUSIVO ═══',
    '═══ END RECOVERED CONTENT ═══': '═══ FIM DO CONTEÚDO RECUPERADO ═══',
    '═══ RECOVERED CONTENT ═══': '═══ CONTEÚDO RECUPERADO ═══',
    '═══ SIGNAL DECODED ═══': '═══ SINAL DECODIFICADO ═══',
    '═══ SIGNAL ENDS ═══': '═══ FIM DO SINAL ═══',
    '═══ STREAM BEGIN ═══': '═══ INÍCIO DO FLUXO ═══',
    '═══ STREAM TERMINATED — SUBJECT EXPIRED ═══': '═══ FLUXO ENCERRADO — SUJEITO EXPIROU ═══',
    '═══ TRANSCRIPT BEGIN ═══': '═══ INÍCIO DA TRANSCRIÇÃO ═══',
    '═══ TRANSCRIPT ENDS ═══': '═══ FIM DA TRANSCRIÇÃO ═══',
    '▓▓▓ EMERGENCY BROADCAST — INTERCEPTED ▓▓▓': '▓▓▓ TRANSMISSÃO DE EMERGÊNCIA — INTERCEPTADA ▓▓▓',
    '▓▓▓ INTERCEPTED SIGNAL — PRIORITY ULTRA ▓▓▓': '▓▓▓ SINAL INTERCEPTADO — PRIORIDADE ULTRA ▓▓▓',
    '▓▓▓ RAW NEURAL CAPTURE — SPECIMEN ALFA ▓▓▓': '▓▓▓ CAPTURA NEURAL BRUTA — ESPÉCIME ALFA ▓▓▓',
    '▓▓▓ RECONSTRUCTED DATA — NEURAL FRAGMENT ▓▓▓':
      '▓▓▓ DADOS RECONSTRUÍDOS — FRAGMENTO NEURAL ▓▓▓',
    '02-JAN    SILVA, R.     45,230   45,248   City center':
      '02-JAN    SILVA, R.     45,230   45,248   Centro da cidade',
    '05-JAN    COSTA, M.     45,248   45,312   Airport':
      '05-JAN    COSTA, M.     45,248   45,312   Aeroporto',
    '06-07 JAN: SILVA, R. / OLIVEIRA, P.': '06-07 JAN: SILVA, R. / OLIVEIRA, P.',
    '09-JAN    LIMA, A.      45,312   45,340   Regional office':
      '09-JAN    LIMA, A.      45,312   45,340   Escritório regional',
    '13-14 JAN: SANTOS, M. / COSTA, L.': '13-14 JAN: SANTOS, M. / COSTA, L.',
    '15-JAN    SANTOS, P.    45,340   45,356   Supplier visit':
      '15-JAN    SANTOS, P.    45,340   45,356   Visita a fornecedor',
    '18:42:03 ATDT 0xx-555-0147': '18:42:03 ATDT 0xx-555-0147',
    '18:42:07 CONNECT 28800/ARQ/V34/LAPM/V42BIS': '18:42:07 CONNECT 28800/ARQ/V34/LAPM/V42BIS',
    '18:42:09 Carrier detected': '18:42:09 Portadora detectada',
    '18:42:12 PPP negotiation started': '18:42:12 Negociação PPP iniciada',
    '18:42:15 IP assigned: 200.xxx.xxx.47': '18:42:15 IP atribuído: 200.xxx.xxx.47',
    '18:42:16 Connection established': '18:42:16 Conexão estabelecida',
    '18:43:01 HTTP GET http://www.geocities.com/SiliconValley/...':
      '18:43:01 HTTP GET http://www.geocities.com/SiliconValley/...',
    '18:43:47 HTTP GET http://www.altavista.digital.com/...':
      '18:43:47 HTTP GET http://www.altavista.digital.com/...',
    '18:44:22 TELNET bbs.minas.com.br:23': '18:44:22 TELNET bbs.minas.com.br:23',
    '18:45:01 FILE TRANSFER: futebol_stats_95.txt (12KB)':
      '18:45:01 TRANSFERÊNCIA DE ARQUIVO: futebol_stats_95.txt (12KB)',
    '18:45:33 HTTP GET http://www.webcrawler.com/...':
      '18:45:33 HTTP GET http://www.webcrawler.com/...',
    '18:46:12 IRC CONNECT irc.brasnet.org #bate-papo':
      '18:46:12 CONEXÃO IRC irc.brasnet.org #bate-papo',
    '18:58:44 Connection terminated by remote host': '18:58:44 Conexão encerrada pelo host remoto',
    '18:58:44 NO CARRIER': '18:58:44 NO CARRIER',
    '19-JAN    [CLASSIFIED]  45,356   45,498   [CLASSIFIED]':
      '19-JAN    [CLASSIFIED]  45,356   45,498   [CLASSIFIED]',
    '20-JAN    [CLASSIFIED]  45,498   45,512   [CLASSIFIED]':
      '20-JAN    [CLASSIFIED]  45,498   45,512   [CLASSIFIED]',
    '21-JAN    [CLASSIFIED]  45,512   45,687   [CLASSIFIED]':
      '21-JAN    [CLASSIFIED]  45,512   45,687   [CLASSIFIED]',
    '23-JAN    COSTA, M.     45,687   45,720   Airport':
      '23-JAN    COSTA, M.     45,687   45,720   Aeroporto',
    '27-28 JAN: FERREIRA, J. / LIMA, A.': '27-28 JAN: FERREIRA, J. / LIMA, A.',
    'Acceptable.': 'Aceitável.',
    'Activate god mode': 'Ative o modo deus',
    'Adequate.': 'Adequado.',
    'ANALYST: J.S. RIBEIRO': 'ANALISTA: J.S. RIBEIRO',
    'Assessment:': 'Avaliação:',
    'AUDIO FILE: /audio/morse_intercept.wav': 'ARQUIVO DE ÁUDIO: /audio/morse_intercept.wav',
    'AV-3847,Columba livia,NORTHEAST,94%,AUDIO/VIDEO':
      'AV-3847,Columba livia,NORDESTE,94%,ÁUDIO/VÍDEO',
    'AV-3848,Columba livia,NORTHEAST,91%,AUDIO/VIDEO':
      'AV-3848,Columba livia,NORDESTE,91%,ÁUDIO/VÍDEO',
    'AV-4102,Sturnus vulgaris,MIDWEST,88%,AUDIO ONLY':
      'AV-4102,Sturnus vulgaris,CENTRO-OESTE,88%,APENAS ÁUDIO',
    'AV-4103,Sturnus vulgaris,MIDWEST,92%,AUDIO ONLY':
      'AV-4103,Sturnus vulgaris,CENTRO-OESTE,92%,APENAS ÁUDIO',
    'AV-4104,Sturnus vulgaris,MIDWEST,86%,AUDIO/VIDEO':
      'AV-4104,Sturnus vulgaris,CENTRO-OESTE,86%,ÁUDIO/VÍDEO',
    'AV-5001,Corvus brachyrhynchos,WEST,95%,FULL SUITE':
      'AV-5001,Corvus brachyrhynchos,OESTE,95%,PACOTE COMPLETO',
    'AV-5002,Corvus brachyrhynchos,WEST,89%,FULL SUITE':
      'AV-5002,Corvus brachyrhynchos,OESTE,89%,PACOTE COMPLETO',
    'AV-6110,Turdus migratorius,SOUTH,91%,AUDIO/VIDEO':
      'AV-6110,Turdus migratorius,SUL,91%,ÁUDIO/VÍDEO',
    'AV-6111,Turdus migratorius,SOUTH,93%,AUDIO/VIDEO':
      'AV-6111,Turdus migratorius,SUL,93%,ÁUDIO/VÍDEO',
    'AV-6112,Turdus migratorius,SOUTH,87%,THERMAL': 'AV-6112,Turdus migratorius,SUL,87%,TÉRMICO',
    'CLERK: T. SANTOS': 'ESCRITURÁRIO: T. SANTOS',
    CONTAINMENT: 'CONTENÇÃO',
    'Continue.': 'Continue.',
    CONVERGENCE: 'CONVERGÊNCIA',
    'Correct.': 'Correto.',
    'DATE: 08-JAN-1996': 'DATA: 08-JAN-1996',
    'DATE: 10-JAN-1996': 'DATA: 10-JAN-1996',
    'DATE: 16-JAN-1996': 'DATA: 16-JAN-1996',
    DEBRIS: 'DESTROÇOS',
    'Decode the ROT13 cipher. What is the first word of the decoded message?':
      'Decodifique a cifra ROT13. Qual é a primeira palavra da mensagem decodificada?',
    done: 'done',
    'echo ""': 'echo ""',
    'echo "[OK] ROUTE_TABLE scrubbed"': 'echo "[OK] ROUTE_TABLE scrubbed"',
    'echo "[OK] SESSION_LOG truncated"': 'echo "[OK] SESSION_LOG truncated"',
    'echo "[OK] TRACE_QUEUE cleared"': 'echo "[OK] TRACE_QUEUE cleared"',
    'echo "Backup complete. Evidence persisted."': 'echo "Backup complete. Evidence persisted."',
    'echo "Initiating emergency backup..."': 'echo "Initiating emergency backup..."',
    'echo "NOTICE: Countermeasures reset. Expect re-scan."':
      'echo "NOTICE: Countermeasures reset. Expect re-scan."',
    'echo "PURGE: Initiating trace buffer wipe..."':
      'echo "PURGE: Initiating trace buffer wipe..."',
    'echo "WARNING: Disconnection imminent..."': 'echo "WARNING: Disconnection imminent..."',
    'ESTADO DE MINAS — 28-FEB-1996': 'ESTADO DE MINAS — 28-FEB-1996',
    'FOLHA DE SÃO PAULO — 15-FEB-1996': 'FOLHA DE SÃO PAULO — 15-FEB-1996',
    'for evidence in /collected/*.dat; do': 'for evidence in /collected/*.dat; do',
    FOREIGN: 'ESTRANGEIRO',
    'O GLOBO — 22-FEB-1996': 'O GLOBO — 22-FEB-1996',
    'Precisely.': 'Precisamente.',
    'PSI-COMM': 'PSI-COMM',
    'Recommendation:': 'Recomendação:',
    'ROT13 shifts each letter by 13 positions. "Pneqb" becomes...':
      'ROT13 desloca cada letra em 13 posições. "Pneqb" vira...',
    'STATUS: DELETED FROM ALL SYSTEMS': 'STATUS: EXCLUÍDO DE TODOS OS SISTEMAS',
    'TECHNICIAN: M. CARVALHO': 'TÉCNICO: M. CARVALHO',
    'Verified.': 'Verificado.',
  },
  es: {
    '    _____': '    _____',
    '    → "Your family\'s safety depends on silence"':
      '    → "La seguridad de tu familia depende del silencio"',
    '    |||||              — A. Einstein': '    |||||              — A. Einstein',
    '    |||||     mas uma bem persistente.': '    |||||     pero una bastante persistente.',
    '    C - O - L - H - E - I - T - A': '    C - O - L - H - E - I - T - A',
    '    cp "$evidence" /external/backup/': '    cp "$evidence" /external/backup/',
    '    echo "[OK] $(basename $evidence) saved"': '    echo "[OK] $(basename $evidence) saved"',
    '   /     \\    "O BRASIL É O PAÍS DO FUTURO"': '   /     \\    "BRASIL ES EL PAÍS DEL FUTURO"',
    '   \\  ^  /    A realidade é só uma ilusão,':
      '   \\  ^  /    La realidad es solo una ilusión,',
    '   We appreciate the community\'s understanding."':
      '   Agradecemos la comprensión de la comunidad."',
    "  - Varginha remains the region's logistics hub":
      '  - Varginha sigue siendo el centro logístico de la región',
    '  -.-. --- .-.. .... . .. - .-': '  -.-. --- .-.. .... . .. - .-',
    '  "Thirty rotations" interpreted as 30 Earth years.':
      '  "Thirty rotations" interpretado como 30 años terrestres.',
    '  [RESTRICTED] ................... ext. 9999': '  [RESTRINGIDO] ................. ext. 9999',
    '  <BLINK>UNDER CONSTRUCTION</BLINK>': '  <BLINK>EN CONSTRUCCIÓN</BLINK>',
    '  > cd /comms/psi': '  > cd /comms/psi',
    '  > cd /storage/quarantine': '  > cd /storage/quarantine',
    '  > connect autopsy_alpha.log transcript_core.enc':
      '  > connect autopsy_alpha.log transcript_core.enc',
    '  > open autopsy_alpha.log': '  > open autopsy_alpha.log',
    '  > open bio_container.log': '  > open bio_container.log',
    '  > open transcript_core.enc': '  > open transcript_core.enc',
    '  | () () |': '  | () () |',
    '  03-JAN: SANTOS, Maria (Admin)': '  03-JAN: SANTOS, Maria (Administración)',
    '  08-JAN: OLIVEIRA, Paulo (Facilities)': '  08-JAN: OLIVEIRA, Paulo (Instalaciones)',
    '  12-JAN: RIBEIRO, Ana (Records)': '  12-JAN: RIBEIRO, Ana (Registros)',
    '  17-JAN: FERREIRA, João (Security)': '  17-JAN: FERREIRA, João (Seguridad)',
    '  24-JAN: [REDACTED] (Ops)': '  24-JAN: [REDACTED] (Operaciones)',
    '  29-JAN: COSTA, Lucia (Reception)': '  29-JAN: COSTA, Lucia (Recepción)',
    '  A: .-      N: -.      0: -----': '  A: .-      N: -.      0: -----',
    '  Administrative Services ........ ext. 2100': '  Servicios Administrativos ...... ext. 2100',
    '  ALMEIDA, C. ............ 25-MAR to 05-APR': '  ALMEIDA, C. ............ 25-MAR al 05-APR',
    '  autopsy_alpha.log           7D0C-FF22-919B': '  autopsy_alpha.log           7D0C-FF22-919B',
    '  B: -...    O: ---     1: .----': '  B: -...    O: ---     1: .----',
    '  Base date: 1996.': '  Fecha base: 1996.',
    "  Brazil's premier arabica production zone.":
      '  Principal zona de producción de arábica de Brasil.',
    '  C: -.-.    P: .--.    2: ..---': '  C: -.-.    P: .--.    2: ..---',
    '  CARVALHO, M. ........... 26-FEB to 08-MAR': '  CARVALHO, M. ........... 26-FEB al 08-MAR',
    '  COSTA, L. .............. 05-FEB to 16-FEB': '  COSTA, L. .............. 05-FEB al 16-FEB',
    '  D: -..     Q: --.-    3: ...--': '  D: -..     Q: --.-    3: ...--',
    '  Deputy Director ................ ext. 2002': '  Subdirector .................... ext. 2002',
    '  Director Office ................ ext. 2001': '  Oficina del Director ........... ext. 2001',
    '  E: .       R: .-.     4: ....-': '  E: .       R: .-.     4: ....-',
    '  Equipment:           R$  38,500.00': '  Equipo:              R$  38,500.00',
    '  F: ..-.    S: ...     5: .....': '  F: ..-.    S: ...     5: .....',
    '  Facilities ..................... ext. 4100': '  Instalaciones .................. ext. 4100',
    '  FERREIRA, R. ........... 12-FEB to 23-FEB': '  FERREIRA, R. ........... 12-FEB al 23-FEB',
    '  Field Coordination ............. ext. 3100': '  Coordinación de Campo .......... ext. 3100',
    '  FULL DISCLOSURE INITIATED': '  DIVULGACIÓN TOTAL INICIADA',
    '  G: --.     T: -       6: -....': '  G: --.     T: -       6: -....',
    '  H: ....    U: ..-     7: --...': '  H: ....    U: ..-     7: --...',
    '  I: ..      V: ...-    8: ---..': '  I: ..      V: ...-    8: ---..',
    '  IT Helpdesk .................... ext. 4000': '  Soporte TI ..................... ext. 4000',
    '  J: .---    W: .--     9: ----.': '  J: .---    W: .--     9: ----.',
    '  K: -.-     X: -..-': '  K: -.-     X: -..-',
    '  L: .-..    Y: -.--': '  L: .-..    Y: -.--',
    '  LIMA, A. ............... 19-FEB to 01-MAR': '  LIMA, A. ............... 19-FEB al 01-MAR',
    '  M: --      Z: --..': '  M: --      Z: --..',
    '  Maintenance:         R$  15,800.00': '  Mantenimiento:       R$  15,800.00',
    '  material_x_analysis.dat     4A9F-77C2-11D0': '  material_x_analysis.dat     4A9F-77C2-11D0',
    '  Medical (B-3) .................. ext. 4200': '  Médico (B-3) ................... ext. 4200',
    '  Miscellaneous:       R$   8,500.00': '  Varios:              R$   8,500.00',
    '  NASCIMENTO, R. ......... [CANCELLED - INCIDENT]':
      '  NASCIMENTO, R. ......... [CANCELADO - INCIDENTE]',
    '  OLIVEIRA, P. ........... 02-JAN to 12-JAN': '  OLIVEIRA, P. ........... 02-JAN al 12-JAN',
    '  Ops Center (24h) ............... ext. 3000': '  Centro de Operaciones (24h) .... ext. 3000',
    '  override <authorization_code>': '  override <authorization_code>',
    '  PEREIRA, F. ............ 18-MAR to 29-MAR': '  PEREIRA, F. ............ 18-MAR al 29-MAR',
    '  Personnel:           R$ 142,000.00': '  Personal:            R$ 142,000.00',
    '  PGP Key: 0xDEADBEEF': '  PGP Key: 0xDEADBEEF',
    '  PHASE ███ IS ██████ UNDERWAY': '  LA FASE ███ YA ESTÁ EN MARCHA',
    "  Pressure points: Mother's health, job security":
      '  Puntos de presión: salud de la madre, estabilidad laboral',
    '  Projected window: 2026.': '  Ventana proyectada: 2026.',
    '  QUANTUM HANDSHAKE': '  HANDSHAKE CUÁNTICO',
    '  RIBEIRO, J.S. .......... 15-JAN to 26-JAN': '  RIBEIRO, J.S. .......... 15-JAN al 26-JAN',
    '  SANTOS, M. ............. 08-JAN to 15-JAN': '  SANTOS, M. ............. 08-JAN al 15-JAN',
    '  SILVA, R. .............. 04-MAR to 15-MAR': '  SILVA, R. .............. 04-MAR al 15-MAR',
    '  streber@bbs.unesp.br': '  streber@bbs.unesp.br',
    "  Subject's exposure to recovered fauna specimen":
      '  Exposición del sujeto al espécimen de fauna recuperado',
    "  Subject's husband works at state university":
      '  El esposo del sujeto trabaja en la universidad estatal',
    '  thirty_year_cycle.txt       2D88-AC91-771E': '  thirty_year_cycle.txt       2D88-AC91-771E',
    '  TOTAL:               R$ 226,000.00': '  TOTAL:               R$ 226,000.00',
    '  transcript_core.enc         61E4-09D3-2B7F': '  transcript_core.enc         61E4-09D3-2B7F',
    '  Transport Pool ................. ext. 3200': '  Flota de Transporte ............ ext. 3200',
    '  transport_log_96.txt        98B1-2E14-CC7A': '  transport_log_96.txt        98B1-2E14-CC7A',
    '  Travel:              R$  21,200.00': '  Viajes:              R$  21,200.00',
    '-- ': '-- ',
    '[20/01/96 02:17:33]': '[20/01/96 02:17:33]',
    '[20/01/96 02:19:01]': '[20/01/96 02:19:01]',
    '[20/01/96 02:22:45]': '[20/01/96 02:22:45]',
    '[20/01/96 02:41:12]': '[20/01/96 02:41:12]',
    '[20/01/96 02:43:08]': '[20/01/96 02:43:08]',
    '[20/01/96 02:44:55]': '[20/01/96 02:44:55]',
    '[20/01/96 02:45:30]': '[20/01/96 02:45:30]',
    '[20/01/96 02:47:18]': '[20/01/96 02:47:18]',
    '[20/01/96 02:48:02]': '[20/01/96 02:48:02]',
    '[20/01/96 03:12:00]': '[20/01/96 03:12:00]',
    '[20/01/96 03:15:22]': '[20/01/96 03:15:22]',
    '#   Execute with: run purge_trace.sh': '#   Execute with: run purge_trace.sh',
    '#   Execute with: run save_evidence.sh': '#   Execute with: run save_evidence.sh',
    '# ───────────────────────────────────────────────────────────':
      '# ───────────────────────────────────────────────────────────',
    '# ═══════════════════════════════════════════════════════════':
      '# ═══════════════════════════════════════════════════════════',
    '# Created by: UFO74': '# Created by: UFO74',
    '# Date: [TIMESTAMP REDACTED]': '# Date: [TIMESTAMP REDACTED]',
    '# INSTRUCTIONS:': '# INSTRUCTIONS:',
    '# Save critical documents': '# Save critical documents',
    '#!/bin/bash': '#!/bin/bash',
    '<mineiro99> foi roubado irmao': '<mineiro99> nos robaron hermano',
    '<nightowl> mudando de assunto, alguem tem o driver da soundblaster?':
      '<nightowl> cambiando de tema, alguien tiene el driver de la soundblaster?',
    '<shadow_man> qual jogo': '<shadow_man> cual partido',
    '<streber74> alguem viu o jogo ontem?': '<streber74> alguien vio el partido ayer?',
    '<streber74> cruzeiro x atletico. 2 a 1 pra raposa':
      '<streber74> cruzeiro x atletico. 2 a 1 para raposa',
    '<streber74> kkkk sempre a mesma coisa': '<streber74> jaja siempre lo mismo',
    '<streber74> tenho. manda dcc.': '<streber74> yo lo tengo. manda dcc.',
    '═══ ELUSIVE MAN INTERROGATION ═══': '═══ INTERROGATORIO DEL HOMBRE ELUSIVO ═══',
    '═══ END RECOVERED CONTENT ═══': '═══ FIN DEL CONTENIDO RECUPERADO ═══',
    '═══ RECOVERED CONTENT ═══': '═══ CONTENIDO RECUPERADO ═══',
    '═══ SIGNAL DECODED ═══': '═══ SEÑAL DECODIFICADA ═══',
    '═══ SIGNAL ENDS ═══': '═══ FIN DE LA SEÑAL ═══',
    '═══ STREAM BEGIN ═══': '═══ INICIO DEL FLUJO ═══',
    '═══ STREAM TERMINATED — SUBJECT EXPIRED ═══': '═══ FLUJO TERMINADO — EL SUJETO EXPIRÓ ═══',
    '═══ TRANSCRIPT BEGIN ═══': '═══ INICIO DE LA TRANSCRIPCIÓN ═══',
    '═══ TRANSCRIPT ENDS ═══': '═══ FIN DE LA TRANSCRIPCIÓN ═══',
    '▓▓▓ EMERGENCY BROADCAST — INTERCEPTED ▓▓▓': '▓▓▓ TRANSMISIÓN DE EMERGENCIA — INTERCEPTADA ▓▓▓',
    '▓▓▓ INTERCEPTED SIGNAL — PRIORITY ULTRA ▓▓▓': '▓▓▓ SEÑAL INTERCEPTADA — PRIORIDAD ULTRA ▓▓▓',
    '▓▓▓ RAW NEURAL CAPTURE — SPECIMEN ALFA ▓▓▓':
      '▓▓▓ CAPTURA NEURAL EN BRUTO — ESPÉCIMEN ALFA ▓▓▓',
    '▓▓▓ RECONSTRUCTED DATA — NEURAL FRAGMENT ▓▓▓':
      '▓▓▓ DATOS RECONSTRUIDOS — FRAGMENTO NEURAL ▓▓▓',
    '02-JAN    SILVA, R.     45,230   45,248   City center':
      '02-JAN    SILVA, R.     45,230   45,248   Centro de la ciudad',
    '05-JAN    COSTA, M.     45,248   45,312   Airport':
      '05-JAN    COSTA, M.     45,248   45,312   Aeropuerto',
    '06-07 JAN: SILVA, R. / OLIVEIRA, P.': '06-07 JAN: SILVA, R. / OLIVEIRA, P.',
    '09-JAN    LIMA, A.      45,312   45,340   Regional office':
      '09-JAN    LIMA, A.      45,312   45,340   Oficina regional',
    '13-14 JAN: SANTOS, M. / COSTA, L.': '13-14 JAN: SANTOS, M. / COSTA, L.',
    '15-JAN    SANTOS, P.    45,340   45,356   Supplier visit':
      '15-JAN    SANTOS, P.    45,340   45,356   Visita a proveedor',
    '18:42:03 ATDT 0xx-555-0147': '18:42:03 ATDT 0xx-555-0147',
    '18:42:07 CONNECT 28800/ARQ/V34/LAPM/V42BIS': '18:42:07 CONNECT 28800/ARQ/V34/LAPM/V42BIS',
    '18:42:09 Carrier detected': '18:42:09 Portadora detectada',
    '18:42:12 PPP negotiation started': '18:42:12 Negociación PPP iniciada',
    '18:42:15 IP assigned: 200.xxx.xxx.47': '18:42:15 IP asignada: 200.xxx.xxx.47',
    '18:42:16 Connection established': '18:42:16 Conexión establecida',
    '18:43:01 HTTP GET http://www.geocities.com/SiliconValley/...':
      '18:43:01 HTTP GET http://www.geocities.com/SiliconValley/...',
    '18:43:47 HTTP GET http://www.altavista.digital.com/...':
      '18:43:47 HTTP GET http://www.altavista.digital.com/...',
    '18:44:22 TELNET bbs.minas.com.br:23': '18:44:22 TELNET bbs.minas.com.br:23',
    '18:45:01 FILE TRANSFER: futebol_stats_95.txt (12KB)':
      '18:45:01 TRANSFERENCIA DE ARCHIVO: futebol_stats_95.txt (12KB)',
    '18:45:33 HTTP GET http://www.webcrawler.com/...':
      '18:45:33 HTTP GET http://www.webcrawler.com/...',
    '18:46:12 IRC CONNECT irc.brasnet.org #bate-papo':
      '18:46:12 CONEXIÓN IRC irc.brasnet.org #bate-papo',
    '18:58:44 Connection terminated by remote host':
      '18:58:44 Conexión terminada por el host remoto',
    '18:58:44 NO CARRIER': '18:58:44 NO CARRIER',
    '19-JAN    [CLASSIFIED]  45,356   45,498   [CLASSIFIED]':
      '19-JAN    [CLASSIFIED]  45,356   45,498   [CLASSIFIED]',
    '20-JAN    [CLASSIFIED]  45,498   45,512   [CLASSIFIED]':
      '20-JAN    [CLASSIFIED]  45,498   45,512   [CLASSIFIED]',
    '21-JAN    [CLASSIFIED]  45,512   45,687   [CLASSIFIED]':
      '21-JAN    [CLASSIFIED]  45,512   45,687   [CLASSIFIED]',
    '23-JAN    COSTA, M.     45,687   45,720   Airport':
      '23-JAN    COSTA, M.     45,687   45,720   Aeropuerto',
    '27-28 JAN: FERREIRA, J. / LIMA, A.': '27-28 JAN: FERREIRA, J. / LIMA, A.',
    'Acceptable.': 'Aceptable.',
    'Activate god mode': 'Activa el modo dios',
    'Adequate.': 'Adecuado.',
    'ANALYST: J.S. RIBEIRO': 'ANALISTA: J.S. RIBEIRO',
    'Assessment:': 'Evaluación:',
    'AUDIO FILE: /audio/morse_intercept.wav': 'ARCHIVO DE AUDIO: /audio/morse_intercept.wav',
    'AV-3847,Columba livia,NORTHEAST,94%,AUDIO/VIDEO':
      'AV-3847,Columba livia,NORESTE,94%,AUDIO/VIDEO',
    'AV-3848,Columba livia,NORTHEAST,91%,AUDIO/VIDEO':
      'AV-3848,Columba livia,NORESTE,91%,AUDIO/VIDEO',
    'AV-4102,Sturnus vulgaris,MIDWEST,88%,AUDIO ONLY':
      'AV-4102,Sturnus vulgaris,MEDIO OESTE,88%,SOLO AUDIO',
    'AV-4103,Sturnus vulgaris,MIDWEST,92%,AUDIO ONLY':
      'AV-4103,Sturnus vulgaris,MEDIO OESTE,92%,SOLO AUDIO',
    'AV-4104,Sturnus vulgaris,MIDWEST,86%,AUDIO/VIDEO':
      'AV-4104,Sturnus vulgaris,MEDIO OESTE,86%,AUDIO/VIDEO',
    'AV-5001,Corvus brachyrhynchos,WEST,95%,FULL SUITE':
      'AV-5001,Corvus brachyrhynchos,OESTE,95%,PAQUETE COMPLETO',
    'AV-5002,Corvus brachyrhynchos,WEST,89%,FULL SUITE':
      'AV-5002,Corvus brachyrhynchos,OESTE,89%,PAQUETE COMPLETO',
    'AV-6110,Turdus migratorius,SOUTH,91%,AUDIO/VIDEO':
      'AV-6110,Turdus migratorius,SUR,91%,AUDIO/VIDEO',
    'AV-6111,Turdus migratorius,SOUTH,93%,AUDIO/VIDEO':
      'AV-6111,Turdus migratorius,SUR,93%,AUDIO/VIDEO',
    'AV-6112,Turdus migratorius,SOUTH,87%,THERMAL': 'AV-6112,Turdus migratorius,SUR,87%,TÉRMICO',
    'CLERK: T. SANTOS': 'EMPLEADO: T. SANTOS',
    CONTAINMENT: 'CONTENCIÓN',
    'Continue.': 'Continúa.',
    CONVERGENCE: 'CONVERGENCIA',
    'Correct.': 'Correcto.',
    'DATE: 08-JAN-1996': 'FECHA: 08-JAN-1996',
    'DATE: 10-JAN-1996': 'FECHA: 10-JAN-1996',
    'DATE: 16-JAN-1996': 'FECHA: 16-JAN-1996',
    DEBRIS: 'RESTOS',
    'Decode the ROT13 cipher. What is the first word of the decoded message?':
      'Descifra el cifrado ROT13. ¿Cuál es la primera palabra del mensaje descifrado?',
    done: 'done',
    'echo ""': 'echo ""',
    'echo "[OK] ROUTE_TABLE scrubbed"': 'echo "[OK] ROUTE_TABLE scrubbed"',
    'echo "[OK] SESSION_LOG truncated"': 'echo "[OK] SESSION_LOG truncated"',
    'echo "[OK] TRACE_QUEUE cleared"': 'echo "[OK] TRACE_QUEUE cleared"',
    'echo "Backup complete. Evidence persisted."': 'echo "Backup complete. Evidence persisted."',
    'echo "Initiating emergency backup..."': 'echo "Initiating emergency backup..."',
    'echo "NOTICE: Countermeasures reset. Expect re-scan."':
      'echo "NOTICE: Countermeasures reset. Expect re-scan."',
    'echo "PURGE: Initiating trace buffer wipe..."':
      'echo "PURGE: Initiating trace buffer wipe..."',
    'echo "WARNING: Disconnection imminent..."': 'echo "WARNING: Disconnection imminent..."',
    'ESTADO DE MINAS — 28-FEB-1996': 'ESTADO DE MINAS — 28-FEB-1996',
    'FOLHA DE SÃO PAULO — 15-FEB-1996': 'FOLHA DE SÃO PAULO — 15-FEB-1996',
    'for evidence in /collected/*.dat; do': 'for evidence in /collected/*.dat; do',
    FOREIGN: 'EXTRANJERO',
    'O GLOBO — 22-FEB-1996': 'O GLOBO — 22-FEB-1996',
    'Precisely.': 'Precisamente.',
    'PSI-COMM': 'PSI-COMM',
    'Recommendation:': 'Recomendación:',
    'ROT13 shifts each letter by 13 positions. "Pneqb" becomes...':
      'ROT13 desplaza cada letra 13 posiciones. "Pneqb" se convierte en...',
    'STATUS: DELETED FROM ALL SYSTEMS': 'ESTADO: ELIMINADO DE TODOS LOS SISTEMAS',
    'TECHNICIAN: M. CARVALHO': 'TÉCNICO: M. CARVALHO',
    'Verified.': 'Verificado.',
  },
};

const RUNTIME_TRANSLATIONS_PRE_WAVE_4: Record<Exclude<Language, 'en'>, RuntimeDictionary> = {
  'pt-BR': {
    ...BASE_RUNTIME_TRANSLATIONS['pt-BR'],
    ...RUNTIME_TRANSLATIONS_SUPPLEMENTAL['pt-BR'],
    ...RUNTIME_COMMAND_SUPPLEMENT['pt-BR'],
    ...RUNTIME_TRANSLATIONS_WAVE_2['pt-BR'],
  },
  es: {
    ...BASE_RUNTIME_TRANSLATIONS.es,
    ...RUNTIME_TRANSLATIONS_SUPPLEMENTAL.es,
    ...RUNTIME_COMMAND_SUPPLEMENT.es,
    ...RUNTIME_TRANSLATIONS_WAVE_2.es,
  },
};

const RUNTIME_TRANSLATIONS_WAVE_4_KEYS = [
  '═══════════════════════════════════════════════════════════',
  'STANDARD OPERATING PROCEDURE — INCIDENT REVIEW',
  'DOCUMENT: SOP-IR-1989 (REV. 1994)',
  'CLASSIFICATION: INTERNAL USE',
  '',
  'PURPOSE:',
  '  This protocol establishes minimum requirements for',
  '  internal incident reconstruction and review.',
  'APPLICABILITY:',
  '  All personnel conducting post-incident assessment',
  '  via archived terminal access.',
  '───────────────────────────────────────────────────────────',
  'REVIEW DIMENSIONS',
  '  1. PHYSICAL ASSETS',
  '     Recovery, transport, and disposition of materials.',
  '     Cross-reference: storage/, ops/logistics/',
  '  2. EQUIPMENT AND MATERIEL',
  '     Inventory, condition assessment, and disposition.',
  '     Cross-reference: storage/assets/',
  '  3. COMMUNICATIONS',
  '     Signal intercepts, liaison activity, foreign contact.',
  '     Cross-reference: comms/',
  '  4. OVERSIGHT & COORDINATION',
  '     Multi-agency involvement, authorization chains.',
  '     Cross-reference: admin/',
  '  5. FORWARD RISK ASSESSMENT',
  '     Projected timelines, recurrence models, contingencies.',
  '     Cross-reference: admin/ (restricted)',
  'COMPLETION CRITERIA',
  '  A review is considered SUBSTANTIVE when the reviewer',
  '  has established coherent understanding across multiple',
  '  dimensions listed above.',
  '  Partial reviews are flagged as INCOMPLETE.',
  '  Reviews lacking cross-dimensional correlation are',
  '  flagged as INCOHERENT.',
  'REVIEWER OBLIGATIONS',
  '  - Reconstruct event timeline from available records',
  '  - Identify gaps in documentation or evidence',
  '  - Note discrepancies between official and raw records',
  '  - Assess forward implications if applicable',
  '  NOTE: Reviewers should expect classification barriers.',
  '  Some materials require elevated clearance or recovered access.',
  'END DOCUMENT',
  'TERMINAL ACCESS — SESSION PARAMETERS',
  'AUTO-GENERATED AT LOGIN',
  'ACCESS TYPE: Review Terminal (Legacy Archive)',
  'SESSION CLASS: Incident Reconstruction',
  'REMINDER:',
  '  This terminal provides read-only access to archived',
  '  incident records. Your session activity is logged.',
  'EXPECTED WORKFLOW:',
  '  1. Navigate directories to locate relevant records',
  '  2. Open and examine files for incident details',
  '  3. Open recovered files directly when access allows',
  '  4. Cross-reference multiple sources for correlation',
  '  5. Use TRACE to monitor system awareness (optional)',
  'COHERENCE NOTE:',
  '  Effective reviews demonstrate correlation between',
  '  physical evidence, subject records, communications,',
  '  and administrative oversight.',
  '  Random file access without correlation may trigger',
  '  session monitoring as anomalous behavior.',
  'INTERNAL MEMORANDUM — FACILITIES DIVISION',
  'DATE: 15-JAN-1996',
  'RE: Cafeteria Service Hours',
  'Effective 20-JAN-1996, cafeteria hours will be adjusted:',
  '  Breakfast: 06:30 - 08:30',
  '  Lunch: 11:30 - 13:30',
  '  Dinner: 17:30 - 19:30 (Tuesdays only)',
  'Staff working extended shifts may request meal vouchers',
  'from the Administrative Office (Room 204).',
  'The vending machines on Floor 3 remain operational 24h.',
  'Questions: Contact Facilities ext. 2240',
  'PARKING ALLOCATION — JANUARY 1996',
  'ADMINISTRATIVE SERVICES',
  'LOT A (Reserved):',
  '  A-01 through A-15: Director-level personnel',
  '  A-16 through A-20: Visiting officials',
  'LOT B (General):',
  '  First-come basis. Gates close at 22:00.',
  'NOTICE:',
  '  Effective 21-JAN, Lot B Section 3 will be closed',
  '  for resurfacing. Duration: 5 business days.',
  'Overflow parking available at municipal lot (200m east).',
  'Shuttle service discontinued due to budget constraints.',
  'BUDGET REQUEST — Q1 1996',
  'DEPARTMENT: Regional Intelligence (Sector 7)',
  'SUBMITTED: 08-JAN-1996',
  'REQUESTED ALLOCATIONS:',
  '  Personnel:           R$ 142,000.00',
  '  Equipment:           R$  38,500.00',
  '  Travel:              R$  21,200.00',
  '  Maintenance:         R$  15,800.00',
  '  Miscellaneous:       R$   8,500.00',
  '  ─────────────────────────────────',
  '  TOTAL:               R$ 226,000.00',
  'JUSTIFICATION:',
  '  Routine operations. No special projects anticipated.',
  'STATUS: PENDING APPROVAL',
  'NOTE: Request submitted BEFORE incident of 20-JAN.',
  '      Supplemental request to follow separately.',
  'INTERCEPT SUMMARY — DECEMBER 1995',
  'CLASSIFICATION: ROUTINE',
  'REGION: Minas Gerais / São Paulo Border',
  'TOTAL INTERCEPTS: 47',
  'FLAGGED FOR REVIEW: 3',
  'ACTIONABLE INTELLIGENCE: 0',
  'SUMMARY:',
  '  Agricultural price discussions (12)',
  '  Personal/family communications (28)',
  '  Commercial negotiations (5)',
  '  Political commentary (2)',
  'NOTES:',
  '  No unusual activity detected.',
  '  Recommend maintaining current monitoring level.',
  'ANALYST: J.S. RIBEIRO',
  'SIGNAL INTERCEPT — AUDIO CAPTURE',
  'DATE: 20-JAN-1996 03:47 LOCAL',
  'LOCATION: Triangulation point near recovery site',
  'CLASSIFICATION: RESTRICTED',
  'INTERCEPT TYPE: Morse code transmission',
  'FREQUENCY: 7.125 MHz (amateur band, unauthorized)',
  'DURATION: 8.4 seconds',
  'AUDIO FILE: /audio/morse_intercept.wav',
  'RAW SIGNAL TRANSCRIPTION:',
  '  -.-. --- .-.. .... . .. - .-',
  'MORSE CODE REFERENCE:',
  '  A: .-      N: -.      0: -----',
  '  B: -...    O: ---     1: .----',
  '  C: -.-.    P: .--.    2: ..---',
  '  D: -..     Q: --.-    3: ...--',
  '  E: .       R: .-.     4: ....-',
  '  F: ..-.    S: ...     5: .....',
  '  G: --.     T: -       6: -....',
  '  H: ....    U: ..-     7: --...',
  '  I: ..      V: ...-    8: ---..',
  '  J: .---    W: .--     9: ----.',
  '  K: -.-     X: -..-',
  '  L: .-..    Y: -.--',
  '  M: --      Z: --..',
  '  (Space between letters: 3 units)',
  '  (Space between words: 7 units)',
  'ANALYST NOTES:',
  '  Transmission origin unknown. Signal appeared on frequency',
  '  used by ground teams but NOT from any authorized unit.',
  '  Signal pre-dates official COMINT sweep by 6 hours.',
  "  Believe this is a field operator's authentication code.",
  '  NOTE: Cross-reference with admin override credentials.',
  '  Decode may yield system access passphrase.',
  '  PRIORITY: Decipher message content.',
  '  STATUS: PENDING INTERPRETATION',
  'HVAC MAINTENANCE LOG — BUILDING 3',
  'PERIOD: 01-JAN-1996 to 31-JAN-1996',
  '03-JAN: Filter replacement, Floor 2 units (routine)',
  '07-JAN: Compressor inspection, Rooftop Unit A (passed)',
  '12-JAN: Thermostat calibration, Room 317 (adjusted +2C)',
  '18-JAN: Duct cleaning, Basement level (completed)',
  '22-JAN: EMERGENCY — Basement cold storage unit failure',
  '        Cause: Power surge. Backup generator activated.',
  '        Duration of outage: 4 hours.',
  '        Estimated spoilage: CLASSIFIED',
  '25-JAN: Cold storage unit repaired. Testing satisfactory.',
  '28-JAN: Routine inspection, all floors (no issues)',
  'TECHNICIAN: M. CARVALHO',
  'PERSONNEL TRANSFER NOTICE',
  'EFFECTIVE: 01-FEB-1996',
  'The following transfers are confirmed:',
  '  CPT. R. FERREIRA → Brasília (Central Command)',
  '  SGT. A. LIMA → São Paulo (Liaison Office)',
  '  ANALYST M. COSTA → CLASSIFIED ASSIGNMENT',
  'Exit interviews scheduled for 30-JAN.',
  'Access credentials to be revoked 01-FEB 00:00.',
  "NOTE: CPT. FERREIRA's case files transferred to",
  '      Acting Chief L. ANDRADE pending replacement.',
  'REGIONAL INTELLIGENCE SUMMARY — JANUARY 1996',
  'SECTOR: Triângulo Mineiro',
  'PRIORITY ITEMS: None',
  'ROUTINE MONITORING:',
  '  - Labor union activity: Normal seasonal levels',
  '  - Agricultural sector: Soy prices stable',
  '  - Border crossings: Within expected parameters',
  'ANOMALIES:',
  '  - 17-JAN: Unauthorized radio transmission near Uberaba',
  '    Assessment: Amateur operator (warning issued)',
  '  - 19-JAN: Unscheduled cargo delivery, regional depot',
  '    Assessment: Paperwork error (corrected)',
  'ANALYST NOTE:',
  '  No items require escalation this period.',
  'ASSET TRANSFER FORM — ATF-1996-0023',
  'STATUS: INCOMPLETE — RETURNED FOR CORRECTION',
  'TRANSFER FROM: HOLDING-7',
  'TRANSFER TO: [FIELD LEFT BLANK]',
  'DATE: 24-JAN-1996',
  'ITEMS:',
  '  1x Container, sealed, 45kg',
  '  1x Case, documents, classified',
  'ERROR: Receiving party signature MISSING',
  'ERROR: Authorization code INVALID',
  'ERROR: Destination facility code NOT RECOGNIZED',
  'RETURN NOTE:',
  '  Form returned to originator for correction.',
  '  Transfer pending until paperwork complete.',
  'CLERK: T. SANTOS',
  'TEMPORARY NOTE — DO NOT ARCHIVE',
  'Remember:',
  '  - Pick up dry cleaning Thursday',
  '  - Call mother re: birthday',
  '  - Ask IT about printer on Floor 2',
  'Meeting notes (delete later):',
  '  Director seemed tense today.',
  '  Something about "special cargo" needing accommodation.',
  '  Nobody tells us anything around here.',
  'OFFICE SUPPLIES REQUEST — JANUARY 1996',
  'DEPARTMENT: Records & Archives',
  'Requested Items:',
  '  - Pens, ballpoint, blue (box of 50)',
  '  - Paper, A4, 80gsm (10 reams)',
  '  - Staples, standard (5 boxes)',
  '  - Folders, manila (100 units)',
  '  - Correction fluid (12 bottles)',
  '  Standard quarterly replenishment.',
  'APPROVED: M. SANTOS, Administrative Officer',
  'STAFF BIRTHDAYS — JANUARY 1996',
  'COMPILED BY: Social Committee',
  '  03-JAN: SANTOS, Maria (Admin)',
  '  08-JAN: OLIVEIRA, Paulo (Facilities)',
  '  12-JAN: RIBEIRO, Ana (Records)',
  '  17-JAN: FERREIRA, João (Security)',
  '  24-JAN: [REDACTED] (Ops)',
  '  29-JAN: COSTA, Lucia (Reception)',
  'NOTE: Cake contributions are voluntary.',
  '      Sign up sheet in break room.',
  'INTERNAL TELEPHONE DIRECTORY — 1996 EDITION',
  'ADMINISTRATION:',
  '  Director Office ................ ext. 2001',
  '  Deputy Director ................ ext. 2002',
  '  Administrative Services ........ ext. 2100',
  'OPERATIONS:',
  '  Ops Center (24h) ............... ext. 3000',
  '  Field Coordination ............. ext. 3100',
  '  Transport Pool ................. ext. 3200',
  'SUPPORT:',
  '  IT Helpdesk .................... ext. 4000',
  '  Facilities ..................... ext. 4100',
  '  Medical (B-3) .................. ext. 4200',
  '  [RESTRICTED] ................... ext. 9999',
  'EMERGENCY: Dial 0 for external line',
  'VEHICLE MILEAGE LOG — JANUARY 1996',
  'POOL VEHICLE: GOL 1.0 (Plate: AAB-1234)',
  'DATE       DRIVER        START    END      DEST',
  '─────────────────────────────────────────────────────────',
  '02-JAN    SILVA, R.     45,230   45,248   City center',
  '05-JAN    COSTA, M.     45,248   45,312   Airport',
  '09-JAN    LIMA, A.      45,312   45,340   Regional office',
  '15-JAN    SANTOS, P.    45,340   45,356   Supplier visit',
  '19-JAN    [CLASSIFIED]  45,356   45,498   [CLASSIFIED]',
  '20-JAN    [CLASSIFIED]  45,498   45,512   [CLASSIFIED]',
  '21-JAN    [CLASSIFIED]  45,512   45,687   [CLASSIFIED]',
  '23-JAN    COSTA, M.     45,687   45,720   Airport',
  'NOTE: Fuel reimbursement forms in Fleet Office.',
  'IT DEPARTMENT NOTICE',
  'RE: Floor 2 Printer Issues',
  'DATE: 16-JAN-1996',
  'The HP LaserJet on Floor 2 is experiencing paper jams.',
  'Temporary workaround:',
  '  - Use the dot matrix printer in Room 215',
  '  - Submit large jobs to Print Center (B-1)',
  'Parts have been ordered. ETA: 2-3 weeks.',
  'We apologize for the inconvenience.',
  'IT Helpdesk - ext. 4000',
  'ANONYMOUS FEEDBACK FORM',
  'RE: Cafeteria Service',
  'SUBMITTED: 18-JAN-1996',
  'COMPLAINT:',
  '  The coffee machine has been broken for three weeks.',
  '  Nobody seems to care. This is unacceptable.',
  'SUGGESTION:',
  '  Bring back the Thursday feijoada. It was the only',
  '  thing worth eating here.',
  'RESPONSE (Admin):',
  '  Coffee machine repair scheduled for 25-JAN.',
  '  Feijoada discontinued due to budget constraints.',
  '  We appreciate your feedback.',
  'MEMORANDUM — SECURITY DIVISION',
  'RE: Annual Badge Renewal',
  'DATE: 10-JAN-1996',
  'All personnel must renew access badges by 31-JAN-1996.',
  'Required documents:',
  '  - Current badge',
  '  - Valid government ID',
  '  - Updated photo (taken at Security Office)',
  '  - Supervisor approval form',
  'Temporary extensions available for personnel on',
  'field assignment during the renewal window.',
  'Non-compliance will result in access suspension.',
  'Security Division - ext. 2500',
  'TRAINING SCHEDULE — Q1 1996',
  'HUMAN RESOURCES DEPARTMENT',
  'MANDATORY TRAINING:',
  '  15-JAN: Fire Safety Refresher (All staff)',
  '  22-JAN: Information Security Basics (New hires)',
  '  05-FEB: First Aid Certification (Floor wardens)',
  '  12-FEB: Document Handling Procedures (Archives)',
  'OPTIONAL WORKSHOPS:',
  '  29-JAN: Word Processing Tips (Room 204)',
  '  08-FEB: Stress Management (Auditorium)',
  'Registration: Contact HR ext. 2300',
  'LOST AND FOUND — JANUARY 1996',
  'LOCATION: Security Desk, Building Lobby',
  'ITEMS FOUND:',
  '  03-JAN: Black umbrella (Floor 3 bathroom)',
  '  07-JAN: Reading glasses in brown case',
  '  11-JAN: Set of keys (car + house)',
  '  14-JAN: Watch, silver, digital (cafeteria)',
  '  19-JAN: Wallet, brown leather (parking lot B)',
  '  22-JAN: [ITEM DESCRIPTION CLASSIFIED]',
  'Items will be held for 30 days.',
  'Unclaimed items donated to charity.',
  'MEMORANDUM — OFFICE SUPPLIES BUDGET',
  'DEPARTMENT: Administrative Services',
  'DATE: 08-JAN-1996',
  'RE: Paper Clip Requisition Dispute',
  'The recent audit has identified discrepancies in paper',
  'clip consumption across departments.',
  'FINDINGS:',
  '  Q4 1995 paper clip usage: 47 boxes',
  '  Q4 1995 paper clip budget: 32 boxes',
  '  Variance: +15 boxes (47% over budget)',
  'REMEDIATION:',
  '  1. All departments must submit itemized supply',
  '     requests by the 15th of each month.',
  '  2. Bulk purchases require supervisor approval.',
  '  3. Reuse of paper clips is encouraged.',
  'NOTE: The acquisition of "jumbo" paper clips must be',
  'justified in writing. Standard size is sufficient for',
  'most document binding requirements.',
  'Questions to: Procurement, ext. 2140',
  'SCHEDULED MAINTENANCE — Q1 1996',
  'FACILITIES MANAGEMENT',
  'JANUARY:',
  '  08-JAN: Elevator inspection (Building A)',
  '  15-JAN: Fire extinguisher certification',
  '  22-JAN: Generator test (postponed - see incident)',
  '  29-JAN: Pest control service',
  'FEBRUARY:',
  '  05-FEB: Roof inspection',
  '  12-FEB: Emergency lighting test',
  '  19-FEB: Water tank cleaning (after hours)',
  '  26-FEB: HVAC filter replacement',
  'MARCH:',
  '  04-MAR: Window cleaning (exterior)',
  '  11-MAR: Carpet shampooing (Floor 2)',
  '  18-MAR: Electrical panel inspection',
  '  25-MAR: Plumbing review (all floors)',
  'Maintenance requests: ext. 2200 or Form F-112',
  'CAFETERIA MENU — WEEK 04 (22-26 JAN 1996)',
  'SEGUNDA-FEIRA (Monday):',
  '  Strogonoff de frango',
  '  Arroz, batata palha',
  '  Salada verde',
  'TERÇA-FEIRA (Tuesday):',
  '  Bife à milanesa',
  '  Arroz, feijão, farofa',
  '  Vinagrete',
  'QUARTA-FEIRA (Wednesday):',
  '  Moqueca de peixe',
  '  Arroz branco, pirão',
  '  Couve refogada',
  'QUINTA-FEIRA (Thursday):',
  '  Cozido à portuguesa',
  '  Legumes variados',
  '  Pão de alho',
  'SEXTA-FEIRA (Friday):',
  '  Feijoada light',
  '  Arroz, couve, laranja',
  '  Farofa simples',
  'SOBREMESA: Pudim de leite (Mon-Wed)',
  '           Goiabada com queijo (Thu-Fri)',
  'SUCO DO DIA: R$ 0,50',
  '             Maracujá | Caju | Acerola',
  'Dona Maria wishes everyone a good week.',
  'PARKING LOT REGULATIONS',
  'EFFECTIVE: 01-JAN-1996',
  'GENERAL RULES:',
  '  1. All vehicles must display valid parking permit.',
  '  2. Speed limit: 10 km/h in all areas.',
  '  3. No parking in fire lanes (marked in red).',
  '  4. Motorcycles: designated area only (Lot C).',
  '  5. No overnight parking without authorization.',
  'PERMIT TYPES:',
  '  BLUE:   Directors and visiting officials',
  '  GREEN:  Permanent staff',
  '  YELLOW: Temporary/contractor access',
  '  RED:    Emergency vehicles only',
  'VIOLATIONS:',
  '  First offense:  Written warning',
  '  Second offense: R$ 20,00 fine',
  '  Third offense:  Parking privilege suspension',
  'Lost permits: Report to Security, ext. 2000',
  'Replacement fee: R$ 5,00',
  'LOST AND FOUND LOG — DETAILED RECORD',
  'SECURITY DESK — JANUARY 1996',
  '03-JAN | 14:30 | FOUND: Black umbrella',
  "                Location: Floor 3 men's bathroom",
  '                Finder: Cleaning staff (M. Santos)',
  '                Status: CLAIMED 09-JAN',
  '07-JAN | 09:15 | FOUND: Reading glasses, brown case',
  '                Location: Conference Room B',
  '                Finder: Meeting attendee',
  '                Status: UNCLAIMED',
  '11-JAN | 16:45 | FOUND: Key ring (3 keys)',
  '                Location: Elevator, Floor 1',
  '                Finder: Security guard (P. Rocha)',
  '                Status: CLAIMED 12-JAN',
  '14-JAN | 12:00 | FOUND: Digital watch (Casio)',
  '                Location: Cafeteria, Table 7',
  '                Finder: Cafeteria staff',
  '19-JAN | 18:20 | FOUND: Brown leather wallet',
  '                Location: Parking Lot B, near entrance',
  '                Finder: Guard (night shift)',
  '                Contents: ID, R$ 47,00, photos',
  '                Status: CLAIMED 20-JAN (owner verified)',
  '22-JAN | 03:00 | [RECORD SEALED - SECURITY OVERRIDE]',
  'VACATION SCHEDULE — Q1 1996',
  '  OLIVEIRA, P. ........... 02-JAN to 12-JAN',
  '  SANTOS, M. ............. 08-JAN to 15-JAN',
  '  RIBEIRO, J.S. .......... 15-JAN to 26-JAN',
  '  NASCIMENTO, R. ......... [CANCELLED - INCIDENT]',
  '  COSTA, L. .............. 05-FEB to 16-FEB',
  '  FERREIRA, R. ........... 12-FEB to 23-FEB',
  '  LIMA, A. ............... 19-FEB to 01-MAR',
  '  CARVALHO, M. ........... 26-FEB to 08-MAR',
  '  SILVA, R. .............. 04-MAR to 15-MAR',
  '  PEREIRA, F. ............ 18-MAR to 29-MAR',
  '  ALMEIDA, C. ............ 25-MAR to 05-APR',
  '  - Vacation requests require 30-day advance notice',
  '  - Maximum consecutive days: 20',
  '  - Carryover from 1995: Use by 28-FEB',
  'Questions: HR Office, ext. 2050',
  'ACCESS CODE AUDIT — INTERNAL SECURITY REVIEW',
  'CLASSIFICATION: INTERNAL USE ONLY',
  'DATE: 18-DEC-1995',
  'SUBJECT: Annual Access Code Compliance Review',
  'Per Security Directive 1995-12, all departmental access',
  'codes have been reviewed for compliance with naming',
  'conventions established in Memo SEC-89-04.',
  '  Current codes use agricultural terminology as',
  '  mandated by Project Operations naming standard.',
  '  Recent audit flagged the following code for',
  '  pattern recognition vulnerability:',
  '    C - O - L - H - E - I - T - A',
  '  While the code follows naming convention, the',
  '  sequential letter arrangement may be susceptible',
  '  to systematic enumeration attacks.',
  'RECOMMENDATION:',
  '  Code remains acceptable for current fiscal year.',
  '  Consider alphanumeric substitution for FY1997.',
  'AUDITOR: Systems Administration',
  'DISTRIBUTION: Terminal operators, Security Office',
  'WEEKEND DUTY ROSTER — JANUARY 1996',
  'OPERATIONS CENTER',
  '06-07 JAN: SILVA, R. / OLIVEIRA, P.',
  '13-14 JAN: SANTOS, M. / COSTA, L.',
  '20-21 JAN: [CANCELLED - ALL HANDS ON DECK]',
  '27-28 JAN: FERREIRA, J. / LIMA, A.',
  '  - Weekend of 20-21 JAN: Full staff mobilization',
  '    per Director order. No details provided.',
  '  - Overtime requests to HR by Wednesday prior.',
  'Duty Officer: ext. 3000 (24h)',
  'MEMORANDUM — TERMINAL ACCESS OVERRIDE',
  'TO: All Terminal Operators',
  'FROM: Systems Administration',
  'DATE: December 1995',
  'Per Director mandate, emergency terminal override codes',
  'have been updated for the new fiscal year.',
  'The override protocol allows access to restricted',
  'directories when standard authentication is unavailable.',
  'USAGE:',
  '  override <authorization_code>',
  'CURRENT CODE:',
  '  Project designation word. Agricultural term.',
  '  Portuguese. Related to extraction operations.',
  '  The code references our operational codename.',
  '  Think: what do you do at harvest time?',
  'DO NOT share this code with unauthorized personnel.',
  '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
  '            SECURITY ALERT — INTRUSION DETECTED             ',
  'This file is a HONEYPOT.',
  'Your terminal ID has been logged.',
  'Your access pattern has been flagged.',
  'Security personnel have been notified.',
  'REMAIN AT YOUR TERMINAL.',
  '               DECOY FILE — ACCESS LOGGED                   ',
  'This file was planted to identify unauthorized access.',
  'Real evidence is never labeled this obviously.',
  'You should have known better.',
  'Your session has been marked for termination.',
  '              TRAP FILE — INTRUSION CONFIRMED               ',
  'Classification level "FOR PRESIDENTS EYES ONLY" does not',
  'exist in any real intelligence system.',
  'This was a test. You failed.',
  'Countermeasures deployed.',
  '                HONEYPOT TRIGGERED                          ',
  'Intelligence agencies do not label files "SMOKING GUN."',
  'This file exists solely to catch intruders who lack',
  'the discretion to recognize obvious bait.',
  'Your impatience has been noted.',
  '[LEGACY ENCRYPTION HEADER — RECOVERED COPY AVAILABLE]',
  'Historical note: this file previously used a timed wrapper.',
  'Recovered text is now available directly on open.',
  'Use: open emergency_broadcast.enc',
  '▓▓▓ EMERGENCY BROADCAST — INTERCEPTED ▓▓▓',
  'DATE: 20-JAN-1996 22:47 LOCAL',
  'FREQUENCY: MILITARY BAND — ENCRYPTED',
  '═══ TRANSCRIPT BEGIN ═══',
  'TOWER: "Flight 1-7, confirm visual on target area."',
  'PILOT: "Negative visual. Heavy cloud cover at 3000 meters."',
  'TOWER: "Proceed to coordinates 21.5519 S, 45.4331 W."',
  'PILOT: "Coordinates confirmed. ETA 8 minutes."',
  '[STATIC - 14 SECONDS]',
  'PILOT: "Tower, I have... I have something on radar."',
  'TOWER: "Confirm contact, Flight 1-7."',
  'PILOT: "Contact confirmed. It\'s... it\'s not moving."',
  'TOWER: "Weapons systems remain inactive. Observe only."',
  'PILOT: "Understood. Beginning visual approach."',
  '[STATIC - 8 SECONDS]',
  'PILOT: "Deus me livre... Tower, I don\'t know what I\'m looking at."',
  'TOWER: "Flight 1-7, maintain radio silence from this point."',
  'PILOT: "But Tower—"',
  'TOWER: "This conversation never happened. RTB immediately."',
  '═══ TRANSCRIPT ENDS ═══',
  'CLASSIFICATION: ABOVE TOP SECRET',
  'DISSEMINATION: NEED-TO-KNOW ONLY',
  'ARCHIVED NEWS CLIPPINGS — FEBRUARY 1996',
  'FOLHA DE SÃO PAULO — 15-FEB-1996',
  '"MILITARY DENIES VARGINHA RUMORS"',
  '  The Brazilian Air Force today denied reports of',
  '  unusual activity near Varginha, Minas Gerais.',
  '  "There was no incident," stated a military spokesman.',
  '  "These are fabrications from overactive imaginations."',
  'O GLOBO — 22-FEB-1996',
  '"ANONYMOUS DOCUMENTS SURFACE ONLINE"',
  '  Unverified documents claiming to detail a UFO',
  '  recovery operation have appeared on several',
  '  international bulletin board systems.',
  '  Government sources dismiss them as "obvious fakes."',
  'ESTADO DE MINAS — 28-FEB-1996',
  '"WITNESS RECANTS STATEMENT"',
  '  a local woman, who claimed to see a "strange creature"',
  '  in Jardim Andere, has withdrawn her testimony.',
  '  "I was mistaken," she said. "It was just shadows."',
  '  [EDITOR NOTE: Silva was visited by unidentified men',
  '   in suits two days before this retraction.]',
  'CLASSIFIED INTERNAL MEMORANDUM',
  'DATE: 10-MAR-1996',
  'RE: Information Containment Assessment',
  'SITUATION:',
  '  Classified documents pertaining to January 1996',
  '  operations have been exfiltrated via compromised',
  '  legacy terminal system.',
  'DAMAGE ASSESSMENT:',
  '  - Documents now circulating on international networks',
  '  - Authenticity being questioned (as planned)',
  '  - No mainstream media pickup (yet)',
  'CONTAINMENT MEASURES:',
  '  1. Flood networks with obvious fakes to dilute signal',
  '  2. Pressure witnesses to recant',
  '  3. Redirect narrative to "foreign drone" hypothesis',
  '  4. Monitor UFO community for serious investigators',
  'LONG-TERM STRATEGY:',
  '  The 2026 window approaches. Full disclosure may be',
  '  unavoidable. Recommend gradual acclimation program.',
  'NOTE: The individual known as "UFO74" remains at large.',
  '      Termination not recommended due to martyr risk.',
  'SIGNAL INTERCEPT — UNVERIFIED',
  'TIMESTAMP: 15-MAR-1996 03:47:22 UTC',
  '[FRAGMENTARY TRANSMISSION - RECONSTRUCTED]',
  '...made it across the border...',
  '...they came to the apartment but...',
  '...different identity now...',
  '...the hackerkid did it...',
  '...files are everywhere now...',
  '...cant put the toothpaste back...',
  '...they think im dead...',
  '...let them think that...',
  '...2026. ill be watching...',
  '...we all will...',
  '[SIGNAL LOST]',
  'ANALYSIS: Origin untraceable. Possibly fabricated.',
  '          Subject status: UNKNOWN',
  'PROJECTION UPDATE — 2026 TRANSITION WINDOW',
  'CLASSIFICATION: BEYOND TOP SECRET',
  'DATE: [REDACTED]',
  'REVISED ASSESSMENT:',
  '  The information breach of January 1996 has altered',
  '  projected outcomes for the 2026 transition window.',
  'PREVIOUS MODEL:',
  '  - Transition occurs with zero public awareness',
  '  - Population response: Panic, collapse',
  '  - Estimated casualties: [REDACTED]',
  'REVISED MODEL (POST-BREACH):',
  '  - Partial public awareness exists',
  '  - Underground networks prepared',
  '  - Potential for coordinated response',
  '  - Estimated casualties: REDUCED',
  'CONCLUSION:',
  '  The breach, while operationally damaging, may have',
  '  inadvertently improved transition survival rates.',
  "  The intruder's actions, though criminal, may have",
  '  saved lives.',
  '  This assessment is classified and will be denied.',
  'INCIDENT REPORT — EXPERIMENTAL AIRCRAFT DIVISION',
  'DATE: 21-JAN-1996',
  'CLASSIFICATION: CONFIDENTIAL',
  'INCIDENT TYPE: Unauthorized civilian overflight',
  '  A single-engine Cessna 172 entered restricted airspace',
  '  over Base Area 7 at approximately 14:20h on 20-JAN-1996.',
  'ASSESSMENT:',
  '  Pilot identified as agricultural contractor.',
  '  Filed incorrect flight plan (VFR instead of IFR).',
  '  No photographic equipment found on board.',
  'PRELIMINARY CONCLUSION:',
  '  Navigational error. Pilot issued formal warning.',
  '  No security breach. Airspace monitoring resumed.',
  'NOTE: Recommend updated NOTAM for restricted zone',
  '      perimeter. Current radius may be insufficient.',
  'Recovered visual - Foreign drone analysis',
  'ASSESSMENT — FOREIGN DRONE HYPOTHESIS',
  'ANALYST: [CLASSIFIED — junior lieutenant, technical analysis]',
  'DATE: 25-JAN-1996',
  'HYPOTHESIS:',
  '  Recovered material represents foreign reconnaissance drone',
  '  of undisclosed origin (likely US or European).',
  'SUPPORTING EVIDENCE:',
  '  - Advanced materials consistent with aerospace industry',
  '  - Size appropriate for unmanned platform',
  '  - Recovery site near strategic infrastructure',
  'CONTRADICTING EVIDENCE:',
  '  - No propulsion system identified',
  '  - No known drone uses materials of this composition',
  '  - Mass variability unexplained by any known technology',
  '  - Thermal signature inconsistent with any engine type',
  '  Hypothesis CANNOT be sustained.',
  '  Material properties inconsistent with ANY known aircraft.',
  'INTERNAL MEMORANDUM — PUBLIC AFFAIRS',
  'DATE: 22-JAN-1996',
  'RE: Media Inquiry Response',
  'APPROVED STATEMENT FOR PRESS:',
  '  "The object recovered near Varginha on January 20',
  '   has been identified as a weather balloon from the',
  '   National Meteorological Institute. The unusual',
  '   sightings were caused by reflected light from',
  '   the balloon\'s instrumentation package."',
  'INTERNAL NOTE (DO NOT RELEASE):',
  '  This statement is for public consumption only.',
  '  Actual findings classified.',
  '  See PROJECT HARVEST files for details.',
  'APPROVED BY: DIR. COMMUNICATIONS',
  'ALTERNATIVE ASSESSMENT — INDUSTRIAL ORIGIN',
  'ANALYST: SGT. PAULA REIS',
  'DATE: 26-JAN-1996',
  '  Recovered materials originated from nearby',
  '  industrial facility (chemical or metallurgical).',
  'INVESTIGATION:',
  '  Contacted 12 facilities within 50km radius.',
  '  No reported accidents or material losses.',
  '  No facility uses materials matching samples.',
  'MATERIAL COMPARISON:',
  '  - Local steel plant: No match',
  '  - Chemical processing: No match',
  '  - Automotive parts: No match',
  '  - Aerospace subcontractor (Embraer): NO MATCH',
  '  Industrial origin RULED OUT.',
  '  Materials have no identifiable manufacturing signature.',
  '  Discontinue this line of investigation.',
  '  Defer to standard explanation for public statement.',
  'LOGISTICS MANIFEST — PARTIAL RECOVERY',
  'STATUS: FRAGMENT — SECTOR DAMAGE',
  'OUTBOUND SHIPMENTS:',
  '  [CORRUPTED] ... Container C-7 ... [CORRUPTED]',
  '  Destination: CÓDIGO ECHO',
  '  Weight: 45kg',
  '  Handler: Protocol 7-ECHO authorized',
  '  [CORRUPTED] ... Container C-12 ... [CORRUPTED]',
  '  Destination: UNKNOWN (diplomatic channel)',
  '  Weight: 112kg',
  '  Handler: [DATA LOSS]',
  'NOTE: Cross-reference with transport_log_96 for context.',
  'SIGNAL ANALYSIS — PRELIMINARY',
  'EQUIPMENT: Modified EEG Array',
  'DATE: 20-JAN-1996 (during containment)',
  'READINGS FROM SUBJECT BETA (pre-expiration):',
  '  04:30 — Background noise only',
  '  04:45 — Unusual pattern detected (see attached)',
  '  05:00 — Pattern intensifies. Equipment overload.',
  '  05:15 — Subject vitals declining. Pattern peaks.',
  '  05:18 — Transmission burst detected. Duration: 0.3s',
  '  05:20 — Subject expires. Pattern ceases.',
  'INTERPRETATION:',
  '  Unknown. Equipment not designed for this signal type.',
  '  Recommend consultation with transcript_core.enc',
  '  for reconstructed content analysis.',
  'LIAISON NOTE — FOREIGN COORDINATION',
  'FROM: Embassy Contact (unsigned)',
  'DATE: 23-JAN-1996',
  'Package received via diplomatic pouch.',
  'Contents confirmed:',
  '  - Biological samples (2 containers)',
  '  - Material samples (1 container)',
  '  - Documentation (sealed)',
  'Our team is already en route.',
  'As agreed, no records of this exchange will exist',
  'in either system. Protocol 7-ECHO acknowledged.',
  'We will contact you when preliminary analysis complete.',
  'NOTE: Your material_x_analysis.dat was... illuminating.',
  '      We concur with the conclusion.',
  'ENCRYPTED CABLE — PRIORITY ALPHA',
  'ORIGIN: LANGLEY',
  'DESTINATION: BRASÍLIA STATION',
  'DATE: 23-JAN-1996 04:12 UTC',
  '[ENCRYPTED CONTENT - REQUIRES CLEARANCE]',
  'Cross-reference: /comms/liaison/foreign_liaison_note.txt',
  'DECRYPTED CABLE — PRIORITY ALPHA',
  'FLASH TRAFFIC',
  'SITUATION UPDATE:',
  '  Recovery teams report multiple specimens secured.',
  '  Division as agreed: Primary to you, Secondary to us.',
  '  Tertiary inbound to Tel Aviv per standing agreement.',
  '  Protocol 7-ECHO remains in effect.',
  '  No domestic agencies read-in.',
  '  Cover story: industrial accident, toxic waste.',
  'CRITICAL:',
  '  Specimen 3 showed residual cognitive activity.',
  '  Recommend immediate neural extraction before decay.',
  '  Our team brings equipment. ETA 6 hours.',
  'ACKNOWLEDGE.',
  '>> CONFIRMS MULTI-NATION COORDINATION <<',
  'What protocol governs this exchange? (Check the foreign liaison note)',
  'The liaison note mentions the protocol name.',
  'STANDING ORDERS — MULTINATIONAL RECOVERY PROTOCOL',
  'CLASSIFICATION: COSMIC - NEED TO KNOW',
  'EFFECTIVE: 01-JAN-1989 (UPDATED ANNUALLY)',
  'PARTICIPATING NATIONS:',
  '  - United States (Coordinating Authority)',
  '  - United Kingdom',
  '  - France',
  '  - Israel',
  '  - Brazil (Regional Authority, South America)',
  '  - Russia (Observer Status, post-1991)',
  'TRIGGER CRITERIA:',
  '  Any incident matching Profile DELTA:',
  '  - Non-conventional aerial phenomena',
  '  - Biological specimens of unknown origin',
  '  - Material with anomalous physical properties',
  'RESPONSE PROTOCOL:',
  '  1. Regional Authority establishes perimeter',
  '  2. Coordinating Authority notified within 2 hours',
  '  3. Multinational team deployed within 24 hours',
  '  4. Material divided per Appendix C allocation',
  'INFORMATION CONTROL:',
  '  All nations maintain synchronized cover narratives.',
  '  Annual coordination meeting: Davos, Switzerland.',
  'ADDENDUM (1995):',
  '  Coordination extended to include shared timeline.',
  '  All parties agree: public disclosure deferred until',
  '  after WINDOW closes. Target: post-2026 review.',
  '  Cross-reference: /admin/threat_window.red',
  'QUERY — REGIONAL MEDICAL EXAMINER',
  'DATE: 28-JAN-1996',
  'RE: Unusual Autopsy Protocol',
  'To whom it may concern,',
  'I am writing to inquire about the autopsy conducted',
  'at our facility on 21-JAN-1996. I understand',
  'A forensic pathologist was summoned from a state university,',
  'but his notes were sealed before I could review them.',
  'The subject was removed before I arrived.',
  'No standard intake forms were filed.',
  'No cause of death was recorded.',
  'The attending physician refuses to discuss.',
  'Our cold storage showed unusual temperature readings',
  'for several hours afterward.',
  'I am required to maintain complete records.',
  'Please advise how to proceed with documentation.',
  'THE REGIONAL MEDICAL EXAMINER',
  'Regional Medical Examiner',
  '[RESPONSE ATTACHED: "File classified. Destroy query."]',
  'SYSTEM LOG — PATTERN RECOGNITION',
  'TIMESTAMP: [CURRENT SESSION]',
  'Broad file sweep detected.',
  'User has touched multiple sectors of the system.',
  'Pattern: Persistent review of scattered records.',
  'NOTE: Additional archives may be available.',
  '      Check /admin directory if access permits.',
  'SYSTEM ALERT — COHERENCE THRESHOLD',
  'PRIORITY: ELEVATED',
  'User has logged substantial evidence.',
  'Evidence tracker approaching completion.',
  'Leak risk rising.',
  'System recommendation:',
  '  Preserve session artifacts.',
  '  Expect emergency export attempts.',
  'NOTE: Final evidence may require administrative access.',
  'HISTORICAL REFERENCE — OPERATION PRATO',
  'PERIOD: 1977-1978',
  'LOCATION: Colares, Pará, Brazil',
  '  Brazilian Air Force investigation of unidentified',
  '  aerial phenomena in northern Brazil.',
  '  - Multiple credible sightings documented',
  '  - Physical effects on witnesses (burn marks)',
  '  - Phenomenon described as "light beams"',
  '  - Objects displayed non-ballistic motion',
  'OFFICIAL CONCLUSION:',
  '  Inconclusive. Files sealed.',
  'RELEVANCE TO 1996 INCIDENT:',
  '  Current operation named "PRATO EXTENSION"',
  '  suggests institutional awareness of connection.',
  'NOTE: Original PRATO files held by Air Force archives.',
  '      Supplemental archive unlocked under override protocol.',
  '      See /ops/prato/archive when cleared.',
  'INCIDENT LOG — OPERATION PRATO (COLARES)',
  'DATE RANGE: SEP-OCT 1977',
  '18-SEP 22:14 — Luminous object above river channel.',
  '                Beam emitted for 4-6 seconds.',
  '                Civilian reported heat and puncture mark.',
  '20-SEP 23:06 — Patrol observed light hovering ~30m.',
  '                No sound. Rapid lateral acceleration.',
  '                Beam directed to ground, no visible target.',
  '24-SEP 21:47 — Multiple witnesses. Light split into two',
  '                points before rejoining and departing.',
  '03-OCT 00:12 — Light tracked along shoreline for 3km.',
  '                Brightness increased; camera overexposed.',
  'STATUS: Unresolved. Pattern persistent.',
  'NOTE: Incidents cluster near waterfront communities.',
  'PATROL OBSERVATION REPORT — SHIFT 04',
  'UNIT: 1st AIR FORCE DETACHMENT',
  'DATE: 05-OCT-1977',
  '  00:31 — White orb at 25-30m altitude.',
  '  00:32 — Orb emits narrow beam downward.',
  '  00:33 — Beam sweeps left to right (approx. 40° arc).',
  '  00:34 — Orb rises rapidly. Acceleration inconsistent',
  '          with known aircraft.',
  'SENSOR NOTES:',
  '  - No engine noise or rotor wash.',
  '  - Compass fluctuation during beam emission.',
  '  - Thermal scope shows localized ground heating.',
  'PHOTOGRAPHIC RECORD:',
  '  3 frames captured; 2 overexposed; 1 partial silhouette.',
  '  Continue night patrols. Maintain distance.',
  'MEDICAL EFFECTS BRIEF — COLARES CLINIC',
  'DATE: 14-OCT-1977',
  'OBSERVED SYMPTOMS (12 CASES):',
  '  - Superficial burns (2-5cm diameter)',
  '  - Localized puncture marks (sub-dermal)',
  '  - Acute fatigue, dizziness, photophobia',
  '  - Mild anemia in follow-up labs',
  '  Symptoms appear within 12 hours of exposure.',
  '  No infection markers detected.',
  '  Recovery within 3-5 days with hydration and rest.',
  '  Maintain private treatment records.',
  '  Report new cases to field command only.',
  'PHOTO ARCHIVE REGISTER — OPERATION PRATO',
  'ARCHIVE SITE: AIR FORCE COMMAND / BELÉM',
  'DATE: 22-OCT-1977',
  'ROLL COUNT: 146',
  '  - 34 rolls overexposed (light saturation)',
  '  - 21 rolls contain partial silhouettes',
  '  - 6 rolls show beam segments on ground',
  'STORAGE:',
  '  Sealed in climate-controlled vault.',
  '  Access logged under Protocol 3-C.',
  'NOTE:',
  '  Several frames show repeating grid-like arcs.',
  '  Analysts flagged for pattern review.',
  'RETROSPECTIVE ASSESSMENT — PRATO ANOMALY SET',
  'CLASSIFICATION: RED',
  'DATE: 12-FEB-1996',
  '  1977 incidents show consistent scan geometry:',
  '  repeating altitude bands, lateral sweep arcs, and',
  '  short-duration beam contact without pursuit.',
  '  Behaviors align with survey operations, not attacks.',
  '  Patterns resemble grid sampling and terrain mapping.',
  'INFERENCE:',
  '  Luminous sources likely autonomous scan platforms.',
  '  Activity indicates Watcher reconnaissance cycles',
  '  predating the 1996 Varginha recovery.',
  'IMPLICATION:',
  '  Current incident is a continuation, not a first contact.',
  'CONFIDENCE: MODERATE',
  '  Data set incomplete; pattern consistency notable.',
  'REFERENCE — PARALLEL INCIDENTS (INTERNATIONAL)',
  'COMPILED: FEBRUARY 1996',
  'CLASSIFICATION: COMPARTMENTED',
  'Known incidents with similar characteristics:',
  '  1947 — United States (New Mexico)',
  '  1961 — United States (New Hampshire)',
  '  1967 — United Kingdom (Suffolk)',
  '  1980 — United Kingdom (Suffolk, repeat)',
  '  1989 — Belgium (multiple locations)',
  '  1996 — BRAZIL (current)',
  'COMMON ELEMENTS:',
  '  - Material recovery',
  '  - Biological component presence',
  '  - Multi-national coordination',
  '  - Public denial protocol',
  '  Pattern suggests ongoing assessment program.',
  '  Brazil now included in observation set.',
  'ANALYSIS — THIRTY-YEAR CYCLE HYPOTHESIS',
  'THEORETICAL FRAMEWORK',
  'OBSERVATION:',
  '  Recovered psi-comm fragments reference "thirty rotations."',
  '  This correlates with prior incident spacing:',
  '  1947 → 1977 = 30 years (Operation PRATO follows)',
  '  1977 → 2007 = 30 years (predicted)',
  '  1996 → 2026 = 30 years (referenced in transcripts)',
  '  Assessment cycles occur at 30-year intervals.',
  '  Each cycle refines observational model.',
  '  2026 may represent cycle completion.',
  'ALTERNATIVE:',
  '  "Rotations" may not refer to Earth years.',
  '  Calculations assume terrestrial frame of reference.',
  'CONFIDENCE: LOW',
  '  Insufficient data for confirmation.',
  'PATIENT PERSONAL DOCUMENT — RECOVERED FROM ROOM 14B',
  'FACILITY: INSTITUTO RAUL SOARES, BELO HORIZONTE',
  'DATE RECOVERED: 03-MAR-1996',
  'NOTE: Patient was admitted 28-FEB-1996. Document found',
  '      hidden beneath mattress during routine inspection.',
  '      Submitted to file per protocol.',
  'they took my notebooks but they did not find this one.',
  'i know how i sound. i knew how i sounded when i told',
  'my husband. i know why they brought me here. it does',
  'not change what i know.',
  'it is not an invasion. i need people to understand that.',
  'everyone is waiting for ships. for weapons. for something',
  'that looks like a war. it will not look like a war.',
  'it already started. it started before any of us were born.',
  'they do not want our planet. they want what we produce',
  'without knowing we produce it. every thought. every dream.',
  'every moment of fear or love or pain. we generate something',
  'when we think and they have been collecting it for a very',
  'long time.',
  'i tried to calculate the yield. for one human mind over',
  'one lifetime. then i multiplied it. i stopped when i',
  'reached the number because the number made me sit on',
  'the floor for a long time.',
  'seven billion units. that is what we are to them.',
  'units. generating. not knowing.',
  'the doctors say i am not eating. they are right. i',
  'find it difficult to eat. to sleep in a bed. to behave',
  'as if any of it matters when i know what i know.',
  'my daughter visited yesterday. she held my hand.',
  'i looked at her face and all i could think was:',
  'she is producing right now. she has always been',
  'producing. she will never know.',
  'i did not tell her. what would be the point.',
  'if you are reading this and you work here, please',
  'understand i am not delusional. i am a physicist.',
  'i have spent my career measuring things.',
  'the possibility that we are the thing being measured',
  'is not something my training prepared me for.',
  'god willing i am wrong.',
  'i do not believe i am wrong.',
  'ATTENDING NOTE: Patient remains calm but non-responsive',
  'to treatment. Refuses to discuss the content of her',
  'research. Keeps asking if her daughter has been informed.',
  'Recommendation: extend observation period.',
  'THEORETICAL FRAMEWORK — NON-ARRIVAL COLONIZATION',
  'CLASSIFICATION: COSMIC — DISTRIBUTION LIMITED',
  'AUTHOR: [CLASSIFIED — intelligence directorate]',
  'DATE: 05-MAR-1996',
  'TO: JOINT ASSESSMENT COMMITTEE',
  'This memorandum attempts to formalize a hypothesis',
  'that several of us have been circling for weeks but',
  'none wished to commit to paper.',
  'STANDARD COLONIZATION MODEL:',
  '  Species travels to target → displaces natives → occupies',
  'WHAT WE BELIEVE WE ARE OBSERVING:',
  '  Species sends scouts → measures viability → transmits data',
  '  No arrival necessary. No displacement necessary.',
  'PROPOSED PHASE STRUCTURE:',
  '  Phase 1: Reconnaissance (scouts deployed, data gathered)',
  '  Phase 2: Seeding (integration organisms introduced)',
  '  Phase 3: Conversion (gradual modification begins)',
  '  Phase 4: Extraction (resource harvest accelerates)',
  'The brilliance — and I use that word with revulsion —',
  'is that the colonizers never arrive. The colonized',
  'population never perceives a threat because there is',
  'nothing to perceive. The process is gradual, invisible,',
  'and, as far as we can determine, irreversible.',
  'CURRENT ASSESSMENT:',
  '  Earth appears to be in late Phase 1.',
  '  Phase 2 initiation cannot be ruled out.',
  '  This committee has debated response options for',
  '  six hours. We have none to propose. Our training',
  '  prepared us for enemies with borders, flags, and',
  '  return addresses.',
  '  Formal recommendation: continued observation.',
  '  Informal assessment: we are documenting something',
  '  we cannot stop.',
  '[SIGNATURES: 4 of 6 committee members]',
  '[2 members declined to sign — objections on file]',
  'WITNESS STATEMENT — RAW TRANSCRIPT',
  'DATE: 20-JAN-1996 (07:30)',
  'WITNESS: Civilian female, age 23',
  '"I was walking to work when I saw it.',
  ' It was crouching near the wall.',
  ' At first I thought it was a homeless person.',
  ' Then I saw its face.',
  ' It had no ears. Its skin was... wrong.',
  ' It looked at me.',
  ' I felt like it was inside my head.',
  ' Then I ran."',
  'INTERVIEWER NOTES:',
  '  Witness appeared genuinely distressed.',
  '  Story consistent across multiple retellings.',
  '  No evidence of fabrication.',
  'CROSS-REFERENCE:',
  '  Similar telepathic contact described in /comms/psi/',
  'STATUS: File marked for degradation.',
  '        Access recommended before data loss.',
  'EMERGENCY ORDERS — INITIAL RESPONSE',
  'ISSUED: 20-JAN-1996 (05:00)',
  'PRIORITY: FLASH',
  'TO: All Regional Units',
  '1. Secure perimeter around designated sites.',
  '2. Detain all civilian witnesses for debriefing.',
  '3. Recover ALL physical material. Leave nothing.',
  '4. Establish communications blackout.',
  '5. Await specialist team arrival.',
  '  Do NOT photograph subjects.',
  '  Do NOT touch subjects without protection.',
  '  Do NOT attempt communication with subjects.',
  '  Foreign team ETA: See /comms/liaison/',
  '  Transport protocols: See /storage/',
  'ACKNOWLEDGE RECEIPT IMMEDIATELY.',
  'AUTH: DIRECTOR, REGIONAL INTELLIGENCE',
  'TRANSPORT LOG — OPERATION PRATO EXTENSION',
  'DATE: 20-JAN-1996 through 23-JAN-1996',
  'CLASSIFICATION: OPERACIONAL',
  '20-JAN-1996 03:42 — Unit dispatched to Site ALFA',
  '20-JAN-1996 04:15 — Material secured. Weight: 340kg approx.',
  '20-JAN-1996 04:58 — Transport to HOLDING-7 initiated',
  '21-JAN-1996 01:20 — Secondary recovery at Site BETA',
  '21-JAN-1996 02:45 — Fragments catalogued: 12 distinct pieces',
  '21-JAN-1996 03:30 — NOTICE: Material divided for redundancy',
  '21-JAN-1996 04:00 — Batch A → HOLDING-7',
  '21-JAN-1996 04:00 — Batch B → [REDACTED] via diplomatic pouch',
  '22-JAN-1996 — Transfer complete. Chain of custody sealed.',
  '23-JAN-1996 11:00 — HOLDING-7 inventory reconciled',
  '23-JAN-1996 11:30 — Batch B confirmation pending foreign receipt',
  'NOTE: Foreign transfer authorized under Protocol 7-ECHO.',
  'NOTE: Recipient nation not logged in this system.',
  'END LOG',
  'Recovered visual - Crash site material',
  'MATERIAL ANALYSIS — BATCH A SAMPLES',
  'LAB: UNICAMP-AFFILIATED (UNOFFICIAL)',
  'SAMPLE M-07:',
  '  Composition: Unknown alloy. No terrestrial match.',
  '  Conductivity: Anomalous. Variable under observation.',
  '  Mass: Inconsistent between measurements.',
  'SAMPLE M-12:',
  '  Composition: Polymer matrix with metallic inclusions.',
  '  Tensile strength: Exceeds known materials by factor of 8.',
  '  Thermal response: Absorbs heat without temperature change.',
  '  Materials are not of terrestrial manufacture.',
  '  Recommend immediate classification upgrade.',
  '  Recommend international consultation suppression.',
  'ADDENDUM:',
  '  Batch B samples were NOT made available for analysis.',
  '  Foreign recipient declined reciprocal data sharing.',
  'Recovered visual - Bio containment',
  'BIO-CONTAINMENT LOG — QUARANTINE SECTION',
  'SITE: REGIONAL HOSPITAL [NOME SUPRIMIDO]',
  'DATE: 20-JAN-1996',
  '20-JAN 04:30 — Subject ALFA secured. Vitals: Unstable.',
  '20-JAN 05:15 — Subject BETA secured. Vitals: Declining.',
  '20-JAN 06:00 — Subject ALFA expired. Cause: Unknown.',
  '20-JAN 08:00 — Transfer order received.',
  '20-JAN 09:30 — Subject BETA transferred to military custody.',
  '20-JAN 10:00 — Subject ALFA remains → autopsy protocol.',
  'NOTE: Subjects display non-human morphology.',
  'NOTE: Subjects do not match any catalogued species.',
  '21-JAN 02:00 — Third subject reported. Site GAMMA.',
  '21-JAN 04:00 — Third subject secured. Designated GAMMA.',
  '21-JAN 06:00 — Subject GAMMA transferred. Destination: UNKNOWN.',
  'WARNING: All bio-material classified COSMIC.',
  'Recovered visual - Autopsy subject',
  'AUTOPSY PROTOCOL — SUBJECT ALFA',
  'PATHOLOGIST: [CLASSIFIED — forensic specialist, state university]',
  'FACILITY: Hospital Regional do Sul de Minas',
  'EXTERNAL EXAMINATION:',
  '  Height: 1.6m (contracted posture noted at recovery site)',
  '  Skin: Dark brown, oily secretion, strong ammonia odor',
  '  Cranium: Three bony ridges, anterior-posterior alignment',
  '  Eyes: Disproportionately large, deep red, no sclera',
  '  Limbs: Four digits per extremity',
  'INTERNAL EXAMINATION:',
  '  Cardiovascular: Single-chamber circulatory organ',
  '  Digestive: Vestigial. Non-functional.',
  '  Reproductive: Absent.',
  '  Neural: Overdeveloped cranial mass. Unusual structures.',
  '  Cranial structures suggest high-bandwidth signal processing.',
  '  No vocal apparatus detected.',
  '  Hypothesis: Communication via non-acoustic means.',
  'TISSUE SAMPLES: Transferred per Protocol 7-ECHO.',
  'PATHOLOGIST ADDENDUM:',
  '  "This organism was designed, not evolved."',
  'ADDENDUM PSI — NEURAL ASSESSMENT',
  'CONSULTING: [CLASSIFIED]',
  'CRANIAL STRUCTURE ANALYSIS:',
  'The neural architecture of Subject ALFA indicates:',
  '  - Massive parallel processing capability',
  '  - Structures analogous to signal receivers',
  '  - No decision-making cortex equivalent',
  '  Subject was not autonomous.',
  '  Subject received instructions from external source.',
  '  Subject functioned as observer/relay only.',
  '  If subjects are receivers, there must be transmitters.',
  '  Transmitters were not recovered at any site.',
  '  Assume observational mission was successful.',
  '  Assume data was transmitted before expiration.',
  'Recovered visual - Subject during transmission',
  'SECURITY CHECK: Enter material sample weight from transport log (kg)',
  'Check transport_log_96.txt for material weight',
  '[ENCRYPTED - DECRYPTION REQUIRED]',
  'PSI-COMM TRANSCRIPT — PARTIAL RECOVERY',
  'SOURCE: Subject BETA (pre-expiration)',
  'METHOD: EEG pattern analysis + computational reconstruction',
  '[FRAGMENT 1]',
  '  ...observation complete...',
  '  ...viable assessment confirmed...',
  '  ...transmission interrupted...',
  '[FRAGMENT 2]',
  '  ...energy density acceptable...',
  '  ...cognitive activity measured...',
  '  ...extraction model viable...',
  '[FRAGMENT 3]',
  '  ...we are not the arrivers...',
  '  ...we are the measuring...',
  '  ...others will come...',
  '[END RECOVERED FRAGMENTS]',
  'NOTE: Original signal strength suggests transmission',
  '      reached destination before subject expiration.',
  'SECURITY CHECK: How many subjects were recovered total?',
  'Check bio_container.log for subject designations',
  'PSI-COMM TRANSCRIPT — SECONDARY ANALYSIS',
  'SOURCE: Subject GAMMA',
  '[RECOVERED SEQUENCE]',
  '  ...thirty rotations...',
  '  ...alignment window...',
  '  ...convergence cycle...',
  '  "Thirty rotations" interpreted as 30 Earth years.',
  '  Base date: 1996.',
  '  Projected window: 2026.',
  'SIGNIFICANCE: UNKNOWN',
  'RECOMMENDATION: MONITOR',
  'Recovered visual - Operation Prato Delta field report',
  'FIELD REPORT — OPERATION PRATO DELTA',
  'SUBMITTED: 24-JAN-1996',
  '  Three recovery sites established.',
  '  All physical evidence secured.',
  '  All biological material secured.',
  'FOREIGN LIAISON:',
  '  Representatives from [REDACTED] arrived 22-JAN.',
  '  Joint protocol established.',
  '  Material sharing agreement signed.',
  'CONCERNS:',
  '  Local witnesses estimated at 30+.',
  '  Media suppression partially effective.',
  '  Long-term containment uncertain.',
  '  Maintain denial posture.',
  '  Accelerate foreign material transfer.',
  '  Discontinue local analysis to prevent leaks.',
  'THEORETICAL FRAMEWORK — SCOUT VARIANTS',
  'CLASSIFICATION: EYES ONLY',
  'WORKING MODEL:',
  'Recovered subjects appear to be purpose-built constructs.',
  'Evidence suggests:',
  '  - Engineered for Earth-specific conditions',
  '  - Limited operational lifespan (hours to days)',
  '  - High neural plasticity for rapid environmental learning',
  '  - No autonomous decision-making capability',
  'CLASSIFICATION:',
  '  Designation: "Scouts"',
  '  Function: Reconnaissance and measurement',
  '  Relationship to origin: Unknown (assumed subordinate)',
  '  Scouts are tools, not representatives.',
  '  Decision-makers remain at origin.',
  '  Origin has NOT been contacted.',
  'ASSESSMENT — ENERGY NODE CLASSIFICATION',
  'AUTHOR: [CLASSIFIED — signals division analyst]',
  'DATE: 10-FEB-1996',
  'TO: ASSESSMENT DIRECTORATE',
  'RECOVERED SIGNAL CROSS-REFERENCE:',
  'Psi-comm fragments, when mapped against material',
  'analysis, produce a consistent pattern:',
  '  - "Energy density" referenced 4 times across specimens',
  '  - "Extraction model" phrasing consistent in all samples',
  '  - "Cognitive activity" used as a metric — this is unusual',
  '    and does not correspond to any known measurement system',
  'ANALYST HYPOTHESIS:',
  '  Earth is being assessed as an energy source.',
  '  Biological neural networks may serve as the',
  '  extraction medium. Cognitive output correlates',
  '  with projected energy yield.',
  '  Recovered material samples exhibit energy absorption',
  '  properties we cannot replicate or fully explain.',
  '  Scout neural structures confirm measurement function.',
  '  The scout mission appears complete. Next phase',
  '  initiation is uncertain. Transition window undefined.',
  '  Establish long-term signal monitoring station.',
  '  Staff with personnel who have read clearance.',
  '  Budget request attached separately — the Ministry',
  '  will not approve if they see the justification.',
  '[SIGNATURE REDACTED]',
  'THREAT ASSESSMENT — TRANSITION WINDOW',
  'AUTHOR: [CLASSIFIED — threat analysis section chief]',
  'DATE: 02-MAR-1996',
  'TO: MINISTRY OF DEFENSE — STRATEGIC PLANNING',
  'TIMELINE RECONSTRUCTION:',
  '  Reference: Psi-comm fragment "thirty rotations"',
  '  Best interpretation: 30 Earth orbital cycles',
  '  Base year: 1996 (current incident)',
  '  Target year: 2026',
  'NATURE OF WINDOW: UNKNOWN',
  'We have debated the following possibilities:',
  '  - Secondary deployment of integration organisms',
  '  - Transition from reconnaissance to active phase',
  '  - Communication or activation signal',
  '  - Initiation of energy extraction process',
  'None of these can be confirmed. All are consistent',
  'with recovered data.',
  'RECOMMENDED POSTURE:',
  '  - Maintain observation protocols through 2026',
  '  - Establish monitoring baseline for anomalous signals',
  '  - Prepare contingency frameworks (nature TBD)',
  'IMPORTANT CAVEAT:',
  '  This is not a prediction. It is a detected reference',
  '  in recovered neural fragments. Our interpretation',
  '  may be completely wrong. But the reference exists.',
  '  We cannot pretend it does not.',
  'INTERNAL MEMORANDUM — NOTE 07',
  'FROM: [REDACTED]',
  'TO: DIRECTOR',
  'SUBJECT: Foreign Involvement Concerns',
  'Director,',
  'I must register my objection to the current arrangement.',
  'The foreign delegation arrived before we had completed',
  'initial assessment. Their access to biological samples',
  'was granted before chain of custody was established.',
  'I have reason to believe:',
  '  - They had advance knowledge of the incident',
  '  - Their equipment was pre-positioned',
  '  - Their protocols superseded our own',
  'This was not cooperation. This was assumption of control.',
  'I recommend formal protest through diplomatic channels.',
  'ASSESSMENT — INDIRECT COLONIZATION MODEL',
  'CLASSIFICATION: RED — COMPARTMENTED',
  'AUTHOR: [CLASSIFIED — colonel, strategic planning]',
  'DATE: 27-FEB-1996',
  'TO: MINISTRY OF DEFENSE — SPECIAL PROGRAMS',
  'Excellency,',
  'After reviewing the full specimen analysis and the',
  'recovered psi-comm fragments, I must present a framework',
  'that none of us wanted to consider.',
  'I stress that this is my interpretation. I pray',
  'that I am wrong.',
  'PHASE 1 — RECONNAISSANCE (CONFIRMED)',
  '  Bio-engineered scouts deployed.',
  '  Planetary viability measured.',
  '  Cognitive density assessed — our population, our minds.',
  '  Findings transmitted to origin before recovery.',
  '  This phase appears complete. The scouts succeeded.',
  'PHASE 2 — SEEDING (THEORETICAL)',
  '  Integration organisms introduced.',
  '  These would not resemble the scouts. They would',
  '  resemble nothing. Or everything.',
  '  Gradual ecological and biological modification.',
  '  I do not know if this has begun.',
  '  The neural fragments suggest it will.',
  'PHASE 3 — EXTRACTION (THEORETICAL)',
  '  Target world becomes an energy source.',
  '  Local species continues existing — but diminished.',
  '  Autonomy and agency degrade. Slowly. Invisibly.',
  'CONCLUSION',
  'What disturbs me most is the elegance of it.',
  'They do not need to arrive. They do not destroy.',
  'They convert. Quietly. From a distance we cannot',
  'comprehend.',
  'We trained our entire defense apparatus to repel',
  'invaders. There is nothing to repel.',
  'ASSESSMENT: Phase 1 appears complete for Earth.',
  'I have requested confession with the base chaplain.',
  'EXECUTIVE BRIEFING — THE WATCHERS',
  'CLASSIFICATION: COSMIC — EYES ONLY',
  'PREPARED BY: JOINT ASSESSMENT COMMITTEE',
  'DATE: FEBRUARY 1996',
  'TO: [DISTRIBUTION LIMITED — MINISTRY LEVEL]',
  'This document summarizes our current institutional',
  'understanding of the January 1996 incident and its',
  'implications. It has been reviewed by all six members',
  'of this committee. What follows is consensus.',
  '════════════════════',
  'I. THE INCIDENT',
  'Between 20–23 January 1996, military and fire brigade',
  'units conducted recovery operations at three distinct',
  'sites near Varginha, Minas Gerais.',
  'Physical debris and biological specimens were secured.',
  'Material was divided per standing multinational protocol.',
  'A portion was transferred to foreign partners before this',
  'committee was fully convened — a procedural failure we',
  'have formally protested.',
  'II. THE SPECIMENS',
  'Three non-human biological entities recovered.',
  'Designated: ALFA, BETA, GAMMA.',
  'Autopsy and tissue analysis indicate:',
  '  - Purpose-built organisms, not naturally evolved',
  '  - Limited operational lifespan (designed to expire)',
  '  - Neural architecture oriented toward observation',
  '  - No autonomous decision-making structures found',
  '  - Communication via non-acoustic means (see PSI files)',
  'In plain language: these were instruments. Scouts.',
  'Sent to observe and transmit. Not ambassadors.',
  'Not explorers. Tools.',
  'III. THE TRANSMISSION',
  'Recovered psi-comm fragments confirm:',
  '  - Mission was observational and appears successful',
  '  - Data was transmitted before specimen expiration',
  '  - Earth assessed as viable for energy extraction',
  '  - Reference to a future "alignment window"',
  'We believe the scouts completed their purpose.',
  'The data they gathered has already been received',
  'by whatever sent them.',
  'IV. THE WINDOW',
  '"Thirty rotations" — interpreted as 30 orbital years.',
  'Projected window: YEAR 2026.',
  'Nature unknown. Assessed possibilities:',
  '  - Deployment of integration organisms',
  '  - Initiation of indirect conversion process',
  '  - Activation signal for pre-positioned systems',
  'We stress: this is not an invasion timeline.',
  'It may be something we do not yet have language for.',
  'V. THE WATCHERS',
  'Working designation for the origin civilization.',
  'What we believe we know:',
  '  - Post-biological or hybrid form of existence',
  '  - Colonial expansion through indirect conversion',
  '  - Do not physically arrive at target worlds',
  '  - Utilize bio-engineered intermediaries for assessment',
  '  - Extract energy from cognitive biological networks',
  'The name "Watchers" was chosen by this committee.',
  'It is the only word that fits. They observe.',
  'They measure. They wait. And then — we believe —',
  'they harvest. Without ever arriving.',
  'VI. INSTITUTIONAL POSTURE',
  'Current directive from the Ministry:',
  '  - Maintain public denial per multinational protocol',
  '  - Continue monitoring for activation signals',
  '  - Coordinate with international partners',
  '  - Prepare contingency frameworks for 2026 window',
  'This committee notes, with professional distress,',
  'that "contingency framework" implies a response',
  'capability we do not possess. We have documented',
  'a situation. We have not found a solution.',
  'God help us all.',
  'END BRIEFING — 4 COPIES AUTHORIZED',
  'SESSION RESIDUE — AUTOMATED LOG',
  'Multiple evidence file accesses detected.',
  'Review pattern indicates deliberate collection.',
  'Temporary cache contains enough material to',
  'support an external leak attempt.',
  'CONCLUSION: Session risk elevated.',
  'NOTICE: Export behavior expected.',
  'ETHICS EXCEPTION — REQUEST 03',
  'DATE: 29-JAN-1996',
  'REQUEST:',
  '  Waiver of standard protocols for specimen handling.',
  '  Justification: Unique scientific opportunity.',
  'STATUS: APPROVED',
  'CONDITIONS:',
  '  - All procedures conducted off-site',
  '  - No institutional records',
  '  - Results shared with foreign partners only',
  'APPROVAL: [SIGNATURE REDACTED]',
  'Bio-Assessment Initiative - Recovered specimen documentation',
  'PROGRAM OVERVIEW — BIO-ASSESSMENT INITIATIVE',
  'Following the January 1996 incident, a joint program',
  'was established with international partners.',
  'OBJECTIVES:',
  '  - Analyze recovered biological material',
  '  - Develop detection protocols',
  '  - Prepare response frameworks',
  'PARTICIPANTS:',
  '  - Brazilian Intelligence (Lead, Local)',
  '  - [REDACTED] (Technical Analysis)',
  '  - [REDACTED] (Biological Assessment)',
  'DIVISION OF ASSETS:',
  '  - Brazil retains Subject ALFA remains',
  '  - Foreign partner received Subjects BETA, GAMMA',
  '  - Material samples divided per Protocol 7-ECHO',
  'STATUS: Ongoing.',
  'TEMPORAL ANALYSIS — WINDOW ALIGNMENT',
  'METHODOLOGY: Signal Pattern Reconstruction',
  'AUTHOR: [CLASSIFIED — signals intelligence analyst]',
  'Cross-analysis of all recovered psi-comm fragments',
  'yielded the following recurring temporal references:',
  'TEMPORAL REFERENCES:',
  '  - "thirty rotations" (freq: 3)',
  '  - "alignment" (freq: 2)',
  '  - "convergence" (freq: 1)',
  '  - "window" (freq: 2)',
  'ASTRONOMICAL CORRELATION:',
  '  Year 2026 shows:',
  '    - Unusual planetary alignments',
  '    - Solar activity projections: elevated',
  '    - [DATA INSUFFICIENT FOR FURTHER CORRELATION]',
  'CONFIDENCE LEVEL: MODERATE',
  '  Establish monitoring protocols for year 2026.',
  '  Nature of expected event: UNKNOWN.',
  'PERSONAL NOTE:',
  '  The frequency of "thirty rotations" across',
  '  independent specimen extractions is difficult',
  '  to dismiss as coincidence. I recommend we take',
  '  this reference seriously.',
  'Subject designation (found in autopsy records):',
  'Check autopsy files in quarantine',
  '▓▓▓ RAW NEURAL CAPTURE — SPECIMEN ALFA ▓▓▓',
  'EXTRACTION DATE: 21-JAN-1996 04:17',
  'DURATION: 0.3 SECONDS (SUBJECTIVE: UNKNOWN)',
  '═══ STREAM BEGIN ═══',
  '[non-linear perception detected]',
  '...purpose singular... observe catalog transmit...',
  '...not-self... extension... eyes-that-are-not-eyes...',
  '...this world... dense... loud... LOUD...',
  '[temporal distortion]',
  '...others of this-shape sent to many worlds...',
  '...most do not return... return not expected...',
  '...we are the cost of knowing...',
  '[emotional bleed: resignation]',
  '...they-above wait... they-above measure...',
  '...seven billion... dense... high yield...',
  '...window approaches... thirty rotations...',
  '[conceptual transmission]',
  '>>>IMAGE: vast darkness between stars',
  '>>>IMAGE: something watching, not moving, never moving',
  '>>>IMAGE: threads connecting to countless worlds',
  '>>>CONCEPT: harvest is not destruction',
  '>>>CONCEPT: the crop continues living',
  '[signal degradation]',
  '...we do not arrive... we do not need to...',
  '...you are already... already...',
  '═══ STREAM TERMINATED — SUBJECT EXPIRED ═══',
  'ANALYST NOTE: Subject expired during neural extraction.',
  '              Complete cognitive download was not possible.',
  '              What we captured is partial. Pray it was',
  '              enough. Pray it was not.',
  '══════════════════════════════════════════════',
  'NEURAL PATTERN PRESERVED FOR REMOTE LINK',
  '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
  'FILE: NEURAL_DUMP_ALFA.PSI',
  'STATUS: ENCRYPTED',
  'CLASSIFICATION: COSMIC - PSI-DIVISION',
  'RECOVERED COPY AVAILABLE',
  'This file contains raw neural capture data from',
  'recovered specimen. Authentication required.',
  'Use: open neural_dump_alfa.psi',
  'REPORT — PSI-COMMUNICATION ANALYSIS',
  'DATE: 15-FEB-1996',
  'EXECUTIVE SUMMARY:',
  'Communication with recovered specimens occurred via',
  'non-acoustic, non-electromagnetic means. Personnel',
  'reported receiving information without sensory input.',
  'CHARACTERISTICS OF PSI-COMM',
  'NOT observed:',
  '  - Spoken language',
  '  - Written symbols',
  '  - Gestural communication',
  'OBSERVED:',
  '  - Synchronized neural activity between operator/subject',
  '  - Intrusive conceptual transmission',
  '  - Shared imagery and meaning, not symbols',
  '  - Emotional state transfer',
  'OPERATOR EFFECTS',
  'Personnel exposed to psi-comm report:',
  '  - Loss of temporal reference (hours feel like seconds)',
  '  - Intrusive thoughts persisting for days',
  '  - Emotional "bleed-through" (fear, resignation, purpose)',
  '  - Understanding concepts without being able to explain',
  'Lead Operator (Psi Division):',
  '"I understood what it was showing me. I cannot tell you',
  ' what I understood. The knowing does not translate."',
  'CRITICAL FINDING',
  'The entities do not communicate to exchange information.',
  'They transmit. They do not expect response.',
  'They were never designed for dialogue.',
  'LINK ACCESS PROTOCOL',
  'Neural pattern preservation allows post-mortem link.',
  'Authentication phrase derived from psi-comm transmission.',
  '  > link',
  '  > Enter phrase: ___________',
  'Access phrase referenced in neural dump under [conceptual',
  'transmission] section — the primary directive.',
  'ANALYSIS — SPECIMEN FUNCTION AND PURPOSE',
  'AUTHOR: [CLASSIFIED — senior biologist, assessment team]',
  'DATE: 22-FEB-1996',
  'CONCLUSION: The recovered entities are tools, not envoys.',
  'ANATOMICAL EVIDENCE',
  'Specimens show signs of deliberate engineering:',
  '  SPECIALIZED:',
  '    - Sensory organs optimized for observation',
  '    - Neural density far exceeds body mass requirement',
  '    - Simplified digestive system (mission duration limited)',
  '  FRAGILE:',
  '    - Poorly suited for Earth gravity (joint stress)',
  '    - Minimal immune response (not built to survive)',
  '    - No reproductive capability whatsoever',
  '  LIMITED:',
  '    - No evidence of autonomous decision-making centers',
  '    - Behavior patterns suggest programmed routines',
  '    - Mission completion prioritized over self-preservation',
  'INTERPRETATION',
  'These are reconnaissance units. Purpose-built.',
  'They were never meant to survive this assignment.',
  'They were never meant to return.',
  'They were never meant to represent their creators.',
  'In my professional assessment, they are biological',
  'sensors. Nothing more.',
  'WHAT THIS IMPLIES',
  'If Earth received scouts, it passed initial screening.',
  'If scouts transmitted successfully, data was received.',
  'I do not enjoy writing this next sentence.',
  'If data was received, then we have been catalogued.',
  'Someone — something — now knows we are here,',
  'what we are, and what we are worth.',
  'Year of projected transition window:',
  'Referenced in multiple classified documents',
  'Signal analysis showing second deployment trajectory',
  '▓▓▓ INTERCEPTED SIGNAL — PRIORITY ULTRA ▓▓▓',
  'INTERCEPT DATE: 03-MAR-1996',
  'ORIGIN: EXTRASOLAR',
  '═══ SIGNAL DECODED ═══',
  'CLASSIFICATION: This transmission was detected 6 weeks',
  'after the January incident. Source triangulation indicates',
  'origin beyond solar system boundary.',
  'TRANSMISSION CONTENT (CONCEPTUAL TRANSLATION)',
  '>>RECEIPT: Scout telemetry confirmed',
  '>>STATUS: Target world catalogued',
  '>>ASSESSMENT: High cognitive density',
  '>>ASSESSMENT: Energy yield projection - OPTIMAL',
  '>>ASSESSMENT: Resistance threshold - NEGLIGIBLE',
  '>>DECISION: Proceed to Phase 2',
  '>>DEPLOYMENT: Second-generation integration assets',
  '>>TIMELINE: Alignment window (local: 2026)',
  '>>METHOD: Indirect biological seeding',
  '>>NOTE: Arrival unnecessary',
  '>>NOTE: Local biology will serve as intermediary',
  '>>NOTE: Extraction begins upon cognitive threshold',
  '═══ SIGNAL ENDS ═══',
  '  This transmission confirms what we feared most.',
  '  The scouts completed their mission.',
  '  A response has been sent.',
  '  But "response" is the wrong word.',
  '  They are not coming.',
  '  Something else is.',
  '  I have forwarded this to the Ministry.',
  '  I do not expect a reply.',
  '  [SEE ATTACHED SIGNAL VISUALIZATION]',
  'FILE: SECOND_DEPLOYMENT.SIG',
  'CLASSIFICATION: ULTRA — SIGNALS DIVISION',
  'This file contains intercepted signal data.',
  'Authentication required for access.',
  'Use: open second_deployment.sig',
  'MEMORANDUM — CLARIFICATION OF 2026 REFERENCE',
  'AUTHOR: [CLASSIFIED — senior intelligence officer]',
  'DATE: 01-APR-1996',
  'TO: ALL CLEARED PERSONNEL',
  'I write to correct a dangerous misunderstanding that',
  'has been circulating within this directorate.',
  'WHAT 2026 IS NOT',
  'Several colleagues have interpreted the recovered',
  'transmissions as predicting an invasion in 2026.',
  'This was our first reading. It was wrong.',
  '  2026 is NOT an invasion date.',
  '  It is NOT a fleet arrival.',
  '  It is NOT first contact.',
  '  It is NOT a single event.',
  'Colleagues who are sleeping better because they',
  'believe we have thirty years to prepare — you',
  'misunderstand the nature of what we are facing.',
  'WHAT 2026 IS',
  '  A TRANSITION WINDOW.',
  '  Based on cross-analysis of all recovered fragments:',
  '    - End of reconnaissance phase',
  '    - Activation of indirect systems',
  '    - Point beyond which intervention becomes impossible',
  'PLAIN LANGUAGE',
  '  Nothing arrives.',
  '  Something changes.',
  '  The change may already be in motion. We lack the',
  '  instrumentation to detect it. 2026 is simply when',
  '  we believe it becomes irreversible.',
  '  I do not write this to cause panic. I write it',
  '  because our contingency planning assumes an enemy',
  '  who will show up. This enemy may never show up.',
  '  That is precisely the problem.',
  'STRATEGIC IMPLICATION',
  '  There is no defense protocol for 2026.',
  '  There is no countermeasure to design.',
  '  There is no adversary to engage.',
  '  We are documenting a process that does not require',
  '  our participation or our consent.',
  '  Ministry has been informed. Their response was to',
  '  request this memorandum be reclassified to RED.',
  '  That was their only response.',
  'Energy Extraction Model - Theoretical visualization',
  'INTERNAL ANALYSIS — ENERGY EXTRACTION HYPOTHESIS',
  'CLASSIFICATION: RED — SPECULATIVE',
  'AUTHOR: [CLASSIFIED — senior analyst, signals division]',
  'DATE: 18-MAR-1996',
  'TO: DIRECTOR — ASSESSMENTS',
  'Sir,',
  'I submit this paper with reluctance. Its conclusions',
  'are disturbing and I am aware they sound irrational.',
  'But the data from the recovered neural patterns does',
  'not permit a gentler interpretation.',
  'RECOVERED FRAGMENTS — SCOUT NEURAL ANALYSIS',
  'Two phrases recur across all three specimen extractions:',
  '  Fragment 1: "higher cognition increases yield"',
  '  Fragment 2: reference to population density — billions',
  "Our linguist insists these are not the scouts' thoughts.",
  'They are instructions. Received. Embedded. Like firmware.',
  'ANALYST INTERPRETATION',
  'If the fragments are taken at face value, the picture',
  'that emerges is this:',
  '  - The scouts were measuring cognitive output.',
  '  - Intelligence is the resource being assessed.',
  '  - Population size determines extraction viability.',
  'I am a signals analyst, not a philosopher.',
  'But I believe they were calculating yield.',
  'Of us.',
  'THE QUESTION OF PRESERVATION',
  'The neural data contains no references to destruction.',
  'None. Not in any fragment.',
  'This troubled me until I understood why.',
  'If the resource is cognitive activity, then killing',
  'the source would terminate supply. The optimal strategy',
  'is preservation. The population must continue to live,',
  'think, create. The extraction must be invisible.',
  'Deus me livre — I wrote that sentence and my hands',
  'will not stop shaking.',
  'WHAT WE DO NOT KNOW',
  '  - The physical mechanism of extraction',
  '  - Whether extraction has already begun',
  '  - Whether the process can be detected or measured',
  '  - Whether resistance is even theoretically possible',
  'I request reassignment after filing this report.',
  'UTILITY — DATA RECONSTRUCTION TOOL',
  'VERSION: 1.7 (LEGACY)',
  'This utility can reconstruct fragmented data segments.',
  '  script <script_content>',
  'REQUIRED SCRIPT FORMAT:',
  '  A valid reconstruction script must contain:',
  '    - INIT command',
  '    - TARGET specification (valid archive path)',
  '    - EXEC command',
  'EXAMPLE:',
  '  script INIT;TARGET=/admin/fragment.dat;EXEC',
  'AVAILABLE TARGETS',
  '  /admin/neural_fragment.dat    [FRAGMENTED]',
  '  /comms/psi_residue.log        [CORRUPTED]',
  'NOTE: Successful reconstruction may reveal hidden content.',
  'OPERATIONAL SECURITY MEMORANDUM',
  'DOCUMENT: OSM-1993-X',
  'CLASSIFICATION: INTERNAL',
  'TO: All Field Personnel',
  'FROM: The Director, Special Projects',
  'DATE: 13-OCT-1993',
  'RE: Information Compartmentalization',
  'In light of recent security concerns, I am issuing the',
  'following directive effective immediately:',
  '  SHARE NOTHING BEYOND YOUR SCOPE.',
  'Information regarding ongoing projects is to be shared',
  'on a strict need-to-know basis. Even colleagues with',
  'appropriate clearance should not receive details beyond',
  'their assigned scope.',
  'Full operational awareness is distributed across',
  'departments and archives. This is by design.',
  'Those who require broader context must submit',
  'Form OSM-7 through their division chief.',
  'ADDENDUM (handwritten):',
  '  "Quem sabe demais, carrega peso demais."',
  '  (Who knows too much carries too much weight.)',
  'FIELD REPORT — INITIAL CONTACT',
  'LOCATION: Jardim Andere, Varginha, Minas Gerais',
  'DATE: 20-JAN-1996, 15:30h (local)',
  'WITNESSES:',
  '  Three female civilians, ages 14-22.',
  '  Names withheld per Protocol 7.',
  'LOCATION DETAILS:',
  '  Vacant lot between Rua Suécia and Rua Benevenuto Brás.',
  '  Area described as overgrown, partially obscured by',
  '  adjacent construction materials.',
  'WITNESS ACCOUNT (SUMMARY):',
  '  Subjects observed crouching figure approximately 1.6m',
  '  in height. Dark brown skin described as "oily." Three',
  '  prominent ridges on cranium. Large red eyes. Strong',
  '  ammonia-like odor noted.',
  '  Subjects fled scene. One reported temporary paralysis.',
  '  Another claimed "feeling its thoughts" — see psi/.',
  'TIMELINE:',
  '  13-JAN-1996: NORAD detects anomaly over Minas Gerais',
  '  19-JAN-1996: Farmers report "falling star" near Varginha',
  '  20-JAN-1996: 03:30h — Fire dept. receives calls re: "creature"',
  '  20-JAN-1996: 08:00h — Military cordons established',
  '  20-JAN-1996: 15:30h — Jardim Andere sighting (this report)',
  '  20-JAN-1996: 22:00h — Hospital São Sebastião incident',
  'SUBSEQUENT LOCATIONS:',
  '  - Escola de Sargentos das Armas (ESA)',
  '  - Hospital Humanitas',
  '  - Cemitério municipal (alleged)',
  '  Jardim Andere remains primary public touchpoint.',
  '  Subsequent containment sites not disclosed.',
  'INTERNAL MEMORANDUM — FACILITIES',
  'DATE: 19-JUL-1994',
  'RE: World Cup Celebration Guidelines',
  "Following Brazil's victory in the Copa do Mundo 1994,",
  'the following guidelines apply to workplace celebrations:',
  '  1. Television viewing permitted in break areas ONLY.',
  '  2. Caipirinha service restricted to after-hours events.',
  '  3. Samba music volume must not exceed 70dB.',
  '  4. The phrase "É TETRA!" may be exclaimed no more than',
  '     three (3) times per hour during work hours.',
  'APPROVED DECORATIONS:',
  '  - Brazilian flag (regulation size only)',
  '  - Team photographs (common areas only)',
  '  - "BRASIL CAMPEÃO" banners (break room only)',
  'PROHIBITED:',
  '  - Confetti (fire hazard)',
  '  - Fireworks (obvious reasons)',
  '  - Vuvuzelas (noise complaints)',
  'NOTE FROM DIRECTOR:',
  '  "Parabéns a todos. But remember — we have work to do.',
  '   The universe does not pause for futebol."',
  '  "Nem tudo é festa. Voltem ao trabalho segunda-feira."',
  '  (Not everything is a party. Return to work Monday.)',
  'MODEM CONNECTION LOG — EXTERNAL UPLINK',
  'DEVICE: US Robotics Sportster 28.8',
  'DATE: 18-JAN-1996',
  '18:42:03 ATDT 0xx-555-0147',
  '18:42:07 CONNECT 28800/ARQ/V34/LAPM/V42BIS',
  '18:42:09 Carrier detected',
  '18:42:12 PPP negotiation started',
  '18:42:15 IP assigned: 200.xxx.xxx.47',
  '18:42:16 Connection established',
  'SESSION ACTIVITY',
  '18:43:01 HTTP GET http://www.geocities.com/SiliconValley/...',
  '18:43:47 HTTP GET http://www.altavista.digital.com/...',
  '18:44:22 TELNET bbs.minas.com.br:23',
  '18:45:01 FILE TRANSFER: futebol_stats_95.txt (12KB)',
  '18:45:33 HTTP GET http://www.webcrawler.com/...',
  '18:46:12 IRC CONNECT irc.brasnet.org #bate-papo',
  'IRC TRANSCRIPT (PARTIAL)',
  '<streber74> alguem viu o jogo ontem?',
  '<shadow_man> qual jogo',
  '<streber74> cruzeiro x atletico. 2 a 1 pra raposa',
  '<mineiro99> foi roubado irmao',
  '<streber74> kkkk sempre a mesma coisa',
  '<nightowl> mudando de assunto, alguem tem o driver da soundblaster?',
  '<streber74> tenho. manda dcc.',
  '18:58:44 Connection terminated by remote host',
  '18:58:44 NO CARRIER',
  'BILLING: 16 minutes @ R$0.85/min = R$13.60',
  'RECOVERED FILE — USER DIRECTORY BACKUP',
  'OWNER: [REDACTED]',
  '-- ',
  '    _____',
  '   /     \\    "O BRASIL É O PAÍS DO FUTURO"',
  '  | () () |',
  '   \\  ^  /    A realidade é só uma ilusão,',
  '    |||||     mas uma bem persistente.',
  '    |||||              — A. Einstein',
  '  streber@bbs.unesp.br',
  '  PGP Key: 0xDEADBEEF',
  '  This .sig brought to you by:',
  '  - Too much coffee',
  '  - Not enough sleep',
  '  - Saudade',
  '  Best viewed in Netscape Navigator 2.0',
  '  <BLINK>UNDER CONSTRUCTION</BLINK>',
  'CAFETERIA MENU — WEEK 03 (15-19 JAN 1996)',
  '  Feijoada completa',
  '  Arroz branco, couve refogada, laranja',
  '  Farofa de bacon',
  '  Frango à passarinho',
  '  Purê de batata, salada mista',
  '  Peixe grelhado',
  '  Arroz, feijão tropeiro',
  '  Carne assada',
  '  Macarrão ao sugo',
  '  Salada de tomate',
  '  *** MENU CANCELLED ***',
  '  [INCIDENT RESPONSE ACTIVE]',
  '  Emergency rations distributed',
  "NOTE: Friday's menu cancelled due to unscheduled",
  'facility lockdown. See INCIDENT REPORT 1996-01-VG.',
  'Cafeteria staff reassigned to support operations.',
  'Vending machines remain operational.',
  'Dona Maria apologizes for the inconvenience.',
  '#!/bin/bash',
  '# ═══════════════════════════════════════════════════════════',
  '# EMERGENCY BACKUP SCRIPT',
  '# Created by: UFO74',
  '# Date: [TIMESTAMP REDACTED]',
  '# This script saves the collected evidence to external media',
  '# before the connection is cut.',
  'echo "Initiating emergency backup..."',
  'echo ""',
  '# Save critical documents',
  'for evidence in /collected/*.dat; do',
  '    cp "$evidence" /external/backup/',
  '    echo "[OK] $(basename $evidence) saved"',
  'done',
  'echo "Backup complete. Evidence persisted."',
  'echo "WARNING: Disconnection imminent..."',
  '# ───────────────────────────────────────────────────────────',
  '# INSTRUCTIONS:',
  '#   Execute with: run save_evidence.sh',
  '# TRACE PURGE UTIL — LEGACY NODE',
  '# OWNER: SYSADMIN (OBSOLETE)',
  '# This utility clears trace artifacts from volatile buffers.',
  '# Use only during active trace windows.',
  'echo "PURGE: Initiating trace buffer wipe..."',
  'echo "[OK] TRACE_QUEUE cleared"',
  'echo "[OK] ROUTE_TABLE scrubbed"',
  'echo "[OK] SESSION_LOG truncated"',
  'echo "NOTICE: Countermeasures reset. Expect re-scan."',
  '#   Execute with: run purge_trace.sh',
  'SECURITY LOG — TRACE PURGE EVENT',
  'Observation:',
  '  Legacy purge utility executed during active trace.',
  '  Buffer integrity reset; trace window re-opened.',
  'Assessment:',
  '  Operator demonstrated knowledge of internal tooling.',
  '  Session classified as HIGH PRIORITY.',
  'Recommendation:',
  '  Maintain surveillance. Do not terminate.',
  'INTEGRITY REGISTRY — EVIDENCE HASHES',
  'DATE: 27-JAN-1996',
  'Purpose:',
  '  Validate evidence artifacts against tampering.',
  'HASH SET:',
  '  material_x_analysis.dat     4A9F-77C2-11D0',
  '  transport_log_96.txt        98B1-2E14-CC7A',
  '  autopsy_alpha.log           7D0C-FF22-919B',
  '  transcript_core.enc         61E4-09D3-2B7F',
  '  thirty_year_cycle.txt       2D88-AC91-771E',
  '  Hash mismatch indicates altered narrative.',
  '  Preserve originals for external verification.',
  'RESIDUAL SESSION CAPTURE — GHOST FRAME',
  'TIMESTAMP: [REDACTED]',
  '[PARTIAL COMMAND TRACE]',
  '  > cd /storage/quarantine',
  '  > open bio_container.log',
  '  > open autopsy_alpha.log',
  '  > cd /comms/psi',
  '  > open transcript_core.enc',
  '  > connect autopsy_alpha.log transcript_core.enc',
  '  Prior operator achieved coherent linkage before purge.',
  '  Evidence trails remain viable. Do not repeat mistakes.',
  'REDACTION OVERRIDE CARD — INDEX 3',
  'CLEARANCE STRING:',
  '  "PHASE TWO IS ALREADY UNDERWAY"',
  '  Verify against redacted memos for completion checks.',
  'ADMIN MEMO — REDACTION PATCH',
  'DATE: 19-JAN-1996',
  'CORRECTED LINE:',
  '  PHASE ███ IS ██████ UNDERWAY',
  '  Do not store the full line in unsecured systems.',
  'AUDIO TRANSCRIPT — SECURITY HOTLINE',
  'DATE: 21-JAN-1996 02:12',
  'CALLER: "Keep it on tape. They never write this down."',
  'VOICE: Male, approx. 40s. Distressed.',
  '[TRANSCRIPT]',
  '  "...they told us to stage the perimeter breach."',
  '  "...they wanted the story to leak, but not cleanly."',
  '  "...make the evidence noisy, not gone."',
  '  Suggests intentional contamination of public record.',
  '▓▓▓ RECONSTRUCTED DATA — NEURAL FRAGMENT ▓▓▓',
  'RECONSTRUCTION: SUCCESSFUL',
  '═══ RECOVERED CONTENT ═══',
  'This fragment was captured during the final moments',
  'of Specimen GAMMA consciousness.',
  '[DIRECT NEURAL TRANSCRIPT]',
  '...mission complete... transmission received...',
  '...this form expires... acceptable...',
  '...we are not individuals... we are function...',
  '...the watchers do not grieve...',
  '...the watchers do not celebrate...',
  '...they only measure...',
  '...your kind measures too...',
  '...but you measure the wrong things...',
  '...you count years...',
  '...they count minds...',
  '...you fear death...',
  '...there are worse continuations...',
  '  This transcript was classified beyond normal clearance.',
  '  It implies consciousness continues after extraction.',
  '  Indefinitely. The committee decided this information',
  '  would serve no strategic purpose and could only',
  '  cause harm to personnel morale.',
  '═══ END RECOVERED CONTENT ═══',
  'RECOVERED VIDEO DATA - PARTIAL',
  'SOURCE: CONTAINMENT FACILITY B - CAM 07',
  'DATE: 1996-01-20 03:47:22',
  'STATUS: Partial frame recovery successful',
  'INTEGRITY: 47% - Significant temporal corruption',
  'CONTENT SUMMARY:',
  '  Surveillance footage from containment observation',
  '  chamber. Subject displays anomalous movement patterns.',
  '  Audio track corrupted beyond recovery.',
  'WARNING: Visual content may cause disorientation.',
  'COMMS/EXPERIMENTAL — NEURAL CLUSTER',
  'REFERENCE: NC-7 / OBS-RESIDUAL',
  '  This record describes an experimental attempt to',
  '  construct a synthetic neural network modeled after',
  '  dissected scout tissue. The objective is to emulate',
  '  residual perceptual activity rather than consciousness.',
  '  The cluster does not respond to dialogue. It emits',
  '  fragmented conceptual residues when stimulated.',
  '  Outputs are non-interactive, non-intentional.',
  'ACCESS NOTE:',
  '  Stimulation channel is undocumented and unstable.',
  '  Use is not authorized outside containment review.',
  'INTERNAL MEMO — CARGO TRANSFER COORDINATION',
  'TO: Site Operations',
  'FROM: Logistics Division',
  'RE: Special cargo arrival and processing',
  'The recovered equipment arrived yesterday evening.',
  'Initial inspection complete. Contents intact despite',
  'transport conditions. Some surface wear noted',
  'but within acceptable parameters.',
  'Storage requirements:',
  '  - Temperature: Standard warehouse conditions',
  '  - Humidity: Controlled',
  '  - Access: Restricted per standard protocol',
  'Foreign partners have been notified.',
  'Expect coordination team within 72 hours.',
  'Please ensure receiving bay is cleared.',
  '[signature illegible]',
  'SECURITY BRIEFING — VISITING DELEGATION',
  'SUBJECT: Protocol for visitors',
  'The visitors will arrive via private aircraft.',
  'They have been granted full access to Facilities 1-3.',
  'Escort required at all times. No photography.',
  'The delegation is primarily interested in:',
  '  - Review of recently recovered equipment',
  '  - Assessment of storage conditions',
  '  - Coordination on future monitoring schedules',
  'They will be accompanied by their own technical team.',
  'Our role is observation and cooperation only.',
  'REMINDER: Standard plausible deniability protocols',
  'remain in effect. All documentation uses approved',
  'terminology. No direct references.',
  'Questions directed to Protocol Office.',
  'ASSET DISPOSITION REPORT',
  'REFERENCE: ADR-96-007',
  'ASSET CATEGORY: Special Materials',
  'DISPOSITION SUMMARY:',
  '  Item A-1: Transferred to foreign partner (complete)',
  '  Item A-2: Retained for domestic study',
  '  Item A-3: Status: Degraded during transport',
  '  Item B-1: Partial. Components separated.',
  '           Primary section: Partner facility',
  '           Secondary components: Undisclosed',
  '           Navigation system: Partner custody',
  'INSTRUMENTATION:',
  '  Devices recovered but non-functional.',
  '  Purpose remains unclear.',
  'FINAL STATUS: Assets distributed per agreement.',
  'APPROVED TERMINOLOGY REFERENCE',
  'FOR: All personnel handling sensitive documentation',
  'This guide establishes approved terminology for',
  'documentation purposes. Use of direct language is',
  'prohibited in any records that may be audited.',
  '────────────────────────────────────────',
  'APPROVED TERMS AND DEFINITIONS',
  '  "Weather balloon"  = Standard cover designation',
  '  "Meteorological anomaly" = Unclassified aerial event',
  '  "Fauna specimen"   = Recovered biological material',
  '  "Wild animal"      = Unclassified biological subject',
  '  "Agricultural equipment" = Recovered hardware',
  '  "Special cargo"    = Classified shipment',
  '  "The visitors"     = Foreign delegation',
  '  "Assets"           = Recovered items (any type)',
  '  "Procurement"      = Recovery operations',
  '  "Acquisitions"     = Seized/recovered materials',
  '  "Technical team"   = Scientific personnel',
  '  "Samples"          = Collected material',
  '  "Instrumentation"  = Recovered technology',
  '  "Transport issues" = Deterioration during transfer',
  'USAGE NOTES',
  '  Do NOT use direct descriptive terms in',
  '  any documentation subject to external review.',
  '  All documentation must maintain plausible',
  '  deniability under Congressional review.',
] as const;

const RUNTIME_TRANSLATIONS_WAVE_4_FALLBACKS: Record<Exclude<Language, 'en'>, RuntimeDictionary> = {
  'pt-BR': {
    'Recovered visual - Foreign drone analysis': 'Visual recuperado - Análise de drone estrangeiro',
    'Recovered visual - Crash site material': 'Visual recuperado - Material do local da queda',
    'Recovered visual - Bio containment': 'Visual recuperado - Contenção biológica',
    'Recovered visual - Autopsy subject': 'Visual recuperado - Sujeito da autópsia',
    '': '',
    '═══════════════════════════════════════════════════════════':
      '═══════════════════════════════════════════════════════════',
    '───────────────────────────────────────────────────────────':
      '───────────────────────────────────────────────────────────',
    '  ─────────────────────────────────': '  ─────────────────────────────────',
    '─────────────────────────────────────────────────────────':
      '─────────────────────────────────────────────────────────',
    '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓':
      '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
    '════════════════════': '════════════════════',
    '══════════════════════════════════════════════':
      '══════════════════════════════════════════════',
    '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓':
      '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
    '────────────────────────────────────────': '────────────────────────────────────────',
  },
  es: {
    'Recovered visual - Foreign drone analysis': 'Visual recuperado - Análisis de dron extranjero',
    'Recovered visual - Crash site material': 'Visual recuperado - Material del sitio del impacto',
    'Recovered visual - Bio containment': 'Visual recuperado - Contención biológica',
    'Recovered visual - Autopsy subject': 'Visual recuperado - Sujeto de la autopsia',
    '': '',
    '═══════════════════════════════════════════════════════════':
      '═══════════════════════════════════════════════════════════',
    '───────────────────────────────────────────────────────────':
      '───────────────────────────────────────────────────────────',
    '  ─────────────────────────────────': '  ─────────────────────────────────',
    '─────────────────────────────────────────────────────────':
      '─────────────────────────────────────────────────────────',
    '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓':
      '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
    '════════════════════': '════════════════════',
    '══════════════════════════════════════════════':
      '══════════════════════════════════════════════',
    '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓':
      '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
    '────────────────────────────────────────': '────────────────────────────────────────',
  },
};

function pickRuntimeTranslations(
  source: RuntimeDictionary,
  keys: readonly string[],
  fallbacks: RuntimeDictionary
): RuntimeDictionary {
  return Object.fromEntries(keys.map(key => [key, source[key] ?? fallbacks[key] ?? key]));
}

const RUNTIME_TRANSLATIONS_WAVE_4: Record<Exclude<Language, 'en'>, RuntimeDictionary> = {
  'pt-BR': pickRuntimeTranslations(
    RUNTIME_TRANSLATIONS_PRE_WAVE_4['pt-BR'],
    RUNTIME_TRANSLATIONS_WAVE_4_KEYS,
    RUNTIME_TRANSLATIONS_WAVE_4_FALLBACKS['pt-BR']
  ),
  es: pickRuntimeTranslations(
    RUNTIME_TRANSLATIONS_PRE_WAVE_4.es,
    RUNTIME_TRANSLATIONS_WAVE_4_KEYS,
    RUNTIME_TRANSLATIONS_WAVE_4_FALLBACKS.es
  ),
};

export const RUNTIME_TRANSLATIONS: Record<Exclude<Language, 'en'>, RuntimeDictionary> = {
  'pt-BR': {
    ...RUNTIME_TRANSLATIONS_PRE_WAVE_4['pt-BR'],
    ...RUNTIME_TRANSLATIONS_WAVE_4['pt-BR'],
    ...RUNTIME_DATA_TRANSLATIONS['pt-BR'],
  },
  es: {
    ...RUNTIME_TRANSLATIONS_PRE_WAVE_4.es,
    ...RUNTIME_TRANSLATIONS_WAVE_4.es,
    ...RUNTIME_DATA_TRANSLATIONS.es,
  },
};
