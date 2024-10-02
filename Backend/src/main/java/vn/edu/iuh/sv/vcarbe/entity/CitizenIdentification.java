package vn.edu.iuh.sv.vcarbe.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CitizenIdentification {
    private String citizenIdentificationNumber;
    private String passportNumber;
    private Date issuedDate;
    private String issuedLocation;
    private String permanentAddress;
    private String contactAddress;
    private String citizenIdentificationImage;
}