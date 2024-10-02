package vn.edu.iuh.sv.vcarbe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.iuh.sv.vcarbe.entity.RentRequestStatus;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RentalRequestDTO {
    private String id;
    private String carId;
    private String lesseeId;
    private String lessorId;
    private RentRequestStatus status;
    private Date createdAt;
    private Date updatedAt;

    private Date rentalStartDate;
    private Date rentalEndDate;
    private String vehicleHandOverLocation;

    // For individual lessee
    private String lesseeIdentityNumber;
    private String lesseePassportNumber;
    private String lesseeLicenseNumber;
    private String lesseePermanentAddress;
    private String lesseeContactAddress;
    private String lesseePhoneNumber;

    // For organizational lessee
    private String organizationRegistrationNumber;
    private String organizationHeadquarters;
    private String legalRepresentativeName;
    private String legalRepresentativePosition;
    private String organizationPhoneNumber;
}
