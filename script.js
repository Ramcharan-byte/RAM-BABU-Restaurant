// ===============================
// RAM BABU Restaurant Script
// ===============================

const SERVER = "http://localhost:5000";

// -------------------------------
// Smooth Scroll
// -------------------------------
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});

// -------------------------------
// Reservation Form
// -------------------------------
const reservationForm = document.querySelector(".reservation form");

if (reservationForm) {

    reservationForm.addEventListener("submit", function (e) {

        e.preventDefault();

        alert("✅ Reservation Submitted Successfully!");

        reservationForm.reset();

    });

}

// -------------------------------
// Signup
// -------------------------------
const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const fullname = document.getElementById("fullname").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {

            const response = await fetch(`${SERVER}/signup`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    fullname,
                    email,
                    password
                })

            });

            const data = await response.json();

            alert(data.message);

            if (data.success) {
                window.location.href = "login.html";
            }

        }

        catch (err) {

            alert("Cannot connect to the server.");

        }

    });

}

// -------------------------------
// Login
// -------------------------------
const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {

            const response = await fetch(`${SERVER}/login`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                }),

                credentials: "include"

            });

            const data = await response.json();

            alert(data.message);

            if (data.success) {

                window.location.href = "index.html";

            }

        }

        catch (err) {

            alert("Cannot connect to the server.");

        }

    });

}

// -------------------------------
// Check Login
// -------------------------------
async function checkLogin() {

    try {

        const response = await fetch(`${SERVER}/check-login`, {

            credentials: "include"

        });

        const data = await response.json();

        const loginBtn = document.getElementById("loginBtn");
        const signupBtn = document.getElementById("signupBtn");
        const logoutBtn = document.getElementById("logoutBtn");

        if (data.loggedIn) {

            if (loginBtn) loginBtn.style.display = "none";
            if (signupBtn) signupBtn.style.display = "none";
            if (logoutBtn) logoutBtn.style.display = "inline-block";

        } else {

            if (loginBtn) loginBtn.style.display = "inline-block";
            if (signupBtn) signupBtn.style.display = "inline-block";
            if (logoutBtn) logoutBtn.style.display = "none";

        }

    }

    catch (err) {

        console.log(err);

    }

}

checkLogin();

// -------------------------------
// Logout
// -------------------------------
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async function () {

        await fetch(`${SERVER}/logout`, {

            credentials: "include"

        });

        location.reload();

    });

}

// -------------------------------
// Menu Hover Animation
// -------------------------------
document.querySelectorAll(".card").forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.transform = "scale(1.05)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "scale(1)";

    });

});

// -------------------------------
// Scroll To Top Button
// -------------------------------
const topBtn = document.createElement("button");

topBtn.innerHTML = "↑";

topBtn.style.position = "fixed";
topBtn.style.bottom = "20px";
topBtn.style.right = "20px";
topBtn.style.width = "50px";
topBtn.style.height = "50px";
topBtn.style.border = "none";
topBtn.style.borderRadius = "50%";
topBtn.style.background = "#8B0000";
topBtn.style.color = "#fff";
topBtn.style.fontSize = "22px";
topBtn.style.cursor = "pointer";
topBtn.style.display = "none";

document.body.appendChild(topBtn);

window.addEventListener("scroll", () => {

    if (window.scrollY > 300)
        topBtn.style.display = "block";
    else
        topBtn.style.display = "none";

});

topBtn.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});

console.log("RAM BABU Restaurant Loaded Successfully");