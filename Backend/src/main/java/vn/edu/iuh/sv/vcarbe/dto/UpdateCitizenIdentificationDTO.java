package vn.edu.iuh.sv.vcarbe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

public record UpdateCitizenIdentificationDTO(String identificationNumber,
                                             String passportNumber,
                                             Date issuedDate,
                                             String issuedLocation,
                                             String permanentAddress,
                                             String contactAddress,
                                             String identificationImageUrl) {

}
