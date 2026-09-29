package com.example.VisitorPass_final.service;

import com.example.VisitorPass_final.repository.OTPRepository;
import org.springframework.stereotype.Service;

@Service
public class OTPService {

    private final OTPRepository otpRepository;

    public OTPService(OTPRepository otpRepository) {
        this.otpRepository = otpRepository;
    }

    public long count() {
        return otpRepository.count();
    }

    public String generateOTP() {
        return "OTP generated successfully.";
    }

    public String validateOTP() {
        return "OTP validated successfully.";
    }

    public String getOTPDetails(Long id) {
        return "OTP details for ID: " + id;
    }
}