package com.example.VisitorPass_final.repository;
import com.example.VisitorPass_final.entity.Resident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ResidentRepository extends JpaRepository<Resident, Long> {

	@Query("select count(distinct resident.flatNumber) from Resident resident")
	long countDistinctFlatNumbers();

}