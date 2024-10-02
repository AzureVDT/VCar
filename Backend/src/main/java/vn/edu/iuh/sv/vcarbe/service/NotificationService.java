package vn.edu.iuh.sv.vcarbe.service;

import org.bson.types.ObjectId;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.NotificationDTO;
import vn.edu.iuh.sv.vcarbe.entity.User;

import java.util.Optional;

public interface NotificationService {
    Flux<NotificationDTO> getNotificationsForUser(ObjectId userId);
    Mono<NotificationDTO> markAsRead(ObjectId notificationId);
    Mono<User> addDeviceToken(ObjectId id, String deviceToken);

    Mono<User> removeDeviceToken(ObjectId id, String token);

    Mono<NotificationDTO> sendMessage(String deviceToken, String message);
}
