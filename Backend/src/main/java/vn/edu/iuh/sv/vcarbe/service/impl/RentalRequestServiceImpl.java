package vn.edu.iuh.sv.vcarbe.service.impl;

import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.ApprovalRequest;
import vn.edu.iuh.sv.vcarbe.dto.RentRequestDTO;
import vn.edu.iuh.sv.vcarbe.dto.RentalContractDTO;
import vn.edu.iuh.sv.vcarbe.dto.RentalRequestDTO;
import vn.edu.iuh.sv.vcarbe.entity.*;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
import vn.edu.iuh.sv.vcarbe.repository.CarRepository;
import vn.edu.iuh.sv.vcarbe.repository.RentalContractRepository;
import vn.edu.iuh.sv.vcarbe.repository.RentalRequestRepository;
import vn.edu.iuh.sv.vcarbe.repository.UserRepository;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.RentalRequestService;
import vn.edu.iuh.sv.vcarbe.util.BlockchainUtils;
import vn.edu.iuh.sv.vcarbe.util.NotificationUtils;

import java.util.Date;

@Service
public class RentalRequestServiceImpl implements RentalRequestService {
    private final RentalContractRepository rentalContractRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final RentalRequestRepository rentalRequestRepository;
    private final ModelMapper modelMapper;
    private final NotificationUtils notificationUtils;
    private final BlockchainUtils blockchainUtils;

    @Autowired
    public RentalRequestServiceImpl(RentalContractRepository rentalContractRepository, CarRepository carRepository, UserRepository userRepository, RentalRequestRepository rentalRequestRepository, ModelMapper modelMapper, NotificationUtils notificationUtils, BlockchainUtils blockchainUtils) {
        this.rentalContractRepository = rentalContractRepository;
        this.carRepository = carRepository;
        this.userRepository = userRepository;
        this.rentalRequestRepository = rentalRequestRepository;
        this.modelMapper = modelMapper;
        this.notificationUtils = notificationUtils;
        this.blockchainUtils = blockchainUtils;
    }

    @Override
    public Mono<RentalRequestDTO> createRentalRequest(RentRequestDTO rentRequestDTO, ObjectId lesseeId) {
        return carRepository.findById(rentRequestDTO.carId())
                .switchIfEmpty(Mono.error(new AppException(404, MessageKeys.CAR_NOT_FOUND.name())))
                .flatMap(car -> {
                    RentalRequest request = new RentalRequest(rentRequestDTO, car, lesseeId);
                    return rentalRequestRepository.save(request);
                })
                .doOnNext(savedRequest -> notificationUtils.createNotification(
                        savedRequest.getLessorId(),
                        "New rental request",
                        NotificationType.RENTAL_REQUEST,
                        "/rental-requests/" + savedRequest.getId(),
                        savedRequest.getId()))
                .map(savedRequest -> modelMapper.map(savedRequest, RentalRequestDTO.class));
    }


    public Mono<RentalContractDTO> approveRentalContract(UserPrincipal userPrincipal, ApprovalRequest approvalRequest) {
        return rentalRequestRepository.findByIdAndLessorId(approvalRequest.requestId(), userPrincipal.getId())
                .switchIfEmpty(Mono.error(new AppException(404, MessageKeys.RENTAL_REQUEST_NOT_FOUND.name())))
                .flatMap(rentalRequest -> {
                    rentalRequest.setStatus(RentRequestStatus.APPROVED);
                    rentalRequest.setUpdatedAt(new Date());
                    return rentalRequestRepository.save(rentalRequest);
                })
                .flatMap(rentalRequest -> carRepository.findById(rentalRequest.getCarId())
                        .switchIfEmpty(Mono.error(new AppException(404, MessageKeys.CAR_NOT_FOUND.name())))
                        .flatMap(car -> userRepository.findById(rentalRequest.getLessorId())
                                .switchIfEmpty(Mono.error(new AppException(404, MessageKeys.USER_NOT_FOUND.name())))
                                .flatMap(lessorUser -> {
                                    RentalContract rentalContract = new RentalContract(rentalRequest, lessorUser, car, approvalRequest);
                                    return rentalContractRepository.save(rentalContract)
                                            .flatMap(savedContract -> {
                                                notificationUtils.createNotification(
                                                        savedContract.getLesseeId(),
                                                        "Rental contract signed",
                                                        NotificationType.RENTAL_CONTRACT,
                                                        "/rental-contracts/" + savedContract.getId(),
                                                        savedContract.getId());
                                                return blockchainUtils.createRentalContract(savedContract).thenReturn(savedContract);
                                            })
                                            .map(savedContract -> modelMapper.map(savedContract, RentalContractDTO.class));
                                })
                        )
                )
                .onErrorResume(e -> Mono.error(new AppException(500, e.getMessage())));
    }

