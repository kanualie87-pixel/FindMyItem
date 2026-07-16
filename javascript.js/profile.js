document.addEventListener('DOMContentLoaded', () => {
  renderBottomNav('profile');
  document.getElementById('profileAvatar').textContent = currentUser.initials;
  document.getElementById('profileName').textContent = currentUser.name;
  document.getElementById('profileEmail').textContent = currentUser.email;
});
