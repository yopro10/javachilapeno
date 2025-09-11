package controller;

import model.Producto;
import service.ProductoService;
import java.util.List;

public class ProductoController {
    private ProductoService service;

    public ProductoController(ProductoService service) {
        this.service = service;
    }

    public void mostrarProductos() {
        List<Producto> productos = service.listarProductos();
        productos.forEach(p ->
                System.out.println(p.getId() + " - " + p.getNombre() + " $" + p.getPrecio())
        );
    }
}
