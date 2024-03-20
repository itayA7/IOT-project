//funtion that run when the page is loaded
window.onload = () => {
  const userId = getCookie("userId");//checking if userId cookie exsist in the document(which mean user has logged in)
  if (userId) {//the user exsist
    const username=getCookie("username");
    //document.getElementById("second_section").remove();
    //creating logout button
    document.getElementById("login_offer").innerHTML = `
    I can see that you have already logged in !  <a href="index.html" id="logout_button">click here</a> to logout`;
    document.getElementById("register_offer").innerHTML = `
    To See Your History, <a href="history.html">click here</a>`;
    document.getElementById("home-title").innerHTML="Welcome back "+username+"😊";
    //click event listener to the logout button that remvoe the user's cookies
    document.getElementById("logout_button").addEventListener("click", () => {
      setCookie("userId", "", -1);
      setCookie("username", "", -1);
    });
  } else {//there is no logged in user
    //suggest login or register to the user
    document.getElementById("login_offer").innerHTML = `
    If you already have an account, <a href="login.html">click here</a> to login.`;
    document.getElementById("register_offer").innerHTML = `
    If you don't have an account yet, <a href="signup.html">click here</a> to register.`;
    document.getElementById("therapy-page-button").href="error.html";
  }
};

//change image every 4 seconds
let image=document.getElementById("home-image");
let images=['img1.jpg','img2.jpg','img3.jpg'];
setInterval(()=>{
  let random=Math.floor(Math.random()*3);
  image.src="./img/"+images[random];
},4000);



