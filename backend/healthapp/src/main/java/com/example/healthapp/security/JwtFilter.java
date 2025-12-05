package com.example.healthapp.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Collections;

public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                Jws<Claims> claimsJws = jwtUtil.parseClaims(token);
                Claims claims = claimsJws.getBody();
                String userId = claims.getSubject();
                String role = claims.get("role", String.class);

                String authority = role.startsWith("ROLE_") ? role : "ROLE_" + role;

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                userId,
                                null,
                                Collections.singletonList(() -> authority)
                        );

                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (Exception ex) {
                // invalid token; ignore and proceed without authentication
            }
        }
        filterChain.doFilter(request, response);
    }
}
