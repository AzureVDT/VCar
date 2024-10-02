package vn.edu.iuh.sv.vcarbe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.Document;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDetailDTO {
    private String id;
    private String displayName;
    private String email;
    private String phoneNumber;
    private String imageUrl;
    private List<ReviewDTO> lessorReviews;
    private List<ReviewDTO> lesseeReviews;

    public UserDetailDTO(Document userDetailDoc) {
        this.id = userDetailDoc.getObjectId("_id").toString();
        this.displayName = userDetailDoc.getString("displayName");
        this.email = userDetailDoc.getString("email");
        this.phoneNumber = userDetailDoc.getString("phoneNumber");
        this.imageUrl = userDetailDoc.getString("imageUrl");

        List<Document> lesseeReviewsDocs = (List<Document>) userDetailDoc.get("lesseeReviews");
        List<Document> lessorReviewsDocs = (List<Document>) userDetailDoc.get("lessorReviews");

        this.setLesseeReviews(lesseeReviewsDocs.stream()
                .map(doc -> ReviewDTO.fromDocument(doc, true))
                .toList());
        this.setLessorReviews(lessorReviewsDocs.stream()
                .map(doc -> ReviewDTO.fromDocument(doc, false))
                .toList());
    }
}
