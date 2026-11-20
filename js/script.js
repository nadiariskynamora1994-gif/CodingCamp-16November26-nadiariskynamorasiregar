let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let links = JSON.parse(localStorage.getItem('links') || '[]');
let filter = 'all';
let timerInterval = null;
let timeLeft = 25 * 60;

function saveData(){ localStorage.setItem('tasks', JSON.stringify(tasks)); localStorage.setItem('links', JSON.stringify(links)); }
function updateClock(){
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString('id-ID');
  document.getElementById('date').textContent = now.toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
  let name = localStorage.getItem('userName') || 'Nadia';
  let h = now.getHours();
  let greet = h < 11 ? 'Selamat Pagi' : h < 15 ? 'Selamat Siang' : h < 18 ? 'Selamat Sore' : 'Selamat Malam';
  document.getElementById('greeting').textContent = greet + ', ' + name + '! 👋';
  document.getElementById('nameInput').value = name;
}
function saveName(){ let n = document.getElementById('nameInput').value.trim(); if(n){ localStorage.setItem('userName', n); updateClock(); alert('Nama disimpan!'); } }
function toggleTheme(){ document.body.classList.toggle('dark'); let isDark = document.body.classList.contains('dark'); localStorage.setItem('theme', isDark?'dark':'light'); document.getElementById('themeBtn').textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode'; }
function addTask(){
  let text = document.getElementById('taskInput').value.trim();
  let cat = document.getElementById('categoryInput').value;
  if(!text) return alert('Tulis tugas dulu!');
  if(tasks.some(t => t.text.toLowerCase() === text.toLowerCase())) return alert('Tugas ini sudah ada! Tidak boleh duplikat ya.');
  tasks.push({text, cat, done:false});
  document.getElementById('taskInput').value='';
  saveData(); renderTasks();
}
function renderTasks(){
  let list = document.getElementById('taskList'); list.innerHTML='';
  let filtered = tasks.filter(t => filter==='all' ? true : filter==='done' ? t.done : !t.done);
  filtered.forEach((t, idx)=>{
    let realIdx = tasks.indexOf(t);
    let li = document.createElement('li'); if(t.done) li.className='done';
    li.innerHTML = `<span class="task-text"><input type="checkbox" ${t.done?'checked':''} onchange="toggleTask(${realIdx})"> ${t.text} <small>[${t.cat}]</small></span><span><button onclick="editTask(${realIdx})">✏️</button><button onclick="deleteTask(${realIdx})">🗑️</button></span>`;
    list.appendChild(li);
  });
  let doneCount = tasks.filter(t=>t.done).length;
  document.getElementById('progressText').textContent = `${doneCount} dari ${tasks.length} tugas selesai`;
  document.getElementById('progressBar').style.width = tasks.length ? (doneCount/tasks.length*100)+'%' : '0%';
}
function toggleTask(i){ tasks[i].done = !tasks[i].done; saveData(); renderTasks(); }
function deleteTask(i){ tasks.splice(i,1); saveData(); renderTasks(); }
function editTask(i){ let baru = prompt('Edit tugas:', tasks[i].text); if(baru && baru.trim()){ tasks[i].text = baru.trim(); saveData(); renderTasks(); } }
function setFilter(f){ filter=f; renderTasks(); }
function addLink(){
  let name = document.getElementById('linkName').value.trim();
  let url = document.getElementById('linkUrl').value.trim();
  if(!name || !url) return alert('Isi nama dan link dulu!');
  if(!url.startsWith('http')) url = 'https://' + url;
  links.push({name, url}); document.getElementById('linkName').value=''; document.getElementById('linkUrl').value=''; saveData(); renderLinks();
}
function renderLinks(){
  let div = document.getElementById('linkList'); div.innerHTML='';
  links.forEach((l,i)=>{ div.innerHTML += `<a class="link-item" href="${l.url}" target="_blank">${l.name} ↗</a> <button onclick="deleteLink(${i})">x</button> `; });
  if(links.length===0) div.innerHTML = '<p>Belum ada link. Tambah Youtube, Google, dll.</p>';
}
function deleteLink(i){ links.splice(i,1); saveData(); renderLinks(); }
function updateTimerDisplay(){ let m = Math.floor(timeLeft/60); let s = timeLeft%60; document.getElementById('timerDisplay').textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; }
function setTimer(){ let mins = parseInt(document.getElementById('timerMinutes').value) || 25; timeLeft = mins*60; updateTimerDisplay(); document.getElementById('timerStatus').textContent = `Timer diubah jadi ${mins} menit!`; }
function startTimer(){ if(timerInterval) return; document.getElementById('timerStatus').textContent='Fokus! Jangan buka HP! 🔥'; timerInterval = setInterval(()=>{ timeLeft--; updateTimerDisplay(); if(timeLeft<=0){ clearInterval(timerInterval); timerInterval=null; alert('Waktunya istirahat! 🎉'); document.getElementById('timerStatus').textContent='Selesai!'; } },1000); }
function stopTimer(){ clearInterval(timerInterval); timerInterval=null; document.getElementById('timerStatus').textContent='Dijeda ⏸️'; }
function resetTimer(){ stopTimer(); setTimer(); document.getElementById('timerStatus').textContent='Siap fokus!'; }

if(localStorage.getItem('theme')==='dark'){ document.body.classList.add('dark'); }
setInterval(updateClock,1000); updateClock(); renderTasks(); renderLinks(); updateTimerDisplay();