    @Override
    public Mono<RentalRequestDTO> rejectRentalContract(UserPrincipal userPrincipal, ApprovalRequest approvalRequest) {
        return rentalRequestRepository.findByIdAndLessorId(approvalRequest.requestId(), userPrincipal.getId())
                .switchIfEmpty(Mono.error(new AppException(404, MessageKeys.RENTAL_REQUEST_NOT_FOUND.name())))
                .flatMap(rentalRequest -> {
                    rentalRequest.setStatus(RentRequestStatus.REJECTED);
                    return rentalRequestRepository.save(rentalRequest);
                })
                .doOnNext(rentalRequest -> notificationUtils.createNotification(
                        rentalRequest.getLesseeId(),
                        "Rental request rejected",
                        NotificationType.RENTAL_REQUEST,
                        "/rental-requests/" + rentalRequest.getId(),
                        rentalRequest.getId()))
                .map(rentalRequest -> modelMapper.map(rentalRequest, RentalRequestDTO.class));
    }

    @Override
    public Mono<Page<RentalRequestDTO>> getRentalRequestForLessor(
            ObjectId id, String sortField, boolean sortDescending, RentRequestStatus status, int page, int size) {

        Sort sort = sortDescending ? Sort.by(Sort.Order.desc(sortField)) : Sort.by(Sort.Order.asc(sortField));
        Pageable pageable = PageRequest.of(page, size, sort);

        Flux<RentalRequest> rentalRequests;
        Mono<Long> countMono;

        if (status != null) {
            rentalRequests = rentalRequestRepository.findByLessorIdAndStatus(id, status, pageable);
            countMono = rentalRequestRepository.countByLessorIdAndStatus(id, status);
        } else {
            rentalRequests = rentalRequestRepository.findByLessorId(id, pageable);
            countMono = rentalRequestRepository.countByLessorId(id);
        }

        return rentalRequests.collectList()
                .zipWith(countMono, (requests, total) -> new PageImpl<>(
                        requests.stream()
                                .map(request -> modelMapper.map(request, RentalRequestDTO.class))
                                .toList(),
                        pageable,
                        total
                ));
    }


    @Override
    public Mono<Page<RentalRequestDTO>> getRentalRequestForLessee(
            ObjectId id, String sortField, boolean sortDescending, RentRequestStatus status, int page, int size) {

        Sort sort = sortDescending ? Sort.by(Sort.Order.desc(sortField)) : Sort.by(Sort.Order.asc(sortField));
        Pageable pageable = PageRequest.of(page, size, sort);

        Flux<RentalRequest> rentalRequests;
        Mono<Long> countMono;

        if (status != null) {
            rentalRequests = rentalRequestRepository.findByLesseeIdAndStatus(id, status, pageable);
            countMono = rentalRequestRepository.countByLesseeIdAndStatus(id, status);
        } else {
            rentalRequests = rentalRequestRepository.findByLesseeId(id, pageable);
            countMono = rentalRequestRepository.countByLesseeId(id);
        }

        return rentalRequests.collectList()
                .zipWith(countMono, (requests, total) -> new PageImpl<>(
                        requests.stream()
                                .map(request -> modelMapper.map(request, RentalRequestDTO.class))
                                .toList(),
                        pageable,
                        total
                ));
    }


    @Override
    public Mono<RentalRequestDTO> getRentalRequest(ObjectId id) {
        return rentalRequestRepository.findById(id)
                .switchIfEmpty(Mono.error(new AppException(404, MessageKeys.RENTAL_REQUEST_NOT_FOUND.name())))
                .map(rentalRequest -> modelMapper.map(rentalRequest, RentalRequestDTO.class));
    }
}
