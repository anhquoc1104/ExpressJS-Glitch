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

//Validate Register
let registerSubmit = document.querySelector("#registerSubmit");

registerSubmit.addEventListener("click", () => {
    let nameRegister = document.querySelector("#nameRegister").value;
    let emailRegister = document.querySelector("#emailRegister").value;
    let passwordRegister = document.querySelector("#passwordRegister").value;
    let passwordRegisterRetype = document.querySelector(
        "#passwordRegisterRetype"
    ).value;
    let regexEmail = /^([A-Z|a-z|0-9](.|_){0,1})+[A-Z|a-z|0-9]@([A-Z|a-z|0-9])+((\.){0,1}([A-Z|a-z|0-9])+){1,4}\.[a-z]{2,4}$/;

    //Check Field Empty
    if (
        !nameRegister ||
        !emailRegister ||
        !passwordRegister ||
        !passwordRegisterRetype
    ) {
        alert("Please fill in all fields!");
        return;
    }
    //Check Email Format
    if (!regexEmail.test(emailRegister)) {
        alert("Failed! Email is not format, ex: example@mail.com");
        return;
    }

    //Check Password As Same
    if (passwordRegister !== passwordRegisterRetype) {
        alert("Failed! Retype password not match");
        return;
    }

    document.formRegister.submit();
});

let loginSubmit = document.querySelector("#loginSubmit");
loginSubmit.addEventListener("click", () => {
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;

    //Check Field Empty
    if (!email || !password) {
        alert("Please fill in all fields!");
        return;
    }

    document.formLogin.submit();
});
