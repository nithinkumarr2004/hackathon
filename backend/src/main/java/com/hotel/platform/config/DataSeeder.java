package com.hotel.platform.config;

import com.hotel.platform.model.*;
import com.hotel.platform.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(HotelRepository hotelRepo, RoomRepository roomRepo, UserRepository userRepo, PasswordEncoder encoder) {
        return args -> {
            hotelRepo.deleteAll();
            roomRepo.deleteAll();
            userRepo.deleteAll();

            // Seed Admin
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@hotel.com");
            admin.setPassword(encoder.encode("admin123"));
            admin.setRole(UserRole.ADMIN);
            userRepo.save(admin);

            // Seed Hotels from provided UI images
            Hotel h1 = createHotel("Taj Lake Palace", "Udaipur", "A floating white marble palace on Lake Pichola, this 18th-century architectural marvel is the stuff of dreams.", 4.9, 1250, 4.9, "Heritage", "12,000-45,000", Arrays.asList("WiFi", "Pool", "Spa", "Restaurant", "Valet Parking", "Fine Dining"));
            Hotel h2 = createHotel("The Grand Oberoi", "Mumbai", "A timeless icon of luxury perched atop Marine Drive, offering sweeping Arabian Sea vistas and unparalleled service.", 4.8, 2100, 4.8, "Iconic", "8,500-25,000", Arrays.asList("WiFi", "Pool", "Spa", "Gym", "Business Center", "Bar"));
            Hotel h3 = createHotel("Wildflower Hall", "Shimla", "A jewel of the Himalayas set at 8,250 feet among cedar forests, a former viceregal retreat offering breathtaking views.", 4.8, 950, 4.8, "Mountain", "9,500-22,000", Arrays.asList("WiFi", "Pool (heated)", "Spa", "Gym", "Trekking Guide", "Heater"));
            Hotel h4 = createHotel("The Park", "New Delhi", "A contemporary design hotel in the heart of Connaught Place, celebrating Indian art and culture with avant-garde flair.", 4.3, 3100, 4.3, "Design", "3,800-12,000", Arrays.asList("WiFi", "Pool", "Gym", "Restaurant", "Art Gallery", "Free Parking"));
            Hotel h5 = createHotel("Zostel Backpackers", "Goa", "The original social hostel of India - vibrant, affordable, and full of like-minded travelers. Hammocks and beach vibes.", 4.1, 4500, 4.1, "Backpacker", "900-3,500", Arrays.asList("WiFi", "Common Kitchen", "Lounge", "Bike Rental", "Free Parking"));
            
            hotelRepo.saveAll(Arrays.asList(h1, h2, h3, h4, h5));

            // Seed Rooms for Taj Lake Palace
            roomRepo.save(createRoom(h1.getId(), "Heritage Suite", 12000.0, 2, Arrays.asList("Lake View", "Vintage Decor", "Butlers"), RoomCategory.COUPLE));
            roomRepo.save(createRoom(h1.getId(), "Royal Palace Suite", 45000.0, 4, Arrays.asList("Private Balcony", "Jacuzzi", "Living Room"), RoomCategory.FAMILY));
            
            // Rooms for Grand Oberoi
            roomRepo.save(createRoom(h2.getId(), "Oberoi Executive", 8500.0, 1, Arrays.asList("Ocean View", "Smart TV", "Mini Bar"), RoomCategory.BUSINESS));
            roomRepo.save(createRoom(h2.getId(), "Marine Drive Suite", 25000.0, 4, Arrays.asList("Panoramic View", "Kitchenette"), RoomCategory.FAMILY));

            // Rooms for Wildflower Hall
            roomRepo.save(createRoom(h3.getId(), "Garden View", 9500.0, 2, Arrays.asList("Forest View", "Fireplace"), RoomCategory.COUPLE));
            roomRepo.save(createRoom(h3.getId(), "Lord Kitchener Suite", 22000.0, 3, Arrays.asList("Mountain View", "Private Terrace"), RoomCategory.FAMILY));

            // Rooms for Zostel
            roomRepo.save(createRoom(h5.getId(), "Mixed Dorm", 900.0, 1, Arrays.asList("Locker", "Shared Bath"), RoomCategory.SOLO));
            roomRepo.save(createRoom(h5.getId(), "Private Beach Room", 3500.0, 2, Arrays.asList("Attached Bath", "Sea View"), RoomCategory.COUPLE));
        };
    }

    private Hotel createHotel(String name, String location, String description, Double rating, Integer ratingCount, Double totalRating, String category, String price, List<String> amenities) {
        Hotel h = new Hotel();
        h.setName(name);
        h.setLocation(location);
        h.setDescription(description);
        h.setRating(rating);
        h.setRatingCount(ratingCount);
        h.setTotalRating(totalRating);
        h.setCategory(category);
        h.setPriceRange(price);
        h.setAmenities(amenities);
        h.setImages(Arrays.asList(
            "https://images.unsplash.com/photo-1566073771259-6a8506099945", 
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
            "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"
        ));
        return h;
    }

    private Room createRoom(String hotelId, String type, double price, int cap, List<String> amenities, RoomCategory cat) {
        Room r = new Room();
        r.setHotelId(hotelId);
        r.setRoomType(type);
        r.setPrice(price);
        r.setCapacity(cap);
        r.setAmenities(amenities);
        r.setRoomCategory(cat);
        r.setIsAvailable(true);
        return r;
    }
}
