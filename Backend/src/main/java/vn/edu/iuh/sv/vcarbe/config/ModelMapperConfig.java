package vn.edu.iuh.sv.vcarbe.config;

import org.bson.types.ObjectId;
import org.modelmapper.AbstractConverter;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STANDARD)
                .setSkipNullEnabled(true);
        modelMapper.addConverter(new AbstractConverter<ObjectId, String>() {
            @Override
            protected String convert(ObjectId source) {
                return source == null ? null : source.toHexString();
            }
        });
        modelMapper.addConverter(new AbstractConverter<String, ObjectId>() {
            @Override
            protected ObjectId convert(String source) {
                return source == null ? null : new ObjectId(source);
            }
        });
        return modelMapper;
    }
}
