package com.example.VisitorPass_final.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "flat")
public class Flat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long flatId;


    @NotBlank(message = "Block is required")
    @Pattern(regexp = "^[A-Z]$", message = "Block must be a single capital letter")
    private String block;

    @NotNull(message = "Floor is required")
    @Min(value = 0, message = "Floor must be at least 0")
    @Max(value = 50, message = "Floor must not exceed 50")
    private Integer floor;

    @NotBlank(message = "Flat number is required")
    @Pattern(regexp = "^[A-Z][0-9]{3}$", message = "Flat number must match format A101")
    private String flatNumber;

    public Flat() {
    }

    public Flat(Long flatId, String block, Integer floor, String flatNumber) {
        this.flatId = flatId;
        this.block = block;
        this.floor = floor;
        this.flatNumber = flatNumber;
    }

    public Long getFlatId() {
        return flatId;
    }

    public void setFlatId(Long flatId) {
        this.flatId = flatId;
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

    public String getFlatNumber() {
        return flatNumber;
    }

    public void setFlatNumber(String flatNumber) {
        this.flatNumber = flatNumber;
    }
}