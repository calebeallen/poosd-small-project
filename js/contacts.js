// const apiBase = "http://ourdomain.com/LAMPAPI"; // Uncomment when backend is ready

let mockContacts = [
  { id: 1, name: "John Doe", phone: "555-1234", email: "john@example.com", address: "123 Main St" },
  { id: 2, name: "Jane Smith", phone: "555-5678", email: "jane@example.com", address: "456 Oak Ave" },
  { id: 3, name: "Bob Johnson", phone: "555-9012", email: "bob@example.com", address: "789 Pine Rd" }
];

let searchTimeout;

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

  // TODO: Replace with actual API call when backend is ready
  // const userId = localStorage.getItem("userId");
  // clearTimeout(searchTimeout);
  // searchTimeout = setTimeout(() => {
  //   fetch(apiBase + "/searchContacts.php?userId=" + userId + "&query=" + encodeURIComponent(query))
  //     .then(res => res.json())
  //     .then(results => {
  //       displayContacts(results);
  //     })
  //     .catch(error => {
  //       console.error("Search error:", error);
  //       displayContacts([]); // Show no results on error
  //     });
  // }, 300);

  // Mock search - remove when backend is ready
  const results = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(query) ||
    contact.phone.includes(query) ||
    contact.email.toLowerCase().includes(query) ||
    contact.address.toLowerCase().includes(query)
  );

  displayContacts(results);
}

function logout() {
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  window.location.href = "index.html";
}

function addContact() {
  const name = document.getElementById("contactName").value.trim();
  const phone = document.getElementById("contactPhone").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const address = document.getElementById("contactAddress").value.trim();

  if (!name) {
    alert("Name is required!");
    return;
  }

  if (email && !isValidEmail(email)) {
    alert("Please enter a valid email address!");
    return;
  }

  // TODO: Replace with actual API call when backend is ready
  // const userId = localStorage.getItem("userId");
  // const payload = { userId, name, phone, email, address };
  // fetch(apiBase + "/addContact.php", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload)
  // })
  // .then(res => res.json())
  // .then(response => {
  //   if (response.success) {
  //     clearForm();
  //     loadContacts(); // Refresh contact list
  //     showTemporaryMessage("Contact added successfully!", "success");
  //   } else {
  //     alert("Error adding contact. Please try again.");
  //   }
  // })
  // .catch(error => {
  //   alert("Error adding contact. Please try again.");
  // });

  // Mock add contact - remove when backend is ready
  const newContact = {
    id: mockContacts.length + 1,
    name,
    phone: phone || "Not provided",
    email: email || "Not provided",
    address: address || "Not provided"
  };

  mockContacts.push(newContact);
  clearForm();
  updateContactCount();
  
  liveSearchContacts();
  
  showTemporaryMessage("Contact added successfully!", "success");
}

function searchContacts() {
  liveSearchContacts();
}

function showAllContacts() {
  // TODO: Replace with actual API call when backend is ready
  // loadContacts();

  // Clear search input and show all contacts
  clearSearch();
}

// TODO: Add this function when backend is ready
// function loadContacts() {
//   const userId = localStorage.getItem("userId");
//   fetch(apiBase + "/getContacts.php?userId=" + userId)
//     .then(res => res.json())
//     .then(contacts => {
//       mockContacts = contacts; // Update local contacts
//       displayContacts(contacts);
//       updateContactCount();
//     })
//     .catch(error => {
//       alert("Error loading contacts. Please try again.");
//     });
// }

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

function editContact(id) {
  const contact = mockContacts.find(c => c.id === id);
  if (!contact) return;

  document.getElementById("contactName").value = contact.name;
  document.getElementById("contactPhone").value = contact.phone === "Not provided" ? "" : contact.phone;
  document.getElementById("contactEmail").value = contact.email === "Not provided" ? "" : contact.email;
  document.getElementById("contactAddress").value = contact.address === "Not provided" ? "" : contact.address;

  mockContacts = mockContacts.filter(c => c.id !== id);
  updateContactCount();
  
  liveSearchContacts();
}

function deleteContact(id) {
  if (!confirm("Are you sure you want to delete this contact?")) {
    return;
  }

  // TODO: Replace with actual API call when backend is ready
  // const payload = { contactId: id };
  // fetch(apiBase + "/deleteContact.php", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload)
  // })
  // .then(res => res.json())
  // .then(response => {
  //   if (response.success) {
  //     loadContacts(); // Refresh contact list
  //     showTemporaryMessage("Contact deleted successfully!", "success");
  //   } else {
  //     alert("Error deleting contact. Please try again.");
  //   }
  // })
  // .catch(error => {
  //   alert("Error deleting contact. Please try again.");
  // });

  // Mock delete contact - remove when backend is ready
  mockContacts = mockContacts.filter(contact => contact.id !== id);
  updateContactCount();
  
  liveSearchContacts();
  
  showTemporaryMessage("Contact deleted successfully!", "success");
}

function clearForm() {
  document.getElementById("contactName").value = "";
  document.getElementById("contactPhone").value = "";
  document.getElementById("contactEmail").value = "";
  document.getElementById("contactAddress").value = "";
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
  messageDiv.style.zIndex = "1000";
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