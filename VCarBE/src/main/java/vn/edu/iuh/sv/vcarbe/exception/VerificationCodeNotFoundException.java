package vn.edu.iuh.sv.vcarbe.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class VerificationCodeNotFoundException extends RuntimeException {
    private int code;
    private String message;
}