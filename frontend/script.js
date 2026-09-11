let API_KEY = localStorage.getItem('prasanna_key');
if(!API_KEY){
  API_KEY = prompt('Enter your Gemini API Key:');
  if(API_KEY) localStorage.setItem('prasanna_key', API_KEY);
}
// // ===== 2. SMART MODELS (ఒకటిటిfail అయితేతేnext auto try) =====
const MODELS = ["gemini-3.6-flash", "gemini-flash-latest"];
const chat=document.getElementById('chat');
const input=document.getElementById('msg');
const micBtn=document.getElementById('mic-btn');
// // ===== 3. GEMINI BRAIN (auto-fallback) =====
async function callGemini(p){
  let lastErr;
  fofor(const m of MODELS){
    try{
      const res=await fetch("https://generativelanguage.googleapis.com/v1beta/models/"+m+":generateContent?key="+API_KEY,
                            {method:"POST",headers:{"Content-TyType":"application/j/json"},
                             body:JSON.stringifyfy({contents:[{parts:[{text:p}]}]})});
      const data=await res.json();
      if(data.error){
        lastErr=new Error(data.error.message);
        if(/high demand|temporar|quota|rate|unavailable|no longeravailable|deprecated/i.test(data.error.message)) continue;
        throw lastErr;
      }
      return data.candidates[0].content.parts[0].text;
    }catch(e){ lastErr=e; }
  }throw lastErr;
}async function askGemini(p){
  add('P.R.A.S.A.N.N.A: Thinking...','ai');
  try{
    const reply=await callGemini(p);
    chat.lastChild.innerTeText='P.R.A.S.A.N.N.A: '+reply;speak(reply); // reply వచ్చి చ్చి న వెవెంటనేనేVOICE
  }catch(e){
    chat.lastChild.innerTeText='P.R.A.S.A.N.N.A: ERROR - '+e.message;
  }
}
// // ===== 4. SPEECH RECOGNITION (వినడం) =====
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const rec=new SR(); rec.lang='en-US'; // TeTelugu కికి'te-IN'
rec.onresult=(e)=>{const t=e.results[0][0].transcript;add('YOU: '+t,'user');askGemini(t);};
micBtn.onclick=()=>{rec.start();micBtn.innerTeText='LISTENING...';};
rec.onend=()=>{micBtn.innerTeText='🎙';};
// // ===== 5. TEXT-T-TO-SPEECH (మామాట్లాటట్లాడటం) =====
let voices=[];
function loadVoVoices(){ voices=speechSynthesis.getVoVoices(); }
loadVoVoices();
speechSynthesis.onvoiceschanged=loadVoVoices;
function speak(t){
  const u=new SpeechSynthesisUtterance(t);
  u.rate=1.05; u.pitch=0.85;
  const v=voices.find(v=>v.lang.startsWith('en'));
  if(v) u.voice=v;
  speechSynthesis.speak(u);
}// // ===== 6. TEXT SEND BUTTON =====
document.getElementById('send').onclick=()=>{
  const t=input.value.trim(); if(!t)return;
  add('YOU: '+t,'user'); input.value=''; askGemini(t);
};
function add(t,w){const d=document.createElement('div');d.className='msg'+w;d.innerTeText=t;chat.appendChild(d);chat.scrollToTop=chat.scrollHeight;}
