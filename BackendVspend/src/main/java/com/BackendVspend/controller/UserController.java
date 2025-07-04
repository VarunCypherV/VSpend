
package com.backendvspend.controller;

import com.backendvspend.dto.BudgetWarningRequest;
import com.backendvspend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/budget")
    public ResponseEntity<Double> getUserBudget(Principal principal) {
        Double budget = userService.getUserBudget(principal.getName());
        return ResponseEntity.ok(budget);
    }

    @PostMapping("/budget-warning")
    public ResponseEntity<?> handleBudgetWarning(@RequestBody BudgetWarningRequest request,
                                                 Principal principal) {
        userService.handleBudgetWarning(principal.getName(), request);
        return ResponseEntity.ok("Budget warning handled.");
    }
}
