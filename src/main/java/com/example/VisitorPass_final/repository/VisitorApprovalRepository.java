package com.example.VisitorPass_final.repository;

import com.example.VisitorPass_final.entity.VisitorApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VisitorApprovalRepository extends JpaRepository<VisitorApproval, Long> {

	long countByStatus(String status);

	long countByStatusAndVisitDate(String status, String visitDate);

}