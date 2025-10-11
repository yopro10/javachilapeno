package servlets;

import Config.DBConnection;
import java.io.*;
import java.sql.*;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import org.json.JSONArray;
import org.json.JSONObject;

@WebServlet("/carrito")
public class CarritoServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();

        try {
            // Leer el JSON enviado desde el frontend
            StringBuilder sb = new StringBuilder();
            BufferedReader reader = req.getReader();
            String line;
            while ((line = reader.readLine()) != null) sb.append(line);
            JSONArray items = new JSONArray(sb.toString());

            Connection con = DBConnection.getConnection();
            String sql = "INSERT INTO carrito (nombre, precio, cantidad, subtotal) VALUES (?, ?, ?, ?)";
            PreparedStatement ps = con.prepareStatement(sql);

            for (int i = 0; i < items.length(); i++) {
                JSONObject item = items.getJSONObject(i);
                ps.setString(1, item.getString("nombre"));
                ps.setDouble(2, item.getDouble("precio"));
                ps.setInt(3, item.getInt("cantidad"));
                ps.setDouble(4, item.getDouble("precio") * item.getInt("cantidad"));
                ps.addBatch();
            }
            ps.executeBatch();
            out.print("{\"status\":\"ok\"}");

        } catch (Exception e) {
            e.printStackTrace();
            out.print("{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}");
        }
    }
}

