package com.example.VisitorPass_final.repository;

import com.example.VisitorPass_final.entity.Flat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlatRepository extends JpaRepository<Flat, Long> {

}