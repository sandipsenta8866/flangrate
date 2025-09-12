// This file handles all Firebase Authentication logic.
// It is a self-contained module and does not touch the calculator logic.

const authManager = (() => {
  // --- Firebase Configuration ---
  // IMPORTANT: Replace this with your own Firebase project configuration.
  const firebaseConfig = {
    apiKey: "AIzaSyDPZwrMKluvdjV8ljxEQgIid8dw7WIcnrE",
    authDomain: "flange-d0eb2.firebaseapp.com",
    projectId: "flange-d0eb2",
    storageBucket: "flange-d0eb2.firebasestorage.app",
    messagingSenderId: "733249151125",
    appId: "1:733249151125:web:2b64119accce4848edfb9c",
  };
  // --- Initialize Firebase ---
  let app;
  let auth;
  try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
  } catch (e) {
    console.error(
      "Firebase initialization failed. Please check your firebaseConfig object.",
      e
    );
    // Hide the auth feature if Firebase fails to load
    const authContainer = document.getElementById("auth-container");
    if (authContainer)
      authContainer.innerHTML =
        "<p style='color:var(--danger)'>Authentication is currently unavailable.</p>";
  }

  // --- DOM Elements ---
  const authContainer = document.getElementById("auth-container");
  const authModal = document.getElementById("auth-modal");
  const closeAuthModalBtn = document.getElementById("close-auth-modal");
  const authForm = document.getElementById("auth-form");
  const authEmailInput = document.getElementById("auth-email");
  const authPasswordInput = document.getElementById("auth-password");
  const authSubmitBtn = document.getElementById("auth-submit-btn");
  const authTitle = document.getElementById("auth-title");
  const authToggleLink = document.getElementById("auth-toggle-link");
  const authToggleText = document.getElementById("auth-toggle-text");
  const authError = document.getElementById("auth-error");

  let isLoginMode = true;

  // --- UI Update Functions ---
  const updateAuthUI = (user) => {
    if (user) {
      // User is signed in
      authContainer.innerHTML = `
        <span>Welcome, <strong>${user.email}</strong></span>
        <button id="logout-btn" class="btn btn-danger">Logout</button>
      `;
      document
        .getElementById("logout-btn")
        .addEventListener("click", handleLogout);
    } else {
      // User is signed out
      authContainer.innerHTML = `
        <span>You are not logged in.</span>
        <button id="login-signup-btn" class="btn btn-primary">Login / Sign Up</button>
      `;
      document
        .getElementById("login-signup-btn")
        .addEventListener("click", () => {
          authModal.style.display = "flex";
        });
    }
  };

  const toggleAuthMode = () => {
    isLoginMode = !isLoginMode;
    authTitle.textContent = isLoginMode ? "Login" : "Sign Up";
    authSubmitBtn.textContent = isLoginMode ? "Login" : "Sign Up";
    authToggleText.innerHTML = isLoginMode
      ? `Don't have an account? <a id="auth-toggle-link">Sign Up</a>`
      : `Already have an account? <a id="auth-toggle-link">Login</a>`;
    document
      .getElementById("auth-toggle-link")
      .addEventListener("click", toggleAuthMode);
    authError.textContent = "";
    authForm.reset();
  };

  // --- Event Handlers ---
  const handleAuthSubmit = (event) => {
    event.preventDefault();
    const email = authEmailInput.value;
    const password = authPasswordInput.value;
    authError.textContent = "";

    if (isLoginMode) {
      // Handle Login
      auth
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          authModal.style.display = "none";
          authForm.reset();
        })
        .catch((error) => {
          authError.textContent = error.message;
        });
    } else {
      // Handle Sign Up
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          authModal.style.display = "none";
          authForm.reset();
        })
        .catch((error) => {
          authError.textContent = error.message;
        });
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  // --- Initialization ---
  const init = () => {
    if (!auth) return; // Don't run if Firebase init failed

    closeAuthModalBtn.addEventListener("click", () => {
      authModal.style.display = "none";
      authForm.reset();
      authError.textContent = "";
    });

    authToggleLink.addEventListener("click", toggleAuthMode);
    authForm.addEventListener("submit", handleAuthSubmit);

    // Listen for authentication state changes
    auth.onAuthStateChanged((user) => {
      updateAuthUI(user);
    });
  };

  return {
    init: init,
  };
})();

// Initialize the module when the DOM is ready
document.addEventListener("DOMContentLoaded", authManager.init);
