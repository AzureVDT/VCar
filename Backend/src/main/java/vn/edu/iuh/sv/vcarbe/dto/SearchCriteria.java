package vn.edu.iuh.sv.vcarbe.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.iuh.sv.vcarbe.entity.Province;
import vn.edu.iuh.sv.vcarbe.entity.Transmission;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SearchCriteria {
    @Schema(description = "Search query string", example = "Toyota")
    private String query;
    @Schema(description = "Province where the car is located", example = "Ho_Chi_Minh")
    @NotNull
    private Province province;
    @Schema(description = "Transmission types", example = "[\"MANUAL\"]")
    private Transmission[] transmission;
    @Schema(description = "Number of seats", example = "[4]")
    private Integer[] seats;
    @Schema(description = "Minimum fuel consumption", example = "0")
    @Min(0)
    private Integer minConsumption;
    @Schema(description = "Maximum fuel consumption", example = "20")
    @Min(0)
    private Integer maxConsumption;
    @Schema(description = "Maximum rate per day", example = "1000000")
    @Min(0)
    private Integer maxRate;
    @Schema(description = "Page number for pagination", example = "0")
    @Min(0)
    private int page = 0;
    @Schema(description = "Number of results per page", example = "10")
    @Min(1)
    private int size = 10;
    @Schema(description = "Rental start date in milliseconds", example = "1729828230000")
    private Long rentalStartDate;
    @Schema(description = "Rental end date in milliseconds", example = "1732506630000")
    private Long rentalEndDate;
    @Schema(description = "Rating of the car", example = "5")
    private Integer rating;
}
