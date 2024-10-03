package vn.edu.iuh.sv.vcarbe.service.impl;

import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.NotificationDTO;
import vn.edu.iuh.sv.vcarbe.entity.User;
import vn.edu.iuh.sv.vcarbe.repository.NotificationRepository;
import vn.edu.iuh.sv.vcarbe.repository.UserRepository;
import vn.edu.iuh.sv.vcarbe.service.NotificationService;
import vn.edu.iuh.sv.vcarbe.util.NotificationUtils;

@Service
public class NotificationServiceImpl implements NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private NotificationUtils notificationUtils;

    @Override
    public Mono<Page<NotificationDTO>> getNotificationsForUser(ObjectId userId, int page, int size, String sortBy, String sortDir) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir.toUpperCase()), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        return notificationRepository.findByUserId(userId, pageable)
                .collectList()
                .flatMap(notifications ->
                        notificationRepository.countByUserId(userId)
                                .map(total -> new PageImpl<>(
                                        notifications.stream()
                                                .map(notification -> modelMapper.map(notification, NotificationDTO.class))
                                                .toList(),
                                        pageable, total))
                );
    }


    @Override
    public Mono<NotificationDTO> markAsRead(ObjectId notificationId) {
        return notificationRepository.findById(notificationId)
                .switchIfEmpty(Mono.error(new RuntimeException("Notification not found with id " + notificationId)))
                .flatMap(notification -> {
                    notification.setRead(true);
                    return notificationRepository.save(notification);
                }).map(notification -> modelMapper.map(notification, NotificationDTO.class));
    }

    @Override
    public Mono<User> addDeviceToken(ObjectId id, String token) {
        return userRepository.findById(id)
                .flatMap(user -> {
                    user.getDeviceTokens().add(token);
                    return userRepository.save(user);
                });
    }

    @Override
    public Mono<User> removeDeviceToken(ObjectId id, String token) {
        return userRepository.findById(id)
                .flatMap(user -> {
                    user.getDeviceTokens().remove(token);
                    return userRepository.save(user);
                });
    }

    @Override
    public Mono<NotificationDTO> sendMessage(String deviceToken, String message) {
        notificationUtils.sendPushNotification(deviceToken, message, "this is the uri to the notification");
        return Mono.empty();
    }
}
