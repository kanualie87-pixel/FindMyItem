document.addEventListener('DOMContentLoaded', () => {
  renderBottomNav('items');

  const convs = getConversations();
  const list = document.getElementById('conversationsList');

  if(convs.length === 0){
    list.innerHTML = `<div class="empty-state">No conversations yet.<br>Contact a reporter from an item's page to start one.</div>`;
    return;
  }

  const newConvParam = qs('newConv');
  list.innerHTML = convs.map(c => {
    const isNew = newConvParam && String(c.id) === String(fromParam(newConvParam)?.id);
    const extra = isNew ? `&newConv=${newConvParam}` : '';
    return `
    <a class="conv-row" href="conversation.html?id=${c.id}${extra}">
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
    </a>
  `;
  }).join('');
});
