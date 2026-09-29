package com.example.VisitorPass_final.controller;

import com.example.VisitorPass_final.entity.VisitorApproval;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/approval")
public class VisitorApprovalController {

    @PostMapping
    public String createApproval(@Valid @RequestBody VisitorApproval approval) {
        return "Visitor approval created successfully.";
    }

    @GetMapping
    public String getAllApprovals() {
        return "List of all visitor approvals.";
    }

    @GetMapping("/{id}")
    public String getApprovalById(@PathVariable Long id) {
        return "Approval ID: " + id;
    }

    @PutMapping("/revoke/{id}")
    public String revokeApproval(@PathVariable Long id, @Valid @RequestBody VisitorApproval approval) {
        return "Visitor approval revoked.";
    }

    @DeleteMapping("/{id}")
    public String deleteApproval(@PathVariable Long id) {
        return "Visitor approval deleted.";
    }
}