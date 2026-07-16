document.addEventListener('DOMContentLoaded', () => {
  const forgotLink = document.getElementById('forgotPasswordLink');
  if(forgotLink){
    forgotLink.addEventListener('click', (e) => e.preventDefault());
  }

  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = '../home/home.html';
    });
  }

  const registerForm = document.getElementById('registerForm');
  if(registerForm){
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      document.querySelectorAll('.field.has-error').forEach(f => f.classList.remove('has-error'));
      const pass = document.getElementById('regPass').value;
      const confirm = document.getElementById('regConfirm').value;
      if(pass !== confirm){
        document.getElementById('f-reg-confirm').classList.add('has-error');
        return;
      }
      window.location.href = '../home/home.html';
    });
  }
});
