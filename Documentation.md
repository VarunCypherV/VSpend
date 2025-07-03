java -version : 18.0.2
mvn --version 3.9.10


BACKEND - SPRINGBOOT

Bootstrapping Spring - https://start.spring.io/
mvn spring-boot:run

PS D:\PROGRAMMING\_Development\Projects\VSpendTrack> cd BackendVspend
PS D:\PROGRAMMING\_Development\Projects\VSpendTrack\BackendVspend> mvn spring-boot:run  

add below to the pom.xml file - as it is responsible for restController etc

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
		
mvn spring-boot:run




FRONT END -  VITE reactjs

npm create vite@latest Frontend -- --template react 
cd Frontend
npm install
npm run dev


mysql

<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>