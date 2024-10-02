package vn.edu.iuh.sv.vcarbe.security;

import org.bson.types.ObjectId;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.entity.User;
import vn.edu.iuh.sv.vcarbe.exception.ResourceNotFoundException;
import vn.edu.iuh.sv.vcarbe.repository.UserRepository;

import java.util.List;
import java.util.Map;

@Service
public class CustomReactiveUserDetailsService implements ReactiveUserDetailsService {

    private final UserRepository userRepository;

    public CustomReactiveUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Mono<UserDetails> findByUsername(String username) {
        return userRepository.findByEmail(username)
                .map(this::mapToUserDetails)
                .switchIfEmpty(Mono.error(new UsernameNotFoundException("User not found")));
    }

    private UserDetails mapToUserDetails(User user) {
        return UserPrincipal.create(user);

    }
}
