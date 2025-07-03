// package com.backendvspend.controller;

// import com.backendvspend.model.Tag;
// import com.backendvspend.service.TagService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;

// import java.security.Principal;
// import java.util.List;

// @RestController
// @RequestMapping("/api/tags")
// public class TagController {

//     private final TagService tagService;

//     @Autowired
//     public TagController(TagService tagService) {
//         this.tagService = tagService;
//     }

//     @PostMapping("/add")
//     public void addTag(@RequestBody Tag tag, Principal principal) {
//         tagService.addTag(tag, principal);
//     }

//     @GetMapping("/all")
//     public List<Tag> getAllTags(Principal principal) {
//         return tagService.getAllTags(principal);
//     }

//     @DeleteMapping("/{id}")
//     public void deleteTag(@PathVariable Long id, Principal principal) {
//         tagService.deleteTag(id, principal);
//     }
// }
package com.backendvspend.controller;

import com.backendvspend.model.Tag;
import com.backendvspend.model.User;
import com.backendvspend.repository.TagRepository;
import com.backendvspend.repository.UserRepository;
import com.backendvspend.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tagService;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addTag(@RequestBody Tag tag, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Tag> existing = tagRepository.findByNameIgnoreCaseAndUser(tag.getName(), user);
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Tag already exists");
        }

        tag.setUser(user); // ✅ Assign user to the tag
        Tag saved = tagRepository.save(tag);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/all")
    public List<Tag> getAllTags(Principal principal) {
        return tagService.getAllTags(principal);
    }

    @DeleteMapping("/{id}")
    public void deleteTag(@PathVariable Long id, Principal principal) {
        tagService.deleteTag(id, principal);
    }
}
