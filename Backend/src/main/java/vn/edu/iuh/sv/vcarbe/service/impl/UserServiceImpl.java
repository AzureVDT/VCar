package vn.edu.iuh.sv.vcarbe.service.impl;

import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.*;
import vn.edu.iuh.sv.vcarbe.entity.CarLicense;
import vn.edu.iuh.sv.vcarbe.entity.CitizenIdentification;
import vn.edu.iuh.sv.vcarbe.entity.User;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
import vn.edu.iuh.sv.vcarbe.repository.UserRepository;
import vn.edu.iuh.sv.vcarbe.service.UserService;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;

    private Mono<User> getUserByIdFromRepository(ObjectId userId) {
        return userRepository.findById(userId)
                .switchIfEmpty(Mono.error(new AppException(404, MessageKeys.USER_NOT_FOUND.name())));
    }

    @Override
    public Mono<UserProfileDTO> getUserById(ObjectId id) {
        return getUserByIdFromRepository(id)
                .map(user -> modelMapper.map(user, UserProfileDTO.class));
    }

    @Override
    public Mono<UserDTO> updateUser(ObjectId userId, UpdateUserDTO updateUserDTO) {
        return getUserByIdFromRepository(userId)
                .flatMap(user -> {
                    user.setDisplayName(updateUserDTO.displayName());
                    user.setPhoneNumber(updateUserDTO.phoneNumber());
                    return userRepository.save(user);
                })
                .map(savedUser -> modelMapper.map(savedUser, UserDTO.class));
    }

    @Override
    public Mono<UserDTO> updateCarLicense(ObjectId userId, UpdateCarLicenseDTO updateCarLicenseDTO) {
        return getUserByIdFromRepository(userId)
                .flatMap(user -> {
                    CarLicense license = new CarLicense(updateCarLicenseDTO.id(), updateCarLicenseDTO.fullName(), updateCarLicenseDTO.dob(), updateCarLicenseDTO.licenseImageUrl(), updateCarLicenseDTO.issuedDate(), updateCarLicenseDTO.issuedLocation());
                    user.setCarLicense(license);
                    return userRepository.save(user);
                })
                .map(savedUser -> modelMapper.map(savedUser, UserDTO.class));
    }

    @Override
    public Mono<UserDTO> updateCitizenIdentification(ObjectId userId, UpdateCitizenIdentificationDTO updateCitizenIdentificationDTO) {
        return getUserByIdFromRepository(userId)
                .flatMap(user -> {
                    CitizenIdentification citizenIdentification = new CitizenIdentification(
                            updateCitizenIdentificationDTO.identificationNumber(),
                            updateCitizenIdentificationDTO.passportNumber(),
                            updateCitizenIdentificationDTO.issuedDate(),
                            updateCitizenIdentificationDTO.issuedLocation(),
                            updateCitizenIdentificationDTO.permanentAddress(),
                            updateCitizenIdentificationDTO.contactAddress(),
                            updateCitizenIdentificationDTO.identificationImageUrl()
                    );
                    user.setCitizenIdentification(citizenIdentification);
                    return userRepository.save(user);
                })
                .map(savedUser -> modelMapper.map(savedUser, UserDTO.class));
    }

    @Override
    public Mono<UserDetailDTO> getUserDetailById(ObjectId id) {
        return userRepository.getUserDetailById(id)
                .map(userDetail -> modelMapper.map(userDetail, UserDetailDTO.class));
    }
}
