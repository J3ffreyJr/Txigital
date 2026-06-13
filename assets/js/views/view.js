// Txigital MVC - View
// Owns screen rendering, language/theme presentation and visual effects.
// Some quiz renderers also call controller handlers through existing global onclick hooks.

/* ══════════════════════════════════════════════
   DASHBOARD RENDER
══════════════════════════════════════════════ */
function renderDash(){
  const name=S.nome||S.char;
  document.getElementById('dash-name').textContent=name.split(' ')[0];
  document.getElementById('d-sav').textContent=S.savings.toLocaleString()+' MT';
  const lvlName2=lvlName(S.lvl);
  document.getElementById('d-lvl').textContent=S.lvl+'/10';
  document.getElementById('d-lvl-hint').textContent=txt(lvlName2);
  document.getElementById('d-xp').textContent=S.xp;
  // mission of day
  const mis=MISSIONS[S.char]||MISSIONS.Ana;
  const idx=S.missions_done%mis.length;
  const m=mis[idx];
  document.getElementById('d-mis-ic').textContent=m.ic;
  document.getElementById('d-mis-t').textContent=txt(m.t);
  document.getElementById('d-mis-s').textContent=txt(m.s);
  document.getElementById('d-mis-xp').textContent='+'+m.xp+' XP';
  // academia hint
  const qs=Object.keys(AC_Q[S.char]||AC_Q.Ana);
  document.getElementById('d-ac-t').textContent=txt(`Aprender sobre: ${qs[Math.floor(Math.random()*qs.length)]}`);
  // xitique
  document.getElementById('d-xi-name').textContent='Xitique';
  const amt=XI_AMOUNTS[S.char]||500;
  const cyc=XI_CYCLES[S.char]||8;
  const turn=XI_TURNS[S.char]||5;
  const total=amt*cyc;
  document.getElementById('d-xi-amt').textContent=(total).toLocaleString()+' MT';
  document.getElementById('d-xi-sub').textContent=txt('🔒 Bloqueado até fim do ciclo');
  document.getElementById('d-xi-prog').style.width=Math.round((turn/cyc)*100)+'%';
  document.getElementById('d-xi-turn').textContent=txt(`Turno ${turn} de ${cyc}`);
  // members
  const mbs=XI_MEMBERS[S.char]||XI_MEMBERS.Ana;
  const mr=document.getElementById('d-mbr-row');
  mr.innerHTML=mbs.slice(0,4).map(m=>`<div class="mbr">${m.em}</div>`).join('')+`<span style="font-size:11px;color:rgba(255,255,255,.35);margin-left:8px;">${txt('+'+Math.max(0,mbs.length-4)+' membros')}</span>`;
}

/* ══════════════════════════════════════════════
   MISSIONS RENDER
══════════════════════════════════════════════ */
function renderMissions(){
  const mis=MISSIONS[S.char]||MISSIONS.Ana;
  document.getElementById('mis-sub').textContent=txt(`Missões de ${S.char} · Nível ${S.lvl}`);
  const ul=document.getElementById('mis-list');
  const ordered=mis.map((m,i)=>({m,i,done:S.doneMissions.has(i)})).sort((a,b)=>Number(a.done)-Number(b.done));
  ul.innerHTML=ordered.map(({m,i,done})=>{
    const res=S.missionResults[i];
    return `<div class="mi${done?' done':''}" onclick="doMission(${i})"><div class="mi-ic">${m.ic}</div><div class="mi-body"><div class="mi-t">${txt(m.t)}</div><div class="mi-s">${txt(m.s)}</div><div class="mi-foot"><div class="mi-xp">${done?(res?.type==='best'?'? Certa':'Rev\u00ea a resposta'):'+'+m.xp+' XP'}</div><div class="mi-diff">${txt(m.diff)}</div><div class="mi-done-badge">${res?.type==='best'?'? Completo':'?? Completo'}</div></div></div></div>`;
  }).join('');
}

/* ══════════════════════════════════════════════
   MISSION QUIZ
══════════════════════════════════════════════ */
let activeMissionIdx=-1;
let mQuizAnswered=false;

function doMission(idx){
  activeMissionIdx=idx;
  mQuizAnswered=S.doneMissions.has(idx);
  renderMissionQuiz();
  go('s-quiz');
}

