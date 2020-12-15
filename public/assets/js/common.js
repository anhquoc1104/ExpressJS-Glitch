const themeCookieName = "theme";
const themeDark = "dark";
const themeLight = "light";

const body = document.getElementsByTagName("body")[0];

function setCookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

loadTheme();

function loadTheme() {
    let theme = getCookie(themeCookieName);
    body.classList.add(theme === "" ? themeLight : theme);
}

function switchTheme() {
    if (body.classList.contains(themeLight)) {
        body.classList.remove(themeLight);
        body.classList.add(themeDark);
        setCookie(themeCookieName, themeDark);
    } else {
        body.classList.remove(themeDark);
        body.classList.add(themeLight);
        setCookie(themeCookieName, themeLight);
    }
}

function collapseSidebar() {
    body.classList.toggle("sidebar-expand");
}

window.onclick = function(event) {
    openCloseDropdown(event);
};

function closeAllDropdown() {
    let dropdowns = document.getElementsByClassName("user-dropdown-expand");
    for (let i = 0; i < dropdowns.length; i++) {
        dropdowns[i].classList.remove("user-dropdown-expand");
    }
}

function openCloseDropdown(event) {
    if (!event.target.matches(".user-dropdown-toggle")) {
        //
        // Close dropdown when click out of dropdown menu
        //
        closeAllDropdown();
    } else {
        let toggle = event.target.dataset.toggle;
        let content = document.getElementById(toggle);
        if (content.classList.contains("user-dropdown-expand")) {
            closeAllDropdown();
        } else {
            closeAllDropdown();
            content.classList.add("user-dropdown-expand");
        }
    }
}

// Preview Image
function previewImage() {
    let inputFile = document.getElementById("inputFile");
    inputFile.addEventListener("change", function() {
        if (!this.files.length) return; // no file select
        let url = URL.createObjectURL(this.files[0]);
        let imgElem = document.getElementById("imgElem");
        imgElem.setAttribute("src", url);
    });

    //DOM
    // <input type="file" id="inputFile">
    // <p>preview</p>
    // <img id="imgElem" class="imgElem"></img>
}