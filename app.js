// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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
const auth = getAuth(app);

// Elemszintek
const registrationForm = document.getElementById('registrationForm');
const teamList = document.getElementById('teamList');
const adminLogin = document.getElementById('adminLogin');
const loginStatus = document.getElementById('loginStatus');

// Regisztrációs oldal megjelenítése
window.showRegistration = function () {
  registrationForm.classList.remove("hidden");
  teamList.classList.add("hidden");
}

// Csapatok megtekintése (csak bejelentkezés után)
window.showTeams = async function () {
  const user = auth.currentUser;
  if (!user) {
    loginStatus.textContent = "Előbb jelentkezz be adminként!";
    return;
  }
  registrationForm.classList.add("hidden");
  teamList.classList.remove("hidden");

  teamList.innerHTML = "<h3>Nevezett csapatok</h3>";

  const querySnapshot = await getDocs(collection(db, "teams"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    teamList.innerHTML += `<p><strong>${data.teamName}</strong>: ${data.member1}, ${data.member2}, ${data.member3}, ${data.member4}</p>`;
  });
}

// Csapat beküldése
const submitButton = document.getElementById("submitTeam");
submitButton.addEventListener("click", async () => {
  const teamName = document.getElementById("teamName").value;
  const member1 = document.getElementById("member1").value;
  const member2 = document.getElementById("member2").value;
  const member3 = document.getElementById("member3").value;
  const member4 = document.getElementById("member4").value;

  if (!teamName || !member1) {
    alert("Legalább a csapatnév és egy fő tag megadása kötelező.");
    return;
  }

  try {
    await addDoc(collection(db, "teams"), {
      teamName,
      member1,
      member2,
      member3,
      member4
    });
    alert("Sikeres regisztráció!");
    document.getElementById("teamName").value = "";
    document.getElementById("member1").value = "";
    document.getElementById("member2").value = "";
    document.getElementById("member3").value = "";
    document.getElementById("member4").value = "";
  } catch (e) {
    alert("Hiba történt a mentés során");
    console.error("Hiba:", e);
  }
});

// Admin login
window.login = function () {
  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      loginStatus.textContent = "Sikeres bejelentkezés.";
    })
    .catch((error) => {
      loginStatus.textContent = "Hibás bejelentkezési adatok.";
      console.error(error);
    });
}

