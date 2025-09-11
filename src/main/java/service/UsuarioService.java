package service;

import model.Usuario;
import repo.UsuarioRepository;

public class UsuarioService {
    private UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // Registro de usuario
    public Usuario registrar(String nombre, String email, String password) {
        if (usuarioRepository.buscarPorEmail(email) != null) {
            throw new RuntimeException("El correo ya está registrado.");
        }
        Usuario nuevo = new Usuario(0, nombre, email, password,"Cliente");
        return usuarioRepository.guardar(nuevo);
    }

    // Login
    public Usuario login(String email, String password) {
        Usuario usuario = usuarioRepository.buscarPorEmail(email);
        if (usuario == null || !usuario.getPassword().equals(password)) {
            throw new RuntimeException("Credenciales inválidas.");
        }
        return usuario;
    }
}

