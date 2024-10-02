package vn.edu.iuh.sv.vcarbe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.iuh.sv.vcarbe.entity.RentalStatus;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RentalContractDTO {
    private String id;
    private String lessorId;
    private String lesseeId;
    private Date createdAt;

    // Car lessee (Party A)
    private String lessorIdentityNumber;
    private Date lessorIssuedDate;
    private String lessorIssuedLocation;
    private String lessorPermanentAddress;
    private String lessorContactAddress;
    private String lessorPhoneNumber;
    private String lessorName;
    // Car lessee (Party B)
    private String lesseeIdentityNumber;
    private Date lesseeIdentityIssuedDate;
    private String lesseePassportNumber;
    private Date lesseePassportIssuedDate;
    private String lesseeIdentityIssuedLocation;
    private String lesseeLicenseNumber;
    private Date lesseeLicenseIssuedDate;
    private String lesseeLicenseIssuedLocation;
    private String lesseePermanentAddress;
    private String lesseeContactAddress;
    private String lesseePhoneNumber;
    private String lesseeName;
    // For organizations
    private String organizationRegistrationNumber;
    private String organizationHeadquarters;
    private String legalRepresentativeName;
    private String legalRepresentativePosition;
    private String organizationPhoneNumber;

    // Car rental information
    private String carId;
    private String vehicleLicensePlate;
    private String vehicleBrand;
    private int vehicleSeat;
    private int vehicleManufacturingYear;
    private String vehicleColor;
    private String vehicleRegistrationNumber;
    private String vehicleRegistrationDate;
    private String vehicleRegistrationLocation;
    private String vehicleOwnerName;

    // Car rental terms
    private String additionalTerms;
    private double rentalPricePerDay;
    private int mileageLimitPerDay;
    private double extraMileageCharge;
    private Date rentalStartDate;
    private Date rentalEndDate;
    private double extraHourlyCharge;
    private double totalRentalValue;
    private String vehicleHandOverLocation;
    private Boolean isApproved;
    private Date actionTime;
    private String rentalRequestId;
    private RentalStatus rentalStatus;
    private String lesseeSignature;
    private String lessorSignature;
}