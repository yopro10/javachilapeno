// Verificar si ya hay una sesión activa al cargar la página
window.addEventListener('load', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        showSessionAlert();
    }

    createDemoAccounts();
});

function showSessionAlert() {
    const currentUser = localStorage.getItem('currentUser');
    const userRole = localStorage.getItem('userRole');

    showAlert(
        `✅ Ya tienes una sesión activa como ${userRole}: ${currentUser}. 
         <br><a href="Principal.html" style="color: #fff; text-decoration: underline;">Ir al inicio</a> 
         o continúa aquí para cambiar de cuenta.`,
        'success'
    );
}

const btnCliente = document.getElementById("btnCliente");
const btnAdmin = document.getElementById("btnAdmin");
const title = document.getElementById("login-title");
const loginForm = document.getElementById("loginForm");
const crearCuentaLink = document.getElementById("crearCuentaLink");

const modalOverlay = document.getElementById("modalOverlay");
const newEmail = document.getElementById("newEmail");
const newPassword = document.getElementById("newPassword");
const selectedRoleInput = document.getElementById("selectedRole");
const cancelCreate = document.getElementById("cancelCreate");
const confirmCreate = document.getElementById("confirmCreate");

// Cambiar entre Cliente y Admin
btnCliente.addEventListener("click", () => {
    btnCliente.classList.add("active");
    btnAdmin.classList.remove("active");
    title.innerHTML = '<i class="fas fa-user"></i> Acceso de Cliente';
});

btnAdmin.addEventListener("click", () => {
    btnAdmin.classList.add("active");
    btnCliente.classList.remove("active");
    title.innerHTML = '<i class="fas fa-user-shield"></i> Acceso de Administrador';
});

// Funciones de storage
function getUsers() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function saveUser(user) {
    let users = getUsers();
    users.push(user);
    localStorage.setItem("usuarios", JSON.stringify(users));
}

function setUserSession(email, role) {
    localStorage.setItem('currentUser', email);
    localStorage.setItem('userRole', role);
}

function createDemoAccounts() {
    let users = getUsers();

    const demoAccounts = [
        { email: 'admin@chilapeños.com', password: 'admin123', role: 'admin' },
        { email: 'cliente@demo.com', password: 'cliente123', role: 'cliente' }
    ];

    demoAccounts.forEach(demo => {
        if (!users.find(u => u.email === demo.email)) {
            users.push(demo);
        }
    });

    localStorage.setItem("usuarios", JSON.stringify(users));
}

function showAlert(message, type = 'error') {
    const alertContainer = document.getElementById('alertContainer');
    
    // Limpiar alertas anteriores antes de mostrar una nueva
    alertContainer.innerHTML = '';
    
    alertContainer.innerHTML = `
        <div class="alert alert-${type}">
          <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
          ${message}
        </div>
      `;

    if (type === 'success') {
        setTimeout(() => {
            alertContainer.innerHTML = '';
        }, 8000);
    } else {
        setTimeout(() => {
            alertContainer.innerHTML = '';
        }, 5000);
    }
}

// 🆕 NUEVA FUNCIÓN: Mostrar alerta dentro del modal
function showModalAlert(message, type = 'error') {
    // Buscar o crear contenedor de alertas en el modal
    let modalAlertContainer = document.getElementById('modalAlertContainer');
    
    if (!modalAlertContainer) {
        modalAlertContainer = document.createElement('div');
        modalAlertContainer.id = 'modalAlertContainer';
        
        // Insertar antes del primer input-group del modal
        const modal = document.querySelector('.modal');
        const firstInputGroup = modal.querySelector('.input-group');
        modal.insertBefore(modalAlertContainer, firstInputGroup);
    }
    
    // Limpiar alertas anteriores
    modalAlertContainer.innerHTML = '';
    
    modalAlertContainer.innerHTML = `
        <div class="alert alert-${type}" style="margin-bottom: 15px;">
          <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
          ${message}
        </div>
    `;

    // Auto-limpiar después de 5 segundos
    setTimeout(() => {
        modalAlertContainer.innerHTML = '';
    }, 5000);
}

// 🆕 FUNCIÓN: Limpiar alertas del modal
function clearModalAlerts() {
    const modalAlertContainer = document.getElementById('modalAlertContainer');
    if (modalAlertContainer) {
        modalAlertContainer.innerHTML = '';
    }
}

function quickLogin(email, password, role) {
    if (role === 'admin') {
        btnAdmin.click();
    } else {
        btnCliente.click();
    }

    document.getElementById('email').value = email;
    document.getElementById('password').value = password;

    setTimeout(() => {
        loginForm.dispatchEvent(new Event('submit'));
    }, 300);
}

