package com.backendvspend.dto;

import lombok.Data;

@Data
public class BudgetWarningRequest {
    private Double exceededAmount;
    private Double newBudget;
    private String email;  // <-- add this field only
}
