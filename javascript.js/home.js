document.addEventListener('DOMContentLoaded', () => {
  renderBottomNav('home');

  const items = getItems();
  document.getElementById('homeCount').textContent = items.length + ' total';

  const postedParam = qs('posted');
  const grid = document.getElementById('homeGrid');
  grid.innerHTML = items.slice(0,4).map(it => {
    const isSeed = seedItems.some(s => s.id === it.id);
    const extra = (!isSeed && postedParam) ? `&posted=${postedParam}` : '';
    return `
    <a class="item-card" href="../items/item-detail.html?id=${it.id}${extra}">
      <div class="thumb" style="background:${it.color};">
        <span class="badge ${badgeClass(it.status)}">${badgeLabel(it.status)}</span>
        <span class="glyph">${ICONS[it.icon]}</span>
      </div>
      <div class="card-body">
        <div class="name">${escapeHtml(it.name)}</div>
        <div class="cat">${escapeHtml(it.cat)}</div>
        <div class="time">${it.time}</div>
      </div>
    </a>
  `;
  }).join('');

  if(qs('posted')) toast('Report submitted');
});
