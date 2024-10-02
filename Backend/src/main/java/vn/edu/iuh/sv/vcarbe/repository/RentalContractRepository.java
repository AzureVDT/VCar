package vn.edu.iuh.sv.vcarbe.repository;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.entity.RentalContract;

import java.util.Optional;

public interface RentalContractRepository extends ReactiveMongoRepository<RentalContract, ObjectId> {
    Flux<RentalContract> findByLessorId(ObjectId owner, Pageable pageable);
    Flux<RentalContract> findByLesseeId(ObjectId lessee, Pageable pageable);
    Mono<RentalContract> findByLesseeIdAndId(ObjectId lessee, ObjectId id);
    Mono<RentalContract> findByLessorIdAndId(ObjectId lessor, ObjectId id);
    Mono<Long> countByLessorId(ObjectId id);
    Mono<Long> countByLesseeId(ObjectId id);
}
