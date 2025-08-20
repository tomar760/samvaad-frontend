// Firebase modular via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

// Your Firebase config (same जो पहले उपयोग किया था)
const firebaseConfig = {
  apiKey: "AIzaSyBIHeGBPieB4Q8hzYv-tmtRvxwHlY-8HiE",
  authDomain: "samvaad-7970b.firebaseapp.com",
  projectId: "samvaad-7970b",
  storageBucket: "samvaad-7970b.firebasestorage.app",
  messagingSenderId: "246840076262",
  appId: "1:246840076262:web:9458559ec7afa340541827"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(()=>{});

// Elements
const container = document.getElementById('container');
const loginMsg  = document.getElementById('login-msg');
const signupMsg = document.getElementById('signup-msg');

const loginEmail = document.getElementById('login-email');
const loginPass  = document.getElementById('login-pass');
const loginBtn   = document.getElementById('login-btn');
const forgotLink = document.getElementById('forgot-link');

const suName  = document.getElementById('su-name');
const suEmail = document.getElementById('su-email');
const suPass  = document.getElementById('su-pass');
const signupBtn = document.getElementById('signup-btn');

function show(el, text, ok=false) {
  el.style.display = 'block';
  el.textContent = text;
  el.style.color = ok ? '#065f46' : '#b91c1c';
}
function hide(el) { el.style.display = 'none'; }

loginBtn?.addEventListener('click', async () => {
  hide(loginMsg);
  try {
    const email = loginEmail.value.trim();
    const pass  = loginPass.value;
    if (!email || !pass) return show(loginMsg, 'Enter email and password');
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    show(loginMsg, `Welcome back, ${cred.user.displayName || 'user'}!`, true);
    // Redirect बाद में:
    // window.location.href = '/dashboard.html';
  } catch (e) {
    show(loginMsg, human(e));
  }
});

signupBtn?.addEventListener('click', async () => {
  hide(signupMsg);
  try {
    const name = suName.value.trim();
    const email = suEmail.value.trim();
    const pass  = suPass.value;
    if (!name || !email || !pass) return show(signupMsg, 'All fields required');
    if (pass.length < 6) return show(signupMsg, 'Password must be at least 6 characters');
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });
    show(signupMsg, 'Account created. You can sign in now.', true);
    container.classList.remove('active'); // switch to login
    loginEmail.value = email;
  } catch (e) {
    show(signupMsg, human(e));
  }
});

forgotLink?.addEventListener('click', async () => {
  hide(loginMsg);
  try {
    const email = loginEmail.value.trim();
    if (!email) return show(loginMsg, 'Enter your email to reset password');
    await sendPasswordResetEmail(auth, email);
    show(loginMsg, 'Password reset email sent. Check your inbox.', true);
  } catch (e) {
    show(loginMsg, human(e));
  }
});

onAuthStateChanged(auth, (user) => {
  // logged-in state handle later
});

function human(e) {
  const code = e?.code || '';
  if (code.includes('auth/invalid-email')) return 'Invalid email format';
  if (code.includes('auth/user-not-found')) return 'No account exists for this email';
  if (code.includes('auth/wrong-password')) return 'Incorrect password';
  if (code.includes('auth/email-already-in-use')) return 'Email already registered';
  if (code.includes('auth/too-many-requests')) return 'Too many attempts. Try later';
  return e?.message || 'Something went wrong';
}
