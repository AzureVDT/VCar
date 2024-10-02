package vn.edu.iuh.sv.vcarbe.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import vn.edu.iuh.sv.vcarbe.dto.ApprovalRequest;
import vn.edu.iuh.sv.vcarbe.dto.SignRequest;

import java.util.Date;

@Document(collection = "rental_contracts")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class RentalContract extends RentalDetails {
    // Car lessor (Party A)
    private String lessorIdentityNumber;
    private Date lessorIssuedDate;
    private String lessorIssuedLocation;
    private String lessorPermanentAddress;
    private String lessorContactAddress;
    private String lessorPhoneNumber;
    private String lessorName;
    // For individual lessee
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
    // For organizational lessee
    private String organizationRegistrationNumber;
    private String organizationHeadquarters;
    private String legalRepresentativeName;
    private String legalRepresentativePosition;
    private String organizationPhoneNumber;

    // Car rental information
    private String vehicleLicensePlate;
    private String vehicleName;
    private String vehicleRegistrationNumber;
    private String vehicleColor;
    private String vehicleBrand;
    private int vehicleSeat;
    private int vehicleManufacturingYear;
    private String vehicleRegistrationDate;
    private String vehicleRegistrationLocation;
    private String vehicleOwnerName;

    // Car rental terms
    private String additionalTerms;
    private double rentalPricePerDay;
    private int mileageLimitPerDay;
    private double extraMileageCharge;
    private double extraHourlyCharge;
    private double totalRentalValue;
    private String lesseeSignature;
    private String lessorSignature;
    // Rental request
    private ObjectId rentalRequestId;
    // Rental status
    private RentalStatus rentalStatus;

    public RentalContract(RentalRequest rentalRequest, User lessorUser, Car car, ApprovalRequest approvalRequest) {
        super(rentalRequest.getCarId(), rentalRequest.getLesseeId(), rentalRequest.getLessorId(), rentalRequest.getRentalStartDate(), rentalRequest.getRentalEndDate(), rentalRequest.getVehicleHandOverLocation());

        this.lessorIdentityNumber = lessorUser.getCitizenIdentification().getCitizenIdentificationNumber();
        this.lessorPermanentAddress = lessorUser.getCitizenIdentification().getPermanentAddress();
        this.lessorContactAddress = lessorUser.getCitizenIdentification().getContactAddress();
        this.lessorIssuedDate = lessorUser.getCitizenIdentification().getIssuedDate();
        this.lessorIssuedLocation = lessorUser.getCitizenIdentification().getIssuedLocation();
        this.lessorPhoneNumber = lessorUser.getPhoneNumber();
        this.lessorName = lessorUser.getDisplayName();
        this.vehicleName = car.getName();
        this.vehicleLicensePlate = car.getLicensePlate();
        this.vehicleRegistrationNumber = car.getRegistrationNumber();
        this.vehicleColor = car.getColor();
        this.vehicleBrand = car.getBrand();
        this.vehicleSeat = car.getSeat();
        this.vehicleManufacturingYear = car.getManufacturingYear();
        this.vehicleRegistrationDate = car.getRegistrationDate();
        this.vehicleRegistrationLocation = car.getRegistrationLocation();
        this.vehicleOwnerName = lessorUser.getDisplayName();
        this.additionalTerms = approvalRequest.additionalTerms();
        this.rentalRequestId = rentalRequest.getId();
        this.rentalStatus = RentalStatus.PENDING;
        this.lessorSignature = approvalRequest.digitalSignature().signatureUrl();
        setPricingDetails(car);
        calculateTotalRentalValue();
    }

    private void setPricingDetails(Car car) {
        this.rentalPricePerDay = car.getDailyRate();
        this.mileageLimitPerDay = car.getMileageLimitPerDay();
        this.extraMileageCharge = car.getExtraMileageCharge();
        this.extraHourlyCharge = car.getExtraHourlyCharge();
    }

    private void calculateTotalRentalValue() {
        Date startDate = this.getRentalStartDate();
        Date endDate = this.getRentalEndDate();

        long durationInMillis = endDate.getTime() - startDate.getTime();

        long durationInHours = durationInMillis / (1000 * 60 * 60);

        long days = durationInHours / 24;
        long hours = durationInHours % 24;

        this.totalRentalValue = (days * this.rentalPricePerDay) + (hours * this.extraHourlyCharge);
    }

    public void sign(User lesseeUser, SignRequest signRequest) {
        this.lesseeIdentityNumber = lesseeUser.getCitizenIdentification().getCitizenIdentificationNumber();
        this.lesseeIdentityIssuedDate = lesseeUser.getCitizenIdentification().getIssuedDate();
        this.lesseeIdentityIssuedLocation = lesseeUser.getCitizenIdentification().getIssuedLocation();
        this.lesseePassportNumber = lesseeUser.getCitizenIdentification().getPassportNumber();
        this.lesseePassportIssuedDate = lesseeUser.getCitizenIdentification().getIssuedDate();
        this.lesseeLicenseNumber = lesseeUser.getCarLicense().getId();
        this.lesseeLicenseIssuedDate = lesseeUser.getCarLicense().getIssuedDate();
        this.lesseeLicenseIssuedLocation = lesseeUser.getCarLicense().getIssuedLocation();
        this.lesseePermanentAddress = lesseeUser.getCitizenIdentification().getPermanentAddress();
        this.lesseeContactAddress = lesseeUser.getCitizenIdentification().getContactAddress();
        this.lesseePhoneNumber = lesseeUser.getPhoneNumber();
        this.lesseeName = lesseeUser.getDisplayName();
        this.organizationRegistrationNumber = signRequest.organizationRegistrationNumber();
        this.organizationHeadquarters = signRequest.organizationHeadquarters();
        this.legalRepresentativeName = signRequest.legalRepresentativeName();
        this.legalRepresentativePosition = signRequest.legalRepresentativePosition();
        this.organizationPhoneNumber = signRequest.organizationPhoneNumber();
        this.lesseeSignature = signRequest.digitalSignature().signatureUrl();
        this.setUpdatedAt(new Date());
    }
}
