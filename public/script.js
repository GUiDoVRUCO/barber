document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
  
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = 'index.html';
    } else {
      alert(data.error);
    }
  });
  
  async function loadUsers() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return;
    }
  
    const response = await fetch('/api/users', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
  
    const users = await response.json();
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    users.forEach(user => {
      const li = document.createElement('li');
      li.textContent = `${user.username} (${user.role})`;
      const button = document.createElement('button');
      button.textContent = 'Remover';
      button.onclick = () => removeUser(user._id);
      li.appendChild(button);
      userList.appendChild(li);
    });
  }
  
  async function removeUser(id) {
    const token = localStorage.getItem('token');
    await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    loadUsers();
  }
  
  function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
  
  if (document.getElementById('userList')) {
    loadUsers();
  }