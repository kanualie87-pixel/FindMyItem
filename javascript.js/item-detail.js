document.addEventListener('DOMContentLoaded', () => {
  const id = qs('id');
  const it = findItemById(id);
  if(!it){
    document.getElementById('detailTitleBar').textContent = 'Not found';
    document.querySelector('.detail-body').innerHTML = '<p class="desc-text">This item could not be found.</p>';
    return;
  }

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
  function renderCta(){
    if(it.reporter === currentUser.name){
      ctaWrap.innerHTML = it.status === 'found'
        ? `<div class="own-note">✓ You marked this item as resolved.</div>`
        : `<div class="own-note">This is your report.</div><button class="btn btn-outline" id="resolveBtn">Mark as Resolved</button>`;
      const btn = document.getElementById('resolveBtn');
      if(btn) btn.addEventListener('click', () => {
        it.status = 'found';
        badge.className = `badge ${badgeClass(it.status)}`;
        badge.textContent = badgeLabel(it.status);
        toast('Marked as resolved');
        renderCta();
      });
    } else {
      ctaWrap.innerHTML = `<a class="btn btn-primary" href="../messages/conversation.html?itemId=${it.id}">Contact Reporter</a>`;
    }
  }
  renderCta();
});
