package vn.edu.iuh.sv.vcarbe.service;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.RentalContractDTO;
import vn.edu.iuh.sv.vcarbe.dto.SignRequest;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;

public interface RentalContractService {
    Mono<RentalContractDTO> getRentalContract(ObjectId id) throws Exception;

    Mono<Page<RentalContractDTO>> getRentalContractForLessor(ObjectId id, String sortField, boolean sortDescending, int page, int size);

    Mono<Page<RentalContractDTO>> getRentalContractForLessee(ObjectId id, String sortField, boolean sortDescending, int page, int size);

    Mono<RentalContractDTO> signRentalContract(UserPrincipal userPrincipal, SignRequest signRequest) throws Exception;
}
