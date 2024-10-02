package vn.edu.iuh.sv.vcarbe.repository.custom;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;
import vn.edu.iuh.sv.vcarbe.dto.UserDetailDTO;

import java.util.Arrays;
import java.util.List;

@Repository
public class UserRepositoryCustomImpl implements UserRepositoryCustom {

    private final ReactiveMongoTemplate reactiveMongoTemplate;

    @Autowired
    public UserRepositoryCustomImpl(ReactiveMongoTemplate reactiveMongoTemplate) {
        this.reactiveMongoTemplate = reactiveMongoTemplate;
    }

    @Override
    public Mono<UserDetailDTO> getUserDetailById(ObjectId id) {
        List<Document> aggregationPipeline = createAggregationPipeline(id);

        return reactiveMongoTemplate.getCollection("users")
                .flatMap(collection -> Mono.from(collection.aggregate(aggregationPipeline, Document.class)))
                .map(UserDetailDTO::new);

    }

    private List<Document> createAggregationPipeline(ObjectId userId) {
        return Arrays.asList(
                new Document("$match", new Document("_id", userId)),
                new Document("$lookup", new Document("from", "reviews")
                        .append("let", new Document("userId", "$_id"))
                        .append("pipeline", Arrays.asList(
                                new Document("$match", new Document("$expr", new Document("$and", Arrays.asList(
                                        new Document("$eq", Arrays.asList("$lessorId", "$$userId")),
                                        new Document("$eq", Arrays.asList("$reviewType", "CAR_REVIEW"))
                                )))),
                                new Document("$lookup", new Document("from", "users")
                                        .append("localField", "lesseeId")
                                        .append("foreignField", "_id")
                                        .append("as", "lesseeInfo")),
                                new Document("$unwind", "$lesseeInfo"),
                                new Document("$project", new Document("review", "$$ROOT")
                                        .append("lessee", "$lesseeInfo"))
                        ))
                        .append("as", "lesseeReviews")),
                new Document("$lookup", new Document("from", "reviews")
                        .append("let", new Document("userId", "$_id"))
                        .append("pipeline", Arrays.asList(
                                new Document("$match", new Document("$expr", new Document("$and", Arrays.asList(
                                        new Document("$eq", Arrays.asList("$lesseeId", "$$userId")),
                                        new Document("$eq", Arrays.asList("$reviewType", "LESSEE_REVIEW"))
                                )))),
                                new Document("$lookup", new Document("from", "users")
                                        .append("localField", "lessorId")
                                        .append("foreignField", "_id")
                                        .append("as", "lessorInfo")),
                                new Document("$unwind", "$lessorInfo"),
                                new Document("$project", new Document("review", "$$ROOT")
                                        .append("lessor", "$lessorInfo"))
                        ))
                        .append("as", "lessorReviews")),
                new Document("$project", new Document("id", "$_id")
                        .append("displayName", "$displayName")
                        .append("email", "$email")
                        .append("phoneNumber", "$phoneNumber")
                        .append("imageUrl", "$imageUrl")
                        .append("lesseeReviews", "$lesseeReviews.review")
                        .append("lessorReviews", "$lessorReviews.review"))
        );
    }
}
