package vn.edu.iuh.sv.vcarbe.service.impl;

import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.RentalContractDTO;
import vn.edu.iuh.sv.vcarbe.dto.SignRequest;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
import vn.edu.iuh.sv.vcarbe.repository.RentalContractRepository;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.RentalContractService;
import vn.edu.iuh.sv.vcarbe.util.BlockchainUtils;
import vn.edu.iuh.sv.vcarbe.util.NotificationUtils;

@Service
public class RentalContractServiceImpl implements RentalContractService {
    @Autowired
    private RentalContractRepository rentalContractRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private NotificationUtils notificationUtils;
    @Autowired
    private BlockchainUtils blockchainUtils;

    @Override
    public Mono<Page<RentalContractDTO>> getRentalContractForLessor(
            ObjectId id, String sortField, boolean sortDescending, int page, int size) {
        Sort sort = sortDescending ? Sort.by(Sort.Order.desc(sortField)) : Sort.by(Sort.Order.asc(sortField));
        Pageable pageable = PageRequest.of(page, size, sort);

        return rentalContractRepository.findByLessorId(id, pageable)
                .collectList()
                .flatMap(rentalContracts ->
                        rentalContractRepository.countByLessorId(id)
                                .map(total -> new PageImpl<>(
                                        rentalContracts.stream()
                                                .map(contract -> modelMapper.map(contract, RentalContractDTO.class))
                                                .toList(),
                                        pageable,
                                        total)
                                )
                );
    }


    @Override
    public Mono<Page<RentalContractDTO>> getRentalContractForLessee(
            ObjectId id, String sortField, boolean sortDescending, int page, int size) {
        Sort sort = sortDescending ? Sort.by(Sort.Order.desc(sortField)) : Sort.by(Sort.Order.asc(sortField));
        Pageable pageable = PageRequest.of(page, size, sort);

        return rentalContractRepository.findByLesseeId(id, pageable)
                .collectList()
                .flatMap(rentalContracts ->
                        rentalContractRepository.countByLesseeId(id)
                                .map(total -> new PageImpl<>(
                                        rentalContracts.stream()
                                                .map(contract -> modelMapper.map(contract, RentalContractDTO.class))
                                                .toList(),
                                        pageable,
                                        total)
                                )
                );
    }


    @Override
    public Mono<RentalContractDTO> getRentalContract(ObjectId id) throws Exception {
//        RentalContract rentalContract = rentalContractRepository.findById(id)
//                .orElseThrow(() -> new AppException(404, "Rental contract not found with id " + id));
//        Tuple9<String, String, String, String, String, BigInteger, BigInteger, BigInteger, Boolean> contractDetails = blockchainUtils.getRentalContractDetails(rentalContract.getId().toHexString());
//        return modelMapper.map(rentalContract, RentalContractDTO.class);
        return rentalContractRepository.findById(id)
                .switchIfEmpty(Mono.error(new AppException(404, MessageKeys.CONTRACT_NOT_FOUND.name())))
                .map(rentalContract -> modelMapper.map(rentalContract, RentalContractDTO.class));
    }

    @Override
    public Mono<RentalContractDTO> signRentalContract(UserPrincipal userPrincipal, SignRequest signRequest) {
//        return rentalContractRepository.findByLesseeIdAndId(userPrincipal.getId(), signRequest.contractId())
//                .switchIfEmpty(Mono.error(new AppException(404, "Rental contract not found with id " + signRequest.contractId())))
//                .flatMap(rentalContract -> {
//                    notificationUtils.createNotification(
//                            rentalContract.getLessorId(),
//                            "Lessee has signed the contract",
//                            NotificationType.RENTAL_CONTRACT,
//                            "/rental-contracts/" + rentalContract.getId(),
//                            rentalContract.getId());
//                    return blockchainUtils.approveRentalContract(rentalContract.getId().toHexString())
//                            .flatMap(transactionReceipt -> {
//                                RentalContractDTO contractDTO = modelMapper.map(rentalContract, RentalContractDTO.class);
//                                return Mono.just(contractDTO);
//                            });
//                });
        return null;
    }
}
