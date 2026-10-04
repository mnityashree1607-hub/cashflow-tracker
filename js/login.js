// Get elements
const loginForm = document.getElementById("loginForm");
const showPassword = document.getElementById("showPassword");
const password = document.getElementById("password");

// ===============================
// SHOW / HIDE PASSWORD
// ===============================

showPassword.addEventListener("click", function () {

    if (password.type === "password") {

        password.type = "text";
        showPassword.textContent = "🙈";

    } else {

        password.type = "password";
        showPassword.textContent = "👁";

    }

});


// ===============================
// LOGIN FORM
// ===============================

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email = document
        .getElementById("email")
        .value
        .trim();

    const passwordValue = password.value.trim();

    const emailError =
        document.getElementById("emailError");

    const passwordError =
        document.getElementById("passwordError");

    // Clear previous errors
    emailError.textContent = "";
    passwordError.textContent = "";

    let valid = true;


    // Check email
    if (email === "") {

        emailError.textContent =
            "Please enter your email.";

        valid = false;
    }


    // Check password
    if (passwordValue === "") {

        passwordError.textContent =
            "Please enter your password.";

        valid = false;

    } else if (passwordValue.length < 6) {

        passwordError.textContent =
            "Password must contain at least 6 characters.";

        valid = false;
    }


    // Stop if invalid
    if (!valid) {
        return;
    }


    // Save login status
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userEmail", email);


    // Login successful
    alert("Login successful!");


    // Go to Page 2 / Dashboard
    window.location.href = "index.html";

});