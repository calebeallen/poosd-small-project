// const apiBase = "http://yourdomain.com/LAMPAPI";

// function logout() {
//   localStorage.removeItem("userId");
//   window.location.href = "index.html";
// }

// function addContact() {
//   let userId = localStorage.getItem("userId");
//   let name = document.getElementById("contactName").value;
//   let phone = document.getElementById("contactPhone").value;
//   let email = document.getElementById("contactEmail").value;
//   let address = document.getElementById("contactAddress").value;

//   let payload = { userId, name, phone, email, address };

//   fetch(apiBase + "/addContact.php", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload)
//   })
//   .then(res => res.json())
//   .then(response => {
//     alert("Contact added!");
//   });
// }

// function searchContacts() {
//   let userId = localStorage.getItem("userId");
//   let query = document.getElementById("searchQuery").value;

//   fetch(apiBase + "/searchContacts.php?userId=" + userId + "&query=" + encodeURIComponent(query))
//     .then(res => res.json())
//     .then(results => {
//       let list = document.getElementById("results");
//       list.innerHTML = "";
//       results.forEach(contact => {
//         let li = document.createElement("li");
//         li.textContent = contact.name + " - " + contact.phone;
//         list.appendChild(li);
//       });
//     });
// }

// js/contacts.js (mock version)
let mockContacts = [
    { id: 1, name: "John Doe", phone: "555-1234", email: "john@example.com" },
    { id: 2, name: "Jane Smith", phone: "555-5678", email: "jane@example.com" }
  ];
  
  function searchContacts() {
    let query = document.getElementById("searchQuery").value.toLowerCase();
    let results = mockContacts.filter(c => c.name.toLowerCase().includes(query));
  
    let list = document.getElementById("results");
    list.innerHTML = "";
    results.forEach(contact => {
      let li = document.createElement("li");
      li.textContent = contact.name + " - " + contact.phone;
      list.appendChild(li);
    });
  }
  
  function addContact() {
    let name = document.getElementById("contactName").value;
    let phone = document.getElementById("contactPhone").value;
    let email = document.getElementById("contactEmail").value;
  
    let newContact = { id: mockContacts.length + 1, name, phone, email };
    mockContacts.push(newContact);
  
    alert("Contact added (mock only)!");
  }
  