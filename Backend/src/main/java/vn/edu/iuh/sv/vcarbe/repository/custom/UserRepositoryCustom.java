package vn.edu.iuh.sv.vcarbe.repository.custom;

import org.bson.types.ObjectId;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.UserDetailDTO;

public interface UserRepositoryCustom {
    public Mono<UserDetailDTO> getUserDetailById(ObjectId id);
}
