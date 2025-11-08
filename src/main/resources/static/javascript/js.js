/* === MANEJAR RESPUESTAS CHATBOT === */
const btnChat = document.querySelector(".btn-chat");
const chatbotPanel = document.getElementById("chatbot-panel");
const overlay = document.getElementById("overlay"); // mismo overlay que carrito
const closeChatBtn = document.getElementById("close-chatbot");

const chatMessages = document.getElementById("chatbot-messages");
const chatInput = document.getElementById("chatbot-input");
const sendBtn = document.getElementById("chatbot-send");

// Abrir / cerrar panel (si existen)
btnChat?.addEventListener("click", () => {
    chatbotPanel?.classList.add("active");
    overlay?.classList.add("active");
});
closeChatBtn?.addEventListener("click", () => {
    chatbotPanel?.classList.remove("active");
    overlay?.classList.remove("active");
});
overlay?.addEventListener("click", () => {
    chatbotPanel?.classList.remove("active");
    overlay?.classList.remove("active");
});

// Agregar mensajes (seguro si chatMessages no existe)
function addMessage(text, sender = "bot") {
    if (!chatMessages) return;
    const msg = document.createElement("div");
    msg.classList.add("chat-message", sender);
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Mostrar opciones
function showOptions() {
    if (!chatMessages) return;
    const optionsContainer = document.createElement("div");
    optionsContainer.classList.add("chatbot-options");

    const options = [
        { text: "📱 Pedir por el aplicativo", reply: "Descárgalo desde la tienda y sigue 'Menú > Ordenar'." },
        { text: "📅 Cómo reservar", reply: "Llámanos al número oficial o usa 'Reservas' en la app." },
        { text: "💳 Métodos de pago", reply: "Aceptamos efectivo, tarjeta débito/crédito y transferencias." }
    ];

    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.textContent = opt.text;
        btn.classList.add("option-btn");
        btn.addEventListener("click", () => {
            addMessage(opt.text, "user");
            addMessage(opt.reply, "bot");
            optionsContainer.remove();
        });
        optionsContainer.appendChild(btn);
    });

    chatMessages.appendChild(optionsContainer);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Enviar mensaje manual
sendBtn?.addEventListener("click", () => {
    if (!chatInput) return;
    const userText = chatInput.value.trim();
    if (!userText) return;

    addMessage(userText, "user");
    chatInput.value = "";

    setTimeout(() => {
        addMessage("Elige una opción para continuar:", "bot");
        showOptions();
    }, 500);
});

// Saludo inicial (si existe chatMessages)
window.addEventListener("load", () => {
    setTimeout(() => {
        addMessage("¡Hola! Soy tu asistente virtual 😊", "bot");
    }, 500);
});

/* === CARRITO DE COMPRAS === */
const body = document.body;
const cartPanel = document.getElementById("cart-panel");
const openCartBtn = document.getElementById("open-cart-btn");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartCounter = document.querySelector(".cart-counter");
const checkoutBtn = document.querySelector(".checkout-btn");

/* === POPUPS === */
const confirmPopup = document.getElementById("payment-confirmation-popup");
const confirmCancelBtn = confirmPopup?.querySelector(".cancel-payment-btn");
const confirmConfirmBtn = confirmPopup?.querySelector(".confirm-payment-btn");

const successPopup = document.getElementById("payment-success-popup");
const successReturnBtn = successPopup?.querySelector(".return-btn");

const emptyCartPopup = document.getElementById("empty-cart-popup");
const emptyCartReturnBtn = emptyCartPopup?.querySelector(".return-btn");

let carrito = [];

/* === CAMBIAR CANTIDAD === */
function cambiarCantidad(btn, delta) {
    const input = btn?.parentElement?.querySelector(".quantity-input");
    if (!input) return;
    let val = parseInt(input.value) || 1;
    val = Math.max(1, val + delta);
    input.value = val;
}

