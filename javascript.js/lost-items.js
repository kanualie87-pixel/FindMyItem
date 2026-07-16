let activeFilter = 'all';

function toggleFilterBar(){
  const bar = document.getElementById('chipbar');
  const isOpen = bar.classList.contains('open');
  if(!isOpen){
    bar.classList.add('open');
    bar.innerHTML = ['all',...CATS.map(c=>c.key)].map(key => {
      const label = key === 'all' ? 'All' : CATS.find(c=>c.key===key).label;
      return `<button class="chip ${activeFilter===key?'active':''}" data-key="${key}">${label}</button>`;
    }).join('');
    bar.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => { activeFilter = chip.dataset.key; rebuildChips(); renderList(); });
    });
  } else {
    bar.classList.remove('open');
  }
}

function rebuildChips(){
  const bar = document.getElementById('chipbar');
  bar.querySelectorAll('.chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.key === activeFilter);
  });
}

function renderList(){
  const q = (document.getElementById('listSearch').value || '').toLowerCase();
  const container = document.getElementById('listContainer');
  let filtered = getItems().filter(it => !q || it.name.toLowerCase().includes(q) || it.cat.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q));
  if(activeFilter !== 'all'){
    const catLabel = CATS.find(c=>c.key===activeFilter)?.label;
    filtered = filtered.filter(it => it.cat === catLabel);
  }
  container.innerHTML = filtered.map(it => `
    <a class="row-card" href="item-detail.html?id=${it.id}">
      <div class="row-thumb" style="background:${it.color};">${ICONS[it.icon]}</div>
      <div class="row-content">
        <div class="name">${escapeHtml(it.name)}</div>
        <div class="desc">${escapeHtml(it.desc)}</div>
        <div class="row-foot">
          <span class="status-text ${badgeClass(it.status)}">${statusTextLabel(it.status)}</span>
          <span class="view-details-btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            View Details
          </span>
        </div>
      </div>
    </a>
  `).join('') || `<p style="text-align:center;color:var(--gray-400);font-size:13px;margin-top:40px;">No items match your search.</p>`;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('filterToggleBtn').addEventListener('click', toggleFilterBar);
  document.getElementById('listSearch').addEventListener('input', renderList);
  renderList();
});
