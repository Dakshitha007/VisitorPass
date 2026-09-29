package com.example.VisitorPass_final.service;

import com.example.VisitorPass_final.entity.Resident;
import com.example.VisitorPass_final.repository.ResidentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResidentService {

    private final ResidentRepository residentRepository;

    public ResidentService(ResidentRepository residentRepository) {
        this.residentRepository = residentRepository;
    }

    public Resident save(Resident resident) {
        return residentRepository.save(resident);
    }

    public long count() {
        return residentRepository.count();
    }

    public long countDistinctFlats() {
        return residentRepository.countDistinctFlatNumbers();
    }

    public List<Resident> findAll() {
        return residentRepository.findAll();
    }

    public String addResident() {
        return "Resident added successfully.";
    }

    public String getAllResidents() {
        return "List of all residents.";
    }

    public String getResidentById(Long id) {
        return "Resident ID: " + id;
    }

    public String updateResident(Long id) {
        return "Resident updated successfully.";
    }

    public String deleteResident(Long id) {
        return "Resident deleted successfully.";
    }
}