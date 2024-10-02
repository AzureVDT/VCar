package vn.edu.iuh.sv.vcarbe.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import vn.edu.iuh.sv.vcarbe.config.AppProperties;

import java.security.Key;
import java.util.*;

@Service
public class TokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(TokenProvider.class);
    private final AppProperties appProperties;
    private final Key key;

    public TokenProvider(AppProperties appProperties) {
        this.appProperties = appProperties;
        this.key = Keys.hmacShaKeyFor(appProperties.getAuth().getTokenSecret().getBytes());
    }

    public String generateToken(UserPrincipal userPrincipal, String tokenType, long expirationTime) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", userPrincipal.getUsername());
        claims.put("type", tokenType);
        claims.put("roles", userPrincipal.getAuthorities());

        if (tokenType.equals("ACCESS")) {
            claims.put("id", userPrincipal.getId());
        }

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userPrincipal.getId().toHexString())
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public String refreshToken(UserPrincipal userPrincipal) {
        return generateToken(userPrincipal, "REFRESH", appProperties.getAuth().getTokenExpirationMsec());
    }

    public String accessToken(UserPrincipal userPrincipal) {
        return generateToken(userPrincipal, "ACCESS", appProperties.getAuth().getTokenExpirationMsec());
    }

    public String createToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return generateToken(userPrincipal, "REFRESH", appProperties.getAuth().getTokenExpirationMsec());
    }

    public String getUserIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(appProperties.getAuth().getTokenSecret().getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(appProperties.getAuth().getTokenSecret().getBytes()).build().parseClaimsJws(authToken);
            return true;
        } catch (SignatureException ex) {
            logger.error("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            logger.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            logger.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty.");
        }
        return false;
    }

    public long getRefreshTokenExpiryMinutes() {
        return appProperties.getAuth().getTokenExpirationMsec() / 1000 / 60;
    }

    public String getUsernameFromToken(String authToken) {
        return getAllClaimsFromToken(authToken).get("email", String.class);
    }
    public Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(appProperties.getAuth().getTokenSecret().getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public List<String> getRolesFromToken(String token) {
        Map<String, Object> claims = getAllClaimsFromToken(token);
        List<?> roles = (List<?>) claims.get("roles");
        return roles.stream()
                .map(Object::toString)
                .toList();
    }

}
