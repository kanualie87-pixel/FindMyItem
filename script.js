const ICONS = {
  keys:`<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="4"/><path d="M10.5 10.5L21 21"/><path d="M16 16l3-3"/><path d="M18 18l2.5-2.5"/></svg>`,
  wallet:`<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5h-4a2 2 0 0 1 0-4h4Z"/></svg>`,
  earbuds:`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6a2 2 0 0 0 4 0v-2"/><path d="M20 9v6a2 2 0 0 1-4 0v-2"/><path d="M4 9a4 4 0 0 1 8 0"/><path d="M12 9a4 4 0 0 1 8 0"/></svg>`,
  bag:`<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="13" rx="2"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/></svg>`,
  ring:`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  umbrella:`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12v8a2 2 0 0 0 4 0"/><path d="M2 12a10 10 0 0 1 20 0Z"/><path d="M12 2v2"/></svg>`,
  drone:`<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="6" height="6" rx="1"/><circle cx="4" cy="4" r="2.4"/><circle cx="20" cy="4" r="2.4"/><circle cx="4" cy="20" r="2.4"/><circle cx="20" cy="20" r="2.4"/><line x1="6" y1="6" x2="9.5" y2="9.5"/><line x1="18" y1="6" x2="14.5" y2="9.5"/><line x1="6" y1="18" x2="9.5" y2="14.5"/><line x1="18" y1="18" x2="14.5" y2="14.5"/></svg>`,
};
const COLORS = ["#2563EB","#111827","#0EA5A5","#6366F1","#374151","#EA580C","#0F766E","#1E3A8A","#7C3AED","#B45309"];
const CATS = [
  { key:"keys", label:"Keys", icon:"keys", match:["key","keys"] },
  { key:"wallet", label:"Wallet", icon:"wallet", match:["wallet","purse","card"] },
  { key:"electronics", label:"Electronics", icon:"earbuds", match:["phone","airpods","laptop","charger","drone","camera","tablet","watch","earbud","headphone"] },
  { key:"bag", label:"Bag", icon:"bag", match:["bag","backpack","luggage","suitcase"] },
  { key:"jewelry", label:"Jewelry", icon:"ring", match:["ring","earring","necklace","bracelet","jewel"] },
  { key:"other", label:"Other", icon:"umbrella", match:[] },
];

function inferCategory(name){
  const n = name.toLowerCase();
  for(const c of CATS){ if(c.match.some(m => n.includes(m))) return c; }
  return CATS[CATS.length-1];
}

const currentUser = { name:"John Doe", email:"john.doe@example.com", initials:"JD" };

let items = [
  { id:1, name:"Car Keys (Hyundai)", cat:"Keys", icon:"keys", color:"#2563EB", status:"lost", time:"2 hours ago",
    desc:"A single Hyundai car key with a black leather fob and no keychain attached. Lost somewhere near the parking lot.", reporter:"Mike Torres", phone:"+1 (XXX) XXX-1123" },
  { id:2, name:"Wallet (Black Leather)", cat:"Wallet", icon:"wallet", color:"#111827", status:"found", time:"Yesterday",
    desc:"Brown leather wallet containing ID cards and some cash. Lost in the parking area near the main entrance.", reporter:"Bob Johnson", phone:"+1 (XXX) XXX-2231" },
  { id:3, name:"AirPods Pro", cat:"Electronics", icon:"earbuds", color:"#374151", status:"lost", time:"3 days ago",
    desc:"A pair of AirPods Pro in a white charging case with a small scuff on the lid. Left near the study area.", reporter:"Priya Kapoor", phone:"+1 (XXX) XXX-9021" },
  { id:4, name:"Blue Backpack", cat:"Bag", icon:"bag", color:"#0EA5A5", status:"pending", time:"1 week ago",
    desc:"A blue fabric backpack with a laptop compartment and front pocket. Left near the cafeteria seating area.", reporter:"Alice Smith", phone:"+1 (XXX) XXX-3345" },
  { id:5, name:"Silver Key Ring", cat:"Keys", icon:"ring", color:"#6366F1", status:"pending", time:"4 days ago",
    desc:"A key ring with three silver keys and a small blue fish charm. Lost near the gymnasium entrance.", reporter:"Diana Prince", phone:"+1 (XXX) XXX-5567" },
  { id:6, name:"Black Umbrella", cat:"Other", icon:"umbrella", color:"#1E3A8A", status:"lost", time:"5 days ago",
    desc:"Large black umbrella, automatic open/close. Left on the bus near the back row seats.", reporter:"Clark Kent", phone:"+1 (XXX) XXX-7789" },
  { id:7, name:"Lost Drone", cat:"Electronics", icon:"drone", color:"#111827", status:"lost", time:"Oct 26",
    desc:"A black DJI Mavic Mini drone with foldable arms and a small camera. It was lost during a flight near the city park on October 26th. The drone has a small scratch on its left arm. It comes with a gray controller. If found, please contact the reporter immediately. This drone holds significant sentimental value and is also a professional tool.",
    reporter:"John Doe", phone:"+1 (XXX) XXX-5678" },
];

