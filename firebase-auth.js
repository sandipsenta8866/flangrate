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
const { serverTimestamp, arrayUnion } = firebase.firestore.FieldValue;

// --- DOM Elements ---
const authContainer = document.getElementById("auth-container");
const appContainer = document.getElementById("app-container");
const loginView = document.getElementById("login-view");

// --- State and Listeners ---
let currentMasterQuotationId = null;
let currentItemIndex = null;
let quotationsListener = null;
let allQuotations = [];
let activeStatusFilter = null;
let selectedMonth = "all";
let selectedYear = "all";

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
    const addModeBanner = document.getElementById("add-mode-banner");
    const addModeClientSpan = document.getElementById("add-mode-client");
    const itemPickerModal = document.getElementById("item-picker-modal");
    const itemPickerCloseBtn =
      itemPickerModal.querySelector(".modal-close-btn");
    const searchInput = document.getElementById("search-quotations-input");
    const monthFilter = document.getElementById("dashboard-month-filter");
    const yearFilter = document.getElementById("dashboard-year-filter");

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
      customModalConfirm = newConfirmBtn;

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
    itemPickerCloseBtn.addEventListener(
      "click",
      () => (itemPickerModal.style.display = "none")
    );

    function exitAllModes() {
      currentMasterQuotationId = null;
      currentItemIndex = null;
      mainClientName.disabled = false;
      mainClientMobile.disabled = false;
      addModeBanner.style.display = "none";
      saveQuotationBtn.textContent = "Save This Quotation";
      newQuotationBtn.style.display = "none";
      window.resetCalculator();
    }

    // --- Event Listeners ---
    logoutButton.addEventListener("click", () => {
      auth.signOut();
      exitAllModes();
    });

    searchInput.addEventListener("input", applyFilters);
    monthFilter.addEventListener("change", (e) => {
      selectedMonth =
        e.target.value === "all" ? "all" : parseInt(e.target.value, 10);
      applyFiltersAndUpdateDashboard();
    });
    yearFilter.addEventListener("change", (e) => {
      selectedYear =
        e.target.value === "all" ? "all" : parseInt(e.target.value, 10);
      applyFiltersAndUpdateDashboard();
    });

    document
      .getElementById("dashboard-draft")
      .addEventListener("click", () => toggleStatusFilter("Draft"));
    document
      .getElementById("dashboard-sent")
      .addEventListener("click", () => toggleStatusFilter("Sent"));
    document
      .getElementById("dashboard-approved")
      .addEventListener("click", () => toggleStatusFilter("Approved"));
    document
      .getElementById("dashboard-rejected")
      .addEventListener("click", () => toggleStatusFilter("Rejected"));

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
        "Are you sure you want to clear the form? Any unsaved changes will be lost.",
        exitAllModes
      );
    });

    saveQuotationBtn.addEventListener("click", () => {
      const clientName = mainClientName.value.trim();
      if (!clientName) {
        showCustomAlert("Please enter a client name before saving.");
        return;
      }

      const newItemData = window.getCalculatorState();

      if (currentMasterQuotationId && currentItemIndex !== null) {
        const docRef = db
          .collection("quotations")
          .doc(currentMasterQuotationId);
        db.runTransaction((transaction) => {
          return transaction.get(docRef).then((doc) => {
            if (!doc.exists) {
              throw "Document does not exist!";
            }

            let currentData = doc.data();
            if (!currentData.items) {
              currentData.items = [currentData];
            }
            currentData.items[currentItemIndex] = newItemData;
            transaction.update(docRef, { items: currentData.items });
          });
        })
          .then(() => {
            showCustomAlert("Product updated successfully!");
            exitAllModes();
          })
          .catch((error) => {
            console.error("Error updating product: ", error);
            showCustomAlert("Error updating product.");
          });
      } else if (currentMasterQuotationId) {
        const docRef = db
          .collection("quotations")
          .doc(currentMasterQuotationId);
        docRef
          .update({ items: arrayUnion(newItemData) })
          .then(() => {
            showCustomAlert(`Product added to quotation for ${clientName}.`);
            window.resetCalculator(true);
          })
          .catch((error) => {
            console.error("Error adding product: ", error);
            showCustomAlert("Error adding product.");
          });
      } else {
        const masterQuotationData = {
          clientName: clientName,
          clientMobile: mainClientMobile.value.trim(),
          createdAt: serverTimestamp(),
          userId: user.uid,
          status: "Draft",
          items: [newItemData],
        };

        db.collection("quotations")
          .add(masterQuotationData)
          .then(() => {
            showCustomAlert("New quotation saved successfully!");
            window.resetCalculator();
          })
          .catch((error) => {
            console.error("Error saving new quotation: ", error);
            showCustomAlert("Error saving new quotation.");
          });
      }
    });

    function loadSavedQuotations(userId) {
      if (quotationsListener) {
        quotationsListener();
      }
      quotationsListener = db
        .collection("quotations")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .onSnapshot(
          (snapshot) => {
            allQuotations = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            populateDateFilters();
            applyFiltersAndUpdateDashboard();
            searchInput.value = "";
          },
          (error) => {
            console.error("Error loading quotations:", error);
            document.getElementById("saved-quotations-list").innerHTML =
              "<p>Error loading quotations.</p>";
          }
        );
    }

    function populateDateFilters() {
      const years = [
        ...new Set(
          allQuotations
            .map((q) => q.createdAt?.toDate().getFullYear())
            .filter((y) => y)
        ),
      ];
      years.sort((a, b) => b - a);

      yearFilter.innerHTML = '<option value="all">All Years</option>';
      years.forEach((year) => {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
      });

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      monthFilter.innerHTML = '<option value="all">All Months</option>';
      monthNames.forEach((name, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = name;
        monthFilter.appendChild(option);
      });

      const currentYear = new Date().getFullYear();

      selectedYear = years.includes(currentYear) ? currentYear : "all";
      selectedMonth = "all";

      yearFilter.value = selectedYear;
      monthFilter.value = selectedMonth;
    }

    function renderQuotations(quotations) {
      const list = document.getElementById("saved-quotations-list");
      list.innerHTML = "";
      if (quotations.length === 0) {
        list.innerHTML = `<p>${
          searchInput.value ||
          activeStatusFilter ||
          selectedMonth !== "all" ||
          selectedYear !== "all"
            ? "No quotations match your filters."
            : "No saved quotations yet."
        }</p>`;
        return;
      }

      quotations.forEach((data) => {
        if (!data.items) {
          data = { ...data, items: [{ ...data }] };
        }
        const status = data.status || "Draft";

        const el = document.createElement("div");
        el.className = "quotation-item";

        const date = data.createdAt?.toDate().toLocaleString() || "No date";
        const totalAmount = data.items.reduce(
          (sum, item) => sum + (item.finalAmount || 0) * (item.quantity || 1),
          0
        );
        const formattedTotalAmount = window.inr
          ? window.inr(totalAmount, 0)
          : `₹${totalAmount}`;
        const clientMobile = data.clientMobile || "";
        const clientNameDisplay = clientMobile
          ? `${
              data.clientName || "No Client"
            } <span class="mobile-number">(${clientMobile})</span>`
          : `${data.clientName || "No Client"}`;

        const subItemsHtml = data.items
          .map((item, index) => {
            const formattedAmount = window.inr
              ? window.inr(item.finalAmount, 0)
              : `₹${item.finalAmount}`;
            const quantityText =
              item.quantity > 1 ? ` (Qty: ${item.quantity})` : "";
            return `
                    <div class="sub-item">
                        <div class="sub-item-info">
                            <strong>${item.productKey}</strong> - ${item.rowLabel}${quantityText}
                        </div>
                        <div class="sub-item-price-wrapper">
                            <span class="sub-item-price">${formattedAmount}</span>
                            <div class="sub-item-delete" data-index="${index}" title="Delete this item">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                            </div>
                        </div>
                    </div>
                `;
          })
          .join("");

        el.innerHTML = `
              <div class="quotation-item-header">
                <div class="client-info"> ${clientNameDisplay} </div>
                <span>${formattedTotalAmount}</span>
              </div>
              <div class="quotation-item-date">${date}</div>
              <div class="status-wrapper">
                <span class="status-pill status-${status.toLowerCase()}">${status}</span>
                <select class="status-select" data-doc-id="${data.id}">
                    <option value="Draft" ${
                      status === "Draft" ? "selected" : ""
                    }>Draft</option>
                    <option value="Sent" ${
                      status === "Sent" ? "selected" : ""
                    }>Sent</option>
                    <option value="Approved" ${
                      status === "Approved" ? "selected" : ""
                    }>Approved</option>
                    <option value="Rejected" ${
                      status === "Rejected" ? "selected" : ""
                    }>Rejected</option>
                </select>
              </div>
              <div class="quotation-sub-items">${subItemsHtml}</div>
              <div class="quotation-item-actions">
                <button class="btn btn-action load">Load / Update</button>
                <button class="btn btn-action add-item">Add Product</button>
                <button class="btn btn-action download">Download PDF</button>
                <button class="btn btn-action whatsapp">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                  </svg>
                  <span>Share</span>
                </button>
                <button class="btn btn-action delete">Delete All</button>
              </div>
            `;

        el.querySelector(".load").addEventListener("click", () =>
          handleLoadClick(data.id, data)
        );
        el.querySelector(".add-item").addEventListener("click", () =>
          enterAddMode(data.id, data)
        );
        el.querySelector(".download").addEventListener("click", () =>
          window.generateMultiItemPDF(data)
        );
        el.querySelector(".whatsapp").addEventListener("click", () =>
          shareOnWhatsApp(data)
        );
        el.querySelector(".delete").addEventListener("click", () =>
          deleteQuotation(data.id, data)
        );

        el.querySelectorAll(".sub-item-delete").forEach((deleteBtn) => {
          deleteBtn.addEventListener("click", () => {
            const itemIndex = parseInt(deleteBtn.dataset.index, 10);
            deleteSubItem(data.id, itemIndex, data);
          });
        });

        list.appendChild(el);
      });

      list.querySelectorAll(".status-select").forEach((select) => {
        select.addEventListener("change", (e) => {
          const docId = e.target.dataset.docId;
          const newStatus = e.target.value;
          updateQuotationStatus(docId, newStatus);
        });
      });
    }

    function applyFiltersAndUpdateDashboard() {
      updateDashboard();
      applyFilters();
    }

    function updateDashboard() {
      let quotesForDashboard = allQuotations;
      if (selectedYear !== "all") {
        quotesForDashboard = quotesForDashboard.filter(
          (q) => q.createdAt?.toDate().getFullYear() === selectedYear
        );
      }
      if (selectedMonth !== "all") {
        quotesForDashboard = quotesForDashboard.filter(
          (q) => q.createdAt?.toDate().getMonth() === selectedMonth
        );
      }

      const statuses = {
        Draft: { count: 0, total: 0 },
        Sent: { count: 0, total: 0 },
        Approved: { count: 0, total: 0 },
        Rejected: { count: 0, total: 0 },
      };

      quotesForDashboard.forEach((q) => {
        const status = q.status || "Draft";
        if (statuses.hasOwnProperty(status)) {
          statuses[status].count++;
          const quoteTotal = (q.items || []).reduce(
            (sum, item) => sum + (item.finalAmount || 0) * (item.quantity || 1),
            0
          );
          statuses[status].total += quoteTotal;
        }
      });

      document.querySelector(
        "#dashboard-draft .dashboard-card-value"
      ).textContent = statuses.Draft.count;
      document.querySelector(
        "#dashboard-draft .dashboard-card-total"
      ).textContent = window.inr ? window.inr(statuses.Draft.total, 0) : `₹0`;
      document.querySelector(
        "#dashboard-sent .dashboard-card-value"
      ).textContent = statuses.Sent.count;
      document.querySelector(
        "#dashboard-sent .dashboard-card-total"
      ).textContent = window.inr ? window.inr(statuses.Sent.total, 0) : `₹0`;
      document.querySelector(
        "#dashboard-approved .dashboard-card-value"
      ).textContent = statuses.Approved.count;
      document.querySelector(
        "#dashboard-approved .dashboard-card-total"
      ).textContent = window.inr
        ? window.inr(statuses.Approved.total, 0)
        : `₹0`;
      document.querySelector(
        "#dashboard-rejected .dashboard-card-value"
      ).textContent = statuses.Rejected.count;
      document.querySelector(
        "#dashboard-rejected .dashboard-card-total"
      ).textContent = window.inr
        ? window.inr(statuses.Rejected.total, 0)
        : `₹0`;
    }

    function toggleStatusFilter(status) {
      if (activeStatusFilter === status) {
        activeStatusFilter = null;
      } else {
        activeStatusFilter = status;
      }
      document
        .querySelectorAll(".dashboard-card")
        .forEach((card) => card.classList.remove("active"));
      if (activeStatusFilter) {
        document
          .getElementById(`dashboard-${status.toLowerCase()}`)
          .classList.add("active");
      }
      applyFilters();
    }

    function applyFilters() {
      let filtered = allQuotations;
      const searchTerm = searchInput.value.toLowerCase().trim();

      if (selectedYear !== "all") {
        filtered = filtered.filter(
          (q) => q.createdAt?.toDate().getFullYear() === selectedYear
        );
      }
      if (selectedMonth !== "all") {
        filtered = filtered.filter(
          (q) => q.createdAt?.toDate().getMonth() === selectedMonth
        );
      }
      if (activeStatusFilter) {
        filtered = filtered.filter(
          (q) => (q.status || "Draft") === activeStatusFilter
        );
      }
      if (searchTerm) {
        filtered = filtered.filter((q) => {
          const clientName = q.clientName.toLowerCase();
          const clientMobile = q.clientMobile || "";
          return (
            clientName.includes(searchTerm) || clientMobile.includes(searchTerm)
          );
        });
      }
      renderQuotations(filtered);
    }

    function updateQuotationStatus(docId, newStatus) {
      db.collection("quotations")
        .doc(docId)
        .update({ status: newStatus })
        .catch((error) => {
          console.error("Error updating status: ", error);
          showCustomAlert("Could not update status.");
        });
    }

    function shareOnWhatsApp(quotationData) {
      let clientMobile = quotationData.clientMobile || "";
      if (!clientMobile) {
        showCustomAlert("This client does not have a mobile number saved.");
        return;
      }
      let cleanedMobile = clientMobile.replace(/[^0-9]/g, "");
      if (cleanedMobile.length === 10) {
        cleanedMobile = "91" + cleanedMobile;
      } else if (
        cleanedMobile.startsWith("91") &&
        cleanedMobile.length === 12
      ) {
        // Correct format
      } else {
        showCustomAlert(
          "The saved mobile number is not in a valid 10 or 12-digit format for WhatsApp."
        );
        return;
      }

      const clientName = quotationData.clientName || "there";
      const message = encodeURIComponent(
        `Hello ${clientName}, please find the attached quotation as requested. Thank you!`
      );
      const url = `https://wa.me/${cleanedMobile}?text=${message}`;
      window.open(url, "_blank");
    }

    function handleLoadClick(docId, quotationData) {
      if (quotationData.items.length === 1) {
        loadItemForUpdate(docId, 0, quotationData);
      } else {
        const pickerList = document.getElementById("item-picker-list");
        pickerList.innerHTML = "";
        quotationData.items.forEach((item, index) => {
          const itemEl = document.createElement("div");
          itemEl.className = "picker-item";
          const formattedAmount = window.inr
            ? window.inr(item.finalAmount, 0)
            : `₹${item.finalAmount}`;
          itemEl.innerHTML = `
                    <div class="picker-item-info">
                        <strong>${item.productKey}</strong> - ${item.rowLabel}
                        <div class="picker-item-price">${formattedAmount}</div>
                    </div>
                    <button class="btn btn-primary">Load</button>
                `;
          itemEl.querySelector("button").addEventListener("click", () => {
            loadItemForUpdate(docId, index, quotationData);
            itemPickerModal.style.display = "none";
          });
          pickerList.appendChild(itemEl);
        });
        itemPickerModal.style.display = "flex";
      }
    }

    function loadItemForUpdate(docId, itemIndex, quotationData) {
      currentMasterQuotationId = docId;
      currentItemIndex = itemIndex;
      const itemData = quotationData.items[itemIndex];
      window.restoreCalculatorState(itemData);

      mainClientName.value = quotationData.clientName;
      mainClientMobile.value = quotationData.clientMobile || "";
      modalClientName.value = quotationData.clientName;
      modalClientMobile.value = quotationData.clientMobile || "";
      mainClientName.disabled = true;
      mainClientMobile.disabled = true;
      addModeBanner.style.display = "none";
      saveQuotationBtn.textContent = "Update Product";
      newQuotationBtn.style.display = "inline-block";
      window.scrollTo(0, 0);
    }

    function enterAddMode(docId, quotationData) {
      exitAllModes();
      currentMasterQuotationId = docId;
      addModeClientSpan.textContent = quotationData.clientName;
      addModeBanner.style.display = "block";
      mainClientName.value = quotationData.clientName;
      mainClientMobile.value = quotationData.clientMobile || "";
      modalClientName.value = quotationData.clientName;
      modalClientMobile.value = quotationData.clientMobile || "";
      mainClientName.disabled = true;
      mainClientMobile.disabled = true;
      saveQuotationBtn.textContent = "Add Product to Quotation";
      newQuotationBtn.style.display = "inline-block";
      window.resetCalculator(true);
      window.scrollTo(0, 0);
    }

    function deleteSubItem(docId, itemIndex, quotationData) {
      const itemToDelete = quotationData.items[itemIndex];
      const message = `Are you sure you want to delete the product "${itemToDelete.productKey} - ${itemToDelete.rowLabel}" from this quotation?`;

      showCustomConfirm(message, () => {
        if (quotationData.items.length <= 1) {
          deleteQuotation(docId, quotationData, true);
        } else {
          const updatedItems = quotationData.items.filter(
            (_, index) => index !== itemIndex
          );
          db.collection("quotations")
            .doc(docId)
            .update({ items: updatedItems })
            .then(() => {
              showCustomAlert("Product removed from quotation.");
              if (
                currentMasterQuotationId === docId &&
                currentItemIndex === itemIndex
              ) {
                exitAllModes();
              }
            })
            .catch((error) => {
              console.error("Error removing product: ", error);
              showCustomAlert("Error removing product.");
            });
        }
      });
    }

    function deleteQuotation(docId, quotationData, isSubItemDelete = false) {
      const message = isSubItemDelete
        ? `This is the last product. Deleting it will remove the entire quotation for ${quotationData.clientName}. Continue?`
        : `Are you sure you want to delete the entire quotation for ${quotationData.clientName}? This will delete all ${quotationData.items.length} products and cannot be undone.`;

      showCustomConfirm(message, () => {
        db.collection("quotations")
          .doc(docId)
          .delete()
          .then(() => {
            showCustomAlert("Quotation deleted.");
            if (currentMasterQuotationId === docId) {
              exitAllModes();
            }
          })
          .catch((error) => {
            console.error("Error deleting quotation: ", error);
            showCustomAlert("Error deleting quotation.");
          });
      });
    }
  } else {
    // User is logged out
    authContainer.style.display = "flex";
    appContainer.style.display = "none";
    if (quotationsListener) {
      quotationsListener(); // Detach the listener
      quotationsListener = null;
    }
  }
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
