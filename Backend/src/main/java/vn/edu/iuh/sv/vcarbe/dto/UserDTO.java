package vn.edu.iuh.sv.vcarbe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private String id;
    private String displayName;
    private String email;
    private String phoneNumber;
    private String imageUrl;

    public UserDTO(String id) {
        this.id = id;
    }

    public UserDTO(Document userDocument) {
        this.id = userDocument.getObjectId("_id").toString();
        this.displayName = userDocument.getString("displayName");
        this.email = userDocument.getString("email");
        this.phoneNumber = userDocument.getString("phoneNumber");
        this.imageUrl = userDocument.getString("imageUrl");
    }
}
