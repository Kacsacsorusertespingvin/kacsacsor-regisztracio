import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase config
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

const form = document.getElementById("regForm");
const msg = document.getElementById("message");

// Egyszerű hash függvény (nem kriptográfiailag erős, csak elrejti a jelszót)
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // 32bit integer
  }
  return hash.toString();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const teamName = form.teamName.value.trim();
  const tag1 = form.tag1.value.trim();
  const tag2 = form.tag2.value.trim();
  const tag3 = form.tag3.value.trim();
  const tag4 = form.tag4.value.trim();
  const password = form.password.value;

  if (!teamName || !tag1 || !tag2 || !tag3 || !tag4 || !password) {
    msg.textContent = "Kérlek tölts ki minden mezőt!";
    return;
  }

  // Ellenőrizni, hogy létezik-e már ez a csapatnév
  const teamDocRef = doc(db, "csapatok", teamName);
  const teamSnap = await getDoc(teamDocRef);

  if (teamSnap.exists()) {
    msg.textContent = "Ez a csapatnév már foglalt, kérlek válassz másikat!";
    return;
  }

  // Mentés Firestore-ba (jelszó hash-elve)
  await setDoc(teamDocRef, {
    tag1,
    tag2,
    tag3,
    tag4,
    passwordHash: simpleHash(password)
  });

  msg.style.color = "lightgreen";
  msg.textContent = `Sikeres regisztráció! Most már feltöltheted a válaszaidat.`;

  // Átirányítás válaszfeltöltő oldalra, átadva a csapat nevét
  setTimeout(() => {
    window.location.href = `answers.html?team=${encodeURIComponent(teamName)}`;
  }, 1500);
});

