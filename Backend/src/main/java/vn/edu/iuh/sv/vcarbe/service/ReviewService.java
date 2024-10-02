package vn.edu.iuh.sv.vcarbe.service;

import org.bson.types.ObjectId;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.CarReviewDTO;
import vn.edu.iuh.sv.vcarbe.dto.LesseeReviewDTO;
import vn.edu.iuh.sv.vcarbe.dto.ReviewRequest;
import vn.edu.iuh.sv.vcarbe.entity.Review;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;

import java.util.List;

public interface ReviewService {
    Mono<Review> addReview(UserPrincipal userPrincipal, ReviewRequest reviewRequest);

    List<CarReviewDTO> getReviewsByCarId(ObjectId carId);

    List<LesseeReviewDTO> getReviewsByLesseeId(ObjectId lesseeId);
}
