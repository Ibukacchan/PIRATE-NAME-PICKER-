(() => {
  "use strict";
  const SAMPLE_NAMES = ["Yangan","Pagaran","Salcedo","Fortallio","Abuzo","Ledesma","Arias","Abrio","Intia","Amora","Cabalang","Labial, L.","Gulapo, C.","Naluan","Alaba","Miculob"];
  const STORAGE_KEY = "grandLineClassroomRoster_v1";
  const PICKED_KEY = "grandLinePicked_v1";
  const $ = (id) => document.getElementById(id);
  let students = loadRoster();
  let picked = loadPicked();
  let crews = [];
  let audioCtx = null, musicTimer = null, musicOn = false, sfxOn = true, deferredPrompt = null;

  function loadRoster() {
    try { const v = JSON.parse(localStorage.getItem(STORAGE_KEY)); if (Array.isArray(v)) return v.filter(x => typeof x === "string" && x.trim()); } catch {}
    return [...SAMPLE_NAMES];
  }
  function loadPicked() { try { const v = JSON.parse(localStorage.getItem(PICKED_KEY)); return Array.isArray(v) ? v : []; } catch { return []; } }
  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(students)); localStorage.setItem(PICKED_KEY, JSON.stringify(picked)); }
  function escapeHTML(s) { return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  function toast(message) { const el=$("toast"); el.textContent=message; el.classList.add("show"); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove("show"),2300); }
  function updateCounts() {
    $("studentCount").textContent=students.length; $("remainingCount").textContent=Math.max(0,students.length-picked.filter(n=>students.includes(n)).length);
    $("rosterCount").textContent=students.length; $("groupRosterCount").textContent=students.length;
    $("drawnLabel").textContent=picked.filter(n=>students.includes(n)).length+" drawn";
    $("groupHint").textContent=students.length+" students will be distributed "+($("groupMode").value==="groups"?"as evenly as possible.":"into groups of the selected size.");
  }
  function renderRoster() {
    $("rosterList").innerHTML = students.map((name,i)=>`<li class="roster-item"><span class="number">${String(i+1).padStart(2,"0")}</span><span class="student">${escapeHTML(name)}</span><button class="remove-btn" data-remove="${i}" aria-label="Remove ${escapeHTML(name)}" title="Remove">×</button></li>`).join("") || '<li class="empty-state">Your roster is empty. Add a name to begin.</li>';
    $("rosterList").querySelectorAll("[data-remove]").forEach(btn=>btn.addEventListener("click",()=>{const i=Number(btn.dataset.remove);students.splice(i,1);picked=picked.filter(n=>students.includes(n));save();renderAll();toast("Crew member removed.");}));
    updateCounts();
  }
  function renderRecent() {
    const recent=picked.filter(n=>students.includes(n)).slice(-8).reverse();
    $("recentList").innerHTML=recent.length?recent.map(n=>`<span class="recent-chip">${escapeHTML(n)}</span>`).join(""):'<span class="empty-state">No names drawn yet. The sea is quiet...</span>';
    updateCounts();
  }
  function renderAll(){renderRoster();renderRecent();}
  function playTone(freq,duration,type="sine",volume=.08,delay=0) {
    if(!sfxOn) return;
    try { audioCtx ||= new (window.AudioContext||window.webkitAudioContext)(); if(audioCtx.state==="suspended") audioCtx.resume(); const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.setValueAtTime(freq,audioCtx.currentTime+delay);g.gain.setValueAtTime(volume,audioCtx.currentTime+delay);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+delay+duration);o.connect(g);g.connect(audioCtx.destination);o.start(audioCtx.currentTime+delay);o.stop(audioCtx.currentTime+delay+duration); } catch {}
  }
  function sound(kind) {
    if(!sfxOn) return;
    if(kind==="click"){playTone(420,.07,"triangle",.035);}
    if(kind==="reveal"){[392,523,659,784].forEach((f,i)=>playTone(f,.28,"triangle",.07,i*.11));}
    if(kind==="shuffle"){[220,330,440,660].forEach((f,i)=>playTone(f,.13,"sawtooth",.035,i*.07));}
    if(kind==="reset"){playTone(330,.13,"sine",.05);playTone(220,.22,"sine",.04,.12);}
  }
  function pickName() {
    if(!students.length){toast("Add students to your roster first.");return;}
    const include=$("includePicked").checked || !$("noRepeat").checked;
    const pool=include?students:students.filter(n=>!picked.includes(n));
    if(!pool.length){toast("Everyone has been picked! Reset the draw to start again.");return;}
    sound("shuffle"); $("pickBtn").disabled=true; $("posterCaption").textContent="The waves are turning... who will fate choose?";
    $("pickedName").innerHTML="THE SEA<br>IS CALLING"; $("bountyValue").textContent="••••••";
    setTimeout(()=>{
      const name=pool[Math.floor(Math.random()*pool.length)];
      $("pickedName").textContent=name.toUpperCase(); $("bountyValue").textContent=(Math.floor(Math.random()*9)+1)+",000,000";
      $("posterCaption").textContent="The next adventurer has been chosen. Welcome aboard, "+name+"!";
      $("wantedPoster").classList.remove("reveal"); void $("wantedPoster").offsetWidth; $("wantedPoster").classList.add("reveal");
      if(!picked.includes(name)) picked.push(name); save(); renderRecent(); sound("reveal"); $("pickBtn").disabled=false;
    },650);
  }
  function resetPicks(){picked=[];save();$("pickedName").innerHTML="YOUR NEXT<br>ADVENTURER";$("bountyValue").textContent="••••••";$("posterCaption").textContent="Your next crew member is waiting to be revealed.";renderRecent();sound("reset");toast("The draw has been reset.");}
  const CREW_NAMES=["Straw Hat Crew","Heart Pirates","Red-Haired Pirates","Whitebeard Pirates","Kuja Pirates","Sun Pirates","Kid Pirates","Fire Tank Pirates","Roger Pirates","Buggy's Delivery"];
  function generateGroups(){
    if(!students.length){toast("Add students to your roster first.");return;}
    let list=[...students];if($("shuffleGroups").checked){for(let i=list.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[list[i],list[j]]=[list[j],list[i]];}}
    const mode=$("groupMode").value, value=Math.max(1,Math.min(50,parseInt($("groupValue").value,10)||1));
    let count=mode==="groups"?Math.min(value,list.length):Math.ceil(list.length/value);
    crews=Array.from({length:count},()=>[]);
    if(mode==="groups"){list.forEach((n,i)=>crews[i%count].push(n));}
    else list.forEach((n,i)=>crews[Math.floor(i/value)].push(n));
    $("groupsOutput").innerHTML=`<div class="crew-grid">${crews.map((crew,i)=>`<article class="crew-card"><div class="crew-head"><strong>⚓ ${CREW_NAMES[i%CREW_NAMES.length]}</strong><span>CREW ${String(i+1).padStart(2,"0")} · ${crew.length} MEMBERS</span></div><ul class="crew-members">${crew.map(n=>`<li>${escapeHTML(n)}</li>`).join("")}</ul></article>`).join("")}</div>`;
    $("copyGroupsBtn").disabled=false;sound("reveal");toast("Your crews are ready to sail!");
  }
  function copyGroups(){
    const text=crews.map((crew,i)=>`${CREW_NAMES[i%CREW_NAMES.length]}\\n${crew.map((n,j)=>`${j+1}. ${n}`).join("\\n")}`).join("\\n\\n");
    if(navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(()=>toast("Crew assignments copied!")).catch(()=>fallbackCopy(text));
    else fallbackCopy(text);
  }
  function fallbackCopy(text){const t=document.createElement("textarea");t.value=text;document.body.appendChild(t);t.select();try{document.execCommand("copy");toast("Crew assignments copied!");}catch{toast("Copy is unavailable in this browser.");}t.remove();}
  function setGroupMode(){const mode=$("groupMode").value;$("groupValueLabel").innerHTML=(mode==="groups"?"Number of groups":"Students per group")+`<input type="number" id="groupValue" min="1" max="50" value="${mode==="groups"?Math.max(1,Math.min(4,students.length)):Math.max(1,Math.ceil(students.length/4))}">`;updateCounts();}
  function parseCSV(text){const rows=[];let row=[],cell="",quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'&&quoted&&text[i+1]==='"'){cell+='"';i++;}else if(c==='"'){quoted=!quoted;}else if(c===","&&!quoted){row.push(cell.trim());cell="";}else if((c==="\\n"||c==="\\r")&&!quoted){if(c==="\\r"&&text[i+1]==="\\n")i++;row.push(cell.trim());if(row.some(Boolean))rows.push(row);row=[];cell="";}else cell+=c;}row.push(cell.trim());if(row.some(Boolean))rows.push(row);return rows;}
  function exportCSV(){const csv="Name\\r\\n"+students.map(n=>'"'+n.replace(/"/g,'""')+'"').join("\\r\\n");const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="grand-line-class-roster.csv";a.click();URL.revokeObjectURL(a.href);toast("Roster exported as CSV.");}
  function importCSV(file){const reader=new FileReader();reader.onload=()=>{const rows=parseCSV(String(reader.result||""));let names=rows.flat().filter(Boolean);if(names.length&&/^(name|student name)$/i.test(names[0]))names.shift();names=[...new Set(names)];if(!names.length){toast("No names found in that CSV.");return;}students=names;picked=[];save();renderAll();toast(names.length+" names imported.");};reader.readAsText(file);}
  function startMusic(){try{audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();audioCtx.resume();musicOn=true;$("musicToggle").setAttribute("aria-pressed","true");$("musicToggle").innerHTML="♫ <span>Music on</span>";let step=0;const notes=[110,146.83,164.81,146.83,123.47,164.81,146.83,130.81];musicTimer=setInterval(()=>{if(!musicOn)return;const f=notes[step++%notes.length];const o=audioCtx.createOscillator(),g=audioCtx.createGain(),filter=audioCtx.createBiquadFilter();o.type="triangle";o.frequency.value=f;filter.type="lowpass";filter.frequency.value=420;g.gain.setValueAtTime(.0001,audioCtx.currentTime);g.gain.linearRampToValueAtTime(.018,audioCtx.currentTime+.15);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+1.25);o.connect(filter);filter.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+1.3);},850);}catch{toast("Audio is not supported in this browser.");}}
  function stopMusic(){musicOn=false;if(musicTimer)clearInterval(musicTimer);$("musicToggle").setAttribute("aria-pressed","false");$("musicToggle").innerHTML="♫ <span>Music off</span>";}
  function init(){
    renderAll();
    document.querySelectorAll(".tab").forEach(tab=>tab.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t===tab));document.querySelectorAll(".tab-panel").forEach(p=>p.classList.remove("active"));$(tab.dataset.tab+"Panel").classList.add("active");}));
    $("pickBtn").addEventListener("click",pickName);$("resetPicksBtn").addEventListener("click",resetPicks);
    $("includePicked").addEventListener("change",()=>{if($("includePicked").checked)$("noRepeat").checked=false;});
    $("noRepeat").addEventListener("change",()=>{if($("noRepeat").checked)$("includePicked").checked=false;});
    $("groupMode").addEventListener("change",setGroupMode);$("generateGroupsBtn").addEventListener("click",generateGroups);$("copyGroupsBtn").addEventListener("click",copyGroups);
    $("goRosterBtn").addEventListener("click",()=>document.querySelector('[data-tab="roster"]').click());
    $("addForm").addEventListener("submit",e=>{e.preventDefault();const name=$("newName").value.trim();if(!name)return;if(students.some(n=>n.toLowerCase()===name.toLowerCase())){toast("That name is already on the roster.");return;}students.push(name);save();renderAll();$("newName").value="";toast("New crew member added.");});
    $("csvImport").addEventListener("change",e=>{if(e.target.files[0])importCSV(e.target.files[0]);e.target.value="";});$("exportBtn").addEventListener("click",exportCSV);
    $("restoreBtn").addEventListener("click",()=>{if(confirm("Replace your current roster with the 16 sample names?")){students=[...SAMPLE_NAMES];picked=[];save();renderAll();toast("Sample roster restored.");}});
    $("musicToggle").addEventListener("click",()=>musicOn?stopMusic():startMusic());
    $("sfxToggle").addEventListener("click",()=>{sfxOn=!sfxOn;$("sfxToggle").setAttribute("aria-pressed",String(sfxOn));$("sfxToggle").innerHTML=sfxOn?"🔊 <span>Effects on</span>":"🔇 <span>Effects off</span>";if(sfxOn)sound("click");});
    document.addEventListener("click",e=>{if(e.target.closest("button")&&!["pickBtn","resetPicksBtn","generateGroupsBtn","copyGroupsBtn","musicToggle","sfxToggle"].includes(e.target.closest("button").id))sound("click");});
    window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("installBtn").hidden=false;});
    $("installBtn").addEventListener("click",async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$("installBtn").hidden=true;});
    if("serviceWorker" in navigator && (location.protocol==="https:"||location.hostname==="localhost"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
  }
  init();
})();