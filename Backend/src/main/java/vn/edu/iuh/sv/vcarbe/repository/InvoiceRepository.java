package vn.edu.iuh.sv.vcarbe.repository;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.entity.Invoice;

@Repository
public interface InvoiceRepository extends ReactiveMongoRepository<Invoice, ObjectId> {
    Mono<Invoice> findByTxnRef(String invoiceId);
    Flux<Invoice> findByLesseeId(ObjectId lesseeId, Pageable pageable);
    Mono<Invoice> findByIdAndLesseeId(ObjectId invoiceId, ObjectId lesseeId);
    Mono<Long> countByLesseeId(ObjectId id);
}
