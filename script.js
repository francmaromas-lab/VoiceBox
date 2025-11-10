// Tabs
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    tabContents.forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// LocalStorage feedback
const form = document.getElementById("feedbackForm");
const status = document.getElementById("status");
const feedbackList = document.getElementById("feedbackList");
const loadBtn = document.getElementById("loadFeedback");
const clearBtn = document.getElementById("clearFeedback");

form.addEventListener("submit", e => {
  e.preventDefault();
  const category = document.getElementById("category").value;
  const message = document.getElementById("message").value.trim();
  const alias = document.getElementById("alias").value.trim() || "Anonymous";

  if (!message) {
    status.textContent = "Please write a message.";
    return;
  }

  // Save to localStorage
  const feedback = JSON.parse(localStorage.getItem("voicebox_feedback") || "[]");
  feedback.unshift({
    category,
    message,
    alias,
    time: new Date().toLocaleString()
  });
  localStorage.setItem("voicebox_feedback", JSON.stringify(feedback));

  status.textContent = "✅ Feedback sent!";
  form.reset();
});

// Load admin feedback
loadBtn.addEventListener("click", () => {
  const feedback = JSON.parse(localStorage.getItem("voicebox_feedback") || "[]");
  feedbackList.innerHTML = "";
  if (feedback.length === 0) {
    feedbackList.innerHTML = "<li>No feedback yet.</li>";
    return;
  }
  feedback.forEach(f => {
    const li = document.createElement("li");
    li.innerHTML = `
      <p><strong>${f.category}</strong> <em>(${f.time})</em></p>
      <p>${f.message}</p>
      <p><em>From: ${f.alias}</em></p>
    `;
    feedbackList.appendChild(li);
  });
});

// Clear all feedback
clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all feedback?")) {
    localStorage.removeItem("voicebox_feedback");
    feedbackList.innerHTML = "";
  }
});
