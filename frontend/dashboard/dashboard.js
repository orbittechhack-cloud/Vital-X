/* =======================
   LOGOUT
======================= */
function logout() {
    localStorage.clear();
    window.location.href = "../auth/login.html";
}

/* =======================
   HIDE MENSTRUATION (DEMO)
======================= */
// later: read from saved profile
const isFemale = true;

document.addEventListener("DOMContentLoaded", () => {
    if (!isFemale) {
        const womenNav = document.getElementById("womenNav");
        if (womenNav) womenNav.style.display = "none";
    }
});

/* =======================
   SAVE USER DETAILS
======================= */
function saveUserDetails() {
    const fullNameInput = document.getElementById("fullName");
    if (!fullNameInput) return true;

    const userData = {
        fullName: fullNameInput.value.trim()
    };

    localStorage.setItem("user", JSON.stringify(userData));
    return true;
}

/* =======================
   LAST UPDATED TIME
======================= */
function setLastUpdated() {
    const el = document.getElementById("lastUpdated");
    if (!el) return;

    const now = new Date();
    const formatted = now.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
    });

    el.textContent = `Last updated: ${formatted}`;
}

/* =======================
   HEALTH STATUS MESSAGE
======================= */
function setHealthStatus() {
    const statusEl = document.getElementById("healthStatus");
    if (!statusEl) return;

    // demo values
    const lungDamage = 42;
    const riskScore = 36;

    let message = "Your overall health looks stable.";

    if (lungDamage > 40) {
        message = "Your lungs need attention today.";
    } else if (riskScore > 50) {
        message = "You have an elevated health risk today.";
    }

    statusEl.textContent = message;
}

/* =======================
   OPEN DETAIL PAGE
======================= */
function openDetail(type) {
    if (type === "calories") {
        window.location.href =
            "pages/calorie-calculator/calorie-calculator.html";
        return;
    }

    // fallback (future pages)
    window.location.href = `pages/${type}/${type}.html`;
}

/* =======================
   HEALTH SCORE CALCULATION
======================= */
function calculateHealthScore() {
    const heart = 28;
    const lungs = 42;
    const brain = 18;
    const risk = 36;

    const avgDamage = (heart + lungs + brain + risk) / 4;
    let healthScore = Math.round(100 - avgDamage);
    healthScore = Math.max(0, Math.min(100, healthScore));

    const scoreEl = document.getElementById("healthScore");
    if (!scoreEl) return;

    scoreEl.textContent = `${healthScore} / 100`;

    if (healthScore >= 70) {
        scoreEl.style.color = "#22c55e";
    } else if (healthScore >= 40) {
        scoreEl.style.color = "#facc15";
    } else {
        scoreEl.style.color = "#ef4444";
    }

    updateAISuggestions(healthScore);
}

/* =======================
   AI SUGGESTIONS
======================= */
function updateAISuggestions(score) {
    const aiBox = document.getElementById("aiInsights");
    if (!aiBox) return;

    let suggestions = [];

    if (score >= 70) {
        suggestions = [
            "✅ Your overall health looks stable.",
            "💧 Maintain hydration and balanced diet.",
            "🏃 Light exercise will improve recovery.",
            "😴 Keep a consistent sleep schedule."
        ];
    } else if (score >= 40) {
        suggestions = [
            "⚠️ Some health parameters need attention.",
            "🫁 Improve air quality exposure.",
            "🥗 Increase nutrient‑rich foods.",
            "🛌 Sleep quality directly impacts recovery."
        ];
    } else {
        suggestions = [
            "🚨 High health risk detected.",
            "🏥 Medical attention is recommended.",
            "🚭 Avoid smoking and alcohol.",
            "🧘 Reduce physical & mental stress."
        ];
    }

    aiBox.innerHTML = suggestions.map(s => `<p>• ${s}</p>`).join("");
}

/* =======================
   HEALTH TRENDS (DEMO)
======================= */
function renderHealthTrends() {
    const healthTrend = document.querySelector(".chart-placeholder");
    if (!healthTrend) return;

    const lastWeekScore = 64;
    const currentScore = 72;
    const diff = currentScore - lastWeekScore;

    const arrow = diff > 0 ? "📈" : "📉";

    healthTrend.innerHTML = `
    <p>${arrow} Health Score changed by <b>${Math.abs(diff)}</b> points</p>
    <p>Last Week: ${lastWeekScore}</p>
    <p>Today: ${currentScore}</p>
  `;
}

/* =======================
   CALORIES SYNC (FIXED)
======================= */
function updateDashboardCalories() {
    const calories = localStorage.getItem("dailyCalories");
    const el = document.getElementById("dashboardCalories");

    if (el && calories) {
        el.innerText = calories + " kcal";
    }
}

function goToCalories() {
    window.location.href =
        "pages/calorie-calculator/calorie-calculator.html";
}

/* =======================
   INIT
======================= */
document.addEventListener("DOMContentLoaded", () => {
    setLastUpdated();
    setHealthStatus();
    calculateHealthScore();
    renderHealthTrends();
    updateDashboardCalories();
});
