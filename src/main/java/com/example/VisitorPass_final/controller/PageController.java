package com.example.VisitorPass_final.controller;

import com.example.VisitorPass_final.entity.Resident;
import com.example.VisitorPass_final.service.OTPService;
import com.example.VisitorPass_final.service.ResidentService;
import com.example.VisitorPass_final.service.VisitorApprovalService;
import jakarta.validation.Valid;
import org.springframework.ui.Model;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class PageController {

    private final ResidentService residentService;
    private final VisitorApprovalService visitorApprovalService;
    private final OTPService otpService;

    public PageController(ResidentService residentService, VisitorApprovalService visitorApprovalService, OTPService otpService) {
        this.residentService = residentService;
        this.visitorApprovalService = visitorApprovalService;
        this.otpService = otpService;
    }

    @GetMapping("/")
    public String dashboard(Model model) {
        model.addAttribute("residentCount", residentService.count());
        model.addAttribute("flatCount", residentService.countDistinctFlats());
        model.addAttribute("activeVisitorPassCount", visitorApprovalService.countByStatus("Approved"));
        model.addAttribute("pendingApprovalCount", visitorApprovalService.countByStatus("Pending"));
        return "index";
    }

    @GetMapping("/resident-page")
    public String residentPage(Model model) {
        model.addAttribute("residentCount", residentService.count());
        return "resident";
    }

    @PostMapping("/resident-page")
    public String registerResident(
            @Valid @ModelAttribute Resident resident,
            BindingResult bindingResult,
            Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("residentCount", residentService.count());
            return "resident";
        }

        residentService.save(resident);
        return "redirect:/resident-page";
    }

    @GetMapping("/approval-page")
    public String approvalPage(Model model) {
        model.addAttribute("residents", residentService.findAll());
        model.addAttribute("pendingApprovalCount", visitorApprovalService.countByStatus("Pending"));
        model.addAttribute("approvedTodayCount", visitorApprovalService.countByStatusAndVisitDate("Approved", java.time.LocalDate.now().toString()));
        model.addAttribute("rejectedCount", visitorApprovalService.countByStatus("Rejected"));
        model.addAttribute("otpGeneratedCount", otpService.count());
        model.addAttribute("visitorsInsideCount", visitorApprovalService.countByStatus("Approved"));
        return "approval";
    }
}