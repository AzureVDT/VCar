package vn.edu.iuh.sv.vcarbe.service.impl;

import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.CarDTO;
import vn.edu.iuh.sv.vcarbe.dto.CarDetailDTO;
import vn.edu.iuh.sv.vcarbe.dto.SearchCriteria;
import vn.edu.iuh.sv.vcarbe.entity.Car;
import vn.edu.iuh.sv.vcarbe.entity.CarStatus;
import vn.edu.iuh.sv.vcarbe.entity.Province;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
import vn.edu.iuh.sv.vcarbe.repository.CarRepository;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.CarService;
import vn.edu.iuh.sv.vcarbe.util.BeanUtils;

@Service
public class CarServiceImpl implements CarService {
    @Autowired
    private CarRepository carRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public Mono<CarDTO> createCar(Car car) {
        car.setStatus(CarStatus.AVAILABLE);
        return carRepository.save(car)
                .map(savedCar -> modelMapper.map(savedCar, CarDTO.class));
    }

    public Mono<CarDTO> updateCar(UserPrincipal userPrincipal, ObjectId id, Car car) {
        return carRepository.findByOwnerAndId(userPrincipal.getId(), id)
                .switchIfEmpty(Mono.error(new AppException(404, MessageKeys.CAR_NOT_FOUND.toString())))
                .flatMap(existingCar -> {
                    BeanUtils.copyNonNullProperties(car, existingCar);
                    return carRepository.save(existingCar);
                })
                .map(updatedCar -> modelMapper.map(updatedCar, CarDTO.class));
    }

    @Override
    public Mono<Car> deleteCar(UserPrincipal userPrincipal, ObjectId id) {
        return carRepository.deleteByIdAndOwner(id, userPrincipal.getId())
                .switchIfEmpty(Mono.error(new AppException(404, MessageKeys.CAR_NOT_FOUND.toString())));
    }

    @Override
    public Mono<CarDetailDTO> findCarById(ObjectId id) {
        return carRepository.findByIdCustom(id);
    }

    @Override
    public Flux<String> autocomplete(String query, Province province) {
        return carRepository.autocomplete(query, province);
    }

    @Override
    public Flux<CarDTO> search(SearchCriteria criteria) {
        Pageable pageable = PageRequest.of(criteria.getPage(), criteria.getSize());
        return carRepository.search(criteria, pageable);
    }

    @Override
    public Flux<CarDTO> getCarsByOwner(UserPrincipal userPrincipal) {
        return carRepository.findByOwner(userPrincipal.getId());
    }
}
