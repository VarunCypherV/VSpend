package com.backendvspend.repository;

import com.backendvspend.model.Tag;
import com.backendvspend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
    List<Tag> findByUser(User user);
    Optional<Tag> findByIdAndUser(Long id, User user);
    Optional<Tag> findByNameIgnoreCase(String name); // can keep this if needed elsewhere
    Optional<Tag> findByNameIgnoreCaseAndUser(String name, User user); // ✅ Add this
}
