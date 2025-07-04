package com.backendvspend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test") // ✅ Activate test profile during CI
class BackendVspendApplicationTests {

	@Test
	void contextLoads() {
	}

}
