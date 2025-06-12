import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

const teamListDiv = document.getElementById("teamList");

function renderTeam(teamName, data, answers) {
  const div = document.createElement("div");
  div.style.border = "1px solid #0f0";
  div.style.padding = "10px";
  div.style.margin = "10px";

  div.innerHTML = `
    <h3>${teamName}</h3>
    <p><strong>Csapattagok:</strong> ${data.tag1}, ${data.tag2}, ${data.tag3}, ${data.tag4}</p>
    <p><strong>Feladat 1:</strong> ${answers?.feladat1 || "Nincs"}<br>
       <strong>Feladat 2:</strong> ${answers?.feladat2 || "Nincs"}<br>
       <strong>Feladat 3:</strong> ${answers?.feladat3 || "Nincs"}<br>
       <strong>Feladat 4:</strong> ${answers?.feladat4 || "Nincs"}</p>
  `;
  teamListDiv.appendChild(div);
}

onAuthStateChanged(auth, async user => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const csapatokRef = collection(db, "csapatok");
  const csapatokSnap = await getDocs(csapatokRef);

  for (const docu of csapatokSnap.docs) {
    const teamName = docu.id;
    const data = docu.data();

    const answersSnap = await getDoc(doc(db, "valaszok", teamName));
    const answers = answersSnap.exists() ? answersSnap.data() : null;

    renderTeam(teamName, data, answers);
  }
});

window.logout = () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};
