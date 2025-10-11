// Verificación al cargar: si no hay sesión o no es admin -> redirigir
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    const userRole = localStorage.getItem('userRole');

    if (!currentUser || userRole !== 'admin') {
        // Puedes cambiar la redirección a donde prefieras
        alert('Acceso restringido. Inicia sesión como administrador para acceder a esta página.');
        window.location.href = 'login.html';
        return;
    }

    // Si llega hasta aquí, el usuario es admin: opcionalmente mostrar info bienvenida
    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = `<p style="opacity:0.9">Bienvenido <strong>${currentUser}</strong>. Usa las herramientas para administrar el sitio.</p>`;
});

/* =========================
   Funciones administrativas
   ========================= */

function getUsers() {
    return JSON.parse(localStorage.getItem('usuarios')) || [];
}

function toggleUsersList() {
    const users = getUsers();
    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = `
        <h3><i class="fas fa-users"></i> Lista de Usuarios</h3>
        <div class="user-list">
          ${users.length === 0 ? '<p style="opacity:0.8">No hay usuarios registrados.</p>' : users.map(u => `
            <div class="user-item">
              <div><strong>${u.email}</strong></div>
              <div><span class="role-badge">${u.role}</span></div>
            </div>`).join('')}
        </div>
        <p style="margin-top:15px; opacity:0.85;">Total de usuarios: <strong>${users.length}</strong></p>
      `;
}

function showStats() {
    const users = getUsers();
    const adminCount = users.filter(u => u.role === 'admin').length;
    const clienteCount = users.filter(u => u.role === 'cliente').length;
    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = `
        <h3><i class="fas fa-chart-bar"></i> Estadísticas del Sistema</h3>
        <div class="stats-grid">
          <div class="stat-card"><div class="stat-number">${users.length}</div><div>Total Usuarios</div></div>
          <div class="stat-card"><div class="stat-number">${clienteCount}</div><div>Clientes</div></div>
          <div class="stat-card"><div class="stat-number">${adminCount}</div><div>Administradores</div></div>
          <div class="stat-card"><div class="stat-number">24/7</div><div>Disponibilidad</div></div>
        </div>
      `;
}

function toggleAdminTools() {
    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = `
        <h3><i class="fas fa-cogs"></i> Herramientas de Administración</h3>
        <div class="admin-buttons">
          <button class="admin-btn" onclick="clearAllUsers()">
            <i class="fas fa-trash"></i><br>Limpiar Usuarios
          </button>
          <button class="admin-btn" onclick="exportData()">
            <i class="fas fa-download"></i><br>Exportar Datos
          </button>
          <button class="admin-btn" onclick="showSystemInfo()">
            <i class="fas fa-info-circle"></i><br>Info del Sistema
          </button>
        </div>
      `;
}

function showReports() {
    const adminContent = document.getElementById('adminContent');
    const usersCount = getUsers().length;
    adminContent.innerHTML = `
        <h3><i class="fas fa-file-alt"></i> Reportes del Sistema</h3>
        <div style="background: rgba(255,255,255,0.06); padding: 20px; border-radius: 10px;">
          <p><strong>Reporte de Actividad:</strong></p>
          <ul style="list-style:none; padding:0;">
            <li style="padding:5px 0;"><i class="fas fa-users"></i> ${usersCount} usuarios registrados</li>
            <li style="padding:5px 0;"><i class="fas fa-calendar"></i> Último acceso: ${new Date().toLocaleString()}</li>
            <li style="padding:5px 0;"><i class="fas fa-server"></i> Almacenamiento: LocalStorage</li>
          </ul>
        </div>
      `;
}

function clearAllUsers() {
    if (confirm('¿Estás seguro de eliminar todos los usuarios? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('usuarios');
        alert('Usuarios eliminados exitosamente.');
        toggleUsersList();
    }
}

function exportData() {
    const users = getUsers();
    const dataStr = JSON.stringify(users, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'chilapenos_usuarios.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    document.body.appendChild(linkElement);
    linkElement.click();
    linkElement.remove();
}

function showSystemInfo() {
    const users = getUsers();
    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = `
        <h3><i class="fas fa-info-circle"></i> Información del Sistema</h3>
        <div style="background: rgba(255,255,255,0.06); padding:20px; border-radius:10px;">
          <p><strong>Sistema Chilapeños v1.0</strong></p>
          <p><strong>Navegador:</strong> ${navigator.userAgent}</p>
          <p><strong>Fecha del sistema:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Storage utilizado:</strong> LocalStorage</p>
          <p><strong>Usuarios registrados:</strong> ${users.length}</p>
          <p><strong>Estado:</strong> <span style="color:#4CAF50;">✓ Online</span></p>
        </div>
      `;
    }