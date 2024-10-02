package vn.edu.iuh.sv.vcarbe.service;

import org.bson.types.ObjectId;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.CarDTO;
import vn.edu.iuh.sv.vcarbe.dto.CarDetailDTO;
import vn.edu.iuh.sv.vcarbe.dto.SearchCriteria;
import vn.edu.iuh.sv.vcarbe.entity.Car;
import vn.edu.iuh.sv.vcarbe.entity.Province;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;

public interface CarService {
    Mono<CarDTO> createCar(Car car);

    Mono<CarDTO> updateCar(UserPrincipal userPrincipal, ObjectId id, Car car);

    Mono<Car> deleteCar(UserPrincipal userPrincipal, ObjectId id);

    Mono<CarDetailDTO> findCarById(ObjectId id);

    Flux<String> autocomplete(String query, Province province);

    Flux<CarDTO> search(SearchCriteria criteria);

    Flux<CarDTO> getCarsByOwner(UserPrincipal userPrincipal);
}
