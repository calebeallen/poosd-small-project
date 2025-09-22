const apiBase = "http://137.184.94.213/api"; 

let mockContacts = [
  { id: 1, name: "John Doe", phone: "555-1234", email: "john@example.com", address: "123 Main St" },
  { id: 2, name: "Jane Smith", phone: "555-5678", email: "jane@example.com", address: "456 Oak Ave" },
  { id: 3, name: "Bob Johnson", phone: "555-9012", email: "bob@example.com", address: "789 Pine Rd" }
];

let searchTimeout;
let editingContactId = null;

function initializeDashboard() {
  const username = localStorage.getItem("username") || "User";
  document.getElementById("welcomeMessage").textContent = `Welcome, ${username}!`;
  updateContactCount();
  showAllContacts();
  setupLiveSearch();
}

function setupLiveSearch() {
  const searchInput = document.getElementById("searchQuery");
  const clearButton = document.getElementById("clearSearchBtn");
  
  searchInput.addEventListener("input", function() {
    const query = this.value.trim();
    
    toggleClearButton(query.length > 0);
    
    clearTimeout(searchTimeout);
    
    searchTimeout = setTimeout(() => {
      liveSearchContacts();
    }, 300);
  });

  searchInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      clearTimeout(searchTimeout);
      liveSearchContacts();
    }
  });

  searchInput.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      clearSearch();
    }
  });
}

function toggleClearButton(show) {
  const clearButton = document.getElementById("clearSearchBtn");
  if (show) {
    clearButton.classList.remove("hidden");
  } else {
    clearButton.classList.add("hidden");
  }
}

function clearSearch() {
  document.getElementById("searchQuery").value = "";
  toggleClearButton(false);
  displayContacts(mockContacts);
}

function liveSearchContacts() {
  const query = document.getElementById("searchQuery").value.toLowerCase().trim();

  if (!query) {
    displayContacts(mockContacts);
    return;
  }

  const userId = localStorage.getItem("userId");

  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetch(apiBase + "/SearchContact.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: userId,
        query: query
      })
    })
      .then(res => res.json())
      .then(results => {
        if (results.status === "Success") {
          displayContacts(results.data);
        } else {
          console.error("Search error:", results.err);
          displayContacts([]);
        }
      })
      .catch(error => {
        console.error("Fetch error:", error);
        displayContacts([]);
      });
  }, 300);
}

function logout() {
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  window.location.href = "index.html";
}

// Modal functions
function openAddModal() {
  clearAddForm();
  openModal('addModal');
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add('show');
  
  // Focus first input
  const firstInput = modal.querySelector('input');
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 100);
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('show');
  
  if (modalId === 'editModal') {
    editingContactId = null;
  }
}

// Contact management functions
function addContact() {
  const name = document.getElementById("addContactName").value.trim();
  const phone = document.getElementById("addContactPhone").value.trim();
  const email = document.getElementById("addContactEmail").value.trim();
  const address = document.getElementById("addContactAddress").value.trim();

  if (!name) {
    alert("Name is required!");
    return;
  }

  if (email && !isValidEmail(email)) {
    alert("Please enter a valid email address!");
    return;
  }

  const nameParts = name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

  const userId = localStorage.getItem("userId");
  const payload = { userId, firstName, lastName, email, phone };
  fetch(apiBase + "/AddContact.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(response => {
    if (response.status == "Success") {
      clearAddForm();
      loadContacts(); // Refresh contact list
      showTemporaryMessage("Contact added successfully!", "success");
    } else {
      alert("Error adding contact. Please try again.");
    }
  })
  .catch(error => {
    alert("Error adding contact. Please try again.");
  });
}

function editContact(id) {
  const contact = mockContacts.find(c => c.id === id);
  if (!contact) return;

  editingContactId = id;

  // Populate edit form
  document.getElementById("editContactName").value = contact.name;
  document.getElementById("editContactPhone").value = contact.phone === "Not provided" ? "" : contact.phone;
  document.getElementById("editContactEmail").value = contact.email === "Not provided" ? "" : contact.email;
  document.getElementById("editContactAddress").value = contact.address === "Not provided" ? "" : contact.address;

  openModal('editModal');
}

function updateContact() {
  if (!editingContactId) return;

  const name = document.getElementById("editContactName").value.trim();
  const phone = document.getElementById("editContactPhone").value.trim();
  const email = document.getElementById("editContactEmail").value.trim();
  const address = document.getElementById("editContactAddress").value.trim();

  if (!name) {
    alert("Name is required!");
    return;
  }

  if (email && !isValidEmail(email)) {
    alert("Please enter a valid email address!");
    return;
  }

  // TODO: Replace with actual API call when backend is ready
  // const payload = { contactId: editingContactId, name, phone, email, address };
  // fetch(apiBase + "/updateContact.php", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload)
  // })
  // .then(res => res.json())
  // .then(response => {
  //   if (response.success) {
  //     liveSearchContacts();
  //     closeModal('editModal');
  //     showTemporaryMessage("Contact updated successfully!", "success");
  //   } else {
  //     alert("Error updating contact. Please try again.");
  //   }
  // })
  // .catch(error => {
  //   alert("Error updating contact. Please try again.");
  // });

  // Mock update contact - remove when backend is ready
  const contactIndex = mockContacts.findIndex(c => c.id === editingContactId);
  if (contactIndex !== -1) {
    mockContacts[contactIndex] = {
      id: editingContactId,
      name,
      phone: phone || "Not provided",
      email: email || "Not provided",
      address: address || "Not provided"
    };

    liveSearchContacts();
    closeModal('editModal');
    showTemporaryMessage("Contact updated successfully!", "success");
  }
}

