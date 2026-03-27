package com.hotel.platform.repository;

import com.hotel.platform.model.Hotel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface HotelRepository extends MongoRepository<Hotel, String> {
    List<Hotel> findByLocationContainingIgnoreCase(String location);
    
    @Query("{'location': { $regex: ?0, $options: 'i' }, 'priceRange': ?1}")
    List<Hotel> findByLocationAndPriceRange(String location, String priceRange);
}
