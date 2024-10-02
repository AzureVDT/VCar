package vn.edu.iuh.sv.vcarbe.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.ApiResponseWrapper;
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
import vn.edu.iuh.sv.vcarbe.security.CurrentUser;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.NotificationService;

@RestController
@RequestMapping("/notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @Operation(summary = "Retrieve notifications for the current user",
            description = "Fetches all notifications for the currently authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notifications retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized access")
    })
    @GetMapping
    public Mono<ResponseEntity<ApiResponseWrapper>> getNotifications(
            @CurrentUser @Parameter(hidden = true) UserPrincipal userPrincipal) {
        return notificationService.getNotificationsForUser(userPrincipal.getId())
                .collectList()
                .map(notifications -> ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.SUCCESS.name(), notifications)));
    }

    @Operation(summary = "Mark a notification as read",
            description = "Updates the status of a specific notification to 'read'.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notification marked as read"),
            @ApiResponse(responseCode = "404", description = "Notification not found")
    })
    @PutMapping("/{id}/markAsRead")
    public Mono<ResponseEntity<ApiResponseWrapper>> markAsRead(
            @PathVariable
            @Parameter(
                    description = "ID of the notification to mark as read",
                    schema = @Schema(type = "string")
            )
            ObjectId id) {
        return notificationService.markAsRead(id)
                .map(notification -> ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.SUCCESS.name(), notification)));
    }

    @Operation(summary = "Subscribe a device for push notifications",
            description = "Adds a device token to the user's list of subscribed devices.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Device subscribed successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request")
    })
    @PostMapping("/subscribe-device")
    public Mono<ResponseEntity<ApiResponseWrapper>> subscribeDevice(
            @RequestParam String deviceToken,
            @CurrentUser UserPrincipal userPrincipal) {
        return notificationService.addDeviceToken(userPrincipal.getId(), deviceToken)
                .map(notification -> ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.SUCCESS.name(), notification)));
    }

    @Operation(summary = "Unsubscribe a device from push notifications",
            description = "Removes a device token from the user's list of subscribed devices.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Device unsubscribed successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request")
    })
    @DeleteMapping("/unsubscribe-device")
    public Mono<ResponseEntity<ApiResponseWrapper>> unsubscribeDevice(
            @RequestParam String deviceToken,
            @CurrentUser UserPrincipal userPrincipal) {
        return notificationService.removeDeviceToken(userPrincipal.getId(), deviceToken)
                .map(notification -> ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.SUCCESS.name(), notification)));
    }

    @Operation(summary = "Send message to specific device",
            description = "Send message to specific device.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Message sent successfully"),
            @ApiResponse(responseCode = "400", description = "Bad request")
    })
    @PostMapping("/send-message")
    public Mono<ResponseEntity<ApiResponseWrapper>> sendMessage(
            @RequestParam String deviceToken,
            @RequestParam String message) {
        return notificationService.sendMessage(deviceToken, message)
                .map(notification -> ResponseEntity.ok(new ApiResponseWrapper(200, "Remember this is test only", notification)));
    }
}
