package com.example.VisitorPass_final.controller;

import com.example.VisitorPass_final.entity.OTPPass;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/otp")
public class OTPController {

    @PostMapping("/generate")
    public String generateOTP(@Valid @RequestBody OTPPass otpPass) {
        return "OTP generated successfully.";
    }

    @PostMapping("/validate")
    public String validateOTP(@Valid @RequestBody OTPPass otpPass) {
        return "OTP validated successfully.";
    }

    @GetMapping("/{id}")
    public String getOTPDetails(@PathVariable Long id) {
        return "OTP details for ID: " + id;
    }
}