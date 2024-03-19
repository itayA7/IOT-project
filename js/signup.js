document.getElementById("register_form").addEventListener("submit", async (event) => {//מחכה לשליחת הטופס על ידי המשתמש
    event.preventDefault();
    const form = document.getElementById("register_form");//get the form element
    const formData = new FormData(form);
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });//run on each value from the form Data. key=input name, value=user's value on specific input box

    // Check password
    const password = formDataObject['password'];//get the password input box from the form
    if (!isPasswordValid(password)) {//קריאה לפונקציה הבודקת האם הסיסמה עומדת בתנאי האתר
        document.getElementById("message").innerHTML = "Password must be at least 8 characters long and contain numbers, letters, and symbols.";
        return;//אם הסיסמה לא עומדת בתנאים אנחנו יוצאים מהפונקציה ולא ממשיכים בתהליך ההרשמה
    }

    const formDataJson = JSON.stringify(formDataObject);//המרת המילון שהכיל את תוכן הטופס לקובץ מסוג ג'יסון
    const response = await fetch("http://localhost:8080/register_form", {//sending register form to the Node JS server
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json", // set the content type to JSON
      },
      body: formDataJson,
    });
    const data = await response.json();
    document.getElementById("message").innerHTML = data.message; //show the respone message recived from the server
  });




  //function to check whether a password is usable according to website policy
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