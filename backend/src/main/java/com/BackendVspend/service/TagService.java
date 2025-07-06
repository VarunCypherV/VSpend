package com.backendvspend.service;

import com.backendvspend.model.Tag;
import com.backendvspend.model.User;
import com.backendvspend.repository.TagRepository;
import com.backendvspend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Service
public class TagService {

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private UserRepository userRepository;

    public void addTag(Tag tag, Principal principal) {
        User user = getUser(principal);
        Optional<Tag> existing = tagRepository.findByNameIgnoreCaseAndUser(tag.getName(), user);
        if (existing.isPresent()) {
            throw new RuntimeException("Tag already exists");
        }
        tag.setUser(user);
        tagRepository.save(tag);
    }


    public List<Tag> getAllTags(Principal principal) {
        User user = getUser(principal);
        return tagRepository.findByUser(user);
    }

    public void deleteTag(Long id, Principal principal) {
        User user = getUser(principal);
        tagRepository.findByIdAndUser(id, user).ifPresent(tagRepository::delete);
    }

    private User getUser(Principal principal) {
        return userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
