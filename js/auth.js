// const apiBase = "http://yourdomain.com/LAMPAPI"; // Change to your deployed API domain

// function doLogin() {
//   let login = document.getElementById("loginName").value;
//   let password = document.getElementById("loginPassword").value;

//   let payload = { login: login, password: password };

//   fetch(apiBase + "/login.php", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload)
//   })
//   .then(res => res.json())
//   .then(response => {
//     if (response.id > 0) {
//       localStorage.setItem("userId", response.id);
//       window.location.href = "dashboard.html";
//     } else {
//       document.getElementById("loginResult").innerText = "Login failed.";
//     }
//   });
// }

// function doSignup() {
//   let username = document.getElementById("signupName").value;
//   let email = document.getElementById("signupEmail").value;
//   let password = document.getElementById("signupPassword").value;

//   let payload = { username: username, email: email, password: password };

//   fetch(apiBase + "/register.php", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload)
//   })
//   .then(res => res.json())
//   .then(response => {
//     if (response.success) {
//       document.getElementById("signupResult").innerText = "Account created!";
//     } else {
//       document.getElementById("signupResult").innerText = "Signup failed.";
//     }
//   });
// }

// js/auth.js (mock version)
function doLogin() {
    window.location.href = "dashboard.html"; // skip real auth
  }
  
  function doSignup() {
    alert("Signup successful (mock)!");
  }
  