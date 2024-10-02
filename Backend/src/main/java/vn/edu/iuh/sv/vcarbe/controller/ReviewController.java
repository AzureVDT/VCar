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
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.ApiResponseWrapper;
import vn.edu.iuh.sv.vcarbe.dto.CarReviewDTO;
import vn.edu.iuh.sv.vcarbe.dto.LesseeReviewDTO;
import vn.edu.iuh.sv.vcarbe.dto.ReviewRequest;
import vn.edu.iuh.sv.vcarbe.entity.Review;
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
import vn.edu.iuh.sv.vcarbe.security.CurrentUser;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.impl.ReviewServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@Tag(name = "Review Controller", description = "APIs related to review management")
public class ReviewController {
    @Autowired
    private ReviewServiceImpl reviewService;

    @Operation(summary = "Add a new review", description = "Adds a review for a rental contract")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Review added successfully"),
            @ApiResponse(responseCode = "404", description = "Rental contract not found")
    })
    @PostMapping
    public Mono<ResponseEntity<ApiResponseWrapper>> addReview(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestBody @Valid ReviewRequest reviewRequest) {
        return reviewService.addReview(userPrincipal, reviewRequest)
                .map(review -> ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.REVIEW_CREATE_SUCCESS.name(), review)));
    }


    @Operation(summary = "Get reviews by car ID", description = "Retrieves all reviews for a specific car")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reviews retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Car not found")
    })
    @GetMapping("/car/{carId}")
    public ResponseEntity<ApiResponseWrapper> getReviewsByCar(
            @Parameter(description = "Car ID (must be a valid ObjectId)", schema = @Schema(type = "string", example = "66c1b604172236f7936e26c0"))
            @PathVariable ObjectId carId) {
        List<CarReviewDTO> reviews = reviewService.getReviewsByCarId(carId);
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.SUCCESS.name(), reviews));
    }

    @Operation(summary = "Get reviews by lessee ID", description = "Retrieves all reviews for a specific lessee")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reviews retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Lessee not found")
    })
    @GetMapping("/lessee/{lesseeId}")
    public ResponseEntity<ApiResponseWrapper> getReviewsByLessee(
            @Parameter(description = "Lessee ID (must be a valid ObjectId)", schema = @Schema(type = "string", example = "66c1b604172236f7936e26c0"))
            @PathVariable ObjectId lesseeId) {
        List<LesseeReviewDTO> reviews = reviewService.getReviewsByLesseeId(lesseeId);
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.SUCCESS.name(), reviews));
    }
}
