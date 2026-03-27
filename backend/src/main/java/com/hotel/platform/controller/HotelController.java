package com.hotel.platform.controller;

import com.hotel.platform.model.Hotel;
import com.hotel.platform.repository.HotelRepository;
import com.hotel.platform.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @GetMapping
    public List<Hotel> getAllHotels() {
        List<Hotel> hotels = hotelRepository.findAll();
        hotels.forEach(h -> {
            long availableCount = roomRepository.findByHotelId(h.getId()).stream()
                    .filter(com.hotel.platform.model.Room::getIsAvailable)
                    .count();
            h.setAvailableRooms((int) availableCount);
        });
        return hotels;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getHotelById(@PathVariable String id) {
        return hotelRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Hotel> searchHotels(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) List<String> amenities) {
        
        List<Hotel> hotels = hotelRepository.findAll();
        
        return hotels.stream()
                .filter(h -> location == null || location.isEmpty() || h.getLocation().toLowerCase().contains(location.toLowerCase()))
                .filter(h -> minRating == null || h.getRating() >= minRating)
                .filter(h -> category == null || category.isEmpty() || h.getCategory().equalsIgnoreCase(category))
                .filter(h -> amenities == null || amenities.isEmpty() || h.getAmenities().containsAll(amenities))
                .peek(h -> {
                    long availableCount = roomRepository.findByHotelId(h.getId()).stream()
                            .filter(com.hotel.platform.model.Room::getIsAvailable)
                            .count();
                    h.setAvailableRooms((int) availableCount);
                })
                .toList();
    }
}
