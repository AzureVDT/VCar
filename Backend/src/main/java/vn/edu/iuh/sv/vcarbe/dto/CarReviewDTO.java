package vn.edu.iuh.sv.vcarbe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.iuh.sv.vcarbe.entity.ReviewType;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CarReviewDTO {
    private String id;
    private String carId;
    private String lesseeId;
    private int rating;
    private String comment;
    private String lesseeDisplayName;
    private String lesseeEmail;
    private String lesseeImageUrl;
    private String lesseePhoneNumber;
    private ReviewType reviewType;
}
