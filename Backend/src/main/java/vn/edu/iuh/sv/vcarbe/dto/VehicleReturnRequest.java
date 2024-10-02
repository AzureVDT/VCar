package vn.edu.iuh.sv.vcarbe.dto;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class VehicleReturnRequest {
    private Date returnDate;
    private int returnHour;
    private boolean conditionMatchesInitial;
    private String vehicleCondition;
    private List<String> damages;
    private int odometerReading;
    private int fuelLevel;
    private String personalItems;
    private List<String> returnedItems;
    private DigitalSignature digitalSignature;
}