// EVENTO DE LOGIN
loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const users = getUsers();

    if (!email || !password) {
        showAlert("Por favor completa todos los campos", 'warning');
        return;
    }

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        showAlert("❌ Usuario o contraseña incorrectos", 'error');
        return;
    }

    const selectedRole = btnAdmin.classList.contains("active") ? "admin" : "cliente";

    if (user.role !== selectedRole) {
        showAlert(`⚠️ Esta cuenta es de tipo "${user.role}". Por favor selecciona el rol correcto.`, 'warning');
        return;
    }

    // Guardar sesión completa
    setUserSession(user.email, user.role);

    showAlert("✅ ¡Inicio de sesión exitoso! Redirigiendo...", 'success');

    // Verificar si hay una página guardada para volver
    setTimeout(() => {
        const returnTo = sessionStorage.getItem('returnTo');
        
        if (returnTo) {
            sessionStorage.removeItem('returnTo');
            window.location.href = returnTo;
        } else {
            window.location.href = "Principal.html";
        }
    }, 1500);
});

// Abrir modal de crear cuenta
crearCuentaLink.addEventListener("click", (e) => {
    e.preventDefault();
    
    // Limpiar alertas de la página principal
    const alertContainer = document.getElementById('alertContainer');
    if (alertContainer) {
        alertContainer.innerHTML = '';
    }
    
    // Limpiar alertas del modal
    clearModalAlerts();
    
    const role = btnAdmin.classList.contains("active") ? "admin" : "cliente";
    selectedRoleInput.value = role.charAt(0).toUpperCase() + role.slice(1);
    newEmail.value = "";
    newPassword.value = "";
    modalOverlay.style.display = "flex";
    
    setTimeout(() => {
        newEmail.focus();
    }, 100);
});

// Cancelar creación
cancelCreate.addEventListener("click", (e) => {
    e.preventDefault();
    modalOverlay.style.display = "none";
    
    // Limpiar campos del modal
    newEmail.value = "";
    newPassword.value = "";
    
    // Limpiar alertas del modal
    clearModalAlerts();
});

// ✅ CONFIRMAR CREACIÓN DE CUENTA (CORREGIDO)
confirmCreate.addEventListener("click", (e) => {
    e.preventDefault();
    const emailVal = newEmail.value.trim();
    const passVal = newPassword.value;
    const roleVal = btnAdmin.classList.contains("active") ? "admin" : "cliente";

    // 🔧 Validaciones ahora muestran alertas DENTRO del modal
    if (!emailVal || !passVal) {
        showModalAlert("Por favor completa correo y contraseña.", 'warning');
        return;
    }

    if (passVal.length < 6) {
        showModalAlert("⚠️ La contraseña debe tener al menos 6 caracteres.", 'warning');
        return;
    }

    let users = getUsers();
    if (users.some(u => u.email === emailVal)) {
        showModalAlert("⚠️ Este correo ya está registrado.", 'warning');
        return;
    }

    // Guardar nuevo usuario
    saveUser({ email: emailVal, password: passVal, role: roleVal });

    // Guardar sesión completa
    setUserSession(emailVal, roleVal);

    // Cerrar modal ANTES de mostrar la alerta de éxito
    modalOverlay.style.display = "none";
    
    // Limpiar campos
    newEmail.value = "";
    newPassword.value = "";
    
    // Limpiar alertas del modal
    clearModalAlerts();

    // Mostrar alerta de éxito en la página principal
    showAlert("✅ ¡Cuenta creada exitosamente! Redirigiendo...", 'success');

    // Verificar si hay una página guardada para volver
    setTimeout(() => {
        const returnTo = sessionStorage.getItem('returnTo');
        
        if (returnTo) {
            sessionStorage.removeItem('returnTo');
            window.location.href = returnTo;
        } else {
            window.location.href = "Principal.html";
        }
    }, 1500);
});

// Cerrar modal al hacer clic fuera del contenido
modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.style.display = "none";
        
        // Limpiar campos al cerrar
        newEmail.value = "";
        newPassword.value = "";
        
        // Limpiar alertas del modal
        clearModalAlerts();
    }
});

// Link 'olvidaste contraseña'
document.getElementById("forgotLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    const mail = prompt("Ingresa tu correo para enviar instrucciones de recuperación:");
    if (mail) {
        showAlert("Si el correo existe en nuestro sistema, recibirás las instrucciones de recuperación.", 'success');
    }
});

// Función para volver sin autenticar (modo invitado)
function goBackWithoutAuth() {
    window.location.href = 'Principal.html';
}

// Limpiar modo invitado cuando se carga la página de login
localStorage.removeItem('guestMode');