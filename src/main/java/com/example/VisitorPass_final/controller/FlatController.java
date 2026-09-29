package com.example.VisitorPass_final.controller;

import com.example.VisitorPass_final.entity.Flat;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/flat")
public class FlatController {

    @PostMapping
    public String addFlat(@Valid @RequestBody Flat flat) {
        return "Flat added successfully.";
    }

    @GetMapping
    public String getAllFlats() {
        return "List of all flats.";
    }

    @GetMapping("/{id}")
    public String getFlatById(@PathVariable Long id) {
        return "Flat ID: " + id;
    }

    @PutMapping("/{id}")
    public String updateFlat(@PathVariable Long id, @Valid @RequestBody Flat flat) {
        return "Flat updated successfully.";
    }

    @DeleteMapping("/{id}")
    public String deleteFlat(@PathVariable Long id) {
        return "Flat deleted successfully.";
    }
}