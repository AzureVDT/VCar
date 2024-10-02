package vn.edu.iuh.sv.vcarbe.security;

import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtReactiveAuthenticationManager implements ReactiveAuthenticationManager {
    private final ReactiveUserDetailsService userDetailsService;
    private final TokenProvider tokenProvider;

    public JwtReactiveAuthenticationManager(ReactiveUserDetailsService userDetailsService, TokenProvider tokenProvider) {
        this.userDetailsService = userDetailsService;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public Mono<Authentication> authenticate(Authentication authentication) {
        String authToken = authentication.getCredentials().toString();
        if (!tokenProvider.validateToken(authToken)) {
            return Mono.empty();
        }

        String username = tokenProvider.getUsernameFromToken(authToken);
        return userDetailsService.findByUsername(username)
                .map(userDetails -> {
                    UserPrincipal userPrincipal = (UserPrincipal) userDetails;
                    List<SimpleGrantedAuthority> authorities = tokenProvider.getRolesFromToken(authToken)
                            .stream()
                            .map(SimpleGrantedAuthority::new)
                            .collect(Collectors.toList());

                    return new UsernamePasswordAuthenticationToken(userPrincipal, authToken, authorities);
                });
    }

}
