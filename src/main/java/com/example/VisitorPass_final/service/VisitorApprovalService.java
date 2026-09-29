package com.example.VisitorPass_final.service;

import com.example.VisitorPass_final.repository.VisitorApprovalRepository;
import org.springframework.stereotype.Service;

@Service
public class VisitorApprovalService {

    private final VisitorApprovalRepository visitorApprovalRepository;

    public VisitorApprovalService(VisitorApprovalRepository visitorApprovalRepository) {
        this.visitorApprovalRepository = visitorApprovalRepository;
    }

    public long countByStatus(String status) {
        return visitorApprovalRepository.countByStatus(status);
    }

    public long countByStatusAndVisitDate(String status, String visitDate) {
        return visitorApprovalRepository.countByStatusAndVisitDate(status, visitDate);
    }

    public String createApproval() {
        return "Visitor approval created successfully.";
    }

    public String getAllApprovals() {
        return "List of all visitor approvals.";
    }

    public String getApprovalById(Long id) {
        return "Approval ID: " + id;
    }

    public String revokeApproval(Long id) {
        return "Visitor approval revoked.";
    }

    public String deleteApproval(Long id) {
        return "Visitor approval deleted.";
    }
}