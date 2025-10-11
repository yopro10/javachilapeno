package dao;

import Config.DBConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ProductoDAO {

    public List<String> listarProductos() {
        List<String> lista = new ArrayList<>();
        String sql = "SELECT * FROM producto";
        try (Connection con = DBConnection.getConnection();
             Statement st = con.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            while (rs.next()) {
                String linea = rs.getInt("id") + " - " +
                        rs.getString("nombre") + " - $" +
                        rs.getDouble("precio") + " (Stock: " +
                        rs.getInt("stock") + ")";
                lista.add(linea);
            }
        } catch (SQLException e) {
            System.err.println("❌ Error al listar productos: " + e.getMessage());
        }
        return lista;
    }

    public static void main(String[] args) {
        ProductoDAO dao = new ProductoDAO();
        System.out.println("📦 Listado de productos:");
        dao.listarProductos().forEach(System.out::println);
    }
}
