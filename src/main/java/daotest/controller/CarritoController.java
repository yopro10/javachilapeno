package daotest.controller;

import daotest.model.Carrito;
import daotest.repository.CarritoRepository;

import org.springframework.web.bind.annotation.*;

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
        return repository.save(carrito);
    }
}