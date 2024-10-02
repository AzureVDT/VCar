package vn.edu.iuh.sv.vcarbe.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.MongoId;
import vn.edu.iuh.sv.vcarbe.dto.RentRequestDTO;

import java.util.Date;
import java.util.Objects;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RentalDetails {
    @MongoId
    private ObjectId id;
    private ObjectId carId;
    private ObjectId lesseeId;
    private ObjectId lessorId;
    private Date createdAt;
    private Date updatedAt;

    private Date rentalStartDate;
    private Date rentalEndDate;
    private String vehicleHandOverLocation;

    public RentalDetails(ObjectId carId, ObjectId lesseeId, ObjectId lessorId, Date rentalStartDate, Date rentalEndDate, String vehicleHandOverLocation) {
        this.carId = carId;
        this.lesseeId = lesseeId;
        this.lessorId = lessorId;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.rentalStartDate = rentalStartDate;
        this.rentalEndDate = rentalEndDate;
        this.vehicleHandOverLocation = vehicleHandOverLocation;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RentalDetails that = (RentalDetails) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
