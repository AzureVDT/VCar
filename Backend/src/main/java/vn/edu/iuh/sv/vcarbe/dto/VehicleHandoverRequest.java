package vn.edu.iuh.sv.vcarbe.dto;

import lombok.Data;
import org.bson.types.ObjectId;
import vn.edu.iuh.sv.vcarbe.entity.Collateral;

import java.util.Date;
import java.util.List;

@Data
public class VehicleHandoverRequest {
    private ObjectId rentalContractId;
    private Date handoverDate;
    private int handoverHour;
    private boolean initialConditionNormal;
    private String vehicleCondition;
    private List<String> damages;
    private int odometerReading;
    private int fuelLevel;
    private String personalItems;
    private List<Collateral> collateral;
    private DigitalSignature digitalSignature;
}