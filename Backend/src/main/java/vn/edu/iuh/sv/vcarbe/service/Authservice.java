package vn.edu.iuh.sv.vcarbe.service;

import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.TokenResponse;
import vn.edu.iuh.sv.vcarbe.dto.*;
import vn.edu.iuh.sv.vcarbe.entity.User;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;

public interface Authservice {
    Mono<SignInResponse> authenticateUser(LoginRequest loginRequest);

    Mono<User> registerUser(SignUpRequest signUpRequest);

    Mono<TokenResponse> refreshToken(UserPrincipal userPrincipal, String oldRefreshToken);

    Mono<SignInResponse> verifyUser(VerificationRequest verificationRequest);

    Mono<User> updatePhoneNumber(UserPrincipal userPrincipal, UpdatePhoneRequest updatePhoneRequest);
}
