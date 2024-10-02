package vn.edu.iuh.sv.vcarbe.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.entity.Car;
import vn.edu.iuh.sv.vcarbe.repository.custom.CarRepositoryCustom;

@Repository
public interface CarRepository extends ReactiveMongoRepository<Car, ObjectId>, CarRepositoryCustom {
    Mono<Car> findByOwnerAndId(ObjectId owner, ObjectId id);
    Mono<Car> deleteByIdAndOwner(ObjectId id, ObjectId owner);
}