function renderMissionQuiz(){
  const m=MISSIONS[S.char][activeMissionIdx];
  document.getElementById('qprog').style.width='50%';
  document.getElementById('qctr').textContent=txt('Missão · Responde');
  const body=document.getElementById('quiz-body');
  body.innerHTML=`
    <div class="quiz-scen">
      <div class="quiz-av-line"><span class="quiz-av-em">${S.emoji}</span><span class="quiz-av-name">${S.char} · ${txt(m.t)}</span></div>
      <div style="font-size:13px;color:rgba(255,255,255,.7);line-height:1.6;margin-bottom:10px;">${missionContextText(m)}</div>
      <div style="font-size:13px;color:rgba(255,255,255,.5);font-style:italic;border-left:3px solid rgba(226,0,26,.5);padding-left:10px;">${missionQuoteText(m)}</div>
    </div>
    <div style="font-size:11px;font-weight:800;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:1.5px;">${txt('Qual é a tua decisão?')}</div>
    ${shuffle(m.choices.map((c,i)=>({...c,orig:i}))).map((c,i)=>`<button class="choice" id="mc${c.orig}" onclick="answerMission(${activeMissionIdx},${c.orig})"><span class="choice-em">${c.em}</span><span class="choice-t">${choiceText(c)}</span></button>`).join('')}
    <div class="after-panel" id="after-m"></div>
  `;
  if(mQuizAnswered && S.missionResults[activeMissionIdx]) answerMission(activeMissionIdx,S.missionResults[activeMissionIdx].choice);
}

function answerMission(mIdx,cIdx){
  if(mQuizAnswered && !S.missionResults[mIdx]) return;
  const reviewing=!!S.missionResults[mIdx];
  mQuizAnswered=true;
  const m=MISSIONS[S.char][mIdx];
  const c=m.choices[cIdx];
  // disable all
  m.choices.forEach((_,i)=>{const btn=document.getElementById('mc'+i); btn.onclick=null; btn.disabled=true; btn.style.pointerEvents='none';});
  // highlight
  const typeMap={best:'c-best',mid:'c-mid',bad:'c-bad'};
  document.getElementById('mc'+cIdx).classList.add(typeMap[c.type]||'c-bad');
  if(c.type!=='best'){
    // show best
    m.choices.forEach((ch,i)=>{if(ch.type==='best') document.getElementById('mc'+i).classList.add('c-best');});
  }
  // effects
  if(!reviewing){
    if(c.type==='best'){launchConfetti(); gainXP(c.xp,true);}
    else if(c.type==='mid'){gainXP(c.xp,false);}
    else{flashWrong();}
  }
  // mark done
  if(!reviewing){S.doneMissions.add(mIdx); S.missionResults[mIdx]={type:c.type,choice:cIdx}; saveState();}
  // after panel
  const ap=document.getElementById('after-m');
  ap.classList.add('show');
  ap.innerHTML=`
    <div class="after-tip-lbl">💡 Dica</div>
    <div class="after-tip-txt">${feedbackText(m.choices.find(x=>x.type==='best').tip,c.type)}</div>
    <div class="after-xp">${reviewing?'Resposta revista':(c.xp>0?`+<span>${c.xp} XP</span> ganhos`:'Sem XP desta vez')}</div>
    <div class="after-btns">
      <button class="ab-btn ab-home" onclick="nav('s-dash')">🏠 Início</button>
      <button class="ab-btn ab-next" onclick="nextMission()">Próxima missão →</button>
    </div>
  `;
  applyLanguage();
}

