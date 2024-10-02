package vn.edu.iuh.sv.vcarbe.service;

import org.bson.types.ObjectId;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.*;

public interface UserService {
    Mono<UserDTO> updateUser(ObjectId userId, UpdateUserDTO updateUserDTO);

    Mono<UserDTO> updateCarLicense(ObjectId userId, UpdateCarLicenseDTO updateCarLicenseDTO);

    Mono<UserProfileDTO> getUserById(ObjectId id);

    Mono<UserDTO> updateCitizenIdentification(ObjectId userId, UpdateCitizenIdentificationDTO updateCitizenIdentificationDTO);

    Mono<UserDetailDTO> getUserDetailById(ObjectId id);
}
