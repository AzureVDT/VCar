package vn.edu.iuh.sv.vcarbe.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.entity.User;
import vn.edu.iuh.sv.vcarbe.repository.custom.UserRepositoryCustom;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends ReactiveMongoRepository<User, ObjectId>, UserRepositoryCustom {
    Mono<User> findByEmail(String email);

    Mono<Boolean> existsByEmail(String email);

    List<User> findByIdIn(List<ObjectId> userIds);
}
