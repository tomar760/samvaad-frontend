import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

// Paste the exact config from Firebase (Step 3)
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

// Elements
const stepPhone = document.getElementById('step-phone');
const stepOtp = document.getElementById('step-otp');
const phoneInput = document.getElementById('phone');
const sendBtn = document.getElementById('sendBtn');
const verifyBtn = document.getElementById('verifyBtn');
const msg = document.getElementById('msg');
const ok = document.getElementById('ok');
const recaptchaContainerId = 'recaptcha-container';

// State
let confirmationResult = null;

// Helpers
function showError(e) {
  msg.style.display = 'block';
  msg.textContent = typeof e === 'string' ? e : (e?.message || 'Something went wrong');
  ok.style.display = 'none';
}
function showOk(t) {
  ok.style.display = 'block';
  ok.textContent = t;
  msg.style.display = 'none';
}
function setupRecaptcha() {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, { size: 'normal' });
  }
}

// Actions
sendBtn.addEventListener('click', async () => {
  try {
    const phone = phoneInput.value.trim();
    if (!/^\+?\d{10,15}$/.test(phone)) return showError('Enter valid phone with country code, e.g. +9198...');
    setupRecaptcha();
    confirmationResult = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
    stepPhone.style.display = 'none';
    stepOtp.style.display = 'block';
    showOk('OTP sent. Check SMS.');
  } catch (e) {
    showError(e);
  }
});

verifyBtn.addEventListener('click', async () => {
  try {
    const digits = Array.from(stepOtp.querySelectorAll('.otp input')).map(i => i.value).join('');
    if (digits.length !== 6) return showError('Enter 6-digit OTP');
    const result = await confirmationResult.confirm(digits);
    const user = result.user;
    showOk('Login success! UID: ' + user.uid);
    // TODO: later redirect -> window.location.href = '/dashboard.html';
  } catch (e) {
    showError(e);
  }
});

// Auto check
onAuthStateChanged(auth, (user) => {
  if (user) {
    showOk('Already signed in. UID: ' + user.uid);
  }
});
