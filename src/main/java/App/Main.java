package App;

import dao.UsuarioDAO;
import model.Usuario;

public class Main {
    public static void main(String[] args) {
        UsuarioDAO usuarioDAO = new UsuarioDAO();

        // 1. Insertar usuario
        Usuario nuevo = new Usuario(0, "Andres", "andres@gmail.com", "1234", "admin");
        usuarioDAO.insertarUsuario(nuevo);

        // 2. Buscar por email
        Usuario encontrado = usuarioDAO.buscarPorEmail("andres@gmail.com");
        if (encontrado != null) {
            System.out.println("Usuario encontrado: " + encontrado.getNombre() + " - " + encontrado.getEmail());
        } else {
            System.out.println("No se encontró usuario con ese email.");
        }

        // 3. Listar todos
        System.out.println("\n📋 Lista de usuarios:");
        for (Usuario u : usuarioDAO.obtenerUsuarios()) {
            System.out.println("- " + u.getId() + ": " + u.getNombre() + " (" + u.getEmail() + ")");
        }

        // 4. Actualizar usuario
        if (encontrado != null) {
            encontrado.setNombre("Andres Actualizado");
            usuarioDAO.actualizarUsuario(encontrado);
        }

        // 5. Eliminar usuario
        //if (encontrado != null) {
        //    usuarioDAO.eliminarUsuario(encontrado.getId());
        // }
    }
}

