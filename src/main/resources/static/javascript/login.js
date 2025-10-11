// Verificar si ya hay una sesión activa al cargar la página
window.addEventListener('load', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        // Mostrar opción para continuar con la sesión actual o cambiar de cuenta
        showSessionAlert();
    }

    // Crear cuentas demo si no existen
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
    alertContainer.innerHTML = `
        <div class="alert alert-${type}">
          <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
          ${message}
        </div>
      `;

    // Auto-hide after 8 seconds for success messages with links
    if (type === 'success') {
        setTimeout(() => {
            alertContainer.innerHTML = '';
        }, 8000);
    } else {
        // Auto-hide after 5 seconds for other messages
        setTimeout(() => {
            alertContainer.innerHTML = '';
        }, 5000);
    }
}

function quickLogin(email, password, role) {
    // Cambiar el switch al rol correcto
    if (role === 'admin') {
        btnAdmin.click();
    } else {
        btnCliente.click();
    }

    // Llenar los campos
    document.getElementById('email').value = email;
    document.getElementById('password').value = password;

    // Simular submit
    setTimeout(() => {
        loginForm.dispatchEvent(new Event('submit'));
    }, 300);
}

// Evento de login
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

    // Verificar rol seleccionado en el switch
    const selectedRole = btnAdmin.classList.contains("active") ? "admin" : "cliente";

    if (user.role !== selectedRole) {
        showAlert(`⚠️ Esta cuenta es de tipo "${user.role}". Por favor selecciona el rol correcto.`, 'warning');
        return;
    }

    // Guardar sesión completa
    setUserSession(user.email, user.role);

    showAlert("✅ ¡Inicio de sesión exitoso! Redirigiendo...", 'success');

    // Redirigir SIEMPRE a Principal.html después de un breve delay
    setTimeout(() => {
        window.location.href = "Principal.html";
    }, 1500);
});

// Abrir modal de crear cuenta (usa el rol actual del switch)
crearCuentaLink.addEventListener("click", () => {
    const role = btnAdmin.classList.contains("active") ? "admin" : "cliente";
    selectedRoleInput.value = role.charAt(0).toUpperCase() + role.slice(1);
    newEmail.value = "";
    newPassword.value = "";
    modalOverlay.style.display = "flex";
    newEmail.focus();
});

// Cancelar creación
cancelCreate.addEventListener("click", (e) => {
    e.preventDefault();
    modalOverlay.style.display = "none";
});

// Confirmar creación -> guarda cuenta y ENTRA automáticamente
confirmCreate.addEventListener("click", (e) => {
    e.preventDefault();
    const emailVal = newEmail.value.trim();
    const passVal = newPassword.value;
    const roleVal = btnAdmin.classList.contains("active") ? "admin" : "cliente";

    if (!emailVal || !passVal) {
        showAlert("Por favor completa correo y contraseña.", 'warning');
        return;
    }

    if (passVal.length < 6) {
        showAlert("La contraseña debe tener al menos 6 caracteres.", 'warning');
        return;
    }

    let users = getUsers();
    if (users.some(u => u.email === emailVal)) {
        showAlert("⚠️ Este correo ya está registrado.", 'warning');
        return;
    }

    // Guardar nuevo usuario
    saveUser({ email: emailVal, password: passVal, role: roleVal });

    // Guardar sesión completa
    setUserSession(emailVal, roleVal);

    modalOverlay.style.display = "none";
    showAlert("✅ ¡Cuenta creada exitosamente! Redirigiendo...", 'success');

    // Redirigir SIEMPRE a Principal.html
    setTimeout(() => {
        window.location.href = "Principal.html";
    }, 1500);
});

// Cerrar modal al hacer clic fuera del contenido
modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.style.display = "none";
    }
});

// Link 'olvidaste contraseña'
document.getElementById("forgotLink").addEventListener("click", () => {
    const mail = prompt("Ingresa tu correo para enviar instrucciones de recuperación:");
    if (mail) {
        showAlert("Si el correo existe en nuestro sistema, recibirás las instrucciones de recuperación.", 'success');
    }
});

// Función para volver sin autenticar (modo invitado)
function goBackWithoutAuth() {
    // Simplemente redirigir sin preguntar
    window.location.href = 'Principal.html';
}

// Limpiar modo invitado cuando se carga la página de login
localStorage.removeItem('guestMode');