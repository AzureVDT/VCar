package vn.edu.iuh.sv.vcarbe.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VerificationRequest {
    @NotBlank
    @Email
    private String email;
    @NotBlank
    private String verificationCode;

}
