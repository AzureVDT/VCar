package vn.edu.iuh.sv.vcarbe.service.impl;

import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.iuh.sv.vcarbe.dto.CarDTO;
import vn.edu.iuh.sv.vcarbe.entity.Car;
import vn.edu.iuh.sv.vcarbe.entity.CarStatus;
import vn.edu.iuh.sv.vcarbe.entity.Province;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.repository.CarRepository;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.CarService;
import vn.edu.iuh.sv.vcarbe.util.BeanUtils;

import java.util.List;

@Service
public class CarServiceImpl implements CarService {

    @Autowired
    private CarRepository carRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public CarDTO createCar(Car car) {
        car.setStatus(CarStatus.AVAILABLE);
        Car savedCar= carRepository.save(car);
        return modelMapper.map(savedCar, CarDTO.class);
    }

    @Override
    public CarDTO updateCar(UserPrincipal userPrincipal, ObjectId id, Car car) {
        Car existingCar = carRepository.findByOwnerAndId(userPrincipal.getId().toHexString(), id).orElseThrow(() -> new AppException(404, "Car not found with id " + id));

        if (existingCar == null) {
            car.setId(id);
        } else {
            BeanUtils.copyNonNullProperties(car, existingCar);
        }
        Car updatedCar = carRepository.save(car);
        return modelMapper.map(updatedCar, CarDTO.class);
    }

    @Override
    public void deleteCar(UserPrincipal userPrincipal, ObjectId id) {
        Car car = carRepository.findByOwnerAndId(userPrincipal.getId().toHexString(), id)
                .orElseThrow(() -> new AppException(404, "Car not found with id " + id));
        carRepository.delete(car);
    }

    @Override
    public CarDTO findCarById(ObjectId id) {
        CarDTO existingCar = carRepository.findByIdCustom(id);
        return modelMapper.map(existingCar, CarDTO.class);
    }

    @Override
    public List<CarDTO> findAllCars() {
        List<Car> cars = carRepository.findAll();
        return cars.stream()
                .map(car -> modelMapper.map(car, CarDTO.class))
                .toList();
    }

    @Override
    public List<String> autocomplete(String query, Province province) {
        return carRepository.autocomplete(query, province);
    }

    @Override
    public List<CarDTO> search(String query, Province province) {
        return carRepository.search(query, province);
    }
}
