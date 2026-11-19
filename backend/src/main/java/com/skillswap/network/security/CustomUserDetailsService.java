package com.skillswap.network.security;

import com.skillswap.network.entity.User;
import com.skillswap.network.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        boolean isEnabled = !"BLOCKED".equalsIgnoreCase(user.getStatus()) && !"DEACTIVATED".equalsIgnoreCase(user.getStatus());

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(),
                isEnabled,
                true,
                true,
                true,
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole()))
        );
    }
}
