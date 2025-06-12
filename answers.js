import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBDNfbKRe9IBAnTKHoSGj06dWULk3i_kag",
  authDomain: "segitsegkozpont.firebaseapp.com",
  projectId: "segitsegkozpont",
  storageBucket: "segitsegkozpont.appspot.com",
  messagingSenderId: "910810037566",
  appId: "1:910810037566:web:3022ce930951c5d61b406f",
  measurementId: "G-T6PQ7DNVHS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Egyszerű hash függvény, ugyanaz mint regisztrációnál
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
}

// HTML elemek
const loginSection = document.getElementById("loginSection");
const loginBtn = document.getElementById("loginBtn");
const loginMsg = document.getElementById("loginMsg");

const answersForm = document.getElementById("answersForm");
const saveMsg = document.getElementById("saveMsg");

const answer1 = document.getElementById("answer1");
const answer2 = document.getElementById("answer2");
const answer3 = document.getElementById("answer3");
const answer4 = document.getElementById("answer4");

let currentTeam = null;

// Bejelentkezés kezelése
loginBtn.addEventListener("click", async () => {
  const teamName = document.getElementById("teamNameLogin").value.trim();
  const password = document.getElementById("passwordLogin").value;

  if (!teamName || !password) {
    loginMsg.textContent = "Kérlek, töltsd ki mindkét mezőt!";
    loginMsg.style.color = "red";
    return;
  }

  const teamRef = doc(db, "csapatok", teamName);
  const teamSnap = await getDoc(teamRef);

  if (!teamSnap.exists()) {
    loginMsg.textContent = "Ilyen csapatnév nem létezik!";
    loginMsg.style.color = "red";
    return;
  }

  const data = teamSnap.data();
  if (simpleHash(password) !== data.passwordHash) {
    loginMsg.textContent = "Hibás jelszó!";
    loginMsg.style.color = "red";
    return;
  }

  // Sikeres belépés
  loginMsg.textContent = `Sikeres bejelentkezés, ${teamName}!`;
  loginMsg.style.color = "lightgreen";

  currentTeam = teamName;
  loginSection.classList.add("hidden");
  answersForm.classList.remove("hidden");

  // Betöltjük a már mentett válaszokat (ha vannak)
  if (data.answers) {
    answer1.value = data.answers.answer1 || "";
    answer2.value = data.answers.answer2 || "";
    answer3.value = data.answers.answer3 || "";
    answer4.value = data.answers.answer4 || "";
  }
});

// Válaszok mentése
answersForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentTeam) return;

  const newAnswers = {
    answer1: answer1.value.trim(),
    answer2: answer2.value.trim(),
    answer3: answer3.value.trim(),
    answer4: answer4.value.trim(),
  };

  const teamRef = doc(db, "csapatok", currentTeam);
  await setDoc(teamRef, { answers: newAnswers }, { merge: true });

  saveMsg.textContent = "Válaszok sikeresen mentve!";
  saveMsg.style.color = "lightgreen";

  setTimeout(() => {
    saveMsg.textContent = "";
  }, 3000);
});
