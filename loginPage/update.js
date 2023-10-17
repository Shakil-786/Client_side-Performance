document.addEventListener("DOMContentLoaded", function() {
    // Get form elements
    const emailInput = document.getElementById("email");
    const nextButton = document.getElementById("nextButton");
    const newPasswordInput = document.getElementById("newPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const updateButton = document.getElementById("updateButton");

    // Hide the password fields initially
    document.querySelector(".password-fields").style.display = "none";
    updateButton.style.display='none'
    // Event listener for the "Next" button click
    nextButton.addEventListener("click", function() {
        // Validate email (you can add more email validation logic)
        const email = emailInput.value;
        if (!isValidEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        // Show the password fields
        document.querySelector(".password-fields").style.display = "block";
        nextButton.style.display="none"
        updateButton.style.display='block'
    });

    // Event listener for the form submit
    updateButton.addEventListener("click", async(e)=> {
        e.preventDefault();

        // Get values of new password and confirmation password
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Check if the new password and confirmation password match
        if (newPassword !== confirmPassword) {
            alert("New password and confirmation password do not match.");
            return;
        }

        else{
             const email = emailInput.value;
    const password = newPasswordInput.value;

    // Define your password and username regex patterns
    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[a-zA-Z0-9]).{8,}$/;
    const usernameRegex = /^(?=.*[0-9])[a-zA-Z0-9]{6,}$/;

    if (!passwordRegex.test(password)) {
        alert("Password must be at least 8 characters and contain a special character.");
    } 
     else {
        const response = await fetch('http://localhost:3000/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        // Check if the response is successful or not
        if (response.ok) {
            document.getElementById('message').textContent = 'Password Updated';
        } else {
            document.getElementById('message').textContent = 'User Does Not Exist or an Error Occurred';
        }
    }
        }
    });

    // Function to validate email using a simple regex pattern
    function isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(email);
    }
});
