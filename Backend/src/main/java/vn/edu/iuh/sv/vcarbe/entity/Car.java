package vn.edu.iuh.sv.vcarbe.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "cars")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Car {
    @MongoId
    private ObjectId id;
    private ObjectId owner;
    private CarStatus status;
    private List<String> imageUrl;
    private Province province;
    private String location;

    // Car information
    private String name;
    private int seat;
    private String color;
    private String brand;
    private int manufacturingYear;
    private Transmission transmission;
    private Fuel fuel;
    private double fuelConsumption;
    private String description;
    private List<Feature> features = new ArrayList<>();

    // Registration information
    private String licensePlate;
    private String registrationNumber;
    private String registrationDate;
    private String registrationLocation;

    // Rental information
    private double dailyRate;
    private int mileageLimitPerDay;
    private double extraMileageCharge;
    private double extraHourlyCharge;
    private double washingPrice;
    private double deodorisePrice;
}