package vn.edu.iuh.sv.vcarbe.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.*;
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.Authservice;

@RestController
@RequestMapping("/auth")
@Tag(name = "Auth Controller", description = "APIs related to user authentication and management")
public class AuthController {
    @Autowired
    private Authservice authService;

    @Operation(summary = "Sign in user", description = "Authenticates a user and returns access and refresh tokens")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User authenticated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid email or password")
    })
    @PostMapping("/signin")
    public Mono<ResponseEntity<ApiResponseWrapper>> authenticateUser(
            @RequestBody @Valid LoginRequest loginRequest) {
        return authService.authenticateUser(loginRequest)
                .map(tokenResponse -> ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.USER_AUTHEN_SUCCESS.name(), tokenResponse)));
    }

    @Operation(summary = "Sign up user", description = "Registers a new user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User registered successfully"),
            @ApiResponse(responseCode = "400", description = "Email address already in use")
    })
    @PostMapping("/signup")
    public Mono<ResponseEntity<ApiResponseWrapper>> registerUser(
            @RequestBody @Valid SignUpRequest signUpRequest) {
        return authService.registerUser(signUpRequest)
                .map(user -> ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.USER_REGISTER_SUCCESS.name(), user)));
    }

    @Operation(summary = "Refresh token", description = "Refreshes the access token using the provided refresh token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token refreshed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid or expired refresh token")
    })
    @PostMapping("/refresh")
    public Mono<ResponseEntity<ApiResponseWrapper>> refreshToken(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            ServerHttpRequest req) {
        String refreshToken = req.getHeaders().get("authorization").get(0).substring(7);
        return authService.refreshToken(userPrincipal, refreshToken)
                .map(token -> ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.REFRESH_TOKEN_SUCCESS.name(), token)));
    }

    @Operation(summary = "Verify user", description = "Verifies a user's email address with a verification code")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User verified successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid verification code or user not found")
    })
    @PostMapping("/verify")
    public Mono<ResponseEntity<ApiResponseWrapper>> verifyUser(
            @RequestBody @Valid VerificationRequest verificationRequest) {
        return authService.verifyUser(verificationRequest)
                .map(signInResponse -> ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.USER_VERIFY_SUCCESS.name(), signInResponse)));
    }

    @Operation(summary = "Update phone number", description = "Updates the phone number for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Phone number updated successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PostMapping("/update-phone")
    public Mono<ResponseEntity<ApiResponseWrapper>> updatePhoneNumber(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody @Valid UpdatePhoneRequest updatePhoneRequest) {
        return authService.updatePhoneNumber(userPrincipal, updatePhoneRequest)
                .map(user -> ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.USER_PHONE_UPDATE_SUCCESS.name(), user)));
    }
}
