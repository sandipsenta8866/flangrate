// --- IMPORTANT: Paste your Firebase config object here ---
const firebaseConfig = {
  apiKey: "AIzaSyDPZwrMKluvdjV8ljxEQgIid8dw7WIcnrE",
  authDomain: "flange-d0eb2.firebaseapp.com",
  projectId: "flange-d0eb2",
  storageBucket: "flange-d0eb2.firebasestorage.app",
  messagingSenderId: "733249151125",
  appId: "1:733249151125:web:2b64119accce4848edfb9c",
};

// --- Firebase Initialization ---
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- DOM Elements ---
const authContainer = document.getElementById("auth-container");
const appContainer = document.getElementById("app-container");
const loginView = document.getElementById("login-view");
const signupView = document.getElementById("signup-view");

// --- State for tracking loaded quotation ---
let currentQuotationId = null;

// --- Auth State Change Listener ---
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is logged in
    authContainer.style.display = "none";
    appContainer.style.display = "block";
    document.getElementById(
      "user-email"
    ).textContent = `Logged in as: ${user.email}`;
    loadSavedQuotations(user.uid);

    // --- Get Elements Accessible After Login ---
    const logoutButton = document.getElementById("logout-button");
    const saveQuotationBtn = document.getElementById("save-quotation-btn");
    const newQuotationBtn = document.getElementById("new-quotation-btn");
    const mainClientName = document.getElementById("main-client-name");
    const mainClientMobile = document.getElementById("main-client-mobile");
    const modalClientName = document.getElementById("clientName");
    const modalClientMobile = document.getElementById("clientMobile");

    // --- Custom Modal Helpers ---
    const customModal = document.getElementById("custom-modal");
    const customModalMessage = document.getElementById("custom-modal-message");
    const customModalOk = document.getElementById("custom-modal-ok");
    let customModalConfirm = document.getElementById("custom-modal-confirm");
    const customModalCancel = document.getElementById("custom-modal-cancel");

    function showCustomAlert(message) {
      customModalMessage.textContent = message;
      customModalOk.style.display = "inline-block";
      customModalConfirm.style.display = "none";
      customModalCancel.style.display = "none";
      customModal.style.display = "flex";
    }

    function showCustomConfirm(message, onConfirm) {
      customModalMessage.textContent = message;
      customModalOk.style.display = "none";
      customModalConfirm.style.display = "inline-block";
      customModalCancel.style.display = "inline-block";
      customModal.style.display = "flex";

      const newConfirmBtn = customModalConfirm.cloneNode(true);
      customModalConfirm.parentNode.replaceChild(
        newConfirmBtn,
        customModalConfirm
      );
      customModalConfirm = newConfirmBtn; // Update reference to the new button

      customModalConfirm.addEventListener(
        "click",
        () => {
          customModal.style.display = "none";
          onConfirm();
        },
        { once: true }
      );
    }

    customModalOk.addEventListener(
      "click",
      () => (customModal.style.display = "none")
    );
    customModalCancel.addEventListener(
      "click",
      () => (customModal.style.display = "none")
    );

    // --- Event Listeners ---
    logoutButton.addEventListener("click", () => {
      auth.signOut();
      currentQuotationId = null;
      saveQuotationBtn.textContent = "Save This Quotation";
      newQuotationBtn.style.display = "none";
    });

    mainClientName.addEventListener("input", (e) => {
      modalClientName.value = e.target.value;
    });
    modalClientName.addEventListener("input", (e) => {
      mainClientName.value = e.target.value;
    });
    mainClientMobile.addEventListener("input", (e) => {
      modalClientMobile.value = e.target.value;
    });
    modalClientMobile.addEventListener("input", (e) => {
      mainClientMobile.value = e.target.value;
    });

    newQuotationBtn.addEventListener("click", () => {
      showCustomConfirm(
        "Are you sure you want to clear the form and start a new quotation? Any unsaved changes will be lost.",
        () => {
          currentQuotationId = null;
          window.resetCalculator(); // This function is in app.js
          saveQuotationBtn.textContent = "Save This Quotation";
          newQuotationBtn.style.display = "none";
        }
      );
    });

    saveQuotationBtn.addEventListener("click", () => {
      const clientName = mainClientName.value.trim();
      if (!clientName) {
        showCustomAlert("Please enter a client name before saving.");
        return;
      }

      const calculatorState = window.getCalculatorState();
      const quotationData = {
        ...calculatorState,
        clientName: clientName, // Ensure the latest name is saved
        clientMobile: mainClientMobile.value.trim(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        userId: user.uid,
      };

      if (currentQuotationId) {
        // UPDATE existing quotation
        const docRef = db.collection("quotations").doc(currentQuotationId);
        docRef
          .update(quotationData)
          .then(() => {
            showCustomAlert("Quotation updated successfully!");
          })
          .catch((error) => {
            console.error("Error updating quotation: ", error);
            showCustomAlert("Error updating quotation.");
          });
      } else {
        // CREATE new quotation
        db.collection("quotations")
          .add(quotationData)
          .then((docRef) => {
            showCustomAlert("Quotation saved successfully!");
            // Automatically reset the form for the next quotation
            currentQuotationId = null;
            window.resetCalculator();
            saveQuotationBtn.textContent = "Save This Quotation";
            newQuotationBtn.style.display = "none";
          })
          .catch((error) => {
            console.error("Error saving quotation: ", error);
            showCustomAlert("Error saving quotation.");
          });
      }
    });

    function loadSavedQuotations(userId) {
      db.collection("quotations")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .onSnapshot(
          (snapshot) => {
            const list = document.getElementById("saved-quotations-list");
            list.innerHTML = "";
            if (snapshot.empty) {
              list.innerHTML = "<p>No saved quotations yet.</p>";
              return;
            }
            snapshot.forEach((doc) => {
              const data = doc.data();
              const el = document.createElement("div");
              el.className = "quotation-item";

              const date =
                data.createdAt?.toDate().toLocaleString() || "No date";
              const formattedAmount = data.finalAmount
                ? window.inr
                  ? window.inr(data.finalAmount, 0)
                  : `₹${data.finalAmount}`
                : "";

              el.innerHTML = `
              <div class="quotation-item-header">
                <span>${data.clientName || "No Client Name"}</span>
                <span>${formattedAmount}</span>
              </div>
              <div class="quotation-item-date">${date}</div>
              <div class="quotation-item-actions">
                <button class="btn-action load">Load</button>
                <button class="btn-action download">Download PDF</button>
                <button class="btn-action delete">Delete</button>
              </div>
            `;

              el.querySelector(".load").addEventListener("click", () =>
                loadQuotation(doc.id, data)
              );
              el.querySelector(".download").addEventListener("click", () =>
                downloadQuotationAsPDF(data)
              );
              el.querySelector(".delete").addEventListener("click", () =>
                deleteQuotation(doc.id)
              );

              list.appendChild(el);
            });
          },
          (error) => {
            console.error("Error loading quotations:", error);
            list.innerHTML = "<p>Error loading quotations.</p>";
          }
        );
    }

    function loadQuotation(docId, data) {
      window.restoreCalculatorState(data);
      currentQuotationId = docId;
      saveQuotationBtn.textContent = "Update This Quotation";
      newQuotationBtn.style.display = "inline-block";
      showCustomAlert("Quotation has been loaded into the calculator.");
      window.scrollTo(0, 0);
    }

    function deleteQuotation(docId) {
      showCustomConfirm(
        "Are you sure you want to delete this quotation? This cannot be undone.",
        () => {
          db.collection("quotations")
            .doc(docId)
            .delete()
            .then(() => {
              showCustomAlert("Quotation deleted.");
              if (currentQuotationId === docId) {
                newQuotationBtn.click(); // Reset the form if the deleted quote was loaded
              }
            })
            .catch((error) => {
              console.error("Error deleting quotation: ", error);
              showCustomAlert("Error deleting quotation.");
            });
        }
      );
    }

    function downloadQuotationAsPDF(data) {
      const tempState = window.getCalculatorState(); // Save current state
      window.restoreCalculatorState(data);
      document.getElementById("openShareModalBtn").click();
      const downloadBtn = document.getElementById("btnPDF");

      // Temporarily override the download button's click
      const originalDownloadClick = downloadBtn.onclick;
      downloadBtn.click(); // This now triggers handlePDF from app.js

      // After a short delay, restore the original state
      setTimeout(() => {
        document.querySelector("#shareModal .modal-close-btn").click();
        window.restoreCalculatorState(tempState);
      }, 1000);
    }
  } else {
    // User is logged out
    authContainer.style.display = "block";
    appContainer.style.display = "none";
  }
});

// --- UI Toggling for Login/Signup ---
document.getElementById("show-signup").addEventListener("click", () => {
  loginView.style.display = "none";
  signupView.style.display = "block";
});

document.getElementById("show-login").addEventListener("click", () => {
  signupView.style.display = "none";
  loginView.style.display = "block";
});

// --- Form Submissions ---
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = e.target["login-email"].value;
  const password = e.target["login-password"].value;
  auth.signInWithEmailAndPassword(email, password).catch((error) => {
    document.getElementById("login-error").textContent = error.message;
  });
});

document.getElementById("signup-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = e.target["signup-email"].value;
  const password = e.target["signup-password"].value;
  auth.createUserWithEmailAndPassword(email, password).catch((error) => {
    document.getElementById("signup-error").textContent = error.message;
  });
});
