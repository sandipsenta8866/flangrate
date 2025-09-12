// This file handles all Firebase Firestore database operations.
// It is a self-contained module for saving and retrieving quotations.

const firestoreManager = (() => {
  // --- Initialize Firebase ---
  // Ensure Firebase app is initialized before accessing services
  if (!firebase.apps.length) {
    console.error("Firebase app has not been initialized yet.");
    return;
  }
  const db = firebase.firestore();
  let unsubscribeFromQuotations = null; // To stop listening for data when user logs out

  // --- UI Elements ---
  const myQuotationsContainer = document.getElementById(
    "my-quotations-container"
  );
  const myQuotationsList = document.getElementById("my-quotations-list");

  // --- Core Functions ---

  /**
   * Saves a quotation object to the currently logged-in user's collection.
   * @param {object} quotationData - The complete quotation object to save.
   */
  const saveQuotation = (quotationData) => {
    const user = firebase.auth().currentUser;
    if (!user) {
      alert("You must be logged in to save a quotation.");
      return;
    }

    // Add user ID and a timestamp to the data before saving
    const dataToSave = {
      ...quotationData,
      userId: user.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    // Use the user's UID to create a unique collection for their quotations
    db.collection("users")
      .doc(user.uid)
      .collection("quotations")
      .add(dataToSave)
      .then(() => {
        alert("Quotation saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving quotation: ", error);
        alert("Could not save quotation. Please try again.");
      });
  };

  /**
   * Renders the list of saved quotations into the UI.
   * @param {Array} quotations - An array of quotation documents from Firestore.
   */
  const renderQuotations = (quotations) => {
    if (!myQuotationsList) return;

    if (quotations.length === 0) {
      myQuotationsList.innerHTML =
        "<p>You have not saved any quotations yet.</p>";
      return;
    }

    // Sort quotations by date, newest first
    quotations.sort((a, b) => b.createdAt - a.createdAt);

    myQuotationsList.innerHTML = quotations
      .map((quote) => {
        const quoteDate = quote.createdAt
          ? new Date(quote.createdAt.seconds * 1000).toLocaleDateString()
          : "N/A";
        return `
        <div class="saved-quote-item">
          <div>
            <strong>${quote.clientName || "No Client"}</strong> - ${
          quote.productName
        } (${quote.templateName})
            <span style="font-size: 12px; color: var(--muted); display: block;">Saved on: ${quoteDate}</span>
          </div>
          <div style="font-weight: bold; font-size: 18px;">
            ${inr(quote.finalAmount, 0)}
          </div>
        </div>
      `;
      })
      .join("");
  };

  /**
   * Starts listening for real-time updates to the user's quotations.
   */
  const listenForQuotations = () => {
    const user = firebase.auth().currentUser;
    if (!user || !myQuotationsContainer) return;

    myQuotationsContainer.style.display = "block"; // Show the section

    const query = db
      .collection("users")
      .doc(user.uid)
      .collection("quotations")
      .orderBy("createdAt", "desc");

    // onSnapshot creates a real-time listener
    unsubscribeFromQuotations = query.onSnapshot(
      (snapshot) => {
        const quotations = [];
        snapshot.forEach((doc) => {
          quotations.push({ id: doc.id, ...doc.data() });
        });
        renderQuotations(quotations);
      },
      (error) => {
        console.error("Error fetching quotations: ", error);
      }
    );
  };

  /**
   * Stops listening for quotation updates and clears the UI.
   */
  const stopListeningForQuotations = () => {
    if (unsubscribeFromQuotations) {
      unsubscribeFromQuotations(); // Detach the listener
      unsubscribeFromQuotations = null;
    }
    if (myQuotationsContainer) myQuotationsContainer.style.display = "none"; // Hide the section
    if (myQuotationsList) myQuotationsList.innerHTML = ""; // Clear the list
  };

  return {
    saveQuotation,
    listenForQuotations,
    stopListeningForQuotations,
  };
})();
