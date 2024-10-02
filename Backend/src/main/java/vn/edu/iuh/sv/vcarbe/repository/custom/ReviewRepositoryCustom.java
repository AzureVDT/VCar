package vn.edu.iuh.sv.vcarbe.repository.custom;

import org.bson.types.ObjectId;
import reactor.core.publisher.Flux;
import vn.edu.iuh.sv.vcarbe.dto.CarReviewDTO;
import vn.edu.iuh.sv.vcarbe.dto.LesseeReviewDTO;

import java.util.List;

public interface ReviewRepositoryCustom {
    List<CarReviewDTO> findCarReviewsWithUserDetailsByCarId(ObjectId carId);

    List<LesseeReviewDTO> findLesseeReviewsWithUserDetailsByLesseeId(ObjectId lesseeId);
}
