/* === MANEJAR RESPUESTAS CHATBOT === */
const btnChat = document.querySelector(".btn-chat");
const chatbotPanel = document.getElementById("chatbot-panel");
const closeChatBtn = document.getElementById("close-chatbot");

const chatMessages = document.getElementById("chatbot-messages");
const chatInput = document.getElementById("chatbot-input");
const sendBtn = document.getElementById("chatbot-send");

btnChat?.addEventListener("click", () => {
    chatbotPanel?.classList.add("active");
    document.getElementById("overlay")?.classList.add("active");
});
closeChatBtn?.addEventListener("click", () => {
    chatbotPanel?.classList.remove("active");
    document.getElementById("overlay")?.classList.remove("active");
});

function addMessage(text, sender = "bot") {
    if (!chatMessages) return;
    const msg = document.createElement("div");
    msg.classList.add("chat-message", sender);
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

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

window.addEventListener("load", () => {
    setTimeout(() => {
        addMessage("¡Hola! Soy tu asistente virtual 😊", "bot");
    }, 500);
});

/* === CARRITO DE COMPRAS MEJORADO (POR USUARIO) === */
const body = document.body;
const cartPanel = document.getElementById("cart-panel");
const openCartBtn = document.getElementById("open-cart-btn");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartCounters = document.querySelectorAll(".cart-counter");
const checkoutBtn = document.querySelector(".checkout-btn");
const overlay = document.getElementById("overlay");

const confirmPopup = document.getElementById("payment-confirmation-popup");
const confirmCancelBtn = confirmPopup?.querySelector(".cancel-payment-btn");
const confirmConfirmBtn = confirmPopup?.querySelector(".confirm-payment-btn");

const successPopup = document.getElementById("payment-success-popup");
const successReturnBtn = successPopup?.querySelector(".return-btn");

const emptyCartPopup = document.getElementById("empty-cart-popup");
const emptyCartReturnBtn = emptyCartPopup?.querySelector(".return-btn");

// Variable global del carrito
let carrito = [];

// 🔑 FUNCIÓN PARA OBTENER LA CLAVE DEL CARRITO DEL USUARIO ACTUAL
function getCartKey() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? `carrito_${currentUser}` : 'carrito_guest';
}

// Cargar carrito del usuario actual desde localStorage
function cargarCarrito() {
    const cartKey = getCartKey();
    carrito = JSON.parse(localStorage.getItem(cartKey)) || [];
    actualizarCarrito();
}

// Función para guardar el carrito del usuario actual
function guardarCarrito() {
    const cartKey = getCartKey();
    localStorage.setItem(cartKey, JSON.stringify(carrito));
}

// 🧹 FUNCIÓN PARA LIMPIAR EL CARRITO AL CERRAR SESIÓN
function limpiarCarritoUsuario() {
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
}

/* === INICIALIZAR SELECTORES DE CANTIDAD === */
function initializeQuantitySelectors() {
    const currentUser = localStorage.getItem('currentUser');
    const userRole = localStorage.getItem('userRole');
    
    if (!currentUser || !userRole) return;
    
    document.querySelectorAll('.item').forEach(item => {
        if (item.querySelector('.quantity-selector')) return;
        
        const selector = document.createElement('div');
        selector.className = 'quantity-selector';
        selector.innerHTML = `
            <button class="quantity-btn minus-btn" onclick="cambiarCantidad(this, -1)">−</button>
            <input type="number" class="quantity-input" value="1" min="1" max="99" readonly>
            <button class="quantity-btn plus-btn" onclick="cambiarCantidad(this, 1)">+</button>
        `;
        
        const addBtn = item.querySelector('.add-to-cart-btn');
        if (addBtn) {
            addBtn.parentNode.insertBefore(selector, addBtn);
        }
    });
}