const users = [
  { name:"Alex Johnson", email:"alex@example.com", role:"admin", initials:"AJ", color:"#2563EB" },
  { name:"Samantha Lee", email:"sam@example.com", role:"user", initials:"SL", color:"#0EA5A5" },
  { name:"Michael Smith", email:"michael@example.com", role:"user", initials:"MS", color:"#EA580C" },
];

const reports = [
  { name:"Blue Backpack", status:"Pending", reporter:"Alice Smith" },
  { name:"Lost Wallet", status:"Found", reporter:"Bob Johnson" },
  { name:"Silver Watch", status:"Rejected", reporter:"Charlie Brown" },
  { name:"Reading Glasses", status:"Pending", reporter:"Diana Prince" },
  { name:"Smartphone", status:"Pending", reporter:"Clark Kent" },
];

const REPLIES = [
  "Thanks for reaching out! Yes, I still have it — when works for you to pick it up?",
  "Hi! Could you describe any unique marks on it so I can confirm it's yours?",
  "Sure thing, I'm usually around campus in the afternoons if you want to swing by.",
  "Got your message — let me check and get back to you shortly.",
  "Sounds good, I'll hold onto it until we sort out the handoff.",
];

let conversations = [];
let currentDetailId = null;
let currentConvId = null;
let activeFilter = 'all';
let nextItemId = 100;
let nextConvId = 1000;

function go(view){
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelector(`.view[data-view="${view}"]`).classList.add('active');
  document.querySelector('.app-shell').scrollTop = 0;
  if(view === 'lostItems') renderList();
  if(view === 'home') renderHome();
  if(view === 'admin') renderAdmin();
  if(view === 'messages') renderMessages();
  if(view === 'profile') renderProfile();
}

function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=> t.classList.remove('show'), 1800);
}

