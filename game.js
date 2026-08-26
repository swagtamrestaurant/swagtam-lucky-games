const rewards=[
"FREE FRIES","TRY AGAIN","10% OFF","SORRY","FREE KITKAT",
"5% OFF","TRY AGAIN","FREE COLD DRINK","20% OFF","CHOICE OF SONG",
"SORRY","5% OFF","FREE FRIES","10% OFF","TRY AGAIN"
];

const sameDay=["FREE FRIES","FREE KITKAT","FREE COLD DRINK","CHOICE OF SONG"];
const nextVisit=["5% OFF","10% OFF","20% OFF"];

const grid=document.getElementById("chitGrid");
const nameEl=document.getElementById("customerName");
const dateEl=document.getElementById("visitDate");
const result=document.getElementById("result");
const message=document.getElementById("resultMessage");
const coupon=document.getElementById("coupon");
const couponNumber=document.getElementById("couponNumber");
const outName=document.getElementById("outName");
const outDate=document.getElementById("outDate");
const outReward=document.getElementById("outReward");
const outValidity=document.getElementById("outValidity");

function today(){
  const d=new Date();
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}
dateEl.value=today();

function makeChit(reward){
  const el=document.createElement("button");
  el.className="chit";
  el.dataset.reward=reward;
  el.innerHTML='<span class="question">?</span><span class="face"></span>';
  el.addEventListener("click",()=>pick(el));
  return el;
}

function render(shuffle=true){
  grid.innerHTML="";
  let arr=[...rewards];
  if(shuffle) arr.sort(()=>Math.random()-0.5);
  arr.forEach(r=>grid.appendChild(makeChit(r)));
}
render(true);

function pick(chit){
  if(!nameEl.value.trim()){
    alert("Please enter customer name first.");
    nameEl.focus(); return;
  }
  const reward=chit.dataset.reward;
  chit.classList.add("opened");
  chit.querySelector(".face").innerHTML=icon(reward)+"<br>"+reward;
  if(reward==="TRY AGAIN"){
    message.innerHTML="<h2>🔄 TRY AGAIN!</h2><p>The remaining chits are exchanging places...</p>";
    coupon.classList.add("hidden");
    result.classList.remove("hidden");
    setTimeout(shuffleRemaining,700);
    return;
  }
  if(reward==="SORRY"){
    message.innerHTML="<h2>😔 Better Luck Next Time!</h2><p>Thank you for playing at Swagtam.</p>";
    coupon.classList.add("hidden");
    result.classList.remove("hidden");
    return;
  }
  showCoupon(reward);
}

function shuffleRemaining(){
  const opened=[...grid.children].filter(x=>x.classList.contains("opened"));
  const closed=[...grid.children].filter(x=>!x.classList.contains("opened"));
  closed.sort(()=>Math.random()-0.5);
  [...opened,...closed].forEach(x=>grid.appendChild(x));
  closed.forEach((x,i)=>{
    x.style.opacity="0";
    x.style.transform="scale(.8) rotate(5deg)";
    setTimeout(()=>{x.style.opacity="1";x.style.transform="scale(1) rotate(0deg)"},80+i*35);
  });
}

function showCoupon(reward){
  const code="SWG-"+new Date().getTime().toString(36).toUpperCase()+"-"+Math.floor(100+Math.random()*900);
  couponNumber.textContent="Coupon No: "+code;
  outName.textContent=nameEl.value.trim();
  outDate.textContent=formatDate(dateEl.value);
  outReward.textContent=icon(reward)+" "+reward;
  if(sameDay.includes(reward)){
    outValidity.innerHTML="✅ VALID TODAY ONLY<br><br>Please claim this reward before leaving Swagtam today.";
  }else{
    outValidity.innerHTML="🎟️ VALID ON NEXT VISIT ONLY<br><br>This discount cannot be used today. Bring/show this coupon on your next visit.<br><br><b>ONE TIME USE ONLY</b>";
  }
  coupon.dataset.code=code;
  coupon.classList.remove("hidden");
  message.innerHTML="<h2>🎉 CONGRATULATIONS! 🎉</h2><p>You won a reward!</p>";
  result.classList.remove("hidden");
  confetti();
  makeQR(code);
}

function formatDate(v){
  if(!v)return "";
  const p=v.split("-");
  return p[2]+"-"+p[1]+"-"+p[0];
}

function icon(r){
  return { "FREE FRIES":"🍟","FREE KITKAT":"🍫","FREE COLD DRINK":"🥤",
  "CHOICE OF SONG":"🎵","5% OFF":"💰","10% OFF":"💰","20% OFF":"🔥",
  "TRY AGAIN":"🔄","SORRY":"😔"}[r]||"🎁";
}

function makeQR(code){
  const qr=document.getElementById("qr");
  qr.innerHTML="";
  if(window.QRCode){
    new QRCode(qr,{text:"SWAGTAM|"+code+"|"+nameEl.value.trim()+"|"+dateEl.value,width:150,height:150});
  }else{
    qr.innerHTML="<p><b>"+code+"</b></p><small>QR library not loaded</small>";
  }
}

document.getElementById("printBtn").onclick=()=>window.print();

document.getElementById("shareBtn").onclick=async()=>{
  const text=`Swagtam Reward Coupon
Coupon: ${coupon.dataset.code}
Customer: ${nameEl.value.trim()}
Reward: ${outReward.textContent}
Visit: ${formatDate(dateEl.value)}`;
  if(navigator.share){
    await navigator.share({title:"Swagtam Reward Coupon",text});
  }else{
    await navigator.clipboard.writeText(text);
    alert("Coupon details copied. You can paste them into WhatsApp.");
  }
};

document.getElementById("newBtn").onclick=()=>{
  nameEl.value="";
  dateEl.value=today();
  result.classList.add("hidden");
  render(true);
  window.scrollTo({top:0,behavior:"smooth"});
};

function confetti(){
  for(let i=0;i<70;i++){
    const c=document.createElement("i");
    c.style.position="fixed"; c.style.left=Math.random()*100+"vw"; c.style.top="-15px";
    c.style.width="9px"; c.style.height="9px"; c.style.zIndex="9999";
    c.style.background=["#ff1744","#ffeb3b","#00e676","#2196f3","#e040fb","#ff9100"][Math.floor(Math.random()*6)];
    c.style.animation=`fall ${2+Math.random()*2}s linear forwards`;
    document.body.appendChild(c); setTimeout(()=>c.remove(),4500);
  }
}
const s=document.createElement("style");
s.textContent="@keyframes fall{to{transform:translateY(110vh) rotate(720deg);opacity:0}}";
document.head.appendChild(s);