/* ══════════════════════════════════════════════
   XITIQUE RENDER
══════════════════════════════════════════════ */
function renderXitique(){
  const mbs=XI_MEMBERS[S.char]||XI_MEMBERS.Ana;
  const amt=XI_AMOUNTS[S.char]||500;
  const cyc=XI_CYCLES[S.char]||8;
  const turn=XI_TURNS[S.char]||5;
  const total=amt*mbs.length;
  const pct=Math.round((turn/cyc)*100);
  const nextMbr=mbs.find(m=>m.st==='next');
  const body=document.getElementById('xi-body');
  body.innerHTML=`
    <div class="xi-total">
      <div class="xi-total-lbl">💰 Total Acumulado</div>
      <div class="xi-total-amt">${total.toLocaleString()} MT</div>
      <div class="xi-total-sub">${mbs.length} membros × ${amt} MT × ${turn} turnos</div>
      <div class="xi-lock">🔒 Bloqueado até fim do ciclo${nextMbr?` · Turno de ${nextMbr.n.split(' ')[0]}`:''}</div>
    </div>
    <div class="xi-info"><span style="font-size:20px;">ℹ️</span><p>O valor fica <strong>bloqueado</strong> até ao fim do ciclo para proteger todos os membros. Só o beneficiário do turno pode levantar.</p></div>
    <div class="xi-gbox">
      <div class="xi-gtitle">Xitique</div>
      <div style="font-size:12px;color:rgba(255,255,255,.4);margin-bottom:10px;">${amt} MT/mês · ${mbs.length} membros · Turno ${turn}/${cyc}</div>
      <div class="xi-prog2"><div class="xi-pf2" style="width:${pct}%"></div></div>
      <div style="font-size:11px;color:rgba(255,255,255,.35);text-align:right;margin-top:5px;margin-bottom:12px;">${turn}/${cyc} turnos</div>
      ${mbs.map(m=>{
        const bdgMap={paid:'bdg-paid',late:'bdg-late',next:'bdg-nxt',wait:'bdg-wait'};
        const stMap={paid:'✓ Pagamentos em dia',late:`⚠️ Atraso ${m.late||1} mês(es)`,next:'→ Próximo beneficiário',wait:'Aguarda turno'};
        const stColor={paid:'paid',late:'late',next:'nxt',wait:''};
        const bdgLabel={paid:'Pago',late:'Atraso',next:'Próximo',wait:'Aguarda'};
        return `<div class="xi-mr">
          <div class="xi-mr-em">${m.em}</div>
          <div class="xi-mr-info">
            <div class="xi-mr-name">${m.n}</div>
            <div class="xi-mr-amt">${m.recv?amt+' MT recebido':amt+' MT contribuído'}</div>
            <div class="xi-mr-st ${stColor[m.st]||''}">${stMap[m.st]||''}</div>
          </div>
          <div class="bdg ${bdgMap[m.st]||'bdg-wait'}">${bdgLabel[m.st]||'—'}</div>
        </div>`;
      }).join('')}
    </div>
    <button class="btn-r" onclick="alert('💚 Contribuição de ${amt} MT via M-Pesa processada!\\n\\nComprovativo enviado por SMS. ✅')" style="margin-bottom:4px;">💚 Contribuir via M-Pesa — ${amt} MT</button>
  `;
}

/* ══════════════════════════════════════════════
   ACADEMIA RENDER
══════════════════════════════════════════════ */
function renderAcademia(){
  const charQ=AC_Q[S.char]||AC_Q.Ana;
  const themes=Object.keys(charQ);
  document.getElementById('ac-sub').textContent=txt(`Lições para ${S.char} · ${S.char==='Ana'?'Vendedora':S.char==='Carlos'?'Motorista':S.char==='Fátima'?'Estudante':'Agricultor'}`);
  // build theme buttons
  const tr=document.getElementById('theme-row');
  tr.innerHTML=['Aleatório',...themes].map(t=>`<button class="tbtn${S.currentTheme===t||(!S.currentTheme&&t==='Aleatório')?' sel':''}" onclick="filterTheme(this,'${t}')">${txt(t)}</button>`).join('');
  // build question list
  renderQList();
}

function filterTheme(el,theme){
  document.querySelectorAll('.tbtn').forEach(b=>b.classList.remove('sel'));
  el.classList.add('sel');
  S.currentTheme=theme;
  renderQList();
}

