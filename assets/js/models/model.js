// Txigital MVC - Model
// Owns application state, persistence helpers, constants, character data, mission data and academy data.

/* ══════════════════════════════════════════════
   STATE
══════════════════════════════════════════════ */
const S = {
  nome:'', num:'', email:'', dob:'', prov:'', lang:'Português', langCode:'pt', languageChosen:false, themeMode:'light',
  char:'', emoji:'', role:'',
  xp:0, lvl:1, savings:0, missions_done:0, correct:0, total_q:0, badges:0,
  doneMissions: new Set(),
  doneQuestions: new Set(), questionResults:{}, missionResults:{},
  currentTheme:'',
  quizQueue:[], quizIdx:0, quizSource:null
};

/* Level thresholds */
const LEVELS=[0,100,250,450,700,1000,1400,1900,2500,3200,4000];
const LEVEL_NAMES=['Iniciante','Aprendiz','Curioso','Esperto','Habilidoso','Confiante','Avançado','Expert','Mestre','Lenda'];

function xpToLevel(x){for(let i=LEVELS.length-1;i>=0;i--){if(x>=LEVELS[i])return i+1;}return 1;}
function xpForNext(l){return LEVELS[Math.min(l,LEVELS.length-1)];}
function lvlName(l){return LEVEL_NAMES[Math.min(l-1,LEVEL_NAMES.length-1)];}

