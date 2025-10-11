package repo;

import model.Pedido;
import java.util.ArrayList;
import java.util.List;

public class PedidoRepository {
    private List<Pedido> pedidos = new ArrayList<>();
    private int nextId = 1;

    public Pedido guardar(Pedido pedido) {
        // Asignar ID si es nuevo
        try {
            var idField = Pedido.class.getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(pedido, nextId++);
        } catch (Exception e) {
            throw new RuntimeException("Error asignando ID a pedido", e);
        }
        pedidos.add(pedido);
        return pedido;
    }


    public List<Pedido> listar() {
        return pedidos;
    }
}