let acPool={};
function renderQList(){
  const charQ=AC_Q[S.char]||AC_Q.Ana;
  const themes=Object.keys(charQ);
  let questions=[];
  if(S.currentTheme==='Aleatório'||!S.currentTheme){
    themes.forEach(t=>charQ[t].forEach((q,i)=>questions.push({...q,theme:t,gid:t+'_'+i})));
  } else {
    (charQ[S.currentTheme]||[]).forEach((q,i)=>questions.push({...q,theme:S.currentTheme,gid:S.currentTheme+'_'+i}));
  }
  questions=shuffle(questions).sort((a,b)=>Number(S.doneQuestions.has(a.gid))-Number(S.doneQuestions.has(b.gid))); acPool={}; questions.forEach(q=>{acPool[q.gid]=q;});
  const list=document.getElementById('qlist');
  list.innerHTML=questions.map(q=>{
    const done=S.doneQuestions.has(q.gid);
    const xpBest=q.choices.find(c=>c.type==='best')?.xp||40;
    return `<div class="qcard${done?' done':''}" onclick="startAcQ('${q.gid}')">
      <div class="qcard-theme">${txt(q.theme)}${done?' · ✅ '+txt('Completo'):''}</div>
      <div class="qcard-q">${challengeText(q)}</div>
      <div class="qcard-foot">
        <div class="qcard-xp">+${xpBest} XP</div>
        <div class="qcard-done-badge">✅ ${txt('Respondida')}</div>
      </div>
    </div>`;
  }).join('');
}

/* ══════════════════════════════════════════════
   ACADEMIA QUIZ
══════════════════════════════════════════════ */
let activeQGid='';
let acAnswered=false;

function startAcQ(gid){
  activeQGid=gid;
  acAnswered=S.doneQuestions.has(gid);
  renderAcQuiz();
  go('s-quiz');
}

function renderAcQuiz(){
  const q=acPool[activeQGid];
  if(!q) return;
  document.getElementById('qprog').style.width='60%';
  document.getElementById('qctr').textContent=txt('Academia · '+q.theme);
  const body=document.getElementById('quiz-body');
  body.innerHTML=`
    <div class="quiz-scen">
      <div class="quiz-av-line"><span class="quiz-av-em">${S.emoji}</span><span class="quiz-av-name">${S.char} · ${txt(q.theme)}</span></div>
      <div class="quiz-q">${challengeText(q)}</div>
    </div>
    <div style="font-size:11px;font-weight:800;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:1.5px;">${txt('Escolhe a melhor resposta:')}</div>
    ${shuffle(q.choices.map((c,i)=>({...c,orig:i}))).map((c,i)=>`<button class="choice" id="ac${c.orig}" onclick="answerAcQ(${c.orig})"><span class="choice-em">${c.em}</span><span class="choice-t">${choiceText(c)}</span></button>`).join('')}
    <div class="after-panel" id="after-ac"></div>
  `;
  if(acAnswered && S.questionResults[activeQGid]) answerAcQ(S.questionResults[activeQGid].choice);
}

function answerAcQ(cIdx){
  if(acAnswered && !S.questionResults[activeQGid]) return;
  const reviewing=!!S.questionResults[activeQGid];
  acAnswered=true;
  const q=acPool[activeQGid];
  const c=q.choices[cIdx];
  q.choices.forEach((_,i)=>{const btn=document.getElementById('ac'+i); btn.onclick=null; btn.disabled=true; btn.style.pointerEvents='none';});
  const typeMap={best:'c-best',mid:'c-mid',bad:'c-bad'};
  document.getElementById('ac'+cIdx).classList.add(typeMap[c.type]||'c-bad');
  if(c.type!=='best') q.choices.forEach((ch,i)=>{if(ch.type==='best') document.getElementById('ac'+i).classList.add('c-best');});
  if(!reviewing){
    if(c.type==='best'){launchConfetti(); gainXP(c.xp,true);}
    else if(c.type==='mid'){gainXP(c.xp,false);}
    else{flashWrong();}
  }
  // mark done
  if(!reviewing){S.doneQuestions.add(activeQGid); S.questionResults[activeQGid]={type:c.type,choice:cIdx};
  S.total_q++; if(c.type==='best') S.correct++; saveState();}
  const ap=document.getElementById('after-ac');
  ap.classList.add('show');
  const bestTip=q.tip||'';
  const bestChoice=q.choices.find(x=>x.type==='best');
  ap.innerHTML=`
    <div class="after-tip-lbl">💡 ${c.type==='best'?'Excelente!':c.type==='mid'?'Quase lá!':'Resposta Errada'}</div>
    <div class="after-tip-txt">${feedbackText(bestTip,c.type)}</div>
    ${c.type!=='best'?`<div class="after-best"><strong>✅ Melhor resposta:</strong> ${choiceText(bestChoice||{})}</div>`:''}
    <div class="after-xp">${reviewing?'Resposta revista':(c.xp>0?`+<span>${c.xp} XP</span> ganhos`:'Sem XP desta vez')}</div>
    <div class="after-btns">
      <button class="ab-btn ab-home" onclick="nav('s-dash')">🏠 Início</button>
      <button class="ab-btn ab-next" onclick="nextAcademiaQuestion()">Próxima pergunta →</button>
    </div>
  `;
  applyLanguage();
}

