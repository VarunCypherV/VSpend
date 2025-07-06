package com.backendvspend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class ExpenseRequest {
    private String title;
    private Double amount;
    private LocalDate date;
    private List<String> tags;  
}
