package com.hotel.platform.controller;

import com.hotel.platform.model.Room;
import com.hotel.platform.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    @GetMapping("/hotel/{hotelId}")
    public List<Room> getRoomsByHotel(@PathVariable String hotelId) {
        return roomRepository.findByHotelId(hotelId);
    }
}
