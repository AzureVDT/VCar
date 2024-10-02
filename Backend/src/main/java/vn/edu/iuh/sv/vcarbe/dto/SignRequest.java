package vn.edu.iuh.sv.vcarbe.dto;

import org.bson.types.ObjectId;

public record SignRequest(
        ObjectId contractId,

        // For organizational lessee
        String organizationRegistrationNumber,
        String organizationHeadquarters,
        String legalRepresentativeName,
        String legalRepresentativePosition,
        String organizationPhoneNumber,

        DigitalSignature digitalSignature
        ) {
}
