const apiBase = "http://spacecontacts.xyz/api"; 

function doLogin() {
  const username = document.getElementById("loginName").value.trim();
  const password = document.getElementById("loginPassword").value;
  
  clearFieldErrors(['loginName', 'loginPassword']);
  
  const errors = [];
  
  if (!username) {
    errors.push({ field: 'loginName', message: 'Username is required' });
  }
  
  if (!password) {
    errors.push({ field: 'loginPassword', message: 'Password is required' });
  }
  
  if (errors.length > 0) {
    showFieldErrors(errors);
    showMessage("loginResult", "Please fill in the required fields", "error");
    return;
  }

  const payload = { username: username, password: password };

  fetch(apiBase + "/Login.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(response => {
    if (response.status === "Success" && response.data.id > 0) {
      localStorage.setItem("userId", response.data.id);
      localStorage.setItem("username", response.data.username);
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

  clearMessages();
  clearFieldErrors(['signupName', 'signupEmail', 'signupPassword']);
  
  const errors = [];
  
  if (!username) {
    errors.push({ field: 'signupName', message: 'Username is required' });
  }
  
  if (!email) {
    errors.push({ field: 'signupEmail', message: 'Email is required' });
  } else if (!isValidEmail(email)) {
    errors.push({ field: 'signupEmail', message: 'Please enter a valid email address' });
  }
  
  if (!password) {
    errors.push({ field: 'signupPassword', message: 'Password is required' });
  }
  
  if (errors.length > 0) {
    showFieldErrors(errors);
    const errorMessages = errors.map(e => e.message).join(', ');
    showMessage("signupResult", errorMessages, "error");
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
     if (response.status === "Success") {
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
  clearFieldErrors(['signupName', 'signupEmail', 'signupPassword']);
}

function showSignup() {
  document.getElementById("loginDiv").classList.add("hidden");
  document.getElementById("signupForm").classList.remove("hidden");
  clearMessages();
  clearFieldErrors(['loginName', 'loginPassword']);
}

function clearMessages() {
  document.getElementById("loginResult").innerHTML = "";
  document.getElementById("signupResult").innerHTML = "";
}

function showMessage(elementId, message, type) {
  const element = document.getElementById(elementId);
  element.innerHTML = `<div class="message ${type}">${message}</div>`;
}

function showFieldErrors(errors) {
  errors.forEach(error => {
    const field = document.getElementById(error.field);
    if (field) {
      field.classList.add('error');
    }
  });
}

function clearFieldErrors(fieldIds) {
  fieldIds.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.classList.remove('error');
    }
  });
}

function addInputListeners() {
  const allInputs = ['loginName', 'loginPassword', 'signupName', 'signupEmail', 'signupPassword'];
  
  allInputs.forEach(inputId => {
    const input = document.getElementById(inputId);
    if (input) {
      input.addEventListener('input', function() {
        this.classList.remove('error');
      });
    }
  });
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
  addInputListeners();
});