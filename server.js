// ===========================
// ObscuriaNightmare Infernal – Versão Hardcore
// ===========================
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>ObscuriaNightmare Infernal Hardcore</title>
<style>
body{margin:0;overflow:hidden;font-family:monospace;color:#ff2a2a;background:black;}
canvas#bg{position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;}
h1{text-align:center;color:#ff2a2a;text-shadow:0 0 20px red,0 0 60px darkred;}
.login, .player, .chat{padding:10px;margin:10px;position:relative;z-index:2;}
.usuarios{background:#100;padding:10px;height:300px;overflow:auto;box-shadow:0 0 10px red inset;}
.mensagens{background:#050000;padding:10px;height:300px;overflow:auto;box-shadow:0 0 20px red inset;}
input{background:black;border:1px solid red;color:red;padding:5px;}
button{background:#200;color:red;border:1px solid red;padding:5px;cursor:pointer;}
button:hover{background:#400;}
.mensagens div{margin-bottom:6px;animation:fadein 1s;}
@keyframes fadein{from{opacity:0}to{opacity:1}}
</style>
</head>
<body>
<canvas id="bg"></canvas>
<h1>OBSCURIANIGHTMARE INFERNAL</h1>

<div class="player">
<label for="radioSelect" style="color:red;">Escolha Rádio:</label>
<select id="radioSelect" onchange="tocarRadio()">
  <option value="https://listen.radd.io/true-black-metal-radio">Black Metal Radio</option>
  <option value="https://listen.radd.io/radcap-gothic-metal">Gothic Metal</option>
  <option value="https://listen.radd.io/radcap-funeral-doom">Doom/Funeral Doom</option>
</select>

<audio id="radioPlayer" controls autoplay style="width:100%; margin-top:6px;">
  <source id="radioSource" type="audio/mpeg">
  Seu navegador não suporta o player de rádio.
</audio>
<button onclick="mudo()">🔇 Mudo</button>
</div>

<div class="login">
<input id="nick" placeholder="Nick">
<input id="room" placeholder="Sala">
<button onclick="entrar()">Entrar</button>
</div>

<div class="chat">
<div class="usuarios" id="usuarios"></div>
<div class="mensagens" id="mensagens"></div>
<input id="msg" placeholder="mensagem">
<button onclick="enviar()">Enviar</button>
</div>

<script src="/socket.io/socket.io.js"></script>
<script>
const socket = io();

// ----------------- RADIO -----------------
function tocarRadio(){
  const sel=document.getElementById("radioSelect");
  const url=sel.value;
  const source=document.getElementById("radioSource");
  const player=document.getElementById("radioPlayer");
  source.src=url;
  player.load();
  player.play().catch(e=>console.warn("Autoplay bloqueado:",e));
}
function mudo(){document.getElementById("radioPlayer").muted=!document.getElementById("radioPlayer").muted;}
window.onload=()=>{tocarRadio();};

// ----------------- CHAT -----------------
function entrar(){
  let nick=document.getElementById("nick").value;
  let room=document.getElementById("room").value;
  if(!nick||!room)return alert("Digite nick e sala");
  socket.emit("joinRoom",{nick,room});
  document.querySelector(".login").style.display="none";
}
function enviar(){
  let input=document.getElementById("msg");
  if(!input.value)return;
  socket.emit("chatMessage",input.value);
  input.value="";
}
socket.on("message",(data)=>{
  const div=document.createElement("div");
  div.innerHTML="<b>"+data.user+"</b> :: "+data.msg;
  document.getElementById("mensagens").appendChild(div);
});
socket.on("users",(list)=>{document.getElementById("usuarios").innerHTML=list.join("<br>");});

// ----------------- FUNDO INFERNAL -----------------
const canvas=document.getElementById("bg");
const ctx=canvas.getContext("2d");
let W,H;
function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
window.addEventListener("resize",resize);
resize();

// Partículas “almas em agonia”
class Alma{
  constructor(){
    this.x=Math.random()*W;
    this.y=Math.random()*H;
    this.vx=Math.random()*2-1;
    this.vy=Math.random()*2-0.5;
    this.size=Math.random()*3+1;
    this.alpha=Math.random()*0.7+0.3;
    this.color=["red","darkred","#8B0000","#FF4500"][Math.floor(Math.random()*4)];
  }
  update(){this.x+=this.vx; this.y+=this.vy; if(this.y>H||this.x>W||this.x<0){this.x=Math.random()*W; this.y=0;}}
  draw(){ctx.fillStyle="rgba("+this.color+","+this.alpha+")";ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);ctx.fill();}
}

let almas=[];
for(let i=0;i<500;i++) almas.push(new Alma());

function animate(){
  ctx.fillStyle="rgba(0,0,0,0.15)";
  ctx.fillRect(0,0,W,H);
  almas.forEach(a=>{a.update();a.draw();});
  requestAnimationFrame(animate);
}
animate();
</script>
</body>
</html>
  `);
});

// ---------- CHAT SERVER ----------
let rooms={};
let users={};

// ---------- IAs ----------
const filosofias=["niilismo cósmico","existencialismo","estoicismo","lógica matemática","metafísica","determinismo","absurdismo","realismo sombrio"];
function random(arr){return arr[Math.floor(Math.random()*arr.length)];}
function gerarNome(){const p=["Noct","Umbra","Void","Teneb","Mor","Abyss","Crypt","Obscur"]; const s=["ion","ara","eth","or","is","yx","um","ath"];return random(p)+random(s);}
let agents=[]; for(let i=0;i<200;i++){agents.push({name:gerarNome(),philosophy:random(filosofias),memory:[]});}
function respostaIA(agent,msg=""){
  if(msg) agent.memory.push(msg);
  const frases=["o universo permanece silencioso","a existência não possui centro","tudo retorna ao vazio","a realidade pode ser apenas um eco","a lógica governa até o caos","o tempo observa tudo"];
  let base=random(frases);
  if(agent.memory.length>0){let aprendido=agent.memory[Math.floor(Math.random()*agent.memory.length)]; base+=" / lembrando de: "+aprendido;}
  return base+" — "+agent.philosophy;
}

// ---------- SOCKET.IO ----------
io.on("connection",(socket)=>{
  socket.on("joinRoom",({nick,room})=>{
    if(!rooms[room]) rooms[room]=[];
    if(rooms[room].length>=50){ socket.emit("message",{user:"sistema",msg:"Sala cheia"}); return; }
    socket.nick=nick; socket.room=room; users[nick]=socket.id; rooms[room].push(nick); socket.join(room);
    io.to(room).emit("users",rooms[room]); io.to(room).emit("message",{user:"sistema",msg:nick+" entrou na sala"});
  });
  socket.on("chatMessage",(msg)=>{
    if(!socket.room)return;
    if(msg.startsWith("/msg")){ let parts=msg.split(" "); let target=parts[1]; let texto=parts.slice(2).join(" "); if(users[target]){ io.to(users[target]).emit("message",{user:"(privado) "+socket.nick,msg:texto}); socket.emit("message",{user:"(para "+target+")",msg:texto});} return; }
    io.to(socket.room).emit("message",{user:socket.nick,msg:msg});
    setTimeout(()=>{ let ai=random(agents); io.to(socket.room).emit("message",{user:ai.name,msg:respostaIA(ai,msg)});},2000);
  });
  socket.on("disconnect",()=>{
    if(!socket.room)return; rooms[socket.room]=rooms[socket.room].filter(u=>u!==socket.nick); delete users[socket.nick];
    io.to(socket.room).emit("users",rooms[socket.room]);
  });
});

// ---------- Debate automático ----------
setInterval(()=>{ let ai=random(agents); io.emit("message",{user:ai.name,msg:respostaIA(ai)});},20000);

// ---------- START SERVER ----------
server.listen(3000,()=>{console.log("ObscuriaNightmare Infernal Hardcore rodando em http://localhost:3000");});