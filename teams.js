// Firebase SDK importálása
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

// Csapatok betöltése
async function loadTeams() {
  const teamList = document.getElementById("teamList");
  teamList.innerHTML = "";

  try {
    const querySnapshot = await getDocs(collection(db, "csapatok"));
    if (querySnapshot.empty) {
      teamList.innerHTML = "<p>Nincs még benevezett csapat.</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const div = document.createElement("div");
      div.classList.add("teamCard");

      const members = data.members.map((m, i) => `<li>${i + 1}. ${m}</li>`).join("");

      div.innerHTML = `
        <h3>🏁 ${data.teamName}</h3>
        <ul>${members}</ul>
      `;
      teamList.appendChild(div);
    });
  } catch (err) {
    console.error("Hiba a csapatok betöltésénél:", err);
    teamList.innerHTML = "<p>Hiba történt az adatok betöltésekor.</p>";
  }
}

loadTeams();
setInterval(loadTeams, 30000);
