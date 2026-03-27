package com.hotel.platform.controller;

import com.hotel.platform.model.User;
import com.hotel.platform.model.UserRole;
import com.hotel.platform.repository.UserRepository;
import com.hotel.platform.security.JwtUtils;
import com.hotel.platform.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	UserRepository userRepository;

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	JwtUtils jwtUtils;

	@PostMapping("/login")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody Map<String, String> loginRequest) {

		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.get("email"), loginRequest.get("password")));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtils.generateJwtToken(authentication);
		
		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();		

		Map<String, Object> response = new HashMap<>();
		response.put("token", jwt);
		response.put("id", userDetails.getId());
		response.put("name", userDetails.getName());
		response.put("email", userDetails.getEmail());
		response.put("roles", userDetails.getAuthorities());

		return ResponseEntity.ok(response);
	}

	@PostMapping("/register")
	public ResponseEntity<?> registerUser(@Valid @RequestBody Map<String, String> signUpRequest) {
		if (userRepository.existsByEmail(signUpRequest.get("email"))) {
			return ResponseEntity
					.badRequest()
					.body(Map.of("error", "Error: Email is already in use!"));
		}

		User user = new User();
		user.setName(signUpRequest.get("name"));
		user.setEmail(signUpRequest.get("email"));
		user.setPassword(encoder.encode(signUpRequest.get("password")));
		user.setRole(UserRole.USER);

		userRepository.save(user);

		return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
	}
}
