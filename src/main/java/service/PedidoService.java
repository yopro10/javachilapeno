package service;

import model.Pedido;
import model.Usuario;
import model.Producto;
import repo.PedidoRepository;
import java.util.List;

public class PedidoService {
    private PedidoRepository pedidoRepository;

    public PedidoService(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    // Crear pedido
    public Pedido crearPedido(Usuario usuario, List<Producto> productos) {
        if (productos == null || productos.isEmpty()) {
            throw new RuntimeException("El pedido debe tener al menos un producto.");
        }
        Pedido pedido = new Pedido(0, usuario, productos);
        return pedidoRepository.guardar(pedido);
    }

    // Listar pedidos
    public List<Pedido> listarPedidos() {
        return pedidoRepository.listar();
    }
}
