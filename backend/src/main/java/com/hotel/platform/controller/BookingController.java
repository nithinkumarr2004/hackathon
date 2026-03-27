package com.hotel.platform.controller;

import com.hotel.platform.model.Booking;
import com.hotel.platform.repository.BookingRepository;
import com.hotel.platform.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        // Check for overlapping bookings
        List<Booking> existingBookings = bookingRepository.findByRoomId(booking.getRoomId());
        boolean isOverlapping = existingBookings.stream().anyMatch(ex -> 
            (booking.getCheckInDate().isBefore(ex.getCheckOutDate()) && 
             ex.getCheckInDate().isBefore(booking.getCheckOutDate())) &&
            !"CANCELLED".equals(ex.getStatus())
        );

        if (isOverlapping) {
            return ResponseEntity.badRequest().body(Map.of("message", "Room is already booked for these dates."));
        }

        booking.setReservationNumber("RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setCreatedAt(LocalDateTime.now());
        booking.setStatus("CONFIRMED");
        
        Booking savedBooking = bookingRepository.save(booking);
        
        return ResponseEntity.ok(savedBooking);
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getUserBookings(@PathVariable String userId) {
        return bookingRepository.findByUserId(userId);
    }
}
