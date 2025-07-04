package com.backendvspend.service;

import com.backendvspend.dto.BudgetWarningRequest;
import com.backendvspend.model.User;
import com.backendvspend.repository.ExpenseRepository;
import com.backendvspend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private NotificationService notificationService;

    public Double getUserBudget(String username) {
        User user = userRepository.findByUsername(username)
                                  .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getMonthlyBudget();
    }

    public void handleBudgetWarning(String username, BudgetWarningRequest request) {
        User user = userRepository.findByUsername(username)
                                  .orElseThrow(() -> new RuntimeException("User not found"));

        // Update email if present
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            user.setEmail(request.getEmail());
        }

        // Update budget if present
        if (request.getNewBudget() != null) {
            user.setMonthlyBudget(request.getNewBudget());
        }

        // Save updated user info
        if ((request.getEmail() != null && !request.getEmail().isEmpty()) || request.getNewBudget() != null) {
            userRepository.save(user);
        }

        // Check current month expenses
        LocalDate start = YearMonth.now().atDay(1);
        LocalDate end = YearMonth.now().atEndOfMonth();

        Double totalSpent = expenseRepository.sumAmountByUserAndDateBetween(user, start, end);
        if (totalSpent == null) totalSpent = 0.0;

        if (user.getMonthlyBudget() != null && totalSpent - user.getMonthlyBudget() >= 0) {
            notificationService.sendBudgetExceededEmail(user.getEmail(), totalSpent - user.getMonthlyBudget());
        }
    }
}
