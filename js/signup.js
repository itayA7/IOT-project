document.getElementById("register_form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = document.getElementById("register_form");
    const formData = new FormData(form);
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });

    // Check password
    const password = formDataObject['password'];
    if (!isPasswordValid(password)) {
        document.getElementById("message").innerHTML = "Password must be at least 8 characters long and contain numbers, letters, and symbols.";
        return;
    }

    const formDataJson = JSON.stringify(formDataObject);
    const response = await fetch("http://localhost:8080/register_form", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json", // set the content type to JSON
      },
      body: formDataJson,
    });
    const data = await response.json();
    document.getElementById("message").innerHTML = data.message;
  });




  function isPasswordValid(password) {
    // Password must be at least 8 characters long
    if (password.length < 8) return false;

    // Check if the password contains at least one number
    if (!/\d/.test(password)) return false;

    // Check if the password contains at least one letter
    if (!/[a-zA-Z]/.test(password)) return false;

    // Check if the password contains at least one symbol
    if (!/[^a-zA-Z0-9]/.test(password)) return false;

    return true;
}