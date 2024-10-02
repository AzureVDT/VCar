package vn.edu.iuh.sv.vcarbe.service.impl;

import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.DigitalSignature;
import vn.edu.iuh.sv.vcarbe.dto.VehicleHandoverDocumentDTO;
import vn.edu.iuh.sv.vcarbe.dto.VehicleHandoverRequest;
import vn.edu.iuh.sv.vcarbe.dto.VehicleReturnRequest;
import vn.edu.iuh.sv.vcarbe.entity.HandoverStatus;
import vn.edu.iuh.sv.vcarbe.entity.VehicleHandoverDocument;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
import vn.edu.iuh.sv.vcarbe.repository.RentalContractRepository;
import vn.edu.iuh.sv.vcarbe.repository.VehicleHandoverRepository;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.VehicleHandoverService;

import java.util.List;

@Service
public class VehicleHandoverServiceImpl implements VehicleHandoverService {
    @Autowired
    private VehicleHandoverRepository vehicleHandoverRepository;
    @Autowired
    private RentalContractRepository rentalContractRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public Mono<VehicleHandoverDocumentDTO> createVehicleHandover(UserPrincipal userPrincipal, VehicleHandoverRequest request) {
        return rentalContractRepository.findByLessorIdAndId(userPrincipal.getId(), request.getRentalContractId())
                .switchIfEmpty(Mono.error(new AppException(404, MessageKeys.CONTRACT_NOT_FOUND.name())))
                .flatMap(rentalContract -> {
                    VehicleHandoverDocument document = new VehicleHandoverDocument();
                    document.setLesseeId(rentalContract.getLesseeId());
                    document.setLessorId(rentalContract.getLessorId());
                    document.setRentalContractId(request.getRentalContractId());
                    document.setLessorName(rentalContract.getLessorName());
                    document.setLesseeName(rentalContract.getLesseeName());
                    document.setLocation(rentalContract.getVehicleHandOverLocation());
                    document.setCarBrand(rentalContract.getVehicleBrand());
                    document.setCarName(rentalContract.getVehicleName());
                    document.setCarColor(rentalContract.getVehicleColor());
                    document.setCarManufacturingYear(rentalContract.getVehicleManufacturingYear());
                    document.setCarLicensePlate(rentalContract.getVehicleLicensePlate());
                    document.setCarSeat(rentalContract.getVehicleSeat());
                    document.setHandoverDate(request.getHandoverDate());
                    document.setHandoverHour(request.getHandoverHour());
                    document.setInitialConditionNormal(request.isInitialConditionNormal());
                    document.setVehicleCondition(request.getVehicleCondition());
                    document.setDamages(request.getDamages());
                    document.setOdometerReading(request.getOdometerReading());
                    document.setFuelLevel(request.getFuelLevel());
                    document.setPersonalItems(request.getPersonalItems());
                    document.setCollateral(request.getCollateral());
                    document.setLessorSignature(request.getDigitalSignature().signatureUrl());
                    document.setStatus(HandoverStatus.CREATED);
                    return vehicleHandoverRepository.save(document)
                            .map(savedHandover -> modelMapper.map(savedHandover, VehicleHandoverDocumentDTO.class));
                });
    }

    @Override
    public Mono<VehicleHandoverDocumentDTO> approveByLessee(ObjectId id, UserPrincipal userPrincipal, DigitalSignature digitalSignature) {
        return vehicleHandoverRepository.findByIdAndLesseeId(id, userPrincipal.getId())
                .switchIfEmpty(Mono.error(new AppException(404, MessageKeys.VEHICLE_HANDOVER_NOT_FOUND.name())))
                .flatMap(document -> {
                    document.setLesseeApproved(true);
                    document.setLesseeSignature(digitalSignature.signatureUrl());
                    document.setStatus(HandoverStatus.RENDING);
                    return vehicleHandoverRepository.save(document)
                            .map(savedHandover -> modelMapper.map(savedHandover, VehicleHandoverDocumentDTO.class));
                });
    }

