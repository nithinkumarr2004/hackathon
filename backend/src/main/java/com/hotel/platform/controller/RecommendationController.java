package com.hotel.platform.controller;

import com.hotel.platform.model.Room;
import com.hotel.platform.model.RoomCategory;
import com.hotel.platform.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    @Autowired
    private RoomRepository roomRepository;

    @GetMapping
    public List<Room> getRecommendations(
            @RequestParam String travelerType,
            @RequestParam(required = false) Double maxPrice) {
        try {
            RoomCategory category = RoomCategory.valueOf(travelerType.toUpperCase());
            List<Room> rooms = roomRepository.findByRoomCategoryAndIsAvailableTrue(category);
            
            if (maxPrice != null) {
                return rooms.stream()
                        .filter(r -> r.getPrice() <= maxPrice)
                        .limit(5)
                        .toList();
            }
            return rooms.size() > 5 ? rooms.subList(0, 5) : rooms;
        } catch (IllegalArgumentException e) {
            return List.of();
        }
    }
}
