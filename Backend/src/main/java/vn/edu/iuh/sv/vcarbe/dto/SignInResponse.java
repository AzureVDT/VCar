package vn.edu.iuh.sv.vcarbe.dto;

public record SignInResponse(
        String id,
        String displayName,
        String email,
        String imageUrl,
        String phoneNumber,
        String accessToken,
        String refreshToken
) {
}
