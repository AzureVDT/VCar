package vn.edu.iuh.sv.vcarbe.service;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.DigitalSignature;
import vn.edu.iuh.sv.vcarbe.dto.VehicleHandoverDocumentDTO;
import vn.edu.iuh.sv.vcarbe.dto.VehicleHandoverRequest;
import vn.edu.iuh.sv.vcarbe.dto.VehicleReturnRequest;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;

public interface VehicleHandoverService {
    Mono<VehicleHandoverDocumentDTO> createVehicleHandover(UserPrincipal userPrincipal, VehicleHandoverRequest request);

    Mono<VehicleHandoverDocumentDTO> approveByLessee(ObjectId id, UserPrincipal userPrincipal, DigitalSignature digitalSignature);

    Mono<VehicleHandoverDocumentDTO> approveByLessor(ObjectId id, UserPrincipal userPrincipal, DigitalSignature digitalSignature);

    Mono<VehicleHandoverDocumentDTO> updateVehicleReturn(ObjectId id, VehicleReturnRequest request, UserPrincipal userPrincipal);

    Mono<VehicleHandoverDocumentDTO> getVehicleHandoverByRentalContractId(ObjectId rentalContractId);

    Mono<Page<VehicleHandoverDocumentDTO>> getVehicleHandoverForLessor(ObjectId id, String sortField, boolean sortDescending, int page, int size);

    Mono<Page<VehicleHandoverDocumentDTO>> getVehicleHandoverForLessee(ObjectId id, String sortField, boolean sortDescending, int page, int size);
}
