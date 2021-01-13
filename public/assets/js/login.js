//toggle password
let iconPassword = document.getElementById("tooglePassword");
const tooglePassword = () => {
    let password = document.getElementById("password");
    iconPassword.classList.toggle("fa-eye-slash");

    if (password.type === "password") {
        password.type = "type";
    } else {
        password.type = "password";
    }
};

iconPassword.addEventListener("click", tooglePassword);

let indicator = document.querySelector("#indicator");
let formLogin = document.querySelector("#form__login");
let formRegister = document.querySelector("#form__register");
const onLogin = () => {
    indicator.style.left = "0%";
    formLogin.style.display = "block";
    formRegister.style.display = "none";
    formLogin.style.transform = "translateX(0%)";
    formRegister.style.transform = "translateX(100%)";
};
const onRegister = () => {
    indicator.style.left = "50%";
    formLogin.style.display = "none";
    formRegister.style.display = "block";
    formLogin.style.transform = "translateX(-100%)";
    formRegister.style.transform = "translateX(0%)";
};
