const stepHeads=[...document.querySelectorAll('.step-head')];
stepHeads.forEach(head=>head.addEventListener('click',()=>{const body=head.nextElementSibling;const open=head.getAttribute('aria-expanded')==='true';head.setAttribute('aria-expanded',String(!open));body.classList.toggle('open',!open);}));

document.querySelectorAll('[data-jump]').forEach(btn=>btn.addEventListener('click',()=>document.getElementById(btn.dataset.jump)?.scrollIntoView({behavior:'smooth',block:'start'})));

let allOpen=false;document.getElementById('toggle-all').addEventListener('click',e=>{allOpen=!allOpen;stepHeads.forEach(h=>{h.setAttribute('aria-expanded',String(allOpen));h.nextElementSibling.classList.toggle('open',allOpen)});e.currentTarget.textContent=allOpen?'全部とじる':'全部ひらく';});

document.querySelectorAll('[data-copy]').forEach(btn=>btn.addEventListener('click',async()=>{const text=document.getElementById(btn.dataset.copy)?.textContent||'';await navigator.clipboard.writeText(text);const old=btn.textContent;btn.textContent='コピー済み';setTimeout(()=>btn.textContent=old,1400);}));

const checks=[...document.querySelectorAll('[data-check]')];const key='codexWebGptGuideProgress';let saved={};try{saved=JSON.parse(localStorage.getItem(key)||'{}')}catch{}
checks.forEach(c=>{c.checked=!!saved[c.dataset.check];c.addEventListener('change',()=>{saved[c.dataset.check]=c.checked;localStorage.setItem(key,JSON.stringify(saved));renderMaster();});});
function renderMaster(){const host=document.getElementById('master-checklist');const labels={release:'Releasesを確認',launcher:'ランチャーをインストール',setup:'基本セットアップ完了',models:'ChatGPT Webモデル表示',mcp:'MCPランタイム検証（任意）',test:'実動作テスト完了'};host.innerHTML='';Object.entries(labels).forEach(([k,v])=>{const l=document.createElement('label');l.innerHTML=`<input type="checkbox" ${saved[k]?'checked':''} disabled><span>${v}</span>`;host.appendChild(l);});}renderMaster();

const rate=document.getElementById('tts-rate');const ttsKey='codexWebGptGuideTtsRate';rate.value=localStorage.getItem(ttsKey)||'1.0';rate.addEventListener('change',()=>localStorage.setItem(ttsKey,rate.value));
function readableText(){const clone=document.querySelector('main').cloneNode(true);clone.querySelectorAll('button,pre,.codebox,.sources').forEach(n=>n.remove());return clone.innerText.replace(/\s+/g,' ').trim();}
document.getElementById('tts-start').addEventListener('click',()=>{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(readableText());u.lang='ja-JP';u.rate=Number(rate.value);const voices=speechSynthesis.getVoices();const ja=voices.find(v=>v.lang?.startsWith('ja'));if(ja)u.voice=ja;speechSynthesis.speak(u);});
document.getElementById('tts-stop').addEventListener('click',()=>speechSynthesis.cancel());