/* === CREAR / MOSTRAR MODAL 'DEBES INICIAR SESIÓN' DINÁMICO === */
function showLoginRequiredModal() {
    // Si ya existe, abrirla
    if (document.getElementById('login-required-modal')) {
        document.getElementById('login-required-modal').style.display = 'flex';
        overlay?.classList.add('active');
        return;
    }

    // Crear modal
    const modal = document.createElement('div');
    modal.id = 'login-required-modal';
    modal.style = `
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    const box = document.createElement('div');
    box.style = `
        background: white;
        color: #111;
        padding: 18px;
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        max-width: 360px;
        width: 90%;
        text-align: center;
    `;

    box.innerHTML = `
        <h3 style="margin:0 0 8px">Necesitas iniciar sesión</h3>
        <p style="margin:0 0 12px; opacity:0.9">Para agregar productos al carrito debes iniciar sesión en tu cuenta.</p>
    `;

    const btnContainer = document.createElement('div');
    btnContainer.style = "display:flex; gap:10px; justify-content:center; margin-top:12px;";

    const loginBtn = document.createElement('button');
    loginBtn.textContent = 'Iniciar sesión';
    loginBtn.style = "padding:8px 12px; border-radius:8px; cursor:pointer; border:none; background:#1976d2; color:white;";
    loginBtn.addEventListener('click', () => {
        // redirigir a login (ajusta ruta si es necesaria)
        window.location.href = 'login.html';
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancelar';
    cancelBtn.style = "padding:8px 12px; border-radius:8px; cursor:pointer; border:1px solid #ccc; background:transparent;";
    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        overlay?.classList.remove('active');
    });

    btnContainer.appendChild(loginBtn);
    btnContainer.appendChild(cancelBtn);
    box.appendChild(btnContainer);
    modal.appendChild(box);
    document.body.appendChild(modal);
    overlay?.classList.add('active');
}

/* === AGREGAR PRODUCTO === */
function agregarAlCarrito(button) {
    try {
        // 1) Verificar sesión
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            // mostrar modal bonito en lugar de confirm()
            showLoginRequiredModal();
            return;
        }

        // 2) localizar item y leer datos (si falta quantity, usar 1)
        const item = button?.closest?.(".item");
        if (!item) return;

        const nombre = item.dataset?.nombre || item.querySelector('h2')?.textContent?.trim() || 'Producto';
        const precioRaw = item.dataset?.precio;
        const precio = precioRaw ? parseFloat(precioRaw) : parseFloat(item.querySelector('.price')?.textContent?.replace(/[^\d.]/g, '')) || 0;

        const qtyInput = item.querySelector(".quantity-input");
        const cantidad = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;

        // 3) añadir/actualizar en carrito
        const existente = carrito.find(p => p.nombre === nombre);
        if (existente) {
            existente.cantidad += cantidad;
        } else {
            carrito.push({ nombre, precio, cantidad });
        }

        actualizarCarrito();

        // 4) feedback breve en el botón (si existe)
        if (button) {
            const originalText = button.textContent;
            button.textContent = "✅ Agregado";
            button.disabled = true;
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 900);
        }
    } catch (err) {
        console.error('Error en agregarAlCarrito:', err);
    }
}

/* === ACTUALIZAR VISTA DEL CARRITO === */
function actualizarCarrito() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = "";

    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = "<p class='empty-cart-message'>Tu carrito está vacío.</p>";
        if (cartTotalEl) cartTotalEl.textContent = "0";
        if (cartCounter) cartCounter.textContent = "0";
        return;
    }

    let total = 0;
    carrito.forEach(item => {
        total += item.precio * item.cantidad;

        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <span>${item.nombre} x${item.cantidad}</span>
            <span>$${(item.precio * item.cantidad).toLocaleString()}</span>
            <button class="remove-item-btn" data-nombre="${item.nombre}">✖</button>
        `;
        cartItemsContainer.appendChild(div);
    });

    // Botones de eliminar
    cartItemsContainer.querySelectorAll(".remove-item-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            carrito = carrito.filter(p => p.nombre !== btn.dataset.nombre);
            actualizarCarrito();
        });
    });

    if (cartTotalEl) cartTotalEl.textContent = total.toLocaleString();
    if (cartCounter) cartCounter.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
}