    @Override
    public Mono<VehicleHandoverDocumentDTO> approveByLessor(ObjectId id, UserPrincipal userPrincipal, DigitalSignature digitalSignature) {
        return vehicleHandoverRepository.findByIdAndLessorId(id, userPrincipal.getId())
                .switchIfEmpty(Mono.error(new AppException(404, MessageKeys.VEHICLE_HANDOVER_NOT_FOUND.name())))
                .flatMap(document -> {
                    document.setLessorApproved(true);
                    document.setReturnLessorSignature(digitalSignature.signatureUrl());
                    document.setStatus(HandoverStatus.RETURNED);
                    return vehicleHandoverRepository.save(document)
                            .map(savedHandover -> modelMapper.map(savedHandover, VehicleHandoverDocumentDTO.class));
                });
    }

    @Override
    public Mono<VehicleHandoverDocumentDTO> updateVehicleReturn(ObjectId id, VehicleReturnRequest request, UserPrincipal userPrincipal) {
        return vehicleHandoverRepository.findByIdAndLesseeId(id, userPrincipal.getId())
                .switchIfEmpty(Mono.error(new AppException(404, MessageKeys.VEHICLE_HANDOVER_NOT_FOUND.name())))
                .flatMap(document -> {
                    document.setReturnDate(request.getReturnDate());
                    document.setReturnHour(request.getReturnHour());
                    document.setConditionMatchesInitial(request.isConditionMatchesInitial());
                    document.setReturnVehicleCondition(request.getVehicleCondition());
                    document.setReturnDamages(request.getDamages());
                    document.setReturnOdometerReading(request.getOdometerReading());
                    document.setReturnFuelLevel(request.getFuelLevel());
                    document.setReturnPersonalItems(request.getPersonalItems());
                    document.setReturnLesseeSignature(request.getDigitalSignature().signatureUrl());
                    document.setStatus(HandoverStatus.RETURNING);
                    return vehicleHandoverRepository.save(document)
                            .map(savedHandover -> modelMapper.map(savedHandover, VehicleHandoverDocumentDTO.class));
                });
    }

    @Override
    public Mono<VehicleHandoverDocumentDTO> getVehicleHandoverByRentalContractId(ObjectId rentalContractId) {
        return vehicleHandoverRepository.findByRentalContractId(rentalContractId)
                .switchIfEmpty(Mono.error(new AppException(404, MessageKeys.VEHICLE_HANDOVER_NOT_FOUND.name())))
                .map(document -> modelMapper.map(document, VehicleHandoverDocumentDTO.class));
    }

    @Override
    public Mono<Page<VehicleHandoverDocumentDTO>> getVehicleHandoverForLessor(ObjectId id, String sortField, boolean sortDescending, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, sortDescending ? Sort.by(Sort.Order.desc(sortField)) : Sort.by(Sort.Order.asc(sortField)));

        return vehicleHandoverRepository.findByLessorId(id, pageable)
                .collectList()
                .flatMap(documents -> {
                    long total = documents.size(); // You might want to get the actual count from the database
                    List<VehicleHandoverDocumentDTO> dtos = documents.stream()
                            .map(document -> modelMapper.map(document, VehicleHandoverDocumentDTO.class))
                            .toList();
                    return Mono.just(new PageImpl<>(dtos, pageable, total));
                });
    }

    @Override
    public Mono<Page<VehicleHandoverDocumentDTO>> getVehicleHandoverForLessee(ObjectId id, String sortField, boolean sortDescending, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, sortDescending ? Sort.by(Sort.Order.desc(sortField)) : Sort.by(Sort.Order.asc(sortField)));

        return vehicleHandoverRepository.findByLesseeId(id, pageable)
                .collectList()
                .flatMap(documents -> {
                    long total = documents.size();
                    List<VehicleHandoverDocumentDTO> dtos = documents.stream()
                            .map(document -> modelMapper.map(document, VehicleHandoverDocumentDTO.class))
                            .toList();
                    return Mono.just(new PageImpl<>(dtos, pageable, total));
                });
    }
}
