# 📚 StudyMate AI

StudyMate AI is an intelligent, AI-powered web application designed to be a personal mentor for students. It combines an AI-driven roadmap generator with an interactive chat mentor to help users plan their learning journey and get instant help.

This project uses a Python/Flask backend (with no database) and a vanilla HTML, CSS, and JavaScript frontend.

## ✨ Key Features

* **User Authentication:** A secure (in-memory) user signup and login system.
* **AI Roadmap Generator:** Users can input their career and yearly goals, and the AI (powered by Groq) generates a detailed 12-month study plan.
* **AI Chat Mentor:** A real-time chat interface to ask the Groq AI questions, get explanations, and clear up doubts.
* **Modern UI:** A clean, responsive, and animated "glassmorphism" design.

## 🛠️ Tech Stack

* **Backend:** Python, Flask
* **AI API:** Groq (using the `llama-3.1-8b-instant` model)
* **Frontend:** HTML5, CSS3, JavaScript
* **Libraries:** `flask-cors`, `groq`

## 🚀 How to Run

### 1. Backend Setup

1.  **Install dependencies:**
    ```bash
    pip install flask flask-cors groq
    ```

2.  **Add API Key:**
    Open the `app.py` file and find this line:
    ```python
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "YOUR_GROQ_API_KEY_HERE")
    ```
    Paste your Groq API key inside the quotes.

3.  **Run the server:**
    ```bash
    python app.py
    ```
    The server will start on `http://127.0.0.1:5000`.

### 2. Frontend Setup

1.  **No setup required!**
2.  Open the `index.html` file in your favorite web browser.
3.  The app will connect to the running backend automatically.

---
