package vn.edu.iuh.sv.vcarbe.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.*;
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
import vn.edu.iuh.sv.vcarbe.security.CurrentUser;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.RentalContractService;
import vn.edu.iuh.sv.vcarbe.service.impl.InvoiceService;
import vn.edu.iuh.sv.vcarbe.util.EthersUtils;

import java.io.UnsupportedEncodingException;

@RestController
@RequestMapping("/rental-contracts")
@Tag(name = "Rental Contract Controller", description = "APIs related to rental contract management")
public class RentalContractController {
    @Autowired
    private RentalContractService rentalContractService;
    @Autowired
    private InvoiceService invoiceService;

    @Operation(summary = "Create a payment URL for rental contract", description = "Generates a payment URL for the lessee to make a payment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Payment URL created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request or user not found")
    })
    @PostMapping("/lessee-approve")
    public Mono<ResponseEntity<ApiResponseWrapper>> createPayment(
            ServerHttpRequest req,
            @CurrentUser UserPrincipal userPrincipal,
            @Valid @RequestBody SignRequest signRequest) throws UnsupportedEncodingException {
        EthersUtils.verifyMessage(signRequest.digitalSignature());
        return invoiceService.createPaymentUrl(req, userPrincipal, signRequest)
                .map(paymentUrl -> ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.PAYMENT_CREATE_SUCCESS.name(), paymentUrl)));
    }

    @Operation(summary = "Handle payment callback", description = "Handles the callback from VNPay after a payment is made")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Payment callback handled successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request or invoice not found")
    })
    @PostMapping("/payment-callback")
    public Mono<ResponseEntity<ApiResponseWrapper>> approveRentalRequest(ServerHttpRequest req) {
        return invoiceService.handlePaymentCallback(req)
                .map(updatedContract -> ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.PAYMENT_CALLBACK_SUCCESS.name(), updatedContract)));
    }


    @Operation(summary = "Get rental contract by ID", description = "Fetches a rental contract by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rental contract found"),
            @ApiResponse(responseCode = "404", description = "Rental contract not found")
    })
    @GetMapping("/{id}")
    public Mono<ResponseEntity<ApiResponseWrapper>> getRentalContract(
            @Parameter(description = "Rental contract ID (must be a valid ObjectId)", schema = @Schema(type = "string"))
            @PathVariable ObjectId id) throws Exception {
        return rentalContractService.getRentalContract(id)
                .map(rentalContract -> ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.SUCCESS.name(), rentalContract)));
    }

    @Operation(summary = "Get rental contracts for lessor", description = "Fetches all rental contracts for the authenticated lessor with pagination and sorting options")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rental contracts retrieved successfully")
    })
    @GetMapping("/lessor")
    public Mono<ApiResponseWrapperWithMeta> getRentalContractForLessor(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "createdAt") String sortField,
            @RequestParam(defaultValue = "false") boolean sortDescending,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return rentalContractService.getRentalContractForLessor(userPrincipal.getId(), sortField, sortDescending, page, size)
                .map(paginatedContracts -> {
                    PaginationMetadata pagination = new PaginationMetadata(
                            paginatedContracts.getNumber(),
                            paginatedContracts.getSize(),
                            paginatedContracts.getTotalElements(),
                            paginatedContracts.getTotalPages(),
                            paginatedContracts.hasPrevious(),
                            paginatedContracts.hasNext()
                    );
                    return new ApiResponseWrapperWithMeta(200, MessageKeys.SUCCESS.name(), paginatedContracts.getContent(), pagination);
                });
    }


    @Operation(summary = "Get rental contracts for lessee", description = "Fetches all rental contracts for the authenticated lessee with pagination and sorting options")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rental contracts retrieved successfully")
    })
    @GetMapping("/lessee")
    public Mono<ApiResponseWrapperWithMeta> getRentalContractForLessee(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "createdAt") String sortField,
            @RequestParam(defaultValue = "false") boolean sortDescending,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return rentalContractService.getRentalContractForLessee(userPrincipal.getId(), sortField, sortDescending, page, size)
                .map(paginatedContracts -> {
                    PaginationMetadata pagination = new PaginationMetadata(
                            paginatedContracts.getNumber(),
                            paginatedContracts.getSize(),
                            paginatedContracts.getTotalElements(),
                            paginatedContracts.getTotalPages(),
                            paginatedContracts.hasPrevious(),
                            paginatedContracts.hasNext()
                    );
                    return new ApiResponseWrapperWithMeta(200, MessageKeys.SUCCESS.name(), paginatedContracts.getContent(), pagination);
                });
    }

}
