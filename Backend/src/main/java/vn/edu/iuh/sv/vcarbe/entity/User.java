package vn.edu.iuh.sv.vcarbe.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @MongoId
    private ObjectId id;
    @Email
    private String email;
    private String imageUrl;
    private String displayName;
    private String phoneNumber;
    @NotNull
    private Boolean emailVerified = false;
    private String verificationCode;
    @JsonIgnore
    private String password;
    @NotNull
    private AuthProvider provider;
    private String providerId;
    private CarLicense carLicense;
    private CitizenIdentification citizenIdentification;
    private Set<String> deviceTokens = new HashSet<>();

    public User(ObjectId id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
