package vn.edu.iuh.sv.vcarbe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.iuh.sv.vcarbe.entity.CarLicense;
import vn.edu.iuh.sv.vcarbe.entity.CitizenIdentification;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDTO {
    private String id;
    private String displayName;
    private String email;
    private String phoneNumber;
    private String imageUrl;
    private CitizenIdentification citizenIdentification;
    private CarLicense carLicense;
}
