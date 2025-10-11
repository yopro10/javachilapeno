package dao;

import Config.DBConnection;
import daotest.model.Carrito;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CarritoDAO {

    // Insertar producto al carrito
    public void agregarProducto(Carrito item) {
        String sql = "INSERT INTO carrito (producto_id, nombre, precio, cantidad, subtotal, fecha) VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            // productoId va a la columna producto_id
            stmt.setLong(1, item.getProductoId() != null ? item.getProductoId() : 0);
            stmt.setString(2, item.getNombre());
            stmt.setDouble(3, item.getPrecio());
            stmt.setInt(4, item.getCantidad());
            stmt.setDouble(5, item.getSubtotal() != null ? item.getSubtotal() : item.getPrecio() * item.getCantidad());
            stmt.setString(6, item.getFecha());

            stmt.executeUpdate();
            System.out.println("✅ Producto agregado al carrito en la BD");

        } catch (SQLException e) {
            System.out.println("❌ Error al agregar producto: " + e.getMessage());
        }
    }

    // Listar productos del carrito
    public List<Carrito> listarProductos() {
        List<Carrito> lista = new ArrayList<>();
        String sql = "SELECT * FROM carrito";

        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                Carrito item = new Carrito(
                        rs.getString("nombre"),
                        rs.getLong("producto_id"),
                        rs.getInt("cantidad"),
                        rs.getDouble("precio"),
                        rs.getDouble("subtotal")
                );
                item.setId(rs.getLong("id"));
                item.setFecha(rs.getString("fecha"));

                lista.add(item);
            }

        } catch (SQLException e) {
            System.out.println("❌ Error al listar productos: " + e.getMessage());
        }
        return lista;
    }

    // Eliminar producto
    public void eliminarProducto(Long id) {
        String sql = "DELETE FROM carrito WHERE id=?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1, id);
            stmt.executeUpdate();
            System.out.println("🗑 Producto eliminado del carrito");

        } catch (SQLException e) {
            System.out.println("❌ Error al eliminar: " + e.getMessage());
        }
    }

    // Vaciar carrito
    public void vaciarCarrito() {
        String sql = "DELETE FROM carrito";

        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement()) {

            stmt.executeUpdate(sql);
            System.out.println("🛒 Carrito vaciado");

        } catch (SQLException e) {
            System.out.println("❌ Error al vaciar carrito: " + e.getMessage());
        }
    }
}

