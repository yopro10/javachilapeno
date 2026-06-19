package daotest.controller;

import daotest.model.Carrito;
import daotest.repository.CarritoRepository;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/carrito")
public class CarritoController {

    private final CarritoRepository repository;

    public CarritoController(CarritoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Carrito> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Carrito add(@RequestBody Carrito carrito) {
        // Establecer fecha actual si no está definida
        if (carrito.getFecha() == null || carrito.getFecha().isEmpty()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            carrito.setFecha(LocalDateTime.now().format(formatter));
        }
        return repository.save(carrito);
    }
}