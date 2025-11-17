const API_BASE_URL = "http://127.0.0.1:5000";
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn"); // For the form submit
const roadmapForm = document.getElementById("roadmap-form");
const chatInput = document.getElementById("chatInput");
const chatSendBtn = document.getElementById("chatSendBtn");

function checkAuth() {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        window.location.href = "index.html";
    }
    return token;
}

if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
        const u = document.getElementById("username").value;
        const p = document.getElementById("password").value;
        if (!u || !p) return alert("Please fill in all fields");

        try {
            loginBtn.textContent = "Logging in...";
            const res = await fetch(`${API_BASE_URL}/login`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: u, password: p })
            });
            const data = await res.json();
            if (data.status === "success") {
                localStorage.setItem("auth_token", data.auth_token);
                localStorage.setItem("username", data.username);
                window.location.href = "home.html";
            } else {
                alert(data.message);
            }
        } catch (e) { alert("Server error"); }
        loginBtn.textContent = "Login";
    });
}

const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const u = document.getElementById("newUsername").value;
        const p = document.getElementById("newPassword").value;

        try {
            const res = await fetch(`${API_BASE_URL}/signup`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: u, password: p })
            });
            const data = await res.json();
            if (data.status === "success") {
                localStorage.setItem("auth_token", data.auth_token);
                localStorage.setItem("username", data.username);
                window.location.href = "home.html";
            } else {
                alert(data.message);
            }
        } catch (e) { alert("Server error"); }
    });
}

if (document.getElementById("welcomeUser")) {
    const user = localStorage.getItem("username");
    if (!user) window.location.href = "index.html";
    // *** UPDATED THIS LINE ***
    document.getElementById("welcomeUser").textContent = user;
}

if (roadmapForm) {
    checkAuth();
    // Load existing plan on load
    fetchPlan();

    roadmapForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const btn = document.getElementById("generate-btn");
        const msg = document.getElementById("form-message");
        const token = localStorage.getItem("auth_token");

        btn.disabled = true;
        btn.textContent = "AI is Thinking...";
        msg.textContent = "Crafting your strategy...";

        try {
            const res = await fetch(`${API_BASE_URL}/generate_plan`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({
                    career_goal: document.getElementById("careerGoal").value,
                    yearly_goal: document.getElementById("yearlyGoal").value
                })
            });
            const data = await res.json();
            if (data.status === "success") {
                renderPlan(data.plan);
                msg.textContent = "";
            } else {
                msg.textContent = data.message;
            }
        } catch (err) { msg.textContent = "Error connecting to AI."; }
        
        btn.disabled = false;
        btn.textContent = "Regenerate Plan";
    });
}

async function fetchPlan() {
    const token = localStorage.getItem("auth_token");
    const username = localStorage.getItem("username");
    
    try {
        const res = await fetch(`${API_BASE_URL}/plans/${username}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.status === "success") renderPlan(data.plan);
    } catch (e) { console.log("No existing plan"); }
}

function renderPlan(plan) {
    const container = document.getElementById("roadmap-display");
    if (!container) return; // Guard clause
    container.innerHTML = ""; // Clear old
    
    let delay = 0;
    
    for (let i = 1; i <= 12; i++) {
        if (plan[i]) {
            const card = document.createElement("div");
            card.className = "month-card";
            card.style.animationDelay = `${delay}s`; // Staggered animation
            
            let listItems = plan[i].weekly.map(task => `<li>${task}</li>`).join("");
            
            card.innerHTML = `
                <h4>Month ${i}: ${plan[i].monthly_goal}</h4>
                <ul>${listItems}</ul>
            `;
            container.appendChild(card);
            delay += 0.1; // Increase delay for next card
        }
    }
}

if (chatInput) {
    checkAuth();
    const chatBox = document.getElementById("chat-box");

    function addMsg(text, sender) {
        const d = document.createElement("div");
        d.className = `msg ${sender}`;
        d.textContent = text;
        chatBox.appendChild(d);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function sendChat() {
        const txt = chatInput.value.trim();
        if(!txt) return;
        
        addMsg(txt, "user");
        chatInput.value = "";
        
        const loading = document.createElement("div");
        loading.className = "msg bot";
        loading.textContent = "Thinking...";
        chatBox.appendChild(loading);

        try {
            const res = await fetch(`${API_BASE_URL}/api/chat`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: txt })
            });
            const data = await res.json();
            chatBox.removeChild(loading);
            addMsg(data.bot_message, "bot");
        } catch (e) {
            chatBox.removeChild(loading);
            addMsg("Connection error.", "bot");
        }
    }

    chatSendBtn.addEventListener("click", sendChat);
    chatInput.addEventListener("keypress", (e) => { if(e.key==="Enter") sendChat(); });
}



function logout() {
    window.location.href = "logout.html";
}

// This logic runs *on* the logout.html page
if (document.getElementById("logout-page-identifier")) {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("username");
    
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1500);
}

