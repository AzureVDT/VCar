package vn.edu.iuh.sv.vcarbe.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CarLicense {
    private String id;
    private String fullName;
    private Date dob;
    private String licenseImageUrl;
    private Date issuedDate;
    private String issuedLocation;
}