package daoTest;

import model.Usuario;
import model.Producto;
import model.Pedido;

import repo.UsuarioRepository;
import repo.ProductoRepository;
import repo.PedidoRepository;

import service.UsuarioService;
import service.ProductoService;
import service.PedidoService;

import java.util.Arrays;
import java.util.List;

public class App {
    public static void main(String[] args) {
        // 🔹 Instanciamos repositorios
        UsuarioRepository usuarioRepo = new UsuarioRepository();
        ProductoRepository productoRepo = new ProductoRepository();
        PedidoRepository pedidoRepo = new PedidoRepository();

        // 🔹 Instanciamos servicios
        UsuarioService usuarioService = new UsuarioService(usuarioRepo);
        ProductoService productoService = new ProductoService(productoRepo);
        PedidoService pedidoService = new PedidoService(pedidoRepo);

        try {
            // ================================
            // 1️⃣ Registrar usuario
            // ================================
            Usuario user = usuarioService.registrar("Juan Pérez", "juan@example.com", "1234");
            System.out.println("✅ Usuario registrado: " + user.getNombre());

            // ================================
            // 2️⃣ Login
            // ================================
            Usuario loginUser = usuarioService.login("juan@example.com", "1234");
            System.out.println("🔐 Login exitoso: " + loginUser.getNombre());

            // ================================
            // 3️⃣ Crear productos
            // ================================
            Producto p1 = productoService.agregarProducto("Hamburguesa", 15000, "Comida rápida");
            Producto p2 = productoService.agregarProducto("Pizza", 20000, "Comida rápida");
            Producto p3 = productoService.agregarProducto("Jugo natural", 5000, "Bebida");

            System.out.println("📦 Productos disponibles:");
            List<Producto> productos = productoService.listarProductos();
            for (Producto p : productos) {
                System.out.println("- " + p.getNombre() + " ($" + p.getPrecio() + ")");
            }

            // ================================
            // 4️⃣ Crear pedido
            // ================================
            Pedido pedido = pedidoService.crearPedido(loginUser, Arrays.asList(p1, p3));
            System.out.println("🛒 Pedido creado para " + pedido.getUsuario().getNombre());
            System.out.println("Productos en el pedido:");
            pedido.getProductos().forEach(prod ->
                    System.out.println("   - " + prod.getNombre())
            );

            // ================================
            // 5️⃣ Listar pedidos
            // ================================
            System.out.println("📋 Todos los pedidos:");
            for (Pedido ped : pedidoService.listarPedidos()) {
                System.out.println("Pedido #" + ped.getId() + " - Cliente: " + ped.getUsuario().getNombre());
            }

            // ================================
            // 6️⃣ Mostrar recibo detallado
            // ================================
            System.out.println("\n--- RECIBO ---");
            System.out.println(pedido.generarRecibo());

        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
        }
    }
}

