package com.example.VisitorPass_final.controller;

import com.example.VisitorPass_final.entity.Resident;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/resident")
public class ResidentController {

    @PostMapping
    public String addResident(@Valid @RequestBody Resident resident) {
        return "Resident added successfully.";
    }

    @GetMapping
    public String getAllResidents() {
        return "List of all residents.";
    }

    @GetMapping("/{id}")
    public String getResidentById(@PathVariable Long id) {
        return "Resident ID: " + id;
    }

    @PutMapping("/{id}")
    public String updateResident(@PathVariable Long id, @Valid @RequestBody Resident resident) {
        return "Resident updated successfully.";
    }

    @DeleteMapping("/{id}")
    public String deleteResident(@PathVariable Long id) {
        return "Resident deleted successfully.";
    }
}