/* === CAMBIAR CANTIDAD === */
function cambiarCantidad(btn, delta) {
    const input = btn.parentElement.querySelector(".quantity-input");
    if (!input) return;
    
    let val = parseInt(input.value) || 1;
    val = Math.max(1, Math.min(99, val + delta));
    input.value = val;
    
    btn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 100);
}

/* === FUNCIÓN PARA DETECTAR LA RUTA CORRECTA === */
function getLoginPath() {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/opciones/') || 
        currentPath.includes('/bebidas/') || 
        currentPath.includes('/postres/')) {
        return '../login.html';
    }
    
    return 'login.html';
}

/* === MODAL 'DEBES INICIAR SESIÓN' === */
function showLoginRequiredModal() {
    const existingModal = document.getElementById('login-required-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'login-required-modal';
    modal.style.cssText = `
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
    `;

    const box = document.createElement('div');
    box.style.cssText = `
        background: white;
        color: #111;
        padding: 30px;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        max-width: 420px;
        width: 90%;
        text-align: center;
        animation: slideIn 0.3s ease;
    `;

    box.innerHTML = `
        <div style="font-size: 56px; margin-bottom: 20px;">🔒</div>
        <h3 style="margin:0 0 12px; font-size: 22px; color: #111; font-weight: 700;">
            ¡Espera un momento!
        </h3>
        <p style="margin:0 0 24px; opacity:0.75; font-size: 15px; line-height: 1.5;">
            Para agregar productos a tu carrito necesitas iniciar sesión o crear una cuenta.
        </p>
    `;

    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = "display:flex; gap:12px; justify-content:center; margin-top:24px;";

    const loginBtn = document.createElement('button');
    loginBtn.textContent = '🔐 Iniciar sesión';
    loginBtn.style.cssText = `
        padding: 14px 28px;
        border-radius: 10px;
        cursor: pointer;
        border: none;
        background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
        color: white;
        font-weight: 700;
        font-size: 15px;
        transition: all 0.3s;
        box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
        flex: 1;
    `;
    
    loginBtn.onmouseover = () => {
        loginBtn.style.transform = 'translateY(-3px)';
        loginBtn.style.boxShadow = '0 8px 25px rgba(255, 107, 53, 0.5)';
    };
    loginBtn.onmouseout = () => {
        loginBtn.style.transform = 'translateY(0)';
        loginBtn.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)';
    };
    
    loginBtn.addEventListener('click', () => {
        sessionStorage.setItem('returnTo', window.location.pathname);
        window.location.href = getLoginPath();
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancelar';
    cancelBtn.style.cssText = `
        padding: 14px 28px;
        border-radius: 10px;
        cursor: pointer;
        border: 2px solid #e0e0e0;
        background: transparent;
        color: #666;
        font-weight: 600;
        font-size: 15px;
        transition: all 0.3s;
        flex: 0.7;
    `;
    
    cancelBtn.addEventListener('click', () => {
        modal.remove();
        overlay?.classList.remove('active');
    });

    btnContainer.appendChild(loginBtn);
    btnContainer.appendChild(cancelBtn);
    box.appendChild(btnContainer);
    modal.appendChild(box);
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            overlay?.classList.remove('active');
        }
    });
}

/* === AGREGAR PRODUCTO AL CARRITO === */
function agregarAlCarrito(button) {
    try {
        const currentUser = localStorage.getItem('currentUser');
        const userRole = localStorage.getItem('userRole');
        
        if (!currentUser || !userRole) {
            showLoginRequiredModal();
            return;
        }

        const item = button?.closest?.(".item");
        if (!item) return;

        const nombre = item.dataset?.nombre || item.querySelector('h2')?.textContent?.trim() || 'Producto';
        const precioRaw = item.dataset?.precio;
        const precio = precioRaw ? parseFloat(precioRaw) : 0;

        const qtyInput = item.querySelector(".quantity-input");
        const cantidad = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;

        const existente = carrito.find(p => p.nombre === nombre);
        if (existente) {
            existente.cantidad += cantidad;
        } else {
            carrito.push({ nombre, precio, cantidad });
        }

        guardarCarrito();
        actualizarCarrito();

        if (button) {
            const originalText = button.textContent;
            button.innerHTML = '✅ ¡Agregado!';
            button.style.background = 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';
            button.disabled = true;
            
            if (qtyInput) qtyInput.value = 1;
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
                button.disabled = false;
            }, 1500);
        }
        
        cartCounters.forEach(counter => {
            counter.classList.add('has-items');
            setTimeout(() => counter.classList.remove('has-items'), 500);
        });
        
    } catch (err) {
        console.error('Error en agregarAlCarrito:', err);
        alert('Ocurrió un error al agregar el producto.');
    }
}

