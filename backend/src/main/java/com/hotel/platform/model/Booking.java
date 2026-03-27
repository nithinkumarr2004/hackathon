package com.hotel.platform.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;
    private String userId;
    private String hotelId;
    private String roomId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String reservationNumber;
    private String status;
    private LocalDateTime createdAt;
}
