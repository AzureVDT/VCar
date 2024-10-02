package vn.edu.iuh.sv.vcarbe.repository;


import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;
import vn.edu.iuh.sv.vcarbe.entity.Review;
import vn.edu.iuh.sv.vcarbe.repository.custom.ReviewRepositoryCustom;

import java.util.List;

public interface ReviewRepository extends ReactiveMongoRepository<Review, ObjectId>, ReviewRepositoryCustom {
    Flux<Review> findByCarId(ObjectId carId);
}
