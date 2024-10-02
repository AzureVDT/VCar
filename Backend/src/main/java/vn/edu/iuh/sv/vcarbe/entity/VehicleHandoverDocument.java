package vn.edu.iuh.sv.vcarbe.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.Date;
import java.util.List;

@Document(collection = "vehicle_handover")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class VehicleHandoverDocument {
    @MongoId
    private ObjectId id;
    private ObjectId vehicleId;
    private ObjectId lesseeId;
    private ObjectId lessorId;
    private String lessorName;
    private String lesseeName;
    private String location;
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
    private String carName;
    private String carColor;
    private int carManufacturingYear;
    private String carLicensePlate;
    private int carSeat;
    private HandoverStatus status;
}
