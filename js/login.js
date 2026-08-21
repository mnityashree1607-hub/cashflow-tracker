const loginForm = document.getElementById("loginForm");

const showPassword = document.getElementById("showPassword");
const password = document.getElementById("password");

showPassword.addEventListener("click", function () {

    if (password.type === "password") {

        password.type = "text";
        showPassword.textContent = "🙈";

    } else {

        password.type = "password";
        showPassword.textContent = "👁";

    }

});


loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const passwordValue =
        password.value.trim();

    const emailError =
        document.getElementById("emailError");

    const passwordError =
        document.getElementById("passwordError");

    emailError.textContent = "";
    passwordError.textContent = "";

    let valid = true;


    if (email === "") {

        emailError.textContent =
            "Please enter your email.";

        valid = false;

    }


    if (passwordValue === "") {

        passwordError.textContent =
            "Please enter your password.";

        valid = false;

    }

    else if (passwordValue.length < 6) {

        passwordError.textContent =
            "Password must contain at least 6 characters.";

        valid = false;

    }


    if (!valid) {

        return;

    }


    alert("Login details are valid!");

});