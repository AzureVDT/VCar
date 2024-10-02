package vn.edu.iuh.sv.vcarbe.service;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.ApprovalRequest;
import vn.edu.iuh.sv.vcarbe.dto.RentRequestDTO;
import vn.edu.iuh.sv.vcarbe.dto.RentalContractDTO;
import vn.edu.iuh.sv.vcarbe.dto.RentalRequestDTO;
import vn.edu.iuh.sv.vcarbe.entity.RentRequestStatus;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;

public interface RentalRequestService {
    Mono<RentalRequestDTO> createRentalRequest(RentRequestDTO rentRequestDTO, ObjectId lesseeId);

    Mono<RentalContractDTO> approveRentalContract(UserPrincipal userPrincipal, ApprovalRequest approvalRequest) throws Exception;

    Mono<RentalRequestDTO> rejectRentalContract(UserPrincipal userPrincipal, ApprovalRequest approvalRequest);

    Mono<Page<RentalRequestDTO>> getRentalRequestForLessor(ObjectId id, String sortField, boolean sortDescending, RentRequestStatus status, int page, int size);

    Mono<Page<RentalRequestDTO>> getRentalRequestForLessee(ObjectId id, String sortField, boolean sortDescending, RentRequestStatus status, int page, int size);

    Mono<RentalRequestDTO> getRentalRequest(ObjectId id);
}
