package vn.edu.iuh.sv.vcarbe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.iuh.sv.vcarbe.entity.Collateral;
import vn.edu.iuh.sv.vcarbe.entity.HandoverStatus;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class VehicleHandoverDocumentDTO {
    private String id;
    private String vehicleId;
    private String lesseeId;
    private String lessorId;
    private String lessorName;
    private String lesseeName;
    private String location;
    private String rentalContractId;
    private Date handoverDate;
    private int handoverHour;
    private boolean initialConditionNormal;
    private String vehicleCondition;
    private List<String> damages;
    private int odometerReading;
    private int fuelLevel;
    private String personalItems;
    private List<Collateral> collateral;
    private Date returnDate;
    private int returnHour;
    private boolean conditionMatchesInitial;
    private String returnVehicleCondition;
    private List<String> returnDamages;
    private int returnOdometerReading;
    private int returnFuelLevel;
    private String returnPersonalItems;
    private List<String> returnedItems;
    private boolean lesseeApproved;
    private boolean lessorApproved;
    private String lesseeSignature;
    private String lessorSignature;
    private String returnLesseeSignature;
    private String returnLessorSignature;
    //Car info
    private String carBrand;
    private String carType;
    private String carColor;
    private int carManufacturingYear;
    private String carLicensePlate;
    private int carSeat;
    private HandoverStatus status;
}