function badgeClass(status){ return status==='lost' ? 'lost' : status==='found' ? 'found' : 'pending'; }
function badgeLabel(status){ return status==='lost' ? 'Lost' : status==='found' ? 'Found' : 'Pending'; }
function statusTextLabel(status){ return status==='lost' ? 'Lost' : status==='found' ? 'Found' : 'Pending Review'; }
function initialsOf(name){ return name.split(' ').filter(Boolean).map(w=>w[0]).slice(0,2).join('').toUpperCase(); }
function nowTime(){ const d=new Date(); return d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}); }
function escapeHtml(s){ return s.replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* ---------------- HOME ---------------- */
function renderHome(){
  const grid = document.getElementById('homeGrid');
  const recent = items.slice(0,4);
  document.getElementById('homeCount').textContent = items.length + ' total';
  grid.innerHTML = recent.map(it => `
    <div class="item-card" onclick="openDetail(${it.id})">
      <div class="thumb" style="background:${it.color};">
        <span class="badge ${badgeClass(it.status)}">${badgeLabel(it.status)}</span>
        <span class="glyph">${ICONS[it.icon]}</span>
      </div>
      <div class="card-body">
        <div class="name">${escapeHtml(it.name)}</div>
        <div class="cat">${escapeHtml(it.cat)}</div>
        <div class="time">${it.time}</div>
      </div>
    </div>
  `).join('');
  updateMsgBadge();
}

/* ---------------- LOST ITEMS LIST ---------------- */
function toggleFilterBar(){
  const bar = document.getElementById('chipbar');
  if(bar.style.display === 'none'){
    bar.style.display = 'flex';
    bar.innerHTML = ['all',...CATS.map(c=>c.key)].map(key => {
      const label = key === 'all' ? 'All' : CATS.find(c=>c.key===key).label;
      return `<button class="chip ${activeFilter===key?'active':''}" onclick="setFilter('${key}')">${label}</button>`;
    }).join('');
  } else {
    bar.style.display = 'none';
  }
}
function setFilter(key){
  activeFilter = key;
  toggleFilterBar(); toggleFilterBar();
  renderList();
}

function renderList(){
  const q = (document.getElementById('listSearch').value || '').toLowerCase();
  const container = document.getElementById('listContainer');
  let filtered = items.filter(it => !q || it.name.toLowerCase().includes(q) || it.cat.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q));
  if(activeFilter !== 'all'){
    const catLabel = CATS.find(c=>c.key===activeFilter)?.label;
    filtered = filtered.filter(it => it.cat === catLabel);
  }
  container.innerHTML = filtered.map(it => `
    <div class="row-card" onclick="openDetail(${it.id})">
      <div class="row-thumb" style="background:${it.color};">${ICONS[it.icon]}</div>
      <div class="row-content">
        <div class="name">${escapeHtml(it.name)}</div>
        <div class="desc">${escapeHtml(it.desc)}</div>
        <div class="row-foot">
          <span class="status-text ${badgeClass(it.status)}">${statusTextLabel(it.status)}</span>
          <button class="view-details-btn" onclick="event.stopPropagation();openDetail(${it.id})">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            View Details
          </button>
        </div>
      </div>
    </div>
  `).join('') || `<p style="text-align:center;color:var(--gray-400);font-size:13px;margin-top:40px;">No items match your search.</p>`;
}

/* ---------------- ITEM DETAIL ---------------- */
function openDetail(id){
  const it = items.find(i => i.id === id);
  if(!it) return;
  currentDetailId = id;
  document.getElementById('detailTitleBar').textContent = it.name;
  document.getElementById('detailName').textContent = it.name;
  document.getElementById('detailCat').textContent = it.cat;
  document.getElementById('detailDesc').textContent = it.desc;
  document.getElementById('detailReporter').textContent = it.reporter;
  document.getElementById('detailPhone').textContent = it.phone;
  const badge = document.getElementById('detailBadge');
  badge.className = `badge ${badgeClass(it.status)}`;
  badge.textContent = badgeLabel(it.status);
  const hero = document.getElementById('detailHero');
  hero.style.background = it.color;
  hero.innerHTML = `<span style="transform:scale(1.6);">${ICONS[it.icon]}</span>`;

  const ctaWrap = document.getElementById('detailCtaWrap');
  if(it.reporter === currentUser.name){
    ctaWrap.innerHTML = it.status === 'found'
      ? `<div class="own-note">✓ You marked this item as resolved.</div>`
      : `<div class="own-note">This is your report.</div><button class="btn btn-outline" onclick="markResolved(${it.id})">Mark as Resolved</button>`;
  } else {
    ctaWrap.innerHTML = `<button class="btn btn-primary" onclick="openContact()">Contact Reporter</button>`;
  }
  go('detail');
}

function markResolved(id){
  const it = items.find(i=>i.id===id);
  if(!it) return;
  it.status = 'found';
  toast('Marked as resolved');
  openDetail(id);
}

/* ---------------- CONTACT / MESSAGING ---------------- */
function openContact(){
  const it = items.find(i=>i.id===currentDetailId);
  if(!it) return;
  document.getElementById('contactItemSub').textContent = 'Re: ' + it.name;
  document.getElementById('contactMsgInput').value = '';
  go('contact');
}

function findOrCreateConversation(it){
  let conv = conversations.find(c => c.itemId === it.id);
  if(!conv){
    conv = { id: nextConvId++, itemId: it.id, itemName: it.name, otherName: it.reporter,
      initials: initialsOf(it.reporter), color: it.color, messages: [], lastMessage:'', lastTime:'', unread:false };
    conversations.unshift(conv);
  }
  return conv;
}

