package com.example.VisitorPass_final.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "otp_pass")
public class OTPPass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long otpId;

    @NotBlank(message = "OTP is required")
    @Pattern(regexp = "^[0-9]{6}$", message = "OTP must be exactly 6 digits")
    private String otp;

    @NotBlank(message = "Generated time is required")
    private String generatedTime;

    @NotBlank(message = "Expiry time is required")
    private String expiryTime;

    private boolean used;

    public OTPPass() {
    }

    public OTPPass(Long otpId, String otp, String generatedTime, String expiryTime, boolean used) {
        this.otpId = otpId;
        this.otp = otp;
        this.generatedTime = generatedTime;
        this.expiryTime = expiryTime;
        this.used = used;
    }

    public Long getOtpId() {
        return otpId;
    }

    public void setOtpId(Long otpId) {
        this.otpId = otpId;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public String getGeneratedTime() {
        return generatedTime;
    }

    public void setGeneratedTime(String generatedTime) {
        this.generatedTime = generatedTime;
    }

    public String getExpiryTime() {
        return expiryTime;
    }

    public void setExpiryTime(String expiryTime) {
        this.expiryTime = expiryTime;
    }

    public boolean isUsed() {
        return used;
    }

    public void setUsed(boolean used) {
        this.used = used;
    }
}