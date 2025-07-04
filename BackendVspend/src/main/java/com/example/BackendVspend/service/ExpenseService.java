package com.backendvspend.service;

import com.backendvspend.dto.ExpenseRequest;
import com.backendvspend.model.Expense;
import com.backendvspend.model.Tag;
import com.backendvspend.model.User;
import com.backendvspend.repository.ExpenseRepository;
import com.backendvspend.repository.TagRepository;
import com.backendvspend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TagRepository tagRepository;

    public void addExpense(ExpenseRequest request, Principal principal) {
        User user = getUser(principal);

        Set<Tag> tagSet = new HashSet<>();
        if (request.getTags() != null) {
            for (String tagName : request.getTags()) {
                Tag tag = tagRepository.findByUser(user).stream()
                        .filter(t -> t.getName().equalsIgnoreCase(tagName))
                        .findFirst()
                        .orElse(null);

                if (tag != null) {
                    tagSet.add(tag);
                } else {
                    Tag newTag = Tag.builder()
                            .name(tagName)
                            .color("#cccccc")
                            .user(user)
                            .build();
                    tagSet.add(tagRepository.save(newTag));
                }
            }
        }

        Expense expense = Expense.builder()
                .title(request.getTitle())
                .amount(request.getAmount())
                .date(request.getDate())
                .user(user)
                .tags(tagSet)
                .build();

        expenseRepository.save(expense);
    }

    public List<Expense> getAllExpenses(Principal principal) {
        User user = getUser(principal);
        return expenseRepository.findByUser(user);
    }

    public List<Expense> filterExpenses(LocalDate from, LocalDate to, List<String> tagNames, Principal principal) {
        User user = getUser(principal);
        List<Expense> expenses = expenseRepository.findByUserAndDateBetween(user, from, to);

        if (tagNames == null || tagNames.isEmpty())
            return expenses;

        return expenses.stream()
                .filter(exp -> exp.getTags().stream()
                        .anyMatch(tag -> tagNames.contains(tag.getName())))
                .collect(Collectors.toList());
    }


    public Map<String, Double> getTagWiseTotal(
            Principal principal,
            LocalDate from,
            LocalDate to,
            List<String> tagNames) {
        User user = getUser(principal);
        List<Expense> expenses = expenseRepository.findByUserAndDateBetween(user, from, to);

        if (tagNames != null && !tagNames.isEmpty()) {
            expenses = expenses.stream()
                    .filter(exp -> exp.getTags().stream()
                            .anyMatch(tag -> tagNames.contains(tag.getName())))
                    .collect(Collectors.toList());
        }

        Map<String, Double> tagTotalMap = new HashMap<>();

        for (Expense expense : expenses) {
            for (Tag tag : expense.getTags()) {
                tagTotalMap.put(tag.getName(),
                        tagTotalMap.getOrDefault(tag.getName(), 0.0) + expense.getAmount());
            }
        }

        return tagTotalMap;
    }


    private User getUser(Principal principal) {
        return userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Map<String, Map<String, Double>> getBarChartData(
            LocalDate from,
            LocalDate to,
            List<String> tags,
            String view,
            Principal principal) {
        User user = getUser(principal);
        List<Expense> expenses = expenseRepository.findByUserAndDateBetween(user, from, to);

        if (tags != null && !tags.isEmpty()) {
            expenses = expenses.stream()
                    .filter(exp -> exp.getTags().stream().anyMatch(tag -> tags.contains(tag.getName())))
                    .collect(Collectors.toList());
        }

        Map<String, Map<String, Double>> result = new TreeMap<>(); // keeps chronological order

        for (Expense expense : expenses) {
            String groupKey = (view.equalsIgnoreCase("yearly"))
                    ? String.valueOf(expense.getDate().getYear())
                    : expense.getDate().getYear() + "-" + String.format("%02d", expense.getDate().getMonthValue());

            for (Tag tag : expense.getTags()) {
                result
                        .computeIfAbsent(groupKey, k -> new HashMap<>())
                        .merge(tag.getName(), expense.getAmount(), Double::sum);
            }
        }

        return result;
    }

}
