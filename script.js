// 🔥 Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

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

// Submit feedback
const form = document.getElementById("feedbackForm");
const status = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const category = document.getElementById("category").value;
  const message = document.getElementById("message").value.trim();
  const alias = document.getElementById("alias").value.trim() || "Anonymous";

  if (!message) {
    status.textContent = "Please write a message.";
    return;
  }

  try {
    await db.collection("feedback").add({
      category,
      message,
      alias,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    status.textContent = "✅ Feedback sent successfully!";
    form.reset();
  } catch (err) {
    console.error(err);
    status.textContent = "❌ Error sending feedback.";
  }
});

// Admin view
const loadBtn = document.getElementById("loadFeedback");
const list = document.getElementById("feedbackList");

loadBtn.addEventListener("click", async () => {
  list.innerHTML = "<li>Loading...</li>";
  try {
    const snapshot = await db.collection("feedback").orderBy("createdAt", "desc").get();
    list.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      const li = document.createElement("li");
      li.innerHTML = `
        <p><strong>${data.category}</strong></p>
        <p>${data.message}</p>
        <p><em>From: ${data.alias}</em></p>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    list.innerHTML = "<li>❌ Failed to load feedback.</li>";
  }
});
