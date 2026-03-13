package com.scoutseek.controller;

import com.scoutseek.dto.*;
import com.scoutseek.model.User;
import com.scoutseek.repository.UserRepository;
import com.scoutseek.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final UserRepository userRepository;

    public AnalyticsController(AnalyticsService analyticsService, UserRepository userRepository) {
        this.analyticsService = analyticsService;
        this.userRepository = userRepository;
    }

    private Integer getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .map(User::getUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/play")
    public ResponseEntity<ApiResponse<Void>> recordPlay(
            @RequestBody Map<String, Integer> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        analyticsService.recordPlay(getUserId(userDetails), body.get("songId"), body.get("listenedSeconds"));
        return ResponseEntity.ok(ApiResponse.success("Play recorded", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AnalyticsDTO>> getMyAnalytics(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Analytics fetched",
                analyticsService.getUserAnalytics(getUserId(userDetails))));
    }

    @GetMapping("/global")
    public ResponseEntity<ApiResponse<AnalyticsDTO>> getGlobalAnalytics() {
        return ResponseEntity.ok(ApiResponse.success("Global analytics fetched",
                analyticsService.getGlobalAnalytics()));
    }
}