/* === ACTUALIZAR VISTA DEL CARRITO === */
function actualizarCarrito() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = "";

    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                Tu carrito está vacío
            </div>
        `;
        if (cartTotalEl) cartTotalEl.textContent = "0";
        cartCounters.forEach(counter => counter.textContent = "0");
        return;
    }

    let total = 0;
    carrito.forEach((item, index) => {
        total += item.precio * item.cantidad;

        const div = document.createElement("div");
        div.className = "cart-item";
        div.style.animationDelay = `${index * 0.05}s`;
        div.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.nombre}</div>
                <div class="cart-item-quantity">
                    <button onclick="cambiarCantidadCarrito('${item.nombre}', -1)">−</button>
                    <span>${item.cantidad}</span>
                    <button onclick="cambiarCantidadCarrito('${item.nombre}', 1)">+</button>
                </div>
                <div class="cart-item-price">$${(item.precio * item.cantidad).toLocaleString()}</div>
            </div>
            <button class="remove-item-btn" onclick="eliminarDelCarrito('${item.nombre}')" title="Eliminar">✖</button>
        `;
        cartItemsContainer.appendChild(div);
    });

    if (cartTotalEl) cartTotalEl.textContent = total.toLocaleString();
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    cartCounters.forEach(counter => counter.textContent = totalItems);
}

/* === CAMBIAR CANTIDAD EN EL CARRITO === */
function cambiarCantidadCarrito(nombre, delta) {
    const item = carrito.find(p => p.nombre === nombre);
    if (!item) return;
    
    item.cantidad += delta;
    
    if (item.cantidad <= 0) {
        carrito = carrito.filter(p => p.nombre !== nombre);
    }
    
    guardarCarrito();
    actualizarCarrito();
}

/* === ELIMINAR DEL CARRITO === */
function eliminarDelCarrito(nombre) {
    carrito = carrito.filter(p => p.nombre !== nombre);
    guardarCarrito();
    actualizarCarrito();
}

/* === ABRIR/CERRAR CARRITO === */
openCartBtn?.addEventListener("click", e => {
    e?.preventDefault();
    
    const currentUser = localStorage.getItem('currentUser');
    const userRole = localStorage.getItem('userRole');
    
    if (!currentUser || !userRole) {
        showLoginRequiredModal();
        return;
    }
    
    cartPanel?.classList.add("active");
    overlay?.classList.add("active");
});

closeCartBtn?.addEventListener("click", () => {
    cartPanel?.classList.remove("active");
    overlay?.classList.remove("active");
});

overlay?.addEventListener("click", () => {
    cartPanel?.classList.remove("active");
    overlay?.classList.remove("active");
    chatbotPanel?.classList.remove('active');
});

/* === CHECKOUT === */
checkoutBtn?.addEventListener("click", () => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        showLoginRequiredModal();
        return;
    }
    
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const mensaje = `¡Pedido confirmado!\n\nTotal: $${total.toLocaleString()}\n\nGracias por tu compra.`;
    
    if (confirm(mensaje + '\n\n¿Deseas proceder con el pago?')) {
        carrito = [];
        guardarCarrito();
        actualizarCarrito();
        cartPanel?.classList.remove("active");
        overlay?.classList.remove("active");
        alert('¡Pedido procesado exitosamente! 🎉');
    }
});

