package repo;

import model.Producto;
import java.util.ArrayList;
import java.util.List;

public class ProductoRepository {
    private List<Producto> productos = new ArrayList<>();
    private int nextId = 1;

    public Producto guardar(Producto producto) {
        producto.setId(nextId++);
        productos.add(producto);
        return producto;
    }

    public Producto buscarPorId(int id) {
        for (Producto p : productos) {
            if (p.getId() == id) {
                return p;
            }
        }
        return null;
    }

    public List<Producto> listar() {
        return productos;
    }
}
