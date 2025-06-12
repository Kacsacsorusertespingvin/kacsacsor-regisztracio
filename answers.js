import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

window.uploadAnswers = async function () {
  const teamName = document.getElementById("teamName").value.trim();
  const accessCode = document.getElementById("accessCode").value.trim();
  const msg = document.getElementById("message");

  const a1 = document.getElementById("answer1").value;
  const a2 = document.getElementById("answer2").value;
  const a3 = document.getElementById("answer3").value;
  const a4 = document.getElementById("answer4").value;

  if (!teamName || !accessCode) {
    msg.textContent = "Töltsd ki a csapatnevet és a kódot!";
    return;
  }

  try {
    const teamDoc = await getDoc(doc(db, "csapatok", teamName));
    if (!teamDoc.exists()) {
      msg.textContent = "Nincs ilyen csapat!";
      return;
    }

    if (teamDoc.data().code !== accessCode) {
      msg.textContent = "Hibás kód!";
      return;
    }

    await setDoc(doc(db, "valaszok", teamName), {
      feladat1: a1,
      feladat2: a2,
      feladat3: a3,
      feladat4: a4
    });

    msg.textContent = "Válaszok sikeresen elmentve!";
  } catch (err) {
    msg.textContent = "Hiba történt: " + err.message;
  }
};
