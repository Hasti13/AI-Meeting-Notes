# MeetScribe AI 

MeetScribe AI is an intelligent meeting intelligence dashboard that transforms raw conversation audio into structured, actionable insights effortlessly. Powered by Express, Multer, and the Google Gemini API, it provides a seamless web interface to upload meeting recordings and instantly receive structured payloads containing executive summaries, explicit action items, and strategic key insights.

---

## ✨ Features

* **Premium Drag-and-Drop Interface**: Built with modern CSS custom variables, providing an intuitive, interactive file collection dropzone.
* **Structured AI Diagnostics**: Leverages the official `@google/genai` SDK and `gemini-2.5-flash` to extract deterministic structured JSON conforming to a strict schema.
* **Smart Failure Backoff**: Includes automated network retry mechanisms targeting robust handling for temporary upstream 503 Service Unavailable rates.
* **Instant Dashboard Rendering**: Populates dynamic markdown-styled cards detailing:
  * 📝 **Executive Summary**: A concise breakdown of the meeting's core discussions.
  * 🎯 **Action Items**: Explicit, trackable tasks assigned dynamically.
  * 📌 **Key Insights**: High-level strategic takeaways.

---

## 🛠️ Tech Stack

### Frontend
* **HTML5 & CSS3** (Custom properties, grid layouts, and hardware-accelerated animations)
* **JavaScript** (Async/Await Fetch API, local event-driven state mutations)

### Backend
* **Node.js** with **Express** (v5.x web environment handles routing and asset streaming)
* **Multer** (Disk-storage caching for multi-part audio streams)
* **@google/genai SDK** (Interfaces cleanly with Google's structured JSON Generation Schema API)

---

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed on your machine:
* **Node.js** (>= 20.0.0 required by the Gemini SDK)
* **npm** (Node Package Manager)

1. **Clone the repository:**
```bash
   git clone (https://github.com/your-username/AI-Meeting-Notes.git)
   cd AI-Meeting-Notes
```
2. **Install the dependencies**
```bash
   git install
```
3. **Configure Environment Variables:** <br>
   Create a .env file in the root directory of the project and insert your Google Gemini API Key:
      GEMINI_API_KEY=your_actual_gemini_api_key_here

4. **Start the backend server:** 
```bash
   npm start
```
The application automatically mounts the static frontend pages alongside the processing gateway. Your server will be running live on: http://localhost:3000.

5. **Open the App:** <br>
Open your browser and navigate to http://localhost:3000 to interact with the dashboard. 

---

## 📸 Preview
<img width="1364" height="598" alt="image" src="https://github.com/user-attachments/assets/c16e408f-3e74-4270-9e9e-0ffae28d4d04" />
<img width="1365" height="596" alt="image" src="https://github.com/user-attachments/assets/006830f8-4be6-41a0-99cb-118aacad9a9b" />
<img width="1365" height="594" alt="image" src="https://github.com/user-attachments/assets/70237f25-d2d7-41e9-9846-781e4f355cb4" />

---
