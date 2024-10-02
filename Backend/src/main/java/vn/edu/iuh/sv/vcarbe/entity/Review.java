package vn.edu.iuh.sv.vcarbe.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document(collection = "reviews")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Review {
    @MongoId
    private ObjectId id;
    private ObjectId rentalContractId;
    private ObjectId carId;
    private ObjectId lesseeId;
    private ObjectId lessorId;
    private int rating;
    private String comment;
    private ReviewType reviewType;
}
