package vn.edu.iuh.sv.vcarbe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.Document;
import vn.edu.iuh.sv.vcarbe.entity.Review;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDTO {
    private String id;
    private String comment;
    private int rating;
    private UserDTO lessee;
    private UserDTO lessor;

    public ReviewDTO(Document document) {
        this.id = document.getObjectId("_id").toString();
        this.comment = document.getString("comment");
        this.rating = document.getInteger("rating");
        this.lessee = new UserDTO(document.getObjectId("lesseeId").toHexString());
    }

    public static ReviewDTO fromDocument(Document document, boolean isLessee) {
        ReviewDTO reviewDTO = new ReviewDTO();
        reviewDTO.setId(document.getObjectId("_id").toString());
        reviewDTO.setComment(document.getString("comment"));
        reviewDTO.setRating(document.getInteger("rating"));
        if (isLessee) {
            reviewDTO.setLessee(new UserDTO((Document) document.get("lesseeInfo")));
        } else {
                reviewDTO.setLessor(new UserDTO((Document) document.get("lessorInfo")));
        }
        return reviewDTO;
    }

    public static ReviewDTO fromReview(Review review, UserDTO lessee, UserDTO lessor) {
        ReviewDTO reviewDTO = new ReviewDTO();
        reviewDTO.setId(review.getId().toString());
        reviewDTO.setComment(review.getComment());
        reviewDTO.setRating(review.getRating());
        reviewDTO.setLessee(lessee);
        reviewDTO.setLessor(lessor);
        return reviewDTO;
    }
}
