// Txigital MVC - Controller
// Owns navigation, form actions, profile actions, quiz answers and app bootstrap.

/* ══════════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════════ */
function go(id){
  document.querySelectorAll('.scr').forEach(s=>s.classList.remove('on'));
  document.getElementById(id).classList.add('on');
  applyLanguage();
}
function nav(id){
  go(id);
  if(id==='s-missions') renderMissions();
  if(id==='s-xitique') renderXitique();
  if(id==='s-academia') renderAcademia();
  if(id==='s-profile') renderProfile();
  if(id==='s-dash') renderDash();
  applyLanguage();
}

/* ══════════════════════════════════════════════
   REGISTER
══════════════════════════════════════════════ */
function doRegister(){
  const n=document.getElementById('reg-nome').value.trim();
  const nu=document.getElementById('reg-num').value.trim();
  const dob=parseMozDate(document.getElementById('reg-dob').value);
  if(!n||!nu){alert('Por favor preenche o Nome e Número M-Pesa!');return;}
  if(!isVodacomPhone(nu)){alert('O número deve ser Vodacom e começar por 84 ou 85.');return;}
  if(!dob.ok){alert(dob.msg);return;}
  S.nome=n; S.num=formatPhone(nu);
  S.email=document.getElementById('reg-email').value.trim();
  S.dob=dob.value;
  S.prov=document.getElementById('reg-prov').value;
  S.lang='Português'; S.langCode='pt'; S.languageChosen=false;
  S.themeMode='light'; S.themeChosen=false; S.xp=0; S.lvl=1; S.savings=0; S.missions_done=0; S.correct=0; S.total_q=0; S.badges=0;
  S.doneMissions=new Set(); S.doneQuestions=new Set(); S.questionResults={}; S.missionResults={};
  saveState();
  go('s-avatar');
}

function doLogin(){
  const n=document.getElementById('login-nome').value.trim();
  const nu=document.getElementById('login-num').value.trim();
  if(!n||!nu){alert('Por favor preenche o Nome e Número de Celular!');return;}
  if(!isVodacomPhone(nu)){alert('O número deve ser Vodacom e começar por 84 ou 85.');return;}
  S.nome=n; S.num=formatPhone(nu); saveState();
  go('s-avatar');
}

/* ══════════════════════════════════════════════
   AVATAR
══════════════════════════════════════════════ */
function pickChar(el,name,emoji,role){
  document.querySelectorAll('.av-card').forEach(c=>c.classList.remove('sel'));
  el.classList.add('sel');
  S.char=name; S.emoji=emoji; S.role=role;
  const b=document.getElementById('av-btn');
  b.style.opacity='1'; b.style.pointerEvents='auto';
  b.textContent=`Começar como ${name} →`;
}
function startGame(){
  if(!S.char) return;
  S.savings=0; S.lvl=1; S.xp=0;
  S.missions_done=0; S.correct=0; S.total_q=0; S.badges=0;
  S.doneMissions=new Set(); S.doneQuestions=new Set(); S.questionResults={}; S.missionResults={};
  saveState();
  nav('s-dash');
}


window.TxigitalController = { nav, doRegister, doLogin, pickChar, startGame, doMission, answerMission, filterTheme, startAcQ, answerAcQ, gainXP, setLanguage, setThemeMode, logout, editField, showBadges, showStats, nextMission, nextAcademiaQuestion };

/* init - start at splash */
loadState();
applyTheme();
go('s-splash');
applyLanguage();
