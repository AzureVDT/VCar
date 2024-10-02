package vn.edu.iuh.sv.vcarbe.repository;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.entity.VehicleHandoverDocument;

import java.util.Optional;

public interface VehicleHandoverRepository extends ReactiveMongoRepository<VehicleHandoverDocument, ObjectId> {
    Mono<VehicleHandoverDocument> findByRentalContractId(ObjectId rentalContractId);

    Mono<VehicleHandoverDocument> findByIdAndLesseeId(ObjectId rentalContractId, ObjectId lesseeId);

    Mono<VehicleHandoverDocument> findByIdAndLessorId(ObjectId rentalContractId, ObjectId lessorId);

    Flux<VehicleHandoverDocument> findByLessorId(ObjectId id, Pageable pageable);

    Flux<VehicleHandoverDocument> findByLesseeId(ObjectId id, Pageable pageable);
}
