const state = {
  followers: 0,
  money: 0,
  level: 1,
  donation: 0,
  viewers: 0,
  baseViewers: 5, // 🔥 YENİ
  quality: 1,
  day: 1,
  scene: "Gameplay",
  isStreaming: false,
  equipment: { mic: 0, pc: 0, cam: 0 }
};

const el = id => document.getElementById(id);

const names = ["Ahmet","Mehmet","GamerTR","ProX","Legend"];
const msgs = ["selam","efsane yayın","wow","devam🔥","çok iyi oynuyorsun"];

// SAVE / LOAD
function save(){ localStorage.setItem("game", JSON.stringify(state)); }
function load(){
  const data = JSON.parse(localStorage.getItem("game"));
  if(data) Object.assign(state, data);
}

// UI
function updateUI(){
  el("followers").textContent = state.followers;
  el("money").textContent = state.money;
  el("level").textContent = state.level;
  el("donation").textContent = state.donation;
  el("viewers").textContent = state.viewers;
  el("quality").textContent = state.quality;
  el("day").textContent = state.day;
  el("scene").textContent = state.scene;
  save();
}

// CHAT
function addChat(msg=null){
  const chat = el("chat");
  const p = document.createElement("p");

  if(msg){
    p.textContent = msg;
  } else {
    const name = names[Math.floor(Math.random()*names.length)];
    const text = msgs[Math.floor(Math.random()*msgs.length)];
    p.textContent = `${name}: ${text}`;
  }

  chat.appendChild(p);
  chat.scrollTop = chat.scrollHeight;

  if(chat.children.length > 50){
    chat.removeChild(chat.firstChild);
  }
}

// DONATION
function donationEvent(){
  if(Math.random() < 0.25){
    const amount = Math.floor(Math.random()*100)+20;
    state.money += amount;
    state.donation += amount;
    addChat(`💎 ${amount}₺ bağış!`);
  }
}

// ⚡ ELEKTRİK
function powerCut(){
  addChat("⚡ Elektrik kesildi! Yayın kapandı!");
  state.isStreaming = false;
}

// 🎥 STREAM (FULL FIX)
function startStream(){
  if(state.isStreaming){
    alert("Zaten yayındasın!");
    return;
  }

  state.isStreaming = true;
  let bar = el("bar");
  let w = 0;

  let interval = setInterval(()=>{

    if(Math.random()<0.02){
      clearInterval(interval);
      powerCut();
      updateUI();
      return;
    }

    if(w >= 100){
      clearInterval(interval);

      const boost =
        (state.equipment.mic * 0.2) +
        (state.equipment.pc * 0.3) +
        (state.equipment.cam * 0.2);

      const mult = (state.scene === "Gameplay" ? 2 : 1.2) * (state.quality + boost);

      let gainedFollowers = Math.floor(Math.random()*20*mult);
      let gainedViewers = Math.floor(gainedFollowers / 2);

      state.followers += gainedFollowers;
      state.money += Math.floor(Math.random()*40*mult);

      // 🔥 KALICI İZLEYİCİ ARTIŞI
      state.baseViewers += Math.floor(gainedViewers * 0.1);

      state.day++;
      state.isStreaming = false;

      bar.style.width="0%";
      updateUI();

    } else {
      w++;
      bar.style.width = w + "%";

      // 🔥 ANLIK İZLEYİCİ ARTIŞI
      let growth = Math.random() * (state.quality + state.baseViewers/10);
      state.viewers = Math.floor(state.baseViewers + growth * w);

      if(w % 10 === 0) addChat();
      if(w % 20 === 0) donationEvent();

      updateUI();
    }

  },30);
}

// 🎮 MINI GAME (İZLEYİCİ EKLENDİ)
function miniGame(){
  let reward = Math.floor(Math.random()*200)+50;
  let viewersGain = Math.floor(Math.random()*20)+5;

  state.money += reward;
  state.baseViewers += viewersGain;

  addChat(`🎮 Mini oyun: +${reward}₺ ve +${viewersGain} izleyici!`);
  updateUI();
}

// 🛒 EKİPMAN
function buyEquipment(type){
  const prices = { mic:100, pc:200, cam:300 };

  if(state.money < prices[type]){
    alert("Yetersiz para!");
    return;
  }

  state.money -= prices[type];
  state.equipment[type]++;
  addChat(`🛒 ${type} alındı!`);
  updateUI();
}

// EVENTS
document.getElementById("streamBtn").onclick = startStream;
document.getElementById("miniGameBtn").onclick = miniGame;

document.querySelectorAll("[data-scene]").forEach(btn=>{
  btn.onclick = () => {
    state.scene = btn.dataset.scene;
    updateUI();
  };
});

// INIT
load();
updateUI();

// GLOBAL
window.buyEquipment = buyEquipment;