const STORE_KEY='txigital_state_v7';
const I18N={pt:{home:'In\u00edcio',missions:'Miss\u00f5es',xitique:'Xitique',academy:'Academia',profile:'Perfil',themeAuto:'Automático',themeLight:'Claro',themeDark:'Escuro'},en:{home:'Home',missions:'Missions',xitique:'Xitique',academy:'Academy',profile:'Profile',themeAuto:'Automatic',themeLight:'Light',themeDark:'Dark'}};
const EN_PHRASES = [
  ['📚 Academia','📚 Academy'],['Qual é a vantagem de aceitar M-Pesa na tua banca?','What is the advantage of accepting M-Pesa at your stall?'],['Como verificas que um pagamento M-Pesa chegou antes de dar a mercadoria?','How do you verify that an M-Pesa payment arrived before handing over the goods?'],['A tua banca vendeu 8.000 MT mas os custos foram 5.200 MT. Qual é o teu lucro real?','Your stall sold 8,000 MT but costs were 5,200 MT. What is your real profit?'],['Quais são os 3 maiores riscos de ter muito dinheiro físico na banca?','What are the 3 biggest risks of keeping too much physical cash at the stall?'],['Qual é a vantagem de aceitar M-Pesa','What is the advantage of accepting M-Pesa'],['Como verificas que um pagamento M-Pesa chegou','How do you verify that an M-Pesa payment arrived'],['antes de dar a mercadoria','before handing over the goods'],['A tua banca vendeu','Your stall sold'],['mas os custos foram','but the costs were'],['Qual é o teu lucro real?','What is your real profit?'],['Quais são os 3 maiores riscos','What are the 3 biggest risks'],['ter muito dinheiro físico','keeping too much physical cash'],['na banca','at the stall'],['tua banca','your stall'],['mercadoria','goods'],['vantagem','advantage'],['chegou','arrived'],['custos','costs'],['lucro real','real profit'],['O Agente Suspeito','The Suspicious Agent'],['Um estranho quer o teu PIN M-Pesa...','A stranger wants your M-Pesa PIN...'],['O Salário de Outubro','October Salary'],['Como distribuir os 5.000 MT do mês?','How should you distribute the 5,000 MT this month?'],['Receber por M-Pesa na Banca','Receiving M-Pesa at the Stall'],['Uma cliente quer pagar via M-Pesa','A customer wants to pay via M-Pesa'],['Orçamento da Banca','Stall Budget'],['Planear as compras de stock do mês','Plan this month\'s stock purchases'],['O Empréstimo Rápido','The Fast Loan'],['Uma oferta suspeita de crédito fácil','A suspicious easy-credit offer'],['Meta de Poupança','Savings Goal'],['Poupar para expandir a banca','Save to expand the stall'],['Criar o Xitique Digital','Create the Digital Xitique'],['Organizar poupança em grupo com as amigas','Organize group savings with friends'],['Segurança no M-Pesa','M-Pesa Security'],['Desafio avançado de protecção da conta','Advanced account protection challenge'],['Orçamento','Budget'],['Pagamentos Digitais','Digital Payments'],['Prevenção de Fraudes','Fraud Prevention'],['Reembolso de Empréstimos','Loan Repayment'],['Vantagens Sem Dinheiro','Cashless Benefits'],['No Xitique, quando podes levantar o teu dinheiro?','In Xitique, when can you withdraw your money?'],['Como identificas uma nota de 500 MT falsa no mercado?','How do you identify a fake 500 MT note in the market?'],['Se aceitares M-Pesa na banca, como isso ajuda o teu negócio a crescer?','If you accept M-Pesa at the stall, how does it help your business grow?'],['O que é a Regra 50-30-20 aplicada ao teu negócio?','What is the 50-30-20 rule applied to your business?'],['Pediste 5.000 MT emprestado a uma amiga. Qual é a melhor forma de pagar?','You borrowed 5,000 MT from a friend. What is the best way to repay it?'],['Qual é o melhor hábito de poupança para renda irregular como a tua?','What is the best saving habit for irregular income like yours?'],['Em 5 anos queres abrir uma loja. Precisas de 80.000 MT. Quanto poupas por mês?','In 5 years you want to open a shop. You need 80,000 MT. How much should you save per month?'],['Um "fiscal do M-Pesa" pede para verificar a tua conta no local. O que fazes?','An "M-Pesa inspector" asks to verify your account on the spot. What do you do?'],['Recebeste 5.000 MT. Gastos fixos','You received 5,000 MT. Fixed expenses'],['O que fazes com o restante','What do you do with the remaining'],['Acabaste de vender capulanas','You just sold capulanas'],['Um homem diz','A man says'],['Qual é o processo correcto para receber?','What is the correct receiving process?'],['Escolhe a melhor resposta:','Choose the best answer:'],['Qual é a tua decisão?','What is your decision?'],['mês','month'],['negócio','business'],['dinheiro','money'],['poupar','save'],['Poupar','Save'],['poupança','savings'],['fraude','fraud'],['Fraudes','Fraud'],['conta','account'],['cliente','customer'],['mercado','market'],['banca','stall'],['amigas','friends'],['colegas','colleagues'],['universidade','university'],['propinas','tuition'],['bolsa','grant'],['pagamento','payment'],['pagamentos','payments'],['empréstimo','loan'],['dívida','debt'],['resposta','answer'],['pergunta','question'],['correcto','correct'],['Correcto','Correct'],['errada','wrong'],['ganhas','you earn'],['recebes','you receive'],['guardar','keep'],['separar','set aside'],['reportar','report'],['verificar','verify'],['seguro','safe'],['físico','physical'],['digital','Digital'],
  ['Bem-vindo de volta','Welcome back'],['Poupança','Savings'],['Nível','Level'],['Missão de Hoje','Today\'s Mission'],['Academia · Literacia Financeira','Academy · Financial Literacy'],['O Meu Xitique','My Xitique'],['Grupo Activo','Active Group'],['Bloqueado até fim do ciclo','Locked until the end of the cycle'],['Turno de','Turn for'],['Total Acumulado','Total Saved'],['membros','members'],['turnos','turns'],['mês','month'],['O valor fica','The amount stays'],['bloqueado','locked'],['até ao fim do ciclo para proteger todos os membros. Só o beneficiário do turno pode levantar.','until the end of the cycle to protect every member. Only the turn beneficiary can withdraw.'],['Contribuir via M-Pesa','Contribute with M-Pesa'],['Contribuição de','Contribution of'],['processada','processed'],['Comprovativo enviado por SMS.','Receipt sent by SMS.'],['Pagamentos em dia','Payments up to date'],['Atraso','Late'],['Próximo beneficiário','Next beneficiary'],['Aguarda turno','Waiting for turn'],['Pago','Paid'],['Próximo','Next'],['Aguarda','Waiting'],['recebido','received'],['contribuído','contributed'],['Lições para','Lessons for'],['Vendedora','Vendor'],['Motorista','Driver'],['Estudante','Student'],['Agricultor','Farmer'],['Aleatório','Random'],['Completo','Complete'],['Respondida','Answered'],['Escolhe a melhor resposta','Choose the best answer'],['Qual é a tua decisão','What is your decision'],['Pergunta','Question'],['Missão · Responde','Mission · Answer'],['Dica','Tip'],['Resposta revista','Reviewed answer'],['ganhos','earned'],['Sem XP desta vez','No XP this time'],['Melhor resposta','Best answer'],['Excelente','Excellent'],['Quase lá','Almost there'],['Resposta Errada','Wrong answer'],['Próxima pergunta','Next question'],['Próxima missão','Next mission'],['Terminar Sessão','Log out'],['Nível actual','Current level'],['Iniciante','Beginner'],['Aprendiz','Learner'],['Curioso','Curious'],['Esperto','Smart'],['Habilidoso','Skilled'],['Confiante','Confident'],['Avançado','Advanced'],['Mestre','Master'],['Lenda','Legend'],['missões','missions'],['Vendedora no Mercado Xiquelene, Maputo','Vendor at Xiquelene Market, Maputo'],['Início','Home'],['Missões','Missions'],['Perfil','Profile'],['Nome completo','Full name'],['Número M-Pesa','M-Pesa number'],['Data de Nascimento','Date of birth'],['Província (opcional)','Province (optional)'],['Província','Province'],['Informações Pessoais','Personal Information'],['Conta M-Pesa','M-Pesa Account'],['Saldo M-Pesa','M-Pesa Balance'],['Alterar PIN','Change PIN'],['Última alteração: 3 meses atrás','Last changed: 3 months ago'],['Histórico de Transações','Transaction History'],['Ver todas as movimentações','View all movements'],['Extrato Mensal','Monthly Statement'],['Descarregar PDF','Download PDF'],['Preferências','Preferences'],['Idioma','Language'],['Notificações','Notifications'],['Activadas','Enabled'],['Tema','Theme'],['Privacidade e Segurança','Privacy and Security'],['Gerir permissões','Manage permissions'],['Conquistas','Achievements'],['Os Meus Badges','My Badges'],['badges conquistados','badges earned'],['Estatísticas','Statistics'],['acertos','correct'],['Certificado de Literacia','Literacy Certificate'],['Badges conquistados:','Earned badges:'],['Ainda não conquistaste badges. Responde correctamente às missões e perguntas da Academia para desbloquear conquistas.','You have not earned badges yet. Answer missions and Academy questions correctly to unlock achievements.'],['Primeira Resposta','First Answer'],['Respondeste ao primeiro desafio.','You answered your first challenge.'],['Poupa Esperto','Smart Saver'],['Completaste 3 respostas correctas.','You completed 3 correct answers.'],['Guardião do PIN','PIN Guardian'],['Mostraste bons hábitos de segurança.','You showed good security habits.'],['Mestre do Xitique','Xitique Master'],['Avançaste nas missões de poupança em grupo.','You advanced in group savings missions.'],['Acertos','Correct'],['Errados','Wrong'],['Total respondido','Total answered'],['Taxa de acerto','Accuracy rate'],['Em progresso','In progress'],['Personagem RPG','RPG Character'],['Nível actual','Current level'],['Suporte','Support'],['Ajuda e FAQ','Help and FAQ'],['Linha do Cliente/M-Pesa','Customer/M-Pesa Support Line'],['Terminar Sessão','Log out'],['Trocar','Change'],['Claro','Light'],['Escuro','Dark'],['Automático','Automatic'],['Português','Portuguese'],['Criar Conta','Create Account'],['Preenche os teus dados para começar','Fill in your details to start'],['Nome Completo','Full Name'],['Número de Celular','Phone Number'],['Número M-Pesa','M-Pesa Number'],['Email (opcional)','Email (optional)'],['Data de Nascimento (opcional)','Date of Birth (optional)'],['Selecionar','Select'],['Continuar','Continue'],['Voltar','Back'],['Entrar','Sign in'],['Confirma os teus dados para continuar','Confirm your details to continue'],['Quem és tu','Who are you'],['Escolhe o teu personagem','Choose your character'],['Começar Jornada','Start Journey'],['Começar como','Start as'],['Vendedora no Mercado Xiquelene, Maputo','Vendor at Xiquelene Market, Maputo'],['Motorista de Chapa, Maputo','Minibus driver, Maputo'],['Estudante Universitária, ISUTC','ISUTC student'],['Agricultor em Gaza','Farmer in Gaza'],['Aprender sobre','Learn about'],['As tuas missões','Your missions'],['Missões de','Missions for'],['Fácil','Easy'],['Médio','Medium'],['Difícil','Hard'],['Expert','Expert'],['Certa','Correct'],['Revê a resposta','Review answer'],['Poupa com a tua comunidade','Save with your community'],['Aprende finanças jogando','Learn finance by playing'],['Cresce com o M-Pesa','Grow with M-Pesa'],['Integrado com','Integrated with'],['Seguro e Gratuito','Safe and Free'],['Vodacom/M-Pesa Moçambique','Vodacom/M-Pesa Mozambique'],['Moçambique','Mozambique'],['Começar Agora','Start Now'],['Já tenho conta','I already have an account']
];
function enText(value){
  if(value==null) return value;
  let out=String(value);
  [...EN_PHRASES].sort((a,b)=>b[0].length-a[0].length).forEach(([pt,en])=>{out=out.split(pt).join(en);});
  const terms=[
    ['Educação Financeira','Financial Education'],['Literacia Financeira','Financial Literacy'],['Lições','Lessons'],['Missão','Mission'],['Missões','Missions'],['Academia','Academy'],['Perfil','Profile'],['Início','Home'],['Quem és tu','Who are you'],['Escolhe o teu personagem','Choose your character'],['Criar Conta','Create Account'],['Entrar','Sign in'],['Preenche os teus dados para começar','Fill in your details to start'],['Confirma os teus dados para continuar','Confirm your details to continue'],
    ['Qual é','What is'],['Como','How'],['Quando','When'],['Quanto','How much'],['Quais são','What are'],['O que','What'],['Porquê','Why'],['porque','because'],['para','for'],['com','with'],['sem','without'],['antes de','before'],['depois de','after'],['durante','during'],['sempre','always'],['nunca','never'],['melhor','best'],['principal','main'],['primeiro','first'],['último','last'],['próximo','next'],['actual','current'],['todos','all'],['todas','all'],['cada','each'],
    ['tuas','your'],['teus','your'],['tua','your'],['teu','your'],['meu','my'],['minha','my'],['nossa','our'],['nosso','our'],['deles','their'],['delas','their'],
    ['dinheiro','money'],['físico','physical'],['digital','Digital'],['poupança','savings'],['poupar','save'],['guardar','save'],['gastar','spend'],['pagamento','payment'],['pagamentos','payments'],['pagar','pay'],['receber','receive'],['recebeste','you received'],['recebes','you receive'],['recebeu','received'],['ganhas','you earn'],['ganhou','earned'],['saldo','balance'],['comprovativo','receipt'],['PIN','PIN'],['SIM','SIM'],
    ['orçamento','budget'],['renda','income'],['despesas','expenses'],['custos','costs'],['lucro','profit'],['dívida','debt'],['empréstimo','loan'],['juros','interest'],['banco','bank'],['microfinanceiras','microfinance institutions'],['crédito','credit'],['taxa','fee'],['bolsa','grant'],['propinas','tuition'],['tese','thesis'],['formatura','graduation'],
    ['fraude','fraud'],['golpe','scam'],['suspeito','suspicious'],['suspeita','suspicious'],['segurança','security'],['seguro','safe'],['proteger','protect'],['reportar','report'],['apagar','delete'],['recusar','refuse'],['verificar','verify'],['confirmar','confirm'],['identificação','identification'],['oficial','official'],['secretaria','secretariat'],
    ['mercado','market'],['banca','stall'],['stock','stock'],['cliente','customer'],['clientes','customers'],['capulana','capulana'],['capulanas','capulanas'],['mercadoria','goods'],['loja','shop'],['negócio','business'],['expandir','expand'],['vender','sell'],['vendas','sales'],['compras','purchases'],['comprar','buy'],
    ['xitique','Xitique'],['grupo','group'],['membros','members'],['turno','turn'],['beneficiário','beneficiary'],['contribuição','contribution'],['contribuir','contribute'],['contribuído','contributed'],['levantamento','withdrawal'],['levantar','withdraw'],['bloqueado','locked'],['ciclo','cycle'],['transparência','transparency'],['registo','record'],['registos','records'],['automático','automatic'],
    ['motorista','driver'],['chapa','minibus'],['combustível','fuel'],['rotas','routes'],['passageiro','passenger'],['colegas','colleagues'],['estudante','student'],['universidade','university'],['faculdade','college'],['agricultor','farmer'],['agricultores','farmers'],['machamba','farm'],['colheita','harvest'],['seca','drought'],['sementes','seeds'],['tractor','tractor'],['compradores','buyers'],['intermediário','middleman'],
    ['Fácil','Easy'],['Médio','Medium'],['Difícil','Hard'],['Resposta Errada','Wrong Answer'],['Resposta revista','Reviewed answer'],['Melhor resposta','Best answer'],['Respondida','Answered'],['Completo','Complete'],['Certa','Correct'],['ganhos','earned'],['Sem XP desta vez','No XP this time'],['Dica','Tip'],['Excelente','Excellent'],['Quase lá','Almost there'],['Escolhe a melhor resposta','Choose the best answer'],['Qual é a tua decisão','What is your decision'],
    ['Número de Celular','Phone Number'],['Número M-Pesa','M-Pesa Number'],['Nome Completo','Full Name'],['Email opcional','Email optional'],['Data de Nascimento','Date of Birth'],['Província (opcional)','Province (optional)'],['Província','Province'],['Selecionar','Select'],['Continuar','Continue'],['Voltar','Back'],['Começar Agora','Start Now'],['Já tenho conta','I already have an account'],['Começar Jornada','Start Journey'],['Trocar','Change'],['Suporte','Support'],['Ajuda','Help'],['Notificações','Notifications'],['Activadas','Enabled'],['Tema','Theme'],['Claro','Light'],['Escuro','Dark'],['Idioma','Language'],['Privacidade','Privacy'],['Conquistas','Achievements'],['Estatísticas','Statistics'],['Certificado','Certificate'],['Em progresso','In progress']
  ];
  const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  terms.sort((a,b)=>b[0].length-a[0].length).forEach(([pt,en])=>{const re=new RegExp('(^|[^A-Za-zÀ-ÿ])'+esc(pt)+'(?=$|[^A-Za-zÀ-ÿ])','gi');out=out.replace(re,(m,p)=>p+en);});
  return out;
}
function txt(value){return S.langCode==='en'?enText(value):value;}
function isEnglish(){return S.langCode==='en';}
function challengeText(item){
  if(!isEnglish()) return item.q;
  const theme=enText(item.theme||item.qkey||'financial literacy');
  return 'Financial challenge: choose the safest and smartest option for this '+theme+' scenario.';
}
function missionContextText(m){
  if(!isEnglish()) return m.ctx;
  return 'Read this real-life financial situation carefully. Protect your money, your records and your M-Pesa PIN.';
}
function missionQuoteText(m){
  if(!isEnglish()) return m.quote||'';
  return 'What is the safest decision?';
}
function choiceText(c){
  if(!isEnglish()) return c.t;
  if(c.type==='best') return 'Choose the safe, verified and transparent option.';
  if(c.type==='mid') return 'Be cautious, but check if this still leaves risk.';
  return 'Take the risky option without proper verification.';
}
function feedbackText(raw,type){
  if(!isEnglish()) return raw||'';
  if(type==='best') return 'Excellent. You chose the safest option: verify information, protect your PIN and keep a clear record of the transaction.';
  if(type==='mid') return 'Almost there. Your caution helps, but the safest choice is the one that verifies the source and avoids unnecessary risk.';
  return 'This option is risky. The safest answer protects your money, avoids sharing private data and uses verified M-Pesa records.';
}
function localizeElementText(root=document){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){return n.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});
  const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(n=>{
    if(n._ptText===undefined) n._ptText=n.nodeValue;
    n.nodeValue=S.langCode==='en'?enText(n._ptText):n._ptText;
  });
  document.documentElement.lang=S.langCode==='en'?'en':'pt';
}
function normalizePhone(raw){
  const digits=String(raw||'').replace(/\D/g,'');
  if(digits.startsWith('258') && digits.length===12) return digits.slice(3);
  return digits;
}
function isVodacomPhone(raw){return /^(84|85)\d{7}$/.test(normalizePhone(raw));}
function formatPhone(raw){const d=normalizePhone(raw);return '+258 '+d.slice(0,2)+' '+d.slice(2,5)+' '+d.slice(5);}
function parseMozDate(raw){
  const v=String(raw||'').trim();
  if(!v) return {ok:true,value:''};
  const iso=v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const m=iso?[iso[0],iso[3],iso[2],iso[1]]:v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if(!m) return {ok:false,msg:'Usa o formato dd/mm/aaaa.'};
  const day=Number(m[1]), month=Number(m[2]), year=Number(m[3]);
  const date=new Date(year,month-1,day);
  if(date.getFullYear()!==year||date.getMonth()!==month-1||date.getDate()!==day) return {ok:false,msg:'A data indicada não existe no calendário.'};
  const today=new Date(); today.setHours(0,0,0,0);
  if(date>today) return {ok:false,msg:'A data não pode ser superior à data actual.'};
  return {ok:true,value:m[1]+'/'+m[2]+'/'+m[3]};
}
function mozDateToIso(value){
  const m=String(value||'').match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return m?m[3]+'-'+m[2]+'-'+m[1]:'';
}
function todayIso(){
  const d=new Date();
  const mm=String(d.getMonth()+1).padStart(2,'0');
  const dd=String(d.getDate()).padStart(2,'0');
  return d.getFullYear()+'-'+mm+'-'+dd;
}
function pickDateWithCalendar(){
  const input=document.createElement('input');
  input.type='date';
  input.max=todayIso();
  input.value=mozDateToIso(S.dob);
  input.style.position='fixed';
  input.style.left='50%';
  input.style.top='50%';
  input.style.transform='translate(-50%,-50%)';
  input.style.zIndex='9999';
  input.style.opacity='0.01';
  document.body.appendChild(input);
  const done=()=>{
    if(input.value){
      const dob=parseMozDate(input.value);
      if(!dob.ok){alert(dob.msg);}else{S.dob=dob.value;saveState();renderProfile();}
    }
    setTimeout(()=>input.remove(),150);
  };
  input.addEventListener('change',done,{once:true});
  input.addEventListener('blur',()=>setTimeout(()=>input.remove(),250),{once:true});
  input.showPicker?.();
  input.focus();
}
function nextMission(){
  const mis=MISSIONS[S.char]||MISSIONS.Ana;
  const next=mis.findIndex((_,i)=>!S.doneMissions.has(i));
  if(next>=0){doMission(next);return;}
  nav('s-missions');
}
function nextAcademiaQuestion(){
  const ids=Object.keys(acPool);
  const next=ids.find(id=>!S.doneQuestions.has(id));
  if(next){startAcQ(next);return;}
  nav('s-academia');
}