/* ══════════════════════════════════════════════
   XP + LEVEL SYSTEM
══════════════════════════════════════════════ */
function gainXP(amount,isBest){
  if(amount<=0) return;
  const oldLvl=S.lvl;
  S.xp+=amount;
  S.savings+=Math.round(amount*10);
  if(isBest){S.missions_done++; S.badges=Math.floor(S.missions_done/3);}
  S.lvl=xpToLevel(S.xp);
  if(S.lvl>oldLvl) setTimeout(showLvlUp,800);
  updateDashStats();
}

function updateDashStats(){
  document.getElementById('d-sav').textContent=S.savings.toLocaleString()+' MT';
  document.getElementById('d-lvl').textContent=S.lvl+'/10';
  document.getElementById('d-lvl-hint').textContent=lvlName(S.lvl);
  document.getElementById('d-xp').textContent=S.xp;
}

function showLvlUp(){
  const el=document.getElementById('lvlup');
  document.getElementById('lvlup-t').textContent='Nível '+S.lvl+'!';
  document.getElementById('lvlup-s').textContent=`Tornaste-te ${lvlName(S.lvl)}!\nContinua a aprender!`;
  el.classList.add('show');
  launchConfetti();
}
function closeLvlup(){document.getElementById('lvlup').classList.remove('show');}

/* ══════════════════════════════════════════════
   PROFILE
══════════════════════════════════════════════ */
function renderProfile(){
  document.getElementById('prof-av').textContent=S.emoji||'👤';
  document.getElementById('prof-name').textContent=S.nome||S.char;
  document.getElementById('prof-num').textContent=S.num||'+258 84 000 0000';
  document.getElementById('prof-lvl').textContent=txt(`⭐ Nível ${S.lvl} · ${S.xp} XP · ${lvlName(S.lvl)}`);
  document.getElementById('p-nome').textContent=S.nome||'—';
  document.getElementById('p-num').textContent=S.num||'—';
  document.getElementById('p-email').textContent=S.email||'—';
  document.getElementById('p-dob').textContent=S.dob||'—';
  document.getElementById('p-prov').textContent=S.prov||'—';
  document.getElementById('p-lang').textContent=S.langCode==='en'?'English':'Português';
  document.getElementById('p-sav').textContent=S.savings.toLocaleString()+' MT';
  document.getElementById('ps-mis').textContent=S.missions_done;
  document.getElementById('ps-xp').textContent=S.xp;
  document.getElementById('ps-bdg').textContent=S.badges;
  document.getElementById('p-bdg').textContent=txt(S.badges+' badges conquistados');
  const pct=S.total_q>0?Math.round((S.correct/S.total_q)*100):0;
  document.getElementById('p-stats').textContent=txt(`${S.missions_done} missões · ${pct}% acertos`);
  document.getElementById('p-char-ic').textContent=S.emoji||'👤';
  document.getElementById('p-char-name').textContent=S.char||'—';
  document.getElementById('p-char-role').textContent=txt(S.role||'—');
  document.getElementById('p-lvl-desc').textContent=txt(`${S.lvl}/10 · ${lvlName(S.lvl)} · ${S.xp} XP`);
  applyLanguage();
}

