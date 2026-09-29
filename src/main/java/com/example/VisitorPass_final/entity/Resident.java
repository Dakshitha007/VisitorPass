package com.example.VisitorPass_final.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "resident")
public class Resident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long residentId;

    @NotBlank(message = "Resident name is required")
    @Size(min = 3, max = 50, message = "Resident name must be between 3 and 50 characters")
    @Pattern(regexp = "^[A-Za-z ]+$", message = "Resident name must contain only alphabets and spaces")
    private String name;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[6-9][0-9]{9}$", message = "Phone must be exactly 10 digits and start from 6-9")
    private String phone;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    @NotBlank(message = "Flat number is required")
    @Pattern(regexp = "^[A-Z][0-9]{3}$", message = "Flat number must match format A101")
    private String flatNumber;

    @NotBlank(message = "Block is required")
    @Pattern(regexp = "^[A-Z]$", message = "Block must be a single capital letter")
    private String block;

    @NotNull(message = "Floor is required")
    @Min(value = 0, message = "Floor must be at least 0")
    @Max(value = 50, message = "Floor must not exceed 50")
    private Integer floor;

    @NotBlank(message = "Emergency contact is required")
    @Pattern(regexp = "^[6-9][0-9]{9}$", message = "Emergency contact must be exactly 10 digits and start from 6-9")
    private String emergencyContact;

    // Constructors
    public Resident() {
    }

    public Resident(Long residentId, String name, String phone) {
        this.residentId = residentId;
        this.name = name;
        this.phone = phone;
    }

    public Resident(Long residentId, String name, String phone, String email, String flatNumber, String block) {
        this.residentId = residentId;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.flatNumber = flatNumber;
        this.block = block;
    }

    public Resident(Long residentId, String name, String phone, String email, String flatNumber, String block, Integer floor, String emergencyContact) {
        this.residentId = residentId;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.flatNumber = flatNumber;
        this.block = block;
        this.floor = floor;
        this.emergencyContact = emergencyContact;
    }

    // Getters and Setters
    public Long getResidentId() {
        return residentId;
    }

    public void setResidentId(Long residentId) {
        this.residentId = residentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFlatNumber() {
        return flatNumber;
    }

    public void setFlatNumber(String flatNumber) {
        this.flatNumber = flatNumber;
    }

    public String getBlock() {
        return block;
    }

    public void setBlock(String block) {
        this.block = block;
    }

    public Integer getFloor() {
        return floor;
    }

    public void setFloor(Integer floor) {
        this.floor = floor;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }
}