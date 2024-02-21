document.getElementById("register_form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = document.getElementById("register_form");
    const formData = new FormData(form);
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
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
