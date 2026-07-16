document.addEventListener('DOMContentLoaded', () => {
  renderBottomNav('report');

  const dateInput = document.getElementById('dateLostInput');
  dateInput.addEventListener('focus', function(){ this.type = 'date'; });

  document.getElementById('uploadBox').addEventListener('click', () => document.getElementById('fileInput').click());
  document.getElementById('fileInput').addEventListener('change', function(){
    const box = document.getElementById('uploadBox');
    const text = document.getElementById('uploadText');
    if(this.files && this.files[0]){
      box.classList.add('has-file');
      text.textContent = '✓ ' + this.files[0].name;
    }
  });

  document.getElementById('reportForm').addEventListener('submit', (e) => {
    e.preventDefault();
    document.querySelectorAll('.field.has-error').forEach(f => f.classList.remove('has-error'));
    const name = document.getElementById('itemNameInput').value.trim();
    const desc = document.getElementById('itemDescInput').value.trim();
    let hasError = false;
    if(!name){ document.getElementById('f-item-name').classList.add('has-error'); hasError = true; }
    if(!desc){ document.getElementById('f-item-desc').classList.add('has-error'); hasError = true; }
    if(hasError) return;

    const cat = inferCategory(name);
    const color = COLORS[Math.floor(Math.random()*COLORS.length)];
    const newItem = {
      id: Date.now(), name, cat: cat.label, icon: cat.icon, color,
      status: 'lost', time: 'Just now',
      desc, reporter: currentUser.name, phone: '+1 (XXX) XXX-0000'
    };
    // hand the new item to the Home page via a URL parameter —
    // this is a static frontend with no backend/database yet.
    window.location.href = `../home/home.html?posted=${toParam(newItem)}`;
  });
});
