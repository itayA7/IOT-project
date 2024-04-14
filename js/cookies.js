//function that get the cookie from the web cache
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }
  
  //function that add cookie to the document. the function recive the cookie key name+ value+ how long the cookie will work
  function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;secure";
  }


  window.addEventListener('load',()=>{
    const userId = getCookie("userId");
    //אם המשתמש לא מחובר אז צריך להעביר אותו לדף השגיאה בזמן שהוא מנסה להיכנס לדף הטיפולים
    if (!userId) {
      document.getElementById("therapy-page-button").href="error.html";
    }
    //אם המשתמש מחובר אז יש להציג לו כפתור לדף ההיסטוריה שלו במקום כפתור ההתחברות
    else{
      document.getElementById("login-page-button").href="history.html";
      document.getElementById("login-page-button").innerHTML="History";
      const username=getCookie("username");
      document.getElementById("user-name").innerHTML=username;

    }
  });
  