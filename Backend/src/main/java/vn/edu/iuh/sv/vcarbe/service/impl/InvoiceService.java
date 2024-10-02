package vn.edu.iuh.sv.vcarbe.service.impl;

import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.config.VNPayConfig;
import vn.edu.iuh.sv.vcarbe.dto.InvoiceDTO;
import vn.edu.iuh.sv.vcarbe.dto.RentalContractDTO;
import vn.edu.iuh.sv.vcarbe.dto.SignRequest;
import vn.edu.iuh.sv.vcarbe.entity.*;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
import vn.edu.iuh.sv.vcarbe.repository.InvoiceRepository;
import vn.edu.iuh.sv.vcarbe.repository.RentalContractRepository;
import vn.edu.iuh.sv.vcarbe.repository.UserRepository;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.util.BlockchainUtils;
import vn.edu.iuh.sv.vcarbe.util.NotificationUtils;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class InvoiceService {
    private final VNPayConfig vnPayConfig;
    private final InvoiceRepository invoiceRepository;
    private final RentalContractRepository rentalContractRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final NotificationUtils notificationUtils;
    private final BlockchainUtils blockchainUtils;

    public InvoiceService(VNPayConfig vnPayConfig, InvoiceRepository invoiceRepository, RentalContractRepository rentalContractRepository, UserRepository userRepository, ModelMapper modelMapper, NotificationUtils notificationUtils, BlockchainUtils blockchainUtils) {
        this.vnPayConfig = vnPayConfig;
        this.invoiceRepository = invoiceRepository;
        this.rentalContractRepository = rentalContractRepository;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.notificationUtils = notificationUtils;
        this.blockchainUtils = blockchainUtils;
    }

    public Mono<String> createPaymentUrl(ServerHttpRequest req, UserPrincipal userPrincipal, SignRequest signRequest) throws UnsupportedEncodingException {
        return rentalContractRepository.findByLesseeIdAndId(userPrincipal.getId(), signRequest.contractId())
                .switchIfEmpty(Mono.error(new AppException(HttpStatus.NOT_FOUND.value(), MessageKeys.CONTRACT_NOT_FOUND.name())))
                .flatMap(rentalContract -> userRepository.findById(userPrincipal.getId())
                        .switchIfEmpty(Mono.error(new AppException(HttpStatus.NOT_FOUND.value(), MessageKeys.USER_NOT_FOUND.name())))
                        .flatMap(lessee -> {
                            rentalContract.sign(lessee, signRequest);

                            return rentalContractRepository.save(rentalContract)
                                    .flatMap(savedRentalContract -> {
                                        String txnRef = VNPayConfig.getRandomNumber(8);
                                        Invoice invoice = new Invoice();
                                        invoice.setContractId(savedRentalContract.getId());
                                        invoice.setTxnRef(txnRef);
                                        invoice.setAmount((long) (savedRentalContract.getTotalRentalValue() * 30L));
                                        invoice.setLesseeId(savedRentalContract.getLesseeId());
                                        invoice.setLessorId(savedRentalContract.getLessorId());
                                        invoice.setPaymentStatus(PaymentStatus.PENDING);

                                        Map<String, String> vnpParams = new HashMap<>();
                                        vnpParams.put("vnp_Version", vnPayConfig.getVnp_Version());
                                        vnpParams.put("vnp_Command", vnPayConfig.getVnp_Command());
                                        vnpParams.put("vnp_TmnCode", vnPayConfig.getVnp_TmnCode());
                                        vnpParams.put("vnp_Amount", String.valueOf(invoice.getAmount()));
                                        vnpParams.put("vnp_CurrCode", "VND");
                                        vnpParams.put("vnp_TxnRef", txnRef);
                                        vnpParams.put("vnp_OrderInfo", "Thanh toan don hang: " + txnRef);
                                        vnpParams.put("vnp_OrderType", "other");
                                        vnpParams.put("vnp_Locale", "vn");
                                        vnpParams.put("vnp_ReturnUrl", vnPayConfig.getVnp_ReturnUrl());
                                        vnpParams.put("vnp_IpAddr", VNPayConfig.getIpAddress(req));

                                        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
                                        cld.add(Calendar.HOUR, vnPayConfig.getTimezoneOffset());
                                        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
                                        vnpParams.put("vnp_CreateDate", formatter.format(cld.getTime()));
                                        invoice.setCreateDate(formatter.format(cld.getTime()));

                                        return invoiceRepository.save(invoice)
                                                .flatMap(savedInvoice -> {
                                                    cld.add(Calendar.MINUTE, 15);
                                                    vnpParams.put("vnp_ExpireDate", formatter.format(cld.getTime()));

                                                    String queryUrl = generateQueryUrl(vnpParams);
                                                    String vnpSecureHash = VNPayConfig.hmacSHA512(vnPayConfig.getSecretKey(), queryUrl);

                                                    return Mono.just(vnPayConfig.getVnp_PayUrl() + "?" + queryUrl + "&vnp_SecureHash=" + vnpSecureHash);
                                                });
                                    });
                        })
                );
    }

    public Mono<RentalContractDTO> handlePaymentCallback(ServerHttpRequest req) {
        Map<String, String> fields = extractFieldsFromRequest(req);

        return invoiceRepository.findByTxnRef(fields.get("vnp_TxnRef"))
                .switchIfEmpty(Mono.error(new AppException(HttpStatus.NOT_FOUND.value(), MessageKeys.INVOICE_NOT_FOUND.name())))
                .flatMap(invoice -> {
                    String vnpSecureHash = req.getQueryParams().getFirst("vnp_SecureHash");
                    fields.remove("vnp_SecureHash");
                    String signValue = vnPayConfig.hashAllFields(fields);

                    if (!vnpSecureHash.equals(signValue)) {
                        invoice.setPaymentStatus(PaymentStatus.CANCELLED);
                        invoice.setContent("Giao dịch thất bại. Sai mã xác thực");

                        return invoiceRepository.save(invoice)
                                .then(Mono.error(new AppException(HttpStatus.FORBIDDEN.value(), MessageKeys.PAYMENT_NOT_VALID.name())));
                    }

                    String vnpResponseCode = req.getQueryParams().getFirst("vnp_ResponseCode");
                    if ("00".equals(vnpResponseCode)) {
                        invoice.setPaymentStatus(PaymentStatus.PAID);
                        invoice.setContent("Thanh toán thành công");
                        invoice.setTransactionNo(req.getQueryParams().getFirst("vnp_TransactionNo"));
                        invoice.setTransactionDate(Long.parseLong(req.getQueryParams().getFirst("vnp_PayDate")));

                        return invoiceRepository.save(invoice)
                                .flatMap(savedInvoice -> rentalContractRepository.findById(savedInvoice.getContractId())
                                        .switchIfEmpty(Mono.error(new AppException(HttpStatus.NOT_FOUND.value(), MessageKeys.CONTRACT_NOT_FOUND.name())))
                                        .flatMap(rentalContract -> {
                                            rentalContract.setRentalStatus(RentalStatus.SIGNED);

                                            return rentalContractRepository.save(rentalContract)
                                                    .doOnSuccess(updatedRentalContract -> {
                                                        blockchainUtils.approveRentalContract(updatedRentalContract.getId().toHexString());
                                                        notificationUtils.createNotification(rentalContract.getLessorId(), "Lessee has signed the contract", NotificationType.RENTAL_CONTRACT, "/rental-contracts/" + rentalContract.getId(), rentalContract.getId());
                                                    })
                                                    .thenReturn(modelMapper.map(rentalContract, RentalContractDTO.class));
                                        })
                                );
                    } else {
                        invoice.setPaymentStatus(PaymentStatus.CANCELLED);
                        invoice.setContent("Giao dịch thất bại. Mã lỗi: " + vnpResponseCode);

                        return invoiceRepository.save(invoice)
                                .then(Mono.error(new AppException(HttpStatus.BAD_REQUEST.value(), MessageKeys.PAYMENT_FAILED.name())));
                    }
                });
    }

    private String generateQueryUrl(Map<String, String> vnp_Params) {
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && fieldValue.length() > 0) {
                try {
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()))
                            .append('=')
                            .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                } catch (UnsupportedEncodingException e) {
                    throw new RuntimeException(e);
                }
                if (itr.hasNext()) {
                    query.append('&');
                }
            }
        }
        return query.toString();
    }

    private Map<String, String> extractFieldsFromRequest(ServerHttpRequest req) {
        Map<String, String> fields = new HashMap<>();
        MultiValueMap<String, String> queryParams = req.getQueryParams();

        queryParams.forEach((key, values) -> {
            try {
                String encodedKey = URLEncoder.encode(key, StandardCharsets.US_ASCII.toString());
                String encodedValue = URLEncoder.encode(values.get(0), StandardCharsets.US_ASCII.toString());
                fields.put(encodedKey, encodedValue);
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        });

        return fields;
    }

    public Mono<Page<InvoiceDTO>> getUserInvoices(UserPrincipal userPrincipal, int page, int size, String sortBy, String sortDir) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir.toUpperCase()), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return invoiceRepository.findByLesseeId(userPrincipal.getId(), pageable)
                .collectList()
                .flatMap(invoices ->
                        invoiceRepository.countByLesseeId(userPrincipal.getId())
                                .map(total -> new PageImpl<>(
                                        invoices.stream()
                                                .map(invoice -> modelMapper.map(invoice, InvoiceDTO.class))
                                                .toList(), pageable, total))
                );
    }

    public Mono<InvoiceDTO> getInvoiceById(UserPrincipal userPrincipal, ObjectId invoiceId) {
        return invoiceRepository.findByIdAndLesseeId(invoiceId, userPrincipal.getId())
                .map(invoice -> modelMapper.map(invoice, InvoiceDTO.class));
    }
}
