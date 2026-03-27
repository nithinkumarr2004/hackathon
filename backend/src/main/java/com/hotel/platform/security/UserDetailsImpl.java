package com.hotel.platform.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hotel.platform.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Data
@AllArgsConstructor
public class UserDetailsImpl implements UserDetails {
	private String id;
	private String name;
	private String email;

	@JsonIgnore
	private String password;

	private Collection<? extends GrantedAuthority> authorities;

	public static UserDetailsImpl build(User user) {
		List<GrantedAuthority> authorities = Collections.singletonList(
				new SimpleGrantedAuthority(user.getRole().name())
		);

		return new UserDetailsImpl(
				user.getId(),
				user.getName(),
				user.getEmail(),
				user.getPassword(),
				authorities);
	}

	@Override
	public String getUsername() {
		return email;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}
}
