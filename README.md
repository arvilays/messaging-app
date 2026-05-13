# 💬 Echo Messenger | Full-Stack Chat Application

![Echo Messenger Preview](./public/preview-1.png)

> A full-stack messaging application featuring secure JWT authentication, dynamic group conversations, and optimized real-time data synchronization.

**[🔴 View Live Demo](https://echo-messenger.netlify.app)** | **[🌐 View Developer Portfolio](https://vilay.dev)**

## 🚀 Tech Stack

* **Frontend:** React, React Router DOM v6, Vanilla CSS3
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL, Prisma ORM
* **Authentication:** Passport.js (JWT Strategy), Bcrypt.js
* **Deployment:** Netlify (Frontend), Render (Backend)

## 🎯 Core Features

* **Optimized Real-Time Polling:** Built a custom `usePolling` hook integrated with the Page Visibility API to fetch new messages automatically. Polling suspends when the user's browser tab is inactive, drastically reducing server load and unnecessary database queries.
* **Robust Authentication & Guest Mode:** Secure user registration with Bcrypt password hashing and JWTs. Includes a one-click "Guest Login" that dynamically generates a unique profile and populates the account with sample conversations and relationships.
* **Advanced Data Filtering:** Implemented server-side validation using `express-validator` alongside custom RegEx middleware to detect and block distorted text and filter profanity before it reaches the database.
* **Dynamic Group Chats:** Users can create private direct messages, add multiple participants to a single thread, and leave conversations dynamically. Also features a persistent "Global Chat" for all registered users.

## 🧠 Architecture & Challenges

**The Challenge:** Achieving real-time chat functionality using a REST API without resorting to WebSockets, while preventing excessive database querying that would severely impact server performance.

**The Solution:** Instead of re-fetching the entire conversation on every poll, I optimized the backend routes to accept timestamp cursors (`?since=`). The frontend tracks the `createdAt` timestamp of the latest message and only requests messages created *after* that time. For the sidebar, a separate lightweight endpoint (`/conversations/updates`) simply returns a boolean if any conversation has been modified, preventing heavy relational data queries (such as mapping the `User` model to the `Message` model) unless an update actually occurred.

## 🛠️ Local Setup

This project is split into a frontend and [backend](https://github.com/arvilays/messaging-app-api). You will need two terminal windows to run it locally.

### Backend Setup
1. **Clone the backend repository:**
    ```bash
    git clone https://github.com/arvilays/messaging-app-api.git
    ```

2. **Navigate to the backend directory:**
    ```bash
    cd messaging-app-api
    ```

3. **Install dependencies:**
    ```bash 
    npm install
    ```

4. **Initialize Database:**
    ```bash
    npx prisma init
    ```

5. **Environment Variables:** Create a .env file in the root and add your PostgreSQL connection string and JWT secret.
    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/echo_db"
    JWT_SECRET="your_secret_key"
    ```

5. **Start the backend server:**
   ```bash
   node --watch .\app.js
   ```

### Frontend Setup

1. **Clone the frontend repository:**
    ```bash
    git clone https://github.com/arvilays/messaging-app.git
    ```

2. **Navigate to the directory:**
    ```bash
    cd messaging-app
    ```

3. **Install dependencies:**
    ```bash 
    npm install
    ```

4. **Start the development server:**
    ```bash
    npm run dev
    ```

## 📷 Screenshots
![Echo Messenger Preview 2](./public/preview-2.png)
![Echo Messenger Preview 3](./public/preview-3.png)
![Echo Messenger Preview 4](./public/preview-4.png)