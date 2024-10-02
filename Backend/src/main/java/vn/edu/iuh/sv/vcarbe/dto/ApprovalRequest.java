package vn.edu.iuh.sv.vcarbe.dto;

import org.bson.types.ObjectId;

public record ApprovalRequest(ObjectId requestId,
                              String additionalTerms,
                              DigitalSignature digitalSignature
) {
}
