Frontier Notes
A full-stack, vibe-coded web application that allows users to create highly secure, self-destructing private notes, share them via encrypted links, and leverage AI to summarize the contents upon unlocking.

Core Features
Secure Creation: Generates a unique, cryptographically random URL and an untracked password for every note.

AI Integration: Utilizes Google's Gemini API on the backend to draft notes and generate concise summaries without compromising client-side security.

Auto-Destruction: Implements MongoDB TTL (Time-To-Live) indexes for automated note expiration (1 hour, 24 hours, or 7 days).

Modern UI: Built with React, Vite, and Tailwind CSS v4 for a premium, responsive dark-mode aesthetic.

Tech Stack
Frontend: React, Vite, Tailwind CSS v4, React Router, Axios, Lucide React.

Backend: Node.js, Express.js, Mongoose, Bcryptjs, @google/generative-ai.

Database: MongoDB Atlas.

Local Setup Instructions
1. Clone the repository

git clone 
cd

2. Backend Configuration

cd server
npm install

Create a .env file in the server directory with the following variables:

PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_google_gemini_api_key

Start the backend server:

npm run dev

3. Frontend Configuration
Open a new terminal window.

cd client
npm install

Start the frontend development server:

npm run dev

The application will be running at http://localhost:5173.

Potential Future Improvements
To scale this application for enterprise-level traffic and maximize security, the following architectural improvements would be implemented:

Client-Side End-to-End Encryption (E2EE): Currently, the backend handles the password hashing and decryption. Upgrading to AES-GCM encryption on the client side before transmission would ensure the database only ever stores ciphertexts, completely adhering to zero-knowledge architecture principles.

Advanced Rate Limiting & DDOS Protection: Integrating Redis to implement strict IP-based rate limiting on the /api/notes and /api/notes/:id/summarize endpoints. This prevents malicious actors from spamming the database or exhausting the AI API quotas.

Caching Layer for AI Summaries: Implementing an in-memory datastore (like Redis) to cache the AI-generated summaries. If multiple users unlock the same shared note and request a summary, the backend could serve the cached result instantly, reducing latency and saving API costs.

Comprehensive Integration Testing: Introducing a testing suite using Jest and Supertest to automatically validate API endpoints, payload validation, and database schema constraints during the CI/CD pipeline.