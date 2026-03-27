package com.hotel.platform.repository;

import com.hotel.platform.model.Room;
import com.hotel.platform.model.RoomCategory;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RoomRepository extends MongoRepository<Room, String> {
    List<Room> findByHotelId(String hotelId);
    List<Room> findByHotelIdAndIsAvailableTrue(String hotelId);
    List<Room> findByRoomCategoryAndIsAvailableTrue(RoomCategory category);
}