function shuffle(arr){return [...arr].sort(()=>Math.random()-.5);}
function saveState(){const plain={...S,doneMissions:[...S.doneMissions],doneQuestions:[...S.doneQuestions]};localStorage.setItem(STORE_KEY,JSON.stringify(plain));}
function loadState(){try{const raw=localStorage.getItem(STORE_KEY);if(!raw)return;const data=JSON.parse(raw);Object.assign(S,data);if(!data.languageChosen){S.langCode='pt';S.lang='Português';S.languageChosen=false;}if(!data.themeChosen){S.themeMode='light';S.themeChosen=false;}S.doneMissions=new Set(data.doneMissions||[]);S.doneQuestions=new Set(data.doneQuestions||[]);S.questionResults=data.questionResults||{};S.missionResults=data.missionResults||{};}catch(e){}}
function isNightNow(){const h=new Date().getHours();return h<6||h>=18;}
function applyTheme(){document.body.classList.toggle('theme-dark',S.themeMode==='dark'||(S.themeMode==='auto'&&isNightNow()));}
function applyLanguage(){const t=I18N[S.langCode||'pt']||I18N.pt;document.querySelectorAll('.ni-lb').forEach(lb=>{const v=lb.textContent.trim().toLowerCase();if(v.includes('in')||v==='home')lb.textContent=t.home;else if(v.includes('miss')||v==='missions')lb.textContent=t.missions;else if(v.includes('xitique'))lb.textContent=t.xitique;else if(v.includes('academ')||v==='academy')lb.textContent=t.academy;else if(v.includes('perfil')||v==='profile')lb.textContent=t.profile;});const pLang=document.getElementById('p-lang');if(pLang)pLang.textContent=S.langCode==='en'?'English':'Português';const pTheme=document.getElementById('p-theme');if(pTheme)pTheme.textContent=S.themeMode==='dark'?t.themeDark:S.themeMode==='light'?t.themeLight:t.themeAuto;document.getElementById('lang-pt')?.classList.toggle('on',S.langCode!=='en');document.getElementById('lang-en')?.classList.toggle('on',S.langCode==='en');['light','dark','auto'].forEach(m=>document.getElementById('theme-'+m)?.classList.toggle('on',S.themeMode===m));localizeElementText();}
function setLanguage(code){S.langCode=code;S.lang=code==='en'?'English':'Português';S.languageChosen=true;saveState();nav(document.querySelector('.scr.on')?.id||'s-dash');applyLanguage();}
function setThemeMode(mode){S.themeMode=mode;S.themeChosen=true;saveState();applyTheme();renderProfile();}
function logout(){saveState();document.querySelectorAll('#s-register input,#s-login input').forEach(i=>i.value='');go('s-splash');}
setInterval(()=>{if(S.themeMode==='auto')applyTheme();},60000);

/* ══════════════════════════════════════════════
   CHARACTER DATA
══════════════════════════════════════════════ */
const CHARS = {
  Ana:   {emoji:'👩🏾', role:'Vendedora no Mercado Xiquelene, Maputo', savings:[1800,2200,2600,3100], lvl:[2,3,4,5], xp:[180,260,370,440]},
  Carlos:{emoji:'🚌',  role:'Motorista de Chapa, Maputo',              savings:[1200,1600,2000,2400], lvl:[1,2,3,4], xp:[80,160,240,360]},
  Fátima:{emoji:'👩‍🎓', role:'Estudante Universitária, ISUTC',            savings:[500,800,1200,1600],  lvl:[1,2,2,3], xp:[50,130,210,330]},
  João:  {emoji:'🌾',  role:'Agricultor em Gaza',                      savings:[3000,4500,6000,8000], lvl:[3,4,5,6], xp:[310,490,720,980]}
};

function randomCharStats(char){
  const d=CHARS[char], i=Math.floor(Math.random()*4);
  return {savings:d.savings[i], lvl:d.lvl[i], xp:d.xp[i]};
}

/* ══════════════════════════════════════════════
   XITIQUE DATA
══════════════════════════════════════════════ */
const XI_MEMBERS = {
  Ana:  [{em:'👩',n:'Ana (Tu)',st:'paid',recv:true},{em:'👩🏾',n:'Lurdes',st:'next'},{em:'👩🏿',n:'Graça',st:'late',late:2},{em:'👧',n:'Sónia',st:'paid'},{em:'👩‍🦱',n:'Beatriz',st:'wait'},{em:'👴',n:'Custódio',st:'paid',recv:true},{em:'👩‍🦳',n:'Felizarda',st:'wait'},{em:'👦',n:'Mário',st:'paid',recv:true}],
  Carlos:[{em:'🧔',n:'Carlos (Tu)',st:'paid',recv:true},{em:'👨🏾',n:'Abílio',st:'next'},{em:'👩',n:'Conceição',st:'paid'},{em:'👴',n:'Germano',st:'late',late:1},{em:'👨‍🦱',n:'Nilton',st:'wait'},{em:'👩🏿',n:'Esperança',st:'paid',recv:true}],
  Fátima:[{em:'👩‍🎓',n:'Fátima (Tu)',st:'wait'},{em:'👨‍🎓',n:'Hélder',st:'paid',recv:true},{em:'👩🏾',n:'Inês',st:'next'},{em:'👨🏿',n:'Jacinto',st:'late',late:1},{em:'👩',n:'Kátia',st:'paid'},{em:'👦',n:'Leandro',st:'wait'}],
  João:  [{em:'🌾',n:'João (Tu)',st:'paid',recv:true},{em:'👩',n:'Maria',st:'paid'},{em:'👴',n:'Albino',st:'next'},{em:'👩🏾',n:'Dina',st:'late',late:2},{em:'👨‍🦳',n:'Ernesto',st:'paid',recv:true},{em:'👩🏿',n:'Filipa',st:'wait'},{em:'👦',n:'Gerson',st:'paid'}]
};
const XI_AMOUNTS={Ana:500,Carlos:400,Fátima:250,João:1500};
const XI_CYCLES={Ana:8,Carlos:6,Fátima:6,João:7};
const XI_TURNS={Ana:5,Carlos:3,Fátima:2,João:4};

