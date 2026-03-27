package com.hotel.platform.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = "hotels")
public class Hotel {
    @Id
    private String id;
    private String name;
    private String location;
    private String description;
    private Double rating;
    private Integer ratingCount;
    private Double totalRating;
    private String category; // Heritage, Iconic, Mountain, Design, Backpacker
    private String priceRange;
    private List<String> amenities;
    private List<String> images;
    private Integer availableRooms;
}