/* === ABRIR / CERRAR PANEL DE CARRITO === */
openCartBtn?.addEventListener("click", e => {
    e?.preventDefault();
    cartPanel?.classList.add("active");
    body.classList.add("cart-open");
});

closeCartBtn?.addEventListener("click", () => {
    cartPanel?.classList.remove("active");
    body.classList.remove("cart-open");
});

/* === CHECKOUT / CONFIRMAR COMPRA === */
checkoutBtn?.addEventListener("click", () => {
    if (carrito.length === 0) {
        if (emptyCartPopup) emptyCartPopup.style.display = "flex";
        return;
    }
    if (confirmPopup) confirmPopup.style.display = "flex";
});

emptyCartReturnBtn?.addEventListener("click", () => { if (emptyCartPopup) emptyCartPopup.style.display = "none"; });
confirmCancelBtn?.addEventListener("click", () => { if (confirmPopup) confirmPopup.style.display = "none"; });

/* === ENVIAR AL SERVIDOR (BACKEND JAVA) === */
confirmConfirmBtn?.addEventListener("click", async () => {
    if (carrito.length === 0) return;

    if (confirmPopup) confirmPopup.style.display = "none";

    try {
        const res = await fetch("http://localhost:8080/javachilapenos/carrito", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(carrito)
        });

        const data = await res.json();

        if (data.status === "ok") {
            carrito = [];
            actualizarCarrito();
            if (successPopup) successPopup.style.display = "flex";
        } else {
            alert("❌ Error al guardar: " + data.message);
        }
    } catch (err) {
        alert("⚠️ No se pudo conectar con el servidor: " + err.message);
    }
});

/* === POPUP DE ÉXITO === */
successReturnBtn?.addEventListener("click", () => {
    if (successPopup) successPopup.style.display = "none";
});

/* === INICIALIZACIÓN DE UI === */
window.addEventListener("DOMContentLoaded", () => {
    if (confirmPopup) confirmPopup.style.display = "none";
    if (successPopup) successPopup.style.display = "none";
    if (emptyCartPopup) emptyCartPopup.style.display = "none";

    if (typeof checkAuthentication === "function") checkAuthentication();
    if (typeof initializeUI === "function") initializeUI();
});

// ===============================
// 🔑 Autenticación + Roles
// ===============================

function checkAuthentication() {
    const currentUser = localStorage.getItem('currentUser');
    const userRole = localStorage.getItem('userRole');
    if (currentUser && userRole) {
        setupUserInterface(currentUser, userRole);
    } else {
        setupGuestInterface();
    }
}

function setupGuestInterface() {
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    const ann = document.getElementById('adminAnnouncement');
    if (ann) ann.style.display = 'none';
    document.querySelectorAll('.cliente-only').forEach(el => el.style.display = 'block');

    const userIndicator = document.getElementById('userIndicator');
    if (userIndicator) userIndicator.style.display = 'none';
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.style.display = 'none';

    const loginFloatingBtn = document.querySelector('.floating-buttons .btn-login');
    if (loginFloatingBtn) loginFloatingBtn.style.display = 'flex';

    const hero = document.getElementById('heroBienvenida');
    if (hero) hero.textContent = 'Comida tradicional Mexicana, disfruta del mejor sabor mexicano sin picante... pero conservando nuestro toque secreto';
    const titulo = document.getElementById('tituloInicio');
    if (titulo) titulo.textContent = '¿Qué te provoca hoy?';
}

