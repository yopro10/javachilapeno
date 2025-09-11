package service;

import model.Producto;
import repo.ProductoRepository;
import java.util.List;

public class ProductoService {

    private ProductoRepository productoRepository;

    // Constructor principal (recibe el repo por inyección)
    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    // Constructor por defecto (para pruebas sin BD)
    public ProductoService() {
        this.productoRepository = new ProductoRepository();
    }

    // Agregar producto al catálogo
    public Producto agregarProducto(String nombre, double precio, String categoria) {
        Producto producto = new Producto(0, nombre, precio, categoria, 10);
        return productoRepository.guardar(producto);
    }

    // Listar todos los productos
    public List<Producto> listarProductos() {
        return productoRepository.listar();
    }

    // Buscar producto por ID
    public Producto buscarPorId(int id) {
        return productoRepository.buscarPorId(id);
    }
}
