import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ⛔ IDE ÍRD BE A FIREBASE KONFIGODAT (amit a Firebase adott)
const firebaseConfig = {
  apiKey: "IDE ÍRD",
  authDomain: "IDE ÍRD",
  projectId: "IDE ÍRD",
  storageBucket: "IDE ÍRD",
  messagingSenderId: "IDE ÍRD",
  appId: "IDE ÍRD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// GOMBOK
document.getElementById("registerBtn").onclick = () => {
  document.getElementById("form").style.display = "block";
  document.getElementById("teams").style.display = "none";
};

document.getElementById("viewTeamsBtn").onclick = async () => {
  const password = prompt("Csak admin! Add meg a jelszót:");
  if (password !== "adminjelszo") return alert("Hozzáférés megtagadva");

  document.getElementById("form").style.display = "none";
  document.getElementById("teams").style.display = "block";

  const querySnapshot = await getDocs(collection(db, "csapatok"));
  const teamsList = document.getElementById("teamsList");
  teamsList.innerHTML = "";

  querySnapshot.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent = `${data.name} – ${data.member1}, ${data.member2}, ${data.member3}, ${data.member4}`;
    teamsList.appendChild(li);
  });
};

document.getElementById("submitBtn").onclick = async () => {
  const name = document.getElementById("teamName").value;
  const member1 = document.getElementById("member1").value;
  const member2 = document.getElementById("member2").value;
  const member3 = document.getElementById("member3").value;
  const member4 = document.getElementById("member4").value;

  if (!name || !member1) {
    document.getElementById("msg").textContent = "A csapatnév és az első tag kötelező!";
    return;
  }

  await addDoc(collection(db, "csapatok"), {
    name, member1, member2, member3, member4
  });

  document.getElementById("msg").textContent = "✅ Sikeresen regisztrálva!";
};
