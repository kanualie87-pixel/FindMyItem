/* ============================================================
   data.js — shared demo data + helpers, loaded on every page.
   Each page load starts fresh from this seed data (this is a
   static frontend with no backend/database yet — see README).
   Small bits of state (a newly posted item, a new message) are
   handed to the next page via URL parameters so the flow still
   feels alive without using browser storage.
   ============================================================ */

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

const seedItems = [
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

const seedUsers = [
  { name:"Alex Johnson", email:"alex@example.com", role:"admin", initials:"AJ", color:"#2563EB" },
  { name:"Samantha Lee", email:"sam@example.com", role:"user", initials:"SL", color:"#0EA5A5" },
  { name:"Michael Smith", email:"michael@example.com", role:"user", initials:"MS", color:"#EA580C" },
];

const seedReports = [
  { name:"Blue Backpack", status:"Pending", reporter:"Alice Smith" },
  { name:"Lost Wallet", status:"Found", reporter:"Bob Johnson" },
  { name:"Silver Watch", status:"Rejected", reporter:"Charlie Brown" },
  { name:"Reading Glasses", status:"Pending", reporter:"Diana Prince" },
  { name:"Smartphone", status:"Pending", reporter:"Clark Kent" },
];

const seedConversations = [
  { id:1, itemId:2, itemName:"Wallet (Black Leather)", otherName:"Bob Johnson", initials:"BJ", color:"#111827",
    messages:[
      { from:'me', text:'Hi, I think I found your wallet near the entrance.', time:'10:02 AM' },
      { from:'them', text:'Oh amazing, thank you! Can we meet this afternoon?', time:'10:05 AM' }
    ],
    lastMessage:'Oh amazing, thank you! Can we meet this afternoon?', lastTime:'10:05 AM', unread:true },
];

const REPLIES = [
  "Thanks for reaching out! Yes, I still have it — when works for you to pick it up?",
  "Hi! Could you describe any unique marks on it so I can confirm it's yours?",
  "Sure thing, I'm usually around campus in the afternoons if you want to swing by.",
  "Got your message — let me check and get back to you shortly.",
  "Sounds good, I'll hold onto it until we sort out the handoff.",
];

/* ---------------- shared helpers ---------------- */
function badgeClass(status){ return status==='lost' ? 'lost' : status==='found' ? 'found' : 'pending'; }
function badgeLabel(status){ return status==='lost' ? 'Lost' : status==='found' ? 'Found' : 'Pending'; }
function statusTextLabel(status){ return status==='lost' ? 'Lost' : status==='found' ? 'Found' : 'Pending Review'; }
function initialsOf(name){ return name.split(' ').filter(Boolean).map(w=>w[0]).slice(0,2).join('').toUpperCase(); }
function nowTime(){ const d=new Date(); return d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}); }
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function qs(name){ return new URLSearchParams(location.search).get(name); }
function toParam(obj){ return encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(obj))))); }
function fromParam(str){ try{ return JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(str))))); }catch(e){ return null; } }

function toast(msg){
  let t = document.getElementById('toast');
  if(!t){
    t = document.createElement('div');
    t.id = 'toast'; t.className = 'toast';
    document.querySelector('.app-shell').appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=> t.classList.remove('show'), 1800);
}

/* Build the working items list for this page load: seed data
   plus any item just posted on the report-lost page (handed
   over via the ?posted= URL parameter). */
function getItems(){
  let items = seedItems.slice();
  const posted = qs('posted');
  if(posted){
    const item = fromParam(posted);
    if(item) items = [item, ...items];
  }
  return items;
}

/* Build the working conversations list: seed conversation(s)
   plus a new one just started from an item's Contact page
   (handed over via ?newConv=). */
function getConversations(){
  let convs = seedConversations.slice();
  const newConv = qs('newConv');
  if(newConv){
    const conv = fromParam(newConv);
    if(conv) convs = [conv, ...convs];
  }
  return convs;
}

function findItemById(id){
  return getItems().find(i => String(i.id) === String(id));
}

/* Shared bottom nav, injected into a page via
   <div id="bottomNav"></div> + renderBottomNav('home') */
function renderBottomNav(active){
  const items = [
    { key:'home', href:'../home/home.html', label:'Home',
      icon:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>' },
    { key:'items', href:'../items/lost-items.html', label:'Lost Items',
      icon:'<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>' },
    { key:'report', href:'../items/report-lost.html', label:'Report',
      icon:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>' },
    { key:'profile', href:'../profile/profile.html', label:'Profile',
      icon:'<circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/>' },
  ];
  const el = document.getElementById('bottomNav');
  if(!el) return;
  el.className = 'bottomnav';
  el.innerHTML = items.map(it => `
    <a class="navitem ${it.key===active?'active':''}" href="${it.href}">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${it.icon}</svg>${it.label}
    </a>
  `).join('');
}
