package vn.edu.iuh.sv.vcarbe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.iuh.sv.vcarbe.entity.ReviewType;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LesseeReviewDTO {
    private String id;
    private String rentalContractId;
    private String lessorId;
    private String lesseeId;
    private int rating;
    private String comment;
    private String lessorDisplayName;
    private String lessorEmail;
    private String lessorImageUrl;
    private String lessorPhoneNumber;
    private ReviewType reviewType;
}