emptyCartReturnBtn?.addEventListener("click", () => { 
    if (emptyCartPopup) emptyCartPopup.style.display = "none"; 
});

confirmCancelBtn?.addEventListener("click", () => { 
    if (confirmPopup) confirmPopup.style.display = "none"; 
});

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
            guardarCarrito();
            actualizarCarrito();
            if (successPopup) successPopup.style.display = "flex";
        } else {
            alert("❌ Error al guardar: " + data.message);
        }
    } catch (err) {
        alert("⚠️ No se pudo conectar con el servidor: " + err.message);
    }
});

successReturnBtn?.addEventListener("click", () => {
    if (successPopup) successPopup.style.display = "none";
});

/* === INICIALIZACIÓN === */
window.addEventListener("DOMContentLoaded", () => {
    if (confirmPopup) confirmPopup.style.display = "none";
    if (successPopup) successPopup.style.display = "none";
    if (emptyCartPopup) emptyCartPopup.style.display = "none";

    // 🔑 CARGAR CARRITO DEL USUARIO ACTUAL
    cargarCarrito();
    
    setTimeout(() => {
        initializeQuantitySelectors();
    }, 100);
    
    if (typeof checkAuthentication === "function") checkAuthentication();
    if (typeof initializeUI === "function") initializeUI();
    
    // Inicializar scroll suave al menú
    initializeScrollToMenu();
});

// ===============================
// 🔑 Autenticación + Roles
// ===============================

function checkAuthentication() {
    const currentUser = localStorage.getItem('currentUser');
    const userRole = localStorage.getItem('userRole');
    if (currentUser && userRole) {
        setupUserInterface(currentUser, userRole);
        // 🔑 CARGAR CARRITO AL INICIAR SESIÓN
        cargarCarrito();
    } else {
        setupGuestInterface();
        // 🧹 LIMPIAR CARRITO SI NO HAY SESIÓN
        limpiarCarritoUsuario();
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
    
    initializeQuantitySelectors();
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
        showLoginRequiredModal();
        return;
    }
    alert('Panel de cliente - Aquí podrías mostrar pedidos, favoritos, etc.');
}

function requireAuth(callback) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        showLoginRequiredModal();
        return false;
    }
    return callback ? callback() : true;
}

function cerrarSesion() {
    // ℹ️ El carrito del usuario se mantiene guardado para cuando vuelva a iniciar sesión
    // NO limpiamos el carrito, solo cerramos la sesión
    
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    window.location.href = getLoginPath();
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

// ===========================
// SCROLL SUAVE AL MENÚ (VELOCIDAD PERSONALIZADA)
// ===========================
function initializeScrollToMenu() {
    const scrollToMenuBtn = document.getElementById('scrollToMenu');
    const categoriasSection = document.getElementById('categorias');
    
    if (scrollToMenuBtn && categoriasSection) {
        scrollToMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener la altura de la navbar para ajustar el scroll
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            
            // Calcular la posición del elemento
            const targetPosition = categoriasSection.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = targetPosition - navbarHeight - 20; // 20px de margen adicional
            
            // Scroll suave con velocidad personalizada
            smoothScrollTo(offsetPosition, 1500); // 1500ms = 1.5 segundos (más lento)
            
            // Animación visual en el botón al hacer clic
            scrollToMenuBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                scrollToMenuBtn.style.transform = 'scale(1)';
            }, 150);
        });
    }
}

// Función para scroll suave personalizado
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Función de suavizado (easeInOutCubic)
        const ease = progress < 0.5 
            ? 4 * progress * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// ===========================
// FALLBACK: Admin link en navbar
// ===========================
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
    } catch (e) {
        console.error('[FALLBACK eventos] error', e);
    }
})();