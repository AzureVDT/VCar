package vn.edu.iuh.sv.vcarbe.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.ApiResponseWrapper;
import vn.edu.iuh.sv.vcarbe.dto.ApiResponseWrapperWithMeta;
import vn.edu.iuh.sv.vcarbe.dto.PaginationMetadata;
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
import vn.edu.iuh.sv.vcarbe.security.CurrentUser;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.impl.InvoiceService;

@RestController
@RequestMapping("/invoices")
@Tag(name = "Invoice Controller", description = "APIs related to invoice management and payment")
public class InvoiceController {
    @Autowired
    private InvoiceService invoiceService;

    @Operation(summary = "Get user invoices", description = "Retrieves a paginated list of invoices for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved user invoices"),
            @ApiResponse(responseCode = "401", description = "Unauthorized request")
    })
    @GetMapping
    public Mono<ApiResponseWrapperWithMeta> getUserInvoices(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return invoiceService.getUserInvoices(userPrincipal, page, size, sortBy, sortDir).map(paginatedInvoices -> {
            PaginationMetadata pagination = new PaginationMetadata(
                    paginatedInvoices.getNumber(),
                    paginatedInvoices.getSize(),
                    paginatedInvoices.getTotalElements(),
                    paginatedInvoices.getTotalPages(),
                    paginatedInvoices.hasPrevious(),
                    paginatedInvoices.hasNext()
            );
            return new ApiResponseWrapperWithMeta(200, MessageKeys.SUCCESS.name(), paginatedInvoices.getContent(), pagination);
        });
    }

    @Operation(summary = "Get invoice by ID", description = "Retrieves an invoice by its ID for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the invoice"),
            @ApiResponse(responseCode = "404", description = "Invoice not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized request")
    })
    @GetMapping("/{id}")
    public Mono<ApiResponseWrapper> getInvoice(
            @CurrentUser UserPrincipal userPrincipal,
            @Parameter(
                    description = "Car ID (must be a valid ObjectId)",
                    schema = @Schema(type = "string")
            )
            @PathVariable ObjectId id) {
        return invoiceService.getInvoiceById(userPrincipal, id)
                .map(invoice -> new ApiResponseWrapper(200, MessageKeys.SUCCESS.name(), invoice));
    }
}
