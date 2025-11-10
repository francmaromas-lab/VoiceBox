// Import Firebase SDK via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// 🔥 Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
    await addDoc(collection(db, "feedback"), {
      category,
      message,
      alias,
      createdAt: serverTimestamp(),
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
  const snap = await getDocs(collection(db, "feedback"));
  list.innerHTML = "";
  snap.forEach((doc) => {
    const data = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <p><strong>${data.category}</strong></p>
      <p>${data.message}</p>
      <p><em>From: ${data.alias}</em></p>
    `;
    list.appendChild(li);
  });
});
