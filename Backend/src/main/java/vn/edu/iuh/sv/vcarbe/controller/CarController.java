package vn.edu.iuh.sv.vcarbe.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.*;
import vn.edu.iuh.sv.vcarbe.entity.Car;
import vn.edu.iuh.sv.vcarbe.entity.Province;
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.CarService;

@RestController
@RequestMapping("/cars")
@Tag(name = "Car Controller", description = "APIs related to car management")
public class CarController {
    @Autowired
    private CarService carService;

    @Operation(summary = "Create a new car", description = "Creates a new car for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Car created successfully"),
            @ApiResponse(responseCode = "400", description = "User is not verified or request is invalid")
    })
    @PostMapping
    public Mono<ResponseEntity<ApiResponseWrapper>> createCar(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody Car car) {
        if (!userPrincipal.isVerify()) {
            return Mono.just(ResponseEntity.badRequest().body(new ApiResponseWrapper(400, MessageKeys.USER_NOT_VERIFIED.name(), null)));
        }
        car.setOwner(userPrincipal.getId());
        return carService.createCar(car)
                .map(createdCar -> ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.CAR_CREATE_SUCCESS.name(), createdCar)));
    }

    @Operation(summary = "Get cars owned by the authenticated user", description = "Retrieves cars owned by the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cars retrieved successfully")
    })
    @GetMapping("/owned")
    public Mono<ResponseEntity<ApiResponseWrapper>> getCarsByOwner(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return carService.getCarsByOwner(userPrincipal)
                .collectList()
                .map(cars -> ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.SUCCESS.name(), cars)));
    }

    @Operation(summary = "Update car details", description = "Updates the details of an existing car owned by the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Car updated successfully"),
            @ApiResponse(responseCode = "404", description = "Car not found")
    })
    @PutMapping("/{id}")
    public Mono<ResponseEntity<ApiResponseWrapper>> updateCar(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Parameter(
                    description = "Car ID (must be a valid ObjectId)",
                    schema = @Schema(type = "string", example = "66c1b604172236f7936e26c0")
            )
            @PathVariable ObjectId id,
            @RequestBody Car car) {
        return carService.updateCar(userPrincipal, id, car)
                .map(updatedCar -> ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.CAR_UPDATE_SUCCESS.name(), updatedCar)));
    }

    @Operation(summary = "Delete a car", description = "Deletes a car owned by the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Car deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Car not found")
    })
    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Object>> deleteCar(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Parameter(
                    description = "Car ID (must be a valid ObjectId)",
                    schema = @Schema(type = "string", example = "66c1b604172236f7936e26c0")
            )
            @PathVariable ObjectId id) {
        return carService.deleteCar(userPrincipal, id)
                .map(car -> ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.CAR_DELETE_SUCCESS.name(), null)));
    }

    @Operation(summary = "Find car by ID", description = "Finds a car by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Car found successfully"),
            @ApiResponse(responseCode = "404", description = "Car not found")
    })
    @GetMapping("/{id}")
    public Mono<ResponseEntity<ApiResponseWrapper>> findCarById(
            @Parameter(
                    description = "Car ID (must be a valid ObjectId)",
                    schema = @Schema(type = "string", example = "66c1b604172236f7936e26c0")
            )
            @PathVariable ObjectId id) {
        return carService.findCarById(id)
                .map(car -> ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.SUCCESS.name(), car)));
    }

    @Operation(summary = "Autocomplete car search", description = "Provides autocomplete suggestions based on the search query and province")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Suggestions retrieved successfully")
    })
    @GetMapping("/autocomplete")
    public Mono<ResponseEntity<ApiResponseWrapper>> autocomplete(
            @RequestParam String query,
            @RequestParam Province province) {
        return carService.autocomplete(query, province)
                .collectList()
                .map(suggestions -> ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.SUCCESS.name(), suggestions)));

    }

    @Operation(summary = "Search for cars", description = "Searches for cars based on the provided search criteria")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cars found successfully")
    })
    @GetMapping("/search")
    public Mono<ResponseEntity<ApiResponseWrapper>> search(SearchCriteria criteria) {
        return carService.search(criteria)
                .collectList()
                .map(cars -> ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.SUCCESS.name(), cars)));
    }
}
