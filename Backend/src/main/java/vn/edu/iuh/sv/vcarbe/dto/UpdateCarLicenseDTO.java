package vn.edu.iuh.sv.vcarbe.dto;

import java.util.Date;

public record UpdateCarLicenseDTO(String id, String fullName, Date dob, String licenseImageUrl, Date issuedDate, String issuedLocation) {
}