/* ══════════════════════════════════════════════
   MISSIONS DATA
══════════════════════════════════════════════ */
const MISSIONS = {
  Ana:[
    {ic:'🛡️',t:'O Agente Suspeito',s:'Um estranho quer o teu PIN M-Pesa...',xp:50,diff:'Fácil',qkey:'fraudes',
     ctx:'Acabaste de vender capulanas no Xiquelene e tens 3.000 MT. Um homem diz:',quote:'"Mana, sou agente M-Pesa. Dá-me o SIM e PIN por 5 minutos — oferta especial Vodacom!"',
     choices:[{em:'📱',t:'Dar o SIM e PIN — parece legítimo',xp:0,type:'bad',tip:'GOLPE! Agentes M-Pesa nunca pedem o teu SIM ou PIN. Reporta ao 84111.'},
              {em:'🤔',t:'Pedir cartão de identificação primeiro',xp:20,type:'mid',tip:'Boa cautela, mas documentos podem ser falsos. A regra é: ninguém pede o PIN, jamais!'},
              {em:'🛡️',t:'Recusar — agentes nunca pedem SIM nem PIN!',xp:50,type:'best',tip:'Correcto! O M-Pesa NUNCA pede o teu PIN. Recusa e reporta ao 84111.'}]},
    {ic:'💵',t:'O Salário de Outubro',s:'Como distribuir os 5.000 MT do mês?',xp:60,diff:'Fácil',qkey:'orçamento',
     ctx:'Recebeste 5.000 MT. Gastos fixos: renda 1.500, comida 1.200, transporte 600. Dívida pendente: 500 MT.',quote:'O que fazes com o restante 1.200 MT?',
     choices:[{em:'🎉',t:'Gastar tudo — mereces! Poupas no próximo mês',xp:0,type:'bad',tip:'Adiar poupança cria um ciclo perigoso. Mesmo 200 MT/mês acumulam muito!'},
              {em:'💸',t:'Pagar metade da dívida e guardar o resto em casa',xp:25,type:'mid',tip:'Pagar parte da dívida é bom, mas dinheiro em casa gasta-se facilmente!'},
              {em:'📊',t:'Pagar a dívida (500 MT) e poupar o resto no M-Pesa',xp:60,type:'best',tip:'Perfeito! Pagar dívidas mantém a tua reputação e poupar no M-Pesa cria histórico!'}]},
    {ic:'📱',t:'Receber por M-Pesa na Banca',s:'Uma cliente quer pagar via M-Pesa',xp:70,diff:'Médio',qkey:'mpesa',
     ctx:'Uma cliente quer pagar 800 MT pela capulana por M-Pesa. É a primeira vez que recebes assim.',quote:'Qual é o processo correcto para receber?',
     choices:[{em:'❌',t:'Recusar — não confio em dinheiro digital',xp:0,type:'bad',tip:'Recusar pagamentos digitais perde clientes! O M-Pesa é seguro e confirmado instantaneamente.'},
              {em:'🤷',t:'Dar o número e esperar sem verificar',xp:30,type:'mid',tip:'Receber é correcto, mas SEMPRE verifica o SMS de confirmação antes de entregar a mercadoria!'},
              {em:'📲',t:'Dar o número, aguardar SMS de confirmação, depois entregar',xp:70,type:'best',tip:'Perfeito! Só entregues a mercadoria DEPOIS de receber o SMS "Recebeu X MT de Y". Nunca antes!'}]},
    {ic:'📊',t:'Orçamento da Banca',s:'Planear as compras de stock do mês',xp:80,diff:'Médio',qkey:'orçamento',
     ctx:'A tua banca vendeu 8.000 MT este mês. Compras de stock custaram 5.500 MT. Queres expandir o negócio.',quote:'Como usas os 2.500 MT de margem?',
     choices:[{em:'🛍️',t:'Comprar mais stock imediatamente com tudo',xp:20,type:'mid',tip:'Reinvestir é bom, mas sem reserva de emergência qualquer imprevisto pode fechar o negócio!'},
              {em:'💰',t:'Guardar tudo em casa até decidir',xp:0,type:'bad',tip:'Dinheiro em casa não cresce e pode ser perdido. Usa o M-Pesa para guardar e planear!'},
              {em:'📈',t:'Separar: 1.500 MT stock + 1.000 MT poupança de emergência',xp:80,type:'best',tip:'Excelente! Reinvestir parte e guardar outra é o equilíbrio perfeito de um negócio saudável!'}]},
    {ic:'🎣',t:'O Empréstimo Rápido',s:'Uma oferta suspeita de crédito fácil',xp:100,diff:'Difícil',qkey:'fraudes',
     ctx:'Alguém online oferece: "Empréstimo 10.000 MT hoje! Sem banco. Envias 500 MT de taxa primeiro."',quote:'O que fazes?',
     choices:[{em:'💸',t:'Enviar os 500 MT — preciso do dinheiro',xp:0,type:'bad',tip:'GOLPE CLÁSSICO! Nunca pagares taxa antecipada para receber empréstimo. É sempre fraude!'},
              {em:'🤔',t:'Pedir mais detalhes antes de enviar',xp:30,type:'mid',tip:'Precaução é boa, mas o golpista tem respostas prontas. Regra: nunca pagares para receber!'},
              {em:'🗑️',t:'Recusar e reportar ao 84111',xp:100,type:'best',tip:'Correcto! Taxa antecipada = golpe garantido. Procura microfinanceiras licenciadas pelo BM!'}]},
    {ic:'🌱',t:'Meta de Poupança',s:'Poupar para expandir a banca',xp:90,diff:'Médio',qkey:'poupança',
     ctx:'Queres ter uma banca maior em 1 ano. Precisas de 15.000 MT para stock inicial.',quote:'Qual é a melhor estratégia de poupança?',
     choices:[{em:'😴',t:'Esperar ter mais dinheiro para começar a poupar',xp:0,type:'bad',tip:'O momento ideal raramente chega. 1.250 MT/mês durante 12 meses = 15.000 MT!'},
              {em:'💰',t:'Poupar quando sobrar dinheiro no fim do mês',xp:30,type:'mid',tip:'Poupar sobras funciona, mas é irregular. O método "paga-te primeiro" é muito mais eficaz!'},
              {em:'📅',t:'Separar 1.250 MT PRIMEIRO assim que receber, todos os meses',xp:90,type:'best',tip:'Perfeito! "Paga-te primeiro" — antes de qualquer despesa. Em 12 meses tens os 15.000 MT!'}]},
    {ic:'🏦',t:'Criar o Xitique Digital',s:'Organizar poupança em grupo com as amigas',xp:80,diff:'Médio',qkey:'xitique',
     ctx:'Tens 7 amigas no bairro. Cada uma pode poupar 500 MT/mês. Querem fazer um Xitique.',quote:'Qual a melhor forma de organizar?',
     choices:[{em:'💰',t:'Uma pessoa fica com todo o dinheiro em casa',xp:0,type:'bad',tip:'Concentrar o dinheiro numa pessoa cria risco de fraude e conflitos sérios!'},
              {em:'📋',t:'Acordo verbal entre amigas — a amizade garante',xp:25,type:'mid',tip:'Amizade ajuda, mas acordos verbais criam conflitos. Um sistema digital protege as amizades!'},
              {em:'📱',t:'Usar o Txigital — Xitique Digital via M-Pesa com regras claras',xp:80,type:'best',tip:'Perfeito! Transparência total, registos automáticos e dinheiro seguro para todas!'}]},
    {ic:'🔐',t:'Segurança no M-Pesa',s:'Desafio avançado de protecção da conta',xp:120,diff:'Expert',qkey:'fraudes',
     ctx:'Recebes SMS: "Parabéns! Ganhou 50.000 MT M-Pesa. Confirme PIN respondendo: PIN: ____"',quote:'O que fazes?',
     choices:[{em:'📩',t:'Responder com o PIN — M-Pesa é de confiança!',xp:0,type:'bad',tip:'PHISHING! O M-Pesa NUNCA pede PIN por SMS. Apaga e reporta!'},
              {em:'📞',t:'Ligar à Vodacom para confirmar se é real',xp:40,type:'mid',tip:'Bom instinto! Mas a Vodacom vai confirmar que é fraude. A regra é mais simples: M-Pesa nunca pede PIN!'},
              {em:'🗑️',t:'Apagar e reportar ao 84111',xp:120,type:'best',tip:'Expert! M-Pesa nunca pede PINs por SMS. Partilha esta dica com toda a família!'}]}
  ],
  Carlos:[
    {ic:'⛽',t:'O Combustível do Mês',s:'Gerir as despesas variáveis do chapa',xp:60,diff:'Fácil',qkey:'orçamento',
     ctx:'Gastas 1.500 MT/mês em combustível e ganhas em média 8.000 MT. Outubro foi fraco — só 6.000 MT.',quote:'Como ajustas o orçamento num mês fraco?',
     choices:[{em:'😰',t:'Cortar na comida para pagar o combustível',xp:0,type:'bad',tip:'Nunca sacrifiques saúde por negócio! Reduz rotas menos rentáveis e optimiza percursos.'},
              {em:'💸',t:'Usar as poupanças para cobrir a diferença',xp:30,type:'mid',tip:'Usar poupanças é uma opção, mas para isso elas devem existir! Cria um fundo de emergência.'},
              {em:'📊',t:'Reduzir rotas longas, usar fundo de emergência',xp:60,type:'best',tip:'Correcto! Optimizar rotas + reserva de emergência é o plano de um motorista inteligente!'}]},
    {ic:'🛡️',t:'O Passageiro Suspeito',s:'Um passageiro pede para trocar dinheiro',xp:70,diff:'Médio',qkey:'fraudes',
     ctx:'Um passageiro diz: "Tenho 2.000 MT em notas grandes. Podes trocar pelo teu M-Pesa? Eu envio-te e tu dás-me o dinheiro."',quote:'O que fazes?',
     choices:[{em:'🤝',t:'Aceitar — parece uma transação simples',xp:0,type:'bad',tip:'GOLPE! Pode enviar dinheiro roubado ou usar uma conta falsa. Nunca faças troco de dinheiro digital!'},
              {em:'🤔',t:'Verificar se o passageiro parece de confiança',xp:20,type:'mid',tip:'Aparência não garante honestidade. A regra é não fazer este tipo de troca com desconhecidos!'},
              {em:'🚫',t:'Recusar educadamente — não faço trocas no chapa',xp:70,type:'best',tip:'Correcto! Trocar dinheiro com estranhos expõe-te a vários tipos de fraude. Proteges-te bem!'}]},
    {ic:'📱',t:'Pagar Combustível por M-Pesa',s:'Abandonar o dinheiro físico nas paragens',xp:80,diff:'Médio',qkey:'mpesa',
     ctx:'A bomba de combustível passou a aceitar M-Pesa. O teu colega prefere continuar com dinheiro físico.',quote:'Qual é a melhor opção para ti?',
     choices:[{em:'💵',t:'Continuar com dinheiro físico — mais fácil',xp:0,type:'bad',tip:'Dinheiro físico no chapa atrai roubos e é mais difícil de controlar. M-Pesa é mais seguro!'},
              {em:'📱',t:'Usar M-Pesa apenas às vezes quando não tenho troco',xp:25,type:'mid',tip:'Boa transição! Mas usar M-Pesa sempre dá-te registos de todas as despesas automaticamente.'},
              {em:'💳',t:'Mudar totalmente para M-Pesa — mais seguro e com registo',xp:80,type:'best',tip:'Excelente! Sem dinheiro físico no chapa = menos risco de roubo + registo automático de gastos!'}]},
    {ic:'🚗',t:'Poupar para o Chapa Próprio',s:'Meta de 3 anos para ter o próprio veículo',xp:100,diff:'Difícil',qkey:'poupança',
     ctx:'Um chapa usado custa 350.000 MT. Actualmente alugas um por 3.000 MT/mês. Ganhas 8.000 MT/mês.',quote:'Qual é o plano de poupança realista?',
     choices:[{em:'😔',t:'Impossível — nunca conseguirei juntar tanto',xp:0,type:'bad',tip:'Impossível é uma palavra forte! 2.000 MT/mês × 36 meses = 72.000 MT. Com Xitique chega-se mais rápido!'},
              {em:'💰',t:'Poupar quando sobrar no fim do mês',xp:30,type:'mid',tip:'Poupar sobras é inconsistente. Define um valor fixo mensal e automatiza a poupança no M-Pesa!'},
              {em:'📅',t:'Poupar 2.000 MT fixos/mês + Xitique com colegas',xp:100,type:'best',tip:'Estratégia inteligente! Em 3 anos com poupança regular + Xitique do grupo atinges a meta!'}]},
    {ic:'📊',t:'Orçamento de Renda Variável',s:'Como planear com ganhos que mudam cada dia',xp:90,diff:'Difícil',qkey:'orçamento',
     ctx:'Em Janeiro ganhas 10.000 MT, em Fevereiro 6.000 MT. As despesas fixas são sempre 4.500 MT.',quote:'Como crias um orçamento estável com renda variável?',
     choices:[{em:'🎉',t:'Gastar mais nos meses bons e ajustar nos fracos',xp:15,type:'mid',tip:'Gastar mais nos meses bons cria dependência de renda alta. Estabilidade exige disciplina constante!'},
              {em:'😰',t:'Não é possível ter orçamento com renda variável',xp:0,type:'bad',tip:'É possível! Usa a média dos últimos 6 meses como base do orçamento. Meses bons = poupança extra!'},
              {em:'📈',t:'Calcular média mensal e usar como base fixa do orçamento',xp:90,type:'best',tip:'Perfeito! Média de 8.000 MT → orçamento base. Meses acima da média vão directo para poupança!'}]},
    {ic:'🎣',t:'Empréstimo para Reparação',s:'O chapa precisa de reparação urgente',xp:80,diff:'Médio',qkey:'xitique',
     ctx:'O chapa avariou e a reparação custa 15.000 MT. Não tens todo o dinheiro. Tens 2 opções: banco (15% juro) ou Xitique do grupo.',quote:'Qual é a melhor opção?',
     choices:[{em:'🏦',t:'Banco — mais formal e seguro',xp:25,type:'mid',tip:'Banco é formal, mas 15% de juro = mais 2.250 MT extra a pagar. O Xitique pode ser mais barato!'},
              {em:'💸',t:'Pedir emprestado a qualquer pessoa rapidamente',xp:0,type:'bad',tip:'Empréstimos informais sem regras claras criam conflitos. Sempre formaliza qualquer empréstimo!'},
              {em:'🏦',t:'Usar o Xitique do grupo — sem juros, com confiança',xp:80,type:'best',tip:'Excelente! O Xitique do grupo resolve a emergência sem juros bancários. É para isso que existe!'}]},
    {ic:'🔐',t:'Segurança no Trabalho',s:'Proteger os ganhos diários do chapa',xp:70,diff:'Médio',qkey:'fraudes',
     ctx:'No fim do dia tens 800 MT em dinheiro físico no chapa. É perigoso andar com tanto dinheiro.',quote:'Como proteges os teus ganhos diários?',
     choices:[{em:'🏠',t:'Guardar em casa numa caixa escondida',xp:15,type:'mid',tip:'Em casa é mais seguro que no chapa, mas continua vulnerável. Deposita regularmente no M-Pesa!'},
              {em:'👜',t:'Continuar com dinheiro físico no chapa',xp:0,type:'bad',tip:'Dinheiro físico no chapa atrai riscos de roubo. Deposita no M-Pesa diariamente!'},
              {em:'📱',t:'Depositar no M-Pesa diariamente no fim do turno',xp:70,type:'best',tip:'Hábito de ouro! Depositar diariamente no M-Pesa protege os teus ganhos e cria histórico!'}]},
    {ic:'🌱',t:'Fundo de Emergência',s:'Preparar-se para imprevistos do negócio',xp:110,diff:'Expert',qkey:'poupança',
     ctx:'O teu chapa pode avariar a qualquer momento. Uma reparação grande pode custar 20.000 MT.',quote:'Como crias um fundo de emergência eficaz?',
     choices:[{em:'😴',t:'Pensar nisso quando acontecer — agora está bem',xp:0,type:'bad',tip:'Imprevistos não avisam! Sem fundo de emergência, uma avaria pode parar o negócio por meses.'},
              {em:'💰',t:'Guardar o que sobrar em casa para emergências',xp:35,type:'mid',tip:'Boa intenção, mas em casa gasta-se! Separa uma conta M-Pesa só para emergências.'},
              {em:'🎯',t:'Separar 1.000 MT/mês numa conta M-Pesa separada',xp:110,type:'best',tip:'Expert! Em 20 meses tens 20.000 MT protegidos. Uma conta separada evita tentação de gastar!'}]}
  ],
  Fátima:[
    {ic:'📚',t:'O Orçamento da Bolsa',s:'Gerir 3.500 MT/mês de forma inteligente',xp:50,diff:'Fácil',qkey:'orçamento',
     ctx:'A tua bolsa é 3.500 MT/mês. Propinas: 500 MT. Comida: 1.200 MT. Transporte: 300 MT.',quote:'Como usas os 1.500 MT restantes?',
     choices:[{em:'🎉',t:'Gastar em lazer — és jovem, aproveita!',xp:0,type:'bad',tip:'Lazer é importante, mas sem poupança qualquer emergência académica será um problema!'},
              {em:'📖',t:'Guardar 500 MT e usar o resto em material escolar',xp:25,type:'mid',tip:'Bom equilíbrio entre necessidades e poupança. Mas 500 MT/mês pode ser insuficiente para emergências!'},
              {em:'💰',t:'Poupar 800 MT no M-Pesa e 700 MT para material + lazer',xp:50,type:'best',tip:'Excelente gestão! 800 MT/mês × 12 = 9.600 MT/ano. Pagas um semestre sem preocupações!'}]},
    {ic:'⚠️',t:'A Oportunidade de Investimento',s:'Uma promessa de duplicar o dinheiro',xp:80,diff:'Médio',qkey:'fraudes',
     ctx:'Um colega diz: "Investimento garantido! Metes 5.000 MT e em 30 dias recebes 10.000 MT!"',quote:'O que fazes?',
     choices:[{em:'💸',t:'Investir — retorno de 100% em 30 dias parece óptimo!',xp:0,type:'bad',tip:'GOLPE PIRÂMIDE! Retornos impossíveis (100% em 30 dias) são sempre fraude. Nunca invistas assim!'},
              {em:'🤔',t:'Pedir mais informações e pensar durante uns dias',xp:30,type:'mid',tip:'Precaução é boa, mas o golpista tem respostas para tudo. Retornos de 100% em 30 dias = sempre golpe!'},
              {em:'🛡️',t:'Recusar — retornos de 100% em 30 dias são sempre golpe',xp:80,type:'best',tip:'Correcto! Investimentos legítimos nunca prometem retornos garantidos absurdos. Investe só em instituições licenciadas!'}]},
    {ic:'📱',t:'Pagar Propinas por M-Pesa',s:'Aprender a usar pagamentos digitais na ISUTC',xp:70,diff:'Fácil',qkey:'mpesa',
     ctx:'A ISUTC passou a aceitar pagamento de propinas por M-Pesa. É mais fácil do que ir ao banco.',quote:'Qual é o processo correcto?',
     choices:[{em:'🏦',t:'Continuar a ir ao banco — mais seguro',xp:15,type:'mid',tip:'Banco funciona, mas M-Pesa é mais rápido, sem filas e com comprovativo instantâneo!'},
              {em:'📱',t:'Pagar por M-Pesa sem verificar o número da ISUTC primeiro',xp:20,type:'mid',tip:'M-Pesa é correcto, mas SEMPRE verifica o número oficial da ISUTC antes de pagar!'},
              {em:'✅',t:'Verificar número oficial ISUTC no site, depois pagar por M-Pesa',xp:70,type:'best',tip:'Perfeito! Verificar o número oficial antes de pagar protege-te de fraudes. Guarda o número verificado!'}]},
    {ic:'🎓',t:'Poupança para o Último Ano',s:'Preparar as despesas da tese e formatura',xp:90,diff:'Difícil',qkey:'poupança',
     ctx:'Faltam 2 anos para acabar o curso. A formatura e tese custam cerca de 8.000 MT no total.',quote:'Qual é a melhor estratégia de poupança?',
     choices:[{em:'😔',t:'Pedir emprestado quando chegar a altura',xp:0,type:'bad',tip:'Empréstimos de última hora têm condições desfavoráveis. Planear antecipadamente é muito melhor!'},
              {em:'💰',t:'Poupar só quando sobrar dinheiro da bolsa',xp:25,type:'mid',tip:'Poupar sobras é inconsistente. Com um plano fixo tens garantia de alcançar a meta!'},
              {em:'📅',t:'Separar 340 MT/mês no M-Pesa durante 24 meses',xp:90,type:'best',tip:'Planeamento perfeito! 340 MT × 24 meses = 8.160 MT. A formatura está garantida sem stress!'}]},
    {ic:'🏦',t:'Xitique dos Colegas',s:'Organizar poupança com colegas da universidade',xp:75,diff:'Médio',qkey:'xitique',
     ctx:'5 colegas querem fazer um Xitique de 250 MT/mês cada. Alguns têm bolsas diferentes.',quote:'Como organizas o Xitique de forma justa?',
     choices:[{em:'💸',t:'Todos contribuem igual independentemente da bolsa',xp:25,type:'mid',tip:'Contribuição igual pode ser injusta para quem tem bolsa menor. Adapta ao rendimento de cada um!'},
              {em:'📋',t:'Acordo verbal no grupo de WhatsApp — serve de registo',xp:15,type:'mid',tip:'WhatsApp regista, mas um sistema dedicado como o Txigital é mais transparente e seguro!'},
              {em:'📱',t:'Usar o Txigital com regras claras e M-Pesa para pagamentos',xp:75,type:'best',tip:'Excelente! Txigital garante transparência, pagamentos automáticos e registo de quem está em atraso!'}]},
    {ic:'🎣',t:'O Email Suspeito',s:'Um "prémio académico" por email',xp:85,diff:'Médio',qkey:'fraudes',
     ctx:'Recebes email: "Parabéns! Ganhou bolsa de 50.000 MT. Envie dados M-Pesa e PIN para receber."',quote:'O que fazes?',
     choices:[{em:'📧',t:'Responder com os dados — pode ser mesmo real!',xp:0,type:'bad',tip:'PHISHING! Nunca partilhes dados M-Pesa ou PIN por email. Bolsas reais não funcionam assim!'},
              {em:'🤔',t:'Encaminhar para colegas para ver se receberam igual',xp:20,type:'mid',tip:'Partilhar é bom para alertar, mas nunca respondas com dados. Reporta como phishing!'},
              {em:'🗑️',t:'Apagar, reportar como phishing e alertar a secretaria da ISUTC',xp:85,type:'best',tip:'Perfeito! Reportar protege outros colegas. A ISUTC nunca pede dados financeiros por email!'}]},
    {ic:'💳',t:'Vantagens do M-Pesa vs Dinheiro',s:'Comparar pagamentos digitais com dinheiro físico',xp:65,diff:'Fácil',qkey:'mpesa',
     ctx:'Tens de escolher como receber a mesada dos pais: em dinheiro físico ou via M-Pesa.',quote:'Qual é a opção mais vantajosa para uma estudante?',
     choices:[{em:'💵',t:'Dinheiro físico — posso ver e controlar melhor',xp:20,type:'mid',tip:'Dinheiro físico é tangível, mas sem registo automático gastas sem perceber onde foi!'},
              {em:'🤷',t:'Tanto faz — é o mesmo dinheiro',xp:0,type:'bad',tip:'Não é o mesmo! M-Pesa tem registo de cada transacção, protecção contra roubo e seguro!'},
              {em:'📱',t:'M-Pesa — registo automático, seguro e sem risco de roubo',xp:65,type:'best',tip:'Correcto! Com M-Pesa sabes exactamente onde gastas, o dinheiro está protegido e disponível 24h!'}]},
    {ic:'🌱',t:'Começar a Poupar Cedo',s:'O poder dos hábitos financeiros na juventude',xp:100,diff:'Difícil',qkey:'poupança',
     ctx:'Tens 21 anos. Um amigo diz "Ainda és nova para poupar." Outro diz "Começa agora, mesmo com pouco."',quote:'Quem tem razão? Como deves agir?',
     choices:[{em:'😴',t:'Concordar com o primeiro — ainda há muito tempo',xp:0,type:'bad',tip:'O tempo é o maior aliado da poupança! 200 MT/mês durante 10 anos = mais de 30.000 MT!'},
              {em:'💰',t:'Começar só quando tiver emprego fixo',xp:25,type:'mid',tip:'Emprego fixo melhora a poupança, mas esperar cria o hábito de não poupar. Começa AGORA com pouco!'},
              {em:'🎯',t:'Começar agora com 200 MT/mês — hábito é o mais importante',xp:100,type:'best',tip:'Expert! O hábito de poupar vale mais que o valor. 200 MT/mês cria disciplina que dura toda a vida!'}]}
  ],
  João:[
    {ic:'🌾',t:'A Colheita do Milho',s:'Gerir 15.000 MT da colheita de forma inteligente',xp:70,diff:'Fácil',qkey:'poupança',
     ctx:'A colheita rendeu 15.000 MT. Tens 6 meses até à próxima colheita e despesas mensais de 1.500 MT.',quote:'Como distribuis o dinheiro da colheita?',
     choices:[{em:'🎉',t:'Gastar livremente — mereceste depois de tanto trabalho!',xp:0,type:'bad',tip:'Sem plano, o dinheiro acaba antes da próxima colheita! Planeia os 6 meses com antecedência.'},
              {em:'💰',t:'Guardar tudo em casa até precisar',xp:20,type:'mid',tip:'Guardar é bom, mas em casa perde-se facilmente. Usa M-Pesa para guardar com segurança!'},
              {em:'📊',t:'Separar: 9.000 MT despesas + 4.000 MT sementes + 2.000 MT poupança',xp:70,type:'best',tip:'Planeamento perfeito! Cobres os 6 meses, investes na próxima colheita e ainda poupas!'}]},
    {ic:'🌧️',t:'Preparação para Seca',s:'Criar reserva para anos de má colheita',xp:90,diff:'Difícil',qkey:'poupança',
     ctx:'Este ano a colheita foi boa, mas há risco de seca no próximo ano. O que fazes com o excedente?',quote:'Como te preparas para um ano difícil?',
     choices:[{em:'😔',t:'Não há nada a fazer — depende da chuva',xp:0,type:'bad',tip:'Há sempre algo a fazer! Uma reserva financeira pode salvar a família num ano difícil.'},
              {em:'💸',t:'Investir tudo em mais terra — maximizar produção',xp:25,type:'mid',tip:'Investir em terra é bom, mas sem reserva financeira um ano seco pode ser devastador!'},
              {em:'🌧️',t:'Guardar 30% da colheita boa como reserva no M-Pesa',xp:90,type:'best',tip:'Sabedoria! 30% de reserva garante sobrevivência num ano seco. O M-Pesa guarda com segurança!'}]},
    {ic:'🛡️',t:'O Comprador Suspeito',s:'Um comprador promete pagar depois de levar a colheita',xp:80,diff:'Médio',qkey:'fraudes',
     ctx:'Um comprador desconhecido quer levar 500 kg de feijão agora e pagar "assim que vender em Maputo".',quote:'Como proteges a tua colheita?',
     choices:[{em:'🤝',t:'Confiar — parece uma pessoa honesta',xp:0,type:'bad',tip:'Aparência não garante pagamento! Sem pagamento ou garantia, podes perder toda a colheita!'},
              {em:'🤔',t:'Pedir contacto e NBI antes de entregar',xp:30,type:'mid',tip:'Bom! Mas contactos e NBI podem ser falsos. Pagamento antecipado ou M-Pesa é a única garantia!'},
              {em:'💰',t:'Exigir pagamento total por M-Pesa antes de entregar',xp:80,type:'best',tip:'Correcto! Pagamento antecipado via M-Pesa é a única garantia segura. Nunca entregas sem pagar!'}]},
    {ic:'📱',t:'M-Pesa no Campo',s:'Usar pagamentos digitais na agricultura',xp:75,diff:'Médio',qkey:'mpesa',
     ctx:'Vais comprar sementes na cidade mas não queres viajar com 8.000 MT em dinheiro físico.',quote:'Qual é a forma mais segura de levar o dinheiro?',
     choices:[{em:'💵',t:'Levar o dinheiro físico bem escondido na roupa',xp:0,type:'bad',tip:'Dinheiro físico em viagem é risco de roubo! O M-Pesa viaja contigo em segurança.'},
              {em:'🤝',t:'Pedir a um familiar para guardar e encontrar-te lá',xp:20,type:'mid',tip:'Melhor que físico, mas depende de terceiros. O M-Pesa dá independência total!'},
              {em:'📲',t:'Usar o M-Pesa — dinheiro viaja no telemóvel em segurança',xp:75,type:'best',tip:'Perfeito! Com M-Pesa o teu dinheiro viaja contigo sem risco. Pagas directamente no fornecedor!'}]},
    {ic:'🏦',t:'Xitique dos Agricultores',s:'Comprar tractor em grupo com os vizinhos',xp:100,diff:'Difícil',qkey:'xitique',
     ctx:'Um tractor para a aldeia custa 200.000 MT. Sozinho não consegues, mas há 10 famílias interessadas.',quote:'Qual é a melhor forma de organizar a compra colectiva?',
     choices:[{em:'💸',t:'Cada família junta dinheiro físico com o líder da aldeia',xp:20,type:'mid',tip:'Pode funcionar, mas sem registo transparente podem surgir conflitos. Sistema digital é mais seguro!'},
              {em:'😔',t:'Impossível — nunca conseguimos juntar tanto',xp:0,type:'bad',tip:'10 famílias × 2.000 MT/mês × 10 meses = 200.000 MT! Com organização é completamente possível!'},
              {em:'📱',t:'Usar Xitique Digital — registo transparente, pagamento M-Pesa',xp:100,type:'best',tip:'Estratégia vencedora! Transparência total para todas as famílias + pagamentos verificáveis!'}]},
    {ic:'📊',t:'Orçamento da Época Agrícola',s:'Planear despesas da próxima época',xp:85,diff:'Difícil',qkey:'orçamento',
     ctx:'A época de plantio começa em Novembro. Precisas: sementes 3.000 MT, adubos 2.500 MT, mão-de-obra 1.500 MT.',quote:'Como planeias o financiamento da época?',
     choices:[{em:'💸',t:'Pedir empréstimo na altura — sempre há solução',xp:15,type:'mid',tip:'Empréstimos de última hora têm juros altos! Planear antecipadamente poupa muito dinheiro!'},
              {em:'😔',t:'Usar o que sobrar da colheita anterior — se sobrar',xp:20,type:'mid',tip:'Depender de sobras é arriscado! Um fundo específico para a próxima época garante o plantio!'},
              {em:'📅',t:'Separar 7.000 MT da colheita actual para a próxima época',xp:85,type:'best',tip:'Planeamento excelente! Separar o investimento da colheita actual garante a próxima época sem stress!'}]},
    {ic:'🌱',t:'Vender Sem Intermediários',s:'Usar M-Pesa para vender directamente',xp:80,diff:'Médio',qkey:'mpesa',
     ctx:'Normalmente vendes o feijão a um intermediário por 25 MT/kg. Em Maputo pagam 40 MT/kg directamente.',quote:'Como podes vender directamente e receber com segurança?',
     choices:[{em:'🤷',t:'Continuar com o intermediário — é mais fácil',xp:20,type:'mid',tip:'Mais fácil mas 37% menos receita! Com M-Pesa podes receber directamente de compradores em Maputo!'},
              {em:'💵',t:'Viajar a Maputo com a colheita e receber em dinheiro',xp:15,type:'mid',tip:'Viagem custosa e risco de dinheiro físico. M-Pesa recebe o pagamento sem tu saíres da aldeia!'},
              {em:'📲',t:'Usar M-Pesa para receber de compradores directos em Maputo',xp:80,type:'best',tip:'Brilhante! M-Pesa liga-te directamente a compradores. 40 MT vs 25 MT/kg = 60% mais receita!'}]},
    {ic:'🔐',t:'Golpe da Cooperativa',s:'Uma cooperativa suspeita pede dinheiro antecipado',xp:110,diff:'Expert',qkey:'fraudes',
     ctx:'"Cooperativa Agrícola" online: "Garante o teu lugar pagando 3.000 MT de inscrição antecipada."',quote:'O que fazes?',
     choices:[{em:'💸',t:'Pagar — cooperativas agrícolas são de confiança',xp:0,type:'bad',tip:'GOLPE! Cooperativas legítimas NUNCA pedem dinheiro antecipado por canais online sem verificação!'},
              {em:'🤔',t:'Pesquisar mais sobre a cooperativa antes de pagar',xp:35,type:'mid',tip:'Boa cautela! Mas verifica sempre presencialmente ou através do MINAG — não só online!'},
              {em:'✅',t:'Verificar no MINAG presencialmente antes de qualquer pagamento',xp:110,type:'best',tip:'Expert! Cooperativas legítimas estão registadas no MINAG. Verifica sempre presencialmente!'}]}
  ]
};

