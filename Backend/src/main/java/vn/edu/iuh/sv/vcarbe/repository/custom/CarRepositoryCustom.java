package vn.edu.iuh.sv.vcarbe.repository.custom;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import vn.edu.iuh.sv.vcarbe.dto.CarDTO;
import vn.edu.iuh.sv.vcarbe.dto.CarDetailDTO;
import vn.edu.iuh.sv.vcarbe.dto.SearchCriteria;
import vn.edu.iuh.sv.vcarbe.entity.Province;

import java.util.List;

public interface CarRepositoryCustom {
    Flux<String> autocomplete(String query, Province province);

    Mono<CarDetailDTO> findByIdCustom(ObjectId id);

    Flux<CarDTO> search(SearchCriteria criteria, Pageable pageable);

    Flux<CarDTO> findByOwner(ObjectId id);
}
