// Firebase SDK importálása
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// A te Firebase-konfigurációd
const firebaseConfig = {
  apiKey: "AIzaSyBDNfbKRe9IBAnTKHoSGj06dWULk3i_kag",
  authDomain: "segitsegkozpont.firebaseapp.com",
  projectId: "segitsegkozpont",
  storageBucket: "segitsegkozpont.appspot.com",
  messagingSenderId: "910810037566",
  appId: "1:910810037566:web:3022ce930951c5d61b406f",
  measurementId: "G-T6PQ7DNVHS"
};

// Inicializálás
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Űrlap beküldése
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const teamName = document.getElementById("teamName").value.trim();
  const member1 = document.getElementById("member1").value.trim();
  const member2 = document.getElementById("member2").value.trim();
  const member3 = document.getElementById("member3").value.trim();
  const member4 = document.getElementById("member4").value.trim();

  if (!teamName || !member1) {
    document.getElementById("status").textContent = "Kötelező a csapatnév és az első csapattag.";
    return;
  }

  try {
    await addDoc(collection(db, "csapatok"), {
      teamName,
      members: [member1, member2, member3, member4].filter(name => name !== ""),
      answers: {
        "Hangérzékelők": "",
        "Hőkamerák": "",
        "Kamerák": "",
        "Mozgásérzékelők": ""
      }
    });

    document.getElementById("status").textContent = "✅ Csapat sikeresen regisztrálva!";
    document.getElementById("registerForm").reset();
  } catch (error) {
    console.error("Hiba:", error);
    document.getElementById("status").textContent = "❌ Hiba történt a regisztrációnál.";
  }
});
