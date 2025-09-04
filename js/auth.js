// const apiBase = "http://yourdomain.com/LAMPAPI"; // Uncomment when backend is ready

function doLogin() {
  const username = document.getElementById("loginName").value.trim();
  const password = document.getElementById("loginPassword").value;
  
  if (!username || !password) {
    showMessage("loginResult", "Please enter both username and password", "error");
    return;
  }

  const payload = { login: username, password: password };

  fetch(apiBase + "/Login.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(response => {
    if (response.id > 0) {
      localStorage.setItem("userId", response.id);
      localStorage.setItem("username", username);
      window.location.href = "dashboard.html";
    } else {
      showMessage("loginResult", "Login failed.", "error");
    }
  })
  .catch(error => {
    showMessage("loginResult", "Login error. Please try again.", "error");
  });
  
}

function doSignup() {
  const username = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  if (!username || !email || !password) {
    showMessage("signupResult", "Please fill in all fields", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showMessage("signupResult", "Please enter a valid email address", "error");
    return;
  }

  
   const payload = { username: username, email: email, password: password };
   fetch(apiBase + "/Register.php", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(payload)
   })
   .then(res => res.json())
   .then(response => {
     if (response.success) {
       showMessage("signupResult", "Account created successfully!", "success");
       setTimeout(() => {
         showLogin();
         document.getElementById("loginName").value = username;
       }, 1500);
     } else {
       showMessage("signupResult", "Signup failed. Please try again.", "error");
     }
   })
   .catch(error => {
     showMessage("signupResult", "Signup error. Please try again.", "error");
   });

  
}

function showLogin() {
  document.getElementById("signupForm").classList.add("hidden");
  document.getElementById("loginDiv").classList.remove("hidden");
  clearMessages();
}

function showSignup() {
  document.getElementById("loginDiv").classList.add("hidden");
  document.getElementById("signupForm").classList.remove("hidden");
  clearMessages();
}

function clearMessages() {
  document.getElementById("loginResult").innerHTML = "";
  document.getElementById("signupResult").innerHTML = "";
}

function showMessage(elementId, message, type) {
  const element = document.getElementById(elementId);
  element.innerHTML = `<div class="message ${type}">${message}</div>`;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    if (!document.getElementById("signupForm").classList.contains("hidden")) {
      doSignup();
    } else if (!document.getElementById("loginDiv").classList.contains("hidden")) {
      doLogin();
    }
  }
});