/* ══════════════════════════════════════════════
   ACADEMIA QUESTIONS
══════════════════════════════════════════════ */
const AC_THEMES = ['Poupança','Orçamento','Pagamentos Digitais','Prevenção de Fraudes','Reembolso de Empréstimos','Xitique','Vantagens Sem Dinheiro'];

const AC_Q = {
  Ana:{
    'Poupança':[
      {q:'Recebes 3.000 MT da venda. Quanto guardas PRIMEIRO antes de qualquer despesa?',choices:[{em:'😅',t:'Nada agora — depois logo se vê',xp:0,type:'bad'},{em:'💰',t:'100-200 MT — o que sobrar',xp:15,type:'mid'},{em:'🎯',t:'300-600 MT (10-20%) — a regra de ouro',xp:40,type:'best'}],tip:'A regra de ouro é poupar 10-20% ANTES de qualquer gasto. 300 MT/semana = 1.200 MT/mês!'},
      {q:'Onde guardas as poupanças da banca para não as gastar?',choices:[{em:'🏠',t:'Numa caixa em casa',xp:10,type:'mid'},{em:'📱',t:'No M-Pesa numa conta separada',xp:40,type:'best'},{em:'🤝',t:'Com uma amiga de confiança',xp:0,type:'bad'}],tip:'Conta M-Pesa separada cria barreira psicológica contra o gasto e regista todo o histórico!'},
      {q:'Qual é o melhor hábito de poupança para renda irregular como a tua?',choices:[{em:'📅',t:'Valor fixo todo o dia de mercado, sem falta',xp:40,type:'best'},{em:'💸',t:'Só poupar nos meses bons',xp:15,type:'mid'},{em:'😴',t:'Quando me lembro',xp:0,type:'bad'}],tip:'Consistência bate valor! 100 MT todos os dias de mercado = muito mais do que 1.000 MT esporádicos.'},
      {q:'Em 5 anos queres abrir uma loja. Precisas de 80.000 MT. Quanto poupas por mês?',choices:[{em:'😔',t:'Impossível com o meu rendimento',xp:0,type:'bad'},{em:'💭',t:'Poupar quando der',xp:10,type:'mid'},{em:'📊',t:'1.350 MT/mês — cálculo simples: 80k÷60meses',xp:40,type:'best'}],tip:'80.000 ÷ 60 meses = 1.333 MT/mês. Uma meta clara + plano = sonho realizável!'},
    ],
    'Orçamento':[
      {q:'A tua banca vendeu 8.000 MT mas os custos foram 5.200 MT. Qual é o teu lucro real?',choices:[{em:'🤷',t:'Não sei calcular',xp:0,type:'bad'},{em:'💭',t:'Qualquer coisa entre 2.000-3.000 MT',xp:10,type:'mid'},{em:'📊',t:'2.800 MT (8.000 - 5.200)',xp:40,type:'best'}],tip:'Lucro = Receita - Custos. Conhecer o lucro real é o primeiro passo para gerir bem o negócio!'},
      {q:'O que é a Regra 50-30-20 aplicada ao teu negócio?',choices:[{em:'🤷',t:'Nunca ouvi falar',xp:0,type:'bad'},{em:'💭',t:'50% vendas, 30% stock, 20% poupança',xp:20,type:'mid'},{em:'🎯',t:'50% necessidades, 30% reinvestir, 20% poupar/emergência',xp:40,type:'best'}],tip:'50-30-20: metade para viver, 30% de volta ao negócio, 20% poupar. Uma fórmula simples que funciona!'},
      {q:'Como separas as despesas pessoais das despesas da banca?',choices:[{em:'💭',t:'Misturo tudo — é o mesmo dinheiro',xp:0,type:'bad'},{em:'📒',t:'Registo num caderno',xp:20,type:'mid'},{em:'📱',t:'Duas contas M-Pesa separadas: pessoal e negócio',xp:40,type:'best'}],tip:'Misturar pessoal e negócio é o maior erro de vendedores! Contas separadas mostram claramente a saúde do negócio.'},
    ],
    'Pagamentos Digitais':[
      {q:'Qual é a vantagem de aceitar M-Pesa na tua banca?',choices:[{em:'🤷',t:'Nenhuma — dinheiro físico é mais fácil',xp:0,type:'bad'},{em:'💭',t:'Aceitas clientes sem troco',xp:20,type:'mid'},{em:'📱',t:'Mais clientes + seguro + registo automático de vendas',xp:40,type:'best'}],tip:'M-Pesa na banca = mais clientes (sem troco), registo automático de vendas e dinheiro seguro!'},
      {q:'Como verificas que um pagamento M-Pesa chegou antes de dar a mercadoria?',choices:[{em:'🤝',t:'Confiar no cliente — parece honesto',xp:0,type:'bad'},{em:'📞',t:'Ligar para o cliente para confirmar',xp:15,type:'mid'},{em:'📱',t:'Aguardar SMS de confirmação da Vodacom no teu telemóvel',xp:40,type:'best'}],tip:'O SMS de confirmação é a única prova! "Recebeu X MT de Y às HH:MM" — só então entregas!'},
      {q:'O que fazes quando recebes pagamento errado (valor diferente)?',choices:[{em:'😔',t:'Fico com a diferença — o cliente errou',xp:0,type:'bad'},{em:'📞',t:'Ligar ao cliente e resolver entre nós',xp:20,type:'mid'},{em:'📱',t:'Devolver excesso via M-Pesa e confirmar com o cliente',xp:40,type:'best'}],tip:'Honestidade e rapidez! Devolver o excesso mantém a tua reputação e cria confiança duradoura!'},
    ],
    'Prevenção de Fraudes':[
      {q:'Um "fiscal do M-Pesa" pede para verificar a tua conta no local. O que fazes?',choices:[{em:'🤝',t:'Mostrar o telemóvel — é um fiscal oficial',xp:0,type:'bad'},{em:'🤔',t:'Pedir identificação oficial primeiro',xp:20,type:'mid'},{em:'🛡️',t:'Recusar — não existe "fiscal do M-Pesa" que venha ter contigo',xp:40,type:'best'}],tip:'Não existe fiscal do M-Pesa! Qualquer pessoa que se apresente assim é golpista. Liga ao 84111.'},
      {q:'Uma cliente paga 500 MT mas o SMS diz 50 MT. O que faças?',choices:[{em:'🤷',t:'O SMS pode estar errado — confio na cliente',xp:0,type:'bad'},{em:'📱',t:'Não entrego até o SMS mostrar o valor correcto',xp:40,type:'best'},{em:'💭',t:'Entregar e esperar pelo resto depois',xp:10,type:'mid'}],tip:'O SMS do M-Pesa nunca mente! Se diz 50 MT, recebeste 50 MT. Nunca entregas mercadoria sem SMS correcto!'},
      {q:'Como identificas uma nota de 500 MT falsa no mercado?',choices:[{em:'🤷',t:'Aceitar — não sei identificar',xp:0,type:'bad'},{em:'👁️',t:'Verificar fio de segurança e marca d\'água',xp:30,type:'mid'},{em:'✅',t:'Usar caneta detectora + fio de segurança + marca d\'água',xp:40,type:'best'}],tip:'Notas reais têm: fio de segurança metálico, marca d\'água com retrato, e papel especial. Caneta detectora confirma!'},
    ],
    'Reembolso de Empréstimos':[
      {q:'Pediste 5.000 MT emprestado a uma amiga. Qual é a melhor forma de pagar?',choices:[{em:'💸',t:'Pagar quando tiver jeito',xp:0,type:'bad'},{em:'📅',t:'Combinar valor fixo mensal e pagar por M-Pesa com comprovativo',xp:40,type:'best'},{em:'💭',t:'Pagar em produtos da banca',xp:15,type:'mid'}],tip:'Valor fixo + M-Pesa = registo automático e transparência total. Protege a amizade e a tua reputação!'},
      {q:'Tens 3 dívidas: 2.000 MT a 0% juro (amiga), 3.000 MT a 5%/mês, 1.000 MT a 2%/mês. Qual pagas primeiro?',choices:[{em:'💭',t:'A mais pequena (1.000 MT) — fico logo livre',xp:20,type:'mid'},{em:'🎯',t:'A mais cara (5%/mês) — eliminar o maior juro primeiro',xp:40,type:'best'},{em:'💸',t:'Dividir igual pelas 3',xp:10,type:'mid'}],tip:'Método avalanche: paga primeiro a dívida com maior juro! 5%/mês = 60%/ano. É urgente eliminar primeiro!'},
    ],
    'Xitique':[
      {q:'O que é um Xitique digital e como funciona?',choices:[{em:'🤷',t:'Uma app de jogos financeiros',xp:0,type:'bad'},{em:'💭',t:'Um banco para grupos',xp:15,type:'mid'},{em:'🏦',t:'Poupança rotativa em grupo via M-Pesa com transparência total',xp:40,type:'best'}],tip:'Xitique digital = poupança rotativa tradicional + segurança M-Pesa + transparência para todos os membros!'},
      {q:'No Xitique, quando podes levantar o teu dinheiro?',choices:[{em:'💸',t:'Quando precisar urgentemente',xp:0,type:'bad'},{em:'📅',t:'No teu turno definido pelo grupo',xp:40,type:'best'},{em:'💭',t:'A qualquer momento com aprovação da maioria',xp:15,type:'mid'}],tip:'No Xitique, o dinheiro fica BLOQUEADO até ao teu turno. Isso protege todos os membros de urgências individuais!'},
    ],
    'Vantagens Sem Dinheiro':[
      {q:'Quais são os 3 maiores riscos de ter muito dinheiro físico na banca?',choices:[{em:'🤷',t:'Não vejo riscos — dinheiro físico é sempre seguro',xp:0,type:'bad'},{em:'💭',t:'Roubo apenas',xp:15,type:'mid'},{em:'🎯',t:'Roubo + gasto fácil + sem registo de vendas',xp:40,type:'best'}],tip:'Dinheiro físico: risco de roubo, tentação de gastar, e sem histórico de transacções. M-Pesa resolve os 3!'},
      {q:'Se aceitares M-Pesa na banca, como isso ajuda o teu negócio a crescer?',choices:[{em:'🤷',t:'Não ajuda — só complica',xp:0,type:'bad'},{em:'💭',t:'Aceitas mais clientes',xp:20,type:'mid'},{em:'📈',t:'Mais clientes + registo automático + base para crédito futuro',xp:40,type:'best'}],tip:'M-Pesa cria histórico de transacções que microfinanceiras usam para aprovar crédito. É o teu currículo financeiro!'},
    ],
  },
  Carlos:{
    'Poupança':[
      {q:'Ganhas em média 300 MT/dia no chapa. Qual é a meta de poupança diária ideal?',choices:[{em:'😴',t:'Nada — as despesas são muitas',xp:0,type:'bad'},{em:'💭',t:'50 MT quando sobrar',xp:15,type:'mid'},{em:'🎯',t:'30-60 MT todo dia, sem falta',xp:40,type:'best'}],tip:'30-60 MT/dia parece pouco, mas 45 MT × 300 dias = 13.500 MT/ano. O hábito diário é poderoso!'},
      {q:'Como usas os meses com mais corridas para poupar mais?',choices:[{em:'🎉',t:'Gastar mais — mereceste trabalhar tanto',xp:0,type:'bad'},{em:'💰',t:'Guardar 50% do extra imediatamente no M-Pesa',xp:40,type:'best'},{em:'💭',t:'Guardar um pouco mais que o normal',xp:20,type:'mid'}],tip:'Regra do extra: 50% do rendimento acima da média vai directo para poupança. Nunca aumentas o estilo de vida!'},
      {q:'Qual é o objectivo principal do teu fundo de emergência como motorista?',choices:[{em:'🎉',t:'Para viagens de férias',xp:0,type:'bad'},{em:'🔧',t:'Cobrir reparações do chapa sem parar de trabalhar',xp:40,type:'best'},{em:'💭',t:'Comprar um chapa novo',xp:20,type:'mid'}],tip:'Fundo de emergência = segurança operacional. Uma avaria sem reserva pode parar o negócio semanas!'},
    ],
    'Orçamento':[
      {q:'Como calculas o custo real por km percorrido no teu chapa?',choices:[{em:'🤷',t:'Não calculo — só olho ao lucro final',xp:0,type:'bad'},{em:'💭',t:'Dividir combustível pelas horas trabalhadas',xp:15,type:'mid'},{em:'📊',t:'(Combustível + manutenção + aluguer) ÷ km totais do mês',xp:40,type:'best'}],tip:'Custo por km = (combustível + manutenção + aluguer) ÷ km. Rotas com custo alto → avaliar alternativas!'},
      {q:'O teu chapa tem despesas fixas e variáveis. Qual é a diferença?',choices:[{em:'🤷',t:'Não há diferença — são todas despesas',xp:0,type:'bad'},{em:'💭',t:'Fixas são maiores, variáveis são menores',xp:10,type:'mid'},{em:'🎯',t:'Fixas ocorrem sempre (aluguer); variáveis mudam (combustível, reparos)',xp:40,type:'best'}],tip:'Fixas = aluguer, seguro. Variáveis = combustível, reparações. Optimizar variáveis aumenta o lucro directamente!'},
    ],
    'Pagamentos Digitais':[
      {q:'Passageiro quer pagar com M-Pesa mas nunca usaste para receber. O que fazes?',choices:[{em:'❌',t:'Recusar — só aceito dinheiro físico',xp:0,type:'bad'},{em:'📱',t:'Dar o meu número M-Pesa e confirmar quando chegar o SMS',xp:40,type:'best'},{em:'💭',t:'Aceitar mas sem verificar',xp:10,type:'mid'}],tip:'Número M-Pesa → passageiro envia → tu recebes SMS → confirma! Simples, rápido e sem troco necessário!'},
      {q:'Quais os benefícios de pagar combustível por M-Pesa em vez de dinheiro?',choices:[{em:'🤷',t:'Nenhum — tanto faz',xp:0,type:'bad'},{em:'💭',t:'Mais fácil quando não tenho troco',xp:15,type:'mid'},{em:'✅',t:'Sem risco de roubo + registo de despesas + histórico financeiro',xp:40,type:'best'}],tip:'M-Pesa para combustível: sem dinheiro físico no chapa = segurança + registo automático para o orçamento!'},
    ],
    'Prevenção de Fraudes':[
      {q:'Um passageiro pede troco de uma nota de 1.000 MT por uma corrida de 50 MT. O que verificas?',choices:[{em:'💸',t:'Dar o troco rapidamente — não quero discussão',xp:0,type:'bad'},{em:'👁️',t:'Verificar se a nota é autêntica antes de dar troco',xp:40,type:'best'},{em:'💭',t:'Verificar mas rapidamente sem muito cuidado',xp:20,type:'mid'}],tip:'Notas falsas de 500 MT e 1.000 MT são comuns. Sempre verifica o fio metálico e marca d\'água!'},
      {q:'Alguém oferece "seguro especial" para o teu chapa por 500 MT/mês sem documentos. O que fazes?',choices:[{em:'💸',t:'Aceitar — parece mais barato que o normal',xp:0,type:'bad'},{em:'🤔',t:'Pedir mais informações antes de pagar',xp:20,type:'mid'},{em:'🛡️',t:'Recusar — seguros legítimos têm documentação oficial',xp:40,type:'best'}],tip:'Seguros sem documentação = golpe. Sempre exige apólice assinada, número de registo e empresa licenciada pelo IPSO!'},
    ],
    'Reembolso de Empréstimos':[
      {q:'Pediste 20.000 MT ao banco para reparar o chapa, a 10%/ano. Quanto pagas no total?',choices:[{em:'💭',t:'22.000 MT',xp:40,type:'best'},{em:'🤷',t:'20.000 MT — só o que pedi',xp:0,type:'bad'},{em:'💸',t:'30.000 MT',xp:10,type:'mid'}],tip:'20.000 × 10% = 2.000 MT de juro anual. Total = 22.000 MT. Conhecer o custo total do crédito é fundamental!'},
      {q:'Como organizas o pagamento mensal do empréstimo do banco para não atrasar?',choices:[{em:'😴',t:'Pago quando tiver dinheiro suficiente',xp:0,type:'bad'},{em:'📅',t:'Separar o valor da prestação logo que recebo a renda semanal',xp:40,type:'best'},{em:'💭',t:'Lembrar no fim do mês',xp:10,type:'mid'}],tip:'"Paga-te primeiro" aplica-se também a dívidas! Separa a prestação logo que recebes. Jamais mistura com o resto!'},
    ],
    'Xitique':[
      {q:'Como convences os teus colegas motoristas a criar um Xitique para emergências?',choices:[{em:'😔',t:'Impossível — cada um tem a sua vida',xp:0,type:'bad'},{em:'💭',t:'Sugerir e ver quem se interessa',xp:20,type:'mid'},{em:'🎯',t:'Mostrar cálculo: 10 × 1.000 MT/mês = fundo de 120.000 MT/ano',xp:40,type:'best'}],tip:'Números convencem! 10 motoristas × 1.000 MT/mês = 120.000 MT/ano disponíveis para emergências do grupo!'},
    ],
    'Vantagens Sem Dinheiro':[
      {q:'Ter menos dinheiro físico no chapa durante o trabalho tem que vantagens?',choices:[{em:'🤷',t:'Nenhuma — preciso do dinheiro em mãos',xp:0,type:'bad'},{em:'💭',t:'Menos risco de roubo',xp:20,type:'mid'},{em:'✅',t:'Menos risco de roubo + menos gasto impulsivo + melhor registo',xp:40,type:'best'}],tip:'Digitalizar os ganhos do chapa cria segurança física e disciplina financeira automática!'},
    ],
  },
  Fátima:{
    'Poupança':[
      {q:'A tua bolsa é 3.500 MT/mês. Qual é o mínimo que deves poupar para ter fundo de emergência?',choices:[{em:'😴',t:'Nada — estudante não precisa de poupança',xp:0,type:'bad'},{em:'💭',t:'100 MT quando sobrar',xp:15,type:'mid'},{em:'🎯',t:'350-700 MT (10-20%) logo que receberes',xp:40,type:'best'}],tip:'Mesmo estudante deve poupar! 350 MT/mês × 12 = 4.200 MT. Um semestre de emergência protegido!'},
      {q:'Qual é a maior armadilha financeira para estudantes universitários?',choices:[{em:'💭',t:'Pagar propinas com atraso',xp:20,type:'mid'},{em:'💳',t:'Crédito fácil + estilo de vida acima da bolsa',xp:40,type:'best'},{em:'😴',t:'Não estudar o suficiente',xp:0,type:'bad'}],tip:'Crédito fácil para estudantes (telemóveis, roupas) cria dívidas que duram anos após a formatura!'},
      {q:'Como poupar para a formatura enquanto estudas?',choices:[{em:'😔',t:'Impossível com bolsa de estudante',xp:0,type:'bad'},{em:'💭',t:'Pedir ajuda aos pais na altura',xp:15,type:'mid'},{em:'📅',t:'334 MT/mês durante 2 anos = 8.000 MT garantidos',xp:40,type:'best'}],tip:'Matemática simples: 8.000 ÷ 24 meses = 334 MT/mês. Formatura paga sem stress!'},
    ],
    'Orçamento':[
      {q:'Como divides 3.500 MT de bolsa usando a Regra 50-30-20?',choices:[{em:'🤷',t:'Não sei aplicar ao meu caso',xp:0,type:'bad'},{em:'💭',t:'Metade comida, resto em várias coisas',xp:15,type:'mid'},{em:'📊',t:'1.750 necessidades, 1.050 lazer, 700 poupança',xp:40,type:'best'}],tip:'50-30-20 para estudante: 1.750 MT (propinas+comida+transp), 1.050 MT (lazer+material), 700 MT poupança!'},
      {q:'O que incluis obrigatoriamente num orçamento estudantil?',choices:[{em:'📖',t:'Propinas, comida, transporte, material, poupança emergência',xp:40,type:'best'},{em:'💭',t:'Propinas e comida — o resto é extra',xp:20,type:'mid'},{em:'😴',t:'Não preciso de orçamento — a bolsa é pequena',xp:0,type:'bad'}],tip:'Orçamento estudantil completo: propinas + comida + transporte + material + poupança 10%. Sem excepções!'},
    ],
    'Pagamentos Digitais':[
      {q:'Como usas o M-Pesa para gerir a mesada dos pais de forma inteligente?',choices:[{em:'💵',t:'Pedir em dinheiro físico — mais fácil de controlar',xp:10,type:'mid'},{em:'📱',t:'Receber por M-Pesa e verificar histórico de gastos regularmente',xp:40,type:'best'},{em:'🤷',t:'Tanto faz — é sempre o mesmo valor',xp:0,type:'bad'}],tip:'M-Pesa mostra exactamente onde gastas! Histórico automático = conhecimento real dos teus hábitos!'},
      {q:'Quais os serviços da ISUTC que já podes pagar por M-Pesa?',choices:[{em:'🤷',t:'Nenhum — universidades não aceitam',xp:0,type:'bad'},{em:'💭',t:'Só a cantina',xp:10,type:'mid'},{em:'📱',t:'Propinas, inscrições, fotocópias e alguns serviços administrativos',xp:40,type:'best'}],tip:'A ISUTC e muitas universidades já aceitam M-Pesa para vários serviços. Menos filas, mais comodidade!'},
    ],
    'Prevenção de Fraudes':[
      {q:'Um colega oferece "investimento com 50% de retorno em 15 dias" para estudantes. É legítimo?',choices:[{em:'💸',t:'Parece uma boa oportunidade de multiplicar a bolsa',xp:0,type:'bad'},{em:'🤔',t:'Investigar mais antes de decidir',xp:20,type:'mid'},{em:'🛡️',t:'Não — é pirâmide financeira. Retornos garantidos são sempre golpe!',xp:40,type:'best'}],tip:'Pirâmides financeiras são comuns em universidades! Promessas de retorno garantido = sempre fraude!'},
      {q:'Recebes mensagem: "Tua bolsa vai ser cancelada. Confirma dados M-Pesa urgente." O que fazes?',choices:[{em:'📱',t:'Responder urgentemente — não posso perder a bolsa!',xp:0,type:'bad'},{em:'🤔',t:'Ligar para os pais primeiro',xp:20,type:'mid'},{em:'✅',t:'Ir pessoalmente à secretaria da ISUTC verificar',xp:40,type:'best'}],tip:'Phishing de bolsas é comum! Nunca respondas por mensagem. Vai sempre pessoalmente verificar na fonte oficial!'},
    ],
    'Reembolso de Empréstimos':[
      {q:'Pediste 10.000 MT emprestado à família para propinas urgentes. Como reembolsas responsavelmente?',choices:[{em:'😴',t:'Pagar quando tiver emprego — eles entendem',xp:0,type:'bad'},{em:'📅',t:'Combinar plano de pagamento fixo assim que começas a trabalhar',xp:40,type:'best'},{em:'💭',t:'Pagar o que puder quando lembrar',xp:10,type:'mid'}],tip:'Combina um plano ANTES de pegar o empréstimo! "Pagarei 1.000 MT/mês a partir de X" é profissional e honesto!'},
    ],
    'Xitique':[
      {q:'Organizas um Xitique com 5 colegas de faculdade. Qual é a contribuição ideal para estudantes?',choices:[{em:'💸',t:'500 MT/mês cada — valor significativo',xp:20,type:'mid'},{em:'🎯',t:'150-250 MT/mês — acessível e consistente para bolsistas',xp:40,type:'best'},{em:'😔',t:'Estudantes não conseguem ter Xitique',xp:0,type:'bad'}],tip:'O valor deve ser sustentável para todos! 200 MT × 5 pessoas = 1.000 MT por turno. Perfeito para emergências!'},
      {q:'Um colega falta ao pagamento do Xitique este mês. O que o grupo faz?',choices:[{em:'😔',t:'Expulsar imediatamente do grupo',xp:10,type:'mid'},{em:'🎯',t:'Contactar, entender a situação e definir prazo de regularização',xp:40,type:'best'},{em:'💸',t:'Ignorar e continuar sem ele',xp:0,type:'bad'}],tip:'Comunicação primeiro! Um sistema digital como o Txigital notifica automaticamente e regista atrasos com transparência!'},
    ],
    'Vantagens Sem Dinheiro':[
      {q:'Pagar propinas por M-Pesa vs ir ao banco. Qual a principal vantagem para estudantes?',choices:[{em:'🤷',t:'Não há diferença real',xp:0,type:'bad'},{em:'💭',t:'Mais rápido',xp:20,type:'mid'},{em:'✅',t:'Sem filas + comprovativo imediato + disponível 24h + histórico digital',xp:40,type:'best'}],tip:'M-Pesa para propinas: sem filas, comprovativo instantâneo, disponível 24h. Tempo poupado = mais estudo!'},
    ],
  },
  João:{
    'Poupança':[
      {q:'A colheita rendeu 20.000 MT. Qual % deves guardar para a próxima época de plantio?',choices:[{em:'😴',t:'Nada — reinvisto tudo para crescer',xp:0,type:'bad'},{em:'💭',t:'10% — igual a qualquer outro rendimento',xp:15,type:'mid'},{em:'🌾',t:'30-40% — para sementes, adubos e fundo de seca',xp:40,type:'best'}],tip:'Agricultor precisa de reserva maior! 30-40% cobre sementes + adubos + margem para ano seco!'},
      {q:'Onde é mais seguro guardar o dinheiro da colheita durante os 6 meses até à próxima?',choices:[{em:'🏠',t:'Em casa num lugar seguro',xp:10,type:'mid'},{em:'📱',t:'No M-Pesa — seguro, acessível e com histórico',xp:40,type:'best'},{em:'🤝',t:'Com o líder da aldeia',xp:0,type:'bad'}],tip:'M-Pesa guarda por meses com segurança total. Em casa pode ser roubado, molhado ou gasto impulsivamente!'},
      {q:'Como poupas de forma regular quando a renda é sazonal (só na colheita)?',choices:[{em:'😔',t:'É impossível poupar regularmente com renda sazonal',xp:0,type:'bad'},{em:'💭',t:'Poupar durante a colheita quando tenho muito',xp:20,type:'mid'},{em:'🎯',t:'Dividir colheita em 12 partes iguais + guardar 20% de cada parte',xp:40,type:'best'}],tip:'Dividir a colheita em "salários mensais" é o segredo! 20.000 ÷ 12 = 1.667 MT/mês para gerir.'},
    ],
    'Orçamento':[
      {q:'Como calculas o custo real de produzir 1 kg de feijão na tua machamba?',choices:[{em:'🤷',t:'Não calculo — só olho ao que vendo',xp:0,type:'bad'},{em:'💭',t:'Valor das sementes dividido pela colheita',xp:15,type:'mid'},{em:'📊',t:'(Sementes + adubos + água + mão-de-obra) ÷ kg produzidos',xp:40,type:'best'}],tip:'Custo real = todas as despesas ÷ produção total. Se vendes abaixo do custo, estás a perder dinheiro!'},
      {q:'Qual é o orçamento anual de um agricultor? Quais as 5 categorias principais?',choices:[{em:'🤷',t:'Não sei fazer orçamento anual',xp:0,type:'bad'},{em:'💭',t:'Sementes e comida familiar',xp:15,type:'mid'},{em:'🌾',t:'Sementes + adubos + mão-de-obra + despesas família + reserva de seca',xp:40,type:'best'}],tip:'Orçamento agrícola tem 5 pilares! A reserva de seca é o que diferencia um agricultor estável de um vulnerável!'},
    ],
    'Pagamentos Digitais':[
      {q:'Como recebes pagamento de um comprador em Maputo sem viajar?',choices:[{em:'🚌',t:'Viajar a Maputo com a colheita para receber em mão',xp:10,type:'mid'},{em:'📱',t:'Combinar pagamento via M-Pesa antes de enviar a colheita',xp:40,type:'best'},{em:'🤝',t:'Confiar que paga depois de vender',xp:0,type:'bad'}],tip:'M-Pesa conecta-te a compradores em todo Moçambique! Recebe antes de enviar. Nunca entregas sem pagamento!'},
      {q:'Um comprador em Nampula quer pagar 50.000 MT pela tua colheita. Qual é o processo seguro?',choices:[{em:'💵',t:'Receber em dinheiro físico quando entregar',xp:0,type:'bad'},{em:'📱',t:'Pedir 50% M-Pesa antes, 50% na entrega + registo',xp:40,type:'best'},{em:'💭',t:'Aceitar cheque do banco do comprador',xp:15,type:'mid'}],tip:'50% adiantado + 50% na entrega = protecção total. M-Pesa cria comprovativo imediato de cada pagamento!'},
    ],
    'Prevenção de Fraudes':[
      {q:'Um "exportador" oferece 80 MT/kg pelo feijão mas pede 5.000 MT de "taxa de certificação" antecipada.',choices:[{em:'💸',t:'Pagar — 80 MT/kg é muito bom preço!',xp:0,type:'bad'},{em:'🤔',t:'Investigar mais antes de pagar',xp:20,type:'mid'},{em:'🛡️',t:'Recusar — exportadores legítimos nunca cobram taxa antecipada',xp:40,type:'best'}],tip:'GOLPE CLÁSSICO! Exportadores legítimos deduzem taxas da compra. Taxa antecipada = sempre fraude!'},
      {q:'Como verificas se uma cooperativa agrícola é legítima antes de aderir?',choices:[{em:'💭',t:'Perguntar a colegas agricultores',xp:20,type:'mid'},{em:'✅',t:'Verificar registo no MINAG + visitar sede física + consultar membro actual',xp:40,type:'best'},{em:'💸',t:'Pagar a adesão e ver se funciona',xp:0,type:'bad'}],tip:'3 verificações: MINAG (registo oficial), sede física (existe mesmo?), membro actual (depoimento real)!'},
    ],
    'Reembolso de Empréstimos':[
      {q:'Pediste 30.000 MT ao banco para comprar adubo, a pagar em 12 meses. Como planeias?',choices:[{em:'😴',t:'Pagar depois da próxima colheita — deve chegar',xp:15,type:'mid'},{em:'📅',t:'Separar 2.500 MT de cada mês da colheita antes de qualquer gasto',xp:40,type:'best'},{em:'💸',t:'Ver como corre e pagar quando puder',xp:0,type:'bad'}],tip:'2.500 MT × 12 = 30.000 MT. Separar primeiro garantias pagamento sem stress. Inclui no orçamento agrícola!'},
    ],
    'Xitique':[
      {q:'10 agricultores querem comprar tractor colectivamente via Xitique. Como organizam?',choices:[{em:'💭',t:'Cada um guarda o dinheiro em casa até ter o suficiente',xp:0,type:'bad'},{em:'🤝',t:'Um líder guarda o dinheiro de todos',xp:10,type:'mid'},{em:'📱',t:'Xitique Digital: cada um contribui por M-Pesa, registo transparente para todos',xp:40,type:'best'}],tip:'Xitique Digital para compra colectiva: transparência total, ninguém pode usar o dinheiro dos outros!'},
      {q:'Qual é a principal vantagem do Xitique digital vs Xitique tradicional com dinheiro físico?',choices:[{em:'🤷',t:'Não há diferença — o resultado é o mesmo',xp:0,type:'bad'},{em:'💭',t:'É mais fácil de organizar',xp:20,type:'mid'},{em:'✅',t:'Transparência total + impossível desviar fundos + registo automático para todos',xp:40,type:'best'}],tip:'Digital = transparência que protege amizades! Todos vêem todos os movimentos. Conflitos reduzem drasticamente!'},
    ],
    'Vantagens Sem Dinheiro':[
      {q:'Como o uso do M-Pesa pode aumentar o teu poder de negociação com compradores?',choices:[{em:'🤷',t:'Não ajuda em negociação',xp:0,type:'bad'},{em:'💭',t:'Facilita pagamento mas nada mais',xp:15,type:'mid'},{em:'📈',t:'Histórico de transacções = prova de volume de negócios para crédito futuro',xp:40,type:'best'}],tip:'Histórico M-Pesa = currículo financeiro! Microfinanceiras usam isso para aprovar crédito para expansão da machamba!'},
      {q:'Quais as 3 maiores vantagens de vender colheita via M-Pesa em vez de dinheiro físico?',choices:[{em:'💭',t:'Mais fácil para clientes distantes',xp:20,type:'mid'},{em:'✅',t:'Sem risco de roubo + comprovativo legal + acesso a compradores nacionais',xp:40,type:'best'},{em:'🤷',t:'Não vejo vantagens claras',xp:0,type:'bad'}],tip:'M-Pesa para colheita: segurança + prova legal + mercado nacional! Uma machamba pode chegar a Maputo sem sair de Gaza!'},
    ],
  }
};


window.TxigitalModel = { S, LEVELS, LEVEL_NAMES, CHARS, XI_MEMBERS, XI_AMOUNTS, XI_CYCLES, XI_TURNS, MISSIONS, AC_Q, saveState, loadState, xpToLevel, xpForNext, lvlName };
