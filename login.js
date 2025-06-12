import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
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
const auth = getAuth(app);

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("message");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    msg.textContent = "Sikeres bejelentkezés!";
    window.location.href = "admin.html";
  } catch (err) {
    msg.textContent = "Hiba: " + err.message;
  }
};
