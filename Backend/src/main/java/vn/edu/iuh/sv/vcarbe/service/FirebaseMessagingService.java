package vn.edu.iuh.sv.vcarbe.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.stereotype.Service;

@Service
public class FirebaseMessagingService {

    public String sendNotification(String token, String title, String body) {
        Notification notification = Notification.builder()
            .setTitle(title)
            .setBody(body)
            .build();

        Message message = Message.builder()
            .setToken(token)
            .setNotification(notification)
            .build();

        try {
            String response = FirebaseMessaging.getInstance().send(message);
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
