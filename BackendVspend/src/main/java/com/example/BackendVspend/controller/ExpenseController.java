package com.backendvspend.controller;

import com.backendvspend.dto.ExpenseRequest;
import com.backendvspend.model.Expense;
import com.backendvspend.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    @Autowired
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping("/add")
    public void addExpense(@RequestBody ExpenseRequest request, Principal principal) {
        expenseService.addExpense(request, principal);
    }

    @GetMapping("/all")
    public List<Expense> getAll(Principal principal) {
        return expenseService.getAllExpenses(principal);
    }

    @GetMapping("/filter")
    public List<Expense> filterByDateAndTags(
            @RequestParam("from") String from,
            @RequestParam("to") String to,
            @RequestParam(value = "tags", required = false) List<String> tags,
            Principal principal) {
        LocalDate fromDate = LocalDate.parse(from);
        LocalDate toDate = LocalDate.parse(to);
        return expenseService.filterExpenses(fromDate, toDate, tags, principal);
    }

    @GetMapping("/totals")
    public Map<String, Double> tagWiseTotals(
            @RequestParam(value = "from", required = false) String from,
            @RequestParam(value = "to", required = false) String to,
            @RequestParam(value = "tags", required = false) List<String> tags,
            Principal principal) {
        LocalDate fromDate = (from != null) ? LocalDate.parse(from) : LocalDate.now().minusDays(30);
        LocalDate toDate = (to != null) ? LocalDate.parse(to) : LocalDate.now();

        return expenseService.getTagWiseTotal(principal, fromDate, toDate, tags);
    }

    @GetMapping("/barData")
    public Map<String, Map<String, Double>> getBarData(
            @RequestParam("view") String view,
            @RequestParam(value = "from", required = false) String from,
            @RequestParam(value = "to", required = false) String to,

            @RequestParam(value = "tags", required = false) List<String> tags,
            Principal principal) {
        LocalDate fromDate = (from != null) ? LocalDate.parse(from) : LocalDate.now().minusDays(30);
        LocalDate toDate = (to != null) ? LocalDate.parse(to) : LocalDate.now();

        if (!view.equalsIgnoreCase("monthly") && !view.equalsIgnoreCase("yearly")) {
            throw new IllegalArgumentException("View must be 'monthly' or 'yearly'");
        }

        return expenseService.getBarChartData(fromDate, toDate, tags, view, principal);
    }

}
