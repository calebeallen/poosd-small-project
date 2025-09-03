// const apiBase = "http://ourdomain.com/LAMPAPI"; // Uncomment when backend is ready

function doLogin() {
  const username = document.getElementById("loginName").value.trim();
  const password = document.getElementById("loginPassword").value;
  
  if (!username || !password) {
    showMessage("loginResult", "Please enter both username and password", "error");
    return;
  }

  // TODO: Replace with actual API call when backend is ready
  // const payload = { login: username, password: password };
  // fetch(apiBase + "/login.php", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload)
  // })
  // .then(res => res.json())
  // .then(response => {
  //   if (response.id > 0) {
  //     localStorage.setItem("userId", response.id);
  //     localStorage.setItem("username", username);
  //     window.location.href = "dashboard.html";
  //   } else {
  //     showMessage("loginResult", "Login failed.", "error");
  //   }
  // })
  // .catch(error => {
  //   showMessage("loginResult", "Login error. Please try again.", "error");
  // });

  // Mock authentication - remove when backend is ready
  localStorage.setItem("userId", "1");
  localStorage.setItem("username", username);
  window.location.href = "dashboard.html";
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

  // TODO: Replace with actual API call when backend is ready
  // const payload = { username: username, email: email, password: password };
  // fetch(apiBase + "/register.php", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload)
  // })
  // .then(res => res.json())
  // .then(response => {
  //   if (response.success) {
  //     showMessage("signupResult", "Account created successfully!", "success");
  //     setTimeout(() => {
  //       showLogin();
  //       document.getElementById("loginName").value = username;
  //     }, 1500);
  //   } else {
  //     showMessage("signupResult", "Signup failed. Please try again.", "error");
  //   }
  // })
  // .catch(error => {
  //   showMessage("signupResult", "Signup error. Please try again.", "error");
  // });

  // Mock signup - remove when backend is ready
  showMessage("signupResult", "Account created successfully!", "success");
  setTimeout(() => {
    showLogin();
    document.getElementById("loginName").value = username;
  }, 1500);
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