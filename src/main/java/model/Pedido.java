package model;

import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class Pedido {
    private final int id;               // inmutable
    private final Usuario usuario;      // inmutable
    private final Date fecha;           // inmutable (momento creación)
    private List<Producto> productos;

    public Pedido(int id, Usuario usuario, List<Producto> productos) {
        this.id = id;
        this.usuario = usuario;
        this.fecha = new Date(); // se fija al momento de crear el pedido
        this.productos = productos != null ? new ArrayList<>(productos) : new ArrayList<>();
    }

    // Método auxiliar para calcular el total
    private double calcularTotal() {
        return productos.stream().mapToDouble(Producto::getPrecio).sum();
    }

    // Agregar producto al pedido
    public void agregarProducto(Producto producto) {
        if (producto != null) {
            this.productos.add(producto);
        }
    }

    // Generar recibo del pedido
    public String generarRecibo() {
        StringBuilder recibo = new StringBuilder();
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm");
        NumberFormat nf = NumberFormat.getCurrencyInstance(new Locale("es", "CO"));

        recibo.append("🧾 Recibo del Pedido #").append(id).append("\n");
        recibo.append("Cliente: ").append(usuario.getNombre()).append("\n");
        recibo.append("Fecha: ").append(sdf.format(fecha)).append("\n\n");

        recibo.append("Productos:\n");
        for (Producto p : productos) {
            recibo.append("  - ").append(p.getNombre())
                    .append(" (").append(nf.format(p.getPrecio())).append(")\n");
        }

        recibo.append("\n💰 Total a pagar: ").append(nf.format(calcularTotal())).append("\n");

        return recibo.toString();
    }

    // Getters
    public int getId() { return id; }
    public Usuario getUsuario() { return usuario; }
    public List<Producto> getProductos() { return new ArrayList<>(productos); }
    public double getTotal() { return calcularTotal(); }
    public Date getFecha() { return fecha; }

    @Override
    public String toString() {
        return "Pedido{" +
                "id=" + id +
                ", usuario=" + usuario.getNombre() +
                ", total=" + calcularTotal() +
                ", fecha=" + fecha +
                '}';
    }
}


