package vn.edu.iuh.sv.vcarbe.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;
import vn.edu.iuh.sv.vcarbe.entity.Notification;

import java.util.List;

public interface NotificationRepository extends ReactiveMongoRepository<Notification, ObjectId> {
    Flux<Notification> findByUserIdOrderByCreatedAtDesc(ObjectId userId);
}