function submitContactMessage(text){
  const it = items.find(i=>i.id===currentDetailId);
  if(!it || !text.trim()) return;
  const conv = findOrCreateConversation(it);
  conv.messages.push({ from:'me', text: text.trim(), time: nowTime() });
  conv.lastMessage = text.trim();
  conv.lastTime = nowTime();
  currentConvId = conv.id;
  go('conversation');
  document.getElementById('convTitleBar').textContent = conv.otherName;
  document.getElementById('convItemSub').textContent = 'Re: ' + conv.itemName;
  renderConversation();
  renderMessages();

  setTimeout(()=> showTyping(true), 500);
  setTimeout(()=>{
    showTyping(false);
    const reply = `Hi! Thanks for reaching out about the ${it.name}. ` + REPLIES[Math.floor(Math.random()*REPLIES.length)];
    conv.messages.push({ from:'them', text: reply, time: nowTime() });
    conv.lastMessage = reply;
    conv.lastTime = nowTime();
    conv.unread = (currentConvId !== conv.id);
    renderConversation();
    renderMessages();
    updateMsgBadge();
  }, 1900);
}

function openConversation(id){
  currentConvId = id;
  const conv = conversations.find(c => c.id === id);
  if(!conv) return;
  conv.unread = false;
  document.getElementById('convTitleBar').textContent = conv.otherName;
  document.getElementById('convItemSub').textContent = 'Re: ' + conv.itemName;
  go('conversation');
  renderConversation();
  updateMsgBadge();
}

function renderConversation(){
  const conv = conversations.find(c => c.id === currentConvId);
  if(!conv) return;
  const body = document.getElementById('chatBody');
  body.innerHTML = conv.messages.map(m => `
    <div class="bubble ${m.from==='me'?'me':'them'}">${escapeHtml(m.text)}<div class="bubble-time">${m.time}</div></div>
  `).join('');
  body.scrollTop = body.scrollHeight;
}

function showTyping(on){
  const body = document.getElementById('chatBody');
  let el = document.getElementById('typingRow');
  if(on){
    if(!el){
      el = document.createElement('div');
      el.id = 'typingRow'; el.className = 'typing-indicator';
      el.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
    }
  } else if(el){ el.remove(); }
}

function sendChat(){
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if(!text) return;
  const conv = conversations.find(c => c.id === currentConvId);
  if(!conv) return;
  conv.messages.push({ from:'me', text, time: nowTime() });
  conv.lastMessage = text;
  conv.lastTime = nowTime();
  input.value = '';
  renderConversation();
  renderMessages();

  showTyping(true);
  setTimeout(()=>{
    showTyping(false);
    const reply = REPLIES[Math.floor(Math.random()*REPLIES.length)];
    conv.messages.push({ from:'them', text: reply, time: nowTime() });
    conv.lastMessage = reply;
    conv.lastTime = nowTime();
    renderConversation();
    renderMessages();
  }, 1400 + Math.random()*900);
}

function renderMessages(){
  const list = document.getElementById('conversationsList');
  if(conversations.length === 0){
    list.innerHTML = `<div class="empty-state">No conversations yet.<br>Contact a reporter from an item's page to start one.</div>`;
    return;
  }
  list.innerHTML = conversations.map(c => `
    <div class="conv-row" onclick="openConversation(${c.id})">
      <div class="avatar" style="background:${c.color};">${c.initials}</div>
      <div class="conv-content">
        <div class="conv-top-row">
          <span class="cname">${escapeHtml(c.otherName)}</span>
          <span class="ctime">${c.lastTime||''}</span>
        </div>
        <div class="citem">${escapeHtml(c.itemName)}</div>
        <div class="clast">${escapeHtml(c.lastMessage||'')}</div>
      </div>
      ${c.unread ? '<div class="conv-unread-dot"></div>' : ''}
    </div>
  `).join('');
  updateMsgBadge();
}

function updateMsgBadge(){
  const badge = document.getElementById('homeMsgBadge');
  if(!badge) return;
  badge.style.display = conversations.some(c => c.unread) ? 'block' : 'none';
}

