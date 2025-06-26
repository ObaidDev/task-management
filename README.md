# 📋 Tasky Multi-Tenant Task Management Application

> A modern, multi-tenant task management solution built with Java Spring Boot backend and React frontend.

## 🧾 Description

**Tasky** is a **multi-tenant task management application** designed to help teams organize, assign, and track tasks across different organizations or departments. It supports user invitations, team collaboration, and full CRUD operations for tasks.

---

## 🚀 Features

- ✅ **Multi-Tenant Architecture** Isolated data per organization
- 👥 **User Invitation System** Invite coworkers via email
- 📝 **Task Management**
  - Create, Read, Update, Delete (CRUD)
  - Assign tasks to users
- 🔐 Built-in authentication & authorization using **Spring Security**
- 🛠️ Database migration managed via **Liquibase**
- 🖥️ Modern UI built with **React 18** + **Shadcn UI**

---

## ⚙️ Tech Stack

### Backend:
- **Java 17+**
- **Spring Boot**
- **Hibernate ORM**
- **Spring Security**
- **Liquibase**
- **PostgreSQL**

### Frontend:
- **React 18**
- **Shadcn UI**

### Infrastructure:
- **Docker** for containerization
- **Environment variables** for configuration

---

## 📦 Installation

```bash
# Step 1: Copy environment file
cp .env.example .env

# Step 2: Start the application using Docker
docker compose up -d
```

Once started:

- 🌐 Frontend : http://localhost:3000
- 📘 Swagger API Docs : http://localhost:8080/gw-tasks/swagger-ui/index.html#/

____________

### 🧪 Usage Instructions :
1. Sign Up Create an account and your tenant space.
2. Invite Coworkers Use the invitation system to add teammates.
3. Create Tasks Add new tasks, set due dates, priorities, and descriptions.
4. Assign Tasks Allocate tasks to specific users within your tenant.
5. Manage Tasks Edit or delete tasks as needed.

____________

### Screenshots :
![](/images/image1.png "Login page")
![](/images/image2.png "page users")
![](/images/image3.png "Tagify invtited Emails")
![](/images/image4.png "Page Tasks")
![](/images/image5.png "Create Task")
![](/images/image6.png "Create Task Alert")

