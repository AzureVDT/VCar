package vn.edu.iuh.sv.vcarbe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.iuh.sv.vcarbe.entity.NotificationType;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class NotificationDTO {
    private String id;
    private String userId;
    private String message;
    private boolean isRead;
    private Date createdAt;
    private NotificationType type;
    private String targetId;
    private String link;
}