function searchContacts() {
  liveSearchContacts();
}

function showAllContacts() {
  loadContacts();
  // Clear search input and show all contacts
  clearSearch();
}

// TODO: Add this function when backend is ready
function loadContacts() {
  const userId = localStorage.getItem("userId");
  fetch(apiBase + "/GetAllContacts.php" ,{
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({userId: parseInt(userId,10)}) 
  })
    .then(res => res.json())
    .then(response => {
      if (response.status === "Success") {
        const contacts = response.data; 
        displayContacts(contacts);
        updateContactCount();
      } else {
        alert("Error loading contacts. Please try again.");
      }
    })
    .catch(error => {
      alert("Error loading contacts. Please try again.");
    });
}

function displayContacts(contacts) {
  const resultsList = document.getElementById("results");
  
  if (contacts.length === 0) {
    const query = document.getElementById("searchQuery").value.trim();
    if (query) {
      resultsList.innerHTML = `<p>No contacts found for "<strong>${query}</strong>".</p>`;
    } else {
      resultsList.innerHTML = "<p>No contacts found.</p>";
    }
    return;
  }

  resultsList.innerHTML = contacts.map(contact => `
    <div class="contact-item">
      <div class="contact-name">${highlightSearchTerm(contact.name)}</div>
      <div class="contact-details">
        <strong>Phone:</strong> ${highlightSearchTerm(contact.phone)}<br>
        <strong>Email:</strong> ${highlightSearchTerm(contact.email)}<br>
        <strong>Address:</strong> ${highlightSearchTerm(contact.address)}
      </div>
      <div class="contact-actions">
        <button class="btn-secondary" onclick="editContact(${contact.id})">
        Edit
        <img src="images/edit.png" alt="Edit" style="width:16px; height:16px; vertical-align: middle; filter: invert(1);">
        </button>
        <button class="btn-danger" onclick="deleteContact(${contact.id})">
        Delete
        <img src="images/trashcan.png" alt="Delete" style="width:16px; height:16px; vertical-align: middle; filter: invert(1);">
        </button>
      </div>
    </div>
  `).join("");
}

function highlightSearchTerm(text) {
  const query = document.getElementById("searchQuery").value.trim();
  if (!query || text === "Not provided") {
    return text;
  }
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function deleteContact(id) {
  if (!confirm("Are you sure you want to delete this contact?")) {
    return;
  }

  const userId = localStorage.getItem("userId");
  const payload = { userId: parseInt(userId), contactId: id };
  fetch(apiBase + "/DeleteContact.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(response => {
    if (response.status == "Success") {
      loadContacts(); // Refresh contact list
      showTemporaryMessage("Contact deleted successfully!", "success");
    } else {
      alert("Error deleting contact. Please try again.");
    }
  })
  .catch(error => {
    alert("Error deleting contact. Please try again.");
  });

}

function clearAddForm() {
  document.getElementById("addContactName").value = "";
  document.getElementById("addContactPhone").value = "";
  document.getElementById("addContactEmail").value = "";
  document.getElementById("addContactAddress").value = "";
}

function updateContactCount() {
  document.getElementById("contactCount").textContent = mockContacts.length;
}

function showTemporaryMessage(message, type) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  messageDiv.style.position = "fixed";
  messageDiv.style.top = "20px";
  messageDiv.style.right = "20px";
  messageDiv.style.zIndex = "2001";
  messageDiv.style.minWidth = "250px";
  messageDiv.style.textAlign = "center";
  
  document.body.appendChild(messageDiv);
  
  setTimeout(() => {
    if (document.body.contains(messageDiv)) {
      document.body.removeChild(messageDiv);
    }
  }, 3000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.addEventListener("DOMContentLoaded", function() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    window.location.href = "index.html";
    return;
  }
  
  initializeDashboard();
});

// Event listeners for modal functionality
document.addEventListener("click", function(e) {
  if (e.target.classList.contains('modal')) {
    closeModal(e.target.id);
  }
});

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    const openModal = document.querySelector('.modal.show');
    if (openModal) {
      closeModal(openModal.id);
    }
  }
});

let deathstarClicked = false;

function initializeDeathStar() {
  const deathstar = document.querySelector(".deathstar");
  
  if (deathstar) {
    deathstar.addEventListener("click", handleDeathStarClick);
  }
}

function handleDeathStarClick() {
  if (deathstarClicked) return;
  
  deathstarClicked = true;
  const deathstar = document.querySelector(".deathstar");
  
  const message = createTrapMessage();
  document.body.appendChild(message);
  
  setTimeout(() => {
    deathstar.classList.add("replaced");
    
    setTimeout(() => {
      deathstar.classList.add("fade");
      
      message.classList.add("fade-out");
      
      setTimeout(() => {
        if (document.body.contains(message)) {
          document.body.removeChild(message);
        }
        setTimeout(() => {
          if (document.body.contains(deathstar)) {
            deathstar.style.display = 'none';
          }
        }, 2000);
      }, 1000);
      
    }, 3000);
  }, 1500);
}

function createTrapMessage() {
  const messageDiv = document.createElement("div");
  messageDiv.className = "deathstar-message";
  messageDiv.textContent = "IT'S A TRAP!";
  
  return messageDiv;
}

document.addEventListener("DOMContentLoaded", function() {
  initializeDeathStar();
});