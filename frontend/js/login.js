
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const togglePassword = document.getElementById("togglePassword");
    const rememberMe = document.getElementById("rememberMe");
    const submitButton = document.getElementById("loginSubmitButton");
    const loginMessage = document.getElementById("loginMessage");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    if (!loginForm) {
        console.error("CareCircle: loginForm was not found.");
        return;
    }

    const API_URL = `http://${window.location.hostname}:5000/api/auth`;

    // Validate the email address.
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            showFieldError(emailError, "Please enter your email address.");
            return false;
        }

        if (!emailPattern.test(email)) {
            showFieldError(emailError, "Please enter a valid email address.");
            return false;
        }

        clearFieldError(emailError);
        return true;
    }

    // Validate the password field.
    function validatePassword() {
        const password = passwordInput.value;

        if (!password) {
            showFieldError(passwordError, "Please enter your password.");
            return false;
        }

        clearFieldError(passwordError);
        return true;
    }

    function showFieldError(element, message) {
        if (!element) return;

        element.textContent = message;
        element.style.display = "block";
    }

    function clearFieldError(element) {
        if (!element) return;

        element.textContent = "";
        element.style.display = "none";
    }

    function showLoginMessage(message, type = "error") {
        if (!loginMessage) return;

        loginMessage.textContent = message;
        loginMessage.style.display = "block";

        // Reuse existing message styling where available.
        loginMessage.classList.remove(
            "success",
            "error",
            "info",
            "message-success",
            "message-error"
        );

        loginMessage.classList.add(type);
        loginMessage.setAttribute("role", "status");
        loginMessage.setAttribute("aria-live", "polite");
    }

    function clearLoginMessage() {
        if (!loginMessage) return;

        loginMessage.textContent = "";
        loginMessage.style.display = "none";
        loginMessage.classList.remove(
            "success",
            "error",
            "info",
            "message-success",
            "message-error"
        );
    }

    // Show or hide the password, if the existing button supports it.
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", () => {
            const isHidden = passwordInput.type === "password";

            passwordInput.type = isHidden ? "text" : "password";

            togglePassword.setAttribute(
                "aria-label",
                isHidden ? "Hide password" : "Show password"
            );
        });
    }

    // Clear field errors as the user corrects their input.
    if (emailInput) {
        emailInput.addEventListener("input", () => {
            clearFieldError(emailError);
            clearLoginMessage();
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener("input", () => {
            clearFieldError(passwordError);
            clearLoginMessage();
        });
    }

    // Submit credentials to the real backend.
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        clearLoginMessage();

        const emailIsValid = validateEmail();
        const passwordIsValid = validatePassword();

        if (!emailIsValid || !passwordIsValid) {
            showLoginMessage(
                "Please correct the highlighted fields.",
                "error"
            );
            return;
        }

        const originalButtonText = submitButton
            ? submitButton.textContent
            : "";

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Logging in...";
        }

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    email: emailInput.value.trim(),
                    password: passwordInput.value
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                showLoginMessage(
                    data.message || "Login failed. Please try again.",
                    "error"
                );
                return;
            }

            showLoginMessage(
                "Login successful! Redirecting...",
                "success"
            );

            const role = data.user?.role;

            // These pages are inside frontend/html/.
            const dashboardPages = {
                volunteer: "dashboard.html",
                elderly: "dashboard.html",
                family: "family-dashboard.html",
                "special-care": "dashboard.html"
            };

            const destination = dashboardPages[role];

            if (!destination) {
                showLoginMessage(
                    "Your account role is not recognized. Please contact support.",
                    "error"
                );
                return;
            }

            // Let the browser retain the session cookie.
            window.setTimeout(() => {
                window.location.href = destination;
            }, 500);

        } catch (error) {
            console.error("CareCircle login error:", error);

            showLoginMessage(
                "Cannot connect to the CareCircle server. Make sure your backend is running and try again.",
                "error"
            );
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        }
    });
});
