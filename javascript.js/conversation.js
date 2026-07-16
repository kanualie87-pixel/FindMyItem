let conv = null;

function renderThread(){
  document.getElementById('composeWrap').classList.add('hidden');
  document.getElementById('chatBody').classList.remove('hidden');
  document.getElementById('chatInputBar').classList.remove('hidden');
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

function syncUrlAndBackLink(){
  const encoded = toParam(conv);
  history.replaceState(null, '', `conversation.html?newConv=${encoded}`);
  document.getElementById('backLink').href = `messages.html?newConv=${encoded}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const itemId = qs('itemId');
  const id = qs('id');
  const newConvParam = qs('newConv');

  if(newConvParam){
    conv = fromParam(newConvParam);
    document.getElementById('convTitleBar').textContent = conv.otherName;
    document.getElementById('convItemSub').textContent = 'Re: ' + conv.itemName;
    renderThread();
  } else if(id){
    conv = getConversations().find(c => String(c.id) === String(id));
    if(!conv){ document.getElementById('convTitleBar').textContent = 'Not found'; return; }
    document.getElementById('convTitleBar').textContent = conv.otherName;
    document.getElementById('convItemSub').textContent = 'Re: ' + conv.itemName;
    renderThread();
  } else if(itemId){
    const it = findItemById(itemId);
    if(!it){ document.getElementById('convTitleBar').textContent = 'Not found'; return; }
    document.getElementById('convTitleBar').textContent = it.reporter;
    document.getElementById('convItemSub').textContent = 'Re: ' + it.name;
    document.getElementById('composeWrap').classList.remove('hidden');

    document.getElementById('contactForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const text = document.getElementById('contactMsgInput').value.trim();
      if(!text) return;
      conv = {
        id: Date.now(), itemId: it.id, itemName: it.name, otherName: it.reporter,
        initials: initialsOf(it.reporter), color: it.color,
        messages: [{ from:'me', text, time: nowTime() }],
        lastMessage: text, lastTime: nowTime(), unread:false
      };
      renderThread();
      syncUrlAndBackLink();
      setTimeout(()=> showTyping(true), 500);
      setTimeout(()=>{
        showTyping(false);
        const reply = `Hi! Thanks for reaching out about the ${it.name}. ` + REPLIES[Math.floor(Math.random()*REPLIES.length)];
        conv.messages.push({ from:'them', text: reply, time: nowTime() });
        conv.lastMessage = reply; conv.lastTime = nowTime();
        renderThread();
        syncUrlAndBackLink();
      }, 1900);
    });
  } else {
    document.getElementById('convTitleBar').textContent = 'No conversation';
  }

  function send(){
    if(!conv) return;
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if(!text) return;
    conv.messages.push({ from:'me', text, time: nowTime() });
    conv.lastMessage = text; conv.lastTime = nowTime();
    input.value = '';
    renderThread();
    syncUrlAndBackLink();

    showTyping(true);
    setTimeout(()=>{
      showTyping(false);
      const reply = REPLIES[Math.floor(Math.random()*REPLIES.length)];
      conv.messages.push({ from:'them', text: reply, time: nowTime() });
      conv.lastMessage = reply; conv.lastTime = nowTime();
      renderThread();
      syncUrlAndBackLink();
    }, 1400 + Math.random()*900);
  }

  document.getElementById('sendBtn').addEventListener('click', send);
  document.getElementById('chatInput').addEventListener('keydown', (e) => { if(e.key === 'Enter') send(); });
});
