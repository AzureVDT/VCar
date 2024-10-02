package vn.edu.iuh.sv.vcarbe.dto;

import java.util.List;

public record CarDetailDTO(
        CarModel car,
        List<ReviewDTO> reviews,
        List<CarDTO> relatedCars
) {

}
