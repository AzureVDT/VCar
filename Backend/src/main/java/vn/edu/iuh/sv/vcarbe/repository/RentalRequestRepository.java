package vn.edu.iuh.sv.vcarbe.repository;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.entity.RentRequestStatus;
import vn.edu.iuh.sv.vcarbe.entity.RentalRequest;

import java.util.Optional;

public interface RentalRequestRepository extends ReactiveMongoRepository<RentalRequest, ObjectId> {
    Mono<RentalRequest> findByIdAndLessorId(ObjectId lesseeId, ObjectId lessorId);

    Flux<RentalRequest> findByLessorIdAndStatus(ObjectId lessorId, RentRequestStatus status, Pageable pageable);

    Flux<RentalRequest> findByLessorId(ObjectId id, Pageable pageable);

    Flux<RentalRequest> findByLesseeIdAndStatus(ObjectId id, RentRequestStatus status, Pageable pageable);

    Flux<RentalRequest> findByLesseeId(ObjectId id, Pageable pageable);

    Mono<Long> countByLessorIdAndStatus(ObjectId id, RentRequestStatus status);

    Mono<Long> countByLesseeIdAndStatus(ObjectId id, RentRequestStatus status);

    Mono<Long> countByLessorId(ObjectId id);

    Mono<Long> countByLesseeId(ObjectId id);
}
