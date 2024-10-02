package vn.edu.iuh.sv.vcarbe.repository.custom;

import com.mongodb.client.AggregateIterable;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import vn.edu.iuh.sv.vcarbe.dto.CarReviewDTO;
import vn.edu.iuh.sv.vcarbe.dto.LesseeReviewDTO;
import vn.edu.iuh.sv.vcarbe.entity.ReviewType;

import java.util.ArrayList;
import java.util.List;

import static com.mongodb.client.model.Aggregates.lookup;
import static com.mongodb.client.model.Aggregates.match;
import static com.mongodb.client.model.Aggregates.project;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Projections.*;

@Repository
public class ReviewRepositoryCustomImpl implements ReviewRepositoryCustom {

    @Autowired
    private MongoClient mongoClient;

    private MongoCollection<Document> getReviewCollection() {
        MongoDatabase database = mongoClient.getDatabase("VCar");
        return database.getCollection("reviews");
    }

    @Override
    public List<CarReviewDTO> findCarReviewsWithUserDetailsByCarId(ObjectId carId) {
        MongoCollection<Document> collection = getReviewCollection();

        List<Bson> pipeline = new ArrayList<>();
        pipeline.add(match(eq("carId", carId)));
        pipeline.add(match(eq("reviewType", ReviewType.CAR_REVIEW.name()))); // Filter by reviewType
        pipeline.add(lookup("users", "lesseeId", "_id", "lesseeDetails"));
        pipeline.add(project(fields(
                computed("id", "$_id"),
                include("carId", "lesseeId", "rating", "comment"),
                computed("lesseeDetails", new Document("$arrayElemAt", List.of("$lesseeDetails", 0)))
        )));

        AggregateIterable<Document> results = collection.aggregate(pipeline);
        List<CarReviewDTO> reviewDTOs = new ArrayList<>();
        for (Document result : results) {
            CarReviewDTO reviewDTO = new CarReviewDTO();
            reviewDTO.setId(result.getObjectId("id").toHexString());
            reviewDTO.setCarId(result.getObjectId("carId").toHexString());
            reviewDTO.setLesseeId(result.getObjectId("lesseeId").toHexString());
            reviewDTO.setRating(result.getInteger("rating"));
            reviewDTO.setComment(result.getString("comment"));
            reviewDTO.setReviewType(ReviewType.CAR_REVIEW); // Set reviewType explicitly

            Document lesseeDetails = (Document) result.get("lesseeDetails");
            if (lesseeDetails != null) {
                reviewDTO.setLesseeDisplayName(lesseeDetails.getString("displayName"));
                reviewDTO.setLesseeEmail(lesseeDetails.getString("email"));
                reviewDTO.setLesseeImageUrl(lesseeDetails.getString("imageUrl"));
                reviewDTO.setLesseePhoneNumber(lesseeDetails.getString("phoneNumber"));
            }

            reviewDTOs.add(reviewDTO);
        }
        return reviewDTOs;
    }

    @Override
    public List<LesseeReviewDTO> findLesseeReviewsWithUserDetailsByLesseeId(ObjectId lesseeId) {
        MongoCollection<Document> collection = getReviewCollection();

        List<Bson> pipeline = new ArrayList<>();
        pipeline.add(match(eq("lesseeId", lesseeId)));
        pipeline.add(match(eq("reviewType", ReviewType.LESSEE_REVIEW.name()))); // Filter by reviewType
        pipeline.add(lookup("users", "lessorId", "_id", "lessorDetails"));
        pipeline.add(project(fields(
                computed("id", "$_id"),
                include("rentalContractId", "lessorId", "lesseeId", "rating", "comment"),
                computed("lessorDetails", new Document("$arrayElemAt", List.of("$lessorDetails", 0)))
        )));

        AggregateIterable<Document> results = collection.aggregate(pipeline);
        List<LesseeReviewDTO> reviewDTOs = new ArrayList<>();
        for (Document result : results) {
            LesseeReviewDTO reviewDTO = new LesseeReviewDTO();
            reviewDTO.setId(result.getObjectId("id").toHexString());
            reviewDTO.setRentalContractId(result.getObjectId("rentalContractId").toHexString());
            reviewDTO.setLessorId(result.getObjectId("lessorId").toHexString());
            reviewDTO.setLesseeId(result.getObjectId("lesseeId").toHexString());
            reviewDTO.setRating(result.getInteger("rating"));
            reviewDTO.setComment(result.getString("comment"));
            reviewDTO.setReviewType(ReviewType.LESSEE_REVIEW); // Set reviewType explicitly

            Document lessorDetails = (Document) result.get("lessorDetails");
            if (lessorDetails != null) {
                reviewDTO.setLessorDisplayName(lessorDetails.getString("displayName"));
                reviewDTO.setLessorEmail(lessorDetails.getString("email"));
                reviewDTO.setLessorImageUrl(lessorDetails.getString("imageUrl"));
                reviewDTO.setLessorPhoneNumber(lessorDetails.getString("phoneNumber"));
            }

            reviewDTOs.add(reviewDTO);
        }
        return reviewDTOs;
    }
}
