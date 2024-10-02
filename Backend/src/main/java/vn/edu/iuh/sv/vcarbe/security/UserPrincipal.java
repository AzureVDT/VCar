package vn.edu.iuh.sv.vcarbe.security;

import org.bson.types.ObjectId;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import vn.edu.iuh.sv.vcarbe.entity.User;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class UserPrincipal implements OAuth2User, UserDetails {
    private ObjectId id;
    private String imageUrl;
    private String email;
    private String displayName;
    private String password;
    private String phoneNumber;
    private boolean isEmailVerify;
    private boolean isVerify;
    private Collection<? extends GrantedAuthority> authorities;
    private Map<String, Object> attributes;

    public UserPrincipal(ObjectId id, String imageUrl, String email, String displayName, String password, String phoneNumber, boolean isEmailVerify, boolean isVerify, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.email = email;
        this.displayName = displayName;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.isEmailVerify = isEmailVerify;
        this.isVerify = isVerify;
        this.authorities = authorities;
    }

    public static UserPrincipal create(User user) {
        List<GrantedAuthority> authorities = Collections.
                singletonList(new SimpleGrantedAuthority("ROLE_USER"));
        boolean isVerify = user.getEmailVerified() && user.getCarLicense() != null && user.getCitizenIdentification() != null && user.getPhoneNumber() != null;
        return new UserPrincipal(
                user.getId(),
                user.getImageUrl(),
                user.getEmail(),
                user.getDisplayName(),
                user.getPassword(),
                user.getPhoneNumber(),
                user.getEmailVerified(),
                isVerify,
                authorities
        );
    }

    public static UserPrincipal create(User user, Map<String, Object> attributes) {
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        userPrincipal.setAttributes(attributes);
        return userPrincipal;
    }

    public ObjectId getId() {
        return id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public boolean isVerify() {
        return isVerify;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isEmailVerify;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    public void setAttributes(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    @Override
    public String getName() {
        return String.valueOf(id);
    }
}
