package vn.edu.iuh.sv.vcarbe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.iuh.sv.vcarbe.entity.PaymentStatus;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class InvoiceDTO {
    private String id;
    private String contractId;
    private String txnRef;
    private String transactionNo;
    private Long transactionDate;
    private Long amount;
    private PaymentStatus paymentStatus;
    private Date createdAt;
    private String content;
}
