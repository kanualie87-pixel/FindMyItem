let reports = seedReports.slice();

function renderAdmin(){
  const tbody = document.querySelector('#reportsTable tbody');
  tbody.innerHTML = reports.map((r,idx) => `
    <tr>
      <td>${escapeHtml(r.name)}</td>
      <td>${r.status === 'Rejected' ? `<span class="pill-status rejected">Rejected</span>` : `<span class="pill-status">${r.status}</span>`}</td>
      <td>${escapeHtml(r.reporter)}</td>
      <td>
        <div class="row-actions">
          <button class="ok" data-idx="${idx}" data-action="approve"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></button>
          <button class="no" data-idx="${idx}" data-action="reject"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.idx);
      reports[idx].status = btn.dataset.action === 'approve' ? 'Found' : 'Rejected';
      renderAdmin();
      toast(btn.dataset.action === 'approve' ? 'Report approved' : 'Report rejected');
    });
  });

  const usersList = document.getElementById('usersList');
  usersList.innerHTML = seedUsers.map(u => `
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

document.addEventListener('DOMContentLoaded', renderAdmin);
