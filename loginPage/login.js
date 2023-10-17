window.addEventListener('DOMContentLoaded', function () {
    // Disable the back button
    window.history.pushState(null, null, document.URL);
    window.addEventListener('popstate', function () {
        window.history.pushState(null, null,null, document.URL);
    });
    window.history.replaceState({}, '','');
    function clearLocalStorage() {
    localStorage.clear();
    console.log('localStorage cleared');
}

// Event listener for URL changes
window.addEventListener('popstate', function(event) {
    // Check the current URL
    const currentURL = window.location.href;

    // Define the URL you want to target
    const targetURL = 'http://127.0.0.1:5501/loginPage/login.html'; // Replace with your target URL

    // Check if the current URL matches the target URL
    if (currentURL === targetURL) {
        // Clear localStorage
        clearLocalStorage();
    }
});

});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Define your password and username regex patterns
    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[a-zA-Z0-9]).{8,}$/;
    const usernameRegex = /^(?=.*[0-9])[a-zA-Z0-9]{6,}$/;

    if (!passwordRegex.test(password)) {
        alert("Password must be at least 8 characters and contain a special character.");
    } else if (!usernameRegex.test(username)) {
        alert("Username must be at least 6 characters and contain a number.");
    } else {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            const token = data.token;
            localStorage.setItem('token', token);
            document.getElementById('message').textContent = 'Login successful. Token stored in local storage.';
            
            // Redirect to the main.html page or any other desired page
            window.location.href = '../commons/main.html';
        } else {
            document.getElementById('message').textContent = data.message;
        }
    }
});



