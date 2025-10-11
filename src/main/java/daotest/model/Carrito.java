package daotest.model;

import jakarta.persistence.*;

@Entity
@Table(name = "carrito")
public class Carrito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productoId;   // 🔹 Clave del producto
    private String nombre;
    private Double precio;
    private Integer cantidad;
    private Double subtotal;
    private String fecha;

    // 🔹 Constructor vacío (OBLIGATORIO para Hibernate)
    public Carrito() {}

    // 🔹 Constructor con tus campos clave
    public Carrito(String nombre, Long productoId, Integer cantidad, Double precio, Double subtotal) {
        this.nombre = nombre;
        this.productoId = productoId;
        this.cantidad = cantidad;
        this.precio = precio;
        this.subtotal = subtotal;
    }

    // 🔹 Constructor completo (si lo necesitas en otro caso)
    public Carrito(Long id, String nombre, Long productoId, Integer cantidad, Double precio, Double subtotal, String fecha) {
        this.id = id;
        this.nombre = nombre;
        this.productoId = productoId;
        this.cantidad = cantidad;
        this.precio = precio;
        this.subtotal = subtotal;
        this.fecha = fecha;
    }

    // ========================
    // Getters y Setters
    // ========================
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductoId() { return productoId; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }
}
