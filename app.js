import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔐 A TE Firebase adataid:
const firebaseConfig = {
  apiKey: "AIzaSyBDNfbKRe9IBAnTKHoSGj06dWULk3i_kag",
  authDomain: "segitsegkozpont.firebaseapp.com",
  projectId: "segitsegkozpont",
  storageBucket: "segitsegkozpont.appspot.com",
  messagingSenderId: "910810037566",
  appId: "1:910810037566:web:3022ce930951c5d61b406f",
  measurementId: "G-T6PQ7DNVHS"
};

// 🔧 Firebase inicializálása
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 💾 Regisztráció kezelése
document.getElementById("submitTeam").addEventListener("click", async () => {
  const teamName = document.getElementById("teamName").value.trim();
  const member1 = document.getElementById("member1").value.trim();
  const member2 = document.getElementById("member2").value.trim();
  const member3 = document.getElementById("member3").value.trim();
  const member4 = document.getElementById("member4").value.trim();

  if (!teamName || !member1) {
    alert("A csapatnév és legalább 1 csapattag megadása kötelező!");
    return;
  }

  try {
    await addDoc(collection(db, "teams"), {
      teamName,
      members: [member1, member2, member3, member4].filter(name => name !== "")
    });
    alert("Sikeres regisztráció!");
    document.getElementById("registrationForm").reset();
  } catch (e) {
    console.error("Hiba a mentésnél: ", e);
    alert("Hiba történt. Próbáld újra.");
  }
});

// 📋 Csapatlista betöltése (csak neked – admin mód)
async function loadTeams() {
  const listDiv = document.getElementById("teamList");
  if (!listDiv) return;

  listDiv.innerHTML = "<p>Betöltés...</p>";

  try {
    const querySnapshot = await getDocs(collection(db, "teams"));
    let html = "<h2>Nevezett csapatok</h2>";
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      html += `<div style="margin-bottom: 20px;">
        <strong>Csapatnév:</strong> ${data.teamName}<br>
        <strong>Tagok:</strong> ${data.members.join(", ")}
      </div>`;
    });
    listDiv.innerHTML = html;
  } catch (e) {
    listDiv.innerHTML = "Hiba a csapatok betöltésekor.";
  }
}

// ⏱ Frissítés 30 másodpercenként
setInterval(loadTeams, 30000);
window.addEventListener("load", loadTeams);
