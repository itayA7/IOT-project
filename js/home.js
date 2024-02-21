window.onload = () => {
  const userId = getCookie("userId");
  if (userId) {
    const username=getCookie("username");
    document.getElementById("second_section").remove();
    document.getElementById("login_offer").innerHTML = `
    I can see that you have already logged in !  <a href="index.html" id="logout_button">click here</a> to logout`;
    document.getElementById("home-title").innerHTML="Welcome back "+username;
    document.getElementById("logout_button").addEventListener("click", () => {
      setCookie("userId", "", -1);
      setCookie("username", "", -1);
    });
  } else {
    document.getElementById("login_offer").innerHTML = `
    If you already have an account, <a href="login.html">click here</a> to login.`;
    document.getElementById("register_offer").innerHTML = `
    If you don't have an account yet, <a href="signup.html">click here</a> to register.`;
    document.getElementById("therapy-page-button").href="error.html";
  }
};


let image=document.getElementById("home-image");
let images=['img1.jpg','img2.jpg','img3.jpg'];
setInterval(()=>{
  let random=Math.floor(Math.random()*3);
  image.src="./img/"+images[random];
},4000);



