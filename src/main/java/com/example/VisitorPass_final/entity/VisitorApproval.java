package com.example.VisitorPass_final.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

@Entity
@Table(name = "visitor_approval")
public class VisitorApproval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long approvalId;

    @NotBlank(message = "Visitor name is required")
    @Size(min = 3, max = 50, message = "Visitor name must be between 3 and 50 characters")
    @Pattern(regexp = "^[A-Za-z ]+$", message = "Visitor name must contain only alphabets")
    private String visitorName;

    @NotBlank(message = "Visit date is required")
    private String visitDate;

    @NotBlank(message = "Purpose is required")
    @Size(min = 5, max = 200, message = "Purpose must be between 5 and 200 characters")
    private String purpose;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(Pending|Approved|Rejected)$", message = "Status must be Pending, Approved, or Rejected")
    private String status;

    public VisitorApproval() {
    }

    public VisitorApproval(Long approvalId, String visitorName, String visitDate, String purpose, String status) {
        this.approvalId = approvalId;
        this.visitorName = visitorName;
        this.visitDate = visitDate;
        this.purpose = purpose;
        this.status = status;
    }

    public Long getApprovalId() {
        return approvalId;
    }

    public void setApprovalId(Long approvalId) {
        this.approvalId = approvalId;
    }

    public String getVisitorName() {
        return visitorName;
    }

    public void setVisitorName(String visitorName) {
        this.visitorName = visitorName;
    }

    public String getVisitDate() {
        return visitDate;
    }

    public void setVisitDate(String visitDate) {
        this.visitDate = visitDate;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @AssertTrue(message = "Visit date must not be in the past")
    @Transient
    public boolean isVisitDateCurrentOrFuture() {
        if (visitDate == null || visitDate.isBlank()) {
            return true;
        }

        try {
            return !LocalDate.parse(visitDate).isBefore(LocalDate.now());
        } catch (java.time.format.DateTimeParseException exception) {
            return false;
        }
    }
}