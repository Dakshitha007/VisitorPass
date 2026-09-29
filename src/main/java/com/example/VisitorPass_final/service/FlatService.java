package com.example.VisitorPass_final.service;

import org.springframework.stereotype.Service;

@Service
public class FlatService {

    public String addFlat() {
        return "Flat added successfully.";
    }

    public String getAllFlats() {
        return "List of all flats.";
    }

    public String getFlatById(Long id) {
        return "Flat ID: " + id;
    }

    public String updateFlat(Long id) {
        return "Flat updated successfully.";
    }

    public String deleteFlat(Long id) {
        return "Flat deleted successfully.";
    }
}