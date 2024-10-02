package vn.edu.iuh.sv.vcarbe.dto;

import jakarta.validation.constraints.NotNull;
import org.bson.types.ObjectId;

import java.util.Date;

public record RentRequestDTO
        (
                @NotNull ObjectId carId,

                // Rental details
                @NotNull Date rentalStartDate,
                @NotNull Date rentalEndDate,
                @NotNull String vehicleHandOverLocation
        ) {
}
