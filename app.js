// Firebase inicializálása
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  getFirestore, collection, addDoc, getDocs, query, where,
  updateDoc, doc, deleteDoc, serverTimestamp, orderBy
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// Utility: elemek elrejtése/mutatása
function showSection(id) {
  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// Gombok
document.getElementById("btnRegister").onclick = () => {
  showSection("registerSection");
};
document.getElementById("btnTeams").onclick = () => {
  showSection("teamsSection");
  loadTeams();
};
document.getElementById("btnAdminLogin").onclick = () => {
  showSection("adminSection");
  checkAdminAuth();
};

// Regisztráció
document.getElementById("registerBtn").onclick = async () => {
  const name = document.getElementById("teamName").value.trim();
  const members = [
    document.getElementById("member1").value.trim(),
    document.getElementById("member2").value.trim(),
    document.getElementById("member3").value.trim(),
    document.getElementById("member4").value.trim(),
  ];
  const password = document.getElementById("teamPassword").value;

  if (!name || members.some(m => !m) || !password) {
    alert("Kérlek, tölts ki minden mezőt!");
    return;
  }

  try {
    // Ellenőrzés, hogy nincs-e már ilyen csapatnév
    const teamsRef = collection(db, "teams");
    const q = query(teamsRef, where("name", "==", name));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      alert("Ez a csapatnév már foglalt!");
      return;
    }

    await addDoc(teamsRef, {
      name,
      members,
      password,
      solutions: [],
    });

    localStorage.setItem("teamName", name);

    alert(`Üdvözlünk titeket, ${name} csapat!`);
    document.getElementById("welcomeTeamName").textContent = name;
    showSection("uploadSection");

  } catch (e) {
    alert("Hiba történt: " + e.message);
  }
};

// Csapatok betöltése és listázása
async function loadTeams() {
  const list = document.getElementById("teamList");
  list.innerHTML = "";
  const snapshot = await getDocs(collection(db, "teams"));
  snapshot.forEach(docSnap => {
    const team = docSnap.data();
    const li = document.createElement("li");
    li.textContent = `${team.name}: ${team.members.join(", ")}`;
    list.appendChild(li);
  });
}

// Megoldások feltöltése (4 szám)
document.getElementById("submitSolutionsBtn").onclick = async () => {
  const solutions = [
    Number(document.getElementById("solution1").value),
    Number(document.getElementById("solution2").value),
    Number(document.getElementById("solution3").value),
    Number(document.getElementById("solution4").value),
  ];
  if (solutions.some(isNaN)) {
    alert("Kérlek, tölts ki minden megoldást számként!");
    return;
  }

  const teamName = localStorage.getItem("teamName");
  if (!teamName) {
    alert("Nem vagy bejelentkezve csapatként.");
    return;
  }

  try {
    const teamsRef = collection(db, "teams");
    const q = query(teamsRef, where("name", "==", teamName));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      alert("Csapat nem található!");
      return;
    }
    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, { solutions });
    alert("Megoldások feltöltve!");
  } catch (e) {
    alert("Hiba történt a mentés során: " + e.message);
  }
};

// Admin bejelentkezés
document.getElementById("adminLoginBtn").onclick = () => {
  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Admin bejelentkezve");
      loadAdminTeams();
      loadDeletionLogs();
    })
    .catch(e => alert("Hiba: " + e.message));
};

function checkAdminAuth() {
  onAuthStateChanged(auth, user => {
    if (user) {
      loadAdminTeams();
      loadDeletionLogs();
    }
  });
}

// Admin: csapatok betöltése + törlés
async function loadAdminTeams() {
  const list = document.getElementById("adminTeamList");
  list.innerHTML = "";
 

