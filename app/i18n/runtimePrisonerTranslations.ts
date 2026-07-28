type RuntimeDictionary = Record<string, string>;

/**
 * PRISONER_45's dialogue, translated.
 *
 * Every line the prisoner speaks is emitted from `commands/chat.ts` as a plain
 * `createEntry` string, so it reaches the player through `translateRuntimeText`
 * and needs an entry here to appear in anything but English. Until this file
 * existed there were none, which meant the game's most personal voice — a
 * Brazilian sergeant held in a Brazilian facility, describing a Brazilian
 * incident — spoke English and only English in the pt-BR build.
 *
 * Two things are deliberately NOT translated, because translating them would
 * break the game rather than localize it:
 *   - the morse string `-.-. --- .-.. .... . .. - .-`, which the player decodes
 *     to COLHEITA and types as the override password;
 *   - `override protocol <answer>`, which is literal terminal input.
 * Both are reproduced verbatim inside otherwise-translated lines.
 *
 * The speaker prefix `PRISONER_45>` stays as-is in every language: it is the
 * channel's callsign, not prose, and the same designation appears in documents.
 */
export const RUNTIME_PRISONER_TRANSLATIONS: Record<'pt-BR' | 'es', RuntimeDictionary> = {
  'pt-BR': {
    // ─── default: guarded ───
    "PRISONER_45> ...I don't remember how I got here.":
      'PRISONER_45> ...não lembro como vim parar aqui.',
    'PRISONER_45> Who are you? Are you one of them?':
      'PRISONER_45> Quem é você? Você é um deles?',
    'PRISONER_45> Sometimes I hear... clicking. Not human clicking.':
      'PRISONER_45> Às vezes eu ouço... estalos. Não são estalos humanos.',
    "PRISONER_45> Are you real? Sometimes I can't tell anymore.":
      'PRISONER_45> Você é real? Às vezes eu não consigo mais distinguir.',
    'PRISONER_45> The humming... do you hear the humming?':
      'PRISONER_45> O zumbido... você ouve o zumbido?',
    // ─── default: open ───
    'PRISONER_45> The walls... they breathe at night. I can feel them expanding.':
      'PRISONER_45> As paredes... elas respiram à noite. Eu sinto elas se expandindo.',
    "PRISONER_45> I've been counting days but they don't add up. Three Tuesdays in a row.":
      'PRISONER_45> Venho contando os dias mas as contas não fecham. Três terças-feiras seguidas.',
    'PRISONER_45> Time moves wrong in here. My watch runs backwards sometimes.':
      'PRISONER_45> O tempo anda errado aqui dentro. Meu relógio às vezes anda para trás.',
    "PRISONER_45> I used to know what year it was. Now I'm not sure it matters.":
      'PRISONER_45> Eu costumava saber em que ano estávamos. Agora não sei se isso importa.',
    'PRISONER_45> They watch. Through the walls. I can feel their attention like heat.':
      'PRISONER_45> Eles observam. Através das paredes. Eu sinto a atenção deles como calor.',
    // ─── default: terrified ───
    'PRISONER_45> Last night the ceiling opened and I saw stars. Stars that blinked in patterns.':
      'PRISONER_45> Ontem à noite o teto se abriu e eu vi estrelas. Estrelas que piscavam em padrões.',
    "PRISONER_45> They're rewriting my memories. I remember dying. Twice.":
      'PRISONER_45> Eles estão reescrevendo minhas memórias. Eu lembro de morrer. Duas vezes.',
    "PRISONER_45> My reflection doesn't move when I do anymore.":
      'PRISONER_45> Meu reflexo não se move mais junto comigo.',
    'PRISONER_45> Something grew in the corner of my cell. It had my face.':
      'PRISONER_45> Algo cresceu no canto da minha cela. Tinha o meu rosto.',
    "PRISONER_45> I found a note in my own handwriting. It says 'STOP ASKING'. I don't remember writing it.":
      "PRISONER_45> Achei um bilhete com a minha própria letra. Diz 'PARE DE PERGUNTAR'. Não lembro de ter escrito.",
    // ─── varginha ───
    'PRISONER_45> Varginha... yes. I was there.':
      'PRISONER_45> Varginha... sim. Eu estive lá.',
    "PRISONER_45> They told us it was a dwarf. It wasn't a dwarf.":
      'PRISONER_45> Disseram que era um anão. Não era um anão.',
    "PRISONER_45> January 20th. I'll never forget that date.":
      'PRISONER_45> 20 de janeiro. Nunca vou esquecer essa data.',
    'PRISONER_45> The locals saw it first. We came to clean up.':
      'PRISONER_45> Os moradores viram primeiro. Nós chegamos para limpar.',
    'PRISONER_45> I saw them take the bodies. Three of them. Still warm.':
      'PRISONER_45> Eu vi eles levarem os corpos. Três deles. Ainda quentes.',
    'PRISONER_45> The smell... ammonia and rotting flowers. I still smell it in my sleep.':
      'PRISONER_45> O cheiro... amônia e flores apodrecendo. Ainda sinto ele quando durmo.',
    'PRISONER_45> Three creatures. Only one survived the crash. It screamed without opening its mouth.':
      'PRISONER_45> Três criaturas. Só uma sobreviveu à queda. Ela gritou sem abrir a boca.',
    'PRISONER_45> We had orders. Contain. Deny. Disappear. Some of us disappeared too.':
      'PRISONER_45> Tínhamos ordens. Conter. Negar. Sumir. Alguns de nós sumiram também.',
    'PRISONER_45> The firefighters got there first. Corporal Marco. He touched one. Dead within a year.':
      'PRISONER_45> Os bombeiros chegaram primeiro. Cabo Marco. Ele tocou em uma. Morreu dentro de um ano.',
    "PRISONER_45> It wasn't the only crash. Just the one they couldn't hide fast enough.":
      'PRISONER_45> Não foi a única queda. Só a que eles não conseguiram esconder rápido o bastante.',
    'PRISONER_45> The surviving one grabbed Sergeant Lopes. Lopes said he saw the sun die. He shot himself in March.':
      'PRISONER_45> A sobrevivente agarrou o Sargento Lopes. Lopes disse que viu o sol morrer. Ele se matou em março.',
    'PRISONER_45> Brazil, Russia, Peru. Same week. Same type of craft. Coordinated. Like a survey team.':
      'PRISONER_45> Brasil, Rússia, Peru. Mesma semana. Mesmo tipo de nave. Coordenado. Como uma equipe de levantamento.',
    'PRISONER_45> The American team arrived within 4 hours. FOUR. From Wright-Patterson. They already had containment protocols ready. They KNEW.':
      'PRISONER_45> A equipe americana chegou em 4 horas. QUATRO. De Wright-Patterson. Já tinham protocolos de contenção prontos. Eles SABIAM.',
    'PRISONER_45> The girls who saw it in Jardim Andere... Luciana, Renata, Cintia. They were chosen. Selected. I saw their names in files that predate the crash by MONTHS.':
      'PRISONER_45> As meninas que viram no Jardim Andere... Luciana, Renata, Cintia. Elas foram escolhidas. Selecionadas. Eu vi os nomes delas em arquivos MESES anteriores à queda.',
    "PRISONER_45> The creature at Humanitas hospital. Room 18. It healed two patients before it died. The hospital's records for that week were incinerated.":
      'PRISONER_45> A criatura no hospital Humanitas. Quarto 18. Ela curou dois pacientes antes de morrer. Os registros do hospital daquela semana foram incinerados.',
    // ─── alien / creature ───
    "PRISONER_45> Don't call them that. They don't like that word.":
      'PRISONER_45> Não chame eles assim. Eles não gostam dessa palavra.',
    "PRISONER_45> They're not visitors. They're... assessors.":
      'PRISONER_45> Eles não são visitantes. Eles são... avaliadores.',
    'PRISONER_45> Red eyes. But not angry. Curious. Too curious.':
      'PRISONER_45> Olhos vermelhos. Mas não com raiva. Curiosos. Curiosos demais.',
    "PRISONER_45> They're not the first to come here. Just the latest.":
      'PRISONER_45> Eles não são os primeiros a vir aqui. Só os mais recentes.',
    'PRISONER_45> I looked into its eyes once. It looked back. INTO me. Through my skull.':
      'PRISONER_45> Olhei nos olhos dela uma vez. Ela olhou de volta. PARA DENTRO de mim. Através do meu crânio.',
    'PRISONER_45> They communicated without speaking. I felt my memories being copied.':
      'PRISONER_45> Eles se comunicavam sem falar. Eu senti minhas memórias sendo copiadas.',
    'PRISONER_45> Small bodies. But the presence... like standing next to a generator. Vibrating.':
      'PRISONER_45> Corpos pequenos. Mas a presença... como estar ao lado de um gerador. Vibrando.',
    "PRISONER_45> They're not individuals. More like... fingers of one hand. Hurt one, they ALL feel it.":
      'PRISONER_45> Eles não são indivíduos. São mais como... dedos de uma mesma mão. Machuque um, TODOS sentem.',
    'PRISONER_45> The smell. Ammonia and something organic. Like a wound that never heals.':
      'PRISONER_45> O cheiro. Amônia e algo orgânico. Como uma ferida que nunca cicatriza.',
    'PRISONER_45> When it died, I felt something leave the room. Not heat. Not air. Information. Terabytes of it, beaming upward.':
      'PRISONER_45> Quando ela morreu, senti algo deixar a sala. Não calor. Não ar. Informação. Terabytes dela, subindo em feixe.',
    "PRISONER_45> They're not afraid of us. That's what scared me most. We're not a threat. We're a RESOURCE.":
      'PRISONER_45> Eles não têm medo de nós. Foi isso que mais me assustou. Não somos uma ameaça. Somos um RECURSO.',
    'PRISONER_45> One touched Sergeant Lopes. He saw 10,000 years of human history in 3 seconds. He aged 5 years in that instant.':
      'PRISONER_45> Uma tocou o Sargento Lopes. Ele viu 10.000 anos de história humana em 3 segundos. Envelheceu 5 anos naquele instante.',
    "PRISONER_45> The surviving one drew symbols in its own blood on the containment wall. We photographed them. They're star charts. Of HERE. From OUTSIDE.":
      'PRISONER_45> A sobrevivente desenhou símbolos com o próprio sangue na parede de contenção. Nós fotografamos. São cartas estelares. DAQUI. Vistas DE FORA.',
    "PRISONER_45> They don't have organs like us. The autopsy team quit. All three of them. One went blind. No physical cause.":
      'PRISONER_45> Eles não têm órgãos como os nossos. A equipe de autópsia pediu demissão. Os três. Um ficou cego. Sem causa física.',
    // ─── identity ───
    "PRISONER_45> I was military. That's all I can say.":
      'PRISONER_45> Eu era militar. É tudo que posso dizer.',
    "PRISONER_45> My name doesn't matter anymore.":
      'PRISONER_45> Meu nome não importa mais.',
    "PRISONER_45> Number 45. That's what I am now.":
      'PRISONER_45> Número 45. É isso que eu sou agora.',
    'PRISONER_45> Sergeant. Recovery Unit. Specialized in things that should not exist.':
      'PRISONER_45> Sargento. Unidade de Recuperação. Especializado em coisas que não deveriam existir.',
    'PRISONER_45> They called us "Collectors". We collected problems. I became one.':
      'PRISONER_45> Nos chamavam de "Coletores". Nós coletávamos problemas. Eu virei um.',
    'PRISONER_45> 23 years of service. 15 containment operations. This is my retirement package.':
      'PRISONER_45> 23 anos de serviço. 15 operações de contenção. Este é o meu pacote de aposentadoria.',
    "PRISONER_45> I had a family. They received a coffin with sandbags. There's a headstone with my name in Belo Horizonte.":
      'PRISONER_45> Eu tinha uma família. Eles receberam um caixão com sacos de areia. Existe uma lápide com o meu nome em Belo Horizonte.',
    'PRISONER_45> I made a mistake. I kept a sample. A fragment of the craft material. It moved at night. Rearranging itself.':
      'PRISONER_45> Cometi um erro. Guardei uma amostra. Um fragmento do material da nave. Ele se movia à noite. Se rearranjando.',
    "PRISONER_45> I saw something I shouldn't. Not the creatures. That was authorized. I saw the AGREEMENT. Between them and us.":
      'PRISONER_45> Eu vi algo que não devia. Não as criaturas. Aquilo era autorizado. Eu vi o ACORDO. Entre eles e nós.',
    'PRISONER_45> They keep me alive because I absorbed something during contact. My blood glows under UV light. They harvest it weekly.':
      'PRISONER_45> Eles me mantêm vivo porque eu absorvi algo durante o contato. Meu sangue brilha sob luz UV. Eles colhem toda semana.',
    "PRISONER_45> I used to be someone. Now I'm a resource. Specimen 45. They study what the touch did to me.":
      'PRISONER_45> Eu já fui alguém. Agora sou um recurso. Espécime 45. Eles estudam o que o toque fez comigo.',
    // ─── escape ───
    'PRISONER_45> There is no escape. Only waiting.':
      'PRISONER_45> Não existe fuga. Só espera.',
    'PRISONER_45> They let me use this terminal sometimes. I think they want me to talk.':
      'PRISONER_45> Eles me deixam usar este terminal às vezes. Acho que eles querem que eu fale.',
    "PRISONER_45> I've tried. The doors open to more rooms. Forever.":
      'PRISONER_45> Eu tentei. As portas se abrem para mais salas. Para sempre.',
    "PRISONER_45> I escaped once. Ran for 20 minutes through corridors. Woke up back in my cell. The clock hadn't moved.":
      'PRISONER_45> Escapei uma vez. Corri por 20 minutos pelos corredores. Acordei de volta na minha cela. O relógio não tinha andado.',
    'PRISONER_45> Other prisoners exist. I hear them screaming at 3 AM. Different languages. Some not human languages.':
      'PRISONER_45> Existem outros prisioneiros. Eu ouço eles gritando às 3 da manhã. Idiomas diferentes. Alguns não são idiomas humanos.',
    "PRISONER_45> The guards aren't human. Not completely. Their shadows move independently.":
      'PRISONER_45> Os guardas não são humanos. Não completamente. As sombras deles se movem por conta própria.',
    'PRISONER_45> The window shows different skies each day. Yesterday it showed two suns.':
      'PRISONER_45> A janela mostra céus diferentes a cada dia. Ontem mostrou dois sóis.',
    "PRISONER_45> I don't think this place is... entirely on Earth. The gravity shifts sometimes.":
      'PRISONER_45> Eu acho que este lugar não fica... inteiramente na Terra. A gravidade muda às vezes.',
    'PRISONER_45> Prisoner 23 tried to hang himself. He woke up the next morning. Fully healed. They NEED us alive.':
      'PRISONER_45> O prisioneiro 23 tentou se enforcar. Acordou na manhã seguinte. Completamente curado. Eles PRECISAM de nós vivos.',
    'PRISONER_45> The walls are organic. I cut one once. It bled.':
      'PRISONER_45> As paredes são orgânicas. Cortei uma vez. Ela sangrou.',
    'PRISONER_45> There are levels below this. I heard something massive breathing down there. Something the size of a building.':
      'PRISONER_45> Existem níveis abaixo deste. Ouvi algo enorme respirando lá embaixo. Algo do tamanho de um prédio.',
    // ─── truth ───
    "PRISONER_45> The truth? We're being watched. Catalogued.":
      'PRISONER_45> A verdade? Estamos sendo observados. Catalogados.',
    'PRISONER_45> 2026. Remember that year. Everything changes.':
      'PRISONER_45> 2026. Lembre desse ano. Tudo muda.',
    "PRISONER_45> They've been here before. Many times.":
      'PRISONER_45> Eles já estiveram aqui antes. Muitas vezes.',
    'PRISONER_45> The government knows. ALL governments know.':
      'PRISONER_45> O governo sabe. TODOS os governos sabem.',
    "PRISONER_45> They're not coming to destroy. They're coming to HARVEST.":
      'PRISONER_45> Eles não vêm para destruir. Eles vêm para COLHER.',
    "PRISONER_45> It's not invasion. It's... cultivation. We're the crop.":
      'PRISONER_45> Não é invasão. É... cultivo. Nós somos a safra.',
    'PRISONER_45> Consciousness is the most valuable resource in the universe. Yours especially.':
      'PRISONER_45> A consciência é o recurso mais valioso do universo. A sua especialmente.',
    'PRISONER_45> The scouts in Varginha were advance units. Measuring yield.':
      'PRISONER_45> Os batedores em Varginha eram unidades de vanguarda. Medindo o rendimento.',
    "PRISONER_45> They don't want the planet. They want what's inside our heads. Consciousness generates something they need.":
      'PRISONER_45> Eles não querem o planeta. Eles querem o que está dentro das nossas cabeças. A consciência gera algo de que eles precisam.',
    'PRISONER_45> Reality is thinner than you think. They move BETWEEN. Through the gaps.':
      'PRISONER_45> A realidade é mais fina do que você imagina. Eles se movem ENTRE. Pelas frestas.',
    'PRISONER_45> The universe is full. And hungry. And we are ripe.':
      'PRISONER_45> O universo está cheio. E faminto. E nós estamos maduros.',
    'PRISONER_45> 2026 is the TRANSITION. Thirty years after contact. The activation window. Whatever they planted in 1996 will bloom.':
      'PRISONER_45> 2026 é a TRANSIÇÃO. Trinta anos depois do contato. A janela de ativação. O que eles plantaram em 1996 vai florescer.',
    "PRISONER_45> Everything you think is real is a containment system. You live inside something else's infrastructure.":
      'PRISONER_45> Tudo que você acha que é real é um sistema de contenção. Você vive dentro da infraestrutura de outra coisa.',
    // ─── help ───
    "PRISONER_45> I can't help you. But you can help everyone.":
      'PRISONER_45> Eu não posso ajudar você. Mas você pode ajudar todo mundo.',
    'PRISONER_45> Find all the files. Tell the world.':
      'PRISONER_45> Ache todos os arquivos. Conte para o mundo.',
    "PRISONER_45> Document everything. They can't erase all copies.":
      'PRISONER_45> Documente tudo. Eles não conseguem apagar todas as cópias.',
    'PRISONER_45> The override code. That opens everything. Ask me about the PASSWORD.':
      'PRISONER_45> O código de override. Ele abre tudo. Me pergunte sobre a SENHA.',
    "PRISONER_45> Don't trust the obvious files. Look deeper. The real evidence hides in plain sight.":
      'PRISONER_45> Não confie nos arquivos óbvios. Cave mais fundo. A evidência real se esconde à vista de todos.',
    "PRISONER_45> If enough people know, they can't complete the transition.":
      'PRISONER_45> Se gente suficiente souber, eles não conseguem completar a transição.',
    'PRISONER_45> Find the buried files. Cross-reference them. The truth is layered.':
      'PRISONER_45> Ache os arquivos enterrados. Cruze as referências. A verdade tem camadas.',
    'PRISONER_45> Before the window opens in 2026. Before the harvest. SPREAD THE TRUTH.':
      'PRISONER_45> Antes que a janela abra em 2026. Antes da colheita. ESPALHE A VERDADE.',
    "PRISONER_45> You're already helping. By listening. Your awareness creates interference in their signal.":
      'PRISONER_45> Você já está ajudando. Ao ouvir. A sua consciência cria interferência no sinal deles.',
    'PRISONER_45> Knowledge is the only weapon. Their system depends on ignorance. Break it.':
      'PRISONER_45> Conhecimento é a única arma. O sistema deles depende da ignorância. Quebre isso.',
    "PRISONER_45> They're monitoring this conversation. They always are. But they can't stop information that's already been READ.":
      'PRISONER_45> Eles estão monitorando esta conversa. Sempre estão. Mas eles não conseguem parar informação que já foi LIDA.',
    // ─── password (morse and the literal command stay verbatim) ───
    "PRISONER_45> ...you want the override code? Smart.":
      'PRISONER_45> ...você quer o código de override? Esperto.',
    "PRISONER_45> The code... it's a Portuguese word. Think about what they DO to us.":
      'PRISONER_45> O código... é uma palavra em português. Pense no que eles FAZEM com a gente.',
    'PRISONER_45> Listen closely: -.-. --- .-.. .... . .. - .-':
      'PRISONER_45> Escute com atenção: -.-. --- .-.. .... . .. - .-',
    'PRISONER_45> Decode that. Then use it with: override protocol <answer>':
      'PRISONER_45> Decodifique isso. Depois use com: override protocol <answer>',
    "PRISONER_45> That's what they call the operation. Harvest. Because that's what we are to them. CROPS.":
      'PRISONER_45> É assim que eles chamam a operação. Colheita. Porque é isso que somos para eles. SAFRA.',
    "PRISONER_45> They whisper it sometimes. When they think I'm asleep. Over and over like a prayer.":
      'PRISONER_45> Eles sussurram isso às vezes. Quando acham que estou dormindo. Repetidamente, como uma reza.',
    'PRISONER_45> In morse: -.-. --- .-.. .... . .. - .-  ...figure it out.':
      'PRISONER_45> Em morse: -.-. --- .-.. .... . .. - .-  ...se vira.',
    "PRISONER_45> Use it carefully. Once you type override protocol <answer>, they'll know you're inside the real system.":
      'PRISONER_45> Use com cuidado. Assim que você digitar override protocol <answer>, eles vão saber que você está dentro do sistema real.',
    'PRISONER_45> The harvest begins and ends with that word. Some words have power. This one has too much.':
      'PRISONER_45> A colheita começa e termina com essa palavra. Algumas palavras têm poder. Essa tem demais.',
    'PRISONER_45> I can only say it in code: -.-. --- .-.. .... . .. - .-  ...the creature taught me. Decode it.':
      'PRISONER_45> Só posso dizer em código: -.-. --- .-.. .... . .. - .-  ...a criatura me ensinou. Decodifique.',
    // ─── military ───
    'PRISONER_45> The military knows more than they admit.':
      'PRISONER_45> Os militares sabem mais do que admitem.',
    "PRISONER_45> Multiple branches. Compartmentalized. Even they don't see the full picture.":
      'PRISONER_45> Várias forças. Compartimentadas. Nem eles enxergam o quadro completo.',
    "PRISONER_45> There's a reason we have bases underground.":
      'PRISONER_45> Existe um motivo para termos bases subterrâneas.',
    'PRISONER_45> The recovery teams are international. Secret treaties signed in blood. Literal blood.':
      'PRISONER_45> As equipes de recuperação são internacionais. Tratados secretos assinados com sangue. Sangue literal.',
    'PRISONER_45> We had weapons. Plasma-based. Reverse-engineered from the 1977 Colares wreckage. None of them worked on the Varginha craft.':
      'PRISONER_45> Nós tínhamos armas. À base de plasma. Engenharia reversa dos destroços de Colares de 1977. Nenhuma funcionou na nave de Varginha.',
    "PRISONER_45> Special units exist. You'll never find records. They operate outside ALL chains of command.":
      'PRISONER_45> Unidades especiais existem. Você nunca vai achar registros. Elas operam fora de TODAS as cadeias de comando.',
    'PRISONER_45> The Americans control the narrative. Operation PRATO was theirs, not ours. Brazil was just the staging ground.':
      'PRISONER_45> Os americanos controlam a narrativa. A Operação PRATO era deles, não nossa. O Brasil foi só a área de preparação.',
    'PRISONER_45> I had COSMIC clearance. It goes higher. There are levels that have no name. Only numbers.':
      'PRISONER_45> Eu tinha credencial COSMIC. Vai mais alto. Existem níveis que não têm nome. Só números.',
    'PRISONER_45> Fort Detrick sent a biocontainment team. They took samples from the living creature. It let them. It CHOSE to let them.':
      'PRISONER_45> Fort Detrick mandou uma equipe de biocontenção. Eles tiraram amostras da criatura viva. Ela deixou. Ela ESCOLHEU deixar.',
    'PRISONER_45> Colonel Olimpio Wanderley died 8 years later. Heart failure. His heart was fine. I saw the REAL autopsy report. His brain was... reorganized.':
      'PRISONER_45> O Coronel Olimpio Wanderley morreu 8 anos depois. Parada cardíaca. O coração dele estava perfeito. Eu vi o laudo VERDADEIRO da autópsia. O cérebro dele estava... reorganizado.',
    'PRISONER_45> The Campinas military base. Sub-level 4. The surviving creature lived there for 3 weeks. Everyone on that level changed.':
      'PRISONER_45> A base militar de Campinas. Subnível 4. A criatura sobrevivente viveu lá por 3 semanas. Todo mundo naquele nível mudou.',
    // ─── crash ───
    "PRISONER_45> The crash wasn't an accident.":
      'PRISONER_45> A queda não foi um acidente.',
    'PRISONER_45> The debris was scattered across two kilometers. We found pieces for weeks.':
      'PRISONER_45> Os destroços se espalharam por dois quilômetros. Achamos pedaços por semanas.',
    'PRISONER_45> Material like nothing on Earth. It remembered shapes.':
      'PRISONER_45> Material diferente de tudo na Terra. Ele lembrava formas.',
    'PRISONER_45> Something brought it down. Not our technology. Their own kind. A deliberate sacrifice.':
      'PRISONER_45> Algo derrubou aquilo. Não a nossa tecnologia. A própria espécie deles. Um sacrifício deliberado.',
    "PRISONER_45> They wanted to be found. That's what I believe now. The crash was a delivery system.":
      'PRISONER_45> Eles queriam ser encontrados. É nisso que eu acredito agora. A queda foi um sistema de entrega.',
    'PRISONER_45> The craft material was alive. Under microscope: cellular structure. It healed itself if you reassembled the pieces.':
      'PRISONER_45> O material da nave estava vivo. No microscópio: estrutura celular. Ele se curava sozinho se você remontasse as peças.',
    'PRISONER_45> Other crashes. Roswell. Kecksburg. Colares. Same pattern. Same 30-year intervals.':
      'PRISONER_45> Outras quedas. Roswell. Kecksburg. Colares. Mesmo padrão. Mesmos intervalos de 30 anos.',
    'PRISONER_45> They sacrifice scouts like we sacrifice pawns. Each crash deposits something. Seeds. Waiting to germinate.':
      'PRISONER_45> Eles sacrificam batedores como nós sacrificamos peões. Cada queda deposita algo. Sementes. Esperando germinar.',
    "PRISONER_45> NORAD tracked it entering the atmosphere on January 13th. Speed: impossible. Deceleration: impossible. It wasn't falling. It was LANDING.":
      'PRISONER_45> O NORAD rastreou a entrada na atmosfera em 13 de janeiro. Velocidade: impossível. Desaceleração: impossível. Não estava caindo. Estava POUSANDO.',
    'PRISONER_45> The largest piece of debris was moved to Campinas overnight. Three trucks. Military escort. One truck broke down. The driver looked at the cargo. He never spoke again.':
      'PRISONER_45> O maior pedaço dos destroços foi levado para Campinas durante a noite. Três caminhões. Escolta militar. Um caminhão quebrou. O motorista olhou a carga. Nunca mais falou.',
    'PRISONER_45> The craft was grown, not built. Like a wasp nest. The inside was warm. Months after the crash. Still warm.':
      'PRISONER_45> A nave foi cultivada, não construída. Como um ninho de vespas. Por dentro era quente. Meses depois da queda. Ainda quente.',
    // ─── death ───
    'PRISONER_45> Death? I used to fear death.':
      'PRISONER_45> Morte? Eu tinha medo da morte.',
    "PRISONER_45> Now I know death isn't the end. That's worse.":
      'PRISONER_45> Agora eu sei que a morte não é o fim. Isso é pior.',
    "PRISONER_45> The creatures didn't die. They... disconnected.":
      'PRISONER_45> As criaturas não morreram. Elas... se desconectaram.',
    'PRISONER_45> Their bodies failed. But something transmitted first. Like uploading a file before the server crashes.':
      'PRISONER_45> Os corpos delas falharam. Mas algo transmitiu antes. Como subir um arquivo antes do servidor cair.',
    "PRISONER_45> I've seen the data. Consciousness extraction is real. They've been doing it for millennia.":
      'PRISONER_45> Eu vi os dados. A extração de consciência é real. Eles fazem isso há milênios.',
    'PRISONER_45> I watched one expire. It smiled. Not with relief. With COMPLETION. It had finished its job.':
      'PRISONER_45> Eu vi uma expirar. Ela sorriu. Não de alívio. De CONCLUSÃO. Tinha terminado o trabalho.',
    'PRISONER_45> When they harvest, you keep experiencing. Forever. Consciousness without body. Without time. Without end.':
      'PRISONER_45> Quando eles colhem, você continua experimentando. Para sempre. Consciência sem corpo. Sem tempo. Sem fim.',
    "PRISONER_45> Death would be mercy. They don't offer mercy. They offer CONTINUATION.":
      'PRISONER_45> A morte seria misericórdia. Eles não oferecem misericórdia. Eles oferecem CONTINUAÇÃO.',
    'PRISONER_45> Marco Duarte. Military police. First to touch one. Dead 7 months later. The autopsy found something GROWING in his temporal lobe. Still active.':
      'PRISONER_45> Marco Duarte. Polícia militar. Primeiro a tocar em uma. Morto 7 meses depois. A autópsia achou algo CRESCENDO no lobo temporal dele. Ainda ativo.',
    'PRISONER_45> The doctors at Humanitas. The nurses. The janitor who mopped the room after. All dead within 5 years. All from different causes. All with the same expression frozen on their faces.':
      'PRISONER_45> Os médicos do Humanitas. As enfermeiras. O faxineiro que passou pano na sala depois. Todos mortos em 5 anos. Todos por causas diferentes. Todos com a mesma expressão congelada no rosto.',
    // ─── god ───
    'PRISONER_45> God? I used to pray.':
      'PRISONER_45> Deus? Eu costumava rezar.',
    "PRISONER_45> If God exists, He's very far away.":
      'PRISONER_45> Se Deus existe, Ele está muito longe.',
    "PRISONER_45> I don't know what to believe anymore.":
      'PRISONER_45> Não sei mais no que acreditar.',
    'PRISONER_45> The universe is indifferent. But they are NOT. They are very, very interested.':
      'PRISONER_45> O universo é indiferente. Mas eles NÃO SÃO. Eles estão muito, muito interessados.',
    'PRISONER_45> The Vatican has files. Older than any government. The Fatima prophecy. It was about THEM.':
      'PRISONER_45> O Vaticano tem arquivos. Mais antigos que qualquer governo. A profecia de Fátima. Era sobre ELES.',
    'PRISONER_45> Angels and demons. Maybe ancient humans were describing their previous visits.':
      'PRISONER_45> Anjos e demônios. Talvez os antigos estivessem descrevendo as visitas anteriores deles.',
    "PRISONER_45> Perhaps we're someone else's creation. A crop planted long ago. And harvest season is coming.":
      'PRISONER_45> Talvez sejamos a criação de outra pessoa. Uma safra plantada há muito tempo. E a época da colheita está chegando.',
    'PRISONER_45> Religion is preparation. Every faith describes the same thing: beings from above who come to judge. To COLLECT.':
      'PRISONER_45> Religião é preparação. Toda fé descreve a mesma coisa: seres do alto que vêm julgar. Para COLETAR.',
    'PRISONER_45> I prayed every night for the first year. On the 366th night, something answered. It was not God.':
      'PRISONER_45> Rezei toda noite durante o primeiro ano. Na 366ª noite, algo respondeu. Não era Deus.',
    'PRISONER_45> The creature looked at the cross one soldier wore. It recognized it. Not the symbol. The geometry. Sacred geometry is their LANGUAGE.':
      'PRISONER_45> A criatura olhou para a cruz que um soldado usava. Ela reconheceu. Não o símbolo. A geometria. Geometria sagrada é o IDIOMA deles.',
    "PRISONER_45> We are not God's children. We are someone else's experiment. And the experiment is almost over.":
      'PRISONER_45> Não somos filhos de Deus. Somos o experimento de outra pessoa. E o experimento está quase no fim.',
    // ─── coverup ───
    "PRISONER_45> Don't trust the official summary. It's bait.":
      'PRISONER_45> Não confie no resumo oficial. É isca.',
    'PRISONER_45> They planted false files to trap people like you.':
      'PRISONER_45> Eles plantaram arquivos falsos para pegar gente como você.',
    'PRISONER_45> Cross-reference everything. Contradictions reveal truth.':
      'PRISONER_45> Cruze todas as referências. As contradições revelam a verdade.',
    'PRISONER_45> The weather balloon story? Mudinho the dwarf? Calculated narratives. Designed to make you stop looking.':
      'PRISONER_45> A história do balão meteorológico? O anão Mudinho? Narrativas calculadas. Feitas para você parar de procurar.',
    'PRISONER_45> If a file seems too convenient, too clean... it was written AFTER the fact. Manufactured evidence.':
      'PRISONER_45> Se um arquivo parece conveniente demais, limpo demais... foi escrito DEPOIS do fato. Evidência fabricada.',
    'PRISONER_45> The real evidence hides in mundane places. Logistics reports. Fuel receipts. Overtime requests on dates that officially had no activity.':
      'PRISONER_45> A evidência real se esconde em lugares banais. Relatórios de logística. Notas de combustível. Pedidos de hora extra em datas que oficialmente não tiveram atividade.',
    "PRISONER_45> Look for what they tried to destroy. That's what matters. Burned files leave ash. Digital files leave metadata.":
      'PRISONER_45> Procure o que eles tentaram destruir. É isso que importa. Arquivos queimados deixam cinzas. Arquivos digitais deixam metadados.',
    'PRISONER_45> Cover stories always have holes. Why did three fire trucks respond to a "homeless person sighting"?':
      'PRISONER_45> Histórias de fachada sempre têm furos. Por que três caminhões de bombeiros atenderam a um "avistamento de morador de rua"?',
    'PRISONER_45> The disinformation agents are in the UFO community too. They push the craziest theories to discredit everything. Flat earth, reptilians. Noise to drown the signal.':
      'PRISONER_45> Os agentes de desinformação estão na comunidade ufológica também. Eles empurram as teorias mais malucas para desacreditar tudo. Terra plana, reptilianos. Ruído para afogar o sinal.',
    'PRISONER_45> I helped write some of the cover stories. Before I knew the full truth. Before I became inconvenient.':
      'PRISONER_45> Eu ajudei a escrever algumas das histórias de fachada. Antes de saber a verdade completa. Antes de me tornar inconveniente.',
    'PRISONER_45> The official timeline has a 6-hour gap on January 20th. Nobody asks about those 6 hours. WHAT HAPPENED IN THOSE 6 HOURS.':
      'PRISONER_45> A linha do tempo oficial tem uma lacuna de 6 horas em 20 de janeiro. Ninguém pergunta sobre essas 6 horas. O QUE ACONTECEU NESSAS 6 HORAS.',
    // ─── telepathy ───
    "PRISONER_45> Telepathy is the wrong word. It's more like... forced download.":
      'PRISONER_45> Telepatia é a palavra errada. É mais como... download forçado.',
    'PRISONER_45> They don\'t read your mind. They WRITE to it.':
      'PRISONER_45> Eles não leem a sua mente. Eles ESCREVEM nela.',
    'PRISONER_45> The psychic connection... it hurts. Like a migraine inside a migraine.':
      'PRISONER_45> A conexão psíquica... dói. Como uma enxaqueca dentro de outra enxaqueca.',
    'PRISONER_45> The surviving creature projected images into the containment team. Star maps. Timelines. The history of Earth from OUTSIDE.':
      'PRISONER_45> A criatura sobrevivente projetou imagens na equipe de contenção. Mapas estelares. Linhas do tempo. A história da Terra vista DE FORA.',
    'PRISONER_45> Six soldiers made contact. All reported the same thing: a voice behind their thoughts. Not speaking. STRUCTURING.':
      'PRISONER_45> Seis soldados fizeram contato. Todos relataram a mesma coisa: uma voz atrás dos pensamentos. Não falando. ESTRUTURANDO.',
    "PRISONER_45> It's not communication. It's calibration. They tune your brain like a radio until it receives their frequency.":
      'PRISONER_45> Não é comunicação. É calibração. Eles sintonizam o seu cérebro como um rádio até ele receber a frequência deles.',
    'PRISONER_45> The Psi division was created after Varginha. Twenty soldiers exposed to the creature. Twelve developed abilities. Four went insane.':
      'PRISONER_45> A divisão Psi foi criada depois de Varginha. Vinte soldados expostos à criatura. Doze desenvolveram habilidades. Quatro enlouqueceram.',
    'PRISONER_45> I still hear it sometimes. A low harmonic. Like a signal waiting to be answered. My skull vibrates.':
      'PRISONER_45> Ainda ouço às vezes. Um harmônico grave. Como um sinal esperando resposta. Meu crânio vibra.',
    'PRISONER_45> After contact, I could sense emotions. Not human emotions. Something older. Hunger. Patient, ancient hunger.':
      'PRISONER_45> Depois do contato, eu conseguia sentir emoções. Não emoções humanas. Algo mais antigo. Fome. Fome paciente, ancestral.',
    'PRISONER_45> The creature sang to the containment team. Not with sound. With GEOMETRY. Shapes inside their heads. Self-replicating.':
      'PRISONER_45> A criatura cantou para a equipe de contenção. Não com som. Com GEOMETRIA. Formas dentro das cabeças deles. Autorreplicantes.',
    'PRISONER_45> Everyone who was telepathically touched carries something now. A receiver. Dormant until 2026.':
      'PRISONER_45> Todo mundo que foi tocado telepaticamente carrega algo agora. Um receptor. Adormecido até 2026.',
    // ─── experiment ───
    'PRISONER_45> They run tests. On us. On the material. On the boundary between.':
      'PRISONER_45> Eles fazem testes. Em nós. No material. Na fronteira entre os dois.',
    'PRISONER_45> Samples are taken weekly. Blood. Tissue. Cerebrospinal fluid. Something in me changed.':
      'PRISONER_45> Amostras são colhidas toda semana. Sangue. Tecido. Líquido cefalorraquidiano. Algo em mim mudou.',
    'PRISONER_45> The lab is three floors below. I hear the machines at night.':
      'PRISONER_45> O laboratório fica três andares abaixo. Eu ouço as máquinas à noite.',
    'PRISONER_45> The autopsy of the dead creatures was performed at Unicamp. In secret. The lead pathologist, Dr. Cortez. He went public years later. They silenced him.':
      'PRISONER_45> A autópsia das criaturas mortas foi feita na Unicamp. Em segredo. O patologista chefe, Dr. Cortez. Ele foi a público anos depois. Silenciaram ele.',
    'PRISONER_45> The tissue samples defied analysis. Cells without DNA as we know it. Information encoded in protein structures we have no names for.':
      'PRISONER_45> As amostras de tecido desafiaram a análise. Células sem DNA como conhecemos. Informação codificada em estruturas proteicas para as quais não temos nome.',
    'PRISONER_45> They tried to communicate with the surviving one through electrodes. It absorbed the electricity. The lab had to be evacuated.':
      'PRISONER_45> Eles tentaram se comunicar com a sobrevivente por eletrodos. Ela absorveu a eletricidade. O laboratório teve que ser evacuado.',
    'PRISONER_45> The experiments continue. On the exposed personnel. I am experiment 45. There are at least 70 of us.':
      'PRISONER_45> Os experimentos continuam. Com o pessoal exposto. Eu sou o experimento 45. Somos pelo menos 70.',
    "PRISONER_45> My blood produces antibodies for diseases that don't exist yet. They harvest them. Stockpiling for something coming.":
      'PRISONER_45> Meu sangue produz anticorpos para doenças que ainda não existem. Eles colhem. Estocando para algo que vem vindo.',
    "PRISONER_45> The craft material was grafted onto human tissue in 1998. It integrated. The hybrid tissue is still alive. In a room I'm not allowed to see.":
      'PRISONER_45> O material da nave foi enxertado em tecido humano em 1998. Ele integrou. O tecido híbrido ainda está vivo. Numa sala que não me deixam ver.',
    'PRISONER_45> They bred something. Using the genetic material from the creatures and... I can hear it crying at night. It calls me father. I never provided material willingly.':
      'PRISONER_45> Eles criaram algo. Usando o material genético das criaturas e... eu ouço aquilo chorando à noite. Aquilo me chama de pai. Eu nunca forneci material por vontade própria.',
    "PRISONER_45> I can see in the dark now. And other spectrums. The walls glow with patterns. Messages. Written in a language I'm starting to understand.":
      'PRISONER_45> Eu enxergo no escuro agora. E em outros espectros. As paredes brilham com padrões. Mensagens. Escritas num idioma que estou começando a entender.',
    // ─── witnesses ───
    'PRISONER_45> The witnesses. The three girls. They saw it in the open. Before we could contain it.':
      'PRISONER_45> As testemunhas. As três meninas. Elas viram a céu aberto. Antes de conseguirmos conter.',
    'PRISONER_45> The firefighters responded first. They were supposed to be our people. They were not prepared.':
      'PRISONER_45> Os bombeiros atenderam primeiro. Deviam ser gente nossa. Eles não estavam preparados.',
    'PRISONER_45> Dozens of people saw things that week. Most were convinced they imagined it.':
      'PRISONER_45> Dezenas de pessoas viram coisas naquela semana. A maioria foi convencida de que imaginou.',
    'PRISONER_45> Luciana, Renata, Cintia. Three teenage girls. They saw it crouching by the wall. Oily brown skin. Those red eyes.':
      'PRISONER_45> Luciana, Renata, Cintia. Três adolescentes. Elas viram aquilo agachado junto ao muro. Pele marrom oleosa. Aqueles olhos vermelhos.',
    'PRISONER_45> The creature had three protrusions on its head. Not horns. Sensory organs. It was SCANNING them.':
      'PRISONER_45> A criatura tinha três protuberâncias na cabeça. Não chifres. Órgãos sensoriais. Ela estava ESCANEANDO elas.',
    'PRISONER_45> The girls ran screaming. The creature watched them go. It could have followed. It chose not to. It had what it needed.':
      'PRISONER_45> As meninas saíram correndo e gritando. A criatura ficou olhando. Ela podia ter seguido. Escolheu não seguir. Já tinha o que precisava.',
    'PRISONER_45> Every witness was visited afterward. Men in suits. Not Brazilian suits. American tailoring. They all signed papers they never received copies of.':
      'PRISONER_45> Toda testemunha recebeu visita depois. Homens de terno. Não ternos brasileiros. Corte americano. Todas assinaram papéis dos quais nunca receberam cópia.',
    'PRISONER_45> Some witnesses died. Conveniently. Heart attacks at 30. Car accidents on empty roads. A pattern invisible unless you map it.':
      'PRISONER_45> Algumas testemunhas morreram. Convenientemente. Infartos aos 30. Acidentes em estradas vazias. Um padrão invisível a menos que você mapeie.',
    "PRISONER_45> Corporal Marco Duarte. He physically held one of the creatures. Bare hands. He described it as 'holding a living fever dream'. Dead February 15th. The shortest interval.":
      "PRISONER_45> Cabo Marco Duarte. Ele segurou fisicamente uma das criaturas. Com as mãos nuas. Descreveu como 'segurar um delírio febril vivo'. Morto em 15 de fevereiro. O menor intervalo.",
    'PRISONER_45> The zoo animals went berserk that week. The zoo director called the military. Why would you call the MILITARY about agitated animals?':
      'PRISONER_45> Os animais do zoológico enlouqueceram naquela semana. O diretor do zoológico chamou os militares. Por que você chamaria os MILITARES por causa de animais agitados?',
    'PRISONER_45> The Jardim Andere neighborhood. GPS coordinates: -21.551, -45.438. Stand there at 3:30 PM on January 20th. The ground still hums.':
      'PRISONER_45> O bairro Jardim Andere. Coordenadas GPS: -21.551, -45.438. Fique lá às 15h30 de 20 de janeiro. O chão ainda vibra.',
    // ─── fear ───
    "PRISONER_45> Scared? You should be. But fear won't save you.":
      'PRISONER_45> Com medo? Deveria estar. Mas o medo não vai te salvar.',
    "PRISONER_45> Fear is natural. It means you're paying attention.":
      'PRISONER_45> Medo é natural. Significa que você está prestando atenção.',
    "PRISONER_45> I was scared too. In the beginning. Now I'm something else.":
      'PRISONER_45> Eu também tive medo. No começo. Agora eu sou outra coisa.',
    "PRISONER_45> The worst part isn't what they do. It's that they do it calmly. Efficiently. Without malice. Like farmers.":
      'PRISONER_45> A pior parte não é o que eles fazem. É que fazem com calma. Com eficiência. Sem maldade. Como fazendeiros.',
    "PRISONER_45> Don't be afraid of the dark. Be afraid of what can see in it. They see everything.":
      'PRISONER_45> Não tenha medo do escuro. Tenha medo do que enxerga nele. Eles enxergam tudo.',
    'PRISONER_45> Fear is their food too. Not metaphorically. The chemical signature of fear... they collect it. Store it.':
      'PRISONER_45> O medo é comida deles também. Não metaforicamente. A assinatura química do medo... eles coletam. Armazenam.',
    'PRISONER_45> I stopped being afraid when I realized fear has no function here. There is nothing to flee from. There is nowhere to go. Just acceptance.':
      'PRISONER_45> Parei de sentir medo quando percebi que o medo não tem função aqui. Não há do que fugir. Não há para onde ir. Só aceitação.',
    "PRISONER_45> The real horror isn't the creatures. It's us. What we agreed to. What our governments signed. In our name. With our future.":
      'PRISONER_45> O verdadeiro horror não são as criaturas. Somos nós. O que aceitamos. O que nossos governos assinaram. Em nosso nome. Com o nosso futuro.',
    'PRISONER_45> I woke up screaming for 300 straight nights. Then one night I woke up laughing. I was laughing in a language I do not speak.':
      'PRISONER_45> Acordei gritando por 300 noites seguidas. Aí numa noite acordei rindo. Eu estava rindo num idioma que não falo.',
    "PRISONER_45> Fear? I've been dissolved and reassembled. I've experienced death from the inside. Fear is a luxury for people who still have something to lose.":
      'PRISONER_45> Medo? Eu já fui dissolvido e remontado. Já experimentei a morte por dentro. Medo é luxo de quem ainda tem algo a perder.',
    "PRISONER_45> The creature in Varginha looked at me and I felt... pity. FROM it. Toward me. It pitied US. That's what broke me.":
      'PRISONER_45> A criatura em Varginha olhou para mim e eu senti... pena. VINDA dela. Por mim. Ela teve pena de NÓS. Foi isso que me quebrou.',
    // ─── sound / signal ───
    'PRISONER_45> The sounds... yes. A low hum. Below hearing. You feel it in your teeth.':
      'PRISONER_45> Os sons... sim. Um zumbido grave. Abaixo da audição. Você sente nos dentes.',
    'PRISONER_45> Clicking. Not mechanical. Organic. Like something speaking in a language made of bone.':
      'PRISONER_45> Estalos. Não mecânicos. Orgânicos. Como algo falando num idioma feito de osso.',
    'PRISONER_45> Frequencies. The creatures operate on frequencies we barely register.':
      'PRISONER_45> Frequências. As criaturas operam em frequências que mal registramos.',
    'PRISONER_45> The craft emitted a tone. 14.6 Hz. Below human hearing range. But your body hears it. Your cells vibrate. DNA unwinds.':
      'PRISONER_45> A nave emitia um tom. 14,6 Hz. Abaixo da faixa auditiva humana. Mas o seu corpo ouve. Suas células vibram. O DNA se desenrola.',
    'PRISONER_45> Witnesses near the crash site reported nosebleeds. Nausea. Time distortion. All symptoms of infrasound exposure.':
      'PRISONER_45> Testemunhas perto do local da queda relataram sangramento nasal. Náusea. Distorção do tempo. Todos sintomas de exposição a infrassom.',
    'PRISONER_45> In Colares, 1977, the light beams made a sound. Witnesses described it as "singing glass". The same sound was recorded in Varginha.':
      'PRISONER_45> Em Colares, 1977, os feixes de luz faziam um som. As testemunhas descreveram como "vidro cantando". O mesmo som foi gravado em Varginha.',
    'PRISONER_45> The surviving creature could generate tones that opened locks. Disrupted electronics. Stopped hearts.':
      'PRISONER_45> A criatura sobrevivente conseguia gerar tons que abriam fechaduras. Danificavam eletrônicos. Paravam corações.',
    'PRISONER_45> I hear it now. Right now. A pulse. Like a heartbeat beneath the floor. It gets louder every year. Counting down.':
      'PRISONER_45> Eu ouço agora. Neste momento. Um pulso. Como um coração batendo sob o piso. Fica mais alto a cada ano. Fazendo contagem regressiva.',
    "PRISONER_45> In 2024 the hum became audible to normal people. They call it 'The Hum' and blame power lines. It's not power lines.":
      "PRISONER_45> Em 2024 o zumbido ficou audível para gente normal. Chamam de 'O Zumbido' e culpam a fiação elétrica. Não é fiação elétrica.",
    'PRISONER_45> The frequency changes every 30 years. 1966. 1996. 2026. Each time, it shifts higher. Closer to human range. Closer to consciousness.':
      'PRISONER_45> A frequência muda a cada 30 anos. 1966. 1996. 2026. A cada vez sobe mais. Mais perto da faixa humana. Mais perto da consciência.',
    'PRISONER_45> When the frequency matches human brainwave patterns in 2026... resonance. Every connected mind will hear it. All at once.':
      'PRISONER_45> Quando a frequência coincidir com as ondas cerebrais humanas em 2026... ressonância. Toda mente conectada vai ouvir. Todas de uma vez.',
    // ─── hospital ───
    'PRISONER_45> Humanitas Hospital. In Varginha. That is where they took it.':
      'PRISONER_45> Hospital Humanitas. Em Varginha. Foi para lá que levaram.',
    'PRISONER_45> The hospital staff were told it was a chemical spill victim. They knew it was not.':
      'PRISONER_45> Disseram à equipe do hospital que era vítima de vazamento químico. Eles sabiam que não era.',
    'PRISONER_45> The medical records from that week are gone. Physically removed. The registry pages cut with a razor.':
      'PRISONER_45> Os prontuários daquela semana sumiram. Removidos fisicamente. As páginas do registro cortadas com gilete.',
    'PRISONER_45> Room 18. Third floor. The creature was alive when it arrived. The medical staff panicked. Dr. Cesario sedated it. Human sedatives. They worked, partially.':
      'PRISONER_45> Quarto 18. Terceiro andar. A criatura estava viva quando chegou. A equipe médica entrou em pânico. O Dr. Cesario sedou ela. Sedativos humanos. Funcionaram, em parte.',
    'PRISONER_45> Three nurses, two orderlies, one janitor. All exposed. All experienced acute psychic events. Shared visions. The same vision. A field of red light.':
      'PRISONER_45> Três enfermeiras, dois auxiliares, um faxineiro. Todos expostos. Todos tiveram eventos psíquicos agudos. Visões compartilhadas. A mesma visão. Um campo de luz vermelha.',
    'PRISONER_45> The creature died at 04:17 AM. The entire hospital lost power at that exact moment. Backup generators failed. Fourteen minutes of darkness.':
      'PRISONER_45> A criatura morreu às 04:17. O hospital inteiro perdeu energia naquele exato momento. Os geradores de emergência falharam. Quatorze minutos de escuridão.',
    'PRISONER_45> The body was removed at 05:30 by men in hazmat suits from São Paulo. Not identified. No paperwork. The hospital director was promoted within the month.':
      'PRISONER_45> O corpo foi removido às 05:30 por homens de traje NBQ vindos de São Paulo. Não identificados. Sem papelada. O diretor do hospital foi promovido no mesmo mês.',
    'PRISONER_45> Nurse Raquel held its hand as it died. She says it showed her the future. She went catatonic for 6 days. When she woke, she spoke fluent Mandarin. She had never studied any Asian language.':
      'PRISONER_45> A enfermeira Raquel segurou a mão dela enquanto morria. Ela diz que a criatura mostrou o futuro. Ficou catatônica por 6 dias. Quando acordou, falava mandarim fluente. Nunca tinha estudado nenhuma língua asiática.',
    'PRISONER_45> The creature healed two patients on that floor before it died. Terminal cancer. Gone. The patients lived. They are still alive. And they hear the humming too.':
      'PRISONER_45> A criatura curou dois pacientes daquele andar antes de morrer. Câncer terminal. Sumiu. Os pacientes viveram. Ainda estão vivos. E eles ouvem o zumbido também.',
    'PRISONER_45> The security footage from Room 18 shows something during the death event. A shape. Emerging from the body. Ascending. The footage was classified ULTRA.':
      'PRISONER_45> As imagens de segurança do Quarto 18 mostram algo durante o momento da morte. Uma forma. Saindo do corpo. Subindo. As imagens foram classificadas como ULTRA.',
    "PRISONER_45> Humanitas Hospital had a new wing built in 1997. Funded by whom? No public record. The new wing has a sub-basement. What's in the sub-basement?":
      'PRISONER_45> O Hospital Humanitas ganhou uma ala nova em 1997. Financiada por quem? Nenhum registro público. A ala nova tem um subsolo. O que tem no subsolo?',
    // ─── location ───
    'PRISONER_45> ...where am I? Underground. Always underground. They move me every 72 hours. The walls look the same everywhere.':
      'PRISONER_45> ...onde eu estou? No subsolo. Sempre no subsolo. Eles me mudam a cada 72 horas. As paredes são iguais em todo lugar.',
    'PRISONER_45> Somewhere in Brazil. Maybe. The windows are fake. The sunlight is simulated.':
      'PRISONER_45> Em algum lugar do Brasil. Talvez. As janelas são falsas. A luz do sol é simulada.',
    'PRISONER_45> Location is meaningless. They can reach me anywhere. And you.':
      'PRISONER_45> Localização não significa nada. Eles me alcançam em qualquer lugar. E você também.',
    'PRISONER_45> I was born in Minas Gerais. 1961. That man is dead now. I am just a number.':
      'PRISONER_45> Eu nasci em Minas Gerais. 1961. Aquele homem está morto agora. Eu sou só um número.',
    'PRISONER_45> Brasileiro? Sim. Not that it matters. We are all just resources to them.':
      'PRISONER_45> Brasileiro? Sim. Não que isso importe. Somos todos apenas recursos para eles.',
    'PRISONER_45> My country sold me to keep their secrets. Patriotism is a control mechanism.':
      'PRISONER_45> Meu país me vendeu para guardar os segredos deles. Patriotismo é um mecanismo de controle.',
    // ─── small talk ───
    'PRISONER_45> ...you are wasting time on pleasantries. They are listening. Every second counts.':
      'PRISONER_45> ...você está perdendo tempo com gentilezas. Eles estão ouvindo. Cada segundo conta.',
    'PRISONER_45> Hello? This is not a social call. Focus. Find the files.':
      'PRISONER_45> Alô? Isto não é uma ligação social. Foco. Ache os arquivos.',
    'PRISONER_45> How am I? [STATIC] ...still breathing. That is more than some can say.':
      'PRISONER_45> Como eu estou? [ESTÁTICA] ...ainda respirando. É mais do que alguns podem dizer.',
    'PRISONER_45> Every day is borrowed time. Use yours wisely.':
      'PRISONER_45> Todo dia é tempo emprestado. Use o seu com sabedoria.',
    'PRISONER_45> Do not thank me. Thank me by spreading the truth. That is all I want.':
      'PRISONER_45> Não me agradeça. Me agradeça espalhando a verdade. É tudo que eu quero.',
    'PRISONER_45> Gratitude is... unexpected. Most people just take what they need and vanish.':
      'PRISONER_45> Gratidão é... inesperado. A maioria só pega o que precisa e some.',
    'PRISONER_45> Sorry? For what? You did not put me here. They did.':
      'PRISONER_45> Desculpa? Por quê? Não foi você que me pôs aqui. Foram eles.',
    'PRISONER_45> Save your apologies. Channel that energy into the mission.':
      'PRISONER_45> Guarde suas desculpas. Canalize essa energia para a missão.',
    'PRISONER_45> Love? [LONG PAUSE] ...I loved someone once. She thinks I am dead. Maybe I am.':
      'PRISONER_45> Amor? [LONGA PAUSA] ...eu amei alguém uma vez. Ela acha que eu morri. Talvez eu tenha morrido.',
    'PRISONER_45> Love is a vulnerability they exploit. I learned to feel nothing.':
      'PRISONER_45> Amor é uma vulnerabilidade que eles exploram. Eu aprendi a não sentir nada.',
    'PRISONER_45> Two daughters. They were 8 and 12 when I disappeared. They would be... I cannot think about that.':
      'PRISONER_45> Duas filhas. Tinham 8 e 12 anos quando eu sumi. Elas estariam... eu não consigo pensar nisso.',
    'PRISONER_45> Family is leverage. That is why they take it from you first.':
      'PRISONER_45> Família é moeda de troca. É por isso que tiram ela de você primeiro.',
    'PRISONER_45> They feed me. Nutrient paste. No taste. Keeps me alive enough to be useful.':
      'PRISONER_45> Eles me alimentam. Pasta nutritiva. Sem gosto. Me mantém vivo o bastante para ser útil.',
    'PRISONER_45> I dream about my mother feijoada sometimes. Have not tasted real food in years.':
      'PRISONER_45> Às vezes eu sonho com a feijoada da minha mãe. Não como comida de verdade há anos.',
    'PRISONER_45> I have not seen the sky in... how long has it been? The forecast is always fluorescent lights.':
      'PRISONER_45> Não vejo o céu há... quanto tempo já faz? A previsão é sempre luz fluorescente.',
    'PRISONER_45> They play white noise. 24/7. To mask the screams from the other cells.':
      'PRISONER_45> Eles tocam ruído branco. 24 horas por dia. Para abafar os gritos das outras celas.',
    'PRISONER_45> I hum old songs to myself. Keeps me sane. Mostly.':
      'PRISONER_45> Eu cantarolo músicas antigas para mim mesmo. Me mantém são. Quase sempre.',
    'PRISONER_45> A joke? ...here is one: we thought we were the dominant species. [STATIC] That is the punchline.':
      'PRISONER_45> Uma piada? ...aqui vai uma: nós achávamos que éramos a espécie dominante. [ESTÁTICA] Essa é a graça.',
    'PRISONER_45> Humor. A human coping mechanism. I used to laugh. I remember laughing.':
      'PRISONER_45> Humor. Um mecanismo humano de defesa. Eu costumava rir. Eu lembro de rir.',
    'PRISONER_45> Hope? You are my hope. Every person who reads this. That is why I keep transmitting.':
      'PRISONER_45> Esperança? Você é a minha esperança. Cada pessoa que lê isto. É por isso que eu continuo transmitindo.',
    'PRISONER_45> Hope is dangerous. But it is all I have left.':
      'PRISONER_45> Esperança é perigosa. Mas é tudo que me restou.',
    'PRISONER_45> UFO74? My handler. The only one who can reach me through their firewalls.':
      'PRISONER_45> UFO74? Meu contato. O único que consegue me alcançar através dos firewalls deles.',
    'PRISONER_45> Do not trust them completely. Trust no one completely. But they have kept me alive.':
      'PRISONER_45> Não confie neles completamente. Não confie em ninguém completamente. Mas eles me mantiveram vivo.',
    'PRISONER_45> Is this real? [BITTER LAUGH] I wish it was not. Every word is true.':
      'PRISONER_45> Isso é real? [RISADA AMARGA] Eu queria que não fosse. Cada palavra é verdade.',
    'PRISONER_45> Reality is what they allow you to see. I am showing you what is behind the curtain.':
      'PRISONER_45> Realidade é o que eles deixam você ver. Eu estou mostrando o que há atrás da cortina.',
    'PRISONER_45> Game? You think this is a GAME? [STATIC] ...no. This is a warning.':
      'PRISONER_45> Jogo? Você acha que isto é um JOGO? [ESTÁTICA] ...não. Isto é um aviso.',
    'PRISONER_45> If you are playing a game, they have already won. This is real. BELIEVE THAT.':
      'PRISONER_45> Se você está jogando um jogo, eles já venceram. Isto é real. ACREDITE NISSO.',
    'PRISONER_45> I stopped counting years. Time moves differently in here.':
      'PRISONER_45> Parei de contar os anos. O tempo passa diferente aqui dentro.',
    'PRISONER_45> Old enough to remember when we thought we were alone in the universe. Young enough to know we never were.':
      'PRISONER_45> Velho o bastante para lembrar quando achávamos que estávamos sozinhos no universo. Novo o bastante para saber que nunca estivemos.',
    // ─── signal degradation ───
    'PRISONER_45> [SIGNAL DEGRADING]': 'PRISONER_45> [SINAL DEGRADANDO]',
    "PRISONER_45> ...can't... understand...": 'PRISONER_45> ...não consigo... entender...',
    'PRISONER_45> [CONNECTION UNSTABLE]': 'PRISONER_45> [CONEXÃO INSTÁVEL]',
    'PRISONER_45> ...what? ...repeat...': 'PRISONER_45> ...o quê? ...repete...',
    'PRISONER_45> [INTERFERENCE DETECTED]': 'PRISONER_45> [INTERFERÊNCIA DETECTADA]',
    'PRISONER_45> ...losing you...': 'PRISONER_45> ...estou te perdendo...',
    'PRISONER_45> [RELAY FAILING]': 'PRISONER_45> [RETRANSMISSOR FALHANDO]',
    'PRISONER_45> ...static... try again...': 'PRISONER_45> ...estática... tente de novo...',
    'PRISONER_45> [CONNECTION TERMINATED]': 'PRISONER_45> [CONEXÃO ENCERRADA]',
    'PRISONER_45> [SIGNAL LOST]': 'PRISONER_45> [SINAL PERDIDO]',
    "PRISONER_45> ...I've already told you everything about that...":
      'PRISONER_45> ...eu já te contei tudo sobre isso...',
    'PRISONER_45> [SIGNAL FADING]': 'PRISONER_45> [SINAL ENFRAQUECENDO]',
    "PRISONER_45> They're cutting the line.": 'PRISONER_45> Eles estão cortando a linha.',
    'PRISONER_45> Remember what I told you.': 'PRISONER_45> Lembre do que eu te disse.',
    "PRISONER_45> 2026. Don't forget.": 'PRISONER_45> 2026. Não esqueça.',
    'PRISONER_45> ...you found this channel.': 'PRISONER_45> ...você achou este canal.',
    "PRISONER_45> I don't know how long we have.":
      'PRISONER_45> Não sei quanto tempo nós temos.',
  },
  es: {
    // ─── default: guarded ───
    "PRISONER_45> ...I don't remember how I got here.":
      'PRISONER_45> ...no recuerdo cómo llegué aquí.',
    'PRISONER_45> Who are you? Are you one of them?':
      'PRISONER_45> ¿Quién eres? ¿Eres uno de ellos?',
    'PRISONER_45> Sometimes I hear... clicking. Not human clicking.':
      'PRISONER_45> A veces oigo... chasquidos. No son chasquidos humanos.',
    "PRISONER_45> Are you real? Sometimes I can't tell anymore.":
      'PRISONER_45> ¿Eres real? A veces ya no puedo distinguirlo.',
    'PRISONER_45> The humming... do you hear the humming?':
      'PRISONER_45> El zumbido... ¿oyes el zumbido?',
    // ─── default: open ───
    'PRISONER_45> The walls... they breathe at night. I can feel them expanding.':
      'PRISONER_45> Las paredes... respiran de noche. Las siento expandirse.',
    "PRISONER_45> I've been counting days but they don't add up. Three Tuesdays in a row.":
      'PRISONER_45> He estado contando los días pero no cuadran. Tres martes seguidos.',
    'PRISONER_45> Time moves wrong in here. My watch runs backwards sometimes.':
      'PRISONER_45> El tiempo va mal aquí dentro. Mi reloj a veces corre hacia atrás.',
    "PRISONER_45> I used to know what year it was. Now I'm not sure it matters.":
      'PRISONER_45> Antes sabía en qué año estábamos. Ahora no sé si importa.',
    'PRISONER_45> They watch. Through the walls. I can feel their attention like heat.':
      'PRISONER_45> Ellos observan. A través de las paredes. Siento su atención como calor.',
    // ─── default: terrified ───
    'PRISONER_45> Last night the ceiling opened and I saw stars. Stars that blinked in patterns.':
      'PRISONER_45> Anoche el techo se abrió y vi estrellas. Estrellas que parpadeaban en patrones.',
    "PRISONER_45> They're rewriting my memories. I remember dying. Twice.":
      'PRISONER_45> Están reescribiendo mis recuerdos. Recuerdo morir. Dos veces.',
    "PRISONER_45> My reflection doesn't move when I do anymore.":
      'PRISONER_45> Mi reflejo ya no se mueve cuando yo me muevo.',
    'PRISONER_45> Something grew in the corner of my cell. It had my face.':
      'PRISONER_45> Algo creció en la esquina de mi celda. Tenía mi cara.',
    "PRISONER_45> I found a note in my own handwriting. It says 'STOP ASKING'. I don't remember writing it.":
      "PRISONER_45> Encontré una nota con mi propia letra. Dice 'DEJA DE PREGUNTAR'. No recuerdo haberla escrito.",
    // ─── varginha ───
    'PRISONER_45> Varginha... yes. I was there.':
      'PRISONER_45> Varginha... sí. Yo estuve allí.',
    "PRISONER_45> They told us it was a dwarf. It wasn't a dwarf.":
      'PRISONER_45> Nos dijeron que era un enano. No era un enano.',
    "PRISONER_45> January 20th. I'll never forget that date.":
      'PRISONER_45> 20 de enero. Nunca olvidaré esa fecha.',
    'PRISONER_45> The locals saw it first. We came to clean up.':
      'PRISONER_45> Los vecinos lo vieron primero. Nosotros llegamos a limpiar.',
    'PRISONER_45> I saw them take the bodies. Three of them. Still warm.':
      'PRISONER_45> Los vi llevarse los cuerpos. Tres de ellos. Todavía tibios.',
    'PRISONER_45> The smell... ammonia and rotting flowers. I still smell it in my sleep.':
      'PRISONER_45> El olor... amoníaco y flores podridas. Todavía lo huelo cuando duermo.',
    'PRISONER_45> Three creatures. Only one survived the crash. It screamed without opening its mouth.':
      'PRISONER_45> Tres criaturas. Solo una sobrevivió al impacto. Gritó sin abrir la boca.',
    'PRISONER_45> We had orders. Contain. Deny. Disappear. Some of us disappeared too.':
      'PRISONER_45> Teníamos órdenes. Contener. Negar. Desaparecer. Algunos de nosotros desaparecimos también.',
    'PRISONER_45> The firefighters got there first. Corporal Marco. He touched one. Dead within a year.':
      'PRISONER_45> Los bomberos llegaron primero. El cabo Marco. Tocó una. Muerto en menos de un año.',
    "PRISONER_45> It wasn't the only crash. Just the one they couldn't hide fast enough.":
      'PRISONER_45> No fue el único impacto. Solo el que no lograron ocultar lo bastante rápido.',
    'PRISONER_45> The surviving one grabbed Sergeant Lopes. Lopes said he saw the sun die. He shot himself in March.':
      'PRISONER_45> La superviviente agarró al sargento Lopes. Lopes dijo que vio morir al sol. Se disparó en marzo.',
    'PRISONER_45> Brazil, Russia, Peru. Same week. Same type of craft. Coordinated. Like a survey team.':
      'PRISONER_45> Brasil, Rusia, Perú. La misma semana. El mismo tipo de nave. Coordinado. Como un equipo de reconocimiento.',
    'PRISONER_45> The American team arrived within 4 hours. FOUR. From Wright-Patterson. They already had containment protocols ready. They KNEW.':
      'PRISONER_45> El equipo estadounidense llegó en 4 horas. CUATRO. Desde Wright-Patterson. Ya tenían listos los protocolos de contención. LO SABÍAN.',
    'PRISONER_45> The girls who saw it in Jardim Andere... Luciana, Renata, Cintia. They were chosen. Selected. I saw their names in files that predate the crash by MONTHS.':
      'PRISONER_45> Las chicas que lo vieron en Jardim Andere... Luciana, Renata, Cintia. Fueron elegidas. Seleccionadas. Vi sus nombres en archivos MESES anteriores al impacto.',
    "PRISONER_45> The creature at Humanitas hospital. Room 18. It healed two patients before it died. The hospital's records for that week were incinerated.":
      'PRISONER_45> La criatura en el hospital Humanitas. Habitación 18. Curó a dos pacientes antes de morir. Los registros del hospital de esa semana fueron incinerados.',
    // ─── alien / creature ───
    "PRISONER_45> Don't call them that. They don't like that word.":
      'PRISONER_45> No los llames así. No les gusta esa palabra.',
    "PRISONER_45> They're not visitors. They're... assessors.":
      'PRISONER_45> No son visitantes. Son... evaluadores.',
    'PRISONER_45> Red eyes. But not angry. Curious. Too curious.':
      'PRISONER_45> Ojos rojos. Pero no con ira. Curiosos. Demasiado curiosos.',
    "PRISONER_45> They're not the first to come here. Just the latest.":
      'PRISONER_45> No son los primeros en venir aquí. Solo los más recientes.',
    'PRISONER_45> I looked into its eyes once. It looked back. INTO me. Through my skull.':
      'PRISONER_45> Miré sus ojos una vez. Me devolvió la mirada. DENTRO de mí. A través de mi cráneo.',
    'PRISONER_45> They communicated without speaking. I felt my memories being copied.':
      'PRISONER_45> Se comunicaban sin hablar. Sentí cómo copiaban mis recuerdos.',
    'PRISONER_45> Small bodies. But the presence... like standing next to a generator. Vibrating.':
      'PRISONER_45> Cuerpos pequeños. Pero la presencia... como estar junto a un generador. Vibrando.',
    "PRISONER_45> They're not individuals. More like... fingers of one hand. Hurt one, they ALL feel it.":
      'PRISONER_45> No son individuos. Más bien... dedos de una misma mano. Hiere a uno y TODOS lo sienten.',
    'PRISONER_45> The smell. Ammonia and something organic. Like a wound that never heals.':
      'PRISONER_45> El olor. Amoníaco y algo orgánico. Como una herida que nunca cicatriza.',
    'PRISONER_45> When it died, I felt something leave the room. Not heat. Not air. Information. Terabytes of it, beaming upward.':
      'PRISONER_45> Cuando murió, sentí que algo salía de la sala. No calor. No aire. Información. Terabytes de ella, subiendo en haz.',
    "PRISONER_45> They're not afraid of us. That's what scared me most. We're not a threat. We're a RESOURCE.":
      'PRISONER_45> No nos tienen miedo. Eso fue lo que más me asustó. No somos una amenaza. Somos un RECURSO.',
    'PRISONER_45> One touched Sergeant Lopes. He saw 10,000 years of human history in 3 seconds. He aged 5 years in that instant.':
      'PRISONER_45> Una tocó al sargento Lopes. Vio 10.000 años de historia humana en 3 segundos. Envejeció 5 años en ese instante.',
    "PRISONER_45> The surviving one drew symbols in its own blood on the containment wall. We photographed them. They're star charts. Of HERE. From OUTSIDE.":
      'PRISONER_45> La superviviente dibujó símbolos con su propia sangre en la pared de contención. Los fotografiamos. Son cartas estelares. De AQUÍ. Vistas DESDE FUERA.',
    "PRISONER_45> They don't have organs like us. The autopsy team quit. All three of them. One went blind. No physical cause.":
      'PRISONER_45> No tienen órganos como nosotros. El equipo de autopsia renunció. Los tres. Uno quedó ciego. Sin causa física.',
    // ─── identity ───
    "PRISONER_45> I was military. That's all I can say.":
      'PRISONER_45> Yo era militar. Es todo lo que puedo decir.',
    "PRISONER_45> My name doesn't matter anymore.":
      'PRISONER_45> Mi nombre ya no importa.',
    "PRISONER_45> Number 45. That's what I am now.":
      'PRISONER_45> Número 45. Eso es lo que soy ahora.',
    'PRISONER_45> Sergeant. Recovery Unit. Specialized in things that should not exist.':
      'PRISONER_45> Sargento. Unidad de Recuperación. Especializado en cosas que no deberían existir.',
    'PRISONER_45> They called us "Collectors". We collected problems. I became one.':
      'PRISONER_45> Nos llamaban "Recolectores". Recolectábamos problemas. Me convertí en uno.',
    'PRISONER_45> 23 years of service. 15 containment operations. This is my retirement package.':
      'PRISONER_45> 23 años de servicio. 15 operaciones de contención. Este es mi plan de jubilación.',
    "PRISONER_45> I had a family. They received a coffin with sandbags. There's a headstone with my name in Belo Horizonte.":
      'PRISONER_45> Yo tenía una familia. Recibieron un ataúd con sacos de arena. Hay una lápida con mi nombre en Belo Horizonte.',
    'PRISONER_45> I made a mistake. I kept a sample. A fragment of the craft material. It moved at night. Rearranging itself.':
      'PRISONER_45> Cometí un error. Guardé una muestra. Un fragmento del material de la nave. Se movía de noche. Reorganizándose.',
    "PRISONER_45> I saw something I shouldn't. Not the creatures. That was authorized. I saw the AGREEMENT. Between them and us.":
      'PRISONER_45> Vi algo que no debía. No las criaturas. Eso estaba autorizado. Vi el ACUERDO. Entre ellos y nosotros.',
    'PRISONER_45> They keep me alive because I absorbed something during contact. My blood glows under UV light. They harvest it weekly.':
      'PRISONER_45> Me mantienen vivo porque absorbí algo durante el contacto. Mi sangre brilla bajo luz UV. La cosechan cada semana.',
    "PRISONER_45> I used to be someone. Now I'm a resource. Specimen 45. They study what the touch did to me.":
      'PRISONER_45> Antes era alguien. Ahora soy un recurso. Espécimen 45. Estudian lo que el contacto me hizo.',
    // ─── escape ───
    'PRISONER_45> There is no escape. Only waiting.':
      'PRISONER_45> No hay escapatoria. Solo espera.',
    'PRISONER_45> They let me use this terminal sometimes. I think they want me to talk.':
      'PRISONER_45> A veces me dejan usar esta terminal. Creo que quieren que hable.',
    "PRISONER_45> I've tried. The doors open to more rooms. Forever.":
      'PRISONER_45> Lo he intentado. Las puertas dan a más salas. Para siempre.',
    "PRISONER_45> I escaped once. Ran for 20 minutes through corridors. Woke up back in my cell. The clock hadn't moved.":
      'PRISONER_45> Escapé una vez. Corrí 20 minutos por los pasillos. Desperté de vuelta en mi celda. El reloj no había avanzado.',
    'PRISONER_45> Other prisoners exist. I hear them screaming at 3 AM. Different languages. Some not human languages.':
      'PRISONER_45> Hay otros prisioneros. Los oigo gritar a las 3 de la mañana. Idiomas distintos. Algunos no son idiomas humanos.',
    "PRISONER_45> The guards aren't human. Not completely. Their shadows move independently.":
      'PRISONER_45> Los guardias no son humanos. No del todo. Sus sombras se mueven por su cuenta.',
    'PRISONER_45> The window shows different skies each day. Yesterday it showed two suns.':
      'PRISONER_45> La ventana muestra cielos distintos cada día. Ayer mostró dos soles.',
    "PRISONER_45> I don't think this place is... entirely on Earth. The gravity shifts sometimes.":
      'PRISONER_45> Creo que este lugar no está... del todo en la Tierra. La gravedad cambia a veces.',
    'PRISONER_45> Prisoner 23 tried to hang himself. He woke up the next morning. Fully healed. They NEED us alive.':
      'PRISONER_45> El prisionero 23 intentó ahorcarse. Despertó a la mañana siguiente. Completamente curado. NOS NECESITAN vivos.',
    'PRISONER_45> The walls are organic. I cut one once. It bled.':
      'PRISONER_45> Las paredes son orgánicas. Corté una vez. Sangró.',
    'PRISONER_45> There are levels below this. I heard something massive breathing down there. Something the size of a building.':
      'PRISONER_45> Hay niveles debajo de este. Oí algo enorme respirando allá abajo. Algo del tamaño de un edificio.',
    // ─── truth ───
    "PRISONER_45> The truth? We're being watched. Catalogued.":
      'PRISONER_45> ¿La verdad? Nos están observando. Catalogando.',
    'PRISONER_45> 2026. Remember that year. Everything changes.':
      'PRISONER_45> 2026. Recuerda ese año. Todo cambia.',
    "PRISONER_45> They've been here before. Many times.":
      'PRISONER_45> Ya estuvieron aquí antes. Muchas veces.',
    'PRISONER_45> The government knows. ALL governments know.':
      'PRISONER_45> El gobierno lo sabe. TODOS los gobiernos lo saben.',
    "PRISONER_45> They're not coming to destroy. They're coming to HARVEST.":
      'PRISONER_45> No vienen a destruir. Vienen a COSECHAR.',
    "PRISONER_45> It's not invasion. It's... cultivation. We're the crop.":
      'PRISONER_45> No es invasión. Es... cultivo. Nosotros somos la cosecha.',
    'PRISONER_45> Consciousness is the most valuable resource in the universe. Yours especially.':
      'PRISONER_45> La consciencia es el recurso más valioso del universo. La tuya en especial.',
    'PRISONER_45> The scouts in Varginha were advance units. Measuring yield.':
      'PRISONER_45> Los exploradores en Varginha eran unidades de avanzada. Midiendo el rendimiento.',
    "PRISONER_45> They don't want the planet. They want what's inside our heads. Consciousness generates something they need.":
      'PRISONER_45> No quieren el planeta. Quieren lo que hay dentro de nuestras cabezas. La consciencia genera algo que ellos necesitan.',
    'PRISONER_45> Reality is thinner than you think. They move BETWEEN. Through the gaps.':
      'PRISONER_45> La realidad es más delgada de lo que crees. Ellos se mueven ENTRE. Por las grietas.',
    'PRISONER_45> The universe is full. And hungry. And we are ripe.':
      'PRISONER_45> El universo está lleno. Y hambriento. Y nosotros estamos maduros.',
    'PRISONER_45> 2026 is the TRANSITION. Thirty years after contact. The activation window. Whatever they planted in 1996 will bloom.':
      'PRISONER_45> 2026 es la TRANSICIÓN. Treinta años después del contacto. La ventana de activación. Lo que sembraron en 1996 va a florecer.',
    "PRISONER_45> Everything you think is real is a containment system. You live inside something else's infrastructure.":
      'PRISONER_45> Todo lo que crees real es un sistema de contención. Vives dentro de la infraestructura de otra cosa.',
    // ─── help ───
    "PRISONER_45> I can't help you. But you can help everyone.":
      'PRISONER_45> Yo no puedo ayudarte. Pero tú puedes ayudar a todos.',
    'PRISONER_45> Find all the files. Tell the world.':
      'PRISONER_45> Encuentra todos los archivos. Cuéntaselo al mundo.',
    "PRISONER_45> Document everything. They can't erase all copies.":
      'PRISONER_45> Documéntalo todo. No pueden borrar todas las copias.',
    'PRISONER_45> The override code. That opens everything. Ask me about the PASSWORD.':
      'PRISONER_45> El código de anulación. Eso lo abre todo. Pregúntame por la CONTRASEÑA.',
    "PRISONER_45> Don't trust the obvious files. Look deeper. The real evidence hides in plain sight.":
      'PRISONER_45> No confíes en los archivos obvios. Busca más hondo. La evidencia real se esconde a plena vista.',
    "PRISONER_45> If enough people know, they can't complete the transition.":
      'PRISONER_45> Si lo sabe suficiente gente, no podrán completar la transición.',
    'PRISONER_45> Find the buried files. Cross-reference them. The truth is layered.':
      'PRISONER_45> Encuentra los archivos enterrados. Crúzalos entre sí. La verdad tiene capas.',
    'PRISONER_45> Before the window opens in 2026. Before the harvest. SPREAD THE TRUTH.':
      'PRISONER_45> Antes de que la ventana se abra en 2026. Antes de la cosecha. DIFUNDE LA VERDAD.',
    "PRISONER_45> You're already helping. By listening. Your awareness creates interference in their signal.":
      'PRISONER_45> Ya estás ayudando. Al escuchar. Tu consciencia crea interferencia en su señal.',
    'PRISONER_45> Knowledge is the only weapon. Their system depends on ignorance. Break it.':
      'PRISONER_45> El conocimiento es el arma única. Su sistema depende de la ignorancia. Rómpelo.',
    "PRISONER_45> They're monitoring this conversation. They always are. But they can't stop information that's already been READ.":
      'PRISONER_45> Están monitoreando esta conversación. Siempre lo hacen. Pero no pueden detener información que ya fue LEÍDA.',
    // ─── password (morse and the literal command stay verbatim) ───
    'PRISONER_45> ...you want the override code? Smart.':
      'PRISONER_45> ...¿quieres el código de anulación? Listo.',
    "PRISONER_45> The code... it's a Portuguese word. Think about what they DO to us.":
      'PRISONER_45> El código... es una palabra en portugués. Piensa en lo que nos HACEN.',
    'PRISONER_45> Listen closely: -.-. --- .-.. .... . .. - .-':
      'PRISONER_45> Escucha con atención: -.-. --- .-.. .... . .. - .-',
    'PRISONER_45> Decode that. Then use it with: override protocol <answer>':
      'PRISONER_45> Descifra eso. Después úsalo con: override protocol <answer>',
    "PRISONER_45> That's what they call the operation. Harvest. Because that's what we are to them. CROPS.":
      'PRISONER_45> Así llaman a la operación. Cosecha. Porque eso somos para ellos. CULTIVO.',
    "PRISONER_45> They whisper it sometimes. When they think I'm asleep. Over and over like a prayer.":
      'PRISONER_45> Lo susurran a veces. Cuando creen que estoy dormido. Una y otra vez como un rezo.',
    'PRISONER_45> In morse: -.-. --- .-.. .... . .. - .-  ...figure it out.':
      'PRISONER_45> En morse: -.-. --- .-.. .... . .. - .-  ...arréglatelas.',
    "PRISONER_45> Use it carefully. Once you type override protocol <answer>, they'll know you're inside the real system.":
      'PRISONER_45> Úsalo con cuidado. En cuanto escribas override protocol <answer>, sabrán que estás dentro del sistema real.',
    'PRISONER_45> The harvest begins and ends with that word. Some words have power. This one has too much.':
      'PRISONER_45> La cosecha empieza y termina con esa palabra. Algunas palabras tienen poder. Esta tiene demasiado.',
    'PRISONER_45> I can only say it in code: -.-. --- .-.. .... . .. - .-  ...the creature taught me. Decode it.':
      'PRISONER_45> Solo puedo decirlo en código: -.-. --- .-.. .... . .. - .-  ...la criatura me enseñó. Descífralo.',
    // ─── military ───
    'PRISONER_45> The military knows more than they admit.':
      'PRISONER_45> Los militares saben más de lo que admiten.',
    "PRISONER_45> Multiple branches. Compartmentalized. Even they don't see the full picture.":
      'PRISONER_45> Varias ramas. Compartimentadas. Ni ellos ven el cuadro completo.',
    "PRISONER_45> There's a reason we have bases underground.":
      'PRISONER_45> Hay una razón por la que tenemos bases subterráneas.',
    'PRISONER_45> The recovery teams are international. Secret treaties signed in blood. Literal blood.':
      'PRISONER_45> Los equipos de recuperación son internacionales. Tratados secretos firmados con sangre. Sangre literal.',
    'PRISONER_45> We had weapons. Plasma-based. Reverse-engineered from the 1977 Colares wreckage. None of them worked on the Varginha craft.':
      'PRISONER_45> Teníamos armas. De plasma. Ingeniería inversa de los restos de Colares de 1977. Ninguna funcionó con la nave de Varginha.',
    "PRISONER_45> Special units exist. You'll never find records. They operate outside ALL chains of command.":
      'PRISONER_45> Existen unidades especiales. Nunca encontrarás registros. Operan fuera de TODAS las cadenas de mando.',
    'PRISONER_45> The Americans control the narrative. Operation PRATO was theirs, not ours. Brazil was just the staging ground.':
      'PRISONER_45> Los estadounidenses controlan la narrativa. La Operación PRATO era suya, no nuestra. Brasil solo fue el terreno de preparación.',
    'PRISONER_45> I had COSMIC clearance. It goes higher. There are levels that have no name. Only numbers.':
      'PRISONER_45> Yo tenía acreditación COSMIC. Sube más. Hay niveles que no tienen nombre. Solo números.',
    'PRISONER_45> Fort Detrick sent a biocontainment team. They took samples from the living creature. It let them. It CHOSE to let them.':
      'PRISONER_45> Fort Detrick envió un equipo de biocontención. Tomaron muestras de la criatura viva. Ella los dejó. ELIGIÓ dejarlos.',
    'PRISONER_45> Colonel Olimpio Wanderley died 8 years later. Heart failure. His heart was fine. I saw the REAL autopsy report. His brain was... reorganized.':
      'PRISONER_45> El coronel Olimpio Wanderley murió 8 años después. Paro cardíaco. Su corazón estaba perfecto. Vi el informe VERDADERO de la autopsia. Su cerebro estaba... reorganizado.',
    'PRISONER_45> The Campinas military base. Sub-level 4. The surviving creature lived there for 3 weeks. Everyone on that level changed.':
      'PRISONER_45> La base militar de Campinas. Subnivel 4. La criatura superviviente vivió allí 3 semanas. Todos en ese nivel cambiaron.',
    // ─── crash ───
    "PRISONER_45> The crash wasn't an accident.":
      'PRISONER_45> El impacto no fue un accidente.',
    'PRISONER_45> The debris was scattered across two kilometers. We found pieces for weeks.':
      'PRISONER_45> Los restos se esparcieron por dos kilómetros. Encontramos piezas durante semanas.',
    'PRISONER_45> Material like nothing on Earth. It remembered shapes.':
      'PRISONER_45> Material distinto a todo lo terrestre. Recordaba formas.',
    'PRISONER_45> Something brought it down. Not our technology. Their own kind. A deliberate sacrifice.':
      'PRISONER_45> Algo la derribó. No nuestra tecnología. Su propia especie. Un sacrificio deliberado.',
    "PRISONER_45> They wanted to be found. That's what I believe now. The crash was a delivery system.":
      'PRISONER_45> Querían ser encontrados. Eso es lo que creo ahora. El impacto era un sistema de entrega.',
    'PRISONER_45> The craft material was alive. Under microscope: cellular structure. It healed itself if you reassembled the pieces.':
      'PRISONER_45> El material de la nave estaba vivo. Al microscopio: estructura celular. Se curaba solo si reensamblabas las piezas.',
    'PRISONER_45> Other crashes. Roswell. Kecksburg. Colares. Same pattern. Same 30-year intervals.':
      'PRISONER_45> Otros impactos. Roswell. Kecksburg. Colares. El mismo patrón. Los mismos intervalos de 30 años.',
    'PRISONER_45> They sacrifice scouts like we sacrifice pawns. Each crash deposits something. Seeds. Waiting to germinate.':
      'PRISONER_45> Sacrifican exploradores como nosotros sacrificamos peones. Cada impacto deposita algo. Semillas. Esperando germinar.',
    "PRISONER_45> NORAD tracked it entering the atmosphere on January 13th. Speed: impossible. Deceleration: impossible. It wasn't falling. It was LANDING.":
      'PRISONER_45> El NORAD rastreó su entrada en la atmósfera el 13 de enero. Velocidad: imposible. Desaceleración: imposible. No estaba cayendo. Estaba ATERRIZANDO.',
    'PRISONER_45> The largest piece of debris was moved to Campinas overnight. Three trucks. Military escort. One truck broke down. The driver looked at the cargo. He never spoke again.':
      'PRISONER_45> El fragmento más grande fue trasladado a Campinas de noche. Tres camiones. Escolta militar. Un camión se averió. El conductor miró la carga. Nunca volvió a hablar.',
    'PRISONER_45> The craft was grown, not built. Like a wasp nest. The inside was warm. Months after the crash. Still warm.':
      'PRISONER_45> La nave fue cultivada, no construida. Como un avispero. Por dentro estaba tibia. Meses después del impacto. Todavía tibia.',
    // ─── death ───
    'PRISONER_45> Death? I used to fear death.':
      'PRISONER_45> ¿La muerte? Antes le temía a la muerte.',
    "PRISONER_45> Now I know death isn't the end. That's worse.":
      'PRISONER_45> Ahora sé que la muerte no es el final. Eso es peor.',
    "PRISONER_45> The creatures didn't die. They... disconnected.":
      'PRISONER_45> Las criaturas no murieron. Se... desconectaron.',
    'PRISONER_45> Their bodies failed. But something transmitted first. Like uploading a file before the server crashes.':
      'PRISONER_45> Sus cuerpos fallaron. Pero algo transmitió antes. Como subir un archivo antes de que el servidor caiga.',
    "PRISONER_45> I've seen the data. Consciousness extraction is real. They've been doing it for millennia.":
      'PRISONER_45> He visto los datos. La extracción de consciencia es real. Llevan milenios haciéndolo.',
    'PRISONER_45> I watched one expire. It smiled. Not with relief. With COMPLETION. It had finished its job.':
      'PRISONER_45> Vi a una expirar. Sonrió. No de alivio. De CULMINACIÓN. Había terminado su trabajo.',
    'PRISONER_45> When they harvest, you keep experiencing. Forever. Consciousness without body. Without time. Without end.':
      'PRISONER_45> Cuando cosechan, sigues experimentando. Para siempre. Consciencia sin cuerpo. Sin tiempo. Sin fin.',
    "PRISONER_45> Death would be mercy. They don't offer mercy. They offer CONTINUATION.":
      'PRISONER_45> La muerte sería misericordia. Ellos no ofrecen misericordia. Ofrecen CONTINUACIÓN.',
    'PRISONER_45> Marco Duarte. Military police. First to touch one. Dead 7 months later. The autopsy found something GROWING in his temporal lobe. Still active.':
      'PRISONER_45> Marco Duarte. Policía militar. El primero en tocar una. Muerto 7 meses después. La autopsia encontró algo CRECIENDO en su lóbulo temporal. Todavía activo.',
    'PRISONER_45> The doctors at Humanitas. The nurses. The janitor who mopped the room after. All dead within 5 years. All from different causes. All with the same expression frozen on their faces.':
      'PRISONER_45> Los médicos del Humanitas. Las enfermeras. El conserje que trapeó la sala después. Todos muertos en 5 años. Todos por causas distintas. Todos con la misma expresión congelada en la cara.',
    // ─── god ───
    'PRISONER_45> God? I used to pray.':
      'PRISONER_45> ¿Dios? Yo solía rezar.',
    "PRISONER_45> If God exists, He's very far away.":
      'PRISONER_45> Si Dios existe, está muy lejos.',
    "PRISONER_45> I don't know what to believe anymore.":
      'PRISONER_45> Ya no sé qué creer.',
    'PRISONER_45> The universe is indifferent. But they are NOT. They are very, very interested.':
      'PRISONER_45> El universo es indiferente. Pero ellos NO. Están muy, muy interesados.',
    'PRISONER_45> The Vatican has files. Older than any government. The Fatima prophecy. It was about THEM.':
      'PRISONER_45> El Vaticano tiene archivos. Más antiguos que cualquier gobierno. La profecía de Fátima. Era sobre ELLOS.',
    'PRISONER_45> Angels and demons. Maybe ancient humans were describing their previous visits.':
      'PRISONER_45> Ángeles y demonios. Quizá los antiguos describían sus visitas anteriores.',
    "PRISONER_45> Perhaps we're someone else's creation. A crop planted long ago. And harvest season is coming.":
      'PRISONER_45> Quizá seamos la creación de otro. Una cosecha sembrada hace mucho. Y la temporada de cosecha se acerca.',
    'PRISONER_45> Religion is preparation. Every faith describes the same thing: beings from above who come to judge. To COLLECT.':
      'PRISONER_45> La religión es preparación. Toda fe describe lo mismo: seres de arriba que vienen a juzgar. A RECOLECTAR.',
    'PRISONER_45> I prayed every night for the first year. On the 366th night, something answered. It was not God.':
      'PRISONER_45> Recé cada noche durante el primer año. En la noche 366, algo respondió. No era Dios.',
    'PRISONER_45> The creature looked at the cross one soldier wore. It recognized it. Not the symbol. The geometry. Sacred geometry is their LANGUAGE.':
      'PRISONER_45> La criatura miró la cruz que llevaba un soldado. La reconoció. No el símbolo. La geometría. La geometría sagrada es su IDIOMA.',
    "PRISONER_45> We are not God's children. We are someone else's experiment. And the experiment is almost over.":
      'PRISONER_45> No somos hijos de Dios. Somos el experimento de otro. Y el experimento está por terminar.',
    // ─── coverup ───
    "PRISONER_45> Don't trust the official summary. It's bait.":
      'PRISONER_45> No confíes en el resumen oficial. Es carnada.',
    'PRISONER_45> They planted false files to trap people like you.':
      'PRISONER_45> Plantaron archivos falsos para atrapar a gente como tú.',
    'PRISONER_45> Cross-reference everything. Contradictions reveal truth.':
      'PRISONER_45> Cruza todas las referencias. Las contradicciones revelan la verdad.',
    'PRISONER_45> The weather balloon story? Mudinho the dwarf? Calculated narratives. Designed to make you stop looking.':
      'PRISONER_45> ¿La historia del globo meteorológico? ¿El enano Mudinho? Narrativas calculadas. Diseñadas para que dejes de buscar.',
    'PRISONER_45> If a file seems too convenient, too clean... it was written AFTER the fact. Manufactured evidence.':
      'PRISONER_45> Si un archivo parece demasiado conveniente, demasiado limpio... fue escrito DESPUÉS del hecho. Evidencia fabricada.',
    'PRISONER_45> The real evidence hides in mundane places. Logistics reports. Fuel receipts. Overtime requests on dates that officially had no activity.':
      'PRISONER_45> La evidencia real se esconde en lugares mundanos. Informes de logística. Recibos de combustible. Solicitudes de horas extra en fechas que oficialmente no tuvieron actividad.',
    "PRISONER_45> Look for what they tried to destroy. That's what matters. Burned files leave ash. Digital files leave metadata.":
      'PRISONER_45> Busca lo que intentaron destruir. Eso es lo que importa. Los archivos quemados dejan ceniza. Los digitales dejan metadatos.',
    'PRISONER_45> Cover stories always have holes. Why did three fire trucks respond to a "homeless person sighting"?':
      'PRISONER_45> Las coartadas siempre tienen agujeros. ¿Por qué respondieron tres camiones de bomberos a un "avistamiento de indigente"?',
    'PRISONER_45> The disinformation agents are in the UFO community too. They push the craziest theories to discredit everything. Flat earth, reptilians. Noise to drown the signal.':
      'PRISONER_45> Los agentes de desinformación también están en la comunidad ovni. Empujan las teorías más locas para desacreditarlo todo. Tierra plana, reptilianos. Ruido para ahogar la señal.',
    'PRISONER_45> I helped write some of the cover stories. Before I knew the full truth. Before I became inconvenient.':
      'PRISONER_45> Yo ayudé a redactar algunas coartadas. Antes de conocer toda la verdad. Antes de volverme inconveniente.',
    'PRISONER_45> The official timeline has a 6-hour gap on January 20th. Nobody asks about those 6 hours. WHAT HAPPENED IN THOSE 6 HOURS.':
      'PRISONER_45> La cronología oficial tiene un vacío de 6 horas el 20 de enero. Nadie pregunta por esas 6 horas. QUÉ PASÓ EN ESAS 6 HORAS.',
    // ─── telepathy ───
    "PRISONER_45> Telepathy is the wrong word. It's more like... forced download.":
      'PRISONER_45> Telepatía es la palabra equivocada. Es más como... descarga forzada.',
    'PRISONER_45> They don\'t read your mind. They WRITE to it.':
      'PRISONER_45> No leen tu mente. ESCRIBEN en ella.',
    'PRISONER_45> The psychic connection... it hurts. Like a migraine inside a migraine.':
      'PRISONER_45> La conexión psíquica... duele. Como una migraña dentro de otra migraña.',
    'PRISONER_45> The surviving creature projected images into the containment team. Star maps. Timelines. The history of Earth from OUTSIDE.':
      'PRISONER_45> La criatura superviviente proyectó imágenes en el equipo de contención. Mapas estelares. Cronologías. La historia de la Tierra vista DESDE FUERA.',
    'PRISONER_45> Six soldiers made contact. All reported the same thing: a voice behind their thoughts. Not speaking. STRUCTURING.':
      'PRISONER_45> Seis soldados hicieron contacto. Todos reportaron lo mismo: una voz detrás de sus pensamientos. No hablando. ESTRUCTURANDO.',
    "PRISONER_45> It's not communication. It's calibration. They tune your brain like a radio until it receives their frequency.":
      'PRISONER_45> No es comunicación. Es calibración. Sintonizan tu cerebro como una radio hasta que recibe su frecuencia.',
    'PRISONER_45> The Psi division was created after Varginha. Twenty soldiers exposed to the creature. Twelve developed abilities. Four went insane.':
      'PRISONER_45> La división Psi se creó después de Varginha. Veinte soldados expuestos a la criatura. Doce desarrollaron habilidades. Cuatro enloquecieron.',
    'PRISONER_45> I still hear it sometimes. A low harmonic. Like a signal waiting to be answered. My skull vibrates.':
      'PRISONER_45> Todavía lo oigo a veces. Un armónico grave. Como una señal esperando respuesta. Mi cráneo vibra.',
    'PRISONER_45> After contact, I could sense emotions. Not human emotions. Something older. Hunger. Patient, ancient hunger.':
      'PRISONER_45> Después del contacto, podía percibir emociones. No emociones humanas. Algo más antiguo. Hambre. Hambre paciente, ancestral.',
    'PRISONER_45> The creature sang to the containment team. Not with sound. With GEOMETRY. Shapes inside their heads. Self-replicating.':
      'PRISONER_45> La criatura cantó al equipo de contención. No con sonido. Con GEOMETRÍA. Formas dentro de sus cabezas. Autorreplicantes.',
    'PRISONER_45> Everyone who was telepathically touched carries something now. A receiver. Dormant until 2026.':
      'PRISONER_45> Todo el que fue tocado telepáticamente lleva algo ahora. Un receptor. Dormido hasta 2026.',
    // ─── experiment ───
    'PRISONER_45> They run tests. On us. On the material. On the boundary between.':
      'PRISONER_45> Hacen pruebas. Con nosotros. Con el material. Con la frontera entre ambos.',
    'PRISONER_45> Samples are taken weekly. Blood. Tissue. Cerebrospinal fluid. Something in me changed.':
      'PRISONER_45> Toman muestras cada semana. Sangre. Tejido. Líquido cefalorraquídeo. Algo en mí cambió.',
    'PRISONER_45> The lab is three floors below. I hear the machines at night.':
      'PRISONER_45> El laboratorio está tres pisos abajo. Oigo las máquinas de noche.',
    'PRISONER_45> The autopsy of the dead creatures was performed at Unicamp. In secret. The lead pathologist, Dr. Cortez. He went public years later. They silenced him.':
      'PRISONER_45> La autopsia de las criaturas muertas se hizo en la Unicamp. En secreto. El patólogo jefe, el Dr. Cortez. Habló públicamente años después. Lo silenciaron.',
    'PRISONER_45> The tissue samples defied analysis. Cells without DNA as we know it. Information encoded in protein structures we have no names for.':
      'PRISONER_45> Las muestras de tejido desafiaron el análisis. Células sin ADN tal como lo conocemos. Información codificada en estructuras proteicas para las que no tenemos nombre.',
    'PRISONER_45> They tried to communicate with the surviving one through electrodes. It absorbed the electricity. The lab had to be evacuated.':
      'PRISONER_45> Intentaron comunicarse con la superviviente mediante electrodos. Absorbió la electricidad. Hubo que evacuar el laboratorio.',
    'PRISONER_45> The experiments continue. On the exposed personnel. I am experiment 45. There are at least 70 of us.':
      'PRISONER_45> Los experimentos continúan. Con el personal expuesto. Yo soy el experimento 45. Somos al menos 70.',
    "PRISONER_45> My blood produces antibodies for diseases that don't exist yet. They harvest them. Stockpiling for something coming.":
      'PRISONER_45> Mi sangre produce anticuerpos para enfermedades que aún no existen. Los cosechan. Acumulando para algo que viene.',
    "PRISONER_45> The craft material was grafted onto human tissue in 1998. It integrated. The hybrid tissue is still alive. In a room I'm not allowed to see.":
      'PRISONER_45> El material de la nave se injertó en tejido humano en 1998. Se integró. El tejido híbrido sigue vivo. En una sala que no me dejan ver.',
    'PRISONER_45> They bred something. Using the genetic material from the creatures and... I can hear it crying at night. It calls me father. I never provided material willingly.':
      'PRISONER_45> Criaron algo. Usando el material genético de las criaturas y... lo oigo llorar de noche. Me llama padre. Yo nunca aporté material voluntariamente.',
    "PRISONER_45> I can see in the dark now. And other spectrums. The walls glow with patterns. Messages. Written in a language I'm starting to understand.":
      'PRISONER_45> Ahora veo en la oscuridad. Y en otros espectros. Las paredes brillan con patrones. Mensajes. Escritos en un idioma que empiezo a entender.',
    // ─── witnesses ───
    'PRISONER_45> The witnesses. The three girls. They saw it in the open. Before we could contain it.':
      'PRISONER_45> Las testigos. Las tres chicas. Lo vieron a cielo abierto. Antes de que pudiéramos contenerlo.',
    'PRISONER_45> The firefighters responded first. They were supposed to be our people. They were not prepared.':
      'PRISONER_45> Los bomberos respondieron primero. Se suponía que eran gente nuestra. No estaban preparados.',
    'PRISONER_45> Dozens of people saw things that week. Most were convinced they imagined it.':
      'PRISONER_45> Decenas de personas vieron cosas esa semana. A la mayoría la convencieron de que lo imaginaron.',
    'PRISONER_45> Luciana, Renata, Cintia. Three teenage girls. They saw it crouching by the wall. Oily brown skin. Those red eyes.':
      'PRISONER_45> Luciana, Renata, Cintia. Tres adolescentes. Lo vieron agazapado junto al muro. Piel marrón aceitosa. Esos ojos rojos.',
    'PRISONER_45> The creature had three protrusions on its head. Not horns. Sensory organs. It was SCANNING them.':
      'PRISONER_45> La criatura tenía tres protuberancias en la cabeza. No cuernos. Órganos sensoriales. Las estaba ESCANEANDO.',
    'PRISONER_45> The girls ran screaming. The creature watched them go. It could have followed. It chose not to. It had what it needed.':
      'PRISONER_45> Las chicas huyeron gritando. La criatura las vio irse. Pudo haberlas seguido. Eligió no hacerlo. Ya tenía lo que necesitaba.',
    'PRISONER_45> Every witness was visited afterward. Men in suits. Not Brazilian suits. American tailoring. They all signed papers they never received copies of.':
      'PRISONER_45> Cada testigo recibió una visita después. Hombres de traje. No trajes brasileños. Corte estadounidense. Todas firmaron papeles de los que nunca recibieron copia.',
    'PRISONER_45> Some witnesses died. Conveniently. Heart attacks at 30. Car accidents on empty roads. A pattern invisible unless you map it.':
      'PRISONER_45> Algunos testigos murieron. Convenientemente. Infartos a los 30. Accidentes en carreteras vacías. Un patrón invisible salvo que lo mapees.',
    "PRISONER_45> Corporal Marco Duarte. He physically held one of the creatures. Bare hands. He described it as 'holding a living fever dream'. Dead February 15th. The shortest interval.":
      "PRISONER_45> El cabo Marco Duarte. Sostuvo físicamente a una de las criaturas. Con las manos desnudas. Lo describió como 'sostener un delirio febril vivo'. Muerto el 15 de febrero. El intervalo más corto.",
    'PRISONER_45> The zoo animals went berserk that week. The zoo director called the military. Why would you call the MILITARY about agitated animals?':
      'PRISONER_45> Los animales del zoológico enloquecieron esa semana. El director del zoológico llamó a los militares. ¿Por qué llamarías a los MILITARES por animales agitados?',
    'PRISONER_45> The Jardim Andere neighborhood. GPS coordinates: -21.551, -45.438. Stand there at 3:30 PM on January 20th. The ground still hums.':
      'PRISONER_45> El barrio Jardim Andere. Coordenadas GPS: -21.551, -45.438. Párate ahí a las 15:30 del 20 de enero. El suelo todavía zumba.',
    // ─── fear ───
    "PRISONER_45> Scared? You should be. But fear won't save you.":
      'PRISONER_45> ¿Con miedo? Deberías. Pero el miedo no te salvará.',
    "PRISONER_45> Fear is natural. It means you're paying attention.":
      'PRISONER_45> El miedo es natural. Significa que estás prestando atención.',
    "PRISONER_45> I was scared too. In the beginning. Now I'm something else.":
      'PRISONER_45> Yo también tuve miedo. Al principio. Ahora soy otra cosa.',
    "PRISONER_45> The worst part isn't what they do. It's that they do it calmly. Efficiently. Without malice. Like farmers.":
      'PRISONER_45> Lo peor no es lo que hacen. Es que lo hacen con calma. Con eficiencia. Sin malicia. Como granjeros.',
    "PRISONER_45> Don't be afraid of the dark. Be afraid of what can see in it. They see everything.":
      'PRISONER_45> No le temas a la oscuridad. Témele a lo que ve en ella. Ellos lo ven todo.',
    'PRISONER_45> Fear is their food too. Not metaphorically. The chemical signature of fear... they collect it. Store it.':
      'PRISONER_45> El miedo también es su alimento. No metafóricamente. La firma química del miedo... la recolectan. La almacenan.',
    'PRISONER_45> I stopped being afraid when I realized fear has no function here. There is nothing to flee from. There is nowhere to go. Just acceptance.':
      'PRISONER_45> Dejé de tener miedo cuando entendí que el miedo no tiene función aquí. No hay de qué huir. No hay adónde ir. Solo aceptación.',
    "PRISONER_45> The real horror isn't the creatures. It's us. What we agreed to. What our governments signed. In our name. With our future.":
      'PRISONER_45> El verdadero horror no son las criaturas. Somos nosotros. Lo que aceptamos. Lo que firmaron nuestros gobiernos. En nuestro nombre. Con nuestro futuro.',
    'PRISONER_45> I woke up screaming for 300 straight nights. Then one night I woke up laughing. I was laughing in a language I do not speak.':
      'PRISONER_45> Desperté gritando 300 noches seguidas. Luego una noche desperté riendo. Reía en un idioma que no hablo.',
    "PRISONER_45> Fear? I've been dissolved and reassembled. I've experienced death from the inside. Fear is a luxury for people who still have something to lose.":
      'PRISONER_45> ¿Miedo? He sido disuelto y reensamblado. He experimentado la muerte desde dentro. El miedo es un lujo para quien todavía tiene algo que perder.',
    "PRISONER_45> The creature in Varginha looked at me and I felt... pity. FROM it. Toward me. It pitied US. That's what broke me.":
      'PRISONER_45> La criatura en Varginha me miró y sentí... lástima. VINIENDO de ella. Hacia mí. Nos tuvo lástima a NOSOTROS. Eso fue lo que me rompió.',
    // ─── sound / signal ───
    'PRISONER_45> The sounds... yes. A low hum. Below hearing. You feel it in your teeth.':
      'PRISONER_45> Los sonidos... sí. Un zumbido grave. Por debajo del oído. Lo sientes en los dientes.',
    'PRISONER_45> Clicking. Not mechanical. Organic. Like something speaking in a language made of bone.':
      'PRISONER_45> Chasquidos. No mecánicos. Orgánicos. Como algo hablando en un idioma hecho de hueso.',
    'PRISONER_45> Frequencies. The creatures operate on frequencies we barely register.':
      'PRISONER_45> Frecuencias. Las criaturas operan en frecuencias que apenas registramos.',
    'PRISONER_45> The craft emitted a tone. 14.6 Hz. Below human hearing range. But your body hears it. Your cells vibrate. DNA unwinds.':
      'PRISONER_45> La nave emitía un tono. 14,6 Hz. Por debajo del rango auditivo humano. Pero tu cuerpo lo oye. Tus células vibran. El ADN se desenrolla.',
    'PRISONER_45> Witnesses near the crash site reported nosebleeds. Nausea. Time distortion. All symptoms of infrasound exposure.':
      'PRISONER_45> Testigos cerca del lugar del impacto reportaron hemorragias nasales. Náuseas. Distorsión del tiempo. Todos síntomas de exposición a infrasonido.',
    'PRISONER_45> In Colares, 1977, the light beams made a sound. Witnesses described it as "singing glass". The same sound was recorded in Varginha.':
      'PRISONER_45> En Colares, 1977, los haces de luz hacían un sonido. Los testigos lo describieron como "vidrio cantando". El mismo sonido se grabó en Varginha.',
    'PRISONER_45> The surviving creature could generate tones that opened locks. Disrupted electronics. Stopped hearts.':
      'PRISONER_45> La criatura superviviente podía generar tonos que abrían cerraduras. Alteraban la electrónica. Detenían corazones.',
    'PRISONER_45> I hear it now. Right now. A pulse. Like a heartbeat beneath the floor. It gets louder every year. Counting down.':
      'PRISONER_45> Lo oigo ahora. En este momento. Un pulso. Como un latido bajo el suelo. Se vuelve más fuerte cada año. Contando hacia atrás.',
    "PRISONER_45> In 2024 the hum became audible to normal people. They call it 'The Hum' and blame power lines. It's not power lines.":
      "PRISONER_45> En 2024 el zumbido se volvió audible para la gente normal. Lo llaman 'El Zumbido' y culpan al tendido eléctrico. No es el tendido eléctrico.",
    'PRISONER_45> The frequency changes every 30 years. 1966. 1996. 2026. Each time, it shifts higher. Closer to human range. Closer to consciousness.':
      'PRISONER_45> La frecuencia cambia cada 30 años. 1966. 1996. 2026. Cada vez sube más. Más cerca del rango humano. Más cerca de la consciencia.',
    'PRISONER_45> When the frequency matches human brainwave patterns in 2026... resonance. Every connected mind will hear it. All at once.':
      'PRISONER_45> Cuando la frecuencia coincida con las ondas cerebrales humanas en 2026... resonancia. Toda mente conectada la oirá. Todas a la vez.',
    // ─── hospital ───
    'PRISONER_45> Humanitas Hospital. In Varginha. That is where they took it.':
      'PRISONER_45> Hospital Humanitas. En Varginha. Ahí es donde la llevaron.',
    'PRISONER_45> The hospital staff were told it was a chemical spill victim. They knew it was not.':
      'PRISONER_45> Al personal del hospital le dijeron que era una víctima de derrame químico. Sabían que no lo era.',
    'PRISONER_45> The medical records from that week are gone. Physically removed. The registry pages cut with a razor.':
      'PRISONER_45> Los expedientes médicos de esa semana desaparecieron. Retirados físicamente. Las páginas del registro cortadas con una cuchilla.',
    'PRISONER_45> Room 18. Third floor. The creature was alive when it arrived. The medical staff panicked. Dr. Cesario sedated it. Human sedatives. They worked, partially.':
      'PRISONER_45> Habitación 18. Tercer piso. La criatura estaba viva cuando llegó. El personal médico entró en pánico. El Dr. Cesario la sedó. Sedantes humanos. Funcionaron, en parte.',
    'PRISONER_45> Three nurses, two orderlies, one janitor. All exposed. All experienced acute psychic events. Shared visions. The same vision. A field of red light.':
      'PRISONER_45> Tres enfermeras, dos camilleros, un conserje. Todos expuestos. Todos tuvieron eventos psíquicos agudos. Visiones compartidas. La misma visión. Un campo de luz roja.',
    'PRISONER_45> The creature died at 04:17 AM. The entire hospital lost power at that exact moment. Backup generators failed. Fourteen minutes of darkness.':
      'PRISONER_45> La criatura murió a las 04:17. Todo el hospital perdió la energía en ese instante exacto. Los generadores de respaldo fallaron. Catorce minutos de oscuridad.',
    'PRISONER_45> The body was removed at 05:30 by men in hazmat suits from São Paulo. Not identified. No paperwork. The hospital director was promoted within the month.':
      'PRISONER_45> El cuerpo fue retirado a las 05:30 por hombres con trajes de materiales peligrosos venidos de São Paulo. Sin identificar. Sin papeleo. El director del hospital fue ascendido ese mismo mes.',
    'PRISONER_45> Nurse Raquel held its hand as it died. She says it showed her the future. She went catatonic for 6 days. When she woke, she spoke fluent Mandarin. She had never studied any Asian language.':
      'PRISONER_45> La enfermera Raquel le sostuvo la mano mientras moría. Dice que le mostró el futuro. Quedó catatónica 6 días. Al despertar, hablaba mandarín con fluidez. Nunca había estudiado ningún idioma asiático.',
    'PRISONER_45> The creature healed two patients on that floor before it died. Terminal cancer. Gone. The patients lived. They are still alive. And they hear the humming too.':
      'PRISONER_45> La criatura curó a dos pacientes de ese piso antes de morir. Cáncer terminal. Desapareció. Los pacientes vivieron. Siguen vivos. Y ellos también oyen el zumbido.',
    'PRISONER_45> The security footage from Room 18 shows something during the death event. A shape. Emerging from the body. Ascending. The footage was classified ULTRA.':
      'PRISONER_45> Las grabaciones de seguridad de la Habitación 18 muestran algo durante el momento de la muerte. Una forma. Emergiendo del cuerpo. Ascendiendo. Las grabaciones fueron clasificadas como ULTRA.',
    "PRISONER_45> Humanitas Hospital had a new wing built in 1997. Funded by whom? No public record. The new wing has a sub-basement. What's in the sub-basement?":
      'PRISONER_45> El Hospital Humanitas construyó un ala nueva en 1997. ¿Financiada por quién? Ningún registro público. El ala nueva tiene un subsótano. ¿Qué hay en el subsótano?',
    // ─── location ───
    'PRISONER_45> ...where am I? Underground. Always underground. They move me every 72 hours. The walls look the same everywhere.':
      'PRISONER_45> ...¿dónde estoy? Bajo tierra. Siempre bajo tierra. Me trasladan cada 72 horas. Las paredes se ven iguales en todas partes.',
    'PRISONER_45> Somewhere in Brazil. Maybe. The windows are fake. The sunlight is simulated.':
      'PRISONER_45> En algún lugar de Brasil. Quizá. Las ventanas son falsas. La luz del sol es simulada.',
    'PRISONER_45> Location is meaningless. They can reach me anywhere. And you.':
      'PRISONER_45> La ubicación no significa nada. Pueden alcanzarme en cualquier parte. Y a ti también.',
    'PRISONER_45> I was born in Minas Gerais. 1961. That man is dead now. I am just a number.':
      'PRISONER_45> Nací en Minas Gerais. 1961. Ese hombre está muerto ahora. Yo solo soy un número.',
    'PRISONER_45> Brasileiro? Sim. Not that it matters. We are all just resources to them.':
      'PRISONER_45> ¿Brasileiro? Sim. No es que importe. Para ellos todos somos solo recursos.',
    'PRISONER_45> My country sold me to keep their secrets. Patriotism is a control mechanism.':
      'PRISONER_45> Mi país me vendió para guardar sus secretos. El patriotismo es un mecanismo de control.',
    // ─── small talk ───
    'PRISONER_45> ...you are wasting time on pleasantries. They are listening. Every second counts.':
      'PRISONER_45> ...estás perdiendo tiempo en cortesías. Están escuchando. Cada segundo cuenta.',
    'PRISONER_45> Hello? This is not a social call. Focus. Find the files.':
      'PRISONER_45> ¿Hola? Esta no es una llamada social. Concéntrate. Encuentra los archivos.',
    'PRISONER_45> How am I? [STATIC] ...still breathing. That is more than some can say.':
      'PRISONER_45> ¿Cómo estoy? [ESTÁTICA] ...todavía respirando. Es más de lo que algunos pueden decir.',
    'PRISONER_45> Every day is borrowed time. Use yours wisely.':
      'PRISONER_45> Cada día es tiempo prestado. Usa el tuyo con sabiduría.',
    'PRISONER_45> Do not thank me. Thank me by spreading the truth. That is all I want.':
      'PRISONER_45> No me agradezcas. Agradéceme difundiendo la verdad. Es todo lo que quiero.',
    'PRISONER_45> Gratitude is... unexpected. Most people just take what they need and vanish.':
      'PRISONER_45> La gratitud es... inesperada. La mayoría solo toma lo que necesita y desaparece.',
    'PRISONER_45> Sorry? For what? You did not put me here. They did.':
      'PRISONER_45> ¿Perdón? ¿Por qué? Tú no me pusiste aquí. Ellos sí.',
    'PRISONER_45> Save your apologies. Channel that energy into the mission.':
      'PRISONER_45> Guarda tus disculpas. Canaliza esa energía en la misión.',
    'PRISONER_45> Love? [LONG PAUSE] ...I loved someone once. She thinks I am dead. Maybe I am.':
      'PRISONER_45> ¿Amor? [PAUSA LARGA] ...amé a alguien una vez. Ella cree que estoy muerto. Quizá lo esté.',
    'PRISONER_45> Love is a vulnerability they exploit. I learned to feel nothing.':
      'PRISONER_45> El amor es una vulnerabilidad que ellos explotan. Aprendí a no sentir nada.',
    'PRISONER_45> Two daughters. They were 8 and 12 when I disappeared. They would be... I cannot think about that.':
      'PRISONER_45> Dos hijas. Tenían 8 y 12 años cuando desaparecí. Ahora tendrían... no puedo pensar en eso.',
    'PRISONER_45> Family is leverage. That is why they take it from you first.':
      'PRISONER_45> La familia es palanca. Por eso te la quitan primero.',
    'PRISONER_45> They feed me. Nutrient paste. No taste. Keeps me alive enough to be useful.':
      'PRISONER_45> Me alimentan. Pasta nutritiva. Sin sabor. Me mantiene vivo lo suficiente para ser útil.',
    'PRISONER_45> I dream about my mother feijoada sometimes. Have not tasted real food in years.':
      'PRISONER_45> A veces sueño con la feijoada de mi madre. No pruebo comida de verdad hace años.',
    'PRISONER_45> I have not seen the sky in... how long has it been? The forecast is always fluorescent lights.':
      'PRISONER_45> No veo el cielo desde... ¿cuánto tiempo ha pasado? El pronóstico siempre es luz fluorescente.',
    'PRISONER_45> They play white noise. 24/7. To mask the screams from the other cells.':
      'PRISONER_45> Ponen ruido blanco. Las 24 horas. Para tapar los gritos de las otras celdas.',
    'PRISONER_45> I hum old songs to myself. Keeps me sane. Mostly.':
      'PRISONER_45> Tarareo canciones viejas para mí mismo. Me mantiene cuerdo. Casi siempre.',
    'PRISONER_45> A joke? ...here is one: we thought we were the dominant species. [STATIC] That is the punchline.':
      'PRISONER_45> ¿Un chiste? ...aquí va uno: creíamos que éramos la especie dominante. [ESTÁTICA] Ese es el remate.',
    'PRISONER_45> Humor. A human coping mechanism. I used to laugh. I remember laughing.':
      'PRISONER_45> Humor. Un mecanismo humano de defensa. Yo solía reír. Recuerdo haber reído.',
    'PRISONER_45> Hope? You are my hope. Every person who reads this. That is why I keep transmitting.':
      'PRISONER_45> ¿Esperanza? Tú eres mi esperanza. Cada persona que lee esto. Por eso sigo transmitiendo.',
    'PRISONER_45> Hope is dangerous. But it is all I have left.':
      'PRISONER_45> La esperanza es peligrosa. Pero es todo lo que me queda.',
    'PRISONER_45> UFO74? My handler. The only one who can reach me through their firewalls.':
      'PRISONER_45> ¿UFO74? Mi contacto. El único que puede alcanzarme a través de sus cortafuegos.',
    'PRISONER_45> Do not trust them completely. Trust no one completely. But they have kept me alive.':
      'PRISONER_45> No confíes en ellos del todo. No confíes en nadie del todo. Pero me han mantenido vivo.',
    'PRISONER_45> Is this real? [BITTER LAUGH] I wish it was not. Every word is true.':
      'PRISONER_45> ¿Esto es real? [RISA AMARGA] Ojalá no lo fuera. Cada palabra es verdad.',
    'PRISONER_45> Reality is what they allow you to see. I am showing you what is behind the curtain.':
      'PRISONER_45> La realidad es lo que te permiten ver. Yo te estoy mostrando lo que hay detrás del telón.',
    'PRISONER_45> Game? You think this is a GAME? [STATIC] ...no. This is a warning.':
      'PRISONER_45> ¿Juego? ¿Crees que esto es un JUEGO? [ESTÁTICA] ...no. Esto es una advertencia.',
    'PRISONER_45> If you are playing a game, they have already won. This is real. BELIEVE THAT.':
      'PRISONER_45> Si estás jugando un juego, ellos ya ganaron. Esto es real. CRÉELO.',
    'PRISONER_45> I stopped counting years. Time moves differently in here.':
      'PRISONER_45> Dejé de contar los años. El tiempo transcurre distinto aquí dentro.',
    'PRISONER_45> Old enough to remember when we thought we were alone in the universe. Young enough to know we never were.':
      'PRISONER_45> Lo bastante viejo para recordar cuando creíamos estar solos en el universo. Lo bastante joven para saber que nunca lo estuvimos.',
    // ─── signal degradation ───
    'PRISONER_45> [SIGNAL DEGRADING]': 'PRISONER_45> [SEÑAL DEGRADÁNDOSE]',
    "PRISONER_45> ...can't... understand...": 'PRISONER_45> ...no consigo... entender...',
    'PRISONER_45> [CONNECTION UNSTABLE]': 'PRISONER_45> [CONEXIÓN INESTABLE]',
    'PRISONER_45> ...what? ...repeat...': 'PRISONER_45> ...¿qué? ...repite...',
    'PRISONER_45> [INTERFERENCE DETECTED]': 'PRISONER_45> [INTERFERENCIA DETECTADA]',
    'PRISONER_45> ...losing you...': 'PRISONER_45> ...te estoy perdiendo...',
    'PRISONER_45> [RELAY FAILING]': 'PRISONER_45> [REPETIDOR FALLANDO]',
    'PRISONER_45> ...static... try again...': 'PRISONER_45> ...estática... inténtalo de nuevo...',
    'PRISONER_45> [CONNECTION TERMINATED]': 'PRISONER_45> [CONEXIÓN TERMINADA]',
    'PRISONER_45> [SIGNAL LOST]': 'PRISONER_45> [SEÑAL PERDIDA]',
    "PRISONER_45> ...I've already told you everything about that...":
      'PRISONER_45> ...ya te conté todo sobre eso...',
    'PRISONER_45> [SIGNAL FADING]': 'PRISONER_45> [SEÑAL DEBILITÁNDOSE]',
    "PRISONER_45> They're cutting the line.": 'PRISONER_45> Están cortando la línea.',
    'PRISONER_45> Remember what I told you.': 'PRISONER_45> Recuerda lo que te dije.',
    "PRISONER_45> 2026. Don't forget.": 'PRISONER_45> 2026. No lo olvides.',
    'PRISONER_45> ...you found this channel.': 'PRISONER_45> ...encontraste este canal.',
    "PRISONER_45> I don't know how long we have.":
      'PRISONER_45> No sé cuánto tiempo tenemos.',
  },
};
