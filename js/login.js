document.getElementById("login_form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = document.getElementById("login_form");
    const formData = new FormData(form);
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
    const formDataJson = JSON.stringify(formDataObject);
    const response = await fetch("http://localhost:8080/login_form", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: formDataJson,
    });
    const data = await response.json();
    if (data.status == "failed"){
      document.getElementById("message").innerHTML = data.message;
    }
    else if (data.status == "success") {
      if (document.getElementById("remember-me").checked) {
        setCookie("userId", data.uid, 2);
        setCookie("username", data.user.username, 2);
      } else {
        setCookie("userId", data.uid, 0.1);
        setCookie("username", data.user.username, 0.1);
      }
      location.href = "index.html";
    }
  });
