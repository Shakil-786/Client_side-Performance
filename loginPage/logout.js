document.addEventListener("DOMContentLoaded", function() {
    const dropdown = document.getElementById("dropdown");

    // Add an event listener to the dropdown to handle selection changes
    dropdown.addEventListener("change", async()=> {
        // Check if "Option 2" is selected
        if (dropdown.value === "option2") {
    localStorage.clear(); // clearing the localstorage
    console.log('cache clearing');
    // Send an AJAX request to the server to log the user out
    fetch("http://localhost:3000/logout", {
      method: "POST", // Use the appropriate HTTP method (GET or POST)
      credentials: "same-origin", // Include cookies if necessary
    })
      .then((response) => {
        if (response.redirected) {
          // Redirect to the URL provided by the server after logout
          window.location.replace(response.url)

        }
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
    }
    else if( dropdown.value==="option1"){
      console.log('update password');
      window.location.href='../loginPage/update.html'
    }
  });
});