/* ---------------- REPORT SUBMISSION ---------------- */
function handleFileSelect(input){
  const box = document.getElementById('uploadBox');
  const text = document.getElementById('uploadText');
  if(input.files && input.files[0]){
    box.classList.add('has-file');
    text.textContent = '✓ ' + input.files[0].name;
  } else {
    box.classList.remove('has-file');
    text.textContent = 'Drag & drop or click to upload image';
  }
}

function clearFieldErrors(form){
  form.querySelectorAll('.field.has-error').forEach(f => f.classList.remove('has-error'));
}

/* ---------------- PROFILE ---------------- */
function renderProfile(){
  document.getElementById('profileAvatar').textContent = currentUser.initials;
  document.getElementById('profileName').textContent = currentUser.name;
  document.getElementById('profileEmail').textContent = currentUser.email;
}

/* ---------------- ADMIN ---------------- */
function renderAdmin(){
  const tbody = document.querySelector('#reportsTable tbody');
  tbody.innerHTML = reports.map((r,idx) => `
    <tr>
      <td>${escapeHtml(r.name)}</td>
      <td>${r.status === 'Rejected' ? `<span class="pill-status rejected">Rejected</span>` : `<span class="pill-status">${r.status}</span>`}</td>
      <td>${escapeHtml(r.reporter)}</td>
      <td>
        <div class="row-actions">
          <button class="ok" onclick="approveReport(${idx})"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></button>
          <button class="no" onclick="rejectReport(${idx})"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
      </td>
    </tr>
  `).join('');

  const usersList = document.getElementById('usersList');
  usersList.innerHTML = users.map(u => `
    <div class="user-row">
      <div class="avatar" style="background:${u.color};">${u.initials}</div>
      <div class="user-info">
        <div class="uname">${escapeHtml(u.name)}</div>
        <div class="uemail">${escapeHtml(u.email)}</div>
      </div>
      <span class="role-pill ${u.role}">${u.role === 'admin' ? 'Admin' : 'User'}</span>
    </div>
  `).join('');
}
function approveReport(idx){ reports[idx].status = 'Found'; renderAdmin(); toast('Report approved'); }
function rejectReport(idx){ reports[idx].status = 'Rejected'; renderAdmin(); toast('Report rejected'); }

/* ---------------- BOOTSTRAP / EVENT WIRING ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('homeSearchInput').addEventListener('focus', () => go('lostItems'));

  document.getElementById('reportForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    clearFieldErrors(form);
    const name = document.getElementById('itemNameInput').value.trim();
    const desc = document.getElementById('itemDescInput').value.trim();
    let hasError = false;
    if(!name){ document.getElementById('f-item-name').classList.add('has-error'); hasError = true; }
    if(!desc){ document.getElementById('f-item-desc').classList.add('has-error'); hasError = true; }
    if(hasError) return;

    const cat = inferCategory(name);
    const color = COLORS[Math.floor(Math.random()*COLORS.length)];
    const newItem = {
      id: nextItemId++, name, cat: cat.label, icon: cat.icon, color,
      status: 'lost', time: 'Just now',
      desc, reporter: currentUser.name, phone: '+1 (XXX) XXX-0000'
    };
    items.unshift(newItem);
    form.reset();
    document.getElementById('uploadBox').classList.remove('has-file');
    document.getElementById('uploadText').textContent = 'Drag & drop or click to upload image';
    go('home');
    toast('Report submitted');
  });

  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const text = document.getElementById('contactMsgInput').value;
    submitContactMessage(text);
  });

  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    go('home');
    toast('Welcome back');
  });

  document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    clearFieldErrors(e.target);
    const pass = document.getElementById('regPass').value;
    const confirm = document.getElementById('regConfirm').value;
    if(pass !== confirm){
      document.getElementById('f-reg-confirm').classList.add('has-error');
      return;
    }
    const name = document.getElementById('regName').value.trim() || 'John Doe';
    const email = document.getElementById('regEmail').value.trim() || 'john.doe@example.com';
    currentUser.name = name;
    currentUser.email = email;
    currentUser.initials = initialsOf(name) || 'JD';
    go('home');
    toast('Account created');
  });

  renderHome();
  renderList();
  renderMessages();
});
