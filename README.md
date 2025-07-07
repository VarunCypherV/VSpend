# 💸 VSpendTrack - Personal Expense Tracker
Testing
VSpendTrack is a full-stack personal expense tracking application that allows users to:
- Add, view, and delete expenses
- Categorize expenses using tags
- Filter expenses by date and tag
- Visualize data using Pie and Bar charts
- Set monthly budgets and receive email alerts when close to the limit

---

## 🚀 Features

- 🔐 **User Authentication (JWT)**
- 📆 **Track Daily Expenses with Tags**
- 🧠 **Auto-Creates 'Others' Tag When None Selected**
- 📊 **Pie and Bar Charts by Date/Tag**
- 📩 **Budget Exceed Email Notification (Multithreaded)**
- ⚡ **Right-click to Delete an Expense**
- 🔁 **Live UI Updates Without Refresh**
- 🎨 **Modern UI with Styled Components**

---

## 🛠️ Tech Stack

### 📦 Backend – Spring Boot
- Java 17+
- Spring Boot 3
- Spring Security + JWT
- MySQL
- JPA (Hibernate)
- Multithreading (email alerts)

### 💻 Frontend – React
- React 18+
- Axios
- Styled Components
- React Toastify
- Chart.js (via `react-chartjs-2`)

---

## 📸 Screenshots

| Expense List | Add Expense + Tags | Pie & Bar Chart | Budget Warning |
|--------------|--------------------|------------------|----------------|
| ![](demo/expense-list.png) | ![](demo/add-expense.png) | ![](demo/charts.png) | ![](demo/budget-warning.png) |

---

## 🧪 Setup Instructions

### 📦 Backend (Spring Boot)

1. Clone the repo and navigate to the backend:
    ```bash
    git clone https://github.com/yourusername/VSpendTrack.git
    cd VSpendTrack/backend
    ```

2. Configure your MySQL credentials in `application.properties`:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/vspendtrack
    spring.datasource.username=your_mysql_user
    spring.datasource.password=your_mysql_password
    ```

3. Run the Spring Boot application:
    ```bash
    ./mvnw spring-boot:run
    ```

---

### 💻 Frontend (React)

1. Navigate to the frontend:
    ```bash
    cd VSpendTrack/frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the React app:
    ```bash
    npm run dev
    ```

4. App should now run at `http://localhost:5173`

---

## 📨 Email Notification Setup

- The app uses a mock/stubbed `NotificationService` by default.
- To enable real email:
  1. Configure SMTP properties (e.g. Gmail) in `application.properties`
  2. Update the `NotificationService` class with actual `JavaMailSender` logic

---

## 📌 Key Functionalities

| Feature | Description |
|--------|-------------|
| `Right-click Delete` | Right-click an expense row to delete |
| `Tag Manager` | Add or remove tags (scoped to user) |
| `Charts` | Pie and Bar chart with filters |
| `Budget Warning` | Receive email if monthly spend exceeds budget |
| `Auth` | JWT-based login and registration |
| `Multithreading` | Email notifications run asynchronously |

---


## 🐳 Dockerized Deployment (Recommended)

### 🔁 Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/)

### 🧱 Run App Anywhere (Using Docker Hub Images)

1. Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  backend:
    image: varunvetrivendan/vspendtrack-backend:latest
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/vspendtrack
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=
    depends_on:
      - db

  frontend:
    image: varunvetrivendan/vspendtrack-frontend:latest
    ports:
      - "5173:80"

  db:
    image: mysql:8
    environment:
      - MYSQL_DATABASE=vspendtrack
      - MYSQL_ALLOW_EMPTY_PASSWORD=yes
    ports:
      - "3306:3306"
```

Run it:

    docker-compose up -d


### ⚙️ GitHub Actions: Automated CI/CD & Releases

> **NOTE:** Every commit follows [Conventional Commits](https://www.conventionalcommits.org/) — like `feat:`, `fix:`, `chore:` etc.

#### 🔁 Release Workflow

- **Versioning:** Managed by `release-please` based on commit types:
  - `feat:` → bumps **minor** version (e.g. `0.2.0 → 0.3.0`)
  - `fix:`  → bumps **patch** version (e.g. `0.3.0 → 0.3.1`)
  - `BREAKING CHANGE:` → bumps **major** version (e.g. `0.3.1 → 1.0.0`)

- **Release Process:**
  1. A new release is automatically created on every qualifying commit to `master`
  2. The GitHub release title shows which component (frontend/backend) was changed
  3. Corresponding version tags are generated:  
     e.g. `frontend-v0.3.0`, `backend-v0.3.0`

#### 🐳 Docker Image Automation

- Every time a new version tag like `frontend-v*` or `backend-v*` is created ie automated by previous section:
  - GitHub Actions build a fresh Docker image for that component
  - The image is pushed to Docker Hub:
    - `vspendtrack-frontend:<version>` and `latest`
    - `vspendtrack-backend:<version>` and `latest`

You don’t need to manually tag or version bump anything — the entire CI/CD pipeline is automated from commit → release → Docker Hub 