function editField(field){
  const labels={nome:'Nome Completo',num:'Número M-Pesa',email:'Email',dob:'Data de Nascimento',prov:'Província',lang:'Idioma'};
  const curr={nome:S.nome,num:S.num,email:S.email,dob:S.dob,prov:S.prov,lang:S.lang};
  if(field==='dob'){pickDateWithCalendar();return;}
  const hints={email:'Coloca ou actualiza o teu email:',prov:'Escolhe a província: Maputo, Gaza, Inhambane, Sofala, Manica, Tete, Zambézia, Nampula, Niassa ou Cabo Delgado.'};
  const val=prompt(hints[field]||`Alterar ${labels[field]}:`,curr[field]||'');
  if(val===null) return;
  const clean=val.trim();
  if(clean===''){
    if(['email','dob','prov'].includes(field)){S[field]='';saveState();renderProfile();}
    return;
  }
  if(field==='num'){
    if(!isVodacomPhone(clean)){alert('O número deve ser Vodacom e começar por 84 ou 85.');return;}
    S.num=formatPhone(clean);
  } else if(field==='email'){
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)){alert('Email inválido. Exemplo: nome@email.com');return;}
    S.email=clean;
  } else if(field==='dob'){
    const dob=parseMozDate(clean);
    if(!dob.ok){alert(dob.msg);return;}
    S.dob=dob.value;
  } else if(field==='prov'){
    const provinces=['Maputo','Gaza','Inhambane','Sofala','Manica','Tete','Zambézia','Nampula','Niassa','Cabo Delgado'];
    const found=provinces.find(p=>p.toLowerCase()===clean.toLowerCase());
    if(!found){alert('Província inválida. Escolhe uma província de Moçambique.');return;}
    S.prov=found;
  } else {
    S[field]=clean;
  }
  saveState();renderProfile();
}

function earnedBadgeList(){
  const candidates=[
    {at:1,name:'Primeira Resposta',desc:'Respondeste ao primeiro desafio.'},
    {at:3,name:'Poupa Esperto',desc:'Completaste 3 respostas correctas.'},
    {at:6,name:'Guardião do PIN',desc:'Mostraste bons hábitos de segurança.'},
    {at:9,name:'Mestre do Xitique',desc:'Avançaste nas missões de poupança em grupo.'}
  ];
  return candidates.filter((_,i)=>i<S.badges);
}
function showBadges(){
  const list=earnedBadgeList();
  if(!list.length){alert(txt('Ainda não conquistaste badges. Responde correctamente às missões e perguntas da Academia para desbloquear conquistas.'));return;}
  alert(txt('Badges conquistados:')+'\n\n'+list.map(b=>'🏆 '+txt(b.name)+' — '+txt(b.desc)).join('\n'));
}
function showStats(){
  const wrong=Math.max(0,S.total_q-S.correct);
  const pct=S.total_q>0?Math.round((S.correct/S.total_q)*100):0;
  alert(txt('Estatísticas')+'\n\n'+txt('Acertos')+': '+S.correct+'\n'+txt('Errados')+': '+wrong+'\n'+txt('Total respondido')+': '+S.total_q+'\n'+txt('Taxa de acerto')+': '+pct+'%');
}

/* ══════════════════════════════════════════════
   EFFECTS
══════════════════════════════════════════════ */
function launchConfetti(){
  const c=document.getElementById('confetti-c');
  const cols=['#E2001A','#F5A623','#00A651','#FFD166','#FF6B6B','#66FFB2','#fff','#FF9F43'];
  for(let i=0;i<55;i++){
    const p=document.createElement('div');
    p.className='cp';
    const size=6+Math.random()*8;
    p.style.cssText=`left:${Math.random()*100}%;top:-10px;background:${cols[Math.floor(Math.random()*cols.length)]};width:${size}px;height:${size}px;border-radius:${Math.random()>.5?'50%':'2px'};animation-duration:${1.5+Math.random()*2}s;animation-delay:${Math.random()*.5}s;`;
    c.appendChild(p);
    setTimeout(()=>p.remove(),3000);
  }
}
function flashWrong(){
  const f=document.getElementById('wflash');
  f.style.display='block';
  setTimeout(()=>{f.style.display='none';},480);
}




window.TxigitalView = { renderDash, renderMissions, renderMissionQuiz, renderXitique, renderAcademia, renderQList, renderAcQuiz, renderProfile, updateDashStats, showLvlUp, closeLvlup, launchConfetti, flashWrong, applyTheme, applyLanguage };