function setupUserInterface(userEmail, userRole) {
    const userIndicator = document.getElementById('userIndicator');
    const emailSpan = document.getElementById('userEmail');
    const roleDisplay = document.getElementById('userRoleDisplay');
    if (userIndicator) userIndicator.style.display = 'block';
    if (emailSpan) emailSpan.textContent = userEmail;
    if (roleDisplay) {
        roleDisplay.textContent = userRole;
        roleDisplay.className = 'role-badge role-' + userRole;
    }
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.style.display = 'flex';

    if (userRole === 'admin') {
        setupAdminInterface(userEmail);
    } else {
        setupClienteInterface(userEmail);
    }
}

function setupClienteInterface(userEmail) {
    document.querySelectorAll('.cliente-only').forEach(el => el.style.display = 'block');
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    const ann = document.getElementById('adminAnnouncement');
    if (ann) ann.style.display = 'none';
    const loginFloatingBtn = document.querySelector('.floating-buttons .btn-login');
    if (loginFloatingBtn) loginFloatingBtn.style.display = 'none';
    const firstName = (userEmail || '').split('@')[0];
    const hero = document.getElementById('heroBienvenida');
    if (hero) hero.textContent = `¡Hola ${firstName}! Disfruta del mejor sabor mexicano sin picante... pero conservando nuestro toque secreto.`;
}

function setupAdminInterface(userEmail) {
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) adminPanel.style.display = 'none';
    const ann = document.getElementById('adminAnnouncement');
    if (ann) ann.style.display = 'block';
    document.querySelectorAll('.admin-only').forEach(el => {
        if (el.tagName && el.tagName.toLowerCase() === 'a') el.style.display = 'inline-block';
        else el.style.display = 'block';
    });
    const loginFloatingBtn = document.querySelector('.floating-buttons .btn-login');
    if (loginFloatingBtn) loginFloatingBtn.style.display = 'none';
    const hero = document.getElementById('heroBienvenida');
    if (hero) hero.textContent = `¡Bienvenido Administrador! Gestiona tu restaurante Chilapeño desde el Panel de Administrador.`;
    const titulo = document.getElementById('tituloInicio');
    if (titulo) titulo.textContent = '¿Qué quieres administrar hoy?';
}

function showClientePanel() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        if (confirm('Necesitas iniciar sesión para acceder a tu cuenta personal. ¿Quieres iniciar sesión ahora?')) {
            window.location.href = 'login.html';
        }
        return;
    }
    alert('Panel de cliente - Aquí podrías mostrar pedidos, favoritos, etc.');
}

function requireAuth(callback) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        if (confirm('Esta función requiere iniciar sesión. ¿Quieres iniciar sesión ahora?')) {
            window.location.href = 'login.html';
        }
        return false;
    }
    return callback ? callback() : true;
}

function cerrarSesion() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    window.location.href = 'login.html';
}

// ===========================
// FUNCIONES ADMIN
// ===========================
function showAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel && (adminPanel.style.display === 'none' || getComputedStyle(adminPanel).display === 'none')) {
        window.location.href = 'PanelAdmin.html';
        return;
    }
    if (!requireAuth()) return;
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
        alert('Acceso denegado. Solo los administradores pueden acceder a este panel.');
        return;
    }
    adminPanel.scrollIntoView({ behavior: 'smooth' });
}

function toggleUsersList() {
    if (!requireAuth()) return;
    const adminContent = document.getElementById('adminContent');
    const users = getUsers();
    adminContent.innerHTML = `
        <h3><i class="fas fa-users"></i> Lista de Usuarios</h3>
        <div class="user-list">
            ${users.map(user => `
                <div class="user-item">
                    <div><strong>${user.email}</strong></div>
                    <span class="role-badge role-${user.role}">${user.role}</span>
                </div>
            `).join('')}
        </div>
        <p style="margin-top: 15px; opacity: 0.8;">Total de usuarios: ${users.length}</p>
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
            <button class="admin-btn" onclick="clearAllUsers()"><i class="fas fa-trash"></i><br>Limpiar Usuarios</button>
            <button class="admin-btn" onclick="exportData()"><i class="fas fa-download"></i><br>Exportar Datos</button>
            <button class="admin-btn" onclick="showSystemInfo()"><i class="fas fa-info-circle"></i><br>Info del Sistema</button>
        </div>
    `;
}

