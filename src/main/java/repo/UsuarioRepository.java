package repo;

import model.Usuario;
import java.util.ArrayList;
import java.util.List;

public class UsuarioRepository {
    private List<Usuario> usuarios = new ArrayList<>();
    private int nextId = 1;

    public Usuario guardar(Usuario usuario) {
        usuario.setId(nextId++);
        usuarios.add(usuario);
        return usuario;
    }

    public Usuario buscarPorEmail(String email) {
        for (Usuario u : usuarios) {
            if (u.getEmail().equalsIgnoreCase(email)) {
                return u;
            }
        }
        return null;
    }

    public List<Usuario> listar() {
        return usuarios;
    }
}

