package com.hotel.platform.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = "rooms")
public class Room {
    @Id
    private String id;
    private String hotelId;
    private String roomType;
    private Double price;
    private Integer capacity;
    private List<String> amenities;
    private RoomCategory roomCategory;
    private Boolean isAvailable;
}
