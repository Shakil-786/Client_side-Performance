window.history.replaceState({},'../loginPage/index.html')

document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[a-zA-Z0-9]).{8,}$/;
    const usernameRegex = /^(.{6,})$/;

    let errorMessage = "";

    if (!emailRegex.test(email)) {
        errorMessage = "Please enter a valid email address.";
    } else if (!passwordRegex.test(password)) {
        errorMessage = "Password must be at least 8 characters and contain a special character.";
    } else if (!usernameRegex.test(username)) {
        errorMessage = "Username must be at least 6 characters and contain a number.";
    }

    if (errorMessage) {
        // Display the error message
        document.getElementById("message").textContent = errorMessage;
    } else {
        try {
            const response = await fetch("http://localhost:3000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, username, password }),
            });

            if (response.status === 401) {
                const data = await response.json();
                throw new Error(data.error);
            }

            const data = await response.json();
            if (data.message) {
                document.getElementById("message").textContent = "Signup successful.";
            }
        } catch (error) {
            document.getElementById("message").textContent = error.message;
        }
    }
});

document.getElementById("login").addEventListener("click", () => {
    window.location.href = "../loginPage/login.html";
});