function showReports() {
    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = `
        <h3><i class="fas fa-file-alt"></i> Reportes del Sistema</h3>
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px;">
            <p><strong>Reporte de Actividad:</strong></p>
            <ul style="list-style: none; padding: 0;">
                <li><i class="fas fa-check text-success"></i> Sistema operativo</li>
                <li><i class="fas fa-users"></i> ${getUsers().length} usuarios registrados</li>
                <li><i class="fas fa-calendar"></i> Último acceso: ${new Date().toLocaleString()}</li>
                <li><i class="fas fa-server"></i> Almacenamiento: LocalStorage</li>
            </ul>
        </div>
    `;
}

// Auxiliares admin
function getUsers() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}
function clearAllUsers() {
    if (confirm('¿Estás seguro de eliminar todos los usuarios? Esta acción no se puede deshacer.')) {
        localStorage.removeItem("usuarios");
        alert('Usuarios eliminados exitosamente.');
        toggleUsersList();
    }
}
function exportData() {
    const users = getUsers();
    const dataStr = JSON.stringify(users, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'chilapeños_usuarios.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}
function showSystemInfo() {
    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = `
        <h3><i class="fas fa-info-circle"></i> Información del Sistema</h3>
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px;">
            <p><strong>Sistema Chilapeños v1.0</strong></p>
            <p><strong>Navegador:</strong> ${navigator.userAgent.split(' ')[0]}</p>
            <p><strong>Fecha del sistema:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Storage utilizado:</strong> LocalStorage</p>
            <p><strong>Usuarios registrados:</strong> ${getUsers().length}</p>
            <p><strong>Estado:</strong> <span style="color: #4CAF50;">✓ Online</span></p>
        </div>
    `;
}

// ===========================
// UI: modo oscuro + scroll suave
// ===========================
function initializeUI() {
    const toggleBtn = document.getElementById("darkModeToggle");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            body.classList.toggle("dark-mode");
            const icon = toggleBtn.querySelector("i");
            if (body.classList.contains("dark-mode")) {
                icon.classList.replace("fa-moon", "fa-sun");
                localStorage.setItem("theme", "dark");
            } else {
                icon.classList.replace("fa-sun", "fa-moon");
                localStorage.setItem("theme", "light");
            }
        });
    }
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
        if (toggleBtn) {
            const icon = toggleBtn.querySelector("i");
            if (icon) icon.classList.replace("fa-moon", "fa-sun");
        }
    }
    document.querySelectorAll("a[href^='#']").forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) target.scrollIntoView({ behavior: "smooth" });
        });
    });
}

/* Fallback Admin link (sin romper si navbar no existe) */
(function(){
    try {
        const cur = localStorage.getItem('currentUser');
        const role = localStorage.getItem('userRole');
        const navbar = document.querySelector('.navbar');
        const adminLink = navbar?.querySelector('.admin-only');
        if (adminLink && cur && role === 'admin') {
            adminLink.style.display = 'inline-block';
        } else if (!adminLink && navbar && cur && role === 'admin') {
            const a = document.createElement('a');
            a.href = 'PanelAdmin.html';
            a.className = 'admin-only';
            a.textContent = 'Panel Admin';
            a.style.display = 'inline-block';
            navbar.appendChild(a);
        }
        console.log('[FALLBACK eventos] currentUser:', cur, 'role:', role);
    } catch (e) {
        console.error('[FALLBACK eventos] error', e);
    }
})();
