package com.example.VisitorPass_final.repository;

import com.example.VisitorPass_final.entity.OTPPass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OTPRepository extends JpaRepository<OTPPass, Long> {

}