package com.backendvspend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import com.backendvspend.repository.UserRepository;



@Service
public class NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    // @Async
    public void sendBudgetExceededEmail(String toEmail, double overAmount) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("⚠️ Budget Limit Exceeded - backendvspend");
        message.setText("You have exceeded your monthly budget by ₹" + overAmount +
                ".\n\nPlease review your expenses.");

        try {
            mailSender.send(message);
            System.out.println("✅ Email sent asynchronously to " + toEmail);
        } catch (Exception e) {
            System.err.println("❌ Email sending failed: " + e.getMessage());
        }
    }
}
