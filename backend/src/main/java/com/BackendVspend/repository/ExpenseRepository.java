package com.backendvspend.repository;

import com.backendvspend.model.Expense;
import com.backendvspend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUser(User user);
    List<Expense> findByUserAndDateBetween(User user, LocalDate from, LocalDate to);

     @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user = :user AND e.date BETWEEN :start AND :end")
    Double sumAmountByUserAndDateBetween(
        @Param("user") User user,
        @Param("start") LocalDate start,
        @Param("end") LocalDate end
    );
}


