# Frontier Notes

A full-stack web application designed for creating highly secure, self-destructing private notes. It features secure sharing via encrypted links and leverages AI to provide concise summaries upon unlocking.

## Features
* **Secure Note Creation:** Generates a unique, cryptographically secure URL and an untracked password for every note.
* **Auto-Destruction (TTL):** Implements MongoDB Time-To-Live indexes for automated note expiration (1 hour, 24 hours, or 7 days).
* **AI Integration:** Utilizes Google's Gemini API on the backend to draft notes and generate bullet-point summaries without compromising client-side security.
* **Modern UI/UX:** Built with React, Vite, and Tailwind CSS, featuring a responsive, premium Glassmorphism aesthetic.
* **Unified Architecture:** Configured to serve the compiled frontend directly through the Express backend, eliminating CORS issues and allowing for a seamless single-service cloud deployment.

## Tech Stack
* **Frontend:** React, Vite, Tailwind CSS v4, React Router, Axios, Lucide React
* **Backend:** Node.js, Express.js, Mongoose, Bcrypt.js, @google/generative-ai
* **Database:** MongoDB Atlas

## Local Development Setup

### Prerequisites
* Node.js installed (v18+)
* A MongoDB Atlas cluster (or local MongoDB instance)
* A Google Gemini API Key

### 1. Clone the repository
git clone [https://github.com/your-username/frontier-notes.git](https://github.com/your-username/frontier-notes.git)
cd frontier-notes

Environment Variables
Create a .env file inside the server directory and add your credentials:

PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key

Install Dependencies
Run these commands from the root directory to install packages for both the backend and frontend:

npm install --prefix server
npm install --prefix client

Run the Application
Start the backend Express server:

npm run dev --prefix server

Open a new terminal window and start the Vite frontend development server:
npm run dev --prefix client
The application will be running locally at http://localhost:5173.

Deployment
This repository is configured for a unified deployment (e.g., on Render). The root package.json contains a master build script that installs all dependencies, compiles the React frontend, and serves it statically through the Node.js backend on a single domain.

Potential Future Improvements
To scale this application for enterprise-level traffic and maximize security, the following architectural improvements could be implemented:

Client-Side End-to-End Encryption (E2EE): Upgrading to AES-GCM encryption on the client side before transmission to ensure the database only ever stores ciphertexts, adhering strictly to zero-knowledge architecture principles.

Advanced Rate Limiting: Integrating Redis to implement strict IP-based rate limiting on the API endpoints to prevent brute-force decryption attacks and protect AI API quotas.

Caching Layer: Implementing an in-memory datastore (like Redis) to cache AI-generated summaries, reducing latency and saving external API costs on frequently accessed shared notes.